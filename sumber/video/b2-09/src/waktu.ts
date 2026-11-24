// Linimasa video (60 fps). Adegan bertumpuk TUMPANG frame agar transisi sapuan tidak terputus.
// Waktu dialog dihitung dari durasi suara VOICEVOX (src/data/waktu.json, dibuat scripts/siapkan_audio.py).
import data from './data/waktu.json';

export const FPS = 60;
export const TUMPANG = 28;

export type Frasa = { mulai: number; selesai: number };
export type BarisDialog = { mulai: number; audio: number; selesai: number; keluar: number; frasa: Frasa[] };

// dialog, dalam frame lokal adegan Percakapan
const MULAI_DIALOG = 64;   // tata letak panggilan tampil dulu
const DULUAN_AUDIO = 10;   // teks baris baru muncul sesaat sebelum suara
const JEDA = [80, 84, 84, 64];  // waktu baca setelah suara selesai (arti muncul di sini)

let c = MULAI_DIALOG;
export const DIALOG: BarisDialog[] = data.map((k, i) => {
  const audio = c + DULUAN_AUDIO;
  const selesai = audio + Math.round(k.durasi * FPS);
  const b = {
    mulai: c,
    audio,
    selesai,
    keluar: 0,
    frasa: k.frasa.map((p) => ({ mulai: audio + Math.round(p.mulai * FPS), selesai: audio + Math.round(p.selesai * FPS) })),
  };
  c = selesai + JEDA[i];
  return b;
});
DIALOG.forEach((b, i) => { b.keluar = i < DIALOG.length - 1 ? DIALOG[i + 1].mulai - 6 : 1e9; });
export const DUR_PERCAKAPAN = c + 46;

const dur = { pembuka: 250, pilihan: 338, renraku: 276, panggilan: 228, percakapan: DUR_PERCAKAPAN, penutup: 372 };
let t = 0;
const urut = ['pembuka', 'pilihan', 'renraku', 'panggilan', 'percakapan', 'penutup'] as const;
export const ADEGAN = {} as Record<(typeof urut)[number], { mulai: number; dur: number }>;
urut.forEach((k, i) => {
  // pembuka → pilihan bersambung tanpa tumpang (latar gelap yang sama); sisanya bertumpuk untuk sapuan lingkaran
  const tumpang = i >= 2 ? TUMPANG : i === 1 ? 18 : 0;
  t -= tumpang;
  ADEGAN[k] = { mulai: t, dur: dur[k] };
  t += dur[k];
});
export const TOTAL = t;
