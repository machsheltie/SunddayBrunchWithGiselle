/**
 * Recipe Nutrition Data Template
 *
 * Use this template to add nutrition information to your recipes.
 * Copy this structure and fill in the values for each recipe.
 *
 * HOW TO CALCULATE NUTRITION:
 * 1. Use a nutrition calculator like:
 *    - MyFitnessPal Recipe Calculator
 *    - USDA FoodData Central
 *    - Cronometer
 *    - Nutritionix
 *
 * 2. Enter all recipe ingredients with exact amounts
 * 3. Set the serving size (e.g., "1 cookie (50g)", "1 slice (100g)")
 * 4. Get nutrition per serving
 * 5. Calculate % Daily Values based on 2,000 calorie diet
 *
 * DAILY VALUE CALCULATIONS:
 * - Total Fat: (amount in grams / 78g) × 100
 * - Saturated Fat: (amount in grams / 20g) × 100
 * - Cholesterol: (amount in mg / 300mg) × 100
 * - Sodium: (amount in mg / 2,300mg) × 100
 * - Total Carbohydrates: (amount in grams / 275g) × 100
 * - Dietary Fiber: (amount in grams / 28g) × 100
 * - Added Sugars: (amount in grams / 50g) × 100
 * - Vitamin D: (amount in mcg / 20mcg) × 100
 * - Calcium: (amount in mg / 1,300mg) × 100
 * - Iron: (amount in mg / 18mg) × 100
 * - Potassium: (amount in mg / 4,700mg) × 100
 */

