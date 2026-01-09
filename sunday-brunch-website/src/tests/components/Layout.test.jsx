import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Layout from '../../components/Layout'
import { trackEvent } from '../../lib/analytics'

// Mock analytics
vi.mock('../../lib/analytics', () => ({
    trackEvent: vi.fn()
}))

// Mock visual layer components (avoid rendering Three.js/WebGL)
vi.mock('../../components/WatercolorCanvas', () => ({
    default: () => <div data-testid="watercolor-canvas">Watercolor Canvas</div>
}))

vi.mock('../../components/illustrations/WatercolorFilters', () => ({
    default: () => <div data-testid="watercolor-filters">Watercolor Filters</div>
}))

vi.mock('../../components/WhimsyLayer', () => ({
    default: () => <div data-testid="whimsy-layer">Whimsy Layer</div>
}))

vi.mock('../../components/SheltieSightings', () => ({
    default: () => <div data-testid="sheltie-sightings">Sheltie Sightings</div>
}))

vi.mock('../../components/PawFollower', () => ({
    default: () => <div data-testid="paw-follower">Paw Follower</div>
}))

vi.mock('../../components/FloatingActionButtons', () => ({
    default: () => <div data-testid="floating-action-buttons">Floating Action Buttons</div>
}))

// Mock WhimsicalButton component
vi.mock('../../components/WhimsicalButton', () => ({
    default: ({ children, onClick, variant, type, className }) => (
        <button
            onClick={onClick}
            data-variant={variant}
            data-type={type}
            className={className}
        >
            {children}
        </button>
    )
}))

