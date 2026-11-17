"use client";

import { useEffect, useRef, useState } from "react";
import ScrollMarquee from "./ScrollMarquee";

/**
 * A row of brand marks that never runs out of content.
 *
 * The track loops by shifting exactly half its width, so one half has to be at
 * least as wide as the panel. With only a few brands it is narrower, which leaves
 * a blank stretch at the end of every pass. Each half therefore repeats the list
 * enough times to cover the panel; the count is measured, so it also holds on a
 * wide screen and as brands are added in the Studio.
 */
export default function BrandMarquee({
  brands,
  className = "logo-marquee-track",
  logoClassName = "h-6 md:h-8 w-auto object-contain",
  nameClassName = "font-display uppercase text-on-surface text-lg md:text-xl tracking-wide",
  baseSpeed = 50,
  ...props
}) {
  const wrapRef = useRef(null);
  const [repeats, setRepeats] = useState(1);
  const count = brands?.length || 0;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const measure = () => {
      const group = wrap.querySelector("[data-brand-group]");
      if (!group) return;
      const width = group.getBoundingClientRect().width;
      if (!width) return;
      setRepeats(Math.max(1, Math.ceil(wrap.clientWidth / width)));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [count]);

  if (!count) return null;

  const group = (hidden) => (
    <div className="logo-marquee-content" aria-hidden={hidden || undefined}>
      {Array.from({ length: repeats }, (_, copy) => (
        <div
          key={copy}
          data-brand-group={copy === 0 ? "" : undefined}
          className="logo-marquee-repeat"
          aria-hidden={copy > 0 || undefined}
        >
          {brands.map((brand) => (
            <div key={brand.slug} className="logo-marquee-item">
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={brand.label}
                  className={logoClassName}
                  loading="lazy"
                />
              ) : (
                <span className={nameClassName}>{brand.label}</span>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div ref={wrapRef}>
      <ScrollMarquee className={className} baseSpeed={baseSpeed} {...props}>
        {group(false)}
        {group(true)}
      </ScrollMarquee>
    </div>
  );
}
