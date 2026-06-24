import { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import './DietaryBadges.css'

// Dietary badge configuration with icons, tooltips, and CSS classes
const DIETARY_CONFIG = {
  'vegan': {
    icon: '🌱',
    tooltip: 'Vegan - No animal products',
    className: 'dietary-badge--vegan'
  },
  'gluten-free': {
    icon: '🌾',
    tooltip: 'Gluten-Free - No wheat, barley, or rye',
    className: 'dietary-badge--gluten-free'
  },
  'dairy-free': {
    icon: '🥛',
    tooltip: 'Dairy-Free - No milk or dairy products',
    className: 'dietary-badge--dairy-free'
  },
  'nut-free': {
    icon: '🥜',
    tooltip: 'Nut-Free - No tree nuts or peanuts',
    className: 'dietary-badge--nut-free'
  },
  'egg-free': {
    icon: '🥚',
    tooltip: 'Egg-Free - No eggs',
    className: 'dietary-badge--egg-free'
  },
  'refined sugar-free': {
    icon: '🍬',
    tooltip: 'Refined Sugar-Free - No processed sugars',
    className: 'dietary-badge--sugar-free'
  },
  'keto-friendly': {
    icon: '🥑',
    tooltip: 'Keto-Friendly - Low carb, high fat',
    className: 'dietary-badge--keto'
  },
  'low-carb': {
    icon: '🍃',
    tooltip: 'Low-Carb - Reduced carbohydrates',
    className: 'dietary-badge--low-carb'
  },
  'vegetarian': {
    icon: '💚',
    tooltip: 'Vegetarian - No meat or fish',
    className: 'dietary-badge--vegetarian'
  },
  'paleo': {
    icon: '🌿',
    tooltip: 'Paleo - Whole foods, no grains or dairy',
    className: 'dietary-badge--paleo'
  },
  'low-sodium': {
    icon: '🧂',
    tooltip: 'Low-Sodium - Reduced salt content',
    className: 'dietary-badge--low-sodium'
  },
  'heart-healthy': {
    icon: '❤️',
    tooltip: 'Heart-Healthy - Good for cardiovascular health',
    className: 'dietary-badge--heart-healthy'
  }
}

function DietaryBadges({ dietary, maxVisible = null, label = null }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoveredBadge, setHoveredBadge] = useState(null)

  const handleMouseEnter = useCallback((badgeKey) => {
    setHoveredBadge(badgeKey)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredBadge(null)
  }, [])

  if (!dietary || dietary.length === 0) {
    return null
  }

  const getDietaryConfig = (dietName) => {
    const normalizedName = dietName.toLowerCase().trim()
    return DIETARY_CONFIG[normalizedName] || {
      icon: '🏷️',
      tooltip: dietName,
      className: 'dietary-badge--default'
    }
  }

  const displayedBadges = maxVisible && !isExpanded
    ? dietary.slice(0, maxVisible)
    : dietary

  const hiddenCount = maxVisible ? dietary.length - maxVisible : 0

  const list = (
    <ul className="dietary-badges is-responsive" role="list">
      {displayedBadges.map((diet) => {
        const config = getDietaryConfig(diet)

        return (
          <li
            key={diet}
            className={`dietary-badge animate-in ${config.className}`}
            role="listitem"
            tabIndex={0}
            aria-label={config.tooltip}
            aria-describedby={hoveredBadge === diet ? `tooltip-${diet}` : undefined}
            onMouseEnter={() => handleMouseEnter(diet)}
            onMouseLeave={handleMouseLeave}
            onFocus={() => handleMouseEnter(diet)}
            onBlur={handleMouseLeave}
          >
            <span className="dietary-badge__icon" aria-hidden="true">{config.icon}</span>
            <span className="dietary-badge__label">{diet}</span>

            {hoveredBadge === diet && (
              <div
                id={`tooltip-${diet}`}
                className="dietary-badge__tooltip"
                role="tooltip"
              >
                {config.tooltip}
              </div>
            )}
          </li>
        )
      })}

      {maxVisible && hiddenCount > 0 && !isExpanded && (
        <li role="listitem">
          <button
            className="dietary-badge dietary-badge--more"
            onClick={() => setIsExpanded(true)}
            aria-label={`Show ${hiddenCount} more dietary restrictions`}
          >
            Show {hiddenCount} more
          </button>
        </li>
      )}
    </ul>
  )

  if (!label) {
    return list
  }

  // Optional category lead-in (e.g. "Dietary") that mirrors the allergen
  // row's "Contains" label for a consistent label | pills rhythm.
  return (
    <div className="dietary-badges-group">
      <span className="dietary-badges__label">{label}</span>
      {list}
    </div>
  )
}

DietaryBadges.propTypes = {
  dietary: PropTypes.arrayOf(PropTypes.string),
  maxVisible: PropTypes.number,
  label: PropTypes.string
}

export default DietaryBadges
