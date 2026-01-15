# CI/CD Quick Reference Guide
## Sunday Brunch with Giselle

**Purpose:** Quick lookup for CI/CD commands, status, and procedures
**Last Updated:** January 15, 2026

---

## Current Status Dashboard

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| **Pipeline Score** | 42/100 | 80/100 | ❌ FAILING |
| **Test Pass Rate** | 96.8% (699/722) | 100% | ❌ CRITICAL |
| **Failing Tests** | 23 | 0 | ❌ CRITICAL |
| **Security Headers** | 4/8 | 8/8 | ❌ CRITICAL |
| **Bundle Size** | 855KB (3vendor) | <500KB | ❌ CRITICAL |
| **Staging Env** | None | ✅ Required | ❌ MISSING |
| **Monitoring** | None | ✅ Required | ❌ MISSING |
| **E2E Tests** | None | 10+ paths | ❌ MISSING |

**Overall Status:** ❌ NOT READY FOR PRODUCTION

---

## Critical Issues (Must Fix)

### Issue 1: 23 Failing Tests
**Priority:** 🔴 CRITICAL
**Impact:** Deployment blocked
**Fix Time:** 2-3 hours
**Status:** Ready to fix

```bash
# Current state
npm test
# Output: 23 failed | 699 passed

# Files with failures:
# - src/tests/pages/Home.test.jsx (20 failures)
# - src/contexts/AuthContext.test.jsx (1 failure)
# - src/components/StarRating.test.jsx (2 failures)

# Root cause:
# - React Router context null in Home tests
# - Async timeout in Auth signup
# - DOM element selection in StarRating

# How to fix:
# See CICD_IMPLEMENTATION_GUIDE.md → Task 1.1
```

### Issue 2: Missing Security Headers
**Priority:** 🔴 CRITICAL
**Impact:** Security vulnerabilities
**Fix Time:** 30 minutes
**Status:** Ready to deploy

```bash
# Current headers (4 of 8):
✅ X-Frame-Options
✅ X-XSS-Protection
✅ X-Content-Type-Options
✅ Referrer-Policy

❌ Content-Security-Policy (MISSING)
❌ Strict-Transport-Security (MISSING)
❌ Permissions-Policy (MISSING)
❌ X-Permitted-Cross-Domain-Policies (MISSING)

# How to fix:
# See netlify.toml - update headers section
# See CICD_IMPLEMENTATION_GUIDE.md → Task 1.2
```

### Issue 3: Bundle Size Warning (Three.js)
**Priority:** 🟠 HIGH
**Impact:** Performance degradation
**Fix Time:** 1-2 hours
**Status:** Ready to implement

```bash
# Current problem:
# - three-vendor chunk: 855KB (exceeds 500KB limit)
# - Loaded on ALL pages
# - Only used on Alchemy Lab page

# Impact:
# - Slower initial load for 95% of users
# - Larger bundle = slower Time to Interactive

# Solution:
# - Lazy-load Three.js only on Alchemy Lab page
# - Reduces main bundle by ~230KB
# - Performance improvement: +10-15 Lighthouse points

# How to fix:
# See CICD_IMPLEMENTATION_GUIDE.md → Task 2.1
```

---

## Quick Command Reference

### Testing
```bash
# Run all tests
cd sunday-brunch-website
npm test

# Run specific test file
npm test -- src/tests/pages/Home.test.jsx

# Run with coverage
npm test:coverage

# Run with UI
npm test -- --ui

# Fix failing tests
npm test -- --reporter=verbose
# Then apply fixes from CICD_IMPLEMENTATION_GUIDE.md
```

### Build & Deploy
```bash
# Production build (21 seconds)
npm run build

# Preview production locally
npm run preview

# Deploy to production (automatic)
git push origin main
# Netlify auto-deploys

# Check deploy status
# https://app.netlify.com/sites/calm-centaur-ad0abf/deploys
```

### Security Checks
```bash
# Audit dependencies
npm audit

# Auto-fix vulnerabilities
npm audit fix

# Check security headers
curl -I https://calm-centaur-ad0abf.netlify.app | grep -i 'strict-transport'

# Use online scanner
# https://securityheaders.com
```

### Performance Analysis
```bash
# Bundle analysis
npm run build 2>&1 | grep "\.js"

# Lighthouse audit locally
lighthouse https://calm-centaur-ad0abf.netlify.app --view

# Check Web Vitals
# 1. Visit https://calm-centaur-ad0abf.netlify.app
# 2. Open browser DevTools → Console
# 3. Look for Web Vitals logs
```

