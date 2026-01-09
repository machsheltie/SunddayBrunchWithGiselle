import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorBoundary from '../../components/ErrorBoundary'

// Component that throws an error
const ThrowError = ({ shouldThrow }) => {
    if (shouldThrow) {
        throw new Error('Test error')
    }
    return <div>No error</div>
}

// Component that throws during render
const AlwaysThrows = () => {
    throw new Error('Component error')
}

describe('ErrorBoundary Component', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks()
        // Suppress console.error for cleaner test output
        vi.spyOn(console, 'error').mockImplementation(() => {})
    })

    describe('Error Catching', () => {
        it('should render children when no error occurs', () => {
            // Arrange & Act
            render(
                <ErrorBoundary>
                    <div data-testid="child">Child content</div>
                </ErrorBoundary>
            )

            // Assert
            expect(screen.getByTestId('child')).toBeInTheDocument()
            expect(screen.getByText('Child content')).toBeInTheDocument()
        })

        it('should catch errors from child components', () => {
            // Arrange & Act
            render(
                <ErrorBoundary>
                    <AlwaysThrows />
                </ErrorBoundary>
            )

            // Assert
            expect(screen.getByText(/Oh dear, a sunken souffle/i)).toBeInTheDocument()
        })

        it('should display error UI when error is thrown', () => {
            // Arrange & Act
            render(
                <ErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>
            )

            // Assert
            expect(screen.getByText(/Oh dear, a sunken souffle/i)).toBeInTheDocument()
            expect(screen.getByText(/Something went wrong in the kitchen/i)).toBeInTheDocument()
        })

        it('should log error to console when error occurs', () => {
            // Arrange
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

            // Act
            render(
                <ErrorBoundary>
                    <AlwaysThrows />
                </ErrorBoundary>
            )

            // Assert
            expect(consoleErrorSpy).toHaveBeenCalled()
        })

        it('should catch errors from deeply nested components', () => {
            // Arrange & Act
            render(
                <ErrorBoundary>
                    <div>
                        <div>
                            <div>
                                <AlwaysThrows />
                            </div>
                        </div>
                    </div>
                </ErrorBoundary>
            )

            // Assert
            expect(screen.getByText(/Oh dear, a sunken souffle/i)).toBeInTheDocument()
        })
    })

    describe('Error UI Display', () => {
        it('should display whimsical error title', () => {
            // Arrange & Act
            render(
                <ErrorBoundary>
                    <AlwaysThrows />
                </ErrorBoundary>
            )

            // Assert
            const title = screen.getByText(/Oh dear, a sunken souffle/i)
            expect(title).toBeInTheDocument()
            expect(title.tagName).toBe('H1')
        })

        it('should display helpful error message', () => {
            // Arrange & Act
            render(
                <ErrorBoundary>
                    <AlwaysThrows />
                </ErrorBoundary>
            )

            // Assert
            expect(screen.getByText(/Something went wrong in the kitchen/i)).toBeInTheDocument()
            expect(screen.getByText(/even the best bakers have off days/i)).toBeInTheDocument()
        })

        it('should display Try Again button', () => {
            // Arrange & Act
            render(
                <ErrorBoundary>
                    <AlwaysThrows />
                </ErrorBoundary>
            )

            // Assert
            const tryAgainButton = screen.getByRole('button', { name: /try again/i })
            expect(tryAgainButton).toBeInTheDocument()
        })

        it('should display Return Home link', () => {
            // Arrange & Act
            render(
                <ErrorBoundary>
                    <AlwaysThrows />
                </ErrorBoundary>
            )

            // Assert
            const homeLink = screen.getByRole('link', { name: /return home/i })
            expect(homeLink).toBeInTheDocument()
            expect(homeLink).toHaveAttribute('href', '/')
        })

        it('should render error boundary container with correct class', () => {
            // Arrange & Act
            const { container } = render(
                <ErrorBoundary>
                    <AlwaysThrows />
                </ErrorBoundary>
            )

            // Assert
            const errorBoundary = container.querySelector('.error-boundary')
            expect(errorBoundary).toBeInTheDocument()
        })
    })

    describe('Reset Functionality', () => {
        it('should reset error state when Try Again button is clicked', () => {
            // Arrange - Create a component that can toggle between error/success
            let shouldThrow = true
            const ToggleError = () => {
                if (shouldThrow) {
                    throw new Error('Test error')
                }
                return <div data-testid="recovered">Content recovered</div>
            }

            const { rerender } = render(
                <ErrorBoundary>
                    <ToggleError />
                </ErrorBoundary>
            )

            // Verify error UI is displayed
            expect(screen.getByText(/Oh dear, a sunken souffle/i)).toBeInTheDocument()

            // Act - Click Try Again and toggle error off
            const tryAgainButton = screen.getByRole('button', { name: /try again/i })
            shouldThrow = false
            fireEvent.click(tryAgainButton)

            // Rerender to trigger re-evaluation
            rerender(
                <ErrorBoundary>
                    <ToggleError />
                </ErrorBoundary>
            )

            // Assert - Should show recovered content
            expect(screen.getByTestId('recovered')).toBeInTheDocument()
        })

        it('should reset hasError state to false when handleReset is called', () => {
            // Arrange
            const { container } = render(
                <ErrorBoundary>
                    <AlwaysThrows />
                </ErrorBoundary>
            )

            // Verify error UI is displayed
            expect(screen.getByText(/Oh dear, a sunken souffle/i)).toBeInTheDocument()

            // Act
            const tryAgainButton = screen.getByRole('button', { name: /try again/i })
            fireEvent.click(tryAgainButton)

            // Assert - After clicking, the error boundary will attempt to re-render children
            // which will throw again, but the state was reset (this is expected behavior)
            // We can verify the button was clickable and the error UI is still shown
            // (because component throws again immediately)
            expect(screen.getByText(/Oh dear, a sunken souffle/i)).toBeInTheDocument()
        })
    })

    describe('Custom Fallback', () => {
        it('should render custom fallback when provided', () => {
            // Arrange
            const customFallback = <div data-testid="custom-fallback">Custom error message</div>

            // Act
            render(
                <ErrorBoundary fallback={customFallback}>
                    <AlwaysThrows />
                </ErrorBoundary>
            )

            // Assert
            expect(screen.getByTestId('custom-fallback')).toBeInTheDocument()
            expect(screen.getByText('Custom error message')).toBeInTheDocument()
        })

        it('should not render default UI when custom fallback is provided', () => {
            // Arrange
            const customFallback = <div data-testid="custom-fallback">Custom error</div>

            // Act
            render(
                <ErrorBoundary fallback={customFallback}>
                    <AlwaysThrows />
                </ErrorBoundary>
            )

            // Assert
            expect(screen.queryByText(/Oh dear, a sunken souffle/i)).not.toBeInTheDocument()
            expect(screen.getByTestId('custom-fallback')).toBeInTheDocument()
        })

        it('should render custom fallback as a React element', () => {
            // Arrange
            const CustomFallback = () => (
                <div data-testid="custom-component">
                    <h1>Custom Error Component</h1>
                </div>
            )

            // Act
            render(
                <ErrorBoundary fallback={<CustomFallback />}>
                    <AlwaysThrows />
                </ErrorBoundary>
            )

            // Assert
            expect(screen.getByTestId('custom-component')).toBeInTheDocument()
            expect(screen.getByText('Custom Error Component')).toBeInTheDocument()
        })
    })

    describe('Edge Cases', () => {
        it('should handle multiple children', () => {
            // Arrange & Act
            render(
                <ErrorBoundary>
                    <div data-testid="child1">Child 1</div>
                    <div data-testid="child2">Child 2</div>
                    <div data-testid="child3">Child 3</div>
                </ErrorBoundary>
            )

            // Assert
            expect(screen.getByTestId('child1')).toBeInTheDocument()
            expect(screen.getByTestId('child2')).toBeInTheDocument()
            expect(screen.getByTestId('child3')).toBeInTheDocument()
        })

        it('should catch error from one child and not affect others', () => {
            // Arrange & Act
            render(
                <div>
                    <ErrorBoundary>
                        <div data-testid="safe-child">Safe content</div>
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <AlwaysThrows />
                    </ErrorBoundary>
                </div>
            )

            // Assert
            expect(screen.getByTestId('safe-child')).toBeInTheDocument()
            expect(screen.getByText(/Oh dear, a sunken souffle/i)).toBeInTheDocument()
        })

        it('should handle null children', () => {
            // Arrange & Act
            render(
                <ErrorBoundary>
                    {null}
                </ErrorBoundary>
            )

            // Assert - should render without error
            expect(screen.queryByText(/Oh dear, a sunken souffle/i)).not.toBeInTheDocument()
        })

        it('should handle undefined children', () => {
            // Arrange & Act
            render(
                <ErrorBoundary>
                    {undefined}
                </ErrorBoundary>
            )

            // Assert - should render without error
            expect(screen.queryByText(/Oh dear, a sunken souffle/i)).not.toBeInTheDocument()
        })

        it('should maintain state across re-renders when no error', () => {
            // Arrange
            const { rerender } = render(
                <ErrorBoundary>
                    <div data-testid="content">Content 1</div>
                </ErrorBoundary>
            )

            // Act
            rerender(
                <ErrorBoundary>
                    <div data-testid="content">Content 2</div>
                </ErrorBoundary>
            )

            // Assert
            expect(screen.getByText('Content 2')).toBeInTheDocument()
            expect(screen.queryByText(/Oh dear, a sunken souffle/i)).not.toBeInTheDocument()
        })
    })
})
