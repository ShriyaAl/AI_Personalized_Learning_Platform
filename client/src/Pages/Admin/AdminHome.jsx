import React, { useState, useEffect, useCallback } from 'react';
import AdminNavbar from './AdminNavbar';

const AdminHome = () => {
  const [activeRole, setActiveRole] = useState('teacher');
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });

  // 1. Fetch Users logic
  const fetchUsers = useCallback(async (role) => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/users?role=${role}`, {
        credentials: 'include'
      });
      if (!response.ok) return;
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, []);

  // 2. Create User logic
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
        fetchUsers(activeRole);
      } else {
        const err = await response.json();
        alert(err.error);
      }
    } catch (error) {
      console.error("Creation error:", error);
    }
  };

  useEffect(() => {
    fetchUsers(activeRole);
  }, [activeRole, fetchUsers]);

  return (
    <div className="flex w-full min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white sticky top-0 h-screen p-6">
        <h2 className="text-xl font-bold mb-10">Pinnacle Admin</h2>
        <nav className="space-y-2">
          <div className="text-slate-500 text-[10px] uppercase font-bold mb-4">Registry</div>
          <button onClick={() => setActiveRole('teacher')} className={`w-full text-left py-2 px-4 rounded-md text-sm ${activeRole === 'teacher' ? 'bg-blue-600' : 'text-slate-400'}`}>Teacher Registry</button>
          <button onClick={() => setActiveRole('student')} className={`w-full text-left py-2 px-4 rounded-md text-sm ${activeRole === 'student' ? 'bg-blue-600' : 'text-slate-400'}`}>Student Registry</button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="p-10">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 capitalize">{activeRole}s</h1>
            <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-5 py-2 rounded-lg font-bold">+ Add {activeRole}</button>
          </header>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-bold text-slate-800">{u.name}</td>
                    <td className="px-6 py-4 text-slate-500">{u.email}</td>
                    <td className="px-6 py-4 text-right"><button className="text-red-500 text-xs font-bold uppercase">Deactivate</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[1000]">
          <div className="bg-white w-full max-w-md rounded-2xl p-8 border border-slate-200 shadow-2xl">
            <h2 className="text-lg font-bold mb-6">Create {activeRole} Account</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <input type="text" placeholder="Full Name" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full p-2 bg-slate-50 border rounded-lg outline-none"/>
              <input type="email" placeholder="Email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2 bg-slate-50 border rounded-lg outline-none"/>
              <input type="password" placeholder="Temporary Password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-2 bg-slate-50 border rounded-lg outline-none"/>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 font-bold text-slate-400">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded-lg font-bold shadow-lg shadow-blue-600/20">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;