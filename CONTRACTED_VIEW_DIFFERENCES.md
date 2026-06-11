# Contracted View Differences Analysis

## Date: 2026-01-21
## Status: CRITICAL DIFFERENCES IDENTIFIED

---

## Section 1: Featured Recipe Card (Contracted View)

### Preview HTML Structure (Lines 1640-1680)
```html
<div class="featured-recipe-grid">
    <div class="featured-image-container">
        <img ... />
        <div class="category-badge">Featured</div>
    </div>
    <div class="featured-content">
        <h3>Giselle's Royal Velvet Cake</h3>
        <div class="featured-meta">
            <span style="display: inline-flex; gap: 0.2rem; align-items: center;">
                <!-- 5 inline crystal SVGs -->
                <svg viewBox="0 0 24 24" style="width: 1rem; height: 1rem;">...</svg>
                <!-- ... repeated 5 times -->
                <span style="margin-left: 0.3rem;">(127)</span>
            </span>
            <span>⏱️ 90 min</span>
            <span>📊 Advanced</span>
        </div>
        <p style="font-style: italic; color: #5a4668;">...</p>
        <div class="button-centered">
            <button class="whimsical-button whimsical-button--primary">View Full Recipe</button>
        </div>
    </div>
</div>
```

### Current JSX Implementation (FeaturedRecipeCard.jsx)
```jsx
<div className="featured-recipe-grid">
    <div className="featured-image-container">
        <img ... />
        <div className="category-badge">{recipe.category}</div>
    </div>
    <div className="featured-content">
        <h3>{recipe.title}</h3>
        {!ratingsLoading && ratings && (
            <div className="featured-meta">
                <CrystalRating
                    value={Math.round(ratings.average_rating)}
                    count={ratings.rating_count}
                    readOnly={true}
                />
                <span>⏱️ {recipe.times?.total || '--'}</span>
                <span>📊 {recipe.skill || 'Medium'}</span>
            </div>
        )}
        <p style={{ fontStyle: 'italic', color: '#5a4668' }}>...</p>
        <div className="button-centered">
            <WhimsicalButton type="primary">View Full Recipe</WhimsicalButton>
        </div>
    </div>
</div>
```

### CRITICAL DIFFERENCES - Recipe Section

#### 1. Crystal Rating Display
**Preview:** Inline SVG crystals directly in HTML
```html
<span style="display: inline-flex; gap: 0.2rem; align-items: center;">
    <svg viewBox="0 0 24 24" style="width: 1rem; height: 1rem;">
        <path d="M12 2 L19 7 L19 17 L12 22 L5 17 L5 7 Z" fill="#D6BCFA" stroke="#D6BCFA" stroke-width="1.5" stroke-linejoin="round" />
        <path d="M12 5 L12 19 M7 8 L17 16 M17 8 L7 16" stroke="rgba(255,255,255,0.4)" stroke-width="1" />
    </svg>
    <!-- Repeated 5 times -->
    <span style="margin-left: 0.3rem;">(127)</span>
</span>
```

**Current:** Component-based CrystalRating
```jsx
<CrystalRating
    value={Math.round(ratings.average_rating)}
    count={ratings.rating_count}
    readOnly={true}
/>
```

**Issue:** CrystalRating component may not render inline SVGs with exact same styling
**Fix Required:** Ensure CrystalRating outputs identical HTML structure

#### 2. Meta Container Styling
**Preview CSS:**
```css
.featured-meta {
    display: flex;
    gap: 0.8rem;
    color: #9b7ab8;
    font-weight: 600;
    font-size: 0.9rem;
    flex-wrap: wrap;
}
```

**Current CSS (FeaturedRecipeCard.css lines 152-159):**
```css
.featured-meta {
    display: flex;
    gap: 0.8rem;
    color: #9b7ab8;
    font-weight: 600;
    font-size: 0.9rem;
    flex-wrap: wrap;
}
```

**Status:** ✅ MATCHES EXACTLY

#### 3. Button Container Styling
**Preview CSS:**
```css
.button-centered {
    text-align: center;
    margin-top: auto;
    padding-top: 0.5rem;
}
```

