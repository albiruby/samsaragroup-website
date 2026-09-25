# Samsara Group — Project Documentation

---

## 1. PROJECT BRIEF

**Project:** Samsara Group Website

**Purpose:** Memperkenalkan Samsara Group sebagai ecosystem of places, experiences, culture, and hospitality.

**Primary Goals:**
1. Brand introduction
2. Showcase Worlds (Samsara, Svarga, Acasa)
3. Showcase Experiences
4. Events
5. Journal
6. Collaborations/Partnerships
7. Locations
8. Careers
9. Contact

**Primary Audience:**
- Visitors
- Potential customers
- Partners
- Media
- Prospective employees

**Positioning Brand:** Modern Nostalgia × Contemporary Hospitality × Editorial Storytelling

**Karakter Website:** Editorial, cinematic, restrained, premium — bukan loud atau playful.

**Scope V1:** Full website dengan 30+ halaman, CMS integration, responsive, SEO-ready.

**Out of Scope:** E-commerce, booking engine, membership portal, mobile app.

---

## 2. CONTENT INVENTORY

| Content        | Source      | Status  | CMS? |
| -------------- | ----------- | ------- | ---- |
| Hero           | Brand team  | Ready   | No   |
| About/Philosophy | Brand team | Ready  | No   |
| Worlds         | Brand team  | Ready   | No   |
| Events         | Marketing   | Dynamic | Yes  |
| Journal        | Editorial   | Dynamic | Yes  |
| Locations      | Operations  | Dynamic | Yes  |
| Careers        | HR          | Dynamic | Yes  |
| Collaborations | Partnerships| Dynamic | Yes  |
| Contact        | Admin       | Static  | No   |
| Legal (Privacy/Terms) | Legal | Static | No  |

### Home
- Hero (full-screen, cinematic)
- Philosophy / About
- Worlds (4 tiles)
- Photo Marquee
- Experiences
- Journal (latest)
- Collaborations
- CTA
- Footer

### Worlds
- Samsara (The Sanctuary — Acoustics · Dining · Retreat)
- Svarga (The Highlands — Hospitality · Stillness · Nature)
- Acasa (Leisure Rituals — Movement · Athletics · Community)

Each world page:
- Hero image
- Tagline
- Disciplines
- Specs/details
- Location info
- Related experiences

### Journal
- title
- slug
- category
- author
- date
- excerpt
- content
- image
- world (optional)

### Events
- title
- slug
- date
- time
- location
- description
- image
- world

### Locations
- name
- slug
- region
- address
- phone
- hours
- mapUrl
- image
- world

### Careers
- title
- slug
- department
- location
- type (full-time, part-time, contract)
- description
- requirements

### Collaborations
- title
- slug
- partner
- description
- image

---

## 3. SITEMAP / INFORMATION ARCHITECTURE

```
/
├── about                    (The Group)
│
├── worlds
│   ├── samsara
│   ├── svarga
│   └── acasa
│
├── events
│   ├── [slug]
│   ├── moonlit-session
│   └── nocturne
│
├── journal
│   ├── [slug]
│   └── sanctuary-of-sound
│
├── collaborations
│
├── locations
│   ├── jakarta
│   ├── ubud
│   └── canggu
│
├── careers
│   ├── [slug]
│   └── lead-spatial
│
├── contact
├── community
│
├── experiences (categories)
│   ├── music
│   ├── dining
│   ├── hospitality
│   ├── design
│   └── lifestyle
│
├── privacy
├── terms
└── 404
```

---

## 4. USER FLOWS

### Flow 1: Brand Discovery
```
Homepage → About → Worlds → Samsara → Location → Contact
```

### Flow 2: Event Discovery
```
Homepage → Events → Event Detail → Location → Contact
```

### Flow 3: Journal Reading
```
Homepage → Journal → Article → Related World → Location
```

### Flow 4: Career
```
Homepage → Careers → Job Opening → Apply
```

### Flow 5: Partnership
```
Homepage → Collaborations → Partnership Detail → Contact
```

### Flow 6: Location Finding
```
Homepage → Locations → Location Detail → Map/Contact
```

---

## 5. DESIGN SYSTEM

