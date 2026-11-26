import { isSafeSlug, openGraphFor } from "@/lib/site";
import { notFound } from "next/navigation";
import BrandPageView from "@/components/BrandPageView";
import { getWorldBySlug } from "@/sanity/lib/queries";
import { ogImageUrl } from "@/sanity/lib/image";

const SITE = "Samsara Group";

/*
 * Keep the generated route on the same clock as the Sanity fetch. Without an
 * explicit revalidate, an on-demand generated brand page can outlive its
 * document and keep answering 200 after the brand is deleted.
 */
export const revalidate = 60;

/**
 * Renders any brand that does not have a hand-tuned route. The layout is the same
 * two-column structure used by the five established brands, so a brand created
 * in the Studio inherits the same presentation without any code change.
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (!isSafeSlug(slug)) {
    return { title: SITE, robots: { index: false, follow: false } };
  }
  const world = await getWorldBySlug(slug);
  if (!world || world.status !== "active" || world.featured === false) {
    return { title: SITE, robots: { index: false, follow: false } };
  }

  const name = world.name || slug;
  /*
   * Never leave a public brand without a meta description. The old fallback
   * reached for the full intro paragraph, which is usually much longer than a
   * search result; tagline/speciality are short by design.
   */
  const description =
    world.seoDescription ||
    world.tagline ||
    world.speciality ||
    `${name} — ${SITE}`;
  return {
    title: world.seoTitle || `${name} — ${SITE}`,
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: openGraphFor({
      path: `/${slug}`,
      title: world.seoTitle || `${name} — ${SITE}`,
      description,
      image: ogImageUrl(world.socialImage || world.image),
      alt: world.name,
    }),
    ...(world.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function BrandPage({ params }) {
  const { slug } = await params;
  if (!isSafeSlug(slug)) notFound();
  const world = await getWorldBySlug(slug);

  if (!world || world.status !== "active" || world.featured === false) notFound();

  return <BrandPageView world={world} />;
}