**Current CSS (FeaturedRecipeCard.css lines 174-178):**
```css
.button-centered {
    text-align: center;
    margin-top: auto;
    padding-top: 0.5rem;
}
```

**Status:** ✅ MATCHES EXACTLY

#### 4. Grid Layout
**Preview CSS:**
```css
.featured-recipe-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    padding: 2rem;
}
```

**Current CSS (FeaturedRecipeCard.css lines 92-97):**
```css
.featured-recipe-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    padding: 2rem;
}
```

**Status:** ✅ MATCHES EXACTLY

#### 5. Image Container
**Preview CSS:**
```css
.featured-image-container {
    position: relative;
    aspect-ratio: 4/3;
}

.featured-image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 16px;
}
```

**Current CSS (FeaturedRecipeCard.css lines 103-113):**
```css
.featured-image-container {
    position: relative;
    aspect-ratio: 4/3;
}

.featured-image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 16px;
}
```

**Status:** ✅ MATCHES EXACTLY

---

## Section 2: Latest Episode Card (Contracted View)

### Preview HTML Structure (Lines 2116-2133)
```html
<div class="featured-episode-grid">
    <div class="episode-waveform">
        <div class="audio-icon-container">🎧</div>
    </div>
    <div class="episode-content">
        <h3>The Pie That Started a Dynasty</h3>
        <p class="episode-date">Aired on Sunday Morning</p>
        <div class="featured-meta">
            <span>🎙️ Podcast Episode</span>
            <span>📝 With Transcript</span>
        </div>
        <p style="font-style: italic; color: #5a4668;">...</p>
        <div class="button-centered">
            <button class="whimsical-button whimsical-button--primary">Listen Now</button>
        </div>
    </div>
</div>
```

### Current JSX Implementation (FeaturedEpisodeCard.jsx)
```jsx
<div className="featured-episode-grid">
    <div className="episode-waveform">
        <div className="audio-icon-container">🎧</div>
    </div>
    <div className="episode-content">
        <h3>{episode.title}</h3>
        <p className="episode-date">Aired on {episode.date || "Sunday Morning"}</p>
        <div className="featured-meta">
            <span>🎙️ Podcast Episode</span>
            <span>📝 With Transcript</span>
        </div>
        {episode.notes && episode.notes.length > 0 && (
            <p style={{ fontStyle: 'italic', color: '#5a4668' }}>
                {episode.notes[0]}
            </p>
        )}
        <div className="button-centered">
            <WhimsicalButton type="primary">Listen Now</WhimsicalButton>
        </div>
    </div>
</div>
```

### CRITICAL DIFFERENCES - Episode Section

#### 1. Grid Layout
**Preview CSS:**
```css
.featured-episode-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    padding: 2rem;
}
```

**Current CSS (FeaturedEpisodeCard.css lines 41-46):**
```css
.featured-episode-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    padding: 3rem;  /* ❌ WRONG - should be 2rem */
}
```

**Issue:** Padding is 3rem instead of 2rem
**Fix Required:** Change padding from 3rem to 2rem

#### 2. Episode Waveform
**Preview CSS:**
```css
.episode-waveform {
    position: relative;
    aspect-ratio: 4/3;
    background: linear-gradient(135deg, #dff0ea 0%, #fce1e4 50%, #e8dff5 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}
```

**Current CSS (FeaturedEpisodeCard.css lines 48-57):**
```css
.episode-waveform {
    position: relative;
    aspect-ratio: 4/3;
    background: linear-gradient(135deg, #dff0ea 0%, #fce1e4 50%, #e8dff5 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;  /* ⚠️ Extra property - not in preview */
}
```

**Issue:** Extra `overflow: hidden` property
**Fix Required:** Remove `overflow: hidden` (minor, likely not causing visual difference)

#### 3. Audio Icon Container Styling
**Preview:** No specific CSS for `.audio-icon-container` in preview (inherits from parent)

**Current CSS (FeaturedEpisodeCard.css lines 59-74):**
```css
.audio-icon-container {
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    box-shadow: 0 8px 32px rgba(46, 26, 71, 0.2);
    transition: transform 0.3s ease;
}
```

