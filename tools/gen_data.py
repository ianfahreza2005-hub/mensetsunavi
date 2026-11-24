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
 dict(no=1, label='Bab 1', title='Mengenal Mensetsu', kj='面接', kjr='mensetsu · wawancara kerja', col='#0F4C81', colL='#E1EAF4', dur='±8 menit',
      lessons=['Apa Itu Mensetsu?', 'Yang Dinilai Pewawancara', 'Persiapan Sebelum Wawancara'],
      blurb='Sebelum berlatih perkenalan diri dan menjawab pertanyaan, kenali dulu seperti apa wawancara kerja di perusahaan Jepang dan apa yang dinilai pewawancara.'),
 dict(no=2, label='Bab 2', title='Hou-Ren-Sou', kj='報連相', kjr='hou · ren · sou', col='#17706B', colL='#DDEFEC', dur='±12 menit',
      lessons=['Mengenal Hou-Ren-Sou', 'Membedakan Ketiganya', 'Hou-Ren-Sou di Wawancara'],
      blurb='Hou-Ren-Sou (melapor, mengabari, berkonsultasi) adalah cara berkomunikasi yang sangat dihargai di tempat kerja Jepang dan sering muncul dalam pertanyaan wawancara.'),
 dict(no=3, label='Bab 3', title='Nyuushitsu & Ojigi', kj='入室', kjr='nyuushitsu · お辞儀 ojigi', col='#B3282F', colL='#F8E3E3', dur='±12 menit',
      lessons=['Langkah Masuk Ruangan', 'Ojigi', 'Duduk dan Latihan Gabungan'],
      blurb='Wawancara dimulai sejak kamu mengetuk pintu. Di bab ini kamu berlatih masuk ruangan, membungkuk, dan duduk dengan benar.'),
 dict(no=4, label='Bab 4', title='Jikoshoukai', kj='自己紹介', kjr='jikoshoukai · perkenalan diri', col='#9A5A12', colL='#F6EBDB', dur='±18 menit',
      lessons=['Fungsi Jikoshoukai', 'Lima Blok', 'Pelafalan dan Kesalahan Umum', 'Jikoshoukai-ku'],
      blurb='Setelah duduk, pewawancara hampir selalu memintamu memperkenalkan diri. Di bab inti ini kamu menyusun dan melatih jikoshoukai-mu sendiri.'),
 dict(no=5, label='Bab 5', title='Menjawab Pertanyaan', kj='質疑応答', kjr='shitsugi outou · tanya jawab', col='#5E4391', colL='#ECE6F4', dur='±15 menit',
      lessons=['Pola Menjawab', 'Pertanyaan Umum dan Tak Terduga', 'Tidak Paham dan Jujur', 'Bertanya Balik', 'Latihan Lisan'],
      blurb='Pewawancara akan bertanya lebih jauh tentang dirimu. Kamu belajar memahami pertanyaan, termasuk yang tak terduga, lalu menjawab dengan jelas dan jujur.'),
 dict(no=6, label='Bab 6', title='Taishitsu', kj='退室', kjr='taishitsu · keluar ruangan', col='#2D6A45', colL='#E2EFE6', dur='±8 menit',
      lessons=['Langkah Keluar Ruangan', 'Setelah Keluar Ruangan', 'Latihan'],
      blurb='Kesan terakhir sama pentingnya dengan kesan pertama. Di bab ini kamu belajar menutup wawancara dan keluar ruangan dengan baik.'),
]
for b in BAB:
    b['slides'] = [c for c in order if c.startswith('B%d-' % b['no'])]
    b['kuis'] = quiz[b['no']]
# glosarium tiap bab -> Bank Kosakata (GLB-03). Kategori tidak ada di naskah; ditetapkan di sini
# (bawaan: istilah wawancara). k = indeks slide di bab yang memuat istilah (-1 bila tidak ada).
KAT_SOPAN = {'失礼します', '失礼いたします', '失礼しました', '申し訳ありません', 'どうぞ', 'お入りください', 'どうぞおかけください', 'と申します', '本日',
             'はじめまして', '参りました', '御社', 'どうぞよろしくお願いいたします', 'もう一度お願いします', 'ゆっくり話していただけませんか',
             'どういう意味ですか', '以上で面接を終わります', '本日はありがとうございました', 'お忙しい中', 'お疲れさまでした', '結論から'}
