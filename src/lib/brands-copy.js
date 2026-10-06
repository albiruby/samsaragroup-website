/**
 * Editorial copy for each brand.
 *
 * Single source of truth: the BRANDS dropdown, the homepage brand section and
 * the seed skeleton all read these names, so a wording change happens in one
 * place. The CMS still owns the logo, images and ordering.
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

export const BRAND_COPY_BY_SLUG = Object.fromEntries(
  BRAND_COPY.map((b) => [b.slug, b])
);

export function brandCopy(slug) {
  return BRAND_COPY_BY_SLUG[String(slug || "").toLowerCase()] || null;
}