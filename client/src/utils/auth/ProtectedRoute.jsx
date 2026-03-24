import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Debugging: Essential for tracking the handshake
  console.log('--- [GUARD CHECK] ---', { 
    path: location.pathname, 
    loading, 
    userPresent: !!user, 
    role: user?.role,
    required: allowedRoles
  });

  // 2. Handle the "Wait for Firebase" state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-white font-mono">
        <div className="animate-spin h-10 w-10 border-4 border-[#3b82f6] border-t-transparent rounded-full mb-6"></div>
        <div className="animate-pulse tracking-[0.2em] text-xs uppercase font-black text-gray-500">
          Verifying Identity...
        </div>
      </div>
    );
  }

  // 3. If no user is logged in, send to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 4. Role Authorization Logic
  const userRole = user.role?.toLowerCase().trim();
  const isAdmin = userRole === 'admin';
  const isAllowed = allowedRoles?.map(r => r.toLowerCase()).includes(userRole);

  /**
   * THE SUPERUSER RULE: 
   * If the user is an 'admin', we allow them to pass ANY gate.
   * This prevents admins from being stuck in "Access Denied" loops 
   * when navigating between student and teacher zones.
   */
  if (allowedRoles && !isAllowed && !isAdmin) {
    console.warn(`[GUARD] Access Denied for ${userRole}. Redirecting to native dashboard.`);
    
    // Determine the safest fallback based on who they actually are
    let fallback = "/home-student";
    if (userRole === 'teacher') fallback = "/teacher-home";
    if (userRole === 'admin') fallback = "/home-admin";

    return <Navigate to={fallback} replace />;
  }

  // 5. Success: Render the protected component
  return children;
};

export default ProtectedRoute;