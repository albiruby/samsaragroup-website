import { createImageUrlBuilder } from "@sanity/image-url";
import { client } from "./client";

const builder = createImageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source).auto("format");
}

/**
 * Sanity serves the full-resolution original unless a width is given, so a 320px
 * marquee tile was downloading a 1920px file. Callers that render at a known
 * size pass it here so the CDN returns only what the slot needs.
 */
export function sizedUrl(source, width: number) {
  return builder.image(source).auto("format").width(width).quality(70).url();
}

/**
 * Returns a usable CDN URL, or null when the CMS has no image (or a malformed
 * reference). Metadata generation must not throw just because a document is
 * incomplete or Sanity is temporarily unreachable.
 */
export function ogImageUrl(source): string | null {
  if (!source) return null;
  try {
    return builder.image(source).auto("format").url();
  } catch {
    return null;
  }
}
