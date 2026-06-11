# Pixel-Parity Audit — Live Site vs `preview-magical.html`

**Date:** 2026-06-10 · **Reviewer:** Sally (UX) + 6 specialized audit agents
**Reference:** `preview-magical.html` (desktop-only artifact, zero media queries)
**Live:** `http://localhost:5178/` (Vite React app, `sunday-brunch-website/`)
**Method:** Full preview source read; section-by-section code diff of all live components; runtime computed-style diff at 1440×900 via Playwright; paired scroll-position screenshots (desktop + mobile) in `parity-review/shots/`.

**Headline numbers:** Preview page height 6,246px vs live 4,970px (Δ −1,276px). ~120 discrete differences found, including 3 outright CSS bugs and 1 JS bug.

Severity: **H** = obvious visual shift · **M** = noticeable at a glance · **L** = close inspection only.
Type: STYLE / STRUCTURE / DATA (content-driven, not CSS) / BUG / DECISION (needs your call).

---

## 0. Global & Cross-Cutting

| # | Finding | Preview | Live | Sev/Type |
|---|---------|---------|------|----------|
| G1 | Body background gradient missing (visible pre-canvas-load / WebGL failure) | `linear-gradient(135deg,#f8f3f9,#fef7f2,#f9f5f8)` | `transparent` (`index.css:148,159`); `:root` buttercream `#FFFDE7` | L STYLE |
| G2 | Base line-height token off — appears on ~20 elements | computed 25.6px (1.6×16) | 26px (≈1.625) — one token fix clears them all | M STYLE |
| G3 | Grain overlay texture silently destroyed | SVG fractal-noise bg image, opacity .03 | `WatercolorCanvas.css:36` re-declares `.grain-overlay` with `background-image: var(--paper-grain)` where `--paper-grain` is a **color** (`index.css:41`) → invalid → no grain once Three.js chunk loads | M BUG |
| G4 | Malformed CSS comment kills `body { position:relative }` | — | `index.css:164` `\*` instead of `/*` | M BUG |
| G5 | Live has responsive media queries throughout; preview has none | n/a | mobile rules everywhere; two mutually contradicting responsive blocks inside `WhimsicalHero.css` (370-426 vs 776-855) | DECISION |
| G6 | Watercolor canvas wrapper missing `pointer-events:none` | present | absent (`WatercolorCanvas.css:1-9`) | L STYLE |
| G7 | Fonts | Google Fonts URL identical | identical + preconnect (perf-only) | ✅ MATCH |
| G8 | `.container` | exact | exact (`Home.css:17-26`) | ✅ MATCH |

## 1. Header & Navigation

| # | Finding | Preview | Live | Sev/Type |
|---|---------|---------|------|----------|
| H1 | Active nav pill state exists only in live | no active state | `.nav-button.active` filled `#d4c5e8` + purple border (`Header.css:96-105`) | H DECISION |
| H2 | Header box-shadow added | none | `0 4px 30px rgba(0,0,0,.1)` (`Header.css:13`) | M STYLE |
| H3 | Brand divider opacity | 0.5 | `1 !important` (`Header.css:51`) — reads twice as strong | M STYLE |
| H4 | Nav pills are `<a>` (inherit line-height 1.6) vs preview `<button>` (~normal) → live pills ~5-6px taller; live Login is still a `<button>` so it's shorter than its sibling pills | buttons | NavLinks + button (`Layout.jsx:70-105`) | M STYLE |
| H5 | Nav button text color | UA black | `#2e1a47` (`Header.css:87`) | L STYLE |
| H6 | Brand title wrapped in link w/ two conflicting hover rules (opacity .8 AND scale 1.02 both apply) | plain `<h1>`, no hover | `Layout.jsx:57-65`, `Header.css:141` vs `App.css:77` | L/M STYLE |
| H7 | Login slot becomes UserMenu when authenticated | always Login | conditional (`Layout.jsx:102-114`) | L DECISION |
| H8 | Candy stripe bar: preview *describes* it in design notes but never implements it; live's closest rule is overridden (see D1) | not rendered | not rendered | n/a (note) |
| H9 | Everything else: header gradient, blur(20px), border-bottom, padding, sticky, brand typography, nav pill chrome + hover | — | — | ✅ MATCH |

