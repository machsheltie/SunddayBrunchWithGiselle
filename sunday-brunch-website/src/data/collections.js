/**
 * Recipe Collections - Curated groups for content discovery
 *
 * Each collection defines filters that get applied when users click
 * to browse that collection. Filters are converted to URL params
 * and applied to the recipe index page.
 */

/**
 * Get current season based on month
 * @returns {string} Current season name
 */
function getCurrentSeason() {
    const month = new Date().getMonth() + 1 // 1-12

    if (month >= 3 && month <= 5) return 'Spring'
    if (month >= 6 && month <= 8) return 'Summer'
    if (month >= 9 && month <= 11) return 'Fall'
    return 'Winter'
}

/**
 * Get season emoji based on season name
 * @param {string} season - Season name
 * @returns {string} Emoji for season
 */
function getSeasonEmoji(season) {
    const emojis = {
        'Spring': '🌸',
        'Summer': '☀️',
        'Fall': '🍂',
        'Winter': '❄️'
    }
    return emojis[season] || '🍂'
}

/**
 * Convert collection filters to URL query parameters
 * @param {Object} filters - Filter object from collection
 * @returns {string} URL query string
 */
export function buildCollectionURL(filters) {
    const params = new URLSearchParams()

    if (filters.cookTime !== undefined) {
        params.append('cookTime', filters.cookTime)
        if (filters.maxOnly) params.append('maxOnly', 'true')
    }
    if (filters.occasion) params.append('occasion', filters.occasion)
    if (filters.skill) params.append('skill', filters.skill)
    if (filters.season) params.append('season', filters.season)
    if (filters.dietary) params.append('dietary', filters.dietary)

    return `/recipes?${params.toString()}`
}

/**
 * Recipe Collections - 4 curated discovery paths
 */
export const collections = [
    {
        id: 'quick-bakes',
        title: 'Quick Sunday Morning Bakes',
        subtitle: 'Under 30 minutes',
        icon: '⏱️',
        color: 'var(--pastel-sky)',
        filters: {
            cookTime: 30,
            maxOnly: true
        },
        description: 'Start your morning with effortless baking. Perfect for busy Sundays when you want homemade goodness without the wait.',
        featured: [] // Will be populated with first 3 matching recipes
    },
    {
        id: 'gifting',
        title: 'Perfect for Gifting',
        subtitle: 'Beautiful & delicious',
        icon: '🎁',
        color: 'var(--soft-sakura)',
        filters: {
            occasion: 'Holiday Gifting'
        },
        description: 'Show your love with these gift-worthy treats. Beautifully presented and made with care.',
        featured: []
    },
    {
        id: 'beginner-friendly',
        title: 'Beginner-Friendly Favorites',
        subtitle: 'Easy wins',
        icon: '🌟',
        color: 'var(--pastel-lavender)',
        filters: {
            skill: 'Beginner'
        },
        description: 'Build your confidence with foolproof recipes. Simple techniques, stunning results.',
        featured: []
    },
    {
        id: 'seasonal',
        title: `${getCurrentSeason()} Specials`,
        subtitle: `Celebrating ${getCurrentSeason().toLowerCase()}`,
        icon: getSeasonEmoji(getCurrentSeason()),
        color: 'var(--mint-cream)',
        filters: {
            season: getCurrentSeason()
        },
        description: `Embrace the flavors of ${getCurrentSeason().toLowerCase()} with these seasonal favorites.`,
        featured: []
    }
]

/**
 * Get collection by ID
 * @param {string} id - Collection ID
 * @returns {Object|null} Collection object or null
 */
export function getCollectionById(id) {
    return collections.find(c => c.id === id) || null
}

/**
 * Get all collections
 * @returns {Array} Array of all collections
 */
export function getAllCollections() {
    return collections
}

export default collections
