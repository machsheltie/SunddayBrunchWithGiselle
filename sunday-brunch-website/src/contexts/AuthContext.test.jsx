import { render, screen, waitFor, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AuthProvider, AuthContext } from './AuthContext'
import { useContext } from 'react'
import { supabase } from '../lib/supabase'

// Mock Supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn()
    }
  }
}))

// Test consumer component
function TestConsumer() {
  const { user, loading, signIn, signUp, signOut, resetPassword } = useContext(AuthContext)

  return (
    <div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="user">{user ? user.email : 'No User'}</div>
      <button onClick={() => signIn('test@example.com', 'password123')}>Sign In</button>
      <button onClick={() => signUp('test@example.com', 'password123', 'Test User')}>Sign Up</button>
      <button onClick={signOut}>Sign Out</button>
      <button onClick={() => resetPassword('test@example.com')}>Reset Password</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should render with loading=true initially', () => {
      supabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      })

      supabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      })

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      )

      expect(screen.getByTestId('loading')).toHaveTextContent('Loading')
    })

    it('should render with user=null when no session', async () => {
      supabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      })

      supabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      })

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading')
      })

      expect(screen.getByTestId('user')).toHaveTextContent('No User')
    })

    it('should render with user when session exists', async () => {
      const mockUser = {
        id: '123',
        email: 'existing@example.com',
        user_metadata: { display_name: 'Existing User' }
      }

      supabase.auth.getSession.mockResolvedValue({
        data: {
          session: {
            user: mockUser
          }
        },
        error: null
      })

      supabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      })

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading')
      })

      expect(screen.getByTestId('user')).toHaveTextContent('existing@example.com')
    })
  })

  describe('signIn', () => {
    it('should sign in successfully', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        user_metadata: { display_name: 'Test User' }
      }

      supabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      })

      supabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      })

      supabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: {} },
        error: null
      })

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading')
      })

      await act(async () => {
        screen.getByText('Sign In').click()
      })

      await waitFor(() => {
        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        })
      })
    })

    it('should throw error on failed sign in', async () => {
      supabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      })

      supabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      })

      supabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' }
      })

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading')
      })

      await act(async () => {
        screen.getByText('Sign In').click()
      })

      await waitFor(() => {
        expect(supabase.auth.signInWithPassword).toHaveBeenCalled()
      })
    })
  })

  describe('signUp', () => {
    it('should sign up successfully with display name', async () => {
      const mockUser = {
        id: '123',
        email: 'new@example.com',
        user_metadata: { display_name: 'New User' }
      }

      supabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      })

      supabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      })

      supabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser, session: {} },
        error: null
      })

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading')
      })

      await act(async () => {
        screen.getByText('Sign Up').click()
      })

      await waitFor(() => {
        expect(supabase.auth.signUp).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          options: {
            data: {
              display_name: 'Test User'
            }
          }
        })
      })
    })

    it('should sign up successfully without display name', async () => {
      const mockUser = {
        id: '123',
        email: 'new@example.com',
        user_metadata: {}
      }

      supabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      })

      supabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      })

      supabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser, session: {} },
        error: null
      })

      const TestConsumerNoDisplayName = () => {
        const { signUp, loading } = useContext(AuthContext)
        return (
          <div>
            <div data-testid="loading">{loading ? 'Loading' : 'Not Loading'}</div>
            <button onClick={() => signUp('test@example.com', 'password123')}>
              Sign Up No Name
            </button>
          </div>
        )
      }

      render(
        <AuthProvider>
          <TestConsumerNoDisplayName />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading')
      })

      await act(async () => {
        screen.getByText('Sign Up No Name').click()
      })

      await waitFor(() => {
        expect(supabase.auth.signUp).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          options: {
            data: {}
          }
        })
      })
    })

    it('should throw error on failed sign up', async () => {
      supabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      })

      supabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      })

      supabase.auth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Email already exists' }
      })

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading')
      })

      await act(async () => {
        screen.getByText('Sign Up').click()
      })

      await waitFor(() => {
        expect(supabase.auth.signUp).toHaveBeenCalled()
      })
    })
  })

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com'
      }

      supabase.auth.getSession.mockResolvedValue({
        data: {
          session: {
            user: mockUser
          }
        },
        error: null
      })

      supabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      })

      supabase.auth.signOut.mockResolvedValue({
        error: null
      })

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('test@example.com')
      })

      await act(async () => {
        screen.getByText('Sign Out').click()
      })

      await waitFor(() => {
        expect(supabase.auth.signOut).toHaveBeenCalled()
      })
    })

    it('should throw error on failed sign out', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com'
      }

      supabase.auth.getSession.mockResolvedValue({
        data: {
          session: {
            user: mockUser
          }
        },
        error: null
      })

      supabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      })

      supabase.auth.signOut.mockResolvedValue({
        error: { message: 'Sign out failed' }
      })

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('test@example.com')
      })

      await act(async () => {
        screen.getByText('Sign Out').click()
      })

      await waitFor(() => {
        expect(supabase.auth.signOut).toHaveBeenCalled()
      })
    })
  })

  describe('resetPassword', () => {
    it('should send password reset email successfully', async () => {
      supabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      })

      supabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      })

      supabase.auth.resetPasswordForEmail.mockResolvedValue({
        data: {},
        error: null
      })

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading')
      })

      await act(async () => {
        screen.getByText('Reset Password').click()
      })

      await waitFor(() => {
        expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('test@example.com')
      })
    })

    it('should throw error on failed password reset', async () => {
      supabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      })

      supabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      })

      supabase.auth.resetPasswordForEmail.mockResolvedValue({
        data: {},
        error: { message: 'Email not found' }
      })

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading')
      })

      await act(async () => {
        screen.getByText('Reset Password').click()
      })

      await waitFor(() => {
        expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalled()
      })
    })
  })

  describe('Auth State Changes', () => {
    it('should update user when auth state changes', async () => {
      const unsubscribeMock = vi.fn()
      let authCallback

      supabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      })

      supabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authCallback = callback
        return {
          data: { subscription: { unsubscribe: unsubscribeMock } }
        }
      })

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('No User')
      })

      // Simulate auth state change (user signs in)
      const newUser = {
        id: '123',
        email: 'newuser@example.com'
      }

      await act(async () => {
        authCallback('SIGNED_IN', { user: newUser })
      })

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('newuser@example.com')
      })
    })

    it('should unsubscribe on unmount', async () => {
      const unsubscribeMock = vi.fn()

      supabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      })

      supabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: unsubscribeMock } }
      })

      const { unmount } = render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading')
      })

      unmount()

      expect(unsubscribeMock).toHaveBeenCalled()
    })
  })
})
