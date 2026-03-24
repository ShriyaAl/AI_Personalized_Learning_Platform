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
            onClick={() => navigate('/tutor-student')}
            className="bg-[#F3B8F8] border-[6px] border-black p-8 rounded-[40px] shadow-[10px_10px_0px_0px_#3b82f6] text-black text-left transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:scale-95 group"
          >
            <h3 className="text-2xl font-black italic uppercase">Ask Buddy 🤖</h3>
          </button>

          {/* Video Reference Dummy Button */}
          <button
            onClick={() => alert('🎬 Video references coming soon! This feature will link to curated YouTube and lecture videos for this topic.')}
            className="bg-[#3b82f6] text-white border-[6px] border-black p-6 rounded-[40px] shadow-[10px_10px_0px_0px_black] text-left transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:scale-95 group"
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
    </div>
  );
};

export default LessonView;