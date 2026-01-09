# Testing Quick Start Guide
## Sunday Brunch with Giselle

**Purpose:** Get your test coverage from 13.5% to 95% in 90 days
**Start Date:** 2026-01-08

---

## Current State Snapshot

```
📊 Test Coverage: 13.5% (7/52 files tested)
✅ Tests Passing: 134/134 (100%)
⏱️ Test Execution: ~2 seconds
🎯 Target: 95% coverage in 90 days
```

### What's Tested
- ✅ Search functionality (SearchBar, SearchResults, RecipeFilters)
- ✅ Nutrition components (NutritionFacts, DietaryBadges, AllergenWarnings)
- ✅ Recipe search hook (useRecipeSearch)

### Critical Gaps
- ❌ 0/42 core components tested (RecipeTemplate, RecipeCalculator, etc.)
- ❌ 0/10 pages tested
- ❌ 0 integration tests
- ❌ 0 E2E tests
- ❌ 0 API tests

---

## Day 1: Get Started (30 minutes)

### Step 1: Install Coverage Tool (5 min)

```bash
cd sunday-brunch-website
npm install -D @vitest/coverage-v8
```

### Step 2: Run Coverage Report (5 min)

```bash
npm run test:coverage
```

You'll see output like:
```
File                              | % Stmts | % Branch | % Funcs | % Lines
----------------------------------|---------|----------|---------|--------
All files                         |   13.5  |    8.2   |   12.1  |   13.8
 components/                      |   16.7  |    10.5  |   15.2  |   17.1
  SearchBar.jsx                   |  100.0  |   100.0  |  100.0  |  100.0
  SearchResults.jsx               |  100.0  |   100.0  |  100.0  |  100.0
  RecipeTemplate.jsx              |    0.0  |     0.0  |    0.0  |    0.0  <-- Priority!
  ...
```

### Step 3: Review the Reports (10 min)

1. Read `TEST_EVALUATION_REPORT.md` (comprehensive analysis)
2. Review `TEST_IMPLEMENTATION_PLAN.md` (90-day roadmap)
3. Bookmark this Quick Start guide

### Step 4: Setup Test Tracking (10 min)

Create a simple spreadsheet or GitHub Project:

| Priority | Component | Tests Added | Status | Owner |
|----------|-----------|-------------|--------|-------|
| P0 | RecipeTemplate | 0/35 | ⏳ Todo | - |
| P0 | RecipeCalculator | 0/25 | ⏳ Todo | - |
| P0 | ErrorBoundary | 0/15 | ⏳ Todo | - |

---

## This Week: Critical Tests (P0)

### Day 2-3: RecipeTemplate Tests

**Why:** Core recipe display component (highest business impact)
**Time:** 4-6 hours
**Target:** 30-40 tests

#### Create the test file:

```bash
# Create test file
touch src/tests/components/RecipeTemplate.test.jsx
```

#### Template structure:

