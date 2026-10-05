import { siteUrl, ogImages } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import TextClipReveal from "@/components/TextClipReveal";
import ImageParallax from "@/components/ImageParallax";
import ThemeSetter from "@/components/ThemeSetter";
import HeroCarousel from "@/components/HeroCarousel";
import { getWorlds } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import InstagramLink from "@/components/InstagramLink";

export const dynamic = "force-dynamic";

/**
 * Served from the CMS so an editor can change the title and description without a
 * deploy. The literals below stay as the fallback and match what Sanity currently
 * holds, so switching to this function does not alter the served metadata.
 */
export async function generateMetadata() {
  let seo = {};
  try {
    const world = (await getWorlds()).find((w) => w.slug?.current === "grove");
    seo = {
      title: world?.seoTitle,
      description: world?.seoDescription,
      image: world?.socialImage,
        card: world?.image,
        brandName: world?.name,
      noIndex: world?.noIndex === true,
    };
  } catch {
    seo = {};
  }

  const og = { url: siteUrl("/grove") };
  og.images = ogImages(urlFor(seo.image || seo.card || null)?.url, seo.brandName);

  return {
    title: seo.title || "Grove — Samsara Group",
    description: seo.description || "The lighter cafe. Casual, relaxed, and always good vibes.",
    alternates: { canonical: "/grove" },
    openGraph: og,
    ...(seo.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function GrovePage() {
  let world = null;
  try {
    const worlds = await getWorlds();
    world = worlds.find((w) => w.slug?.current === "grove") || null;
  } catch {
    world = null;
  }

  const specs = world?.specifications?.map((s) => [s.label, s.value]) || [
    ["Concept", "Lighter cafe than Samsara"],
    ["Vibe", "Casual · Relaxed · Everyday"],
    ["Menu", "Coffee, bites, light meals"],
  ];

  return (
    <>
      <ThemeSetter theme="dark" />
      <Header />

      <section className="bg-surface pt-28 pb-16 max-w-[1520px] mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">WORLDS</span>
          <TextClipReveal>
            <h1 className="text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface">GROVE</h1>
          </TextClipReveal>
          <p className="mt-6 max-w-lg text-body-md text-on-surface-variant leading-relaxed">
            The lighter cafe. Casual, relaxed, and always good vibes.
          </p>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
        <ScrollReveal>
          <ImageParallax className="w-full">
            <HeroCarousel
            images={
              world?.gallery?.length
                ? world.gallery.map((g) => urlFor(g).url())
                : [
                    "/ambiencesamsara/DSC09048.webp",
                    "/ambiencesamsara/DSC09058.webp",
                    "/ambiencesamsara/DSC08482.webp",
                    "/ambiencesamsara/DSC08494.webp",
                    "/ambiencesamsara/DSC08527.webp",
                    "/ambiencesamsara/DSC08558.webp",
                    "/ambiencesamsara/DSC08575.webp",
                    "/ambiencesamsara/DSC09408.webp",
                    "/ambiencesamsara/DSC09421.webp",
                    "/ambiencesamsara/DSC08397.webp",
                    "/ambiencesamsara/DSC08401.webp",
                    "/ambiencesamsara/DSC08409.webp",
                  ]
            }
            alt="Grove"
          />
          </ImageParallax>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        <div className="grid gap-8 lg:gap-16 lg:grid-cols-2">
          <ScrollReveal>
            <div className="space-y-12">
              <div>
                <TextClipReveal>
                  <h2 className="mb-4 text-headline-sm font-display uppercase tracking-wide text-on-surface">THE VISION</h2>
                </TextClipReveal>
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  Less formal, more feeling. Grove is the casual counterpart to Samsara — same soul, lighter touch. A cafe where you come as you are, stay as long as you want, and leave a little lighter than you arrived.
                </p>
              </div>
              <div className="border-t border-outline-variant pt-8">
                <TextClipReveal>
                  <h2 className="mb-6 text-headline-sm font-display uppercase tracking-wide text-on-surface">SPECIFICATIONS</h2>
                </TextClipReveal>
                <div className="space-y-4">
                  {specs.map(([label, value]) => (
                    <div key={label} className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 border-b border-outline-variant pb-4">
                      <span className="text-label-caps-sm uppercase tracking-wider text-on-surface-variant shrink-0">{label}</span>
                      <span className="text-body-md text-on-surface text-right min-w-0">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <InstagramLink href="/brands" external={false} full />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
