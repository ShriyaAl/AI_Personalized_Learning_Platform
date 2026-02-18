import express from 'express';
import cors from 'cors';
import TestRouter from './routes/testRoute.js';
import cookieParser from 'cookie-parser';

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

app.listen(3000, () => {
    console.log(`🚀 Backend is running on http://localhost:3000`);
});

export default app;