/**
 * Per-brand configuration for the five established brand pages.
 *
 * Everything that can come from Sanity does. The values here are the floor: they
 * keep a brand page readable when a field is still empty or when the CMS cannot be
 * reached at all. They are not the source of truth, so changing copy should happen
 * in the Studio, not in this file.
 */
export const BRAND_PAGES = {
  samsara: {
    slug: "samsara",
    name: "Samsara",
    seoTitle: "Samsara — Samsara Group",
    seoDescription:
      "Bogor's first listening space. A symphony of melody and taste — where vinyl spins, Indo-Kolonial flavors unfold, and every frequency is designed.",
    tagline: "Sound. Food. Culture. A sanctuary where every frequency is designed.",
    intro:
      "Housed in a preserved Dutch-colonial building beside the Bogor Botanical Gardens, Samsara is where culinary flavors and musical melodies come together in effortless harmony. Explore our library of vinyl, play a record yourself, and let the room do the rest — an experience we call Extra Sensory Perception, crafted for the palate and the soul.",
    specsHeading: "AT A GLANCE",
    specs: [
      ["Concept", "Extra Sensory Perception — sound, taste, sight"],
      ["Listening Space", "Bogor's first — vinyl library, play your own records"],
      ["Cuisine", "Indo-Kolonial — Nasi Campur Madura, Bitterballen, Poffertjes"],
      ["Coffee", "Signature with Mikael Jasin, World Barista Champion 2024"],
      ["Heritage", "Dutch-colonial building, 1,400 m², beside Kebun Raya Bogor"],
      ["Live Music", "Melodi Samsara — presented by Melodi Alam"],
    ],
    logo: "/ASSETS-SAMSARA/logo/blackfullsamping.png",
    image: "/ASSETS-SAMSARA/ambience/DSC08177.webp",
    gallery: [
      "/ASSETS-SAMSARA/ambience/DSC08187.webp",
      "/ASSETS-SAMSARA/ambience/DSC08177.webp",
      "/ASSETS-SAMSARA/ambience/DSC08930.webp",
      "/ASSETS-SAMSARA/ambience/DSC08926.webp",
    ],
    coords: { lat: -6.5938597, lng: 106.8035144 },
    address: "Jl. Jalak Harupat No.19, Babakan, Bogor Tengah, Kota Bogor, Jawa Barat 16129",
    whatsapp: "+62 852-8127-1988",
    actions: [
      { kind: "reservation", label: "RESERVATION", url: "https://wa.me/6285281271988" },
      { kind: "instagram", url: "https://www.instagram.com/samsara.bogor" },
    ],
  },

  svarga: {
    slug: "svarga",
    name: "Svarga",
    seoTitle: "Svarga — Samsara Group",
    seoDescription:
      "Cerita rasa sudah dimulai. Svarga terbuka untukmu. Javanese heritage restaurant di Nagrak, Sukabumi.",
    tagline: "Cerita rasa sudah dimulai. Rasa, alam, dan tradisi berpadu jadi satu.",
    intro:
      "Svarga was born from a simple desire: to create a space to return to — to honest flavors, to traditions that are cared for, to togetherness that is never rushed. Set amid the cool highlands of Sukabumi, every dish is prepared with wholeheartedness, wrapping the warmth of spices, the familiarity of a long table, and stories that grow between bites. Welcome to Svarga.",
    specsHeading: "GOOD TO KNOW",
    specs: [
      ["Concept", "Pendopo Javanese — prasmanan otentik, heritage dining"],
      ["Signature Dishes", "Sate Merah, Ayam Gerabah, Mangut Lele, Wedangan"],
      ["Skydeck", "Open-air deck with panoramic highland views"],
      ["Location", "Nagrak, Sukabumi — cool mountain air, 10 min from Cibadak"],
      ["Occasion", "Family gatherings, weddings, celebrations"],
      ["Reservations", "WhatsApp 0813-2148-132"],
    ],
    logo: "/ASSETS-SVARGA/Svarga logo black.webp",
    image: "/ASSETS-SVARGA/ADR (9 of 15).webp",
    gallery: [
      "/ASSETS-SVARGA/ADR (3 of 15).webp",
      "/ASSETS-SVARGA/ADR (4 of 4).webp",
      "/ASSETS-SVARGA/ADR (2 of 4).webp",
      "/ASSETS-SVARGA/ADR (3 of 4).webp",
    ],
    coords: { lat: -6.85, lng: 106.9333 },
    address: "Jl. Raya Nagrak, Cisarua, Sukabumi, Jawa Barat",
    whatsapp: "0813-2148-132",
    actions: [
      {
        kind: "reservation",
        label: "RESERVE",
        url: "https://api.whatsapp.com/send/?phone=628132148132&type=phone_number&app_absent=0",
      },
      { kind: "instagram", url: "https://www.instagram.com/svarga.samsara" },
    ],
  },

  acasa: {
    slug: "acasa",
    name: "Acasa",
    seoTitle: "Acasa — Samsara Group",
    seoDescription:
      "A Sanctuary of Refined Living. Resto, Cottages, and Padel — one place, many moments, in the hills of Ciawi, Bogor.",
    tagline: "A Sanctuary of Refined Living — Resto, Cottages, Padel.",
    intro:
      "Where architecture holds stories, where every table gathers laughter, where mornings begin softly and evenings glow with warmth. From quiet stays to meaningful celebrations, every detail is thoughtfully crafted — from comfortable cottages and refreshing pool days to padel games and family meals at the restaurant. Welcome to Acasa.",
    specsHeading: "OFFERINGS",
    specs: [
      ["Cottages", "20 rooms — pool, WiFi, 24hr reception, smart TV"],
      ["Acasa Padel", "2 courts — Rp200,000/session, hot shower, locker rooms"],
      ["Restaurant", "Rp25k–95k — Weekdays 09–23, Weekend 08–23"],
      ["Event Space", "Ballroom & garden — from intimate gatherings to grand celebrations"],
      ["Location", "Ciawi, Bogor — 5 min from Vimala Hills, 6 min from Kuntum Farmfield"],
      ["Rating", "Google Hotels 4.9 (169 reviews) · tiket.com 5.0"],
    ],
    logo: "/ASSETS-ACASA/logoacasahitam.webp",
    image: "/ASSETS-ACASA/ADR-06539.webp",
    gallery: [
      "/ASSETS-ACASA/ADR-06545.webp",
      "/ASSETS-ACASA/ADR-06529.webp",
      "/ASSETS-ACASA/ADR-06507.webp",
      "/ASSETS-ACASA/ADR-06480.webp",
    ],
    coords: { lat: -6.6167, lng: 106.85 },
    address: "Jl. Raya Pertanian, Bendungan, Kec. Ciawi, Kab. Bogor, Jawa Barat 16720",
    whatsapp: "0811-8888-7828",
    actions: [
      { kind: "padel", label: "RESERVE PADEL", url: "https://ayo.co.id/v/acasa-padel" },
      {
        kind: "receptionist",
        label: "RECEPTIONIST",
        url: "https://api.whatsapp.com/send/?phone=6281188887828&type=phone_number&app_absent=0",
      },
      {
        kind: "roomrate",
        label: "ROOM RATE",
        url: "https://drive.google.com/drive/folders/1pqOn9pi5vwqoGfx_6SWjTt8TE_1H4ASi",
      },
      { kind: "instagram", url: "https://www.instagram.com/acasa.samsara" },
    ],
  },

  outpace: {
    slug: "outpace",
    name: "Outpace",
    seoTitle: "Outpace — Samsara Group",
    seoDescription:
      "Outpace is a running cafe in Bogor — coffee, showers and a community of runners. Gear up, cool down, and stay awhile.",
    tagline: "The Runners Club",
    intro:
      "Run first, coffee after. Outpace is a pit stop for runners — fresh showers, strong coffee, and a community that moves. Whether you're training for a marathon or just starting your first kilometer, this is where the run ends and the conversation begins.",
    specsHeading: "SPECIFICATIONS",
    specs: [
      ["Concept", "Cafe for runners"],
      ["Facilities", "Shower · Coffee · Lockers"],
      ["Community", "Morning runs, group sessions"],
    ],
    logo: null,
    image: "/ASSETS-SAMSARA/ambience/DSC09014.webp",
    gallery: [
      "/ASSETS-SAMSARA/ambience/DSC09014.webp",
      "/ASSETS-SAMSARA/ambience/DSC09052.webp",
      "/ASSETS-SAMSARA/ambience/DSC09056.webp",
      "/ASSETS-SAMSARA/ambience/DSC09072.webp",
    ],
    coords: { lat: -6.6002733, lng: 106.7950613 },
    address: null,
    whatsapp: null,
    actions: [],
    /** No menu yet: the page shows a placeholder instead of an empty gap. */
    menuPlaceholder: true,
  },

  grove: {
    slug: "grove",
    name: "Grove",
    seoTitle: "Grove — Samsara Group",
    seoDescription:
      "Grove is the lighter cafe at Samsara Bogor — a relaxed courtyard for good coffee, easy conversation, and everyday dining.",
    tagline: "The City Backyard",
    intro:
      "Less formal, more feeling. Grove is the casual counterpart to Samsara — same soul, lighter touch. A cafe where you come as you are, stay as long as you want, and leave a little lighter than you arrived.",
    specsHeading: "SPECIFICATIONS",
    specs: [
      ["Concept", "Lighter cafe than Samsara"],
      ["Vibe", "Casual · Relaxed · Everyday"],
      ["Menu", "Coffee, bites, light meals"],
    ],
    logo: null,
    image: "/ASSETS-SAMSARA/ambience/DSC09048.webp",
    gallery: [
      "/ASSETS-SAMSARA/ambience/DSC09048.webp",
      "/ASSETS-SAMSARA/ambience/DSC09058.webp",
      "/ASSETS-SAMSARA/ambience/DSC08482.webp",
      "/ASSETS-SAMSARA/ambience/DSC08494.webp",
    ],
    coords: { lat: -6.574193, lng: 106.8014814 },
    address: null,
    whatsapp: null,
    actions: [],
    menuPlaceholder: true,
  },
};

export function brandConfig(slug) {
  return BRAND_PAGES[String(slug || "").toLowerCase()] || null;
}
