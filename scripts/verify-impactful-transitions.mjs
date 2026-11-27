import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const outDir = 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots/impact-verification';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('Launching browser to verify upgraded visual transitions...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  // 1. Visit Home with skip intro
  await page.goto('http://localhost:4173/#skip', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  // 2. Pause transition mid-flight (at 280ms) and capture screenshot to verify visual circular reveal
  console.log('Capturing mid-flight transition of window click at 280ms...');
  await page.evaluate(async () => {
    return new Promise((resolve) => {
      const el = document.querySelector('button.win[data-id="aegis"]');
      const orig = document.startViewTransition.bind(document);
      document.startViewTransition = function(cb) {
        const vt = orig(cb);
        vt.ready.then(() => {
          const anims = document.getAnimations({ subtree: true });
          anims.forEach(a => {
            a.pause();
            a.currentTime = 280;
          });
          resolve();
        });
        return vt;
      };
      el.click();
    });
  });

  await page.screenshot({ path: path.join(outDir, 'mid-flight-window-reveal-280ms.png') });
  console.log('Saved mid-flight-window-reveal-280ms.png');

  // Reload to test natural full-speed transitions
  await page.goto('http://localhost:4173/#skip', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);

  // 3. Test natural click on TechDefence (Floor 1)
  console.log('Testing full-speed transition on TechDefence...');
  const tdWin = page.locator('button.win[data-id="td"]');
  await tdWin.click();
  await page.waitForURL('**/project/td');
  await page.waitForTimeout(400);

  const scrollYAfterTd = await page.evaluate(() => window.scrollY);
  console.log('ScrollY after opening project:', scrollYAfterTd);
  await page.screenshot({ path: path.join(outDir, 'opened-project-td.png') });

  // 4. Test clicking Close button
  console.log('Testing Close button transition returning to home...');
  const closeBtn = page.locator('button.story-close-btn');
  await closeBtn.click();
  await page.waitForURL('http://localhost:4173/');
  await page.waitForTimeout(400);
  console.log('Returned to home.');

  // 5. Test Attack mode toggle and note transition
  console.log('Toggling Attack mode...');
  const attackBtn = page.locator('button[data-m="attack"]');
  await attackBtn.click();
  await page.waitForTimeout(400);

  console.log('Opening note in Attack mode...');
  const firstNote = page.locator('.latest-note-card').first();
  await firstNote.click();
  await page.waitForURL('**/notes/**');
  await page.waitForTimeout(400);

  await page.screenshot({ path: path.join(outDir, 'opened-note-attack.png') });

  // 6. Test Close on note
  console.log('Clicking Close on note...');
  const noteClose = page.locator('button.note-close-btn');
  await noteClose.click();
  await page.waitForURL('**/notes');
  await page.waitForTimeout(400);

  await page.screenshot({ path: path.join(outDir, 'opened-notes-table-attack.png') });

  // Check overflow
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log('Horizontal overflow:', overflow);

  await browser.close();

  console.log('Console errors:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error(consoleErrors);
    process.exit(1);
  }
  console.log('ALL VERIFICATIONS PASSED SUCCESSFULLY!');
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
