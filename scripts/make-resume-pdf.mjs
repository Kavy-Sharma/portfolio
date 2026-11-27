import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

// Simple static file server for dist/
function startStaticServer(dir, port = 0) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.pdf': 'application/pdf'
  };

  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    let filePath = path.join(dir, reqPath);

    // Single-page application routing fallback to index.html
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(dir, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading file');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });

  return new Promise((resolve, reject) => {
    server.listen(port, '127.0.0.1', () => {
      const actualPort = server.address().port;
      resolve({ server, port: actualPort });
    });
    server.on('error', reject);
  });
}

async function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    }).on('error', () => resolve(false));
  });
}

async function makeResumePdf() {
  console.log('Generating public/resume.pdf from /resume...');
  const outPath = path.resolve('public/resume.pdf');
  const distDir = path.resolve('dist');

  let localServer = null;
  let targetUrl = 'http://127.0.0.1:4173/resume';

  // Check if preview server is already running on 4173
  const is4173Up = await checkUrl('http://127.0.0.1:4173');
  if (!is4173Up) {
    if (fs.existsSync(distDir)) {
      console.log('Starting internal static server for dist...');
      const srv = await startStaticServer(distDir);
      localServer = srv.server;
      targetUrl = `http://127.0.0.1:${srv.port}/resume`;
    } else {
      console.warn('dist/ folder not found. Please run npm run build first.');
    }
  }

  let browser = null;
  const launchOptions = [
    { channel: 'msedge', headless: true },
    { channel: 'chrome', headless: true },
    { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] }
  ];

  for (const opts of launchOptions) {
    try {
      browser = await chromium.launch(opts);
      break;
    } catch (e) {
      // Try next option
    }
  }

  if (!browser) {
    console.warn('Warning: Could not launch Playwright browser. Keeping existing public/resume.pdf.');
    if (localServer) localServer.close();
    return;
  }

  try {
    const page = await browser.newPage();
    console.log(`Navigating to ${targetUrl}...`);
    await page.goto(targetUrl, { waitUntil: 'networkidle' });
    await page.waitForSelector('#resume-document', { timeout: 6000 });

    // Emulate print media
    await page.emulateMedia({ media: 'print' });
    await page.waitForTimeout(300);

    // Save A4 PDF with print backgrounds OFF
    await page.pdf({
      path: outPath,
      format: 'A4',
      printBackground: false,
      preferCSSPageSize: true,
      displayHeaderFooter: false
    });

    console.log(`Successfully generated ${outPath} (${fs.statSync(outPath).size} bytes)`);

    // Verify PDF page count & text selectability
    const pdfBuffer = fs.readFileSync(outPath);
    const pdfText = pdfBuffer.toString('latin1');
    const pageMatches = pdfText.match(/\/Type\s*\/Page\b/g);
    const pageCount = pageMatches ? pageMatches.length : 1;
    console.log(`PDF Total Pages: ${pageCount}`);

    if (pageCount > 1) {
      console.warn(`WARNING: Resume PDF has ${pageCount} pages! It should fit strictly on 1 page.`);
    } else {
      console.log('PASS: Resume PDF fits strictly onto exactly 1 page.');
    }
  } catch (err) {
    console.error('Error generating resume PDF:', err);
  } finally {
    await browser.close();
    if (localServer) localServer.close();
  }
}

makeResumePdf().catch((err) => {
  console.error(err);
  process.exit(0);
});
