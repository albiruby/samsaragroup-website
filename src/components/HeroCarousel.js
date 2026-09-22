"use client";

import { useState, useEffect, useCallback } from "react";

export default function HeroCarousel({ images, alt = "Hero image", interval = 4000 }) {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(new Set([0]));

  const prev = useCallback(() => {
    setCurrent((c) => {
      const next = c === 0 ? images.length - 1 : c - 1;
      setLoaded((s) => new Set([...s, next]));
      return next;
    });
  }, [images.length]);

  const next = useCallback(() => {
    setCurrent((c) => {
      const nxt = (c + 1) % images.length;
      setLoaded((s) => new Set([...s, nxt]));
      return nxt;
    });
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => {
        const nxt = (prev + 1) % images.length;
        setLoaded((s) => new Set([...s, nxt]));
        return nxt;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full aspect-[4/3] md:aspect-[21/9] overflow-hidden bg-surface-container-low group">
      {images.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-800 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          {loaded.has(i) && (
            <img src={src} alt={`${alt} ${i + 1}`} className="h-full w-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
          )}
        </div>
      ))}

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            aria-label="Previous image"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 2L4 7l5 5" /></svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            aria-label="Next image"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 2l5 5-5 5" /></svg>
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrent(i);
                  setLoaded((s) => new Set([...s, i]));
                }}
                className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-white" : "bg-white/40"}`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
