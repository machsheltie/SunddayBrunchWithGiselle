import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NutritionFacts from '../../components/NutritionFacts'

describe('NutritionFacts Component', () => {
  const mockNutrition = {
    servingSize: "1 cookie (approx. 50g)",
    servingsPerRecipe: 24,
    calories: 180,
    totalFat: {
      amount: 8,
      unit: "g",
      dailyValue: 10
    },
    saturatedFat: {
      amount: 5,
      unit: "g",
      dailyValue: 25
    },
    transFat: {
      amount: 0,
      unit: "g"
    },
    cholesterol: {
      amount: 20,
      unit: "mg",
      dailyValue: 7
    },
    sodium: {
      amount: 140,
      unit: "mg",
      dailyValue: 6
    },
    totalCarbohydrates: {
      amount: 25,
      unit: "g",
      dailyValue: 9
    },
    dietaryFiber: {
      amount: 1,
      unit: "g",
      dailyValue: 4
    },
    totalSugars: {
      amount: 15,
      unit: "g"
    },
    addedSugars: {
      amount: 14,
      unit: "g",
      dailyValue: 28
    },
    protein: {
      amount: 2,
      unit: "g"
    },
    vitaminD: {
      amount: 0,
      unit: "mcg",
      dailyValue: 0
    },
    calcium: {
      amount: 20,
      unit: "mg",
      dailyValue: 2
    },
    iron: {
      amount: 1,
      unit: "mg",
      dailyValue: 6
    },
    potassium: {
      amount: 50,
      unit: "mg",
      dailyValue: 1
    }
  }

  it('should render nutrition facts card', () => {
    render(<NutritionFacts nutrition={mockNutrition} />)

    expect(screen.getByRole('region', { name: /nutrition facts/i })).toBeInTheDocument()
  })

  it('should display nutrition facts title', () => {
    render(<NutritionFacts nutrition={mockNutrition} />)

    expect(screen.getByText(/nutrition facts/i)).toBeInTheDocument()
  })

  it('should display serving size', () => {
    render(<NutritionFacts nutrition={mockNutrition} />)

    expect(screen.getByText(/1 cookie \(approx\. 50g\)/i)).toBeInTheDocument()
  })

  it('should display servings per recipe', () => {
    render(<NutritionFacts nutrition={mockNutrition} />)

    expect(screen.getByText(/24/)).toBeInTheDocument()
  })

  it('should display calories prominently', () => {
    render(<NutritionFacts nutrition={mockNutrition} />)

    const caloriesElement = screen.getByText(/180/)
    expect(caloriesElement).toBeInTheDocument()
    expect(caloriesElement.closest('.nutrition-facts__calories')).toBeInTheDocument()
  })

  it('should display total fat with daily value', () => {
    render(<NutritionFacts nutrition={mockNutrition} />)

    expect(screen.getByText(/total fat/i)).toBeInTheDocument()
    expect(screen.getByText(/8g/)).toBeInTheDocument()
    expect(screen.getByText(/10%/)).toBeInTheDocument()
  })

  it('should display saturated fat indented', () => {
    render(<NutritionFacts nutrition={mockNutrition} />)

    const saturatedFatElement = screen.getByText(/saturated fat/i)
    expect(saturatedFatElement).toBeInTheDocument()
    expect(saturatedFatElement.closest('.nutrition-facts__nutrient--indented')).toBeInTheDocument()
  })

  it('should display trans fat indented', () => {
    render(<NutritionFacts nutrition={mockNutrition} />)

    const transFatElement = screen.getByText(/trans fat/i)
    expect(transFatElement).toBeInTheDocument()
    expect(transFatElement.closest('.nutrition-facts__nutrient--indented')).toBeInTheDocument()
  })

  it('should display cholesterol with daily value', () => {
    render(<NutritionFacts nutrition={mockNutrition} />)

    const cholesterolElement = screen.getByText(/cholesterol/i)
    expect(cholesterolElement).toBeInTheDocument()

    // Check that cholesterol section contains 20mg and 7%
    const cholesterolRow = cholesterolElement.closest('.nutrition-facts__nutrient')
    expect(cholesterolRow).toHaveTextContent('20mg')
    expect(cholesterolRow).toHaveTextContent('7%')
  })

  it('should display sodium with daily value', () => {
    render(<NutritionFacts nutrition={mockNutrition} />)

    const sodiumElement = screen.getByText(/sodium/i)
    expect(sodiumElement).toBeInTheDocument()

    // Check that sodium section contains 140mg and 6%
    const sodiumRow = sodiumElement.closest('.nutrition-facts__nutrient')
    expect(sodiumRow).toHaveTextContent('140mg')
    expect(sodiumRow).toHaveTextContent('6%')
  })

  it('should display total carbohydrates with daily value', () => {
    render(<NutritionFacts nutrition={mockNutrition} />)

    expect(screen.getByText(/total carbohydrate/i)).toBeInTheDocument()
    expect(screen.getByText(/25g/)).toBeInTheDocument()
    expect(screen.getByText(/9%/)).toBeInTheDocument()
  })

  it('should display dietary fiber indented', () => {
    render(<NutritionFacts nutrition={mockNutrition} />)

    const fiberElement = screen.getByText(/dietary fiber/i)
    expect(fiberElement).toBeInTheDocument()
    expect(fiberElement.closest('.nutrition-facts__nutrient--indented')).toBeInTheDocument()
  })

  it('should display total sugars indented', () => {
    render(<NutritionFacts nutrition={mockNutrition} />)

    const sugarsElement = screen.getByText(/total sugars/i)
    expect(sugarsElement).toBeInTheDocument()
    expect(sugarsElement.closest('.nutrition-facts__nutrient--indented')).toBeInTheDocument()
  })

  it('should display added sugars indented with daily value', () => {
    render(<NutritionFacts nutrition={mockNutrition} />)

    const addedSugarsElement = screen.getByText(/added sugars/i)
    expect(addedSugarsElement).toBeInTheDocument()
    expect(addedSugarsElement.closest('.nutrition-facts__nutrient--indented')).toBeInTheDocument()
    expect(screen.getByText(/28%/)).toBeInTheDocument()
  })

  it('should display protein', () => {
    render(<NutritionFacts nutrition={mockNutrition} />)

    expect(screen.getByText(/protein/i)).toBeInTheDocument()
    expect(screen.getByText(/2g/)).toBeInTheDocument()
  })

  it('should display optional vitamin D when provided', () => {
    render(<NutritionFacts nutrition={mockNutrition} />)

    expect(screen.getByText(/vitamin D/i)).toBeInTheDocument()
    expect(screen.getByText(/0mcg/)).toBeInTheDocument()
  })

  it('should display optional calcium when provided', () => {
    render(<NutritionFacts nutrition={mockNutrition} />)

    const calciumElement = screen.getByText(/calcium/i)
    expect(calciumElement).toBeInTheDocument()

    // Check that calcium section contains 20mg
    const calciumRow = calciumElement.closest('.nutrition-facts__nutrient')
    expect(calciumRow).toHaveTextContent('20mg')
  })

  it('should display optional iron when provided', () => {
    render(<NutritionFacts nutrition={mockNutrition} />)

    expect(screen.getByText(/iron/i)).toBeInTheDocument()
    expect(screen.getByText(/1mg/)).toBeInTheDocument()
  })

  it('should display optional potassium when provided', () => {
    render(<NutritionFacts nutrition={mockNutrition} />)

    expect(screen.getByText(/potassium/i)).toBeInTheDocument()
    expect(screen.getByText(/50mg/)).toBeInTheDocument()
  })

  it('should scale nutrition when serving multiplier changes', () => {
    const { rerender } = render(
      <NutritionFacts nutrition={mockNutrition} servingMultiplier={1} />
    )

    expect(screen.getByText(/180/)).toBeInTheDocument() // 180 calories

    rerender(<NutritionFacts nutrition={mockNutrition} servingMultiplier={2} />)

    expect(screen.getByText(/360/)).toBeInTheDocument() // 360 calories (180 * 2)
  })

  it('should scale total fat correctly when multiplier changes', () => {
    const { rerender } = render(
      <NutritionFacts nutrition={mockNutrition} servingMultiplier={1} />
    )

    expect(screen.getByText(/8g/)).toBeInTheDocument() // 8g fat

    rerender(<NutritionFacts nutrition={mockNutrition} servingMultiplier={0.5} />)

    expect(screen.getByText(/4g/)).toBeInTheDocument() // 4g fat (8 * 0.5)
  })

  it('should handle missing optional nutrients gracefully', () => {
    const minimalNutrition = {
      servingSize: "1 serving",
      servingsPerRecipe: 12,
      calories: 150,
      totalFat: { amount: 5, unit: "g", dailyValue: 6 },
      saturatedFat: { amount: 2, unit: "g", dailyValue: 10 },
      transFat: { amount: 0, unit: "g" },
      cholesterol: { amount: 0, unit: "mg", dailyValue: 0 },
      sodium: { amount: 100, unit: "mg", dailyValue: 4 },
      totalCarbohydrates: { amount: 20, unit: "g", dailyValue: 7 },
      dietaryFiber: { amount: 2, unit: "g", dailyValue: 7 },
      totalSugars: { amount: 10, unit: "g" },
      addedSugars: { amount: 8, unit: "g", dailyValue: 16 },
      protein: { amount: 3, unit: "g" }
    }

    render(<NutritionFacts nutrition={minimalNutrition} />)

    expect(screen.getByText(/150/)).toBeInTheDocument()
    expect(screen.queryByText(/vitamin D/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/calcium/i)).not.toBeInTheDocument()
  })

  it('should have proper ARIA labels for accessibility', () => {
    render(<NutritionFacts nutrition={mockNutrition} />)

    const nutritionRegion = screen.getByRole('region', { name: /nutrition facts/i })
    expect(nutritionRegion).toBeInTheDocument()
  })

  it('should be collapsible on mobile', async () => {
    const user = userEvent.setup()

    render(<NutritionFacts nutrition={mockNutrition} collapsible={true} />)

    const toggleButton = screen.getByRole('button', { name: /toggle nutrition facts/i })
    expect(toggleButton).toBeInTheDocument()

    await user.click(toggleButton)

    // After clicking, the nutrition details should be hidden
    const nutritionDetails = screen.getByTestId('nutrition-details')
    expect(nutritionDetails).toHaveClass('is-collapsed')
  })

  it('should have print-friendly class', () => {
    const { container } = render(<NutritionFacts nutrition={mockNutrition} />)

    const nutritionCard = container.querySelector('.nutrition-facts')
    expect(nutritionCard).toHaveClass('print-friendly')
  })

  it('should format decimal values correctly', () => {
    const nutritionWithDecimals = {
      ...mockNutrition,
      totalFat: { amount: 7.5, unit: "g", dailyValue: 10 }
    }

    render(<NutritionFacts nutrition={nutritionWithDecimals} servingMultiplier={1.5} />)

    // 7.5 * 1.5 = 11.25, should display as "11.3g" or "11.25g"
    expect(screen.getByText(/11\.\d+g/)).toBeInTheDocument()
  })

  it('should display FDA-required footnote', () => {
    render(<NutritionFacts nutrition={mockNutrition} />)

    expect(screen.getByText(/2,000 calories a day/i)).toBeInTheDocument()
  })

  it('should handle zero values appropriately', () => {
    render(<NutritionFacts nutrition={mockNutrition} />)

    // Trans fat is 0 - check in the trans fat row
    const transFatElement = screen.getByText(/trans fat/i)
    const transFatRow = transFatElement.closest('.nutrition-facts__nutrient')
    expect(transFatRow).toHaveTextContent('0g')
  })

  it('should maintain layout with major and indented nutrients', () => {
    const { container } = render(<NutritionFacts nutrition={mockNutrition} />)

    const majorNutrients = container.querySelectorAll('.nutrition-facts__nutrient--major')
    const indentedNutrients = container.querySelectorAll('.nutrition-facts__nutrient--indented')

    expect(majorNutrients.length).toBeGreaterThan(0)
    expect(indentedNutrients.length).toBeGreaterThan(0)
  })
})
