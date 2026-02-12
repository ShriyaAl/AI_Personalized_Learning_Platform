import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import confetti from 'canvas-confetti';

const LessonView = () => {
  const navigate = useNavigate();
  const { courseId, subModuleId } = useParams();

  const formatText = (text) => text?.replace(/-/g, ' ').toUpperCase();

  const handleSaveAndContinue = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F3B8F8', '#98EECC', '#facc15', '#3b82f6', '#ffffff']
    });

    // 1. Mark specific submodule as done
    localStorage.setItem(`pinnacle_submodule_${subModuleId}_status`, 'completed');

    // 2. Selective Course Completion Logic
    if (courseId === 'states-of-matter' && subModuleId === 's3') {
      localStorage.setItem('pinnacle_course_states_completed', 'true');
    } 
    
    if (courseId === 'thermodynamics' && subModuleId === 't2') {
      localStorage.setItem('pinnacle_course_thermo_completed', 'true');
    }

    setTimeout(() => {
      navigate(`/learn-student/${courseId}`);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-[#121212] font-mono text-white p-8 relative overflow-hidden flex flex-col">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none" 
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px),
                           repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)`
        }}
      />

      {/* Top Navigation Bar */}
      <div className="relative z-10 flex justify-between items-center mb-10">
        <button 
          onClick={() => navigate(`/learn-student/${courseId}`)}
          className="bg-white text-black px-6 py-2 rounded-xl border-4 border-black font-black hover:bg-[#F3B8F8] transition-all shadow-[4px_4px_0px_0px_#3b82f6] active:scale-95 uppercase italic"
        >
          ← ROADMAP
        </button>
        
        <div className="flex gap-4">
            <div className="bg-black border-2 border-zinc-700 px-4 py-2 rounded-xl">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Course</span>
                <span className="text-sm font-black text-white uppercase">{formatText(courseId)}</span>
            </div>
            <div className="bg-[#facc15] text-black border-2 border-black px-4 py-2 rounded-xl shadow-[4px_4px_0px_0px_white]">
                <span className="text-[10px] font-black uppercase tracking-widest block opacity-60">Module</span>
                <span className="text-sm font-black uppercase">{formatText(subModuleId)}</span>
            </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 grid grid-cols-12 gap-10">
        
        {/* LEFT: Academic Content Area */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
          <div className="bg-white text-black border-[6px] border-black rounded-[40px] p-12 shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] overflow-y-auto max-h-[80vh] scrollbar-hide">
            <div className="mb-10 border-b-4 border-black pb-6">
                <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Core Theory</span>
                <h2 className="text-5xl font-black italic uppercase tracking-tighter mt-2 leading-none">
                  Understanding {formatText(subModuleId)}
                </h2>
            </div>

            <div className="space-y-8 font-bold text-lg leading-relaxed">
                <section>
                    <h3 className="text-2xl font-black uppercase mb-4 underline decoration-4 decoration-[#98EECC] underline-offset-4">1. Molecular Dynamics</h3>
                    <p>To master the properties of <strong>{formatText(subModuleId)}</strong>, we analyze atomic vibration levels. In this state, particles demonstrate specific kinetic behaviors that differ significantly from previous modules.</p>
                </section>

                <section className="bg-zinc-50 border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#3b82f6]">
                    <h3 className="text-xl font-black uppercase mb-3">Technical Definitions</h3>
                    <ul className="list-none space-y-4">
                        <li className="flex gap-4 italic border-b-2 border-zinc-200 pb-2">
                            <span className="text-[#3b82f6]">01.</span>
                            <span><strong>Thermal Flux:</strong> The rate of heat energy transfer through a given surface.</span>
                        </li>
                    </ul>
                </section>
                
                <p>Ensure you have documented the primary state changes before proceeding to the final evaluation.</p>
            </div>
          </div>
        </div>

        {/* RIGHT: Sidebar */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          <div className="bg-[#98EECC] border-[6px] border-black rounded-[40px] p-8 shadow-[10px_10px_0px_0px_white] text-black">
            <h3 className="text-2xl font-black italic uppercase mb-8 border-b-4 border-black pb-2">Syllabus</h3>
            <div className="space-y-6 font-black text-sm uppercase">
              <div className="flex items-center gap-4 opacity-40">✓ 01. Overview</div>
              <div className="flex items-center gap-4 underline decoration-4 decoration-black underline-offset-4">02. Core Theory</div>
              <div className="flex items-center gap-4 opacity-40">03. Evaluation</div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/tutor-student')}
            className="bg-[#F3B8F8] border-[6px] border-black p-8 rounded-[40px] shadow-[10px_10px_0px_0px_#3b82f6] text-black text-left transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:scale-95 group"
          >
            <h3 className="text-2xl font-black italic uppercase">Ask Buddy 🤖</h3>
          </button>

          <button 
            onClick={handleSaveAndContinue}
            className="mt-auto w-full bg-[#facc15] text-black py-6 rounded-[35px] font-black text-2xl border-[5px] border-black shadow-[10px_10px_0px_0px_white] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all active:scale-95 uppercase italic"
          >
            Save & Continue →
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonView;