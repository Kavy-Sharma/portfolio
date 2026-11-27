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
  await page.goto('http://localhost:4173?mode=defend', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const s = document.querySelector('#skip');
    if (s) s.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // 1. Defend -> Attack
  const attackBtn = await page.$('.tog [data-m="attack"]');
  const boxA = await attackBtn.boundingBox();
  await page.mouse.click(boxA.x + boxA.width / 2, boxA.y + boxA.height / 2);
  await new Promise((r) => setTimeout(r, 380));

  const s1 = 'theme-defend-to-attack-mid-1440.png';
  await page.screenshot({ path: path.resolve('screenshots', s1) });
  fs.copyFileSync(path.resolve('screenshots', s1), path.resolve(ARTIFACT_DIR, s1));

  await new Promise((r) => setTimeout(r, 600));

  // 2. Attack -> Defend
  const defendBtn = await page.$('.tog [data-m="defend"]');
  const boxD = await defendBtn.boundingBox();
  await page.mouse.click(boxD.x + boxD.width / 2, boxD.y + boxD.height / 2);
  await new Promise((r) => setTimeout(r, 380));

  const s2 = 'theme-attack-to-defend-mid-1440.png';
  await page.screenshot({ path: path.resolve('screenshots', s2) });
  fs.copyFileSync(path.resolve('screenshots', s2), path.resolve(ARTIFACT_DIR, s2));

  await new Promise((r) => setTimeout(r, 600));

  await browser.close();
  console.log('Theme transition tests in both directions completed successfully.');
}

run().catch(console.error);
