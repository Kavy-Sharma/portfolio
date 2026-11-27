import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\62434d22-2972-4ecb-8d14-52c4bef54f4b\\screenshots';

async function run() {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:4173?theme=defend', { waitUntil: 'networkidle0' });

  // Scroll to projects
  await page.evaluate(() => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 400));

  // Tap first project (PhishSim AI) or second (AegisAgent)
  const projectItems = await page.$$('[role="button"]');
  if (projectItems.length > 1) {
    // Tap AegisAgent
    await projectItems[1].click();
    await new Promise(r => setTimeout(r, 400));
  }

  const fileName = 'mobile-touch-project-expand-390.png';
  const localPath = path.resolve('screenshots', fileName);
  const artifactPath = path.resolve(ARTIFACT_DIR, fileName);

  await page.screenshot({ path: localPath });
  fs.copyFileSync(localPath, artifactPath);
  console.log(`[Captured] ${fileName}`);

  await browser.close();
}

run().catch(console.error);
