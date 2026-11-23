/* Mensetsu Navi — perekam suara + analisis Lapis 1 (durasi, jeda, volume, gelombang).
   Dipakai GLB-04 (mode Jawab-rekam); dirancang agar T15 (B4-15, B5-13) bisa memakainya juga.

   Target durasi mengikuti naskah B5-13: jawaban 10–30 detik. Ambang jeda dan volume TIDAK ada di naskah; angka di bawah adalah
   perkiraan sementara (bergantung mikrofon dan perangkat) dan perlu dikonfirmasi SME/dosen sebelum dipakai untuk penilaian.

   API:
     MN_SUARA.bisa()                       → boleh merekam di perangkat ini?
     MN_SUARA.buka(ok, gagal)              → minta izin mikrofon; ok(stream)
     MN_SUARA.rekam(stream, opsi)          → { stop() } ; opsi: { maks: detik, target:[min,maks] dtk, onLevel(0..1), onDetik(n), onSelesai(hasil) }
     hasil = { url, blob, durasi, level:[...tiap 0,1 dtk], analisis }
     MN_SUARA.analisis(level, [min,maks]?) → { durasi, mulai, jeda:[{dari,ke}], volume:'pelan'|'cukup'|'keras', kartu:[...] }
     MN_SUARA.gelombang(level, jeda)       → string SVG                                   */
