import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
    assertCanonicalWrite,
    validateRecord
} from '../src/content-contract/index.js'

const filePath = fileURLToPath(import.meta.url)
const scriptDirectory = path.dirname(filePath)
const websiteRoot = path.resolve(scriptDirectory, '..')
const repositoryRoot = path.resolve(websiteRoot, '..')
const fixtureDirectory = path.join(
    websiteRoot,
    'content',
    'fixtures',
    'art-007'
)
const evidencePath = path.join(
    repositoryRoot,
    '_bmad-output',
    'specs',
    'spec-sunday-brunch-with-giselle',
    'evidence',
    'generated',
    'ART-007-results.json'
)

const loadJsonFixture = async (fileName) => {
    const fixturePath = path.join(fixtureDirectory, fileName)
    const fixtureJson = await readFile(fixturePath, 'utf8')

    return JSON.parse(fixtureJson)
}

const isExactMatch = (actual, expected) => (
    JSON.stringify(actual) === JSON.stringify(expected)
)

const validationCheck = (id, name, actual, expected) => ({
    id,
    name,
    passed: isExactMatch(actual, expected),
    expected,
    actual
})

const errorCheck = (id, name, action, expectedMessage) => {
    let actualError

    try {
        action()
    } catch (error) {
        actualError = error instanceof Error ? error.message : String(error)
    }

    return {
        id,
        name,
        passed: actualError === expectedMessage,
        expected: {
            error: expectedMessage
        },
        error: actualError ?? null
    }
}

const fixtures = {
    validRecipe: await loadJsonFixture('valid-recipe.json'),
    validEpisode: await loadJsonFixture('valid-episode.json'),
    validCorrection: await loadJsonFixture('valid-correction.json'),
    invalidUnknownField: await loadJsonFixture('invalid-unknown-field.json'),
    invalidReservedRecord: await loadJsonFixture('invalid-reserved-record.json')
}

const validRecordExpected = { valid: true, errors: [] }

const results = [
    validationCheck(
        'valid-recipe',
        'Valid recipe returns a successful validation result',
        validateRecord(fixtures.validRecipe),
        validRecordExpected
    ),
    validationCheck(
        'valid-episode',
        'Valid episode returns a successful validation result',
        validateRecord(fixtures.validEpisode),
        validRecordExpected
    ),
    validationCheck(
        'valid-correction',
        'Valid correction returns a successful validation result',
        validateRecord(fixtures.validCorrection),
        validRecordExpected
    ),
    validationCheck(
        'invalid-unknown-field',
        'Unknown popularityScore field is rejected',
        validateRecord(fixtures.invalidUnknownField),
        {
            valid: false,
            errors: ['Unknown field: popularityScore']
        }
    ),
    validationCheck(
        'invalid-reserved-record',
        'Reserved public-review record type is rejected',
        validateRecord(fixtures.invalidReservedRecord),
        {
            valid: false,
            errors: ['Reserved record type is inactive: public-review']
        }
    ),
    errorCheck(
        'projection-writeback',
        'Website projection source cannot write canonical content',
        () => assertCanonicalWrite('website-projection'),
        'Projection sources cannot write canonical content'
    )
]

const output = {
    artifactId: 'ART-007',
    validatorVersion: '1.0.0',
    executedAt: new Date().toISOString(),
    command: 'npm run validate:content',
    schemaVersion: 'CONTENT-MODEL-2026-06-12.1',
    results,
    passed: results.every((result) => result.passed)
}

const summary = `${JSON.stringify(output, null, 4)}\n`

await mkdir(path.dirname(evidencePath), { recursive: true })
await writeFile(evidencePath, summary, 'utf8')
process.stdout.write(summary)

if (!output.passed) {
    process.exitCode = 1
}
