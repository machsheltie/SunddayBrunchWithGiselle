import axios from 'axios'

const CONVERTKIT_FORM_ID = import.meta.env.VITE_CONVERTKIT_FORM_ID
const CONVERTKIT_API_KEY = import.meta.env.VITE_CONVERTKIT_API_KEY

/**
 * Subscribe email to ConvertKit form
 * @param {string} email - Email address to subscribe
 * @param {string} firstName - Optional first name
 * @returns {Promise} - API response
 */
export const subscribeToNewsletter = async (email, firstName = '') => {
    if (!CONVERTKIT_FORM_ID || !CONVERTKIT_API_KEY) {
        return {
            success: false,
            error: 'ConvertKit credentials are not configured. Add VITE_CONVERTKIT_FORM_ID and VITE_CONVERTKIT_API_KEY to .env.'
        }
    }

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
                }
            }
        )

        return {
            success: true,
            data: response.data
        }
    } catch (error) {
        console.error('ConvertKit subscription error:', error)

        if (error.response) {
            // Server responded with error
            return {
                success: false,
                error: error.response.data.message || 'Subscription failed. Please try again.'
            }
        } else if (error.request) {
            // Request made but no response
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
