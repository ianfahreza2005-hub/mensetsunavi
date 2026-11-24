import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Kamera, Kata, Sorot, IkonSampah, IkonCentang, IkonSilang } from '../komponen';
import { PILIHAN } from '../naskah';
import { F, W, ip, pegas, KELUAR, MASUK, MASUK_KELUAR, acak } from '../tema';

// Adegan 2 · Tiga pilihan Kasus 3 (B2-11). Dua yang keliru dibuang ke tempat sampah, yang tepat maju ke tengah.
export const T_KARTU = [46, 58, 70];
export const T_BUANG = [150, 186];
export const T_TEPAT = 228;
const Y_KARTU = [336, 478, 620];
const ROT_AKHIR = [-2.2, 1.6, -1.1];
const SAMPAH = { x: 960, y: 900 };
const WARNA_HASIL: Record<string, string> = { Salah: W.akane, 'Kurang tepat': '#B86E00', Tepat: W.seiheki };

export const Pilihan: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sampah = pegas(f, fps, 116, { damping: 11, stiffness: 210 }) * ip(f, T_TEPAT + 4, T_TEPAT + 22, 1, 0, MASUK);
  const tutup = Math.max(ip(f, 140, 150, 0, 1) * ip(f, 166, 174, 1, 0), ip(f, 176, 186, 0, 1) * ip(f, 202, 210, 1, 0));
  const gepeng = (a: number) => (f >= a && f < a + 20 ? 1 - 0.14 * Math.sin(((f - a) / 20) * Math.PI) * Math.exp(-(f - a) / 10) : 1);
  const skalaSampahY = gepeng(T_BUANG[0] + 24) * gepeng(T_BUANG[1] + 24);
  const judulKeluar = dur - 70;

  return (
    <Kamera dur={dur} dari={1.0} ke={1.035}>
      <AbsoluteFill>
        {/* judul */}
        <div style={{ position: 'absolute', top: 120, width: '100%', display: 'flex', justifyContent: 'center', gap: 24, fontFamily: F.judul, fontWeight: 700, fontSize: 84, color: W.putih, letterSpacing: '-0.02em' }}>
          {['Apa', 'yang', 'kamu'].map((w, i) => <Kata key={w} t={w} mulai={6 + i * 5} keluar={judulKeluar + i * 2} />)}
          <Kata t={<Sorot mulai={36} warna={W.seiheki}>lakukan?</Sorot>} mulai={21} keluar={judulKeluar + 6} />
        </div>

        {/* tempat sampah */}
        <div style={{ position: 'absolute', left: SAMPAH.x - 82, top: SAMPAH.y - 82, width: 164, height: 164, borderRadius: '50%', background: W.putih, display: 'grid', placeItems: 'center', scale: `${sampah} ${sampah * skalaSampahY}`, boxShadow: '0 22px 50px -18px rgba(0,0,0,0.55)' }}>
          <IkonSampah ukuran={84} warna={W.tetsukon} tutup={tutup} />
        </div>
        {/* percikan saat tempat sampah muncul */}
        {Array.from({ length: 8 }).map((_, i) => {
          const u = ip(f, 116, 140, 0, 1);
          const a = (i / 8) * Math.PI * 2 + 0.4;
          const r = 90 + u * 70;
          return <div key={i} style={{ position: 'absolute', left: SAMPAH.x + Math.cos(a) * r - 6, top: SAMPAH.y + Math.sin(a) * r - 6, width: 12, height: 12, borderRadius: 6, background: W.putih, opacity: u > 0 && u < 1 ? (1 - u) * 0.9 : 0, scale: `${1 - u * 0.6}` }} />;
        })}

        {/* kartu pilihan */}
        {PILIHAN.map((p, i) => {
          const jatuh = pegas(f, fps, T_KARTU[i], { damping: 15, stiffness: 120, mass: 1 });
          let x = 960, y = Y_KARTU[i] + (1 - jatuh) * -760, rot = ROT_AKHIR[i] + (1 - jatuh) * (i % 2 ? 16 : -14), skala = 1, op = Math.min(1, jatuh * 3);
          let tag = 0;
          if (!p.benar) {
            const tb = T_BUANG[i];
            tag = pegas(f, fps, tb - 18, { damping: 12, stiffness: 220 });
            const u = ip(f, tb, tb + 28, 0, 1, (t) => t);
            if (u > 0) {
              const ux = KELUAR(u), uy = MASUK(u);
              x = 960 + (SAMPAH.x - 960 + (i ? 120 : -120) * Math.sin(u * Math.PI)) * ux;
              y = Y_KARTU[i] + (SAMPAH.y - Y_KARTU[i]) * uy - Math.sin(u * Math.PI) * 120;
              skala = 1 - 0.88 * u;
              rot = ROT_AKHIR[i] + u * (i ? 38 : -32);
              op = 1 - ip(f, tb + 18, tb + 28, 0, 1);
            }
          } else {
            const maju = pegas(f, fps, T_TEPAT, { damping: 16, stiffness: 130 });
            tag = pegas(f, fps, T_TEPAT + 10, { damping: 11, stiffness: 220 });
            y = y + (540 - Y_KARTU[i]) * maju;
            rot = rot * (1 - maju);
            skala = 1 + 0.12 * maju + ip(f, dur - 40, dur, 0, 0.5, MASUK_KELUAR);
          }
          const sinar = p.benar ? ip(f, T_TEPAT + 6, T_TEPAT + 30, 0, 1) : 0;
          return (
            <div key={i} style={{ position: 'absolute', left: x - 650, top: y - 56, width: 1300, height: 112, rotate: `${rot}deg`, scale: `${skala}`, opacity: op }}>
              <div
                style={{
                  position: 'absolute', inset: 0, borderRadius: 28, background: W.putih, display: 'flex', alignItems: 'center', gap: 26, padding: '0 34px 0 26px',
                  boxShadow: `0 26px 50px -22px rgba(0,0,0,0.55), 0 0 0 ${6 * sinar}px ${W.seihekiTerang}, 0 0 ${60 * sinar}px rgba(127,209,196,${0.55 * sinar})`,
                }}
              >
                <span style={{ width: 62, height: 62, borderRadius: 20, flex: 'none', display: 'grid', placeItems: 'center', background: p.benar && sinar > 0.5 ? W.seiheki : W.geppaku, color: W.tetsukon, fontFamily: F.judul, fontWeight: 700, fontSize: 30 }}>
                  {p.benar && sinar > 0.5 ? <IkonCentang ukuran={38} warna={W.putih} p={ip(f, T_TEPAT + 14, T_TEPAT + 30, 0, 1)} /> : 'ABC'[i]}
                </span>
                <span style={{ flex: 1, fontFamily: F.isi, fontWeight: 600, fontSize: 38, color: W.shikkoku, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>{p.t}</span>
              </div>
              {/* label hasil */}
              <div
                style={{
                  position: 'absolute', right: -26, top: -30, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px 8px 12px', borderRadius: 999,
                  background: WARNA_HASIL[p.hasil], color: W.putih, fontFamily: F.isi, fontWeight: 800, fontSize: 26, scale: `${tag}`, rotate: `${(1 - tag) * 20 + 4}deg`,
                  boxShadow: '0 12px 26px -10px rgba(0,0,0,0.5)',
                }}
              >
                {p.benar ? <IkonCentang ukuran={26} warna={W.putih} /> : <IkonSilang ukuran={24} warna={W.putih} />}
                {p.hasil}
              </div>
            </div>
          );
        })}

        {/* bintik cahaya saat pilihan tepat menyala */}
        {Array.from({ length: 10 }).map((_, i) => {
          const u = ip(f, T_TEPAT + 8, T_TEPAT + 50, 0, 1);
          const a = acak(i + 3) * Math.PI * 2;
          const r = 380 + acak(i + 17) * 260;
          return <div key={i} style={{ position: 'absolute', left: 960 + Math.cos(a) * r * (0.6 + u * 0.4), top: 540 + Math.sin(a) * r * 0.45 * (0.6 + u * 0.4), width: 10, height: 10, borderRadius: 5, background: W.seihekiTerang, opacity: u > 0 && u < 1 ? Math.sin(u * Math.PI) * 0.9 : 0, boxShadow: `0 0 16px ${W.seihekiTerang}` }} />;
        })}
      </AbsoluteFill>
    </Kamera>
  );
};
