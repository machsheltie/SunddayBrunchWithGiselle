// Phase 3 verification: header (shadow, divider opacity, nav pill heights)
// and footer (background, blur, border, padding, pawprint rail, copyright).
import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto('http://localhost:5178/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

const result = await page.evaluate(() => {
    const c = sel => {
        const el = document.querySelector(sel);
        return el ? getComputedStyle(el) : null;
    };
    const header = c('.header');
    const divider = c('.header .brand-divider');
    const navPills = [...document.querySelectorAll('.nav-buttons .nav-button')].map(el => ({
        tag: el.tagName,
        text: el.textContent.trim(),
        h: Math.round(el.getBoundingClientRect().height * 10) / 10
    }));
    const footer = c('footer.footer') || c('.footer');
    const rail = c('.footer-pawprints');
    const copyright = c('.footer p');
    const firstPaw = document.querySelector('.footer-pawprints svg');
    return {
        headerBoxShadow: header.boxShadow,
        dividerOpacity: divider.opacity,
        navPills,
        footer: {
            backgroundImage: footer.backgroundImage.slice(0, 110),
            backdropFilter: footer.backdropFilter,
            borderTop: `${footer.borderTopWidth} ${footer.borderTopStyle} ${footer.borderTopColor}`,
            padding: footer.padding,
            marginTop: footer.marginTop,
            beforePseudo: getComputedStyle(document.querySelector('.footer'), '::before').content
        },
        pawRail: { display: rail.display, gap: rail.gap, marginBottom: rail.marginBottom },
        pawFill: firstPaw ? firstPaw.getAttribute('fill') : null,
        copyright: { color: copyright.color, fontSize: copyright.fontSize }
    };
});
console.log(JSON.stringify(result, null, 1));
await browser.close();
