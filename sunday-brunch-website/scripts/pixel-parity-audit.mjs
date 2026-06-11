import { chromium } from '@playwright/test';

const PREVIEW = 'file:///C:/Users/heirr/OneDrive/Desktop/Hope2_Studio/SundayBrunchWithGiselle/preview-magical.html';
const LIVE = 'http://localhost:5178/';

const SELECTORS = [
  '.header',
  '.brand-title',
  '.brand-subtitle',
  '.nav-button',
  '.container',
  '.hero',
  '.hero-title',
  '.hero-subtitle',
  '.hero-quote',
  '.whimsical-button--primary',
  '.whimsical-button--secondary',
  '.photo-frame',
  '.photo-frame img',
  '.recipe-sanctuary',
  '.sanctuary-header h2',
  '.sanctuary-subtitle',
  '.featured-recipe-card',
  '.featured-recipe-grid',
  '.category-badge',
  '.featured-content h3',
  '.paw-divider',
  '.collections-grid',
  '.collection-portal',
  '.portal-title',
  '.portal-preview',
  '.recent-grid',
  '.library-book',
  '.recent-additions h3',
  '.browse-cta',
  '.latest-episode-section',
  '.section-title',
  '.featured-episode-card',
  '.episode-waveform',
  '.audio-icon-container',
  '.episode-content h3',
  '.episode-date',
  '.newsletter-form',
  '.newsletter-form h4',
  '.newsletter-input-group input',
  '.social-proof-section',
  'footer',
];

const PROPS = [
  'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing',
  'textTransform', 'textAlign', 'color', 'backgroundColor', 'backgroundImage',
  'borderRadius', 'borderTopWidth', 'borderTopStyle', 'borderTopColor', 'boxShadow',
  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'gap', 'gridTemplateColumns', 'display', 'position', 'zIndex', 'opacity',
  'transform', 'backdropFilter', 'mixBlendMode',
];

const TRUNCATE = { backgroundImage: 80, boxShadow: 80 };

async function extract(page, selectors, props, truncate) {
  return page.evaluate(({ selectors, props, truncate }) => {
    const out = {};
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (!el) { out[sel] = null; continue; }
      const cs = getComputedStyle(el);
      const rec = {};
      for (const p of props) {
        let v = cs[p];
        if (v === undefined || v === null) v = '';
        v = String(v);
        if (truncate[p] && v.length > truncate[p]) v = v.slice(0, truncate[p]) + '…';
        rec[p] = v;
      }
      const r = el.getBoundingClientRect();
      rec.boundingBox = {
        x: Math.round(r.x * 10) / 10,
        y: Math.round((r.y + window.scrollY) * 10) / 10,
        w: Math.round(r.width * 10) / 10,
        h: Math.round(r.height * 10) / 10,
      };
      out[sel] = rec;
    }
    out.__pageHeight = document.body.scrollHeight;
    return out;
  }, { selectors, props, truncate });
}

async function capture(browser, url) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(3200);
  const data = await extract(page, SELECTORS, PROPS, TRUNCATE);
  await page.close();
  return data;
}

function near(a, b, tol = 2) { return Math.abs(a - b) < tol; }

const browser = await chromium.launch();
const [preview, live] = [await capture(browser, PREVIEW), await capture(browser, LIVE)];
await browser.close();

console.log('='.repeat(78));
console.log('PIXEL PARITY DIFF REPORT  (preview-magical.html vs http://localhost:5178/)');
console.log('='.repeat(78));
console.log(`\nPAGE HEIGHT: preview=${preview.__pageHeight}px  live=${live.__pageHeight}px  delta=${live.__pageHeight - preview.__pageHeight}px\n`);

const missingPreview = [];
const missingLive = [];
let diffCount = 0;

for (const sel of SELECTORS) {
  const p = preview[sel];
  const l = live[sel];
  if (!p && !l) { console.log(`\n### ${sel}\n  MISSING ON BOTH PAGES`); missingPreview.push(sel); missingLive.push(sel); continue; }
  if (!p) { console.log(`\n### ${sel}\n  MISSING ON PREVIEW (present on live)`); missingPreview.push(sel); continue; }
  if (!l) { console.log(`\n### ${sel}\n  MISSING ON LIVE (present on preview)`); missingLive.push(sel); continue; }

  const lines = [];
  for (const prop of PROPS) {
    if (p[prop] !== l[prop]) {
      lines.push(`  ${prop.padEnd(22)} preview: ${p[prop]}\n  ${''.padEnd(22)} live:    ${l[prop]}`);
    }
  }
  const pb = p.boundingBox, lb = l.boundingBox;
  const bbDiffs = [];
  for (const k of ['x', 'y', 'w', 'h']) {
    if (!near(pb[k], lb[k])) bbDiffs.push(`${k}: ${pb[k]} -> ${lb[k]} (Δ${Math.round((lb[k] - pb[k]) * 10) / 10})`);
  }
  if (bbDiffs.length) {
    lines.push(`  ${'boundingBox'.padEnd(22)} ${bbDiffs.join('  |  ')}`);
  }
  if (lines.length) {
    diffCount += lines.length;
    console.log(`\n### ${sel}  (${lines.length} diffs)`);
    console.log(lines.join('\n'));
  } else {
    console.log(`\n### ${sel}  -- MATCH`);
  }
}

console.log('\n' + '='.repeat(78));
console.log(`SUMMARY: ${diffCount} property diffs; missing-on-preview: [${missingPreview.join(', ') || 'none'}]; missing-on-live: [${missingLive.join(', ') || 'none'}]`);
