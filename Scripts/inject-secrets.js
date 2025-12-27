// scripts/inject-secrets.js
// Copies necessary site files into ./dist and replaces placeholder tokens with environment variables.
// Usage: EMAILJS_PUBLIC_KEY=... EMAILJS_SERVICE_ID=... node scripts/inject-secrets.js

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copy(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    ensureDir(dest);
    for (const entry of fs.readdirSync(src)) copy(path.join(src, entry), path.join(dest, entry));
  } else {
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
  }
}

function replacePlaceholdersInFile(filePath, placeholders) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updated = content;
  for (const [token, value] of Object.entries(placeholders)) {
    updated = updated.split(token).join(value || '');
  }
  fs.writeFileSync(filePath, updated, 'utf8');
}

// Prepare dist
if (fs.existsSync(DIST)) {
  // keep it simple: remove previous dist
  fs.rmSync(DIST, { recursive: true, force: true });
}
ensureDir(DIST);

// Files/folders to copy into dist (adjust as needed)
const toCopy = ['index.html', '_headers', 'Pages', 'Styles', 'Scripts', 'Images', 'Logos', 'favicon', 'favicon.ico'];
for (const item of toCopy) {
  const src = path.join(ROOT, item);
  if (fs.existsSync(src)) {
    copy(src, path.join(DIST, item));
  }
}

// Replace placeholders in all HTML files inside dist/Pages
const placeholders = {
  '%%EMAILJS_PUBLIC_KEY%%': process.env.EMAILJS_PUBLIC_KEY || '',
  '%%EMAILJS_SERVICE_ID%%': process.env.EMAILJS_SERVICE_ID || '',
  '%%EMAILJS_TEMPLATE_ID%%': process.env.EMAILJS_TEMPLATE_ID || '',
  '%%EMAILJS_NOTIFICATION_TEMPLATE%%': process.env.EMAILJS_NOTIFICATION_TEMPLATE || ''
};

function walkHtmlAndReplace(dir) {
  for (const name of fs.readdirSync(dir)) {
    const fp = path.join(dir, name);
    const stat = fs.statSync(fp);
    if (stat.isDirectory()) walkHtmlAndReplace(fp);
    else if (name.endsWith('.html')) replacePlaceholdersInFile(fp, placeholders);
  }
}

const pagesDir = path.join(DIST, 'Pages');
if (fs.existsSync(pagesDir)) walkHtmlAndReplace(pagesDir);

console.log('Build prepared at ./dist');
console.log('Placeholders replaced:', Object.keys(placeholders).map(k => `${k}=${placeholders[k] ? 'SET' : 'UNSET'}`).join(', '));
