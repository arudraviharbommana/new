import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar(){
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  function onLogout(){ logout(); navigate('/') }

  return (
    <nav className="card">
      <div style={{display:'flex', gap:12, alignItems:'center'}}>
        <Link to="/">Smart Lab</Link>
        {isAuthenticated && user?.role === 'student' && <Link to="/student">Student</Link>}
        {isAuthenticated && user?.role === 'professor' && <Link to="/professor">Professor</Link>}
        {isAuthenticated && user?.role === 'admin' && <Link to="/admin">Admin</Link>}
      </div>
      <div>
        {!isAuthenticated ? (
          <>
            <Link to="/login">Login</Link>
            <span style={{marginLeft:8}} />
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span style={{marginRight:12}}>{user?.email} ({user?.role})</span>
            <button onClick={onLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  )
}
