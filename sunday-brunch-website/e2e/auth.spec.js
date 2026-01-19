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

  test('should navigate to login page when clicking login', async ({ page }) => {
    // Find and click login button
    const loginButton = page.getByRole('link', { name: /log in|login|sign in/i }).or(
      page.getByRole('button', { name: /log in|login|sign in/i })
    )
    await loginButton.click()

    // Verify navigation to login page (or login modal appears)
    const emailInput = page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i))
    await expect(emailInput).toBeVisible({ timeout: 5000 })
  })

  test('should show validation error for empty login form', async ({ page }) => {
    // Navigate to login page
    const loginButton = page.getByRole('link', { name: /log in|login|sign in/i }).first()
    await loginButton.click()

    // Wait for form to appear
    await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 5000 })

    // Try to submit empty form
    const submitButton = page.getByRole('button', { name: /log in|login|sign in|submit/i })
    await submitButton.click()

    // Should show validation errors
    const errorMessage = page.locator('.error, [role="alert"], .error-message, [data-testid="error"]')
    await expect(errorMessage.first()).toBeVisible({ timeout: 3000 })
  })

  test('should show validation error for invalid email format', async ({ page }) => {
    // Navigate to login page
    const loginButton = page.getByRole('link', { name: /log in|login|sign in/i }).first()
    await loginButton.click()

    // Wait for form
    const emailInput = page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i))
    await emailInput.fill('invalid-email')

    // Fill password
    const passwordInput = page.getByLabel(/password/i).or(page.getByPlaceholder(/password/i)).first()
    await passwordInput.fill('password123')

    // Submit form
    const submitButton = page.getByRole('button', { name: /log in|login|sign in|submit/i })
    await submitButton.click()

    // Should show email validation error
    const errorMessage = page.locator('.error, [role="alert"], .error-message')
    await expect(errorMessage.first()).toBeVisible({ timeout: 3000 })
  })

  test('should show rate limiting message after multiple failed attempts', async ({ page }) => {
    // Navigate to login page
    const loginButton = page.getByRole('link', { name: /log in|login|sign in/i }).first()
    await loginButton.click()

    // Wait for form
    await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 5000 })

    // Attempt login 6 times with invalid credentials
    for (let i = 0; i < 6; i++) {
      const emailInput = page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i))
      const passwordInput = page.getByLabel(/password/i).or(page.getByPlaceholder(/password/i)).first()
      const submitButton = page.getByRole('button', { name: /log in|login|sign in|submit/i })

      await emailInput.fill(`test${i}@example.com`)
      await passwordInput.fill('wrongpassword')
      await submitButton.click()

      // Wait a bit between attempts
      await page.waitForTimeout(500)
    }

    // After 5+ attempts, should show rate limit message
    const rateLimitMessage = page.getByText(/too many attempts/i)
    await expect(rateLimitMessage).toBeVisible({ timeout: 3000 })
  })

  test('should navigate to signup page from login page', async ({ page }) => {
    // Navigate to login page
    const loginButton = page.getByRole('link', { name: /log in|login|sign in/i }).first()
    await loginButton.click()

    // Wait for login form
    await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 5000 })

    // Find signup link (usually says "Don't have an account? Sign up" or similar)
    const signupLink = page.getByRole('link', { name: /sign up|create account|register/i })
    await signupLink.click()

    // Verify navigation to signup page
    await expect(page).toHaveURL(/signup|register|create-account/i)
  })

  test('should navigate to forgot password page from login page', async ({ page }) => {
    // Navigate to login page
    const loginButton = page.getByRole('link', { name: /log in|login|sign in/i }).first()
    await loginButton.click()

    // Wait for login form
    await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 5000 })

    // Find forgot password link
    const forgotPasswordLink = page.getByRole('link', { name: /forgot password|reset password/i })
    await forgotPasswordLink.click()

    // Verify navigation to forgot password page
    await expect(page).toHaveURL(/forgot-password|reset-password/i)
  })

  test('should show validation errors on signup form', async ({ page }) => {
    // Navigate to signup page
    const loginButton = page.getByRole('link', { name: /log in|login|sign in/i }).first()
    await loginButton.click()

    await page.waitForTimeout(1000)

    const signupLink = page.getByRole('link', { name: /sign up|create account|register/i })
    await signupLink.click()

    // Wait for signup form
    await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 5000 })

    // Try to submit empty form
    const submitButton = page.getByRole('button', { name: /sign up|create account|register|submit/i })
    await submitButton.click()

    // Should show validation errors
    const errorMessages = page.locator('.error, [role="alert"], .error-message')
    await expect(errorMessages.first()).toBeVisible({ timeout: 3000 })
  })

  test('should show password strength requirements on signup', async ({ page }) => {
    // Navigate to signup page
    const loginButton = page.getByRole('link', { name: /log in|login|sign in/i }).first()
    await loginButton.click()

    await page.waitForTimeout(1000)

    const signupLink = page.getByRole('link', { name: /sign up|create account|register/i })
    await signupLink.click()

    // Wait for signup form
    await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 5000 })

    // Fill form with weak password
    const emailInput = page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i))
    const passwordInput = page.getByLabel(/^password/i).or(page.getByPlaceholder(/^password/i)).first()

    await emailInput.fill('test@example.com')
    await passwordInput.fill('123')

    // Should show password requirements or error
    const passwordError = page.getByText(/password.*6|at least 6 characters|password.*too short/i)
    await expect(passwordError).toBeVisible({ timeout: 3000 })
  })

  test('should be keyboard accessible', async ({ page }) => {
    // Navigate to login page
    const loginButton = page.getByRole('link', { name: /log in|login|sign in/i }).first()
    await loginButton.click()

    // Wait for form
    await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 5000 })

    // Tab through form elements
    await page.keyboard.press('Tab')
    const emailInput = page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i))
    await expect(emailInput).toBeFocused()

    await page.keyboard.press('Tab')
    const passwordInput = page.getByLabel(/password/i).or(page.getByPlaceholder(/password/i)).first()
    await expect(passwordInput).toBeFocused()

    await page.keyboard.press('Tab')
    const submitButton = page.getByRole('button', { name: /log in|login|sign in|submit/i })
    await expect(submitButton).toBeFocused()
  })
})
