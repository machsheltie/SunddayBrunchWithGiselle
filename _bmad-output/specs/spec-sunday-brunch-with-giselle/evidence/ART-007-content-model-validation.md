# ART-007 Content-Model Validation Record

- Status: accepted
- Contract owner, test operator, and approver: Stacey
- Evidence-contract approval date: 2026-06-12
- Current executable evidence recorded: 2026-06-16T16:34:07.825Z
- Final acceptance: accepted by Stacey on 2026-06-16
- Governing artifacts: website-scoped content contract in `sunday-brunch-website/src/content-contract`, validator runner `sunday-brunch-website/scripts/validate-art-007.mjs`, `content-model.md`, `source-of-truth.md`, ART-006, and ART-026
- Generated JSON evidence: `_bmad-output/specs/spec-sunday-brunch-with-giselle/evidence/generated/ART-007-results.json`

## Evidence Contract

ART-007 is accepted only when one executable validation mechanism produces inspectable evidence for every required test below. The current generated evidence also includes one supplemental post-acceptance hardening guard for monotonic correction-version ordering.

Each test record must include:

- Fixture or input path and stable ID
- Executed command
- Validator name and version
- Governing schema or ruleset version
- Expected result
- Actual result and output
- Pass or fail
- Execution date
- Stacey's final approval

## Required Tests

| Test | Required behavior | Fixture / input | Generated check ID | Result |
|---|---|---|---|---|
| 1. Representative recipe | A complete launch-core recipe validates without unknown fields or reserved dependencies | `sunday-brunch-website/content/fixtures/art-007/valid-recipe.json` | `valid-recipe` | PASS |
| 2. Representative episode | A complete launch-core episode validates without unknown fields or reserved dependencies | `sunday-brunch-website/content/fixtures/art-007/valid-episode.json` | `valid-episode` | PASS |
| 3. Correction traceability fixture | ART-007 requires correction history with prior-version preservation; this website-scoped check directly proves that a valid correction record with `affectedVersion` / `correctedVersion` traceability validates. It does not execute a version-creation or prior-version archival helper. | `sunday-brunch-website/content/fixtures/art-007/valid-correction.json` | `valid-correction` | PASS |
| 4. Unknown field rejection | A record containing an undeclared field is rejected rather than stored, published, or silently stripped | `sunday-brunch-website/content/fixtures/art-007/invalid-unknown-field.json` | `invalid-unknown-field` | PASS |
| 5. Reserved record rejection | An instance of a reserved record type is rejected and does not activate storage, workflow, page, permission, or analytics support | `sunday-brunch-website/content/fixtures/art-007/invalid-reserved-record.json` | `invalid-reserved-record` | PASS |
| 6. Projection no-writeback | A generated page, feed, index, cache, or other projection cannot modify canonical content | `assertCanonicalWrite('website-projection')` | `projection-writeback` | PASS |

## Supplemental Generated Guard

| Guard | Behavior | Fixture / input | Generated check ID | Result |
|---|---|---|---|---|
| Correction-version monotonicity | A correction record is rejected when `correctedVersion` is the same as or lower than `affectedVersion`; this hardens the accepted ART-007 evidence without claiming a real correction exercise. | `sunday-brunch-website/content/fixtures/art-007/invalid-correction-version.json` | `invalid-correction-version` | PASS |

## Current Execution Evidence

- Generated JSON evidence: `_bmad-output/specs/spec-sunday-brunch-with-giselle/evidence/generated/ART-007-results.json`
- Command: `npm run validate:content` executed from `sunday-brunch-website`
- Validator: `sunday-brunch-website/src/content-contract` / `sunday-brunch-website/scripts/validate-art-007.mjs`
- Validator version: `1.0.0`
- Governing schema version: `CONTENT-MODEL-2026-06-12.1`
- Execution timestamp: `2026-06-16T16:34:07.825Z`
- Overall generated result: `passed=true`
- Outcome: 7 / 7 PASS
- Required/supplemental split: the original six required ART-007 checks remain PASS; the supplemental correction-version monotonicity guard also passes.

### Per-check evidence summary

