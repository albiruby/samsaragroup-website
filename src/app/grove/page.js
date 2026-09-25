import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import ThemeSetter from "@/components/ThemeSetter";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Grove — Samsara Group",
  description: "The lighter cafe. Casual, relaxed, and always good vibes.",
};

export default function GrovePage() {
  const specs = [
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
          <h1 className="text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface">GROVE</h1>
          <p className="mt-6 max-w-lg text-body-md text-on-surface-variant leading-relaxed">
            The lighter cafe. Casual, relaxed, and always good vibes.
          </p>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
        <ScrollReveal>
          <div className="img-hover w-full aspect-[4/3] md:aspect-[21/9]">
            <img src="/ambiencesamsara/DSC09058.webp" alt="Grove" className="h-full w-full object-cover" />
          </div>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        <div className="grid gap-8 lg:gap-16 lg:grid-cols-2">
          <ScrollReveal>
            <div className="space-y-12">
              <div>
                <h2 className="mb-4 text-headline-sm font-display uppercase tracking-wide text-on-surface">THE VISION</h2>
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  Less formal, more feeling. Grove is the casual counterpart to Samsara — same soul, lighter touch. A cafe where you come as you are, stay as long as you want, and leave a little lighter than you arrived.
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

      <Footer />
    </>
  );
}
