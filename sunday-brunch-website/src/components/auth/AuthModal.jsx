/**
 * AuthModal Component
 *
 * Modal wrapper for authentication forms (login, sign up, forgot password).
 * Features whimsical design with smooth transitions between forms.
 *
 * Props:
 * - isOpen: Boolean to control modal visibility
 * - onClose: Callback fired when modal should close
 * - initialView: 'login' | 'signup' | 'forgot-password' (default: 'login')
 */

import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'
import ForgotPasswordForm from './ForgotPasswordForm'
import './AuthModal.css'

export default function AuthModal({ isOpen, onClose, initialView = 'login' }) {
  const [currentView, setCurrentView] = useState(initialView)

  // Reset to initial view when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentView(initialView)
    }
  }, [isOpen, initialView])

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const handleSuccess = () => {
    // Close modal after successful authentication
    setTimeout(() => {
      onClose()
    }, 500)
  }

  const handleBackdropClick = (e) => {
    // Close modal when clicking outside the content
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="auth-modal" onClick={handleBackdropClick} role="dialog" aria-modal="true" data-testid="auth-modal">
      <div className="auth-modal__backdrop" />
      <div className="auth-modal__content" data-testid="auth-modal-content">
        <button
          className="auth-modal__close"
          onClick={onClose}
          aria-label="Close authentication modal"
          data-testid="auth-modal-close"
        >
          ×
        </button>

        <div className="auth-modal__forms">
          {currentView === 'login' && (
            <LoginForm
              onSuccess={handleSuccess}
              onSwitchToSignUp={() => setCurrentView('signup')}
              onSwitchToForgotPassword={() => setCurrentView('forgot-password')}
            />
          )}

          {currentView === 'signup' && (
            <SignUpForm
              onSuccess={handleSuccess}
              onSwitchToLogin={() => setCurrentView('login')}
            />
          )}

          {currentView === 'forgot-password' && (
            <ForgotPasswordForm
              onSuccess={handleSuccess}
              onSwitchToLogin={() => setCurrentView('login')}
            />
          )}
        </div>
      </div>
    </div>
  )
}

AuthModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialView: PropTypes.oneOf(['login', 'signup', 'forgot-password'])
}
