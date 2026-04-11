import { adminAuth } from "../db/firebaseAdmin.js";
import { supabase } from "../db/supabase.js";

/**
 * Creates a new user in Firebase Auth and syncs metadata to Supabase.
 */
export const createUser = async (req, res) => {
  const { email, password, fullName, role } = req.body;

  try {
    // 1. Create in Firebase
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: fullName,
    });

    // 2. Set Role Claim (Essential for roleMiddleware)
    await adminAuth.setCustomUserClaims(userRecord.uid, { role: role.toLowerCase() });

    // 3. Save to Supabase Registry
    const { error: supabaseError } = await supabase
      .from("users")
      .insert([{ 
        uid: userRecord.uid, 
        email, 
        name: fullName, 
        role: role.toLowerCase() 
      }]);

    if (supabaseError) throw supabaseError;

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Admin Create Error:", error);
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