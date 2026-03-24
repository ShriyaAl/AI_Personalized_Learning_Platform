// import React from 'react'

// const Discuss = () => {
//   return (
//     <div>
//       Discuss
//     </div>
//   )
// }

// export default Discuss

import React from 'react';

const Discuss = () => {
  return (
    <div className="p-8 bg-[#fdfdfd] h-full overflow-y-auto font-mono scrollbar-hide relative">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 40px),
                           repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 40px)`
        }}
      />

      {/* Content Wrapper - relative z-10 ensures it stays above the grid */}
      <div className="relative z-10">
        {/* Header with Search and New Post */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-6xl font-black italic tracking-tighter">Forum</h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm italic mt-2">Where ideas collide</p>
          </div>
          <button className="bg-[#79E0EE] border-[5px] border-black px-8 py-3 rounded-3xl font-black text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all active:scale-95">
            + NEW TOPIC
          </button>
        </div>

        <div className="grid grid-cols-4 gap-8">
          {/* Left: Topics/Categories */}
          <div className="col-span-1 space-y-4">
            <div className="bg-black text-white p-6 rounded-[35px] border-[5px] border-black shadow-[8px_8px_0px_0px_rgba(150,150,150,1)]">
              <h3 className="text-xl font-black italic mb-4">Channels</h3>
              <ul className="space-y-3 font-bold text-sm uppercase tracking-wider">
                <li className="text-[#98EECC] cursor-pointer hover:translate-x-1 transition-all"># General</li>
                <li className="opacity-60 cursor-pointer hover:translate-x-1 transition-all"># Science_Help</li>
                <li className="opacity-60 cursor-pointer hover:translate-x-1 transition-all"># Math_Hacks</li>
                <li className="opacity-60 cursor-pointer hover:translate-x-1 transition-all"># Off_Topic</li>
              </ul>
            </div>
          </div>

          {/* Right: Thread List */}
          <div className="col-span-3 space-y-6">
            <ThreadCard 
              title="How do I calculate the atomic mass of Isotopes?" 
              user="user_99" 
              replies="12" 
              tags={['Science', 'Help']} 
              color="bg-white"
            />
            <ThreadCard 
              title="Check out my notes on Ancient Rome!" 
              user="history_buff" 
              replies="5" 
              tags={['History', 'Notes']} 
              color="bg-[#FFE5E5]"
              isPinned
            />
            <ThreadCard 
              title="Algebra Chapter 4 is so hard..." 
              user="math_warrior" 
              replies="24" 
              tags={['Math', 'Frustrated']} 
              color="bg-[#D1F3F8]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ThreadCard = ({ title, user, replies, tags, color, isPinned }) => (
  <div className={`${color} border-[5px] border-black rounded-[40px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center group cursor-pointer hover:-translate-y-1 transition-all relative z-10`}>
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-2">
        {isPinned && <span className="text-xl">📌</span>}
        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Posted by @{user}</span>
      </div>
      <h3 className="text-2xl font-black italic tracking-tight group-hover:text-[#2A00FF] transition-colors">{title}</h3>
      <div className="flex gap-2 mt-4">
        {tags.map(tag => (
          <span key={tag} className="px-3 py-1 bg-white border-2 border-black rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-black hover:text-white transition-colors">
            #{tag}
          </span>
        ))}
      </div>
    </div>
    
    <div className="flex flex-col items-center ml-8 bg-white border-4 border-black rounded-2xl px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-yellow-200 transition-colors">
      <span className="text-2xl font-black">{replies}</span>
      <span className="text-[10px] font-black uppercase opacity-60">Replies</span>
    </div>
  </div>
);

export default Discuss;