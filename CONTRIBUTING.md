# Panduan Kontribusi

## Aturan kerja

1. **Isi materi tidak ditulis di kode.** Teks, soal, dan momen simulasi ada di `js/data/kursus.js`, yang dibuat dari naskah dengan `tools/gen_data.py`.
2. Layar baru atau template slide baru ditambahkan di `js/app.js` (fungsi `scr…`); gaya di `css/app.css`.
3. Rak bab 3D ada di `rak.html`; jangan ubah tanpa mencoba ulang di HP.
4. Animasi hanya memakai `transform` dan `opacity`, dan hormati `prefers-reduced-motion`.
5. Setelah mengubah file apa pun yang dipakai aplikasi, jalankan `python tools/build_sw.py`.

## Alur Git

```bash
git checkout -b fitur/t05-kartu-ungkapan
git commit -m "feat(t05): kartu ungkapan audio"
git push -u origin fitur/t05-kartu-ungkapan
```

Buka Pull Request ke `main`; setelah digabung, situs terbit otomatis.

| Awalan | Untuk |
|---|---|
| `feat:` | Layar/fitur baru |
| `fix:` | Perbaikan bug |
| `content:` | Perubahan isi (kursus.js) |
| `asset:` | Menambah/mengganti aset |
| `style:` | CSS saja |
| `docs:` | Dokumentasi |

## Sebelum Pull Request

- [ ] Tidak ada error di Console peramban
- [ ] Dicoba di HP (tegak dan landscape) dan laptop
- [ ] Dicoba offline (setelah dibuka sekali)
- [ ] `CHANGELOG.md` diperbarui
