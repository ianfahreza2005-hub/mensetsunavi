import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { F, W, ip, KELUAR, MASUK, MASUK_KELUAR, pegas, acak } from './tema';

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
export const IkonTelepon: React.FC<{ ukuran: number; warna: string }> = ({ ukuran, warna }) => (
  <svg width={ukuran} height={ukuran} viewBox="0 0 24 24" fill={warna}>
    <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
  </svg>
);
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
export const IkonJam: React.FC<{ ukuran: number; warna: string; sudut: number }> = ({ ukuran, warna, sudut }) => (
  <svg width={ukuran} height={ukuran} viewBox="0 0 24 24" fill="none" stroke={warna} strokeWidth={2.2} strokeLinecap="round">
    <circle cx={12} cy={12} r={9.2} />
    <path d="M12 12V6.8" transform={`rotate(${sudut * 0.083} 12 12)`} />
    <path d="M12 12h4.2" transform={`rotate(${sudut} 12 12)`} />
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

export { KELUAR, pegas };
