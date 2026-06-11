// Phase 4 verification: hero (gradient, blur, padding, title size/wrap, accent,
// washi shadow, wrapper), sanctuary/episode section chrome, social proof header.
import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto('http://localhost:5178/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3500);

const result = await page.evaluate(() => {
    const c = sel => {
        const el = document.querySelector(sel);
        return el ? getComputedStyle(el) : null;
    };
    const hero = c('.hero');
    const title = document.querySelector('.hero-title');
    const titleCs = getComputedStyle(title);
    const titleRect = title.getBoundingClientRect();
    const accent = c('.hero-script-accent');
    const washi = c('.washi-tape');
    const wrapper = c('.hero-wrapper');
    const sanctuary = c('.recipe-sanctuary');
    const sanctuaryHeader = c('.sanctuary-header');
    const episode = c('.latest-episode-section');
    const spHeader = c('.social-proof-section .section__header');
    const spTitle = c('.social-proof-section .section__title');
    // Title line count: rect height / line-height
    const lineCount = Math.round(titleRect.height / parseFloat(titleCs.lineHeight));
    return {
        hero: {
            backgroundImage: hero.backgroundImage,
            backdropFilter: hero.backdropFilter,
            padding: hero.padding,
            marginBottom: hero.marginBottom,
            maxWidth: hero.maxWidth
        },
        title: { fontSize: titleCs.fontSize, lines: lineCount, heightPx: Math.round(titleRect.height) },
        accent: { display: accent.display, margin: accent.margin },
        washiFilter: washi ? washi.filter : 'no .washi-tape found',
        heroWrapper: wrapper ? { position: wrapper.position } : 'MISSING',
        photoFrameMaxWidth: c('.photo-frame')?.maxWidth,
        sanctuary: {
            background: sanctuary.backgroundColor,
            backdropFilter: sanctuary.backdropFilter,
            headerMarginBottom: sanctuaryHeader.marginBottom
        },
        episodeSection: {
            background: episode.backgroundColor,
            backdropFilter: episode.backdropFilter
        },
        socialProofHeader: spHeader ? {
            display: spHeader.display,
            textAlign: spHeader.textAlign,
            borderBottom: `${spHeader.borderBottomWidth} ${spHeader.borderBottomStyle}`,
            marginBottom: spHeader.marginBottom,
            titleFont: spTitle.fontFamily.split(',')[0],
            titleSize: spTitle.fontSize,
            titleMarginBottom: spTitle.marginBottom
        } : 'not rendered (loading?)'
    };
});
console.log(JSON.stringify(result, null, 1));
await browser.close();
