// Phase 6 expanded-state verification: click both cards open and measure
// the hybrid chrome against preview language.
import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto('http://localhost:5178/', { waitUntil: 'networkidle' });
await page.waitForTimeout(4000);

// --- Expanded recipe ---
await page.getByRole('button', { name: /view full recipe/i }).click();
await page.waitForTimeout(1500);
await page.screenshot();

const recipe = await page.evaluate(() => {
    const c = el => (el ? getComputedStyle(el) : null);
    const card = document.querySelector('.featured-recipe-card');
    const exp = document.querySelector('.featured-recipe-expansion');
    const expStyle = c(exp);
    const grid = c(document.querySelector('.recipe__main-grid'));
    const stepNum = document.querySelector('.process-step__number');
    const badge = document.querySelector('.dietary-badge, [class*="dietary"] [class*="badge"], [class*="dietary-badges"] > *');
    const panel = document.querySelector('.recipe-card-panel');
    const tipAvatar = document.querySelector('.sheltie-tip img, [class*="sheltie-tip"] img');
    return {
        cardStillMounted: !!card,
        washiPresent: !!card?.querySelector('.card-washi-top'),
        viewButtonGone: ![...card.querySelectorAll('button')].some(b => /view full recipe/i.test(b.textContent)),
        seam: exp ? {
            borderTop: `${expStyle.borderTopWidth} ${expStyle.borderTopStyle} ${expStyle.borderTopColor}`,
            background: expStyle.backgroundColor,
            padding: expStyle.padding
        } : 'MISSING',
        mainGrid: grid ? grid.gridTemplateColumns : 'not found',
        stepCircle: stepNum ? {
            size: `${stepNum.offsetWidth}x${stepNum.offsetHeight}`,
            background: c(stepNum).backgroundImage.slice(0, 60),
            radius: c(stepNum).borderRadius
        } : 'MISSING',
        panel: panel ? {
            bg: c(panel).backgroundColor,
            radius: c(panel).borderRadius,
            border: `${c(panel).borderTopWidth} ${c(panel).borderTopColor}`
        } : 'not found',
        dietaryBadge: badge ? { bg: c(badge).backgroundColor, radius: c(badge).borderRadius, fontSize: c(badge).fontSize } : 'not found',
        tipAvatar: tipAvatar ? { src: tipAvatar.src.split('/').pop(), size: `${tipAvatar.offsetWidth}x${tipAvatar.offsetHeight}`, radius: c(tipAvatar).borderRadius } : 'not found',
        calculatorPresent: !!document.querySelector('[class*="calculator"], [class*="alchemist"]'),
        guestbookPresent: !!document.querySelector('[class*="guestbook"]')
    };
});

// Collapse recipe, then expand episode
await page.getByRole('button', { name: /collapse recipe/i }).click();
await page.waitForTimeout(800);
await page.getByRole('button', { name: /listen now/i }).click();
await page.waitForTimeout(1500);
await page.screenshot();

const episode = await page.evaluate(() => {
    const c = el => (el ? getComputedStyle(el) : null);
    const card = document.querySelector('.featured-episode-card');
    const exp = card?.querySelector('[class*="expansion"]');
    const expStyle = c(exp);
    const header = exp?.querySelector('h3');
    const headerSub = header?.nextElementSibling;
    const whisperImg = exp ? [...exp.querySelectorAll('img')].find(i => i.src.includes('giselle')) : null;
    const cols = exp?.querySelector('[class*="columns"], [class*="grid"]');
    const mintCard = exp ? [...exp.querySelectorAll('a')].find(a => a.href.includes('/episodes/')) : null;
    const player = exp?.querySelector('[class*="player"]');
    return {
        cardStillMounted: !!card,
        washiPresent: !!card?.querySelector('.card-washi-top'),
        listenGone: ![...card.querySelectorAll('button')].some(b => /listen now/i.test(b.textContent)),
        seam: exp ? {
            borderTop: `${expStyle.borderTopWidth} ${expStyle.borderTopStyle} ${expStyle.borderTopColor}`,
            background: expStyle.backgroundColor,
            padding: expStyle.padding
        } : 'MISSING',
        header: header ? { text: header.textContent.slice(0, 50), fontSize: c(header).fontSize, family: c(header).fontFamily.split(',')[0], align: c(header).textAlign } : 'MISSING',
        headerSub: headerSub ? headerSub.textContent.trim() : 'MISSING',
        whisperAvatar: whisperImg ? `${whisperImg.offsetWidth}x${whisperImg.offsetHeight}` : 'MISSING',
        whisperHasPhaedraJoke: exp ? exp.textContent.includes('Phaedra tried to lick the microphone') : false,
        bodyGrid: cols ? c(cols).gridTemplateColumns : 'not found',
        chapterNoteCount: exp ? exp.querySelectorAll('ul li').length : 0,
        relatedEpisodeCards: exp ? [...exp.querySelectorAll('a')].filter(a => a.href.includes('/episodes/')).length : 0,
        mintCardBg: mintCard ? c(mintCard).backgroundColor : 'MISSING',
        playerPresent: !!player,
        soundboardPresent: !!document.querySelector('[class*="soundboard"]')
    };
});

console.log(JSON.stringify({ recipe, episode }, null, 1));
await browser.close();
