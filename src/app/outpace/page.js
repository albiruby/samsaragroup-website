import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import ThemeSetter from "@/components/ThemeSetter";

export const metadata = {
  title: "Outpace — Samsara Group",
  description: "A running cafe. Coffee, shower, and community for runners.",
};

export default function OutpacePage() {
  const specs = [
    ["Concept", "Cafe for runners"],
    ["Facilities", "Shower · Coffee · Lockers"],
    ["Community", "Morning runs, group sessions"],
  ];

  return (
    <>
      <ThemeSetter theme="dark" />
      <Header />

      <section className="bg-surface pt-28 pb-16 max-w-[1520px] mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">WORLDS</span>
          <h1 className="text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface">OUTPACE</h1>
          <p className="mt-6 max-w-lg text-body-md text-on-surface-variant leading-relaxed">
            A running cafe. Coffee, shower, and community for those who move.
          </p>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
        <ScrollReveal>
          <div className="img-hover w-full aspect-[4/3] md:aspect-[21/9]">
            <img src="/ambiencesamsara/DSC09052.jpg" alt="Outpace" className="h-full w-full object-cover" />
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
                  Run first, coffee after. Outpace is a pit stop for runners — fresh showers, strong coffee, and a community that moves. Whether you're training for a marathon or just starting your first kilometer, this is where the run ends and the conversation begins.
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
