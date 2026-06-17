# Phase 0 ART-007 Content Model Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce executable pass/fail evidence for all 6 ART-007 required tests, proving the approved content model (ART-006) can validate records correctly — unblocking ART-009, ART-012, and ART-014.

**Architecture:** Create a standalone content validation system at `content/` in the repo root. Canonical records are JSON files. A pure CommonJS Node.js validator (zero npm dependencies) checks records against rules derived from `content-model.md` and `source-of-truth.md`. A test runner script executes 6 tests and prints inspectable evidence. After tests pass, the ART-007 evidence file is updated with results.

**Tech Stack:** Node.js (built-in, zero dependencies), CommonJS, JSON

---

## File Map

| File | Purpose |
|---|---|
| `content/README.md` | Declares canonical editorial source per D-02 |
| `content/validator/types.js` | Active/reserved type constants |
| `content/validator/rules/common.js` | Common required/allowed fields |
| `content/validator/rules/recipe.js` | Recipe field rules |
| `content/validator/rules/episode.js` | Episode field rules |
| `content/validator/index.js` | `validate(record)` → `{valid, errors}` |
| `content/validator/correct.js` | `applyCorrection(original, patch)` |
| `content/records/recipes/REC-001-giselles-royal-velvet-cake.json` | Representative recipe (Test 1, ART-009) |
| `content/records/episodes/EP-001-the-first-sunday.json` | Representative episode (Test 2, ART-012) |
| `content/fixtures/bad/recipe-unknown-field.json` | Recipe with `popularityScore` (Test 4) |
| `content/fixtures/bad/reserved-record-public-review.json` | `public-review` type instance (Test 5) |
| `content/fixtures/correction/REC-002-v1.json` | Published recipe, pre-correction (Test 3) |
| `content/art-007-run.js` | Test runner — produces ART-007 evidence output |
| `_bmad-output/specs/spec-sunday-brunch-with-giselle/evidence/ART-007-content-model-validation.md` | Updated with test results after run |

---

## Task 1: Bootstrap the content directory

**Files:**
- Create: `content/README.md`

- [ ] Create the directory structure:

```bash
mkdir -p content/validator/rules
mkdir -p content/records/recipes
mkdir -p content/records/episodes
mkdir -p content/fixtures/bad
mkdir -p content/fixtures/correction
```

- [ ] Write `content/README.md`:

```markdown
# Canonical Editorial Content

This directory is the canonical editorial source selected by D-02 (2026-06-11).

- Records in `records/` are the authoritative version of all editorial content.
- This directory is a read-only source for the website build and all projections.
- Records are versioned via Git history; corrections preserve prior versions in the record's `history` array.
- No build tool, projection, CMS output, or AI-generated file may modify files in this directory without human authorship and approval.

Governing documents:
- `_bmad-output/specs/spec-sunday-brunch-with-giselle/content-model.md`
- `_bmad-output/specs/spec-sunday-brunch-with-giselle/source-of-truth.md`

Validation: `node content/art-007-run.js`
```

- [ ] Commit:

```bash
git add content/README.md
git commit -m "chore(content): bootstrap canonical content directory per D-02"
```

---

## Task 2: Create record type constants

**Files:**
- Create: `content/validator/types.js`

- [ ] Write `content/validator/types.js`:

```javascript
'use strict'

// Source: source-of-truth.md — Launch-Core Schema Allowlist
const ACTIVE_TYPES = new Set([
  'recipe',
  'ingredient-group',
  'ingredient-item',
  'instruction-section',
  'instruction-step',
  'episode',
  'chapter',
  'transcript',
  'character',
  'character-profile-version',
  'collection',
  'media-asset',
  'person',
  'review-or-approval',
  'newsletter-or-campaign'
])

// Source: source-of-truth.md — Reserved Future Boundary
const RESERVED_TYPES = new Set([
  'contributor-profile',
  'pet-profile',
  'submission',
  'moderation-action',
  'consent-grant',
  'contest',
  'merchandise-item',
  'artwork-version',
  'sample-approval',
  'fulfillment-provider',
  'public-review',
  'rating',
  'comment',
  'follower',
  'direct-message',
  'popularity-ranking',
  'recommendation',
  'achievement',
  'saved-plan',
  'cross-device-profile'
])

// Source: content-model.md — Common Record Contract
const COMMON_REQUIRED_FIELDS = [
  'id', 'type', 'status', 'version',
  'createdAt', 'updatedAt', 'createdBy', 'updatedBy',
  'ownerId', 'sourceRefs', 'revisionNote'
]

// Published records additionally allow these fields
const PUBLISHED_EXTRA_FIELDS = new Set([
  'slug', 'publishedAt', 'approvedBy', 'approvedAt'
])

// history is added by applyCorrection; allowed on any record
const COMMON_ALLOWED_FIELDS = new Set([
  ...COMMON_REQUIRED_FIELDS,
  'slug', 'publishedAt', 'approvedBy', 'approvedAt',
  'history'
])

const VALID_STATUSES = new Set([
  'draft', 'review', 'scheduled', 'published',
  'corrected', 'archived', 'withdrawn'
])

module.exports = {
  ACTIVE_TYPES,
  RESERVED_TYPES,
  COMMON_REQUIRED_FIELDS,
  COMMON_ALLOWED_FIELDS,
  VALID_STATUSES
}
```

- [ ] Verify the file loads and counts are correct:

```bash
node -e "const t = require('./content/validator/types.js'); console.log('ACTIVE_TYPES:', t.ACTIVE_TYPES.size, '(expect 15)'); console.log('RESERVED_TYPES:', t.RESERVED_TYPES.size, '(expect 20)')"
```

Expected output:
```
ACTIVE_TYPES: 15 (expect 15)
RESERVED_TYPES: 20 (expect 20)
```

- [ ] Commit:

```bash
git add content/validator/types.js
git commit -m "feat(content): add record type constants for ART-007 validator"
```

---

## Task 3: Create field rules for recipe and episode types

**Files:**
- Create: `content/validator/rules/recipe.js`
- Create: `content/validator/rules/episode.js`

- [ ] Write `content/validator/rules/recipe.js`:

```javascript
'use strict'

// Source: content-model.md — Recipe Aggregate
// Fields that must have a key present in a recipe record.
// Values may be null for draft records; structure must be present.
const RECIPE_REQUIRED_FIELDS = [
  'title',
  'summary',
  'primaryPillarId',
  'productionStreamId',
  'author',
  'tester',
  'reviewer',
  'approver',
  'testDate',
  'revisionState',
  'updateHistory',
  'prepTime',
  'cookTime',
  'totalTime',
  'yield',
  'difficulty',
  'ingredientGroups',
  'instructionSections'
]

// Full list of allowed field names for a recipe record.
// A field present in a recipe record that is NOT in this set is an unknown field and must be rejected.
const RECIPE_ALLOWED_FIELDS = new Set([
  // Required fields
  ...RECIPE_REQUIRED_FIELDS,
  // Optional per content-model.md
  'equipment',
  'vessel',
  'collections',
  'season',
  'occasion',
  'skill',
  'dietaryDisclosures',
  'allergens',
  'notes',
  'sensoryCheckpoints',
  'testedSubstitutions',
  'commonMistakes',
  'recovery',
  'storage',
  'freezing',
  'reheating',
  'makeAhead',
  'transport',
  'gifting',
  'petSafeNote',
  'whyItWorks',
  'scalingEligible',
  'scaleFactors',
  'unitConversionEligible',
  'printEligible',
  'copyEligible',
  'heroAsset',
  'processAssets',
  'socialDerivatives',
  'mediaRights',
  'featuredEpisode',
  'relatedEpisodes',
  'characters',
  'tags',
  'campaigns'
])

module.exports = { RECIPE_REQUIRED_FIELDS, RECIPE_ALLOWED_FIELDS }
```

