import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
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
})
