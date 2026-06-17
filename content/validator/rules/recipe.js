'use strict'

// Source: content-model.md — Recipe Aggregate
// Fields that must have a key present in a recipe record.
// Values may be null for draft records; structure must be present.
const RECIPE_REQUIRED_FIELDS = [
  'title',
  'summary',
  'primaryPillarId',
  'productionStreamId',
  'author',
  'tester',
  'reviewer',
  'approver',
  'testDate',
  'revisionState',
  'updateHistory',
  'prepTime',
  'cookTime',
  'totalTime',
  'yield',
  'difficulty',
  'ingredientGroups',
  'instructionSections'
]

// Full list of allowed field names for a recipe record.
// A field present in a recipe record that is NOT in this set is an unknown field and must be rejected.
const RECIPE_ALLOWED_FIELDS = new Set([
  // Required fields
  ...RECIPE_REQUIRED_FIELDS,
  // Optional per content-model.md
  'equipment',
  'vessel',
  'collections',
  'season',
  'occasion',
  'skill',
  'dietaryDisclosures',
  'allergens',
  'notes',
  'sensoryCheckpoints',
  'testedSubstitutions',
  'commonMistakes',
  'recovery',
  'storage',
  'freezing',
  'reheating',
  'makeAhead',
  'transport',
  'gifting',
  'petSafeNote',
  'whyItWorks',
  'scalingEligible',
  'scaleFactors',
  'unitConversionEligible',
  'printEligible',
  'copyEligible',
  'heroAsset',
  'processAssets',
  'socialDerivatives',
  'mediaRights',
  'featuredEpisode',
  'relatedEpisodes',
  'characters',
  'tags',
  'campaigns'
])

module.exports = { RECIPE_REQUIRED_FIELDS, RECIPE_ALLOWED_FIELDS }