KAT_KERJA = {'報連相', 'ほうれん草', '報告', '連絡', '相談', '上司', '先輩', '作業', 'ミス', '遅刻', '工場', '技術', '残業', '給料', '契約', '経験', '体力', '先生'}
KAT_ANGKA = {'歳'}
def kategori(jp):
    return 'sopan' if jp in KAT_SOPAN else 'kerja' if jp in KAT_KERJA else 'angka' if jp in KAT_ANGKA else 'wawancara'
def slide_text(sl):
    out = [sl['title']]
    for bl in sl['screen']:
        if 'p' in bl: out.append(bl['p'])
        elif 'li' in bl: out.append(bl['li'])
        elif 'table' in bl: out += [c for r in bl['table'] for c in r]
    return '\n'.join(out)
def cari_slide(b, jp):
    for idx, code in enumerate(b['slides']):
        sl = slides[code]
        if sl['tpl'] in ('T01', 'T17', 'T18'): continue
        txt = slide_text(sl)
        if any(part in txt for part in jp.split(' / ')): return idx
    return -1
for b in BAB:
    L = flat(x['bab%d' % b['no']])
    i = [k for k, (t, sx) in enumerate(L) if t.startswith('h') and sx.startswith('Glosarium')][0]
    rows = [v for t, v in L[i:i + 4] if t == 'table'][0][1:]
    b['glos'] = [{'jp': r[0].strip(), 'ro': r[1].strip(), 'ar': r[2].strip(), 'kat': kategori(r[0].strip()), 'k': cari_slide(b, r[0].strip())} for r in rows]
EVAL = [
 dict(no=7, id='sim', label='Evaluasi', title='Simulasi Mensetsu', kj='模擬面接', kjr='mogi mensetsu · simulasi', col='#0E2A47', colL='#E2E7EF', dur='±15 menit',
      lessons=['Fase A–E · 13 momen'], blurb='Wawancara utuh dengan Tanaka-san dari さくら食品: 13 momen, dari tiba di depan gedung sampai menutup wawancara.'),
 dict(no=8, id='post', label='Evaluasi', title='Post-test & Rapor', kj='修了', kjr='shuuryou · selesai', col='#7E3420', colL='#F4E4DE', dur='±15 menit',
      lessons=['Post-test 20 soal', 'Rapor Kesiapan'], blurb='20 soal post-test, lalu Rapor Kesiapan berisi nilai sumatif, skor komunikasi dan etika, serta rekomendasi.'),
]
# bank 25 pertanyaan GLB-04 (Latihan Pertanyaan Acak) dari dokumen Fitur Global + contoh jawaban dari slide
def pecah(t):
    """'「JP」 (romaji. "arti")' -> {'jp','ro','ar'}; tanpa tanda kutip, romaji = sebanyak kalimat JP."""
    m = re.match(r'^「?(.+?)」?\s*[\(（](.*)[\)）]\s*$', t.strip(), re.S)
    if not m: return {'jp': t.strip().strip('「」'), 'ro': '', 'ar': ''}
    jp, inner = m.group(1).strip(), m.group(2).strip()
    if re.search(r'["“”]', inner):
        parts = re.split(r'["“”]', inner); return {'jp': jp, 'ro': parts[0].strip(), 'ar': parts[1].strip()}
    n = max(1, len(re.findall(r'[。？！]', jp)))
    sent = re.split(r'(?<=[.?!])\s+', inner)
    return {'jp': jp, 'ro': ' '.join(sent[:n]).strip(), 'ar': ' '.join(sent[n:]).strip()}
def baris_jawaban(code, key):
    for bl in slides[code]['screen']:
        if 'table' not in bl: continue
        hd = bl['table'][0]; ja = [i for i, h in enumerate(hd) if 'jawaban' in h.lower()]
        if not ja: continue
        for r in bl['table'][1:]:
            if any(key in c for c in r): return pecah(r[[i for i, h in enumerate(hd) if 'pertanyaan' in h.lower()][0]]), pecah(r[ja[0]])
    raise KeyError((code, key))
