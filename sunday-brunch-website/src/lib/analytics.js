// Simple analytics stub - replace with real provider
export const trackEvent = (name, data = {}) => {
    if (import.meta.env.MODE === 'development') {
        console.debug('[event]', name, data)
    }
    // Hook real analytics provider here (e.g., PostHog, GA)
}

export const trackPageView = (path) => trackEvent('page_view', { path })
export const trackPrint = (context) => trackEvent('print', { context })
export const trackShare = (channel, context) => trackEvent('share', { channel, context })
export const trackCopy = (context) => trackEvent('copy', { context })
export const trackAudio = (state, context) => trackEvent('audio', { state, context })
export const trackAffiliateClick = (tool) => trackEvent('affiliate_click', tool)
