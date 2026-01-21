/**
 * SignUpForm Component
 *
 * User registration form with email, password, and display name.
 * Features whimsical design matching Sunday Brunch aesthetic.
 *
 * Props:
 * - onSuccess: Callback fired after successful sign up
 * - onSwitchToLogin: Callback to switch to login form
 */

import { useState } from 'react'
import PropTypes from 'prop-types'
import { useAuth } from '../../hooks/useAuth'
import './SignUpForm.css'

export default function SignUpForm({ onSuccess, onSwitchToLogin }) {
  const { signUp, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters'
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter'
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number'
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Basic validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    // Password validation
    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const metadata = displayName ? { display_name: displayName } : {}
      const { error: signUpError } = await signUp(email, password, metadata)

      if (signUpError) {
        if (signUpError.message && signUpError.message.includes('already registered')) {
          setError('This email is already registered. Please sign in instead.')
        } else {
          setError(signUpError.message || 'Failed to create account. Please try again.')
        }
        setLoading(false)
        return
      }

      // Success
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  const isLoading = loading || authLoading

  return (
    <div className="signup-form" data-testid="signup-form">
      <div className="signup-form__header">
        <h2 className="signup-form__title">Join the Brunch!</h2>
        <p className="signup-form__subtitle">Create your account to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="signup-form__form">
        {error && (
          <div className="signup-form__error" role="alert" data-testid="signup-error">
            {error}
          </div>
        )}

        <div className="signup-form__field">
          <label htmlFor="signup-email" className="signup-form__label">
            Email Address *
          </label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signup-form__input"
            placeholder="your@email.com"
            disabled={isLoading}
            autoComplete="email"
            required
            data-testid="signup-email"
          />
        </div>

        <div className="signup-form__field">
          <label htmlFor="signup-display-name" className="signup-form__label">
            Display Name (optional)
          </label>
          <input
            id="signup-display-name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="signup-form__input"
            placeholder="How should we call you?"
            disabled={isLoading}
            autoComplete="name"
            maxLength={50}
            data-testid="signup-display-name"
          />
        </div>

        <div className="signup-form__field">
          <label htmlFor="signup-password" className="signup-form__label">
            Password *
          </label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signup-form__input"
            placeholder="••••••••"
            disabled={isLoading}
            autoComplete="new-password"
            required
            data-testid="signup-password"
          />
          <p className="signup-form__hint" data-testid="password-requirements">
            At least 8 characters with uppercase, lowercase, and number
          </p>
        </div>

        <div className="signup-form__field">
          <label htmlFor="signup-confirm-password" className="signup-form__label">
            Confirm Password *
          </label>
          <input
            id="signup-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="signup-form__input"
            placeholder="••••••••"
            disabled={isLoading}
            autoComplete="new-password"
            required
            data-testid="signup-confirm-password"
          />
        </div>

        <button
          type="submit"
          className="signup-form__submit"
          disabled={isLoading}
          data-testid="signup-submit"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>

        <div className="signup-form__footer">
          <p className="signup-form__footer-text">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="signup-form__switch-link"
              disabled={isLoading}
              data-testid="switch-to-login"
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}

SignUpForm.propTypes = {
  onSuccess: PropTypes.func,
  onSwitchToLogin: PropTypes.func.isRequired
}
