import { getWorlds, getBrandNavConfig } from "./queries";
import { sizedUrl } from "./image";
import { BRAND_COPY, brandCopy } from "@/lib/brands-copy";
import { isSafeSlug } from "@/lib/site";

const DEFAULT_SEE_ALL = "See All Brands →";
const DEFAULT_EMPTY = "Hover a brand";

type NavWorld = {
  _id: string;
  _updatedAt?: string;
  name?: string;
  slug?: { current?: string } | string;
  tagline?: string;
  speciality?: string;
  logo?: unknown;
  image?: unknown;
  order?: number;
  status?: string;
  featured?: boolean;
  noIndex?: boolean;
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
 * Local mark used only when a brand has no CMS logo at all — a new brand before
 * its logo is uploaded, or a CMS outage. The Studio is the source of truth.
 * Cards apply `brightness-0 invert`, so a dark mark becomes a white silhouette.
 */
const LEGACY_LOGO: Record<string, string> = {
  samsara: "/ASSETS-SAMSARA/logo/samsara-black-480.webp",
  svarga: "/ASSETS-SVARGA/logo/svarga-black-480.webp",
  acasa: "/ASSETS-ACASA/logo/acasa-black-480.webp",
  outpace: "/ASSETS-OUTPACE/logo/outpace-black-480.webp",
  grove: "/ASSETS-GROVE/logo/grove-black-480.webp",
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

type NavBrand = {
  slug: string;
  label: string;
  speciality: string;
  href: string;
  logo: string | null;
  image: unknown;
};

type BrandNav = {
  categories: { name: string; brands: NavBrand[] }[];
  all: NavBrand[];
  seeAllLabel: string;
  emptyLabel: string;
};

function toBrand(world: NavWorld): NavBrand {
  const slug = slugOf(world);
  return {
    slug,
    label: world.name ?? slug,
    speciality: world.speciality ?? "",
    href: isSafeSlug(slug) ? `/${slug}` : "/brands",
    logo: world.logo ? sizedUrl(world.logo as never, 480) : LEGACY_LOGO[slug] ?? null,
    image: world.image ?? null,
  };
}

function fallbackNav(): BrandNav {
  const all = Array.from(new Set(CATEGORY_SEED.flatMap((c) => c.legacy))).map((slug) => ({
    slug,
    label: brandCopy(slug)?.name || slug,
    speciality: brandCopy(slug)?.disciplines || "",
    href: `/${slug}`,
    logo: LEGACY_LOGO[slug] ?? null,
    image: null,
  }));
  const categories = CATEGORY_SEED.map(({ name, legacy }) => ({
    name,
    brands: legacy.map((slug) => all.find((b) => b.slug === slug)).filter(Boolean) as NavBrand[],
  }));
  return {
    categories,
    all,
    seeAllLabel: DEFAULT_SEE_ALL,
    emptyLabel: DEFAULT_EMPTY,
  };
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
    fallback: "/ASSETS-SAMSARA/ambience/DSC08177.webp",
    logo: "/ASSETS-SAMSARA/logo/samsara-white-480.webp",
    image: null,
  },
  {
    slug: "svarga",
    fallback: "/ASSETS-SVARGA/ADR (9 of 15).webp",
    logo: "/ASSETS-SVARGA/logo/svarga-black-480.webp",
    image: null,
  },
  {
    slug: "acasa",
    fallback: "/ASSETS-ACASA/ADR-06539.webp",
    logo: "/ASSETS-ACASA/logo/acasa-white-480.webp",
    image: null,
  },
  {
    slug: "outpace",
    fallback: "/ASSETS-SAMSARA/ambience/DSC09014.webp",
    logo: "/ASSETS-OUTPACE/logo/outpace-black-480.webp",
    image: null,
  },
  {
    slug: "grove",
    fallback: "/ASSETS-SAMSARA/ambience/DSC09048.webp",
    logo: "/ASSETS-GROVE/logo/grove-black-480.webp",
    image: null,
  },
].map((c) => ({
  ...c,
  href: `/${c.slug}`,
  name: (brandCopy(c.slug)?.name || c.slug).toUpperCase(),
  tagline: brandCopy(c.slug)?.title || "",
  disciplines: brandCopy(c.slug)?.disciplines || "",
  // The CMS marks no brand as noIndex; the seed has to match, otherwise a CMS
  // outage would drop the same brands from sitemap.xml while their pages still
  // answer 200.
  noIndex: false,
}));

type BrandCard = (typeof SEED_CARDS)[number] & {
  image: unknown;
  noIndex: boolean;
  disciplines: string;
  lastModified?: string | null;
};

function toCard(world: NavWorld): BrandCard {
  const slug = slugOf(world);
  const seed = SEED_CARDS.find((c) => c.slug === slug);
  const legacyLogo = LEGACY_LOGO[slug];
  return {
    slug,
    name: (world.name || slug).toUpperCase(),
    tagline: world.tagline || brandCopy(slug)?.title || "",
    // The speciality line, read from the CMS so the homepage cards and the
    // BRANDS dropdown cannot drift apart. The seeded copy keeps it honest when
    // the field is empty.
    disciplines: world.speciality || brandCopy(slug)?.disciplines || "",
    href: isSafeSlug(slug) ? `/${slug}` : "/brands",
    fallback: seed?.fallback ?? null,
    logo: world.logo ? sizedUrl(world.logo as never, 480) : legacyLogo ?? null,
    image: world.image ?? null,
    // Dibawa ke sitemap supaya brand yang diminta "Hide from Search Engines"
    // tidak diiklankan di sitemap.xml sekaligus diminta tidak diindeks di <head>.
    noIndex: world.noIndex === true,
    lastModified: world._updatedAt ?? null,
  };
}

/**
 * Cards for /brands. Sanity is the source of truth, but the seeded list takes over
 * when the CMS cannot be reached so the page never renders empty.
 */
export async function getBrandCards(): Promise<BrandCard[]> {
  try {
    const worlds = (await getWorlds()) as NavWorld[];
    /*
     * A brand without an order belongs at the end, not at the top. The old
     * `?? 0` default made a freshly created brand jump ahead of Samsara.
     */
    const cards = worlds
      .filter((world) => isPublic(world) && isSafeSlug(slugOf(world)))
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
      .map(toCard);
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
 * Builds the BRANDS dropdown and footer brand list straight from Sanity.
 *
 * Rows come from the BRANDS Dropdown document, which owns the order and the
 * grouping. When that document is missing or empty, each active brand becomes its
 * own row titled by its `tagline`, so the dropdown still works without it.
 */
export async function getBrandNav(): Promise<BrandNav> {
  let worlds: NavWorld[];
  try {
    worlds = (await getWorlds()) as NavWorld[];
  } catch {
    return fallbackNav();
  }

  const publicWorlds = worlds
    .filter((world) => isPublic(world) && isSafeSlug(slugOf(world)))
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  if (!publicWorlds.length) return fallbackNav();

  const bySlug = new Map(publicWorlds.map((w) => [slugOf(w), w]));
  const config = await getBrandNavConfig().catch(() => null);

  const configured = (config?.rows ?? [])
    .map((row) => {
      const brands = (row.brands ?? [])
        .map((brand) => (brand as NavWorld)?._id ? bySlug.get(slugOf(brand as NavWorld)) : null)
        .filter((w): w is NavWorld => Boolean(w))
        .map(toBrand);
      const first = brands[0];
      const world = first ? bySlug.get(first.slug) : undefined;
      return { name: row.title?.trim() || (world ? rowTitle(world) : ""), brands };
    })
    .filter((row) => row.name && row.brands.length > 0);

  /*
   * A public brand that has not been placed in the BRANDS Dropdown still needs a
   * way into the header. Append it as its own row; once an editor adds it to a
   * curated row, the automatic row disappears on the next revalidation.
   */
  let rows = configured;
  if (configured.length) {
    const referenced = new Set(
      configured.flatMap((row) => row.brands.map((brand) => brand.slug))
    );
    rows = [
      ...configured,
      ...deriveRows(publicWorlds.filter((world) => !referenced.has(slugOf(world)))),
    ];
  } else {
    rows = deriveRows(publicWorlds);
  }

  // Header and MobileMenu track the open row by its title, so two rows sharing one
  // would open together. Qualify the repeat rather than rendering a dead row.
  const usedTitles = new Set<string>();
  const categories = rows.map((row) => {
    let name = row.name;
    if (usedTitles.has(name)) name = `${name} - ${row.brands[0].label}`;
    usedTitles.add(name);
    return { name, brands: row.brands };
  });

  const all = publicWorlds.map(toBrand);

  return {
    categories,
    all,
    // An empty string in the document means "hide this", so only fall back when
    // the document has no value at all.
    seeAllLabel: config ? (config.seeAllLabel ?? DEFAULT_SEE_ALL).trim() : DEFAULT_SEE_ALL,
    emptyLabel: config ? (config.emptyLabel ?? DEFAULT_EMPTY).trim() : DEFAULT_EMPTY,
  };
}

/** One row per active brand, titled by its own tagline, in the CMS order. */
function deriveRows(publicWorlds: NavWorld[]): { name: string; brands: NavBrand[] }[] {
  return publicWorlds.map((world) => ({ name: rowTitle(world), brands: [toBrand(world)] }));
}