import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, role }){
  const { isAuthenticated, role: userRole } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role && userRole !== role && userRole !== 'admin') return <Navigate to="/" replace />
  return children
}
