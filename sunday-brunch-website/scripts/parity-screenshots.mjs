// Pixel-parity screenshot harness: captures preview-magical.html and live site
// at matching viewports for section-by-section comparison.
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
import { resolve } from 'path';

const OUT = resolve(import.meta.dirname, '..', '..', 'parity-review', 'shots');
mkdirSync(OUT, { recursive: true });

const PREVIEW_URL = 'file:///' + resolve(import.meta.dirname, '..', '..', 'preview-magical.html').replace(/\\/g, '/');
const LIVE_URL = 'http://localhost:5178/';

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 375, height: 812 },
];

async function capture(page, urlName, vpName) {
  // Full page
  await page.screenshot({ path: `${OUT}/${urlName}-${vpName}-full.png`, fullPage: true });
  // Viewport-sized slices while scrolling
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  const vh = page.viewportSize().height;
  let i = 0;
  for (let y = 0; y < totalHeight && i < 12; y += vh, i++) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/${urlName}-${vpName}-scroll${String(i).padStart(2, '0')}.png` });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
}

const browser = await chromium.launch();
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();

  // Preview
  await page.goto(PREVIEW_URL, { waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(2500); // let animations settle / entrance animations complete
  await capture(page, 'preview', vp.name);

  // Live
  await page.goto(LIVE_URL, { waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(3000);
  await capture(page, 'live', vp.name);

  await ctx.close();
}
await browser.close();
console.log('Screenshots saved to', OUT);
