// import React, { useState } from 'react';

// const AdminLogin = () => {
//   return (
//     <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 font-sans">
//       <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-lg border border-slate-200">
//         <div className="text-center mb-8">
//           <h1 className="text-2xl font-bold text-slate-900">Pinnacle Control</h1>
//           <p className="text-slate-500 text-sm mt-2">Administrative Access Portal</p>
//         </div>
        
//         <form className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Administrator ID</label>
//             <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Security Key</label>
//             <input type="password" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
//           </div>
//           <button className="w-full bg-slate-900 text-white py-2 rounded-md font-semibold hover:bg-slate-800 transition-colors">
//             Authorize Access
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail } from '../../utils/auth/authActions.js'; 

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Authenticate & Sync
      // This function already handles the backend sync and role-based redirect logic
      await loginWithEmail(email, password, navigate);
    } catch (err) {
      console.error("Admin Login Failed:", err);
      setError(err.message || "Authorization Denied. Invalid Credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 font-sans">
      <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-lg border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Pinnacle Control</h1>
          <p className="text-slate-500 text-sm mt-2">Administrative Access Portal</p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-bold rounded-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Administrator ID (Email)</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              placeholder="admin@pinnacle.ai"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Security Key (Password)</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-slate-900 text-white py-2 rounded-md font-semibold hover:bg-slate-800 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Verifying Credentials...' : 'Authorize Access'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;