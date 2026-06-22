import { episodes } from '../data/content'
import frenchSilkPieRecord from '../../../content/records/recipes/1_french_silk_pie/REC-001-french-silk-pie.json'

const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 60))

const CANONICAL_SOURCE = 'content/records/recipes/1_french_silk_pie/REC-001-french-silk-pie.json'

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

    return {
        id: record.id,
        type: record.type,
        status: record.status,
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
        occasion: record.occasions?.[0],
        tags: [
            ...(record.tags || []),
            ...(record.mainIngredients || []),
            ...(record.methods || [])
        ],
        season: record.seasons?.[0] || 'All Seasons',
        cookTime: durationToMinutes(record.times?.total),
        date: publishedDate?.slice(0, 10),
        publishedDate,
        image,
        story: record.story,
        times: {
            prep: formatDuration(record.times?.prep),
            cook: formatDuration(record.times?.cook),
            chill: formatDuration(record.times?.chill),
            total: formatDuration(record.times?.total),
            prepISO: record.times?.prep,
            cookISO: record.times?.cook,
            totalISO: record.times?.total
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
        whyItWorks: record.whyItWorks,
        commonMistakes: record.commonMistakes || [],
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

export const recipes = [
    projectRecipe(frenchSilkPieRecord, CANONICAL_SOURCE)
]

export const getRecipes = async () => delay(recipes)
export const getEpisodes = async () => delay(episodes)

export const getRecipeBySlug = async (slug) => delay(recipes.find((item) => item.slug === slug))
export const getEpisodeBySlug = async (slug) => delay(episodes.find((item) => item.slug === slug))

export const getFeatured = async () => delay({
    recipe: recipes[0],
    episode: episodes[0]
})

export const getAllSlugs = () => ({
    recipes: recipes.map((r) => r.slug),
    episodes: episodes.map((e) => e.slug)
})

/**
 * Get recent recipes sorted by published date
 * @param {number} limit - Number of recipes to return (default: 8)
 * @returns {Promise<Array>} Array of most recent recipes
 */
export const getRecentRecipes = async (limit = 8) => {
    const allRecipes = await getRecipes()

    return delay(
        allRecipes
            .sort((a, b) => {
                // Sort by publishedDate if exists, otherwise fallback
                const dateA = new Date(a.publishedDate || '2024-01-01')
                const dateB = new Date(b.publishedDate || '2024-01-01')
                return dateB - dateA // Most recent first
            })
            .slice(0, limit)
    )
}
