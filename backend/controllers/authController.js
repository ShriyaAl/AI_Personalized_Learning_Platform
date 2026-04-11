import { adminAuth } from '../db/firebaseAdmin.js';
import { supabase } from '../db/supabase.js'; // Using your existing shared supabase client

export const syncUser = async (req, res) => {
  try {
    const { idToken } = req.body;
    
    // 1. Verify Token
    const decoded = await adminAuth.verifyIdToken(idToken);
    const { uid, email, name, picture: avatar_url } = decoded;

    // 2. Fetch Latest Claims from Firebase
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
      // New User: Default to student if no claim exists
      role = role || 'student'; 
      const { error: insertError } = await supabase.from('users').insert({
        uid,
        full_name: name || email.split('@')[0], // Using full_name to match admin registry
        email,
        role,
        avatar_url,
        created_at: new Date().toISOString(),
      });
      if (insertError) throw insertError;
    } else {
      // Existing User: Update Firebase claims if they mismatch Supabase
      if (role && role !== existingUser.role) {
        await supabase.from('users').update({ role }).eq('uid', uid);
      } else {
        role = existingUser.role;
      }
    }

    // Ensure Firebase Custom Claims match the Database Role
    if (currentClaims.role !== role) {
      await adminAuth.setCustomUserClaims(uid, { ...currentClaims, role });
    }

    // 4. Set the HttpOnly Cookie
    res.cookie('token', idToken, {
      httpOnly: true,
      secure: false,      // false for localhost
      sameSite: 'lax',    // allows cookies across different ports
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      path: '/',          
    });

    res.status(200).json({ 
      message: 'User synced and cookie set', 
      role,
      user: { uid, email, fullName: name } 
    });

  } catch (err) {
    console.error("Auth Sync Error:", err);
    res.status(500).json({ error: 'Sync failed', details: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};