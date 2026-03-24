import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from 'firebase/auth';
import { auth } from './initalizers/firebaseClient';
import nookies from 'nookies';

// export const loginWithEmail = async (email, password, navigate, redirectPath) => {
//   try {
//     await signInWithEmailAndPassword(auth, email, password);
//     if (navigate && redirectPath) navigate(redirectPath);
//   } catch (error) {
//     alert(error.message);
//   }
// };

export const loginWithEmail = async (email, password, navigate) => {
  // eslint-disable-next-line no-useless-catch
  try {
    await signInWithEmailAndPassword(auth, email, password);
    await handleSuccessfulLogin(navigate);
  } catch (error) {
    throw error; // let Login.jsx catch it
  }
};

export const loginWithGoogle = async (navigate, redirectPath) => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    if (navigate && redirectPath) navigate(redirectPath);
  } catch (error) {
    console.error(error.message);
  }
};

export const logout = async (navigate) => {
  try {
    await signOut(auth);
    // Manually clear the cookie just to be safe and immediate
    nookies.destroy(null, 'token', { path: '/' });
    
    if (navigate) {
      navigate('/login');
    }
  } catch (error) {
    console.error("Logout Error:", error);
  }
};

export const handleSuccessfulLogin = async (navigate) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    // Get fresh token
    const idToken = await user.getIdToken(/* forceRefresh */ true);

    // Call backend to sync + set claim
    const res = await fetch('http://localhost:3000/api/auth/sync-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Sync failed');
    }

    // Optional: get role from response (but better to read from claims)
    const { role } = await res.json();

    // Force refresh again to ensure claims are in token
    await user.getIdToken(true);

    // Now read role from claims
    const tokenResult = await user.getIdTokenResult();
    const finalRole = tokenResult.claims.role || 'student';

    const destination = finalRole === 'teacher' ? '/teacher-home' : '/home-student';
    navigate(destination);
  } catch (err) {
    console.error("Login flow error:", err);
    throw err; // so Login.jsx can show it
  }
};