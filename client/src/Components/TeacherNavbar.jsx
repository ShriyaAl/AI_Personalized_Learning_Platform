import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../utils/auth/authActions';
import './TeacherNavbar.css';

const TeacherNavbar = ({ activeTab = 'dashboard' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(activeTab);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/teacher-home' },
    { id: 'manage', label: 'Manage', path: '/manage-courses' },
    { id: 'analytics', label: 'Analytics', path: '/teacher-analytics' },
    { id: 'forum', label: 'Discussion Forum', path: '/teacher-discussion' },
  ];

  const handleNavClick = (item) => {
    setActive(item.id);
    navigate(item.path);
  };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await logout(navigate);
  };

  return (
    <nav className="teacher-navbar relative z-[100]">
      <div className="navbar-container relative">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`navbar-item ${active === item.id ? 'active' : ''}`}
            onClick={() => handleNavClick(item)}
          >
            {item.label}
            {active === item.id && <span className="navbar-underline"></span>}
          </button>
        ))}

        {/* Profile Dropdown Section */}
        <div className="relative flex items-center ml-auto" ref={dropdownRef}>
          {isDropdownOpen && (
            <div className="absolute right-0 top-[100%] mt-2 w-48 bg-white border-[4px] border-black shadow-[6px_6px_0px_0px_#00a8ff] rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setActive('profile');
                    navigate('/teacher-profile');
                  }}
                  className="px-6 py-4 text-left font-black text-black hover:bg-[#00a8ff]/10 transition-colors border-b-[3px] border-black uppercase text-sm italic"
                >
                  My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-4 text-left font-black text-red-500 hover:bg-red-50 transition-colors uppercase text-sm italic"
                >
                  Logout →
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`navbar-item flex items-center gap-3 ${active === 'profile' || location.pathname === '/teacher-profile' ? 'active' : ''}`}
          >
            <span className={`text-[10px] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
              ▼
            </span>
            Profile
            {(active === 'profile' || location.pathname === '/teacher-profile') && <span className="navbar-underline"></span>}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TeacherNavbar;
