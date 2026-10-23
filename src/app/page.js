import { openGraphFor, safeUrl } from "@/lib/site";
import HomePage from "@/components/HomePage";
import { getCarouselImages, getHomePage } from "@/sanity/lib/queries";
import { getBrandCards } from "@/sanity/lib/brands";
import { sizedUrl } from "@/sanity/lib/image";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Samsara Group — Many Identities, One Standard",
  description: "Samsara Group is a lifestyle and hospitality group developing and operating distinct destination concepts across Indonesia — from full-service dining and heritage restaurants to resort stays, wellness cafés, and neighborhood coffee.",
  alternates: {
    canonical: "/",
  },
  openGraph: openGraphFor({
    path: "/",
    title: "Samsara Group",
    description: "A lifestyle and hospitality group developing and operating distinct destination concepts across Indonesia.",
  }),
};

/**
 * Fallbacks for every string and image the homepage renders. An empty field in the
 * Studio, or a CMS that cannot be reached, falls back to these rather than leaving
 * a gap in the page.
 */
const HOME_DEFAULTS = {
  heroImageUrl: "/ASSETS-SAMSARA/ambience/DSC08930.webp",
  heroImageAlt: "Sams Group",
  heroLine1: "EVERY SOUL",
  heroLine2: "FINDS ITS GROUND.",
  aboutEyebrow: "ABOUT US",
  aboutHeadingLine1: "MANY IDENTITIES,",
  aboutHeadingLine2: "ONE STANDARD.",
  aboutBody:
    "Samsara Group is a lifestyle and hospitality group that develops and operates distinct destination concepts across Indonesia, from full-service dining and heritage restaurants to resort stays, wellness cafés, and neighborhood coffee.",
  aboutCtaLabel: "MORE ABOUT US",
  aboutCtaHref: "/about",
  aboutImageUrl: "/ASSETS-SAMSARA/ambience/DSC08926.webp",
  aboutImageAlt: "About",
  brandsEyebrow: "OUR BRANDS",
  brandsHeading: "WORLDS OF THEIR OWN",
  brandsBody: "Each concept with its own character, all crafted by Samsara Group.",
  brandsCounterLabel: "worlds under one group",
};

/** A CMS string only wins when it actually has something in it. */
const isi = (nilai, bawaan) => (typeof nilai === "string" && nilai.trim() ? nilai : bawaan);

/** Internal paths are fine; anything else must be an absolute http(s) URL. */
const safeHref = (nilai, bawaan) => {
  const value = isi(nilai, bawaan);
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  return safeUrl(value) || bawaan;
};

export default async function Page() {
  const [slides, doc, cards] = await Promise.all([
    getCarouselImages("home"),
    getHomePage(),
    getBrandCards(),
  ]);

  const marqueeImages = slides
    .filter((s) => s.image)
    .map((s) => ({
      // The marquee tile is 320x220 on desktop, so 640 covers 2x screens.
      src: sizedUrl(s.image, 640),
      brand: s.brand || "",
      alt: s.alt || "",
    }));

  const home = {
    heroImageUrl: doc?.heroImage ? sizedUrl(doc.heroImage, 1600) : HOME_DEFAULTS.heroImageUrl,
    aboutImageUrl: doc?.aboutImage ? sizedUrl(doc.aboutImage, 1100) : HOME_DEFAULTS.aboutImageUrl,
    heroImageAlt: isi(doc?.heroImageAlt, HOME_DEFAULTS.heroImageAlt),
    heroLine1: isi(doc?.heroLine1, HOME_DEFAULTS.heroLine1),
    heroLine2: isi(doc?.heroLine2, HOME_DEFAULTS.heroLine2),
    aboutEyebrow: isi(doc?.aboutEyebrow, HOME_DEFAULTS.aboutEyebrow),
    aboutHeadingLine1: isi(doc?.aboutHeadingLine1, HOME_DEFAULTS.aboutHeadingLine1),
    aboutHeadingLine2: isi(doc?.aboutHeadingLine2, HOME_DEFAULTS.aboutHeadingLine2),
    aboutBody: isi(doc?.aboutBody, HOME_DEFAULTS.aboutBody),
    aboutCtaLabel: isi(doc?.aboutCtaLabel, HOME_DEFAULTS.aboutCtaLabel),
    aboutCtaHref: safeHref(doc?.aboutCtaHref, HOME_DEFAULTS.aboutCtaHref),
    aboutImageAlt: isi(doc?.aboutImageAlt, HOME_DEFAULTS.aboutImageAlt),
    brandsEyebrow: isi(doc?.brandsEyebrow, HOME_DEFAULTS.brandsEyebrow),
    brandsHeading: isi(doc?.brandsHeading, HOME_DEFAULTS.brandsHeading),
    brandsBody: isi(doc?.brandsBody, HOME_DEFAULTS.brandsBody),
    brandsCounterLabel: isi(doc?.brandsCounterLabel, HOME_DEFAULTS.brandsCounterLabel),
  };

  return <HomePage marqueeImages={marqueeImages} home={home} brandCards={cards} />;
}
