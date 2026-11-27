import puppeteer from 'puppeteer-core';

async function test() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', (msg) => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });

  // skip intro
  await page.evaluate(() => {
    const s = document.querySelector('#skip');
    if (s) s.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // hover over blocks
  const windows = ['phish', 'aegis', 'sent', 'safe', 'vt', 'wr', 'ps', 'thm'];
  for (const id of windows) {
    console.log('Hovering:', id);
    const el = await page.$(`[data-id="${id}"]`);
    if (el) {
      const box = await el.boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await new Promise((r) => setTimeout(r, 400));
    }
  }

  // Check if body is empty or blank
  const html = await page.evaluate(() => document.body.innerHTML.length);
  console.log('Body HTML length after hovers:', html);

  await browser.close();
}

test().catch(console.error);
