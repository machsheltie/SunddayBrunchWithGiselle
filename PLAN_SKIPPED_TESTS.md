# Action Plan: Handle 4 Skipped Tests in Layout.test.jsx

**Status:** No failing tests - All 4 "remaining" tests are intentionally skipped
**Impact:** Low - These are future features, not blocking issues
**Estimated Time:** 15 minutes (cleanup) to 2-4 hours (if implementing features)

---

## Quick Summary

**Good News:** There are **ZERO failing tests** in the codebase! 🎉

The 4 "remaining" tests are **intentionally skipped** because they test features that don't exist yet. This is the correct approach - tests were written ahead of features and properly marked as skipped.

**You have two options:**
1. **Option A (Recommended):** Clean up redundant test, keep others skipped (15 min)
2. **Option B:** Implement missing features to un-skip tests (2-4 hours)

---

## Option A: Clean Up Only (Recommended) - 15 Minutes

**Best if:** You want to ship current state without additional features

### Step 1: Remove Redundant "Recipes CTA" Test (5 min)

**File:** `sunday-brunch-website/src/tests/components/Layout.test.jsx`
**Lines to delete:** 223-225

**Current code:**
```javascript
it.skip('should have Recipes CTA link that navigates to /recipes', () => {
    // NOTE: Current layout uses standard Recipes link, not CTA variant
})
```

**Action:** Delete these 3 lines entirely

**Reason:** This test is redundant - a working Recipes link already exists and is tested. The test expected a CTA-styled variant that was never designed.

**Result:** 716/719 tests (99.6%)

---

### Step 2: Add Roadmap Comments to Remaining Skips (10 min)

Update the 3 remaining skipped tests with clearer context:

#### Brand Link Test (Line 138)
**Current:**
```javascript
it.skip('should render brand link that navigates to home', () => {
    // NOTE: This test is skipped because current Layout.jsx doesn't have a brand link
})
```

**Update to:**
```javascript
it.skip('should render brand link that navigates to home', () => {
    // FUTURE: Clickable brand title that links to home
    // TODO: Un-skip this test when brand becomes clickable
    // Status: Optional UX enhancement - P3 priority
})
```

#### Newsletter Link Test (Line 215)
**Current:**
```javascript
it.skip('should have Newsletter link that navigates to /newsletter', () => {
    // NOTE: Newsletter link not in current Layout.jsx navigation
})
```

**Update to:**
```javascript
it.skip('should have Newsletter link that navigates to /newsletter', () => {
    // FUTURE: Newsletter subscription page
    // TODO: Un-skip when Newsletter feature is implemented
    // Status: Awaiting product roadmap decision
})
```

#### Lab Link Test (Line 219)
**Current:**
```javascript
it.skip('should have Lab link that navigates to /lab', () => {
    // NOTE: Lab link not in current Layout.jsx navigation
})
```

**Update to:**
```javascript
it.skip('should have Lab link that navigates to /lab', () => {
    // FUTURE: Experimental recipes lab section
    // TODO: Un-skip when Lab feature is implemented
    // Status: Awaiting product roadmap decision
})
```

---

### Option A Summary

**Time:** 15 minutes
**Changes:** 1 test deleted, 3 tests updated with better comments
**Result:** 716/719 tests (99.6%), all passing or legitimately skipped
**Test Debt:** 0.4% (3 skipped future features)

**Deliverable:** Clean, well-documented test suite ready for production

---

## Option B: Implement Missing Features (2-4 Hours)

**Best if:** You want to complete all planned navigation features

### Phase 1: Implement Clickable Brand (30 min)

**Complexity:** Low
**Value:** Medium (common UX pattern)

#### Implementation Steps

**1. Update Layout.jsx (10 min)**

**File:** `sunday-brunch-website/src/components/Layout.jsx`

**Find this code (around line 45):**
```javascript
<div className="layout__brand">
    <h1 className="brand-title">
        Sunday Brunch <span className="brand-accent">with</span> Giselle
    </h1>
    <p className="brand-subtitle">Whimsy, warmth, and wags</p>
</div>
```

**Replace with:**
```javascript
<div className="layout__brand">
    <Link to="/" className="brand-link" onClick={() => handleNavClick('Home (Brand)', '/')}>
        <h1 className="brand-title">
            Sunday Brunch <span className="brand-accent">with</span> Giselle
        </h1>
    </Link>
    <p className="brand-subtitle">Whimsy, warmth, and wags</p>
</div>
```

**2. Update CSS (5 min)**

**File:** `sunday-brunch-website/src/components/Header.css`

**Add:**
```css
.brand-link {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    transition: opacity 0.2s;
}

.brand-link:hover {
    opacity: 0.8;
}

.brand-link:focus {
    outline: 2px solid var(--whimsy-purple);
    outline-offset: 4px;
    border-radius: 4px;
}
```

**3. Un-skip and Update Test (5 min)**

**File:** `sunday-brunch-website/src/tests/components/Layout.test.jsx`

