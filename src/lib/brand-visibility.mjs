/**
 * Publication gate for a brand document, shared by the page body and its metadata.
 *
 * F-01 (security audit run 3): the body treated a document without `status` as
 * hidden while the metadata gate treated it as visible, so a page that returned
 * 404 still emitted title, description, canonical and og:image. One predicate now
 * drives both call sites, so they cannot drift apart again.
 *
 * A missing document (CMS unreachable) is NOT hidden: the page keeps serving its
 * fallback copy with normal metadata instead of going blank.
 */
export function isBrandHidden(world) {
  if (!world) return false;
  return world.status !== "active" || world.featured === false;
}
