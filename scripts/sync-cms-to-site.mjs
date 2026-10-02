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

/**
 * Values copied verbatim from the hand-tuned brand pages. Sanity has to agree with
 * what the site already renders before the pages are switched over to read it,
 * otherwise wiring the fields would change the visible address, links and captions.
 */
const BRANDS = {
  samsara: {
    address: "Jl. Jalak Harupat No.19, Babakan, Bogor Tengah, Kota Bogor, Jawa Barat 16129",
    instagramUrl: "https://www.instagram.com/samsara.bogor",
    heroEyebrow: "WORLDS",
    ctas: [
      { kind: "reservation", label: "RESERVATION", url: "https://wa.me/6285281271988" },
      {
        kind: "menu",
        label: "MENU",
        url: "https://drive.google.com/file/d/1inaLAAXyjMp9XQFk59lVd5VZtc0d75ST/view",
      },
      { kind: "location", label: "LOCATION", url: "https://maps.app.goo.gl/GbVqgzQfVfmGQkep7" },
      {
        kind: "career",
        label: "CAREER",
        url: "https://docs.google.com/forms/d/e/1FAIpQLSfQUzrgPkm-u9dDYTFzgoWrS-W3R2rslWyAFVo18abRDsFneg/viewform?usp=sf_link",
      },
    ],
    map: { mapLat: -6.5938597, mapLng: 106.8035144, mapZoom: 16 },
  },
  svarga: {
    address: "Jl. Raya Nagrak, Cisarua, Sukabumi, Jawa Barat",
    instagramUrl: "https://www.instagram.com/svarga.samsara",
    heroEyebrow: "WORLDS",
    ctas: [
      { kind: "location", label: "OPEN IN MAPS", url: "https://maps.app.goo.gl/rn8Mfgk7NXJG79Xp8" },
      { kind: "links", label: "LINKS", url: "https://linktr.ee/svargabysamsara" },
      {
        kind: "reservation",
        label: "RESERVE",
        url: "https://api.whatsapp.com/send/?phone=628132148132&type=phone_number&app_absent=0",
      },
    ],
    map: { mapLat: -6.85, mapLng: 106.9333, mapZoom: 16 },
  },
  acasa: {
    address: "Jl. Raya Pertanian, Bendungan, Kec. Ciawi, Kab. Bogor, Jawa Barat 16720",
    instagramUrl: "https://www.instagram.com/acasa.samsara",
    heroEyebrow: "WORLDS",
    ctas: [
      { kind: "location", label: "LOCATION", url: "https://maps.app.goo.gl/NNbBmPUrX9mTYNQBA" },
      { kind: "links", label: "LINKS", url: "https://linktr.ee/acasa.samsara" },
    ],
    map: { mapLat: -6.6167, mapLng: 106.85, mapZoom: 16 },
  },
};

/**
 * SEO copied from each page's current `metadata` export so switching the pages over
 * to read `seoTitle`/`seoDescription` from the CMS does not alter the served meta.
 */
const SEO = {
  samsara: {
    seoTitle: "Samsara - Samsara Group",
    seoDescription:
      "Bogor's first listening space. A symphony of melody and taste - where vinyl spins, Indo-Kolonial flavors unfold, and every frequency is designed.",
  },
  svarga: {
    seoTitle: "Svarga - Samsara Group",
    seoDescription:
      "Cerita rasa sudah dimulai. Svarga terbuka untukmu. Javanese heritage restaurant with pendopo, prasmanan, and skydeck in the highlands of Sukabumi.",
  },
  acasa: {
    seoTitle: "Acasa - Samsara Group",
    seoDescription:
      "A Sanctuary of Refined Living. Resto, Cottages, and Padel - one place, many moments, in the hills of Ciawi, Bogor.",
  },
  outpace: {
    seoTitle: "Outpace - Samsara Group",
    seoDescription: "A running cafe. Coffee, shower, and community for runners.",
  },
  grove: {
    seoTitle: "Grove - Samsara Group",
    seoDescription: "The lighter cafe. Casual, relaxed, and always good vibes.",
  },
};

const DRY = process.argv[2] === "--dry";

for (const [slug, seo] of Object.entries(SEO)) {
  const _id = await client.fetch(`*[_type == "world" && slug.current == $s][0]._id`, { s: slug });
  if (!_id) {
    console.log(`LEWAT  ${slug} — dokumen tidak ada`);
    continue;
  }
  await client.patch(_id).set({ seoTitle: seo.seoTitle, seoDescription: seo.seoDescription }).commit();
  console.log(`SEO    ${slug.padEnd(9)} title + description disinkronkan`);
}

const check = await client.fetch(
  `*[_type == "world"] | order(order asc) {
     "slug": slug.current,
     address,
     instagramUrl,
     seoTitle,
     seoDescription,
     "ctas": ctas[]{ kind, label },
     "map": sections[_type == "section" && type == "map"][0]{ mapLat, mapLng }
   }`
);
console.log("\nverifikasi:");
console.table(check);
