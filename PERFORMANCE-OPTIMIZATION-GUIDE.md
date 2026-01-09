# Performance Optimization Quick Start Guide

## 🚨 Critical Actions (Do Today)

### 1. Install Required Dependencies
```bash
npm install --save-dev rollup-plugin-visualizer vite-plugin-compression vite-plugin-pwa web-vitals
```

### 2. Replace vite.config.js
```bash
# Backup current config
cp vite.config.js vite.config.backup.js

# Use optimized config
cp vite.config.optimized.js vite.config.js
```

### 3. Implement Code Splitting (30 min)

Create `src/App.lazy.jsx`:
```javascript
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import LoadingSkeleton from './components/LoadingSkeleton'

// Lazy load heavy pages
const Home = lazy(() => import('./pages/Home'))
const RecipePage = lazy(() => import('./pages/RecipePage'))
const RecipeIndexPage = lazy(() => import('./pages/RecipeIndexPage'))
const AlchemistsLab = lazy(() => import('./pages/AlchemistsLab'))
const TeamPage = lazy(() => import('./pages/TeamPage'))
const EpisodePage = lazy(() => import('./pages/EpisodePage'))

function App() {
  return (
    <Suspense fallback={<LoadingSkeleton type="page" />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<RecipeIndexPage />} />
        <Route path="/recipe/:slug" element={<RecipePage />} />
        <Route path="/alchemists-lab" element={<AlchemistsLab />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/episode/:id" element={<EpisodePage />} />
      </Routes>
    </Suspense>
  )
}

export default App
```

### 4. Optimize Fonts (10 min)

Update `index.html`:
```html
<!-- Add preconnect and preload -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Add font-display swap to Google Fonts URL -->
<link href="https://fonts.googleapis.com/css2?family=Italiana&family=Fraunces:opsz,soft,wght@9..144,0..100,100..900&display=swap" rel="stylesheet">

<!-- Preload critical font -->
<link rel="preload" as="font" href="https://fonts.gstatic.com/s/italiana/v16/QldNNTtLsx4E__B0XTmRY31Wx7Vv.woff2" crossorigin>
```

### 5. Add Performance Monitor (5 min)

In `src/main.jsx`:
```javascript
import PerformanceMonitor from './components/PerformanceMonitor'

// Add to render
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
        {process.env.NODE_ENV === 'development' && <PerformanceMonitor />}
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
```

## 📊 Measure Impact

### Before Optimization
```bash
npm run build
# Note the bundle size and warnings
```

### After Optimization
```bash
npm run build
# Compare bundle sizes
# Open dist/stats.html to visualize bundle
```

### Test Performance
```bash
# 1. Run production preview
npm run preview

# 2. Open Chrome DevTools
# 3. Go to Lighthouse tab
# 4. Run audit for Mobile
```

## 🎯 Quick Wins (1 Hour)

### 1. Remove Duplicate Animation Libraries
Choose ONE animation library:

**Option A: Keep GSAP (recommended for complex animations)**
```bash
npm uninstall framer-motion
# Update components to use GSAP only
```

**Option B: Keep Framer Motion (simpler API)**
```bash
npm uninstall gsap
# Update components to use Framer Motion only
```

### 2. Optimize Images
```bash
# Install image optimization tools
npm install --save-dev @squoosh/cli

# Create optimization script in package.json
"scripts": {
  "optimize-images": "squoosh-cli --webp auto --mozjpeg auto src/assets/photos/*"
}

# Run optimization
npm run optimize-images
```

### 3. Implement React.memo for Heavy Components
```javascript
// src/components/RecipeTemplate.jsx
import { memo } from 'react'

const RecipeTemplate = memo(function RecipeTemplate({ recipe }) {
  // Component code
})

export default RecipeTemplate
```

### 4. Add Loading States
```javascript
// src/components/LazyImage.jsx
import { useState } from 'react'

function LazyImage({ src, alt, ...props }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {!loaded && <div className="image-skeleton" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{ display: loaded ? 'block' : 'none' }}
        {...props}
      />
    </>
  )
}
```

## 📈 Performance Targets

### Current State ❌
- Bundle Size: 1.36MB
- Load Time (4G): 3s
- FCP: 2.5s
- Lighthouse Score: ~45

### After Quick Wins ✅
- Bundle Size: <900KB (-34%)
- Load Time (4G): <2s
- FCP: <1.8s
- Lighthouse Score: 60+

### Final Target 🎯
- Bundle Size: <500KB
- Load Time (4G): <1.5s
- FCP: <1.2s
- Lighthouse Score: 85+

## 🔍 Monitoring

### 1. Bundle Size Check
Add to `package.json`:
```json
"scripts": {
  "analyze": "vite build && open dist/stats.html",
  "size-limit": "size-limit"
}
```

### 2. Create `.size-limit.json`:
```json
[
  {
    "path": "dist/js/vendor-react-*.js",
    "limit": "200 KB"
  },
  {
    "path": "dist/js/vendor-3d-*.js",
    "limit": "400 KB"
  },
  {
    "path": "dist/assets/*.css",
    "limit": "50 KB"
  }
]
```

### 3. Add CI Check (GitHub Actions)
```yaml
name: Performance Check
on: [push, pull_request]
jobs:
  size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run build
      - run: npx size-limit
```

## 🚀 Next Steps

1. **Week 1**: Implement all quick wins
2. **Week 2**: Add service worker for offline support
3. **Week 3**: Optimize render patterns with useMemo/useCallback
4. **Week 4**: Consider SSG with Next.js for better performance

## 📞 Support

If you need help with any optimization:
1. Check the full performance report: `performance-analysis-report.md`
2. Use the Performance Monitor component in development
3. Run Lighthouse audits regularly
4. Monitor real user metrics with Google Analytics

---

**Remember**: Performance is a feature. Every millisecond counts!