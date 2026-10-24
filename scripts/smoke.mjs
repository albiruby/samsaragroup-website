#!/usr/bin/env node
/**
 * Production smoke test.
 *
 * Deliberately checks more than HTTP 200. The uptime monitor already covers "is the
 * site up"; this covers the failures that still answer 200 -- a page that quietly
 * fell back to its hardcoded copy because the CMS wiring broke, a headline that lost
 * its canonical, a brand grid that stopped matching what Sanity holds.
 *
 * No dependencies: Node's own fetch and regexes, so it runs anywhere without an
 * install step and without a token (the dataset is public-read).
 *
 *   npm run smoke                              # against production
 *   SMOKE_BASE_URL=http://localhost:3000 npm run smoke
 *   SMOKE_PREVIEW=1 SMOKE_BASE_URL=... npm run smoke   # staging/preview
 *
 * Exits non-zero if any check fails.
 */

const BASE = (process.env.SMOKE_BASE_URL || "https://samsaragroup.vercel.app").replace(/\/$/, "");
const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "p5zu5azj";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const PREVIEW = process.env.SMOKE_PREVIEW === "1";

const ROUTES = [
  "/", "/about", "/brands", "/samsara", "/svarga", "/acasa", "/outpace", "/grove",
  "/career", "/events", "/contact",
];
const EXTRA = ["/robots.txt", "/sitemap.xml", "/icon.png"];

let lulus = 0;
let gagal = 0;

function hasil(ok, label, detail = "") {
  if (ok) { lulus++; console.log("   ok    " + label + (detail ? "  " + detail : "")); }
  else { gagal++; console.log("   GAGAL " + label + (detail ? "  " + detail : "")); }
}

async function ambil(path) {
  const r = await fetch(BASE + path, { redirect: "manual" });
  const body = await r.text();
  return { status: r.status, headers: r.headers, body };
}

async function sanity(query) {
  const url = `https://${PROJECT}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(query)}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Sanity ${r.status}`);
  const j = await r.json();
  if (j.error) throw new Error(JSON.stringify(j.error).slice(0, 120));
  return j.result;
}

// ---------------------------------------------------------------- pages

