import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Layout from '../../components/Layout'
import { trackEvent } from '../../lib/analytics'

// Mock analytics
vi.mock('../../lib/analytics', () => ({
    trackEvent: vi.fn()
}))

// Mock useAuth hook
vi.mock('../../hooks/useAuth', () => ({
    useAuth: () => ({
        user: null,
        loading: false,
        session: null
    })
}))

// Mock visual layer components (avoid rendering Three.js/WebGL)
// WatercolorCanvas is lazy-loaded in Layout.jsx, so mock returns synchronous component
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
            const { container } = render(
                <MemoryRouter>
                    <Layout>
                        <div>Test content</div>
                    </Layout>
                </MemoryRouter>
            )

            // Assert
            expect(screen.getByTestId('watercolor-filters')).toBeInTheDocument()
            // WatercolorCanvas is lazy-loaded, so check for placeholder in tests
            const placeholder = container.querySelector('.watercolor-canvas-placeholder')
            expect(placeholder).toBeInTheDocument()
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

            // Assert - Updated to match actual Layout.jsx class names
            const brandTitle = container.querySelector('.brand-title')
            const brandAccent = container.querySelector('.brand-accent')
            const brandSubtitle = container.querySelector('.brand-subtitle')

            expect(brandTitle).toBeInTheDocument()
            expect(brandTitle).toHaveTextContent('Sunday Brunch')
            expect(brandTitle).toHaveTextContent('with')
            expect(brandTitle).toHaveTextContent('Giselle')
            expect(brandAccent).toBeInTheDocument()
            expect(brandAccent).toHaveTextContent('with')
            expect(brandSubtitle).toBeInTheDocument()
            expect(brandSubtitle).toHaveTextContent('Whimsy, warmth, and wags')
        })

        it.skip('should render brand link that navigates to home', () => {
            // NOTE: This test is skipped because current Layout.jsx doesn't have a brand link
            // The brand title is now just an <h1> without a link wrapper
            // If brand link is added back, update this test
        })
    })

    describe('Primary Navigation', () => {
        it('should render all 5 navigation items', () => {
            // Arrange & Act - Updated to match actual Layout.jsx navigation
            render(
                <MemoryRouter>
                    <Layout>
                        <div>Test content</div>
                    </Layout>
                </MemoryRouter>
            )

            // Assert - Current Layout has: Home, Recipes, Episodes, Team (links), Login (button)
            const homeLink = screen.getByRole('link', { name: /Home/i })
            const recipesLink = screen.getByRole('link', { name: /Recipes/i })
            const episodesLink = screen.getByRole('link', { name: /Episodes/i })
            const teamLink = screen.getByRole('link', { name: /Team/i })
            const loginButton = screen.getByRole('button', { name: /Login/i })

            expect(homeLink).toBeInTheDocument()
            expect(recipesLink).toBeInTheDocument()
            expect(episodesLink).toBeInTheDocument()
            expect(teamLink).toBeInTheDocument()
            expect(loginButton).toBeInTheDocument()
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
            const homeLink = screen.getByRole('link', { name: /Home/i })
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
            const teamLink = screen.getByRole('link', { name: /Team/i })
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
            const episodesLink = screen.getByRole('link', { name: /Episodes/i })
            expect(episodesLink).toHaveAttribute('href', '/episodes/the-pie-that-started-a-dynasty')
        })

        it.skip('should have Newsletter link that navigates to /newsletter', () => {
            // NOTE: Newsletter link not in current Layout.jsx navigation
        })

        it.skip('should have Lab link that navigates to /lab', () => {
            // NOTE: Lab link not in current Layout.jsx navigation
        })

        it.skip('should have Recipes CTA link that navigates to /recipes', () => {
            // NOTE: Current layout uses standard Recipes link, not CTA variant
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
            const homeLink = screen.getByRole('link', { name: /Home/i })
            fireEvent.click(homeLink)

            // Assert
            expect(trackEvent).toHaveBeenCalledWith('nav_click', {
                label: 'Home',
                href: '/',
                from: '/'
            })
        })

        it('should call trackEvent when Recipes link is clicked', () => {
            // Arrange - Updated to match current Layout implementation
            render(
                <MemoryRouter initialEntries={['/']}>
                    <Layout>
                        <div>Test content</div>
                    </Layout>
                </MemoryRouter>
            )

            // Act
            const recipesLink = screen.getByRole('link', { name: /Recipes/i })
            fireEvent.click(recipesLink)

            // Assert
            expect(trackEvent).toHaveBeenCalledWith('nav_click', {
                label: 'Recipes',
                href: '/recipes',
                from: '/'
            })
        })

        it('should include correct label, href, and from (location) data in all nav clicks', () => {
            // Arrange - Updated to test actual navigation links
            render(
                <MemoryRouter initialEntries={['/']}>
                    <Layout>
                        <div>Test content</div>
                    </Layout>
                </MemoryRouter>
            )

            // Act - Click Home link
            const homeLink = screen.getByRole('link', { name: /Home/i })
            fireEvent.click(homeLink)

            // Assert - Verify Home nav click (from: '/' since we started at '/')
            expect(trackEvent).toHaveBeenNthCalledWith(1, 'nav_click', {
                label: 'Home',
                href: '/',
                from: '/'
            })

            // Act - Click Recipes link
            const recipesLink = screen.getByRole('link', { name: /Recipes/i })
            fireEvent.click(recipesLink)

            // Assert - Verify Recipes nav click (from: '/' since Home navigated to '/')
            expect(trackEvent).toHaveBeenNthCalledWith(2, 'nav_click', {
                label: 'Recipes',
                href: '/recipes',
                from: '/'
            })

            // Act - Click Episodes link
            const episodesLink = screen.getByRole('link', { name: /Episodes/i })
            fireEvent.click(episodesLink)

            // Assert - Verify Episodes nav click (from: '/recipes' since Recipes navigated there)
            // Note: handleNavClick passes '/episodes' not full path
            expect(trackEvent).toHaveBeenNthCalledWith(3, 'nav_click', {
                label: 'Episodes',
                href: '/episodes',
                from: '/recipes'
            })

            // Act - Click Team link
            const teamLink = screen.getByRole('link', { name: /Team/i })
            fireEvent.click(teamLink)

            // Assert - Verify Team nav click (from: '/episodes/the-pie-that-started-a-dynasty' since Episodes navigated there)
            expect(trackEvent).toHaveBeenNthCalledWith(4, 'nav_click', {
                label: 'Team',
                href: '/team',
                from: '/episodes/the-pie-that-started-a-dynasty'
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
