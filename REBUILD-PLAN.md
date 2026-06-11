# Complete Website Rebuild Plan - Match preview-magical.html EXACTLY

## Goal
Rebuild the React website to be PIXEL-PERFECT identical to preview-magical.html

---

## SECTION 1: Core Structure & Layout

### 1.1 HTML Structure
- [ ] SVG Watercolor Filters (watercolor, watercolor-wash) - MUST be at root level
- [ ] WebGL Watercolor Canvas - fixed background
- [ ] Header - sticky glassmorphism header
- [ ] Grain Overlay - texture layer
- [ ] Whimsy Layer - floating pawprints & blobs (8 pawprints, 6 blobs)
- [ ] Sheltie Sightings - random walks at bottom
- [ ] Floating Action Buttons - back to top
- [ ] Paw Follower Layer - cursor trail
- [ ] Main Container - rounded glassmorphism container
- [ ] Footer - with pawprint rail

### 1.2 Body Background
```css
background: linear-gradient(135deg, #f8f3f9 0%, #fef7f2 50%, #f9f5f8 100%);
```

---

## SECTION 2: Header Navigation

### 2.1 Header Structure
```html
<header class="header">
  <div class="header-content">
    <div>
      <h1 class="brand-title">Sunday Brunch <span class="brand-accent">with</span> Giselle</h1>
      <div class="brand-divider"></div>
      <p class="brand-subtitle">Whimsy, warmth, and wags</p>
    </div>
    <nav class="nav-buttons">
      <button>Home</button>
      <button>Recipes</button>
      <button>Episodes</button>
      <button>Team</button>
      <button>Login</button>
    </nav>
  </div>
</header>
```

### 2.2 Header Styling
- Glassmorphism: `linear-gradient(135deg, rgba(232, 223, 245, 0.4) 0%, rgba(252, 225, 228, 0.4) 100%)`
- `backdrop-filter: blur(20px)`
- `border-bottom: 2px solid rgba(232, 223, 245, 0.3)`
- `position: sticky; top: 0; z-index: 1000`
- Brand title: Italiana font, 1.8rem, #2e1a47
- Brand accent: Pinyon Script, #9b7ab8
- Brand divider: gradient line
- Brand subtitle: Fraunces, 0.85rem, italic, #9b7ab8
- Nav buttons: Fredoka One, white bg, 2px border #e8dff5, 50px border-radius

---

## SECTION 3: Hero Section

### 3.1 Hero Structure
```html
<section class="hero">
  <!-- Alchemy Circle -->
  <div class="alchemy-circle-container">
    <div class="alchemy-circle"></div>
  </div>

  <!-- Left: Content -->
  <div class="hero-content">
    <h1>Sunday Brunch <span>with</span> Giselle</h1>
    <div class="hero-divider"></div>
    <p class="hero-subtitle">Whimsy, warmth, and wags</p>
    <div class="hero-quote-wrapper">
      <p class="hero-quote">Join Giselle and the pack...</p>
    </div>
    <div class="hero-cta-group">
      <a class="whimsical-button whimsical-button--primary">Latest Episode</a>
      <a class="whimsical-button whimsical-button--secondary">Browse Recipes</a>
    </div>
  </div>

  <!-- Right: Image -->
  <div class="hero-visual">
    <div class="photo-frame">
      <div class="watercolor-splatter splatter-1"></div>
      <div class="watercolor-splatter splatter-2"></div>
      <div class="washi-tape"><!-- SVG --></div>
      <img src="..." alt="Stacey and Giselle">
      <div class="glimmer-overlay"></div>
    </div>
  </div>
</section>
```

### 3.2 Hero Styling
- Background: `linear-gradient(135deg, #e8dff5 0%, #fce1e4 50%, #dff0ea 100%)`
- Border: `2px dashed #9b7ab8`
- Border-radius: `16px`
- Padding: `4rem 2rem`
- Min-height: `60vh`
- Grid: `grid-template-columns: 1fr 1fr`
- Gap: `3rem`
- Hero content: `mix-blend-mode: multiply`
- Hero title: Italiana, clamp(2.5rem, 5vw, 4rem), #2e1a47
- Hero script accent: Pinyon Script, #9b7ab8, lowercase
- Hero divider: 260px x 30px wavy SVG divider
- Hero subtitle: Pinyon Script, 1.8rem, #9b7ab8
- Hero quote wrapper: watercolor mask with radial gradients + SVG splatter ::after
- Photo frame: `transform: rotate(-2deg)`, torn paper mask, washi tape at top
- Alchemy circle: floating, rotating background element

