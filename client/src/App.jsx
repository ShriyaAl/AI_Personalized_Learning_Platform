import React from 'react'
import './App.css'
import StudentNavbar from './Components/studentNavbar'
import { Route, BrowserRouter as Router, Routes, Navigate, useLocation } from 'react-router-dom'

// STUDENT PAGES
import Home from './Pages/Student/Home'
import Learn from './Pages/Student/Learn'
import Progress from './Pages/Student/Progress'
import Tutor from './Pages/Student/Tutor'
import Discuss from './Pages/Student/Discuss'
import Profile from './Pages/Student/Profile'
import CourseModules from './Pages/Student/ui/CourseModules'
import LessonView from './Pages/Student/ui/LessonView'

// TEACHER PAGES
import TeacherHome from "./Pages/Teacher/TeacherHome/TeacherHome"
import ManageCourses from "./Pages/Teacher/Manage/ManageCourses"
import ManageStudents from "./Pages/Teacher/Manage/ManageStudents"
import ManageGroups from "./Pages/Teacher/Manage/ManageGroups"
import ManageMaterials from "./Pages/Teacher/Manage/ManageMaterials"
import ManageQuizzes from './Pages/Teacher/Manage/ManageQuizzes'
import Analytics from "./Pages/Teacher/Analytics/Analytics"
import DiscussionForum from "./Pages/Teacher/DiscussionForum/DiscussionForum"
import TeacherProfile from "./Pages/Teacher/Profile/Profile"

// ADMIN PAGES (Professional/Formal Style)
import AdminHome from './Pages/Admin/AdminHome'
import AdminLogin from './Pages/Admin/AdminLogin'

// AUTH & GENERAL
import Login from './Pages/Login'
import LandingPage from './Pages/LandingPage'
import { AuthProvider } from './utils/auth/AuthContext'
import ProtectedRoute from './utils/auth/ProtectedRoute'

const AppContent = () => {
  const location = useLocation();

  const isStudentPage = /-student(\/|$)/.test(location.pathname);
  const isAdminPage = /-admin(\/|$)/.test(location.pathname);

  return (
    <main className={
      isStudentPage ? "min-h-screen bg-black flex flex-col" : 
      isAdminPage ? "min-h-screen bg-slate-50 flex flex-col font-sans" : 
      "min-h-screen"
    }>
      
      {/* 1. STUDENT ZONE */}
      {isStudentPage && (
        <ProtectedRoute allowedRoles={['student', 'admin']}>
          <StudentNavbar />
          <section className="flex-1 bg-white mx-4 mb-4 rounded-[40px] p-8 shadow-2xl overflow-y-auto">
            <Routes>
              <Route path="/home-student" element={<Home />} />
              <Route path="/learn-student" element={<Learn />} />
              <Route path="/learn-student/:courseId" element={<CourseModules />} />
              <Route path="/learn-student/:courseId/:subModuleId" element={<LessonView />} />
              <Route path="/progress-student" element={<Progress />} />
              <Route path="/tutor-student" element={<Tutor />} />
              <Route path="/discuss-student" element={<Discuss />} />
              <Route path="/profile-student" element={<Profile />} />
            </Routes>
          </section>
        </ProtectedRoute>
      )}

      {/* 2. ADMIN ZONE */}
      {isAdminPage && (
        <section className="flex-1 w-full">
          <Routes>
            <Route path="/login-admin" element={<AdminLogin />} />
            <Route 
              path="/home-admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminHome />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </section>
      )}

      {/* 3. PUBLIC & TEACHER ZONE */}
      {!isStudentPage && !isAdminPage && (
        <Routes>
          {/* PUBLIC ROUTES - NO ProtectedRoute here! */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* TEACHER ROUTES - Protected individually */}
          <Route path="/teacher-home" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherHome/></ProtectedRoute>} />
          <Route path="/manage-courses" element={<ProtectedRoute allowedRoles={['teacher']}><ManageCourses/></ProtectedRoute>} />
          <Route path="/manage-students" element={<ProtectedRoute allowedRoles={['teacher']}><ManageStudents/></ProtectedRoute>} />
          <Route path="/manage-groups" element={<ProtectedRoute allowedRoles={['teacher']}><ManageGroups/></ProtectedRoute>} />
          <Route path="/manage-materials" element={<ProtectedRoute allowedRoles={['teacher']}><ManageMaterials/></ProtectedRoute>} />
          <Route path="/manage-quizzes" element={<ProtectedRoute allowedRoles={['teacher']}><ManageQuizzes/></ProtectedRoute>} />
          <Route path="/teacher-analytics" element={<ProtectedRoute allowedRoles={['teacher']}><Analytics/></ProtectedRoute>} />
          <Route path="/teacher-discussion" element={<ProtectedRoute allowedRoles={['teacher']}><DiscussionForum/></ProtectedRoute>} />
          <Route path="/teacher-profile" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherProfile/></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </main>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App