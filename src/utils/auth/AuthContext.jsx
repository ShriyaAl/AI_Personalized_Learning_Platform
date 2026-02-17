// import React, { useState, useEffect, useContext, createContext } from 'react';
// import nookies from 'nookies';
// import { firebaseClient } from './initalizers/firebaseClient';

// const AuthContext = createContext({
//   user: null,
// });

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       window.nookies = nookies;
//     }

//     return firebaseClient.auth().onIdTokenChanged(async (user) => {
//       if (!user) {
//         console.log(`[AUTH] No user account found`);
//         setUser(null);
//         nookies.destroy(null, 'token', { path: '/' });
//         return;
//       }

//       const token = await user.getIdToken();
//       setUser(user);
      
//       // Refresh the cookie token
//       nookies.destroy(null, 'token', { path: '/' });
//       nookies.set(null, 'token', token, { path: '/' });
      
//       console.log(`[AUTH] Updated user and token`);
//     });
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

import React, { useState, useEffect, useContext, createContext } from 'react';
import nookies from 'nookies';
import { onIdTokenChanged } from 'firebase/auth';
import { auth } from './initalizers/firebaseClient';

const AuthContext = createContext({ user: null });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        nookies.destroy(null, 'token', { path: '/' });
      } else {
        const token = await firebaseUser.getIdToken();
        setUser(firebaseUser);
        nookies.set(null, 'token', token, { path: '/' });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);