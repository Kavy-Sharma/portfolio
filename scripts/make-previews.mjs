import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const screensDir = path.resolve(rootDir, 'public/screens');
const previewsDir = path.resolve(rootDir, 'public/previews');

if (!fs.existsSync(screensDir)) fs.mkdirSync(screensDir, { recursive: true });
if (!fs.existsSync(previewsDir)) fs.mkdirSync(previewsDir, { recursive: true });

// Optional sharp optimization
let sharp = null;
try {
  const sharpModule = await import('sharp');
  sharp = sharpModule.default || sharpModule;
} catch (e) {
  // sharp optional
}

async function capturePhishLive() {
  const targetUrl = 'https://phishsim-ai.onrender.com';
  const outFile = path.resolve(screensDir, 'phish-live.webp');
  const tempFile = path.resolve(screensDir, 'phish-live.temp.webp');

  console.log(`\nAttempting daily live capture: ${targetUrl}...`);
  console.log('Allowing up to 60s for Render free-tier cold start to wake up...');

  let browser;
  const launchOptions = [
    { channel: 'chrome', headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] },
    { channel: 'msedge', headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] },
    { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] }
  ];

  for (const opts of launchOptions) {
    try {
      browser = await chromium.launch(opts);
      break;
    } catch (e) {
      // try next
    }
  }

  if (!browser) {
    console.warn('⚠ Could not launch browser for live screenshot. Keeping existing phish-live.webp.');
    return;
  }

  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();

    // 60-second timeout for server wake-up
    await page.goto(targetUrl, {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    await page.waitForTimeout(2000);

    const buffer = await page.screenshot({ type: 'png' });

    if (sharp) {
      // Optimize to 680x425 under 150KB webp
      await sharp(buffer)
        .resize(680, 425, { fit: 'cover', position: 'top' })
        .webp({ quality: 82 })
        .toFile(tempFile);
    } else {
      fs.writeFileSync(tempFile, buffer);
    }

    fs.renameSync(tempFile, outFile);
    // Also copy to previews dir for backward compatibility
    fs.copyFileSync(outFile, path.resolve(previewsDir, 'phish-live.webp'));

    const stats = fs.statSync(outFile);
    console.log(`✓ Successfully updated ${outFile} (${Math.round(stats.size / 1024)} KB)`);
  } catch (err) {
    console.warn(`⚠ PhishSim capture failed (${err.message}). Retaining existing phish-live.webp.`);
    if (fs.existsSync(tempFile)) {
      try { fs.unlinkSync(tempFile); } catch (e) {}
    }
  } finally {
    await browser.close();
  }
}

async function run() {
  console.log('Running daily preview screenshot check (PhishSim live only)...');
  console.log('Notice: github.com, tryhackme.com, and portswigger.net screenshots are disabled per rules.');
  await capturePhishLive();
  console.log('Preview task completed.');
}

run().catch((err) => {
  console.warn('Non-fatal error during preview task:', err.message);
  process.exit(0);
});
