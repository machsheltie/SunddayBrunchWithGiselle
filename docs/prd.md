---
stepsCompleted:
  - 1
  - 2
  - 3
  - 4
  - 6
  - 7
  - 8
  - 9
  - 10
  - 11
inputDocuments:
  - Pre-planning/Concept.txt
  - Pre-planning/Plan.txt
  - Pre-planning/worldbuilding.txt
  - Personas/Stacey.txt
  - Personas/Giselle.txt
  - Personas/Havok.txt
  - Personas/Tiana.txt
  - Personas/Phaedra.txt
  - Episodes/Episode 1/1 intro.txt
  - Episodes/Episode 1/3 Recipe Story.txt
  - Episodes/Episode 1/2 before we bake.txt
  - Episodes/Episode 1/4 Recipe Walkthrough.txt
  - Episodes/Episode 1/5 Sheltie segments.txt
  - Episodes/Episode 1/6 Next Week.txt
  - Episodes/Episode 1/7 Outro.txt
  - Episodes/Episode 1/transitions.txt
workflowType: 'prd'
lastStep: 11
project_name: 'Sunday Brunch With Giselle'
user_name: 'Heirr'
date: '2025-12-05'
---

# Product Requirements Document - Sunday Brunch With Giselle

**Author:** Heirr
**Date:** 2025-12-05

## Executive Summary

