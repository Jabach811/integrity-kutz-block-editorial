# Integrity Kutz N' Stylez — Block Editorial Website Design

Date: 2026-07-22
Status: Ready for user review

## 1. Objective

Replace the current generic GoDaddy presentation with a fast, mobile-first website that feels authentic to the shop: local, confident, energetic, slightly raw, and visibly connected to the people working there.

The redesign must make three actions effortless:

1. See the quality of the work.
2. Choose the right barber.
3. Book or call without confusion.

The visual edge must come from real photography, typography, composition, and shop language. It must not rely on fake graffiti, stereotypes, manufactured luxury, or AI-generated haircut work.

## 2. Primary Audience

- Existing customers who need a fast path to their barber's booking link.
- New local customers comparing work, personalities, and availability.
- Parents looking for kids' cuts.
- Customers interested in barbering, loc services, or tattoo services under one roof.
- Barbers considering the shop's hiring opportunity.

## 3. Approved Creative Direction

### Block Editorial

The site will combine neighborhood-barbershop energy with disciplined editorial structure.

- Core palette: near-black, dirty cream, oxblood red, and restrained neutral grays.
- Typography: oversized condensed display type paired with a highly readable sans serif.
- Composition: hard crops, strong asymmetry, poster-like labels, editorial spacing, and occasional overlapping elements.
- Texture: light grain, photocopy noise, ink wear, and stamped details used selectively.
- Photography: real people and real shop activity remain dominant.
- Motion: quick, deliberate transitions; no decorative animation that slows booking or obscures content.

## 4. Site Structure

The initial release will be a maintainable static site with a primary homepage and a dedicated gallery view. Barber details will open in on-page panels. The content model will preserve the option to generate individual barber pages later.

### Homepage sequence

1. **Header** — identity, navigation, and persistent Book Now action.
2. **Hero** — strong shop or in-chair image, "Integrity Never Goes Out of Style," a short positioning line, Choose Your Barber, and Get Directions.
3. **Credibility strip** — Tracy location, walk-ins welcome, open seven days, and services under one roof.
4. **Choose Your Barber** — compact roster cards with direct access to barber panels.
5. **Fresh Out the Chair** — eight-image homepage proof wall linked to the full gallery.
6. **Under One Roof** — concise barbering, loc, and tattoo service groups, shown only when supported by verified content.
7. **The Shop Story** — Lewis's experience, standards, and relationship to the community.
8. **Visit the Shop** — verified hours, address, phone, directions, and walk-in guidance.
9. **Join the Team** — focused hiring callout that does not interrupt the customer journey.
10. **Footer** — social links, contact details, navigation, and legal information.

## 5. Booking and Barber System

### Site-wide Book Now behavior

Every general Book Now action will open or scroll to **Choose Your Barber**. It will not default to Lewis or send visitors to an arbitrary external booking page.

### Barber cards

Each card will contain:

- Portrait
- Barber name
- Two or three verified specialties
- Short status or booking cue
- View Barber action

Long biographies will not appear in the roster grid.

### On-page barber panel

Selecting a barber opens:

- A right-side panel on wider screens
- A nearly full-screen sheet on mobile
- Portrait and optional work samples
- Concise biography
- Verified specialties
- Instagram link when available
- Primary Book with [Name] action
- Call to Book fallback when no working online booking link exists

The panel will update the URL with a stable fragment such as `#barber/lewis`. Direct links, browser back/forward behavior, and reopening the correct panel must work.

### Future individual pages

All barber content will come from a centralized barber record. Each record will include a reserved page slug, so future profile pages can reuse the same source data without duplicating biographies, links, or specialties.

## 6. Gallery — Fresh Out the Chair

The gallery is evidence, not decoration.

### Homepage treatment

- One large featured cut
- Two secondary detail or action images
- Five supporting images in an asymmetric editorial grid
- A clear View All Work action

### Full gallery

The full gallery will use a responsive editorial grid with optional filters:

- All Work
- Fades
- Kids
- Beards
- Locs
- Ink
- Shop Life

A filter will only appear when enough verified images exist to make that category credible.

### Image detail view

Selecting an image opens an accessible dark lightbox with:

- Large image
- Previous and next controls
- Keyboard and swipe navigation
- Barber attribution when verifiable
- Service label when verifiable
- Book This Barber action when attribution and booking information are available

Unknown barber or service information will remain unlabeled rather than being guessed.

## 7. Asset Treatment

The source library will preserve downloaded originals separately from processed production assets.

### Processing rules

