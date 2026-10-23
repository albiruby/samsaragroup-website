# Overall Codebase Audit — Samsara Group

**Website:** `website` · **Source ref:** `f6d3df2` (branch `master`, worktree bersih)
**CMS Studio:** `studio` · **Dataset:** `production`
**Tanggal:** 10 Oktober 2026 · **Profil:** `standard` · **Metode skill:** `security-audit` (6 fase penuh)
**Run metadata:** `C:\Users\ALBIREO\security-audit-skill\samsaragroup-website\run-1\`

> **STATUS TINDAK LANJUT — 13 Oktober 2026.**
> Laporan ini rekaman audit per 10 Oktober 2026 dan **isinya tidak diubah**. Yang sudah berubah sejak itu:
> - **Kredensial lingkungan deploy sudah ditangani.** `SANITY_API_WRITE_TOKEN` dan `SANITY_API_READ_TOKEN` di project Vercel sudah dikosongkan; sisanya tinggal dihapus permanen dari dashboard (langkahnya di `DOCUMENTATIONS.md` §10).
> - **Klaim domain dikoreksi.** `samsaragroup.com` **bukan milik proyek ini** — dipegang pihak lain. Domain kita: `https://samsaragroup.vercel.app` (`DOCUMENTATIONS.md` §1).
> - **Ketahanan ditambah:** backup dataset atas permintaan (lokal + Google Drive) + uptime monitor tiap 15 menit (`DOCUMENTATIONS.md` §14).
> - **19/10 — paparan aset publik ditutup.** Dataset ini publik untuk dibaca, jadi **setiap aset yang pernah diunggah bisa diunduh siapa pun yang tahu URL-nya** — tanpa login. Ditemukan satu scan KTP yang tidak direferensikan dokumen mana pun; aset itu dihapus dari Sanity (URL-nya kini 404) dan kelima arsip backup lama dibersihkan agar tidak ikut terbawa. Aturan yang berlaku sejak itu: **dokumen pribadi tidak boleh diunggah ke dataset ini.**
> - **19/10 — catatan atas temuan skrip.** Beberapa temuan di bawah menyebut skrip yang **sudah tidak ada**: `sync-cms-to-site.mjs`, `seed-careers.mjs`, `audit-schema.mjs`, `sync-sections-extract.mjs`, dan `security-scan.mjs` dihapus di commit `2035c86`. Temuannya tetap benar sebagai catatan historis — apa yang salah pada skrip itu memang nyata — tetapi tidak ada lagi yang bisa dijalankan, jadi rekomendasinya sudah tidak perlu ditindak.
> - Temuan lain yang masih terbuka terdaftar di `DOCUMENTATIONS.md` §16.

---

## 1. Ringkasan Eksekutif

Dua hal berbeda diverifikasi di laporan ini, dan keduanya harus dibaca terpisah.

**A. Keamanan (skill `security-audit`, 6 fase, 30 coverage unit).**
Tidak ada vulnerability yang bisa dibuktikan. Hasil akhir: **0 confirmed, 1 needs_validation, 6 rejected.**
Enam kandidat yang sempat terlihat berbahaya semuanya **ditolak setelah diverifikasi independen** — bukan karena hipotesisnya salah, tetapi karena tidak ada batas keamanan yang ditembus. Contoh paling jelas: `resolveLocal` memang tidak punya path containment, tapi satu-satunya yang bisa mengicunya adalah developer itu sendiri di mesinnya sendiri — bukan cross-boundary.

**B. Kontrak CMS → Website (bug kelas `postedAt`).**
Ini adalah temuan yang sebenarnya penting secara operasional, dan sama sekali **bukan** masalah keamanan.Hasilnya: **5 field Sanity yang bisa diisi editor tidak pernah tampil di website mana pun**, plus 2 halaman brand yang mengabaikan sebagian besar field CMS-nya. `postedAt` yang Anda temukan bukan kasus isolated.

**Kesimpulan: website layak produksi dari sisi keamanan. Yang belum layak adalah Operand CMS — editor isi data yang tidak pernah sampai ke layar.**

---

## 2. KOREKSI PENTING TERHADAP KLAIM SEBELUMNYA

