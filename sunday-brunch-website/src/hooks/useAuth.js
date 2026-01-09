/**
 * useAuth Hook
 *
 * Custom hook to access authentication context.
 *
 * Provides:
 * - user: Current authenticated user object
 * - session: Current session object
 * - loading: Loading state during auth initialization
 * - signUp: Function to create new user account
 * - signIn: Function to sign in existing user
 * - signOut: Function to sign out current user
 * - updateProfile: Function to update user profile
 * - isConfigured: Whether Supabase is properly configured
 *
 * @throws {Error} If used outside of AuthProvider
 *
 * @example
 * ```jsx
 * import { useAuth } from '@/hooks/useAuth'
 *
 * function LoginForm() {
 *   const { signIn, loading } = useAuth()
 *
 *   const handleSubmit = async (email, password) => {
 *     const { error } = await signIn(email, password)
 *     if (error) {
 *       // Handle error
 *     }
 *   }
 *
 *   return (...)
 * }
 * ```
 */

import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
