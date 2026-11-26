# Changelog

All notable changes to the Samsara Group website are recorded here.
Format: keep the newest release on top. Dates are ISO (`YYYY-MM-DD`).

## 1.1.2 — 2026-11-26

### Added

- Home Page SEO fields in Studio and unique meta descriptions for Home and About.
- LocalBusiness JSON-LD for the three brands with complete NAP data: Samsara,
  Svarga, and Acasa.
- Visible H1 text for the logo-only brand H1s (visually hidden; no visual
  change).
- `npm run audit:pii` guard; CI checks the public Sanity dataset for forbidden
  document types and fields.
- Staging preview smoke workflow and Dependabot for npm and GitHub Actions.

### Changed

- Vercel function region set to Singapore (`sin1`) at the project level.
- Preview deployments show a STAGING badge; the `staging` branch is a mirror of
  `master` for the stable staging URL.

## 1.1.1 — 2026-11-21

### Fixed

- 404/500 pages now actually get horizontal padding. `px-5vw` was not a
  Tailwind utility; it is now the arbitrary value `px-[5vw]`.

### Added

- `apple-icon.png` (180×180) and a web app manifest at `/manifest.webmanifest`.
- `/.well-known/security.txt` pointing to the private advisory form.
- Unit tests for `isSafeSlug`, `safeUrl`, `jsonLdHtml` and the CSP built by
  `proxy.js`; `npm test` now runs every `scripts/*.test.mjs`.

### Changed

- Lockfile refreshed: `npm audit` reports 0 vulnerabilities.
- Documentation pruned from 10 to 5 active docs. The release checklist, client
  intake form, Hostinger migration guide, old security audit, and October work
  report are archived outside the repository.

## 1.1.0 — 2026-11-18

First handover release of the five-brand website.

### Fixed

- Brand marquee no longer leaves a blank stretch before looping; the shared
  `BrandMarquee` measures the panel and repeats the list to cover it.
- About philosophy cards now use the same hover lift, hairline grid and
  terracotta title as the home brand cards.
- `force-dynamic` no longer overrides the 60-second Sanity data cache on every
  request. HTML stays dynamic (CSP nonce), the data layer is cached again.
- Sitemap no longer stamps every URL with the current time; brand URLs use the
  document's `_updatedAt`.
- CSP image allowlist dropped two hosts that were never used
  (`images.unsplash.com`, `lh3.googleusercontent.com`).

### Documentation

- Smoke count corrected to 77; stale `PageTransition`, `urlFor`, `CARD_LOGO`
  and menu Layout/Download references removed.
- Handover, release checklist, maintenance guide and CMS tutorial aligned with
  the current code.

## 1.0.0 — 2026-11-12

- Repository release baseline (tag `v1.0.0`), including the project landing page.
