import { getEvents } from "@/sanity/lib/queries";

const BASE_URL = "https://samsaragroup.co.id";

export default async function sitemap() {
  const lastModified = new Date();

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
    {
      url: `${BASE_URL}/menu`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/samsara`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/svarga`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/acasa`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/outpace`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/grove`,
      lastModified,
      changeFrequency: "monthly",
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

  let eventUrls = [];
  try {
    const events = await getEvents();
    eventUrls = events
      .filter((e) => e.slug?.current)
      .map((e) => ({
        url: `${BASE_URL}/events/${e.slug.current}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.6,
      }));
  } catch {
    eventUrls = [];
  }

  return [...staticUrls, ...eventUrls];
}
