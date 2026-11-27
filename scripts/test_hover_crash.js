import puppeteer from 'puppeteer-core';

async function test() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR LOG:', msg.text());
      errors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    console.log('UNCAUGHT PAGE ERROR:', err.message);
    errors.push(err.message);
  });

  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });

  // 1. Skip intro
  await page.evaluate(() => {
    const s = document.querySelector('#skip');
    if (s) s.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  const windows = ['phish', 'aegis', 'sent', 'safe', 'vt', 'wr', 'net', 'ps', 'thm', 'ctf', 'td', 'drdo'];

  for (const id of windows) {
    const el = await page.$(`[data-id="${id}"]`);
    if (el) {
      const box = await el.boundingBox();
      // Hover on
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await new Promise((r) => setTimeout(r, 150));

      // Hover off to blank space
      await page.mouse.move(10, 10);
      await new Promise((r) => setTimeout(r, 150));
    }
  }

  const bodyLength = await page.evaluate(() => document.body.innerHTML.length);
  const isBuildingPresent = await page.evaluate(() => !!document.getElementById('building'));

  console.log('Total errors:', errors.length);
  console.log('Body HTML length:', bodyLength);
  console.log('Is building present:', isBuildingPresent);

  await browser.close();
}

test().catch(console.error);
