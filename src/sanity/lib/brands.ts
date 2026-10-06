import { getWorlds } from "./queries";
import { urlFor } from "./image";
import { BRAND_COPY, brandCopy } from "@/lib/brands-copy";

type NavWorld = {
  _id: string;
  name?: string;
  slug?: { current?: string } | string;
  speciality?: string;
  categories?: string[] | null;
  logo?: unknown;
  image?: unknown;
  order?: number;
  status?: string;
  featured?: boolean;
};

/**
 * Navigation skeleton for the BRANDS dropdown.
 *
 * Each row is one brand, labelled with its descriptive title rather than a
 * category. The order is a navigation design decision, not content, so it lives
 * here: the five established brands keep their curated titles, and anything
 * created in Sanity is appended at the end rather than silently dropped.
 */
const CATEGORY_SEED = BRAND_COPY.map(({ slug, title }) => ({
  name: title,
  legacy: [slug],
}));

/**
 * Local logo assets for the five established brands. These win over any CMS logo
 * because the footer marquee and the /brands cards each need a different variant:
 * the marquee uses the black mark, the cards use the white mark with `invert`.
 */
const LEGACY_LOGO: Record<string, string> = {
  samsara: "/Black Logo Samsara/blackfullsamping.png",
  svarga: "/assetsvarga/Svarga logo black.webp",
  acasa: "/assetacasa/logoacasahitam.webp",
};

/**
 * Separate marks for the /brands cards. The CMS `logo` is the mark used on the
 * brand page header; the cards need the white variant so `brightness-0 invert`
 * keeps it legible on photography.
 */
const CARD_LOGO: Record<string, string> = {
  samsara: "/White Logo Samsara/whitefullsamping.png",
  svarga: "/assetsvarga/Svarga logo black.webp",
  acasa: "/assetacasa/Main Logo3.webp",
};

export const LEGACY_CARD_FALLBACK: Record<string, string> = {
  samsara: "/ambiencesamsara/DSC08177.webp",
  svarga: "/assetsvarga/ADR (9 of 15).webp",
  acasa: "/assetacasa/ADR-06539.webp",
  outpace: "/ambiencesamsara/DSC09014.webp",
  grove: "/ambiencesamsara/DSC09048.webp",
};

function slugOf(world: NavWorld): string {
  const raw = world.slug;
  if (typeof raw === "string") return raw;
  return raw?.current ?? "";
}

/** Only active, featured brands are public. */
function isPublic(world: NavWorld): boolean {
  return world.status === "active" && world.featured !== false;
}

export type NavBrand = {
  slug: string;
  label: string;
  speciality: string;
  href: string;
  logo: string | null;
  image: unknown;
};

export type BrandNav = {
  categories: { name: string; brands: NavBrand[] }[];
  all: NavBrand[];
};

function toBrand(world: NavWorld): NavBrand {
  const slug = slugOf(world);
  return {
    slug,
    label: world.name ?? slug,
    speciality: world.speciality ?? "",
    href: `/${slug}`,
    logo: LEGACY_LOGO[slug] ?? (world.logo ? urlFor(world.logo as never).url() : null),
    image: world.image ?? null,
  };
}

function fallbackNav(): BrandNav {
  const worlds = CATEGORY_SEED.map(({ name, legacy }) => ({
    name,
    brands: legacy.map((slug) => ({
      slug,
      label: slug.charAt(0).toUpperCase() + slug.slice(1),
      speciality: "",
      href: `/${slug}`,
      logo: LEGACY_LOGO[slug] ?? null,
      image: null,
    })),
  }));
  const all = Array.from(new Set(CATEGORY_SEED.flatMap((c) => c.legacy))).map((slug) =>
    worlds.flatMap((c) => c.brands).find((b) => b.slug === slug)
  );
  return { categories: worlds, all };
}

