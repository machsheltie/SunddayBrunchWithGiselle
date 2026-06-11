// Check floating-actions visibility after a real user scroll.
import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto('http://localhost:5178/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
await page.mouse.wheel(0, 1200);
await page.waitForTimeout(500);
// Headless stops compositing without a paint consumer; screenshots force frames
await page.screenshot();
await page.waitForTimeout(500);
await page.screenshot();

const result = await page.evaluate(() => ({
    pageYOffset: window.pageYOffset,
    fabOpacity: getComputedStyle(document.querySelector('.floating-actions')).opacity,
    fabClasses: document.querySelector('.floating-actions').className
}));
console.log(JSON.stringify(result));
await browser.close();
