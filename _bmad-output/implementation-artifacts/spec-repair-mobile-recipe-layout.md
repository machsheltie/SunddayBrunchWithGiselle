---
title: 'Repair mobile recipe layout'
type: 'bugfix'
created: '2026-06-23'
status: 'done'
route: 'plan-code-review'
baseline_commit: '25a786424ad1323f5535fca7b7a10eb849abe19f'
context:
  - '{project-root}/_bmad-output/planning-artifacts/sunday-brunch-with-giselle-multi-stage-plan-2026-06-11.md'
---

# Repair Mobile Recipe Layout

<frozen-after-approval reason="human-owned intent - do not modify unless human renegotiates">

## Intent

**Problem:** The recipe detail page looks acceptable on laptop but fails on phone: the layout compresses, the page heading is generic, and key cooking controls are not reliably readable or tappable without zooming.

**Approach:** Repair the existing `RecipePage` and `RecipeTemplate` responsive behavior so the canonical French Silk Pie detail page becomes the primary mobile cooking surface, without redesigning the brand system or adding full Phase 4 cook mode.

## Boundaries & Constraints

**Always:** Preserve the current visual identity, the canonical French Silk Pie data source, and the existing recipe interactions: copy ingredients, print, scaling calculator, allergen warnings, Sheltie segments, guestbook, related content, and schema generation. The recipe title must be the primary `h1` when a recipe is loaded. Phone layouts must be single-column, readable at 390px width, and free of horizontal overflow.

**Ask First:** Any new user-facing copy, removal of decorative elements, persistent storage, route changes, or changes to recipe content values.

**Never:** Do not build the full Phase 4 cook mode, timers, account saves, new recipe data models, or a new recipe template from scratch. Do not hide core cooking content on mobile to make the page shorter.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|----------------------------|----------------|
| Mobile recipe loaded | `/recipes/french-silk-pie` at 390px wide | Page uses the recipe title as `h1`; image, story, prep, warnings, actions, ingredients, tools, instructions, notes, and Sheltie segments stack in a readable single column | No horizontal page scroll; controls remain at least 44px tall |
| Loading or missing recipe | Slow lookup or unknown slug | Existing loading and missing states remain readable and keep their status pill | No blank page or stale previous recipe title |
| Embedded recipe template | Homepage featured-card expansion | Embedded mode keeps host-card chrome and does not inherit standalone mobile margins or tape clutter | No duplicated standalone page spacing |

</frozen-after-approval>

## Code Map

- `sunday-brunch-website/src/pages/RecipePage.jsx` - owns route-level heading, status pill, wrapper, and loaded/missing/loading state.
- `sunday-brunch-website/src/components/Layout.jsx` - owns persistent brand header semantics that must not create a competing route-level `h1`.
- `sunday-brunch-website/src/components/Header.css` - keeps the brand mark visually unchanged after moving it out of `h1` semantics.
- `sunday-brunch-website/src/components/RecipeTemplate.jsx` - owns recipe card structure, standalone vs embedded mode, action buttons, and cooking content order.
- `sunday-brunch-website/src/components/RecipeTemplate.css` - primary responsive layout fix for scrapbook paper, panels, action buttons, grid, image, and decorative layers.
- `sunday-brunch-website/src/App.css` - global `.section`, `.section__header`, and `.card` mobile constraints if wrappers are causing overflow or cramped width.
- `sunday-brunch-website/src/tests/pages/RecipePage.test.jsx` - update route-level expectations from generic "Recipe" heading to loaded recipe title.
- `sunday-brunch-website/src/tests/components/RecipeTemplate.test.jsx` - add structural assertions for mobile-friendly classes and preserve embedded behavior.
- `sunday-brunch-website/src/tests/components/Layout.test.jsx` - guard against the persistent brand mark consuming a page-level `h1`.

## Tasks & Acceptance

**Execution:**
- [x] `sunday-brunch-website/src/pages/RecipePage.jsx` - make loaded recipe title the primary `h1`; keep loading/missing labels honest; avoid duplicate title hierarchy.
- [x] `sunday-brunch-website/src/components/RecipeTemplate.jsx` - adjust markup only where necessary for accessible heading order and mobile hooks; preserve all current interactions.
- [x] `sunday-brunch-website/src/components/RecipeTemplate.css` - fix active selectors so `.recipe__main-grid` collapses cleanly; reduce phone padding; constrain images/decorations; make panels/actions/touch targets readable at 390px and 375px.
- [x] `sunday-brunch-website/src/App.css` - patch global section/card wrappers only if they contribute to mobile overflow. No App.css patch was needed after browser measurement; the competing global `h1` was fixed in `Layout.jsx`/`Header.css`.
- [x] `sunday-brunch-website/src/tests/pages/RecipePage.test.jsx` and `sunday-brunch-website/src/tests/components/RecipeTemplate.test.jsx` - update/add tests for heading hierarchy, loaded/missing/loading behavior, standalone vs embedded template structure, and mobile guard classes.
- [x] Browser-check `/recipes/french-silk-pie` at 390x844 and 375x667.

