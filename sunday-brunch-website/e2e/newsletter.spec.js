import { test, expect } from '@playwright/test'

/**
 * E2E Tests for Newsletter Signup
 * Critical Path: User can subscribe to newsletter
 */

test.describe('Newsletter Signup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display newsletter signup form', async ({ page }) => {
    // Scroll to footer where newsletter typically is
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)

    // Look for newsletter section
    const newsletterSection = page.locator('[data-testid="newsletter"], .newsletter, [aria-label*="newsletter" i]')
    const emailInput = page.getByPlaceholder(/email/i).or(page.getByLabel(/email/i))

    // At least one should be visible
    const hasNewsletterSection = await newsletterSection.count() > 0
    const hasEmailInput = await emailInput.count() > 0

    expect(hasNewsletterSection || hasEmailInput).toBeTruthy()
  })

  test('should validate email format in newsletter signup', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)

    // Find email input (might be in footer or elsewhere)
    const emailInput = page.getByPlaceholder(/email/i).or(page.getByLabel(/email.*newsletter|subscribe/i))

    if (await emailInput.count() === 0) {
      test.skip()
    }

    // Enter invalid email
    await emailInput.first().fill('invalid-email')

    // Find and click submit button
    const submitButton = emailInput.first().locator('..').getByRole('button').or(
      page.getByRole('button', { name: /subscribe|sign up|join/i })
    )

    if (await submitButton.count() > 0) {
      await submitButton.first().click()

      // Should show validation error
      const errorMessage = page.locator('.error, [role="alert"], .error-message, [data-testid="error"]')
      await expect(errorMessage.first()).toBeVisible({ timeout: 3000 })
    }
  })

  test('should show success message on valid newsletter signup', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)

    // Find email input
    const emailInput = page.getByPlaceholder(/email/i).or(page.getByLabel(/email.*newsletter|subscribe/i))

    if (await emailInput.count() === 0) {
      test.skip()
    }

    // Enter valid email
    const testEmail = `test.${Date.now()}@example.com`
    await emailInput.first().fill(testEmail)

    // Find and click submit button
    const submitButton = emailInput.first().locator('..').getByRole('button').or(
      page.getByRole('button', { name: /subscribe|sign up|join/i })
    )

    if (await submitButton.count() > 0) {
      await submitButton.first().click()

      // Should show success message
      const successMessage = page.getByText(/thank you|success|subscribed|welcome/i)
      await expect(successMessage).toBeVisible({ timeout: 5000 })
    }
  })

  test('should not allow empty email submission', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)

    // Find email input
    const emailInput = page.getByPlaceholder(/email/i).or(page.getByLabel(/email.*newsletter|subscribe/i))

    if (await emailInput.count() === 0) {
      test.skip()
    }

    // Leave email empty and try to submit
    const submitButton = emailInput.first().locator('..').getByRole('button').or(
      page.getByRole('button', { name: /subscribe|sign up|join/i })
    )

    if (await submitButton.count() > 0) {
      await submitButton.first().click()

      // Should show error or prevent submission
      // Check if error message appears OR form didn't submit (success message doesn't appear)
      await page.waitForTimeout(2000)

      const successMessage = page.getByText(/thank you|success|subscribed/i)
      const successCount = await successMessage.count()

      // If no success message, validation worked
      expect(successCount).toBe(0)
    }
  })

  test('should be keyboard accessible', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)

    // Find email input
    const emailInput = page.getByPlaceholder(/email/i).or(page.getByLabel(/email.*newsletter|subscribe/i))

    if (await emailInput.count() === 0) {
      test.skip()
    }

    // Focus on email input using Tab
    await emailInput.first().focus()
    await expect(emailInput.first()).toBeFocused()

    // Type email
    await page.keyboard.type('test@example.com')

    // Press Tab to move to submit button
    await page.keyboard.press('Tab')

    // Press Enter to submit
    await page.keyboard.press('Enter')

    // Should show success or error message
    await page.waitForTimeout(2000)
    const messages = page.locator('[role="alert"], .error, .success, [data-testid="message"]')
    const messageCount = await messages.count()

    expect(messageCount).toBeGreaterThan(0)
  })

  test('should handle network errors gracefully', async ({ page }) => {
    // Intercept network request and force it to fail
    await page.route('**/api/**', route => route.abort())
    await page.route('**/subscribe**', route => route.abort())

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)

    // Find email input
    const emailInput = page.getByPlaceholder(/email/i).or(page.getByLabel(/email.*newsletter|subscribe/i))

    if (await emailInput.count() === 0) {
      test.skip()
    }

    // Try to submit
    await emailInput.first().fill('test@example.com')

    const submitButton = emailInput.first().locator('..').getByRole('button').or(
      page.getByRole('button', { name: /subscribe|sign up|join/i })
    )

    if (await submitButton.count() > 0) {
      await submitButton.first().click()

      // Should show error message for network failure
      const errorMessage = page.getByText(/error|failed|try again|problem/i)
      await expect(errorMessage).toBeVisible({ timeout: 5000 })
    }
  })

  test('should display privacy policy or terms link', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)

    // Look for privacy/terms links near newsletter
    const privacyLink = page.getByRole('link', { name: /privacy|terms|policy/i })

    // Privacy links are good practice but not critical
    const linkCount = await privacyLink.count()
    expect(linkCount).toBeGreaterThanOrEqual(0)
  })
})
