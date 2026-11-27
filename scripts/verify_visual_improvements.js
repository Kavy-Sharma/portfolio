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

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto('http://localhost:4173?mode=defend', { waitUntil: 'networkidle0' });

  // 1. Skip intro
  await page.evaluate(() => {
    const s = document.querySelector('#skip');
    if (s) s.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // 2. Scroll to building to see floor numbers and light mode glow
  await page.evaluate(() => {
    const el = document.getElementById('building');
    if (el) el.scrollIntoView();
  });
  await new Promise((r) => setTimeout(r, 400));

  // 3. Hover over PhishSim window in light mode to test hover preview and cursor glow
  const phishEl = await page.$('[data-id="phish"]');
  if (phishEl) {
    const box = await phishEl.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await new Promise((r) => setTimeout(r, 400));

    // Capture screenshot showing floating preview and light mode glow
    const shot1 = 'proto-hover-preview-restored-1440.png';
    await page.screenshot({ path: path.resolve('screenshots', shot1) });
    fs.copyFileSync(path.resolve('screenshots', shot1), path.resolve(ARTIFACT_DIR, shot1));

    // Check FP element state
    const fpInfo = await page.evaluate(() => {
      const fp = document.querySelector('#fp');
      const style = window.getComputedStyle(fp);
      const urlText = document.getElementById('fpu')?.innerText;
      return {
        hasShow: fp?.classList.contains('show'),
        opacity: style.opacity,
        transform: style.transform,
        urlText
      };
    });
    console.log('Floating Preview state on hover:', fpInfo);
  }

  // 4. Hover over AegisAgent to verify floor numbers and cursor light
  const aegisEl = await page.$('[data-id="aegis"]');
  if (aegisEl) {
    const box = await aegisEl.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await new Promise((r) => setTimeout(r, 300));

    const shot2 = 'proto-light-floor-glow-1440.png';
    await page.screenshot({ path: path.resolve('screenshots', shot2) });
    fs.copyFileSync(path.resolve('screenshots', shot2), path.resolve(ARTIFACT_DIR, shot2));
  }

  // 5. Test opening block -> navigates to /project/aegis
  await page.evaluate(() => {
    const el = document.querySelector('[data-id="aegis"]');
    if (el) el.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // 6. Test Back button transition back to building
  const backBtn = await page.$('a[href="/"]');
  if (backBtn) {
    await backBtn.click();
    await new Promise((r) => setTimeout(r, 600));

    const shot3 = 'proto-back-transition-1440.png';
    await page.screenshot({ path: path.resolve('screenshots', shot3) });
    fs.copyFileSync(path.resolve('screenshots', shot3), path.resolve(ARTIFACT_DIR, shot3));
    console.log('Navigated back to building successfully.');
  }

  // 7. Check Mobile 390px
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:4173?mode=defend', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const s = document.querySelector('#skip');
    if (s) s.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  await page.evaluate(() => {
    const el = document.getElementById('building');
    if (el) el.scrollIntoView();
  });
  await new Promise((r) => setTimeout(r, 400));

  const shot4 = 'proto-mobile-light-390.png';
  await page.screenshot({ path: path.resolve('screenshots', shot4) });
  fs.copyFileSync(path.resolve('screenshots', shot4), path.resolve(ARTIFACT_DIR, shot4));

  await browser.close();
  console.log('Errors:', errors.length, errors);
}

run().catch(console.error);
