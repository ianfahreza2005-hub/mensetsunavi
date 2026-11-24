# Video B2-09 · Contoh telepon renraku

Video motion graphic untuk slide **B2-09 Hou-Ren-Sou Sebelum Wawancara** (Bab 2), menggantikan blok teks
"Contoh telepon". Hasil akhir: `assets/video/B2-09.mp4` (1920×1080, 60 fps, ±42 detik) + poster `assets/video/B2-09.jpg`.

Isi video diambil dari materi, tanpa tambahan: situasi dan tiga pilihan dari Kasus 3 slide B2-11; kalimat telepon,
romaji, arti, dan lima unsur yang disampaikan dari slide B2-09. Semua teks ada di `src/naskah.ts`.

## Alur adegan

| # | Adegan | Isi |
|---|---|---|
| 1 | Pembuka | Wawancara pukul 10.00 → 09.30 kereta berhenti → stempel TERLAMBAT |
| 2 | Pilihan | Tiga kartu jatuh; "Salah" dan "Kurang tepat" dibuang ke tempat sampah; "Tepat" maju ke tengah |
| 3 | 連絡 | Kanji besar + kotak seleksi dan kursor "Navi"; "Telepon perusahaan **sebelum** jadwal." |
| 4 | Panggilan | Orb telepon, cincin orbit, nada sambung Jepang, "Tersambung" |
| 5 | Percakapan | 4 kalimat; teks Jepang + romaji muncul tepat saat diucapkan, unsur disorot dan dicentang |
| 6 | Penutup | "Kabari perusahaan sebelum jadwal." + lima unsur + kartu akhir dan kredit suara |

Gaya gerak mengikuti referensi tim (tipografi kinetik, kotak sorot, kartu jatuh, sapuan lingkaran, orb berorbit),
palet v3 Mensetsu Navi, huruf Poppins / Plus Jakarta Sans / Zen Kaku Gothic New / Shippori Mincho.

## Suara

- Dialog: **VOICEVOX:雀松朱司** (VOICEVOX Core 0.17.1, gaya ノーマル). Kredit wajib dicantumkan; sudah ada di kartu
  akhir video dan di keterangan pemutar. 〇〇 (tempat nama) dibaca まるまる.
- Efek suara dan musik latar disintesis sendiri (`scripts/siapkan_audio.py`), jadi bebas lisensi.

## Membuat ulang

Butuh Node 20+, Python 3 + numpy, ffmpeg.

```bash
npm install
python3 scripts/siapkan_audio.py          # efek suara + musik → public/sfx/ (tanpa argumen: suara dialog tidak diubah)
npx remotion studio                        # pratinjau interaktif
npx remotion render B2-09 out/B2-09-master.mp4 --codec=h264 --crf=18 --x264-preset=slow --audio-codec=aac --audio-bitrate=192k
ffmpeg -i out/B2-09-master.mp4 -c:v libx264 -preset slow -crf 26 -profile:v high -pix_fmt yuv420p \
       -c:a aac -b:a 128k -movflags +faststart ../../../assets/video/B2-09.mp4
ffmpeg -ss 32 -i out/B2-09-master.mp4 -frames:v 1 -vf scale=1280:-1 -q:v 4 ../../../assets/video/B2-09.jpg
```

Lalu di akar repo: `python3 tools/build_sw.py`.

Kalau Remotion tidak bisa mengunduh browser-nya sendiri, tambahkan `--browser-executable=<path chrome-headless-shell>`.

### Mengganti suara dialog

`public/audio/k1–k4.wav` dan `src/data/waktu.json` (waktu tiap frasa) ikut di-commit, jadi render ulang tidak butuh VOICEVOX.
Untuk membuat ulang suaranya: siapkan VOICEVOX Core (wheel Python, voicevox_onnxruntime, kamus Open JTalk, `12.vvm`),
jalankan `scripts/sintesis.py <folder>`, lalu `python3 scripts/siapkan_audio.py <folder>/suzumatsu`.
Teks dan animasi otomatis mengikuti waktu frasa yang baru.

## Lisensi alat

Remotion gratis untuk perorangan dan tim kecil (maksimal 3 orang); lihat https://www.remotion.dev/license.
Video hasil render boleh dipakai bebas.
