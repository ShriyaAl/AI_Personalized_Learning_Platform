import express from 'express';
import cors from 'cors';
import TestRouter from './routes/testRoute.js';
import dotenv from 'dotenv';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

import mammoth from 'mammoth';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { createClient } from '@supabase/supabase-js';

import { adminDb } from './db/firebaseAdmin.js';

import authRouter from "./routes/auth.js";
import aiRouter from "./routes/ai.js";
import dashboardRouter from "./routes/dashboard.js";

dotenv.config();
const supabase = createClient(process.env.DATABASE_URL, process.env.DATABASE_KEY);

const app = express();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    cb(null, fileName)
  }
})
const upload = multer({ storage: storage });

// Middleware
app.use(cookieParser()); 
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // 3. Allow cookies over CORS
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// 1. Mount the router
// This means every route inside testRoute.js will now start with /api/test
app.use('/api/test', TestRouter);

app.get('/', (req, res) => {
    res.send("Backend set up");
});

// --- SUPABASE API ROUTES ---

// Get all courses
app.get("/api/courses", async (req, res) => {
  try {
    const { data, error } = await supabase.from("courses").select("*");
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get courses by teacher
app.get("/api/courses/teacher/:uid", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("teacher_id", req.params.uid);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new course
app.post("/api/courses", async (req, res) => {
  try {
    const { title, subject, description, teacher_id, roadmap } = req.body;
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .insert([
        { title, subject, description, teacher_id, is_published: true }
      ])
      .select();
    
    if (courseError) throw courseError;
    const courseId = courseData[0].id;

    // Insert roadmap modules and lessons if generated
    if (roadmap && Array.isArray(roadmap)) {
      for (let i = 0; i < roadmap.length; i++) {
        const moduleItem = roadmap[i];
        const { data: moduleData, error: moduleError } = await supabase
          .from("modules")
          .insert([{ 
            course_id: courseId, 
            title: moduleItem.title, 
            order_index: i,
            is_locked: i === 0 ? false : true
          }])
          .select();
          
        if (moduleError) throw moduleError;
        const moduleId = moduleData[0].id;

        if (moduleItem.lessons && Array.isArray(moduleItem.lessons)) {
          const lessonsToInsert = moduleItem.lessons.map((lesson, j) => ({
            module_id: moduleId,
            title: lesson.title,
            type: lesson.type || 'doc',
            content_url: lesson.content_url || null,
            order_index: j
          }));
          
          if (lessonsToInsert.length > 0) {
            const { error: lessonError } = await supabase
              .from("lessons")
              .insert(lessonsToInsert);
            if (lessonError) throw lessonError;
          }
        }
      }
    }

    res.json(courseData[0]);
  } catch (error) {
    console.error("Course creation failed:", error);
    res.status(500).json({ error: error.message });
  }
});

// Proxy Upload to Local Storage (Fallback from Supabase)
app.post("/api/upload", upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    // Multer handled the save to /uploads already
    res.json({ filePath: req.file.filename });
  } catch (error) {
    console.error("Backend upload failed:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a course
app.delete("/api/courses/:id", async (req, res) => {
  try {
    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Course deletion failed:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get single lesson
app.get("/api/lessons/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("lessons")
      .select("*, modules(title, course_id)")
      .eq("id", req.params.id)
      .single();
      
    if (error) {
      console.error("Supabase fetch error for lesson:", error);
      throw error;
    }
    console.log("Fetched lesson data:", data);
    res.json(data);
  } catch (error) {
    console.error("Fetch lesson failed:", error);
    res.status(500).json({ error: error.message });
  }
});

// Generate personalized lesson content from uploaded file (or from title if no file)
app.get("/api/lessons/:id/personalized-content", async (req, res) => {
  try {
    // 1. Fetch lesson to get content_url
    const { data: lesson, error } = await supabase
      .from("lessons")
      .select("*, modules(title)")
      .eq("id", req.params.id)
      .single();

    if (error) throw error;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let extractedText = '';
    let source = 'title_only';

    // 2. Try to extract text from attached file
    if (lesson?.content_url) {
      const filePath = path.join(__dirname, 'uploads', lesson.content_url);
      
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
          const JSZip = require('jszip');
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
        } else if (ext === '.ppt') {
          extractedText = `PowerPoint presentation: "${lesson.title}" from module "${lesson.modules?.title || 'course'}".`;
          source = 'ppt_fallback';
        }
      }
    }

    console.log(`📚 Content generation [${lesson?.title}]: source=${source}, text_length=${extractedText.length}`);

    // 3. Build the AI prompt — use extracted text if available, else use lesson title/module
    const promptContent = extractedText.trim()
      ? `Extracted Document Text:\n${extractedText}`
      : `Lesson Title: ${lesson?.title}\nModule: ${lesson?.modules?.title || 'Course Module'}\n\nNote: No document was attached. Generate a comprehensive explanation of this topic from your knowledge.`;

    const prompt = `You are a personalized learning assistant. Generate a clear, engaging and concise lesson explanation for a student.

Lesson Title: ${lesson?.title}
Module: ${lesson?.modules?.title || 'Course Module'}

${promptContent}

Guidelines:
- Summarize the key concepts in 2-3 paragraphs.
- Use simple language, analogies, and real-world examples where applicable.
- Structure it with a "Core Idea", "How It Works" and "Real World Example" section.
- Keep it under 400 words.
- Do NOT use markdown headers (##, **, etc). Use plain text only.
- Make it feel like a personal tutor is explaining it directly to the student.`;

    const result = await model.generateContent(prompt);
    const aiContent = result.response.text();

    res.json({ content: aiContent, rawText: extractedText || lesson?.title, lessonTitle: lesson?.title, source });
  } catch (error) {
    console.error("Personalized content generation failed:", error);
    res.json({ content: null, rawText: null, reason: "ai_error", error: error.message });
  }
});

// Get course roadmap
app.get("/api/courses/:courseId/roadmap", async (req, res) => {
  try {
    const { data: modules, error: modError } = await supabase
      .from("modules")
      .select("*")
      .eq("course_id", req.params.courseId)
      .order("order_index", { ascending: true });
      
    if (modError) throw modError;
    if (!modules || modules.length === 0) return res.json([]);

    const moduleIds = modules.map(m => m.id);
    const { data: lessons, error: lessError } = await supabase
      .from("lessons")
      .select("*")
      .in("module_id", moduleIds)
      .order("order_index", { ascending: true });
      
    if (lessError) throw lessError;

    const roadmap = modules.map(m => ({
      ...m,
      lessons: lessons.filter(l => l.module_id === m.id)
    }));

    res.json(roadmap);
  } catch (error) {
    console.error("Failed to fetch roadmap:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get user profile (Supabase + Firebase Auth UID)
app.get("/api/users/:uid", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("uid", req.params.uid)
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- FIRESTORE API ROUTES ---

// Get User Streaks
app.get("/api/streaks/:userId", async (req, res) => {
  try {
    const doc = await adminDb.collection("streaks").doc(req.params.userId).get();
    if (!doc.exists) return res.json({ streakCount: 0, xp: 0, lightning: 0 });
    res.json(doc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create AI Tutor Session
app.post("/api/sessions", async (req, res) => {
  try {
    const sessionData = {
      userId: req.body.userId,
      courseId: req.body.courseId,
      title: req.body.title || "New Session",
      status: "active",
      startedAt: new Date()
    };
    const docRef = await adminDb.collection("sessions").add(sessionData);
    res.json({ id: docRef.id, ...sessionData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/api/auth', authRouter);
app.use('/api/ai', aiRouter);
app.use('/api/dashboard', dashboardRouter);

// Ensure storage bucket exists
const ensureBucket = async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets.find(b => b.name === 'course-materials')) {
      await supabase.storage.createBucket('course-materials', { public: true });
      console.log("✅ Created 'course-materials' bucket");
    }
  } catch (err) {
    console.warn("Could not ensure bucket exists (ignore if already created):", err.message);
  }
};
ensureBucket();

app.listen(3000, () => {
    console.log(`🚀 Backend is running on http://localhost:3000`);
});

export default app;