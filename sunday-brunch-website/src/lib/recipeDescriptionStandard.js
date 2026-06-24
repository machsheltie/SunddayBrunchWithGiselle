// Enforces the recipe-card description standard.
// See docs/recipe-card-description-standard.md for the authoring guide.
//
// The unexpanded recipe card (and SEO meta description) must lead with a short
// blurb that describes what the recipe IS — not the opening line of its story.
// This validator is exercised by a guard test over the canonical recipes so a
// new record can't quietly regress to a story-hook blurb.

import { getStoryExcerpt } from './story'

export const DESCRIPTION_MIN_LENGTH = 40
export const DESCRIPTION_MAX_LENGTH = 160

export function validateRecipeDescription(recipe) {
    const problems = []
    const description = (recipe?.description || '').trim()

    if (!description) {
        problems.push('Missing description: every recipe must supply a summary.')
        return problems
    }

    if (description.length < DESCRIPTION_MIN_LENGTH) {
        problems.push(
            `Description too short (${description.length} chars; minimum ${DESCRIPTION_MIN_LENGTH}).`
        )
    }

    if (description.length > DESCRIPTION_MAX_LENGTH) {
        problems.push(
            `Description too long (${description.length} chars; maximum ${DESCRIPTION_MAX_LENGTH}).`
        )
    }

    if (/[\r\n]/.test(description)) {
        problems.push('Description must be a single line (no line breaks).')
    }

    const storyExcerpt = getStoryExcerpt(recipe?.story).trim()
    if (storyExcerpt && description === storyExcerpt) {
        problems.push(
            'Description must describe the dish, not reuse the story opening line.'
        )
    }

    return problems
}
