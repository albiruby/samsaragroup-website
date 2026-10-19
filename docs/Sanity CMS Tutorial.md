# Sanity CMS — Panduan Lengkap

Panduan ini untuk whoever yang akan mengubah konten website Samsara Group lewat
Sanity Studio. Tidak perlu menyentuh kode.

---

## 0. Ringkasan Cepat

| | |
|---|---|
| **Project ID** | `p5zu5azj` |
| **Dataset** | `production` |
| **Studio online** | https://samsaragroup.sanity.studio |
| **Studio lokal** | http://localhost:3333 |
| **Website** | https://samsaragroup.vercel.app |

**Konsep inti:** Sanity adalah sumber kebenaran untuk konten. Website hanya
*membaca* dari Sanity. Kalau berubah di Studio, berubah di website.

---

## 1. Struktur Project

```
D:\Cek Website JSD - Infia\Sams Group\
├── studio-samsara\        ← Sanity Studio (panel admin)
│   ├── sanity.config.ts     ← struktur sidebar
│   └── schemaTypes\
│       ├── world.ts         ← BRAND. File ini yang paling sering dipakai.
│       ├── brandNav.ts      ← Isi dropdown BRANDS di semua halaman
│       ├── event.ts         ← Event di /events
│       ├── contactInfo.ts   ← Data di /contact
│       ├── carouselImage.ts ← Marquee gambar homepage
│       ├── career.ts        ← Lowongan di /career
│       ├── careerPage.ts    ← Teks halaman /career
│       └── index.ts         ← Daftar semua tipe
│
└── Versi Next.js\           ← Website (kode, biasanya tidak perlu diubah)
    └── src\
        ├── sanity\lib\queries.ts   ← Query yang membaca isi CMS
        ├── sanity\lib\brands.ts    ← Mengubah data jadi bentuk komponen
        └── app\                     ← Halaman
```

**Dua hal yang harus diingat:**

| Kapan berubah | Apa yang berubah |
|---|---|
| Edit di Studio | Konten di website berubah |
| Edit `queries.ts` | Field baru dari CMS bisa ditarik ke kode |

Kalau sebuah field tidak muncul di Studio, itu karena `world.ts` belum
mendefinisikannya. Kalau field muncul di Studio tapi tidak tampil di website,
itu karena `queries.ts` belum membacanya.

### Struktur sidebar

Sidebar disusun per halaman website, jadi jelas konten mana milik halaman mana:

```
Content by Page
├── Home Page — Rolling Gallery           → /
├── Brands & Brand Pages — World          → /samsara, /svarga, dst
├── Header Menu — BRANDS Dropdown          → nav di semua halaman
├── Events Page — Event                   → /events
├── Career Page — Career                  → /career (daftar lowongan)
├── Career Page — teks halaman            → /career (hero, SEO)
└── Contact Page — Contact Info           → /contact
```

### Alur data: dari CMS ke halaman

```
Dokumen World di Sanity
        │
        ├─ tagline, image, gallery, sections, ctas ...
        │
        ▼
   queries.ts  ──►  world's description   (diambil dari section "Text Block")
              ──►  world's specifications (diambil dari section "Specifications")
              ──►  world's tagline, image, gallery  (langsung dari field)
        │
        ▼
   Halaman brand ──►  <p>{world?.description}</p>
                    {world?.specifications?.map(...)}
```

**Artinya:** kolom **Description** dan **Specifications** yang muncul di
website berasal dari **section**, bukan dari field datar.

| Di Studio | Website menampilkan |
|---|---|
| `sections` → tipe **Text Block** → Body Text | Paragraf THE VISION |
| `sections` → tipe **Specifications** → Specifications | Tabel spesifikasi |
| `tagline` | Judul baris dropdown + tagline di bawah judul |
| `image` | Gambar di kartu `/brands` |
| `gallery` | Carousel di atas halaman |

Kalau field `description` atau `specifications` diisi langsung di level atas,
**nilai itu yang menang** dan section diabaikan. Pakai cara ini hanya kalau
memang mau override.

---

## 2. Menjalankan Studio

**Pakai `Dev.cmd`**, bukan `npm run dev` langsung:

```
D:\Cek Website JSD - Infia\Sams Group\Dev.cmd
```

Launcher ini menjalankan website (port 3000) dan Studio (port 3333)
sekaligus, plus watchdog yang auto-restart kalau server mati.

Studio juga bisa dibuka langsung di
https://samsaragroup.sanity.studio — isinya sama persis, tanpa perlu kode lokal.

> **Kenapa harus pakai `Dev.cmd`?** Studio menjalankan dengan flag
> `--no-auto-updates`. Tanpa flag itu, Sanity menanyakan "upgrade local
> versions?" yang butuh stdin. Kalau dijalankan tanpa console (misal dari
> `Start-Project`), prosesnya mati sebelum port 3333 kebuka.

Project ID `p5zu5azj`, dataset `production`.

