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
| `#/hal/GLB-0x` | Fitur global (GLB-03 Bank Kosakata, GLB-04 Latihan Pertanyaan Acak, GLB-05 Tips & Trik, dan GLB-07 Kata Mutiara sudah jadi) | GLB-03–05 |
| `#/atur` | Pengaturan, mode uji, hapus progres | GLB-06 |

## Data

`js/data/kursus.js` berisi `window.MN_DATA`:

- `bab[]`: identitas bab (judul, kanji, warna, pelajaran, daftar kode slide) dan `kuis` (10 soal: stem, 4 pilihan, kunci, umpan balik, slide remedial).
- `slides{kode}`: judul, template (T01–T21), pelajaran, teks layar (`screen`), narasi, rencana visual.
- `pre[]`: bank 20 soal (post-test memakai semuanya). `preSub[]`: indeks 10 butir terpilih untuk pre-test (`PRE10` di gen_data.py); `scrTest` memakai `preSub` bila `kind === 'pre'`. N-gain di rapor dihitung pada butir yang sama (`skorSama()`). `sim[]`: 13 momen simulasi (situasi, 3 pilihan 10/5/0, jenis skor, acuan).

File ini dibuat otomatis oleh `tools/gen_data.py` dari naskah Bab 1–6, Evaluasi Sumatif, dan storyboard. Ubah isi di dokumen naskah, lalu jalankan ulang skripnya; jangan mengedit `kursus.js` secara manual.

## Progres

`js/store.js` menyimpan nama, hasil pre/post-test, slide yang sudah dilihat, skor kuis terbaik, stempel, dan hasil simulasi di `localStorage` (kunci `mensetsu-navi-v2`). Data tidak pernah dikirim ke server.

Aturan kunci: Bab 1–6 terbuka setelah pre-test; Simulasi setelah 6 stempel; Post-test setelah Simulasi; Rapor setelah Post-test. *Mode uji tim* di Pengaturan membuka semuanya.

## Rak bab 3D

`rak.html` dimuat di dalam iframe agar gaya dan *render loop*-nya terpisah. Rak membaca data dan status dari aplikasi induk (`window.parent.MN_DATA`, `MN_APP`) dan memanggil `MN_APP.open(no)` setelah animasi buku terbuka. Saat kembali ke rak, induk memanggil `MN_RAK_RESET()` (buku kembali ke rak, sampul diperbarui) dan `MN_RAK_PAUSE()` saat rak disembunyikan. Tanpa WebGL, rak menampilkan daftar bab biasa.

## Offline

`sw.js` menyimpan semua file aplikasi saat pertama dibuka; font dan rekaman disimpan saat pertama dipakai. Versi cache dihitung dari isi file oleh `tools/build_sw.py`.

**Pembaruan versi** (agar perubahan langsung terlihat):
- Kode aplikasi (HTML/JS/CSS/manifest) memakai strategi **jaringan dulu**: saat online selalu diambil segar (`cache: 'no-cache'`), dan baru memakai cache bila offline atau lebih dari 4 detik. Gambar, font, vendor, dan audio tetap cache-dulu.
- Pemasangan versi baru mengambil berkas dengan `cache: 'reload'` (melewati cache HTTP GitHub Pages yang berlaku 10 menit), lalu `skipWaiting` + `clients.claim`.
- `build_sw.py` memberi alamat berversi pada berkas kode di `index.html` (`js/app.js?v=<hash>`; hash tidak menghitung tanda versinya sendiri sehingga stabil). Itu memaksa peramban mengambil berkas baru walau cache memori/HTTP masih menyimpan yang lama.
- `app.js` menampilkan spanduk "Versi baru tersedia. Muat ulang" saat service worker baru mengambil alih, dan mengecek pembaruan tiap tab kembali dibuka dan tiap 30 menit.
- Sebelumnya (cache-dulu) pengguna bisa terus melihat versi lama sampai muat ulang berikutnya.

## Suara

Tombol **Dengarkan** memutar `assets/audio/narasi/<KODE>.mp3` bila ada; jika belum ada, memakai suara bawaan peramban (bahasa Indonesia).

## Template interaktif

`js/interaktif.js` (`MN_IX.render(kode)`) membaca blok layar slide dari `kursus.js` dan mengganti tabel/daftar
yang cocok dengan widget. Pemilihan widget berdasarkan kode template dan judul kolom tabel naskah:

