# Samsara Group — Website

Website profil **Samsara Group** (Samsara · Svarga · Acasa · Outpace · Grove).
Next.js 16 (App Router) + Sanity CMS, di-deploy ke Vercel.

Prasyarat: **Node.js 24.22.1+** (memuat patch keamanan Node.js 21 Oktober 2026; versi lokal ada di `.nvmrc`) dan npm 11+.

## Menjalankan lokal

```bash
npm install
npm run dev        # http://localhost:3000
```

Preview Vercel memakai dataset `staging` (bukan `production`) dan di-noindex; detail di `docs/DOCUMENTATIONS.md` §12.2.

Studio CMS ada di repo terpisah, `../studio`:

```bash
cd ../studio
npm run dev        # http://localhost:3333
```

## Sebelum commit

```bash
npm run lint       # harus 0 error
npm run build      # harus sukses
```

CI menjalankan langkah yang sama di setiap push/PR; `smoke` produksi berjalan harian.

## Deploy

- Push ke `master` → Vercel build & deploy otomatis.
- Ubah **schema** Studio → `npm run deploy` di repo studio.
- Ubah **isi dokumen** CMS → tidak perlu deploy apa pun, muncul ~1 menit.

## Peringatan

`scripts/sync-hardcode-to-cms.mjs` **lapor-saja**: ia membandingkan galeri dan
fallback di kode dengan isi CMS, tanpa pernah menulis. Jalankan manual dengan
`npm run sync:cms`; tidak ada watcher otomatis saat `next dev`, dan skrip ini
tidak butuh token.

Jangan menaruh `SANITY_API_TOKEN` di `src/`: tidak ada kode situs yang
membutuhkannya, dan apa pun yang masuk bundel browser akan terekspos.

## Dokumentasi

Dokumentasi lengkap ada di folder `docs/` repo ini:

- `docs/DOCUMENTATIONS.md` — arsitektur, model konten, aturan bisnis, cookbook
- `docs/PEMELIHARAAN.md` — panduan operasional ringkas
- `docs/Sanity CMS Tutorial.md` — panduan editor CMS
- `docs/Overall Codebase Security Audit.md` — audit keamanan

## Stack

Next.js 16 · React 19 · Tailwind CSS v4 · Sanity v6 · Leaflet · Vercel
