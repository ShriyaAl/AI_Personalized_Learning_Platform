import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../db/supabase.js';
import { adminDb } from '../db/firebaseAdmin.js';
import { createRequire } from 'module';
import mammoth from 'mammoth';
import 'dotenv/config';

// Helper for ESM to use CommonJS modules
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
const JSZip = require('jszip');

/**
 * UTILITY: Internal function to extract text from Supabase Storage
 * This fixes the "extractTextFromStorage is not defined" error.
 */
const extractTextFromStorage = async (filePath, ext) => {
  try {
    const { data, error } = await supabase.storage
      .from('materials') // Matches your bucket name
      .download(filePath);

    if (error) throw new Error(`Storage download failed: ${error.message}`);
    const buffer = Buffer.from(await data.arrayBuffer());

    if (ext === '.pdf') {
      const parsed = await pdf(buffer);
      // Clean up garbled text from PDF layout
      return parsed.text
        .replace(/(\w)-\n(\w)/g, '$1$2')
        .replace(/(\S)\n(\S)/g, '$1 $2')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]{2,}/g, ' ')
        .trim();
    }
    
    if (ext === '.docx') {
      const result = await mammoth.extractRawText({ buffer });
      return result.value.trim();
    }
    
    if (ext === '.txt') {
      return buffer.toString('utf-8').trim();
    }

    return '';
  } catch (err) {
    console.error("Extraction Error:", err.message);
    return ''; 
  }
};

/**
 * GET: Fetch a single lesson with module context
 */
export const getLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("lessons")
      .select("*, modules(title)")
      .eq("id", id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * PATCH: Update Lesson Content (For the Manual Save button)
 */
export const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const { error } = await supabase
      .from("lessons")
      .update({ content })
      .eq("id", id);

    if (error) throw error;
    res.json({ message: "Lesson synced to database! 🚀" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET: Generate/Regenerate AI Explanation
 */
export const generateAIExplanation = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Fetch Lesson & Module Metadata
    const { data: lesson, error } = await supabase
      .from("lessons")
      .select("*, modules(title)")
      .eq("id", id)
      .single();

    if (error || !lesson) return res.status(404).json({ error: "Lesson not found" });

    // 2. Setup Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let extractedText = '';
    let source = 'ai_knowledge';

    // 3. Extract text from the Supabase bucket file
    if (lesson.content_url) {
      const ext = `.${lesson.content_url.split('.').pop()}`.toLowerCase();
      extractedText = await extractTextFromStorage(lesson.content_url, ext);
      if (extractedText) source = ext.replace('.', '');
    }

    // 4. Prompt Construction
    const contextSnippet = extractedText.trim() 
      ? `Based on this document content: \n---\n${extractedText.slice(0, 5500)}\n---` 
      : `Based on your general knowledge about ${lesson.title}`;

    const prompt = `
      Act as an expert personal tutor. Explain the following topic:
      Topic: ${lesson.title}
      Module: ${lesson.modules?.title}
      
      ${contextSnippet}
      
      Guidelines:
      - Be concise (max 400 words).
      - Structure: "Core Concept", "The Breakdown", and "Real World Example".
      - Do NOT use markdown headers (no # or ##).
      - Use plain text formatting with bolding (**text**) for emphasis.
      - If the context appears fragmented, logically reconstruct the explanation.
    `;

    // 5. Generate Content
    const result = await model.generateContent(prompt);
    const aiContent = result.response.text();

    // 6. Persistence: Save back to Supabase
    const { error: updateError } = await supabase
      .from("lessons")
      .update({ content: aiContent }) 
      .eq("id", id);

    if (updateError) throw updateError;

    // 7. Final Response
    res.json({ 
      content: aiContent, 
      source, 
      lessonTitle: lesson.title 
    });

  } catch (error) {
    console.error("--- AI Generation Error ---", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET: Get User Gamification Data
 */
export const getUserStreaks = async (req, res) => {
  try {
    const userId = req.user.uid;
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
 * POST: Handle AI Tutor Chat Sessions
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
 * GET: Get User Profile
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