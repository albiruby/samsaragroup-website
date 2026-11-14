import { notFound } from "next/navigation";
import BrandPageView from "@/components/BrandPageView";
import { brandMetadata, loadBrand } from "@/lib/brand-page";
import { BRAND_PAGES } from "@/lib/brand-pages";

export const dynamic = "force-dynamic";

const KEY = "samsara";

export async function generateMetadata() {
  return brandMetadata(KEY);
}

export default async function SamsaraPage() {
  const world = await loadBrand(KEY);

  // A brand that exists but is unpublished must 404, exactly like the /[slug] template.
  if (world && (world.status !== "active" || world.featured === false)) notFound();

  return <BrandPageView world={world} config={BRAND_PAGES[KEY]} />;
}
