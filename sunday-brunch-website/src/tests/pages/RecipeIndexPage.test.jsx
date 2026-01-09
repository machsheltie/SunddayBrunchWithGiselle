import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import RecipeIndexPage from '../../pages/RecipeIndexPage'
import { getRecipes } from '../../lib/content'
import { applyMeta } from '../../lib/seo'

// Mock dependencies
vi.mock('../../lib/content')
vi.mock('../../lib/seo')

// Mock react-router-dom Link
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        Link: ({ to, children, className }) => (
            <a href={to} className={className}>{children}</a>
        )
    }
})

// Mock PinterestButton
vi.mock('../../components/PinterestButton', () => ({
    default: ({ url, description }) => (
        <div data-testid="pinterest-button" data-url={url} data-description={description}>
            PinterestButton
        </div>
    )
}))

describe('RecipeIndexPage Component', () => {
    const mockRecipes = [
        {
            slug: 'chocolate-cake',
            title: 'Chocolate Cake',
            category: 'Cakes',
            skill: 'Intermediate',
            dietary: ['Vegetarian'],
            occasion: 'Birthdays',
            ingredients: ['flour', 'sugar', 'cocoa'],
            image: '/chocolate-cake.jpg'
        },
        {
            slug: 'vanilla-cookies',
            title: 'Vanilla Cookies',
            category: 'Cookies',
            skill: 'Beginner',
            dietary: ['Vegetarian', 'Nut-Free'],
            occasion: 'Bake Sale',
            ingredients: ['flour', 'butter', 'vanilla'],
            image: '/vanilla-cookies.jpg'
        },
        {
            slug: 'gluten-free-brownies',
            title: 'Gluten-Free Brownies',
            category: 'Brownies',
            skill: 'Beginner',
            dietary: ['Gluten-Free', 'Vegetarian'],
            occasion: 'Movie Night',
            ingredients: ['almond flour', 'cocoa', 'eggs'],
            image: '/brownies.jpg'
        },
        {
            slug: 'vegan-banana-bread',
            title: 'Vegan Banana Bread',
            category: 'Breads',
            skill: 'Beginner',
            dietary: ['Vegan', 'Dairy-Free', 'Egg-Free'],
            occasion: 'Weekend Mornings',
            ingredients: ['banana', 'flour', 'maple syrup'],
            image: '/banana-bread.jpg'
        }
    ]

    const renderWithRouter = () => {
        return render(
            <MemoryRouter>
                <RecipeIndexPage />
            </MemoryRouter>
        )
    }

    beforeEach(() => {
        vi.clearAllMocks()
        // Default successful recipes fetch
        getRecipes.mockResolvedValue(mockRecipes)
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('Rendering Tests', () => {
        it('should render page header with "The Recipe Box" title', async () => {
            // Arrange & Act
            renderWithRouter()

            // Assert
            await waitFor(() => {
                expect(screen.getByRole('heading', { level: 1, name: 'The Recipe Box' })).toBeInTheDocument()
            })
        })

        it('should render page subtitle', async () => {
            // Arrange & Act
            renderWithRouter()

            // Assert
            await waitFor(() => {
                expect(screen.getByText('Whimsical bakes for every skill level')).toBeInTheDocument()
            })
        })

        it('should render sidebar with filters', async () => {
            // Arrange & Act
            const { container } = renderWithRouter()

            // Assert
            await waitFor(() => {
                const sidebar = container.querySelector('.recipe-sidebar')
                expect(sidebar).toBeInTheDocument()
            })
        })

        it('should render search input', async () => {
            // Arrange & Act
            renderWithRouter()

            // Assert
            await waitFor(() => {
                const searchInput = screen.getByPlaceholderText('Search recipes...')
                expect(searchInput).toBeInTheDocument()
                expect(searchInput).toHaveAttribute('type', 'text')
            })
        })

        it('should render loading state', () => {
            // Arrange
            getRecipes.mockReturnValue(new Promise(() => {})) // Never resolves

            // Act
            renderWithRouter()

            // Assert
            expect(screen.getByText('Mixing the batter...')).toBeInTheDocument()
        })

        it('should render filter sections', async () => {
            // Arrange & Act
            renderWithRouter()

            // Assert
            await waitFor(() => {
                expect(screen.getByRole('heading', { level: 3, name: 'Recipe Types' })).toBeInTheDocument()
                expect(screen.getByRole('heading', { level: 3, name: 'Baking Level' })).toBeInTheDocument()
                expect(screen.getByRole('heading', { level: 3, name: 'Dietary Needs' })).toBeInTheDocument()
                expect(screen.getByRole('heading', { level: 3, name: 'By Occasion' })).toBeInTheDocument()
            })
        })
    })

    describe('Filter Tests', () => {
        it('should filter recipes by category', async () => {
            // Arrange
            renderWithRouter()
            await waitFor(() => expect(screen.getByText('Chocolate Cake')).toBeInTheDocument())

            // Act - Filter by Cookies
            const cookiesButton = screen.getByRole('button', { name: 'Cookies' })
            fireEvent.click(cookiesButton)

            // Assert
            await waitFor(() => {
                expect(screen.getByText('Vanilla Cookies')).toBeInTheDocument()
                expect(screen.queryByText('Chocolate Cake')).not.toBeInTheDocument()
            })
        })

        it('should filter recipes by skill level', async () => {
            // Arrange
            renderWithRouter()
            await waitFor(() => expect(screen.getByText('Chocolate Cake')).toBeInTheDocument())

            // Act - Filter by Beginner
            const beginnerChip = screen.getByRole('button', { name: 'Beginner' })
            fireEvent.click(beginnerChip)

            // Assert
            await waitFor(() => {
                expect(screen.getByText('Vanilla Cookies')).toBeInTheDocument()
                expect(screen.getByText('Gluten-Free Brownies')).toBeInTheDocument()
                expect(screen.queryByText('Chocolate Cake')).not.toBeInTheDocument()
            })
        })

        it('should filter recipes by dietary needs', async () => {
            // Arrange
            renderWithRouter()
            await waitFor(() => expect(screen.getByText('Chocolate Cake')).toBeInTheDocument())

            // Act - Filter by Gluten-Free
            const glutenFreeChip = screen.getByRole('button', { name: 'Gluten-Free' })
            fireEvent.click(glutenFreeChip)

            // Assert
            await waitFor(() => {
                expect(screen.getByText('Gluten-Free Brownies')).toBeInTheDocument()
                expect(screen.queryByText('Chocolate Cake')).not.toBeInTheDocument()
            })
        })

        it('should filter recipes by occasion', async () => {
            // Arrange
            renderWithRouter()
            await waitFor(() => expect(screen.getByText('Chocolate Cake')).toBeInTheDocument())

            // Act - First expand the occasion section (collapsed by default)
            const occasionHeader = screen.getByRole('button', { name: /By Occasion/i })
            fireEvent.click(occasionHeader)

            // Then filter by Birthdays
            await waitFor(() => {
                const birthdaysChip = screen.getByRole('button', { name: 'Birthdays' })
                fireEvent.click(birthdaysChip)
            })

            // Assert
            await waitFor(() => {
                expect(screen.getByText('Chocolate Cake')).toBeInTheDocument()
                expect(screen.queryByText('Vanilla Cookies')).not.toBeInTheDocument()
            })
        })

        it('should search recipes by ingredient', async () => {
            // Arrange
            renderWithRouter()
            await waitFor(() => expect(screen.getByText('Chocolate Cake')).toBeInTheDocument())

            // Act
            const searchInput = screen.getByPlaceholderText('Search recipes...')
            await userEvent.type(searchInput, 'cocoa')

            // Assert
            await waitFor(() => {
                expect(screen.getByText('Chocolate Cake')).toBeInTheDocument()
                expect(screen.getByText('Gluten-Free Brownies')).toBeInTheDocument()
                expect(screen.queryByText('Vanilla Cookies')).not.toBeInTheDocument()
            })
        })

        it('should search recipes by title', async () => {
            // Arrange
            renderWithRouter()
            await waitFor(() => expect(screen.getByText('Chocolate Cake')).toBeInTheDocument())

            // Act
            const searchInput = screen.getByPlaceholderText('Search recipes...')
            await userEvent.type(searchInput, 'Vanilla')

            // Assert
            await waitFor(() => {
                expect(screen.getByText('Vanilla Cookies')).toBeInTheDocument()
                expect(screen.queryByText('Chocolate Cake')).not.toBeInTheDocument()
            })
        })
    })

    describe('Combined Filters Test', () => {
        it('should apply multiple filters simultaneously', async () => {
            // Arrange
            renderWithRouter()
            await waitFor(() => expect(screen.getByText('Chocolate Cake')).toBeInTheDocument())

            // Act - Apply category filter (Brownies) and skill filter (Beginner)
            const browniesButton = screen.getByRole('button', { name: 'Brownies' })
            fireEvent.click(browniesButton)

            const beginnerChip = screen.getByRole('button', { name: 'Beginner' })
            fireEvent.click(beginnerChip)

            // Assert
            await waitFor(() => {
                expect(screen.getByText('Gluten-Free Brownies')).toBeInTheDocument()
                expect(screen.queryByText('Chocolate Cake')).not.toBeInTheDocument()
                expect(screen.queryByText('Vanilla Cookies')).not.toBeInTheDocument()
            })
        })

        it('should combine dietary filters correctly', async () => {
            // Arrange
            renderWithRouter()
            await waitFor(() => expect(screen.getByText('Chocolate Cake')).toBeInTheDocument())

            // Act - Filter by Vegan (should show only Vegan Banana Bread)
            const veganChip = screen.getByRole('button', { name: 'Vegan' })
            fireEvent.click(veganChip)

            // Assert
            await waitFor(() => {
                expect(screen.getByText('Vegan Banana Bread')).toBeInTheDocument()
                expect(screen.queryByText('Chocolate Cake')).not.toBeInTheDocument()
                expect(screen.queryByText('Vanilla Cookies')).not.toBeInTheDocument()
            })
        })
    })

    describe('Reset Filters Tests', () => {
        it('should reset all filters when "Clear All Filters" clicked', async () => {
            // Arrange
            renderWithRouter()
            await waitFor(() => expect(screen.getByText('Chocolate Cake')).toBeInTheDocument())

            // Act - Apply filters
            const cookiesButton = screen.getByRole('button', { name: 'Cookies' })
            fireEvent.click(cookiesButton)

            await waitFor(() => {
                expect(screen.queryByText('Chocolate Cake')).not.toBeInTheDocument()
            })

            // Act - Reset filters
            const clearButton = screen.getByRole('button', { name: 'Clear All Filters' })
            fireEvent.click(clearButton)

            // Assert
            await waitFor(() => {
                expect(screen.getByText('Chocolate Cake')).toBeInTheDocument()
                expect(screen.getByText('Vanilla Cookies')).toBeInTheDocument()
            })
        })

        it('should reset filters from "Show all recipes" link in no results state', async () => {
            // Arrange
            renderWithRouter()
            await waitFor(() => expect(screen.getByText('Chocolate Cake')).toBeInTheDocument())

            // Act - Apply filter that shows no results
            const searchInput = screen.getByPlaceholderText('Search recipes...')
            await userEvent.type(searchInput, 'nonexistent')

            await waitFor(() => {
                expect(screen.getByText('No recipes match those filters. Try adjusting your search!')).toBeInTheDocument()
            })

            // Act - Click "Show all recipes"
            const showAllButton = screen.getByRole('button', { name: 'Show all recipes' })
            fireEvent.click(showAllButton)

            // Assert
            await waitFor(() => {
                expect(screen.getByText('Chocolate Cake')).toBeInTheDocument()
                expect(screen.getByText('Vanilla Cookies')).toBeInTheDocument()
            })
        })

        it('should clear search input when resetting filters', async () => {
            // Arrange
            renderWithRouter()
            await waitFor(() => expect(screen.getByText('Chocolate Cake')).toBeInTheDocument())

            const searchInput = screen.getByPlaceholderText('Search recipes...')
            await userEvent.type(searchInput, 'vanilla')

            // Act
            const clearButton = screen.getByRole('button', { name: 'Clear All Filters' })
            fireEvent.click(clearButton)

            // Assert
            await waitFor(() => {
                expect(searchInput.value).toBe('')
            })
        })
    })

    describe('Collapsible Sections Tests', () => {
        it('should toggle Recipe Types section', async () => {
            // Arrange
            renderWithRouter()
            await waitFor(() => expect(screen.getByText('Chocolate Cake')).toBeInTheDocument())

            // Assert - Initially expanded
            expect(screen.getByRole('button', { name: 'Cakes' })).toBeInTheDocument()

            // Act - Collapse
            const typesHeader = screen.getByRole('button', { name: /Recipe Types/i })
            fireEvent.click(typesHeader)

            // Assert - Collapsed
            await waitFor(() => {
                expect(screen.queryByRole('button', { name: 'Cakes' })).not.toBeInTheDocument()
            })

            // Act - Expand again
            fireEvent.click(typesHeader)

            // Assert - Expanded
            await waitFor(() => {
                expect(screen.getByRole('button', { name: 'Cakes' })).toBeInTheDocument()
            })
        })

        it('should toggle Baking Level section', async () => {
            // Arrange
            renderWithRouter()
            await waitFor(() => expect(screen.getByText('Chocolate Cake')).toBeInTheDocument())

            // Assert - Initially expanded
            expect(screen.getByRole('button', { name: 'Beginner' })).toBeInTheDocument()

            // Act - Collapse
            const levelHeader = screen.getByRole('button', { name: /Baking Level/i })
            fireEvent.click(levelHeader)

            // Assert - Collapsed (Beginner button should not be visible)
            await waitFor(() => {
                const beginnerButtons = screen.queryAllByRole('button', { name: 'Beginner' })
                // Should not be visible in the filter section
                expect(beginnerButtons.length).toBe(0)
            })
        })

        it('should toggle Dietary Needs section', async () => {
            // Arrange
            renderWithRouter()
            await waitFor(() => expect(screen.getByText('Chocolate Cake')).toBeInTheDocument())

            // Assert - Initially expanded
            expect(screen.getByRole('button', { name: 'Vegetarian' })).toBeInTheDocument()

            // Act - Collapse
            const dietaryHeader = screen.getByRole('button', { name: /Dietary Needs/i })
            fireEvent.click(dietaryHeader)

            // Assert - Collapsed
            await waitFor(() => {
                expect(screen.queryByRole('button', { name: 'Vegetarian' })).not.toBeInTheDocument()
            })
        })

        it('should have occasion section collapsed by default', async () => {
            // Arrange & Act
            renderWithRouter()
            await waitFor(() => expect(screen.getByText('Chocolate Cake')).toBeInTheDocument())

            // Assert - Should be collapsed initially (no occasion filter buttons visible)
            expect(screen.queryByRole('button', { name: 'Birthdays' })).not.toBeInTheDocument()

            // Act - Expand
            const occasionHeader = screen.getByRole('button', { name: /By Occasion/i })
            fireEvent.click(occasionHeader)

            // Assert - Now visible
            await waitFor(() => {
                expect(screen.getByRole('button', { name: 'Birthdays' })).toBeInTheDocument()
            })
        })
    })

    describe('No Results State Test', () => {
        it('should show "No recipes match those filters" when no results', async () => {
            // Arrange
            renderWithRouter()
            await waitFor(() => expect(screen.getByText('Chocolate Cake')).toBeInTheDocument())

            // Act - Search for something that doesn't exist
            const searchInput = screen.getByPlaceholderText('Search recipes...')
            await userEvent.type(searchInput, 'nonexistent recipe')

            // Assert
            await waitFor(() => {
                expect(screen.getByText('No recipes match those filters. Try adjusting your search!')).toBeInTheDocument()
                expect(screen.queryByText('Chocolate Cake')).not.toBeInTheDocument()
            })
        })
    })

    describe('Recipe Display Tests', () => {
        it('should group recipes by category and display correctly', async () => {
            // Arrange & Act
            renderWithRouter()

            // Assert
            await waitFor(() => {
                // Each category should have its own section
                expect(screen.getByRole('heading', { level: 2, name: 'Cakes' })).toBeInTheDocument()
                expect(screen.getByRole('heading', { level: 2, name: 'Cookies' })).toBeInTheDocument()
                expect(screen.getByRole('heading', { level: 2, name: 'Brownies' })).toBeInTheDocument()
                expect(screen.getByRole('heading', { level: 2, name: 'Breads' })).toBeInTheDocument()
            })
        })

        it('should display recipe cards with correct information', async () => {
            // Arrange & Act
            renderWithRouter()

            // Assert
            await waitFor(() => {
                expect(screen.getByText('Chocolate Cake')).toBeInTheDocument()
                expect(screen.getByText('Vanilla Cookies')).toBeInTheDocument()

                // Check for skill badges
                const intermediateSkills = screen.getAllByText('Intermediate')
                expect(intermediateSkills.length).toBeGreaterThan(0)
            })
        })

        it('should display dietary tags for recipes', async () => {
            // Arrange & Act
            renderWithRouter()

            // Assert
            await waitFor(() => {
                // Should show dietary tags within recipe cards (not filter buttons)
                const vegetarianTags = screen.getAllByText('Vegetarian')
                expect(vegetarianTags.length).toBeGreaterThan(1) // Filter + recipe tags

                const nutFreeTags = screen.getAllByText('Nut-Free')
                expect(nutFreeTags.length).toBeGreaterThan(0)
            })
        })

        it('should render Pinterest buttons for each recipe', async () => {
            // Arrange & Act
            renderWithRouter()

            // Assert
            await waitFor(() => {
                const pinterestButtons = screen.getAllByTestId('pinterest-button')
                expect(pinterestButtons.length).toBe(4) // One for each recipe
            })
        })
    })

    describe('SEO Test', () => {
        it('should call applyMeta with correct title and description', async () => {
            // Arrange & Act
            renderWithRouter()

            // Assert
            await waitFor(() => {
                expect(applyMeta).toHaveBeenCalledWith({
                    title: 'Recipe Index | Sunday Brunch With Giselle',
                    description: 'Filter and browse all recipes by category, skill level, and dietary needs.'
                })
            })
        })
    })

    describe('Data Fetching', () => {
        it('should call getRecipes on component mount', async () => {
            // Arrange & Act
            renderWithRouter()

            // Assert
            await waitFor(() => {
                expect(getRecipes).toHaveBeenCalledTimes(1)
            })
        })

        it('should handle empty recipe list', async () => {
            // Arrange
            getRecipes.mockResolvedValue([])

            // Act
            renderWithRouter()

            // Assert
            await waitFor(() => {
                expect(screen.getByText('No recipes match those filters. Try adjusting your search!')).toBeInTheDocument()
            })
        })
    })

    describe('Filter Toggle Behavior', () => {
        it('should toggle skill filter on/off', async () => {
            // Arrange
            renderWithRouter()
            await waitFor(() => expect(screen.getByText('Chocolate Cake')).toBeInTheDocument())

            // Act - Click Intermediate
            const intermediateChip = screen.getByRole('button', { name: 'Intermediate' })
            fireEvent.click(intermediateChip)

            // Assert - Only Intermediate recipes
            await waitFor(() => {
                expect(screen.getByText('Chocolate Cake')).toBeInTheDocument()
                expect(screen.queryByText('Vanilla Cookies')).not.toBeInTheDocument()
            })

            // Act - Click Intermediate again to deselect
            fireEvent.click(intermediateChip)

            // Assert - All recipes shown again
            await waitFor(() => {
                expect(screen.getByText('Chocolate Cake')).toBeInTheDocument()
                expect(screen.getByText('Vanilla Cookies')).toBeInTheDocument()
            })
        })

        it('should toggle dietary filter on/off', async () => {
            // Arrange
            renderWithRouter()
            await waitFor(() => expect(screen.getByText('Chocolate Cake')).toBeInTheDocument())

            // Act - Click Vegan
            const veganChip = screen.getByRole('button', { name: 'Vegan' })
            fireEvent.click(veganChip)

            // Assert - Only Vegan recipes
            await waitFor(() => {
                expect(screen.getByText('Vegan Banana Bread')).toBeInTheDocument()
                expect(screen.queryByText('Chocolate Cake')).not.toBeInTheDocument()
            })

            // Act - Click Vegan again to deselect
            fireEvent.click(veganChip)

            // Assert - All recipes shown again
            await waitFor(() => {
                expect(screen.getByText('Chocolate Cake')).toBeInTheDocument()
                expect(screen.getByText('Vegan Banana Bread')).toBeInTheDocument()
            })
        })
    })

    describe('Recipe Links', () => {
        it('should render recipe links with correct hrefs', async () => {
            // Arrange & Act
            const { container } = renderWithRouter()

            // Assert
            await waitFor(() => {
                const links = container.querySelectorAll('a[href^="/recipes/"]')
                expect(links.length).toBe(4)
                expect(links[0]).toHaveAttribute('href', '/recipes/chocolate-cake')
            })
        })
    })
})
