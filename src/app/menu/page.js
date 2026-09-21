"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MenuPage() {
  const [pdfError, setPdfError] = useState(false);

  return (
    <div>
      <Header />

      <section className="bg-surface pt-28 pb-8 max-w-[1520px] mx-auto px-6 lg:px-10">
        <h1 className="text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface">
          2026 SAMSARA MENU
        </h1>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        <div className="w-full border border-outline-variant bg-surface-container-low overflow-hidden" style={{ height: "calc(100vh - 200px)", minHeight: "600px" }}>
          {!pdfError ? (
            <object
              data="/2026-samsara-menu.pdf"
              type="application/pdf"
              className="w-full h-full"
              onError={() => setPdfError(true)}
            >
              <iframe
                src="/2026-samsara-menu.pdf"
                className="w-full h-full border-0"
                title="2026 Samsara Menu"
                onError={() => setPdfError(true)}
              />
            </object>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-on-surface-variant">
              <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <p className="text-body-md">PDF preview is not available in this browser.</p>
              <a
                href="/2026-samsara-menu.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border border-outline px-8 py-3 text-label-caps-sm uppercase tracking-widest text-on-surface transition-colors hover:bg-primary hover:text-surface"
              >
                OPEN PDF IN NEW TAB
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 6h10M7 2l4 4-4 4" />
                </svg>
              </a>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <a
            href="/2026-samsara-menu.pdf"
            download="2026-Samsara-Menu.pdf"
            className="inline-flex items-center gap-3 border border-outline px-8 py-3 text-label-caps-sm uppercase tracking-widest text-on-surface transition-colors hover:bg-primary hover:text-surface"
          >
            DOWNLOAD PDF
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 1v8M2.5 5.5L6 9l3.5-3.5M1 11h10" />
            </svg>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
