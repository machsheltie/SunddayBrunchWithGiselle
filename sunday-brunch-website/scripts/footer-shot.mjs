// Capture footer area of both preview and live for side-by-side review.
import { chromium } from '@playwright/test';
import { resolve } from 'path';

const OUT = resolve(import.meta.dirname, '..', '..', 'parity-review', 'shots');
const PREVIEW_URL = 'file:///' + resolve(import.meta.dirname, '..', '..', 'preview-magical.html').replace(/\\/g, '/');

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

for (const [name, url] of [['live', 'http://localhost:5178/'], ['preview', PREVIEW_URL]]) {
    await page.goto(url, { waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForTimeout(3000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/${name}-footer.png` });
}
await browser.close();
console.log('footer shots saved');
