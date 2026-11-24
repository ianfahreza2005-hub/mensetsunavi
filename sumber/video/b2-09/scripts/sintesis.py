"""Sintesis 4 kalimat contoh telepon B2-09 dengan VOICEVOX Core 0.17.1.

Keluaran (di folder argumen 1):
  <suara>/k1.wav … k4.wav     audio per kalimat (24 kHz mono)
  <suara>/waktu.json          durasi tiap kalimat + waktu mulai tiap frasa aksen (untuk sinkron teks di video)
Pemakaian: venv/bin/python sintesis.py <folder-keluaran>
"""
import json, os, sys, dataclasses
from voicevox_core.blocking import Onnxruntime, OpenJtalk, Synthesizer, VoiceModelFile

AKAR = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1]
# lokasi berkas VOICEVOX (sesuaikan): onnxruntime, kamus Open JTalk, folder VVM
ORT = os.environ.get('VV_ORT', os.path.join(AKAR, 'ort/voicevox_onnxruntime-linux-x64-1.23.2/lib/libvoicevox_onnxruntime.so.1.23.2'))
DIC = os.environ.get('VV_DIC', os.path.join(AKAR, 'dict/open_jtalk_dic_utf_8-1.11'))
VVM = os.environ.get('VV_VVM', os.path.join(AKAR, 'vvms'))

# naskah persis dari slide B2-09; 〇〇 (tempat nama) dibaca まるまる, koma ditambahkan untuk jeda alami
KALIMAT = [
    'お忙しいところ、申し訳ありません。',
    '本日、10時から面接の、まるまると申します。',
    '電車が遅れていて、10時15分ごろに着きます。',
    '申し訳ありません。',
]
SUARA = {'suzumatsu': ('12.vvm', 52), 'kurono': ('4.vvm', 11)}

ort = Onnxruntime.load_once(filename=ORT)
syn = Synthesizer(ort, OpenJtalk(DIC))
for f, _ in SUARA.values():
    with VoiceModelFile.open(os.path.join(VVM, f)) as m:
        syn.load_voice_model(m)

for nama, (_, sid) in SUARA.items():
    d = os.path.join(OUT, nama); os.makedirs(d, exist_ok=True)
    info = []
    for i, teks in enumerate(KALIMAT, 1):
        q = syn.create_audio_query(teks, sid)
        q.speed_scale = 0.96          # sedikit lebih pelan: untuk pembelajar N4
        q.intonation_scale = 1.12     # intonasi sopan, tidak datar
        q.pre_phoneme_length = 0.12
        q.post_phoneme_length = 0.18
        wav = syn.synthesis(q, sid)
        open(os.path.join(d, f'k{i}.wav'), 'wb').write(wav)
        # waktu mulai tiap frasa aksen (detik), memperhitungkan speed_scale
        t = q.pre_phoneme_length / q.speed_scale
        frasa = []
        for ap in q.accent_phrases:
            mulai = t
            for m in ap.moras:
                t += ((m.consonant_length or 0) + m.vowel_length) / q.speed_scale
            teks_ap = ''.join(m.text for m in ap.moras)
            frasa.append({'kana': teks_ap, 'mulai': round(mulai, 3), 'selesai': round(t, 3)})
            pm = ap.pause_mora
            if pm:
                g = (lambda k: pm.get(k)) if isinstance(pm, dict) else (lambda k: getattr(pm, k))
                t += ((g('consonant_length') or 0) + g('vowel_length')) / q.speed_scale
        dur = t + q.post_phoneme_length / q.speed_scale
        info.append({'teks': teks, 'kana': q.kana, 'durasi': round(dur, 3), 'frasa': frasa})
    json.dump(info, open(os.path.join(d, 'waktu.json'), 'w'), ensure_ascii=False, indent=1)
    print(nama, [(x['durasi'], x['kana']) for x in info])
