import { getBrandCards } from "@/sanity/lib/brands";

const BASE_URL = "https://samsaragroup.co.id";

export default async function sitemap() {
  const lastModified = new Date();

  /*
   * getBrandCards falls back to the seeded list, so an unreachable CMS cannot strip
   * the brand URLs out of the sitemap and cost indexation on pages that still work.
   */
  const cards = await getBrandCards();
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
