import { episodes } from '../data/content'
import { recipes as canonicalRecipes } from '../data/recipes'

const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 60))

export const recipes = canonicalRecipes

export const getRecipes = async () => delay([...canonicalRecipes])
export const getEpisodes = async () => delay(episodes)

export const getRecipeBySlug = async (slug) => delay(canonicalRecipes.find((item) => item.slug === slug))
export const getEpisodeBySlug = async (slug) => delay(episodes.find((item) => item.slug === slug))

export const getFeatured = async () => delay({
    recipe: canonicalRecipes[0] || null,
    episode: episodes[0] || null
})

export const getAllSlugs = () => ({
    recipes: canonicalRecipes.map((recipe) => recipe.slug),
    episodes: episodes.map((episode) => episode.slug)
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
            .sort((a, b) => {
                const dateA = new Date(a.publishedDate || '2024-01-01')
                const dateB = new Date(b.publishedDate || '2024-01-01')
                return dateB - dateA
            })
            .slice(0, limit)
    )
}
