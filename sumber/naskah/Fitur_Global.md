# Mensetsu Navi — Fitur Global

 · 

Fitur global adalah bagian produk yang bisa dibuka dari mana saja, di luar alur bab. Semua fitur global **tidak dinilai** dan tidak memengaruhi kelulusan. Kodenya GLB-00 s.d. GLB-07 dan dipakai di flowchart serta storyboard. Aturan teks Jepang (romaji + arti) dan aturan tata letak layar HP sama dengan naskah Bab 1.

| Kode | Fitur | Dibuka dari | Menjawab kebutuhan |
|---|---|---|---|
| GLB-01 | Menu dan progres | Beranda, tombol ☰ di setiap slide | Navigasi slide per slide yang jelas |
| GLB-02 | Tombol Romaji/Arti | Bilah atas setiap slide | Ramah pemula |
| GLB-03 | Bank Kosakata + kartu hafalan | Menu | Angket: kesulitan kosakata (3,33) |
| GLB-04 | Latihan Pertanyaan Acak | Menu | Angket: pertanyaan di luar skrip (2,67), menyimak, spontan |
| GLB-05 | Tips & Trik Mensetsu | Menu | Angket: permintaan tips dan trik, rasa gugup |
| GLB-06 | Penyimpanan lokal | Otomatis (latar belakang) | Produk offline tanpa server |
| GLB-07 | Pemandu Navi dan Kata Mutiara | Muncul di layar pembuka, tombol Petunjuk, dan rangkuman bab | Rancangan awal kelompok (maskot pemandu, Kata Mutiara); rasa gugup |

## GLB-01 · Menu dan Progres

**GLB-00 · Layar pembuka (hanya saat produk pertama kali dibuka):** pengembangan dari Modul 0 “Onboarding” di rancangan awal, dibuat ringkas karena isi mindset sudah ada di Bab 1.

- Logo “Mensetsu Navi 面接ナビ (mensetsu nabi, “pemandu wawancara”)” dan Navi menyapa.
- Isian nama panggilan (dipakai di Simulasi dan rapor; bawaan: Rani).
- Kartu misi: “Kamu akan diwawancarai 田中さん (Tanaka-san) dari さくら食品 (Sakura Shokuhin, Sakura Foods). Kumpulkan enam stempel bab, lalu yakinkan Tanaka-san di Simulasi.”
- Tiga ikon penjelas: stempel bab, Trust Meter, tombol Romaji/Arti.
- Tombol “Mulai Pre-test”.

**Narasi pembuka:** “Halo, aku Navi, pemandumu. Wawancara kerja di Jepang bukan hanya soal bahasa, tetapi juga sikap. Ayo mulai dengan pre-test untuk melihat kemampuan awalmu.” · **Interaksi:** Hit “Lanjut” → kartu berikutnya; isi nama → Hit “Simpan”; Hit “Mulai Pre-test” → Pre-test.

**Beranda (peta belajar)** menampilkan urutan: Pre-test → Bab 1 → Bab 2 → Bab 3 → Bab 4 → Bab 5 → Bab 6 → Simulasi → Post-test → Rapor. Setiap kotak punya status:

| Status | Tampilan | Aturan |
|---|---|---|
| Terkunci | Abu-abu + ikon gembok | Bab 1–6 terkunci sampai pre-test selesai; Simulasi terkunci sampai stempel Bab 1–6 lengkap; Post-test terkunci sampai Simulasi selesai; Rapor terkunci sampai Post-test selesai |
| Terbuka | Berwarna | Bisa dibuka; Bab 1–6 boleh dipelajari dalam urutan apa pun, tetapi urutan 1–6 disarankan |
| Selesai | Stempel すばらしい (subarashii, “hebat”) | Kuis bab lulus ≥ 80; bab tetap bisa diulang |

- **Bilah progres** di beranda: “X dari 10 bagian selesai”.
- **Tombol ☰ (Menu)** di pojok kiri atas setiap slide membuka panel: Beranda, daftar slide bab yang sedang dibuka (lompat ke slide yang sudah dilihat), Bank Kosakata, Latihan Pertanyaan Acak, Tips & Trik, Pengaturan.
- **Navigasi slide:** tombol Kembali dan Lanjut di bawah layar, nomor slide “5/13”, dan geser kiri-kanan. Tombol Lanjut nonaktif selama interaksi wajib di slide itu belum dilakukan.
- **Lanjutkan belajar:** saat produk dibuka lagi, beranda menawarkan “Lanjutkan dari B3-06?”.

