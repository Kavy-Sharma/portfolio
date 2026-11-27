import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const projectsFile = path.resolve(rootDir, 'data/projects.json');
const outDir = path.resolve(rootDir, 'public/previews');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Optional sharp optimization
let sharp = null;
try {
  const sharpModule = await import('sharp');
  sharp = sharpModule.default || sharpModule;
} catch (e) {
  console.log('sharp not found, saving uncompressed screenshots.');
}

async function run() {
  const raw = fs.readFileSync(projectsFile, 'utf-8');
  const projects = JSON.parse(raw);

  // Targets: projects with a public web url
  const targets = projects.filter(
    (p) => p.url && p.url.startsWith('http')
  );

  console.log(`Found ${targets.length} projects with public URLs to capture:`);
  targets.forEach((t) => console.log(` - ${t.id}: ${t.url} (${t.previewMode})`));

  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  } catch (err) {
    console.log('Standard chromium binary not found, launching with system Chrome channel...');
    browser = await chromium.launch({
      channel: 'chrome',
      headless: true,
      args: ['--no-sandbox']
    });
  }

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  for (const project of targets) {
    const outFile = path.resolve(outDir, `${project.id}.png`);
    const tempFile = path.resolve(outDir, `${project.id}.temp.png`);
    console.log(`\nCapturing [${project.id}] (${project.title}) -> ${project.url}...`);

    try {
      await page.goto(project.url, {
        waitUntil: 'domcontentloaded',
        timeout: 25000
      });

      // Wait a moment for dynamic rendering and webfonts
      await page.waitForTimeout(2500);

      const buffer = await page.screenshot({ type: 'png' });

      if (sharp) {
        // Optimize to 680x425 (crisp 2x retina for 340x200 card) under 150KB
        await sharp(buffer)
          .resize(680, 425, { fit: 'cover', position: 'top' })
          .png({ quality: 80, compressionLevel: 9 })
          .toFile(tempFile);
      } else {
        fs.writeFileSync(tempFile, buffer);
      }

      fs.renameSync(tempFile, outFile);
      const stats = fs.statSync(outFile);
      const kb = Math.round(stats.size / 1024);
      console.log(`✓ Saved public/previews/${project.id}.png (${kb} KB)`);
    } catch (err) {
      console.warn(`⚠ Could not capture ${project.id} (${project.url}): ${err.message}`);
      if (fs.existsSync(tempFile)) {
        try { fs.unlinkSync(tempFile); } catch (e) {}
      }
      if (fs.existsSync(outFile)) {
        console.log(`  Retaining existing public/previews/${project.id}.png`);
      } else {
        console.log(`  No previous screenshot existed for ${project.id}.`);
      }
    }
  }

  await browser.close();
  console.log('\nPreview generation complete.');
}

run().catch((e) => {
  console.error('Fatal error during preview generation:', e);
  process.exit(1);
});
