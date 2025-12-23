# Design System: Sunday Brunch With Giselle

> [!IMPORTANT]
> This is NOT a corporate blog. This is a **cozy, whimsical, magical baking podcast** brand.
> Think: storybook illustration meets premium cookbook meets warm Sunday morning.
> **DO NOT** use generic corporate styles, bland colors, or basic templates.

## Brand Identity

### Core Values
- **Cozy & Inviting:** Like a warm hug or a fresh cup of tea
- **Whimsical:** A touch of magic and wonder in everyday life
- **Authentic:** Real stories, real baking, real connection
- **Premium:** High-quality, thoughtful, beautifully crafted

### Taglines
- Primary: "Whimsy, Warmth & Wags"
- Secondary: "A Cozy Podcast for Grownups Who Still Believe in Magic"

---

## Unique Color Palette (Softer & Layered)

### Core Palette
```css
/* Primary Palette - Softer, Pastel, Whimsical */
--pale-buttercream: #FFFDE7; /* Main Background */
--light-lemon: #FEF9C3;      /* Highlights */
--pastel-lavender: #E9D5FF;  /* Giselle's brand */
--soft-sakura: #FCE7F3;      /* Light pink accent */
--sage-mist: #D1D5DB;        /* Muted green/grey for depth */
--pastel-sky: #E0F2FE;       /* Light sky blue accent */

/* Text Colors - Deeper, Whimsical Purples (No brown!) */
--midnight-lavender: #2E1A47;  /* Primary text - deep purple/black */
--dusty-plum: #5D4D7A;         /* Secondary text - soft muted purple */

/* Glassmorphism & Translucency */
--glass-bg: rgba(255, 253, 231, 0.4);
--glass-border: rgba(255, 255, 255, 0.5);
--glass-blur: blur(12px);
```

### Color Usage Guidelines
- **Dominance:** Buttercream and Pastel Lavenders should dominate.
- **Accents:** Use Soft Sakura (Pink) and Pastel Sky (Blue) for decorative highlights and secondary tags.
- **Translucency:** Use layered transparency to create a sense of "steamy kitchen window" depth.
- **Minimize Terracotta:** Reserve terracotta (spark) strictly for tiny "pressed" states or critical micro-scale alerts. It should not be used for primary text or large decorative swaths.

---

## Unique Typography (Non-Generic)

### Font Stack

#### Display/Headers (Sophisticated & Unique)
**Italiana** (Google Fonts)
- **Vibe:** Italian elegance meets modern kitchen aesthetic.
- Use for: Main headings (h1, h2), brand title.

#### Body Text (Warm & Characterful)
**Fraunces** (Google Fonts)
- **Vibe:** "Wonky" serif with high personality.
- Use for: Long-form stories and recipes.
- **Feature:** Variable "Soft" axis for a "squishy" delightful feel on certain headers.

#### Script/Accent (Storybook Handwriting)
**La Belle Aurore** or **Pinyon Script** (Google Fonts)
- **Vibe:** Authentic, thin-nib ink writing.
- Use for: Character names and margin notes.

### Typography Scale

```css
/* Font Sizes */
--text-xs: 0.75rem;    /* 12px - tiny labels */
--text-sm: 0.875rem;   /* 14px - small text */
--text-base: 1rem;     /* 16px - body */
--text-lg: 1.125rem;   /* 18px - large body */
--text-xl: 1.25rem;    /* 20px - subheadings */
--text-2xl: 1.5rem;    /* 24px - h3 */
--text-3xl: 1.875rem;  /* 30px - h2 */
--text-4xl: 2.25rem;   /* 36px - h1 */
--text-5xl: 3rem;      /* 48px - hero */

/* Line Heights */
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

### Typography Usage

```css
h1 {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: 700;
  color: var(--sage-green);
  line-height: var(--leading-tight);
}

h2 {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 600;
  color: var(--sage-green);
}

h3 {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--dark-chocolate);
}

body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--dark-chocolate);
}

