# Mensetsu Navi — panduan untuk Claude Code

Multimedia pembelajaran interaktif (model Hannafin & Peck) untuk peserta LPK tingkat N4 yang bersiap wawancara kerja
berbahasa Jepang. Proyek mata kuliah Pengembangan Multimedia Pembelajaran, **Kelompok 2 · Kelas A**.
Bahasa kerja: **Bahasa Indonesia** (kode, komentar, commit, dan jawaban ke tim).

Keputusan desain yang sudah dikunci ada di **`docs/KEPUTUSAN.md`**. Baca itu sebelum mengubah materi, alur, nilai, atau gaya.

## Isi repo

| Folder/file | Isi |
|---|---|
| `index.html`, `js/app.js` | Aplikasi utama: router hash + semua layar (pembuka, pre/post-test, slide bab, kuis, simulasi, rapor, menu, pengaturan) |
| `js/interaktif.js` | Template interaktif slide (T02–T16); widget dipilih dari kode template + judul kolom tabel naskah. Lihat `docs/ARSITEKTUR.md` |
| `js/store.js` | Progres di localStorage, kunci `mensetsu-navi-v2`; aturan status buku (kunci/selesai) |
| `js/data/kursus.js` | **Dibuat otomatis** oleh `tools/gen_data.py`. Jangan diedit tangan |
| `js/data/tampilan.js` | Penyesuaian teks layar untuk peserta (sembunyikan/tulis ulang arahan storyboard). Boleh diedit tangan |
| `rak.html` | Rak buku 3D (Three.js r181 lokal di `vendor/`), dimuat dalam iframe; bicara ke induk lewat `window.parent.MN_DATA` / `MN_APP` |
| `css/app.css` | Token gaya v3 + semua komponen (lapisan gaya & gerak v3 di akhir berkas) |
| `js/gerak.js` | Gerak antarmuka v3: muncul bertahap, sorot kursor, riak tombol, hitung angka |
| `sw.js`, `manifest.webmanifest` | PWA offline. `tools/build_sw.py` memperbarui daftar precache + VERSION |
| `assets/` | Maskot Navi (`assets/navi/*.webp`), latar (`assets/bg/`), ikon, nanti `assets/audio/` dan video |
| `tools/xml.json`, `tools/sb.json` | Sumber naskah (ekspor doc Bab 1–6, Evaluasi, Fitur Global) dan data storyboard |
| `tools/dokumen/conv.py` | Pengubah XML doc → Word (A4, TNR 12, MS Mincho) yang dipakai untuk paket Word |
| `sumber/naskah/` | Naskah materi dalam Markdown (mudah dibaca), plus GBIM, JM, Pola Penyajian LMS |
| `sumber/rancangan/` | Paket Word resmi 00–13 (T1, GBIM, JM, Flowchart, Storyboard format Pak Imbar, Materi Bab 1–6, Evaluasi, Fitur Global, Pola LMS) |
| `sumber/desain-canvas/` | Berkas canvas interface v2 (`*.dc.html`, `canvas.json`) + `_generator.py` |
| `docs/` | `KEPUTUSAN.md`, `ARSITEKTUR.md`, `ROADMAP.md`, `ASET.md` |

## Perintah

```bash
python3 -m http.server 8811          # jalankan lokal, buka http://localhost:8811
python3 tools/gen_data.py            # buat ulang js/data/kursus.js dari tools/xml.json + tools/sb.json
python3 tools/build_sw.py            # WAJIB setiap kali ada file yang diubah/ditambah, agar HP peserta dapat versi baru
node --check js/app.js js/interaktif.js
```

Tidak ada build step, framework, atau npm. HTML/CSS/JS biasa (ES5-ish, `var`, `function`), supaya jalan di HP Android kelas bawah.

## Terbit

Setiap push ke `main` otomatis terbit ke GitHub Pages lewat `.github/workflows/pages.yml`:
https://ianfahreza2005-hub.github.io/mensetsunavi/
Prototipe lama (Modul 1–5) disimpan di branch `arsip/prototipe-lama`; jangan dihapus.
Kalau deploy gagal dengan "No artifacts named github-pages", itu gangguan GitHub; jalankan ulang workflow.

## Aturan kerja

- **Sebelum commit:** jalankan `tools/build_sw.py`, cek sintaks, lalu uji di browser ukuran HP (390×844) dan laptop (1440×900).
  Pastikan semua aktivitas slide tetap bisa diselesaikan dan tidak ada error di Console.
- **Materi** hanya berubah dari masukan SME/dosen. Ubah naskahnya dulu (doc sumber → `tools/xml.json`), lalu `gen_data.py`.
  Jangan menulis ulang materi di `kursus.js`.
- **Kode slide** (GLB-00, PRE-01, B3-07, SIM-05, RAP-01, …) adalah kunci bersama flowchart, storyboard, data, dan nama file aset.
  Jangan diganti. Aset audio: `assets/audio/narasi/<KODE>.mp3`.
- Kode slide, kode template, treatment, dan rencana visual **tidak ditampilkan ke peserta**; hanya di Mode uji tim.
- **Privasi:** responden angket ditulis anonim (R1–R4), tanpa nama/kontak. Jangan menaruh email atau data pribadi anggota di repo.
- Gaya v3 (lihat `docs/KEPUTUSAN.md`): 漆黒 #14171F, 月白 #EEECF1, 茜 #B3282F (hanko 済), 藍 #0F4C81, 鉄紺 #0E2A47.
  Warna bab 1–6: #0F4C81, #17706B, #B3282F, #9A5A12, #5E4391, #2D6A45; Simulasi #0E2A47; Post-test & Rapor #7E3420.
  Huruf: Poppins (judul), Plus Jakarta Sans (isi), Zen Kaku Gothic New (Jepang). Gerak di `js/gerak.js`, hormati prefers-reduced-motion.
- Teks antarmuka: kalimat biasa, kata kerja jelas, sapa peserta dengan "kamu".
- Kalau paket Word perlu diperbarui setelah materi berubah, buat ulang file yang bersangkutan di `sumber/rancangan/`.

## Status dan langkah berikutnya

Versi 0.4 (lihat `CHANGELOG.md`). Daftar kerja lengkap ada di `docs/ROADMAP.md` dan bagian "Belum dikerjakan" di `docs/KEPUTUSAN.md`. Ringkasnya:

1. Uji coba internal tim di HP; perbaiki temuan.
2. Template tersisa: T16 penyusun jikoshoukai berisian, T14 Dengar & Tebak, T07/T08 siap video, analisis lisan Lapis 1 (T15).
3. Fitur global: kartu hafalan Leitner (GLB-03), latihan pertanyaan acak + rekam (GLB-04), petunjuk Navi.
4. Aset: rekaman narasi ±82 file (setelah 13 butir konfirmasi SME), video peragaan Bab 3 dan 6, ilustrasi komik B2-11.
5. Canvas interface: ganti maskot sementara dengan Navi; Beranda diganti rak buku; ekspor gambar untuk dokumen T2.

## Tautan dokumen (doc Claude, dibuka di claude.ai)

Canvas interface v2: https://claude.ai/artifact/8FStnVa3AWxDQ3a2inisis ·
Prototipe rak 3D: https://claude.ai/artifact/HcEfFzfnaz414uPJ3Wus6A ·
Tautan T1, GBIM, JM, Flowchart, Storyboard, Bab 1–6, Evaluasi, Fitur Global, Pola LMS ada di `docs/KEPUTUSAN.md` bagian Dokumen.
