import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Kamera, Kata, Navi, IkonCentang } from '../komponen';
import { KALIMAT, UNSUR, Unsur } from '../naskah';
import { DIALOG } from '../waktu';
import { F, W, ip, pegas, KELUAR, MASUK, MASUK_KELUAR, acak } from '../tema';

// Adegan 5 · Isi telepon. Teks Jepang + romaji muncul tepat saat frasanya diucapkan (waktu frasa VOICEVOX),
// bagian yang memuat unsur materi (nama, jadwal, alasan, perkiraan tiba, permintaan maaf) disorot dan dicentang di daftar bawah.
const PATAH_SETELAH = [1, 2, 2, -1];   // pindah baris setelah potongan ke-n (koma / jeda alami)
export const AKHIR_DIALOG = () => DIALOG[DIALOG.length - 1].selesai;

/** frame mulai/selesai potongan ke-s di baris i (ikut frasa suaranya) */
const waktuSeg = (i: number, s: number) => {
  const k = KALIMAT[i], d = DIALOG[i];
  const p = d.frasa[Math.min(k.seg[s].p, d.frasa.length - 1)];
  const pAkhir = s + 1 < k.seg.length ? d.frasa[Math.min(k.seg[s + 1].p, d.frasa.length - 1)].mulai : d.frasa[d.frasa.length - 1].selesai;
  return { mulai: p.mulai, selesai: Math.max(p.selesai, pAkhir) };
};

/** kapan setiap unsur pertama/berikutnya disebut */
export const PEMICU: { unsur: Unsur; frame: number }[] = [];
KALIMAT.forEach((k, i) => k.sorot.forEach((s) => PEMICU.push({ unsur: s.unsur, frame: waktuSeg(i, s.dari).mulai })));

const warnaUnsur = (u: Unsur) => UNSUR.find((x) => x.id === u)!.warna;
const labelUnsur = (u: Unsur) => UNSUR.find((x) => x.id === u)!.label;

