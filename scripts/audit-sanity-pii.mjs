#!/usr/bin/env node
/**
 * Guardrail for the public Sanity dataset.
 *
 * The dataset is public-read by design, so the only thing that keeps bulk reads
 * harmless is that no personal data ever lands in it. This script checks the
 * published documents without a token, prints counts only (never values), and
 * exits non-zero when a forbidden document type or field appears.
 *
 * Usage:
 *   npm run audit:pii
 *
 * If the dataset is ever made private, this script needs a read-only token in
 * SANITY_READ_TOKEN and must keep the token server-side.
 */

const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "p5zu5azj";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const API = `https://${PROJECT}.api.sanity.io/v2024-01-01/data/query/${DATASET}`;

const FORBIDDEN_TYPES = [
  "jobApplication",
  "application",
  "careerApplication",
  "applicant",
  "submission",
  "ktp",
  "identityCard",
  "cv",
  "resume",
];

const FORBIDDEN_FIELDS = [
  "ktp",
  "nik",
  "passport",
  "identityNumber",
  "dateOfBirth",
  "birthDate",
  "cv",
  "resume",
  "bankAccount",
];

const query = `{
  "types": array::unique(*[]._type),
  "forbiddenTypes": count(*[_type in ${JSON.stringify(FORBIDDEN_TYPES)}]),
  "forbiddenFields": count(*[${FORBIDDEN_FIELDS.map((field) => `defined(${field})`).join(" || ")}]),
  "content": {
    "worlds": count(*[_type == "world"]),
    "events": count(*[_type == "event"]),
    "careers": count(*[_type == "career"]),
    "pages": count(*[_type in ["homePage", "aboutPage", "eventsPage", "careerPage", "contactInfo", "brandNav"]])
  }
}`;

const headers = { Accept: "application/json" };
if (process.env.SANITY_READ_TOKEN) {
  headers.Authorization = `Bearer ${process.env.SANITY_READ_TOKEN}`;
}

const res = await fetch(`${API}?query=${encodeURIComponent(query)}`, { headers });
if (!res.ok) {
  console.error(`Sanity query failed: HTTP ${res.status}`);
  process.exit(1);
}

const json = await res.json();
const result = json.result;
if (!result) {
  console.error("Sanity query returned no result.");
  process.exit(1);
}

console.log(`Dataset: ${PROJECT}/${DATASET}`);
console.log(`Types: ${(result.types || []).join(", ")}`);
console.log(`Content: ${JSON.stringify(result.content)}`);

const badTypes = Number(result.forbiddenTypes) || 0;
const badFields = Number(result.forbiddenFields) || 0;

if (badTypes > 0 || badFields > 0) {
  console.error(
    `PII guard failed: ${badTypes} forbidden document(s), ${badFields} document(s) with forbidden fields.`,
  );
  process.exit(1);
}

console.log("PII guard passed: no forbidden document types or fields.");
