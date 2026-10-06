import { openGraphFor } from "@/lib/site";
import HomePage from "@/components/HomePage";
import { getCarouselImages } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

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

export default async function Page() {
  const slides = await getCarouselImages("home");
  const marqueeImages = slides
    .filter((s) => s.image)
    .map((s) => ({
      src: urlFor(s.image).url(),
      brand: s.brand || "",
      alt: s.alt || "",
    }));

  return <HomePage marqueeImages={marqueeImages} />;
}
