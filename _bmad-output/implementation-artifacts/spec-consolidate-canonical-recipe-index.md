---
title: 'Consolidate canonical recipe index and data source'
type: 'refactor'
created: '2026-06-23T00:00:00-04:00'
status: 'done'
baseline_commit: 'a408aa1d372dc31a81e34f1684abef0f48d797a0'
context:
  - '{project-root}/CLAUDE.md'
  - '{project-root}/_bmad-output/planning-artifacts/sunday-brunch-with-giselle-multi-stage-plan-2026-06-11.md'
---

<frozen-after-approval reason="human-owned intent - do not modify unless human renegotiates">

## Intent

**Problem:** Recipe data has two visible sources: the canonical `content/records` projection and an older placeholder recipe array in `src/data/content.js`. Even if current pages mostly use `src/lib/content.js`, the placeholder export keeps retired recipe records reachable and makes it easy for recipe index, detail, or homepage surfaces to drift back to scaffolding.

**Approach:** Move canonical recipe projection into a dedicated app data module, have the legacy data module re-export that canonical list, and make public content-service accessors return only approved canonical records. Add regression tests that prove placeholders and retired slugs cannot surface through recipe lists, featured recipes, recent recipes, raw data exports, or detail lookup.

## Boundaries & Constraints

**Always:** Treat `content/records/` as read-only. Preserve existing uncommitted work in `RecipeTemplate`, `FeaturedRecipeCard`, `AllergenWarnings`, related tests, and `Episodes/Episode1_04_Recipe_Walkthrough_RETOOL.md`. Keep recipe pages, homepage recipe sections, and recipe detail on a single canonical source.

**Ask First:** Touch any protected in-progress files, modify canonical recipe JSON, or change approved recipe prose/media content.

**Never:** Reintroduce sample recipe exports, hardcode placeholder slugs into public recipe surfaces, or weaken tests to hide stale placeholder data.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Canonical approved record | French Silk Pie record is scheduled, has `revisionState: approved`, and has `approvedAt` | Included in recipe list, featured recipe, recent recipes, slugs, and detail lookup | N/A |
| Retired placeholder slug | `placeholder-*` or `giselles-royal-velvet-cake` lookup | Not returned by any public recipe accessor | Detail lookup resolves `undefined` |
| Legacy import path | Code imports `recipes` from `src/data/content.js` | Receives the same canonical approved recipe list as the content service | N/A |

</frozen-after-approval>

## Code Map

- `sunday-brunch-website/src/data/recipes.js` -- new canonical recipe projection module that reads approved content records and filters non-approved records out.
- `sunday-brunch-website/src/data/content.js` -- legacy mixed content module; should no longer own or export placeholder recipes.
- `sunday-brunch-website/src/lib/content.js` -- public async content service used by recipe index, recipe detail, homepage featured recipe, collections, and recent recipes.
- `sunday-brunch-website/src/tests/lib/content.test.js` -- regression coverage for canonical-only recipe accessors and retired placeholder exclusion.

## Tasks & Acceptance

**Execution:**
- [x] `sunday-brunch-website/src/data/recipes.js` -- create canonical recipe projection and approved-record filter -- gives the app one recipe data source.
- [x] `sunday-brunch-website/src/data/content.js` -- remove placeholder recipe ownership and re-export canonical recipes -- prevents legacy imports from surfacing retired scaffolding.
- [x] `sunday-brunch-website/src/lib/content.js` -- consume canonical recipe data and return defensive recipe-list copies -- keeps public surfaces on approved records.
- [x] `sunday-brunch-website/src/tests/lib/content.test.js` -- add regression assertions for canonical data export and inaccessible placeholder slugs -- proves the contract.

**Acceptance Criteria:**
- Given the recipe index or homepage asks for recipes, when the content service resolves, then every returned recipe has a canonical source and no `placeholder-*` slug.
- Given the recipe detail page asks for a retired placeholder slug, when lookup resolves, then no recipe is returned.
- Given legacy code imports `recipes` from `src/data/content.js`, when it reads that export, then it receives the same canonical approved recipe list as `src/data/recipes.js`.

## Spec Change Log

## Design Notes

The canonical source should live below `src/data/` because it is static app data projected from editorial records. `src/lib/content.js` remains the async service facade for components and tests, while `src/data/content.js` becomes compatibility-only for recipes plus episode sample ownership.

## Verification

**Commands:**
- `npm run test -- --run src/tests/lib/content.test.js` -- expected: content service regression tests pass.
- `npm run build` -- expected: Vite production build succeeds with the canonical recipe module.

## Suggested Review Order

**Canonical Recipe Data**

- Start here: this declares the only recipe records eligible for projection.
  [`recipes.js:5`](../../sunday-brunch-website/src/data/recipes.js#L5)

- Approval gate keeps non-approved canonical records out of public surfaces.
  [`recipes.js:24`](../../sunday-brunch-website/src/data/recipes.js#L24)

- Frozen export prevents direct imports from appending retired records.
  [`recipes.js:208`](../../sunday-brunch-website/src/data/recipes.js#L208)

**Legacy Path Hardening**

- Legacy mixed-content imports now receive canonical recipes only.
  [`content.js:1`](../../sunday-brunch-website/src/data/content.js#L1)

- Sample episode related recipe no longer points at a placeholder slug.
  [`content.js:21`](../../sunday-brunch-website/src/data/content.js#L21)

**Service Facade**

- Page callers receive defensive recipe-list copies.
  [`content.js:8`](../../sunday-brunch-website/src/lib/content.js#L8)

- Featured recipe resolves from the canonical approved list.
  [`content.js:14`](../../sunday-brunch-website/src/lib/content.js#L14)

- Recent recipes sort a copied list, not the canonical export.
  [`content.js:29`](../../sunday-brunch-website/src/lib/content.js#L29)

**Regression Tests**

- Legacy export must equal the canonical approved index.
  [`content.test.js:69`](../../sunday-brunch-website/src/tests/lib/content.test.js#L69)

- Caller mutation cannot empty the canonical recipe list.
  [`content.test.js:91`](../../sunday-brunch-website/src/tests/lib/content.test.js#L91)
