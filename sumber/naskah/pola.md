# Mensetsu Navi — Pola Penyajian LMS dan Template Slide
@date 2026-11-22

Dokumen ini mengatur **cara materi disajikan**, bukan tampilan visualnya. Tujuannya dua: (1) materi Bab 1–6 tersaji seperti kursus di LMS (modul, pelajaran, progres, syarat selesai, remedial), dan (2) tim mudah memindahkannya ke website karena setiap slide memakai salah satu dari 19 template yang sama. Isi materi tetap di dokumen Bab 1–6; dokumen ini hanya menambahkan struktur dan aturan penyajiannya.

## 1. Struktur kursus

| Tingkat LMS | Di Mensetsu Navi | Contoh |
|---|---|---|
| Kursus | Mensetsu Navi | Satu paket HTML offline |
| Modul | Bab 1–6, ditambah Pre-test, Simulasi, Post-test, Rapor | Bab 3 Nyuushitsu & Ojigi |
| Pelajaran | Kelompok slide dalam satu bab, mengikuti indikator | Bab 3 · Pelajaran 2: Ojigi |
| Slide | Satu layar, berkode | B3-08 Tiga Jenis Ojigi |
| Layer/kartu | Isi tambahan di dalam slide (pop-up, tab, kartu geser) | B3-07 sebagai layer B3-06 |

**Alur kursus:** Layar pembuka (GLB-00) → Pre-test → Bab 1–6 → Simulasi → Post-test → Rapor. Fitur global (Bank Kosakata, Latihan Pertanyaan Acak, Tips & Trik) adalah “sumber belajar” yang selalu bisa dibuka dari menu, seperti bagian *Resources* di LMS.

## 2. Pelajaran di setiap bab

Setiap bab dibagi menjadi 3–5 pelajaran. Daftar pelajaran tampil di slide sampul (xx-01) dan di menu ☰ sebagai **daftar isi bab** dengan tanda centang, sehingga peserta selalu tahu posisinya.

| Bab | Pelajaran (slide) | Indikator |
|---|---|---|
| 1 Mengenal Mensetsu | P1 Apa Itu Mensetsu (B1-02 s.d. 04) · P2 Yang Dinilai Pewawancara (05–06) · P3 Persiapan Sebelum Wawancara (07–10) · Penutup (11–12) | 1.1 · 1.2 · 1.3 |
| 2 Hou-Ren-Sou | P1 Mengenal Hou-Ren-Sou (B2-02 s.d. 06) · P2 Membedakan Ketiganya (07–08) · P3 Hou-Ren-Sou di Wawancara (09–11) · Penutup (12–13) | 2.1 · 2.2 · 2.3 |
| 3 Nyuushitsu & Ojigi | P1 Langkah Masuk Ruangan (B3-02 s.d. 07) · P2 Ojigi (08–10) · P3 Duduk dan Latihan Gabungan (11–12) · Penutup (13–14) | 3.1–3.2 · 3.3 · 3.4 |
| 4 Jikoshoukai | P1 Fungsi Jikoshoukai (B4-02 s.d. 04) · P2 Lima Blok (05–11) · P3 Pelafalan dan Kesalahan Umum (12–13) · P4 Jikoshoukai-ku (14–15) · Penutup (16–17) | 4.1 · 4.2–4.3 · 4.5–4.6 · 4.4, 4.6 |
| 5 Menjawab Pertanyaan | P1 Pola Menjawab (B5-02 s.d. 03) · P2 Pertanyaan Umum dan Tak Terduga (04–08) · P3 Tidak Paham dan Jujur (09–10) · P4 Bertanya Balik (11–12) · P5 Latihan Lisan (13) · Penutup (14–15) | 5.2 · 5.1–5.2 · 5.3, 5.2 · 5.4 · 5.2 |
| 6 Taishitsu | P1 Langkah Keluar Ruangan (B6-02 s.d. 06) · P2 Setelah Keluar Ruangan (07–08) · P3 Latihan (09) · Penutup (10–11) | 6.1–6.2 · 6.3 · 6.1–6.2 |

Pola tiap pelajaran mengikuti urutan **jelaskan → contohkan → latih**. Slide sampul tetap menampilkan tujuan bab; slide rangkuman menutup bab dengan glosarium, Kata Mutiara, dan tombol kuis.

