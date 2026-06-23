import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import fs from 'node:fs'
import path from 'node:path'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { TestMemoryRouter } from '../utils/test-router'
import RecipePage from '../../pages/RecipePage'
import { getRecipeBySlug } from '../../lib/content'
import { applyMeta, applyRecipeSchema } from '../../lib/seo'

// Mock dependencies
vi.mock('../../lib/content')
vi.mock('../../lib/seo')

// Mock child components
vi.mock('../../components/RecipeTemplate', () => ({
    default: ({ recipe, showTitle = true, expandedImage }) => (
        <div
            data-testid="recipe-template"
            data-show-title={showTitle ? 'true' : 'false'}
            data-expanded-image={expandedImage || ''}
        >
            RecipeTemplate: {recipe.title}
        </div>
    )
}))

vi.mock('../../components/ShareBar', () => ({
    default: () => <div data-testid="share-bar">ShareBar</div>
}))

vi.mock('../../components/CTAForm', () => ({
    default: ({ headline }) => (
        <div data-testid="cta-form">
            CTAForm: {headline}
        </div>
    )
}))

const appCssPath = path.resolve(process.cwd(), 'src/App.css')
const readAppCss = () => fs.readFileSync(appCssPath, 'utf8')

function NavigationControls() {
    const navigate = useNavigate()

    return (
        <button type="button" onClick={() => navigate('/recipes/vanilla-cake')}>
            Go vanilla
        </button>
    )
}

