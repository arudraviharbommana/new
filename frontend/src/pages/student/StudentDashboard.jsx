import React from 'react'
import Assignments from './Assignments'

export default function StudentDashboard(){
  return (
    <div className="container dashboard">
      <aside className="sidebar card">
        <h3>Student</h3>
        <div>Quick stats (placeholder)</div>
      </aside>
      <main className="main">
        <Assignments />
      </main>
    </div>
  )
}