### 3.3 Whimsical Buttons
- Primary: `linear-gradient(135deg, #9b7ab8, #c59fdc)`, white text
- Secondary: `linear-gradient(135deg, #e8dff5, #f5ebff)`, #2e1a47 text
- Font: Pinyon Script, 1.6rem
- Border-radius: `50px`
- Pawprints appear on hover (::before left, ::after right)
- Hover: `translateY(-3px)`, stronger shadow

---

## SECTION 4: Recipe Sanctuary Section

### 4.1 Structure
```html
<div class="hero-content-divider"></div>

<section class="recipe-sanctuary">
  <div class="sanctuary-header">
    <h2>The Recipe Sanctuary</h2>
    <p class="sanctuary-subtitle">Where every bake begins with a dash of magic</p>
  </div>

  <!-- Featured Recipe Card -->
  <div class="featured-recipe-card">
    <div class="card-washi-top"><!-- SVG --></div>
    <div class="featured-recipe-grid">
      <div class="featured-image-container">
        <img>
        <div class="category-badge">Featured</div>
      </div>
      <div class="featured-content">
        <h3>Recipe Title</h3>
        <div class="featured-meta">
          <!-- Crystal ratings, time, servings, skill -->
        </div>
        <p class="recipe-description">...</p>
        <div class="featured-actions">
          <button>View Full Recipe</button>
          <button>Leave A Royal Review</button>
        </div>
      </div>
    </div>
  </div>

  <div class="paw-divider">🐾 🐾 🐾</div>

  <!-- Collections Grid -->
  <div class="collections-grid">
    <div class="collection-portal">
      <div class="portal-content">
        <div class="portal-header">
          <div class="portal-icon">⏱️</div>
          <div>
            <div class="portal-title">Sunday Morning Bakes</div>
            <div class="portal-subtitle">Under 30 minutes</div>
          </div>
        </div>
        <div class="portal-preview">
          <div class="preview-thumb">🥐</div>
          <div class="preview-thumb">🍪</div>
          <div class="preview-thumb">🥧</div>
        </div>
        <div class="portal-count">
          <span>12 recipes</span>
          <span class="portal-arrow">→</span>
        </div>
      </div>
    </div>
    <!-- 3 more collection portals -->
  </div>

  <div class="paw-divider">🐾 🐾 🐾</div>

  <!-- Recent Recipes Grid -->
  <div class="recent-grid">
    <div class="library-book">
      <div class="book-cover">🍪</div>
      <div class="book-info">
        <div class="book-title">Lavender Shortbread</div>
        <div class="book-meta">
          <span>⭐ 4.9</span>
          <span>⏱️ 25m</span>
        </div>
      </div>
    </div>
    <!-- More books -->
  </div>
</section>
```

### 4.2 Recipe Sanctuary Styling
- Background: `rgba(255, 255, 255, 0.6)`, `backdrop-filter: blur(30px)`
- Border-radius: `32px`
- Padding: `3rem`
- Border: `3px solid transparent`, gradient border via ::before
- Watercolor splatter accent via ::after
- Sanctuary title: Italiana, 2.5rem, #2e1a47
- Sanctuary subtitle: Pinyon Script, 1.5rem, #9b7ab8

### 4.3 Featured Recipe Card
- Glassmorphism: `rgba(255, 255, 255, 0.9)`, `backdrop-filter: blur(20px)`
- Border-radius: `24px`
- Border: `2px solid rgba(232, 223, 245, 0.5)`
- Grid: `1fr 1fr`, gap `2rem`, padding `2rem`
- Sparkle animation (✨) at top right (::before)
- Watercolor splatter at top left (::after)
- Washi tape centered at top
- Category badge: `#e8dff5` bg, `#2e1a47` text, 50px border-radius
- Image: `aspect-ratio: 4/3`, `border-radius: 16px`
- Crystal ratings (not stars)
- Hover: `translateY(-4px)`, stronger shadow

