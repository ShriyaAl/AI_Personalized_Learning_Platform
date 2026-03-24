// import { 
//   signInWithEmailAndPassword, 
//   signInWithPopup, 
//   GoogleAuthProvider, 
//   signOut 
// } from 'firebase/auth';
// import { auth } from './initalizers/firebaseClient';
// import nookies from 'nookies';

// export const loginWithEmail = async (email, password, navigate) => {
//   // eslint-disable-next-line no-useless-catch
//   try {
//     await signInWithEmailAndPassword(auth, email, password);
//     await handleSuccessfulLogin(navigate);
//   } catch (error) {
//     throw error; // let Login.jsx catch it
//   }
// };

// export const loginWithGoogle = async (navigate, redirectPath) => {
//   const provider = new GoogleAuthProvider();
//   try {
//     await signInWithPopup(auth, provider);
//     if (navigate && redirectPath) navigate(redirectPath);
//   } catch (error) {
//     console.error(error.message);
//   }
// };

// export const logout = async (navigate) => {
//   try {
//     await signOut(auth);
//     // Manually clear the cookie just to be safe and immediate
//     nookies.destroy(null, 'token', { path: '/' });
    
//     if (navigate) {
//       navigate('/login');
//     }
//   } catch (error) {
//     console.error("Logout Error:", error);
//   }
// };

// export const handleSuccessfulLogin = async (navigate) => {
//   try {
//     const user = auth.currentUser;
//     if (!user) throw new Error("No authenticated user");

//     // Get fresh token
//     const idToken = await user.getIdToken(/* forceRefresh */ true);

//     // Call backend to sync + set claim
//     const res = await fetch('http://localhost:3000/api/auth/sync-user', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ idToken }),
//     });

//     if (!res.ok) {
//       const err = await res.json();
//       throw new Error(err.error || 'Sync failed');
//     }

//     // Optional: get role from response (but better to read from claims)
//     const { role } = await res.json();

//     // Force refresh again to ensure claims are in token
//     await user.getIdToken(true);

//     // Now read role from claims
//     const tokenResult = await user.getIdTokenResult();
//     const finalRole = tokenResult.claims.role || 'student';

//     const destination = finalRole === 'teacher' ? '/teacher-home' : '/home-student';
//     navigate(destination);
//   } catch (err) {
//     console.error("Login flow error:", err);
//     throw err; // so Login.jsx can show it
//   }
// };

import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from 'firebase/auth';
import { auth } from '../initializers/firebaseClient';
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

    // 1. Get fresh ID Token from Firebase
    const idToken = await user.getIdToken(true);

    // 2. Sync with Backend using our apiClient
    // This automatically handles the Base URL and includes credentials for cookies
    const data = await apiRequest('/api/auth/sync-user', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });

    const serverRole = data.role || 'student';

    // 3. Force refresh token to ensure the new custom claim (role) is available locally
    await user.getIdToken(true);
    const tokenResult = await user.getIdTokenResult();
    const finalRole = tokenResult.claims.role || serverRole;

    // 4. Redirect based on role
    const destination = finalRole === 'teacher' ? '/teacher-home' : '/home-student';
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