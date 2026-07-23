# Wire Runner Landing Page Design

**Date:** 2026-07-23  
**Status:** Approved concept, implementation pending  
**Product name:** Wire Runner  
**Descriptor:** The Conversion Delivery Simulator

## Purpose

Create a compact teaser site for an internal Transamerica conversion-training experience. The eventual simulator turns conversion work into a delivery route: the learner picks up people, documents, data, decisions, and funds, then moves each item through the correct handoffs so the plan reaches wire day ready.

The first deliverable is intentionally small: an atmospheric landing page with original simulator artwork and the exact message, **“Site under construction. Check back soon.”**

## Product Positioning

Wire Runner should feel like a professional training simulator with cinematic tension, not a colorful arcade game. The learner is not collecting points or racing a clock for entertainment. They are navigating uncertainty, incomplete information, dependency handoffs, and fixed deadlines.

The driving metaphor maps to the conversion workflow:

- The road is the conversion timeline.
- D1, EFF, and WIRE are route milestones.
- Pickups are inputs, people, decisions, documents, or funds that must be secured.
- Deliveries are completed handoffs to the correct downstream owner or destination.
- Curves, construction, weather, detours, and visibility represent complexity and operational risk.
- Even an easy route includes at least one meaningful bend, dependency, or judgment call. No route is a perfectly straight line.

## Camera Language

The default experience is first person from the driver's seat. The learner should see the road, mirrors, dashboard information, route cues, and approaching decisions from behind the wheel.

Third-person views are used sparingly and purposefully:

- a tactical map view before or between route segments;
- a brief exterior view when a pickup or delivery changes the state of the mission;
- a route recap that shows where the learner traveled, where risk appeared, and which choices affected the path.

The landing-page hero will preview both perspectives without resembling a game menu. The first-person windshield view remains dominant, while a smaller route-map element hints at the wider system.

## Visual Direction

The visual system combines Transamerica's professional brand presence with transportation, route-planning, and simulator interfaces.

- **Palette:** Transamerica red, deep navy, warm off-white, asphalt charcoal, and restrained amber for route warnings.
- **Atmosphere:** early-morning or dusk light, wet or textured road surfaces, distant route markers, and layered terrain.
- **Interface language:** navigation overlays, route cards, milestone signage, mirrors, and understated vehicle instrumentation.
- **Typography:** confident condensed display type for the product name, paired with a clean humanist sans-serif for supporting copy.
- **Motion:** slow parallax, subtle road-line movement, and calm status pulses. No bouncing buttons, neon arcade effects, or excessive HUD clutter.
- **Brand treatment:** the official Transamerica logo appears unchanged as a separate endorsement mark. It is not redrawn, distorted, or incorporated into generated artwork.

## Landing Page Composition

The page is a single responsive scene:

1. A small Transamerica endorsement lockup at the top.
2. The **Wire Runner** name and **The Conversion Delivery Simulator** descriptor.
3. A cinematic first-person road image with a winding route and subtle conversion milestone cues.
4. A restrained map card showing a curved route toward WIRE, reinforcing the occasional third-person planning view.
5. The exact construction message: **“Site under construction. Check back soon.”**
6. A small internal-training label so the page does not read like a public consumer product.

The page will not include fake navigation, disabled sign-in controls, fabricated release dates, email capture, or placeholder feature lists.

## Asset Set

The first release includes:

- one wide first-person hero image showing a winding route from inside a delivery vehicle;
- one route-map graphic built as deterministic HTML/CSS/SVG so it stays crisp and can later become interactive;
- one small app icon or badge derived from the route motif without modifying the Transamerica logo;
- the official Transamerica logo asset, stored separately and presented unchanged;
- responsive crops or layout handling for desktop and mobile.

Generated artwork must avoid readable fake corporate documents, personal data, recognizable customers, racing imagery, weapons, crashes, cartoon pickups, coins, scores, and generic gaming-controller symbols.

## File Isolation

The existing Integrity Kutz site remains untouched. Wire Runner will live in a new top-level `wire-runner/` folder with its own `index.html` and `assets/` directory. It will not be connected to the current deployment or navigation unless the user explicitly asks for that later.

## Accessibility and Responsive Behavior

- Maintain readable contrast over imagery using a controlled gradient scrim.
- Provide meaningful alt text for informative images and empty alt text for decorative elements.
- Respect `prefers-reduced-motion` by disabling ambient animation.
- Preserve the message and product identity at narrow mobile widths without horizontal scrolling.
- Keep the Transamerica mark clear and legible without crowding.

## Verification

Before handoff:

- open the page locally at desktop and mobile widths;
- confirm the exact construction message and page title;
- confirm every asset resolves locally;
- check for overflow, broken imagery, and console errors;
- confirm reduced-motion behavior;
- confirm the existing `site/` files and deployment configuration are unchanged.

## Future Simulator Boundary

This first release establishes the visual language only. It does not implement driving physics, levels, scoring, conversion-case logic, saved progress, or a playable map. Those systems should be designed as a separate phase after the teaser is approved, using the same first-person-first camera model and route-complexity rules.
