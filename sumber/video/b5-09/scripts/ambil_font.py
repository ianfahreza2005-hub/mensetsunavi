#!/usr/bin/env python3
"""Mengunduh font video ke public/fonts/ (sekali saja; hasilnya ikut di-commit agar render tidak butuh internet).

Huruf Latin: subset "latin" dari Google Fonts. Huruf Jepang: subset berisi hanya karakter yang dipakai di video
(parameter text= Google Fonts), jadi ukurannya kecil. Daftar karakter diambil dari src/naskah.ts.
Pemakaian: python3 scripts/ambil_font.py
"""
import os, re, urllib.parse, urllib.request

AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(AKAR, 'public', 'fonts')
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'


def ambil(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def latin(family, weights, nama):
    css = ambil('https://fonts.googleapis.com/css2?family=%s:wght@%s&display=block' % (family.replace(' ', '+'), ';'.join(map(str, weights)))).decode()
    for blok in re.findall(r'/\* latin \*/\s*@font-face\s*{[^}]*}', css):
        w = re.search(r'font-weight:\s*(\d+)', blok).group(1)
        url = re.search(r'url\((https://[^)]+)\)', blok).group(1)
        open(os.path.join(OUT, '%s-%s.woff2' % (nama, w)), 'wb').write(ambil(url))
        print('latin', nama, w)


def jepang(family, weights, nama, teks):
    for w in weights:
        css = ambil('https://fonts.googleapis.com/css2?family=%s:wght@%d&display=block&text=%s' % (family.replace(' ', '+'), w, urllib.parse.quote(teks))).decode()
        url = re.search(r'url\((https://[^)]+)\)', css).group(1)
        open(os.path.join(OUT, '%s-%d.woff2' % (nama, w)), 'wb').write(ambil(url))
        print('jepang', nama, w, len(teks), 'karakter')


def karakter_jepang():
    src = open(os.path.join(AKAR, 'src', 'naskah.ts'), encoding='utf-8').read()
    cs = sorted(set(ch for ch in src if ord(ch) > 0x2E7F))   # CJK, kana, tanda baca Jepang
    return ''.join(cs) + '0123456789:.〇'


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    latin('Poppins', [600, 700, 800], 'poppins')
    latin('Plus Jakarta Sans', [500, 600, 700, 800], 'jakarta')
    jp = karakter_jepang()
    jepang('Zen Kaku Gothic New', [500, 700, 900], 'zenkaku', jp)
    jepang('Shippori Mincho', [800], 'shippori', jp)
