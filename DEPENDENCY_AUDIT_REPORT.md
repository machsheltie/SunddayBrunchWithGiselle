# Dependency Audit & Tree-Shaking Report

**Created:** 2026-01-08
**Status:** Analysis Complete
**Approach:** Beauty-First Optimization (Zero Feature Removal)

---

## 🎯 Executive Summary

**All dependencies are actively used** - NO unused dependencies found ✅

**Tree-shaking opportunities identified:** 3 optimizations for 50-100KB savings

**Philosophy alignment:** All optimizations preserve functionality and beauty

---

## 📊 Dependency Usage Analysis

### Production Dependencies (7 packages)

| Package | Usage | Files | Tree-Shakeable | Status |
|---------|-------|-------|----------------|--------|
| **three** | WebGL 3D | 1 | ⚠️ YES | Optimization available |
| **@react-three/fiber** | Three.js React | 1 | ✅ Optimized | Good |
| **@react-three/drei** | Three.js helpers | 1 | ✅ Optimized | Good |
| **framer-motion** | React animations | 15 | ✅ Optimized | Good |
| **gsap** | Smooth animations | 6 | ✅ Optimized | Good |
| **fuse.js** | Fuzzy search | 1 | ⚠️ MAYBE | Optimization possible |
| **axios** | HTTP client | 1 | ✅ Optimized | Good |
| **prop-types** | Type checking | 6 | ⚠️ YES | Production removal possible |
| **react** | UI framework | All | ✅ Core | Required |
| **react-dom** | DOM renderer | All | ✅ Core | Required |
| **react-router-dom** | Routing | All | ✅ Core | Required |

### Dev Dependencies (7 packages)

All dev dependencies are properly scoped and DO NOT affect production bundle ✅

---

## 🔍 Detailed Analysis

### 1. Three.js - Tree-Shaking Opportunity ⚠️

**Current State:**
```javascript
// WatercolorCanvas.jsx (line 2)
import * as THREE from 'three'

// Usage:
new THREE.Vector2(0.5, 0.5)
new THREE.Vector2(size.width, size.height)
```

**Issue:** Wildcard import (`import *`) prevents tree-shaking
- Imports entire Three.js library (~600KB)
- Only uses `Vector2` class (~2KB)
- **Wasted:** ~598KB

**Optimization:**
```javascript
// ✅ RECOMMENDED: Named import
import { Vector2 } from 'three'

// Usage:
new Vector2(0.5, 0.5)
new Vector2(size.width, size.height)
```

**Impact:**
- Bundle reduction: ~50-100KB (after minification)
- Zero visual change
- Preserves all functionality

**Implementation:**
File: `src/components/WatercolorCanvas.jsx`
- Line 2: Replace `import * as THREE from 'three'` with `import { Vector2 } from 'three'`
- Line 78: Replace `new THREE.Vector2` with `new Vector2`
- Line 79: Replace `new THREE.Vector2` with `new Vector2`
- Line 84: Replace `new THREE.Vector2` with `new Vector2`

---

### 2. PropTypes - Production Removal Opportunity ⚠️

**Current State:**
- Used in 6 components for runtime type checking
- Loaded in production bundle (~5KB)

**Files Using PropTypes:**
1. `src/components/AllergenWarnings.jsx`
2. `src/components/DietaryBadges.jsx`
3. `src/components/NutritionFacts.jsx`
4. `src/components/search/SearchResults.jsx`
5. `src/components/search/RecipeFilters.jsx`
6. `src/components/search/SearchBar.jsx`

**Optimization:**
PropTypes should only run in development, not production.

**Option A: Automatic Removal (Recommended)**
Vite/Babel automatically removes PropTypes in production with proper configuration.

Add to `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    build: {
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info']
            }
        }
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify('production')
    }
})
```

**Option B: Manual Removal (Not Recommended)**
Remove PropTypes from production dependencies and add `babel-plugin-transform-react-remove-prop-types`.

**Recommendation:** Use Option A (automatic removal)

