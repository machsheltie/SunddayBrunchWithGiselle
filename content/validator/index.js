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
