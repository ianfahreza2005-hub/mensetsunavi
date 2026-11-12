# Panduan Konten

Semua teks yang tampil di layar disimpan di [`data/content.js`](../data/content.js) dalam objek `MN.Text`, dikelompokkan per scene (`S01`, `S02`, …). Penulis konten tidak perlu menyentuh file scene.

## Tanda status teks

| Tanda | Arti |
|---|---|
| `[STORYBOARD]` | Disalin dari storyboard kelompok — final |
| `[DRAFT]` | Usulan karena storyboard belum merinci; perlu persetujuan kelompok |
| `+ cek SME` | Kalimat bahasa Jepang perlu diperiksa ahli materi |

Saat teks `[DRAFT]` disetujui, ganti tandanya menjadi `[STORYBOARD]`.

## Narasi

```js
narasi: { file: 's02_01', text: 'Teks yang dibacakan…' }
```

- `text` tampil sebagai teks bawah layar dan menjadi transkrip.
- `file` adalah nama rekaman tanpa ekstensi di `assets/audio/narator/`. Konvensi: `s<nomor scene>_<urutan dua digit>`, misalnya `s04_03.mp3`.

## Soal pilihan (keputusan)

```js
{ tier: 'tepat' | 'kurang' | 'salah',
  delta: 10 | -5 | -10,           // perubahan Trust Meter
  gestur: 'Deskripsi tindakan',
  jp: '「日本語の文」',             // kosongkan bila tidak ada ucapan
  romaji: 'Nihongo no bun',
  arti: 'Terjemahan Indonesia',
  fb: 'Umpan balik setelah dipilih' }
```

Setiap soal sebaiknya punya tepat satu opsi `tepat`. Urutan tampil opsi diacak oleh scene bila diperlukan.

## Menambah scene baru

1. Tambahkan teks di `MN.Text.S0x` pada `data/content.js`.
2. Buat `js/scenes/s0x.js` memakai `MN.defineScene` (lihat [ARSITEKTUR.md](ARSITEKTUR.md)).
3. Muat file itu di `index.html` **sebelum** `placeholder.js`.
4. Hapus baris scene tersebut dari daftar `LIST` di `js/scenes/placeholder.js`.
5. Atur latar di `css/style.css` (`body[data-scene="S0x"]`) dan panggil `MN.Bg.photo('<nama>')` bila perlu.
6. Uji lewat `index.html#S0x`.

## Gaya bahasa

- Bahasa Indonesia santai-sopan, menyapa peserta dengan "kamu"; Navi menyebut dirinya "aku".
- Kalimat narasi pendek (maks. ±25 kata per kalimat) agar teks bawah layar mudah dibaca.
- Istilah Jepang ditulis dalam romaji miring pertama kali muncul, lalu dijelaskan (contoh: *ojigi* — membungkuk hormat).
