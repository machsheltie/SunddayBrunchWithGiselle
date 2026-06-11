# Visual Verification Guide - Contracted Views

## Status: Ready for Visual Verification
## Date: 2026-01-21

---

## How to Perform Visual Verification

### Step 1: Start Development Server
```bash
cd sunday-brunch-website
npm run dev
```
Server will start at: http://localhost:5178

### Step 2: Open Preview File
Open `preview-magical.html` in a web browser (side-by-side with dev server)

### Step 3: Navigate to Sections
Both files should show:
- Recipe Section: "The Recipe Sanctuary"
- Episode Section: "Latest Episode"

---

## Recipe Section Verification (Lines 1610-1680 in preview)

### Visual Checklist

#### Container & Layout
- [ ] **Card Background**: White with glassmorphic effect (rgba(255,255,255,0.9))
- [ ] **Border**: 2px solid rgba(232, 223, 245, 0.5)
- [ ] **Border Radius**: 24px
- [ ] **Washi Tape**: Centered at top, -15px offset, lavender with paw prints
- [ ] **Sparkle**: Top right corner (✨) with animation
- [ ] **Watercolor Splatter**: Top left, blurred lavender (#e8dff5)

#### Grid Structure
- [ ] **Columns**: 2 equal columns (1fr 1fr)
- [ ] **Gap**: 2rem between columns
- [ ] **Padding**: 2rem on all sides

#### Left Column (Image)
- [ ] **Aspect Ratio**: 4/3
- [ ] **Border Radius**: 16px
- [ ] **Category Badge**: Top left, lavender background, "Featured" or category name
- [ ] **Object Fit**: Cover

#### Right Column (Content)
- [ ] **Title**: Italiana font, 1.8rem, #2e1a47 color
- [ ] **Crystal Rating Container**:
  - 5 crystal SVGs inline
  - Each crystal: 1rem × 1rem
  - Gap between crystals: 0.2rem
  - Filled crystals: #D6BCFA with facet lines
  - Rating count: margin-left 0.3rem, "(127)" format
- [ ] **Meta Container**:
  - Display: flex
  - Gap: 0.8rem
  - Color: #9b7ab8
  - Font-weight: 600
  - Font-size: 0.9rem
  - Items: ⏱️ time, 📊 difficulty
  - NO background, NO padding, NO border
- [ ] **Description Text**:
  - Font-style: italic
  - Color: #5a4668
  - Line-height: 1.5
- [ ] **Button**:
  - Centered with text-align: center
  - WhimsicalButton primary style
  - Text: "View Full Recipe"
  - Margin-top: auto (pushed to bottom)

### Measurements to Verify
| Element | Property | Expected Value |
|---------|----------|----------------|
| Grid padding | padding | 2rem |
| Grid gap | gap | 2rem |
| Grid columns | grid-template-columns | 1fr 1fr |
| Image aspect ratio | aspect-ratio | 4/3 |
| Title font size | font-size | 1.8rem |
| Crystal size | width/height | 1rem |
| Crystal gap | gap | 0.2rem |
| Meta gap | gap | 0.8rem |
| Meta color | color | #9b7ab8 |
| Meta font-weight | font-weight | 600 |
| Meta font-size | font-size | 0.9rem |
| Description color | color | #5a4668 |

---

## Episode Section Verification (Lines 2086-2133 in preview)

### Visual Checklist

#### Container & Layout
- [ ] **Card Background**: White with glassmorphic effect (rgba(255,255,255,0.9))
- [ ] **Border**: 2px solid rgba(232, 223, 245, 0.5)
- [ ] **Border Radius**: 24px
- [ ] **Washi Tape**: Centered at top, -16px offset, lavender with paw prints

#### Grid Structure
- [ ] **Columns**: 2 equal columns (1fr 1fr)
- [ ] **Gap**: 2rem between columns
- [ ] **Padding**: 2rem on all sides (CRITICAL - was 3rem, now 2rem)

#### Left Column (Waveform)
- [ ] **Aspect Ratio**: 4/3
- [ ] **Background**: Linear gradient (135deg, #dff0ea 0%, #fce1e4 50%, #e8dff5 100%)
- [ ] **Border Radius**: 16px
- [ ] **Audio Icon Container**:
  - Size: 100px × 100px
  - Background: rgba(255,255,255,0.9)
  - Border-radius: 50% (circle)
  - Box-shadow: 0 8px 32px rgba(46, 26, 71, 0.2)
  - Icon: 🎧 (3rem font-size)
  - Centered in waveform

#### Right Column (Content)
- [ ] **Title**: Italiana font, 1.8rem, #2e1a47 color
- [ ] **Episode Date**:
  - Font: Pinyon Script, cursive
  - Size: 1.3rem
  - Color: #9b7ab8
  - Margin: -0.5rem 0 0 0
  - Format: "Aired on Sunday Morning"
- [ ] **Meta Container** (CRITICAL - completely refactored):
  - Display: flex
  - Gap: 0.8rem (NOT 1.5rem)
  - Color: #9b7ab8 (NOT #5a4668)
  - Font-weight: 600 (NOT 500)
  - Font-size: 0.9rem (NOT 0.95rem)
  - NO background (was rgba(232, 223, 245, 0.3))
  - NO padding (was 0.8rem 1.2rem)
  - NO border-radius (was 12px)
  - NO width: fit-content
  - Items: 🎙️ Podcast Episode, 📝 With Transcript
- [ ] **Description Text**:
  - Font-style: italic
  - Color: #5a4668
  - Line-height: 1.5
- [ ] **Button**:
  - Centered with text-align: center
  - WhimsicalButton primary style
  - Text: "Listen Now"
  - Margin-top: 1rem

### Measurements to Verify
| Element | Property | Expected Value | Previous Value (if changed) |
|---------|----------|----------------|-----------------------------|
| Grid padding | padding | 2rem | 3rem ❌ |
| Grid gap | gap | 2rem | - |
| Grid columns | grid-template-columns | 1fr 1fr | - |
| Waveform aspect ratio | aspect-ratio | 4/3 | - |
| Audio icon size | width/height | 100px | - |
| Title font size | font-size | 1.8rem | - |
| Episode date size | font-size | 1.3rem | - |
| Meta gap | gap | 0.8rem | 1.5rem ❌ |
| Meta color | color | #9b7ab8 | #5a4668 ❌ |
| Meta font-weight | font-weight | 600 | 500 ❌ |
| Meta font-size | font-size | 0.9rem | 0.95rem ❌ |
| Meta background | background | NONE | rgba(232,223,245,0.3) ❌ |
| Meta padding | padding | NONE | 0.8rem 1.2rem ❌ |
| Meta border-radius | border-radius | NONE | 12px ❌ |
| Description color | color | #5a4668 | - |

---

## Before/After Comparison - Episode Meta

### BEFORE (Wrong)
```
┌─────────────────────────────────────────┐
│  [🎙️ Podcast Episode] [📝 With Transcript]  │
└─────────────────────────────────────────┘
   ↑                                       ↑
   Lavender background box (pill style)
   Gap: 1.5rem, Color: #5a4668 (darker)
```

### AFTER (Correct - Matches Preview)
```
🎙️ Podcast Episode    📝 With Transcript
↑                    ↑
No background, simple inline text
Gap: 0.8rem, Color: #9b7ab8 (lavender)
```

---

## Critical Differences That Were Fixed

### 1. Episode Grid Padding
- **Was:** 3rem (too much space inside card)
- **Now:** 2rem (matches recipe section and preview)
- **Impact:** Tighter, more balanced layout

### 2. Episode Meta Styling (MAJOR)
- **Was:** Styled as lavender "pills" with background, padding, border-radius
- **Now:** Simple inline text with proper spacing
- **Impact:** Matches preview's clean, minimal design

### 3. Episode Meta Typography
- **Gap:** 1.5rem → 0.8rem (tighter spacing)
- **Color:** #5a4668 → #9b7ab8 (lighter lavender)
- **Weight:** 500 → 600 (slightly bolder)
- **Size:** 0.95rem → 0.9rem (slightly smaller)

---

## Interactive Elements to Test

### Recipe Section
1. **Crystal Rating Hover**:
   - Hover over crystals
   - Should scale(1.15) and glow (#D6BCFA drop-shadow)
   - Progressive fill (hovering crystal 3 fills 1, 2, 3)

2. **Card Hover**:
   - Whole card should lift (translateY(-4px))
   - Shadow should intensify

3. **Button Click**:
   - Click "View Full Recipe"
   - Should expand to full RecipeTemplate
   - "Collapse Recipe" button should appear

### Episode Section
1. **Audio Icon Hover**:
   - Hover over 🎧 icon
   - Should scale(1.1) and rotate(5deg)

2. **Card Hover**:
   - Whole card should lift (translateY(-4px))
   - Shadow should intensify

3. **Button Click**:
   - Click "Listen Now"
   - Should expand to full EpisodeTemplate
   - "Collapse Episode" button should appear

---

## Responsive Breakpoints

### Tablet (768px)
Both sections should:
- [ ] Switch to single column (grid-template-columns: 1fr)
- [ ] Image/waveform above content
- [ ] Padding reduced (1.5rem instead of 2rem)
- [ ] Washi tape width reduced

### Mobile (480px)
Both sections should:
- [ ] Further padding reduction (1rem)
- [ ] Smaller font sizes
- [ ] Smaller washi tape

---

## Common Issues to Look For

### Recipe Section
- ❌ Crystal rating not inline (should be flex row)
- ❌ Crystal count missing or misaligned
- ❌ Meta items have background (should be plain text)
- ❌ Grid not 2 columns
- ❌ Padding too large or too small

### Episode Section
- ❌ Meta items look like "pills" or "badges" (MAJOR RED FLAG)
- ❌ Meta items have background color (should be transparent)
- ❌ Meta text color is dark (#5a4668) instead of lavender (#9b7ab8)
- ❌ Grid padding is 3rem (should be 2rem)
- ❌ Audio icon not centered
- ❌ Waveform gradient incorrect

---

## DevTools Inspection Commands

### Check Grid Layout
```javascript
// In browser console
const recipeGrid = document.querySelector('.featured-recipe-grid');
console.log('Recipe Grid:');
console.log('  columns:', getComputedStyle(recipeGrid).gridTemplateColumns);
console.log('  gap:', getComputedStyle(recipeGrid).gap);
console.log('  padding:', getComputedStyle(recipeGrid).padding);

const episodeGrid = document.querySelector('.featured-episode-grid');
console.log('Episode Grid:');
console.log('  columns:', getComputedStyle(episodeGrid).gridTemplateColumns);
console.log('  gap:', getComputedStyle(episodeGrid).gap);
console.log('  padding:', getComputedStyle(episodeGrid).padding);
```

### Check Meta Styling
```javascript
// Recipe meta
const recipeMeta = document.querySelector('.featured-recipe-card .featured-meta');
console.log('Recipe Meta:');
console.log('  gap:', getComputedStyle(recipeMeta).gap);
console.log('  color:', getComputedStyle(recipeMeta).color);
console.log('  font-weight:', getComputedStyle(recipeMeta).fontWeight);
console.log('  font-size:', getComputedStyle(recipeMeta).fontSize);

// Episode meta
const episodeMeta = document.querySelector('.featured-episode-card .featured-meta');
console.log('Episode Meta:');
console.log('  gap:', getComputedStyle(episodeMeta).gap);
console.log('  color:', getComputedStyle(episodeMeta).color);
console.log('  font-weight:', getComputedStyle(episodeMeta).fontWeight);
console.log('  font-size:', getComputedStyle(episodeMeta).fontSize);
console.log('  background:', getComputedStyle(episodeMeta).background);
console.log('  padding:', getComputedStyle(episodeMeta).padding);
console.log('  border-radius:', getComputedStyle(episodeMeta).borderRadius);
```

### Expected DevTools Output
```
Recipe Grid:
  columns: 523.5px 523.5px  // Equal widths (1fr 1fr)
  gap: 32px                  // 2rem
  padding: 32px              // 2rem

Episode Grid:
  columns: 523.5px 523.5px  // Equal widths (1fr 1fr)
  gap: 32px                  // 2rem
  padding: 32px              // 2rem (NOT 48px!)

Recipe Meta:
  gap: 12.8px                // 0.8rem
  color: rgb(155, 122, 184)  // #9b7ab8
  font-weight: 600
  font-size: 14.4px          // 0.9rem

Episode Meta:
  gap: 12.8px                // 0.8rem (NOT 24px!)
  color: rgb(155, 122, 184)  // #9b7ab8 (NOT rgb(90, 70, 104)!)
  font-weight: 600           // (NOT 500!)
  font-size: 14.4px          // 0.9rem (NOT 15.2px!)
  background: rgba(0, 0, 0, 0) none  // TRANSPARENT (NOT rgba(232, 223, 245, 0.3)!)
  padding: 0px               // NONE (NOT 12.8px 19.2px!)
  border-radius: 0px         // NONE (NOT 12px!)
```

---

## Sign-Off Checklist

### Visual Verification Complete
- [ ] Recipe section matches preview exactly
- [ ] Episode section matches preview exactly
- [ ] Grid layouts identical (2 columns, 2rem gap, 2rem padding)
- [ ] Meta styling identical (NO backgrounds on episode meta)
- [ ] Colors match (#9b7ab8 for meta, #5a4668 for descriptions)
- [ ] Font sizes match (1.8rem titles, 0.9rem meta)
- [ ] Spacing matches (0.8rem meta gap)

### Functional Verification Complete
- [ ] Crystal rating hover works
- [ ] Card hover effects work
- [ ] Expand/collapse works for recipe
- [ ] Expand/collapse works for episode
- [ ] Audio icon hover works

### Responsive Verification Complete
- [ ] Desktop view correct (>768px)
- [ ] Tablet view correct (768px)
- [ ] Mobile view correct (480px)

### Final Approval
- [ ] User confirms 100% match with preview
- [ ] No visual differences remain
- [ ] All functionality working

---

**Prepared By:** Claude Code
**Date:** 2026-01-21
**Status:** Ready for Visual Verification
**Next:** User sign-off after side-by-side comparison
