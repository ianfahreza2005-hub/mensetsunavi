# Changelog

Format mengikuti [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/).

## [Belum dirilis]

### Ditambahkan
- Tombol **‹ Kembali** di setiap halaman (kecuali halaman pembuka dan aktivitas bernilai), termasuk S03 Menu Utama dan layar modul.
- Riwayat scene: Kembali di step pertama sebuah scene membuka layar terakhir dari scene sebelumnya.
- Ikon tab (favicon) `assets/favicon.svg`.

### Diperbaiki
- Error 404 `favicon.ico` di Console peramban.

## [0.1.0] — Prototipe

### Ditambahkan
- Mesin navigasi SPA berbasis scene/step dengan transisi parallax dan sapuan kelopak sakura.
- Panggung 16:9 yang diskalakan otomatis, peringatan putar layar untuk mode potret.
- Latar "Japanese Workplace" beranimasi dan ilustrasi lokasi (kantor, stasiun, lobi, koridor, ruang wawancara, peta).
- Maskot Navi dengan animasi idle dan 23 pose/ekspresi.
- Trust Meter (+10 / −5 / −10, rentang 0–100) dan penyimpanan progres di `localStorage`.
- Audio: SFX dan musik pentatonik WebAudio; narasi berupa teks bawah layar.
- Scene S01 Halaman Pembuka, S02 Onboarding (4 layer), S03 Menu Utama (peta modul dengan aturan buka-kunci).
- Placeholder S04–S19.
- Panel Bantuan dengan alat uji prototipe.
- Dokumentasi repositori.
