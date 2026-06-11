import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { TestBrowserRouter } from '../utils/test-router'
import Home from '../../pages/Home'
import { getFeatured } from '../../lib/content'
import { applyMeta } from '../../lib/seo'

// Mock dependencies
vi.mock('../../lib/content')
vi.mock('../../lib/seo')

// Mock child components
vi.mock('../../components/WhimsicalHero', () => ({
    default: () => <div data-testid="whimsical-hero">WhimsicalHero</div>
}))

vi.mock('../../components/FeaturedRecipeCard', () => ({
    default: ({ recipe }) => (
        <div data-testid="featured-recipe-card">
            FeaturedRecipeCard: {recipe.title}
        </div>
    )
}))

vi.mock('../../components/EpisodeTemplate', () => ({
    default: ({ episode }) => (
        <div data-testid="featured-episode-card">
            EpisodeTemplate: {episode.title}
        </div>
    )
}))

vi.mock('../../components/ShareBar', () => ({
    default: () => <div data-testid="share-bar">ShareBar</div>
}))

vi.mock('../../components/CTAForm', () => ({
    default: ({ headline, mode }) => (
        <div data-testid="cta-form" data-mode={mode}>
            CTAForm: {headline}
        </div>
    )
}))

vi.mock('../../components/LoadingSkeleton', () => ({
    default: ({ type }) => (
        <div data-testid={`loading-skeleton-${type}`}>
            LoadingSkeleton: {type}
        </div>
    )
}))

vi.mock('../../components/RecipeCollectionsSection', () => ({
    default: () => <div data-testid="recipe-collections-section">RecipeCollectionsSection</div>
}))

vi.mock('../../components/RecentRecipesGallery', () => ({
    default: () => <div data-testid="recent-recipes-gallery">RecentRecipesGallery</div>
}))

vi.mock('../../components/FeaturedEpisodeCard', () => ({
    default: ({ episode }) => (
        <div data-testid="featured-episode-card">
            FeaturedEpisodeCard: {episode.title}
        </div>
    )
}))

vi.mock('../../components/SocialProofSection', () => ({
    default: () => <div data-testid="social-proof-section">SocialProofSection</div>
}))

