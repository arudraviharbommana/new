import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register(){
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'student' })
  const [error, setError] = useState('')
  const { register } = useAuth()
  const nav = useNavigate()

  async function handle(e){
    e.preventDefault(); setError('')
    try{
      await register(form)
      nav('/')
    }catch(err){ setError(err.response?.data?.error || 'Register failed') }
  }

  return (
    <div className="container">
      <div className="card" style={{maxWidth:480, margin:'0 auto'}}>
        <h2>Register</h2>
        {error && <div style={{color:'red'}}>{error}</div>}
        <form onSubmit={handle}>
          <div style={{marginBottom:8}}>
            <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          </div>
          <div style={{marginBottom:8}}>
            <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
          </div>
          <div style={{marginBottom:8}}>
            <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
          </div>
          <div style={{marginBottom:8}}>
            <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
              <option value="student">Student</option>
              <option value="professor">Professor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  )
}
