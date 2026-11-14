"use client";

import { useCallback, useEffect, useState } from "react";
import ZoomableImage from "@/components/ZoomableImage";

/**
 * One page reads as a single image, two sit side by side, and three or more turn
 * into a page turner. The strip of thumbnails was removed on purpose: the pager
 * stays as simple as the one it replaced.
 */
const PAGER_MIN = 3;

export default function MenuGallery({ panels = [], heading = "MENU" }) {
  const images = panels.filter((p) => p.src);
  const [current, setCurrent] = useState(1);

  const total = images.length;
  const paged = total >= PAGER_MIN;
  const grid = total === 2;

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
        <div className="w-full max-w-3xl">
          <ZoomableImage
            src={images[0].src}
            alt={images[0].alt || heading}
            className="w-full h-auto"
          />
        </div>
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
    </div>
  );
}