| Klaim | Status | Bukti |
|---|---|---|
| "Audit sebelumnya sudah mencakup semuanya" | ❌ Salah | Audit sebelumnya tidak pernah menyentuh rantai schema→proyeksi→render. `postedAt` terambil di `queries.ts:192` dan dipakai di `career/page.js:110` untuk JSON-LD, tapi nolcek yang memeriksa apakah ia **dirender**. |
| "Tidak ada vulnerability" | ⚠️ Belum pernah dibuktikan | Audit lama tidak punya fase verifikasi independen. Sekarang: 0 confirmed dari 7 kandidat yang diverifikasi, dengan 160 sitasi diperiksa ulang. |
| "CMS ter-audit" | ❌ Salah | Schema Sanity berada di repo **Studio terpisah**, bukan di `website`. Audit sebelumnya mengasumsikan `src/sanity/schema/*.ts` ada di repo website — direktori itu tidak pernah ada. |
| "1 needs_validation di events JSON-LD" | ✅ Sudah refutasi | Kedua premisnya salah di source sekarang: `src/lib/jsonld.js:2-4` meng-escape `<`, `>`, U+2028/9 di seluruh string, dan `src/proxy.js:9` memakai nonce per-request + `strict-dynamic` tanpa `unsafe-inline`. |

---

## 3. BAGIAN A — AUDIT KEAMANAN

### 3.1 Coverage

30 unit, 7 attack class, 3 hunter wave + 2 coverage critic.

| Attack class | Unit |
|---|---|
| Injection | 15 |
| Feature abuse and data leakage | 5 |
| Obvious things | 2 |
| Chained vulnerabilities and trust boundaries | 2 |
| Cryptography and secrets | 2 |
| Access control | 2 |
| Resource and file handling | 2 |

Status: **22 covered, 8 candidate, 0 planned/deferred/blocked.** Final-clean critic sudah keluar bersih.

### 3.2 Hasil verifikasi kandidat

| Fingerprint | Verdik | Inti |
|---|---|---|
| `src/proxy.js:csp-coverage-keyed-on-request-prefetch-headers` | **needs_validation** | Matcher `src/proxy.js:38-41` mengecualikan request ber-header `next-router-prefetch` / `purpose: prefetch`, sehingga respons itu **tanpa CSP sama sekali**. Diblokir oleh fakta runtime: apakah respons seperti itu pernah jadi dokumen HTML. |
| `scripts/sync-hardcode-to-cms.mjs:delete-filter-interpolates-cms-supplied-ids` | rejected | Satu-satunya query GROQ yang di-interpolasi. **Aman:** `JSON.stringify` meng-escape kutip, dan grammar `_id` Sanity (`@sanity/client/src/validators.ts:33`, `[A-Za-z0-9_.-]`) tidak memuat metakarakter. |
| `site.js:safeUrl-scheme-allowlist-absent-at-cta-and-event-link-anchors` | rejected | 9 sink URL CMS melewati allowlist `safeUrl` milik repo sendiri. Tapi React DOM `sanitizeURL` memblokir `javascript:`, dan satu-satunya penulisnya adalah editor yang sama. |
| `src/app/brands:hand-tuned-world-pages-missing-publication-gate` | rejected | 5 halaman brand menyajikan konten dokumen yang sudah di-archive di `/brands`, nav, dan sitemap. Same-principal. |
| `scripts/sync-hardcode-to-cms.mjs:resolveLocal-no-path-containment` | rejected | `path.join` + `existsSync` tanpa containment. Hanya developer yang bisa memicu, nilai sekarang semuanya benign. |
| `scripts/sync-cms-to-site.mjs:dry-flag-not-enforced` | rejected | `--dry` adalah dead code, script tetap menulis ke dataset production. Same-principal safety interlock. |
| `repository:release-authority-not-in-source` | rejected | Tidak ada CI, `vercel.json`, atau `CODEOWNERS`. Otoritas release tidak bisa direview dari source. |

**Kenapa tidak ada `confirmed`?** Bukan karena tidak ada bug — karena `confirmed` butuh hasil observasi lokal, dan host ini tidak punya sandbox (lihat §3.5).

### 3.3 Yang sebenarnya rusak tapi bukan security finding

Enam record `rejected` di atas **tetap berisi defect nyata**. Yang paling serius:

| Prioritas | Defect | Lokasi | Dampak |
|---|---|---|---|
| **Tinggi** | `clear` menghapus **seluruh** dokumen `career` tanpa konfirmasi | `scripts/seed-careers.mjs:136-141` | Menghapus semua lowongan live di dataset production karena satu ketikan argumen. Tidak ada prompt, threshold, atau dry-run. |
| ~~**Tinggi**~~ **SELESAI 18/10, watcher dihapus 22/10** | Watcher CMS menulis ke production saat `next dev` boot | `sync-hardcode-to-cms.mjs:306-309,321` | `dryRun` default `false`, `--dry-run` tidak pernah terlihat oleh `startWatcher`. Full patch/create/delete + upload aset setiap boot. |
| **Sedang** | `--dry` mati | `sync-cms-to-site.mjs:105,113` | Operator mengira aman, production tetap ditulis. |
| **Sedang** | Hapus CMS didorong diff posisional | `sync-hardcode-to-cms.mjs:266` | Menghapus satu gambar dari `samsara/page.js` = hapus dokumen CMS di boot `next dev` berikutnya. |
| **Sedah** | 9 sink URL tanpa allowlist | scattered | Inkonsistensi praktik, bukan lubang. |
| **Sedah** | `next/image` tak pernah di-import | `next.config.mjs:4-10` | `images.remotePatterns` jadi **inert** — konfigurasi yang mengiklankan kontrol yang tidak ada. |
| **Rendah** | Snapshot HTML produksi tersimpan tanpa batas | `scripts/dump-html.mjs` dkk | Konten CMS yang belum dimaksudkan publik ikut ter-disk. |

### 3.4 Hardening yang direkomendasikan

1. `scripts/seed-careers.mjs` — minta konfirmasi + tampilkan jumlah dokumen sebelum `clear`.
2. **SELESAI 18/10** — `sync()` dipaksa lapor-saja sejak 18/10: tidak ada upload, patch, atau delete. (Usulan lama:) `sync-hardcode-to-cms.mjs` — jadikan `dryRun: true` default watcher; mutate hanya bila `SYNC_CMS_WRITE=1`.
3. `resolveLocal` — konfirmasi path hasil resolve berada di dalam `public/` sebelum membaca, dan allowlist ekstensi gambar.
4. `sync-cms-to-site.mjs` — hormati `DRY`, atau hapus. Tambahkan aturan lint unused-var di `scripts/`.
5. `HeroCarousel.js:38` — tidak punya validasi apa pun; aman hanya karena semua pemanggil kini lewat `urlFor()`. Pemanggil ke-6 (`samsara/page.js:114`) memakai literal.
6. `.gitignore:47` mengabaikan `.screenshots/` tapi tool menulis ke `../screenshots/` di luar repo.
7. Tambahkan `.github/workflows/` + `CODEOWNERS` agar otoritas release bisa direview.

### 3.5 Batasan yang harus Anda ketahui

- **`run_status: incomplete`.** Validator resmi skill **tidak bisa jalan di Windows**: `readFileWithinLimit()` menolak semua input saat `O_NOFOLLOW`/`O_NONBLOCK` tidak tersedia, dengan komentar sumber "reject all inputs". Saya **tidak** menambal atau mem-bypass ini — kontrol itu yang mencegah symlink race saat membaca file. Sebagai gantinya dipakai 2 pemeriksaan struktural sisi parent (`selfcheck-ledger.cjs`, `selfcheck-findings.cjs`); findings.json membaca `report-schema.json` asli dan keluar **0 error**. Keduanya **bukan** atestasi validator.
- **Tidak ada kode target yang dieksekusi.** Tidak ada Docker, tidak ada WSL, jadi sandbox yang diwajibkan skill tidak bisa disediakan.
- **Verifikasi Phase 5 menemukan 4 sitasi salah** (semuanya pergeseran baris, tidak mengubah verdik). Semua 4 sudah dikoreksi lalu di-check ulang.
- 3 verifier tidak mengeluarkan field root-cause. Field itu tidak dikarang — diberi label eksplisit *parent-derived*.
- Satu run tidak exhaust target. Ini profil `standard`; `deep` akan memecah unit per subsistem.

---

## 4. BAGIAN B — KONTRAK CMS → WEBSITE (temuan operasional utama)

Ini kelas bug yang Anda temukan dengan `postedAt`. Saya cross-reference setiap field di `studio/schemaTypes/` terhadap proyeksi GROQ di `src/sanity/lib/queries.ts` dan terhadap seluruh pemakaian di `src/`.

**Total: 8 `defineField` type, 91 field** (setelah field generik seperti `_key`/`type`/`title` dikecualikan).

### 4.1 Field yang TIDAK PERNAH tampil — terkonfirmasi mati

