import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import ThemeSetter from "@/components/ThemeSetter";
import HeroCarousel from "@/components/HeroCarousel";
import LeafletMap from "@/components/LeafletMap";
import { getWorlds } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

const SVARGA_COORDS = { lat: -6.8500, lng: 106.9333 };
const SVARGA_LINK = "https://maps.app.goo.gl/rn8Mfgk7NXJG79Xp8";

export const metadata = {
  title: "Svarga — Samsara Group",
  description: "Cerita rasa sudah dimulai. Svarga terbuka untukmu. Javanese heritage restaurant with pendopo, prasmanan, and skydeck in the highlands of Sukabumi.",
};

export default async function SvargaPage() {
  const worlds = await getWorlds();
  const world = worlds.find((w) => w.slug?.current === "svarga");

  const specs = world?.specifications?.map((s) => [s.label, s.value]) || [
    ["Concept", "Pendopo Javanese — prasmanan otentik, heritage dining"],
    ["Signature Dishes", "Sate Merah, Ayam Gerabah, Mangut Lele, Wedangan"],
    ["Skydeck", "Open-air deck with panoramic highland views"],
    ["Location", "Nagrak, Sukabumi — cool mountain air, 10 min from Cibadak"],
    ["Occasion", "Family gatherings, weddings, celebrations"],
    ["Reservations", "WhatsApp 0813-2148-132"],
  ];

  return (
    <>
      <ThemeSetter theme="dark" />
      <Header />

      <section className="bg-surface pt-28 pb-16 max-w-[1520px] mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">WORLDS</span>
          <h1 className="text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface">SVARGA</h1>
          <p className="mt-6 max-w-lg text-body-md text-on-surface-variant leading-relaxed">
            {world?.tagline || "Cerita rasa sudah dimulai. Rasa, alam, dan tradisi berpadu jadi satu."}
          </p>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
        <ScrollReveal>
          <HeroCarousel
            images={[
              "/assetsvarga/ADR-07604.jpg",
              "/assetsvarga/ADR (9 of 15).jpg",
              "/assetsvarga/ADR (7 of 15).jpg",
              "/assetsvarga/ADR (5 of 15).jpg",
              "/assetsvarga/ADR (3 of 15).jpg",
              "/assetsvarga/ADR (1 of 15).jpg",
            ]}
            alt="Svarga Estate"
          />
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        <div className="grid gap-8 lg:gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ScrollReveal>
              <div className="space-y-12">
                <div>
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    {world?.description || "Svarga was born from a simple desire: to create a space to return to — to honest flavors, to traditions that are cared for, to togetherness that is never rushed. Set amid the cool highlands of Sukabumi, every dish is prepared with wholeheartedness, wrapping the warmth of spices, the familiarity of a long table, and stories that grow between bites. Welcome to Svarga."}
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
                    <img src={urlFor(world.image).url()} alt="Svarga Suite" className="h-full w-full object-cover" />
                  ) : (
                    <img src="/assetsvarga/ADR (9 of 15).jpg" alt="Svarga Suite" className="h-full w-full object-cover" />
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

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        <ScrollReveal>
          <h2 className="mb-6 text-headline-sm font-display uppercase tracking-wide text-on-surface">FIND US</h2>
          <div className="w-full h-[300px] md:h-[400px] border border-outline-variant overflow-hidden">
            <LeafletMap lat={SVARGA_COORDS.lat} lng={SVARGA_COORDS.lng} zoom={16} className="w-full h-full" />
          </div>
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-body-md text-on-surface font-medium">Svarga by Samsara</p>
              <p className="text-body-sm text-on-surface-variant">Jl. Raya Nagrak, Cisarua, Sukabumi, Jawa Barat</p>
              <p className="text-body-sm text-on-surface-variant">WhatsApp: 0813-2148-132</p>
            </div>
            <a
              href={SVARGA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-on-surface/20 px-8 py-4 text-label-caps-sm uppercase tracking-widest text-on-surface transition-colors hover:bg-primary hover:text-on-primary"
            >
              OPEN IN MAPS
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 6h10M7 2l4 4-4 4" /></svg>
            </a>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </>
  );
}
