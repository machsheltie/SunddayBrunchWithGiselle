import { describe, it, expect } from 'vitest'
import {
    validateRecipeDescription,
    DESCRIPTION_MIN_LENGTH,
    DESCRIPTION_MAX_LENGTH
} from '../../lib/recipeDescriptionStandard'
import { getRecipes } from '../../lib/content'
import { getStoryExcerpt } from '../../lib/story'

describe('Recipe card description standard — validator', () => {
    const goodDescription =
        'A cold, silky, mousse-like chocolate pie in a flaky crust under sweetened whipped cream and chocolate shards.'

    it('accepts a proper dish description', () => {
        const recipe = { description: goodDescription, story: ['The first one was a bribe.'] }
        expect(validateRecipeDescription(recipe)).toEqual([])
    })

    it('flags a missing description', () => {
        expect(validateRecipeDescription({ description: '', story: [] }))
            .toContain('Missing description: every recipe must supply a summary.')
    })

    it('flags a description that is just the story opening line', () => {
        const story = ['The first French Silk Pie I ever made was a bribe, and I have no regrets about it.']
        const recipe = { description: getStoryExcerpt(story), story }

        const problems = validateRecipeDescription(recipe)
        expect(problems.some((p) => /story opening line/i.test(p))).toBe(true)
    })

    it('flags a description that is too short', () => {
        const problems = validateRecipeDescription({ description: 'Chocolate pie.', story: [] })
        expect(problems.some((p) => /too short/i.test(p))).toBe(true)
    })

    it('flags a description that is too long', () => {
        const problems = validateRecipeDescription({ description: 'A '.repeat(120).trim(), story: [] })
        expect(problems.some((p) => /too long/i.test(p))).toBe(true)
    })

    it('flags a multi-line description', () => {
        const problems = validateRecipeDescription({
            description: `A silky chocolate pie that sets in the fridge.\nServe it cold under whipped cream and curls.`,
            story: []
        })
        expect(problems.some((p) => /single line/i.test(p))).toBe(true)
    })

    it('exposes sane length bounds', () => {
        expect(DESCRIPTION_MIN_LENGTH).toBeLessThan(DESCRIPTION_MAX_LENGTH)
        expect(DESCRIPTION_MAX_LENGTH).toBeLessThanOrEqual(160) // SEO meta-description ceiling
    })
})

describe('Recipe card description standard — canonical content guard', () => {
    it('every published recipe meets the description standard', async () => {
        const recipes = await getRecipes()

        const failures = recipes
            .map((recipe) => ({ slug: recipe.slug, problems: validateRecipeDescription(recipe) }))
            .filter((entry) => entry.problems.length > 0)

        // If this fails, a recipe record's `summary` violates
        // docs/recipe-card-description-standard.md — fix the record, not this test.
        expect(failures).toEqual([])
    })
})
