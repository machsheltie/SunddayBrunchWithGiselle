// Diagnose why .floating-actions.is-visible computes opacity 0.
import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto('http://localhost:5178/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
await page.mouse.wheel(0, 1200);
await page.waitForTimeout(1000);

const result = await page.evaluate(() => {
    const el = document.querySelector('.floating-actions');
    const rules = [];
    for (const sheet of document.styleSheets) {
        let list;
        try { list = sheet.cssRules; } catch { continue; }
        for (const r of list) {
            if (r.selectorText && r.selectorText.includes('floating-actions')) {
                rules.push(`${r.selectorText} { ${r.style.cssText.slice(0, 120)} }`);
            }
        }
    }
    let visRule = null;
    for (const sheet of document.styleSheets) {
        let list;
        try { list = sheet.cssRules; } catch { continue; }
        for (const r of list) {
            if (r.selectorText === '.floating-actions.is-visible') {
                visRule = {
                    parentRule: r.parentRule ? r.parentRule.cssText.slice(0, 80) : null,
                    sheetMedia: sheet.media.mediaText,
                    sheetNode: sheet.ownerNode ? sheet.ownerNode.tagName + ' ' + (sheet.ownerNode.dataset?.viteDevId || '') : null
                };
            }
        }
    }
    const anims = el.getAnimations({ subtree: false }).map(a => ({
        type: a.constructor.name,
        state: a.playState,
        currentTime: a.currentTime,
        startTime: a.startTime,
        timelineTime: document.timeline.currentTime
    }));
    return {
        animations: anims,
        className: el.className,
        matchesVis: el.matches('.floating-actions.is-visible'),
        inlineStyle: el.getAttribute('style'),
        computedOpacity: getComputedStyle(el).opacity,
        computedTransform: getComputedStyle(el).transform,
        visRule,
        matchedRules: rules
    };
});
console.log(JSON.stringify(result, null, 1));
await browser.close();
