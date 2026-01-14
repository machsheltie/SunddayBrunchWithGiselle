import { useState } from 'react'
import { subscribeToNewsletter } from '../services/convertkit'
import { trackEmailSignup } from '../lib/analytics'
import './EmailCTAInline.css'

/**
 * EmailCTAInline - Subtle inline email signup form for hero section
 *
 * Provides a non-intrusive conversion touchpoint without dominating the hero.
 * Uses glassmorphism styling to blend with existing design system.
 *
 * @param {Object} props
 * @param {string} props.message - CTA message text (default: "Get weekly recipes in your inbox")
 */
function EmailCTAInline({ message = 'Get weekly recipes in your inbox' }) {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState('idle') // idle | loading | success | error
    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setStatus('error')
            setErrorMessage('Please enter a valid email address')
            trackEmailSignup('hero_inline', 'error', { reason: 'invalid_email' })
            return
        }

        setStatus('loading')
        setErrorMessage('')

        try {
            const response = await subscribeToNewsletter(email)

            if (response.success) {
                setStatus('success')
                setEmail('')
                trackEmailSignup('hero_inline', 'success')
            } else {
                setStatus('error')
                setErrorMessage(response.message || 'Something went wrong. Please try again.')
                trackEmailSignup('hero_inline', 'error', { error: response.message })
            }
        } catch (error) {
            setStatus('error')
            setErrorMessage('Unable to subscribe. Please try again later.')
            trackEmailSignup('hero_inline', 'error', { error: error.message })
        }
    }

    // Show success message after signup
    if (status === 'success') {
        return (
            <div className="email-cta-inline">
                <div className="email-cta-inline__success">
                    <span className="success-icon">✓</span>
                    <span className="success-text">Thanks! Check your inbox</span>
                </div>
            </div>
        )
    }

    return (
        <div className="email-cta-inline">
            <form onSubmit={handleSubmit} className="email-cta-inline__form">
                <label htmlFor="hero-email" className="email-cta-inline__label">
                    {message} ✉️
                </label>
                <div className="email-cta-inline__input-group">
                    <input
                        type="email"
                        id="hero-email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="email-cta-inline__input"
                        required
                        disabled={status === 'loading'}
                        aria-label="Email address"
                        aria-required="true"
                        aria-invalid={status === 'error'}
                        aria-describedby={status === 'error' ? 'hero-email-error' : undefined}
                    />
                    <button
                        type="submit"
                        className="email-cta-inline__button"
                        disabled={status === 'loading' || !email}
                    >
                        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                    </button>
                </div>
                {status === 'error' && (
                    <div
                        id="hero-email-error"
                        className="email-cta-inline__error"
                        role="alert"
                        aria-live="polite"
                    >
                        {errorMessage}
                    </div>
                )}
            </form>
        </div>
    )
}

export default EmailCTAInline
