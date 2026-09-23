export const inactiveBrands = ["/svvara"];
export const isActive = (href) => !inactiveBrands.includes(href);

const samsara = { label: "Samsara", speciality: "Culinary & Hearth", href: "/samsara", logo: "/Black Logo Samsara/blackfullsamping.png" };
const acasa = { label: "Acasa", speciality: "Contemporary Hospitality & Padel", href: "/acasa", logo: "/assetacasa/logoacasahitam.webp" };
const svarga = { label: "Svarga", speciality: "Highland Sanctuary & Slow Living", href: "/svarga", logo: "/assetsvarga/Svarga logo black.webp" };
const svvara = { label: "Svvara", speciality: "Acoustic Craft & Object", href: "/svvara", logo: "/assetsvvara/logosvvarablack.webp" };
const outpace = { label: "Outpace", speciality: "Athletic Performance & Movement", href: "/outpace", logo: null };
const grove = { label: "Grove", speciality: "Botanical & Apothecary", href: "/grove", logo: null };

const rawCategories = [
  { name: "ICONIC", brands: [samsara, acasa] },
  { name: "SPECIALITY", brands: [svarga, outpace, svvara] },
  { name: "EVERYDAY", brands: [samsara, grove] },
  { name: "WELLBEING", brands: [acasa, svarga] },
];

export const brandCategories = rawCategories
  .map((cat) => ({ ...cat, brands: cat.brands.filter((b) => isActive(b.href)) }))
  .filter((cat) => cat.brands.length > 0);

export const allBrands = [samsara, svvara, svarga, acasa, outpace, grove].filter((b) => isActive(b.href));