Sunday Brunch With Giselle is a cozy, story-rich baking podcast and companion recipe-blog experience (think Smitten Kitchen/Sally's Baking Addiction) that blends nostalgic storytelling, sensory recipe walkthroughs, and character-driven Sheltie banter to create a weekly refuge for millennial/Gen X women and creatives seeking softness and belonging. The product spans audio, web, and social: episodes with transcripts, long-form recipe posts (story + jump-to-recipe + print/save), and a clear episode -> recipe -> ConvertKit signup flow for listeners who want recipes, Sunday letters, and early drops.

### What Makes This Special

- Unique voice: AI-voiced Sheltie co-hosts with sharply defined personas deliver humor, science, and joy alongside Stacey's vulnerable, sensory-rich narration.
- Sensory sanctuary: "Cozy chaos" sound design, alchemy/magic framing of baking, and emotionally grounded stories about self-worth and being "too much" for the wrong crowd.
- Repeatable ritual: Predictable episode spine (Before We Bake -> Story -> Recipe Walkthrough -> Sheltie segments -> Next Week -> Outro) mirrored on the site via consistent episode/recipe layouts and CTAs (listen -> recipe -> save/print/share -> signup).
- Cross-medium depth: Companion site pages, social clips, and branded visuals extend the worldbuilding (kitchen as sanctuary, Shelties as microcosm of humanity), with accessibility baked in (transcripts, captions, alt text) and structured recipe presentation (story + jump-to-recipe + print/save).

## Project Classification

**Technical Type:** web_app (content/podcast + recipe blog with episodes, recipes, signup)  
**Domain:** general (media/podcast/recipes)  
**Complexity:** low

Classification signals observed: podcast + episode scripts, React/Vite site, recipe-blog structure (long-form + structured recipe schema), recipe/CTA flows (ConvertKit), no regulated data; emphasis on storytelling, audio, and content publishing, with an AI voice/sound workflow, plus standard web concerns (responsive layout, SEO, performance, accessibility, print/save/share).

## Success Criteria

### User Success
- Discoverability: Users arrive via search/social/Pinterest to recipe posts (story + jump-to-recipe + print/save) and episode pages.
- Engagement: Users listen or read, view structured recipe, and use save/print/share; transcripts/captions present.
- Accessibility: WCAG AA patterns; transcripts/captions for all episodes; alt text and keyboard-friendly layouts.
- Retention: Weekly habit of episode + recipe; repeat visitors and email opens/clicks; save/print/share without friction.

### Business Success (monetization/affiliation/merch/partners)
- Email growth: 2-5% CVR from recipe/episode CTAs to ConvertKit; growing list for Sunday letters/early drops.
- Affiliate: Track RPM/CVR per category; focus on baking/kitchen gear, ingredients, tea/coffee, cozy home, pet/Sheltie; favor direct/high-trust partners; prune low performers; "tools used" blocks on recipes.
- Sponsorships/partnerships: Bundle site + email + audio; early packages flat + performance hybrid; on-brand only (cozy/baking/pet/tea/coffee) with clear media/brand-safety kit.
- Merch: Start print-on-demand (aprons/mugs/pins/posters) to validate demand; avoid inventory until repeat velocity; measure PoD conversion.
- Content performance: Recipe/episode pageviews, time-on-page, low bounce; % visitors using save/print/share; site->podcast click-through.
- Community/sharing: Shares/pins of recipe posts; podcast subscribes/plays driven from site/email.

### Technical Success
- Performance: Core Web Vitals (LCP <2.5s p75 mobile; CLS <0.1).
- SEO: Recipe schema (JSON-LD), clean URLs, meta/OG, sitemap; jump-to-recipe; structured content.
- Reliability: 99.9% site uptime; audio embeds/playback reliable; print view works.
- Accessibility: WCAG AA across pages; transcripts/captions published with episodes.
- Responsiveness: Mobile-first layouts; print-friendly recipe view.

### Measurable Outcomes (initial targets; refine with data)
- By Week 12: email CVR 2-5% from recipe CTA; % of visitors save/print/share; % site->podcast click; X unique visitors/mo.
- By Week 24: growth in email list; repeat visitors/week; RPM/CVR per affiliate category tracked; early sponsor bundle sold/tested; PoD merch tested.

## Product Scope

### MVP - Minimum Viable Product
- Episode pages with audio player/links + transcripts/captions.
- Recipe posts per episode: long-form story + jump-to-recipe + structured recipe (ingredients/steps/time/yield) + print/save/share + "tools used" (affiliate-ready).
- ConvertKit signup embedded on recipes/episodes + site-wide CTA (value: recipes, Sunday letters, early drops).
- Basic analytics: pageviews, save/print/share events, email conversions, site->podcast clicks.
- SEO/a11y foundations: recipe schema, meta/OG, sitemap, WCAG AA, mobile-first, print-friendly recipe view.

### Growth Features (Post-MVP)
- Recipe search/filtering; related recipes/episodes modules.
- Rich media: galleries, short clips, Sheltie highlights; on-site audio player with chaptering.
- Social/Pinterest optimization flows; ingredient copy/export; favorites/bookmarks; optional comments.
- Affiliate refinement: category-level RPM/CVR dashboards; direct partner kits; limited sponsor bundles (site+email+audio).

### Vision (Future)
- Deeper community: subscriptions/early drops, premium bundles, seasonal collections.
- Personalization: recommended recipes/episodes based on behavior.
- Multichannel: PWA/mobile app; richer audio/voice interactions; premium merch runs after PoD validation.

## Content, Privacy, and Brand Safety Notes (Lightweight)
- Content/IP: Use licensed or original images/audio; ensure rights for music/sfx/voice models; attribute sources if required. Recipes and stories are original; avoid scraping.
- Privacy/consent: Clear CTAs for email capture (ConvertKit); respect unsubscribe; basic compliance for analytics/UTM tracking disclosures; no targeting minors.
- Brand safety (sponsors/affiliates): Allow cozy/baking/pet/tea/coffee, kitchen gear, ingredients; deny diet fads, off-brand finance, low-quality gadgets. Keep an allow/deny list in the media kit and apply to sponsor/affiliate selection.
- Disclosures: Mark affiliate links and sponsored placements; keep "tools used" affiliate blocks transparent.
- Accessibility/perf guardrails: Maintain WCAG AA, print-friendly view, Core Web Vitals as ongoing gates (applies to content updates, sponsorship blocks, affiliate embeds).

## User Journeys

**Journey 1: Lena - First-Time Finder (Pinterest/SEO)**
- Opening: Finds "French silk pie story recipe" pin; taps through.
- Rising Action: Hits hero, "Jump to recipe," skims ingredients/steps, then reads story; tries Print and Save/Share.
- Climax: Uses "Tools used" links; plays episode in-page; subscribes via CTA for Sunday letters/early drops.
- Resolution: Gets email confirmation; bookmarks; plans return.

**Journey 2: Maya - Returning Email Subscriber**
- Opening: Opens Sunday letter; sees recipe/story + "Listen now."
- Rising Action: Clicks through; listens in-page; copies ingredients; saves and shares; explores related recipes/seasonal collection.
- Climax: Clicks "tools used" affiliate link; site->podcast click tracked.
- Resolution: Email open/click, save/print, affiliate click logged.

**Journey 3: Emma - Sponsor/Partner Prospect**
- Opening: Lands on media kit.
- Rising Action: Reviews audience, allow/deny list, inventory (site+email+audio), sample placements, benchmarks.
- Climax: Uses contact CTA to request a bundle; sets expectation for response.
- Resolution: Media kit sent; slot reserved; tracking plan agreed (pageviews, CTR, email open/click, audio read).

**Journey 4: Stacey - Content Ops (Creator/Admin)**
- Opening: Drafts episode + recipe (story, structured recipe, tools-used).
- Rising Action: Adds transcript/captions, jump-to anchor, meta/OG, schema, print view, ConvertKit CTA; uploads images/pins; schedules email.
- Climax: Publishes; verifies events (save/print/share, CTA, site->podcast, affiliate by category); perf/a11y check; handles any publish error with rollback/log.
- Resolution: Post live; email scheduled; pins/clips shared; logs/metrics flowing.

**Journey 5: Edge/Recovery - Mobile Listener with Low Bandwidth**
- Opening: Weak mobile tries to play audio.
- Rising Action: Player stalls; user reads transcript/captions; uses jump-to-recipe; prints/saves.
- Climax: Offered "listen in podcast app" or "download later" fallback.
- Resolution: Core goal achieved; playback error logged/monitored.

**Journey 6: Ava - Accessibility-First User (Screen Reader/Keyboard)**
- Opening: Navigates via keyboard; uses skip links and jump-to-recipe; headings/ARIA clear.
- Rising Action: Uses transcripts/captions; prints recipe; Save/Share via keyboard.
- Climax: Completes signup via accessible form; no traps; alt text meaningful.
- Resolution: Email confirmation received; experience fully accessible.

**Journey 7: Tori - Heavy Pinterest Binger**
- Opening: Bounces across multiple pins in a session.
- Rising Action: Saves/prints multiple recipes; uses related modules/collections to hop; minimal story reading, relies on jump-to-recipe.
- Climax: Adds herself to email for "save for later" ease; clicks "tools used" once trust is built.
- Resolution: Multiple saves/pins; eventual email signup; high page depth tracked.

### Journey Requirements Summary
- Content: Long-form + jump-to-recipe + structured recipe; print/save/share; ingredient copy; tools-used (affiliate, category-tagged); transcripts/captions; audio player with fallback; related content/seasonal collections.
- CTAs: ConvertKit (value copy, accessible forms), media kit contact with response expectations.
- Commerce/partners: Affiliate tracking per category; media kit with allow/deny; sponsor bundle request flow.
- Analytics: Events for save/print/share, CTA clicks, email submits, site->podcast clicks, affiliate clicks by category, audio play success/fallback, publish errors.
- Perf/a11y: Recipe schema, meta/OG, sitemap, Core Web Vitals, WCAG AA, mobile-first, print view; accessible anchors/forms.
- Ops: Post templates with schema/OG/CTA/tools-used; image/pin checklist; email scheduling; publish logging/rollback; lightweight partner reporting.

## Innovation & Novel Patterns

### Detected Innovation Areas
- AI-voiced Sheltie personas layered into a recipe-blog + podcast format (character-driven audio alongside long-form story, structured recipe, tools-used).
- Narrative-first recipe pattern with predictable ritual (story + jump-to + tools-used + episode audio) packaged for SEO/social/Pinterest.

### Market Context & Competitive Landscape
- Typical recipe blogs are text/imagery-first; podcasts are voice-only. Blending scripted character audio with a full recipe/blog UX is uncommon; differentiator is persona-driven voice plus solid recipes.

### Validation Approach
- A/B: pages with/without in-page episode/voice callouts and tools-used blocks.
- Metrics: email CVR, save/print/share, site->podcast clicks, time-on-page/scroll-depth, affiliate RPM/CVR per category, listener growth from site/email.
- Qual: lightweight user feedback on character audio segments and CTA clarity; monitor perf impact.

### Risk Mitigation
- Performance/a11y: lazy-load audio; maintain Core Web Vitals; WCAG checks; transcripts/captions primary.
- UX safety: audio optional and skippable; jump-to-recipe stays primary; "listen in app/download" fallbacks for low bandwidth.
- Gimmick risk: if audio/character layer underperforms or annoys, fall back to strong text/story/recipe UX and keep audio minimal.

## Web App Specific Requirements

### Project-Type Overview
- React/Vite site acting as recipe blog + episode hub; SPA with prerender/SSR for recipe/episode pages to preserve SEO; no heavy real-time beyond media playback/analytics.
- Core flows: episode pages with audio/transcripts, recipe posts (story + jump-to + tools-used), ConvertKit CTA, print/save/share, Pinterest/social sharing.

### Technical Architecture Considerations
- Rendering: SPA with static prerender/SSR for recipes/episodes; lazy-load heavy assets (audio players, images, affiliate widgets).
- Routing: Clean URLs for recipes/episodes; jump-to anchors; sitemap/robots; internal linking (related recipes/episodes, collections).
- Media: Audio embeds with fallback (podcast app/download); responsive image optimization (srcset); feature flag heavy embeds.

### Browser Support
- Target evergreen browsers (Chrome, Safari, Firefox, Edge) on mobile/desktop; no IE support; graceful degradation elsewhere.
- Test mobile Safari/Chrome; ensure print view works across major browsers.

### Responsive Design
- Mobile-first layouts; jump-to-recipe and CTA visible on mobile.
- Print-friendly recipe view; scannable steps; tools-used block adapts to small screens.
- Audio player touch/keyboard accessible.

### Performance Targets
- Core Web Vitals: LCP <2.5s (p75 mobile); CLS <0.1; bundle size budgeted.
- Lazy-load audio and non-critical images; CDN/caching for static assets.
- Limit third-party scripts; measure impact of audio/affiliate blocks.

### SEO Strategy
- Recipe schema (JSON-LD); meta/OG tags; clean URLs; sitemap/robots; structured content for crawlability.
- Jump-to-recipe anchors; internal linking (related/collections); Pinterest/social-friendly images; UTM on outbound links.

### Accessibility Level
- WCAG AA: semantic headings/lists, alt text, focus states, keyboard nav, ARIA as needed.
- Transcripts/captions for all episodes; accessible forms for CTAs; accessible jump-to anchors and print view.

### Risks & Mitigations (Web App)
- Performance regressions from audio/images/affiliate widgets, large JS bundle -> lazy-load, bundle budgets, CDN, perf monitoring.
- SEO harm from missing schema/meta/OG or SPA-only rendering -> prerender/SSR critical routes, template schema/meta/OG, clean URLs.
- Accessibility gaps in jump-to, audio controls, forms, print view -> WCAG AA checklist; test keyboard/touch/screen reader; accessible anchors/forms; print view checks.
- Browser/device quirks (mobile Safari/Chrome), print inconsistencies -> browser matrix, targeted testing, graceful degradation.
- Third-party bloat -> limit scripts, feature-flag heavy embeds, instrument perf impact.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy
- MVP Approach: Experience + Revenue MVP (deliver the core ritual and capture email/affiliate signals early).
- Resource Requirements: Small web/content pod - 1 FE (React/Vite, SEO/a11y/perf), 1 content ops/producer (recipes, transcripts, pins/clips, CTA/email), light design support.

### MVP Feature Set (Phase 1)
- Core User Journeys Supported: First-time SEO/Pinterest visitor; returning email subscriber; sponsor prospect view of media kit; creator publishing flow; low-bandwidth listener fallback; accessibility-first user.
- Must-Have Capabilities:
  - Recipe/episode pages: long-form story + jump-to-recipe + structured recipe + print/save/share + tools-used (affiliate-ready).
  - Audio player with transcripts/captions; fallback to podcast app/download.
  - ConvertKit CTA (value: recipes, Sunday letters, early drops); media kit access/contact CTA.
  - SEO/a11y: recipe schema, meta/OG, sitemap, WCAG AA, mobile-first, Core Web Vitals budgets.
  - Analytics: events for save/print/share, CTA clicks, email submits, site->podcast clicks, affiliate clicks by category, audio play success/fallback, publish errors.
  - Ops: Post templates with schema/OG/CTA/tools-used; image/pin checklist; email scheduling; publish logging/rollback.

### Post-MVP Features (Phase 2)
- Recipe search/filtering; related recipes/episodes modules; seasonal collections.
- Rich media: galleries, short clips, Sheltie highlights; on-site audio player with chaptering.
- Social/Pinterest optimization flows; ingredient copy/export; favorites/bookmarks; optional comments.
- Affiliate refinement: category-level RPM/CVR dashboards; direct partner kits; limited sponsor bundles (site+email+audio).

### Expansion (Phase 3)
- Community: subscriptions/early drops, premium bundles, seasonal collections.
- Personalization: recommended recipes/episodes based on behavior.
- Multichannel: PWA/mobile app; richer audio/voice interactions; premium merch runs after PoD validation.

### Risk Mitigation Strategy
- Technical: Perf/a11y guardrails (lazy-load audio/images, SSR/prerender, WCAG AA); feature-flag heavy embeds; monitor bundle size and Core Web Vitals.
- Market: Validate via email CVR, save/print/share, site->podcast clicks, affiliate RPM/CVR per category; A/B voice/audio presence; prune underperforming levers.
- Resource: Keep partner slots small; lean reporting; PoD merch to avoid inventory; minimal third-party scripts; small team focus on SEO/Pinterest + email cadence.

## Functional Requirements

### Content & Publishing (Creator/Admin)
- FR1: Creator can create/edit/publish episode pages with title, audio embed, show notes, and transcripts/captions.
- FR2: Creator can create/edit/publish recipe posts with long-form story, structured recipe (ingredients, steps, time, yield), and “tools used” list.
- FR3: Creator can add jump-to-recipe anchors and ensure print-friendly formatting for recipes.
- FR4: Creator can attach images and pin-ready assets to posts.
- FR5: Creator can preview posts (episode/recipe) before publishing.
- FR6: Creator can schedule or publish posts and roll back a publish if errors occur.
- FR7: Creator can add/update meta/OG tags, sitemap entries, and recipe schema.
- FR8: Creator can update “tools used” lists and related links on published recipes.

### Content Consumption (Visitor/Subscriber)
- FR9: Visitors can view recipe posts with story, structured recipe, jump-to-recipe, and tools-used sections.
- FR10: Visitors can print or save/share a recipe.
- FR11: Visitors can view episode pages with audio embed and transcripts/captions.
- FR12: Visitors can copy ingredients/steps for use elsewhere.
- FR13: Visitors can navigate related recipes/episodes and seasonal collections.

### Audio Playback & Fallbacks
- FR14: Visitors can play episode audio inline with basic controls.
- FR15: Visitors can access a “listen in podcast app” link or download audio as a fallback.
- FR16: If audio fails, visitors can still access transcripts/captions and recipe content; failures are logged.

### CTAs & Conversion
- FR17: Visitors can submit email via ConvertKit CTA (value: recipes, Sunday letters, early drops) on episodes/recipes and site-wide; form is accessible and provides confirmation.
- FR18: Visitors can view a media kit and contact form/CTA for sponsorship/partnership inquiries; form is accessible and provides confirmation/acknowledgment.

### Commerce & Partners
- FR19: Visitors can view “tools used” affiliate blocks and click through to partner products.
- FR20: Sponsor/partner prospects can review allowed/denied categories and available inventory (site/email/audio) via media kit.
- FR21: Sponsor/partner prospects can request a sponsor bundle via contact CTA.

### Discovery & SEO/Social
- FR22: Visitors can reach content via clean URLs; site exposes sitemap/robots and recipe schema for crawlability.
- FR23: Visitors can see Pinterest/social-friendly images and share links with UTM parameters on outbound shares.

### Analytics & Telemetry
- FR24: System records pageviews, scroll/save/print/share events on recipes.
- FR25: System records CTA clicks and email submits.
- FR26: System records site->podcast clicks and audio play success/fallback events.
- FR27: System records affiliate clicks by category and publish errors.

### Accessibility & Print
- FR28: Visitors using keyboard/screen reader can navigate pages (skip links, headings, jump-to anchors).
- FR29: Visitors can access transcripts/captions for every episode.
- FR30: Visitors can use an accessible print-friendly recipe view.
- FR31: Visitors can submit accessible forms (CTA, sponsor contact) with proper labels/states.

### Sharing & Save
- FR32: Visitors can share recipes/episodes via common share affordances (social/email/link).
- FR33: Visitors can print or save recipes without logging in.

### Reliability & Ops (User-Facing Implications)
- FR34: Visitors experience stable playback and page loads within target uptime; creator can recover from publish errors without breaking live content.

## Non-Functional Requirements

### Performance
- Core Web Vitals: LCP <2.5s (p75 mobile), CLS <0.1; avoid large JS bundles via lazy loading and asset budgets.
- Use CDN/caching for static assets; optimize images (responsive srcset); lazy-load audio and non-critical media.

### Reliability & Availability
- Target 99.9% uptime for the site; audio embeds should fail gracefully with fallbacks (podcast app/download, transcripts).
- Publish errors can be rolled back without breaking live content.

### Security & Privacy
- All traffic over HTTPS; email capture via ConvertKit with opt-in/consent and unsubscribe support.
- Minimal data collection (primarily email + analytics events); disclose use of affiliate links and sponsorships.

### Scalability
- Support moderate traffic growth and social/Pinterest spikes via CDN/caching and prerender/SSR for recipes/episodes.
- Degrade gracefully under load (serve cached/pre-rendered pages; keep core flows usable).

### Accessibility
- WCAG AA: semantic structure, alt text, focus states, keyboard navigation, transcripts/captions, accessible forms, jump-to anchors, print-friendly view.
- Audio optional; transcripts/captions always available.

### Integration
- Integrate with ConvertKit for email submissions; ensure submission reliability and confirmation.
- Support podcast/audio embeds with fallback links/download.
- Track outbound affiliate clicks with UTM/attribution; maintain sitemap/robots for SEO.
