---
title: 'Recipe stats line — surface chill time + hands-off-chilling note'
type: 'bugfix'
created: '2026-06-26'
status: 'done'
baseline_commit: 'e70c9a4834bcc0d91f94c60f164720a051df5256'
context:
  - '{project-root}/Personas/Recipe-Writing-Guide.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The recipe stats line renders "Prep … | Cook … | Total …" but omits the chill time. On French Silk Pie it reads "Cook 2 min … Total 2 hr 42 min" with no visible reason for the gap — the 2-hour chill is invisible, so the long total looks puzzling. The Recipe-Writing-Guide requires the stats line to surface chill/rest time and flag long chills up front.

**Approach:** In the shared `RecipeTemplate` stats line, show the chill time when present, and append a soft "(mostly hands-off chilling)" note only when chilling is the majority of total time (so it stays truthful for bake-heavy recipes). The dominance flag is computed in the data projection (`recipes.js`) where the duration helpers already live; the component stays declarative. TDD: tests first.

## Boundaries & Constraints

**Always:**
- Test-first (project practices TDD; tests are the contract). Shared component → change must not regress other recipe pages.
- The chill field renders only when chill data exists; the note renders only when chill is the majority of total. Recipes without chill are visually unchanged.
- Keep the existing " | " separator and the existing field order; insert Chill between Cook and Total. Match existing code style (4-space indent, no semicolons).
- "Majority of total" = chill minutes strictly more than half of total minutes (`chillMin * 2 > totalMin`, `chillMin > 0`).

**Ask First:**
- Changing the separator style, restyling the whole stats line, or rewording the note beyond "(mostly hands-off chilling)".

**Never:**
- Touch the canon record `times` data (it is correct; this is render-only) or any `content/records/` file.
- Alter the schema.org JSON-LD prep/cook/total mapping.
- Hardcode the note unconditionally (it must be wrong-proof for non-chill-dominant recipes).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Chill-dominant (French Silk) | chill PT2H, total PT2H42M | Line shows "… Cook 2 min | Chill 2 hr | Total 2 hr 42 min …" + note "(mostly hands-off chilling)" | N/A |
| Has chill, not dominant | chill PT15M, total PT1H | Shows "Chill 15 min"; NO note | N/A |
| No chill | chill absent | No Chill field, no note; line unchanged from today | N/A |
| Projection flags | record.times | `times.chillISO` set; `times.mostlyChilling` boolean correct | missing/null times → no chill, mostlyChilling false |

</frozen-after-approval>

## Code Map

- `sunday-brunch-website/src/data/recipes.js:160-168` -- `projectRecipe` times block; add `chillISO` + computed `mostlyChilling` using existing `durationToMinutes`.
- `sunday-brunch-website/src/components/RecipeTemplate.jsx:220-224` -- stats line `<p className="recipe__meta">`; insert conditional Chill + note span.
- `sunday-brunch-website/src/components/RecipeTemplate.css` -- add `.recipe__meta-note` (own line, muted, italic) so the note reads as a soft aside.
- `sunday-brunch-website/src/tests/lib/content.test.js` -- assert REC-001 projects chill/chillISO/mostlyChilling.
- `sunday-brunch-website/src/tests/components/RecipeTemplate.test.jsx:191-201` -- existing meta test (must still pass); add Chill + note cases.

## Tasks & Acceptance

**Execution:**
- [ ] `src/tests/lib/content.test.js` -- add assertions: REC-001 `times.chill === '2 hr'`, `times.chillISO === 'PT2H'`, `times.mostlyChilling === true` -- RED first.
- [ ] `src/tests/components/RecipeTemplate.test.jsx` -- add: (a) chill-dominant mock → renders "Chill 2 hr" + "(mostly hands-off chilling)"; (b) has-chill-not-dominant mock → "Chill 15 min", no note; keep existing no-chill meta test green -- RED first.
- [ ] `src/data/recipes.js` -- add `chillISO` and `mostlyChilling` to projected `times` -- GREEN.
- [ ] `src/components/RecipeTemplate.jsx` -- render Chill field (when present) and note (when `mostlyChilling`) via a `filter(Boolean).join(' | ')` parts array -- GREEN.
- [ ] `src/components/RecipeTemplate.css` -- style `.recipe__meta-note` -- GREEN.

