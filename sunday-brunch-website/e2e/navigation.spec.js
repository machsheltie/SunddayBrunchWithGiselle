import { test, expect } from '@playwright/test'

/**
 * E2E Tests for Navigation
 * Critical Path: User can navigate between pages
 */

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display navigation menu', async ({ page }) => {
    const nav = page.getByRole('navigation')
    await expect(nav).toBeVisible()

    // Verify common navigation links exist
    const homeLink = nav.getByRole('link', { name: /home/i })
    await expect(homeLink).toBeVisible()
  })

  test('should navigate to About page', async ({ page }) => {
    const nav = page.getByRole('navigation')
    const aboutLink = nav.getByRole('link', { name: /about/i })

    // Skip if About link doesn't exist
    const aboutLinkCount = await aboutLink.count()
    if (aboutLinkCount === 0) {
      test.skip()
    }

    await aboutLink.click()
    await expect(page).toHaveURL(/about/i)
  })

  test('should navigate to Recipes page', async ({ page }) => {
    const nav = page.getByRole('navigation')
    const recipesLink = nav.getByRole('link', { name: /recipes/i })

    // Skip if Recipes link doesn't exist
    const recipesLinkCount = await recipesLink.count()
    if (recipesLinkCount === 0) {
      test.skip()
    }

    await recipesLink.click()
    await expect(page).toHaveURL(/recipes/i)
  })

  test('should navigate back to Home from other pages', async ({ page }) => {
    // Try to navigate to another page first
    const nav = page.getByRole('navigation')
    const otherLink = nav.getByRole('link', { name: /about|recipes|contact/i }).first()

    const otherLinkCount = await otherLink.count()
    if (otherLinkCount > 0) {
      await otherLink.click()
      await page.waitForTimeout(500)

      // Navigate back to home
      const homeLink = nav.getByRole('link', { name: /home/i }).or(
        page.locator('a[href="/"], a[href="/#"]')
      )
      await homeLink.click()

      await expect(page).toHaveURL(/\/$|\/index|\/home/i)
    }
  })

  test('should handle browser back button', async ({ page }) => {
    // Navigate to another page
    const nav = page.getByRole('navigation')
    const otherLink = nav.getByRole('link', { name: /about|recipes|contact/i }).first()

    const otherLinkCount = await otherLink.count()
    if (otherLinkCount > 0) {
      await otherLink.click()
      await page.waitForLoadState('networkidle')

      // Use browser back button
      await page.goBack()

      // Should be back on home page
      await expect(page).toHaveURL(/\/$|\/index|\/home/i)
    }
  })

  test('should handle browser forward button', async ({ page }) => {
    // Navigate to another page
    const nav = page.getByRole('navigation')
    const otherLink = nav.getByRole('link', { name: /about|recipes|contact/i }).first()

    const otherLinkCount = await otherLink.count()
    if (otherLinkCount > 0) {
      const initialUrl = page.url()
      await otherLink.click()
      await page.waitForLoadState('networkidle')
      const secondUrl = page.url()

      // Go back
      await page.goBack()
      await expect(page).toHaveURL(initialUrl)

      // Go forward
      await page.goForward()
      await expect(page).toHaveURL(secondUrl)
    }
  })

  test('should display active state on current page link', async ({ page }) => {
    const nav = page.getByRole('navigation')
    const homeLink = nav.getByRole('link', { name: /home/i })

    // Home link should have active class or aria-current
    const homeClasses = await homeLink.getAttribute('class')
    const ariaCurrent = await homeLink.getAttribute('aria-current')

    const isActive = (homeClasses && homeClasses.includes('active')) || ariaCurrent === 'page'
    expect(isActive).toBeTruthy()
  })

  test('should maintain navigation state after page reload', async ({ page }) => {
    // Navigate to another page
    const nav = page.getByRole('navigation')
    const otherLink = nav.getByRole('link', { name: /about|recipes|contact/i }).first()

    const otherLinkCount = await otherLink.count()
    if (otherLinkCount > 0) {
      await otherLink.click()
      const urlBeforeReload = page.url()

      // Reload page
      await page.reload()

      // Should still be on same page
      await expect(page).toHaveURL(urlBeforeReload)
    }
  })

  test('should be keyboard accessible', async ({ page }) => {
    const nav = page.getByRole('navigation')
    const firstLink = nav.getByRole('link').first()

    // Tab to first navigation link
    await page.keyboard.press('Tab')
    await expect(firstLink).toBeFocused()

    // Arrow keys or Tab should move through navigation items
    await page.keyboard.press('Tab')
    const secondLink = nav.getByRole('link').nth(1)

    // At least one link should be focused
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('should handle 404 for non-existent routes', async ({ page }) => {
    // Navigate to non-existent route
    await page.goto('/this-page-does-not-exist-12345')

    // Should show 404 message or redirect to home
    const response = await page.waitForLoadState('networkidle')

    // Either shows 404 text or redirects to home
    const has404Text = await page.getByText(/404|not found|page.*not.*exist/i).count()
    const isHomePage = page.url().match(/\/$|\/index|\/home/i)

    expect(has404Text > 0 || isHomePage).toBeTruthy()
  })
})
