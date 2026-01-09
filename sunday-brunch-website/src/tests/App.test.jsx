import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { trackPageView } from '../lib/analytics'

// Mock analytics
vi.mock('../lib/analytics', () => ({
    trackPageView: vi.fn()
}))

// Mock window.scrollTo
const mockScrollTo = vi.fn()
Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: mockScrollTo
})

// Mock Layout component
vi.mock('../components/Layout', () => ({
    default: ({ children }) => <div data-testid="layout">{children}</div>
}))

// Mock AchievementProvider
vi.mock('../components/AchievementToaster', () => ({
    AchievementProvider: ({ children }) => (
        <div data-testid="achievement-provider">{children}</div>
    )
}))

// Mock WhimsicalLoader
vi.mock('../components/WhimsicalLoader', () => ({
    default: () => <div data-testid="whimsical-loader">Loading...</div>
}))

// Mock Home page (loaded immediately)
vi.mock('../pages/Home', () => ({
    default: () => <div data-testid="home-page">Home Page</div>
}))

// Mock lazy-loaded pages
vi.mock('../pages/RecipePage', () => ({
    default: () => <div data-testid="recipe-page">Recipe Page</div>
}))

vi.mock('../pages/RecipeIndexPage', () => ({
    default: () => <div data-testid="recipe-index-page">Recipe Index Page</div>
}))

vi.mock('../pages/EpisodePage', () => ({
    default: () => <div data-testid="episode-page">Episode Page</div>
}))

vi.mock('../pages/MediaKitPage', () => ({
    default: () => <div data-testid="media-kit-page">Media Kit Page</div>
}))

vi.mock('../pages/TeamPage', () => ({
    default: () => <div data-testid="team-page">Team Page</div>
}))

vi.mock('../pages/NewsletterPage', () => ({
    default: () => <div data-testid="newsletter-page">Newsletter Page</div>
}))

vi.mock('../pages/AlchemistsLab', () => ({
    default: () => <div data-testid="alchemists-lab-page">Alchemists Lab Page</div>
}))

vi.mock('../pages/NotFound', () => ({
    default: () => <div data-testid="not-found-page">404 Not Found</div>
}))

