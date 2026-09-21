import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import ThemeSetter from "@/components/ThemeSetter";
import { getWorlds } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const metadata = {
  title: "Samsara — Samsara Group",
  description: "Sound. Food. Culture. A sanctuary where every frequency is designed.",
};

export default async function SamsaraPage() {
  let world = null;
  try {
    const worlds = await getWorlds();
    world = worlds.find((w) => w.slug?.current === "samsara") || null;
  } catch {
    world = null;
  }

  const specs = world?.specifications || [
    ["Acoustic Range", "18Hz-22kHz Reference"],
    ["Gastronomy", "Terroir-Driven, Volcanic"],
    ["Location", "JKT - 01 S 110 E"],
    ["Listening Sessions", "Vinyl archive, 3,000+ pressings"],
  ];

  return (
    <>
      <ThemeSetter theme="dark" />
      <Header />

      <section className="bg-surface pt-28 pb-16 max-w-[1520px] mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">WORLDS</span>
          <h1 className="text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface">SAMSARA</h1>
          <p className="mt-6 max-w-lg text-body-md text-on-surface-variant leading-relaxed">
            {world?.tagline || "Sound. Food. Culture. A sanctuary where every frequency is designed."}
          </p>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
        <ScrollReveal>
          <div className="img-hover w-full aspect-[4/3] md:aspect-[21/9]">
            {world?.image ? (
              <img src={urlFor(world.image).url()} alt="Samsara Sanctuary" className="h-full w-full object-cover" />
            ) : (
              <div className="w-full h-full bg-surface-container flex items-center justify-center">
                <span className="text-on-surface-variant text-label-caps-sm uppercase tracking-[0.2em]">Samsara</span>
              </div>
            )}
          </div>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        <div className="grid gap-8 lg:gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ScrollReveal>
              <div className="space-y-12">
                <div>
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    {world?.description || "A sanctuary where sound becomes architecture and silence becomes nourishment. Every surface, every frequency, every flavor is designed to dissolve the boundary between guest and environment."}
                  </p>
                </div>

                <div className="border-t border-outline-variant pt-8">
                  <h2 className="mb-6 text-headline-sm font-display uppercase tracking-wide text-on-surface">SPECIFICATIONS</h2>
                  <div className="space-y-4">
                    {specs.map(([label, value]) => (
                      <div key={label} className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 border-b border-outline-variant pb-4">
                        <span className="text-label-caps-sm uppercase tracking-wider text-on-surface-variant shrink-0">{label}</span>
                        <span className="text-body-md text-on-surface min-w-0">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-5">
            <ScrollReveal>
              <div className="space-y-8">
                <div className="img-hover w-full aspect-[4/5]">
                  {world?.image ? (
                    <img src={urlFor(world.image).url()} alt="Samsara Interior" className="h-full w-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-surface-container flex items-center justify-center">
                      <span className="text-on-surface-variant text-label-caps-sm uppercase tracking-[0.2em]">Samsara Interior</span>
                    </div>
                  )}
                </div>
                <Link href="/contact" className="inline-flex w-full items-center justify-center gap-3 bg-primary px-8 py-4 text-label-caps-sm uppercase tracking-widest text-on-primary transition-colors hover:bg-primary-container">
                  RESERVE
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 6h10M7 2l4 4-4 4" /></svg>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
