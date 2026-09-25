const samsara = { label: "Samsara", speciality: "Culinary & Hearth", href: "/samsara", logo: "/Black Logo Samsara/blackfullsamping.png" };
const acasa = { label: "Acasa", speciality: "Contemporary Hospitality & Padel", href: "/acasa", logo: "/assetacasa/logoacasahitam.webp" };
const svarga = { label: "Svarga", speciality: "Highland Sanctuary & Slow Living", href: "/svarga", logo: "/assetsvarga/Svarga logo black.webp" };
const outpace = { label: "Outpace", speciality: "Athletic Performance & Movement", href: "/outpace", logo: null };
const grove = { label: "Grove", speciality: "Botanical & Apothecary", href: "/grove", logo: null };

const rawCategories = [
  { name: "ICONIC", brands: [samsara, acasa] },
  { name: "SPECIALITY", brands: [svarga, outpace] },
  { name: "EVERYDAY", brands: [samsara, grove] },
  { name: "WELLBEING", brands: [acasa, svarga] },
];

export const brandCategories = rawCategories.filter((cat) => cat.brands.length > 0);

export const allBrands = [samsara, svarga, acasa, outpace, grove];
