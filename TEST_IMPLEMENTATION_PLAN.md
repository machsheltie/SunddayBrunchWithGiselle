# Test Implementation Action Plan
## Sunday Brunch with Giselle Website

**Created:** 2026-01-08
**Owner:** Development Team
**Target:** 95% test coverage within 90 days
**Current Coverage:** 13.5%

---

## Quick Start Checklist

### Week 1 (Days 1-7) - Foundation & Critical Gaps

- [ ] **Day 1: Setup & Baseline**
  - [ ] Install `@vitest/coverage-v8`
  - [ ] Run initial coverage report
  - [ ] Document baseline metrics
  - [ ] Setup test tracking spreadsheet

- [ ] **Day 2-3: RecipeTemplate Tests (P0)**
  - [ ] Create `RecipeTemplate.test.jsx`
  - [ ] Test recipe rendering
  - [ ] Test ingredient display
  - [ ] Test instruction steps
  - [ ] Test nutrition facts integration
  - [ ] Target: 30-40 tests

- [ ] **Day 4: RecipeCalculator Tests (P0)**
  - [ ] Create `RecipeCalculator.test.jsx`
  - [ ] Test scaling calculations (0.5x, 1x, 2x, 3x)
  - [ ] Test edge cases (0x, negative, decimals)
  - [ ] Test ingredient quantity updates
  - [ ] Test nutrition fact scaling
  - [ ] Target: 20-25 tests

- [ ] **Day 5: ErrorBoundary Tests (P0)**
  - [ ] Create `ErrorBoundary.test.jsx`
  - [ ] Test error catching
  - [ ] Test error display
  - [ ] Test error recovery
  - [ ] Test fallback UI
  - [ ] Target: 10-15 tests

- [ ] **Day 6-7: Search Flow Integration Tests**
  - [ ] Create `integration/SearchFlow.integration.test.jsx`
  - [ ] Test SearchBar + Filters + Results
  - [ ] Test filter combinations
  - [ ] Test search + filter + sort
  - [ ] Target: 15-20 tests

**Week 1 Target:** 75-100 new tests, ~25-30% coverage

---

## Week 2 (Days 8-14) - Navigation & APIs

- [ ] **Day 8: Router/Navigation Tests**
  - [ ] Create `App.test.jsx`
  - [ ] Test all route rendering
  - [ ] Test navigation between routes
  - [ ] Test 404 handling
  - [ ] Test scroll-to-top behavior
  - [ ] Target: 15-20 tests

- [ ] **Day 9-10: API Service Tests**
  - [ ] Install MSW (Mock Service Worker)
  - [ ] Create `services/convertkit.test.js`
  - [ ] Create `services/sponsor.test.js`
  - [ ] Test successful API calls
  - [ ] Test error handling
  - [ ] Test network failures
  - [ ] Test timeout scenarios
  - [ ] Target: 25-30 tests

- [ ] **Day 11: Form Tests**
  - [ ] Create `CTAForm.test.jsx`
  - [ ] Test form rendering
  - [ ] Test validation (email, required fields)
  - [ ] Test submission success
  - [ ] Test submission errors
  - [ ] Test loading states
  - [ ] Target: 20-25 tests

- [ ] **Day 12-14: Top 3 Page Tests**
  - [ ] Create `pages/Home.test.jsx`
  - [ ] Create `pages/RecipePage.test.jsx`
  - [ ] Create `pages/RecipeIndexPage.test.jsx`
  - [ ] Test page rendering
  - [ ] Test data loading
  - [ ] Test navigation from page
  - [ ] Target: 30-40 tests

**Week 2 Target:** 90-115 new tests, ~40-45% coverage

---

## Week 3-4 (Days 15-28) - E2E & Remaining Components

- [ ] **Day 15-16: E2E Setup**
  - [ ] Install Playwright
  - [ ] Configure Playwright
  - [ ] Create `playwright.config.js`
  - [ ] Setup CI/CD integration (GitHub Actions)
  - [ ] Create first smoke test

- [ ] **Day 17-19: E2E Critical Path Tests**
  - [ ] Create `tests/e2e/search-flow.spec.js`
  - [ ] Create `tests/e2e/recipe-view.spec.js`
  - [ ] Create `tests/e2e/newsletter-signup.spec.js`
  - [ ] Test homepage → search → recipe → back
  - [ ] Test filter interactions
  - [ ] Test mobile responsive behavior
  - [ ] Target: 10-15 E2E tests

