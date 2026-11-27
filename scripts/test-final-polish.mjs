import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 }
];

const ROUTES = [
  { name: 'home', path: '/#skip' },
  { name: 'project-aegis', path: '/project/aegis' },
  { name: 'project-phish', path: '/project/phish' },
  { name: 'project-safe', path: '/project/safe' },
  { name: 'notes-table', path: '/notes' },
  { name: 'note-detail', path: '/notes/sql-injection' },
  { name: 'resume', path: '/resume' },
  { name: 'not-found', path: '/floor-99' }
];

async function runAudit() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const outDir = 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots/final-polish';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const results = {
    consoleErrors: [],
    overflowBugs: [],
    headingsAudit: [],
    routesChecked: 0,
    easterEggWorks: false,
    keyboardNavWorks: false,
    perfMetrics: {}
  };

  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      const txt = msg.text();
      // Ignore external asset 404s if any
      results.consoleErrors.push(txt);
    }
  });

  console.log('=== 1. TESTING ALL ROUTES ACROSS VIEWPORTS AND MODES ===');

  for (const r of ROUTES) {
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const url = `http://localhost:4173${r.path}`;
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);

      // Check overflow in Day mode
      const hasOverflowDay = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      if (hasOverflowDay) {
        results.overflowBugs.push(`${r.name} @ ${vp.name} [Day]`);
      }

      // Check headings hierarchy
      const headings = await page.evaluate(() => {
        const hs = Array.from(document.querySelectorAll('h1, h2, h3, h4'));
        return hs.map(h => ({ tag: h.tagName, text: h.innerText.slice(0, 30) }));
      });
      if (headings.length > 0 && !results.headingsAudit.some(h => h.route === r.name)) {
        results.headingsAudit.push({ route: r.name, h1Count: headings.filter(h => h.tag === 'H1').length });
      }

      // Capture screenshot for key viewports
      if (vp.name === 'desktop' || vp.name === 'mobile') {
        const sPath = path.join(outDir, `${r.name}-${vp.name}-day.png`);
        await page.screenshot({ path: sPath, fullPage: false });
      }

      // Switch to Night mode
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'attack');
        document.documentElement.setAttribute('data-mode', 'attack');
      });
      await page.waitForTimeout(150);

      const hasOverflowNight = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      if (hasOverflowNight) {
        results.overflowBugs.push(`${r.name} @ ${vp.name} [Night]`);
      }

      if (vp.name === 'desktop' || vp.name === 'mobile') {
        const sPath = path.join(outDir, `${r.name}-${vp.name}-night.png`);
        await page.screenshot({ path: sPath, fullPage: false });
      }

      results.routesChecked++;
    }
  }

  console.log('=== 2. TESTING EASTER EGG (k-k-k) ===');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:4173/#skip', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  // Press 'k' three times
  await page.keyboard.press('k');
  await page.waitForTimeout(100);
  await page.keyboard.press('k');
  await page.waitForTimeout(100);
  await page.keyboard.press('k');
  await page.waitForTimeout(300);

  const eggCard = await page.$('.spare-key-card');
  if (eggCard) {
    const eggTitle = await eggCard.$eval('h2', el => el.innerText);
    console.log('Easter egg opened successfully! Title:', eggTitle);
    results.easterEggWorks = eggTitle.includes('spare key');
    await page.screenshot({ path: path.join(outDir, 'easter-egg-opened.png') });

    // Press Escape to close
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    const eggStillOpen = await page.$('.spare-key-card');
    console.log('Easter egg closed with Esc:', !eggStillOpen);
  } else {
    console.log('Easter egg failed to open');
  }

  console.log('=== 3. TESTING KEYBOARD ACCESSIBILITY PATH ===');
  await page.goto('http://localhost:4173/#skip', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);

  let focusedElements = [];
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press('Tab');
    const focusedInfo = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      return {
        tag: el.tagName,
        text: el.innerText ? el.innerText.trim().slice(0, 20) : '',
        id: el.id || el.getAttribute('data-id') || '',
        outline: window.getComputedStyle(el).outline
      };
    });
    if (focusedInfo) focusedElements.push(focusedInfo);
  }
  console.log('Keyboard focus tab path steps recorded:', focusedElements.length);
  results.keyboardNavWorks = focusedElements.length >= 8;

  console.log('=== 4. TESTING WEB PERFORMANCE & VITALS ===');
  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    return {
      domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) : 0,
      load: nav ? Math.round(nav.loadEventEnd - nav.startTime) : 0,
      domInteractive: nav ? Math.round(nav.domInteractive - nav.startTime) : 0,
      transferSize: nav ? nav.transferSize : 0
    };
  });
  results.perfMetrics = metrics;
  console.log('Performance timings (ms):', metrics);

  console.log('\n=== AUDIT SUMMARY ===');
  console.log('Total Route/Viewport Combos Checked:', results.routesChecked);
  console.log('Overflow Bugs:', results.overflowBugs);
  console.log('Console Errors:', results.consoleErrors);
  console.log('Easter Egg Works:', results.easterEggWorks);
  console.log('Keyboard Tab Path Works:', results.keyboardNavWorks);

  await browser.close();
}

runAudit().catch(console.error);
