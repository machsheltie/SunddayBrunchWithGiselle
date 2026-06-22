import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { validateRecord } from '../src/content-contract/index.js'

const filePath = fileURLToPath(import.meta.url)
const scriptDirectory = path.dirname(filePath)
const websiteRoot = path.resolve(scriptDirectory, '..')
const repositoryRoot = path.resolve(websiteRoot, '..')
const recordsDirectory = path.join(repositoryRoot, 'content', 'records')
const evidencePath = path.join(
    repositoryRoot,
    '_bmad-output',
    'specs',
    'spec-sunday-brunch-with-giselle',
    'evidence',
    'generated',
    'ART-009-results.json'
)

const collectJsonFiles = async (directory) => {
    const entries = await readdir(directory, { withFileTypes: true })
    const files = []

    for (const entry of entries) {
        const entryPath = path.join(directory, entry.name)

        if (entry.isDirectory()) {
            files.push(...await collectJsonFiles(entryPath))
        } else if (entry.isFile() && entry.name.endsWith('.json')) {
            files.push(entryPath)
        }
    }

    return files
}

const recordFiles = (await collectJsonFiles(recordsDirectory)).sort()

const results = []

for (const recordFile of recordFiles) {
    const relativePath = path.relative(repositoryRoot, recordFile).split(path.sep).join('/')

    try {
        const record = JSON.parse(await readFile(recordFile, 'utf8'))
        const validation = validateRecord(record)

        results.push({
            file: relativePath,
            id: record.id,
            recordType: record.recordType,
            valid: validation.valid,
            errors: validation.errors
        })
    } catch (error) {
        results.push({
            file: relativePath,
            valid: false,
            errors: [error instanceof Error ? error.message : String(error)]
        })
    }
}

const output = {
    artifactId: 'ART-009',
    validatorVersion: '1.0.0',
    executedAt: new Date().toISOString(),
    command: 'npm run validate:records',
    schemaVersion: 'CONTENT-MODEL-2026-06-18.4',
    recordCount: results.length,
    results,
    passed: results.length > 0 && results.every((result) => result.valid)
}

const summary = `${JSON.stringify(output, null, 4)}\n`

await mkdir(path.dirname(evidencePath), { recursive: true })
await writeFile(evidencePath, summary, 'utf8')
process.stdout.write(summary)

if (!output.passed) {
    process.exitCode = 1
}
