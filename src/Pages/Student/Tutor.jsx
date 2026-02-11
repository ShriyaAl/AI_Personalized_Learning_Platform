import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Vite can't find the API Key. Check your .env naming!");
}
else{
  console.log("Key is there only")
}

const genAI = new GoogleGenerativeAI(API_KEY);

const Tutor = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: "Hey! I'm your AI Buddy. Ready to master Photosynthesis?", color: "bg-[#F3B8F8]" }
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: input,
      color: "bg-white"
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Corrected model as per your find!
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      // FEYNMAN TECHNIQUE PROMPT
      const prompt = `
        Role: You are an encouraging Academic Mentor. 
        Context: The student is explaining Photosynthesis using the Feynman Technique.
        
        Guidelines for your Persona:
        1. Tone: Professional yet accessible. Speak like a supportive university tutor. Avoid childish analogies, but don't be a cold textbook either.
        2. Detection: If the student uses a big term (like "Light-independent reactions"), ask them to describe the actual "input and output" of that stage in plain English to prove they understand the mechanism.
        3. Scaffolding: When you see a struggle, ask a "Leading Question." (e.g., "You've got the sunlight part down, but what happens to the water molecule once it enters the system?")
        4. Focus: Focus on the "Energy Transformation." If the student misses how light energy becomes chemical energy, nudge them back to that specific conversion.
        5. Structure: Keep your responses to 2-3 sentences max. Be punchy and keep the ball in their court.
        
        Current Explanation: ${input}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        text: response.text(),
        color: "bg-[#79E0EE]"
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        text: "My brain hit a snag! Check if the API key in your .env is correct.",
        color: "bg-[#FF8B8B]"
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#fdfdfd] font-mono p-8 scrollbar-hide relative overflow-hidden">
      {/* Your Custom Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 40px),
                           repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 40px)`
        }}
      />
      
      {/* Header */}
      <div className="mb-8 relative z-10">
        <h1 className="text-5xl font-black italic uppercase tracking-tighter flex items-center gap-4">
          <span className="bg-black text-white px-4 py-1 rounded-2xl rotate-[-2deg] shadow-[4px_4px_0px_0px_rgba(152,238,204,1)] text-3xl">AI</span> 
          Tutor Buddy
        </h1>
      </div>

      {/* Main Chat Box */}
      <div className="flex-1 border-[6px] border-black rounded-[50px] bg-[#f8f8f8] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden relative z-10">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="relative max-w-[85%]">
                <div className={`${msg.color} border-[4px] border-black p-5 rounded-[30px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}>
                  <p className="text-lg font-black leading-tight text-black whitespace-pre-wrap">{msg.text}</p>
                </div>
                <div className={`absolute -top-3 ${msg.type === 'bot' ? '-left-3' : '-right-3'} w-10 h-10 bg-white border-4 border-black rounded-full flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
                  {msg.type === 'bot' ? '🤖' : '👩‍🎓'}
                </div>
              </div>
            </div>
          ))}
          {loading && <div className="animate-pulse font-black text-gray-400 italic">Buddy is thinking...</div>}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t-[6px] border-black">
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a question..."
              className="w-full bg-[#fdfdfd] border-[4px] border-black rounded-[25px] py-4 px-8 text-xl font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all italic"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-white px-6 py-2 rounded-xl font-black border-2 border-black hover:bg-[#2A00FF] transition-all active:scale-90">
              SEND
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Tutor;