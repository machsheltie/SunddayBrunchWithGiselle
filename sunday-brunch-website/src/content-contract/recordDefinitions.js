// Reconciled to the approved content model (ART-006) under D-12 (2026-06-18).
// Field NAMES follow the content-model contract (Schema A): `type`, the
// `createdBy`/`updatedBy`/`ownerId`/`revisionNote` audit fields, `sourceRefs`,
// `primaryPillarId`/`productionStreamId`, `commonMistakes`/`recovery`/
// `testedSubstitutions`, flat behavior flags, and `characters`/`collections`/
// `campaigns`/`featuredEpisode` relationships. The nested `times`/`yield`/
// `storage`/`media` objects are retained as the one improvement from the prior
// validator. The D-08/D-09/D-10 additions (`story`, `characterSegments`, the
// controlled taxonomy) are kept; they supersede the old ad-hoc season/occasion/
// skill/tags fields.

export const activeRecordTypes = new Set([
    'recipe',
    'episode',
    'correction'
])

export const reservedRecordTypes = new Set([
    'contributor-profile',
    'pet-profile',
    'submission',
    'moderation-action',
    'consent-grant',
    'contest',
    'merchandise-item',
    'public-review',
    'rating',
    'comment',
    'follower',
    'feed',
    'direct-message',
    'personalized-recommendation',
    'saved-plan',
    'cross-device-profile'
])

const commonRequired = [
    'id',
    'type',
    'status',
    'version',
    'createdAt',
    'updatedAt',
    'createdBy',
    'updatedBy',
    'ownerId',
    'sourceRefs',
    'revisionNote'
]

const commonAllowed = [
    ...commonRequired,
    'slug',
    'publishedAt',
    'approvedBy',
    'approvedAt',
    'correctionOf',
    'withdrawalReason'
]

const recipeRequired = [
    ...commonRequired,
    'slug',
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
    'times',
    'yield',
    'difficulty',
    'equipment',
    'ingredientGroups',
    'instructionSections',
    'allergens',
    'dietaryDisclosures',
    'sensoryCheckpoints',
    'commonMistakes',
    'recovery',
    'testedSubstitutions',
    'storage',
    'media'
]

const episodeRequired = [
    ...commonRequired,
    'slug',
    'title',
    'summary',
    'episodeNumber',
    'primaryPillarId',
    'productionStreamId',
    'objective',
    'emotionalThread',
    'featuredRecipe',
    'primaryComicEngine',
    'cast',
    'canonVersion'
]

const correctionRequired = [
    ...commonRequired,
    'subjectId',
    'affectedVersion',
    'severity',
    'rationale',
    'containment',
    'correctedVersion',
    'changedFields',
    'noticeDecision',
    'closureEvidence'
]

export const recordDefinitions = {
    recipe: {
        required: recipeRequired,
        allowed: [
            ...commonAllowed,
            ...recipeRequired,
            'updateHistory',
            'vessel',
            'whyItWorks',
            'petSafeNote',
            'notes',
            'freezing',
            'reheating',
            'makeAhead',
            'transport',
            'gifting',
            'story',
            'characterSegments',
            'course',
            'dishType',
            'mainIngredients',
            'methods',
            'occasions',
            'seasons',
            'dietary',
            'scalingEligible',
            'scaleFactors',
            'unitConversionEligible',
            'printEligible',
            'copyEligible',
            'characterSegmentsInPrint',
            'featuredEpisode',
            'relatedEpisodes',
            'characters',
            'collections',
            'tags',
            'campaigns',
            'testEvidence'
        ]
    },
    episode: {
        required: episodeRequired,
        allowed: [
            ...commonAllowed,
            ...episodeRequired,
            'approvedBrief',
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
        ]
    },
    correction: {
        required: correctionRequired,
        allowed: [
            ...commonAllowed,
            ...correctionRequired,
            'reporter',
            'reviewDate',
            'actionDecision',
            'relatedImpact',
            'preventionAction'
        ]
    }
}
