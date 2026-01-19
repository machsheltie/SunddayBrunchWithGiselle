/**
 * ForgotPasswordForm Component
 *
 * Password reset request form with email input.
 * Features whimsical design matching Sunday Brunch aesthetic.
 *
 * Props:
 * - onSuccess: Callback fired after password reset email sent
 * - onSwitchToLogin: Callback to switch back to login form
 */

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import './ForgotPasswordForm.css'

export default function ForgotPasswordForm({ onSuccess, onSwitchToLogin }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    // Basic validation
    if (!email) {
      setError('Please enter your email address')
      setLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (resetError) {
        setError(resetError.message || 'Failed to send reset email. Please try again.')
        setLoading(false)
        return
      }

      // Success
      setSuccess(true)
      setLoading(false)

      if (onSuccess) {
        setTimeout(() => onSuccess(), 3000)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="forgot-password-form" data-testid="forgot-password-form">
        <div className="forgot-password-form__success" data-testid="forgot-password-success">
          <div className="forgot-password-form__success-icon">✉️</div>
          <h2 className="forgot-password-form__success-title">Check Your Email!</h2>
          <p className="forgot-password-form__success-text">
            We've sent password reset instructions to <strong>{email}</strong>.
            Please check your inbox and follow the link to reset your password.
          </p>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="forgot-password-form__back-button"
            data-testid="back-to-login"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="forgot-password-form" data-testid="forgot-password-form">
      <div className="forgot-password-form__header">
        <h2 className="forgot-password-form__title">Forgot Password?</h2>
        <p className="forgot-password-form__subtitle">
          No worries! Enter your email and we'll send you reset instructions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="forgot-password-form__form">
        {error && (
          <div className="forgot-password-form__error" role="alert" data-testid="forgot-password-error">
            {error}
          </div>
        )}

        <div className="forgot-password-form__field">
          <label htmlFor="forgot-email" className="forgot-password-form__label">
            Email Address
          </label>
          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="forgot-password-form__input"
            placeholder="your@email.com"
            disabled={loading}
            autoComplete="email"
            required
            autoFocus
            data-testid="forgot-password-email"
          />
        </div>

        <button
          type="submit"
          className="forgot-password-form__submit"
          disabled={loading}
          data-testid="forgot-password-submit"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <div className="forgot-password-form__footer">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="forgot-password-form__back-link"
            disabled={loading}
            data-testid="back-to-login"
          >
            ← Back to Sign In
          </button>
        </div>
      </form>
    </div>
  )
}
