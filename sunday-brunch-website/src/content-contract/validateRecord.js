import {
    activeRecordTypes,
    recordDefinitions,
    reservedRecordTypes
} from './recordDefinitions.js'

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
    const errors = [...missing, ...unknown, ...correctionErrors]

    return {
        valid: errors.length === 0,
        errors
    }
}
