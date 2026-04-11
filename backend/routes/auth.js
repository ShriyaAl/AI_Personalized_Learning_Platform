import express from 'express';
import * as authController from '../controllers/authController.js';

const authRouter = express.Router();

// Logic moved to controller
authRouter.post('/sync-user', authController.syncUser);
authRouter.post('/logout', authController.logout);

export default authRouter;