import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import useRecipeSearch from '../../hooks/useRecipeSearch'

describe('useRecipeSearch Hook', () => {
  const mockRecipes = [
    {
      slug: 'chocolate-chip-cookies',
      title: 'Chocolate Chip Cookies',
      category: 'Cookies',
      skill: 'Beginner',
      dietary: ['Vegetarian'],
      season: 'All Seasons',
      difficulty: 'Easy',
      cookTime: 25,
      tags: ['Chocolate', 'Classic'],
      ingredients: [
        { name: 'flour', amount: 2, unit: 'cups' },
        { name: 'chocolate chips', amount: 2, unit: 'cups' }
      ],
      story: ['Classic chocolate chip cookies']
    },
    {
      slug: 'vegan-brownies',
      title: 'Fudgy Vegan Brownies',
      category: 'Brownies',
      skill: 'Beginner',
      dietary: ['Vegan', 'Dairy-Free', 'Egg-Free'],
      season: 'All Seasons',
      difficulty: 'Easy',
      cookTime: 35,
      tags: ['Chocolate', 'Fudgy'],
      ingredients: [
        { name: 'cocoa powder', amount: 0.5, unit: 'cups' },
        { name: 'flour', amount: 1, unit: 'cups' }
      ],
      story: ['Rich vegan brownies']
    },
    {
      slug: 'pumpkin-pie',
      title: 'Classic Pumpkin Pie',
      category: 'Pies',
      skill: 'Intermediate',
      dietary: ['Vegetarian'],
      season: 'Fall',
      difficulty: 'Medium',
      cookTime: 75,
      tags: ['Spices', 'Holiday'],
      ingredients: [
        { name: 'pumpkin puree', amount: 2, unit: 'cups' },
        { name: 'eggs', amount: 3, unit: 'pcs' }
      ],
      story: ['Perfect for Thanksgiving']
    },
    {
      slug: 'sourdough-bread',
      title: 'Artisan Sourdough Bread',
      category: 'Breads',
      skill: 'Advanced',
      dietary: ['Vegan', 'Dairy-Free', 'Egg-Free'],
      season: 'All Seasons',
      difficulty: 'Advanced',
      cookTime: 180,
      tags: ['Yeast', 'Artisan'],
      ingredients: [
        { name: 'bread flour', amount: 4, unit: 'cups' },
        { name: 'sourdough starter', amount: 1, unit: 'cups' }
      ],
      story: ['Complex fermentation process']
    }
  ]

  it('should return all recipes when no filters applied', () => {
    const { result } = renderHook(() =>
      useRecipeSearch(mockRecipes, {
        searchQuery: '',
        category: 'all',
        dietary: [],
        season: 'all',
        difficulty: 'all',
        cookTime: 'all',
        tags: [],
        sortBy: 'newest'
      })
    )

    expect(result.current.results).toHaveLength(4)
  })

  it('should filter recipes by search query', () => {
    const { result } = renderHook(() =>
      useRecipeSearch(mockRecipes, {
        searchQuery: 'chocolate',
        category: 'all',
        dietary: [],
        season: 'all',
        difficulty: 'all',
        cookTime: 'all',
        tags: [],
        sortBy: 'newest'
      })
    )

    expect(result.current.results).toHaveLength(2)
    expect(result.current.results[0].title).toContain('Chocolate')
  })

  it('should handle fuzzy search (typos)', () => {
    const { result } = renderHook(() =>
      useRecipeSearch(mockRecipes, {
        searchQuery: 'choclate', // Typo: missing 'o'
        category: 'all',
        dietary: [],
        season: 'all',
        difficulty: 'all',
        cookTime: 'all',
        tags: [],
        sortBy: 'newest'
      })
    )

    // Fuzzy search should still find chocolate recipes
    expect(result.current.results.length).toBeGreaterThan(0)
    expect(result.current.results[0].title).toMatch(/chocolate/i)
  })

  it('should filter recipes by category', () => {
    const { result } = renderHook(() =>
      useRecipeSearch(mockRecipes, {
        searchQuery: '',
        category: 'Cookies',
        dietary: [],
        season: 'all',
        difficulty: 'all',
        cookTime: 'all',
        tags: [],
        sortBy: 'newest'
      })
    )

    expect(result.current.results).toHaveLength(1)
    expect(result.current.results[0].category).toBe('Cookies')
  })

  it('should filter recipes by multiple dietary restrictions (OR logic)', () => {
    const { result } = renderHook(() =>
      useRecipeSearch(mockRecipes, {
        searchQuery: '',
        category: 'all',
        dietary: ['Vegan', 'Gluten-Free'],
        season: 'all',
        difficulty: 'all',
        cookTime: 'all',
        tags: [],
        sortBy: 'newest'
      })
    )

    // Should find recipes that are either Vegan OR Gluten-Free
    expect(result.current.results.length).toBeGreaterThan(0)
    result.current.results.forEach(recipe => {
      const matchesDietary =
        recipe.dietary.includes('Vegan') ||
        recipe.dietary.includes('Gluten-Free')
      expect(matchesDietary).toBe(true)
    })
  })

  it('should filter recipes by season', () => {
    const { result } = renderHook(() =>
      useRecipeSearch(mockRecipes, {
        searchQuery: '',
        category: 'all',
        dietary: [],
        season: 'Fall',
        difficulty: 'all',
        cookTime: 'all',
        tags: [],
        sortBy: 'newest'
      })
    )

    // Should return Fall recipes AND "All Seasons" recipes (4 total: 3 All Seasons + 1 Fall)
    expect(result.current.results).toHaveLength(4)
    // Find the Fall-specific recipe
    const fallRecipe = result.current.results.find(r => r.season === 'Fall')
    expect(fallRecipe).toBeDefined()
    expect(fallRecipe.season).toBe('Fall')
  })

  it('should filter recipes by difficulty', () => {
    const { result } = renderHook(() =>
      useRecipeSearch(mockRecipes, {
        searchQuery: '',
        category: 'all',
        dietary: [],
        season: 'all',
        difficulty: 'Easy',
        cookTime: 'all',
        tags: [],
        sortBy: 'newest'
      })
    )

    expect(result.current.results.length).toBeGreaterThan(0)
    result.current.results.forEach(recipe => {
      expect(recipe.difficulty).toBe('Easy')
    })
  })

  it('should filter recipes by cook time', () => {
    const { result } = renderHook(() =>
      useRecipeSearch(mockRecipes, {
        searchQuery: '',
        category: 'all',
        dietary: [],
        season: 'all',
        difficulty: 'all',
        cookTime: 'under-30',
        tags: [],
        sortBy: 'newest'
      })
    )

    expect(result.current.results.length).toBeGreaterThan(0)
    result.current.results.forEach(recipe => {
      expect(recipe.cookTime).toBeLessThan(30)
    })
  })

  it('should combine multiple filters with AND logic', () => {
    const { result } = renderHook(() =>
      useRecipeSearch(mockRecipes, {
        searchQuery: '',
        category: 'Brownies',
        dietary: ['Vegan'],
        season: 'all',
        difficulty: 'Easy',
        cookTime: 'all',
        tags: [],
        sortBy: 'newest'
      })
    )

    expect(result.current.results).toHaveLength(1)
    const recipe = result.current.results[0]
    expect(recipe.category).toBe('Brownies')
    expect(recipe.dietary).toContain('Vegan')
    expect(recipe.difficulty).toBe('Easy')
  })

  it('should sort results by newest first', () => {
    const recipesWithDates = mockRecipes.map((r, i) => ({
      ...r,
      date: `2024-01-0${i + 1}`
    }))

    const { result } = renderHook(() =>
      useRecipeSearch(recipesWithDates, {
        searchQuery: '',
        category: 'all',
        dietary: [],
        season: 'all',
        difficulty: 'all',
        cookTime: 'all',
        tags: [],
        sortBy: 'newest'
      })
    )

    // Dates are strings, so we compare lexicographically (works for ISO format)
    const firstDate = result.current.results[0].date
    const lastDate = result.current.results[result.current.results.length - 1].date
    expect(firstDate.localeCompare(lastDate)).toBeGreaterThan(0)
  })

  it('should sort results alphabetically (A-Z)', () => {
    const { result } = renderHook(() =>
      useRecipeSearch(mockRecipes, {
        searchQuery: '',
        category: 'all',
        dietary: [],
        season: 'all',
        difficulty: 'all',
        cookTime: 'all',
        tags: [],
        sortBy: 'a-z'
      })
    )

    const titles = result.current.results.map(r => r.title)
    const sortedTitles = [...titles].sort()
    expect(titles).toEqual(sortedTitles)
  })

  it('should sort results by cook time (quick first)', () => {
    const { result } = renderHook(() =>
      useRecipeSearch(mockRecipes, {
        searchQuery: '',
        category: 'all',
        dietary: [],
        season: 'all',
        difficulty: 'all',
        cookTime: 'all',
        tags: [],
        sortBy: 'quick-first'
      })
    )

    const cookTimes = result.current.results.map(r => r.cookTime)
    const sortedCookTimes = [...cookTimes].sort((a, b) => a - b)
    expect(cookTimes).toEqual(sortedCookTimes)
  })

  it('should return empty array when no recipes match', () => {
    const { result } = renderHook(() =>
      useRecipeSearch(mockRecipes, {
        searchQuery: 'xyznonexistent',
        category: 'all',
        dietary: [],
        season: 'all',
        difficulty: 'all',
        cookTime: 'all',
        tags: [],
        sortBy: 'newest'
      })
    )

    expect(result.current.results).toHaveLength(0)
  })

  it('should search in ingredients', () => {
    const { result } = renderHook(() =>
      useRecipeSearch(mockRecipes, {
        searchQuery: 'sourdough starter',
        category: 'all',
        dietary: [],
        season: 'all',
        difficulty: 'all',
        cookTime: 'all',
        tags: [],
        sortBy: 'newest'
      })
    )

    expect(result.current.results).toHaveLength(1)
    expect(result.current.results[0].slug).toBe('sourdough-bread')
  })

  it('should filter by tags', () => {
    const { result } = renderHook(() =>
      useRecipeSearch(mockRecipes, {
        searchQuery: '',
        category: 'all',
        dietary: [],
        season: 'all',
        difficulty: 'all',
        cookTime: 'all',
        tags: ['Holiday'],
        sortBy: 'newest'
      })
    )

    expect(result.current.results.length).toBeGreaterThan(0)
    result.current.results.forEach(recipe => {
      expect(recipe.tags).toContain('Holiday')
    })
  })

  it('should be performant with 100+ recipes', () => {
    const largeRecipeSet = Array.from({ length: 150 }, (_, i) => ({
      ...mockRecipes[0],
      slug: `recipe-${i}`,
      title: `Recipe ${i}`
    }))

    const startTime = performance.now()

    renderHook(() =>
      useRecipeSearch(largeRecipeSet, {
        searchQuery: 'recipe',
        category: 'all',
        dietary: [],
        season: 'all',
        difficulty: 'all',
        cookTime: 'all',
        tags: [],
        sortBy: 'newest'
      })
    )

    const endTime = performance.now()
    const executionTime = endTime - startTime

    // Should complete in less than 100ms
    expect(executionTime).toBeLessThan(100)
  })

  it('should return result count', () => {
    const { result } = renderHook(() =>
      useRecipeSearch(mockRecipes, {
        searchQuery: 'chocolate',
        category: 'all',
        dietary: [],
        season: 'all',
        difficulty: 'all',
        cookTime: 'all',
        tags: [],
        sortBy: 'newest'
      })
    )

    expect(result.current.count).toBe(2)
  })

  it('should return loading state', () => {
    const { result } = renderHook(() =>
      useRecipeSearch(null, {
        searchQuery: '',
        category: 'all',
        dietary: [],
        season: 'all',
        difficulty: 'all',
        cookTime: 'all',
        tags: [],
        sortBy: 'newest'
      })
    )

    expect(result.current.loading).toBe(true)
  })
})