- [ ] **Day 20-22: Medium Priority Component Tests**
  - [ ] Create `Layout.test.jsx`
  - [ ] Create `FeaturedRecipeCard.test.jsx`
  - [ ] Create `GiselleGuestbook.test.jsx`
  - [ ] Create `IngredientAlchemist.test.jsx`
  - [ ] Target: 40-50 tests

- [ ] **Day 23-25: Remaining Component Tests**
  - [ ] Create `ShareBar.test.jsx`
  - [ ] Create `AudioPlayer.test.jsx`
  - [ ] Create `LoadingSkeleton.test.jsx`
  - [ ] Create `JumpToRecipe.test.jsx`
  - [ ] Target: 30-40 tests

- [ ] **Day 26-28: Utility & Service Tests**
  - [ ] Create `lib/analytics.test.js`
  - [ ] Create `lib/seo.test.js`
  - [ ] Create `lib/culinaryUtils.test.js`
  - [ ] Create `lib/AuteurMotion.test.js`
  - [ ] Target: 25-30 tests

**Week 3-4 Target:** 105-135 new tests, ~65-70% coverage

---

## Month 2 (Days 29-60) - Visual, Performance & Polish

### Week 5-6 (Days 29-42)

- [ ] **Visual Regression Testing**
  - [ ] Configure Playwright screenshot tests
  - [ ] Create visual tests for key pages
  - [ ] Create visual tests for components
  - [ ] Integrate with CI/CD
  - [ ] Target: 20-30 visual tests

- [ ] **Performance Testing**
  - [ ] Create performance benchmarks
  - [ ] Test component render time
  - [ ] Test bundle size
  - [ ] Test lazy loading
  - [ ] Target: 15-20 performance tests

- [ ] **Remaining Page Tests**
  - [ ] Create `EpisodePage.test.jsx`
  - [ ] Create `NewsletterPage.test.jsx`
  - [ ] Create `AlchemistsLab.test.jsx`
  - [ ] Create `MediaKitPage.test.jsx`
  - [ ] Create `TeamPage.test.jsx`
  - [ ] Create `NotFound.test.jsx`
  - [ ] Target: 40-50 tests

### Week 7-8 (Days 43-60)

- [ ] **Test Factory Creation**
  - [ ] Create `tests/factories/recipeFactory.js`
  - [ ] Create `tests/factories/userFactory.js`
  - [ ] Create `tests/factories/nutritionFactory.js`
  - [ ] Refactor tests to use factories
  - [ ] Target: Reduce test code duplication by 50%

- [ ] **Decorative Component Tests**
  - [ ] Create tests for Sheltie components
  - [ ] Create tests for decorative components
  - [ ] Create tests for animation components
  - [ ] Target: 30-40 tests

- [ ] **Integration Test Expansion**
  - [ ] Create `RecipeFlow.integration.test.jsx`
  - [ ] Create `NavigationFlow.integration.test.jsx`
  - [ ] Create `FormSubmission.integration.test.jsx`
  - [ ] Target: 20-25 tests

**Month 2 Target:** 125-165 new tests, ~85-90% coverage

---

## Month 3 (Days 61-90) - Advanced & Production Ready

### Week 9-10 (Days 61-74)

- [ ] **Accessibility Testing**
  - [ ] Install axe-core
  - [ ] Create accessibility tests for all pages
  - [ ] Test keyboard navigation
  - [ ] Test screen reader compatibility
  - [ ] Target: 30-40 accessibility tests

- [ ] **Contract Testing**
  - [ ] Install Pact or similar
  - [ ] Create API contract tests
  - [ ] Test API schema validation
  - [ ] Target: 15-20 contract tests

### Week 11-12 (Days 75-90)

- [ ] **Security Testing**
  - [ ] Test XSS prevention
  - [ ] Test input sanitization
  - [ ] Test CSRF protection
  - [ ] Target: 15-20 security tests

- [ ] **Final Coverage Push**
  - [ ] Identify remaining uncovered code
  - [ ] Add missing tests
  - [ ] Reach 95%+ coverage
  - [ ] Target: 95% coverage achieved

