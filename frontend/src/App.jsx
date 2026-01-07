import React, { useEffect, useState } from 'react'
import api from './api'

export default function App() {
  const [status, setStatus] = useState('unknown')
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [me, setMe] = useState(null)
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', role: 'student' })
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [assignments, setAssignments] = useState([])

  useEffect(() => {
    fetchHealth()
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchMe()
    }
  }, [token])

  async function fetchHealth() {
    try {
      const res = await api.get('/health')
      setStatus(res.data.status)
    } catch (err) {
      setStatus('down')
    }
  }

  async function fetchMe() {
    try {
      const res = await api.get('/auth/me')
      setMe(res.data)
      if (res.data.role === 'student') fetchAssignments()
    } catch (err) {
      setMe(null)
    }
  }

  async function fetchAssignments() {
    try {
      const res = await api.get('/student/assignments')
      setAssignments(res.data)
    } catch (err) {
      setAssignments([])
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    try {
      const res = await api.post('/auth/register', registerData)
      localStorage.setItem('token', res.data.token)
      setToken(res.data.token)
      setRegisterData({ name: '', email: '', password: '', role: 'student' })
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed')
    }
  }

  async function handleLogin(e) {
    e.preventDefault()
    try {
      const res = await api.post('/auth/login', loginData)
      localStorage.setItem('token', res.data.token)
      setToken(res.data.token)
      setLoginData({ email: '', password: '' })
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed')
    }
  }

  function logout() {
    localStorage.removeItem('token')
    setToken('')
    setMe(null)
    delete api.defaults.headers.common['Authorization']
  }

  return (
    <div className="container">
      <h1>Assignment App</h1>
      <p>Backend status: <strong>{status}</strong></p>

      {!me && (
        <div style={{ display: 'flex', gap: 20 }}>
          <form onSubmit={handleRegister}>
            <h3>Register</h3>
            <input placeholder="Name" value={registerData.name} onChange={e=>setRegisterData({...registerData, name:e.target.value})} />
            <input placeholder="Email" value={registerData.email} onChange={e=>setRegisterData({...registerData, email:e.target.value})} />
            <input placeholder="Password" type="password" value={registerData.password} onChange={e=>setRegisterData({...registerData, password:e.target.value})} />
            <select value={registerData.role} onChange={e=>setRegisterData({...registerData, role:e.target.value})}>
              <option value="student">Student</option>
              <option value="professor">Professor</option>
            </select>
            <button type="submit">Register</button>
          </form>

          <form onSubmit={handleLogin}>
            <h3>Login</h3>
            <input placeholder="Email" value={loginData.email} onChange={e=>setLoginData({...loginData, email:e.target.value})} />
            <input placeholder="Password" type="password" value={loginData.password} onChange={e=>setLoginData({...loginData, password:e.target.value})} />
            <button type="submit">Login</button>
          </form>
        </div>
      )}

      {me && (
        <div>
          <p>Signed in as <strong>{me.email}</strong> ({me.role})</p>
          <button onClick={logout}>Logout</button>

          {me.role === 'student' && (
            <div>
              <h3>Your Assignments</h3>
              <ul>
                {assignments.map(a => (
                  <li key={a._id}>{a.title} - {a.description}</li>
                ))}
              </ul>
            </div>
          )}

          {me.role === 'professor' && (
            <p>Professor dashboard (not implemented in this simple UI)</p>
          )}
        </div>
      )}
    </div>
  )
}
