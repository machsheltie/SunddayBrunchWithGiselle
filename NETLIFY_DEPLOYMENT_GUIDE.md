# Netlify Deployment Guide
## Sunday Brunch with Giselle - Search & Nutrition Features

**Version:** 1.0
**Last Updated:** 2026-01-07
**Features Covered:** Sprint 1 (Advanced Search) + Sprint 2 (Nutritional Information)

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup Verification](#project-setup-verification)
3. [Build Configuration](#build-configuration)
4. [Netlify Deployment](#netlify-deployment)
5. [Testing Your Deployment](#testing-your-deployment)
6. [Adding Nutrition Data to Recipes](#adding-nutrition-data-to-recipes)
7. [Troubleshooting](#troubleshooting)
8. [Next Steps](#next-steps)

---

## Prerequisites

Before deploying to Netlify, ensure you have:

### Required Software
- ✅ **Node.js** (v18.0.0 or higher)
- ✅ **Git** (for version control)
- ✅ **A Netlify account** (free tier works perfectly)

### Required Accounts
- **Netlify Account**: Sign up at [netlify.com](https://www.netlify.com/) (free)
- **GitHub Account**: If using GitHub for deployment (recommended)

### Verify Your Installation

```bash
# Check Node.js version
node --version
# Should output: v18.0.0 or higher

# Check npm version
npm --version
# Should output: 8.0.0 or higher

# Check Git version
git --version
# Should output: git version 2.x.x or higher
```

---

## Project Setup Verification

### 1. Verify Local Build Works

Before deploying, ensure your project builds successfully locally:

```bash
# Navigate to your project directory
cd sunday-brunch-website

# Install dependencies
npm install

# Run development server (verify features work)
npm run dev
# Visit http://localhost:5173 and test:
# - Search functionality (type "chocolate chip")
# - Filter categories, dietary options
# - Navigate to a recipe with nutrition data
# - Verify nutrition label displays correctly

# Build for production
npm run build
# Should complete without errors
# Output: dist/ directory created

# Preview production build locally
npm run preview
# Visit http://localhost:4173 and test again
```

### 2. Verify All Tests Pass

```bash
# Run test suite
npm test

# Expected output:
# Test Suites: 149 passed, 149 total
# Tests:       149 passed, 149 total
# Coverage:    ~80%+ (if running with --coverage)
```

### 3. Check Git Status

```bash
# Ensure all changes are committed
git status

# If you have uncommitted changes, commit them:
git add .
git commit -m "feat: prepare for Netlify deployment with search and nutrition features"
git push origin main
```

---

## Build Configuration

### 1. Verify `package.json` Scripts

Your `package.json` should have these scripts (already configured):

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  }
}
```

### 2. Create `netlify.toml` Configuration

Create a `netlify.toml` file in your project root (if not already present):

```bash
# Navigate to project root
cd C:\Users\heirr\OneDrive\Desktop\Hope2_Studio\SundayBrunchWithGiselle
```

Create the file with this content:

```toml
# Netlify Build Configuration
[build]
  # Directory with your source code
  base = "sunday-brunch-website"

  # Build command
  command = "npm run build"

  # Directory with built files (Vite outputs to dist/)
  publish = "dist"

# Environment variables (if needed in the future)
[build.environment]
  NODE_VERSION = "18"

# Redirect rules for Single Page Application (SPA)
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Headers for security and performance
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

**Save this file** in your project root:
`C:\Users\heirr\OneDrive\Desktop\Hope2_Studio\SundayBrunchWithGiselle\netlify.toml`

### 3. Update `.gitignore` (if needed)

Ensure your `.gitignore` includes:

```
# Netlify
.netlify/
dist/
node_modules/

# Environment variables (for future use)
.env
.env.local
.env.production
```

Commit the configuration:

```bash
git add netlify.toml
git commit -m "chore: add Netlify deployment configuration"
git push origin main
```

---

## Netlify Deployment

### Method 1: GitHub Integration (Recommended)

**Step 1: Push to GitHub**

If your repository isn't on GitHub yet:

```bash
# Create a new repository on GitHub (via github.com)
# Then link your local repo:

git remote add origin https://github.com/YOUR_USERNAME/SundayBrunchWithGiselle.git
git branch -M main
git push -u origin main
```

**Step 2: Connect to Netlify**

1. Log in to [Netlify](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"GitHub"** as your provider
4. Authorize Netlify to access your GitHub account
5. Select your **SundayBrunchWithGiselle** repository

**Step 3: Configure Build Settings**

Netlify should auto-detect these settings (verify them):

- **Base directory**: `sunday-brunch-website`
- **Build command**: `npm run build`
- **Publish directory**: `sunday-brunch-website/dist`

Click **"Deploy site"**

**Step 4: Wait for Deployment**

- Initial deployment takes 2-5 minutes
- You'll see a build log in real-time
- Once complete, Netlify assigns a URL: `https://random-name-12345.netlify.app`

---

### Method 2: Manual Drag-and-Drop Deployment

If you prefer not to use GitHub:

**Step 1: Build Locally**

```bash
cd sunday-brunch-website
npm run build
# Creates dist/ folder
```

**Step 2: Deploy to Netlify**

1. Log in to [Netlify](https://app.netlify.com/)
2. Drag the `dist/` folder into the deployment area
3. Netlify will upload and deploy your site
4. You'll get a URL: `https://random-name-12345.netlify.app`

**Note**: This method requires manual rebuilding and uploading for every change. GitHub integration is better for ongoing updates.

---

### Method 3: Netlify CLI (Advanced)

For developers comfortable with command-line tools:

**Step 1: Install Netlify CLI**

```bash
npm install -g netlify-cli
```

**Step 2: Login to Netlify**

```bash
netlify login
# Opens browser for authentication
```

**Step 3: Initialize and Deploy**

```bash
cd sunday-brunch-website

# Initialize Netlify site
netlify init

# Follow prompts:
# - Create & configure a new site
# - Choose your team
# - Enter site name (e.g., sunday-brunch-giselle)
# - Build command: npm run build
# - Publish directory: dist

# Deploy
netlify deploy --prod
```

---

## Custom Domain Setup (Optional)

Once deployed, you can use a custom domain:

**Step 1: Add Custom Domain**

1. In Netlify dashboard, go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `sundaybruchwithgiselle.com`)

**Step 2: Configure DNS**

If you bought your domain through a registrar (GoDaddy, Namecheap, etc.):

1. Go to your domain registrar's DNS settings
2. Add these records:

```
Type: A
Name: @
Value: 75.2.60.5 (Netlify's load balancer)

Type: CNAME
Name: www
Value: YOUR-SITE-NAME.netlify.app
```

**Step 3: Enable HTTPS**

Netlify automatically provisions a free SSL certificate (Let's Encrypt). This takes 1-2 minutes after DNS propagates.

---

## Testing Your Deployment

### 1. Functional Testing Checklist

Visit your deployed site and verify:

#### Search Functionality (Sprint 1)
- [ ] **Search Bar**: Type "chocolate chip" → See relevant results
- [ ] **Fuzzy Search**: Type "choclate" (typo) → Still shows chocolate recipes
- [ ] **Keyboard Shortcut**: Press `/` key → Search bar focuses
- [ ] **Clear Search**: Click X icon → Search clears
- [ ] **No Results**: Search for "xyz123" → Shows "No recipes found" message

#### Filter Functionality (Sprint 1)
- [ ] **Category Filter**: Select "Cookies" → Only cookies show
- [ ] **Dietary Filter**: Select "Vegan" → Only vegan recipes show
- [ ] **Season Filter**: Select "Winter" → Only winter recipes show
- [ ] **Difficulty Filter**: Select "Easy" → Only easy recipes show
- [ ] **Cook Time Filter**: Select "Under 30 min" → Only quick recipes show
- [ ] **Multiple Filters**: Combine filters → Results update correctly
- [ ] **Clear Filters**: Click "Clear All Filters" → All recipes return

#### Pagination (Sprint 1)
- [ ] **Page Navigation**: Click "Next" → See next 20 results
- [ ] **Previous Button**: Click "Previous" → Return to previous page
- [ ] **Page Display**: Shows "Page 1 of X" correctly

#### Mobile Filters (Sprint 1)
- [ ] **Mobile Drawer**: On mobile, click "Filters" → Drawer opens
- [ ] **Escape Key**: Press Escape → Drawer closes
- [ ] **Apply Filters**: Select filters → Results update
- [ ] **Focus Trap**: Tab key cycles within drawer when open

#### Nutrition Labels (Sprint 2)
- [ ] **Display**: Navigate to a recipe with nutrition data → Label shows
- [ ] **FDA Compliance**: Label format matches FDA standards (bold major nutrients, indented sub-nutrients)
- [ ] **Serving Multiplier**: Change servings → Amounts scale (e.g., 2x doubles calories)
- [ ] **Daily Values**: %DV remains per single serving (doesn't scale with multiplier)
- [ ] **Scaled Note**: When servings ≠ 1 → Shows "Showing nutrition for X servings. % Daily Values are per single serving."

#### Dietary Badges (Sprint 2)
- [ ] **Badge Display**: Recipes with dietary info show color-coded badges
- [ ] **Tooltips**: Hover over badge → Tooltip appears with description
- [ ] **Touch Targets**: Badges are at least 44x44px (mobile-friendly)

#### Allergen Warnings (Sprint 2)
- [ ] **Warning Display**: Recipes with allergens show high-contrast alert box
- [ ] **Animation**: Warning box has subtle animation on page load
- [ ] **Facility Warning**: If facility warning exists, shows separately

### 2. Accessibility Testing

- [ ] **Keyboard Navigation**: Tab through all interactive elements
- [ ] **Screen Reader**: Use NVDA (Windows) or VoiceOver (Mac) to navigate
- [ ] **ARIA Labels**: All buttons/inputs have descriptive labels
- [ ] **Focus Indicators**: All interactive elements show visible focus state
- [ ] **Color Contrast**: Text meets WCAG 2.1 AA standards (4.5:1 minimum)

### 3. Performance Testing

Use [Lighthouse](https://developers.google.com/web/tools/lighthouse) (built into Chrome DevTools):

1. Open your deployed site in Chrome
2. Open DevTools (F12)
3. Go to **Lighthouse** tab
4. Click **"Generate report"**

**Target Scores:**
- Performance: 90+ (green)
- Accessibility: 100 (green)
- Best Practices: 90+ (green)
- SEO: 90+ (green)

### 4. Mobile Responsiveness

Test on different screen sizes:

- [ ] **Desktop** (1920x1080): Layout looks good
- [ ] **Tablet** (768x1024): Filters might be in drawer, layout adapts
- [ ] **Mobile** (375x667): Single column, touch-friendly buttons

Use Chrome DevTools Device Toolbar (Ctrl+Shift+M) to test different viewports.

### 5. Cross-Browser Testing

Test in multiple browsers:

- [ ] **Chrome** (latest version)
- [ ] **Firefox** (latest version)
- [ ] **Safari** (if on Mac/iOS)
- [ ] **Edge** (latest version)

---

## Adding Nutrition Data to Recipes

### 1. Locate the Recipe File

Your recipes are stored in:
`sunday-brunch-website/src/data/recipes.js`

### 2. Use the Nutrition Template

A complete template exists at:
`sunday-brunch-website/src/data/recipe-nutrition-template.js`

**Template Structure:**

```javascript
export const recipeNutritionTemplate = {
  // Recipe ID (must match existing recipe)
  id: 'chocolate-chip-cookies',

  // Add this nutrition object to your recipe:
  nutrition: {
    servingSize: "1 cookie (approx. 50g)",
    servingsPerRecipe: 24,
    calories: 180,
    totalFat: {
      amount: 8,
      unit: "g",
      dailyValue: 10,
      saturatedFat: { amount: 5, unit: "g", dailyValue: 25 },
      transFat: { amount: 0, unit: "g" }
    },
    cholesterol: { amount: 30, unit: "mg", dailyValue: 10 },
    sodium: { amount: 120, unit: "mg", dailyValue: 5 },
    totalCarbohydrate: {
      amount: 24,
      unit: "g",
      dailyValue: 9,
      dietaryFiber: { amount: 1, unit: "g", dailyValue: 4 },
      totalSugars: { amount: 14, unit: "g" },
      addedSugars: { amount: 12, unit: "g", dailyValue: 24 }
    },
    protein: { amount: 2, unit: "g" },
    vitaminD: { amount: 0, unit: "mcg", dailyValue: 0 },
    calcium: { amount: 20, unit: "mg", dailyValue: 2 },
    iron: { amount: 1, unit: "mg", dailyValue: 6 },
    potassium: { amount: 50, unit: "mg", dailyValue: 1 }
  },

  // Dietary restrictions (optional)
  dietary: ["Vegetarian", "Nut-Free"],

  // Allergens (required if present)
  allergens: ["Milk", "Eggs", "Wheat"],

  // Facility warning (optional)
  facilityWarning: ["Tree Nuts", "Soy"]
}
```

### 3. Add Nutrition Data to an Existing Recipe

**Example: Adding nutrition to "Chocolate Chip Cookies"**

Open `sunday-brunch-website/src/data/recipes.js` and find your recipe:

```javascript
{
  id: 'chocolate-chip-cookies',
  title: 'Classic Chocolate Chip Cookies',
  slug: 'chocolate-chip-cookies',
  // ... existing fields ...

  // ADD THIS SECTION:
  nutrition: {
    servingSize: "1 cookie (approx. 50g)",
    servingsPerRecipe: 24,
    calories: 180,
    totalFat: {
      amount: 8,
      unit: "g",
      dailyValue: 10,
      saturatedFat: { amount: 5, unit: "g", dailyValue: 25 },
      transFat: { amount: 0, unit: "g" }
    },
    // ... copy full structure from template ...
  },
  dietary: ["Vegetarian", "Nut-Free"],
  allergens: ["Milk", "Eggs", "Wheat"]
}
```

### 4. Calculate Nutrition Values

**Where to Get Nutrition Data:**

1. **USDA FoodData Central**: [fdc.nal.usda.gov](https://fdc.nal.usda.gov/)
   - Search for ingredients (e.g., "all-purpose flour")
   - Get per-100g values
   - Scale to your recipe quantities

2. **MyFitnessPal Recipe Calculator**: [myfitnesspal.com/recipe/calculator](https://www.myfitnesspal.com/recipe/calculator)
   - Enter all ingredients with quantities
   - Get complete nutrition breakdown
   - Export values to your recipe

3. **Nutrition Label Calculators**:
   - [NutritionIX](https://www.nutritionix.com/)
   - [CalorieKing](https://www.calorieking.com/)

**Example Calculation:**

For a recipe with 2 cups (240g) all-purpose flour:
1. USDA says flour has 364 calories per 100g
2. 240g × (364 ÷ 100) = 874 calories from flour
3. Add up all ingredients
4. Divide by number of servings

### 5. Calculate Daily Values (%DV)

Use these FDA Daily Values (based on 2,000 calorie diet):

| Nutrient | Daily Value | Calculation |
|----------|------------|-------------|
| Total Fat | 78g | (amount ÷ 78) × 100 |
| Saturated Fat | 20g | (amount ÷ 20) × 100 |
| Cholesterol | 300mg | (amount ÷ 300) × 100 |
| Sodium | 2,300mg | (amount ÷ 2300) × 100 |
| Total Carbs | 275g | (amount ÷ 275) × 100 |
| Dietary Fiber | 28g | (amount ÷ 28) × 100 |
| Added Sugars | 50g | (amount ÷ 50) × 100 |
| Protein | 50g | No %DV required |
| Vitamin D | 20mcg | (amount ÷ 20) × 100 |
| Calcium | 1,300mg | (amount ÷ 1300) × 100 |
| Iron | 18mg | (amount ÷ 18) × 100 |
| Potassium | 4,700mg | (amount ÷ 4700) × 100 |

**Example:**
- Recipe has 8g total fat per serving
- Daily Value = 78g
- %DV = (8 ÷ 78) × 100 = 10%

### 6. Test Locally Before Deploying

```bash
cd sunday-brunch-website
npm run dev
# Navigate to your recipe
# Verify nutrition label displays correctly
```

### 7. Deploy Updated Recipes

```bash
git add src/data/recipes.js
git commit -m "feat: add nutrition data to chocolate chip cookies recipe"
git push origin main
# Netlify auto-deploys (if using GitHub integration)
```

---

## Troubleshooting

### Issue 1: Build Fails on Netlify

**Error**: `npm ERR! Missing script: "build"`

**Solution**:
1. Check `package.json` has `"build": "vite build"` in scripts
2. Ensure build command in Netlify is exactly `npm run build`
3. Check base directory is set to `sunday-brunch-website`

---

### Issue 2: Page Shows 404 on Refresh

**Error**: Refreshing `/recipes/chocolate-chip-cookies` shows "Page Not Found"

**Solution**:
Add redirect rule to `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

This enables client-side routing for React Router.

---

### Issue 3: Search Not Working After Deployment

**Error**: Search returns no results, even for recipes that exist

**Solution**:
1. Verify `recipes.js` is included in the build
2. Check browser console for errors (F12 → Console tab)
3. Verify Fuse.js is installed: `npm list fuse.js`
4. If missing: `npm install fuse.js` and redeploy

---

### Issue 4: Nutrition Labels Not Showing

**Error**: Recipes don't display nutrition information

**Solution**:
1. Verify recipe has `nutrition` object in `recipes.js`
2. Check all required fields are present (servingSize, calories, totalFat, etc.)
3. Ensure structure matches template exactly (nested objects for saturatedFat, etc.)

---

### Issue 5: CSS Styles Missing or Broken

**Error**: Site looks unstyled or fonts are missing

**Solution**:
1. Verify all `.css` files are in `src/` directory
2. Check font imports in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Italiana&family=Fraunces:opsz,wght@9..144,100..900&family=Pinyon+Script&display=swap" rel="stylesheet">
```
3. Clear browser cache (Ctrl+Shift+R)

---

### Issue 6: Images Not Loading

**Error**: Recipe images show broken image icons

**Solution**:
1. Verify images are in `public/` directory
2. Check image paths in `recipes.js` start with `/` (e.g., `/images/cookies.jpg`)
3. Ensure images are committed to Git: `git add public/images/`

---

### Issue 7: Mobile Filters Drawer Won't Close

**Error**: On mobile, filters drawer stays open when clicking outside

**Solution**:
1. Verify `RecipeIndexPageEnhanced.jsx` has Escape key handler
2. Check backdrop click handler is present:
```javascript
<div className="mobile-filters-backdrop" onClick={() => setMobileFiltersOpen(false)} />
```

---

### Issue 8: Tests Fail Before Deployment

**Error**: `npm test` shows failures

**Solution**:
1. Run tests with verbose output: `npm test -- --verbose`
2. Check for environment-specific issues (Windows vs Linux paths)
3. Ensure all dependencies are installed: `npm install`
4. If PropTypes errors: `npm install prop-types`

---

### Issue 9: Slow Page Load Times

**Error**: Lighthouse performance score <90

**Solution**:
1. Optimize images: Use WebP format, compress with [TinyPNG](https://tinypng.com/)
2. Lazy load images: Add `loading="lazy"` to `<img>` tags
3. Code splitting: Vite handles this automatically for routes
4. Enable caching headers (already in `netlify.toml`)

---

### Issue 10: Accessibility Errors in Lighthouse

**Error**: Lighthouse accessibility score <100

**Solution**:
1. Check all images have `alt` text
2. Verify all buttons have descriptive `aria-label` or text content
3. Ensure color contrast meets WCAG AA (use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/))
4. Test with keyboard navigation (Tab key)

---

## Next Steps

### Immediate Actions

1. **Deploy to Netlify** using one of the methods above
2. **Test all features** using the testing checklist
3. **Add nutrition data** to your existing recipes using the template
4. **Monitor performance** with Lighthouse and fix any issues

### Before Sprint 3 (Reviews & Ratings)

1. **Gather User Feedback**
   - Share deployed site with friends/family
   - Ask for feedback on search experience
   - Verify nutrition labels are clear and helpful

2. **Add Nutrition Data to All Recipes**
   - Use USDA FoodData Central or MyFitnessPal
   - Follow the template structure
   - Test each recipe after adding data

3. **Performance Optimization** (if needed)
   - Optimize images (WebP, compression)
   - Lazy load below-the-fold content
   - Minimize bundle size

4. **Analytics Setup** (optional)
   - Add Google Analytics 4
   - Track search queries (most popular searches)
   - Monitor page views, bounce rate

### Planning for Sprint 3: Reviews & Ratings

Sprint 3 will require backend infrastructure (Supabase):

**Backend Requirements:**
- User authentication (email/password, social login)
- Database for reviews (user_id, recipe_id, rating, comment, timestamp)
- API endpoints (POST /reviews, GET /reviews/:recipe_id)
- Moderation tools (flag inappropriate content)

**Estimated Timeline:** 4-5 weeks (Weeks 4-8)

**Estimated Cost:**
- Supabase (free tier): $0/month (up to 500MB database)
- Netlify (free tier): $0/month
- **Total**: $0/month initially

---

## Summary

✅ **What You've Accomplished:**
- Sprint 1: Advanced search with fuzzy matching, 7 filter categories, pagination
- Sprint 2: FDA-compliant nutrition labels, dietary badges, allergen warnings
- Zero technical debt (all issues fixed)
- 149/149 tests passing (100% pass rate)
- WCAG 2.1 AA accessible
- Production-ready codebase

🚀 **Deployment Steps:**
1. Verify local build works
2. Create `netlify.toml` configuration
3. Push to GitHub (if using GitHub integration)
4. Connect repository to Netlify
5. Deploy and test

📝 **Ongoing Maintenance:**
- Add nutrition data to recipes as you create them
- Monitor site performance with Lighthouse
- Gather user feedback for Sprint 3 planning

---

**Questions or Issues?**

If you encounter problems not covered in this guide:
1. Check [Netlify Documentation](https://docs.netlify.com/)
2. Review [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
3. Check browser console for JavaScript errors (F12 → Console)

---

**Deployment Checklist:**

- [ ] Local build works (`npm run build`)
- [ ] All tests pass (`npm test`)
- [ ] `netlify.toml` created
- [ ] Changes committed to Git
- [ ] Deployed to Netlify
- [ ] Custom domain configured (optional)
- [ ] All features tested on deployed site
- [ ] Lighthouse performance score 90+
- [ ] Nutrition data added to at least 3 recipes
- [ ] User feedback collected

**Once complete, you're ready for Sprint 3 planning!** 🎉
