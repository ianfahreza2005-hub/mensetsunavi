// Linimasa video B5-09 (60 fps). Adegan bertumpuk agar transisi sapuan tidak terputus.
// Waktu ucapan dihitung dari durasi suara VOICEVOX (src/data/waktu.json, dibuat scripts/siapkan_audio.py),
// jadi teks dan animasi ikut bergeser bila suara dibuat ulang.
import data from './data/waktu.json';

export const FPS = 60;
export const TUMPANG = 28;

type Mentah = { durasi: number; frasa: { mulai: number; selesai: number }[] };
const D = data as Record<string, Mentah>;

export type Frasa = { mulai: number; selesai: number };
/** satu ucapan bersuara, dalam frame lokal adegannya */
export type Suara = { id: string; audio: number; selesai: number; frasa: Frasa[] };

const fr = (detik: number) => Math.round(detik * FPS);
export const suara = (id: string, audio: number): Suara => ({
  id,
  audio,
  selesai: audio + fr(D[id].durasi),
  frasa: D[id].frasa.map((p) => ({ mulai: audio + fr(p.mulai), selesai: audio + fr(p.selesai) })),
});

// panjang efek celoteh (scripts/siapkan_audio.py): ucapan pewawancara yang tidak tertangkap
export const CELOTEH = { cepat: 63, cepat2: 54, pelan: 90 };

/* 1 · Pembuka: pewawancara bicara → "?" → kamu bertanya (dua kali) → tetap tidak paham */
export const PEMBUKA = (() => {
  const c1 = 22;                          // gelembung pewawancara 1 (celoteh cepat)
  const q1 = c1 + CELOTEH.cepat + 8;      // "?" pertama
  const k1 = q1 + 10;                     // gelembung kamu 1
  const t1 = suara('t1', k1 + 8);
  const c2 = t1.selesai + 16;             // pewawancara mengulang, masih cepat
  const q2 = c2 + CELOTEH.cepat2 + 8;
  const k2 = q2 + 10;
  const t2 = suara('t2', k2 + 8);
  const c3 = t2.selesai + 16;             // pewawancara bicara lebih pelan
  const q3 = c3 + CELOTEH.pelan + 8;      // tetap tidak paham
  const judul = q3 + 30;
  const dur = judul + 150;
  return { c1, q1, k1, t1, c2, q2, k2, t2, c3, q3, judul, dur };
})();

/* 3 · Jujur dengan sopan: judul + kotak seleksi, lalu kalimatnya diucapkan */
export const JUJUR_T = (() => {
  const klik = 100;      // kursor Navi mengklik kotak seleksi
  const kepala = 160;    // judul mengecil jadi kepala adegan
  const kartu = 184;     // kartu "Kamu" masuk
  const j1 = suara('j1', 236);
  const j2 = suara('j2', j1.selesai + 36);
  const arti = j2.selesai - 8;
  const dur = j2.selesai + 132;
  return { klik, kepala, kartu, j1, j2, arti, dur };
})();

/* 4 · Gugup: berhenti sejenak → tarik napas → lanjutkan dengan kalimat pendek → 少し考えてもいいですか */
export const GUGUP_T = (() => {
  const s1 = 96;              // Berhenti sejenak
  const s2 = s1 + 66;         // Tarik napas (masuk)
  const hembus = s2 + 92;     // napas keluar
  const s3 = hembus + 96;     // Lanjutkan dengan kalimat pendek
  const boleh = s3 + 76;      // "Kamu juga boleh mengucapkan:"
  const g1 = suara('g1', boleh + 48);
  const dur = g1.selesai + 120;
  return { s1, s2, hembus, s3, boleh, g1, dur };
})();

/* 2 · Hindari dan 5 · Penutup tanpa suara: panjang tetap */
export const DUR_HINDARI = 400;
export const DUR_PENUTUP = 576;

const dur = { pembuka: PEMBUKA.dur, hindari: DUR_HINDARI, jujur: JUJUR_T.dur, gugup: GUGUP_T.dur, penutup: DUR_PENUTUP };
const urut = ['pembuka', 'hindari', 'jujur', 'gugup', 'penutup'] as const;
export const ADEGAN = {} as Record<(typeof urut)[number], { mulai: number; dur: number }>;
let t = 0;
urut.forEach((k, i) => {
  // pembuka → hindari bersambung di latar gelap yang sama; sisanya bertumpuk untuk sapuan lingkaran
  const tumpang = i === 0 ? 0 : i === 1 ? 20 : TUMPANG;
  t -= tumpang;
  ADEGAN[k] = { mulai: t, dur: dur[k] };
  t += dur[k];
});
export const TOTAL = t;