### Rollback Procedures
```bash
# Method 1: Via Git (Preferred)
git log --oneline | head -5
git revert <commit-hash>
git push origin main
# Wait 2-3 minutes for Netlify to deploy

# Method 2: Via Netlify UI
# 1. Go to https://app.netlify.com
# 2. Select site → Deploys
# 3. Find last good deployment
# 4. Click "..." → "Publish deploy"
# Recovery time: 30 seconds

# Method 3: Revert to Previous Commit
git reset --hard origin/main~1
git push --force origin main
# Last resort only (causes history issue)
```

---

## File Locations Reference

### Configuration Files
```
netlify.toml                               → Netlify config (build, headers, functions)
sunday-brunch-website/vite.config.js       → Vite build config
sunday-brunch-website/vitest.config.js     → Test config
sunday-brunch-website/lighthouserc.json    → Lighthouse CI config
```

### Test Files
```
sunday-brunch-website/src/tests/            → Test files
sunday-brunch-website/e2e/                  → E2E tests (to create)
```

### CI/CD Workflows
```
.github/workflows/lighthouse-ci.yml         → Lighthouse CI (existing)
.github/workflows/test.yml                  → Unit tests (to create)
.github/workflows/security.yml              → Security scanning (to create)
.github/workflows/e2e.yml                   → E2E tests (to create)
```

### Documentation
```
CICD_DEVOPS_ASSESSMENT.md                   → Full assessment report
CICD_IMPLEMENTATION_GUIDE.md                → Step-by-step implementation
CICD_QUICK_REFERENCE.md                     → This file
DEPLOYMENT_GUIDE.md                         → Netlify deployment guide
ROLLBACK_PROCEDURE.md                       → Rollback procedures
SECURITY.md                                 → Security implementation details
```

---

## Implementation Checklist

### Phase 1: Critical (Week 1) - MUST DO
- [ ] Fix 23 failing tests (2-3 hours)
  - [ ] Home.test.jsx: React Router context
  - [ ] AuthContext.test.jsx: Async signup
  - [ ] StarRating.test.jsx: Element selection
  - [ ] Run `npm test` → verify 722/722 pass

- [ ] Add critical security headers (30 min)
  - [ ] Update netlify.toml with CSP, HSTS, etc.
  - [ ] Test headers with curl
  - [ ] Verify in production

- [ ] Add test execution gate (2 hours)
  - [ ] Create .github/workflows/test.yml
  - [ ] Verify tests run on PR
  - [ ] Block merge if tests fail

- [ ] Document rollback procedure (1 hour)
  - [ ] Create ROLLBACK_PROCEDURE.md
  - [ ] Document both methods
  - [ ] Share with team

### Phase 2: High Priority (Week 2) - IMPLEMENT SOON
- [ ] Optimize Three.js bundle (1-2 hours)
  - [ ] Lazy-load on Alchemy Lab only
  - [ ] Verify <500KB chunks
  - [ ] Test performance improvement

- [ ] Add security scanning (1 hour)
  - [ ] Create .github/workflows/security.yml
  - [ ] Configure npm audit
  - [ ] (Optional) Add Snyk integration

- [ ] Set up E2E tests (3-4 hours)
  - [ ] Install Playwright
  - [ ] Create test files (homepage, search, newsletter)
  - [ ] Add to CI pipeline
  - [ ] Verify tests pass

- [ ] Create staging environment (2 hours)
  - [ ] Option 1: Netlify branch deploy
  - [ ] Option 2: Separate Netlify site
  - [ ] Deploy develop branch to staging
  - [ ] Add approval gate before production

### Phase 3: Medium Priority (Week 3-4) - ENHANCE
- [ ] Implement error monitoring (Sentry)
- [ ] Add performance monitoring
- [ ] Implement SAST scanning
- [ ] Create Infrastructure as Code
- [ ] Update Node.js to version 20

---

## Deployment Workflow (After P1)

```
1. Create Feature Branch
   git checkout -b feature/my-feature

2. Make Changes & Test Locally
   npm test
   npm run build
   npm run preview

3. Commit & Push
   git add .
   git commit -m "feat: description"
   git push origin feature/my-feature

4. Create Pull Request
   - Tests run automatically ✅
   - Security scan runs ✅
   - Lighthouse CI runs ✅

5. Code Review
   - Peer review required
   - Approve changes

6. Merge to Develop
   - E2E tests run on staging ✅
   - Manual QA verification
   - Performance baseline check

7. Merge to Main
   - Auto-deploys to production
   - Health checks run
   - Monitoring alerts active

8. Post-Deployment
   - Monitor error rate <0.1%
   - Monitor performance metrics
   - Gather user feedback
```

---

