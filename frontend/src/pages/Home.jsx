import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="container">
      <div className="header">
        <h1>Smart Lab Platform</h1>
        <p className="muted">A place to manage assignments, submissions, and plagiarism</p>
      </div>

      <div style={{display:'flex',gap:16,marginTop:16}}>
        <div className="card" style={{flex:1}}>
          <h3>Students</h3>
          <p>View assignments, submit work and view plagiarism reports.</p>
          <Link to="/login">Get Started</Link>
        </div>
        <div className="card" style={{flex:1}}>
          <h3>Professors</h3>
          <p>Create assignments, review submissions, and compute plagiarism.</p>
          <Link to="/login">Get Started</Link>
        </div>
        <div className="card" style={{flex:1}}>
          <h3>Admins</h3>
          <p>Manage users and system overview.</p>
          <Link to="/login">Get Started</Link>
        </div>
      </div>
    </div>
  )
}
