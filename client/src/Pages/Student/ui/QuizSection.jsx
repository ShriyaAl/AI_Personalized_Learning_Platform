import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const QuizSection = ({ subModuleId, courseId, lessonTitle, onComplete, materialContext }) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0); 
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState('HARD'); // Difficulty sequence: HARD -> MEDIUM -> EASY
  const [attempt, setAttempt] = useState(1);

  const generateQuiz = async (diff) => {
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subModuleId, courseId, lessonTitle, diff, materialContext })
      });
      if (!response.ok) throw new Error("Failed to generate quiz");
      const data = await response.json();
      
      setQuestions(data.slice(0, 5));
      setAnswers({});
      setScore(0);
      setLoading(false);
      setCurrentStep(1);
    } catch (error) {
      console.error("Quiz Generation Failed:", error);
      setLoading(false);
      setQuestions([
        {
          question: "What is a core property of this module?",
          options: ["Property A", "Property B", "Property C", "Property D"],
          correct: 0,
          explanation: "Fallback question."
        }
      ]);
      setCurrentStep(1);
    }
  };

  useEffect(() => {
    generateQuiz(difficulty);
  }, [subModuleId]);

  const handleAnswer = (index) => {
    const isCorrect = index === questions[currentStep - 1].correct;
    if (isCorrect) setScore(s => s + 1);

    if (currentStep < questions.length) {
      setCurrentStep(s => s + 1);
    } else {
      finishQuiz(isCorrect ? score + 1 : score);
    }
  };

  const finishQuiz = (finalScore) => {
    if (finalScore > 2) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    setCurrentStep(questions.length + 1);
  };

  const handleRetake = () => {
    let nextDifficulty = difficulty;
    if (difficulty === 'HARD') nextDifficulty = 'MEDIUM';
    else if (difficulty === 'MEDIUM') nextDifficulty = 'EASY';
    
    setDifficulty(nextDifficulty);
    setAttempt(a => a + 1);
    generateQuiz(nextDifficulty);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center font-mono">
        <div className="w-20 h-20 border-8 border-[#facc15] border-t-transparent rounded-full animate-spin mb-8" />
        <h2 className="text-[#facc15] text-3xl font-black italic uppercase animate-pulse">
          {attempt > 1 ? `Adjusting Level to ${difficulty}...` : 'Generating Mastery Check...'}
        </h2>
        <p className="text-white/40 mt-4 font-bold italic text-center max-w-sm">
          {materialContext
            ? '📄 Crafting questions from your uploaded learning material...'
            : difficulty === 'HARD' ? '"Harder questions build stronger neural paths."' : '"Let\'s try a different perspective."'}
        </p>
      </div>
    );
  }

  const isResults = currentStep > questions.length;
  const currentQ = questions[currentStep - 1];
  const passed = score > 2;

  return (
    <div className="fixed inset-0 z-[200] bg-black bg-opacity-95 flex items-center justify-center p-8 font-mono overflow-y-auto">
      <div className={`w-full max-w-4xl bg-[#fdfdfd] border-[8px] border-black rounded-[50px] p-12 shadow-[20px_20px_0px_0px_white] relative text-black`}>
        
        {!isResults ? (
          <>
            <div className="flex justify-between items-center mb-10 pb-6 border-b-4 border-black border-dashed">
                <div className="flex gap-4">
                  <span className="bg-black text-white px-6 py-2 rounded-2xl font-black italic shadow-[4px_4px_0px_0px_#facc15]">
                    Q {currentStep}/5
                  </span>
                  <span className="bg-[#98EECC] border-2 border-black px-4 py-2 rounded-2xl text-xs font-black uppercase text-black rotate-2">
                    Level: {difficulty}
                  </span>
                </div>
                <span className="text-sm font-black uppercase text-gray-400">Personalized Quiz</span>
            </div>

            <h2 className="text-4xl font-black leading-tight mb-12 tracking-tighter">
              {currentQ.question}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="bg-white border-4 border-black p-6 rounded-[30px] text-xl font-black text-left hover:bg-[#F3B8F8] hover:-translate-y-1 transition-all shadow-[8px_8px_0px_0px_black] active:shadow-none active:translate-y-1"
                >
                  <span className="text-gray-300 mr-4">0{idx + 1}.</span>
                  {option}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center space-y-10">
            <div className={`w-36 h-36 ${passed ? 'bg-[#98EECC]' : 'bg-[#FF8B8B]'} border-[6px] border-black rounded-full flex items-center justify-center text-7xl mx-auto shadow-[10px_10px_0px_0px_black] ${passed ? 'rotate-6 animate-bounce' : 'rotate-[-6deg]'}`}>
              {passed ? '🏆' : '🧠'}
            </div>
            
            <div>
              <h2 className="text-6xl font-black italic uppercase tracking-tighter mb-2">
                {passed ? "Mastery Achieved!" : "Keep Pushing!"}
              </h2>
              <p className="text-2xl font-bold italic text-gray-500">
                Performance: {score}/5 Questions Correct
              </p>
              {!passed && (
                <p className="text-[#FF8B8B] font-black uppercase mt-4 animate-pulse">
                  Target Score: {'>'} 2 to Unlock Module
                </p>
              )}
            </div>

            {passed ? (
               <div className="bg-[#FFF8D6] border-4 border-black p-8 rounded-[40px] shadow-[10px_10px_0px_0px_black] inline-block">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="text-center">
                      <span className="block text-4xl font-black">+{score * 20}</span>
                      <span className="text-xs font-black uppercase opacity-60">Mastery XP</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-4xl font-black">+1</span>
                      <span className="text-xs font-black uppercase opacity-60">⚡ Lightning</span>
                    </div>
                  </div>
               </div>
            ) : (
              <div className="bg-zinc-100 border-4 border-black border-dashed p-6 rounded-[30px] max-w-md mx-auto">
                <p className="text-sm font-bold italic opacity-70 italic underline">
                   "Difficulty is the best teacher. Let's try once more with a different set of questions."
                </p>
              </div>
            )}

            <div>
              {passed ? (
                <button 
                  onClick={() => onComplete(score, attempt)}
                  className="w-full bg-[#facc15] text-black py-6 rounded-[35px] font-black text-3xl border-[6px] border-black shadow-[12px_12px_0px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all active:scale-95 uppercase italic"
                >
                  Claim Rewards & Continue →
                </button>
              ) : (
                <button 
                  onClick={handleRetake}
                  className="w-full bg-black text-white py-6 rounded-[35px] font-black text-3xl border-[6px] border-black shadow-[12px_12px_0px_0px_#FF8B8B] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all active:scale-95 uppercase italic"
                >
                  Retake Master Check →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizSection;
