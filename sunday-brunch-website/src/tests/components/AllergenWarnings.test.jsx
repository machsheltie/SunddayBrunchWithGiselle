import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AllergenWarnings from '../../components/AllergenWarnings'

describe('AllergenWarnings Component', () => {
  const mockAllergens = ['Milk', 'Eggs', 'Wheat']

  it('should display allergen warnings prominently', () => {
    render(<AllergenWarnings allergens={mockAllergens} />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('should show warning icon', () => {
    render(<AllergenWarnings allergens={mockAllergens} />)

    const warningIcon = screen.getByText('⚠️')
    expect(warningIcon).toBeInTheDocument()
  })

  it('should display "Contains" heading', () => {
    render(<AllergenWarnings allergens={mockAllergens} />)

    const heading = screen.getByRole('heading', { name: /contains/i })
    expect(heading).toBeInTheDocument()
  })

  it('should list all allergens', () => {
    render(<AllergenWarnings allergens={mockAllergens} />)

    expect(screen.getByText(/milk/i)).toBeInTheDocument()
    expect(screen.getByText(/eggs/i)).toBeInTheDocument()
    expect(screen.getByText(/wheat/i)).toBeInTheDocument()
  })

  it('should display milk allergen', () => {
    render(<AllergenWarnings allergens={['Milk']} />)

    expect(screen.getByText(/milk/i)).toBeInTheDocument()
  })

  it('should display eggs allergen', () => {
    render(<AllergenWarnings allergens={['Eggs']} />)

    expect(screen.getByText(/eggs/i)).toBeInTheDocument()
  })

  it('should display wheat allergen', () => {
    render(<AllergenWarnings allergens={['Wheat']} />)

    expect(screen.getByText(/wheat/i)).toBeInTheDocument()
  })

  it('should display soy allergen', () => {
    render(<AllergenWarnings allergens={['Soy']} />)

    expect(screen.getByText(/soy/i)).toBeInTheDocument()
  })

  it('should display peanuts allergen', () => {
    render(<AllergenWarnings allergens={['Peanuts']} />)

    expect(screen.getByText(/peanuts/i)).toBeInTheDocument()
  })

  it('should display tree nuts allergen', () => {
    render(<AllergenWarnings allergens={['Tree Nuts']} />)

    expect(screen.getByText(/tree nuts/i)).toBeInTheDocument()
  })

  it('should display fish allergen', () => {
    render(<AllergenWarnings allergens={['Fish']} />)

    expect(screen.getByText(/fish/i)).toBeInTheDocument()
  })

  it('should display shellfish allergen', () => {
    render(<AllergenWarnings allergens={['Shellfish']} />)

    expect(screen.getByText(/shellfish/i)).toBeInTheDocument()
  })

  it('should handle no allergens gracefully', () => {
    const { container } = render(<AllergenWarnings allergens={[]} />)

    const alert = container.querySelector('[role="alert"]')
    expect(alert).not.toBeInTheDocument()
  })

  it('should handle undefined allergens prop', () => {
    const { container } = render(<AllergenWarnings />)

    const alert = container.querySelector('[role="alert"]')
    expect(alert).not.toBeInTheDocument()
  })

  it('should handle null allergens prop', () => {
    const { container } = render(<AllergenWarnings allergens={null} />)

    const alert = container.querySelector('[role="alert"]')
    expect(alert).not.toBeInTheDocument()
  })

  it('should be accessible with proper ARIA roles', () => {
    render(<AllergenWarnings allergens={mockAllergens} />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveAttribute('aria-live', 'polite')
  })

  it('should have ARIA label for screen readers', () => {
    render(<AllergenWarnings allergens={mockAllergens} />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveAttribute('aria-label', expect.stringContaining('allergen'))
  })

  it('should apply warning styling class', () => {
    const { container } = render(<AllergenWarnings allergens={mockAllergens} />)

    const warningBox = container.querySelector('.allergen-warnings')
    expect(warningBox).toBeInTheDocument()
    expect(warningBox).toHaveClass('allergen-warnings--warning')
  })

  it('should display allergens as tags', () => {
    const { container } = render(<AllergenWarnings allergens={mockAllergens} />)

    const tags = container.querySelectorAll('.allergen-tag')
    expect(tags.length).toBe(3)
  })

  it('should separate allergens visually', () => {
    render(<AllergenWarnings allergens={mockAllergens} />)

    const allergenList = screen.getByRole('list')
    expect(allergenList).toBeInTheDocument()

    const allergenItems = screen.getAllByRole('listitem')
    expect(allergenItems.length).toBe(3)
  })

  it('should use high contrast colors for visibility', () => {
    const { container } = render(<AllergenWarnings allergens={mockAllergens} />)

    const warningBox = container.querySelector('.allergen-warnings')
    const styles = window.getComputedStyle(warningBox)

    // Should have warning background
    expect(warningBox).toHaveClass('allergen-warnings--warning')
  })

  it('should be prominently positioned', () => {
    const { container } = render(<AllergenWarnings allergens={mockAllergens} />)

    const warningBox = container.querySelector('.allergen-warnings')
    expect(warningBox).toHaveClass('is-prominent')
  })

  it('should display FDA-required allergens in correct format', () => {
    const fdaAllergens = [
      'Milk', 'Eggs', 'Fish', 'Shellfish', 'Tree Nuts',
      'Peanuts', 'Wheat', 'Soybeans'
    ]

    render(<AllergenWarnings allergens={fdaAllergens} />)

    // Check allergen tags directly to avoid "fish" matching in "shellfish"
    const allergenTags = screen.getAllByRole('listitem')
    const allergenTexts = allergenTags.map(tag => tag.textContent)

    expect(allergenTexts).toContain('Milk')
    expect(allergenTexts).toContain('Eggs')
    expect(allergenTexts).toContain('Fish')
    expect(allergenTexts).toContain('Shellfish')
    expect(allergenTexts).toContain('Tree Nuts')
    expect(allergenTexts).toContain('Peanuts')
    expect(allergenTexts).toContain('Wheat')
    expect(allergenTexts).toContain('Soy') // Soybeans normalized to Soy
  })

  it('should handle case-insensitive allergen names', () => {
    render(<AllergenWarnings allergens={['MILK', 'eggs', 'WhEaT']} />)

    expect(screen.getByText(/milk/i)).toBeInTheDocument()
    expect(screen.getByText(/eggs/i)).toBeInTheDocument()
    expect(screen.getByText(/wheat/i)).toBeInTheDocument()
  })

  it('should display allergen count for screen readers', () => {
    render(<AllergenWarnings allergens={mockAllergens} />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent(/3.*allergen/i)
  })

  it('should use semantic HTML for better accessibility', () => {
    const { container } = render(<AllergenWarnings allergens={mockAllergens} />)

    const section = container.querySelector('section.allergen-warnings')
    expect(section).toBeInTheDocument()
  })

  it('should be print-friendly', () => {
    const { container } = render(<AllergenWarnings allergens={mockAllergens} />)

    const warningBox = container.querySelector('.allergen-warnings')
    expect(warningBox).toHaveClass('print-friendly')
  })

  it('should display allergen disclaimer text', () => {
    render(<AllergenWarnings allergens={mockAllergens} />)

    expect(screen.getByText(/manufactured in a facility/i)).toBeInTheDocument()
  })

  it('should animate warning on mount for attention', () => {
    const { container } = render(<AllergenWarnings allergens={mockAllergens} />)

    const warningBox = container.querySelector('.allergen-warnings')
    expect(warningBox).toHaveClass('animate-in')
  })

  it('should handle very long allergen lists', () => {
    const manyAllergens = [
      'Milk', 'Eggs', 'Fish', 'Shellfish', 'Tree Nuts',
      'Peanuts', 'Wheat', 'Soybeans', 'Sesame'
    ]

    render(<AllergenWarnings allergens={manyAllergens} />)

    const allergenItems = screen.getAllByRole('listitem')
    expect(allergenItems.length).toBe(9)
  })

  it('should support mobile responsive layout', () => {
    const { container } = render(<AllergenWarnings allergens={mockAllergens} />)

    const warningBox = container.querySelector('.allergen-warnings')
    expect(warningBox).toHaveClass('is-responsive')
  })

  it('should have high visibility border', () => {
    const { container } = render(<AllergenWarnings allergens={mockAllergens} />)

    const warningBox = container.querySelector('.allergen-warnings')
    expect(warningBox).toHaveClass('has-warning-border')
  })

  it('should display sesame allergen (new FDA requirement)', () => {
    render(<AllergenWarnings allergens={['Sesame']} />)

    expect(screen.getByText(/sesame/i)).toBeInTheDocument()
  })
})
