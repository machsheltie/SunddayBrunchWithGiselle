import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import StarRating from './StarRating'

describe('StarRating', () => {
  describe('Display Mode (Read-Only)', () => {
    it('should render 5 stars', () => {
      render(<StarRating value={0} />)

      const stars = screen.getAllByRole('img', { hidden: true })
      expect(stars).toHaveLength(5)
    })

    it('should display correct number of filled stars for whole numbers', () => {
      const { container } = render(<StarRating value={3} />)

      const filledStars = container.querySelectorAll('.star-rating__star--filled')
      expect(filledStars).toHaveLength(3)
    })

    it('should display half-filled star for decimal values', () => {
      const { container } = render(<StarRating value={3.5} />)

      const filledStars = container.querySelectorAll('.star-rating__star--filled')
      const halfStars = container.querySelectorAll('.star-rating__star--half')

      expect(filledStars).toHaveLength(3)
      expect(halfStars).toHaveLength(1)
    })

    it('should display 0 filled stars for value 0', () => {
      const { container } = render(<StarRating value={0} />)

      const filledStars = container.querySelectorAll('.star-rating__star--filled')
      expect(filledStars).toHaveLength(0)
    })

    it('should display 5 filled stars for value 5', () => {
      const { container } = render(<StarRating value={5} />)

      const filledStars = container.querySelectorAll('.star-rating__star--filled')
      expect(filledStars).toHaveLength(5)
    })

    it('should display rating count when provided', () => {
      render(<StarRating value={4.5} count={128} />)

      expect(screen.getByText('(128)')).toBeInTheDocument()
    })

    it('should not display count when not provided', () => {
      const { container } = render(<StarRating value={4.5} />)

      expect(container.textContent).not.toMatch(/\(\d+\)/)
    })

    it('should not be interactive in display mode', () => {
      const { container } = render(<StarRating value={3} />)

      const stars = container.querySelectorAll('.star-rating__star')
      stars.forEach(star => {
        expect(star).not.toHaveStyle({ cursor: 'pointer' })
      })
    })
  })

  describe('Interactive Mode', () => {
    it('should be interactive when onChange is provided', () => {
      const onChange = vi.fn()
      const { container } = render(<StarRating value={0} onChange={onChange} />)

      const stars = container.querySelectorAll('.star-rating__star')
      stars.forEach(star => {
        expect(star).toHaveClass('star-rating__star--interactive')
      })
    })

    it('should call onChange with correct value when star is clicked', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const { container } = render(<StarRating value={0} onChange={onChange} />)

      const stars = container.querySelectorAll('.star-rating__star')

      // Click third star
      await user.click(stars[2])

      expect(onChange).toHaveBeenCalledWith(3)
    })

    it('should call onChange with 1 when first star is clicked', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const { container } = render(<StarRating value={0} onChange={onChange} />)

      const stars = container.querySelectorAll('.star-rating__star')
      await user.click(stars[0])

      expect(onChange).toHaveBeenCalledWith(1)
    })

    it('should call onChange with 5 when last star is clicked', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const { container } = render(<StarRating value={0} onChange={onChange} />)

      const stars = container.querySelectorAll('.star-rating__star')
      await user.click(stars[4])

      expect(onChange).toHaveBeenCalledWith(5)
    })

    it('should highlight stars on hover', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const { container } = render(<StarRating value={0} onChange={onChange} />)

      const stars = container.querySelectorAll('.star-rating__star')

      // Hover over third star
      await user.hover(stars[2])

      // First three stars should be highlighted
      expect(stars[0]).toHaveClass('star-rating__star--hover')
      expect(stars[1]).toHaveClass('star-rating__star--hover')
      expect(stars[2]).toHaveClass('star-rating__star--hover')
      expect(stars[3]).not.toHaveClass('star-rating__star--hover')
      expect(stars[4]).not.toHaveClass('star-rating__star--hover')
    })

    it('should remove hover state when mouse leaves', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const { container } = render(<StarRating value={0} onChange={onChange} />)

      const stars = container.querySelectorAll('.star-rating__star')
      const ratingContainer = container.querySelector('.star-rating')

      // Hover over third star
      await user.hover(stars[2])
      expect(stars[2]).toHaveClass('star-rating__star--hover')

      // Mouse leave
      await user.unhover(ratingContainer)
      expect(stars[2]).not.toHaveClass('star-rating__star--hover')
    })

    it('should allow changing rating multiple times', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const { container } = render(<StarRating value={3} onChange={onChange} />)

      const stars = container.querySelectorAll('.star-rating__star')

      await user.click(stars[4]) // Click 5th star
      expect(onChange).toHaveBeenCalledWith(5)

      await user.click(stars[1]) // Click 2nd star
      expect(onChange).toHaveBeenCalledWith(2)

      expect(onChange).toHaveBeenCalledTimes(2)
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA label in display mode', () => {
      render(<StarRating value={3.5} />)

      expect(screen.getByLabelText('Rating: 3.5 out of 5 stars')).toBeInTheDocument()
    })

    it('should have proper ARIA label in interactive mode', () => {
      const onChange = vi.fn()
      render(<StarRating value={0} onChange={onChange} />)

      expect(screen.getByLabelText(/rate this recipe/i)).toBeInTheDocument()
    })

    it('should be keyboard accessible - arrow keys', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const { container } = render(<StarRating value={0} onChange={onChange} />)

      const ratingContainer = container.querySelector('.star-rating')
      ratingContainer.focus()

      // Press right arrow 3 times
      await user.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}')

      expect(onChange).toHaveBeenLastCalledWith(3)
    })

    it('should be keyboard accessible - arrow left decreases rating', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const { container } = render(<StarRating value={3} onChange={onChange} />)

      const ratingContainer = container.querySelector('.star-rating')
      ratingContainer.focus()

      await user.keyboard('{ArrowLeft}')

      expect(onChange).toHaveBeenCalledWith(2)
    })

    it('should not go below 1 with left arrow', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const { container } = render(<StarRating value={1} onChange={onChange} />)

      const ratingContainer = container.querySelector('.star-rating')
      ratingContainer.focus()

      await user.keyboard('{ArrowLeft}')

      expect(onChange).not.toHaveBeenCalled()
    })

    it('should not go above 5 with right arrow', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const { container } = render(<StarRating value={5} onChange={onChange} />)

      const ratingContainer = container.querySelector('.star-rating')
      ratingContainer.focus()

      await user.keyboard('{ArrowRight}')

      expect(onChange).not.toHaveBeenCalled()
    })

    it('should have tabindex 0 in interactive mode', () => {
      const onChange = vi.fn()
      const { container } = render(<StarRating value={0} onChange={onChange} />)

      const ratingContainer = container.querySelector('.star-rating')
      expect(ratingContainer).toHaveAttribute('tabindex', '0')
    })

    it('should not have tabindex in display mode', () => {
      const { container } = render(<StarRating value={3} />)

      const ratingContainer = container.querySelector('.star-rating')
      expect(ratingContainer).not.toHaveAttribute('tabindex')
    })
  })

  describe('Size Variants', () => {
    it('should apply small size class', () => {
      const { container } = render(<StarRating value={3} size="small" />)

      expect(container.querySelector('.star-rating')).toHaveClass('star-rating--small')
    })

    it('should apply medium size class by default', () => {
      const { container } = render(<StarRating value={3} />)

      expect(container.querySelector('.star-rating')).toHaveClass('star-rating--medium')
    })

    it('should apply large size class', () => {
      const { container } = render(<StarRating value={3} size="large" />)

      expect(container.querySelector('.star-rating')).toHaveClass('star-rating--large')
    })
  })

  describe('Edge Cases', () => {
    it('should handle negative values as 0', () => {
      const { container } = render(<StarRating value={-1} />)

      const filledStars = container.querySelectorAll('.star-rating__star--filled')
      expect(filledStars).toHaveLength(0)
    })

    it('should handle values above 5 as 5', () => {
      const { container } = render(<StarRating value={6} />)

      const filledStars = container.querySelectorAll('.star-rating__star--filled')
      expect(filledStars).toHaveLength(5)
    })

    it('should handle null value as 0', () => {
      const { container} = render(<StarRating value={null} />)

      const filledStars = container.querySelectorAll('.star-rating__star--filled')
      expect(filledStars).toHaveLength(0)
    })

    it('should handle undefined value as 0', () => {
      const { container } = render(<StarRating value={undefined} />)

      const filledStars = container.querySelectorAll('.star-rating__star--filled')
      expect(filledStars).toHaveLength(0)
    })

    it('should handle disabled state', () => {
      const onChange = vi.fn()
      const { container } = render(<StarRating value={0} onChange={onChange} disabled />)

      const ratingContainer = container.querySelector('.star-rating')
      expect(ratingContainer).toHaveClass('star-rating--disabled')
      expect(ratingContainer).toHaveAttribute('aria-disabled', 'true')
    })

    it('should not call onChange when disabled', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const { container } = render(<StarRating value={0} onChange={onChange} disabled />)

      const stars = container.querySelectorAll('.star-rating__star')
      await user.click(stars[2])

      expect(onChange).not.toHaveBeenCalled()
    })
  })
})
