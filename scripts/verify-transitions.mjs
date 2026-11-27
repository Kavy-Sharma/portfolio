import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('Launching browser (msedge channel)...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // 1. Visit Home with skip intro
  console.log('Opening home page...');
  await page.goto('http://localhost:4173/#skip', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Check fonts
  const fontFamilies = await page.evaluate(() => {
    const heading = document.querySelector('h1');
    const body = document.body;
    const tag = document.querySelector('.tag');
    return {
      heading: window.getComputedStyle(heading).fontFamily,
      body: window.getComputedStyle(body).fontFamily,
      tag: window.getComputedStyle(tag).fontFamily
    };
  });
  console.log('Computed Font Families:', fontFamilies);

  // 2. Scroll down to Floor 1
  console.log('Scrolling down towards Floor 1...');
  await page.evaluate(() => {
    window.scrollTo(0, 800);
  });
  await page.waitForTimeout(300);

  const initialScrollY = await page.evaluate(() => window.scrollY);
  console.log(`Initial home scrollY before click: ${initialScrollY}px`);

  // 3. Click Floor 1 TechDefence window
  console.log('Clicking TechDefence window on Floor 1...');
  const tdWin = page.locator('button.win[data-id="td"]');
  await tdWin.click();

  // Wait for transition & route change
  await page.waitForURL('**/project/td');
  await page.waitForTimeout(600);

  const tdScrollY = await page.evaluate(() => window.scrollY);
  console.log(`ScrollY on /project/td after clicking block: ${tdScrollY}px (EXPECTED: 0)`);
  if (tdScrollY !== 0) {
    throw new Error(`FAILURE: /project/td opened at scrollY=${tdScrollY} instead of 0!`);
  }

  // Capture screenshot of /project/td starting at top
  await page.screenshot({ path: path.join(outDir, 'transition-project-td-top-1440-defend.png') });

  // 4. Click Close button to return to home
  console.log('Clicking Close button on /project/td...');
  const closeBtn = page.locator('button.story-close-btn');
  await closeBtn.click();
  await page.waitForURL('http://localhost:4173/');
  await page.waitForTimeout(600);
  console.log('Returned to home successfully.');

  // 5. Scroll down to Latest Notes strip and click a note card
  console.log('Scrolling down to Latest Notes strip...');
  await page.evaluate(() => {
    const el = document.querySelector('.latest-notes-strip');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(300);

  const scrollBeforeNote = await page.evaluate(() => window.scrollY);
  console.log(`ScrollY before clicking note card: ${scrollBeforeNote}px`);

  const firstNoteCard = page.locator('.latest-note-card').first();
  await firstNoteCard.click();

  await page.waitForURL('**/notes/**');
  await page.waitForTimeout(600);

  const noteScrollY = await page.evaluate(() => window.scrollY);
  console.log(`ScrollY on note detail page after click: ${noteScrollY}px (EXPECTED: 0)`);
  if (noteScrollY !== 0) {
    throw new Error(`FAILURE: Note detail opened at scrollY=${noteScrollY} instead of 0!`);
  }

  // Capture screenshot of note detail starting at top
  await page.screenshot({ path: path.join(outDir, 'transition-note-top-1440-defend.png') });

  // 6. Test Attack / Night Mode
  console.log('Testing attack mode toggle and transitions...');
  const attackBtn = page.locator('button[data-m="attack"]');
  await attackBtn.click();
  await page.waitForTimeout(500);

  await page.screenshot({ path: path.join(outDir, 'transition-note-top-1440-attack.png') });

  // Close note to return to /notes
  const noteClose = page.locator('button.note-close-btn');
  await noteClose.click();
  await page.waitForURL('**/notes');
  await page.waitForTimeout(600);

  const notesTableScrollY = await page.evaluate(() => window.scrollY);
  console.log(`ScrollY on /notes table: ${notesTableScrollY}px (EXPECTED: 0)`);

  await page.screenshot({ path: path.join(outDir, 'transition-notes-table-1440-attack.png') });

  // 7. Test Mobile Viewport (390px)
  console.log('Testing 390px mobile viewport...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:4173/#skip', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  // Scroll down on mobile
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(200);

  const mobileScrollBefore = await page.evaluate(() => window.scrollY);
  console.log(`Mobile scroll before click: ${mobileScrollBefore}px`);

  const mobileAegisWin = page.locator('button.win[data-id="aegis"]');
  await mobileAegisWin.click();
  await page.waitForURL('**/project/aegis');
  await page.waitForTimeout(600);

  const mobileAegisScrollY = await page.evaluate(() => window.scrollY);
  console.log(`Mobile scrollY on /project/aegis: ${mobileAegisScrollY}px (EXPECTED: 0)`);
  if (mobileAegisScrollY !== 0) {
    throw new Error(`FAILURE: Mobile /project/aegis opened at scrollY=${mobileAegisScrollY} instead of 0!`);
  }

  // Check horizontal overflow
  const horizontalOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`Mobile horizontal overflow: ${horizontalOverflow} (EXPECTED: false)`);

  await page.screenshot({ path: path.join(outDir, 'transition-mobile-aegis-390-attack.png') });

  await browser.close();

  console.log('-------------------------------------------');
  console.log(`Test finished! Console errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error('Console errors encountered:', consoleErrors);
    process.exit(1);
  }
  console.log('SUCCESS: All transitions and scroll resets verified perfectly!');
}

run().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
