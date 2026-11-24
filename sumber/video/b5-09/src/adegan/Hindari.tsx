import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Kamera, Kata, Sorot, IkonSampah, IkonCentang, IkonSilang, IkonPura, IkonDiam, IkonTopik, IkonSantai } from '../komponen';
import { HINDARI, Hindari as TipeHindari } from '../naskah';
import { F, W, ip, pegas, KELUAR, MASUK, MASUK_KELUAR, acak } from '../tema';

// Adegan 2 · Kotak "Hindari" (B5-09): empat kartu jatuh, dicap ✕ satu per satu, lalu dibuang ke tempat sampah.
// Setelah itu kartu langkah yang benar ("Jujur dengan sopan.") turun ke tengah dan menjadi titik awal sapuan adegan 3.
export const T_KARTU = [40, 50, 60, 70];
export const T_SILANG = [118, 138, 158, 178];
export const T_SAMPAH = 198;
export const T_BUANG = [216, 230, 244, 258];
export const T_TEPAT = 312;
const KARTU = [
  { x: 545, y: 420, rot: -1.6 },
  { x: 1375, y: 420, rot: 1.2 },
  { x: 545, y: 652, rot: 1.4 },
  { x: 1375, y: 652, rot: -1.0 },
];
const LEBAR = 780, TINGGI = 196;
const SAMPAH = { x: 960, y: 934 };

const Ikon: React.FC<{ jenis: TipeHindari['ikon']; f: number }> = ({ jenis, f }) => {
  const u = 62, w = W.akane;
  if (jenis === 'paham') return <IkonPura ukuran={u} warna={w} />;
  if (jenis === 'diam') return <IkonDiam ukuran={u} warna={w} f={f} />;
  if (jenis === 'topik') return <IkonTopik ukuran={u} warna={w} />;
  return <IkonSantai ukuran={u} warna={w} />;
};

