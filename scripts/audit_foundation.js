import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\62434d22-2972-4ecb-8d14-52c4bef54f4b\\screenshots';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });

  const viewports = [
    { name: '390', width: 390, height: 844, isMobile: true, hasTouch: true },
    { name: '1440', width: 1440, height: 900, isMobile: false, hasTouch: false }
  ];

  const modes = ['defend', 'attack'];

  if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots', { recursive: true });
  if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

  const auditLog = [];

  for (const mode of modes) {
    for (const vp of viewports) {
      const page = await browser.newPage();
      await page.setViewport({
        width: vp.width,
        height: vp.height,
        isMobile: vp.isMobile,
        hasTouch: vp.hasTouch
      });

      const errors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      page.on('pageerror', (err) => errors.push(err.message));

      // 1. Capture Padlock Intro
      await page.goto(`http://localhost:4173?mode=${mode}`, { waitUntil: 'networkidle0' });
      await new Promise((r) => setTimeout(r, 400));

      const lockShot = `foundation-lock-${vp.name}-${mode}.png`;
      await page.screenshot({ path: path.resolve('screenshots', lockShot) });
      fs.copyFileSync(path.resolve('screenshots', lockShot), path.resolve(ARTIFACT_DIR, lockShot));

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

      // 3. Capture Home Top (Header + Hero)
      const homeShot = `foundation-home-${vp.name}-${mode}.png`;
      await page.screenshot({ path: path.resolve('screenshots', homeShot) });
      fs.copyFileSync(path.resolve('screenshots', homeShot), path.resolve(ARTIFACT_DIR, homeShot));

      // 4. Scroll to Building
      await page.evaluate(() => {
        const el = document.getElementById('building');
        if (el) el.scrollIntoView();
      });
      await new Promise((r) => setTimeout(r, 400));

      const bldShot = `foundation-building-${vp.name}-${mode}.png`;
      await page.screenshot({ path: path.resolve('screenshots', bldShot) });
      fs.copyFileSync(path.resolve('screenshots', bldShot), path.resolve(ARTIFACT_DIR, bldShot));

      // 5. Test Route Navigation on Desktop (1440)
      if (vp.name === '1440' && mode === 'defend') {
        // Click AegisAgent window -> navigates to /project/aegis
        await page.evaluate(() => {
          const el = document.querySelector('[data-id="aegis"]');
          if (el) el.click();
        });
        await new Promise((r) => setTimeout(r, 500));

        const projectShot = `foundation-route-project-1440.png`;
        await page.screenshot({ path: path.resolve('screenshots', projectShot) });
        fs.copyFileSync(path.resolve('screenshots', projectShot), path.resolve(ARTIFACT_DIR, projectShot));

        // Go to /notes
        await page.goto('http://localhost:4173/notes', { waitUntil: 'networkidle0' });
        await new Promise((r) => setTimeout(r, 400));
        const notesShot = `foundation-route-notes-1440.png`;
        await page.screenshot({ path: path.resolve('screenshots', notesShot) });
        fs.copyFileSync(path.resolve('screenshots', notesShot), path.resolve(ARTIFACT_DIR, notesShot));

        // Go to /resume
        await page.goto('http://localhost:4173/resume', { waitUntil: 'networkidle0' });
        await new Promise((r) => setTimeout(r, 400));
        const resumeShot = `foundation-route-resume-1440.png`;
        await page.screenshot({ path: path.resolve('screenshots', resumeShot) });
        fs.copyFileSync(path.resolve('screenshots', resumeShot), path.resolve(ARTIFACT_DIR, resumeShot));
      }

      console.log(`[Captured] ${vp.name}px | Mode: ${mode} | Overflow: ${overflow.hasOverflow ? 'YES' : 'NO'} | Errors: ${errors.length}`);
      auditLog.push({ vp: vp.name, mode, overflow, errors });

      await page.close();
    }
  }

  await browser.close();
  console.log('Foundation audit completed successfully.');
}

run().catch(console.error);
