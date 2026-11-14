# Handover — Samsara Group Website

**Tanggal:** 25 Oktober 2026  
**Produksi:** <https://samsaragroup.vercel.app>  
**Stack:** Next.js 16 (App Router) · React 19 · Tailwind v4 · Sanity v6 · Vercel

> **Pembaruan 4 November 2026 - audit Run 3.**
> - Metadata dan badan halaman brand statis sekarang memakai gate yang sama, termasuk saat `status` kosong.
> - `/_next/image` ditutup (`images.remotePatterns` dihapus) karena tidak ada pemakaian `next/image`.
> - Actions GitHub dipin ke commit SHA; branch hardening lama sudah dihapus.
> - Studio: Vision hanya di workspace staging, `autoUpdates` dimatikan, URL skema dibatasi `https`.
> - Arsip pra-pembersihan 18 Oktober sudah dihapus dari disk lokal; Drive hanya berisi arsip pasca-pembersihan.
> - Sisa pekerjaan pemilik: ACL folder Drive, status dataset publik, dan pembuatan client_id rclone sendiri.

> **Pembaruan 14 November 2026 — penyeragaman jalur edit brand.**
> - Kelima halaman brand kini memakai satu renderer (`BrandPageView`) dan membaca **seluruh** isinya dari CMS: logo, tagline, intro, judul tabel, menu, koordinat peta, alamat, dan nomor WhatsApp.
> - Menu dipindah dari file lokal ke `sections[type=menu].menuPanels[]` (Samsara 36 halaman, Acasa 2, Svarga 1).
> - Field baru `world.whatsapp` (schema + Studio sudah di-deploy).
> - Grove & Outpace **tidak lagi `noIndex`** dan sudah masuk sitemap (11 URL); kontennya tetap belum lengkap.
> - Menu Grove & Outpace menampilkan placeholder "Menu coming soon" sampai panelnya diisi.

Dokumen ini untuk orang atau agency yang mengambil alih website. Baca juga:

- `DOCUMENTATIONS.md` — arsitektur, konten, deploy, script.
- `PEMELIHARAAN.md` — operasi harian dan troubleshooting.
- `ROLLBACK.md` — langkah rollback production.
- `Overall Codebase Security Audit.md` — catatan keamanan historis.

---

## 1. Ringkas

- Website profil lima brand: **Samsara, Svarga, Acasa, Outpace, Grove**.
- CMS Sanity adalah **sumber kebenaran** untuk konten. Tidak ada sinkronisasi kode → CMS.
- Tidak ada backend, login, form, atau database sendiri. Kontak memakai WhatsApp dan Google Form.
- Outpace & Grove **sudah terindeks** (sejak 14/11) meskipun kontennya belum lengkap: menu masih placeholder, alamat/logo/jam menyusul.
- Repo website dan studio **publik**; jangan pernah commit arsip Sanity, token, atau dokumen pribadi.
- **Isi `docs/` ikut terbaca publik.** Jangan menaruh nomor atau alamat asli, nama orang, kredensial, atau perintah siap-salin (mis. contoh `curl`) di dalamnya. Rujuk ke Studio (**Contact Info**) atau dokumentasi resmi sebagai gantinya, dan pakai angka yang jelas palsu untuk contoh format. Berlaku juga untuk riwayat lama: rapikan saat dokumen itu disentuh.

---

## 1a. Di mana mengubah apa — halaman brand

Semua lewat **Studio → Brands & Brand Pages — World → pilih brand**. Tidak ada lagi teks brand yang perlu diubah di kode.

| Yang ingin diubah | Field |
|---|---|
| Logo besar di atas | **Logo** |
| Kalimat di bawah logo | **Tagline** |
| Paragraf pembuka | tab **4 - Sections** → section **Text** → Body |
| Judul + isi tabel | section **Specs** → Heading + Specifications |
| Menu | section **Menu** → panel (1 panel = 1 halaman) |
| Peta | section **Map** → Latitude / Longitude / Zoom |
| Alamat & jam buka | tab **6 - Location & Map** |
| Nomor WhatsApp | tab **7 - Contact & Links** → WhatsApp Number |
| Tombol | tab **7 - Contact & Links** → Action Buttons |
| Foto utama & galeri | **Image** dan **Gallery** |

