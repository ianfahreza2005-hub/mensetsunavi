# Mensetsu Navi 面接ナビ

> **Pemandu Wawancara Kerja Jepang** — media pembelajaran multimedia interaktif untuk berlatih menghadapi wawancara kerja di perusahaan Jepang, dipandu maskot **Navi**.

Peserta berperan sebagai kandidat yang akan diwawancarai di sebuah perusahaan di Tokyo. Setiap keputusan yang diambil menambah atau mengurangi **Trust Meter** (kepercayaan pewawancara), mulai dari 50. Prinsip yang diajarkan: *hire for attitude, train for skill* — sikap, etiket, kejujuran, dan kemauan beradaptasi sama pentingnya dengan kemampuan bahasa.

---

## Daftar Isi

- [Fitur](#fitur)
- [Struktur Pembelajaran](#struktur-pembelajaran)
- [Menjalankan](#menjalankan)
- [Struktur Folder](#struktur-folder)
- [Teknologi](#teknologi)
- [Status Pengembangan](#status-pengembangan)
- [Dokumentasi](#dokumentasi)
- [Kontribusi](#kontribusi)

## Fitur

- **Panggung 16:9 responsif** — seluruh layar diskalakan mengikuti ukuran jendela; perangkat potret diminta memutar ke lanskap.
- **Navigasi SPA tanpa muat ulang** — scene (S01–S19) terdiri atas beberapa *step/layer*, dengan transisi parallax berlapis dan efek sapuan kelopak sakura.
- **Trust Meter** — pilihan tepat `+10`, kurang tepat `−5`, salah `−10` (dibatasi 0–100).
- **Peta modul non-linear** — Modul 1–3 bebas urutan; Modul 4 terbuka setelah 1–3 selesai; Modul 5 (rapor) setelah Modul 4.
- **Maskot Navi yang "hidup"** — animasi napas, goyang, anggukan, dan pergantian pose/ekspresi dengan crossfade.
- **Latar "Japanese Workplace" beranimasi** — langit, Gunung Fuji, siluet kota, torii, sakura, ditambah ilustrasi lokasi (stasiun, lobi, koridor, ruang wawancara).
- **Audio** — SFX dan musik latar pentatonik Jepang dibuat dengan WebAudio; narasi memakai rekaman asli bila tersedia, atau teks bawah layar (sekaligus transkrip aksesibilitas).
- **Progres tersimpan otomatis** di `localStorage` peramban.
- **Aksesibilitas** — dukungan keyboard (← / → / Enter / Esc), `aria-live` pada Trust Meter dan narasi, menghormati preferensi *reduce motion*.

## Struktur Pembelajaran

| Scene | Isi | Status |
|---|---|---|
| S01 | Halaman Pembuka | ✅ Selesai |
| S02 | Onboarding (Modul 0): mindset, tiga penilaian, keputusan awal di lobi, misi | ✅ Selesai |
| S03 | Menu Utama (peta jalan menuju kantor) | ✅ Selesai |
| S04–S07 | **Modul 1** — Anatomi Jikoshoukai dan Hatsuon (±15 menit) | 🚧 Placeholder |
| S08–S10 | **Modul 2** — Etiket Fisik dan Japanese Common Sense (±10 menit) | 🚧 Placeholder |
| S11–S12 | **Modul 3** — Studi Kasus Etos Kerja / Hou-Ren-Sou (±8 menit) | 🚧 Placeholder |
| S13–S17 | **Modul 4** — The Ultimate Interview (simulasi wawancara, ±10 menit) | 🚧 Placeholder |
| S18–S19 | **Modul 5** — Rapor Kesiapan Kerja dan penutup (±3 menit) | 🚧 Placeholder |

Total durasi belajar diperkirakan ±45–60 menit. Rincian alur ada di [docs/ALUR-SCENE.md](docs/ALUR-SCENE.md).

## Menjalankan

Tidak perlu instalasi atau proses *build*. Semua skrip dimuat sebagai `<script>` biasa.

**Cara paling cepat:** buka `index.html` langsung di peramban (Chrome, Edge, Firefox, Safari).

**Lewat server lokal (disarankan saat mengembangkan):**

```bash
python -m http.server 8000
```

lalu buka <http://localhost:8000>. Alternatif lain: ekstensi **Live Server** di VS Code, atau `npx serve .`.

**Membuka scene tertentu:** tambahkan hash pada URL, misalnya `index.html#S03` untuk langsung ke Menu Utama.

> Font Poppins dan Noto Sans JP dimuat dari Google Fonts. Tanpa internet, aplikasi tetap berjalan memakai font bawaan perangkat.

## Struktur Folder

```
mensetsu-navi-lengkap/
├── index.html              # Titik masuk: panggung, HUD, bilah bawah, panel bantuan
├── css/
│   └── style.css           # Seluruh gaya, animasi, dan penempatan latar per scene
├── data/
│   └── content.js          # Semua teks, soal, dan nama file narasi (MN.Text)
├── js/
│   ├── core/
│   │   ├── art.js          # Ilustrasi: maskot, ikon, panel SVG (palet resmi)
│   │   ├── bg.js           # Latar "Japanese Workplace" beranimasi
│   │   ├── mascot.js       # Maskot Navi hidup (idle + ganti pose)
│   │   ├── fx.js           # Efek transisi: sakuraWipe, bgKick
│   │   ├── state.js        # Progres peserta & Trust Meter (localStorage)
│   │   ├── audio.js        # Narasi, SFX, musik (WebAudio) + MN.Config
│   │   ├── ui.js           # Helper DOM, HUD, caption, toast, bantuan
│   │   └── app.js          # Mesin navigasi scene/step (MN.App)
│   └── scenes/
│       ├── s01.js          # Halaman Pembuka
│       ├── s02.js          # Onboarding
│       ├── s03.js          # Menu Utama
│       └── placeholder.js  # Penanda tempat S04–S19
├── assets/
│   ├── bg/                 # Ilustrasi lokasi (.webp)
│   ├── mascot/             # Pose & ekspresi Navi (.png transparan)
│   └── audio/              # Rekaman narasi & musik (belum diisi)
└── docs/                   # Dokumentasi pengembang
```

## Teknologi

- HTML5, CSS3, JavaScript ES5 (tanpa framework, tanpa *bundler*)
- Web Audio API untuk SFX dan musik sintetis
- Web Animations API dan CSS transform untuk animasi ringan
- `localStorage` untuk penyimpanan progres
- Palet resmi: Japanese Red `#BA1502`, Cream `#FEE893`, Vermilion `#FF482C`, Teal `#1D9999`, Sky `#9CCCD6`, Ink `#0B3C41`

## Status Pengembangan

Versi saat ini adalah **prototipe** (S01–S03 selesai, sisanya placeholder agar seluruh alur navigasi sudah bisa dicoba). Panel **Bantuan** berisi *alat uji prototipe* untuk menandai modul selesai atau menghapus progres; alat ini akan dihapus pada versi akhir.

Teks di `data/content.js` diberi tanda `[STORYBOARD]` (dari rancangan kelompok) atau `[DRAFT]` (usulan, perlu disetujui kelompok; kalimat Jepang perlu dicek SME).

Rencana selengkapnya: [docs/ROADMAP.md](docs/ROADMAP.md) · Riwayat perubahan: [CHANGELOG.md](CHANGELOG.md)

## Dokumentasi

| Dokumen | Isi |
|---|---|
| [docs/ARSITEKTUR.md](docs/ARSITEKTUR.md) | Cara kerja mesin scene, namespace `MN`, state, audio |
| [docs/ALUR-SCENE.md](docs/ALUR-SCENE.md) | Peta alur S01–S19 dan aturan buka-kunci modul |
| [docs/PANDUAN-KONTEN.md](docs/PANDUAN-KONTEN.md) | Mengubah teks, soal, dan menambah narasi |
| [docs/ASET.md](docs/ASET.md) | Daftar aset maskot, latar, audio, dan konvensi nama file |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Tahapan pengerjaan berikutnya |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Aturan kerja tim, gaya kode, alur commit |

## Kontribusi

Lihat [CONTRIBUTING.md](CONTRIBUTING.md). Singkatnya: satu scene per file di `js/scenes/`, semua teks di `data/content.js`, uji di peramban desktop dan ponsel (lanskap) sebelum commit.

## Lisensi

Belum ditentukan. Seluruh aset maskot dan ilustrasi adalah milik tim pengembang Mensetsu Navi.
