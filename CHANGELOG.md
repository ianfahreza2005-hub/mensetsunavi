# Changelog

Format mengikuti [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/).

## [Belum dirilis]

### Ditambah
- B5-09 Saat Tidak Paham, Jangan Diam: video animasi 51 detik (1080p, 60 fps, suara VOICEVOX:雀松朱司) menggantikan blok langkah, "Hindari", dan "Gugup". Isinya: bertanya dua kali dengan ungkapan penyelamat, empat hal yang dihindari dicap ✕ lalu dibuang, "jujur dengan sopan" + 申し訳ありません。まだ分からないところがあります。, napas saat gugup + 少し考えてもいいですか。, dan pesan "Jangan diam." Teks aslinya tetap ada di lipatan "Lihat teks lengkap".
- Adegan bergambar "Temukan kesalahan" untuk B3-02 (masuk ruangan) dan B6-02 (setelah wawancara): latar koridor/ruang wawancara, titik ! berdenyut, kesalahan + umpan balik muncul di adegan dan tersusun di daftar temuan, pindah adegan bergeser halus. B6-02 diawali pertanyaan Ya/Tidak.
- B4-13: kartu rekaman jikoshoukai; peserta memilih kesalahan utama tiap rekaman (chip), umpan balik membuka halus; rekaman berteks Jepang bisa diputar (suara perangkat) dengan gelombang suara bergerak.
- B3-08 Tiga Jenis Ojigi: figur SVG tampak samping, badan atas berputar di pinggul dengan gerak pegas, busur sudut tergambar mengikuti, tanda 15°/30°/45°, jejak samar tiap jenis yang sudah dilihat, tombol cepat per jenis, menempel ke sudut terdekat saat dilepas.
- Pengaturan "Kurangi gerak" (mengikuti setelan perangkat bila tidak diaktifkan).

### Diubah
- Masuk ke bab dari rak tidak lagi terpotong: setelah sampul terbuka, kamera menyelam ke halaman judul tanpa berhenti, lalu halaman materi muncul sebagai kartu di atas kartu isi halaman judul dan membesar bersama halaman itu sampai memenuhi layar. Halaman materi disusun saat tombol Lanjutkan ditekan, jadi tidak ada lagi layar kosong sesaat. Kamera rak juga tidak lagi meloncat saat buku dipilih atau dibuka.
- Transisi halaman dirombak supaya mulus 60 fps:
  - blur kaca (`backdrop-filter`) di bilah atas/bawah dihapus; inilah penyebab geseran slide tersendat di ±30 fps;
  - pola pudar-lewat: isi lama hilang dulu, baru isi baru masuk, jadi teks tidak kabur bertumpuk;
  - isi lama tetap di posisi gulirnya saat keluar (tidak melompat ke atas), dan grup transisi tidak lagi menganimasikan ukuran;
  - pita bab ikut diam bersama bilah atas, sidebar, dan bilah bawah;
  - transisi baru: buka (rak → halaman), tutup (halaman → rak), pudar silang (pembuka, simulasi), geser antar-momen simulasi dengan foto adegan yang larut;
  - klik Lanjut beruntun tidak lagi meninggalkan penanda transisi yang salah;
  - kemunculan bertahap isi layar tidak lagi memaksa tata letak dihitung ulang per elemen.
- Aktivitas pilih jawaban (B5-10 Jujur Itu Nilai Plus, B5-12, B6-09 tahap B) dirapikan:
  - satu situasi per tab, dengan tanda centang setelah selesai;
  - pertanyaan tampil sebagai gelembung pewawancara berwarna bab (dengan tombol dengar);
  - jawaban tampil sebagai kartu putih berhuruf A/B/C, dengan baris terpisah untuk Jepang, romaji, dan arti, jadi soal dan jawaban tidak lagi tercampur;
  - umpan balik berikon dan otomatis tergulir ke layar;
  - catatan penilaian di sel jawaban (mis. "terlalu singkat") baru muncul setelah dipilih.
- Gerak di seluruh aplikasi mengikuti prinsip 60 fps: hanya transform/opacity yang beranimasi per frame. Meteran level suara, durasi rekaman, dan indikator Kepercayaan memakai scaleX; titik aktif pita berdenyut lewat pseudo-elemen; hover tombol/pilihan tidak lagi menganimasikan bayangan.
- Kartu lipat membuka dan menutup halus (grid 0fr → 1fr), isinya memudar masuk.
- Susun langkah (T11): langkah yang benar meluncur dari tempatnya ke slot (FLIP).
- Perpindahan antarhalaman ber-sidebar memudar singkat; centang sidebar memantul saat slide selesai; toast masuk melambat dan keluar cepat; tombol Romaji/Arti dan sakelar memantul saat ditekan.
- Gerak dikurangi secara bertingkat: geser/membesar/melayang/denyut dibuang, kemunculan isi menjadi pudar singkat, pindah slide menjadi pudar.

### Diperbaiki
- Kode slide di teks naskah (mis. "pakai ungkapan di B5-09" di B5-08) dan di latihan lisan/simulasi rekam ("dari B4-14") tidak lagi tampil ke peserta; diganti judul slidenya.
- Tombol Lanjut tidak lagi kehilangan efek denyut (dua @keyframes bernama "denyut" saling menimpa).
- Pengantar B6-02 tidak lagi membocorkan kesalahan Dimas sebelum peserta menemukannya.

