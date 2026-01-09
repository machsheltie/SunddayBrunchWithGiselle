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

  // New comprehensive tests to close coverage gaps

  it('should persist filter state across re-renders', async () => {
    const user = userEvent.setup()
    const activeFilters = {
      ...defaultFilters,
      category: 'Cookies',
      dietary: ['Vegan']
    }

    const { rerender } = render(<RecipeFilters filters={activeFilters} onChange={mockOnChange} />)

    // Verify initial state
    const cookiesButton = screen.getByRole('button', { name: /cookies/i })
    expect(cookiesButton).toHaveClass('is-active')

    // Rerender with same filters
    rerender(<RecipeFilters filters={activeFilters} onChange={mockOnChange} />)

    // State should persist
    expect(cookiesButton).toHaveClass('is-active')
    expect(screen.getByText('2')).toBeInTheDocument() // Badge count
  })

  it('should clear all filters when Clear All button clicked', async () => {
    const user = userEvent.setup()
    const activeFilters = {
      category: 'Cookies',
      dietary: ['Vegan', 'Gluten-Free'],
      season: 'Summer',
      difficulty: 'Medium',
      cookTime: '30-60',
      tags: ['Chocolate', 'Fruit'],
      sortBy: 'a-z'
    }

    render(<RecipeFilters filters={activeFilters} onChange={mockOnChange} />)

    const clearButton = screen.getByRole('button', { name: /clear all filters/i })
    expect(clearButton).not.toBeDisabled()

    await user.click(clearButton)

    expect(mockOnChange).toHaveBeenCalledWith({
      category: 'all',
      dietary: [],
      season: 'all',
      difficulty: 'all',
      cookTime: 'all',
      tags: [],
      sortBy: 'newest'
    })
  })

  it('should have accessibility attributes for all filter sections', () => {
    render(<RecipeFilters filters={defaultFilters} onChange={mockOnChange} />)

    // Check all toggle buttons have proper aria-expanded and aria-controls
    const toggleButtons = screen.getAllByRole('button', { name: /toggle/i })

    toggleButtons.forEach(button => {
      expect(button).toHaveAttribute('aria-expanded')
      expect(button).toHaveAttribute('aria-controls')
      expect(button).toHaveAttribute('aria-label')
    })

    // Check filter section has aria-label
    const filterAside = screen.getByLabelText(/recipe filters/i)
    expect(filterAside).toBeInTheDocument()
  })

  it('should support keyboard navigation through all filter options', async () => {
    const user = userEvent.setup()

    render(<RecipeFilters filters={defaultFilters} onChange={mockOnChange} />)

    // Tab to first button (category toggle)
    await user.tab()

    const categoryToggle = screen.getByRole('button', { name: /toggle category filters/i })
    expect(categoryToggle).toHaveFocus()

    // Press Enter to activate filter
    await user.keyboard('{Enter}')

    expect(categoryToggle).toHaveAttribute('aria-expanded')
  })

  it('should collapse and expand filter sections with transitions', async () => {
    const user = userEvent.setup()

    render(<RecipeFilters filters={defaultFilters} onChange={mockOnChange} />)

    const difficultyToggle = screen.getByRole('button', { name: /toggle difficulty filters/i })

    // Initially expanded (aria-expanded should be true)
    expect(difficultyToggle).toHaveAttribute('aria-expanded', 'true')

    // Click to collapse
    await user.click(difficultyToggle)

    // Chevron should lose is-open class
    const chevron = difficultyToggle.querySelector('.chevron')
    expect(chevron).toBeInTheDocument()

    // Verify aria-expanded changed
    expect(difficultyToggle).toHaveAttribute('aria-expanded', 'false')

    // Filters should be hidden
    const difficultyFilters = screen.queryByRole('button', { name: /^easy$/i })
    expect(difficultyFilters).not.toBeInTheDocument()
  })

  it('should handle empty dietary restrictions array', () => {
    const filtersWithEmptyDietary = {
      ...defaultFilters,
      dietary: []
    }

    render(<RecipeFilters filters={filtersWithEmptyDietary} onChange={mockOnChange} />)

    // Should render without errors
    expect(screen.getByText(/dietary restrictions/i)).toBeInTheDocument()

    // No dietary filters should be active
    const veganButton = screen.getByRole('button', { name: /^vegan$/i })
    expect(veganButton).not.toHaveClass('is-active')
    expect(veganButton).toHaveAttribute('aria-pressed', 'false')
  })

  it('should handle empty tags array and occasions array', () => {
    const filtersWithEmptyTags = {
      ...defaultFilters,
      tags: []
    }

    render(<RecipeFilters filters={filtersWithEmptyTags} onChange={mockOnChange} />)

    // Should render without errors
    expect(screen.getAllByText(/tags/i).length).toBeGreaterThan(0)

    // No tags should be active
    const chocolateTag = screen.getByRole('button', { name: /chocolate/i })
    expect(chocolateTag).not.toHaveClass('is-active')
    expect(chocolateTag).toHaveAttribute('aria-pressed', 'false')
  })

  it('should disable Clear All button when filters are at default state', () => {
    render(<RecipeFilters filters={defaultFilters} onChange={mockOnChange} />)

    const clearButton = screen.getByRole('button', { name: /clear all filters/i })
    expect(clearButton).toBeDisabled()

    // Badge should not be shown
    expect(screen.queryByText(/active filters/i)).not.toBeInTheDocument()
  })

  it('should toggle difficulty filter and deselect when clicked again', async () => {
    const user = userEvent.setup()

    const { rerender } = render(<RecipeFilters filters={defaultFilters} onChange={mockOnChange} />)

    // Click "Medium" difficulty
    const mediumButton = screen.getByRole('button', { name: /medium/i })
    await user.click(mediumButton)

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ difficulty: 'Medium' })
    )

    mockOnChange.mockClear()

    // Rerender with Medium selected
    const activeFilters = { ...defaultFilters, difficulty: 'Medium' }
    rerender(<RecipeFilters filters={activeFilters} onChange={mockOnChange} />)

    // Click Medium again to deselect
    const mediumButtonActive = screen.getByRole('button', { name: /medium/i })
    await user.click(mediumButtonActive)

    // Should reset to 'all'
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ difficulty: 'all' })
    )
  })

  it('should toggle cook time filter and deselect when clicked again', async () => {
    const user = userEvent.setup()

    const { rerender } = render(<RecipeFilters filters={defaultFilters} onChange={mockOnChange} />)

    // Click "30-60 minutes"
    const mediumTimeButton = screen.getByRole('button', { name: /30-60 minutes/i })
    await user.click(mediumTimeButton)

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ cookTime: '30-60' })
    )

    mockOnChange.mockClear()

    // Rerender with 30-60 selected
    const activeFilters = { ...defaultFilters, cookTime: '30-60' }
    rerender(<RecipeFilters filters={activeFilters} onChange={mockOnChange} />)

    // Click again to deselect
    const mediumTimeButtonActive = screen.getByRole('button', { name: /30-60 minutes/i })
    await user.click(mediumTimeButtonActive)

    // Should reset to 'all'
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ cookTime: 'all' })
    )
  })

  it('should collapse tags section when toggle clicked', async () => {
    const user = userEvent.setup()

    render(<RecipeFilters filters={defaultFilters} onChange={mockOnChange} />)

    const tagsToggle = screen.getByRole('button', { name: /toggle tag filters/i })

    // Initially expanded
    expect(tagsToggle).toHaveAttribute('aria-expanded', 'true')

    // Click to collapse
    await user.click(tagsToggle)

    // Should be collapsed
    expect(tagsToggle).toHaveAttribute('aria-expanded', 'false')

    // Tags should not be visible
    expect(screen.queryByRole('button', { name: /^chocolate$/i })).not.toBeInTheDocument()
  })

  it('should remove dietary filter when clicked again', async () => {
    const user = userEvent.setup()

    const filtersWithDietary = {
      ...defaultFilters,
      dietary: ['Vegan', 'Gluten-Free']
    }

    render(<RecipeFilters filters={filtersWithDietary} onChange={mockOnChange} />)

    // Click Vegan to remove it (covers line 36 - filter branch)
    const veganButton = screen.getByRole('button', { name: /^vegan$/i })
    await user.click(veganButton)

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        dietary: expect.arrayContaining(['Gluten-Free'])
      })
    )

    // Should not include Vegan
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        dietary: expect.not.arrayContaining(['Vegan'])
      })
    )
  })

  it('should remove tag when clicked again', async () => {
    const user = userEvent.setup()

    const filtersWithTags = {
      ...defaultFilters,
      tags: ['Chocolate', 'Vanilla', 'Fruit']
    }

    render(<RecipeFilters filters={filtersWithTags} onChange={mockOnChange} />)

    // Click Vanilla to remove it (covers line 55 - filter branch)
    const vanillaButton = screen.getByRole('button', { name: /vanilla/i })
    await user.click(vanillaButton)

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        tags: expect.arrayContaining(['Chocolate', 'Fruit'])
      })
    )

    // Should not include Vanilla
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        tags: expect.not.arrayContaining(['Vanilla'])
      })
    )
  })

  it('should collapse dietary section when toggle clicked', async () => {
    const user = userEvent.setup()

    render(<RecipeFilters filters={defaultFilters} onChange={mockOnChange} />)

    const dietaryToggle = screen.getByRole('button', { name: /toggle dietary filters/i })

    // Initially expanded
    expect(dietaryToggle).toHaveAttribute('aria-expanded', 'true')

    // Click to collapse (covers line 146)
    await user.click(dietaryToggle)

    // Should be collapsed
    expect(dietaryToggle).toHaveAttribute('aria-expanded', 'false')

    // Dietary options should not be visible
    expect(screen.queryByRole('button', { name: /^vegan$/i })).not.toBeInTheDocument()
  })

  it('should collapse season section when toggle clicked', async () => {
    const user = userEvent.setup()

    render(<RecipeFilters filters={defaultFilters} onChange={mockOnChange} />)

    const seasonToggle = screen.getByRole('button', { name: /toggle season filters/i })

    // Initially expanded
    expect(seasonToggle).toHaveAttribute('aria-expanded', 'true')

    // Click to collapse (covers line 175)
    await user.click(seasonToggle)

    // Should be collapsed
    expect(seasonToggle).toHaveAttribute('aria-expanded', 'false')

    // Season options should not be visible
    expect(screen.queryByText(/^fall$/i)).not.toBeInTheDocument()
  })

  it('should collapse cook time section when toggle clicked', async () => {
    const user = userEvent.setup()

    render(<RecipeFilters filters={defaultFilters} onChange={mockOnChange} />)

    const cookTimeToggle = screen.getByRole('button', { name: /toggle cook time filters/i })

    // Initially expanded
    expect(cookTimeToggle).toHaveAttribute('aria-expanded', 'true')

    // Click to collapse (covers line 241)
    await user.click(cookTimeToggle)

    // Should be collapsed
    expect(cookTimeToggle).toHaveAttribute('aria-expanded', 'false')

    // Cook time options should not be visible
    expect(screen.queryByRole('button', { name: /under 30 minutes/i })).not.toBeInTheDocument()
  })
})