```javascript
// src/tests/components/RecipeTemplate.test.jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import RecipeTemplate from '../../components/RecipeTemplate'

const mockRecipe = {
  title: 'Chocolate Chip Cookies',
  image: '/images/cookies.jpg',
  cookTime: 25,
  prepTime: 15,
  servings: 24,
  difficulty: 'Easy',
  category: 'Cookies',
  dietary: ['Vegetarian'],
  ingredients: [
    { name: 'flour', amount: 2, unit: 'cups' },
    { name: 'chocolate chips', amount: 2, unit: 'cups' }
  ],
  instructions: [
    { step: 1, text: 'Preheat oven to 375°F' },
    { step: 2, text: 'Mix dry ingredients' }
  ],
  nutrition: {
    calories: 180,
    totalFat: { amount: 8, unit: 'g' }
    // ... more nutrition data
  }
}

describe('RecipeTemplate', () => {
  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>)
  }

  // Basic Rendering
  it('should render recipe title', () => {
    renderWithRouter(<RecipeTemplate recipe={mockRecipe} />)
    expect(screen.getByText('Chocolate Chip Cookies')).toBeInTheDocument()
  })

  it('should render recipe image', () => {
    renderWithRouter(<RecipeTemplate recipe={mockRecipe} />)
    const image = screen.getByAltText('Chocolate Chip Cookies')
    expect(image).toHaveAttribute('src', '/images/cookies.jpg')
  })

  // Time & Servings
  it('should display cook time', () => {
    renderWithRouter(<RecipeTemplate recipe={mockRecipe} />)
    expect(screen.getByText(/25 min/i)).toBeInTheDocument()
  })

  it('should display prep time', () => {
    renderWithRouter(<RecipeTemplate recipe={mockRecipe} />)
    expect(screen.getByText(/15 min/i)).toBeInTheDocument()
  })

  it('should display servings', () => {
    renderWithRouter(<RecipeTemplate recipe={mockRecipe} />)
    expect(screen.getByText(/24 servings/i)).toBeInTheDocument()
  })

  // Ingredients
  it('should render all ingredients', () => {
    renderWithRouter(<RecipeTemplate recipe={mockRecipe} />)
    expect(screen.getByText(/2 cups flour/i)).toBeInTheDocument()
    expect(screen.getByText(/2 cups chocolate chips/i)).toBeInTheDocument()
  })

  // Instructions
  it('should render all instruction steps', () => {
    renderWithRouter(<RecipeTemplate recipe={mockRecipe} />)
    expect(screen.getByText(/Preheat oven to 375°F/i)).toBeInTheDocument()
    expect(screen.getByText(/Mix dry ingredients/i)).toBeInTheDocument()
  })

  it('should display instruction step numbers', () => {
    renderWithRouter(<RecipeTemplate recipe={mockRecipe} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  // Dietary & Category
  it('should display dietary badges', () => {
    renderWithRouter(<RecipeTemplate recipe={mockRecipe} />)
    expect(screen.getByText('Vegetarian')).toBeInTheDocument()
  })

  it('should display category', () => {
    renderWithRouter(<RecipeTemplate recipe={mockRecipe} />)
    expect(screen.getByText('Cookies')).toBeInTheDocument()
  })

  // Nutrition Integration
  it('should render nutrition facts', () => {
    renderWithRouter(<RecipeTemplate recipe={mockRecipe} />)
    expect(screen.getByText(/Nutrition Facts/i)).toBeInTheDocument()
    expect(screen.getByText(/180/)).toBeInTheDocument() // Calories
  })

  // Edge Cases
  it('should handle missing image gracefully', () => {
    const recipeNoImage = { ...mockRecipe, image: null }
    renderWithRouter(<RecipeTemplate recipe={recipeNoImage} />)
    expect(screen.getByTestId('recipe-placeholder')).toBeInTheDocument()
  })

  it('should handle empty ingredients array', () => {
    const recipeNoIngredients = { ...mockRecipe, ingredients: [] }
    renderWithRouter(<RecipeTemplate recipe={recipeNoIngredients} />)
    expect(screen.getByText(/No ingredients listed/i)).toBeInTheDocument()
  })

  // ... Add 20+ more tests for:
  // - Print button
  // - Share buttons
  // - Jump to recipe button
  // - Allergen warnings
  // - Related recipes
  // - Recipe notes
  // - Storage tips
  // - Equipment needed
  // - Substitutions
  // - Accessibility (ARIA labels)
  // - Mobile responsive
  // - Print styles
})
```

**Run tests:**
```bash
npm test -- RecipeTemplate
```

---

### Day 4: RecipeCalculator Tests

**Why:** Math errors = recipe failures (high user impact)
**Time:** 2-3 hours
**Target:** 20-25 tests

#### Create the test file:

```bash
touch src/tests/components/RecipeCalculator.test.jsx
```

#### Key test scenarios:

```javascript
describe('RecipeCalculator', () => {
  // Scaling
  it('should scale ingredients by 2x', () => {
    // Test that 2 cups flour becomes 4 cups
  })

  it('should scale ingredients by 0.5x', () => {
    // Test that 2 cups flour becomes 1 cup
  })

  it('should scale nutrition facts', () => {
    // Test that 180 calories becomes 360 at 2x
  })

  // Edge Cases
  it('should handle decimal scaling (1.5x)', () => {
    // Test that 2 cups flour becomes 3 cups
  })

  it('should round to reasonable precision', () => {
    // Test that 1/3 cup doesn't become 0.33333333 cups
  })

  it('should prevent negative scaling', () => {
    // Test that negative multipliers are rejected
  })

  it('should prevent zero scaling', () => {
    // Test that 0x multiplier is rejected
  })

  // ... Add 15+ more tests
})
```

---

### Day 5: ErrorBoundary Tests

**Why:** Critical for error handling (silent failures are dangerous)
**Time:** 1-2 hours
**Target:** 10-15 tests

#### Create the test file:

```bash
touch src/tests/components/ErrorBoundary.test.jsx
```

#### Key test scenarios:

