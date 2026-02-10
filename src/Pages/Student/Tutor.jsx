import React, { useState } from 'react';

const Tutor = () => {
  const [input, setInput] = useState("");
  
  // Sample Chat History
  const messages = [
    { id: 1, type: 'bot', text: "Hey Alexa! I'm your AI Buddy. Ready to smash some study goals today?", color: "bg-[#F3B8F8]" },
    { id: 2, type: 'user', text: "Can you explain photosynthesis? Keep it simple!", color: "bg-white" },
    { id: 3, type: 'bot', text: "Think of it like a plant's kitchen! 🌿 It takes sunlight, water, and air to 'cook' its own food (sugar).", color: "bg-[#79E0EE]" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#fdfdfd] font-mono p-8 scrollbar-hide">
       <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 40px),
                           repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 40px)`
        }}
      />
      
      {/* --- HEADER --- */}
      <div className="mb-8">
        <h1 className="text-5xl font-black italic uppercase tracking-tighter flex items-center gap-4">
          <span className="bg-black text-white px-4 py-1 rounded-2xl rotate-[-2deg] shadow-[4px_4px_0px_0px_rgba(152,238,204,1)]">AI</span> 
          Tutor Buddy
        </h1>
        <p className="text-gray-500 font-bold text-sm italic mt-2 uppercase tracking-widest">
          Your personal study sidekick
        </p>
      </div>

      {/* --- THE MAIN CHAT BOX --- */}
      <div className="flex-1 border-[6px] border-black rounded-[50px] bg-[#f8f8f8] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
        
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide relative">
          {/* Subtle grid background pattern to look like graph paper */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', size: '20px 20px' }} />

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="relative max-w-[85%]">
                
                {/* Message Bubble */}
                <div className={`${msg.color} border-[4px] border-black p-5 rounded-[30px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1`}>
                  <p className="text-lg font-black leading-tight tracking-tight text-black">
                    {msg.text}
                  </p>
                </div>

                {/* Avatar Badge */}
                <div className={`absolute -top-3 ${msg.type === 'bot' ? '-left-3' : '-right-3'} w-10 h-10 bg-white border-4 border-black rounded-full flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10`}>
                  {msg.type === 'bot' ? '🤖' : '👩‍🎓'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- INPUT BAR (Inside the box) --- */}
        <div className="p-6 bg-white border-t-[6px] border-black">
          <div className="relative group">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Buddy a question..."
              className="w-full bg-[#fdfdfd] border-[4px] border-black rounded-[25px] py-4 px-8 text-xl font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all placeholder:text-gray-300 italic"
            />
            
            <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-white px-6 py-2 rounded-xl font-black border-2 border-black hover:bg-[#2A00FF] transition-all active:scale-90 shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)]">
              SEND
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutor;