"use client";

import { useState, useEffect, useCallback } from "react";

export default function HeroCarousel({ images, alt = "Hero image", interval = 4000 }) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full aspect-[4/3] md:aspect-[21/9] overflow-hidden bg-surface-container-low">
      {images.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-800 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img src={src} alt={`${alt} ${i + 1}`} className="h-full w-full object-cover" />
        </div>
      ))}
    </div>
  );
}
