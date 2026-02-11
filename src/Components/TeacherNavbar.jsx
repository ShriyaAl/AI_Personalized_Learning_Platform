import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeacherNavbar.css';

const TeacherNavbar = ({ activeTab = 'dashboard' }) => {
  const navigate = useNavigate();
  const [active, setActive] = useState(activeTab);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/teacher-home' },
    { id: 'manage', label: 'Manage', path: '/manage-courses' },
    { id: 'analytics', label: 'Analytics', path: '/teacher-analytics' },
    { id: 'forum', label: 'Discussion Forum', path: '/teacher-discussion' },
    { id: 'profile', label: 'Profile', path: '/teacher-profile' },
  ];

  const handleNavClick = (item) => {
    setActive(item.id);
    navigate(item.path);
  };

  return (
    <nav className="teacher-navbar">
      <div className="navbar-container">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`navbar-item ${active === item.id ? 'active' : ''}`}
            onClick={() => handleNavClick(item)}
            style={item.id === 'profile' ? { marginLeft: 'auto' } : {}}
          >
            {item.label}
            {active === item.id && <span className="navbar-underline"></span>}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default TeacherNavbar;
