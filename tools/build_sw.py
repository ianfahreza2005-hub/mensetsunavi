"""Perbarui daftar file dan VERSION di sw.js. Jalankan dari akar repo: python tools/build_sw.py"""
import glob, hashlib, json, re
files = ['./', 'index.html', 'rak.html', 'manifest.webmanifest', 'css/app.css', 'js/app.js', 'js/interaktif.js', 'js/jikoshoukai.js', 'js/kosakata.js', 'js/suara.js', 'js/lisan.js', 'js/simrek.js', 'js/latihan.js', 'js/tips.js', 'js/navi.js', 'js/store.js', 'js/data/kursus.js', 'js/data/tampilan.js',
         'vendor/three.module.min.js', 'vendor/three.core.min.js', 'assets/favicon.svg', 'assets/icon-192.png', 'assets/icon-512.png']
files += sorted(glob.glob('assets/navi/*.webp')) + sorted(glob.glob('assets/bg/*.webp'))
h = hashlib.sha1()
for f in files:
    if f == './': continue
    data = open(f, 'rb').read()
    if f == 'index.html': data = re.sub(rb'\?v=[0-9a-f]+', b'', data)   # tanda versi di index.html tidak ikut dihitung agar hasilnya stabil
    h.update(data)
ver = h.hexdigest()[:10]
# alamat berkas kode diberi ?v=<hash>: peramban wajib mengambil berkas baru saat versi berganti (tidak memakai cache memori/HTTP yang usang)
idx = open('index.html', encoding='utf8').read()
idx = re.sub(r'(src|href)="((?:js|css)/[^"?]+)(?:\?v=[0-9a-f]+)?"', lambda m: '%s="%s?v=%s"' % (m.group(1), m.group(2), ver), idx)
open('index.html', 'w', encoding='utf8').write(idx)
sw = open('sw.js').read()
sw = re.sub(r"var VERSION = '[^']+';", "var VERSION = 'mn-%s';" % h.hexdigest()[:10], sw)
sw = re.sub(r"var PRECACHE = \[[^\]]*\];", 'var PRECACHE = ' + json.dumps(files, indent=1) + ';', sw, flags=re.S)
open('sw.js', 'w').write(sw)
print('sw.js diperbarui:', h.hexdigest()[:10], len(files), 'file')
