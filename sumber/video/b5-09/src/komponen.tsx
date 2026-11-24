import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { F, W, ip, KELUAR, MASUK, MASUK_KELUAR, pegas, acak } from './tema';
import type { Ucapan } from './naskah';
import type { Suara } from './waktu';

/* ------------------------------------------------------------------ latar */
// Latar gelap (鉄紺) atau terang (月白): gradasi, grid halus yang bergeser pelan, garis ombak 波 yang mengalir.
export const Latar: React.FC<{ gelap: boolean }> = ({ gelap }) => {
  const f = useCurrentFrame();
  const grid = gelap ? 'rgba(255,255,255,0.055)' : 'rgba(14,42,71,0.06)';
  return (
    <AbsoluteFill
      style={{
        background: gelap
          ? `radial-gradient(110% 85% at 28% 18%, #17456F 0%, ${W.tetsukon} 52%, ${W.malam} 100%)`
          : `radial-gradient(110% 85% at 30% 15%, #FFFFFF 0%, ${W.geppaku} 58%, #E2DFE8 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${grid} 1.5px, transparent 1.5px)`,
          backgroundSize: '96px 96px',
          backgroundPosition: `${-f * 0.22}px ${-f * 0.12}px`,
          maskImage: 'radial-gradient(95% 80% at 50% 45%, #000 35%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(95% 80% at 50% 45%, #000 35%, transparent 100%)',
        }}
      />
      <Ombak gelap={gelap} />
    </AbsoluteFill>
  );
};

const Ombak: React.FC<{ gelap: boolean }> = ({ gelap }) => {
  const f = useCurrentFrame();
  const geser = (f * 0.7) % 320;
  const baris = [760, 820, 880, 940, 1000];
  const d = (y: number) => {
    let s = `M ${-320} ${y}`;
    for (let x = -320; x < 2240; x += 320) s += ` q 80 -24 160 0 t 160 0`;
    return s;
  };
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <g transform={`translate(${-geser} 0)`} fill="none" stroke={gelap ? '#FFFFFF' : W.tetsukon} strokeWidth={2} strokeLinecap="round">
        {baris.map((y, i) => (
          <path key={y} d={d(y)} opacity={(gelap ? 0.07 : 0.06) * (1 - i * 0.14)} />
        ))}
      </g>
    </svg>
  );
};

/* ------------------------------------------------------------------ teks kinetik */
// Satu kata/potongan: muncul naik dari bawah sambil menajam (blur → tajam); keluar naik sambil kabur.
export const Kata: React.FC<{
  t: React.ReactNode;
  mulai: number;
  keluar?: number;
  dari?: number;
  style?: React.CSSProperties;
}> = ({ t, mulai, keluar, dari = 38, style }) => {
  const f = useCurrentFrame();
  const k = keluar ?? 1e9;
  const o = ip(f, mulai, mulai + 14, 0, 1) * ip(f, k, k + 16, 1, 0, MASUK_KELUAR);
  const y = ip(f, mulai, mulai + 30, dari, 0) + ip(f, k, k + 18, 0, -26, MASUK);
  const b = ip(f, mulai, mulai + 22, 12, 0) + ip(f, k, k + 18, 0, 10, MASUK);
  return (
    <span style={{ display: 'inline-block', opacity: o, translate: `0 ${y}px`, filter: b > 0.05 ? `blur(${b}px)` : undefined, ...style }}>
      {t}
    </span>
  );
};

/** kalimat dipecah per kata, muncul bergiliran */
export const Kalimat: React.FC<{ teks: string; mulai: number; jarak?: number; keluar?: number; style?: React.CSSProperties; kataStyle?: (i: number, w: string) => React.CSSProperties | undefined }> = ({
  teks, mulai, jarak = 5, keluar, style, kataStyle,
}) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: '0.28em', ...style }}>
    {teks.split(' ').map((w, i) => (
      <Kata key={i} t={w} mulai={mulai + i * jarak} keluar={keluar != null ? keluar + i * 2 : undefined} style={kataStyle?.(i, w)} />
    ))}
  </div>
);

