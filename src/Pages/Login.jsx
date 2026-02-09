import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-5xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-lg">Select your portal to continue</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => navigate('/home-student')}
            className="group relative bg-white text-black py-6 rounded-2xl font-bold text-xl transition-all hover:bg-gray-200 active:scale-95"
          >
            I am a Student
            <span className="block text-sm font-normal text-gray-500">Access your courses and AI tutor</span>
          </button>

          <button
            onClick={() => navigate('/teacher-home')}
            className="group border-2 border-gray-700 hover:border-white py-6 rounded-2xl font-bold text-xl transition-all active:scale-95"
          >
            I am a Teacher
            <span className="block text-sm font-normal text-gray-400">Manage classes and track progress</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;