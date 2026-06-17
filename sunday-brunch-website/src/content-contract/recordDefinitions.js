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
    'recordType',
    'version',
    'status',
    'owner',
    'reviewer',
    'approver',
    'createdAt',
    'updatedAt',
    'sourceReferences'
]

const commonAllowed = [
    ...commonRequired,
    'publishedAt',
    'correctionOf',
    'withdrawalReason'
]

export const recordDefinitions = {
    recipe: {
        required: [
            ...commonRequired,
            'slug',
            'title',
            'summary',
            'pillar',
            'productionStream',
            'times',
            'yield',
            'difficulty',
            'equipment',
            'ingredientGroups',
            'instructionSections',
            'allergens',
            'dietaryDisclosures',
            'sensoryCheckpoints',
            'substitutions',
            'troubleshooting',
            'storage',
            'media'
        ],
        allowed: [
            ...commonAllowed,
            'slug',
            'title',
            'summary',
            'pillar',
            'productionStream',
            'times',
            'yield',
            'difficulty',
            'equipment',
            'ingredientGroups',
            'instructionSections',
            'allergens',
            'dietaryDisclosures',
            'sensoryCheckpoints',
            'substitutions',
            'troubleshooting',
            'storage',
            'media',
            'collectionIds',
            'episodeIds',
            'testEvidence',
            'story'
        ]
    },
    episode: {
        required: [
            ...commonRequired,
            'slug',
            'title',
            'briefId',
            'scriptId',
            'canonVersion',
            'cast',
            'chapters',
            'transcriptId',
            'mediaAssetIds',
            'rightsRecordIds',
            'disclosureVersion'
        ],
        allowed: [
            ...commonAllowed,
            'slug',
            'title',
            'briefId',
            'scriptId',
            'canonVersion',
            'cast',
            'chapters',
            'transcriptId',
            'mediaAssetIds',
            'rightsRecordIds',
            'disclosureVersion',
            'recipeIds',
            'releaseMetadata'
        ]
    },
    correction: {
        required: [
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
        ],
        allowed: [
            ...commonAllowed,
            'subjectId',
            'affectedVersion',
            'severity',
            'rationale',
            'containment',
            'correctedVersion',
            'changedFields',
            'noticeDecision',
            'closureEvidence',
            'actionDecision',
            'relatedImpact',
            'preventionAction'
        ]
    }
}