/** kotak sorot: latar berwarna menyapu dari kiri di belakang teks, warna teks ikut berganti */
export const Sorot: React.FC<{ mulai: number; warna: string; teksJadi?: string; children: React.ReactNode; style?: React.CSSProperties; radius?: number }> = ({
  mulai, warna, teksJadi, children, style, radius = 14,
}) => {
  const f = useCurrentFrame();
  const p = ip(f, mulai, mulai + 22, 0, 1);
  return (
    <span style={{ position: 'relative', display: 'inline-block', padding: '0 0.16em', ...style }}>
      <span style={{ position: 'absolute', inset: '0.04em 0', borderRadius: radius, background: warna, scale: `${p} 1`, transformOrigin: 'left center' }} />
      <span style={{ position: 'relative', color: teksJadi && p > 0.45 ? teksJadi : undefined }}>{children}</span>
    </span>
  );
};

/* ------------------------------------------------------------------ transisi */
// Sapuan lingkaran: adegan baru membuka dari satu titik, dengan cincin cahaya lembut di tepinya.
export const SapuanLingkaran: React.FC<{ x: number; y: number; dur?: number; warnaCincin?: string; children: React.ReactNode }> = ({
  x, y, dur = 34, warnaCincin = 'rgba(127,209,196,0.55)', children,
}) => {
  const f = useCurrentFrame();
  const r = ip(f, 0, dur, 0, 2350, MASUK_KELUAR);
  const cincin = ip(f, dur * 0.55, dur, 1, 0, MASUK_KELUAR);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `circle(${r}px at ${x}px ${y}px)` }}>{children}</AbsoluteFill>
      {cincin > 0.01 && r > 4 ? (
        <div
          style={{
            position: 'absolute', left: x - r - 30, top: y - r - 30, width: (r + 30) * 2, height: (r + 30) * 2, borderRadius: '50%',
            border: `60px solid ${warnaCincin}`, filter: 'blur(34px)', opacity: cincin,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

/** kamera: dorongan pelan (tidak pernah diam total) + getar opsional */
export const Kamera: React.FC<{ dur: number; dari?: number; ke?: number; getar?: [number, number][]; children: React.ReactNode }> = ({
  dur, dari = 1, ke = 1.04, getar = [], children,
}) => {
  const f = useCurrentFrame();
  const s = ip(f, 0, dur, dari, ke, (t) => t);
  let gx = 0, gy = 0;
  getar.forEach(([mulai, kuat]) => {
    const u = f - mulai;
    if (u >= 0 && u < 22) { const d = kuat * Math.exp(-u / 6); gx += (acak(f) - 0.5) * d; gy += (acak(f + 99) - 0.5) * d; }
  });
  return <AbsoluteFill style={{ scale: `${s}`, translate: `${gx}px ${gy}px` }}>{children}</AbsoluteFill>;
};

/* ------------------------------------------------------------------ ikon */
export const IkonCentang: React.FC<{ ukuran: number; warna: string; p?: number }> = ({ ukuran, warna, p = 1 }) => (
  <svg width={ukuran} height={ukuran} viewBox="0 0 24 24" fill="none" stroke={warna} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" strokeDasharray={22} strokeDashoffset={22 * (1 - p)} />
  </svg>
);
export const IkonSilang: React.FC<{ ukuran: number; warna: string }> = ({ ukuran, warna }) => (
  <svg width={ukuran} height={ukuran} viewBox="0 0 24 24" fill="none" stroke={warna} strokeWidth={3.2} strokeLinecap="round">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const IkonSampah: React.FC<{ ukuran: number; warna: string; tutup?: number }> = ({ ukuran, warna, tutup = 0 }) => (
  <svg width={ukuran} height={ukuran} viewBox="0 0 24 24" fill="none" stroke={warna} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <g transform={`rotate(${-tutup * 28} 5 6)`}><path d="M3.5 6h17M9 6V4.2c0-.7.5-1.2 1.2-1.2h3.6c.7 0 1.2.5 1.2 1.2V6" /></g>
    <path d="M5.5 6l1 13.2c.1 1 .9 1.8 1.9 1.8h7.2c1 0 1.8-.8 1.9-1.8L18.5 6M10 10.5v6.5M14 10.5v6.5" />
  </svg>
);
/* ------------------------------------------------------------------ Navi */
export const Navi: React.FC<{ pose: string; tinggi: number; style?: React.CSSProperties }> = ({ pose, tinggi, style }) => (
  <Img src={staticFile('img/' + pose + '.webp')} style={{ height: tinggi, width: 'auto', ...style }} />
);

/* ------------------------------------------------------------------ pil kecil */
export const Pil: React.FC<{ warna: string; teks?: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ warna, teks = '#fff', children, style }) => (
  <span
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 18px', borderRadius: 999, background: warna, color: teks,
      fontFamily: F.isi, fontWeight: 700, fontSize: 26, letterSpacing: '0.02em', whiteSpace: 'nowrap', ...style,
    }}
  >
    {children}
  </span>
);

/* ------------------------------------------------------------------ Navi berganti pose */
/** pudar silang antarpose + pantulan kecil saat pose baru masuk. jadwal: [frame mulai, pose], urut naik */
export const NaviGanti: React.FC<{ jadwal: [number, string][]; tinggi: number; lebar: number; style?: React.CSSProperties }> = ({ jadwal, tinggi, lebar, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: 'relative', width: lebar, height: tinggi, ...style }}>
      {jadwal.map(([t, pose], i) => {
        const masuk = i === 0 ? 1 : ip(f, t, t + 8, 0, 1, (x) => x);
        const berikut = jadwal[i + 1];
        const keluar = berikut ? ip(f, berikut[0], berikut[0] + 8, 0, 1, (x) => x) : 0;
        const o = masuk * (1 - keluar);
        if (o <= 0.001) return null;
        const pantul = i === 0 ? 0 : 1 - pegas(f, fps, t, { damping: 10, stiffness: 260 });
        return (
          <Img
            key={i}
            src={staticFile('img/' + pose + '.webp')}
            style={{ position: 'absolute', left: '50%', bottom: 0, height: tinggi, width: 'auto', translate: '-50% 0', opacity: o, scale: `${1 + 0.05 * pantul}`, transformOrigin: '50% 100%' }}
          />
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ pewawancara */
// Avatar datar pewawancara (lingkaran ungu, kepala + bahu berjas, dasi 茜). bicara (0–1) menggerakkan mulut dan cincin suara.
export const Pewawancara: React.FC<{ ukuran: number; bicara?: number }> = ({ ukuran, bicara = 0 }) => {
  const f = useCurrentFrame();
  const mulut = 1.4 + bicara * 5.5 * Math.abs(Math.sin(f / 2.6));
  return (
    <div style={{ position: 'relative', width: ukuran, height: ukuran }}>
      {[0, 1, 2].map((i) => {
        const r = ukuran / 2 + 16 + i * 24 + bicara * (8 + i * 9) * (0.6 + 0.4 * Math.sin(f / 4 + i * 2));
        return (
          <div key={i} style={{ position: 'absolute', left: ukuran / 2 - r, top: ukuran / 2 - r, width: r * 2, height: r * 2, borderRadius: '50%', border: `3px solid ${W.murasakiTerang}`, opacity: (0.55 - i * 0.16) * bicara }} />
        );
      })}
      <svg width={ukuran} height={ukuran} viewBox="0 0 200 200" style={{ position: 'absolute', inset: 0, filter: 'drop-shadow(0 24px 40px rgba(0,0,0,0.4))' }}>
        <defs>
          <radialGradient id="pw-latar" cx="34%" cy="26%" r="82%">
            <stop offset="0%" stopColor="#8A6BC6" />
            <stop offset="58%" stopColor={W.murasaki} />
            <stop offset="100%" stopColor={W.murasakiTua} />
          </radialGradient>
          <clipPath id="pw-klip"><circle cx="100" cy="100" r="100" /></clipPath>
        </defs>
        <circle cx="100" cy="100" r="100" fill="url(#pw-latar)" />
        <g clipPath="url(#pw-klip)">
          <path d="M14 214 C20 160 56 138 100 138 C144 138 180 160 186 214 Z" fill={W.tetsukon} />
          <path d="M83 139 L100 170 L117 139 Z" fill={W.putih} />
          <path d="M100 148 L93.5 158 L100 200 L106.5 158 Z" fill={W.akane} />
          <rect x="88" y="112" width="24" height="32" rx="10" fill="#E2C6B2" />
          <circle cx="100" cy="88" r="36" fill="#F1DCCB" />
          <path d="M63 88 C60 58 79 45 100 45 C123 45 141 58 137 90 C131 73 119 66 100 66 C83 66 69 73 63 88 Z" fill="#2B2235" />
          <circle cx="87" cy="93" r="3.4" fill="#2B2235" />
          <circle cx="113" cy="93" r="3.4" fill="#2B2235" />
          <ellipse cx="100" cy="108" rx="6" ry={mulut} fill="#7A3B3F" />
        </g>
      </svg>
    </div>
  );
};

/* ------------------------------------------------------------------ coretan (ucapan yang tidak tertangkap) */
// Baris "tulisan" bergelombang tanpa makna. Tiap kata = satu path (pathLength 1) yang tergambar berurutan sesuai p (0–1).
// rapat kecil = gelombang rapat (bicara cepat); getar = goyangan baris saat terburu-buru.
export const Coretan: React.FC<{ lebar: number; baris: number; rapat: number; amp: number; p: number; warna: string; seed: number; getar?: number; tebal?: number }> = ({
  lebar, baris, rapat, amp, p, warna, seed, getar = 0, tebal = 5,
}) => {
  const f = useCurrentFrame();
  const kata: { d: string; panjang: number; baris: number }[] = [];
  let n = seed * 31;
  for (let b = 0; b < baris; b++) {
    const batas = b === baris - 1 ? lebar * 0.58 : lebar;
    let x = 0;
    while (x < batas - 30) {
      const pj = Math.min(batas - x, 44 + acak(n++) * 110);
      const y0 = 22 + b * 40;
      let d = `M ${x} ${y0}`;
      let sisi = 1;
      for (let u = 0; u + rapat <= pj; u += rapat) {
        const a = amp * (0.55 + 0.45 * acak(n++));
        d += ` q ${rapat / 2} ${-a * sisi} ${rapat} 0`;
        sisi = -sisi;
      }
      kata.push({ d, panjang: pj, baris: b });
      x += pj + 16 + acak(n++) * 12;
    }
  }
  const total = kata.reduce((a, k) => a + k.panjang, 0);
  let jalan = 0;
  return (
    <svg width={lebar} height={baris * 40 + 8} style={{ overflow: 'visible', display: 'block' }}>
      {kata.map((k, i) => {
        const a = jalan / total;
        jalan += k.panjang;
        const b = jalan / total;
        const q = Math.max(0, Math.min(1, (p - a) / (b - a)));
        if (q <= 0) return null;
        const gy = getar ? Math.sin(f * 0.9 + k.baris * 1.7 + i) * getar : 0;
        return <path key={i} d={k.d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - q} fill="none" stroke={warna} strokeWidth={tebal} strokeLinecap="round" strokeLinejoin="round" transform={`translate(0 ${gy})`} />;
      })}
    </svg>
  );
};

/* ------------------------------------------------------------------ tanda tanya */
export const TandaTanya: React.FC<{ mulai: number; x: number; y: number; ukuran: number; warna?: string; keluar?: number; miring?: number }> = ({
  mulai, x, y, ukuran, warna = W.murasakiTerang, keluar, miring = -10,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < mulai) return null;
  const p = pegas(f, fps, mulai, { damping: 9, stiffness: 250 });
  const k = keluar ?? 1e9;
  const o = Math.min(1, p * 2) * ip(f, k, k + 14, 1, 0, MASUK);
  const goyang = Math.sin((f - mulai) / 8) * 7 * ip(f, mulai + 6, mulai + 26, 0, 1);
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, translate: '-50% -50%', fontFamily: F.jp, fontWeight: 900, fontSize: ukuran, lineHeight: 1, color: warna,
        scale: `${p}`, rotate: `${miring + goyang + (1 - p) * -40}deg`, opacity: o, textShadow: '0 12px 34px rgba(0,0,0,0.4)',
      }}
    >
      ？
    </div>
  );
};

/* ------------------------------------------------------------------ teks ucapan (Jepang + romaji) */
// Potongan teks Jepang dan romaji muncul tepat saat frasanya diucapkan. sorot: pita berwarna menyapu sepanjang ucapan + label.
export const TeksUcapan: React.FC<{
  u: Ucapan; s: Suara; ukuran: number; ukuranRo: number; warnaJp?: string; warnaRo?: string; jarakRo?: number;
  sorot?: { warna: string; label: string }; rata?: 'flex-start' | 'flex-end'; lebarMaks?: number;
}> = ({ u, s, ukuran, ukuranRo, warnaJp = W.shikkoku, warnaRo = W.murasaki, jarakRo = 16, sorot, rata = 'flex-start', lebarMaks }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fr = (p: number) => s.frasa[Math.min(p, s.frasa.length - 1)];
  const awal = fr(u.seg[0].p).mulai;
  const akhir = s.frasa[s.frasa.length - 1].selesai;
  const sapu = sorot ? ip(f, awal - 2, akhir, 0, 1, (t) => t) : 0;
  const tag = sorot ? pegas(f, fps, awal + 2, { damping: 12, stiffness: 230 }) : 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: rata }}>
      <div style={{ position: 'relative', display: 'inline-flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: rata, maxWidth: lebarMaks, padding: sorot ? '0 12px' : 0 }}>
        {sorot ? (
          <span style={{ position: 'absolute', left: 0, right: 0, top: 6, bottom: -4, background: sorot.warna + '26', borderBottom: `7px solid ${sorot.warna}`, borderRadius: '14px 14px 6px 6px', scale: `${sapu} 1`, transformOrigin: 'left center' }} />
        ) : null}
        {u.seg.map((g, i) => (
          <Kata key={i} t={g.t} mulai={fr(g.p).mulai - 4} dari={30} style={{ position: 'relative', fontFamily: F.jp, fontWeight: 700, fontSize: ukuran, lineHeight: 1.25, color: warnaJp, letterSpacing: '0.02em' }} />
        ))}
        {sorot ? (
          <span
            style={{
              position: 'absolute', left: 4, top: -ukuran * 0.64, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px 5px 10px', borderRadius: 999,
              background: sorot.warna, color: W.putih, fontFamily: F.isi, fontWeight: 800, fontSize: 22, whiteSpace: 'nowrap', scale: `${tag}`, transformOrigin: 'left bottom',
              boxShadow: `0 10px 20px -10px ${sorot.warna}`,
            }}
          >
            <IkonCentang ukuran={20} warna={W.putih} p={ip(f, awal + 8, awal + 20, 0, 1)} />
            {sorot.label}
          </span>
        ) : null}
      </div>
      <div style={{ marginTop: jarakRo, display: 'flex', flexWrap: 'wrap', justifyContent: rata, columnGap: ukuranRo * 0.34, rowGap: 4, fontFamily: F.isi, fontWeight: 600, fontSize: ukuranRo, lineHeight: 1.35 }}>
        {u.ro.map((r, j) => (
          <Kata key={j} t={r.t} mulai={fr(r.p).mulai - 2} dari={20} style={{ color: warnaRo }} />
        ))}
      </div>
    </div>
  );
};

/** seberapa "sedang bicara" (0–1) pada frame f, halus di tepi tiap frasa */
export const tingkatBicara = (f: number, daftar: Suara[]) => {
  let b = 0;
  daftar.forEach((s) => s.frasa.forEach((p) => { b = Math.max(b, Math.min(ip(f, p.mulai - 4, p.mulai + 2, 0, 1), ip(f, p.selesai - 2, p.selesai + 5, 1, 0))); }));
  return b;
};

/* ------------------------------------------------------------------ ikon kotak "Hindari" & langkah */
export const IkonPura: React.FC<{ ukuran: number; warna: string }> = ({ ukuran, warna }) => (
  <svg width={ukuran} height={ukuran} viewBox="0 0 24 24" fill="none" stroke={warna} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="13" r="8.2" />
    <path d="M7.4 11.8c.6-.9 1.8-.9 2.4 0M12.4 11.8c.6-.9 1.8-.9 2.4 0" />
    <path d="M7.6 15.1c1.8 2.1 4.9 2.1 6.8 0" />
    <path d="M19.8 2.6c1 1.4 1.7 2.5 1.7 3.3a1.7 1.7 0 0 1-3.4 0c0-.8.7-1.9 1.7-3.3z" fill={warna} stroke="none" />
  </svg>
);
export const IkonDiam: React.FC<{ ukuran: number; warna: string; f: number }> = ({ ukuran, warna, f }) => (
  <svg width={ukuran} height={ukuran} viewBox="0 0 24 24" fill="none" stroke={warna} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4.5h16A1.5 1.5 0 0 1 21.5 6v9A1.5 1.5 0 0 1 20 16.5h-9.5L6 20v-3.5H4A1.5 1.5 0 0 1 2.5 15V6A1.5 1.5 0 0 1 4 4.5z" />
    {[7.5, 12, 16.5].map((x, i) => (
      <circle key={x} cx={x} cy={10.5} r={1.3} fill={warna} stroke="none" opacity={0.25 + 0.75 * Math.max(0, Math.sin(f / 10 - i * 0.9))} />
    ))}
  </svg>
);
export const IkonTopik: React.FC<{ ukuran: number; warna: string }> = ({ ukuran, warna }) => (
  <svg width={ukuran} height={ukuran} viewBox="0 0 24 24" fill="none" stroke={warna} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18.5" cy="5.5" r="2.4" />
    <path d="M4 20L16.6 7.4" strokeDasharray="1.6 2.4" opacity={0.55} />
    <path d="M4 20C6 13 11.5 13.2 20.5 15.5" />
    <path d="M17.2 12.6l3.3 2.9-3.9 1.7" />
  </svg>
);
export const IkonSantai: React.FC<{ ukuran: number; warna: string }> = ({ ukuran, warna }) => (
  <svg width={ukuran} height={ukuran} viewBox="0 0 24 24" fill="none" stroke={warna} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 3.5h16A1.5 1.5 0 0 1 21.5 5v10A1.5 1.5 0 0 1 20 16.5h-9.5L6 20v-3.5H4A1.5 1.5 0 0 1 2.5 15V5A1.5 1.5 0 0 1 4 3.5z" />
    <text x="12" y="13.2" textAnchor="middle" fontFamily={F.jp} fontWeight={900} fontSize={8.2} fill={warna} stroke="none">え？</text>
  </svg>
);
export const IkonJeda: React.FC<{ ukuran: number; warna: string }> = ({ ukuran, warna }) => (
  <svg width={ukuran} height={ukuran} viewBox="0 0 24 24" fill={warna}>
    <rect x="6" y="5" width="4.2" height="14" rx="1.6" />
    <rect x="13.8" y="5" width="4.2" height="14" rx="1.6" />
  </svg>
);
export const IkonGelembung: React.FC<{ ukuran: number; warna: string }> = ({ ukuran, warna }) => (
  <svg width={ukuran} height={ukuran} viewBox="0 0 24 24" fill="none" stroke={warna} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 6h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-8l-4.5 3.5V16H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
    <path d="M7.5 11h6" strokeWidth={2.4} />
  </svg>
);

export { KELUAR, pegas, MASUK_KELUAR };
