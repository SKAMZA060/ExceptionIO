// scripts/optimize-images.js
// Usage: node scripts/optimize-images.js
// Requires: npm install sharp --save-dev

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'Images');
const sizes = [400, 800, 1200];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function normalizeBase(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-_.]/g, '');
}

function walkAndCollect(dir) {
  const list = [];
  for (const entry of fs.readdirSync(dir)) {
    const fp = path.join(dir, entry);
    const stat = fs.statSync(fp);
    if (stat.isDirectory()) list.push(...walkAndCollect(fp));
    else if (/\.(jpg|jpeg|png)$/i.test(entry)) list.push(fp);
  }
  return list;
}

if (!fs.existsSync(IMAGES_DIR)) {
  console.error('Images directory not found:', IMAGES_DIR);
  process.exit(1);
}

(async () => {
  const files = walkAndCollect(IMAGES_DIR);
  if (!files.length) {
    console.log('No JPG/PNG images found under Images/. Nothing to do.');
    return;
  }

  for (const inputPath of files) {
    const dir = path.dirname(inputPath);
    const parsed = path.parse(inputPath);
    const base = parsed.name;
    const ext = parsed.ext.toLowerCase();

    const normalized = normalizeBase(base);

    // If filename differs, copy normalized original alongside file
    const normalizedOriginal = `${normalized}${ext}`;
    const normalizedOriginalPath = path.join(dir, normalizedOriginal);
    if (path.basename(inputPath) !== normalizedOriginal) {
      try {
        fs.copyFileSync(inputPath, normalizedOriginalPath);
        console.log('Copied original to', normalizedOriginalPath);
      } catch (err) {
        console.warn('Could not copy normalized original for', inputPath, err.message);
      }
    }

    // Generate WebP variants
    for (const w of sizes) {
      const outputNameWebp = `${normalized}-${w}.webp`;
      const outputPathWebp = path.join(dir, outputNameWebp);
      try {
        await sharp(inputPath).resize({ width: w }).webp({ quality: 75 }).toFile(outputPathWebp);
        console.log('Wrote', outputPathWebp);
      } catch (err) {
        console.error('Error processing', inputPath, err.message);
      }
    }
  }

  console.log('Image optimization complete. Update HTML <picture> sources to reference the generated files.');
})();
