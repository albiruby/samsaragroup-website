#!/usr/bin/env node
/**
 * Internal link checker for the production build.
 *
 * Starts from the public routes, collects every same-origin href, then requests
 * each unique path once. External links, mailto/tel and bare #anchors are left
 * alone: they belong to other services and would make CI flaky.
 *
 * Usage:
 *   npm run check:links
 *   SMOKE_BASE_URL=https://samsaragroup.vercel.app npm run check:links
 */

const BASE = (process.env.SMOKE_BASE_URL || process.env.BASE_URL || "http://localhost:3000").replace(/\/+$/, "");
const ORIGIN = new URL(BASE).origin;

const ROUTES = [
  "/",
  "/about",
  "/brands",
  "/career",
  "/events",
  "/contact",
  "/samsara",
  "/svarga",
  "/acasa",
  "/grove",
  "/outpace",
];

const timeout = () => AbortSignal.timeout(15000);

async function get(path) {
  const res = await fetch(BASE + path, { redirect: "follow", signal: timeout() });
  return { status: res.status, ok: res.ok, body: res.ok ? await res.text() : "" };
}

const failures = [];
const seen = new Map();

for (const route of ROUTES) {
  let page;
  try {
    page = await get(route);
  } catch (error) {
    failures.push(`${route} -> request failed (${error.message})`);
    continue;
  }
  if (!page.ok) {
    failures.push(`${route} -> HTTP ${page.status}`);
    continue;
  }

  for (const match of page.body.matchAll(/href="([^"]*)"/g)) {
    const raw = match[1].replace(/&amp;/g, "&").trim();
    if (!raw || raw.startsWith("#") || /^(mailto|tel|javascript):/i.test(raw)) continue;

    let url;
    try {
      url = new URL(raw, BASE + route);
    } catch {
      failures.push(`${route} -> invalid href "${raw}"`);
      continue;
    }
    if (url.origin !== ORIGIN) continue;

    url.hash = "";
    const path = url.pathname + url.search;
    if (!seen.has(path)) seen.set(path, new Set());
    seen.get(path).add(route);
  }
}

for (const [path, sources] of seen) {
  try {
    const res = await fetch(BASE + path, { redirect: "follow", signal: timeout() });
    if (!res.ok) failures.push(`${path} -> HTTP ${res.status} (linked from ${[...sources].join(", ")})`);
  } catch (error) {
    failures.push(`${path} -> request failed (${error.message}) (linked from ${[...sources].join(", ")})`);
  }
}

if (failures.length) {
  console.error(`Link check failed: ${failures.length} problem(s)`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

console.log(`Link check passed: ${ROUTES.length} routes, ${seen.size} unique internal links.`);
