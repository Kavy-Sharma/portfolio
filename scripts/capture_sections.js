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

  const targets = [
    { name: 'home-full-1440-defend', url: 'http://localhost:4173?theme=defend', width: 1440, height: 900, isMobile: false, fullPage: true },
    { name: 'home-full-390-defend', url: 'http://localhost:4173?theme=defend', width: 390, height: 844, isMobile: true, fullPage: true },
    { name: 'home-projects-1440-defend', url: 'http://localhost:4173?theme=defend', width: 1440, height: 900, isMobile: false, scrollY: 650 },
    { name: 'aegis-tryit-1440-defend', url: 'http://localhost:4173/projects/aegis?theme=defend', width: 1440, height: 900, isMobile: false, scrollY: 1400 },
    { name: 'aegis-limits-1440-defend', url: 'http://localhost:4173/projects/aegis?theme=defend', width: 1440, height: 900, isMobile: false, scrollY: 2200 }
  ];

  for (const t of targets) {
    const page = await browser.newPage();
    await page.setViewport({ width: t.width, height: t.height, isMobile: t.isMobile });
    await page.goto(t.url, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 400));

    if (t.scrollY) {
      await page.evaluate((y) => window.scrollTo(0, y), t.scrollY);
      await new Promise(r => setTimeout(r, 300));
    }

    const fileName = `${t.name}.png`;
    const localPath = path.resolve('screenshots', fileName);
    const artifactPath = path.resolve(ARTIFACT_DIR, fileName);

    await page.screenshot({ path: localPath, fullPage: !!t.fullPage });
    fs.copyFileSync(localPath, artifactPath);
    console.log(`[Captured] ${fileName}`);
    await page.close();
  }

  await browser.close();
  console.log('Finished capturing section detail screenshots.');
}

run().catch(console.error);