### 4.4 Collection Portals
- Glassmorphism: `linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.3))`
- `backdrop-filter: blur(20px)`
- Border: `3px solid rgba(255, 255, 255, 0.8)`
- Border-radius: `24px`
- Grid: `repeat(2, 1fr)`, gap `1.5rem`
- Conic gradient ::before on hover
- Portal icon: 2.5rem
- Portal title: Italiana, 1.5rem, #2e1a47
- Portal subtitle: Fraunces, 0.9rem, #9b7ab8
- Preview thumbs: 3 emoji placeholders
- Hover: lift + rotate + stronger shadow

### 4.5 Recent Recipe Grid
- Grid: `repeat(4, 1fr)`, gap `1.5rem`
- Library book cards: glassmorphism `rgba(255, 255, 255, 0.9)`
- Border: `2px solid rgba(232, 223, 245, 0.6)`
- Border-radius: `20px`
- Book cover: large emoji, gradient bg
- Paw emoji appears on hover (::after)
- Hover: `translateY(-8px) rotate(-1deg)`, stronger shadow

---

## SECTION 5: Latest Episode Section

### 5.1 Structure
```html
<section class="latest-episode-section">
  <div class="section__header">
    <h2>Latest Episode</h2>
  </div>
  <div class="episode-card-wrapper">
    <!-- Episode card content -->
    <!-- Newsletter signup form -->
  </div>
</section>
```

### 5.2 Styling
- Background: `rgba(255, 255, 255, 0.6)`, `backdrop-filter: blur(30px)`
- Border-radius: `32px`
- Padding: `3rem`
- Margin: `3rem auto`
- Max-width: `1200px`
- Gradient border via ::before
- Watercolor splatter at top center via ::after
- Episode card: nested glassmorphism wrapper

---

## SECTION 6: Social Proof Section

### 6.1 Structure
```html
<section class="social-proof-section">
  <div class="testimonial-placeholder">
    <p>Real user testimonials coming soon...</p>
  </div>
</section>
```

### 6.2 Styling
- Background: `rgba(255, 255, 255, 0.6)`, `backdrop-filter: blur(30px)`
- Border-radius: `32px`
- Padding: `3rem`
- Margin: `3rem 0`
- Gradient border via ::before (different gradient than recipe sanctuary)

---

## SECTION 7: Footer

### 7.1 Structure
```html
<footer class="footer">
  <div class="footer-pawprints">
    <!-- 6 pawprint SVGs with decreasing opacity -->
  </div>
  <p>&copy; 2024 Sunday Brunch With Giselle</p>
  <div class="footer-links">
    <a href="#">About</a>
    <a href="#">Contact</a>
    <a href="#">Privacy</a>
  </div>
</footer>
```

### 7.2 Styling
- Pawprint rail: 6 paws, opacity decreasing from 0.5
- Center aligned text
- Links with hover effects

---

## SECTION 8: Magical Elements

### 8.1 WebGL Watercolor Canvas
- Full-screen fixed canvas
- Three.js shader with simplex noise
- Pastel gradient colors
- Organic movement animation

### 8.2 Grain Overlay
- Fixed full-screen layer
- SVG noise filter
- `opacity: 0.03`
- `mix-blend-mode: multiply`

### 8.3 Whimsy Layer
- 8 floating pawprints (pastel colors)
- 6 watercolor blobs with blur
- Drift animation (20s for paws, 15s for blobs)
- Different animation delays

### 8.4 Sheltie Sightings
- Random Sheltie walks across bottom
- JavaScript-generated animations
- 8s walk animation

### 8.5 Paw Follower
- Custom cursor with paw icon
- Trail of pawprints following cursor
- Fade out animation

### 8.6 Floating Actions
- Back to top button
- Fixed position bottom right
- Appears on scroll
- Smooth scroll to top

### 8.7 Alchemy Circle
- Floating in hero background
- Dashed circle border
- Radial gradient
- Rotate + float animation

---

