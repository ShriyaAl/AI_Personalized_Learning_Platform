import React from 'react';
import TeacherNavbar from '../../../Components/TeacherNavbar';
import ManageSidebar from '../../../Components/ManageSidebar';
import './ManageGroups.css';

const ManageGroups = () => {
  return (
    <>
      <TeacherNavbar activeTab="manage" />
      <div className="admin-container">
        <ManageSidebar activeTab="groups" />

        {/* Main Panel */}
        <main className="main-panel">
          <section className="white-content-area">
            <div className="content-top-row">
              <h3>Manage / <span className="sub-path">Groups</span></h3>
              <button className="add-btn">+ Add Group</button>
            </div>

            <div className="search-filter-row">
              <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input type="text" placeholder="Search groups..." />
              </div>
              <div className="filter-box">
                Filter <span className="arrow-down">▼</span>
              </div>
            </div>

            <div className="overview-header">
              <h4>Groups Overview</h4>
              <div className="dropdown-pill">
                All <span className="arrow-down">▼</span>
              </div>
            </div>

            {/* Group Cards Grid */}
            <div className="groups-grid">
              <div className="group-card">
                <div className="group-header">
                  <h5>👥 Science Stars - States of Matter</h5>
                  <span className="member-count">5 Members</span>
                </div>
                <p className="group-desc">Fun experiments exploring solids, liquids and gases.</p>
                <div className="group-members">
                  <div className="member-avatar">👤</div>
                  <div className="member-avatar">👤</div>
                  <div className="member-avatar">👤</div>
                  <div className="member-avatar">👤</div>
                  <div className="member-avatar">👤</div>
                </div>
                <div className="group-footer">
                  <span className="status active">Active</span>
                  <button className="manage-btn">Manage</button>
                </div>
              </div>

              <div className="group-card">
                <div className="group-header">
                  <h5>🔢 Math Wizards - Algebra Basics</h5>
                  <span className="member-count">7 Members</span>
                </div>
                <p className="group-desc">Games and puzzles to practice patterns and simple equations.</p>
                <div className="group-members">
                  <div className="member-avatar">👤</div>
                  <div className="member-avatar">👤</div>
                  <div className="member-avatar">👤</div>
                  <div className="member-avatar">👤</div>
                  <div className="member-avatar">👤</div>
                  <span className="more-members">+2</span>
                </div>
                <div className="group-footer">
                  <span className="status active">Active</span>
                  <button className="manage-btn">Manage</button>
                </div>
              </div>

              <div className="group-card">
                <div className="group-header">
                  <h5>⚛️ Discovery Club - Atomic Structure</h5>
                  <span className="member-count">6 Members</span>
                </div>
                <p className="group-desc">Hands-on activities to understand atoms and elements.</p>
                <div className="group-members">
                  <div className="member-avatar">👤</div>
                  <div className="member-avatar">👤</div>
                  <div className="member-avatar">👤</div>
                  <div className="member-avatar">👤</div>
                  <div className="member-avatar">👤</div>
                  <span className="more-members">+1</span>
                </div>
                <div className="group-footer">
                  <span className="status active">Active</span>
                  <button className="manage-btn">Manage</button>
                </div>
              </div>

              <div className="group-card">
                <div className="group-header">
                  <h5>➕ Number Ninjas - Addition & Subtraction</h5>
                  <span className="member-count">4 Members</span>
                </div>
                <p className="group-desc">Playful counting and number games to build fluency.</p>
                <div className="group-members">
                  <div className="member-avatar">👤</div>
                  <div className="member-avatar">👤</div>
                  <div className="member-avatar">👤</div>
                  <div className="member-avatar">👤</div>
                </div>
                <div className="group-footer">
                  <span className="status inactive">Inactive</span>
                  <button className="manage-btn">Manage</button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default ManageGroups;