# Web Vitals Test Fix - Sprint 4 Week 1

## Root Cause Identified ✅

The Web Vitals tests are failing because the test file mocks `onFID` (First Input Delay) but the actual code uses `onINP` (Interaction to Next Paint).

**Why this happened:**
- `web-vitals` package v3+ replaced FID with INP
- The implementation code was updated to use `onINP` (correct)
- The test mocks were not updated (incorrect - still mock `onFID`)

---

## The Fix (SIMPLE - 5 minutes)

### File to Modify
**Path:** `sunday-brunch-website/src/tests/lib/webVitals.test.js`

### Change #1: Update Mock Imports (Line 4-10)

**Before:**
```javascript
vi.mock('web-vitals', () => ({
    onCLS: vi.fn(),
    onFID: vi.fn(),  // ❌ Wrong - FID is deprecated
    onLCP: vi.fn(),
    onFCP: vi.fn(),
    onTTFB: vi.fn()
}))
```

**After:**
```javascript
vi.mock('web-vitals', () => ({
    onCLS: vi.fn(),
    onINP: vi.fn(),  // ✅ Correct - INP replaced FID in v3+
    onLCP: vi.fn(),
    onFCP: vi.fn(),
    onTTFB: vi.fn()
}))
```

### Change #2: Update Import Statement (Line 18)

**Before:**
```javascript
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals'
```

**After:**
```javascript
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals'
```

### Change #3: Update Test References

Find and replace all occurrences of `onFID` with `onINP` in the test file:

**Before:**
```javascript
onFID.mockImplementation(callback => callback(fidGoodMetric))
```

**After:**
```javascript
onINP.mockImplementation(callback => callback(inpGoodMetric))
```

**Also update variable names** for clarity:
- `fidGoodMetric` → `inpGoodMetric`
- `'FID'` → `'INP'`
- `'fid-1'` → `'inp-1'`

### Change #4: Update Threshold Values

INP has different thresholds than FID:

**FID Thresholds (deprecated):**
- Good: <100ms
- Needs Improvement: <300ms
- Poor: ≥300ms

**INP Thresholds (current):**
- Good: <200ms
- Needs Improvement: <500ms
- Poor: ≥500ms

**Update test values** around line 325:
```javascript
// Before:
const fidGoodMetric = { name: 'FID', value: 50, rating: 'good', delta: 50, id: 'fid-1' }

// After:
const inpGoodMetric = { name: 'INP', value: 150, rating: 'good', delta: 150, id: 'inp-1' }
```

---

## Complete Example (Lines 323-331)

### Before:
```javascript
it('should calculate correct ratings for all Core Web Vitals thresholds', () => {
    // Test FID good threshold (<100ms)
    const fidGoodMetric = { name: 'FID', value: 50, rating: 'good', delta: 50, id: 'fid-1' }
    onFID.mockImplementation(callback => callback(fidGoodMetric))
    initWebVitals()
    expect(trackEvent).toHaveBeenCalledWith('web_vitals', expect.objectContaining({
        metric_name: 'FID',
        metric_rating: 'good'
    }))
```

### After:
```javascript
it('should calculate correct ratings for all Core Web Vitals thresholds', () => {
    // Test INP good threshold (<200ms)
    const inpGoodMetric = { name: 'INP', value: 150, rating: 'good', delta: 150, id: 'inp-1' }
    onINP.mockImplementation(callback => callback(inpGoodMetric))
    initWebVitals()
    expect(trackEvent).toHaveBeenCalledWith('web_vitals', expect.objectContaining({
        metric_name: 'INP',
        metric_rating: 'good'
    }))
```

---

## Search and Replace Commands

Use these to make the changes quickly:

1. **Find:** `onFID`
   **Replace:** `onINP`

2. **Find:** `'FID'`
   **Replace:** `'INP'`

3. **Find:** `fidGoodMetric`
   **Replace:** `inpGoodMetric`

4. **Find:** `'fid-`
   **Replace:** `'inp-`

5. **Find:** `value: 50`
   **Replace:** `value: 150`
   (Context: FID good threshold <100ms → INP good threshold <200ms)

---

## Verification

### Run Tests
```bash
cd sunday-brunch-website
npm test -- webVitals.test.js
```

### Expected Result
✅ **22/22 tests passing** (currently 11/22)

### Failed Tests That Will Pass
1. ✅ should return "unknown" for unrecognized metric names
2. ✅ should return "good" for values within good threshold (LCP <= 2500)
3. ✅ should return "needs-improvement" for values in middle range (LCP 2500-4000)
4. ✅ should return "poor" for values above poor threshold (LCP > 4000)
5. ✅ should calculate correct ratings for all Core Web Vitals thresholds
6. ✅ should handle multiple metrics being reported simultaneously
7. ✅ should include page path in analytics payload
8. ✅ should handle missing navigator properties gracefully
9. ✅ should include connection type when available
10. ✅ should include device memory when available
11. ✅ should handle console errors during initialization

---

## Why This Matters

### Core Web Vitals Evolution
- **FID (First Input Delay)** measured time from user interaction to browser response
- **INP (Interaction to Next Paint)** is more comprehensive - measures ALL interactions, not just first
- Google replaced FID with INP in 2024 as a better user experience metric

### Implementation Was Correct
- `src/lib/webVitals.js` correctly uses `onINP` (line 79)
- Tests just need to catch up with the implementation

---

## Impact

### Before Fix
- Passing: 667/722 (92.4%)
- Failing: 55/722 (7.6%)

### After Fix
- Passing: 678/722 (93.9%)
- Failing: 44/722 (6.1%)
- **Improvement:** +11 tests passing (+1.5%)

---

## Next Steps

After applying this fix:

1. ✅ **WhimsicalLoader testId** → +3 tests (670 → 673)
2. ✅ **Web Vitals onFID → onINP** → +11 tests (673 → 684)
3. ⏳ **Database setup** (USER ACTION) → +19 tests (684 → 703)
4. ⏳ **Remaining tests** → +19 tests (703 → 722)

**Target:** 722/722 passing (100%)

---

## Related Documentation

- MDN Web Vitals: https://developer.mozilla.org/en-US/docs/Web/Performance/Core_Web_Vitals
- web-vitals v3 Migration: https://github.com/GoogleChrome/web-vitals/releases/tag/v3.0.0
- INP vs FID: https://web.dev/inp/

---

**Status:** READY TO FIX (need write permissions)
**Estimated Time:** 5 minutes
**Complexity:** Low (search and replace)
**Impact:** +11 tests passing
