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
    { name: '390', width: 390, height: 844, isMobile: true },
    { name: '768', width: 768, height: 1024, isMobile: false },
    { name: '1440', width: 1440, height: 900, isMobile: false }
  ];

  const modes = ['defend', 'attack'];
  const routes = [
    { name: 'home', path: '/' },
    { name: 'aegis', path: '/projects/aegis' }
  ];

  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots', { recursive: true });
  }
  if (!fs.existsSync(ARTIFACT_DIR)) {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  }

  const results = [];

  for (const route of routes) {
    for (const mode of modes) {
      for (const vp of viewports) {
        const page = await browser.newPage();
        await page.setViewport({
          width: vp.width,
          height: vp.height,
          isMobile: vp.isMobile
        });

        const url = `http://localhost:4173${route.path}?theme=${mode}`;
        await page.goto(url, { waitUntil: 'networkidle0' });

        // Wait a tick for fonts/animations
        await new Promise(r => setTimeout(r, 400));

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          return {
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
            hasOverflow: document.documentElement.scrollWidth > window.innerWidth
          };
        });

        const fileName = `${route.name}-${vp.name}-${mode}.png`;
        const localPath = path.resolve('screenshots', fileName);
        const artifactPath = path.resolve(ARTIFACT_DIR, fileName);

        await page.screenshot({ path: localPath, fullPage: false });
        fs.copyFileSync(localPath, artifactPath);

        console.log(`[Captured] ${fileName} | Viewport: ${vp.width}x${vp.height} | Overflow: ${overflow.hasOverflow ? 'YES (' + overflow.scrollWidth + ' > ' + overflow.innerWidth + ')' : 'NO'}`);
        results.push({ fileName, route: route.name, mode, viewport: vp.name, overflow });

        await page.close();
      }
    }
  }

  await browser.close();
  console.log(`Finished capturing ${results.length} screenshots.`);
}

run().catch(console.error);