def rani_utuh():
    t = [bl['table'] for bl in slides['B4-10']['screen'] if 'table' in bl][0][1:]
    return {'jp': ''.join(r[1] for r in t), 'ro': ' '.join(r[2] for r in t), 'ar': ' '.join(r[3] for r in t)}
def pola_b503():
    t = [bl['table'] for bl in slides['B5-03']['screen'] if 'table' in bl][0][1:]
    q = [bl['p'] for bl in slides['B5-03']['screen'] if 'p' in bl and bl['p'].startswith('Contoh untuk')][0]
    return pecah(q.split(':', 1)[0].replace('Contoh untuk', '').strip()), {'jp': ''.join(r[1] for r in t), 'ro': ' '.join(r[2] for r in t), 'ar': ' '.join(r[3] for r in t)}
SUMBER = {1: ('B4-10', None), 2: ('B5-03', None), 10: ('B5-03', None), 3: ('B5-04', '志望動機'), 11: ('B5-04', '志望動機'),
          4: ('B5-05', '長所と短所'), 5: ('B5-05', '長所と短所'), 12: ('B5-05', '長所と短所'), 13: ('B5-05', '長所と短所'), 6: ('B5-05', '体力'), 14: ('B5-05', '体力'),
          7: ('B5-06', '日本語はどのくらいできますか'), 15: ('B5-06', '日本語はどのくらいできますか'), 8: ('B5-06', '前の仕事'), 16: ('B5-06', '前の仕事'),
          9: ('B5-07', 'どのくらい働きたい'), 17: ('B5-07', '将来の目標'), 18: ('B5-08', '趣味'), 19: ('B5-08', '休みの日'), 20: ('B5-08', '日本の食べ物'),
          21: ('B5-08', '今朝'), 22: ('B5-08', 'インドネシアのいいところ'), 23: ('B2-10', 'ミス'), 24: ('B2-10', '分からない'), 25: ('B2-10', '遅刻')}
G = flat(x['glb'])
g0 = [k for k, (t, sx) in enumerate(G) if t.startswith('h') and 'GLB-04' in sx][0]
g1 = [k for k, (t, sx) in enumerate(G) if k > g0 and t == 'h2'][0]
GRUP = ['A', 'B', 'C', 'D']
latih = []
for gi, tb in enumerate([v for t, v in G[g0:g1] if t == 'table' and v[0][:2] == ['No', 'Pertanyaan']]):
    for r in tb[1:]:
        no = int(r[0]); q = pecah(r[1]); code, key = SUMBER[no]
        if no == 1: sq, ans = None, rani_utuh()
        elif key is None: sq, ans = pola_b503()
        else: sq, ans = baris_jawaban(code, key)
        norm = lambda z: re.sub(r'[。？！\s]', '', z)
        latih.append({'no': no, 'g': GRUP[gi], 'q': q, 'topik': r[2].strip(), 'acuan': r[3].strip() if gi == 0 else '', 'inti': r[3].strip() if gi == 3 else '',
                      'a': ans, 'dari': code, 'mirip': (sq['jp'] if sq else '') if (sq and norm(sq['jp']) != norm(q['jp'])) else ''})
assert [q['no'] for q in latih] == list(range(1, 26)), len(latih)
assert all(q['a']['jp'] and q['a']['ro'] and q['a']['ar'] for q in latih), [q['no'] for q in latih if not (q['a']['jp'] and q['a']['ro'] and q['a']['ar'])]
# soal latihan lisan B5-13: pertanyaan + contoh jawaban Rani dari tabel B5-04..B5-07
lisan5 = []
for code in ['B5-04', 'B5-05', 'B5-06', 'B5-07']:
    for bl in slides[code]['screen']:
        if 'table' in bl and bl['table'][0][0].lower().startswith('pertanyaan'):
            for r in bl['table'][1:]:
                a = pola_b503()[1] if r[1].strip().startswith('Jawaban di') else pecah(r[1])
                lisan5.append({'q': pecah(r[0]), 'a': a, 'tip': r[2].strip() if len(r) > 2 else '', 'dari': code})
