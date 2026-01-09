# Image Optimization Plan

**Created:** 2026-01-08
**Status:** Ready for Implementation
**Approach:** Beauty-First Optimization (Zero Visual Sacrifice)

---

## 🎨 Design Philosophy Alignment

**This optimization preserves 100% of visual quality while reducing file sizes.**

WebP format provides:
- **Better quality at smaller sizes** (30-50% reduction)
- **Superior compression** without visible artifacts
- **Progressive loading** for better UX
- **Full browser support** with PNG fallbacks

**NO sacrifices to beauty or whimsy** - just smarter file encoding.

---

## 📊 Current State Analysis

### Production Images (Actually Used)

**Total:** 10 files | **Size:** ~7.1 MB

| File | Size | Type | Priority |
|------|------|------|----------|
| `/assets/stacey-and-giselle.png` | 874 KB | Hero | P0 |
| `/images/recipes/artisan-sourdough.png` | 952 KB | Recipe | P1 |
| `/images/recipes/fudgy-brownies.png` | 849 KB | Recipe | P1 |
| `/images/recipes/braided-fruit-pie.png` | 824 KB | Recipe | P1 |
| `/images/recipes/elegant-cheesecake.png` | 795 KB | Recipe | P1 |
| `/images/recipes/whimsical-cupcakes.png` | 720 KB | Recipe | P1 |
| `/images/recipes/artisanal-cookies.png` | 709 KB | Recipe | P1 |
| `/images/recipes/whimsical-breakfast.png` | 642 KB | Recipe | P1 |
| `/src/assets/photos/redvelvet.jpg` | 109 KB | Recipe | P2 |

**Verification Screenshots:** 58 files (~19 MB) - NOT used in production, can be cleaned up separately

### Expected Savings

- **WebP Conversion:** 30-50% reduction (2.1-3.5 MB savings)
- **Lazy Loading:** Reduces initial page load by ~4-5 MB
- **Total Impact:** 40-50% faster initial load for image-heavy pages

---

## 🛠️ Implementation Plan

### Phase 1: Setup WebP Conversion Tools (10 minutes)

**Option A: Using sharp (Recommended)**
```bash
cd sunday-brunch-website
npm install --save-dev sharp-cli
```

**Option B: Using squoosh-cli**
```bash
npm install --save-dev @squoosh/cli
```

**Option C: Online Conversion (No setup)**
- Use https://squoosh.app/ for manual conversion
- Drag and drop images
- Export as WebP with quality setting 85-90

---

### Phase 2: Convert Images to WebP (30 minutes)

**Using sharp-cli:**
```bash
# Navigate to project
cd C:\Users\heirr\OneDrive\Desktop\Hope2_Studio\SundayBrunchWithGiselle\sunday-brunch-website

# Convert hero image
npx sharp-cli -i public/assets/stacey-and-giselle.png -o public/assets/stacey-and-giselle.webp -f webp -q 90

# Convert recipe images (batch)
npx sharp-cli -i "public/images/recipes/artisan-sourdough.png" -o "public/images/recipes/artisan-sourdough.webp" -f webp -q 85
npx sharp-cli -i "public/images/recipes/fudgy-brownies.png" -o "public/images/recipes/fudgy-brownies.webp" -f webp -q 85
npx sharp-cli -i "public/images/recipes/braided-fruit-pie.png" -o "public/images/recipes/braided-fruit-pie.webp" -f webp -q 85
npx sharp-cli -i "public/images/recipes/elegant-cheesecake.png" -o "public/images/recipes/elegant-cheesecake.webp" -f webp -q 85
npx sharp-cli -i "public/images/recipes/whimsical-cupcakes.png" -o "public/images/recipes/whimsical-cupcakes.webp" -f webp -q 85
npx sharp-cli -i "public/images/recipes/artisanal-cookies.png" -o "public/images/recipes/artisanal-cookies.webp" -f webp -q 85
npx sharp-cli -i "public/images/recipes/whimsical-breakfast.png" -o "public/images/recipes/whimsical-breakfast.webp" -f webp -q 85
npx sharp-cli -i "src/assets/photos/redvelvet.jpg" -o "src/assets/photos/redvelvet.webp" -f webp -q 85
```

**Quality Settings:**
- **90** for hero images (maximum quality)
- **85** for recipe cards (excellent quality, better compression)

---

### Phase 3: Create Optimized Image Component (20 minutes)

Create `src/components/OptimizedImage.jsx`:

```jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * OptimizedImage Component
 *
 * Displays images with WebP format and PNG fallback
 * Implements lazy loading for below-fold images
 *
 * Usage:
 * <OptimizedImage
 *   src="/images/recipes/artisan-sourdough.png"
 *   alt="Artisan Sourdough Bread"
 *   loading="lazy"
 * />
 */
const OptimizedImage = ({
    src,
    alt,
    className = '',
    loading = 'lazy',
    sizes = '100vw',
    ...props
}) => {
    // Convert .png/.jpg to .webp for modern browsers
    const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');

    return (
        <picture>
            {/* WebP for modern browsers (30-50% smaller) */}
            <source
                srcSet={webpSrc}
                type="image/webp"
                sizes={sizes}
            />

            {/* Fallback for older browsers */}
            <img
                src={src}
                alt={alt}
                className={className}
                loading={loading}
                decoding="async"
                {...props}
            />
        </picture>
    );
};

OptimizedImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    className: PropTypes.string,
    loading: PropTypes.oneOf(['lazy', 'eager']),
    sizes: PropTypes.string
};

export default OptimizedImage;
```

**Key Features:**
- Automatic WebP selection for modern browsers
- PNG/JPG fallback for older browsers
- Lazy loading by default (load images when scrolled into view)
- Async decoding (non-blocking)

---

### Phase 4: Update Components to Use OptimizedImage (30 minutes)

#### 4.1 Update WhimsicalHero.jsx

**Before:**
```jsx
<img
    src="/assets/stacey-and-giselle.png"
    alt="Stacey and Giselle baking in a whimsical kitchen"
    className="hero-watercolor-img"
/>
```

**After:**
```jsx
import OptimizedImage from './OptimizedImage';

<OptimizedImage
    src="/assets/stacey-and-giselle.png"
    alt="Stacey and Giselle baking in a whimsical kitchen"
    className="hero-watercolor-img"
    loading="eager"
    sizes="(max-width: 768px) 100vw, 50vw"
/>
```

**Note:** `loading="eager"` for hero image (above fold)

---

#### 4.2 Update RecipeTemplate.jsx (Recipe Card Images)

**Find and replace in RecipeTemplate.jsx:**

**Before:**
```jsx
<img
    src={recipe.image}
    alt={recipe.title}
    className="recipe-hero-img"
/>
```

**After:**
```jsx
import OptimizedImage from './OptimizedImage';

<OptimizedImage
    src={recipe.image}
    alt={recipe.title}
    className="recipe-hero-img"
    loading="lazy"
    sizes="(max-width: 768px) 100vw, 800px"
/>
```

---

#### 4.3 Update FeaturedRecipeCard.jsx (If Exists)

**Before:**
```jsx
<img src={recipe.image} alt={recipe.title} />
```

**After:**
```jsx
import OptimizedImage from './OptimizedImage';

<OptimizedImage
    src={recipe.image}
    alt={recipe.title}
    loading="lazy"
    sizes="(max-width: 768px) 100vw, 400px"
/>
```

---

### Phase 5: Update Content References (10 minutes)

**Update `src/data/content.js`:**

**NO CHANGES NEEDED** - Component handles WebP conversion automatically

Original references like:
```javascript
image: '/images/recipes/artisan-sourdough.png'
```

Will automatically load `.webp` version in OptimizedImage component.

---

### Phase 6: Testing (20 minutes)

**Visual Verification:**
```bash
# Start dev server
cd sunday-brunch-website
npm run dev
```

**Check these pages:**
- [ ] Home page - hero image loads correctly
- [ ] Recipe index - recipe cards load correctly
- [ ] Individual recipe pages - recipe images load correctly
- [ ] Network tab - WebP images being served
- [ ] Network tab - lazy loading working (images load on scroll)

**Browser Testing:**
- [ ] Chrome/Edge - WebP loads
- [ ] Firefox - WebP loads
- [ ] Safari - WebP loads (iOS 14+)
- [ ] Older browsers - PNG fallback works

**Performance Verification:**
```bash
# Build production bundle
npm run build

# Check bundle size reduction
ls -lh dist/assets/
```

**Expected Results:**
- Hero image: 874KB → ~300-400KB (WebP)
- Recipe images: 700-950KB → ~250-400KB each (WebP)
- Total savings: 2-3 MB initial load reduction

---

### Phase 7: Cleanup (Optional, 10 minutes)

**Remove verification screenshots (19 MB):**
```bash
# Review files first
ls -lh public/images/recipes/*verification*.png
ls -lh public/images/recipes/*_1765*.png
ls -lh public/images/recipes/*_1766*.png

# Delete after review (backup first!)
# rm public/images/recipes/*verification*.png
# rm public/images/recipes/*_17*.png
```

