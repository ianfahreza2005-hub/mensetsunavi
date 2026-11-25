# Logo Mensetsu Navi

Maskot Navi (setengah badan, jempol + map CV) di dalam lingkaran bermotif seigaiha dengan bintang kompas dan cap 面, ditambah tulisan tebal MENSETSU / NAVI / 面接ナビ. Gaya vektor satu warna, warna dari palet aplikasi: 鉄紺 #0E2A47, putih, 茜 #B3282F.

## Isi folder

| Berkas | Isi |
|---|---|
| `asli/` | Gambar asli dari generator gambar (latar polos): `mendatar-gelap.jpg`, `mendatar-terang.jpg`, `tegak-gelap.jpg` |
| `buat_logo.py` | Membuat semua SVG di `assets/logo/` dan `assets/favicon.svg` (trace potrace) |
| `ikon.js` | Membuat `assets/icon-192.png`, `assets/icon-512.png`, dan PNG dokumen di `png/` dari SVG |
| `png/` | PNG latar transparan untuk Word/slide (tegak 1600 px, mendatar 1000 px tingginya) |

## Varian di `assets/logo/`

| Berkas | Bentuk | Dipakai |
|---|---|---|
| `logo-tegak-putih.svg` | Emblem di atas, tulisan di bawah | Layar pembuka |
| `logo-mendatar-putih.svg` | Emblem di kiri, tulisan di kanan | Banner, header dokumen (latar gelap) |
| `logo-ringkas-putih.svg` | Mendatar, tulisan setinggi emblem agar terbaca di ukuran kecil | Bilah atas aplikasi |
| `logo-ringkas-navy.svg` | Sama, versi terang | Header rak bab |
| `logo-emblem-navy.svg` | Emblem saja | Layar muat rak |
| `logo-emblem-putih.svg` | Emblem saja | Sama dengan `assets/favicon.svg`; dasar ikon aplikasi |
| `*-navy.svg` lainnya | Versi terang | Dokumen dan slide berlatar putih |

- **putih** = seni putih untuk latar gelap; **navy** = seni navy untuk latar putih/terang.
- Emblem selalu punya alas (lingkaran + kotak cap) berwarna latarnya sendiri: navy untuk versi putih, putih untuk versi navy. Jadi wajah dan rambut Navi tetap benar di latar apa pun. Tulisan tidak beralas.
- Semua varian memakai potongan yang sama (emblem dan tulisan dari `asli/mendatar-*.jpg`); versi tegak disusun ulang dengan perbandingan `asli/tegak-gelap.jpg`.
- Ruang kosong minimal di sekitar logo: setinggi huruf "MENSETSU". Jangan meregangkan, memutar, atau mengganti warna di luar dua versi di atas.

## Membuat ulang

```bash
sudo apt install potrace          # sekali saja
python3 sumber/logo/buat_logo.py  # SVG
node sumber/logo/ikon.js          # ikon PNG + PNG dokumen (perlu Playwright)
python3 tools/build_sw.py
```

Kalau logo diganti, simpan gambar asli baru di `asli/` dengan nama yang sama (latar polos satu warna, tanpa bayangan), lalu jalankan ulang perintah di atas.
