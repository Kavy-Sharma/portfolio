import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function testResume() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const outDir = 'C:/Users/user/.gemini/antigravity/brain/62434d22-2972-4ecb-8d14-52c4bef54f4b/screenshots/resume';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log('Testing /resume Desktop Day...');
  await page.goto('http://127.0.0.1:4173/resume');
  await page.waitForSelector('#resume-document');
  await page.screenshot({ path: path.join(outDir, '01-resume-desktop-day.png'), fullPage: false });

  console.log('Testing /resume Desktop Night (Sheet must stay Day mode)...');
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'attack');
    document.documentElement.setAttribute('data-mode', 'attack');
  });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outDir, '02-resume-desktop-night.png'), fullPage: false });

  console.log('Testing /resume Mobile 390px...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outDir, '03-resume-mobile-night.png'), fullPage: false });

  // Check ground floor door links on home page
  console.log('Testing ground floor door and nav links...');
  await page.goto('http://127.0.0.1:4173/#skip');
  await page.waitForSelector('#ground');
  const doorResumeLink = await page.$eval('.rl2', el => el.getAttribute('href'));
  console.log('Door resume link:', doorResumeLink);

  const doorPdfLink = await page.$eval('.door a[href*="resume.pdf"]', el => el.getAttribute('href'));
  console.log('Door PDF link:', doorPdfLink);

  const navResumeLink = await page.$eval('#rl', el => el.getAttribute('href'));
  console.log('Nav resume link:', navResumeLink);

  await browser.close();
}

testResume().catch(console.error);
