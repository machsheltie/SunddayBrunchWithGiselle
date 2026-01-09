/**
 * @jest-environment jsdom
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { applyMeta, applyRecipeSchema, applyEpisodeSchema } from '../../lib/seo'

describe('SEO Library', () => {
  let mockHead
  let mockDocument

  beforeEach(() => {
    // Mock document.head and document methods
    mockHead = {
      children: []
    }

    // Create appendChild that adds to children array
    mockHead.appendChild = vi.fn((element) => {
      mockHead.children.push(element)
    })

    mockDocument = {
      title: '',
      createElement: vi.fn((tag) => {
        const element = {
          tagName: tag.toUpperCase(),
          attributes: {},
          id: '',
          type: '',
          textContent: '',
          setAttribute: vi.fn((name, value) => {
            element.attributes[name] = value
            // Also set as direct property for id and type
            if (name === 'id') element.id = value
            if (name === 'type') element.type = value
          }),
          getAttribute: vi.fn((name) => element.attributes[name])
        }
        return element
      }),
      querySelector: vi.fn(function(selector) {
        // Check if element exists in mockHead.children
        const found = mockHead.children.find(child => {
          if (selector.includes('meta[name=')) {
            const nameMatch = selector.match(/meta\[name="([^"]+)"\]/)
            return nameMatch && child.attributes?.name === nameMatch[1]
          }
          if (selector.includes('meta[property=')) {
            const propMatch = selector.match(/meta\[property="([^"]+)"\]/)
            return propMatch && child.attributes?.property === propMatch[1]
          }
          if (selector.includes('link[rel="canonical"]')) {
            return child.attributes?.rel === 'canonical'
          }
          if (selector === '#structured-data') {
            return child.id === 'structured-data' || child.attributes?.id === 'structured-data'
          }
          return false
        })
        return found || null
      }),
      getElementById: vi.fn(function(id) {
        const found = mockHead.children.find(child => child.id === id || child.attributes?.id === id)
        return found || null
      }),
      head: mockHead
    }

    // Override global document
    global.document = mockDocument

    // Mock import.meta.env
    vi.stubEnv('VITE_SITE_URL', 'https://sundaybrunchwithgiselle.com')
  })

  afterEach(() => {
    mockHead.children = []
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  describe('applyMeta()', () => {
    it('should set document title', () => {
      applyMeta({ title: 'Sunday Brunch with Giselle' })

      expect(mockDocument.title).toBe('Sunday Brunch with Giselle')
    })

    it('should set meta description tag', () => {
      const description = 'A whimsical cooking show hosted by Giselle the goose'

      applyMeta({ description })

      expect(mockDocument.createElement).toHaveBeenCalledWith('meta')
      expect(mockHead.appendChild).toHaveBeenCalled()

      const metaEl = mockHead.children.find(
        child => child.attributes?.name === 'description'
      )
      expect(metaEl).toBeDefined()
      expect(metaEl.attributes.content).toBe(description)
    })

    it('should set OG image meta tag with URL normalization', () => {
      // Test relative URL
      applyMeta({ ogImage: '/images/giselle.jpg' })

      const ogImgEl1 = mockHead.children.find(
        child => child.attributes?.property === 'og:image'
      )
      expect(ogImgEl1).toBeDefined()
      expect(ogImgEl1.attributes.content).toBe(
        'https://sundaybrunchwithgiselle.com/images/giselle.jpg'
      )

      // Clear and test absolute URL
      mockHead.children = []
      applyMeta({ ogImage: 'https://cdn.example.com/giselle.jpg' })

      const ogImgEl2 = mockHead.children.find(
        child => child.attributes?.property === 'og:image'
      )
      expect(ogImgEl2).toBeDefined()
      expect(ogImgEl2.attributes.content).toBe('https://cdn.example.com/giselle.jpg')
    })

    it('should set canonical URL with URL normalization', () => {
      // Test relative URL
      applyMeta({ canonical: '/recipes/french-toast' })

      const canonicalEl1 = mockHead.children.find(
        child => child.attributes?.rel === 'canonical'
      )
      expect(canonicalEl1).toBeDefined()
      expect(canonicalEl1.attributes.href).toBe(
        'https://sundaybrunchwithgiselle.com/recipes/french-toast'
      )

      // Clear and test absolute URL
      mockHead.children = []
      applyMeta({ canonical: 'https://example.com/recipes/french-toast' })

      const canonicalEl2 = mockHead.children.find(
        child => child.attributes?.rel === 'canonical'
      )
      expect(canonicalEl2).toBeDefined()
      expect(canonicalEl2.attributes.href).toBe('https://example.com/recipes/french-toast')
    })

    it('should handle missing parameters gracefully', () => {
      const originalTitle = mockDocument.title

      applyMeta({})

      // Should not throw errors
      expect(mockDocument.title).toBe(originalTitle)
      expect(mockHead.children).toHaveLength(0)
    })

    it('should handle relative vs absolute URLs correctly', () => {
      // Test URL without leading slash
      applyMeta({ canonical: 'recipes/french-toast' })

      const canonicalEl = mockHead.children.find(
        child => child.attributes?.rel === 'canonical'
      )
      expect(canonicalEl.attributes.href).toBe(
        'https://sundaybrunchwithgiselle.com/recipes/french-toast'
      )
    })

    it('should update existing meta tags instead of creating duplicates', () => {
      // First call
      applyMeta({ description: 'First description' })
      const firstLength = mockHead.children.length

      // Second call with different description
      applyMeta({ description: 'Second description' })

      // Should have same number of elements (updated, not duplicated)
      expect(mockHead.children.length).toBe(firstLength)

      const metaEl = mockHead.children.find(
        child => child.attributes?.name === 'description'
      )
      expect(metaEl.attributes.content).toBe('Second description')
    })
  })

  describe('applyRecipeSchema()', () => {
    const mockRecipe = {
      title: 'French Toast Supreme',
      meta: {
        description: 'Fluffy French toast with a crispy exterior',
        ogImage: '/images/french-toast.jpg'
      },
      story: ['A classic breakfast dish with a twist'],
      yield: '4 servings',
      times: {
        prep: '10 min',
        cook: '20 min',
        total: '30 min'
      },
      ingredients: [
        '4 slices of bread',
        '2 eggs',
        '1/2 cup milk',
        '1 tsp cinnamon'
      ],
      steps: [
        'Whisk eggs and milk together',
        'Dip bread slices in mixture',
        'Cook until golden brown'
      ],
      tools: [
        { name: 'Mixing bowl' },
        { name: 'Whisk' },
        { name: 'Skillet' }
      ],
      seasonal: [
        { title: 'breakfast' },
        { title: 'brunch' }
      ]
    }

    it('should generate complete recipe schema with all fields', () => {
      applyRecipeSchema(mockRecipe)

      const schemaEl = mockHead.children.find(
        child => child.id === 'structured-data'
      )
      expect(schemaEl).toBeDefined()
      expect(schemaEl.type).toBe('application/ld+json')

      const schema = JSON.parse(schemaEl.textContent)
      expect(schema['@context']).toBe('https://schema.org/')
      expect(schema['@type']).toBe('Recipe')
      expect(schema.name).toBe('French Toast Supreme')
      expect(schema.description).toBe('Fluffy French toast with a crispy exterior')
    })

    it('should include recipe ingredients and steps', () => {
      applyRecipeSchema(mockRecipe)

      const schemaEl = mockHead.children.find(
        child => child.id === 'structured-data'
      )
      const schema = JSON.parse(schemaEl.textContent)

      expect(schema.recipeIngredient).toEqual(mockRecipe.ingredients)
      expect(schema.recipeInstructions).toHaveLength(3)
      expect(schema.recipeInstructions[0]).toEqual({
        '@type': 'HowToStep',
        text: 'Whisk eggs and milk together'
      })
      expect(schema.recipeInstructions[2]).toEqual({
        '@type': 'HowToStep',
        text: 'Cook until golden brown'
      })
    })

    it('should handle missing optional fields (times, tools, seasonal)', () => {
      const minimalRecipe = {
        title: 'Simple Recipe',
        ingredients: ['Ingredient 1'],
        steps: ['Step 1']
      }

      applyRecipeSchema(minimalRecipe)

      const schemaEl = mockHead.children.find(
        child => child.id === 'structured-data'
      )
      const schema = JSON.parse(schemaEl.textContent)

      expect(schema.name).toBe('Simple Recipe')
      expect(schema.prepTime).toBeUndefined()
      expect(schema.cookTime).toBeUndefined()
      expect(schema.totalTime).toBeUndefined()
      expect(schema.tool).toBeUndefined()
      expect(schema.keywords).toEqual([])
    })

    it('should convert time strings to ISO duration (PT30M format)', () => {
      applyRecipeSchema(mockRecipe)

      const schemaEl = mockHead.children.find(
        child => child.id === 'structured-data'
      )
      const schema = JSON.parse(schemaEl.textContent)

      expect(schema.prepTime).toBe('PT10M')
      expect(schema.cookTime).toBe('PT20M')
      expect(schema.totalTime).toBe('PT30M')
    })

    it('should normalize image URLs to absolute', () => {
      applyRecipeSchema(mockRecipe)

      const schemaEl = mockHead.children.find(
        child => child.id === 'structured-data'
      )
      const schema = JSON.parse(schemaEl.textContent)

      expect(schema.image).toBe(
        'https://sundaybrunchwithgiselle.com/images/french-toast.jpg'
      )
    })

    it('should validate schema structure (JSON-LD format)', () => {
      applyRecipeSchema(mockRecipe)

      const schemaEl = mockHead.children.find(
        child => child.id === 'structured-data'
      )
      const schema = JSON.parse(schemaEl.textContent)

      // Verify JSON-LD required fields
      expect(schema).toHaveProperty('@context')
      expect(schema).toHaveProperty('@type')

      // Verify Recipe-specific fields
      expect(schema).toHaveProperty('name')
      expect(schema).toHaveProperty('recipeIngredient')
      expect(schema).toHaveProperty('recipeInstructions')
      expect(schema).toHaveProperty('recipeYield')

      // Verify tools are extracted correctly
      expect(schema.tool).toEqual(['Mixing bowl', 'Whisk', 'Skillet'])

      // Verify keywords from seasonal
      expect(schema.keywords).toEqual(['breakfast', 'brunch'])
    })

    it('should handle null recipe gracefully', () => {
      applyRecipeSchema(null)

      const schemaEl = mockHead.children.find(
        child => child.id === 'structured-data'
      )
      expect(schemaEl).toBeUndefined()
    })

    it('should use story as fallback description', () => {
      const recipeWithoutMetaDesc = {
        title: 'Recipe Title',
        story: ['This is the story'],
        ingredients: ['Ingredient 1'],
        steps: ['Step 1']
      }

      applyRecipeSchema(recipeWithoutMetaDesc)

      const schemaEl = mockHead.children.find(
        child => child.id === 'structured-data'
      )
      const schema = JSON.parse(schemaEl.textContent)

      expect(schema.description).toBe('This is the story')
    })

    it('should handle invalid time strings gracefully', () => {
      const recipeWithInvalidTimes = {
        ...mockRecipe,
        times: {
          prep: 'invalid time',
          cook: '20 min',
          total: 'also invalid'
        }
      }

      applyRecipeSchema(recipeWithInvalidTimes)

      const schemaEl = mockHead.children.find(
        child => child.id === 'structured-data'
      )
      const schema = JSON.parse(schemaEl.textContent)

      expect(schema.prepTime).toBeUndefined()
      expect(schema.cookTime).toBe('PT20M')
      expect(schema.totalTime).toBeUndefined()
    })
  })

  describe('applyEpisodeSchema()', () => {
    const mockEpisode = {
      title: 'Episode 1: The Perfect Pancake',
      slug: 'perfect-pancake',
      meta: {
        description: 'Join Giselle as she makes the perfect pancake'
      },
      audioUrl: 'https://cdn.example.com/episodes/episode-1.mp3'
    }

    it('should generate complete episode schema with all fields', () => {
      applyEpisodeSchema(mockEpisode)

      const schemaEl = mockHead.children.find(
        child => child.id === 'structured-data'
      )
      expect(schemaEl).toBeDefined()
      expect(schemaEl.type).toBe('application/ld+json')

      const schema = JSON.parse(schemaEl.textContent)
      expect(schema['@context']).toBe('https://schema.org/')
      expect(schema['@type']).toBe('PodcastEpisode')
      expect(schema.name).toBe('Episode 1: The Perfect Pancake')
      expect(schema.description).toBe('Join Giselle as she makes the perfect pancake')
      expect(schema.url).toBe(
        'https://sundaybrunchwithgiselle.com/episodes/perfect-pancake'
      )
    })

    it('should include audio object when audioUrl is provided', () => {
      applyEpisodeSchema(mockEpisode)

      const schemaEl = mockHead.children.find(
        child => child.id === 'structured-data'
      )
      const schema = JSON.parse(schemaEl.textContent)

      expect(schema.associatedMedia).toEqual({
        '@type': 'AudioObject',
        contentUrl: 'https://cdn.example.com/episodes/episode-1.mp3'
      })
    })

    it('should handle missing audioUrl gracefully', () => {
      const episodeWithoutAudio = {
        ...mockEpisode,
        audioUrl: undefined
      }

      applyEpisodeSchema(episodeWithoutAudio)

      const schemaEl = mockHead.children.find(
        child => child.id === 'structured-data'
      )
      const schema = JSON.parse(schemaEl.textContent)

      expect(schema.associatedMedia).toBeUndefined()
    })

    it('should handle null episode gracefully', () => {
      applyEpisodeSchema(null)

      const schemaEl = mockHead.children.find(
        child => child.id === 'structured-data'
      )
      expect(schemaEl).toBeUndefined()
    })

    it('should update existing schema script instead of creating duplicates', () => {
      // First call with recipe
      const mockRecipe = {
        title: 'Recipe',
        ingredients: ['Ingredient 1'],
        steps: ['Step 1']
      }
      applyRecipeSchema(mockRecipe)
      const firstLength = mockHead.children.length

      // Second call with episode should update, not duplicate
      applyEpisodeSchema(mockEpisode)

      expect(mockHead.children.length).toBe(firstLength)

      const schemaEl = mockHead.children.find(
        child => child.id === 'structured-data'
      )
      const schema = JSON.parse(schemaEl.textContent)

      // Should have episode schema, not recipe
      expect(schema['@type']).toBe('PodcastEpisode')
    })
  })
})
