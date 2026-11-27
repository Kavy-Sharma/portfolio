import { chromium } from 'playwright';
import path from 'path';

async function generateOgImage() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630, deviceScaleFactor: 2 } });

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;800&family=Geist+Mono:wght@500;600&family=Instrument+Sans:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1200px;
      height: 630px;
      background: #E8F0EE;
      color: #0C2A33;
      font-family: 'Instrument Sans', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px;
      overflow: hidden;
      position: relative;
    }
    /* Subtle decorative contour ring overlay */
    .contour-circle {
      position: absolute;
      border-radius: 50%;
      border: 1px solid rgba(10, 102, 112, 0.12);
      pointer-events: none;
    }
    .c1 { width: 900px; height: 900px; right: -200px; top: -150px; }
    .c2 { width: 680px; height: 680px; right: -90px; top: -40px; }
    .c3 { width: 460px; height: 460px; right: 20px; top: 70px; }

    .card {
      width: 100%;
      height: 100%;
      background: #F6FAF9;
      border: 2px solid #C4D5D1;
      border-radius: 28px;
      padding: 56px 64px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      z-index: 2;
      box-shadow: 0 20px 48px -12px rgba(12, 42, 51, 0.08);
    }

    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .badge-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .author-name {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #0C2A33;
    }

    .dot {
      color: #35B09C;
    }

    .tag {
      font-family: 'Geist Mono', monospace;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #486570;
      background: #E8F0EE;
      border: 1px solid #C4D5D1;
      padding: 6px 14px;
      border-radius: 99px;
    }

    .headline-wrap {
      margin: auto 0;
    }

    .line1 {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 68px;
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -0.035em;
      color: #0C2A33;
    }

    .line2 {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 68px;
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -0.035em;
      background: linear-gradient(135deg, #0A6670, #35B09C);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-top: 4px;
    }

    .bottom-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-top: 1px solid #C4D5D1;
      padding-top: 24px;
    }

    .sub-lead {
      font-size: 20px;
      color: #486570;
      line-height: 1.4;
      max-width: 620px;
    }

    .floors-pill {
      font-family: 'Geist Mono', monospace;
      font-size: 13px;
      font-weight: 600;
      color: #0A6670;
      background: rgba(10, 102, 112, 0.08);
      border: 1px solid rgba(10, 102, 112, 0.2);
      padding: 8px 16px;
      border-radius: 99px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #2FBF71;
    }
  </style>
</head>
<body>
  <div class="contour-circle c1"></div>
  <div class="contour-circle c2"></div>
  <div class="contour-circle c3"></div>

  <div class="card">
    <div class="top-bar">
      <div class="badge-wrap">
        <h2 class="author-name">Kavy<span class="dot">.</span></h2>
        <span class="tag">Cybersecurity &middot; AI Security &middot; Jodhpur</span>
      </div>
      <div class="floors-pill">
        <span class="live-dot"></span>
        5-Floor Architecture
      </div>
    </div>

    <div class="headline-wrap">
      <h1 class="line1">I find the way in.</h1>
      <h1 class="line2">Then I close it.</h1>
    </div>

    <div class="bottom-bar">
      <p class="sub-lead">
        Penetration testing (VAPT), LLM defense gateways, and verified security research.
      </p>
      <span class="tag" style="background: transparent; border-color: transparent; color: #486570;">
        kavysharma.dev
      </span>
    </div>
  </div>
</body>
</html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const outPath = path.resolve('public/og-image.png');
  await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  console.log('Generated OG image at', outPath);
  await browser.close();
}

generateOgImage().catch(console.error);
