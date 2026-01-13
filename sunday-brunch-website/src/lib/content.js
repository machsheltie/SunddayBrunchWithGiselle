import { recipes, episodes } from '../data/content'

const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 60))

export const getRecipes = async () => delay(recipes)
export const getEpisodes = async () => delay(episodes)

export const getRecipeBySlug = async (slug) => delay(recipes.find((item) => item.slug === slug))
export const getEpisodeBySlug = async (slug) => delay(episodes.find((item) => item.slug === slug))

export const getFeatured = async () => delay({
    recipe: recipes[0],
    episode: episodes[0]
})

export const getAllSlugs = () => ({
    recipes: recipes.map((r) => r.slug),
    episodes: episodes.map((e) => e.slug)
})

/**
 * Get recent recipes sorted by published date
 * @param {number} limit - Number of recipes to return (default: 8)
 * @returns {Promise<Array>} Array of most recent recipes
 */
export const getRecentRecipes = async (limit = 8) => {
    const allRecipes = await getRecipes()

    return delay(
        allRecipes
            .filter(recipe => !recipe.slug.includes('placeholder')) // Exclude placeholders
            .sort((a, b) => {
                // Sort by publishedDate if exists, otherwise fallback
                const dateA = new Date(a.publishedDate || '2024-01-01')
                const dateB = new Date(b.publishedDate || '2024-01-01')
                return dateB - dateA // Most recent first
            })
            .slice(0, limit)
    )
}