### Typography
**Primary:** Helvetica Neue
**Weights:** Regular, Medium, Bold, Light, Thin, Heavy
**No italic. No oblique. No decorative fonts.**

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| primary | #000000 | Text, backgrounds |
| surface | #fdf9f0 | Page background |
| surface-container | #f1eee5 | Card backgrounds |
| surface-container-low | #f7f3ea | Subtle sections |
| surface-container-high | #ece8df | Elevated surfaces |
| on-surface | #1c1c17 | Primary text |
| on-surface-variant | #494740 | Secondary text |
| secondary | #6d5b4c | Accent text |
| secondary-container | #f4dbc8 | Accent backgrounds |
| terracotta | #A86B52 | Highlight/accent |
| outline | #7a776f | Borders |
| outline-variant | #cbc6bd | Light borders |

### Layout
- 12-column desktop, responsive tablet, 4-column/flexible mobile
- Content width: 88-92vw
- Max-width: 1520px
- Container: `max-w-[1520px] mx-auto px-6 lg:px-10`

### UI
- 1px borders
- 0-4px radius (except FloatingFilter pill)
- Minimal shadows
- Outline CTAs
- Editorial tiles
- Cinematic imagery

---

## 6. VISUAL REFERENCES

| # | Category | Reference |
|---|----------|-----------|
| 01 | Typography | Helvetica Neue editorial weight usage |
| 02 | Navigation | Restrained top nav, minimal links |
| 03 | Hero | Full-screen cinematic, bottom-left text |
| 04 | Editorial layout | Asymmetric grids, generous spacing |
| 05 | Image treatment | Full-bleed, high contrast |
| 06 | Cards | Minimal, 1px border, hover states |
| 07 | Events | Date-forward, image-heavy |
| 08 | Journal | Category-filtered, editorial grid |
| 09 | Locations | Map integration, contact info |
| 10 | Mobile | Single-column, stacked |
| 11 | Motion | Subtle fade, parallax, marquee |
| 12 | Footer | Minimal, links only |

---

## 7. PAGE SPECS

### Homepage
```
Hero (full-screen, cinematic image, text bottom-left)
↓
Philosophy ("More Than a Place")
↓
Four Worlds (4-tile grid)
↓
Photo Marquee (continuous scroll)
↓
Experiences (category tiles)
↓
Journal (latest 3)
↓
Collaborations
↓
CTA
↓
Footer
```

### World Pages (samsara, svarga, acasa)
```
Hero (full-screen image)
↓
Tagline + Disciplines
↓
Specs/Details (responsive rows)
↓
Locations info
↓
Related content
```

### Journal
```
Filter bar (category)
↓
Grid (3-col desktop, 2-col tablet, 1-col mobile)
↓
Article cards
```

### Events
```
Filter bar
↓
Event list
↓
Event detail (dynamic route)
```

### Locations
```
Location list
↓
Location detail (map, contact, hours)
```

### Careers
```
Job listing
↓
Job detail (dynamic route)
↓
Apply CTA
```

---

## 8. ASSET INVENTORY

### Logo
| Asset | Purpose | Format | Status |
|-------|---------|--------|--------|
| logosamslight.png | Header (light) | PNG | Ready |
| logosamsdark.png | Header (dark) | PNG | Ready |
| logodoanglight.png | Floating filter / Favicon | PNG | Ready |
| logodoangdark.png | Floating filter (dark) | PNG | Ready |
| teslogosamsara1.png | Preloader | PNG | Ready |
| icon.png | Browser favicon | PNG | Ready |

### Images
| Asset | Purpose | Status |
|-------|---------|--------|
| tampilanawal.webp | Hero background | Ready |
| Hero images per world | World pages | Ready/Placeholder |
| Location images | Location pages | Ready/Placeholder |
| Event images | Event pages | Ready/Placeholder |
| Journal images | Article pages | Ready/Placeholder |

### Fonts
| Font | Format | Status |
|------|--------|--------|
| HelveticaNeue-Regular | OTF/TTF | Ready |
| HelveticaNeue-Medium | OTF | Ready |
| HelveticaNeue-Bold | OTF | Ready |
| HelveticaNeue-Light | OTF | Ready |
| HelveticaNeue-Thin | OTF | Ready |
| HelveticaNeue-Heavy | OTF | Ready |

---

## 9. CMS / DATA MODEL

### MUST CMS
- **Event** — title, slug, date, time, location, description, image, world
- **Article** — title, slug, category, author, date, excerpt, content, image, world, seo
- **JobOpening** — title, slug, department, location, type, description, requirements
- **Location** — name, slug, region, address, phone, hours, mapUrl, image, world
- **Collaboration** — title, slug, partner, description, image

### SHOULD CMS
- **World** — name, tagline, disciplines, description, image
- **Product** — name, description, image, world
- **ContactInfo** — email, phone, address, social links

