import React from 'react';

const Home = () => {
  return (
    <div className="p-8 bg-[#fdfdfd] overflow-y-auto h-full scrollbar-hide font-mono">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 40px),
                             repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 40px)`
          }}
        />
      </div>
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 
            className="text-6xl font-black text-black tracking-tight" 
            style={{ filter: 'drop-shadow(4px 4px 0px #e2e2e2)' }}
          >
            Welcome back, Alexa!
          </h1>
          <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-sm italic">
            Ready to doodle some knowledge?
          </p>
        </div>
        <div className="flex gap-4">
          <StatMiniCard count="17" label="Courses" color="bg-[#FF8B8B]" />
          <StatMiniCard count="2" label="Classrooms" color="bg-[#79E0EE]" />
          <StatMiniCard count="7" label="Challenges" color="bg-[#98EECC]" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <CourseCard 
            title="States of matter" 
            chapter="Chapter 3" 
            progress={67} 
            color="bg-[#F3B8F8]"
            accent="bg-[#D397C5]"
            image="🧪" 
          />
          <CourseCard 
            title="Algebra" 
            chapter="Chapter 4" 
            progress={75} 
            color="bg-[#C3ACD0]"
            accent="bg-[#A084CA]"
            image="🔢" 
          />
          

          <div className="bg-[#EA62D8] rounded-[45px] border-[5px] border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          
            
            <h2 className="text-4xl font-black mb-6 italic underline decoration-black underline-offset-4">
              Recent Activity
            </h2>
            
            <div className="space-y-4">
              <ActivityItem 
                type="completed" 
                text="Finished 'Atomic Structure' Quiz" 
                time="2h ago" 
                points="+50 XP" 
              />
              <ActivityItem 
                type="milestone" 
                text="Achieved 3-Day Streak!" 
                time="5h ago" 
                points="+100 XP" 
              />
              <ActivityItem 
                type="started" 
                text="Started 'Linear Equations' Chapter" 
                time="Yesterday" 
                points="" 
              />
            </div>
          </div>
        </div>

        {/* Right Column: Streak & Tasks */}
        <div className="space-y-8">
          <StreakCard />
          
          <div className="min-h-44 bg-[#BFACE2] rounded-[45px] border-[5px] border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-3xl font-black mb-4">Today's Tasks</h2>
            <div className="space-y-3 font-bold text-lg">
               <div className="flex items-center gap-3"><div className="w-5 h-5 border-3 border-black bg-white rounded-sm" /> 📝 Review Geometry</div>
               <div className="flex items-center gap-3"><div className="w-5 h-5 border-3 border-black bg-white rounded-sm" /> 🧪 Lab Report</div>
               <div className="flex items-center gap-3 opacity-40 line-through"><div className="w-5 h-5 border-3 border-black bg-black rounded-sm flex items-center justify-center text-white text-[10px]">✔</div> Algebra HW</div>
            </div>
          </div>

          <div className="h-44 bg-[#9FA8DA] rounded-[45px] border-[5px] border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex items-end">
            <h2 className="text-3xl font-black text-black/80 italic tracking-tighter">Upcoming Next...</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const StatMiniCard = ({ count, label, color }) => (
  <div className={`${color} border-[4px] border-black rounded-[25px] px-6 py-3 text-center transition-all hover:-translate-y-1 hover:shadow-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}>
    <div className="text-3xl font-black leading-none">{count}</div>
    <div className="text-xs font-black uppercase mt-1 tracking-tight">{label}</div>
  </div>
);

const CourseCard = ({ title, chapter, progress, color, accent, image }) => (
  <div className={`${color} border-[5px] border-black rounded-[50px] overflow-hidden shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]`}>
    {/* Sketchy Top Bar */}
    <div className={`${accent} h-10 border-b-[5px] border-black flex items-center px-8 gap-3`}>
        <div className="w-3 h-3 rounded-full bg-black/30" />
        <div className="w-3 h-3 rounded-full bg-black/30" />
    </div>

    <div className="p-8 flex gap-8">
      {/* Image Sticker Frame */}
      <div className="w-32 h-32 bg-white border-[5px] border-black rounded-[35px] flex items-center justify-center text-6xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] shrink-0 transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
        {image}
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-4xl font-black tracking-tight">{title}</h2>
            <p className="text-xl font-bold opacity-80 mt-1">{chapter}</p>
            <p className="text-sm font-black italic mt-1 opacity-60 uppercase tracking-tighter">{progress}% complete</p>
          </div>
          <button className="bg-black text-white px-8 py-3 rounded-[22px] text-xl font-black border-[4px] border-black hover:bg-white hover:text-black transition-all shadow-[5px_5px_0px_0px_rgba(0,0,0,0.3)] active:shadow-none active:translate-x-1 active:translate-y-1">
            RESUME
          </button>
        </div>
        
        {/* Progress Bar Container */}
        <div className="mt-8">
          <div className="w-full bg-white rounded-full h-11 border-[5px] border-black p-1.5 shadow-inner">
            <div 
              className="bg-[#8E24AA] h-full rounded-full border-r-[5px] border-black transition-all duration-1000 ease-out flex items-center justify-end px-4" 
              style={{ width: `${progress}%` }} 
            >
              <div className="w-2 h-full bg-white/20 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ActivityItem = ({ type, text, time, points }) => {
  const getIcon = () => {
    switch (type) {
      case 'completed': return '✅';
      case 'milestone': return '🏆';
      case 'started': return '🚀';
      default: return '📍';
    }
  };

  return (
    <div className="flex items-center gap-4 bg-white/15 p-3 rounded-[25px] border-3 border-black border-dashed hover:bg-white/30 transition-all group cursor-default">
      <div className="w-14 h-14 bg-white border-3 border-black rounded-full flex items-center justify-center text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-rotate-12 transition-transform">
        {getIcon()}
      </div>
      
      <div className="flex-1">
        <p className="font-black text-xl leading-tight tracking-tight">{text}</p>
        <p className="text-xs font-bold opacity-70 uppercase tracking-widest">{time}</p>
      </div>

      {points && (
        <div className="bg-white border-3 border-black px-4 py-1.5 rounded-xl font-black text-md rotate-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-0 transition-transform">
          {points}
        </div>
      )}
    </div>
  );
};

const StreakCard = () => (
  <div className="bg-[#FFF8D6] border-[5px] border-black rounded-[45px] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
    <div className="flex justify-between items-start mb-6">
      <p className="text-2xl font-black leading-none italic uppercase">
        <span className="text-5xl">3 DAY</span><br/>STREAK!
      </p>
      <div className="flex flex-col gap-2 text-xl font-black items-end">
        <div className="bg-white border-3 border-black px-3 py-1 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">1024 <span className="text-orange-500">XP</span></div>
        <div className="bg-white border-3 border-black px-3 py-1 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">32 ⚡</div>
      </div>
    </div>
    <div className="flex justify-between bg-black/5 p-5 rounded-[30px] border-3 border-black border-dotted">
      {['S', 'M', 'T'].map(day => (
        <div key={day} className="w-14 h-14 rounded-2xl border-[4px] border-black bg-[#FFD93D] flex items-center justify-center font-black text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transition-transform cursor-pointer">{day}</div>
      ))}
      {[1, 2, 3].map(i => (
        <div key={i} className="w-14 h-14 rounded-2xl border-[4px] border-black bg-[#FF8400] flex items-center justify-center text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] italic text-white hover:scale-110 transition-transform cursor-pointer">⚡</div>
      ))}
    </div>
  </div>
);

export default Home;