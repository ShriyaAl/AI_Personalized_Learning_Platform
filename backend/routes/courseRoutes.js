import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import { getAllCourses, createCourse, getCourseRoadmap, getTeacherCourses, deleteCourse } from '../controllers/courseController.js';

const router = express.Router();

// All course routes require a valid login
router.use(protect);

// Students and Teachers can view courses
router.get('/', getAllCourses);

// Teachers can view their own courses
router.get('/teacher/:uid', requireRole('teacher'), getTeacherCourses);

// Students and Teachers can view course roadmaps
router.get('/:courseId/roadmap', getCourseRoadmap);

// ONLY Teachers can create courses
router.post('/', requireRole('teacher'), createCourse);

// ONLY Teachers can delete courses
router.delete('/:id', requireRole('teacher'), deleteCourse);

export default router;