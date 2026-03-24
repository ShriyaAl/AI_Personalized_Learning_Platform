import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from 'firebase/auth';
import { auth } from './initalizers/firebaseClient.js';
import { apiRequest } from '../apiClient'; // Our new utility
import nookies from 'nookies';

/**
 * Handle the core logic after any Firebase login (Email or Google)
 * This syncs the user with our backend and redirects based on role.
 */
export const handleSuccessfulLogin = async (navigate) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Authentication failed: No user found.");

    const idToken = await user.getIdToken(true);

    const data = await apiRequest('/api/auth/sync-user', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });

    const serverRole = data.role || 'student';

    await user.getIdToken(true);
    const tokenResult = await user.getIdTokenResult();
    const finalRole = (tokenResult.claims.role || serverRole).toLowerCase();

    // FIXED REDIRECT LOGIC
    let destination = '/home-student'; // Default
    if (finalRole === 'admin') {
      destination = '/home-admin';
    } else if (finalRole === 'teacher') {
      destination = '/teacher-home';
    }

    console.log(`Role verified: ${finalRole}. Redirecting to: ${destination}`);
    navigate(destination);
    
  } catch (err) {
    console.error("Post-Login Sync Error:", err);
    throw err; 
  }
};

/**
 * Email/Password Login
 */
export const loginWithEmail = async (email, password, navigate) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    await handleSuccessfulLogin(navigate);
  } catch (error) {
    // Standardize Firebase error messages for the UI
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new Error("Invalid email or password.");
    }
    throw error;
  }
};

/**
 * Google OAuth Login
 */
export const loginWithGoogle = async (navigate) => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    // Crucial: Google users MUST sync with backend too!
    await handleSuccessfulLogin(navigate);
  } catch (error) {
    console.error("Google Login Error:", error.message);
    throw error;
  }
};

/**
 * Global Logout
 */
export const logout = async (navigate) => {
  try {
    // 1. Tell backend to clear the HttpOnly cookie
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn("Backend logout failed, proceeding with client-side cleanup.");
    }

    // 2. Sign out of Firebase
    await signOut(auth);

    // 3. Clear local client-side token cookie
    nookies.destroy(null, 'token', { path: '/' });
    
    if (navigate) {
      navigate('/login');
    }
  } catch (error) {
    console.error("Logout Error:", error);
  }
};