**Change from:**
```javascript
it.skip('should render brand link that navigates to home', () => {
```

**To:**
```javascript
it('should render brand link that navigates to home', () => {
    // Arrange & Act
    render(
        <MemoryRouter>
            <Layout>
                <div>Test content</div>
            </Layout>
        </MemoryRouter>
    )

    // Assert
    const brandLink = screen.getByRole('link', { name: /Sunday Brunch with Giselle/i })
    expect(brandLink).toBeInTheDocument()
    expect(brandLink).toHaveAttribute('href', '/')
})
```

**4. Test Implementation (10 min)**
```bash
cd sunday-brunch-website
npm test -- Layout.test.jsx --run
```

**Expected:** 717/719 tests passing (1 more test un-skipped)

---

### Phase 2: Implement Newsletter Page (1-1.5 hours)

**Complexity:** Medium
**Value:** High (user engagement feature)

#### Implementation Steps

**1. Create Newsletter Page (30 min)**

**File:** `sunday-brunch-website/src/pages/Newsletter.jsx`

```javascript
import { useState } from 'react'
import CTAForm from '../components/CTAForm'
import './Newsletter.css'

export default function Newsletter() {
    return (
        <div className="newsletter-page">
            <section className="newsletter-hero">
                <h1 className="newsletter-hero__title">
                    Sunday Letters & Recipe Drops
                </h1>
                <p className="newsletter-hero__subtitle">
                    Join our cozy community for weekly recipes, baking stories,
                    and Sheltie side-eye delivered to your inbox every Sunday morning.
                </p>
            </section>

            <section className="newsletter-signup">
                <CTAForm
                    headline="Never miss a Sunday brunch"
                    mode="newsletter"
                />
            </section>

            <section className="newsletter-benefits">
                <h2>What You'll Get</h2>
                <ul>
                    <li>🥐 New recipes every week</li>
                    <li>📖 Behind-the-scenes baking stories</li>
                    <li>🐕 Sheltie updates and photos</li>
                    <li>🎧 Early access to podcast episodes</li>
                    <li>💝 Exclusive subscriber-only recipes</li>
                </ul>
            </section>
        </div>
    )
}
```

**2. Add Newsletter Route (5 min)**

**File:** `sunday-brunch-website/src/App.jsx`

Add route:
```javascript
import Newsletter from './pages/Newsletter'

// In Routes:
<Route path="/newsletter" element={<Newsletter />} />
```

**3. Add Newsletter Link to Layout (5 min)**

**File:** `sunday-brunch-website/src/components/Layout.jsx`

Add after Recipes link:
```javascript
<Link
    to="/newsletter"
    className="nav-button"
    onClick={() => handleNavClick('Newsletter', '/newsletter')}
>
    Newsletter
</Link>
```

**4. Create Newsletter CSS (10 min)**

**File:** `sunday-brunch-website/src/pages/Newsletter.css`

```css
.newsletter-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

.newsletter-hero {
    text-align: center;
    margin-bottom: 3rem;
}

.newsletter-hero__title {
    font-size: 2.5rem;
    color: var(--whimsy-purple);
    margin-bottom: 1rem;
}

.newsletter-hero__subtitle {
    font-size: 1.2rem;
    color: var(--text-secondary);
    line-height: 1.6;
}

.newsletter-signup {
    margin: 3rem 0;
}

.newsletter-benefits {
    margin-top: 4rem;
}

.newsletter-benefits h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: var(--whimsy-purple);
}

.newsletter-benefits ul {
    list-style: none;
    padding: 0;
}

.newsletter-benefits li {
    font-size: 1.1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--border-light);
}
```

**5. Un-skip and Update Test (10 min)**

**File:** `sunday-brunch-website/src/tests/components/Layout.test.jsx`

Change from `it.skip` to `it` and update:
```javascript
it('should have Newsletter link that navigates to /newsletter', () => {
    // Arrange & Act
    render(
        <MemoryRouter>
            <Layout>
                <div>Test content</div>
            </Layout>
        </MemoryRouter>
    )

    // Assert
    const newsletterLink = screen.getByRole('link', { name: /Newsletter/i })
    expect(newsletterLink).toBeInTheDocument()
    expect(newsletterLink).toHaveAttribute('href', '/newsletter')
})
```

**6. Create Newsletter Page Tests (20 min)**

**File:** `sunday-brunch-website/src/tests/pages/Newsletter.test.jsx`

```javascript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Newsletter from '../../pages/Newsletter'

describe('Newsletter Page', () => {
    it('should render newsletter hero section', () => {
        render(
            <BrowserRouter>
                <Newsletter />
            </BrowserRouter>
        )

        expect(screen.getByText(/Sunday Letters & Recipe Drops/i)).toBeInTheDocument()
    })

    it('should render newsletter signup form', () => {
        render(
            <BrowserRouter>
                <Newsletter />
            </BrowserRouter>
        )

        expect(screen.getByText(/Never miss a Sunday brunch/i)).toBeInTheDocument()
    })

    it('should list newsletter benefits', () => {
        render(
            <BrowserRouter>
                <Newsletter />
            </BrowserRouter>
        )

        expect(screen.getByText(/New recipes every week/i)).toBeInTheDocument()
        expect(screen.getByText(/Early access to podcast episodes/i)).toBeInTheDocument()
    })
})
```

