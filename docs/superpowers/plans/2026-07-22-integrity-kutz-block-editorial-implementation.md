# Integrity Kutz N' Stylez Block Editorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first static barbershop website that showcases real work, routes general booking through a choose-your-barber roster, and supports accessible on-page barber panels plus the Fresh Out the Chair gallery.

**Architecture:** A dependency-light Node build reads centralized ESM content records and writes complete static HTML into `dist/`. Vanilla JavaScript progressively enhances the static barber content and gallery links with panels, filters, URL state, and lightboxes; core booking, contact, directions, and image access remain usable without client-side JavaScript.

**Tech Stack:** Node.js 24, native `node:test`, semantic HTML, modular CSS, vanilla ESM, FFmpeg for responsive image renditions, Git.

## Global Constraints

- Visual direction is Block Editorial: near-black, dirty cream, oxblood red, condensed display type, real photography, selective grain, and controlled asymmetry.
- Do not fabricate customer results, barber attribution, services, reviews, or business hours.
- Every general Book Now action opens or reaches Choose Your Barber.
- Barber details use an on-page panel now and retain a stable page slug for future individual pages.
- The gallery is named Fresh Out the Chair and only exposes filters backed by credible source material.
- Mobile is primary; support every viewport from 320 CSS pixels upward without horizontal overflow.
- Touch targets are at least 44 by 44 CSS pixels, controls meet WCAG AA contrast, and reduced-motion preferences disable nonessential movement.
- The generated HTML contains the essential content and external links before client-side JavaScript runs.
- Keep third-party scripts out of the initial release.
- Public release is blocked until one verified business-hours record replaces the two conflicting live-site schedules.

---

## File Map

```text
package.json                         Project commands and Node version contract
.gitignore                           Build and local-artifact exclusions
README.md                            Local workflow and release gate
assets/source/current-site/          Unmodified curated downloads
assets/processed/                    Corrected or upscaled masters
assets/web/                          Generated responsive renditions
assets/texture/                      Reusable layout textures
src/data/site.mjs                    Shared shop identity, contact, socials, hours
src/data/barbers.mjs                 Central barber records and future page slugs
src/data/gallery.mjs                 Verified gallery metadata and categories
src/lib/content-contract.mjs         Data validation and booking fallback rules
src/lib/html.mjs                     Escaping and reusable render helpers
src/templates/layout.mjs             Shared document shell and metadata
src/templates/home.mjs               Homepage sections and barber fallback content
src/templates/gallery.mjs            Full gallery and filter markup
src/styles/tokens.css                 Color, type, spacing, motion, and layering tokens
src/styles/base.css                   Reset, typography, focus, and document defaults
src/styles/components.css             Header, hero, cards, panels, gallery, footer
src/styles/responsive.css             Mobile-first breakpoint refinements
src/client/state.mjs                 Pure fragment and filter state helpers
src/client/barber-panel.mjs          Accessible barber panel behavior
src/client/gallery.mjs               Gallery filtering behavior
src/client/lightbox.mjs              Accessible image detail behavior
src/client/main.mjs                  Enhancement bootstrap
scripts/import-assets.mjs            Deterministic source-asset import and naming
scripts/process-images.mjs            FFmpeg responsive rendition generation
scripts/build.mjs                    Static site build
scripts/validate-build.mjs           Release and generated-output checks
tests/content-contract.test.mjs      Barber, gallery, hours, and slug validation
tests/import-assets.test.mjs          Source URL matching and naming
tests/build.test.mjs                 Generated HTML and no-JavaScript contracts
tests/state.test.mjs                 Fragment and filter state
tests/styles.test.mjs                Required visual/accessibility CSS contracts
tests/validate-build.test.mjs        Internal link, asset, and release validation
docs/qa/browser-verification.md       Final desktop/mobile evidence
```

### Task 1: Establish the content contract and test harness

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `README.md`
- Create: `src/data/site.mjs`
- Create: `src/data/barbers.mjs`
- Create: `src/data/gallery.mjs`
- Create: `src/lib/content-contract.mjs`
- Create: `tests/content-contract.test.mjs`

**Interfaces:**
- Produces: `site`, `barbers`, and `gallery` frozen records.
- Produces: `validateContent({ site, barbers, gallery, release }) -> string[]`.
- Produces: `bookingFor(barber, site) -> { kind, href, label }`.

- [ ] **Step 1: Write the failing content-contract tests**

```js
// tests/content-contract.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { site } from '../src/data/site.mjs';
import { barbers } from '../src/data/barbers.mjs';
import { gallery } from '../src/data/gallery.mjs';
import { bookingFor, validateContent } from '../src/lib/content-contract.mjs';

test('the approved roster has unique stable slugs', () => {
  assert.equal(barbers.length, 11);
  assert.equal(new Set(barbers.map(({ slug }) => slug)).size, 11);
  assert.deepEqual(barbers.map(({ name }) => name), [
    'Lewis', 'Argenis', 'Ruben', 'Marquis', 'Munesh', 'Dion',
    'David', 'Joel', 'Abel', 'Keyshawn', 'Kevin'
  ]);
});

test('a barber without Booksy falls back to a callable number', () => {
  const argenis = barbers.find(({ slug }) => slug === 'argenis');
  assert.deepEqual(bookingFor(argenis, site), {
    kind: 'phone', href: 'tel:+16573734781', label: 'Call Argenis to Book'
  });
});

test('development content is valid while hours remain visibly unverified', () => {
  assert.deepEqual(validateContent({ site, barbers, gallery, release: false }), []);
  assert.match(site.hours.display, /Call to confirm/i);
});

test('release validation blocks unverified hours', () => {
  assert.deepEqual(validateContent({ site, barbers, gallery, release: true }), [
    'Business hours must be owner-verified before release.'
  ]);
});
```

- [ ] **Step 2: Run the test and verify the missing-module failure**

Run: `node --test tests/content-contract.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/data/site.mjs`.

- [ ] **Step 3: Create the project commands and initial content records**

```json
// package.json
{
  "name": "integrity-kutz-block-editorial",
  "private": true,
  "type": "module",
  "engines": { "node": ">=24" },
  "scripts": {
    "test": "node --test tests/*.test.mjs",
    "assets": "node scripts/process-images.mjs assets/source/current-site/source-manifest.json assets/web",
    "build": "node scripts/build.mjs",
    "check": "npm test && npm run build && node scripts/validate-build.mjs",
    "release:check": "npm test && npm run build && node scripts/validate-build.mjs --release"
  }
}
```

```gitignore
dist/
.DS_Store
Thumbs.db
*.log
```

```js
// src/data/site.mjs
export const site = Object.freeze({
  name: "Integrity Kutz N' Stylez",
  tagline: 'Integrity Never Goes Out of Style.',
  description: 'Barbers, locticians, and tattoo artists under one roof in Tracy, California.',
  address: '214 W 10th St, Tracy, CA 95376',
  phone: '+12096506473',
  phoneDisplay: '(209) 650-6473',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=214+W+10th+St+Tracy+CA+95376',
  hours: Object.freeze({
    verified: false,
    display: "Open 7 days — call to confirm today's hours",
    conflictingSources: Object.freeze(['8:00 AM–8:00 PM', '9:00 AM–7:00 PM'])
  }),
  socials: Object.freeze({
    instagram: 'https://www.instagram.com/integritykutznstylez/',
    facebook: 'https://www.facebook.com/605148899937919',
    tiktok: 'https://www.tiktok.com/@integritykutznstylez',
    yelp: 'https://www.yelp.com/biz/integrity-kutz-n-stylez-barbershop-tracy-4'
  })
});
```

```js
// src/data/barbers.mjs
const record = (value) => Object.freeze(value);

export const barbers = Object.freeze([
  record({ slug: 'lewis', name: 'Lewis', portrait: '/assets/web/lewis-portrait', specialties: ['Full-service cuts', 'Cosmetology', 'Consultation'], instagram: 'https://www.instagram.com/ls3_thebarber/', bookUrl: 'https://booksy.com/en-us/155132_ls3-thebarber-integrity-kutz-n-stylez_barber-shop_134740_tracy', phone: null, pageSlug: '/barbers/lewis/', bio: 'A licensed barber and cosmetologist with more than 25 years behind the chair and over 21 years as a shop owner. Lewis delivers unrushed, full-service work built on quality and integrity.' }),
  record({ slug: 'argenis', name: 'Argenis', portrait: '/assets/web/argenis-portrait', specialties: ['Personalized cuts', 'Fades', 'Grooming'], instagram: 'https://www.instagram.com/fadesbyonelove/', bookUrl: null, phone: '+16573734781', pageSlug: '/barbers/argenis/', bio: 'Argenis treats every client as an individual and tailors each service to the look, routine, and grooming goals in front of him.' }),
  record({ slug: 'ruben', name: 'Ruben', portrait: '/assets/web/ruben-portrait', specialties: ['Precision cuts', 'Fades', 'Grooming'], instagram: 'https://www.instagram.com/barber_truth/', bookUrl: 'https://booksy.com/en-us/1200417_barber-ruben_barber-shop_134740_tracy', phone: null, pageSlug: '/barbers/ruben/', bio: 'Ruben focuses on precise cuts, clean grooming, and a personalized service that leaves clients looking sharp and feeling confident.' }),
  record({ slug: 'marquis', name: 'Marquis', portrait: '/assets/web/marquis-portrait', specialties: ['Classic cuts', 'Modern styles', 'Fades'], instagram: 'https://www.instagram.com/m_m_quisdabeast/', bookUrl: 'https://booksy.com/en-us/23151_barber-marquis_barber-shop_134740_tracy', phone: null, pageSlug: '/barbers/marquis/', bio: 'Marquis combines experience with a friendly chair-side approach, covering classic cuts, modern styles, and tailored finishing work.' }),
  record({ slug: 'munesh', name: 'Munesh', portrait: '/assets/web/munesh-portrait', specialties: ['Modern fades', 'Classic styles', 'Detail work'], instagram: 'https://www.instagram.com/_.moonblendz._/', bookUrl: 'https://booksy.com/en-us/1391194_moonblendz_barber-shop_134740_tracy', phone: null, pageSlug: '/barbers/munesh/', bio: 'Munesh specializes in modern fades and classic styles with close attention to detail and a cut shaped around each client.' }),
  record({ slug: 'dion', name: 'Dion', portrait: '/assets/web/dion-portrait', specialties: ['Fresh cuts', 'Restyles', 'Clean finishes'], instagram: 'https://www.instagram.com/98babii2lit_/', bookUrl: 'https://booksy.com/en-us/dl/show-business/797920', phone: null, pageSlug: '/barbers/dion/', bio: 'Dion handles everything from a clean trim to a full restyle, with the goal of sending every client out confident.' }),
  record({ slug: 'david', name: 'David', portrait: '/assets/web/david-portrait', specialties: ['Sharp fades', 'Beard work', 'Classic cuts'], instagram: 'https://www.instagram.com/_cutsbydave/', bookUrl: 'https://booksy.com/en-us/1552854_cutsbydave_barber-shop_134740_tracy', phone: null, pageSlug: '/barbers/david/', bio: 'David takes pride in clean haircuts, sharp fades, and well-groomed beard work delivered with skill, care, and respect.' }),
  record({ slug: 'joel', name: 'Joel', portrait: '/assets/web/joel-portrait', specialties: ['All-around cuts', 'Modern styles', 'Clean finishes'], instagram: null, bookUrl: 'https://booksy.com/en-us/815311_barber-joel_barber-shop_134740_tracy', phone: null, pageSlug: '/barbers/joel/', bio: 'Joel works across cuts and styles while keeping the visit welcoming, straightforward, and focused on a confident result.' }),
  record({ slug: 'abel', name: 'Abel', portrait: '/assets/web/abel-portrait', specialties: ['Clean fades', 'Sharp lineups', 'Consistent quality'], instagram: null, bookUrl: 'https://booksy.com/en-us/438950_abel-manzo_barber-shop_134740_tracy', phone: null, pageSlug: '/barbers/abel/', bio: 'Abel is focused on clean fades, sharp lineups, attention to detail, and consistent work for the Tracy community.' }),
  record({ slug: 'keyshawn', name: 'Keyshawn', portrait: '/assets/web/keyshawn-portrait', specialties: ['Sharp fades', 'Classic cuts', 'Modern styles'], instagram: 'https://www.instagram.com/faded.byk/', bookUrl: 'https://booksy.com/en-us/1422631_faded-byk_barber-shop_134740_tracy', phone: null, pageSlug: '/barbers/keyshawn/', bio: 'Keyshawn serves Tracy with sharp fades, classic cuts, and modern styles built around precision and a welcoming experience.' }),
  record({ slug: 'kevin', name: 'Kevin', portrait: '/assets/web/kevin-portrait', specialties: ['Precision fades', 'Custom looks', 'Detail work'], instagram: null, bookUrl: 'https://booksy.com/en-us/1722345_kevblendzz209_barber-shop_134740_tracy', phone: null, pageSlug: '/barbers/kevin/', bio: 'Kevin delivers precision fades and sharp custom looks with detail-first work and an energetic approach.' })
]);
```