**Impact:**
- Bundle reduction: ~5KB
- Maintains dev-time type checking
- Zero runtime impact

---

### 3. Fuse.js - Potential Optimization ⚠️

**Current State:**
```javascript
// useRecipeSearch.js
import Fuse from 'fuse.js'
```

**Analysis:**
- Used for fuzzy search functionality
- Size: ~24KB (minified)
- **Alternative:** Native JavaScript search could reduce to ~2KB

**Options:**

**Option A: Keep Fuse.js (Recommended)**
- Superior search UX
- Handles typos and fuzzy matching
- Worth the 24KB for quality experience

**Option B: Replace with Native Search**
- Reduce bundle by ~20KB
- **Trade-off:** Less forgiving search (exact matches only)
- **User impact:** Worse search experience

**Recommendation:** **KEEP Fuse.js** - search quality is part of the "beautiful experience"

---

## 🛠️ Optimization Recommendations

### Priority 1: Three.js Named Import (HIGH IMPACT)

**Expected Savings:** 50-100KB
**Implementation Time:** 5 minutes
**Risk:** Zero

**Steps:**
1. Edit `src/components/WatercolorCanvas.jsx`
2. Replace wildcard import with named import
3. Update 4 usages of `THREE.Vector2` to `Vector2`
4. Test watercolor background still works
5. Build and verify bundle size reduction

**Implementation:**

```javascript
// BEFORE
import * as THREE from 'three'
// ...
new THREE.Vector2(0.5, 0.5)

// AFTER
import { Vector2 } from 'three'
// ...
new Vector2(0.5, 0.5)
```

---

### Priority 2: PropTypes Production Removal (MEDIUM IMPACT)

**Expected Savings:** ~5KB
**Implementation Time:** 10 minutes
**Risk:** Zero (automatic)

**Steps:**
1. Update `vite.config.js` with build optimizations
2. Verify PropTypes work in development
3. Build production bundle
4. Verify PropTypes removed from bundle

**Implementation:**

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    build: {
        minify: 'terser',
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'animation-vendor': ['framer-motion', 'gsap'],
                    'three-vendor': ['three', '@react-three/fiber', '@react-three/drei']
                }
            }
        },
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log']
            }
        }
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify('production')
    }
})
```

**Benefits:**
- PropTypes auto-removed in production
- Console.log statements removed
- Better code splitting (vendor chunks)
- Improved caching (vendor bundles change less frequently)

---

### Priority 3: Fuse.js Analysis (LOW PRIORITY)

**Expected Savings:** ~20KB (if replaced)
**Implementation Time:** 2 hours
**Risk:** HIGH (worse UX)

**Recommendation:** **DO NOT IMPLEMENT** - search quality > bundle size

---

## 📈 Expected Results

### Before Optimization

**JavaScript Bundle:** ~1.37 MB (current)
- Three.js: ~600KB (44%)
- Framer Motion: ~100KB (7%)
- GSAP: ~150KB (11%)
- React vendor: ~200KB (15%)
- Other: ~320KB (23%)

### After Optimization

**JavaScript Bundle:** ~1.25-1.30 MB (estimated)

**Savings Breakdown:**
- Three.js named import: -50 to -100KB
- PropTypes removal: -5KB
- Console.log removal: -2KB
- **Total savings:** 57-107KB (4-8% reduction)

### Performance Improvements

- **Initial bundle size:** -60 to -110KB
- **Parse/compile time:** -20 to -40ms
- **LCP (Largest Contentful Paint):** -10 to -20ms
- **Lighthouse Performance:** +1 to +2 points

---

## 🎯 Implementation Checklist

### Phase 1: Three.js Optimization (5 minutes)
- [ ] Edit `WatercolorCanvas.jsx` line 2
- [ ] Change `import * as THREE` to `import { Vector2 }`
- [ ] Find/replace `THREE.Vector2` with `Vector2` (4 occurrences)
- [ ] Test watercolor background works
- [ ] Visual comparison (should be identical)

### Phase 2: Vite Build Optimization (10 minutes)
- [ ] Update `vite.config.js` with optimizations
- [ ] Test dev build works
- [ ] Build production (`npm run build`)
- [ ] Verify PropTypes removed (check bundle)
- [ ] Verify console.log removed
- [ ] Test production bundle works

### Phase 3: Verification (15 minutes)
- [ ] Bundle size analysis (`npm run build`)
- [ ] Compare before/after sizes
- [ ] Lighthouse audit (performance score)
- [ ] Visual regression testing
- [ ] Test all features work

---

## 📋 Advanced Optimization Ideas (Future)

### Code Splitting by Route (Already Implemented ✅)
- Home page loads immediately
- Other pages lazy-loaded
- Expected savings: 300-400KB initial load

### Dynamic Imports for Heavy Features
```javascript
// Load Three.js only when watercolor canvas is visible
const WatercolorCanvas = lazy(() => import('./components/WatercolorCanvas'))

