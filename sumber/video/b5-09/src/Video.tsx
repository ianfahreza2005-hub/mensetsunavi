import React from 'react';
import { AbsoluteFill, Sequence, staticFile } from 'remotion';
import { Audio } from '@remotion/media';
import { Latar, SapuanLingkaran } from './komponen';
import { Pembuka } from './adegan/Pembuka';
import { Hindari, T_KARTU, T_SILANG, T_SAMPAH, T_BUANG, T_TEPAT } from './adegan/Hindari';
import { Jujur, ORB_KAMU } from './adegan/Jujur';
import { Gugup, KARTU_BOLEH } from './adegan/Gugup';
import { Penutup, T_A, T_B, T_PUTUS, T_PESAN, T_HIDUP, T_AKHIR } from './adegan/Penutup';
import { ADEGAN, PEMBUKA, JUJUR_T, GUGUP_T, CELOTEH, TOTAL, Suara } from './waktu';
import { ip } from './tema';

const A = ADEGAN;

// efek suara: [frame global, berkas, volume]
const SFX: [number, string, number][] = [];
const s = (t: number, nama: string, v: number) => SFX.push([Math.round(t), nama, Math.min(1, v * 1.6)]);   // ×1,6: seimbang dengan suara dialog
// suara ucapan: [frame global, id]
const UCAPAN: [number, Suara][] = [];
// jendela peredam musik: [mulai, selesai] global (saat ada suara atau celoteh)
const REDAM: [number, number][] = [];

// 1 pembuka
{ const a = A.pembuka.mulai, T = PEMBUKA;
  s(a + 2, 'whoosh-pendek', 0.24); s(a + 6, 'pop', 0.3); s(a + 14, 'pop', 0.24);
  ([[T.c1, 'celoteh-cepat', CELOTEH.cepat], [T.c2, 'celoteh-cepat2', CELOTEH.cepat2], [T.c3, 'celoteh-pelan', CELOTEH.pelan]] as [number, string, number][]).forEach(([c, nama, len]) => {
    s(a + c, 'pop', 0.2); s(a + c + 4, nama, 0.5); REDAM.push([a + c + 4, a + c + 4 + len]);
  });
  s(a + T.k1, 'pop', 0.26); s(a + T.k2, 'pop', 0.26);
  s(a + T.q1, 'tanya', 0.45); s(a + T.q2, 'tanya', 0.45); s(a + T.q3, 'tanya', 0.55); s(a + T.q3 + 8, 'tanya', 0.3); s(a + T.q3 + 14, 'tanya', 0.24);
  s(a + T.judul, 'whoosh-pendek', 0.3); s(a + T.judul + 46, 'pop', 0.36);
  UCAPAN.push([a, T.t1], [a, T.t2]); }
// 2 hindari
{ const a = A.hindari.mulai;
  s(a + 6, 'pop', 0.28); s(a + 34, 'tik', 0.3);
  T_KARTU.forEach((t) => s(a + t + 12, 'jatuh', 0.48));
  T_SILANG.forEach((t) => s(a + t, 'stempel', 0.5));
  s(a + T_SAMPAH, 'pop', 0.4);
  T_BUANG.forEach((t) => s(a + t + 8, 'buang', 0.42));
  s(a + T_TEPAT + 12, 'jatuh', 0.4); s(a + T_TEPAT + 14, 'benar', 0.48); s(a + A.hindari.dur - 42, 'whoosh', 0.42); }
// 3 jujur
{ const a = A.jujur.mulai, T = JUJUR_T;
  s(a - 44, 'naik', 0.3); s(a + 18, 'pop', 0.28); s(a + 28, 'pop', 0.28); s(a + 38, 'pop', 0.28);
  s(a + 64, 'tik', 0.26); s(a + T.klik, 'tik', 0.42); s(a + T.kepala, 'whoosh-pendek', 0.28); s(a + T.kartu, 'pop', 0.3);
  s(a + T.j1.audio + 4, 'tik', 0.2); s(a + T.j2.audio + 4, 'tik', 0.2); s(a + T.arti, 'benar', 0.3);
  s(a + A.jujur.dur - 42, 'whoosh', 0.42);
  UCAPAN.push([a, T.j1], [a, T.j2]); }
