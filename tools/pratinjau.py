#!/usr/bin/env python3
"""Membuat pratinjau Mensetsu Navi untuk Artifact claude.ai (panel kanan aplikasi Claude).

Artifact membungkus halaman utama dengan kerangka <!doctype><html><head><body> sendiri, jadi tag itu dibuang dari
index.html. Parameter ?v= juga dibuang karena berkas pendukung diterbitkan di jalur polosnya. Service worker tidak jalan
di Artifact (pendaftarannya gagal diam-diam), jadi sw.js dan manifest tidak ikut.

Pakai:  python3 tools/pratinjau.py <folder-keluaran>
Hasil:  <folder-keluaran>/index.html dan <folder-keluaran>/files.json (peta jalur terbit → sumber, untuk parameter `files`).
URL Artifact pratinjau dicatat di CLAUDE.md.
"""
import json, os, re, sys

AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(AKAR, 'pratinjau')
    os.makedirs(out, exist_ok=True)
    s = open(os.path.join(AKAR, 'index.html'), encoding='utf-8').read()
    s = re.sub(r'<!doctype html>\s*', '', s, flags=re.I)
    s = re.sub(r'</?(html|head|body)\b[^>]*>\s*', '', s, flags=re.I)
    s = re.sub(r'<meta charset[^>]*>\s*', '', s, flags=re.I)
    s = re.sub(r'<meta name="viewport"[^>]*>\s*', '', s, flags=re.I)
    s = re.sub(r'<link rel="manifest"[^>]*>\s*', '', s, flags=re.I)
    s = re.sub(r'\?v=[0-9a-f]+', '', s)
    open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(s)

    sw = open(os.path.join(AKAR, 'sw.js'), encoding='utf-8').read()
    i = sw.index('PRECACHE')
    daftar = json.loads(sw[sw.index('[', i):sw.index(']', i) + 1])
    files = {p: p for p in daftar if p not in ('./', 'index.html', 'manifest.webmanifest', 'sw.js')}
    for p in files:
        assert os.path.exists(os.path.join(AKAR, p)), p
    json.dump(files, open(os.path.join(out, 'files.json'), 'w'), indent=1)
    print('pratinjau:', os.path.join(out, 'index.html'), '·', len(files), 'berkas pendukung')


if __name__ == '__main__':
    main()
