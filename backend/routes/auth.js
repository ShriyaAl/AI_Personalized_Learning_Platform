// routes/auth.js
import express from 'express';
import { adminAuth } from '../db/firebaseAdmin.js';
import { createClient } from '@supabase/supabase-js';

const authRouter = express.Router();

const supabase = createClient(
  process.env.DATABASE_URL,
  process.env.DATABASE_KEY 
);

authRouter.post('/sync-user', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    // 1. Verify Token
    const decoded = await adminAuth.verifyIdToken(idToken);
    const { uid, email, name, picture: avatar_url } = decoded;

    // 2. Fetch Latest Claims
    const userRecord = await adminAuth.getUser(uid);
    const currentClaims = userRecord.customClaims || {};
    
    let role = currentClaims.role; 

    // 3. Sync with Supabase
    let { data: existingUser } = await supabase
      .from('users')
      .select('role')
      .eq('uid', uid)
      .single();

    if (!existingUser) {
      role = role || 'student'; 
      await supabase.from('users').insert({
        uid,
        name: name || email.split('@')[0],
        email,
        role,
        avatar_url,
        join_date: new Date().toISOString(),
      });
    } else {
      if (role && role !== existingUser.role) {
        await supabase.from('users').update({ role }).eq('uid', uid);
      } else {
        role = existingUser.role;
      }
    }

    if (currentClaims.role !== role) {
      await adminAuth.setCustomUserClaims(uid, { ...currentClaims, role });
    }

    // --- THIS IS THE PART YOU WERE MISSING ---
    // This physically puts the "badge" in the browser's pocket
    res.cookie('token', idToken, {
      httpOnly: true,     // Security: JS cannot read this
      secure: false,      // Set to FALSE for localhost/HTTP
      sameSite: 'lax',    // Required for cross-port requests (5173 to 3000)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',          // Available for all API routes
    });
    // -----------------------------------------

    // Send the final response
    res.status(200).json({ message: 'User synced and cookie set', role });

  } catch (err) {
    console.error("Sync Error:", err);
    res.status(500).json({ error: 'Sync failed' });
  }
});

export default authRouter;