| Kondisi | Widget |
|---|---|
| T12 | cocokkan kartu Jepang ↔ arti |
| T09 + kolom Sudut | penggeser ojigi |
| kolom Pengecoh | pilih ungkapan benar (T11 tahap B) |
| kolom Pilihan, Hasil | kasus bercabang + indikator Kepercayaan |
| kolom Tepat/Kurang tepat/Salah atau Jawaban jujur | pilih jawaban terbaik |
| kolom Jawaban + Umpan balik | kelompokkan / pilih kategori |
| kolom Cara baca/Romaji + teks Jepang | kartu ungkapan + suara + Romaji/Arti |
| T04 | tabel bertahap |
| T03 + daftar bernomor ≥3 langkah (bukan berlabel) | stepper: langkah muncul satu per satu |
| T16 + tabel berjudul kolom Blok | penyusun jikoshoukai (`js/jikoshoukai.js`): 5 blok isian → kalimat Jepang + romaji + arti, durasi, salin/unduh |
| T03/T06/T07/T08 tabel, atau daftar berlabel `**Judul:**` | kartu buka |
| T11 + paragraf "urutkan … (Bx-xx)" | urutkan langkah dari slide rujukan |
| T02 | pilih dulu, penjelasan terbuka setelahnya |
| T15 + kode B4-15 / B5-13 | latihan lisan 3 lapis (`js/lisan.js`): rekam + analisis Lapis 1 + daftar periksa Lapis 2 + profil/unduh Lapis 3 |
| T15 (slide lain, mis. B3-07) | perekam suara + daftar periksa |

Jadi, **mengubah isi naskah cukup lewat `tools/gen_data.py`**; widget ikut menyesuaikan selama judul kolom tetap.
Slide dengan widget baru tercatat selesai setelah semua widget-nya tuntas.

## Penyusun jikoshoukai (T16, B4-14)

`js/jikoshoukai.js` (`MN_JIKO.widget`) dipanggil dari `interaktif.js`. Kalimat **tidak ditulis ulang di kode**: blok 3 dibaca dari tabel B4-07,
blok 4 dari B4-08 (kelebihan + dua contoh bukti), blok 5 dari B4-09, daftar kota dari tabel B4-14, tempat kerja dari paragraf "Kosakata tempat kerja" B4-07.
Mengubah naskah lalu `gen_data.py` otomatis mengubah pilihan. Yang tetap di kode: kerangka kalimat blok 1, 2, 4; cara baca usia 18–25 dan 1–5 tahun;
nama kota berbahasa Indonesia (kolom arti); konverter katakana → romaji (gaya naskah: koukou, juu); rumus durasi 0,27 dtk/karakter (patokan contoh Rani ±40 dtk).
Isian dan hasil disimpan di `MN_STORE.get().jiko` (`f` = isian, `hasil` = teks akhir) supaya bisa dipakai B4-15.

## Bank Kosakata dan Kartu Hafalan (GLB-03)

`js/kosakata.js` (`MN_KOSA.mount`) dipasang oleh `scrHal('GLB-03')` di `app.js`. Data: `D.bab[i].glos[]` = `{jp, ro, ar, kat, k}` yang dibuat
`tools/gen_data.py` dari tabel "Glosarium" di akhir naskah tiap bab (`k` = indeks slide pertama di bab itu yang memuat istilah, -1 bila tidak ada;
`kat` = kategori dari daftar `KAT_*` di gen_data.py, bawaan `wawancara`). Istilah yang sama di beberapa bab digabung (68 unik dari 77 baris).

Kartu hafalan memakai Leitner tiga kotak: kotak 1 tiap sesi, kotak 2 tiap 2 sesi, kotak 3 tiap 4 sesi; satu sesi 10 kartu; paling banyak 4 slot
dicadangkan untuk kartu kotak 2/3 yang waktunya tiba (kotak 3 didahulukan) supaya tidak tersisih oleh kotak 1 yang banyak di awal; berbintang didahulukan.
"Sudah tahu" naik satu kotak, "Belum tahu" kembali ke kotak 1. Progres di `MN_STORE.get().kosa = { box:{istilah:1|2|3}, star:{istilah:1}, sesi:n }`
(hanya di perangkat; ikut terhapus oleh "Hapus semua data"). Suara memakai `MN_IX.sayJa` (suara ja-JP perangkat) sampai ada rekaman.

