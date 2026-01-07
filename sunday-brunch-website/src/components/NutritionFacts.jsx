import { useState } from 'react'
import PropTypes from 'prop-types'
import './NutritionFacts.css'
import { NUTRITION_STRINGS } from '../constants/nutritionConstants'

function NutritionFacts({ nutrition, servingMultiplier = 1, collapsible = false }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (!nutrition) return null

  const scale = (value) => {
    const scaled = value * servingMultiplier
    // Format to max 2 decimal places, removing trailing zeros
    return Math.round(scaled * 100) / 100
  }

  const formatAmount = (nutrient) => {
    if (!nutrient || nutrient.amount === undefined) return '0'
    const amount = scale(nutrient.amount)
    // Round to 1 decimal, remove trailing .0
    return amount % 1 === 0 ? Math.round(amount).toString() : amount.toFixed(1)
  }

  const formatDailyValue = (nutrient) => {
    if (!nutrient || nutrient.dailyValue === undefined) return null
    // Daily Values are per serving - don't scale
    return Math.round(nutrient.dailyValue)
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <section
      className="nutrition-facts print-friendly"
      role="region"
      aria-label="Nutrition Facts"
    >
      {collapsible && (
        <button
          onClick={toggleCollapse}
          aria-label="Toggle nutrition facts"
          className="nutrition-facts__toggle"
        >
          {isCollapsed ? 'Show' : 'Hide'} Nutrition Facts
        </button>
      )}

      <div
        className={`nutrition-facts__content ${isCollapsed ? 'is-collapsed' : ''}`}
        data-testid="nutrition-details"
      >
        <div className="nutrition-facts__title">Nutrition Facts</div>

        <div className="nutrition-facts__serving">
          <span className="nutrition-facts__servings">
            {nutrition.servingsPerRecipe} servings per container
          </span>
          <div className="nutrition-facts__serving-size">
            <strong>Serving size</strong>
            <span>{nutrition.servingSize}</span>
          </div>
          {servingMultiplier !== 1 && (
            <div className="nutrition-facts__scaled-note">
              Showing nutrition for {servingMultiplier} serving{servingMultiplier !== 1 ? 's' : ''}.
              % Daily Values are per single serving.
            </div>
          )}
        </div>

        <div className="nutrition-facts__calories">
          <span className="nutrition-facts__calories-label">Calories</span>
          <span className="nutrition-facts__calories-value">{scale(nutrition.calories)}</span>
        </div>

        <div className="nutrition-facts__daily-value-header">
          % Daily Value*
        </div>

        {/* Total Fat */}
        <div className="nutrition-facts__nutrient nutrition-facts__nutrient--major">
          <span>
            <strong>Total Fat</strong> {formatAmount(nutrition.totalFat)}{nutrition.totalFat?.unit || 'g'}
          </span>
          <span>
            <strong>{formatDailyValue(nutrition.totalFat)}%</strong>
          </span>
        </div>

        {/* Saturated Fat (indented) */}
        <div className="nutrition-facts__nutrient nutrition-facts__nutrient--indented">
          <span>
            Saturated Fat {formatAmount(nutrition.saturatedFat)}{nutrition.saturatedFat?.unit || 'g'}
          </span>
          <span>
            {formatDailyValue(nutrition.saturatedFat)}%
          </span>
        </div>

        {/* Trans Fat (indented) */}
        <div className="nutrition-facts__nutrient nutrition-facts__nutrient--indented">
          <span>
            Trans Fat {formatAmount(nutrition.transFat)}{nutrition.transFat?.unit || 'g'}
          </span>
        </div>

        {/* Cholesterol */}
        <div className="nutrition-facts__nutrient nutrition-facts__nutrient--major">
          <span>
            <strong>Cholesterol</strong> {formatAmount(nutrition.cholesterol)}{nutrition.cholesterol?.unit || 'mg'}
          </span>
          <span>
            <strong>{formatDailyValue(nutrition.cholesterol)}%</strong>
          </span>
        </div>

        {/* Sodium */}
        <div className="nutrition-facts__nutrient nutrition-facts__nutrient--major">
          <span>
            <strong>Sodium</strong> {formatAmount(nutrition.sodium)}{nutrition.sodium?.unit || 'mg'}
          </span>
          <span>
            <strong>{formatDailyValue(nutrition.sodium)}%</strong>
          </span>
        </div>

        {/* Total Carbohydrates */}
        <div className="nutrition-facts__nutrient nutrition-facts__nutrient--major">
          <span>
            <strong>Total Carbohydrate</strong> {formatAmount(nutrition.totalCarbohydrates)}{nutrition.totalCarbohydrates?.unit || 'g'}
          </span>
          <span>
            <strong>{formatDailyValue(nutrition.totalCarbohydrates)}%</strong>
          </span>
        </div>

        {/* Dietary Fiber (indented) */}
        <div className="nutrition-facts__nutrient nutrition-facts__nutrient--indented">
          <span>
            Dietary Fiber {formatAmount(nutrition.dietaryFiber)}{nutrition.dietaryFiber?.unit || 'g'}
          </span>
          <span>
            {formatDailyValue(nutrition.dietaryFiber)}%
          </span>
        </div>

        {/* Total Sugars (indented) */}
        <div className="nutrition-facts__nutrient nutrition-facts__nutrient--indented">
          <span>
            Total Sugars {formatAmount(nutrition.totalSugars)}{nutrition.totalSugars?.unit || 'g'}
          </span>
        </div>

        {/* Added Sugars (indented) */}
        <div className="nutrition-facts__nutrient nutrition-facts__nutrient--indented">
          <span>
            Includes {formatAmount(nutrition.addedSugars)}{nutrition.addedSugars?.unit || 'g'} Added Sugars
          </span>
          <span>
            {formatDailyValue(nutrition.addedSugars)}%
          </span>
        </div>

        {/* Protein */}
        <div className="nutrition-facts__nutrient nutrition-facts__nutrient--major">
          <span>
            <strong>Protein</strong> {formatAmount(nutrition.protein)}{nutrition.protein?.unit || 'g'}
          </span>
        </div>

        {/* Optional Micronutrients */}
        {nutrition.vitaminD && (
          <div className="nutrition-facts__nutrient">
            <span>
              Vitamin D {formatAmount(nutrition.vitaminD)}{nutrition.vitaminD?.unit || 'mcg'}
            </span>
            <span>
              {formatDailyValue(nutrition.vitaminD)}%
            </span>
          </div>
        )}

        {nutrition.calcium && (
          <div className="nutrition-facts__nutrient">
            <span>
              Calcium {formatAmount(nutrition.calcium)}{nutrition.calcium?.unit || 'mg'}
            </span>
            <span>
              {formatDailyValue(nutrition.calcium)}%
            </span>
          </div>
        )}

        {nutrition.iron && (
          <div className="nutrition-facts__nutrient">
            <span>
              Iron {formatAmount(nutrition.iron)}{nutrition.iron?.unit || 'mg'}
            </span>
            <span>
              {formatDailyValue(nutrition.iron)}%
            </span>
          </div>
        )}

        {nutrition.potassium && (
          <div className="nutrition-facts__nutrient">
            <span>
              Potassium {formatAmount(nutrition.potassium)}{nutrition.potassium?.unit || 'mg'}
            </span>
            <span>
              {formatDailyValue(nutrition.potassium)}%
            </span>
          </div>
        )}

        {/* FDA Footnote */}
        <div className="nutrition-facts__footnote">
          {NUTRITION_STRINGS.DAILY_VALUE_NOTE}
        </div>
      </div>
    </section>
  )
}

