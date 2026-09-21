"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
  { label: "ALL", href: "/" },
  { label: "MUSIC", href: "/music" },
  { label: "DINING", href: "/dining" },
  { label: "HOSPITALITY", href: "/hospitality" },
  { label: "DESIGN", href: "/design" },
  { label: "LIFESTYLE", href: "/lifestyle" },
  { label: "COMMUNITY", href: "/community" },
];

export default function HorizontalFilterBar() {
  const pathname = usePathname();
  const scrollRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  if (!isHome) return null;

  return (
    <div
      className={`fixed top-16 lg:top-20 left-0 w-full z-[90] bg-surface border-b border-outline-variant transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <div className="max-w-[1520px] mx-auto px-6 lg:px-10">
        <div
          ref={scrollRef}
          className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-none"
        >
          {categories.map((cat) => {
            const isActive = pathname === cat.href;
            return (
              <Link
                key={cat.label}
                href={cat.href}
                className={`flex-shrink-0 font-label text-[11px] tracking-[0.18em] uppercase px-5 py-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
