import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import FadeInImage from "@/components/FadeInImage";
import ThemeSetter from "@/components/ThemeSetter";

export default function UbudLocationPage() {
  return (
    <>
      <ThemeSetter theme="light" />
      <Header />

      <section className="bg-surface pt-28 pb-16 max-w-[1520px] mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <Link href="/locations" className="mb-8 inline-flex items-center gap-2 text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant hover:text-terracotta transition-colors">LOCATIONS</Link>
          <span className="text-on-surface-variant mx-3">/</span>
          <span className="text-label-caps-sm uppercase tracking-[0.2em] text-on-surface">UBUD</span>
          <h1 className="mt-4 text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface">UBUD</h1>
          <p className="mt-6 max-w-lg text-body-md text-on-surface-variant leading-relaxed">
            A highland retreat where nature sets the pace. Stillness woven into every surface and sound.
          </p>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
        <ScrollReveal>
          <div className="w-full aspect-[4/3] md:aspect-[21/9] overflow-hidden">
            <FadeInImage src="/ambiencesamsara/DSC08527.jpg" alt="Ubud Location" className="h-full w-full object-cover" />
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
                    On the road to Sanggingan, where the rice terraces begin their descent. Our Ubud location is a wellness-first space built from river stone and reclaimed teak. Morning light filters through bamboo. The day unfolds without hurry.
                  </p>
                </div>

                <div className="border-t border-outline-variant pt-8">
                  <h2 className="mb-6 text-headline-sm font-display uppercase tracking-wide text-on-surface">DETAILS</h2>
                  <div className="space-y-4">
                    {[
                      ["Address", "Jl. Raya Sanggingan, Ubud, Gianyar, Bali 80561"],
                      ["Hours", "08:00 – 22:00"],
                      ["Phone", "+62 361 978 901"],
                      ["Concept", "Highland wellness retreat"],
                      ["Focus", "Wellness, nature, restoration"],
                    ].map(([label, value]) => (
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

          <div className="lg:col-span-5">
            <ScrollReveal>
              <div className="space-y-8">
                <div className="border border-outline-variant bg-surface-container-low p-8">
                  <h2 className="mb-4 text-headline-sm font-display uppercase tracking-wide text-on-surface">THE ATMOSPHERE</h2>
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    Jungle canopy and the sound of running water. The architecture disappears into landscape. A place designed for unwinding the body and quieting the mind. Nature is not the backdrop here. It is the practice.
                  </p>
                </div>
                <Link href="/contact" className="inline-flex w-full items-center justify-center gap-3 bg-primary px-8 py-4 text-label-caps-sm uppercase tracking-widest text-on-primary transition-colors hover:bg-primary-container">
                  GET IN TOUCH
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
