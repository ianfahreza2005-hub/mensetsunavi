"""Membuat js/data/kursus.js dari ekspor naskah (tools/xml.json: XML dok Bab 1-6, Evaluasi, Fitur Global; tools/sb.json: data storyboard).
Kedua file sumber ada di folder tools/ (ekspor dari doc Claude). Bila naskah berubah, ekspor ulang lalu jalankan skrip ini. Jalankan dari akar repo: python tools/gen_data.py"""
import json, re, xml.etree.ElementTree as ET
x = json.load(open('tools/xml.json'))
sb = json.load(open('tools/sb.json'))

def flat(xml):
    out = []
    root = ET.fromstring(xml)
    def wl(lst, d):
        for li in lst.findall('listItem'):
            for c in li:
                if c.tag == 'paragraph': out.append(('li' + str(d), ''.join(c.itertext())))
                elif c.tag == 'list': wl(c, d + 1)
    for ch in root:
        if ch.tag == 'paragraph': out.append(('h' + ch.get('heading') if ch.get('heading') else 'p', ''.join(ch.itertext())))
        elif ch.tag == 'list': wl(ch, 0)
        elif ch.tag == 'table': out.append(('table', [[''.join(c.itertext()) for c in r.findall('cell')] for r in ch.findall('row')]))
    return out

CODES = re.compile(r'\b(B\d-\d{2})\b')
def parse_quiz(L, start, stop_pred):
    qs = []; cur = None; i = start
    while i < len(L):
        t, s = L[i]
        if t.startswith('h') and not s.startswith('Soal') and cur is not None and stop_pred(t, s): break
        if t.startswith('h') and s.startswith('Soal'):
            if cur: qs.append(cur)
            m = re.search(r'Indikator ([\d.]+)', s)
            bab = re.search(r'Bab (\d)', s)
            cur = {'ind': m.group(1) if m else '', 'stem': [], 'opts': [], 'key': '', 'exp': '', 'ok': '', 'no': '', 'bab': int(bab.group(1)) if bab else None, 'remed': []}
        elif cur is not None:
            if t.startswith('li') and re.match(r'^[A-D]\. ', s): cur['opts'].append(s[3:].strip())
            elif t == 'p' and s.startswith('Kunci:'):
                m = re.match(r'Kunci:\s*([A-D])\.?\s*(.*)', s); cur['key'] = m.group(1); 
                if m.group(2): cur['exp'] = m.group(2)
                cur['remed'] += CODES.findall(s)
            elif t == 'p' and s.startswith('Penjelasan:'): cur['exp'] = s.split(':', 1)[1].strip()
            elif t == 'p' and s.startswith('Umpan balik tepat:'): cur['ok'] = s.split(':', 1)[1].strip().strip('“”"')
            elif t == 'p' and s.startswith('Umpan balik kurang tepat:'):
                cur['no'] = s.split(':', 1)[1].strip().strip('“”"'); cur['remed'] += CODES.findall(s)
            elif t == 'p' and not cur['opts']: cur['stem'].append(s)
            elif t.startswith('li') and not cur['opts']: cur['stem'].append('• ' + s)
        i += 1
    if cur: qs.append(cur)
    for q in qs:
        q['remed'] = list(dict.fromkeys(q['remed']))
        q['stem'] = '\n'.join(q['stem'])
    return [q for q in qs if len(q['opts']) == 4 and q['key']]

quiz = {}
for n in range(1, 7):
    L = flat(x['bab%d' % n])
    st = [i for i, (t, s) in enumerate(L) if t.startswith('h') and 'Kuis' in s][0]
    quiz[n] = parse_quiz(L, st + 1, lambda t, s: True)
    assert len(quiz[n]) == 10, (n, len(quiz[n]))
E = flat(x['eval'])
st = [i for i, (t, s) in enumerate(E) if t.startswith('h') and s.startswith('Soal Pre-test')][0]
pre = parse_quiz(E, st, lambda t, s: t == 'h2' and not s.startswith('Soal'))
assert len(pre) == 20, len(pre)
# simulation moments
sim = []
for t, s in E:
    if t == 'table' and s[0][:2] == ['Kode', 'Situasi']:
        for r in s[1:]:
            sim.append({'code': r[0], 'sit': r[1], 'opts': [[r[2], 10], [r[3], 5], [r[4], 0]], 'jenis': r[5], 'acuan': r[6]})
assert len(sim) == 13, len(sim)

# slides from storyboard
def runs(rs):
    return ''.join(('**' + r['t'] + '**') if r.get('b') else r['t'] for r in rs)
slides = {}
order = []
for sec in sb:
    for c in sec['cards']:
        blocks = []; narr = []; mode = None
        for n in c['narasi']:
            if n['k'] == 'lab':
                lab = n['t'].lower(); mode = 'screen' if lab.startswith('teks layar') else ('narr' if lab.startswith('nara') else 'other'); continue
            if mode == 'screen':
                if n['k'] == 'p': blocks.append({'p': runs(n['r'])})
                elif n['k'] == 'li': blocks.append({'li': runs(n['r']), 'lvl': n.get('lvl', 0), 'num': n.get('num')})
                elif n['k'] == 'table': blocks.append({'table': [[runs(cell) for cell in row] for row in n['rows']]})
            elif mode == 'narr':
                if n['k'] in ('p', 'li'): narr.append(runs(n['r']).replace('**', ''))
        tpl = re.search(r'\bT(\d{2})\b', c.get('pelajaran', ''))
        pel = re.match(r'(P\d|Pembuka|Penutup)', c.get('pelajaran', ''))
        slides[c['code']] = {'code': c['code'], 'title': c['title'], 'treat': c['treatment'], 'pel': pel.group(1) if pel else '',
                             'tpl': 'T' + tpl.group(1) if tpl else '', 'screen': blocks, 'narasi': ' '.join(narr).strip('“”" '),
                             'visual': c.get('visual', '')}
        order.append(c['code'])