**Acceptance Criteria:**
- Given French Silk Pie's page, when the stats line renders, then it shows "Chill 2 hr" between Cook and Total and a "(mostly hands-off chilling)" note.
- Given a recipe whose chill is not the majority of total, when it renders, then "Chill …" shows but the note does not.
- Given a recipe with no chill, when it renders, then the stats line is unchanged from current behavior (no Chill, no note).
- Given the full unit suite, when run, then all prior tests still pass (no regression on the shared component).

## Design Notes

Projection (`recipes.js`, inside the `times` object):
```js
chillISO: record.times?.chill,
mostlyChilling:
    durationToMinutes(record.times?.chill) > 0 &&
    durationToMinutes(record.times?.chill) * 2 > durationToMinutes(record.times?.total),
```

Component (replaces the single meta string):
```jsx
<p className="recipe__meta">
    {[
        `Prep ${recipe.times.prep}`,
        `Cook ${recipe.times.cook}`,
        recipe.times.chill && `Chill ${recipe.times.chill}`,
        `Total ${recipe.times.total}`,
        `Yield ${recipe.yield}`
    ].filter(Boolean).join(' | ')}
    {recipe.times.mostlyChilling && (
        <span className="recipe__meta-note"> (mostly hands-off chilling)</span>
    )}
</p>
```
The line stays one text node (so `getByText(/Total .../)` keeps matching); the note is a separate block span.

## Verification

**Commands:**
- `cd sunday-brunch-website && npx vitest run src/tests/lib/content.test.js src/tests/components/RecipeTemplate.test.jsx` -- expected: all pass, including new chill/note cases.
- `cd sunday-brunch-website && npm run lint:editorial` -- expected: unaffected (no editorial content changed).

**Manual checks:**
- French Silk page stats line shows Chill + the note; a no-chill recipe is unchanged.

## Spec Change Log

- **2026-06-26 (step-04 review, patches — no loopback):** Two reviewer findings drove in-place patches. (1) Edge-case + blind hunters flagged a latent false-positive: a future record with chill but missing/unparseable `total` makes `durationToMinutes(total)→0` and `chill*2 > 0` always true → added an explicit `totalMinutes > 0` guard and computed the durations once into locals. (2) Blind hunter flagged `opacity: 0.85` on the note as a contrast anti-pattern (a11y is a core project value) → removed it, keeping the note at the same `#9b7ab8` as the existing stats line. Rejected (false-premise) findings: "no tests" (the blind hunter wasn't shown the test files; three component branches + one projection test exist), "0-leak" (`mostlyChilling` is already boolean), "orphaned note" (it lives inside the same `<p>` as the stats line).

## Suggested Review Order

**The logic (data projection — the testable decision)**

- Entry point: the `mostlyChilling` flag — strict-majority threshold with the total>0 guard.
  [`recipes.js:174`](../../sunday-brunch-website/src/data/recipes.js#L174)

**The render (shared component — every recipe page)**

- The stats line: parts array surfaces Chill when present; note span when `mostlyChilling`.
  [`RecipeTemplate.jsx:221`](../../sunday-brunch-website/src/components/RecipeTemplate.jsx#L221)

- The note's soft styling (own line, no opacity dimming).
  [`RecipeTemplate.css:175`](../../sunday-brunch-website/src/components/RecipeTemplate.css#L175)

**The contract (tests — three branches + projection)**

- Component: dominant → Chill + note; not-dominant → Chill, no note; no-chill → unchanged.
  [`RecipeTemplate.test.jsx:203`](../../sunday-brunch-website/src/tests/components/RecipeTemplate.test.jsx#L203)

- Projection: REC-001 projects chill/chillISO/mostlyChilling.
  [`content.test.js:59`](../../sunday-brunch-website/src/tests/lib/content.test.js#L59)
