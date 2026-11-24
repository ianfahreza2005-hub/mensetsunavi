# Changelog

Format mengikuti [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/).

## [Belum dirilis]

### Diubah
- Gaya v3: palet warna tradisional Jepang (漆黒, 月白, 茜, 藍, 鉄紺) dengan kontras WCAG AA, warna bab baru, huruf Poppins + Plus Jakarta Sans + Zen Kaku Gothic New, pola ombak di permukaan gelap, bilah atas laptop 鉄紺.

### Ditambah
- `js/gerak.js`: isi layar muncul bertahap, judul terisi warna, angka skor menghitung naik, sorot cahaya mengikuti kursor, riak saat tombol ditekan, Navi melayang; mati bila "kurangi gerak" aktif.
- T16 Penyusun Jikoshoukai (B4-14): lima blok isian, kalimat Jepang + romaji + arti dirangkai dari naskah B4-06–B4-09, panduan katakana, perkiraan durasi (ideal 30–60 dtk), dengarkan/salin/unduh, isian tersimpan di perangkat.
- GLB-03 Bank Kosakata dan Kartu Hafalan: daftar 68 istilah (cari, filter bab/kategori, bintang, Romaji/Arti, tautan ke slide) dan kartu hafalan Leitner 3 kotak (sesi 10 kartu).
- `gen_data.py` membaca glosarium tiap bab ke `D.bab[i].glos`.
- GLB-04 Latihan Pertanyaan Acak: bank 25 soal dengan contoh jawaban dari slide; mode Dengar (tebak topik) dan Jawab-rekam (hitung mundur 5 dtk, rekam maks. 60 dtk, analisis Lapis 1 durasi/jeda/volume + gelombang). `gen_data.py` membaca bank ke `D.latih`.
- `js/suara.js`: perekam suara dan analisis Lapis 1 (durasi, jeda, volume, gelombang).
- T15 Latihan Lisan 3 lapis di B4-15 (jikoshoukai, target 30–60 dtk) dan B5-13 (tiga pertanyaan acak, target 10–30 dtk): analisis Lapis 1, daftar periksa Lapis 2, profil + Unduh rekaman + Unduh lembar rubrik (Lapis 3). Profil Kesiapan Lisan tampil di rapor.
- `gen_data.py` membaca soal B5-13 ke `D.lisan5`.
- GLB-05 Tips & Trik: 8 kartu geser dalam tiga tahap (Sebelum/Saat/Sesudah), tab lompat, tombol Pelajari ke slide acuan. `gen_data.py` membaca tabel ke `D.tips`.
- Stepper untuk daftar langkah bernomor T03 (B3-03, B6-03, B6-08).
- Mode Latihan simulasi (tanpa timer dan nilai, dengan Petunjuk Navi), suara pewawancara (suara bawaan perangkat), dan rekaman opsional jikoshoukai setelah SIM-06 (masuk Profil Kesiapan Lisan).
- GLB-02/06: tombol Romaji/Arti global di slide dan Pengaturan, kecepatan suara Normal/Pelan, pesan bila penyimpanan ditolak peramban.
- GLB-07: Petunjuk Navi di aktivitas, saran Navi di beranda, reaksi Navi di hasil kuis, kartu Kata Mutiara di rangkuman dan halaman koleksi (`D.mutiara`).

### Diubah
- **Pre-test dipersingkat jadi 10 soal** (dari bank 20): butir 1, 3, 5, 6, 8, 12, 13, 15, 16, 18; semua bab terwakili. Post-test tetap 20 soal; N-gain di rapor dihitung pada 10 butir yang sama.
- **Kerangka laptop (≥1024px)** di semua layar isi: header penuh lebar (brand, breadcrumb, progres n/10, Romaji/Arti, audio, avatar) dan sidebar navigasi lengkap (semua bab dengan progres/stempel, bab aktif membuka daftar pelajaran, Evaluasi, Sumber belajar). Isi mengalir penuh di monitor besar (≥1600px).
- Tata letak responsif mengikuti canvas v2: **HP landscape** (Lanjut/Kembali di kolom kanan, bilah atas dipipihkan, Simulasi dua kolom), **laptop** (panel kanan Navi + "Kosakata di slide ini" di ≥ 1280px, Rapor dua kolom, halaman fitur lebih lebar, Simulasi dua kolom), dan **tablet** (tegak: teks sedikit lebih besar; landscape: sidebar + Simulasi dua kolom).
- Pintasan keyboard: ← → pindah slide, spasi memutar suara, 1–3 memilih tindakan di Simulasi.

### Diperbaiki
- **Versi lama tersaji dari cache**: service worker kini memakai jaringan-dulu untuk kode aplikasi, memasang versi baru tanpa cache HTTP, memberi alamat berversi (`?v=<hash>`) pada berkas kode, dan menampilkan spanduk "Versi baru tersedia". Aplikasi tetap jalan offline.
- Laptop pendek (mis. 1276×675): panel kanan kini muncul sejak 1240px (sebelumnya 1280px) dan sidebar lebih rapat sehingga muat di layar pendek.
- Menu ☰: ikon membesar 180–230px (tak berukuran) kini 22px, dan menu menutup saat halaman berganti.
- Bank Kosakata: spasi tidak bisa diketik di kolom cari (kata kunci dua kata mustahil dimasukkan).
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
