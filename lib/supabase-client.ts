import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create client for client-side operations only (reads)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    })
  : null

// Log configuration for debugging (only if client was created)
if (supabase) {
  console.log('🔧 Supabase client initialized for client-side operations')
  console.log('🔧 URL:', supabaseUrl)
} else {
  console.log('⚠️ Supabase client not initialized - missing environment variables')
}
