import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { initWebVitals, getPerformanceMetrics } from '../../lib/webVitals'

// Mock web-vitals package
vi.mock('web-vitals', () => ({
    onCLS: vi.fn(),
    onINP: vi.fn(),
    onLCP: vi.fn(),
    onFCP: vi.fn(),
    onTTFB: vi.fn()
}))

// Mock analytics module
vi.mock('../../lib/analytics', () => ({
    trackEvent: vi.fn()
}))

// Import mocked modules after vi.mock calls
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals'
import { trackEvent } from '../../lib/analytics'

describe('Web Vitals Service', () => {
    let consoleDebugSpy
    let consoleErrorSpy
    let originalWindow
    let originalNavigator
    let originalMode
    let originalDev

    beforeEach(() => {
        // Save originals
        originalWindow = global.window
        originalNavigator = global.navigator
        originalMode = import.meta.env.MODE
        originalDev = import.meta.env.DEV

        // Set up browser environment
        global.window = {
            location: { pathname: '/test-page' },
            performance: {
                getEntriesByType: vi.fn()
            }
        }

        global.navigator = {
            connection: { effectiveType: '4g' },
            deviceMemory: 8
        }

        // Set environment to development for console.debug calls
        import.meta.env.MODE = 'development'
        import.meta.env.DEV = true

        // Mock console methods
        consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

        // Clear all mocks AND reset mock implementations to prevent cross-test pollution
        vi.clearAllMocks()

        // Reset web-vitals mocks to default (no-op)
        onCLS.mockImplementation(() => {})
        onINP.mockImplementation(() => {})
        onLCP.mockImplementation(() => {})
        onFCP.mockImplementation(() => {})
        onTTFB.mockImplementation(() => {})
    })

    afterEach(() => {
        // Restore originals
        global.window = originalWindow
        global.navigator = originalNavigator
        import.meta.env.MODE = originalMode
        import.meta.env.DEV = originalDev

        // Restore console mocks
        vi.restoreAllMocks()
    })

    describe('initWebVitals()', () => {
        it('should initialize all metric listeners (onCLS, onINP, onLCP, onFCP, onTTFB)', () => {
            // Act
            initWebVitals()

            // Assert
            expect(onCLS).toHaveBeenCalledTimes(1)
            expect(onINP).toHaveBeenCalledTimes(1)
            expect(onLCP).toHaveBeenCalledTimes(1)
            expect(onFCP).toHaveBeenCalledTimes(1)
            expect(onTTFB).toHaveBeenCalledTimes(1)
        })

        it('should send metrics to analytics via trackEvent when callback is invoked', () => {
            // Arrange
            const mockMetric = {
                name: 'LCP',
                value: 2000,
                rating: 'good',
                delta: 2000,
                id: 'v3-123456'
            }

            // Setup onLCP to call the callback immediately
            onLCP.mockImplementation(callback => callback(mockMetric))

            // Act
            initWebVitals()

            // Assert - trackEvent should be called with web_vitals event
            expect(trackEvent).toHaveBeenCalledWith('web_vitals', {
                metric_name: 'LCP',
                metric_value: 2000,
                metric_rating: 'good',
                metric_delta: 2000,
                metric_id: 'v3-123456',
                connection_type: '4g',
                device_memory: 8,
                page_path: '/test-page'
            })
        })

        it('should handle errors gracefully with try/catch', () => {
            // Arrange - Make onCLS throw an error
            onCLS.mockImplementation(() => {
                throw new Error('Web vitals initialization failed')
            })

            // Act
            initWebVitals()

            // Assert - Error should be caught and logged
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                '[Web Vitals] Failed to initialize:',
                expect.any(Error)
            )
        })

        it('should only run in browser (not SSR - typeof window check)', () => {
            // Arrange - Simulate SSR environment
            delete global.window

            // Act
            initWebVitals()

            // Assert - No web vitals listeners should be initialized
            expect(onCLS).not.toHaveBeenCalled()
            expect(onINP).not.toHaveBeenCalled()
            expect(onLCP).not.toHaveBeenCalled()
            expect(onFCP).not.toHaveBeenCalled()
            expect(onTTFB).not.toHaveBeenCalled()
        })

        it('should include connection type and device memory in analytics payload', () => {
            // Arrange
            global.navigator = {
                connection: { effectiveType: '3g' },
                deviceMemory: 4
            }

            const mockMetric = {
                name: 'INP',
                value: 50,
                rating: 'good',
                delta: 50,
                id: 'v3-fid-123'
            }

            onINP.mockImplementation(callback => callback(mockMetric))

            // Act
            initWebVitals()

            // Assert
            expect(trackEvent).toHaveBeenCalledWith('web_vitals', expect.objectContaining({
                connection_type: '3g',
                device_memory: 4
            }))
        })

        it('should handle missing navigator.connection gracefully', () => {
            // Arrange
            global.navigator = {} // No connection property

            const mockMetric = {
                name: 'CLS',
                value: 0.05,
                rating: 'good',
                delta: 0.05,
                id: 'v3-cls-123'
            }

            onCLS.mockImplementation(callback => callback(mockMetric))

            // Act
            initWebVitals()

            // Assert
            expect(trackEvent).toHaveBeenCalledWith('web_vitals', expect.objectContaining({
                connection_type: 'unknown',
                device_memory: 'unknown'
            }))
        })

        it('should log debug message in development mode', () => {
            // Act
            initWebVitals()

            // Assert
            expect(consoleDebugSpy).toHaveBeenCalledWith('[Web Vitals] Monitoring initialized')
        })

        it('should handle CLS metric with value multiplication by 1000', () => {
            // Arrange
            const mockMetric = {
                name: 'CLS',
                value: 0.05,
                rating: 'good',
                delta: 0.03,
                id: 'v3-cls-456'
            }

            onCLS.mockImplementation(callback => callback(mockMetric))

            // Act
            initWebVitals()

            // Assert - CLS value should be multiplied by 1000, delta is just rounded
            expect(trackEvent).toHaveBeenCalledWith('web_vitals', expect.objectContaining({
                metric_name: 'CLS',
                metric_value: 50, // 0.05 * 1000 = 50
                metric_delta: 0 // Math.round(0.03) = 0
            }))
        })
    })

    describe('getRating() - implicit testing through sendToAnalytics', () => {
        it('should return "unknown" for unrecognized metric names', () => {
            // Arrange - Create a custom metric with unrecognized name
            const mockMetric = {
                name: 'UNKNOWN_METRIC',
                value: 1000,
                rating: 'good',
                delta: 1000,
                id: 'v3-unknown'
            }

            // Mock onLCP to use it as a vehicle to test the unknown metric
            onLCP.mockImplementation(callback => callback(mockMetric))

            // Act
            initWebVitals()

            // Assert - Should have 'unknown' rating
            expect(trackEvent).toHaveBeenCalledWith('web_vitals', expect.objectContaining({
                metric_name: 'UNKNOWN_METRIC',
                metric_rating: 'unknown'
            }))
        })

        it('should return "good" for values within good threshold (LCP <= 2500)', () => {
            // Arrange
            const mockMetric = {
                name: 'LCP',
                value: 2000, // Good threshold
                rating: 'good',
                delta: 2000,
                id: 'v3-lcp-good'
            }

            onLCP.mockImplementation(callback => callback(mockMetric))

            // Act
            initWebVitals()

            // Assert
            expect(trackEvent).toHaveBeenCalledWith('web_vitals', expect.objectContaining({
                metric_rating: 'good'
            }))
        })

        it('should return "needs-improvement" for values in middle range (LCP 2500-4000)', () => {
            // Arrange
            const mockMetric = {
                name: 'LCP',
                value: 3000, // Needs improvement threshold
                rating: 'needs-improvement',
                delta: 3000,
                id: 'v3-lcp-mid'
            }

            onLCP.mockImplementation(callback => callback(mockMetric))

            // Act
            initWebVitals()

            // Assert
            expect(trackEvent).toHaveBeenCalledWith('web_vitals', expect.objectContaining({
                metric_rating: 'needs-improvement'
            }))
        })

        it('should return "poor" for values above poor threshold (LCP > 4000)', () => {
            // Arrange
            const mockMetric = {
                name: 'LCP',
                value: 5000, // Poor threshold
                rating: 'poor',
                delta: 5000,
                id: 'v3-lcp-poor'
            }

            onLCP.mockImplementation(callback => callback(mockMetric))

            // Act
            initWebVitals()

            // Assert
            expect(trackEvent).toHaveBeenCalledWith('web_vitals', expect.objectContaining({
                metric_rating: 'poor'
            }))
        })

        it('should calculate correct ratings for all Core Web Vitals thresholds', () => {
            // Test INP good threshold (<200ms)
            const inpGoodMetric = { name: 'INP', value: 50, rating: 'good', delta: 50, id: 'inp-1' }
            onINP.mockImplementation(callback => callback(inpGoodMetric))
            initWebVitals()
            expect(trackEvent).toHaveBeenCalledWith('web_vitals', expect.objectContaining({
                metric_name: 'INP',
                metric_rating: 'good'
            }))

            vi.clearAllMocks()

            // Test CLS good threshold (<0.1)
            const clsGoodMetric = { name: 'CLS', value: 0.05, rating: 'good', delta: 0.05, id: 'cls-1' }
            onCLS.mockImplementation(callback => callback(clsGoodMetric))
            initWebVitals()
            expect(trackEvent).toHaveBeenCalledWith('web_vitals', expect.objectContaining({
                metric_name: 'CLS',
                metric_rating: 'good'
            }))

            vi.clearAllMocks()

            // Test FCP good threshold (<1800ms)
            const fcpGoodMetric = { name: 'FCP', value: 1500, rating: 'good', delta: 1500, id: 'fcp-1' }
            onFCP.mockImplementation(callback => callback(fcpGoodMetric))
            initWebVitals()
            expect(trackEvent).toHaveBeenCalledWith('web_vitals', expect.objectContaining({
                metric_name: 'FCP',
                metric_rating: 'good'
            }))

            vi.clearAllMocks()

            // Test TTFB good threshold (<800ms)
            const ttfbGoodMetric = { name: 'TTFB', value: 700, rating: 'good', delta: 700, id: 'ttfb-1' }
            onTTFB.mockImplementation(callback => callback(ttfbGoodMetric))
            initWebVitals()
            expect(trackEvent).toHaveBeenCalledWith('web_vitals', expect.objectContaining({
                metric_name: 'TTFB',
                metric_rating: 'good'
            }))
        })
    })

    describe('getPerformanceMetrics()', () => {
        it('should return performance object with all timing metrics', () => {
            // Arrange
            const mockNavigationEntry = {
                domainLookupEnd: 100,
                domainLookupStart: 50,
                connectEnd: 200,
                connectStart: 100,
                responseStart: 300,
                requestStart: 250,
                responseEnd: 400,
                domInteractive: 500,
                domComplete: 800,
                loadEventEnd: 1000
            }

            const mockPaintEntries = [
                { name: 'first-contentful-paint', startTime: 600 }
            ]

            const mockResourceEntries = [
                { name: 'resource1.js' },
                { name: 'resource2.css' }
            ]

            const mockGetEntriesByType = vi.fn((type) => {
                if (type === 'navigation') return [mockNavigationEntry]
                if (type === 'paint') return mockPaintEntries
                if (type === 'resource') return mockResourceEntries
                return []
            })

            // Mock both window.performance AND global performance
            global.window = {
                ...global.window,
                performance: {
                    getEntriesByType: mockGetEntriesByType
                }
            }

            // Mock global performance object (used directly in implementation)
            global.performance = {
                getEntriesByType: mockGetEntriesByType
            }

            // Act
            const metrics = getPerformanceMetrics()

            // Assert
            expect(metrics).toEqual({
                dns: 50, // 100 - 50
                tcp: 100, // 200 - 100
                ttfb: 50, // 300 - 250
                download: 100, // 400 - 300
                domInteractive: 500,
                domComplete: 800,
                loadComplete: 1000,
                fcp: 600,
                totalResources: 2
            })
        })

        it('should handle missing performance API gracefully (return null)', () => {
            // Arrange - Remove performance API
            delete global.window.performance

            // Act
            const metrics = getPerformanceMetrics()

            // Assert
            expect(metrics).toBeNull()
        })

        it('should handle SSR environment (typeof window === "undefined")', () => {
            // Arrange - Simulate SSR
            delete global.window

            // Act
            const metrics = getPerformanceMetrics()

            // Assert
            expect(metrics).toBeNull()
        })

        it('should handle missing navigation entries gracefully', () => {
            // Arrange
            const mockGetEntriesByType = vi.fn((type) => {
                if (type === 'navigation') return []
                if (type === 'paint') return []
                if (type === 'resource') return []
                return []
            })

            // Mock both window.performance AND global performance
            global.window = {
                ...global.window,
                performance: {
                    getEntriesByType: mockGetEntriesByType
                }
            }

            // Mock global performance object (used directly in implementation)
            global.performance = {
                getEntriesByType: mockGetEntriesByType
            }

            // Act
            const metrics = getPerformanceMetrics()

            // Assert - Should return object with undefined values
            expect(metrics).toEqual({
                dns: NaN, // undefined - undefined = NaN
                tcp: NaN,
                ttfb: NaN,
                download: NaN,
                domInteractive: undefined,
                domComplete: undefined,
                loadComplete: undefined,
                fcp: undefined,
                totalResources: 0
            })
        })

        it('should handle missing paint entries gracefully', () => {
            // Arrange
            const mockNavigationEntry = {
                domainLookupEnd: 100,
                domainLookupStart: 50,
                connectEnd: 200,
                connectStart: 100,
                responseStart: 300,
                requestStart: 250,
                responseEnd: 400,
                domInteractive: 500,
                domComplete: 800,
                loadEventEnd: 1000
            }

            const mockGetEntriesByType = vi.fn((type) => {
                if (type === 'navigation') return [mockNavigationEntry]
                if (type === 'paint') return [] // No paint entries
                if (type === 'resource') return []
                return []
            })

            // Mock both window.performance AND global performance
            global.window = {
                ...global.window,
                performance: {
                    getEntriesByType: mockGetEntriesByType
                }
            }

            // Mock global performance object (used directly in implementation)
            global.performance = {
                getEntriesByType: mockGetEntriesByType
            }

            // Act
            const metrics = getPerformanceMetrics()

            // Assert
            expect(metrics).toEqual({
                dns: 50,
                tcp: 100,
                ttfb: 50,
                download: 100,
                domInteractive: 500,
                domComplete: 800,
                loadComplete: 1000,
                fcp: undefined, // No FCP entry
                totalResources: 0
            })
        })
    })

    describe('Edge Cases and Integration', () => {
        it('should handle metrics with decimal values correctly', () => {
            // Arrange
            const mockMetric = {
                name: 'CLS',
                value: 0.123456,
                rating: 'needs-improvement',
                delta: 0.067890,
                id: 'v3-cls-decimal'
            }

            onCLS.mockImplementation(callback => callback(mockMetric))

            // Act
            initWebVitals()

            // Assert - Should round values (CLS value is multiplied by 1000, delta is just rounded)
            expect(trackEvent).toHaveBeenCalledWith('web_vitals', expect.objectContaining({
                metric_value: 123, // Math.round(0.123456 * 1000) = 123
                metric_delta: 0 // Math.round(0.067890) = 0
            }))
        })

        it('should handle multiple metrics being reported simultaneously', () => {
            // Arrange
            const clsMetric = { name: 'CLS', value: 0.05, rating: 'good', delta: 0.05, id: 'cls-1' }
            const inpMetric = { name: 'INP', value: 50, rating: 'good', delta: 50, id: 'inp-1' }
            const lcpMetric = { name: 'LCP', value: 2000, rating: 'good', delta: 2000, id: 'lcp-1' }

            onCLS.mockImplementation(callback => callback(clsMetric))
            onINP.mockImplementation(callback => callback(inpMetric))
            onLCP.mockImplementation(callback => callback(lcpMetric))

            // Act
            initWebVitals()

            // Assert - All three metrics should be tracked
            expect(trackEvent).toHaveBeenCalledTimes(3)
            expect(trackEvent).toHaveBeenCalledWith('web_vitals', expect.objectContaining({
                metric_name: 'CLS'
            }))
            expect(trackEvent).toHaveBeenCalledWith('web_vitals', expect.objectContaining({
                metric_name: 'INP'
            }))
            expect(trackEvent).toHaveBeenCalledWith('web_vitals', expect.objectContaining({
                metric_name: 'LCP'
            }))
        })

        it('should include page path in analytics payload', () => {
            // Arrange
            global.window.location.pathname = '/recipes/chocolate-cake'

            const mockMetric = {
                name: 'LCP',
                value: 2000,
                rating: 'good',
                delta: 2000,
                id: 'v3-lcp-path'
            }

            onLCP.mockImplementation(callback => callback(mockMetric))

            // Act
            initWebVitals()

            // Assert
            expect(trackEvent).toHaveBeenCalledWith('web_vitals', expect.objectContaining({
                page_path: '/recipes/chocolate-cake'
            }))
        })

        it('should not log in production mode', () => {
            // Arrange
            import.meta.env.DEV = false

            // Act
            initWebVitals()

            // Assert - No debug logs in production
            expect(consoleDebugSpy).not.toHaveBeenCalledWith('[Web Vitals] Monitoring initialized')
        })
    })
})
