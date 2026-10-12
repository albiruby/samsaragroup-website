/**
 * Opening hours for a brand, entered in the CMS as short groupings
 * (Weekdays, Weekend, ...). Renders nothing when the brand has no hours, so the
 * block never shows an empty heading, and it takes a className so a caller can
 * add spacing only when something is actually rendered.
 */
export default function BrandHours({ hours, className = "" }) {
  const rows = (hours || []).filter((h) => h?.label && h?.value);
  if (!rows.length) return null;

  return (
    <div className={className}>
      {rows.map((h) => (
        <p key={h._key || h.label} className="text-body-sm text-on-surface-variant">
          {h.label}: {h.value}
        </p>
      ))}
    </div>
  );
}