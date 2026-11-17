/**
 * Fallback copy for the five established brands.
 *
 * The CMS is the source of truth. These values are only read when a CMS field is
 * empty or Sanity cannot be reached, so editing this file does not change the
 * live site while the documents are filled in.
 */
export const BRAND_COPY = [
  {
    slug: "samsara",
    name: "SAMSARA",
    title: "The Listening Room",
    disciplines: "Vinyl - Dining - Culture",
  },
  {
    slug: "svarga",
    name: "SVARGA",
    title: "The Heritage Table",
    disciplines: "Traditional - Dining - Nature",
  },
  {
    slug: "acasa",
    name: "ACASA",
    title: "The Leisure Retreat",
    disciplines: "Stay - Dining - Sports",
  },
  {
    slug: "outpace",
    name: "OUTPACE",
    title: "The Runners Club",
    disciplines: "Run - Refuel - Connect",
  },
  {
    slug: "grove",
    name: "GROVE",
    title: "The City Backyard",
    disciplines: "Coffee - Hangout - Grow",
  },
];

const BRAND_COPY_BY_SLUG = Object.fromEntries(
  BRAND_COPY.map((b) => [b.slug, b])
);

export function brandCopy(slug) {
  return BRAND_COPY_BY_SLUG[String(slug || "").toLowerCase()] || null;
}