import React, { useState, useEffect, useContext, createContext } from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import {auth} from "./initalizers/firebaseClient.js";

const AuthContext = createContext({ user: null, loading: true });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    console.log("AUTH_DEBUG: Effect triggered"); // LOG 1
    
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      console.log("AUTH_DEBUG: Listener fired, user:", firebaseUser?.email); // LOG 2
      try {
        if (firebaseUser) {
          const tokenResult = await firebaseUser.getIdTokenResult(false);
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
        if (error?.code === 'auth/network-request-failed' && firebaseUser) {
          // Keep session state during temporary internet outages.
          setUser((prev) => prev || {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role: 'student',
          });
        } else {
          setUser(null);
        }
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
