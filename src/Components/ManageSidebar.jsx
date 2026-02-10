import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ManageSidebar.css';

const ManageSidebar = ({ activeTab = 'courses' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(activeTab);

  const menuItems = [
    { id: 'courses', label: 'Courses', path: '/manage-courses' },
    { id: 'students', label: 'Students', path: '/manage-students' },
    { id: 'groups', label: 'Groups', path: '/manage-groups' },
    { id: 'materials', label: 'Materials', path: '/manage-materials' },
    { id: 'quizzes', label: 'Quizzes', path: '/manage-quizzes' },
  ];

  // Update active tab based on current location
  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find(item => item.path === currentPath);
    if (currentItem) {
      setActive(currentItem.id);
    }
  }, [location.pathname]);

  const handleMenuClick = (item) => {
    setActive(item.id);
    navigate(item.path);
  };

  return (
    <aside className="manage-sidebar">
      <div className="sidebar-header">
        <span className="settings-icon">⚙</span>
        <h2>MANAGE</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${active === item.id ? 'active' : ''}`}
            onClick={() => handleMenuClick(item)}
          >
            {item.label}
            {active === item.id && <span className="arrow">»</span>}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default ManageSidebar;