BAB = [
 dict(no=1, label='Bab 1', title='Mengenal Mensetsu', kj='面接', kjr='mensetsu · wawancara kerja', col='#2A4B8D', colL='#E4EBF8', dur='±8 menit',
      lessons=['Apa Itu Mensetsu?', 'Yang Dinilai Pewawancara', 'Persiapan Sebelum Wawancara'],
      blurb='Sebelum berlatih perkenalan diri dan menjawab pertanyaan, kenali dulu seperti apa wawancara kerja di perusahaan Jepang dan apa yang dinilai pewawancara.'),
 dict(no=2, label='Bab 2', title='Hou-Ren-Sou', kj='報連相', kjr='hou · ren · sou', col='#0E7470', colL='#DDF2F0', dur='±12 menit',
      lessons=['Mengenal Hou-Ren-Sou', 'Membedakan Ketiganya', 'Hou-Ren-Sou di Wawancara'],
      blurb='Hou-Ren-Sou (melapor, mengabari, berkonsultasi) adalah cara berkomunikasi yang sangat dihargai di tempat kerja Jepang dan sering muncul dalam pertanyaan wawancara.'),
 dict(no=3, label='Bab 3', title='Nyuushitsu & Ojigi', kj='入室', kjr='nyuushitsu · お辞儀 ojigi', col='#B0436A', colL='#FBE6EE', dur='±12 menit',
      lessons=['Langkah Masuk Ruangan', 'Ojigi', 'Duduk dan Latihan Gabungan'],
      blurb='Wawancara dimulai sejak kamu mengetuk pintu. Di bab ini kamu berlatih masuk ruangan, membungkuk, dan duduk dengan benar.'),
 dict(no=4, label='Bab 4', title='Jikoshoukai', kj='自己紹介', kjr='jikoshoukai · perkenalan diri', col='#A8650F', colL='#FBEEDA', dur='±18 menit',
      lessons=['Fungsi Jikoshoukai', 'Lima Blok', 'Pelafalan dan Kesalahan Umum', 'Jikoshoukai-ku'],
      blurb='Setelah duduk, pewawancara hampir selalu memintamu memperkenalkan diri. Di bab inti ini kamu menyusun dan melatih jikoshoukai-mu sendiri.'),
 dict(no=5, label='Bab 5', title='Menjawab Pertanyaan', kj='質疑応答', kjr='shitsugi outou · tanya jawab', col='#5B46A8', colL='#ECE7FA', dur='±15 menit',
      lessons=['Pola Menjawab', 'Pertanyaan Umum dan Tak Terduga', 'Tidak Paham dan Jujur', 'Bertanya Balik', 'Latihan Lisan'],
      blurb='Pewawancara akan bertanya lebih jauh tentang dirimu. Kamu belajar memahami pertanyaan, termasuk yang tak terduga, lalu menjawab dengan jelas dan jujur.'),
 dict(no=6, label='Bab 6', title='Taishitsu', kj='退室', kjr='taishitsu · keluar ruangan', col='#23784A', colL='#E1F3E8', dur='±8 menit',
      lessons=['Langkah Keluar Ruangan', 'Setelah Keluar Ruangan', 'Latihan'],
      blurb='Kesan terakhir sama pentingnya dengan kesan pertama. Di bab ini kamu belajar menutup wawancara dan keluar ruangan dengan baik.'),
]
for b in BAB:
    b['slides'] = [c for c in order if c.startswith('B%d-' % b['no'])]
    b['kuis'] = quiz[b['no']]
EVAL = [
 dict(no=7, id='sim', label='Evaluasi', title='Simulasi Mensetsu', kj='模擬面接', kjr='mogi mensetsu · simulasi', col='#1E2A47', colL='#E4E7EF', dur='±15 menit',
      lessons=['Fase A–E · 13 momen'], blurb='Wawancara utuh dengan Tanaka-san dari さくら食品: 13 momen, dari tiba di depan gedung sampai menutup wawancara.'),
 dict(no=8, id='post', label='Evaluasi', title='Post-test & Rapor', kj='修了', kjr='shuuryou · selesai', col='#7B3F2B', colL='#F6E6DF', dur='±15 menit',
      lessons=['Post-test 20 soal', 'Rapor Kesiapan'], blurb='20 soal post-test, lalu Rapor Kesiapan berisi nilai sumatif, skor komunikasi dan etika, serta rekomendasi.'),
]
data = {'bab': BAB, 'eval': EVAL, 'pre': pre, 'sim': sim, 'slides': slides, 'order': order}
js = '/* Dibuat otomatis dari naskah materi dan storyboard (gen_data.py). Jangan diedit manual. */\nwindow.MN_DATA = ' + json.dumps(data, ensure_ascii=False) + ';\n'
open('js/data/kursus.js', 'w').write(js)
print('ok', len(js), {n: len(b['slides']) for n, b in enumerate(BAB, 1)}, len(sim), len(pre))
print(json.dumps(pre[13], ensure_ascii=False)[:500])
print(json.dumps(slides['B1-05'], ensure_ascii=False)[:600])
print([k for k in slides if not k.startswith('B')])
