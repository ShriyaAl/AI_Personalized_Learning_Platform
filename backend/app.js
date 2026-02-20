import express from 'express';
import cors from 'cors';
import TestRouter from './routes/testRoute.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { createClient } from '@supabase/supabase-js';

dotenv.config();
const supabase = createClient(process.env.DATABASE_URL,process.env.DATABASE_KEY);

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

// Get all articles

app.get("/articles", async (_, response) => {
  try {
    const { data, error } = await supabase.from("Posts").select();
    console.log(data);
    return response.send(data);
  } catch (error) {
    return response.send({ error });
  }
});


app.listen(3000, () => {
    console.log(`🚀 Backend is running on http://localhost:3000`);
});

export default app;