export const recipeNutritionTemplate = {
  // Recipe Metadata
  title: "Your Recipe Name",

  // Nutrition Facts (REQUIRED)
  nutrition: {
    servingSize: "1 cookie (approx. 50g)", // Be specific about size/weight
    servingsPerRecipe: 24, // How many servings this recipe makes
    calories: 180, // Calories per serving

    // Macronutrients (all REQUIRED)
    totalFat: {
      amount: 8,          // grams
      unit: "g",
      dailyValue: 10      // percentage
    },
    saturatedFat: {
      amount: 5,
      unit: "g",
      dailyValue: 25
    },
    transFat: {
      amount: 0,          // Often 0 in home baking
      unit: "g"
      // No daily value for trans fat
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
      amount: 15,         // Includes natural and added sugars
      unit: "g"
      // No daily value for total sugars
    },
    addedSugars: {
      amount: 14,         // Only sugars you added (not from fruit, etc.)
      unit: "g",
      dailyValue: 28
    },
    protein: {
      amount: 2,
      unit: "g"
      // No daily value for protein
    },

    // Micronutrients (OPTIONAL - only include if significant amounts)
    vitaminD: {
      amount: 0,          // Often 0 unless fortified
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
  },

  // Dietary Restrictions (OPTIONAL)
  // Available options:
  // - "Vegan"
  // - "Vegetarian"
  // - "Gluten-Free"
  // - "Dairy-Free"
  // - "Nut-Free"
  // - "Egg-Free"
  // - "Refined Sugar-Free"
  // - "Keto-Friendly"
  // - "Low-Carb"
  // - "Paleo"
  // - "Low-Sodium"
  // - "Heart-Healthy"
  dietary: [
    "Vegetarian",
    "Nut-Free"
  ],

  // Allergen Warnings (OPTIONAL)
  // FDA's "Big 8" allergens + Sesame (as of 2023)
  // - "Milk"
  // - "Eggs"
  // - "Fish"
  // - "Shellfish"
  // - "Tree Nuts"
  // - "Peanuts"
  // - "Wheat"
  // - "Soybeans" (will be displayed as "Soy")
  // - "Sesame"
  allergens: [
    "Milk",
    "Eggs",
    "Wheat"
  ]
}

/**
 * EXAMPLE: Chocolate Chip Cookies
 *
 * Here's a complete example for reference:
 */
export const exampleChocolateChipCookies = {
  title: "Classic Chocolate Chip Cookies",

  nutrition: {
    servingSize: "1 cookie (approx. 50g)",
    servingsPerRecipe: 24,
    calories: 180,
    totalFat: { amount: 8, unit: "g", dailyValue: 10 },
    saturatedFat: { amount: 5, unit: "g", dailyValue: 25 },
    transFat: { amount: 0, unit: "g" },
    cholesterol: { amount: 20, unit: "mg", dailyValue: 7 },
    sodium: { amount: 140, unit: "mg", dailyValue: 6 },
    totalCarbohydrates: { amount: 25, unit: "g", dailyValue: 9 },
    dietaryFiber: { amount: 1, unit: "g", dailyValue: 4 },
    totalSugars: { amount: 15, unit: "g" },
    addedSugars: { amount: 14, unit: "g", dailyValue: 28 },
    protein: { amount: 2, unit: "g" },
    vitaminD: { amount: 0, unit: "mcg", dailyValue: 0 },
    calcium: { amount: 20, unit: "mg", dailyValue: 2 },
    iron: { amount: 1, unit: "mg", dailyValue: 6 },
    potassium: { amount: 50, unit: "mg", dailyValue: 1 }
  },

  dietary: ["Vegetarian"],

  allergens: ["Milk", "Eggs", "Wheat"]
}

/**
 * MINIMAL EXAMPLE: Simple Recipe
 *
 * You can omit optional micronutrients if they're insignificant:
 */
export const exampleMinimal = {
  title: "Simple Muffins",

  nutrition: {
    servingSize: "1 muffin (75g)",
    servingsPerRecipe: 12,
    calories: 200,
    totalFat: { amount: 9, unit: "g", dailyValue: 12 },
    saturatedFat: { amount: 5, unit: "g", dailyValue: 25 },
    transFat: { amount: 0, unit: "g" },
    cholesterol: { amount: 35, unit: "mg", dailyValue: 12 },
    sodium: { amount: 180, unit: "mg", dailyValue: 8 },
    totalCarbohydrates: { amount: 27, unit: "g", dailyValue: 10 },
    dietaryFiber: { amount: 1, unit: "g", dailyValue: 4 },
    totalSugars: { amount: 12, unit: "g" },
    addedSugars: { amount: 10, unit: "g", dailyValue: 20 },
    protein: { amount: 3, unit: "g" }
    // Micronutrients omitted because amounts are negligible
  },

  dietary: ["Vegetarian"],
  allergens: ["Milk", "Eggs", "Wheat"]
}

/**
 * HOW TO ADD TO YOUR RECIPE:
 *
 * 1. In your recipe data file (e.g., recipes/chocolate-chip-cookies.js):
 *
 *    import { recipeNutritionTemplate } from './recipe-nutrition-template'
 *
 *    export const chocolateChipCookies = {
 *      slug: "chocolate-chip-cookies",
 *      title: "Classic Chocolate Chip Cookies",
 *      // ... other recipe fields ...
 *
 *      // Add nutrition data
 *      nutrition: recipeNutritionTemplate.nutrition, // Fill in your values
 *      dietary: ["Vegetarian", "Nut-Free"],
 *      allergens: ["Milk", "Eggs", "Wheat"]
 *    }
 *
 * 2. The RecipeTemplate will automatically display:
 *    - Dietary badges at the top
 *    - Allergen warnings (prominent red box)
 *    - Nutrition Facts panel (synced with recipe calculator)
 *
 * 3. The nutrition facts will scale automatically when users adjust servings!
 */

/**
 * TIPS FOR ACCURACY:
 *
 * 1. Weigh ingredients for precision
 * 2. Include ALL ingredients (even small amounts)
 * 3. Account for cooking methods (oil absorption, water loss, etc.)
 * 4. Round to reasonable precision (whole numbers for most values)
 * 5. Be honest about added sugars vs. natural sugars
 * 6. If using packaged ingredients, check their nutrition labels
 * 7. Verify your math on % Daily Values
 * 8. Consider recipe yield variations (cookies spread differently, etc.)
 */
