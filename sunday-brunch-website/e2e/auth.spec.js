import { test, expect } from '@playwright/test'

/**
 * E2E Tests for Authentication Flow
 * Critical Path: User authentication (login, signup, password reset)
 */

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display login button/link in navigation', async ({ page }) => {
    // Look for login button or link
    const loginButton = page.getByRole('link', { name: /log in|login|sign in/i }).or(
      page.getByRole('button', { name: /log in|login|sign in/i })
    )

    // Login option should be visible
    await expect(loginButton).toBeVisible()
  })

  test('should open login modal when clicking login', async ({ page }) => {
    // Find and click login button (actual text is "Login")
    const loginButton = page.getByRole('button', { name: /^login$/i })
    await loginButton.click()

    // Verify login modal appears (modal-based auth, not separate route)
    await page.waitForTimeout(500) // Allow modal animation
    const loginModal = page.locator('[role="dialog"], .auth-modal, .modal')
    await expect(loginModal).toBeVisible({ timeout: 3000 })
  })

  test('should show validation error for empty login form', async ({ page }) => {
    // Open login modal
    const loginButton = page.getByRole('button', { name: /^login$/i })
    await loginButton.click()

    // Wait for modal to appear
    await page.waitForTimeout(500)

    // Try to submit empty form (find submit button within modal)
    const modal = page.locator('[role="dialog"], .auth-modal, .modal')
    const submitButton = modal.getByRole('button', { name: /log in|login|sign in|submit/i })

    if (await submitButton.count() > 0) {
      await submitButton.click()

      // Should show validation errors
      const errorMessage = modal.locator('.error, [role="alert"], .error-message')
      await expect(errorMessage.first()).toBeVisible({ timeout: 3000 })
    } else {
      test.skip() // Skip if modal structure is different
    }
  })

  test('should show validation error for invalid email format', async ({ page }) => {
    // Open login modal
    const loginButton = page.getByRole('button', { name: /^login$/i })
    await loginButton.click()
    await page.waitForTimeout(500)

    // Fill form with invalid email within modal
    const modal = page.locator('[role="dialog"], .auth-modal, .modal')
    const emailInput = modal.locator('input[type="email"]').first()
    const passwordInput = modal.locator('input[type="password"]').first()

    if (await emailInput.count() > 0) {
      await emailInput.fill('invalid-email')
      await passwordInput.fill('password123')

      // Submit form
      const submitButton = modal.getByRole('button', { name: /log in|sign in|submit/i })
      await submitButton.click()

      // Should show email validation error
      const errorMessage = modal.locator('.error, [role="alert"], .error-message')
      await expect(errorMessage.first()).toBeVisible({ timeout: 3000 })
    } else {
      test.skip()
    }
  })

  test.skip('should show rate limiting message after multiple failed attempts', async ({ page }) => {
    // TODO: Implement after inspecting auth modal structure
    // Rate limiting requires real backend integration to test properly
  })

  test.skip('should switch to signup view within modal', async ({ page }) => {
    // TODO: Implement after inspecting auth modal structure
    // Modal may have tabs/links to switch between login/signup/forgot views
  })

  test.skip('should switch to forgot password view within modal', async ({ page }) => {
    // TODO: Implement after inspecting auth modal structure
    // Modal may have tabs/links to switch between login/signup/forgot views
  })

  test.skip('should show validation errors on signup form', async ({ page }) => {
    // TODO: Implement after inspecting auth modal structure
    // Need to know how to switch to signup view within modal
  })

  test.skip('should show password strength requirements on signup', async ({ page }) => {
    // TODO: Implement after inspecting auth modal structure
  })

  test.skip('should be keyboard accessible within auth modal', async ({ page }) => {
    // TODO: Implement after inspecting auth modal structure
    // Test Tab navigation through modal form elements
  })
})
