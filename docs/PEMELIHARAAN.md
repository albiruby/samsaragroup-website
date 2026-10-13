# Panduan Pemeliharaan — Samsara Group

Dokumen ini untuk siapa pun yang mengubah konten, kode, atau CMS website Samsara Group.
Ditulis berdasarkan kondisi repo per commit `5054108` (website) dan `788a84b` (Studio). Untuk gambaran arsitektur yang lengkap, lihat `DOCUMENTATIONS.md` — dokumen ini fokus ke operasional sehari-hari.

Dokumen ini ada di `Versi Next.js\docs\`, jadi **ikut version control** bersama kode website.

---

## 0. TL;DR — aturan yang paling sering bikin bingung

1. **Dua lapis konten.** Sebagian konten datang dari **Sanity CMS** (bisa diubah tanpa deploy); sebagian **hardcoded di kode** (butuh ubah kode + push).
2. **CMS menang hanya kalau ada isinya.** Pola kode selalu `nilaiCMS || "teks lama"`. Mengosongkan field di CMS akan memunculkan kembali teks hardcoded, bukan menghilangkannya.
3. **Kelima halaman brand adalah halaman khusus (hand-tuned), bukan template CMS.** Banyak bagiannya (hero, menu, peta, foto) **tidak** membaca CMS. Menambah brand baru lewat CMS memakai template lain (`[slug]`).
4. **Perubahan konten CMS muncul ~1 menit** (`revalidate: 60`). **Perubahan kode** butuh push → Vercel deploy (~1–3 menit).
5. **Mengubah field/schema di Studio butuh `sanity deploy`.** Mengubah isi dokumen tidak.

---

## 1. Peta sistem

| Bagian | Lokasi | Git remote | Hosting |
|---|---|---|---|
| Website | `D:\Project Website INFIA\Samsara Group Website\Versi Next.js` | `github.com/albiruby/samsaragroup-website` (`master`) | Vercel, auto-deploy tiap push ke `master` |
| Studio (CMS) | `D:\Project Website INFIA\Samsara Group Website\studio-sams-sams` | `github.com/albiruby/samsaragroup-sanity` (`master`) | Sanity hosting: https://samsaragroup.sanity.studio/ |
| Dokumentasi | `Versi Next.js\docs\` | ikut repo website | `DOCUMENTATIONS.md`, `Sanity CMS Tutorial.md`, `Migrasi-Hostinger.md`, `Overall Codebase Security Audit.md` |

- **Domain produksi website (sementara):** https://samsaragroup.vercel.app
  > ⚠️ `samsaragroup.com` **BUKAN milik kita.** Domain itu dipegang pihak lain (GoDaddy, WordPress perusahaan pelayaran India). Jangan pernah menaruhnya di `NEXT_PUBLIC_SITE_URL` — canonical, `og:url`, sitemap, dan robots kita akan menunjuk ke situs mereka.
- **Sanity project:** `p5zu5azj` · **dataset:** `production`
- **Stack website:** Next.js 16 (App Router, Turbopack), React 19, Tailwind v4.
- **Studio lokal:** `npm run dev` di repo `studio-sams-sams` (port 3333).

---

## 2. Dua lapis konten (konsep inti)

### Lapis 1 — Sanity CMS (ubah dari Studio, tanpa deploy)
Dokumen yang tersimpan di dataset `production`. Perubahan muncul di website dalam **~1 menit**.

Tipe dokumen: `world` (brand), `event`, `career`, `careerPage`, `contactInfo`, `carouselImage`, `brandNav`.

### Lapis 2 — Hardcoded di kode (butuh edit kode + commit + push)
Semua teks, gambar, tombol, dan markup yang ditulis langsung di file `.js`. Contoh: halaman About, judul hero Outpace/Grove, menu, koordinat peta, label navigasi.

**Konsekuensi:** mengubah sesuatu di Studio **hanya** mengubah website kalau kode di halaman itu memang membaca field tersebut. Lihat §7 untuk daftar per halaman.

---

## 3. Model fallback (paling sering menjebak)

Pola di kode:
```js
{ world?.description || "Housed in a preserved Dutch-colonial building ..." }
```

Artinya:
- Field CMS **ada isinya** → nilai CMS yang tampil.
- Field CMS **kosong / dokumen error** → teks hardcoded lama yang tampil.

Jadi kalau kamu mengosongkan sebuah field di Studio, website **tidak jadi kosong** — ia kembali ke teks bawaan. Untuk benar-benar menghilangkan sesuatu, kamu harus mengubah kodenya.

---

## 4. Kapan perubahan muncul

| Yang diubah | Muncul di web | Perlu deploy? |
|---|---|---|
| Isi dokumen CMS (teks, gambar, event, career, kontak, marquee) | ~1 menit (data cache `revalidate: 60`) | Tidak |
| Field/schema baru di Studio | Segera setelah `sanity deploy` | Ya, `sanity deploy` |
| Kode website (`src/**`) | Setelah push → Vercel build | Ya, push ke `master` |
| Gambar baru di `Versi Next.js/public/**` | Setelah push → Vercel build | Ya, push ke `master` |

Catatan teknis: semua halaman memakai `export const dynamic = "force-dynamic"` (render per request), tetapi setiap `client.fetch` diberi `next: { revalidate: 60 }`, sehingga permintaan ke Sanity di-cache 60 detik.

---

## 5. Aturan publikasi brand — dan jebakannya

Di dokumen `world`:
- **`status`**
  - `active` → tampil.
  - `draft` → hanya terlihat di Studio.
  - `archived` → disembunyikan dari navigasi, tapi URL tetap hidup.
- **`featured`**
  - `true` → masuk `/brands`, dropdown nav, sitemap.
  - `false` → halaman `/<slug>` mengembalikan **404** — brand hilang total.

**JEBAKAN PENTING.** Aturan `featured: false → 404` **hanya berlaku di template `[slug]`**. Kelima halaman hand-tuned (`samsara`, `svarga`, `acasa`, `outpace`, `grove`) **tidak** memeriksa `status` maupun `featured`. Jadi:
- Brand yang di-`archived`/`featured: false` masih tampil penuh di halaman hand-tuned-nya.
- Ia menghilang dari `/brands`, dropdown nav, footer, dan sitemap — tapi URL-nya tetap melayani konten.

Ini utang teknis yang belum diperbaiki (lihat §13).

---

## 6. Referensi dokumen & field CMS

Ringkas. "Dibaca web" = kode website benar-benar memakai field itu.

### `world` — satu dokumen per brand
Field yang **dibaca** (paling relevan):
- `name`, `slug`, `tagline`, `description`, `image`, `gallery`
- `specifications` (tabel label/value)
- `sections` (blok konten: text / specs / features / menu / map) — **hanya** dibaca oleh template `[slug]` dan (untuk peta) Samsara
- `ctas[]` (`kind`, `label`, `url`) — tombol aksi
- `instagramUrl` — tombol Instagram
- `address`, `heroEyebrow`, `heroTitle`, `heroIntro`, `menuHeading`
- `logo`, `speciality`, `order`, `status`, `featured`, `theme`, `noIndex`
- `seoTitle`, `seoDescription`, `socialImage`
- `hours` — baris `{label, value}` **per kategori** (mis. `Weekdays` / `Weekend`), bukan per hari. Dirender `BrandHours` di blok FIND US kelima halaman brand, dan di section peta `[slug]`. Kosong = blok jam tidak muncul sama sekali.
- `categories` — **tidak dibaca di mana pun** (warisan; sekarang didefinisikan di schema agar tidak error)
- `menuPanels` — dibaca hanya oleh template `[slug]`

### `career`
`title`, `slug`, `department`, `brand`, `location`, `employmentType`, `summary`, `description`, `requirements[]`, `applyUrl`, `isUrgent`, `status` (=`active` yang tampil), `order`, `postedAt` (kosong = tanggal hari ini).

### `careerPage`
`eyebrow`, `title`, `intro`, `theme`, `showBrandStrip`, `positionsHeading`, `emptyHeadline`, `emptyMessage`, `applyUrl` (form default), `applyNote`, `seoTitle`, `seoDescription`.

### `event`
`title`, `slug`, `category`, `date`, `time`, `location`, `capacity`, `entry`, `description`, `image`, `link`, `featured` (tidak dipakai web).

### `contactInfo`
`whatsapp[]` (`label`, `city`, `display`, `phone`), `addresses[]` (`label`, `address`), `hours`.
> `display` = yang ditampilkan; `phone` = yang benar-benar di-dial (`https://wa.me/<phone>`). **Keduanya harus konsisten.** Nomor Samsara = `+62 852-8127-1988` / `6285281271988`.

### `carouselImage`
`placement` (`home` = marquee homepage), `title`, `image`, `alt`, `brand`, `order`, `active`.

### `brandNav`
`rows[]` (tiap baris punya `title` + `brands[]`), `seeAllLabel`, `emptyLabel`. Mengatur pengelompokan dropdown BRANDS. Kalau dokumen ini kosong, baris diturunkan otomatis dari `tagline` tiap brand.

---

## 7. Per-halaman: apa yang CMS vs hardcoded

### Home `/`
- Hero image: **hardcoded** (`/ambiencesamsara/DSC08930.webp`).
- Semua copy: **hardcoded** (di `src/components/HomePage.js`).
- Marquee: `carouselImage` (placement `home`) dengan fallback literal.

### About `/about`
- **Hardcoded penuh** (`src/app/about/page.js`). Tidak ada CMS.

### Brands `/brands`
- Daftar: `getBrandCards()` (hanya brand publik).

### Career `/career`
- `careerPage` + `career` (status `active`) + strip brand dari `brandNav`.

### Events `/events`
- `getEvents()` — semua dokumen event, urut `date` desc.

### Contact `/contact`
- `contactInfo` (whatsapp, alamat, jam) + fallback hardcoded.

### Halaman brand (Samsara / Svarga / Acasa / Outpace / Grove)
Hand-tuned. Ringkasan sumber tiap bagian:

| Bagian | Samsara | Svarga | Acasa | Outpace | Grove |
|---|---|---|---|---|---|
| Eyebrow hero | `heroEyebrow` CMS | idem | idem | idem | idem |
| Judul hero | logo gambar hardcoded | logo gambar hardcoded | logo gambar hardcoded | teks hardcoded | teks hardcoded |
| Paragraf hero | `tagline` CMS | `tagline` CMS | `tagline` CMS | hardcoded | hardcoded |
| Hero carousel | **hardcoded** 12 gambar | `gallery` CMS | `gallery` CMS | `gallery` CMS | `gallery` CMS |
| Deskripsi + tabel spesifikasi | `description` + `specifications` CMS | idem | idem | idem | idem |
| Tombol aksi | `ctas` + `instagramUrl` CMS | idem | **hardcoded** padel/receptionist/roomrate + `instagramUrl` | (tidak ada) | (tidak ada) |
| Foto kolom kanan | `image` CMS | `image` CMS | **hardcoded** `open-hour-acasa.webp` | `image` CMS | `image` CMS |
| Menu | `<MenuSection />` hardcoded | gambar hardcoded | 2 gambar hardcoded | (tidak ada) | (tidak ada) |
| Peta FIND US | `sections` map CMS + fallback | koordinat hardcoded | koordinat hardcoded | koordinat hardcoded | koordinat hardcoded |
| Teks FIND US | `address` CMS + tagline/WA hardcoded | `address` CMS | `address` CMS | (tidak ada) | (tidak ada) |
| Jam buka | `hours` CMS | `hours` CMS | `hours` CMS | `hours` CMS | `hours` CMS |

Label tabel spesifikasi sengaja berbeda per brand: AT A GLANCE / GOOD TO KNOW / OFFERINGS / SPECIFICATIONS.

### Template `[slug]` (brand baru)
Membaca dokumen `world` sepenuhnya: `sections`, `gallery`, `menuPanels`, `ctas`, `mapLat/Lng/Zoom`, `address`, `instagramUrl`, `theme`, `noIndex`. Ini yang membuat brand baru otomatis punya halaman.

---

## 8. Cookbook — tugas umum

### A. Ganti nomor WhatsApp (Samsara)
1. Studio → **Contact Info** → ubah `display` **dan** `phone` (`display` boleh pakai `+` dan garis; `phone` hanya angka, mulai `62`). Contoh: `+62 852-8127-1988` / `6285281271988`.
2. Kalau nomor itu juga muncul di halaman brand (mis. Samsara), ubah juga di kode: `src/app/samsara/page.js` (`SAMSARA_WHATSAPP` dan `SAMSARA_LINKS.reservation`), lalu push.
> Nomor Samsara ada di 3 tempat: CMS `contactInfo`, `samsara/page.js` (display + link), dan fallback `contact/page.js`. Jaga tetap sinkron.

### B. Ubah alamat
- Studio → **Contact Info** → `addresses[]`.
- Halaman brand: `world.address` (Samsara/Svarga/Acasa). Outpace/Grove tidak punya blok alamat.

### C. Tambah / ubah event
- Studio → **Events** → dokumen `event`. Muncul di `/events` dalam ~1 menit.
- `link` = tombol/kartu clickable. `featured` tidak dipakai web.

### D. Tambah lowongan
- Studio → **Careers** → dokumen `career`, `status = active`. Urut mengikuti `order`.
- `postedAt` kosong → tampil tanggal hari ini.
- **Hati-hati:** `scripts/seed-careers.mjs clear` menghapus **semua** lowongan. Jangan jalankan tanpa sadar.

### E. Ubah teks halaman About / Vision / Philosophy
- **Hardcoded** di `src/app/about/page.js`. Ubah kode → push.

### F. Ganti gambar hero Samsara
- **Hardcoded** di `src/app/samsara/page.js` (array 12 path). Letakkan gambar di `public/ambiencesamsara/`, ubah kode, push.

### G. Ganti menu Svarga / Acasa
- **Hardcoded**: `/assetsvarga/menusvarga.webp` dan `/assetacasa/acasamenufood.webp` + `acasamenubeverages.webp`. Ganti file gambar (nama sama) atau ubah path di kode, lalu push.

### H. Ubah foto samping Acasa (jam buka)
- File: `public/assetacasa/open-hour-acasa.webp`. Ganti gambarnya (rasio ideal 4:5), lalu push. Path direferensikan di `src/app/acasa/page.js`.

### I. Ganti koordinat peta
- **Hardcoded** per halaman: `COORDS` di `samsara/page.js`, `SVARGA_COORDS`, `ACASA_COORDS`, `OUTPACE_COORDS`, `GROVE_COORDS`. Ubah kode, push.
- Samsara bisa lewat CMS: `world.sections[]` dengan `type: "map"` (`mapLat`, `mapLng`, `mapZoom`).

### J. Ubah pengelompokan dropdown BRANDS
- Studio → **BRANDS Dropdown** (`brandNav`). Kosongkan `title` untuk memakai tagline brand pertama di baris itu.

### K. Atur ulang tombol brand
- Studio → dokumen brand → **Action Buttons** (`ctas`), urut = urut tampil.
- Kind yang **tidak** tampil di web (sengaja): `career`, `menu`, `location`, `links`. Kind yang tampil: `reservation`, `roomrate`, `instagram` (plus fallback kode: `padel`, `receptionist`).
- Label kosong → pakai label default (`CTA_LABELS` di `src/lib/site.js`).

### L. Tambah brand baru
Lihat §10.

### M. Marquee homepage
- Studio → **Carousel Image** dengan `placement = home`, `active != false`. `order` menentukan urutan.

---

## 9. Deploy & rilis

### Website
1. `git add` + `git commit` + `git push origin master` dari repo `Versi Next.js`.
2. Vercel otomatis build & deploy. Cek di dashboard Vercel bila perlu.
3. Sebelum commit, jalankan `npm run lint` dan `npm run build` lokal (harus 0 error).

### Studio
- **Ubah konten/dokumen:** tidak perlu apa-apa, langsung tersimpan & tersinkron.
- **Ubah schema (field baru, dll.):** dari repo `studio-sams-sams`, `npm run deploy` (SCL: `sanity deploy`). Ini meng-upload schema ke https://samsaragroup.sanity.studio/.
- Studio lokal untuk pratinjau: `npm run dev` (port 3333).

---

## 10. Menambah brand baru

1. Pastikan tidak memakai slug yang sudah dipakai salah satu route statis: **`samsara`, `svarga`, `acasa`, `outpace`, `grove`**. Kalau memakai itu, halaman statis lama yang muncul, bukan template baru.
2. Studio → buat dokumen **World** baru: isi `name`, `slug`, `tagline`, `image` (wajib), `status = active`, `featured = true`, `order`.
3. Isi `gallery` (hero carousel), `sections` / `menuPanels` (opsional), `ctas`, `instagramUrl`, `address`, `seo*`.
4. Dalam ~1 menit brand otomatis muncul di `/brands`, footer, dropdown nav, sitemap, dan punya halaman `/<slug>`.
5. **Tidak perlu deploy kode.** Semua bagian brand baru dilayani template `[slug]`.

---

## 11. Script yang tersedia

Di repo website (`scripts/`):

| Script | Fungsi | Risiko |
|---|---|---|
| `sync-hardcode-to-cms.mjs` | membaca nilai hardcoded dari kode dan mengirim ke CMS (dipakai `npm run sync:cms`) | **Menulis ke production.** `--dry-run` untuk simulasi |
| `sync-cms-to-site.mjs` | menulis field SEO dari website ke CMS | **Menulis ke production**; flag `--dry` mati (tidak menahan tulisan) |
| `seed-careers.mjs` | seed lowongan; `clear` = **hapus semua** dokumen career | **Destruktif** |
| `audit-schema.mjs` | memeriksa schema | baca saja |
| `sync-sections-extract.mjs` | ekstrak section | baca/tulis |
| `security-scan.mjs` | pemindai keamanan sederhana | baca saja; tidak terhubung ke npm script |
| `dump-html.mjs`, `snapshot-pages.mjs`, `diff-snapshots.mjs`, `scan-encoding.mjs` | snapshot HTML halaman | baca saja |
| `screenshot-desktop.mjs` | screenshot | baca saja |

**Peringatan:** `src/instrumentation.js` menjalankan watcher yang, saat `NODE_ENV=development`, otomatis menyinkronkan hardcoded → CMS (termasuk patch/hapus) setiap kali `next dev` boot. Jangan pernah menjalankan `next dev` dengan `.env.local` yang menunjuk dataset production kalau tidak siap mengubah data.

### Backup & monitoring (otomatis)

| Alat | Fungsi | Lokasi |
|---|---|---|
| `backup-dataset.ps1` | ekspor dataset `production` (dokumen + aset, ±60 MB) ke `backups\sanity\`, simpan 14 terbaru | repo **studio**, `scripts/` |
| Task Scheduler **"Samsara - Sanity Backup"** | menjalankan backup tiap hari **09:00** | Windows |
| `.github/workflows/uptime.yml` | tiap **15 menit** cek 11 route + `robots.txt` + `sitemap.xml`; gagal → issue (email), pulih → issue ditutup | repo website |

> Backup **tidak boleh** di-commit. Repo website publik, dan arsipnya memuat seluruh database konten.

**Checklist aman sebelum menjalankan script yang menulis:**
- Pastikan `NEXT_PUBLIC_SANITY_DATASET` bukan `production`, **atau** backup dulu.
- Jalankan versi `--dry-run` bila tersedia.
- Baca ulang peringatan di script.

---

## 12. Variabel lingkungan

File `.env.local` di repo website (tidak ter-commit):

| Variabel | Isi |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `p5zu5azj` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | URL Studio (lokal `http://localhost:3333`) |
| `SANITY_API_TOKEN` | token tulis — **hanya untuk script lokal**, tidak pernah dipakai di browser |
| `NEXT_PUBLIC_SITE_URL` | `https://samsaragroup.vercel.app` (default di `src/lib/site.js`) |

> Catatan: `.env.example` masih menyimpan satu karakter rusak (mojibake) di baris komentarnya. Nilainya sendiri sudah benar: `https://samsaragroup.vercel.app`.

---

## 13. Masalah yang diketahui / utang teknis

1. **Halaman hand-tuned tidak menegakkan `status`/`featured`.** Brand yang di-archive masih tampil di `/<brand>`. (Lihat §5.)
2. **Kontak tersebar di 3 tempat** (CMS, `contact/page.js`, `samsara/page.js`). Satu perubahan nomor harus diedit di beberapa tempat.
3. **Dua sumber data brand:** `/brands` pakai `getBrandCards()`, Header/Footer pakai `getBrandNav()`. Fallback keduanya berbeda, jadi saat CMS down daftar bisa tidak sinkron.
4. **Field mati**: `world.categories` masih ada di schema tetapi tidak diproyeksikan dan tidak dibaca website. (`world.hours` sekarang sudah dirender; `event.slug` dan `event.featured` sudah dihapus dari schema sekaligus datanya.)
5. **Header preload gambar** (`Header.js`) hanya mencakup Samsara/Svarga/Acasa; Outpace/Grove tidak di-preload. Daftar gambarnya hardcoded dan menduplikasi galeri CMS.
6. **Watcher dev** (`instrumentation.js`) bisa menulis ke production saat `next dev` boot (lihat §11).
7. **Belum ada test otomatis maupun CI.** Verifikasi masih manual (`npm run lint` + `npm run build`). Yang sudah otomatis: uptime monitor 15 menit dan backup harian (lihat §11).

---

## 14. Checklist mengubah sesuatu

**Sebelum:**
- [ ] Tentukan: ini konten CMS atau kode hardcoded? (lihat §7)
- [ ] Kalau data: apakah ada di lebih dari satu tempat? (nomor WA, alamat)

**Saat mengubah kode:**
- [ ] Ubah file, `npm run lint` (0 error), `npm run build` (sukses)
- [ ] Pastikan tidak mengubah tampilan/konsistensi di luar yang diminta

**Saat mengubah CMS:**
- [ ] Pastikan `display` dan `phone` konsisten (WA)
- [ ] Pastikan `status`/`featured` sesuai maksud
- [ ] Jangan mengosongkan field yang fallback-nya tidak diinginkan

**Setelah:**
- [ ] Cek halaman terkait setelah ~1 menit (data) atau setelah deploy (kode)
- [ ] Untuk schema: `sanity deploy`

---

## 15. Daftar file penting

```
Versi Next.js/
  src/app/                     route per halaman (page.js)
    layout.js                  metadata global + JSON-LD Organization
    page.js                    homepage
    about|brands|career|contact|events/page.js
    samsara|svarga|acasa|outpace|grove/page.js   halaman brand hand-tuned
    [slug]/page.js             template brand CMS (brand baru)
    sitemap.js, robots.js, not-found.js, error.js
  src/sanity/lib/              client.ts, queries.ts (proyeksi GROQ), brands.ts, image.ts
  src/components/              Header, Footer, MobileMenu, BrandActions, HeroCarousel,
                               MenuSection, MenuGallery, BrandHours, LeafletMap, dll
  src/lib/site.js              SITE_URL, safeUrl, openGraphFor, CTA_LABELS
  src/proxy.js                 CSP nonce + headers (pengganti middleware)
  src/instrumentation.js       watcher dev → sync CMS
  public/                      gambar (ambiencesamsara, assetsvarga, assetacasa, menusamsara, dll)
  scripts/                     skrip sinkronisasi & utilitas

studio-sams-sams/
  schemaTypes/                 world, event, career, careerPage, contactInfo,
                               carouselImage, brandNav, index
  sanity.config.ts             konfigurasi Studio
  sanity.cli.ts                projectId, dataset, studioHost=samsaragroup
```
