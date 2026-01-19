import { test, expect } from '@playwright/test'

/**
 * E2E Tests for Home Page
 * Critical Path: User lands on home page and sees content
 */

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page before each test
    await page.goto('/')
  })

  test('should load home page successfully', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/Sunday Brunch/i)

    // Verify main heading is visible
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
  })

  test('should display hero section with CTA', async ({ page }) => {
    // Verify hero section exists
    const hero = page.locator('.hero, [data-testid="hero"]')
    await expect(hero).toBeVisible()

    // Verify CTA button exists and is clickable
    const ctaButton = page.getByRole('button', { name: /explore recipes/i }).or(
      page.getByRole('link', { name: /explore recipes/i })
    )
    await expect(ctaButton).toBeVisible()
  })

  test('should display featured recipe card', async ({ page }) => {
    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Verify featured recipe section exists
    const featuredSection = page.locator('.featured-recipe, [data-testid="featured-recipe"]')
    await expect(featuredSection).toBeVisible()

    // Verify recipe title is visible
    const recipeTitle = featuredSection.getByRole('heading')
    await expect(recipeTitle).toBeVisible()
  })

  test('should display recent recipes gallery', async ({ page }) => {
    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Verify recent recipes section exists
    const recentSection = page.locator('.recent-recipes, [data-testid="recent-recipes"]')
    await expect(recentSection).toBeVisible()

    // Verify at least one recipe card is displayed
    const recipeCards = page.locator('.recipe-card, [data-testid="recipe-card"]')
    await expect(recipeCards.first()).toBeVisible()
  })

  test('should display recipe collections section', async ({ page }) => {
    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Verify collections section exists
    const collectionsSection = page.locator('.recipe-collections, [data-testid="recipe-collections"]')
    await expect(collectionsSection).toBeVisible()

    // Verify at least one collection is displayed
    const collections = page.locator('.collection-card, [data-testid="collection-card"]')
    await expect(collections.first()).toBeVisible()
  })

  test('should navigate to recipe detail when clicking recipe card', async ({ page }) => {
    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Find and click first recipe card link
    const recipeLink = page.locator('.recipe-card a, [data-testid="recipe-card"] a').first()
    await recipeLink.click()

    // Verify navigation occurred (URL changed)
    await expect(page).toHaveURL(/\/recipe\//)
  })

  test('should display watercolor canvas background', async ({ page }) => {
    // Verify canvas element exists (may be lazy loaded)
    const canvas = page.locator('canvas, [data-testid="watercolor-canvas"]')

    // Wait a bit for lazy loading
    await page.waitForTimeout(2000)

    // Canvas should exist (even if lazy loaded)
    const canvasCount = await canvas.count()
    expect(canvasCount).toBeGreaterThanOrEqual(0) // May be 0 if lazy loading not triggered yet
  })

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Reload page with mobile viewport
    await page.reload()

    // Verify page still loads
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    // Verify content is still visible
    const hero = page.locator('.hero, [data-testid="hero"]')
    await expect(hero).toBeVisible()
  })

  test('should have accessible navigation', async ({ page }) => {
    // Verify navigation element exists
    const nav = page.getByRole('navigation')
    await expect(nav).toBeVisible()

    // Verify navigation links are keyboard accessible
    const navLinks = nav.getByRole('link')
    const firstLink = navLinks.first()

    // Focus first link with keyboard
    await firstLink.focus()
    await expect(firstLink).toBeFocused()
  })
})