/**
 * The /brands cards for the established brands, mirroring what the page rendered
 * before it read from Sanity. Used only when the CMS is unreachable, so a Sanity
 * outage cannot leave the page with zero cards.
 *
 * `tagline` comes from BRAND_COPY rather than being written out here, so the
 * fallback cannot drift away from the dropdown's titles.
 */
const SEED_CARDS = [
  {
    slug: "samsara",
    fallback: "/ambiencesamsara/DSC08177.webp",
    logo: "/White Logo Samsara/whitefullsamping.png",
    image: null,
  },
  {
    slug: "svarga",
    fallback: "/assetsvarga/ADR (9 of 15).webp",
    logo: "/assetsvarga/Svarga logo black.webp",
    image: null,
  },
  {
    slug: "acasa",
    fallback: "/assetacasa/ADR-06539.webp",
    logo: "/assetacasa/Main Logo3.webp",
    image: null,
  },
  {
    slug: "outpace",
    fallback: "/ambiencesamsara/DSC09014.webp",
    logo: null,
    image: null,
  },
  {
    slug: "grove",
    fallback: "/ambiencesamsara/DSC09048.webp",
    logo: null,
    image: null,
  },
].map((c) => ({
  ...c,
  href: `/${c.slug}`,
  name: (brandCopy(c.slug)?.name || c.slug).toUpperCase(),
  tagline: brandCopy(c.slug)?.title || "",
}));

export type BrandCard = (typeof SEED_CARDS)[number] & { image: unknown };

function toCard(world: NavWorld): BrandCard {
  const slug = slugOf(world);
  const seed = SEED_CARDS.find((c) => c.slug === slug);
  const legacyLogo = CARD_LOGO[slug];
  return {
    slug,
    name: (world.name || slug).toUpperCase(),
    tagline: world.tagline || brandCopy(slug)?.title || "",
    href: `/${slug}`,
    fallback: seed?.fallback ?? null,
    logo: legacyLogo ?? (world.logo ? urlFor(world.logo as never).url() : null),
    image: world.image ?? null,
  };
}

/**
 * Cards for /brands. Sanity is the source of truth, but the seeded list takes over
 * when the CMS cannot be reached so the page never renders empty.
 */
export async function getBrandCards(): Promise<BrandCard[]> {
  try {
    const worlds = (await getWorlds()) as NavWorld[];
    const cards = worlds.filter(isPublic).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map(toCard);
    if (cards.length) return cards;
  } catch (e) {
    console.error("getBrandCards falling back to seed:", (e as Error).message);
  }
  return SEED_CARDS;
}

/**
 * Builds the BRANDS dropdown and footer brand list straight from Sanity so a new
 * brand needs no code. Falls back to the seeded skeleton if the CMS is unreachable.
 */
export async function getBrandNav(): Promise<BrandNav> {
  let worlds: NavWorld[];
  try {
    worlds = (await getWorlds()) as NavWorld[];
  } catch {
    return fallbackNav();
  }

  const bySlug = new Map(worlds.filter(isPublic).map((w) => [slugOf(w), w]));
  if (!bySlug.size) return fallbackNav();

  const categories = CATEGORY_SEED.map(({ name, legacy }) => {
    const seeded = legacy
      .map((slug) => bySlug.get(slug))
      .filter((w): w is NavWorld => Boolean(w))
      .map(toBrand);

    return { name, brands: seeded };
  })
    .filter((cat) => cat.brands.length > 0);

  // Each row now maps to exactly one brand, so anything created in Sanity has
  // no curated title of its own. Collect those into one trailing group rather
  // than appending them to every row.
  const seededSlugs = new Set(categories.flatMap((cat) => cat.brands.map((b) => b.slug)));
  const others = [...bySlug.values()]
    .filter((w) => !seededSlugs.has(slugOf(w)))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(toBrand);
  if (others.length) categories.push({ name: "OTHER", brands: others });

  const all = [...bySlug.values()]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(toBrand);

  return { categories, all };
}