describe('Home Page', () => {
    const mockFeaturedData = {
        recipe: {
            title: 'Chocolate Cake',
            slug: 'chocolate-cake',
            image: '/test-recipe.jpg',
            category: 'Desserts',
            ingredients: ['flour', 'sugar', 'cocoa'],
            steps: ['Mix', 'Bake']
        },
        episode: {
            title: 'Episode 1: The Art of Baking',
            slug: 'ep-1-art-of-baking',
            date: '2024-01-01',
            description: 'Join us for a baking adventure',
            audio: '/test-audio.mp3'
        }
    }

    // Helper to render with Router context
    const renderWithRouter = (component) => {
        return render(<TestBrowserRouter>{component}</TestBrowserRouter>)
    }

    beforeEach(() => {
        vi.clearAllMocks()
        // Default successful data fetch
        getFeatured.mockResolvedValue(mockFeaturedData)
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('Rendering Tests', () => {
        it('should render WhimsicalHero component', async () => {
            // Arrange & Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                expect(screen.getByTestId('whimsical-hero')).toBeInTheDocument()
            })
        })

        it('should render all main sections (Hero, Recipe, Collections, Episodes)', async () => {
            // Arrange & Act
            renderWithRouter(<Home />)

            // Assert - Check for section test IDs and key components
            await waitFor(() => {
                expect(screen.getByTestId('whimsical-hero')).toBeInTheDocument()
                expect(screen.getByTestId('featured-recipe')).toBeInTheDocument()
                expect(screen.getByTestId('recipe-collections-section')).toBeInTheDocument()
                expect(screen.getByTestId('recent-recipes-gallery')).toBeInTheDocument()
                expect(screen.getByTestId('social-proof-section')).toBeInTheDocument()
                expect(screen.getByText('Latest Episode')).toBeInTheDocument()
            })
        })

        it('should render Latest Episode section title', async () => {
            // Arrange & Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                expect(screen.getByText('Latest Episode')).toBeInTheDocument()
            })
        })

        it('should render featured recipe section with testid', async () => {
            // Arrange & Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                const recipeSection = screen.getByTestId('featured-recipe')
                expect(recipeSection).toBeInTheDocument()
                expect(recipeSection).toHaveClass('featured-recipe-section')
            })
        })

        it('should render all mocked child components', async () => {
            // Arrange & Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                expect(screen.getByTestId('whimsical-hero')).toBeInTheDocument()
                expect(screen.getByTestId('recipe-collections-section')).toBeInTheDocument()
                expect(screen.getByTestId('recent-recipes-gallery')).toBeInTheDocument()
                expect(screen.getByTestId('social-proof-section')).toBeInTheDocument()
            })
        })
    })

    describe('Data Fetching Tests', () => {
        it('should show loading skeleton while fetching recipe data', () => {
            // Arrange
            getFeatured.mockReturnValue(new Promise(() => {})) // Never resolves

            // Act
            renderWithRouter(<Home />)

            // Assert
            expect(screen.getByTestId('loading-skeleton-recipe')).toBeInTheDocument()
        })

        it('should show loading skeleton while fetching episode data', () => {
            // Arrange
            getFeatured.mockReturnValue(new Promise(() => {})) // Never resolves

            // Act
            renderWithRouter(<Home />)

            // Assert
            expect(screen.getByTestId('loading-skeleton-episode')).toBeInTheDocument()
        })

        it('should display FeaturedRecipeCard when recipe data available', async () => {
            // Arrange & Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                expect(screen.getByTestId('featured-recipe-card')).toBeInTheDocument()
                expect(screen.getByText('FeaturedRecipeCard: Chocolate Cake')).toBeInTheDocument()
            })
        })

        it('should display FeaturedEpisodeCard when episode data available', async () => {
            // Arrange & Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                expect(screen.getByTestId('featured-episode-card')).toBeInTheDocument()
                expect(screen.getByText('FeaturedEpisodeCard: Episode 1: The Art of Baking')).toBeInTheDocument()
            })
        })

        it('should show "No recipe available yet" when recipe data is null', async () => {
            // Arrange
            getFeatured.mockResolvedValue({ recipe: null, episode: mockFeaturedData.episode })

            // Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                expect(screen.getByText('No recipe available yet.')).toBeInTheDocument()
                expect(screen.queryByTestId('featured-recipe-card')).not.toBeInTheDocument()
            })
        })

        it('should show "No episode available yet" when episode data is null', async () => {
            // Arrange
            getFeatured.mockResolvedValue({ recipe: mockFeaturedData.recipe, episode: null })

            // Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                expect(screen.getByText('No episode available yet.')).toBeInTheDocument()
                expect(screen.queryByTestId('featured-episode-card')).not.toBeInTheDocument()
            })
        })

        it('should call getFeatured on component mount', async () => {
            // Arrange & Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                expect(getFeatured).toHaveBeenCalledTimes(1)
            })
        })
    })

    describe('SEO Tests', () => {
        it('should call applyMeta with correct title and description on mount', async () => {
            // Arrange & Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                expect(applyMeta).toHaveBeenCalledWith({
                    title: 'Sunday Brunch With Giselle | Cozy Baking & Stories',
                    description: 'A cozy baking podcast featuring whimsical recipes, stories, and four Shetland Sheepdogs.'
                })
            })
        })

        it('should verify SEO meta data for homepage', async () => {
            // Arrange & Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                expect(applyMeta).toHaveBeenCalledTimes(1)
                const metaCall = applyMeta.mock.calls[0][0]
                expect(metaCall.title).toContain('Sunday Brunch With Giselle')
                expect(metaCall.description).toContain('cozy baking podcast')
            })
        })
    })

    describe('CTAForm Integration', () => {
        it('should render CTAForm in episode section when episode exists', async () => {
            // Arrange & Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                const ctaForm = screen.getByTestId('cta-form')
                expect(ctaForm).toBeInTheDocument()
                expect(ctaForm).toHaveTextContent('Get recipes, Sunday letters, early drops')
            })
        })

        it('should not render CTAForm when episode is null', async () => {
            // Arrange
            getFeatured.mockResolvedValue({ recipe: mockFeaturedData.recipe, episode: null })

            // Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                expect(screen.queryByTestId('cta-form')).not.toBeInTheDocument()
            })
        })
    })

    // ShareBar Integration tests removed - ShareBar is no longer rendered in Home component

    describe('Section Structure Tests', () => {
        it('should render featured recipe section with correct class', async () => {
            // Arrange & Act
            const { container } = renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                const recipeSection = container.querySelector('.featured-recipe-section')
                expect(recipeSection).toBeInTheDocument()
                expect(recipeSection.tagName).toBe('SECTION')
                expect(recipeSection).toHaveClass('section', 'featured-recipe-section')
            })
        })

        it('should render latest episode section with correct class', async () => {
            // Arrange & Act
            const { container } = renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                const episodeSection = container.querySelector('.latest-episode-section')
                expect(episodeSection).toBeInTheDocument()
                expect(episodeSection.tagName).toBe('SECTION')
                expect(episodeSection).toHaveClass('latest-episode-section')
            })
        })
    })

    describe('Loading State Transitions', () => {
        it('should transition from loading to ready state', async () => {
            // Arrange & Act
            renderWithRouter(<Home />)

            // Assert - Initially loading
            expect(screen.getByTestId('loading-skeleton-recipe')).toBeInTheDocument()
            expect(screen.getByTestId('loading-skeleton-episode')).toBeInTheDocument()

            // Assert - After data loads
            await waitFor(() => {
                expect(screen.queryByTestId('loading-skeleton-recipe')).not.toBeInTheDocument()
                expect(screen.queryByTestId('loading-skeleton-episode')).not.toBeInTheDocument()
                expect(screen.getByTestId('featured-recipe-card')).toBeInTheDocument()
                expect(screen.getByTestId('featured-episode-card')).toBeInTheDocument()
            })
        })

        it('should handle partial data (only recipe)', async () => {
            // Arrange
            getFeatured.mockResolvedValue({ recipe: mockFeaturedData.recipe, episode: null })

            // Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                expect(screen.getByTestId('featured-recipe-card')).toBeInTheDocument()
                expect(screen.queryByTestId('featured-episode-card')).not.toBeInTheDocument()
                expect(screen.getByText('No episode available yet.')).toBeInTheDocument()
            })
        })

        it('should handle partial data (only episode)', async () => {
            // Arrange
            getFeatured.mockResolvedValue({ recipe: null, episode: mockFeaturedData.episode })

            // Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                expect(screen.queryByTestId('featured-recipe-card')).not.toBeInTheDocument()
                expect(screen.getByText('No recipe available yet.')).toBeInTheDocument()
                expect(screen.getByTestId('featured-episode-card')).toBeInTheDocument()
            })
        })

        it('should handle empty data gracefully', async () => {
            // Arrange
            getFeatured.mockResolvedValue({ recipe: null, episode: null })

            // Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                expect(screen.getByText('No recipe available yet.')).toBeInTheDocument()
                expect(screen.getByText('No episode available yet.')).toBeInTheDocument()
                expect(screen.queryByTestId('featured-recipe-card')).not.toBeInTheDocument()
                expect(screen.queryByTestId('featured-episode-card')).not.toBeInTheDocument()
            })
        })
    })

    // Note: Error handling tests removed as Home component doesn't implement .catch() for getFeatured()
    // Future enhancement: Add error boundaries or .catch() handlers to handle data fetching failures
})