- [ ] **Test Documentation**
  - [ ] Document testing patterns
  - [ ] Create test style guide
  - [ ] Update README with testing info
  - [ ] Create video tutorials (optional)

**Month 3 Target:** 60-80 new tests, 95%+ coverage, production-ready

---

## Detailed Test Templates

### Component Test Template

```javascript
// src/tests/components/[ComponentName].test.jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'  // If needed
import ComponentName from '../../components/ComponentName'

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('ComponentName', () => {
  // Basic Rendering
  it('should render component', () => {
    render(<ComponentName />)
    expect(screen.getByTestId('component-name')).toBeInTheDocument()
  })

  // Props
  it('should display title prop', () => {
    render(<ComponentName title="Test Title" />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  // User Interactions
  it('should call onClick when button clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<ComponentName onClick={handleClick} />)

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  // State Changes
  it('should toggle visibility on click', async () => {
    const user = userEvent.setup()
    render(<ComponentName />)

    const button = screen.getByRole('button', { name: /toggle/i })
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByTestId('content')).toBeVisible()
    })
  })

  // Edge Cases
  it('should handle empty props gracefully', () => {
    render(<ComponentName items={[]} />)
    expect(screen.getByText(/no items/i)).toBeInTheDocument()
  })

  // Accessibility
  it('should have proper ARIA labels', () => {
    render(<ComponentName />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-label')
  })
})
```

### Integration Test Template

```javascript
// src/tests/integration/[FeatureName].integration.test.jsx
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import ComponentA from '../../components/ComponentA'
import ComponentB from '../../components/ComponentB'
import ComponentC from '../../components/ComponentC'

describe('FeatureName Integration', () => {
  it('should integrate ComponentA, B, and C', async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <ComponentA />
        <ComponentB />
        <ComponentC />
      </BrowserRouter>
    )

    // Interact with ComponentA
    await user.type(screen.getByRole('textbox'), 'test input')

    // Verify ComponentB updates
    await waitFor(() => {
      expect(screen.getByTestId('component-b-result')).toHaveTextContent('test input')
    })

    // Interact with ComponentC
    await user.click(screen.getByRole('button', { name: /submit/i }))

    // Verify final state
    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument()
    })
  })
})
```

### E2E Test Template

```javascript
// tests/e2e/[feature-name].spec.js
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should complete user journey', async ({ page }) => {
    // Navigate to page
    await page.goto('/')

    // Interact with elements
    await page.fill('[aria-label="Search recipes"]', 'chocolate')
    await page.click('text=Search')

    // Wait for results
    await page.waitForSelector('.recipe-card')

    // Verify results
    const recipeCards = await page.locator('.recipe-card').count()
    expect(recipeCards).toBeGreaterThan(0)

    // Click first result
    await page.click('.recipe-card:first-child')

    // Verify navigation
    await expect(page).toHaveURL(/\/recipes\//)

    // Verify recipe content
    await expect(page.locator('h1')).toBeVisible()

    // Take screenshot
    await page.screenshot({ path: 'screenshots/recipe-page.png' })
  })

  test('should work on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    // ... mobile-specific tests
  })
})
```

### API Service Test Template

```javascript
// src/tests/services/[serviceName].test.js
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import serviceName from '../../services/serviceName'

const server = setupServer(
  rest.post('/api/endpoint', (req, res, ctx) => {
    return res(ctx.json({ success: true, data: {} }))
  })
)

describe('ServiceName', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('should call API successfully', async () => {
    const result = await serviceName.fetchData()
    expect(result.success).toBe(true)
  })

  it('should handle API errors', async () => {
    server.use(
      rest.post('/api/endpoint', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }))
      })
    )

    await expect(serviceName.fetchData()).rejects.toThrow()
  })

  it('should handle network failures', async () => {
    server.use(
      rest.post('/api/endpoint', (req, res, ctx) => {
        return res.networkError('Failed to connect')
      })
    )

    await expect(serviceName.fetchData()).rejects.toThrow()
  })
})
```

---

## Test Metrics Dashboard

### Weekly Tracking

