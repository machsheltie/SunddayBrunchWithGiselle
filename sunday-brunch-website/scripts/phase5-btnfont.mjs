// Inspect the newsletter Subscribe button font in preview vs live.
import { chromium } from '@playwright/test';
import { resolve } from 'path';

const PREVIEW_URL = 'file:///' + resolve(import.meta.dirname, '..', '..', 'preview-magical.html').replace(/\\/g, '/');
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

const probe = (sel) => {
    const btn = document.querySelector(sel);
    const span = btn.querySelector('span') || btn;
    const bc = getComputedStyle(btn);
    const sc = getComputedStyle(span);
    return {
        text: btn.textContent.trim(),
        btnFont: `${bc.fontFamily.split(',')[0]} ${bc.fontSize} w${bc.fontWeight}`,
        spanFont: `${sc.fontFamily.split(',')[0]} ${sc.fontSize} w${sc.fontWeight}`,
        spanDisplay: sc.display,
        btnW: Math.round(btn.getBoundingClientRect().width),
        spanW: Math.round(span.getBoundingClientRect().width),
        btnFlex: bc.flex,
        btnWidth: bc.width,
        btnMinWidth: bc.minWidth,
        btnMaxWidth: bc.maxWidth,
        btnBoxSizing: bc.boxSizing,
        btnOverflow: bc.overflow,
        btnWhiteSpace: bc.whiteSpace,
        scrollW: btn.scrollWidth,
        fontsReady: document.fonts.check('1.6rem "Pinyon Script"')
    };
};

const out = {};
for (const [name, url, sel] of [
    ['preview', PREVIEW_URL, '.newsletter-input-group button'],
    ['live', 'http://localhost:5178/', '.cta__form button']
]) {
    await page.goto(url, { waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForTimeout(4000);
    out[name] = await page.evaluate(probe, sel);
}
console.log(JSON.stringify(out, null, 1));
await browser.close();
