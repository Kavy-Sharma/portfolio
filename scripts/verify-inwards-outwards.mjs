import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  console.log('Navigating to http://localhost:4173/#skip...');
  await page.goto('http://localhost:4173/#skip');
  await page.waitForTimeout(600);

  // 1. Initial Home screenshot
  await page.screenshot({ path: 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots/inwards-outwards/01-home.png' });

  // 2. Click AegisAgent window (FORWARD -> OUTWARDS reveal)
  console.log('Clicking AegisAgent window (outwards reveal)...');
  const aegisWin = page.locator('.win[data-id="aegis"]');
  const winBox = await aegisWin.boundingBox();
  await page.mouse.click(winBox.x + winBox.width / 2, winBox.y + winBox.height / 2);
  
  // Capture mid-flight outwards expansion (around 350ms)
  await page.waitForTimeout(350);
  await page.screenshot({ path: 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots/inwards-outwards/02-aegis-open-outwards-350ms.png' });
  await page.waitForTimeout(650);
  await page.screenshot({ path: 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots/inwards-outwards/03-aegis-opened.png' });

  // 3. Click Close ✕ (BACK -> INWARDS collapse)
  console.log('Clicking Close ✕ (inwards collapse)...');
  const closeBtn = page.locator('button.story-close-btn');
  const closeBox = await closeBtn.boundingBox();
  await page.mouse.click(closeBox.x + closeBox.width / 2, closeBox.y + closeBox.height / 2);

  // Capture mid-flight inwards collapse (around 350ms)
  await page.waitForTimeout(350);
  await page.screenshot({ path: 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots/inwards-outwards/04-aegis-close-inwards-350ms.png' });
  await page.waitForTimeout(650);
  await page.screenshot({ path: 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots/inwards-outwards/05-home-returned.png' });

  // 4. Test Vulnerability Table tile (FORWARD outwards, then BACK inwards)
  console.log('Navigating to /notes...');
  await page.goto('http://localhost:4173/notes');
  await page.waitForTimeout(500);

  console.log('Clicking IDOR note tile (outwards reveal)...');
  const idorTile = page.locator('.el:has-text("IDOR")').first();
  const tileBox = await idorTile.boundingBox();
  await page.mouse.click(tileBox.x + tileBox.width / 2, tileBox.y + tileBox.height / 2);

  // Capture mid-flight outwards
  await page.waitForTimeout(350);
  await page.screenshot({ path: 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots/inwards-outwards/06-idor-open-outwards-350ms.png' });
  await page.waitForTimeout(650);
  await page.screenshot({ path: 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots/inwards-outwards/07-idor-opened.png' });

  console.log('Clicking Close on IDOR note (inwards collapse)...');
  const noteCloseBtn = page.locator('button.note-close-btn');
  const noteCloseBox = await noteCloseBtn.boundingBox();
  await page.mouse.click(noteCloseBox.x + noteCloseBox.width / 2, noteCloseBox.y + noteCloseBox.height / 2);

  // Capture mid-flight inwards
  await page.waitForTimeout(350);
  await page.screenshot({ path: 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots/inwards-outwards/08-idor-close-inwards-350ms.png' });
  await page.waitForTimeout(650);
  await page.screenshot({ path: 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots/inwards-outwards/09-back-to-table.png' });

  console.log('Errors:', errors);
  await browser.close();
  console.log('Verification done successfully.');
})();
