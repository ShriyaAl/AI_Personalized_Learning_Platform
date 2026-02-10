import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CourseModules = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [expandedId, setExpandedId] = useState(1);

  const modules = [
    { 
      id: 1, 
      title: "Learn the basics", 
      progress: 67, 
      status: "continue",
      subModules: [
        { id: 's1', title: "SOLIDS", lessons: 3, status: "completed", icon: "🧪" },
        { id: 's2', title: "LIQUIDS", lessons: 4, status: "start", icon: "🧪" },
        { id: 's3', title: "GASES", lessons: 2, status: "locked", icon: "🧪" },
      ]
    },
    { id: 2, title: "Next Concept", progress: 0, status: "locked", subModules: [] },
  ];

  return (
    <div className="p-10 bg-white min-h-screen font-mono flex flex-col items-center select-none overflow-x-hidden relative">
      
      {/* Subtle grid pattern background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 40px),
                             repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 40px)`
          }}
        />
      </div>

      {/* Header */}
      <div className="w-full max-w-2xl flex items-center mb-16 px-4 relative z-10">
        <button 
          onClick={() => navigate('/learn-student')} 
          className="bg-black text-white px-6 py-2 rounded-xl border-4 border-black mr-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black hover:bg-white hover:text-black transition-all active:scale-95"
        >
          ← BACK
        </button>
        <h1 className="text-5xl font-black italic uppercase tracking-tighter">Roadmap</h1>
      </div>

      <div className="w-full max-w-4xl flex flex-col items-center relative z-10">
        {modules.map((mod, index) => (
          <div key={mod.id} className="w-full flex flex-col items-center">
            
            {/* --- MAIN MODULE CARD --- */}
            <div 
              onClick={() => mod.status !== 'locked' && setExpandedId(expandedId === mod.id ? null : mod.id)}
              className={`relative z-50 w-full max-w-2xl border-[6px] border-black rounded-[50px] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer
              ${mod.status === 'locked' 
                ? 'bg-[#F9C5F8] opacity-60 cursor-not-allowed' 
                : 'bg-gradient-to-r from-[#F3B8F8] to-[#6C63FF] hover:-translate-y-1 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] active:scale-[0.98]'}
              `}
            >
               <h2 className="text-3xl font-black italic">{index + 1}. {mod.title}</h2>
               {mod.status === 'continue' && (
                  <div className="mt-4 flex flex-col gap-4">
                    <div className="w-64 bg-white border-4 border-black h-8 rounded-full p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] overflow-hidden">
                      <div 
                        className="bg-[#8E24AA] h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden" 
                        style={{ width: `${mod.progress}%` }}
                      >
                        {/* Animated shine effect on progress bar */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shine" />
                      </div>
                    </div>
                    <button className="bg-[#2A00FF] w-fit text-white px-10 py-2 rounded-2xl font-black border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:scale-95 transition-all">
                      Continue
                    </button>
                  </div>
               )}
            </div>

            {/* --- SUB-MODULES SECTION --- */}
            <div className={`w-full flex flex-col items-center transition-all duration-500 ease-in-out overflow-hidden ${expandedId === mod.id ? 'max-h-[2500px] opacity-100 py-4' : 'max-h-0 opacity-0'}`}>
              
              <div className="w-[6px] h-12 bg-black shrink-0" />

              {mod.subModules.map((sub, sIdx) => {
                const isLeft = sIdx % 2 === 0;
                return (
                  <div key={sub.id} className="w-full relative flex items-center justify-center h-40">
                    
                    {/* THE CONTINUOUS VERTICAL SPINE */}
                    <div className="absolute top-0 bottom-0 w-[6px] bg-black left-1/2 -translate-x-1/2" />

                    {/* HORIZONTAL BRANCH */}
                    <div className={`absolute top-1/2 -translate-y-1/2 h-[6px] bg-black z-10
                      ${isLeft ? 'right-1/2 w-32' : 'left-1/2 w-32'}`} 
                    />
                    
                    {/* Decorative dot at branch junction */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-black rounded-full z-20" />
                    
                    {/* SUB-MODULE CONTENT */}
                    <div className={`absolute top-1/2 -translate-y-1/2 flex items-center
                      ${isLeft ? 'right-[calc(50%+128px)] flex-row-reverse' : 'left-[calc(50%+128px)] flex-row'}`}>
                      
                      <SubModuleCard {...sub} isLeft={isLeft} />
                    </div>
                  </div>
                );
              })}

              <div className="w-[6px] h-12 bg-black shrink-0" />
            </div>

            {/* Spacer between main cards */}
            {index < modules.length - 1 && (
              <div className="w-[6px] h-20 bg-black relative">
                {/* Small decorative notches on the spine */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-3 h-[6px] bg-black rotate-90" />
                <div className="absolute top-2/3 left-1/2 -translate-x-1/2 w-3 h-[6px] bg-black rotate-90" />
              </div>
            )}
          </div>
        ))}
        
        {/* Extra spacing before finish */}
        <div className="w-[6px] h-32 bg-black" />
        
        {/* Finish Card */}
        <div className="w-full max-w-2xl border-[6px] border-black rounded-[50px] p-10 bg-gradient-to-r from-[#FFD700] to-[#FFA500] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center hover:-translate-y-1 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer relative z-50 active:scale-[0.98]">
           <h2 className="text-3xl font-black italic uppercase tracking-tighter">🎉 Finish 🎉</h2>
        </div>

        {/* Fun footer message */}
        <div className="mt-8 text-center text-sm font-bold text-gray-400 uppercase tracking-widest">
          Keep Learning! 🚀
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-shine {
          animation: shine 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

const SubModuleCard = ({ icon, title, lessons, status, isLeft }) => {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';

  return (
    <div className={`flex items-center gap-6 group ${isLeft ? 'flex-row-reverse' : 'flex-row'}`}>
      
      {/* Icon Circle */}
      <div className="relative shrink-0">
        <div className={`w-24 h-24 bg-white border-[6px] border-black rounded-full flex items-center justify-center text-4xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all relative z-20
          ${!isLocked && 'group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-1 group-hover:translate-y-1 cursor-pointer'}`}>
          {isLocked ? '🔒' : icon}
          {isCompleted && (
            <div className="absolute -top-2 -right-2 bg-[#FF00B8] border-4 border-black rounded-full w-10 h-10 flex items-center justify-center font-black text-white text-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-bounce" style={{animationDuration: '2s'}}>
                ✓
            </div>
          )}
        </div>
        
        {/* Subtle glow effect for active items */}
        {status === 'start' && (
          <div className="absolute inset-0 bg-[#81F0FF] rounded-full blur-xl opacity-20 animate-pulse" />
        )}
      </div>
      
      {/* Text Info */}
      <div className={`flex flex-col min-w-[180px] ${isLeft ? 'items-end text-right' : 'items-start text-left'}`}>
        <h4 className="text-3xl font-black italic tracking-tighter leading-tight uppercase m-0">
          {title}
        </h4>
        <p className="font-bold text-gray-500 text-sm uppercase tracking-widest m-0">
          {lessons} lessons
        </p>
        
        {status === 'start' && (
          <button className="mt-3 bg-[#81F0FF] border-[3px] border-black px-6 py-1.5 rounded-full font-black text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:scale-95 transition-all w-fit uppercase relative overflow-hidden group/btn">
            <span className="relative z-10">Start Now</span>
            {/* Hover shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover/btn:opacity-30 transition-opacity" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseModules;