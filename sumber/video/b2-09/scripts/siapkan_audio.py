#!/usr/bin/env python3
"""Menyiapkan semua audio video B2-09.

1. Suara telepon (VOICEVOX:雀松朱司, dibuat dengan scripts/sintesis.py): dinormalkan ke -16 LUFS, 48 kHz → public/audio/kN.wav
   Waktu tiap frasa dikalibrasi terhadap durasi berkas asli → src/data/waktu.json (dipakai untuk sinkron teks).
2. Efek suara dan musik latar disintesis di sini (tanpa sampel luar, bebas lisensi) → public/sfx/*.wav

Pemakaian: python3 scripts/siapkan_audio.py [folder hasil sintesis, mis. …/out/suzumatsu]
Butuh: numpy, ffmpeg.
"""
import json, os, subprocess, sys, wave
import numpy as np

AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
rng = np.random.default_rng(7)


def simpan(nama, x, puncak_db=-3.0):
    x = np.asarray(x, dtype=np.float64)
    m = np.max(np.abs(x)) or 1.0
    x = x / m * (10 ** (puncak_db / 20))
    data = (np.clip(x, -1, 1) * 32767).astype('<i2')
    with wave.open(os.path.join(AKAR, 'public', 'sfx', nama), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(data.tobytes())


def t_(dur):
    return np.arange(int(dur * SR)) / SR


def fade(x, a=0.003, r=0.02):
    n = len(x); ia, ir = int(a * SR), int(r * SR)
    if ia: x[:ia] *= 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, ia))
    if ir: x[n - ir:] *= 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, ir))
    return x


def lp_ubah(x, fc):
    """low-pass satu kutub dengan frekuensi potong yang berubah per sampel (fc: larik Hz)"""
    y = np.zeros_like(x); s = 0.0
    a = 1 - np.exp(-2 * np.pi * np.asarray(fc) / SR)
    for i in range(len(x)):
        s += a[i] * (x[i] - s); y[i] = s
    return y


def band_fft(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    g = np.clip((f - lo * 0.7) / (lo * 0.3 + 1e-9), 0, 1) * np.clip((hi * 1.3 - f) / (hi * 0.3), 0, 1)
    return np.fft.irfft(X * g, len(x))


def lonceng(f0, dur, amp=1.0):
    t = t_(dur)
    parsial = [(1.0, 1.0, 0.9), (2.0, 0.32, 0.5), (3.01, 0.14, 0.3), (4.2, 0.06, 0.18), (5.4, 0.03, 0.1)]
    x = sum(a * np.sin(2 * np.pi * f0 * k * t) * np.exp(-t / d) for k, a, d in parsial)
    return fade(x * amp, 0.002, 0.05)


def efek():
    os.makedirs(os.path.join(AKAR, 'public', 'sfx'), exist_ok=True)
    # pop: nada turun cepat + klik kecil (kata/kartu muncul)
    t = t_(0.16); f = 1150 * np.exp(-t / 0.028) + 320
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.045)
    x[:150] += rng.normal(0, 0.25, 150) * np.linspace(1, 0, 150)
    simpan('pop.wav', fade(x, 0.001, 0.03))
    # tik: ketukan UI lembut (centang unsur)
    t = t_(0.07)
    simpan('tik.wav', fade((np.sin(2 * np.pi * 2300 * t) + 0.5 * np.sin(2 * np.pi * 1150 * t)) * np.exp(-t / 0.012), 0.0005, 0.02))
    # whoosh: derau dengan low-pass yang menyapu naik-turun
    for nama, dur, puncak, f_hi in (('whoosh.wav', 0.75, 0.42, 5200), ('whoosh-pendek.wav', 0.4, 0.22, 3800)):
        t = t_(dur); n = len(t)
        env = np.where(t < puncak, (t / puncak) ** 2.2, np.exp(-(t - puncak) / (dur * 0.22)))
        fc = 250 + (f_hi - 250) * np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.5
        x = lp_ubah(rng.normal(0, 1, n), fc) * env
        simpan(nama, fade(x, 0.002, 0.06), -6)
    # naik: derau menanjak sebelum kanji 連絡 muncul
    t = t_(1.1); x = lp_ubah(rng.normal(0, 1, len(t)), 200 + 7000 * (t / 1.1) ** 2.4) * (t / 1.1) ** 2.6
    simpan('naik.wav', fade(x, 0.01, 0.015), -6)
    # jatuh: kartu mendarat
    t = t_(0.28); f = 120 * np.exp(-t / 0.06) + 52
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.07) + lp_ubah(rng.normal(0, 0.6, len(t)), np.full(len(t), 900.0)) * np.exp(-t / 0.025)
    simpan('jatuh.wav', fade(x, 0.001, 0.05), -4)
    # benar: dua nada lonceng naik (G5 → C6)
    x = np.zeros(int(1.6 * SR)); a = lonceng(783.99, 1.4); b = lonceng(1046.5, 1.4)
    x[:len(a)] += a; o = int(0.11 * SR); x[o:o + len(b)] += b * 0.9
    simpan('benar.wav', x, -5)
    # buang: sapuan turun + ketukan kayu (pilihan salah masuk tempat sampah)
    t = t_(0.42); n = len(t)
    x = lp_ubah(rng.normal(0, 1, n), 3500 * np.exp(-t / 0.12) + 200) * np.exp(-t / 0.15) * 0.6
    k = t_(0.06); kayu = np.sin(2 * np.pi * 820 * k) * np.exp(-k / 0.012) + 0.5 * np.sin(2 * np.pi * 1630 * k) * np.exp(-k / 0.008)
    o = int(0.22 * SR); x[o:o + len(kayu)] += kayu
    simpan('buang.wav', fade(x, 0.002, 0.04), -5)
    # stempel: hentakan + tepukan kertas
    t = t_(0.3); f = 95 * np.exp(-t / 0.05) + 48
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.09) + band_fft(rng.normal(0, 1, len(t)), 900, 4500) * np.exp(-t / 0.018) * 0.7
    simpan('stempel.wav', fade(x, 0.0005, 0.05), -3)
    # dering: nada sambung Jepang (400 Hz dimodulasi 16 Hz), dua kali, terdengar lewat telepon
    def nyala(d):
        t = t_(d); am = (0.5 + 0.5 * np.sin(2 * np.pi * 16 * t)) ** 1.5
        return fade(np.sin(2 * np.pi * 400 * t) * am, 0.01, 0.02)
    x = np.concatenate([nyala(1.0), np.zeros(int(0.55 * SR)), nyala(1.0), np.zeros(int(0.1 * SR))])
    simpan('dering.wav', band_fft(x, 300, 3400), -10)
    # angkat: klik telepon diangkat + desis saluran singkat
    t = t_(0.3); x = band_fft(rng.normal(0, 0.15, len(t)), 400, 3000) * np.exp(-t / 0.12)
    c = t_(0.012); x[:len(c)] += np.sin(2 * np.pi * 1800 * c) * np.exp(-c / 0.003) * 1.2
    simpan('angkat.wav', fade(x, 0.0005, 0.08), -8)


