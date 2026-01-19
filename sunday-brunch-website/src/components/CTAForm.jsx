import { useState } from 'react'
import { subscribeToNewsletter } from '../services/convertkit'
import { sendSponsorInquiry } from '../services/sponsor'
import { trackEvent } from '../lib/analytics'
import WhimsicalButton from './WhimsicalButton'
import './CTAForm.css'

function CTAForm({ id, headline = 'Stay in the loop', subcopy = 'Recipes, Sunday letters, early drops.', mode = 'subscribe' }) {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState({ type: '', text: '' })
    const [loading, setLoading] = useState(false)
    const [contact, setContact] = useState({ name: '', contactEmail: '', note: '' })

    const onSubscribe = async (e) => {
        e.preventDefault()
        if (!email || !email.includes('@')) {
            setMessage({ type: 'error', text: 'Please enter a valid email address.' })
            return
        }
        setLoading(true)
        setMessage({ type: '', text: '' })
        try {
            const result = await subscribeToNewsletter(email)
            if (result.success) {
                setMessage({ type: 'success', text: 'Thank you! You are subscribed. Check your email for confirmation.' })
                setEmail('')
                trackEvent('cta_subscribe', { status: 'success' })
            } else {
                setMessage({ type: 'error', text: result.error || 'Something went wrong. Please try again.' })
                trackEvent('cta_subscribe', { status: 'error', detail: result.error })
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Please try again later.' })
            trackEvent('cta_subscribe', { status: 'error', detail: err?.message })
        } finally {
            setLoading(false)
        }
    }

    const onContact = async (e) => {
        e.preventDefault()
        if (!contact.name.trim() || !contact.contactEmail.includes('@') || contact.note.trim().length < 5) {
            setMessage({ type: 'error', text: 'Please add your name, email, and a short message.' })
            return
        }
        setLoading(true)
        setMessage({ type: '', text: '' })
        const result = await sendSponsorInquiry({
            name: contact.name,
            email: contact.contactEmail,
            note: contact.note
        })
        if (result.success) {
            setMessage({ type: 'success', text: 'Thanks! We will reply quickly.' })
            setContact({ name: '', contactEmail: '', note: '' })
            trackEvent('sponsor_contact', { status: 'success' })
        } else {
            setMessage({ type: 'error', text: result.error || 'We could not send that. Try again in a moment.' })
            trackEvent('sponsor_contact', { status: 'error', detail: result.error })
        }
        setLoading(false)
    }

    const formId = id || undefined

    if (mode === 'contact') {
        return (
            <div className="cta" id={formId}>
                <h3>{headline}</h3>
                {subcopy && <p className="cta__subcopy">{subcopy}</p>}
                <form className="cta__form" onSubmit={onContact}>
                    <label className="sr-only" htmlFor="contact-name">Name</label>
                    <input
                        id="contact-name"
                        type="text"
                        placeholder="Name"
                        value={contact.name}
                        onChange={(e) => setContact({ ...contact, name: e.target.value })}
                        required
                        disabled={loading}
                    />
                    <label className="sr-only" htmlFor="contact-email">Email</label>
                    <input
                        id="contact-email"
                        type="email"
                        placeholder="Email"
                        value={contact.contactEmail}
                        onChange={(e) => setContact({ ...contact, contactEmail: e.target.value })}
                        required
                        disabled={loading}
                    />
                    <label className="sr-only" htmlFor="contact-message">Message</label>
                    <textarea
                        id="contact-message"
                        rows="3"
                        placeholder="Tell us what you need"
                        value={contact.note}
                        onChange={(e) => setContact({ ...contact, note: e.target.value })}
                        required
                        disabled={loading}
                    />
                    <WhimsicalButton type="primary" disabled={loading}>
                        {loading ? 'Sending...' : 'Send'}
                    </WhimsicalButton>
                </form>
                {message.text && (
                    <div className={`cta__message cta__message--${message.type}`} aria-live="polite">
                        {message.text}
                    </div>
                )}
                <p className="small-muted">We respond to brand-safe fits only.</p>
            </div>
        )
    }

    return (
        <div className="cta newsletter" id={formId} data-testid="newsletter" aria-label="Newsletter signup">
            <h3>{headline}</h3>
            {subcopy && <p className="cta__subcopy">{subcopy}</p>}
            <form className="cta__form" onSubmit={onSubscribe}>
                <label className="sr-only" htmlFor="cta-email">Email address for newsletter</label>
                <input
                    id="cta-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    aria-invalid={message.type === 'error' ? 'true' : 'false'}
                    aria-describedby={message.text ? 'cta-message' : undefined}
                    aria-label="Email for newsletter"
                />
                <WhimsicalButton type="primary" disabled={loading} aria-label="Subscribe to newsletter">
                    {loading ? 'Signing up...' : 'Get updates'}
                </WhimsicalButton>
            </form>
            {message.text && (
                <div id="cta-message" className={`cta__message cta__message--${message.type}`} aria-live="polite" role="alert" data-testid={message.type === 'error' ? 'error' : 'message'}>
                    {message.text}
                </div>
            )}
        </div>
    )
}

export default CTAForm
