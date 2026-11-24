import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Kamera, Kata, Sorot, NaviGanti, Pewawancara, Coretan, TandaTanya, TeksUcapan, tingkatBicara } from '../komponen';
import { TANYA } from '../naskah';
import { PEMBUKA as T, CELOTEH } from '../waktu';
import { F, W, ip, pegas, halus, MASUK_KELUAR } from '../tema';

// Adegan 1 · Pewawancara bicara (celoteh tak tertangkap) → "?" → kamu bertanya dengan ungkapan penyelamat (dua kali,
// dari tabel B5-09) → pewawancara mengulang lebih pelan → tetap tidak paham. Gelembung bertumpuk seperti obrolan.
const AVATAR = { x: 250, y: 470, ukuran: 220 };
const KIRI = 410;          // tepi kiri gelembung pewawancara
const KANAN = 1400;        // tepi kanan gelembung kamu
const DASAR = 900;         // gelembung terbaru menempel di sini, yang lama naik
const JARAK = 26;

type Gelembung = { tipe: 'p'; mulai: number; durasi: number; rapat: number; amp: number; getar: number; seed: number; h: number } | { tipe: 'k'; mulai: number; i: number; h: number };
const H_P = 144, H_K1 = 242, H_K2 = 302;   // tinggi kira-kira; posisi dihitung dari bawah, jadi selisih kecil hanya menggeser jarak
const GELEMBUNG: Gelembung[] = [
  { tipe: 'p', mulai: T.c1, durasi: CELOTEH.cepat, rapat: 13, amp: 9, getar: 2.4, seed: 1, h: H_P },
  { tipe: 'k', mulai: T.k1, i: 0, h: H_K1 },
  { tipe: 'p', mulai: T.c2, durasi: CELOTEH.cepat2, rapat: 13, amp: 9, getar: 2.4, seed: 2, h: H_P },
  { tipe: 'k', mulai: T.k2, i: 1, h: H_K2 },   // kalimat panjang: dua baris
  { tipe: 'p', mulai: T.c3, durasi: CELOTEH.pelan, rapat: 30, amp: 11, getar: 0, seed: 3, h: H_P },
];
const SUARA_TANYA = [T.t1, T.t2];

