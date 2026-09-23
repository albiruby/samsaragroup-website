"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const mobileLinks = [
  { label: "HOME", href: "/" },
  { label: "BRANDS", href: "/about" },
  { label: "EVENTS", href: "/events" },
  { label: "CONTACT", href: "/contact" },
];

const worldsSubLinks = [
  { label: "Samsara", href: "/samsara" },
  { label: "Svvara", href: "/svvara" },
  { label: "Svarga", href: "/svarga" },
  { label: "Acasa", href: "/acasa" },
  { label: "Outpace", href: "/outpace" },
  { label: "Grove", href: "/grove" },
];

export default function MobileMenu({ isOpen, onClose }) {
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

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

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
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
        onClick={onClose}
        className="absolute top-4 right-4 p-3 text-white/60 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center z-10"
        aria-label="Close menu"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 6l12 12M6 18L18 6" />
        </svg>
      </button>

      <div className="w-full h-full flex flex-col items-center justify-center overflow-y-auto px-6 py-20">
        <nav className="flex flex-col items-center gap-4">
          {mobileLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={onClose}
              className="text-white text-[13px] tracking-[0.22em] font-medium uppercase hover:text-terracotta transition-colors min-h-[44px] flex items-center"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col items-center gap-3 mt-4 pt-4 border-t border-white/10 w-full">
            <span className="text-white/50 text-[11px] tracking-[0.25em] uppercase">
              WORLDS
            </span>
            {worldsSubLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={onClose}
                className="text-white/70 text-[12px] tracking-[0.2em] uppercase hover:text-terracotta transition-colors min-h-[44px] flex items-center"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <p className="absolute bottom-8 left-0 right-0 text-center text-white/30 text-[10px] tracking-[0.3em] uppercase pb-[env(safe-area-inset-bottom)]">
        SAMSARA GROUP – NUSANTARA ARCHIPELAGO
      </p>
    </div>
  );
}