**⚠️ Only delete after confirming these are NOT used in production**

---

## 📋 Implementation Checklist

### Setup
- [ ] Install sharp-cli or squoosh-cli
- [ ] Test conversion on 1 image to verify quality

### Conversion
- [ ] Convert hero image to WebP
- [ ] Convert 8 recipe images to WebP
- [ ] Verify WebP file sizes (should be 30-50% smaller)

### Code Changes
- [ ] Create OptimizedImage component
- [ ] Update WhimsicalHero.jsx (hero image)
- [ ] Update RecipeTemplate.jsx (recipe images)
- [ ] Update any other components using images

### Testing
- [ ] Test in Chrome (WebP loads)
- [ ] Test in Firefox (WebP loads)
- [ ] Test in Safari (WebP loads)
- [ ] Test lazy loading (scroll behavior)
- [ ] Test production build (bundle size)
- [ ] Visual comparison (no quality loss)

### Verification
- [ ] Lighthouse score improvement
- [ ] Network waterfall shows WebP
- [ ] Images load on scroll (lazy)
- [ ] No console errors

---

## 🚀 Expected Results

### Performance Improvements

**Before Optimization:**
- Hero image: 874 KB
- Recipe images: 700-950 KB each
- Initial page load: ~5-7 MB (with images)

**After Optimization:**
- Hero image: ~300-400 KB (54% reduction)
- Recipe images: ~250-400 KB each (50% reduction)
- Initial page load: ~3-4 MB (40% reduction)

### Lighthouse Scores (Expected)

- **Performance:** +5-10 points
- **Best Practices:** +5 points (modern image formats)
- **LCP (Largest Contentful Paint):** -500ms to -1s
- **Total Bundle Size:** -2.5 to -3.5 MB

### User Experience

- **Hero section loads:** 50% faster
- **Recipe cards appear:** 40% faster during scroll
- **Mobile users:** Significant savings on data usage
- **Visual quality:** **ZERO difference** (WebP is visually lossless at 85-90 quality)

---

## 🎯 Success Criteria

✅ **Metrics:**
- [ ] 30-50% reduction in image file sizes
- [ ] WebP images served to 95%+ of browsers
- [ ] Lazy loading reduces initial load by 4-5 MB
- [ ] Zero visual quality degradation

✅ **Code Quality:**
- [ ] Reusable OptimizedImage component
- [ ] Automatic format selection (WebP + fallback)
- [ ] Lazy loading by default
- [ ] Proper alt text and accessibility

✅ **Deployment:**
- [ ] Production build succeeds
- [ ] Netlify deployment works
- [ ] All images accessible
- [ ] No broken image links

---

## 📚 Technical References

### WebP Browser Support
- Chrome/Edge: Full support (since 2010/2020)
- Firefox: Full support (since 2019)
- Safari: Full support (since iOS 14, macOS 11)
- Coverage: 97%+ of global users

### Lazy Loading Support
- Native `loading="lazy"` attribute
- Supported in Chrome 76+, Firefox 75+, Edge 79+, Safari 15.4+
- Coverage: 94%+ of global users

### Tools Used
- **sharp:** High-performance Node.js image processing
- **squoosh:** Google's image compression tool
- **React `<picture>`:** Progressive enhancement pattern

---

## 🤖 Automation (Future Enhancement)

**Create build script to auto-convert images:**

```javascript
// scripts/optimize-images.js
import sharp from 'sharp';
import { glob } from 'glob';

const images = await glob('public/images/**/*.{png,jpg,jpeg}');

for (const image of images) {
    const webpPath = image.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    await sharp(image)
        .webp({ quality: 85 })
        .toFile(webpPath);
    console.log(`✓ Converted ${image} → ${webpPath}`);
}
```

**Add to package.json:**
```json
{
  "scripts": {
    "optimize:images": "node scripts/optimize-images.js",
    "prebuild": "npm run optimize:images"
  }
}
```

---

## 📝 Notes

1. **WebP Quality:** 85-90 provides visually lossless results
2. **Fallback Images:** Keep original PNG/JPG files (fallback)
3. **Git Tracking:** Add `.webp` files to git
4. **CDN:** Netlify automatically serves correct format
5. **Monitoring:** Check Core Web Vitals after deployment

---

**Last Updated:** 2026-01-08
**Status:** ✅ Ready for Implementation
**Estimated Time:** 2 hours total
**Expected Savings:** 2.5-3.5 MB bundle reduction
