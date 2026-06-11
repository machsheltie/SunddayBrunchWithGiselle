// Probe newsletter form flex behavior and portal inner geometry, live vs preview.
import { chromium } from '@playwright/test';
import { resolve } from 'path';

const PREVIEW_URL = 'file:///' + resolve(import.meta.dirname, '..', '..', 'preview-magical.html').replace(/\\/g, '/');
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

const probe = (formSel) => {
    const form = document.querySelector(formSel);
    const input = form.querySelector('input');
    const fc = getComputedStyle(form);
    const ic = getComputedStyle(input);
    const portal = document.querySelector('.collection-portal');
    const header = portal.querySelector('.portal-header');
    const content = portal.querySelector('.portal-content') || portal;
    const r = el => el ? Math.round(el.getBoundingClientRect().height) : null;
    const btn = form.querySelector('button');
    return {
        form: { w: Math.round(form.getBoundingClientRect().width), display: fc.display, maxWidth: fc.maxWidth, gap: fc.gap },
        formChildren: [...form.children].map(ch => `${ch.tagName}.${ch.className}`.slice(0, 60)),
        input: { flex: ic.flex, lineHeight: ic.lineHeight, padding: ic.padding, fontSize: ic.fontSize },
        button: btn ? { h: Math.round(btn.getBoundingClientRect().height), lineHeight: getComputedStyle(btn).lineHeight, padding: getComputedStyle(btn).padding, display: getComputedStyle(btn).display } : null,
        portal: {
            padding: getComputedStyle(content).padding,
            headerH: r(header),
            headerMarginBottom: getComputedStyle(header).marginBottom,
            previewH: r(portal.querySelector('.portal-preview')),
            previewMarginTop: getComputedStyle(portal.querySelector('.portal-preview')).marginTop,
            countH: r(portal.querySelector('.portal-count')),
            titleH: r(portal.querySelector('.portal-title')),
            subtitleH: r(portal.querySelector('.portal-subtitle')),
            iconH: r(portal.querySelector('.portal-icon')),
            portalBorder: getComputedStyle(portal).borderTopWidth
        }
    };
};

const out = {};
for (const [name, url, sel] of [
    ['preview', PREVIEW_URL, '.newsletter-input-group'],
    ['live', 'http://localhost:5178/', '.cta__form']
]) {
    await page.goto(url, { waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForTimeout(4000);
    out[name] = await page.evaluate(probe, sel);
}
console.log(JSON.stringify(out, null, 1));
await browser.close();
