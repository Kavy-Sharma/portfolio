import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots';
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function verify() {
  const browser = await chromium.launch({ channel: 'msedge' }).catch(() => chromium.launch({ channel: 'chrome' }));

  const routes = [
    { name: 'table', path: '/notes' },
    { name: 'post-idor', path: '/notes/idor' },
    { name: 'home-latest', path: '/' }
  ];

  const viewports = [
    { name: '1440', width: 1440, height: 900 },
    { name: '390', width: 390, height: 844 }
  ];

  const modes = ['defend', 'attack'];

  for (const route of routes) {
    for (const vp of viewports) {
      for (const mode of modes) {
        const page = await browser.newPage({
          viewport: { width: vp.width, height: vp.height },
          deviceScaleFactor: 2
        });

        await page.addInitScript((m) => {
          try {
            sessionStorage.setItem('seen', '1');
            localStorage.setItem('portfolio-theme', m);
            localStorage.setItem('mode', m);
            document.documentElement.dataset.mode = m;
            document.documentElement.dataset.theme = m;
          } catch (e) {}
        }, mode);

        const url = `http://localhost:4173${route.path}?theme=${mode}#skip`;
        console.log(`Navigating to ${url} at ${vp.width}x${vp.height} (${mode})...`);

        const errors = [];
        page.on('console', msg => {
          if (msg.type() === 'error') errors.push(msg.text());
        });
        page.on('pageerror', err => errors.push(err.message));

        await page.goto(url, { waitUntil: 'networkidle' });

        await page.evaluate((m) => {
          document.documentElement.dataset.mode = m;
        }, mode);

        await page.waitForTimeout(600);

        // Check horizontal scroll
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        if (scrollWidth > clientWidth) {
          console.warn(`WARNING: Horizontal scroll detected on ${route.name} (${vp.name}, ${mode})! scrollWidth: ${scrollWidth}, clientWidth: ${clientWidth}`);
        } else {
          console.log(`PASS: No horizontal scroll on ${route.name} (${vp.name}, ${mode}).`);
        }

        if (errors.length > 0) {
          console.error(`ERRORS on ${route.name}:`, errors);
        } else {
          console.log(`PASS: 0 console errors on ${route.name}.`);
        }

        // On home-latest, scroll down to the strip so screenshot shows it nicely
        if (route.name === 'home-latest') {
          await page.evaluate(() => {
            const strip = document.querySelector('.latest-notes-strip');
            if (strip) strip.scrollIntoView({ behavior: 'instant', block: 'start' });
          });
          await page.waitForTimeout(300);
        }

        const outPath = path.join(ARTIFACT_DIR, `notes-${route.name}-${vp.name}-${mode}.png`);
        await page.screenshot({ path: outPath, fullPage: route.name !== 'home-latest' });
        console.log(`Saved screenshot: ${outPath}`);

        await page.close();
      }
    }
  }

  // Extra verification: Test filter & search on /notes
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.addInitScript(() => {
      sessionStorage.setItem('seen', '1');
      document.documentElement.dataset.mode = 'defend';
    });
    await page.goto('http://localhost:4173/notes#skip', { waitUntil: 'networkidle' });

    // Click 'Injection' filter chip
    await page.click('button.chip-btn:has-text("Injection")');
    await page.waitForTimeout(300);

    const outPathFilter = path.join(ARTIFACT_DIR, 'notes-table-filter-injection.png');
    await page.screenshot({ path: outPathFilter, fullPage: true });
    console.log(`Saved filter screenshot: ${outPathFilter}`);

    // Type 'sql' in search
    await page.fill('input.srch', 'sql');
    await page.waitForTimeout(300);

    const outPathSearch = path.join(ARTIFACT_DIR, 'notes-table-search-sql.png');
    await page.screenshot({ path: outPathSearch, fullPage: true });
    console.log(`Saved search screenshot: ${outPathSearch}`);

    await page.close();
  }

  await browser.close();
  console.log('All notes verifications completed successfully!');
}

verify().catch(err => {
  console.error('Fatal error during verification:', err);
  process.exit(1);
});
