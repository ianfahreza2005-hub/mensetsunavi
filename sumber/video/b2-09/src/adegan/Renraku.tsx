import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Kamera, Kata, Sorot } from '../komponen';
import { F, W, ip, pegas, KELUAR, MASUK_KELUAR } from '../tema';

// Adegan 3 · 連絡 (renraku, mengabari): kanji besar + kotak seleksi ala alat desain dengan kursor "Navi",
// lalu inti materi: "Telepon perusahaan sebelum jadwal." (kata "sebelum" disorot, seperti cetak tebal di slide)
export const KURSOR_AKHIR = { x: 1300, y: 560 };

export const Renraku: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const naik = ip(f, 126, 170, 0, 1);
  const kotak = ip(f, 72, 96, 0, 1);
  // kursor bergerak dari kanan bawah ke sudut kotak, klik, lalu ikut naik bersama kotak
  const kx = ip(f, 56, 100, 1660, KURSOR_AKHIR.x) + naik * -120;
  const ky = ip(f, 56, 100, 980, KURSOR_AKHIR.y, KELUAR) + naik * -175;
  const klik = f >= 100 && f < 112 ? 1 - 0.18 * Math.sin(((f - 100) / 12) * Math.PI) : 1;
  const isi = ip(f, 102, 118, 0, 1);
  const sebelum = pegas(f, fps, 198, { damping: 9, stiffness: 240 });

  return (
    <Kamera dur={dur} dari={1.02} ke={1.0}>
      <AbsoluteFill>
        {/* kelompok kanji + bacaan + kotak seleksi */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, translate: `0 ${naik * -175}px`, scale: `${1 - naik * 0.34}`, transformOrigin: '960px 400px' }}>
          {/* isian sorot */}
          <div style={{ position: 'absolute', left: 640, top: 230, width: 640, height: 330, borderRadius: 12, background: W.seiheki, opacity: isi * 0.1 }} />
          {/* kanji */}
          <div style={{ position: 'absolute', top: 232, width: '100%', display: 'flex', justifyContent: 'center', fontFamily: F.mincho, fontWeight: 800, fontSize: 300, lineHeight: 1, color: W.shikkoku }}>
            {['連', '絡'].map((c, i) => {
              const m = 20 + i * 10;
              return (
                <span key={c} style={{ display: 'inline-block', opacity: ip(f, m, m + 16, 0, 1), scale: `${ip(f, m, m + 34, 1.35, 1)}`, filter: `blur(${ip(f, m, m + 26, 18, 0)}px)`, translate: `0 ${ip(f, m, m + 34, 30, 0)}px` }}>
                  {c}
                </span>
              );
            })}
          </div>
          {/* kotak seleksi bergaris putus + pegangan sudut */}
          <div style={{ position: 'absolute', left: 640, top: 230, width: 640, height: 330, opacity: kotak, scale: `${0.94 + 0.06 * kotak}` }}>
            <svg width={640} height={330} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
              <rect x={1.5} y={1.5} width={637} height={327} rx={10} fill="none" stroke={W.seiheki} strokeWidth={3} strokeDasharray="14 10" strokeDashoffset={-f * 0.6} />
            </svg>
            {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([a, b], i) => (
              <div key={i} style={{ position: 'absolute', left: a * 640 - 9, top: b * 330 - 9, width: 18, height: 18, borderRadius: 4, background: W.putih, border: `3px solid ${W.seiheki}` }} />
            ))}
          </div>
          {/* bacaan */}
          <div style={{ position: 'absolute', top: 600, width: '100%', display: 'flex', justifyContent: 'center', gap: 18, fontFamily: F.isi, fontSize: 52 }}>
            <Kata t="renraku" mulai={50} style={{ fontWeight: 800, color: W.seiheki }} />
            <Kata t="·" mulai={55} style={{ fontWeight: 600, color: W.tinta2 }} />
            <Kata t="mengabari" mulai={58} style={{ fontWeight: 600, color: W.tinta2 }} />
          </div>
        </div>

        {/* kalimat inti */}
        <div style={{ position: 'absolute', top: 640, width: '100%', display: 'flex', justifyContent: 'center', gap: 26, fontFamily: F.judul, fontWeight: 700, fontSize: 86, letterSpacing: '-0.02em', color: W.shikkoku }}>
          <Kata t="Telepon" mulai={150} />
          <Kata t="perusahaan" mulai={156} />
          <Kata
            t={<span style={{ display: 'inline-block', scale: `${1 + 0.1 * Math.sin(Math.min(1, sebelum) * Math.PI)}` }}><Sorot mulai={196} warna={W.akane} teksJadi={W.putih}>sebelum</Sorot></span>}
            mulai={162}
          />
          <Kata t="jadwal." mulai={168} />
        </div>
        <div style={{ position: 'absolute', top: 790, width: '100%', display: 'flex', justifyContent: 'center', gap: 14, fontFamily: F.isi, fontWeight: 500, fontSize: 42, color: W.tinta2 }}>
          {['Hou-Ren-Sou', 'dimulai', 'sebelum', 'wawancara.'].map((w, i) => <Kata key={i} t={w} mulai={214 + i * 4} dari={24} />)}
        </div>

        {/* kursor + label */}
        <div style={{ position: 'absolute', left: kx, top: ky, opacity: ip(f, 56, 66, 0, 1) * ip(f, dur - 40, dur - 24, 1, 0, MASUK_KELUAR), scale: `${klik}`, transformOrigin: '0 0' }}>
          <svg width={46} height={54} viewBox="0 0 23 27" style={{ filter: 'drop-shadow(0 6px 10px rgba(14,42,71,0.3))' }}>
            <path d="M2 2l18 9.5-7.8 2.2-3.8 7.6z" fill={W.seiheki} stroke={W.putih} strokeWidth={2} strokeLinejoin="round" />
          </svg>
          <div style={{ position: 'absolute', left: 34, top: 40, padding: '6px 14px', borderRadius: 10, background: W.seiheki, color: W.putih, fontFamily: F.isi, fontWeight: 700, fontSize: 24, whiteSpace: 'nowrap' }}>Navi</div>
        </div>
      </AbsoluteFill>
    </Kamera>
  );
};
