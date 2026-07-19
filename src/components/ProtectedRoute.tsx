import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'
export function ProtectedRoute({ children }: { children: ReactNode }) { const { session, loading } = useAuth(); if (loading) return <div className="center-screen"><i className="loader"/></div>; return session ? <>{children}</> : <Navigate to="/login" replace /> }
