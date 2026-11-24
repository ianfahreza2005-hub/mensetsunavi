import React from 'react';
import { AbsoluteFill, Sequence, staticFile, interpolate } from 'remotion';
import { Audio } from '@remotion/media';
import { Latar, SapuanLingkaran } from './komponen';
import { Pembuka } from './adegan/Pembuka';
import { Pilihan, T_KARTU, T_BUANG, T_TEPAT } from './adegan/Pilihan';
import { Renraku, KURSOR_AKHIR } from './adegan/Renraku';
import { Panggilan, ORB, T_DERING, T_ANGKAT } from './adegan/Panggilan';
import { Percakapan, PEMICU, AKHIR_DIALOG } from './adegan/Percakapan';
import { Penutup, T_HIDUP, T_AKHIR } from './adegan/Penutup';
import { ADEGAN, DIALOG, TOTAL } from './waktu';
import './tema';

const A = ADEGAN;

// efek suara: [frame global, berkas, volume]
const SFX: [number, string, number][] = [];
const s = (t: number, nama: string, v: number) => SFX.push([Math.round(t), nama, Math.min(1, v * 1.6)]);   // ×1,6: seimbang dengan suara dialog
// 1 pembuka
s(0, 'whoosh-pendek', 0.3); s(8, 'pop', 0.3); s(30, 'pop', 0.38); s(102, 'pop', 0.38); s(178, 'stempel', 0.62); s(A.pembuka.dur - 30, 'whoosh-pendek', 0.3);
// 2 pilihan
{ const a = A.pilihan.mulai;
  s(a + 6, 'pop', 0.28); s(a + 36, 'tik', 0.3);
  T_KARTU.forEach((t) => s(a + t + 12, 'jatuh', 0.5));
  s(a + 116, 'pop', 0.4); s(a + T_BUANG[0] - 18, 'pop', 0.3); s(a + T_BUANG[0] + 8, 'buang', 0.5);
  s(a + T_BUANG[1] - 18, 'pop', 0.3); s(a + T_BUANG[1] + 8, 'buang', 0.5);
  s(a + T_TEPAT + 8, 'benar', 0.5); s(a + A.pilihan.dur - 42, 'whoosh', 0.42); }
// 3 renraku
{ const a = A.renraku.mulai;
  s(a - 44, 'naik', 0.34); s(a + 20, 'pop', 0.32); s(a + 30, 'pop', 0.32); s(a + 100, 'tik', 0.4); s(a + 150, 'pop', 0.22); s(a + 196, 'tik', 0.36);
  s(a + A.renraku.dur - 42, 'whoosh', 0.42); }
// 4 panggilan
{ const a = A.panggilan.mulai;
  s(a + 8, 'pop', 0.34); s(a + T_DERING, 'dering', 0.55); s(a + T_ANGKAT, 'angkat', 0.5); s(a + A.panggilan.dur - 42, 'whoosh', 0.4); }
// 5 percakapan
{ const a = A.percakapan.mulai;
  PEMICU.forEach((p) => s(a + p.frame + 4, 'tik', 0.22));
  s(a + AKHIR_DIALOG() + 22, 'benar', 0.32); s(a + A.percakapan.dur - 40, 'whoosh-pendek', 0.34); }
// 6 penutup
{ const a = A.penutup.mulai;
  s(a + 8, 'pop', 0.26); s(a + T_HIDUP, 'benar', 0.42);
  [0, 1, 2, 3, 4].forEach((j) => s(a + 84 + j * 7, 'pop', 0.16));
  s(a + T_AKHIR - 6, 'whoosh', 0.4); s(a + T_AKHIR + 20, 'pop', 0.3); }

// musik latar: masuk pelan, mengecil saat dialog, hilang di akhir
const P = A.percakapan.mulai;
const D0 = P + DIALOG[0].audio - 24, D1 = P + AKHIR_DIALOG() + 16;
const volMusik = (f: number) =>
  interpolate(f, [0, 50, D0 - 30, D0, D1, D1 + 50, TOTAL - 90, TOTAL - 10], [0, 0.72, 0.72, 0.2, 0.2, 0.62, 0.62, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

export const Video: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#091C31' }}>
      {/* 1–2: latar gelap bersama */}
      <Sequence name="Latar gelap" durationInFrames={A.renraku.mulai + 40}>
        <Latar gelap />
      </Sequence>
      <Sequence name="1 Pembuka" from={A.pembuka.mulai} durationInFrames={A.pembuka.dur}>
        <Pembuka dur={A.pembuka.dur} />
      </Sequence>
      <Sequence name="2 Pilihan" from={A.pilihan.mulai} durationInFrames={A.pilihan.dur}>
        <Pilihan dur={A.pilihan.dur} />
      </Sequence>
      {/* 3: terang, membuka dari kartu yang tepat */}
      <Sequence name="3 Renraku" from={A.renraku.mulai} durationInFrames={A.renraku.dur}>
        <SapuanLingkaran x={960} y={540} warnaCincin="rgba(127,209,196,0.6)">
          <Latar gelap={false} />
          <Renraku dur={A.renraku.dur} />
        </SapuanLingkaran>
      </Sequence>
      {/* 4: gelap, membuka dari ujung kursor */}
      <Sequence name="4 Panggilan" from={A.panggilan.mulai} durationInFrames={A.panggilan.dur}>
        <SapuanLingkaran x={KURSOR_AKHIR.x - 120} y={KURSOR_AKHIR.y - 175} warnaCincin="rgba(23,112,107,0.55)">
          <Latar gelap />
          <Panggilan dur={A.panggilan.dur} />
        </SapuanLingkaran>
      </Sequence>
      {/* 5: terang, membuka dari orb telepon */}
      <Sequence name="5 Percakapan" from={A.percakapan.mulai} durationInFrames={A.percakapan.dur}>
        <SapuanLingkaran x={ORB.x} y={ORB.y} warnaCincin="rgba(127,209,196,0.6)">
          <Latar gelap={false} />
          <Percakapan dur={A.percakapan.dur} />
        </SapuanLingkaran>
      </Sequence>
      {/* 6: ringkasan, membuka dari daftar unsur */}
      <Sequence name="6 Penutup" from={A.penutup.mulai} durationInFrames={A.penutup.dur}>
        <SapuanLingkaran x={960} y={955} warnaCincin="rgba(127,209,196,0.45)">
          <Latar gelap={false} />
          <Penutup dur={A.penutup.dur} />
        </SapuanLingkaran>
      </Sequence>

      {/* audio */}
      <Audio name="Musik" src={staticFile('sfx/musik.wav')} volume={volMusik} />
      {DIALOG.map((d, i) => (
        <Audio key={'k' + i} name={'Suara ' + (i + 1)} src={staticFile('audio/k' + (i + 1) + '.wav')} from={P + d.audio} />
      ))}
      {SFX.map(([t, nama, v], i) => (
        <Audio key={'s' + i} name={nama} src={staticFile('sfx/' + nama + '.wav')} from={Math.max(0, t)} volume={v} />
      ))}
    </AbsoluteFill>
  );
};
