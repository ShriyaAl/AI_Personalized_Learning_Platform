import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import { getAllCourses, createCourse } from '../controllers/courseController.js';

const router = express.Router();

// All course routes require a valid login
router.use(protect);

// Students and Teachers can view courses
router.get('/', getAllCourses);

// ONLY Teachers can create courses
router.post('/', requireRole('teacher'), createCourse);

export default router;