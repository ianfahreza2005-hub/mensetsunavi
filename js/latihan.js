/* Mensetsu Navi — GLB-04 Latihan Pertanyaan Acak.
   Bank 25 pertanyaan: D.latih (dibuat gen_data.py dari dokumen Fitur Global; contoh jawaban diambil dari slide Bab 2, 4, 5).
   Dua mode (Fitur_Global.md):
     Dengar      : audio pertanyaan (teks disembunyikan) → pilih topik → benar/salah, teks, romaji, arti, contoh jawaban
     Jawab-rekam : audio → 5 detik bersiap → rekam (maks. 60 dtk) → analisis Lapis 1 (MN_SUARA) → bandingkan dengan contoh jawaban
   Tidak dinilai. Suara pertanyaan memakai suara ja-JP bawaan perangkat sampai rekaman penutur asli ada.
   Progres: MN_STORE.get().latih = { pref:{mode,n,kec}, ulang:[no pertanyaan], terakhir:{...} }

   API: MN_LATIH.mount(root, api) — api: { esc, ic, naviSay, bindSpeak, sayJa(teks, rate, onend), toast } */
(function () {
  var D = window.MN_DATA, ST = window.MN_STORE, SU = window.MN_SUARA;
  var SIAP_DETIK = 5, MAKS_REKAM = 60;

  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function prefs() {
    var S = ST.get(); if (!S.latih || typeof S.latih !== 'object') S.latih = {};
    var l = S.latih; if (!l.pref) l.pref = { mode: 'dengar', n: 5, kec: 'normal' }; if (!l.ulang) l.ulang = [];
    return l;
  }
  /* false hanya bila daftar suara sudah termuat dan tidak ada suara Jepang */
  function adaSuaraJa() {
    if (!window.speechSynthesis) return false;
    var v = speechSynthesis.getVoices(); return !v.length || v.some(function (x) { return /^ja/i.test(x.lang); });
  }

  function mount(root, api) {
    var esc = api.esc, ic = api.ic, bank = D.latih || [], L = prefs(), sesi = null, stream = null, rec = null, tm = [], tok = 0;
    var topik = []; bank.forEach(function (q) { if (topik.indexOf(q.topik) < 0) topik.push(q.topik); });

    function tmr(fn, ms) { var t = setTimeout(fn, ms); tm.push(t); return t; }
    function iv(fn, ms) { var t = setInterval(fn, ms); tm.push(t); return t; }
    function bersih() {
      tm.forEach(function (t) { clearTimeout(t); clearInterval(t); }); tm = []; tok++;
      if (rec) { try { rec.stop(); } catch (e) { /* sudah berhenti */ } rec = null; }
      if (stream) { stream.getTracks().forEach(function (x) { x.stop(); }); stream = null; }
      if (window.speechSynthesis) speechSynthesis.cancel();
    }
    window.addEventListener('hashchange', function h() { if (!document.body.contains(root)) { bersih(); window.removeEventListener('hashchange', h); } });

    function rate() { return L.pref.kec === 'pelan' ? 0.6 : 0.85; }
    /* putar teks Jepang; cb dipanggil saat selesai (atau bila suara tidak ada) */
    function bicara(teks, cb) {
      var my = ++tok, done = false;
      function fin() { if (done || my !== tok) return; done = true; cb && cb(); }
      if (!api.sayJa(teks, rate(), fin)) { if (cb) tmr(fin, 300); return false; }
      tmr(fin, Math.round(teks.length * 250 / rate()) + 2500);
      return true;
    }
    function simpan() { ST.save(); }
    function show(html) { root.innerHTML = '<div class="lt">' + html + '</div>'; }
    function prog() { var tot = sesi.soal.length; return '<div class="kv-prog"><span>Soal ' + (sesi.i + 1) + ' dari ' + tot + '</span><b><i style="width:' + Math.round(sesi.i / tot * 100) + '%"></i></b></div>'; }
    function kal(k, big) { return '<div class="lt-kal"><span class="jp ' + (big ? 'kv-mid' : 'lt-jp') + '">' + esc(k.jp) + '</span><button class="ix-sp lt-say" data-t="' + esc(k.jp) + '" aria-label="Dengarkan">' + ic('speaker') + '</button>' +
      (k.ro ? '<div class="ix-ro">' + esc(k.ro) + '</div>' : '') + (k.ar ? '<div class="ix-ar peek">' + esc(k.ar) + '</div>' : '') + '</div>'; }
    function bindSay() {
      root.querySelectorAll('.lt-say').forEach(function (b) { b.addEventListener('click', function () { tok++; if (!api.sayJa(b.dataset.t, rate())) api.toast('Suara Jepang belum tersedia di perangkat ini.'); }); });
    }
    function jawabanHtml(q) {
      return '<div class="card lt-ans"><b>Contoh jawaban</b>' + (q.mirip ? '<p class="mini">Contoh dari soal serupa: ' + esc('「' + q.mirip + '」') + '</p>' : '') + kal(q.a) + '</div>';
    }

    /* ================================================== PENGATURAN */
    function chip(attr, val, label, on) { return '<button class="kv-chip' + (on ? ' on' : '') + '" data-' + attr + '="' + val + '" aria-pressed="' + !!on + '">' + label + '</button>'; }
    function drawSetup() {
      var p = L.pref, n = L.ulang.length, narasi = D.slides['GLB-04'].narasi;
      var modes = [['dengar', 'Dengar', 'Dengarkan pertanyaan, lalu tebak topiknya. Melatih menyimak.'], ['rekam', 'Jawab-rekam', 'Dengarkan, bersiap 5 detik, lalu jawab dengan suaramu. Melatih menjawab spontan.']];
      show(api.naviSay('GLB-04', narasi, 'pose_semangat') +
        '<div class="lt-modes">' + modes.map(function (m) { return '<button class="lt-mode' + (p.mode === m[0] ? ' on' : '') + '" data-mode="' + m[0] + '" aria-pressed="' + (p.mode === m[0]) + '"><b>' + m[1] + '</b><span>' + m[2] + '</span></button>'; }).join('') + '</div>' +
        '<div class="lt-opt"><b>Jumlah pertanyaan</b><div class="kv-chips">' + [5, 10, 25].map(function (v) { return chip('n', v, v + ' soal', p.n === v); }).join('') + '</div></div>' +
        '<div class="lt-opt"><b>Kecepatan suara</b><div class="kv-chips">' + chip('kec', 'normal', 'Normal', p.kec === 'normal') + chip('kec', 'pelan', 'Pelan', p.kec === 'pelan') + '</div></div>' +
        '<button class="btn full lt-go">Mulai latihan</button>' +
        (n ? '<button class="btn ghost full lt-ulang">Latih yang perlu diulang (' + n + ')</button>' : '') +
        '<p class="mini">Tidak dinilai. Pertanyaan diputar acak dari bank ' + bank.length + ' soal.' + (adaSuaraJa() ? '' : ' Perangkat ini belum punya suara Jepang, jadi teks pertanyaan akan ditampilkan.') + '</p>');
      api.bindSpeak(root);
      root.querySelectorAll('.lt-mode').forEach(function (b) { b.addEventListener('click', function () { p.mode = b.dataset.mode; simpan(); drawSetup(); }); });
      root.querySelectorAll('.kv-chip').forEach(function (b) { b.addEventListener('click', function () { if (b.dataset.n) p.n = +b.dataset.n; else p.kec = b.dataset.kec; simpan(); drawSetup(); }); });
      root.querySelector('.lt-go').addEventListener('click', function () { mulai(false); });
      var u = root.querySelector('.lt-ulang'); if (u) u.addEventListener('click', function () { mulai(true); });
    }

    function mulai(hanyaUlang) {
      var p = L.pref, dasar = hanyaUlang ? bank.filter(function (q) { return L.ulang.indexOf(q.no) >= 0; }) : bank;
      sesi = { mode: p.mode, soal: shuffle(dasar).slice(0, p.n), i: 0, jawab: null, hasil: [], fase: '', rek: null };
      if (p.mode === 'rekam') {
        if (SU && SU.bisa()) SU.buka(function (s) { stream = s; soalRekam(); }, function () { stream = null; api.toast('Mikrofon tidak bisa dipakai. Kamu menjawab dengan suara keras tanpa rekaman.'); soalRekam(); });
        else { api.toast('Perangkat ini belum mendukung perekaman. Kamu menjawab dengan suara keras.'); soalRekam(); }
      } else soalDengar();
    }
    function berikut() {
      sesi.i++; sesi.jawab = null; sesi.rek = null;
      if (sesi.i >= sesi.soal.length) return ringkas();
      sesi.mode === 'dengar' ? soalDengar() : soalRekam();
    }

    /* ================================================== MODE DENGAR */
    function soalDengar() { drawDengar(); if (adaSuaraJa()) bicara(sesi.soal[sesi.i].q.jp); }
    function drawDengar() {
      var q = sesi.soal[sesi.i], j = sesi.jawab, suara = adaSuaraJa(), tebak = j !== null, benar = tebak && j === q.topik;
      show(prog() + '<div class="card lt-q">' +
        '<div class="lt-pb"><button class="lt-play" aria-label="Putar pertanyaan">' + ic('speaker') + '</button><div class="lt-pk"><button class="btn soft lt-again">Putar lagi</button><button class="btn soft lt-slow' + (L.pref.kec === 'pelan' ? ' on' : '') + '" aria-pressed="' + (L.pref.kec === 'pelan') + '">Pelan</button></div></div>' +
        (!suara && !tebak ? '<p class="mini">Suara tidak tersedia di perangkat ini. Teks pertanyaan ditampilkan:</p><span class="jp lt-jp">' + esc(q.q.jp) + '</span>' : '') +
        (tebak ? '<div class="lt-fb ' + (benar ? 'good' : 'bad') + '" aria-live="polite"><b>' + (benar ? 'Tepat!' : 'Belum tepat.') + '</b> Topiknya: ' + esc(q.topik) + '.</div>' + kal(q.q, true) : '<p class="lt-tanya">Pertanyaan tadi tentang apa?</p>') +
        '</div>' +
        '<div class="lt-grid">' + topik.map(function (t) {
          var cls = tebak ? (t === q.topik ? ' good' : t === j ? ' bad' : '') : '';
          return '<button class="ix-o lt-t' + cls + '"' + (tebak ? ' disabled' : '') + ' data-t="' + esc(t) + '">' + esc(t) + '</button>';
        }).join('') + '</div>' +
        (tebak ? '<button class="btn ghost full lt-lihat">Lihat contoh jawaban</button><div class="lt-jwb" hidden>' + jawabanHtml(q) + '</div><button class="btn full lt-next">' + (sesi.i + 1 >= sesi.soal.length ? 'Lihat ringkasan' : 'Pertanyaan berikutnya') + ic('next') + '</button>' : '') +
        '<p class="ix-hint"><button class="linkbtn lt-stop">Akhiri latihan</button></p>');
      bindSay();
      root.querySelector('.lt-play').addEventListener('click', function () { if (!bicara(q.q.jp)) api.toast('Suara Jepang belum tersedia di perangkat ini.'); });
      root.querySelector('.lt-again').addEventListener('click', function () { bicara(q.q.jp); });
      root.querySelector('.lt-slow').addEventListener('click', function () { L.pref.kec = L.pref.kec === 'pelan' ? 'normal' : 'pelan'; simpan(); this.classList.toggle('on', L.pref.kec === 'pelan'); bicara(q.q.jp); });
      root.querySelectorAll('.lt-t').forEach(function (b) {
        b.addEventListener('click', function () {
          sesi.jawab = b.dataset.t; sesi.hasil.push({ no: q.no, ok: sesi.jawab === q.topik }); tok++; if (window.speechSynthesis) speechSynthesis.cancel(); drawDengar();
          var fb = root.querySelector('.lt-fb'); if (fb) fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        });
      });
      var lh = root.querySelector('.lt-lihat'); if (lh) lh.addEventListener('click', function () { root.querySelector('.lt-jwb').hidden = false; lh.hidden = true; bindSay(); });
      var nx = root.querySelector('.lt-next'); if (nx) nx.addEventListener('click', berikut);
      root.querySelector('.lt-stop').addEventListener('click', function () { bersih(); sesi.i = sesi.soal.length; ringkas(true); });
    }

    /* ================================================== MODE JAWAB-REKAM */
    function soalRekam() {
      var q = sesi.soal[sesi.i]; sesi.fase = 'putar'; sesi.rek = null; drawRekam();
      if (!adaSuaraJa()) return;
      bicara(q.q.jp, function () { if (sesi && sesi.fase === 'putar') siap(); });
    }
    function siap() {
      sesi.fase = 'siap'; drawRekam(); var n = SIAP_DETIK;
      var t = iv(function () {
        n--; var c = root.querySelector('.lt-count'); if (c) c.textContent = n;
        if (n <= 0) { clearInterval(t); if (sesi.fase === 'siap') rekamSekarang(); }
      }, 1000);
    }
    function rekamSekarang() {
      tm.forEach(function (t) { clearInterval(t); }); tm = [];
      if (!stream) { sesi.fase = 'tanpa'; return drawRekam(); }
      sesi.fase = 'rekam'; drawRekam();
      var meter = root.querySelector('.lt-meter i'), waktu = root.querySelector('.lt-wkt');
      rec = SU.rekam(stream, { maks: MAKS_REKAM,
        onLevel: function (v) { if (meter) meter.style.transform = 'scaleX(' + Math.min(1, v).toFixed(3) + ')'; },
        onDetik: function (d) { if (waktu) waktu.textContent = Math.floor(d / 60) + ':' + ('0' + Math.floor(d % 60)).slice(-2) + ' / 1:00'; },
        onSelesai: function (h) { rec = null; sesi.rek = h; sesi.fase = 'hasil'; drawRekam(); } });
    }
    function drawRekam() {
      var q = sesi.soal[sesi.i], f = sesi.fase, h = sesi.rek, a = h && h.analisis, suara = adaSuaraJa(), body = '';
      if (f === 'putar') body = '<div class="lt-pb"><button class="lt-play" aria-label="Putar lagi">' + ic('speaker') + '</button><div class="lt-pk"><button class="btn soft lt-skip">Saya siap menjawab</button></div></div><p class="lt-tanya">' + (suara ? 'Dengarkan pertanyaan Tanaka-san…' : 'Suara tidak tersedia. Baca pertanyaannya:') + '</p>' + (suara ? '' : '<span class="jp lt-jp">' + esc(q.q.jp) + '</span>');
      else if (f === 'siap') body = '<p class="lt-tanya">Bersiaplah. Pola jawaban: <b>Jawab → Alasan → Semangat</b>.</p><div class="lt-count" aria-live="polite">' + SIAP_DETIK + '</div><div class="lt-pk"><button class="btn soft lt-skip">Mulai sekarang</button><button class="btn soft lt-again">Putar lagi</button></div>';
      else if (f === 'rekam') body = '<p class="lt-tanya"><span class="lt-dot"></span> Merekam… jawab sekarang.</p><div class="lt-meter" aria-hidden="true"><i></i></div><div class="lt-wkt">0:00 / 1:00</div><button class="btn full lt-stopr">Selesai menjawab</button>';
      else if (f === 'tanpa') body = '<p class="lt-tanya">Jawab dengan suara keras sekarang. Tidak ada rekaman di perangkat ini.</p><button class="btn full lt-selesai">Selesai menjawab</button>';
      else {
        body = '<div class="lt-fb good"><b>Jawabanmu selesai.</b> Lihat analisisnya, lalu bandingkan dengan contoh jawaban.</div>' + kal(q.q, true) +
          (h ? '<audio controls src="' + h.url + '"></audio>' : '') +
          (a && !a.kosong ? SU.gelombang(h.level, a.jeda) : '') +
          (a ? '<div class="lt-kart">' + a.kartu.map(function (k) { return '<div class="lt-k ' + k.t + '"><span>' + esc(k.k) + '</span><b>' + esc(k.v) + '</b><small>' + esc(k.s) + '</small></div>'; }).join('') + '</div><p class="mini">Analisis ini perkiraan otomatis (bergantung mikrofon), bukan nilai.</p>' : '') +
          '<button class="btn soft lt-ulangrek">Rekam ulang</button>';
      }
      show(prog() + '<div class="card lt-q">' + body + '</div>' + (f === 'hasil' ? jawabanHtml(q) +
        '<div class="kv-ans"><button class="btn ghost lt-lagi">Perlu latih lagi</button><button class="btn lt-cukup">Sudah cukup</button></div>' : '') +
        '<p class="ix-hint"><button class="linkbtn lt-stop">Akhiri latihan</button></p>');
      bindSay();
      var on = function (s, fn) { var e = root.querySelector(s); if (e) e.addEventListener('click', fn); };
      on('.lt-play', function () { bicara(q.q.jp); });
      on('.lt-again', function () { bicara(q.q.jp); });
      on('.lt-skip', function () { tok++; if (window.speechSynthesis) speechSynthesis.cancel(); tm.forEach(function (t) { clearInterval(t); clearTimeout(t); }); tm = []; rekamSekarang(); });
      on('.lt-stopr', function () { if (rec) rec.stop(); });
      on('.lt-selesai', function () { sesi.fase = 'hasil'; drawRekam(); });
      on('.lt-ulangrek', function () { if (h && h.url) URL.revokeObjectURL(h.url); sesi.rek = null; rekamSekarang(); });
      on('.lt-lagi', function () { sesi.hasil.push({ no: q.no, ok: false }); berikut(); });
      on('.lt-cukup', function () { sesi.hasil.push({ no: q.no, ok: true }); berikut(); });
      on('.lt-stop', function () { bersih(); sesi.i = sesi.soal.length; ringkas(true); });
    }

    /* ================================================== RINGKASAN */
    function ringkas(dihentikan) {
      bersih();
      var ok = sesi.hasil.filter(function (r) { return r.ok; }).length, tot = sesi.hasil.length, dengar = sesi.mode === 'dengar';
      var ulang = sesi.hasil.filter(function (r) { return !r.ok; }).map(function (r) { return r.no; });
      sesi.soal.forEach(function (q) { var k = L.ulang.indexOf(q.no); if (k >= 0 && sesi.hasil.some(function (r) { return r.no === q.no; })) L.ulang.splice(k, 1); });
      ulang.forEach(function (no) { if (L.ulang.indexOf(no) < 0) L.ulang.push(no); });
      L.terakhir = { mode: sesi.mode, n: tot, ok: ok, waktu: Date.now() }; simpan();
      var judul = !tot ? 'Latihan dihentikan' : dengar ? 'Topik yang tertebak: ' + ok + ' dari ' + tot : 'Kamu menjawab ' + tot + ' pertanyaan';
      var daftar = ulang.map(function (no) { var q = bank[no - 1]; return '<li><span class="jp">' + esc(q.q.jp) + '</span><br><span class="mini">' + esc(q.q.ar) + ' · ' + esc(q.topik) + '</span></li>'; }).join('');
      show('<div class="card kv-intro"><span class="chip">' + (dihentikan ? 'Dihentikan' : 'Latihan selesai') + '</span><h3 class="kv-sum">' + judul + '</h3>' +
        (tot ? '<p>' + (dengar ? 'Tidak dinilai. Ulangi yang belum tepat supaya telingamu makin terbiasa.' : (ok + ' dari ' + tot + ' ditandai "sudah cukup". Rekaman tidak disimpan; tidak dinilai.')) + '</p>' : '') + '</div>' +
        (ulang.length ? '<div class="card"><b>Perlu diulang (' + ulang.length + ')</b><ul class="lt-list">' + daftar + '</ul></div>' : (tot ? '<div class="lt-fb good"><b>Bagus!</b> Tidak ada pertanyaan yang perlu diulang.</div>' : '')) +
        '<div class="kv-ans"><button class="btn ghost lt-menu">Pengaturan</button>' + (ulang.length ? '<button class="btn lt-ulang2">Ulangi yang belum</button>' : '<button class="btn lt-lagi2">Latihan lagi</button>') + '</div>');
      root.querySelector('.lt-menu').addEventListener('click', function () { sesi = null; drawSetup(); });
      var u = root.querySelector('.lt-ulang2'); if (u) u.addEventListener('click', function () { mulai(true); });
      var g = root.querySelector('.lt-lagi2'); if (g) g.addEventListener('click', function () { mulai(false); });
    }

    drawSetup();
  }

  window.MN_LATIH = { mount: mount };
})();
