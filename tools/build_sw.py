"""Perbarui daftar file dan VERSION di sw.js. Jalankan dari akar repo: python tools/build_sw.py"""
import glob, hashlib, json, re
files = ['./', 'index.html', 'rak.html', 'manifest.webmanifest', 'css/app.css', 'js/app.js', 'js/interaktif.js', 'js/store.js', 'js/data/kursus.js',
         'vendor/three.module.min.js', 'vendor/three.core.min.js', 'assets/favicon.svg', 'assets/icon-192.png', 'assets/icon-512.png']
files += sorted(glob.glob('assets/navi/*.webp')) + sorted(glob.glob('assets/bg/*.webp'))
h = hashlib.sha1()
for f in files:
    if f != './': h.update(open(f, 'rb').read())
sw = open('sw.js').read()
sw = re.sub(r"var VERSION = '[^']+';", "var VERSION = 'mn-%s';" % h.hexdigest()[:10], sw)
sw = re.sub(r"var PRECACHE = \[[^\]]*\];", 'var PRECACHE = ' + json.dumps(files, indent=1) + ';', sw, flags=re.S)
open('sw.js', 'w').write(sw)
print('sw.js diperbarui:', h.hexdigest()[:10], len(files), 'file')
