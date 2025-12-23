UX/FE Design Brief (MVP)
========================

> **CRITICAL:** This is a **cozy, whimsical, magical baking podcast** brand, NOT a corporate blog.
> See `design-system.md` for complete brand guidelines.

## Brand Identity Requirements

**Visual Style:** Warm, inviting, storybook-quality design with soft watercolors and premium cookbook aesthetic.

**Color Palette:** Lavender (#E9D5FF), Soft Sakura (#FCE7F3), Pale Buttercream (#FFFDE7), and sparse Light Sky Blue (#E0F2FE). NO generic grays or corporate colors. Text in Midnight Lavender (#2E1A47).

**Typography:** Unique, non-generic pairings (Italiana for headers, Fraunces for body, Pinyon Script for accents). NO generic sans-serif.

**Character:** Include Sheltie character presence, whimsical decorative elements, soft shadows, rounded corners, and micro-animations.

**Atmosphere:** Cozy Sunday morning, warm hug, magical storybook. NOT cold, corporate, or basic template.

---

Page Templates
- Recipe: Hero (title, hero image, metadata), “Jump to recipe”, story lead, structured recipe (ingredients/steps/time/yield), tools-used block (with disclosure), print/save/share + copy ingredients, inline ConvertKit CTA, related/seasonal modules.
- Episode: Hero/title, audio player with in-app/download fallbacks, show notes/links, transcripts/captions, ConvertKit CTA, related recipes/episodes.
- Media Kit: Audience/voice summary, allow/deny categories, inventory (site/email/audio), sample placements/benchmarks (text), sponsor contact form (accessible, with confirmation).
- Optional Home: Highlight current episode/recipe, CTA, latest grid, seasonal collection.

Core Components (reuse)
- Layout (header/nav/footer + site-wide CTA).
- CTA form (ConvertKit; value copy “Get recipes, Sunday letters, early drops”; accessible states, success/error).
- Jump-to-recipe anchor/button (keyboard/reader friendly).
- Recipe block (structured fields; semantic headings/lists; print CSS).
- Tools-used block (list with links + category tags; adjacent disclosure).
- Audio player (basic controls; fallback links; error message + transcript available).
- Related content module (cards; hides gracefully).
- Share/Print/Copy controls (accessible, mobile-friendly).
- Forms: email signup, sponsor contact (labels, focus states, inline validation/confirmations).

Responsive & A11y
- Mobile-first layouts; jump-to and CTA visible on mobile.
- WCAG AA: headings, alt text, focus styles, keyboard nav, ARIA where needed; accessible forms/anchors; transcripts/captions always.
- Print-friendly recipe view; test on mobile Safari/Chrome; no IE support.

States to Design
- Loading/skeleton for recipe/episode.
- Form success/error.
- Audio error/fallback.
- Empty related content.
- Print view.

Copy/Content Notes
- CTA copy: “Get recipes, Sunday letters, early drops.”
- Tools-used disclosure visible near links.
- Media kit: brand-safety allow/deny list and expected response time shown.
