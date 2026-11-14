# Panduan Pemeliharaan — Samsara Group

Dokumen ini untuk siapa pun yang mengubah konten, kode, atau CMS website Samsara Group.
Ditulis berdasarkan kondisi repo per **14 November 2026**. Untuk gambaran arsitektur yang lengkap, lihat `DOCUMENTATIONS.md` — dokumen ini fokus ke operasional sehari-hari.

Dokumen ini ada di `website\docs\`, jadi **ikut version control** bersama kode website.

---

## 0. TL;DR — aturan yang paling sering bikin bingung

1. **Dua lapis konten, tetapi halaman brand kini sepenuhnya CMS.** Konten brand (logo, tagline, intro, menu, peta, alamat, WhatsApp) diubah dari Studio. Teks cadangan hanya dipakai kalau CMS mati.
2. **CMS menang hanya kalau ada isinya.** Pola kode selalu `nilaiCMS || "teks lama"`. Mengosongkan field di CMS akan memunculkan kembali teks cadangan, bukan menghilangkannya.
3. **Kelima halaman brand memakai satu renderer (`BrandPageView`)**, dengan layout dua kolom. Brand baru tetap memakai template `[slug]` (layout bertumpuk).
4. **Perubahan konten CMS muncul ~1 menit** (`revalidate: 60`). **Perubahan kode** butuh push → Vercel deploy (~1–3 menit).
5. **Mengubah field/schema di Studio butuh `sanity deploy`.** Mengubah isi dokumen tidak.

---

## 1. Peta sistem

| Bagian | Lokasi | Git remote | Hosting |
|---|---|---|---|
| Website | `D:\Project Website Samsara Group\website` | `github.com/albiruby/samsaragroup-website` (`master`) | Vercel, auto-deploy tiap push ke `master` |
| Studio (CMS) | `D:\Project Website Samsara Group\studio` | `github.com/albiruby/samsaragroup-sanity` (`master`) | Sanity hosting: https://samsaragroup.sanity.studio/ — produksi `/production`, staging `/staging` |
| Dokumentasi | `website\docs\` | ikut repo website | `DOCUMENTATIONS.md`, `Sanity CMS Tutorial.md`, `Migrasi-Hostinger.md`, `Overall Codebase Security Audit.md` |

- **Domain produksi website (sementara):** https://samsaragroup.vercel.app
  > ⚠️ `samsaragroup.com` **BUKAN milik kita.** Domain itu dipegang pihak lain (GoDaddy, WordPress perusahaan pelayaran India). Jangan pernah menaruhnya di `NEXT_PUBLIC_SITE_URL` — canonical, `og:url`, sitemap, dan robots kita akan menunjuk ke situs mereka.
- **Sanity project:** `p5zu5azj` · **dataset:** `production`
- **Stack website:** Next.js 16 (App Router, Turbopack), React 19, Tailwind v4.
- **Studio lokal:** `npm run dev` di repo `studio` (port 3333).

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
| Gambar baru di `website/public/**` | Setelah push → Vercel build | Ya, push ke `master` |

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

**Tidak ada lagi jebakan di sini.** Gate `status`/`featured` berlaku di template `[slug]` dan di kelima halaman brand mapan; sejak 14/11 keduanya memakai jalur yang sama (`BrandPageView`). Jadi brand yang di-`archived` atau `featured: false`:

- menghilang dari `/brands`, dropdown nav, footer, dan sitemap;
- URL-nya juga berhenti melayani halaman (404).

---

## 6. Referensi dokumen & field CMS

Ringkas. "Dibaca web" = kode website benar-benar memakai field itu.

### `world` — satu dokumen per brand
Field yang **dibaca** (paling relevan):
- `name`, `slug`, `tagline`, `description`, `image`, `gallery`, `logo`
- `specifications` (tabel label/value)
- `sections` (blok konten: text / specs / features / menu / map) — dibaca kelima halaman brand **dan** template `[slug]`
- `ctas[]` (`kind`, `label`, `url`) — tombol aksi
- `instagramUrl` — tombol Instagram
- `whatsapp` — nomor yang ditampilkan di blok FIND US halaman brand
- `address`, `heroEyebrow`, `heroTitle`, `heroIntro`, `menuHeading`
- `speciality`, `order`, `status`, `featured`, `theme`, `noIndex`
- `seoTitle`, `seoDescription`, `socialImage`
- `hours` — baris `{label, value}` **per kategori** (mis. `Weekdays` / `Weekend`), bukan per hari. Dirender `BrandHours` di blok FIND US kelima halaman brand, dan di section peta `[slug]`. Kosong = blok jam tidak muncul sama sekali.
- `categories` — **tidak dibaca di mana pun** (warisan; sekarang didefinisikan di schema agar tidak error)
- `menuPanels` — hanya di dalam `sections[]`; satu panel = satu halaman menu

### `career`
`title`, `slug`, `department`, `brand`, `location`, `employmentType`, `summary`, `description`, `requirements[]`, `applyUrl`, `isUrgent`, `status` (=`active` yang tampil), `order`, `postedAt` (kosong = tanggal hari ini).

### `careerPage`
`eyebrow`, `title`, `intro`, `theme`, `showBrandStrip`, `positionsHeading`, `emptyHeadline`, `emptyMessage`, `applyUrl` (form default), `applyNote`, `seoTitle`, `seoDescription`.

### `event`
`title`, `slug`, `category`, `date`, `time`, `location`, `capacity`, `entry`, `description`, `image`, `link`, `featured` (tidak dipakai web).

### `contactInfo`
`whatsapp[]` (`label`, `city`, `display`, `phone`), `addresses[]` (`label`, `address`), `hours`.
> `display` = yang ditampilkan; `phone` = yang benar-benar di-dial (`https://wa.me/<phone>`). **Keduanya harus konsisten.** Nilai yang berlaku selalu dibaca dari Studio → **Contact Info**; jangan diduplikasi ke dokumen ini. Contoh format (bukan nomor asli): `+62 812-3456-7890` / `6281234567890`.

### `carouselImage`
`placement` (`home` = marquee homepage), `title`, `image`, `alt`, `brand`, `order`, `active`.

### `brandNav`
`rows[]` (tiap baris punya `title` + `brands[]`), `seeAllLabel`, `emptyLabel`. Mengatur pengelompokan dropdown BRANDS. Kalau dokumen ini kosong, baris diturunkan otomatis dari `tagline` tiap brand.

---

## 7. Per-halaman: apa yang CMS vs hardcoded

### Home `/`
- Hero image: **hardcoded** (`/ASSETS-SAMSARA/ambience/DSC08930.webp`).
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
Semua memakai `BrandPageView`. Sumber tiap bagian:

| Bagian | Sumber | Kalau CMS kosong |
|---|---|---|
| Eyebrow hero | `heroEyebrow` | `BRANDS` |
| Judul hero | `logo` | file lokal (Samsara/Svarga/Acasa) atau nama sebagai teks (Grove/Outpace) |
| Paragraf hero | `tagline` | cadangan `src/lib/brand-pages.js` |
| Hero carousel | `gallery[]` | 4 foto lokal per brand |
| Paragraf pembuka | `sections[type=text].body` | cadangan `brand-pages.js` |
| Judul + isi tabel | `sections[type=specs]` (heading + specifications) | `AT A GLANCE` / `GOOD TO KNOW` / `OFFERINGS` / `SPECIFICATIONS` |
| Kartu fitur | `sections[type=features]` | tidak dirender (hanya Outpace) |
| Foto kolom kanan | `image` | file lokal |
| Tombol aksi | `ctas` + `instagramUrl` | `actions` di `brand-pages.js` (Acasa: padel/receptionist/roomrate) |
| Menu | `sections[type=menu].menuPanels[]` | placeholder "Menu coming soon" untuk Grove/Outpace |
| Peta FIND US | `sections[type=map]` | `coords` di `brand-pages.js` |
| Teks FIND US | `address` + `whatsapp` + `tagline` | baris disembunyikan kalau kosong |
| Jam buka | `hours` | blok tidak dirender |

Menu: **1** panel = gambar tunggal di tengah, **2** panel = kiri–kanan, **3+** = page turner.

### Template `[slug]` (brand baru)
Membaca dokumen `world` sepenuhnya: `sections`, `gallery`, `menuPanels`, `ctas`, `mapLat/Lng/Zoom`, `address`, `instagramUrl`, `theme`, `noIndex`. Ini yang membuat brand baru otomatis punya halaman.

---

## 8. Cookbook — tugas umum

### A. Ganti nomor WhatsApp
1. **Halaman Contact** → Studio → **Contact Info** → ubah `display` dan `phone` (`display` boleh pakai `+` dan garis; `phone` hanya angka, mulai `62`). Contoh format (bukan nomor asli): `+62 812-3456-7890` / `6281234567890`.
2. **Halaman brand** → dokumen brand → tab **7 - Contact & Links** → **WhatsApp Number**.
> Dua tempat: `contactInfo` untuk halaman Contact, `world.whatsapp` untuk blok FIND US. Tidak ada nomor di kode.

### B. Ubah alamat
- Studio → **Contact Info** → `addresses[]` untuk halaman Contact.
- Halaman brand: `world.address`. Kosong → baris alamat tidak ditampilkan.

### C. Tambah / ubah event
- Studio → **Events** → dokumen `event`. Muncul di `/events` dalam ~1 menit.
- `link` = tombol/kartu clickable. `featured` tidak dipakai web.

### D. Tambah lowongan
- Studio → **Careers** → dokumen `career`, `status = active`. Urut mengikuti `order`.
- `postedAt` kosong → tampil tanggal hari ini.
- **Catatan:** dulu ada `scripts/seed-careers.mjs clear` yang menghapus semua lowongan sekaligus. Skrip itu **sudah dihapus** — sekarang lowongan hanya dikelola dari Studio.

### E. Ubah teks halaman About / Vision / Philosophy
- **Hardcoded** di `src/app/about/page.js`. Ubah kode → push.

### F. Ganti gambar hero brand
- **Studio** → **Brands & Brand Pages — World** → dokumen brand → field **Gallery**. Urutan gambar mengikuti urutan di Studio.
- Kalau galeri kosong atau CMS tidak bisa dihubungi, halaman jatuh ke foto lokal yang terdaftar di `src/lib/brand-pages.js`.

### G. Ganti menu brand
- Studio → dokumen brand → tab **4 - Sections** → section **Menu** → tambah/ganti panel.
- Satu panel = satu halaman. 1 halaman tampil tunggal, 2 kiri–kanan, 3+ jadi page turner.
- Grove & Outpace belum punya panel; selama kosong halaman menampilkan placeholder "Menu coming soon".

### H. Ubah foto kolom kanan brand
- Studio → dokumen brand → field **Image** (rasio ideal 4:5).
- Dulu Acasa memakai file lokal `open-hour-acasa.webp`; sekarang kelimanya lewat CMS dan berkas itu hanya disimpan sebagai aset sumber.

### I. Ganti koordinat peta
- Studio → dokumen brand → tab **4 - Sections** → section **Map** → `mapLat`, `mapLng`, `mapZoom`.
- Kelima brand sudah punya section ini; tidak ada lagi koordinat di kode.

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
1. `git add` + `git commit` + `git push origin master` dari repo `website`.
2. Vercel otomatis build & deploy. Cek di dashboard Vercel bila perlu.
3. Sebelum commit, jalankan `npm run lint` dan `npm run build` lokal (harus 0 error).

### Kalau deploy gagal dalam hitungan detik

**Build normal butuh ~40–60 detik.** Kalau gagalnya 3 detik dan log hanya 7 baris, build **tidak pernah mulai** — yang gagal adalah langkah "ignore build" dari `vercel.json`, bukan kodemu.

Pesan `fatal: bad object <sha>` berarti `ignoreCommand` mencari commit yang sudah tidak ada — biasanya terjadi setelah riwayat repo ditulis ulang. Perbaikannya ada di `scripts/should-build.mjs`: guard `git cat-file -e` memilih **BUILD** kalau SHA hilang. Lihat `DOCUMENTATIONS.md` §12.1/§15.

Cara cepat memastikan kodenya sehat: `npm run build` di lokal. Kalau exit 0, masalahnya di Vercel, bukan di repo.

### Studio
- **Ubah konten/dokumen:** tidak perlu apa-apa, langsung tersimpan & tersinkron.
- **Ubah schema (field baru, dll.):** dari repo `studio`, `npm run deploy` (SCL: `sanity deploy`). Ini meng-upload schema ke https://samsaragroup.sanity.studio/ (kedua workspace).
- Studio lokal untuk pratinjau: `npm run dev` (port 3333).

---

## 10. Menambah brand baru

1. Pastikan tidak memakai slug yang sudah dipakai salah satu route statis: **`samsara`, `svarga`, `acasa`, `outpace`, `grove`**. Kalau memakai itu, halaman statis lama yang muncul, bukan template baru.
2. Studio → buat dokumen **World** baru: isi `name`, `slug`, `tagline`, `image` (wajib), `status = active`, `featured = true`, `order`.
3. Isi `gallery` (hero carousel), `sections` (opsional), `ctas`, `instagramUrl`, `address`, `seo*`.
4. Dalam ~1 menit brand otomatis muncul di `/brands`, footer, dropdown nav, sitemap, dan punya halaman `/<slug>`.
5. **Tidak perlu deploy kode.** Semua bagian brand baru dilayani template `[slug]`.

---

## 11. Script yang tersedia

Di repo website (`scripts/`):

| Script | Fungsi | Risiko |
|---|---|---|
| `should-build.mjs` | gate Vercel: exit 0 = skip build, exit 1 = build | baca git; dipanggil Vercel, bukan npm |
| `smoke.mjs` | uji cepat 74 produksi / 75 preview; manual + harian CI | baca saja |
| `backup-and-upload.ps1` *(repo studio)* | ekspor dataset → simpan 14 lokal → unggah ke Google Drive → simpan 7 | menulis ke Drive, ukuran + MD5 diverifikasi bila tersedia |

> Lima skrip lain yang dulu tercatat di sini (`sync-cms-to-site.mjs`, `seed-careers.mjs`, `audit-schema.mjs`, `sync-sections-extract.mjs`, `security-scan.mjs`) **sudah dihapus** di commit `2035c86`. `sync-hardcode-to-cms.mjs` **dihapus 25/10**.

**Catatan:** tidak ada watcher atau skrip sync. `sync-hardcode-to-cms.mjs` **dihapus 25/10**; Studio adalah sumber kebenaran, dan tidak ada jalur kode → CMS.

### Backup & monitoring

| Alat | Fungsi | Lokasi |
|---|---|---|
| `backup-and-upload.ps1` | ekspor dataset `production` (dokumen + aset, ±28,6 MB) → simpan 14 lokal → unggah ke Google Drive → simpan 7 di Drive | repo **studio**, `scripts/` |
| `backup-dataset.ps1` | hanya bagian lokalnya: ekspor + simpan 14 terbaru, tanpa unggah | repo **studio**, `scripts/` |
| remote rclone `samsara-drive` | tujuan unggahan, dikunci `root_folder_id` ke satu folder Drive saja | `%APPDATA%\rclone\rclone.conf` |

> **Catatan 4 November 2026.** `root_folder_id` sudah benar (satu folder khusus), tetapi OAuth token rclone memakai `scope = drive` (akses seluruh Drive, bukan hanya folder itu). Kalau token bocor, cakupannya lebih luas dari yang dibutuhkan. Buat OAuth client sendiri dengan scope `drive.file` saat memperbarui config. Arsip pra-pembersihan 18 Oktober sudah dihapus; folder lokal dan Drive kini hanya berisi arsip pasca-pembersihan.
| `.github/workflows/ci.yml` | setiap push/PR: `npm ci`, lint, audit produksi, build | repo website |
| `.github/workflows/smoke.yml` | harian 08:00 WIB: `npm run smoke`; gagal → issue (email), pulih → issue ditutup | repo website |
| `.github/workflows/uptime.yml` | tiap **15 menit** baca `sitemap.xml`, cek semua URL + `robots.txt`; gagal → issue (email), pulih → issue ditutup | repo website |

> **Backup dijalankan atas permintaan, bukan terjadwal.** Tugas Windows Task Scheduler `Samsara - Sanity Backup` **sengaja dimatikan** (19/10). Cukup minta "backup" kapan saja — tidak perlu commit atau push.

> **Restore drill (24/10/2026):** arsip `production-2026-10-19_1418.tar.gz` diimpor ke `staging` dengan `--replace` → 28 dokumen, 53,2 detik; counts sama dengan production; smoke preview 75/75. Staging kembali menjadi salinan production.

> **Daftar lengkap apa yang masih kurang** (isi, teknis, dan yang sengaja dibiarkan) ada di `DOCUMENTATIONS.md` **§21**.

> **Serah terima:** checklist akun, kalender perawatan, dan risiko yang masih terbuka ada di `HANDOVER.md`.

> Backup **tidak boleh** di-commit. Repo website publik, dan arsipnya memuat seluruh database konten.

### Uji cepat setelah deploy

```powershell
npm run smoke                                                  # uji situs produksi
$env:SMOKE_BASE_URL="http://localhost:3000"; npm run smoke     # uji server lokal (production)
$env:SMOKE_PREVIEW="1"; $env:SMOKE_BASE_URL="http://localhost:3000"; $env:NEXT_PUBLIC_SANITY_DATASET="staging"; npm run smoke  # staging
```

74 pemeriksaan produksi / **75** di preview: semua route membalas 200, tiap halaman punya tepat satu `<h1>` + title + meta description + canonical, header keamanan terkirim, **sitemap memuat semua URL publik (9 saat ini; otomatis mengikuti brand `noIndex`)** semuanya hidup, dan **jumlah elemen di halaman dicocokkan dengan isi Sanity** (kartu brand, elemen marquee, kartu lowongan). Mode preview menambah cek `X-Robots-Tag` dan aturan robots.

Baris terakhir itu yang paling penting: halaman yang diam-diam jatuh ke teks hardcoded karena sambungan CMS-nya putus **tetap membalas 200**, jadi pemeriksaan status saja tidak akan menangkapnya.

Tidak butuh token — dataset Sanity publik untuk dibaca.

### Staging (preview)

- Dataset `staging` adalah salinan `production` (public); Vercel **Preview** memakai `NEXT_PUBLIC_SANITY_DATASET=staging`. Production/Development tetap `production`.
- Studio: **Samsara Group** di `/production`; **Samsara Group (Staging)** di `/staging`.
- Preview mengirim `X-Robots-Tag: noindex, nofollow` dan `robots.txt` `Disallow: /`.
- Refresh staging: export/import, karena `datasets copy` diblokir plan — lihat `DOCUMENTATIONS.md` §12.2.
- Jangan unggah dokumen pribadi: staging publik.

**Checklist aman sebelum menjalankan script yang menulis:**
- Pastikan `NEXT_PUBLIC_SANITY_DATASET` bukan `production`, **atau** backup dulu.
- Tidak ada skrip yang menulis ke CMS; perubahan konten hanya lewat Studio.
- Baca ulang peringatan di script.

---

## 12. Variabel lingkungan

File `.env.local` di repo website (tidak ter-commit):

| Variabel | Isi |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `p5zu5azj` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` (Vercel Preview: `staging` — §11) |
| `NEXT_PUBLIC_SITE_URL` | `https://samsaragroup.vercel.app` (default di `src/lib/site.js`) |

> Catatan: tidak ada token di `.env.local` maupun `.env.example`; keduanya hanya berisi project ID, dataset, dan URL situs. Di Vercel, dataset punya dua record: Production/Development = `production`, Preview = `staging`.

---

## 13. Masalah yang diketahui / utang teknis

1. ~~**Halaman hand-tuned tidak menegakkan `status`/`featured`.**~~ **Selesai** — kelima halaman brand kini memakai `BrandPageView` dengan gate yang sama seperti `[slug]`.
2. **Nomor telepon ada di dua dokumen CMS** (`contactInfo.whatsapp[]` untuk halaman Contact, `world.whatsapp` untuk FIND US) ditambah fallback kode. Satu perubahan menyentuh dua tempat di Studio.
3. **Dua sumber data brand:** `/brands` pakai `getBrandCards()`, Header/Footer pakai `getBrandNav()`. Fallback keduanya berbeda, jadi saat CMS down daftar bisa tidak sinkron.
4. ~~**Field mati**: `world.categories` masih ada di schema.~~ **Sudah dihapus 19/10** — bersama `sections[].image`, `sections[].features[].image`, dan `world.menuPanels`. Keempatnya tidak pernah dibaca website. **Per 14/11 tidak ada lagi field mati di halaman brand**: `hours`, `address`, `logo`, `sections[*]`, dan `whatsapp` semuanya dirender.
5. **Header preload gambar** (`Header.js`) hanya mencakup Samsara/Svarga/Acasa; Outpace/Grove tidak di-preload. Daftar gambarnya hardcoded dan menduplikasi galeri CMS.
6. ~~**Watcher dev** (`instrumentation.js`) bisa menulis ke production saat `next dev` boot.~~ **22/10 watcher-nya dihapus; 25/10 `sync-hardcode-to-cms.mjs` dihapus.** Tidak ada lagi jalur kode → CMS. (lihat §11).
7. ~~**Belum ada test otomatis yang berjalan di CI.**~~ **Selesai 24/10** — `ci.yml` menjalankan lint, audit produksi, dan build; `smoke.yml` harian; `uptime.yml` membaca sitemap. **`npm run smoke`** tetap bisa manual (74 produksi / 75 preview). Backup **tidak lagi terjadwal** — dijalankan atas permintaan.
8. **Dataset `staging` publik.** Jangan unggah dokumen pribadi/draft sensitif ke sana; siapa pun yang tahu project + dataset bisa membacanya.
9. **Rollback:** runbook ada di `docs/ROLLBACK.md` (24/10), tetapi **belum pernah diuji di production**. Uji pertama harus dijadwalkan.

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
website/
  src/app/                     route per halaman (page.js)
    layout.js                  metadata global + JSON-LD Organization
    page.js                    homepage
    about|brands|career|contact|events/page.js
    samsara|svarga|acasa|outpace|grove/page.js   route tipis → BrandPageView
    [slug]/page.js             template brand CMS (brand baru)
    sitemap.js, robots.js, not-found.js, error.js
  src/sanity/lib/              client.ts, queries.ts (proyeksi GROQ), brands.ts, image.ts
  src/components/              Header, Footer, MobileMenu, BrandPageView, BrandActions,
                               HeroCarousel, MenuGallery, BrandHours, LeafletMap, dll
  src/lib/site.js              SITE_URL, safeUrl, openGraphFor, CTA_LABELS
  src/lib/brand-pages.js       cadangan teks/foto/koordinat halaman brand
  src/lib/brand-page.js        loadBrand() + brandMetadata()
  src/proxy.js                 CSP nonce + headers (pengganti middleware)
  public/                      gambar lokal — ASSETS-SAMSARA/{ambience,logo,menu},
                               ASSETS-SVARGA, ASSETS-ACASA (lihat DOCUMENTATIONS §2.2a)
  scripts/                     skrip sinkronisasi & utilitas

studio/
  schemaTypes/                 world, event, career, careerPage, contactInfo,
                               carouselImage, brandNav, index
  sanity.config.ts             konfigurasi Studio
  sanity.cli.ts                projectId, dataset, studioHost=samsaragroup
```
