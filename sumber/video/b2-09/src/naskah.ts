// Naskah video B2-09 "Contoh telepon renraku". Semua teks diambil dari materi:
//  - kalimat telepon, romaji, arti, dan lima unsur yang disampaikan: slide B2-09
//  - situasi (wawancara 10.00, kereta berhenti 09.30, terlambat ±15 menit) dan tiga pilihan: Kasus 3 slide B2-11
// Jangan menambah materi di sini; perubahan isi lewat naskah sumber (tools/xml.json).

export type Unsur = 'nama' | 'jadwal' | 'alasan' | 'tiba' | 'maaf';

export const UNSUR: { id: Unsur; label: string; warna: string }[] = [
  { id: 'nama', label: 'Nama', warna: '#0F4C81' },
  { id: 'jadwal', label: 'Jadwal wawancara', warna: '#17706B' },
  { id: 'alasan', label: 'Alasan singkat', warna: '#9A5A12' },
  { id: 'tiba', label: 'Perkiraan tiba', warna: '#5E4391' },
  { id: 'maaf', label: 'Permintaan maaf', warna: '#B3282F' },
];

// Satu kalimat telepon. seg = potongan teks Jepang yang muncul bersama frasa suara ke-p (indeks frasa VOICEVOX).
// sorot = rentang potongan yang diberi kotak sorot + unsur yang ditandai.
export type Kalimat = {
  seg: { t: string; p: number }[];
  ro: { t: string; p: number }[];
  arti: string;
  sorot: { dari: number; sampai: number; unsur: Unsur }[];
};

export const KALIMAT: Kalimat[] = [
  {
    seg: [{ t: 'お忙しい', p: 0 }, { t: 'ところ、', p: 1 }, { t: '申し訳', p: 2 }, { t: 'ありません。', p: 3 }],
    ro: [{ t: 'Osogashii', p: 0 }, { t: 'tokoro', p: 1 }, { t: 'moushiwake', p: 2 }, { t: 'arimasen.', p: 3 }],
    arti: 'Mohon maaf mengganggu di tengah kesibukan.',
    sorot: [{ dari: 2, sampai: 3, unsur: 'maaf' }],
  },
  {
    seg: [{ t: '本日', p: 0 }, { t: '10時から', p: 1 }, { t: '面接の', p: 2 }, { t: '〇〇と', p: 3 }, { t: '申します。', p: 4 }],
    ro: [{ t: 'Honjitsu', p: 0 }, { t: 'juuji kara', p: 1 }, { t: 'mensetsu no', p: 2 }, { t: '… to', p: 3 }, { t: 'moushimasu.', p: 4 }],
    arti: 'Saya …, yang dijadwalkan wawancara hari ini pukul 10.00.',
    sorot: [{ dari: 0, sampai: 2, unsur: 'jadwal' }, { dari: 3, sampai: 4, unsur: 'nama' }],
  },
  {
    seg: [{ t: '電車が', p: 0 }, { t: '遅れて', p: 1 }, { t: 'いて、', p: 2 }, { t: '10時', p: 3 }, { t: '15分ごろに', p: 4 }, { t: '着きます。', p: 6 }],
    ro: [{ t: 'Densha ga', p: 0 }, { t: 'okurete', p: 1 }, { t: 'ite,', p: 2 }, { t: 'juuji', p: 3 }, { t: 'juugofun goro ni', p: 4 }, { t: 'tsukimasu.', p: 6 }],
    arti: 'Kereta terlambat, saya akan tiba sekitar pukul 10.15.',
    sorot: [{ dari: 0, sampai: 2, unsur: 'alasan' }, { dari: 3, sampai: 5, unsur: 'tiba' }],
  },
  {
    seg: [{ t: '申し訳', p: 0 }, { t: 'ありません。', p: 1 }],
    ro: [{ t: 'Moushiwake', p: 0 }, { t: 'arimasen.', p: 1 }],
    arti: 'Mohon maaf.',
    sorot: [{ dari: 0, sampai: 1, unsur: 'maaf' }],
  },
];

// Kasus 3 (B2-11): tiga pilihan, diringkas tanpa mengubah maksud
export const PILIHAN = [
  { t: 'Tidak mengabari, berharap pewawancara juga belum siap.', hasil: 'Salah', benar: false },
  { t: 'Bergegas datang, lalu minta maaf saat tiba.', hasil: 'Kurang tepat', benar: false },
  { t: 'Menelepon perusahaan sebelum pukul 10.00.', hasil: 'Tepat', benar: true },
];

export const TEKS_LAIN = {
  kanji: '連絡',
  kredit: 'Suara: VOICEVOX:雀松朱司',
  merek: '面接ナビ',
  judulTelepon: '「」',
};
