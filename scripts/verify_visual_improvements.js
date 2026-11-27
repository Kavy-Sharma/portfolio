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

  console.log('Testing Defend mode...');
  await page.goto('http://localhost:4173?mode=defend', { waitUntil: 'networkidle0' });

  // 1. Skip intro
  await page.evaluate(() => {
    const s = document.querySelector('#skip');
    if (s) s.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // 2. Scroll to building
  await page.evaluate(() => {
    const el = document.getElementById('building');
    if (el) el.scrollIntoView();
  });
  await new Promise((r) => setTimeout(r, 400));

  // 3. Hover over PhishSim window in Defend mode
  const phishEl = await page.$('[data-id="phish"]');
  if (phishEl) {
    const box = await phishEl.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await new Promise((r) => setTimeout(r, 400));

    // Verify opacity of ::before on hovered vs sibling windows
    const opacities = await page.evaluate(() => {
      const phish = document.querySelector('[data-id="phish"]');
      const aegis = document.querySelector('[data-id="aegis"]');
      const sent = document.querySelector('[data-id="sent"]');
      const safe = document.querySelector('[data-id="safe"]');
      return {
        phishBeforeOpacity: window.getComputedStyle(phish, '::before').opacity,
        aegisBeforeOpacity: window.getComputedStyle(aegis, '::before').opacity,
        sentBeforeOpacity: window.getComputedStyle(sent, '::before').opacity,
        safeBeforeOpacity: window.getComputedStyle(safe, '::before').opacity,
      };
    });
    console.log('Window opacities when hovering PhishSim only:', opacities);

    const shot1 = 'proto-single-block-glow-defend-1440.png';
    await page.screenshot({ path: path.resolve('screenshots', shot1) });
    fs.copyFileSync(path.resolve('screenshots', shot1), path.resolve(ARTIFACT_DIR, shot1));
  }

  // 4. Click PhishSim to test Project page and Close button
  await page.evaluate(() => {
    const el = document.querySelector('[data-id="phish"]');
    if (el) el.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // Check Close ✕ button
  const closeBtnInfo = await page.evaluate(() => {
    const btn = document.querySelector('.x');
    return {
      exists: Boolean(btn),
      text: btn?.innerText,
      visible: btn ? window.getComputedStyle(btn).display !== 'none' : false
    };
  });
  console.log('Close button check on project page:', closeBtnInfo);

  const shot2 = 'proto-close-button-page-1440.png';
  await page.screenshot({ path: path.resolve('screenshots', shot2) });
  fs.copyFileSync(path.resolve('screenshots', shot2), path.resolve(ARTIFACT_DIR, shot2));

  // Click Close ✕ button to return to building
  await page.evaluate(() => {
    const btn = document.querySelector('.x');
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  const returnedUrl = page.url();
  console.log('Returned URL after clicking Close ✕:', returnedUrl);

  // 5. Test Attack mode
  console.log('Testing Attack mode...');
  await page.goto('http://localhost:4173?mode=attack', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const s = document.querySelector('#skip');
    if (s) s.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  await page.evaluate(() => {
    const el = document.getElementById('building');
    if (el) el.scrollIntoView();
  });
  await new Promise((r) => setTimeout(r, 400));

  // Hover over AegisAgent in Attack mode
  const aegisEl = await page.$('[data-id="aegis"]');
  if (aegisEl) {
    const box = await aegisEl.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await new Promise((r) => setTimeout(r, 400));

    const opacitiesAttack = await page.evaluate(() => {
      const phish = document.querySelector('[data-id="phish"]');
      const aegis = document.querySelector('[data-id="aegis"]');
      const sent = document.querySelector('[data-id="sent"]');
      const safe = document.querySelector('[data-id="safe"]');
      return {
        phishBeforeOpacity: window.getComputedStyle(phish, '::before').opacity,
        aegisBeforeOpacity: window.getComputedStyle(aegis, '::before').opacity,
        sentBeforeOpacity: window.getComputedStyle(sent, '::before').opacity,
        safeBeforeOpacity: window.getComputedStyle(safe, '::before').opacity,
      };
    });
    console.log('Attack mode window opacities when hovering AegisAgent only:', opacitiesAttack);

    const shot3 = 'proto-single-block-glow-attack-1440.png';
    await page.screenshot({ path: path.resolve('screenshots', shot3) });
    fs.copyFileSync(path.resolve('screenshots', shot3), path.resolve(ARTIFACT_DIR, shot3));
  }

  console.log('Verification finished. Errors:', errors.length, errors);
  await browser.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
