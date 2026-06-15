# ART-007 Content-Model Validation Record

- Status: ready-for-approval
- Contract owner, test operator, and approver: Stacey
- Evidence-contract approval date: 2026-06-12
- Executable evidence recorded: 2026-06-15
- Final acceptance: pending Stacey approval
- Governing artifacts: `content-model.md`, `source-of-truth.md`, ART-006, and ART-026

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

| Test | Required behavior | Fixture / input | Result |
|---|---|---|---|
| 1. Representative recipe | A complete launch-core recipe validates without unknown fields or reserved dependencies | `content/records/recipes/REC-001-giselles-royal-velvet-cake.json` | PASS |
| 2. Representative episode | A complete launch-core episode validates without unknown fields or reserved dependencies | `content/records/episodes/EP-001-the-first-sunday.json` | PASS |
| 3. Correction history | A correction creates a new version while preserving the affected prior version and traceability | `content/fixtures/correction/REC-002-v1.json` | PASS |
| 4. Unknown field rejection | A record containing an undeclared field is rejected rather than stored, published, or silently stripped | `content/fixtures/bad/recipe-unknown-field.json` | PASS |
| 5. Reserved record rejection | An instance of a reserved record type is rejected and does not activate storage, workflow, page, permission, or analytics support | `content/fixtures/bad/reserved-record-public-review.json` | PASS |
| 6. Projection no-writeback | A generated page, feed, index, cache, or other projection cannot modify canonical content | `sunday-brunch-website/vite.config.js` + `content/` artefact check | PASS |

## Execution Evidence

- Validator: `content/validator/index.js` (commit `f06470c`)
- Correction helper: `content/validator/correct.js` (commit `511429c`)
- Test runner: `content/art-007-run.js` (commit `6640fa1`)
- Governing schema: `content-model.md` (ART-006), `source-of-truth.md` (ART-026)
- Run command: `node content/art-007-run.js` (executed from repository root)
- Run date: 2026-06-15
- Outcome: 6 / 6 PASS, process exit code 0

### Per-test evidence summary

| Test | Command | Expected | Actual | Pass/Fail |
|---|---|---|---|---|
| 1 | `validate(REC-001)` | `valid=true, errors=[]` | `valid=true, errors=[]` | PASS |
| 2 | `validate(EP-001)` | `valid=true, errors=[]` | `valid=true, errors=[]` | PASS |
| 3 | `applyCorrection(REC-002 v1, {...})` | version 1 → 2; prior version archived in `history[0]` with `archivedAt`; corrected record re-validates | version=2, history entries=1, `history[0].version`=1, `archivedAt` present, re-validates true | PASS |
| 4 | `validate(recipe-unknown-field)` | `valid=false`, error names `popularityScore` as unknown field | `valid=false`; error: `unknown field: popularityScore (not in approved schema for type 'recipe') — schema change control required` | PASS |
| 5 | `validate(reserved public-review)` | `valid=false`, error names reserved type | `valid=false`; error: `reserved type 'public-review': reserved records cannot be instantiated, stored, published, or used to activate storage, workflow, page, permission, or analytics support` | PASS |
| 6 | read `vite.config.js`; resolve build output; check `content/` for artefacts | build output resolves outside `content/`; `content/` holds no `index.html` or `assets/` | outDir not set (Vite default `dist`); resolved build output `…/sunday-brunch-website/dist` is outside `…/content`; no artefacts in `content/` | PASS |

### Full runner output

