import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeynmanBreakdown = ({ data }) => {
  const navigate = useNavigate();

  if (!data) return (
    <div className="min-h-screen bg-[#fdfdfd] flex items-center justify-center font-mono">
      <div className="animate-pulse font-black text-4xl italic">CALCULATING MASTERY...</div>
    </div>
  );

  const handleFinish = () => {
    localStorage.setItem('pinnacle_course_states_completed', 'true');
    localStorage.setItem('pinnacle_submodule_s3_status', 'completed');
    
    // 2. Head back to student dashboard
    navigate('/home-student');
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] p-8 font-mono relative overflow-y-auto select-none">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none" 
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 40px),
                           repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 40px)`
        }}
      />

      <div className="max-w-4xl mx-auto space-y-10 py-10 relative z-10">
        
        {/* Victory Header Section */}
        <div className="relative border-b-8 border-black pb-12">
          <div className="flex justify-between items-start">
            <div>
              <span className="bg-black text-white px-4 py-1 rounded-lg text-sm font-black uppercase tracking-[0.3em] mb-4 block w-fit">
                Analysis Report // {new Date().toLocaleDateString()}
              </span>
              <h1 className="text-8xl font-black uppercase italic tracking-tighter leading-none mb-4">
                Observations
              </h1>
              <p className="text-2xl font-bold text-zinc-400 italic">
                Subject: <span className="text-black uppercase underline decoration-4 decoration-[#F3B8F8]">Photosynthesis</span>
              </p>
            </div>
            
            {/* The Rank Seal */}
            <div className="relative group">
               <div className="absolute inset-0 bg-[#F3B8F8] rounded-full blur-2xl opacity-40 group-hover:opacity-100 transition-opacity" />
               <div className="relative w-32 h-32 bg-black rounded-full border-4 border-black flex items-center justify-center rotate-12 shadow-[8px_8px_0px_0px_#79E0EE]">
                  <span className="text-white text-6xl font-black italic">D</span>
               </div>
            </div>
          </div>
        </div>

        {/* The "Receipt" Scores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Object.entries(data.dimensions).map(([key, val]) => (
            <div key={key} className="bg-white border-4 border-black p-5 rounded-3xl shadow-[6px_6px_0px_0px_black] transform transition-transform hover:-translate-y-1">
              <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">{key}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">{val}</span>
                <span className="text-sm font-bold text-zinc-400">/100</span>
              </div>
            </div>
          ))}
        </div>

        {/* Insights Section */}
        
        <div className="grid md:grid-cols-2 gap-10">
          {/* Strengths */}
          <div className="bg-[#98EECC] border-[6px] border-black p-8 rounded-[40px] shadow-[12px_12px_0px_0px_black] relative overflow-hidden">
            <div className="absolute top-4 right-6 text-6xl opacity-10 font-black italic">WIN</div>
            <h3 className="text-3xl font-black uppercase italic mb-8 flex items-center gap-3 leading-none">
              <span className="text-4xl">🚀</span> The Nails
            </h3>
            <ul className="space-y-5 font-bold text-lg">
              {data.strengths && data.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-3 bg-white/30 p-3 rounded-2xl border-2 border-black/5">
                  <span className="text-black font-black">✔</span> {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Gaps/To-Do */}
          <div className="bg-[#F3B8F8] border-[6px] border-black p-8 rounded-[40px] shadow-[12px_12px_0px_0px_black] relative overflow-hidden">
             <div className="absolute top-4 right-6 text-6xl opacity-10 font-black italic">FIX</div>
            <h3 className="text-3xl font-black uppercase italic mb-8 flex items-center gap-3 leading-none">
              <span className="text-4xl">📋</span> The Catch-Up
            </h3>
            <div className="space-y-4">
              {data.missing_concepts && data.missing_concepts.map((concept, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/60 border-4 border-black p-4 rounded-2xl font-black shadow-[4px_4px_0px_0px_black]">
                  <div className="w-6 h-6 border-2 border-black bg-white shrink-0" />
                  {concept}
                </div>
              ))}
              <div className="mt-8 p-4 bg-black text-white rounded-2xl border-2 border-white shadow-[4px_4px_0px_0px_#79E0EE]">
                <p className="text-xs font-black uppercase mb-1 text-[#79E0EE]">Mentor Advice:</p>
                <p className="font-bold italic">"{data.personalized_feedback?.advice || "Keep pushing forward!"}"</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-black text-white p-10 rounded-[50px] flex flex-col md:flex-row items-center justify-between border-[6px] border-[#79E0EE] shadow-[15px_15px_0px_0px_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-8 mb-8 md:mb-0">
            <div className="w-24 h-24 bg-white border-4 border-white rounded-full flex items-center justify-center text-5xl animate-bounce shadow-[0_0_30px_rgba(255,255,255,0.4)]">
              🛡️
            </div>
            <div>
              <p className="font-black text-3xl uppercase italic tracking-widest text-[#98EECC]">Consistency Champion</p>
              <p className="font-bold text-zinc-400 italic uppercase">Course: States of Matter • Module: 02</p>
            </div>
          </div>
          
          <button 
            onClick={handleFinish} 
            className="w-full md:w-auto bg-[#79E0EE] text-black px-16 py-6 rounded-[30px] font-black text-3xl border-4 border-black shadow-[8px_8px_0px_0px_white] hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:scale-95 transition-all uppercase italic flex items-center gap-4 group"
          >
            Finish <span className="group-hover:translate-x-2 transition-transform">→</span>
          </button>
        </div>

        <div className="text-center font-black text-zinc-300 uppercase tracking-[1em] pb-10">
          End of Session Report
        </div>
      </div>
    </div>
  );
};

export default FeynmanBreakdown;