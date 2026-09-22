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

const worlds = [
  { name: "SAMSARA", tagline: "THE SANCTUARY", disciplines: "ACOUSTICS · DINING · RETREAT", href: "/samsara" },
  { name: "SVVARA", tagline: "TACTILE ARTIFACTS", disciplines: "SOUND OBJECTS · CRAFT · DESIGN", href: "/svvara" },
  { name: "SVARGA", tagline: "THE HIGHLANDS", disciplines: "HOSPITALITY · STILLNESS · NATURE", href: "/svarga" },
  { name: "ACASA", tagline: "LEISURE RITUALS", disciplines: "MOVEMENT · ATHLETICS · COMMUNITY", href: "/acasa" },
  { name: "OUTPACE", tagline: "VELOCITY & FORM", disciplines: "AUTOMOTIVE · RACING · ENGINEERING", href: "/outpace" },
  { name: "GROOVE", tagline: "RHYTHM & FLOW", disciplines: "MUSIC · PRODUCTION · SOUND", href: "/groove" },
];

const marqueeImages = [
  "/ambiencesamsara/DSC09421.jpg",
  "/ambiencesamsara/DSC09408.jpg",
  "/ambiencesamsara/DSC09354.jpg",
  "/ambiencesamsara/DSC09072.jpg",
  "/ambiencesamsara/DSC09058.jpg",
  "/ambiencesamsara/DSC09056.jpg",
];

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
          <img src="/ambiencesamsara/DSC08930.jpg" alt="Sams Group" className="absolute inset-0 w-full h-full object-cover" />
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
              </div>
              <ImageParallax className="relative h-[400px] lg:h-[500px]">
                <div className="img-zoom-out h-full w-full">
                  <img src="/ambiencesamsara/DSC08926.jpg" alt="About" className="h-full w-full object-cover" />
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
                  <NumberCounter target={6} duration={1000} /> IMMERSIVE WORLDS
                </h2>
              </TextClipReveal>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-outline-variant">
              {worlds.map((world) => (
                <Link key={world.name} href={world.href} className="group card-hover bg-surface-container-low p-5 lg:p-6 hover:bg-surface transition-colors">
                  <span className="font-label text-body-sm uppercase tracking-[0.1em] text-on-surface-variant block mb-2">{world.tagline}</span>
                  <h3 className="font-display text-headline-sm uppercase text-on-surface mb-1 group-hover:text-terracotta transition-colors">{world.name}</h3>
                  <p className="font-label text-body-sm uppercase tracking-[0.1em] text-on-surface-variant/60">{world.disciplines}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Marquee ── */}
        <section className="bg-surface w-full overflow-hidden py-6">
          <div className="marquee-track">
            <div className="marquee-content">
              {[...marqueeImages, ...marqueeImages].map((src, i) => (
                <div key={i} className="marquee-item">
                  <img src={src} alt={`Samsara experience ${i + 1}`} className="h-full w-full object-cover" />
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
