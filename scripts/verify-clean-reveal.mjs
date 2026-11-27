import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  console.log('Navigating to http://localhost:4173/#skip...');
  await page.goto('http://localhost:4173/#skip');
  await page.waitForTimeout(600);

  // 1. Initial Home Page screenshot
  await page.screenshot({ path: 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots/clean-reveal/01-home-defend.png' });

  // 2. Click Theme Toggle (Attack / night mode)
  console.log('Toggling theme to Attack...');
  const attackBtn = page.locator('.tog button[data-m="attack"]');
  const togBox = await attackBtn.boundingBox();
  await page.mouse.click(togBox.x + togBox.width / 2, togBox.y + togBox.height / 2);
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots/clean-reveal/02-theme-toggle-300ms.png' });
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots/clean-reveal/03-theme-attack-settled.png' });

  // 3. Click AegisAgent window in Attack mode
  console.log('Clicking AegisAgent window...');
  const aegisWin = page.locator('.win[data-id="aegis"]');
  const winBox = await aegisWin.boundingBox();
  await page.mouse.click(winBox.x + winBox.width / 2, winBox.y + winBox.height / 2);
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots/clean-reveal/04-aegis-open-300ms.png' });
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots/clean-reveal/05-aegis-open-settled.png' });

  // 4. Click Close ✕
  console.log('Clicking Close ✕...');
  const closeBtn = page.locator('button.story-close-btn');
  const closeBox = await closeBtn.boundingBox();
  await page.mouse.click(closeBox.x + closeBox.width / 2, closeBox.y + closeBox.height / 2);
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots/clean-reveal/06-close-back-300ms.png' });
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots/clean-reveal/07-home-returned.png' });

  // 5. Toggle back to Defend mode
  console.log('Toggling theme back to Defend...');
  const defendBtn = page.locator('.tog button[data-m="defend"]');
  const defBox = await defendBtn.boundingBox();
  await page.mouse.click(defBox.x + defBox.width / 2, defBox.y + defBox.height / 2);
  await page.waitForTimeout(1000);

  // 6. Test on Defend mode: Click SafeLine window
  console.log('Clicking SafeLine window in Defend mode...');
  const safeWin = page.locator('.win[data-id="safe"]');
  const safeBox = await safeWin.boundingBox();
  await page.mouse.click(safeBox.x + safeBox.width / 2, safeBox.y + safeBox.height / 2);
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots/clean-reveal/08-safeline-open-300ms.png' });
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots/clean-reveal/09-safeline-settled.png' });

  // 7. Click Close ✕
  console.log('Closing SafeLine...');
  const closeBtn2 = page.locator('button.story-close-btn');
  const closeBox2 = await closeBtn2.boundingBox();
  await page.mouse.click(closeBox2.x + closeBox2.width / 2, closeBox2.y + closeBox2.height / 2);
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots/clean-reveal/10-safeline-close-300ms.png' });
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots/clean-reveal/11-home-defend-returned.png' });

  // 8. Test Mobile viewport (390px)
  console.log('Testing Mobile viewport (390px)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  console.log(`Mobile width check: scrollWidth=${scrollWidth}, clientWidth=${clientWidth}`);
  await page.screenshot({ path: 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots/clean-reveal/12-mobile-home-390px.png' });

  console.log('Console errors recorded:', consoleErrors);
  await browser.close();
  console.log('Verification finished successfully.');
})();
