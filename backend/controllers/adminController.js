import { adminAuth } from "../db/firebaseAdmin.js";
import { supabase } from "../db/supabase.js";

/**
 * Creates a new user in Firebase Auth and syncs metadata to Supabase.
 */
export const createUser = async (req, res) => {
  const { email, password, fullName, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // 1. Create User in Firebase Authentication
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: fullName,
    });

    // 2. Set Custom Claims (role) for your roleMiddleware
    await adminAuth.setCustomUserClaims(userRecord.uid, { role });

    // 3. Store in Supabase 'users' table for registry listing
    const { error: supabaseError } = await supabase
      .from("users")
      .insert([
        { 
          uid: userRecord.uid, 
          email, 
          full_name: fullName, 
          role: role.toLowerCase() 
        }
      ]);

    if (supabaseError) throw supabaseError;

    res.status(201).json({ message: "User created successfully", uid: userRecord.uid });
  } catch (error) {
    console.error("Admin Create User Error:", error);
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