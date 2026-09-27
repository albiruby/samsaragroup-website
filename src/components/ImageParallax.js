"use client";

import { useEffect, useRef } from "react";

export default function ImageParallax({ children, className = "", speed = 0.07 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const viewCenter = window.innerHeight / 2;
        // Clamp to the 5% headroom created by scale(1.1) so the image edge
        // never slips inside the overflow-hidden frame.
        const max = el.offsetHeight * 0.05;
        const offset = Math.max(-max, Math.min(max, (center - viewCenter) * speed));
        el.style.setProperty("--py", `${offset}px`);
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);

  return (
    <div ref={ref} className={`overflow-hidden parallax-img ${className}`}>
      {children}
    </div>
  );
}