```js
// src/data/gallery.mjs
export const gallery = Object.freeze([
  { id: 'kids-clean-fade', src: '/assets/web/kids-clean-fade', category: 'kids', label: 'Kids Cut', alt: 'Young client showing a clean fade from the side', barberSlug: null, featured: true },
  { id: 'kids-lineup', src: '/assets/web/kids-lineup', category: 'kids', label: 'Kids Cut', alt: 'Fresh kids haircut with a clean front lineup', barberSlug: null, featured: false },
  { id: 'adult-low-fade', src: '/assets/web/adult-low-fade', category: 'fades', label: 'Fresh Fade', alt: 'Low fade with a clean blend and shaped edge', barberSlug: null, featured: true },
  { id: 'adult-textured-top', src: '/assets/web/adult-textured-top', category: 'fades', label: 'Texture Work', alt: 'Textured top with a tight blended fade', barberSlug: null, featured: true },
  { id: 'adult-razor-lineup', src: '/assets/web/adult-razor-lineup', category: 'fades', label: 'Lineup', alt: 'Close view of a finished razor lineup', barberSlug: null, featured: false },
  { id: 'shop-chair-action', src: '/assets/web/shop-chair-action', category: 'shop-life', label: 'Shop Life', alt: 'Barber working with a client in the Integrity Kutz shop', barberSlug: 'lewis', featured: true },
  { id: 'ruben-chair-action', src: '/assets/web/ruben-chair-action', category: 'shop-life', label: 'In the Chair', alt: 'Ruben concentrating while cutting a client’s hair', barberSlug: 'ruben', featured: true },
  { id: 'marquis-chair-action', src: '/assets/web/marquis-chair-action', category: 'shop-life', label: 'In the Chair', alt: 'Marquis working on a client inside the shop', barberSlug: 'marquis', featured: true },
  { id: 'kids-side-profile', src: '/assets/web/kids-side-profile', category: 'kids', label: 'Kids Cut', alt: 'Side profile of a finished kids haircut', barberSlug: null, featured: false },
  { id: 'adult-taper', src: '/assets/web/adult-taper', category: 'fades', label: 'Taper', alt: 'Finished taper with a natural textured top', barberSlug: null, featured: true },
  { id: 'integrity-cape', src: '/assets/web/integrity-cape', category: 'shop-life', label: 'Shop Life', alt: 'Client wearing an Integrity Kutz barber cape', barberSlug: null, featured: false },
  { id: 'tools-detail', src: '/assets/web/tools-detail', category: 'shop-life', label: 'Tools of the Trade', alt: 'Barber tools prepared for a service', barberSlug: null, featured: true }
].map(Object.freeze));
```

```js
// src/lib/content-contract.mjs
const hasUrl = (value) => typeof value === 'string' && /^https:\/\//.test(value);

export function bookingFor(barber, site) {
  if (hasUrl(barber.bookUrl)) return { kind: 'booksy', href: barber.bookUrl, label: `Book with ${barber.name}` };
  const phone = barber.phone || site.phone;
  return { kind: 'phone', href: `tel:${phone}`, label: `Call ${barber.name} to Book` };
}

export function validateContent({ site, barbers, gallery, release = false }) {
  const errors = [];
  const slugs = barbers.map(({ slug }) => slug);
  const ids = gallery.map(({ id }) => id);
  if (new Set(slugs).size !== slugs.length) errors.push('Barber slugs must be unique.');
  if (new Set(ids).size !== ids.length) errors.push('Gallery ids must be unique.');
  for (const barber of barbers) {
    for (const key of ['slug', 'name', 'portrait', 'pageSlug', 'bio']) {
      if (!barber[key]) errors.push(`${barber.name || barber.slug || 'Barber'} is missing ${key}.`);
    }
  }
  for (const item of gallery) {
    if (item.barberSlug && !slugs.includes(item.barberSlug)) errors.push(`${item.id} references unknown barber ${item.barberSlug}.`);
  }
  if (release && !site.hours.verified) errors.push('Business hours must be owner-verified before release.');
  return errors;
}
```

- [ ] **Step 4: Add the exact local workflow to `README.md`**

```markdown
# Integrity Kutz N' Stylez — Block Editorial

## Commands

- `npm test` — run native Node tests
- `npm run build` — generate the static site in `dist/`
- `npm run check` — test, build, and validate development output
- `npm run release:check` — run the public-release gate; this intentionally fails until owner-verified hours replace the conflicting schedules

Never edit generated files in `dist/`. Update `src/`, `assets/source/`, or `assets/processed/`, then rebuild.
```

- [ ] **Step 5: Run the content tests**

Run: `npm test`

Expected: 4 tests pass.

- [ ] **Step 6: Commit the content contract**

```powershell
git add package.json .gitignore README.md src/data src/lib/content-contract.mjs tests/content-contract.test.mjs
git commit -m "feat: establish shop content contract"
```

### Task 2: Import and process the real source assets

**Files:**
- Create: `scripts/import-assets.mjs`
- Create: `scripts/process-images.mjs`
- Create: `tests/import-assets.test.mjs`
- Create: `assets/source/current-site/source-manifest.json`
- Create: curated binaries under `assets/source/current-site/`
- Create: selected enhanced masters under `assets/processed/`
- Generate: responsive renditions under `assets/web/`

**Interfaces:**
- Produces: `originalNameFromUrl(url) -> string`.
- Produces: `importCuratedAssets({ manifests, outputRoot }) -> Promise<object[]>`.
- Produces: `processImage({ input, outputStem, widths }) -> Promise<string[]>`.
- Consumes: the two browser asset manifests captured during discovery.

- [ ] **Step 1: Write the failing import tests**

```js
// tests/import-assets.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { originalNameFromUrl, curatedTargets } from '../scripts/import-assets.mjs';

test('extracts the original GoDaddy asset name before rendition instructions', () => {
  const url = 'https://img1.wsimg.com/isteam/ip/x/TRUTH.jpg/:/cr=t:12%25/rs=w:828';
  assert.equal(originalNameFromUrl(url), 'TRUTH.jpg');
});

test('the portrait import map covers the full approved roster', () => {
  const portraits = curatedTargets.filter(({ group }) => group === 'portraits');
  assert.equal(portraits.length, 11);
  assert.equal(new Set(portraits.map(({ destination }) => destination)).size, 11);
});
```

- [ ] **Step 2: Run the import tests and verify failure**

Run: `node --test tests/import-assets.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `scripts/import-assets.mjs`.

- [ ] **Step 3: Implement deterministic source naming and import**

```js
// scripts/import-assets.mjs
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function originalNameFromUrl(url) {
  const pathname = new URL(url).pathname.split('/:/')[0];
  return decodeURIComponent(pathname.slice(pathname.lastIndexOf('/') + 1));
}

