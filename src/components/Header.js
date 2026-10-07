"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileMenu from "./MobileMenu";
import { useBrandNav } from "./BrandsProvider.jsx";

const brandImages = {
  "/samsara": [
    "/ambiencesamsara/DSC08187.webp", "/ambiencesamsara/DSC08177.webp", "/ambiencesamsara/DSC08930.webp",
    "/ambiencesamsara/DSC08926.webp", "/ambiencesamsara/DSC08913.webp", "/ambiencesamsara/DSC09006.webp",
    "/ambiencesamsara/DSC08998.webp", "/ambiencesamsara/DSC08568.webp", "/ambiencesamsara/DSC08420.webp",
    "/ambiencesamsara/DSC08635.webp", "/ambiencesamsara/DSC09003.webp", "/ambiencesamsara/DSC09354.webp",
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
  const { categories: brandCategories, seeAllLabel, emptyLabel } = useBrandNav();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [activeCat, setActiveCat] = useState(null);
  const brandsRef = useRef(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setBrandsOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  // The right-hand column always shows the brands of the row being hovered, so the
  // panel header can count them and the list never lags a frame behind the label.
  const activeBrands = useMemo(
    () => brandCategories.find((c) => c.name === activeCat)?.brands ?? [],
    [brandCategories, activeCat]
  );

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-300 ${
        isHomeTop
          ? "bg-transparent"
          : "bg-primary/70 backdrop-blur-xl border-b border-white/10"
      }`}
    >
      <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center gap-4 h-16 lg:h-20 px-6 lg:px-10">
        <Link href="/" className="col-start-1 justify-self-start flex-shrink-0 flex items-center h-full overflow-hidden">
          <img src="/White Logo Samsara/whitefullsamping-480.webp" alt="Samsara" className="h-8 lg:h-10 w-auto object-contain" />
        </Link>

        <nav className="col-start-2 hidden lg:pointer-fine:flex items-center gap-6 lg:gap-8 justify-self-center">
          <Link
            href="/"
            className="nav-link font-label text-sm lg:text-lg tracking-[0.15em] transition-colors duration-200 text-white/70 hover:text-white"
          >
            HOME
          </Link>

          <div
            ref={brandsRef}
            className="relative flex"
            onMouseEnter={() => {
              setBrandsOpen(true);
              setActiveCat((c) => (brandCategories.some((b) => b.name === c) ? c : brandCategories[0]?.name ?? null));
            }}
            onMouseLeave={() => setBrandsOpen(false)}
          >
            <Link
              href="/brands"
              onClick={() => setBrandsOpen(false)}
              className="nav-link font-label text-sm lg:text-lg tracking-[0.15em] transition-colors duration-200 text-white/70 hover:text-white cursor-pointer"
            >
              BRANDS
            </Link>
            {brandsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-[100] max-w-[calc(100vw-2rem)]">
                <div className="flex bg-surface border border-outline-variant shadow-lg rounded-2xl overflow-hidden">
                  <div className="p-2 border-r border-outline-variant min-w-[240px]">
                    {brandCategories.map((cat, i) => (
                      <button
                        key={cat.name}
                        onMouseEnter={() => setActiveCat(cat.name)}
                        onFocus={() => setActiveCat(cat.name)}
                        className={`relative block w-full text-left px-5 py-4 font-label text-label-sm tracking-[0.14em] uppercase transition-colors cursor-pointer ${
                          activeCat === cat.name
                            ? "bg-surface-container-low text-on-surface font-bold"
                            : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low/50 font-normal"
                        }`}
                      >
                        {cat.name}
                        {i < brandCategories.length - 1 && (
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute bottom-0 left-5 right-5 h-px bg-outline-variant/50"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="p-2 min-w-[360px] max-w-[440px] flex flex-col">
                    <div className="relative flex items-baseline gap-2 px-5 py-4">
                      <span className="font-label text-label-sm tracking-[0.14em] uppercase text-on-surface">
                        Brands
                      </span>
                      <span className="font-label text-label-sm tracking-[0.14em] text-on-surface-variant/70">
                        ({activeBrands.length})
                      </span>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-0 left-5 right-5 h-px bg-outline-variant"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      {activeBrands.length ? (
                        activeBrands.map((b, i) => (
                          <Link
                            key={b.href}
                            href={b.href}
                            onMouseEnter={() => {
                              const imgs = brandImages[b.href];
                              if (imgs) preloadImages(imgs);
                            }}
                            onClick={() => setBrandsOpen(false)}
                            className="relative flex items-center gap-4 px-5 py-3 hover:bg-surface-container-low transition-colors"
                          >
                            <span className="min-w-0">
                              <span className="block font-label text-label-sm font-bold tracking-[0.14em] uppercase text-on-surface">
                                {b.label}
                              </span>
                              <span className="block font-body text-body-sm font-normal italic text-on-surface-variant mt-1">
                                {b.speciality}
                              </span>
                            </span>
                            {i < activeBrands.length - 1 && (
                              <span
                                aria-hidden="true"
                                className="pointer-events-none absolute bottom-0 left-5 right-5 h-px bg-outline-variant/50"
                              />
                            )}
                          </Link>
                        ))
                      ) : emptyLabel ? (
                        <p className="px-5 py-4 font-label text-label-sm tracking-[0.14em] uppercase text-on-surface-variant/70">
                          {emptyLabel}
                        </p>
                      ) : null}
                    </div>
                    {seeAllLabel && (
                      <div className="relative">
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute top-0 left-5 right-5 h-px bg-outline-variant"
                        />
                        {/* pt-3/pb-4 keeps this label level with the last category row
                            while the rule above it sits close to the text. */}
                        <Link
                          href="/brands"
                          onClick={() => setBrandsOpen(false)}
                          className="block px-5 pt-3 pb-4 font-label text-label-sm tracking-[0.14em] uppercase text-on-surface hover:text-terracotta transition-colors"
                        >
                          {seeAllLabel}
                        </Link>
                      </div>
                    )}
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

          <Link
            href="/career"
            className="nav-link font-label text-sm lg:text-lg tracking-[0.15em] transition-colors duration-200 text-white/70 hover:text-white"
          >
            CAREER
          </Link>

          <Link
            href="/about"
            className="nav-link font-label text-sm lg:text-lg tracking-[0.15em] transition-colors duration-200 text-white/70 hover:text-white"
          >
            ABOUT
          </Link>
        </nav>

        <div className="col-start-3 flex items-center gap-4 justify-self-end">
          <Link
            href="/contact"
            className="hidden sm:inline-block font-label text-body-sm tracking-[0.12em] px-6 py-2.5 border border-white/40 text-white transition-colors duration-200 hover:bg-white hover:text-primary"
          >
            CONTACT NOW
          </Link>

          <button
            onClick={() => setMenuOpen(true)}
            className="lg:pointer-fine:hidden flex items-center justify-center w-11 h-11 font-label text-label-uppercase transition-colors duration-200 text-white/70 hover:text-white"
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
