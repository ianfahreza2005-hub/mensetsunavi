import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Kamera, Kata, IkonTelepon } from '../komponen';
import { F, W, ip, pegas, KELUAR } from '../tema';

// Adegan 4 · Menelepon: orb bercahaya dengan ikon telepon, cincin orbit berputar, gelombang dering; lalu tersambung.
export const ORB = { x: 700, y: 540 };
export const T_DERING = 30;            // dering.wav: nyala 0–60, 93–153 (frame relatif)
export const T_ANGKAT = 188;
const NYALA: [number, number][] = [[T_DERING, T_DERING + 60], [T_DERING + 93, T_DERING + 153]];

export const Panggilan: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const orb = pegas(f, fps, 8, { damping: 13, stiffness: 150 });
  const berdering = NYALA.some(([a, b]) => f >= a && f < b);
  const goyang = berdering ? Math.sin(f * 1.6) * 11 : 0;
  const tersambung = pegas(f, fps, T_ANGKAT, { damping: 12, stiffness: 220 });
  const sudahAngkat = f >= T_ANGKAT;

  // gelombang dering: tiap 20 frame selama nada menyala
  const gelombang: number[] = [];
  NYALA.forEach(([a, b]) => { for (let t = a; t < b; t += 20) gelombang.push(t); });

  return (
    <Kamera dur={dur} dari={1.0} ke={1.045}>
      <AbsoluteFill>
        {/* cahaya latar orb */}
        <div style={{ position: 'absolute', left: ORB.x - 420, top: ORB.y - 420, width: 840, height: 840, borderRadius: '50%', background: 'radial-gradient(circle, rgba(23,112,107,0.45) 0%, rgba(23,112,107,0.12) 45%, transparent 70%)', scale: `${orb}` }} />
        {/* cincin orbit + titik yang berputar */}
        {[[230, 0.55, 14, 0], [335, -0.34, 10, 1.7], [455, 0.22, 18, 3.1]].map(([r, kecepatan, ukuran, awal], i) => {
          const muncul = ip(f, 10 + i * 6, 40 + i * 6, 0, 1);
          const sudut = awal + (f / fps) * kecepatan * Math.PI;
          return (
            <React.Fragment key={i}>
              <div style={{ position: 'absolute', left: ORB.x - r, top: ORB.y - r, width: r * 2, height: r * 2, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.13)', opacity: muncul, scale: `${0.85 + 0.15 * muncul}` }} />
              {[0, Math.PI].slice(0, i === 1 ? 2 : 1).map((d, j) => (
                <div key={j} style={{ position: 'absolute', left: ORB.x + Math.cos(sudut + d) * r - ukuran / 2, top: ORB.y + Math.sin(sudut + d) * r - ukuran / 2, width: ukuran, height: ukuran, borderRadius: '50%', background: W.putih, opacity: muncul, boxShadow: '0 0 18px rgba(255,255,255,0.8)' }} />
              ))}
            </React.Fragment>
          );
        })}
        {/* gelombang dering */}
        {gelombang.map((t) => {
          const u = ip(f, t, t + 46, 0, 1, KELUAR);
          if (u <= 0 || u >= 1) return null;
          const r = 150 + u * 260;
          return <div key={t} style={{ position: 'absolute', left: ORB.x - r, top: ORB.y - r, width: r * 2, height: r * 2, borderRadius: '50%', border: `3px solid ${W.seihekiTerang}`, opacity: (1 - u) * 0.7 }} />;
        })}
        {/* orb inti */}
        <div
          style={{
            position: 'absolute', left: ORB.x - 150, top: ORB.y - 150, width: 300, height: 300, borderRadius: '50%', display: 'grid', placeItems: 'center', scale: `${orb * (1 + 0.04 * tersambung * Math.sin(f / 8))}`,
            background: `radial-gradient(circle at 34% 28%, #3DB3A5 0%, ${W.seiheki} 48%, #0B4A55 100%)`,
            boxShadow: '0 30px 70px -20px rgba(0,0,0,0.6), inset 0 6px 24px rgba(255,255,255,0.25), 0 0 80px rgba(61,179,165,0.35)',
          }}
        >
          <div style={{ rotate: `${goyang}deg` }}>
            <IkonTelepon ukuran={128} warna={W.putih} />
          </div>
        </div>

        {/* teks kanan */}
        <div style={{ position: 'absolute', left: 1120, top: 330, width: 700 }}>
          <div style={{ fontFamily: F.isi, fontWeight: 700, fontSize: 26, letterSpacing: '0.2em', color: W.seihekiTerang, opacity: ip(f, 16, 34, 0, 1) }}>CONTOH TELEPON</div>
          <div style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', columnGap: 22, fontFamily: F.judul, fontWeight: 700, fontSize: 84, lineHeight: 1.1, color: W.putih, letterSpacing: '-0.02em' }}>
            <Kata t="Menelepon" mulai={24} />
            <Kata t="perusahaan…" mulai={31} />
          </div>
          <div style={{ marginTop: 18, display: 'flex', gap: 14, fontFamily: F.isi, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.78)' }}>
            {['Sebelum', 'pukul', '10.00.'].map((w, i) => <Kata key={i} t={w} mulai={46 + i * 5} dari={24} />)}
          </div>
          {/* status panggilan */}
          <div style={{ marginTop: 40, position: 'relative', height: 64 }}>
            <div style={{ position: 'absolute', display: 'inline-flex', alignItems: 'center', gap: 14, padding: '12px 26px 12px 20px', borderRadius: 999, background: 'rgba(255,255,255,0.1)', color: W.putih, fontFamily: F.isi, fontWeight: 700, fontSize: 30, opacity: ip(f, 60, 76, 0, 1) * (sudahAngkat ? 0 : 1) }}>
              <span style={{ width: 16, height: 16, borderRadius: 8, background: W.emas, opacity: 0.45 + 0.55 * Math.abs(Math.sin(f / 9)) }} />
              Memanggil…
            </div>
            <div style={{ position: 'absolute', display: 'inline-flex', alignItems: 'center', gap: 14, padding: '12px 26px 12px 20px', borderRadius: 999, background: W.seiheki, color: W.putih, fontFamily: F.isi, fontWeight: 800, fontSize: 30, scale: `${tersambung}`, transformOrigin: 'left center', boxShadow: '0 14px 30px -12px rgba(23,112,107,0.9)' }}>
              <span style={{ width: 16, height: 16, borderRadius: 8, background: W.putih }} />
              Tersambung
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </Kamera>
  );
};
