// Phase 2 verification: line-height token, body gradient, button metrics,
// paw absence, section-title weight — measured on the live page.
import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto('http://localhost:5178/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3500);

const result = await page.evaluate(() => {
    const cs = (sel, props) => {
        const el = document.querySelector(sel);
        if (!el) return { missing: sel };
        const c = getComputedStyle(el);
        return Object.fromEntries(props.map(p => [p, c[p]]));
    };
    const btn = document.querySelector('.whimsical-button--primary');
    return {
        bodyLineHeight: cs('body', ['lineHeight']).lineHeight,
        bodyBackground: getComputedStyle(document.body).backgroundImage.slice(0, 100),
        heroQuoteLineHeight: cs('.hero-quote', ['lineHeight']).lineHeight,
        appLineHeight: cs('.app', ['lineHeight']).lineHeight,
        primaryButton: btn ? {
            lineHeight: getComputedStyle(btn).lineHeight,
            heightPx: btn.getBoundingClientRect().height,
            containsPawSvg: !!btn.querySelector('.whimsical-button__paw-container')
        } : 'missing',
        anyButtonWithPaw: document.querySelectorAll('.whimsical-button__paw-container').length,
        sectionTitleWeight: cs('.latest-episode-section .section-title', ['fontWeight']).fontWeight
    };
});
console.log(JSON.stringify(result, null, 1));
await browser.close();
