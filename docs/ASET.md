# Aset

## Maskot Navi

- `assets/mascot/*.png`: file asli resolusi penuh dari character sheet (±0,5 MB per file).
- `assets/navi/*.webp`: versi ringan untuk web (tinggi 480 px), dipakai aplikasi.

Awalan nama: `exp_` ekspresi, `pose_` pose seluruh badan, `act_` aktivitas. Bila menambah pose baru, simpan PNG di `assets/mascot/` lalu buat WebP-nya (tinggi 480 px) di `assets/navi/` dengan nama yang sama.

## Latar lokasi — `assets/bg/`

`kantor_eksterior`, `stasiun`, `lobi`, `koridor`, `ruang_wawancara`, `peta` (WebP 1672 × 941). Simulasi memakai eksterior (momen 1–2), koridor (3–5), dan ruang wawancara (6–13).

## Rekaman — nama file mengikuti kode slide

| Jenis | Lokasi | Contoh |
|---|---|---|
| Narasi narator (ID) | `assets/audio/narasi/` | `B3-08.mp3` |
| Ungkapan Jepang penutur asli | `assets/audio/jp/` | `B3-08_01.mp3` (kode + nomor urut) |
| Ucapan pewawancara simulasi | `assets/audio/sim/` | `SIM-04.mp3` (belum diputar aplikasi; sementara suara bawaan perangkat) |
| Kata Mutiara diucapkan Navi | `assets/audio/mutiara/` | `B1.mp3` … `B6.mp3` (sudah dicoba aplikasi lebih dulu; jika tidak ada, suara bawaan) |
| Video peragaan | `assets/video/` | `B3-05_benar.mp4`, `B3-05_salah1.mp4` |

Format disarankan: MP3 mono 64–96 kbps, video MP4 H.264 720p. Setelah menambah file, jalankan `python tools/build_sw.py`.

## Ikon

`assets/icon-192.png`, `assets/icon-512.png` (dari wajah Navi), `assets/favicon.svg`.
