"use client";

import Link from "next/link";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-5vw">
      <div className="text-center">
        <span className="block text-[10rem] md:text-[14rem] font-display leading-none text-primary/10 select-none">
          500
        </span>
        <h1 className="mt-4 text-headline-md md:text-headline-lg font-display uppercase leading-tight text-on-surface">
          SOMETHING WENT WRONG
        </h1>
        <p className="mt-4 max-w-md mx-auto text-body-md text-on-surface-variant leading-relaxed">
          An unexpected error has occurred. Please try again or return to safety.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-3 bg-primary px-10 py-4 text-label-caps-sm uppercase tracking-widest text-on-primary transition-colors hover:bg-primary-container"
          >
            TRY AGAIN
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-primary px-10 py-4 text-label-caps-sm uppercase tracking-widest text-on-primary transition-colors hover:bg-primary-container"
          >
            RETURN HOME
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 6h10M7 2l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