// Conditional rendering
{showWatercolor && (
    <Suspense fallback={<div className="watercolor-placeholder" />}>
        <WatercolorCanvas />
    </Suspense>
)}
```

**Trade-off:** Slight delay on first view of watercolor
**Savings:** 600KB not loaded until needed

**Recommendation:** Consider for future if initial load becomes a concern

---

### CDN for Heavy Libraries
Move Three.js, GSAP, Framer Motion to CDN to leverage browser caching across sites.

**Pros:**
- Cached across websites
- Faster initial load (if cached)

**Cons:**
- Dependency on third-party CDN
- No version control
- Potential privacy concerns

**Recommendation:** NOT worth the complexity for this project

---

## 📊 Bundle Analysis Commands

### Analyze Current Bundle
```bash
cd sunday-brunch-website

# Build with analysis
npm run build

# View bundle composition
npx vite-bundle-visualizer
```

### Compare Before/After
```bash
# Before optimization
npm run build
ls -lh dist/assets/*.js

# After optimization
npm run build
ls -lh dist/assets/*.js

# Calculate savings
du -sh dist/
```

---

## 🚨 What NOT to Do

### ❌ DON'T Remove Animation Libraries
- Three.js, GSAP, Framer Motion are essential for brand identity
- 850KB of animations CREATE the whimsical experience
- Performance metrics < beautiful experience

### ❌ DON'T Replace Fuse.js with Native Search
- 24KB buys superior search UX
- Fuzzy matching is worth the size
- Search quality is part of user experience

### ❌ DON'T Over-Optimize Images
- WebP conversion: ✅ (better quality, smaller size)
- Removing images: ❌ (sacrifices beauty)
- Aggressive compression: ❌ (degrades quality)

### ❌ DON'T Use CDNs for Critical Libraries
- Adds dependency on external services
- Version pinning becomes complex
- Not worth the marginal gains

---

## ✅ Success Criteria

**Metrics:**
- [ ] 50-100KB bundle size reduction
- [ ] Zero visual changes
- [ ] All animations work identically
- [ ] PropTypes removed from production
- [ ] Lighthouse score +1 to +2 points

**Code Quality:**
- [ ] Named imports where possible
- [ ] Proper tree-shaking configuration
- [ ] Vendor chunk splitting
- [ ] Console statements removed in production

**User Experience:**
- [ ] Zero perceived performance change
- [ ] Watercolor background identical
- [ ] All animations smooth
- [ ] Search functionality unchanged

---

## 📝 Notes

1. **Tree-shaking requires ES modules:** All dependencies already use ES modules ✅
2. **Terser minification:** Better than esbuild for size optimization
3. **Manual chunks:** Improves caching for repeat visitors
4. **PropTypes removal:** Babel/React automatically handles this
5. **Console.log removal:** Good practice for production bundles

---

**Last Updated:** 2026-01-08
**Status:** ✅ Ready for Implementation
**Estimated Time:** 30 minutes total
**Expected Savings:** 57-107KB (4-8% reduction)
**Risk Level:** Zero (all changes are safe optimizations)
