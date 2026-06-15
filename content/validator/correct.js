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
