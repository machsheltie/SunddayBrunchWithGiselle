# ART-014 Correction Exercise Record

- Status: accepted
- Contract owner, correction coordinator, exercise operator, and approver: Stacey
- Evidence-contract approval date: 2026-06-12
- Exercise completed and accepted by Stacey: 2026-06-22
- ART-007 dependency: satisfied on 2026-06-16 by accepted website-scoped correction traceability validation
- Governing artifacts: ART-007, ART-013, `content-model.md`, and `editorial-policies.md#correction-and-revision-policy`
- Correction record (evidence): `evidence/ART-014-correction-record.json`
- Generated validation evidence: `evidence/generated/ART-014-results.json`

## Evidence Contract

ART-014 is accepted only when one tabletop `S1 Critical` or `S2 Major` correction follows the approved policy from report through closure.

The exercise record must identify:

- Scenario ID and exercise date
- Subject ID, affected record type, and affected version
- Reporter, report channel, and report date
- Severity decision and rationale
- Evidence and investigation
- Immediate containment, disablement, or withdrawal action
- Stacey as accountable owner and approver
- Preserved original version
- New corrected version and exact changed fields
- Related episode, recipe, campaign, media, transcript, feed, page, or asset impact
- Public notice wording and placement, or documented no-notice rationale
- Rollback, withdrawal, restoration, replacement, or no-action decision
- Accepted ART-007 evidence that correction history is preserved
- Closure date, closure evidence, and prevention action
- Stacey's final approval

## Tabletop Scope And Method

- This is a **tabletop (simulated) exercise**, not a live production incident. It walks the approved correction policy end to end on a realistic scenario to prove the process works.
- Subject is the real representative recipe **REC-001 French Silk Pie**. To give the exercise a genuine error to catch, the scenario **injects a deliberately incorrect published value** (chill time `PT1H`). The real REC-001 record already carries the correct value (`PT2H`), which is also where the correction lands — so the exercise never asserts the live record is wrong.
- **No content boundary was crossed.** No record under `content/records/` was modified. The corrected version, changed fields, and preserved prior version are captured in `evidence/ART-014-correction-record.json` (evidence only). The affected/corrected version numbers refer to a hypothetical *published edition* line used only for this tabletop and are distinct from REC-001's real pre-publication development ledger (currently version 14, `scheduled`/unpublished).
- Per D-14, an unpublished record needs no correction record; the scenario therefore posits REC-001 as **published** so an S2 correction is genuinely required.

## Scenario

- **Scenario ID:** SCN-014-S2-001
- **Exercise date:** 2026-06-22
- **Premise:** A published edition of REC-001 stated the chilling time as one hour (`times.chill: PT1H`; step 7: "Refrigerate at least 1 hour"). A deep 9-inch French silk filling sets by whipped butterfat and incorporated air rather than gelatin, and needs at least two hours cold to slice cleanly. One hour leaves the pie soupy and unsliceable.

## Exercise Record

| Field | Result |
|---|---|
| Scenario and affected subject | SCN-014-S2-001 (2026-06-22). Subject `REC-001` French Silk Pie; affected record type **recipe**; affected published edition **1**. |
| Report channel and reporter | **Audience correction contact.** A reader reported on 2026-06-22 that they chilled the pie for the stated hour, served it at a gathering, and it would not hold a slice. |
| Severity and rationale | **S2 Major.** An instructions/timing error that can materially mislead a reader into serving an unsliceable pie. Not a safety, legal, consent, or rights hazard, so it is S2 (correct promptly + visible notice), not S1 (immediate withdrawal). |
| Evidence and investigation | Reader report plus a test-kitchen set-time re-test (`source-art-014-retest`): one hour leaves the filling too soft to slice; at least two hours sets it firmly; overnight is better. |
| Immediate containment | Content **not withdrawn** (S2, no safety hazard). An interim correction notice was placed on the recipe page flagging the chill time as under review while the corrected edition was prepared, warning that day's readers to chill longer. |
| Original version preservation | Published edition **1** preserved in history; it is not silently overwritten. The corrected edition is a new version (see history-preservation evidence below). |
| Corrected version and changed fields | Published edition **2**. Changed fields: `times.chill` `PT1H` → `PT2H`; `times.total` `PT1H42M` → `PT2H42M`; step `instruction-step-rec-001-07` body "Refrigerate at least 1 hour." → "Refrigerate at least 2 hours, or overnight." |
| Related impact | EP-001 (draft, unpublished) features REC-001 but carries no independent chill-time claim — no correction needed. Collections reference the recipe by ID — no change. No campaign/transcript/feed had published the understated value beyond the recipe-derived references covered by the notice. |
| Notice decision | **Required.** Visible correction note at the top of the recipe page and in update history, carried in any feed/show-notes referencing the recipe. Wording: *"Correction (2026-06-22): An earlier version of this recipe understated the chilling time. This pie needs at least 2 hours in the refrigerator (overnight is better) to set firmly enough to slice cleanly. We have corrected the chill time and the total time."* |
| Rollback, withdrawal, restoration, replacement, or no action | **Correct forward** into published edition 2. No rollback/withdrawal/replacement: a non-safety error fixed by the corrected edition; prior edition preserved with the notice. |
| Closure and prevention | **Closed 2026-06-22.** Corrected edition 2 records the new timing and the notice is published (`closure-art-014-correction`). **Prevention:** add a timed set-verification gate to the recipe quality checklist (ART-008 cooking contract) — chill/total times on no-bake/chilled recipes must be confirmed by a timed test-kitchen set before approval (`prevention-art-014-001`). |
| Stacey final approval | **Accepted by Stacey on 2026-06-22.** The completed S2 exercise satisfies the evidence contract. |

## History-Preservation Evidence (ART-007)

The correction contract that preserves history is already accepted under **ART-007** (`evidence/generated/ART-007-results.json`, 9/9 PASS):

- `correctedVersion` must be **greater than** `affectedVersion` (monotonic version guard) — a correction always creates a new version and cannot overwrite the prior one in place.
- Website projection sources **cannot write** canonical content (projection-no-writeback).

This exercise's correction record conforms to that same accepted contract. Running the accepted `validateRecord` against `evidence/ART-014-correction-record.json` returns `{ valid: true, errors: [] }` (`evidence/generated/ART-014-results.json`): all required correction fields present, no unknown fields, and `correctedVersion (2) > affectedVersion (1)`.

## Acceptance Boundary

The S1/S2 exercise is complete, history preservation is demonstrated, notice and action decisions are recorded, and closure and prevention evidence exist. Stacey accepted the completed exercise on 2026-06-22. Acceptance covers the correction *process* demonstration only; it does not modify any canonical record and does not complete ART-012, ART-018, or the ART-025 Phase 0 gate report.
