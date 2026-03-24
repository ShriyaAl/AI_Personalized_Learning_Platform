import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CourseModules = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [expandedId, setExpandedId] = useState(null);
  const [dbModules, setDbModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/courses/${courseId}/roadmap`);
        const data = await res.json();
        setDbModules(data);
        if (data.length > 0) {
          setExpandedId(data[0].id); // Expand the first module by default
        }
      } catch (err) {
        console.error("Failed to fetch roadmap:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoadmap();
  }, [courseId]);

  // Transform DB modules into UI modules
  const uiModules = dbModules.map((dbMod, modIndex) => {
    const isFirstMod = modIndex === 0;
    const modStatus = isFirstMod ? "continue" : "locked"; // Or unlock all for demo if preferred

    const subModules = (dbMod.lessons || []).map((lesson, lessonIndex) => ({
      id: lesson.id,
      title: lesson.title,
      type: lesson.type,
      status: (isFirstMod && lessonIndex === 0) ? "start" : "locked", 
      icon: lesson.type === 'video' ? '▶️' : lesson.type === 'quiz' ? '❓' : '📄'
    }));

    // Check localStorage overrides if we want dynamic testing
    // For simplicity, we just keep the first lesson unlocked
    return {
      id: dbMod.id,
      title: dbMod.title,
      progress: 0,
      status: modStatus,
      subModules: subModules,
      isFinished: false
    };
  });

  if (isLoading) {
    return (
      <div className="p-10 bg-[#121212] min-h-screen font-mono flex items-center justify-center text-white">
        <h2 className="text-3xl font-black italic animate-pulse">Loading Roadmap...</h2>
      </div>
    );
  }

  return (
    <div className="p-10 bg-[#121212] min-h-screen font-mono flex flex-col items-center select-none overflow-x-hidden relative text-white">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05]" 
           style={{ backgroundImage: `repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)` }} />

      <div className="w-full max-w-2xl flex items-center mb-16 px-4 relative z-10">
        <button onClick={() => navigate('/learn-student')} className="bg-white text-black px-6 py-2 rounded-xl border-4 border-black mr-8 shadow-[4px_4px_0px_0px_#3b82f6] font-black uppercase italic transition-all hover:bg-[#F3B8F8] active:scale-95">← BACK</button>
        <h1 className="text-5xl font-black italic uppercase tracking-tighter">Roadmap</h1>
      </div>

      <div className="w-full max-w-4xl flex flex-col items-center relative z-10">
        {uiModules.map((mod, index) => (
          <div key={mod.id} className="w-full flex flex-col items-center">
            
            {/* --- MAIN MODULE CARD --- */}
            <div 
              // Always allow expanding for demo purposes, even if locked
              onClick={() => setExpandedId(expandedId === mod.id ? null : mod.id)}
              className={`relative z-50 w-full max-w-2xl border-[6px] border-white rounded-[50px] p-8 shadow-[12px_12px_0px_0px_white] transition-all cursor-pointer
              ${mod.status === 'locked' ? 'bg-[#1a1a1a] opacity-80' : 'bg-black hover:-translate-y-1'}`}
            >
               <div className="flex justify-between items-center">
                 <h2 className="text-3xl font-black italic uppercase tracking-tight">{index + 1}. {mod.title}</h2>
                 {mod.isFinished && <span className="bg-[#98EECC] text-black text-[10px] px-3 py-1 rounded-full font-black shadow-[2px_2px_0px_0px_black] rotate-3">MASTERED</span>}
               </div>
               
               {/* Progress indicator */}
               <div className="mt-6 flex flex-col gap-4">
                 <div className="w-64 bg-zinc-900 border-4 border-white h-8 rounded-full p-1 overflow-hidden relative">
                   <div className="bg-[#3b82f6] h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${mod.progress}%` }}>
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" />
                   </div>
                 </div>
               </div>
            </div>

            {/* --- SUB-MODULES SECTION --- */}
            <div className={`w-full flex flex-col items-center transition-all duration-500 ease-in-out overflow-hidden ${expandedId === mod.id ? 'max-h-[2500px] opacity-100 py-4' : 'max-h-0 opacity-0'}`}>
              <div className="w-[6px] h-12 bg-white shrink-0" />
              {mod.subModules.map((sub, sIdx) => (
                <div key={sub.id} className="w-full relative flex items-center justify-center h-40">
                  <div className="absolute top-0 bottom-0 w-[6px] bg-white left-1/2 -translate-x-1/2" />
                  <div className={`absolute top-1/2 -translate-y-1/2 h-[6px] bg-white z-10 ${sIdx % 2 === 0 ? 'right-1/2 w-32' : 'left-1/2 w-32'}`} />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#facc15] border-2 border-black rounded-full z-20" />
                  <SubModuleCard {...sub} isLeft={sIdx % 2 === 0} currentCourseId={courseId} />
                </div>
              ))}
              
              {/* MODULE FINISH INDICATOR */}
              {mod.subModules.length > 0 && (
                <div className="w-full relative flex flex-col items-center mt-4">
                   <div className="w-[6px] h-12 bg-white" />
                   <div className={`px-8 py-3 rounded-2xl border-4 border-white font-black italic shadow-[6px_6px_0px_0px_white] ${mod.isFinished ? 'bg-[#98EECC] text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                      {mod.isFinished ? `🎉 ${mod.title} Completed` : 'Finish all submodules to unlock next'}
                   </div>
                </div>
              )}
            </div>

            {index < uiModules.length - 1 && <div className="w-[6px] h-20 bg-white" />}
          </div>
        ))}
        
        {uiModules.length === 0 && (
          <div className="mt-12 text-2xl font-black italic text-zinc-500 text-center">
            No roadmap modules found for this course.<br/>
            The teacher may still be preparing the AI syllabus.
          </div>
        )}

      </div>

      <style jsx="true">{`
        @keyframes shine { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
        .animate-shine { animation: shine 2s ease-in-out infinite; }
        @keyframes bounce-custom { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-custom { animation: bounce-custom 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

const SubModuleCard = ({ id, icon, title, status, isLeft, currentCourseId }) => {
  const navigate = useNavigate();
  // To allow hackathon testing, we'll let users click it even if locked, but change visually
  const isLocked = status === 'locked';

  return (
    <div className={`absolute flex items-center gap-6 group ${isLeft ? 'right-[calc(50%+128px)] flex-row-reverse text-right' : 'left-[calc(50%+128px)] flex-row text-left'}`}>
      <div className={`w-24 h-24 bg-black border-[6px] border-white rounded-full flex items-center justify-center text-4xl shadow-[8px_8px_0px_0px_white] relative z-20 ${!isLocked && 'group-hover:translate-x-1 cursor-pointer'}`}>
        {isLocked ? '🔒' : icon}
        {status === 'completed' && <div className="absolute -top-2 -right-2 bg-[#FF00B8] border-4 border-black rounded-full w-10 h-10 flex items-center justify-center font-black text-white text-base shadow-[2px_2px_0px_0px_white] animate-bounce-custom">✓</div>}
      </div>
      <div className={`flex flex-col min-w-[150px] ${isLeft ? 'items-end' : 'items-start'}`}>
        <h4 className="text-2xl font-black italic uppercase text-white leading-none">{title}</h4>
        
        {/* Only show 'Start' if not completed. For demo, show it always if not completely locked, or allow testing anyway. */}
        <button 
          onClick={() => navigate(`/learn-student/${currentCourseId}/${id}`)} 
          className={`mt-3 border-2 border-white px-4 py-1 rounded-full font-black text-[10px] shadow-[3px_3px_0px_0px_white] active:scale-95 uppercase italic
          ${isLocked ? 'bg-zinc-600 text-zinc-400 opacity-50' : 'bg-[#3b82f6] text-white hover:bg-white hover:text-black'}`}
        >
          {isLocked ? 'Locked' : 'Start'}
        </button>
      </div>
    </div>
  );
};

export default CourseModules;