### CODE (Static)
- Navigation structure
- Footer structure
- Design system
- Typography
- Colors
- CTA labels
- Philosophy text
- Legal content

### Sanity Config
- Project ID: `p5zu5azj`
- Dataset: `production`
- 8 schemas total

---

## 10. TECH STACK

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React |
| Language | JavaScript (with TypeScript config) |
| Styling | Tailwind CSS v4 |
| CMS | Sanity v3 |
| Images | next/image + Sanity image CDN |
| Animation | CSS + IntersectionObserver (framer-motion removed) |
| Deployment | Vercel / appropriate hosting |
| Repository | GitHub (`albiruby/SAMS-SAMS`) |

### Key Principles
- Server Components by default
- `"use client"` only when needed
- No unnecessary dependencies
- Static generation where possible

---

## 11. FUNCTIONAL REQUIREMENTS

### Navigation
- [x] Desktop nav (THE GROUP, EVENTS, JOURNAL, PARTNERSHIPS, WORLDS dropdown)
- [x] Mobile menu (full-screen overlay, focus trap, Escape key)
- [x] WORLDS dropdown (Samsara, Svarga, Acasa)
- [x] Sticky header (transparent on home top, solid when scrolled)
- [x] Active route indication

### FloatingFilter
- [x] Fixed right-side pill
- [x] Category filter (ALL, MUSIC, DINING, HOSPITALITY, DESIGN, LIFESTYLE, COMMUNITY)
- [x] Logo icon (logodoangdark.png)

### Journal
- [x] Listing page
- [x] Category filtering
- [x] Detail page (dynamic route)
- [x] Related articles

### Events
- [x] Listing page
- [x] Detail pages (moonlit-session, nocturne)
- [x] Dynamic route support

### Careers
- [x] Listing page
- [x] Detail page (dynamic route)
- [x] Application CTA

### Locations
- [x] Listing page
- [x] Detail pages (jakarta, ubud, canggu)

### Contact
- [x] Contact page
- [x] Form (if implemented)

### Preloader
- [x] SessionStorage gated (plays once per session)
- [x] Uses teslogosamsara1.png

---

## 12. RESPONSIVE SPECIFICATION

### Breakpoints
```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Approach
- Fluid layout with clamp(), min(), max()
- CSS Grid + Flexbox
- Responsive images
- Breakpoints only when layout must change

### Key Responsive Rules
- Hero: `min-h-[100dvh]` / `h-[100dvh]`
- Nav: `lg:flex` desktop, hamburger `< lg`
- Cards: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- World pages: `aspect-[4/3] md:aspect-[21/9]`
- Spec rows: `flex-col sm:flex-row sm:justify-between`
- Gaps: `gap-8 lg:gap-16`
- Section margins: `mb-16 lg:mb-32`
- Touch targets: min 44×44px

---

## 13. MOTION SPECIFICATION

### Allowed
- Hero: slow cinematic reveal
- Section: fade + translate (ScrollReveal)
- Image: clip/reveal + subtle scale (FadeInImage)
- Hover: 1.02–1.04 image scale
- Header: transparent → solid on scroll
- Marquee: continuous linear scroll
- Text: StaggerText letter-by-letter reveal

### Not Allowed
- Bounce
- Elastic
- Excessive parallax
- Scroll hijacking
- Animation everywhere

### Accessibility
- `prefers-reduced-motion: reduce` — all animations disabled
- Parallax disabled on mobile (<768px)

---

## 14. SEO REQUIREMENTS

### Per Page
- title
- description
- canonical
- OG image
- robots

### Dynamic Content
- Article, Event, Location, Career, Collaboration — dynamic metadata

### Global
- sitemap.xml (auto-generated)
- robots.txt
- JSON-LD (Organization, AboutPage, ItemList/Place, Event list)
- Semantic HTML
- Heading hierarchy (h1 → h2 → h3)
- Internal linking
- metadataBase: `https://samsaragroup.co.id`

---

## 15. ACCESSIBILITY REQUIREMENTS

- [x] Semantic HTML
- [x] Keyboard navigation
- [x] Focus states
- [x] Alt text on images
- [x] Contrast ratios
- [x] ARIA only when necessary
- [x] Touch targets (min 44×44px)
- [x] Form labels
- [x] Error states
- [x] Reduced motion support
- [x] Skip-to-content link (`#main-content`)
- [x] Screen reader support
- [ ] 200% zoom tested

---

## 16. SECURITY REQUIREMENTS

