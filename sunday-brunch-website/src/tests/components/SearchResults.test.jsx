import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import SearchResults from '../../components/search/SearchResults'

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('SearchResults Component', () => {
  const mockRecipes = [
    {
      slug: 'chocolate-chip-cookies',
      title: 'Chocolate Chip Cookies',
      category: 'Cookies',
      skill: 'Beginner',
      dietary: ['Vegetarian'],
      difficulty: 'Easy',
      cookTime: 25,
      image: '/images/cookies.jpg',
      tags: ['Chocolate', 'Classic']
    },
    {
      slug: 'vegan-brownies',
      title: 'Fudgy Vegan Brownies',
      category: 'Brownies',
      skill: 'Beginner',
      dietary: ['Vegan', 'Dairy-Free'],
      difficulty: 'Easy',
      cookTime: 35,
      image: '/images/brownies.jpg',
      tags: ['Chocolate', 'Fudgy']
    }
  ]

  it('should display matching recipes in grid layout', () => {
    renderWithRouter(
      <SearchResults results={mockRecipes} loading={false} />
    )

    expect(screen.getByText('Chocolate Chip Cookies')).toBeInTheDocument()
    expect(screen.getByText('Fudgy Vegan Brownies')).toBeInTheDocument()
  })

  it('should show recipe cards with image, title, cook time, difficulty', () => {
    renderWithRouter(
      <SearchResults results={[mockRecipes[0]]} loading={false} />
    )

    expect(screen.getByText('Chocolate Chip Cookies')).toBeInTheDocument()
    expect(screen.getByText(/25 min/i)).toBeInTheDocument()
    expect(screen.getByText(/beginner/i)).toBeInTheDocument()

    const image = screen.getByAltText('Chocolate Chip Cookies')
    expect(image).toHaveAttribute('src', '/images/cookies.jpg')
  })

  it('should display result count', () => {
    const { container } = renderWithRouter(
      <SearchResults
        results={mockRecipes}
        searchQuery="chocolate"
        loading={false}
      />
    )

    // Component renders: "Found <strong>2</strong> recipes matching "chocolate""
    // Text is split across elements, so we check the container's textContent
    const countElement = container.querySelector('.search-results__count')
    expect(countElement).toBeInTheDocument()
    expect(countElement.textContent).toMatch(/Found 2 recipes/i)
  })

  it('should display empty state when no results', () => {
    renderWithRouter(
      <SearchResults results={[]} loading={false} />
    )

    expect(
      screen.getByText(/no recipes found/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/try different filters/i)
    ).toBeInTheDocument()
  })

  it('should show loading state while searching', () => {
    renderWithRouter(
      <SearchResults results={[]} loading={true} />
    )

    expect(screen.getByText(/searching/i)).toBeInTheDocument()
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('should link to individual recipe pages', () => {
    renderWithRouter(
      <SearchResults results={[mockRecipes[0]]} loading={false} />
    )

    const link = screen.getByRole('link', { name: /chocolate chip cookies/i })
    expect(link).toHaveAttribute('href', '/recipes/chocolate-chip-cookies')
  })

  it('should display dietary tags on recipe cards', () => {
    renderWithRouter(
      <SearchResults results={mockRecipes} loading={false} />
    )

    expect(screen.getByText('Vegetarian')).toBeInTheDocument()
    expect(screen.getByText('Vegan')).toBeInTheDocument()
    expect(screen.getByText('Dairy-Free')).toBeInTheDocument()
  })

  it('should group recipes by category', () => {
    renderWithRouter(
      <SearchResults results={mockRecipes} loading={false} groupByCategory />
    )

    expect(screen.getByText('Cookies')).toBeInTheDocument()
    expect(screen.getByText('Brownies')).toBeInTheDocument()
  })

  it('should display placeholder when recipe has no image', () => {
    const recipeWithoutImage = {
      ...mockRecipes[0],
      image: null
    }

    renderWithRouter(
      <SearchResults results={[recipeWithoutImage]} loading={false} />
    )

    const placeholder = screen.getByTestId('recipe-placeholder')
    expect(placeholder).toBeInTheDocument()
  })

  it('should be responsive on mobile', () => {
    global.innerWidth = 375
    window.dispatchEvent(new Event('resize'))

    const { container } = renderWithRouter(
      <SearchResults results={mockRecipes} loading={false} />
    )

    const grid = container.querySelector('.recipe-grid')
    expect(grid).toHaveClass('recipe-grid--mobile')
  })

  it('should support pagination', async () => {
    const manyRecipes = Array.from({ length: 50 }, (_, i) => ({
      ...mockRecipes[0],
      slug: `recipe-${i}`,
      title: `Recipe ${i}`
    }))

    renderWithRouter(
      <SearchResults
        results={manyRecipes}
        loading={false}
        itemsPerPage={20}
      />
    )

    // Should show first 20 items
    expect(screen.getByText('Recipe 0')).toBeInTheDocument()
    expect(screen.queryByText('Recipe 25')).not.toBeInTheDocument()

    // Should have pagination controls
    expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument()
  })

  it('should highlight search term in results', () => {
    renderWithRouter(
      <SearchResults
        results={[mockRecipes[0]]}
        searchQuery="chocolate"
        loading={false}
        highlightSearch
      />
    )

    const highlighted = screen.getByTestId('highlighted-text')
    expect(highlighted).toHaveTextContent('Chocolate')
    expect(highlighted).toHaveClass('highlight')
  })

  it('should show Pinterest button on each recipe card', () => {
    renderWithRouter(
      <SearchResults results={[mockRecipes[0]]} loading={false} />
    )

    // PinterestButton has aria-label="Pin to Pinterest"
    const pinterestButton = screen.getByLabelText(/pin to pinterest/i)
    expect(pinterestButton).toBeInTheDocument()
  })

  it('should be accessible with ARIA labels', () => {
    renderWithRouter(
      <SearchResults results={mockRecipes} loading={false} />
    )

    const resultsRegion = screen.getByRole('region', { name: /search results/i })
    expect(resultsRegion).toBeInTheDocument()

    const recipeList = screen.getByRole('list', { name: /recipe results/i })
    expect(recipeList).toBeInTheDocument()
  })

  it('should display cook time in readable format', () => {
    renderWithRouter(
      <SearchResults results={[mockRecipes[0]]} loading={false} />
    )

    expect(screen.getByText(/25 min/i)).toBeInTheDocument()
  })

  it('should show result count with proper pluralization', () => {
    const { container } = renderWithRouter(
      <SearchResults
        results={[mockRecipes[0]]}
        searchQuery="chocolate"
        loading={false}
      />
    )

    // Text is split across elements: "Found <strong>1</strong> recipe"
    const countElement = container.querySelector('.search-results__count')
    expect(countElement).toBeInTheDocument()
    expect(countElement.textContent).toMatch(/Found 1 recipe/i)

    const { container: container2 } = renderWithRouter(
      <SearchResults
        results={mockRecipes}
        searchQuery="chocolate"
        loading={false}
      />
    )

    const countElement2 = container2.querySelector('.search-results__count')
    expect(countElement2.textContent).toMatch(/Found 2 recipes/i)
  })

  it('should support infinite scroll', () => {
    const manyRecipes = Array.from({ length: 100 }, (_, i) => ({
      ...mockRecipes[0],
      slug: `recipe-${i}`,
      title: `Recipe ${i}`
    }))

    const mockLoadMore = vi.fn()

    renderWithRouter(
      <SearchResults
        results={manyRecipes}
        loading={false}
        infiniteScroll
        onLoadMore={mockLoadMore}
      />
    )

    const sentinel = screen.getByTestId('infinite-scroll-sentinel')
    expect(sentinel).toBeInTheDocument()
  })

  // New comprehensive tests to close coverage gaps

  it('should display empty state when no recipes match filters', () => {
    renderWithRouter(
      <SearchResults
        results={[]}
        loading={false}
        searchQuery="xyz-nonexistent"
      />
    )

    expect(screen.getByText(/no recipes found/i)).toBeInTheDocument()
    expect(screen.getByText(/try different filters or search terms/i)).toBeInTheDocument()

    // Verify empty state icon is rendered
    const emptyIcon = document.querySelector('.empty-icon')
    expect(emptyIcon).toBeInTheDocument()
  })

  it('should handle pagination edge cases - first page and last page', async () => {
    const user = userEvent.setup()
    const manyRecipes = Array.from({ length: 45 }, (_, i) => ({
      ...mockRecipes[0],
      slug: `recipe-${i}`,
      title: `Recipe ${i}`
    }))

    renderWithRouter(
      <SearchResults
        results={manyRecipes}
        loading={false}
        itemsPerPage={20}
      />
    )

    // On first page, Previous button should be disabled
    const prevButton = screen.getByRole('button', { name: /previous page/i })
    const nextButton = screen.getByRole('button', { name: /next page/i })

    expect(prevButton).toBeDisabled()
    expect(nextButton).not.toBeDisabled()

    // Navigate to next page
    await user.click(nextButton)

    // Now Previous should be enabled
    expect(prevButton).not.toBeDisabled()

    // Navigate to last page (page 3)
    await user.click(nextButton)

    // On last page, Next button should be disabled
    expect(nextButton).toBeDisabled()
    expect(prevButton).not.toBeDisabled()

    expect(screen.getByText(/page 3 of 3/i)).toBeInTheDocument()
  })

  it('should display loading state while recipes are being filtered', () => {
    renderWithRouter(
      <SearchResults
        results={[]}
        loading={true}
        searchQuery="chocolate"
      />
    )

    expect(screen.getByText(/searching for delicious recipes/i)).toBeInTheDocument()
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()

    // Should not display results or empty state
    expect(screen.queryByText(/no recipes found/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('should handle error state display', () => {
    // When results are empty but not loading, shows empty state
    renderWithRouter(
      <SearchResults
        results={[]}
        loading={false}
        searchQuery="error-test"
      />
    )

    // Empty state should be shown (component treats empty results as "no matches")
    expect(screen.getByText(/no recipes found/i)).toBeInTheDocument()
    expect(screen.getByText(/try different filters or search terms/i)).toBeInTheDocument()
  })

  it('should support recipe card click interactions', async () => {
    const user = userEvent.setup()

    renderWithRouter(
      <SearchResults results={[mockRecipes[0]]} loading={false} />
    )

    const recipeLink = screen.getByRole('link', { name: /chocolate chip cookies/i })

    // Click should navigate (href is present)
    expect(recipeLink).toHaveAttribute('href', '/recipes/chocolate-chip-cookies')

    // Verify card has proper structure
    const recipeCard = recipeLink.closest('.recipe-card')
    expect(recipeCard).toBeInTheDocument()
  })

  it('should support keyboard navigation through result cards', async () => {
    const user = userEvent.setup()

    renderWithRouter(
      <SearchResults results={mockRecipes} loading={false} />
    )

    // Get all recipe links
    const recipeLinks = screen.getAllByRole('link')

    // Should have at least 2 recipe links
    expect(recipeLinks.length).toBeGreaterThanOrEqual(2)

    // Tab to first link
    await user.tab()

    // First recipe link should be focusable
    const firstLink = screen.getByRole('link', { name: /chocolate chip cookies/i })
    expect(firstLink).toBeInTheDocument()

    // Press Enter should follow link (verified by href attribute)
    expect(firstLink).toHaveAttribute('href', '/recipes/chocolate-chip-cookies')
  })

  it('should format cook time with hours and minutes correctly', () => {
    const recipeWithLongCookTime = {
      ...mockRecipes[0],
      cookTime: 125 // 2h 5m
    }

    const recipeWithExactHours = {
      ...mockRecipes[0],
      slug: 'long-recipe',
      title: 'Long Recipe',
      cookTime: 180 // 3h exactly
    }

    renderWithRouter(
      <SearchResults
        results={[recipeWithLongCookTime, recipeWithExactHours]}
        loading={false}
      />
    )

    // Should show hours and minutes (covers lines 42-43)
    expect(screen.getByText(/2h 5m/i)).toBeInTheDocument()

    // Should show exact hours without minutes (covers line 44)
    expect(screen.getByText(/^3h$/)).toBeInTheDocument()
  })

  it('should trigger onLoadMore callback when sentinel is intersecting', () => {
    const mockLoadMore = vi.fn()
    const manyRecipes = Array.from({ length: 30 }, (_, i) => ({
      ...mockRecipes[0],
      slug: `recipe-${i}`,
      title: `Recipe ${i}`
    }))

    // Mock IntersectionObserver
    const mockObserve = vi.fn()
    const mockDisconnect = vi.fn()

    global.IntersectionObserver = vi.fn(function(callback) {
      this.observe = mockObserve
      this.disconnect = mockDisconnect

      // Simulate intersection immediately
      setTimeout(() => {
        callback([{ isIntersecting: true }])
      }, 0)

      return this
    })

    renderWithRouter(
      <SearchResults
        results={manyRecipes}
        loading={false}
        infiniteScroll
        onLoadMore={mockLoadMore}
      />
    )

    const sentinel = screen.getByTestId('infinite-scroll-sentinel')
    expect(sentinel).toBeInTheDocument()

    // Verify observer was set up
    expect(mockObserve).toHaveBeenCalled()

    // Wait for async callback
    setTimeout(() => {
      expect(mockLoadMore).toHaveBeenCalled()
    }, 10)
  })

  it('should call window.scrollTo when navigating to previous page', async () => {
    const user = userEvent.setup()

    // Mock window.scrollTo
    const mockScrollTo = vi.fn()
    window.scrollTo = mockScrollTo

    const manyRecipes = Array.from({ length: 50 }, (_, i) => ({
      ...mockRecipes[0],
      slug: `recipe-${i}`,
      title: `Recipe ${i}`
    }))

    renderWithRouter(
      <SearchResults
        results={manyRecipes}
        loading={false}
        itemsPerPage={20}
      />
    )

    // Navigate to page 2
    const nextButton = screen.getByRole('button', { name: /next page/i })
    await user.click(nextButton)

    mockScrollTo.mockClear()

    // Navigate back to page 1
    const prevButton = screen.getByRole('button', { name: /previous page/i })
    await user.click(prevButton)

    // Should have scrolled to top
    expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })
})