.script-accent {
  font-family: var(--font-script);
  color: var(--pastel-lavender); /* Changed from terracotta */
}
```

---

## Spacing & Layout

### Spacing Scale

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

### Border Radius

```css
--radius-sm: 0.5rem;   /* 8px - subtle */
--radius-md: 0.75rem;  /* 12px - standard */
--radius-lg: 1rem;     /* 16px - cards */
--radius-xl: 1.5rem;   /* 24px - hero sections */
--radius-full: 9999px; /* pills, buttons */
```

### Shadows

```css
--shadow-sm: 0 2px 4px var(--soft-shadow);
--shadow-md: 0 4px 12px var(--soft-shadow);
--shadow-lg: 0 8px 24px var(--soft-shadow);
--shadow-xl: 0 12px 32px rgba(62, 39, 35, 0.12);
```

---

## Advanced UX Components

### Glassmorphic Cards
- **Effect:** Substrate-like translucency with `backdrop-filter`.
- **Interactivity:** On hover, the "frost" clears or the border glows with a soft pink pulse.

### Micro-Interactions & Delights
- **Pressed State:** Buttons should "sink" into the paper (3D depth).
- **Interactive Graphics:** Rolling pins that rotate on scroll, whisks that vibrate on hover.
- **Modular Layers:** Components slide in from different angles at different speeds (parallax).

### Pills/Tags

```css
.pill {
  background: var(--soft-lavender);
  color: var(--medium-brown);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 600;
}
```

---

## Character Design System

### Character Colors

Each Sheltie has a signature color for their segments:

```css
/* Giselle - The Queen */
--giselle-color: #9B59B6;      /* Royal purple */
--giselle-light: #E8DAEF;

/* Phaedra - The Science Dogter */
--phaedra-color: #3498DB;      /* Smart blue */
--phaedra-light: #D6EAF8;

/* Tiana - The Joyful Taster */
--tiana-color: #F39C12;        /* Warm orange */
--tiana-light: #FCF3CF;

/* Havok - The Kitchen War Correspondent */
--havok-color: #E74C3C;        /* Action red */
--havok-light: #FADBD8;
```

### Character Callout Pattern

```css
.sheltie-tip {
  border-left: 4px solid var(--character-color);
  background: var(--character-light);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  margin: var(--space-6) 0;
}

.sheltie-tip__name {
  font-family: var(--font-script);
  color: var(--character-color);
  font-size: var(--text-lg);
  margin-bottom: var(--space-2);
}
```

---

## Visual Style Guidelines

### Imagery Style
- **Photography:** Warm lighting, shallow depth of field (bokeh), focus on textures (flour, fur, steam)
- **Illustrations:** Soft watercolors or colored pencil textures, storybook quality (not cartoonish)
- **Icons:** Hand-drawn style, organic shapes, warm and friendly

### Decorative Elements
- Subtle paw print patterns
- Whimsical borders (hand-drawn style)
- Kitchen-themed icons (whisks, bowls, measuring cups)
- Soft watercolor splashes as accents
- Delicate flourishes and dividers

### Texture & Depth
- Subtle paper texture overlays
- Soft gradients using brand colors
- Layered shadows for depth
- Organic, imperfect shapes (not rigid grids)

---

## Animation Guidelines

### Micro-Animations

```css
/* Smooth transitions */
--transition-fast: 150ms ease;
--transition-base: 300ms ease;
--transition-slow: 500ms ease;

/* Hover effects */
.interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-base);
}

/* Fade in on scroll */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Loading States
- Use skeleton screens with subtle shimmer
- Brand-colored loading spinners
- Smooth content transitions

---

## Accessibility Requirements

### WCAG AA Compliance
- Color contrast ratio minimum 4.5:1 for body text
- Color contrast ratio minimum 3:1 for large text
- All interactive elements have focus states
- Keyboard navigation fully supported
- Screen reader friendly markup

### Focus States

```css
:focus-visible {
  outline: 3px solid var(--sage-green);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

---

## DO's and DON'Ts

### ✅ DO

- Use warm, inviting colors from the brand palette
- Add soft shadows and rounded corners
- Include whimsical decorative elements
- Use serif fonts for warmth and character
- Create cozy, storybook atmosphere
- Add subtle animations and transitions
- Make it feel premium and thoughtful
- Include character presence throughout

### ❌ DON'T

- Use corporate grays, blues, or generic colors
- Create sharp, angular designs
- Use sans-serif fonts as primary typography
- Make it look like a basic blog template
- Leave it static and lifeless
- Ignore the character personalities
- Make it feel cold or impersonal
- Forget the "magic and whimsy" aspect

---

## Implementation Checklist

When implementing any component or page:

- [ ] Uses brand colors (no generic colors)
- [ ] Uses brand fonts (loaded from Google Fonts)
- [ ] Has appropriate spacing and padding
- [ ] Includes soft shadows and rounded corners
- [ ] Has hover/focus states with transitions
- [ ] Meets WCAG AA accessibility standards
- [ ] Feels warm, cozy, and inviting
- [ ] Includes whimsical touches where appropriate
- [ ] Works responsively on mobile
- [ ] Has proper loading and error states

---

## Reference

For complete brand guidelines, see: `brand_style_guide.md`
For UX patterns, see: `ux-fe-design.md`
For product requirements, see: `prd.md`
