/**
 * Tests for Rating API Functions
 *
 * These tests verify the rating submission, retrieval, and aggregation
 * functionality for recipe ratings stored in Supabase.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as ratingsModule from './ratings'

// Mock Supabase client
vi.mock('./supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn()
    },
    from: vi.fn()
  }
}))

// Import the mocked supabase to access mocks
import { supabase as mockSupabaseClient } from './supabase'

describe('Rating API Functions', () => {
  let submitRating
  let getUserRating
  let getRecipeRatings
  let deleteRating

  beforeEach(async () => {
    // Import fresh module for each test
    const module = await import('./ratings')
    submitRating = module.submitRating
    getUserRating = module.getUserRating
    getRecipeRatings = module.getRecipeRatings
    deleteRating = module.deleteRating

    // Clear all mocks
    vi.clearAllMocks()
  })

  describe('submitRating', () => {
    it('should submit a new rating successfully', async () => {
      // Arrange
      const mockUser = { id: 'user-123', email: 'test@example.com' }
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      const mockRating = {
        id: 'rating-123',
        recipe_slug: 'chocolate-chip-cookies',
        user_id: 'user-123',
        rating: 5,
        created_at: '2024-01-13T10:00:00Z',
        updated_at: '2024-01-13T10:00:00Z'
      }

      mockSupabaseClient.from.mockReturnValue({
        upsert: vi.fn().mockResolvedValue({
          data: mockRating,
          error: null
        })
      })

      // Act
      const result = await submitRating('chocolate-chip-cookies', 5)

      // Assert
      expect(result.data).toEqual(mockRating)
      expect(result.error).toBeNull()
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('ratings')
    })

    it('should update existing rating', async () => {
      // Arrange
      const mockUser = { id: 'user-123', email: 'test@example.com' }
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      const mockUpdatedRating = {
        id: 'rating-123',
        recipe_slug: 'chocolate-chip-cookies',
        user_id: 'user-123',
        rating: 4,
        created_at: '2024-01-13T10:00:00Z',
        updated_at: '2024-01-13T11:00:00Z'
      }

      mockSupabaseClient.from.mockReturnValue({
        upsert: vi.fn().mockResolvedValue({
          data: mockUpdatedRating,
          error: null
        })
      })

      // Act
      const result = await submitRating('chocolate-chip-cookies', 4)

      // Assert
      expect(result.data).toEqual(mockUpdatedRating)
      expect(result.error).toBeNull()
    })

    it('should return error when user is not authenticated', async () => {
      // Arrange
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null
      })

      // Act
      const result = await submitRating('chocolate-chip-cookies', 5)

      // Assert
      expect(result.data).toBeNull()
      expect(result.error).toEqual({ message: 'User must be authenticated to rate recipes' })
    })

    it('should return error for invalid rating value', async () => {
      // Arrange
      const mockUser = { id: 'user-123', email: 'test@example.com' }
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      // Act
      const result = await submitRating('chocolate-chip-cookies', 6)

      // Assert
      expect(result.data).toBeNull()
      expect(result.error).toEqual({ message: 'Rating must be between 1 and 5' })
    })

    it('should return error for rating value 0', async () => {
      // Arrange
      const mockUser = { id: 'user-123', email: 'test@example.com' }
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      // Act
      const result = await submitRating('chocolate-chip-cookies', 0)

      // Assert
      expect(result.data).toBeNull()
      expect(result.error).toEqual({ message: 'Rating must be between 1 and 5' })
    })

    it('should handle database errors', async () => {
      // Arrange
      const mockUser = { id: 'user-123', email: 'test@example.com' }
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      const dbError = { message: 'Database connection failed' }
      mockSupabaseClient.from.mockReturnValue({
        upsert: vi.fn().mockResolvedValue({
          data: null,
          error: dbError
        })
      })

      // Act
      const result = await submitRating('chocolate-chip-cookies', 5)

      // Assert
      expect(result.data).toBeNull()
      expect(result.error).toEqual(dbError)
    })
  })

  describe('getUserRating', () => {
    it('should get user rating for a recipe', async () => {
      // Arrange
      const mockUser = { id: 'user-123', email: 'test@example.com' }
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      const mockRating = {
        id: 'rating-123',
        recipe_slug: 'chocolate-chip-cookies',
        user_id: 'user-123',
        rating: 5,
        created_at: '2024-01-13T10:00:00Z',
        updated_at: '2024-01-13T10:00:00Z'
      }

      const mockEq = vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: mockRating,
          error: null
        })
      })

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: mockEq
          })
        })
      })

      // Act
      const result = await getUserRating('chocolate-chip-cookies')

      // Assert
      expect(result.data).toEqual(mockRating)
      expect(result.error).toBeNull()
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('ratings')
    })

    it('should return null when user has not rated recipe', async () => {
      // Arrange
      const mockUser = { id: 'user-123', email: 'test@example.com' }
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      const mockEq = vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116', message: 'No rows found' }
        })
      })

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: mockEq
          })
        })
      })

      // Act
      const result = await getUserRating('chocolate-chip-cookies')

      // Assert
      expect(result.data).toBeNull()
      expect(result.error).toBeNull()
    })

    it('should return error when user is not authenticated', async () => {
      // Arrange
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null
      })

      // Act
      const result = await getUserRating('chocolate-chip-cookies')

      // Assert
      expect(result.data).toBeNull()
      expect(result.error).toEqual({ message: 'User must be authenticated' })
    })
  })

  describe('getRecipeRatings', () => {
    it('should get aggregated ratings for a recipe', async () => {
      // Arrange
      const mockAggregation = {
        recipe_slug: 'chocolate-chip-cookies',
        average_rating: 4.5,
        rating_count: 128
      }

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockAggregation,
              error: null
            })
          })
        })
      })

      // Act
      const result = await getRecipeRatings('chocolate-chip-cookies')

      // Assert
      expect(result.data).toEqual(mockAggregation)
      expect(result.error).toBeNull()
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('recipe_ratings')
    })

    it('should return zero ratings when recipe has no ratings', async () => {
      // Arrange
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116', message: 'No rows found' }
            })
          })
        })
      })

      // Act
      const result = await getRecipeRatings('new-recipe')

      // Assert
      expect(result.data).toEqual({
        recipe_slug: 'new-recipe',
        average_rating: 0,
        rating_count: 0
      })
      expect(result.error).toBeNull()
    })

    it('should handle database errors', async () => {
      // Arrange
      const dbError = { message: 'Database connection failed', code: 'PGRST500' }
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: dbError
            })
          })
        })
      })

      // Act
      const result = await getRecipeRatings('chocolate-chip-cookies')

      // Assert - Gracefully returns fallback data instead of error
      expect(result.data).toEqual({
        recipe_slug: 'chocolate-chip-cookies',
        average_rating: 0,
        rating_count: 0
      })
      expect(result.error).toBeNull()
    })
  })

  describe('deleteRating', () => {
    it('should delete user rating successfully', async () => {
      // Arrange
      const mockUser = { id: 'user-123', email: 'test@example.com' }
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      const mockEq = vi.fn().mockResolvedValue({
        data: { id: 'rating-123' },
        error: null
      })

      mockSupabaseClient.from.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: mockEq
          })
        })
      })

      // Act
      const result = await deleteRating('chocolate-chip-cookies')

      // Assert
      expect(result.data).toBeTruthy()
      expect(result.error).toBeNull()
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('ratings')
    })

    it('should return error when user is not authenticated', async () => {
      // Arrange
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null
      })

      // Act
      const result = await deleteRating('chocolate-chip-cookies')

      // Assert
      expect(result.data).toBeNull()
      expect(result.error).toEqual({ message: 'User must be authenticated' })
    })

    it('should handle database errors', async () => {
      // Arrange
      const mockUser = { id: 'user-123', email: 'test@example.com' }
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      const dbError = { message: 'Database connection failed' }
      const mockEq = vi.fn().mockResolvedValue({
        data: null,
        error: dbError
      })

      mockSupabaseClient.from.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: mockEq
          })
        })
      })

      // Act
      const result = await deleteRating('chocolate-chip-cookies')

      // Assert
      expect(result.data).toBeNull()
      expect(result.error).toEqual(dbError)
    })
  })
})
