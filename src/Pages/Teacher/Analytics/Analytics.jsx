import React from 'react';
import TeacherNavbar from '../../../Components/TeacherNavbar';

const Analytics = () => {
  return (
    <div className="h-screen bg-[#121212] overflow-hidden flex flex-col font-sans">
      <TeacherNavbar activeTab="analytics" />
      
      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* Background Grid */}
        <div 
          className="absolute inset-0 opacity-[0.05] pointer-events-none" 
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px),
                             repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)`
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2">
                Performance <span className="text-[#3b82f6]">Analytics</span>
              </h1>
              <p className="text-gray-400 font-medium">Track student progress and engagement metrics</p>
            </div>
            <div className="bg-[#facc15] px-6 py-2 border-4 border-black shadow-[4px_4px_0px_0px_#000] font-black transform -rotate-2">
              TERM 1 - 2026
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Main Stats Row */}
            <div className="col-span-12 grid grid-cols-4 gap-6 mb-4">
              <StatCard 
                title="Active Students" 
                value="142" 
                change="+12%" 
                color="bg-[#a855f7]" 
                icon="👥"
              />
              <StatCard 
                title="Avg. Quiz Score" 
                value="84%" 
                change="+5%" 
                color="bg-[#3b82f6]" 
                icon="📊"
              />
              <StatCard 
                title="Assignments" 
                value="28" 
                change="Pending: 4" 
                color="bg-[#22c55e]" 
                icon="📝"
              />
              <StatCard 
                title="Engagement" 
                value="High" 
                change="Top 10%" 
                color="bg-[#facc15]" 
                icon="🔥"
              />
            </div>

            {/* Large Chart Area */}
            <div className="col-span-8 bg-white border-[4px] border-black rounded-[24px] p-8 shadow-[8px_8px_0px_0px_#000]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black uppercase italic">Student Progress Overview</h3>
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#3b82f6]"></span>
                  <span className="text-sm font-bold">Science</span>
                  <span className="w-3 h-3 rounded-full bg-[#facc15] ml-4"></span>
                  <span className="text-sm font-bold">Math</span>
                </div>
              </div>
              
              {/* Mock Bar Chart */}
              <div className="h-64 flex items-end justify-between gap-4 px-4 pb-4 border-b-4 border-black">
                {/* Static Bars */}
                <ChartBar height="60%" label="Mon" color="bg-[#3b82f6]" />
                <ChartBar height="85%" label="Tue" color="bg-[#3b82f6]" />
                <ChartBar height="45%" label="Wed" color="bg-[#3b82f6]" />
                <ChartBar height="90%" label="Thu" color="bg-[#3b82f6]" />
                <ChartBar height="75%" label="Fri" color="bg-[#3b82f6]" />
                <ChartBar height="50%" label="Sat" color="bg-[#a855f7]" />
                <ChartBar height="30%" label="Sun" color="bg-[#a855f7]" />
              </div>
            </div>

            {/* Side Panel - Top Performers */}
            <div className="col-span-4 space-y-6">
              <div className="bg-[#ff9f1c] border-[4px] border-black rounded-[24px] p-6 shadow-[8px_8px_0px_0px_#000]">
                <h3 className="text-xl font-black uppercase mb-4 text-black">🏆 Top Performers</h3>
                <div className="space-y-3">
                  <PerformerRow name="Alice Chen" score="98%" avatar="👩‍🎓" />
                  <PerformerRow name="Marcus Johnson" score="96%" avatar="👨‍🎓" />
                  <PerformerRow name="Sarah Smith" score="94%" avatar="👩‍🎓" />
                  <PerformerRow name="David Lee" score="91%" avatar="👨‍🎓" />
                </div>
              </div>

              <div className="bg-[#2ec4b6] border-[4px] border-black rounded-[24px] p-6 shadow-[8px_8px_0px_0px_#000]">
                <h3 className="text-xl font-black uppercase mb-4 text-black">⚠️ Needs Attention</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-white/50 p-2 rounded-lg border-2 border-black">
                    <span className="font-bold">Physics Quiz 3</span>
                    <span className="bg-red-500 text-white text-xs font-black px-2 py-1 border border-black rounded">LOW AVG</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/50 p-2 rounded-lg border-2 border-black">
                    <span className="font-bold">Chem Lab 1</span>
                    <span className="bg-orange-400 text-black text-xs font-black px-2 py-1 border border-black rounded">LATE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, change, color, icon }) => (
  <div className={`${color} border-[4px] border-black rounded-[20px] p-6 shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000] transition-all cursor-pointer`}>
    <div className="flex justify-between items-start mb-2">
      <span className="text-3xl bg-white w-10 h-10 flex items-center justify-center rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000]">{icon}</span>
    </div>
    <div className="mt-4">
      <p className="font-bold uppercase text-xs tracking-wider opacity-80">{title}</p>
      <h2 className="text-4xl font-black my-1">{value}</h2>
      <span className="bg-white px-2 py-0.5 rounded border border-black text-xs font-bold">{change}</span>
    </div>
  </div>
);

const ChartBar = ({ height, label, color }) => (
  <div className="flex flex-col items-center flex-1 h-full justify-end group">
    <div 
      className={`w-full ${color} border-2 border-black rounded-t-lg transition-all duration-300 group-hover:opacity-80`}
      style={{ height: height }}
    ></div>
    <span className="mt-2 font-bold text-xs text-gray-500">{label}</span>
  </div>
);

const PerformerRow = ({ name, score, avatar }) => (
  <div className="flex items-center justify-between bg-white p-3 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
    <div className="flex items-center gap-3">
      <span className="text-xl bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full border border-black">{avatar}</span>
      <span className="font-bold">{name}</span>
    </div>
    <span className="font-black text-[#22c55e]">{score}</span>
  </div>
);

export default Analytics;
