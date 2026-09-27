"use client";

import { useEffect, useRef } from "react";

export default function TextClipReveal({ children, className = "" }) {
  const wrapperRef = useRef(null);
  const clipRef = useRef(null);

  useEffect(() => {
    const el = wrapperRef.current;
    const clip = clipRef.current;
    if (!el || !clip) return;

    // Observe the unclipped wrapper: Chromium computes a target's own clip-path
    // into its intersection rect, so observing the clipped element directly
    // would never fire and the content would stay hidden forever.
    const reveal = () => clip.classList.add("revealed");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className={className}>
      <div ref={clipRef} className="clip-reveal">
        {children}
      </div>
    </div>
  );
}
