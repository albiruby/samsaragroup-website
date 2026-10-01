/**
 * Extracts the hardcoded copy from each brand page source and writes it into
 * Sanity, so switching the pages to read from the CMS is byte-identical.
 *
 *   node scripts/sync-sections-extract.mjs
 *
 * Nothing here is hand-transcribed: values are parsed out of the page files.
 */
import { readFile } from "node:fs/promises";
import { createClient } from "@sanity/client";

const env = Object.fromEntries(
  (await readFile(".env.local", "utf8"))
    .split(/\r?\n/)
    .filter((l) => l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: env.SANITY_API_TOKEN,
  useCdn: false,
});

const decodeEntities = (s) =>
  s
    .replace(/&mdash;/g, "\u2014")
    .replace(/&ndash;/g, "\u2013")
    .replace(/&middot;/g, "\u00B7")
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&lsquo;/g, "\u2018")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));

/** Decodes JS string escapes. `unescape()` is unreliable for \uXXXX here. */
const decodeJsString = (s) =>
  s
    .replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");

/** Pulls the row literals out of `const specs = <expr> || [ ... ];`. */
function extractSpecs(src) {
  const decl = src.match(/const (?:specs|offerings) =/);
  if (!decl) throw new Error("specs declaration not found");
  const after = src.slice(decl.index);

  // The literal block ends at the first line that is exactly "  ];".
  const end = after.match(/\n  \];/);
  if (!end) throw new Error("specs array terminator not found");
  const block = after.slice(0, end.index);

  const rows = [
    ...block.matchAll(/\[\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*\]/g),
  ];
  if (!rows.length) throw new Error("no rows parsed");
  return rows.map((r) => [decodeEntities(decodeJsString(r[1])), decodeEntities(decodeJsString(r[2]))]);
}

/** The `world?.description || "..."` fallback literal. */
function extractDescription(src) {
  const m = src.match(/world\?\.description\s*\|\|\s*"((?:[^"\\]|\\.)*)"/);
  if (!m) return null;
  return decodeEntities(decodeJsString(m[1]));
}

/** The first vision <p> body, for pages with no description fallback. */
function extractVisionP(src) {
  const m = src.match(
    /<p className="text-body-md text-on-surface-variant leading-relaxed">\s*([\s\S]*?)\s*<\/p>/
  );
  if (!m) return null;
  return decodeEntities(m[1]).replace(/\s+/g, " ").trim();
}

const PAGES = [
  { slug: "samsara", file: "src/app/samsara/page.js" },
  { slug: "svarga", file: "src/app/svarga/page.js" },
  { slug: "acasa", file: "src/app/acasa/page.js" },
  { slug: "outpace", file: "src/app/outpace/page.js" },
  { slug: "grove", file: "src/app/grove/page.js" },
];

const specRows = (pairs) =>
  pairs.map(([label, value], i) => ({ _key: `sp${i + 1}`, _type: "object", label, value }));

for (const page of PAGES) {
  const src = await readFile(page.file, "utf8");

  const specs = extractSpecs(src);
  const vision = extractDescription(src) ?? extractVisionP(src);
  if (!vision) throw new Error(`${page.slug}: vision text not found`);

  const id = `world-${page.slug}`;
  const doc = await client.fetch(`*[_id == $id][0]{ "sections": sections[]{...} }`, { id });
  if (!doc) throw new Error(`${page.slug}: document not found`);

  const sections = (doc.sections || []).map((s) => ({ ...s }));
  const text = sections.find((s) => s.type === "text");
  const specsSection = sections.find((s) => s.type === "specs");
  if (!text || !specsSection) throw new Error(`${page.slug}: missing text/specs section`);

  text.body = vision;
  specsSection.specifications = specRows(specs);

  await client.patch(id).set({ sections }).commit();

  console.log(
    `${page.slug.padEnd(9)} vision=${String(vision.length).padStart(4)}ch  specs=${specs.length}  emdash=${vision.includes("\u2014")}`
  );
}

console.log("\ndone");