export const curatedTargets = Object.freeze([
  { group: 'portraits', source: '195.png', destination: 'lewis-portrait.png' },
  { group: 'portraits', source: '198.png', destination: 'argenis-portrait.png' },
  { group: 'portraits', source: 'TRUTH.jpg', destination: 'ruben-portrait.jpg' },
  { group: 'portraits', source: 'd6224952-126d-4462-ab7b-a0c5f191e39b.jpg', destination: 'marquis-portrait.jpg' },
  { group: 'portraits', source: 'NEW FLYER DESIGN (21 × 15 cm) (1)-91befbf.png', destination: 'munesh-portrait.png' },
  { group: 'portraits', source: '122b4a48-65f2-4667-a377-aa521ca0a043.jpg', destination: 'dion-portrait.jpg' },
  { group: 'portraits', source: '58415794-cbd1-4a36-9f7c-80b5f3474156.jpg', destination: 'david-portrait.jpg' },
  { group: 'portraits', source: 'Messenger_creation_AB29AFDC-7FB6-4919-B23A-5D.jpeg', destination: 'joel-portrait.jpeg' },
  { group: 'portraits', source: 'b936f3f5-f68c-4160-be4b-0b2172e0ce7c.jpg', destination: 'abel-portrait.jpg' },
  { group: 'portraits', source: 'Messenger_creation_ACA74B66-F4E4-4518-B1FE-77.jpeg', destination: 'keyshawn-portrait.jpeg' },
  { group: 'portraits', source: '1af817cb-ae44-4bb9-b9b0-ad01d45a18b7 (1).jpg', destination: 'kevin-portrait.jpg' },
  { group: 'gallery', source: '305118733_555007389800576_3132158736340275687_.jpg', destination: 'kids-clean-fade.jpg' },
  { group: 'gallery', source: '247648342_294548775828547_5196412024780177397_.jpg', destination: 'kids-lineup.jpg' },
  { group: 'gallery', source: '88caf26c12ef4e1a87280125d5f612-fabulous-fades.jpeg', destination: 'adult-low-fade.jpeg' },
  { group: 'gallery', source: 'hair-ef3a39d.PNG', destination: 'adult-textured-top.png' },
  { group: 'gallery', source: '307859279_555093029792012_1113074600655468571_.jpg', destination: 'adult-razor-lineup.jpg' },
  { group: 'gallery', source: '195.png', destination: 'shop-chair-action.png' },
  { group: 'gallery', source: 'TRUTH.jpg', destination: 'ruben-chair-action.jpg' },
  { group: 'gallery', source: 'd6224952-126d-4462-ab7b-a0c5f191e39b.jpg', destination: 'marquis-chair-action.jpg' },
  { group: 'gallery', source: 'o (1).jpg', destination: 'kids-side-profile.jpg' },
  { group: 'gallery', source: '307574505_556080113026637_6151654153115096800_.jpg', destination: 'adult-taper.jpg' },
  { group: 'gallery', source: 'ba62d16a12b9452a99726b8135d566-barber-f705c77.jpeg', destination: 'integrity-cape.jpeg' },
  { group: 'gallery', source: 'NEW FLYER DESIGN-1cd2518.png', destination: 'tools-detail.png' }
]);

export async function importCuratedAssets({ manifests, outputRoot }) {
  const rows = [];
  for (const manifestPath of manifests) {
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    rows.push(...manifest.assets.map((asset) => ({ ...asset, original: originalNameFromUrl(asset.url) })));
  }
  const imported = [];
  for (const target of curatedTargets) {
    const match = rows.find(({ original }) => original === target.source);
    if (!match) throw new Error(`Missing captured source asset: ${target.source}`);
    const destination = path.join(outputRoot, target.group, target.destination);
    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(match.path, destination);
    imported.push({ ...target, url: match.url, path: destination });
  }
  await writeFile(path.join(outputRoot, 'source-manifest.json'), JSON.stringify(imported, null, 2));
  return imported;
}

if (fileURLToPath(import.meta.url) === path.resolve(process.argv[1] || '')) {
  const [outputRoot, ...manifests] = process.argv.slice(2);
  if (!outputRoot || manifests.length < 2) throw new Error('Usage: node scripts/import-assets.mjs <output> <home-manifest> <gallery-manifest>');
  const imported = await importCuratedAssets({ manifests, outputRoot });
  console.log(`Imported ${imported.length} curated source assets.`);
}
```

- [ ] **Step 4: Run the import tests**

Run: `node --test tests/import-assets.test.mjs`

Expected: 2 tests pass.

- [ ] **Step 5: Import from the captured discovery manifests**

Run:

```powershell
node scripts/import-assets.mjs assets/source/current-site `
  "C:\Users\mabac\AppData\Local\Temp\browser-use\assets\9f27d6d3-41ff-46a9-864b-34936f48e3de\manifest.json" `
  "C:\Users\mabac\AppData\Local\Temp\browser-use\assets\b06e5a27-1726-4ae5-9c85-5197ac7caed2\manifest.json"
```

Expected: `Imported 23 curated source assets.`

- [ ] **Step 6: Implement FFmpeg responsive renditions**

```js
// scripts/process-images.mjs
import { mkdir, readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const run = (command, args) => new Promise((resolve, reject) => {
  const child = spawn(command, args, { stdio: 'inherit' });
  child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`${command} exited ${code}`)));
});

export async function processImage({ input, outputStem, widths = [480, 960, 1440] }) {
  await mkdir(path.dirname(outputStem), { recursive: true });
  const outputs = [];
  for (const width of widths) {
    const output = `${outputStem}-${width}.webp`;
    await run('ffmpeg', ['-y', '-i', input, '-vf', `scale='min(${width},iw)':-2`, '-c:v', 'libwebp', '-quality', '82', output]);
    outputs.push(output);
  }
  return outputs;
}

if (fileURLToPath(import.meta.url) === path.resolve(process.argv[1] || '')) {
  const [manifestPath, outputRoot] = process.argv.slice(2);
  if (!manifestPath || !outputRoot) throw new Error('Usage: node scripts/process-images.mjs <source-manifest> <output-root>');
  const entries = JSON.parse(await readFile(manifestPath, 'utf8'));
  const sourceRoot = path.dirname(manifestPath);
  for (const entry of entries) {
    const input = path.join(sourceRoot, entry.group, entry.destination);
    const outputStem = path.join(outputRoot, path.parse(entry.destination).name);
    await processImage({ input, outputStem });
  }
  console.log(`Processed ${entries.length} assets at 480, 960, and 1440 pixels.`);
}
```

- [ ] **Step 7: Process portraits and gallery sources, then inspect focal crops**

Run: `npm run assets`

Expected: `Processed 23 assets at 480, 960, and 1440 pixels.`

Visually inspect the 23 masters and record any manual crop in a `crop` field inside `source-manifest.json`; never crop away the haircut or face. Apply a recorded crop in `process-images.mjs` before the scale filter rather than destructively editing the source.

Expected: every content record referenced by `src/data/barbers.mjs` and `src/data/gallery.mjs` resolves to at least a 960-pixel WebP rendition.

- [ ] **Step 8: Enhance only the hero-grade image if inspection proves it necessary**

Use `shop-chair-action` as the first hero candidate. If the 1440 rendition is visibly soft at desktop size, create `assets/processed/shop-chair-action-enhanced.png` with identity, haircut, hands, tools, clothing, and shop environment preserved. Run that master through the same FFmpeg pipeline. Do not generate a replacement scene.

Run:

```powershell
node --input-type=module -e "import { processImage } from './scripts/process-images.mjs'; await processImage({ input: 'assets/processed/shop-chair-action-enhanced.png', outputStem: 'assets/web/shop-chair-action' });"
```

Expected: the enhanced master replaces only the three `shop-chair-action-*.webp` renditions.

- [ ] **Step 9: Commit source provenance and the processed asset pipeline**

```powershell
git add scripts/import-assets.mjs scripts/process-images.mjs tests/import-assets.test.mjs assets/source assets/processed assets/web
git commit -m "feat: import and prepare authentic shop assets"
```

### Task 3: Build complete static HTML from centralized records

**Files:**
- Create: `src/lib/html.mjs`
- Create: `src/templates/layout.mjs`
- Create: `src/templates/home.mjs`
- Create: `src/templates/gallery.mjs`
- Create: `scripts/build.mjs`
- Create: `tests/build.test.mjs`

**Interfaces:**
- Produces: `escapeHtml(value) -> string` and `picture(item, options) -> string`.
- Produces: `renderLayout({ title, description, canonicalPath, body, structuredData }) -> string`.
- Produces: `renderHome({ site, barbers, gallery }) -> string`.
- Produces: `renderGallery({ site, barbers, gallery }) -> string`.

- [ ] **Step 1: Write failing static-output tests**

```js
// tests/build.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { build } from '../scripts/build.mjs';

