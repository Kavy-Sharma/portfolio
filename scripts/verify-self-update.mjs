import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function verify() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const outDir = 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots/self-update';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  console.log('Testing Desktop 1440x900 (Day Mode)...');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:4173/#skip', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  // Check Now line
  const nowCard = await page.$('.hero-now-card');
  const nowText = nowCard ? await nowCard.innerText() : 'NOT FOUND';
  console.log('Now Card text:', nowText);

  // Check Roof legend and Rooftop activity
  const roofLegend = await page.$('.lit-legend');
  const legendText = roofLegend ? await roofLegend.innerText() : 'NOT FOUND';
  console.log('Roof legend text:', legendText);

  const roofLightsCount = await page.$$eval('.roof-light', els => els.length);
  console.log('Roof lights count:', roofLightsCount);

  // Check PROVE windows status
  const psWindow = await page.$('.win[data-id="ps"]');
  const psStatus = psWindow ? await psWindow.$eval('.st', el => el.innerText) : 'NOT FOUND';
  console.log('PortSwigger window status:', psStatus);

  const thmWindow = await page.$('.win[data-id="thm"]');
  const thmStatus = thmWindow ? await thmWindow.$eval('.st', el => el.innerText) : 'NOT FOUND';
  console.log('TryHackMe window status:', thmStatus);

  // Check Lit windows
  const litWindows = await page.$$eval('.win.is-lit', els => els.map(el => el.getAttribute('data-id')));
  console.log('Lit windows IDs:', litWindows);

  // Check horizontal overflow
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log('Desktop Day overflow:', overflow);

  await page.screenshot({ path: path.join(outDir, '01-desktop-day.png'), fullPage: false });

  // Switch to Night mode ("Attack")
  console.log('Switching to Night Mode (Attack)...');
  const attackBtn = await page.$('button[data-m="attack"]');
  if (attackBtn) {
    await attackBtn.click();
    await page.waitForTimeout(600);
  }

  await page.screenshot({ path: path.join(outDir, '02-desktop-night.png'), fullPage: false });

  // Hover over a rooftop light to test tooltip / hover scale
  const firstLight = await page.$('.roof-light.level-4');
  if (firstLight) {
    await firstLight.hover();
    await page.waitForTimeout(200);
    const lightTitle = await firstLight.getAttribute('title');
    console.log('Hovered roof light title:', lightTitle);
  }

  await page.screenshot({ path: path.join(outDir, '03-desktop-night-roof-hover.png'), fullPage: false });

  // Test Mobile 390px
  console.log('Testing Mobile 390x844 (Day & Night)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);

  const mobileOverflowNight = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log('Mobile Night overflow:', mobileOverflowNight);
  await page.screenshot({ path: path.join(outDir, '04-mobile-night.png'), fullPage: false });

  // Switch back to Day on mobile
  const defendBtn = await page.$('button[data-m="defend"]');
  if (defendBtn) {
    await defendBtn.click();
    await page.waitForTimeout(600);
  }

  const mobileOverflowDay = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log('Mobile Day overflow:', mobileOverflowDay);
  await page.screenshot({ path: path.join(outDir, '05-mobile-day.png'), fullPage: false });

  console.log('Console errors:', errors);
  await browser.close();
}

verify().catch(console.error);