- [x] Environment variables (.env.local)
- [x] No exposed write tokens
- [x] Form validation
- [x] Security headers (X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy, Permissions-Policy)
- [ ] CSP header
- [ ] Rate limiting
- [ ] Spam protection

---

## 17. PERFORMANCE TARGET

- [x] LCP — hero image optimized
- [x] CLS — minimal (explicit image dimensions)
- [x] INP — minimal client JS
- [x] Below-fold images lazy loaded
- [x] Server Components by default
- [x] Third-party scripts controlled
- [x] No framer-motion (removed)
- [x] Fonts optimized (local @font-face)

---

## 18. ERROR / EMPTY / LOADING STATES

- [x] 404 page (Next.js not-found)
- [x] CMS fallback (try/catch in queries)
- [x] Missing images → styled placeholders
- [x] Empty event list → graceful handling
- [ ] Form submission error states
- [ ] API failure states
- [ ] 500 page

---

## 19. ANALYTICS (Planned)

- page_view
- world_view
- event_view
- journal_view
- location_view
- reservation_click
- contact_submit
- career_view
- career_apply
- external_link_click

---

## 20. LEGAL / BUSINESS

- [x] Privacy Policy page
- [x] Terms page
- [ ] Cookie requirements
- [ ] Contact data handling
- [ ] Analytics disclosure
- [ ] Image licenses
- [ ] Font licenses

---

## 21. ACCEPTANCE CRITERIA

### Homepage
- [x] Hero responsive (full-screen, text bottom-left)
- [x] CTA works
- [x] Worlds section
- [x] Journal section
- [x] Collaboration section
- [x] Mobile responsive
- [x] Tablet responsive
- [x] Desktop responsive
- [x] SEO metadata
- [x] Accessibility basics
- [x] Performance optimized

### Events
- [x] CMS data ready
- [x] Dynamic routes
- [x] SEO
- [x] Images
- [x] 404 handling
- [x] Mobile responsive

### Journal
- [x] CMS data ready
- [x] Dynamic routes
- [x] Category filtering
- [x] SEO
- [x] Mobile responsive

### Careers
- [x] CMS data ready
- [x] Dynamic routes
- [x] SEO
- [x] Mobile responsive

---

## 22. QA PLAN

### Functional
- [x] Navigation works
- [x] CMS data loads
- [x] Internal links work
- [x] Filters work
- [x] Mobile menu works

### Visual
- [x] Desktop looks correct
- [ ] Tablet looks correct
- [ ] Mobile looks correct

### Browser
- [ ] Chrome
- [ ] Safari
- [ ] Firefox
- [ ] Edge

### Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader
- [ ] Zoom 200%
- [ ] Reduced motion

### Performance
- [ ] LCP good
- [ ] CLS minimal
- [ ] INP good
- [ ] Bundle size reasonable
- [ ] Images optimized

---

## 23. DEFINITION OF DONE

### Functional
- [x] All routes work
- [x] No broken links
- [x] CMS works
- [x] Error states handled
- [ ] Forms work completely

### Design
- [x] Design system consistent
- [x] Typography consistent (Helvetica Neue only)
- [x] No random fonts
- [x] No italic/oblique
- [x] Responsive across devices

### Accessibility
- [x] Keyboard navigation
- [x] Focus states
- [x] Contrast ratios
- [x] Alt text
- [x] Reduced motion
- [ ] 200% zoom

### SEO
- [x] Metadata per page
- [x] Sitemap
- [x] Robots.txt
- [x] JSON-LD
- [x] Semantic HTML

### Security
- [x] No exposed secrets
- [x] Validation
- [x] Security headers
- [ ] CSP
- [ ] Rate limiting

### Performance
- [x] Optimized images
- [x] Optimized fonts
- [x] Minimal client JS
- [ ] Good Core Web Vitals (real-world)

### Code
- [x] Build passes (33 pages clean)
- [x] No unnecessary dependencies
- [ ] TypeScript strict (currently JS)
- [ ] Tests

### Deployment
- [x] Production env configured
- [ ] Domain connected
- [x] HTTPS
- [ ] Analytics
- [ ] Monitoring

---

## 24. BUILD STATUS

**Total Pages:** 33 (clean build, zero errors)

**Static (○):** 30 pages
**SSG (●):** 3 pages (careers/[slug], events/[slug], journal/[slug])

**Framework:** Next.js 16.3.5 (Turbopack)

**Git:** `https://github.com/albiruby/SAMS-SAMS.git` (master branch)

**Last Push:** `73f5e2b` — responsive layout, header logo crop, hero text position, nav links restore, accessibility improvements
