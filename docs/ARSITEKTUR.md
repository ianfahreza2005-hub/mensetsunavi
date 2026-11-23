# Arsitektur

Aplikasi satu halaman tanpa framework dan tanpa *build step*: HTML, CSS, dan JavaScript biasa.

## Rute (hash)

| Rute | Layar | Kode storyboard |
|---|---|---|
| `#/mulai` | Layar pembuka, isi nama | GLB-00 |
| `#/pre/0` … `#/pre/21` | Petunjuk, 20 soal, hasil pre-test | PRE-00–21 |
| `#/rak` | Rak bab 3D (beranda) | GLB-01 |
| `#/bab/N/K` | Slide ke-K Bab N (0 = sampul) | B1-01 … B6-11 |
| `#/kuis/N` | Kuis formatif Bab N | Bx-akhir |
| `#/sim/0` … `#/sim/15` | Simulasi Mensetsu | SIM-00–15 |
| `#/post/0` … | Post-test | POST-00–20 |
| `#/rapor` | Rapor Kesiapan | RAP-01–03 |
| `#/hal/GLB-0x` | Fitur global | GLB-03–05 |
| `#/atur` | Pengaturan, mode uji, hapus progres | GLB-06 |

## Data

`js/data/kursus.js` berisi `window.MN_DATA`:

- `bab[]`: identitas bab (judul, kanji, warna, pelajaran, daftar kode slide) dan `kuis` (10 soal: stem, 4 pilihan, kunci, umpan balik, slide remedial).
- `slides{kode}`: judul, template (T01–T21), pelajaran, teks layar (`screen`), narasi, rencana visual.
- `pre[]`: 20 soal pre/post-test. `sim[]`: 13 momen simulasi (situasi, 3 pilihan 10/5/0, jenis skor, acuan).

File ini dibuat otomatis oleh `tools/gen_data.py` dari naskah Bab 1–6, Evaluasi Sumatif, dan storyboard. Ubah isi di dokumen naskah, lalu jalankan ulang skripnya; jangan mengedit `kursus.js` secara manual.

## Progres

`js/store.js` menyimpan nama, hasil pre/post-test, slide yang sudah dilihat, skor kuis terbaik, stempel, dan hasil simulasi di `localStorage` (kunci `mensetsu-navi-v2`). Data tidak pernah dikirim ke server.

Aturan kunci: Bab 1–6 terbuka setelah pre-test; Simulasi setelah 6 stempel; Post-test setelah Simulasi; Rapor setelah Post-test. *Mode uji tim* di Pengaturan membuka semuanya.

## Rak bab 3D

`rak.html` dimuat di dalam iframe agar gaya dan *render loop*-nya terpisah. Rak membaca data dan status dari aplikasi induk (`window.parent.MN_DATA`, `MN_APP`) dan memanggil `MN_APP.open(no)` setelah animasi buku terbuka. Saat kembali ke rak, induk memanggil `MN_RAK_RESET()` (buku kembali ke rak, sampul diperbarui) dan `MN_RAK_PAUSE()` saat rak disembunyikan. Tanpa WebGL, rak menampilkan daftar bab biasa.

## Offline

`sw.js` menyimpan semua file aplikasi saat pertama dibuka; font dan rekaman disimpan saat pertama dipakai. Versi cache dihitung dari isi file oleh `tools/build_sw.py`.

## Suara

Tombol **Dengarkan** memutar `assets/audio/narasi/<KODE>.mp3` bila ada; jika belum ada, memakai suara bawaan peramban (bahasa Indonesia).