**Narasi beranda:** “Selamat datang di Mensetsu Navi. Mulailah dari pre-test, lalu pelajari keenam bab sampai kamu siap menghadapi simulasi wawancara.” · **Interaksi:** Hit kotak bagian → buka bagian; Hit kotak terkunci → Show pesan syarat membukanya.

## GLB-02 · Tombol Romaji/Arti

- Dua tombol sakelar di bilah atas: **Romaji** dan **Arti**. Keduanya **menyala secara bawaan**.
- Peserta yang sudah lancar boleh mematikannya untuk berlatih membaca. Pilihan tersimpan (GLB-06) dan berlaku di semua bab.
- Format tampilan tetap: 「日本語」 (romaji, “arti”).
- Pengecualian (tombol tidak berpengaruh, arti disembunyikan): soal kuis yang menguji arti istilah, soal menyimak sebelum dijawab, ucapan pewawancara di Simulasi, dan audio di Latihan Pertanyaan Acak sebelum dijawab. Romaji tetap tampil kecuali pada soal menyimak.

## GLB-03 · Bank Kosakata dan Kartu Hafalan

**Isi:** gabungan glosarium Bab 1–6, ±75 istilah (angka pasti mengikuti glosarium akhir tiap bab). Setiap entri berisi tulisan Jepang, romaji, arti, tombol audio, satu contoh kalimat, dan tautan “Lihat di slide” ke slide asalnya.

**Tampilan daftar:**

- Filter per bab (Bab 1–6) dan per kategori: ungkapan sopan, istilah kerja, istilah wawancara, angka dan usia.
- Kolom pencarian (huruf Latin atau Jepang).
- Tanda bintang untuk menandai istilah yang ingin dihafal.

**Kartu hafalan (sistem Leitner tiga kotak):**

| Kotak | Isi | Muncul |
|---|---|---|
| Kotak 1 · Belum hafal | Semua istilah baru dan yang dijawab salah | Setiap sesi |
| Kotak 2 · Hampir hafal | Dijawab benar satu kali | Setiap 2 sesi |
| Kotak 3 · Hafal | Dijawab benar dua kali berturut-turut | Setiap 4 sesi |

- Satu sesi berisi 10 kartu. Depan kartu: tulisan Jepang + audio. Peserta menebak artinya lalu membalik kartu.
- Setelah dibalik, peserta memilih **“Sudah tahu”** (naik satu kotak) atau **“Belum tahu”** (kembali ke Kotak 1). Ini penilaian diri, bukan nilai.
- Ringkasan akhir sesi: jumlah kartu di tiap kotak.

**Narasi:** “Kosakata wawancara akan lebih mudah diingat kalau diulang sedikit demi sedikit. Tebak artinya, lalu balik kartunya.” · **Interaksi:** Hit kartu → balik; Hit “Sudah tahu”/“Belum tahu” → kartu berikutnya; Hit ikon audio → putar pelafalan.

## GLB-04 · Latihan Pertanyaan Acak

Fitur ini menjawab temuan angket bahwa peserta paling kesulitan memahami pertanyaan di luar skrip dan menjawab secara spontan. Bank berisi 25 pertanyaan yang diputar acak.

**Dua mode:**

| Mode | Alur | Cocok untuk |
|---|---|---|
| Dengar | Audio diputar (teks disembunyikan) → peserta memilih topik dari kartu → Show benar/salah, teks, romaji, arti, dan contoh jawaban | Melatih menyimak |
| Jawab-rekam | Audio diputar → 5 detik bersiap → peserta merekam jawaban (maks. 60 detik) → Show analisis Lapis 1 (durasi, jeda, volume) → bandingkan dengan contoh jawaban | Melatih menjawab spontan |

- Pilihan jumlah: 5, 10, atau 25 pertanyaan per putaran. Kecepatan audio: Normal atau Pelan.
- Tidak dinilai. Ringkasan akhir: “Topik yang tertebak: 8 dari 10” dan daftar pertanyaan yang perlu diulang.

**Bank 25 pertanyaan**

