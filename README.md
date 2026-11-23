# Mensetsu Navi 面接ナビ

> Pelatihan mandiri wawancara kerja bahasa Jepang untuk peserta LPK tingkat N4, dipandu maskot **Navi**.
> Kelompok 2 · Kelas A · Pengembangan Multimedia Pembelajaran (model Hannafin & Peck).

**Coba langsung:** buka situs GitHub Pages repo ini (Settings → Pages). Di HP, pilih **Tambahkan ke layar utama** agar bisa dipakai tanpa internet.

## Alur peserta

Layar pembuka → **Pre-test** (20 soal) → **Rak bab** (beranda) → **Bab 1–6** (slide per slide + kuis 5 soal, skor ≥ 80 = stempel 済) → **Simulasi Mensetsu** (13 momen, 20 detik per momen, Trust Meter) → **Post-test** → **Rapor Kesiapan** (Nilai Sumatif = 50% Simulasi + 50% Post-test, lulus ≥ 75).

| Bagian | Isi | Status kerangka |
|---|---|---|
| Rak bab 3D | Pilih bab, panel gambaran umum, Buka/Tutup, buku terkunci bergetar, stempel 済 | ✅ |
| Bab 1–6 | Sampul bab, semua slide berisi teks layar + narasi dari naskah, daftar isi bab | ✅ (tampilan umum; template interaktif T02–T16 menyusul) |
| Kuis bab | Bank 10 soal per bab, tampil 5 acak, umpan balik, slide remedial | ✅ |
| Pre-test / Post-test | 20 soal, peta kemampuan per bab | ✅ |
| Simulasi Mensetsu | 13 momen, timer, Trust Meter, pembahasan | ✅ (audio pewawancara menyusul) |
| Rapor | Nilai sumatif, kategori, skor komunikasi & etika, N-gain, rekomendasi | ✅ |
| Fitur global | Bank Kosakata, Latihan Pertanyaan Acak, Tips | 🚧 baru teks |
| Audio & video | Narasi pakai suara bawaan peramban sampai rekaman tersedia | 🚧 menunggu rekaman tim |

## Menjalankan di komputer

Tanpa instalasi dan tanpa *build*:

```bash
python -m http.server 8000
```

Buka <http://localhost:8000>. (Membuka `index.html` langsung juga bisa, tetapi mode offline dan rekam suara butuh server/HTTPS.)

**Mode uji tim:** menu ☰ → Pengaturan → aktifkan *Mode uji tim* untuk membuka semua bab dan evaluasi tanpa syarat.

## Struktur folder

```
index.html            bingkai aplikasi + router
rak.html              rak bab 3D (Three.js), dimuat di dalam iframe
css/app.css           gaya aplikasi (Panduan Gaya v2)
js/app.js             semua layar: pembuka, tes, bab, kuis, simulasi, rapor, menu
js/store.js           progres peserta (localStorage, hanya di perangkat)
js/data/kursus.js     isi materi, soal, dan momen simulasi (dibuat otomatis)
sw.js                 service worker untuk mode offline
manifest.webmanifest  agar bisa dipasang di layar utama HP
vendor/               Three.js r181 (MIT)
assets/navi/          maskot Navi (WebP ringan untuk web)
assets/mascot/        maskot Navi PNG asli (resolusi penuh)
assets/bg/            ilustrasi lokasi
assets/audio/         rekaman narasi & ungkapan (diisi tim)
tools/                skrip pembaruan data dan service worker
docs/                 dokumentasi pengembang
```

## Setelah mengubah file

Setiap file yang disimpan untuk offline tercatat di `sw.js`. Setelah mengubah isi, jalankan:

```bash
python tools/build_sw.py
```

agar HP peserta mengunduh versi baru. Push ke `main` otomatis menerbitkan situs lewat GitHub Actions.

## Dokumentasi

| Dokumen | Isi |
|---|---|
| [docs/ARSITEKTUR.md](docs/ARSITEKTUR.md) | Rute, data, progres, rak 3D, offline |
| [docs/ASET.md](docs/ASET.md) | Maskot, latar, aturan nama file rekaman |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Tahap pengerjaan berikutnya |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Aturan kerja tim |

## Lisensi dan kredit

Maskot Navi dan ilustrasi milik tim pengembang Mensetsu Navi. Three.js © Three.js Authors (MIT). Gerak rak bab diadaptasi dari komponen "Ashen Press" ThreeUI (Meng To). Prototipe lama (Modul 1–5, layar lanskap) tersimpan di tag git `arsip/prototipe-lama`.
