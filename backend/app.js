import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/index.js';

// Routes
import authRouter from './routes/auth.js';
import courseRouter from './routes/courseRoutes.js';
import sessionRouter from './routes/sessionRoutes.js'; // create similar to courseRoutes
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json());

// Routes Mounting
app.use('/api/auth', authRouter);
app.use('/api/courses', courseRouter);
app.use('/api/sessions', sessionRouter);

app.get('/', (req, res) => res.send("Learning Platform API Running"));

// Error Handler - MUST be after routes
app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`🚀 Server on http://localhost:${config.port}`);
});