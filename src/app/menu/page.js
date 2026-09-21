"use client";

import { useState, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TOTAL_PAGES = 36;
const DRIVE_LINK = "https://drive.google.com/file/d/1inaLAAXyjMp9XQFk59lVd5VZtc0d75ST/view?usp=drivesdk";

function MenuViewer() {
  const [current, setCurrent] = useState(1);
  const [touchStart, setTouchStart] = useState(null);

  const prev = useCallback(() => setCurrent((p) => Math.max(1, p - 1)), []);
  const next = useCallback(() => setCurrent((p) => Math.min(TOTAL_PAGES, p + 1)), []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [prev, next]);

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    setTouchStart(null);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Image display */}
      <div
        className="relative w-full max-w-3xl bg-surface-container-low border border-outline-variant overflow-hidden select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={current}
          src={`/menu/${String(current).padStart(4, "0")}.jpg`}
          alt={`Samsara Menu page ${current}`}
          className="w-full h-auto"
          draggable={false}
        />

        {/* Nav arrows */}
        <button
          onClick={prev}
          disabled={current === 1}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-primary/60 backdrop-blur-sm text-surface disabled:opacity-20 disabled:cursor-not-allowed hover:bg-primary/80 transition-colors"
          aria-label="Previous page"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 3L5 8l5 5" />
          </svg>
        </button>
        <button
          onClick={next}
          disabled={current === TOTAL_PAGES}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-primary/60 backdrop-blur-sm text-surface disabled:opacity-20 disabled:cursor-not-allowed hover:bg-primary/80 transition-colors"
          aria-label="Next page"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 3l5 5-5 5" />
          </svg>
        </button>
      </div>

      {/* Page indicator + controls */}
      <div className="flex items-center gap-6">
        <button
          onClick={prev}
          disabled={current === 1}
          className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface disabled:opacity-20 disabled:cursor-not-allowed hover:bg-surface-container-low transition-colors"
          aria-label="Previous page"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 3L5 8l5 5" />
          </svg>
        </button>

        <span className="font-label text-body-sm tracking-[0.15em] text-on-surface-variant min-w-[80px] text-center">
          {current} / {TOTAL_PAGES}
        </span>

        <button
          onClick={next}
          disabled={current === TOTAL_PAGES}
          className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface disabled:opacity-20 disabled:cursor-not-allowed hover:bg-surface-container-low transition-colors"
          aria-label="Next page"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 3l5 5-5 5" />
          </svg>
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="w-full max-w-3xl overflow-x-auto scrollbar-none">
        <div className="flex gap-2 justify-center">
          {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrent(page)}
              className={`shrink-0 w-12 h-16 border overflow-hidden transition-all ${
                current === page
                  ? "border-terracotta ring-1 ring-terracotta opacity-100"
                  : "border-outline-variant opacity-50 hover:opacity-80"
              }`}
              aria-label={`Go to page ${page}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/menu/${String(page).padStart(4, "0")}.jpg`}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MenuPage() {
  return (
    <div>
      <Header />

      <section className="bg-surface pt-28 pb-8 max-w-[1520px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <h1 className="text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface">
            2026 SAMSARA MENU
          </h1>
          <a
            href={DRIVE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border border-outline px-6 py-3 text-label-caps-sm uppercase tracking-widest text-on-surface transition-colors hover:bg-primary hover:text-surface shrink-0"
          >
            DOWNLOAD PDF
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 1v8M2.5 5.5L6 9l3.5-3.5M1 11h10" />
            </svg>
          </a>
        </div>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        <MenuViewer />
      </section>

      <Footer />
    </div>
  );
}
