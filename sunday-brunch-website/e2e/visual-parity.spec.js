import { test, expect } from '@playwright/test'

/**
 * Visual regression spec pinning the preview-magical.html parity state
 * (Phases 1-6 of parity-review/PIXEL_PARITY_AUDIT.md).
 *
 * Nondeterministic layers are masked: the WebGL watercolor shader, the
 * randomly-positioned whimsy paws/blobs, grain, sheltie walks, and the
 * paw follower all vary frame to frame and would make pixel comparison
 * meaningless. CSS animations are frozen by Playwright; GSAP/JS-driven
 * motion is what the masks are for.
 *
 * To regenerate baselines after an intentional design change:
 *   npx playwright test e2e/visual-parity.spec.js --update-snapshots
 */

const VIEWPORT = { width: 1440, height: 900 }

const ambientMasks = (page) => [
    page.locator('.watercolor-canvas'),
    page.locator('.grain-overlay'),
    page.locator('.whimsy-layer'),
    page.locator('.sheltie-sightings'),
    page.locator('.paw-follower-layer, [class*="paw-follower"]'),
]

const SCREENSHOT_OPTS = { animations: 'disabled', maxDiffPixelRatio: 0.02 }

async function settle(page) {
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
    await page.waitForLoadState('networkidle')
    // Let entrance animations (slideInLeft/scaleRotate, 1.5s worst case) finish
    await page.waitForTimeout(2000)
}

test.describe('Pixel parity - homepage sections', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize(VIEWPORT)
        await settle(page)
    })

    test('header', async ({ page }) => {
        await expect(page.locator('.header')).toHaveScreenshot('header.png', SCREENSHOT_OPTS)
    })

    test('hero', async ({ page }) => {
        await expect(page.locator('.hero-wrapper')).toHaveScreenshot('hero.png', {
            ...SCREENSHOT_OPTS,
            mask: ambientMasks(page),
        })
    })

    test('recipe sanctuary', async ({ page }) => {
        await expect(page.locator('.recipe-sanctuary')).toHaveScreenshot('recipe-sanctuary.png', {
            ...SCREENSHOT_OPTS,
            mask: ambientMasks(page),
        })
    })

    test('latest episode section with newsletter', async ({ page }) => {
        await expect(page.locator('.latest-episode-section')).toHaveScreenshot('latest-episode.png', {
            ...SCREENSHOT_OPTS,
            mask: ambientMasks(page),
        })
    })

    test('social proof section', async ({ page }) => {
        await expect(page.locator('.social-proof-section')).toHaveScreenshot('social-proof.png', {
            ...SCREENSHOT_OPTS,
            mask: [
                ...ambientMasks(page),
                // Carousel auto-rotates every 5s; its slide content is not the
                // chrome under test
                page.locator('.testimonial-carousel__container'),
            ],
        })
    })

    test('footer', async ({ page }) => {
        await expect(page.locator('footer.footer')).toHaveScreenshot('footer.png', SCREENSHOT_OPTS)
    })
})

test.describe('Pixel parity - expanded states', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize(VIEWPORT)
        await settle(page)
    })

    test('expanded recipe keeps card chrome and preview language', async ({ page }) => {
        await page.getByRole('button', { name: /view full recipe/i }).click()
        await page.waitForTimeout(1200)
        await expect(page.locator('.featured-recipe-card')).toHaveScreenshot('expanded-recipe.png', {
            ...SCREENSHOT_OPTS,
            mask: ambientMasks(page),
        })
    })

    test('expanded episode keeps card chrome and preview language', async ({ page }) => {
        await page.getByRole('button', { name: /listen now/i }).click()
        await page.waitForTimeout(1200)
        await expect(page.locator('.featured-episode-card')).toHaveScreenshot('expanded-episode.png', {
            ...SCREENSHOT_OPTS,
            mask: ambientMasks(page),
        })
    })
})