*A. Inti (9), sesuai Bab 4 dan 5*

| No | Pertanyaan | Topik | Acuan |
|---|---|---|---|
| 1 | 「自己紹介をお願いします。」 (Jikoshoukai o onegai shimasu. “Silakan perkenalkan diri.”) | Jikoshoukai | B4-10 |
| 2 | 「どうして日本で働きたいのですか。」 (Doushite Nihon de hatarakitai no desu ka. “Mengapa kamu ingin bekerja di Jepang?”) | Motivasi ke Jepang | Bab 5 |
| 3 | 「当社を選んだ理由を教えてください。」 (Tousha o eranda riyuu o oshiete kudasai. “Mengapa kamu memilih perusahaan kami?”) | Alasan memilih perusahaan | B5-04 |
| 4 | 「あなたの長所は何ですか。」 (Anata no chousho wa nan desu ka. “Apa kelebihanmu?”) | Kelebihan | Bab 5 |
| 5 | 「あなたの短所は何ですか。」 (Anata no tansho wa nan desu ka. “Apa kekuranganmu?”) | Kekurangan | Bab 5 |
| 6 | 「体力に自信がありますか。」 (Tairyoku ni jishin ga arimasu ka. “Apakah kamu yakin dengan stamina fisikmu?”) | Stamina | Bab 5 |
| 7 | 「日本語はどのくらい勉強しましたか。」 (Nihongo wa dono kurai benkyou shimashita ka. “Berapa lama kamu belajar bahasa Jepang?”) | Bahasa Jepang | B5-06 |
| 8 | 「前の仕事について教えてください。」 (Mae no shigoto ni tsuite oshiete kudasai. “Ceritakan pekerjaanmu sebelumnya.”) | Pengalaman kerja | Bab 5 |
| 9 | 「日本で何年ぐらい働きたいですか。」 (Nihon de nannen gurai hatarakitai desu ka. “Berapa tahun kamu ingin bekerja di Jepang?”) | Lama bekerja | Bab 5 |

*B. Varian (8), pertanyaan yang sama dengan kata-kata berbeda*

| No | Pertanyaan | Topik |
|---|---|---|
| 10 | 「なぜ日本を選んだのですか。」 (Naze Nihon o eranda no desu ka. “Mengapa kamu memilih Jepang?”) | Motivasi ke Jepang |
| 11 | 「この会社で働きたい理由は何ですか。」 (Kono kaisha de hatarakitai riyuu wa nan desu ka. “Apa alasanmu ingin bekerja di perusahaan ini?”) | Alasan memilih perusahaan |
| 12 | 「自分のいいところを教えてください。」 (Jibun no ii tokoro o oshiete kudasai. “Ceritakan sisi baik dirimu.”) | Kelebihan |
| 13 | 「自分の弱いところはどこだと思いますか。」 (Jibun no yowai tokoro wa doko da to omoimasu ka. “Menurutmu, apa kelemahanmu?”) | Kekurangan |
| 14 | 「体は丈夫ですか。」 (Karada wa joubu desu ka. “Apakah badanmu sehat dan kuat?”) | Stamina |
| 15 | 「日本語の勉強はどのくらいしましたか。」 (Nihongo no benkyou wa dono kurai shimashita ka. “Sudah berapa lama kamu belajar bahasa Jepang?”) | Bahasa Jepang |
| 16 | 「前の会社ではどんな仕事をしていましたか。」 (Mae no kaisha de wa donna shigoto o shite imashita ka. “Di perusahaan sebelumnya kamu bekerja sebagai apa?”) | Pengalaman kerja |
| 17 | 「五年後、何をしていたいですか。」 (Gonengo, nani o shite itai desu ka. “Lima tahun lagi, kamu ingin sedang melakukan apa?”) | Tujuan masa depan |

*C. Sehari-hari (5), sesuai B5-08*

