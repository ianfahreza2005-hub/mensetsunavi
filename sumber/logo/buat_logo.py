"""Buat logo SVG Mensetsu Navi dari gambar asli di sumber/logo/asli/ (hasil generator gambar, latar polos).

Jalankan dari akar repo:  python3 sumber/logo/buat_logo.py
Perlu: potrace (apt install potrace), numpy, Pillow.

Cara kerja
1. Tiap piksel gambar asli diurai menjadi campuran tiga warna: latar, seni utama (putih atau navy), dan merah.
2. Peta porsi seni dan porsi merah diperbesar 4x, dipotong di 0,5, lalu di-trace dengan potrace menjadi path.
3. Emblem versi gelap diambil dari mendatar-gelap.jpg, emblem versi terang dari mendatar-terang.jpg,
   tulisan (MENSETSU / NAVI / 面接ナビ) dari mendatar-gelap.jpg. Semua tata letak memakai potongan yang sama.
4. Emblem diberi alas (lingkaran + cap) warna latarnya sendiri, supaya tetap utuh di latar apa pun.

Hasil (assets/logo/):
  logo-tegak-{putih,navy}.svg     emblem di atas, tulisan di bawah (tata letak versi persegi)
  logo-mendatar-{putih,navy}.svg  emblem di kiri, tulisan di kanan
  logo-ringkas-{putih,navy}.svg   mendatar untuk ukuran kecil (tulisan setinggi emblem), dipakai di appbar & rak
  logo-emblem-{putih,navy}.svg    emblem saja
"putih" = seni putih untuk latar gelap, "navy" = seni navy untuk latar terang.
"""
import os
import re
import subprocess
import tempfile

import numpy as np
from PIL import Image

AKAR = os.path.dirname(os.path.abspath(__file__))
ASLI = os.path.join(AKAR, 'asli')
KELUAR = os.path.join(AKAR, '..', '..', 'assets', 'logo')

PUTIH, NAVY, MERAH = '#FFFFFF', '#0E2A47', '#B3282F'   # palet aplikasi: 鉄紺 dan 茜
SKALA = 4                                                # pembesaran sebelum trace


def urai(path):
    """Kembalikan (porsi seni, porsi merah) per piksel, masing-masing 0..1."""
    a = np.asarray(Image.open(path).convert('RGB')).astype(float)
    tepi = np.concatenate([a[:6].reshape(-1, 3), a[-6:].reshape(-1, 3), a[:, :6].reshape(-1, 3), a[:, -6:].reshape(-1, 3)])
    B = np.median(tepi, 0)
    lum = a.mean(-1)
    W = np.median(a[lum < 80], 0) if lum.mean() > 128 else np.median(a[lum > 200], 0)
    m = a[..., 0] - np.maximum(a[..., 1], a[..., 2])
    R = np.median(a[m > np.percentile(m[m > 60], 50)], 0)
    M = np.stack([W - B, R - B], 1)
    x = np.clip((a - B) @ np.linalg.pinv(M).T, 0, None)
    s = x.sum(-1, keepdims=True)
    x = np.where(s > 1, x / np.maximum(s, 1e-6), x)
    return x[..., 0], x[..., 1]


def trace(peta, kotak, turd=40):
    """Trace bagian peta (porsi 0..1) di kotak (x0, y0, x1, y1) -> (d, transform) dalam koordinat gambar asli."""
    x0, y0, x1, y1 = kotak
    sub = Image.fromarray(peta[y0:y1, x0:x1].astype(np.float32), 'F')
    besar = np.asarray(sub.resize((sub.width * SKALA, sub.height * SKALA), Image.BICUBIC))
    bit = Image.fromarray(np.where(besar > 0.5, 0, 255).astype(np.uint8)).convert('1')
    with tempfile.TemporaryDirectory() as tmp:
        pbm, svg = os.path.join(tmp, 'a.pbm'), os.path.join(tmp, 'a.svg')
        bit.save(pbm)
        subprocess.run(['potrace', pbm, '-b', 'svg', '-o', svg, '--flat', '-u', '2', '-t', str(turd), '-a', '1.0', '-O', '0.4'], check=True)
        teks = open(svg).read()
    d = ' '.join(re.findall(r'<path d="([^"]+)"', teks, re.S))
    d = re.sub(r'\s+', ' ', d).strip()
    # potrace: translate(0,H) scale(1/u,-1/u) di piksel besar -> bagi SKALA -> geser ke kotak
    k = 1 / (2 * SKALA)
    tf = 'matrix(%g 0 0 %g %g %g)' % (k, -k, x0, y0 + bit.height / SKALA)
    return d, tf


