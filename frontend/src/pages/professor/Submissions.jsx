import React, { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function Submissions(){
  const [subs, setSubs] = useState([])
  useEffect(()=>{ async function f(){ try{ const res = await api.get('/professor/submissions'); setSubs(res.data)}catch(e){ } }; f() },[])

  return (
    <div>
      <h2>Submissions</h2>
      <ul>
        {subs.map(s=> (
          <li key={s._id} className="card">{s.student?.name || 'Student'} - {s.assignment?.title || 'Assignment'}</li>
        ))}
      </ul>
    </div>
  )
}
