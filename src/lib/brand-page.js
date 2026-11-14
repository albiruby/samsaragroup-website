import { openGraphFor } from "@/lib/site";
import { ogImageUrl } from "@/sanity/lib/image";
import { getWorldBySlug } from "@/sanity/lib/queries";
import { brandConfig } from "@/lib/brand-pages";
import { isBrandHidden } from "@/lib/brand-visibility";

/**
 * Reads one brand. A CMS outage returns null rather than throwing, so the page can
 * fall back to the literals in `brand-pages.js` instead of going blank.
 */
export async function loadBrand(slug) {
  try {
    return await getWorldBySlug(slug);
  } catch {
    return null;
  }
}

/**
 * Shared metadata for the five established brand pages. The CMS wins; the
 * per-brand literals only fill a field the Studio left empty.
 */
export async function brandMetadata(slug) {
  const config = brandConfig(slug);
  const world = await loadBrand(slug);

  // A document that exists but is not published must not advertise itself.
  // Shares one predicate with the page body so the two gates cannot diverge.
  if (isBrandHidden(world)) {
    return { title: "Samsara Group", robots: { index: false, follow: false } };
  }

  const title = world?.seoTitle || config.seoTitle;
  const description = world?.seoDescription || config.seoDescription;
  const image = world?.socialImage || world?.image;

  return {
    title,
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: openGraphFor({
      path: `/${slug}`,
      title,
      description,
      image: image ? ogImageUrl(image) : undefined,
      alt: world?.name || config.name,
    }),
    ...(world?.noIndex === true ? { robots: { index: false, follow: false } } : {}),
  };
}
