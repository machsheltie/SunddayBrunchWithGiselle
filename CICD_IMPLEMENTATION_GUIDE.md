# CI/CD Implementation Guide
## Sunday Brunch with Giselle

**Purpose:** Step-by-step instructions to implement critical CI/CD improvements
**Status:** Ready for implementation
**Effort:** 2-3 weeks for all phases

---

## Phase 1: Critical Fixes (P0) - Week 1

### Task 1.1: Fix Failing Tests

#### Problem
```
Test Results:
  23 failed tests
  12 uncaught errors
  5 test files failing

Main Issue: React Router context null in Home.test.jsx
```

#### Solution Step 1: Fix Home.test.jsx

**File:** `sunday-brunch-website/src/tests/pages/Home.test.jsx`

**Root Cause:** Components using React Router hooks (useParams, Link) without BrowserRouter wrapper

**Fix:**
```javascript
// Before: Missing BrowserRouter wrapper
import { render, screen } from '@testing-library/react'
import Home from '../../pages/Home'

describe('Home Page', () => {
  it('should render', () => {
    render(<Home />)  // ❌ No BrowserRouter context
  })
})

// After: Properly wrapped with BrowserRouter
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Home from '../../pages/Home'

describe('Home Page', () => {
  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    )
  }

  it('should render', () => {
    renderWithRouter(<Home />)  // ✅ Wrapped in BrowserRouter
  })
})
```

**Steps:**
1. Open `src/tests/pages/Home.test.jsx`
2. Add `import { BrowserRouter } from 'react-router-dom'` at top
3. Create helper function `renderWithRouter()`
4. Replace all `render(` calls with `renderWithRouter(`
5. Run `npm test -- src/tests/pages/Home.test.jsx`
6. Verify all tests pass (should be ~20-25 tests)

#### Solution Step 2: Fix AuthContext.test.jsx

**File:** `src/contexts/AuthContext.test.jsx`

**Root Cause:** Test "should sign up successfully with display name" timing out (1172ms)

**Fix:**
```javascript
// Before: Missing proper async handling
it('should sign up successfully with display name', () => {
  const { result } = renderHook(() => useAuth())

  act(() => {
    result.current.signUp('user@test.com', 'password', 'John Doe')
  })

  expect(result.current.user).toBeDefined()  // ❌ No wait for async
})

// After: Proper async/await
it('should sign up successfully with display name', async () => {
  const { result } = renderHook(() => useAuth())

  await act(async () => {
    await result.current.signUp('user@test.com', 'password', 'John Doe')
  })

  expect(result.current.user).toBeDefined()  // ✅ After async completes
})
```

**Steps:**
1. Find the failing test "should sign up successfully with display name"
2. Add `async` keyword to test function
3. Add `await` before async operations (signUp, etc.)
4. Verify test completes within timeout
5. Run `npm test -- src/contexts/AuthContext.test.jsx`

#### Solution Step 3: Fix StarRating.test.jsx

**File:** `src/components/StarRating.test.jsx`

**Root Cause:** Tests 1 and 18 failing due to DOM element issues

**For Test "should render 5 stars":**
```javascript
// Before: Might be selecting wrong element
it('should render 5 stars', () => {
  render(<StarRating value={5} />)
  const stars = screen.getAllByRole('button')  // ❌ Might match other buttons
  expect(stars).toHaveLength(5)
})

// After: More specific selector
it('should render 5 stars', () => {
  render(<StarRating value={5} />)
  const stars = screen.getAllByRole('button', { name: /star/i })
  expect(stars).toHaveLength(5)
})
```

**For Test "should be keyboard accessible - arrow keys":**
```javascript
// Before: Using fireEvent (synthetic events)
it('should be keyboard accessible - arrow keys', () => {
  const { container } = render(<StarRating value={3} onChange={jest.fn()} />)
  const star = container.querySelector('button')

  fireEvent.keyDown(star, { key: 'ArrowRight' })  // ❌ Synthetic events
  expect(onChange).toHaveBeenCalledWith(4)
})

// After: Using userEvent (real events)
import userEvent from '@testing-library/user-event'

it('should be keyboard accessible - arrow keys', async () => {
  const onChange = jest.fn()
  const { container } = render(
    <StarRating value={3} onChange={onChange} />
  )
  const star = container.querySelector('button')

  await userEvent.keyboard('{ArrowRight}')  // ✅ Real keyboard event
  expect(onChange).toHaveBeenCalledWith(4)
})
```

