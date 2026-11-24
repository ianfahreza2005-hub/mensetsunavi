import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Kamera, Kata, Navi, IkonCentang, IkonSilang, Latar } from '../komponen';
import { BANDING, TEKS_LAIN } from '../naskah';
import { F, W, ip, pegas, KELUAR, MASUK, MASUK_KELUAR, acak } from '../tema';

// Adegan 5 · Pewawancara lebih menghargai jawaban pendek yang tenang daripada jawaban panjang yang terburu-buru (kotak "Gugup"),
// lalu pesan narasi Navi: tidak paham itu wajar → "Jangan diam." (judul slide) berganti tebal sambil memantul. Kartu akhir gelap.
export const T_A = 40;          // kartu "pendek yang tenang"
export const T_B = 84;          // kartu "panjang yang terburu-buru"
export const T_PUTUS = 150;     // yang tenang menyala, yang terburu-buru dicoret
export const T_PESAN = 244;
export const T_HIDUP = 306;
export const T_AKHIR = 436;

const GelombangTenang: React.FC<{ p: number; f: number }> = ({ p, f }) => {
  let d = 'M 0 22';
  for (let x = 0; x < 200; x += 40) d += ` q 10 -14 20 0 t 20 0`;
  return (
    <svg width={200} height={44} style={{ overflow: 'visible' }}>
      <path d={d} transform={`translate(${-((f * 0.5) % 40) + 20} 0)`} fill="none" stroke={W.seiheki} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
    </svg>
  );
};
const GelombangBuru: React.FC<{ p: number; f: number; getar: number }> = ({ p, f, getar }) => {
  let d = 'M 0 22';
  for (let x = 0, i = 0; x < 640; x += 13, i++) {
    const a = 6 + acak(i + 4) * 13;
    d += ` l 6.5 ${i % 2 ? a : -a} l 6.5 ${i % 2 ? -a : a}`;
  }
  return (
    <svg width={640} height={44} style={{ overflow: 'visible' }}>
      <path d={d} transform={`translate(0 ${Math.sin(f * 1.3) * 3 * getar})`} fill="none" stroke={W.akane} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
    </svg>
  );
};

