// import { initializeApp, getApps, getApp } from 'firebase/app';
// import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
// import CLIENT_CONFIG from '../../../config/firebaseClient.json';

// // Initialize Firebase
// // If an app already exists, use it; otherwise, initialize a new one.
// const firebaseClient = getApps().length > 0 
//   ? getApp() 
//   : initializeApp(CLIENT_CONFIG);

// import { getFirestore } from 'firebase/firestore';

// const auth = getAuth(firebaseClient);
// const db = getFirestore(firebaseClient);

// if (typeof window !== 'undefined') {
//   setPersistence(auth, browserLocalPersistence);
//   window.firebase = firebaseClient; // Optional: for debugging
// }

// export { firebaseClient, auth, db };

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// 1. Build config from Environment Variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// 2. Initialize Firebase (Singleton Pattern)
const firebaseClient = getApps().length > 0 
  ? getApp() 
  : initializeApp(firebaseConfig);

// 3. Initialize Services
const auth = getAuth(firebaseClient);
const db = getFirestore(firebaseClient);

// 4. Client-side Persistence Logic
if (typeof window !== 'undefined') {
  // Ensures the user stays logged in even after closing the tab
  setPersistence(auth, browserLocalPersistence);
  
  // Only expose to window in development mode for debugging
  if (import.meta.env.DEV) {
    window.firebase = firebaseClient;
  }
}

export { firebaseClient, auth, db };
