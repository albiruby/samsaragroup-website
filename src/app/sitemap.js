import { SITE_URL } from "@/lib/site";
import { getBrandCards } from "@/sanity/lib/brands";

const BASE_URL = SITE_URL;

/**
 * Without this the route was generated once at build time, so a brand created or
 * renamed in the Studio did not appear in sitemap.xml until the next deploy — and
 * the "Hide from Search Engines" filter below could not drop one either. Sixty
 * seconds matches the fetch cache the Sanity queries already use.
 */
export const revalidate = 60;

export default async function sitemap() {
  const lastModified = new Date();

  /*
   * getBrandCards falls back to the seeded list, so an unreachable CMS cannot strip
   * the brand URLs out of the sitemap and cost indexation on pages that still work.
   *
   * Brands marked "Hide from Search Engines" are dropped: their pages already send
   * `robots: noindex`, and listing a URL here would contradict that.
   */
  const cards = (await getBrandCards()).filter((c) => !c.noIndex);
  const brandUrls = cards.map((c, i) => ({
    url: `${BASE_URL}${c.href}`,
    lastModified,
    changeFrequency: "monthly",
    priority: i < 3 ? 0.8 : 0.7,
  }));

  const staticUrls = [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/brands`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...brandUrls,
    {
      url: `${BASE_URL}/career`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/events`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  return staticUrls;
}