## 2. Hero Section

| # | Finding | Preview | Live | Sev/Type |
|---|---------|---------|------|----------|
| HE1 | **3-line title wrap at 1440px** — root cause: live-only `@media (min-width:1400px)` (`WhimsicalHero.css:858-873`) bumps title to 4.5rem/72px + hero padding to 5rem 4rem (columns 462px vs 494px) | clamp caps 4rem/64px, padding 4rem 2rem | 72px in narrower column → 3 lines (+89px height) | H STYLE |
| HE2 | Same media block sets `.hero { margin:0 auto }` → kills `margin-bottom:3rem` above divider | 48px gap | 0px | H STYLE |
| HE3 | Hero background alpha | opaque tri-pastel gradient | same stops at **0.7 alpha** + `backdrop-filter: blur(15px)` added (`WhimsicalHero.css:7-12`) — washed-out look | H STYLE |
| HE4 | `.hero-script-accent` "with" | inline, no margin | `inline-block; margin:0 0.5rem` (`WhimsicalHero.css:460-468`) → +16px unbreakable width, contributes to wrap | H STYLE |
| HE5 | Whimsical buttons line-height | inherits 1.6 → h 70.5px | `normal` (`WhimsicalButton.css:19`) → 19-23px taller per runtime (interaction w/ inner paw, see B1) | M STYLE |
| HE6 | Washi tape drop-shadow added | none | `drop-shadow(0 2px 4px rgba(0,0,0,.1))` (`WhimsicalHero.css:714`) | M STYLE |
| HE7 | Missing `.hero-wrapper` relative wrapper | present | hero + divider direct children of container (`Home.jsx:36-40`) | L STRUCTURE |
| HE8 | `.hero-content` adds `position:relative; max-width:550px` (latent) | absent | `WhimsicalHero.css:433-435` | L STYLE |
| HE9 | Photo frame `max-width:600px` at ≥1400px | none | `WhimsicalHero.css:871` | M STYLE |
| HE10 | Everything else: hero border/radius/min-height/grid/gap, title font/clamp(base), wavy divider SVG, subtitle, quote wrapper + masks + splatter, CTA group, primary/secondary button chrome + 🐾 hover, photo frame rotate/shadow/torn-paper mask (byte-identical), washi geometry + SVG, splatters + breathe, glimmer, alchemy circle, slideInLeft/scaleRotate keyframes, all text content | — | — | ✅ MATCH |

## 3. Divider Below Hero

| # | Finding | Preview | Live | Sev/Type |
|---|---------|---------|------|----------|
| D1 | **Divider invisible** — `Home.css:32-45` uses `var(--mint-cream)` which is **defined nowhere** → entire gradient invalid → renders as empty 4px gap. Also a second conflicting rule (`App.css:226-232`, 12px candy stripe) loses fragilely on chunk order | 3px soft gradient, margin 3rem 0 | invisible 4px gap, margin 0 auto 4rem | H BUG |

## 4. Recipe Sanctuary

| # | Finding | Preview | Live | Sev/Type |
|---|---------|---------|------|----------|
| S1 | Sanctuary bg/blur | `rgba(255,255,255,.6)` blur 30 | `.45` blur 25 (`RecipeSanctuary.css:6-7`) | H STYLE |
| S2 | Sanctuary header margin-bottom | 2.5rem | 1.75rem (`RecipeSanctuary.css:54`, "user preference" comment) | M DECISION |
| S3 | Duplicate conflicting sanctuary CSS — preview-correct copies in `RecipeCollectionsSection.css` lose on import order | — | fragile cascade | M BUG-ish |
| S4 | Featured card washi tape | 150px wide, rotate(−2deg), top −12px | 200px, **no rotation**, top −15px, + drop-shadow (`FeaturedRecipeCard.css:24-30`) | M STYLE |
| S5 | Featured-meta row conditional on Supabase ratings — crystals + time + skill all vanish if fetch fails/null | always rendered | `FeaturedRecipeCard.jsx:96-107` | H STRUCTURE |
| S6 | Crystal count color | `#9b7ab8` | `#5a4668` (`CrystalRating.css:30`) | L STYLE |
| S7 | Meta values / description / image / crystal fill count | (127), 90 min, Advanced, Unsplash | DB count, 1 hr, Intermediate, local img, `Math.round(avg)` | DATA |
| S8 | `.featured-content` adds `height:100%` | absent | benign | L STYLE |
| S9 | Card chrome, hover, ✨ sparkle, splatter, grid, badge, washi SVG internals | — | — | ✅ MATCH |

