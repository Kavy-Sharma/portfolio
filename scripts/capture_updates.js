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

  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });

  // 1. Skip intro
  await page.evaluate(() => {
    const s = document.querySelector('#skip');
    if (s) s.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // Screenshot 1: Header with Kavy. logo & Top
  const shot1 = 'proto-updated-header-1440.png';
  await page.screenshot({ path: path.resolve('screenshots', shot1) });
  fs.copyFileSync(path.resolve('screenshots', shot1), path.resolve(ARTIFACT_DIR, shot1));

  // 2. Hover over PhishSim / Aegis window to show floating preview
  const aegisEl = await page.$('[data-id="aegis"]');
  if (aegisEl) {
    const box = await aegisEl.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await new Promise((r) => setTimeout(r, 400));
    const shot2 = 'proto-updated-hover-fp-1440.png';
    await page.screenshot({ path: path.resolve('screenshots', shot2) });
    fs.copyFileSync(path.resolve('screenshots', shot2), path.resolve(ARTIFACT_DIR, shot2));
  }

  // 3. Click AegisAgent window
  await page.evaluate(() => {
    const el = document.querySelector('[data-id="aegis"]');
    if (el) el.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  const shot3 = 'proto-updated-overlay-aegis-1440.png';
  await page.screenshot({ path: path.resolve('screenshots', shot3) });
  fs.copyFileSync(path.resolve('screenshots', shot3), path.resolve(ARTIFACT_DIR, shot3));

  // 4. Close and click PortSwigger window
  await page.evaluate(() => {
    const x = document.querySelector('#x');
    if (x) x.click();
  });
  await new Promise((r) => setTimeout(r, 400));

  await page.evaluate(() => {
    const el = document.querySelector('[data-id="ps"]');
    if (el) el.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  const shot4 = 'proto-updated-overlay-ps-1440.png';
  await page.screenshot({ path: path.resolve('screenshots', shot4) });
  fs.copyFileSync(path.resolve('screenshots', shot4), path.resolve(ARTIFACT_DIR, shot4));

  await browser.close();
  console.log('Screenshots captured successfully.');
}

run().catch(console.error);