**Status:** ✅ LIKELY CORRECT (preview doesn't show specific styles but visual matches)

#### 4. Episode Content Container
**Preview CSS:** No specific CSS class for `.episode-content`

**Current CSS (FeaturedEpisodeCard.css lines 76-81):**
```css
.episode-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    justify-content: center;
}
```

**Issue:** Gap is 1.5rem - need to verify if this matches preview spacing
**Potential Fix:** May need to adjust gap

#### 5. Episode Date Styling
**Preview:** Class `episode-date` but no specific CSS shown in search

**Current CSS (FeaturedEpisodeCard.css lines 91-96):**
```css
.episode-date {
    font-family: 'Pinyon Script', cursive;
    font-size: 1.3rem;
    color: #9b7ab8;
    margin: -0.5rem 0 0 0;
}
```

**Status:** ⚠️ NEEDS VERIFICATION (negative margin may cause spacing differences)

#### 6. Featured Meta Styling (Episode Version)
**Preview CSS:** Same as recipe section
```css
.featured-meta {
    display: flex;
    gap: 0.8rem;
    color: #9b7ab8;
    font-weight: 600;
    font-size: 0.9rem;
    flex-wrap: wrap;
}
```

**Current CSS (FeaturedEpisodeCard.css lines 98-109):**
```css
.featured-meta {
    display: flex;
    gap: 1.5rem;  /* ❌ WRONG - should be 0.8rem */
    color: #5a4668;  /* ❌ WRONG - should be #9b7ab8 */
    font-weight: 500;  /* ❌ WRONG - should be 600 */
    font-size: 0.95rem;  /* ❌ WRONG - should be 0.9rem */
    flex-wrap: wrap;
    background: rgba(232, 223, 245, 0.3);  /* ❌ EXTRA - not in preview */
    padding: 0.8rem 1.2rem;  /* ❌ EXTRA - not in preview */
    border-radius: 12px;  /* ❌ EXTRA - not in preview */
    width: fit-content;  /* ❌ EXTRA - not in preview */
}
```

**Issue:** MAJOR STYLING DIFFERENCES
**Fix Required:** Remove background, padding, border-radius, width properties and fix gap, color, font-weight, font-size

---

## Summary of Required Fixes

### Recipe Section (FeaturedRecipeCard)
1. ✅ Grid layout - CORRECT
2. ✅ Image container - CORRECT
3. ✅ Meta styling - CORRECT
4. ✅ Button centering - CORRECT
5. ⚠️ Crystal rating - VERIFY component output matches inline SVGs

### Episode Section (FeaturedEpisodeCard)
1. ❌ `.featured-episode-grid` padding - Change 3rem to 2rem
2. ❌ `.featured-meta` gap - Change 1.5rem to 0.8rem
3. ❌ `.featured-meta` color - Change #5a4668 to #9b7ab8
4. ❌ `.featured-meta` font-weight - Change 500 to 600
5. ❌ `.featured-meta` font-size - Change 0.95rem to 0.9rem
6. ❌ `.featured-meta` - Remove background, padding, border-radius, width
7. ⚠️ `.episode-waveform` overflow - Remove overflow: hidden
8. ⚠️ `.episode-content` gap - Verify 1.5rem is correct
9. ⚠️ `.episode-date` negative margin - Verify spacing

### Priority Level
- **P0 (Critical):** Episode meta styling (6 issues)
- **P1 (High):** Episode grid padding
- **P2 (Medium):** Crystal rating verification, episode-date spacing

---

## Test Plan

1. Fix all P0 and P1 issues
2. View side-by-side comparison with preview-magical.html
3. Measure spacing, colors, font sizes with browser DevTools
4. Verify crystal rating output in recipe section
5. Check responsive breakpoints match
6. Validate button behavior and styling

---

## Next Steps

1. Fix FeaturedEpisodeCard.css (7 style changes)
2. Verify CrystalRating component output
3. Side-by-side visual comparison
4. Document final verification results
