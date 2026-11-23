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
- Butir pre/post: Bab1 no.1–2, Bab2 3–5, Bab3 6–9, Bab4 10–13, Bab5 14–17, Bab6 18–20.

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

## Pemilihan bab = rak buku 3D (24 Nov)
- Referensi tim: ThreeUI "Ashen Press" (Meng To, Three.js r181). Diambil gerak & interaksinya, bukan gambarnya; isi, sampul, dan warna dibuat ulang.
- Prototipe: https://claude.ai/artifact/HcEfFzfnaz414uPJ3Wus6A (sumber: rak-bab-mensetsu-navi.html); versi produk = rak.html di repo.
- Rak 2 susun × 4 buku: Bab 1–4 atas; Bab 5, Bab 6, Simulasi, Post-test & Rapor bawah. Sampul = warna bab + seigaiha + kanji (面接, 報連相, 入室, 自己紹介, 質疑応答, 退室, 模擬面接, 修了). Sampul belakang = isi bab (P1–Pn + kuis).
- Alur: hover/ketuk → buku terangkat → pilih → buku keluar ke depan, rak blur, panel sobekan kertas dari kiri (label bab, judul, kanji, status, gambaran umum, daftar pelajaran) + tombol **Buka** dan **Tutup**. Tutup = buku kembali ke rak. Buka = sampul depan terbuka di engsel punggung → halaman judul mendekat memenuhi layar → berganti ke Sampul Bab (T01).
- Status: terkunci = sampul abu + gembok, diklik bergetar + toast alasan; selesai = stempel hanko 済 di sampul + punggung + rel (animasi cap); sedang dipelajari = bilah progres di sampul + cincin %; disarankan pre-test = label kuning (bab dengan skor pre-test terendah).
- HP (<768 px): tumpukan buku digeser vertikal, bar bawah Detail/Buka; landscape & laptop: rak penuh + rel katalog bawah. Tanpa WebGL: daftar bab 2D.

## Web (24 Nov, v0.4)
- Repo: github.com/ianfahreza2005-hub/mensetsunavi (branch main, GitHub Pages via Actions setiap push). Prototipe lama (Modul 1–5, 16:9 lanskap, palet merah-teal) diganti; disimpan di branch `arsip/prototipe-lama`.

- Teknologi: HTML/CSS/JS biasa tanpa build; index.html (router hash) + rak.html (iframe, Three.js r181 lokal di vendor/); js/data/kursus.js dibuat otomatis dari naskah + storyboard (tools/gen_data.py); js/interaktif.js memilih widget dari kode template + judul kolom tabel naskah; progres localStorage kunci `mensetsu-navi-v2`; sw.js + manifest (tools/build_sw.py memperbarui versi cache).
- Sudah jalan: pembuka, pre-test 20 soal + peta kemampuan, rak, semua slide Bab 1–6, kuis bab (bank 10, tampil 5, stempel ≥80, remedial), simulasi 13 momen (timer 20 dtk, Trust Meter, pembahasan), post-test, rapor (sumatif, kategori, komunikasi/etika, N-gain, rekomendasi), menu ☰, pengaturan + mode uji tim.
- Template interaktif (v0.3, 54 slide): kartu buka T03/T06/T08/T16; kartu ungkapan + suara Jepang + tombol Romaji/Arti T05/T15; tabel bertahap T04; pemantik pilih-dulu T02; kelompokkan T10; kasus bercabang + indikator Kepercayaan dan pilih jawaban terbaik T13; urutkan + lengkapi ungkapan T11; penggeser ojigi T09; cocokkan kartu T12; rekam suara + daftar periksa T15. Syarat selesai per slide: Lanjut aktif setelah aktivitas tuntas (mode uji melewati).
- Tampilan v0.4: arahan storyboard disembunyikan/ditulis ulang (js/data/tampilan.js); kotak Tahukah kamu/Hindari/Tips/Kalimat kunci bergaya; kode slide & treatment hanya di Mode uji; sampul bab berisi capaian + jalur pelajaran; pembuka dua kolom di laptop; pengantar Simulasi baru.
- Suara: tombol Dengarkan memutar assets/audio/narasi/<KODE>.mp3 bila ada, jika belum pakai suara bawaan peramban; ungkapan Jepang memakai suara ja-JP perangkat sampai rekaman ada.
- Berikutnya: video T07/T08, T14 Dengar & Tebak, gambar panel komik T13, analisis otomatis Lapis 1 T15, T16 penyusun jikoshoukai berisian; fitur global (kartu hafalan, latihan pertanyaan acak); aset audio/video.

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
- Konfirmasi SME (13 butir di doc storyboard): sudut ojigi, 参りました vs 来ました, ucapan keluar ruangan, ungkapan simulasi, bank 25 pertanyaan GLB-04; dosen: bobot 50:50.
- Default Claude: Bab 1–6 bebas setelah pre-test; slide dalam bab berurutan.
- Diisi tim: pembagian tugas anggota di T1; di storyboard: tanggal terbit, SME, klien, PM, DI, nota validasi.
- Jika doc Claude diubah lagi, file Word yang bersangkutan perlu dibuat ulang.
