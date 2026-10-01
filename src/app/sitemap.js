import { getWorlds } from "@/sanity/lib/queries";

const BASE_URL = "https://samsaragroup.co.id";

export default async function sitemap() {
  const lastModified = new Date();

  let brandUrls = [];
  try {
    const worlds = await getWorlds();
    brandUrls = worlds
      .filter((w) => w.status === "active" && w.featured !== false && w.slug?.current)
      .map((w, i) => ({
        url: `${BASE_URL}/${w.slug.current}`,
        lastModified,
        changeFrequency: "monthly",
        priority: i < 3 ? 0.8 : 0.7,
      }));
  } catch {
    brandUrls = [];
  }

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
