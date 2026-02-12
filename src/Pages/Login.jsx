import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center font-mono p-4 relative overflow-hidden select-none text-white">
      
      {/* Background Grid - Matching Landing Page Opacity */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none" 
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px),
                           repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)`
        }}
      />

      {/* Floating Decorative Badge (Matching Landing Page Style) */}
      <div className="absolute top-10 right-10 animate-bounce hidden lg:block" style={{ animationDuration: '3s' }}>
        <div className="bg-[#facc15] border-4 border-black px-6 py-2 rounded-xl rotate-[12deg] shadow-[6px_6px_0px_0px_white]">
          <span className="font-black text-black uppercase tracking-widest text-sm text-nowrap">Secure Access</span>
        </div>
      </div>

      <div className="max-w-md w-full relative z-10">
        
        {/* Branding Header */}
        <div className="text-center mb-10">
          <div className="inline-block bg-white text-black px-6 py-2 rounded-2xl rotate-[-2deg] shadow-[6px_6px_0px_0px_#3b82f6] mb-6">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">Pinnacle<span className="text-[#3b82f6]">AI</span></h1>
          </div>
          <h2 className="text-6xl font-black italic uppercase tracking-tighter leading-none mb-2">
            Login
          </h2>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
            Identify yourself to continue
          </p>
        </div>

        {/* Main Login Container */}
        <div className="bg-black border-[6px] border-white rounded-[40px] p-8 shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden">
          
          {/* Role Switcher (Matching Landing Feature Colors) */}
          <div className="flex bg-[#1a1a1a] border-[4px] border-white rounded-2xl p-1 mb-8">
            <button 
              onClick={() => setRole('student')}
              className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${role === 'student' ? 'bg-[#F3B8F8] text-black border-[3px] border-white shadow-[4px_4px_0px_0px_white]' : 'text-gray-500'}`}
            >
              STUDENT
            </button>
            <button 
              onClick={() => setRole('teacher')}
              className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${role === 'teacher' ? 'bg-[#98EECC] text-black border-[3px] border-white shadow-[4px_4px_0px_0px_white]' : 'text-gray-500'}`}
            >
              TEACHER
            </button>
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); navigate(role === 'student' ? '/home-student' : '/teacher-home'); }} 
            className="space-y-6"
          >
            {/* Username */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Username</label>
              <input 
                type="text" 
                placeholder="User_ID"
                className="w-full bg-[#121212] border-[4px] border-white rounded-2xl py-4 px-6 text-lg font-bold text-white shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all placeholder:text-gray-600"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-[#121212] border-[4px] border-white rounded-2xl py-4 px-6 text-lg font-bold text-white shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all placeholder:text-gray-600"
              />
            </div>

            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 border-2 border-white bg-black accent-[#3b82f6]" />
                <span className="text-[10px] font-black uppercase text-gray-400">Remember Me</span>
              </div>
              <span className="text-[10px] font-black underline uppercase cursor-pointer hover:text-[#facc15]">Forgot?</span>
            </div>

            {/* Submit Button (Matching Landing Hero CTA) */}
            <button 
              type="submit"
              className="w-full bg-white text-black py-5 rounded-3xl font-black text-2xl border-[4px] border-black shadow-[8px_8px_0px_0px_#3b82f6] hover:bg-[#3b82f6] hover:text-white hover:border-white hover:shadow-[8px_8px_0px_0px_#fff] transition-all transform hover:-translate-y-1 active:scale-95 uppercase italic"
            >
              Enter System →
            </button>
          </form>
        </div>

        {/* Bottom Link */}
        <p className="text-center mt-10 font-black text-xs uppercase tracking-widest text-gray-500">
          Not in the database? <span className="text-white underline cursor-pointer hover:text-[#facc15]">Create New File</span>
        </p>

      </div>

      {/* Footer Strip (Matching Landing) */}
      <footer className="absolute bottom-0 w-full bg-black border-t border-gray-800 py-4 text-center text-gray-600 text-[10px] uppercase tracking-widest font-bold">
        Secure Terminal Access • Pinnacle AI • 2026
      </footer>
    </div>
  );
};

export default Login;