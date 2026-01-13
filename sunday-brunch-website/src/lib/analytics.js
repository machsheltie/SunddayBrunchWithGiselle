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

// Content discovery tracking
export const trackCollectionView = (collectionId, recipeCount) => {
    trackEvent('collection_view', {
        collection: collectionId,
        recipe_count: recipeCount,
        timestamp: new Date().toISOString()
    })
}

export const trackCollectionFilterApply = (filters) => {
    trackEvent('collection_filter_apply', {
        filters,
        timestamp: new Date().toISOString()
    })
}

export const trackRecentRecipeClick = (recipeSlug, position) => {
    trackEvent('recent_recipe_click', {
        recipe_slug: recipeSlug,
        position,
        timestamp: new Date().toISOString()
    })
}

export const trackSeeAllRecipesClick = () => {
    trackEvent('see_all_recipes_click', {
        timestamp: new Date().toISOString()
    })
}

// Email signup tracking
export const trackEmailSignup = (location, status, error = null) => {
    trackEvent('email_signup', {
        location,
        status,
        error: error?.message || error,
        timestamp: new Date().toISOString()
    })
}

// Social proof / testimonials tracking
export const trackTestimonialView = (reviewId, recipeSlug) => {
    trackEvent('testimonial_view', {
        review_id: reviewId,
        recipe_slug: recipeSlug,
        timestamp: new Date().toISOString()
    })
}

export const trackTestimonialInteraction = (action, details = {}) => {
    trackEvent('testimonial_interaction', {
        action,
        ...details,
        timestamp: new Date().toISOString()
    })
}
