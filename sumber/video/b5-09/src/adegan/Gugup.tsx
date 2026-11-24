import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Kamera, Kata, Sorot, NaviGanti, TeksUcapan, IkonJeda, IkonGelembung, IkonCentang } from '../komponen';
import { LANGKAH_GUGUP, BOLEH } from '../naskah';
import { GUGUP_T as T } from '../waktu';
import { F, W, ip, pegas, KELUAR, MASUK_KELUAR, acak } from '../tema';

// Adegan 4 · Kotak "Gugup di tengah wawancara?": orb berisi Navi yang awalnya gelisah (bergetar, partikel berputar cepat),
// lalu berhenti sejenak (semua membeku), tarik napas (orb mengembang, busur terisi) dan napas keluar (mengempis, gelombang lembut),
// lalu lanjut dengan kalimat pendek: 少し考えてもいいですか。
export const ORB = { x: 600, y: 610 };
const R = 210;
const KOLOM = 1010;
export const KARTU_BOLEH = { x: KOLOM + 380, y: 790 };
const MULAI_LANGKAH = [T.s1, T.s2, T.s3];
const DENYUT = [16, 34, 52, 70, 88];   // denyut gelisah sebelum berhenti sejenak

export const Gugup: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const orb = pegas(f, fps, 6, { damping: 13, stiffness: 150 });
  const tenang = ip(f, T.s1, T.s1 + 14, 0, 1);
  const gx = (acak(Math.floor(f / 2)) - 0.5) * 12 * (1 - tenang);
  const gy = (acak(Math.floor(f / 2) + 50) - 0.5) * 12 * (1 - tenang);
  const tarik = ip(f, T.s2, T.s2 + 86, 0, 1, MASUK_KELUAR);
  const keluar = ip(f, T.hembus, T.hembus + 90, 0, 1, MASUK_KELUAR);
  const napas = tarik * (1 - keluar);
  const busur = f < T.hembus ? tarik : 1 - keluar;
  const skalaOrb = orb * (1 + 0.24 * napas);
  const lencana = pegas(f, fps, T.s1, { damping: 10, stiffness: 260 });
  const ganti = pegas(f, fps, T.s3, { damping: 10, stiffness: 260 });
  const ringkas = ip(f, T.boleh - 10, T.boleh + 30, 0, 1, MASUK_KELUAR);

  // gelombang: cepat & rapat saat gelisah, pelan saat napas keluar
  const gelombang: [number, number][] = DENYUT.map((t) => [t, 26]);
  for (let t = T.hembus + 6; t < T.hembus + 90; t += 28) gelombang.push([t, 70]);

  return (
    <Kamera dur={dur} dari={1.0} ke={1.04}>
      <AbsoluteFill>
        {/* judul */}
        <div style={{ position: 'absolute', left: 150, top: 108, display: 'flex', gap: 22, fontFamily: F.judul, fontWeight: 700, fontSize: 74, color: W.putih, letterSpacing: '-0.02em' }}>
          <Kata t={<Sorot mulai={26} warna={W.murasaki} teksJadi={W.putih}>Gugup</Sorot>} mulai={8} />
          {['di', 'tengah', 'wawancara?'].map((w, i) => <Kata key={i} t={w} mulai={14 + i * 5} />)}
        </div>

        {/* cahaya latar */}
        <div style={{ position: 'absolute', left: ORB.x - 520, top: ORB.y - 520, width: 1040, height: 1040, borderRadius: '50%', background: 'radial-gradient(circle, rgba(94,67,145,0.5) 0%, rgba(94,67,145,0.14) 45%, transparent 70%)', scale: `${orb * (0.9 + 0.3 * napas)}`, opacity: 0.7 + 0.3 * napas }} />

        {/* gelombang */}
        {gelombang.map(([t, lama]) => {
          const u = ip(f, t, t + lama, 0, 1, KELUAR);
          if (u <= 0 || u >= 1) return null;
          const r = R * (1 + 0.24 * napas) + 10 + u * (lama > 30 ? 260 : 120);
          return <div key={t} style={{ position: 'absolute', left: ORB.x - r, top: ORB.y - r, width: r * 2, height: r * 2, borderRadius: '50%', border: `3px solid ${lama > 30 ? W.murasakiTerang : W.akaneTerang}`, opacity: (1 - u) * (lama > 30 ? 0.55 : 0.4) }} />;
        })}

        {/* partikel: berputar cepat lalu membeku, kemudian melayang pelan */}
        {Array.from({ length: 16 }).map((_, i) => {
          const a0 = acak(i + 2) * Math.PI * 2;
          const vc = (0.06 + acak(i + 9) * 0.05) * (i % 2 ? 1 : -1);
          const lepas = Math.max(0, f - T.s1);
          const sudut = a0 + vc * Math.min(f, T.s1) + vc * 7 * (1 - Math.exp(-lepas / 7)) + vc * 0.05 * lepas;
          const r = R + 50 + acak(i + 21) * 70 + (1 - tenang) * Math.sin(f * 0.8 + i) * 16 + napas * 46;
          const ukuran = 6 + acak(i + 33) * 8;
          return <div key={i} style={{ position: 'absolute', left: ORB.x + Math.cos(sudut) * r - ukuran / 2, top: ORB.y + Math.sin(sudut) * r * 0.92 - ukuran / 2, width: ukuran, height: ukuran, borderRadius: '50%', background: i % 3 ? W.murasakiTerang : W.putih, opacity: ip(f, 10 + i, 24 + i, 0, 0.8) * (0.55 + 0.45 * tenang), boxShadow: '0 0 14px rgba(201,184,242,0.7)' }} />;
        })}

        {/* busur napas */}
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible', opacity: ip(f, T.s2 - 6, T.s2 + 8, 0, 1) * ip(f, T.s3 + 10, T.s3 + 30, 1, 0) }}>
          <g transform={`translate(${ORB.x} ${ORB.y}) rotate(-90) scale(${1 + 0.24 * napas})`}>
            <circle r={R + 30} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={8} />
            <circle r={R + 30} fill="none" stroke={W.murasakiTerang} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - busur} />
          </g>
        </svg>

        {/* orb + Navi */}
        <div style={{ position: 'absolute', left: ORB.x - R, top: ORB.y - R, width: R * 2, height: R * 2, translate: `${gx}px ${gy}px`, scale: `${skalaOrb}` }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', background: `radial-gradient(circle at 34% 28%, #9C80D6 0%, ${W.murasaki} 52%, ${W.murasakiTua} 100%)`, boxShadow: '0 40px 80px -30px rgba(0,0,0,0.6), inset 0 6px 24px rgba(255,255,255,0.22), 0 0 90px rgba(149,121,208,0.35)' }}>
            <NaviGanti lebar={R * 2} tinggi={470} style={{ position: 'absolute', left: 0, top: 40 }} jadwal={[[0, 'exp_gugup'], [T.s1 + 10, 'exp_netral'], [T.boleh + 30, 'exp_berpikir']]} />
          </div>
          {/* lencana langkah */}
          <div style={{ position: 'absolute', right: -14, top: -2, width: 96, height: 96, borderRadius: '50%', background: W.putih, display: 'grid', placeItems: 'center', scale: `${f < T.s1 ? 0 : lencana}`, boxShadow: '0 16px 30px -12px rgba(0,0,0,0.5)', opacity: ip(f, T.boleh, T.boleh + 16, 1, 0) }}>
            <div style={{ position: 'absolute', scale: `${1 - ganti}`, opacity: f < T.s3 ? 1 : Math.max(0, 1 - ganti) }}><IkonJeda ukuran={50} warna={W.murasaki} /></div>
            <div style={{ position: 'absolute', scale: `${f < T.s3 ? 0 : ganti}` }}><IkonGelembung ukuran={54} warna={W.murasaki} /></div>
          </div>
        </div>

        {/* tiga langkah */}
        <div style={{ position: 'absolute', left: KOLOM, top: 290, width: 820, translate: `0 ${ringkas * -34}px`, scale: `${1 - ringkas * 0.3}`, transformOrigin: 'left top', opacity: 1 - ringkas * 0.45 }}>
          {LANGKAH_GUGUP.map((teks, i) => {
            const m = MULAI_LANGKAH[i];
            const muncul = pegas(f, fps, m, { damping: 14, stiffness: 180 });
            const berikut = MULAI_LANGKAH[i + 1] ?? T.boleh;
            const lewat = f >= berikut;
            const aktif = f >= m && !lewat;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 26, marginBottom: 40, opacity: f < m ? 0 : (aktif ? 1 : 0.5) * Math.min(1, muncul * 1.4), translate: `${(1 - muncul) * 40}px 0` }}>
                <span style={{ width: 66, height: 66, borderRadius: 33, flex: 'none', display: 'grid', placeItems: 'center', background: lewat ? 'rgba(255,255,255,0.14)' : W.murasaki, color: W.putih, fontFamily: F.judul, fontWeight: 700, fontSize: 32, scale: `${muncul}`, boxShadow: aktif ? '0 0 0 6px rgba(201,184,242,0.25)' : 'none' }}>
                  {lewat ? <IkonCentang ukuran={36} warna={W.murasakiTerang} p={ip(f, berikut, berikut + 14, 0, 1)} /> : i + 1}
                </span>
                <span style={{ fontFamily: F.judul, fontWeight: 600, fontSize: 54, lineHeight: 1.16, color: W.putih, letterSpacing: '-0.01em', paddingTop: 0 }}>{teks}</span>
              </div>
            );
          })}
        </div>

        {/* kalimat pendek */}
        <div style={{ position: 'absolute', left: KOLOM, top: 590, width: 860 }}>
          <div style={{ display: 'flex', gap: 12, fontFamily: F.isi, fontWeight: 600, fontSize: 36, color: W.murasakiTerang }}>
            {'Kamu juga boleh mengucapkan:'.split(' ').map((w, i) => <Kata key={i} t={w} mulai={T.boleh + 10 + i * 4} dari={22} />)}
          </div>
          <div style={{ marginTop: 22, display: 'inline-block', padding: '28px 40px 30px', borderRadius: '36px 36px 36px 10px', background: W.putih, boxShadow: '0 30px 60px -30px rgba(0,0,0,0.65)', scale: `${pegas(f, fps, T.boleh + 26, { damping: 14, stiffness: 190 })}`, transformOrigin: 'left bottom' }}>
            <TeksUcapan u={BOLEH} s={T.g1} ukuran={60} ukuranRo={34} jarakRo={10} />
            <div style={{ marginTop: 12, fontFamily: F.isi, fontWeight: 500, fontSize: 32, color: W.tinta2, opacity: ip(f, T.g1.selesai - 16, T.g1.selesai + 2, 0, 1), translate: `0 ${ip(f, T.g1.selesai - 16, T.g1.selesai + 14, 14, 0)}px` }}>{BOLEH.arti}</div>
          </div>
        </div>
      </AbsoluteFill>
    </Kamera>
  );
};
