---
title: 'French Silk Pie — pasteurized-egg clarity pass'
type: 'chore'
created: '2026-06-26'
status: 'done'
baseline_commit: 'd757623a223fe2795f5cc3cca755eb5baeee6df8'
context:
  - '{project-root}/Personas/Recipe-Writing-Guide.md'
  - '{project-root}/Personas/Recipe-Page-Sheltie-Segments-Guide.md'
  - '{project-root}/Personas/writing-issues/texture-metaphor-crowding.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The French Silk Pie's primary method uses raw eggs, but on the rendered recipe "pasteurized" reads as a soft afterthought (an appended ", pasteurized" on the egg line) and never appears in the egg-adding step or in Phaedra's science box. A first-time reader can miss that pasteurized is the default safe choice — a launch-day reader-protection and brand gap the review persona flagged.

**Approach:** Make pasteurized the unmissable default in three places: (1) the egg ingredient line reads "4 large pasteurized eggs"; (2) step 5 carries one short Stacey clause that the eggs stay raw in this no-bake filling; (3) Phaedra's Porch Light names pasteurized-raw eggs as the silky-texture move (raw holds the whipped-in air for the light, mousse-like body; cooking those same eggs sets a denser custard). Land it as a proper Stacey-approved canon revision (v15) and keep the editorial draft in sync.

## Boundaries & Constraints

**Always:**
- Safety directive stays in Stacey's human voice (ingredient line + step 5). Phaedra explains *why* pasteurized works, never issues the safety call (Recipe-Page guide rule 2 + Phaedra "never the safety authority").
- Faithfulness rule: no change to any amount, time, temperature, or method — clarifying clauses only.
- Keep Phaedra's language mechanical (air/structure), not poetic; do NOT add new texture synonyms (cloud/velvet/satin doubling) per the texture-metaphor-crowding issue. Reuse the existing "light, mousse-like body" / "fine vs silk" framing.
- Avoid em-dash pile-ups in Phaedra's box (it was deliberately de-em-dashed in v8/v10).
- Edit canon through the versioned process: bump version 14→15, add an updateHistory entry, refresh revisionNote + approvedAt + updatedAt, keep status `scheduled` / revisionState `approved`.

**Ask First:**
- Any change to amounts/method, or moving the safety directive out of Stacey's voice — neither is in scope; halt if it seems required.

**Never:**
- Touch podcast scripts (the Final walkthrough already says "pasteurized"); user scoped this to the recipe page + its editorial draft.
- "Fix" the stale "not wired yet / Royal Velvet Cake" note in the draft's Site data block, or the superfine↔ultrafine term drift — out of scope; flag only.
- Change the cooked-egg alternative method (already correct in Notes + substitutions).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Egg line render | canon `ingredient: "pasteurized eggs"`, `preparation: null` | RecipeTemplate `formatIngredientLine` renders "4 large pasteurized eggs (see Read This First; or use the cooked-egg method)" | N/A |
| Step 5 render | canon step 5 body with new clause | `ProcessStep` shows the pasteurized clause inside step 5; recovery note unchanged | N/A |
| Phaedra box render | canon phaedra segment body | SheltieTip shows the pasteurized-as-silk beat; length stays near the existing box | N/A |
| Content validation | edited REC-001 JSON | `validate:records` / art-007 pass (schema + write-boundary intact) | If validation fails, halt and report |

</frozen-after-approval>

## Code Map

- `content/records/recipes/1_french_silk_pie/REC-001-french-silk-pie.json` -- READ-ONLY canon; the live site projects from it. Egg ingredient, step 5, Phaedra segment, version/history/approval metadata.
- `sunday-brunch-website/src/data/recipes.js` -- projects the canon JSON into the site recipe object (no edit; verifies the change flows through).
- `sunday-brunch-website/src/components/RecipeTemplate.jsx` -- `formatIngredientLine` renders the egg line (no edit).
- `docs/editorial-drafts/recipes/1_french_silk_pie/REC-001-french-silk-pie-DRAFT.md` -- hand-maintained editorial draft; egg line (170), step 5 (187), Phaedra markdown (219), Site data block phaedra[0] (254).
- `sunday-brunch-website/src/tests/lib/content.test.js` -- asserts REC-001 projection (chocolate ingredient, steps length, segments); confirm still green.

## Tasks & Acceptance

**Execution:**
- [ ] `content/records/recipes/1_french_silk_pie/REC-001-french-silk-pie.json` -- egg ingredient → "pasteurized eggs"/`preparation: null`; step 5 clause; Phaedra Porch Light pasteurized beat; version 15 + updateHistory + revisionNote + approvedAt/updatedAt -- land the approved revision.
- [ ] `docs/editorial-drafts/recipes/1_french_silk_pie/REC-001-french-silk-pie-DRAFT.md` -- mirror the three edits (markdown + Site data block phaedra[0]) -- keep the editing surface in sync.
- [ ] Run content validation + the `prepublish-editorial-pass` gate + the REC-001 vitest -- confirm projection and no regressions.

