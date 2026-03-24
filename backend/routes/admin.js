import express from 'express';
import { protect } from '../middlewares/authMiddleware.js'; // <-- ADD THIS
import { requireRole } from '../middlewares/roleMiddleware.js';
import { adminAuth } from '../db/firebaseAdmin.js';
import { supabaseAdmin } from '../db/supabase.js';

const router = express.Router();

/**
 * @route   POST /api/admin/create-user
 * @desc    Admin creates a Teacher or Student and sets their role claim
 * @access  Private (Admin Only)
 */
router.post('/create-user', protect, requireRole('admin'), async (req, res, next) => {
  const { email, password, role, name, dept } = req.body;

  try {
    // 1. Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // 2. Set the Custom Claim for Role-Based Access Control (RBAC)
    await adminAuth.setCustomUserClaims(userRecord.uid, { role });

    // 3. Sync to Supabase immediately (Best practice so they exist in DB before first login)
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .insert({
        uid: userRecord.uid,
        name: name,
        email: email,
        role: role,
        dept: dept || null,
        join_date: new Date().toISOString(),
      });

    if (dbError) throw dbError;

    res.status(201).json({ 
      message: `Successfully created ${role}: ${email}`,
      uid: userRecord.uid 
    });

  } catch (error) {
    // Pass to your global errorHandler.js
    next(error);
  }
});

export default router;