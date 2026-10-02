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

const APPLY_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfQUzrgPkm-u9dDYTFzgoWrS-W3R2rslWyAFVo18abRDsFneg/viewform?usp=sf_link";

/**
 * Placeholder openings. Departments and tone follow what the brand docs describe —
 * Samsara as Acoustics/Dining/Retreat, Svarga as Hospitality/Stillness/Nature,
 * Acasa as Movement/Athletics/Community — so the filters and copy already match the
 * business before an editor swaps in the real listings.
 */
const JOBS = [
  {
    title: "Barista",
    department: "Barista",
    brand: "samsara",
    location: "Bogor",
    employmentType: "full-time",
    summary: "We're looking for a barista to join our team at Samsara.",
    description:
      "Samsara is a listening space, a dining room and a retreat in one. As barista you are part of that daily rhythm: pulling shots, shaping the flavour of a signature coffee, and greeting guests who come to stay as long as they like. You will work closely with the kitchen and the floor team so every cup lands in the right moment.",
    requirements: [
      "1+ year of barista experience, or a genuine interest in coffee",
      "Comfortable with milk textures and manual brew",
      "Clear and warm communication with guests",
    ],
    order: 1,
  },
  {
    title: "Kitchen Crew",
    department: "Kitchen",
    brand: "samsara",
    location: "Bogor",
    employmentType: "full-time",
    summary: "We're looking for kitchen crew to join our Samsara kitchen.",
    description:
      "Our kitchen folds Indo-Kolonial flavours into a menu that sits beside a vinyl library and a live music programme. As kitchen crew you prepare mise en place, cook to spec, and keep the line clean and calm during service. We cook with whole ingredients and we expect care in the small things.",
    requirements: [
      "Able to work on a busy line during service",
      "Basic knowledge of food hygiene and handling",
      "Team player, comfortable taking direction",
    ],
    order: 2,
  },
  {
    title: "Guest Experience Host",
    department: "Guest Experience",
    brand: "svarga",
    location: "Sukabumi",
    employmentType: "full-time",
    summary: "We're looking for a host to welcome guests at Svarga.",
    description:
      "Svarga sits on the highlands of Sukabumi: a pendopo, prasmanan, and an open skydeck where meals take a long time on purpose. As host you set the tone from the moment a guest arrives — seating, explaining the shared dishes, and reading the room so nobody is rushed and nobody is overlooked.",
    requirements: [
      "2+ years in hospitality, restaurant or hotel front of house",
      "Comfortable speaking with guests in Bahasa Indonesia",
      "Patient, attentive, and calm under pressure",
    ],
    order: 3,
  },
  {
    title: "Sous Chef",
    department: "Kitchen",
    brand: "svarga",
    location: "Sukabumi",
    employmentType: "full-time",
    summary: "We're looking for a sous chef to lead our Javanese kitchen.",
    description:
      "Svarga's food is Javanese heritage cooked with wholeheartedness — sate merah, ayam gerabah, mangut lele, wedangan. As sous chef you own station prep, guide the line, and keep recipes consistent across a full service while the skydeck fills up behind you.",
    requirements: [
      "5+ years in a professional kitchen, at least 2 as sous chef",
      "Strong grasp of Indonesian and Javanese cuisine",
      "Experience training and mentoring junior cooks",
    ],
    order: 4,
  },
  {
    title: "Operations Supervisor",
    department: "Operations",
    brand: "group",
    location: "Bogor",
    employmentType: "full-time",
    summary: "We're looking for an operations supervisor across our brands.",
    description:
      "Five places run on the same promise: careful hands, good memory, and a room that feels considered. As operations supervisor you move between brands checking readiness, opening and closing, and keeping standards identical whether a guest walks into Samsara or Svarga.",
    requirements: [
      "4+ years in operations, hospitality or multi-site management",
      "Comfortable with scheduling and inventory control",
      "Willing to travel between Bogor and Sukabumi",
    ],
    order: 5,
  },
  {
    title: "Events Crew",
    department: "Events",
    brand: "samsara",
    location: "Bogor",
    employmentType: "part-time",
    summary: "We're looking for event crew for live music at Samsara.",
    description:
      "Samsara hosts live music and listening sessions through the year. As event crew you help set the room, run the door and bar support, and look after performers as our own guests. It is evening and weekend work with a small, dependable team.",
    requirements: [
      "Available on weekends and selected evenings",
      "Comfortable working in a fast-moving live setting",
      "Reliable and on time for scheduled shifts",
    ],
    order: 6,
  },
];

const mode = process.argv[2] ?? "--write";
const DRY = mode === "--dry";

const existing = await client.fetch(`*[_type == "career"][].slug.current`);
console.log(`lowongan existing: ${existing.length ? existing.join(", ") : "(tidak ada)"}`);

if (mode === "clear") {
  const ids = await client.fetch(`*[_type == "career"][]._id`);
  for (const id of ids) await client.delete(id);
  console.log(`dihapus: ${ids.length}`);
  process.exit(0);
}

for (const [i, job] of JOBS.entries()) {
  if (existing.includes(job.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"))) {
    console.log(`LEWAT  ${job.title}`);
    continue;
  }
  if (DRY) {
    console.log(`DRY    ${job.title} (${job.department})`);
    continue;
  }
  const { _id } = await client.create({
    _type: "career",
    title: job.title,
    slug: { _type: "slug", current: job.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
    department: job.department,
    brand: job.brand,
    location: job.location,
    employmentType: job.employmentType,
    summary: job.summary,
    description: job.description,
    requirements: job.requirements.map((text, j) => ({
      _type: "requirement",
      _key: `r${i}-${j}`,
      text,
    })),
    applyUrl: APPLY_URL,
    status: "active",
    order: job.order,
    postedAt: new Date().toISOString(),
  });
  console.log(`dibuat ${job.title.padEnd(24)} ${_id}`);
}

const all = await client.fetch(
  `*[_type == "career"] | order(order asc) { title, department, location, employmentType, status }`
);
console.log("\nverifikasi:");
console.table(all);