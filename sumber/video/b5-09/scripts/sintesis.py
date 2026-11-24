"""Sintesis kalimat video B5-09 dengan VOICEVOX Core 0.17.1 (suara 雀松朱司).

Keluaran (di folder argumen 1):
  suzumatsu/<id>.wav          audio per kalimat (24 kHz mono)
  suzumatsu/waktu.json        durasi tiap kalimat + waktu mulai tiap frasa aksen (untuk sinkron teks di video)
Pemakaian: <venv>/bin/python sintesis.py <folder-keluaran>
Lokasi berkas VOICEVOX diatur lewat VV_ORT, VV_DIC, VV_VVM (lihat README).
"""
import json, os, sys
from voicevox_core.blocking import Onnxruntime, OpenJtalk, Synthesizer, VoiceModelFile

AKAR = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1]
ORT = os.environ.get('VV_ORT', os.path.join(AKAR, 'ort/voicevox_onnxruntime-linux-x64-1.23.2/lib/libvoicevox_onnxruntime.so.1.23.2'))
DIC = os.environ.get('VV_DIC', os.path.join(AKAR, 'dict/open_jtalk_dic_utf_8-1.11'))
VVM = os.environ.get('VV_VVM', os.path.join(AKAR, 'vvms'))

# naskah persis dari slide B5-09 (tabel ungkapan penyelamat, langkah bila tetap tidak paham, kotak "Gugup")
KALIMAT = [
    ('t1', 'すみません、もう一度お願いします。'),
    ('t2', 'すみません、ゆっくり話していただけませんか。'),
    ('j1', '申し訳ありません。'),          # dua kalimat disintesis terpisah: jeda di antaranya diatur di video
    ('j2', 'まだ分からないところがあります。'),
    ('g1', '少し考えてもいいですか。'),
]
VVM_FILE, SID = '12.vvm', 52   # 雀松朱司 ノーマル

ort = Onnxruntime.load_once(filename=ORT)
syn = Synthesizer(ort, OpenJtalk(DIC))
with VoiceModelFile.open(os.path.join(VVM, VVM_FILE)) as m:
    syn.load_voice_model(m)

d = os.path.join(OUT, 'suzumatsu'); os.makedirs(d, exist_ok=True)
info = []
for kid, teks in KALIMAT:
    q = syn.create_audio_query(teks, SID)
    q.speed_scale = 0.95          # sedikit lebih pelan: untuk pembelajar N4
    q.intonation_scale = 1.12     # intonasi sopan, tidak datar
    q.pre_phoneme_length = 0.12
    q.post_phoneme_length = 0.2
    wav = syn.synthesis(q, SID)
    open(os.path.join(d, kid + '.wav'), 'wb').write(wav)
    # waktu mulai tiap frasa aksen (detik), memperhitungkan speed_scale
    t = q.pre_phoneme_length / q.speed_scale
    frasa = []
    for ap in q.accent_phrases:
        mulai = t
        for mo in ap.moras:
            t += ((mo.consonant_length or 0) + mo.vowel_length) / q.speed_scale
        frasa.append({'kana': ''.join(mo.text for mo in ap.moras), 'mulai': round(mulai, 3), 'selesai': round(t, 3)})
        pm = ap.pause_mora
        if pm:
            g = (lambda k: pm.get(k)) if isinstance(pm, dict) else (lambda k: getattr(pm, k))
            t += ((g('consonant_length') or 0) + g('vowel_length')) / q.speed_scale
    dur = t + q.post_phoneme_length / q.speed_scale
    info.append({'id': kid, 'teks': teks, 'kana': q.kana, 'durasi': round(dur, 3), 'frasa': frasa})
json.dump(info, open(os.path.join(d, 'waktu.json'), 'w'), ensure_ascii=False, indent=1)
for x in info:
    print(x['id'], x['durasi'], x['kana'], [p['kana'] for p in x['frasa']])
