// Diagnose photo-frame size difference: untransformed box, transform, img state.
import { chromium } from '@playwright/test';
import { resolve } from 'path';

const PREVIEW_URL = 'file:///' + resolve(import.meta.dirname, '..', '..', 'preview-magical.html').replace(/\\/g, '/');
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

const measure = () => {
    const frame = document.querySelector('.photo-frame');
    const visual = document.querySelector('.hero-visual');
    const img = document.querySelector('.photo-frame img');
    const fc = getComputedStyle(frame);
    return {
        frameOffset: { w: frame.offsetWidth, h: frame.offsetHeight },
        frameTransform: fc.transform,
        frameMaxWidth: fc.maxWidth,
        visualOffset: { w: visual.offsetWidth, h: visual.offsetHeight },
        visualTransform: getComputedStyle(visual).transform,
        img: {
            src: img.currentSrc.split('/').slice(-1)[0],
            complete: img.complete,
            natural: { w: img.naturalWidth, h: img.naturalHeight },
            rendered: { w: img.offsetWidth, h: img.offsetHeight }
        }
    };
};

const out = {};
for (const [name, url] of [['preview', PREVIEW_URL], ['live', 'http://localhost:5178/']]) {
    await page.goto(url, { waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForTimeout(3500);
    out[name] = await page.evaluate(measure);
}
console.log(JSON.stringify(out, null, 1));
await browser.close();
