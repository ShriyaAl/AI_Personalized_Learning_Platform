import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../db/supabase.js';
import { adminDb } from '../db/firebaseAdmin.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

import { config } from '../config/index.js'; // Ensure this import is at the top

// Helper for ESM and pdf-parse
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
const JSZip = require('jszip');
import mammoth from 'mammoth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
    const context = extractedText.trim() 
      ? `Based on this document content: ${extractedText}` 
      : `Based on your general knowledge about ${lesson.title}`;

    const prompt = `
      You are a friendly, expert personal tutor. Explain the following topic:
      Topic: ${lesson.title}
      Module: ${lesson.modules?.title}
      
      ${context}
      
      Guidelines:
      - Be concise (max 400 words).
      - Use a "Core Concept", "Breakdown", and "Real World Example" structure.
      - Do NOT use markdown headers (no # or ##).
      - Make it engaging for a student.
    `;

    const result = await model.generateContent(prompt);
    const aiContent = result.response.text();

    res.json({ 
      content: aiContent, 
      source, 
      lessonTitle: lesson.title 
    });

  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ error: "Failed to generate AI content" });
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