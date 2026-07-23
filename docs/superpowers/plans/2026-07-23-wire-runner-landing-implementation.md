# Wire Runner Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an isolated, responsive Wire Runner teaser page with original first-person simulator artwork, a tactical route-map graphic, and the exact construction message.

**Architecture:** Create a self-contained `wire-runner/` microsite that does not modify the existing `site/` build. Keep the main page portable in one HTML file, store only image assets separately, and verify the finished artifact with a dependency-free Node validator plus a rendered browser check.

**Tech Stack:** Semantic HTML5, embedded CSS, minimal vanilla JavaScript, inline SVG, generated WebP artwork, Node.js validation.

## Global Constraints

- Product name is **Wire Runner** with descriptor **The Conversion Delivery Simulator**.
- Exact message is **“Site under construction. Check back soon.”**
- The experience is first-person-first and uses third-person only for tactical route context.
- Visual tone is professional simulation, not arcade gaming.
- Every route is curved; even the easiest route has a meaningful bend.
- The official Transamerica logo must be displayed unchanged and separately from original game artwork.
- Existing `site/` files and deployment configuration must remain unchanged.
- Respect `prefers-reduced-motion` and prevent horizontal overflow on mobile.

---

### Task 1: Contract Validator and Asset Foundation

**Files:**
- Create: `wire-runner/tests/validate-wire-runner.js`
- Create: `wire-runner/assets/transamerica-logo.svg`
- Create: `wire-runner/assets/wire-runner-road.webp`

**Interfaces:**
- Consumes: the approved design spec and downloaded/generated image files.
- Produces: local asset paths consumed by `wire-runner/index.html` and a validator runnable with `node wire-runner/tests/validate-wire-runner.js`.

- [x] **Step 1: Write the failing validator**

Create a dependency-free Node script that reads `wire-runner/index.html`, asserts required copy and accessibility tokens, extracts local `src` references, confirms each referenced file exists, and confirms `site/` remains outside the microsite.

```js
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, 'index.html');

if (!fs.existsSync(htmlPath)) throw new Error('Missing wire-runner/index.html');
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
  if (!html.includes(token)) throw new Error(`Missing required token: ${token}`);
});
for (const [, src] of html.matchAll(/src="([^"#?]+)"/g)) {
  if (/^(https?:|data:)/.test(src)) continue;
  if (!fs.existsSync(path.join(root, src))) throw new Error(`Missing local asset: ${src}`);
}
console.log('Wire Runner validation passed.');
```

- [x] **Step 2: Run the validator and verify the expected failure**

Run: `node wire-runner/tests/validate-wire-runner.js`  
Expected: FAIL with `Missing wire-runner/index.html`.

- [x] **Step 3: Acquire and create the local assets**

Download the current horizontal Transamerica SVG lockup without changing its paths, proportions, or colors. Generate a wide first-person delivery-vehicle road scene with winding asphalt, restrained red/navy visual cues, professional cinematic realism, negative space for page copy, and no logos or readable text. Save the final selected hero as `wire-runner/assets/wire-runner-road.webp`.

- [x] **Step 4: Verify asset integrity**

Run: `Get-Item wire-runner/assets/transamerica-logo.svg, wire-runner/assets/wire-runner-road.webp | Select-Object Name,Length`  
Expected: both files exist and have non-zero lengths.

- [x] **Step 5: Commit the validator and assets**

```powershell
git add -- wire-runner/tests/validate-wire-runner.js wire-runner/assets/transamerica-logo.svg wire-runner/assets/wire-runner-road.webp
git commit -m "feat: add Wire Runner visual foundation"
```

### Task 2: Responsive Teaser Page

**Files:**
- Create: `wire-runner/index.html`

**Interfaces:**
- Consumes: `assets/transamerica-logo.svg` and `assets/wire-runner-road.webp`.
- Produces: a directly openable teaser page with a semantic `main`, inline route-map SVG, and ambient motion disabled by reduced-motion preferences.

- [x] **Step 1: Implement the semantic page shell**

Create `wire-runner/index.html` with the exact title and construction copy, an unchanged Transamerica `<img>`, product wordmark, simulator descriptor, internal-training label, dominant first-person hero, and a compact tactical map panel.

```html
<main class="scene">
  <header class="brand-row">
    <img src="assets/transamerica-logo.svg" alt="Transamerica">
    <span>Internal training experience</span>
  </header>
  <section class="hero-copy">
    <p class="eyebrow">The Conversion Delivery Simulator</p>
    <h1>Wire <em>Runner</em></h1>
    <p class="construction">Site under construction. Check back soon.</p>
  </section>
</main>
```

- [x] **Step 2: Build the route-map graphic**

Add an inline SVG with `aria-label="Route from D1 through EFF to WIRE"`, one visibly curved route path, three labeled milestone nodes, and a moving route-progress dash used only when motion is allowed.

- [x] **Step 3: Apply the simulator visual system**

Embed responsive CSS for Transamerica red, deep navy, asphalt charcoal, warm off-white, restrained amber, cinematic image scrims, condensed display typography, glass-free tactile panels, focus-safe layout, and a mobile breakpoint that moves the tactical map below the copy.

- [x] **Step 4: Add restrained ambient behavior**

Use a few lines of JavaScript to apply subtle pointer-driven parallax to the background on fine-pointer devices. Add `@media (prefers-reduced-motion: reduce)` rules that stop map and parallax animation.

- [x] **Step 5: Run the contract validator**

Run: `node wire-runner/tests/validate-wire-runner.js`  
Expected: `Wire Runner validation passed.`

- [x] **Step 6: Commit the page**

```powershell
git add -- wire-runner/index.html
git commit -m "feat: build Wire Runner teaser page"
```

### Task 3: Rendered QA and Final Polish

**Files:**
- Modify if needed: `wire-runner/index.html`
- Modify if needed: `wire-runner/assets/wire-runner-road.webp`

**Interfaces:**
- Consumes: the completed local teaser.
- Produces: browser-verified desktop and mobile presentation with no broken assets, overflow, or console errors.

- [x] **Step 1: Open and inspect the page at desktop width**

Render `wire-runner/index.html` around 1440 × 900. Confirm the first-person road view dominates, copy remains readable, the logo is not altered or crowded, the map is secondary, and the page does not resemble a game menu.

- [x] **Step 2: Inspect the page at mobile width**

Render around 390 × 844. Confirm there is no horizontal overflow, the headline does not clip, the map remains legible, and the construction message remains above the fold or immediately adjacent to it.

- [x] **Step 3: Check runtime and reduced-motion behavior**

Confirm the console has no errors and that reduced-motion rules remove route-dash and parallax motion.

- [x] **Step 4: Re-run automated validation and scope checks**

Run: `node wire-runner/tests/validate-wire-runner.js`  
Expected: `Wire Runner validation passed.`  
Run: `git diff --name-only HEAD -- site .github`  
Expected: no output.

- [x] **Step 5: Commit any QA polish**

```powershell
git add -- wire-runner/index.html wire-runner/assets/wire-runner-road.webp
git commit -m "fix: polish Wire Runner responsive presentation"
```
