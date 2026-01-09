import axios from 'axios'

/**
 * Subscribe email to ConvertKit newsletter via Netlify serverless function
 *
 * SECURITY NOTE: This function now calls a Netlify serverless function that
 * securely handles ConvertKit API credentials server-side. No API keys are
 * exposed in the client bundle.
 *
 * @param {string} email - Email address to subscribe
 * @param {string} firstName - Optional first name
 * @returns {Promise<Object>} - Response object with success status and data/error
 */
export const subscribeToNewsletter = async (email, firstName = '') => {
    try {
        // Call Netlify serverless function instead of ConvertKit API directly
        // This function will be available at /.netlify/functions/subscribe
        const response = await axios.post(
            '/.netlify/functions/subscribe',
            {
                email: email,
                firstName: firstName
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 15000 // 15 second timeout
            }
        )

        // Serverless function returns consistent response format
        return response.data
    } catch (error) {
        console.error('Newsletter subscription error:', error)

        if (error.response) {
            // Serverless function responded with error
            const errorData = error.response.data
            return {
                success: false,
                error: errorData.error || 'Subscription failed. Please try again.'
            }
        } else if (error.request) {
            // Request made but no response (network error)
            return {
                success: false,
                error: 'Network error. Please check your connection and try again.'
            }
        } else {
            // Something else happened
            return {
                success: false,
                error: error.message || 'An unexpected error occurred.'
            }
        }
    }
}