(function () {
  var LANGKAH = 0.1;            /* detik per cuplikan level */
  var JEDA_MIN = 1.0;           /* diam ≥ 1 dtk di tengah jawaban dihitung jeda */
  var JEDA_PANJANG = 2.5;
  var TARGET = [10, 30];        /* detik, B5-13 */

  function bisa() { return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder); }

  function buka(ok, gagal) {
    if (!bisa()) { gagal && gagal(new Error('tidak didukung')); return; }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(ok, function (e) { gagal && gagal(e); });
  }

  function persen(a, p) { var s = a.slice().sort(function (x, y) { return x - y; }); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : 0; }

  function analisis(level, target) {
    var TG = target || TARGET;
    var n = level.length, dur = n * LANGKAH;
    var lantai = persen(level, 0.1), puncak = persen(level, 0.9);
    /* ambang relatif terhadap puncak suara; lantai kebisingan hanya dipakai bila memang jauh di bawah puncak
       (bila peserta bicara terus tanpa diam, persentil-10 sudah setara suara bicara dan harus diabaikan) */
    var dasar = puncak * 0.15, ambang = Math.max(0.015, dasar, lantai < dasar ? lantai * 2.5 : 0);
    var bicara = level.map(function (v) { return v > ambang; });
    var a = bicara.indexOf(true), b = bicara.lastIndexOf(true);
    if (a < 0) return { durasi: 0, mulai: dur, jeda: [], volume: 'pelan', kosong: true, level: level, ambang: ambang, kartu: [{ k: 'Durasi', v: '0 dtk', t: 'mid', s: 'Suaramu tidak terdeteksi. Cek mikrofon dan dekatkan perangkat, lalu coba lagi.' }] };
    var jeda = [], i = a;
    while (i <= b) {
      if (!bicara[i]) { var j = i; while (j <= b && !bicara[j]) j++; if ((j - i) * LANGKAH >= JEDA_MIN) jeda.push({ dari: i * LANGKAH, ke: j * LANGKAH }); i = j; } else i++;
    }
    var durBicara = (b - a + 1) * LANGKAH, mulai = a * LANGKAH;
    var vb = level.filter(function (v) { return v > ambang; }), v75 = persen(vb, 0.75);
    var volume = v75 < 0.04 ? 'pelan' : v75 > 0.3 ? 'keras' : 'cukup';
    var panjang = jeda.filter(function (z) { return z.ke - z.dari >= JEDA_PANJANG; }).length;
    var kartu = [];
    var dd = Math.round(durBicara);
    var tg = TG[0] + '–' + TG[1] + ' dtk';
    kartu.push(dd < TG[0] ? { k: 'Durasi', v: dd + ' dtk', t: 'mid', s: 'Agak singkat. Target ' + tg + (TG[0] >= 30 ? ': tambahkan satu hal di blok latar belakang atau satu bukti.' : ': tambahkan satu alasan setelah jawabanmu.') }
      : dd > TG[1] ? { k: 'Durasi', v: dd + ' dtk', t: 'mid', s: 'Agak panjang. Target ' + tg + (TG[0] >= 30 ? ': ringkas satu hal di blok latar belakang atau lewati bukti.' : ': jawab, satu alasan, lalu semangat.') }
      : { k: 'Durasi', v: dd + ' dtk', t: 'good', s: 'Pas. Target ' + tg + '.' });
    kartu.push(jeda.length === 0 ? { k: 'Jeda', v: 'lancar', t: 'good', s: 'Tidak ada jeda panjang. Jawabanmu mengalir.' }
      : panjang > 0 ? { k: 'Jeda', v: jeda.length + ' jeda', t: 'mid', s: 'Ada ' + panjang + ' jeda panjang (≥ ' + JEDA_PANJANG + ' dtk). Boleh berpikir sebentar, lalu lanjut; 「ええと」 (eeto) mengisi jeda dengan sopan.' }
      : { k: 'Jeda', v: jeda.length + ' jeda', t: 'good', s: 'Ada jeda pendek. Wajar untuk mengambil napas.' });
    kartu.push(volume === 'cukup' ? { k: 'Volume', v: 'cukup', t: 'good', s: 'Suaramu cukup jelas (perkiraan; bergantung mikrofon).' }
      : volume === 'pelan' ? { k: 'Volume', v: 'pelan', t: 'mid', s: 'Agak pelan. Bicara lebih lantang dan dekatkan perangkat.' }
      : { k: 'Volume', v: 'keras', t: 'mid', s: 'Agak keras atau terlalu dekat dengan mikrofon. Jauhkan sedikit.' });
    if (mulai > 3) kartu.push({ k: 'Mulai', v: Math.round(mulai) + ' dtk', t: 'mid', s: 'Kamu mulai bicara setelah ' + Math.round(mulai) + ' dtk. Coba mulai lebih cepat dengan 「はい」 (hai).' });
    return { durasi: durBicara, mulai: mulai, jeda: jeda, volume: volume, level: level, ambang: ambang, kartu: kartu };
  }

  /* gelombang sederhana: ±75 batang; batang di dalam jeda diberi kelas "jd" */
  function gelombang(level, jeda) {
    var N = 75, n = level.length || 1, maks = Math.max.apply(null, level.concat([0.05])), out = '';
    for (var k = 0; k < N; k++) {
      var a = Math.floor(k * n / N), b = Math.max(a + 1, Math.floor((k + 1) * n / N)), m = 0;
      for (var i = a; i < b && i < n; i++) if (level[i] > m) m = level[i];
      var h = Math.max(2, Math.round(m / maks * 52)), t = (a + b) / 2 * LANGKAH;
      var j = (jeda || []).some(function (z) { return t >= z.dari && t <= z.ke; });
      out += '<rect class="' + (j ? 'jd' : '') + '" x="' + (k * 4 + 0.5) + '" y="' + (30 - h / 2) + '" width="3" height="' + h + '" rx="1.5"/>';
    }
    return '<svg class="gel" viewBox="0 0 300 60" role="img" aria-label="Grafik gelombang suara, jeda ditandai warna kuning">' + out + '</svg>';
  }

  function rekam(stream, o) {
    o = o || {};
    var maks = o.maks || 60, level = [], chunks = [], ctx = null, an = null, buf = null, tick = null, t0 = Date.now(), selesai = false, mr;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) { ctx = new AC(); an = ctx.createAnalyser(); an.fftSize = 1024; ctx.createMediaStreamSource(stream).connect(an); buf = new Uint8Array(an.fftSize); }
    } catch (e) { an = null; }
    try { mr = new MediaRecorder(stream); } catch (e) { o.onSelesai && o.onSelesai(null); return { stop: function () {} }; }
    mr.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
    mr.onstop = function () {
      clearInterval(tick); try { ctx && ctx.close(); } catch (e) { /* sudah tertutup */ }
      var blob = new Blob(chunks, { type: mr.mimeType || 'audio/webm' });
      o.onSelesai && o.onSelesai({ blob: blob, url: URL.createObjectURL(blob), durasi: level.length * LANGKAH, level: level, analisis: an ? analisis(level, o.target) : null });
    };
    mr.start();
    tick = setInterval(function () {
      var det = (Date.now() - t0) / 1000, v = 0;
      if (an) { an.getByteTimeDomainData(buf); var s = 0; for (var i = 0; i < buf.length; i++) { var d = (buf[i] - 128) / 128; s += d * d; } v = Math.sqrt(s / buf.length); }
      level.push(v); o.onLevel && o.onLevel(Math.min(1, v * 3));
      o.onDetik && o.onDetik(det);
      if (det >= maks) stop();
    }, LANGKAH * 1000);
    function stop() { if (selesai) return; selesai = true; try { mr.state !== 'inactive' && mr.stop(); } catch (e) { /* sudah berhenti */ } }
    return { stop: stop };
  }

  window.MN_SUARA = { bisa: bisa, buka: buka, rekam: rekam, analisis: analisis, gelombang: gelombang, TARGET: TARGET };
})();
