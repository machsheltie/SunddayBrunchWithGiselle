import { describe, expect, it } from 'vitest'
import {
  getAllSlugs,
  getFeatured,
  getRecipeBySlug,
  getRecipes,
  getRecentRecipes
} from '../../lib/content'
import { recipes as legacyDataRecipes } from '../../data/content'

describe('Content service canonical recipes', () => {
  it('serves French Silk Pie as the active representative recipe', async () => {
    const recipe = await getRecipeBySlug('french-silk-pie')

    expect(recipe).toMatchObject({
      id: 'REC-001',
      slug: 'french-silk-pie',
      title: 'French Silk Pie',
      status: 'scheduled',
      canonicalSource: 'content/records/recipes/1_french_silk_pie/REC-001-french-silk-pie.json',
      story: {
        headline: 'The pie that started everything'
      }
    })
    expect(recipe.story.body).toContain('The first French Silk Pie I ever made was a bribe.')
    expect(recipe.ingredients).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'unsweetened baking chocolate, 100% cacao',
          amount: 4,
          unit: 'oz'
        })
      ])
    )
    expect(recipe.yield).toBe('8 slices')
    expect(recipe.yieldQuantity).toBe(8)
    expect(recipe.image).toBe('/images/recipes/frenchsilkpie.jpg')
    expect(recipe.image).not.toContain('1765388327983')
    expect(recipe.meta.ogImage).toBe('/images/recipes/frenchsilkpie.jpg')
    expect(recipe.steps).toHaveLength(8)
    expect(recipe.steps[0]).toMatchObject({
      content: expect.stringContaining('Bake and fully cool the crust.'),
      section: 'Make the pie'
    })
    expect(recipe.characterSegments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          characterId: 'CHAR-004-havok',
          segment: "Havok's Kitchen Recon"
        }),
        expect.objectContaining({
          characterId: 'CHAR-001-giselle',
          segment: "Giselle's Grand Verdict"
        })
      ])
    )
  })

  it('surfaces chill time and flags French Silk Pie as mostly hands-off chilling', async () => {
    const recipe = await getRecipeBySlug('french-silk-pie')

    expect(recipe.times.chill).toBe('2 hr')
    expect(recipe.times.chillISO).toBe('PT2H')
    expect(recipe.times.total).toBe('2 hr 42 min')
    // chill (120 min) is the majority of total (162 min) -> note should show
    expect(recipe.times.mostlyChilling).toBe(true)
  })

  it('excludes retired and sample placeholder recipes from public recipe lists', async () => {
    const recipes = await getRecipes()
    const slugs = recipes.map((recipe) => recipe.slug)

    expect(slugs).toContain('french-silk-pie')
    expect(slugs).not.toContain('giselles-royal-velvet-cake')
    expect(slugs.some((slug) => slug.startsWith('placeholder-'))).toBe(false)
    expect(recipes.every((recipe) => recipe.isSample !== true)).toBe(true)
  })

  it('keeps the legacy data export pointed at the canonical approved recipe index', () => {
    const slugs = legacyDataRecipes.map((recipe) => recipe.slug)

    expect(slugs).toEqual(['french-silk-pie'])
    expect(legacyDataRecipes.every((recipe) => recipe.canonicalSource)).toBe(true)
    expect(slugs.some((slug) => slug.startsWith('placeholder-'))).toBe(false)
  })

  it('returns canonical slugs and featured recipe from the public canonical set', async () => {
    const allSlugs = getAllSlugs()
    const featured = await getFeatured()
    const recent = await getRecentRecipes()

    expect(allSlugs.recipes).toEqual(['french-silk-pie'])
    expect(featured.recipe.slug).toBe('french-silk-pie')
    expect(recent.map((recipe) => recipe.slug)).toEqual(['french-silk-pie'])
  })

  it('does not resolve the retired Royal Velvet placeholder route', async () => {
    await expect(getRecipeBySlug('giselles-royal-velvet-cake')).resolves.toBeUndefined()
  })

  it('returns recipe list copies so callers cannot mutate the canonical index', async () => {
    const firstRead = await getRecipes()
    firstRead.pop()

    const secondRead = await getRecipes()

    expect(secondRead.map((recipe) => recipe.slug)).toEqual(['french-silk-pie'])
  })
})
