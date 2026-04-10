import express from 'express';
import * as aiController from '../controllers/aiController.js';
import { protect } from '../middlewares/authMiddleware.js';

const aiRouter = express.Router();

// Apply auth protection to all AI features
aiRouter.use(protect);

// Course Creation
aiRouter.post('/generate-roadmap', aiController.generateRoadmap);

// Learning / Chat
aiRouter.post('/lesson-tutor', aiController.lessonTutor);
aiRouter.post('/lesson-tutor/summary', aiController.lessonTutorSummary);

// Assessment
aiRouter.post('/quiz', aiController.generateQuiz);

export default aiRouter;