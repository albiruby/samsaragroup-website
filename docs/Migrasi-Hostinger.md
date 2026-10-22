# Migrasi Samsara Group: Vercel → Hostinger

> ⚠️ **BACA DULU — domain di dokumen ini salah.**
> Tutorial ini ditulis dengan asumsi `samsaragroup.com` milik kita. **Ternyata bukan.**
> Domain itu dipegang pihak lain (registrar GoDaddy, NS `domaincontrol.com`) dan
> menyajikan WordPress milik perusahaan pelayaran India — cek sendiri
> `https://samsaragroup.com`. Domain kita saat ini **https://samsaragroup.vercel.app**.
>
> Karena itu: **jangan** mengisi `NEXT_PUBLIC_SITE_URL` dengan `samsaragroup.com`,
> dan **jangan** mengarahkan DNS domain itu ke Hostinger. Kalau mengikuti bagian 6.2
> apa adanya, canonical, `og:url`, `og:image`, `sitemap.xml`, dan `robots.txt` kita
> akan menunjuk ke website orang lain.
>
> Bagian di bawah tetap berguna sebagai catatan **mekanisme** migrasi ke Node hosting,
> tapi ganti dulu domainnya dengan domain yang benar-benar kita miliki.
>
> **STATUS: TIDAK dijalankan.** Situs masih di Vercel dan tidak ada rencana
> perpindahan yang berjalan. Dokumen ini disimpan sebagai referensi kalau nanti
> perlu pindah ke Node hosting.

Tutorial ini menjelaskan mekanisme deploy, publish, dan rollback untuk memindahkan
website Samsara Group dari Vercel ke Hostinger, berdasarkan kondisi kode repo
`albiruby/samsaragroup-website` saat commit `a3b6115`.

---

## 1. Kenapa website ini tidak bisa dipindah ke shared hosting biasa

Migrasi ini bukan sekadar "upload file". Tiga hal di kode ini mengunci website
ke Node.js runtime:

| Kebutuhan | Lokasi di kode | Kenapa wajib |
|---|---|---|
| Server-side rendering per request | `export const dynamic = "force-dynamic"` di `src/app/layout.js:16` dan 10 route brand | Konten diambil dari Sanity saat request, bukan saat build |
| Middleware dengan CSP nonce | `src/proxy.js` | Header `Content-Security-Policy` dibuat runtime dengan nonce unik per request |
| Sanity fetch server-side | `src/sanity/lib/queries.ts` | Dipanggil dari server component, butuh Node |

Akibatnya: **shared hosting LiteSpeed biasa tidak bisa.** Tidak ada Node runtime,
jadi `force-dynamic` gagal dan CSP nonce tidak bisa dibuat. Website harus jalan
di `next start`.

 luckily ada cara yang jauh lebih mudah dari VPS manual — lihat bagian 2.

---

## 2. Pilih produk Hostinger yang tepat

Hostinger punya dua jalur. Jangan salah pilih.

### 2.1 Managed Node.js Hosting (disarankan)

Ada Node runtime bawaan, Hostinger yang kelola OS, Node version, dan process
supervisor. Redeploy cukup klik di panel.

Paket yang mendukung: **Business Web Hosting**, atau **Cloud Startup /
Professional / Enterprise / Enterprise Plus**.

Node.js yang didukung: 18, 20, 22, 24. Website ini jalan di Node 24.15.0 lokal.

### 2.2 Cloud VPS (alternatif)

Anda yang install Node, PM2, Nginx, dan TLS sendiri. Lebih murah per GB, tapi
setiap reboot, update keamanan, dan scaling jadi tanggung jawab Anda. Untuk
website korporat yang harus selalu online, Managed Node.js lebih aman.

### 2.3 Bukan pilihan: shared hosting tanpa Node

Upload file ke `public_html` dan upload `.next` sebagai file statis **tidak
akan bekerja** untuk website ini.

---

## 3. Mekanisme deploy

Berbeda dari Vercel yang stateless, Hostinger menjalankan proses Node di server
yang sama. Satu instance, satu proses aktif.

### 3.1 Alur otomatis (setelah repo terhubung)

```
git push ke master
        │
        ▼
webhook GitHub → Hostinger
        │
        ▼
1. git pull commit terbaru
2. npm ci              (pakai package-lock.json)
3. npm run build       (next build → .next/)
4. npm run start       (next start, proses di-restart)
        │
        ▼
situs live dengan kode baru
```

Yang berbeda dari Vercel:

- **Tidak ada preview URL per branch.** Satu branch = satu situs live. Kalau
  mau preview, deploy branch itu sebagai app Node.js terpisah di subdomain
  sendiri.
- **Tidak ada atomic rollback dari dashboard.** Kalau deploy broke, Anda revert
  commit lalu push lagi (lihat bagian 8).
- **Ngilu downtime.** Saat proses restart ada jeda 1–5 detik. Untuk alleviate,
  jalankan 2 instance di belakang load balancer.

### 3.2 Deploy manual (untuk debugging)

Kalau deploy dari GitHub gagal dan perlu lihat output langsung:

```bash
# 1. SSH ke VPS/Cloud Anda
ssh user@server-ip

# 2. Masuk ke direktori app
cd ~/domains/samsaragroup.com

# 3. Pull dan build dengan melihat langsung output
git pull origin master
npm ci
npm run build

# 4. Kalau hosting pakai PM2, restart
pm2 restart samsaragroup
pm2 logs samsaragroup --lines 50
```

---

## 4. Konfigurasi deploy di hPanel

Saat pertama kali membuat app di **Websites → Add Website → Node.js web app →
Import Git repository**, Hostinger akan auto-detect. Konfirmasi atau koreksi:

| Field | Value | Catatan |
|---|---|---|
| Framework preset | Next.js | Auto-detect dari `package.json` |
| Branch | `master` | Branch yang memicu build |
| Node.js version | **24** | Sesuai `node -v` lokal (24.15.0) |
| Root directory | repo root | `package.json` ada di root |
| Install command | `npm ci` | Lebih deterministik dari `npm install` karena ada `package-lock.json` |
| Build command | `npm run build` | Sudah ada di `scripts` |
| Output directory | `.next` | Wajib untuk Next.js |
| Start command | `npm run start -- -p $PORT` | `$PORT` di-inject Hostinger, jangan hardcode 3000 |

> Penting: kolom entry file boleh dikosongkan untuk Next.js karena start command
> sudah menjalankan `next start`.

---

## 5. Environment variable

`.env.local` ada di `.gitignore` (baris 34), jadi **tidak ikut ke GitHub**.
Semua nilai harus diisi manual di panel Hostinger.

### 5.1 Daftar variable

| Variable | Secret? | Nilai | Sumber |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | tidak | domain final tanpa trailing slash | Anda pilih |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | tidak | `p5zu5azj` | Sanity project |
| `NEXT_PUBLIC_SANITY_DATASET` | tidak | `production` | Sanity dataset |

### 5.2 Kenapa `NEXT_PUBLIC_SITE_URL` wajib diisi benar

Semua URL di website diturunkan dari satu variabel ini di `src/lib/site.js:1`:

```js
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://samsaragroup.vercel.app"
).replace(/\/+$/, "");
```

Variabel ini menggerakkan `canonical`, `og:url`, `sitemap.xml`, dan `robots.txt`.
Kalau salah diisi, effects-nya:

- Search engine mengindeks URL Vercel yang sudah mati
- Link OG di WhatsApp/Twitter mengarah ke domain lama
- `sitemap.xml` mendaftarkan domain yang salah

Default di kode masih `https://samsaragroup.vercel.app`, jadi variabel ini
**wajib** diisi — bukan opsional.

### 5.3 Cara mengisi di panel