| Week | Tests Added | Total Tests | Coverage % | Status |
|------|-------------|-------------|------------|--------|
| Baseline | 0 | 134 | 13.5% | ✅ Complete |
| Week 1 | 75-100 | 209-234 | 25-30% | ⏳ In Progress |
| Week 2 | 90-115 | 299-349 | 40-45% | ⏰ Planned |
| Week 3-4 | 105-135 | 404-484 | 65-70% | ⏰ Planned |
| Month 2 | 125-165 | 529-649 | 85-90% | ⏰ Planned |
| Month 3 | 60-80 | 589-729 | 95%+ | ⏰ Planned |

### Coverage by Category

| Category | Current | Week 1 | Week 2 | Month 2 | Month 3 | Target |
|----------|---------|--------|--------|---------|---------|--------|
| Components | 16.7% | 40% | 50% | 90% | 95% | 95% |
| Pages | 0% | 0% | 30% | 80% | 90% | 90% |
| Hooks | 100% | 100% | 100% | 100% | 100% | 100% |
| Services | 0% | 0% | 60% | 85% | 90% | 90% |
| Utils | 0% | 0% | 0% | 70% | 95% | 95% |
| Integration | 0% | 20% | 40% | 70% | 80% | 80% |
| E2E | 0 tests | 0 | 10 | 15 | 20 | 20 |

---

## Installation Commands

### Week 1 Setup

```bash
# Coverage tooling
npm install -D @vitest/coverage-v8

# Run coverage
npm run test:coverage
```

### Week 2 Setup

```bash
# API mocking
npm install -D msw

# Initialize MSW
npx msw init public/
```

### Week 3 Setup

```bash
# E2E testing
npm install -D @playwright/test

# Install browsers
npx playwright install

# Initialize Playwright
npx playwright init
```

### Month 2 Setup

```bash
# Accessibility testing
npm install -D @axe-core/playwright

# Performance testing
npm install -D lighthouse
```

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm test -- --run

      - name: Run coverage
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  e2e:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npx playwright test

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Success Criteria

### Week 1 Success
- [ ] Coverage increased from 13.5% to 25-30%
- [ ] All P0 items complete
- [ ] 75+ new tests passing
- [ ] CI/CD running tests automatically

### Week 2 Success
- [ ] Coverage increased to 40-45%
- [ ] API tests implemented with MSW
- [ ] Navigation tests complete
- [ ] Top 3 pages tested

### Month 1 Success
- [ ] Coverage increased to 65-70%
- [ ] E2E tests running in CI/CD
- [ ] 400+ tests total
- [ ] All critical paths tested

### Month 2 Success
- [ ] Coverage increased to 85-90%
- [ ] Visual regression tests implemented
- [ ] 600+ tests total
- [ ] Test factories in use

### Month 3 Success (Production Ready)
- [ ] Coverage at 95%+
- [ ] 700+ tests total
- [ ] All security tests passing
- [ ] Accessibility tests passing
- [ ] Performance benchmarks established
- [ ] Documentation complete

---

## Common Testing Patterns

### Testing Async Operations

```javascript
it('should load data asynchronously', async () => {
  render(<AsyncComponent />)

  expect(screen.getByText(/loading/i)).toBeInTheDocument()

  await waitFor(() => {
    expect(screen.getByText(/data loaded/i)).toBeInTheDocument()
  })
})
```

### Testing User Events

```javascript
it('should handle user input', async () => {
  const user = userEvent.setup()
  render(<FormComponent />)

  await user.type(screen.getByRole('textbox'), 'test input')
  await user.click(screen.getByRole('button', { name: /submit/i }))

  await waitFor(() => {
    expect(screen.getByText(/success/i)).toBeInTheDocument()
  })
})
```

### Testing React Router

```javascript
const renderWithRouter = (component, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route)

  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

it('should navigate to recipe page', async () => {
  const user = userEvent.setup()
  renderWithRouter(<RecipeList />)

  await user.click(screen.getByRole('link', { name: /view recipe/i }))

  expect(window.location.pathname).toBe('/recipes/chocolate-chip-cookies')
})
```

---

## Resources & References

### Documentation
- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Docs](https://playwright.dev/)
- [MSW Docs](https://mswjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### Internal Docs
- [TEST_EVALUATION_REPORT.md](./TEST_EVALUATION_REPORT.md)
- Project README
- Architecture documentation

---

**Last Updated:** 2026-01-08
**Owner:** Development Team
**Review Schedule:** Weekly during Months 1-3, then monthly
