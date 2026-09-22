import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import ThemeSetter from "@/components/ThemeSetter";
import { getWorlds } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const metadata = {
  title: "Acasa — Samsara Group",
  description: "A Sanctuary of Refined Living. Resto, Cottages, and Padel — one place, many moments, in the hills of Ciawi, Bogor.",
};

export default async function AcasaPage() {
  const worlds = await getWorlds();
  const world = worlds.find((w) => w.slug?.current === "acasa");

  const offerings = world?.specifications?.map((s) => [s.label, s.value]) || [
    ["Cottages", "20 rooms — pool, WiFi, 24hr reception, smart TV"],
    ["Acasa Padel", "2 courts — Rp200,000/session, hot shower, locker rooms"],
    ["Restaurant", "Rp25k–95k — Weekdays 09–23, Weekend 08–23"],
    ["Event Space", "Ballroom & garden — from intimate gatherings to grand celebrations"],
    ["Location", "Ciawi, Bogor — 5 min from Vimala Hills, 6 min from Kuntum Farmfield"],
    ["Rating", "Google Hotels 4.9 (169 reviews) · tiket.com 5.0"],
  ];

  return (
    <>
      <ThemeSetter theme="dark" />
      <Header />

      <section className="bg-surface pt-28 pb-16 max-w-[1520px] mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">WORLDS</span>
          <h1 className="text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface">ACASA</h1>
          <p className="mt-6 max-w-lg text-body-md text-on-surface-variant leading-relaxed">
            {world?.tagline || "A Sanctuary of Refined Living — Resto, Cottages, Padel."}
          </p>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
        <ScrollReveal>
          <div className="img-hover w-full aspect-[4/3] md:aspect-[21/9]">
            {world?.image ? (
              <img src={urlFor(world.image).url()} alt="Acasa" className="h-full w-full object-cover" />
            ) : (
              <img src="/assetacasa/ADR-06545.jpg" alt="Acasa" className="h-full w-full object-cover" />
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
                    {world?.description || "Where architecture holds stories, where every table gathers laughter, where mornings begin softly and evenings glow with warmth. From quiet stays to meaningful celebrations, every detail is thoughtfully crafted — from comfortable cottages and refreshing pool days to padel games and family meals at the restaurant. Welcome to Acasa."}
                  </p>
                </div>

                <div className="border-t border-outline-variant pt-8">
                  <h2 className="mb-6 text-headline-sm font-display uppercase tracking-wide text-on-surface">OFFERINGS</h2>
                  <div className="space-y-4">
                    {offerings.map(([label, value]) => (
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
                    <img src={urlFor(world.image).url()} alt="Acasa Interior" className="h-full w-full object-cover" />
                  ) : (
                    <img src="/assetacasa/ADR-06539.jpg" alt="Acasa Interior" className="h-full w-full object-cover" />
                  )}
                </div>
                <Link href="/contact" className="inline-flex w-full items-center justify-center gap-3 bg-primary px-8 py-4 text-label-caps-sm uppercase tracking-widest text-on-primary transition-colors hover:bg-primary-container">
                  JOIN THE RITUAL
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
