"use client";

import { useEffect, useRef } from "react";

export default function ScrollMarquee({ children, className = "", baseSpeed = 50, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.style.animation = "none";

    let offset = 0;
    let half = el.scrollWidth / 2;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let vel = 0;

    const ro = new ResizeObserver(() => {
      half = el.scrollWidth / 2;
    });
    ro.observe(el);

    let rafId;
    const tick = (now) => {
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;

      const y = window.scrollY;
      const inst = dt > 0 ? (y - lastY) / dt : 0;
      lastY = y;
      vel += (inst - vel) * Math.min(dt * 4, 1);

      const boost = Math.max(-baseSpeed * 1.6, Math.min(vel * 0.12, baseSpeed * 3));
      if (!el.matches(":hover")) offset += (baseSpeed + boost) * dt;
      if (half > 0) offset = ((offset % half) + half) % half;

      el.style.transform = `translate3d(${-offset}px, 0, 0)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      el.style.animation = "";
      el.style.transform = "";
    };
  }, [baseSpeed]);

  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
}