```javascript
describe('ErrorBoundary', () => {
  // Error Catching
  it('should catch component errors', () => {
    const ThrowError = () => {
      throw new Error('Test error')
    }

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
  })

  it('should display error message', () => {
    // Test that error message is shown to user
  })

  it('should show fallback UI', () => {
    // Test that fallback UI is displayed
  })

  it('should allow error recovery', () => {
    // Test that "Try Again" button works
  })

  // ... Add 7+ more tests
})
```

---

### Day 6-7: Integration Tests

**Why:** Components may work alone but fail together
**Time:** 3-4 hours
**Target:** 15-20 tests

#### Create the test file:

```bash
mkdir -p src/tests/integration
touch src/tests/integration/SearchFlow.integration.test.jsx
```

#### Key test scenarios:

```javascript
describe('Search Flow Integration', () => {
  it('should filter recipes when user types and applies filters', async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <RecipeIndexPageEnhanced />
      </BrowserRouter>
    )

    // Type search query
    await user.type(screen.getByPlaceholderText(/search recipes/i), 'chocolate')

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText(/Chocolate Chip Cookies/i)).toBeInTheDocument()
    })

    // Apply dietary filter
    await user.click(screen.getByRole('checkbox', { name: /vegan/i }))

    // Verify results update
    await waitFor(() => {
      expect(screen.getByText(/Vegan Brownies/i)).toBeInTheDocument()
      expect(screen.queryByText(/Chocolate Chip Cookies/i)).not.toBeInTheDocument()
    })
  })

  // ... Add 15+ more integration tests
})
```

---

## Week 1 Goals

By end of Week 1, you should have:

- ✅ 75-100 new tests written
- ✅ Coverage increased from 13.5% to 25-30%
- ✅ All P0 items complete
- ✅ Integration tests for search flow
- ✅ CI/CD running tests automatically

---

## Quick Commands Reference

```bash
# Run all tests
npm test

# Run specific test file
npm test -- RecipeTemplate

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui

# Run only changed tests
npm test -- --changed
```

---

## Common Issues & Solutions

### Issue: Tests failing with "Cannot find module"

**Solution:**
```javascript
// Add to vitest.config.js
export default defineConfig({
  test: {
    // ... existing config
    alias: {
      '@': '/src'
    }
  }
})
```

### Issue: "act" warnings in console

**Solution:** Use `waitFor` for state updates:
```javascript
await waitFor(() => {
  expect(screen.getByText('Updated')).toBeInTheDocument()
})
```

### Issue: Router tests failing

**Solution:** Wrap component in BrowserRouter:
```javascript
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}
```

### Issue: Async tests timing out

**Solution:** Increase timeout:
```javascript
it('should load data', async () => {
  // Test code
}, 10000) // 10 second timeout
```

---

## Getting Help

1. **Read the docs:**
   - [Vitest Docs](https://vitest.dev/)
   - [React Testing Library](https://testing-library.com/react)
   - [TEST_EVALUATION_REPORT.md](./TEST_EVALUATION_REPORT.md)

2. **Check examples:**
   - `src/tests/components/SearchBar.test.jsx` (excellent reference)
   - `src/tests/hooks/useRecipeSearch.test.js` (hook testing)

3. **Ask questions:**
   - Team chat
   - Code review PRs
   - Weekly test sync meetings

---

## Success Indicators

### Week 1 Success
- [ ] Coverage at 25-30%
- [ ] RecipeTemplate fully tested
- [ ] RecipeCalculator fully tested
- [ ] ErrorBoundary fully tested
- [ ] 1-2 integration tests passing
- [ ] CI/CD running tests

### You'll Know You're On Track When...
- ✅ Running `npm test` takes 5-10 seconds (up from 2s)
- ✅ Coverage report shows 25-30%
- ✅ All new tests passing
- ✅ Confidence in making changes increases

---

## Next Steps After Week 1

1. **Week 2:** Router/Navigation + API tests
2. **Week 3-4:** E2E tests + remaining components
3. **Month 2:** Visual regression + performance tests
4. **Month 3:** Security + accessibility + final push to 95%

See [TEST_IMPLEMENTATION_PLAN.md](./TEST_IMPLEMENTATION_PLAN.md) for detailed roadmap.

---

## Celebration Milestones

- 🎉 **First new test passing** - You've started!
- 🎊 **25% coverage** - Solid foundation
- 🎈 **50% coverage** - Halfway there!
- 🏆 **75% coverage** - Excellent progress
- 🌟 **95% coverage** - Production ready!

---

**Remember:** Test-driven development is an investment. Every test you write today saves debugging hours tomorrow.

**Start Date:** 2026-01-08
**Target Date:** 2026-04-08 (90 days)
**Current Coverage:** 13.5%
**Target Coverage:** 95%

**You've got this!** 💪
