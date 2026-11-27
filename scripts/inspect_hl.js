import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:4173?mode=defend', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const s = document.querySelector('#skip');
    if (s) s.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const info1 = await page.evaluate(() => {
    const l1 = document.querySelector('.l1');
    const l2 = document.querySelector('.l2');
    const s1 = window.getComputedStyle(l1, '::after');
    const s2 = window.getComputedStyle(l2, '::after');
    return {
      bodyClass: document.body.className,
      htmlMode: document.documentElement.dataset.mode,
      htmlTheme: document.documentElement.dataset.theme,
      l1Clip: s1.clipPath,
      l2Clip: s2.clipPath,
      l1Bg: s1.backgroundImage,
      l2Bg: s2.backgroundImage,
      l1Color: s1.color,
      l1WebkitColor: s1.webkitTextFillColor,
      l1Content: s1.content,
      l2Content: s2.content
    };
  });
  console.log('Defend info:', info1);

  const btn = await page.$('.tog [data-m="attack"]');
  await btn.click();
  await new Promise(r => setTimeout(r, 800));

  const info2 = await page.evaluate(() => {
    const l1 = document.querySelector('.l1');
    const l2 = document.querySelector('.l2');
    const s1 = window.getComputedStyle(l1, '::after');
    const s2 = window.getComputedStyle(l2, '::after');
    return {
      bodyClass: document.body.className,
      htmlMode: document.documentElement.dataset.mode,
      htmlTheme: document.documentElement.dataset.theme,
      l1Clip: s1.clipPath,
      l2Clip: s2.clipPath,
      l1Bg: s1.backgroundImage,
      l2Bg: s2.backgroundImage,
      l1Color: s1.color,
      l1WebkitColor: s1.webkitTextFillColor,
      l1Content: s1.content,
      l2Content: s2.content
    };
  });
  console.log('Attack info:', info2);

  await browser.close();
}

run().catch(console.error);
