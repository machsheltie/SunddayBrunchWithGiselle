// Phase 6 ambient verification: whimsy paws/blobs, floating cluster, sheltie artwork.
import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto('http://localhost:5178/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
await page.evaluate(() => window.scrollTo(0, 800));
await page.waitForTimeout(600);

const result = await page.evaluate(() => {
    const c = el => getComputedStyle(el);
    const paw = document.querySelector('.whimsy-paw');
    const pawSvgEllipses = paw.querySelectorAll('svg ellipse').length;
    const pawSvgPaths = paw.querySelectorAll('svg path').length;
    const blobs = [...document.querySelectorAll('.whimsy-blob')].map(b => ({
        size: `${b.style.width}`,
        bg: b.style.background
    }));
    const btns = [...document.querySelectorAll('.floating-btn')].map(b => {
        const svg = b.querySelector('svg');
        return {
            cls: b.className,
            labelDivs: b.querySelectorAll('.btn-label').length,
            svgSize: svg ? `${Math.round(svg.getBoundingClientRect().width)}px` : null,
            size: `${b.offsetWidth}x${b.offsetHeight}`,
            radius: c(b).borderRadius
        };
    });
    return {
        pawCount: document.querySelectorAll('.whimsy-paw').length,
        pawArt: { ellipses: pawSvgEllipses, paths: pawSvgPaths },
        pawAnimation: c(paw).animationName + ' ' + c(paw).animationDuration,
        pawOpacity: c(paw).opacity,
        blobCount: blobs.length,
        blobs,
        blobAnimation: c(document.querySelector('.whimsy-blob')).animationName + ' ' + c(document.querySelector('.whimsy-blob')).animationDuration,
        floatingButtons: btns,
        floatingVisible: c(document.querySelector('.floating-actions')).opacity
    };
});
console.log(JSON.stringify(result, null, 1));
await browser.close();
