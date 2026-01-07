import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DietaryBadges from '../../components/DietaryBadges'

describe('DietaryBadges Component', () => {
  const mockDietary = ['Vegan', 'Gluten-Free', 'Nut-Free']

  it('should render all provided dietary badges', () => {
    render(<DietaryBadges dietary={mockDietary} />)

    expect(screen.getByText(/vegan/i)).toBeInTheDocument()
    expect(screen.getByText(/gluten-free/i)).toBeInTheDocument()
    expect(screen.getByText(/nut-free/i)).toBeInTheDocument()
  })

  it('should display correct icon for vegan badge', () => {
    render(<DietaryBadges dietary={['Vegan']} />)

    const veganBadge = screen.getByText(/vegan/i).closest('.dietary-badge')
    expect(veganBadge).toHaveTextContent('🌱')
  })

  it('should display correct icon for gluten-free badge', () => {
    render(<DietaryBadges dietary={['Gluten-Free']} />)

    const glutenFreeBadge = screen.getByText(/gluten-free/i).closest('.dietary-badge')
    expect(glutenFreeBadge).toHaveTextContent('🌾')
  })

  it('should display correct icon for dairy-free badge', () => {
    render(<DietaryBadges dietary={['Dairy-Free']} />)

    const dairyFreeBadge = screen.getByText(/dairy-free/i).closest('.dietary-badge')
    expect(dairyFreeBadge).toHaveTextContent('🥛')
  })

  it('should display correct icon for nut-free badge', () => {
    render(<DietaryBadges dietary={['Nut-Free']} />)

    const nutFreeBadge = screen.getByText(/nut-free/i).closest('.dietary-badge')
    expect(nutFreeBadge).toHaveTextContent('🥜')
  })

  it('should display correct icon for egg-free badge', () => {
    render(<DietaryBadges dietary={['Egg-Free']} />)

    const eggFreeBadge = screen.getByText(/egg-free/i).closest('.dietary-badge')
    expect(eggFreeBadge).toHaveTextContent('🥚')
  })

  it('should display correct icon for refined sugar-free badge', () => {
    render(<DietaryBadges dietary={['Refined Sugar-Free']} />)

    const sugarFreeBadge = screen.getByText(/refined sugar-free/i).closest('.dietary-badge')
    expect(sugarFreeBadge).toHaveTextContent('🍬')
  })

  it('should display correct icon for keto-friendly badge', () => {
    render(<DietaryBadges dietary={['Keto-Friendly']} />)

    const ketoBadge = screen.getByText(/keto-friendly/i).closest('.dietary-badge')
    expect(ketoBadge).toHaveTextContent('🥑')
  })

  it('should display correct icon for low-carb badge', () => {
    render(<DietaryBadges dietary={['Low-Carb']} />)

    const lowCarbBadge = screen.getByText(/low-carb/i).closest('.dietary-badge')
    expect(lowCarbBadge).toHaveTextContent('🍃')
  })

  it('should display correct icon for vegetarian badge', () => {
    render(<DietaryBadges dietary={['Vegetarian']} />)

    const vegetarianBadge = screen.getByText(/vegetarian/i).closest('.dietary-badge')
    expect(vegetarianBadge).toHaveTextContent('💚')
  })

  it('should display correct icon for paleo badge', () => {
    render(<DietaryBadges dietary={['Paleo']} />)

    const paleoBadge = screen.getByText(/paleo/i).closest('.dietary-badge')
    expect(paleoBadge).toHaveTextContent('🌿')
  })

  it('should display correct icon for low-sodium badge', () => {
    render(<DietaryBadges dietary={['Low-Sodium']} />)

    const lowSodiumBadge = screen.getByText(/low-sodium/i).closest('.dietary-badge')
    expect(lowSodiumBadge).toHaveTextContent('🧂')
  })

  it('should display correct icon for heart-healthy badge', () => {
    render(<DietaryBadges dietary={['Heart-Healthy']} />)

    const heartHealthyBadge = screen.getByText(/heart-healthy/i).closest('.dietary-badge')
    expect(heartHealthyBadge).toHaveTextContent('❤️')
  })

  it('should apply correct CSS class for vegan badge', () => {
    render(<DietaryBadges dietary={['Vegan']} />)

    const veganBadge = screen.getByText(/vegan/i).closest('.dietary-badge')
    expect(veganBadge).toHaveClass('dietary-badge--vegan')
  })

  it('should apply correct CSS class for gluten-free badge', () => {
    render(<DietaryBadges dietary={['Gluten-Free']} />)

    const glutenFreeBadge = screen.getByText(/gluten-free/i).closest('.dietary-badge')
    expect(glutenFreeBadge).toHaveClass('dietary-badge--gluten-free')
  })

  it('should show tooltip on hover', async () => {
    const user = userEvent.setup()

    render(<DietaryBadges dietary={['Vegan']} />)

    const veganBadge = screen.getByText(/vegan/i).closest('.dietary-badge')

    await user.hover(veganBadge)

    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toBeInTheDocument()
    expect(tooltip).toHaveTextContent(/no animal products/i)
  })

  it('should handle empty dietary array gracefully', () => {
    const { container } = render(<DietaryBadges dietary={[]} />)

    const badges = container.querySelectorAll('.dietary-badge')
    expect(badges.length).toBe(0)
  })

  it('should handle undefined dietary prop gracefully', () => {
    const { container } = render(<DietaryBadges />)

    const badges = container.querySelectorAll('.dietary-badge')
    expect(badges.length).toBe(0)
  })

  it('should be responsive (stack on mobile)', () => {
    const { container } = render(<DietaryBadges dietary={mockDietary} />)

    const badgesContainer = container.querySelector('.dietary-badges')
    expect(badgesContainer).toHaveClass('is-responsive')
  })

  it('should be keyboard accessible', async () => {
    const user = userEvent.setup()

    render(<DietaryBadges dietary={['Vegan', 'Gluten-Free']} />)

    const veganBadge = screen.getByText(/vegan/i).closest('.dietary-badge')

    await user.tab()
    expect(veganBadge).toHaveFocus()
  })

  it('should support keyboard navigation through all badges', async () => {
    const user = userEvent.setup()

    render(<DietaryBadges dietary={['Vegan', 'Gluten-Free', 'Nut-Free']} />)

    await user.tab()
    const veganBadge = screen.getByLabelText(/vegan - no animal products/i)
    expect(veganBadge).toHaveFocus()

    await user.tab()
    const glutenFreeBadge = screen.getByLabelText(/gluten-free/i)
    expect(glutenFreeBadge).toHaveFocus()

    await user.tab()
    const nutFreeBadge = screen.getByLabelText(/nut-free/i)
    expect(nutFreeBadge).toHaveFocus()
  })

  it('should have proper ARIA labels for screen readers', () => {
    render(<DietaryBadges dietary={['Vegan']} />)

    const veganBadge = screen.getByLabelText(/vegan - no animal products/i)
    expect(veganBadge).toBeInTheDocument()
  })

  it('should render badges in a list for semantic HTML', () => {
    const { container } = render(<DietaryBadges dietary={mockDietary} />)

    const list = container.querySelector('ul.dietary-badges')
    expect(list).toBeInTheDocument()

    const listItems = container.querySelectorAll('li.dietary-badge')
    expect(listItems.length).toBe(3)
  })

  it('should animate badges on mount', () => {
    const { container } = render(<DietaryBadges dietary={mockDietary} />)

    const badges = container.querySelectorAll('.dietary-badge')
    badges.forEach(badge => {
      expect(badge).toHaveClass('animate-in')
    })
  })

  it('should handle case-insensitive dietary names', () => {
    render(<DietaryBadges dietary={['vegan', 'GLUTEN-FREE', 'Nut-Free']} />)

    expect(screen.getByText(/vegan/i)).toBeInTheDocument()
    expect(screen.getByText(/gluten-free/i)).toBeInTheDocument()
    expect(screen.getByText(/nut-free/i)).toBeInTheDocument()
  })

  it('should handle unknown dietary restrictions gracefully', () => {
    render(<DietaryBadges dietary={['Unknown-Diet']} />)

    const unknownBadge = screen.getByText(/unknown-diet/i)
    expect(unknownBadge).toBeInTheDocument()
    expect(unknownBadge.closest('.dietary-badge')).toHaveClass('dietary-badge--default')
  })

  it('should limit number of visible badges on mobile (with expand button)', () => {
    const manyDietary = [
      'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Egg-Free',
      'Refined Sugar-Free', 'Keto-Friendly'
    ]

    render(<DietaryBadges dietary={manyDietary} maxVisible={3} />)

    // Should show first 3 badges + "Show X more" button
    const badges = screen.getAllByRole('listitem')
    expect(badges.length).toBeLessThanOrEqual(4) // 3 badges + 1 button
  })

  it('should expand to show all badges when "Show more" clicked', async () => {
    const user = userEvent.setup()
    const manyDietary = [
      'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Egg-Free'
    ]

    render(<DietaryBadges dietary={manyDietary} maxVisible={3} />)

    const showMoreButton = screen.getByRole('button', { name: /show.*more/i })
    await user.click(showMoreButton)

    // After clicking, all 5 badges should be visible
    expect(screen.getAllByRole('listitem').length).toBe(5)
  })
})
