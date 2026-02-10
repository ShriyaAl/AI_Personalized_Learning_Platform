import React from 'react';
import TeacherNavbar from '../../../Components/TeacherNavbar';
import ManageSidebar from '../../../Components/ManageSidebar';
import './ManageCourses.css';

const ManageCourses = () => {
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
              <button className="add-course-btn">+ Add Course</button>
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
              <div className="course-card">
                <div className="course-header">
                  <h5>🧪 States of Matter</h5>
                  <span className="course-status">Active</span>
                </div>
                <p className="course-desc">Simple experiments and videos explaining solids, liquids and gases.</p>
                <div className="course-stats">
                  <div className="stat">
                    <span className="stat-label">Students</span>
                    <span className="stat-value">18</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Progress</span>
                    <span className="stat-value">62%</span>
                  </div>
                </div>
              </div>

              <div className="course-card">
                <div className="course-header">
                  <h5>🔢 Algebra Basics</h5>
                  <span className="course-status">Active</span>
                </div>
                <p className="course-desc">Foundational lessons in numbers, patterns and simple equations for young learners.</p>
                <div className="course-stats">
                  <div className="stat">
                    <span className="stat-label">Students</span>
                    <span className="stat-value">22</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Progress</span>
                    <span className="stat-value">48%</span>
                  </div>
                </div>
              </div>

              <div className="course-card">
                <div className="course-header">
                  <h5>⚛️ Atomic Structure</h5>
                  <span className="course-status">Active</span>
                </div>
                <p className="course-desc">Kid-friendly explanations of atoms, elements and simple models with animations.</p>
                <div className="course-stats">
                  <div className="stat">
                    <span className="stat-label">Students</span>
                    <span className="stat-value">14</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Progress</span>
                    <span className="stat-value">35%</span>
                  </div>
                </div>
              </div>

              <div className="course-card">
                <div className="course-header">
                  <h5>➗ Linear Equations (Easy)</h5>
                  <span className="course-status">Draft</span>
                </div>
                <p className="course-desc">Intro to simple linear equations using visuals and stories.</p>
                <div className="course-stats">
                  <div className="stat">
                    <span className="stat-label">Students</span>
                    <span className="stat-value">9</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Progress</span>
                    <span className="stat-value">18%</span>
                  </div>
                </div>
              </div>

              <div className="course-card">
                <div className="course-header">
                  <h5>➕ Addition & Subtraction</h5>
                  <span className="course-status">Active</span>
                </div>
                <p className="course-desc">Playful activities to master addition and subtraction with visuals and songs.</p>
                <div className="course-stats">
                  <div className="stat">
                    <span className="stat-label">Students</span>
                    <span className="stat-value">25</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Progress</span>
                    <span className="stat-value">70%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default ManageCourses;