## Latihan Pertanyaan Acak (GLB-04) dan perekam suara

`js/latihan.js` (`MN_LATIH.mount`) dipasang oleh `scrHal` (cabang yang sama dengan GLB-03). Data: `D.latih[]` = `{no, g (A–D), q{jp,ro,ar}, topik, acuan, inti, a{jp,ro,ar}, dari, mirip}`,
dibuat `tools/gen_data.py` dari empat tabel bank di dokumen Fitur Global. Contoh jawaban `a` diambil dari slide (peta `SUMBER` di gen_data.py: B4-10, B5-03…08, B2-10);
`mirip` terisi bila contoh berasal dari soal serupa (varian nomor 10–17, soal 2, 4, 5, 23, 25), dan layar menampilkannya sebagai "Contoh dari soal serupa".

- **Dengar:** suara pertanyaan (teks disembunyikan) → pilih satu dari 12 topik → benar/salah, teks, romaji, arti, contoh jawaban.
- **Jawab-rekam:** suara → hitung mundur 5 dtk → rekam otomatis (maks. 60 dtk) → analisis Lapis 1 + pemutar rekaman + contoh jawaban → "Perlu latih lagi" / "Sudah cukup".
- Jumlah 5/10/25, kecepatan Normal (0,85) / Pelan (0,6). Tidak dinilai. Soal yang perlu diulang tersimpan di `MN_STORE.get().latih.ulang`. Rekaman tidak disimpan.
- Tanpa mikrofon: peserta menjawab keras lalu langsung ke contoh jawaban. Tanpa suara Jepang di perangkat: teks pertanyaan ditampilkan.

`js/suara.js` (`MN_SUARA`) = perekam (MediaRecorder + AnalyserNode, cuplikan level tiap 0,1 dtk) dan **analisis Lapis 1** (durasi bicara, jeda ≥ 1 dtk, volume, gelombang SVG).
Dibuat terpisah agar T15 (B4-15, B5-13) bisa memakainya. `MN_IX.sayJa(teks, rate, onend)` kini menerima kecepatan dan callback selesai.

## Latihan lisan 3 lapis (T15: B4-15, B5-13)

`js/lisan.js` (`MN_LISAN.widget(kode, env)`) dipanggil dari `interaktif.js` untuk B4-15 dan B5-13; slide T15 lain (B3-07) tetap memakai perekam sederhana `W.record`.
Daftar langkah storyboard di dua slide itu (Persiapan, Lapis 1–3) disembunyikan; widget menggantikannya.

- **B4-15** (jikoshoukai): mode panduan "Teks penuh" (jikoshoukai dari B4-14 bila ada, jika tidak contoh Rani B4-10) atau "Hanya nama blok"; target 30–60 dtk, berhenti otomatis di 90 dtk; Lapis 2 = contoh Rani per blok + daftar periksa 7 butir.
- **B5-13**: tiga pertanyaan acak dari `D.lisan5` (tabel B5-04..B5-07, dibuat `gen_data.py`); target 10–30 dtk, maks. 60 dtk; Lapis 2 = contoh jawaban Rani + 4 butir daftar periksa.
- **Lapis 1** memakai `MN_SUARA.analisis(level, target)`. **Lapis 3**: ringkasan profil, "Unduh rekaman" (tiap rekaman satu berkas) dan "Unduh lembar rubrik" (.txt: hasil Lapis 1, centang peserta, kolom skor instruktur).
- Yang tersimpan hanya angka di `MN_STORE.get().lisan` (`jiko` dan `jawab[]`: durasi, jeda, volume, jumlah centang). Rekaman hanya ada selama slide dibuka. Rapor menampilkan "Profil Kesiapan Lisan" (formatif).
- Tanpa mikrofon: Lapis 1 dilewati; peserta berlatih dengar-tirukan lalu menekan "Selesai berlatih". Lanjut aktif setelah minimal satu rekaman (atau setelah "Selesai berlatih" tanpa mikrofon).

## Tips & Trik (GLB-05)

