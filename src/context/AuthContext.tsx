import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

type AuthValue = { session: Session | null; loading: boolean; configured: boolean; signOut: () => Promise<void> }
const AuthContext = createContext<AuthValue | undefined>(undefined)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    const client = supabase
    const syncProfile = async (next: Session | null) => {
      if (!next?.user) return
      await client.from('Users').upsert({
        id: next.user.id,
        email: next.user.email,
        full_name: next.user.user_metadata.full_name ?? next.user.user_metadata.name ?? null,
        avatar_url: next.user.user_metadata.avatar_url ?? null,
      }, { onConflict: 'id' })
    }
    client.auth.getSession().then(({ data }) => { setSession(data.session); void syncProfile(data.session); setLoading(false) })
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, next) => {
      setSession(next); setLoading(false)
      void syncProfile(next)
    })
    return () => subscription.unsubscribe()
  }, [])
  return <AuthContext.Provider value={{ session, loading, configured: isSupabaseConfigured, signOut: async () => { await supabase?.auth.signOut() } }}>{children}</AuthContext.Provider>
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used inside AuthProvider'); return value }
