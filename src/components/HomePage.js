"use client";

import { useEffect } from "react";
import Link from "next/link";
import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TextClipReveal from "@/components/TextClipReveal";
import MagneticButton from "@/components/MagneticButton";
import ImageParallax from "@/components/ImageParallax";
import NumberCounter from "@/components/NumberCounter";
import { useTheme } from "@/components/ThemeProvider";
import { isActive } from "@/data/brandCategories";

const worlds = [
  { name: "SAMSARA", tagline: "THE SANCTUARY", disciplines: "LISTENING · DINING · CULTURE", href: "/samsara" },
  { name: "SVVARA", tagline: "TACTILE ARTIFACTS", disciplines: "ANALOG · VINYL · CRAFT", href: "/svvara" },
  { name: "SVARGA", tagline: "THE HIGHLANDS", disciplines: "HERITAGE · DINING · NATURE", href: "/svarga" },
  { name: "ACASA", tagline: "LEISURE RITUALS", disciplines: "STAY · DINING · PADEL", href: "/acasa" },
  { name: "OUTPACE", tagline: "THE RUNNING CAFE", disciplines: "RUNNING · SHOWER · COFFEE", href: "/outpace" },
  { name: "GROVE", tagline: "THE LIGHTER CAFE", disciplines: "COFFEE · CASUAL · VIBES", href: "/grove" },
].filter((w) => isActive(w.href));

const marqueeImages = [
  { src: "/ambiencesamsara/DSC09421.webp", brand: "Samsara" },
  { src: "/assetsvvara/SAVVARA-01268.webp", brand: "Svvara" },
  { src: "/assetsvarga/ADR (1 of 15).webp", brand: "Svarga" },
  { src: "/assetacasa/ADR-06545.webp", brand: "Acasa" },
  { src: "/ambiencesamsara/DSC09072.webp", brand: "Samsara" },
  { src: "/assetsvvara/SAVVARA-01649.webp", brand: "Svvara" },
  { src: "/assetsvarga/ADR (3 of 15).webp", brand: "Svarga" },
  { src: "/assetacasa/ADR-06480.webp", brand: "Acasa" },
  { src: "/ambiencesamsara/DSC08998.webp", brand: "Samsara" },
  { src: "/assetsvvara/SVVARA-03197.webp", brand: "Svvara" },
  { src: "/assetsvarga/ADR (2 of 4).webp", brand: "Svarga" },
  { src: "/assetacasa/ADR-06368.webp", brand: "Acasa" },
  { src: "/ambiencesamsara/DSC08575.webp", brand: "Samsara" },
  { src: "/assetsvvara/SVVARA-03220.webp", brand: "Svvara" },
  { src: "/assetsvarga/ADR (1 of 7).webp", brand: "Svarga" },
  { src: "/assetacasa/ADR-06529.webp", brand: "Acasa" },
].filter((m) => isActive("/" + m.brand.toLowerCase()));

export default function HomePage() {
  const { setTheme } = useTheme();
  useEffect(() => { setTheme("dark"); return () => setTheme("light"); }, [setTheme]);

  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelector(".hero-stagger")?.classList.add("entered");
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Preloader />
      <Header />
      <main className="w-full bg-surface">

        {/* ── Hero ── */}
        <section className="relative w-full h-[100dvh] min-h-[600px] overflow-hidden">
          <img src="/ambiencesamsara/DSC08930.webp" alt="Sams Group" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
          <div className="relative z-10 h-full flex flex-col justify-end px-6 lg:px-10 pb-16 lg:pb-24">
            <div className="hero-stagger">
              <h1 className="font-display text-headline-lg-mobile md:text-headline-lg lg:text-display-hero uppercase leading-[0.95] tracking-tight text-white max-w-4xl">
                WE CREATE PLACES<br />
                <span className="text-white/80">TO FEEL SOMETHING.</span>
              </h1>
            </div>
          </div>
        </section>

        {/* ── About ── */}
        <section className="bg-surface w-full">
          <div className="max-w-[1520px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <span className="font-label text-body-sm uppercase tracking-[0.15em] text-on-surface-variant mb-3 block">ABOUT US</span>
                <TextClipReveal>
                  <h2 className="font-display text-headline-md lg:text-headline-md uppercase leading-[0.95] tracking-tight mb-5 text-on-surface">
                    MORE THAN<br />A PLACE
                  </h2>
                </TextClipReveal>
                <p className="font-body text-body-lg text-on-surface-variant leading-relaxed max-w-lg">
                  A multidisciplinary lifestyle and hospitality group creating meaningful experiences across music, dining, design, and culture.
                </p>
                <Link
                  href="/about"
                  className="mt-6 inline-flex items-center gap-3 border border-on-surface/20 px-8 py-4 text-label-caps-sm uppercase tracking-widest text-on-surface transition-colors hover:bg-primary hover:text-on-primary"
                >
                  MORE ABOUT US
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 6h10M7 2l4 4-4 4" /></svg>
                </Link>
              </div>
              <ImageParallax className="relative h-[400px] lg:h-[500px]">
                <div className="img-zoom-out h-full w-full">
                  <img src="/ambiencesamsara/DSC08926.webp" alt="About" className="h-full w-full object-cover" />
                </div>
              </ImageParallax>
            </div>
          </div>
        </section>

        {/* ── Four Worlds ── */}
        <section className="bg-surface-container-low w-full">
          <div className="max-w-[1520px] mx-auto px-6 lg:px-10 py-10 lg:py-16">
            <span className="font-label text-body-sm uppercase tracking-[0.15em] text-on-surface-variant mb-2 block">OUR WORLDS</span>
            <div className="flex items-end gap-4 mb-6 lg:mb-8">
              <TextClipReveal>
                <h2 className="font-display text-headline-md lg:text-headline-lg uppercase leading-[0.95] tracking-tight text-on-surface">
                  <NumberCounter target={worlds.length} duration={1000} /> IMMERSIVE WORLDS
                </h2>
              </TextClipReveal>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-outline-variant">
              {worlds.map((world) => (
                <Link key={world.name} href={world.href} className="group card-hover bg-surface-container-low p-5 lg:p-6 hover:bg-surface transition-colors">
                  <span className="font-label text-body-sm uppercase tracking-[0.1em] text-on-surface-variant block mb-2">{world.tagline}</span>
                  <h3 className="font-display text-headline-sm uppercase text-on-surface mb-1 group-hover:text-terracotta transition-colors">{world.name}</h3>
                  <p className="font-label text-body-sm uppercase tracking-[0.1em] text-on-surface-variant">{world.disciplines}</p>
                </Link>
              ))}
              <div className="hidden md:block bg-surface-container-low" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* ── Marquee ── */}
        <section className="bg-surface w-full overflow-hidden py-6">
          <div className="marquee-track">
            <div className="marquee-content">
              {[...marqueeImages, ...marqueeImages].map((item, i) => (
                <div key={i} className="marquee-item">
                  <img src={item.src} alt={`${item.brand} experience`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