### Collection portals

| # | Finding | Preview | Live | Sev/Type |
|---|---------|---------|------|----------|
| C1 | **Preview-thumb row absent at runtime** — portals render 0 thumbs because the one real recipe matches no collection filter; `.portal-preview` only renders when ≥1 match (`RecipeCollectionCard.jsx:40`). Portal height 177.6px vs preview 331px (−683px section impact) | 3 emoji thumbs always | empty | H DATA+STRUCTURE |
| C2 | Recipe count shows sliced length (cap 3, currently 0) — can never display "12 recipes" | true counts | `previewRecipes.length` (`RecipeCollectionsSection.jsx:66`) | H BUG |
| C3 | Thumbs are `<img>` cover tiles when data exists | 1.5rem emoji on translucent white | images (`RecipeCollectionCard.jsx:47-51`) | M DECISION |
| C4 | Grid class renamed `.recipe-collections-grid` | `.collections-grid` | rename only | L STRUCTURE |
| C5 | Portal titles/subtitles/icons differ; live is season-dynamic (Summer ☀️ in June vs preview Winter 🍂) | static 4 | `data/collections.js` | DATA/DECISION |
| C6 | `.portal-title` margin 0.2rem added | none | `RecipeCollectionsSection.css:369` | L STYLE |
| C7 | Whole portal rule-set duplicated twice in same file with small deltas | — | fragility | L BUG-ish |
| C8 | Loading skeletons (4 pulsing cards) live-only | none | `RecipeCollectionsSection.jsx:81-95` | L DECISION |
| C9 | Portal chrome, conic hover, colors, count/arrow styles | — | — | ✅ MATCH |

### Fresh from the Oven

| # | Finding | Preview | Live | Sev/Type |
|---|---------|---------|------|----------|
| F1 | Only 1 library-book tile renders (8 in preview) — data: exactly one non-placeholder recipe exists; grid h 328px vs 680px. **CSS itself matches exactly** | 8 books | 1 book (`lib/content.js:31`, `data/content.js`) | H DATA |
| F2 | Book meta spans conditional (rating only if >0, time only if exists) | always ⭐ + ⏱️ | conditional (`RecentRecipesGallery.jsx:104-109`) | M STRUCTURE |
| F3 | Gallery returns `null` when empty → dangling paw divider | n/a | `RecentRecipesGallery.jsx:81-83` | L STRUCTURE |
| F4 | Library-book styles, h3, grid, hover, browse CTA layout | — | — | ✅ MATCH |

## 5. Expanded Recipe State (View Full Recipe) — wholesale redesign

Preview expands **inside the card** (washi/sparkle/image stay; dashed top seam). Live **replaces the card** with `RecipeTemplate` (scrapbook redesign). Item-level:

| # | Finding | Sev/Type |
|---|---------|----------|
| X1 | Card replaced, not expanded — washi, ✨, splatter vanish (`FeaturedRecipeCard.jsx:35-50`) | H STRUCTURE/DECISION |
| X2 | Container: dashed seam + white .5 → `.scrapbook-paper` glass, max-width 1000px (`RecipeTemplate.css:1-18`) | H STYLE |
| X3 | Extra live-only elements: JumpToRecipe, PinterestButton, float bubbles, bg paws, double washi, ToolsUsed, Baker's Notes, RelatedContent, achievements | M DECISION |
| X4 | Dietary badges redesigned: 44px icon pills w/ tooltips vs flat pastel pills (`DietaryBadges.css`) | H STYLE/DECISION |
| X5 | "Contains X" badges → separate yellow ⚠️ AllergenWarnings box (not in preview) | M STRUCTURE |
| X6 | Baker's Prep: centered + ✦ markers vs left-aligned disc bullets | M STYLE |
| X7 | Sheltie tip avatars: SVG illustrations vs 80px photos; adds wiggle + blur | M STYLE/DECISION |
| X8 | Action buttons: shadow removed, hover/copied states added | L STYLE |
| X9 | Two-col grid `1fr 1.2fr` vs `1fr 1fr` (`RecipeTemplate.css:188`) | M STYLE |
| X10 | Ingredients: RecipeCalculator (US/Metric, 0.5/1/2× pills, speech bubble, **no checkboxes/select/dashed dividers**) vs servings select + checkbox list | H STYLE/DECISION |
| X11 | Panel chrome: white .7/radius 16/1px + h4 dashed underline vs white .8/radius 12/2px plain | M STYLE |
| X12 | Nutrition Facts: FDA black-label redesign vs preview's soft card | H STYLE/DECISION |
| X13 | Steps: "Instructions" single panel, plain 2rem number glyph — the preview-matching 40px gradient circle class `.process-step__number` **exists but JSX uses `.step-number` instead** (`ProcessStep.jsx:13`) | H STYLE |
| X14 | Reviews: GiselleGuestbook (textarea, seeded reviews, character replies, no aggregate "127 reviews • 4.9/5") vs preview's compact crystal review block | H STYLE/DECISION |
| X15 | Collapse strip adds 3px dashed border-top (`FeaturedRecipeCard.css:199-205`) | L STYLE |
| X16 | Step/story/badge content differs | DATA |

## 6. Latest Episode Section

| # | Finding | Preview | Live | Sev/Type |
|---|---------|---------|------|----------|
| E1 | Section bg/blur | `.6` / blur 30 | `.45` / blur 25 (`LatestEpisodeSection.css:6-8`) | H STYLE |
| E2 | `.section-title` weight | bold (UA h2) | explicit 400 (`LatestEpisodeSection.css:58`) — runtime-confirmed lighter | M STYLE |
| E3 | Card hover silently overridden by duplicate rule | −4px / shadow .25 | −2px / weaker shadow (`FeaturedEpisodeCard.css:151-154` wins over :18-21) | H BUG |
| E4 | Card margin/max-width | margin-bottom 2rem | `margin:0 auto; max-width:1200px` (`FeaturedEpisodeCard.css:14-15`) | M STYLE |
| E5 | Washi tape | 150×30, rotate(−2deg), top −12 | 220×40, no rotation, top −16, + shadow (`FeaturedEpisodeCard.css:23-33`) | H STYLE |
| E6 | Washi anchor: live card is `position:relative` so tape anchors to card; preview card isn't, tape anchors to section | section edge | card edge | H STYLE (preview quirk — decide) |
| E7 | **Audio icon circle 100px vs 120px** (`FeaturedEpisodeCard.css:58-59`) + live-only hover scale/rotate | 120px | 100px | H STYLE |
| E8 | Episode content column: gap 1.5rem + `justify-content:center` vs gap 1rem + space-between; h3/date margin resets | preview rhythm | tighter (`FeaturedEpisodeCard.css:78-94`) | M STYLE |
| E9 | `.episode-date` missing `font-style:italic`; runtime shows 20.8px vs 16px (and the 1.3rem token resolves differently vs preview) | italic | normal (`FeaturedEpisodeCard.css:90-95`) | M STYLE |
| E10 | `.episode-content p` rule missing (1rem/1.5) | present | inherits 1.6 | L STYLE |
| E11 | `.button-centered` cross-file collision (FeaturedRecipeCard vs FeaturedEpisodeCard definitions; print-hide) | single rule | fragile (`FeaturedEpisodeCard.css:112-114` vs `FeaturedRecipeCard.css:183-187`) | M BUG-ish |
| E12 | Inline paw SVG inside "Listen Now" wraps to its own line (block div in inline-block button) → button taller, two-line look | text-only | `showPaw` default true (`WhimsicalButton.jsx:13`, `FeaturedEpisodeCard.jsx:82-88`) | H STYLE |
| E13 | Title "Episode 1: …" prefix; description = notes[0] placeholder | bespoke copy | `data/content.js:236-240` | DATA |
| E14 | Section chrome (gradient border, splatter, radius, padding), card chrome, waveform gradient, washi SVG internals, date/meta text | — | — | ✅ MATCH |

### Expanded episode state — wholesale redesign (mirror of section 5)

| # | Finding | Sev/Type |
|---|---------|----------|
| EX1 | Card unmounted and replaced by `EpisodeTemplate` vs in-card expansion | H STRUCTURE/DECISION |
| EX2 | Container white .95/radius 24/no dashed seam vs dashed top + white .5 | H STYLE |
| EX3 | Centered header w/ double washi + scattered paws + clamp title vs left-aligned h3 2rem | H STYLE |
| EX4 | "32 minutes" duration dropped | M DATA |
| EX5 | Body grid `1fr 300px` vs `1fr 1fr` | H STYLE |
| EX6 | Audio player: buttercream "Alchemical Tuner" chrome vs lavender placeholder box (content replacement intended; chrome differs) | M STYLE |
| EX7 | Giselle's comment: GiselleWhisper paper-card (rotateY, overhanging right −100px, 32px SVG avatar, "Host Whisper") vs tri-pastel dashed box w/ 80px photo + "Giselle whispers…" Pinyon | H STYLE/DECISION |
| EX8 | Whisper text truncated (loses Phaedra microphone joke) | M DATA |
| EX9 | SheltieSoundboard inserted (no preview counterpart) | M DECISION |
| EX10 | Chapter Notes: glass-card + sakura underline vs white .8 card, plain h4 | H STYLE |
| EX11 | Featured Magic: RelatedContent text links vs 60px emoji-tile recipe card with arrow line | H STYLE |
| EX12 | Related Episodes: full-width below grid, "Related", plain links vs right-column mint link-cards w/ translateX hover | H STYLE |
| EX13 | Collapse area adds dashed border-top in wrong lavender (#E9D5FF vs #e8dff5) | M STYLE |
| EX14 | Chapter notes/related items data sparse vs preview's 5 bullets + 3 episodes | M DATA |

## 7. Newsletter (CTAForm)

| # | Finding | Preview | Live | Sev/Type |
|---|---------|---------|------|----------|
| N1 | **Runtime structure mismatch**: preview `.newsletter-form` card chrome (lavender .3 bg, 16 radius, 2px dashed, 32px padding, 1002×222) — runtime shows live form unstyled (transparent, no border, 500×82). Code has the right CSS in `CTAForm.css` for `.cta`; verify classname wiring (`.cta.newsletter` vs `.newsletter-form`) and why chrome doesn't render | styled card | unstyled flex form | H BUG/STYLE |
| N2 | Subcopy | "Join our cozy community of bakers and storytellers" | "Recipes, Sunday letters, early drops." (`CTAForm.jsx:9`) | H DATA |
| N3 | Button label | "Subscribe" | "Get updates" / "Signing up..." (`CTAForm.jsx:135-137`) | H DATA |
| N4 | Inline paw in Subscribe button (same as E12) | text-only | showPaw default | H STYLE |
| N5 | Placeholder | your@email.com | you@example.com | L DATA |
| N6 | Heading element h4 vs h3 (same look) | h4 | h3 | L STRUCTURE |
| N7 | Live-only: input focus ring/placeholder color, status chips, ≤720px stacking | — | enhancements | L DECISION |
| N8 | Input geometry runtime: 321×58 vs 234×82 | — | follows N1/N4 | H (symptom) |

## 8. Social Proof

| # | Finding | Preview | Live | Sev/Type |
|---|---------|---------|------|----------|
| P1 | Title left-aligned w/ pink underline + right-side script subtitle — caused by `App.css:282-289 .section__header` flex (loads before Home.css; Home.css override only sets text-align which is useless in flex) | centered title, no underline | left + underline + subtitle (`SocialProofSection.jsx:144-147`) | H STYLE |
| P2 | "Real reviews from our baking community" subtitle added | absent | present | H DECISION |
| P3 | "Join the Community" CTA added (with inline paw) | absent | `SocialProofSection.jsx:197-203` | H DECISION |
| P4 | Section height 795px vs preview placeholder 311px — carousel is intended content (preview explicitly placeholders it) | placeholder | carousel | OK by design |
| P5 | Preview note says testimonials keep "washi tape and sheltie graphics" — TestimonialCard has neither (only 🐾 + letter avatar) | washi+sheltie | absent | L DECISION |
| P6 | Section chrome (gradient border etc.) | — | — | ✅ MATCH |

## 9. Footer

| # | Finding | Preview | Live | Sev/Type |
|---|---------|---------|------|----------|
| FT1 | Background | lavender→pink 135deg glass + blur(10px) | `to top` sakura→transparent, no blur (`App.css:334`) | H STYLE |
| FT2 | Top edge | 2px solid lavender border | scalloped SVG ::before overhang (`App.css:344-353`) | H STYLE |
| FT3 | Padding/margin | 2rem 3rem / margin-top 4rem | 5rem 2.5rem / margin 0 — footer ~2.5× taller | H STYLE |
| FT4 | Pawprint rail layout CSS missing — no flex/gap/margin rule exists → paws flush, baseline-aligned | gap 1rem + margin-bottom 1rem | none (`Layout.jsx:125-138`) | M BUG |
| FT5 | Paw fill `#E9D5FF` vs `#e8dff5` | — | `Layout.jsx:129` | L STYLE |
| FT6 | Copyright color/size | `#5a4668` 0.95rem | inherits `#2E1A47` 1rem | M STYLE |
| FT7 | Paw geometry, opacity series (0.5→0.10), copyright text/year | — | — | ✅ MATCH |

## 10. Ambient Magic Layers & Interactions

| # | Finding | Preview | Live | Sev/Type |
|---|---------|---------|------|----------|
| A1 | Shader mouse distortion dead — R3F `state.mouse` only updates from canvas pointer events; canvas at z −1 never gets them | document mousemove | `WatercolorCanvas.jsx:85` | H BUG |
| A2 | Canvas lazy-loaded (flat color flash pre-load) | immediate | `Layout.jsx:8,44-46` | M DECISION |
| A3 | uTime: real clock vs fixed 0.016/frame (refresh-rate-dependent speed) | frame-based | clock-based | L STYLE |
| A4 | Whimsy paw artwork is the *cursor* paw design, not the 4-ellipse whimsy paw | 4-ellipse | `Decorations.jsx:15-22` via `WhimsyLayer.jsx:69` | M STYLE |
| A5 | Paw double-opacity (internal 0.6 × GSAP 0.1-0.3 → 0.06-0.18) — ~40% fainter | 0.1-0.3 | compounded | M STYLE |
| A6 | Blob alpha: solid hex vs rgba(.3) → ~3.3× more saturated | rgba .3 | solid (`WhimsyLayer.jsx:17,81`) | M STYLE |
| A7 | Blob sizes randomized 120-200 vs fixed set | fixed | random | L STYLE |
| A8 | Motion model: preview CSS drift keyframes override GSAP (scale 1, ±20px/±8°); live removed CSS anim so full GSAP random rot/scale .5-2 shows | constrained drift | wilder drift | M STYLE/DECISION |
| A9 | Sheltie silhouette artwork completely different (abstract 3-path, no eye vs detailed ellipse dog) | detailed | `Decorations.jsx:75-85` | H STYLE |
| A10 | Sheltie: framer opacity tween redundant w/ CSS keyframes; single-instance limiter | layered walks | `SheltieSightings.jsx:10-43` | L STYLE |
| A11 | Floating cluster: TWO buttons (hubbub sound toggle + back-to-top) vs ONE | 1 circular | 2 (`FloatingActionButtons.jsx:114-132`) | H DECISION |
| A12 | Unstyled `.btn-label` text crammed into 60px circle → "labeled rectangle" look (no CSS rule exists) | icon-only | raw label text | H BUG |
| A13 | Back-to-top icon: SheltieSilhouette + emoji vs up-arrow SVG; 24px vs 30px | arrow 30px | sheltie 24px (`FloatingActionButtons.css:42-46`) | M STYLE |
| A14 | **Sparkle explosions clipped** — particles appended inside button (`overflow:hidden`) with position:absolute vs body-level fixed at cursor; burst mostly invisible | body, z 9999 | in-button, z 10 (`WhimsicalButton.jsx:85`) | H BUG |
| A15 | Particle colors: `#E9D5FF`/`#FCE7F3`/`#FEF9C3` inline vs `#D6BCFA`/`#fce1e4`/`#fff3e0` | preview palette | CSS-var palette overriding correct CSS | M STYLE |
| A16 | Three same-named `@keyframes sparkle-burst` in cascade; preview-faithful one in `index.css:290-304` is dead; live adds rotation + different flour end-scale | one keyframe | conflicting (`WhimsicalButton.css:99-124`) | M BUG-ish |
| A17 | Recipe action buttons (Copy/Print) produce no sparkles (preview wires `.action-button`) | sparkles | none (`RecipeTemplate.jsx:192-195`) | M STYLE |
| A18 | **Paw trail purge bug** — `Date.now() - p.id` is NaN (id is a string) → every trail paw deleted on each 5s sweep | 2s linger + fade | trail wiped (`PawFollower.jsx:80`) | H BUG |
| A19 | Trail fade timing invalid framer syntax → default tweens instead of 2s linger/0.8s fade/scale .2 | spec'd | broken (`PawFollower.jsx:102-105`) | M BUG |
| A20 | Trail transform overwritten by framer (offset +16px, unrotated) | centered ±15° | `PawFollower.jsx:109` | M BUG |
| A21 | Cursor paw never hides on mouseleave (no `.is-visible` rule; base opacity .6) | hides | always visible (`PawFollower.css:28-35`) | M STYLE |
| A22 | Cursor lag 0.1s tween vs synchronous | instant | rubber-band | L STYLE |
| A23 | Live-only: dark-button white-paw mode, click listener, zIndex 99999 | absent | `PawFollower.jsx:20-28,88-91` | L DECISION |
| A24 | Live-only mounted extras: JumpToRecipe, WhimsicalLoader, AchievementToaster, AuthModal/UserMenu | absent | various | DECISION |
| A25 | Dead code: PrismLayer + EphemeraEngine implemented but never imported; dead WhimsicalButton import in Layout | n/a | cleanup | L |
| A26 | Shader code, grain CSS (own file), whimsy layer geometry/GSAP ranges, sheltie timings/probability, floating chrome/trigger, particle counts/sizes/physics, SVG filters, entrance animations, glimmer, alchemy circle, splatters, z-order | — | — | ✅ MATCH |

---

## Decision Points (need your call before/with sign-off)

1. **Expanded recipe & episode experiences (X1-X16, EX1-EX14)** — the live `RecipeTemplate`/`EpisodeTemplate` are deliberate, richer redesigns (calculator, FDA nutrition label, guestbook, soundboard). Pixel-parity literally means demolishing them in favor of the preview's simpler in-card expansion. Options: (a) full parity — replace; (b) keep live templates, restyle their chrome to preview design language (tri-pastel boxes, dashed borders, white .8 panels, gradient step circles); (c) hybrid — preview in-card layout, keeping calculator + guestbook as upgraded internals. **My recommendation as your UX designer: (c).**
2. **Live-only UX features** — active nav pill (H1), UserMenu (H7), hubbub toggle (A11), "Join the Community" (P3), social subtitle (P2), loading skeletons, status chips, focus rings. These are *good UX* the preview never specified. Keep (restyled to preview language) or remove for strict parity?
3. **Mobile** — preview has no responsive rules. Pixel parity is only definable at desktop. Proposal: parity at ≥1200px; keep live's responsive behavior below, derived from preview proportions.
4. **Data gaps** — portals' empty thumbs and the single "Fresh from the Oven" book are data problems (1 real recipe). Fix via seed/sample data or design fallbacks (emoji covers — which is exactly preview's look)?
5. **Seasonal collections** — live is season-dynamic (Summer in June); preview hardcodes Winter. Keep dynamic?
6. **Washi anchor quirk (E6)** — preview's episode washi anchors to the *section* (arguably a preview bug). Match the quirk or keep live's sensible card anchor?

## Remediation Plan (phased; ~6 phases)

### Phase 1 — Bug squash (no design decisions needed) 
1. Define `--mint-cream` or replace divider gradient with preview's literal colors; delete the conflicting `App.css:226` rule (D1).
2. Fix `.grain-overlay` override in `WatercolorCanvas.css:29-41` — remove it or point at the real noise image (G3).
3. Fix `index.css:164` malformed comment (G4).
4. PawFollower: store numeric timestamp for purge; fix framer transition syntax; preserve rotation/centering via motion props; add `.is-visible` handling (A18-A21).
5. FeaturedEpisodeCard: delete duplicate weaker `:hover` rule at :151 (E3).
6. Sparkles: portal particles to `document.body` at cursor coords, `position:fixed`, z 9999; restore preview palette; consolidate to ONE `sparkle-burst` keyframe (A14-A16).
7. Shader mouse: feed `uMouse` from a window-level pointermove listener (A1).
8. Portal recipe count: count full matches, not the 3-slice (C2).
9. Resolve duplicate-rule fragility: de-dupe sanctuary styles, portal double-definitions, `.button-centered` collision, brand-link double rule (S3, C7, E11, H6).

### Phase 2 — Global tokens & typography
10. Body bg gradient fallback behind canvas (G1).
11. Normalize base line-height to 1.6/25.6px (G2).
12. Buttons: line-height to inherit (HE5); `showPaw` default false or inline-flex icon layout (E12/N4); audit all WhimsicalButton call sites.
13. `.section-title` weight bold (E2).

### Phase 3 — Header & footer parity
14. Remove header shadow; divider opacity .5; nav pill line-height normalize (a vs button); decide H1 active state (keep restyled is my rec); single brand hover behavior (H2-H6).
15. Rebuild footer to preview spec: gradient, blur, border-top (drop scallop), padding 2rem 3rem, margin-top 4rem, `.footer-pawprints` flex/gap/margin rule, paw fill #e8dff5, copyright #5a4668 .95rem (FT1-FT6).

### Phase 4 — Hero & section chrome
16. Delete/neutralize the ≥1400px hero media block (or scope it to ≥1600px): restores 4rem title, 4rem 2rem padding, margin-bottom 3rem (HE1-HE2, HE9).
17. Hero bg to opaque gradient; remove backdrop blur (HE3).
18. Script accent: inline, no margins (HE4). Remove washi drop-shadow (HE6). Restore `.hero-wrapper` (HE7).
19. Sanctuary + episode section: bg .6, blur 30; header margin 2.5rem pending S2 decision (S1, E1).
20. Social proof: scope/override `.section__header` flex — center title, drop underline; decide subtitle/CTA (P1-P3).

### Phase 5 — Cards & content modules
21. Washi tapes: 150×30, rotate(−2deg), top −12px, no shadow — featured recipe AND episode cards (S4, E5); decide E6 anchor.
22. Featured meta: render unconditionally with graceful fallbacks (S5); count color (S6).
23. Episode card: icon container 120px; content gap 1rem + space-between; date italic + 1.3rem audit; restore `.episode-content p` rule; margin-bottom 2rem (E4, E7-E10).
24. Newsletter: restore card chrome wiring (N1); copy "Join our cozy community…", "Subscribe", placeholder (N2-N5).
25. Portals: emoji-thumb fallback when no image (matches preview); fix counts; remove title margin (C1-C6).
26. Recent gallery: unconditional meta with sensible fallbacks (F2); empty-state decision (F3).
27. Seed/sample data so 4+ portal matches and 8 recent recipes render (Decision 4).

