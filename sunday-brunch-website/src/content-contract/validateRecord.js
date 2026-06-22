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
    if (reservedRecordTypes.has(record.type)) {
        return {
            valid: false,
            errors: [`Reserved record type is inactive: ${record.type}`]
        }
    }

    if (!activeRecordTypes.has(record.type)) {
        return {
            valid: false,
            errors: [`Unknown record type: ${record.type}`]
        }
    }

    const definition = recordDefinitions[record.type]
    const missing = definition.required
        .filter((field) => record[field] === undefined)
        .map((field) => `Missing required field: ${field}`)
    const unknown = Object.keys(record)
        .filter((field) => !definition.allowed.includes(field))
        .map((field) => `Unknown field: ${field}`)
    const correctionErrors = record.type === 'correction'
        && record.affectedVersion !== undefined
        && record.correctedVersion !== undefined
        && record.correctedVersion <= record.affectedVersion
        ? ['Corrected version must be greater than affected version']
        : []
    const taxonomyErrors = record.type === 'recipe'
        ? validateRecipeTaxonomy(record)
        : []
    const errors = [...missing, ...unknown, ...correctionErrors, ...taxonomyErrors]

    return {
        valid: errors.length === 0,
        errors
    }
}