> Login butuh akun yang sudah diundang sebagai member project. Kalau muncul
> "must have a role", hubungi admin project.

### Reload setelah ubah schema

Kalau kamu mengubah `world.ts` (menambah field baru), **harus reload browser**,
bukan hanya refresh biasa:

```
Ctrl + Shift + R
```

Kalau masih muncul warning **Unknown fields found**, berarti browser masih
memakai schema lama.

### Kalau ubah schema di kode

Studio online **tidak** auto-deploy dari GitHub. Kalau kamu mengubah
`schemaTypes/*.ts`, wajib jalankan:

```powershell
cd "D:\Cek Website JSD - Infia\Sams Group\studio-samsara"
npx sanity deploy
```

Kalau tidak, Studio online masih pakai schema lama dan field baru tidak akan
muncul.

Sebaliknya, **website** auto-deploy dari GitHub. Kalau tidak, trigger manual
di Vercel → Deployments → `⋯` → Redeploy.

---

## 3. Tipe Dokumen: World (Brand)

Satu dokumen `world` = satu brand. Ada 5 sekarang: Samsara, Svarga, Acasa,
Outpace, Grove.

Field dikelompokkan jadi 9 tab supaya tidak berantakan.

### 3.1 Identity

| Field | Wajib | Arti |
|---|---|---|
| **Name** | ya | Nama brand. Tampil besar di halaman brand dan sebagai judul kartu di `/brands`. Maks 60 karakter. |
| **Slug** | ya | Alamat halaman. `samsara` → `/samsara`. Tombol **Generate** isi otomatis dari Name. |

> Slug sudah live di website. Kalau diganti, URL lama jadi rusak (404).
> Kalau memang harus ganti, bikin redirect di hosting.

### 3.2 Listing & Navigation

Field di sini yang mengatur brand muncul di mana-mana.

| Field | Arti | Contoh |
|---|---|---|
| **Tagline** | Judul baris di dropdown BRANDS + teks di bawah judul halaman + kartu `/brands` | `The Listening Room` |
| **Speciality** | Baris miring kecil di dropdown navigasi | `Vinyl - Dining - Culture` |
| **Card Image** | Gambar kartu di `/brands`. Rasio ideal **potret 4:5** | foto interior |
| **Brand Logo** | Logo putih di tengah kartu & marquee footer | logo PNG transparan |

**Tagline sekarang dipakai di 4 tempat:**

| Di Studio | Tampil di website |
|---|---|
| `tagline` | Judul baris di kolom kiri dropdown BRANDS (desktop) |
| `tagline` | Judul baris di popup BRANDS (mobile) |
| `tagline` | Teks miring di bawah nama brand, kartu `/brands` |
| `tagline` | Tagline di bawah judul besar halaman brand |

Jadi `tagline` itu field palingAGO impactful di dokumen ini. **Wajib diisi.**

