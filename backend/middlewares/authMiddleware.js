import { adminAuth } from "../db/firebaseAdmin.js";

export const protect = async (req, res, next) => {
  const idToken = req.cookies.token; 

  if (!idToken) {
    return res.status(401).json({ error: 'Unauthorized: No cookie found' });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};