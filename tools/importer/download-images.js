import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import https from 'https';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentDir = join(__dirname, '../../content');

function generateMediaName(url) {
  const hash = createHash('sha1').update(url).digest('hex').slice(0, 12);
  const urlObj = new URL(url);
  const pathParts = urlObj.pathname.split('/');
  const filename = pathParts[pathParts.length - 1] || 'image';
  const ext = filename.includes('.') ? filename.split('.').pop().split('?')[0] : 'jpg';
  return `media_${hash}.${ext}`;
}

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const request = client.get(url, { timeout: 15000 }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        downloadFile(response.headers.location).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    });
    request.on('error', reject);
    request.on('timeout', () => { request.destroy(); reject(new Error(`Timeout: ${url}`)); });
  });
}

async function processHtmlFile(filePath) {
  let html = readFileSync(filePath, 'utf-8');
  const imgRegex = /src="(https?:\/\/[^"]+)"/g;
  const urls = new Set();
  let match;

  while ((match = imgRegex.exec(html)) !== null) {
    urls.add(match[1]);
  }

  if (urls.size === 0) {
    console.log(`  No external images found in ${filePath}`);
    return;
  }

  console.log(`  Found ${urls.size} external images in ${filePath}`);
  const mediaDir = join(dirname(filePath), 'media');
  if (!existsSync(mediaDir)) mkdirSync(mediaDir, { recursive: true });

  for (const url of urls) {
    const mediaName = generateMediaName(url);
    const mediaPath = join(mediaDir, mediaName);

    if (existsSync(mediaPath)) {
      html = html.replaceAll(url, `./media/${mediaName}`);
      console.log(`  ✓ Already exists: ${mediaName}`);
      continue;
    }

    try {
      const buffer = await downloadFile(url);
      writeFileSync(mediaPath, buffer);
      html = html.replaceAll(url, `./media/${mediaName}`);
      console.log(`  ✓ Downloaded: ${mediaName} (${(buffer.length / 1024).toFixed(1)}KB)`);
    } catch (err) {
      console.error(`  ✗ Failed: ${url} - ${err.message}`);
    }
  }

  writeFileSync(filePath, html);
  console.log(`  Updated ${filePath}`);
}

async function main() {
  const args = process.argv.slice(2);
  const files = args.length > 0
    ? args
    : [join(contentDir, 'advisers.plain.html')];

  console.log('Downloading external images and updating HTML references...\n');

  for (const file of files) {
    const filePath = existsSync(file) ? file : join(process.cwd(), file);
    if (!existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      continue;
    }
    console.log(`Processing: ${filePath}`);
    await processHtmlFile(filePath);
    console.log('');
  }

  console.log('Done! Images downloaded to content/media/ and HTML references updated.');
}

main().catch(console.error);
