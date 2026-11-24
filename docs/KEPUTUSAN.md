# Keputusan Desain — Mensetsu Navi (Kelompok 2, Kelas A)

Catatan keputusan yang sudah dikunci. Semua dokumen T1/T2 harus mengikuti ini.

**Status (24 Nov 2026):** rancangan T1 + materi difiksasi; GBIM, JM, flowchart berkode, dan storyboard selesai, dan semua rancangan sudah tersedia sebagai file Word (paket 00–13). Storyboard resmi = file Word format Pak Imbar (T2_Storyboard_Mensetsu_Navi_Format_Imbar.docx). Interface versi 2 di canvas Design (HP tegak, HP landscape, laptop). Layar pemilihan bab = rak buku 3D. Web v0.4 (kerangka + template interaktif + tampilan dirapikan) online di https://ianfahreza2005-hub.github.io/mensetsunavi/. Proyek dilanjutkan di Claude Code dari repo ini. Maskot resmi tim = Navi (ada di repo). Perubahan materi hanya dari masukan SME/dosen.

## Keputusan dasar
- **Judul:** Pengembangan Multimedia Pembelajaran Interaktif "Mensetsu Navi" sebagai Pelatihan Mandiri Wawancara Kerja Bahasa Jepang bagi Peserta LPK Tingkat N4
- **Sasaran (satu):** Peserta pelatihan LPK/PPKD calon pekerja ke Jepang, 18–25 tahun, lulusan SMA/SMK, bahasa Jepang setara N4.
- **Tujuan (satu, ABCD):** Diberikan simulasi wawancara kerja berbahasa Jepang dalam multimedia, peserta pelatihan LPK tingkat N4 mampu menerapkan tahapan mensetsu, mulai dari masuk ruangan, jikoshoukai, menjawab pertanyaan pewawancara, hingga menutup wawancara, sesuai etika dan budaya komunikasi kerja Jepang dengan capaian skor minimal 75.
- **Struktur:** Layar pembuka (GLB-00) → Pre-test → Bab 1–6 → Simulasi → Post-test → Rapor; fitur global GLB-01–07.
- **Output:** web PWA (GitHub Pages, bisa dipasang di HP dan dipakai offline setelah dibuka sekali), slide per slide, pola LMS, tanpa server; progres di localStorage. Zip tetap bisa jadi cadangan untuk laptop.
- Produk umum lintas bidang kerja; materi dikembangkan dari rancangan awal kelompok (T2 PMP 7: Modul 0–5).

## GBIM & JM (22 Nov)
- GBIM: format rancangan awal (No · TIK · Indikator · Pokok bahasan · Metode · Evaluasi · Pustaka). TIK 1–6 = Bab 1–6 (enam capaian T1); TIK 7 = penerapan utuh (pre-test, SIM-01–13, post-test, rapor). + komponen pendukung GLB-00–07 + ringkasan isi media.
- JM: format rancangan awal (No · Pokok bahasan · Judul · Uraian materi · Latihan/evaluasi), satu baris per pelajaran (P1–P5) dengan kode slide; dikelompokkan per TIK 1–7.
- Butir bank (post-test, 20 butir): Bab1 no.1–2, Bab2 3–5, Bab3 6–9, Bab4 10–13, Bab5 14–17, Bab6 18–20.
- **Pre-test dipersingkat jadi 10 butir (24 Nov, permintaan tim)**: butir no. **1, 3, 5, 6, 8, 12, 13, 15, 16, 18** (Bab 1:1, 2:2, 3:2, 4:2, 5:2, 6:1). Alasan pemilihan: semua bab terwakili proporsional; butir berdiri sendiri (tanpa audio/gambar; butir 14 = soal menyimak tidak dipakai); ragam jenis (situasi, konsep/fakta, penerapan, mendeteksi kesalahan); kunci seimbang (A3 B2 C3 D2). Post-test tetap 20 butir dan memuat 10 butir yang sama; **N-gain dihitung pada 10 butir yang sama** (pre-test lama 20 butir dihitung ulang pada 10 butir itu). Daftar butir ada di `tools/gen_data.py` (`PRE10`). Karena satu butir per bab (Bab 1 dan 6), peta kemampuan bab itu hanya 0% atau 100%.
  **Diputuskan tim: cukup 10 butir, tidak perlu menunggu persetujuan dosen/SME.** Dokumen rancangan (T1/GBIM/JM/Storyboard/Flowchart/Evaluasi Sumatif, naskah di `sumber/naskah/` dan paket Word) masih menyebut pre-test 20 soal (PRE-01–20); scene PRE-11–20 tidak lagi dipakai di aplikasi. Perbarui dokumen-dokumen itu bila perlu (dan buat ulang paket Word yang bersangkutan).

