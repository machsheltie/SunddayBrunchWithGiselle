// Phase 5 verification: washi tapes, featured meta, episode card geometry,
// newsletter chrome+copy, portals (thumbs/counts), gallery books, S2 margin.
import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto('http://localhost:5178/', { waitUntil: 'networkidle' });
await page.waitForTimeout(4000);

const result = await page.evaluate(() => {
    const c = el => (el ? getComputedStyle(el) : null);
    const q = sel => document.querySelector(sel);
    const washi = sel => {
        const s = c(q(sel));
        return s ? { top: s.top, transform: s.transform, w: s.width, h: s.height, filter: s.filter } : 'MISSING';
    };
    const epCard = q('.featured-episode-card');
    const epStyle = c(epCard);
    const epContent = c(q('.episode-content'));
    const epDate = c(q('.episode-date'));
    const epP = c(q('.episode-content p:not(.episode-date)'));
    const audio = q('.audio-icon-container');
    const cta = q('.cta.newsletter');
    const ctaStyle = c(cta);
    const portals = [...document.querySelectorAll('.collection-portal')].map(p => ({
        title: p.querySelector('.portal-title')?.textContent,
        thumbs: p.querySelectorAll('.preview-thumb').length,
        imgThumbs: p.querySelectorAll('.preview-thumb img').length,
        count: p.querySelector('.portal-count span')?.textContent.trim()
    }));
    const books = [...document.querySelectorAll('.library-book')].map(b => ({
        title: b.querySelector('.book-title')?.textContent,
        meta: b.querySelector('.book-meta')?.textContent
    }));
    const crystalCount = q('.crystal-rating-count');
    return {
        sanctuaryHeaderMargin: c(q('.sanctuary-header')).marginBottom,
        recipeWashi: washi('.featured-recipe-card .card-washi-top'),
        episodeWashi: washi('.featured-episode-card .card-washi-top'),
        featuredMeta: q('.featured-recipe-card .featured-meta')?.textContent.trim() || 'MISSING',
        crystalCountColor: crystalCount ? c(crystalCount).color : 'no ratings rendered',
        episodeCard: {
            marginBottom: epStyle.marginBottom,
            maxWidth: epStyle.maxWidth,
            margin: epStyle.margin
        },
        audioIcon: audio ? `${audio.offsetWidth}x${audio.offsetHeight}` : 'MISSING',
        episodeContent: { gap: epContent.gap, justify: epContent.justifyContent },
        episodeDate: { fontStyle: epDate.fontStyle, fontSize: epDate.fontSize, margin: epDate.margin },
        episodeP: epP ? { fontSize: epP.fontSize, lineHeight: epP.lineHeight } : 'MISSING',
        newsletter: cta ? {
            background: ctaStyle.backgroundColor,
            border: `${ctaStyle.borderTopWidth} ${ctaStyle.borderTopStyle} ${ctaStyle.borderTopColor}`,
            radius: ctaStyle.borderRadius,
            padding: ctaStyle.padding,
            subcopy: cta.querySelector('.cta__subcopy')?.textContent,
            placeholder: cta.querySelector('input')?.placeholder,
            button: cta.querySelector('button')?.textContent.trim(),
            size: `${cta.offsetWidth}x${cta.offsetHeight}`
        } : 'MISSING',
        portals,
        bookCount: books.length,
        firstBooks: books.slice(0, 3)
    };
});
console.log(JSON.stringify(result, null, 1));
await browser.close();
