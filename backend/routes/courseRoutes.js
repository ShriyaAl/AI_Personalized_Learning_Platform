import express from 'express';
import { getAllCourses, getUserProfile } from '../controllers/courseController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.get('/', protect, getAllCourses);
router.get('/:uid', protect, getUserProfile);

export default router;