import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Kamera, Kata, Sorot, NaviGanti, TeksUcapan, tingkatBicara } from '../komponen';
import { JUJUR, ARTI_JUJUR } from '../naskah';
import { JUJUR_T as T } from '../waktu';
import { F, W, ip, KELUAR, MASUK_KELUAR, acak } from '../tema';

// Adegan 3 · Langkah bila tetap tidak paham setelah dua kali bertanya: jujur dengan sopan.
// Judul besar + kotak seleksi bergaris putus dan kursor "Navi" (gaya alat desain), lalu judul mengecil menjadi kepala adegan
// dan kalimatnya diucapkan. Bagian "sopan" (申し訳ありません) dan "jujur" (まだ分からない…) disorot sambil kata di kepala ikut menyala.
const KARTU = { x: 120, y: 200, w: 470, h: 720 };
export const ORB_KAMU = { x: KARTU.x + 235, y: KARTU.y + 300 };
const KOTAK = { x: 960 - 770, y: 300, w: 1540, h: 200 };
const SUARA = [T.j1, T.j2];
const WARNA = { Sopan: W.murasaki, Jujur: W.ai };

export const Jujur: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const naik = ip(f, T.kepala, T.kepala + 44, 0, 1, MASUK_KELUAR);
  const kotak = ip(f, 64, 88, 0, 1) * ip(f, T.kepala - 14, T.kepala + 4, 1, 0);
  const kx = ip(f, 56, T.klik, 1720, KOTAK.x + KOTAK.w - 40) + naik * -200;
  const ky = ip(f, 56, T.klik, 1010, KOTAK.y + KOTAK.h - 30, KELUAR) + naik * -260;
  const klik = f >= T.klik && f < T.klik + 12 ? 1 - 0.18 * Math.sin(((f - T.klik) / 12) * Math.PI) : 1;
  const isi = ip(f, T.klik + 2, T.klik + 18, 0, 1);
  const masukKartu = ip(f, T.kartu, T.kartu + 40, 0, 1);
  const bicara = tingkatBicara(f, SUARA);
  const selesai = f >= T.j2.selesai + 10;

  // judul: masuk membesar → mengecil ke atas menjadi kepala adegan
  const kataJudul = (t: React.ReactNode, m: number, key: string) => (
    <span key={key} style={{ display: 'inline-block', opacity: ip(f, m, m + 16, 0, 1), scale: `${ip(f, m, m + 34, 1.3, 1)}`, filter: `blur(${ip(f, m, m + 26, 16, 0)}px)`, translate: `0 ${ip(f, m, m + 34, 34, 0)}px` }}>{t}</span>
  );

  return (
    <Kamera dur={dur} dari={1.02} ke={1.0}>
      <AbsoluteFill>
        {/* kelompok judul + kotak seleksi */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, translate: `0 ${naik * -296}px`, scale: `${1 - naik * 0.58}`, transformOrigin: '960px 400px' }}>
          <div style={{ position: 'absolute', left: KOTAK.x, top: KOTAK.y, width: KOTAK.w, height: KOTAK.h, borderRadius: 14, background: W.murasaki, opacity: isi * 0.1 * (1 - naik) }} />
          <div style={{ position: 'absolute', top: 318, width: '100%', display: 'flex', justifyContent: 'center', gap: 36, fontFamily: F.judul, fontWeight: 800, fontSize: 124, lineHeight: 1.15, letterSpacing: '-0.03em', color: W.shikkoku }}>
            {kataJudul(<Sorot mulai={T.j2.audio + 2} warna={WARNA.Jujur} teksJadi={W.putih} radius={22}>Jujur</Sorot>, 18, 'a')}
            {kataJudul('dengan', 28, 'b')}
            {kataJudul(<Sorot mulai={T.j1.audio + 2} warna={WARNA.Sopan} teksJadi={W.putih} radius={22}>sopan.</Sorot>, 38, 'c')}
          </div>
          <div style={{ position: 'absolute', left: KOTAK.x, top: KOTAK.y, width: KOTAK.w, height: KOTAK.h, opacity: kotak, scale: `${0.95 + 0.05 * kotak}` }}>
            <svg width={KOTAK.w} height={KOTAK.h} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
              <rect x={1.5} y={1.5} width={KOTAK.w - 3} height={KOTAK.h - 3} rx={12} fill="none" stroke={W.murasaki} strokeWidth={3} strokeDasharray="14 10" strokeDashoffset={-f * 0.6} />
            </svg>
            {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([a, b], i) => (
              <div key={i} style={{ position: 'absolute', left: a * KOTAK.w - 10, top: b * KOTAK.h - 10, width: 20, height: 20, borderRadius: 5, background: W.putih, border: `3px solid ${W.murasaki}` }} />
            ))}
          </div>
          <div style={{ position: 'absolute', top: 560, width: '100%', display: 'flex', justifyContent: 'center', gap: 14, fontFamily: F.isi, fontWeight: 600, fontSize: 46, color: W.tinta2, opacity: 1 - ip(f, T.kepala - 12, T.kepala + 6, 0, 1) }}>
            {'Bila tetap tidak paham setelah dua kali bertanya.'.split(' ').map((w, i) => <Kata key={i} t={w} mulai={108 + i * 4} dari={24} />)}
          </div>
        </div>

        {/* kartu Kamu */}
        <div style={{ position: 'absolute', left: KARTU.x, top: KARTU.y, width: KARTU.w, height: KARTU.h, borderRadius: 40, background: W.putih, overflow: 'hidden', boxShadow: '0 40px 80px -40px rgba(14,42,71,0.45), 0 0 0 1px rgba(20,23,31,0.05)', translate: `${(1 - masukKartu) * -90}px 0`, opacity: masukKartu }}>
          <div style={{ position: 'absolute', left: 28, top: 26 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 18px 8px 14px', borderRadius: 999, background: W.murasakiL, color: W.murasaki, fontFamily: F.isi, fontWeight: 800, fontSize: 24 }}>
              <span style={{ width: 12, height: 12, borderRadius: 6, background: W.murasaki, opacity: selesai ? 1 : 0.5 + 0.5 * Math.abs(Math.sin(f / 10)) }} />
              Wawancara
            </span>
          </div>
          {[0, 1, 2].map((i) => {
            const r = 168 + i * 34 + bicara * (10 + i * 8) * (0.6 + 0.4 * Math.sin(f / 5 + i));
            return <div key={i} style={{ position: 'absolute', left: 235 - r, top: 300 - r, width: r * 2, height: r * 2, borderRadius: '50%', border: `3px solid ${W.murasaki}`, opacity: (0.2 - i * 0.05) * (0.35 + 0.65 * bicara) }} />;
          })}
          <div style={{ position: 'absolute', left: 85, top: 150, width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle at 34% 28%, #9579D0 0%, ${W.murasaki} 55%, ${W.murasakiTua} 100%)` }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 92, display: 'flex', justifyContent: 'center', height: 358, overflow: 'hidden', borderRadius: '0 0 150px 150px' }}>
            <NaviGanti lebar={300} tinggi={430} style={{ translate: `0 ${bicara * -4}px` }} jadwal={[[0, 'pose_menunduk'], [T.j2.audio - 6, 'act_berbicara']]} />
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 478, textAlign: 'center' }}>
            <div style={{ fontFamily: F.judul, fontWeight: 700, fontSize: 40, color: W.shikkoku }}>Kamu</div>
            <div style={{ fontFamily: F.isi, fontWeight: 500, fontSize: 24, color: W.tinta2, marginTop: 4 }}>di ruang wawancara</div>
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 7, height: 52 }}>
            {Array.from({ length: 17 }).map((_, i) => {
              const h = 6 + bicara * (10 + 34 * Math.abs(Math.sin(f * 0.42 + i * 1.7)) * (0.4 + 0.6 * acak(i + Math.floor(f / 4))));
              return <span key={i} style={{ width: 8, height: h, borderRadius: 4, background: i % 4 === 0 ? W.murasakiTerang : W.murasaki, opacity: 0.35 + 0.65 * bicara }} />;
            })}
          </div>
        </div>

        {/* kalimat: 申し訳ありません。/ まだ分からないところがあります。 */}
        {JUJUR.map((u, i) => {
          const s = SUARA[i];
          const masuk = ip(f, s.audio - 12, s.audio + 6, 0, 1);
          return (
            <div key={u.id} style={{ position: 'absolute', left: 660, top: i === 0 ? 300 : 536, width: 1220, opacity: masuk, translate: `0 ${(1 - masuk) * 26}px` }}>
              <TeksUcapan u={u} s={s} ukuran={68} ukuranRo={40} jarakRo={14} sorot={{ warna: WARNA[u.sifat], label: u.sifat }} />
            </div>
          );
        })}
        <div style={{ position: 'absolute', left: 676, top: 772, width: 1120, display: 'flex', gap: 20, alignItems: 'stretch', opacity: ip(f, T.arti, T.arti + 18, 0, 1), translate: `0 ${ip(f, T.arti, T.arti + 30, 22, 0)}px` }}>
          <span style={{ width: 7, borderRadius: 4, background: W.murasaki, flex: 'none', scale: `1 ${ip(f, T.arti, T.arti + 24, 0, 1)}`, transformOrigin: 'top' }} />
          <span style={{ fontFamily: F.isi, fontWeight: 500, fontSize: 42, lineHeight: 1.4, color: W.tinta2 }}>{ARTI_JUJUR}</span>
        </div>

        {/* kursor Navi */}
        <div style={{ position: 'absolute', left: kx, top: ky, opacity: ip(f, 56, 66, 0, 1) * ip(f, T.kepala - 16, T.kepala, 1, 0, MASUK_KELUAR), scale: `${klik}`, transformOrigin: '0 0' }}>
          <svg width={46} height={54} viewBox="0 0 23 27" style={{ filter: 'drop-shadow(0 6px 10px rgba(14,42,71,0.3))' }}>
            <path d="M2 2l18 9.5-7.8 2.2-3.8 7.6z" fill={W.murasaki} stroke={W.putih} strokeWidth={2} strokeLinejoin="round" />
          </svg>
          <div style={{ position: 'absolute', left: 34, top: 40, padding: '6px 14px', borderRadius: 10, background: W.murasaki, color: W.putih, fontFamily: F.isi, fontWeight: 700, fontSize: 24, whiteSpace: 'nowrap' }}>Navi</div>
        </div>
      </AbsoluteFill>
    </Kamera>
  );
};

