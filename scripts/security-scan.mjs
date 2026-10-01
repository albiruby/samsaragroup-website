import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const ROOT = process.cwd();

async function walk(dir, out = []) {
  for (const e of await readdir(join(ROOT, dir), { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next" || e.name === ".git" || e.name === ".snapshots") continue;
    const rel = join(dir, e.name);
    if (e.isDirectory()) await walk(rel, out);
    else if (/\.(js|ts|tsx|mjs)$/.test(e.name)) out.push(rel);
  }
  return out;
}

const files = await walk("src");
const problems = [];
const notes = [];

// 1. Hardcoded secrets
const SECRET = /(api[_-]?key|secret|password|passwd|bearer\s+[A-Za-z0-9._-]{20,}|sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16})/i;
for (const f of files) {
  const src = await readFile(join(ROOT, f), "utf8");
  src.split("\n").forEach((line, i) => {
    if (line.trim().startsWith("//") || line.trim().startsWith("*")) return;
    if (SECRET.test(line) && !/process\.env/.test(line)) {
      problems.push(`secret-like  ${f}:${i + 1}  ${line.trim().slice(0, 70)}`);
    }
  });
}

// 2. target=_blank without noopener
for (const f of files) {
  const src = await readFile(join(ROOT, f), "utf8");
  const re = /<a\b[^>]*>/g;
  for (const m of src.matchAll(re)) {
    const tag = m[0];
    if (/target="_blank"/.test(tag) && !/rel="[^"]*noopener/.test(tag)) {
      problems.push(`blank-noopener ${f}  ${tag.slice(0, 80)}`);
    }
  }
}

// 3. dangerouslySetInnerHTML outside the jsonLd helper
for (const f of files) {
  const src = await readFile(join(ROOT, f), "utf8");
  if (!/dangerouslySetInnerHTML/.test(src)) continue;
  const uses = [...src.matchAll(/dangerouslySetInnerHTML=\{\{[\s\S]{0,200}?\}\}/g)];
  for (const u of uses) {
    if (!/jsonLdHtml/.test(u[0])) {
      problems.push(`raw-innerHTML ${f}  ${u[0].slice(0, 70)}`);
    }
  }
}

// 4. Unused oversized assets
notes.push("--- oversized assets in public/ (not auto-removed) ---");
async function scanAssets(dir) {
  for (const e of await readdir(join(ROOT, dir), { withFileTypes: true })) {
    const rel = join(dir, e.name);
    if (e.isDirectory()) { await scanAssets(rel); continue; }
    const s = await stat(join(ROOT, rel));
    if (s.size > 2_000_000) notes.push(`  ${(s.size / 1048576).toFixed(1)} MB  ${rel}`);
  }
}
await scanAssets("public");

console.log("=== PROBLEMS ===");
if (problems.length === 0) console.log("  none");
else for (const p of problems) console.log("  " + p);

console.log("\n=== NOTES ===");
for (const n of notes) console.log(n);