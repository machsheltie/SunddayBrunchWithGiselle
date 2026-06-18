# ART-007 Content Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add executable Phase 0 validation that accepts representative recipe, episode, and correction records while rejecting unknown fields, reserved record types, and projection writeback.

**Architecture:** Keep canonical validation independent from the current placeholder UI data. Add a small content-contract module with explicit record definitions, a read-only authority boundary, JSON fixtures, Vitest coverage, and a CLI that writes inspectable ART-007 result evidence. The existing React pages continue using `src/data/content.js` until a later migration.

**Tech Stack:** Node.js ES modules, JavaScript, JSON fixtures, Vitest, existing npm toolchain.

---

## File Structure

- Create `sunday-brunch-website/src/content-contract/recordDefinitions.js`: allowed and required fields for Phase 0 recipe, episode, and correction fixtures.
- Create `sunday-brunch-website/src/content-contract/validateRecord.js`: strict record validator with unknown-field rejection.
- Create `sunday-brunch-website/src/content-contract/writeBoundary.js`: canonical mutation guard that rejects projections.
- Create `sunday-brunch-website/src/content-contract/index.js`: public exports for tests and CLI.
- Create `sunday-brunch-website/src/content-contract/__tests__/validation.test.js`: ART-007 acceptance tests.
- Create `sunday-brunch-website/content/fixtures/art-007/*.json`: valid and invalid evidence fixtures.
- Create `sunday-brunch-website/scripts/validate-art-007.mjs`: CLI runner and evidence writer.
- Modify `sunday-brunch-website/package.json`: add `validate:content` script.
- Modify `_bmad-output/specs/spec-sunday-brunch-with-giselle/evidence/ART-007-content-model-validation.md`: link command output and final results after execution.
- Modify `_bmad-output/specs/spec-sunday-brunch-with-giselle/artifact-register.md`: move ART-007 only after the validation checks pass and Stacey approves.

### Task 1: Establish The Red Test Suite

**Files:**
- Create: `sunday-brunch-website/src/content-contract/__tests__/validation.test.js`

- [ ] **Step 1: Write failing imports and acceptance tests**

```js
import { describe, expect, it } from 'vitest'
import {
    assertCanonicalWrite,
    validateRecord
} from '../index'

import validRecipe from '../../../content/fixtures/art-007/valid-recipe.json'
import validEpisode from '../../../content/fixtures/art-007/valid-episode.json'
import validCorrection from '../../../content/fixtures/art-007/valid-correction.json'
import unknownField from '../../../content/fixtures/art-007/invalid-unknown-field.json'
import reservedRecord from '../../../content/fixtures/art-007/invalid-reserved-record.json'

describe('ART-007 content contract', () => {
    it('validates a representative recipe', () => {
        expect(validateRecord(validRecipe)).toEqual({ valid: true, errors: [] })
    })

    it('validates a representative episode', () => {
        expect(validateRecord(validEpisode)).toEqual({ valid: true, errors: [] })
    })

    it('requires corrections to preserve prior-version traceability', () => {
        expect(validateRecord(validCorrection)).toEqual({ valid: true, errors: [] })
    })

    it('rejects unknown fields', () => {
        expect(validateRecord(unknownField)).toEqual({
            valid: false,
            errors: ['Unknown field: popularityScore']
        })
    })

    it('rejects reserved record types', () => {
        expect(validateRecord(reservedRecord)).toEqual({
            valid: false,
            errors: ['Reserved record type is inactive: public-review']
        })
    })

    it('rejects projection writeback', () => {
        expect(() => assertCanonicalWrite('website-projection')).toThrow(
            'Projection sources cannot write canonical content'
        )
    })
})
```

- [ ] **Step 2: Run the focused test and verify failure**

Run:

```powershell
npm run test -- --run src/content-contract/__tests__/validation.test.js
```

Expected: FAIL because `../index` and the fixtures do not exist.

