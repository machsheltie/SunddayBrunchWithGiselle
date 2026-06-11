// Phase 1 verification: grain overlay must have a real SVG noise background-image.
import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto('http://localhost:5178/', { waitUntil: 'networkidle' });
await page.waitForTimeout(4000); // let the lazy Three.js chunk (whose CSS previously broke this) load

const result = await page.evaluate(() => {
    const el = document.querySelector('.grain-overlay');
    if (!el) return { found: false };
    const c = getComputedStyle(el);
    return {
        found: true,
        backgroundImage: c.backgroundImage.slice(0, 80),
        opacity: c.opacity,
        mixBlendMode: c.mixBlendMode,
        zIndex: c.zIndex
    };
});
console.log(JSON.stringify(result, null, 1));
await browser.close();
