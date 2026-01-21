/**
 * LoginForm Component
 *
 * User authentication login form with email and password.
 * Features whimsical design matching Sunday Brunch aesthetic.
 *
 * Props:
 * - onSuccess: Callback fired after successful login
 * - onSwitchToSignUp: Callback to switch to sign up form
 * - onSwitchToForgotPassword: Callback to switch to forgot password form
 */

import { useState } from 'react'
import PropTypes from 'prop-types'
import { useAuth } from '../../hooks/useAuth'
import './LoginForm.css'

export default function LoginForm({ onSuccess, onSwitchToSignUp, onSwitchToForgotPassword }) {
  const { signIn, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      const { error: signInError } = await signIn(email, password)

      if (signInError) {
        if (signInError.message && signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password')
        } else {
          setError(signInError.message || 'Failed to sign in. Please try again.')
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
    <div className="login-form" data-testid="login-form">
      <div className="login-form__header">
        <h2 className="login-form__title">Welcome Back!</h2>
        <p className="login-form__subtitle">Sign in to access your account</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form__form">
        {error && (
          <div className="login-form__error" role="alert" data-testid="login-error">
            {error}
          </div>
        )}

        <div className="login-form__field">
          <label htmlFor="login-email" className="login-form__label">
            Email Address
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-form__input"
            placeholder="your@email.com"
            disabled={isLoading}
            autoComplete="email"
            required
            data-testid="login-email"
          />
        </div>

        <div className="login-form__field">
          <label htmlFor="login-password" className="login-form__label">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-form__input"
            placeholder="••••••••"
            disabled={isLoading}
            autoComplete="current-password"
            required
            data-testid="login-password"
          />
        </div>

        <button
          type="button"
          onClick={onSwitchToForgotPassword}
          className="login-form__forgot-link"
          disabled={isLoading}
          data-testid="forgot-password-link"
        >
          Forgot password?
        </button>

        <button
          type="submit"
          className="login-form__submit"
          disabled={isLoading}
          data-testid="login-submit"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="login-form__footer">
          <p className="login-form__footer-text">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="login-form__switch-link"
              disabled={isLoading}
              data-testid="switch-to-signup"
            >
              Sign up
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  onSuccess: PropTypes.func,
  onSwitchToSignUp: PropTypes.func.isRequired,
  onSwitchToForgotPassword: PropTypes.func.isRequired
}
