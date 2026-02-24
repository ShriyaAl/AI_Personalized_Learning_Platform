import React, { useState } from 'react';

const AdminLogin = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 font-sans">
      <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-lg border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Pinnacle Control</h1>
          <p className="text-slate-500 text-sm mt-2">Administrative Access Portal</p>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Administrator ID</label>
            <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Security Key</label>
            <input type="password" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <button className="w-full bg-slate-900 text-white py-2 rounded-md font-semibold hover:bg-slate-800 transition-colors">
            Authorize Access
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;