console.log("");
console.log("1. Routes and page structure");
const html = {};
for (const path of ROUTES) {
  let r;
  try { r = await ambil(path); }
  catch (e) { hasil(false, `GET ${path}`, String(e).slice(0, 60)); continue; }

  hasil(r.status === 200, `GET ${path}`, `HTTP ${r.status}`);
  if (r.status !== 200) continue;
  html[path] = r.body;

  const h1 = (r.body.match(/<h1[\s>]/g) || []).length;
  const title = (r.body.match(/<title[^>]*>([^<]*)<\/title>/) || [])[1] || "";
  const desc = (r.body.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "";
  const canonical = /<link rel="canonical"/.test(r.body);

  hasil(h1 === 1, `  ${path} punya tepat satu <h1>`, `ditemukan ${h1}`);
  hasil(title.trim().length > 3, `  ${path} punya <title>`);
  hasil(desc.trim().length > 20, `  ${path} punya meta description`);
  hasil(canonical, `  ${path} punya canonical`);
}

console.log("");
console.log("2. Auxiliary files");
for (const path of EXTRA) {
  try {
    const r = await ambil(path);
    hasil(r.status === 200, `GET ${path}`, `HTTP ${r.status}`);
    if (path === "/robots.txt") {
      if (PREVIEW) {
        hasil(/Disallow:\s*\//.test(r.body), "  robots.txt memblokir crawler (preview)");
        hasil(!/Sitemap:/i.test(r.body), "  robots.txt preview tanpa sitemap");
      } else {
        hasil(/Allow:\s*\//.test(r.body), "  robots.txt mengizinkan root");
        hasil(/Sitemap:/i.test(r.body), "  robots.txt menunjuk sitemap");
      }
    }
    if (path === "/sitemap.xml") {
      const urls = [...r.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
      // Six static pages plus every active, featured brand that is not noIndexed.
      // This keeps the check valid when a brand is hidden or added.
      let publicBrands = 1;
      try {
        publicBrands = await sanity(
          'count(*[_type=="world" && status=="active" && featured!=false && noIndex!=true])',
        );
      } catch {}
      const minUrls = 6 + publicBrands;
      hasil(
        urls.length >= minUrls,
        "  sitemap memuat semua halaman publik",
        `${urls.length} URL (min ${minUrls})`,
      );
      let rusak = 0;
      for (const u of urls) {
        const res = await fetch(u, { redirect: "manual" });
        if (res.status !== 200) { rusak++; console.log(`         sitemap: ${u} -> ${res.status}`); }
      }
      hasil(rusak === 0, "  setiap URL di sitemap membalas 200");
    }
  } catch (e) {
    hasil(false, `GET ${path}`, String(e).slice(0, 60));
  }
}

// ---------------------------------------------------------------- security headers

console.log("");
console.log("3. Security headers");
try {
  const r = await ambil("/");
  const perlu = {
    "content-security-policy": /nonce-|'strict-dynamic'/,
    "strict-transport-security": /max-age=\d{6,}/,
    "x-content-type-options": /nosniff/,
    "x-frame-options": /DENY/i,
    "referrer-policy": /.+/,
    "permissions-policy": /.+/,
  };
  for (const [nama, pola] of Object.entries(perlu)) {
    const nilai = r.headers.get(nama) || "";
    hasil(pola.test(nilai), `header ${nama}`);
  }
  if (PREVIEW) {
    const noindex = r.headers.get("x-robots-tag") || "";
    hasil(/noindex/i.test(noindex), "header x-robots-tag noindex (preview)", noindex);
  }
} catch (e) {
  hasil(false, "header keamanan", String(e).slice(0, 60));
}

// ---------------------------------------------------------------- CMS reachable + matches the pages

console.log("");
console.log("4. Sanity reachable, and the pages match what it holds");
let cms = null;
try {
  cms = {
    world: await sanity('count(*[_type=="world" && status=="active" && featured!=false])'),
    career: await sanity('count(*[_type=="career" && status=="active"])'),
    carousel: await sanity('count(*[_type=="carouselImage" && active!=false])'),
    singletons: await sanity('count(*[_id in ["homePage","brandNav","contactInfo","careerPage","eventsPage"]])'),
  };
  hasil(true, "dataset Sanity terjangkau");
  hasil(cms.world >= 1, "  ada brand publik di CMS", `${cms.world}`);
  hasil(cms.singletons === 5, "  kelima dokumen tunggal ada", `${cms.singletons}/5`);
} catch (e) {
  hasil(false, "Sanity tidak terjangkau", String(e).slice(0, 80));
}

if (cms && html["/"]) {
  const kartu = (html["/"].match(/<h3[\s>]/g) || []).length;
  hasil(kartu === cms.world, "  homepage: jumlah kartu brand = jumlah brand di CMS", `${kartu} kartu vs ${cms.world} brand`);
  // Count the attribute, not the bare class name: the inline stylesheet also
  // contains ".marquee-item", which would inflate a naive count.
  const marquee = (html["/"].match(/class="marquee-item"/g) || []).length;
  hasil(marquee === cms.carousel * 2, "  homepage: marquee = carousel di CMS x2 (salinan ganda)", `${marquee} elemen vs ${cms.carousel * 2}`);
}

if (cms && html["/career"]) {
  const lowongan = (html["/career"].match(/<article[\s>]/g) || []).length;
  hasil(lowongan === cms.career, "  /career: jumlah kartu = jumlah lowongan aktif", `${lowongan} kartu vs ${cms.career} lowongan`);
}

// ---------------------------------------------------------------- summary

console.log("");
console.log(`Selesai: ${lulus} ok, ${gagal} gagal`);
if (gagal > 0) {
  console.log("Ada yang gagal - jangan anggap situs ini sehat.");
  process.exit(1);
}
console.log("Semua pemeriksaan lolos.");
