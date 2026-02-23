// routes/auth.js
import express from 'express';
import { adminAuth } from '../db/firebaseAdmin.js';
import { createClient } from '@supabase/supabase-js';

const authRouter = express.Router();

const supabase = createClient(
  process.env.DATABASE_URL,
  process.env.DATABASE_SERVICE_ROLE_KEY 
);


authRouter.post('/sync-user', async (req, res) => {
  const { idToken } = req.body;  

  if (!idToken) {
    return res.status(400).json({ error: 'No idToken provided' });
  }

  try {
    // 1. Verify token (also gets basic user info)
    const decoded = await adminAuth.verifyIdToken(idToken);
    const { uid, email, name, picture: avatar_url } = decoded;

    // 2. Check if user already exists in Supabase
    let { data: existingUser, error } = await supabase
      .from('users')
      .select('role')
      .eq('uid', uid)
      .single();

    let role = 'student'; // default

    if (existingUser) {
      // Already exists → use existing role
      role = existingUser.role;
    } else {
      // New user → insert into Supabase with default role
      ({ data: existingUser, error } = await supabase
        .from('users')
        .insert({
          uid,
          name: name || email.split('@')[0],
          email,
          role,
          avatar_url,
          dept: null,           // or from request body if needed
          join_date: new Date().toISOString(),
        })
        .select('role')
        .single());

      if (error) throw error;
    }

    // 3. If role is not yet in custom claims → set it
    const currentClaims = decoded.customClaims || {};
    if (currentClaims.role !== role) {
      await adminAuth.setCustomUserClaims(uid, { ...currentClaims, role });
      console.log(`Set role claim → ${role} for ${uid}`);
    }

    res.status(200).json({
      message: 'User synced',
      role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sync failed' });
  }
});

export default authRouter;