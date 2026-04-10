import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TeacherNavbar from '../../../Components/TeacherNavbar';

const LessonEditor = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/learning/lesson/${lessonId}`, {
        credentials: 'include'
      });
      const data = await res.json();
      setLesson(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`http://localhost:3000/api/learning/lesson/${lessonId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: lesson.content }),
        credentials: 'include'
      });
      if (res.ok) alert("LESSON SYNCED TO DATABASE! 🚀");
    } catch (err) {
      alert("Save failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = async () => {
    if (!window.confirm("This will overwrite your current text with a new AI draft. Continue?")) return;
    setIsGenerating(true);
    try {
      const res = await fetch(`http://localhost:3000/api/learning/generate-explanation/${lessonId}`, {
        credentials: 'include'
      });
      const data = await res.json();
      setLesson(prev => ({ ...prev, content: data.content }));
    } catch (err) {
      alert("AI Generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center font-black animate-pulse text-2xl">
      LOADING PINNACLE EDITOR...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdfdfd] font-mono pb-20">
      <TeacherNavbar activeTab="manage" />
      
      <div className="max-w-5xl mx-auto p-10 mt-10">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <button onClick={() => navigate(-1)} className="font-black underline mb-4 block">← BACK TO ROADMAP</button>
            <span className="bg-[#facc15] border-2 border-black px-3 py-1 rounded-lg text-xs font-black uppercase italic">
              Content Studio
            </span>
            <h1 className="text-6xl font-black italic uppercase tracking-tighter mt-2">{lesson.title}</h1>
          </div>
          
          <button 
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="bg-black text-white px-6 py-3 rounded-2xl font-black text-xs hover:bg-zinc-800 shadow-[6px_6px_0px_0px_#F3B8F8] active:shadow-none transition-all"
          >
            {isGenerating ? "AI GENERATING..." : "RE-GENERATE DRAFT ✨"}
          </button>
        </div>

        {/* The Editor Canvas */}
        <div className="relative">
          <textarea 
            value={lesson.content} 
            onChange={(e) => setLesson({...lesson, content: e.target.value})}
            className="w-full h-[650px] border-[6px] border-black p-12 rounded-[50px] shadow-[20px_20px_0px_0px_black] outline-none text-xl leading-relaxed focus:bg-yellow-50 transition-all font-medium selection:bg-[#F3B8F8]"
            placeholder="No content yet. Click Re-generate or start typing your lesson plan..."
          />
          <div className="absolute top-8 right-12 text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] pointer-events-none">
            Pinnacle Learning Engine v2.0
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-6 mt-16">
          <button 
            onClick={handleSave}
            disabled={isSaving || isGenerating}
            className="flex-1 bg-[#98EECC] border-[5px] border-black py-6 rounded-[30px] font-black text-3xl shadow-[10_10px_0px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:scale-95 transition-all uppercase italic"
          >
            {isSaving ? "SYNCING..." : "SAVE & PUBLISH CONTENT →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonEditor;