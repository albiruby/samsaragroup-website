# Changelog

All notable changes to the Samsara Group website are recorded here.
Format: keep the newest release on top. Dates are ISO (`YYYY-MM-DD`).

## 1.0.0 — 2026-11-18

First handover release of the five-brand website.

### Fixed

- Brand marquee no longer leaves a blank stretch before looping; the shared
  `BrandMarquee` measures the panel and repeats the list to cover it.
- About philosophy cards now use the same hover lift, hairline grid and
  terracotta title as the home brand cards.
- `force-dynamic` no longer overrides the 60-second Sanity data cache on every
  request. HTML stays dynamic (CSP nonce), the data layer is cached again.
- 404/500 pages no longer render with zero horizontal padding (`px-5vw` was not
  a valid Tailwind utility).
- Sitemap no longer stamps every URL with the current time; brand URLs use the
  document's `_updatedAt`.
- CSP image allowlist dropped two hosts that were never used
  (`images.unsplash.com`, `lh3.googleusercontent.com`).

### Documentation

- Smoke count corrected to 77; stale `PageTransition`, `urlFor`, `CARD_LOGO`
  and menu Layout/Download references removed.
- Handover, release checklist, maintenance guide and CMS tutorial aligned with
  the current code.