---

## 2. Yang berjalan otomatis

| Apa | Di mana | Kapan |
|---|---|---|
| Build & deploy | Vercel | Setiap push ke `master` |
| Gate build | `website/scripts/should-build.mjs` | Saat Vercel build |
| CI: `npm ci`, lint, audit produksi, build | GitHub Actions `ci.yml` | Push + pull request |
| Smoke test 74 cek | GitHub Actions `smoke.yml` | Harian 08:00 WIB + manual |
| Uptime 200 + sitemap | GitHub Actions `uptime.yml` | Tiap 15 menit |
| Alert | Issue GitHub → email pemilik repo | Saat smoke/uptime gagal |

Catatan: **workflow terjadwal GitHub bisa dinonaktifkan otomatis** setelah repo tidak aktif selama 60 hari. Kalau situs dibekukan, cek tab **Actions** secara berkala atau pasang monitor eksternal.

`should-build.mjs` hanya dipakai Vercel. Kalau file itu dihapus, hapus juga `ignoreCommand` di `vercel.json`; kalau tidak, deploy berikutnya bisa gagal.

---

## 3. Yang manual

| Tugas | Siapa | Catatan |
|---|---|---|
| Ubah konten | Editor Studio | Production: `/production`; staging: `/staging` |
| Backup dataset | Pemilik / admin | `studio/scripts/backup-and-upload.ps1`; **tidak terjadwal** |
| Restore drill | Pemilik / admin | Minimal 3–6 bulan sekali; lihat `DOCUMENTATIONS.md` §14 |
| Rollback production | Pemilik / admin | Ikuti `ROLLBACK.md`; **belum pernah diuji** |
| Perpanjang domain/plan | Pemilik | Vercel, Sanity, domain/DNS |
| Cabut/rotasi token | Pemilik | Sanity Manage → API → Tokens |

