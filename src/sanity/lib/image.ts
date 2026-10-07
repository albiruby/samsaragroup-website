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
