import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Kamera, Kata, Navi, IkonJam } from '../komponen';
import { F, W, ip, pegas, KELUAR, MASUK_KELUAR } from '../tema';

// Adegan 1 · Situasi (Kasus 3 B2-11): wawancara 10.00 → 09.30 kereta berhenti → terlambat ±15 menit
export const Pembuka: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const KELUAR_SEMUA = dur - 30;

  // baris A naik dan mengecil saat baris B masuk
  const naikA = ip(f, 92, 132, 0, -175);
  const skalaA = ip(f, 92, 132, 1, 0.74);
  const pil = pegas(f, fps, 30, { damping: 12, stiffness: 190 });
  const kedip = f > 52 && f < 92 && Math.floor(f / 14) % 2 === 0 ? 1 : 0;
  const jam = pegas(f, fps, 102, { damping: 11, stiffness: 200 });
  const stempel = pegas(f, fps, 178, { damping: 10, stiffness: 260, mass: 0.7 });
  const navi = pegas(f, fps, 160, { damping: 14, stiffness: 150 });
  const keluar = ip(f, KELUAR_SEMUA, KELUAR_SEMUA + 22, 1, 0, MASUK_KELUAR);

  return (
    <Kamera dur={dur} dari={1} ke={1.05} getar={[[180, 16]]}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: keluar, filter: keluar < 1 ? `blur(${(1 - keluar) * 10}px)` : undefined }}>
        {/* label kecil */}
        <div style={{ position: 'absolute', top: 218, width: '100%', textAlign: 'center', fontFamily: F.isi, fontWeight: 700, fontSize: 26, letterSpacing: '0.2em', color: W.seihekiTerang, opacity: ip(f, 4, 24, 0, 1) * ip(f, 92, 118, 1, 0) }}>
          HARI WAWANCARA
        </div>

        {/* baris A: Wawancara pukul [10.00] */}
        <div style={{ position: 'absolute', top: 430, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 26, translate: `0 ${naikA}px`, scale: `${skalaA}` }}>
          <Kata t="Wawancara" mulai={8} style={{ fontFamily: F.judul, fontWeight: 700, fontSize: 104, color: W.putih, letterSpacing: '-0.02em' }} />
          <Kata t="pukul" mulai={16} style={{ fontFamily: F.judul, fontWeight: 600, fontSize: 104, color: 'rgba(255,255,255,0.72)', letterSpacing: '-0.02em' }} />
          <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <span style={{ display: 'inline-block', padding: '4px 30px 8px', borderRadius: 26, background: W.putih, scale: `${0.55 + 0.45 * pil}`, opacity: Math.min(1, pil * 1.6), rotate: `${(1 - pil) * -6}deg` }}>
              <span style={{ fontFamily: F.judul, fontWeight: 800, fontSize: 104, color: W.tetsukon, letterSpacing: '-0.02em' }}>10.00</span>
            </span>
            <span style={{ position: 'absolute', right: -22, top: 22, width: 6, height: 104, borderRadius: 3, background: W.seihekiTerang, opacity: kedip }} />
          </span>
        </div>

        {/* baris B: [09.30] Kereta berhenti karena gangguan. */}
        <div style={{ position: 'absolute', top: 492, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 26 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '10px 26px 10px 18px', borderRadius: 20, background: W.akane, color: W.putih, scale: `${jam}`, opacity: Math.min(1, jam * 1.5), boxShadow: '0 18px 40px -16px rgba(179,40,47,0.8)' }}>
            <IkonJam ukuran={54} warna={W.putih} sudut={ip(f, 102, 150, 0, 180)} />
            <span style={{ fontFamily: F.judul, fontWeight: 800, fontSize: 64 }}>09.30</span>
          </span>
          {['Kereta', 'berhenti', 'karena', 'gangguan.'].map((w, i) => (
            <Kata key={w} t={w} mulai={114 + i * 6} style={{ fontFamily: F.judul, fontWeight: 700, fontSize: 70, color: W.putih, letterSpacing: '-0.01em' }} />
          ))}
        </div>

        {/* baris C */}
        <div style={{ position: 'absolute', top: 640, width: '100%', display: 'flex', justifyContent: 'center', gap: 16 }}>
          {['Kamu', 'akan', 'terlambat', 'sekitar', '15', 'menit.'].map((w, i) => (
            <Kata key={i} t={w} mulai={146 + i * 5} style={{ fontFamily: F.isi, fontWeight: 600, fontSize: 52, color: i === 2 ? W.akaneTerang : 'rgba(255,255,255,0.78)' }} />
          ))}
        </div>

        {/* stempel TERLAMBAT */}
        <div
          style={{
            position: 'absolute', left: 1430, top: 724, padding: '12px 26px', borderRadius: 16, border: `6px solid ${W.akane}`, background: 'rgba(179,40,47,0.14)',
            color: W.akaneTerang, fontFamily: F.judul, fontWeight: 800, fontSize: 44, letterSpacing: '0.08em', rotate: '-9deg',
            scale: `${2.3 - 1.3 * stempel}`, opacity: ip(f, 178, 184, 0, 1), boxShadow: '0 0 40px rgba(179,40,47,0.35)',
          }}
        >
          TERLAMBAT
        </div>

        {/* Navi kaget */}
        <div style={{ position: 'absolute', left: 70, bottom: -40, translate: `0 ${(1 - navi) * 420}px`, rotate: `${(1 - navi) * -12 + 4}deg`, opacity: ip(f, 160, 170, 0, 1) }}>
          <Navi pose="exp_gugup" tinggi={430} style={{ filter: 'drop-shadow(0 24px 30px rgba(0,0,0,0.35))' }} />
        </div>
      </AbsoluteFill>
    </Kamera>
  );
};

export const kelPembuka = KELUAR;
