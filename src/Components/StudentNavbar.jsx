import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Home', path: '/home-student' },
  { name: 'Learn', path: '/learn-student' },
  { name: 'AI Tutor', path: '/tutor-student' },
  { name: 'Progress', path: '/progress-student' },
  { name: 'Discussion Forum', path: '/discuss-student' },
];

const profile = [
  { name: 'Profile', path: '/profile-student' }
]

const StudentNavbar = () => {
  const location = useLocation();
  const [arrowStyle, setArrowStyle] = useState({ left: 0, opacity: 0 });
  const navRefs = useRef({});

  useEffect(() => {
    // Find the nav item that matches the current URL path
    const allLinks = [...navItems, ...profile];
    const activeItem = allLinks.find(item => item.path === location.pathname);

    if (activeItem && navRefs.current[activeItem.path]) {
      const { offsetLeft, offsetWidth } = navRefs.current[activeItem.path];
      setArrowStyle({
        left: offsetLeft + offsetWidth / 2,
        opacity: 1,
      });
    }
  }, [location.pathname]); 

  return (
  <header className="bg-black pt-8 px-10 flex flex-col items-center w-full">
    <nav className="flex justify-between items-center w-full max-w-6xl relative">
      
      <div className="flex space-x-10">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            ref={(el) => (navRefs.current[item.path] = el)}
            className={({ isActive }) =>
              `pb-6 text-lg transition-colors duration-300 ${
                isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>

      <div className="flex">
        {profile.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            ref={(el) => (navRefs.current[item.path] = el)}
            className={({ isActive }) =>
              `pb-6 text-lg transition-colors duration-300 ${
                isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>

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