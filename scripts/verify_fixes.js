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
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });

  // 1. Check Skip intro
  await page.evaluate(() => {
    const s = document.querySelector('#skip');
    if (s) s.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // 2. Check Logo
  const logoText = await page.evaluate(() => {
    const l = document.querySelector('.logo');
    return l ? l.innerText.trim() : null;
  });
  console.log('Logo Text:', logoText);

  // 3. Hover over aegis window
  const aegisEl = await page.$('[data-id="aegis"]');
  if (aegisEl) {
    const box = await aegisEl.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await new Promise((r) => setTimeout(r, 300));

    const fpState = await page.evaluate(() => {
      const fp = document.querySelector('#fp');
      const style = window.getComputedStyle(fp);
      return {
        opacity: style.opacity,
        transform: style.transform,
        classList: Array.from(fp.classList)
      };
    });
    console.log('FP State on hover:', fpState);
  }

  // 4. Click aegis window
  await page.evaluate(() => {
    const el = document.querySelector('[data-id="aegis"]');
    if (el) el.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  const ovState = await page.evaluate(() => {
    const ov = document.querySelector('#ov');
    const style = window.getComputedStyle(ov);
    const title = ov.querySelector('h2');
    return {
      isOpen: ov.classList.contains('open'),
      visibility: style.visibility,
      title: title ? title.innerText : null
    };
  });
  console.log('Overlay State on Aegis click:', ovState);

  // 5. Close overlay
  await page.evaluate(() => {
    const x = document.querySelector('#x');
    if (x) x.click();
  });
  await new Promise((r) => setTimeout(r, 400));

  // 6. Click PortSwigger Academy window (Floor 2)
  await page.evaluate(() => {
    const el = document.querySelector('[data-id="ps"]');
    if (el) el.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  const psState = await page.evaluate(() => {
    const ov = document.querySelector('#ov');
    const title = ov.querySelector('h2');
    return {
      isOpen: ov.classList.contains('open'),
      title: title ? title.innerText : null
    };
  });
  console.log('Overlay State on PS click:', psState);

  // Close overlay
  await page.evaluate(() => {
    const x = document.querySelector('#x');
    if (x) x.click();
  });
  await new Promise((r) => setTimeout(r, 400));

  // 7. Click Vulnerability Table item (IDOR)
  await page.evaluate(() => {
    const el = document.querySelector('.vt .el');
    if (el) el.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  const vtState = await page.evaluate(() => {
    const ov = document.querySelector('#ov');
    const title = ov.querySelector('h2');
    return {
      isOpen: ov.classList.contains('open'),
      title: title ? title.innerText : null
    };
  });
  console.log('Overlay State on IDOR click:', vtState);

  await browser.close();
  console.log('Errors:', errors.length, errors);
}

test().catch(console.error);
