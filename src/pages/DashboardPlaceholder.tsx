import { LogOut, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
export function DashboardPlaceholder(){ const { session, signOut }=useAuth(); return <div className="dash-placeholder"><Sparkles/><p>Phase 1 complete</p><h1>Welcome, {session?.user.user_metadata.full_name?.split(' ')[0] || 'there'}.</h1><span>Your subscription command center arrives in Phase 2.</span><button onClick={signOut} className="button"><LogOut size={16}/> Sign out</button></div> }
