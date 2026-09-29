import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-5vw">
      <div className="text-center">
        <span className="block text-[10rem] md:text-[14rem] font-display leading-none text-primary/10 select-none">
          404
        </span>
        <h1 className="mt-4 text-headline-md md:text-headline-lg font-display uppercase leading-tight text-on-surface">
          LOST IN THE ARCHIPELAGO
        </h1>
        <p className="mt-4 max-w-md mx-auto text-body-md text-on-surface-variant leading-relaxed">
          The page you seek does not exist here. Perhaps it has drifted to another shore.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-primary px-10 py-4 text-label-caps-sm uppercase tracking-widest text-on-primary transition-colors hover:bg-primary-container"
          >
            RETURN HOME
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 6h10M7 2l4 4-4 4" />
            </svg>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-primary px-10 py-4 text-label-caps-sm uppercase tracking-widest text-on-primary transition-colors hover:bg-primary-container"
          >
            CONTACT CONCIERGE
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 6h10M7 2l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
