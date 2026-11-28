# ASSETS — Lisensi & Kepemilikan Aset

Dokumen ini mencatat **asal dan hak pakai** aset visual di website.
Tujuannya bukan legal advice, tetapi supaya pemilik berikutnya tahu mana yang boleh dipakai ulang.

**Pemilik aset:** `[pemilik baru]`
**Terakhir diperiksa:** 28 November 2026 (normalisasi nama logo)

---

## 1. Font

| Font | Dipakai di | Lisensi | Bukti |
|---|---|---|---|
| Instrument Serif | Display/heading | SIL Open Font License 1.1 (Google Fonts) | `next/font/google` |
| Red Hat Display | Body | SIL Open Font License 1.1 (Google Fonts) | `next/font/google` |

- Di-host sendiri lewat `next/font`; tidak ada permintaan ke Google saat runtime.
- OFL mengizinkan penggunaan komersial dan self-hosting.
- Jangan mengganti ke font berbayar tanpa lisensi tertulis.

---

## 2. Foto

| Brand | Sumber | Status hak pakai | Bukti |
|---|---|---|---|
| Samsara | `[client/studio/fotografer]` | `[milik sendiri / lisensi / belum]` | `[file/faktur]` |
| Svarga | `[client/studio/fotografer]` | `[milik sendiri / lisensi / belum]` | `[file/faktur]` |
| Acasa | `[client/studio/fotografer]` | `[milik sendiri / lisensi / belum]` | `[file/faktur]` |
| Outpace | `[client/studio/fotografer]` | `[milik sendiri / lisensi / belum]` | `[file/faktur]` |
| Grove | `[client/studio/fotografer]` | `[milik sendiri / lisensi / belum]` | `[file/faktur]` |

**Aturan:**

- Jangan memakai foto dari internet, Pinterest, atau Google Images tanpa izin tertulis.
- Simpan bukti lisensi/faktur di luar repo (jangan di repo publik).
- Foto yang menampilkan orang memerlukan izin/model release.
- Placeholder (`placeholder-gallery-*`) bukan aset final; jangan dipakai untuk promosi.

---

## 3. Logo & brand mark

| Brand | Sumber | Format | Catatan |
|---|---|---|---|
| Samsara Group | Klien | PNG/WebP | Logo putih & hitam |
| Samsara | Klien | WebP + PNG source | `ASSETS-SAMSARA/logo` — black/white 1200 + 480 |
| Svarga | Klien | WebP | `ASSETS-SVARGA/logo` — black/white 1200 + 480 |
| Acasa | Klien | WebP | `ASSETS-ACASA/logo` — black/white 1200 + 480 |
| Outpace | Klien | WebP + PNG source | `ASSETS-OUTPACE/logo` — black/white 1200 + 480 |
| Grove | Klien | WebP + PNG source | `ASSETS-GROVE/logo` — black/white 1200 + 480 |

Pola nama yang dipakai semua brand:

```text
ASSETS-<BRAND>/logo/<brand>-black.webp
ASSETS-<BRAND>/logo/<brand>-black-480.webp
ASSETS-<BRAND>/logo/<brand>-white.webp
ASSETS-<BRAND>/logo/<brand>-white-480.webp
ASSETS-<BRAND>/logo/source/<brand>-black.*
```

`source/` hanya berisi berkas asli yang tersedia; untuk Svarga dan Acasa sumber aslinya adalah WebP resolusi penuh.

- Varian **black** dipakai di halaman, kartu, footer, dan strip Career (permukaan terang). Varian **white** disimpan untuk konteks gelap.
- Logo adalah merek dagang pemilik; jangan mengubah proporsi/warna tanpa arahan brand.
- Jangan mengunggah logo pihak ketiga ke Sanity.

---

## 4. Library & kode

| Paket | Lisensi | Catatan |
|---|---|---|
| Next.js | MIT | Framework |
| React / React DOM | MIT | UI |
| Tailwind CSS | MIT | Styling |
| @sanity/client, @sanity/image-url | MIT | CMS client |
| Leaflet | BSD-2-Clause | Peta |
| @vercel/analytics, @vercel/speed-insights | MIT/Apache-2.0 | Analytics |

- Lisensi lengkap ada di `node_modules/<paket>/LICENSE`.
- Jangan menghapus atribusi Leaflet/OpenStreetMap di peta.
- Jika menambah library baru, catat lisensinya di tabel ini.

---

## 5. Ikon, ilustrasi, dan OG image

| Aset | Sumber | Lisensi |
|---|---|---|
| Ikon SVG di komponen | Dibuat untuk proyek | Milik proyek |
| `og-default.png` | Dibuat untuk proyek | Milik proyek |
| Pola/gradient CSS | Kode proyek | Milik proyek |

---

## 6. Checklist saat menambah aset

- [ ] Sumber jelas (foto sendiri, klien, atau lisensi).
- [ ] Bukti lisensi/faktur disimpan di luar repo.
- [ ] Tidak ada orang tanpa izin/model release.
- [ ] Tidak ada logo/trademark pihak ketiga.
- [ ] Ukuran dan format dioptimalkan (WebP, lebar sesuai slot).
- [ ] Alt text diisi.
- [ ] Dicatat di tabel dokumen ini.
