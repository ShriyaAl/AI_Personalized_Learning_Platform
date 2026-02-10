import React from "react";
import TeacherNavbar from "../../../Components/TeacherNavbar";
import "./TeacherHome.css";

const TeacherHome = () => {
  return (
    <>
      <TeacherNavbar activeTab="dashboard" />
      <div className="dashboard-container">
        {/* Sidebar Profile Card */}
        <aside className="sidebar">
          <div className="profile-section">
            <div className="avatar-circle">
              <span className="user-icon">👤</span>
            </div>
            <div className="profile-info">
              <p className="profile-name">John Doe</p>
              <p className="profile-email">john@example.com</p>
              <div className="profile-badge">Teacher</div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          {/* Welcome Header */}
          <header className="main-header">
            <div className="welcome-section">
              <h1>Welcome back, John! 👋</h1>
              <p>You last logged in 2 days ago</p>
            </div>
            <div className="notification-bell">🔔</div>
          </header>

          {/* Dashboard Card */}
          <div className="dashboard-card">
            {/* Stats Section */}
            <div className="stats-section">
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-content">
                  <p className="stat-number">5</p>
                  <p className="stat-label">Active Courses</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <p className="stat-number">20</p>
                  <p className="stat-label">Total Students</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👨‍🎓</div>
                <div className="stat-content">
                  <p className="stat-number">3</p>
                  <p className="stat-label">Study Groups</p>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="content-grid">
              {/* Recent Activity */}
              <section className="activity-box recent-activity">
                <div className="box-header">
                  <h3>📝 Recent Activity</h3>
                </div>
                <ul className="activity-list">
                  <li>
                    <span className="activity-dot"></span>
                    <span className="activity-text">Added "Unit 3 Notes" to Data Structures</span>
                    <span className="activity-time">Today</span>
                  </li>
                  <li>
                    <span className="activity-dot"></span>
                    <span className="activity-text">Quiz "Midterm Test" created</span>
                    <span className="activity-time">2 days ago</span>
                  </li>
                  <li>
                    <span className="activity-dot"></span>
                    <span className="activity-text">5 new students joined Group A</span>
                    <span className="activity-time">3 days ago</span>
                  </li>
                  <li>
                    <span className="activity-dot"></span>
                    <span className="activity-text">Course "AI Basics" updated</span>
                    <span className="activity-time">4 days ago</span>
                  </li>
                </ul>
              </section>

              <div className="right-column">
                {/* Pending Items */}
                <section className="info-box pending-box">
                  <div className="box-header">
                    <h3>⏳ Pending Items</h3>
                  </div>
                  <ul className="info-list">
                    <li>Assign groups to 13 Students</li>
                  </ul>
                </section>

                {/* Notifications */}
                <section className="info-box notifications-box">
                  <div className="box-header">
                    <h3>🔔 Notifications</h3>
                  </div>
                  <ul className="info-list">
                    <li>3 students haven't attempted Quiz 2</li>
                    <li>No quiz created for Course X</li>
                    <li>Group B has no materials</li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default TeacherHome;