**Acceptance Criteria:**
- Given the French Silk Pie route is loaded, when viewed at 390px wide, then the only primary page heading is "French Silk Pie" and the page has no horizontal overflow.
- Given the recipe is loaded on mobile, when a user scrolls through the page, then image, story, warnings, copy/print actions, ingredients, tools, instructions, notes, and character segments are readable in one column without zooming.
- Given copy and print buttons render on mobile, when inspected, then they remain full-width or otherwise at least 44px tall with stable spacing.
- Given the homepage uses `RecipeTemplate` in embedded mode, when rendered, then standalone mobile page chrome does not leak into the embedded version.
- Given tests run, when the focused recipe page/template suites execute, then they pass.

## Spec Change Log

- 2026-06-23: Implemented route `h1` promotion, duplicate recipe-title suppression in standalone route usage, active mobile grid/action CSS, and Layout brand semantics fix after browser verification showed the persistent masthead was also an `h1`.
- 2026-06-23: Review loop fixed canonical hero image binding, stale async lookup protection, blank-title fallback, and long-title route heading wrapping.

## Design Notes

The near-term goal is "mobile cooking baseline," not full cook mode. The implementation should prefer responsive CSS and small semantic heading changes over a new component tree. If browser inspection shows decorative layers causing interaction or overflow problems, hide or shrink them only at phone breakpoints.

## Verification

**Commands:**
- `npm test -- src/tests/pages/RecipePage.test.jsx src/tests/components/RecipeTemplate.test.jsx` - expected: focused suites pass.
- `npm run build` - expected: production build succeeds.
- `npm test -- src/tests/pages/RecipePage.test.jsx src/tests/components/RecipeTemplate.test.jsx src/tests/components/Layout.test.jsx` - actual: 68 tests passed.
- `npm run build` - actual: production build passed.
- `npm test -- src/tests/pages/RecipePage.test.jsx src/tests/components/RecipeTemplate.test.jsx src/tests/components/Layout.test.jsx` - review-loop actual: 71 tests passed.
- `npm run build` - review-loop actual: production build passed.

**Manual checks:**
- Open `/recipes/french-silk-pie` at 390x844 and 375x667; expected: no horizontal scrolling, readable single-column content, visible recipe title `h1`, tappable copy/print controls, and decorative elements not blocking content.
- Playwright mobile check at 390x844: one `h1` (`French Silk Pie`), overflow `0px`, one-column grid (`276px`), copy/print buttons `51px` tall.
- Playwright mobile check at 375x667: one `h1` (`French Silk Pie`), overflow `0px`, one-column grid (`261px`), copy/print buttons `51px` tall.
- Review-loop Playwright check at 390x844: one `h1` (`French Silk Pie`), overflow `0px`, hero image `/images/recipes/frenchsilkpie.jpg`, one-column grid (`276px`), copy/print buttons `51px` tall.
- Review-loop Playwright check at 375x667: one `h1` (`French Silk Pie`), overflow `0px`, hero image `/images/recipes/frenchsilkpie.jpg`, one-column grid (`261px`), copy/print buttons `51px` tall.

## Suggested Review Order

**Route Data Flow**

- Entry point: route title, loading fallback, and blank-title safety.
  [`RecipePage.jsx:13`](../../sunday-brunch-website/src/pages/RecipePage.jsx#L13)

- Async lookup guard prevents stale recipe results after route changes.
  [`RecipePage.jsx:15`](../../sunday-brunch-website/src/pages/RecipePage.jsx#L15)

- Canonical route image feeds the standalone recipe hero.
  [`RecipePage.jsx:58`](../../sunday-brunch-website/src/pages/RecipePage.jsx#L58)

**Recipe Presentation**

- Template renders canonical hero imagery only for standalone expanded image input.
  [`RecipeTemplate.jsx:202`](../../sunday-brunch-website/src/components/RecipeTemplate.jsx#L202)

- Title suppression avoids duplicate route/template heading hierarchy.
  [`RecipeTemplate.jsx:217`](../../sunday-brunch-website/src/components/RecipeTemplate.jsx#L217)

- Mobile grid and action controls collapse around real template selectors.
  [`RecipeTemplate.css:174`](../../sunday-brunch-website/src/components/RecipeTemplate.css#L174)

- Recipe grid uses `minmax(0, 1fr)` to prevent content-driven overflow.
  [`RecipeTemplate.css:216`](../../sunday-brunch-website/src/components/RecipeTemplate.css#L216)

- Phone breakpoint reduces chrome while preserving the decorative system.
  [`RecipeTemplate.css:411`](../../sunday-brunch-website/src/components/RecipeTemplate.css#L411)

**Heading Semantics**

- Persistent brand mark stays visual, no longer competes as page `h1`.
  [`Layout.jsx:75`](../../sunday-brunch-website/src/components/Layout.jsx#L75)

- Route title can wrap long recipe names without horizontal scroll.
  [`App.css:273`](../../sunday-brunch-website/src/App.css#L273)

**Tests**

- Route test verifies canonical hero image reaches the template.
  [`RecipePage.test.jsx:159`](../../sunday-brunch-website/src/tests/pages/RecipePage.test.jsx#L159)

- Route test verifies blank-title fallback remains readable.
  [`RecipePage.test.jsx:300`](../../sunday-brunch-website/src/tests/pages/RecipePage.test.jsx#L300)

- Route test verifies stale async lookups cannot overwrite current route.
  [`RecipePage.test.jsx:449`](../../sunday-brunch-website/src/tests/pages/RecipePage.test.jsx#L449)

- CSS guard locks in long-title overflow protection.
  [`RecipePage.test.jsx:542`](../../sunday-brunch-website/src/tests/pages/RecipePage.test.jsx#L542)
