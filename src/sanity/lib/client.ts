import { createClient } from "@sanity/client";

// Server components only. Never import this from a "use client" file, and never
// add a Sanity API token here: it would ship to the browser.
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-09-19",
  useCdn: true,
});
