# Changelog

Format mengikuti [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/).

## [Belum dirilis]

### Ditambah
- T16 Penyusun Jikoshoukai (B4-14): lima blok isian, kalimat Jepang + romaji + arti dirangkai dari naskah B4-06–B4-09, panduan katakana, perkiraan durasi (ideal 30–60 dtk), dengarkan/salin/unduh, isian tersimpan di perangkat.
- GLB-03 Bank Kosakata dan Kartu Hafalan: daftar 68 istilah (cari, filter bab/kategori, bintang, Romaji/Arti, tautan ke slide) dan kartu hafalan Leitner 3 kotak (sesi 10 kartu).
- `gen_data.py` membaca glosarium tiap bab ke `D.bab[i].glos`.
- GLB-04 Latihan Pertanyaan Acak: bank 25 soal dengan contoh jawaban dari slide; mode Dengar (tebak topik) dan Jawab-rekam (hitung mundur 5 dtk, rekam maks. 60 dtk, analisis Lapis 1 durasi/jeda/volume + gelombang). `gen_data.py` membaca bank ke `D.latih`.
- `js/suara.js`: perekam suara dan analisis Lapis 1 (durasi, jeda, volume, gelombang).
- T15 Latihan Lisan 3 lapis di B4-15 (jikoshoukai, target 30–60 dtk) dan B5-13 (tiga pertanyaan acak, target 10–30 dtk): analisis Lapis 1, daftar periksa Lapis 2, profil + Unduh rekaman + Unduh lembar rubrik (Lapis 3). Profil Kesiapan Lisan tampil di rapor.
- `gen_data.py` membaca soal B5-13 ke `D.lisan5`.
- Stepper untuk daftar langkah bernomor T03 (B3-03, B6-03, B6-08).

### Diperbaiki
- Analisis suara: bicara terus tanpa diam tidak lagi dianggap hening (ambang relatif terhadap puncak suara).
- Daftar langkah storyboard B4-15 dan B5-13 tidak lagi tampil sebagai kartu buka.
- `tampilan.js`: entri ganda B4-14 dibersihkan.
- Bilah Kembali/Lanjut naik di slide pendek pada HP (`.with-side` tidak mengisi tinggi layar).
- `store.js` tidak lagi crash pada data `localStorage` lama atau tidak lengkap.

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
