// import React from 'react';
// import { Search, Bell, UserCircle, Settings, LogOut } from 'lucide-react'; // Using Lucide for sharp, formal icons
// import { useAuth } from '../../utils/auth/AuthContext';

// const AdminNavbar = () => {
//   const { user } = useAuth();

//   return (
//     <nav className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 sticky top-0 z-10">
//       {/* Search Bar */}
//       <div className="relative w-96">
//         <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
//           <Search size={18} />
//         </span>
//         <input 
//           type="text" 
//           placeholder="Search institutions, teachers, or audit logs..." 
//           className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md bg-slate-50 text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
//         />
//       </div>

//       {/* Right Side Actions */}
//       <div className="flex items-center gap-6">
//         {/* Notifications */}
//         <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
//           <Bell size={22} />
//           <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
//         </button>

//         {/* Vertical Divider */}
//         <div className="h-8 w-[1px] bg-slate-200"></div>

//         {/* Admin Profile Dropdown */}
//         <div className="flex items-center gap-3 cursor-pointer group">
//           <div className="text-right">
//             <p className="text-sm font-bold text-slate-900">{user?.displayName || 'Super Admin'}</p>
//             <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
//               System Control ({user?.role})
//             </p>
//           </div>
//           <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 border border-slate-300">
//             <UserCircle size={28} />
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default AdminNavbar;

import React from 'react';
import { Search, Bell, UserCircle } from 'lucide-react'; 
import { useAuth } from '../../utils/auth/AuthContext';

const AdminNavbar = () => {
  const { user } = useAuth();

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
        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white"></span>
        </button>

        <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-900 leading-tight">{user?.displayName || 'Admin Console'}</p>
            <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">
              Root Access
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white border border-slate-800">
            <UserCircle size={22} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;