**Expected:** 721/722 tests passing (1 more test un-skipped, 3 new tests added)

---

### Phase 3: Implement Lab Page (1-1.5 hours)

**Complexity:** Medium
**Value:** Medium (experimental feature showcase)

#### Implementation Steps

Similar structure to Newsletter page:

**1. Create Lab.jsx page (30 min)**
- Showcase experimental recipes
- "Recipe testing lab" concept
- Beta recipes users can try

**2. Add Lab route (5 min)**

**3. Add Lab link to Layout (5 min)**

**4. Create Lab.css (10 min)**

**5. Un-skip and update test (10 min)**

**6. Create Lab.test.jsx (20 min)**

**Expected:** 725/725 tests passing (100%)

---

### Option B Summary

**Time:** 2-4 hours
**Changes:** 3 new pages, updated navigation, 4 tests un-skipped
**Result:** 725/725 tests (100%), all features complete
**Test Debt:** 0%

**Deliverable:** Fully featured navigation with Newsletter and Lab pages

---

## Decision Matrix

| Factor | Option A (Clean Up) | Option B (Implement) |
|--------|-------------------|---------------------|
| **Time Required** | 15 min | 2-4 hours |
| **Immediate Value** | High (clarity) | Medium (features) |
| **Technical Debt** | 0.4% | 0% |
| **Test Coverage** | 99.6% | 100% |
| **User Impact** | None | High (new features) |
| **Risk** | Zero | Low-Medium |
| **Maintenance** | Low | Medium |

---

## Recommendation

**For immediate production:** Choose **Option A** (Clean Up)
- Takes only 15 minutes
- Zero risk
- 99.6% test coverage is excellent
- Keeps tests aligned with current features

**For next sprint:** Consider **Option B** (Implement)
- If Newsletter/Lab are on roadmap
- When you have 2-4 hours for feature work
- To achieve 100% test coverage

---

## Implementation Checklist

### Option A (Recommended)
- [ ] Delete redundant "Recipes CTA" test (Line 223-225)
- [ ] Update Brand Link test comment with roadmap notes
- [ ] Update Newsletter test comment with roadmap notes
- [ ] Update Lab test comment with roadmap notes
- [ ] Run `npm test` to verify 716/719 passing
- [ ] Commit changes: "chore(tests): clean up redundant test and document skipped tests"

### Option B (If Implementing Features)

**Phase 1: Brand Link**
- [ ] Update Layout.jsx to wrap brand in Link
- [ ] Add brand-link CSS styles
- [ ] Un-skip brand link test
- [ ] Update test assertions
- [ ] Run tests: expect 717/719

**Phase 2: Newsletter**
- [ ] Create Newsletter.jsx page
- [ ] Add Newsletter route to App.jsx
- [ ] Add Newsletter link to Layout.jsx
- [ ] Create Newsletter.css
- [ ] Un-skip newsletter test
- [ ] Create Newsletter.test.jsx
- [ ] Run tests: expect 721/722

**Phase 3: Lab**
- [ ] Create Lab.jsx page
- [ ] Add Lab route to App.jsx
- [ ] Add Lab link to Layout.jsx
- [ ] Create Lab.css
- [ ] Un-skip lab test
- [ ] Create Lab.test.jsx
- [ ] Run tests: expect 725/725 (100%)

---

## Testing Commands

**Run all tests:**
```bash
cd sunday-brunch-website
npm test -- --run
```

**Run only Layout tests:**
```bash
npm test -- Layout.test.jsx --run
```

**Run with coverage:**
```bash
npm test -- --coverage --run
```

**Watch mode (during development):**
```bash
npm test -- Layout.test.jsx
```

---

## Success Criteria

### Option A Success
- ✅ 716/719 tests passing (99.6%)
- ✅ 0 failing tests
- ✅ All skipped tests documented with roadmap notes
- ✅ No redundant tests remaining

### Option B Success
- ✅ 725/725 tests passing (100%)
- ✅ 0 failing tests
- ✅ 0 skipped tests
- ✅ Newsletter page functional
- ✅ Lab page functional
- ✅ Clickable brand navigation working

---

## Final Notes

**Remember:** There are **NO failing tests** in your codebase. This is a success! 🎉

The 4 skipped tests represent:
- 1 redundant test (should be deleted)
- 3 future features (correctly skipped until implemented)

You can ship the current state with confidence. The test suite is production-ready.

Choose Option A for quick cleanup, or Option B if you want to implement the features now.

---

**Plan Status:** Ready for implementation
**Estimated Start:** Immediate
**Risk Level:** Low (Option A) / Low-Medium (Option B)
**Next Review:** After implementation complete