def lingkaran(peta, kotak):
    """Cari cincin emblem: titik terluar seni di sepanjang sinar dari pusat kira-kira, lalu cocokkan lingkaran."""
    x0, y0, x1, y1 = kotak
    m = peta[y0:y1, x0:x1] > 0.5
    ys, xs = np.nonzero(m)
    cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
    titik = []
    for t in np.linspace(0, 2 * np.pi, 360, endpoint=False):
        dx, dy = np.cos(t), np.sin(t)
        if dy < -0.85 or (dx > 0.35 and dy > 0.35):   # lewati bintang (atas) dan cap (kanan bawah)
            continue
        r = np.arange(10, max(m.shape))
        px, py = (cx + r * dx).astype(int), (cy + r * dy).astype(int)
        ok = (px >= 0) & (px < m.shape[1]) & (py >= 0) & (py < m.shape[0])
        hit = np.nonzero(m[py[ok], px[ok]])[0]
        if len(hit):
            titik.append((px[ok][hit[-1]] + 0.5, py[ok][hit[-1]] + 0.5))
    P = np.array(titik)
    A = np.c_[2 * P, np.ones(len(P))]
    sol = np.linalg.lstsq(A, (P ** 2).sum(1), rcond=None)[0]
    ccx, ccy = sol[0], sol[1]
    r = np.sqrt(sol[2] + ccx ** 2 + ccy ** 2)
    return ccx + x0, ccy + y0, r


