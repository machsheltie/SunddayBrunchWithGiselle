/**
 * Supabase Client Configuration
 *
 * This file initializes and exports the Supabase client instance
 * for use throughout the application.
 *
 * Environment Variables Required for auth and rating features:
 * - VITE_SUPABASE_URL: Your Supabase project URL
 * - VITE_SUPABASE_ANON_KEY: Your Supabase anonymous/public key
 */

import { createClient } from '@supabase/supabase-js'
import { createLogger } from './logger'

const logger = createLogger('Supabase')

// Validate environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

if (!supabaseConfigured) {
  logger.warn('Missing Supabase environment variables', {
    message: 'Auth and rating features require VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  })
}

function createNotConfiguredError() {
  return { message: 'Supabase not configured' }
}

function createDisabledQueryBuilder() {
  const result = {
    data: null,
    error: createNotConfiguredError()
  }

  const builder = {
    select: () => builder,
    upsert: () => builder,
    delete: () => builder,
    limit: () => builder,
    eq: () => builder,
    gte: () => builder,
    not: () => builder,
    order: () => builder,
    single: () => builder,
    then: (onFulfilled, onRejected) => Promise.resolve(result).then(onFulfilled, onRejected),
    catch: (onRejected) => Promise.resolve(result).catch(onRejected),
    finally: (onFinally) => Promise.resolve(result).finally(onFinally)
  }

  return builder
}

function createDisabledSupabaseClient() {
  return {
    auth: {
      getUser: async () => ({
        data: { user: null },
        error: createNotConfiguredError()
      }),
      getSession: async () => ({
        data: { session: null },
        error: createNotConfiguredError()
      }),
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      }),
      signUp: async () => ({
        data: { user: null, session: null },
        error: createNotConfiguredError()
      }),
      signInWithPassword: async () => ({
        data: { user: null, session: null },
        error: createNotConfiguredError()
      }),
      signOut: async () => ({
        error: createNotConfiguredError()
      }),
      resetPasswordForEmail: async () => ({
        data: null,
        error: createNotConfiguredError()
      }),
      updateUser: async () => ({
        data: { user: null },
        error: createNotConfiguredError()
      })
    },
    from: () => createDisabledQueryBuilder()
  }
}

/**
 * Supabase client instance
 *
 * Configuration:
 * - auth.persistSession: true (persist auth state in localStorage)
 * - auth.autoRefreshToken: true (automatically refresh expired tokens)
 * - auth.detectSessionInUrl: true (detect session from magic link/OAuth redirect)
 */
export const supabase = supabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
}) : createDisabledSupabaseClient()

/**
 * Helper function to check if Supabase is configured
 * @returns {boolean} True if Supabase environment variables are set
 */
export function isSupabaseConfigured() {
  return supabaseConfigured
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
