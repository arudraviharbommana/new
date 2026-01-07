import React from 'react'
import CreateAssignment from './CreateAssignment'

export default function ProfessorDashboard(){
  return (
    <div className="container dashboard">
      <aside className="sidebar card"><h3>Professor</h3></aside>
      <main className="main">
        <CreateAssignment />
      </main>
    </div>
  )
}
