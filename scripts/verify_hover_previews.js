import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

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
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      // Ignore CSP frame ancestor error from external third-party sites
      if (!msg.text().includes('Content Security Policy')) {
        errors.push(msg.text());
      }
    }
  });

  console.log('Testing Defend mode hover previews...');
  await page.goto('http://localhost:4173?mode=defend', { waitUntil: 'networkidle0' });

  // Skip intro
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

  // 1. Hover PhishSim (Live Mode)
  const phishEl = await page.$('[data-id="phish"]');
  const phishBox = await phishEl.boundingBox();
  await page.mouse.move(phishBox.x + phishBox.width / 2, phishBox.y + phishBox.height / 2);
  await new Promise((r) => setTimeout(r, 450));

  const phishInfo = await page.evaluate(() => {
    const fp = document.querySelector('#fp');
    const u = document.querySelector('#fpu');
    const tag = document.querySelector('#fpl');
    const iframe = fp.querySelector('iframe');
    const img = fp.querySelector('img');
    const sk = fp.querySelector('.sk');
    return {
      visible: fp.classList.contains('show'),
      url: u?.textContent,
      tag: tag?.textContent,
      hasIframe: Boolean(iframe),
      hasImg: Boolean(img),
      hasSkeleton: Boolean(sk)
    };
  });
  console.log('PhishSim preview state (Live):', phishInfo);
  const shot1 = 'preview-live-phishsim-defend-1440.png';
  await page.screenshot({ path: path.resolve('screenshots', shot1) });
  fs.copyFileSync(path.resolve('screenshots', shot1), path.resolve(ARTIFACT_DIR, shot1));

  // 2. Hover AegisAgent (Screenshot Mode)
  const aegisEl = await page.$('[data-id="aegis"]');
  const aegisBox = await aegisEl.boundingBox();
  await page.mouse.move(aegisBox.x + aegisBox.width / 2, aegisBox.y + aegisBox.height / 2);
  await new Promise((r) => setTimeout(r, 450));

  const aegisInfo = await page.evaluate(() => {
    const fp = document.querySelector('#fp');
    const u = document.querySelector('#fpu');
    const tag = document.querySelector('#fpl');
    const img = fp.querySelector('img');
    return {
      visible: fp.classList.contains('show'),
      url: u?.textContent,
      tag: tag?.textContent,
      imgSrc: img?.getAttribute('src'),
      imgNaturalWidth: img?.naturalWidth
    };
  });
  console.log('AegisAgent preview state (Screenshot):', aegisInfo);
  const shot2 = 'preview-screenshot-aegis-defend-1440.png';
  await page.screenshot({ path: path.resolve('screenshots', shot2) });
  fs.copyFileSync(path.resolve('screenshots', shot2), path.resolve(ARTIFACT_DIR, shot2));

  // 3. Hover SafeLine (Rightmost block -> test edge flipping)
  const safeEl = await page.$('[data-id="safe"]');
  const safeBox = await safeEl.boundingBox();
  const cursorX = safeBox.x + safeBox.width / 2;
  await page.mouse.move(cursorX, safeBox.y + safeBox.height / 2);
  await new Promise((r) => setTimeout(r, 450));

  const flipInfo = await page.evaluate((cx) => {
    const fp = document.querySelector('#fp');
    const r = fp.getBoundingClientRect();
    return {
      fpLeft: r.left,
      cursorX: cx,
      isFlippedLeft: r.left < cx
    };
  }, cursorX);
  console.log('SafeLine edge flip check:', flipInfo);

  // 4. Hover TechDefence (Text Card Mode)
  const tdEl = await page.$('[data-id="td"]');
  const tdBox = await tdEl.boundingBox();
  await page.mouse.move(tdBox.x + tdBox.width / 2, tdBox.y + tdBox.height / 2);
  await new Promise((r) => setTimeout(r, 450));

  const tdInfo = await page.evaluate(() => {
    const fp = document.querySelector('#fp');
    const u = document.querySelector('#fpu');
    const tag = document.querySelector('#fpl');
    const h4 = fp.querySelector('h4');
    const img = fp.querySelector('img');
    return {
      visible: fp.classList.contains('show'),
      url: u?.textContent,
      tag: tag?.textContent,
      cardTitle: h4?.textContent,
      hasImg: Boolean(img)
    };
  });
  console.log('TechDefence preview state (Text Card):', tdInfo);
  const shot3 = 'preview-textcard-techdefence-defend-1440.png';
  await page.screenshot({ path: path.resolve('screenshots', shot3) });
  fs.copyFileSync(path.resolve('screenshots', shot3), path.resolve(ARTIFACT_DIR, shot3));

  // 5. Switch to Attack mode and check PortSwigger and DRDO
  console.log('\nTesting Attack mode hover previews...');
  const attackBtn = await page.$('.tog [data-m="attack"]');
  await attackBtn.click();
  await new Promise((r) => setTimeout(r, 950));

  // Hover PortSwigger Academy
  const psEl = await page.$('[data-id="ps"]');
  const psBox = await psEl.boundingBox();
  await page.mouse.move(psBox.x + psBox.width / 2, psBox.y + psBox.height / 2);
  await new Promise((r) => setTimeout(r, 450));

  const psInfo = await page.evaluate(() => {
    const fp = document.querySelector('#fp');
    const u = document.querySelector('#fpu');
    const tag = document.querySelector('#fpl');
    const img = fp.querySelector('img');
    return {
      visible: fp.classList.contains('show'),
      url: u?.textContent,
      tag: tag?.textContent,
      imgSrc: img?.getAttribute('src')
    };
  });
  console.log('PortSwigger preview state (Attack Mode):', psInfo);
  const shot4 = 'preview-screenshot-portswigger-attack-1440.png';
  await page.screenshot({ path: path.resolve('screenshots', shot4) });
  fs.copyFileSync(path.resolve('screenshots', shot4), path.resolve(ARTIFACT_DIR, shot4));

  // Hover DRDO text card in Attack mode
  await page.evaluate(() => {
    const el = document.querySelector('[data-id="drdo"]');
    if (el) el.scrollIntoView({ block: 'center' });
  });
  await new Promise((r) => setTimeout(r, 300));

  const drdoEl = await page.$('[data-id="drdo"]');
  const drdoBox = await drdoEl.boundingBox();
  await page.mouse.move(drdoBox.x + drdoBox.width / 2, drdoBox.y + drdoBox.height / 2);
  await new Promise((r) => setTimeout(r, 450));

  const shot5 = 'preview-textcard-drdo-attack-1440.png';
  await page.screenshot({ path: path.resolve('screenshots', shot5) });
  fs.copyFileSync(path.resolve('screenshots', shot5), path.resolve(ARTIFACT_DIR, shot5));

  // 6. Test Keyboard Focus
  await page.mouse.move(0, 0); // move mouse away
  await new Promise((r) => setTimeout(r, 300));
  await page.evaluate(() => {
    const el = document.querySelector('[data-id="aegis"]');
    if (el) el.focus();
  });
  await new Promise((r) => setTimeout(r, 350));

  const focusInfo = await page.evaluate(() => {
    const fp = document.querySelector('#fp');
    return {
      visible: fp.classList.contains('show'),
      opacity: window.getComputedStyle(fp).opacity
    };
  });
  console.log('Keyboard focus preview check:', focusInfo);

  console.log('Verification finished with', errors.length, 'non-CSP errors:', errors);
  await browser.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
