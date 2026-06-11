import { chromium } from '@playwright/test';

const PREVIEW = 'file:///C:/Users/heirr/OneDrive/Desktop/Hope2_Studio/SundayBrunchWithGiselle/preview-magical.html';
const LIVE = 'http://localhost:5178/';

// [label, previewSelector, liveSelector]
const PAIRS = [
  ['collections-grid', '.collections-grid', '.recipe-collections-grid'],
  ['portal-preview', '.portal-preview', '.portal-subtitle'],
  ['newsletter-form', '.newsletter-form', 'form.cta__form'],
  ['newsletter-form h4', '.newsletter-form h4', '.cta.newsletter h4, .cta.newsletter h3, .cta.newsletter h2'],
  ['newsletter input', '.newsletter-input-group input', '.cta__form input[type="email"]'],
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

async function grab(page, sel) {
  return page.evaluate(({ sel, PROPS, TRUNCATE }) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const cs = getComputedStyle(el);
    const rec = { tag: el.tagName, cls: el.className, text: (el.textContent || '').trim().slice(0, 60) };
    for (const p of PROPS) {
      let v = String(cs[p] ?? '');
      if (TRUNCATE[p] && v.length > TRUNCATE[p]) v = v.slice(0, TRUNCATE[p]) + '…';
      rec[p] = v;
    }
    const r = el.getBoundingClientRect();
    rec.boundingBox = { x: Math.round(r.x*10)/10, y: Math.round((r.y+window.scrollY)*10)/10, w: Math.round(r.width*10)/10, h: Math.round(r.height*10)/10 };
    return rec;
  }, { sel, PROPS, TRUNCATE });
}

const browser = await chromium.launch();
const pPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await pPage.goto(PREVIEW, { waitUntil: 'load' }); await pPage.waitForTimeout(3200);
const lPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await lPage.goto(LIVE, { waitUntil: 'load' }); await lPage.waitForTimeout(3200);

for (const [label, ps, ls] of PAIRS) {
  const a = await grab(pPage, ps);
  const b = await grab(lPage, ls);
  console.log(`\n### ${label}  (preview: ${ps}  |  live: ${ls})`);
  if (!a) { console.log('  MISSING ON PREVIEW'); continue; }
  if (!b) { console.log('  NO LIVE EQUIVALENT FOUND'); continue; }
  console.log(`  preview el: ${a.tag}.${a.cls} "${a.text}"`);
  console.log(`  live el:    ${b.tag}.${b.cls} "${b.text}"`);
  let any = false;
  for (const prop of PROPS) {
    if (a[prop] !== b[prop]) {
      any = true;
      console.log(`  ${prop.padEnd(22)} preview: ${a[prop]}\n  ${''.padEnd(22)} live:    ${b[prop]}`);
    }
  }
  const bb = [];
  for (const k of ['x','y','w','h']) if (Math.abs(a.boundingBox[k]-b.boundingBox[k]) >= 2) bb.push(`${k}: ${a.boundingBox[k]} -> ${b.boundingBox[k]}`);
  if (bb.length) { any = true; console.log(`  boundingBox            ${bb.join('  |  ')}`); }
  if (!any) console.log('  -- MATCH');
}
await browser.close();
