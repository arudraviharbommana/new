import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login(){
  const [form, setForm] = useState({ email:'', password:'' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const nav = useNavigate()

  async function handle(e){
    e.preventDefault(); setError('')
    try{
      await login(form)
      nav('/')
    }catch(err){ setError(err.response?.data?.error || 'Login failed') }
  }

  return (
    <div className="container">
      <div className="card" style={{maxWidth:480, margin:'0 auto'}}>
        <h2>Login</h2>
        {error && <div style={{color:'red'}}>{error}</div>}
        <form onSubmit={handle}>
          <div style={{marginBottom:8}}>
            <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
          </div>
          <div style={{marginBottom:8}}>
            <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  )
}
