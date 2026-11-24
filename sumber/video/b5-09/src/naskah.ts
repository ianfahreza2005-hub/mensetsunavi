// Naskah video B5-09 "Saat tidak paham, jangan diam" (Bab 5 · Menjawab Pertanyaan). Semua teks diambil dari slide B5-09:
//  - dua ungkapan penyelamat dari tabel (tidak menangkap pertanyaan; pewawancara bicara terlalu cepat)
//  - langkah bila tetap tidak paham setelah dua kali bertanya: jujur dengan sopan + kalimatnya
//  - kotak "Hindari" (empat hal) dan kotak "Gugup di tengah wawancara?"
//  - narasi Navi ("Tidak paham itu wajar …") dan judul slide ("Jangan diam")
// Jangan menambah materi di sini; perubahan isi lewat naskah sumber (tools/xml.json).

export type Potong = { t: string; p: number };   // potongan teks yang muncul bersama frasa suara ke-p (frasa aksen VOICEVOX)

export type Ucapan = {
  id: string;            // nama berkas suara: public/audio/<id>.wav
  seg: Potong[];
  ro: Potong[];
  arti: string;
};

/* Adegan 1 · dua kali bertanya dengan ungkapan penyelamat (tabel B5-09) */
export const TANYA: (Ucapan & { situasi: string })[] = [
  {
    id: 't1',
    situasi: 'Tidak menangkap pertanyaan',
    seg: [{ t: 'すみません、', p: 0 }, { t: 'もう一度', p: 1 }, { t: 'お願い', p: 2 }, { t: 'します。', p: 3 }],
    ro: [{ t: 'Sumimasen,', p: 0 }, { t: 'mou ichido', p: 1 }, { t: 'onegai', p: 2 }, { t: 'shimasu.', p: 3 }],
    arti: 'Maaf, mohon diulang sekali lagi.',
  },
  {
    id: 't2',
    situasi: 'Pewawancara bicara terlalu cepat',
    seg: [{ t: 'すみません、', p: 0 }, { t: 'ゆっくり', p: 1 }, { t: '話して', p: 2 }, { t: 'いただけませんか。', p: 3 }],
    ro: [{ t: 'Sumimasen,', p: 0 }, { t: 'yukkuri', p: 1 }, { t: 'hanashite', p: 2 }, { t: 'itadakemasen ka.', p: 3 }],
    arti: 'Maaf, bisakah Bapak/Ibu berbicara lebih pelan?',
  },
];

/* Adegan 2 · kotak "Hindari" */
export type Hindari = { judul: string; jp?: string; ro?: string; arti?: string; ikon: 'paham' | 'diam' | 'topik' | 'santai' };
export const HINDARI: Hindari[] = [
  { judul: 'Pura-pura paham', jp: '「はい、分かりました」', ro: 'hai, wakarimashita', arti: 'ya, saya mengerti', ikon: 'paham' },
  { judul: 'Diam lama', ikon: 'diam' },
  { judul: 'Menjawab topik lain', ikon: 'topik' },
  { judul: 'Bertanya dengan santai', jp: '「え？何？」', ro: 'e? nani?', arti: 'hah? apa?', ikon: 'santai' },
];

/* Adegan 3 · langkah bila tetap tidak paham setelah dua kali bertanya: jujur dengan sopan */
export const JUJUR: (Ucapan & { sifat: 'Sopan' | 'Jujur' })[] = [
  {
    id: 'j1',
    sifat: 'Sopan',
    seg: [{ t: '申し訳', p: 0 }, { t: 'ありません。', p: 1 }],
    ro: [{ t: 'Moushiwake', p: 0 }, { t: 'arimasen.', p: 1 }],
    arti: 'Mohon maaf,',
  },
  {
    id: 'j2',
    sifat: 'Jujur',
    seg: [{ t: 'まだ', p: 0 }, { t: '分からない', p: 1 }, { t: 'ところが', p: 2 }, { t: 'あります。', p: 3 }],
    ro: [{ t: 'Mada', p: 0 }, { t: 'wakaranai', p: 1 }, { t: 'tokoro ga', p: 2 }, { t: 'arimasu.', p: 3 }],
    arti: 'masih ada bagian yang belum saya pahami.',
  },
];
export const ARTI_JUJUR = 'Mohon maaf, masih ada bagian yang belum saya pahami.';

/* Adegan 4 · kotak "Gugup di tengah wawancara?" */
export const LANGKAH_GUGUP = ['Berhenti sejenak', 'Tarik napas', 'Lanjutkan dengan kalimat pendek'];
export const BOLEH: Ucapan = {
  id: 'g1',
  seg: [{ t: '少し', p: 0 }, { t: '考えても', p: 1 }, { t: 'いいですか。', p: 2 }],
  ro: [{ t: 'Sukoshi', p: 0 }, { t: 'kangaete mo', p: 1 }, { t: 'ii desu ka.', p: 2 }],
  arti: 'Bolehkah saya berpikir sebentar?',
};

/* Adegan 5 · penutup */
export const BANDING = {
  baik: 'Jawaban pendek yang tenang',
  buruk: 'Jawaban panjang yang terburu-buru',
};

export const TEKS_LAIN = {
  kredit: 'Suara: VOICEVOX:雀松朱司',
  merek: '面接ナビ',
  bab: 'Bab 5 · Menjawab Pertanyaan',
  tanya: '？',
};

/** semua ucapan bersuara, urut sesuai video */
export const SEMUA_UCAPAN: Ucapan[] = [...TANYA, ...JUJUR, BOLEH];
