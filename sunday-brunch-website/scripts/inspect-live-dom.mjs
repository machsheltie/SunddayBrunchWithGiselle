import { chromium } from '@playwright/test';

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:5178/', { waitUntil: 'load' });
await p.waitForTimeout(3000);
const r = await p.evaluate(() => {
  const out = {};
  const all = [...document.querySelectorAll('*')];
  const classes = new Set();
  all.forEach(e => (e.classList || []).forEach(c => classes.add(c)));
  out.collectionsLike = [...classes].filter(c => /collection|portal/i.test(c));
  out.gridLike = [...classes].filter(c => /grid/i.test(c));
  out.newsletterLike = [...classes].filter(c => /newsletter|subscribe|signup|form|input/i.test(c));
  const portal = document.querySelector('.collection-portal');
  out.portalParentClass = portal ? portal.parentElement.className : null;
  out.portalChildren = portal ? [...portal.children].map(c => c.tagName + '.' + c.className) : null;
  const sp = document.querySelector('.social-proof-section');
  out.socialProofChildren = sp ? [...sp.children].map(c => c.tagName + '.' + c.className) : null;
  out.formsOnPage = [...document.querySelectorAll('form')].map(f => f.className + ' | parent: ' + f.parentElement.className);
  out.inputsOnPage = [...document.querySelectorAll('input')].map(i => i.type + ' . ' + i.className + ' | parent: ' + i.parentElement.className);
  return out;
});
console.log(JSON.stringify(r, null, 2));
await b.close();
