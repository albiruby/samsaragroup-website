import HomePage from "@/components/HomePage";
import { getCarouselImages } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Samsara Group — We Create Places To Feel Something",
  description: "A multidisciplinary lifestyle and hospitality collective creating meaningful experiences across music, dining, design, hospitality, and culture.",
  openGraph: {
    title: "Samsara Group",
    description: "A multidisciplinary lifestyle and hospitality collective.",
    url: "https://samsaragroup.co.id",
    siteName: "Samsara Group",
    type: "website",
  },
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
