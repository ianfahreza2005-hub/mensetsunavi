# Video B5-09 · Saat tidak paham, jangan diam

Video motion graphic untuk slide **B5-09 Saat Tidak Paham, Jangan Diam** (Bab 5 · Menjawab Pertanyaan). Video ini menggantikan
tiga blok teks di bawah tabel ungkapan: paragraf "Langkah bila tetap tidak paham…", kotak "Hindari", dan kotak
"Gugup di tengah wawancara?". Teks aslinya tetap ada di slide, dalam lipatan "Lihat teks lengkap".
Hasil akhir: `assets/video/B5-09.mp4` (1920×1080, 60 fps, ±52 detik) + poster `assets/video/B5-09.jpg`.

Gaya geraknya sama dengan video B2-09: tipografi kinetik, kotak sorot, kartu jatuh, sapuan lingkaran antaradegan.
Warna aksennya ungu Bab 5 (#5E4391). Semua teks diambil dari slide B5-09 dan ada di `src/naskah.ts`:

- dua ungkapan penyelamat dari tabel ("Tidak menangkap pertanyaan" dan "Pewawancara bicara terlalu cepat");
- langkah "jujur dengan sopan" beserta kalimatnya;
- empat hal di kotak "Hindari" dan isi kotak "Gugup";
- narasi Navi dan judul slide.

## Alur adegan

| # | Adegan | Isi |
|---|---|---|
| 1 | Pembuka | Pewawancara bicara (celoteh yang tidak tertangkap). Kamu bertanya dua kali dengan ungkapan penyelamat, lalu pewawancara mengulang lebih pelan. Penutup adegan: "Sudah dua kali bertanya, tetap tidak paham?" |
| 2 | Hindari | Empat kartu jatuh, dicap ✕, lalu dibuang ke tempat sampah. Kartu "Jujur dengan sopan." turun ke tengah |
| 3 | Jujur | Judul dalam kotak seleksi dengan kursor "Navi". Kemudian 申し訳ありません。(disorot **Sopan**) dan まだ分からないところがあります。(disorot **Jujur**), lengkap dengan romaji dan arti |
| 4 | Gugup | Orb berisi Navi yang gelisah. Ia berhenti sejenak (semua membeku), tarik napas (orb mengembang lalu mengempis), dan lanjut dengan kalimat pendek 少し考えてもいいですか。 |
| 5 | Penutup | "Jawaban pendek yang tenang" dibandingkan dengan "jawaban panjang yang terburu-buru". Lalu "Tidak paham itu wajar. Jangan diam.", kartu akhir, dan kredit suara |

## Suara

- Ucapan: **VOICEVOX:雀松朱司** (VOICEVOX Core 0.17.1, gaya ノーマル, kecepatan 0,95). Kredit wajib dicantumkan; sudah ada di
  kartu akhir video dan di keterangan pemutar.
- Celoteh pewawancara, efek suara, napas, dan musik latar disintesis sendiri dengan `scripts/siapkan_audio.py`, jadi bebas lisensi.
  Celoteh itu suku kata tanpa makna dan sengaja dibuat teredam.

## Membuat ulang

Butuh Node 20+, Python 3 + numpy, dan ffmpeg.

```bash
npm install
python3 scripts/siapkan_audio.py          # efek suara + musik → public/sfx/ (tanpa argumen: suara ucapan tidak diubah)
npx remotion studio                        # pratinjau interaktif
npx remotion render B5-09 out/B5-09-master.mp4 --codec=h264 --crf=18 --x264-preset=slow --audio-codec=aac --audio-bitrate=192k
ffmpeg -i out/B5-09-master.mp4 -c:v libx264 -preset slow -crf 26 -profile:v high -pix_fmt yuv420p \
       -c:a aac -b:a 128k -movflags +faststart ../../../assets/video/B5-09.mp4
ffmpeg -ss 13.5 -i out/B5-09-master.mp4 -frames:v 1 -vf scale=1280:-1 -q:v 4 ../../../assets/video/B5-09.jpg
```

Setelah itu jalankan `python3 tools/build_sw.py` di akar repo.

Kalau Remotion tidak bisa mengunduh browser-nya sendiri, tambahkan `--browser-executable=<path chrome-headless-shell>`.

### Mengganti suara ucapan

`public/audio/*.wav` dan `src/data/waktu.json` (waktu tiap frasa) ikut di-commit, jadi render ulang tidak butuh VOICEVOX.
Untuk membuat ulang suaranya:

1. Siapkan VOICEVOX Core: wheel Python, voicevox_onnxruntime, kamus Open JTalk, dan `12.vvm`.
2. Jalankan `VV_ORT=… VV_DIC=… VV_VVM=… python scripts/sintesis.py <folder>`.
3. Jalankan `python3 scripts/siapkan_audio.py <folder>/suzumatsu`.

Teks, animasi, dan peredaman musik otomatis mengikuti waktu frasa yang baru, karena dihitung di `src/waktu.ts`.

Huruf Jepang di `public/fonts` adalah subset yang hanya berisi karakter di `src/naskah.ts`. Kalau naskah berubah,
jalankan `python3 scripts/ambil_font.py`.

## Lisensi alat

Remotion gratis untuk perorangan dan tim kecil (maksimal 3 orang); lihat https://www.remotion.dev/license.
Video hasil render boleh dipakai bebas.
