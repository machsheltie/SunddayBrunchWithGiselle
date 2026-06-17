import { describe, expect, it } from 'vitest'
import {
    assertCanonicalWrite,
    validateRecord
} from '../index'

import validRecipe from '../../../content/fixtures/art-007/valid-recipe.json'
import validEpisode from '../../../content/fixtures/art-007/valid-episode.json'
import validCorrection from '../../../content/fixtures/art-007/valid-correction.json'
import invalidCorrectionVersion from '../../../content/fixtures/art-007/invalid-correction-version.json'
import invalidCorrectionVersionEqual from '../../../content/fixtures/art-007/invalid-correction-version-equal.json'
import unknownField from '../../../content/fixtures/art-007/invalid-unknown-field.json'
import reservedRecord from '../../../content/fixtures/art-007/invalid-reserved-record.json'

describe('ART-007 content contract', () => {
    it('validates a representative recipe', () => {
        expect(validateRecord(validRecipe)).toEqual({ valid: true, errors: [] })
    })

    it('accepts a recipe narrative story headnote', () => {
        expect(validRecipe).toHaveProperty('story')
        expect(validateRecord(validRecipe)).toEqual({ valid: true, errors: [] })
    })

    it('treats the recipe story as optional', () => {
        const { story, ...recipeWithoutStory } = validRecipe
        expect(validateRecord(recipeWithoutStory)).toEqual({ valid: true, errors: [] })
    })

    it('validates a representative episode', () => {
        expect(validateRecord(validEpisode)).toEqual({ valid: true, errors: [] })
    })

    it('requires corrections to preserve prior-version traceability', () => {
        expect(validateRecord(validCorrection)).toEqual({ valid: true, errors: [] })
    })

    it('rejects correction records that do not advance the corrected version', () => {
        expect(validateRecord(invalidCorrectionVersion)).toEqual({
            valid: false,
            errors: ['Corrected version must be greater than affected version']
        })
    })

    it('rejects correction records that reuse the affected version', () => {
        expect(validateRecord(invalidCorrectionVersionEqual)).toEqual({
            valid: false,
            errors: ['Corrected version must be greater than affected version']
        })
    })

    it('rejects unknown fields', () => {
        expect(validateRecord(unknownField)).toEqual({
            valid: false,
            errors: ['Unknown field: popularityScore']
        })
    })

    it('rejects reserved record types', () => {
        expect(validateRecord(reservedRecord)).toEqual({
            valid: false,
            errors: ['Reserved record type is inactive: public-review']
        })
    })

    it('rejects projection writeback', () => {
        expect(() => assertCanonicalWrite('website-projection')).toThrow(
            'Projection sources cannot write canonical content'
        )
    })
})
