import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots';
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function capture() {
  const browser = await chromium.launch({ channel: 'msedge' }).catch(() => chromium.launch({ channel: 'chrome' }));

  const targets = [
    { id: 'aegis', name: 'aegis' },
    { id: 'safe', name: 'safeline' }
  ];

  const viewports = [
    { name: '1440', width: 1440, height: 900 },
    { name: '390', width: 390, height: 844 }
  ];

  const modes = ['defend', 'attack'];

  for (const target of targets) {
    for (const vp of viewports) {
      for (const mode of modes) {
        const page = await browser.newPage({
          viewport: { width: vp.width, height: vp.height },
          deviceScaleFactor: 2
        });

        // Set seen in sessionStorage to skip lock screen
        await page.addInitScript((m) => {
          try {
            sessionStorage.setItem('seen', '1');
            localStorage.setItem('portfolio_theme', m);
            document.documentElement.dataset.mode = m;
          } catch (e) {}
        }, mode);

        const url = `http://localhost:4173/project/${target.id}#skip`;
        console.log(`Navigating to ${url} at ${vp.width}x${vp.height} (${mode})...`);

        const errors = [];
        page.on('console', msg => {
          if (msg.type() === 'error') errors.push(msg.text());
        });
        page.on('pageerror', err => errors.push(err.message));

        await page.goto(url, { waitUntil: 'networkidle' });

        // Ensure mode is set on DOM
        await page.evaluate((m) => {
          document.documentElement.dataset.mode = m;
          // Also set the lens buttons to match mode if needed
          const btns = Array.from(document.querySelectorAll('.bf-btn'));
          const targetBtn = btns.find(b => m === 'attack' ? b.textContent.includes('Break it') : b.textContent.includes('Fix it'));
          if (targetBtn) targetBtn.click();
        }, mode);

        // Wait a beat for fonts and SVGs to settle
        await page.waitForTimeout(600);

        // Check horizontal scroll
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        if (scrollWidth > clientWidth) {
          console.warn(`WARNING: Horizontal scroll detected on ${target.id} (${vp.name}, ${mode})! scrollWidth: ${scrollWidth}, clientWidth: ${clientWidth}`);
        } else {
          console.log(`PASS: No horizontal scroll on ${target.id} (${vp.name}, ${mode}).`);
        }

        if (errors.length > 0) {
          console.error(`ERRORS on ${target.id}:`, errors);
        } else {
          console.log(`PASS: 0 console errors on ${target.id}.`);
        }

        const outPath = path.join(ARTIFACT_DIR, `story-${target.name}-${vp.name}-${mode}.png`);
        await page.screenshot({ path: outPath, fullPage: true });
        console.log(`Saved screenshot: ${outPath}`);

        await page.close();
      }
    }
  }

  await browser.close();
  console.log('All screenshots completed successfully!');
}

capture().catch(err => {
  console.error('Fatal error during capture:', err);
  process.exit(1);
});
