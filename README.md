# Samsara Group — Website

Website profil **Samsara Group** (Samsara · Svarga · Acasa · Outpace · Grove).
Next.js 16 (App Router) + Sanity CMS, di-deploy ke Vercel.

## Menjalankan lokal

```bash
npm install
npm run dev        # http://localhost:3000
```

Studio CMS ada di repo terpisah, `../studio-sams-sams`:

```bash
cd ../studio-sams-sams
npm run dev        # http://localhost:3333
```

## Sebelum commit

```bash
npm run lint       # harus 0 error
npm run build      # harus sukses
```

## Deploy

- Push ke `master` → Vercel build & deploy otomatis.
- Ubah **schema** Studio → `npm run deploy` di repo studio.
- Ubah **isi dokumen** CMS → tidak perlu deploy apa pun, muncul ~1 menit.

## Peringatan

`src/instrumentation.js` menjalankan watcher yang, saat `NODE_ENV=development`,
menyinkronkan nilai hardcoded → CMS — **termasuk menulis ke dataset `production`**.
Matikan dengan `SYNC_CMS_DISABLED=1` kalau `.env.local` menunjuk produksi.

Jangan pernah menaruh `SANITY_API_TOKEN` di `src/sanity/lib/client.ts`: file itu
dipakai komponen server *dan* client.

## Dokumentasi

Dokumentasi lengkap ada di folder induk proyek:

- `../DOCUMENTATIONS.md` — arsitektur, model konten, aturan bisnis, cookbook
- `../PEMELIHARAAN.md` — panduan operasional ringkas

## Stack

Next.js 16 · React 19 · Tailwind CSS v4 · Sanity v6 · Leaflet · Vercel
