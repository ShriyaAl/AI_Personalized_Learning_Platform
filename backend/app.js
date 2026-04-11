import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

// Route Imports
import authRouter from './routes/auth.js';
import courseRouter from './routes/courseRoutes.js';
import learningRouter from './routes/learningRoutes.js';
import aiRouter from "./routes/ai.js";
import dashboardRouter from "./routes/dashboard.js";
import videoRouter from "./routes/video.js";
import testRouter from "./routes/testRoute.js";
import adminRouter from "./routes/adminRoutes.js"

import { supabase } from './db/supabase.js';

// Configuration
dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import cookieParser from 'cookie-parser';

// --- MIDDLEWARE ---
app.use(cookieParser()); 
app.use(cors({
  origin: process.env.VITE_CLIENT_URL || 'http://localhost:5173',
  credentials: true // Crucial for HttpOnly cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically (for PDF/Docx processing)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- MULTER CONFIG (File Uploads) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: multer.memoryStorage() });

// --- PUBLIC ROUTES ---
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Pinnacle Systems Online', timestamp: new Date() });
});

app.post("/api/upload", upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file provided" });

    const fileName = `${Date.now()}-${req.file.originalname}`;
    
    const { data, error } = await supabase.storage
      .from('materials') // Ensure this bucket exists in Supabase
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true
      });

    if (error) throw error;
    res.json({ filePath: data.path }); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// --- MOUNTED API ROUTERS ---

// 1. Auth & Sync (Login, Token Verification, Role Sync)
app.use('/api/auth', authRouter);
app.use('/api/ai', aiRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/videos', videoRouter);
app.use('/api/test', testRouter);

// 2. Courses (Management, Roadmaps, Modules)
app.use('/api/courses', courseRouter);

// 3. Learning (AI Explanations, Lessons, Streaks, Sessions)
app.use('/api/learning', learningRouter);

// 4. Admin (User Creation, Teacher Registry, System Control)
app.use('/api/admin', adminRouter);


// --- 404 HANDLER ---
app.use((req, res, next) => {
  res.status(404).json({ error: "Endpoint not found in Pinnacle Terminal" });
});

// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error('--- SERVER ERROR ---');
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    code: err.code || "SYSTEM_FAILURE"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
  -----------------------------------------
   🚀 PINNACLE BACKEND IS LIVE
   📡 Port: ${PORT}
   🔑 Environment: ${process.env.NODE_ENV || 'development'}
  -----------------------------------------
  `);
});

export default app;