import { safeUrl } from "@/lib/site";

export default function InstagramLink({ href, external = true, full = false, className = "" }) {
  const icon = (
    <svg
      width={full ? 16 : 18}
      height={full ? 16 : 18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );

  const safe = safeUrl(href) || "https://www.instagram.com/";

  return (
    <a
      href={safe}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label="Instagram"
      data-cursor="VIEW"
      className={`inline-flex items-center justify-center bg-primary text-on-primary transition-colors hover:bg-primary-container ${
        full
          ? "w-full gap-3 px-8 py-4 text-label-caps-sm uppercase tracking-widest"
          : "w-12 h-12"
      } ${className}`}
    >
      {icon}
      {full && "INSTAGRAM"}
    </a>
  );
}
