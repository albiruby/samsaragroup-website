import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import ThemeSetter from "@/components/ThemeSetter";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCarousel from "@/components/ProductCarousel";
import { getWorlds, getProducts } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

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
          <h1 className="text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface">SVVARA</h1>
          <p className="mt-6 max-w-lg text-body-md text-on-surface-variant leading-relaxed">
            {world?.tagline || "Sound. Object. Design. Hand-formed instruments built to last generations."}
          </p>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
        <ScrollReveal>
          <HeroCarousel
            images={[
              "/assetsvvara/SVVARA-03220.jpg",
              "/assetsvvara/SVVARA-03197.jpg",
              "/assetsvvara/SVVARA-03168.jpg",
              "/assetsvvara/SVVARA-03133.jpg",
              "/assetsvvara/SVVARA-03089.jpg",
              "/assetsvvara/SVVARA-03047.jpg",
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

      <Footer />
    </>
  );
}
