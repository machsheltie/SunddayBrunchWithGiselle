/**
 * Authentication Context
 *
 * Provides global authentication state and methods throughout the application.
 *
 * Features:
 * - User session management
 * - Authentication state listeners
 * - Sign up, sign in, sign out methods
 * - Session persistence via localStorage
 *
 * Usage:
 * ```jsx
 * import { useAuth } from '@/hooks/useAuth'
 *
 * function MyComponent() {
 *   const { user, signIn, signOut, loading } = useAuth()
 *   // ...
 * }
 * ```
 */

import React, { createContext, useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
  isConfigured: false,
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const configured = isSupabaseConfigured()

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    if (!configured) {
      setLoading(false)
      console.warn('Supabase not configured. Authentication features disabled.')
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [configured])

  /**
   * Sign up a new user with email and password
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @param {Object} metadata - Optional user metadata (display_name, etc.)
   * @returns {Promise<{user, session, error}>}
   */
  const signUp = useCallback(
    async (email, password, metadata = {}) => {
      if (!configured) {
        return {
          user: null,
          session: null,
          error: new Error('Supabase not configured'),
        }
      }

      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: metadata,
          },
        })

        if (error) throw error

        return { user: data.user, session: data.session, error: null }
      } catch (error) {
        console.error('Sign up error:', error)
        return { user: null, session: null, error }
      }
    },
    [configured]
  )

  /**
   * Sign in an existing user with email and password
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<{user, session, error}>}
   */
  const signIn = useCallback(
    async (email, password) => {
      if (!configured) {
        return {
          user: null,
          session: null,
          error: new Error('Supabase not configured'),
        }
      }

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        return { user: data.user, session: data.session, error: null }
      } catch (error) {
        console.error('Sign in error:', error)
        return { user: null, session: null, error }
      }
    },
    [configured]
  )

  /**
   * Sign out the current user
   * @returns {Promise<{error}>}
   */
  const signOut = useCallback(async () => {
    if (!configured) {
      return { error: new Error('Supabase not configured') }
    }

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error }
    }
  }, [configured])

  /**
   * Send password reset email
   * @param {string} email - User's email address
   * @returns {Promise<{error}>}
   */
  const resetPassword = useCallback(
    async (email) => {
      if (!configured) {
        return { error: new Error('Supabase not configured') }
      }

      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email)
        if (error) throw error
        return { error: null }
      } catch (error) {
        console.error('Reset password error:', error)
        return { error }
      }
    },
    [configured]
  )

  /**
   * Update user profile metadata
   * @param {Object} updates - Profile fields to update
   * @returns {Promise<{user, error}>}
   */
  const updateProfile = useCallback(
    async (updates) => {
      if (!configured) {
        return { user: null, error: new Error('Supabase not configured') }
      }

      try {
        const { data, error } = await supabase.auth.updateUser({
          data: updates,
        })

        if (error) throw error

        return { user: data.user, error: null }
      } catch (error) {
        console.error('Update profile error:', error)
        return { user: null, error }
      }
    },
    [configured]
  )

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    isConfigured: configured,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