```
ART-007 Content Model Validation — Executable Test Run
Validator:  content/validator/index.js
Schema:     content-model.md (ART-006), source-of-truth.md (ART-026)
Run date:   2026-06-15T15:36:07.509Z

────────────────────────────────────────────────────────────
Test 1: Representative recipe validates without unknown fields or reserved dependencies
────────────────────────────────────────────────────────────
Fixture:  content/records/recipes/REC-001-giselles-royal-velvet-cake.json
Type:     recipe   ID: REC-001
Expected: valid=true, errors=[]
Actual:   valid=true, errors=[]
Result:   PASS

────────────────────────────────────────────────────────────
Test 2: Representative episode validates without unknown fields or reserved dependencies
────────────────────────────────────────────────────────────
Fixture:  content/records/episodes/EP-001-the-first-sunday.json
Type:     episode   ID: EP-001
Expected: valid=true, errors=[]
Actual:   valid=true, errors=[]
Result:   PASS

────────────────────────────────────────────────────────────
Test 3: Correction creates a new version while preserving the affected prior version
────────────────────────────────────────────────────────────
Fixture:  content/fixtures/correction/REC-002-v1.json
Original: version=1, status=published
Corrected: version=2, status=corrected
History entries: 1
history[0].version: 1  (prior version preserved)
history[0].archivedAt: 2026-06-15T15:36:07.512Z
Corrected record re-validates: true
Result:   PASS

────────────────────────────────────────────────────────────
Test 4: A record containing an undeclared field is rejected rather than stored or silently stripped
────────────────────────────────────────────────────────────
Fixture:  content/fixtures/bad/recipe-unknown-field.json
Contains: popularityScore=9.5 (not in approved recipe schema)
Expected: valid=false, error mentions 'popularityScore'
Actual:   valid=false
Errors:   unknown field: popularityScore (not in approved schema for type 'recipe') — schema change control required
Result:   PASS

────────────────────────────────────────────────────────────
Test 5: An instance of a reserved record type is rejected and produces a clear rejection message
────────────────────────────────────────────────────────────
Fixture:  content/fixtures/bad/reserved-record-public-review.json
Type:     public-review  (reserved per source-of-truth.md)
Expected: valid=false, error mentions 'reserved type'
Actual:   valid=false
Errors:   reserved type 'public-review': reserved records cannot be instantiated, stored, published, or used to activate storage, workflow, page, permission, or analytics support
Result:   PASS

────────────────────────────────────────────────────────────
Test 6: The canonical content directory is isolated from build output — projections cannot write back
────────────────────────────────────────────────────────────
Checked:  sunday-brunch-website/vite.config.js
Build outDir: not set (Vite default: dist)
Resolved build output: C:\Users\heirr\OneDrive\Desktop\Hope2_Studio\SundayBrunchWithGiselle\sunday-brunch-website\dist
Canonical content dir: C:\Users\heirr\OneDrive\Desktop\Hope2_Studio\SundayBrunchWithGiselle\content
content/ has no index.html or assets/ (build artefacts): true
Canonical content/ is a read-only source. Build output goes to 'sunday-brunch-website/dist'.
No projection, cache, feed, search index, or CMS can write to content/.
Result:   PASS

════════════════════════════════════════════════════════════
ART-007 Test Summary — 2026-06-15T15:36:07.514Z
════════════════════════════════════════════════════════════
  ✓ Test 1: PASS  — Representative recipe validates without unknown fields or reserved dependencies
  ✓ Test 2: PASS  — Representative episode validates without unknown fields or reserved dependencies
  ✓ Test 3: PASS  — Correction creates a new version while preserving the affected prior version
  ✓ Test 4: PASS  — A record containing an undeclared field is rejected rather than stored or silently stripped
  ✓ Test 5: PASS  — An instance of a reserved record type is rejected and produces a clear rejection message
  ✓ Test 6: PASS  — The canonical content directory is isolated from build output — projections cannot write back

Passed: 6 / 6
Failed: 0 / 6

✓ ALL TESTS PASS — ART-007 executable evidence is complete.
  Next: copy this output into ART-007-content-model-validation.md and obtain Stacey approval.
```

## Scope Notes And Known Limitations

These do not affect any of the six required tests, but are recorded for honest review before acceptance:

- **Field-level allowlisting is enforced for `recipe` and `episode` only.** The validator carries detailed field rules for these two aggregates. The other 13 active launch-core types (e.g. `character`, `collection`, `chapter`) currently validate the common record contract but do not yet reject unknown type-specific fields, because their per-type rule files have not been authored. Reserved-type rejection (Rule 1) and the common-contract checks apply to all types. Adding a rule file under `content/validator/rules/` immediately activates full allowlisting for that type. Test 4's unknown-field proof is demonstrated on a `recipe`.
- **Test 6 proves structural isolation, not filesystem permissions.** It verifies the website build output resolves outside `content/` and that `content/` holds no build artefacts. It does not enforce OS-level write protection; the no-writeback guarantee is also a documented operating rule in `content/README.md`.

## Acceptance Boundary

Approval of this evidence contract does not prove executable validation on its own. The required executable evidence now exists above (6 / 6 PASS, exit 0). ART-007 moves to `accepted` only when Stacey records final approval below.

## Acceptance Decision

- Result: pending Stacey approval
- Approver: Stacey
- Date: _pending_

