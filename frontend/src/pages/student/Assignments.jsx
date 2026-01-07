import React, { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function Assignments(){
  const [assignments, setAssignments] = useState([])

  useEffect(()=>{ fetchAssignments() },[])

  async function fetchAssignments(){
    try{ const res = await api.get('/student/assignments'); setAssignments(res.data) }catch(err){ setAssignments([]) }
  }

  return (
    <div>
      <h2>Assignments</h2>
      {assignments.length===0 && <div className="card">No assignments</div>}
      <ul>
        {assignments.map(a=> (
          <li key={a._id} className="card" style={{marginBottom:8}}>
            <strong>{a.title}</strong>
            <p>{a.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
