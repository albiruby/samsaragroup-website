import { createClient } from "@sanity/client";

// WARNING: This client is used in both server and client components.
// NEVER add a Sanity API token here — it would be exposed to every browser.
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-09-19",
  useCdn: true,
});
