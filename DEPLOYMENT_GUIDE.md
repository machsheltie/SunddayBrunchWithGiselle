# Production Deployment Guide - Sunday Brunch with Giselle

**Last Updated:** 2026-01-09
**Platform:** Netlify
**Status:** Ready for Deployment ✅

---

## 🚀 Prerequisites

### Required Accounts
- [x] Netlify account (free tier sufficient)
- [x] ConvertKit account (for newsletter)
- [x] GitHub repository (for CI/CD)

### Required Tools
- [x] Node.js 18+ installed
- [x] npm or yarn package manager
- [x] Git for version control
- [x] Netlify CLI (optional, for local testing)

---

## 📋 Pre-Deployment Checklist

### Code Readiness
- [x] All tests passing (443/443 tests ✅)
- [x] Test coverage >85% (88.32% ✅)
- [x] No TypeScript errors
- [x] No ESLint warnings in new code
- [x] Production build completes successfully

### Security
- [x] No API keys in client-side code ✅
- [x] Environment variables documented
- [x] Serverless functions implemented
- [x] CORS configured correctly
- [x] Security headers configured

### Performance
- [x] Web Vitals monitoring integrated
- [x] Lighthouse CI configured
- [x] Performance budgets defined
- [ ] Bundle size optimized (<500KB target)
- [ ] Images optimized (WebP format)

### Accessibility
- [ ] Lighthouse Accessibility score 100
- [ ] axe DevTools scan completed (0 critical violations)
- [ ] Keyboard navigation tested
- [ ] Screen reader compatible (NVDA/JAWS)

---

## 🔧 Netlify Configuration

### Step 1: Create Netlify Site

**Via Netlify UI:**
1. Log in to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" as the provider
4. Authorize Netlify to access your repository
5. Select the "SundayBrunchWithGiselle" repository

**Build Settings:**
```yaml
Base directory: sunday-brunch-website
Build command: npm run build
Publish directory: sunday-brunch-website/dist
```

---

### Step 2: Configure Environment Variables

**In Netlify Dashboard:**
1. Go to Site settings → Build & deploy → Environment
2. Click "Add environment variable"
3. Add the following variables:

**Required Variables:**
```bash
# ConvertKit API Configuration
CONVERTKIT_API_KEY=<your_api_key_here>
CONVERTKIT_API_SECRET=<your_api_secret_here>
CONVERTKIT_FORM_ID=<your_form_id_here>

# Node Environment
NODE_VERSION=20

# Build Configuration
NODE_ENV=production
```

