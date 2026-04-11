// import React, { useState, useEffect } from 'react';
// import AdminNavbar from './AdminNavbar';

// const AdminHome = () => {
//   const [activeRole, setActiveRole] = useState('teacher'); // 'teacher' or 'student'
//   const [users, setUsers] = useState([]);

//   // Fetch users based on activeRole
//   useEffect(() => {
//     fetchUsers();
//   }, [activeRole]);

//   const fetchUsers = async () => {
//     try {
//       const response = await fetch(`http://localhost:3000/api/admin/users?role=${activeRole}`,{
//         credentials:'include'
//       });
//       const data = await response.json();
//       setUsers(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   return (
//     <div className="flex w-full min-h-screen bg-slate-50 font-sans">
//       {/* Admin Sidebar */}
//       <aside className="w-64 bg-slate-900 text-white sticky top-0 h-screen p-6">
//         <h2 className="text-xl font-bold mb-10 tracking-tight">Pinnacle Admin</h2>
//         <nav className="space-y-2">
//           <div className="text-slate-500 text-[10px] uppercase font-bold mb-4 tracking-widest">User Management</div>
//           <button 
//             onClick={() => setActiveRole('teacher')}
//             className={`w-full text-left py-2 px-4 rounded-md text-sm transition-all ${activeRole === 'teacher' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800'}`}
//           >
//             Teacher Registry
//           </button>
//           <button 
//             onClick={() => setActiveRole('student')}
//             className={`w-full text-left py-2 px-4 rounded-md text-sm transition-all ${activeRole === 'student' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800'}`}
//           >
//             Student Registry
//           </button>
//         </nav>
//       </aside>

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col">
//         <AdminNavbar />

//         <main className="p-10 overflow-y-auto">
//           <header className="flex justify-between items-center mb-8">
//             <div>
//               <h1 className="text-2xl font-bold text-slate-900 capitalize">{activeRole} Management</h1>
//               <p className="text-slate-500 text-sm">Create and oversee platform {activeRole}s.</p>
//             </div>
//             <button className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm">
//               + Add New {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}
//             </button>
//           </header>

//           {/* User Table */}
//           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//             <div className="p-5 border-b border-slate-200 bg-white flex justify-between items-center">
//               <h3 className="font-bold text-slate-800">Registered {activeRole}s</h3>
//               <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
//                 Total: {users.length}
//               </span>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-[0.1em]">
//                   <tr>
//                     <th className="px-6 py-4 font-bold">Name</th>
//                     <th className="px-6 py-4 font-bold">Email / UID</th>
//                     <th className="px-6 py-4 font-bold">Joined Date</th>
//                     <th className="px-6 py-4 font-bold text-right">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {users.length > 0 ? (
//                     users.map((u) => (
//                       <UserRow key={u.id} name={u.full_name} email={u.email} date={u.created_at} />
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="4" className="px-6 py-10 text-center text-slate-400 italic text-sm">
//                         No {activeRole}s registered yet.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// const UserRow = ({ name, email, date }) => (
//   <tr className="hover:bg-slate-50/50 transition-colors">
//     <td className="px-6 py-4 font-bold text-slate-800 text-sm">{name}</td>
//     <td className="px-6 py-4 text-slate-500 text-sm font-medium">{email}</td>
//     <td className="px-6 py-4 text-slate-400 text-xs">
//       {date ? new Date(date).toLocaleDateString() : 'N/A'}
//     </td>
//     <td className="px-6 py-4 text-right">
//       <button className="text-slate-400 hover:text-red-600 transition-colors">
//         {/* Placeholder for Edit/Delete */}
//         <span className="text-xs font-bold uppercase tracking-tighter">Deactivate</span>
//       </button>
//     </td>
//   </tr>
// );

// export default AdminHome;

import React, { useState, useEffect, useCallback } from 'react';
import AdminNavbar from './AdminNavbar';

const AdminHome = () => {
  const [activeRole, setActiveRole] = useState('teacher');
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * 1. Wrap fetchUsers in useCallback.
   * This ensures the function identity doesn't change on every render,
   * preventing unnecessary effect triggers.
   */
  const fetchUsers = useCallback(async (role) => {
    // DO NOT call setState logic here that depends on 'users' 
    // unless it's inside the try/catch block after the fetch.
    try {
      const response = await fetch(`http://localhost:3000/api/admin/users?role=${role}`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        // If there's an error, we set an empty array once
        setUsers([]);
        return;
      }

      const data = await response.json();
      
      // Update state ONLY once the data is back (asynchronously)
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Registry Fetch Error:", error);
      setUsers([]);
    }
  }, []); // Empty dependency array for the callback itself

  /**
   * 2. The Effect Hook
   * We pass activeRole into fetchUsers as an argument rather than
   * relying on the state variable inside the function.
   */
  useEffect(() => {
    fetchUsers(activeRole);
  }, [activeRole, fetchUsers]);

  // 2. Create User Logic
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: activeRole }),
        credentials: 'include'
      });

      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ fullName: '', email: '', password: '' });
        fetchUsers();
      } else {
        const err = await response.json();
        alert(`Error: ${err.error}`);
      }
    } catch (error) {
      console.error("Creation Workflow Error:", error);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white sticky top-0 h-screen p-6">
        <h2 className="text-xl font-bold mb-10">Pinnacle Admin</h2>
        <nav className="space-y-2">
          <div className="text-slate-500 text-[10px] uppercase font-bold mb-4">User Management</div>
          <button 
            onClick={() => setActiveRole('teacher')}
            className={`w-full text-left py-2 px-4 rounded-md text-sm transition-all ${activeRole === 'teacher' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            Teacher Registry
          </button>
          <button 
            onClick={() => setActiveRole('student')}
            className={`w-full text-left py-2 px-4 rounded-md text-sm transition-all ${activeRole === 'student' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            Student Registry
          </button>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="p-10">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 capitalize">{activeRole} Management</h1>
              <p className="text-slate-500 text-sm font-medium">Add or manage {activeRole} profiles.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 shadow-sm"
            >
              + Add {activeRole}
            </button>
          </header>

          {/* Table Container */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 font-bold">Name</th>
                  <th className="px-6 py-4 font-bold">Email</th>
                  <th className="px-6 py-4 font-bold">Created At</th>
                  <th className="px-6 py-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 text-sm">{u.name}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm font-medium">{u.email}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-bold text-red-500 uppercase tracking-tighter">Deactivate</button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic text-sm">No {activeRole}s found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[1000] p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">New {activeRole} Account</h2>
            </div>
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                <input 
                  type="text" required value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                <input 
                  type="email" required value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                <input 
                  type="password" required value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 text-sm font-bold text-slate-500">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-600/20">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;