import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\62434d22-2972-4ecb-8d14-52c4bef54f4b\\screenshots';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const viewports = [
    { name: '360', width: 360, height: 780, isMobile: true, hasTouch: true },
    { name: '390', width: 390, height: 844, isMobile: true, hasTouch: true },
    { name: '1440', width: 1440, height: 900, isMobile: false, hasTouch: false }
  ];

  const modes = ['defend', 'attack'];

  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots', { recursive: true });
  }
  if (!fs.existsSync(ARTIFACT_DIR)) {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  }

  const results = [];

  for (const mode of modes) {
    for (const vp of viewports) {
      const page = await browser.newPage();
      await page.setViewport({
        width: vp.width,
        height: vp.height,
        isMobile: vp.isMobile,
        hasTouch: vp.hasTouch
      });

      // 1. Capture Lock Screen
      await page.goto(`http://localhost:4173?mode=${mode}`, { waitUntil: 'networkidle0' });
      await new Promise((r) => setTimeout(r, 300));

      const lockFileName = `proto-lock-${vp.name}-${mode}.png`;
      await page.screenshot({ path: path.resolve('screenshots', lockFileName) });
      fs.copyFileSync(path.resolve('screenshots', lockFileName), path.resolve(ARTIFACT_DIR, lockFileName));

      // 2. Unlock by clicking Skip intro
      const skipBtn = await page.$('#skip');
      if (skipBtn) {
        await skipBtn.click();
        await new Promise((r) => setTimeout(r, 600));
      }

      // Check overflow
      const overflow = await page.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          hasOverflow: document.documentElement.scrollWidth > window.innerWidth
        };
      });

      // 3. Capture Top of Home Page
      const homeTopName = `proto-home-top-${vp.name}-${mode}.png`;
      await page.screenshot({ path: path.resolve('screenshots', homeTopName) });
      fs.copyFileSync(path.resolve('screenshots', homeTopName), path.resolve(ARTIFACT_DIR, homeTopName));

      // 4. Scroll to Building
      await page.evaluate(() => {
        const el = document.getElementById('building');
        if (el) el.scrollIntoView();
      });
      await new Promise((r) => setTimeout(r, 400));

      const bldName = `proto-building-${vp.name}-${mode}.png`;
      await page.screenshot({ path: path.resolve('screenshots', bldName) });
      fs.copyFileSync(path.resolve('screenshots', bldName), path.resolve(ARTIFACT_DIR, bldName));

      // 5. Scroll to Vulnerability Table
      await page.evaluate(() => {
        const el = document.getElementById('table');
        if (el) el.scrollIntoView();
      });
      await new Promise((r) => setTimeout(r, 400));

      const tableFileName = `proto-table-${vp.name}-${mode}.png`;
      await page.screenshot({ path: path.resolve('screenshots', tableFileName) });
      fs.copyFileSync(path.resolve('screenshots', tableFileName), path.resolve(ARTIFACT_DIR, tableFileName));

      // 6. Test Opening AegisAgent Story Overlay
      await page.evaluate(() => {
        const aegisBtn = document.querySelector('[data-id="aegis"]');
        if (aegisBtn) aegisBtn.click();
      });
      await new Promise((r) => setTimeout(r, 600));

      const overlayFileName = `proto-overlay-aegis-${vp.name}-${mode}.png`;
      await page.screenshot({ path: path.resolve('screenshots', overlayFileName) });
      fs.copyFileSync(path.resolve('screenshots', overlayFileName), path.resolve(ARTIFACT_DIR, overlayFileName));

      console.log(`[Captured] ${vp.name}px | Mode: ${mode} | Overflow: ${overflow.hasOverflow ? 'YES (' + overflow.scrollWidth + ' > ' + overflow.innerWidth + ')' : 'NO'}`);
      results.push({ vp: vp.name, mode, overflow });

      await page.close();
    }
  }

  await browser.close();
  console.log(`Finished full capture across 360px, 390px, and 1440px in both Defend & Attack modes.`);
}

run().catch(console.error);
