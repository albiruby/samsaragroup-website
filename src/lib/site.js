export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://samsaragroup.vercel.app"
).replace(/\/+$/, "");

export function siteUrl(path = "") {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function safeUrl(value) {
  if (typeof value !== "string" || value.trim() === "") return null;
  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:" ? value : null;
  } catch {
    return null;
  }
}

export const DEFAULT_OG_IMAGE = {
  url: "/og-default.png",
  width: 1200,
  height: 630,
  alt: "Samsara Group",
};

export function ogImages(image, alt = "Samsara Group") {
  const url = safeUrl(image);
  if (!url) return [{ ...DEFAULT_OG_IMAGE, url: siteUrl(DEFAULT_OG_IMAGE.url) }];
  // Sanity serves WebP when the browser asks for it, but social crawlers
  // request og:image without an Accept header for images and cannot render it.
  if (/\.webp($|\?)/i.test(url)) return [{ ...DEFAULT_OG_IMAGE, url: siteUrl(DEFAULT_OG_IMAGE.url) }];
  return [{ url, width: 1200, height: 630, alt }];
}

export const SITE_NAME = "Samsara Group";
export const SITE_LOCALE = "en_US";
export const SITE_LOCALE_ALT = "id_ID";

/**
 * Builds a complete openGraph object.
 *
 * Next.js replaces a nested openGraph object rather than merging it with the
 * root layout, so any page that declares openGraph without a helper like this
 * silently drops siteName, locale and type. Pages must call this instead of
 * hand-writing openGraph.
 */
export function openGraphFor({ path = "/", title, description, image, type = "website", alt } = {}) {
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    // The homepage is served at both "/" and the bare origin, so canonicalise
    // on the bare origin to avoid splitting ranking signals between the two.
    url: path === "/" ? SITE_URL : siteUrl(path),
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    localeAlternate: [SITE_LOCALE_ALT],
    type,
    images: ogImages(image, alt || title),
  };
}