## 3. Aturan LMS

**Prasyarat (kunci):**

- Bab 1–6 terbuka setelah pre-test selesai (urutan 1–6 disarankan).
- Di dalam bab, slide terbuka berurutan: tombol Lanjut aktif setelah syarat selesai slide itu terpenuhi. Slide yang sudah dilewati bisa dibuka lagi kapan saja dari daftar isi bab.
- Kuis bab terbuka setelah semua slide bab selesai.
- Simulasi terbuka setelah enam stempel; Post-test setelah Simulasi; Rapor setelah Post-test.

**Syarat selesai per jenis slide** (dipakai juga untuk menghitung progres):

| Jenis | Slide dianggap selesai jika… |
|---|---|
| Tampil saja (sampul, rangkuman) | Tombol Lanjut ditekan |
| Buka item (kartu, tab, hotspot, langkah) | Semua item sudah dibuka |
| Audio/video | Audio utama atau video sudah diputar sekali |
| Latihan bertindak (kelompokkan, urutkan, cocokkan, pilihan situasi) | Semua item dijawab benar (boleh mencoba berkali-kali) |
| Rekam suara | Minimal satu rekaman dianalisis |
| Kuis bab | Skor ≥ 80 (stempel); di bawah itu bab tercatat “perlu diulang” |

**Progres:** bilah progres bab = slide selesai ÷ jumlah slide; beranda menampilkan progres kursus (bagian selesai dari 10). Peserta bisa berhenti kapan saja dan melanjutkan dari slide terakhir (GLB-06).

**Umpan balik dan remedial:** setiap latihan memberi umpan balik langsung; setiap soal kuis yang salah menampilkan tombol “Pelajari lagi” ke slide remedialnya; layar hasil kuis mengumpulkan semua slide remedial dalam satu daftar.

**Pencapaian:** stempel per bab (badge), Kata Mutiara yang terkumpul, dan rapor akhir sebagai *gradebook*.

## 4. Bagian tetap di setiap slide

Setiap slide memakai bingkai yang sama, sehingga hanya bagian isi yang berganti.

| Bagian | Isi |
|---|---|
| Bilah atas | ☰ Menu · judul bab dan pelajaran · tombol Romaji/Arti · tombol suara |
| Bilah progres | Progres bab |
| Area isi | Diisi oleh salah satu template T01–T19 |
| Bilah bawah | Kembali · nomor slide (mis. 5/13) · Lanjut (aktif setelah syarat selesai) |
| Narasi | Diputar otomatis sekali saat slide dibuka; tombol putar ulang |

## 5. Daftar template slide

Semua 82 slide materi cukup dibangun dengan 19 template berikut. Satu template = satu komponen di website, diisi data yang berbeda.

