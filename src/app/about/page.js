import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { getWorlds } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { isActive } from "@/data/brandCategories";
import { jsonLdHtml } from "@/lib/jsonld";

export const metadata = {
  title: "About — Samsara Group",
  description: "Samsara Group is a multidisciplinary lifestyle and hospitality collective creating meaningful experiences across music, dining, design, hospitality, and culture.",
};

export default async function AboutPage() {
  const worlds = await getWorlds();

  const brands = [
    { name: "SAMSARA", tagline: "THE SANCTUARY", href: "/samsara", fallback: "/ambiencesamsara/DSC09006.webp", logo: "/White Logo Samsara/whitefullsamping.png" },
    { name: "SVVARA", tagline: "TACTILE ARTIFACTS", href: "/svvara", fallback: "/assetsvvara/SVVARA-03203.webp", logo: "/assetsvvara/logosvvarawhite.webp" },
    { name: "SVARGA", tagline: "THE HIGHLANDS", href: "/svarga", fallback: "/assetsvarga/ADR (8 of 15).webp", logo: "/assetsvarga/Svarga logo black.webp" },
    { name: "ACASA", tagline: "LEISURE RITUALS", href: "/acasa", fallback: "/assetacasa/ADR-06529.webp", logo: "/assetacasa/Main Logo3.webp" },
    { name: "OUTPACE", tagline: "THE RUNNING CAFE", href: "/outpace", fallback: "/ambiencesamsara/DSC09014.webp", logo: null },
    { name: "GROVE", tagline: "THE LIGHTER CAFE", href: "/grove", fallback: "/ambiencesamsara/DSC09048.webp", logo: null },
  ].filter((b) => isActive(b.href)).map((b) => {
    const w = worlds.find((w) => w.slug?.current === b.name.toLowerCase());
    return { ...b, image: w?.image || null };
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdHtml({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About Samsara Group",
            url: "https://samsaragroup.co.id/about",
            mainEntity: {
              "@type": "Organization",
              name: "Samsara Group",
              url: "https://samsaragroup.co.id",
              description:
                "A multidisciplinary lifestyle and hospitality collective creating meaningful experiences across music, dining, design, hospitality, and culture.",
            },
          }),
        }}
      />
      <Header />

      {/* ── About Hero ── */}
      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pt-28 pb-16 lg:pt-36 lg:pb-24">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="img-hover h-[400px] lg:h-[520px]">
              <img src="/ambiencesamsara/DSC08913.webp" alt="Samsara Group" className="h-full w-full object-cover" />
            </div>
            <div>
              <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">ABOUT US</span>
              <h1 className="font-display text-headline-md lg:text-headline-lg uppercase leading-[0.95] tracking-tight mb-6 text-on-surface">
                WE CREATE PLACES<br />TO FEEL SOMETHING.
              </h1>
              <p className="font-body text-body-lg text-on-surface-variant leading-relaxed mb-6">
                Samsara Group is a multidisciplinary lifestyle and hospitality collective creating meaningful experiences across music, dining, design, hospitality, and culture.
              </p>
              <p className="font-body text-body-lg text-on-surface-variant leading-relaxed">
                Four distinct worlds — each a curated expression of craft, sound, taste, and stillness — together forming a single philosophy of intentional living.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Vision ── */}
      <section className="bg-surface-container-low w-full">
        <div className="max-w-[1520px] mx-auto px-6 lg:px-10 py-20 lg:py-32">
          <ScrollReveal>
            <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">VISION</span>
            <h2 className="font-display text-headline-md uppercase leading-[0.95] tracking-tight mb-8 text-on-surface max-w-3xl">
              WHERE EVERY MOMENT MATTERS
            </h2>
            <p className="font-body text-body-lg text-on-surface-variant leading-relaxed max-w-2xl">
              We believe that places have the power to transform how people feel, connect, and live. Our vision is to create destinations that honor craft, silence, and the beauty of intentional design.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Philosophy ── */}
      <section className="bg-surface w-full">
        <div className="max-w-[1520px] mx-auto px-6 lg:px-10 py-20 lg:py-32">
          <ScrollReveal>
            <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">PHILOSOPHY</span>
            <h2 className="font-display text-headline-md uppercase leading-[0.95] tracking-tight mb-12 text-on-surface">
              APPROACH & PRINCIPLES
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-outline-variant">
            {[
              { title: "CRAFT", desc: "Every detail matters. We pursue mastery in what we make and how we serve." },
              { title: "SILENCE", desc: "We design for stillness. Space, sound, and absence are as important as presence." },
              { title: "TERRITORY", desc: "Every place begins with its landscape. We build from the land, not on it." },
              { title: "COMMUNITY", desc: "We create spaces where people connect, belong, and grow together." },
              { title: "TIME", desc: "We design for longevity. Materials, objects, and experiences built to endure." },
              { title: "RITUAL", desc: "Daily practice as architecture. Fire, sound, food, and movement as structure." },
            ].map((item) => (
              <div key={item.title} className="bg-surface p-8 lg:p-10">
                <h3 className="mb-3 text-title-lg font-display uppercase tracking-wide text-on-surface">{item.title}</h3>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand Cards ── */}
      <section id="brands" className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 py-16 lg:py-24 scroll-mt-24">
        <ScrollReveal>
          <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">BRANDS</span>
          <h2 className="text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface mb-12">OUR WORLDS</h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <Link key={brand.name} href={brand.href} className="group block border border-outline-variant overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-[4/5] overflow-hidden">
                {brand.image ? (
                  <img src={urlFor(brand.image).url()} alt={brand.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <img src={brand.fallback} alt={brand.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center px-6">
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.name} className="w-[75%] max-w-[280px] max-h-[45%] object-contain brightness-0 invert" />
                  ) : (
                    <h3 className="font-display text-headline-md lg:text-headline-lg uppercase text-white tracking-wide">{brand.name}</h3>
                  )}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-title-lg uppercase text-on-surface mb-1">{brand.name}</h3>
                <p className="font-body text-body-sm text-on-surface-variant italic">{brand.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
