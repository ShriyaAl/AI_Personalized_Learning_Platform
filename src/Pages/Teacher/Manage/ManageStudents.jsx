import React from 'react';
import TeacherNavbar from '../../../Components/TeacherNavbar';
import ManageSidebar from '../../../Components/ManageSidebar';
import './ManageStudents.css';

const ManageStudents = () => {
  return (
    <>
      <TeacherNavbar activeTab="manage" />
      <div className="dashboard-wrapper">
        <ManageSidebar activeTab="students" />

        {/* Main Content */}
        <main className="main-viewport">
          <section className="white-panel">
            <div className="panel-header">
              <h3>Manage / <span className="breadcrumb-light">Students</span></h3>
              <button className="btn-primary">+ Add Student</button>
            </div>

            <div className="utility-bar">
              <div className="search-box">
                <span className="icon-search">🔍</span>
                <input type="text" placeholder="Search students..." />
              </div>
              <div className="dropdown-filter">
                Filter <span className="caret">▼</span>
              </div>
            </div>

            <div className="overview-row">
              <h4>Students Overview</h4>
              <div className="group-filter-dropdown">
                All Groups <span className="caret">▼</span>
              </div>
            </div>

            {/* Students Table */}
            <div className="students-table">
              <div className="table-header">
                <div className="col col-name">Name</div>
                <div className="col col-email">Email</div>
                <div className="col col-group">Group</div>
                <div className="col col-progress">Progress</div>
                <div className="col col-action">Action</div>
              </div>

              <div className="table-rows">
                <div className="table-row">
                  <div className="col col-name">
                    <span className="avatar">👤</span>
                    <span>Aarav Patel</span>
                  </div>
                  <div className="col col-email">aarav@example.com</div>
                  <div className="col col-group">Science Stars</div>
                  <div className="col col-progress">
                    <div className="progress-bar"><div className="progress-fill" style={{width: '75%'}}></div></div>
                    <span>75%</span>
                  </div>
                  <div className="col col-action">
                    <button className="action-btn edit">✏️</button>
                    <button className="action-btn delete">🗑️</button>
                  </div>
                </div>

                <div className="table-row">
                  <div className="col col-name">
                    <span className="avatar">👤</span>
                    <span>Bheema Singh</span>
                  </div>
                  <div className="col col-email">bheema@example.com</div>
                  <div className="col col-group">Math Wizards</div>
                  <div className="col col-progress">
                    <div className="progress-bar"><div className="progress-fill" style={{width: '60%'}}></div></div>
                    <span>60%</span>
                  </div>
                  <div className="col col-action">
                    <button className="action-btn edit">✏️</button>
                    <button className="action-btn delete">🗑️</button>
                  </div>
                </div>

                <div className="table-row">
                  <div className="col col-name">
                    <span className="avatar">👤</span>
                    <span>Chiara Verma</span>
                  </div>
                  <div className="col col-email">chiara@example.com</div>
                  <div className="col col-group">Science Stars</div>
                  <div className="col col-progress">
                    <div className="progress-bar"><div className="progress-fill" style={{width: '82%'}}></div></div>
                    <span>82%</span>
                  </div>
                  <div className="col col-action">
                    <button className="action-btn edit">✏️</button>
                    <button className="action-btn delete">🗑️</button>
                  </div>
                </div>

                <div className="table-row">
                  <div className="col col-name">
                    <span className="avatar">👤</span>
                    <span>Divya Gupta</span>
                  </div>
                  <div className="col col-email">divya@example.com</div>
                  <div className="col col-group">Discovery Club</div>
                  <div className="col col-progress">
                    <div className="progress-bar"><div className="progress-fill" style={{width: '45%'}}></div></div>
                    <span>45%</span>
                  </div>
                  <div className="col col-action">
                    <button className="action-btn edit">✏️</button>
                    <button className="action-btn delete">🗑️</button>
                  </div>
                </div>

                <div className="table-row">
                  <div className="col col-name">
                    <span className="avatar">👤</span>
                    <span>Emma Wilson</span>
                  </div>
                  <div className="col col-email">emma@example.com</div>
                  <div className="col col-group">Math Wizards</div>
                  <div className="col col-progress">
                    <div className="progress-bar"><div className="progress-fill" style={{width: '88%'}}></div></div>
                    <span>88%</span>
                  </div>
                  <div className="col col-action">
                    <button className="action-btn edit">✏️</button>
                    <button className="action-btn delete">🗑️</button>
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

export default ManageStudents;