| Field | Schema | Proyeksi | Ter-render? |
|---|---|---|---|
| **`world.hours`** | `world.ts` — "Opening Hours", array `{day, value}`, *"Jam buka-tutup per hari"* | ✅ `queries.ts:59` | ❌ **0 konsumen di seluruh `src/`.** |
| **`world.sections[].menuPanels[].downloadUrl`** | `world.ts` — "Download / Open URL", *"Untuk tombol unduh menu PDF"* | ✅ `queries.ts:36` | ❌ Hanya 1 hit — di proyeksi itu sendiri. `MenuGallery.js` tidak pernah membacanya. |

Keduanya **terambil dari Sanity tapi dibuang**. Editor mengisi "Jam Buka" untuk setiap brand — tidak muncul di mana pun. Editor mengisi URL unduh PDF menu — tombolnya tidak pernah ada.

### 4.2 Halaman brand yang mengabaikan sebagian besar field CMS-nya

Kelima brand punya route statis khusus (`/samsara`, `/svarga`, `/acasa`, `/outpace`, `/grove`) yang **tidak memakai renderer `[slug]`**. Field yang dibaca tiap halaman:

| Field CMS | `[slug]` | samsara | svarga | acasa | outpace | grove |
|---|:--:|:--:|:--:|:--:|:--:|:--:|
| `tagline` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `description` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `image`, `gallery` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `specifications` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `sections` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `ctas`, `instagramUrl` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `address` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `hours` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `menuPanels` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `theme`, `heroTitle` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `seo*`, `socialImage`, `noIndex` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Konsekuensi untuk editor:** mengisi `Gallery`, `Address`, `Instagram URL`, atau `Action Buttons` untuk Outpace dan Grove di Sanity **tidak melakukan apa-apa** — kedua halaman itu memakai konstanta hardcoded (`outpace/page.js` dan `grove/page.js` tidak punya satu pun pembacaan `world.address`, `world.hours`, `world.instagramUrl`, maupun `world.ctas`). Menu PDF untuk brand mana pun juga tidak akan muncul, karena `downloadUrl` tidak pernah di-render.

### 4.3 Akar masalah yang sama

Schema `world.ts` mendokumentasikan `sections`, `menuPanels`, `menuHeading` sebagai "alternatif cepat" - dan `[slug]/page.js` memang menghormati ketiganya. Tapi 5 route hardcoded mengulang logic render sendiri secara parsial, lalu **berhenti di tengah jalan**. Berbeda dengan `postedAt` - di sana field-nya bahkan *sudah* diambil dengan benar (`queries.ts:192`) dan dipakai untuk JSON-LD; hanya lapisan render yang lupa.

Jadi pola ini: **CMS contract ditulis di repo Studio, tapi tidak ada satu pun mekanisme yang memaksa website mana pun untuk menghormati kontraknya.** Field bisa lolos 3 tahap (ada di schema → ada di proyeksi → dibaca di komponen) dan tetap tidak tampil kalau tahap ke-4 — pemanggilnya — tidak memakainya.

### 4.4 Rekomendasi untuk kelas bug ini

1. **Perlakukan renderer brand sebagai satu implementasi.** Ubah 5 halaman hardcoded agar memakai komponen yang sama dengan `[slug]`, dengan override copy per brand. Hilangkan duplikasi.
2. **Tambah contract test** yang membandingkan setiap field schema terhadap: (a) ada di proyeksi, (b) ada di minimal satu komponen. Saya sudah menuliskan alat bantu untuk ini di `run-1/schema-crossref.cjs` dan `prove-absent.cjs` — keduanya bisa dijalankan ulang tiap kali schema berubah.
3. **Perlakukan field mati sebagai keputusan, bukan kebetulan.** Kalau `world.hours` memang tidak mau dipakai, hapus dari schema. Kalau mau dipakai, render di semua 6 halaman.

---

## 5. Gate discharged

