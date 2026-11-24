#!/usr/bin/env python3
"""Membuat pratinjau Mensetsu Navi untuk Artifact claude.ai (panel kanan aplikasi Claude).

Panel kanan sempit, sedangkan aplikasi sekarang khusus tampilan laptop. Karena itu halaman Artifact (index.html)
hanya bingkai: aplikasi asli dimuat sebagai app.html di dalam iframe selebar laptop (minimal 1280 px) lalu
diperkecil dengan transform agar pas di panel. Parameter ?v= dibuang karena berkas pendukung diterbitkan di jalur
polosnya. Service worker tidak jalan di Artifact (pendaftarannya gagal diam-diam), jadi sw.js dan manifest tidak ikut.

Pakai:  python3 tools/pratinjau.py <folder-keluaran>
Hasil:  <folder-keluaran>/index.html (bingkai), app.html (aplikasi), files.json (peta jalur terbit → sumber
        untuk parameter `files`; app.html memakai jalur absolut di folder keluaran).
URL Artifact pratinjau dicatat di CLAUDE.md.
"""
import json, os, re, sys

AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LEBAR = 1280   # lebar laptop yang ditiru di panel sempit

BINGKAI = '''<title>Mensetsu Navi 面接ナビ</title>
<style>
  :root { --latar: #0E2A47; color-scheme: light; }
  html, body { height: 100%; margin: 0; overflow: hidden; background: var(--latar); }
  #app { position: fixed; left: 0; top: 0; border: 0; transform-origin: 0 0; background: #EEECF1; }
</style>
<iframe id="app" src="app.html" title="Mensetsu Navi"></iframe>
<script>
  /* tiru layar laptop: lebar minimal {LEBAR} px, diperkecil agar pas di panel */
  (function () {
    var f = document.getElementById('app');
    function pas() {
      var w = window.innerWidth, h = window.innerHeight, v = Math.max({LEBAR}, w), k = w / v;
      f.style.width = v + 'px'; f.style.height = Math.ceil(h / k) + 'px'; f.style.transform = 'scale(' + k + ')';
    }
    window.addEventListener('resize', pas); pas();
  })();
</script>
'''.replace('{LEBAR}', str(LEBAR))


def main():
    out = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(AKAR, 'pratinjau'))
    os.makedirs(out, exist_ok=True)
    app = open(os.path.join(AKAR, 'index.html'), encoding='utf-8').read()
    app = re.sub(r'<link rel="manifest"[^>]*>\s*', '', app, flags=re.I)
    app = re.sub(r'\?v=[0-9a-f]+', '', app)
    open(os.path.join(out, 'app.html'), 'w', encoding='utf-8').write(app)
    open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(BINGKAI)

    sw = open(os.path.join(AKAR, 'sw.js'), encoding='utf-8').read()
    i = sw.index('PRECACHE')
    daftar = json.loads(sw[sw.index('[', i):sw.index(']', i) + 1])
    files = {p: p for p in daftar if p not in ('./', 'index.html', 'manifest.webmanifest', 'sw.js')}
    for p in files:
        assert os.path.exists(os.path.join(AKAR, p)), p
    files['app.html'] = os.path.join(out, 'app.html')
    json.dump(files, open(os.path.join(out, 'files.json'), 'w'), indent=1)
    print('pratinjau:', os.path.join(out, 'index.html'), '·', len(files), 'berkas pendukung')


if __name__ == '__main__':
    main()
