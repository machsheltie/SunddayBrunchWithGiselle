/**
 * Supabase Client Configuration
 *
 * This file initializes and exports the Supabase client instance
 * for use throughout the application.
 *
 * Environment Variables Required:
 * - VITE_SUPABASE_URL: Your Supabase project URL
 * - VITE_SUPABASE_ANON_KEY: Your Supabase anonymous/public key
 */

import { createClient } from '@supabase/supabase-js'

// Validate environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase environment variables. Please check your .env.local file.\n' +
    'Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY'
  )
}

/**
 * Supabase client instance
 *
 * Configuration:
 * - auth.persistSession: true (persist auth state in localStorage)
 * - auth.autoRefreshToken: true (automatically refresh expired tokens)
 * - auth.detectSessionInUrl: true (detect session from magic link/OAuth redirect)
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
})

/**
 * Helper function to check if Supabase is configured
 * @returns {boolean} True if Supabase environment variables are set
 */
export function isSupabaseConfigured() {
  return !!(supabaseUrl && supabaseAnonKey)
}

/**
 * Helper function to get the current user
 * @returns {Promise<{user: User | null, error: Error | null}>}
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

/**
 * Helper function to get the current session
 * @returns {Promise<{session: Session | null, error: Error | null}>}
 */
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

export default supabase
