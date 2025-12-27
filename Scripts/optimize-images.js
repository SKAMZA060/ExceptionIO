// scripts/optimize-images.js
// Usage: node scripts/optimize-images.js
// Requires: npm install sharp --save-dev

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const srcDir = path.join(__dirname, '..', 'Images', 'Portfolio');
const outDir = srcDir; // write variants side-by-side
const sizes = [400, 800, 1200];

if (!fs.existsSync(srcDir)) {
  console.error('Source directory not found:', srcDir);
  process.exit(1);
}

(async () => {
  const files = fs.readdirSync(srcDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));

  for (const file of files) {
    const base = path.parse(file).name;
    const ext = path.parse(file).ext.toLowerCase();

    // normalize name (lowercase, replace spaces)
    const normalized = base.toLowerCase().replace(/\s+/g, '-');
    const inputPath = path.join(srcDir, file);

    for (const w of sizes) {
      const outputNameWebp = `${normalized}-${w}.webp`;
      const outputPathWebp = path.join(outDir, outputNameWebp);

      try {
        await sharp(inputPath)
          .resize({ width: w })
          .webp({ quality: 75 })
          .toFile(outputPathWebp);
        console.log('Wrote', outputPathWebp);
      } catch (err) {
        console.error('Error processing', file, err);
      }
    }

    // Optionally copy normalized original filename (png/jpg) if different
    const normalizedOriginal = `${normalized}${ext}`;
    const normalizedOriginalPath = path.join(outDir, normalizedOriginal);
    if (file !== normalizedOriginal) {
      fs.copyFileSync(inputPath, normalizedOriginalPath);
      console.log('Copied original to', normalizedOriginalPath);
    }
  }

  console.log('Image optimization complete. Update HTML <picture> sources to reference the generated files.');
})();
