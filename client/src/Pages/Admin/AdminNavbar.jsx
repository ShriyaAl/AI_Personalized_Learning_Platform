import React from 'react';
import { Search, Bell, UserCircle, LogOut } from 'lucide-react'; 
import { useAuth } from '../../utils/auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const { user, logout } = useAuth(); // Destructured logout from context
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login-admin'); // Redirect after clearing session and cookies
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 sticky top-0 z-10">
      {/* Quick Search */}
      <div className="relative w-96">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
          <Search size={16} />
        </span>
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          className="block w-full pl-10 pr-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white"></span>
        </button>

        <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>

        {/* Profile Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-900 leading-tight">
              {user?.displayName || 'Admin Console'}
            </p>
            <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">
              Root Access
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white border border-slate-800">
            <UserCircle size={22} />
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all group"
          title="Exit Session"
        >
          <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;