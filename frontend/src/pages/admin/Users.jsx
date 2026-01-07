import React, { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function Users(){
  const [users, setUsers] = useState([])
  useEffect(()=>{ async function f(){ try{ const res = await api.get('/admin/users'); setUsers(res.data)}catch(e){ } }; f() },[])

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(u=> (
          <li key={u._id} className="card">{u.name} - {u.email} - {u.role}</li>
        ))}
      </ul>
    </div>
  )
}
