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

Ringkasan kontrol keamanan dan hasil audit ada di
[`docs/Overall Codebase Security Audit.md`](docs/Overall%20Codebase%20Security%20Audit.md).
