import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testModal() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });

  // Find a note row and click it
  await page.waitForSelector('#notes');
  const noteRow = await page.$('#notes [role="button"]');
  if (noteRow) {
    await noteRow.click();
    await page.waitForSelector('[role="dialog"]');
    console.log('Modal opened successfully!');

    // Wait a brief moment for content to settle
    await new Promise((r) => setTimeout(r, 600));

    // Check for copy button
    const copyBtns = await page.$$('.copy-code-btn');
    console.log(`Found ${copyBtns.length} code copy buttons in modal.`);

    await page.screenshot({ path: path.resolve('screenshots', 'modal-reader-desktop.png') });
    console.log('Saved modal-reader-desktop.png');
  } else {
    console.log('Note row not found');
  }

  await browser.close();
}

testModal().catch(console.error);
