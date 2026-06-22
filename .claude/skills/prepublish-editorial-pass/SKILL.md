---
name: prepublish-editorial-pass
description: Use before finalizing or publishing any Sunday Brunch With Giselle recipe or episode entry. Runs the full pre-publish editorial pass — the deterministic editorial lint, the judgment reviews (critic + humanizer + continuity), the three Persona guide checklists, draft↔record sync, and schema validation — so the recurring patterns we keep re-finding get caught every time instead of re-discovered.
---

# Pre-Publish Editorial Pass

The recipe page is a templated, repeating format, so the same issues recur every entry.
This skill turns hard-won lessons into a repeatable gate. Work the steps in order. Steps 1–4
are mechanical/fast; 5–7 are judgment; 8–10 are integrity and governance.

**Source of truth:** the canonical JSON record under `content/records/`. The markdown under
`docs/editorial-drafts/` is the authoring surface and must be kept mirrored, never treated
as canon. All commands run from `sunday-brunch-website/`.

## 1. Identify the target
- Record: `content/records/recipes/<dir>/REC-XXX-*.json` (or `content/records/episodes/…`).
- Draft: `docs/editorial-drafts/recipes/<dir>/REC-XXX-*-DRAFT.md`.
- Note current `version`, `status`, `revisionState`, and `approvedBy/At`.

## 2. Run the deterministic lint (catches the mechanical recurring patterns)
```
npm run lint:editorial REC-XXX
```
It checks: signature-phrase echo (origin tagline across surfaces), texture-metaphor
crowding (e.g. "cloud" owned by one voice), banned AI-tell words, em-dash density,
Sheltie box word-ceilings, and draft↔record sync. Rationale per rule lives in
`Personas/writing-issues/`.
- **Fix every warning, or consciously justify it.** Intentional repetition ("too much",
  "silk") is canon and the lint flags those as `info:` only.
- If you find a NEW recurring pattern, log it in `Personas/writing-issues/` AND add a rule
  to `sunday-brunch-website/scripts/editorial-lint.mjs` so it's caught next time.

## 3. Validate the record schema
```
npm run validate:records
```
Must report `"passed": true`. Schema errors block publish.

## 4. Continuity check (against the canon timeline)
Open `Personas/Canon-Timeline-WORKING.md` and run its 30-second check:
- No dog appears in a scene before its birth or after its death (the Giselle/2009 catch).
- Giselle may *comment from the eternal present* but isn't placed bodily in scenes she
  couldn't have witnessed; the real dog of that era goes in-scene (e.g. Athena for 2009).
- No dog narrates a real memory; safety, grief, allergens, corrections are Stacey's voice.
- Stated kinship matches the family tree in `Character-Bible-The-Pack-DRAFT.md`.

## 5. Judgment reviews (the part the lint can't do)
Run these as adversarial passes (subagents or the review skills), then apply findings:
- **Prose-critique** against the four reader-reward channels + the AI-tell checklist in
  `Personas/Recipe-Story-Guide.md`.
- **Humanizer** sweep for AI tells the lint can't grep (overworked sentences, participle
  pileups, significance inflation, tidy-moral marketing).
- Optional **reader-sim / continuity-checker** for longer or higher-stakes entries.
Re-run the lint after edits; humanizer/critic fixes often reintroduce a flagged pattern.

## 6. Walk the three Persona guide checklists
- `Personas/Recipe-Story-Guide.md` — headnote AI-tell checklist (hook, shown-not-labeled
  anxiety, simile/em-dash discipline, no tidy sermon — let Giselle land the beat).
- `Personas/Recipe-Writing-Guide.md` — per-recipe checklist (honest stats, Read-This-First,
  grouped ingredients with weights, "watch for" cues, "looks wrong but isn't", safety in
  Stacey's voice, bottom-of-page notes, faithfulness to the approved recipe).
- `Personas/Recipe-Page-Sheltie-Segments-Guide.md` — all four boxes present, in place,
  in-character, within length; safety/truth owned by Stacey; facts a dog states are true.

## 7. Character handling — blog vs podcast
Per `Character-Bible-The-Pack-DRAFT.md` (Giselle's "Blog vs. podcast" rule): in prose,
Giselle is warmth-forward with flashes of the blade; her sustained comic relief belongs in
the podcast. Confirm her debut/footprint shows both gears and that her tender
"venom-dropping" beat is protected for the emotional payoff. Same logic for the other dogs.

**No dog isolated (equity check).** Every dog should get a *relationship or recurrence
beat* per entry — never be stranded in a single solo box. A character readers meet only
once, alone, recedes no matter how good the box is (word count is not memorability — the
shortest box can be the most beloved). Use the canon pairings to fix it: Tiana ↔ Phaedra
(best friends), Phaedra ↔ Havok (aunt reins in nephew), Giselle presides over all. If a dog
would otherwise appear only once and alone, give them a cut-in, a cheer, or a reaction with
another dog. Watch **Tiana** especially — her box is the shortest *by function*, so her
memorability has to come from connection and recurrence, not length.

## 8. Draft ↔ record sync
Confirm story and every segment match between the record and the draft (the lint's sync
check is a backstop, not a guarantee). The record is source of truth; fix the draft to match
unless the prose itself is changing — then change both.

## 9. Governance (do not stomp the approval workflow)
If prose changed:
- Bump `version`, set `updatedAt`, write a `revisionNote`, and append an `updateHistory`
  entry describing the change.
- **Do NOT unilaterally flip `status` / `revisionState` / `approvedBy` / `approvedAt`.**
  Those are the human's/Codex's call. If the record was `approved`/`scheduled` and prose
  has moved past that snapshot, say so plainly and ask for re-confirmation before publish.

## 10. Final go/no-go
Report: lint result, validation result, continuity result, open critic/humanizer findings,
media status (a texture-driven recipe needs a real hero photo — temporary heroes are a
known publish gate), and the governance/approval state. Green only when the lint is clean
(or warnings consciously accepted), validation passes, continuity holds, and a human has
the approval call.

---
*Mechanical checks: `editorial-lint.mjs`. Judgment checks: this skill + the review agents.
Pattern registry: `Personas/writing-issues/`. Keep all three growing together.*