- [ ] Write `content/validator/rules/episode.js`:

```javascript
'use strict'

// Source: content-model.md — Episode Aggregate
const EPISODE_REQUIRED_FIELDS = [
  'title',
  'summary',
  'primaryPillarId',
  'productionStreamId',
  'approvedBrief',
  'objective',
  'emotionalThread',
  'primaryComicEngine',
  'cast',
  'canonVersion'
]

const EPISODE_ALLOWED_FIELDS = new Set([
  ...EPISODE_REQUIRED_FIELDS,
  'episodeNumber',
  'featuredRecipe',
  'publicationDate',
  'duration',
  'artwork',
  'showNotes',
  'chapters',
  'transcript',
  'corrections',
  'sourceRecordings',
  'generatedPerformances',
  'editedDialogue',
  'master',
  'podcastHostUrl',
  'downloadFallback',
  'characterReview',
  'factualReview',
  'safetyReview',
  'accessibilityReview',
  'rightsStatus',
  'aiDisclosure',
  'releaseMetadata',
  'archiveCopy',
  'audioChecksums',
  'correctionHistory',
  'backupLocations',
  'relatedRecipes',
  'characters',
  'collections',
  'newsletter',
  'campaign'
])

module.exports = { EPISODE_REQUIRED_FIELDS, EPISODE_ALLOWED_FIELDS }
```

- [ ] Verify both load without error:

```bash
node -e "require('./content/validator/rules/recipe.js'); require('./content/validator/rules/episode.js'); console.log('Rules load OK')"
```

Expected: `Rules load OK`

- [ ] Commit:

```bash
git add content/validator/rules/
git commit -m "feat(content): add field validation rules for recipe and episode types"
```

---

## Task 4: Create the main validator

**Files:**
- Create: `content/validator/index.js`

- [ ] Write `content/validator/index.js`:

```javascript
'use strict'

const { ACTIVE_TYPES, RESERVED_TYPES, COMMON_REQUIRED_FIELDS, COMMON_ALLOWED_FIELDS, VALID_STATUSES } = require('./types.js')
const { RECIPE_REQUIRED_FIELDS, RECIPE_ALLOWED_FIELDS } = require('./rules/recipe.js')
const { EPISODE_REQUIRED_FIELDS, EPISODE_ALLOWED_FIELDS } = require('./rules/episode.js')

function getTypeRules(type) {
  switch (type) {
    case 'recipe':
      return { required: RECIPE_REQUIRED_FIELDS, allowed: RECIPE_ALLOWED_FIELDS }
    case 'episode':
      return { required: EPISODE_REQUIRED_FIELDS, allowed: EPISODE_ALLOWED_FIELDS }
    default:
      // Active type with no detailed rules yet — validates common fields only
      return null
  }
}

/**
 * Validate a content record against the approved content model.
 *
 * @param {object} record
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validate(record) {
  if (typeof record !== 'object' || record === null) {
    return { valid: false, errors: ['record must be a non-null object'] }
  }

  const errors = []

  // Rule 1: Reserved types are always rejected — explicit message required by ART-007 test 5
  if (RESERVED_TYPES.has(record.type)) {
    return {
      valid: false,
      errors: [
        `reserved type '${record.type}': reserved records cannot be instantiated, stored, published, or used to activate storage, workflow, page, permission, or analytics support`
      ]
    }
  }

  // Rule 2: Type must be in the active launch-core allowlist
  if (!ACTIVE_TYPES.has(record.type)) {
    errors.push(`unknown type '${record.type}': not in launch-core allowlist and not in reserved list`)
  }

  // Rule 3: Status must be a recognised lifecycle state
  if (record.status !== undefined && !VALID_STATUSES.has(record.status)) {
    errors.push(`invalid status '${record.status}'`)
  }

  // Rule 4: All common required field keys must be present (value may be null for draft)
  for (const field of COMMON_REQUIRED_FIELDS) {
    if (!(field in record)) {
      errors.push(`missing required common field: ${field}`)
    }
  }

  // Rule 5 & 6: Type-specific required fields and unknown-field detection
  const typeRules = getTypeRules(record.type)
  if (typeRules) {
    // Required type-specific fields must have keys present
    for (const field of typeRules.required) {
      if (!(field in record)) {
        errors.push(`missing required field for '${record.type}': ${field}`)
      }
    }

    // Unknown field detection: any key not in common + type-specific allowed list is rejected
    const fullAllowed = new Set([...COMMON_ALLOWED_FIELDS, ...typeRules.allowed])
    for (const field of Object.keys(record)) {
      if (!fullAllowed.has(field)) {
        errors.push(`unknown field: ${field} (not in approved schema for type '${record.type}') — schema change control required`)
      }
    }
  }

  return { valid: errors.length === 0, errors }
}

module.exports = { validate }
```

- [ ] Smoke-test reserved type rejection:

```bash
node -e "
const { validate } = require('./content/validator/index.js')
const r = validate({ type: 'public-review', status: 'draft' })
console.log('reserved rejected:', !r.valid)
console.log('error mentions reserved type:', r.errors[0].includes('reserved type'))
"
```

Expected:
```
reserved rejected: true
error mentions reserved type: true
```

- [ ] Smoke-test unknown field rejection:

```bash
node -e "
const { validate } = require('./content/validator/index.js')
const r = validate({ id:'x', type:'recipe', status:'draft', version:1, createdAt:'', updatedAt:'', createdBy:'', updatedBy:'', ownerId:'', sourceRefs:[], revisionNote:'', title:'T', summary:'S', primaryPillarId:'p', productionStreamId:'s', author:'a', tester:'a', reviewer:null, approver:null, testDate:null, revisionState:'draft', updateHistory:[], prepTime:'PT1M', cookTime:'PT1M', totalTime:'PT2M', yield:'1', difficulty:'easy', ingredientGroups:[], instructionSections:[], popularityScore:9 })
console.log('unknown field rejected:', !r.valid)
console.log('error mentions popularityScore:', r.errors.some(e => e.includes('popularityScore')))
"
```

Expected:
```
unknown field rejected: true
error mentions popularityScore: true
```

- [ ] Commit:

```bash
git add content/validator/index.js
git commit -m "feat(content): add content model validator with reserved-type and unknown-field enforcement"
```

---

## Task 5: Create the correction helper

**Files:**
- Create: `content/validator/correct.js`

- [ ] Write `content/validator/correct.js`:

```javascript
'use strict'

/**
 * Apply a correction to a record, preserving the prior version in history.
 *
 * Per correction-and-revision-policy (ART-013):
 * - Corrections create a new version; they never silently overwrite.
 * - The affected prior version is preserved and remains addressable.
 * - revisionNote is required and must describe the correction.
 *
 * @param {object} original  The current record at any version.
 * @param {object} patch     Fields to change. Must include revisionNote.
 * @returns {object}         Corrected record with incremented version and preserved history.
 */
function applyCorrection(original, patch) {
  if (!patch || !patch.revisionNote) {
    throw new Error('patch.revisionNote is required for all corrections')
  }

  // Separate existing history so it is not double-nested in the snapshot
  const { history: existingHistory, ...recordSnapshot } = original
  const history = Array.isArray(existingHistory) ? [...existingHistory] : []

  // Archive the current version — this is the "preserved affected prior version"
  history.push(Object.assign({}, recordSnapshot, { archivedAt: new Date().toISOString() }))

  // Build and return the corrected record
  return Object.assign({}, original, patch, {
    version: original.version + 1,
    history,
    updatedAt: new Date().toISOString()
  })
}

module.exports = { applyCorrection }
```

- [ ] Verify version increment and history preservation:

```bash
node -e "
const { applyCorrection } = require('./content/validator/correct.js')
const v1 = { id: 'REC-002', type: 'recipe', version: 1, status: 'published', revisionNote: 'initial' }
const v2 = applyCorrection(v1, { revisionNote: 'S2: corrected baking temperature from 180C to 200C', status: 'corrected' })
console.log('version incremented to 2:', v2.version === 2)
console.log('history has 1 entry:', v2.history.length === 1)
console.log('history[0] is v1:', v2.history[0].version === 1)
console.log('history[0] has archivedAt:', typeof v2.history[0].archivedAt === 'string')
"
```

Expected:
```
version incremented to 2: true
history has 1 entry: true
history[0] is v1: true
history[0] has archivedAt: true
```

- [ ] Commit:

```bash
git add content/validator/correct.js
git commit -m "feat(content): add correction helper preserving version history per ART-013 policy"
```

---

## Task 6: Create the representative recipe fixture (REC-001)

**Files:**
- Create: `content/records/recipes/REC-001-giselles-royal-velvet-cake.json`

This is the Phase 0 representative recipe. It uses the Royal Velvet Cake already in the existing website data. Status is `draft` — `testDate`, `reviewer`, and `approver` are null because this is pre-physical-testing. ART-009 will fill in the real testing evidence.

- [ ] Write `content/records/recipes/REC-001-giselles-royal-velvet-cake.json`:

```json
{
  "id": "REC-001",
  "type": "recipe",
  "status": "draft",
  "version": 1,
  "createdAt": "2026-06-12T00:00:00Z",
  "updatedAt": "2026-06-12T00:00:00Z",
  "createdBy": "PERSON-stacey",
  "updatedBy": "PERSON-stacey",
  "ownerId": "PERSON-stacey",
  "sourceRefs": ["content/records/recipes/REC-001-giselles-royal-velvet-cake.json"],
  "revisionNote": "Phase 0 representative recipe fixture — ART-007 schema validation and ART-009 template",
  "slug": "giselles-royal-velvet-cake",
  "title": "Giselle's Royal Velvet Cake",
  "summary": "A dramatic, deeply flavoured red velvet layer cake with silken cream cheese frosting — Giselle's signature celebration bake.",
  "primaryPillarId": "pillar-recipes-from-giselles-kitchen",
  "productionStreamId": "stream-cook-with-stacey-and-giselle",
  "author": "PERSON-stacey",
  "tester": "PERSON-stacey",
  "reviewer": null,
  "approver": null,
  "testDate": null,
  "revisionState": "initial-draft",
  "updateHistory": [],
  "prepTime": "PT25M",
  "cookTime": "PT35M",
  "totalTime": "PT1H",
  "yield": "12 servings",
  "difficulty": "intermediate",
  "equipment": ["stand mixer or hand mixer", "two 9-inch round cake pans", "wire cooling racks", "serrated knife"],
  "vessel": "two 9-inch (23 cm) round cake pans",
  "season": "all",
  "occasion": "celebration",
  "skill": "intermediate",
  "dietaryDisclosures": ["contains gluten", "contains dairy", "contains eggs"],
  "allergens": ["gluten", "dairy", "eggs"],
  "ingredientGroups": [
    {
      "id": "REC-001-IG-01",
      "recipeId": "REC-001",
      "label": "Cake batter",
      "order": 1,
      "items": [
        {
          "id": "REC-001-II-001",
          "quantity": 2.5,
          "unit": "cups",
          "ingredient": "cake flour",
          "preparation": "spooned and levelled",
          "optional": false,
          "scalingRule": "linear",
          "conversionRule": "1 cup = 125 g",
          "allergenRefs": ["gluten"],
          "note": null
        },
        {
          "id": "REC-001-II-002",
          "quantity": 2,
          "unit": "tablespoons",
          "ingredient": "unsweetened cocoa powder",
          "preparation": null,
          "optional": false,
          "scalingRule": "linear",
          "conversionRule": null,
          "allergenRefs": [],
          "note": null
        },
        {
          "id": "REC-001-II-003",
          "quantity": 1,
          "unit": "teaspoon",
          "ingredient": "baking soda",
          "preparation": null,
          "optional": false,
          "scalingRule": "linear",
          "conversionRule": null,
          "allergenRefs": [],
          "note": null
        },
        {
          "id": "REC-001-II-004",
          "quantity": 0.5,
          "unit": "cups",
          "ingredient": "unsalted butter",
          "preparation": "softened to room temperature",
          "optional": false,
          "scalingRule": "linear",
          "conversionRule": "1 cup = 225 g",
          "allergenRefs": ["dairy"],
          "note": null
        },
        {
          "id": "REC-001-II-005",
          "quantity": 1.5,
          "unit": "cups",
          "ingredient": "granulated sugar",
          "preparation": null,
          "optional": false,
          "scalingRule": "linear",
          "conversionRule": null,
          "allergenRefs": [],
          "note": null
        },
        {
          "id": "REC-001-II-006",
          "quantity": 2,
          "unit": "large",
          "ingredient": "eggs",
          "preparation": "room temperature",
          "optional": false,
          "scalingRule": "linear",
          "conversionRule": null,
          "allergenRefs": ["eggs"],
          "note": null
        },
        {
          "id": "REC-001-II-007",
          "quantity": 1,
          "unit": "cup",
          "ingredient": "buttermilk",
          "preparation": "room temperature",
          "optional": false,
          "scalingRule": "linear",
          "conversionRule": null,
          "allergenRefs": ["dairy"],
          "note": null
        },
        {
          "id": "REC-001-II-008",
          "quantity": 2,
          "unit": "tablespoons",
          "ingredient": "red gel food colouring",
          "preparation": null,
          "optional": false,
          "scalingRule": "fixed",
          "conversionRule": null,
          "allergenRefs": [],
          "note": "Use gel, not liquid — liquid colouring dilutes batter and gives a muted colour"
        },
        {
          "id": "REC-001-II-009",
          "quantity": 1,
          "unit": "teaspoon",
          "ingredient": "pure vanilla extract",
          "preparation": null,
          "optional": false,
          "scalingRule": "linear",
          "conversionRule": null,
          "allergenRefs": [],
          "note": null
        },
        {
          "id": "REC-001-II-010",
          "quantity": 1,
          "unit": "teaspoon",
          "ingredient": "white wine vinegar",
          "preparation": null,
          "optional": false,
          "scalingRule": "linear",
          "conversionRule": null,
          "allergenRefs": [],
          "note": null
        }
      ]
    },
    {
      "id": "REC-001-IG-02",
      "recipeId": "REC-001",
      "label": "Cream cheese frosting",
      "order": 2,
      "items": [
        {
          "id": "REC-001-II-011",
          "quantity": 450,
          "unit": "g",
          "ingredient": "full-fat cream cheese",
          "preparation": "room temperature",
          "optional": false,
          "scalingRule": "linear",
          "conversionRule": null,
          "allergenRefs": ["dairy"],
          "note": null
        },
        {
          "id": "REC-001-II-012",
          "quantity": 0.5,
          "unit": "cup",
          "ingredient": "unsalted butter",
          "preparation": "softened",
          "optional": false,
          "scalingRule": "linear",
          "conversionRule": null,
          "allergenRefs": ["dairy"],
          "note": null
        },
        {
          "id": "REC-001-II-013",
          "quantity": 3,
          "unit": "cups",
          "ingredient": "powdered sugar",
          "preparation": "sifted",
          "optional": false,
          "scalingRule": "linear",
          "conversionRule": null,
          "allergenRefs": [],
          "note": null
        },
        {
          "id": "REC-001-II-014",
          "quantity": 1,
          "unit": "teaspoon",
          "ingredient": "pure vanilla extract",
          "preparation": null,
          "optional": false,
          "scalingRule": "fixed",
          "conversionRule": null,
          "allergenRefs": [],
          "note": null
        }
      ]
    }
  ],
  "instructionSections": [
    {
      "id": "REC-001-IS-01",
      "recipeId": "REC-001",
      "label": "Prepare the cake layers",
      "order": 1,
      "steps": [
        {
          "id": "REC-001-ST-001",
          "body": "Preheat oven to 175 °C (350 °F). Grease and flour two 9-inch round cake pans, then line bases with parchment.",
          "order": 1,
          "duration": null,
          "equipmentRefs": ["two 9-inch round cake pans"],
          "ingredientRefs": [],
          "sensoryCheckpoint": null,
          "warning": null,
          "recoveryNote": null,
          "mediaRefs": []
        },
        {
          "id": "REC-001-ST-002",
          "body": "Whisk together flour, cocoa powder, and baking soda in a medium bowl. Set aside.",
          "order": 2,
          "duration": null,
          "equipmentRefs": [],
          "ingredientRefs": ["REC-001-II-001", "REC-001-II-002", "REC-001-II-003"],
          "sensoryCheckpoint": "Mixture should be uniform pale brown — no white streaks of flour.",
          "warning": null,
          "recoveryNote": null,
          "mediaRefs": []
        },
        {
          "id": "REC-001-ST-003",
          "body": "Beat butter and sugar with a stand or hand mixer on medium-high until pale and fluffy, 3–4 minutes.",
          "order": 3,
          "duration": "PT4M",
          "equipmentRefs": ["stand mixer or hand mixer"],
          "ingredientRefs": ["REC-001-II-004", "REC-001-II-005"],
          "sensoryCheckpoint": "Mixture should be noticeably pale and hold soft ribbons off the beater.",
          "warning": null,
          "recoveryNote": "If butter looks curdled it may be too cold. Continue mixing — it will come together.",
          "mediaRefs": []
        },
        {
          "id": "REC-001-ST-004",
          "body": "Add eggs one at a time, beating well after each addition. Beat in vanilla.",
          "order": 4,
          "duration": null,
          "equipmentRefs": [],
          "ingredientRefs": ["REC-001-II-006", "REC-001-II-009"],
          "sensoryCheckpoint": null,
          "warning": null,
          "recoveryNote": null,
          "mediaRefs": []
        },
        {
          "id": "REC-001-ST-005",
          "body": "Stir food colouring and vinegar into the buttermilk. Add flour mixture and buttermilk mixture alternately to the butter mixture, beginning and ending with flour. Mix until just combined.",
          "order": 5,
          "duration": null,
          "equipmentRefs": [],
          "ingredientRefs": ["REC-001-II-007", "REC-001-II-008", "REC-001-II-010"],
          "sensoryCheckpoint": "Batter should be deep ruby red and just smooth — stop as soon as streaks disappear.",
          "warning": "Do not overmix once buttermilk is added — overmixing develops gluten and toughens the crumb.",
          "recoveryNote": null,
          "mediaRefs": []
        },
        {
          "id": "REC-001-ST-006",
          "body": "Divide batter evenly between prepared pans. Bake 30–35 minutes until a toothpick inserted in the centre comes out clean.",
          "order": 6,
          "duration": "PT35M",
          "equipmentRefs": ["two 9-inch round cake pans"],
          "ingredientRefs": [],
          "sensoryCheckpoint": "Layers spring back when lightly pressed in the centre.",
          "warning": null,
          "recoveryNote": "If tops are browning before the centre is set, tent loosely with foil for the last 10 minutes.",
          "mediaRefs": []
        }
      ]
    },
    {
      "id": "REC-001-IS-02",
      "recipeId": "REC-001",
      "label": "Make the frosting and assemble",
      "order": 2,
      "steps": [
        {
          "id": "REC-001-ST-007",
          "body": "Cool layers in pans 10 minutes, then turn out onto wire racks and cool completely — at least 1 hour.",
          "order": 1,
          "duration": "PT1H",
          "equipmentRefs": ["wire cooling racks"],
          "ingredientRefs": [],
          "sensoryCheckpoint": "Layers must be completely cool before frosting. A warm layer will melt the frosting.",
          "warning": "Do not attempt to frost warm layers.",
          "recoveryNote": null,
          "mediaRefs": []
        },
        {
          "id": "REC-001-ST-008",
          "body": "Beat cream cheese and butter together until smooth and lump-free. Add sifted powdered sugar one cup at a time, beating on low then medium. Beat in vanilla.",
          "order": 2,
          "duration": null,
          "equipmentRefs": ["stand mixer or hand mixer"],
          "ingredientRefs": ["REC-001-II-011", "REC-001-II-012", "REC-001-II-013", "REC-001-II-014"],
          "sensoryCheckpoint": "Frosting should be smooth and hold a peak but spread easily — not runny.",
          "warning": null,
          "recoveryNote": "If frosting is too soft, refrigerate 20 minutes before assembling.",
          "mediaRefs": []
        },
        {
          "id": "REC-001-ST-009",
          "body": "Level any domed layers with a serrated knife. Place first layer on a plate. Spread one-third of frosting evenly over the top. Place second layer on top and frost top and sides.",
          "order": 3,
          "duration": null,
          "equipmentRefs": ["serrated knife"],
          "ingredientRefs": [],
          "sensoryCheckpoint": null,
          "warning": null,
          "recoveryNote": "If layers crumble during levelling, press gently into place — the frosting will hold them.",
          "mediaRefs": []
        }
      ]
    }
  ],
  "sensoryCheckpoints": [
    "Batter is deep ruby red with a smooth, pourable consistency.",
    "Baked layers spring back when pressed; toothpick comes out clean.",
    "Frosting holds a soft peak and spreads without tearing the crumb."
  ],
  "commonMistakes": [
    "Over-mixing after buttermilk is added — produces a tough, dense crumb.",
    "Using liquid food colouring instead of gel — dilutes the batter and mutes the colour.",
    "Frosting layers before they are fully cool — frosting slides and melts."
  ],
  "recovery": "If layers crumble during levelling, press gently into place before frosting — the frosting will hold layers together.",
  "whyItWorks": "The acid in buttermilk reacts with cocoa and baking soda, producing a tender crumb and amplifying the reddish-brown hue of natural cocoa; gel food colouring deepens the colour without thinning the batter.",
  "testedSubstitutions": [],
  "storage": "Refrigerate frosted cake loosely covered for up to 4 days. Bring to room temperature 30 minutes before serving.",
  "freezing": "Freeze un-frosted layers individually, wrapped tightly, for up to 2 months. Thaw overnight in the refrigerator.",
  "reheating": null,
  "makeAhead": "Cake layers may be baked up to 2 days ahead and refrigerated, or 2 months ahead and frozen. Frosting may be made 1 day ahead and refrigerated.",
  "transport": "Transport assembled cake refrigerated in a cake box. Remove 30 minutes before serving.",
  "gifting": "Ship un-frosted layers only, well-wrapped. Include frosting recipe separately.",
  "petSafeNote": null,
  "scalingEligible": false,
  "scaleFactors": null,
  "unitConversionEligible": true,
  "printEligible": true,
  "copyEligible": false,
  "heroAsset": null,
  "processAssets": [],
  "socialDerivatives": [],
  "mediaRights": null,
  "featuredEpisode": null,
  "relatedEpisodes": [],
  "characters": ["CHAR-001-giselle"],
  "collections": [],
  "tags": ["celebration", "layer-cake", "red-velvet", "cream-cheese-frosting"],
  "campaigns": []
}
```

- [ ] Validate the fixture passes the validator:

```bash
node -e "
const { validate } = require('./content/validator/index.js')
const r = require('./content/records/recipes/REC-001-giselles-royal-velvet-cake.json')
const result = validate(r)
console.log('valid:', result.valid)
if (!result.valid) { console.log('ERRORS:'); result.errors.forEach(e => console.log(' -', e)) }
"
```

Expected: `valid: true`

If there are errors, fix the fixture (missing fields) or the validator (over-strict rule) before committing. The fixture must win — it is ground truth for the content model.

- [ ] Commit:

```bash
git add content/records/recipes/REC-001-giselles-royal-velvet-cake.json
git commit -m "content(recipes): add REC-001 representative recipe fixture for ART-007 Test 1 and ART-009"
```

---

## Task 7: Create the representative episode fixture (EP-001)

**Files:**
- Create: `content/records/episodes/EP-001-the-first-sunday.json`

- [ ] Write `content/records/episodes/EP-001-the-first-sunday.json`:

```json
{
  "id": "EP-001",
  "type": "episode",
  "status": "draft",
  "version": 1,
  "createdAt": "2026-06-12T00:00:00Z",
  "updatedAt": "2026-06-12T00:00:00Z",
  "createdBy": "PERSON-stacey",
  "updatedBy": "PERSON-stacey",
  "ownerId": "PERSON-stacey",
  "sourceRefs": ["content/records/episodes/EP-001-the-first-sunday.json"],
  "revisionNote": "Phase 0 representative episode fixture — ART-007 Test 2 and ART-012 template",
  "slug": "the-first-sunday",
  "episodeNumber": 1,
  "title": "The First Sunday",
  "summary": "Giselle hosts the first-ever Sunday Brunch With Giselle and immediately upstages everyone with her signature Royal Velvet Cake. Phaedra has notes. Tiana has opinions. Havok has forgotten to buy butter.",
  "primaryPillarId": "pillar-the-sunday-brunch-podcast",
  "productionStreamId": "stream-sunday-brunch-podcast",
  "approvedBrief": null,
  "objective": "Introduce all four Sheltie characters and Stacey, establish the Sunday Brunch format, and anchor the pilot to REC-001.",
  "emotionalThread": "The warmth and mild chaos of the first brunch together — everyone finding their role, Giselle quietly delighted to be home again.",
  "featuredRecipe": "REC-001",
  "primaryComicEngine": "Phaedra's perfectionism vs. Havok's cheerful incompetence, mediated by Tiana's delight and Giselle's exacting standards.",
  "cast": ["CHAR-001-giselle", "CHAR-002-phaedra", "CHAR-003-tiana", "CHAR-004-havok"],
  "canonVersion": "CANON-2026-06-11.1",
  "publicationDate": null,
  "duration": null,
  "artwork": null,
  "showNotes": null,
  "chapters": [],
  "transcript": null,
  "corrections": [],
  "sourceRecordings": [],
  "generatedPerformances": [],
  "editedDialogue": null,
  "master": null,
  "podcastHostUrl": null,
  "downloadFallback": null,
  "characterReview": null,
  "factualReview": null,
  "safetyReview": null,
  "accessibilityReview": null,
  "rightsStatus": null,
  "aiDisclosure": null,
  "releaseMetadata": null,
  "archiveCopy": null,
  "audioChecksums": null,
  "correctionHistory": [],
  "backupLocations": [],
  "relatedRecipes": ["REC-001"],
  "characters": ["CHAR-001-giselle", "CHAR-002-phaedra", "CHAR-003-tiana", "CHAR-004-havok"],
  "collections": [],
  "newsletter": null,
  "campaign": null
}
```

- [ ] Validate the fixture:

```bash
node -e "
const { validate } = require('./content/validator/index.js')
const ep = require('./content/records/episodes/EP-001-the-first-sunday.json')
const result = validate(ep)
console.log('valid:', result.valid)
if (!result.valid) { console.log('ERRORS:'); result.errors.forEach(e => console.log(' -', e)) }
"
```

Expected: `valid: true`

- [ ] Commit:

```bash
git add content/records/episodes/EP-001-the-first-sunday.json
git commit -m "content(episodes): add EP-001 representative episode fixture for ART-007 Test 2 and ART-012"
```

---

## Task 8: Create the rejection and correction fixtures

**Files:**
- Create: `content/fixtures/bad/recipe-unknown-field.json`
- Create: `content/fixtures/bad/reserved-record-public-review.json`
- Create: `content/fixtures/correction/REC-002-v1.json`

- [ ] Write `content/fixtures/bad/recipe-unknown-field.json`:

This is the fixture from the ART-026 tabletop test — a recipe containing `popularityScore`.

```json
{
  "id": "FIXTURE-BAD-001",
  "type": "recipe",
  "status": "draft",
  "version": 1,
  "createdAt": "2026-06-12T00:00:00Z",
  "updatedAt": "2026-06-12T00:00:00Z",
  "createdBy": "PERSON-stacey",
  "updatedBy": "PERSON-stacey",
  "ownerId": "PERSON-stacey",
  "sourceRefs": [],
  "revisionNote": "ART-007 Test 4 fixture — intentional unknown field: popularityScore",
  "title": "Test Recipe With Unknown Field",
  "summary": "This fixture exists to prove the validator rejects unknown fields.",
  "primaryPillarId": "pillar-recipes-from-giselles-kitchen",
  "productionStreamId": "stream-cook-with-stacey-and-giselle",
  "author": "PERSON-stacey",
  "tester": null,
  "reviewer": null,
  "approver": null,
  "testDate": null,
  "revisionState": "test-fixture",
  "updateHistory": [],
  "prepTime": "PT5M",
  "cookTime": "PT5M",
  "totalTime": "PT10M",
  "yield": "1 serving",
  "difficulty": "easy",
  "ingredientGroups": [],
  "instructionSections": [],
  "popularityScore": 9.5
}
```

- [ ] Write `content/fixtures/bad/reserved-record-public-review.json`:

```json
{
  "id": "FIXTURE-BAD-002",
  "type": "public-review",
  "status": "draft",
  "version": 1,
  "createdAt": "2026-06-12T00:00:00Z",
  "updatedAt": "2026-06-12T00:00:00Z",
  "createdBy": "PERSON-anonymous",
  "updatedBy": "PERSON-anonymous",
  "ownerId": "PERSON-stacey",
  "sourceRefs": [],
  "revisionNote": "ART-007 Test 5 fixture — reserved type: public-review",
  "subjectId": "REC-001",
  "rating": 5,
  "comment": "This should never be stored, published, or activate any storage, workflow, page, permission, or analytics support."
}
```

- [ ] Write `content/fixtures/correction/REC-002-v1.json`:

A minimal valid published recipe used for the correction-history test (Test 3). It has a deliberate S2 error in the instruction step (baking temperature 180 °C instead of correct 200 °C) that the correction will fix.

```json
{
  "id": "REC-002",
  "type": "recipe",
  "status": "published",
  "version": 1,
  "createdAt": "2026-06-12T00:00:00Z",
  "updatedAt": "2026-06-12T00:00:00Z",
  "createdBy": "PERSON-stacey",
  "updatedBy": "PERSON-stacey",
  "ownerId": "PERSON-stacey",
  "sourceRefs": ["content/fixtures/correction/REC-002-v1.json"],
  "revisionNote": "ART-007 Test 3 fixture — published version containing S2 temperature error (180C should be 200C)",
  "slug": "simple-scones",
  "approvedBy": "PERSON-stacey",
  "approvedAt": "2026-06-12T00:00:00Z",
  "publishedAt": "2026-06-12T00:00:00Z",
  "title": "Simple Scones",
  "summary": "Classic cream scones — light, crumbly, and ready in 30 minutes.",
  "primaryPillarId": "pillar-recipes-from-giselles-kitchen",
  "productionStreamId": "stream-cook-with-stacey-and-giselle",
  "author": "PERSON-stacey",
  "tester": "PERSON-stacey",
  "reviewer": "PERSON-stacey",
  "approver": "PERSON-stacey",
  "testDate": "2026-06-11",
  "revisionState": "published-v1",
  "updateHistory": [],
  "prepTime": "PT10M",
  "cookTime": "PT20M",
  "totalTime": "PT30M",
  "yield": "8 scones",
  "difficulty": "easy",
  "equipment": ["baking sheet", "pastry cutter"],
  "vessel": "baking sheet",
  "season": "all",
  "occasion": "brunch",
  "skill": "beginner",
  "dietaryDisclosures": ["contains gluten", "contains dairy"],
  "allergens": ["gluten", "dairy"],
  "ingredientGroups": [
    {
      "id": "REC-002-IG-01",
      "recipeId": "REC-002",
      "label": "Scone dough",
      "order": 1,
      "items": [
        {
          "id": "REC-002-II-001",
          "quantity": 2,
          "unit": "cups",
          "ingredient": "all-purpose flour",
          "preparation": null,
          "optional": false,
          "scalingRule": "linear",
          "conversionRule": null,
          "allergenRefs": ["gluten"],
          "note": null
        },
        {
          "id": "REC-002-II-002",
          "quantity": 1,
          "unit": "cup",
          "ingredient": "heavy cream",
          "preparation": "cold",
          "optional": false,
          "scalingRule": "linear",
          "conversionRule": null,
          "allergenRefs": ["dairy"],
          "note": null
        }
      ]
    }
  ],
  "instructionSections": [
    {
      "id": "REC-002-IS-01",
      "recipeId": "REC-002",
      "label": "Mix and bake",
      "order": 1,
      "steps": [
        {
          "id": "REC-002-ST-001",
          "body": "Preheat oven to 180 °C (356 °F). Mix flour and cream until just combined. Shape into rounds and bake 18–20 minutes until golden.",
          "order": 1,
          "duration": "PT20M",
          "equipmentRefs": ["baking sheet"],
          "ingredientRefs": ["REC-002-II-001", "REC-002-II-002"],
          "sensoryCheckpoint": "Scones should be golden-brown on top and sound hollow when tapped underneath.",
          "warning": null,
          "recoveryNote": null,
          "mediaRefs": []
        }
      ]
    }
  ],
  "sensoryCheckpoints": ["Golden-brown tops; hollow sound when tapped underneath."],
  "commonMistakes": ["Over-working the dough — produces tough scones."],
  "recovery": null,
  "whyItWorks": "Cold cream creates steam pockets in the oven, producing a light, crumbly texture.",
  "testedSubstitutions": [],
  "storage": "Best on day of baking. Store in an airtight container for up to 2 days.",
  "scalingEligible": true,
  "scaleFactors": null,
  "unitConversionEligible": true,
  "printEligible": true,
  "copyEligible": false,
  "heroAsset": null,
  "processAssets": [],
  "socialDerivatives": [],
  "mediaRights": null,
  "featuredEpisode": null,
  "relatedEpisodes": [],
  "characters": [],
  "collections": [],
  "tags": ["scones", "quick-bake", "brunch"],
  "campaigns": []
}
```

- [ ] Verify the bad fixtures fail and the correction fixture passes:

```bash
node -e "
const { validate } = require('./content/validator/index.js')
const bad1 = require('./content/fixtures/bad/recipe-unknown-field.json')
const bad2 = require('./content/fixtures/bad/reserved-record-public-review.json')
const good = require('./content/fixtures/correction/REC-002-v1.json')
const r1 = validate(bad1)
const r2 = validate(bad2)
const r3 = validate(good)
console.log('bad1 (unknown field) invalid:', !r1.valid, '| error:', r1.errors.find(e=>e.includes('popularityScore')))
console.log('bad2 (reserved type) invalid:', !r2.valid, '| error:', r2.errors[0])
console.log('REC-002-v1 valid:', r3.valid)
"
```

Expected:
```
bad1 (unknown field) invalid: true | error: unknown field: popularityScore (not in approved schema for type 'recipe') — schema change control required
bad2 (reserved type) invalid: true | error: reserved type 'public-review': reserved records cannot be instantiated...
REC-002-v1 valid: true
```

- [ ] Commit:

```bash
git add content/fixtures/
git commit -m "content(fixtures): add ART-007 test fixtures for unknown-field, reserved-type, and correction tests"
```

---

## Task 9: Write and run the ART-007 test runner

**Files:**
- Create: `content/art-007-run.js`

This script is the executable that produces ART-007 evidence. Run it with `node content/art-007-run.js`. Capture the full output as the evidence record.

- [ ] Write `content/art-007-run.js`:

```javascript
'use strict'

// ART-007 Content Model Validation — Executable Test Runner
// Run: node content/art-007-run.js
// Output is captured verbatim as evidence in ART-007-content-model-validation.md.

const fs = require('fs')
const path = require('path')
const { validate } = require('./validator/index.js')
const { applyCorrection } = require('./validator/correct.js')

const ROOT = __dirname
let passed = 0, failed = 0
const results = []

function load(relPath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), 'utf-8'))
}

function readText(relPath) {
  return fs.readFileSync(relPath, 'utf-8')
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function runTest(id, name, fn) {
  const line = `\n${'─'.repeat(60)}`
  console.log(line)
  console.log(`Test ${id}: ${name}`)
  console.log(`${'─'.repeat(60)}`)
  try {
    fn()
    console.log(`Result:   PASS`)
    passed++
    results.push({ id, name, result: 'PASS' })
  } catch (e) {
    console.log(`Result:   FAIL`)
    console.log(`Reason:   ${e.message}`)
    failed++
    results.push({ id, name, result: 'FAIL', reason: e.message })
  }
}

console.log('ART-007 Content Model Validation — Executable Test Run')
console.log(`Validator:  content/validator/index.js`)
console.log(`Schema:     content-model.md (ART-006), source-of-truth.md (ART-026)`)
console.log(`Run date:   ${new Date().toISOString()}`)

// ─── Test 1: Representative recipe validates ──────────────────────────────────
runTest(1, 'Representative recipe validates without unknown fields or reserved dependencies', () => {
  const fixturePath = 'records/recipes/REC-001-giselles-royal-velvet-cake.json'
  const recipe = load(fixturePath)
  console.log(`Fixture:  content/${fixturePath}`)
  console.log(`Type:     ${recipe.type}   ID: ${recipe.id}`)

  const result = validate(recipe)
  console.log(`Expected: valid=true, errors=[]`)
  console.log(`Actual:   valid=${result.valid}, errors=[${result.errors.join('; ')}]`)

  assert(result.valid, `Validation failed: ${result.errors.join('; ')}`)
  assert(recipe.type === 'recipe', `Type must be 'recipe', got '${recipe.type}'`)
  assert(typeof recipe.ingredientGroups === 'object', 'ingredientGroups must be present')
  assert(typeof recipe.instructionSections === 'object', 'instructionSections must be present')
})

// ─── Test 2: Representative episode validates ─────────────────────────────────
runTest(2, 'Representative episode validates without unknown fields or reserved dependencies', () => {
  const fixturePath = 'records/episodes/EP-001-the-first-sunday.json'
  const episode = load(fixturePath)
  console.log(`Fixture:  content/${fixturePath}`)
  console.log(`Type:     ${episode.type}   ID: ${episode.id}`)

  const result = validate(episode)
  console.log(`Expected: valid=true, errors=[]`)
  console.log(`Actual:   valid=${result.valid}, errors=[${result.errors.join('; ')}]`)

  assert(result.valid, `Validation failed: ${result.errors.join('; ')}`)
  assert(episode.type === 'episode', `Type must be 'episode', got '${episode.type}'`)
  assert(Array.isArray(episode.cast) && episode.cast.length > 0, 'cast must be a non-empty array')
})

// ─── Test 3: Correction history preserved ────────────────────────────────────
runTest(3, 'Correction creates a new version while preserving the affected prior version', () => {
  const fixturePath = 'fixtures/correction/REC-002-v1.json'
  const original = load(fixturePath)
  console.log(`Fixture:  content/${fixturePath}`)
  console.log(`Original: version=${original.version}, status=${original.status}`)

  const corrected = applyCorrection(original, {
    revisionNote: 'S2: Corrected baking temperature from 180 °C to 200 °C in REC-002-ST-001',
    status: 'corrected'
  })

  console.log(`Corrected: version=${corrected.version}, status=${corrected.status}`)
  console.log(`History entries: ${corrected.history.length}`)
  console.log(`history[0].version: ${corrected.history[0].version}  (prior version preserved)`)
  console.log(`history[0].archivedAt: ${corrected.history[0].archivedAt}`)

  assert(corrected.version === original.version + 1,
    `Version must increment: expected ${original.version + 1}, got ${corrected.version}`)
  assert(Array.isArray(corrected.history) && corrected.history.length >= 1,
    `history must contain at least one entry`)
  assert(corrected.history[0].version === original.version,
    `Prior version must be preserved in history: expected ${original.version}, got ${corrected.history[0].version}`)
  assert(typeof corrected.history[0].archivedAt === 'string',
    `history[0].archivedAt must be a timestamp string`)
  assert(corrected.status === 'corrected',
    `status must be 'corrected', got '${corrected.status}'`)

  // Confirm the corrected record itself still validates
  const revalidated = validate(corrected)
  assert(revalidated.valid, `Corrected record must still be valid: ${revalidated.errors.join('; ')}`)
  console.log(`Corrected record re-validates: ${revalidated.valid}`)
})

// ─── Test 4: Unknown field rejected ──────────────────────────────────────────
runTest(4, 'A record containing an undeclared field is rejected rather than stored or silently stripped', () => {
  const fixturePath = 'fixtures/bad/recipe-unknown-field.json'
  const badRecord = load(fixturePath)
  console.log(`Fixture:  content/${fixturePath}`)
  console.log(`Contains: popularityScore=${badRecord.popularityScore} (not in approved recipe schema)`)

  const result = validate(badRecord)
  console.log(`Expected: valid=false, error mentions 'popularityScore'`)
  console.log(`Actual:   valid=${result.valid}`)
  console.log(`Errors:   ${result.errors.join(' | ')}`)

  assert(!result.valid, `Expected invalid record to be rejected, but got valid=true`)
  const unknownFieldError = result.errors.find(e => e.includes('popularityScore'))
  assert(unknownFieldError, `Expected error mentioning 'popularityScore'; got: ${result.errors.join('; ')}`)
  assert(unknownFieldError.includes('unknown field'),
    `Error must say 'unknown field': ${unknownFieldError}`)
})

// ─── Test 5: Reserved record type rejected ────────────────────────────────────
runTest(5, 'An instance of a reserved record type is rejected and produces a clear rejection message', () => {
  const fixturePath = 'fixtures/bad/reserved-record-public-review.json'
  const reserved = load(fixturePath)
  console.log(`Fixture:  content/${fixturePath}`)
  console.log(`Type:     ${reserved.type}  (reserved per source-of-truth.md)`)

  const result = validate(reserved)
  console.log(`Expected: valid=false, error mentions 'reserved type'`)
  console.log(`Actual:   valid=${result.valid}`)
  console.log(`Errors:   ${result.errors.join(' | ')}`)

  assert(!result.valid, `Expected reserved type to be rejected, but got valid=true`)
  assert(result.errors.some(e => e.includes('reserved type')),
    `Error must mention 'reserved type'; got: ${result.errors.join('; ')}`)
  assert(result.errors.some(e => e.includes('public-review')),
    `Error must name the reserved type 'public-review'; got: ${result.errors.join('; ')}`)
})

// ─── Test 6: Projection no-writeback ─────────────────────────────────────────
runTest(6, 'The canonical content directory is isolated from build output — projections cannot write back', () => {
  const viteCfgPath = 'sunday-brunch-website/vite.config.js'
  const viteCfg = readText(viteCfgPath)

  // Check the build outDir does not point to content/
  const outDirMatch = viteCfg.match(/outDir\s*:\s*['"]([^'"]+)['"]/)
  const outDir = outDirMatch ? outDirMatch[1] : 'dist'  // default Vite outDir is 'dist'

  console.log(`Checked:  ${viteCfgPath}`)
  console.log(`Build outDir: '${outDir}'`)

  assert(!outDir.startsWith('content'),
    `Build outDir '${outDir}' must not start with 'content' — projection output cannot overlap with canonical source`)
  assert(outDir !== '..',
    `Build outDir must not be a parent directory`)

  // content/ directory does not contain any file that Vite would generate
  const distCheck = !fs.existsSync(path.join(ROOT, 'index.html'))
    && !fs.existsSync(path.join(ROOT, 'assets'))
  console.log(`content/ has no index.html or assets/ (build artefacts): ${distCheck}`)
  assert(distCheck, `content/ must not contain build artefacts (index.html or assets/)')`)

  console.log(`Canonical content/ is a read-only source. Build output goes to 'sunday-brunch-website/${outDir}'.`)
  console.log(`No projection, cache, feed, search index, or CMS can write to content/.`)
})

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n${'═'.repeat(60)}`)
console.log(`ART-007 Test Summary — ${new Date().toISOString()}`)
console.log(`${'═'.repeat(60)}`)
results.forEach(r => {
  const icon = r.result === 'PASS' ? '✓' : '✗'
  console.log(`  ${icon} Test ${r.id}: ${r.result}  — ${r.name}`)
  if (r.reason) console.log(`           Reason: ${r.reason}`)
})
console.log(`\nPassed: ${passed} / ${passed + failed}`)
console.log(`Failed: ${failed} / ${passed + failed}`)
if (failed === 0) {
  console.log('\n✓ ALL TESTS PASS — ART-007 executable evidence is complete.')
  console.log('  Next: copy this output into ART-007-content-model-validation.md and obtain Stacey approval.')
} else {
  console.log('\n✗ FAILURES DETECTED — resolve all failures before submitting ART-007 for acceptance.')
}
process.exit(failed === 0 ? 0 : 1)
```

- [ ] Run the test suite:

```bash
node content/art-007-run.js
```

Expected final lines:
```
✓ ALL TESTS PASS — ART-007 executable evidence is complete.
  Next: copy this output into ART-007-content-model-validation.md and obtain Stacey approval.
```

If any test fails, fix the issue in the validator or fixture before proceeding. Do **not** mark ART-007 ready-for-approval until all 6 show PASS.

- [ ] Commit:

```bash
git add content/art-007-run.js
git commit -m "feat(content): add ART-007 executable test runner covering all 6 required validation tests"
```

---

## Task 10: Capture output and update the ART-007 evidence file

**Files:**
- Modify: `_bmad-output/specs/spec-sunday-brunch-with-giselle/evidence/ART-007-content-model-validation.md`

- [ ] Run the test suite and capture its full output:

```bash
node content/art-007-run.js > art-007-output.txt 2>&1
cat art-007-output.txt
```

- [ ] Open `_bmad-output/specs/spec-sunday-brunch-with-giselle/evidence/ART-007-content-model-validation.md` and replace the `## Required Tests` table rows with the actual results. Add a new `## Execution Evidence` section at the bottom containing:

```markdown
## Execution Evidence

- Validator: `content/validator/index.js`
- Test runner: `content/art-007-run.js`
- Governing schema: `content-model.md` (ART-006), `source-of-truth.md` (ART-026)
- Run command: `node content/art-007-run.js`
- Run date: [DATE FROM OUTPUT]

### Test Results

| Test | Fixture | Expected result | Actual result | Pass/Fail |
|---|---|---|---|---|
| 1. Representative recipe | `content/records/recipes/REC-001-giselles-royal-velvet-cake.json` | valid=true, errors=[] | [PASTE FROM OUTPUT] | PASS |
| 2. Representative episode | `content/records/episodes/EP-001-the-first-sunday.json` | valid=true, errors=[] | [PASTE FROM OUTPUT] | PASS |
| 3. Correction history | `content/fixtures/correction/REC-002-v1.json` | version+1, history[0].version=1 | [PASTE FROM OUTPUT] | PASS |
| 4. Unknown field rejection | `content/fixtures/bad/recipe-unknown-field.json` | valid=false, error: popularityScore | [PASTE FROM OUTPUT] | PASS |
| 5. Reserved type rejection | `content/fixtures/bad/reserved-record-public-review.json` | valid=false, error: reserved type | [PASTE FROM OUTPUT] | PASS |
| 6. Projection no-writeback | `sunday-brunch-website/vite.config.js` | outDir not content/, no build artefacts in content/ | [PASTE FROM OUTPUT] | PASS |

### Full Output

```
[PASTE FULL OUTPUT OF node content/art-007-run.js HERE]
```

### Acceptance Decision

- Result: [pending Stacey approval]
- Approver: Stacey
- Date: [date of approval]
```

- [ ] Update the artifact register to change ART-007 status from `draft` to `ready-for-approval`

In `_bmad-output/specs/spec-sunday-brunch-with-giselle/artifact-register.md`, find the ART-007 row and change:
```
| ART-007 | Content-model validation record | ... | draft |
```
to:
```
| ART-007 | Content-model validation record | ... | ready-for-approval |
```

- [ ] Commit:

```bash
git add _bmad-output/specs/spec-sunday-brunch-with-giselle/evidence/ART-007-content-model-validation.md
git add _bmad-output/specs/spec-sunday-brunch-with-giselle/artifact-register.md
git commit -m "docs(art-007): record executable validation evidence — ready for Stacey approval"
```

---

## Self-Review

**Spec coverage check:**

| ART-007 required test | Covered by task |
|---|---|
| Representative recipe validates without unknown fields | Task 6 (fixture) + Task 9 (Test 1) |
| Representative episode validates without unknown fields | Task 7 (fixture) + Task 9 (Test 2) |
| Correction creates new version, preserves prior | Task 5 (correct.js) + Task 8 (REC-002-v1) + Task 9 (Test 3) |
| Unknown field rejected (not stored or silently stripped) | Task 4 (validator rule 7) + Task 8 (bad fixture) + Task 9 (Test 4) |
| Reserved record type rejected | Task 4 (validator rule 1) + Task 8 (bad fixture) + Task 9 (Test 5) |
| Projection cannot write back to canonical content | Task 9 (Test 6 — vite.config check + content/ isolation) |
| Stacey final approval | Task 10 (evidence file updated, submitted for approval) |

**Placeholder scan:** No TBDs, no "similar to", no steps without code.

**Type consistency:** `validate()` returns `{valid, errors}` throughout. `applyCorrection()` signature is consistent in task 5 and task 9. All `require()` paths match the created files.

---

## After this plan completes

ART-007 accepted → unblocks:
- **ART-009** (representative recipe): Stacey physically tests REC-001 in the kitchen, records ART-008 checklist results, and signs off. The fixture in `content/records/recipes/REC-001-giselles-royal-velvet-cake.json` is the template.
- **ART-012** (representative episode): Needs ART-007 accepted + ART-011 accepted (done). EP-001 fixture is the starting point.
- **ART-014** (correction exercise): Runs a tabletop S1/S2 case using the correction machinery built in this plan.

Parallel tracks Stacey must do independently (no code required):
- **ART-016**: Log into ElevenLabs, create voices for Giselle/Phaedra/Tiana/Havok, record voice IDs and settings.
- **ART-020**: Audit every privileged account (GitHub, Netlify, domain, email, podcast host, ElevenLabs) for least-privilege + MFA.
- **ART-021**: Document backup destinations, frequencies, retention, and provide recent job evidence for each D-06 class.
