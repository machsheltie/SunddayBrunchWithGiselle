Sprint 3 Checklist - Instrumentation and Polish
==============================================

Completed (from Sprints 1–2 carryover)
- Affiliate clicks tracked on tools-used; copy/print/share and audio play/fallback events instrumented.
- Recipe JSON-LD + canonical/meta applied; sitemap and robots present.
- Brand-safety allow/deny visible on media kit; sponsor contact + ConvertKit forms validated with inline states.
- Related/seasonal modules render/hide gracefully; print view hides nav/CTA noise.

Open Items to Close Sprint 3
- [ ] Add UTM tagging on share links/email and affiliate URLs; log share channel in analytics.
- [ ] Perf/a11y regression check against Core Web Vitals budget (LCP <2.5s p75 mobile, CLS <0.1) and WCAG AA; verify keyboard/focus, forms, player, and print.
- [ ] Publish error logging hook (surface analytics event or console.warn) for content fetch failures.
- [ ] Content readiness for launch: at least 3–4 recipes and 1–2 episodes; update data source and regenerate sitemap.
- [ ] Optional: home grid/collections and seasonal tuning so related blocks are meaningful with more content.
- [ ] Final disclosures/footer copy and media-kit benchmarks/sample placements (text) to reassure sponsors.

Suggested Order of Execution
1) Instrument UTM + logging; 2) run perf/a11y smoke; 3) add launch content + sitemap refresh; 4) tighten disclosures/media-kit notes.
