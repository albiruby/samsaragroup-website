# Checklist Rilis — Samsara Group Website

Status per **14 November 2026**. Item yang sudah diverifikasi ditandai tanggal.

---

## A. Konten — harus beres sebelum diumumkan

| # | Item | Status | Catatan |
|---|---|---|---|
| A1 | Homepage, `/brands`, `/about`, `/contact` | ✅ | Lengkap |
| A2 | Samsara, Svarga, Acasa | ✅ | Tinggal jam buka |
| A3 | Grove & Outpace | ❌ | Menu placeholder, tanpa alamat/WA/logo/jam |
| A4 | `/career` | ❌ | 6 lowongan dummy; form lamaran meminta login Google |
| A5 | `/events` | ⚠️ | 0 event — jujur, tapi halaman kosong |
| A6 | Jam buka 5 brand | ❌ | `world.hours` kosong semua |
| A7 | Alamat & WA Grove/Outpace | ❌ | Tidak muncul di halaman maupun `/contact` |

**Keputusan yang diperlukan:** rilis bertahap (tahan Grove/Outpace/Career) atau tunggu materi lengkap.

---

## B. Teknis — sudah diverifikasi

| # | Item | Status | Bukti |
|---|---|---|---|
| B1 | Build produksi | ✅ 14/11 | `npm run build` sukses |
| B2 | Lint | ✅ 14/11 | 0 error, 20 warning `<img>` |
| B3 | Security regression test | ✅ 14/11 | `npm test` 5/5, jalan di CI |
| B4 | Smoke produksi | ✅ 14/11 | 74/74 |
| B5 | Audit dependensi produksi | ✅ 14/11 | `npm audit --omit=dev` → 0 |
| B6 | Lighthouse | ✅ 14/11 | Homepage, 4 brand, career, contact: a11y 100 · best-practices 100 · SEO 100 · 0 audit gagal |
| B7 | Redirect URL lama | ✅ 14/11 | 4 path lama → 308 ke path baru |
| B8 | Halaman 404 | ✅ 14/11 | Path acak → 404 |
| B9 | Tautan eksternal | ✅ 14/11 | 20/20 membalas 200 (kecuali form lamaran, lihat A4) |
| B10 | Sitemap | ✅ 14/11 | 11 URL, semuanya 200 |
| B11 | Backup pra-rilis | ✅ 14/11 | `production-2026-11-14_183859.tar.gz`, 28,7 MB, SHA-256 `a3db4c42…260c5`, 109 entri |
| B12 | Uji rollback produksi | ✅ 14/11 | 6ba68da → d3a6589 → 6ba68da, alias terverifikasi, situs 200 sepanjang proses |
| B13 | CI hijau | ✅ 14/11 | Lint, test, audit, build |

---

## C. Saat pindah domain

| # | Langkah | Catatan |
|---|---|---|
| C1 | Tentukan domain final | Saat ini `samsaragroup.vercel.app` |
| C2 | Ubah `NEXT_PUBLIC_SITE_URL` di Vercel | Menggerakkan canonical, `og:url`, sitemap, robots |
| C3 | Tambahkan domain di Vercel + DNS | Ikuti `Migrasi-Hostinger.md` |
| C4 | Ubah default `BASE` di `scripts/smoke.mjs` dan `uptime.yml` | Kalau tidak, monitor menembak domain lama |
| C5 | Deploy + `npm run smoke` | Harus 74/74 |
| C6 | Cek ulang sitemap dan `robots.txt` | Keduanya harus menyebut domain baru |
| C7 | Ajukan ulang ke Google Search Console | Properti baru + sitemap |

---

## D. Setelah rilis

| # | Item | Frekuensi |
|---|---|---|
| D1 | Cek issue GitHub (smoke/uptime) | Harian |
| D2 | Backup dataset | Saat konten berubah besar / bulanan |
| D3 | Cek tautan eksternal | Bulanan |
| D4 | Review `npm audit` | Saat dependency berubah |
| D5 | Restore drill | 3–6 bulan |
| D6 | Uji rollback | Sudah diuji sekali (14/11) — ulangi setelah perubahan besar |

---

## E. Yang belum ada

| Item | Dampak | Pemilik |
|---|---|---|
| Domain sendiri | Alamat situs masih domain Vercel | Pemilik |
| Privacy policy | Kebutuhan legal | Pemilik |
| `/.well-known/security.txt` | Jalur pelaporan celah | Pemilik (butuh email) |
| ACL folder Drive terverifikasi | N-02 audit | Pemilik |
| `client_id` rclone sendiri | H-11, shared client akan berhenti | Pemilik |
| Uji pencabutan aset CDN | N-01 audit | Butuh staging |