export const Percakapan: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const akhir = AKHIR_DIALOG();
  const selesai = f >= akhir + 22;

  // seberapa "sedang bicara" (0–1), halus di tepi tiap frasa
  let bicara = 0;
  DIALOG.forEach((d) => d.frasa.forEach((p) => { bicara = Math.max(bicara, Math.min(ip(f, p.mulai - 4, p.mulai + 2, 0, 1), ip(f, p.selesai - 2, p.selesai + 5, 1, 0))); }));
  const kini = Math.max(0, DIALOG.findIndex((d, i) => f < (DIALOG[i + 1]?.mulai ?? 1e9)));
  const masukKartu = ip(f, 0, 40, 0, 1);
  const detik = 3 + Math.floor(Math.min(f, akhir + 22) / fps);
  const jempol = pegas(f, fps, akhir + 22, { damping: 12, stiffness: 180 });

  return (
    <Kamera dur={dur} dari={1.0} ke={1.025}>
      <AbsoluteFill>
        {/* kepala */}
        <div style={{ position: 'absolute', left: 120, top: 70, display: 'flex', alignItems: 'center', gap: 16, opacity: ip(f, 6, 26, 0, 1) }}>
          <span style={{ fontFamily: F.isi, fontWeight: 800, fontSize: 26, letterSpacing: '0.18em', color: W.seiheki }}>CONTOH TELEPON</span>
          <span style={{ fontFamily: F.jp, fontWeight: 700, fontSize: 30, color: W.seiheki }}>連絡</span>
        </div>
        <div style={{ position: 'absolute', right: 120, top: 68, display: 'flex', alignItems: 'center', gap: 16, opacity: ip(f, 10, 30, 0, 1) }}>
          <span style={{ fontFamily: F.isi, fontWeight: 700, fontSize: 26, color: W.tinta2 }}>Kalimat {kini + 1} / {DIALOG.length}</span>
          <span style={{ display: 'flex', gap: 8 }}>
            {DIALOG.map((d, i) => <span key={i} style={{ width: i === kini ? 34 : 12, height: 12, borderRadius: 6, background: i <= kini ? W.seiheki : W.garis }} />)}
          </span>
        </div>

        {/* kartu penelepon */}
        <div
          style={{
            position: 'absolute', left: 120, top: 150, width: 470, height: 720, borderRadius: 40, background: W.putih, overflow: 'hidden',
            boxShadow: '0 40px 80px -40px rgba(14,42,71,0.45), 0 0 0 1px rgba(20,23,31,0.05)', translate: `${(1 - masukKartu) * -80}px 0`, opacity: masukKartu,
          }}
        >
          <div style={{ position: 'absolute', left: 28, right: 28, top: 26, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 18px 8px 14px', borderRadius: 999, background: selesai ? W.geppaku : W.seihekiL, color: selesai ? W.tinta2 : W.seiheki, fontFamily: F.isi, fontWeight: 800, fontSize: 24 }}>
              <span style={{ width: 12, height: 12, borderRadius: 6, background: selesai ? W.tinta2 : W.seiheki, opacity: selesai ? 1 : 0.5 + 0.5 * Math.abs(Math.sin(f / 10)) }} />
              {selesai ? 'Selesai' : 'Tersambung'}
            </span>
            <span style={{ fontFamily: F.judul, fontWeight: 600, fontSize: 28, color: W.tinta2, fontVariantNumeric: 'tabular-nums' }}>00:{String(detik).padStart(2, '0')}</span>
          </div>
          {/* lingkaran + cincin suara */}
          {[0, 1, 2].map((i) => {
            const r = 168 + i * 34 + bicara * (10 + i * 8) * (0.6 + 0.4 * Math.sin(f / 5 + i));
            return <div key={i} style={{ position: 'absolute', left: 235 - r, top: 360 - r, width: r * 2, height: r * 2, borderRadius: '50%', border: `3px solid ${W.seiheki}`, opacity: (0.22 - i * 0.06) * (0.35 + 0.65 * bicara) }} />;
          })}
          <div style={{ position: 'absolute', left: 85, top: 210, width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle at 34% 28%, #3DB3A5 0%, ${W.seiheki} 55%, #0B4A55 100%)` }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center', height: 380, overflow: 'hidden', borderRadius: '0 0 150px 150px' }}>
            <div style={{ position: 'relative', opacity: 1 - Math.min(1, jempol * 1.4), translate: `0 ${bicara * -4}px` }}>
              <Navi pose="act_berbicara" tinggi={430} />
            </div>
            <div style={{ position: 'absolute', opacity: Math.min(1, jempol * 1.4), scale: `${0.9 + 0.1 * jempol}`, transformOrigin: '50% 100%' }}>
              <Navi pose="pose_jempol" tinggi={430} />
            </div>
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 538, textAlign: 'center' }}>
            <div style={{ fontFamily: F.judul, fontWeight: 700, fontSize: 40, color: W.shikkoku }}>Kamu</div>
            <div style={{ fontFamily: F.isi, fontWeight: 500, fontSize: 24, color: W.tinta2, marginTop: 4 }}>menelepon perusahaan</div>
          </div>
          {/* gelombang suara */}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 24, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 7, height: 52 }}>
            {Array.from({ length: 17 }).map((_, i) => {
              const h = 6 + bicara * (10 + 34 * Math.abs(Math.sin(f * 0.42 + i * 1.7)) * (0.4 + 0.6 * acak(i + Math.floor(f / 4))));
              return <span key={i} style={{ width: 8, height: h, borderRadius: 4, background: i % 4 === 0 ? W.seihekiTerang : W.seiheki, opacity: 0.35 + 0.65 * bicara }} />;
            })}
          </div>
        </div>

        {/* baris dialog */}
        {KALIMAT.map((k, i) => {
          const d = DIALOG[i];
          if (f < d.mulai - 2 || f > d.keluar + 26) return null;
          const keluar = ip(f, d.keluar, d.keluar + 22, 0, 1, MASUK_KELUAR);
          const masuk = ip(f, d.mulai, d.mulai + 18, 0, 1);
          // baris-baris teks Jepang (dipatah di jeda alami)
          const kelompok: number[][] = [[]];
          k.seg.forEach((_, s) => { kelompok[kelompok.length - 1].push(s); if (s === PATAH_SETELAH[i]) kelompok.push([]); });
          const artiMulai = d.selesai - 14;
          return (
            <div key={i} style={{ position: 'absolute', left: 690, top: 196, width: 1110, opacity: (1 - keluar) * masuk, translate: `0 ${keluar * -60 + (1 - masuk) * 30}px`, filter: keluar > 0.02 ? `blur(${keluar * 10}px)` : undefined }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 50, paddingTop: 50 }}>
                {kelompok.filter((g) => g.length).map((g, gi) => (
                  <div key={gi} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    {(() => {
                      // potongan berurutan dengan unsur yang sama digabung jadi satu rentang → satu kotak sorot utuh (tanpa sambungan)
                      const runs: { s: number[]; sr?: (typeof k.sorot)[number] }[] = [];
                      g.forEach((s) => {
                        const sr = k.sorot.find((x) => s >= x.dari && s <= x.sampai);
                        const akhirRun = runs[runs.length - 1];
                        if (sr && akhirRun && akhirRun.sr === sr) akhirRun.s.push(s); else runs.push({ s: [s], sr });
                      });
                      return runs.map((run, ri) => {
                        const sr = run.sr;
                        const warna = sr ? warnaUnsur(sr.unsur) : null;
                        const w0 = waktuSeg(i, run.s[0]), w1 = waktuSeg(i, run.s[run.s.length - 1]);
                        const sapu = ip(f, w0.mulai - 2, w1.selesai, 0, 1, (t) => t);
                        const pertama = sr && run.s[0] === sr.dari;
                        const tag = pertama ? pegas(f, fps, w0.mulai + 2, { damping: 12, stiffness: 230 }) : 0;
                        return (
                          <span key={ri} style={{ position: 'relative', display: 'inline-flex', alignItems: 'flex-end', padding: warna ? '0 10px' : 0 }}>
                            {warna ? (
                              <span style={{ position: 'absolute', left: 0, right: 0, top: 6, bottom: -4, background: warna + '26', borderBottom: `7px solid ${warna}`, borderRadius: '14px 14px 6px 6px', scale: `${sapu} 1`, transformOrigin: 'left center' }} />
                            ) : null}
                            {run.s.map((s) => (
                              <Kata key={s} t={k.seg[s].t} mulai={waktuSeg(i, s).mulai - 4} dari={30} style={{ position: 'relative', fontFamily: F.jp, fontWeight: 700, fontSize: 76, lineHeight: 1.25, color: W.shikkoku, letterSpacing: '0.02em' }} />
                            ))}
                            {pertama && sr ? (
                              <span style={{ position: 'absolute', left: 4, top: -50, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px 5px 10px', borderRadius: 999, background: warna!, color: W.putih, fontFamily: F.isi, fontWeight: 800, fontSize: 22, whiteSpace: 'nowrap', scale: `${tag}`, transformOrigin: 'left bottom', boxShadow: `0 10px 20px -10px ${warna}` }}>
                                <IkonCentang ukuran={20} warna={W.putih} p={ip(f, w0.mulai + 8, w0.mulai + 20, 0, 1)} />
                                {labelUnsur(sr.unsur)}
                              </span>
                            ) : null}
                          </span>
                        );
                      });
                    })()}
                  </div>
                ))}
              </div>
              {/* romaji */}
              <div style={{ marginTop: 34, display: 'flex', flexWrap: 'wrap', columnGap: 14, rowGap: 4, fontFamily: F.isi, fontWeight: 600, fontSize: 38, lineHeight: 1.35 }}>
                {k.ro.map((r, j) => {
                  const p = d.frasa[Math.min(r.p, d.frasa.length - 1)];
                  const segIdx = k.seg.findIndex((x) => x.p === r.p);
                  const sr = k.sorot.find((x) => segIdx >= x.dari && segIdx <= x.sampai);
                  return <Kata key={j} t={r.t} mulai={p.mulai - 2} dari={20} style={{ color: sr ? warnaUnsur(sr.unsur) : W.ai }} />;
                })}
              </div>
              {/* arti */}
              <div style={{ marginTop: 28, display: 'flex', gap: 20, alignItems: 'stretch', opacity: ip(f, artiMulai, artiMulai + 18, 0, 1), translate: `0 ${ip(f, artiMulai, artiMulai + 30, 22, 0)}px` }}>
                <span style={{ width: 7, borderRadius: 4, background: W.seiheki, flex: 'none', scale: `1 ${ip(f, artiMulai, artiMulai + 24, 0, 1)}`, transformOrigin: 'top' }} />
                <span style={{ fontFamily: F.isi, fontWeight: 500, fontSize: 40, lineHeight: 1.4, color: W.tinta2 }}>{k.arti}</span>
              </div>
            </div>
          );
        })}

        {/* daftar unsur yang disampaikan */}
        <div style={{ position: 'absolute', left: 120, right: 120, top: 920, display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: F.isi, fontWeight: 800, fontSize: 22, letterSpacing: '0.14em', color: W.tinta2, marginRight: 8, opacity: ip(f, 20, 40, 0, 1) }}>YANG DISAMPAIKAN</span>
          {UNSUR.map((u, j) => {
            const muncul = pegas(f, fps, 22 + j * 5, { damping: 14, stiffness: 180 });
            const pemicu = PEMICU.filter((p) => p.unsur === u.id).map((p) => p.frame);
            const pertama = pemicu.length ? pemicu[0] : 1e9;
            const aktif = f >= pertama;
            const pop = pegas(f, fps, pertama, { damping: 10, stiffness: 260 });
            let denyut = 0;
            pemicu.forEach((t) => { if (f >= t && f < t + 24) denyut = Math.max(denyut, Math.sin(((f - t) / 24) * Math.PI)); });
            return (
              <span
                key={u.id}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 22px 12px 14px', borderRadius: 999, fontFamily: F.isi, fontWeight: 700, fontSize: 26,
                  background: aktif ? u.warna : W.putih, color: aktif ? W.putih : W.tinta2, border: `2px solid ${aktif ? u.warna : W.garis}`,
                  scale: `${muncul * (1 + 0.08 * denyut)}`, opacity: Math.min(1, muncul * 1.5), boxShadow: aktif ? `0 14px 26px -14px ${u.warna}` : 'none',
                }}
              >
                <span style={{ width: 30, height: 30, borderRadius: 15, display: 'grid', placeItems: 'center', background: aktif ? 'rgba(255,255,255,0.22)' : W.geppaku, scale: `${aktif ? 0.7 + 0.3 * pop : 1}` }}>
                  {aktif ? <IkonCentang ukuran={22} warna={W.putih} p={ip(f, pertama + 2, pertama + 16, 0, 1)} /> : <span style={{ width: 10, height: 10, borderRadius: 5, background: u.warna, opacity: 0.45 }} />}
                </span>
                {u.label}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    </Kamera>
  );
};

export const kel = [KELUAR, MASUK];