**Steps:**
1. Open `src/components/StarRating.test.jsx`
2. Find failing tests
3. Update element selectors to be more specific
4. Replace fireEvent with userEvent for keyboard tests
5. Run test to verify fix
6. Commit changes

#### Verification

```bash
cd sunday-brunch-website

# Run all tests
npm test

# Expected output:
# Test Files: 32 passed (32)
# Tests: 722 passed (722)
# Status: ✅ All passing
```

---

### Task 1.2: Add Critical Security Headers

#### Problem
```
Missing Headers:
  ❌ Content-Security-Policy (CSP)
  ❌ Strict-Transport-Security (HSTS)
  ❌ Permissions-Policy
  ❌ X-Permitted-Cross-Domain-Policies
```

#### Solution: Update netlify.toml

**File:** `netlify.toml`

**Current State:**
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

**Updated State:**
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

    # NEW: Content-Security-Policy
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://api.convertkit.com https://api.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"

    # NEW: Strict-Transport-Security (HTTPS enforcement)
    Strict-Transport-Security = "max-age=63072000; includeSubDomains; preload"

    # NEW: Permissions Policy (feature control)
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"

    # NEW: Prevent cross-domain policy files
    X-Permitted-Cross-Domain-Policies = "none"
```

**Steps:**
1. Open `netlify.toml`
2. Replace the entire `[[headers]]` section with updated version above
3. Save file
4. Commit: `git commit -m "security: add CSP, HSTS, Permissions headers"`
5. Push to main (triggers deployment)
6. Verify headers on production

#### Verification

```bash
# Check security headers on production
curl -I https://calm-centaur-ad0abf.netlify.app

# Expected headers in response:
# Content-Security-Policy: default-src...
# Strict-Transport-Security: max-age=...
# Permissions-Policy: geolocation=()...
# X-Permitted-Cross-Domain-Policies: none

# Or use online tool:
# https://securityheaders.com
```

---

### Task 1.3: Add Test Gate to CI/CD Pipeline

#### Problem
```
Current: Lighthouse CI only
Missing: Unit test execution + blocking
Impact: Broken tests can merge to main
```

#### Solution: Create test.yml workflow

**File:** `.github/workflows/test.yml` (NEW)

```yaml
name: Unit & Integration Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./sunday-brunch-website

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: sunday-brunch-website/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm test -- --run --reporter=verbose
        env:
          CI: true

      - name: Generate coverage report
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella

      - name: Comment PR with test results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ All unit tests passing! Coverage report available at Codecov.'
            })

      - name: Fail if tests failed
        if: failure()
        run: exit 1
```

**Steps:**
1. Create file `.github/workflows/test.yml`
2. Copy YAML content above
3. Commit: `git commit -m "ci: add unit test execution gate"`
4. Push branch to GitHub
5. Create PR - tests will run automatically
6. Merge once all tests pass

**Expected Behavior:**
- On every PR: Run tests
- On every push to main: Run tests
- Fail build if any test fails
- Comment on PR with test summary
- Upload coverage to Codecov

---

### Task 1.4: Document Rollback Procedure

#### Problem
```
Current rollback: Manual + untested
Risk: Slow recovery during incident
```

#### Solution: Create ROLLBACK_PROCEDURE.md

**File:** `ROLLBACK_PROCEDURE.md` (NEW)

```markdown
# Production Rollback Procedure
## Sunday Brunch with Giselle

**Last Updated:** 2026-01-15
**Current Site:** https://calm-centaur-ad0abf.netlify.app

---

## When to Rollback

Rollback immediately if:
- Critical functionality broken
- High error rate (>1% errors)
- Performance degradation (>50%)
- Security vulnerability discovered
- Deployment incomplete

---

## Method 1: Automatic Rollback (Preferred)

### Via Deployment Automation

```bash
# 1. Identify problematic commit
git log --oneline | head -5

# 2. Revert commit
git revert <commit-hash>

# 3. Push revert
git push origin main

# 4. Monitor deployment
# Netlify will automatically deploy reverted version
# Check: https://app.netlify.com/sites/[site-name]/deploys
```

