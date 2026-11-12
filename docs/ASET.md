# Aset

## Maskot Navi — `assets/mascot/`

PNG transparan, dipotong dari character sheet resmi (satu pose/ekspresi per file). Bagian tubuh tidak dipisah agar anatomi tetap utuh; gerakan dibuat oleh `js/core/mascot.js`.

| Awalan | Jenis | File |
|---|---|---|
| `exp_` | Ekspresi wajah (setengah badan) | `berpikir`, `bingung`, `gugup`, `menangis`, `netral`, `percaya_diri`, `sedih`, `senang` |
| `pose_` | Pose & gestur (seluruh badan) | `berdiri`, `berlari`, `dagu`, `duduk`, `jempol`, `melambai`, `melompat`, `menunduk`, `menunjuk`, `menyilang`, `semangat` |
| `act_` | Aktivitas | `berbicara`, `memberi_salam`, `presentasi`, `smartphone` |
| `turn_` | Turnaround resolusi tinggi | (belum ada) |

Pemakaian: `MN.Art.mascot('pose_jempol', 'kelas-css', 'Navi mengacungkan jempol')`.

> Ukuran tiap PNG ±0,4–0,8 MB. Pertimbangkan konversi ke WebP sebelum rilis agar pemuatan di ponsel lebih cepat.

## Latar lokasi — `assets/bg/`

| File | Dipakai di |
|---|---|
| `kantor_eksterior.webp` | S01 Halaman Pembuka, S02 layer Tiga Penilaian (mode `soft`) |
| `stasiun.webp` | S02 layer Mindset |
| `lobi.webp` | S02 layer Keputusan, layer Misi (mode `soft`) |
| `peta.webp` | S03 Menu Utama — gambar peta di panel (area 1010 × 720 px), bukan lewat `Bg.photo` |
| `koridor.webp` | Modul 2 / Modul 4 (rencana) |
| `ruang_wawancara.webp` | Modul 4 (rencana) |

Pemakaian: `MN.Bg.photo('lobi')`, `MN.Bg.photo('lobi', 'soft')` (diredupkan agar kartu terbaca), `MN.Bg.photo(null)` (tanpa ilustrasi).

## Audio — `assets/audio/`

Belum diisi. Struktur yang diharapkan `js/core/audio.js`:

```
assets/audio/
├── narator/   s01_01.mp3, s02_01.mp3, …   (nama dari field `file` di data/content.js)
└── musik/     bgm.mp3
```

Setelah file tersedia, ubah `MN.Config.useRealAudio` menjadi `true` di `js/core/audio.js`.

## Palet warna resmi

| Nama | Hex |
|---|---|
| Japanese Red | `#BA1502` |
| Vermilion | `#FF482C` |
| Cream | `#FEE893` |
| Teal | `#1D9999` |
| Teal gelap | `#0E6B6D` |
| Sky | `#9CCCD6` |
| Ink | `#0B3C41` |

## Font

Poppins (Latin) dan Noto Sans JP (Jepang) dari Google Fonts, dengan cadangan font sistem.
