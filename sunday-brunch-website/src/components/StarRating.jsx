import { useState } from 'react'
import './StarRating.css'

/**
 * StarRating Component
 *
 * Displays star ratings for recipes (1-5 stars).
 * Can be used in read-only mode (display average) or interactive mode (user rating).
 *
 * Props:
 * - value: Current rating value (0-5)
 * - count: Optional number of ratings (displays as "(count)")
 * - onChange: Optional callback for interactive mode - makes stars clickable
 * - disabled: Disable interaction (only works with onChange)
 * - size: 'small' | 'medium' | 'large' (default: 'medium')
 *
 * Features:
 * - Display half stars for decimal values (e.g., 3.5 stars)
 * - Interactive mode with hover preview
 * - Keyboard accessible (arrow keys)
 * - WCAG 2.1 AA compliant
 */
export default function StarRating({ value = 0, count, onChange, disabled = false, size = 'medium' }) {
  const [hoverValue, setHoverValue] = useState(0)

  // Clamp value between 0 and 5
  const clampedValue = Math.max(0, Math.min(5, value || 0))

  // Determine if component is interactive
  const isInteractive = !!onChange && !disabled

  // Calculate which stars to fill
  const getStarState = (index) => {
    const displayValue = hoverValue || clampedValue
    const starPosition = index + 1

    if (displayValue >= starPosition) {
      return 'filled'
    } else if (displayValue >= starPosition - 0.5 && displayValue < starPosition) {
      return 'half'
    }
    return 'empty'
  }

  // Handle star click
  const handleClick = (index) => {
    if (!isInteractive) return
    const newValue = index + 1
    onChange(newValue)
  }

  // Handle star hover
  const handleMouseEnter = (index) => {
    if (!isInteractive) return
    setHoverValue(index + 1)
  }

  // Handle mouse leave container
  const handleMouseLeave = () => {
    if (!isInteractive) return
    setHoverValue(0)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isInteractive) return

    if (e.key === 'ArrowRight') {
      e.preventDefault()
      if (clampedValue < 5) {
        onChange(Math.ceil(clampedValue) + 1)
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      if (clampedValue > 1) {
        onChange(Math.floor(clampedValue) - 1)
      }
    }
  }

  // Generate ARIA label
  const ariaLabel = isInteractive
    ? `Rate this recipe from 1 to 5 stars. Current rating: ${clampedValue} stars`
    : `Rating: ${clampedValue} out of 5 stars`

  const containerClasses = [
    'star-rating',
    `star-rating--${size}`,
    isInteractive && 'star-rating--interactive',
    disabled && 'star-rating--disabled'
  ].filter(Boolean).join(' ')

  return (
    <div
      className={containerClasses}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={isInteractive && !disabled ? 0 : undefined}
      role={isInteractive ? 'slider' : 'img'}
      aria-label={ariaLabel}
      aria-valuenow={isInteractive ? clampedValue : undefined}
      aria-valuemin={isInteractive ? 1 : undefined}
      aria-valuemax={isInteractive ? 5 : undefined}
      aria-disabled={disabled ? 'true' : undefined}
    >
      <div className="star-rating__stars">
        {[0, 1, 2, 3, 4].map((index) => {
          const starState = getStarState(index)
          const isHovered = hoverValue > 0 && index < hoverValue

          const starClasses = [
            'star-rating__star',
            starState === 'filled' && 'star-rating__star--filled',
            starState === 'half' && 'star-rating__star--half',
            isInteractive && 'star-rating__star--interactive',
            isHovered && 'star-rating__star--hover'
          ].filter(Boolean).join(' ')

          return (
            <span
              key={index}
              className={starClasses}
              onClick={() => handleClick(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              role="img"
              aria-hidden="true"
            >
              {starState === 'filled' && '★'}
              {starState === 'half' && (
                <>
                  <span className="star-rating__star-half-left">★</span>
                  <span className="star-rating__star-half-right">☆</span>
                </>
              )}
              {starState === 'empty' && '☆'}
            </span>
          )
        })}
      </div>

      {count !== undefined && count !== null && (
        <span className="star-rating__count">({count})</span>
      )}
    </div>
  )
}
