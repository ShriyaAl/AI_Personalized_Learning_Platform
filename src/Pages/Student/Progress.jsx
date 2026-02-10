// import React from 'react'

// const Progress = () => {
//   return (
//     <div>
//       Progress
//     </div>
//   )
// }

// export default Progress

import React from 'react';

const Progress = () => {
  return (
    <div className="p-8 bg-[#fdfdfd] overflow-y-auto h-full scrollbar-hide font-mono">
      {/* Header section with high-impact decoration */}
      <div className="mb-10 relative">
        <h1 className="text-6xl font-black text-black tracking-tight italic">
          Your Progress Log
        </h1>
      </div>

      {/* Grid Layout: Stats at the Top, Charts in the Middle */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        <StatSticker label="Total XP" value="12,450" color="bg-[#FFB7B7]" icon="✨" />
        <StatSticker label="Days Active" value="42" color="bg-[#98EECC]" icon="📅" />
        <StatSticker label="Quizzes Done" value="28" color="bg-[#F3B8F8]" icon="📝" />
        <StatSticker label="Badges" value="15" color="bg-[#FFF8D6]" icon="🏅" />
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Left Side: Learning Time Chart (Simulated) */}
        <div className="col-span-2 bg-white border-[6px] border-black rounded-[50px] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black italic underline decoration-[#8E24AA] underline-offset-4">Study Time (Hours)</h2>
            <div className="bg-black text-white px-4 py-1 rounded-xl text-xs font-black uppercase tracking-tighter shadow-[4px_4px_0px_0px_rgba(100,100,100,1)]">
              This Week
            </div>
          </div>
          
          {/* Mock Bar Chart using Flexbox */}
          <div className="flex items-end justify-between h-64 gap-4 px-4 border-b-4 border-black border-dashed">
            <Bar day="Mon" height="h-[40%]" />
            <Bar day="Tue" height="h-[75%]" color="bg-[#79E0EE]" />
            <Bar day="Wed" height="h-[60%]" />
            <Bar day="Thu" height="h-[90%]" color="#FF8B8B" highlight />
            <Bar day="Fri" height="h-[55%]" />
            <Bar day="Sat" height="h-[30%]" />
            <Bar day="Sun" height="h-[20%]" />
          </div>
        </div>

        {/* Right Side: Skill Breakdown (The "Stickers") */}
        <div className="space-y-8">
          <div className="bg-[#BFACE2] border-[5px] border-black rounded-[45px] p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-2xl font-black mb-6 italic">Subject Mastery</h3>
            <div className="space-y-6">
              <MasteryItem label="Science" progress={85} color="bg-[#98EECC]" />
              <MasteryItem label="Math" progress={45} color="bg-[#79E0EE]" />
              <MasteryItem label="History" progress={90} color="bg-[#FFB7B7]" />
            </div>
          </div>

          <div className="bg-black text-white rounded-[45px] p-8 border-[5px] border-black shadow-[10px_10px_0px_0px_rgba(150,150,150,1)] text-center relative group cursor-pointer hover:rotate-2 transition-transform">
             <div className="absolute -top-4 -right-2 text-4xl group-hover:animate-bounce">👑</div>
             <p className="text-sm font-bold uppercase opacity-60">Current Rank</p>
             <h4 className="text-4xl font-black italic tracking-tighter">Knowledge Knight</h4>
             <p className="mt-4 text-xs font-mono opacity-80 italic">250 XP to next level</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const StatSticker = ({ label, value, color, icon }) => (
  <div className={`${color} border-[5px] border-black rounded-[30px] p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 transition-transform hover:-translate-y-1`}>
    <div className="w-12 h-12 bg-white border-3 border-black rounded-full flex items-center justify-center text-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black uppercase opacity-60 m-0 leading-none">{label}</p>
      <p className="text-2xl font-black m-0 tracking-tight">{value}</p>
    </div>
  </div>
);

const Bar = ({ day, height, color = "bg-[#F3B8F8]", highlight }) => (
  <div className="flex flex-col items-center flex-1 gap-2 group">
    <div className={`w-full ${color} border-[4px] border-black rounded-t-xl transition-all duration-500 ease-in-out shadow-[4px_0px_0px_0px_rgba(0,0,0,1)] group-hover:brightness-95 ${height} relative`}>
      {highlight && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          PEAK DAY!
        </div>
      )}
    </div>
    <span className="text-xs font-black uppercase tracking-widest">{day}</span>
  </div>
);

const MasteryItem = ({ label, progress, color }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-end">
      <span className="text-sm font-black italic">{label}</span>
      <span className="text-[10px] font-bold opacity-60 uppercase">{progress}%</span>
    </div>
    <div className="w-full bg-white border-[3px] border-black h-5 rounded-full p-0.5 overflow-hidden">
      <div 
        className={`${color} h-full rounded-full border-r-2 border-black transition-all duration-1000`}
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

export default Progress;