**Getting ConvertKit Credentials:**
1. Log in to [ConvertKit](https://app.convertkit.com/)
2. Go to Settings → Account → API secrets
3. Copy your API Key and API Secret
4. Go to Forms → Select your form → Copy Form ID from URL

---

### Step 3: Configure netlify.toml

The `netlify.toml` file should already exist in the repository root:

```toml
[build]
  base = "sunday-brunch-website"
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.convertkit.com;"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.woff2"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

### Step 4: Configure Custom Domain (Optional)

**If you have a custom domain:**

1. Go to Domain settings in Netlify
2. Click "Add custom domain"
3. Enter your domain (e.g., `sundaybruchwithgiselle.com`)
4. Follow DNS configuration instructions
5. Enable HTTPS (automatic via Let's Encrypt)

**DNS Configuration:**
```
Type: A
Host: @
Value: 75.2.60.5 (Netlify's load balancer)

Type: CNAME
Host: www
Value: your-site-name.netlify.app
```

---

## 🔐 Serverless Functions Configuration

### ConvertKit Subscription Function

The serverless function is already created at:
```
netlify/functions/subscribe.js
```

**Function Endpoint:**
```
https://your-site-name.netlify.app/.netlify/functions/subscribe
```

**Test Function Locally:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run development server with functions
netlify dev

# Test function
curl -X POST http://localhost:8888/.netlify/functions/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

---

## 🧪 Pre-Deployment Testing

### Local Production Build

```bash
# Navigate to project directory
cd sunday-brunch-website

# Install dependencies
npm ci

# Run tests
npm test

# Build production bundle
npm run build

# Preview production build
npm run preview

# Open http://localhost:4173 in browser
```

### Test Critical Paths

1. **Homepage:** Load and verify hero section
2. **Newsletter Signup:** Test form submission (use test email)
3. **Recipe Pages:** Navigate to recipe detail pages
4. **Search:** Test search functionality
5. **Filters:** Test recipe filtering
6. **Mobile:** Test on mobile viewport

---

## 🚀 Deployment Process

### Option 1: Automatic Deploy (Git Push)

**Netlify auto-deploys on push to main:**

```bash
# Make sure all changes are committed
git add .
git commit -m "chore: prepare for production deployment"

# Push to main branch
git push origin main

# Netlify will automatically:
# 1. Pull latest code
# 2. Install dependencies
# 3. Run build command
# 4. Deploy to production
```

**Monitor Deployment:**
- Go to Netlify dashboard → Deploys
- Watch real-time build logs
- Deployment typically takes 2-3 minutes

---

### Option 2: Manual Deploy (Netlify CLI)

```bash
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link project to Netlify site
netlify link

# Build production bundle
npm run build

# Deploy to production
netlify deploy --prod

# Confirm deployment URL
```

---

### Option 3: Deploy from Netlify UI

1. Go to Netlify dashboard
2. Navigate to Deploys tab
3. Click "Trigger deploy" → "Deploy site"
4. Wait for build to complete

---

## 🔍 Post-Deployment Verification

### Automated Checks

**Lighthouse CI:**
- Automatically runs on production URL
- Check GitHub Actions for results
- Target scores: Performance >90, Accessibility 100

**Web Vitals:**
- Open production site
- Check browser console for Web Vitals logs
- Data will flow to analytics

### Manual Checks

**Critical Functionality:**
- [ ] Homepage loads correctly
- [ ] Newsletter signup works (test with real email)
- [ ] Recipe pages render correctly
- [ ] Search functionality works
- [ ] Filters work correctly
- [ ] Images load properly
- [ ] Navigation works
- [ ] Mobile responsive

**Performance:**
- [ ] Load time <3s on 3G
- [ ] LCP <2.5s
- [ ] No layout shifts
- [ ] Smooth animations

**Security:**
- [ ] HTTPS enabled (green padlock)
- [ ] No mixed content warnings
- [ ] Security headers present (check browser DevTools)
- [ ] No API keys visible in source code

**Accessibility:**
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Alt text on images
- [ ] ARIA labels present

---

## 📊 Monitoring Setup

### Web Vitals Dashboard

**View Metrics:**
1. Go to analytics dashboard (when integrated)
2. Navigate to "web_vitals" event
3. Monitor:
   - LCP (target: <2.5s)
   - FID (target: <100ms)
   - CLS (target: <0.1)

**Alert Thresholds:**
- Warning: Any metric in "needs improvement" range
- Critical: Any metric in "poor" range

---

### Netlify Analytics (Optional)

**Enable Netlify Analytics:**
1. Go to Netlify dashboard → Analytics
2. Click "Enable analytics"
3. Cost: $9/month (optional)

**Metrics Tracked:**
- Page views
- Unique visitors
- Top pages
- Not found (404) pages
- Bandwidth usage

---

### Error Monitoring (Future)

**Recommended:** Sentry integration
```bash
npm install @sentry/react @sentry/vite-plugin
```

**Configuration** (Post-Sprint 3):
```javascript
Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
  integrations: [new BrowserTracing()],
  tracesSampleRate: 0.1,
});
```

---

## 🔄 Continuous Deployment Workflow

### Standard Workflow

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes and test locally
npm test
npm run build
npm run preview

# 3. Commit changes
git add .
git commit -m "feat: add new feature"

# 4. Push to GitHub
git push origin feature/new-feature

# 5. Create Pull Request
# - Lighthouse CI runs automatically
# - Review test results
# - Merge when approved

# 6. Merge to main
# - Auto-deploys to production
# - Monitor deployment in Netlify
# - Verify production site
```

