import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AllergenWarnings from '../../components/AllergenWarnings'

describe('AllergenWarnings Component', () => {
  const mockAllergens = ['Milk', 'Eggs', 'Wheat']

  // --- New compact-badge contract ---------------------------------------
  // Allergens render as small inline pills (like the dietary badges), NOT a
  // large alert box. Each allergen type gets its own badge.

  it('should render each allergen as a badge', () => {
    const { container } = render(<AllergenWarnings allergens={mockAllergens} />)

    const badges = container.querySelectorAll('.allergen-badge')
    expect(badges.length).toBe(3)
  })

  it('should display each allergen name', () => {
    render(<AllergenWarnings allergens={mockAllergens} />)

    expect(screen.getByText('Milk')).toBeInTheDocument()
    expect(screen.getByText('Eggs')).toBeInTheDocument()
    expect(screen.getByText('Wheat')).toBeInTheDocument()
  })

  it('should show a visible "Contains" lead-in', () => {
    render(<AllergenWarnings allergens={mockAllergens} />)

    expect(screen.getByText(/contains/i)).toBeInTheDocument()
  })

  it('should NOT render a large alert box', () => {
    render(<AllergenWarnings allergens={mockAllergens} />)

    // The old garish red "caution" box is gone — no alert role, no box element.
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('should NOT render the old allergen-warnings box element', () => {
    const { container } = render(<AllergenWarnings allergens={mockAllergens} />)

    expect(container.querySelector('.allergen-warnings')).not.toBeInTheDocument()
  })

  it('should label the badge group as containing allergens for screen readers', () => {
    render(<AllergenWarnings allergens={mockAllergens} />)

    const list = screen.getByRole('list')
    const label = list.getAttribute('aria-label') || ''
    expect(label).toMatch(/contains/i)
    expect(label).toMatch(/allergen/i)
  })

  it('should render allergens as list items', () => {
    render(<AllergenWarnings allergens={mockAllergens} />)

    const items = screen.getAllByRole('listitem')
    expect(items.length).toBe(3)
  })

  // --- Preserved behaviour ----------------------------------------------

  it('should normalize "Soybeans" to "Soy"', () => {
    render(<AllergenWarnings allergens={['Soybeans']} />)

    expect(screen.getByText('Soy')).toBeInTheDocument()
  })

  it('should handle case-insensitive allergen names', () => {
    render(<AllergenWarnings allergens={['MILK', 'eggs', 'WhEaT']} />)

    expect(screen.getByText(/milk/i)).toBeInTheDocument()
    expect(screen.getByText(/eggs/i)).toBeInTheDocument()
    expect(screen.getByText(/wheat/i)).toBeInTheDocument()
  })

  it('should display all FDA-required allergens', () => {
    const fdaAllergens = [
      'Milk', 'Eggs', 'Fish', 'Shellfish', 'Tree Nuts',
      'Peanuts', 'Wheat', 'Soybeans'
    ]

    render(<AllergenWarnings allergens={fdaAllergens} />)

    const allergenTexts = screen.getAllByRole('listitem').map((item) => item.textContent)
    expect(allergenTexts).toContain('Milk')
    expect(allergenTexts).toContain('Eggs')
    expect(allergenTexts).toContain('Fish')
    expect(allergenTexts).toContain('Shellfish')
    expect(allergenTexts).toContain('Tree Nuts')
    expect(allergenTexts).toContain('Peanuts')
    expect(allergenTexts).toContain('Wheat')
    expect(allergenTexts).toContain('Soy') // Soybeans normalized to Soy
  })

  it('should display sesame allergen (new FDA requirement)', () => {
    render(<AllergenWarnings allergens={['Sesame']} />)

    expect(screen.getByText('Sesame')).toBeInTheDocument()
  })

  it('should handle very long allergen lists', () => {
    const manyAllergens = [
      'Milk', 'Eggs', 'Fish', 'Shellfish', 'Tree Nuts',
      'Peanuts', 'Wheat', 'Soybeans', 'Sesame'
    ]

    render(<AllergenWarnings allergens={manyAllergens} />)

    expect(screen.getAllByRole('listitem').length).toBe(9)
  })

  it('should be mobile responsive', () => {
    const { container } = render(<AllergenWarnings allergens={mockAllergens} />)

    expect(container.querySelector('.allergen-badges')).toBeInTheDocument()
  })

  // --- Graceful empty states --------------------------------------------

  it('should render nothing for an empty allergen list', () => {
    const { container } = render(<AllergenWarnings allergens={[]} />)

    expect(container.querySelector('.allergen-badges')).not.toBeInTheDocument()
  })

  it('should render nothing when allergens prop is undefined', () => {
    const { container } = render(<AllergenWarnings />)

    expect(container.querySelector('.allergen-badges')).not.toBeInTheDocument()
  })

  it('should render nothing when allergens prop is null', () => {
    const { container } = render(<AllergenWarnings allergens={null} />)

    expect(container.querySelector('.allergen-badges')).not.toBeInTheDocument()
  })
})
