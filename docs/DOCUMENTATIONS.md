# DOCUMENTATIONS.md — Samsara Group Website

Dokumentasi lengkap proyek website **Samsara Group**: arsitektur, model konten CMS, aturan bisnis, cara menjalankan, deploy, cookbook, dan jebakannya.

> **Status dokumen:** disusun 13 Oktober 2026, **diperbarui 19 Oktober 2026** — berdasarkan website commit `30d64e0` dan Studio commit `f8175d6`.
> **Lokasi file:** `website\docs\DOCUMENTATIONS.md` — **di dalam repo website, jadi ikut version control.**
> **Dokumen pendamping (semuanya di folder `docs\` ini):** `PEMELIHARAAN.md` (operasional ringkas), `Sanity CMS Tutorial.md` (panduan editor CMS), `Overall Codebase Security Audit.md` (audit keamanan), `Migrasi-Hostinger.md` (rencana migrasi — tidak dijalankan).

---

## Daftar isi

1. [Ringkasan proyek](#1-ringkasan-proyek)
2. [Peta repositori & folder](#2-peta-repositori--folder)
3. [Arsitektur & stack](#3-arsitektur--stack)
4. [Alur data](#4-alur-data)
5. [Routing & halaman](#5-routing--halaman)
6. [Komponen](#6-komponen)
7. [Model konten CMS](#7-model-konten-cms)
8. [Aturan & konvensi](#8-aturan--konvensi)
9. [Keamanan & konfigurasi teknis](#9-keamanan--konfigurasi-teknis)
10. [Variabel lingkungan](#10-variabel-lingkungan)
11. [Menjalankan lokal](#11-menjalankan-lokal)
12. [Deploy](#12-deploy)
13. [Cookbook — tugas umum](#13-cookbook--tugas-umum)
14. [Script](#14-script)
15. [Jebakan & peringatan](#15-jebakan--peringatan)
16. [Utang teknis](#16-utang-teknis)
17. [Checklist mengubah sesuatu](#17-checklist-mengubah-sesuatu)
18. [Perubahan kontrak Studio dan Website — 18 Oktober 2026](#18-perubahan-kontrak-studio-dan-website--18-oktober-2026)
19. [Menambah brand baru — perubahan paling berdampak](#19-menambah-brand-baru--perubahan-paling-berdampak)
20. [Keputusan konten — 19 Oktober 2026](#20-keputusan-konten--19-oktober-2026)
21. [Yang masih kurang — satu daftar lengkap](#21-yang-masih-kurang--satu-daftar-lengkap-19-oktober-2026)

---

## 1. Ringkasan proyek

Website profil/hospitality **Samsara Group** — sebuah *cultural institution & lifestyle house* di Bogor — berisi lima brand:

| Brand | Tagline | Slug |
|---|---|---|
| **Samsara** | The Listening Room | `samsara` |
| **Svarga** | The Heritage Table | `svarga` |
| **Acasa** | The Leisure Retreat | `acasa` |
| **Outpace** | The Runners Club | `outpace` |
| **Grove** | The City Backyard | `grove` |

**URL produksi (sementara):** <https://samsaragroup.vercel.app>
> ⚠️ `samsaragroup.com` **bukan milik kita** — domain itu dipegang pihak lain (GoDaddy, WordPress perusahaan pelayaran India). Jangan pernah dipakai sebagai `NEXT_PUBLIC_SITE_URL`.
**Studio (CMS):** <https://samsaragroup.sanity.studio/>
**Sanity:** project `p5zu5azj`, dataset `production`

Halaman website: Home, About, Brands, lima halaman brand, Events, Career, Contact, plus template dinamis `[slug]` untuk brand baru.

---

## 2. Peta repositori & folder

### 2.1 Dua repo Git

| Bagian | Lokasi lokal | Remote | Hosting |
|---|---|---|---|
| **Website** | `\website\` | `github.com/albiruby/samsaragroup-website` (`master`) | Vercel (auto-deploy tiap push ke `master`) |
| **Studio (CMS)** | `\studio\` | `github.com/albiruby/samsaragroup-sanity` (`master`) | Sanity hosting |

Keduanya repo terpisah dengan riwayat commit sendiri. Folder induk `Samsara Group Website\` **bukan** repo Git.

### 2.2 Struktur website

```
website/
├── docs/                          dokumentasi proyek (DOCUMENTATIONS.md, PEMELIHARAAN.md, ...)
├── src/
│   ├── app/
│   │   ├── layout.js              metadata global, JSON-LD Organization, providers
│   │   ├── page.js                homepage
│   │   ├── about|brands|career|contact|events/page.js
│   │   ├── samsara|svarga|acasa|outpace|grove/page.js   ← halaman brand hand-tuned
│   │   ├── [slug]/page.js         ← template brand CMS (brand baru)
│   │   ├── globals.css            token Tailwind v4 + utilitas
│   │   ├── sitemap.js  robots.js  not-found.js  error.js  icon.png
│   ├── components/                ~30 komponen (lihat §6)
│   ├── lib/
│   │   ├── site.js                SITE_URL, siteUrl, safeUrl, ogImages, openGraphFor, ctaLabel
│   │   ├── brands-copy.js         BRAND_COPY (nama, tagline, disiplin) — satu sumber teks
│   │   └── jsonld.js              jsonLdHtml() — escape <, >, U+2028/9
│   ├── sanity/lib/
│   │   ├── client.ts              klien Sanity (tokenless, useCdn)
│   │   ├── queries.ts             semua GROQ + hydrateWorld()
│   │   ├── brands.ts              getBrandCards(), getBrandNav(), isPublic()
│   │   └── image.ts               urlFor(), sizedUrl()
│   ├── proxy.js                   CSP nonce + security headers (pengganti middleware)
│   └── instrumentation.js         watcher dev → tulis ke CMS
├── public/                        gambar lokal — satu folder per brand: `ASSETS-<BRAND>` (§2.2a)
├── scripts/                       skrip sinkronisasi & utilitas (lihat §14)
├── next.config.mjs                images.remotePatterns + headers
├── vercel.json                    ignoreCommand — lewati build untuk commit docs-only (§12.1)
├── .env.local                     kredensial (tidak ter-commit)
└── .env.example                   contoh
```

### 2.2a Folder aset `public/` — konvensi `ASSETS-<BRAND>`

Tidak ada gambar di akar `public/` selain `og-default.png` dan berkas verifikasi Google. Setiap brand menempati satu folder, huruf besar, dengan tanda hubung:

```
public/
├── ASSETS-SAMSARA/
│   ├── ambience/     33 foto suasana (dipakai /samsara, /outpace, /grove, /about, homepage)
│   ├── logo/         3 logo korporat (hitam + putih)
│   └── menu/         36 halaman menu + thumbs/ (36 thumbnail 96px)
├── ASSETS-SVARGA/    16 berkas — 13 foto galeri, 1 gambar menu, 2 logo
├── ASSETS-ACASA/     19 berkas — 13 foto galeri, 2 menu, 3 logo, 1 foto jam buka
├── google4a3c3d93edab2ca5.html     verifikasi Google Search Console — jangan dihapus
└── og-default.png                  gambar Open Graph bawaan
```

`ASSETS-OUTPACE` dan `ASSETS-GROVE` **tidak ada** — kedua brand itu hanya memakai gambar dari CMS, dan saat CMS kosong hero-nya jatuh ke kolam foto Samsara.

**Huruf besar itu disengaja, dan penting.** Windows tidak membedakan huruf besar/kecil; Vercel (Linux) membedakannya. Menulis `/assets-samsara/…` akan jalan di lokal tapi **404 di produksi**.

Nama folder lama masih hidup sebagai **redirect permanen** di `next.config.mjs` (`redirects()`), supaya URL gambar yang sudah terindeks Google atau dipakai di luar tidak mati:

| URL lama | Dialihkan ke |
|---|---|
| `/ambiencesamsara/*` | `/ASSETS-SAMSARA/ambience/*` |
| `/menusamsara/*` | `/ASSETS-SAMSARA/menu/*` |
| `/assetacasa/*` | `/ASSETS-ACASA/*` |
| `/assetsvarga/*` | `/ASSETS-SVARGA/*` |
| `/Black%20Logo%20Samsara/*` | `/ASSETS-SAMSARA/logo/*` |
| `/White%20Logo%20Samsara/*` | `/ASSETS-SAMSARA/logo/*` |

Dua aturan terakhir memakai `%20` di `source`, bukan spasi literal: Next mencocokkan `source` terhadap pathname yang masih ter-encode, jadi spasi tidak akan pernah cocok.

Karena redirect ini meredam kesalahan, **status HTTP tidak membuktikan tidak ada rujukan lama yang tertinggal**. Setiap kali folder aset diubah lagi: grep seluruh `src/` untuk nama lama dan pastikan hasilnya nol.

### 2.3 Struktur Studio

```
studio/
├── schemaTypes/
│   ├── index.ts                   daftar tipe yang didaftarkan
│   ├── world.ts                   dokumen brand (paling besar, 9 grup)
│   ├── event.ts  career.ts  careerPage.ts
│   ├── contactInfo.ts  carouselImage.ts  brandNav.ts
├── components/SuggestionTextInput.tsx   input teks dengan saran
├── sanity.config.ts               projectId, dataset, struktur "Content by Page", template
├── sanity.cli.ts                  studioHost: samsaragroup
```

### 2.4 Folder induk (bukan repo)

Folder induk hanya menampung hal yang **tidak boleh** atau **tidak perlu** masuk repo.

| Item | Keterangan |
|---|---|
| `website\` | repo website — termasuk `docs\` di dalamnya |
| `studio\` | repo Studio (CMS) |
| `source-assets\` | aset mentah: `acasa\`, `samsara\`, `svarga\`, `svvara\`, `logosamsara\`, `2026 Samsara Menu Images\`. **Tidak dirujuk kode** — versi terbitnya sudah dikonversi ke `public\` |
| `backups\` | arsip backup Sanity (±28,6 MB/berkas, simpan 14 terbaru) + salinan terbaru di Google Drive. **Tidak boleh masuk repo** — repo publik |
| `screenshots\` | artefak screenshot: `desktop\`, `tablet\`, `mobile\`, `responsive\` |
| `samsara-ad\` | **sudah tidak ada** di folder induk saat dokumen ini diperbarui. Dulu proyek Node/HyperFrames terpisah dengan `package.json` + `dist\` sendiri |
| `.agents\` | bundel skill agen + `skills-lock.json` |
| `_dev-logs\` | log `dev-launcher.ps1` — **infrastruktur hidup, bukan sampah** (dibuat ulang tiap launcher jalan) |
| `dev-launcher.ps1`, `Dev.cmd` | launcher dev (website + studio sekaligus) |

---

## 3. Arsitektur & stack

| Lapis | Teknologi |
|---|---|
| Framework | **Next.js 16.3.8** (App Router, Turbopack) |
| UI | **React 19.2.8**, **Tailwind CSS v4** (`@tailwindcss/postcss`) |
| CMS | **Sanity v6** (`@sanity/client` ^7) + Studio v6 |
| Peta | **Leaflet** 1.9 (tile OpenStreetMap) |
| Analitik | `@vercel/analytics`, `@vercel/speed-insights` |
| Dev tool | Playwright 1.63 (screenshot) |
| Deploy | Vercel (website), Sanity hosting (Studio) |

### 3.1 Konsep inti: dua lapis konten

Ini hal yang paling sering membingungkan, jadi perlu dipahami dulu.

| Lapis | Isi | Cara ubah | Muncul di web |
|---|---|---|---|
| **CMS** | dokumen di dataset `production` | Studio, tanpa deploy | ~1 menit (`revalidate: 60`) |
| **Hardcoded** | teks/gambar di file `.js` | ubah kode → push | setelah Vercel deploy (~1–3 menit) |

Banyak bagian halaman punya **dua-duanya**, dengan pola:

```js
{ world?.description || "Housed in a preserved Dutch-colonial building ..." }
```

Artinya:
- Field CMS **ada isinya** → nilai CMS yang tampil.
- Field CMS **kosong / CMS error** → teks hardcoded lama yang tampil.

**Konsekuensi:** mengosongkan field di Studio **tidak** menghapus apa pun — ia mengembalikan teks bawaan. Untuk benar-benar menghilangkan sesuatu, ubah kodenya.

### 3.2 Dua jenis halaman brand

| | Halaman hand-tuned (5) | Template `[slug]` |
|---|---|---|
| File | `src/app/{samsara,svarga,acasa,outpace,grove}/page.js` | `src/app/[slug]/page.js` |
| Dipakai oleh | lima brand mapan | **brand baru** |
| Sumber | campuran CMS + hardcoded | **sepenuhnya** dokumen `world` |
| Route menang | route statis menang atas `[slug]` | hanya untuk slug yang belum punya route statis |
| Menegakkan `status`/`featured`? | **tidak** | ya (`featured: false` → 404) |

Karena route statis selalu menang, **brand baru tidak boleh memakai slug** `samsara`, `svarga`, `acasa`, `outpace`, `grove` — sudah diblokir di schema (lihat §8.6).

---

## 4. Alur data

```
Sanity dataset "production"
        │  GROQ (useCdn: true, apiVersion 2026-09-19)
        ▼
src/sanity/lib/client.ts            ← tokenless, aman untuk server & client
        │
        ▼
src/sanity/lib/queries.ts           ← getEvents, getWorlds, getWorldBySlug, getBrandNavConfig,
        │                             getCareers, getCareerPage, getContactInfo, getCarouselImages
        │  + hydrateWorld(): menurunkan description/specifications dari sections[]
        ▼
src/sanity/lib/brands.ts            ← getBrandCards(), getBrandNav(), filter isPublic()
        │
        ▼
src/app/**/page.js  +  src/components/**  (BrandActions, BrandHours, HeroCarousel, LeafletMap, ...)
```

Poin teknis:

- **Semua halaman `force-dynamic`** (render per request), tetapi setiap `client.fetch` diberi `next: { revalidate: 60 }` — permintaan ke Sanity di-cache 60 detik.
- **Semua `get*` menangkap error** dan mengembalikan nilai aman (`[]` / `null`), jadi CMS down tidak menjatuhkan halaman.
- **`hydrateWorld()`** menjembatani model baru (`sections[]`) ke field datar lama (`description`, `specifications`). Nilai top-level yang ditulis eksplisit selalu menang.
- **`getBrandCards()` dan `getBrandNav()` punya fallback berbeda** — daftar seed lokal, supaya CMS down tidak membuat `/brands` kosong atau dropdown mati.

---

## 5. Routing & halaman

| Route | File | Sumber data |
|---|---|---|
| `/` | `app/page.js` → `HomePage.js` | **hardcoded**, kecuali marquee (`carouselImage` placement `home`) |
| `/about` | `app/about/page.js` | **hardcoded penuh** |
| `/brands` | `app/brands/page.js` | `getBrandCards()` |
| `/samsara` | `app/samsara/page.js` | campuran (lihat tabel §5.1) |
| `/svarga` | `app/svarga/page.js` | campuran |
| `/acasa` | `app/acasa/page.js` | campuran |
| `/outpace` | `app/outpace/page.js` | campuran |
| `/grove` | `app/grove/page.js` | campuran |
| `/events` | `app/events/page.js` | `getEvents()` — semua event, urut `date` desc |
| `/career` | `app/career/page.js` | `getCareerPage()` + `getCareers()` (status `active`) |
| `/contact` | `app/contact/page.js` | `getContactInfo()` + fallback hardcoded |
| `/[slug]` | `app/[slug]/page.js` | dokumen `world` penuh — **brand baru** |
| `/sitemap.xml` | `app/sitemap.js` | `getBrandCards()` + daftar statis |
| `/robots.txt` | `app/robots.js` | statis |

Ada juga `app/error.js` dan `app/not-found.js`.

### 5.1 Sumber tiap bagian halaman brand hand-tuned

| Bagian | Samsara | Svarga | Acasa | Outpace | Grove |
|---|---|---|---|---|---|
| Eyebrow hero | `heroEyebrow` CMS | `heroEyebrow` CMS | `heroEyebrow` CMS | `heroEyebrow` CMS | `heroEyebrow` CMS |
| Judul hero | logo gambar hardcoded | logo gambar hardcoded | logo gambar hardcoded | teks hardcoded | teks hardcoded |
| Paragraf hero | `tagline` CMS | `tagline` CMS | `tagline` CMS | hardcoded | hardcoded |
| Hero carousel | `gallery` CMS (fallback 12 lokal) | `gallery` CMS | `gallery` CMS | `gallery` CMS | `gallery` CMS |
| Deskripsi + tabel spesifikasi | `description` + `specifications` CMS | idem | idem | idem | idem |
| Tombol aksi | `ctas` + `instagramUrl` CMS | idem | idem | idem | idem |
| Foto kolom kanan | `image` CMS | `image` CMS | **hardcoded** `open-hour-acasa.webp` | `image` CMS | `image` CMS |
| Jam buka | `hours` CMS | `hours` CMS | `hours` CMS | `hours` CMS | `hours` CMS |
| Menu | `<MenuSection />` hardcoded | gambar hardcoded | 2 gambar hardcoded | (tidak ada) | (tidak ada) |
| Peta FIND US | `sections` map CMS + fallback | koordinat hardcoded | koordinat hardcoded | koordinat hardcoded | koordinat hardcoded |
| Teks FIND US | `address` CMS + tagline/WA hardcoded | `address` CMS | `address` CMS | (tidak ada) | (tidak ada) |

Label tabel spesifikasi **sengaja berbeda** per brand: `AT A GLANCE` / `GOOD TO KNOW` / `OFFERINGS` / `SPECIFICATIONS`.

---

## 6. Komponen

Di `src/components/` (±30 file).

**Chrome & navigasi**

| Komponen | Fungsi |
|---|---|
| `Header.js` | header + nav desktop + dropdown BRANDS (buka saat hover) + tombol hamburger (`aria-label="Open menu"`) |
| `MobileMenu.js` | overlay menu layar kecil |
| `Footer.js` | kolom **CONNECT** (General Inquiry, Events), **EXPLORE** (About, Career), **BRANDS** + marquee logo |
| `BackToTop.js`, `ScrollProgressBar.js` | kontrol scroll |
| `PageTransition.js`, `PathnamePreloader.js`, `Preloader.js`, `ImagePreloader.js` | transisi & preload (flag sesi: `sessionStorage["samsara-preloaded"]`) |
| `CustomCursor.js` | kursor kustom |

**Konten**

| Komponen | Fungsi |
|---|---|
| `HomePage.js` | seluruh isi homepage (hardcoded) |
| `CareerList.jsx` | daftar lowongan + filter departemen + chip **Posted At** |
| `HeroCarousel.js` | carousel hero halaman brand (dot `aria-label="Go to image N"`) |
| `MenuSection.js`, `MenuGallery.js` | menu Samsara (hardcoded) & panel menu `[slug]` |
| `ScrollMarquee.js`, `NumberCounter.js` | marquee & angka berjalan |
| `ZoomableImage.js`, `ImageParallax.js` | zoom klik & parallax |

**Data & tema**

| Komponen | Fungsi |
|---|---|
| `BrandsProvider.jsx` | membagikan `brandNav` dari layout ke Header/Footer |
| `ThemeProvider.js`, `ThemeSetter.js` | mode warna per halaman (`world.theme`) |

**Terhubung Sanity / interaktif**

| Komponen | Fungsi |
|---|---|
| `BrandActions.jsx` | baris tombol aksi brand (lihat §8.2) |
| `BrandHours.js` | blok jam buka dari `world.hours`; **tidak render apa pun kalau kosong** |
| `LeafletMap.js` | peta Leaflet (tile OSM) |

**Animasi**

| Komponen | Fungsi |
|---|---|
| `ScrollReveal.js` | reveal saat masuk viewport (IntersectionObserver) |
| `TextClipReveal.js` | reveal teks; saat ini hanya `<div>` passthrough tanpa logika |

---

## 7. Model konten CMS

Tujuh tipe dokumen, semuanya didaftarkan di `schemaTypes/index.ts`.

### 7.1 `world` — satu dokumen per brand

Dokumen terbesar, terbagi **9 grup** di Studio:

| Grup | Field |
|---|---|
| **1 - Identity** | `name`, `slug` |
| **2 - Listing & Navigation** | `tagline`, `speciality`, `categories`*, `image`, `logo` |
| **3 - Hero & Copy** | `theme`, `heroEyebrow`, `heroTitle`, `heroIntro`, `gallery[]`, `description` |
| **4 - Sections** | `sections[]` (`type`: text / specs / features / menu / map; `heading`, `body`, `specifications[]`, `features[]`, `menuPanels[]`, `mapLat`, `mapLng`, `mapZoom`) |
| **5 - Menu** | `menuHeading` (judul bawaan section Menu) |
| **6 - Location & Map** | `address`, `hours[]` |
| **7 - Contact & Links** | `instagramUrl`, `ctas[]` (`kind`, `label`, `url`) |
| **8 - SEO** | `seoTitle`, `seoDescription`, `socialImage`, `noIndex` |
| **9 - Publishing** | `order`, `status`, `featured` |

\* Field `categories`, `sections[].image`, `sections[].features[].image`, dan `world.menuPanels` **sudah dihapus dari schema (19/10)** — keempatnya tidak pernah diproyeksikan dan tidak dibaca website mana pun.

Catatan tipe masuk:

- `hours[]` = baris `{ label, value }` — **per kategori, bukan per hari**. Contoh: `Weekdays` / `10:00 - 22:00`, `Weekend` / `09:00 - 01:00`.
- `ctas[].kind` pilihan di Studio kini hanya tiga: `reservation`, `roomrate`, `instagram`. Kind `menu`, `location`, `career`, `links` sudah dibuang dari schema (lihat §8.2).
- `status`: `active` (tampil) / `draft` (hanya Studio) / `archived` (disembunyikan dari navigasi, URL tetap hidup). Default `active`.
- `featured`: boolean, default `true`.
- `theme`: mode warna halaman saat header tertutup.

### 7.2 `event` — `/events`

`title`, `category`, `date`, `time`, `location`, `capacity`, `entry`, `description`, `image`, `link`.

- `link` = URL eksternal (Instagram, ticketing, registrasi). **Tidak ada halaman `/events/[slug]`** — detail diarahkan lewat `link`.
- Field `slug` dan `featured` **sudah dihapus** dari schema dan datanya (lihat §8.7).

### 7.3 `career` — satu dokumen per lowongan

Grup **1 - Role** (`title`, `slug`, `department`, `brand`, `location`, `employmentType`), **2 - Description** (`summary`, `description`, `requirements[]`), **3 - Apply** (`applyUrl`), **4 - Publishing** (`isUrgent`, `status`, `order`, `postedAt`).

- Hanya `status = "active"` yang tampil.
- `postedAt` kosong → website memakai tanggal hari ini.

### 7.4 `careerPage` — teks halaman `/career`

Grup: **Hero** (`eyebrow`, `title`, `intro`, `theme`), **Listings** (`showBrandStrip`, `positionsHeading`, `emptyHeadline`, `emptyMessage`), **Apply** (`applyUrl` = Google Form default, `applyNote`), **SEO** (`seoTitle`, `seoDescription`).

### 7.5 `contactInfo` — `/contact`

`whatsapp[]` (`label`, `city`, `display`, `phone`), `addresses[]` (`label`, `address`), `hours` (string).

> **Penting:** `display` = nomor yang ditampilkan (boleh pakai `+` dan garis); `phone` = nomor untuk link `https://wa.me/<phone>`. `phone` divalidasi hanya digit (8–15 karakter, mulai `62`). **Keduanya harus konsisten.** Nomor Samsara: `+62 852-8127-1988` / `6285281271988`.

### 7.6 `carouselImage` — marquee homepage

`placement` (`home`), `title` (label internal, tidak tampil), `image`, `alt`, `brand`, `order`, `active`.

### 7.7 `brandNav` — dropdown BRANDS

`rows[]` (`title` + `brands[]`), `seeAllLabel`, `emptyLabel`.

- Urutan array = urutan baris.
- `title` kosong → dipakai `tagline` brand pertama di baris itu.
- Kalau dokumen ini kosong/tidak ada, baris **diturunkan otomatis** dari tiap brand (satu brand = satu baris).
- Label kosong = sembunyikan tautan.

---

## 8. Aturan & konvensi

### 8.1 Aturan publikasi brand — dan jebakannya

| Field | Efek |
|---|---|
| `status = active` | tampil |
| `status = draft` | hanya terlihat di Studio |
| `status = archived` | disembunyikan dari navigasi, **URL tetap hidup** |
| `featured = true` | masuk `/brands`, dropdown, sitemap |
| `featured = false` | di `[slug]` → **404** |

**JEBAKAN:** aturan `featured: false → 404` **hanya berlaku di template `[slug]`**. Kelima halaman hand-tuned **tidak** memeriksa `status` maupun `featured`. Jadi brand yang di-*archive* masih tampil penuh di `/<brand>`-nya, tapi menghilang dari `/brands`, dropdown, footer, dan sitemap.

### 8.2 Aturan tombol brand (`BrandActions.jsx`)

- Semua cta dirender **dalam satu baris** (wrapping) di **bawah tabel spesifikasi**, gaya **outline** (border hitam, isi kosong).
- **Kind yang tersedia di Studio:** hanya `reservation`, `roomrate`, `instagram`. Kind `career`, `menu`, `location`, `links` sudah dibuang dari `CTA_LIST`, jadi editor tidak bisa lagi membuat tombol yang tak akan tampil.
  - `career` dulu ada karena situs sudah punya halaman `/career` sendiri.
  - `menu`, `location`, `links` dulu ada karena lokasi dipresentasikan lewat peta, bukan tombol.
- **Jaring pengaman:** `HIDDEN_KINDS` di `BrandActions.jsx` masih menyaring keempat kind itu saat render, supaya data lama atau penulisan lewat API tidak bisa memunculkannya.
- **Fallback kode** menambah kind `padel` dan `receptionist` (dipakai Acasa, bersama `roomrate`).
- CMS menang **per kind**: cta dari CMS memakai URL & label sendiri. Fallback hardcoded hanya mengisi kind yang belum ada dari CMS, dan ikut mengisi label yang dikosongkan (agar halaman yang sudah tayang dengan "OPEN IN MAPS" tidak berubah wording-nya).
- **Instagram tidak boleh dobel:** `world.instagramUrl` hanya ditambahkan bila CMS belum punya cta `kind: "instagram"`.
- **Label kosong** → dipakai default dari `CTA_LABELS` (`src/lib/site.js`): `RESERVATION`, `ROOM RATE`, `INSTAGRAM` — persis tiga kind yang bisa dipilih. Label default juga bisa ditulis di `ctaLabel()`.
- Kalau tidak ada cta sama sekali → **tidak dirender apa pun** (tanpa baris kosong). Berlaku untuk Outpace, Grove, dan brand baru.

### 8.3 Hero eyebrow

Kelima halaman brand membaca `world.heroEyebrow` dengan fallback **`"BRANDS"`**. Mengosongkan field di CMS berarti label kembali menampilkan `BRANDS`.

### 8.4 Posted At

`CareerList.jsx` memformat `postedAt`; kalau kosong, `career/page.js` memakai tanggal hari ini. Chip **Posted At** berada di **pojok kanan atas** kartu lowongan, di atas tombol APPLY.

### 8.5 Jam buka (`BrandHours`)

- Sumber: `world.hours[]` (per kategori).
- Dirender di blok **FIND US** kelima halaman brand, dan di `[slug]` (di dalam section peta, di bawah alamat).
- **Kosong → blok tidak dirender sama sekali** (tidak ada judul/jarak kosong).
- Untuk brand baru lewat `[slug]`, jam hanya muncul kalau brand itu punya section **Map**.

### 8.6 Slug terlarang (`RESERVED_SLUGS`)

Di `world.ts`, slug `samsara`, `svarga`, `acasa`, `outpace`, `grove` **ditolak** — kecuali oleh dokumen pemiliknya sendiri (ID `world-<slug>`). Jadi:

- `world-svarga` dengan slug `svarga` → lolos.
- Brand baru yang mengetik `svarga` → ditolak.
- `world-svarga` diganti jadi `acasa` → ditolak.

### 8.7 Field yang sudah dihapus

`event.slug` dan `event.featured` telah dihapus dari schema **dan** datanya di-unset (3 dokumen) — supaya tidak muncul error *Unknown field found*. Pola menghapus field Sanity: ubah schema → `unset` data lewat mutation API → verifikasi dengan GROQ `defined(field)`.

### 8.8 Penamaan & bahasa

- `BRAND_COPY` di `src/lib/brands-copy.js` adalah **satu sumber teks** untuk nama, tagline, dan disiplin kelima brand (dipakai dropdown, homepage, seed fallback).
- Label antarmuka berbahasa Inggris; deskripsi field di Studio berbahasa Indonesia (untuk editor).

---

## 9. Keamanan & konfigurasi teknis

### 9.1 `src/proxy.js` — bukan `middleware.js`

Next.js versi ini memakai konvensi **`proxy.js`** untuk interceptor request. File ini:

- Membuat **nonce** per request (`crypto.randomUUID()` → base64).
- Menyusun **CSP** (`default-src 'self'`, `script-src` dengan nonce + `strict-dynamic`, img-src mengizinkan `images.unsplash.com`, `cdn.sanity.io`, `*.tile.openstreetmap.org`, `lh3.googleusercontent.com`; `frame-ancestors 'none'`; dst.).
- Menitipkan nonce lewat header request **`x-nonce`** agar `layout.js` bisa memasangnya di tag JSON-LD.
- `matcher` mengecualikan `api`, `_next/static`, `_next/image`, `favicon.ico`, `sitemap.xml`, `robots.txt`, dan request prefetch.

> Konsekuensi: setiap `<script>` inline (termasuk JSON-LD) **wajib** memakai `nonce`.

### 9.2 Header keamanan (`next.config.mjs`)

`X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`, dan `poweredByHeader: false`.

### 9.3 Aturan menulis kode aman

- **Jangan pernah** menaruh `SANITY_API_TOKEN` di `client.ts` — file itu dipakai komponen server *dan* client. Token hanya untuk skrip lokal.
- JSON-LD **selalu** lewat `jsonLdHtml()` (meng-escape `<`, `>`, U+2028/9).
- URL dari CMS disaring `safeUrl()` (hanya `http:`/`https:`).
- `images.remotePatterns` di `next.config.mjs` saat ini **inert** — kode memakai `<img>` biasa, bukan `next/image`.

### 9.4 Ukuran gambar — pakai `sizedUrl()`, bukan `urlFor()`

`urlFor(source).url()` mengembalikan **gambar orisinal** Sanity (mis. 1920 px). `sizedUrl(source, width)` menambahkan `w` dan `q=70`, jadi CDN hanya mengirim sebesar yang dibutuhkan slot.

Aturannya: **ukur dulu slot-nya di browser, baru tentukan lebar.**

| Slot | Lebar | Terlihat di |
|---|---|---|
| Hero carousel | **1600** | halaman brand (CMS `gallery`) dan `[slug]` |
| Kolom kanan halaman brand | **1100** | `world.image` (slot render ±525 px) |
| Kartu `/events` | **1100** | slot render ±539 px |
| Logo | **480** | `world.logo`, kartu `/brands` |
| Marquee homepage | **640** | `src/app/page.js` |

**Yang TIDAK boleh diubah:** gambar SEO/OpenGraph (`seo.image`, `socialImage`) tetap lewat `urlFor` — crawler sosial butuh berkas penuh.

Catatan penting saat mengukur: `cdn.sanity.io` **tidak** mengirim `Timing-Allow-Origin`, jadi Resource Timing API (`performance.getEntriesByType`) melaporkan `transferSize = 0` untuk gambar Sanity. Ukur dengan **HEAD + `Content-Length`**, bukan Resource Timing.

Hero Samsara kini memakai **galeri CMS** seperti brand lain, sehingga gambarnya di-resize lewat `sizedUrl(…, 1600)`. Fallback 12 gambar lokal (`public/ASSETS-SAMSARA/ambience/*.webp`, 113–374 KB) hanya dikirim kalau `world.gallery` kosong — dalam kondisi normal berkas berat itu tidak dipakai.

---

## 10. Variabel lingkungan

`.env.local` di repo website (tidak ter-commit):

| Variabel | Isi |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `p5zu5azj` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | URL Studio (lokal: `http://localhost:3333`) |
| `SANITY_API_TOKEN` | token tulis — **hanya untuk skrip lokal**, tidak pernah ikut ke browser |
| `NEXT_PUBLIC_SITE_URL` | default `https://samsaragroup.vercel.app` (di `src/lib/site.js`) |
| `SYNC_CMS_DISABLED` (opsional) | set apa pun untuk mematikan watcher dev |

> **Catatan:** `.env.example` masih menyimpan komentar lama (`sams-sams.vercel.app`) dan satu karakter rusak (mojibake) di komentarnya. Nilai sebenarnya ada di `src/lib/site.js` = `samsaragroup.vercel.app`.

---

## 11. Menjalankan lokal

### Website

```bash
cd "website"
npm install
npm run dev          # biasanya http://localhost:3000
npm run lint         # harus 0 error
npm run build        # harus sukses sebelum push
```

### Studio

```bash
cd "studio"
npm install
npm run dev          # port 3333
npm run build        # cek schema
npm run deploy       # HANYA kalau schema berubah
```

> **CATATAN.** `src/instrumentation.js` masih menjalankan watcher di mode development, tetapi sejak 18/10 `sync-hardcode-to-cms.mjs` **lapor-saja** — ia membandingkan gambar di kode dengan yang di CMS lalu melaporkan selisihnya, tanpa menulis, mem-patch, atau menghapus. Jadi `next dev` **tidak lagi bisa mengubah data produksi**. Watcher tetap bisa dimatikan dengan `SYNC_CMS_DISABLED=1`.

---

## 12. Deploy

| Yang diubah | Yang harus dilakukan | Muncul di web |
|---|---|---|
| Isi dokumen CMS | tidak ada (langsung tersimpan) | ~1 menit |
| **Schema** Studio | `npm run deploy` di `studio` | segera |
| Kode website / gambar `public/` | `git add` → `commit` → `git push origin master` | setelah Vercel build (~1–3 menit) |

Website tidak punya CI atau `CODEOWNERS` — Vercel mem-build otomatis tiap push ke `master`, kecuali kalau di-skip oleh `ignoreCommand` (lihat bawah).

**Alur rilis yang dipakai:**

1. Ubah file.
2. `npm run lint` (0 error) dan `npm run build` (sukses).
3. `git commit` dengan pesan jelas.
4. `git push origin master`.
5. Verifikasi di halaman live (bisa `Invoke-WebRequest` + cek umur/markup).

### 12.1 Ignored Build Step — jangan build untuk commit dokumentasi

`vercel.json` di root repo memasang `ignoreCommand`. Tujuannya: **berhenti membuang kuota Deployment Storage** (~85 MB per build) untuk commit yang cuma mengubah dokumentasi.

```
test -n "$VERCEL_GIT_PREVIOUS_SHA" && git diff --quiet $VERCEL_GIT_PREVIOUS_SHA HEAD -- src public scripts package.json package-lock.json next.config.mjs vercel.json postcss.config.mjs jsconfig.json tsconfig.json
```

Cara kerjanya:

| Kondisi | Exit | Hasil |
|---|---|---|
| `VERCEL_GIT_PREVIOUS_SHA` kosong (deploy pertama di branch) | 1 | **BUILD** |
| Ada perubahan di salah satu path di atas | 1 | **BUILD** |
| Semua perubahan hanya di `docs/`, `*.md`, atau `.github/` | 0 | **SKIP** |
| `git` error (mis. clone terlalu dangkal) | ≠0 | **BUILD** (aman) |

Catatan penting:

- **`ignoreCommand` dibatasi 256 karakter oleh schema Vercel.** Perintah di atas 212 karakter. Kalau melewati batas, build-nya **gagal dengan `ERROR`** — bukan cuma diabaikan. Jadi kalau menambah path baru, panjangnya harus tetap di bawah 256.
- `test -n` di depan itu **wajib**. Tanpa itu, saat `VERCEL_GIT_PREVIOUS_SHA` kosong argumennya hilang dan `git diff` membandingkan HEAD dengan working tree yang bersih → exit 0 → **salah skip**.
- **Kalau menambah file/direktori baru di root yang memengaruhi build** (mis. `middleware.js`), tambahkan path-nya — kalau tidak, perubahan di file itu bisa ikut ter-skip.
- Pakai `VERCEL_GIT_PREVIOUS_SHA` (SHA deployment terakhir), bukan `HEAD^`. Bedanya: `HEAD^` cuma melihat commit terakhir, jadi push 3 commit sekaligus dengan commit terakhir docs-only akan **salah skip**. `VERCEL_GIT_PREVIOUS_SHA` membandingkan dengan deployment terakhir, jadi mencakup semuanya.
- Jangan pakai pathspec `:(exclude)` kalau mau memangkas daftar path — perilakunya bersama `--quiet` tidak berhasil diverifikasi (hasilnya tidak konsisten). Daftar path eksplisit bisa diuji dan itu yang dipakai.

**Kalau perlu build paksa saat Redeploy:** di dashboard → **Deployments** → `⋯` pada deployment → **Redeploy** → **uncheck "Use project's Ignore Build Step"**. Kalau tidak di-uncheck, redeploy bisa ikut ter-skip.

---

## 13. Cookbook — tugas umum

**A. Ganti nomor WhatsApp (Samsara)**
1. Studio → **Contact Info** → ubah `display` **dan** `phone` (tanpa `+`, mulai `62`).
2. Kalau nomor itu juga tampil di halaman brand: ubah juga di `src/app/samsara/page.js` (`SAMSARA_WHATSAPP` + `SAMSARA_LINKS.reservation`), lalu push.
> Nomor Samsara ada di **3 tempat**: CMS `contactInfo`, `samsara/page.js`, dan fallback `contact/page.js`. Jaga tetap sinkron.

**B. Ubah alamat** → Studio → **Contact Info** → `addresses[]`; halaman brand: `world.address`.

**C. Tambah/ubah event** → Studio → **Events** → dokumen `event`. Muncul ~1 menit. Detail diarahkan lewat `link`.

**D. Tambah lowongan** → Studio → **Career** → dokumen `career` dengan `status = active`; urut mengikuti `order`; `postedAt` kosong = tanggal hari ini.

**E. Ubah teks About / Vision / Philosophy** → **hardcoded** di `src/app/about/page.js` → push.

**F. Ganti gambar hero Samsara** → Studio → **Brands & Brand Pages — World** → **Samsara** → field **Gallery**; urutan mengikuti Studio. Kalau galeri kosong, halaman jatuh ke 12 gambar lokal di `public/ASSETS-SAMSARA/ambience/` (array fallback di `src/app/samsara/page.js`).

**G. Ganti menu Svarga / Acasa** → **hardcoded**: `/ASSETS-SVARGA/menusvarga.webp`, `/ASSETS-ACASA/acasamenufood.webp`, `acasamenubeverages.webp`.

**H. Ubah foto kolom kanan Acasa (jam buka)** → `public/ASSETS-ACASA/open-hour-acasa.webp` (rasio ideal 4:5) → push. Path dirujuk di `src/app/acasa/page.js`.

**I. Ganti koordinat peta** → **hardcoded** per halaman: `COORDS` (Samsara), `SVARGA_COORDS`, `ACASA_COORDS`, `OUTPACE_COORDS`, `GROVE_COORDS`. Samsara bisa lewat CMS: `world.sections[]` `type: "map"`.

**J. Ubah pengelompokan dropdown BRANDS** → Studio → **BRANDS Dropdown** (`brandNav`).

**K. Atur ulang tombol brand** → Studio → dokumen brand → **Action Buttons** (`ctas`). Urut array = urut tampil. Lihat aturan di §8.2.

**L. Tambah brand baru** → lihat di bawah.

**M. Marquee homepage** → Studio → **Carousel Image** `placement = home`, `active != false`.

**N. Ubah jam buka brand** → Studio → dokumen brand → grup **6 - Location & Map** → **Opening Hours** → tambah baris `label` + `hours` (mis. `Weekdays` / `10:00 - 22:00`). Blok muncul otomatis di halaman brand.

### Tambah brand baru

1. Pastikan slug **bukan** `samsara`, `svarga`, `acasa`, `outpace`, `grove` (ditolak schema).
2. Studio → **World** baru: isi `name`, `slug`, `tagline`, `image` (wajib), `status = active`, `featured = true`, `order`.
3. Isi `gallery` (hero carousel), `sections` (opsional), `ctas`, `instagramUrl`, `address`, `seo*`.
4. Dalam ~1 menit brand muncul di `/brands`, footer, dropdown, sitemap, dan punya halaman `/<slug>`.
5. **Tidak perlu deploy kode** — semuanya dilayani template `[slug]`.

---

## 14. Script

Di `website/scripts/`:

| Script | Fungsi | Risiko |
|---|---|---|
| `sync-hardcode-to-cms.mjs` | membandingkan gambar hardcode di kode dengan gambar di CMS, lalu melaporkan selisihnya (dipakai `npm run sync:cms`) | **Lapor-saja, tidak pernah menulis** — termasuk saat dipanggil watcher dev. Studio adalah sumber kebenaran. **Wajib dipertahankan** (dipakai npm script + `instrumentation.js`) |
| `sync-hardcode-to-cms.mjs` | membandingkan gambar hardcode di kode dengan gambar di CMS, lalu melaporkan selisihnya (dipakai `npm run sync:cms`) | **Lapor-saja, tidak pernah menulis** — termasuk saat dipanggil watcher dev. **Wajib dipertahankan** (dipakai npm script + `instrumentation.js`) |
| `smoke.mjs` | uji cepat 74 pemeriksaan ke situs live (dipakai `npm run smoke`) | baca saja |
| `backup-dataset.ps1` *(repo studio)* | ekspor dataset Sanity + simpan 14 arsip terbaru | menulis berkas lokal saja |
| `backup-and-upload.ps1` *(repo studio)* | ekspor → unggah ke Google Drive → simpan 7 | menulis ke Drive; ukurannya diverifikasi byte-per-byte |

> **Skrip lain sudah dihapus.** Dokumen ini dulu menyebut `sync-cms-to-site.mjs`, `seed-careers.mjs`, `audit-schema.mjs`, `sync-sections-extract.mjs`, dan `security-scan.mjs`. **Kelima-limanya sudah tidak ada** — dihapus di commit `2035c86` ("drop the unused scripts") karena tidak satu pun dipakai npm script, watcher, atau halaman. Sebutan di dokumen lain yang masih menyisakannya adalah catatan historis, bukan hal yang bisa dijalankan.
| `dump-html.mjs`, `snapshot-pages.mjs`, `diff-snapshots.mjs`, `scan-encoding.mjs`, `screenshot-desktop.mjs` | snapshot/screenshot halaman | baca saja |

**Checklist aman sebelum menjalankan script yang menulis:**
- Pastikan `NEXT_PUBLIC_SANITY_DATASET` **bukan** `production`, **atau** backup dulu.
- Jalankan versi `--dry-run` bila tersedia.
- Baca ulang peringatan di dalam script.

### Screenshot

Folder `screenshots\` di root berisi tiga set device:

| Folder | Isi | Cara ambil |
|---|---|---|
| `desktop\` | 11 halaman × (layar pertama + halaman penuh) + header | Playwright headless @ 1440×900 |
| `tablet\` | idem | Playwright headless @ 768×1024 |
| `mobile\` | idem | Playwright headless @ 390×844 |
| `responsive\` | capture yang butuh interaksi: dropdown BRANDS (1024/1280/1440), menu mobile & tablet terbuka, footer, area H1 | chrome-devtools MCP (`emulate` untuk viewport) |

Trik yang terbukti: **scroll dulu, baru tunggu gambar** (gambar lazy-load tidak akan pernah `load` kalau belum masuk viewport → promise-nya menggantung), beri **timeout** pada setiap penantian, dan seed `sessionStorage["samsara-preloaded"]="1"` agar preloader tidak tertangkap setengah pudar.

### Backup dataset Sanity

Skrip: `studio/scripts/backup-dataset.ps1` (ekspor + simpan lokal) dan
`studio/scripts/backup-and-upload.ps1` (ekspor + simpan lokal + unggah ke Google Drive).

```powershell
powershell -ExecutionPolicy Bypass -File scripts\backup-dataset.ps1
powershell -ExecutionPolicy Bypass -File scripts\backup-dataset.ps1 -Keep 30
```

- Mengekspor dataset `production` (dokumen **dan** aset — 28 dokumen + 103 aset, ±28,6 MB) ke `..\..\backups\sanity\` — **di luar repo**.
- Menyimpan hanya **14 backup terbaru**, sisanya dihapus otomatis.
- Mencatat setiap hasil (OK/GAGAL) ke `backups\sanity\backup.log`.
- Butuh sesi Sanity CLI yang sudah login (`sanity datasets list` harus jalan).

**Dijalankan atas permintaan, bukan terjadwal.** Tugas Windows Task Scheduler `Samsara - Sanity Backup` **sengaja dimatikan** (19/10) — backup harian menyalin gambar yang sama 30 kali tanpa menambah keamanan, sementara teksnya hanya berubah beberapa kilobyte. Backup dilakukan saat pemilik memintanya, atau bersamaan dengan push kalau perubahannya menyentuh data.

Perintahnya satu: `backup-and-upload.ps1` — ekspor, simpan 14 lokal, unggah yang terbaru ke Google Drive, simpan 7 di Drive. Drive dipakai lewat remote rclone `samsara-drive`, dikunci dengan `root_folder_id` ke satu folder saja sehingga tidak bisa menulis ke folder lain. Setelah mengunggah, skrip membandingkan ukuran berkas di Drive dengan yang lokal dan gagal kalau tidak sama persis.

```powershell
Get-ScheduledTask  -TaskName "Samsara - Sanity Backup"
Start-ScheduledTask -TaskName "Samsara - Sanity Backup"   # jalankan sekarang
Unregister-ScheduledTask -TaskName "Samsara - Sanity Backup" -Confirm:$false   # hapus
```

> ⚠️ **Repo ini PUBLIK.** Arsip backup tidak boleh ikut di-commit — isinya seluruh database konten. Karena itu outputnya sengaja diletakkan di luar repo, dan hanya skripnya yang di-version-control.

### Monitoring uptime

Workflow: `website/.github/workflows/uptime.yml` (GitHub Actions).

- Jalan otomatis **tiap 15 menit** (dan bisa dipicu manual lewat tab **Actions → Uptime check → Run workflow**).
- Memeriksa 11 route + `robots.txt` + `sitemap.xml`; semua harus **HTTP 200** (tiap request punya 2 retry supaya tidak alarm palsu).
- Kalau ada yang gagal → **membuat issue baru**, atau **mengomentari issue yang masih terbuka**. GitHub mengirim email notifikasi ke pemilik repo — itulah alarmnya.
- Begitu semua hijau lagi → issue **otomatis ditutup**.
- Tidak butuh akun atau dashboard baru, dan tidak ada apa pun yang di-deploy oleh workflow ini.

> Catatan: workflow terjadwal GitHub dinonaktifkan otomatis setelah repo tidak ada aktivitas selama 60 hari. Kalau itu terjadi, cukup buka tab Actions dan aktifkan ulang.

---

## 15. Jebakan & peringatan

1. **Mengosongkan field CMS = memunculkan teks hardcoded**, bukan menghilangkannya (§3.1).
2. **`featured: false` hanya men-404 di `[slug]`.** Halaman hand-tuned tetap hidup (§8.1).
3. **Watcher dev tidak lagi bisa menulis ke production.** ~~Watcher dev bisa menulis ke production saat `next dev` boot (§11).~~ Selesai 18/10 — `sync-hardcode-to-cms.mjs` sekarang **lapor-saja**: tidak mengunggah, mem-patch, maupun menghapus, apa pun argumennya.
4. ~~`seed-careers.mjs clear` menghapus semua lowongan.~~ **Tidak berlaku lagi** — skrip itu sudah dihapus.
5. ~~`sync-cms-to-site.mjs` punya flag `--dry` yang mati.~~ **Tidak berlaku lagi** — skrip itu sudah dihapus.
6. **`sync-hardcode-to-cms.mjs` tidak boleh dihapus** — dipakai npm script dan `instrumentation.js`. Sejak 18/10 ia **lapor-saja**: tidak pernah menulis ke CMS.
7. **JSON-LD tanpa nonce akan diblokir CSP.**
8. **`public/ASSETS-ACASA/open-hour-acasa.webp` jangan dihapus** (dipakai halaman Acasa).
9. **UI yang butuh interaksi tidak bisa di-screenshot lewat `resize_page` chrome-devtools MCP** — itu mengubah ukuran window OS (minimum ~500 px, tinggi mentok tinggi window). Pakai `emulate` dengan `390x844x1,mobile,touch`.
10. **Jangan hapus `scripts/` yang masih dirujuk** `.env.example`/`instrumentation.js` sebelum memastikan tidak ada pemakai.
11. **`ignoreCommand` di `vercel.json` tidak boleh bergantung pada `$VERCEL_GIT_PREVIOUS_SHA`.** Nilai itu menunjuk commit yang terakhir **berhasil** dideploy. Pada 19/10 riwayat repo ditulis ulang lalu di-*force push*, jadi commit yang ditunjuk (`56e37d8`) lenyap dan `git diff` mati dengan `fatal: bad object`. Akibatnya **9 deploy berturut-turut gagal dalam 3 detik** — `next build` tidak pernah mulai, commit dokumentasi pun ikut "gagal" padahal seharusnya dilewati, dan masalahnya tidak bisa pulih sendiri karena percobaan berikutnya menunjuk commit yang sama. Perbaikannya (21/10, `da88bb1`): bandingkan dengan `HEAD^`, yang selalu ada. Diuji lokal — dokumentasi saja → exit 0 (lewati), menyentuh `src/` → exit 1 (bangun).

---

## 16. Utang teknis

> Daftar **gabungan** — isi, teknis, dan hal-hal yang sengaja dibiarkan — ada di **§21**. Bagian ini hanya menyimpan catatan teknis per item.

1. ~~**Halaman hand-tuned tidak menegakkan `status`/`featured`** (§8.1).~~ **Selesai 18/10** — kelima halaman statis kini memanggil `notFound()` bila dokumennya ada dan berstatus draft/archived/not-featured. Bila dokumennya tidak ada sama sekali (CMS mati), halaman tetap tampil dari salinan bawaan.
2. **Kontak tersebar di 3 tempat** (CMS, `contact/page.js`, `samsara/page.js`) — satu perubahan nomor harus diedit berulang.
3. **Dua sumber data brand:** `/brands` dan homepage pakai `getBrandCards()`, Header/Footer pakai `getBrandNav()`; fallback keduanya berbeda, jadi saat CMS down daftar bisa tidak sinkron.
4. ~~**`world.categories`** ada di schema tetapi tidak diproyeksikan/dibaca.~~ **Sudah dihapus dari schema (19/10)** — bersama `sections[].image`, `sections[].features[].image`, dan `world.menuPanels`; keempatnya tidak pernah dibaca website.
5. **Header preload gambar** (`Header.js`) hanya mencakup Samsara/Svarga/Acasa; Outpace/Grove tidak di-preload, dan daftarnya hardcoded (menduplikasi galeri CMS).
6. **`TextClipReveal` tidak punya logika** — hanya `<div>` passthrough.
7. ~~**Hero Samsara masih gambar lokal** (`public/ASSETS-SAMSARA/ambience/*.webp`, 12 berkas ≈ 3 MB) yang tidak bisa di-resize lewat Sanity (§9.4).~~ **Selesai 22/10** — `/samsara` kini membaca `world.gallery` seperti empat brand lain; 12 gambar lokal hanya fallback saat galeri CMS kosong.
8. **Belum ada unit/integration test, dan belum ada CI.** Yang tersedia sekarang: **`npm run smoke`** — 74 pemeriksaan (route, struktur halaman, metadata, header keamanan, dan **kecocokan halaman dengan isi Sanity**) — plus uptime monitor 15 menit. Yang belum: test yang berjalan sendiri di CI. **Tidak ada lagi backup terjadwal** — backup dijalankan atas permintaan (§14).
9. ~~**File sisa di root website:** `mobile-screenshot.js`, `visibility-audit.js`, `Samsara Group Docs.md`.~~ **Selesai 19/10** — ketiganya sudah tidak ada.
10. ~~**Script `scripts/`** sebagian sudah tidak dipakai (kandidat pembersihan).~~ **Selesai 19/10** — kedua folder `scripts/` kini hanya berisi berkas yang benar-benar dipakai: `sync-hardcode-to-cms.mjs` + `smoke.mjs` (website), `backup-dataset.ps1` + `backup-and-upload.ps1` (studio). Lima skrip lama sudah dihapus di `2035c86`.
11. **`.env.example` masih menyimpan karakter rusak** (mojibake) di baris komentar; nilainya sendiri sudah benar.
12. ~~**`.git` website ±1,7 GB** sedangkan file ter-track hanya 225.~~ **Selesai 19/10:** riwayat ditulis ulang untuk membuang 183 `.jpg` + 1 `.pdf` yang sudah tidak dilacak → **1.695 MB menjadi 59 MB**, dan isi berkasnya identik (diverifikasi dengan `diff` terhadap commit lama di GitHub sebelum force-push). Temuan yang membuatnya jelas: dari 1.640 MB blob besar di riwayat, **nol** yang masih dipakai website — semuanya berkas yang sudah dihapus.

---

## 17. Checklist mengubah sesuatu

**Sebelum**
- [ ] Tentukan: ini **konten CMS** atau **kode hardcoded**? (§3.1, §5.1)
- [ ] Kalau data: apakah nilai yang sama ada di tempat lain? (nomor WA, alamat)
- [ ] Kalau mengubah schema: siapkan `sanity deploy`

**Saat mengubah kode**
- [ ] `npm run lint` → 0 error
- [ ] `npm run build` → sukses
- [ ] Tidak mengubah tampilan/konsistensi di luar yang diminta

**Saat mengubah CMS**
- [ ] `display` dan `phone` konsisten (WhatsApp)
- [ ] `status`/`featured` sesuai maksud
- [ ] Tidak mengosongkan field yang fallback-nya tidak diinginkan

**Setelah**
- [ ] Cek halaman terkait (~1 menit untuk data, setelah deploy untuk kode)
- [ ] Untuk schema: `sanity deploy` + hard refresh Studio
- [ ] Working tree kedua repo bersih dan in-sync

---

## 18. Perubahan kontrak Studio dan Website — 18 Oktober 2026

Audit schema ↔ query ↔ rendering menemukan beberapa janji Studio yang tidak
dipenuhi website, dan satu tempat website diam-diam membatalkan kerja editor.
Semuanya sudah diperbaiki dan diverifikasi pada situs live.

| Perubahan | Sebelum | Sesudah |
|---|---|---|
| `scripts/sync-hardcode-to-cms.mjs` | menimpa `world.gallery`, `world.image`, dan `carouselImage(placement=home)` dengan nilai hardcode **di dataset produksi**, setiap `npm run dev` | **lapor-saja** — tidak ada upload, patch, atau delete |
| `status` / `featured` | hanya berlaku di template `[slug]`; 5 halaman brand statis mengabaikannya | berlaku di kelima halaman statis juga (`notFound()`); bila dokumennya tidak ada, halaman tetap tampil dari fallback-nya |
| `sections[].image`, `sections[].features[].image`, `world.menuPanels`, `world.categories` | ada di form, tidak pernah dibaca website (12 gambar feature card sudah terlanjur diunggah) | **dihapus dari schema**. Data lamanya tetap ada di dataset, hanya tidak lagi bisa diisi |
| `event` | tidak ada cara menyembunyikan tanpa menghapus | punya `status` (active/draft/archived); dikosongkan = dianggap active, jadi event lama tetap tayang |
| `brandNav`, `contactInfo`, `careerPage` | di-query `[0]` tanpa urutan — dua dokumen berarti pemenangnya acak | di-query lewat ID tetap: `brandNav`, `contactInfo`, `careerPage`; dibuka sebagai satu dokumen di Studio |
| `noIndex` | halaman menyuruh Google `noindex`, tetapi sitemap tetap mencantumkan URL-nya | sitemap menyaring brand yang ber-`noIndex` |
| `/sitemap.xml` | di-cache tepi (Static, Expire 1y) — brand baru tidak muncul sampai deploy ulang | dirender per permintaan (ditandai `ƒ`), ikut CMS dalam ~60 detik |

**Dibuktikan dengan uji end-to-end** memakai brand sementara `template-test`
(dibuat, diuji, lalu dihapus — dataset kembali bersih):

- status `draft` → `/template-test` **404 dalam 1 detik**
- diaktifkan → **200 dalam 74 detik**, 8/8 konten dari CMS tampil (hero, text,
  specs, features, menu, map, address, hours), masuk `/brands` **dan** sitemap
- `noIndex` dinyalakan → **keluar dari sitemap dalam 64 detik**, halaman tetap hidup
- dihapus → 404, bersih dari `/brands` dan sitemap, 0 dokumen tersisa

**Cadangan sebelum perubahan data:** arsip terbaru ada satu tingkat di atas repo `studio`, di folder `backups\sanity\` — dibuat dengan `backup-and-upload.ps1`, disimpan 14 terbaru secara lokal dan 7 terbaru di Google Drive. Yang tersimpan saat laporan ini ditulis termasuk satu snapshot **sebelum** seluruh perubahan konten 19 Oktober.

---

## 19. Menambah brand baru — perubahan paling berdampak

Menambah brand menyentuh CMS **dan** beberapa berkas kode. Yang **otomatis** menyesuaikan: halaman `/<slug>` (template dinamis), kartu di `/brands`, daftar brand di footer, logo di marquee footer, dan `sitemap.xml`.

**Wajib:**

| Langkah | Di mana |
|---|---|
| 1. Buat dokumen `world` — Name, Slug, **Card Image (wajib)**, Tagline, Speciality, galeri, section, tombol | Studio → *Brands & Brand Pages — World* |
| 2. Tambahkan brand ke sebuah baris **BRANDS Dropdown** | Studio → *Header Menu — BRANDS Dropdown* |
| 3. `status = Active`, `featured = true` | dokumen `world` |
| 4. Slug jangan salah satu dari `samsara`, `svarga`, `acasa`, `outpace`, `grove` | schema menolak sendiri |

**Kenapa langkah 2 wajib:** dropdown header dibaca dari dokumen BRANDS Dropdown, bukan dari daftar brand. Tanpa menambahkannya ke sebuah baris, brand baru **tidak akan muncul di menu header** — walaupun footer, `/brands`, dan sitemap sudah memuatnya otomatis.

**Kenapa langkah 3 wajib:** `status` bukan `active` **atau** `featured: false` membuat `/<slug>` mengembalikan **404**. Ini berlaku di template dinamis maupun di kelima halaman hand-tuned.

**Opsional** (semuanya punya cadangan, jadi brand tetap tampil tanpa ini):

| Berkas | Isinya | Kalau dilewati |
|---|---|---|
| `src/lib/brands-copy.js` | teks cadangan per brand | saat CMS mati, brand baru tidak punya kartu cadangan |
| `src/sanity/lib/brands.ts` | `LEGACY_LOGO`, `CARD_LOGO`, `SEED_CARDS` | tidak ada logo/kartu cadangan — tetap terisi dari CMS |
| `src/components/Header.js` → `brandImages` | gambar latar saat hover di dropdown | brand tampil tanpa gambar latar |
| `src/components/ImagePreloader.js` → `preloadMap` | preload per halaman | tanpa preload; halaman tetap normal |

**Sudah dibuktikan 18/10/2026** dengan brand sementara `template-test` yang dibuat hanya dari CMS: halaman langsung tampil lengkap (8 dari 8 jenis field), muncul di `/brands` dan sitemap dalam ~74 detik, dan mengembalikan **404** saat statusnya `draft`.

> **Soal tombol:** jenis yang bisa dipilih dari Studio hanya `reservation`, `roomrate`, `instagram`. Tombol di halaman hand-tuned — mis. `padel` dan `receptionist` di Acasa — ditulis di kode sebagai *fallback*, jadi tidak muncul di field `ctas` CMS dan tidak bisa diedit dari Studio.

---

## 20. Keputusan konten — 19 Oktober 2026

Pemilik memeriksa isi yang tayang, lalu memutuskan:

| # | Hal | Keputusan |
|---|---|---|
| 1 | Jam buka brand | **Belum ditentukan** — dibiarkan kosong. Catatan: `hours` hanya dirender di dalam section Map, jadi mengisinya tanpa section Map pun tetap tidak tampil |
| 2 | `socialImage` (gambar preview saat link dibagikan) | **Dibiarkan kosong** — preview memakai gambar kartu brand |
| 3 | Tombol halaman Acasa | **Sudah ada** — datang dari `ACASA_ACTIONS` di `acasa/page.js` (RESERVE PADEL, RECEPTIONIST, ROOM RATE, INSTAGRAM), bukan dari field `ctas` CMS |
| 4 | Outpace & Grove | **Dibiarkan publik apa adanya** — ini simulasi & kesiapan, belum dirilis; masih ada yang perlu ditambah |
| 5 | Google Form lowongan | **TBD** — keenam lowongan memakai satu form yang sama |
| 6 | `/events` kosong | **Dibiarkan** — tidak ada event, halaman menampilkan pesan kosong |
| 7 | Gambar hero & About homepage | **Dibiarkan** — memakai dua foto yang sekarang |

**Apa yang diperkirakan berubah di masa depan:** brand bisa bertambah; lowongan berubah mengikuti kondisi; slide marquee dan logo bertambah mengikuti brand baru. Sisanya diperkirakan tetap — karena itu §19 diberi bobot paling besar.

---

## 21. Yang masih kurang — satu daftar lengkap (19 Oktober 2026)

Ringkasan penilaian terhadap checklist kesiapan produksi (50 item):

| | Jumlah | Arti |
|---|---|---|
| ✅ terpenuhi | **34** | jalan dan terverifikasi |
| ⚠️ perlu perhatian | **9** | berfungsi, tapi belum ideal |
| ❌ belum ada | **0** | tidak ada item yang benar-benar kosong |
| — tidak berlaku | 7 | arsitektur ini tanpa backend, login, form, dan unggahan |

### A. Yang menahan status "publish-ready"

1. **Domain sendiri belum ada.** Situs berjalan di `samsaragroup.vercel.app`. `samsaragroup.com` **bukan milik proyek ini** (dipegang pihak lain). Ini satu-satunya *deployment blocker*.
2. **Privacy policy & halaman legal belum ada.** Diputuskan **dilewati** oleh pemilik (19/10) — bukan kelalaian, tapi konsekuensinya item "Privacy & consent" dan "Legal pages" tetap ⚠️.
3. **Persetujuan rilis** — menunggu keputusan pemilik atas isi yang tayang (§19).

### B. Isi yang belum lengkap

| Hal | Keadaan | Catatan |
|---|---|---|
| **Outpace & Grove** | tanpa alamat, Instagram, tombol, logo, menu, peta — **tapi halamannya publik** dan ikut di sitemap | disengaja: simulasi & kesiapan, belum dirilis |
| **Jam buka** kelima brand | kosong | belum ditentukan; dan `hours` hanya tampil di dalam section Map |
| **`socialImage`** kelima brand | kosong | preview link memakai gambar kartu brand — berfungsi, tidak ideal |
| **Google Form lowongan** | keenam lowongan memakai satu form yang sama | TBD |
| **Tombol halaman hand-tuned** | ditulis di kode, bukan di CMS | mis. Acasa: RESERVE PADEL, RECEPTIONIST. Tidak bisa diedit dari Studio |
| **`noIndex`** | tidak dipakai satu halaman pun | fitur siap, tinggal dipakai kalau perlu |

### C. Pekerjaan teknis yang belum

| Hal | Dampak kalau dibiarkan |
|---|---|
| **Test otomatis & CI** — `npm run smoke` ada, tapi harus dijalankan manual | regresi diam-diam tidak ada yang menangkap. Ini kelemahan paling serius |
| **7 kerentanan dependensi** (website) & 24 (studio) | mayoritas tooling dev/CLI, tapi belum ditangani |
| **Gambar `/svarga`, `/acasa`, menu** masih 700–790 KB per berkas | halaman brand jauh lebih berat daripada homepage (yang sudah 118 KB) |
| **Prosedur rollback** belum ditulis & belum pernah diuji | tombolnya ada di Vercel, tapi tidak ada yang tahu langkahnya |
| **Nama folder lokal** (`website`, `studio`) beda dari nama repo (`samsaragroup-website`, `samsaragroup-sanity`) | saat clone dari GitHub, folder yang muncul bernama repo — rename manual agar cocok dengan dokumentasi |
| **Lima halaman brand hand-tuned** menyimpan layout di kode | dua cara berbeda menambah brand: lewat template dinamis (mudah) vs mengubah kode (berat) |
| **Belum ada unit/integration test** | logika bisnis nyaris tidak ada, jadi risikonya kecil — tapi tetap nol |

### D. Yang **DISENGAJA** seperti ini — jangan "diperbaiki"

Daftar ini ada supaya orang berikutnya tidak menghabiskan waktu memperbaiki hal yang memang sudah benar:

| Yang terlihat kosong | Kenapa dibiarkan |
|---|---|
| `world.description` kelima brand | Deskripsi yang tampil **diambil dari section "THE VISION"** secara otomatis (`hydrateWorld()`). Mengisinya justru akan menimpa teks itu |
| `careerPage.emptyHeadline` & `emptyMessage` | Ada kalimat bawaan di kode |
| `/events` tanpa event | Halaman menampilkan pesan kosong yang memang disiapkan |
| `world.hours` kosong | Belum ditentukan (§20) — bukan lupa |
| Kedua repo **publik** | Keputusan pemilik. Konsekuensinya: **ekspor konten tidak boleh di-commit** |
| Aset Sanity bisa dibaca publik tanpa login | Memang desainnya — karena itu **dokumen pribadi tidak boleh diunggah** ke dataset ini |
| `.playwright-mcp/` & `_dev-logs/` di root lokal | Dibuat ulang sendiri oleh alat; ~0 MB dan di luar repo |

### E. Kalau mau naik dari 8 ke 9+

Urutan yang paling berdampak: **CI menjalankan `npm run smoke`** → **domain** → **kerentanan dependensi** → **gambar halaman brand** → **tulis + uji prosedur rollback**.
