# Performance Budgets - Sunday Brunch with Giselle

**Last Updated:** 2026-01-09
**Status:** Active Monitoring
**Target Lighthouse Score:** 90+

---

## 🎯 Core Web Vitals Targets

### Largest Contentful Paint (LCP)
**Target:** <2.5 seconds
**What it measures:** Loading performance - time until largest content element renders

- **Good:** 0-2.5s ✅
- **Needs Improvement:** 2.5-4.0s ⚠️
- **Poor:** >4.0s ❌

**Current Optimizations:**
- Code splitting with React.lazy()
- Critical CSS inlined
- Images optimized with lazy loading
- Hero images preloaded

---

### First Input Delay (FID)
**Target:** <100 milliseconds
**What it measures:** Interactivity - time from user interaction to browser response

- **Good:** 0-100ms ✅
- **Needs Improvement:** 100-300ms ⚠️
- **Poor:** >300ms ❌

**Current Optimizations:**
- Minimal main thread blocking
- Long tasks broken into smaller chunks
- Event handlers debounced/throttled
- Heavy computations moved to Web Workers (if needed)

---

### Cumulative Layout Shift (CLS)
**Target:** <0.1
**What it measures:** Visual stability - unexpected layout shifts

- **Good:** 0-0.1 ✅
- **Needs Improvement:** 0.1-0.25 ⚠️
- **Poor:** >0.25 ❌

**Current Optimizations:**
- Image dimensions specified (width/height)
- Font loading optimized (font-display: swap)
- Skeleton loaders for dynamic content
- Reserved space for ads/embeds

---

### First Contentful Paint (FCP)
**Target:** <1.8 seconds
**What it measures:** Perceived load speed - time to first content render

- **Good:** 0-1.8s ✅
- **Needs Improvement:** 1.8-3.0s ⚠️
- **Poor:** >3.0s ❌

---

### Time to First Byte (TTFB)
**Target:** <800 milliseconds
**What it measures:** Server response time

- **Good:** 0-800ms ✅
- **Needs Improvement:** 800-1800ms ⚠️
- **Poor:** >1800ms ❌

**Current Optimizations:**
- Netlify CDN for static assets
- Serverless functions for dynamic content
- Caching headers configured
- DNS prefetch for third-party domains

---

## 📦 Resource Size Budgets

### JavaScript
**Budget:** <500KB total (gzipped)
**Current:** TBD

**Breakdown:**
- Vendor bundles: <300KB
- Application code: <150KB
- Lazy-loaded chunks: <50KB each

**Optimizations:**
- Tree shaking enabled
- Code splitting by route
- Dynamic imports for heavy features
- Minification + compression

---

### CSS
**Budget:** <50KB total (gzipped)
**Current:** TBD

**Optimizations:**
- CSS modules for component styles
- Critical CSS inlined
- Unused CSS removed
- Minification + compression

---

### Images
**Budget:** <1MB per page
**Current:** TBD

**Optimizations:**
- WebP format with JPEG fallback
- Responsive images (srcset)
- Lazy loading below the fold
- Image CDN with automatic optimization

---

### Fonts
**Budget:** <100KB total
**Current:** TBD

**Optimizations:**
- WOFF2 format only
- Subset fonts (Latin characters only)
- Preload critical fonts
- font-display: swap for FOUT

---

### Total Page Weight
**Budget:** <2MB per page
**Current:** TBD

**Note:** First page load should be <500KB (critical resources only)

---

## ⚡ Performance Metrics Targets

### Lighthouse Scores
- **Performance:** >90 ✅
- **Accessibility:** 100 ✅
- **Best Practices:** >90 ✅
- **SEO:** >90 ✅

### Page Load Metrics
- **Speed Index:** <3.4s
- **Time to Interactive (TTI):** <3.8s
- **Total Blocking Time (TBT):** <300ms

### Network Metrics
- **Total Requests:** <50 per page
- **DNS Lookup:** <150ms
- **TLS Handshake:** <200ms

---

## 📊 Monitoring & Alerts

### Real User Monitoring (RUM)
- Web Vitals tracked via analytics
- 75th percentile metrics reported
- Alerts triggered for poor scores

### Synthetic Monitoring
- Lighthouse CI runs on every PR
- Daily Lighthouse audits in production
- Performance regression detection

### Alert Thresholds
- **Warning:** Any metric in "Needs Improvement" range
- **Critical:** Any metric in "Poor" range
- **Action Required:** Lighthouse score drops below 85

---

## 🔧 Optimization Checklist

### Completed ✅
- [x] Code splitting with React.lazy()
- [x] Web Vitals monitoring integrated
- [x] Lighthouse CI configured
- [x] Performance budgets defined

### In Progress 🔄
- [ ] Image optimization pipeline
- [ ] Font subsetting
- [ ] Service Worker for caching
- [ ] Resource hints (preload, prefetch)

### Planned 📋
- [ ] WebP image conversion
- [ ] HTTP/2 server push
- [ ] Critical CSS automation
- [ ] Bundle analyzer integration

---

## 📈 Performance Testing Strategy

### Local Testing
```bash
# Build production bundle
npm run build

# Analyze bundle size
npm run build -- --analyze

# Run Lighthouse locally
lighthouse http://localhost:4173 --view

# Test with throttling (3G)
lighthouse http://localhost:4173 --throttling-method=simulate --throttling.cpuSlowdownMultiplier=4
```

### CI/CD Testing
- Lighthouse CI runs on every PR
- Performance regression detection
- Automatic PR comments with scores

### Production Monitoring
- Real User Monitoring (RUM) via Web Vitals
- Daily synthetic checks
- Alert on performance degradation

---

## 🎯 Success Criteria

### Sprint 3 Targets
- ✅ Web Vitals monitoring active
- ✅ Lighthouse CI configured
- ⏳ All Core Web Vitals in "Good" range (75th percentile)
- ⏳ Lighthouse Performance score >90
- ⏳ No performance regressions in CI

### Long-Term Goals
- Maintain Lighthouse Performance >95
- All Core Web Vitals consistently "Good"
- Page load time <2s on 4G
- Time to Interactive <3s

---

## 📚 References

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Performance Budgets](https://web.dev/performance-budgets-101/)
- [Core Web Vitals Guide](https://web.dev/vitals-measurement-getting-started/)
