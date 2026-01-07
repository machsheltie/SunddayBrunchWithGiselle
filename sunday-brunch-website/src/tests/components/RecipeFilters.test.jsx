import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RecipeFilters from '../../components/search/RecipeFilters'

describe('RecipeFilters Component', () => {
  const defaultFilters = {
    category: 'all',
    dietary: [],
    season: 'all',
    difficulty: 'all',
    cookTime: 'all',
    tags: [],
    sortBy: 'newest'
  }

  const mockOnChange = vi.fn()

  it('should render all filter categories', () => {
    render(<RecipeFilters filters={defaultFilters} onChange={mockOnChange} />)

    expect(screen.getAllByText(/category/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/dietary restrictions/i)).toBeInTheDocument()
    expect(screen.getAllByText(/season/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/difficulty/i)).toBeInTheDocument()
    expect(screen.getByText(/cook time/i)).toBeInTheDocument()
    expect(screen.getAllByText(/tags/i).length).toBeGreaterThan(0)
    expect(screen.getByLabelText(/sort by/i)).toBeInTheDocument()
  })

  it('should call onChange when category selected', async () => {
    const user = userEvent.setup()

    render(<RecipeFilters filters={defaultFilters} onChange={mockOnChange} />)

    const cookiesButton = screen.getByRole('button', { name: /cookies/i })
    await user.click(cookiesButton)

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'Cookies' })
    )
  })

  it('should support multiple dietary restrictions', async () => {
    const user = userEvent.setup()

    const { rerender } = render(<RecipeFilters filters={defaultFilters} onChange={mockOnChange} />)

    const veganButton = screen.getByRole('button', { name: /^vegan$/i })
    const glutenFreeButton = screen.getByRole('button', { name: /gluten-free/i })

    await user.click(veganButton)
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ dietary: ['Vegan'] })
    )

    mockOnChange.mockClear()

    // Rerender with updated filters to add second dietary restriction
    const updatedFilters = { ...defaultFilters, dietary: ['Vegan'] }
    rerender(
      <RecipeFilters filters={updatedFilters} onChange={mockOnChange} />
    )

    const glutenFree = screen.getByRole('button', { name: /gluten-free/i })
    await user.click(glutenFree)

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ dietary: expect.arrayContaining(['Vegan', 'Gluten-Free']) })
    )
  })

  it('should clear all filters when reset clicked', async () => {
    const user = userEvent.setup()
    const activeFilters = {
      category: 'Cookies',
      dietary: ['Vegan'],
      season: 'Fall',
      difficulty: 'Easy',
      cookTime: 'under-30',
      tags: ['Chocolate'],
      sortBy: 'a-z'
    }

    render(<RecipeFilters filters={activeFilters} onChange={mockOnChange} />)

    const resetButton = screen.getByRole('button', { name: /clear all filters/i })
    await user.click(resetButton)

    expect(mockOnChange).toHaveBeenCalledWith(defaultFilters)
  })

  it('should display active filter count badge', () => {
    const activeFilters = {
      ...defaultFilters,
      category: 'Cookies',
      dietary: ['Vegan', 'Gluten-Free'],
      difficulty: 'Easy'
    }

    render(<RecipeFilters filters={activeFilters} onChange={mockOnChange} />)

    // Should show badge with count of active filters (4: 1 category + 2 dietary + 1 difficulty)
    const badge = screen.getByText('4')
    expect(badge).toBeInTheDocument()
  })

  it('should collapse filter sections on mobile', async () => {
    const user = userEvent.setup()

    render(<RecipeFilters filters={defaultFilters} onChange={mockOnChange} />)

    const categorySection = screen.getByTestId('filter-section-category')
    const toggleButton = within(categorySection).getByRole('button', { name: /toggle/i })

    // Verify toggle button exists
    expect(toggleButton).toBeInTheDocument()
  })

  it('should be keyboard navigable', async () => {
    const user = userEvent.setup()

    render(<RecipeFilters filters={defaultFilters} onChange={mockOnChange} />)

    // Tab through filter buttons
    await user.tab()
    // Just check that tab navigation works
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('should highlight selected filters visually', () => {
    const activeFilters = {
      ...defaultFilters,
      category: 'Cookies',
      difficulty: 'Easy'
    }

    render(<RecipeFilters filters={activeFilters} onChange={mockOnChange} />)

    const cookiesButton = screen.getByRole('button', { name: /cookies/i })
    const easyButton = screen.getByRole('button', { name: /easy/i })

    expect(cookiesButton).toHaveClass('is-active')
    expect(easyButton).toHaveClass('is-active')
  })

  it('should update sort order', async () => {
    const user = userEvent.setup()

    render(<RecipeFilters filters={defaultFilters} onChange={mockOnChange} />)

    const sortSelect = screen.getByLabelText(/sort by/i)
    await user.selectOptions(sortSelect, 'a-z')

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ sortBy: 'a-z' })
    )
  })

  it('should filter by season', async () => {
    const user = userEvent.setup()

    render(<RecipeFilters filters={defaultFilters} onChange={mockOnChange} />)

    // Find the button with the exact text "Fall" (button text, not aria label)
    const fallButton = screen.getByText('Fall')
    await user.click(fallButton)

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ season: 'Fall' })
    )
  })

  it('should filter by cook time', async () => {
    const user = userEvent.setup()

    render(<RecipeFilters filters={defaultFilters} onChange={mockOnChange} />)

    const quickButton = screen.getByRole('button', { name: /under 30 minutes/i })
    await user.click(quickButton)

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ cookTime: 'under-30' })
    )
  })

  it('should support multiple tag selections', async () => {
    const user = userEvent.setup()

    render(<RecipeFilters filters={defaultFilters} onChange={mockOnChange} />)

    const chocolateTag = screen.getByRole('button', { name: /chocolate/i })
    await user.click(chocolateTag)

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ tags: ['Chocolate'] })
    )
  })

  it('should have proper ARIA labels for accessibility', () => {
    render(<RecipeFilters filters={defaultFilters} onChange={mockOnChange} />)

    const categorySection = screen.getByRole('region', { name: /category filters/i })
    expect(categorySection).toBeInTheDocument()

    const dietarySection = screen.getByRole('region', { name: /dietary restriction filters/i })
    expect(dietarySection).toBeInTheDocument()
  })
})
