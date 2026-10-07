import { getWorlds } from "./queries";
import { urlFor } from "./image";
import { BRAND_COPY, brandCopy } from "@/lib/brands-copy";

type NavWorld = {
  _id: string;
  name?: string;
  slug?: { current?: string } | string;
  tagline?: string;
  speciality?: string;
  logo?: unknown;
  image?: unknown;
  order?: number;
  status?: string;
  featured?: boolean;
};

/**
 * Navigation skeleton used only when Sanity cannot be reached, so a CMS outage
 * cannot empty the dropdown. Rows come from Sanity on the happy path, where the
 * title is the brand's own `tagline` and the position is its own `order`.
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
 * The row title for a brand. `tagline` is what the Studio editor writes and sees,
 * so that is the source; the hardcoded copy only fills in a brand whose tagline
 * was left blank.
 */
function rowTitle(world: NavWorld): string {
  const slug = slugOf(world);
  return world.tagline?.trim() || brandCopy(slug)?.title || world.name || slug;
}

/**
 * Builds the BRANDS dropdown and footer brand list straight from Sanity so a new
 * brand needs no code: every active brand is one row, titled by its own
 * `tagline`, ordered by its own `order`. Falls back to the seeded skeleton if
 * the CMS is unreachable.
 */
export async function getBrandNav(): Promise<BrandNav> {
  let worlds: NavWorld[];
  try {
    worlds = (await getWorlds()) as NavWorld[];
  } catch {
    return fallbackNav();
  }

  const publicWorlds = worlds
    .filter(isPublic)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (!publicWorlds.length) return fallbackNav();

  // Header and MobileMenu track the open row by its title, so two brands sharing
  // one would open together. Qualify the second rather than rendering a dead row.
  const usedTitles = new Set<string>();
  const categories = publicWorlds.map((world) => {
    const brand = toBrand(world);
    let name = rowTitle(world);
    if (usedTitles.has(name)) name = `${name} - ${brand.label}`;
    usedTitles.add(name);
    return { name, brands: [brand] };
  });

  const all = publicWorlds.map(toBrand);

  return { categories, all };
}