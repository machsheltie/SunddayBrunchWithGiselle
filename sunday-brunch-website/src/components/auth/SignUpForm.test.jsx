import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import SignUpForm from './SignUpForm'
import { useAuth } from '../../hooks/useAuth'

// Mock useAuth hook
vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn()
}))

describe('SignUpForm', () => {
  const mockSignUp = vi.fn()
  const mockOnSuccess = vi.fn()
  const mockOnSwitchToLogin = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    useAuth.mockReturnValue({
      signUp: mockSignUp,
      loading: false
    })
  })

  describe('Rendering', () => {
    it('should render sign up form with all elements', () => {
      render(
        <SignUpForm
          onSuccess={mockOnSuccess}
          onSwitchToLogin={mockOnSwitchToLogin}
        />
      )

      expect(screen.getByText('Join the Brunch!')).toBeInTheDocument()
      expect(screen.getByLabelText(/display name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^password\s*\*/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
    })

    it('should render login link', () => {
      render(
        <SignUpForm
          onSuccess={mockOnSuccess}
          onSwitchToLogin={mockOnSwitchToLogin}
        />
      )

      expect(screen.getByText(/already have an account/i)).toBeInTheDocument()
      expect(screen.getByText(/^sign in$/i)).toBeInTheDocument()
    })
  })

  describe('Form Validation - Required Fields', () => {
    it('should show error when submitting empty form', async () => {
      const user = userEvent.setup()

      render(
        <SignUpForm
          onSuccess={mockOnSuccess}
          onSwitchToLogin={mockOnSwitchToLogin}
        />
      )

      await user.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(screen.getByText('Please fill in all required fields')).toBeInTheDocument()
      })

      expect(mockSignUp).not.toHaveBeenCalled()
    })

    it('should show error for invalid email format', async () => {
      const user = userEvent.setup()

      render(
        <SignUpForm
          onSuccess={mockOnSuccess}
          onSwitchToLogin={mockOnSwitchToLogin}
        />
      )

      await user.type(screen.getByLabelText(/email address/i), 'notanemail')
      await user.type(screen.getByLabelText(/^password/i), 'Password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'Password123')
      await user.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
      })

      expect(mockSignUp).not.toHaveBeenCalled()
    })
  })

  describe('Password Validation', () => {
    it('should show error for password shorter than 8 characters', async () => {
      const user = userEvent.setup()

      render(
        <SignUpForm
          onSuccess={mockOnSuccess}
          onSwitchToLogin={mockOnSwitchToLogin}
        />
      )

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'Pass1')
      await user.type(screen.getByLabelText(/confirm password/i), 'Pass1')
      await user.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument()
      })

      expect(mockSignUp).not.toHaveBeenCalled()
    })

    it('should show error for password without uppercase letter', async () => {
      const user = userEvent.setup()

      render(
        <SignUpForm
          onSuccess={mockOnSuccess}
          onSwitchToLogin={mockOnSwitchToLogin}
        />
      )

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(screen.getByText('Password must contain at least one uppercase letter')).toBeInTheDocument()
      })

      expect(mockSignUp).not.toHaveBeenCalled()
    })

    it('should show error for password without lowercase letter', async () => {
      const user = userEvent.setup()

      render(
        <SignUpForm
          onSuccess={mockOnSuccess}
          onSwitchToLogin={mockOnSwitchToLogin}
        />
      )

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'PASSWORD123')
      await user.type(screen.getByLabelText(/confirm password/i), 'PASSWORD123')
      await user.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(screen.getByText('Password must contain at least one lowercase letter')).toBeInTheDocument()
      })

      expect(mockSignUp).not.toHaveBeenCalled()
    })

    it('should show error for password without number', async () => {
      const user = userEvent.setup()

      render(
        <SignUpForm
          onSuccess={mockOnSuccess}
          onSwitchToLogin={mockOnSwitchToLogin}
        />
      )

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'Password')
      await user.type(screen.getByLabelText(/confirm password/i), 'Password')
      await user.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(screen.getByText('Password must contain at least one number')).toBeInTheDocument()
      })

      expect(mockSignUp).not.toHaveBeenCalled()
    })

    it('should show error when passwords do not match', async () => {
      const user = userEvent.setup()

      render(
        <SignUpForm
          onSuccess={mockOnSuccess}
          onSwitchToLogin={mockOnSwitchToLogin}
        />
      )

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'Password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'Password456')
      await user.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
      })

      expect(mockSignUp).not.toHaveBeenCalled()
    })
  })

  describe('Successful Sign Up', () => {
    it('should call signUp with correct data including display name', async () => {
      const user = userEvent.setup()

      mockSignUp.mockResolvedValue({ error: null })

      render(
        <SignUpForm
          onSuccess={mockOnSuccess}
          onSwitchToLogin={mockOnSwitchToLogin}
        />
      )

      await user.type(screen.getByLabelText(/display name/i), 'Test User')
      await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'Password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'Password123')
      await user.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith(
          'test@example.com',
          'Password123',
          { display_name: 'Test User' }
        )
      })
    })

    it('should call signUp without display name when empty', async () => {
      const user = userEvent.setup()

      mockSignUp.mockResolvedValue({ error: null })

      render(
        <SignUpForm
          onSuccess={mockOnSuccess}
          onSwitchToLogin={mockOnSwitchToLogin}
        />
      )

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'Password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'Password123')
      await user.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith(
          'test@example.com',
          'Password123',
          {}
        )
      })
    })

    it('should call onSuccess callback after successful sign up', async () => {
      const user = userEvent.setup()

      mockSignUp.mockResolvedValue({ error: null })

      render(
        <SignUpForm
          onSuccess={mockOnSuccess}
          onSwitchToLogin={mockOnSwitchToLogin}
        />
      )

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'Password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'Password123')
      await user.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled()
      })
    })

    it('should work without onSuccess callback', async () => {
      const user = userEvent.setup()

      mockSignUp.mockResolvedValue({ error: null })

      render(
        <SignUpForm
          onSwitchToLogin={mockOnSwitchToLogin}
        />
      )

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'Password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'Password123')
      await user.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalled()
      })

      // Should not throw error when onSuccess is undefined
    })
  })

  describe('Failed Sign Up', () => {
    it('should show error for email already registered', async () => {
      const user = userEvent.setup()

      mockSignUp.mockResolvedValue({
        error: { message: 'User already registered' }
      })

      render(
        <SignUpForm
          onSuccess={mockOnSuccess}
          onSwitchToLogin={mockOnSwitchToLogin}
        />
      )

      await user.type(screen.getByLabelText(/email address/i), 'existing@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'Password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'Password123')
      await user.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(screen.getByText('This email is already registered. Please sign in instead.')).toBeInTheDocument()
      })

      expect(mockOnSuccess).not.toHaveBeenCalled()
    })

    it('should show generic error message for other errors', async () => {
      const user = userEvent.setup()

      mockSignUp.mockResolvedValue({
        error: { message: 'Network error' }
      })

      render(
        <SignUpForm
          onSuccess={mockOnSuccess}
          onSwitchToLogin={mockOnSwitchToLogin}
        />
      )

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'Password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'Password123')
      await user.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument()
      })

      expect(mockOnSuccess).not.toHaveBeenCalled()
    })

    it('should show fallback error for errors without message', async () => {
      const user = userEvent.setup()

      mockSignUp.mockResolvedValue({
        error: {}
      })

      render(
        <SignUpForm
          onSuccess={mockOnSuccess}
          onSwitchToLogin={mockOnSwitchToLogin}
        />
      )

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'Password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'Password123')
      await user.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(screen.getByText('Failed to create account. Please try again.')).toBeInTheDocument()
      })
    })

    it('should handle unexpected errors', async () => {
      const user = userEvent.setup()

      mockSignUp.mockRejectedValue(new Error('Unexpected error'))

      render(
        <SignUpForm
          onSuccess={mockOnSuccess}
          onSwitchToLogin={mockOnSwitchToLogin}
        />
      )

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'Password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'Password123')
      await user.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument()
      })
    })
  })

  describe('Loading State', () => {
    it('should disable button during submission', async () => {
      const user = userEvent.setup()

      mockSignUp.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ error: null }), 100)))

      render(
        <SignUpForm
          onSuccess={mockOnSuccess}
          onSwitchToLogin={mockOnSwitchToLogin}
        />
      )

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'Password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'Password123')

      const button = screen.getByRole('button', { name: /create account/i })
      await user.click(button)

      expect(button).toBeDisabled()

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled()
      })
    })

    it('should disable button when authLoading is true', () => {
      useAuth.mockReturnValue({
        signUp: mockSignUp,
        loading: true
      })

      render(
        <SignUpForm
          onSuccess={mockOnSuccess}
          onSwitchToLogin={mockOnSwitchToLogin}
        />
      )

      expect(screen.getByRole('button', { name: /creat.*account/i })).toBeDisabled()
    })
  })

  describe('Navigation', () => {
    it('should call onSwitchToLogin when sign in link is clicked', async () => {
      const user = userEvent.setup()

      render(
        <SignUpForm
          onSuccess={mockOnSuccess}
          onSwitchToLogin={mockOnSwitchToLogin}
        />
      )

      await user.click(screen.getByText(/^sign in$/i))

      expect(mockOnSwitchToLogin).toHaveBeenCalled()
    })

    it('should disable navigation link during loading', () => {
      useAuth.mockReturnValue({
        signUp: mockSignUp,
        loading: true
      })

      render(
        <SignUpForm
          onSuccess={mockOnSuccess}
          onSwitchToLogin={mockOnSwitchToLogin}
        />
      )

      expect(screen.getByText(/^sign in$/i).closest('button')).toBeDisabled()
    })
  })

  describe('Error Clearing', () => {
    it('should clear error when resubmitting form', async () => {
      const user = userEvent.setup()

      mockSignUp.mockResolvedValueOnce({
        error: { message: 'User already registered' }
      })

      render(
        <SignUpForm
          onSuccess={mockOnSuccess}
          onSwitchToLogin={mockOnSwitchToLogin}
        />
      )

      await user.type(screen.getByLabelText(/email address/i), 'existing@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'Password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'Password123')
      await user.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(screen.getByText('This email is already registered. Please sign in instead.')).toBeInTheDocument()
      })

      // Submit again with different email
      mockSignUp.mockResolvedValueOnce({ error: null })

      await user.clear(screen.getByLabelText(/email address/i))
      await user.type(screen.getByLabelText(/email address/i), 'newemail@example.com')
      await user.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(screen.queryByText('This email is already registered. Please sign in instead.')).not.toBeInTheDocument()
      })
    })
  })
})
