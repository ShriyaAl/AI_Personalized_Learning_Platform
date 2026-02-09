// import React from 'react'
// import './App.css'
// import StudentNavbar from './Components/studentNavbar'
// import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom'
// import Home from './Pages/Student/Home'
// import Learn from './Pages/Student/Learn'
// import Progress from './Pages/Student/Progress'
// import Tutor from './Pages/Student/Tutor'
// import Discuss from './Pages/Student/Discuss'
// import Profile from './Pages/Student/Profile'

// const App = () => {
//   return (
//     <main className="min-h-screen bg-black flex flex-col">
//         <Router>
//             <StudentNavbar/>
//             {/* The Main Content Card */}
//             <section className="flex-1 bg-white mx-4 mb-4 rounded-[40px] p-8 shadow-2xl">
//                 <Routes>
//                     {/* Redirect root to home-student */}
//                     <Route path="/" element={<Navigate to="/home-student" />} />
                    
//                     <Route path="/home-student" element={<Home/>}/>
//                     <Route path="/learn-student" element={<Learn/>}/>
//                     <Route path="/progress-student" element={<Progress/>}/>
//                     <Route path="/tutor-student" element={<Tutor/>}/>
//                     <Route path="/discuss-student" element={<Discuss/>}/>
//                     <Route path="/profile-student" element={<Profile/>}/>
//                 </Routes>
//             </section>
//         </Router>
//     </main>
//   )
// }

// export default App

import React from 'react'
import './App.css'
import StudentNavbar from './Components/studentNavbar'
import { Route, BrowserRouter as Router, Routes, Navigate, useLocation } from 'react-router-dom'
import Home from './Pages/Student/Home'
import Learn from './Pages/Student/Learn'
import Progress from './Pages/Student/Progress'
import Tutor from './Pages/Student/Tutor'
import Discuss from './Pages/Student/Discuss'
import Profile from './Pages/Student/Profile'
import Login from './Pages/Login'

const AppContent = () => {
  const location = useLocation();

  // Identify if we are in the "Student Zone"
  const isStudentPage = location.pathname.includes('-student');

  return (
    <main className={isStudentPage ? "min-h-screen bg-black flex flex-col" : ""}>
      
      {/* Show Navbar only on student pages */}
      {isStudentPage && <StudentNavbar />}

      {/* Wrap content in the White Card ONLY for student pages */}
      {isStudentPage ? (
        <section className="flex-1 bg-white mx-4 mb-4 rounded-[40px] p-8 shadow-2xl">
          <Routes>
            <Route path="/home-student" element={<Home />} />
            <Route path="/learn-student" element={<Learn />} />
            <Route path="/progress-student" element={<Progress />} />
            <Route path="/tutor-student" element={<Tutor />} />
            <Route path="/discuss-student" element={<Discuss />} />
            <Route path="/profile-student" element={<Profile />} />
          </Routes>
        </section>
      ) : (
        <Routes>
          <Route path="/" element={<div className="text-black">Landing Page</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/teacher-home" element={<div className="text-black">Teacher Dashboard</div>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </main>
  );
}

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App