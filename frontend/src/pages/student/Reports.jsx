import React, { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function Reports(){
  const [reports, setReports] = useState([])
  useEffect(()=>{ async function f(){ try{ const res = await api.get('/student/submissions'); setReports(res.data)}catch(e){}}; f() },[])

  return (
    <div>
      <h2>Your Submissions</h2>
      <ul>
        {reports.map(s=> (
          <li key={s._id} className="card">{s.assignment?.title || 'Unknown'} - Plagiarism: {s.plagiarism_score ?? 'N/A'}</li>
        ))}
      </ul>
    </div>
  )
}
