// // import React, { useState, useEffect, useContext, createContext } from 'react';
// // import nookies from 'nookies';
// // import { firebaseClient } from './initalizers/firebaseClient';

// // const AuthContext = createContext({
// //   user: null,
// // });

// // export const AuthProvider = ({ children }) => {
// //   const [user, setUser] = useState(null);

// //   useEffect(() => {
// //     if (typeof window !== 'undefined') {
// //       window.nookies = nookies;
// //     }

// //     return firebaseClient.auth().onIdTokenChanged(async (user) => {
// //       if (!user) {
// //         console.log(`[AUTH] No user account found`);
// //         setUser(null);
// //         nookies.destroy(null, 'token', { path: '/' });
// //         return;
// //       }

// //       const token = await user.getIdToken();
// //       setUser(user);
      
// //       // Refresh the cookie token
// //       nookies.destroy(null, 'token', { path: '/' });
// //       nookies.set(null, 'token', token, { path: '/' });
      
// //       console.log(`[AUTH] Updated user and token`);
// //     });
// //   }, []);

// //   return (
// //     <AuthContext.Provider value={{ user }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };

// // export const useAuth = () => {
// //   return useContext(AuthContext);
// // };

// import React, { useState, useEffect, useContext, createContext } from 'react';
// import nookies from 'nookies';
// import { onIdTokenChanged } from 'firebase/auth';
// import { auth } from './initalizers/firebaseClient';

// const AuthContext = createContext({ user: null });

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//   const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
//     if (!firebaseUser) {
//       setUser(null);
//       nookies.destroy(null, 'token', { path: '/' });
//       return;
//     }

//     const tokenResult = await firebaseUser.getIdTokenResult();
//     const role = tokenResult.claims?.role || 'student'; // fallback

//     setUser({
//       ...firebaseUser,
//       role,
//     });

//     const token = tokenResult.token;
//     nookies.set(null, 'token', token, { path: '/' });
//   });

//   return unsubscribe;
// }, []);

//   return (
//     <AuthContext.Provider value={{ user }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

// import React, { useState, useEffect, useContext, createContext } from 'react';
// import { onIdTokenChanged } from 'firebase/auth';
// import { auth } from './initalizers/firebaseClient.js';

// const AuthContext = createContext({ user: null, loading: true });

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
//       if (!firebaseUser) {
//         setUser(null);
//         setLoading(false);
//         return;
//       }

//       // Force refresh to get latest custom claims (roles)
//       const tokenResult = await firebaseUser.getIdTokenResult(true);
//       const role = tokenResult.claims?.role || 'student';

//       setUser({
//         uid: firebaseUser.uid,
//         email: firebaseUser.email,
//         displayName: firebaseUser.displayName,
//         photoURL: firebaseUser.photoURL,
//         role: role,
//       });
      
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, loading }}>
//       {!loading && children} 
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import React, { useState, useEffect, useContext, createContext } from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import {auth} from "./initalizers/firebaseClient.js";

const AuthContext = createContext({ user: null, loading: true });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // onIdTokenChanged fires on sign-in, sign-out, and token refresh
  //   const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
  //     try {
  //       if (firebaseUser) {
  //         // 1. Get the latest token result. 
  //         // Note: Passing 'true' to getIdTokenResult forces a network check for new claims
  //         const tokenResult = await firebaseUser.getIdTokenResult();
          
  //         // 2. Extract only what we need to avoid heavy objects in state
  //         setUser({
  //           uid: firebaseUser.uid,
  //           email: firebaseUser.email,
  //           displayName: firebaseUser.displayName,
  //           role: tokenResult.claims.role || 'student', // The Custom Claim from Backend
  //         });
  //       } else {
  //         setUser(null);
  //       }
  //     } catch (error) {
  //       console.error("Auth Context Error:", error);
  //       setUser(null);
  //     } finally {
  //       // 3. Set loading to false ONLY after the check is complete
  //       setLoading(false);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    console.log("AUTH_DEBUG: Effect triggered"); // LOG 1
    
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      console.log("AUTH_DEBUG: Listener fired, user:", firebaseUser?.email); // LOG 2
      try {
        if (firebaseUser) {
          const tokenResult = await firebaseUser.getIdTokenResult(true);
          console.log("AUTH_DEBUG: Claims received:", tokenResult.claims); // LOG 3
          
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role: tokenResult.claims.role || 'student',
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth Context Error:", error);
        setUser(null);
      } finally {
        console.log("AUTH_DEBUG: Loading set to false"); // LOG 4
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {/* We don't hide children here anymore; 
         The ProtectedRoute component will handle the loading UI 
      */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);