import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [token, user])

  async function login({ email, password }) {
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      setToken(res.data.token)
      setUser(res.data.user)
      setLoading(false)
      return res.data
    } catch (err) {
      setLoading(false)
      throw err
    }
  }

  async function register({ name, email, password, role }) {
    setLoading(true)
    try {
      const res = await api.post('/auth/register', { name, email, password, role })
      setToken(res.data.token)
      setUser(res.data.user)
      setLoading(false)
      return res.data
    } catch (err) {
      setLoading(false)
      throw err
    }
  }

  function logout() {
    setToken('')
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const role = user?.role || null
  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ user, role, token, isAuthenticated, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