def lambung(peta, kotak, mekar=1.5):
    """Poligon cembung piksel merah cap (dimekarkan sedikit), dalam koordinat gambar asli."""
    x0, y0, x1, y1 = kotak
    ys, xs = np.nonzero(peta[y0:y1, x0:x1] > 0.5)
    pts = sorted(set([(x, y) for x, y in zip(xs, ys)] + [(x + 1, y) for x, y in zip(xs, ys)] +
                     [(x, y + 1) for x, y in zip(xs, ys)] + [(x + 1, y + 1) for x, y in zip(xs, ys)]))

    def silang(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    bawah, atas = [], []
    for p in pts:
        while len(bawah) >= 2 and silang(bawah[-2], bawah[-1], p) <= 0:
            bawah.pop()
        bawah.append(p)
    for p in reversed(pts):
        while len(atas) >= 2 and silang(atas[-2], atas[-1], p) <= 0:
            atas.pop()
        atas.append(p)
    h = np.array(bawah[:-1] + atas[:-1], float)
    c = h.mean(0)
    v = h - c
    h = c + v * (1 + mekar / np.linalg.norm(v, axis=1, keepdims=True))
    return [(x + x0, y + y0) for x, y in h]


def batas(peta, ambang=0.5):
    ys, xs = np.nonzero(peta > ambang)
    return xs.min(), ys.min(), xs.max() + 1, ys.max() + 1


def main():
    os.makedirs(KELUAR, exist_ok=True)
    seni_g, merah_g = urai(os.path.join(ASLI, 'mendatar-gelap.jpg'))
    seni_t, merah_t = urai(os.path.join(ASLI, 'mendatar-terang.jpg'))
    H, W = seni_g.shape
    # pemisah emblem | tulisan: kolom kosong pertama setelah emblem
    isi = (seni_g > 0.5).any(0) | (merah_g > 0.5).any(0)
    kiri = int(np.argmax(isi))
    jeda = [x for x in range(kiri + 300, W) if not isi[x]]
    pisah = jeda[0] + 2
    ke = (0, 0, pisah, H)                       # kotak emblem
    kt = (pisah, 0, W, H)                       # kotak tulisan
    # bagian-bagian (path)
    emb_g = trace(seni_g, ke)
    emb_t = trace(seni_t, ke)
    mer_g = trace(merah_g, ke, turd=10)
    mer_t = trace(merah_t, ke, turd=10)
    tul = trace(seni_g, kt)
    # alas emblem: lingkaran cincin + cap
    cx, cy, r = lingkaran(seni_g, ke)
    ex0, ey0, ex1, ey1 = batas(np.maximum(seni_g, merah_g)[:, :pisah])
    cap_x0 = int(cx + 0.25 * r)
    cap = lambung(merah_g, (cap_x0, int(cy + 0.25 * r), pisah, H))
    tx0, ty0, tx1, ty1 = batas(seni_g[:, pisah:])
    tx0 += pisah; tx1 += pisah
    print('cincin', round(cx, 1), round(cy, 1), round(r, 1), '| emblem', (ex0, ey0, ex1, ey1), '| tulisan', (tx0, ty0, tx1, ty1))

    def emblem(varian):
        seni, mer = (emb_g, mer_g) if varian == 'putih' else (emb_t, mer_t)
        alas, warna = (NAVY, PUTIH) if varian == 'putih' else (PUTIH, NAVY)
        pts = ' '.join('%.1f,%.1f' % p for p in cap)
        return ('<g class="mn-emblem">'
                '<circle cx="%.2f" cy="%.2f" r="%.2f" fill="%s"/><polygon points="%s" fill="%s"/>' % (cx, cy, r - 1.2, alas, pts, alas) +
                '<path fill="%s" transform="%s" d="%s"/>' % (warna, seni[1], seni[0]) +
                '<path fill="%s" stroke="%s" stroke-width="0.6" stroke-linejoin="round" transform="%s" d="%s"/>' % (MERAH, MERAH, mer[1], mer[0]) +
                '</g>')

    def tulisan(varian):
        return '<path class="mn-teks" fill="%s" transform="%s" d="%s"/>' % (PUTIH if varian == 'putih' else NAVY, tul[1], tul[0])

    def dok(vb, isi_svg, judul='Mensetsu Navi 面接ナビ'):
        return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s" role="img" aria-label="%s"><title>%s</title>%s</svg>\n'
                % (' '.join('%.1f' % v for v in vb), judul, judul, isi_svg))

    eh, ew = ey1 - ey0, ex1 - ex0
    tw, th = tx1 - tx0, ty1 - ty0
    for varian in ('putih', 'navy'):
        E, T = emblem(varian), tulisan(varian)
        # mendatar: susunan asli
        x0, y0, x1, y1 = min(ex0, tx0), min(ey0, ty0), max(ex1, tx1), max(ey1, ty1)
        p = 0.04 * (y1 - y0)
        tulis(varian, 'mendatar', dok((x0 - p, y0 - p, x1 - x0 + 2 * p, y1 - y0 + 2 * p), E + T))
        # emblem saja
        p = 0.03 * eh
        tulis(varian, 'emblem', dok((ex0 - p, ey0 - p, ew + 2 * p, eh + 2 * p), E, 'Mensetsu Navi'))
        # tegak: perbandingan versi persegi (lebar tulisan = 0,996 x tinggi emblem, jarak = 0,0765 x tinggi emblem)
        s = 0.996 * eh / tw
        gy = ey1 + 0.0765 * eh
        ttf = 'translate(%.2f %.2f) scale(%.4f) translate(%.2f %.2f)' % (cx, gy, s, -(tx0 + tw / 2), -ty0)
        lebar = max(ex1 - cx, cx - ex0, s * tw / 2)
        x0, x1, y0, y1 = cx - lebar, cx + lebar, ey0, gy + s * th
        p = 0.04 * (y1 - y0)
        tulis(varian, 'tegak', dok((x0 - p, y0 - p, x1 - x0 + 2 * p, y1 - y0 + 2 * p), E + '<g transform="%s">%s</g>' % (ttf, T)))
        # ringkas: tulisan setinggi 0,98 x emblem, di tengah tinggi emblem
        s2 = 0.98 * eh / th
        gx = ex1 + 0.16 * eh
        ty = ey0 + (eh - s2 * th) / 2
        ttf2 = 'translate(%.2f %.2f) scale(%.4f) translate(%.2f %.2f)' % (gx, ty, s2, -tx0, -ty0)
        x0, x1, y0, y1 = ex0, gx + s2 * tw, ey0, ey1
        p = 0.03 * (y1 - y0)
        tulis(varian, 'ringkas', dok((x0 - p, y0 - p, x1 - x0 + 2 * p, y1 - y0 + 2 * p), E + '<g transform="%s">%s</g>' % (ttf2, T)))
    # ikon tab: emblem versi putih (beralas navy) dalam kotak persegi
    sisi = max(ew, eh) * 1.02
    mx, my = (ex0 + ex1) / 2, (ey0 + ey1) / 2
    fav = os.path.join(KELUAR, '..', 'favicon.svg')
    isi = dok((mx - sisi / 2, my - sisi / 2, sisi, sisi), emblem('putih'), 'Mensetsu Navi')
    open(fav, 'w', encoding='utf8').write(isi)
    print('%-36s %6.1f KB' % (os.path.relpath(fav), len(isi.encode()) / 1024))


def tulis(varian, model, isi):
    f = os.path.join(KELUAR, 'logo-%s-%s.svg' % (model, varian))
    open(f, 'w', encoding='utf8').write(isi)
    print('%-36s %6.1f KB' % (os.path.relpath(f), len(isi.encode()) / 1024))


if __name__ == '__main__':
    main()
