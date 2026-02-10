import React from 'react';
import TeacherNavbar from '../../../Components/TeacherNavbar';
import ManageSidebar from '../../../Components/ManageSidebar';
import './ManageQuizzes.css';

const ManageQuizzes = () => {
  return (
    <>
      <TeacherNavbar activeTab="manage" />
      <div className="layout-container">
        <ManageSidebar activeTab="quizzes" />

        {/* Main Content Viewport */}
        <main className="main-viewport">
          <section className="white-panel-content">
            <div className="section-header">
              <h3>Manage / <span className="breadcrumb-italic">Quizzes</span></h3>
              <button className="btn-add-quiz">+ Add Quiz</button>
            </div>

            <div className="search-filter-controls">
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input type="text" placeholder="Search quiz..." />
              </div>
              <div className="filter-dropdown-box">
                Filter <span className="dropdown-caret">▼</span>
              </div>
            </div>

            <div className="quizzes-overview-section">
              <h4>Quizzes Overview</h4>
              {/* Quizzes List */}
              <div className="quizzes-list">
                <div className="quiz-item">
                  <div className="quiz-title">
                    <h5>📝 States of Matter: Solid, Liquid, Gas</h5>
                    <span className="course-tag">States of Matter</span>
                  </div>
                  <div className="quiz-details">
                    <span className="detail">Questions: 10</span>
                    <span className="detail">Duration: 10 min</span>
                    <span className="detail">Difficulty: Easy</span>
                  </div>
                  <div className="quiz-stats">
                    <div className="stat-box">
                      <span className="stat-label">Attempts</span>
                      <span className="stat-value">48</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">Avg Score</span>
                      <span className="stat-value">92%</span>
                    </div>
                  </div>
                  <div className="quiz-actions">
                    <button className="action-btn">Edit</button>
                    <button className="action-btn">Results</button>
                    <button className="action-btn">Delete</button>
                  </div>
                </div>

                <div className="quiz-item">
                  <div className="quiz-title">
                    <h5>📝 Algebra Basics: Solve for x</h5>
                    <span className="course-tag">Algebra Basics</span>
                  </div>
                  <div className="quiz-details">
                    <span className="detail">Questions: 12</span>
                    <span className="detail">Duration: 15 min</span>
                    <span className="detail">Difficulty: Easy</span>
                  </div>
                  <div className="quiz-stats">
                    <div className="stat-box">
                      <span className="stat-label">Attempts</span>
                      <span className="stat-value">36</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">Avg Score</span>
                      <span className="stat-value">88%</span>
                    </div>
                  </div>
                  <div className="quiz-actions">
                    <button className="action-btn">Edit</button>
                    <button className="action-btn">Results</button>
                    <button className="action-btn">Delete</button>
                  </div>
                </div>

                <div className="quiz-item">
                  <div className="quiz-title">
                    <h5>📝 Atomic Match: Parts of an Atom</h5>
                    <span className="course-tag">Atomic Structure</span>
                  </div>
                  <div className="quiz-details">
                    <span className="detail">Questions: 8</span>
                    <span className="detail">Duration: 8 min</span>
                    <span className="detail">Difficulty: Easy</span>
                  </div>
                  <div className="quiz-stats">
                    <div className="stat-box">
                      <span className="stat-label">Attempts</span>
                      <span className="stat-value">29</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">Avg Score</span>
                      <span className="stat-value">90%</span>
                    </div>
                  </div>
                  <div className="quiz-actions">
                    <button className="action-btn">Edit</button>
                    <button className="action-btn">Results</button>
                    <button className="action-btn">Delete</button>
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

export default ManageQuizzes;