import { adminAuth } from "../db/firebaseAdmin.js";
import { supabase } from "../db/supabase.js";

/**
 * Creates a new user in Firebase Auth and syncs metadata to Supabase.
 */
export const createUser = async (req, res) => {
  const { email, password, fullName, role } = req.body;

  try {
    // 1. Pre-check Supabase to avoid "User already exists" error later
    const { data: checkUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (checkUser) {
      return res.status(400).json({ error: "Email already registered in system." });
    }

    // 2. Proceed with Firebase
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: fullName,
    });

    await adminAuth.setCustomUserClaims(userRecord.uid, { role: role.toLowerCase() });

    // 3. Insert to Supabase
    const { error: supabaseError } = await supabase
      .from("users")
      .insert([{ 
        uid: userRecord.uid, 
        email, 
        name: fullName, 
        role: role.toLowerCase() 
      }]);

    if (supabaseError) throw supabaseError;

    res.status(201).json({ message: "User created" });
  } catch (error) {
    // If Firebase succeeds but Supabase fails, this is where the bug lives.
    // We catch it and send a clear message.
    console.error("Creation Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves users filtered by role from Supabase.
 */
export const getUsers = async (req, res) => {
  const { role } = req.query;

  try {
    // Log this to your terminal to see if the request is even arriving
    console.log("Admin Request for role:", role);

    const { data, error } = await supabase
      .from("users")
      .select("*") 
      .eq("role", role)
      .order("created_at", { ascending: false });

    if (error) {
      // This will print the EXACT database error in your VS Code terminal
      console.error("Supabase Database Error:", error.message);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error("Unexpected Controller Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const syncUser = async (req, res) => {
  try {
    const { idToken } = req.body;
    const decoded = await adminAuth.verifyIdToken(idToken);
    const { uid, email, name, picture: avatar_url } = decoded;

    const userRecord = await adminAuth.getUser(uid);
    const currentClaims = userRecord.customClaims || {};
    let role = currentClaims.role || 'student';

    // THE FIX: Use upsert or check existence carefully
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('role')
      .eq('uid', uid)
      .single();

    if (!existingUser) {
      // Scenario: User was NOT created by Admin (e.g., self-signup)
      await supabase.from('users').insert({
        uid,
        name: name || email.split('@')[0],
        email,
        role,
        avatar_url,
        created_at: new Date().toISOString(),
      });
    } else {
      // Scenario: User WAS created by Admin
      // Just update metadata that might be missing (like avatar)
      await supabase.from('users').update({ 
        avatar_url,
        // Don't overwrite role if it's already set correctly
      }).eq('uid', uid);
      
      role = existingUser.role; // Keep the role defined by Admin
    }

    // Ensure Claims stay in sync
    if (currentClaims.role !== role) {
      await adminAuth.setCustomUserClaims(uid, { ...currentClaims, role });
    }

    res.cookie('token', idToken, {
      httpOnly: true,
      secure: false, 
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.status(200).json({ message: 'Synced', role });
  } catch (err) {
    console.error("Sync Error:", err);
    res.status(500).json({ error: 'Sync failed' });
  }
};