1. Buka app Node.js Anda di hPanel
2. Section **Environment variables**
3. Tambahkan setiap `key` dan `value` satu per satu
4. Centang untuk Production (dan Preview/Staging bila ada)
5. Save, lalu **restart** app supaya variabel terbaca

Situs ini tidak membutuhkan token Sanity: semua query berjalan server-side ke dataset publik, dan skrip sinkronisasi hanya membaca. Jangan menaruh token di `.env.example` atau commit apa pun.

---

## 6. Domain dan SSL

### 6.1 Urutan yang aman

Jangan disables SSL sebelum semuanya siap, karena `next.config.mjs:19` mengirim:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

`max-age` 2 tahun + `preload` berarti browser akan **mengcache** bahwa domain
Anda hanya boleh diakses via HTTPS. Kalau HSTS aktif lalu Anda masih
mengakses via HTTP, browser akan menolak sebelum hitting server.

### 6.2 Langkah domain

1. Deploy dulu ke URL subdomain Hostinger (mis. samsaragroup.hostingerapp.com)
2. Pastikan semua route berfungsi di URL itu
3. Isi NEXT_PUBLIC_SITE_URL dengan domain final
4. Redeploy (build ulang — env var dibaca saat build untuk NEXT_PUBLIC_*)
5. Aktifkan SSL di hPanel
6. Arahkan DNS domain ke Hostinger
7. Tunggu propagasi (biasanya < 1 jam, kadang sampai 24 jam)
8. Verifikasi HSTS preload di https://hstspreload.org
```

### 6.3 Penting: rebuild, bukan restart

`NEXT_PUBLIC_*` di-inline ke bundle JavaScript **saat build**. Kalau Anda hanya
restart aplikasi, nilai lamanya masih ter-cache di `.next/`. Harus:

```bash
npm run build && npm run start
```

di panel: klik **Rebuild** atau **Redeploy**, bukan hanya **Restart**.

---

## 7. Perubahan kode yang wajib dilakukan

### 7.1 Buang dependensi Vercel

`src/app/layout.js:13-14`:

```js
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
```

Kedua komponen ini mengirim data ke endpoint telemetry Vercel. Di luar Vercel,
script-nya tidak dikirim ke browser — jadi tidak error, tapi **tidak ada data
analytics sama sekali**. Untuk statistik traffic Anda perlu ganti ke tool yang
hosting-agnostic (misal Plausible atau Umami self-hosted).

 partake di layout, hapus kedua import plus elemen JSX-nya, lalu:

```bash
npm uninstall @vercel/analytics @vercel/speed-insights
```

### 7.2 Perbarui `.env.example`

File sekarang punya dua masalah: karakter mojibake di baris komentar, dan
komentar yang menyebut default lama `https://sams-sams.vercel.app` padahal kode
sudah `samsaragroup.vercel.app`. Rapikan saat migrasi supaya tidak membingungkan.

### 7.3 Yang TIDAK perlu diubah

- `proxy.js` — middleware Next.js 16 jalan di Node runtime biasa, tidak perlu
  Vercel Edge Functions
- `next.config.mjs` — `headers()` dan `remotePatterns` portable
- `@sanity/client`, `leaflet`, Tailwind — semua framework-agnostic

---

## 8. Rollback

Karena tidak ada preview URL, rollback berarti kembalikan commit:

```bash
# 1. Cari commit sebelum deploy yang rusak
git log --oneline -10

# 2. Kembalikan
git revert <commit-hash>

# 3. Push — Hostinger auto-rebuild
git push origin master
```

Alternatif tanpa revert commit (memindahkan branch pointer, jangan dipakai di
branch yang sudah di-share):

```bash
git reset --hard <commit-hash>
git push --force origin master   # ⚠️ destruktif
```

Untuk&utmra sering, bersihkan juga cache build di hPanel sebelum rebuild —
lighthouse cache bisa menahan `.next/` lama.

---

## 9. Checklist migrasi

