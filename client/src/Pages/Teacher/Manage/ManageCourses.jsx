import React, { useState, useEffect } from 'react';
import TeacherNavbar from '../../../Components/TeacherNavbar';
import ManageSidebar from '../../../Components/ManageSidebar';
import { useAuth } from '../../../utils/auth/AuthContext';
import { supabase } from '../../../utils/supabaseClient';
import './ManageCourses.css';

const ManageCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', subject: 'Science & Nature', description: '', materials: '' });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [user]);

  const fetchCourses = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const url = user?.uid 
        ? `${baseUrl}/api/courses/teacher/${user.uid}` 
        : `${baseUrl}/api/courses`;
      const response = await fetch(url, { credentials: 'include' });
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // 1. Upload files to Supabase Storage if any
      const fileNames = [];
      const uploadedUrls = {};

      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await fetch('http://localhost:3000/api/upload', {
          method: 'POST',
          body: formData
        });

        if (uploadRes.ok) {
          const { filePath } = await uploadRes.json();
          fileNames.push(file.name); // AI expects original filename for mapping
          uploadedUrls[file.name] = filePath; // Store real path returned by backend
        } else {
          console.error("Backend proxy upload failed for", file.name);
        }
      }

      // 2. Generate roadmap with AI
      let roadmap = [];
      const aiResponse = await fetch('http://localhost:3000/api/ai/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          materials: newCourse.materials,
          fileNames: fileNames
        })
      });
      
      if (aiResponse.ok) {
        roadmap = await aiResponse.json();
        
        // Map original filenames in roadmap to uploaded storage paths
        roadmap = roadmap.map(mod => ({
          ...mod,
          lessons: mod.lessons.map(less => ({
            ...less,
            content_url: less.content_url ? (uploadedUrls[less.content_url] || less.content_url) : null
          }))
        }));
      }

      // 3. Create course and roadmap in DB
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...newCourse, teacher_id: user?.uid || null, roadmap })
      });

      if (response.ok) {
        setIsModalOpen(false);
        setNewCourse({ title: '', subject: 'Science & Nature', description: '', materials: '' });
        setSelectedFiles([]);
        fetchCourses();
      }
    } catch (error) {
      console.error("Error creating course workflow:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/courses/${courseId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        if (response.ok) {
          setCourses(courses.filter(c => c.id !== courseId));
        } else {
          console.error("Failed to delete course");
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

        {/* Main Content Area */}
        <main className="main-content">
          <section className="content-card">
            <div className="content-header">
              <h3>Manage / <span className="breadcrumb-sub">Courses</span></h3>
              <button className="add-course-btn" onClick={() => setIsModalOpen(true)}>+ Add Course</button>
            </div>

            <div className="search-filter-bar">
              <div className="search-wrapper">
                <span className="search-icon">🔍</span>
                <input type="text" placeholder="Search course..." />
              </div>
              <div className="filter-dropdown">
                Filter <span className="dropdown-arrow">▼</span>
              </div>
            </div>

            <h4>Courses Overview</h4>
            <div className="courses-grid">
              {courses.map(course => (
                <div key={course.id} className="course-card">
                  <div className="course-header">
                    <h5>{course.title}</h5>
                    <span className="course-status">{course.is_published ? "Active" : "Draft"}</span>
                  </div>
                  <p className="course-desc">{course.description}</p>
                  <div className="course-stats" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="stat">
                      <span className="stat-label">Subject</span>
                      <span className="stat-value" style={{fontSize: "0.85em"}}>{course.subject}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.id); }}
                      style={{
                        background: '#ff4d4d', color: 'black', border: '3px solid black', borderRadius: '8px', padding: '4px 8px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap'
                      }}
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
              
              {courses.length === 0 && (
                <p>No courses found. Create one to get started!</p>
              )}
            </div>
          </section>
        </main>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="modal-content" style={{
            background: 'white', padding: '2rem', borderRadius: '8px',
            width: '400px', maxWidth: '90%', border: '4px solid black',
            boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)'
          }}>
            <h2 style={{marginBottom: '1rem', fontStyle: 'italic', fontWeight: '900', textTransform: 'uppercase'}}>Add New Course</h2>
            <form onSubmit={handleCreateCourse}>
              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>Title</label>
                <input 
                  type="text" 
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                  required 
                  style={{width: '100%', padding: '0.75rem', border: '3px solid black', borderRadius: '12px', outline: 'none'}}
                />
              </div>
              
              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>Subject</label>
                <select 
                  value={newCourse.subject}
                  onChange={(e) => setNewCourse({...newCourse, subject: e.target.value})}
                  required
                  style={{width: '100%', padding: '0.75rem', border: '3px solid black', borderRadius: '12px', outline: 'none'}}
                >
                  <option value="Science & Nature">Science & Nature</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="History">History</option>
                  <option value="Language Arts">Language Arts</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
              </div>

              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>Description</label>
                <textarea 
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                  required
                  rows="2"
                  style={{width: '100%', padding: '0.75rem', border: '3px solid black', borderRadius: '12px', outline: 'none'}}
                />
              </div>

              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>Course Syllabus / Materials for AI</label>
                <textarea 
                  value={newCourse.materials}
                  onChange={(e) => setNewCourse({...newCourse, materials: e.target.value})}
                  rows="4"
                  placeholder="Paste syllabus or topics here for AI generation..."
                  style={{width: '100%', padding: '0.75rem', border: '3px solid black', borderRadius: '12px', outline: 'none'}}
                />
              </div>

              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>Upload Learning Materials (PDF/Word/PPT)</label>
                <input 
                  type="file" 
                  multiple 
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                  style={{width: '100%', padding: '0.5rem', border: '3px dashed black', borderRadius: '12px', background: '#f9f9f9'}}
                />
                {selectedFiles.length > 0 && (
                  <p style={{fontSize: '0.8rem', marginTop: '0.5rem'}}><b>{selectedFiles.length} files selected:</b> {selectedFiles.map(f => f.name).join(', ')}</p>
                )}
              </div>

              {isGenerating && <p style={{fontWeight: 'bold', color: '#8E24AA'}}>✨ Generating AI Roadmap & Uploading Files... Please wait.</p>}

              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem'}}>
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isGenerating} style={{
                  padding: '0.5rem 1rem', background: '#ffe5e5', border: '3px solid black', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold'
                }}>Cancel</button>
                <button type="submit" disabled={isGenerating} style={{
                  padding: '0.5rem 1rem', background: isGenerating ? '#ccc' : '#98eecc', border: '3px solid black', borderRadius: '12px', cursor: isGenerating ? 'not-allowed' : 'pointer', fontWeight: 'bold', boxShadow: isGenerating ? 'none' : '4px 4px 0px 0px rgba(0,0,0,1)'
                }}>Create Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageCourses;