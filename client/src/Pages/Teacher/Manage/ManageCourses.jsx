import React, { useState, useEffect } from 'react';
import TeacherNavbar from '../../../Components/TeacherNavbar';
import ManageSidebar from '../../../Components/ManageSidebar';
import { useAuth } from '../../../utils/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ManageCourses.css';

const ManageCourses = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // Correct: useNavigate is a function, not a destructure
  
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [newCourse, setNewCourse] = useState({ 
    title: '', 
    subject: 'Science & Nature', 
    description: '', 
    materials: '' 
  });

  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const url = user?.uid 
        ? `http://localhost:3000/api/courses/teacher/${user.uid}` 
        : `http://localhost:3000/api/courses`;
      
      const response = await fetch(url, {
        credentials: 'include' // Sends HttpOnly cookie
      });
      const data = await response.json();

      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        console.error("Backend error:", data);
        setCourses([]); 
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const fileNames = [];
      const uploadedUrls = {};

      // 1. Upload Loop (With Credentials)
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await fetch('http://localhost:3000/api/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });

        if (uploadRes.ok) {
          const { filePath } = await uploadRes.json();
          fileNames.push(file.name);
          uploadedUrls[file.name] = filePath;
        } else {
          console.error("Upload failed for:", file.name);
        }
      }

      // 2. AI Roadmap Generation (With Credentials)
      // let roadmap = [];
      // const aiResponse = await fetch('http://localhost:3000/api/ai/generate-roadmap', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     materials: newCourse.materials,
      //     fileNames: fileNames
      //   }),
      //   credentials: 'include'
      // });
      
      // if (aiResponse.ok) {
      //   const rawRoadmap = await aiResponse.json();
        
      //   // Map original filenames to the new hashed backend paths
      //   roadmap = rawRoadmap.map(mod => ({
      //     ...mod,
      //     lessons: mod.lessons.map(less => ({
      //       ...less,
      //       content_url: less.content_url ? (uploadedUrls[less.content_url] || null) : null
      //     }))
      //   }));
      // }

      let roadmap = [];
      const aiResponse = await fetch('http://localhost:3000/api/ai/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          materials: newCourse.materials,
          fileNames: fileNames
        }),
        credentials: 'include'
      });

      if (aiResponse.ok) {
        const rawRoadmap = await aiResponse.json();
        
        // CRITICAL CHECK: If roadmap is empty, the AI failed or was rate-limited
        if (!rawRoadmap || rawRoadmap.length === 0) {
          alert("AI couldn't generate a roadmap from these materials. Please provide more detail or try again.");
          setIsGenerating(false);
          return; // STOP HERE so we don't create a blank course
        }

        // Map original filenames to the new hashed backend paths
        roadmap = rawRoadmap.map(mod => ({
          ...mod,
          lessons: mod.lessons.map(less => ({
            ...less,
            content_url: less.content_url ? (uploadedUrls[less.content_url] || null) : null
          }))
        }));
      } else {
        alert("AI Roadmap service is currently busy. Please try again in a moment.");
        setIsGenerating(false);
        return;
      }

      // 3. Final Course Creation (With Credentials)
      const response = await fetch('http://localhost:3000/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newCourse, teacher_id: user?.uid, roadmap }),
        credentials: 'include'
      });

      if (response.ok) {
        setIsModalOpen(false);
        setNewCourse({ title: '', subject: 'Science & Nature', description: '', materials: '' });
        setSelectedFiles([]);
        fetchCourses();
      }
    } catch (error) {
      console.error("Course creation workflow failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const response = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        if (response.ok) {
          setCourses(courses.filter(c => c.id !== courseId));
        }
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  return (
    <>
      <TeacherNavbar activeTab="manage" />
      <div className="dashboard-container">
        <ManageSidebar activeTab="courses" />

        <main className="main-content">
          <section className="content-card">
            <div className="content-header">
              <h3 className="text-2xl font-black italic">Manage / <span className="text-gray-500">Courses</span></h3>
              <button className="add-course-btn" onClick={() => setIsModalOpen(true)}>+ Add Course</button>
            </div>

            <div className="courses-grid mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <div key={course.id} className="course-card p-6 border-4 border-black rounded-3xl bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex justify-between items-start mb-4">
                    <h5 className="text-xl font-black uppercase tracking-tighter">{course.title}</h5>
                    <span className="bg-yellow-300 border-2 border-black px-2 py-1 rounded-lg text-xs font-bold">
                      {course.is_published ? "ACTIVE" : "DRAFT"}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2">{course.description}</p>
                  
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => navigate(`/teacher/course/${course.id}/roadmap`)}
                      className="w-full py-2 bg-[#98EECC] border-2 border-black rounded-xl font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 transition-all"
                    >
                      VIEW ROADMAP 🗺️
                    </button>
                    <button 
                      onClick={() => handleDeleteCourse(course.id)}
                      className="w-full py-2 bg-[#FFB7B7] border-2 border-black rounded-xl font-black text-sm hover:bg-red-400 transition-colors"
                    >
                      DELETE COURSE
                    </button>
                  </div>
                </div>
              ))}
              
              {courses.length === 0 && (
                <div className="col-span-full py-20 text-center font-bold text-gray-400 italic">
                  No courses found. Time to build something great!
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="modal-overlay fixed inset-0 bg-black/50 flex justify-center items-center z-[1000] p-4">
          <div className="modal-content bg-white p-8 rounded-[40px] border-[5px] border-black shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-black italic uppercase mb-6 underline decoration-yellow-400">New Course</h2>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block font-black mb-1">Title</label>
                <input 
                  type="text" 
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                  className="w-full p-3 border-4 border-black rounded-2xl outline-none focus:bg-yellow-50"
                  required 
                />
              </div>

              <div>
                <label className="block font-black mb-1">Subject</label>
                <select 
                  value={newCourse.subject}
                  onChange={(e) => setNewCourse({...newCourse, subject: e.target.value})}
                  className="w-full p-3 border-4 border-black rounded-2xl outline-none appearance-none bg-white"
                >
                  <option>Science & Nature</option>
                  <option>Mathematics</option>
                  <option>History</option>
                  <option>Language Arts</option>
                  <option>Computer Science</option>
                </select>
              </div>

              <div>
                <label className="block font-black mb-1">Description</label>
                <textarea 
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                  className="w-full p-3 border-4 border-black rounded-2xl outline-none focus:bg-yellow-50 h-24"
                  required 
                />
              </div>

              <div>
                <label className="block font-black mb-1">AI Context / Syllabus</label>
                <textarea 
                  value={newCourse.materials}
                  onChange={(e) => setNewCourse({...newCourse, materials: e.target.value})}
                  placeholder="Paste topics or outline..."
                  className="w-full p-3 border-4 border-black rounded-2xl outline-none italic text-sm"
                />
              </div>

              <div>
                <label className="block font-black mb-1">Files (PDF/Word)</label>
                <input 
                  type="file" 
                  multiple 
                  onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                  className="w-full p-2 border-4 border-dashed border-gray-300 rounded-2xl"
                />
              </div>

              {isGenerating && (
                <div className="py-2 text-[#8E24AA] font-black animate-pulse text-center">
                  ✨ ASSEMBLING YOUR KNOWLEDGE...
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border-4 border-black rounded-2xl font-black hover:bg-gray-100"
                >
                  CANCEL
                </button>
                <button 
                  type="submit" 
                  disabled={isGenerating}
                  className="flex-1 py-3 bg-[#98EECC] border-4 border-black rounded-2xl font-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                >
                  {isGenerating ? "GENERATING..." : "CREATE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageCourses;