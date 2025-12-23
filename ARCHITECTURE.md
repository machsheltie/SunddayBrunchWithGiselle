Architecture Blueprint - Sunday Brunch With Giselle
===================================================

Stack & Hosting
- FE: React + Vite. Rendering: prerender/SSR for recipes/episodes to preserve SEO; lazy-load heavy assets (audio, images, affiliate widgets).
- Hosting/CDN: Vercel/Netlify/Cloudflare Pages; edge caching; image optimization via provider or responsive srcset.
- Routing: Clean URLs per recipe/episode; jump-to anchors; sitemap/robots; canonical tags.

Content & Data Model (minimal)
- Content source: MDX or headless CMS (Sanity/Contentful). Fields:
  - Episode: {id, slug, title, heroImage, audioUrl, transcript, showNotes, relatedIds, publishDate}
  - Recipe: {id, slug, title, heroImage, story, ingredients[], steps[], times {prep,cook,total}, yield, toolsUsed[{name, link, category}], relatedIds, seasonalTags[], publishDate}
- MediaKitConfig: {allowCategories, denyCategories, inventoryDescription, samplePlacements, benchmarks, contactEmail/endpoint}
- CTAConfig: {copy, formId, successMsg, errorMsg}

Component Props / Interfaces (suggested)
- RecipePage
  - props: { title, slug, heroImage, storyHtml, ingredients: string[], steps: string[], times: { prep, cook, total }, yield: string, toolsUsed: ToolItem[], related: RelatedItem[], seasonal: RelatedItem[], ctaConfig: CTAConfig, meta: MetaConfig }
- EpisodePage
  - props: { title, slug, heroImage, audioUrl, transcriptHtml, showNotesHtml, relatedRecipes: RelatedItem[], relatedEpisodes: RelatedItem[], ctaConfig: CTAConfig, meta: MetaConfig }
- ToolItem: { name: string, link: string, category: string }
- RelatedItem: { title: string, slug: string, type: 'recipe' | 'episode', image?: string }
- CTAConfig: { copy: string, formId: string, successMsg: string, errorMsg: string }
- MetaConfig: { description: string, ogImage?: string, tags?: string[] }

Routing Plan (suggested)
- /recipes/[slug]
- /episodes/[slug]
- /media-kit
- /about (optional)
- Home: optionally highlight latest recipe/episode + CTA
- Sitemap/robots generated from content slugs

Core Components (build these)
- Layout: header/nav/footer + site-wide CTA.
- CTA form (ConvertKit): value copy “Get recipes, Sunday letters, early drops”; accessible states; success/error.
- Recipe page: hero, jump-to, story, structured recipe (ingredients/steps/time/yield), tools-used (affiliate disclosure), print/save/share, CTA, related/seasonal modules.
- Episode page: audio player (fallback links: podcast app/download), transcripts/captions, show notes/links, CTA, related.
- Tools-used block: list with outbound links and category tag (for analytics); disclosure visible.
- Related content module: recipes/episodes/collections; hides gracefully if empty.
- Share/print buttons: accessible; print-friendly CSS.
- Media kit page: audience summary, allow/deny list, inventory (site/email/audio), sample placements/benchmarks (text), contact form with confirmation.
- Forms: email signup, sponsor contact; accessible labels/states; confirmation on submit.

SEO/Meta
- Recipe JSON-LD, meta/OG per page; sitemap/robots; clean URLs; canonical tags.
- Jump-to-recipe anchors; internal linking (related, collections); Pinterest/social-friendly images; UTM on outbound shares.

Performance/A11y Guardrails
- Core Web Vitals budget: LCP <2.5s p75 mobile; CLS <0.1; lazy-load audio/images; minimize JS/bundle size.
- WCAG AA: semantic headings, alt text, focus states, keyboard nav, ARIA where needed; accessible forms and jump-to anchors; transcripts/captions always available.
- Print-friendly recipe view; test on mobile Safari/Chrome; no IE.

Analytics Events (instrument)
- Pageviews; scroll depth (optional); save/print/share on recipes.
- CTA clicks, email submits.
- Site→podcast clicks; audio play success/fallback.
- Affiliate clicks (category-tagged); publish errors.

Integration Points
- ConvertKit for email submits; handle success/error states.
- Podcast/audio hosting: embed or direct audio with in-app/download links.
- Affiliate links: UTM tagging; disclosure; outbound click tracking.
- Sitemap/robots/schema generation.

CI/Deploy
- Vite build with prerender/SSR for content routes.
- CI: lint, test, type-check (if TS), bundle-size check; optional axe/Lighthouse smoke.
- Deploy to CDN-backed host; previews per branch.

Folder/Component Scaffold (suggested)
- src/
  - components/
    - Layout/
    - CTAForm/
    - Recipe/
    - Episode/
    - ToolsUsed/
    - RelatedContent/
    - ShareButtons/
    - AudioPlayer/
    - MediaKit/
  - pages/ (or routes/ if using file-based routing)
    - recipes/[slug].jsx
    - episodes/[slug].jsx
    - media-kit.jsx
  - lib/
    - seo.js (schema/meta helpers)
    - analytics.js (event helpers)
    - data.js (fetch/parsers from CMS/MDX)
  - styles/
    - print.css
    - accessibility.css
  - config/
    - cta.js, mediaKit.js

Open Choices
- Content source: pick MDX vs headless CMS.
- Routing framework: Vite + file-based routing (e.g., react-router with prerender) vs Next.js (if allowed).
- Analytics provider: simple event bus to your chosen analytics.