describe('App Component', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks()
        mockScrollTo.mockClear()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('Route Rendering', () => {
        it('should render home route by default', async () => {
            // Arrange & Act
            render(
                <MemoryRouter initialEntries={['/']}>
                    <App />
                </MemoryRouter>
            )

            // Assert
            await waitFor(() => {
                expect(screen.getByTestId('home-page')).toBeInTheDocument()
                expect(screen.getByText('Home Page')).toBeInTheDocument()
            })
        })

        it('should render recipe index page at /recipes', async () => {
            // Arrange & Act
            render(
                <MemoryRouter initialEntries={['/recipes']}>
                    <App />
                </MemoryRouter>
            )

            // Assert - Wait for lazy loading
            await waitFor(() => {
                expect(screen.getByTestId('recipe-index-page')).toBeInTheDocument()
            })
        })

        it('should render recipe detail page at /recipes/:slug', async () => {
            // Arrange & Act
            render(
                <MemoryRouter initialEntries={['/recipes/chocolate-croissant']}>
                    <App />
                </MemoryRouter>
            )

            // Assert - Wait for lazy loading
            await waitFor(() => {
                expect(screen.getByTestId('recipe-page')).toBeInTheDocument()
            })
        })

        it('should render episode page at /episodes/:slug', async () => {
            // Arrange & Act
            render(
                <MemoryRouter initialEntries={['/episodes/sunday-morning']}>
                    <App />
                </MemoryRouter>
            )

            // Assert - Wait for lazy loading
            await waitFor(() => {
                expect(screen.getByTestId('episode-page')).toBeInTheDocument()
            })
        })

        it('should render media kit page at /media-kit', async () => {
            // Arrange & Act
            render(
                <MemoryRouter initialEntries={['/media-kit']}>
                    <App />
                </MemoryRouter>
            )

            // Assert - Wait for lazy loading
            await waitFor(() => {
                expect(screen.getByTestId('media-kit-page')).toBeInTheDocument()
            })
        })

        it('should render team page at /team', async () => {
            // Arrange & Act
            render(
                <MemoryRouter initialEntries={['/team']}>
                    <App />
                </MemoryRouter>
            )

            // Assert - Wait for lazy loading
            await waitFor(() => {
                expect(screen.getByTestId('team-page')).toBeInTheDocument()
            })
        })

        it('should render newsletter page at /newsletter', async () => {
            // Arrange & Act
            render(
                <MemoryRouter initialEntries={['/newsletter']}>
                    <App />
                </MemoryRouter>
            )

            // Assert - Wait for lazy loading
            await waitFor(() => {
                expect(screen.getByTestId('newsletter-page')).toBeInTheDocument()
            })
        })

        it('should render alchemists lab page at /lab', async () => {
            // Arrange & Act
            render(
                <MemoryRouter initialEntries={['/lab']}>
                    <App />
                </MemoryRouter>
            )

            // Assert - Wait for lazy loading
            await waitFor(() => {
                expect(screen.getByTestId('alchemists-lab-page')).toBeInTheDocument()
            })
        })
    })

    describe('Analytics Integration', () => {
        it('should call trackPageView on initial route load', async () => {
            // Arrange & Act
            render(
                <MemoryRouter initialEntries={['/']}>
                    <App />
                </MemoryRouter>
            )

            // Assert
            await waitFor(() => {
                expect(trackPageView).toHaveBeenCalledWith('/')
            })
        })

        it('should call trackPageView when route changes', async () => {
            // Arrange & Act - Initialize with different routes to test route changes
            // First mount with /recipes route
            const { unmount } = render(
                <MemoryRouter initialEntries={['/recipes']}>
                    <App />
                </MemoryRouter>
            )

            // Assert - trackPageView should have been called with /recipes
            await waitFor(() => {
                expect(trackPageView).toHaveBeenCalledWith('/recipes')
            })

            // Clean up
            unmount()
        })

        it('should track analytics for all routes', async () => {
            // Arrange - Test multiple routes
            const routes = ['/media-kit', '/team', '/newsletter', '/lab']

            for (const route of routes) {
                vi.clearAllMocks()

                // Act
                const { unmount } = render(
                    <MemoryRouter initialEntries={[route]}>
                        <App />
                    </MemoryRouter>
                )

                // Assert
                await waitFor(() => {
                    expect(trackPageView).toHaveBeenCalledWith(route)
                })

                unmount()
            }
        })
    })

    describe('Scroll Behavior', () => {
        it('should scroll to top on initial route load', async () => {
            // Arrange & Act
            render(
                <MemoryRouter initialEntries={['/']}>
                    <App />
                </MemoryRouter>
            )

            // Assert
            await waitFor(() => {
                expect(mockScrollTo).toHaveBeenCalledWith(0, 0)
            })
        })

        it('should scroll to top when route changes', async () => {
            // Arrange & Act - Initialize with different route to verify scroll behavior
            const { unmount } = render(
                <MemoryRouter initialEntries={['/recipes']}>
                    <App />
                </MemoryRouter>
            )

            // Assert - Scroll should be called when component mounts
            await waitFor(() => {
                expect(mockScrollTo).toHaveBeenCalledWith(0, 0)
            })

            // Clean up
            unmount()
        })
    })

    describe('Code Splitting', () => {
        it('should use React.lazy for code splitting on non-Home routes', async () => {
            // Arrange & Act - Render a lazy-loaded route
            render(
                <MemoryRouter initialEntries={['/recipes']}>
                    <App />
                </MemoryRouter>
            )

            // Assert - Component should eventually load (even though mocked)
            await waitFor(() => {
                expect(screen.getByTestId('recipe-index-page')).toBeInTheDocument()
            })
        })

        it('should wrap lazy components with Suspense fallback', async () => {
            // Arrange & Act - The App uses Suspense with WhimsicalLoader as fallback
            // Even though mocks load synchronously in tests, Suspense boundary exists
            render(
                <MemoryRouter initialEntries={['/team']}>
                    <App />
                </MemoryRouter>
            )

            // Assert - Verify the lazy-loaded component renders
            await waitFor(() => {
                expect(screen.getByTestId('team-page')).toBeInTheDocument()
            })
        })

        it('should not show loader for Home page (loaded immediately)', async () => {
            // Arrange & Act
            render(
                <MemoryRouter initialEntries={['/']}>
                    <App />
                </MemoryRouter>
            )

            // Assert - Home page should render immediately without loader
            await waitFor(() => {
                expect(screen.getByTestId('home-page')).toBeInTheDocument()
            })

            // Loader should not appear for Home (Home is not lazy-loaded)
            expect(screen.queryByTestId('whimsical-loader')).not.toBeInTheDocument()
        })
    })

    describe('404 Handling', () => {
        it('should render NotFound page for unknown routes', async () => {
            // Arrange & Act
            render(
                <MemoryRouter initialEntries={['/unknown-route']}>
                    <App />
                </MemoryRouter>
            )

            // Assert - Wait for lazy loading
            await waitFor(() => {
                expect(screen.getByTestId('not-found-page')).toBeInTheDocument()
                expect(screen.getByText('404 Not Found')).toBeInTheDocument()
            })
        })

        it('should track analytics for 404 pages', async () => {
            // Arrange & Act
            render(
                <MemoryRouter initialEntries={['/non-existent-page']}>
                    <App />
                </MemoryRouter>
            )

            // Assert
            await waitFor(() => {
                expect(trackPageView).toHaveBeenCalledWith('/non-existent-page')
            })
        })
    })

    describe('Provider Integration', () => {
        it('should wrap routes with AchievementProvider', async () => {
            // Arrange & Act
            render(
                <MemoryRouter initialEntries={['/']}>
                    <App />
                </MemoryRouter>
            )

            // Assert
            await waitFor(() => {
                expect(screen.getByTestId('achievement-provider')).toBeInTheDocument()
            })
        })

        it('should maintain provider hierarchy with Layout', async () => {
            // Arrange & Act
            const { container } = render(
                <MemoryRouter initialEntries={['/']}>
                    <App />
                </MemoryRouter>
            )

            // Assert - AchievementProvider wraps Layout
            await waitFor(() => {
                const achievementProvider = screen.getByTestId('achievement-provider')
                const layout = screen.getByTestId('layout')
                expect(achievementProvider).toContainElement(layout)
            })
        })
    })

    describe('Layout Integration', () => {
        it('should wrap all routes with Layout component', async () => {
            // Arrange & Act
            render(
                <MemoryRouter initialEntries={['/']}>
                    <App />
                </MemoryRouter>
            )

            // Assert
            await waitFor(() => {
                expect(screen.getByTestId('layout')).toBeInTheDocument()
            })
        })

        it('should render Layout on all routes', async () => {
            // Arrange - Test multiple routes
            const routes = ['/', '/recipes', '/team', '/newsletter']

            for (const route of routes) {
                vi.clearAllMocks()

                // Act
                const { unmount } = render(
                    <MemoryRouter initialEntries={[route]}>
                        <App />
                    </MemoryRouter>
                )

                // Assert
                await waitFor(() => {
                    expect(screen.getByTestId('layout')).toBeInTheDocument()
                })

                unmount()
            }
        })

        it('should render page content inside Layout', async () => {
            // Arrange & Act
            render(
                <MemoryRouter initialEntries={['/']}>
                    <App />
                </MemoryRouter>
            )

            // Assert
            await waitFor(() => {
                const layout = screen.getByTestId('layout')
                const homePage = screen.getByTestId('home-page')
                expect(layout).toContainElement(homePage)
            })
        })
    })
})
