import React from 'react'
import './App.css'
import StudentNavbar from './Components/studentNavbar'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Home from './Pages/Student/Home'
import Learn from './Pages/Student/Learn'
import Progress from './Pages/Student/Progress'
import Tutor from './Pages/Student/Tutor'
import Discuss from './Pages/Student/Discuss'

const App = () => {
  return (
    <main>
        <Router>
            <StudentNavbar/>
            <Routes>
                <Route path="/home-student" element={<Home/>}/>
                <Route path="/learn-student" element={<Learn/>}/>
                <Route path="/progress-student" element={<Progress/>}/>
                <Route path="/tutor-student" element={<Tutor/>}/>
                <Route path="/discuss-student" element={<Discuss/>}/>
            </Routes>
        </Router>

    </main>
  )
}

export default App
