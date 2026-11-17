/**
 * Returns the CMS string when it has content, otherwise the fallback.
 *
 * Every page keeps a hardcoded fallback so a CMS outage never leaves a gap.
 * Keeping the rule in one place stops the two call sites from drifting.
 */
export function pick(value, fallback) {
  return typeof value === "string" && value.trim() ? value : fallback;
}
