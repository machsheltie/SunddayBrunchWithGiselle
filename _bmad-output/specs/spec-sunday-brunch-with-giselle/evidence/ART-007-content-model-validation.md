# ART-007 Content-Model Validation Record

- Status: ready-for-approval
- Contract owner, test operator, and approver: Stacey
- Evidence-contract approval date: 2026-06-12
- Current executable evidence recorded: 2026-06-16T09:27:26.369Z
- Final acceptance: pending Stacey approval
- Governing artifacts: website-scoped content contract in `sunday-brunch-website/src/content-contract`, validator runner `sunday-brunch-website/scripts/validate-art-007.mjs`, `content-model.md`, `source-of-truth.md`, ART-006, and ART-026
- Generated JSON evidence: `_bmad-output/specs/spec-sunday-brunch-with-giselle/evidence/generated/ART-007-results.json`

## Evidence Contract

ART-007 is accepted only when one executable validation mechanism produces inspectable evidence for every required test below.

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
| 3. Correction history | A correction creates a new version while preserving the affected prior version and traceability | `sunday-brunch-website/content/fixtures/art-007/valid-correction.json` | `valid-correction` | PASS |
| 4. Unknown field rejection | A record containing an undeclared field is rejected rather than stored, published, or silently stripped | `sunday-brunch-website/content/fixtures/art-007/invalid-unknown-field.json` | `invalid-unknown-field` | PASS |
| 5. Reserved record rejection | An instance of a reserved record type is rejected and does not activate storage, workflow, page, permission, or analytics support | `sunday-brunch-website/content/fixtures/art-007/invalid-reserved-record.json` | `invalid-reserved-record` | PASS |
| 6. Projection no-writeback | A generated page, feed, index, cache, or other projection cannot modify canonical content | `assertCanonicalWrite('website-projection')` | `projection-writeback` | PASS |

## Current Execution Evidence

- Generated JSON evidence: `_bmad-output/specs/spec-sunday-brunch-with-giselle/evidence/generated/ART-007-results.json`
- Command: `npm run validate:content` executed from `sunday-brunch-website`
- Validator: `sunday-brunch-website/src/content-contract` / `sunday-brunch-website/scripts/validate-art-007.mjs`
- Validator version: `1.0.0`
- Governing schema version: `CONTENT-MODEL-2026-06-12.1`
- Execution timestamp: `2026-06-16T09:27:26.369Z`
- Overall generated result: `passed=true`
- Outcome: 6 / 6 PASS

### Per-check evidence summary

| Check | ID | Name | Fixture / input | Expected result from generated JSON | Actual result / emitted error from generated JSON | Pass/Fail |
|---|---|---|---|---|---|---|
| 1 | `valid-recipe` | `Valid recipe returns a successful validation result` | `sunday-brunch-website/content/fixtures/art-007/valid-recipe.json` | `{"valid":true,"errors":[]}` | `{"valid":true,"errors":[]}` | PASS |
| 2 | `valid-episode` | `Valid episode returns a successful validation result` | `sunday-brunch-website/content/fixtures/art-007/valid-episode.json` | `{"valid":true,"errors":[]}` | `{"valid":true,"errors":[]}` | PASS |
| 3 | `valid-correction` | `Valid correction returns a successful validation result` | `sunday-brunch-website/content/fixtures/art-007/valid-correction.json` | `{"valid":true,"errors":[]}` | `{"valid":true,"errors":[]}` | PASS |
| 4 | `invalid-unknown-field` | `Unknown popularityScore field is rejected` | `sunday-brunch-website/content/fixtures/art-007/invalid-unknown-field.json` | `{"valid":false,"errors":["Unknown field: popularityScore"]}` | `{"valid":false,"errors":["Unknown field: popularityScore"]}` | PASS |
| 5 | `invalid-reserved-record` | `Reserved public-review record type is rejected` | `sunday-brunch-website/content/fixtures/art-007/invalid-reserved-record.json` | `{"valid":false,"errors":["Reserved record type is inactive: public-review"]}` | `{"valid":false,"errors":["Reserved record type is inactive: public-review"]}` | PASS |
| 6 | `projection-writeback` | `Website projection source cannot write canonical content` | `assertCanonicalWrite('website-projection')` | `{"error":"Projection sources cannot write canonical content"}` | `{"error":"Projection sources cannot write canonical content"}` | PASS |

All six website-scoped checks pass in the generated JSON evidence. This makes ART-007 ready for Stacey acceptance request; it does not mark ART-007 accepted.

## Superseded Historical Context

Earlier root-level executable evidence was recorded on 2026-06-15 using `node content/art-007-run.js` from the repository root with 6 / 6 PASS. That evidence is retained only as historical context. The current executable evidence for ART-007 is the website-scoped validator and generated JSON listed above.

## Acceptance Boundary

Approval of this evidence contract does not prove final acceptance on its own. The required executable evidence now exists above (6 / 6 PASS), but ART-007 moves to `accepted` only when Stacey records final approval.

## Acceptance Decision

- Result: pending Stacey approval
- Approver: Stacey
- Date: _pending_
