import { describe, expect, it } from 'vitest'
import { SEED_TESTIMONIALS } from '../../components/SocialProofSection'

describe('SocialProofSection seed testimonials', () => {
  it('does not reference the retired Royal Velvet Cake', () => {
    const blob = JSON.stringify(SEED_TESTIMONIALS).toLowerCase()
    expect(blob).not.toContain('royal velvet')
    expect(blob).not.toContain('velvet cake')
    expect(blob).not.toContain('giselles-royal-velvet-cake')
  })

  it('leads with a French Silk Pie testimonial linking to the live recipe', () => {
    expect(SEED_TESTIMONIALS[0]).toMatchObject({
      recipeTitle: 'French Silk Pie',
      recipeSlug: 'french-silk-pie'
    })
  })
})
