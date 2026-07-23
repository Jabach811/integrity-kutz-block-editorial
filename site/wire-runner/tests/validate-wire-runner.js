const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, 'index.html');

if (!fs.existsSync(htmlPath)) {
  throw new Error('Missing wire-runner/index.html');
}

const html = fs.readFileSync(htmlPath, 'utf8');
const required = [
  '<title>Wire Runner | The Conversion Delivery Simulator</title>',
  'Site under construction. Check back soon.',
  'prefers-reduced-motion',
  'aria-label="Route from D1 through EFF to WIRE"',
  'assets/transamerica-logo.svg',
  'assets/wire-runner-road.webp'
];

required.forEach((token) => {
  if (!html.includes(token)) {
    throw new Error(`Missing required token: ${token}`);
  }
});

for (const [, src] of html.matchAll(/src="([^"#?]+)"/g)) {
  if (/^(https?:|data:)/.test(src)) continue;
  if (!fs.existsSync(path.join(root, src))) {
    throw new Error(`Missing local asset: ${src}`);
  }
}

if (/\b(coin|score|leaderboard|power-up)\b/i.test(html)) {
  throw new Error('Arcade-style terminology found in teaser copy.');
}

console.log('Wire Runner validation passed.');