NutritionFacts.propTypes = {
  nutrition: PropTypes.shape({
    servingSize: PropTypes.string.isRequired,
    servingsPerRecipe: PropTypes.number.isRequired,
    calories: PropTypes.number.isRequired,
    totalFat: PropTypes.shape({
      amount: PropTypes.number.isRequired,
      unit: PropTypes.string.isRequired,
      dailyValue: PropTypes.number
    }).isRequired,
    saturatedFat: PropTypes.shape({
      amount: PropTypes.number.isRequired,
      unit: PropTypes.string.isRequired,
      dailyValue: PropTypes.number
    }).isRequired,
    transFat: PropTypes.shape({
      amount: PropTypes.number.isRequired,
      unit: PropTypes.string.isRequired
    }).isRequired,
    cholesterol: PropTypes.shape({
      amount: PropTypes.number.isRequired,
      unit: PropTypes.string.isRequired,
      dailyValue: PropTypes.number
    }).isRequired,
    sodium: PropTypes.shape({
      amount: PropTypes.number.isRequired,
      unit: PropTypes.string.isRequired,
      dailyValue: PropTypes.number
    }).isRequired,
    totalCarbohydrates: PropTypes.shape({
      amount: PropTypes.number.isRequired,
      unit: PropTypes.string.isRequired,
      dailyValue: PropTypes.number
    }).isRequired,
    dietaryFiber: PropTypes.shape({
      amount: PropTypes.number.isRequired,
      unit: PropTypes.string.isRequired,
      dailyValue: PropTypes.number
    }).isRequired,
    totalSugars: PropTypes.shape({
      amount: PropTypes.number.isRequired,
      unit: PropTypes.string.isRequired
    }).isRequired,
    addedSugars: PropTypes.shape({
      amount: PropTypes.number.isRequired,
      unit: PropTypes.string.isRequired,
      dailyValue: PropTypes.number
    }).isRequired,
    protein: PropTypes.shape({
      amount: PropTypes.number.isRequired,
      unit: PropTypes.string.isRequired
    }).isRequired,
    vitaminD: PropTypes.shape({
      amount: PropTypes.number,
      unit: PropTypes.string,
      dailyValue: PropTypes.number
    }),
    calcium: PropTypes.shape({
      amount: PropTypes.number,
      unit: PropTypes.string,
      dailyValue: PropTypes.number
    }),
    iron: PropTypes.shape({
      amount: PropTypes.number,
      unit: PropTypes.string,
      dailyValue: PropTypes.number
    }),
    potassium: PropTypes.shape({
      amount: PropTypes.number,
      unit: PropTypes.string,
      dailyValue: PropTypes.number
    })
  }),
  servingMultiplier: PropTypes.number,
  collapsible: PropTypes.bool
}

export default NutritionFacts
