import React, { useEffect, useState } from "react";
import TeacherNavbar from "../../../Components/TeacherNavbar";
import "./TeacherHome.css";
import { auth } from "../../../utils/auth/initalizers/firebaseClient.js";

const TeacherHome = () => {
  const [stats, setStats] = useState({ courses: 0, students: 0, groups: 0 });
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        setLoading(true);

        // Fetch Stats and Notifications from Backend
        const response = await fetch(`http://localhost:3000/api/dashboard/teacher/${user.uid}`);
        if (!response.ok) throw new Error("Failed to fetch teacher dashboard data");
        const { stats: newStats, notifications: notifData } = await response.json();
        setStats(newStats);
        setNotifications(notifData);
        // Activity feed not yet wired to Supabase
        setActivities([]);

      } catch (err) {
        console.error("❌ Error fetching teacher data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);
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
              <p className="profile-name">{auth.currentUser?.displayName || "Teacher"}</p>
              <p className="profile-email">{auth.currentUser?.email}</p>
              <div className="profile-badge">Teacher</div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          {/* Welcome Header */}
          <header className="main-header">
            <div className="welcome-section">
              <h1>Welcome back, {auth.currentUser?.displayName?.split(' ')[0] || "Teacher"}! 👋</h1>
              <p>You last logged in today</p>
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
                  <p className="stat-number">{stats.courses}</p>
                  <p className="stat-label">Active Courses</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <p className="stat-number">{stats.students}</p>
                  <p className="stat-label">Total Students</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👨‍🎓</div>
                <div className="stat-content">
                  <p className="stat-number">{stats.groups}</p>
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
                  {activities.length > 0 ? (
                    activities.map(activity => (
                      <li key={activity.id}>
                        <span className="activity-dot"></span>
                        <span className="activity-text">{activity.title}</span>
                        <span className="activity-time">{activity.timestamp?.toDate().toLocaleDateString() || "Recently"}</span>
                      </li>
                    ))
                  ) : (
                    <p className="no-data">No recent activity</p>
                  )}
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
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <li key={notif.id}>{notif.payload?.message || "Notification received"}</li>
                      ))
                    ) : (
                      <li>No new notifications</li>
                    )}
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