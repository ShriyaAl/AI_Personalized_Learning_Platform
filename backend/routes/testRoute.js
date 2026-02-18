import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';

const TestRouter = express.Router();

// This route only works if the token is VALID
TestRouter.get('/verify-me', protect, (req, res) => {
  res.json({
    status: "Authenticated",
    message: "Firebase Admin successfully verified your token!",
    decodedUser: {
      uid: req.user.uid,
      email: req.user.email,
      name: req.user.name || "No name in token",
      auth_time: new Date(req.user.auth_time * 1000).toLocaleString()
    }
  });
});

export default TestRouter;