export const Pembuka: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // pewawancara "berbicara" selama celoteh
  const bicaraP = Math.max(...GELEMBUNG.filter((g) => g.tipe === 'p').map((g) => (g.tipe === 'p' ? Math.min(ip(f, g.mulai + 2, g.mulai + 8, 0, 1), ip(f, g.mulai + 4 + g.durasi - 4, g.mulai + 4 + g.durasi + 6, 1, 0)) : 0)));
  const bicaraK = tingkatBicara(f, SUARA_TANYA);
  const avatar = pegas(f, fps, 6, { damping: 14, stiffness: 160 });
  const navi = pegas(f, fps, 12, { damping: 15, stiffness: 140 });
  const redup = ip(f, T.judul - 6, T.judul + 22, 0, 1, MASUK_KELUAR);
  const keluar = ip(f, dur - 36, dur - 12, 0, 1, MASUK_KELUAR);
  const hitung = f >= T.t2.audio ? 2 : f >= T.t1.audio ? 1 : 0;
  const popHitung = pegas(f, fps, hitung === 2 ? T.t2.audio : T.t1.audio, { damping: 10, stiffness: 260 });

  return (
    <Kamera dur={dur} dari={1.0} ke={1.045} getar={[[T.q3, 10]]}>
      <AbsoluteFill style={{ opacity: 1 - keluar, filter: keluar > 0.01 ? `blur(${keluar * 10}px)` : undefined }}>
        {/* label + penghitung pertanyaan */}
        <div style={{ position: 'absolute', left: 120, top: 84, fontFamily: F.isi, fontWeight: 800, fontSize: 26, letterSpacing: '0.2em', color: W.murasakiTerang, opacity: ip(f, 4, 24, 0, 1) * (1 - redup * 0.6) }}>
          SAAT WAWANCARA
        </div>
        <div style={{ position: 'absolute', right: 120, top: 70, display: 'flex', alignItems: 'center', gap: 16, opacity: ip(f, T.t1.audio - 6, T.t1.audio + 10, 0, 1) }}>
          <span style={{ fontFamily: F.isi, fontWeight: 800, fontSize: 24, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.7)' }}>BERTANYA</span>
          <span style={{ display: 'flex', gap: 10 }}>
            {[0, 1].map((i) => (
              <span key={i} style={{ width: 22, height: 22, borderRadius: 11, border: `3px solid ${W.murasakiTerang}`, background: i < hitung ? W.murasakiTerang : 'transparent', scale: `${i === hitung - 1 ? popHitung : 1}` }} />
            ))}
          </span>
          <span style={{ fontFamily: F.judul, fontWeight: 800, fontSize: 40, color: W.putih, minWidth: 56, display: 'inline-block', scale: `${0.7 + 0.3 * popHitung}` }}>{hitung}×</span>
        </div>

        {/* pewawancara */}
        <div style={{ position: 'absolute', left: AVATAR.x - AVATAR.ukuran / 2, top: AVATAR.y - AVATAR.ukuran / 2, scale: `${avatar}`, opacity: Math.min(1, avatar * 1.5) * (1 - redup * 0.82), filter: redup > 0.01 ? `blur(${redup * 6}px)` : undefined }}>
          <Pewawancara ukuran={AVATAR.ukuran} bicara={bicaraP} />
          <div style={{ position: 'absolute', top: AVATAR.ukuran + 26, left: -60, right: -60, textAlign: 'center', fontFamily: F.isi, fontWeight: 700, fontSize: 30, color: 'rgba(255,255,255,0.86)' }}>Pewawancara</div>
        </div>

        {/* gelembung obrolan */}
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - redup * 0.84, filter: redup > 0.01 ? `blur(${redup * 7}px)` : undefined }}>
          {GELEMBUNG.map((g, i) => {
            if (f < g.mulai) return null;
            let naik = 0;
            for (let j = i + 1; j < GELEMBUNG.length; j++) naik += (GELEMBUNG[j].h + JARAK) * halus(f, fps, GELEMBUNG[j].mulai - 8, 36);
            const atas = DASAR - g.h - naik;
            const masuk = pegas(f, fps, g.mulai, { damping: 14, stiffness: 190 });
            const pudarAtas = ip(atas, 30, 170, 0, 1, (t) => t);
            const umum: React.CSSProperties = { position: 'absolute', bottom: 1080 - DASAR + naik, opacity: Math.min(1, masuk * 1.6) * pudarAtas, scale: `${0.7 + 0.3 * masuk}`, translate: `0 ${(1 - masuk) * 40}px` };
            if (g.tipe === 'p') {
              const p = ip(f, g.mulai + 4, g.mulai + 4 + g.durasi, 0, 1, (t) => t);
              return (
                <div key={i} style={{ ...umum, left: KIRI, transformOrigin: 'left bottom', padding: '28px 36px', borderRadius: '36px 36px 36px 8px', background: 'rgba(255,255,255,0.09)', border: '2px solid rgba(201,184,242,0.34)', boxShadow: '0 24px 50px -30px rgba(0,0,0,0.6)' }}>
                  <Coretan lebar={520} baris={2} rapat={g.rapat} amp={g.amp} p={p} warna={W.murasakiTerang} seed={g.seed} getar={g.getar * (p < 1 ? 1 : 0)} />
                </div>
              );
            }
            const u = TANYA[g.i];
            const s = SUARA_TANYA[g.i];
            const arti = s.selesai - 26;
            return (
              <div key={i} style={{ ...umum, right: 1920 - KANAN, transformOrigin: 'right bottom', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '7px 18px', borderRadius: 999, background: W.murasaki, color: W.putih, fontFamily: F.isi, fontWeight: 700, fontSize: 22, opacity: ip(f, g.mulai + 6, g.mulai + 18, 0, 1) }}>
                  {u.situasi}
                </span>
                <div style={{ padding: '24px 34px 26px', borderRadius: '36px 36px 8px 36px', background: W.putih, boxShadow: '0 30px 60px -30px rgba(0,0,0,0.65)' }}>
                  <TeksUcapan u={u} s={s} ukuran={48} ukuranRo={30} jarakRo={8} rata="flex-end" lebarMaks={860} />
                  <div style={{ marginTop: 10, textAlign: 'right', fontFamily: F.isi, fontWeight: 500, fontSize: 26, color: W.tinta2, opacity: ip(f, arti, arti + 16, 0, 1), translate: `0 ${ip(f, arti, arti + 26, 14, 0)}px` }}>{u.arti}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* kamu (Navi) */}
        <div style={{ position: 'absolute', left: 1410, bottom: -36, translate: `0 ${(1 - navi) * 520}px`, opacity: ip(f, 12, 22, 0, 1) }}>
          <NaviGanti
            lebar={480}
            tinggi={560}
            style={{ filter: 'drop-shadow(0 26px 40px rgba(0,0,0,0.45))', translate: `0 ${bicaraK * -5}px` }}
            jadwal={[
              [0, 'exp_netral'],
              [T.q1, 'exp_bingung'],
              [T.t1.audio - 4, 'exp_gugup'],
              [T.t1.selesai + 6, 'exp_netral'],
              [T.q2, 'exp_bingung'],
              [T.t2.audio - 4, 'exp_gugup'],
              [T.t2.selesai + 6, 'exp_netral'],
              [T.q3, 'exp_bingung'],
            ]}
          />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 70, textAlign: 'center' }}>
            <span style={{ display: 'inline-block', padding: '8px 22px', borderRadius: 999, background: 'rgba(14,42,71,0.82)', color: W.putih, fontFamily: F.isi, fontWeight: 700, fontSize: 28, opacity: ip(f, 30, 44, 0, 1) }}>Kamu</span>
          </div>
        </div>

        {/* tanda tanya */}
        <TandaTanya mulai={T.q1} x={1540} y={470} ukuran={124} keluar={T.t1.audio - 6} />
        <TandaTanya mulai={T.q2} x={1540} y={470} ukuran={124} keluar={T.t2.audio - 6} />
        <TandaTanya mulai={T.q3} x={1560} y={450} ukuran={168} />
        <TandaTanya mulai={T.q3 + 8} x={1700} y={372} ukuran={92} miring={16} />
        <TandaTanya mulai={T.q3 + 14} x={1470} y={330} ukuran={78} miring={-24} />

        {/* judul: tetap tidak paham */}
        <div style={{ position: 'absolute', left: 150, top: 330, width: 1150 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: 24, fontFamily: F.judul, fontWeight: 700, fontSize: 82, lineHeight: 1.15, color: W.putih, letterSpacing: '-0.02em' }}>
            {['Sudah', 'dua', 'kali', 'bertanya,'].map((w, i) => <Kata key={i} t={w} mulai={T.judul + i * 5} />)}
          </div>
          <div style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', columnGap: 24, fontFamily: F.judul, fontWeight: 700, fontSize: 82, lineHeight: 1.15, color: W.putih, letterSpacing: '-0.02em' }}>
            <Kata t="tetap" mulai={T.judul + 26} />
            <Kata t={<Sorot mulai={T.judul + 46} warna={W.akane} teksJadi={W.putih}>tidak paham?</Sorot>} mulai={T.judul + 31} />
          </div>
        </div>
      </AbsoluteFill>
    </Kamera>
  );
};
