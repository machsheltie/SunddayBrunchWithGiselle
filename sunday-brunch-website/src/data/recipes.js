import frenchSilkPieRecord from '../../../content/records/recipes/1_french_silk_pie/REC-001-french-silk-pie.json'

const APPROVED_PUBLIC_STATUSES = new Set(['approved', 'scheduled', 'published'])

const canonicalRecipeEntries = [
    {
        record: frenchSilkPieRecord,
        canonicalSource: 'content/records/recipes/1_french_silk_pie/REC-001-french-silk-pie.json'
    }
]

const categoryEmojiMap = {
    Pies: '🥧',
    Cakes: '🍰',
    Cookies: '🍪',
    Breads: '🍞',
    Brownies: '🍫',
    Cheesecakes: '🎂',
    Cupcakes: '🧁',
    Breakfast: '🧇',
    Pastries: '🥐'
}

const isApprovedRecipeRecord = (record) =>
    record?.type === 'recipe'
    && record?.revisionState === 'approved'
    && Boolean(record?.approvedAt)
    && APPROVED_PUBLIC_STATUSES.has(record?.status)

const formatDuration = (isoDuration) => {
    if (!isoDuration) return undefined

    const match = isoDuration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?$/)
    if (!match) return isoDuration

    const hours = Number(match[1] || 0)
    const minutes = Number(match[2] || 0)
    const parts = []

    if (hours) parts.push(`${hours} hr`)
    if (minutes) parts.push(`${minutes} min`)

    return parts.join(' ') || '0 min'
}

const durationToMinutes = (isoDuration) => {
    if (!isoDuration) return 0

    const match = isoDuration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?$/)
    if (!match) return 0

    return Number(match[1] || 0) * 60 + Number(match[2] || 0)
}

const normalizeCategory = (record) => {
    const dishType = record.dishType?.[0] || record.course?.[0] || 'Recipes'
    if (dishType.toLowerCase().includes('pie') || dishType.toLowerCase().includes('tart')) {
        return 'Pies'
    }

    return dishType
}

const formatYield = (yieldData) => {
    if (!yieldData) return ''
    if (typeof yieldData === 'string') return yieldData

    return [yieldData.quantity, yieldData.unit].filter(Boolean).join(' ')
}

const projectIngredient = (item) => ({
    name: item.ingredient,
    amount: item.quantity,
    unit: item.unit,
    metricAmount: undefined,
    metricUnit: undefined,
    note: item.note,
    preparation: item.preparation,
    group: item.group
})

const flattenIngredients = (ingredientGroups = []) =>
    ingredientGroups.flatMap((group) =>
        (group.items || []).map((item) =>
            projectIngredient({
                ...item,
                group: group.label
            })
        )
    )

const flattenSteps = (instructionSections = []) =>
    instructionSections.flatMap((section) =>
        (section.steps || []).map((step) => ({
            content: step.body || step.instruction || step.content || step.text,
            section: section.label,
            image: step.image
        }))
    )

const projectEquipment = (equipment = []) =>
    equipment.map((tool) => ({
        name: typeof tool === 'string' ? tool : tool.name,
        link: '#',
        category: 'Equipment'
    }))

// Project the recipe's hero image from its canonical media reference. The
// served asset in public/images/recipes/ mirrors the canonical filename, so
// the projection never hardcodes a path that can drift from the record.
const projectImage = (record) => {
    const referenceId = record.media?.source?.referenceId
    return referenceId
        ? `/images/recipes/${referenceId}`
        : '/images/placeholder.svg'
}

const projectRecipe = (record, canonicalSource) => {
    const category = normalizeCategory(record)
    const ingredients = flattenIngredients(record.ingredientGroups)
    const steps = flattenSteps(record.instructionSections)
    const publishedDate = record.approvedAt || record.updatedAt || record.createdAt
    const image = projectImage(record)
    const chillMinutes = durationToMinutes(record.times?.chill)
    const totalMinutes = durationToMinutes(record.times?.total)

    return {
        id: record.id,
        type: record.type,
        status: record.status,
        revisionState: record.revisionState,
        approvedAt: record.approvedAt,
        version: record.version,
        canonicalSource,
        slug: record.slug,
        title: record.title,
        summary: record.summary,
        description: record.summary,
        category,
        emoji: categoryEmojiMap[category] || '🍽️',
        skill: record.difficulty,
        difficulty: record.difficulty,
        dietary: record.dietary || [],
        allergens: record.allergens || [],
        dietaryDisclosures: record.dietaryDisclosures || [],
        occasion: record.occasions?.[0],
        occasions: record.occasions || [],
        tags: [
            ...(record.tags || []),
            ...(record.mainIngredients || []),
            ...(record.methods || [])
        ],
        season: record.seasons?.[0] || 'All Seasons',
        seasons: record.seasons || [],
        collections: record.collections || [],
        cookTime: durationToMinutes(record.times?.total),
        date: publishedDate?.slice(0, 10),
        publishedDate,
        image,
        imageAlt: record.media?.altText,
        story: record.story,
        times: {
            prep: formatDuration(record.times?.prep),
            cook: formatDuration(record.times?.cook),
            chill: formatDuration(record.times?.chill),
            total: formatDuration(record.times?.total),
            prepISO: record.times?.prep,
            cookISO: record.times?.cook,
            chillISO: record.times?.chill,
            totalISO: record.times?.total,
            // True when the chill is the majority of total time, so the stats
            // line can reassure that the long total is mostly hands-off chilling.
            // Guard total > 0 so a missing/unparseable total can't false-trigger.
            mostlyChilling:
                chillMinutes > 0 && totalMinutes > 0 && chillMinutes * 2 > totalMinutes
        },
        yield: formatYield(record.yield),
        yieldQuantity: record.yield?.quantity,
        ingredients,
        ingredientGroups: record.ingredientGroups || [],
        steps,
        instructionSections: record.instructionSections || [],
        tools: projectEquipment(record.equipment),
        related: [],
        seasonal: [],
        meta: {
            description: record.summary,
            ogImage: image
        },
        notes: record.notes?.join('\n\n'),
        characterSegments: record.characterSegments || [],
        sensoryCheckpoints: record.sensoryCheckpoints || [],
        testedSubstitutions: record.testedSubstitutions || [],
        whyItWorks: record.whyItWorks,
        commonMistakes: record.commonMistakes || [],
        recovery: record.recovery,
        storage: record.storage,
        petSafeNote: record.petSafeNote,
        scalingEligible: record.scalingEligible,
        scaleFactors: record.scaleFactors || [],
        unitConversionEligible: record.unitConversionEligible,
        printEligible: record.printEligible,
        copyEligible: record.copyEligible,
        characterSegmentsInPrint: record.characterSegmentsInPrint,
        searchText: [
            record.title,
            record.summary,
            record.story?.headline,
            record.story?.body,
            ...ingredients.map((ingredient) => ingredient.name),
            ...(record.tags || [])
        ].filter(Boolean).join(' ')
    }
}

export const recipes = Object.freeze(
    canonicalRecipeEntries
        .filter(({ record }) => isApprovedRecipeRecord(record))
        .map(({ record, canonicalSource }) => projectRecipe(record, canonicalSource))
)

export { isApprovedRecipeRecord }