test('build writes complete home and gallery documents', async () => {
  await build();
  const home = await readFile('dist/index.html', 'utf8');
  const gallery = await readFile('dist/gallery/index.html', 'utf8');
  assert.match(home, /<h1>Integrity Never Goes Out of Style\.<\/h1>/);
  assert.match(home, /id="choose-your-barber"/);
  assert.match(home, /id="barber\/lewis"/);
  assert.match(gallery, /Fresh Out the Chair/);
});

test('essential booking and contact links exist before JavaScript', async () => {
  await build();
  const home = await readFile('dist/index.html', 'utf8');
  assert.match(home, /href="tel:\+12096506473"/);
  assert.match(home, /booksy\.com\/en-us\/155132/);
  assert.match(home, /data-book-now href="#choose-your-barber"/);
});
```

- [ ] **Step 2: Run the build tests and verify failure**

Run: `node --test tests/build.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `scripts/build.mjs`.

- [ ] **Step 3: Implement escaping and responsive picture rendering**

```js
// src/lib/html.mjs
export const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

export function picture({ stem, alt, className = '', eager = false }) {
  const loading = eager ? 'eager' : 'lazy';
  const priority = eager ? ' fetchpriority="high"' : '';
  return `<picture class="${escapeHtml(className)}">
    <source type="image/webp" srcset="${stem}-480.webp 480w, ${stem}-960.webp 960w, ${stem}-1440.webp 1440w" sizes="(max-width: 720px) 100vw, 50vw">
    <img src="${stem}-960.webp" alt="${escapeHtml(alt)}" loading="${loading}" decoding="async"${priority}>
  </picture>`;
}
```

- [ ] **Step 4: Implement the shared layout and metadata**

`renderLayout` must output the charset and viewport first, stylesheet links in token/base/component/responsive order, a skip link, header, supplied body, footer, JSON-LD, and `<script type="module" src="/assets/js/main.mjs"></script>`. Use only escaped user-facing values and `JSON.stringify` for structured data.

Expected signature:

```js
export function renderLayout({ site, title, description, canonicalPath, body, structuredData }) {
  return `<!doctype html><html lang="en"><head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="https://integritykutznstylez.com${canonicalPath}">
    <link rel="stylesheet" href="/assets/css/tokens.css"><link rel="stylesheet" href="/assets/css/base.css">
    <link rel="stylesheet" href="/assets/css/components.css"><link rel="stylesheet" href="/assets/css/responsive.css">
  </head><body><a class="skip-link" href="#main">Skip to content</a>${body}
    <script type="application/ld+json">${JSON.stringify(structuredData)}</script>
    <script type="module" src="/assets/js/main.mjs"></script></body></html>`;
}
```

- [ ] **Step 5: Implement homepage and gallery templates**

`renderHome` must render the ten approved homepage sections in order. Barber cards link to `#barber/<slug>`. Each full barber article is present in the generated HTML with `id="barber/<slug>"`, booking fallback from `bookingFor`, and `data-barber-panel`. The eight `featured` gallery records form the homepage proof wall. `renderGallery` renders all gallery records as ordinary image links plus filter buttons only for categories with at least two images.

- [ ] **Step 6: Implement the build script**

```js
// scripts/build.mjs
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { site } from '../src/data/site.mjs';
import { barbers } from '../src/data/barbers.mjs';
import { gallery } from '../src/data/gallery.mjs';
import { validateContent } from '../src/lib/content-contract.mjs';
import { renderHome } from '../src/templates/home.mjs';
import { renderGallery } from '../src/templates/gallery.mjs';

export async function build() {
  const errors = validateContent({ site, barbers, gallery, release: false });
  if (errors.length) throw new Error(errors.join('\n'));
  await rm('dist', { recursive: true, force: true });
  await mkdir('dist/gallery', { recursive: true });
  await mkdir('dist/assets', { recursive: true });
  await writeFile('dist/index.html', renderHome({ site, barbers, gallery }));
  await writeFile('dist/gallery/index.html', renderGallery({ site, barbers, gallery }));
  await cp('src/styles', 'dist/assets/css', { recursive: true });
  await cp('src/client', 'dist/assets/js', { recursive: true });
  await cp('assets/web', 'dist/assets/web', { recursive: true });
}

if (fileURLToPath(import.meta.url) === path.resolve(process.argv[1] || '')) {
  await build();
  console.log('Built dist/index.html and dist/gallery/index.html.');
}
```

- [ ] **Step 7: Run build tests**

Run: `node --test tests/build.test.mjs`

Expected: both tests pass and `dist/index.html` plus `dist/gallery/index.html` exist.

- [ ] **Step 8: Commit the static build**

```powershell
git add src/lib/html.mjs src/templates scripts/build.mjs tests/build.test.mjs
git commit -m "feat: generate semantic static pages"
```

