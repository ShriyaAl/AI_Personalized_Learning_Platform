import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { 
  getLesson, 
  generateAIExplanation, 
  simplifyContent,
  getUserStreaks, 
  createChatSession,
  getUserProfile,
  updateLearningAbility
} from '../controllers/learningController.js';

const router = express.Router();

router.use(protect); // All learning routes require authentication

router.get('/lessons/:id', getLesson);
router.get('/lessons/:id/explain', generateAIExplanation);
router.post('/lessons/:id/simplify', simplifyContent);
router.post('/ability', updateLearningAbility);
router.get('/streaks', getUserStreaks);
router.get('/profile', getUserProfile);
router.post('/sessions', createChatSession);

export default router;