import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../db/supabase.js';
import { adminDb } from '../db/firebaseAdmin.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

import { config } from '../config/index.js'; // Ensure this import is at the top

import mammoth from 'mammoth';

// Helper for ESM and pdf-parse
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
const JSZip = require('jszip');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to try multiple model names — skips models that are unavailable OR rate-limited
async function generateWithFallback(genAI, prompt) {
  const modelsToTry = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-flash-latest",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-pro-latest",
    "gemini-pro",
  ];

  let lastError;
  for (const modelName of modelsToTry) {
    try {
      console.log(`🤖 Attempting AI call with model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      console.log(`✅ AI call succeeded with model: ${modelName}`);
      return result;
    } catch (err) {
      lastError = err;
      const isNotFound = err.status === 404 || err.message?.toLowerCase().includes('not found');
      const isQuota = err.status === 429 || err.message?.toLowerCase().includes('quota') || err.message?.toLowerCase().includes('rate');
      const isUnavailable = err.status === 503 || err.message?.toLowerCase().includes('unavailable');

      if (isNotFound || isQuota || isUnavailable || err.status >= 500) {
        console.warn(`⚠️ Model ${modelName} failed (${err.status || 'unknown status'}): ${err.message?.slice(0, 80)}. Trying next...`);
        continue;
      }
      console.error(`❌ Non-retryable error on model ${modelName}:`, err.message);
      throw err;
    }
  }
  throw lastError;
}

/**
 * Fetch a single lesson with module context
 */
export const getLesson = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("lessons")
      .select("*, modules(title, course_id)")
      .eq("id", req.params.id)
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * AI-Powered Personalization: Extracts text from files and explains it via Gemini
 */
export const generateAIExplanation = async (req, res) => {
  try {
    // 1. Fetch lesson and module details
    const { data: lesson, error } = await supabase
      .from("lessons")
      .select("*, modules(title)")
      .eq("id", req.params.id)
      .single();

    if (error) throw error;

    const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

    let extractedText = '';
    let source = 'ai_knowledge';

    // 2. Logic to extract text from uploads if a file exists
    if (lesson?.content_url) {
      // Adjust the path to where your Multer 'uploads' folder lives
      const filePath = path.join(__dirname, '..', 'uploads', lesson.content_url);
      
      if (fs.existsSync(filePath)) {
        const ext = path.extname(lesson.content_url).toLowerCase();

        if (ext === '.pdf') {
          const buffer = fs.readFileSync(filePath);
          const parsed = await pdf(buffer);
          extractedText = parsed.text.slice(0, 4000);
          source = 'pdf';
        } else if (ext === '.docx') {
          const result = await mammoth.extractRawText({ path: filePath });
          extractedText = result.value.slice(0, 4000);
          source = 'docx';
        } else if (ext === '.txt') {
          extractedText = fs.readFileSync(filePath, 'utf-8').slice(0, 4000);
          source = 'txt';
        } else if (ext === '.pptx') {
          const buffer = fs.readFileSync(filePath);
          const zip = await JSZip.loadAsync(buffer);
          const slideTexts = [];
          const slideFiles = Object.keys(zip.files)
            .filter(name => name.match(/ppt\/slides\/slide\d+\.xml/))
            .sort();
          for (const slideName of slideFiles) {
            const xmlContent = await zip.files[slideName].async('text');
            const textMatches = xmlContent.match(/<a:t[^>]*>(.*?)<\/a:t>/g) || [];
            const slideText = textMatches.map(t => t.replace(/<[^>]+>/g, '').trim()).filter(Boolean).join(' ');
            if (slideText) slideTexts.push(slideText);
          }
          extractedText = slideTexts.join('\n').slice(0, 4000);
          source = 'pptx';
        }
      }
    }

    // 3. Prompt Construction
    let learningAbilityContext = "";
    try {
      const statsPath = path.join(__dirname, '..', 'db', 'learning_stats.json');
      if (fs.existsSync(statsPath)) {
        const statsData = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
        const userStats = statsData[req.user.uid];
        if (userStats) {
          const { averageScore } = userStats;
          if (averageScore >= 80) {
            learningAbilityContext = `\nThe student has an advanced learning ability (${averageScore}/100). They grasp concepts quickly, so engage them with advanced vocabulary, deeper nuances, and challenging insights.`;
          } else if (averageScore < 50) {
            learningAbilityContext = `\nThe student has a developing learning ability (${averageScore}/100). They may struggle with complex topics, so use very simple analogies, avoid technical jargon, and break concepts down step-by-step.`;
          } else {
            learningAbilityContext = `\nThe student has an average learning ability (${averageScore}/100). Maintain a balanced, clear, and engaging tone.`;
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch learning stats from local file:", err);
    }

    const context = extractedText.trim() 
      ? `Based on this document content:\n\n${extractedText}` 
      : `You are generating a comprehensive, fundamental lesson about "${lesson.title}". This is part of the module "${lesson.modules?.title}" in a larger course. Please explain the core concepts of this topic in detail, as there is no specific textbook material provided.`;

    const prompt = `
      You are a friendly, expert personal tutor. Explain the following topic comprehensively:
      Topic: ${lesson.title}
      Module: ${lesson.modules?.title}
      ${learningAbilityContext}
      
      ${context}
      
      Guidelines:
      - Be detailed but clear (aim for 400-600 words).
      - Use a "Core Concept", "Breakdown", and "Real World Example" structure.
      - Do NOT use markdown headers (no # or ##).
      - Make it highly engaging for a student learning this for the first time.
    `;

    const result = await generateWithFallback(genAI, prompt);
    const aiContent = result.response.text();

    res.json({ 
      content: aiContent, 
      source, 
      lessonTitle: lesson.title,
      rawText: extractedText || aiContent
    });

  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ error: "Failed to generate AI content" });
  }
};

/**
 * AI-Powered Personalization: Make the content easier to read using Gemini
 */
export const simplifyContent = async (req, res) => {
  try {
    const { content, level } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Content is required for simplification" });
    }

    const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

    let persona = "a high school student";
    if (level === 1) persona = "a middle school student";
    if (level === 2) persona = "a 10-year-old child";
    if (level >= 3) persona = "a 5-year-old child using extremely simple words and short sentences with analogies";

    const prompt = `
      You are an expert at simplifying complex information.
      Please rewrite the following educational content to make it significantly easier to understand.
      Explain it as if you are talking to ${persona}.
      
      CONTENT TO SIMPLIFY:
      ${content}
      
      Guidelines:
      - Preserve the structure (e.g. "Core Concept", "Breakdown", "Real World Example") if possible, but make the wording much simpler.
      - Do NOT use markdown headers (no # or ##).
      - Use engaging analogies suited for ${persona}.
      - Keep it concise but clear.
    `;

    const result = await generateWithFallback(genAI, prompt);
    const simplifiedContent = result.response.text();

    res.json({ content: simplifiedContent });

  } catch (error) {
    console.error("AI Simplification Error:", error);
    res.status(500).json({ error: "Failed to simplify content" });
  }
};

/**
 * Firestore: Get User Gamification Data
 */
export const getUserStreaks = async (req, res) => {
  try {
    const userId = req.user.uid; // Secured by middleware
    const doc = await adminDb.collection("streaks").doc(userId).get();
    
    if (!doc.exists) {
      return res.json({ streakCount: 0, xp: 0, lightning: 0 });
    }
    
    res.json(doc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Firestore: Handle AI Tutor Chat Sessions
 */
export const createChatSession = async (req, res) => {
  try {
    const { courseId, title } = req.body;
    const userId = req.user.uid;

    const sessionData = {
      userId,
      courseId,
      title: title || "New Learning Session",
      status: "active",
      startedAt: new Date()
    };

    const docRef = await adminDb.collection("sessions").add(sessionData);
    res.json({ id: docRef.id, ...sessionData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Supabase: Get User Profile
 */
export const getUserProfile = async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("uid", req.user.uid)
        .single();
      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

/**
 * Local JSON: Update User Learning Ability Score
 */
export const updateLearningAbility = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { score } = req.body;

    if (typeof score !== 'number') {
       return res.status(400).json({ error: "Score is required and must be a number" });
    }

    const statsPath = path.join(__dirname, '..', 'db', 'learning_stats.json');
    let allStats = {};
    
    if (fs.existsSync(statsPath)) {
      allStats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
    }

    const userStats = allStats[userId] || { cumulativeScore: 0, modulesCompleted: 0 };
    
    userStats.cumulativeScore += score;
    userStats.modulesCompleted += 1;
    userStats.averageScore = Math.round(userStats.cumulativeScore / userStats.modulesCompleted);
    userStats.lastUpdated = new Date().toISOString();

    allStats[userId] = userStats;

    fs.writeFileSync(statsPath, JSON.stringify(allStats, null, 2), 'utf8');

    res.json({ averageScore: userStats.averageScore, modulesCompleted: userStats.modulesCompleted });
  } catch (error) {
    console.error("Error updating learning ability:", error);
    res.status(500).json({ error: error.message });
  }
};