- Manually select focal points so crops preserve the haircut and face.
- Upscale only images important enough to benefit from it.
- Apply denoising, sharpening, exposure correction, and color balancing conservatively.
- Use high-contrast black and white or oxblood duotone to make lower-resolution supporting images intentional.
- Keep the strongest work images in full color.
- Add light grain or print texture at the layout level when possible instead of permanently damaging source files.
- Do not fabricate customer results or use generated haircut images as portfolio evidence.

### Planned asset organization

```text
assets/
  source/       Unmodified site downloads and supplied originals
  processed/    Corrected and upscaled masters
  web/          Final responsive AVIF/WebP/JPEG renditions
  texture/      Reusable grain, ink, and print overlays
```

## 8. Content Model

Shop details, business hours, social links, services, barber records, gallery metadata, and booking destinations will be centralized rather than repeated throughout the markup.

The current website contains conflicting business hours: the homepage reports 8:00 a.m.–8:00 p.m., while the location page reports 9:00 a.m.–7:00 p.m. The new site will use one shared hours record. The hours must be confirmed with the owner before public launch; the implementation must not silently choose between the conflicting values.

## 9. Technical Architecture

The implementation will use a small static architecture suitable for simple hosting and long-term maintenance:

- Semantic HTML for content and navigation
- A small local build script that reads the centralized records and writes complete static HTML
- Modular CSS with centralized color, type, spacing, and motion tokens
- Vanilla JavaScript modules for barber panels, gallery filters, lightbox behavior, and URL state
- Centralized source records for barbers, services, shop details, and gallery entries
- Responsive image sources and lazy loading below the fold
- No framework dependency unless the implementation plan uncovers a concrete need

The build output will already contain the core content, phone numbers, directions, barber booking links, and gallery images. Client-side JavaScript will enhance that HTML with panels, filters, and lightboxes. If JavaScript fails, those essentials must remain accessible as ordinary content and links.

## 10. Error and Edge-Case Behavior

- Missing Booksy link: show Call to Book when a valid phone number exists.
- Missing portrait: use a designed name card, not a broken image or fake headshot.
- Missing gallery attribution: omit barber-specific booking controls.
- External booking failure: retain visible phone and Instagram options in the barber panel.
- Unsupported gallery category: hide the filter entirely.
- Broken or unavailable image: remove it from the visible grid and preserve layout rhythm.
- Invalid barber URL fragment: leave the roster visible without opening a random panel.
- Conflicting shop information: block public launch until the shared record is verified.

## 11. Responsive and Accessible Behavior

- Mobile is the primary booking experience.
- Touch targets will be at least 44 by 44 CSS pixels.
- Panels and lightboxes will trap focus, close with Escape, restore focus to the trigger, and expose clear accessible names.
- All functional imagery will receive meaningful alternative text; decorative textures will be ignored by assistive technology.
- Text and controls must meet WCAG AA contrast.
- Reduced-motion preferences will disable nonessential movement.
- Horizontal page overflow is prohibited.

## 12. Performance and Search

- Prioritize the hero image and defer below-fold media.
- Generate multiple image sizes and modern formats.
- Avoid loading the full gallery on the homepage.
- Keep third-party scripts to the minimum required.
- Use descriptive page titles, local business metadata, Open Graph tags, and `BarberShop` structured data.
- Preserve the shop name, Tracy address, phone number, service categories, social profiles, and verified hours consistently.

## 13. Verification

Implementation will be considered ready for review when:

- Every general Book Now action opens or reaches the barber roster.
- Every barber card opens the correct panel and restores browser history correctly.
- All verified booking, phone, Instagram, direction, and social links work.
- Missing data produces the documented fallback rather than an empty control.
- Gallery filters, keyboard navigation, swipe navigation, and lightbox focus behavior work.
- No viewport from 320 pixels wide upward has horizontal overflow.
- The site remains usable with JavaScript disabled.
- Automated checks cover data integrity, duplicate barber slugs, missing required fields, broken internal links, and accessibility-critical interaction states.
- Manual checks cover representative mobile and desktop browsers.
- Business hours are confirmed before any public deployment.

## 14. Initial Release Boundaries

Included:

- Homepage
- Dedicated gallery
- On-page barber panels
- Individual booking handoffs
- Location and contact information
- Hiring callout
- Processed responsive assets
- Local-business search metadata

Deferred but structurally supported:

- Individual barber pages
- Online booking owned directly by the site
- Customer accounts
- Content management system
- Automated Instagram synchronization
- Online store or product catalog