## SECTION 9: Typography

### 9.1 Fonts
- **Italiana**: Headings, brand title (serif, elegant)
- **Pinyon Script**: Script accents, hero subtitle, buttons (cursive)
- **Fraunces**: Body text (serif)
- **Fredoka One**: Navigation buttons (fun, rounded)

### 9.2 Font Import
```html
<link href="https://fonts.googleapis.com/css2?family=Italiana&family=Fraunces:ital,wght@0,400;0,700;1,400&family=Pinyon+Script&family=Fredoka+One&display=swap" rel="stylesheet">
```

---

## SECTION 10: Color Palette

### 10.1 Primary Colors
- `#2e1a47` - Midnight Lavender (text)
- `#9b7ab8` - Dusty Plum (accents)
- `#e8dff5` - Pastel Lavender (backgrounds)
- `#fce1e4` - Soft Sakura (backgrounds)
- `#dff0ea` - Mint Cream (backgrounds)
- `#b3d9ff` - Pastel Sky (backgrounds)
- `#5a4668` - Medium plum (quote text)

### 10.2 Glassmorphism
- `rgba(255, 255, 255, 0.4)` - Main container
- `rgba(255, 255, 255, 0.6)` - Recipe sanctuary, episode, social proof
- `rgba(255, 255, 255, 0.9)` - Featured recipe card, recent cards
- `backdrop-filter: blur(20px)` or `blur(30px)`

---

## SECTION 11: Animations

### 11.1 GSAP Animations
- Whimsy layer organic movement
- Entrance animations (slide-in-left, scale-rotate)
- Sparkle animation on featured card

### 11.2 CSS Animations
- Drift (pawprints and blobs)
- Sparkle (rotating sparkle emoji)
- Float and rotate (alchemy circle)
- Sheltie walk
- Button hover effects

---

## SECTION 12: JavaScript Interactions

### 12.1 WebGL Canvas
- Three.js scene setup
- Shader material with simplex noise
- Animation loop

### 12.2 GSAP Timeline
- WhimsyLayer organic yoyo animations

### 12.3 Sheltie Sightings
- Random interval spawning
- Horizontal walk animation
- Remove after animation

### 12.4 Paw Follower
- Track mouse position
- Create trail pawprints
- Fade out after delay

### 12.5 Floating Actions
- Show/hide on scroll
- Smooth scroll to top

### 12.6 Recipe Expansion
- Toggle expanded/collapsed state
- Show full recipe template

---

## IMPLEMENTATION PRIORITY

### Phase 1: Core Structure (CRITICAL)
1. SVG filters at root
2. WebGL canvas
3. Header with glassmorphism
4. Main container
5. Hero section with exact layout
6. Recipe sanctuary wrapper
7. Footer

### Phase 2: Content Sections (HIGH)
1. Featured recipe card with all details
2. Collections grid (4 portals)
3. Recent recipes grid (8 books)
4. Latest episode section
5. Social proof section

### Phase 3: Magical Elements (HIGH)
1. Grain overlay
2. Whimsy layer (pawprints & blobs)
3. Sheltie sightings
4. Paw follower
5. Floating actions
6. Alchemy circle

### Phase 4: Styling Details (MEDIUM)
1. All typography exact matches
2. All colors exact matches
3. All spacing exact matches
4. All border-radius exact matches
5. All shadows exact matches

### Phase 5: Animations & Interactions (MEDIUM)
1. GSAP animations
2. CSS animations
3. JavaScript interactions
4. Hover states
5. Button effects

### Phase 6: Polish (LOW)
1. Mobile responsive
2. Accessibility
3. Performance optimization
4. Browser compatibility

---

## SUCCESS CRITERIA

- [ ] Visual comparison: React site looks IDENTICAL to preview-magical.html
- [ ] All sections present and correctly positioned
- [ ] All magical elements working
- [ ] All animations smooth
- [ ] All interactions functional
- [ ] Typography matches exactly
- [ ] Colors match exactly
- [ ] Spacing matches exactly
- [ ] No missing elements
- [ ] No extra elements

---

**REMEMBER**: The goal is PIXEL-PERFECT replication. Every detail matters.
