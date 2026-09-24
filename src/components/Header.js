"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileMenu from "./MobileMenu";
import { brandCategories } from "../data/brandCategories";

const brandImages = {
  "/samsara": [
    "/ambiencesamsara/DSC08187.webp", "/ambiencesamsara/DSC08177.webp", "/ambiencesamsara/DSC08930.webp",
    "/ambiencesamsara/DSC08926.webp", "/ambiencesamsara/DSC08913.webp", "/ambiencesamsara/DSC09006.webp",
    "/ambiencesamsara/DSC08998.webp", "/ambiencesamsara/DSC08568.webp", "/ambiencesamsara/DSC08420.webp",
    "/ambiencesamsara/DSC08635.webp", "/ambiencesamsara/DSC09003.webp", "/ambiencesamsara/DSC09354.webp",
  ],
  "/svvara": [
    "/assetsvvara/SAVVARA-01268.webp", "/assetsvvara/SAVVARA-01362.webp", "/assetsvvara/SAVVARA-01506.webp",
    "/assetsvvara/SAVVARA-01649.webp", "/assetsvvara/SAVVARA-01840.webp", "/assetsvvara/SVVARA-03220.webp",
    "/assetsvvara/SVVARA-03197.webp", "/assetsvvara/SVVARA-03168.webp", "/assetsvvara/SVVARA-03133.webp",
    "/assetsvvara/SVVARA-03089.webp", "/assetsvvara/SAVVARA-01320.webp", "/assetsvvara/SAVVARA-01683.webp",
  ],
  "/svarga": [
    "/assetsvarga/ADR (3 of 15).webp",
    "/assetsvarga/ADR (4 of 4).webp",
    "/assetsvarga/ADR (2 of 4).webp",
    "/assetsvarga/ADR (3 of 4).webp",
    "/assetsvarga/ADR (1 of 4).webp",
  ],
  "/acasa": [
    "/assetacasa/ADR-06545.webp", "/assetacasa/ADR-06529.webp", "/assetacasa/ADR-06507.webp",
    "/assetacasa/ADR-06480.webp", "/assetacasa/ADR-06474.webp", "/assetacasa/ADR-06468.webp",
    "/assetacasa/ADR-06368.webp", "/assetacasa/ADR-06325.webp",
    "/assetacasa/ADR-06293.webp", "/assetacasa/ADR-06254.webp",
  ],
};

function preloadImages(srcs) {
  srcs.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [activeCat, setActiveCat] = useState(null);
  const brandsRef = useRef(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setBrandsOpen(false); }, [pathname]);

  useEffect(() => {
    if (!brandsOpen) return;
    const handleEscape = (e) => { if (e.key === "Escape") setBrandsOpen(false); };
    const handleClickOutside = (e) => {
      if (brandsRef.current && !brandsRef.current.contains(e.target)) setBrandsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [brandsOpen]);

  const isHomeTop = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-300 ${
        isHomeTop
          ? "bg-transparent"
          : "bg-primary/70 backdrop-blur-xl border-b border-white/10"
      }`}
    >
      <div className="w-full flex items-center justify-between h-16 lg:h-20 px-6 lg:px-10">
        <Link href="/" className="flex-shrink-0 flex items-center h-full overflow-hidden">
          <img src="/White Logo Samsara/whitefullsamping.png" alt="Samsara" className="h-8 lg:h-10 w-auto object-contain" />
        </Link>

        <nav className="hidden lg:flex items-center gap-6 lg:gap-8">
          <Link
            href="/"
            className="nav-link font-label text-sm lg:text-lg tracking-[0.15em] transition-colors duration-200 text-white/70 hover:text-white"
          >
            HOME
          </Link>

          <Link
            href="/about"
            className="nav-link font-label text-sm lg:text-lg tracking-[0.15em] transition-colors duration-200 text-white/70 hover:text-white"
          >
            ABOUT
          </Link>

          <div
            ref={brandsRef}
            className="relative flex"
            onMouseEnter={() => { setBrandsOpen(true); setActiveCat((c) => c ?? "ICONIC"); }}
            onMouseLeave={() => setBrandsOpen(false)}
          >
            <Link
              href="/about#brands"
              className="nav-link font-label text-sm lg:text-lg tracking-[0.15em] transition-colors duration-200 text-white/70 hover:text-white"
            >
              BRANDS
            </Link>
            {brandsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-[100] max-w-[calc(100vw-2rem)]">
                <div className="flex bg-surface border border-outline-variant shadow-lg rounded-2xl overflow-hidden">
                  <div className="py-4 border-r border-outline-variant min-w-[260px]">
                    {brandCategories.map((cat) => (
                      <button
                        key={cat.name}
                        onMouseEnter={() => setActiveCat(cat.name)}
                        onFocus={() => setActiveCat(cat.name)}
                        className={`block w-full text-left px-7 py-4 font-label text-label-sm tracking-[0.14em] uppercase transition-colors cursor-pointer ${
                          activeCat === cat.name
                            ? "bg-surface-container-low text-on-surface"
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                  <div className="py-4 min-w-[500px] max-w-[560px] flex flex-col">
                    <div className="flex-1">
                      {activeCat ? (
                        (brandCategories.find((c) => c.name === activeCat)?.brands ?? []).map((b) => (
                          <Link
                            key={b.href}
                            href={b.href}
                            onMouseEnter={() => {
                              const imgs = brandImages[b.href];
                              if (imgs) preloadImages(imgs);
                            }}
                            onClick={() => setBrandsOpen(false)}
                            className="flex items-center gap-6 px-7 py-3.5 hover:bg-surface-container-low transition-colors"
                          >
                            <span className="flex-shrink-0 w-44 flex items-center">
                              {b.logo && (
                                <img src={b.logo} alt={b.label} className="max-w-full max-h-12 object-contain" />
                              )}
                            </span>
                            <span className="min-w-0">
                              <span className="block font-label text-label-sm tracking-[0.14em] uppercase text-on-surface">{b.label}</span>
                              <span className="block font-body text-body-sm italic text-on-surface-variant mt-0.5">{b.speciality}</span>
                            </span>
                          </Link>
                        ))
                      ) : (
                        <p className="px-7 py-3 font-label text-label-sm tracking-[0.14em] uppercase text-on-surface-variant/70">
                          Hover a category
                        </p>
                      )}
                    </div>
                    <div className="border-t border-outline-variant mt-2">
                      <Link
                        href="/about#brands"
                        onClick={() => setBrandsOpen(false)}
                        className="block px-7 py-4 font-label text-label-sm tracking-[0.14em] uppercase text-on-surface hover:text-terracotta transition-colors"
                      >
                        See All Brands →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/events"
            className="nav-link font-label text-sm lg:text-lg tracking-[0.15em] transition-colors duration-200 text-white/70 hover:text-white"
          >
            EVENTS
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            className="hidden sm:inline-block font-label text-body-sm tracking-[0.12em] px-6 py-2.5 border border-white/40 text-white transition-colors duration-200 hover:bg-white hover:text-primary"
          >
            CONTACT NOW
          </Link>

          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden flex items-center justify-center w-11 h-11 font-label text-label-uppercase transition-colors duration-200 text-white/70 hover:text-white"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
