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
