import React from 'react'
import { NavLink } from 'react-router-dom'

const StudentNavbar = () => {
  return (
    <header>
      <NavLink to="/home-student" className={({ isActive }) => isActive ? 'text-blue-700': 'text-black'}>Home</NavLink>
      <NavLink to="/learn-student" className={({ isActive }) => isActive ? 'text-blue-700': 'text-black'}>Learn</NavLink>
      <NavLink to="/progress-student" className={({ isActive }) => isActive ? 'text-blue-700': 'text-black'}>Progress</NavLink>
      <NavLink to="/tutor-student" className={({ isActive }) => isActive ? 'text-blue-700': 'text-black'}>AI Tutor</NavLink>
      <NavLink to="/discuss-student" className={({ isActive }) => isActive ? 'text-blue-700': 'text-black'}>Discussion Forum</NavLink>
    </header>
  )
}

export default StudentNavbar
