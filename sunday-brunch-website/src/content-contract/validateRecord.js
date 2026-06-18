import {
    activeRecordTypes,
    recordDefinitions,
    reservedRecordTypes
} from './recordDefinitions.js'
import {
    recipeDifficultyLevels,
    recipeTaxonomies
} from './taxonomy.js'

const validateRecipeTaxonomy = (record) => {
    const errors = []

    for (const [field, allowedValues] of Object.entries(recipeTaxonomies)) {
        if (record[field] === undefined) {
            continue
        }

        if (!Array.isArray(record[field])) {
            errors.push(`${field} must be an array`)
            continue
        }

        for (const value of record[field]) {
            if (!allowedValues.includes(value)) {
                errors.push(`Unknown ${field} value: ${value}`)
            }
        }
    }

    if (record.difficulty !== undefined
        && !recipeDifficultyLevels.includes(record.difficulty)) {
        errors.push(`Unknown difficulty value: ${record.difficulty}`)
    }

    return errors
}

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
    const correctionErrors = record.recordType === 'correction'
        && record.affectedVersion !== undefined
        && record.correctedVersion !== undefined
        && record.correctedVersion <= record.affectedVersion
        ? ['Corrected version must be greater than affected version']
        : []
    const taxonomyErrors = record.recordType === 'recipe'
        ? validateRecipeTaxonomy(record)
        : []
    const errors = [...missing, ...unknown, ...correctionErrors, ...taxonomyErrors]

    return {
        valid: errors.length === 0,
        errors
    }
}