`js/tips.js` (`MN_TIPS.mount`) dipasang oleh `scrHal` (cabang FITUR yang sama dengan GLB-03/04). Data `D.tips[]` = `{tahap, no, tips, acuan, alasan}` dari tabel GLB-05 di dokumen Fitur Global (via `gen_data.py`).
Delapan kartu dalam rel geser CSS scroll-snap; tab Sebelum/Saat/Sesudah melompat ke kartu pertama tiap tahap; titik, tombol sebelumnya/berikutnya, dan panah keyboard.
"Pelajari" membuka slide acuan (`#/bab/N/K`) atau halaman fitur (GLB-04); tombol terkunci bila bab acuan belum terbuka (sebelum pre-test).
Kolom `Alasan` opsional: bila ditambahkan ke tabel naskah, `gen_data.py` memuatnya dan kartu menampilkannya.

## Simulasi: Mode Latihan, suara pewawancara, rekaman SIM-06

- **Mode Latihan** (tombol di pengantar SIM-00): `sim.mode = 'latihan'`. Tanpa timer, tanpa nilai: tidak menulis `S.sim` (Post-test tetap terkunci), ringkasan tersendiri (`scrSimLatEnd`). Tombol **Petunjuk Navi** menunjuk slide acuan momen (`m.acuan`); setelah memilih tampil tindakan terbaik + tautan pelajari.
- **Suara pewawancara**: tombol di gelembung ucapan + putar otomatis saat momen tampil (`MN_IX.sayJa`, suara ja-JP bawaan perangkat).
- **SIM-06** (hanya simulasi resmi): setelah memilih, kartu rekaman opsional `js/simrek.js` (target 30–60 dtk, tidak dinilai, tidak lanjut otomatis). Angka masuk `MN_STORE.get().lisan.sim06` dan tampil di Profil Kesiapan Lisan pada rapor.

## Pengaturan global (GLB-02, GLB-06)

`MN_STORE.set()` = `{ ro, ar, kec }` (Romaji dan Arti menyala bawaan; kecepatan `normal` | `pelan`). Kelas `no-ro` / `no-ar` dipasang di `<body>` oleh `show()` dan berlaku di semua layar.
Di slide materi, pola `「日本語」 (romaji, "arti")` dibungkus `MN_IX.roWrap` (di `md()` interaktif.js) menjadi `<span class="gro"><span class="r">…</span><span class="s">…</span><span class="a">…</span></span>`;
tiga bentuk: romaji + "arti" berkutip, romaji + arti tanpa kutip (dikenali dari kata awal bahasa Indonesia: Saya, Jika, Tidak, …), dan romaji saja (`ro-only`). Saat keduanya menyala teks identik dengan aslinya (diuji pada seluruh teks slide).
Widget kartu (`.ix-ro`, `.ix-ar`) ikut kelas yang sama. Tombol Romaji/Arti ada di setiap slide materi dan di Pengaturan, bersama kecepatan suara. `MN_STORE.ok()` false bila penyimpanan ditolak peramban; beranda menampilkan pesan.

## Pemandu Navi dan Kata Mutiara (GLB-07)

`js/navi.js` (`MN_NAVI`):
- **Saran di beranda** (`saran()`, kartu `#navi-saran`, bisa ditutup, diingat per sesi untuk saran yang sama): pre-test belum → mulai pre-test; ada bab sedang dipelajari → "Lanjutkan Bab N dari …?"; bab belum bertempel dengan hasil pre-test terendah → "Stempel Bab N belum ada. Coba bab itu dulu?"; enam stempel → Simulasi; Simulasi selesai → Post-test; semua selesai → Rapor.
- **Petunjuk Navi** (`hint()`): tombol di aktivitas slide materi bertemplate T08/T10/T11/T12 yang punya widget; satu petunjuk yang menunjuk slide terkait (kode slide yang dirujuk di teks aktivitas, atau slide materi sebelumnya; slide pemantik menunjuk slide berikutnya). Tidak muncul di kuis, pre/post-test, dan Simulasi resmi; di Mode Latihan simulasi memakai `m.acuan`.
- **Kata Mutiara**: `D.mutiara` (tabel GLB-07 via `gen_data.py`, dicocokkan dengan kutipan di slide rangkuman). Kartu di slide rangkuman bergambar Navi dan bisa diketuk; halaman koleksi `#/hal/GLB-07` membuka kartu seiring stempel bab (mode uji membuka semua). Suara: `assets/audio/mutiara/B<bab>.mp3` bila ada, jika belum suara bawaan peramban (id-ID).
- Layar hasil kuis memuat reaksi Navi (senang bila lulus, menyemangati bila belum).

## Tata letak responsif (HP, tablet, laptop, landscape)