| Kode | Template | Isi yang dibutuhkan | Interaksi utama | Syarat selesai |
|---|---|---|---|---|
| T01 | Sampul Bab | Judul, durasi, tujuan, daftar pelajaran, visual | Hit “Mulai Bab” | Lanjut |
| T02 | Pemantik Pilihan | Skenario singkat, 2–3 pilihan, umpan balik tiap pilihan | Hit pilihan → Show umpan balik | Sudah memilih |
| T03 | Buka Item | 3–7 item (kartu balik, tab, hotspot pada gambar, atau peta langkah), isi pop-up tiap item | Hit item → Show isi; penghitung “dibuka X dari N” | Semua item dibuka |
| T04 | Tabel Bertahap | Baris/kolom perbandingan | Hit “Tampilkan” → baris berikutnya (di HP: kartu geser) | Semua baris tampil |
| T05 | Kartu Ungkapan Audio | Daftar ungkapan (Jepang, romaji, arti, audio), prinsip/kotak info opsional, mode “Putar semua” dengan sorotan | Hit audio; geser kartu | Semua kartu dilihat |
| T06 | Kartu Tanya-Jawab | Audio pertanyaan, contoh jawaban + audio, tips | Hit putar → Hit “Lihat contoh jawaban” → Hit “Tips” | Semua kartu dibuka |
| T07 | Bandingkan Benar–Salah | 1 contoh benar + 1–3 contoh salah (video atau audio), keterangan | Hit “Benar”/“Salah” → putar | Semua contoh diputar |
| T08 | Temukan Kesalahan | Video dengan titik henti atau klip audio, daftar kesalahan, petunjuk | Hit bagian salah / pilih jenis kesalahan | Semua kesalahan ditemukan |
| T09 | Slider Peraga | Ilustrasi, titik berhenti dan kartu tiap titik | Geser slider | Semua kartu muncul |
| T10 | Kelompokkan | Kartu + 2–3 kotak tujuan, umpan balik salah | Drag (di HP: ketuk kartu lalu ketuk kotak) | Semua benar |
| T11 | Urutkan & Lengkapi | Kartu langkah acak; opsional pilihan ucapan/ojigi per langkah | Drag/ketuk ke slot; pilih ucapan | Semua benar |
| T12 | Cocokkan Kartu | 10 pasang kartu (Jepang–arti) + audio | Buka dua kartu; Petunjuk Navi | 10 pasang cocok |
| T13 | Pilihan Situasi / Komik | Kasus (teks atau panel komik), 3 pilihan bertingkat tepat/kurang tepat/salah, reaksi tokoh, indikator Kepercayaan opsional | Hit pilihan → Show akibat; Coba lagi | Pilihan tepat ditemukan di semua kasus |
| T14 | Dengar & Tebak | Audio (teks tersembunyi), pilihan topik/arti, kecepatan Normal/Pelan | Hit putar → Hit pilihan → Show teks | Semua audio dijawab |
| T15 | Rekam Suara | Contoh/pertanyaan audio, analisis Lapis 1, checklist Lapis 2 | Rekam → lihat analisis → centang → unduh | Minimal 1 rekaman |
| T16 | Penyusun Teks | Langkah isian/pilihan per blok, perkiraan durasi | Isi → “Lihat hasil” → salin/unduh | Hasil disimpan |
| T17 | Rangkuman Bab | 3–5 poin, Kata Mutiara, glosarium, tombol kuis | Hit glosarium; Hit “Mulai Kuis” | Lanjut |
| T18 | Kuis | Bank 10 soal, tampil 5 acak, satu soal per layar, umpan balik tepat/kurang tepat | Hit pilihan → Show umpan balik | Semua soal dijawab |
| T19 | Hasil Kuis & Remedial | Skor, stempel, daftar slide remedial | Hit remedial / Ulangi Kuis / Lanjut | – |

Evaluasi sumatif memakai template tambahan: **T20 Momen Simulasi** (situasi, audio pewawancara, 3 pilihan, timer 20 detik, Trust Meter) dan **T21 Layar Rapor** (RAP-01 s.d. 03). Pre-test dan Post-test memakai T18 tanpa umpan balik per soal.

## 6. Pemetaan slide ke template

| Bab | Slide → template |
|---|---|
| 1 | 01 T01 · 02 T02 · 03 T04 · 04 T03 (peta langkah) · 05 T03 (kartu balik) · 06 T03 (hotspot) · 07 T03 (kartu) · 08 T03 (hotspot + ganti figur) · 09 T03 (tab) · 10 T10 · 11 T17 · 12 T18 + T19 |
| 2 | 01 T01 · 02 T02 · 03 T03 (kartu) · 04 T05 · 05 T05 · 06 T05 · 07 T04 · 08 T10 · 09 T05 · 10 T06 · 11 T13 (komik) · 12 T17 · 13 T18 + T19 |
| 3 | 01 T01 · 02 T08 (video) · 03 T03 (peta langkah) · 04 T03 (hotspot pintu → video) · 05 T07 · 06 T05 · 07 T15 (layer B3-06, tidak dinilai) · 08 T09 · 09 T07 · 10 T13 · 11 T03 (hotspot + ganti figur) · 12 T11 · 13 T17 · 14 T18 + T19 |
| 4 | 01 T01 · 02 T02 (audio A/B) · 03 T03 (kartu) · 04 T04 · 05 T03 (blok) · 06–09 T05 · 10 T05 (mode Putar semua) · 11 T12 · 12 T07 (audio) · 13 T08 (audio) · 14 T16 · 15 T15 · 16 T17 · 17 T18 + T19 |
| 5 | 01 T01 · 02 T02 · 03 T05 (per bagian jawaban) · 04–07 T06 · 08 T06 (bagian A) + T14 (bagian B) · 09 T05 + T13 (simulasi mini) · 10 T13 · 11 T05 · 12 T13 · 13 T15 · 14 T17 · 15 T18 + T19 |
| 6 | 01 T01 · 02 T08 (video) · 03 T03 (peta langkah) · 04 T05 · 05 T07 · 06 T07 · 07 T03 (empat kartu, kartu ke-4 = B6-08) · 09 T11 · 10 T17 · 11 T18 + T19 |
| Global | GLB-00 T03 (kartu pembuka) · GLB-03 T12 + kartu hafalan · GLB-04 T14 + T15 · GLB-05 T03 (kartu geser) |