### Phase 6 — Ambient layer fidelity + expanded states (post-decision)
28. Whimsy: correct paw SVG, remove double opacity, rgba(.3) blobs, fixed sizes, pick motion model (A4-A8).
29. Sheltie sightings artwork to preview silhouette (A9); minor anim cleanup (A10).
30. Floating cluster: 60px circle icon-only back-to-top w/ 30px arrow; hubbub decision (A11-A13); style `.btn-label` or remove.
31. Sparkle coverage for recipe action buttons (A17).
32. Expanded recipe/episode per Decision 1: restyle chrome to preview language (dashed seam, tri-pastel boxes, white .8 panels, `1fr 1fr`, gradient step circles via existing `.process-step__number`, preview dietary pills, "Related Episodes" mint cards, Giselle box w/ photo avatars), with internals per chosen option (X*, EX*).
33. Dead code cleanup: PrismLayer, EphemeraEngine, unused imports, dead keyframes (A25).

### Verification (every phase)
- Re-run `parity-review` screenshot harness + computed-style diff script (`sunday-brunch-website/scripts/pixel-parity-audit.mjs`); acceptance = zero unexplained property diffs at 1440×900 and matched section heights (±4px) excluding agreed decision items.
- Add a Playwright visual-regression spec pinning the agreed-upon final state.
