import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import { getAllCourses, getTeacherCourses, createCourse } from '../controllers/courseController.js';
import { getCourseRoadmap } from '../controllers/courseController.js';

const router = express.Router();

// All course routes require a valid login
router.use(protect);

// Students and Teachers can view courses
router.get('/', getAllCourses);

router.get('/teacher/:uid', getTeacherCourses);

// ONLY Teachers can create courses
router.post('/', requireRole('teacher'), createCourse);

router.get('/:courseId/roadmap', protect, getCourseRoadmap);

// Route to get the full nested roadmap (Modules + Lessons)
router.get('/:courseId/roadmap', protect, getCourseRoadmap);

export default router;