---

## 🚨 Rollback Procedure

### If Deployment Fails

**Option 1: Rollback in Netlify UI**
1. Go to Netlify dashboard → Deploys
2. Find last successful deployment
3. Click "..." → "Publish deploy"
4. Site reverts to previous version instantly

**Option 2: Revert Git Commit**
```bash
# Find problematic commit
git log --oneline

# Revert commit
git revert <commit-hash>

# Push revert
git push origin main

# Netlify auto-deploys reverted version
```

---

## 🐛 Troubleshooting

### Build Fails

**Common Issues:**
```bash
# Missing dependencies
npm ci  # Use clean install

# Environment variables missing
# Check Netlify dashboard → Environment

# Node version mismatch
# Set NODE_VERSION in netlify.toml

# Memory issues
# Increase build resources in Netlify settings
```

### Function Errors

**Debug Serverless Function:**
```bash
# Check function logs
netlify functions:log subscribe

# Test locally
netlify dev

# Verify environment variables
# Netlify dashboard → Functions → Environment
```

### 404 Errors on Refresh

**Fix:** Already configured in netlify.toml
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 📈 Performance Optimization (Post-Deploy)

### Step 1: Measure Baseline

```bash
# Run Lighthouse audit
lighthouse https://your-site.netlify.app --view

# Check bundle size
npm run build -- --analyze
```

### Step 2: Optimize

**High Priority:**
- [ ] Enable image optimization (Netlify Image CDN)
- [ ] Remove unused dependencies
- [ ] Code splitting for large components
- [ ] Enable Brotli compression

**Medium Priority:**
- [ ] Optimize fonts (subset, preload)
- [ ] Lazy load images below fold
- [ ] Reduce JavaScript bundle size
- [ ] Minify CSS

---

## 🔒 Security Best Practices

### Headers (Already Configured)
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Referrer-Policy: strict-origin-when-cross-origin
- ✅ Content-Security-Policy (configured)

### Additional Security
- [ ] Enable DNSSEC (if custom domain)
- [ ] Configure rate limiting (Netlify Edge)
- [ ] Set up DDoS protection
- [ ] Regular security audits

---

## 📋 Deployment Checklist

### Pre-Deployment
- [x] All tests passing (443/443)
- [x] Test coverage >85% (88.32%)
- [x] Build completes successfully
- [x] Environment variables documented
- [ ] Performance budget verified
- [ ] Accessibility audit complete

### Deployment
- [ ] Netlify site created
- [ ] Environment variables configured
- [ ] Custom domain configured (optional)
- [ ] HTTPS enabled
- [ ] Deploy successful

### Post-Deployment
- [ ] Homepage loads correctly
- [ ] Newsletter signup works
- [ ] All pages accessible
- [ ] Lighthouse scores meet targets
- [ ] Web Vitals monitoring active
- [ ] Error monitoring configured (optional)

---

## 🎯 Success Criteria

**Ready to Deploy:** Yes ✅

**Target Metrics:**
- Load Time: <3s on 3G
- Lighthouse Performance: >90
- Lighthouse Accessibility: 100
- Web Vitals: All "Good" (75th percentile)
- Uptime: 99.9%

**Next Steps After Deployment:**
1. Monitor Web Vitals for 24 hours
2. Run full Lighthouse audit
3. Gather user feedback
4. Optimize based on real data

---

## 📞 Support & Resources

### Netlify Docs
- [Deploy Guide](https://docs.netlify.com/site-deploys/overview/)
- [Serverless Functions](https://docs.netlify.com/functions/overview/)
- [Environment Variables](https://docs.netlify.com/environment-variables/overview/)

### Project Docs
- PERFORMANCE_BUDGETS.md
- ACCESSIBILITY_TESTING_GUIDE.md
- SPRINT_3_RETROSPECTIVE.md

**Ready to Deploy! 🚀**
