import { client } from "./client";
import { urlFor } from "./image";

const revalidate = { next: { revalidate: 60 } };

export async function getEvents() {
  try {
    return await client.fetch(
      `*[_type == "event"] | order(date desc) { _id, title, slug, category, date, time, location, capacity, entry, description, image, featured, link }`,
      {},
      revalidate
    );
  } catch (e) {
    console.error("getEvents failed:", e.message);
    return [];
  }
}

const WORLD_PROJECTION = `{
  _id,
  name,
  slug,
  tagline,
  description,
  image,
  gallery,
  specifications,
  "sections": sections[]{
    _key,
    _type,
    type,
    heading,
    body,
    "specifications": specifications[]{ _key, label, value },
    "features": features[]{ _key, title, copy },
    "menuPanels": menuPanels[]{ _key, tabLabel, layout, downloadUrl },
    mapLat,
    mapLng,
    mapZoom
  },
  categories,
  speciality,
  logo,
  order,
  status,
  featured,
  address,
  instagramUrl,
  seoTitle,
  seoDescription,
  "ctas": ctas[]{ _key, _type, kind, label, url },
  "hours": hours[]{ _key, day, value }
}`;

type WorldSection = {
  _key?: string;
  _type?: string;
  type?: string;
  heading?: string;
  body?: string;
  specifications?: { label?: string; value?: string }[] | null;
};

type World = {
  _id: string;
  description?: string;
  specifications?: { label?: string; value?: string }[] | null;
  sections?: WorldSection[] | null;
};

/**
 * Bridges the CMS `sections` array back onto the flat `description` and
 * `specifications` fields the brand pages read. Explicitly authored top-level
 * values always win, so filling them in the Studio overrides the derived ones.
 */
function hydrateWorld(doc: World): World {
  const sections = Array.isArray(doc.sections) ? doc.sections : [];

  if (!doc.description?.trim()) {
    const vision = sections.find((s) => s.type === "text")?.body?.trim();
    if (vision) doc.description = vision;
  }

  if (!doc.specifications?.length) {
    const rows = sections
      .find((s) => s.type === "specs")
      ?.specifications?.filter((r) => r?.label);
    if (rows?.length) doc.specifications = rows;
  }

  return doc;
}

export async function getWorlds() {
  try {
    const docs = await client.fetch(
      `*[_type == "world"] | order(order asc, name asc) ${WORLD_PROJECTION}`,
      {},
      revalidate
    );
    return (docs as World[]).map(hydrateWorld);
  } catch (e) {
    console.error("getWorlds failed:", e.message);
    return [];
  }
}

export async function getWorldBySlug(slug: string) {
  if (!slug) return null;
  try {
    const doc = await client.fetch(
      `*[_type == "world" && slug.current == $slug][0] ${WORLD_PROJECTION}`,
      { slug },
      revalidate
    );
    return doc ? hydrateWorld(doc as World) : null;
  } catch (e) {
    console.error(`getWorldBySlug(${slug}) failed:`, e.message);
    return null;
  }
}

export async function getContactInfo() {
  try {
    return await client.fetch(
      `*[_type == "contactInfo"][0] { _id, emails, addresses, hours, inquiryTypes }`,
      {},
      revalidate
    );
  } catch (e) {
    console.error("getContactInfo failed:", e.message);
    return null;
  }
}

export async function getCarouselImages(placement) {
  try {
    return await client.fetch(
      `*[_type == "carouselImage" && placement == $placement && active != false] | order(order asc) { title, image, alt, brand }`,
      { placement },
      revalidate
    );
  } catch (e) {
    console.error("getCarouselImages failed:", e.message);
    return [];
  }
}
