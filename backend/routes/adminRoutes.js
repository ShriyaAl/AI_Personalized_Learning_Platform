import express from 'express';
import { createUser, getUsers } from '../controllers/adminController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const adminRouter = express.Router();

// All admin routes are protected and restricted to 'admin' role
adminRouter.use(protect);
adminRouter.use(requireRole('admin'));

adminRouter.get('/users', getUsers);
adminRouter.post('/create-user', createUser);

export default adminRouter;