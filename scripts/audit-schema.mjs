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

const schemaSrc = await readFile(
  "../studio-sams-sams/schemaTypes/world.ts",
  "utf8"
);

// Every field name declared anywhere in the schema file.
const schemaFields = new Set(
  [...schemaSrc.matchAll(/name: "([a-zA-Z_][a-zA-Z0-9_]*)"/g)].map((m) => m[1])
);
// _type values used by array members.
const schemaTypes = new Set(
  [...schemaSrc.matchAll(/_type: "([a-zA-Z_][a-zA-Z0-9_]*)"/g)].map((m) => m[1])
);
// Titles are not field names; add known data-only keys Sanity stores itself.
// Sanity-managed metadata that no schema ever declares.
const IMPLICIT = new Set([
  "_key",
  "_type",
  "_id",
  "_rev",
  "_createdAt",
  "_updatedAt",
  "asset",
  "_ref",
  "current",
]);

const docs = await client.fetch(`*[_type == "world"]`);

const problems = [];

for (const doc of docs) {
  const slug = doc.slug?.current;
  const walk = (value, path) => {
    if (Array.isArray(value)) {
      value.forEach((v, i) => walk(v, `${path}[${i}]`));
      return;
    }
    if (!value || typeof value !== "object") return;
    for (const [k, v] of Object.entries(value)) {
      if (IMPLICIT.has(k)) {
        walk(v, `${path}.${k}`);
        continue;
      }
      if (!schemaFields.has(k)) {
        problems.push(`${slug}  ${path}.${k}`);
      }
      walk(v, `${path}.${k}`);
    }
  };
  walk(doc, "");
}

console.log(`documents checked : ${docs.length}`);
console.log(`schema fields     : ${schemaFields.size}`);
console.log(`schema _types     : ${[...schemaTypes].join(", ")}`);
console.log("");
if (problems.length === 0) {
  console.log("OK  no unknown fields in dataset");
} else {
  console.log(`UNKNOWN (${problems.length}):`);
  for (const p of problems) console.log("  " + p);
}