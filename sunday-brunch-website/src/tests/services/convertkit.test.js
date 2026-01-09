import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import { subscribeToNewsletter } from '../../services/convertkit'

// Mock axios
vi.mock('axios')

describe('ConvertKit Service', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks()
    })

    afterEach(() => {
        // Restore console.error after each test
        vi.restoreAllMocks()
    })

    describe('subscribeToNewsletter - Success Cases', () => {
        it('should successfully subscribe with email only', async () => {
            // Arrange
            const mockResponse = {
                data: {
                    success: true,
                    message: 'Successfully subscribed'
                }
            }
            axios.post.mockResolvedValue(mockResponse)

            // Act
            const result = await subscribeToNewsletter('test@example.com')

            // Assert
            expect(axios.post).toHaveBeenCalledWith(
                '/.netlify/functions/subscribe',
                {
                    email: 'test@example.com',
                    firstName: ''
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 15000
                }
            )
            expect(result).toEqual(mockResponse.data)
            expect(result.success).toBe(true)
        })

        it('should successfully subscribe with email and firstName', async () => {
            // Arrange
            const mockResponse = {
                data: {
                    success: true,
                    message: 'Successfully subscribed'
                }
            }
            axios.post.mockResolvedValue(mockResponse)

            // Act
            const result = await subscribeToNewsletter('test@example.com', 'John')

            // Assert
            expect(axios.post).toHaveBeenCalledWith(
                '/.netlify/functions/subscribe',
                {
                    email: 'test@example.com',
                    firstName: 'John'
                },
                expect.any(Object)
            )
            expect(result.success).toBe(true)
        })

        it('should handle serverless function success response', async () => {
            // Arrange
            const mockResponse = {
                data: {
                    success: true,
                    subscriber: {
                        id: 123,
                        email: 'test@example.com'
                    }
                }
            }
            axios.post.mockResolvedValue(mockResponse)

            // Act
            const result = await subscribeToNewsletter('test@example.com')

            // Assert
            expect(result).toEqual(mockResponse.data)
            expect(result.success).toBe(true)
            expect(result.subscriber).toBeDefined()
        })

        it('should set correct timeout of 15 seconds', async () => {
            // Arrange
            const mockResponse = {
                data: { success: true }
            }
            axios.post.mockResolvedValue(mockResponse)

            // Act
            await subscribeToNewsletter('test@example.com')

            // Assert
            expect(axios.post).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Object),
                expect.objectContaining({
                    timeout: 15000
                })
            )
        })
    })

    describe('subscribeToNewsletter - Server Error Cases', () => {
        it('should handle server error response with custom error message', async () => {
            // Arrange
            const mockError = {
                response: {
                    status: 400,
                    data: {
                        success: false,
                        error: 'Invalid email address format.'
                    }
                }
            }
            axios.post.mockRejectedValue(mockError)
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

            // Act
            const result = await subscribeToNewsletter('invalid-email')

            // Assert
            expect(result.success).toBe(false)
            expect(result.error).toBe('Invalid email address format.')
            expect(consoleErrorSpy).toHaveBeenCalled()
        })

        it('should handle server error response without custom error message', async () => {
            // Arrange
            const mockError = {
                response: {
                    status: 500,
                    data: {}
                }
            }
            axios.post.mockRejectedValue(mockError)
            vi.spyOn(console, 'error').mockImplementation(() => {})

            // Act
            const result = await subscribeToNewsletter('test@example.com')

            // Assert
            expect(result.success).toBe(false)
            expect(result.error).toBe('Subscription failed. Please try again.')
        })

        it('should handle rate limiting (429 Too Many Requests)', async () => {
            // Arrange
            const mockError = {
                response: {
                    status: 429,
                    data: {
                        success: false,
                        error: 'Too many requests. Please try again in a minute.'
                    }
                }
            }
            axios.post.mockRejectedValue(mockError)
            vi.spyOn(console, 'error').mockImplementation(() => {})

            // Act
            const result = await subscribeToNewsletter('test@example.com')

            // Assert
            expect(result.success).toBe(false)
            expect(result.error).toContain('Too many requests')
        })

        it('should handle serverless function internal error (500)', async () => {
            // Arrange
            const mockError = {
                response: {
                    status: 500,
                    data: {
                        success: false,
                        error: 'Internal server error'
                    }
                }
            }
            axios.post.mockRejectedValue(mockError)
            vi.spyOn(console, 'error').mockImplementation(() => {})

            // Act
            const result = await subscribeToNewsletter('test@example.com')

            // Assert
            expect(result.success).toBe(false)
            expect(result.error).toBe('Internal server error')
        })
    })

    describe('subscribeToNewsletter - Network Error Cases', () => {
        it('should handle network error (no response)', async () => {
            // Arrange
            const mockError = {
                request: {}, // Request was made but no response
                message: 'Network Error'
            }
            axios.post.mockRejectedValue(mockError)
            vi.spyOn(console, 'error').mockImplementation(() => {})

            // Act
            const result = await subscribeToNewsletter('test@example.com')

            // Assert
            expect(result.success).toBe(false)
            expect(result.error).toBe('Network error. Please check your connection and try again.')
        })

        it('should handle timeout error', async () => {
            // Arrange
            const mockError = {
                request: {},
                code: 'ECONNABORTED',
                message: 'timeout of 15000ms exceeded'
            }
            axios.post.mockRejectedValue(mockError)
            vi.spyOn(console, 'error').mockImplementation(() => {})

            // Act
            const result = await subscribeToNewsletter('test@example.com')

            // Assert
            expect(result.success).toBe(false)
            expect(result.error).toBe('Network error. Please check your connection and try again.')
        })

        it('should handle connection refused error', async () => {
            // Arrange
            const mockError = {
                request: {},
                code: 'ECONNREFUSED',
                message: 'connect ECONNREFUSED'
            }
            axios.post.mockRejectedValue(mockError)
            vi.spyOn(console, 'error').mockImplementation(() => {})

            // Act
            const result = await subscribeToNewsletter('test@example.com')

            // Assert
            expect(result.success).toBe(false)
            expect(result.error).toBe('Network error. Please check your connection and try again.')
        })
    })

    describe('subscribeToNewsletter - Unexpected Error Cases', () => {
        it('should handle unexpected errors with message', async () => {
            // Arrange
            const mockError = {
                message: 'Something went wrong unexpectedly'
            }
            axios.post.mockRejectedValue(mockError)
            vi.spyOn(console, 'error').mockImplementation(() => {})

            // Act
            const result = await subscribeToNewsletter('test@example.com')

            // Assert
            expect(result.success).toBe(false)
            expect(result.error).toBe('Something went wrong unexpectedly')
        })

        it('should handle unexpected errors without message', async () => {
            // Arrange
            const mockError = {}
            axios.post.mockRejectedValue(mockError)
            vi.spyOn(console, 'error').mockImplementation(() => {})

            // Act
            const result = await subscribeToNewsletter('test@example.com')

            // Assert
            expect(result.success).toBe(false)
            expect(result.error).toBe('An unexpected error occurred.')
        })

        it('should log errors to console', async () => {
            // Arrange
            const mockError = {
                message: 'Test error'
            }
            axios.post.mockRejectedValue(mockError)
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

            // Act
            await subscribeToNewsletter('test@example.com')

            // Assert
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Newsletter subscription error:',
                mockError
            )
        })
    })

    describe('subscribeToNewsletter - Edge Cases', () => {
        it('should handle empty email string', async () => {
            // Arrange
            const mockResponse = {
                data: { success: true }
            }
            axios.post.mockResolvedValue(mockResponse)

            // Act
            const result = await subscribeToNewsletter('')

            // Assert
            expect(axios.post).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    email: ''
                }),
                expect.any(Object)
            )
        })

        it('should handle long email addresses', async () => {
            // Arrange
            const longEmail = 'a'.repeat(50) + '@' + 'b'.repeat(50) + '.com'
            const mockResponse = {
                data: { success: true }
            }
            axios.post.mockResolvedValue(mockResponse)

            // Act
            const result = await subscribeToNewsletter(longEmail)

            // Assert
            expect(axios.post).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    email: longEmail
                }),
                expect.any(Object)
            )
        })

        it('should handle special characters in firstName', async () => {
            // Arrange
            const firstName = "O'Brien-Smith"
            const mockResponse = {
                data: { success: true }
            }
            axios.post.mockResolvedValue(mockResponse)

            // Act
            const result = await subscribeToNewsletter('test@example.com', firstName)

            // Assert
            expect(axios.post).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    firstName: firstName
                }),
                expect.any(Object)
            )
        })

        it('should handle undefined firstName (defaults to empty string)', async () => {
            // Arrange
            const mockResponse = {
                data: { success: true }
            }
            axios.post.mockResolvedValue(mockResponse)

            // Act
            const result = await subscribeToNewsletter('test@example.com', undefined)

            // Assert
            expect(axios.post).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    firstName: ''
                }),
                expect.any(Object)
            )
        })
    })
})
