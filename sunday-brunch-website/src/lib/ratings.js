/**
 * Rating API Functions
 *
 * This module provides functions for managing recipe ratings in Supabase.
 * All rating operations require user authentication.
 *
 * Database Tables:
 * - ratings: Individual user ratings (recipe_slug, user_id, rating)
 * - recipe_ratings: Materialized view with aggregated ratings (average, count)
 */

import { supabase } from './supabase'
import { getRecipeBySlug } from './content'
import { createLogger } from './logger'

const logger = createLogger('Ratings')

/**
 * Database availability cache
 * Prevents repeated failed requests when database tables don't exist
 */
let dbAvailabilityCache = null
let dbAvailabilityChecked = false

/**
 * Reset database availability cache (for testing purposes)
 * @internal
 */
export function _resetDbAvailabilityCache() {
  dbAvailabilityCache = null
  dbAvailabilityChecked = false
}

/**
 * Check if the ratings database tables are available
 *
 * Performs a lightweight query to check if the required tables exist.
 * Caches the result to avoid repeated failed requests.
 *
 * @returns {Promise<boolean>} True if database is available, false otherwise
 */
async function isDatabaseAvailable() {
  // Return cached result if already checked
  if (dbAvailabilityChecked) {
    return dbAvailabilityCache
  }

  try {
    // Try a lightweight query to check if tables exist
    const { error } = await supabase
      .from('recipe_ratings')
      .select('recipe_slug')
      .limit(1)

    // If no error or only "no rows" error, database is available
    if (!error || error.code === 'PGRST116') {
      dbAvailabilityCache = true
    } else {
      // Any other error means tables don't exist or aren't accessible
      dbAvailabilityCache = false
    }
  } catch (error) {
    dbAvailabilityCache = false
  }

  dbAvailabilityChecked = true
  return dbAvailabilityCache
}

/**
 * Submit or update a rating for a recipe
 *
 * Uses upsert to handle both new ratings and updates to existing ratings.
 * The unique constraint (recipe_slug, user_id) ensures one rating per user per recipe.
 *
 * @param {string} recipeSlug - Recipe identifier (e.g., 'chocolate-chip-cookies')
 * @param {number} rating - Rating value (1-5)
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 *
 * @example
 * const { data, error } = await submitRating('chocolate-chip-cookies', 5)
 * if (error) {
 *   console.error('Failed to submit rating:', error.message)
 * } else {
 *   console.log('Rating submitted:', data.rating)
 * }
 */
export async function submitRating(recipeSlug, rating) {
  try {
    // Validate rating value
    if (rating < 1 || rating > 5) {
      return {
        data: null,
        error: { message: 'Rating must be between 1 and 5' }
      }
    }

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        data: null,
        error: { message: 'User must be authenticated to rate recipes' }
      }
    }

    // Upsert rating (insert or update if exists)
    const { data, error } = await supabase
      .from('ratings')
      .upsert(
        {
          recipe_slug: recipeSlug,
          user_id: user.id,
          rating: rating,
          updated_at: new Date().toISOString()
        },
        {
          onConflict: 'recipe_slug,user_id',
          returning: 'representation'
        }
      )

    return { data, error }
  } catch (error) {
    return {
      data: null,
      error: { message: error.message }
    }
  }
}

/**
 * Get the current user's rating for a recipe
 *
 * Returns null if the user has not rated the recipe yet.
 *
 * @param {string} recipeSlug - Recipe identifier
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 *
 * @example
 * const { data, error } = await getUserRating('chocolate-chip-cookies')
 * if (data) {
 *   console.log('Your rating:', data.rating)
 * } else {
 *   console.log('You have not rated this recipe yet')
 * }
 */
export async function getUserRating(recipeSlug) {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        data: null,
        error: { message: 'User must be authenticated' }
      }
    }

    // Get user's rating for this recipe
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('recipe_slug', recipeSlug)
      .eq('user_id', user.id)
      .single()

    // Handle "no rows found" as success with null data
    if (error && error.code === 'PGRST116') {
      return { data: null, error: null }
    }

    return { data, error }
  } catch (error) {
    return {
      data: null,
      error: { message: error.message }
    }
  }
}

