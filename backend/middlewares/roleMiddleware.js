// middlewares/roleMiddleware.js
export const requireRole = (requiredRole) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userRole = req.user.role; // ← from custom claim!

  if (userRole !== requiredRole) {
    return res.status(403).json({ 
      error: `Forbidden: requires ${requiredRole} role (you have ${userRole})` 
    });
  }

  next();
};