export const Hindari: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const judulKeluar = 286;
  const sampah = pegas(f, fps, T_SAMPAH, { damping: 11, stiffness: 210 }) * ip(f, 300, 318, 1, 0, MASUK);
  // tutup tempat sampah membuka setiap ada kartu datang
  let tutup = 0;
  T_BUANG.forEach((t) => { tutup = Math.max(tutup, ip(f, t - 10, t, 0, 1) * ip(f, t + 20, t + 28, 1, 0)); });
  const gepeng = (a: number) => (f >= a && f < a + 20 ? 1 - 0.13 * Math.sin(((f - a) / 20) * Math.PI) * Math.exp(-(f - a) / 10) : 1);
  const skalaSampahY = T_BUANG.reduce((acc, t) => acc * gepeng(t + 24), 1);

  return (
    <Kamera dur={dur} dari={1.0} ke={1.035} getar={T_SILANG.map((t) => [t, 7] as [number, number])}>
      <AbsoluteFill>
        {/* judul */}
        <div style={{ position: 'absolute', top: 120, width: '100%', display: 'flex', justifyContent: 'center', gap: 24, fontFamily: F.judul, fontWeight: 700, fontSize: 80, color: W.putih, letterSpacing: '-0.02em' }}>
          {['Yang', 'perlu', 'kamu'].map((w, i) => <Kata key={w} t={w} mulai={6 + i * 5} keluar={judulKeluar + i * 2} />)}
          <Kata t={<Sorot mulai={34} warna={W.akane} teksJadi={W.putih}>hindari</Sorot>} mulai={21} keluar={judulKeluar + 6} />
        </div>

        {/* tempat sampah */}
        <div style={{ position: 'absolute', left: SAMPAH.x - 82, top: SAMPAH.y - 82, width: 164, height: 164, borderRadius: '50%', background: W.putih, display: 'grid', placeItems: 'center', scale: `${sampah} ${sampah * skalaSampahY}`, boxShadow: '0 22px 50px -18px rgba(0,0,0,0.55)' }}>
          <IkonSampah ukuran={84} warna={W.tetsukon} tutup={tutup} />
        </div>
        {Array.from({ length: 8 }).map((_, i) => {
          const u = ip(f, T_SAMPAH, T_SAMPAH + 24, 0, 1);
          const a = (i / 8) * Math.PI * 2 + 0.4;
          const r = 90 + u * 70;
          return <div key={i} style={{ position: 'absolute', left: SAMPAH.x + Math.cos(a) * r - 6, top: SAMPAH.y + Math.sin(a) * r - 6, width: 12, height: 12, borderRadius: 6, background: W.putih, opacity: u > 0 && u < 1 ? (1 - u) * 0.9 : 0, scale: `${1 - u * 0.6}` }} />;
        })}

        {/* empat kartu "Hindari" */}
        {HINDARI.map((h, i) => {
          const k = KARTU[i];
          const jatuh = pegas(f, fps, T_KARTU[i], { damping: 15, stiffness: 120, mass: 1 });
          let x = k.x, y = k.y + (1 - jatuh) * -900, rot = k.rot + (1 - jatuh) * (i % 2 ? 16 : -14), skala = 1, op = Math.min(1, jatuh * 3);
          const ts = T_SILANG[i];
          const cap = pegas(f, fps, ts, { damping: 10, stiffness: 300, mass: 0.7 });
          const goyang = f >= ts && f < ts + 24 ? Math.sin((f - ts) * 1.4) * 12 * Math.exp(-(f - ts) / 6) : 0;
          x += goyang;
          const coret = ip(f, ts + 2, ts + 14, 0, 1);
          const redup = ip(f, ts + 2, ts + 14, 0, 1);
          const tb = T_BUANG[i];
          const u = ip(f, tb, tb + 28, 0, 1, (t) => t);
          if (u > 0) {
            const ux = KELUAR(u), uy = MASUK(u);
            x = k.x + (SAMPAH.x - k.x) * ux;
            y = k.y + (SAMPAH.y - k.y) * uy - Math.sin(u * Math.PI) * (k.y < 500 ? 46 : 130);
            skala = 1 - 0.9 * u;
            rot = k.rot + u * (k.x < 960 ? -34 : 34);
            op = 1 - ip(f, tb + 18, tb + 28, 0, 1);
          }
          if (op <= 0) return null;
          return (
            <div key={i} style={{ position: 'absolute', left: x - LEBAR / 2, top: y - TINGGI / 2, width: LEBAR, height: TINGGI, rotate: `${rot}deg`, scale: `${skala}`, opacity: op, zIndex: u > 0 ? 10 + i : i }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 30, background: W.putih, display: 'flex', alignItems: 'center', gap: 28, padding: '0 34px 0 30px', boxShadow: '0 26px 50px -22px rgba(0,0,0,0.55)' }}>
                <span style={{ width: 108, height: 108, borderRadius: 30, flex: 'none', display: 'grid', placeItems: 'center', background: W.akaneL, opacity: 1 - redup * 0.35 }}>
                  <Ikon jenis={h.ikon} f={f} />
                </span>
                <div style={{ flex: 1, minWidth: 0, opacity: 1 - redup * 0.4 }}>
                  <div style={{ position: 'relative', display: 'inline-block', fontFamily: F.judul, fontWeight: 700, fontSize: 42, lineHeight: 1.2, color: W.shikkoku, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
                    {h.judul}
                    <span style={{ position: 'absolute', left: -4, right: -4, top: '54%', height: 5, borderRadius: 3, background: W.akane, scale: `${coret} 1`, transformOrigin: 'left center' }} />
                  </div>
                  {h.jp ? (
                    <>
                      <div style={{ marginTop: 6, fontFamily: F.jp, fontWeight: 700, fontSize: 32, lineHeight: 1.3, color: W.shikkoku }}>{h.jp}</div>
                      <div style={{ marginTop: 2, fontFamily: F.isi, fontWeight: 600, fontSize: 24, lineHeight: 1.35, color: W.tinta2, whiteSpace: 'nowrap' }}>
                        {h.ro} <span style={{ color: '#9AA0AE' }}>·</span> “{h.arti}”
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
              {/* cap ✕ */}
              {f >= ts ? (
                <div style={{ position: 'absolute', right: -26, top: -26, width: 84, height: 84, borderRadius: '50%', background: W.akane, display: 'grid', placeItems: 'center', scale: `${2.4 - 1.4 * cap}`, opacity: ip(f, ts, ts + 4, 0, 1), rotate: `${-14 + (1 - cap) * 20}deg`, boxShadow: '0 14px 30px -10px rgba(179,40,47,0.9), 0 0 0 6px rgba(255,255,255,0.9)' }}>
                  <IkonSilang ukuran={44} warna={W.putih} />
                </div>
              ) : null}
            </div>
          );
        })}

        {/* langkah yang benar */}
        {(() => {
          const turun = pegas(f, fps, T_TEPAT, { damping: 14, stiffness: 120, mass: 1 });
          const sinar = ip(f, T_TEPAT + 10, T_TEPAT + 32, 0, 1);
          const besar = ip(f, dur - 44, dur, 0, 0.5, MASUK_KELUAR);
          if (f < T_TEPAT) return null;
          return (
            <div style={{ position: 'absolute', left: 960 - 500, top: 540 - 86 + (1 - turun) * -760, width: 1000, height: 172, rotate: `${(1 - turun) * -10}deg`, scale: `${1 + 0.1 * sinar + besar}` }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 34, background: W.putih, display: 'flex', alignItems: 'center', gap: 30, padding: '0 40px 0 30px', boxShadow: `0 30px 60px -24px rgba(0,0,0,0.6), 0 0 0 ${6 * sinar}px ${W.seihekiTerang}, 0 0 ${70 * sinar}px rgba(127,209,196,${0.55 * sinar})` }}>
                <span style={{ width: 112, height: 112, borderRadius: 32, flex: 'none', display: 'grid', placeItems: 'center', background: sinar > 0.4 ? W.seiheki : W.geppaku }}>
                  <IkonCentang ukuran={64} warna={sinar > 0.4 ? W.putih : W.tinta2} p={ip(f, T_TEPAT + 16, T_TEPAT + 32, 0, 1)} />
                </span>
                <div>
                  <div style={{ fontFamily: F.isi, fontWeight: 700, fontSize: 26, color: W.seiheki, letterSpacing: '0.04em' }}>Bila tetap tidak paham</div>
                  <div style={{ fontFamily: F.judul, fontWeight: 700, fontSize: 62, lineHeight: 1.15, color: W.shikkoku, letterSpacing: '-0.02em' }}>Jujur dengan sopan.</div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* bintik cahaya saat langkah yang benar menyala */}
        {Array.from({ length: 10 }).map((_, i) => {
          const u = ip(f, T_TEPAT + 10, T_TEPAT + 52, 0, 1);
          const a = acak(i + 3) * Math.PI * 2;
          const r = 400 + acak(i + 17) * 260;
          return <div key={i} style={{ position: 'absolute', left: 960 + Math.cos(a) * r * (0.6 + u * 0.4), top: 540 + Math.sin(a) * r * 0.45 * (0.6 + u * 0.4), width: 10, height: 10, borderRadius: 5, background: W.seihekiTerang, opacity: u > 0 && u < 1 ? Math.sin(u * Math.PI) * 0.9 : 0, boxShadow: `0 0 16px ${W.seihekiTerang}` }} />;
        })}
      </AbsoluteFill>
    </Kamera>
  );
};
