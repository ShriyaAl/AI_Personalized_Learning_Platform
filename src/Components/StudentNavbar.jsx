import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { logout } from '../utils/auth/authActions';

const navItems = [
  { name: 'Home', path: '/home-student' },
  { name: 'Learn', path: '/learn-student' },
  { name: 'AI Tutor', path: '/tutor-student' },
  { name: 'Progress', path: '/progress-student' },
  { name: 'Discussion Forum', path: '/discuss-student' },
];

const StudentNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [arrowStyle, setArrowStyle] = useState({ left: 0, opacity: 0 });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const navRefs = useRef({});
  const dropdownRef = useRef(null);
  const containerRef = useRef(null); // Reference to the whole navbar

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const allLinks = [...navItems, { name: 'Profile', path: '/profile-student' }];
    const activeItem = allLinks.find(item => item.path === location.pathname);

    if (activeItem && navRefs.current[activeItem.path] && containerRef.current) {
      // Calculate position relative to the main nav container
      const navRect = containerRef.current.getBoundingClientRect();
      const itemRect = navRefs.current[activeItem.path].getBoundingClientRect();
      
      const relativeLeft = itemRect.left - navRect.left;
      
      setArrowStyle({
        left: relativeLeft + itemRect.width / 2,
        opacity: 1,
      });
    }
  }, [location.pathname]); 

  const handleLogout = async () => {
    setIsDropdownOpen(false); // Close the UI dropdown
    await logout(navigate);   // This clears Firebase, Cookies, and Navigates
  };

  return (
    <header className="bg-black pt-8 px-10 flex flex-col items-center w-full relative z-[100]">
      <nav 
        ref={containerRef}
        className="flex justify-between items-center w-full max-w-6xl relative"
      >
        
        {/* Main Navigation Links */}
        <div className="flex space-x-10">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              ref={(el) => (navRefs.current[item.path] = el)}
              className={({ isActive }) =>
                `pb-6 text-lg transition-colors duration-300 font-bold ${
                  isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Profile + Side-Dropdown Section */}
        <div className="relative flex items-center" ref={dropdownRef}>
          
          {isDropdownOpen && (
            <div className="absolute right-[calc(100%+20px)] top-[-15px] w-48 bg-white border-[4px] border-black shadow-[6px_6px_0px_0px_#F3B8F8] rounded-2xl overflow-hidden animate-in fade-in slide-in-from-right-2 duration-200">
              <div className="flex flex-col">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/profile-student');
                  }}
                  className="px-6 py-4 text-left font-black text-black hover:bg-[#F3B8F8] transition-colors border-b-[3px] border-black uppercase text-sm italic"
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
            ref={(el) => (navRefs.current['/profile-student'] = el)}
            className={`pb-6 text-lg transition-colors duration-300 font-bold flex items-center gap-3 ${
              location.pathname === '/profile-student' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <span className={`text-xs transition-transform duration-300 ${isDropdownOpen ? 'rotate-90' : ''}`}>
              ◀
            </span>
            Profile
          </button>
        </div>

        {/* The Animated Indicator Triangle (Bottom) */}
        <div
          className="absolute bottom-0 w-8 h-4 bg-white transition-all duration-700 ease-in-out"
          style={{
            left: arrowStyle.left,
            opacity: arrowStyle.opacity,
            transform: 'translateX(-50%)',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          }}
        />
      </nav>
    </header>
  );
};

export default StudentNavbar;