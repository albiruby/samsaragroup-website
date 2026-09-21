"use client";

import { useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import FadeInImage from "@/components/FadeInImage";
import { useTheme } from "@/components/ThemeProvider";

export default function MoonlitSessionPage() {
  const { setTheme } = useTheme();
  useEffect(() => { setTheme("light"); return () => setTheme("light"); }, [setTheme]);

  return (
    <>
      <Header />

      <section className="bg-surface pt-28 pb-16 max-w-[1520px] mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6">
            <Link href="/events" className="font-label text-[11px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-terracotta transition-colors">
              EVENTS
            </Link>
            <span className="text-on-surface-variant/40">/</span>
            <span className="font-label text-[11px] uppercase tracking-[0.2em] text-on-surface-variant">
              MOONLIT SESSION
            </span>
          </div>

          <h1 className="text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface mb-6">
            MOONLIT SESSION
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="font-label text-[11px] uppercase tracking-[0.15em] text-terracotta border border-terracotta/30 px-4 py-2">
              UPCOMING
            </span>
            <span className="font-label text-[11px] uppercase tracking-[0.15em] text-on-surface-variant">
              15 Mar 2025 · 20:00
            </span>
          </div>

          <p className="max-w-lg text-body-lg text-on-surface-variant leading-relaxed">
            An evening of acoustic stillness beneath open skies. No amplification, no speakers — just
            the resonance of handcrafted instruments in candlelit space. Limited to 40 guests.
          </p>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
        <ScrollReveal>
          <div className="relative h-[300px] md:h-[500px] overflow-hidden mb-16">
            <FadeInImage
              src="/ambiencesamsara/DSC08420.jpg"
              alt="Moonlit Session"
              className="w-full h-full object-cover"
            />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <ScrollReveal>
              <h2 className="font-display text-headline-sm uppercase mb-6 text-on-surface">
                ABOUT THE EVENT
              </h2>
              <div className="space-y-4 text-body-md text-on-surface-variant leading-relaxed">
                <p>
                  Moonlit Session is a recurring series of unplugged performances held in our
                  candlelit stone chambers. Each session features a single artist performing
                  without amplification — allowing the natural acoustics of the space to shape
                  the sound.
                </p>
                <p>
                  Guests are seated on handwoven rattan mats surrounding the performer. No
                  phones. No recordings. Just presence, sound, and the night air.
                </p>
              </div>
            </ScrollReveal>
          </div>

          <div>
            <ScrollReveal>
              <div className="border border-outline-variant p-8">
                <h3 className="font-label text-[11px] uppercase tracking-[0.15em] text-on-surface-variant mb-6">
                  EVENT DETAILS
                </h3>
                <div className="space-y-4">
                  <div>
                    <span className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant block mb-1">DATE</span>
                    <span className="text-body-md text-on-surface">15 Mar 2025</span>
                  </div>
                  <div>
                    <span className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant block mb-1">TIME</span>
                    <span className="text-body-md text-on-surface">20:00 — 23:00</span>
                  </div>
                  <div>
                    <span className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant block mb-1">VENUE</span>
                    <span className="text-body-md text-on-surface">Samsara Stone Chamber</span>
                  </div>
                  <div>
                    <span className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant block mb-1">CAPACITY</span>
                    <span className="text-body-md text-on-surface">40 guests</span>
                  </div>
                  <div>
                    <span className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant block mb-1">ENTRY</span>
                    <span className="text-body-md text-on-surface">By invitation</span>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="mt-8 w-full inline-flex items-center justify-center gap-3 bg-primary px-8 py-4 font-label text-[11px] uppercase tracking-[0.15em] text-on-primary hover:bg-primary/90 transition-colors"
                >
                  RESERVE A SEAT
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 6h10M7 2l4 4-4 4" />
                  </svg>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low w-full">
        <div className="max-w-[1520px] mx-auto px-6 lg:px-10 py-20 lg:py-32">
          <ScrollReveal>
            <h2 className="font-display text-headline-sm uppercase mb-12 text-on-surface">
              PAST SESSIONS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "NOCTURNE V", date: "22 Feb 2025", desc: "Deep listening in total darkness" },
                { name: "STONE RESONANCE", date: "08 Feb 2025", desc: "Volcanic stone chamber acoustics" },
                { name: "TEAK & BRASS", date: "25 Jan 2025", desc: "Handcrafted instrument showcase" },
              ].map((session) => (
                <div key={session.name} className="border-t border-outline-variant pt-6">
                  <span className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant block mb-2">
                    {session.date}
                  </span>
                  <h3 className="font-display text-title-lg uppercase text-on-surface mb-2">
                    {session.name}
                  </h3>
                  <p className="text-body-sm text-on-surface-variant">
                    {session.desc}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
