import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CTAForm from '../../components/CTAForm'
import { subscribeToNewsletter } from '../../services/convertkit'
import { sendSponsorInquiry } from '../../services/sponsor'
import { trackEvent } from '../../lib/analytics'

// Mock the services
vi.mock('../../services/convertkit')
vi.mock('../../services/sponsor')
vi.mock('../../lib/analytics')

describe('CTAForm Component', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks()
        // Provide default mock implementations
        subscribeToNewsletter.mockResolvedValue({ success: true })
        sendSponsorInquiry.mockResolvedValue({ success: true })
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('Subscribe Mode (default)', () => {
        it('should render subscribe form with default props', () => {
            // Act
            render(<CTAForm />)

            // Assert
            expect(screen.getByText('Stay in the loop')).toBeInTheDocument()
            expect(screen.getByText('Recipes, Sunday letters, early drops.')).toBeInTheDocument()
            expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /get updates/i })).toBeInTheDocument()
        })

        it('should render with custom headline and subcopy', () => {
            // Act
            render(
                <CTAForm
                    headline="Join our newsletter"
                    subcopy="Get weekly recipes"
                />
            )

            // Assert
            expect(screen.getByText('Join our newsletter')).toBeInTheDocument()
            expect(screen.getByText('Get weekly recipes')).toBeInTheDocument()
        })

        it('should validate email before submission', async () => {
            // Arrange
            render(<CTAForm />)
            const emailInput = screen.getByPlaceholderText('you@example.com')
            const form = emailInput.closest('form')

            // Act - Submit without email (bypass HTML5 validation)
            await userEvent.clear(emailInput)
            fireEvent.submit(form)

            // Assert
            await waitFor(() => {
                expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
            })
            expect(subscribeToNewsletter).not.toHaveBeenCalled()
        })

        it('should validate email format', async () => {
            // Arrange
            render(<CTAForm />)
            const emailInput = screen.getByPlaceholderText('you@example.com')
            const form = emailInput.closest('form')

            // Act - Enter invalid email (no @ symbol)
            await userEvent.type(emailInput, 'notanemail')
            fireEvent.submit(form)

            // Assert
            await waitFor(() => {
                expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
            })
            expect(subscribeToNewsletter).not.toHaveBeenCalled()
        })

        it('should successfully subscribe with valid email', async () => {
            // Arrange
            subscribeToNewsletter.mockResolvedValue({ success: true })
            render(<CTAForm />)
            const emailInput = screen.getByPlaceholderText('you@example.com')
            const submitButton = screen.getByRole('button', { name: /get updates/i })

            // Act
            await userEvent.type(emailInput, 'test@example.com')
            fireEvent.click(submitButton)

            // Assert
            await waitFor(() => {
                expect(subscribeToNewsletter).toHaveBeenCalledWith('test@example.com')
                expect(screen.getByText(/you are in! check your email for confirmation/i)).toBeInTheDocument()
                expect(trackEvent).toHaveBeenCalledWith('cta_subscribe', { status: 'success' })
            })
        })

        it('should clear email input after successful subscription', async () => {
            // Arrange
            subscribeToNewsletter.mockResolvedValue({ success: true })
            render(<CTAForm />)
            const emailInput = screen.getByPlaceholderText('you@example.com')
            const submitButton = screen.getByRole('button', { name: /get updates/i })

            // Act
            await userEvent.type(emailInput, 'test@example.com')
            fireEvent.click(submitButton)

            // Assert
            await waitFor(() => {
                expect(emailInput.value).toBe('')
            })
        })

        it('should display error message on subscription failure', async () => {
            // Arrange
            const errorMessage = 'Subscription failed'
            subscribeToNewsletter.mockResolvedValue({ success: false, error: errorMessage })
            render(<CTAForm />)
            const emailInput = screen.getByPlaceholderText('you@example.com')
            const submitButton = screen.getByRole('button', { name: /get updates/i })

            // Act
            await userEvent.type(emailInput, 'test@example.com')
            fireEvent.click(submitButton)

            // Assert
            await waitFor(() => {
                expect(screen.getByText(errorMessage)).toBeInTheDocument()
                expect(trackEvent).toHaveBeenCalledWith('cta_subscribe', {
                    status: 'error',
                    detail: errorMessage
                })
            })
        })

        it('should handle network errors gracefully', async () => {
            // Arrange
            subscribeToNewsletter.mockRejectedValue(new Error('Network error'))
            render(<CTAForm />)
            const emailInput = screen.getByPlaceholderText('you@example.com')
            const submitButton = screen.getByRole('button', { name: /get updates/i })

            // Act
            await userEvent.type(emailInput, 'test@example.com')
            fireEvent.click(submitButton)

            // Assert
            await waitFor(() => {
                expect(screen.getByText(/please try again later/i)).toBeInTheDocument()
            })
        })

        it('should show loading state during submission', async () => {
            // Arrange - Use longer delay to ensure loading state is visible
            subscribeToNewsletter.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ success: true }), 2000)))
            render(<CTAForm />)
            const emailInput = screen.getByPlaceholderText('you@example.com')

            // Act
            await userEvent.type(emailInput, 'test@example.com')
            fireEvent.click(screen.getByRole('button', { name: /get updates/i }))

            // Assert - Check loading text and disabled input
            await waitFor(() => {
                expect(screen.getByText('Signing up...')).toBeInTheDocument()
                expect(emailInput).toBeDisabled()
            })
            // Note: WhimsicalButton doesn't support disabled prop, so we can't test button disabled state
        })

        it('should have proper accessibility attributes', () => {
            // Act
            render(<CTAForm />)
            const emailInput = screen.getByPlaceholderText('you@example.com')

            // Assert
            expect(emailInput).toHaveAttribute('aria-invalid', 'false')
            expect(emailInput).toHaveAttribute('type', 'email')
            expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
        })
    })

    describe('Contact Mode', () => {
        it('should render contact form when mode is contact', () => {
            // Act
            render(<CTAForm mode="contact" headline="Get in touch" />)

            // Assert
            expect(screen.getByText('Get in touch')).toBeInTheDocument()
            expect(screen.getByPlaceholderText('Name')).toBeInTheDocument()
            expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
            expect(screen.getByPlaceholderText('Tell us what you need')).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
        })

        it('should validate all required fields', async () => {
            // Arrange
            render(<CTAForm mode="contact" />)
            const nameInput = screen.getByPlaceholderText('Name')
            const form = nameInput.closest('form')

            // Act - Submit without filling fields (bypass HTML5 validation)
            fireEvent.submit(form)

            // Assert
            await waitFor(() => {
                expect(screen.getByText(/please add your name, email, and a short message/i)).toBeInTheDocument()
            })
            expect(sendSponsorInquiry).not.toHaveBeenCalled()
        })

        it('should validate message length (minimum 5 characters)', async () => {
            // Arrange
            render(<CTAForm mode="contact" />)
            const nameInput = screen.getByPlaceholderText('Name')
            const emailInput = screen.getByPlaceholderText('Email')
            const messageInput = screen.getByPlaceholderText('Tell us what you need')
            const submitButton = screen.getByRole('button', { name: /send/i })

            // Act - Enter short message
            await userEvent.type(nameInput, 'John Doe')
            await userEvent.type(emailInput, 'john@example.com')
            await userEvent.type(messageInput, 'Hi')
            fireEvent.click(submitButton)

            // Assert
            await waitFor(() => {
                expect(screen.getByText(/please add your name, email, and a short message/i)).toBeInTheDocument()
            })
        })

        it('should successfully send contact form', async () => {
            // Arrange
            sendSponsorInquiry.mockResolvedValue({ success: true })
            render(<CTAForm mode="contact" />)
            const nameInput = screen.getByPlaceholderText('Name')
            const emailInput = screen.getByPlaceholderText('Email')
            const messageInput = screen.getByPlaceholderText('Tell us what you need')
            const submitButton = screen.getByRole('button', { name: /send/i })

            // Act
            await userEvent.type(nameInput, 'John Doe')
            await userEvent.type(emailInput, 'john@example.com')
            await userEvent.type(messageInput, 'I would like to sponsor')
            fireEvent.click(submitButton)

            // Assert
            await waitFor(() => {
                expect(sendSponsorInquiry).toHaveBeenCalledWith({
                    name: 'John Doe',
                    email: 'john@example.com',
                    note: 'I would like to sponsor'
                })
                expect(screen.getByText(/thanks! we will reply quickly/i)).toBeInTheDocument()
                expect(trackEvent).toHaveBeenCalledWith('sponsor_contact', { status: 'success' })
            })
        })

        it('should clear form fields after successful submission', async () => {
            // Arrange
            sendSponsorInquiry.mockResolvedValue({ success: true })
            render(<CTAForm mode="contact" />)
            const nameInput = screen.getByPlaceholderText('Name')
            const emailInput = screen.getByPlaceholderText('Email')
            const messageInput = screen.getByPlaceholderText('Tell us what you need')
            const submitButton = screen.getByRole('button', { name: /send/i })

            // Act
            await userEvent.type(nameInput, 'John Doe')
            await userEvent.type(emailInput, 'john@example.com')
            await userEvent.type(messageInput, 'Hello there')
            fireEvent.click(submitButton)

            // Assert
            await waitFor(() => {
                expect(nameInput.value).toBe('')
                expect(emailInput.value).toBe('')
                expect(messageInput.value).toBe('')
            })
        })

        it('should display error message on submission failure', async () => {
            // Arrange
            const errorMessage = 'Failed to send'
            sendSponsorInquiry.mockResolvedValue({ success: false, error: errorMessage })
            render(<CTAForm mode="contact" />)
            const nameInput = screen.getByPlaceholderText('Name')
            const emailInput = screen.getByPlaceholderText('Email')
            const messageInput = screen.getByPlaceholderText('Tell us what you need')
            const submitButton = screen.getByRole('button', { name: /send/i })

            // Act
            await userEvent.type(nameInput, 'John Doe')
            await userEvent.type(emailInput, 'john@example.com')
            await userEvent.type(messageInput, 'Test message')
            fireEvent.click(submitButton)

            // Assert
            await waitFor(() => {
                expect(screen.getByText(errorMessage)).toBeInTheDocument()
                expect(trackEvent).toHaveBeenCalledWith('sponsor_contact', {
                    status: 'error',
                    detail: errorMessage
                })
            })
        })

        it('should show loading state during contact submission', async () => {
            // Arrange - Use longer delay to ensure loading state is visible
            sendSponsorInquiry.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ success: true }), 2000)))
            render(<CTAForm mode="contact" />)
            const nameInput = screen.getByPlaceholderText('Name')
            const emailInput = screen.getByPlaceholderText('Email')
            const messageInput = screen.getByPlaceholderText('Tell us what you need')

            // Act
            await userEvent.type(nameInput, 'John Doe')
            await userEvent.type(emailInput, 'john@example.com')
            await userEvent.type(messageInput, 'Hello there')
            fireEvent.click(screen.getByRole('button', { name: /send/i }))

            // Assert - Check loading text and disabled inputs
            await waitFor(() => {
                expect(screen.getByText('Sending...')).toBeInTheDocument()
                expect(nameInput).toBeDisabled()
                expect(emailInput).toBeDisabled()
                expect(messageInput).toBeDisabled()
            })
            // Note: WhimsicalButton doesn't support disabled prop, so we can't test button disabled state
        })

        it('should display brand safety message', () => {
            // Act
            render(<CTAForm mode="contact" />)

            // Assert
            expect(screen.getByText(/we respond to brand-safe fits only/i)).toBeInTheDocument()
        })
    })

    describe('Accessibility', () => {
        it('should have screen reader labels for subscribe form', () => {
            // Act
            render(<CTAForm />)

            // Assert
            expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
        })

        it('should have screen reader labels for contact form', () => {
            // Act
            render(<CTAForm mode="contact" />)

            // Assert
            expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
        })

        it('should have aria-live region for messages', async () => {
            // Arrange
            subscribeToNewsletter.mockResolvedValue({ success: false, error: 'Error message' })
            render(<CTAForm />)
            const emailInput = screen.getByPlaceholderText('you@example.com')
            const submitButton = screen.getByRole('button', { name: /get updates/i })

            // Act
            await userEvent.type(emailInput, 'test@example.com')
            fireEvent.click(submitButton)

            // Assert - Wait for error message to appear
            await waitFor(() => {
                const message = screen.getByText('Error message')
                expect(message).toBeInTheDocument()
                expect(message).toHaveAttribute('aria-live', 'polite')
            })
        })

        it('should support custom form ID', () => {
            // Act
            const { container } = render(<CTAForm id="newsletter-form" />)

            // Assert
            const form = container.querySelector('#newsletter-form')
            expect(form).toBeInTheDocument()
        })
    })
})