**Acceptance Criteria:**
- Given the rendered recipe page, when a reader scans the ingredients, then the egg line reads "4 large pasteurized eggs".
- Given step 5, when read on its own, then it states the eggs stay raw in this no-bake filling, in Stacey's voice, with no method/amount change.
- Given Phaedra's Porch Light, when read, then it explains pasteurized-raw eggs as the texture move (silk vs custard) without issuing the safety directive and without adding new texture metaphors.
- Given the edited JSON, when `validate:records`/art-007 runs, then it passes and the record is version 15 with a matching updateHistory entry.
- Given the editorial draft, when compared to canon, then the egg line, step 5, and Phaedra beat agree.

## Design Notes

Exact proposed prose (the implementation IS the words):

**Egg ingredient line** (canon `ingredient-rec-001-eggs`): `ingredient: "pasteurized eggs"`, `preparation: null`, note unchanged → renders "4 large pasteurized eggs (see Read This First; or use the cooked-egg method)".

**Step 5 body:** *(refined in review — safety payoff made explicit in Stacey's voice)*
> Add the eggs, one at a time. They stay raw in this no-bake filling, so use pasteurized eggs to keep them safe to eat. Add one egg and beat a full 5 minutes before the next; repeat for all four (about 20 minutes total).

**Phaedra's Porch Light body:**
> Here's something wonderful: ultrafine sugar is the quiet hero of this pie. Its tiny crystals melt into the butter far more easily than regular granulated, so the filling turns satin-smooth instead of gritty. Then the long, patient beat whisks thousands of tiny air bubbles into the filling, and the raw eggs are what hold that air in place. That's exactly why we use pasteurized ones: cooked eggs would set firmer, into a denser custard, while raw ones keep the body light and mousse-like. It's the whole difference between "fine" and "silk." If something looks off, there's almost always a temperature fix: soupy filling means the chocolate or butter was still warm (chill the bowl 15 minutes and re-whip); grainy means reach for ultrafine and keep beating (you can't overdo it); cream that won't hold peaks is too warm (cold bowl, cold cream). Understand the why, and you can rescue almost anything. You've got this. — Tiana (bursting in): "That's my BEST FRIEND! Did you hear all that? She knows everything. Okay, now can we please eat the pie?"

(The editorial draft mirrors these; its Phaedra keeps the draft's local "superfine" wording, gaining the same pasteurized sentence.)

## Verification

**Commands:**
- `node content/art-007-run.js` -- expected: validation passes for REC-001.
- `cd sunday-brunch-website && npm run validate:records` -- expected: record valid (write boundary intact).
- `cd sunday-brunch-website && npx vitest run src/tests/lib/content.test.js` -- expected: REC-001 projection tests pass.

**Manual checks:**
- Egg line, step 5, and Phaedra box read correctly when projected; Phaedra box length stays near the current box; no new texture-synonym doubling; one approved updateHistory v15 entry present.

## Suggested Review Order

**The canonical change (read-only record — drives the live site via `recipes.js`)**

- Entry point: the headline edit — egg ingredient is now "pasteurized eggs" / `preparation: null`.
  [`REC-001-french-silk-pie.json:310`](../../content/records/recipes/1_french_silk_pie/REC-001-french-silk-pie.json#L310)

- Safety directive in Stacey's human voice (strengthened in review to be explicit on-page).
  [`REC-001-french-silk-pie.json:399`](../../content/records/recipes/1_french_silk_pie/REC-001-french-silk-pie.json#L399)

- Phaedra's Porch Light: explains the *why* (silk vs custard) only — no "safe" claim, no new texture metaphor.
  [`REC-001-french-silk-pie.json:567`](../../content/records/recipes/1_french_silk_pie/REC-001-french-silk-pie.json#L567)

- Versioned bookkeeping: v15 updateHistory entry + refreshed revisionNote/approvedAt (edit-as-Stacey).
  [`REC-001-french-silk-pie.json:176`](../../content/records/recipes/1_french_silk_pie/REC-001-french-silk-pie.json#L176)

**Editorial draft kept in sync**

- Egg line, step 5, and both Phaedra copies (markdown + Site-data block) mirror canon.
  [`REC-001-french-silk-pie-DRAFT.md:170`](../../docs/editorial-drafts/recipes/1_french_silk_pie/REC-001-french-silk-pie-DRAFT.md#L170)

**Follow-up logged (not in this change)**

- Pre-existing dangling "Read This First" pointer → render a real safety section.
  [`deferred-work.md`](./deferred-work.md)
