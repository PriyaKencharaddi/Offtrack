import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './AuthCallback.css'

export function AuthCallback() {
  const { session, loading } = useAuth()
  const [error, setError] = useState('')
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const description = params.get('error_description') || params.get('error')
    if (description) setError(description.replace(/\+/g, ' '))
  }, [])
  if (session) return <Navigate to="/dashboard" replace />
  if (error) return <main className="callback-page"><h1>Sign-in could not finish.</h1><p>{error}</p><a className="button" href="/login">Return to sign in</a></main>
  return <main className="callback-page"><Loader2 className="spin" size={26}/><h1>{loading ? 'Finishing secure sign-in...' : 'No active sign-in session found.'}</h1><p>{loading ? 'One moment while we restore your session.' : 'Return to sign in and try again.'}</p>{!loading&&<a className="button" href="/login">Return to sign in</a>}</main>
}
