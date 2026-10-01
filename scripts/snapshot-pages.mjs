/**
 * Captures a layout fingerprint for every brand page so we can prove the
 * rendering is byte-identical before and after a CMS integration change.
 *
 *   node scripts/snapshot-pages.mjs before
 *   node scripts/snapshot-pages.mjs after
 */
import { mkdir, writeFile, readFile } from "node:fs/promises";

const LABEL = process.argv[2] || "snap";
const OUT = new URL(`../.snapshots/${LABEL}.json`, import.meta.url);
const BASE = process.env.BASE_URL || "http://localhost:3000";

const ROUTES = [
  "/", "/brands", "/samsara", "/svarga", "/acasa", "/outpace", "/grove",
  "/about", "/events", "/contact",
];

/** Strips anything expected to drift: nonces, hashes, build ids, cache busters. */
function normalise(html) {
  return html
    .replace(/nonce="[^"]*"/g, 'nonce="X"')
    .replace(/\\"nonce\\":\\"[^\\]*\\"/g, '\\"nonce\\":\\"X\\"')
    .replace(/"buildId":"[^"]*"/g, '"buildId":"X"')
    // React flight payload id changes on every request, regardless of code.
    .replace(/self\.__next_r="[^"]*"/g, 'self.__next_r="X"')
    .replace(/[?&]v=[a-f0-9]{8,}/g, "?v=X")
    .replace(/_next\/static\/[A-Za-z0-9_-]+\//g, "_next/static/HASH/")
    .replace(/\d{4}-\d{2}-\d{2}T[\d:.+Z-]+/g, "DATE")
    .replace(/\s+/g, " ")
    .trim();
}

const snap = {};

for (const route of ROUTES) {
  const res = await fetch(BASE + route);
  const html = await res.text();
  const clean = normalise(html);

  // Structural facts we care about, independent of markup churn.
  const facts = {
    status: res.status,
    length: clean.length,
    h1: (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1]?.replace(/<[^>]+>/g, "").trim() || null,
    h2: [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => m[1].replace(/<[^>]+>/g, "").trim()),
    imgCount: (html.match(/<img /g) || []).length,
    sectionCount: (html.match(/<section/g) || []).length,
    headingCount: (html.match(/<h[1-3][ >]/g) || []).length,
    classes: (html.match(/class="[^"]{20,}"/g) || []).sort(),
  };

  snap[route] = { facts, hash: await sha(clean) };
  console.log(
    `${route.padEnd(11)} ${res.status}  len=${String(clean.length).padStart(6)}  h1=${facts.h1 ?? "-"}  h2=${facts.h2.length}  img=${facts.imgCount}`
  );
}

async function sha(s) {
  const { createHash } = await import("node:crypto");
  return createHash("sha256").update(s).digest("hex").slice(0, 16);
}

await mkdir(new URL("../.snapshots/", import.meta.url), { recursive: true });
await writeFile(OUT, JSON.stringify(snap, null, 2));
console.log(`\nwritten: .snapshots/${LABEL}.json`);

// If a baseline exists, diff against it.
try {
  const before = JSON.parse(await readFile(new URL("../.snapshots/before.json", import.meta.url), "utf8"));
  if (LABEL !== "before") {
    console.log("\n=== DIFF vs before ===");
    let changed = 0;
    for (const route of ROUTES) {
      const b = before[route];
      const a = snap[route];
      if (!b) continue;
      const diffs = Object.keys(a.facts).filter((k) => JSON.stringify(a.facts[k]) !== JSON.stringify(b.facts[k]));
      if (a.hash === b.hash) {
        console.log(`  ${route.padEnd(11)} IDENTICAL`);
      } else {
        changed++;
        console.log(`  ${route.padEnd(11)} CHANGED  [${diffs.join(", ")}]`);
        for (const k of diffs) {
          console.log(`      ${k}:`);
          console.log(`        before: ${JSON.stringify(b.facts[k]).slice(0, 200)}`);
          console.log(`        after : ${JSON.stringify(a.facts[k]).slice(0, 200)}`);
        }
      }
    }
    console.log(`\n${changed}/${ROUTES.length} routes changed`);
  }
} catch {
  console.log("(no baseline to compare yet)");
}