"use client";

import { useState } from "react";
import { urlFor } from "@/sanity/lib/image";

export default function ProductCarousel({ products }) {
  const [current, setCurrent] = useState(0);

  if (!products || products.length === 0) {
    return (
      <div>
        <h2 className="mb-8 text-headline-sm font-display uppercase tracking-wide text-on-surface">CURRENT COLLECTION</h2>
        <div className="border border-outline-variant bg-surface-container-low p-8 text-center">
          <p className="text-body-sm text-on-surface-variant">No product available</p>
        </div>
      </div>
    );
  }

  const prev = () => setCurrent((i) => (i === 0 ? products.length - 1 : i - 1));
  const next = () => setCurrent((i) => (i === products.length - 1 ? 0 : i + 1));
  const product = products[current];

  return (
    <div>
      <h2 className="mb-8 text-headline-sm font-display uppercase tracking-wide text-on-surface">CURRENT COLLECTION</h2>
      <div className="border border-outline-variant bg-surface-container-low transition-colors hover:border-outline overflow-hidden">
        {product.image && (
          <div className="w-full aspect-[16/9] overflow-hidden">
            <img src={urlFor(product.image).url()} alt={product.name} className="h-full w-full object-cover" />
          </div>
        )}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3">
            <h3 className="text-title-lg font-medium uppercase tracking-wide text-on-surface min-w-0 break-words">{product.name}</h3>
            {product.price && <span className="shrink-0 text-body-sm text-terracotta">{product.price}</span>}
          </div>
          <p className="text-body-sm text-on-surface-variant">{product.description}</p>
        </div>
      </div>

      {products.length > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <button onClick={prev} className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors" aria-label="Previous product">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 2L4 7l5 5" /></svg>
          </button>
          <p className="text-body-sm text-on-surface-variant/60 italic">Slide to see products</p>
          <button onClick={next} className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors" aria-label="Next product">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 2l5 5-5 5" /></svg>
          </button>
        </div>
      )}

      {products.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {products.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-on-surface" : "bg-outline-variant"}`} aria-label={`Go to product ${i + 1}`} />
          ))}
        </div>
      )}
    </div>
  );
}