Template yang paling sering dipakai adalah T03, T05, dan T18, jadi tiga komponen itu dikerjakan dan diuji lebih dulu saat membangun website.

## 7. Dari naskah ke website

Setiap slide di dokumen bab sudah berisi Kode, Teks layar, Narasi, Interaksi, dan Catatan. Untuk website, bagian itu dipindahkan menjadi satu data per slide dengan susunan tetap:

| Bagian naskah | Data di website |
|---|---|
| Kode | `kode` (B3-08), `bab`, `pelajaran` (P2) |
| Judul slide | `judul` |
| Template (dokumen ini) | `template` (T09) |
| Indikator | `indikator` |
| Teks layar | `isi` sesuai kebutuhan template (item, kartu, pilihan, umpan balik) |
| Teks Jepang | setiap ungkapan: `jp`, `romaji`, `arti`, `audio` |
| Narasi | `narasi` (nama file audio narator) |
| Interaksi | ditangani template; data hanya menyimpan `syarat_selesai` |
| Catatan | tidak tampil; untuk tim dan SME |

Contoh satu slide sebagai data:

```
{
  "kode": "B2-05", "bab": 2, "pelajaran": "P1",
  "judul": "連絡 Renraku: Mengabari", "template": "T05", "indikator": ["2.1"],
  "narasi": "narasi/B2-05.mp3",
  "isi": {
    "definisi": "連絡 (renraku) = menyampaikan informasi atau fakta kepada semua pihak yang perlu tahu.",
    "prinsip": ["cepat, sebelum kejadian", "sampaikan fakta dengan jelas", "kabari semua pihak terkait"],
    "ungkapan": [
      {"jp": "すみません。電車が遅れていて、10分ほど遅れます。",
       "romaji": "Sumimasen. Densha ga okurete ite, juppun hodo okuremasu.",
       "arti": "Maaf, kereta terlambat, saya akan terlambat sekitar 10 menit.",
       "audio": "audio/B2-05_01.mp3"}
    ]
  },
  "syarat_selesai": "semua_kartu_dilihat"
}
```

**Susunan folder paket offline:**

| Folder | Isi | Aturan nama file |
|---|---|---|
| `index.html` | Bingkai, navigasi, template T01–T21 | – |
| `data/` | `bab1.json` s.d. `bab6.json`, `evaluasi.json`, `global.json` | satu file per modul |
| `narasi/` | Rekaman narator | `B3-08.mp3` (kode slide) |
| `audio/` | Ungkapan Jepang penutur asli | `B3-08_01.mp3` (kode + nomor urut) |
| `video/` | Video peragaan tim (MP4) | `B3-05_benar.mp4`, `B3-05_salah1.mp4` |
| `img/` | Ilustrasi, komik, maskot Navi | `B2-11_panel1.png` |

Karena nama file mengikuti kode slide, daftar aset yang harus direkam atau digambar bisa langsung disusun dari peta slide, dan flowchart serta storyboard memakai kode yang sama.

## 8. Urutan kerja yang disarankan untuk tahap website

1. Bangun bingkai tetap (bilah atas, progres, navigasi, penyimpanan) dan layar beranda.
2. Bangun template T01, T03, T05, T17, T18, T19, lalu uji dengan Bab 1 dan Bab 2 sebagai bab percontohan.
3. Tambahkan template sisanya sesuai kebutuhan Bab 3–6.
4. Masukkan data semua bab, lalu aset audio, video, dan ilustrasi.
5. Bangun Pre-test, Simulasi (T20), Post-test, dan Rapor (T21).
6. Uji di HP: setiap slide tanpa scroll, semua tombol mudah diketuk, audio dan video berjalan offline.
