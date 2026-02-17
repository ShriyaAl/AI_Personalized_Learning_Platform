// import { firebaseClient } from "./initalizers/firebaseClient";

// const GoogleAuthProvider = new firebaseClient.auth.GoogleAuthProvider();

// export const login = async (options) => {
//   try {
//     // This triggers the Google Popup
//     await firebaseClient.auth().signInWithPopup(GoogleAuthProvider);
    
//     // If you pass a navigate function and a path, it will redirect
//     if (options?.navigate && options?.redirect) {
//       options.navigate(options.redirect);
//     }
//   } catch (error) {
//     console.error(`[login] Error: ${error.message}`);
//     alert("Login failed: " + error.message);
//   }
// };

// export const logout = async (options) => {
//   try {
//     await firebaseClient.auth().signOut();
//     if (options?.navigate) {
//       options.navigate(options?.redirect || '/');
//     }
//   } catch (error) {
//     console.error(`[logout] Error: ${error.message}`);
//   }
// };

import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from 'firebase/auth';
import { auth } from './initalizers/firebaseClient';
import nookies from 'nookies';

export const loginWithEmail = async (email, password, navigate, redirectPath) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    if (navigate && redirectPath) navigate(redirectPath);
  } catch (error) {
    alert(error.message);
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