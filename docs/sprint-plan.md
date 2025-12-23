Sprint Plan (MVP)
=================

Scope: Deliver Phase 1 (Experience + Revenue MVP) from PRD/epics.

Sprint 1 (foundations + recipes/CTA)
- Setup project: deps, routing, lint/tests, CI, envs (ConvertKit IDs), hosting target.
- Implement Layout + CTA component (ConvertKit; success/error; accessible).
- Recipe template: story + structured recipe (ingredients/steps/time/yield), hero, metadata.
- Jump-to-recipe anchor; print-friendly CSS; copy ingredients; print/save/share controls.
- Tools-used block with disclosure; outbound links.
- Related/seasonal module (renders list, hides if empty).
- SEO/meta basics: clean URLs, meta/OG helpers, schema placeholder; sitemap/robots stub.
- Analytics hooks: pageviews, save/print/share, CTA clicks, email submits (scaffold).
- A11y/perf pass: headings, alt text, focus, keyboard nav; lazy-load non-critical media.

Sprint 2 (episodes + audio + media kit)
- Episode template: audio player with in-app/download fallbacks; show notes; transcripts/captions.
- Audio error/fallback handling; logs events (audio success/fail, site->podcast clicks).
- Media kit page: allow/deny list, inventory text, sample placements/benchmarks, sponsor contact form (accessible, confirmation).
- Expand schema/meta: recipe JSON-LD, sitemap/robots generation.
- Print view refinements; responsive tweaks for mobile Safari/Chrome.

Sprint 3 (instrumentation + polish)
- Complete analytics events: affiliate clicks by category, publish error logging.
- Related/collections tuning; seasonal block; UTM tagging on shares.
- Perf/a11y regression checks (Core Web Vitals budget, WCAG AA audit on forms/player/jump-to/print view).
- Finalize disclosures and footer copy; brand-safety allow/deny visible on media kit.
- Prepare launch content (at least 3–4 recipes + 1–2 episodes).

Backlog (Post-MVP candidates)
- Search/filter, favorites/bookmarks, comments (optional).
- Rich media (galleries, clips, chaptering).
- Affiliate dashboards, direct partner kits, sponsor bundles (site+email+audio).
- Community/premium bundles; personalization; PWA/mobile app; premium merch after PoD validation.