### Sebelum deploy
- [ ] `npm run build` sukses di lokal
- [ ] `npm run start` jalan tanpa error di lokal
- [ ] Paket Hostinger mendukung Node.js apps (bukan shared hosting biasa)
- [ ] Repo `albiruby/samsaragroup-website` ada di GitHub dan bisa diakses
- [ ] Node version di panel diset ke **24**

### Saat setup
- [ ] Import repo, framework ter-detect sebagai Next.js
- [ ] Install `npm ci`, Build `npm run build`, Start `npm run start -- -p $PORT`
- [ ] Output directory `.next`
- [ ] Deploy pertama sukses

### Environment
- [ ] `NEXT_PUBLIC_SITE_URL` = domain final
- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID` = `p5zu5azj`
- [ ] `NEXT_PUBLIC_SANITY_DATASET` = `production`
- [ ] App di-restart/rebuild setelah env var diisi

### Kode
- [ ] `@vercel/analytics` + `@vercel/speed-insights` dihapus
- [ ] `.env.example` dibersihkan
- [ ] `npm run build` masih sukses setelah perubahan

### Verifikasi setelah live
- [ ] Semua 11 route return 200
- [ ] `canonical` + `og:url` pakai domain baru
- [ ] `sitemap.xml` mendaftarkan domain baru
- [ ] `robots.txt` menunjuk sitemap di domain baru
- [ ] Sanity CMS masih bisa diedit, dan perubahan muncul tanpa deploy ulang
- [ ] SSL aktif, HSTS preload terdaftar di hstspreload.org
- [ ] Peta Leaflet (Samsara/Svarga/Acasa) muncul dan bisa digeser
- [ ] Logo marquee di footer termuat
- [ ] Tidak ada error CORS atau CSP di console browser

### Setelah switch
- [ ] DNS propagasi selesai, domain lama masih redirect ke yang baru (opsional)
- [ ] Hapus deployment Vercel setelah 1 minggu stabil
- [ ] `samsaragroup.vercel.app` tidak lagi dipakai di mana pun

---

## 10. Perbandingan cepat

| Aspek | Vercel | Hostinger Managed Node.js |
|---|---|---|
| Deploy | `git push` | `git push` (webhook sama) |
| Preview per branch | Ya, otomatis | Tidak — perlu app terpisah |
| Rollback | Instant dari dashboard | Revert commit + push |
| Downtime saat deploy | Tidak | 1–5 detik |
| Env var | Dashboard Vercel | hPanel |
| SSL | Otomatis | Tombol di hPanel |
| Analytics | Vercel Analytics (bawaan) | Perlu tool pihak ketiga |
| Biaya | Pay per usage | Fixed per bulan, ada limit resource |
| Region/CDN | Global edge | Lebih terbatas |

---

## 11. Yang perlu Dicek Saat Deploy

Lima hal ini tidak bisa dipastikan tanpa akun Hostinger Anda:

1. **Resource limit.** Semua route `force-dynamic`, jadi tiap request consumir
   CPU + memory. Paket termurah mungkin tidak cukup untuk trafik nyata.
2. **Durasi build.** `next build` di sini butuh ± 40 detik. Kalau Hostinger
   punya timeout build pendek, bisa gagal.
3. **Nonce CSP.** `proxy.js` membuat CSP nonce per request. Kalau Hostinger
   meng-cache HTML di edge, nonce bisa tidak cocok dengan script — gejalanya
   script tidak jalan dan muncul violation di console.
4. **Sanity latency.** `force-dynamic` berarti setiap request menunggu Sanity
   dari lokasi server Hostinger. Kalau lokasi server jauh dari Sanity edge,
   TTFB naik.
5. **Image optimization.** `next/image` memproses di server. Memory limit
   mungkin jadi bottleneck saat banyak request gambar.

Kalau nanti ada masalah, bagian 8 (rollback) adalah jalur balik yang cepat - revert
commit, push, selesai.