| No | Pertanyaan | Topik |
|---|---|---|
| 18 | 「趣味は何ですか。」 (Shumi wa nan desu ka. “Apa hobimu?”) | Kehidupan sehari-hari |
| 19 | 「休みの日は何をしていますか。」 (Yasumi no hi wa nani o shite imasu ka. “Apa yang kamu lakukan di hari libur?”) | Kehidupan sehari-hari |
| 20 | 「日本の食べ物で、何が好きですか。」 (Nihon no tabemono de, nani ga suki desu ka. “Makanan Jepang apa yang kamu sukai?”) | Kehidupan sehari-hari |
| 21 | 「今朝、何を食べましたか。」 (Kesa, nani o tabemashita ka. “Tadi pagi kamu makan apa?”) | Kehidupan sehari-hari |
| 22 | 「インドネシアのいいところを教えてください。」 (Indoneshia no ii tokoro o oshiete kudasai. “Ceritakan hal baik tentang Indonesia.”) | Kehidupan sehari-hari |

*D. Situasional (3), sesuai Bab 2 Hou-Ren-Sou*

| No | Pertanyaan | Topik | Inti jawaban |
|---|---|---|---|
| 23 | 「機械が急に止まったら、どうしますか。」 (Kikai ga kyuu ni tomattara, dou shimasu ka. “Kalau mesin tiba-tiba berhenti, apa yang kamu lakukan?”) | Situasi kerja | 報告 (houkoku, melapor) |
| 24 | 「仕事のやり方が分からないとき、どうしますか。」 (Shigoto no yarikata ga wakaranai toki, dou shimasu ka. “Kalau tidak tahu cara mengerjakan tugas, apa yang kamu lakukan?”) | Situasi kerja | 相談 (soudan, berkonsultasi) |
| 25 | 「仕事に遅れそうなとき、どうしますか。」 (Shigoto ni okuresou na toki, dou shimasu ka. “Kalau kamu akan terlambat masuk kerja, apa yang kamu lakukan?”) | Situasi kerja | 連絡 (renraku, memberi kabar) |

Setiap pertanyaan punya satu contoh jawaban singkat (diambil dari contoh jawaban di Bab 4, Bab 5, dan B5-08; untuk nomor 23–25 dari contoh Bab 2). Pertanyaan nomor 2–17 dan 23–25 dicek SME sebelum perekaman audio.

**Narasi:** “Di wawancara sungguhan, kamu tidak tahu pertanyaan mana yang akan muncul. Dengarkan baik-baik, lalu jawab.” · **Interaksi:** Hit mode → mulai; Hit tombol putar → audio; Hit kartu topik atau Hit “Rekam” → rekam; Hit “Lihat contoh jawaban” → Show jawaban dan audionya.

## GLB-05 · Tips & Trik Mensetsu

Delapan kartu yang digeser, dikelompokkan menjadi tiga tahap. Setiap kartu berisi satu tips, alasan singkat, dan tombol menuju slide yang membahasnya.

| Tahap | No | Tips | Acuan |
|---|---|---|---|
| Sebelum | 1 | Cari tahu bidang dan pekerjaan di perusahaan tujuan, lalu siapkan alasan memilihnya. | B5-04 |
| Sebelum | 2 | Rekam jikoshoukai-mu, dengarkan, lalu perbaiki sampai durasinya 30–60 detik. | B4-15 |
| Sebelum | 3 | Sehari sebelumnya, siapkan pakaian, dokumen, dan rute; untuk wawancara online, uji kamera dan mikrofon. | B1-09 |
| Saat | 4 | Datang lebih awal dan melapor ke resepsionis sekitar 10 menit sebelum jadwal. | B1-09 |
| Saat | 5 | Duduk tegak, tatap pewawancara dengan wajar, dan bicara dengan suara yang jelas. | B3-11 |
| Saat | 6 | Tidak paham pertanyaan? Minta diulang atau tanyakan artinya dengan sopan; jangan asal menjawab 「はい」 (hai, “ya”). | B5-09 |
| Saat | 7 | Jawab singkat dulu, lalu tambahkan satu alasan atau contoh. | B5-03 |
| Sesudah | 8 | Catat pertanyaan yang muncul dan bagian yang masih kurang, lalu latih lagi bagian itu di Mensetsu Navi. | GLB-04 |

**Narasi:** “Ini delapan kebiasaan kecil yang membuat wawancaramu lebih lancar, dari persiapan sampai setelah wawancara.” · **Interaksi:** Geser kartu; Hit “Pelajari” → buka slide acuan; Hit tab Sebelum/Saat/Sesudah → lompat ke kelompok kartu.

## GLB-06 · Penyimpanan Lokal

