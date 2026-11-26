#!/usr/bin/env node
/**
 * One-off migration: move the old `sections[]` content onto the explicit
 * top-level fields that the brand page now reads.
 *
 * Default is a dry run. Pass --apply to write. The `sections` array is kept
 * until --drop-sections is passed, so the previous website build keeps working
 * while the new one is verified.
 *
 * Usage:
 *   SANITY_AUTH_TOKEN=... node scripts/migrate-world-sections.mjs --dataset=staging
 *   SANITY_AUTH_TOKEN=... node scripts/migrate-world-sections.mjs --dataset=staging --apply
 *   SANITY_AUTH_TOKEN=... node scripts/migrate-world-sections.mjs --dataset=production --drop-sections --apply
 */
import { createClient } from "@sanity/client";

const flag = (name) => process.argv.includes(`--${name}`);
const value = (name, fallback) => {
  const hit = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

const dataset = value("dataset", "staging");
const apply = flag("apply");
const dropSections = flag("drop-sections");
const projectId = process.env.SANITY_PROJECT_ID || "p5zu5azj";
const token = process.env.SANITY_AUTH_TOKEN;

if (!token) {
  console.error("SANITY_AUTH_TOKEN is required (write token).");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-10-01",
  token,
  useCdn: false,
});

const LOCAL_BUSINESS = {
  samsara: "Restaurant",
  svarga: "Restaurant",
  acasa: "Resort",
  outpace: "none",
  grove: "none",
};

const has = (value) => Array.isArray(value) && value.length > 0;

function plan(doc) {
  const sections = Array.isArray(doc.sections) ? doc.sections : [];
  const of = (type) => sections.find((section) => section?.type === type);
  const text = of("text");
  const specs = of("specs");
  const features = of("features");
  const menu = of("menu");
  const map = of("map");

  const set = {};
  if (!doc.description?.trim() && text?.body?.trim()) set.description = text.body;
  if (!doc.specsHeading?.trim() && specs?.heading?.trim()) set.specsHeading = specs.heading;
  if (!has(doc.specifications) && has(specs?.specifications)) set.specifications = specs.specifications;
  if (!doc.featuresHeading?.trim() && features?.heading?.trim()) set.featuresHeading = features.heading;
  if (!has(doc.features) && has(features?.features)) set.features = features.features;
  if (!doc.menuHeading?.trim() && menu?.heading?.trim()) set.menuHeading = menu.heading;
  if (!has(doc.menuPanels) && has(menu?.menuPanels)) set.menuPanels = menu.menuPanels;
  if (!doc.mapHeading?.trim() && map?.heading?.trim()) set.mapHeading = map.heading;
  if (typeof doc.mapLat !== "number" && typeof map?.mapLat === "number") set.mapLat = map.mapLat;
  if (typeof doc.mapLng !== "number" && typeof map?.mapLng === "number") set.mapLng = map.mapLng;
  if (typeof doc.mapZoom !== "number" && typeof map?.mapZoom === "number") set.mapZoom = map.mapZoom;
  const slug = typeof doc.slug === "string" ? doc.slug : doc.slug?.current;
  if (!doc.localBusinessType) set.localBusinessType = LOCAL_BUSINESS[slug] || "none";

  return { set, sections };
}

function unresolvedSections(doc) {
  const sections = Array.isArray(doc.sections) ? doc.sections : [];
  const missing = [];
  for (const section of sections) {
    if (section?.type === "text" && !doc.description?.trim()) missing.push("text -> description");
    if (section?.type === "specs" && !has(doc.specifications)) missing.push("specs -> specifications");
    if (section?.type === "features" && !has(doc.features)) missing.push("features -> features");
    if (section?.type === "menu" && !has(doc.menuPanels)) missing.push("menu -> menuPanels");
    if (section?.type === "map" && (typeof doc.mapLat !== "number" || typeof doc.mapLng !== "number")) {
      missing.push("map -> mapLat/mapLng");
    }
  }
  return missing;
}

const docs = await client.fetch(`*[_type == "world"] | order(order asc) {
  _id, name, "slug": slug.current, description,
  specsHeading, specifications, featuresHeading, features,
  menuHeading, menuPanels, mapHeading, mapLat, mapLng, mapZoom,
  localBusinessType, sections
}`);

console.log(`dataset=${dataset} worlds=${docs.length} apply=${apply} dropSections=${dropSections}`);

if (dropSections) {
  const blocked = [];
  const patches = [];
  for (const doc of docs) {
    const missing = unresolvedSections(doc);
    if (missing.length) blocked.push(`${doc.slug || doc._id}: ${missing.join(", ")}`);
    else if (Array.isArray(doc.sections)) patches.push({ patch: { id: doc._id, unset: ["sections"] } });
  }
  for (const doc of docs) {
    console.log(`- ${doc.slug || doc._id}: ${Array.isArray(doc.sections) ? "sections present" : "no sections"}`);
  }
  if (blocked.length) {
    console.error("Refusing to drop sections; these documents are not fully migrated:");
    for (const line of blocked) console.error(`  ${line}`);
    process.exit(1);
  }
  if (!apply) {
    console.log(`dry run: would unset sections on ${patches.length} document(s)`);
  } else if (patches.length) {
    await client.mutate(patches);
    console.log(`unset sections on ${patches.length} document(s)`);
  }
  process.exit(0);
}

const patches = [];
for (const doc of docs) {
  const { set } = plan(doc);
  const keys = Object.keys(set);
  if (!keys.length) {
    console.log(`- ${doc.slug || doc._id}: nothing to migrate`);
    continue;
  }
  console.log(`- ${doc.slug || doc._id}: ${keys.map((key) => `${key}${Array.isArray(set[key]) ? `[${set[key].length}]` : ""}`).join(", ")}`);
  patches.push({ patch: { id: doc._id, set } });
}

if (!apply) {
  console.log(`dry run: would patch ${patches.length} document(s). Add --apply to write.`);
  process.exit(0);
}

if (patches.length) {
  await client.mutate(patches);
  console.log(`patched ${patches.length} document(s); sections kept for rollback.`);
} else {
  console.log("nothing to patch.");
}
