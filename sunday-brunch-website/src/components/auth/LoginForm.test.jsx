import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import LoginForm from './LoginForm'
import { useAuth } from '../../hooks/useAuth'

// Mock useAuth hook
vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn()
}))

describe('LoginForm', () => {
  const mockSignIn = vi.fn()
  const mockOnSuccess = vi.fn()
  const mockOnSwitchToSignUp = vi.fn()
  const mockOnSwitchToForgotPassword = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    useAuth.mockReturnValue({
      signIn: mockSignIn,
      loading: false
    })
  })

  describe('Rendering', () => {
    it('should render login form with all elements', () => {
      render(
        <LoginForm
          onSuccess={mockOnSuccess}
          onSwitchToSignUp={mockOnSwitchToSignUp}
          onSwitchToForgotPassword={mockOnSwitchToForgotPassword}
        />
      )

      expect(screen.getByText('Welcome Back!')).toBeInTheDocument()
      expect(screen.getByText('Sign in to access your account')).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign.*in/i })).toBeInTheDocument()
    })

    it('should render forgot password link', () => {
      render(
        <LoginForm
          onSuccess={mockOnSuccess}
          onSwitchToSignUp={mockOnSwitchToSignUp}
          onSwitchToForgotPassword={mockOnSwitchToForgotPassword}
        />
      )

      expect(screen.getByText(/forgot password/i)).toBeInTheDocument()
    })

    it('should render sign up link', () => {
      render(
        <LoginForm
          onSuccess={mockOnSuccess}
          onSwitchToSignUp={mockOnSwitchToSignUp}
          onSwitchToForgotPassword={mockOnSwitchToForgotPassword}
        />
      )

      expect(screen.getByText(/don't have an account/i)).toBeInTheDocument()
      expect(screen.getByText(/sign up/i)).toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    it('should show error when submitting empty form', async () => {
      const user = userEvent.setup()

      render(
        <LoginForm
          onSuccess={mockOnSuccess}
          onSwitchToSignUp={mockOnSwitchToSignUp}
          onSwitchToForgotPassword={mockOnSwitchToForgotPassword}
        />
      )

      await user.click(screen.getByRole('button', { name: /sign.*in/i }))

      await waitFor(() => {
        expect(screen.getByText('Please fill in all fields')).toBeInTheDocument()
      })

      expect(mockSignIn).not.toHaveBeenCalled()
    })

    it('should show error when email is empty', async () => {
      const user = userEvent.setup()

      render(
        <LoginForm
          onSuccess={mockOnSuccess}
          onSwitchToSignUp={mockOnSwitchToSignUp}
          onSwitchToForgotPassword={mockOnSwitchToForgotPassword}
        />
      )

      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /sign.*in/i }))

      await waitFor(() => {
        expect(screen.getByText('Please fill in all fields')).toBeInTheDocument()
      })

      expect(mockSignIn).not.toHaveBeenCalled()
    })

    it('should show error when password is empty', async () => {
      const user = userEvent.setup()

      render(
        <LoginForm
          onSuccess={mockOnSuccess}
          onSwitchToSignUp={mockOnSwitchToSignUp}
          onSwitchToForgotPassword={mockOnSwitchToForgotPassword}
        />
      )

      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.click(screen.getByRole('button', { name: /sign.*in/i }))

      await waitFor(() => {
        expect(screen.getByText('Please fill in all fields')).toBeInTheDocument()
      })

      expect(mockSignIn).not.toHaveBeenCalled()
    })

    it('should show error for invalid email format', async () => {
      const user = userEvent.setup()

      render(
        <LoginForm
          onSuccess={mockOnSuccess}
          onSwitchToSignUp={mockOnSwitchToSignUp}
          onSwitchToForgotPassword={mockOnSwitchToForgotPassword}
        />
      )

      await user.type(screen.getByLabelText(/email/i), 'notanemail')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /sign.*in/i }))

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
      })

      expect(mockSignIn).not.toHaveBeenCalled()
    })
  })

  describe('Successful Login', () => {
    it('should call signIn with correct credentials', async () => {
      const user = userEvent.setup()

      mockSignIn.mockResolvedValue({ error: null })

      render(
        <LoginForm
          onSuccess={mockOnSuccess}
          onSwitchToSignUp={mockOnSwitchToSignUp}
          onSwitchToForgotPassword={mockOnSwitchToForgotPassword}
        />
      )

      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /sign.*in/i }))

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123')
      })
    })

    it('should call onSuccess callback after successful login', async () => {
      const user = userEvent.setup()

      mockSignIn.mockResolvedValue({ error: null })

      render(
        <LoginForm
          onSuccess={mockOnSuccess}
          onSwitchToSignUp={mockOnSwitchToSignUp}
          onSwitchToForgotPassword={mockOnSwitchToForgotPassword}
        />
      )

      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /sign.*in/i }))

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled()
      })
    })

    it('should work without onSuccess callback', async () => {
      const user = userEvent.setup()

      mockSignIn.mockResolvedValue({ error: null })

      render(
        <LoginForm
          onSwitchToSignUp={mockOnSwitchToSignUp}
          onSwitchToForgotPassword={mockOnSwitchToForgotPassword}
        />
      )

      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /sign.*in/i }))

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalled()
      })

      // Should not throw error when onSuccess is undefined
    })
  })

  describe('Failed Login', () => {
    it('should show error for invalid credentials', async () => {
      const user = userEvent.setup()

      mockSignIn.mockResolvedValue({
        error: { message: 'Invalid login credentials' }
      })

      render(
        <LoginForm
          onSuccess={mockOnSuccess}
          onSwitchToSignUp={mockOnSwitchToSignUp}
          onSwitchToForgotPassword={mockOnSwitchToForgotPassword}
        />
      )

      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
      await user.click(screen.getByRole('button', { name: /sign.*in/i }))

      await waitFor(() => {
        expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
      })

      expect(mockOnSuccess).not.toHaveBeenCalled()
    })

    it('should show generic error message for other errors', async () => {
      const user = userEvent.setup()

      mockSignIn.mockResolvedValue({
        error: { message: 'Network error' }
      })

      render(
        <LoginForm
          onSuccess={mockOnSuccess}
          onSwitchToSignUp={mockOnSwitchToSignUp}
          onSwitchToForgotPassword={mockOnSwitchToForgotPassword}
        />
      )

      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /sign.*in/i }))

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument()
      })

      expect(mockOnSuccess).not.toHaveBeenCalled()
    })

    it('should show fallback error for errors without message', async () => {
      const user = userEvent.setup()

      mockSignIn.mockResolvedValue({
        error: {}
      })

      render(
        <LoginForm
          onSuccess={mockOnSuccess}
          onSwitchToSignUp={mockOnSwitchToSignUp}
          onSwitchToForgotPassword={mockOnSwitchToForgotPassword}
        />
      )

      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /sign.*in/i }))

      await waitFor(() => {
        expect(screen.getByText('Failed to sign in. Please try again.')).toBeInTheDocument()
      })
    })

    it('should handle unexpected errors', async () => {
      const user = userEvent.setup()

      mockSignIn.mockRejectedValue(new Error('Unexpected error'))

      render(
        <LoginForm
          onSuccess={mockOnSuccess}
          onSwitchToSignUp={mockOnSwitchToSignUp}
          onSwitchToForgotPassword={mockOnSwitchToForgotPassword}
        />
      )

      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /sign.*in/i }))

      await waitFor(() => {
        expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument()
      })
    })
  })

  describe('Loading State', () => {
    it('should disable button during submission', async () => {
      const user = userEvent.setup()

      mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ error: null }), 100)))

      render(
        <LoginForm
          onSuccess={mockOnSuccess}
          onSwitchToSignUp={mockOnSwitchToSignUp}
          onSwitchToForgotPassword={mockOnSwitchToForgotPassword}
        />
      )

      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')

      const button = screen.getByRole('button', { name: /sign.*in/i })
      await user.click(button)

      expect(button).toBeDisabled()

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled()
      })
    })

    it('should disable button when authLoading is true', () => {
      useAuth.mockReturnValue({
        signIn: mockSignIn,
        loading: true
      })

      render(
        <LoginForm
          onSuccess={mockOnSuccess}
          onSwitchToSignUp={mockOnSwitchToSignUp}
          onSwitchToForgotPassword={mockOnSwitchToForgotPassword}
        />
      )

      expect(screen.getByRole('button', { name: /sign.*in/i })).toBeDisabled()
    })
  })

  describe('Navigation', () => {
    it('should call onSwitchToSignUp when sign up link is clicked', async () => {
      const user = userEvent.setup()

      render(
        <LoginForm
          onSuccess={mockOnSuccess}
          onSwitchToSignUp={mockOnSwitchToSignUp}
          onSwitchToForgotPassword={mockOnSwitchToForgotPassword}
        />
      )

      await user.click(screen.getByText(/sign up/i))

      expect(mockOnSwitchToSignUp).toHaveBeenCalled()
    })

    it('should call onSwitchToForgotPassword when forgot password link is clicked', async () => {
      const user = userEvent.setup()

      render(
        <LoginForm
          onSuccess={mockOnSuccess}
          onSwitchToSignUp={mockOnSwitchToSignUp}
          onSwitchToForgotPassword={mockOnSwitchToForgotPassword}
        />
      )

      await user.click(screen.getByText(/forgot password/i))

      expect(mockOnSwitchToForgotPassword).toHaveBeenCalled()
    })

    it('should disable navigation links during loading', () => {
      useAuth.mockReturnValue({
        signIn: mockSignIn,
        loading: true
      })

      render(
        <LoginForm
          onSuccess={mockOnSuccess}
          onSwitchToSignUp={mockOnSwitchToSignUp}
          onSwitchToForgotPassword={mockOnSwitchToForgotPassword}
        />
      )

      expect(screen.getByText(/sign up/i).closest('button')).toBeDisabled()
      expect(screen.getByText(/forgot password/i).closest('button')).toBeDisabled()
    })
  })

  describe('Error Clearing', () => {
    it('should clear error when resubmitting form', async () => {
      const user = userEvent.setup()

      mockSignIn.mockResolvedValueOnce({
        error: { message: 'Invalid login credentials' }
      })

      render(
        <LoginForm
          onSuccess={mockOnSuccess}
          onSwitchToSignUp={mockOnSwitchToSignUp}
          onSwitchToForgotPassword={mockOnSwitchToForgotPassword}
        />
      )

      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
      await user.click(screen.getByRole('button', { name: /sign.*in/i }))

      await waitFor(() => {
        expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
      })

      // Submit again with correct password
      mockSignIn.mockResolvedValueOnce({ error: null })

      await user.clear(screen.getByLabelText(/password/i))
      await user.type(screen.getByLabelText(/password/i), 'correctpassword')
      await user.click(screen.getByRole('button', { name: /sign.*in/i }))

      await waitFor(() => {
        expect(screen.queryByText('Invalid email or password')).not.toBeInTheDocument()
      })
    })
  })
})
