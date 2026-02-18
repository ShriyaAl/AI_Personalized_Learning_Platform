import React from 'react';

const CelebrationStage = () => {
  return (
    /* The main container: Slides up like a curtain */
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden font-mono animate-stage-slide-up">
      
      {/* 1. Atmospheric Depth */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F3B8F8] rounded-full filter blur-[120px] opacity-20 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#79E0EE] rounded-full filter blur-[120px] opacity-20 animate-pulse delay-700" />
      
      {/* 2. Micro-Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full opacity-40 animate-float"
            style={{
              width: '6px',
              height: '6px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDuration: 3 + Math.random() * 4 + 's',
              animationDelay: Math.random() * 2 + 's'
            }}
          />
        ))}
      </div>

      {/* 3. The Hero Asset & 4. Victory Hierarchy */}
      {/* This wrapper handles the delayed reveal after the stage slides up */}
      <div className="relative z-10 flex flex-col items-center animate-reveal-content">
        <div className="w-48 h-48 bg-white border-[8px] border-black rounded-[40px] shadow-[15px_15px_0px_0px_#98EECC] flex items-center justify-center text-7xl animate-bounce-slow">
          🏆
        </div>

        <div className="mt-12 text-center space-y-4">
          <h2 className="text-white text-sm font-black uppercase tracking-[0.5em] animate-pulse">
            Session Mastery
          </h2>
          <h1 className="text-[#98EECC] text-7xl font-black italic uppercase tracking-tighter">
            Goal Reached!
          </h1>
          <p className="text-gray-400 font-bold italic">
            "Your body remembers progress."
          </p>
        </div>
      </div>

      {/* 5. The Wipe (Exit Phase) */}
      <div className="absolute inset-0 bg-white translate-y-full animate-curtain-exit" />

      <style jsx="true">{`
        /* Master Entrance: Slides the whole black screen up */
        @keyframes stage-slide-up {
          0% { transform: translateY(100%); }
          100% { transform: translateY(0%); }
        }

        /* Content Reveal: Stays hidden for 0.8s, then pops in */
        @keyframes reveal-content {
          0%, 60% { opacity: 0; transform: scale(0.8) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
        @keyframes bounce-slow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        
        @keyframes curtain { 
          0% { transform: translateY(100%); } 
          25%, 75% { transform: translateY(0%); } 
          100% { transform: translateY(-100%); } 
        }

        .animate-stage-slide-up { 
          animation: stage-slide-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; 
        }
        
        .animate-reveal-content {
          animation: reveal-content 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-float { animation: float ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-curtain-exit { animation: curtain 4.5s cubic-bezier(0.85, 0, 0.15, 1) forwards; }
      `}</style>
    </div>
  );
};

export default CelebrationStage;