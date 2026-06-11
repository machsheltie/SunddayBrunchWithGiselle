// Compare hero geometry between preview-magical.html and live at 1440x900.
import { chromium } from '@playwright/test';
import { resolve } from 'path';

const PREVIEW_URL = 'file:///' + resolve(import.meta.dirname, '..', '..', 'preview-magical.html').replace(/\\/g, '/');
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

const measure = () => {
    const r = sel => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return { w: Math.round(b.width), h: Math.round(b.height) };
    };
    return {
        hero: r('.hero'),
        title: r('.hero-title'),
        photoFrame: r('.photo-frame'),
        sanctuary: r('.recipe-sanctuary')
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
