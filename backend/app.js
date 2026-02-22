import express from 'express';
import cors from 'cors';
import TestRouter from './routes/testRoute.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { createClient } from '@supabase/supabase-js';

import { adminDb } from './db/firebaseAdmin.js';

dotenv.config();
const supabase = createClient(process.env.DATABASE_URL, process.env.DATABASE_KEY);

const app = express();

// Middleware
app.use(cookieParser()); 
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // 3. Allow cookies over CORS
app.use(express.json());

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


app.listen(3000, () => {
    console.log(`🚀 Backend is running on http://localhost:3000`);
});

export default app;