- [ ] **Step 3: Commit the red test**

```powershell
git add sunday-brunch-website/src/content-contract/__tests__/validation.test.js
git commit -m "test: define phase zero content validation contract"
```

### Task 2: Add Strict Record Definitions

**Files:**
- Create: `sunday-brunch-website/src/content-contract/recordDefinitions.js`

- [ ] **Step 1: Define active and reserved record types**

```js
export const activeRecordTypes = new Set([
    'recipe',
    'episode',
    'correction'
])

export const reservedRecordTypes = new Set([
    'contributor-profile',
    'pet-profile',
    'submission',
    'moderation-action',
    'consent-grant',
    'contest',
    'merchandise-item',
    'public-review',
    'rating',
    'comment',
    'follower',
    'feed',
    'direct-message',
    'personalized-recommendation',
    'saved-plan',
    'cross-device-profile'
])
```

- [ ] **Step 2: Define common required and allowed fields**

```js
const commonRequired = [
    'id',
    'recordType',
    'version',
    'status',
    'owner',
    'reviewer',
    'approver',
    'createdAt',
    'updatedAt',
    'sourceReferences'
]

const commonAllowed = [
    ...commonRequired,
    'publishedAt',
    'correctionOf',
    'withdrawalReason'
]
```

- [ ] **Step 3: Define recipe, episode, and correction fields**

```js
export const recordDefinitions = {
    recipe: {
        required: [
            ...commonRequired,
            'slug',
            'title',
            'summary',
            'pillar',
            'productionStream',
            'times',
            'yield',
            'difficulty',
            'equipment',
            'ingredientGroups',
            'instructionSections',
            'allergens',
            'dietaryDisclosures',
            'sensoryCheckpoints',
            'substitutions',
            'troubleshooting',
            'storage',
            'media'
        ],
        allowed: [
            ...commonAllowed,
            'slug',
            'title',
            'summary',
            'pillar',
            'productionStream',
            'collectionIds',
            'episodeIds',
            'times',
            'yield',
            'difficulty',
            'equipment',
            'ingredientGroups',
            'instructionSections',
            'allergens',
            'dietaryDisclosures',
            'sensoryCheckpoints',
            'substitutions',
            'troubleshooting',
            'storage',
            'media',
            'testEvidence'
        ]
    },
    episode: {
        required: [
            ...commonRequired,
            'slug',
            'title',
            'briefId',
            'scriptId',
            'canonVersion',
            'cast',
            'chapters',
            'transcriptId',
            'mediaAssetIds',
            'rightsRecordIds',
            'disclosureVersion'
        ],
        allowed: [
            ...commonAllowed,
            'slug',
            'title',
            'briefId',
            'scriptId',
            'canonVersion',
            'cast',
            'recipeIds',
            'chapters',
            'transcriptId',
            'mediaAssetIds',
            'rightsRecordIds',
            'disclosureVersion',
            'releaseMetadata'
        ]
    },
    correction: {
        required: [
            ...commonRequired,
            'subjectId',
            'affectedVersion',
            'severity',
            'rationale',
            'containment',
            'correctedVersion',
            'changedFields',
            'noticeDecision',
            'closureEvidence'
        ],
        allowed: [
            ...commonAllowed,
            'subjectId',
            'affectedVersion',
            'severity',
            'rationale',
            'containment',
            'correctedVersion',
            'changedFields',
            'noticeDecision',
            'actionDecision',
            'relatedImpact',
            'closureEvidence',
            'preventionAction'
        ]
    }
}
```

- [ ] **Step 4: Run the test**

Expected: FAIL because validator exports are still missing.

### Task 3: Implement Strict Validation And Authority Guard

**Files:**
- Create: `sunday-brunch-website/src/content-contract/validateRecord.js`
- Create: `sunday-brunch-website/src/content-contract/writeBoundary.js`
- Create: `sunday-brunch-website/src/content-contract/index.js`

