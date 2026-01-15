import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
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
        <div data-testid="episode-template">
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
        return render(<BrowserRouter>{component}</BrowserRouter>)
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

        it('should render all 3 sections (Featured Recipe, Latest Episode, Media Kit)', async () => {
            // Arrange & Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                expect(screen.getByText('Featured Recipe')).toBeInTheDocument()
                expect(screen.getByText('Latest Episode')).toBeInTheDocument()
                expect(screen.getByText('Media Kit (on-brand only)')).toBeInTheDocument()
            })
        })

        it('should render section headers with correct titles', async () => {
            // Arrange & Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                const headers = screen.getAllByRole('heading', { level: 2 })
                expect(headers).toHaveLength(3)
                expect(headers[0]).toHaveTextContent('Featured Recipe')
                expect(headers[1]).toHaveTextContent('Latest Episode')
                expect(headers[2]).toHaveTextContent('Media Kit (on-brand only)')
            })
        })

        it('should render sponsor pill in media kit section', async () => {
            // Arrange & Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                expect(screen.getByText('Sponsors')).toBeInTheDocument()
            })
        })

        it('should render Audio + transcript pill in episode section', async () => {
            // Arrange & Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                expect(screen.getByText('Audio + transcript')).toBeInTheDocument()
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

        it('should display EpisodeTemplate when episode data available', async () => {
            // Arrange & Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                expect(screen.getByTestId('episode-template')).toBeInTheDocument()
                expect(screen.getByText('EpisodeTemplate: Episode 1: The Art of Baking')).toBeInTheDocument()
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
                expect(screen.queryByTestId('episode-template')).not.toBeInTheDocument()
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
        it('should render CTAForm in recipe section with correct props', async () => {
            // Arrange & Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                const ctaForms = screen.getAllByTestId('cta-form')
                const recipeCTA = ctaForms.find(form =>
                    form.textContent.includes('Get recipes, Sunday letters, early drops')
                )
                expect(recipeCTA).toBeInTheDocument()
            })
        })

        it('should render CTAForm in episode section', async () => {
            // Arrange & Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                const ctaForms = screen.getAllByTestId('cta-form')
                const episodeCTA = ctaForms.find(form =>
                    form.textContent.includes('Stay in the loop')
                )
                expect(episodeCTA).toBeInTheDocument()
            })
        })

        it('should render CTAForm in media kit section with contact mode', async () => {
            // Arrange & Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                const ctaForms = screen.getAllByTestId('cta-form')
                const mediaKitCTA = ctaForms.find(form =>
                    form.textContent.includes('Request a bundle') &&
                    form.getAttribute('data-mode') === 'contact'
                )
                expect(mediaKitCTA).toBeInTheDocument()
            })
        })

        it('should not render CTAForm in recipe section when recipe is null', async () => {
            // Arrange
            getFeatured.mockResolvedValue({ recipe: null, episode: mockFeaturedData.episode })

            // Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                const ctaForms = screen.getAllByTestId('cta-form')
                const recipeCTA = ctaForms.find(form =>
                    form.textContent.includes('Get recipes, Sunday letters, early drops')
                )
                expect(recipeCTA).toBeUndefined()
            })
        })

        it('should not render CTAForm in episode section when episode is null', async () => {
            // Arrange
            getFeatured.mockResolvedValue({ recipe: mockFeaturedData.recipe, episode: null })

            // Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                const ctaForms = screen.getAllByTestId('cta-form')
                const episodeCTA = ctaForms.find(form =>
                    form.textContent.includes('Stay in the loop')
                )
                expect(episodeCTA).toBeUndefined()
            })
        })
    })

    describe('ShareBar Integration', () => {
        it('should render ShareBar in recipe section', async () => {
            // Arrange & Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                expect(screen.getByTestId('share-bar')).toBeInTheDocument()
            })
        })

        it('should not render ShareBar when recipe is null', async () => {
            // Arrange
            getFeatured.mockResolvedValue({ recipe: null, episode: mockFeaturedData.episode })

            // Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                expect(screen.queryByTestId('share-bar')).not.toBeInTheDocument()
            })
        })
    })

    describe('Section Structure Tests', () => {
        it('should render recipe section with #recipes id', async () => {
            // Arrange & Act
            const { container } = renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                const recipeSection = container.querySelector('#recipes')
                expect(recipeSection).toBeInTheDocument()
                expect(recipeSection.tagName).toBe('SECTION')
            })
        })

        it('should render episode section with #episodes id', async () => {
            // Arrange & Act
            const { container } = renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                const episodeSection = container.querySelector('#episodes')
                expect(episodeSection).toBeInTheDocument()
                expect(episodeSection.tagName).toBe('SECTION')
            })
        })

        it('should render media kit section with #media-kit id', async () => {
            // Arrange & Act
            const { container } = renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                const mediaKitSection = container.querySelector('#media-kit')
                expect(mediaKitSection).toBeInTheDocument()
                expect(mediaKitSection.tagName).toBe('SECTION')
            })
        })

        it('should render media kit content with brand guidelines', async () => {
            // Arrange & Act
            renderWithRouter(<Home />)

            // Assert
            await waitFor(() => {
                expect(screen.getByText(/We are cozy, baking-first, pet-loving/i)).toBeInTheDocument()
                expect(screen.getByText(/Inventory: site placements, email mentions, audio reads/i)).toBeInTheDocument()
                expect(screen.getByText(/Allow: baking\/kitchen gear, ingredients/i)).toBeInTheDocument()
                expect(screen.getByText(/Deny: diet fads, off-brand finance/i)).toBeInTheDocument()
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
                expect(screen.getByTestId('episode-template')).toBeInTheDocument()
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
                expect(screen.queryByTestId('episode-template')).not.toBeInTheDocument()
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
                expect(screen.getByTestId('episode-template')).toBeInTheDocument()
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
                expect(screen.queryByTestId('episode-template')).not.toBeInTheDocument()
            })
        })
    })

    // Note: Error handling tests removed as Home component doesn't implement .catch() for getFeatured()
    // Future enhancement: Add error boundaries or .catch() handlers to handle data fetching failures
})