## Performance Targets

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Lighthouse Performance | >90 | ~70-80 | ⚠️ |
| Lighthouse Accessibility | 100 | ~95 | ⚠️ |
| FCP (First Contentful Paint) | <1800ms | Unknown | ❓ |
| LCP (Largest Contentful Paint) | <2500ms | Unknown | ❓ |
| CLS (Cumulative Layout Shift) | <0.1 | Unknown | ❓ |
| Bundle Size (Gzip) | <500KB | 226KB (Three.js) | ⚠️ |
| Load Time (3G) | <3s | ~4-5s | ⚠️ |

**Action:** Optimize Three.js + monitor after deployment

---

## Security Checklist

Before EVERY production deployment:

- [ ] All 722 tests passing
- [ ] 8 security headers present
- [ ] npm audit clean (no high/critical)
- [ ] No API keys in source code
- [ ] Bundle size <500KB per chunk
- [ ] Staging environment tested
- [ ] E2E tests passing
- [ ] Lighthouse score >85
- [ ] All monitoring configured
- [ ] Team notified of deployment

---

## Troubleshooting

### Tests Failing
```bash
# See what's failing
npm test -- --reporter=verbose

# Check specific test file
npm test -- src/tests/pages/Home.test.jsx

# Clear cache and retry
rm -rf node_modules/.vite
npm test

# See detailed error
npm test 2>&1 | grep -A 10 "FAIL"
```

### Build Fails
```bash
# Check dependencies
npm ci

# Clean and rebuild
rm -rf dist
npm run build

# See detailed error
npm run build 2>&1 | head -50
```

### Deployment Stuck
```bash
# Check Netlify deploy status
# https://app.netlify.com/sites/calm-centaur-ad0abf/deploys

# View build logs
# Click on build → View logs

# Common issues:
# 1. Environment variables missing → Add to Netlify dashboard
# 2. Node version mismatch → Update NODE_VERSION in netlify.toml
# 3. Memory limit → Increase build resources
# 4. Timeout → Optimize build process
```

### Rollback Needed
```bash
# Method 1: Git revert
git log --oneline | head -5
git revert <bad-commit>
git push origin main

# Method 2: Netlify UI (instant)
# https://app.netlify.com → Deploys → Find good version → Publish

# Verify rollback
# Check site loads
# Test critical features
# Verify no errors in logs
```

---

## Important URLs

| Service | URL |
|---------|-----|
| **Production Site** | https://calm-centaur-ad0abf.netlify.app |
| **Netlify Dashboard** | https://app.netlify.com |
| **GitHub Repository** | https://github.com/[user]/SundayBrunchWithGiselle |
| **Lighthouse CI Config** | sunday-brunch-website/lighthouserc.json |
| **Security Headers Checker** | https://securityheaders.com |
| **Bundle Analyzer** | npm run build (check output) |

---

## Key Contacts

| Role | Action | Frequency |
|------|--------|-----------|
| **On-Call** | Be available for incidents | During business hours |
| **Release Manager** | Approve production deploys | Before merging to main |
| **Security Lead** | Review security headers | Monthly |
| **DevOps** | Monitor infrastructure | 24/7 |

---

## Monthly Checklist

Every month, perform:

- [ ] Rollback procedure test
- [ ] Security headers validation
- [ ] Dependency update review
- [ ] Performance baseline check
- [ ] Error rate review (should be <0.1%)
- [ ] Uptime verification (should be >99.9%)
- [ ] Cost analysis
- [ ] Incident postmortem (if any)

---

## Resources

### Documentation
- CICD_DEVOPS_ASSESSMENT.md - Full assessment
- CICD_IMPLEMENTATION_GUIDE.md - Implementation steps
- DEPLOYMENT_GUIDE.md - Netlify deployment
- ROLLBACK_PROCEDURE.md - Rollback steps
- SECURITY.md - Security details

### Tools
- Netlify: https://app.netlify.com
- GitHub Actions: https://github.com/[user]/SundayBrunchWithGiselle/actions
- Lighthouse CI: https://github.com/GoogleChrome/lighthouse-ci

### Learning
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Netlify Deployment Docs](https://docs.netlify.com/)
- [Playwright Testing](https://playwright.dev/)
- [Vite Documentation](https://vitejs.dev/)

---

## Summary

**Current Status:** 42/100 - FAILING (Not ready for production)

**Blockers:**
1. ❌ 23 failing tests
2. ❌ Missing security headers
3. ❌ No test execution gate
4. ❌ No staging environment

**Timeline to Production:**
- **Week 1:** Fix critical issues (P0)
- **Week 2:** Implement safeguards (P1)
- **Week 3-4:** Add observability (P2)

**After P0 completion:** Safe to deploy to production
**After P1 completion:** Confident deployments with safeguards
**After P2 completion:** Automatic issue detection and alerting

---

**Last Updated:** January 15, 2026
**Next Review:** After P0 implementation
**Maintained By:** Claude Code - DevOps Engineer