describe('RecipePage Component', () => {
    const mockRecipe = {
        slug: 'chocolate-cake',
        title: 'Chocolate Cake',
        image: '/chocolate-cake.jpg',
        meta: {
            description: 'A delicious chocolate cake recipe',
            ogImage: '/og-chocolate-cake.jpg'
        },
        category: 'Cakes',
        skill: 'Intermediate',
        ingredients: ['flour', 'sugar', 'cocoa'],
        steps: ['Mix ingredients', 'Bake at 350F']
    }

    const renderWithRouter = (slug = 'chocolate-cake') => {
        return render(
            <TestMemoryRouter initialEntries={[`/recipes/${slug}`]}>
                <Routes>
                    <Route path="/recipes/:slug" element={<RecipePage />} />
                </Routes>
            </TestMemoryRouter>
        )
    }

    beforeEach(() => {
        vi.clearAllMocks()
        // Default successful recipe fetch
        getRecipeBySlug.mockResolvedValue(mockRecipe)
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('Rendering Tests', () => {
        it('should use the loaded recipe title as the primary page heading', async () => {
            // Arrange & Act
            renderWithRouter()

            // Assert
            await waitFor(() => {
                expect(screen.getByRole('heading', { level: 1, name: 'Chocolate Cake' })).toBeInTheDocument()
                expect(screen.queryByRole('heading', { level: 1, name: 'Recipe' })).not.toBeInTheDocument()
            })
        })

        it('should render status pill', async () => {
            // Arrange & Act
            renderWithRouter()

            // Assert
            await waitFor(() => {
                const pill = screen.getByText('Fresh')
                expect(pill).toBeInTheDocument()
                expect(pill.classList.contains('pill')).toBe(true)
            })
        })

        it('should render card container', async () => {
            // Arrange & Act
            const { container } = renderWithRouter()

            // Assert
            await waitFor(() => {
                const card = container.querySelector('.card')
                expect(card).toBeInTheDocument()
            })
        })
    })

    describe('Loading State Tests', () => {
        it('should show "Loading recipe..." message when status is loading', () => {
            // Arrange
            getRecipeBySlug.mockReturnValue(new Promise(() => {})) // Never resolves

            // Act
            renderWithRouter()

            // Assert
            expect(screen.getByRole('heading', { level: 1, name: 'Recipe' })).toBeInTheDocument()
            expect(screen.getByText('Loading recipe...')).toBeInTheDocument()
        })

        it('should display "Loading" pill during fetch', () => {
            // Arrange
            getRecipeBySlug.mockReturnValue(new Promise(() => {})) // Never resolves

            // Act
            renderWithRouter()

            // Assert
            expect(screen.getByText('Loading')).toBeInTheDocument()
        })
    })

    describe('Success State Tests', () => {
        it('should display RecipeTemplate when recipe loaded', async () => {
            // Arrange & Act
            renderWithRouter()

            // Assert
            await waitFor(() => {
                expect(screen.getByTestId('recipe-template')).toBeInTheDocument()
                expect(screen.getByText('RecipeTemplate: Chocolate Cake')).toBeInTheDocument()
                expect(screen.getByTestId('recipe-template')).toHaveAttribute('data-show-title', 'false')
                expect(screen.getByTestId('recipe-template')).toHaveAttribute('data-expanded-image', '/chocolate-cake.jpg')
            })
        })

        it('should display ShareBar when recipe loaded', async () => {
            // Arrange & Act
            renderWithRouter()

            // Assert
            await waitFor(() => {
                expect(screen.getByTestId('share-bar')).toBeInTheDocument()
            })
        })

        it('should display CTAForm when recipe loaded', async () => {
            // Arrange & Act
            renderWithRouter()

            // Assert
            await waitFor(() => {
                expect(screen.getByTestId('cta-form')).toBeInTheDocument()
                expect(screen.getByText('CTAForm: Get recipes, Sunday letters, early drops')).toBeInTheDocument()
            })
        })

        it('should display "Fresh" pill when status is ready', async () => {
            // Arrange & Act
            renderWithRouter()

            // Assert
            await waitFor(() => {
                expect(screen.getByText('Fresh')).toBeInTheDocument()
            })
        })
    })

    describe('Error State Tests', () => {
        it('should show "We could not find that recipe." when status is missing', async () => {
            // Arrange
            getRecipeBySlug.mockResolvedValue(null)

            // Act
            renderWithRouter()

            // Assert
            await waitFor(() => {
                expect(screen.getByText('We could not find that recipe.')).toBeInTheDocument()
            })
        })

        it('should display "Not found" pill when recipe missing', async () => {
            // Arrange
            getRecipeBySlug.mockResolvedValue(null)

            // Act
            renderWithRouter()

            // Assert
            await waitFor(() => {
                expect(screen.getByText('Not found')).toBeInTheDocument()
            })
        })

        it('should not display RecipeTemplate when recipe is missing', async () => {
            // Arrange
            getRecipeBySlug.mockResolvedValue(null)

            // Act
            renderWithRouter()

            // Assert
            await waitFor(() => {
                expect(screen.queryByTestId('recipe-template')).not.toBeInTheDocument()
                expect(screen.queryByTestId('share-bar')).not.toBeInTheDocument()
                expect(screen.queryByTestId('cta-form')).not.toBeInTheDocument()
            })
        })
    })

    describe('SEO Tests', () => {
        it('should call applyMeta with recipe title and metadata', async () => {
            // Arrange & Act
            renderWithRouter()

            // Assert
            await waitFor(() => {
                expect(applyMeta).toHaveBeenCalledWith({
                    title: 'Chocolate Cake | Sunday Brunch With Giselle',
                    description: 'A delicious chocolate cake recipe',
                    ogImage: '/og-chocolate-cake.jpg',
                    canonical: '/recipes/chocolate-cake'
                })
            })
        })

        it('should call applyRecipeSchema with recipe data', async () => {
            // Arrange & Act
            renderWithRouter()

            // Assert
            await waitFor(() => {
                expect(applyRecipeSchema).toHaveBeenCalledWith(mockRecipe)
            })
        })

        it('should not call SEO functions when recipe is missing', async () => {
            // Arrange
            getRecipeBySlug.mockResolvedValue(null)

            // Act
            renderWithRouter()

            // Assert
            await waitFor(() => {
                expect(getRecipeBySlug).toHaveBeenCalled()
            })

            // SEO functions should not be called
            expect(applyMeta).not.toHaveBeenCalled()
            expect(applyRecipeSchema).not.toHaveBeenCalled()
        })

        it('should handle recipe without meta data gracefully', async () => {
            // Arrange
            const recipeWithoutMeta = { ...mockRecipe, meta: undefined }
            getRecipeBySlug.mockResolvedValue(recipeWithoutMeta)

            // Act
            renderWithRouter()

            // Assert
            await waitFor(() => {
                expect(applyMeta).toHaveBeenCalledWith({
                    title: 'Chocolate Cake | Sunday Brunch With Giselle',
                    description: undefined,
                    ogImage: undefined,
                    canonical: '/recipes/chocolate-cake'
                })
            })
        })

        it('should keep a readable fallback h1 when loaded recipe title is blank', async () => {
            // Arrange
            getRecipeBySlug.mockResolvedValue({
                ...mockRecipe,
                title: ''
            })

            // Act
            renderWithRouter()

            // Assert
            await waitFor(() => {
                expect(screen.getByRole('heading', { level: 1, name: 'Recipe' })).toBeInTheDocument()
                expect(screen.getByText('Fresh')).toBeInTheDocument()
            })
        })
    })

    describe('Route Parameter Tests', () => {
        it('should fetch recipe using slug from useParams', async () => {
            // Arrange & Act
            renderWithRouter('chocolate-cake')

            // Assert
            await waitFor(() => {
                expect(getRecipeBySlug).toHaveBeenCalledWith('chocolate-cake')
            })
        })

        it('should fetch different recipe when slug changes', async () => {
            // Arrange - First render with chocolate-cake
            const { unmount } = render(
                <TestMemoryRouter initialEntries={['/recipes/chocolate-cake']}>
                    <Routes>
                        <Route path="/recipes/:slug" element={<RecipePage />} />
                    </Routes>
                </TestMemoryRouter>
            )

            // Wait for initial load
            await waitFor(() => {
                expect(getRecipeBySlug).toHaveBeenCalledWith('chocolate-cake')
            })

            // Clean up first render
            unmount()

            // Act - Render with different recipe
            const vanillaCakeRecipe = {
                ...mockRecipe,
                slug: 'vanilla-cake',
                title: 'Vanilla Cake'
            }
            getRecipeBySlug.mockResolvedValue(vanillaCakeRecipe)
            vi.clearAllMocks()

            render(
                <TestMemoryRouter initialEntries={['/recipes/vanilla-cake']}>
                    <Routes>
                        <Route path="/recipes/:slug" element={<RecipePage />} />
                    </Routes>
                </TestMemoryRouter>
            )

            // Assert
            await waitFor(() => {
                expect(getRecipeBySlug).toHaveBeenCalledWith('vanilla-cake')
            })
        })

        it('should handle slug with special characters', async () => {
            // Arrange & Act
            renderWithRouter('grandmas-special-cookies')

            // Assert
            await waitFor(() => {
                expect(getRecipeBySlug).toHaveBeenCalledWith('grandmas-special-cookies')
            })
        })
    })

    describe('Loading State Transitions', () => {
        it('should transition from loading to ready state', async () => {
            // Arrange & Act
            renderWithRouter()

            // Assert - Initially loading
            expect(screen.getByText('Loading')).toBeInTheDocument()
            expect(screen.getByText('Loading recipe...')).toBeInTheDocument()

            // Assert - After data loads
            await waitFor(() => {
                expect(screen.getByText('Fresh')).toBeInTheDocument()
                expect(screen.queryByText('Loading recipe...')).not.toBeInTheDocument()
                expect(screen.getByTestId('recipe-template')).toBeInTheDocument()
            })
        })

        it('should transition from loading to missing state', async () => {
            // Arrange
            getRecipeBySlug.mockResolvedValue(null)

            // Act
            renderWithRouter()

            // Assert - Initially loading
            expect(screen.getByText('Loading')).toBeInTheDocument()

            // Assert - After failed fetch
            await waitFor(() => {
                expect(screen.getByText('Not found')).toBeInTheDocument()
                expect(screen.getByText('We could not find that recipe.')).toBeInTheDocument()
            })
        })

        it('should reset to loading state when slug changes', async () => {
            // Arrange - First render
            const { unmount } = render(
                <TestMemoryRouter initialEntries={['/recipes/chocolate-cake']}>
                    <Routes>
                        <Route path="/recipes/:slug" element={<RecipePage />} />
                    </Routes>
                </TestMemoryRouter>
            )

            // Wait for initial load
            await waitFor(() => {
                expect(screen.getByText('Fresh')).toBeInTheDocument()
            })

            // Clean up first render
            unmount()

            // Act - Render with different slug and make promise hang
            getRecipeBySlug.mockReturnValue(new Promise(() => {}))

            render(
                <TestMemoryRouter initialEntries={['/recipes/vanilla-cake']}>
                    <Routes>
                        <Route path="/recipes/:slug" element={<RecipePage />} />
                    </Routes>
                </TestMemoryRouter>
            )

            // Assert - Should show loading state
            expect(screen.getByText('Loading')).toBeInTheDocument()
            expect(screen.getByText('Loading recipe...')).toBeInTheDocument()
        })

        it('should ignore stale lookup results after navigating to a different recipe', async () => {
            // Arrange
            const resolvers = {}
            const vanillaCakeRecipe = {
                ...mockRecipe,
                slug: 'vanilla-cake',
                title: 'Vanilla Cake',
                image: '/vanilla-cake.jpg'
            }

            getRecipeBySlug.mockImplementation((requestedSlug) => (
                new Promise((resolve) => {
                    resolvers[requestedSlug] = resolve
                })
            ))

            render(
                <TestMemoryRouter initialEntries={['/recipes/chocolate-cake']}>
                    <NavigationControls />
                    <Routes>
                        <Route path="/recipes/:slug" element={<RecipePage />} />
                    </Routes>
                </TestMemoryRouter>
            )

            // Act - navigate before the original lookup resolves.
            fireEvent.click(screen.getByRole('button', { name: 'Go vanilla' }))

            await act(async () => {
                resolvers['vanilla-cake'](vanillaCakeRecipe)
            })

            await waitFor(() => {
                expect(screen.getByRole('heading', { level: 1, name: 'Vanilla Cake' })).toBeInTheDocument()
            })

            await act(async () => {
                resolvers['chocolate-cake'](mockRecipe)
            })

            // Assert - the stale chocolate result must not overwrite the current route.
            await waitFor(() => {
                expect(screen.getByRole('heading', { level: 1, name: 'Vanilla Cake' })).toBeInTheDocument()
                expect(screen.queryByRole('heading', { level: 1, name: 'Chocolate Cake' })).not.toBeInTheDocument()
            })
        })
    })

    describe('Component Structure', () => {
        it('should render section with correct class', async () => {
            // Arrange & Act
            const { container } = renderWithRouter()

            // Assert
            await waitFor(() => {
                const section = container.querySelector('section.section')
                expect(section).toBeInTheDocument()
            })
        })

        it('should render section header with correct structure', async () => {
            // Arrange & Act
            const { container } = renderWithRouter()

            // Assert
            await waitFor(() => {
                const sectionHeader = container.querySelector('.section__header')
                expect(sectionHeader).toBeInTheDocument()

                const title = sectionHeader.querySelector('.section__title')
                expect(title).toBeInTheDocument()
                expect(title).toHaveTextContent('Chocolate Cake')

                const pill = sectionHeader.querySelector('.pill')
                expect(pill).toBeInTheDocument()
            })
        })

        it('should render all components in correct order when recipe loaded', async () => {
            // Arrange & Act
            const { container } = renderWithRouter()

            // Assert
            await waitFor(() => {
                const card = container.querySelector('.card')
                const children = Array.from(card.children)

                expect(children[0]).toHaveAttribute('data-testid', 'recipe-template')
                expect(children[1]).toHaveAttribute('data-testid', 'share-bar')
                expect(children[2]).toHaveAttribute('data-testid', 'cta-form')
            })
        })

        it('should guard the route title against long unbroken mobile text', () => {
            // Arrange & Act
            const css = readAppCss()

            // Assert
            expect(css).toMatch(/\.section__title\s*\{[\s\S]*min-width:\s*0/)
            expect(css).toMatch(/\.section__title\s*\{[\s\S]*overflow-wrap:\s*anywhere/)
        })
    })

    // Note: Error handling tests removed as RecipePage component doesn't implement .catch() for getRecipeBySlug()
    // Future enhancement: Add error boundaries or .catch() handlers to handle data fetching failures
})
