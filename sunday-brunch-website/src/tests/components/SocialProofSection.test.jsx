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

  it('points every seed testimonial at the live French Silk Pie recipe', () => {
    expect(SEED_TESTIMONIALS.length).toBeGreaterThan(0)
    for (const testimonial of SEED_TESTIMONIALS) {
      expect(testimonial.recipeTitle).toBe('French Silk Pie')
      expect(testimonial.recipeSlug).toBe('french-silk-pie')
    }
  })

  it('contains no retired placeholder recipe slugs', () => {
    const blob = JSON.stringify(SEED_TESTIMONIALS)
    expect(blob).not.toContain('placeholder-')
  })
})
