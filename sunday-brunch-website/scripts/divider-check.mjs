// Phase 1 verification: confirm .hero-content-divider renders the preview gradient.
import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto('http://localhost:5178/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

const el = page.locator('.hero-content-divider');
const box = await el.boundingBox();
const styles = await el.evaluate(e => {
    const c = getComputedStyle(e);
    return { height: c.height, backgroundImage: c.backgroundImage.slice(0, 160), margin: c.margin, opacity: c.opacity };
});
console.log('divider box:', JSON.stringify(box));
console.log('divider styles:', JSON.stringify(styles, null, 1));

await page.evaluate(y => window.scrollTo(0, y), Math.max(0, box.y - 450));
await page.waitForTimeout(600);
await page.screenshot({ path: '../parity-review/shots/live-divider-closeup.png' });
await browser.close();
