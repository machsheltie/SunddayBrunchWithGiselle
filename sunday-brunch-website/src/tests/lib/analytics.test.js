import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
    trackEvent,
    trackPageView,
    trackPrint,
    trackShare,
    trackCopy,
    trackAudio,
    trackAffiliateClick
} from '../../lib/analytics'

describe('Analytics Service', () => {
    let consoleDebugSpy
    let originalMode

    beforeEach(() => {
        // Save original mode
        originalMode = import.meta.env.MODE
        // Set environment to development so console.debug is called
        import.meta.env.MODE = 'development'
        // Mock console.debug to capture analytics calls
        consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})
    })

    afterEach(() => {
        // Restore original mode
        import.meta.env.MODE = originalMode
        // Restore mocks after each test
        vi.restoreAllMocks()
    })

    describe('trackEvent', () => {
        it('should call console.debug in development mode', () => {
            // Arrange
            const eventName = 'test_event'
            const eventData = { foo: 'bar' }

            // Act
            trackEvent(eventName, eventData)

            // Assert
            expect(consoleDebugSpy).toHaveBeenCalledWith('[event]', eventName, eventData)
        })

        it('should handle events without data parameter', () => {
            // Arrange
            const eventName = 'simple_event'

            // Act
            trackEvent(eventName)

            // Assert
            expect(consoleDebugSpy).toHaveBeenCalledWith('[event]', eventName, {})
        })

        it('should handle events with empty data object', () => {
            // Arrange
            const eventName = 'empty_data_event'

            // Act
            trackEvent(eventName, {})

            // Assert
            expect(consoleDebugSpy).toHaveBeenCalledWith('[event]', eventName, {})
        })

        it('should handle events with complex data objects', () => {
            // Arrange
            const eventName = 'complex_event'
            const eventData = {
                user: { id: 123, name: 'Test' },
                items: [1, 2, 3],
                metadata: { nested: { value: true } }
            }

            // Act
            trackEvent(eventName, eventData)

            // Assert
            expect(consoleDebugSpy).toHaveBeenCalledWith('[event]', eventName, eventData)
        })
    })

    describe('trackPageView', () => {
        it('should track page view with path', () => {
            // Arrange
            const path = '/recipes/chocolate-cake'

            // Act
            trackPageView(path)

            // Assert
            expect(consoleDebugSpy).toHaveBeenCalledWith('[event]', 'page_view', { path })
        })

        it('should track homepage page view', () => {
            // Arrange
            const path = '/'

            // Act
            trackPageView(path)

            // Assert
            expect(consoleDebugSpy).toHaveBeenCalledWith('[event]', 'page_view', { path: '/' })
        })

        it('should track page view with query parameters', () => {
            // Arrange
            const path = '/recipes?category=desserts&sort=newest'

            // Act
            trackPageView(path)

            // Assert
            expect(consoleDebugSpy).toHaveBeenCalledWith('[event]', 'page_view', { path })
        })
    })

    describe('trackPrint', () => {
        it('should track print event with context', () => {
            // Arrange
            const context = 'recipe-page'

            // Act
            trackPrint(context)

            // Assert
            expect(consoleDebugSpy).toHaveBeenCalledWith('[event]', 'print', { context })
        })

        it('should track print event with recipe slug', () => {
            // Arrange
            const context = 'giselles-royal-velvet-cake'

            // Act
            trackPrint(context)

            // Assert
            expect(consoleDebugSpy).toHaveBeenCalledWith('[event]', 'print', { context })
        })
    })

    describe('trackShare', () => {
        it('should track share event with channel and context', () => {
            // Arrange
            const channel = 'pinterest'
            const context = 'recipe-card'

            // Act
            trackShare(channel, context)

            // Assert
            expect(consoleDebugSpy).toHaveBeenCalledWith('[event]', 'share', { channel, context })
        })

        it('should track Facebook share', () => {
            // Arrange
            const channel = 'facebook'
            const context = 'chocolate-cake'

            // Act
            trackShare(channel, context)

            // Assert
            expect(consoleDebugSpy).toHaveBeenCalledWith('[event]', 'share', {
                channel: 'facebook',
                context: 'chocolate-cake'
            })
        })

        it('should track Twitter share', () => {
            // Arrange
            const channel = 'twitter'
            const context = 'recipe-template'

            // Act
            trackShare(channel, context)

            // Assert
            expect(consoleDebugSpy).toHaveBeenCalledWith('[event]', 'share', {
                channel: 'twitter',
                context: 'recipe-template'
            })
        })
    })

    describe('trackCopy', () => {
        it('should track copy event with context', () => {
            // Arrange
            const context = 'recipe-url'

            // Act
            trackCopy(context)

            // Assert
            expect(consoleDebugSpy).toHaveBeenCalledWith('[event]', 'copy', { context })
        })

        it('should track ingredient list copy', () => {
            // Arrange
            const context = 'ingredient-list'

            // Act
            trackCopy(context)

            // Assert
            expect(consoleDebugSpy).toHaveBeenCalledWith('[event]', 'copy', { context: 'ingredient-list' })
        })
    })

    describe('trackAudio', () => {
        it('should track audio event with state and context', () => {
            // Arrange
            const state = 'play'
            const context = 'giselle-tip'

            // Act
            trackAudio(state, context)

            // Assert
            expect(consoleDebugSpy).toHaveBeenCalledWith('[event]', 'audio', { state, context })
        })

        it('should track audio play event', () => {
            // Arrange
            const state = 'play'
            const context = 'recipe-audio'

            // Act
            trackAudio(state, context)

            // Assert
            expect(consoleDebugSpy).toHaveBeenCalledWith('[event]', 'audio', {
                state: 'play',
                context: 'recipe-audio'
            })
        })

        it('should track audio pause event', () => {
            // Arrange
            const state = 'pause'
            const context = 'audio-player'

            // Act
            trackAudio(state, context)

            // Assert
            expect(consoleDebugSpy).toHaveBeenCalledWith('[event]', 'audio', {
                state: 'pause',
                context: 'audio-player'
            })
        })
    })

    describe('trackAffiliateClick', () => {
        it('should track affiliate click event with tool data', () => {
            // Arrange
            const tool = {
                name: 'KitchenAid Stand Mixer',
                url: 'https://example.com/affiliate-link'
            }

            // Act
            trackAffiliateClick(tool)

            // Assert
            expect(consoleDebugSpy).toHaveBeenCalledWith('[event]', 'affiliate_click', tool)
        })

        it('should track affiliate click with tool name only', () => {
            // Arrange
            const tool = { name: 'Mixing Bowl Set' }

            // Act
            trackAffiliateClick(tool)

            // Assert
            expect(consoleDebugSpy).toHaveBeenCalledWith('[event]', 'affiliate_click', tool)
        })

        it('should track affiliate click with complete tool object', () => {
            // Arrange
            const tool = {
                id: 'tool-123',
                name: 'Digital Kitchen Scale',
                url: 'https://amazon.com/...',
                price: 29.99
            }

            // Act
            trackAffiliateClick(tool)

            // Assert
            expect(consoleDebugSpy).toHaveBeenCalledWith('[event]', 'affiliate_click', tool)
        })
    })

    describe('Edge Cases', () => {
        it('should handle undefined values gracefully', () => {
            // Act
            trackPageView(undefined)

            // Assert
            expect(consoleDebugSpy).toHaveBeenCalledWith('[event]', 'page_view', { path: undefined })
        })

        it('should handle null values gracefully', () => {
            // Act
            trackCopy(null)

            // Assert
            expect(consoleDebugSpy).toHaveBeenCalledWith('[event]', 'copy', { context: null })
        })

        it('should handle special characters in event data', () => {
            // Arrange
            const path = '/recipes/crème-brûlée'

            // Act
            trackPageView(path)

            // Assert
            expect(consoleDebugSpy).toHaveBeenCalledWith('[event]', 'page_view', { path })
        })
    })
})
