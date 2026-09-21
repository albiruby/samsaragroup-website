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
];

const marqueeImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCQmBg4kvXIMCi_ZCe8Le6xMtHoEoiS_hJ_Ht-u4T-nq0FyD1kI-cmljJW86GGLxuLq6dgqn2lTjawXtFboD2uwSdHPpwD8Xz0AbUUbdypcz3dYh4oD2CG5LG9So0nQQHF3cfl_sq-l4n2v8TG7yNjEeyi-7hzJOXsFj58-KV5PptEZ4Xp-4cwA11UxNnZ-WoRbyv7-J94P-fzkVv4uasg7Z2ZTw0USC7oooT6aZR0VJps2HysBnpZ3",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAARtFpYa_lXUkbEb4A8XI-KWfRs6nP2hq-_Mw5uXRVKGpGfgGPXw6uLPCb9Lk1yBlmxcigsJai6uf2HQiOEvRJu-5tA73QiuNFxSHeK-HFK0U1ZXW6I5iflD5cXG_0jbXnsI92C53R_DUakuRds5Zcbqt6iV-ep7AvhVBZyfqaml5y5DVPGR6U95a9E8Kr0PeMdPcbxVsTkUXNLSWs5huKsgYQVBn2Z6ZuKnaOQeSWba_3hjxnfs5A",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBxmAlsOQm3o_ps7vQB4K0A2jyRwPcLthVB15dNACEJwDfaH9tVn4VOMqJB_6Th6WpKBFsKEX4CgkANSxgmWT049ncxex_GO4n4hD0mKR4OlbLtndGlqeV1ZNZOtVozjR4rXLtVoFMHfYD0rZQy5sfWSE1K-XNJWEbBAa419OORXKrwCitXqhC8xXJhvq47iPpVfh3P7tGZCwhpgJVObeAtgjOYw6Rbc-qVCdfu3uVCk4KM7gXlSBHo",
  "https://lh3.googleusercontent.com/aida/AEtjO1V_sLNydkRNgm0GCMvP_kCWbHCi4TKmSsxtgSZe-Rl3i6jNx-T-e5DDp4nW7v9B7lRbNqdJhaIfDULWVpGbS6ZmHepkFaY8Fp-4oQvCcGIPEZIGggV4yyX6x0Q7gKgULguF4Ix_EKOtQS7_YChvHm-pZBuq42yuAJyPz6Pal9cO0SHH6TdeS2N-6ClpXmFVNDgYDxMMYMTyd_SHp3FI8qMs493bOPZ3aKD9NmTyLfZIBD1C3JUh3Ww6sBM",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBe4786-aPSLIKjY6KL1briNx1tY4t_g8YCk7Dn33qDkJkM1Q-6SkfW3Snxlo33go4uOvhQREvrdlBCVo9kt6ug_mxCD4qwxwodtfQ_6WRj1wKZb2oyft8kYl2YeFxbkyRXUeBPqEBf584VrGYjBY85vXXSnI1dly-laKWyO89RZiZw5ASluI5bndGEN3WXFKVCSwIQrbCKyFEjQ9usSoDC_p-2yAzYUMHBnAWPdxsU0D6G_Z6aX2u2",
  "https://lh3.googleusercontent.com/aida/AEtjO1Ugbm8YmUkqXyuLDoAGids7DBO4MTlol_8UmmHN5BgfzIbRaPJCNmv_5m5bQ_Ru6mXzy9nxYrkRqRS7AwR3pfvdag80nzMjiDCcCFn6e_5aV0YtekynLVE76nc4KyMP74y3R4ZMwsUn83AFECeVMNrGyV6bCrl5UUC3lLuYjuHFnHzsk0yrfHWWkdlwTvIYXk495XJEruUWDaP7M_ibl2-kIL2GHePzKFvhdL9hG2Z6owjnN4EqZeTWtp4",
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
          <img src="/tampilanawal.webp" alt="Sams Group" className="absolute inset-0 w-full h-full object-cover" />
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
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQmBg4kvXIMCi_ZCe8Le6xMtHoEoiS_hJ_Ht-u4T-nq0FyD1kI-cmljJW86GGLxuLq6dgqn2lTjawXtFboD2uwSdHPpwD8Xz0AbUUbdypcz3dYh4oD2CG5LG9So0nQQHF3cfl_sq-l4n2v8TG7yNjEeyi-7hzJOXsFj58-KV5PptEZ4Xp-4cwA11UxNnZ-WoRbyv7-J94P-fzkVv4uasg7Z2ZTw0USC7oooT6aZR0VJps2HysBnpZ3" alt="About" className="h-full w-full object-cover" />
                </div>
              </ImageParallax>
            </div>
          </div>
        </section>

        {/* ── Four Worlds ── */}
        <section className="bg-surface-container-low w-full">
          <div className="max-w-[1520px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
            <span className="font-label text-body-sm uppercase tracking-[0.15em] text-on-surface-variant mb-3 block">OUR WORLDS</span>
            <div className="flex items-end gap-4 mb-10 lg:mb-12">
              <TextClipReveal>
                <h2 className="font-display text-headline-md lg:text-headline-lg uppercase leading-[0.95] tracking-tight text-on-surface">
                  <NumberCounter target={4} duration={1000} /> IMMERSIVE WORLDS
                </h2>
              </TextClipReveal>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-outline-variant">
              {worlds.map((world) => (
                <Link key={world.name} href={world.href} className="group card-hover bg-surface-container-low p-6 lg:p-8 hover:bg-surface transition-colors">
                  <span className="font-label text-body-sm uppercase tracking-[0.1em] text-on-surface-variant block mb-3">{world.tagline}</span>
                  <h3 className="font-display text-headline-sm uppercase text-on-surface mb-2 group-hover:text-terracotta transition-colors">{world.name}</h3>
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

        {/* ── Experiences ── */}
        <section className="bg-surface w-full">
          <div className="max-w-[1520px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              <ImageParallax className="relative h-[400px] lg:h-[520px]">
                <div className="img-fade h-full w-full">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAARtFpYa_lXUkbEb4A8XI-KWfRs6nP2hq-_Mw5uXRVKGpGfgGPXw6uLPCb9Lk1yBlmxcigsJai6uf2HQiOEvRJu-5tA73QiuNFxSHeK-HFK0U1ZXW6I5iflD5cXG_0jbXnsI92C53R_DUakuRds5Zcbqt6iV-ep7AvhVBZyfqaml5y5DVPGR6U95a9E8Kr0PeMdPcbxVsTkUXNLSWs5huKsgYQVBn2Z6ZuKnaOQeSWba_3hjxnfs5A" alt="Experiences" className="h-full w-full object-cover" />
                </div>
              </ImageParallax>
              <div className="flex flex-col justify-center">
                <span className="font-label text-body-sm uppercase tracking-[0.15em] text-on-surface-variant mb-4 block">EXPERIENCES</span>
                <TextClipReveal>
                  <h2 className="font-display text-headline-md lg:text-headline-md uppercase leading-[0.95] tracking-tight mb-5 text-on-surface">
                    A SPACE SHAPED BY SOUND, RITUAL, AND CARE
                  </h2>
                </TextClipReveal>
                <p className="font-body text-body-lg text-on-surface-variant leading-relaxed max-w-lg mb-8">
                  From volcanic highlands to the edge of the sea, every destination is a dialogue between place and purpose.
                </p>
                <MagneticButton strength={0.2}>
                  <Link href="/contact" className="inline-flex items-center gap-3 border border-on-surface/20 px-8 py-4 font-label text-body-sm uppercase tracking-[0.15em] text-on-surface hover:bg-on-surface hover:text-surface transition-colors">
                    EXPLORE
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 6h10M7 2l4 4-4 4" /></svg>
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </div>
        </section>

        {/* ── Make Together ── */}
        <section className="bg-surface-container w-full">
          <div className="max-w-[1520px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
            <span className="font-label text-body-sm uppercase tracking-[0.15em] text-on-surface-variant mb-3 block">COLLABORATIONS</span>
            <TextClipReveal>
              <h2 className="font-display text-headline-md lg:text-headline-md uppercase leading-[0.95] tracking-tight mb-10 lg:mb-12 text-on-surface">
                MAKE TOGETHER
              </h2>
            </TextClipReveal>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                { title: "OUR VALUES", desc: "Craft. Community. Sustainability. Growth." },
                { title: "OPEN ROLES", desc: "Join a team building something that does not yet exist." },
                { title: "PARTNERSHIPS", desc: "Collaborate with makers, growers, and visionaries." },
              ].map((item) => (
                <div key={item.title} className="border border-outline-variant p-8 lg:p-10">
                  <h3 className="font-display text-headline-sm uppercase mb-4 text-on-surface">{item.title}</h3>
                  <p className="font-body text-body-sm text-on-surface-variant mb-6">{item.desc}</p>
                  <Link href="/contact" className="inline-flex items-center gap-2 font-label text-body-sm uppercase tracking-[0.12em] text-on-surface hover:text-terracotta transition-colors">
                    LEARN MORE
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 6h10M7 2l4 4-4 4" /></svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-primary-container w-full">
          <div className="max-w-[1520px] mx-auto px-6 lg:px-10 py-20 lg:py-32 text-center">
            <TextClipReveal>
              <h2 className="font-display text-headline-md lg:text-headline-lg uppercase leading-[0.95] tracking-tight mb-6 text-on-primary-container">
                COME EXPERIENCE<br />OUR WORLD.
              </h2>
            </TextClipReveal>
            <MagneticButton strength={0.2}>
              <Link href="/contact" className="inline-flex items-center gap-3 bg-primary px-10 py-4 font-label text-body-sm uppercase tracking-[0.15em] text-on-primary hover:bg-primary/90 transition-colors">
                GET IN TOUCH
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 6h10M7 2l4 4-4 4" /></svg>
              </Link>
            </MagneticButton>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