/**
 * Get aggregated ratings for a recipe
 *
 * Returns average rating and total count from the recipe_ratings view.
 * If no ratings exist, returns zeros instead of an error.
 * Gracefully handles missing database tables (development mode).
 *
 * @param {string} recipeSlug - Recipe identifier
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 *
 * @example
 * const { data, error } = await getRecipeRatings('chocolate-chip-cookies')
 * if (data) {
 *   console.log(`Average: ${data.average_rating} (${data.rating_count} ratings)`)
 * }
 */
export async function getRecipeRatings(recipeSlug) {
  try {
    // Check database availability first - skip request if unavailable
    const dbAvailable = await isDatabaseAvailable()
    if (!dbAvailable) {
      // Return fallback data without making HTTP request
      return {
        data: {
          recipe_slug: recipeSlug,
          average_rating: 0,
          rating_count: 0
        },
        error: null
      }
    }

    // Query the recipe_ratings materialized view
    const { data, error } = await supabase
      .from('recipe_ratings')
      .select('*')
      .eq('recipe_slug', recipeSlug)
      .single()

    // Handle "no rows found" - recipe has no ratings yet
    if (error && error.code === 'PGRST116') {
      return {
        data: {
          recipe_slug: recipeSlug,
          average_rating: 0,
          rating_count: 0
        },
        error: null
      }
    }

    // Handle other errors - graceful fallback
    if (error) {
      return {
        data: {
          recipe_slug: recipeSlug,
          average_rating: 0,
          rating_count: 0
        },
        error: null
      }
    }

    return { data, error }
  } catch (error) {
    return {
      data: {
        recipe_slug: recipeSlug,
        average_rating: 0,
        rating_count: 0
      },
      error: null
    }
  }
}

/**
 * Delete the current user's rating for a recipe
 *
 * Removes the user's rating from the database.
 *
 * @param {string} recipeSlug - Recipe identifier
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 *
 * @example
 * const { data, error } = await deleteRating('chocolate-chip-cookies')
 * if (error) {
 *   console.error('Failed to delete rating:', error.message)
 * } else {
 *   console.log('Rating deleted successfully')
 * }
 */
export async function deleteRating(recipeSlug) {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        data: null,
        error: { message: 'User must be authenticated' }
      }
    }

    // Delete user's rating for this recipe
    const { data, error } = await supabase
      .from('ratings')
      .delete()
      .eq('recipe_slug', recipeSlug)
      .eq('user_id', user.id)

    return { data, error }
  } catch (error) {
    return {
      data: null,
      error: { message: error.message }
    }
  }
}

/**
 * Get recent high-rated reviews with comments for social proof section
 *
 * Fetches reviews with ratings >= minRating that include text comments,
 * enriched with recipe data (title, slug, image). Returns empty array
 * if database query fails or no reviews exist.
 * Gracefully handles missing database tables or missing columns (development mode).
 *
 * @param {number} limit - Number of reviews to return (default: 4)
 * @param {number} minRating - Minimum rating to include (default: 5)
 * @returns {Promise<Array>} Array of enriched review objects
 *
 * @example
 * const reviews = await getRecentHighRatedReviews(4, 5)
 * reviews.forEach(review => {
 *   console.log(`${review.user_name} rated ${review.recipeTitle}: ${review.rating} stars`)
 *   console.log(`Comment: ${review.comment}`)
 * })
 */
export async function getRecentHighRatedReviews(limit = 4, minRating = 5) {
  try {
    // Check database availability first - skip request if unavailable
    const dbAvailable = await isDatabaseAvailable()
    if (!dbAvailable) {
      // Return empty array without making HTTP request
      return []
    }

    // Fetch high-rated reviews with comments
    const { data: reviews, error } = await supabase
      .from('ratings')
      .select('*')
      .gte('rating', minRating)
      .not('comment', 'is', null) // Only reviews with comments
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      // Return empty array on error (no logging needed)
      return []
    }

    // Handle case where no reviews exist yet
    if (!reviews || reviews.length === 0) {
      return []
    }

    // Enrich with recipe data (title, slug, image)
    const enriched = await Promise.all(
      reviews.map(async (review) => {
        const recipe = await getRecipeBySlug(review.recipe_slug)
        return {
          ...review,
          recipeTitle: recipe?.title || 'Unknown Recipe',
          recipeSlug: recipe?.slug,
          recipeImage: recipe?.image
        }
      })
    )

    // Remove any reviews where recipe enrichment failed
    return enriched.filter(r => r.recipeSlug)
  } catch (error) {
    return []
  }
}
