import { getWorlds } from "./queries";
import { urlFor } from "./image";

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
 * The category labels and the order of the five existing brands inside them are
 * a navigation design decision, not content — WELLBEING deliberately lists Acasa
 * before Svarga even though Svarga has the lower `order`. Keeping those pairs here
 * means the existing dropdown renders exactly as before, while any brand created in
 * Sanity is appended to its categories automatically.
 */
const CATEGORY_SEED = [
  { name: "ICONIC", legacy: ["samsara", "acasa"] },
  { name: "SPECIALITY", legacy: ["svarga", "outpace"] },
  { name: "EVERYDAY", legacy: ["samsara", "grove"] },
  { name: "WELLBEING", legacy: ["acasa", "svarga"] },
];

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

    const seededSlugs = new Set(seeded.map((b) => b.slug));
    const extras = [...bySlug.values()]
      .filter((w) => !seededSlugs.has(slugOf(w)))
      .filter((w) => (w.categories ?? []).map(String).includes(name))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map(toBrand);

    return { name, brands: [...seeded, ...extras] };
  }).filter((cat) => cat.brands.length > 0);

  const all = [...bySlug.values()]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(toBrand);

  return { categories, all };
}