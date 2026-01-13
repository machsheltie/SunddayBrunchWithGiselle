import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import WhimsicalLoader from './WhimsicalLoader'

/**
 * ProtectedRoute Component
 *
 * Protects routes that require authentication.
 * - Shows loading state while checking authentication
 * - Redirects to home if not authenticated
 * - Renders children if authenticated
 *
 * Usage:
 * <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Show loading state while checking authentication
  if (loading) {
    return <WhimsicalLoader />
  }

  // Redirect to home if not authenticated
  // Store the intended destination so we can redirect back after login
  if (!user) {
    return <Navigate to="/" state={{ from: location, requiresAuth: true }} replace />
  }

  // User is authenticated, render the protected content
  return children
}