Acuan: canvas interface v2 (`sumber/desain-canvas/`: D_* laptop, L_* HP landscape). Aturannya ada di akhir `css/app.css`.

| Ukuran | Tata letak |
|---|---|
| HP tegak (<700px) | satu kolom, bilah Kembali/Lanjut menempel di bawah |
| Tablet tegak (700–1023px) | satu kolom (maks. 760px) dengan teks dan padding sedikit lebih besar |
| **HP landscape** (landscape, tinggi ≤ 520px) | bilah atas dipipihkan (52px); **Lanjut/Kembali pindah ke kolom kanan 132px** (`.screen.has-bar > .bottombar` jadi `position: fixed`); isi memakai sisa lebar |
| Landscape ≥ 640px lebar (HP, tablet, laptop) | **Simulasi dua kolom** (`.screen.sim-split`): ilustrasi kiri, pilihan di panel kanan; teks lebih besar di ≥ 1100px |
| ≥ 1024px | **kerangka laptop** (lihat bawah): header penuh lebar + sidebar navigasi di semua layar isi; Rapor dua kolom (`.rapor`) |
| ≥ 1100px | halaman fitur (`.screen.fitur`) lebih lebar, daftar 3 kolom |
| ≥ 1240px | panel kanan 300px di slide materi (`.rpanel`): Navi + **Kosakata di slide ini** (dari `D.bab[].glos` dengan `k` = indeks slide); gelembung Navi di bawah isi disembunyikan |

`show()` menambahkan kelas `has-bar` pada `.screen` yang punya anak `.bottombar` (lewat JavaScript, bukan `:has()`, agar jalan di Chrome Android lama). Layar sim memakai `sim-split` di markup `scrSim`.

**Pintasan keyboard** (di `app.js`, tidak aktif saat mengetik atau menu ☰ terbuka): ← sebelumnya, → berikutnya (bila tidak terkunci), spasi memutar suara narasi, 1–3 memilih tindakan di Simulasi. Kartu geser (GLB-05) memakai panah sendiri.

## Kerangka laptop (≥1024px)

Semua layar isi (slide bab, kuis, Pre/Post-test, Rapor, halaman fitur, Pengaturan) dibungkus `div.with-side` oleh `show()` di `app.js`; pembuka, rak, dan simulasi (layar imersif) tidak.
`.with-side` adalah grid: baris 1 = `header.appbar` (penuh lebar), baris 2 = `aside.side` (lebar `--sbw`, 272px) + `.screen` (+ `.rpanel` 300px di ≥ 1240px). Layar pendek (tinggi ≤ 820px) memakai sidebar lebih rapat. Ukuran acuan: laptop Windows 1920×1080 dengan skala 150% ≈ 1280×720 px CSS.
Di bawah 1024px `appbar` dan `side` disembunyikan CSS, jadi tampilan HP tidak berubah; `.topbar` kolom dipakai di HP, disembunyikan di laptop.

- **`appbar(ws)`**: brand, breadcrumb (diambil dari `.topbar .sub/.title`), progres "n/10" (`bagianSelesai()`: pre-test + 6 stempel + Simulasi + Post-test + Rapor dilihat → `S.raporLihat`), tombol Romaji/Arti, tombol audio (memutar `[data-speak]` pertama), chip nama.
- **`sidebar(cur)`**: Beranda, enam bab (badge warna bab, 済 bila selesai, % bila berjalan, gembok bila terkunci); bab aktif membuka daftar pelajaran (`pelajaran()`, per pelajaran, tanpa kode slide); Evaluasi (Simulasi, Post-test, Rapor; terkunci sesuai syarat); Sumber belajar; Pengaturan. `cur` = `{bab,k}` di slide, `{bab}` di kuis, `{page}` di layar lain (`curDariHash()`).
- Tombol `.gt` (Romaji/Arti) diikat sekali di `show()` (header laptop dan baris di slide HP); jangan mengikatnya lagi di tempat lain agar tidak berubah dua kali.
- Menu ☰ (HP) ikut tertutup saat halaman berganti (`route()`); ikon menu kini berukuran 22px.

- **T02 tabel 3 kolom berkolom pertama kosong** (sekarang hanya B1-02) dirender `W.versus`: dua panel berdampingan (layar terbelah), kalimat "Pertanyaan: …" dipindah ke atas panel, pilihan di dalam panel membuka kunci Lanjut.
