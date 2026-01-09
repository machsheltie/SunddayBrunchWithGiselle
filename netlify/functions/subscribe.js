/**
 * Netlify Serverless Function - ConvertKit Newsletter Subscription
 *
 * This function proxies newsletter subscriptions to ConvertKit API
 * while keeping API credentials secure on the server side.
 *
 * Environment Variables Required:
 * - CONVERTKIT_API_KEY: Your ConvertKit API key
 * - CONVERTKIT_FORM_ID: Your ConvertKit form ID
 *
 * Security Features:
 * - Rate limiting per IP address
 * - Email validation
 * - CORS headers
 * - API key kept server-side only
 */

const axios = require('axios')

// Rate limiting: Simple in-memory store (use Redis/DynamoDB for production scale)
const rateLimitStore = new Map()
const RATE_LIMIT_WINDOW = 60000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5

/**
 * Check if request is rate limited
 * @param {string} ip - Client IP address
 * @returns {boolean} - True if rate limited
 */
function isRateLimited(ip) {
    const now = Date.now()
    const requestLog = rateLimitStore.get(ip) || []

    // Remove requests outside the window
    const recentRequests = requestLog.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW)

    if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
        return true
    }

    // Add current request
    recentRequests.push(now)
    rateLimitStore.set(ip, recentRequests)

    return false
}

/**
 * Validate email address format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Netlify serverless function handler
 */
exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*', // Configure specific domain in production
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    }

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        }
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Method not allowed. Use POST.'
            })
        }
    }

    // Rate limiting
    const clientIp = event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'unknown'
    if (isRateLimited(clientIp)) {
        return {
            statusCode: 429,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Too many requests. Please try again in a minute.'
            })
        }
    }

    // Parse request body
    let body
    try {
        body = JSON.parse(event.body || '{}')
    } catch (error) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Invalid JSON in request body.'
            })
        }
    }

    const { email, firstName = '' } = body

    // Validate email
    if (!email) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Email address is required.'
            })
        }
    }

    if (!isValidEmail(email)) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Invalid email address format.'
            })
        }
    }

    // Check environment variables
    const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY
    const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID

    if (!CONVERTKIT_API_KEY || !CONVERTKIT_FORM_ID) {
        console.error('ConvertKit credentials not configured')
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Server configuration error. Please contact support.'
            })
        }
    }

    // Subscribe to ConvertKit
    try {
        const response = await axios.post(
            `https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`,
            {
                api_key: CONVERTKIT_API_KEY,
                email: email,
                first_name: firstName
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000 // 10 second timeout
            }
        )

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Successfully subscribed to newsletter!',
                data: {
                    subscription: response.data.subscription
                }
            })
        }
    } catch (error) {
        console.error('ConvertKit API error:', error.message)

        if (error.response) {
            // ConvertKit API returned an error
            const status = error.response.status
            const message = error.response.data?.message || 'Subscription failed.'

            // Check for duplicate email (already subscribed)
            if (status === 400 && message.includes('already subscribed')) {
                return {
                    statusCode: 200, // Return success for duplicate subscriptions
                    headers,
                    body: JSON.stringify({
                        success: true,
                        message: 'This email is already subscribed to our newsletter!'
                    })
                }
            }

            return {
                statusCode: status,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: message
                })
            }
        } else if (error.request) {
            // Network error
            return {
                statusCode: 503,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Unable to connect to subscription service. Please try again later.'
                })
            }
        } else {
            // Unexpected error
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'An unexpected error occurred. Please try again.'
                })
            }
        }
    }
}