### Task 4: Implement the Block Editorial visual system

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/base.css`
- Create: `src/styles/components.css`
- Create: `src/styles/responsive.css`
- Create: `tests/styles.test.mjs`

**Interfaces:**
- Produces: shared CSS contracts for `.button`, `.barber-card`, `.barber-panel`, `.proof-wall`, `.lightbox`, and `[data-gallery-filter]`.

- [ ] **Step 1: Write the failing style-contract test**

```js
// tests/styles.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('visual tokens and accessibility contracts are explicit', async () => {
  const tokens = await readFile('src/styles/tokens.css', 'utf8');
  const base = await readFile('src/styles/base.css', 'utf8');
  const components = await readFile('src/styles/components.css', 'utf8');
  const responsive = await readFile('src/styles/responsive.css', 'utf8');
  assert.match(tokens, /--color-ink:\s*#11100f/);
  assert.match(tokens, /--color-cream:\s*#eee8dc/);
  assert.match(tokens, /--color-oxblood:\s*#8f1616/);
  assert.match(base, /overflow-x:\s*clip/);
  assert.match(components, /min-height:\s*44px/);
  assert.match(responsive, /prefers-reduced-motion:\s*reduce/);
});
```

- [ ] **Step 2: Run the style test and verify missing files**

Run: `node --test tests/styles.test.mjs`

Expected: FAIL with `ENOENT` for `src/styles/tokens.css`.

- [ ] **Step 3: Create the token and base layers**

```css
/* src/styles/tokens.css */
:root {
  --color-ink: #11100f;
  --color-ink-soft: #1d1a18;
  --color-cream: #eee8dc;
  --color-paper: #f7f2e8;
  --color-oxblood: #8f1616;
  --color-red-hot: #c72a21;
  --color-gray: #a59e92;
  --font-display: "Arial Narrow", "Roboto Condensed", Impact, sans-serif;
  --font-body: Inter, ui-sans-serif, system-ui, sans-serif;
  --space-1: .5rem; --space-2: 1rem; --space-3: 1.5rem; --space-4: 2rem;
  --space-6: 3rem; --space-8: 4rem; --space-12: 6rem;
  --radius-small: 2px; --radius-panel: 12px;
  --shadow-hard: 8px 8px 0 rgba(143, 22, 22, .72);
  --duration-fast: 160ms; --duration-panel: 260ms;
  --layer-header: 20; --layer-overlay: 80; --layer-dialog: 90;
}
```

```css
/* src/styles/base.css */
*, *::before, *::after { box-sizing: border-box; }
html { color-scheme: dark; scroll-behavior: smooth; overflow-x: clip; }
body { margin: 0; min-width: 320px; overflow-x: clip; background: var(--color-ink); color: var(--color-cream); font-family: var(--font-body); line-height: 1.55; }
img { display: block; max-width: 100%; height: auto; }
a { color: inherit; }
button, a { -webkit-tap-highlight-color: transparent; }
:focus-visible { outline: 3px solid var(--color-red-hot); outline-offset: 4px; }
.skip-link { position: fixed; left: 1rem; top: -5rem; z-index: 100; background: var(--color-paper); color: var(--color-ink); padding: .75rem 1rem; }
.skip-link:focus { top: 1rem; }
.display { font-family: var(--font-display); font-weight: 900; text-transform: uppercase; letter-spacing: -.025em; line-height: .9; }
```

- [ ] **Step 4: Implement the component and responsive layers**

Build the hero as a full-bleed photographic field with a solid ink fallback, an oxblood label, and a readable gradient behind copy. Use a two-column roster at small tablet widths and four columns on wide screens. Give proof-wall items explicit grid spans rather than JavaScript masonry. Barber panels use `position: fixed; inset: 0 0 0 auto; width: min(34rem, 100%);`. All buttons and icon controls use `min-height: 44px; min-width: 44px;`.

Add this reduced-motion contract exactly:

```css
/* src/styles/responsive.css */
@media (min-width: 48rem) { .barber-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 72rem) { .barber-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
```

- [ ] **Step 5: Run style and build tests**

Run: `npm test && npm run build`

Expected: all tests pass and CSS is copied into `dist/assets/css/`.

- [ ] **Step 6: Commit the visual system**

```powershell
git add src/styles tests/styles.test.mjs
git commit -m "feat: add block editorial visual system"
```

### Task 5: Add accessible barber panels and URL state

**Files:**
- Create: `src/client/state.mjs`
- Create: `src/client/barber-panel.mjs`
- Create: `src/client/main.mjs`
- Create: `tests/state.test.mjs`

**Interfaces:**
- Produces: `barberSlugFromHash(hash) -> string | null`.
- Produces: `hashForBarber(slug) -> string`.
- Produces: `initBarberPanels(document, window) -> { open, close }`.

- [ ] **Step 1: Write the failing fragment-state tests**

```js
// tests/state.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { barberSlugFromHash, hashForBarber, visibleGalleryIds } from '../src/client/state.mjs';

test('barber fragments are stable and reject unrelated values', () => {
  assert.equal(hashForBarber('lewis'), '#barber/lewis');
  assert.equal(barberSlugFromHash('#barber/lewis'), 'lewis');
  assert.equal(barberSlugFromHash('#barber/not real'), null);
  assert.equal(barberSlugFromHash('#gallery'), null);
});

test('gallery filter state returns all or a requested category', () => {
  const items = [{ id: 'a', category: 'kids' }, { id: 'b', category: 'fades' }];
  assert.deepEqual(visibleGalleryIds(items, 'all'), ['a', 'b']);
  assert.deepEqual(visibleGalleryIds(items, 'kids'), ['a']);
});
```

- [ ] **Step 2: Run the state tests and verify failure**

Run: `node --test tests/state.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/client/state.mjs`.

- [ ] **Step 3: Implement pure state helpers**

```js
// src/client/state.mjs
const slugPattern = /^[a-z0-9-]+$/;
export const hashForBarber = (slug) => `#barber/${slug}`;
export function barberSlugFromHash(hash) {
  const match = /^#barber\/([^/?#]+)$/.exec(hash);
  return match && slugPattern.test(match[1]) ? match[1] : null;
}
export function visibleGalleryIds(items, category) {
  return items.filter((item) => category === 'all' || item.category === category).map(({ id }) => id);
}
```

- [ ] **Step 4: Implement panel enhancement**

```js
// src/client/barber-panel.mjs
import { barberSlugFromHash, hashForBarber } from './state.mjs';

const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function initBarberPanels(document, window) {
  const panels = [...document.querySelectorAll('[data-barber-panel]')];
  const triggers = [...document.querySelectorAll('[data-barber-open]')];
  if (!panels.length) return { open: () => false, close: () => false };
  let current = null;
  let lastTrigger = null;
  for (const panel of panels) panel.hidden = true;

  function open(slug, { push = true, trigger = null } = {}) {
    const panel = document.getElementById(`barber/${slug}`);
    if (!panel) return false;
    if (current && current !== panel) current.hidden = true;
    current = panel;
    lastTrigger = trigger || lastTrigger;
    panel.hidden = false;
    panel.dataset.open = 'true';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    document.documentElement.classList.add('panel-open');
    if (push && window.location.hash !== hashForBarber(slug)) window.history.pushState({}, '', hashForBarber(slug));
    (panel.querySelector('[data-panel-heading]') || panel).focus();
    return true;
  }

  function close({ replace = true, restoreFocus = true } = {}) {
    if (!current) return false;
    current.hidden = true;
    delete current.dataset.open;
    current = null;
    document.documentElement.classList.remove('panel-open');
    if (replace && barberSlugFromHash(window.location.hash)) {
      window.history.replaceState({}, '', `${window.location.pathname}${window.location.search}`);
    }
    if (restoreFocus) lastTrigger?.focus();
    return true;
  }

  for (const trigger of triggers) trigger.addEventListener('click', (event) => {
    const slug = trigger.dataset.barberOpen;
    if (!document.getElementById(`barber/${slug}`)) return;
    event.preventDefault();
    open(slug, { trigger });
  });
  for (const button of document.querySelectorAll('[data-barber-close]')) button.addEventListener('click', () => close());

  document.addEventListener('keydown', (event) => {
    if (!current) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    if (event.key !== 'Tab') return;
    const focusable = [...current.querySelectorAll(focusableSelector)];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  const syncFromHash = () => {
    const slug = barberSlugFromHash(window.location.hash);
    if (slug) open(slug, { push: false, trigger: document.querySelector(`[data-barber-open="${slug}"]`) });
    else close({ replace: false, restoreFocus: false });
  };
  window.addEventListener('hashchange', syncFromHash);
  syncFromHash();
  return { open, close };
}
```

- [ ] **Step 5: Bootstrap enhancements without breaking ordinary links**

```js
// src/client/main.mjs
import { initBarberPanels } from './barber-panel.mjs';

document.documentElement.dataset.enhanced = 'true';
initBarberPanels(document, window);
```

- [ ] **Step 6: Run state tests and rebuild**

Run: `npm test && npm run build`

Expected: all tests pass and `dist/assets/js/main.mjs` imports the panel module successfully.

- [ ] **Step 7: Commit barber panels**

```powershell
git add src/client tests/state.test.mjs
git commit -m "feat: add shareable barber panels"
```

### Task 6: Add Fresh Out the Chair filters and lightbox

**Files:**
- Create: `src/client/gallery.mjs`
- Create: `src/client/lightbox.mjs`
- Modify: `src/templates/gallery.mjs`
- Modify: `src/styles/components.css`
- Modify: `tests/build.test.mjs`

**Interfaces:**
- Produces: `initGallery(document) -> void`.
- Produces: `initLightbox(document, window) -> { open, close, next, previous }`.
- Consumes: `visibleGalleryIds` and gallery links with `data-gallery-item`, `data-gallery-category`, and `data-gallery-id`.

- [ ] **Step 1: Extend the build test for filter credibility and ordinary-link fallback**

```js
test('gallery filters have supporting images and image links work without JavaScript', async () => {
  await build();
  const html = await readFile('dist/gallery/index.html', 'utf8');
  assert.match(html, /data-gallery-filter="kids"/);
  assert.match(html, /data-gallery-filter="fades"/);
  assert.doesNotMatch(html, /data-gallery-filter="ink"/);
  assert.match(html, /data-gallery-item[^>]+href="\/assets\/web\//);
});
```

- [ ] **Step 2: Run the targeted build test and verify it fails**

Run: `node --test tests/build.test.mjs`

Expected: FAIL because gallery filter and link attributes are not complete.

- [ ] **Step 3: Render credible filters and lightbox metadata**

Update `renderGallery` so categories with fewer than two items are omitted. Each image anchor must contain the 1440 WebP `href`, `data-gallery-item`, `data-gallery-id`, `data-gallery-category`, `data-gallery-alt`, and optional `data-barber-slug`. Add one shared `<dialog class="lightbox" data-lightbox>` with labeled close, previous, and next buttons plus media and metadata containers.

- [ ] **Step 4: Implement filtering**

```js
// src/client/gallery.mjs
import { visibleGalleryIds } from './state.mjs';

export function initGallery(document) {
  const items = [...document.querySelectorAll('[data-gallery-item]')];
  const filters = [...document.querySelectorAll('[data-gallery-filter]')];
  if (!items.length || !filters.length) return;
  const records = items.map((item) => ({ id: item.dataset.galleryId, category: item.dataset.galleryCategory }));
  for (const filter of filters) filter.addEventListener('click', () => {
    const visible = new Set(visibleGalleryIds(records, filter.dataset.galleryFilter));
    for (const item of items) item.hidden = !visible.has(item.dataset.galleryId);
    for (const button of filters) button.setAttribute('aria-pressed', String(button === filter));
  });
}
```

- [ ] **Step 5: Implement the accessible lightbox**

```js
// src/client/lightbox.mjs
export function initLightbox(document, window) {
  const dialog = document.querySelector('[data-lightbox]');
  const allItems = [...document.querySelectorAll('[data-gallery-item]')];
  if (!dialog || typeof dialog.showModal !== 'function') return { open: () => false, close: () => false };
  const image = dialog.querySelector('[data-lightbox-image]');
  const label = dialog.querySelector('[data-lightbox-label]');
  const book = dialog.querySelector('[data-lightbox-book]');
  let active = null;
  let returnFocus = null;
  let touchStart = null;
  const visibleItems = () => allItems.filter((item) => !item.hidden);

  function show(item) {
    if (!item) return false;
    active = item;
    image.src = item.href;
    image.alt = item.dataset.galleryAlt;
    label.textContent = item.dataset.galleryLabel || '';
    const slug = item.dataset.barberSlug;
    const panel = slug ? document.getElementById(`barber/${slug}`) : null;
    book.hidden = !panel;
    if (panel) book.href = `#barber/${slug}`;
    return true;
  }
  function open(item) {
    returnFocus = item;
    show(item);
    dialog.showModal();
    dialog.querySelector('[data-lightbox-close]').focus();
    return true;
  }
  function close() { if (!dialog.open) return false; dialog.close(); returnFocus?.focus(); return true; }
  function move(delta) {
    const items = visibleItems();
    const index = items.indexOf(active);
    return show(items[(index + delta + items.length) % items.length]);
  }
  for (const item of allItems) item.addEventListener('click', (event) => { event.preventDefault(); open(item); });
  dialog.querySelector('[data-lightbox-close]').addEventListener('click', close);
  dialog.querySelector('[data-lightbox-next]').addEventListener('click', () => move(1));
  dialog.querySelector('[data-lightbox-previous]').addEventListener('click', () => move(-1));
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
  });
  dialog.addEventListener('touchstart', (event) => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
  dialog.addEventListener('touchend', (event) => {
    if (touchStart === null) return;
    const delta = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(delta) >= 50) move(delta < 0 ? 1 : -1);
    touchStart = null;
  }, { passive: true });
  return { open, close, next: () => move(1), previous: () => move(-1) };
}
```

Modify `src/client/main.mjs` in this task so it imports `initGallery` and `initLightbox`, then calls both after `initBarberPanels`.

- [ ] **Step 6: Style the proof wall, filters, and lightbox**

Use a fixed editorial CSS grid rather than JavaScript masonry. The first, third, and sixth homepage images receive deliberate spans at desktop widths. The lightbox uses near-black, preserves the full image with `object-fit: contain`, and keeps controls outside the image focal area. Hidden gallery items use the native `[hidden]` contract.

- [ ] **Step 7: Run the test suite and build**

Run: `npm test && npm run build`

Expected: all tests pass; Ink and Locs filters are absent until supported by at least two verified images.

- [ ] **Step 8: Commit the gallery behavior**

```powershell
git add src/client/gallery.mjs src/client/lightbox.mjs src/templates/gallery.mjs src/styles/components.css tests/build.test.mjs
git commit -m "feat: build Fresh Out the Chair gallery"
```

### Task 7: Add progressive fallback, local search metadata, and the release gate

**Files:**
- Modify: `src/templates/layout.mjs`
- Modify: `src/templates/home.mjs`
- Modify: `src/templates/gallery.mjs`
- Create: `scripts/validate-build.mjs`
- Create: `tests/validate-build.test.mjs`

**Interfaces:**
- Produces: `validateBuild({ root, release }) -> Promise<string[]>`.
- Produces: `barberShopJsonLd(site) -> object`.

- [ ] **Step 1: Write failing generated-output validation tests**

```js
// tests/validate-build.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from '../scripts/build.mjs';
import { validateBuild } from '../scripts/validate-build.mjs';

test('development build has no missing internal assets or links', async () => {
  await build();
  assert.deepEqual(await validateBuild({ root: 'dist', release: false }), []);
});

test('release build is blocked only by owner-unverified hours', async () => {
  await build();
  assert.deepEqual(await validateBuild({ root: 'dist', release: true }), [
    'Business hours must be owner-verified before release.'
  ]);
});
```

- [ ] **Step 2: Run the validation test and verify failure**

Run: `node --test tests/validate-build.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `scripts/validate-build.mjs`.

- [ ] **Step 3: Add complete `BarberShop` JSON-LD and social metadata**

The home document must include `BarberShop` JSON-LD with name, description, telephone, postal address, URL, `sameAs`, and service area. Omit `openingHoursSpecification` while `site.hours.verified` is false. Add Open Graph title, description, image, URL, and Twitter card metadata. The gallery page uses its own title, description, canonical path, and preview image.

- [ ] **Step 4: Implement build validation**

```js
// scripts/validate-build.mjs
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { site } from '../src/data/site.mjs';
import { barbers } from '../src/data/barbers.mjs';
import { gallery } from '../src/data/gallery.mjs';
import { validateContent } from '../src/lib/content-contract.mjs';

export async function validateBuild({ root = 'dist', release = false }) {
  const errors = validateContent({ site, barbers, gallery, release });
  for (const page of ['index.html', 'gallery/index.html']) {
    const file = path.join(root, page);
    const html = await readFile(file, 'utf8');
    for (const match of html.matchAll(/(?:href|src)="(\/(?!\/)[^"#?]+)"/g)) {
      const target = match[1].endsWith('/') ? `${match[1]}index.html` : match[1];
      try { await access(path.join(root, target.replace(/^\//, ''))); }
      catch { errors.push(`${page} references missing ${match[1]}.`); }
    }
  }
  return [...new Set(errors)].sort();
}

if (process.argv[1]?.endsWith('validate-build.mjs')) {
  const errors = await validateBuild({ release: process.argv.includes('--release') });
  if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
  else console.log('Build validation passed.');
}
```

- [ ] **Step 5: Run development and release validation**

Run: `npm run check`

Expected: PASS.

Run: `npm run release:check`

Expected: FAIL only with `Business hours must be owner-verified before release.`

- [ ] **Step 6: Commit metadata and validation**

```powershell
git add src/templates scripts/validate-build.mjs tests/validate-build.test.mjs
git commit -m "feat: add search metadata and release validation"
```

### Task 8: Complete automated integrity and accessibility-critical checks

**Files:**
- Modify: `tests/content-contract.test.mjs`
- Modify: `tests/build.test.mjs`
- Modify: `tests/styles.test.mjs`
- Modify: `scripts/validate-build.mjs`

**Interfaces:**
- Consumes all prior source records and generated output.
- Produces one `npm run check` command suitable for every local handoff.

- [ ] **Step 1: Add tests for all documented fallbacks**

Add exact assertions for:

```js
assert.match(home, /Call Argenis to Book/);
assert.match(home, /data-missing-portrait-fallback/);
assert.doesNotMatch(galleryHtml, /Book This Barber[^]*kids-clean-fade/);
assert.match(home, /aria-label="Close Lewis details"/);
assert.match(galleryHtml, /aria-label="Close image viewer"/);
assert.match(home, /Open 7 days — call to confirm today’s hours/);
```

Use a fixture barber with `portrait: null` in the template unit test so the name-card fallback is exercised without removing a real portrait from production data.

- [ ] **Step 2: Run the suite and verify the new assertions fail where coverage is absent**

Run: `npm test`

Expected: at least the missing-portrait and dialog-label assertions fail before implementation.

- [ ] **Step 3: Implement the missing fallbacks and labels**

Add the designed name card when `portrait` is null, ensure panel and lightbox close buttons include the exact accessible labels, suppress barber booking controls when gallery attribution is absent, and retain the public call-to-confirm hours wording during development.

- [ ] **Step 4: Expand build validation for duplicates and empty controls**

`validateBuild` must report duplicate document IDs, `href=""`, `src=""`, images without nonempty `alt`, buttons without text or `aria-label`, and any generated page containing horizontal-debug markers such as `data-overflow-known`.

- [ ] **Step 5: Run the complete automated gate**

Run: `npm run check`

Expected: PASS with all content, build, state, style, and validation tests green.

- [ ] **Step 6: Commit the completed automated gate**

```powershell
git add tests scripts/validate-build.mjs src/templates
git commit -m "test: cover booking gallery and accessibility fallbacks"
```

### Task 9: Browser verification and handoff evidence

**Files:**
- Create: `docs/qa/browser-verification.md`
- Create: `docs/qa/screenshots/home-desktop.png`
- Create: `docs/qa/screenshots/home-mobile.png`
- Create: `docs/qa/screenshots/barber-panel-mobile.png`
- Create: `docs/qa/screenshots/gallery-desktop.png`
- Create: `docs/qa/screenshots/lightbox-mobile.png`
- Modify: `README.md`

**Interfaces:**
- Consumes: built `dist/` output.
- Produces: evidence that the approved flow works in representative desktop and mobile viewports.

- [ ] **Step 1: Start a local static server**

Run: `python -m http.server 4173 --directory dist`

Expected: `Serving HTTP on 0.0.0.0 port 4173`.

- [ ] **Step 2: Verify the desktop homepage at 1440 by 900**

Check the hero, credibility strip, four-column roster, eight-image proof wall, shop story, visit block, hiring callout, and footer. Confirm there is no horizontal overflow and capture `docs/qa/screenshots/home-desktop.png`.

- [ ] **Step 3: Verify the mobile homepage at 390 by 844**

Confirm the primary actions remain visible, every touch target is at least 44 pixels, the roster is readable, and the page has no horizontal overflow. Capture `docs/qa/screenshots/home-mobile.png`.

- [ ] **Step 4: Verify the barber panel contract**

Open Lewis, confirm the URL becomes `#barber/lewis`, use browser back to close it, reopen Argenis, confirm the CTA says `Call Argenis to Book`, press Escape, and confirm focus returns to the Argenis card. Capture `docs/qa/screenshots/barber-panel-mobile.png`.

- [ ] **Step 5: Verify the gallery contract**

Open `/gallery/`, confirm only supported filters appear, filter to Kids, open an image, navigate next/previous with buttons and arrow keys, test a swipe at mobile size, close with Escape, and confirm focus returns. Capture desktop gallery and mobile lightbox screenshots.

- [ ] **Step 6: Verify graceful degradation**

Disable JavaScript and reload both pages. Confirm barber booking links, shop phone, directions, visible barber content, and direct gallery image links remain usable. Record the result in `docs/qa/browser-verification.md`.

- [ ] **Step 7: Run the final automated gate and record the release blocker**

Run: `npm run check`

Expected: PASS.

Run: `npm run release:check`

Expected: FAIL only because owner-verified hours have not yet replaced the conflicting schedules.

- [ ] **Step 8: Update the README and commit verification evidence**

Add the local preview command, QA link, current release-blocker note, and exact steps for replacing `site.hours` after owner confirmation.

```powershell
git add README.md docs/qa
git commit -m "docs: record browser verification evidence"
```

---

## Final Completion Conditions

- `npm run check` passes.
- The only permitted `npm run release:check` failure is unverified business hours.
- Desktop and mobile screenshots match Block Editorial direction and use real shop imagery.
- Choose Your Barber is the universal booking destination.
- Eleven barber panels work with stable fragments and booking fallbacks.
- Fresh Out the Chair works with supported filters, ordinary-link fallback, and accessible lightbox navigation.
- No horizontal overflow is present from 320 CSS pixels upward.
- The Git working tree is clean and each task is represented by a focused commit.
