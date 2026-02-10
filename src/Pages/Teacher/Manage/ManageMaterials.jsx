import React from 'react';
import TeacherNavbar from '../../../Components/TeacherNavbar';
import ManageSidebar from '../../../Components/ManageSidebar';
import './ManageMaterials.css';

const ManageMaterials = () => {
  return (
    <>
      <TeacherNavbar activeTab="manage" />
      <div className="dashboard-container">
        <ManageSidebar activeTab="materials" />

        {/* Main Content Area */}
        <main className="content-area">
          <section className="white-panel">
            <div className="breadcrumb-header">
              <h3>Manage / <span className="breadcrumb-highlight">Materials</span></h3>
              <button className="add-material-btn">+ Add Material</button>
            </div>

            <div className="action-row">
              <div className="search-container">
                <span className="search-icon">🔍</span>
                <input type="text" placeholder="Search materials..." />
              </div>
              <div className="filter-dropdown">
                Filter <span className="caret">▼</span>
              </div>
            </div>

            <h4>Materials Overview</h4>
            
            {/* Materials List */}
            <div className="materials-list">
              <div className="material-item">
                <div className="material-icon">📄</div>
                <div className="material-info">
                  <h5>States of Matter - Slide Deck.pdf</h5>
                  <p className="material-meta">Science • PDF • 1.2 MB • Uploaded 2 days ago</p>
                </div>
                <div className="material-stats">
                  <span className="views">👁️ 48 views</span>
                  <span className="downloads">⬇️ 20 downloads</span>
                </div>
                <div className="material-actions">
                  <button className="action-btn">Edit</button>
                  <button className="action-btn">Delete</button>
                </div>
              </div>

              <div className="material-item">
                <div className="material-icon">🎥</div>
                <div className="material-info">
                  <h5>Fizz & Pop: States of Matter Video</h5>
                  <p className="material-meta">Science • Video • 85 MB • Uploaded 5 days ago</p>
                </div>
                <div className="material-stats">
                  <span className="views">👁️ 132 views</span>
                  <span className="downloads">⬇️ 44 downloads</span>
                </div>
                <div className="material-actions">
                  <button className="action-btn">Edit</button>
                  <button className="action-btn">Delete</button>
                </div>
              </div>

              <div className="material-item">
                <div className="material-icon">🎵</div>
                <div className="material-info">
                  <h5>Counting Song - Addition Practice.mp3</h5>
                  <p className="material-meta">Math • Audio • 3.5 MB • Uploaded 1 week ago</p>
                </div>
                <div className="material-stats">
                  <span className="views">👁️ 210 views</span>
                  <span className="downloads">⬇️ 98 downloads</span>
                </div>
                <div className="material-actions">
                  <button className="action-btn">Edit</button>
                  <button className="action-btn">Delete</button>
                </div>
              </div>

              <div className="material-item">
                <div className="material-icon">🧩</div>
                <div className="material-info">
                  <h5>Atomic Model Interactive</h5>
                  <p className="material-meta">Science • Interactive • Online • Uploaded 1 week ago</p>
                </div>
                <div className="material-stats">
                  <span className="views">👁️ 76 views</span>
                  <span className="downloads">⬇️ 30 saves</span>
                </div>
                <div className="material-actions">
                  <button className="action-btn">Edit</button>
                  <button className="action-btn">Delete</button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default ManageMaterials;