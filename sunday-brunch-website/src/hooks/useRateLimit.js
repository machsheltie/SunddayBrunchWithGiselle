import { useCallback, useRef } from 'react'

/**
 * Custom hook for implementing rate limiting with exponential backoff
 *
 * @param {Object} config - Rate limiting configuration
 * @param {number} config.maxAttempts - Maximum attempts before lockout (default: 5)
 * @param {number} config.windowMs - Time window in milliseconds (default: 15 min)
 * @param {number[]} config.backoffMs - Backoff delays in ms for each attempt (default: exponential)
 * @returns {Object} Rate limiting functions
 */
export function useRateLimit({
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000, // 15 minutes
  backoffMs = [1000, 2000, 5000, 10000, 30000] // Exponential backoff
} = {}) {
  // Store attempts per action in a ref (persists across renders)
  const attemptsRef = useRef(new Map())

  /**
   * Check if an action is rate limited
   * @param {string} action - Action identifier (e.g., 'signin', 'signup')
   * @returns {boolean} - True if action is allowed, false if rate limited
   */
  const checkRateLimit = useCallback((action) => {
    const now = Date.now()
    const attemptData = attemptsRef.current.get(action) || {
      count: 0,
      firstAttempt: now,
      lastAttempt: now,
      lockedUntil: null
    }

    // Check if currently locked out
    if (attemptData.lockedUntil && now < attemptData.lockedUntil) {
      const remainingMs = attemptData.lockedUntil - now
      const remainingMin = Math.ceil(remainingMs / 60000)
      throw new Error(`Too many attempts. Please try again in ${remainingMin} minute${remainingMin > 1 ? 's' : ''}.`)
    }

    // Check if window has expired (reset counter)
    if (now - attemptData.firstAttempt > windowMs) {
      attemptsRef.current.set(action, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
        lockedUntil: null
      })
      return true
    }

    // Check if max attempts reached
    if (attemptData.count >= maxAttempts) {
      const lockoutDuration = backoffMs[Math.min(attemptData.count - maxAttempts, backoffMs.length - 1)]
      const lockedUntil = now + lockoutDuration

      attemptsRef.current.set(action, {
        ...attemptData,
        lockedUntil
      })

      const remainingMin = Math.ceil(lockoutDuration / 60000)
      throw new Error(`Too many attempts. Please try again in ${remainingMin} minute${remainingMin > 1 ? 's' : ''}.`)
    }

    // Increment attempt count
    attemptsRef.current.set(action, {
      ...attemptData,
      count: attemptData.count + 1,
      lastAttempt: now
    })

    return true
  }, [maxAttempts, windowMs, backoffMs])

  /**
   * Reset rate limit for an action (call on successful operation)
   * @param {string} action - Action identifier
   */
  const resetRateLimit = useCallback((action) => {
    attemptsRef.current.delete(action)
  }, [])

  /**
   * Get current rate limit status for an action
   * @param {string} action - Action identifier
   * @returns {Object} Status with remaining attempts and lockout info
   */
  const getRateLimitStatus = useCallback((action) => {
    const now = Date.now()
    const attemptData = attemptsRef.current.get(action)

    if (!attemptData) {
      return {
        remaining: maxAttempts,
        isLocked: false,
        lockedUntil: null
      }
    }

    const isLocked = attemptData.lockedUntil && now < attemptData.lockedUntil
    const remaining = Math.max(0, maxAttempts - attemptData.count)

    return {
      remaining,
      isLocked,
      lockedUntil: attemptData.lockedUntil
    }
  }, [maxAttempts])

  return {
    checkRateLimit,
    resetRateLimit,
    getRateLimitStatus
  }
}
