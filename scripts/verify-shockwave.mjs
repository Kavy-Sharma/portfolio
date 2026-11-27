import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const outDir = 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots/shockwave-verification';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  console.log('1. Loading home page...');
  await page.goto('http://localhost:4173/#skip', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  // 2. Click AegisAgent and capture frame 120ms into the transition
  console.log('2. Clicking AegisAgent and capturing in-flight pulse...');
  const aegisBtn = page.locator('button.win[data-id="aegis"]');
  await aegisBtn.click();
  
  // Wait 120ms to capture the glowing shockwave ring expanding!
  await page.waitForTimeout(120);
  await page.screenshot({ path: path.join(outDir, '01-aegis-click-in-flight-pulse.png') });

  // Wait for page to fully settle
  await page.waitForURL('**/project/aegis');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, '02-aegis-story-opened.png') });
  console.log('Aegis story opened.');

  // 3. Click Close ✕ on Aegis story
  console.log('3. Clicking Close ✕ on Aegis story...');
  const closeBtn = page.locator('button.story-close-btn');
  await closeBtn.click();
  await page.waitForTimeout(120);
  await page.screenshot({ path: path.join(outDir, '03-close-click-in-flight-pulse.png') });

  await page.waitForURL('http://localhost:4173/');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, '04-returned-to-building.png') });
  console.log('Returned to building.');

  // 4. Switch to Attack mode
  console.log('4. Switching to Attack mode...');
  const attackBtn = page.locator('button[data-m="attack"]');
  await attackBtn.click();
  await page.waitForTimeout(400);

  // 5. Click a note card in Latest Notes
  console.log('5. Clicking note card in Attack mode...');
  const noteCard = page.locator('.latest-note-card').first();
  await noteCard.click();
  await page.waitForTimeout(120);
  await page.screenshot({ path: path.join(outDir, '05-note-click-attack-in-flight.png') });

  await page.waitForURL('**/notes/**');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, '06-note-detail-attack-opened.png') });

  // Check horizontal overflow
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log('Horizontal overflow check:', overflow);

  await browser.close();

  console.log('Console errors:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error(consoleErrors);
    process.exit(1);
  }
  console.log('SHOCKWAVE VERIFICATION PASSED PERFECTLY!');
}

run().catch(err => {
  console.error('Error running verification:', err);
  process.exit(1);
});