**Time to Recovery:** 2-3 minutes
**Risk:** Low (automatic process)

---

## Method 2: Netlify UI Rollback (Manual)

### Step-by-Step

1. Go to Netlify Dashboard
   - URL: https://app.netlify.com
   - Select site: "sunday-brunch-with-giselle"

2. Navigate to Deploys tab
   - Click on "Deploys" in left navigation

3. Find Last Working Deployment
   - Look for deployment before problem started
   - Check deploy time and commit hash
   - Verify in GitHub that commit is working

4. Publish Previous Deployment
   - Click "..." menu on last good deployment
   - Select "Publish deploy"
   - Confirm action

5. Verify Rollback Success
   - Check site loads: https://calm-centaur-ad0abf.netlify.app
   - Test critical functionality
   - Check Netlify logs for errors

**Time to Recovery:** 30 seconds
**Risk:** Medium (manual process, potential for error)

---

## Method 3: Netlify Snapshot Rollback

### If UI method fails:

1. Check Netlify Snapshots
   - Dashboard → Deploys → All deploys
   - Each deployment has snapshot/backup

2. Contact Netlify Support
   - Include deployment hash
   - Explain issue
   - Request snapshot restore

**Time to Recovery:** 5-10 minutes
**Risk:** Medium (requires support interaction)

---

## Post-Rollback Actions

After rolling back, perform:

```bash
# 1. Verify site health
curl -I https://calm-centaur-ad0abf.netlify.app

# 2. Check security headers
curl -I https://calm-centaur-ad0abf.netlify.app | grep -i 'strict-transport'

# 3. Test critical features
# - Visit homepage
# - Search recipes
# - Newsletter signup
# - Mobile view

# 4. Notify team
# Slack message:
# :warning: Production rollback executed
# Reverted to commit: [hash]
# Reason: [specific issue]
# Status: [recovered/investigating]

# 5. Investigate root cause
# Review problematic commit
# Check logs
# Create incident report

# 6. Fix root cause
# Create new branch
# Fix issue
# Test thoroughly
# Redeploy
```

---

## Preventing Need for Rollback

### Before Deployment

- [ ] All tests passing (722/722)
- [ ] Security headers validated
- [ ] Bundle size within limits
- [ ] Lighthouse CI passing
- [ ] Staging environment tested
- [ ] E2E tests passing
- [ ] Performance budgets met

### Deploy with Confidence

- [ ] Deploy to staging first
- [ ] Run full test suite
- [ ] Manual QA verification
- [ ] Performance baseline check
- [ ] Security scan clean
- [ ] Then deploy to production

---

## Testing Rollback (Monthly)

Every month, practice rollback:

```bash
# 1. Note current commit
CURRENT=$(git rev-parse HEAD)

# 2. Revert to previous commit
PREV=$(git log --oneline | head -2 | tail -1 | cut -d' ' -f1)
git revert $PREV

# 3. Push revert
git push origin rollback-test

# 4. Verify rollback works
# Check site loads
# Verify features work

# 5. Revert the revert
git revert HEAD
git push origin rollback-test

# 6. Merge back to main
git checkout main
git pull
git merge rollback-test
git push origin main

# 7. Document findings
```

---

## Emergency Contact

**Production Issue?**

1. Alert team: Slack #incidents
2. Assess severity (P1 = rollback immediately)
3. Execute rollback (Method 1 preferred)
4. Investigate root cause
5. Implement fix
6. Redeploy with testing

**On-Call:** [Contact info]
**Escalation:** [Manager contact]

---

## Rollback History Log

| Date | Reason | Commit | Status |
|------|--------|--------|--------|
| 2026-01-15 | Test rollback practice | abc123 | Success |
| - | - | - | - |

Keep this updated with actual rollbacks.

---

**Document Version:** 1.0
**Last Tested:** Never (needs monthly testing)
**Next Test Date:** 2026-02-15
```

**Steps:**
1. Create file `ROLLBACK_PROCEDURE.md` in root
2. Copy content above
3. Adjust site URLs and contacts
4. Commit: `git commit -m "docs: add production rollback procedure"`
5. Share with team
6. Practice rollback monthly

---

## Phase 2: High Priority (P1) - Week 2

### Task 2.1: Optimize Bundle Size (Three.js Dynamic Import)

#### Problem
```
Current: 855KB Three.js chunk loaded on all pages
Impact: 226KB gzip on every pageview
Only used on: Alchemy Lab page (~5% of users)
```

#### Solution

**Step 1: Create lazy-loaded Three.js component**

**File:** `sunday-brunch-website/src/components/AlchemistsLabCanvas.jsx` (NEW)

```javascript
import React, { lazy, Suspense } from 'react'
import Loading from './Loading'

