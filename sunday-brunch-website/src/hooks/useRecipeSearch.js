import { useMemo } from 'react'
import Fuse from 'fuse.js'

const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'story', weight: 0.2 },
    { name: 'ingredients.name', weight: 0.2 },
    { name: 'tags', weight: 0.1 },
    { name: 'category', weight: 0.1 }
  ],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2,
  ignoreLocation: true
}

function useRecipeSearch(recipes, filters) {
  const {
    searchQuery = '',
    category = 'all',
    dietary = [],
    season = 'all',
    difficulty = 'all',
    cookTime = 'all',
    tags = [],
    sortBy = 'newest'
  } = filters

  // Create Fuse instance once when recipes change
  const fuse = useMemo(() =>
    recipes && recipes.length > 0
      ? new Fuse(recipes, fuseOptions)
      : null,
    [recipes]  // Only recreate when recipes change
  )

  const results = useMemo(() => {
    if (!recipes) {
      return { results: [], count: 0, loading: true }
    }

    let filtered = [...recipes]

    // Apply text search with Fuse.js
    if (searchQuery && searchQuery.trim().length >= 2 && fuse) {
      const searchResults = fuse.search(searchQuery)
      filtered = searchResults.map(result => result.item)
    }

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(recipe => recipe.category === category)
    }

    // Filter by dietary restrictions (OR logic)
    if (dietary.length > 0) {
      filtered = filtered.filter(recipe =>
        dietary.some(diet => recipe.dietary?.includes(diet))
      )
    }

    // Filter by season
    if (season !== 'all') {
      filtered = filtered.filter(recipe =>
        recipe.season === season || recipe.season === 'All Seasons'
      )
    }

    // Filter by difficulty
    if (difficulty !== 'all') {
      filtered = filtered.filter(recipe => recipe.difficulty === difficulty)
    }

    // Filter by cook time
    if (cookTime !== 'all') {
      filtered = filtered.filter(recipe => {
        const time = recipe.cookTime || 0
        switch (cookTime) {
          case 'under-30':
            return time < 30
          case '30-60':
            return time >= 30 && time <= 60
          case '60-120':
            return time > 60 && time <= 120
          case 'over-120':
            return time > 120
          default:
            return true
        }
      })
    }

    // Filter by tags
    if (tags.length > 0) {
      filtered = filtered.filter(recipe =>
        tags.some(tag => recipe.tags?.includes(tag))
      )
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (b.date || '').localeCompare(a.date || '')
        case 'oldest':
          return (a.date || '').localeCompare(b.date || '')
        case 'a-z':
          return a.title.localeCompare(b.title)
        case 'z-a':
          return b.title.localeCompare(a.title)
        case 'quick-first':
          return (a.cookTime || 0) - (b.cookTime || 0)
        case 'complex-first':
          return (b.cookTime || 0) - (a.cookTime || 0)
        default:
          return 0
      }
    })

    return {
      results: filtered,
      count: filtered.length,
      loading: false
    }
  }, [recipes, searchQuery, category, dietary, season, difficulty, cookTime, tags, sortBy, fuse])

  return results
}

export default useRecipeSearch
