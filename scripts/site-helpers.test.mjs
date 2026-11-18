import test from "node:test";
import assert from "node:assert/strict";
import { isSafeSlug, safeUrl, siteUrl, ogImages, SITE_URL } from "../src/lib/site.js";
import { jsonLdHtml } from "../src/lib/jsonld.js";

/**
 * Brand slugs come from the CMS and end up in paths, canonicals and the sitemap.
 * Anything that is not a plain lowercase kebab segment must be refused, or an
 * editor (or a compromised CMS account) could point a canonical off-site.
 */
test("isSafeSlug accepts plain kebab-case segments", () => {
  for (const slug of ["samsara", "acasa", "grove-2", "acasa-padel-club"]) {
    assert.equal(isSafeSlug(slug), true, slug);
  }
});

test("isSafeSlug rejects traversal, authority and malformed values", () => {
  const bad = [
    "", "../etc", "//evil.com", "a/b", "Samsara", "-lead", "trail-", "dou--ble",
    "with space", "%2e%2e", "https:", null, undefined, 42, {},
  ];
  for (const slug of bad) assert.equal(isSafeSlug(slug), false, String(slug));
});

test("safeUrl only lets http and https through", () => {
  assert.equal(safeUrl("https://wa.me/62"), "https://wa.me/62");
  assert.equal(safeUrl("http://example.com/x"), "http://example.com/x");
  const bad = [
    "javascript:alert(1)", "JavaScript:alert(1)", "data:text/html,<b>x</b>",
    "vbscript:x", "//evil.com", "/relative", "", "   ", null, undefined, 1,
  ];
  for (const url of bad) assert.equal(safeUrl(url), null, String(url));
});

test("siteUrl joins paths onto the site origin and leaves absolute URLs alone", () => {
  assert.equal(siteUrl(), SITE_URL);
  assert.equal(siteUrl("/about"), `${SITE_URL}/about`);
  assert.equal(siteUrl("about"), `${SITE_URL}/about`);
  assert.equal(siteUrl("https://cdn.sanity.io/x.jpg"), "https://cdn.sanity.io/x.jpg");
  assert.ok(!SITE_URL.endsWith("/"), "SITE_URL has no trailing slash");
});

test("ogImages falls back to the default for unsafe or WebP images", () => {
  const fallback = siteUrl("/og-default.png");
  assert.equal(ogImages()[0].url, fallback);
  assert.equal(ogImages("javascript:alert(1)")[0].url, fallback);
  assert.equal(ogImages("https://cdn.sanity.io/a.webp")[0].url, fallback);
  // Sanity keeps .webp in the path but serves JPEG when fm=jpg is requested.
  const jpeg = "https://cdn.sanity.io/a.webp?w=1200&fm=jpg";
  assert.equal(ogImages(jpeg)[0].url, jpeg);
});

/**
 * JSON-LD is written into a <script> tag with dangerouslySetInnerHTML. A CMS
 * string containing "</script>" must not be able to close that tag.
 */
test("jsonLdHtml cannot break out of its script tag", () => {
  const value = { name: "</script><script>alert(1)</script>", sep: "a b c" };
  const html = jsonLdHtml(value);
  assert.ok(!html.includes("<"), "no raw <");
  assert.ok(!html.includes(">"), "no raw >");
  assert.ok(!html.includes(" ") && !html.includes(" "), "no raw line separators");
  assert.deepEqual(JSON.parse(html), value, "still valid JSON with the same data");
});
