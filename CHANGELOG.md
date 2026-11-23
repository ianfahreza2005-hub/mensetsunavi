# Changelog

Format mengikuti [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/).

## [0.4.0] — Tampilan dirapikan

### Diubah
- Teks arahan storyboard tidak lagi tampil ke peserta; ditulis ulang di `js/data/tampilan.js`.
- Kotak "Tahukah kamu?", "Hindari", Tips, Kalimat kunci/Kata Mutiara, dan Keterangan tampil sebagai kotak bergaya.
- Kode slide, kode template, treatment, dan rencana visual hanya tampil di Mode uji tim.
- Sampul bab: capaian dengan tanda centang dan jalur pelajaran sampai stempel kuis.
- Layar pembuka dua kolom di laptop, kartu misi tiga langkah.
- Pengantar Simulasi baru (kartu Tanaka-san, empat aturan), kuis bab dengan pratinjau stempel, sakelar Mode uji.
- Soal pre/post-test tanpa catatan penyusun; fitur yang belum jadi ditandai "Sedang disiapkan".

## [0.3.0] — Template interaktif

### Ditambahkan
- `js/interaktif.js`: 54 slide Bab 1–6 kini interaktif, dibaca langsung dari tabel/daftar di naskah:
  kartu buka (T03/T06/T08/T16), kartu ungkapan + suara Jepang + tombol Romaji/Arti (T05/T15),
  tabel bertahap (T04), pemantik pilih-dulu (T02), kelompokkan (T10), kasus bercabang + indikator Kepercayaan (T13),
  urutkan langkah + lengkapi ungkapan (T11), penggeser sudut ojigi (T09), cocokkan kartu (T12), rekam suara + daftar periksa (T15).
- Syarat selesai per slide: tombol Lanjut aktif setelah aktivitas slide tuntas; progres bab hanya bertambah dari slide yang tuntas. Mode uji tim melewati syarat ini.

## [0.2.0] — Kerangka v2 (rancangan final)

### Diubah
- Struktur mengikuti rancangan final: Pre-test → Bab 1–6 → Simulasi → Post-test → Rapor, layar HP tegak dan laptop.
- Prototipe lama (Modul 1–5, panggung 16:9) diganti; tersimpan di branch `arsip/prototipe-lama`.

### Ditambahkan
- Rak bab 3D (Three.js r181 lokal) dengan panel gambaran bab, Buka/Tutup, kunci bergetar, stempel 済.
- Semua slide Bab 1–6 dari naskah, kuis bab (bank 10, tampil 5), pre/post-test 20 soal, simulasi 13 momen, rapor.
- PWA: bisa dipasang di HP dan dipakai offline; maskot Navi versi WebP ringan.

## [0.1.x] — Prototipe lama

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
