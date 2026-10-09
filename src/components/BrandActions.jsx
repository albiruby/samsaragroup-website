import { ctaLabel, safeUrl } from "@/lib/site";

/**
 * Kinds hidden from the action row everywhere.
 *
 * `career` is dropped because the site has a dedicated /career page, so a
 * repeated button adds nothing.
 */
const HIDDEN_KINDS = new Set(["career"]);

function InstagramIcon() {
  return (
    <svg
      width="16"
      height="16"
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
}

/**
 * Merges a brand's CMS `ctas` with the per-page hardcoded fallbacks.
 *
 * The CMS wins per kind: a cta present in Sanity keeps its own URL and label.
 * A fallback only fills a kind the CMS did not supply, and it also backfills a
 * label the CMS left blank, so a page that shipped "OPEN IN MAPS" keeps that
 * wording when an editor has replaced only the URL.
 *
 * `instagramUrl` is a separate document field, not a cta, so it is appended as
 * its own entry -- but only when the CMS did not already provide an `instagram`
 * cta, which would otherwise render the button twice.
 */
function resolveActions(world, fallbacks = []) {
  const merged = [];

  for (const c of world?.ctas || []) {
    if (!c || !safeUrl(c.url)) continue;
    merged.push({ kind: c.kind, url: c.url, label: c.label, key: c._key || c.kind });
  }

  for (const f of fallbacks) {
    if (!f) continue;
    const existing = merged.find((c) => c.kind === f.kind);
    if (existing) {
      if (!existing.label?.trim() && f.label) existing.label = f.label;
      continue;
    }
    if (!safeUrl(f.url)) continue;
    merged.push({ kind: f.kind, url: f.url, label: f.label, key: `fallback-${f.kind}` });
  }

  const hasInstagram = merged.some((c) => c.kind === "instagram");
  const instagram =
    safeUrl(world?.instagramUrl) || safeUrl(fallbacks.find((f) => f.kind === "instagram")?.url);
  if (!hasInstagram && instagram) {
    merged.push({ kind: "instagram", url: instagram, key: "instagram" });
  }

  return merged.filter((c) => !HIDDEN_KINDS.has(c.kind));
}

/**
 * A brand's action buttons: every cta in a single wrapped row, outline style.
 *
 * Renders nothing when a brand has no ctas, so Outpace, Grove, or a brand
 * created tomorrow shows no empty row until an editor fills the CMS.
 */
export default function BrandActions({ world, fallbacks }) {
  const ctas = resolveActions(world, fallbacks);
  if (!ctas.length) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {ctas.map((c) => (
        <a
          key={c.key}
          href={c.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 rounded-md border border-on-surface px-8 py-4 text-label-caps-sm uppercase tracking-widest text-on-surface transition-colors hover:bg-on-surface hover:text-surface"
        >
          {c.kind === "instagram" ? <InstagramIcon /> : null}
          {ctaLabel(c)}
        </a>
      ))}
    </div>
  );
}