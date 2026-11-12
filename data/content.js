/* ==========================================================================
   content.js : seluruh teks yang tampil di scene S01-S03.
   Teks bertanda  [STORYBOARD]  disalin dari rancangan kelompok.
   Teks bertanda  [DRAFT]       adalah usulan karena storyboard belum merincinya
                                (perlu disetujui kelompok; kalimat Jepang perlu cek SME).
   `file` = nama file audio yang nanti disimpan di assets/audio/narator/ (.mp3)
   ========================================================================== */
window.MN = window.MN || {};
MN.Text = {

  /* ---------------------------- S01 Halaman Pembuka ---------------------------- */
  S01: {
    judul: 'Mensetsu Navi: Pemandu Wawancara Kerja Jepang',                       // [STORYBOARD]
    subjudul: 'Pemandu Wawancara',                                                // [STORYBOARD]
    narasi: { file: 's01_01', text: 'Selamat datang di Mensetsu Navi. Di sini kamu berlatih menghadapi wawancara kerja di perusahaan Jepang. Hari ini kamu berperan sebagai kandidat yang akan diwawancarai di sebuah perusahaan di Tokyo. Siap?' } // [STORYBOARD]
  },

  /* ---------------------------- S02 Onboarding ---------------------------- */
  S02: {
    navi_sapa: 'Hai, aku Navi, pemandumu!',                                       // [DRAFT] "Navi menyapa"
    n1: { file: 's02_01', text: 'Wawancara kerja di Jepang bukan hanya tes bahasa. Pewawancara juga menilai sikap, kepatuhan, etiket, dan kecocokan budayamu.' },                                     // [STORYBOARD]
    n2: { file: 's02_02', text: 'Banyak perusahaan Jepang memegang prinsip hire for attitude, train for skill. Kandidat N4 yang sopan dan jujur lebih dihargai daripada kandidat N2 yang arogan.' },    // [STORYBOARD]
    n3: { file: 's02_03', text: 'Ada tiga hal yang dinilai: cara kamu memperkenalkan diri, sikap dan etiketmu, serta kejujuran dan kemauanmu beradaptasi.' },                                       // [STORYBOARD]
    kolomA: 'Tes bahasa',                                                          // [STORYBOARD]
    kolomB: 'Tes sikap, kepatuhan, etiket, dan kecocokan budaya',                  // [STORYBOARD]
    hire: 'Hire for attitude, train for skill',                                    // [STORYBOARD]
    candOK: { judul: 'Kandidat N4', sub: 'sopan dan jujur' },                      // [STORYBOARD]
    candNO: { judul: 'Kandidat N2', sub: 'arogan' },                               // [STORYBOARD]
    kartu: [                                                                       // judul [STORYBOARD]; isi penjelasan [DRAFT]
      { no: 1, judul: 'Cara memperkenalkan diri', isi: 'Jikoshoukai yang singkat, jelas, dan lengkap memberi kesan pertama yang kuat.', icon: 'user' },
      { no: 2, judul: 'Sikap dan etiket', isi: 'Salam, ojigi, cara duduk, dan ketepatan waktu sudah dinilai sejak kamu tiba.', icon: 'handshake' },
      { no: 3, judul: 'Kejujuran dan kemauan beradaptasi', isi: 'Jujur tentang kemampuan dan mau belajar lebih dihargai daripada berpura-pura mampu.', icon: 'heart' }
    ],
    keputusan: {
      soal: { file: 's02_04', text: 'Kamu tiba di lobi dan resepsionis menyapamu. Apa yang kamu lakukan?' },             // [STORYBOARD]
      opsi: [                                                                      // fb [STORYBOARD]; isi opsi [DRAFT] + cek SME
        { tier: 'tepat', delta: 10, gestur: 'Membungkuk ringan dan menyapa dengan sopan',
          jp: '「おはようございます。ラニと申します。面接に来ました。」',
          romaji: 'Ohayou gozaimasu. Rani to moushimasu. Mensetsu ni kimashita.',
          arti: 'Selamat pagi. Saya Rani. Saya datang untuk wawancara.',
          fb: 'Tepat! Sapaan sopan sejak di lobi membangun kesan pertama.' },
        { tier: 'kurang', delta: -5, gestur: 'Langsung bertanya tanpa menyapa',
          jp: '「面接の部屋はどこですか。」',
          romaji: 'Mensetsu no heya wa doko desu ka.',
          arti: 'Ruang wawancaranya di mana?',
          fb: 'Bertanya boleh, tetapi sapa dulu dengan sopan.' },
        { tier: 'salah', delta: -10, gestur: 'Diam saja sambil sibuk melihat HP',
          jp: '', romaji: '', arti: 'Tidak menyapa sama sekali.',
          fb: 'Sikapmu sudah dinilai sejak kamu tiba.' }
      ]
    },
    misi: {
      judul: 'Yakinkan pewawancara bahwa kamu layak dipercaya',                    // [STORYBOARD]
      narasi: { file: 's02_05', text: 'Misimu adalah meyakinkan pewawancara. Setiap keputusan menambah atau mengurangi Trust Meter, mulai dari 50. Aku Navi, pemandumu. Tekan tombolku bila butuh petunjuk.' }, // [STORYBOARD]
      chip: [{ v: '+10', t: 'Pilihan tepat', c: 'up' }, { v: '−5', t: 'Kurang tepat', c: 'mid' }, { v: '−10', t: 'Pilihan salah', c: 'down' }], // angka [STORYBOARD]
      petunjuk: 'Pilihan yang sopan dan jujur menambah Trust Meter. Pikirkan dulu sebelum memilih, ya!',  // [DRAFT]
      peta: ['Anatomi Jikoshoukai & Hatsuon', 'Etiket Fisik & Japanese Common Sense', 'Studi Kasus Etos Kerja', 'The Ultimate Interview', 'Rapor Kesiapan Kerja']  // [STORYBOARD] nama modul
    }
  },

  /* ---------------------------- S03 Menu Utama ---------------------------- */
  S03: {
    narasi: { file: 's03_01', text: 'Pilih modul yang ingin kamu pelajari. Urutannya bebas, tetapi disarankan mulai dari Modul 1. Selesaikan Modul 1 sampai 3, lalu hadapi wawancara puncak.' },   // [STORYBOARD]
    terkunci4: 'Selesaikan Modul 1 sampai 3 dulu agar kamu siap.',                  // [STORYBOARD]
    terkunci5: 'Rapor terbuka setelah kamu menyelesaikan wawancara puncak (Modul 4).', // [DRAFT]
    saran: {                                                                       // "Modul berikutnya yang kusarankan: ..." [STORYBOARD]; variasi lain [DRAFT]
      awal: 'Modul berikutnya yang kusarankan: Modul {n}.',
      m4: 'Semua modul belajar selesai. Saatnya Modul 4: The Ultimate Interview!',
      m5: 'Wawancara selesai! Buka Modul 5 untuk melihat rapor kesiapanmu.',
      selesai: 'Hebat! Kamu bisa membuka rapor atau mengulang modul untuk berlatih lagi.'
    },
    modul: [                                                                       // nama & tujuan [STORYBOARD]; durasi = [DRAFT] perkiraan, total ±45-60 menit
      { n: 1, key: 'M1', judul: 'Anatomi Jikoshoukai dan Hatsuon', durasi: '±15 menit', to: 'S04' },
      { n: 2, key: 'M2', judul: 'Etiket Fisik dan Japanese Common Sense', durasi: '±10 menit', to: 'S08' },
      { n: 3, key: 'M3', judul: 'Studi Kasus Etos Kerja', durasi: '±8 menit', to: 'S11' },
      { n: 4, key: 'M4', judul: 'The Ultimate Interview (Simulasi Wawancara)', durasi: '±10 menit', to: 'S13' },
      { n: 5, key: 'M5', judul: 'Rapor Kesiapan Kerja', durasi: '±3 menit', to: 'S18' }
    ]
  }
};
