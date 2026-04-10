import express from 'express';
import * as learningController from '../controllers/learningController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.get('/lesson/:id', learningController.getLesson);
router.get('/generate-explanation/:id', learningController.generateAIExplanation);
router.patch('/lesson/:id', learningController.updateLesson); 

router.get('/streaks', learningController.getUserStreaks);
router.get('/profile', learningController.getUserProfile);
router.post('/sessions', learningController.createChatSession);

export default router;