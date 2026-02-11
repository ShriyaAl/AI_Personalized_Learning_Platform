import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      id: 1,
      title: "AI Tutor",
      desc: "Instant help with complex topics, powered by Gemini.",
      color: "bg-[#F3B8F8]", // Pink
      icon: "🤖"
    },
    {
      id: 2,
      title: "Interactive Courses",
      desc: "Learn by doing with engaging, gamified lessons.",
      color: "bg-[#98EECC]", // Mint Green
      icon: "🎮"
    },
    {
      id: 3,
      title: "Smart Tracking",
      desc: "Visualize your progress and identify weak spots.",
      color: "bg-[#facc15]", // Yellow
      icon: "📊"
    }
  ];

  return (
    <div className="min-h-screen bg-[#121212] font-mono text-white relative overflow-hidden flex flex-col">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none" 
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px),
                           repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)`
        }}
      />

      {/* Navbar */}
      <nav className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white border-4 border-black rounded-full flex items-center justify-center text-2xl shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
            🚀
          </div>
          <span className="text-2xl font-black italic tracking-tighter uppercase">Pinnacle<span className="text-[#3b82f6]">AI</span></span>
        </div>
        <div className="flex gap-4">
          <div className="hidden md:flex items-center gap-2 bg-black/50 border border-gray-700 rounded-full px-4 py-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-bold text-gray-300 tracking-widest uppercase">System Operational</span>
          </div>
          <button className="bg-[#24292e] text-white px-4 py-2 font-bold text-sm border-2 border-white rounded-lg hover:bg-black transition-colors flex items-center gap-2">
            <span>⭐</span> Star on GitHub
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 text-center mt-10">
        
        {/* Floating AI Badge */}
        <div className="animate-bounce mb-6 bg-[#3b82f6] text-white px-6 py-2 rounded-full border-4 border-black font-black uppercase tracking-widest text-xs shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] transform -rotate-3">
          Personalized Learning Platform
        </div>

        {/* Floating Decor Items */}
        <div className="absolute top-0 left-10 md:left-20 animate-bounce hidden lg:block" style={{ animationDuration: '3s' }}>
          <div className="bg-[#FF90E8] border-4 border-black w-20 h-20 flex items-center justify-center rounded-full rotate-[-12deg] shadow-[6px_6px_0px_0px_white]">
            <span className="text-4xl font-black text-black">A+</span>
          </div>
        </div>
        <div className="absolute top-20 right-10 md:right-20 animate-bounce hidden lg:block" style={{ animationDuration: '4s' }}>
          <div className="bg-[#98EECC] border-4 border-black px-6 py-2 rounded-xl rotate-[5deg] shadow-[6px_6px_0px_0px_white]">
            <span className="font-black text-black uppercase tracking-widest">Verified</span>
          </div>
        </div>

        <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-none mb-6 tracking-tighter mix-blend-difference">
          Unlock Your <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3B8F8] via-[#facc15] to-[#98EECC]" style={{ WebkitTextStroke: '2px white' }}>
            Potential
          </span>
        </h1>

        <p className="max-w-2xl text-gray-400 text-lg md:text-xl font-medium mb-12 leading-relaxed">
          Experience the future of education with AI-driven personalization. 
          Master subjects at your own pace with a tutor that adapts to <span className="text-white font-bold underline decoration-wavy decoration-[#facc15]">YOU</span>.
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          <button 
            onClick={() => navigate('/login')}
            className="bg-white text-black px-10 py-5 text-xl font-black uppercase tracking-wider border-[4px] border-black shadow-[8px_8px_0px_0px_#3b82f6] hover:bg-[#3b82f6] hover:text-white hover:border-white hover:shadow-[8px_8px_0px_0px_#fff] transition-all transform hover:-translate-y-1"
          >
            Get Started Now
          </button>
          

        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full max-w-6xl px-6 pb-20">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className={`${feature.color} border-[4px] border-black p-8 rounded-[30px] shadow-[8px_8px_0px_0px_#fff] text-left transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#fff] cursor-pointer group`}
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="bg-white w-14 h-14 rounded-full border-4 border-black flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black text-black uppercase italic mb-2">{feature.title}</h3>
              <p className="text-black font-bold text-sm leading-tight opacity-80">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
      
      {/* Marquee Strip */}
      <div className="bg-[#facc15] border-y-4 border-black py-3 overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-marquee">
          <span className="text-black font-black text-2xl mx-8 uppercase italic tracking-tighter">AI-POWERED LEARNING • ADAPTIVE COURSEWARE • REAL-TIME MENTORSHIP • GAMIFIED PROGRESS •</span>
          <span className="text-black font-black text-2xl mx-8 uppercase italic tracking-tighter">AI-POWERED LEARNING • ADAPTIVE COURSEWARE • REAL-TIME MENTORSHIP • GAMIFIED PROGRESS •</span>
        </div>
      </div>

      {/* Footer Strip */}
      <footer className="w-full bg-black border-t border-gray-800 py-6 text-center text-gray-500 text-xs uppercase tracking-widest font-bold">
        © 2026 Pinnacle AI Learning • Built for the Future
      </footer>
    </div>
  );
};

export default LandingPage;