- [ ] **Step 1: Implement strict record validation**

```js
import {
    activeRecordTypes,
    recordDefinitions,
    reservedRecordTypes
} from './recordDefinitions'

export const validateRecord = (record) => {
    if (reservedRecordTypes.has(record.recordType)) {
        return {
            valid: false,
            errors: [`Reserved record type is inactive: ${record.recordType}`]
        }
    }

    if (!activeRecordTypes.has(record.recordType)) {
        return {
            valid: false,
            errors: [`Unknown record type: ${record.recordType}`]
        }
    }

    const definition = recordDefinitions[record.recordType]
    const missing = definition.required
        .filter((field) => record[field] === undefined)
        .map((field) => `Missing required field: ${field}`)

    const unknown = Object.keys(record)
        .filter((field) => !definition.allowed.includes(field))
        .map((field) => `Unknown field: ${field}`)

    const correctionErrors = record.recordType === 'correction' &&
        record.affectedVersion === record.correctedVersion
        ? ['Corrected version must differ from affected version']
        : []

    const errors = [...missing, ...unknown, ...correctionErrors]
    return { valid: errors.length === 0, errors }
}
```

- [ ] **Step 2: Implement the write boundary**

```js
const canonicalWriters = new Set([
    'canonical-editor',
    'controlled-migration'
])

export const assertCanonicalWrite = (sourceKind) => {
    if (!canonicalWriters.has(sourceKind)) {
        throw new Error('Projection sources cannot write canonical content')
    }
}
```

- [ ] **Step 3: Export the public contract**

```js
export { validateRecord } from './validateRecord'
export { assertCanonicalWrite } from './writeBoundary'
```

- [ ] **Step 4: Run the focused test**

Expected: fixture import failures only.

### Task 4: Add Inspectable Fixtures

**Files:**
- Create: `sunday-brunch-website/content/fixtures/art-007/valid-recipe.json`
- Create: `sunday-brunch-website/content/fixtures/art-007/valid-episode.json`
- Create: `sunday-brunch-website/content/fixtures/art-007/valid-correction.json`
- Create: `sunday-brunch-website/content/fixtures/art-007/invalid-unknown-field.json`
- Create: `sunday-brunch-website/content/fixtures/art-007/invalid-reserved-record.json`
- Create: `sunday-brunch-website/content/fixtures/art-007/invalid-correction-version.json`
- Create: `sunday-brunch-website/content/fixtures/art-007/invalid-correction-version-equal.json`

- [ ] **Step 1: Add a representative recipe fixture**

Use stable ID `recipe-art-007-001`, status `review`, Stacey for owner/reviewer/approver, one ingredient group, one instruction section, explicit disclosures, sensory checkpoints, troubleshooting, storage, media provenance, and source references. Include every required recipe field from `recordDefinitions.js` and no extra fields.

- [ ] **Step 2: Add a representative episode fixture**

Use stable ID `episode-art-007-001`, status `review`, canon version `CANON-2026-06-11.1`, the four approved character IDs, one chapter, transcript reference, media and rights references, disclosure version `ART-015-2026-06-11`, and every required episode field.

- [ ] **Step 3: Add a correction fixture**

Use stable ID `correction-art-007-001`, affected version `1`, corrected version `2`, severity `S2`, preserved subject reference, changed fields, notice decision, closure evidence, and prevention action.

- [ ] **Step 4: Add invalid fixtures**

Copy the valid recipe and add `"popularityScore": 99` for the unknown-field case. Create a minimal record with `"recordType": "public-review"` for the reserved-record case.
Add correction fixtures where `correctedVersion` is lower than `affectedVersion` and equal to `affectedVersion` so non-monotonic correction updates are rejected.

- [ ] **Step 5: Run the focused test**

Expected: all ART-007 validation tests PASS.

- [ ] **Step 6: Commit validator and fixtures**

