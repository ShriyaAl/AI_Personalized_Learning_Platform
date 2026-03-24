import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { 
  getStreaks, 
  createAiSession 
} from '../controllers/sessionController.js';
// import { chatWithGemini } from '../controllers/aiController.js'; // Once you build it!

const router = express.Router();

/**
 * @route   GET /api/sessions/streaks/:userId
 * @desc    Get user learning streaks and XP from Firestore
 * @access  Private
 */
router.get('/streaks/:userId', protect, getStreaks);

/**
 * @route   POST /api/sessions/create
 * @desc    Initialize a new AI tutoring session
 * @access  Private
 */
router.post('/create', protect, createAiSession);

/**
 * @route   POST /api/sessions/chat
 * @desc    Send a message to Gemini with course context
 * @access  Private
 */
// router.post('/chat', protect, chatWithGemini);

export default router;