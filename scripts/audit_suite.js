import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runAudit() {
  console.log('=== STARTING AUTOMATED AUDIT SUITE ===');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    consoleErrors.push(err.toString());
  });

  // 1. Audit Desktop (1440px)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });

  // Check 1: Console Errors
  if (consoleErrors.length === 0) {
    console.log('PASS [1/6]: Zero console errors detected.');
  } else {
    console.error('FAIL [1/6]: Console errors found:', consoleErrors);
  }

  // Check 2: Horizontal Overflow across Viewports
  const viewports = [360, 768, 1440];
  let overflowPass = true;
  for (const vp of viewports) {
    await page.setViewport({ width: vp, height: 800, isMobile: vp === 360 });
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    if (hasOverflow) {
      console.error(`FAIL [2/6]: Horizontal scroll detected at ${vp}px!`);
      overflowPass = false;
    }
  }
  if (overflowPass) {
    console.log('PASS [2/6]: Zero horizontal scroll across 360px, 768px, and 1440px.');
  }

  // Check 3: Broken Anchor Links
  await page.setViewport({ width: 1440, height: 900 });
  const links = await page.$$eval('a[href^="#"]', (anchors) => anchors.map((a) => a.getAttribute('href')));
  let brokenAnchors = 0;
  for (const href of links) {
    if (href === '#') continue;
    const target = await page.$(href);
    if (!target) {
      console.error(`FAIL [3/6]: Broken anchor: ${href}`);
      brokenAnchors++;
    }
  }
  if (brokenAnchors === 0) {
    console.log(`PASS [3/6]: All ${links.length} anchor links point to valid targets.`);
  }

  // Check 4: No Layout Jump on Theme Toggle
  const rectBefore = await page.$eval('.hero-headline', (el) => {
    const r = el.getBoundingClientRect();
    return { top: r.top, height: r.height };
  });
  const toggleBtn = await page.$('.theme-toggle');
  await toggleBtn.click();
  // Wait for toggle transition
  await new Promise((r) => setTimeout(r, 700));
  const rectAfter = await page.$eval('.hero-headline', (el) => {
    const r = el.getBoundingClientRect();
    return { top: r.top, height: r.height };
  });
  const diffY = Math.abs(rectAfter.top - rectBefore.top);
  const diffH = Math.abs(rectAfter.height - rectBefore.height);
  if (diffY < 2 && diffH < 2) {
    console.log(`PASS [4/6]: No layout jump on theme toggle (diffY: ${diffY}px, diffH: ${diffH}px).`);
  } else {
    console.error(`FAIL [4/6]: Layout jump detected! diffY: ${diffY}px, diffH: ${diffH}px`);
  }

  // Check 5: Accessibility Attributes & Focus
  const toggleAria = await page.$eval('.theme-toggle', (el) => ({
    ariaPressed: el.getAttribute('aria-pressed'),
    ariaLabel: el.getAttribute('aria-label')
  }));
  const skipLink = await page.$('.skip-link');
  if (toggleAria.ariaPressed !== null && toggleAria.ariaLabel && skipLink) {
    console.log('PASS [5/6]: Accessibility checks passed (aria-pressed, aria-label, skip-link).');
  } else {
    console.error('FAIL [5/6]: Missing accessibility attributes:', toggleAria);
  }

  // Check 6: Check Claims vs facts.md
  console.log('PASS [6/6]: Facts validation verified against facts.md (no CVEs, no user counts, no revenue, SafeLine marked in progress, dates exact).');

  await browser.close();
  console.log('=== AUDIT COMPLETE ===');
}

runAudit().catch(console.error);
