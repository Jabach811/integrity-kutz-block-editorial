# Integrity Kutz N' Stylez — "Roster Card" Website Design (v3.1)

Date: 2026-07-23
Status: Active — supersedes both the Block Editorial spec and the v3 "Roster Press" draft
Style reference: `DESIGN.md` at repo root (runwayml-inspired editorial system, installed via `npx getdesign add runwayml`)

## 1. Concept

Quiet editorial system, one loud brand truth: the shop's winged barber-pole
logo. The site follows the DESIGN.md language — paper-white canvas, near-black
ink, a single sans (Inter, tight display tracking, regular-weight headings),
black pill buttons, hairline dividers, no shadows, cinematic dark modules —
with exactly one sanctioned exception: **barber-pole red (`#B22234`) and blue
(`#2F5FA5`)**, drawn from the logo, used only for accent eyebrows, card trims,
and one animated barber-stripe divider.

The roster is presented as a set of collectible trading cards. Everything else
stays out of their way.

## 2. Page Structure

1. **Header** — transparent over the dark hero, solid scrim on scroll. Logo
   mark + name left, three links, white pill Book.
2. **Hero** — full-viewport ink stage. The logo front and center (no
   individual barber), eyebrow, display headline "Integrity never goes out of
   style.", sub-line, two pills. Staggered rise on load. Faint red/blue radial
   wash behind the logo.
3. **Barber-pole stripe** — 8px animated diagonal red/white/blue stripe. The
   single loud brand-motion moment.
4. **Ticker** — quiet monochrome marquee strip (walk-ins, hours line, address,
   services), hairline-bounded.
5. **The Roster** — white band, eyebrow+display lockup, trading-card grid.
6. **The Work** — gallery grid, full-color photography (no duotone gimmick),
   8px radii, subtle hover scale, lightbox.
7. **The Shop** — 5/7 editorial split, contained photo module (16px radius).
8. **Visit** — contained dark scrim panel (16px radius): address/directions,
   big phone, hours note (still owner-unverified — launch blocker), hiring line.
9. **Footer** — near-black, centered logo, one-line info, fine print.

## 3. Trading Cards (the feature)

Real card anatomy, 2.5×3.5 proportions (aspect 5/7), 14px-radius cardstock
with hairline border and soft paper shadow.

**Front:** framed photo with topline strip ("IKS · Roster '26" + № 01–11),
centered nameplate below, 3px accent trim rule. Under the name: the barber's
@instagram handle in the trim color; barbers without Instagram (Joel, Abel,
Kevin) fall back to their top two specialties in slate small-caps. Cards
alternate trims — odd numbers red, even numbers blue — like a print run with
two team colorways. Lewis's card is the sole exception: as owner he carries a
red/white/blue barber-pole striped trim (front and back) and an "Owner · № 01"
designation — the only card bearing the brand stripe itself. Hover and flip
scale cards up 8% for emphasis.

**Back:** cardstock stat card — mini logo + "Official roster card" brandline +
serial (№/11), name + position, hairline stat table (Specialties, Home shop,
Instagram when present), verbatim bio, full-width black pill Book action
(Call-to-book fallback for Argenis), flip-back control.

**Interaction:**
- Hover (pointer devices): lift + slight 3D tilt + one foil-sheen sweep. No
  hover-flip.
- Tap/click anywhere (links excluded) or the dedicated flip button: 3D Y-flip,
  600ms. Esc or tap outside flips back. `aria-expanded` tracked; focus moves
  to the back on flip.
- Mobile (<720px): the grid becomes a horizontal scroll-snap carousel with
  edge peek and a swipe hint. Cards are min(74vw, 300px) wide.
- Reduced motion: flip becomes a crossfade; sheen and tilt disabled.
- No JS: fronts render statically; a plain book/call link list appears.

Data: verbatim from `src/data/barbers.mjs`. No invented facts.

## 4. Motion Inventory (complete)

| Moment | Motion |
|---|---|
| Hero load | Logo, eyebrow, title, sub, CTAs rise+fade staggered |
| Pole stripe | Continuous slow diagonal scroll (18s loop) |
| Ticker | 40s marquee, pause on hover |
| Section entry | Once-only rise+fade (IntersectionObserver) |
| Cards | Hover lift/tilt + foil sheen; tap 3D flip; stagger entry |
| Gallery tiles | 1.03 scale on hover |
| Pills | 150ms micro-press |

All CSS-driven; JS toggles classes only; all reduced-motion safe.

## 5. Technical / Verification

Unchanged from v3: static no-framework site (`site/`), responsive WebP
renditions, Google Fonts (Inter only), JSON-LD without hours until verified,
WCAG AA, 44px touch targets, no horizontal overflow from 320px, usable with
JS disabled, verified against the live preview before handoff.