export const Penutup: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = pegas(f, fps, T_A, { damping: 14, stiffness: 160 });
  const b = pegas(f, fps, T_B, { damping: 14, stiffness: 160 });
  const putus = ip(f, T_PUTUS, T_PUTUS + 20, 0, 1);
  const pergi = ip(f, T_PESAN - 34, T_PESAN - 6, 0, 1, MASUK);
  const hidup = pegas(f, fps, T_HIDUP, { damping: 9, stiffness: 210 });
  const navi = pegas(f, fps, T_HIDUP + 34, { damping: 13, stiffness: 160 });
  const getarB = f < T_PUTUS ? 1 : 1 - putus;

  const kartu = (jenis: 'baik' | 'buruk', masuk: number, y: number) => {
    const baik = jenis === 'baik';
    const warna = baik ? W.seiheki : W.akane;
    const gx = !baik && getarB > 0 && f > T_B + 20 ? Math.sin(f * 1.7) * 2.2 * getarB : 0;
    return (
      <div
        style={{
          position: 'absolute', left: 960 - 640, top: y - 88, width: 1280, height: 176, borderRadius: 34, background: W.putih, display: 'flex', alignItems: 'center', gap: 30, padding: '0 40px 0 30px',
          opacity: Math.min(1, masuk * 1.5) * (baik ? 1 : 1 - putus * 0.45) * (1 - pergi), translate: `${(1 - masuk) * (baik ? -120 : 120) + gx}px ${pergi * -70}px`,
          filter: pergi > 0.01 ? `blur(${pergi * 10}px)` : undefined, scale: `${baik ? 1 + 0.035 * putus : 1}`,
          boxShadow: baik ? `0 30px 60px -30px rgba(14,42,71,0.4), 0 0 0 ${5 * putus}px ${W.seihekiTerang}, 0 0 ${60 * putus}px rgba(127,209,196,${0.5 * putus})` : '0 30px 60px -30px rgba(14,42,71,0.35)',
        }}
      >
        <span style={{ width: 112, height: 112, borderRadius: 32, flex: 'none', display: 'grid', placeItems: 'center', background: warna }}>
          {baik ? <IkonCentang ukuran={62} warna={W.putih} p={ip(f, T_A + 8, T_A + 24, 0, 1)} /> : <IkonSilang ukuran={54} warna={W.putih} />}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ position: 'relative', display: 'inline-block', fontFamily: F.judul, fontWeight: 700, fontSize: 48, lineHeight: 1.2, color: W.shikkoku, letterSpacing: '-0.015em' }}>
            {baik ? BANDING.baik : BANDING.buruk}
            {!baik ? <span style={{ position: 'absolute', left: -4, right: -4, top: '54%', height: 5, borderRadius: 3, background: W.akane, scale: `${putus} 1`, transformOrigin: 'left center' }} /> : null}
          </div>
          <div style={{ marginTop: 10, height: 44 }}>
            {baik ? <GelombangTenang p={ip(f, T_A + 10, T_A + 56, 0, 1, KELUAR)} f={f} /> : <GelombangBuru p={ip(f, T_B + 8, T_B + 32, 0, 1, (t) => t)} f={f} getar={getarB} />}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill>
      <Kamera dur={dur} dari={1.0} ke={1.04}>
        <AbsoluteFill>
          {/* perbandingan */}
          <div style={{ position: 'absolute', top: 216, width: '100%', display: 'flex', justifyContent: 'center', gap: 20, fontFamily: F.judul, fontWeight: 700, fontSize: 66, letterSpacing: '-0.02em', color: W.shikkoku }}>
            {['Pewawancara', 'lebih', 'menghargai'].map((w, i) => <Kata key={i} t={w} mulai={6 + i * 5} keluar={T_PESAN - 36 + i * 2} />)}
          </div>
          {kartu('baik', a, 446)}
          <div style={{ position: 'absolute', top: 556, width: '100%', textAlign: 'center', fontFamily: F.isi, fontWeight: 600, fontSize: 38, color: W.tinta2, opacity: ip(f, 66, 82, 0, 1) * (1 - pergi) }}>daripada</div>
          {kartu('buruk', b, 702)}

          {/* pesan */}
          <div style={{ position: 'absolute', top: 290, width: '100%', display: 'flex', justifyContent: 'center', gap: 26, fontFamily: F.judul, fontWeight: 700, fontSize: 92, letterSpacing: '-0.025em', color: W.shikkoku }}>
            {['Tidak', 'paham', 'itu', 'wajar.'].map((w, i) => <Kata key={i} t={w} mulai={T_PESAN + i * 5} />)}
          </div>
          <div style={{ position: 'absolute', top: 420, width: '100%', display: 'flex', justifyContent: 'center', fontFamily: F.judul, fontSize: 120, letterSpacing: '-0.03em' }}>
            <Kata
              t={
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  <span style={{ fontWeight: 600, color: '#A3A7B3', opacity: 1 - Math.min(1, hidup * 1.4) }}>Jangan diam.</span>
                  <span style={{ position: 'absolute', left: '50%', top: 0, translate: '-50% 0', whiteSpace: 'nowrap', fontWeight: 800, color: W.murasaki, opacity: Math.min(1, hidup * 1.4), scale: `${0.9 + 0.1 * hidup}`, rotate: `${(1 - hidup) * -3}deg` }}>
                    Jangan diam.
                  </span>
                </span>
              }
              mulai={T_PESAN + 24}
            />
          </div>
          {Array.from({ length: 8 }).map((_, i) => {
            const u = ip(f, T_HIDUP + 2, T_HIDUP + 40, 0, 1);
            const ar = -Math.PI * (0.12 + acak(i + 5) * 0.76);
            const r = 300 + acak(i + 11) * 220;
            return <div key={i} style={{ position: 'absolute', left: 960 + Math.cos(ar) * r * u - 7, top: 500 + Math.sin(ar) * r * 0.5 * u - 7, width: 14, height: 14, rotate: '45deg', background: i % 2 ? W.murasaki : W.emas, opacity: u > 0 && u < 1 ? Math.sin(u * Math.PI) : 0 }} />;
          })}
          <div style={{ position: 'absolute', top: 640, width: '100%', display: 'flex', justifyContent: 'center', gap: 13, fontFamily: F.isi, fontWeight: 600, fontSize: 42, color: W.tinta2 }}>
            {'Minta diulang dengan sopan jauh lebih baik daripada menebak.'.split(' ').map((w, i) => <Kata key={i} t={w} mulai={T_HIDUP + 20 + i * 4} dari={24} />)}
          </div>
          <div style={{ position: 'absolute', right: 170, bottom: -24, translate: `0 ${(1 - navi) * 400}px`, rotate: `${(1 - navi) * 10 - 3}deg`, opacity: ip(f, T_HIDUP + 34, T_HIDUP + 44, 0, 1) }}>
            <Navi pose="pose_jempol" tinggi={400} style={{ filter: 'drop-shadow(0 24px 30px rgba(14,42,71,0.3))' }} />
          </div>
        </AbsoluteFill>
      </Kamera>

      {f >= T_AKHIR ? <KartuAkhir mulai={T_AKHIR} /> : null}
    </AbsoluteFill>
  );
};

const KartuAkhir: React.FC<{ mulai: number }> = ({ mulai }) => {
  const f = useCurrentFrame() - mulai;
  const { fps } = useVideoConfig();
  const logo = pegas(f, fps, 20, { damping: 14, stiffness: 160 });
  const r = ip(f, 0, 34, 0, 2350, MASUK_KELUAR);
  return (
    <AbsoluteFill style={{ clipPath: `circle(${r}px at 960px 540px)` }}>
      <Latar gelap />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontFamily: F.jp, fontWeight: 900, fontSize: 64, color: W.murasakiTerang, letterSpacing: '0.12em', opacity: ip(f, 18, 34, 0, 1), translate: `0 ${ip(f, 18, 44, 24, 0)}px` }}>{TEKS_LAIN.merek}</div>
        <div style={{ fontFamily: F.judul, fontWeight: 700, fontSize: 112, color: W.putih, letterSpacing: '-0.03em', scale: `${0.9 + 0.1 * logo}`, opacity: Math.min(1, logo * 1.4) }}>Mensetsu Navi</div>
        <div style={{ marginTop: 14, fontFamily: F.isi, fontWeight: 600, fontSize: 34, color: 'rgba(255,255,255,0.72)', opacity: ip(f, 40, 58, 0, 1) }}>{TEKS_LAIN.bab}</div>
      </AbsoluteFill>
      <div style={{ position: 'absolute', bottom: 60, width: '100%', textAlign: 'center', fontFamily: F.isi, fontWeight: 600, fontSize: 26, color: 'rgba(255,255,255,0.72)', opacity: ip(f, 50, 70, 0, 1) }}>{TEKS_LAIN.kredit}</div>
      <AbsoluteFill style={{ background: W.malam, opacity: ip(f, 114, 138, 0, 1, MASUK_KELUAR) }} />
    </AbsoluteFill>
  );
};
