import React from 'react';
import AdminNavbar from './AdminNavbar';

const AdminHome = () => {
  return (
    <div className="flex w-full min-h-screen bg-slate-50">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-white sticky top-0 h-screen p-6">
        <h2 className="text-xl font-bold mb-10">Pinnacle Admin</h2>
        <nav className="space-y-4">
          <div className="text-slate-400 text-xs uppercase font-bold">Management</div>
          <a href="#" className="block py-2 px-4 bg-slate-800 rounded-md text-sm">Schools & Institutions</a>
          <a href="#" className="block py-2 px-4 hover:bg-slate-800 rounded-md text-sm transition-colors">Teacher Registry</a>
          <div className="text-slate-400 text-xs uppercase font-bold mt-8">System</div>
          <a href="#" className="block py-2 px-4 hover:bg-slate-800 rounded-md text-sm transition-colors">Platform Health</a>
          <a href="#" className="block py-2 px-4 hover:bg-slate-800 rounded-md text-sm transition-colors">Audit Logs</a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar sits at the very top of the content area */}
        <AdminNavbar />

        {/* This div adds padding to everything below the navbar */}
        <main className="p-10 overflow-y-auto">
          <header className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900">Platform Overview</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-shadow shadow-sm">
              + Register New School
            </button>
          </header>

          {/* High Level Metrics */}
          <div className="grid grid-cols-4 gap-6 mb-10">
            <MetricCard title="Active Schools" value="12" change="+2 this month" />
            <MetricCard title="Total Teachers" value="148" change="+12% growth" />
            <MetricCard title="Active Students" value="4,290" change="+5% growth" />
            <MetricCard title="System Uptime" value="99.9%" change="Optimal" />
          </div>

          {/* Institution Management Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-white">
              <h3 className="text-lg font-bold text-slate-800">Institutions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Institution Name</th>
                    <th className="px-6 py-4 font-semibold">Assigned Teachers</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <SchoolRow name="Green Valley High" teachers="24" status="Active" />
                  <SchoolRow name="St. Xavier Academy" teachers="18" status="Active" />
                  <SchoolRow name="New Horizon Int." teachers="0" status="Pending Setup" />
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// --- ADMIN SUB-COMPONENTS ---

const MetricCard = ({ title, value, change }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</p>
    <div className="flex items-baseline gap-2 mt-2">
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      <span className="text-blue-600 text-xs font-bold bg-blue-50 px-2 py-0.5 rounded-full">
        {change}
      </span>
    </div>
  </div>
);

const SchoolRow = ({ name, teachers, status }) => (
  <tr className="hover:bg-slate-50/80 transition-colors border-b border-slate-100 last:border-none">
    <td className="px-6 py-4 font-semibold text-slate-900">{name}</td>
    <td className="px-6 py-4 text-slate-600 text-sm">{teachers} Teachers</td>
    <td className="px-6 py-4">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
        status === 'Active' 
          ? 'bg-emerald-100 text-emerald-700' 
          : 'bg-amber-100 text-amber-700'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
        }`}></span>
        {status}
      </span>
    </td>
    <td className="px-6 py-4 text-right">
      <button className="text-blue-600 hover:text-blue-800 text-sm font-bold transition-colors">
        Manage Account
      </button>
    </td>
  </tr>
);

export default AdminHome;