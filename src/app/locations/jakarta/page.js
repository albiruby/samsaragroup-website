"use client";

import { useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import FadeInImage from "@/components/FadeInImage";
import { useTheme } from "@/components/ThemeProvider";

export default function JakartaLocationPage() {
  const { setTheme } = useTheme();
  useEffect(() => { setTheme("light"); return () => setTheme("light"); }, [setTheme]);

  return (
    <>
      <Header />

      <section className="bg-surface pt-28 pb-16 max-w-[1520px] mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <Link href="/locations" className="mb-8 inline-flex items-center gap-2 text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant hover:text-terracotta transition-colors">LOCATIONS</Link>
          <span className="text-on-surface-variant mx-3">/</span>
          <span className="text-label-caps-sm uppercase tracking-[0.2em] text-on-surface">JAKARTA</span>
          <h1 className="mt-4 text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface">JAKARTA</h1>
          <p className="mt-6 max-w-lg text-body-md text-on-surface-variant leading-relaxed">
            An urban sanctuary in the heart of Senopati. Where contemporary design meets the relentless energy of the capital.
          </p>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
        <ScrollReveal>
          <div className="w-full aspect-[4/3] md:aspect-[21/9] overflow-hidden">
            <FadeInImage src="/ambiencesamsara/DSC08494.jpg" alt="Jakarta Location" className="h-full w-full object-cover" />
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
                    Our flagship location on Jl. Senopati. A contemporary design hub housing a curated retail space, atelier, and gathering room. Built for those who move between intention and impulse. Jakarta distilled into one address.
                  </p>
                </div>

                <div className="border-t border-outline-variant pt-8">
                  <h2 className="mb-6 text-headline-sm font-display uppercase tracking-wide text-on-surface">DETAILS</h2>
                  <div className="space-y-4">
                    {[
                      ["Address", "Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan"],
                      ["Hours", "09:00 – 21:00"],
                      ["Phone", "+62 21 7234 567"],
                      ["Concept", "Contemporary design hub"],
                      ["Focus", "Retail, atelier, gathering"],
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
                    Concrete and glass softened by warmth. Every surface considered. A space that absorbs the city noise and returns something quieter. Designed to hold both solitude and conversation.
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