| Gate | Status | Catatan |
|---|---|---|
| **GATE 0 — Release blockers** | ✅ PASS | `next build` sukses, TS bersih, lint 0 error (28 warning `<img>` bawaan) |
| **GATE 1 — Secret & credential** | ✅ PASS | `SANITY_API_TOKEN` tidak pernah direferensikan dari `src/`; `.env*` ter-ignore; tidak ada token di history (168 commit diperiksa) |
| **GATE 2 — XSS** | ✅ PASS | 5 sink JSON-LD semuanya lewat `jsonLdHtml()`; CSP nonce + `strict-dynamic`, tanpa `unsafe-inline` |
| **GATE 3 — AuthN/AuthZ** | ✅ N/A | Tidak ada auth, session, API route, atau server action. Tidak ada yang bisa dilewati. |
| **GATE 4 — Supply chain** | ✅ PASS runtime | Lockfile v3, 460/460 paket punya integrity digest, tidak ada lifecycle script. `typescript` tidak dideklarasikan padahal 4 file `.ts` di-import. |
| **GATE 5 — Release governance** | ⚠️ GAP | Tidak ada CI/`vercel.json`/`CODEOWNERS`. Otoritas production tidak bisa direview dari source. |
| **GATE 6 — CMS contract** | ❌ **FAIL** | 5 field mati, 2 halaman brand mengabaikan sebagian besar field. Ini gate yang tidak pernah ada di audit sebelumnya. |

---

## 6. Rekomendasi urutan pengerjaan

1. **Hentikan risiko data** — konfirmasi untuk `seed-careers.mjs clear`, dan `dryRun` default `true` di watcher. Ini satu-satunya temuan dengan potensi kehilangan data.
2. **Perbaiki 2 field mati** — render `world.hours` dan `downloadUrl`, atau hapus dari schema. Murah, dan langsung menutup kelas bug yang Anda temukan.
3. **Satukan renderer brand** — hilangkan 5 implementasi partial. Ini yang mencegah `postedAt` terulang.
4. **Tambahkan contract test** schema→proyeksi→render agar kelas bug ini tidak bisa kembali diam-diam.
5. **Tambahkan CI + `CODEOWNERS`** agar release authority bisa direview.

---

## 7. Artefak

| File | Isi |
|---|---|
| `run-metadata.json` | Metadata, 6 deviation, alasan `incomplete`, substitute validator |
| `architecture.md` | Principal, trust boundary, entry surface, starting path |
| `coverage-ledger.json` | 30 unit, 7 attack class, tiap unit punya check yang memiliki path |
| `findings.json` | 7 record (1 needs_validation, 6 rejected) — lolos konformansi skema |
| `REPORT.md` / `FINDINGS-DETAIL.md` / `NEEDS-VALIDATION.md` | Laporan turunan langsung dari `findings.json` |
| `schema-inventory.cjs` / `schema-crossref.cjs` / `prove-absent.cjs` | Alat bantu re-check rantai schema→render |
| `selfcheck-ledger.cjs` / `selfcheck-findings.cjs` | Pemeriksaan struktural pengganti validator resmi |

**Catatan akhir:** bagian A dan B tidak boleh dicampur. "0 vulnerability confirmed" adalah pernyataan tentang bukti yang tersedia, bukan jaminan situs aman. Dan bagian B menunjukkan bahwa inheritance dari audit sebelumnya — yang tidak memeriksa rantai CMS sama sekali — adalah bagaimana `postedAt` bisa lolos begitu lama.

---

## 8. Audit ulang — 21 Oktober 2026

Audit kedua atas kedua repo **pada kode saat ini** (`samsaragroup-website` + `samsaragroup-sanity`), mencakup pula integrasi Sanity ↔ website ↔ Vercel. Metode: empat pemburu atas 16 unit cakupan, lalu tiga verifier independen yang tidak melihat hasil pemburunya. Tanpa eksekusi kode target dan tanpa memanggil endpoint ter-deploy mana pun.

**Hasil: 1 `confirmed`, 5 `needs_validation`, 14 `rejected`.** Perinciannya disimpan di luar repo ini (folder audit terpisah), sesuai keputusan bahwa repo ini publik.

### 8.1 Yang berubah sejak audit pertama

Audit pertama menutup dengan **0 temuan `confirmed`**. Kini ada satu — dan penyebabnya bukan kode yang bertambah buruk, melainkan kesadaran bahwa **batas baca dataset tidak berada di kode**.

### 8.2 Satu temuan terkonfirmasi: batas baca dataset

**`status`/`featured`/`noIndex` adalah kontrol presentasi, bukan kontrol akses.** Field itu menyembunyikan konten dari HTML yang dirender website, tidak dari siapa pun yang membaca dataset secara langsung. Konsekuensinya: konten yang ditandai belum tampil, beserta seluruh aset, berada di luar kendali halaman web.

