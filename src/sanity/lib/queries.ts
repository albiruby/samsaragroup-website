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
    "menuPanels": menuPanels[]{ _key, tabLabel, layout, downloadUrl, "src": image.asset->url, "width": image.asset->metadata.dimensions.width, "height": image.asset->metadata.dimensions.height },
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
  theme,
  heroEyebrow,
  heroTitle,
  heroIntro,
  menuHeading,
  seoTitle,
  seoDescription,
  socialImage,
  noIndex,
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

export type BrandNavRow = {
  title?: string;
  brands: unknown[];
};

export type BrandNavConfig = {
  rows: BrandNavRow[];
  seeAllLabel?: string;
  emptyLabel?: string;
};

/**
 * The document that owns the BRANDS dropdown: which brands sit in which row, in
 * which order. Returns null when no one has created it, and the caller falls
 * back to deriving rows from the brand documents themselves.
 */
export async function getBrandNavConfig(): Promise<BrandNavConfig | null> {
  try {
    return await client.fetch(
      `*[_type == "brandNav"][0]{
        seeAllLabel,
        emptyLabel,
        "rows": rows[]{ title, "brands": brands[]->${WORLD_PROJECTION} }
      }`,
      {},
      revalidate
    );
  } catch (e) {
    console.error("getBrandNavConfig failed:", e.message);
    return null;
  }
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

export type Career = {
  _id: string;
  title?: string;
  slug?: { current?: string } | string;
  department?: string;
  brand?: string;
  location?: string;
  employmentType?: string;
  summary?: string;
  description?: string;
  requirements?: { _key?: string; text?: string }[] | null;
  applyUrl?: string;
  isUrgent?: boolean;
  postedAt?: string;
};

export type CareerList = {
  jobs: Career[];
  /** True when the CMS could not be reached, so the page can stay honest about it. */
  unavailable: boolean;
};

export async function getCareers(): Promise<CareerList> {
  try {
    const docs = await client.fetch(
      `*[_type == "career" && status == "active"] | order(order asc, title asc) {
        _id, title, slug, department, brand, location, employmentType,
        summary, description,
        "requirements": requirements[]{ _key, text },
        applyUrl, isUrgent, postedAt
      }`,
      {},
      revalidate
    );
    return { jobs: (docs as Career[]).filter((c) => c.title && c.slug), unavailable: false };
  } catch (e) {
    console.error("getCareers failed:", e.message);
    return { jobs: [], unavailable: true };
  }
}

export type CareerPageDoc = {
  eyebrow?: string;
  title?: string;
  intro?: string;
  theme?: string;
  showBrandStrip?: boolean;
  positionsHeading?: string;
  emptyHeadline?: string;
  emptyMessage?: string;
  applyUrl?: string;
  applyNote?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export async function getCareerPage(): Promise<CareerPageDoc | null> {
  try {
    return await client.fetch(
      `*[_type == "careerPage"][0] {
        eyebrow, title, intro, theme, showBrandStrip,
        positionsHeading, emptyHeadline, emptyMessage, applyUrl, applyNote,
        seoTitle, seoDescription
      }`,
      {},
      revalidate
    );
  } catch (e) {
    console.error("getCareerPage failed:", e.message);
    return null;
  }
}

export async function getContactInfo() {
  try {
    return await client.fetch(
      `*[_type == "contactInfo"][0] { _id, whatsapp[]{label, city, display, phone}, addresses[]{label, address}, hours }`,
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
