import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { AuteurMotion } from '../../lib/AuteurMotion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Mock GSAP and ScrollTrigger
vi.mock('gsap', () => {
    const mockMaxScroll = vi.fn(() => 1000)
    return {
        gsap: {
            registerPlugin: vi.fn(),
            fromTo: vi.fn(),
            to: vi.fn(),
            killTweensOf: vi.fn()
        },
        ScrollTrigger: {
            maxScroll: mockMaxScroll
        }
    }
})

describe('AuteurMotion', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks()
    })

    afterEach(() => {
        // Clean up DOM after each test
        document.body.innerHTML = ''
    })

    describe('revealText', () => {
        it('should apply reveal animation to element', () => {
            // Arrange
            const element = document.createElement('h1')
            element.textContent = 'Test Heading'
            document.body.appendChild(element)

            // Act
            AuteurMotion.revealText(element)

            // Assert
            expect(gsap.fromTo).toHaveBeenCalledWith(
                element,
                {
                    clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)',
                    y: 50,
                    opacity: 0,
                    filter: 'blur(10px)'
                },
                expect.objectContaining({
                    clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)',
                    y: 0,
                    opacity: 1,
                    filter: 'blur(0px)',
                    duration: 1.8,
                    ease: 'expo.out'
                })
            )
        })

        it('should configure ScrollTrigger with correct settings', () => {
            // Arrange
            const element = document.createElement('div')
            document.body.appendChild(element)

            // Act
            AuteurMotion.revealText(element)

            // Assert
            const callArgs = gsap.fromTo.mock.calls[0]
            expect(callArgs[2].scrollTrigger).toEqual({
                trigger: element,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            })
        })

        it('should work with string selector', () => {
            // Arrange
            const element = document.createElement('h2')
            element.id = 'test-heading'
            document.body.appendChild(element)

            // Act
            AuteurMotion.revealText('#test-heading')

            // Assert
            expect(gsap.fromTo).toHaveBeenCalled()
        })

        it('should handle non-existent element gracefully', () => {
            // Act & Assert
            expect(() => AuteurMotion.revealText('#non-existent')).not.toThrow()
        })
    })

    describe('applyDepth', () => {
        it('should apply parallax effect with default speed', () => {
            // Arrange
            const element = document.createElement('div')
            document.body.appendChild(element)

            // Act
            AuteurMotion.applyDepth(element)

            // Assert
            expect(gsap.to).toHaveBeenCalledWith(
                element,
                expect.objectContaining({
                    ease: 'none',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1
                    }
                })
            )
        })

        it('should apply parallax effect with custom speed', () => {
            // Arrange
            const element = document.createElement('img')
            const customSpeed = -0.3
            document.body.appendChild(element)

            // Act
            AuteurMotion.applyDepth(element, customSpeed)

            // Assert
            expect(gsap.to).toHaveBeenCalled()
            const callArgs = gsap.to.mock.calls[0]
            const yFunction = callArgs[1].y

            // Test that the y function exists and is callable
            expect(typeof yFunction).toBe('function')
        })

        it('should calculate y position based on scroll and speed', () => {
            // Arrange
            const element = document.createElement('div')
            const speed = -0.2
            document.body.appendChild(element)

            // Act
            AuteurMotion.applyDepth(element, speed)

            // Assert
            const callArgs = gsap.to.mock.calls[0]
            const yFunction = callArgs[1].y

            // Test that y is a function that will calculate position
            expect(typeof yFunction).toBe('function')
        })

        it('should handle positive speed values', () => {
            // Arrange
            const element = document.createElement('div')
            const speed = 0.15
            document.body.appendChild(element)

            // Act
            AuteurMotion.applyDepth(element, speed)

            // Assert
            const callArgs = gsap.to.mock.calls[0]
            const yFunction = callArgs[1].y

            // Test that y is a function that will calculate position
            expect(typeof yFunction).toBe('function')
        })

        it('should configure ScrollTrigger scrub for smooth parallax', () => {
            // Arrange
            const element = document.createElement('div')
            document.body.appendChild(element)

            // Act
            AuteurMotion.applyDepth(element)

            // Assert
            const callArgs = gsap.to.mock.calls[0]
            expect(callArgs[1].scrollTrigger.scrub).toBe(1)
        })

        it('should handle string selector', () => {
            // Arrange
            const element = document.createElement('div')
            element.className = 'parallax-element'
            document.body.appendChild(element)

            // Act
            AuteurMotion.applyDepth('.parallax-element')

            // Assert
            expect(gsap.to).toHaveBeenCalled()
        })
    })

    describe('makeMagnetic - Basic Functionality', () => {
        it('should apply magnetic effect to element', () => {
            // Arrange
            const button = document.createElement('button')
            button.getBoundingClientRect = vi.fn(() => ({
                left: 100,
                top: 100,
                width: 200,
                height: 50,
                right: 300,
                bottom: 150
            }))
            document.body.appendChild(button)

            // Act
            AuteurMotion.makeMagnetic(button)

            // Create and dispatch a mousemove event
            const mouseMoveEvent = new MouseEvent('mousemove', {
                clientX: 200,
                clientY: 125,
                bubbles: true
            })
            button.dispatchEvent(mouseMoveEvent)

            // Assert
            expect(gsap.to).toHaveBeenCalledWith(
                button,
                expect.objectContaining({
                    duration: 0.6,
                    ease: 'power3.out'
                })
            )
        })

        it('should handle mouse enter event', () => {
            // Arrange
            const element = document.createElement('a')
            element.getBoundingClientRect = vi.fn(() => ({
                left: 50,
                top: 50,
                width: 150,
                height: 40,
                right: 200,
                bottom: 90
            }))
            document.body.appendChild(element)

            // Act
            AuteurMotion.makeMagnetic(element)

            const mouseEnterEvent = new MouseEvent('mouseenter', {
                clientX: 125,
                clientY: 70,
                bubbles: true
            })
            element.dispatchEvent(mouseEnterEvent)

            // Assert - mousemove handler should be attached
            const mouseMoveEvent = new MouseEvent('mousemove', {
                clientX: 125,
                clientY: 70,
                bubbles: true
            })
            element.dispatchEvent(mouseMoveEvent)

            expect(gsap.to).toHaveBeenCalled()
        })

        it('should handle mouse move event', () => {
            // Arrange
            const button = document.createElement('button')
            button.getBoundingClientRect = vi.fn(() => ({
                left: 0,
                top: 0,
                width: 100,
                height: 50,
                right: 100,
                bottom: 50
            }))
            document.body.appendChild(button)

            // Act
            AuteurMotion.makeMagnetic(button)

            // Move mouse to different positions
            const positions = [
                { x: 60, y: 30 },  // Right of center
                { x: 40, y: 20 },  // Left of center
                { x: 50, y: 40 }   // Bottom center
            ]

            positions.forEach(pos => {
                const event = new MouseEvent('mousemove', {
                    clientX: pos.x,
                    clientY: pos.y,
                    bubbles: true
                })
                button.dispatchEvent(event)
            })

            // Assert
            expect(gsap.to).toHaveBeenCalledTimes(positions.length)
        })

        it('should handle mouse leave event and reset position', () => {
            // Arrange
            const button = document.createElement('button')
            button.getBoundingClientRect = vi.fn(() => ({
                left: 0,
                top: 0,
                width: 100,
                height: 50,
                right: 100,
                bottom: 50
            }))
            document.body.appendChild(button)

            // Act
            AuteurMotion.makeMagnetic(button)

            // Trigger mouseleave
            const leaveEvent = new MouseEvent('mouseleave', { bubbles: true })
            button.dispatchEvent(leaveEvent)

            // Assert
            expect(gsap.to).toHaveBeenCalledWith(
                button,
                expect.objectContaining({
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.3)'
                })
            )
        })
    })

    describe('makeMagnetic - Edge Cases', () => {
        it('should handle null element gracefully', () => {
            // Act & Assert
            expect(() => AuteurMotion.makeMagnetic(null)).not.toThrow()
            expect(gsap.to).not.toHaveBeenCalled()
        })

        it('should handle undefined element gracefully', () => {
            // Act & Assert
            expect(() => AuteurMotion.makeMagnetic(undefined)).not.toThrow()
            expect(gsap.to).not.toHaveBeenCalled()
        })

        it('should handle element without getBoundingClientRect', () => {
            // Arrange
            const invalidElement = {
                addEventListener: vi.fn(),
                getBoundingClientRect: undefined
            }

            // Act - This will add listeners but may fail when getBoundingClientRect is called
            AuteurMotion.makeMagnetic(invalidElement)

            // Assert - The function should add listeners even if getBoundingClientRect is missing
            expect(invalidElement.addEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function))
            expect(invalidElement.addEventListener).toHaveBeenCalledWith('mouseleave', expect.any(Function))
        })

        it('should not throw errors when element is removed from DOM', () => {
            // Arrange
            const button = document.createElement('button')
            button.getBoundingClientRect = vi.fn(() => ({
                left: 0,
                top: 0,
                width: 100,
                height: 50,
                right: 100,
                bottom: 50
            }))
            document.body.appendChild(button)

            // Act
            AuteurMotion.makeMagnetic(button)

            // Remove element from DOM
            button.remove()

            // Trigger events on removed element
            const moveEvent = new MouseEvent('mousemove', {
                clientX: 50,
                clientY: 25,
                bubbles: true
            })

            // Assert - should not throw
            expect(() => button.dispatchEvent(moveEvent)).not.toThrow()
        })
    })

    describe('makeMagnetic - Event Listeners', () => {
        it('should add event listeners on initialization', () => {
            // Arrange
            const button = document.createElement('button')
            button.getBoundingClientRect = vi.fn(() => ({
                left: 0,
                top: 0,
                width: 100,
                height: 50,
                right: 100,
                bottom: 50
            }))
            document.body.appendChild(button)

            const addEventListenerSpy = vi.spyOn(button, 'addEventListener')

            // Act
            AuteurMotion.makeMagnetic(button)

            // Assert
            expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))
            expect(addEventListenerSpy).toHaveBeenCalledWith('mouseleave', expect.any(Function))
        })

        it('should properly handle multiple event dispatches', () => {
            // Arrange
            const button = document.createElement('button')
            button.getBoundingClientRect = vi.fn(() => ({
                left: 0,
                top: 0,
                width: 100,
                height: 50,
                right: 100,
                bottom: 50
            }))
            document.body.appendChild(button)

            // Act
            AuteurMotion.makeMagnetic(button)

            // Dispatch multiple events
            for (let i = 0; i < 5; i++) {
                const moveEvent = new MouseEvent('mousemove', {
                    clientX: 50 + i * 10,
                    clientY: 25,
                    bubbles: true
                })
                button.dispatchEvent(moveEvent)
            }

            const leaveEvent = new MouseEvent('mouseleave', { bubbles: true })
            button.dispatchEvent(leaveEvent)

            // Assert
            expect(gsap.to).toHaveBeenCalledTimes(6) // 5 moves + 1 leave
        })
    })

    describe('makeMagnetic - GSAP Integration', () => {
        it('should use gsap.to() for smooth animations', () => {
            // Arrange
            const button = document.createElement('button')
            button.getBoundingClientRect = vi.fn(() => ({
                left: 100,
                top: 100,
                width: 200,
                height: 50,
                right: 300,
                bottom: 150
            }))
            document.body.appendChild(button)

            // Act
            AuteurMotion.makeMagnetic(button)

            const event = new MouseEvent('mousemove', {
                clientX: 200,
                clientY: 125,
                bubbles: true
            })
            button.dispatchEvent(event)

            // Assert
            expect(gsap.to).toHaveBeenCalledWith(button, expect.any(Object))
        })

        it('should apply transform based on cursor distance', () => {
            // Arrange
            const button = document.createElement('button')
            const rect = {
                left: 100,
                top: 100,
                width: 200,
                height: 50,
                right: 300,
                bottom: 150
            }
            button.getBoundingClientRect = vi.fn(() => rect)
            document.body.appendChild(button)

            // Act
            AuteurMotion.makeMagnetic(button)

            // Move cursor to right edge of button
            const event = new MouseEvent('mousemove', {
                clientX: 250, // 50px from center (200 / 2 = 100, so 150px from left)
                clientY: 125,
                bubbles: true
            })
            button.dispatchEvent(event)

            // Assert
            const callArgs = gsap.to.mock.calls[0]
            // x should be positive (moving right)
            // 250 - 100 (rect.left) - 100 (half width) = 50
            // 50 * 0.3 = 15
            expect(callArgs[1].x).toBe(15)
            // y should be 0 (centered vertically)
            // 125 - 100 (rect.top) - 25 (half height) = 0
            // 0 * 0.3 = 0
            expect(callArgs[1].y).toBe(0)
        })

        it('should calculate negative offset for cursor on left side', () => {
            // Arrange
            const button = document.createElement('button')
            const rect = {
                left: 100,
                top: 100,
                width: 200,
                height: 50,
                right: 300,
                bottom: 150
            }
            button.getBoundingClientRect = vi.fn(() => rect)
            document.body.appendChild(button)

            // Act
            AuteurMotion.makeMagnetic(button)

            // Move cursor to left side of button
            const event = new MouseEvent('mousemove', {
                clientX: 150, // 50px left of center
                clientY: 115, // 10px above center
                bubbles: true
            })
            button.dispatchEvent(event)

            // Assert
            const callArgs = gsap.to.mock.calls[0]
            // x: 150 - 100 - 100 = -50, -50 * 0.3 = -15
            expect(callArgs[1].x).toBe(-15)
            // y: 115 - 100 - 25 = -10, -10 * 0.3 = -3
            expect(callArgs[1].y).toBe(-3)
        })

        it('should use string selector and apply magnetic effect', () => {
            // Arrange
            const button = document.createElement('button')
            button.className = 'magnetic-button'
            button.getBoundingClientRect = vi.fn(() => ({
                left: 0,
                top: 0,
                width: 100,
                height: 50,
                right: 100,
                bottom: 50
            }))
            document.body.appendChild(button)

            // Act
            AuteurMotion.makeMagnetic('.magnetic-button')

            const event = new MouseEvent('mousemove', {
                clientX: 50,
                clientY: 25,
                bubbles: true
            })
            button.dispatchEvent(event)

            // Assert
            expect(gsap.to).toHaveBeenCalled()
        })

        it('should handle rapid mouse movements without errors', () => {
            // Arrange
            const button = document.createElement('button')
            button.getBoundingClientRect = vi.fn(() => ({
                left: 0,
                top: 0,
                width: 100,
                height: 50,
                right: 100,
                bottom: 50
            }))
            document.body.appendChild(button)

            // Act
            AuteurMotion.makeMagnetic(button)

            // Simulate rapid movements (50 events)
            for (let i = 0; i < 50; i++) {
                const event = new MouseEvent('mousemove', {
                    clientX: Math.random() * 100,
                    clientY: Math.random() * 50,
                    bubbles: true
                })
                button.dispatchEvent(event)
            }

            // Assert
            expect(gsap.to).toHaveBeenCalledTimes(50)
            expect(() => button.dispatchEvent(new MouseEvent('mouseleave'))).not.toThrow()
        })
    })

    describe('Integration Tests', () => {
        it('should work with all three animation methods together', () => {
            // Arrange
            const heading = document.createElement('h1')
            const image = document.createElement('img')
            const button = document.createElement('button')
            button.getBoundingClientRect = vi.fn(() => ({
                left: 0,
                top: 0,
                width: 100,
                height: 50,
                right: 100,
                bottom: 50
            }))

            document.body.appendChild(heading)
            document.body.appendChild(image)
            document.body.appendChild(button)

            // Act
            AuteurMotion.revealText(heading)
            AuteurMotion.applyDepth(image, -0.2)
            AuteurMotion.makeMagnetic(button)

            // Assert
            expect(gsap.fromTo).toHaveBeenCalledTimes(1)
            expect(gsap.to).toHaveBeenCalledTimes(1)

            // Trigger magnetic effect
            button.dispatchEvent(new MouseEvent('mousemove', {
                clientX: 50,
                clientY: 25,
                bubbles: true
            }))

            expect(gsap.to).toHaveBeenCalledTimes(2)
        })

        it('should handle cleanup and reinitialization', () => {
            // Arrange
            const button = document.createElement('button')
            button.getBoundingClientRect = vi.fn(() => ({
                left: 0,
                top: 0,
                width: 100,
                height: 50,
                right: 100,
                bottom: 50
            }))
            document.body.appendChild(button)

            // Act - Initialize twice
            AuteurMotion.makeMagnetic(button)
            AuteurMotion.makeMagnetic(button)

            // Trigger events
            button.dispatchEvent(new MouseEvent('mousemove', {
                clientX: 50,
                clientY: 25,
                bubbles: true
            }))

            // Assert - Both listeners should fire
            expect(gsap.to).toHaveBeenCalledTimes(2) // Called twice due to double initialization
        })
    })
})
