# Rollback Runbook — Samsara Group Website

Berlaku untuk produksi **Vercel**: <https://samsaragroup.vercel.app> (project `samsaragroup`).

> **Status uji:** runbook ditulis 24/10/2026, **belum pernah diuji** di production. Uji pertama harus dijadwalkan bersama pemilik.

## 1. Kapan rollback kode

Rollback jika perubahan kode terakhir menyebabkan:

- halaman rusak parah setelah deploy (markup/JS error, layout hancur);
- route atau aset penting hilang;
- error 500/404 masif yang tidak berasal dari CMS.

**Jangan rollback** jika:

| Gejala | Yang harus dilakukan |
|---|---|
| Isi halaman salah, tetapi markup/route normal | Perbaiki data di Studio, atau restore dokumen dari history. Situs membaca CMS live. |
| Domain/DNS/SSL bermasalah | Perbaiki di Vercel Domains / DNS. Rollback kode tidak membantu. |
| Vercel sedang incident | Cek <https://www.vercel-status.com>. Rollback bisa memperburuk. |
| Build gagal | Deployment lama masih production. Perbaiki build, push ulang; tidak perlu rollback. |

## 2. Tentukan deployment sehat terakhir

1. Buka Vercel → project **samsaragroup** → **Deployments**.
2. Filter **Production**.
3. Pilih deployment **READY** terakhir sebelum insiden.
4. Catat **commit SHA**, waktu deploy, dan URL deployment.
5. Kalau ragu, pilih deployment yang terakhir kali `npm run smoke` hijau.

Target waktu langkah ini: **< 5 menit**.

## 3. Jalankan rollback

Vercel dapat mengubah label UI. Dua jalur yang valid:

**A. Instant Rollback / Promote to Production**

1. Buka deployment sehat.
2. Menu `⋯` → **Promote to Production** (atau **Instant Rollback** jika tersedia).
3. Konfirmasi. Alias produksi `samsaragroup.vercel.app` akan menunjuk deployment itu.

**B. Redeploy**

1. Deployment sehat → `⋯` → **Redeploy**.
2. **Uncheck** “Use project's Ignore Build Step” — kalau tidak, `ignoreCommand` bisa melewati build.
3. Tunggu status **READY**.

Jangan hapus deployment yang rusak; simpan sebagai bukti dan untuk perbandingan.

## 4. Verifikasi setelah rollback

```powershell
npm run smoke
Invoke-WebRequest https://samsaragroup.vercel.app -UseBasicParsing
Invoke-WebRequest https://samsaragroup.vercel.app/sitemap.xml -UseBasicParsing
Invoke-WebRequest https://samsaragroup.vercel.app/robots.txt -UseBasicParsing
```

Checklist:

- [ ] `npm run smoke` → **74/74** (produksi).
- [ ] `/` membalas **200**.
- [ ] Header keamanan masih ada (`content-security-policy`, `strict-transport-security`, `x-frame-options`).
- [ ] `/sitemap.xml` berisi 11 URL dan semua hidup.
- [ ] `/robots.txt` berisi `Allow: /` + `Sitemap:`.
- [ ] Satu halaman brand (mis. `/svarga`) tampil normal.
- [ ] Satu gambar dari halaman itu membalas 200.

Target waktu: **< 10 menit** dari keputusan rollback.

## 5. Setelah rollback

1. Catat insiden (template di §7).
2. Perbaiki penyebab di branch terpisah.
3. Jalankan CI (`ci.yml`) sampai hijau.
4. Deploy perbaikan, lalu `npm run smoke` lagi.
5. Promote perbaikan ke production.
6. Jangan force-push atau menulis ulang riwayat untuk “menghilangkan” commit yang rusak.

## 6. Rollback data CMS

**Ini bukan langkah pertama.** Rollback kode tidak mengubah data CMS.

- **Satu dokumen salah:** Studio → buka dokumen → **History** → restore versi sebelumnya.
- **Seluruh dataset:** hanya dengan persetujuan pemilik. Backup dulu.

```powershell
# HANYA dengan persetujuan. Backup production dulu.
sanity datasets export production "$env:TEMP\pre-restore.tar.gz" --overwrite
sanity datasets import "$env:TEMP\pre-restore.tar.gz" -d production --replace
```

Peringatan:

- `--replace` **tidak menghapus** dokumen yang tidak ada di arsip. Untuk restore snapshot bersih, target harus kosong (dataset baru atau delete-recreate) — jangan lakukan ke `production` tanpa izin.
- Setelah restore: cocokkan counts (total, world, career, carousel, assets, singleton), cek satu URL gambar, lalu `npm run smoke`.
- Arsip backup ada di `backups\sanity\` (14 terbaru) dan Google Drive (7 terbaru). Jangan commit arsip ke repo publik.

## 7. Template catatan insiden

| Item | Isi |
|---|---|
| Waktu mulai / selesai | |
| Ditemukan oleh | |
| Gejala | |
| Deployment/commit yang bermasalah | |
| Deployment yang dipulihkan | |
| Tindakan | rollback / revert / restore data / perbaikan |
| Hasil smoke | |
| Penyebab akar | |
| Tindak lanjut | |

## 8. Catatan khusus

- Preview deployment memakai dataset `staging`; rollback production tidak mengubah staging.
- `ignoreCommand` hanya membandingkan path build; saat Redeploy, uncheck opsinya.
- Untuk Hostinger (bukan Vercel), rollback berarti revert commit + push — lihat `Migrasi-Hostinger.md` §8.
