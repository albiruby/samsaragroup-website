"use client";

import { useRef } from "react";

export default function MagneticButton({ children, className = "", strength = 0.3, href, as, ...rest }) {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  };

  const Tag = href ? "a" : as || "button";
  const extraProps = href
    ? { href, ...rest }
    : as
      ? rest
      : { type: "button", ...rest };

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`}
      {...extraProps}
    >
      {children}
    </Tag>
  );
}
