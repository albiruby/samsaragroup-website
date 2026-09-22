import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import ThemeSetter from "@/components/ThemeSetter";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCarousel from "@/components/ProductCarousel";
import { getWorlds, getProducts } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

const SVVARA_CONTACT = {
  whatsapp: "0812-2070-3100",
  email: "contact@svvara.co.id",
  address: "Jl. KH Hasyim Ashari No. 31, Cideng, Gambir, Jakarta Pusat",
  store: "Official Store — Tokopedia & Shopee",
};

export const metadata = {
  title: "Svvara — Samsara Group",
  description: "Refined Simplicity, Enhanced Sound. The SVVARA V100 — a premium turntable proudly made in Indonesia for vinyl lovers and design enthusiasts.",
};

export default async function SvvaraPage() {
  let world = null;
  let products = [];
  try {
    const [worlds, allProducts] = await Promise.all([getWorlds(), getProducts()]);
    world = worlds.find((w) => w.slug?.current === "svvara") || null;
    products = allProducts.filter((p) => p.world === "svvara");
  } catch {
    world = null;
    products = [];
  }

  const displayProducts = products;

  const specs = world?.specifications || [
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
          <img src="/assetsvvara/logosvvara.webp" alt="Svvara" className="h-12 md:h-16 w-auto" />
          <p className="mt-6 max-w-lg text-body-md text-on-surface-variant leading-relaxed">
            {world?.tagline || "Sound. Object. Design. Hand-formed instruments built to last generations."}
          </p>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
        <ScrollReveal>
          <HeroCarousel
            images={[
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
            ]}
            alt="Svvara V100 Turntable"
          />
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        <div className="grid gap-8 lg:gap-16 lg:grid-cols-2">
          <ScrollReveal>
            <div className="space-y-12">
              <div>
                <h2 className="mb-4 text-headline-sm font-display uppercase tracking-wide text-on-surface">THE V100</h2>
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  {world?.description || "Designed by experienced audio practitioners, the SVVARA V100 delivers a premium-class listening experience in a package anyone can live with — a high-precision stylus that captures every detail, a built-in 2-way speaker system that fills the room, and Bluetooth that lets your digital library join the analog party. Timeless retro aesthetics, dependable performance, proudly made in Indonesia."}
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

          <ScrollReveal>
            <ProductCarousel products={displayProducts} />
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
              <p className="text-body-sm text-on-surface-variant">{SVVARA_CONTACT.store}</p>
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