> Field **Category** (`ICONIC` / `SPECIALITY` / `EVERYDAY` / `WELLBEING`)
> sudah **dihapus** dari schema. Tidak dipakai website lagi. Pengaturan baris
> dropdown sekarang ada di dokumen **BRANDS Dropdown** — lihat [section 3.10](#310-tipe-dokumen-brandnav--isi-dropdown-brands).

**Logo:** kalau dikosongkan, kartu dan marquee otomatis pakai teks nama. Tidak
apa-apa untuk brand yang belum punya logo.

### 3.3 Hero & Copy

| Field | Arti |
|---|---|
| **Theme** | Mode warna halaman. Umumnya `dark`. |
| **Hero Eyebrow** | Label kecil di atas judul. Kosongkan → pakai `WORLDS`. |
| **Hero Title** | Judul besar. Kosongkan → pakai nama brand dalam huruf besar. |
| **Hero Intro** | Paragraf pendek di bawah judul hero. |
| **Gallery (Hero Carousel)** | Slider besar di atas halaman brand. Maks 20 gambar. |
| **Description** | Ringkasan brand. Dipakai untuk SEO kalau SEO Description kosong. **Sebaiknya dibiarkan kosong** — kalau diisi, nilainya menggantikan teks dari section Text Block. |

**Gallery:** setiap gambar punya **Alt Text** sendiri. Isi Alt Text — itu
dipakai screen reader dan Google Images. Kalau kosong, website memakai nama
brand.

Kalau gallery hanya berisi 1 gambar, tampil jadi gambar lebar tunggal, bukan
carousel.

### 3.4 Sections

Ini bagian terpenting untuk halaman brand. Section disusun dari atas ke bawah, dan
urutannya **persis seperti di list**.

Field yang tidak dipakai sebuah section otomatis disembunyikan. Jadi section
`text` yang Body-nya kosong tidak akan muncul sama sekali.

#### 5 Tipe Section

| Tipe | Untuk | Field yang dipakai |
|---|---|---|
| **Text Block** | Judul + paragraf cerita | Heading, Body Text, Section Image |
| **Specifications** | Tabel label di kiri, nilai di kanan | Heading, Specifications |
| **Feature Cards** | Grid kartu (mis. menu-fix untuk brand olahraga) | Heading, Features |
| **Menu** | Viewer halaman menu | Heading, Menu Panels |
| **Map** | Peta lokasi | Heading, Map Lat/Lng/Zoom |

#### 3.4.1 Text Block

- **Heading** — contoh: `THE VISION`
- **Body Text** — pisahkan antar paragraf dengan **baris kosong**.
- **Section Image** - opsional, tampil di kolom kanan. Cocok untuk brand yang punya
  foto pendukung.

#### 3.4.2 Specifications

Daftar baris `Label` + `Value`.

```
Concept          | Extra Sensory Perception
Listening Space  | Bogor's first - vinyl library
Cuisine          | Indo-Kolonial - Nasi Campur Madura
```

Label otomatis jadi huruf besar semua (CSS). Tulis normal saja: `Concept`, bukan
`CONCEPT`.

> **Tempat mengedit tabel spesifikasi di website:** section tipe
> **Specifications**. Slave field `specifications` di level atas dokumen
> **jangan diisi** — kalau diisi, dia menggantikan section dan jadi membingungkan.
>
> Semua 5 brand punya section ini. Section-nya kosong akan otomatis hilang dari
> halaman.

#### 3.4.3 Feature Cards

Grid kartu. Contoh di Outpace: PROTEIN, CARBS, VITAMIN, HYDRATION.

- **Title** — judul kartu, biasanya huruf besar (PROTEIN)
- **Copy** — paragraf penjelasan
- **Image** — opsional. Kalau diisi, gambar tampil di atas kartu.

Tanpa Image, kartu jadi teks saja.

#### 3.4.4 Menu

Lihat [section 4](#4-menu-lengkap).

#### 3.4.5 Map

| Field | Contoh | Keterangan |
|---|---|---|
| Map Latitude | `-6.6167` | Antara -90 dan 90 |
| Map Longitude | `106.85` | Antara -180 dan 180 |
| Map Zoom | `16` | 1 = seluruh dunia, 19 = bangunan |

**Cara cari koordinat:** buka Google Maps → klik lokasi → salin angka desimal
pertama (latitude) dan kedua (longitude).

Section Map **tidak muncul** kalau Lat atau Lng kosong.

### 3.5 Menu

Hanya ada **satu cara** pasang menu.

Buat section tipe **Menu**, lalu isi **Menu Panels** di dalamnya.
Heading section dipakai sebagai judul; kalau Heading dikosongkan, yang dipakai
adalah **Menu Heading** (default `MENU`).

> Field **Standalone Menu Panels** sudah dihapus dari schema (18/10). Website
> tidak pernah membacanya, jadi menu yang diisi di sana tidak muncul di halaman
> mana pun. Semua menu harus lewat section **Menu**.

### 3.6 Location & Map

| Field | Arti |
|---|---|
| **Address** | Alamat fisik. Tampil di blok FIND US halaman brand. |
| **Opening Hours** | Jam buka **per kategori**, bukan per hari. Tiap baris = Label + Hours. |

Hours tampil di blok **FIND US** (bersama alamat) pada kelima halaman brand, dan
di section peta template `[slug]`.

Contoh Opening Hours:

```
Weekdays | 10:00 - 22:00
Weekend  | 09:00 - 01:00
```

Kalau Hours kosong, blok jam buka **tidak dirender sama sekali** — tanpa judul dan
tanpa jarak kosong. Alamat tetap tampil sendiri.

### 3.7 Contact & Links

#### Instagram URL

Tampil sebagai tombol **INSTAGRAM** full-width di bawah halaman brand.

#### Action Buttons

Daftar tombol. **Urutan di list = urutan tampil di website.**

| Button Type | Label default | Untuk |
|---|---|---|
| `reservation` | RESERVATION | WhatsApp / booking |
| `roomrate` | ROOM RATE | Daftar tarif / harga kamar |
| `instagram` | INSTAGRAM | Profil Instagram |

Hanya **tiga** jenis itu. Jenis `menu`, `location`, `career`, dan `links` sudah
**dibuang dari schema** — lokasi ditampilkan lewat peta dan menu lewat section
menu sendiri, jadi tombol untuk keduanya tidak diperlukan.

**Custom Label** opsional. Kosongkan untuk pakai label default.

Tombol membuka tab baru, jadi URL harus lengkap dengan `https://`.

Data saat ini:

| Brand | Tombol |
|---|---|
| Samsara | RESERVATION, INSTAGRAM |
| Svarga | RESERVE, INSTAGRAM |
| Acasa | RESERVE PADEL, RECEPTIONIST, ROOM RATE, INSTAGRAM |
| Outpace | — |
| Grove | — |

> Tombol Acasa datang dari **kode** (`src/app/acasa/page.js`), bukan CMS — jadi
> tetap tampil walau Action Buttons-nya kosong. Aturannya: tombol dari CMS menang
> per jenis, kode hanya menambal jenis yang belum ada di CMS.

Outpace dan Grove sengaja belum punya tombol (brand belum rilis).

### 3.8 SEO

| Field | Keterangan |
|---|---|
| **SEO Title** | Kosongkan → `<Nama> - Samsara Group`. Maks 60 karakter. |
| **SEO Description** | Idealnya 140–160 karakter. Maks 165. |
| **Social Share Image** | Tampil saat link dibagikan di WhatsApp/Instagram. Ideal 1200×630. Kosongkan → pakai Card Image. |
| **Hide from Search Engines** | `true` = jangan masuk Google. Untuk draft atau halaman arsip. |

**SEO Title dan Description sangat penting.** Ini yang muncul di hasil
pencarian Google dan saat link dibagikan. Tulis dalam bahasa Inggris.

### 3.9 Publishing

Tiga field ini mengatur kapan dan di mana brand tampil.

| Field | Nilai | Efek |
|---|---|---|
| **Order** | 1–999 | Urutan tampil di `/brands`. Angka kecil lebih dulu. |
| **Status** | `active` | Tampil penuh di website |
| | `draft` | Tidak muncul di dropdown / `/brands` / sitemap |
| | `archived` | Sama seperti draft — disembunyikan dari daftar |
| **Featured** | `true` / `false` | **`false` bikin halaman brand 404** |

> **Penting — bedanya `draft` dan `featured`:**
>
> - `featured = false` → brand hilang **total**. Halaman `/samsara` balas
>   **404**, tidak muncul di dropdown, `/brands`, maupun sitemap. Sekaligus
>  _runner_-nya ikut hilang, karena footer dan dropdown membaca daftar brand
>   yang sama.
> - `status = draft` → brand hilang dari **daftar saja**, tapi URL-nya masih
>   hidup.
>
> Kalau hanya mau menyembunyikan dari daftar sementara, pakai `status`.
> Jangan pakai `featured = false` kecuali memang mau hilang total.

> **Pengecualian untuk 5 brand lama:** `samsara`, `svarga`, `acasa`, `outpace`,
> dan `grove` punya halaman statis di kode (`src/app/samsara/page.js` dst).
> Halaman-halaman itu **tidak** mengecek status/featured — jadi mengubah
> `status` atau `featured` hanya berpengaruh ke daftar, tidak membuat 404.
> Aturan `featured = false` = 404 berlaku penuh untuk brand **baru** yang pakai
> template dinamis `src/app/[slug]/page.js`.

Urutan Order saat ini:

| Order | Brand |
|---|---|
| 1 | Samsara |
| 2 | Svarga |
| 3 | Acasa |
| 4 | Outpace |
| 5 | Grove |

Brand baru tanpa Order akan muncul **paling akhir**.

> Urutan baris di **dropdown** tidak diatur dari sini — diatur di dokumen
> BRANDS Dropdown. Lihat [section 3.10](#310-tipe-dokumen-brandnav--isi-dropdown-brands).

---

### 3.10 Tipe Dokumen: brandNav — Isi Dropdown BRANDS

Semua brand punya halaman sendiri di Studio. Tapi **baris dropdown BRANDS**
dikendalikan satu dokumen terpisah: **Header Menu — BRANDS Dropdown**.

Ada tepat satu dokumen ini. Jangan buat dokumen kedua — website hanya membaca
yang pertama.

#### Struktur

```
1 - Dropdown Rows
  └─ rows[]  →  {
       title   : "The Listening Room"
       brands[]: [ reference ke dokumen World ]
     }

2 - Labels
  ├─ seeAllLabel : "See All Brands →"
  └─ emptyLabel  : "Hover a brand"
```

| Field | Arti |
|---|---|
| **Row Title** | Judul di kolom kiri dropdown. Kosongkan → otomatis pakai `tagline` brand pertama. |
| **Brands** | Brand di bawah judul ini, sebagai reference. Urutan = urutan tampil. |

#### Aturan penting

1. **Urutan array = urutan baris.** Mau pindah posisi? Geser barisnya di Studio.
2. **Brand harus `Status = active`.** Kalau status-nya draft/archived, brand
   **tidak muncul** walau sudah ditaruh di sini.
3. **Baris tanpa brand kosong disembunyikan** otomatis.
4. **Dua baris tidak boleh judul sama.** Kalau sama, website menambah nama
   brand otomatis (`The X - Samsara`) supaya tidak konflik.
5. **`seeAllLabel` kosong = tautan disembunyikan.** `emptyLabel` kosong = teks
   placeholder tidak tampil.

#### Isi saat ini

| # | Row Title | Brand |
|---|---|---|
| 1 | The Listening Room | Samsara |
| 2 | The Heritage Table | Svarga |
| 3 | The Leisure Retreat | Acasa |
| 4 | The Runners Club | Outpace |
| 5 | The City Backyard | Grove |

Brand baru **wajib** ditambahkan ke sini, kalau tidak dia tidak akan muncul di
dropdown mana pun.

---

## 4. Menu Lengkap

Menu di Sanity berupa daftar gambar halaman menu.

### 4.1 Menu Panel

| Field | Wajib | Arti |
|---|---|---|
| **Tab Label** | ya | Label di atas gambar. Untuk 1 panel boleh dikosongkan. |
| **Menu Image** | ya | Gambar halaman menu, **format vertikal (potret)**. |
| **Layout** | ya | `Zoomable viewer` atau `Full page`. |
| **Download / Open URL** | tidak | Link unduh PDF, misal Google Drive. |

### 4.2 Cara tampil ditentukan jumlah panel

Website otomatis menyesuaikan:

| Jumlah panel | Tampilan |
|---|---|
| 1 | Satu gambar besar, bisa di-zoom |
| 2 | Dua kolom.side by side |
| 3 atau lebih | Pager: panah kiri/kanan + angka halaman |

Jadi untuk menu 36 halaman Samsara: tambah 36 panel, website otomatis jadi
pager. **Jangan** mengirim semua gambar sekaligus — itu berat dan lambat.

### 4.3 Layout

**`Zoomable viewer`** (default) — gambar dalam border, klik untuk zoom. Panah
kiri/kanan keyboard untuk pindah halaman.

**`Full page`** — gambar tanpa border, isi penuh lebar container.

### 4.4 Memberi nama halaman yang jelas

Untuk menu panjang seperti Samsara, Tab Label otomatis diisi `Page 1`, `Page 2`,
dan seterusnya. Boleh diganti dengan nama sebenarnya: `Drinks`, `Main Course`,
`Dessert`.

Kalau Tab Label dikosongkan, fallback ke `Menu`.

### 4.5 Format gambar

- **Rasio:** vertikal (potret) paling cocok, sekitar 3:4 atau 2:3
- **Resolusi:** 1200–2000 px lebar cukup
- **Format:** WebP atau JPG
- **Ukuran file:** di bawah 500 KB per gambar lebih baik

Menu 36 halaman × 500 KB = 18 MB. Kalau halaman terasa lambat, kompres dulu
sebelum upload.

### 4.6 Data menu saat ini

| Brand | Panel | Isi |
|---|---|---|
| Samsara | 36 | `Page 1` – `Page 36` |
| Svarga | 1 | `Main Menu` |
| Acasa | 2 | `Food`, `Beverages` |
| Outpace | 0 | — |
| Grove | 0 | — |

---

## 5. Menambah Brand Baru

### 5.1 Di Studio

1. Buka tab **Brands & Brand Pages — World** di sidebar
2. Klik ikon **+** di dalam daftar, jangan di sidebar
3. Pilih tipe **World**
4. Isi minimal:
   - **Name** — contoh: `Selatan`
   - **Slug** — klik **Generate**
   - **Tagline** — contoh: `The Sunset Club` (wajib, ini judul di dropdown)
   - **Card Image** — foto potret 4:5
   - **Gallery** — minimal 1 gambar
   - **Status** — `active`
   - **Featured** — `true`
   - **Order** — angka setelah brand terakhir (misal `6`)
5. Tambah section sesuai kebutuhan
6. Klik **Publish**
7. **WAJIB:** buka **Header Menu — BRANDS Dropdown** → `Rows` → tambah baris
   baru → isi **Row Title** → pilih brand di **Brands**

> **Langkah 7 sering terlupakan.** Tanpa itu, brand baru akan muncul di `/brands`
> tapi **tidak muncul di dropdown BRANDS** mana pun.

> **Slug terkunci.** `samsara`, `svarga`, `acasa`, `outpace`, `grove` dipakai
> route statis di kode. Studio akan menolak slug itu untuk brand baru dengan
> pesan: *"Slug dipakai halaman statis di website."* Ini deliberate — pakai slug
> lain.

### 5.2 Halaman brand-nya sudah otomatis

Brand baru **tidak perlu** file di kode. `src/app/[slug]/page.js` sudah menjadi
template generik yang membaca semua field dari Sanity — teks, gambar, sections,
tombol, peta. Tinggal isi di Studio.

Kalau brand punya layout benar-benar khusus (seperti Outpace saat ini yang punya
aturannya sendiri), barulah perlu buat folder `src/app/nama-brand/page.js`.

> **Penting:** route statis (`src/app/samsara/`) selalu menang atas route
> dinamis (`src/app/[slug]/`). Jadi brand yang punya folder sendiri tidak akan
> terpakai oleh `[slug]`.

### 5.3 Checklist sebelum Publish

```
[ ] Name terisi
[ ] Slag benar (tidak ada typo)
[ ] Card Image terupload (potret 4:5)
[ ] Gallery minimal 1 gambar
[ ] Tagline terisi
[ ] Category dipilih
[ ] Order diisi (tidak bentrok dengan brand lain)
[ ] Status = active
[ ] Semua Alt Text gallery terisi
[ ] Section wajib terisi (tidak ada section kosong)
[ ] Tombol CTA punya URL lengkap dengan https://
[ ] Koordinat peta dalam batas -90..90 dan -180..180
[ ] Publish diklik
```

---

## 6. Workflow Publish

1. Edit di Studio
2. Klik **Publish** (tombol kanan atas)
3. Tunggu **maks 60 detik**
4. Refresh website dengan **Ctrl + Shift + R**

Kalau masih belum berubah, tunggu 60 detik lagi lalu refresh.

### Kenapa perlu tunggu?

Website meng-cache respons Sanity selama 60 detik. Ini setting di
`src/sanity/lib/queries.ts`:

```js
const revalidate = { next: { revalidate: 60 } };
```

Cache ini penting supaya website tidak lambat dan tidak kena rate limit Sanity.
Perubahan baru terlihat setelah 60 detik.

---

## 7. Troubleshooting

### "Unknown fields found"

Data punya field yang tidak ada di schema.

**Penyebab:** `world.ts` di-revert atau diganti, tapi data di Sanity masih
punya field versi lama. Atau `world.ts` diubah tapi browser belum reload.

**Solusi:**
1. Buka `world.ts`, pastikan field yang disebut warning ada di dalamnya
2. `Ctrl + Shift + R` di Studio
3. Kalau masih muncul, jalankan audit:

```powershell
cd "D:\Cek Website JSD - Infia\Sams Group\Versi Next.js"
node scripts/audit-schema.mjs
```

Script ini membaca semua dokumen di Sanity lalu bandingkan dengan field yang
didefinisikan di `world.ts`.

### Field tidak muncul di Studio

Maksudnya field itu memang belum ada di schema. Buka `world.ts`, tambahkan
`defineField({...})`, reload Studio dengan `Ctrl + Shift + R`.

### Perubahan tidak tampil di website

1. Sudah **Publish**? (bukan cuma Save)
2. Sudah lewat 60 detik?
3. Refresh dengan **Ctrl + Shift + R**, bukan F5 biasa
4. Still tidak? cek browser console (F12) untuk error

### Konten berantakan //layout rusak

- Section kosong tidak muncul — itu normal, bukan bug
- Section `map` tanpa Lat/Lng tidak muncul — isi keduanya
- Menu banyak tapi tampil semua sekaligus — kurangi jumlah panel

### Menu lambat

Terlalu banyak gambar besar. Kompres gambar sebelum upload, atau kurangi jumlah
panel.

### Brand baru tidak muncul di `/brands`

Periksa:
- `Status` = `active`?
- `Featured` = `true`?
- `Order` terisi?

### Brand tidak muncul di dropdown navigasi

Dropdown dibaca dari dokumen **Header Menu — BRANDS Dropdown**. Cek:
1. Brand sudah ditambahkan di `Rows`?
2. Status-nya `active`?
3. Kalau barisnya kosong (tidak ada brand), baris itu disembunyikan otomatis

> Dulu dropdown dibaca dari file hardcoded `src/data/brandCategories.js`. File
> itu **sudah dihapus** — sekarang semuanya dari dokumen BRANDS Dropdown.

### Field Categories — sudah dihapus

Field `categories` **sudah dihapus dari schema (19/10)**, bersama tiga field lain yang juga tidak pernah dibaca website:

- `sections[].image` — gambar section (dijanjikan "kolom kanan blok teks", tidak pernah dirender)
- `sections[].features[].image` — gambar kartu fitur (12 gambar sudah terlanjur diunggah ke situ)
- `world.menuPanels` — panel menu standalone (menu selalu lewat section **Menu**)

Pengelompokan dropdown BRANDS memang sudah lama diatur lewat dokumen **BRANDS Dropdown** (`brandNav`), bukan field `categories`. Nilai lamanya (`ICONIC`, `EVERYDAY`, dll) tidak lagi tampil di Studio dan tidak perlu dibersihkan — tidak berpengaruh pada halaman mana pun.

---

## 8. Ringkasan Field

Setiap field `world`, grouped:

**Identity** — `name`, `slug`

**Listing & Navigation** — `tagline`, `speciality`, `image`, `logo`

**Hero & Copy** — `theme`, `heroEyebrow`, `heroTitle`, `heroIntro`, `gallery`,
`description`

**Sections** — `sections[]`

&nbsp;&nbsp;&nbsp;&nbsp;└─ setiap section: `type`, `heading`, `body`,
`specifications[]`, `features[]`, `menuPanels[]`, `mapLat`, `mapLng`,
`mapZoom`

**Menu** — `menuHeading` (judul bawaan section Menu)

**Location & Map** — `address`, `hours[]`

**Contact & Links** — `instagramUrl`, `ctas[]`

**SEO** — `seoTitle`, `seoDescription`, `socialImage`, `noIndex`

**Publishing** — `order`, `status`, `featured`

Catatan: `image` di sini adalah **Card Image** — thumbnail kartu di `/brands`. Field `categories` **sudah dihapus** (lihat [7](#7-troubleshooting)), begitu juga `sections[].image`, `sections[].features[].image`, dan `world.menuPanels`. Field `tagline`, `speciality`, `image`, `logo` ada di grup Listing & Navigation; `sections`, `menuPanels` (di dalam section), `ctas`, `hours` punya sub-field masing-masing.

---

## 9. Tipe Dokumen Lain

### Event

Untuk `/events`. Field: `title`, `slug`, `category`, `date`, `time`,
`location`, `capacity`, `entry`, `description`, `image`, `featured`, `link`.

`category` pilihan: Music & Listening, Dining & Terroir, Leisure & Community,
Workshop & Craft.

### Contact Info

Hanya 1 dokumen. Isi WhatsApp (label, kota, nomor yang tampil), alamat, jam
buka.

### Carousel Image

Slide marquee di homepage. `placement` harus `home`. Field: `title`, `image`,
`alt`, `brand`, `order`, `active`.

Set `active` = `false` untuk sembunyikan slide tanpa menghapus.

### Career

Satu dokumen = satu lowongan. Field: `title`, `slug`, `department`, `brand`,
`location`, `employmentType`, `summary`, `description`, `requirements[]`,
`applyUrl`, `isUrgent`, `postedAt`.

Mengisi `brand` akan memunculkan `speciality` brand itu di
kartu lowongan (lihat `career/page.js`). Brand diambil dari daftar dropdown
yang sama, jadi brand harus aktif dulu.

### Career Page

Hanya 1 dokumen. Isi hero, judul daftar lowongan, link Google Form, SEO.

---

## 10. Command yang Sering Dipakai

### Studio

```powershell
cd "D:\Cek Website JSD - Infia\Sams Group\studio-samsara"
npx sanity deploy           # WAJIB setelah ubah schemaTypes
npx sanity dev -- --no-auto-updates   # kalau mau jalan manual (Dev.cmd lebih praktis)
npx tsc --noEmit            # cek error TypeScript
```

### Website

```powershell
cd "D:\Cek Website JSD - Infia\Sams Group\Versi Next.js"
npm run dev                       # jalankan website
npm run build                     # build production
npm run lint                      # cek kode
npm audit                         # cek dependency
node scripts/audit-schema.mjs     # cek konsistensi schema vs data Sanity
node scripts/security-scan.mjs    # sapuan keamanan source
```

### Launcher

```powershell
D:\Cek Website JSD - Infia\Sams Group\Dev.cmd            # website + studio + watchdog
D:\Cek Website JSD - Infia\Sams Group\Dev.cmd --status   # cek status saja
```

### Kalau lupa, section kosong tidak merusak halaman

Section tanpa konten otomatis disembunyikan. Jadi kalau ragu, tambah section
kosong dulu lalu publish — halaman tidak akan rusak. Isi nanti kalau sudah siap.

---

## 11. Batas Free Plan

Project `p5zu5azj` masih di paket **Free**. Ini batasnya dan pemakaian
sekarang.

### Pemakaian

| Metrik | Limit Free | Sekarang | Sisa |
|---|---|---|---|
| Dokumen | 10.000 | 165 | 98% |
| Assets | 100 GB | 59.8 MB (123 gambar) | 99.9% |
| Bandwidth/bulan | 100 GB | dipantau | — |
| API CDN request/bulan | 1 juta | dipantau | — |
| API request/bulan | 250 ribu | dipantau | — |
| Dataset | 2 (public only) | 1 | 1 slot |
| User seat | 20 | 1 | 19 slot |
| Content type | unlimited | 8 | — |

Pantau di **sanity.io/manage** → project `p5zu5azj` → tab **Usage**.

### Tiga hal penting

**1. Dataset public — bisa di-scrape siapa pun.**

Query GROQ bisa dibaca tanpa token apa pun. Yang bisa diambil orang lain:

| Yang bisa di-scrape | Contoh |
|---|---|
| Nama brand | Acasa, Grove, Outpace, Samsara, Svarga |
| Nomor WhatsApp | `6285281271988`, `628132148132` |
| Alamat lengkap | Jl. Jalak Harupat No.19, Babakan, Bogor Tengah... |
| Judul lowongan | Barista, Guest Experience Host |
| URL aset gambar | `cdn.sanity.io/images/p5zu5azj/...` |
| Link reservasi | `maps.app.goo.gl/...`, `linktr.ee/acasa.samsara` |

Bukti:

```bash
# jalan tanpa token:
curl "https://p5zu5azj.api.sanity.io/v2024-01-01/data/query/production?query={\"r\":*[_type==\"world\"][].name}"
# → {"r":["Acasa","Grove","Outpace","Samsara","Svarga"]}
```

Menutupnya butuh **Growth $15/seat/bulan** (private dataset). Free plan tidak
mendukungnya sama sekali. **Write** tetap aman — mutation tanpa token ditolak
`403`.

**2. Tidak ada role Editor.**

Free plan hanya punya **Administrator** dan **Viewer**. Kalau kamuundang
editor lain, dia harus jadi Administrator — yang bisa menghapus seluruh
dataset. Di Growth ada role Editor terpisah.

**3. Tidak ada overage — kuota habis = diblokir.**

Untuk API, API CDN, dan bandwidth, Free plan **tidak boleh** lebih dari kuota.
Kalau habis → langsung diblokir, bukan ditagih. Email alert di 80% dan 100%.
Di Growth jadi pay-as-you-go ($0.30/GB bandwidth, $1 per 250k API CDN request).

### Kapan perlu upgrade

- **Isi `contactInfo` jadi lebih detail** (alamat lengkap, nomor banyak) →
  private dataset jadi prioritas, karena sekarang semuanya bisa di-scrape
- **Trafik naik / asset bertambah** → overage Growth lebih aman daripada
  diblokir
- **Mau SEARCHUNG editor lain** → butuh role Editor

### Hemat storage sekarang (gratis)

Satu aset **21.3 MB** — terlalu besar untuk web. Sanity tetap menyimpannya
utuh. Hapus yang tidak terpakai untuk bebaskan kuota.

---

## 12. Status Integrasi (per 7 Oktober 2026)

| Area | Status |
|---|---|
| Schema `world.ts` | 61 field (termasuk sub-field), 9 tab, `tsc` 0 error |
| Field `Categories` | **Sudah dihapus dari schema** (18/10) — memang tidak pernah dibaca website |
| Dokumen `brandNav` | Dibuat, 5 baris, urutan sesuai brandNav |
| Dropdown BRANDS | **Full CMS** — urutan & judul dari dokumen `brandNav` |
| Label See All / Hover | Full CMS dari `brandNav` |
| Halaman brand baru | Otomatis lewat `src/app/[slug]/page.js` |
| `description` di website | sourced dari section Text Block |
| `specifications` di website | sourced dari section Specifications |
| Kelima brand pakai Sanity | Ya, termasuk specs Outpace & Grove |
| Lighthouse (home/brands/samsara/career) | A11y 100, BP 100, SEO 100 |
| Lighthouse (/contact) | A11y 100 (semula 95, sudah diperbaiki) |
| `npm run build` | Compiled successfully, 0 error |
| `npm run lint` | 0 error, 28 warning `<img>` (pre-existing) |
| Hardcoded secret di source | 0 |
| Token Sanity di client bundle | Tidak ada (server-side only) |
| CSP | Nonce + `strict-dynamic`, tanpa `unsafe-eval` di production |
| `sanity deploy` | Sudah dijalankan — Studio online pakai schema terbaru |

### Isu yang masih terbuka

**1. `npm audit` di Studio masih 15**

Semua berasal dari `@sanity/cli` (alat build Studio): `adm-zip`, `js-yaml`,
`undici`. Perbaikannya cuma dengan downgrade `sanity` ke versi 5 — perubahan
besar yang tidak sepadan. Tool ini tidak pernah dikirim ke visitor website,
hanya jalan di komputer editor.

**2. PDF 43,9 MB di `public/`**

`public/2026-samsara-menu.pdf` (43.9 MB) tidak direferensikan kode mana pun tapi
tetap bisa diakses publik di `/2026-samsara-menu.pdf`. Kalau sudah tidak
dipakai, hapus agar repo ringan dan tidak menambah ukuran deploy.

**3. Aset Sanity 21,3 MB**

Satu aset besar yang kemungkinan tidak dipakai. Bikin storage dan
upload lebih berat.

**4. Dataset masih public**

Lihat [section 11](#11-batas-free-plan).

**5. Cache 60 detik**

Setelah publish di Studio, perlu tunggu 60 detik. Ini disengaja supaya website
tidak lambat dan tidak kena rate limit Sanity.

---

## 13. Kalau Ada Masalah

Bawa informasi ini:

1. URL Studio yang bermasalah
2. Nama dokumen yang bermasalah
3. Nama field yang bermasalah
4. Screenshot error
5. Pesan error dari browser console (F12 → Console)

Jangan menghapus dokumen yang bermasalah — set `status` jadi `draft` dulu
supaya website tidak ikut rusak.

---

## 14. Ringkasan Aturan Paling Penting

1. **Sanity = sumber kebenaran.** Website cuma membaca.
2. **Ubah konten** → Publish → tunggu 60 detik → hard refresh.
3. **Ubah schema** → `npx sanity deploy` wajib, tidak cukup push GitHub.
4. **Brand baru wajib masuk ke BRANDS Dropdown**, kalau tidak tidak muncul di
   dropdown.
5. **`featured = false`** = brand hilang total dari daftar.
6. **Jangan pakai slug** `samsara`/`svarga`/`acasa`/`outpace`/`grove` untuk
   brand baru.
7. **Token hanya di `.env.local`**, jangan pernah ditulis di kode.
8. **Dataset masih public** — jangan masukkan data sensitif sebelum upgrade.
9. **Jalankan Studio lewat `Dev.cmd`**, bukan `npm run dev` langsung.