/**
 * Web Vitals Performance Monitoring
 *
 * Tracks Core Web Vitals metrics and sends them to analytics:
 * - LCP (Largest Contentful Paint): <2.5s good, <4s needs improvement
 * - INP (Interaction to Next Paint): <200ms good, <500ms needs improvement
 * - CLS (Cumulative Layout Shift): <0.1 good, <0.25 needs improvement
 * - FCP (First Contentful Paint): <1.8s good, <3s needs improvement
 * - TTFB (Time to First Byte): <800ms good, <1800ms needs improvement
 *
 * Note: INP replaced FID (First Input Delay) in web-vitals v3+
 */

import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'
import { trackEvent } from './analytics'

/**
 * Performance thresholds based on Google's Core Web Vitals recommendations
 */
const THRESHOLDS = {
    LCP: { good: 2500, needsImprovement: 4000 },
    INP: { good: 200, needsImprovement: 500 },
    CLS: { good: 0.1, needsImprovement: 0.25 },
    FCP: { good: 1800, needsImprovement: 3000 },
    TTFB: { good: 800, needsImprovement: 1800 }
}

/**
 * Determine rating based on metric value and thresholds
 */
function getRating(name, value) {
    const threshold = THRESHOLDS[name]
    if (!threshold) return 'unknown'

    if (value <= threshold.good) return 'good'
    if (value <= threshold.needsImprovement) return 'needs-improvement'
    return 'poor'
}

/**
 * Send metric to analytics
 */
function sendToAnalytics({ name, value, rating, delta, id }) {
    const customRating = getRating(name, value)

    trackEvent('web_vitals', {
        metric_name: name,
        metric_value: Math.round(name === 'CLS' ? value * 1000 : value), // CLS is already a score
        metric_rating: customRating,
        metric_delta: Math.round(delta),
        metric_id: id,
        // Additional context
        connection_type: navigator.connection?.effectiveType || 'unknown',
        device_memory: navigator.deviceMemory || 'unknown',
        page_path: window.location.pathname
    })

    // Log in development for debugging
    if (import.meta.env.DEV) {
        console.debug(`[Web Vitals] ${name}:`, {
            value: Math.round(value),
            rating: customRating,
            threshold: THRESHOLDS[name]
        })
    }
}

/**
 * Initialize Web Vitals monitoring
 * Call this once in your app initialization (e.g., App.jsx)
 */
export function initWebVitals() {
    // Only run in browser (not during SSR)
    if (typeof window === 'undefined') return

    try {
        // Track Core Web Vitals
        onCLS(sendToAnalytics)
        onINP(sendToAnalytics)
        onLCP(sendToAnalytics)

        // Track additional metrics
        onFCP(sendToAnalytics)
        onTTFB(sendToAnalytics)

        if (import.meta.env.DEV) {
            console.debug('[Web Vitals] Monitoring initialized')
        }
    } catch (error) {
        console.error('[Web Vitals] Failed to initialize:', error)
    }
}

/**
 * Get current performance metrics (useful for debugging)
 */
export function getPerformanceMetrics() {
    if (typeof window === 'undefined' || !window.performance) {
        return null
    }

    const navigation = performance.getEntriesByType('navigation')[0]
    const paint = performance.getEntriesByType('paint')

    return {
        // Navigation timing
        dns: navigation?.domainLookupEnd - navigation?.domainLookupStart,
        tcp: navigation?.connectEnd - navigation?.connectStart,
        ttfb: navigation?.responseStart - navigation?.requestStart,
        download: navigation?.responseEnd - navigation?.responseStart,
        domInteractive: navigation?.domInteractive,
        domComplete: navigation?.domComplete,
        loadComplete: navigation?.loadEventEnd,

        // Paint timing
        fcp: paint?.find(entry => entry.name === 'first-contentful-paint')?.startTime,

        // Resource timing
        totalResources: performance.getEntriesByType('resource').length
    }
}