// Dynamically import only when needed
const ThreeCanvas = lazy(() => import('./ThreeCanvas'))

export const AlchemistsLabCanvas = () => {
  return (
    <Suspense fallback={<Loading />}>
      <ThreeCanvas />
    </Suspense>
  )
}

export default AlchemistsLabCanvas
```

**Step 2: Update AlchemistsLab page**

**File:** `sunday-brunch-website/src/pages/AlchemistsLab.jsx`

```javascript
// Before:
import ThreeCanvas from '../components/ThreeCanvas'

export default function AlchemistsLab() {
  return (
    <div>
      <h1>The Alchemist's Lab</h1>
      <ThreeCanvas />
    </div>
  )
}

// After:
import { lazy, Suspense } from 'react'
import Loading from '../components/Loading'

const AlchemistsLabCanvas = lazy(() =>
  import('../components/AlchemistsLabCanvas')
)

export default function AlchemistsLab() {
  return (
    <div>
      <h1>The Alchemist's Lab</h1>
      <Suspense fallback={<Loading />}>
        <AlchemistsLabCanvas />
      </Suspense>
    </div>
  )
}
```

**Step 3: Update Vite config**

**File:** `sunday-brunch-website/vite.config.js`

```javascript
// Add to rollupOptions.output.manualChunks:
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'animation-vendor': ['framer-motion', 'gsap'],
  'three-vendor': ['three', '@react-three/fiber', '@react-three/drei']
  // Three.js will now only be in its own chunk, loaded on demand
}
```

**Step 4: Test and verify**

```bash
cd sunday-brunch-website

# Build production
npm run build

# Expected results:
# Before:
#   three-vendor: 855KB (gzip: 226KB) - loaded on all pages
# After:
#   three-vendor: 855KB (gzip: 226KB) - loaded ONLY on Alchemy Lab page
#   main bundle: -230KB reduction
#   Performance improvement: +10-15 Lighthouse points

# Verify Three.js not in main bundle
unzip -l dist/assets/index-*.js | grep -i three
# Should return nothing

# Verify Three.js in separate chunk
ls -la dist/assets/three-vendor-*.js
# Should see Three.js chunk
```

**Verification:**
```bash
# Check bundle size before deploying
npm run build

# You should see:
# ✓ dist/assets/index-*.js  ~300KB (instead of 369KB)
# ✓ dist/assets/three-vendor-*.js  855KB (lazy loaded)

# Commit changes
git add .
git commit -m "perf: lazy-load Three.js only on Alchemy Lab page"
git push origin main
```

---

### Task 2.2: Add Dependency Security Scanning

#### Solution: Create security.yml workflow

**File:** `.github/workflows/security.yml` (NEW)

```yaml
name: Security Scanning

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday

jobs:
  npm-audit:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./sunday-brunch-website

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: sunday-brunch-website/package-lock.json

      - name: Run npm audit
        run: npm audit --audit-level=moderate
        continue-on-error: true

      - name: Check for vulnerabilities
        run: |
          npm audit > audit-report.json || true

          # Fail if high or critical vulnerabilities
          CRITICAL=$(npm audit --json | grep -c '"severity":"critical"' || true)
          HIGH=$(npm audit --json | grep -c '"severity":"high"' || true)

          if [ $CRITICAL -gt 0 ] || [ $HIGH -gt 0 ]; then
            echo "❌ Found $CRITICAL critical and $HIGH high vulnerabilities"
            npm audit
            exit 1
          else
            echo "✅ No critical vulnerabilities found"
          fi

      - name: Upload audit report
        uses: actions/upload-artifact@v4
        with:
          name: npm-audit-report
          path: audit-report.json

      - name: Comment PR with security status
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ Security scan passed. No critical vulnerabilities detected.'
            })

  snyk-scan:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./sunday-brunch-website
    if: false  # Enable after setting up Snyk account

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Snyk scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
```

**Steps:**
1. Create file `.github/workflows/security.yml`
2. Copy YAML content above
3. Commit: `git commit -m "ci: add npm audit security scanning"`
4. Push to GitHub
5. Go to Actions tab to verify workflow runs
6. (Optional) Set up Snyk account for enhanced scanning

---

### Task 2.3: Set Up E2E Testing with Playwright

#### Solution

**Step 1: Install Playwright**

```bash
cd sunday-brunch-website
npm install --save-dev @playwright/test
npx playwright install
```

**Step 2: Create test configuration**

**File:** `sunday-brunch-website/playwright.config.js` (NEW)

```javascript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
})
```

**Step 3: Create E2E tests**

**File:** `sunday-brunch-website/e2e/homepage.spec.js` (NEW)

```javascript
import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Sunday Brunch/)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should have working navigation', async ({ page }) => {
    await page.goto('/')
    const homeLink = page.locator('a:has-text("Home")')
    await expect(homeLink).toBeVisible()
    await homeLink.click()
    await expect(page).toHaveURL('/')
  })

  test('should be mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await expect(page.locator('header')).toBeVisible()
  })
})
```

**File:** `sunday-brunch-website/e2e/search.spec.js` (NEW)

```javascript
import { test, expect } from '@playwright/test'

test.describe('Recipe Search', () => {
  test('should search recipes', async ({ page }) => {
    await page.goto('/recipes')

    // Find search input
    const searchInput = page.locator('input[placeholder*="search"]')
    await searchInput.fill('pasta')

    // Wait for results
    await page.waitForLoadState('networkidle')

    // Verify results displayed
    const results = page.locator('[data-testid="recipe-card"]')
    await expect(results).toHaveCount(grossThan: 0)
  })

  test('should filter recipes', async ({ page }) => {
    await page.goto('/recipes')

    // Open filters
    await page.locator('button:has-text("Filters")').click()

    // Select vegetarian filter
    await page.locator('input[type="checkbox"][value="vegetarian"]').click()

    // Wait for results update
    await page.waitForLoadState('networkidle')

    // Verify filtered results
    const results = page.locator('[data-testid="recipe-card"]')
    await expect(results.first()).toBeVisible()
  })
})
```

**File:** `sunday-brunch-website/e2e/newsletter.spec.js` (NEW)

```javascript
import { test, expect } from '@playwright/test'

test.describe('Newsletter Signup', () => {
  test('should subscribe to newsletter', async ({ page }) => {
    await page.goto('/')

    // Find newsletter form
    const emailInput = page.locator('input[type="email"]')
    const submitButton = page.locator('button:has-text("Subscribe")')

    // Fill form
    await emailInput.fill('test-' + Date.now() + '@example.com')

    // Submit
    await submitButton.click()

    // Wait for success message
    const successMsg = page.locator('text=Successfully subscribed')
    await expect(successMsg).toBeVisible({ timeout: 10000 })
  })
})
```

**Step 4: Add to package.json**

```json
{
  "scripts": {
    "test": "vitest",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

**Step 5: Run tests**

```bash
# Run E2E tests (requires running dev server)
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Run in debug mode
npm run test:e2e:debug

# Expected output:
# ✅ 3 passed [chromium] (homepage)
# ✅ 2 passed [chromium] (search)
# ✅ 1 passed [chromium] (newsletter)
```

**Step 6: Add to CI pipeline**

**File:** `.github/workflows/e2e.yml` (NEW)

```yaml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  e2e:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./sunday-brunch-website

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: sunday-brunch-website/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Build app
        run: npm run build

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload Playwright Report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

---

## Phase 3: Monitoring & Observability

### Task 3.1: Integrate Sentry for Error Tracking

**File:** `sunday-brunch-website/src/main.jsx`

```javascript
import * as Sentry from "@sentry/react"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Initialize Sentry
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
)
```

---

## Conclusion

Implement in order:
1. **Week 1:** Fix tests, add headers, add test gate
2. **Week 2:** Optimize bundle, add security scanning, E2E tests
3. **Week 3-4:** Add monitoring, SAST, IaC

After completing Phase 1, deployment becomes safe. After Phase 2, deployment becomes confident. After Phase 3, issues are caught automatically.

---

**Last Updated:** 2026-01-15
**Next Review:** After P0 implementation
