"use client";

import { useCallback, useEffect, useState } from "react";
import ZoomableImage from "@/components/ZoomableImage";

const THUMB_HEIGHT = 64; // px — thumbnails share one height, widths follow source ratio
const GRID_MAX = 4;
const PAGER_MIN = 5;

/** Preview images carry their own dimensions so thumbnails keep the source ratio. */
function thumbBox(panel) {
  const w = panel.width;
  const h = panel.height;
  if (!w || !h) return undefined;
  return { aspectRatio: `${w} / ${h}`, height: THUMB_HEIGHT };
}

export default function MenuGallery({ panels = [], heading = "MENU" }) {
  const images = panels.filter((p) => p.src);
  const [current, setCurrent] = useState(1);

  const total = images.length;
  const paged = total >= PAGER_MIN;
  const grid = total > 1 && !paged;

  const prev = useCallback(
    () => setCurrent((p) => Math.max(1, p - 1)),
    []
  );
  const next = useCallback(
    () => setCurrent((p) => Math.min(total, p + 1)),
    [total]
  );

  useEffect(() => {
    if (!paged) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paged, prev, next]);

  if (total === 0) return null;

  /* A single image needs no chrome — it is just the menu. */
  if (total === 1) {
    return (
      <div className="flex flex-col items-center gap-6">
        {heading ? (
          <h2 className="mb-6 text-headline-sm font-display uppercase tracking-wide text-on-surface">
            {heading}
          </h2>
        ) : null}
        <ZoomableImage
          src={images[0].src}
          alt={images[0].alt || heading}
          className="w-full h-auto"
        />
      </div>
    );
  }

  /* A handful of pages reads better as a grid than as a pager. */
  if (grid) {
    return (
      <div className="flex flex-col items-center gap-6">
        {heading ? (
          <h2 className="mb-6 text-headline-sm font-display uppercase tracking-wide text-on-surface">
            {heading}
          </h2>
        ) : null}
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-6">
          {images.map((panel) => (
            <ZoomableImage
              key={panel.key}
              src={panel.src}
              alt={panel.alt || panel.tabLabel || heading}
              className="w-full h-auto"
            />
          ))}
        </div>
      </div>
    );
  }

  const active = images[Math.min(current, total) - 1];

  return (
    <div className="flex flex-col items-center gap-6">
      {heading ? (
        <h2 className="mb-6 text-headline-sm font-display uppercase tracking-wide text-on-surface">
          {heading}
        </h2>
      ) : null}

      <div className="relative w-full max-w-3xl border border-outline-variant overflow-hidden">
        <ZoomableImage
          key={active.key}
          src={active.src}
          alt={active.alt || active.tabLabel || heading}
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
          disabled={current === total}
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
          {current} / {total}
        </span>
      </div>

      <div className="w-full max-w-3xl overflow-x-auto scrollbar-none" data-cursor="DRAG">
        <div className="flex w-max mx-auto items-end gap-2">
          {images.map((panel, i) => (
            <button
              key={panel.key}
              onClick={() => setCurrent(i + 1)}
              style={thumbBox(panel)}
              className={`shrink-0 border overflow-hidden transition-all ${
                current === i + 1
                  ? "border-terracotta ring-1 ring-terracotta opacity-100"
                  : "border-outline-variant opacity-50 hover:opacity-80"
              }`}
              aria-label={`Go to page ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={panel.src}
                alt={panel.tabLabel || `Page ${i + 1}`}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}