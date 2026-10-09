"use client";

import { useMemo, useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { safeUrl } from "@/lib/site";

const TYPE_LABELS = {
  "full-time": "Full Time",
  "part-time": "Part Time",
  contract: "Contract",
  internship: "Internship",
};

/**
 * Preferred order for the filter row. Anything else an editor types in the CMS
 * still gets a chip — this only decides where the known departments sit.
 */
const DEPARTMENT_ORDER = [
  "Kitchen",
  "Barista",
  "Front of House",
  "Guest Experience",
  "Events",
  "Operations",
  "Marketing",
];

const BRAND_LABELS = {
  samsara: "Samsara",
  svarga: "Svarga",
  acasa: "Acasa",
  outpace: "Outpace",
  grove: "Grove",
  group: "Samsara Group",
};

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

/**
 * Renders the CMS `date` field (YYYY-MM-DD) without touching Date or Intl. This list
 * is a client component that also renders on the server, so a locale or timezone aware
 * format could disagree between the two passes and break hydration.
 */
function formatPostedAt(value) {
  if (typeof value !== "string") return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (!match) return null;
  const monthIndex = Number(match[2]) - 1;
  if (monthIndex < 0 || monthIndex > 11) return null;
  return `${Number(match[3])} ${MONTHS[monthIndex]} ${match[1]}`;
}

export default function CareerList({
  jobs,
  applyUrl: groupApplyUrl,
  unavailable,
  emptyMessage,
  applyNote,
  defaultPostedAt,
}) {
  const [filter, setFilter] = useState("all");

  const departments = useMemo(() => {
    const present = new Set(jobs.map((j) => j.department).filter(Boolean));
    const known = DEPARTMENT_ORDER.filter((department) => present.has(department));
    const extra = [...present]
      .filter((department) => !DEPARTMENT_ORDER.includes(department))
      .sort((a, b) => a.localeCompare(b));
    return [
      { label: "View all", value: "all" },
      ...[...known, ...extra].map((department) => ({ label: department, value: department })),
    ];
  }, [jobs]);

  const visible = filter === "all" ? jobs : jobs.filter((j) => j.department === filter);

  return (
    <>
      {departments.length > 1 ? (
        <div className="flex flex-wrap gap-2 pb-8" role="group" aria-label="Filter lowongan per departemen">
          {departments.map((f) => {
            const active = filter === f.value;
            const count =
              f.value === "all"
                ? jobs.length
                : jobs.filter((j) => j.department === f.value).length;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                aria-pressed={active}
                className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-5 text-label-caps-sm uppercase tracking-widest transition-colors ${
                  active
                    ? "border-primary bg-primary text-on-primary"
                    : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-on-surface"
                }`}
              >
                {f.label}
                <span className={active ? "text-on-primary/70" : "text-on-surface-variant/70"}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      {unavailable ? (
        <p className="border border-outline-variant p-6 text-body-md text-on-surface-variant">
          Daftar lowongan sedang tidak dapat dimuat. Silakan hubungi kami langsung untuk informasi
          posisi yang terbuka.
        </p>
      ) : null}

      {!unavailable && visible.length === 0 && emptyMessage ? (
        <p className="border border-outline-variant p-6 text-body-md text-on-surface-variant">
          {emptyMessage}
        </p>
      ) : null}

      <div className="flex flex-col">
        {visible.map((job) => {
          const href = safeUrl(job.applyUrl) || safeUrl(groupApplyUrl);
          const postedLabel = formatPostedAt(job.postedAt || defaultPostedAt);
          return (
            <article
              key={job._id}
              className="border-t border-outline-variant py-8 last:border-b"
            >
              <ScrollReveal>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      {job.isUrgent ? (
                        <span className="border border-terracotta px-3 py-1 text-label-caps-sm uppercase tracking-widest text-terracotta">
                          Urgent
                        </span>
                      ) : null}
                      {job.department ? (
                        <span className="text-label-caps-sm uppercase tracking-widest text-on-surface-variant">
                          {job.department}
                        </span>
                      ) : null}
                    </div>

                    <h3 className="font-display text-title-lg uppercase text-on-surface">
                      {job.title}
                    </h3>

                    {job.summary ? (
                      <p className="mt-2 max-w-2xl text-body-md text-on-surface-variant leading-relaxed">
                        {job.summary}
                      </p>
                    ) : null}

                    {job.description ? (
                      <p className="mt-3 max-w-2xl text-body-sm text-on-surface-variant leading-relaxed">
                        {job.description}
                      </p>
                    ) : null}

                    {job.requirements?.length ? (
                      <ul className="mt-4 space-y-1">
                        {job.requirements.map((r, i) => (
                          <li
                            key={r._key || i}
                            className="text-body-sm text-on-surface-variant leading-relaxed"
                          >
                            {r.text}
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.employmentType ? (
                        <span className="inline-flex items-center rounded-full border border-outline-variant px-4 py-1.5 text-label-caps-sm uppercase tracking-widest text-on-surface-variant">
                          {TYPE_LABELS[job.employmentType] || job.employmentType}
                        </span>
                      ) : null}
                      {job.location ? (
                        <span className="inline-flex items-center rounded-full border border-outline-variant px-4 py-1.5 text-label-caps-sm uppercase tracking-widest text-on-surface-variant">
                          {job.location}
                        </span>
                      ) : null}
                      {job.brand ? (
                        <span className="inline-flex items-center rounded-full border border-outline-variant px-4 py-1.5 text-label-caps-sm uppercase tracking-widest text-on-surface-variant">
                          {BRAND_LABELS[job.brand] || job.brand}
                        </span>
                      ) : null}
                      {postedLabel ? (
                        <span className="inline-flex items-center gap-2 rounded-full border border-outline-variant px-4 py-1.5 text-label-caps-sm uppercase tracking-widest text-on-surface-variant">
                          Posted
                          <time dateTime={job.postedAt || defaultPostedAt}>{postedLabel}</time>
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center gap-2 self-start py-3.5 font-label text-label-sm uppercase tracking-widest text-on-surface transition-colors hover:text-terracotta sm:self-center"
                    >
                      Apply
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 7h8M7 3l4 4-4 4" />
                      </svg>
                    </a>
                  ) : null}
                </div>
              </ScrollReveal>
            </article>
          );
        })}
      </div>

      {applyNote ? (
        <p className="pt-10 text-body-sm text-on-surface-variant">{applyNote}</p>
      ) : null}
    </>
  );
}