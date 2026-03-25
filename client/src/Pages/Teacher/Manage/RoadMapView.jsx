import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TeacherNavbar from '../../../Components/TeacherNavbar';

const RoadmapView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/courses/${courseId}/roadmap`, {
          credentials: 'include'
        });
        const data = await res.json();
        setRoadmap(data);
      } catch (err) {
        console.error("Failed to fetch roadmap:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [courseId]);

  if (loading) return <div className="p-20 text-center font-black animate-bounce">LOADING PATH...</div>;

  return (
    <div className="min-h-screen bg-[#fdfdfd] font-mono">
      <TeacherNavbar />
      <div className="max-w-4xl mx-auto p-8">
        <button onClick={() => navigate(-1)} className="mb-8 font-black underline">← BACK TO COURSES</button>
        
        <h1 className="text-5xl font-black mb-12 italic uppercase underline decoration-yellow-400">
          Learning Path
        </h1>

        <div className="space-y-12 relative">
          {/* The Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-2 bg-black hidden md:block" />

          {roadmap.map((module, mIdx) => (
            <div key={module.id} className="relative md:pl-24">
              {/* Module Circle */}
              <div className="absolute left-4 -translate-x-1/2 w-10 h-10 bg-black rounded-full border-4 border-white z-10 hidden md:block" />
              
              <div className="bg-white border-4 border-black p-6 rounded-[30px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-2xl font-black uppercase mb-4">
                  Module {mIdx + 1}: {module.title}
                </h2>
                
                <div className="space-y-3">
                  {module.lessons?.map((lesson, lIdx) => (
                    <div key={lesson.id} className="flex items-center gap-4 p-4 bg-gray-50 border-4 border-black rounded-2xl mb-3 shadow-[4px_4px_0px_0px_black]">
                      <span className="bg-black text-white w-10 h-10 flex items-center justify-center rounded-xl font-black">
                        {lIdx + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-black uppercase text-sm tracking-tight">{lesson.title}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[10px] bg-blue-100 px-2 py-0.5 rounded border-2 border-black font-black uppercase">
                            {lesson.type}
                          </span>
                          {lesson.content ? (
                            <span className="text-[10px] bg-green-100 px-2 py-0.5 rounded border-2 border-black font-black uppercase">
                              Draft Ready ✓
                            </span>
                          ) : (
                            <span className="text-[10px] bg-yellow-100 px-2 py-0.5 rounded border-2 border-black font-black uppercase italic">
                              Empty
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* NAVIGATION TO EDITOR */}
                      <button 
                        onClick={() => navigate(`/teacher/edit-lesson/${lesson.id}`)}
                        className="bg-[#98EECC] border-2 border-black p-2 rounded-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-[3px_3px_0px_0px_black] font-black text-xs uppercase"
                      >
                        Edit Content ✍️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapView;