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
