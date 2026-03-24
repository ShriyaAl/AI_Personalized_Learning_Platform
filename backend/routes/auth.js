// routes/auth.js
import express from 'express';
import { adminAuth } from '../db/firebaseAdmin.js';
import { createClient } from '@supabase/supabase-js';

const authRouter = express.Router();

const supabase = createClient(
  process.env.DATABASE_URL,
  process.env.DATABASE_SERVICE_ROLE_KEY 
);


// authRouter.post('/sync-user', async (req, res) => {
//   const { idToken } = req.body;  

//   if (!idToken) {
//     return res.status(400).json({ error: 'No idToken provided' });
//   }

//   try {
//     // 1. Verify token (also gets basic user info)
//     const decoded = await adminAuth.verifyIdToken(idToken);
//     const { uid, email, name, picture: avatar_url } = decoded;

//     // 2. Check if user already exists in Supabase
//     let { data: existingUser, error } = await supabase
//       .from('users')
//       .select('role')
//       .eq('uid', uid)
//       .single();

//     let role = 'student'; // default

//     if (existingUser) {
//       // Already exists → use existing role
//       role = existingUser.role;
//     } else {
//       // New user → insert into Supabase with default role
//       ({ data: existingUser, error } = await supabase
//         .from('users')
//         .insert({
//           uid,
//           name: name || email.split('@')[0],
//           email,
//           role,
//           avatar_url,
//           dept: null,           // or from request body if needed
//           join_date: new Date().toISOString(),
//         })
//         .select('role')
//         .single());

//       if (error) throw error;
//     }

//     // 3. If role is not yet in custom claims → set it
//     const currentClaims = decoded.customClaims || {};
//     if (currentClaims.role !== role) {
//       await adminAuth.setCustomUserClaims(uid, { ...currentClaims, role });
//       console.log(`Set role claim → ${role} for ${uid}`);
//     }

//     res.status(200).json({
//       message: 'User synced',
//       role,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Sync failed' });
//   }
// });

authRouter.post('/sync-user', async (req, res) => {
  try {
    const { idToken } = req.body;
    const decoded = await adminAuth.verifyIdToken(idToken);
    const { uid, email, name, picture: avatar_url } = decoded;

    // 1. Check EXISTING Firebase Claims first
    // This respects the 'promoteAdmin.js' script result
    const userRecord = await adminAuth.getUser(uid);
    const currentClaims = userRecord.customClaims || {};
    
    // 2. Determine the role (Priority: Firebase Claim > Supabase > Default)
    let role = currentClaims.role; 

    // 3. Sync with Supabase
    let { data: existingUser } = await supabase
      .from('users')
      .select('role')
      .eq('uid', uid)
      .single();

    if (!existingUser) {
      // New User: Use 'student' unless a claim already exists
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
      // Existing User: If claims and DB disagree, trust the Claims 
      // (This allows your promote script to work!)
      if (role && role !== existingUser.role) {
        await supabase.from('users').update({ role }).eq('uid', uid);
      } else {
        role = existingUser.role;
      }
    }

    // 4. Final Sync back to Firebase (Safety check)
    if (currentClaims.role !== role) {
      await adminAuth.setCustomUserClaims(uid, { ...currentClaims, role });
    }

    res.status(200).json({ message: 'User synced', role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sync failed' });
  }
});

export default authRouter;