### Diubah
- Rapor Kesiapan bergaya dasbor: kartu utama (nilai sumatif, cincin Komunikasi/Etika, Navi sesuai kategori), stempel per bab dengan nama dan skor terbaik, batang pre-test → post-test + N-gain, jejak 13 momen simulasi berwarna, daftar momen yang perlu dilatih dengan tautan slide.
- Hasil kuis bab dua kolom: skor + stempel + pesan Navi di kiri; ringkasan jawaban, "Pelajari lagi", dan tombol lanjut ke bab berikutnya di kanan.
- Simulasi: jalur 13 momen dan label situasi di panel kanan, pintasan A–C, reaksi Tanaka-san sebagai gelembung bertanda warna; hasil simulasi dua kolom (ringkasan + jejak momen | pembahasan).
- Layar laptop pendek (tinggi ≤ 760 px): pita bab satu baris (±57 px, sebelumnya ±119 px) dan judul slide lebih kecil agar isi aktivitas lebih banyak terlihat.

### Diperbaiki
- Kode slide (SIM-xx, Bx-xx) tidak lagi tampil ke peserta di Rapor, hasil Simulasi (resmi & latihan), teks pilihan Simulasi, dan Profil Kesiapan Lisan; diganti nomor momen dan judul slide.
- Tombol "Ulangi kuis" di layar hasil kuis sekarang berfungsi.
- "Enam stempel lengkap" hanya muncul saat stempel ke-6 baru saja didapat; bila stempel bab sudah dimiliki, hasil kuis yang rendah tidak lagi berkata "Butuh skor 80 untuk stempel".

- Layar soal: "Kosakata di soal ini" di bawah panel soal (khusus kuis bab; istilah yang artinya ada di pilihan benar dilewati, soal yang menanyakan arti kata tidak diberi kotak ini) dan jalur soal di bawah kedua kolom. Kuis bab: kotak ✓/✗ per soal, skor sementara, meteran menuju 80 dan stempel 済 yang makin terisi. Pre/post-test: status dijawab tanpa nilai, kotak soal yang sudah dijawab bisa diklik.
- Perbaikan: isi slide tidak lagi berkedip dua kali setelah transisi geser.
- Layar soal (kuis bab, pre-test, post-test) dua kolom: panel soal berwarna bab di kiri (nomor soal, titik progres, Navi; bagian Jepang dengan huruf Jepang, romaji/arti lebih ringan), pilihan dan umpan balik di kanan. Pintasan keyboard A–D untuk memilih, → untuk lanjut; pindah soal kuis bergeser halus.
- Umpan balik kuis tidak lagi menampilkan kode slide; kode diganti judul slide yang bisa diklik.
- Peta bab (pita navigasi) berwarna bab di atas setiap slide dan di sampul: satu titik per slide (klik untuk pindah, judul muncul saat kursor di atasnya), segmen per pelajaran, persentase dipelajari. Sampul bab: kartu pelajaran dengan progres, paralaks kanji dan Navi mengikuti kursor.
- Pindah slide bergeser halus (View Transitions): maju masuk dari kanan, mundur dari kiri; bilah atas, sidebar, dan bilah bawah diam. Berlaku untuk slide bab, soal pre/post-test, dan langkah simulasi.
- Komik Kasus (B2-11): empat kasus ditampilkan satu per satu dengan tab, panel situasi berwarna (tempat kerja 青碧, wawancara 藍) bersama Navi, pesan penutup 信頼 setelah semua kasus tepat.
- Halaman yang isinya sedikit dibuat dua kolom: petunjuk tes + "Yang diukur" per bab, hasil tes skor + rincian, pembuka kuis + materi yang diuji.
- Pilihan jawaban di dalam kartu berlatar lembut (tidak putih di atas putih).
- Daftar "Pelajari lagi" di hasil kuis tidak lagi menampilkan kode slide.
- Panel kanan slide: Navi di atas dan gelembung selebar panel, sehingga teks narasi tidak terjepit.
- Bank Kosakata berwarna 青碧 (hijau kebiruan), bukan merah, agar tombol suara tidak terbaca sebagai tanda salah.
- Khusus laptop & Mac: aturan tampilan HP, tablet, dan HP landscape dihapus; tata letak laptop berlaku di semua lebar (viewport 1280). Versi responsif tersimpan di commit `64fc85a`.
- Pratinjau Artifact menampilkan aplikasi selebar 1280 px yang diperkecil agar pas di panel kanan aplikasi Claude.
- Gaya v3: palet warna tradisional Jepang (漆黒, 月白, 茜, 藍, 鉄紺) dengan kontras WCAG AA, warna bab baru, huruf Poppins + Plus Jakarta Sans + Zen Kaku Gothic New, pola ombak di permukaan gelap, bilah atas laptop 鉄紺.

### Ditambah
- Video animasi B2-09 "Contoh telepon renraku" (Remotion, 1080p 60 fps, 42 dtk, suara VOICEVOX:雀松朱司): situasi kereta terlambat, tiga pilihan, 連絡, panggilan, empat kalimat telepon yang sinkron dengan suara beserta lima unsur, ringkasan. Menggantikan blok teks contoh telepon; transkrip tetap ada di bawah video. Sumber di `sumber/video/b2-09/`.
- Service worker: video diputar dari jaringan, salinan utuhnya disimpan di latar belakang lalu potongan (Range) dilayani dari salinan itu, sehingga video bisa diputar offline.
- Perbandingan "versus" untuk pemantik bertabel dua pilihan (B1-02 Siapa yang Lolos?): dua panel kandidat berdampingan, sisi yang disentuh kursor/diketuk melebar, baris muncul bergantian, pilih langsung di panel.
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
