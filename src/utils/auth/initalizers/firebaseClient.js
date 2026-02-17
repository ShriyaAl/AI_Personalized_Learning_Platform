// import * as firebase from 'firebase/app';
// import 'firebase/auth';

// import CLIENT_CONFIG from '../../../config/firebaseClient.json';

// // Handle the "default" wrapper if the bundler adds it
// const firebaseClient = firebase.default || firebase;

// if (typeof window !== 'undefined' && firebaseClient.apps && !firebaseClient.apps.length) {
//   firebaseClient.initializeApp(CLIENT_CONFIG);
  
//   firebaseClient
//     .auth()
//     .setPersistence(firebaseClient.auth.Auth.Persistence.LOCAL);
    
//   window.firebase = firebaseClient;
// }

// export { firebaseClient };

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import CLIENT_CONFIG from '../../../config/firebaseClient.json';

// Initialize Firebase
// If an app already exists, use it; otherwise, initialize a new one.
const firebaseClient = getApps().length > 0 
  ? getApp() 
  : initializeApp(CLIENT_CONFIG);

const auth = getAuth(firebaseClient);

if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence);
  window.firebase = firebaseClient; // Optional: for debugging
}

export { firebaseClient, auth };