Backup berjalan hanya saat diminta. Kalau tidak ada yang menjalankannya, arsip terakhir akan tetap di `backups\sanity\` dan Google Drive.

---

## 4. Akun dan kepemilikan — isi saat serah terima

| Aset | Pemilik baru | Akses | Catatan |
|---|---|---|---|
| GitHub repo website | | Admin/owner | `albiruby/samsaragroup-website` |
| GitHub repo studio | | Admin/owner | `albiruby/samsaragroup-sanity` |
| Vercel team/project | | Owner/member | project `samsaragroup` |
| Sanity project | | Admin/editor | project `p5zu5azj` |
| Domain & DNS | | Registrar/DNS | saat ini `samsaragroup.vercel.app` |
| Google Drive backup | | Folder terbatas | remote rclone `samsara-drive` |
| Email alert | | Pemilik repo GitHub | penerima issue smoke/uptime |
| Password manager | | — | 2FA + recovery code |

Jangan mengirim password lewat chat. Gunakan undangan akun, 2FA, dan password manager.

---

## 5. Langkah serah terima

1. Undang pemilik baru ke GitHub, Vercel, dan Sanity sebagai **owner/admin**.
2. Pindahkan billing Vercel/Sanity dan perpanjangan domain.
3. Ganti penerima notifikasi issue GitHub ke email pemilik baru.
4. Tentukan siapa yang menjalankan backup; lakukan satu backup + restore drill.
5. Token Sanity: **tidak ada token permanen** sampai 14/11. Saat itu satu token Editor dibuat untuk migrasi konten (field `whatsapp`, section map Grove/Outpace, aset logo). Token itu tidak dipakai website — website membaca dataset publik tanpa token. **Cabut atau rotasi sebelum/saat serah terima**, lalu buat baru hanya bila diperlukan.
6. Verifikasi: push perubahan kecil → CI hijau → Vercel deploy → `npm run smoke` 74/74.
7. Kalau pindah domain: ubah `NEXT_PUBLIC_SITE_URL`, default URL di `scripts/smoke.mjs`, dan `BASE` di `uptime.yml`.
8. Baca `ROLLBACK.md`; jadwalkan uji rollback pertama.

---

## 6. Script yang ada setelah 25/10/2026

| Lokasi | Script | Fungsi |
|---|---|---|
| `website/scripts/` | `smoke.mjs` | 74 cek produksi / 75 preview |
| `website/scripts/` | `should-build.mjs` | Gate build Vercel |
| `studio/scripts/` | `backup-dataset.ps1` | Backup lokal, simpan 14 |
| `studio/scripts/` | `backup-and-upload.ps1` | Backup + upload Drive, simpan 7 |
| root | `Dev.cmd`, `dev-launcher.ps1` | Jalankan website + Studio lokal |

`sync-hardcode-to-cms.mjs` **dihapus 25/10**. Tidak ada lagi audit drift kode ↔ CMS; konten hanya lewat Studio.

Workflow: `ci.yml`, `smoke.yml`, `uptime.yml` di `website/.github/workflows/`.

---

## 7. Kalender perawatan

### Otomatis

- Setiap push: CI + Vercel.
- Harian: smoke.
- Tiap 15 menit: uptime.

### Bulanan

- Cek issue GitHub yang terbuka.
- Pastikan backup terbaru ada di lokal dan Drive.
- Cek penggunaan Vercel/Sanity; pastikan plan masih cukup.
- Review `npm audit --omit=dev` bila ada perubahan dependency.

### 3–6 bulan

- Jalankan restore drill ke `staging`.
- Uji rollback production.
- Review akses akun dan token.
- Audit konten (Outpace/Grove, jam buka, social image).

### Tahunan

- Perpanjang domain dan plan.
- Review legal/privacy.
- Review dependency major.

---

## 8. Darurat

1. Buka `ROLLBACK.md`.
2. Cek `npm run smoke` dan issue GitHub.
3. Kalau kode bermasalah: rollback deployment di Vercel, lalu verifikasi.
4. Kalau data bermasalah: **jangan** restore production tanpa backup dan persetujuan; gunakan history dokumen Sanity bila hanya satu dokumen.
5. Catat insiden dengan template di `ROLLBACK.md` §7.

---

## 9. Gap yang masih terbuka

- Domain masih `samsaragroup.vercel.app`; domain sendiri belum ada.
- Privacy policy/halaman legal belum dibuat.
- Outpace & Grove terindeks, tetapi belum lengkap: menu placeholder, alamat/logo/jam belum ada.
- Kelima brand belum punya jam buka; `world.hours` masih kosong.
- `/about` masih 100% hardcoded; Career masih 6 lowongan dummy; Events masih 0 dokumen.
- Staging **publik**; jangan unggah dokumen pribadi.
- Rollback runbook ada, tetapi belum diuji.
- Monitoring eksternal belum dipasang; alert hanya lewat GitHub.
- Backup manual, tidak terjadwal.
- ~~Token Sanity lama belum dicabut.~~ **Selesai 25/10** — ketiga token project dihapus; `sanity tokens list` = 0.
- Unit/integration test belum ada. `typecheck` sudah jalan untuk Studio (CI), website hanya lint + build.

---

## 10. Checklist serah terima

- [ ] GitHub website & studio sudah diakses pemilik baru.
- [ ] Vercel project/team sudah diakses pemilik baru.
- [ ] Sanity project + Studio sudah diakses pemilik baru.
- [ ] Domain/DNS dan billing sudah dialihkan.
- [ ] Email alert sudah diarahkan ke pemilik baru.
- [ ] Backup owner ditunjuk; satu backup berhasil dibuat.
- [ ] Restore drill berhasil.
- [x] Token Sanity lama sudah dicabut (25/10; `tokens list` = 0).
- [ ] `ROLLBACK.md` sudah dibaca; uji rollback dijadwalkan.
- [ ] `npm run smoke` 74/74.
- [ ] Pemilik baru tahu: konten lewat Studio, bukan lewat kode.