assert len(lisan5) >= 3 and all(z['q']['jp'] and z['a']['jp'] and z['a']['ro'] and z['a']['ar'] for z in lisan5), len(lisan5)
# Tips & Trik (GLB-05): tabel Tahap | No | Tips | Acuan [| Alasan bila kelak ditambahkan di dokumen]
t0 = [k for k, (t, sx) in enumerate(G) if t.startswith('h') and 'GLB-05' in sx][0]
tb = [v for t, v in G[t0:t0 + 6] if t == 'table'][0]
hd = [h.strip().lower() for h in tb[0]]
tips = [{'tahap': r[hd.index('tahap')].strip(), 'no': int(r[hd.index('no')]), 'tips': r[hd.index('tips')].strip(), 'acuan': r[hd.index('acuan')].strip(),
         'alasan': r[hd.index('alasan')].strip() if 'alasan' in hd else ''} for r in tb[1:]]
assert [z['no'] for z in tips] == list(range(1, len(tips) + 1)) and len(tips) == 8, len(tips)
assert all(z['acuan'] in slides or z['acuan'].startswith('GLB') for z in tips), [z['acuan'] for z in tips]
# Kata Mutiara (GLB-07): tabel Bab | Slide | Kata Mutiara
m0 = [k for k, (t, sx) in enumerate(G) if t.startswith('h') and 'GLB-07' in sx][0]
mt = [v for t, v in G[m0:m0 + 14] if t == 'table' and v[0][0].strip().lower() == 'bab'][0]
mutiara = []
for r in mt[1:]:
    bn = int(re.search(r'\d', r[0]).group())
    mq = re.search(r'[“"](.+?)[”"]', r[2]); teks = (mq.group(1) if mq else r[2]).strip()
    rg = [c for c in BAB[bn - 1]['slides'] if slides[c]['tpl'] == 'T17']
    mutiara.append({'bab': bn, 'slide': rg[0] if rg else '', 'teks': teks})
assert [z['bab'] for z in mutiara] == [1, 2, 3, 4, 5, 6] and all(z['teks'] and z['slide'] for z in mutiara), mutiara
# kutipan di slide rangkuman harus sama dengan tabel
for z in mutiara:
    q = [bl['p'] for bl in slides[z['slide']]['screen'] if 'p' in bl and 'Kata Mutiara' in bl['p']]
    assert q and z['teks'].rstrip('.') in q[0], (z['slide'], z['teks'], q)
# Pre-test memakai 10 dari 20 butir bank Evaluasi Sumatif (post-test tetap 20 butir, memuat 10 butir yang sama).
# Dipilih agar: semua bab terwakili secara proporsional (Bab 1:1, 2:2, 3:2, 4:2, 5:2, 6:1), butir berdiri sendiri (tanpa audio/gambar;
# butir 14 = soal menyimak dibuang), ragam jenis (situasi, konsep/fakta, penerapan, mendeteksi kesalahan), dan kunci seimbang (A3 B2 C3 D2).
# Nomor = urutan butir di bank (1-20). Ubah di sini lalu jalankan ulang skrip ini.
PRE10 = [1, 3, 5, 6, 8, 12, 13, 15, 16, 18]
assert PRE10 == sorted(set(PRE10)) and all(1 <= n <= len(pre) for n in PRE10), PRE10
assert {pre[n - 1]['bab'] for n in PRE10} == {1, 2, 3, 4, 5, 6}, 'setiap bab harus terwakili'
preSub = [n - 1 for n in PRE10]
data = {'bab': BAB, 'preSub': preSub, 'latih': latih, 'lisan5': lisan5, 'tips': tips, 'mutiara': mutiara, 'eval': EVAL, 'pre': pre, 'sim': sim, 'slides': slides, 'order': order}
js = '/* Dibuat otomatis dari naskah materi dan storyboard (gen_data.py). Jangan diedit manual. */\nwindow.MN_DATA = ' + json.dumps(data, ensure_ascii=False) + ';\n'
open('js/data/kursus.js', 'w').write(js)
print('ok', len(js), {n: len(b['slides']) for n, b in enumerate(BAB, 1)}, len(sim), len(pre))
print(json.dumps(pre[13], ensure_ascii=False)[:500])
print(json.dumps(slides['B1-05'], ensure_ascii=False)[:600])
print([k for k in slides if not k.startswith('B')])
