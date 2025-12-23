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
