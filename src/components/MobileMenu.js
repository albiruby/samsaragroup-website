"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { brandCategories } from "../data/brandCategories";

const mobileLinks = [
  { label: "HOME", href: "/" },
  { label: "EVENTS", href: "/events" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
];

export default function MobileMenu({ isOpen, onClose }) {
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [openCat, setOpenCat] = useState(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = "hidden";
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    setBrandsOpen(false);
    setOpenCat(null);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleTab = (e) => {
      if (e.key !== "Tab") return;
      const focusable = document.querySelectorAll(
        ".mobile-menu-overlay a, .mobile-menu-overlay button"
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  return (
    <div
      className={`mobile-menu-overlay ${isOpen ? "open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      <button
        ref={closeButtonRef}
        onClick={handleClose}
        className="absolute top-4 right-4 p-3 text-white/60 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center z-10"
        aria-label="Close menu"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 6l12 12M6 18L18 6" />
        </svg>
      </button>

      <div className="menu-scroll w-full h-full flex flex-col items-center justify-center overflow-y-auto px-6 py-20">
        <nav className="flex flex-col items-center gap-4">
          {mobileLinks.slice(0, 1).map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={handleClose}
              className="text-white text-[13px] tracking-[0.22em] font-medium uppercase hover:text-terracotta transition-colors min-h-[44px] flex items-center"
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={() => setBrandsOpen((o) => !o)}
            aria-expanded={brandsOpen}
            className="text-white text-[13px] tracking-[0.22em] font-medium uppercase hover:text-terracotta transition-colors min-h-[44px] flex items-center justify-center"
          >
            <span className="relative flex items-center">
              BRANDS
              <svg className={`absolute left-full top-1/2 -translate-y-1/2 ml-1.5 w-3 h-3 transition-transform duration-200 ${brandsOpen ? "rotate-180" : ""}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 4.5L6 7.5L9 4.5" />
              </svg>
            </span>
          </button>

          {brandsOpen && (
            <div className="w-full max-w-[420px] mx-auto border-t border-white/10 pt-4 mt-1 flex flex-col">
              {brandCategories.map((cat) => (
                <div key={cat.name} className="border-b border-white/5 last:border-b-0">
                  <button
                    onClick={() => setOpenCat((c) => (c === cat.name ? null : cat.name))}
                    aria-expanded={openCat === cat.name}
                    className={`w-full flex items-center justify-center py-3 text-[12px] tracking-[0.25em] uppercase transition-colors min-h-[44px] ${
                      openCat === cat.name ? "text-terracotta" : "text-white/70 hover:text-white"
                    }`}
                  >
                    <span className="relative flex items-center">
                      {cat.name}
                      <svg className={`absolute left-full top-1/2 -translate-y-1/2 ml-1.5 w-3 h-3 transition-transform duration-200 ${openCat === cat.name ? "rotate-180" : ""}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 4.5L6 7.5L9 4.5" />
                      </svg>
                    </span>
                  </button>
                  {openCat === cat.name && (
                    <div className="pb-2 flex flex-col">
                      {cat.brands.map((b) => (
                        <Link
                          key={b.href}
                          href={b.href}
                          onClick={handleClose}
                          className="flex items-center justify-center gap-3 py-3 min-h-[44px] text-white/80 hover:text-white transition-colors text-center"
                        >
                          {b.logo && (
                            <img src={b.logo} alt="" className="h-5 w-24 object-contain brightness-0 invert" />
                          )}
                          <span className="min-w-0">
                            <span className="block text-[12px] tracking-[0.2em] uppercase">{b.label}</span>
                            <span className="block text-[11px] italic text-white/50">{b.speciality}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                href="/brands"
                onClick={handleClose}
                className="mt-3 py-3 text-center text-[12px] tracking-[0.25em] uppercase text-white/70 hover:text-terracotta transition-colors min-h-[44px] flex items-center justify-center"
              >
                See All Brands →
              </Link>
            </div>
          )}

          {mobileLinks.slice(1).map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={handleClose}
              className="text-white text-[13px] tracking-[0.22em] font-medium uppercase hover:text-terracotta transition-colors min-h-[44px] flex items-center"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <p className="absolute bottom-8 left-0 right-0 text-center text-white/30 text-[10px] tracking-[0.3em] uppercase pb-[env(safe-area-inset-bottom)]">
        SAMSARA GROUP – NUSANTARA ARCHIPELAGO
      </p>
    </div>
  );
}
