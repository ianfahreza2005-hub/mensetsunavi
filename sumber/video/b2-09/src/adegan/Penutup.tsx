import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Kamera, Kata, Navi, IkonCentang, Latar, SapuanLingkaran } from '../komponen';
import { UNSUR, TEKS_LAIN } from '../naskah';
import { F, W, ip, pegas, MASUK_KELUAR, acak } from '../tema';

// Adegan 6 · Ringkasan + kartu akhir. "sebelum jadwal." berganti tebal & merah sambil memantul (gaya "come alive" referensi).
export const T_HIDUP = 64;
export const T_AKHIR = 236;   // kartu akhir gelap mulai

export const Penutup: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hidup = pegas(f, fps, T_HIDUP, { damping: 9, stiffness: 210 });
  const navi = pegas(f, fps, 120, { damping: 13, stiffness: 160 });

  return (
    <AbsoluteFill>
      <Kamera dur={dur} dari={1.0} ke={1.04}>
        <AbsoluteFill>
          <div style={{ position: 'absolute', top: 250, width: '100%', display: 'flex', justifyContent: 'center', gap: 28, fontFamily: F.judul, fontWeight: 700, fontSize: 104, letterSpacing: '-0.025em', color: W.shikkoku }}>
            <Kata t="Kabari" mulai={6} />
            <Kata t="perusahaan" mulai={12} />
          </div>
          <div style={{ position: 'absolute', top: 384, width: '100%', display: 'flex', justifyContent: 'center', fontFamily: F.judul, fontSize: 104, letterSpacing: '-0.025em' }}>
            <Kata
              t={
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  {/* abu-abu tipis → merah tebal, sedikit membesar lalu memantul */}
                  <span style={{ fontWeight: 600, color: '#A3A7B3', opacity: 1 - Math.min(1, hidup * 1.4) }}>sebelum jadwal.</span>
                  <span style={{ position: 'absolute', left: '50%', top: 0, translate: '-50% 0', whiteSpace: 'nowrap', fontWeight: 800, color: W.akane, opacity: Math.min(1, hidup * 1.4), scale: `${0.9 + 0.1 * hidup}`, rotate: `${(1 - hidup) * -3}deg` }}>
                    sebelum jadwal.
                  </span>
                </span>
              }
              mulai={20}
            />
          </div>
          {/* bintang kecil saat kata berubah */}
          {Array.from({ length: 7 }).map((_, i) => {
            const u = ip(f, T_HIDUP + 2, T_HIDUP + 40, 0, 1);
            const a = -Math.PI * (0.15 + acak(i + 5) * 0.7);
            const r = 260 + acak(i + 11) * 220;
            return <div key={i} style={{ position: 'absolute', left: 960 + Math.cos(a) * r * u - 7, top: 450 + Math.sin(a) * r * 0.5 * u - 7, width: 14, height: 14, rotate: '45deg', background: i % 2 ? W.akane : W.emas, opacity: u > 0 && u < 1 ? Math.sin(u * Math.PI) : 0 }} />;
          })}

          {/* lima unsur */}
          <div style={{ position: 'absolute', top: 600, width: '100%', display: 'flex', justifyContent: 'center', gap: 16 }}>
            {UNSUR.map((u, j) => {
              const p = pegas(f, fps, 84 + j * 7, { damping: 12, stiffness: 200 });
              return (
                <span key={u.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 22px 12px 14px', borderRadius: 999, background: u.warna, color: W.putih, fontFamily: F.isi, fontWeight: 700, fontSize: 28, scale: `${p}`, opacity: Math.min(1, p * 1.5), boxShadow: `0 16px 28px -16px ${u.warna}` }}>
                  <span style={{ width: 30, height: 30, borderRadius: 15, display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,0.22)' }}>
                    <IkonCentang ukuran={22} warna={W.putih} p={ip(f, 88 + j * 7, 104 + j * 7, 0, 1)} />
                  </span>
                  {u.label}
                </span>
              );
            })}
          </div>
          <div style={{ position: 'absolute', top: 730, width: '100%', display: 'flex', justifyContent: 'center', gap: 13, fontFamily: F.isi, fontWeight: 600, fontSize: 42, color: W.tinta2 }}>
            {'Cara kamu mengabari sudah menjadi bagian dari penilaian.'.split(' ').map((w, i) => <Kata key={i} t={w} mulai={124 + i * 4} dari={24} />)}
          </div>
          <div style={{ position: 'absolute', right: 70, bottom: -30, translate: `0 ${(1 - navi) * 400}px`, rotate: `${(1 - navi) * 10 - 3}deg`, opacity: ip(f, 120, 130, 0, 1) }}>
            <Navi pose="pose_jempol" tinggi={420} style={{ filter: 'drop-shadow(0 24px 30px rgba(14,42,71,0.3))' }} />
          </div>
        </AbsoluteFill>
      </Kamera>

      {/* kartu akhir */}
      {f >= T_AKHIR ? (
        <AbsoluteFill>
          <SapuanLingkaranLokal mulai={T_AKHIR} />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

const SapuanLingkaranLokal: React.FC<{ mulai: number }> = ({ mulai }) => {
  const f = useCurrentFrame() - mulai;
  const { fps } = useVideoConfig();
  const logo = pegas(f, fps, 20, { damping: 14, stiffness: 160 });
  return (
    <SapuanLingkaranGeser geser={mulai}>
      <Latar gelap />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontFamily: F.jp, fontWeight: 900, fontSize: 64, color: W.seihekiTerang, letterSpacing: '0.12em', opacity: ip(f, 18, 34, 0, 1), translate: `0 ${ip(f, 18, 44, 24, 0)}px` }}>{TEKS_LAIN.merek}</div>
        <div style={{ fontFamily: F.judul, fontWeight: 700, fontSize: 112, color: W.putih, letterSpacing: '-0.03em', scale: `${0.9 + 0.1 * logo}`, opacity: Math.min(1, logo * 1.4) }}>Mensetsu Navi</div>
        <div style={{ marginTop: 14, fontFamily: F.isi, fontWeight: 600, fontSize: 34, color: 'rgba(255,255,255,0.72)', opacity: ip(f, 40, 58, 0, 1) }}>Bab 2 · Hou-Ren-Sou</div>
      </AbsoluteFill>
      <div style={{ position: 'absolute', bottom: 60, width: '100%', textAlign: 'center', fontFamily: F.isi, fontWeight: 600, fontSize: 26, color: 'rgba(255,255,255,0.72)', opacity: ip(f, 50, 70, 0, 1) }}>{TEKS_LAIN.kredit}</div>
      <AbsoluteFill style={{ background: W.malam, opacity: ip(f, 112, 136, 0, 1, MASUK_KELUAR) }} />
    </SapuanLingkaranGeser>
  );
};

// SapuanLingkaran memakai frame lokal; di sini digeser agar mulai di T_AKHIR
const SapuanLingkaranGeser: React.FC<{ geser: number; children: React.ReactNode }> = ({ geser, children }) => {
  const f = useCurrentFrame() - geser;
  const r = ip(f, 0, 34, 0, 2350, MASUK_KELUAR);
  return <AbsoluteFill style={{ clipPath: `circle(${r}px at 960px 540px)` }}>{children}</AbsoluteFill>;
};

export const _tidakDipakai = SapuanLingkaran;
