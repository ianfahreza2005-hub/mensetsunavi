# Panduan Kontribusi

## Aturan kerja

1. **Satu scene, satu file** di `js/scenes/` (`s04.js`, `s05.js`, …).
2. **Teks tidak ditulis di file scene.** Semua teks masuk ke `data/content.js` (lihat [docs/PANDUAN-KONTEN.md](docs/PANDUAN-KONTEN.md)).
3. **Jangan ubah `js/core/`** tanpa memberi tahu tim; perubahan di sana memengaruhi semua scene.
4. Gunakan `ctx.after()` alih-alih `setTimeout` di dalam scene agar timer otomatis batal saat layar berganti.
5. Animasi hanya memakai `transform` dan `opacity`, dan hormati `prefers-reduced-motion`.

## Gaya kode

- JavaScript ES5 di dalam IIFE dengan `'use strict'` (tanpa *build step*, harus jalan dari `file://`).
- Indentasi 2 spasi, kutip tunggal, titik koma.
- Komentar dalam Bahasa Indonesia; awali file dengan blok komentar yang menjelaskan isi scene.
- Nama kelas CSS untuk scene diawali ID scene (mis. `.s04-blok`).

## Alur Git

```bash
git checkout -b scene/s04-jikoshoukai
# … kerjakan …
git add .
git commit -m "feat(s04): lima blok jikoshoukai"
git push -u origin scene/s04-jikoshoukai
```

Lalu buka Pull Request ke `main`. Format pesan commit:

| Awalan | Untuk |
|---|---|
| `feat(sXX):` | Scene/fitur baru |
| `fix(sXX):` | Perbaikan bug |
| `content:` | Perubahan teks di `data/content.js` |
| `asset:` | Menambah/mengganti aset |
| `style:` | CSS saja |
| `docs:` | Dokumentasi |

## Sebelum Pull Request

- [ ] Scene bisa dibuka langsung lewat `index.html#SXX`
- [ ] Tombol Kembali/Lanjut dan keyboard (← / → / Enter) bekerja
- [ ] Tidak ada error di Console peramban
- [ ] Dicoba di layar desktop dan ponsel lanskap
- [ ] `CHANGELOG.md` diperbarui
