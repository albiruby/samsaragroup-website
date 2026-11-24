# RUNBOOK — Samsara Group Website

Runbook untuk insiden yang **bukan** sekadar rollback deployment.
Untuk rollback kode, pakai [`ROLLBACK.md`](ROLLBACK.md).

**Pemilik insiden:** `[pemilik baru]`
**Kontak darurat:** `[email/telepon]`

---

## 1. Triage awal (2 menit)

1. Buka tab **Actions** repo website:
   - `Production smoke check` — gagal harian?
   - `Uptime check` — gagal tiap 15 menit?
2. Buka issue yang dibuat workflow. Di situ ada URL dan kode HTTP yang gagal.
3. Cek status penyedia:
   - Vercel: <https://www.vercel-status.com>
   - Sanity: <https://status.sanity.io>
4. Jalankan `npm run smoke` dari `website/` untuk melihat 77 cek.
5. Tentukan kategori:
   - **Kode/deploy** → `ROLLBACK.md`
   - **CMS** → §2
   - **Hosting** → §3
   - **Domain/SSL** → §4
   - **Token** → §5
   - **Form** → §6
   - **Data hilang** → §7

---

## 2. Sanity down / data tidak muncul

**Gejala:** halaman memakai fallback, menu kosong, brand hilang, `fetch failed` di log Vercel.

1. Cek <https://status.sanity.io>. Kalau Sanity yang bermasalah, tidak ada yang bisa diperbaiki di sisi kita.
2. Jangan mengubah kode atau dataset saat insiden berlangsung.
3. Pastikan situs tetap 200 dan fallback tampil:
   - `/` memakai teks hardcoded.
   - `/brands` memakai `SEED_CARDS`.
   - Halaman brand memakai konfigurasi lokal.
4. Kalau insiden > 30 menit, siapkan komunikasi ke pengunjung (lihat §8).
5. Setelah pulih, jalankan `npm run smoke` dan cek satu halaman brand.

**Jangan:** menghapus cache, mengganti dataset, atau restore production saat Sanity sedang down.

---

## 3. Vercel down / deploy gagal

**Gejala:** situs 5xx, deployment `Error`, build gagal.

1. Cek <https://www.vercel-status.com>.
2. Kalau hanya deploy terakhir yang gagal:
   - Buka Vercel → Deployments.
   - Pilih deployment terakhir yang **READY**.
   - **Promote to Production** / **Rollback**.
   - Verifikasi `npm run smoke` 77/77.
3. Kalau build gagal karena kode:
   - Ikuti `ROLLBACK.md`.
   - Perbaiki di branch, jangan push langsung ke `master`.
4. Kalau build gagal karena environment variable:
   - Cek Vercel → Settings → Environment Variables.
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SITE_URL`.

---

## 4. Domain / DNS / SSL

**Gejala:** domain tidak resolve, sertifikat expired, redirect loop.

1. Cek masa aktif domain di registrar.
2. Cek DNS:
   - `nslookup <domain>`
   - `nslookup -type=MX <domain>`
3. Cek Vercel → Domains:
   - Status **Valid Configuration**?
   - Sertifikat **Active**?
4. Jangan mengubah nameserver saat insiden tanpa persetujuan pemilik.
5. Kalau domain expired: perpanjang di registrar, tunggu propagasi, lalu verifikasi HTTPS.

**Catatan:** situs saat ini berjalan di `samsaragroup.vercel.app`. Domain final belum dipasang.

---

## 5. Token / kredensial bocor

**Gejala:** token muncul di commit, log, screenshot, atau repo publik.

1. **Cabut token** di Sanity Manage → API → Tokens.
2. Buat token baru hanya jika benar-benar diperlukan.
3. Cek GitHub → Security → Secret scanning alerts.
4. Cek log Vercel dan GitHub Actions untuk pemakaian mencurigakan.
5. Ganti kredensial lain yang memakai token yang sama.
6. Catat insiden (waktu, token, tindakan) tanpa menulis nilai token.

**Aturan:** website tidak membutuhkan token Sanity. Jangan menaruh token di `src/` atau `NEXT_PUBLIC_*`.

---

## 6. Form lamaran gagal

**Gejala:** tautan Apply 401, form closed, atau tidak ada submission.

1. Buka URL Google Form tanpa login (incognito).
   - 401 → form membatasi akun Google.
   - “No longer accepting responses” → form ditutup.
2. Kalau gagal, arahkan pelamar ke WhatsApp/email sampai form diperbaiki.
3. Periksa pemilik form dan setelan akses.
4. Catat jumlah pelamar yang terdampak.

**Catatan:** keenam lowongan memakai satu form. Ini keputusan konten, bukan bug kode.

---

## 7. Data CMS hilang / salah hapus

1. **Jangan restore production langsung.**
2. Cek Sanity → document history. Untuk satu dokumen, history biasanya cukup.
3. Kalau banyak dokumen:
   - Restore arsip terbaru ke dataset `staging` dulu:
     `sanity datasets import <arsip>.tar.gz staging --replace`
   - Verifikasi jumlah dokumen dan gambar.
   - Baru pindahkan ke production dengan persetujuan pemilik.
4. Kalau arsip terbaru tidak ada, cek `backups/sanity/production/` dan salinan off-site.
5. Catat RPO: waktu arsip terakhir.

---

## 8. Komunikasi & penutupan

- Status singkat: apa yang rusak, sejak kapan, apa yang sedang dilakukan, kapan update berikutnya.
- Jangan menulis kredensial, data pribadi, atau isi CMS di status publik.
- Setelah pulih:
  1. `npm run smoke` 77/77.
  2. Cek satu halaman brand dan satu halaman CMS.
  3. Tutup issue monitoring.
  4. Tulis catatan insiden (template di `ROLLBACK.md` §7).
  5. Tentukan tindakan pencegahan.

---

## 9. Referensi

| Dokumen | Isi |
|---|---|
| [`ROLLBACK.md`](ROLLBACK.md) | Rollback deployment & data |
| [`MAINTENANCE.md`](MAINTENANCE.md) | Perawatan rutin, backup, deploy |
| [`DOCUMENTATION.md`](DOCUMENTATION.md) | Arsitektur, env, script |
| [`ASSETS.md`](ASSETS.md) | Lisensi aset |
