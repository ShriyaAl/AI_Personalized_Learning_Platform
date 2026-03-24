import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import QuizSection from './QuizSection';

const LessonView = () => {
  const navigate = useNavigate();
  const { courseId, subModuleId } = useParams();
  const [showQuiz, setShowQuiz] = useState(false);
  const [lessonData, setLessonData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [personalizedContent, setPersonalizedContent] = useState(null);
  const [materialRawText, setMaterialRawText] = useState(null); // raw text for quiz
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [videoResult, setVideoResult] = useState(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  // Explain Buddy (Feynman) state
  const [showExplainBuddy, setShowExplainBuddy] = useState(false);
  const [buddyHistory, setBuddyHistory] = useState([]);
  const [buddyInput, setBuddyInput] = useState('');
  const [buddyLoading, setBuddyLoading] = useState(false);
  const [buddyGapAnalysis, setBuddyGapAnalysis] = useState(null);
  const [buddySessionEnded, setBuddySessionEnded] = useState(false);
  const [buddyBreakdownData, setBuddyBreakdownData] = useState(null);


  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/lessons/${subModuleId}`);
        const data = await res.json();
        setLessonData(data);

        // If lesson has a file attached, fetch personalized content + raw text
        if (data?.content_url) {
          setIsLoadingContent(true);
          try {
            const contentRes = await fetch(`http://localhost:3000/api/lessons/${subModuleId}/personalized-content`);
            const contentData = await contentRes.json();
            if (contentData?.content) {
              setPersonalizedContent(contentData.content);
            }
            if (contentData?.rawText) {
              setMaterialRawText(contentData.rawText);
            }
          } catch (contentErr) {
            console.error("Failed to fetch personalized content:", contentErr);
          } finally {
            setIsLoadingContent(false);
          }
        }
      } catch (err) {
        console.error("Failed to fetch lesson:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLesson();
  }, [subModuleId]);

  const formatText = (text) => text?.replace(/-/g, ' ').toUpperCase();

  const handleSaveAndContinue = () => {
    setShowQuiz(true);
  };

  const handleQuizComplete = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F3B8F8', '#98EECC', '#facc15', '#3b82f6', '#ffffff']
    });

    localStorage.setItem(`pinnacle_submodule_${subModuleId}_status`, 'completed');

    setTimeout(() => {
      navigate(`/learn-student/${courseId}`);
    }, 1500);
  };

  const fetchVideoReference = async () => {
    setShowVideo(true);
    if (videoResult) return; // already fetched
    setIsLoadingVideo(true);
    try {
      const keyword = lessonData?.title || subModuleId;
      const res = await fetch(`http://localhost:3000/api/videos/search?keyword=${encodeURIComponent(keyword)}`);
      const data = await res.json();
      if (data.videoResult) {
        setVideoResult(data.videoResult);
      }
    } catch (err) {
      console.error("Failed to fetch video:", err);
    } finally {
      setIsLoadingVideo(false);
    }
  };

  const openExplainBuddy = () => {
    setShowExplainBuddy(true);
    if (buddyHistory.length === 0) {
      // Seed with a tutor prompt
      setBuddyHistory([{
        role: 'tutor',
        text: `Let's test your understanding using the Feynman Technique! 🧠\n\nExplain "${lessonData?.title || 'this topic'}" as if you're teaching it to a 10-year-old. Don't look at your notes — just explain it in your own words.\n\nType "end" when you're done to get your full Feynman breakdown! 🎯`
      }]);
    }
  };

  const handleBuddySessionEnd = async (historyWithEnd) => {
    setBuddyLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/ai/lesson-tutor/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: historyWithEnd,
          lessonTitle: lessonData?.title || subModuleId
        })
      });
      const data = await res.json();
      if (data.finalAssessment) {
        setBuddyBreakdownData(data.finalAssessment);
      }
    } catch (err) {
      console.error('Feynman summary failed:', err);
    } finally {
      setBuddySessionEnded(true);
      setBuddyLoading(false);
    }
  };

  const sendExplainBuddyMessage = async () => {
    const text = buddyInput.trim();
    if (!text || buddySessionEnded) return;
    const newHistory = [...buddyHistory, { role: 'student', text }];
    setBuddyHistory(newHistory);
    setBuddyInput('');

    // 'end' keyword triggers the final Feynman breakdown
    if (text.toLowerCase() === 'end') {
      await handleBuddySessionEnd(newHistory);
      return;
    }

    setBuddyLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/ai/lesson-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: newHistory,
          lessonTitle: lessonData?.title || subModuleId,
          materialContext: materialRawText || null
        })
      });
      const data = await res.json();
      if (data.text) {
        setBuddyHistory(prev => [...prev, { role: 'tutor', text: data.text }]);
      }
      if (data.gapAnalysis) {
        setBuddyGapAnalysis(data.gapAnalysis);
      }
    } catch (err) {
      console.error('Explain Buddy failed:', err);
      setBuddyHistory(prev => [...prev, { role: 'tutor', text: "I couldn't process that right now. Please try again!" }]);
    } finally {
      setBuddyLoading(false);
    }
  };

  
  if (lessonData?.error) {
    return (
      <div className="p-20 bg-[#121212] min-h-screen font-mono text-white flex flex-col items-center">
        <h2 className="text-4xl font-black italic mb-8">Lesson Not Found 🧐</h2>
        <p className="text-zinc-500 mb-8">The AI roadmap is still being prepared or this lesson doesn't exist.</p>
        <button onClick={() => navigate(`/learn-student/${courseId}`)} className="bg-white text-black px-10 py-4 rounded-2xl border-4 border-black font-black uppercase italic shadow-[8px_8px_0px_0px_#3b82f6]">Back to Roadmap</button>
      </div>
    );
  }
  
  // Format personalized content into paragraphs
  const renderPersonalizedContent = (text) => {
    if (!text) return null;
    return text.split('\n').filter(p => p.trim()).map((para, i) => (
      <p key={i} className="mb-4 leading-relaxed">{para}</p>
    ));
  };

  // Determine file type label for the material card
  const getFileLabel = (url) => {
    if (!url) return 'Material';
    const ext = url.split('.').pop()?.toLowerCase();
    const labels = { pdf: 'PDF Document', docx: 'Word Document', pptx: 'PowerPoint Slides', ppt: 'PowerPoint Slides', txt: 'Course Material' };
    return labels[ext] || 'File';
  };

  // .txt files are internal content sources — don't show a download button for them
  const isInternalContent = lessonData?.content_url?.endsWith('.txt');
  // Show download card only for real user-uploaded files (pdf, pptx, docx, etc.)
  const showDownloadCard = lessonData?.content_url && !isInternalContent;

  return (
    <div className="min-h-screen bg-[#121212] font-mono text-white p-8 relative overflow-hidden flex flex-col">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none" 
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px),
                           repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)`
        }}
      />

      {/* Top Navigation Bar */}
      <div className="relative z-10 flex justify-between items-center mb-10">
        <button 
          onClick={() => navigate(`/learn-student/${courseId}`)}
          className="bg-white text-black px-6 py-2 rounded-xl border-4 border-black font-black hover:bg-[#F3B8F8] transition-all shadow-[4px_4px_0px_0px_#3b82f6] active:scale-95 uppercase italic"
        >
          ← ROADMAP
        </button>
        
        <div className="flex gap-4">
            <div className="bg-black border-2 border-zinc-700 px-4 py-2 rounded-xl">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Course</span>
                <span className="text-sm font-black text-white uppercase">{formatText(courseId)}</span>
            </div>
            <div className="bg-[#facc15] text-black border-2 border-black px-4 py-2 rounded-xl shadow-[4px_4px_0px_0px_white]">
                <span className="text-[10px] font-black uppercase tracking-widest block opacity-60">Module</span>
                <span className="text-sm font-black uppercase">{lessonData?.modules?.title || formatText(subModuleId)}</span>
            </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 grid grid-cols-12 gap-10">
        
        {/* LEFT: Academic Content Area */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
          <div className="bg-white text-black border-[6px] border-black rounded-[40px] p-12 shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] overflow-y-auto max-h-[80vh] scrollbar-hide">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-zinc-200 w-24 mb-4"></div>
                <div className="h-12 bg-zinc-200 w-full mb-8"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-zinc-200 w-full"></div>
                  <div className="h-4 bg-zinc-200 w-3/4"></div>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-10 border-b-4 border-black pb-6">
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Core Theory</span>
                    <h2 className="text-5xl font-black italic uppercase tracking-tighter mt-2 leading-none">
                      {lessonData?.title || `Understanding ${formatText(subModuleId)}`}
                    </h2>
                </div>

                <div className="space-y-8 font-bold text-lg leading-relaxed">

                    {/* AI Personalized Content Section */}
                    {isLoadingContent ? (
                      <section className="bg-zinc-100 border-4 border-zinc-300 p-8 rounded-[30px] animate-pulse">
                        <div className="h-6 bg-zinc-300 w-48 mb-4 rounded"></div>
                        <div className="space-y-3">
                          <div className="h-4 bg-zinc-300 w-full rounded"></div>
                          <div className="h-4 bg-zinc-300 w-5/6 rounded"></div>
                          <div className="h-4 bg-zinc-300 w-4/6 rounded"></div>
                        </div>
                        <p className="text-zinc-500 text-sm mt-4 font-black italic">✨ AI is reading your material and generating personalized content...</p>
                      </section>
                    ) : personalizedContent ? (
                      <section className="bg-[#f0fff4] border-4 border-black p-8 rounded-[30px] shadow-[6px_6px_0px_0px_#98EECC]">
                        <h3 className="text-2xl font-black uppercase mb-4 flex items-center gap-3">
                          ✨ Personalized Lesson
                          <span className="text-xs font-black bg-black text-[#98EECC] px-3 py-1 rounded-full uppercase">AI Generated</span>
                        </h3>
                        <div className="font-semibold text-base leading-relaxed text-zinc-800">
                          {renderPersonalizedContent(personalizedContent)}
                        </div>
                      </section>
                    ) : lessonData?.content_url && !isLoadingContent ? (
                      /* Fallback for PPTX or non-AI-parseable files */
                      <section>
                        <h3 className="text-2xl font-black uppercase mb-4 underline decoration-4 decoration-[#98EECC] underline-offset-4">1. Concepts & Overview</h3>
                        <p>In this lesson, we explore the fundamental principles of <strong>{lessonData?.title || "this submodule"}</strong>. This content is part of the {lessonData?.modules?.title || "course roadmap"} designed to guide your mastery of the subject matter.</p>
                        <p className="mt-4 text-zinc-500 text-sm italic">📎 A learning material has been attached to this lesson. Download and review it below before taking the quiz.</p>
                      </section>
                    ) : (
                      <section>
                        <h3 className="text-2xl font-black uppercase mb-4 underline decoration-4 decoration-[#98EECC] underline-offset-4">1. Concepts & Overview</h3>
                        <p>In this lesson, we explore the fundamental principles of <strong>{lessonData?.title || "this submodule"}</strong>. This content is part of the {lessonData?.modules?.title || "course roadmap"} designed to guide your mastery of the subject matter.</p>
                      </section>
                    )}

                    {/* ✅ Download Material Card — shown only for PDF/DOCX/PPTX, NOT for internal .txt files */}
                    {showDownloadCard && (
                        <section className="bg-[#facc15] border-4 border-black p-8 rounded-[30px] shadow-[8px_8px_0px_0px_black] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_black]">
                            <h3 className="text-2xl font-black uppercase mb-2 flex items-center gap-3">
                              📚 Learning Material Attached
                              <span className="text-xs font-black bg-black text-[#facc15] px-3 py-1 rounded-full uppercase">
                                {getFileLabel(lessonData.content_url)}
                              </span>
                            </h3>
                            <p className="mb-6 font-black text-sm">Your teacher has uploaded a{['aeiou'].includes(getFileLabel(lessonData.content_url)[0]?.toLowerCase()) ? 'n' : ''} {getFileLabel(lessonData.content_url)} for this lesson. Review it before taking the quiz.</p>
                            <a 
                              href={`http://localhost:3000/uploads/${lessonData.content_url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-block bg-white text-black px-10 py-4 rounded-2xl border-4 border-black font-black uppercase italic shadow-[4px_4px_0px_0px_black] hover:bg-black hover:text-white transition-all active:scale-95"
                            >
                              Download / View Material 📄
                            </a>
                        </section>
                    )}
                    
                    <p>Proceed through the theory and material before clicking "Save & Continue" to test your knowledge.</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* RIGHT: Sidebar */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          <div className="bg-[#98EECC] border-[6px] border-black rounded-[40px] p-8 shadow-[10px_10px_0px_0px_white] text-black">
            <h3 className="text-2xl font-black italic uppercase mb-8 border-b-4 border-black pb-2">Syllabus</h3>
            <div className="space-y-6 font-black text-sm uppercase">
              <div className="flex items-center gap-4 opacity-40">✓ 01. Overview</div>
              <div className="flex items-center gap-4 underline decoration-4 decoration-black underline-offset-4">02. Core Theory</div>
              <div className="flex items-center gap-4 opacity-40">03. Evaluation</div>
            </div>
          </div>

          <button 
            onClick={openExplainBuddy}
            className="bg-[#F3B8F8] border-[6px] border-black p-8 rounded-[40px] shadow-[10px_10px_0px_0px_#3b82f6] text-black text-left transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:scale-95 group"
          >
            <h3 className="text-2xl font-black italic uppercase">Explain Buddy 🧠</h3>
            <p className="text-xs font-bold opacity-60 mt-1">Explain like a Feynman pro</p>
          </button>

          {/* Video Reference Button */}
          <button
            onClick={fetchVideoReference}
            className="w-full bg-[#3b82f6] text-white border-[6px] border-black p-6 rounded-[40px] shadow-[10px_10px_0px_0px_black] text-left transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:scale-95 group"
          >
            <h3 className="text-xl font-black italic uppercase mb-1">▶ Video Reference</h3>
            <p className="text-xs font-bold opacity-80">Would you like to watch a video explanation for this topic?</p>
          </button>

          <button 
            onClick={handleSaveAndContinue}
            className="mt-auto w-full bg-[#facc15] text-black py-6 rounded-[35px] font-black text-2xl border-[5px] border-black shadow-[10px_10px_0px_0px_white] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all active:scale-95 uppercase italic flex flex-col items-center gap-1"
          >
            <span>Save & Continue →</span>
            {materialRawText && (
              <span className="text-xs font-bold opacity-70 normal-case not-italic">📄 Quiz will be from module content</span>
            )}
          </button>
        </div>
      </div>

      {showQuiz && (
        <QuizSection 
          subModuleId={subModuleId} 
          courseId={courseId} 
          onComplete={handleQuizComplete}
          materialContext={materialRawText}
        />
      )}

      {/* Video Modal Overlay */}
      {showVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setShowVideo(false)}
          />
          
          {/* Modal Content */}
          <div className="relative z-[110] w-full max-w-2xl bg-white border-[8px] border-black rounded-[50px] overflow-hidden shadow-[15px_15px_0px_0px_#facc15] animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button 
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-6 text-black hover:text-red-500 font-black text-4xl leading-none z-20"
            >
              ×
            </button>

            {isLoadingVideo ? (
              <div className="flex flex-col items-center justify-center py-20 gap-6">
                <div className="w-16 h-16 border-8 border-zinc-200 border-t-[#3b82f6] rounded-full animate-spin"></div>
                <h3 className="text-black font-black italic uppercase text-xl animate-pulse">Finding the best video...</h3>
              </div>
            ) : videoResult ? (
              <div className="flex flex-col">
                <div className="relative group aspect-video overflow-hidden border-b-[8px] border-black">
                   <img 
                      src={videoResult.snippet.thumbnails.high ? videoResult.snippet.thumbnails.high.url : videoResult.snippet.thumbnails.medium.url} 
                      alt={videoResult.snippet.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                   />
                   <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                      <div className="bg-white text-black p-5 rounded-full font-black text-3xl shadow-[6px_6px_0px_0px_#3b82f6]">▶</div>
                   </div>
                </div>
                <div className="p-8 pb-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-[#FF00B8] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_black] rotate-[-2deg]">Top Pick</span>
                    <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest">{videoResult.snippet.channelTitle}</span>
                  </div>
                  <h3 className="text-black font-black text-2xl uppercase leading-tight mb-6 italic">{videoResult.snippet.title}</h3>
                  <div className="flex gap-4">
                      <a 
                        href={`https://www.youtube.com/watch?v=${videoResult.id.videoId}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex-1 bg-black text-white py-5 rounded-3xl font-black text-center text-lg uppercase shadow-[6px_6px_0px_0px_#facc15] hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:scale-95 transition-all"
                      >
                        Watch on YouTube 📺
                      </a>
                      <button 
                        onClick={() => setShowVideo(false)}
                        className="px-8 bg-zinc-100 text-black border-4 border-black rounded-3xl font-black text-lg uppercase shadow-[4px_4px_0px_0px_black] hover:bg-zinc-200 active:scale-95 transition-all"
                      >
                        Close
                      </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-10 text-center gap-6">
                <span className="text-6xl">😕</span>
                <div>
                   <h3 className="text-black font-black text-2xl uppercase italic mb-2">No Video Found</h3>
                   <p className="text-zinc-500 font-bold">We couldn't find a specific reference for this sub-module, but you can search for it on YouTube!</p>
                </div>
                <button 
                   onClick={() => setShowVideo(false)}
                   className="bg-black text-white px-10 py-4 rounded-2xl font-black uppercase italic shadow-[4px_4px_0px_0px_#3b82f6]"
                >
                  Back to Lesson
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== EXPLAIN BUDDY MODAL (Feynman Flashcard) ===== */}
      {showExplainBuddy && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setShowExplainBuddy(false)} />

          {/* Modal */}
          <div className="relative z-[110] w-full max-w-3xl h-[90vh] bg-[#121212] border-[8px] border-[#F3B8F8] rounded-[50px] overflow-hidden shadow-[20px_20px_0px_0px_#3b82f6] flex flex-col font-mono">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b-[6px] border-[#F3B8F8] bg-[#F3B8F8]">
              <div>
                <h2 className="text-2xl font-black uppercase italic text-black">🧠 Explain Buddy</h2>
                <p className="text-xs font-bold text-black/60 uppercase tracking-widest">
                  {buddySessionEnded ? 'Session Complete — Feynman Breakdown' : 'Feynman Technique — Lesson Check'}
                </p>
              </div>
              {/* Live Dimension Scores (chat mode only) */}
              {buddyGapAnalysis && !buddySessionEnded && (
                <div className="hidden sm:flex gap-3">
                  {Object.entries(buddyGapAnalysis.dimensions || {}).map(([dim, score]) => (
                    <div key={dim} className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full border-4 border-black flex items-center justify-center text-xs font-black" style={{ background: score >= 70 ? '#98EECC' : score >= 40 ? '#facc15' : '#ff6b6b' }}>
                        {score}
                      </div>
                      <span className="text-[8px] font-black uppercase mt-1 text-black/60">{dim.slice(0, 4)}</span>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={() => setShowExplainBuddy(false)} className="text-black font-black text-3xl leading-none hover:text-red-600 ml-4">×</button>
            </div>

            {/* === BREAKDOWN VIEW (after student types 'end') === */}
            {buddySessionEnded ? (
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 scrollbar-hide">
                {buddyLoading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="w-16 h-16 border-8 border-zinc-700 border-t-[#F3B8F8] rounded-full animate-spin" />
                    <p className="text-white font-black italic uppercase animate-pulse">Calculating your mastery...</p>
                  </div>
                ) : buddyBreakdownData ? (
                  <>
                    {/* Score Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {Object.entries(buddyBreakdownData.dimensions || {}).map(([key, val]) => (
                        <div key={key} className="bg-white border-4 border-black p-4 rounded-3xl shadow-[4px_4px_0px_0px_black] text-black">
                          <p className="text-[9px] font-black uppercase text-zinc-400 mb-1">{key}</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black" style={{ color: val >= 70 ? '#16a34a' : val >= 40 ? '#d97706' : '#dc2626' }}>{val}</span>
                            <span className="text-xs font-bold text-zinc-400">/100</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Overall Score Banner */}
                    <div className="bg-[#F3B8F8] border-4 border-black rounded-3xl p-5 shadow-[4px_4px_0px_0px_black] flex items-center justify-between">
                      <span className="font-black text-black uppercase text-sm">Overall Feynman Score</span>
                      <span className="text-4xl font-black text-black">{buddyBreakdownData.overall_score}<span className="text-lg text-black/50">/100</span></span>
                    </div>

                    {/* Strengths */}
                    {buddyBreakdownData.strengths?.length > 0 && (
                      <div className="bg-[#98EECC] border-4 border-black p-5 rounded-3xl shadow-[4px_4px_0px_0px_black]">
                        <h4 className="font-black text-black uppercase text-sm mb-3">🚀 What You Nailed</h4>
                        <ul className="space-y-2">
                          {buddyBreakdownData.strengths.map((s, i) => (
                            <li key={i} className="text-black font-bold text-sm flex items-start gap-2"><span className="font-black">✔</span> {s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Missing Concepts */}
                    {buddyBreakdownData.missing_concepts?.length > 0 && (
                      <div className="bg-[#facc15] border-4 border-black p-5 rounded-3xl shadow-[4px_4px_0px_0px_black]">
                        <h4 className="font-black text-black uppercase text-sm mb-3">📋 Concepts to Revisit</h4>
                        <ul className="space-y-2">
                          {buddyBreakdownData.missing_concepts.map((c, i) => (
                            <li key={i} className="text-black font-bold text-sm flex items-start gap-2"><span className="font-black">→</span> {c}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Mentor Advice */}
                    {buddyBreakdownData.personalized_feedback?.advice && (
                      <div className="bg-black border-4 border-[#79E0EE] p-5 rounded-3xl shadow-[4px_4px_0px_0px_#79E0EE]">
                        <p className="text-[10px] font-black uppercase text-[#79E0EE] mb-2">Mentor Advice</p>
                        <p className="font-bold italic text-sm text-white">"{buddyBreakdownData.personalized_feedback.advice}"</p>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-3 pb-2">
                      <button
                        onClick={() => {
                          setBuddySessionEnded(false);
                          setBuddyBreakdownData(null);
                          setBuddyHistory([]);
                          setBuddyGapAnalysis(null);
                          openExplainBuddy();
                        }}
                        className="flex-1 bg-[#F3B8F8] text-black border-4 border-black py-4 rounded-2xl font-black uppercase italic shadow-[4px_4px_0px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all active:scale-95"
                      >
                        Try Again 🔁
                      </button>
                      <button
                        onClick={() => setShowExplainBuddy(false)}
                        className="flex-1 bg-[#98EECC] text-black border-4 border-black py-4 rounded-2xl font-black uppercase italic shadow-[4px_4px_0px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all active:scale-95"
                      >
                        Done ✓
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                    <span className="text-5xl">🎯</span>
                    <p className="text-white font-black italic uppercase">Session complete! Great effort.</p>
                    <button onClick={() => setShowExplainBuddy(false)} className="bg-[#F3B8F8] text-black border-4 border-black px-8 py-3 rounded-2xl font-black uppercase shadow-[4px_4px_0px_0px_black]">Close</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Lesson Context Badge */}
                <div className="px-6 pt-4 pb-2">
                  <span className="bg-[#3b82f6] text-white text-[10px] font-black uppercase px-4 py-1 rounded-full shadow-[2px_2px_0px_0px_white]">
                    📘 Topic: {lessonData?.title || subModuleId}
                  </span>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-hide">
                  {buddyHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'student' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-5 py-4 rounded-[24px] font-bold text-sm leading-relaxed whitespace-pre-line
                        ${msg.role === 'student'
                          ? 'bg-[#3b82f6] text-white border-4 border-black rounded-br-none shadow-[4px_4px_0px_0px_black]'
                          : 'bg-white text-black border-4 border-black rounded-bl-none shadow-[4px_4px_0px_0px_#F3B8F8]'
                        }`}>
                        {msg.role === 'tutor' && <span className="text-[10px] font-black uppercase opacity-50 block mb-1">🧠 Explain Buddy</span>}
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {buddyLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border-4 border-black rounded-[24px] rounded-bl-none px-5 py-4 shadow-[4px_4px_0px_0px_#F3B8F8]">
                        <span className="text-[10px] font-black uppercase opacity-50 block mb-2">🧠 Explain Buddy</span>
                        <div className="flex gap-1 items-center">
                          <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Gap Indicator */}
                {buddyGapAnalysis?.missing_concepts?.length > 0 && (
                  <div className="mx-6 mb-2 bg-[#facc15] border-4 border-black rounded-2xl px-4 py-2 flex flex-wrap gap-2 items-center">
                    <span className="text-[10px] font-black uppercase">Still missing:</span>
                    {buddyGapAnalysis.missing_concepts.slice(0, 3).map((c, i) => (
                      <span key={i} className="bg-black text-white text-[9px] font-black uppercase px-2 py-1 rounded-full">{c}</span>
                    ))}
                  </div>
                )}

                {/* Input Area */}
                <div className="p-4 border-t-[6px] border-[#F3B8F8] flex gap-3 bg-black">
                  <textarea
                    value={buddyInput}
                    onChange={(e) => setBuddyInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendExplainBuddyMessage(); }}}
                    placeholder='Explain it in your own words... (type "end" to finish)'
                    rows={2}
                    disabled={buddyLoading}
                    className="flex-1 bg-[#1a1a1a] text-white border-4 border-zinc-700 focus:border-[#F3B8F8] rounded-2xl px-4 py-3 font-bold text-sm resize-none outline-none placeholder:text-zinc-600 transition-colors"
                  />
                  <button
                    onClick={sendExplainBuddyMessage}
                    disabled={buddyLoading || !buddyInput.trim()}
                    className="bg-[#F3B8F8] text-black border-4 border-black rounded-2xl px-6 font-black text-xl shadow-[4px_4px_0px_0px_white] hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default LessonView;