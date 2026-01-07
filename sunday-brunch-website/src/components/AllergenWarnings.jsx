import PropTypes from 'prop-types'
import './AllergenWarnings.css'
import { NUTRITION_STRINGS } from '../constants/nutritionConstants'

function AllergenWarnings({ allergens }) {
  if (!allergens || allergens.length === 0) {
    return null
  }

  // Normalize allergen names for consistent display
  const normalizeAllergen = (allergen) => {
    const normalized = allergen.trim()
    // Handle common variations
    if (normalized.toLowerCase() === 'soybeans') return 'Soy'
    return normalized
  }

  const normalizedAllergens = allergens.map(normalizeAllergen)
  const allergenCount = normalizedAllergens.length

  return (
    <section
      className="allergen-warnings allergen-warnings--warning is-prominent is-responsive has-warning-border print-friendly animate-in"
      role="alert"
      aria-live="polite"
      aria-label={`Allergen warning: Contains ${allergenCount} allergen${allergenCount > 1 ? 's' : ''}`}
    >
      <div className="allergen-warnings__icon">
        ⚠️
      </div>

      <div className="allergen-warnings__content">
        <h4 className="allergen-warnings__title">{NUTRITION_STRINGS.ALLERGEN_WARNING}</h4>

        <p className="allergen-warnings__count">
          This recipe contains {allergenCount} allergen{allergenCount > 1 ? 's' : ''}:
        </p>

        <ul className="allergen-warnings__list" role="list">
          {normalizedAllergens.map((allergen) => (
            <li key={allergen} className="allergen-tag" role="listitem">
              {allergen}
            </li>
          ))}
        </ul>

        <p className="allergen-warnings__disclaimer">
          {NUTRITION_STRINGS.FACILITY_WARNING}
        </p>
      </div>
    </section>
  )
}

AllergenWarnings.propTypes = {
  allergens: PropTypes.arrayOf(PropTypes.string)
}

export default AllergenWarnings