## Flowchart berkode (22 Nov)
- Isi: tabel simbol + tabel kode, flowchart utama, flowchart per bab (Bab 1–6, per pelajaran dalam kontainer), flowchart evaluasi, flowchart fitur global.
- Pola tiap bab: Menu → Sampul → P1…Pn → Rangkuman → Kuis → Hasil → "Skor ≥ 80?" ya: Stempel → Menu; tidak: slide remedial → ulangi kuis (5 soal baru).
- Kode scene evaluasi baru: PRE-00 petunjuk, PRE-01–20 soal, PRE-21 hasil; SIM-00 pengantar, SIM-01–13 momen (Fase A 01–02, B 03–05, C 06, D 07–12, E 13), SIM-14 transisi penilaian, SIM-15 pembahasan; POST-00, POST-01–20; RAP-01–03. Mode Latihan simulasi tanpa timer/nilai.
- Fitur global: menu ☰ → GLB-01/03/04/05/Pengaturan (GLB-02, 06) → kembali ke slide asal.
- Kotak garis putus = layer/kartu dalam slide (B3-07, B6-08).

## Storyboard (23 Nov, format Pak Imbar)
- Wajib mengikuti template dosen (Kunto Imbar), sama dengan susunan di T2 PMP 7 / Versi 3: tabel identitas, judul "STORYBOARD - NON LINEAR", lalu kartu per scene: Scene | Treatment, Visual, Narasi/Dialog, Suara | Interaksi (Normal/Hover/Hit/Swipe/Drag/Drop/Show), Catatan; kotak biru muda, label biru.
- File resmi: T2_Storyboard_Mensetsu_Navi_Format_Imbar.docx (±105 hlm A4, 114 scene, kode sama dengan flowchart), kartu urut alur peserta. Narasi/Dialog lengkap dari naskah; kuis memuat kisi-kisi + pokok soal; SIM-01–13 punya tabel "Pilihan tindakan".
- Doc Claude storyboard (https://claude.ai/artifact/2JqbRfuDNc9ffXL4FfxD32) = arsip kerja (Sketsa Visual T01–T21, 13 butir cek SME).
- Simulasi: さくら食品, 田中さん; Trust Meter mulai 50 (+10/0/−10, hanya visual); ekspresi akhir ≥70/40–69/<40; pembahasan di SIM-15. SIM-01–13 tanpa Kembali/Lanjut.
- Kartu hafalan GLB-03 = panel khusus, bukan T12.

## Paket Word rancangan (24 Nov)
- 14 file, nama berurut: 00 T1 · 01 GBIM · 02 JM · 03 Flowchart · 04 Storyboard · 05–10 Materi Bab 1–6 · 11 Evaluasi Sumatif · 12 Fitur Global · 13 Pola Penyajian LMS (+ zip Rancangan_Mensetsu_Navi_Word.zip).
- Format: A4, margin 2,5 cm, Times New Roman 12 (tabel 10), huruf Jepang MS Mincho, judul tengah + baris "Kelompok 2 · Kelas A · Pengembangan Multimedia Pembelajaran · tanggal", nomor halaman; GBIM dan JM landscape. Isi sama persis dengan doc Claude masing-masing; tautan antar-doc Claude jadi teks biasa, tautan rujukan luar tetap aktif.
- Flowchart memakai ekspor Word bawaan doc (gambar diagram ikut); T1 dan Storyboard = file Word yang sudah ada.

## Interface (23 Nov, versi 2)
- Canvas Design: https://claude.ai/artifact/8FStnVa3AWxDQ3a2inisis
- Isi canvas: panduan gaya v2 + komponen maskot; 12 layar HP tegak 390×844; 3 layar HP landscape 844×390 (L1 kartu ungkapan, L2 video peragaan B3-04, L3 momen simulasi); 5 layar laptop Windows/Mac 1440×900, layout fluid (D0 pembuka, D1 beranda, D2 slide materi B3-07 dengan sidebar daftar isi + panel kosakata, D3 simulasi, D4 rapor lengkap).
- Gaya v2: indigo 藍 #2A4B8D, tinta #16213E, latar washi #F7F3EC, sakura #E07A93, emas #F2B84B; tepat/kurang tepat/salah hijau/kuning tua/merah; hanko #C0392B "済". Pola ombak seigaiha + kelopak sakura sebagai ciri khas; kartu putih sudut 22 px dengan bayangan lembut; tombol ≥48 px sudut 16 px. Ilustrasi kantor (pintu, jendela, tanaman, meja Tanaka-san) di sampul bab dan simulasi.
- Warna per bab: 1 indigo #2A4B8D, 2 teal #0E7470, 3 mawar #B0436A, 4 jingga tua #A8650F, 5 ungu #5B46A8, 6 hijau #23784A; Simulasi #1E2A47; Post-test & Rapor #7B3F2B.
- Laptop: sidebar daftar isi per bab/pelajaran, pintasan keyboard (← → spasi; 1–3 di simulasi). Landscape: tombol Lanjut/Kembali pindah ke kolom kanan.
- Maskot di canvas masih komponen sementara (Mascot.dc.html); maskot resmi tim = **Navi** (cowok chibi berjas biru tua, dasi merah, rambut ungu; 23 pose/ekspresi di repo assets/mascot: exp_*, pose_*, act_*). Canvas perlu diganti ke Navi.

## Gaya v3 (24 Nov, menggantikan warna Gaya v2)
- Arah: kalem, Jepang, rapi modern. Palet dari warna tradisional: 漆黒 shikkoku #14171F (teks), 月白 geppaku #EEECF1 (latar), 茜 akane #B3282F (hanko 済, aksen), 藍 ai #0F4C81 (warna utama), 鉄紺 tetsukon #0E2A47 (permukaan gelap: bilah atas laptop, pembuka, simulasi).
- Warna bab: 1 藍 #0F4C81 · 2 青碧 #17706B · 3 茜 #B3282F · 4 黄土 #9A5A12 · 5 江戸紫 #5E4391 · 6 千歳緑 #2D6A45; Simulasi 鉄紺 #0E2A47; Post-test & Rapor 弁柄 #7E3420. Semua lolos WCAG AA (teks putih di atas warna ≥5,4:1; warna di atas latar ≥4,6:1).
- Huruf: judul Poppins, isi Plus Jakarta Sans, teks Jepang Zen Kaku Gothic New, kanji besar Shippori Mincho.
- Pola 波 (garis ombak) di permukaan gelap. Gerak halus (`js/gerak.js`): isi layar muncul bertahap, judul terisi warna, angka skor menghitung naik, sorot cahaya mengikuti kursor di kartu, riak saat tombol ditekan, Navi melayang. Semua mati bila "kurangi gerak" aktif.
- Dokumen T2/storyboard dan canvas interface masih memakai warna v2; perbarui saat ekspor gambar berikutnya.

## Khusus laptop & Mac (24 Nov)
- Atas permintaan pemilik repo, semua tampilan HP, tablet, dan HP landscape dihapus sementara. Tata letak laptop
  (bilah atas, sidebar, panel kanan) berlaku di semua lebar; `html { min-width: 1024px }`, dan `index.html` memakai
  viewport `width=1280` sehingga HP menampilkan versi laptop yang diperkecil.
- Uji tampilan cukup di laptop: 1276×675 (laptop Windows 150%) dan 1440×900.
- Versi responsif terakhir (HP/tablet/landscape) ada di commit `64fc85a` (main, 24 Nov). Dibahas lagi setelah tampilan laptop rapi;
  peserta LPK kebanyakan memakai HP, jadi ini perlu diputuskan sebelum uji coba ke peserta.
- Pratinjau di panel kanan aplikasi Claude memuat aplikasi selebar 1280 px lalu memperkecilnya (`tools/pratinjau.py`).

## Video animasi B2-09 (24 Nov)
- Blok "Contoh telepon" di B2-09 diganti video motion graphic 42 detik (1080p, 60 fps), atas permintaan pemilik repo. Teks Jepang,
  romaji, dan arti tetap tersedia di bawah video ("Lihat teks percakapan"). Menonton video tidak diwajibkan untuk membuka Lanjut.
- Isi tanpa tambahan materi: situasi + tiga pilihan dari Kasus 3 (B2-11); kalimat telepon + lima unsur (nama, jadwal wawancara,
  alasan singkat, perkiraan tiba, permintaan maaf) dari B2-09. Gaya gerak mengikuti video referensi tim.
- Suara dialog: VOICEVOX:雀松朱司 (sintetis, bukan penutur asli; kredit wajib). Bila nanti ada rekaman penutur asli, ganti
  `public/audio/k1–k4.wav` di `sumber/video/b2-09/` lalu render ulang; animasi mengikuti waktu frasa.

## Video animasi B5-09 (24 Nov)
- Paragraf "Langkah bila tetap tidak paham…", kotak "Hindari", dan kotak "Gugup di tengah wawancara?" di B5-09 diganti video
  motion graphic 51 detik (1080p, 60 fps) dengan gaya gerak yang sama seperti B2-09, atas permintaan pemilik repo. Tabel ungkapan
  penyelamat di atasnya tetap. Teks yang diganti tetap ada di bawah video ("Lihat teks lengkap"). Menonton tidak diwajibkan.
- Isi tanpa tambahan materi: dua ungkapan dari tabel B5-09 (bertanya dua kali), empat hal yang dihindari, kalimat
  申し訳ありません。まだ分からないところがあります。, langkah saat gugup + 少し考えてもいいですか。, narasi Navi, dan judul slide.
  Ucapan pewawancara digambarkan sebagai celoteh tanpa makna (tidak tertangkap), bukan kalimat Jepang baru.
- Warna aksen ungu Bab 5. Suara: VOICEVOX:雀松朱司 (kredit wajib). Sumber dan cara membuat ulang: `sumber/video/b5-09/`.

## Prinsip gerak (24 Nov)
- Gerak = umpan balik dan kesinambungan, bukan hiasan. Respons klik 100–250 ms; masuk melambat (ease-out), keluar cepat (ease-in).
- Hanya transform dan opacity yang beranimasi per frame (60 fps). Ukuran berubah → scaleX/FLIP; tinggi isi → grid 0fr → 1fr.
- Gerak berulang dibatasi: ajakan (mis. panah adegan berikutnya) maksimal tiga kali; yang terus berulang hanya penanda kecil (titik aktif, titik kesalahan).
- Kurangi gerak (Pengaturan atau prefers-reduced-motion): bertingkat — geser/membesar/melayang/denyut dibuang, kemunculan isi jadi pudar ≤ 200 ms, pindah slide jadi pudar.
- Transisi halaman (View Transitions, `denganGeser()` di app.js + bagian "Transisi halaman" di app.css), pola pudar-lewat:
  isi lama hilang dulu (±0,12 s), baru isi baru masuk, supaya teks lama dan baru tidak pernah tampil bertumpuk.
  - antar-slide, antar-soal, dan antar-momen simulasi: isi bergeser; bilah atas, sidebar, pita bab, bilah bawah, dan foto adegan diam;
  - antarhalaman bersidebar: pudar;
  - dari rak: halaman mendekat; ke rak: halaman menjauh;
  - pembuka dan awal/akhir simulasi: pudar silang (larut silang bila salah satu layar gelap, supaya tidak berkedip terang).
- Tanpa `backdrop-filter` di bilah atas/bawah: blur kaca membuat geseran slide turun ke ±30 fps (diukur 24 Nov), padahal latarnya sudah 97 % padat.
- Aktivitas "Temukan kesalahan" memakai latar foto yang ada (koridor, ruang wawancara) sampai video peragaan Bab 3/6 tersedia.

## Pemilihan bab = rak buku 3D (24 Nov)
- Referensi tim: ThreeUI "Ashen Press" (Meng To, Three.js r181). Diambil gerak & interaksinya, bukan gambarnya; isi, sampul, dan warna dibuat ulang.
- Prototipe: https://claude.ai/artifact/HcEfFzfnaz414uPJ3Wus6A (sumber: rak-bab-mensetsu-navi.html); versi produk = rak.html di repo.
- Rak 2 susun × 4 buku: Bab 1–4 atas; Bab 5, Bab 6, Simulasi, Post-test & Rapor bawah. Sampul = warna bab + seigaiha + kanji (面接, 報連相, 入室, 自己紹介, 質疑応答, 退室, 模擬面接, 修了). Sampul belakang = isi bab (P1–Pn + kuis).
- Alur: hover/ketuk → buku terangkat → pilih → buku keluar ke depan, rak blur, panel sobekan kertas dari kiri (label bab, judul, kanji, status, gambaran umum, daftar pelajaran) + tombol **Buka** dan **Tutup**. Tutup = buku kembali ke rak. Buka = sampul depan terbuka di engsel punggung → halaman judul mendekat memenuhi layar → berganti ke Sampul Bab (T01).
- Masuk ke buku (revisi 24 Nov, atas permintaan pemilik repo: potongan dari buku ke materi terasa patah):
  - halaman materi disusun saat tombol Lanjutkan ditekan, sebelum buku bergerak;
  - sampul membuka, lalu kamera menyelam ke halaman judul tanpa berhenti (skala logaritmik, titik bidik sepertiga atas: aksara bab dan judul);
  - begitu halaman judul setinggi layar, halaman materi muncul sebagai kartu tepat di atas kartu isi halaman judul (pudar 0,2 dtk) dan membesar bersama halaman 3D (skala dihitung dari zoom yang sama tiap frame) sampai memenuhi layar, lalu berhenti melambat;
  - kamera tidak lagi meloncat saat buku dipilih/dibuka; latar rak berhenti digambar begitu tertutup halaman judul.
  Kurangi gerak, HP, dan tanpa WebGL tetap memakai jalur lama (buka singkat + pudar).
- Keluar dari buku (24 Nov, kebalikan selam): kembali ke rak dari halaman bab/kuis/simulasi/post-test/rapor →
  halaman materi menjadi kartu yang mengecil kembali ke kartu isi halaman judul lalu memudar, teks halaman judul muncul lagi,
  kamera mundur, sampul menutup, buku terbang kembali ke tempatnya (±1,5 dtk; halaman materi hilang dalam ±0,5 dtk).
  Halaman yang sudah digulir tetap di posisinya. Rak belum dimuat/masih intro, kurangi gerak, HP: pudar biasa.
- Perbaikan: buku yang dikembalikan ke rak dulu tetap berotasi seperti "dipegang" (miring); sekarang kembali ke pose semula.
- Status: terkunci = sampul abu + gembok, diklik bergetar + toast alasan; selesai = stempel hanko 済 di sampul + punggung + rel (animasi cap); sedang dipelajari = bilah progres di sampul + cincin %; disarankan pre-test = label kuning (bab dengan skor pre-test terendah).
- HP (<768 px): tumpukan buku digeser vertikal, bar bawah Detail/Buka; landscape & laptop: rak penuh + rel katalog bawah. Tanpa WebGL: daftar bab 2D.

## Web (24 Nov, v0.4)
- Repo: github.com/ianfahreza2005-hub/mensetsunavi (branch main, GitHub Pages via Actions setiap push). Prototipe lama (Modul 1–5, 16:9 lanskap, palet merah-teal) diganti; disimpan di branch `arsip/prototipe-lama`.

- Teknologi: HTML/CSS/JS biasa tanpa build; index.html (router hash) + rak.html (iframe, Three.js r181 lokal di vendor/); js/data/kursus.js dibuat otomatis dari naskah + storyboard (tools/gen_data.py); js/interaktif.js memilih widget dari kode template + judul kolom tabel naskah; progres localStorage kunci `mensetsu-navi-v2`; sw.js + manifest (tools/build_sw.py memperbarui versi cache).
- Sudah jalan: pembuka, pre-test 10 soal terpilih (dari bank 20) + peta kemampuan, rak, semua slide Bab 1–6, kuis bab (bank 10, tampil 5, stempel ≥80, remedial), simulasi 13 momen (timer 20 dtk, Trust Meter, pembahasan), post-test, rapor (sumatif, kategori, komunikasi/etika, N-gain, rekomendasi), menu ☰, pengaturan + mode uji tim.
- Template interaktif (v0.3, 54 slide): kartu buka T03/T06/T08/T16; kartu ungkapan + suara Jepang + tombol Romaji/Arti T05/T15; tabel bertahap T04; pemantik pilih-dulu T02; kelompokkan T10; kasus bercabang + indikator Kepercayaan dan pilih jawaban terbaik T13; urutkan + lengkapi ungkapan T11; penggeser ojigi T09; cocokkan kartu T12; rekam suara + daftar periksa T15. Syarat selesai per slide: Lanjut aktif setelah aktivitas tuntas (mode uji melewati).
- Tampilan v0.4: arahan storyboard disembunyikan/ditulis ulang (js/data/tampilan.js); kotak Tahukah kamu/Hindari/Tips/Kalimat kunci bergaya; kode slide & treatment hanya di Mode uji; sampul bab berisi capaian + jalur pelajaran; pembuka dua kolom di laptop; pengantar Simulasi baru.
- Suara: tombol Dengarkan memutar assets/audio/narasi/<KODE>.mp3 bila ada, jika belum pakai suara bawaan peramban; ungkapan Jepang memakai suara ja-JP perangkat sampai rekaman ada.
- Berikutnya: video T07/T08, T14 Dengar & Tebak, gambar panel komik T13, analisis otomatis Lapis 1 T15; fitur global (latihan pertanyaan acak GLB-04); aset audio/video.

## Pola penyajian LMS
- Kursus → Modul → Pelajaran (3–5 per bab) → Slide berkode → Layer/kartu; prasyarat, syarat selesai, progres, remedial, stempel/Kata Mutiara/rapor.
- 19 template slide (T01–T19) + T20 Simulasi + T21 Rapor; 82 slide dipetakan; data JSON per slide; nama file aset = kode slide.

## Data angket
- n=4 (3 peserta, 1 instruktur), 4 LPK, 5–7 Okt 2026; anonim R1–R4. Kesulitan nyata: pertanyaan spontan, menyimak, kosakata, gugup; fitur dibutuhkan: audio, video peragaan, latihan jikoshoukai, pelafalan (4,67), simulasi bervariasi & umpan balik (4,33).

## Perapian materi (22 Nov)
- Bab 1: B1-09 4 tab (+ Mental); Kuis Soal 3 komitmen; "hire for attitude"; jikoshoukai 30–60 dtk; aturan teks Jepang & tata letak; tautan LMS.
- Bab 2: B2-11 komik 4 kasus + indikator Kepercayaan; ±12 menit.
- Bab 3 & 6: video peragaan tim; B3-07 layer B3-06; B6-08 kartu B6-07.
- Bab 4: B4-06 pop-up, B4-10 per blok. Bab 5: kartu per pertanyaan, B5-08 pertanyaan tak terduga + latihan acak, kotak gugup.
- Rangkuman Bab 1–6: kartu Kata Mutiara.
- T1 final: pola LMS (B2 no.5), maskot & komik (tools), ±75 menit, jawaban temuan terbuka (B5 no.1); Word diperbarui.

## Evaluasi
- Nilai Sumatif = 50% Simulasi + 50% Post-test; lulus ≥75; kategori ≥85 / 75–84 / <75.
- Simulasi 13 momen, 10/5/0, 20 dtk, maks 130; Komunikasi SIM-06, 07, 08, 10, 11, 12 (60); Etika SIM-01–05, 09, 13 (70).
- Kuis bab: bank 10, tampil 5, ≥80 stempel. Lisan 3 lapis (B4-15, B5-13, SIM-06 opsional, GLB-04).

## Dokumen
- T1 (final): https://claude.ai/artifact/7UorqxhPoLmEhWmNrXJrz4 · Word: T1_Analisis_Kebutuhan_Kelompok2_KelasA.docx
- T2 GBIM: https://claude.ai/artifact/MTZdFdHJ1kCKnsCRPjShFd
- T2 JM: https://claude.ai/artifact/69XJcaW29xx2ok2mprMbCA
- T2 Flowchart berkode: https://claude.ai/artifact/Hv4sqzNP8JgpGaDUaz5Tkg
- T2 Storyboard (resmi, Word format Imbar): T2_Storyboard_Mensetsu_Navi_Format_Imbar.docx · arsip kerja: https://claude.ai/artifact/2JqbRfuDNc9ffXL4FfxD32
- T2 Interface (canvas): https://claude.ai/artifact/8FStnVa3AWxDQ3a2inisis
- Prototipe rak bab 3D: https://claude.ai/artifact/HcEfFzfnaz414uPJ3Wus6A
- Repo web: https://github.com/ianfahreza2005-hub/mensetsunavi
- Bab 1: https://claude.ai/artifact/1Z4sqqm68kXFz8Tfoy9ajn
- Bab 2: https://claude.ai/artifact/MpxCSdeCPELfpp9uywBnd4
- Bab 3: https://claude.ai/artifact/SFFV9RiSF3btQk1nSLNjaF
- Bab 4: https://claude.ai/artifact/CAq7ZaTgv2tPhBqWvTq3vk
- Bab 5: https://claude.ai/artifact/XvazSM1e3Hg67LauZ9H46E
- Bab 6: https://claude.ai/artifact/BQPJbSEujKsC75do6pR1xN
- Evaluasi Sumatif: https://claude.ai/artifact/TFKVvRn9MbjhECAEUrXTwv
- Fitur Global: https://claude.ai/artifact/GgiNrEJknALHAvywPUUzsX
- Pola Penyajian LMS: https://claude.ai/artifact/293X7A3KqoBSqZg9B1x9HV
- Paket Word semua rancangan: Rancangan_Mensetsu_Navi_Word.zip (00–13)
- Prototipe penilaian lisan: prototipe-penilaian-lisan.html

## Belum dikerjakan / menunggu pihak lain
- Web: uji coba internal tim di HP, kumpulkan temuan.
- Rak bab: masukan tim atas gerak; Beranda di canvas (03 & D1) diganti rak, storyboard GLB-01 disesuaikan.
- Interface: ganti maskot sementara di canvas dengan Navi; masukan tim atas v2; lalu ekspor gambar ke dokumen T2.
- Konfirmasi SME tambahan (T16): cara baca 十八歳 juuhassai, 十九歳 juukyuusai, dan 四年 yonen di penyusun B4-14 (二十歳 hatachi sudah ada di glosarium Bab 4).
- Bank Kosakata (GLB-03): glosarium naskah = 77 baris / **68 istilah unik** (spesifikasi menyebut ±75). Naskah belum punya kategori (ditetapkan di `tools/gen_data.py`; kategori "angka dan usia" baru berisi 歳) dan contoh kalimat per istilah (belum tampil). Rekaman audio istilah belum ada (memakai suara bawaan perangkat).
- Latihan Pertanyaan Acak (GLB-04): ambang analisis Lapis 1 di `js/suara.js` adalah perkiraan sementara (naskah hanya menetapkan target durasi 10–30 dtk, B5-13): jeda = diam ≥ 1 dtk (panjang ≥ 2,5 dtk), volume pelan/cukup/keras dari level mikrofon, "mulai lambat" > 3 dtk. Perlu dikonfirmasi SME/dosen dan dikalibrasi di beberapa HP. Contoh jawaban soal varian/serupa memakai jawaban soal inti; soal 23 (mesin berhenti) memakai contoh B2-10 (prinsip 報告) karena naskah belum punya contoh khusus.
- Latihan lisan (B4-15, B5-13): **daftar periksa 7 butir B4-15 adalah DRAF** (naskah hanya menyebut "7 butir"; prototipe penilaian lisan tidak ada di repo), diturunkan dari lima blok dan daftar "Hindari" Bab 4. Lembar rubrik (.txt) dan kriteria skor instruktur 1–4 juga draf. Ambang Lapis 1 sama dengan GLB-04 (perkiraan). Perlu dicek SME/dosen.
- Tips & Trik (GLB-05): spesifikasi menyebut "alasan singkat" di tiap kartu, tetapi tabel naskah hanya berisi Tahap, No, Tips, Acuan. Kartu kini menampilkan tips + judul slide acuan + tombol Pelajari. Bila tim menambah kolom "Alasan" di dokumen Fitur Global, ekspor ulang lalu jalankan `gen_data.py`; alasan tampil otomatis.
- GLB-07 / Mode Latihan: tombol Petunjuk Navi menunjuk "slide terkait" yang **dihitung otomatis** (naskah hanya menyebut "menunjuk slide terkait", tanpa daftar). Aktivitas: B1-10→B1-09, B2-08→B2-07, B3-12→B3-03, B4-11→B4-10, B4-13→B4-12, B6-09→B6-03; pemantik (B3-02) menunjuk slide berikutnya. Tim boleh menggantinya bila ada acuan yang lebih tepat. Di Mode Latihan simulasi petunjuk memakai kolom Acuan tiap momen.
- GLB-02: pembungkus romaji/arti inline mengenali arti tanpa tanda kutip lewat kata awal bahasa Indonesia (Saya, Jika, Tidak, Kalau, …); bila kelak ada pola penulisan baru di naskah, cek tampilannya dengan tombol Romaji/Arti dimatikan.
- Kata Mutiara: kartu terbuka per stempel bab (spesifikasi: "enam kartu terbuka seiring stempel"); suara Navi memakai suara bawaan peramban sampai ada rekaman.
- Tampilan (v0.5): tata letak laptop, tablet, dan HP landscape mengikuti canvas v2 secara pragmatis (CSS di akhir `css/app.css`). Header laptop penuh lebar (brand + breadcrumb + progres n/10 + Romaji/Arti + audio + avatar) dan sidebar navigasi lengkap sudah dibuat (D2/D4). Belum dibuat: layar Beranda kartu bab (D1; Beranda tetap rak 3D) dan tampilan video peragaan landscape (L2, menunggu video). Belum diuji di perangkat nyata.
- Konfirmasi SME (13 butir di doc storyboard): sudut ojigi, 参りました vs 来ました, ucapan keluar ruangan, ungkapan simulasi, bank 25 pertanyaan GLB-04; dosen: bobot 50:50.
- Default Claude: Bab 1–6 bebas setelah pre-test; slide dalam bab berurutan.
- Diisi tim: pembagian tugas anggota di T1; di storyboard: tanggal terbit, SME, klien, PM, DI, nota validasi.
- Jika doc Claude diubah lagi, file Word yang bersangkutan perlu dibuat ulang.
