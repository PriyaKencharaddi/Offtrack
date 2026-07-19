import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && key);

export const supabase = isSupabaseConfigured
  ? createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        // This is a client-only Vite SPA. The implicit flow avoids a PKCE
        // verifier handoff that can be lost when the provider redirects back.
        flowType: 'implicit',
        detectSessionInUrl: true,
      },
    })
  : null;