// 4 gugup
{ const a = A.gugup.mulai, T = GUGUP_T;
  s(a + 8, 'pop', 0.3); s(a + 26, 'tik', 0.28);
  [16, 34, 52, 70, 88].forEach((t) => s(a + t, 'tik', 0.16));
  s(a + T.s1, 'pop', 0.42); s(a + T.s2, 'napas-tarik', 0.6); s(a + T.hembus, 'napas-hembus', 0.6); s(a + T.s3, 'pop', 0.36);
  s(a + T.boleh + 10, 'pop', 0.22); s(a + T.boleh + 26, 'pop', 0.3);
  s(a + A.gugup.dur - 42, 'whoosh', 0.4);
  REDAM.push([a + T.s2, a + T.hembus + 96]);
  UCAPAN.push([a, T.g1]); }
// 5 penutup
{ const a = A.penutup.mulai;
  s(a + 6, 'pop', 0.26); s(a + T_A, 'whoosh-pendek', 0.24); s(a + T_A + 10, 'tik', 0.28); s(a + T_B, 'whoosh-pendek', 0.24);
  s(a + T_PUTUS, 'benar', 0.4); s(a + T_PUTUS + 4, 'tik', 0.3); s(a + T_PESAN - 34, 'whoosh-pendek', 0.3);
  s(a + T_HIDUP, 'benar', 0.44); s(a + T_HIDUP + 34, 'pop', 0.3);
  s(a + T_AKHIR - 6, 'whoosh', 0.4); s(a + T_AKHIR + 20, 'pop', 0.3); }

UCAPAN.forEach(([a, u]) => REDAM.push([a + u.audio - 10, a + u.selesai + 6]));

// musik latar: masuk pelan, mengecil saat ada suara/celoteh/napas, hilang di akhir
const volMusik = (f: number) => {
  const dasar = ip(f, 0, 50, 0, 0.66, (t) => t) * ip(f, TOTAL - 100, TOTAL - 10, 1, 0, (t) => t);
  let redam = 0;
  REDAM.forEach(([m, x]) => { redam = Math.max(redam, Math.min(ip(f, m - 24, m, 0, 1, (t) => t), ip(f, x, x + 36, 1, 0, (t) => t))); });
  return dasar * (1 - 0.64 * redam);
};

export const Video: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#091C31' }}>
      {/* 1–2: latar gelap bersama */}
      <Sequence name="Latar gelap" durationInFrames={A.jujur.mulai + 40}>
        <Latar gelap />
      </Sequence>
      <Sequence name="1 Pembuka" from={A.pembuka.mulai} durationInFrames={A.pembuka.dur}>
        <Pembuka dur={A.pembuka.dur} />
      </Sequence>
      <Sequence name="2 Hindari" from={A.hindari.mulai} durationInFrames={A.hindari.dur}>
        <Hindari dur={A.hindari.dur} />
      </Sequence>
      {/* 3: terang, membuka dari kartu "Jujur dengan sopan." */}
      <Sequence name="3 Jujur" from={A.jujur.mulai} durationInFrames={A.jujur.dur}>
        <SapuanLingkaran x={960} y={540} warnaCincin="rgba(201,184,242,0.6)">
          <Latar gelap={false} />
          <Jujur dur={A.jujur.dur} />
        </SapuanLingkaran>
      </Sequence>
      {/* 4: gelap, membuka dari lingkaran Navi di kartu */}
      <Sequence name="4 Gugup" from={A.gugup.mulai} durationInFrames={A.gugup.dur}>
        <SapuanLingkaran x={ORB_KAMU.x} y={ORB_KAMU.y} warnaCincin="rgba(94,67,145,0.6)">
          <Latar gelap />
          <Gugup dur={A.gugup.dur} />
        </SapuanLingkaran>
      </Sequence>
      {/* 5: terang, membuka dari kartu kalimat pendek */}
      <Sequence name="5 Penutup" from={A.penutup.mulai} durationInFrames={A.penutup.dur}>
        <SapuanLingkaran x={KARTU_BOLEH.x} y={KARTU_BOLEH.y} warnaCincin="rgba(201,184,242,0.5)">
          <Latar gelap={false} />
          <Penutup dur={A.penutup.dur} />
        </SapuanLingkaran>
      </Sequence>

      {/* audio */}
      <Audio name="Musik" src={staticFile('sfx/musik.wav')} volume={volMusik} />
      {UCAPAN.map(([a, u]) => (
        <Audio key={u.id} name={'Suara ' + u.id} src={staticFile('audio/' + u.id + '.wav')} from={a + u.audio} />
      ))}
      {SFX.map(([t, nama, v], i) => (
        <Audio key={'s' + i} name={nama} src={staticFile('sfx/' + nama + '.wav')} from={Math.max(0, t)} volume={v} />
      ))}
    </AbsoluteFill>
  );
};
