"use client";

import { useCallback, useEffect, useState } from "react";
import ZoomableImage from "@/components/ZoomableImage";

const TOTAL_PAGES = 36;

const srcFor = (page) => `/menusamsara/${String(page).padStart(4, "0")}.webp`;

export default function MenuSection() {
  const [current, setCurrent] = useState(1);

  const prev = useCallback(() => setCurrent((p) => Math.max(1, p - 1)), []);
  const next = useCallback(() => setCurrent((p) => Math.min(TOTAL_PAGES, p + 1)), []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-full max-w-3xl border border-outline-variant overflow-hidden">
        <ZoomableImage
          key={current}
          src={srcFor(current)}
          alt={`Samsara Menu page ${current}`}
          className="w-full h-auto"
        />

        <button
          onClick={prev}
          disabled={current === 1}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-primary text-on-primary disabled:opacity-20 disabled:cursor-not-allowed hover:bg-primary-container transition-colors"
          aria-label="Previous page"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 3L5 8l5 5" />
          </svg>
        </button>
        <button
          onClick={next}
          disabled={current === TOTAL_PAGES}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-primary text-on-primary disabled:opacity-20 disabled:cursor-not-allowed hover:bg-primary-container transition-colors"
          aria-label="Next page"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 3l5 5-5 5" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-6">
        <span className="font-label text-body-sm tracking-[0.15em] text-on-surface-variant min-w-[80px] text-center">
          {current} / {TOTAL_PAGES}
        </span>
      </div>

      <div className="w-full max-w-3xl overflow-x-auto scrollbar-none" data-cursor="DRAG">
        <div className="flex w-max mx-auto gap-2">
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
                src={srcFor(page)}
                alt={`Menu page ${page}`}
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
