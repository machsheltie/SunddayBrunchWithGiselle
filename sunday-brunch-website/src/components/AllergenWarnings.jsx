import PropTypes from 'prop-types'
import './AllergenWarnings.css'

// Allergens render as compact inline pills (siblings of the dietary badges),
// not a large alert box. A short "Contains" lead-in plus a screen-reader label
// keep the meaning clear without dominating the page.
function AllergenWarnings({ allergens }) {
    if (!allergens || allergens.length === 0) {
        return null
    }

    // Normalize allergen names for consistent display.
    const normalizeAllergen = (allergen) => {
        const normalized = allergen.trim()
        if (normalized.toLowerCase() === 'soybeans') return 'Soy'
        return normalized
    }

    const normalizedAllergens = allergens.map(normalizeAllergen)
    const allergenCount = normalizedAllergens.length

    return (
        <div className="allergen-badges">
            <span className="allergen-badges__label">Contains</span>
            <ul
                className="allergen-badges__list"
                role="list"
                aria-label={`Contains ${allergenCount} allergen${allergenCount > 1 ? 's' : ''}: ${normalizedAllergens.join(', ')}`}
            >
                {normalizedAllergens.map((allergen, index) => (
                    <li key={`${allergen}-${index}`} className="allergen-badge" role="listitem">
                        {allergen}
                    </li>
                ))}
            </ul>
        </div>
    )
}

AllergenWarnings.propTypes = {
    allergens: PropTypes.arrayOf(PropTypes.string)
}

export default AllergenWarnings