```powershell
git add sunday-brunch-website/src/content-contract sunday-brunch-website/content/fixtures/art-007
git commit -m "feat: add executable content contract validation"
```

### Task 5: Add The Evidence Command

**Files:**
- Create: `sunday-brunch-website/scripts/validate-art-007.mjs`
- Modify: `sunday-brunch-website/package.json`

- [ ] **Step 1: Implement the CLI**

The command must load all seven JSON fixtures, run the eight contract checks, print a JSON summary, exit `1` on any failure, and write:

`../_bmad-output/specs/spec-sunday-brunch-with-giselle/evidence/generated/ART-007-results.json`

The output object must contain:

```js
{
    artifactId: 'ART-007',
    validatorVersion: '1.0.0',
    executedAt: new Date().toISOString(),
    command: 'npm run validate:content',
    schemaVersion: 'CONTENT-MODEL-2026-06-17.1',
    results,
    passed: results.every((result) => result.passed)
}
```

- [ ] **Step 2: Add the npm script**

```json
"validate:content": "node scripts/validate-art-007.mjs"
```

- [ ] **Step 3: Run the evidence command**

Run:

```powershell
npm run validate:content
```

Expected: eight PASS results, exit code `0`, and generated JSON evidence.

- [ ] **Step 4: Run the full unit suite**

Run:

```powershell
npm test
```

Expected: existing suite passes or any pre-existing unrelated failures are recorded separately; ART-007 focused tests must pass.

- [ ] **Step 5: Commit the evidence command**

```powershell
git add sunday-brunch-website/scripts/validate-art-007.mjs sunday-brunch-website/package.json sunday-brunch-website/package-lock.json _bmad-output/specs/spec-sunday-brunch-with-giselle/evidence/generated/ART-007-results.json
git commit -m "test: generate art 007 validation evidence"
```

### Task 6: Accept ART-007 Without Overclaiming Downstream Evidence

**Files:**
- Modify: `_bmad-output/specs/spec-sunday-brunch-with-giselle/evidence/ART-007-content-model-validation.md`
- Modify: `_bmad-output/specs/spec-sunday-brunch-with-giselle/artifact-register.md`
- Modify: `_bmad-output/specs/spec-sunday-brunch-with-giselle/execution-plan.md`
- Modify: `_bmad-output/specs/spec-sunday-brunch-with-giselle/.decision-log.md`

- [ ] **Step 1: Link exact evidence**

Record fixture paths, command, validator and schema versions, expected and actual results, execution date, and the generated JSON path.

- [ ] **Step 2: Request Stacey's acceptance**

Present all eight generated ART-007 evidence results. Do not infer approval from passing tests.

- [ ] **Step 3: Update statuses after approval**

- ART-007: `draft` to `accepted`
- ART-012: `blocked` to `draft`
- ART-014: `blocked` to `draft`
- WP-03: `in-progress` to `approved`
- Keep ART-009 as `draft`; it still needs a real recipe.

- [ ] **Step 4: Check the executable-validation gate items**

Mark complete only:

- Unknown fields, reserved records, and projection writeback are rejected.
- Representative recipe and episode validate, correction versions must advance, and optional recipe story coverage remains covered in the focused unit suite.

- [ ] **Step 5: Run final verification**

```powershell
npm run validate:content
npm run test -- --run src/content-contract/__tests__/validation.test.js
git diff --check
```

Expected: validation PASS, focused tests PASS, no whitespace errors.

## Self-Review

- Spec coverage: all eight current ART-007 evidence behaviors have a fixture, executable check, command, and evidence output.
- Boundary coverage: current placeholder UI data is not silently promoted to canonical content.
- Type consistency: `recordType`, version, source, status, and authority names are identical across definitions, fixtures, tests, and CLI.
- Remaining work: ART-009, ART-012, and ART-014 require real recipe, episode, and correction evidence after ART-007 acceptance.
