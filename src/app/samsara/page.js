import { notFound } from "next/navigation";
import BrandPageView from "@/components/BrandPageView";
import { brandMetadata, loadBrand } from "@/lib/brand-page";
import { BRAND_PAGES } from "@/lib/brand-pages";
import { isBrandHidden } from "@/lib/brand-visibility";

export const dynamic = "force-dynamic";

const KEY = "samsara";

export async function generateMetadata() {
  return brandMetadata(KEY);
}

export default async function SamsaraPage() {
  const world = await loadBrand(KEY);

  // Same publication gate as the metadata; see src/lib/brand-visibility.mjs.
  if (isBrandHidden(world)) notFound();

  return <BrandPageView world={world} config={BRAND_PAGES[KEY]} />;
}
