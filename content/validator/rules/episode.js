'use strict'

// Source: content-model.md — Episode Aggregate
const EPISODE_REQUIRED_FIELDS = [
  'title',
  'summary',
  'primaryPillarId',
  'productionStreamId',
  'approvedBrief',
  'objective',
  'emotionalThread',
  'primaryComicEngine',
  'cast',
  'canonVersion'
]

const EPISODE_ALLOWED_FIELDS = new Set([
  ...EPISODE_REQUIRED_FIELDS,
  'episodeNumber',
  'featuredRecipe',
  'publicationDate',
  'duration',
  'artwork',
  'showNotes',
  'chapters',
  'transcript',
  'corrections',
  'sourceRecordings',
  'generatedPerformances',
  'editedDialogue',
  'master',
  'podcastHostUrl',
  'downloadFallback',
  'characterReview',
  'factualReview',
  'safetyReview',
  'accessibilityReview',
  'rightsStatus',
  'aiDisclosure',
  'releaseMetadata',
  'archiveCopy',
  'audioChecksums',
  'correctionHistory',
  'backupLocations',
  'relatedRecipes',
  'characters',
  'collections',
  'newsletter',
  'campaign'
])

module.exports = { EPISODE_REQUIRED_FIELDS, EPISODE_ALLOWED_FIELDS }
