import React from 'react'
import Users from './Users'

export default function AdminDashboard(){
  return (
    <div className="container dashboard">
      <aside className="sidebar card"><h3>Admin</h3></aside>
      <main className="main"><Users /></main>
    </div>
  )
}
