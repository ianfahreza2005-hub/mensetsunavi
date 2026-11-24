import { Easing, interpolate, spring } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

// Palet v3 Mensetsu Navi (docs/KEPUTUSAN.md) + warna Bab 5 (紫). 青碧 tetap dipakai untuk tanda benar (✓).
export const W = {
  tetsukon: '#0E2A47',
  malam: '#091C31',
  ai: '#0F4C81',
  seiheki: '#17706B',
  seihekiTerang: '#7FD1C4',
  seihekiL: '#DDEFEC',
  murasaki: '#5E4391',
  murasakiTua: '#2E2050',
  murasakiTerang: '#C9B8F2',
  murasakiL: '#ECE6F7',
  akane: '#B3282F',
  akaneTerang: '#F0B9BC',
  akaneL: '#F8E3E3',
  geppaku: '#EEECF1',
  shikkoku: '#14171F',
  tinta2: '#4A5061',
  garis: '#DCD9E2',
  emas: '#E3B04B',
  putih: '#FFFFFF',
};

export const F = {
  judul: 'Poppins, "Plus Jakarta Sans", sans-serif',
  isi: '"Plus Jakarta Sans", Poppins, sans-serif',
  jp: '"Zen Kaku Gothic New", "Plus Jakarta Sans", sans-serif',
  mincho: '"Shippori Mincho", "Zen Kaku Gothic New", serif',
};

// font lokal (public/fonts, diunduh scripts/ambil_font.py) — render tidak butuh internet
const daftar: [string, string, string][] = [
  ['Poppins', 'poppins-600.woff2', '600'],
  ['Poppins', 'poppins-700.woff2', '700'],
  ['Poppins', 'poppins-800.woff2', '800'],
  ['Plus Jakarta Sans', 'jakarta-500.woff2', '400 800'],
  ['Zen Kaku Gothic New', 'zenkaku-500.woff2', '500'],
  ['Zen Kaku Gothic New', 'zenkaku-700.woff2', '700'],
  ['Zen Kaku Gothic New', 'zenkaku-900.woff2', '900'],
  ['Shippori Mincho', 'shippori-800.woff2', '800'],
];
daftar.forEach(([family, file, weight]) => {
  loadFont({ family, url: staticFile('fonts/' + file), weight, display: 'block' });
});

// Gerak: keluar cepat lalu melambat (gaya referensi: halus, tidak patah)
export const KELUAR = Easing.bezier(0.16, 1, 0.3, 1);
export const LEMBUT = Easing.bezier(0.33, 1, 0.68, 1);
export const MASUK_KELUAR = Easing.bezier(0.65, 0, 0.35, 1);
export const MASUK = Easing.bezier(0.55, 0, 0.9, 0.35);

/** interpolasi terjepit dari frame a→b */
export const ip = (f: number, a: number, b: number, v0: number, v1: number, easing: (t: number) => number = KELUAR) =>
  interpolate(f, [a, b], [v0, v1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing });

/** pegas dengan sedikit pantulan (pop) */
export const pegas = (f: number, fps: number, mulai: number, cfg: { damping?: number; stiffness?: number; mass?: number } = {}) =>
  spring({ frame: f - mulai, fps, config: { damping: 13, stiffness: 170, mass: 0.85, ...cfg } });

/** pegas tanpa pantulan */
export const halus = (f: number, fps: number, mulai: number, durasi?: number) =>
  spring({ frame: f - mulai, fps, config: { damping: 200 }, durationInFrames: durasi });

/** angka acak deterministik (untuk getaran kamera / partikel) */
export const acak = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