Severity **Medium**, dan hampir seluruh bobotnya berasal dari insiden 19 Oktober (dokumen pribadi yang tidak direferensikan sempat bisa diunduh publik) — bukan dari konten marketing yang memang dipublikasikan.

**Klasifikasi yang jujur:** ini kebocoran kerahasiaan atas data milik kita sendiri, **bukan** pelewatan otorisasi. Penulisan tetap butuh token dan ditolak tanpa token. Tidak ada pihak ketiga yang memperoleh kemampuan baru.

**Tiga pilihan, dan hanya tiga:**

| Pilihan | Konsekuensi |
|---|---|
| Dataset dibuat **private** | Satu-satunya cara menutup batas. Butuh paket berbayar **dan** pekerjaan tambahan, karena gambar saat ini ditautkan langsung ke CDN aset |
| Tetap public + **tata kelola data** | Kendali efektif satu-satunya di paket saat ini: jangan pernah unggah dokumen pribadi (aturan pasca-KTP), dan bersihkan aset tak terpakai secara berkala |
| Terima risikonya secara sadar | Sah saja, asal dicatat sebagai keputusan — bukan sebagai kelalaian |

### 8.3 Yang ternyata sudah benar — jangan dikerjakan ulang

Empat hal yang tampak mencurigakan ternyata sudah dijaga dengan benar. Dicatat di sini supaya tidak ada yang menghabiskan waktu "memperbaikinya":

- **Escape JSON-LD kedap.** Breakout `</script>`, komentar HTML, maupun injeksi struktur JSON tidak mungkin.
- **Sanitizer React aktif di jalur server**, bukan hanya di browser — terverifikasi langsung dari paket yang terpasang. Klaim lama di dokumen ini bahwa React memblokir `javascript:` **benar** untuk render server juga.
- **Interpolasi GROQ pada operasi hapus aman**, dan seluruh jalur mutasi sudah mati di belakang satu konstanta `dryRun`.
- **Tidak ada sink berbahaya lain** di seluruh kedua repo.

### 8.4 Yang perlu diperbaiki (kecil, tapi menyesatkan kalau dibiarkan)

1. **Sebagian selesai 23/10.** Tombol About di homepage sekarang lewat `safeHref()` di `src/app/page.js`; tautan event dan tautan brand dari slug masih mengandalkan sanitasi React/schema. Bukan kerentanan (penulisnya hanya operator, dan `javascript:` sudah diblokir), tetapi klaim di dokumentasi sudah diluruskan.
2. **Bentuk slug tidak divalidasi sama sekali.** Cukup tambahkan aturan karakter sederhana sebelum slug dipakai membentuk tautan.
3. ~~**Komentar basi di `client.ts`.**~~ **Selesai 22/10** — komentar sekarang menyatakan klien server-only.
4. ~~**`ignoreCommand` hanya membandingkan commit terakhir.**~~ **Selesai 23/10** — `scripts/should-build.sh` membandingkan SHA deployment terakhir (fallback `HEAD^`) dengan guard `git cat-file -e`; SHA hilang → build, bukan gagal.

### 8.5 Kredensial

Token tulis di `.env.local` **tidak diperlukan lagi** — semua mutasi sudah mati, dan operasi baca tidak butuh token. Audit menemukan salinannya juga tersimpan di cache build lokal. Tidak ditemukan jejaknya di riwayat git maupun di arsip backup.

**Tindak lanjut 22/10:** token sudah **dihapus dari `.env.local`**, `.next/` dibersihkan, dan `sync-hardcode-to-cms.mjs` dibuat tokenless (auth hanya dikirim kalau token ada). Yang masih perlu: **cabut/rotasi token itu di dashboard Sanity** — langkah itu hanya bisa dilakukan pemilik akun.

### 8.6 Batas audit ini

- **Validator resmi tidak bisa jalan di Windows** (keterbatasan API berkas di platform ini). Struktur artefak diperiksa sendiri, tetapi itu bukan pengganti validator resmi. Status run: `incomplete`.
- **Sandbox yang diwajibkan tidak tersedia** di mesin ini, sehingga tidak ada kode target yang dieksekusi sama sekali.
- **Lima kandidat masih terbuka** karena fakta penentunya ada di luar source: semantik cache CDN untuk CSP, perilaku `perspective` Content Lake, model peran folder Google Drive, perilaku argumen PowerShell terhadap rclone, dan lingkup ACL token. Rencana validasi untuk masing-masing sudah tersedia; tidak ada satupun yang berdampak langsung pada pengunjung situs.