describe('Layout Component', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('Component Rendering', () => {
        it('should render all visual layer components', () => {
            // Arrange & Act
            render(
                <MemoryRouter>
                    <Layout>
                        <div>Test content</div>
                    </Layout>
                </MemoryRouter>
            )

            // Assert
            expect(screen.getByTestId('watercolor-filters')).toBeInTheDocument()
            expect(screen.getByTestId('watercolor-canvas')).toBeInTheDocument()
            expect(screen.getByTestId('whimsy-layer')).toBeInTheDocument()
            expect(screen.getByTestId('sheltie-sightings')).toBeInTheDocument()
            expect(screen.getByTestId('paw-follower')).toBeInTheDocument()
            expect(screen.getByTestId('floating-action-buttons')).toBeInTheDocument()
        })

        it('should render children prop in main element', () => {
            // Arrange & Act
            render(
                <MemoryRouter>
                    <Layout>
                        <div data-testid="test-child">Test child content</div>
                    </Layout>
                </MemoryRouter>
            )

            // Assert
            const mainElement = screen.getByRole('main')
            const childElement = screen.getByTestId('test-child')
            expect(mainElement).toBeInTheDocument()
            expect(mainElement).toContainElement(childElement)
            expect(childElement).toHaveTextContent('Test child content')
        })
    })

    describe('Brand Section', () => {
        it('should render brand title and subtitle', () => {
            // Arrange & Act
            const { container } = render(
                <MemoryRouter>
                    <Layout>
                        <div>Test content</div>
                    </Layout>
                </MemoryRouter>
            )

            // Assert
            const brandTitle = container.querySelector('.brand__title')
            const scriptAccent = container.querySelector('.script-accent-masthead')
            const brandSubtitle = container.querySelector('.brand__subtitle')

            expect(brandTitle).toBeInTheDocument()
            expect(brandTitle).toHaveTextContent('Sunday Brunch')
            expect(brandTitle).toHaveTextContent('with')
            expect(brandTitle).toHaveTextContent('Giselle')
            expect(scriptAccent).toBeInTheDocument()
            expect(scriptAccent).toHaveTextContent('with')
            expect(brandSubtitle).toBeInTheDocument()
            expect(brandSubtitle).toHaveTextContent('Whimsy, warmth, and wags')
        })

        it('should render brand link that navigates to home', () => {
            // Arrange & Act
            render(
                <MemoryRouter>
                    <Layout>
                        <div>Test content</div>
                    </Layout>
                </MemoryRouter>
            )

            // Assert
            const brandLink = screen.getByRole('link', { name: /Sunday Brunch with Giselle Whimsy, warmth, and wags/i })
            expect(brandLink).toBeInTheDocument()
            expect(brandLink).toHaveAttribute('href', '/')
            expect(brandLink).toHaveClass('brand-link')
        })
    })

    describe('Primary Navigation', () => {
        it('should render all 6 navigation links', () => {
            // Arrange & Act
            render(
                <MemoryRouter>
                    <Layout>
                        <div>Test content</div>
                    </Layout>
                </MemoryRouter>
            )

            // Assert
            const nav = screen.getByRole('navigation', { name: 'Primary' })
            expect(nav).toBeInTheDocument()

            const homeButton = screen.getByRole('button', { name: /Home/i })
            const teamButton = screen.getByRole('button', { name: /Team/i })
            const episodesButton = screen.getByRole('button', { name: /Episodes/i })
            const newsletterButton = screen.getByRole('button', { name: /Newsletter/i })
            const labButton = screen.getByRole('button', { name: /The Lab/i })
            const recipesButton = screen.getByRole('button', { name: /Get recipes/i })

            expect(homeButton).toBeInTheDocument()
            expect(teamButton).toBeInTheDocument()
            expect(episodesButton).toBeInTheDocument()
            expect(newsletterButton).toBeInTheDocument()
            expect(labButton).toBeInTheDocument()
            expect(recipesButton).toBeInTheDocument()
        })

        it('should have Home link that navigates to /', () => {
            // Arrange & Act
            render(
                <MemoryRouter>
                    <Layout>
                        <div>Test content</div>
                    </Layout>
                </MemoryRouter>
            )

            // Assert
            const homeButton = screen.getByRole('button', { name: /Home/i })
            const homeLink = homeButton.closest('a')
            expect(homeLink).toHaveAttribute('href', '/')
        })

        it('should have Team link that navigates to /team', () => {
            // Arrange & Act
            render(
                <MemoryRouter>
                    <Layout>
                        <div>Test content</div>
                    </Layout>
                </MemoryRouter>
            )

            // Assert
            const teamButton = screen.getByRole('button', { name: /Team/i })
            const teamLink = teamButton.closest('a')
            expect(teamLink).toHaveAttribute('href', '/team')
        })

        it('should have Episodes link that navigates to /episodes/*', () => {
            // Arrange & Act
            render(
                <MemoryRouter>
                    <Layout>
                        <div>Test content</div>
                    </Layout>
                </MemoryRouter>
            )

            // Assert
            const episodesButton = screen.getByRole('button', { name: /Episodes/i })
            const episodesLink = episodesButton.closest('a')
            expect(episodesLink).toHaveAttribute('href', '/episodes/the-pie-that-started-a-dynasty')
        })

        it('should have Newsletter link that navigates to /newsletter', () => {
            // Arrange & Act
            render(
                <MemoryRouter>
                    <Layout>
                        <div>Test content</div>
                    </Layout>
                </MemoryRouter>
            )

            // Assert
            const newsletterButton = screen.getByRole('button', { name: /Newsletter/i })
            const newsletterLink = newsletterButton.closest('a')
            expect(newsletterLink).toHaveAttribute('href', '/newsletter')
        })

        it('should have Lab link that navigates to /lab', () => {
            // Arrange & Act
            render(
                <MemoryRouter>
                    <Layout>
                        <div>Test content</div>
                    </Layout>
                </MemoryRouter>
            )

            // Assert
            const labButton = screen.getByRole('button', { name: /The Lab/i })
            const labLink = labButton.closest('a')
            expect(labLink).toHaveAttribute('href', '/lab')
        })

        it('should have Recipes CTA link that navigates to /recipes', () => {
            // Arrange & Act
            render(
                <MemoryRouter>
                    <Layout>
                        <div>Test content</div>
                    </Layout>
                </MemoryRouter>
            )

            // Assert
            const recipesButton = screen.getByRole('button', { name: /Get recipes/i })
            const recipesLink = recipesButton.closest('a')
            expect(recipesLink).toHaveAttribute('href', '/recipes')
            expect(recipesButton).toHaveClass('nav-cta')
            expect(recipesButton).toHaveAttribute('data-type', 'primary')
        })
    })

    describe('Analytics Tracking', () => {
        it('should call trackEvent when Home link is clicked', () => {
            // Arrange
            render(
                <MemoryRouter initialEntries={['/']}>
                    <Layout>
                        <div>Test content</div>
                    </Layout>
                </MemoryRouter>
            )

            // Act
            const homeButton = screen.getByRole('button', { name: /Home/i })
            fireEvent.click(homeButton)

            // Assert
            expect(trackEvent).toHaveBeenCalledWith('nav_click', {
                label: 'Home',
                href: '/',
                from: '/'
            })
        })

        it('should call trackEvent when Recipes CTA is clicked', () => {
            // Arrange
            render(
                <MemoryRouter initialEntries={['/newsletter']}>
                    <Layout>
                        <div>Test content</div>
                    </Layout>
                </MemoryRouter>
            )

            // Act
            const recipesButton = screen.getByRole('button', { name: /Get recipes/i })
            fireEvent.click(recipesButton)

            // Assert
            expect(trackEvent).toHaveBeenCalledWith('nav_click', {
                label: 'Recipes CTA',
                href: '/recipes',
                from: '/newsletter'
            })
        })

        it('should include correct label, href, and from (location) data in all nav clicks', () => {
            // Arrange
            render(
                <MemoryRouter initialEntries={['/team']}>
                    <Layout>
                        <div>Test content</div>
                    </Layout>
                </MemoryRouter>
            )

            // Act - Click Team button
            const teamButton = screen.getByRole('button', { name: /Team/i })
            fireEvent.click(teamButton)

            // Assert - Verify Team nav click
            expect(trackEvent).toHaveBeenNthCalledWith(1, 'nav_click', {
                label: 'Team',
                href: '/team',
                from: '/team'
            })

            // Act - Click Episodes button
            const episodesButton = screen.getByRole('button', { name: /Episodes/i })
            fireEvent.click(episodesButton)

            // Assert - Verify Episodes nav click (location may have changed)
            expect(trackEvent).toHaveBeenNthCalledWith(2, 'nav_click', {
                label: 'Episodes',
                href: '/episodes/the-pie-that-started-a-dynasty',
                from: expect.any(String) // Location may change after clicking link
            })

            // Act - Click Newsletter button
            const newsletterButton = screen.getByRole('button', { name: /Newsletter/i })
            fireEvent.click(newsletterButton)

            // Assert - Verify Newsletter nav click
            expect(trackEvent).toHaveBeenNthCalledWith(3, 'nav_click', {
                label: 'Newsletter',
                href: '/newsletter',
                from: expect.any(String)
            })

            // Act - Click Lab button
            const labButton = screen.getByRole('button', { name: /The Lab/i })
            fireEvent.click(labButton)

            // Assert - Verify Lab nav click
            expect(trackEvent).toHaveBeenNthCalledWith(4, 'nav_click', {
                label: 'The Lab',
                href: '/lab',
                from: expect.any(String)
            })

            expect(trackEvent).toHaveBeenCalledTimes(4)
        })
    })

    describe('Footer', () => {
        it('should render copyright text', () => {
            // Arrange & Act
            render(
                <MemoryRouter>
                    <Layout>
                        <div>Test content</div>
                    </Layout>
                </MemoryRouter>
            )

            // Assert
            const copyrightText = screen.getByText(/© 2024 Sunday Brunch With Giselle/i)
            expect(copyrightText).toBeInTheDocument()
            expect(copyrightText).toHaveTextContent('Recipes, stories, and Sheltie side-eye.')
        })

        it('should render pawprint decorations', () => {
            // Arrange & Act
            const { container } = render(
                <MemoryRouter>
                    <Layout>
                        <div>Test content</div>
                    </Layout>
                </MemoryRouter>
            )

            // Assert
            const footer = screen.getByRole('contentinfo')
            expect(footer).toBeInTheDocument()

            const pawIcons = container.querySelectorAll('.paw-icon')
            expect(pawIcons).toHaveLength(6)

            // Verify each pawprint has correct structure (4 circles)
            pawIcons.forEach(pawIcon => {
                const circles = pawIcon.querySelectorAll('circle')
                expect(circles).toHaveLength(4)
            })
        })
    })
})
