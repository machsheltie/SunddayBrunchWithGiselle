const SPONSOR_ENDPOINT = import.meta.env.VITE_SPONSOR_ENDPOINT

export const sendSponsorInquiry = async ({ name, email, note }) => {
    if (!SPONSOR_ENDPOINT) {
        console.warn('Sponsor endpoint not configured. Set VITE_SPONSOR_ENDPOINT to send real requests.')
        return Promise.resolve({ success: true, data: { name, email, note, mocked: true } })
    }

    try {
        const response = await fetch(SPONSOR_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, note })
        })
        if (!response.ok) {
            return { success: false, error: 'Unable to send right now. Please try again soon.' }
        }
        return { success: true, data: await response.json() }
    } catch (err) {
        return { success: false, error: err?.message || 'Network error. Please try again.' }
    }
}
