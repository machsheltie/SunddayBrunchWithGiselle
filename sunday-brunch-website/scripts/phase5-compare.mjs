// Compare newsletter + card geometry between preview and live at 1440x900.
import { chromium } from '@playwright/test';
import { resolve } from 'path';

const PREVIEW_URL = 'file:///' + resolve(import.meta.dirname, '..', '..', 'preview-magical.html').replace(/\\/g, '/');
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

const measure = (newsletterSel) => {
    const r = sel => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return { w: Math.round(b.width), h: Math.round(b.height) };
    };
    const nl = document.querySelector(newsletterSel);
    return {
        newsletter: r(newsletterSel),
        heading: r(`${newsletterSel} h3`) || r(`${newsletterSel} h4`),
        sub: r(`${newsletterSel} p`),
        input: r(`${newsletterSel} input`),
        button: r(`${newsletterSel} button`),
        recipeCard: r('.featured-recipe-card'),
        episodeCard: r('.featured-episode-card'),
        portal: r('.collection-portal'),
        book: r('.library-book')
    };
};

const out = {};
for (const [name, url, sel] of [
    ['preview', PREVIEW_URL, '.newsletter-form'],
    ['live', 'http://localhost:5178/', '.cta.newsletter']
]) {
    await page.goto(url, { waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForTimeout(4500);
    out[name] = await page.evaluate(measure, sel);
}
console.log(JSON.stringify(out, null, 1));
await browser.close();