def musik(dur=46.0):
    """latar lembut: empat akor (Dmaj9 – Bm9 – Gmaj9 – A6/9), masing-masing ±5,6 dtk, suara sinus berlapis + getar pelan"""
    akor = [
        [146.83, 220.0, 277.18, 329.63, 369.99],
        [123.47, 185.0, 220.0, 277.18, 293.66],
        [98.0, 146.83, 185.0, 220.0, 246.94],
        [110.0, 164.81, 185.0, 246.94, 277.18],
    ]
    t = t_(dur); x = np.zeros(len(t)); panjang = 5.6; tumpang = 1.6
    i = 0; mulai = 0.0
    while mulai < dur:
        ch = akor[i % len(akor)]; d = min(panjang + tumpang, dur - mulai)
        tt = t_(d); env = np.minimum(1, tt / 1.4) * np.minimum(1, np.maximum(0, (d - tt) / 1.8))
        suara = sum(
            (np.sin(2 * np.pi * f * (1 + 0.0012 * np.sin(2 * np.pi * (0.17 + 0.03 * j) * tt)) * tt)
             + 0.22 * np.sin(2 * np.pi * 2 * f * tt) + 0.06 * np.sin(2 * np.pi * 3 * f * tt)) * (0.9 if j else 1.1)
            for j, f in enumerate(ch))
        a = int(mulai * SR); x[a:a + len(tt)] += suara * env
        mulai += panjang; i += 1
    # kilau: nada lonceng sangat pelan tiap awal akor (oktaf atas)
    for k in range(int(dur / panjang) + 1):
        f = akor[k % len(akor)][-1] * 4; b = lonceng(f, 2.2, 0.12); a = int(k * panjang * SR)
        x[a:a + len(b)] += b[:max(0, len(x) - a)]
    x = band_fft(x, 60, 2600)
    x[:int(1.5 * SR)] *= np.linspace(0, 1, int(1.5 * SR)); x[-int(3 * SR):] *= np.linspace(1, 0, int(3 * SR))
    simpan('musik.wav', x, -12)


def suara(src):
    os.makedirs(os.path.join(AKAR, 'public', 'audio'), exist_ok=True)
    info = json.load(open(os.path.join(src, 'waktu.json'), encoding='utf-8'))
    keluar = []
    for i, k in enumerate(info, 1):
        dst = os.path.join(AKAR, 'public', 'audio', 'k%d.wav' % i)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(src, 'k%d.wav' % i), '-af',
                        'highpass=f=70,acompressor=threshold=-20dB:ratio=2.2:attack=5:release=90,loudnorm=I=-16:TP=-1.5:LRA=7',
                        '-ar', str(SR), '-ac', '1', dst], check=True)
        asli = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0',
                                              os.path.join(src, 'k%d.wav' % i)]).decode())
        f = asli / k['durasi']   # kalibrasi: perkiraan waktu dari AudioQuery → durasi berkas sebenarnya
        keluar.append({'durasi': round(asli, 3), 'frasa': [{'mulai': round(p['mulai'] * f, 3), 'selesai': round(p['selesai'] * f, 3)} for p in k['frasa']]})
    json.dump(keluar, open(os.path.join(AKAR, 'src', 'data', 'waktu.json'), 'w'), indent=1)
    print('suara:', [k['durasi'] for k in keluar])


if __name__ == '__main__':
    if len(sys.argv) > 1:   # tanpa argumen: suara dialog (public/audio, src/data/waktu.json) dibiarkan
        suara(sys.argv[1])
    efek()
    musik()
    print('sfx:', sorted(os.listdir(os.path.join(AKAR, 'public', 'sfx'))))
