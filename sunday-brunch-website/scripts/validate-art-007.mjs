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

const toErrorMessage = (error) => (
    error instanceof Error ? error.message : String(error)
)

const validationCheck = async (id, name, fileName, expected) => {
    try {
        const record = await loadJsonFixture(fileName)
        const actual = validateRecord(record)
        const passed = isExactMatch(actual, expected)

        const result = {
            id,
            name,
            passed,
            expected,
            actual
        }

        if (!passed) {
            result.error = 'Actual result did not match expected result'
        }

        return result
    } catch (error) {
        return {
            id,
            name,
            passed: false,
            expected,
            error: toErrorMessage(error)
        }
    }
}

const errorCheck = (id, name, action, expectedMessage) => {
    let actualError

    try {
        action()
    } catch (error) {
        actualError = toErrorMessage(error)
    }

    return {
        id,
        name,
        passed: actualError === expectedMessage,
        expected: {
            error: expectedMessage
        },
        error: actualError ?? 'Expected error was not thrown'
    }
}

const validRecordExpected = { valid: true, errors: [] }

const taxonomyRejectionCheck = async () => {
    const baseRecipe = await loadJsonFixture('valid-recipe.json')
    const record = { ...baseRecipe, mainIngredients: ['Plutonium'] }
    const expected = {
        valid: false,
        errors: ['Unknown mainIngredients value: Plutonium']
    }
    const actual = validateRecord(record)

    return {
        id: 'invalid-taxonomy-value',
        name: 'Taxonomy value outside the registered vocabulary is rejected',
        passed: isExactMatch(actual, expected),
        expected,
        actual
    }
}

const results = [
    await validationCheck(
        'valid-recipe',
        'Valid recipe returns a successful validation result',
        'valid-recipe.json',
        validRecordExpected
    ),
    await validationCheck(
        'valid-episode',
        'Valid episode returns a successful validation result',
        'valid-episode.json',
        validRecordExpected
    ),
    await validationCheck(
        'valid-correction',
        'Valid correction returns a successful validation result',
        'valid-correction.json',
        validRecordExpected
    ),
    await validationCheck(
        'invalid-correction-version',
        'Correction records reject lower correctedVersion values',
        'invalid-correction-version.json',
        {
            valid: false,
            errors: ['Corrected version must be greater than affected version']
        }
    ),
    await validationCheck(
        'invalid-correction-version-equal',
        'Correction records reject unchanged correctedVersion values',
        'invalid-correction-version-equal.json',
        {
            valid: false,
            errors: ['Corrected version must be greater than affected version']
        }
    ),
    await validationCheck(
        'invalid-unknown-field',
        'Unknown popularityScore field is rejected',
        'invalid-unknown-field.json',
        {
            valid: false,
            errors: ['Unknown field: popularityScore']
        }
    ),
    await validationCheck(
        'invalid-reserved-record',
        'Reserved public-review record type is rejected',
        'invalid-reserved-record.json',
        {
            valid: false,
            errors: ['Reserved record type is inactive: public-review']
        }
    ),
    await taxonomyRejectionCheck(),
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
    schemaVersion: 'CONTENT-MODEL-2026-06-18.4',
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