| Check | ID | Generated JSON name | Evidence proved by this check | Fixture / input | Expected result from generated JSON | Actual result / emitted error from generated JSON | Pass/Fail |
|---|---|---|---|---|---|---|---|
| Required 1 | `valid-recipe` | `Valid recipe returns a successful validation result` | The representative recipe fixture satisfies the website-scoped content contract. | `sunday-brunch-website/content/fixtures/art-007/valid-recipe.json` | `{"valid":true,"errors":[]}` | `{"valid":true,"errors":[]}` | PASS |
| Required 2 | `valid-episode` | `Valid episode returns a successful validation result` | The representative episode fixture satisfies the website-scoped content contract. | `sunday-brunch-website/content/fixtures/art-007/valid-episode.json` | `{"valid":true,"errors":[]}` | `{"valid":true,"errors":[]}` | PASS |
| Required 3 | `valid-correction` | `Valid correction returns a successful validation result` | The correction fixture validates as a record carrying traceability fields including `subjectId`, `affectedVersion`, `correctedVersion`, `changedFields`, `noticeDecision`, and `closureEvidence`; no versioning mutation or prior-version archival helper is executed by this generated check. | `sunday-brunch-website/content/fixtures/art-007/valid-correction.json` | `{"valid":true,"errors":[]}` | `{"valid":true,"errors":[]}` | PASS |
| Supplemental 1 | `invalid-correction-version` | `Correction records must advance correctedVersion beyond affectedVersion` | The website-scoped contract rejects a correction record where `correctedVersion` is lower than `affectedVersion`, proving the same-or-lower version guard without executing a real correction workflow. | `sunday-brunch-website/content/fixtures/art-007/invalid-correction-version.json` | `{"valid":false,"errors":["Corrected version must be greater than affected version"]}` | `{"valid":false,"errors":["Corrected version must be greater than affected version"]}` | PASS |
| Required 4 | `invalid-unknown-field` | `Unknown popularityScore field is rejected` | The website-scoped contract rejects an undeclared field on the covered recipe fixture. | `sunday-brunch-website/content/fixtures/art-007/invalid-unknown-field.json` | `{"valid":false,"errors":["Unknown field: popularityScore"]}` | `{"valid":false,"errors":["Unknown field: popularityScore"]}` | PASS |
| Required 5 | `invalid-reserved-record` | `Reserved public-review record type is rejected` | The website-scoped contract rejects the reserved `public-review` record type. | `sunday-brunch-website/content/fixtures/art-007/invalid-reserved-record.json` | `{"valid":false,"errors":["Reserved record type is inactive: public-review"]}` | `{"valid":false,"errors":["Reserved record type is inactive: public-review"]}` | PASS |
| Required 6 | `projection-writeback` | `Website projection source cannot write canonical content` | The write-boundary guard rejects a website projection source attempting canonical content writeback. | `assertCanonicalWrite('website-projection')` | `{"error":"Projection sources cannot write canonical content"}` | `{"error":"Projection sources cannot write canonical content"}` | PASS |

All six required website-scoped checks and the supplemental correction-version monotonicity guard pass in the generated JSON evidence. Stacey's ART-007 final approval remains dated 2026-06-16.

## Superseded Historical Context

Earlier root-level executable evidence was recorded on 2026-06-15 using `node content/art-007-run.js` from the repository root with 6 / 6 PASS. That evidence is retained only as historical context. The current executable evidence for ART-007 is the website-scoped validator and generated JSON listed above.

## Scope Notes And Known Limitations

These limitations do not change the generated 7 / 7 PASS result, but they define what the current website-scoped evidence does and does not prove:

- The validator covers the ART-007 website fixtures for recipe, episode, and correction record validation; correction-version monotonicity for the supplemental invalid correction fixture; unknown-field rejection for the defined website-scoped active types; reserved `public-review` rejection; and the canonical-write boundary guard.
- The correction check validates fixture data and traceability fields. It does not execute a versioning mutation helper or independently prove prior-version archival output.
- The generated evidence does not prove complete launch-core executable coverage for every type in `content-model.md`.
- The write-boundary guard proves contract-level rejection of projection writeback. It does not prove broader OS-level filesystem immutability.

## Acceptance Boundary

Approval of this evidence contract did not prove final acceptance on its own. The required executable evidence and supplemental guard exist above (7 / 7 PASS), and Stacey recorded final approval on 2026-06-16; ART-007 remains `accepted`.

## Acceptance Decision

- Result: accepted
- Approver: Stacey
- Date: 2026-06-16