Produk berjalan offline tanpa server, jadi semua data disimpan di perangkat peserta melalui penyimpanan bawaan peramban (localStorage).

| Data yang disimpan | Keterangan |
|---|---|
| Nama peserta | Diisi di awal, dipakai di Simulasi dan rapor |
| Progres | Status tiap bagian dan slide terakhir yang dibuka |
| Nilai | Pre-test, skor kuis terakhir Bab 1–6, stempel, skor Simulasi, Post-test, jumlah percobaan |
| Profil Kesiapan Lisan | Hasil analisis Lapis 1 dan checklist Lapis 2 (angka saja) |
| Kartu hafalan | Posisi kotak tiap istilah dan istilah berbintang |
| Pengaturan | Status tombol Romaji/Arti dan kecepatan audio |

- **Rekaman suara tidak disimpan otomatis** karena ukurannya besar. Rekaman hanya ada selama sesi dan diunduh lewat tombol “Unduh rekaman”.
- **Mulai ulang:** menu Pengaturan → “Hapus semua data”, dengan jendela konfirmasi di dalam produk.
- **Batasan:** data bisa hilang jika riwayat atau data peramban dihapus, atau jika produk dibuka di perangkat/peramban lain. Karena itu peserta diminta mengunduh rapor setelah post-test. Jika peramban menolak penyimpanan, produk tetap berjalan dan data hanya bertahan sampai halaman ditutup; pesan pemberitahuan ditampilkan di beranda.

## GLB-07 · Pemandu Navi dan Kata Mutiara

**Navi** adalah maskot pemandu dari rancangan awal kelompok: karakter orisinal buatan tim (ilustrasi Canva/Figma), bukan karakter yang sudah ada. Suaranya memakai narator yang sama, jadi tidak ada rekaman tambahan.

| Tempat muncul | Peran Navi |
|---|---|
| Layar pembuka (GLB-00) | Menyapa dan menjelaskan misi |
| Beranda (GLB-01) | Menyarankan bagian berikutnya (“Stempel Bab 3 belum ada. Coba bab itu dulu?”) |
| Tombol “Petunjuk Navi” | Di aktivitas (memory match, drag-and-drop, temukan kesalahan) dan Mode Latihan Simulasi: memberi satu petunjuk yang menunjuk slide terkait. Tidak muncul di kuis, pre/post-test, dan Simulasi resmi. |
| Layar hasil kuis | Bereaksi: senang (lulus) atau menyemangati (belum lulus) |
| Rangkuman bab | Membawakan Kata Mutiara |

Navi tidak menggantikan Tanaka-san: Navi hanya pemandu belajar, sedangkan Tanaka-san tokoh pewawancara di Simulasi.

**Kata Mutiara Pewawancara** tampil sebagai kartu di slide rangkuman setiap bab, diucapkan Navi.

| Bab | Slide | Kata Mutiara |
|---|---|---|
| 1 | Rangkuman Bab 1 | “Bahasa membuka pintu; sikap yang membuatmu diterima.” |
| 2 | B2-12 | “Masalah kecil yang cepat dilaporkan tidak akan menjadi masalah besar.” |
| 3 | Rangkuman Bab 3 | “Kesan pertama sudah terbentuk sebelum kamu berbicara.” |
| 4 | Rangkuman Bab 4 | “Jikoshoukai yang baik itu singkat, jelas, dan tidak terburu-buru.” (dari rancangan awal) |
| 5 | Rangkuman Bab 5 | “Jawaban sederhana yang jujur lebih berharga daripada jawaban hebat yang dihafal.” |
| 6 | Rangkuman Bab 6 | “Wawancara baru selesai saat pintu sudah tertutup.” |

**Interaksi:** Hit kartu Kata Mutiara → putar audio Navi; kartu juga tersimpan di beranda sebagai koleksi (enam kartu terbuka seiring stempel).

## Catatan untuk flowchart dan storyboard

- GLB-01 adalah simpul pusat flowchart: semua bagian berangkat dari dan kembali ke beranda.
- GLB-02 dan GLB-06 tidak punya layar sendiri (kecuali menu Pengaturan), sehingga di flowchart cukup ditulis sebagai keterangan.
- GLB-03, GLB-04, dan GLB-05 masing-masing digambar sebagai cabang dari menu ☰ yang selalu kembali ke slide asal.
