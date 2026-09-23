import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant">
      <div className="w-full px-6 lg:px-10 pt-16 pb-12 border-b border-outline-variant">
        <h2 className="font-display text-headline-lg lg:text-display-lg text-on-surface tracking-tight uppercase">
          PLACES. EXPERIENCES. STORIES.
        </h2>
      </div>

      <div className="w-full px-6 lg:px-10 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-outline-variant">
        <div className="space-y-4">
          <p className="font-label text-label-uppercase text-secondary tracking-[0.14em] uppercase">CONTACT</p>
          <ul className="space-y-3">
            <li><Link href="/contact" className="font-body text-body-md text-on-surface hover:text-secondary transition-colors">General Inquiry</Link></li>
            <li><Link href="/events" className="font-body text-body-md text-on-surface hover:text-secondary transition-colors">Events</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <p className="font-label text-label-uppercase text-secondary tracking-[0.14em] uppercase">EXPLORE</p>
          <ul className="space-y-3">
            <li><Link href="/about" className="font-body text-body-md text-on-surface hover:text-secondary transition-colors">About</Link></li>
            <li><Link href="/menu" className="font-body text-body-md text-on-surface hover:text-secondary transition-colors">Menu</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <p className="font-label text-label-uppercase text-secondary tracking-[0.14em] uppercase">BRANDS</p>
          <ul className="space-y-3">
            <li><Link href="/samsara" className="font-body text-body-md text-on-surface hover:text-secondary transition-colors">Samsara</Link></li>
            <li><Link href="/svvara" className="font-body text-body-md text-on-surface hover:text-secondary transition-colors">Svvara</Link></li>
            <li><Link href="/svarga" className="font-body text-body-md text-on-surface hover:text-secondary transition-colors">Svarga</Link></li>
            <li><Link href="/acasa" className="font-body text-body-md text-on-surface hover:text-secondary transition-colors">Acasa</Link></li>
            <li><Link href="/outpace" className="font-body text-body-md text-on-surface hover:text-secondary transition-colors">Outpace</Link></li>
            <li><Link href="/grove" className="font-body text-body-md text-on-surface hover:text-secondary transition-colors">Grove</Link></li>
          </ul>
        </div>
      </div>

      <div className="w-full px-6 lg:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-label text-label-sm text-on-surface-variant tracking-wide">
          &copy; {new Date().getFullYear()} SAMSARA GROUP. ALL RIGHTS RESERVED.
        </p>
        <p className="font-label text-label-sm text-on-surface-variant tracking-[0.18em] uppercase">
          NUSANTARA ARCHIPELAGO
        </p>
      </div>
    </footer>
  );
}
