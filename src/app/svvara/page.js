import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import ThemeSetter from "@/components/ThemeSetter";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCarousel from "@/components/ProductCarousel";
import { getWorlds, getProducts, getCarouselImages } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const dynamic = "force-dynamic";

const SVVARA_CONTACT = {
  whatsapp: "0812-2070-3100",
  email: "contact@svvara.co.id",
  address: "Jl. KH Hasyim Ashari No. 31, Cideng, Gambir, Jakarta Pusat",
  serviceCenter: "Jl. KH. Hasyim Ashari No.31, RW.8, Cideng, Kota Jakarta Pusat",
  store: "Official Store — Tokopedia & Shopee",
};
const SVVARA_LINKS = "https://linktr.ee/svvara.indonesia";

export const metadata = {
  title: "Svvara — Samsara Group",
  description: "Refined Simplicity, Enhanced Sound. The SVVARA V110 — a premium turntable proudly made in Indonesia for vinyl lovers and design enthusiasts.",
};

export default async function SvvaraPage() {
  let world = null;
  let products = [];
  let partnerImages = [];
  try {
    const [worlds, allProducts, partnerSlides] = await Promise.all([
      getWorlds(),
      getProducts(),
      getCarouselImages("svvaraPartners"),
    ]);
    world = worlds.find((w) => w.slug?.current === "svvara") || null;
    products = allProducts.filter((p) => p.world === "svvara");
    partnerImages = partnerSlides.filter((s) => s.image).map((s) => urlFor(s.image).url());
  } catch {
    world = null;
    products = [];
    partnerImages = [];
  }

  const displayProducts = products;

  const specs = world?.specifications?.map((s) => [s.label, s.value]) || [
    ["Type", "Belt-drive all-in-one turntable"],
    ["Stylus", "High-Precision — captures every analog detail"],
    ["Speaker", "Built-in 2-Way System — bass, mid, crisp highs"],
    ["Connectivity", "Seamless Bluetooth — play from your phone"],
    ["Origin", "Proudly made in Indonesia"],
    ["Distribution", "Official Store + record stores across Indonesia & Malaysia"],
  ];

  return (
    <>
      <ThemeSetter theme="dark" />
      <Header />

      <section className="bg-surface pt-28 pb-16 max-w-[1520px] mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">WORLDS</span>
          <img src="/assetsvvara/logosvvarablack.webp" alt="Svvara" className="h-12 md:h-16 w-auto" />
          <p className="mt-6 max-w-lg text-body-md text-on-surface-variant leading-relaxed">
            {world?.tagline || "Sound. Object. Design. Hand-formed instruments built to last generations."}
          </p>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
        <ScrollReveal>
          <HeroCarousel
            images={
              world?.gallery?.length
                ? world.gallery.map((g) => urlFor(g).url())
                : [
                    "/assetsvvara/SAVVARA-01268.webp",
                    "/assetsvvara/SAVVARA-01362.webp",
                    "/assetsvvara/SAVVARA-01506.webp",
                    "/assetsvvara/SAVVARA-01649.webp",
                    "/assetsvvara/SAVVARA-01840.webp",
                    "/assetsvvara/SVVARA-03220.webp",
                    "/assetsvvara/SVVARA-03197.webp",
                    "/assetsvvara/SVVARA-03168.webp",
                    "/assetsvvara/SVVARA-03133.webp",
                    "/assetsvvara/SVVARA-03089.webp",
                    "/assetsvvara/SAVVARA-01320.webp",
                    "/assetsvvara/SAVVARA-01683.webp",
                  ]
            }
            alt="Svvara V110 Turntable"
          />
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px] lg:gap-16">
          <ScrollReveal>
            <ProductCarousel products={displayProducts} />
          </ScrollReveal>

          <ScrollReveal>
            <div>
              <h2 className="mb-8 text-headline-sm font-display uppercase tracking-wide text-on-surface">STORE PARTNERS</h2>
              <HeroCarousel
                aspect="aspect-[480/853]"
                images={
                  partnerImages.length
                    ? partnerImages
                    : [
                        "/assetsvvara/storepartner1.webp",
                        "/assetsvvara/storepartner2.webp",
                        "/assetsvvara/storepartner3.webp",
                        "/assetsvvara/storepartner4.webp",
                        "/assetsvvara/storepartner5.webp",
                        "/assetsvvara/storepartner6.webp",
                        "/assetsvvara/storepartner7.webp",
                        "/assetsvvara/storepartner8.webp",
                        "/assetsvvara/storepartner9.webp",
                        "/assetsvvara/storepartner10.webp",
                        "/assetsvvara/storepartner11.webp",
                        "/assetsvvara/storepartner12.webp",
                      ]
                }
                alt="Store Partner"
              />
            </div>
          </ScrollReveal>
        </div>

        <div className="mt-16 lg:mt-20">
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-start">
              <div>
                <h2 className="mb-4 text-headline-sm font-display uppercase tracking-wide text-on-surface">THE V110</h2>
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  {world?.description || "Designed by experienced audio practitioners, the SVVARA V110 delivers a premium-class listening experience in a package anyone can live with — a high-precision stylus that captures every detail, a built-in 2-way speaker system that fills the room, and Bluetooth that lets your digital library join the analog party. Timeless retro aesthetics, dependable performance, proudly made in Indonesia."}
                </p>
              </div>

              <div className="border-t border-outline-variant pt-8">
                <h2 className="mb-6 text-headline-sm font-display uppercase tracking-wide text-on-surface">SPECIFICATIONS</h2>
                <div className="space-y-4">
                  {specs.map(([label, value]) => (
                    <div key={label} className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 border-b border-outline-variant pb-4">
                      <span className="text-label-caps-sm uppercase tracking-wider text-on-surface-variant shrink-0">{label}</span>
                      <span className="text-body-md text-on-surface text-right min-w-0">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-surface-container-low max-w-[1520px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
        <ScrollReveal>
          <h2 className="mb-8 text-headline-sm font-display uppercase tracking-wide text-on-surface">VISIT US</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-title-lg font-display uppercase text-on-surface">Svvara Indonesia</h3>
              <p className="text-body-sm text-on-surface-variant">{SVVARA_CONTACT.address}</p>
              <div className="space-y-2 text-body-sm text-on-surface-variant">
                <p>WhatsApp: {SVVARA_CONTACT.whatsapp}</p>
                <p>Email: {SVVARA_CONTACT.email}</p>
              </div>
              <p className="text-body-sm text-on-surface-variant">Service Center: {SVVARA_CONTACT.serviceCenter}</p>
              <p className="text-body-sm text-on-surface-variant">{SVVARA_CONTACT.store}</p>
              <a
                href={SVVARA_LINKS}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border border-on-surface/20 px-8 py-4 text-label-caps-sm uppercase tracking-widest text-on-surface transition-colors hover:bg-primary hover:text-on-primary"
              >
                LINKS
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 6h10M7 2l4 4-4 4" /></svg>
              </a>
            </div>
            <div className="space-y-4">
              <h3 className="text-title-lg font-display uppercase text-on-surface">Find Our Products</h3>
              <p className="text-body-sm text-on-surface-variant">Available at record store partners across Indonesia and Malaysia:</p>
              <ul className="text-body-sm text-on-surface-variant space-y-1">
                <li>PHR Records (Senayan & Bintaro)</li>
                <li>Playlist Record Store</li>
                <li>Lokananta Record Store</li>
                <li>World Records</li>
                <li>SONAA</li>
                <li>Acoustique Systems (Kuala Lumpur)</li>
              </ul>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </>
  );
}
