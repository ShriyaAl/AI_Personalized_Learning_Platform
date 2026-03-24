import React, { useState, useEffect, useRef } from 'react';

import FeynmanBreakdown from './ui/FeynmanBreakdown';     // ← adjust path
import CelebrationStage from './ui/CelebrationStage';   // ← adjust path

const Tutor = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [finalAssessment, setFinalAssessment] = useState(null);

  const scrollRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hey! I'm your AI Buddy. Ready to master Photosynthesis? 🌱\n\nExplain it to me like I've never heard of it before — don't worry about being perfect, just start talking. When you're done with our session, just type done and I'll give you your full breakdown.",
      color: "bg-[#F3B8F8]"
    }
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSessionEnd = async (history) => {
    try {
      const response = await fetch('http://localhost:3000/api/ai/tutor/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history })
      });
      if (!response.ok) throw new Error("Failed to generate summary");
      const { finalAssessment } = await response.json();

      setFinalAssessment(finalAssessment);
      setSessionEnded(true);

      if (finalAssessment) {
        const { dimensions, overall_score, strengths, misconceptions, missing_concepts, personalized_feedback, next_steps } = finalAssessment;

        const feedbackMessages = {
          completeness: "You covered some ground but missed a few key concepts. Review the missing concepts listed above and try explaining them out loud.",
          accuracy: "A few facts were off — totally fixable. Focus on the misconceptions above and re-read those specific sections.",
          coherence: "Your knowledge is there but the explanation felt scattered. Try structuring it: inputs → process → outputs.",
          simplicity: "You leaned on technical terms a bit. Feynman's trick: explain it so simply a 10-year-old could follow. Try again without any jargon."
        };

        const summaryMessage = `📊 Your Feynman Breakdown

Completeness — ${dimensions.completeness}/100
Accuracy — ${dimensions.accuracy}/100
Coherence — ${dimensions.coherence}/100
Simplicity — ${dimensions.simplicity}/100

Overall: ${overall_score}/100

✅ What you nailed:
${strengths.map(s => `• ${s}`).join('\n')}
${misconceptions.length > 0 ? `\n⚠️ Misconceptions to fix:\n${misconceptions.map(m => `• ${m}`).join('\n')}` : ''}
${missing_concepts.length > 0 ? `\n📋 Concepts to revisit:\n${missing_concepts.map(c => `• ${c}`).join('\n')}` : ''}

💡 Focus area: ${feedbackMessages[personalized_feedback.lowest_dimension] || personalized_feedback.advice}

Next steps:
${next_steps.map(s => `→ ${s}`).join('\n')}`;

        // setMessages(prev => [...prev, {
        //   id: Date.now(),
        //   type: 'bot',
        //   text: summaryMessage,
        //   color: "bg-[#F3B8F8]"
        // }]);

        // Trigger celebration → breakdown sequence
        setTimeout(() => {
          setShowCelebration(true);
          setTimeout(() => {
            setShowCelebration(false);
            setShowBreakdown(true);
          }, 5800); // time for curtain + particles to finish
        }, 1200); // small delay to let user read the chat summary
      } else {
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'bot',
          text: "Great session! I had trouble generating your full breakdown, but you should be proud of the work you put in. Review the concepts you found tricky and try again soon.",
          color: "bg-[#F3B8F8]"
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        text: "Couldn't generate your summary right now — but great session! Try again soon.",
        color: "bg-[#FF8B8B]"
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading || sessionEnded) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: input,
      color: "bg-white"
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput("");
    setLoading(true);

    // Check for session end
    if (currentInput.toLowerCase() === "done") {
      await handleSessionEnd(conversationHistory);
      return;
    }

    const updatedHistory = [...conversationHistory, { role: "student", text: currentInput }];

    try {
      const response = await fetch('http://localhost:3000/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: updatedHistory })
      });
      if (!response.ok) throw new Error("Failed to get tutor response");
      
      const { text: botText, gapAnalysis } = await response.json();

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: botText,
        color: "bg-[#79E0EE]"
      };

      setMessages(prev => [...prev, botMessage]);
      setConversationHistory([...updatedHistory, { role: "tutor", text: botText }]);

      console.log("Gap analysis:", gapAnalysis);

    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        text: "My brain hit a snag! Make sure the backend server and endpoints are running correctly.",
        color: "bg-[#FF8B8B]"
      }]);
    } finally {
      setLoading(false);
    }
  };

  // ────────────────────────────────────────────────────────────────
  //                          RENDERING LOGIC
  // ────────────────────────────────────────────────────────────────

  // 1. Celebration full screen
  if (showCelebration) {
    return <CelebrationStage />;
  }

  // 2. Detailed breakdown full screen
  if (showBreakdown && finalAssessment) {
    return (
      <FeynmanBreakdown
        data={finalAssessment}
        onBack={() => {
          setShowBreakdown(false);
          // Optional: reset session completely
          // setMessages([/* initial message */]);
          // setConversationHistory([]);
          // setSessionEnded(false);
          // setFinalAssessment(null);
        }}
      />
    );
  }

  // 3. Normal chat view
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
      <div className="flex-1 border-[6px] border-black rounded-[50px] bg-[#f8f8f8] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden relative z-10 min-h-125 max-h-[70vh]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide custom-scrollbar">
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
            <textarea 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a question..."
              disabled={sessionEnded}
              className="w-full bg-[#fdfdfd] border-[4px] border-black rounded-[25px] py-4 px-8 text-xl font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all italic disabled:opacity-50"
            />
            <button 
              type="submit" 
              disabled={sessionEnded || loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-white px-6 py-2 rounded-xl font-black border-2 border-black hover:bg-[#2A00FF] transition-all active:scale-90 disabled:opacity-50"
            >
              SEND
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Tutor;