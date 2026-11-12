# Arsitektur

Mensetsu Navi adalah *single-page application* tanpa framework. Semua modul menempel pada satu objek global `window.MN`.

## Urutan pemuatan skrip

Urutan di `index.html` penting karena setiap file memakai modul yang dimuat sebelumnya:

```
art.js → bg.js → mascot.js → fx.js → state.js → audio.js → ui.js → app.js
→ data/content.js → scenes/s01.js … placeholder.js → MN.App.start()
```

## Namespace `MN`

| Modul | File | Tanggung jawab |
|---|---|---|
| `MN.Art` | `js/core/art.js` | Markup maskot (`Art.mascot(pose, cls, alt)`), ikon, ilustrasi panel SVG |
| `MN.Bg` | `js/core/bg.js` | Latar beranimasi; `MN.Bg.photo('lobi')` mengganti ilustrasi lokasi |
| `MN.Mascot` | `js/core/mascot.js` | `MN.Mascot.create({ pose, cls, alt })` → elemen maskot hidup |
| `MN.Fx` | `js/core/fx.js` | `sakuraWipe(onMid)`, `bgKick(dir, soft)` |
| `MN.State` | `js/core/state.js` | Progres, Trust Meter, status modul |
| `MN.Audio`, `MN.Config` | `js/core/audio.js` | Narasi, SFX, musik; konfigurasi audio |
| `MN.UI` | `js/core/ui.js` | Helper DOM `h()`, HUD, caption, toast, panel bantuan |
| `MN.App`, `MN.defineScene` | `js/core/app.js` | Mesin navigasi scene/step |
| `MN.Text` | `data/content.js` | Semua teks yang tampil |

## Scene dan Step

Satu **scene** (S01, S02, …) berisi satu atau beberapa **step** (setara *layer* di Articulate Storyline). Berpindah step/scene tidak memuat ulang halaman; elemen `<section class="step">` baru dipasang dan yang lama dianimasikan keluar.

```js
MN.defineScene({
  id: 'S02',            // ID scene, juga bisa dipakai sebagai hash URL (#S02)
  title: 'Onboarding',
  home: false,          // tampilkan tombol Menu (rumah) di HUD
  bare: false,          // true = sembunyikan bilah bawah Kembali/Lanjut
  steps: [
    { id: 'mindset',
      gated: true,       // tombol Lanjut nonaktif sampai ctx.enableNext()
      back: true,        // izinkan tombol Kembali (false untuk aktivitas bernilai)
      next: true,        // tampilkan tombol Lanjut
      nextLabel: 'Lanjut',
      nextScene: 'S03',  // opsional: Lanjut pindah ke scene lain
      onNext(ctx) { },   // opsional: kembalikan false untuk membatalkan
      enter(ctx) { /* bangun isi ctx.el */ } }
  ],
  onEnter(App) { }, onExit(App) { }
});
```

### Objek `ctx` di dalam `enter(ctx)`

| Properti | Kegunaan |
|---|---|
| `ctx.el` | Elemen `<section>` milik step ini |
| `ctx.alive()` | `false` bila pengguna sudah pindah layar (hindari callback basi) |
| `ctx.after(ms, fn)` | `setTimeout` yang otomatis batal bila layar sudah berganti |
| `ctx.narrate(text, opts)` | Putar narasi / tampilkan teks bawah layar |
| `ctx.enableNext(on, label)` | Aktifkan tombol Lanjut |
| `ctx.next()`, `ctx.back()`, `ctx.goStep(i)`, `ctx.goScene(id)` | Navigasi |
| `ctx.sfx(nama)` | Efek suara (`click`, `swoosh`, dll.) |

### Transisi

`App.mount()` menandai hingga 8 blok utama layar dengan kelas `.tx` dan variabel CSS `--k` (indeks kedalaman). CSS memakai nilai ini untuk menunda/menggeser tiap lapisan sehingga tercipta efek parallax. Arah: Lanjut masuk dari kanan, Kembali dari kiri.

## State

Disimpan di `localStorage` dengan kunci `mensetsuNavi.progress.v1`:

```js
{
  trust: 50,              // Trust Meter 0–100
  trustShown: false,
  done: { M1, M2, M3, M4 },   // = variabel M1Done–M4Done pada storyboard
  stampSeen: {}, unlockSeen: false, menuIntroSeen: false,
  onboardingDecision: null,
  muted: false,
  scores: {}              // diisi oleh S05–S17
}
```

API: `State.addTrust(delta)`, `State.markDone('M1')`, `State.coreDone()`, `State.doneCount()`, `State.reset()`.

Bila struktur data berubah secara tidak kompatibel, naikkan versi kunci (`…v2`) agar progres lama tidak merusak tampilan.

## Audio

- `MN.Config.useRealAudio = false` → narasi tampil sebagai teks bawah layar, durasi diperkirakan dari panjang teks.
- Ubah ke `true` setelah file rekaman tersedia di `assets/audio/narator/<file>.mp3` (nama `file` diambil dari `data/content.js`).
- Musik latar sintetis bisa diganti file `assets/audio/musik/bgm.mp3`.
- Peramban memblokir suara sebelum interaksi pertama; `App.start()` mengaktifkan audio pada `pointerdown` pertama.

## Penempatan latar per scene

`App.go()` menulis `data-scene` pada `<body>`. Posisi dan skala lapisan latar per scene diatur di `css/style.css` lewat selektor `body[data-scene="S0x"]`.
