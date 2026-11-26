# Kebijakan Keamanan

## Melaporkan celah

**Jangan** membuka issue publik untuk masalah keamanan.

Gunakan **Security → Report a vulnerability** pada tab Security repo ini. Laporan masuk
sebagai private security advisory dan hanya terlihat oleh pemilik repositori.

Sertakan bila memungkinkan:

- langkah reproduksi yang jelas,
- dampak yang mungkin terjadi,
- URL, commit, atau versi yang terdampak,
- saran perbaikan.

Kami berusaha membalas dalam 7 hari kerja.

## Cakupan

Berlaku untuk situs produksi https://samsaragroup.vercel.app dan seluruh kode di repo ini:
rute, header keamanan (CSP, HSTS, frame options), penanganan input, serta pemuatan aset
pihak ketiga.

## Di luar cakupan

- Konten editorial di Sanity Studio — hubungi pemilik proyek.
- Kerentanan pada dependensi pihak ketiga — laporkan ke proyek hulu; kami menindaklanjuti
  lewat pembaruan dependensi.
- Infrastruktur Vercel dan Sanity.

## Kontrol yang sudah diterapkan

Ringkasan kontrol keamanan ada di [`docs/DOCUMENTATION.md`](docs/DOCUMENTATION.md) §9.
Audit terbaru disimpan di folder dokumentasi proyek, di luar repo, dan tidak
dipublikasikan.

## Klasifikasi data Sanity

Dataset `production` dan `staging` bersifat **public-read**. Karena itu:

- Sanity **hanya** untuk konten publik yang memang boleh dilihat siapa pun.
- Jangan menyimpan KTP, NIK, CV, paspor, tanggal lahir, nomor rekening, atau data
  pelamar di Sanity. Data lamaran tetap di Google Forms/Drive/HR system.
- `npm run audit:pii` memeriksa tipe dan field terlarang tanpa mencetak isi; CI
  menjalankannya pada setiap push/PR.
- Kalau suatu saat data pribadi harus masuk Sanity, ubah dataset menjadi private
  dan gunakan token Viewer server-side — jangan mengandalkan `status: draft`
  sebagai kontrol kerahasiaan.
