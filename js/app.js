/* Mensetsu Navi — kerangka aplikasi (router + layar).
   Rute (hash):
   #/mulai            layar pembuka (GLB-00)
   #/pre/0..11        pre-test (petunjuk, 10 soal terpilih, hasil)
   #/rak              rak bab 3D (beranda)
   #/bab/N/K          slide ke-K di Bab N (0 = sampul)
   #/kuis/N           kuis formatif Bab N
   #/sim/0..15        simulasi mensetsu
   #/post/0..21       post-test
   #/rapor            rapor kesiapan
   #/hal/GLB-0x       fitur global
   #/atur             pengaturan */
(function () {
  'use strict';
  var D = window.MN_DATA, ST = window.MN_STORE;
  var view = document.getElementById('view');
  var rakEl = document.getElementById('rak');
  var saranEl = document.getElementById('navi-saran');

  /* ------------------------------------------------------------ util */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function md(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); }
  function go(h) { location.hash = h; }
  function navi(name) { return 'assets/navi/' + name + '.webp'; }
  var IC = {
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>', back: '<path d="M15 5l-7 7 7 7"/>', next: '<path d="M9 5l7 7-7 7"/>',
    speaker: '<path d="M5 9v6h4l5 4V5L9 9H5z"/><path d="M17 9a4 4 0 0 1 0 6"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>',
    home: '<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z"/>', check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>', bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 13v4M8 21h8M10 17h4"/>', play: '<path d="M8 5v14l11-7z" fill="currentColor"/>'
  };
  function ic(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[n] + '</svg>'; }
  var SG = '<svg class="sg" aria-hidden="true"><defs><pattern id="sgp" width="48" height="24" patternUnits="userSpaceOnUse"><g fill="none" stroke="#fff" stroke-width="1.4"><circle cx="24" cy="24" r="21"/><circle cx="24" cy="24" r="14"/><circle cx="24" cy="24" r="7"/><circle cx="0" cy="12" r="21"/><circle cx="0" cy="12" r="14"/><circle cx="48" cy="12" r="21"/><circle cx="48" cy="12" r="14"/></g></pattern></defs><rect width="100%" height="100%" fill="url(#sgp)"/></svg>';
  var toastT;
  function toast(msg) {
    var t = document.getElementById('toast'); t.textContent = msg; t.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('on'); }, 2800);
  }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* ------------------------------------------------------------ suara: rekaman bila ada, jika tidak suara bawaan peramban */
  var curAudio = null;
  function stopVoice() { if (curAudio) { curAudio.pause(); curAudio = null; } if (window.speechSynthesis) speechSynthesis.cancel(); }
  function speak(code, text, dir) {
    stopVoice();
    var a = new Audio('assets/audio/' + (dir || 'narasi') + '/' + code + '.mp3');
    curAudio = a;
    a.addEventListener('error', function () {
      if (curAudio !== a || !window.speechSynthesis || !text) return;
      var u = new SpeechSynthesisUtterance(text.replace(/[「」]/g, '')); u.lang = 'id-ID'; u.rate = ST.set().kec === 'pelan' ? 0.8 : 1;
      speechSynthesis.speak(u);
    });
    a.play().catch(function () {});
  }

  /* GLB-07: Kata Mutiara diucapkan Navi (assets/audio/mutiara/B<bab>.mp3 bila ada, jika belum suara bawaan peramban) */
  function sayMutiara(bab, teks) { speak('B' + bab, teks, 'mutiara'); }

  /* ------------------------------------------------------------ bagian bersama */
  function blocks(list, code) {
    if (window.MN_IX) return MN_IX.blocks(code || '', list);
    var html = '', items = '';
    function flush() { if (items) { html += '<ul class="items">' + items + '</ul>'; items = ''; } }
    (list || []).forEach(function (b) {
      if (b.li != null) {
        items += '<li class="l' + (b.lvl || 0) + '">' + (b.num ? '<span class="n">' + esc(b.num.replace('.', '')) + '</span>' : '') + '<span>' + md(b.li) + '</span></li>';
        return;
      }
      flush();
      if (b.p != null) html += '<p>' + md(b.p) + '</p>';
      else if (b.table) {
        html += '<div class="tbl"><table>' + b.table.map(function (r, i) {
          return '<tr>' + r.map(function (c) { return i === 0 ? '<th>' + md(c) + '</th>' : '<td>' + md(c) + '</td>'; }).join('') + '</tr>';
        }).join('') + '</table></div>';
      }
    });
    flush();
    return html;
  }
  /* "B3-04" -> { href, judul, bab, k } untuk tautan Pelajari / Petunjuk; null bila kode tidak dikenal */
  function slideLink(kode) {
    var sl = D.slides[kode]; if (!sl) return null;
    for (var n = 0; n < D.bab.length; n++) { var k = D.bab[n].slides.indexOf(kode); if (k >= 0) return { href: '#/bab/' + D.bab[n].no + '/' + k, judul: sl.title.replace(/^Aktivitas:\s*/, ''), bab: D.bab[n].no, k: k }; }
    return /^GLB/.test(kode) ? { href: '#/hal/' + kode, judul: sl.title, bab: 0, k: -1 } : null;
  }
  function naviSay(code, text, pose, nobtn) {
    if (!text || /^tidak ada/i.test(text)) return '';
    return '<div class="navi-say"><img src="' + navi(pose || 'exp_senang') + '" alt="Navi"><div class="bubble">' + esc(text) +
      (nobtn ? '' : '<div><button class="btn soft" data-speak="' + esc(code) + '">' + ic('speaker') + 'Dengarkan</button></div>') + '</div></div>';
  }
  function bindSpeak(root) {
    root.querySelectorAll('[data-speak]').forEach(function (b) {
      b.addEventListener('click', function () { var s = D.slides[b.dataset.speak]; speak(b.dataset.speak, s ? s.narasi : ''); });
    });
  }
  function topbar(sub, title, pct, col) {
    return '<header class="topbar" style="--c:' + (col || 'var(--pri)') + '"><div class="row">' +
      '<button class="icon-btn" data-menu aria-label="Menu">' + ic('menu') + '</button>' +
      '<div class="tt"><span class="sub">' + esc(sub) + '</span><span class="title">' + esc(title) + '</span></div>' +
      '<a class="icon-btn" href="#/rak" aria-label="Kembali ke rak bab">' + ic('home') + '</a></div>' +
      '<div class="bar"><i style="width:' + Math.round((pct || 0) * 100) + '%"></i></div></header>';
  }
  function bottombar(prev, label, next, nextLabel, nextDisabled) {
    return '<footer class="bottombar">' +
      (prev ? '<a class="btn ghost" href="' + prev + '">' + ic('back') + '<span>Kembali</span></a>' : '<span style="width:120px"></span>') +
      '<span class="no">' + esc(label || '') + '</span>' +
      (next ? '<a class="btn" href="' + next + '"' + (nextDisabled ? ' aria-disabled="true" style="pointer-events:none;background:var(--line);color:var(--ink2);box-shadow:none"' : '') + '>' + esc(nextLabel || 'Lanjut') + ic('next') + '</a>' : '<span style="width:120px"></span>') +
      '</footer>';
  }
  function devNote(s) {
    if (!ST.get().unlockAll) return '';
    return '<details class="visual-note"><summary><b>Mode uji · ' + esc(s.code + (s.tpl ? ' · ' + s.tpl : '')) + '</b></summary><p><b>Treatment:</b> ' + esc(s.treat) + '</p>' + (s.visual ? '<p><b>Rencana visual:</b> ' + esc(s.visual) + '</p>' : '') + '</details>';
  }
  function visualNote(s) {
    if (!s.visual) return '';
    return '<details class="visual-note"><summary><b>Rencana visual (storyboard)</b></summary>' + esc(s.visual) + '</details>';
  }
  /* GLB-02: tombol Romaji dan Arti (bawaan menyala) berlaku di semua slide; kelasnya dipasang di <body> */
  function setClasses() { var t = ST.set(); return (t.ro ? '' : ' no-ro') + (t.ar ? '' : ' no-ar'); }
  function gtog() {
    var t = ST.set();
    return '<span class="gtog" role="group" aria-label="Tampilan Romaji dan Arti"><button class="gt' + (t.ro ? ' on' : '') + '" data-g="ro" aria-pressed="' + t.ro + '">Romaji</button>' +
      '<button class="gt' + (t.ar ? ' on' : '') + '" data-g="ar" aria-pressed="' + t.ar + '">Arti</button></span>';
  }
  function setG(g, on) {
    var t = ST.set(); t[g] = on; ST.save(); document.body.classList.toggle('no-' + g, !on);
    view.querySelectorAll('.gt[data-g="' + g + '"]').forEach(function (x) { x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); });
  }
  var hashTampil = location.hash;
  function show(html, opts) {
    stopVoice();
    rakEl.hidden = true; if (window.MN_RAK) window.MN_RAK.hide();
    saranEl.hidden = true;
    view.hidden = false;
    document.body.className = ((opts && opts.dark) ? 'sim' : '') + setClasses();
    view.innerHTML = html;
    view.querySelectorAll('.screen').forEach(function (sc) { for (var c = sc.firstElementChild; c; c = c.nextElementSibling) if (c.classList.contains('bottombar')) { sc.classList.add('has-bar'); break; } });
    var sc0 = view.firstElementChild;   /* layar isi (bukan pembuka/simulasi) dibungkus kerangka laptop */
    if (!(opts && opts.dark) && sc0 && sc0.classList.contains('screen') && !sc0.classList.contains('start')) {
      var wrap0 = document.createElement('div'); wrap0.className = 'with-side shell';
      view.replaceChild(wrap0, sc0); wrap0.innerHTML = sidebar(curDariHash()); wrap0.appendChild(sc0);
    }
    view.querySelectorAll('.with-side').forEach(function (ws) { ws.insertAdjacentHTML('afterbegin', appbar(ws)); });
    view.querySelectorAll('.gt').forEach(function (b) { b.addEventListener('click', function () { setG(b.dataset.g, !ST.set()[b.dataset.g]); }); });
    var ab = view.querySelector('.ab-say');
    if (ab) ab.addEventListener('click', function () { var sp = view.querySelector('.screen [data-speak]'); if (sp) sp.click(); else toast('Layar ini tidak punya audio narasi.'); });
    window.scrollTo(0, 0);
    view.querySelectorAll('[data-menu]').forEach(function (b) { b.addEventListener('click', openMenu); });
    bindSpeak(view);
    /* gerak masuk layar (js/gerak.js) hanya saat berpindah layar, bukan saat layar yang sama digambar ulang (mis. memilih jawaban) */
    if (window.MN_GERAK && location.hash !== hashTampil) MN_GERAK.jadwal();
    hashTampil = location.hash;
  }

  /* ------------------------------------------------------------ pembuka (GLB-00) */
  function scrMulai() {
    var S = ST.get();
    show('<div class="screen start">' +
      '<div class="hero">' + SG + '<div class="eyebrow">PEMANDU WAWANCARA KERJA</div><h1>Mensetsu Navi</h1><div class="jp">面接ナビ</div>' +
      '<img src="' + navi('pose_melambai') + '" alt="Navi melambai"></div>' +
      '<div class="body start-body">' +
      '<h2 class="slide-h">Halo! Aku Navi, pemandumu.</h2>' +
      '<p class="treat" style="font-size:15px">Wawancara kerja di Jepang bukan hanya soal bahasa, tetapi juga sikap. Kita mulai dengan pre-test singkat untuk melihat kemampuan awalmu.</p>' +
      '<label class="field">Nama panggilanmu<input id="nm" type="text" autocomplete="nickname" maxlength="20" value="' + esc(S.name || '') + '" placeholder="contoh: Rani"></label>' +
      '<div class="mission"><img src="' + navi('pose_menunjuk') + '" alt=""><div><b>Misimu</b><p>Kamu akan diwawancarai <span class="jp">田中さん</span> (Tanaka-san) dari <span class="jp">さくら食品</span> (Sakura Foods).</p>' +
      '<ol class="mission-steps"><li>Pre-test singkat</li><li>Kumpulkan 6 stempel <span class="jp">済</span></li><li>Yakinkan Tanaka-san di Simulasi</li></ol></div></div>' +
      '<button class="btn full" id="go">' + (S.pre ? 'Lanjut ke rak bab' : 'Mulai Pre-test') + ic('next') + '</button>' +
      '</div></div>');
    document.getElementById('go').addEventListener('click', function () {
      var v = document.getElementById('nm').value.trim();
      if (!v) { toast('Isi nama panggilanmu dulu, ya.'); return; }
      S.name = v; ST.save();
      go(S.pre ? '#/rak' : '#/pre/0');
    });
  }

  /* ------------------------------------------------------------ pre-test & post-test */
  var testAns = { pre: [], post: [] };
  function cleanStem(t) { return String(t).split('\nTranskrip')[0].replace(/\s*\((Arti|Romaji)[^)]*(ditampilkan|menguji)[^)]*\)/g, ''); }
  function cakupan(Q) {   /* petunjuk tes: berapa soal dari tiap bab, dalam warna bab */
    var n = {}; Q.forEach(function (q) { n[q.bab] = (n[q.bab] || 0) + 1; });
    return '<div class="card cakup"><h3 class="sec-h">Yang diukur</h3><div class="ck-grid">' + D.bab.map(function (b) {
      return '<div class="ck-bab" style="--c:' + b.col + ';--cl:' + b.colL + '"><span class="jp ck-kj">' + esc(b.kj) + '</span><span class="ck-t"><small>' + esc(b.label) + '</small><b>' + esc(b.title) + '</b></span><em>' + (n[b.no] || 0) + ' soal</em></div>';
    }).join('') + '</div></div>';
  }
  function scrTest(kind, i) {
    var S = ST.get(), isPre = kind === 'pre';
    var Q = isPre ? D.preSub.map(function (k) { return D.pre[k]; }) : D.pre, N = Q.length;   /* pre-test = 10 butir terpilih (D.preSub), post-test = 20 butir */
    var base = isPre ? 'Pre-test' : 'Post-test', root = '#/' + kind + '/';
    if (i === 0) {
      testAns[kind] = [];
      var intro = isPre ? D.slides['PRE-00'] : D.slides['POST-00'];
      return show('<div class="screen">' + topbar(base, 'Petunjuk', 0) + '<div class="body">' +
        '<span class="chip">' + (isPre ? N + ' soal · ±8 menit · belum dinilai' : N + ' soal · bagian dari nilai akhir') + '</span>' +
        '<h2 class="slide-h">' + esc(intro.title) + '</h2><div class="duo"><div class="duo-l"><div class="card">' + blocks(intro.screen, intro.code) + '</div>' +
        naviSay(intro.code, intro.narasi, 'pose_menunjuk') + '</div><div class="duo-r">' + cakupan(Q) + '</div></div></div>' + bottombar(null, '', root + '1', 'Mulai') + '</div>');
    }
    if (i > N) {
      var ans = testAns[kind];
      if (ans.length < N) { return go(root + '0'); }
      var right = ans.filter(function (a, k) { return a === Q[k].key; }).length, score = Math.round(right / N * 100);
      var perBab = {};
      Q.forEach(function (q, k) { var b = q.bab; perBab[b] = perBab[b] || [0, 0]; perBab[b][1]++; if (ans[k] === q.key) perBab[b][0]++; });
      S[kind] = { score: score, ans: ans, perBab: perBab, done: true, at: Date.now() }; ST.save();
      var rows = Object.keys(perBab).map(function (b) {
        var p = perBab[b], pct = Math.round(p[0] / p[1] * 100), cls = pct >= 80 ? 'ok' : pct >= 50 ? 'mid' : 'no';
        return '<div><span>Bab ' + b + ' · ' + esc(D.bab[b - 1].title) + '</span><span class="tag ' + cls + '">' + p[0] + '/' + p[1] + '</span></div>';
      }).join('');
      return show('<div class="screen">' + topbar(base, 'Hasil', 1) + '<div class="body">' +
        '<div class="duo"><div class="duo-l duo-skor"><div class="score-ring" style="--p:' + score + '%"><span>' + score + '</span></div>' +
        '<p class="treat" style="text-align:center">' + right + ' dari ' + N + ' soal benar' + (isPre ? '. Ini peta kemampuan awalmu, bukan nilai kelulusan.' : '.') + '</p>' +
        naviSay(isPre ? 'PRE-21' : 'RAP-01', isPre ? 'Bagus! Bab dengan hasil terendah sebaiknya kamu pelajari lebih dulu. Semua bab sudah terbuka di rak.' : 'Post-test selesai. Ayo lihat rapor kesiapanmu!', 'pose_jempol') + '</div>' +
        '<div class="duo-r"><div class="card"><b>' + (isPre ? 'Peta Kemampuan Awal' : 'Hasil per bab') + '</b><div class="row-list" style="margin-top:10px">' + rows + '</div></div></div></div>' +
        '</div>' + bottombar(null, '', isPre ? '#/rak' : '#/rapor', isPre ? 'Ke rak bab' : 'Lihat rapor') + '</div>');
    }
    var q = Q[i - 1], sel = testAns[kind][i - 1];
    show('<div class="screen">' + topbar(base + ' · soal ' + i + ' dari ' + N, 'Bab ' + q.bab + ' · indikator ' + q.ind, (i - 1) / N) +
      '<div class="body"><p class="q-stem">' + esc(cleanStem(q.stem)) + '</p><div class="opts">' +
      q.opts.map(function (o, k) { var L = 'ABCD'[k]; return '<button class="opt' + (sel === L ? ' sel' : '') + '" data-l="' + L + '"><span class="L">' + L + '</span><span>' + esc(o) + '</span></button>'; }).join('') +
      '</div></div>' + bottombar(i > 1 ? root + (i - 1) : root + '0', i + ' / ' + N, root + (i + 1), i === N ? 'Selesai' : 'Lanjut', !sel) + '</div>');
    view.querySelectorAll('.opt').forEach(function (b) {
      b.addEventListener('click', function () { testAns[kind][i - 1] = b.dataset.l; scrTest(kind, i); });
    });
  }

  /* ------------------------------------------------------------ slide bab */
  /* ---------- kerangka laptop (≥1024px): header penuh lebar + sidebar navigasi di semua layar isi (rancangan D2/D4) ---------- */
  function bagianSelesai() {   /* "X dari 10 bagian": pre-test, 6 stempel, Simulasi, Post-test, Rapor dilihat */
    var S = ST.get(); return (S.pre ? 1 : 0) + ST.stamps() + (S.sim && S.sim.done ? 1 : 0) + (S.post && S.post.done ? 1 : 0) + (S.raporLihat ? 1 : 0);
  }
  function pelajaran(b, k) {   /* daftar slide bab aktif, dikelompokkan per pelajaran (tanpa kode slide) */
    var out = '<div class="sd-les" style="--c:' + b.col + ';--cl:' + b.colL + '">', pel = null;
    b.slides.forEach(function (c, j) {
      var s = D.slides[c], pj = /^P(\d)/.exec(s.pel || ''), lab = pj ? 'P' + pj[1] : (s.pel || '');
      if (lab !== pel) { pel = lab; if (pj) out += '<div class="sd-pl">' + esc(b.lessons[pj[1] - 1] || '') + '</div>'; }
      var seen = ST.bab(b.no).seen.indexOf(c) >= 0;
      out += '<a' + (j === k ? ' class="cur"' : '') + ' href="#/bab/' + b.no + '/' + j + '"><span class="ck">' + (seen ? '✓' : '') + '</span><span>' + esc(s.title.replace(/^Aktivitas:\s*/, '')) + '</span></a>';
    });
    return out + '</div>';
  }
  /* Peta bab (pita navigasi): segmen per bagian (Pembuka, Pelajaran 1–n, Penutup & kuis), satu titik per slide.
     Titik dan nama bagian bisa diklik untuk pindah slide; judul slide muncul saat kursor di atas titik.
     hero = true: versi besar di sampul bab (di atas latar warna bab) + kartu pelajaran. */
  function segBab(b) {
    var segs = [], cur = null;
    b.slides.forEach(function (c, j) {
      var s = D.slides[c], pj = /^P(\d)/.exec(s.pel || ''), key = pj ? 'P' + pj[1] : (j === 0 ? 'A' : 'Z');
      if (!cur || cur.key !== key) { cur = { key: key, no: pj ? +pj[1] : 0, nama: pj ? (b.lessons[pj[1] - 1] || '') : (j === 0 ? 'Pembuka' : 'Penutup & kuis'), pendek: pj ? pj[1] : (j === 0 ? '始' : '済'), js: [] }; segs.push(cur); }
      cur.js.push(j);
    });
    return segs;
  }
  function petaBab(b, k, hero) {
    var seen = ST.bab(b.no).seen, segs = segBab(b), now = segs.filter(function (g) { return g.js.indexOf(k) >= 0; })[0] || segs[0];
    var nSeen = b.slides.filter(function (c) { return seen.indexOf(c) >= 0; }).length, pct = Math.round(nSeen / b.slides.length * 100), nPel = b.lessons.length;
    var track = '<div class="pb-track">' + segs.map(function (g) {
      return '<div class="pb-seg' + (g === now ? ' cur' : '') + '" style="flex:' + g.js.length + ' 1 0"><div class="pb-dots">' + g.js.map(function (j) {
        var c = b.slides[j], t = j === b.slides.length - 1 ? 'Kuis ' + b.label : D.slides[c].title.replace(/^Aktivitas:\s*/, '');
        return '<a class="pb-dot' + (seen.indexOf(c) >= 0 ? ' seen' : '') + (j === k ? ' cur' : '') + (j === b.slides.length - 1 ? ' kuis' : '') + '" href="#/bab/' + b.no + '/' + j + '" data-t="' + esc(t) + '" aria-label="' + esc(t) + '"' + (j === k ? ' aria-current="page"' : '') + '></a>';
      }).join('') + '</div><a class="pb-lab" href="#/bab/' + b.no + '/' + g.js[0] + '" title="' + esc(g.nama) + '"><b' + (g.no ? '' : ' class="jp"') + '>' + esc(g.pendek) + '</b><span>' + esc(g.nama) + '</span></a></div>';
    }).join('') + '</div>';
    if (hero) return '<nav class="pita pita-hero" aria-label="Peta ' + esc(b.label) + '">' + track + '</nav>';
    return '<nav class="pita" aria-label="Peta ' + esc(b.label) + '" style="--c:' + b.col + ';--cl:' + b.colL + '">' +
      '<div class="pb-top"><span class="pb-kj jp" aria-hidden="true">' + esc(b.kj) + '</span><div class="pb-t"><small>' + esc(b.label + (now.no ? ' · Pelajaran ' + now.no + ' dari ' + nPel : '')) + '</small><b>' + esc(now.nama) + '</b></div>' +
      '<span class="pb-pct"><b>' + pct + '%</b> dipelajari</span></div>' + track + '</nav>';
  }
  function kartuPelajaran(b, tanpaKuis) {   /* sampul bab: kartu tiap pelajaran (klik untuk mulai dari situ) dengan progres */
    var seen = ST.bab(b.no).seen, st = ST.bab(b.no);
    return '<div class="pl-grid">' + segBab(b).filter(function (g) { return g.key !== 'A' && !(tanpaKuis && g.key === 'Z'); }).map(function (g) {
      var n = g.js.filter(function (j) { return seen.indexOf(b.slides[j]) >= 0; }).length, akhir = g.key === 'Z';
      return '<a class="pl-card' + (akhir ? ' pl-kuis' : '') + (n === g.js.length ? ' full' : '') + '" href="#/bab/' + b.no + '/' + g.js[0] + '">' +
        '<span class="pl-no">' + (akhir ? '<span class="jp">済</span>' : g.no) + '</span><span class="pl-t"><small>' + (akhir ? (st.stamp ? 'Stempel didapat' : 'Skor ≥ 80 untuk stempel') : 'Pelajaran ' + g.no) + '</small><b>' + esc(g.nama) + '</b></span>' +
        '<span class="pl-bar"><i style="width:' + Math.round(n / g.js.length * 100) + '%"></i></span><span class="pl-n">' + n + '/' + g.js.length + ' slide</span></a>';
    }).join('') + '</div>';
  }
  function sidebar(cur) {   /* cur = { bab, k } di slide bab · { bab } di kuis · { page } di layar lain */
    var S = ST.get(), L = function (href, icon, label, key, lock) {
      return '<a class="sd-l' + (cur.page === key ? ' cur' : '') + (lock ? ' lock' : '') + '" href="' + href + '">' + ic(lock ? 'lock' : icon) + '<span>' + label + '</span></a>';
    };
    var h = '<aside class="side" aria-label="Navigasi">' + L('#/rak', 'home', 'Beranda · rak bab', 'rak') + '<div class="sd-sec">Bab</div>';
    D.bab.forEach(function (b) {
      var st = ST.status(b.no), pct = Math.round(ST.progress(b.no) * 100), on = cur.bab === b.no;
      h += '<a class="sd-bab' + (on ? ' cur' : '') + (st === 'locked' ? ' lock' : '') + '" href="#/bab/' + b.no + '/' + (ST.bab(b.no).last || 0) + '" style="--c:' + b.col + ';--cl:' + b.colL + '">' +
        '<span class="sd-n' + (st === 'done' ? ' done' : '') + '">' + (st === 'done' ? '<span class="jp">済</span>' : st === 'locked' ? ic('lock') : b.no) + '</span><span class="sd-t">' + esc(b.title) + '</span>' +
        (st !== 'done' && pct ? '<small>' + pct + '%</small>' : '') + '</a>';
      if (on && cur.k != null) h += pelajaran(b, cur.k);
    });
    h += '<div class="sd-sec">Evaluasi</div>' + L('#/sim/0', 'chat', 'Simulasi Mensetsu', 'sim', ST.status(7) === 'locked') + L('#/post/0', 'check', 'Post-test', 'post', ST.status(8) === 'locked') +
      L('#/rapor', 'trophy', 'Rapor Kesiapan', 'rapor', !(S.post && S.sim)) +
      '<div class="sd-sec">Sumber belajar</div>' + L('#/hal/GLB-03', 'book', 'Bank Kosakata', 'GLB-03') + L('#/hal/GLB-04', 'chat', 'Latihan Pertanyaan Acak', 'GLB-04') +
      L('#/hal/GLB-05', 'bulb', 'Tips & Trik', 'GLB-05') + L('#/hal/GLB-07', 'bulb', 'Kata Mutiara', 'GLB-07') + L('#/atur', 'gear', 'Pengaturan', 'atur');
    return h + '</aside>';
  }
  function curDariHash() {
    var p = (location.hash || '').slice(2).split('/');
    if (p[0] === 'kuis' || p[0] === 'bab') return { bab: +p[1] };
    return { page: p[0] === 'hal' ? p[1] : p[0] };
  }
  function appbar(ws) {
    var S = ST.get(), tb = ws.querySelector('.topbar'), sub = tb && tb.querySelector('.sub'), ti = tb && tb.querySelector('.title'), n = bagianSelesai();
    return '<header class="appbar"><a class="ab-brand" href="#/rak"><b>Mensetsu Navi</b><span class="jp">面接ナビ</span></a>' +
      '<div class="ab-crumb"><span>' + esc(sub ? sub.textContent : '') + '</span><b>' + esc(ti ? ti.textContent : '') + '</b></div>' +
      '<div class="ab-prog" role="progressbar" aria-valuemin="0" aria-valuemax="10" aria-valuenow="' + n + '" aria-label="Progres belajar"><i style="width:' + n * 10 + '%"></i></div><span class="ab-pn">' + n + '/10</span>' + gtog() +
      '<button class="ab-say" aria-label="Putar audio slide">' + ic('speaker') + '</button>' +
      '<a class="ab-user" href="#/atur"><span class="ab-av">' + esc((S.name || 'P').charAt(0).toUpperCase()) + '</span><span class="ab-nm">' + esc(S.name || 'Peserta') + '</span></a></header>';
  }
  function scrBab(n, k) {
    var b = D.bab[n - 1]; if (!b) return go('#/rak');
    if (ST.status(n) === 'locked') { toast('Selesaikan pre-test dulu, ya.'); return go('#/pre/0'); }
    k = Math.max(0, Math.min(k, b.slides.length - 1));
    var code = b.slides[k], s = D.slides[code], last = b.slides.length - 1;
    var ix = (k > 0 && k < last && window.MN_IX) ? MN_IX.render(code) : null;
    var gate = ix && ix.gated && !ST.isSeen(n, code) && !ST.get().unlockAll;
    if (gate) ST.last(n, k); else ST.seen(n, code, k);
    var root = '#/bab/' + n + '/', pct = (k + 1) / b.slides.length, sub = b.label + (s.pel && s.pel[0] === 'P' ? ' · ' + s.pel : '');
    var inner, panel = '';
    if (k === 0) {
      inner = '<div class="cover-hero" style="--c:' + b.col + '">' + SG + '<div class="top"><span class="chip" style="background:rgba(255,255,255,.92)">' + esc(b.dur + ' · ' + b.slides.length + ' slide') + '</span></div>' +
        '<div class="kj jp">' + esc(b.kj) + '</div><div class="eb">' + esc(b.label + ' · ' + b.kjr) + '</div><img src="' + navi('act_memberi_salam') + '" alt="">' + petaBab(b, k, true) + '</div>' +
        '<div class="body cover-body"><div class="card cover-card"><h2 class="slide-h">' + esc(b.title) + '</h2><p class="lead">' + esc(b.blurb) + '</p>' +
        '<h3 class="sec-h">Setelah bab ini, kamu mampu</h3><ul class="goals">' + s.screen.filter(function (x) { return x.li != null && x.lvl === 1; }).map(function (x) { return '<li>' + md(x.li.replace(/[;.]$/, '')) + '</li>'; }).join('') + '</ul>' +
        '<h3 class="sec-h">Isi bab · klik untuk mulai dari pelajaran mana pun</h3>' + kartuPelajaran(b) + '</div>' +
        naviSay(code, s.narasi, 'pose_menunjuk') + '</div>';
    } else if (k === last) {
      var st = ST.bab(n);
      inner = '<div class="body">' + petaBab(b, k) + '<h2 class="slide-h">Kuis ' + esc(b.label) + '</h2>' +
        '<div class="duo"><div class="duo-l">' +
        '<div class="card quiz-intro"><div class="hanko' + (st.stamp ? ' got' : ' ghost') + '"><span class="jp">済</span></div><div>' +
        '<p><b>5 soal</b>, satu per layar, dengan umpan balik langsung. Dapatkan skor <b>80</b> untuk stempel ' + esc(b.label) + '.</p>' +
        (st.best ? '<p class="mini">Skor terbaikmu: <b>' + st.best + '</b>' + (st.stamp ? ' · stempel sudah didapat' : '') + '</p>' : '') + '</div></div>' +
        '<a class="btn full" href="#/kuis/' + n + '">' + (st.best ? 'Ulangi kuis' : 'Mulai kuis') + ic('next') + '</a>' + naviSay(code, 'Siap? Kalau belum mencapai 80, kamu bisa mengulang dengan soal yang berbeda.', 'pose_semangat') + '</div>' +
        '<div class="duo-r"><div class="card"><h3 class="sec-h">Materi yang diuji · klik untuk mengulang</h3>' + kartuPelajaran(b, true) + '</div></div></div></div>';
    } else {
      var pj = /^P(\d)/.exec(s.pel || ''), lesson = pj ? 'Pelajaran ' + pj[1] + ' · ' + (b.lessons[pj[1] - 1] || '') : (s.pel || '');
      inner = '<div class="body">' + petaBab(b, k) + '<div class="gt-row"><span class="chip">' + esc(lesson) + '</span>' + gtog() + '</div><h2 class="slide-h">' + esc(s.title.replace(/^Aktivitas:\s*/, '')) + '</h2>' +
        (/^Aktivitas/.test(s.title) ? '<span class="act-tag">Aktivitas</span>' : '') +
        '<div class="card' + (ix ? ' ix-slide' : '') + '">' + (ix ? ix.html : blocks(s.screen, code)) + '</div>' +
        (ix && /^(T08|T10|T11|T12)$/.test(s.tpl) && window.MN_NAVI ? '<div class="navi-hint"><button class="btn soft" id="navi-hint">' + ic('bulb') + 'Petunjuk Navi</button><div id="navi-hint-box"></div></div>' : '') +
        '<div class="inl-navi">' + naviSay(code, s.narasi, 'exp_senang') + '</div>' + devNote(s) + '</div>';
      /* laptop (≥1280px): Navi dan "Kosakata di slide ini" pindah ke panel kanan (rancangan D2); di layar lebih kecil tetap di bawah isi */
      var gl = (b.glos || []).filter(function (g) { return g.k === k; });
      panel = '<aside class="rpanel" aria-label="Pendamping slide">' + naviSay(code, s.narasi, 'exp_senang') +
        (gl.length ? '<div class="rp-glos"><h3>Kosakata di slide ini</h3>' + gl.map(function (g) {
          return '<div class="rp-g"><span class="jp rp-jp">' + esc(g.jp) + '</span><button class="ix-sp rp-say" data-t="' + esc(g.jp) + '" aria-label="Dengarkan ' + esc(g.ro) + '">' + ic('speaker') + '</button>' +
            '<div class="ix-ro">' + esc(g.ro) + '</div><div class="ix-ar">' + esc(g.ar) + '</div></div>'; }).join('') + '</div>' : '') + '</aside>';
    }
    show('<div class="with-side' + (panel ? ' has-rp' : '') + '" style="--c:' + b.col + ';--cl:' + b.colL + '">' + sidebar({ bab: n, k: k }) + '<div class="screen">' + topbar(sub, s.title, pct, b.col) + inner +
      bottombar(k > 0 ? root + (k - 1) : '#/rak', (k + 1) + ' / ' + b.slides.length, k < last ? root + (k + 1) : null, k === 0 ? 'Mulai ' + b.label : 'Lanjut', gate) + '</div>' + panel + '</div>');
    view.querySelectorAll('.rp-say').forEach(function (bt) { bt.addEventListener('click', function () { if (window.MN_IX && !MN_IX.sayJa(bt.dataset.t)) toast('Suara Jepang belum tersedia di perangkat ini.'); }); });
    var nh = document.getElementById('navi-hint');   /* Petunjuk Navi: hanya di aktivitas slide materi (tidak di kuis, pre/post-test, Simulasi resmi) */
    if (nh) nh.addEventListener('click', function () {
      document.getElementById('navi-hint-box').innerHTML = '<div class="navi-say"><img src="' + navi('exp_berpikir') + '" alt="Navi"><div class="bubble">' + MN_NAVI.hint(code, b, k, slideLink, esc) + '</div></div>';
      nh.hidden = true;
    });
    view.querySelectorAll('.km').forEach(function (c) {
      function putar() { sayMutiara(c.dataset.bab, c.dataset.say); }
      c.addEventListener('click', putar); c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); putar(); } });
    });
    if (ix) ix.bind(view, function () {
      if (!ST.isSeen(n, code)) { ST.seen(n, code, k); toast('Bagus! Slide ini selesai.'); }
      var nx = view.querySelector('.bottombar .btn[aria-disabled]');
      if (nx) { nx.removeAttribute('aria-disabled'); nx.removeAttribute('style'); nx.classList.add('pulse'); }
      var ck = view.querySelector('.side a.cur .ck'); if (ck) ck.textContent = '✓';
    });
  }

  /* ------------------------------------------------------------ kuis bab */
  var quiz = null;
  function scrKuis(n) {
    var b = D.bab[n - 1]; if (!b) return go('#/rak');
    if (!quiz || quiz.n !== n || quiz.done) quiz = { n: n, qs: shuffle(b.kuis).slice(0, 5), i: 0, ans: [], done: false };
    var Q = quiz.qs, i = quiz.i;
    var head = topbar(b.label + ' · Kuis', 'Soal ' + Math.min(i + 1, 5) + ' dari 5', i / 5, b.col);
    if (i >= Q.length) {
      quiz.done = true;
      var right = quiz.ans.filter(Boolean).length, score = right * 20, stamp = ST.quiz(n, score);
      var remed = []; Q.forEach(function (q, k) { if (!quiz.ans[k]) q.remed.forEach(function (c) { if (remed.indexOf(c) < 0) remed.push(c); }); });
      return show('<div class="screen" style="--c:' + b.col + ';--cl:' + b.colL + '">' + head + '<div class="body" style="align-items:center;text-align:center">' +
        '<div class="score-ring" style="--p:' + score + '%"><span>' + score + '</span></div>' +
        (score >= 80 ? '<div class="hanko"><span><span class="jp">済</span>' + esc(b.label.toUpperCase()) + '</span></div><h2 class="slide-h">Kamu lulus ' + esc(b.label) + '!</h2>'
          : '<h2 class="slide-h">Hampir! Butuh skor 80 untuk stempel.</h2>') +
        (remed.length ? '<div class="card" style="text-align:left;width:100%"><b>Pelajari lagi</b><div class="row-list" style="margin-top:8px">' + remed.map(function (c) {
          var j = b.slides.indexOf(c); var s = D.slides[c];
          return j < 0 ? '' : '<div><a href="#/bab/' + n + '/' + j + '">' + esc(s.title.replace(/^Aktivitas:\s*/, '')) + '</a></div>';
        }).join('') + '</div></div>' : '') +
        (score >= 80 ? naviSay('', 'Hebat, kamu lulus ' + b.label + '! Stempelnya sudah di rak.', 'pose_jempol', true) : naviSay('', 'Belum lulus, tidak apa-apa. Baca lagi slide di atas, lalu coba kuis dengan soal yang berbeda. Kamu pasti bisa!', 'pose_semangat', true)) +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="btn ghost" id="ulang">Ulangi kuis</button><a class="btn" href="#/rak">Ke rak bab' + ic('next') + '</a></div>' +
        (stamp && ST.stamps() === 6 ? '<p class="chip">Enam stempel lengkap — Simulasi terbuka!</p>' : '') + '</div></div>');
    }
    var q = Q[i], a = quiz.ans[i];
    var answered = a !== undefined;
    show('<div class="screen" style="--c:' + b.col + ';--cl:' + b.colL + '">' + head + '<div class="body"><div class="dots">' + Q.map(function (_, k) { return '<i' + (k <= i ? ' class="on"' : '') + '></i>'; }).join('') + '</div>' +
      '<p class="q-stem">' + esc(q.stem) + '</p><div class="opts">' +
      q.opts.map(function (o, k) {
        var L = 'ABCD'[k], cls = '';
        if (answered) { if (L === q.key) cls = ' ok'; else if (quiz.pick === L) cls = ' no'; }
        return '<button class="opt' + cls + '" data-l="' + L + '"' + (answered ? ' disabled' : '') + '><span class="L">' + L + '</span><span>' + esc(o) + '</span></button>';
      }).join('') + '</div>' +
      (answered ? '<div class="fb ' + (a ? 'ok' : 'no') + '">' + esc(a ? (q.ok || 'Tepat!') : (q.no || 'Kurang tepat.')) + (q.exp ? '<br><span class="mini">' + esc(q.exp) + '</span>' : '') + '</div>' : '') +
      '</div>' + (answered ? '<footer class="bottombar"><span class="no"></span><button class="btn" id="nx">' + (i === 4 ? 'Lihat hasil' : 'Soal berikutnya') + ic('next') + '</button></footer>' : '') + '</div>');
    view.querySelectorAll('.opt:not([disabled])').forEach(function (bt) {
      bt.addEventListener('click', function () { quiz.pick = bt.dataset.l; quiz.ans[i] = bt.dataset.l === q.key; scrKuis(n); });
    });
    var nx = document.getElementById('nx'); if (nx) nx.addEventListener('click', function () { quiz.i++; quiz.pick = null; scrKuis(n); });
    var ul = document.getElementById('ulang'); if (ul) ul.addEventListener('click', function () { quiz = null; scrKuis(n); });
  }

  /* ------------------------------------------------------------ simulasi mensetsu */
  var sim = null, simTimer = null, simNext = null;
  function stopTimer() { clearInterval(simTimer); simTimer = null; clearTimeout(simNext); simNext = null; }
  var KOM = ['SIM-06', 'SIM-07', 'SIM-08', 'SIM-10', 'SIM-11', 'SIM-12'];
  function scrSim(i) {
    stopTimer();
    if (ST.status(7) === 'locked') { toast('Simulasi terbuka setelah enam stempel bab.'); return go('#/rak'); }
    var M = D.sim;
    if (i === 0 || !sim) {
      sim = { mode: 'resmi', pts: [], pick: [], trust: 50, order: M.map(function (m) { return shuffle([0, 1, 2]); }) };
      if (i !== 0) return go('#/sim/0');
      var s0 = D.slides['SIM-00'];
      show('<div class="screen sim-split"><div class="sim-scene sim-intro" style="background-image:url(assets/bg/ruang_wawancara.webp)">' +
        '<div class="sim-card"><span class="jp">さくら食品 · 人事部</span><b class="jp">田中さん</b><span>Tanaka-san, pewawancara</span></div></div><div class="body">' +
        '<span class="chip" style="background:var(--akane);color:#fff">Bagian dari nilai akhir (50%)</span><h2 class="slide-h">Hari wawancaramu tiba</h2>' +
        '<p class="sim-lead">Kamu melamar ke <span class="jp">さくら食品</span> (Sakura Shokuhin), pabrik makanan. Dari depan gedung sampai keluar ruangan, setiap keputusanmu dinilai.</p>' +
        '<div class="rules">' +
        '<div><b>13</b><span>momen keputusan</span></div><div><b>20<small> dtk</small></b><span>per momen; habis = 0 poin</span></div>' +
        '<div><b>3</b><span>pilihan tindakan</span></div><div><b class="jp">信頼度</b><span>Trust Meter mulai 50</span></div></div>' +
        '<p class="mini sim-note">Ucapan Tanaka-san tampil dalam bahasa Jepang dan romaji, tanpa arti, seperti wawancara sungguhan. Tekan tombol suara untuk mendengarnya.</p>' +
        '<a class="btn ghost full sim-lat" href="#/sim/1">Coba Mode Latihan dulu</a><p class="mini sim-note">Mode Latihan: tanpa timer dan tanpa nilai, dengan Petunjuk Navi. Tidak memengaruhi nilai akhir.</p></div>' +
        bottombar('#/rak', '', '#/sim/1', 'Mulai simulasi') + '</div>', { dark: true });
      view.querySelector('.sim-lat').addEventListener('click', function () { sim.mode = 'latihan'; });
      return;
    }
    if (i > M.length) return scrSimEnd(i);
    var lat = sim.mode === 'latihan';
    var m = M[i - 1], picked = sim.pick[i - 1];
    var bg = i <= 2 ? 'kantor_eksterior' : i <= 5 ? 'koridor' : 'ruang_wawancara';
    var jpLine = (m.sit.match(/「[^」]+」/) || [''])[0];
    function sayJa(t) { return window.MN_IX ? MN_IX.sayJa(t) : false; }
    function acuanLinks(txt) {
      return (String(txt).match(/B\d-\d\d/g) || []).map(function (c) { var l = slideLink(c); return l ? '<a href="' + l.href + '">' + esc(l.judul) + '</a>' : ''; }).filter(Boolean).join(' · ');
    }
    show('<div class="screen sim-split"><div class="sim-scene" style="background-image:url(assets/bg/' + bg + '.webp)">' +
      '<div class="sim-hud"><span class="pill">' + (lat ? 'Latihan ' : '') + 'Momen ' + i + '/13</span><span class="pill"><span class="jp">信頼度</span><span class="trust"><i style="width:' + sim.trust + '%"></i></span>' + sim.trust + '</span>' +
      (lat ? '' : '<span class="timer" id="tm" style="--p:100%"><span id="tmn">20</span></span>') + '</div>' +
      (jpLine ? '<div class="speech"><span>' + esc(jpLine) + '</span><button class="ix-sp sim-say" aria-label="Dengarkan ucapan Tanaka-san">' + ic('speaker') + '</button></div>' : '') + '</div>' +
      '<div class="body"><p class="q-stem">' + esc(m.sit) + '</p>' +
      (lat ? '<button class="btn soft" id="hint" style="align-self:flex-start">Petunjuk Navi</button><div id="hintbox"></div>' : '') + '<div class="opts">' +
      sim.order[i - 1].map(function (o, k) {
        var L = 'ABC'[k], cls = picked !== undefined ? (picked === o ? ' sel' : '') : '';
        return '<button class="opt' + cls + '" data-o="' + o + '"' + (picked !== undefined ? ' disabled' : '') + '><span class="L">' + L + '</span><span>' + esc(m.opts[o][0]) + '</span></button>';
      }).join('') + '</div><div id="react"></div></div></div>', { dark: true });
    function lanjut() { go('#/sim/' + (i + 1)); }
    function reaksi(o, pts) { return '<div class="reaction">' + (o == null ? 'Waktu habis…' : pts === 10 ? '田中さん mengangguk.' : pts === 5 ? '田中さん mencatat dengan ragu.' : '田中さん mengernyit.') + '</div>'; }
    function umpanLatihan(pts) {
      var cls = pts === 10 ? 'ok' : pts === 5 ? 'mid' : 'no';
      return reaksi(0, pts) + '<div class="card" style="color:var(--ink);margin-top:10px"><span class="tag ' + cls + '">' + pts + ' poin (tidak dicatat)</span> <b>Tindakan terbaik:</b> ' + esc(m.opts[0][0]) +
        '<p class="mini">Pelajari: ' + (acuanLinks(m.acuan) || esc(m.acuan)) + '</p><a class="btn full" href="#/sim/' + (i + 1) + '">' + (i >= M.length ? 'Selesai latihan' : 'Lanjut') + '</a></div>';
    }
    function choose(o) {
      stopTimer();
      var pts = o == null ? 0 : m.opts[o][1];
      sim.pick[i - 1] = o == null ? -1 : o; sim.pts[i - 1] = pts;
      sim.trust = Math.max(0, Math.min(100, sim.trust + (pts === 10 ? 10 : pts === 0 ? -10 : 0)));
      view.querySelectorAll('.opt').forEach(function (b) { b.disabled = true; if (+b.dataset.o === o) b.classList.add('sel'); });
      var rx = document.getElementById('react'), hb = document.getElementById('hint'); if (hb) hb.hidden = true;
      if (lat) { rx.innerHTML = umpanLatihan(pts); return; }
      rx.innerHTML = reaksi(o, pts);
      if (m.code === 'SIM-06' && window.MN_SIMREK) {   /* rekaman opsional, tidak dinilai */
        var box = document.createElement('div'); box.style.marginTop = '12px'; rx.appendChild(box);
        window.MN_SIMREK.mount(box, { esc: esc, ic: ic, toast: toast, lanjut: lanjut });
        return;
      }
      simNext = setTimeout(lanjut, 1300);
    }
    var sb = view.querySelector('.sim-say'); if (sb) sb.addEventListener('click', function () { if (!sayJa(jpLine)) toast('Suara Jepang belum tersedia di perangkat ini.'); });
    if (jpLine && picked === undefined) setTimeout(function () { if (document.getElementById('react')) sayJa(jpLine); }, 450);   /* suara pewawancara otomatis */
    if (lat) {
      var hint = document.getElementById('hint');
      if (hint) hint.addEventListener('click', function () {
        var l = acuanLinks(m.acuan);
        document.getElementById('hintbox').innerHTML = '<div class="navi-say" style="color:var(--ink)"><img src="' + navi('exp_berpikir') + '" alt="Navi"><div class="bubble">Petunjuk: ' + (l ? 'coba buka lagi ' + l + '.' : 'buka lagi bab yang terkait di rak.') + '</div></div>';
        hint.hidden = true;
      });
      if (picked !== undefined) document.getElementById('react').innerHTML = umpanLatihan(sim.pts[i - 1] || 0);
    }
    if (picked === undefined) {
      var t0 = Date.now(), T = 20000;
      if (!lat) simTimer = setInterval(function () {
        var left = Math.max(0, T - (Date.now() - t0));
        var el = document.getElementById('tm'); if (!el) return stopTimer();
        el.style.setProperty('--p', (left / T * 100) + '%'); document.getElementById('tmn').textContent = Math.ceil(left / 1000);
        if (left <= 0) choose(null);
      }, 200);
      view.querySelectorAll('.opt').forEach(function (b) { b.addEventListener('click', function () { choose(+b.dataset.o); }); });
    }
  }
  /* Mode Latihan: tidak ada nilai, tidak menulis S.sim, tidak membuka Post-test */
  function scrSimLatEnd() {
    var M = D.sim, tepat = sim.pts.filter(function (p) { return p === 10; }).length;
    var rows = M.map(function (m, k) {
      var p = sim.pts[k] || 0, cls = p === 10 ? 'ok' : p === 5 ? 'mid' : 'no';
      return '<div style="flex-direction:column;align-items:flex-start"><span><b>' + esc(m.code) + '</b> <span class="tag ' + cls + '">' + (p === 10 ? 'tepat' : p === 5 ? 'kurang tepat' : 'perlu dipelajari') + '</span></span><span class="mini">Tindakan terbaik: ' + esc(m.opts[0][0]) + ' · Acuan ' + esc(m.acuan) + '</span></div>';
    }).join('');
    show('<div class="screen"><div class="body" style="color:var(--ink)"><div class="card" style="text-align:center"><span class="chip">Mode Latihan selesai</span>' +
      '<p>Kamu memilih tindakan terbaik di <b>' + tepat + ' dari 13</b> momen.</p><p class="mini">Tidak ada nilai yang dicatat dan nilai akhirmu tidak berubah.</p></div>' +
      '<div class="card"><b>Pembahasan 13 momen</b><div class="row-list" style="margin-top:10px">' + rows + '</div></div>' +
      '<a class="btn full" href="#/sim/0">Kembali ke pengantar (mulai simulasi resmi)</a></div>' + bottombar('#/rak', '', null) + '</div>', { dark: true });
  }
  function scrSimEnd(i) {
    if (sim.mode === 'latihan') return scrSimLatEnd();
    var M = D.sim, tot = sim.pts.reduce(function (a, b) { return a + (b || 0); }, 0);
    var kom = 0, eti = 0;
    M.forEach(function (m, k) { if (KOM.indexOf(m.code) >= 0) kom += sim.pts[k] || 0; else eti += sim.pts[k] || 0; });
    var res = { score: Math.round(tot / 130 * 100), kom: Math.round(kom / 60 * 100), etika: Math.round(eti / 70 * 100), trust: sim.trust, pts: sim.pts, pick: sim.pick, done: true };
    ST.get().sim = res; ST.save();
    var face = res.trust >= 70 ? 'tersenyum' : res.trust >= 40 ? 'netral' : 'kecewa';
    var rows = M.map(function (m, k) {
      var p = sim.pts[k] || 0, cls = p === 10 ? 'ok' : p === 5 ? 'mid' : 'no';
      return '<div style="flex-direction:column;align-items:flex-start"><span><b>' + esc(m.code) + '</b> <span class="tag ' + cls + '">' + p + ' poin</span></span><span class="mini">Tindakan tepat: ' + esc(m.opts[0][0]) + ' · Acuan ' + esc(m.acuan) + '</span></div>';
    }).join('');
    show('<div class="screen"><div class="body" style="color:var(--ink)">' +
      '<div class="card" style="text-align:center"><p class="jp">田中さんが評価しています…</p><p>Ekspresi akhir Tanaka-san: <b>' + face + '</b> (Trust Meter ' + res.trust + ')</p>' +
      '<div class="score-ring" style="--p:' + res.score + '%;--c:var(--sakura)"><span>' + res.score + '</span></div><p class="mini">Skor Simulasi · Komunikasi ' + res.kom + ' · Etika & Budaya Kerja ' + res.etika + '</p></div>' +
      '<div class="card"><b>Pembahasan 13 momen</b><div class="row-list" style="margin-top:10px">' + rows + '</div></div></div>' +
      bottombar(null, '', '#/post/0', 'Lanjut ke Post-test') + '</div>', { dark: true });
  }

  /* ------------------------------------------------------------ rapor */
  /* Profil Kesiapan Lisan di rapor (formatif, tidak masuk kelulusan): angka dari rekaman terakhir B4-15 dan B5-13 */
  function profilLisan(S) {
    var L = S.lisan; if (!L || (!L.jiko && !L.sim06 && !(L.jawab && L.jawab.length))) return '';
    var baris = function (r) { return (r.durasi != null ? 'durasi ' + r.durasi + ' dtk · ' + r.jeda + ' jeda · volume ' + r.volume + ' · ' : '') + 'daftar periksa ' + r.cek + '/' + r.total; };
    var out = [];
    if (L.jiko) out.push('<div><b>Jikoshoukai (B4-15)</b><br>' + esc(baris(L.jiko)) + '</div>');
    if (L.sim06) out.push('<div><b>Jikoshoukai di Simulasi (SIM-06)</b><br>' + esc(baris(Object.assign({ cek: 0, total: 0 }, L.sim06)).replace(/ · daftar periksa 0\/0$/, '')) + '</div>');
    (L.jawab || []).forEach(function (r, i) { out.push('<div><b>Jawaban ' + (i + 1) + ' (B5-13)</b><br>' + esc(baris(r)) + '</div>'); });
    return '<div class="card"><b>Profil Kesiapan Lisan</b><p class="mini">Formatif, tidak masuk batas lulus. Analisis otomatis berupa perkiraan.</p><div class="row-list" style="margin-top:8px">' + out.join('') + '</div></div>';
  }
  /* N-gain dihitung pada butir yang sama: pre-test = 10 butir terpilih (D.preSub), post-test = 20 butir yang memuat 10 butir itu.
     Jawaban pre-test lama (20 butir, dari sebelum perubahan) dihitung ulang pada 10 butir yang sama. */
  function skorSama(S) {
    var sub = D.preSub, pre = S.pre ? S.pre.score : 0, post = S.post.score;
    function pct(ans) { return Math.round(sub.filter(function (k) { return ans[k] === D.pre[k].key; }).length / sub.length * 100); }
    if (S.pre && S.pre.ans && S.pre.ans.length === D.pre.length) pre = pct(S.pre.ans);
    if (S.post.ans && S.post.ans.length === D.pre.length) post = pct(S.post.ans);
    return { pre: pre, post: post, n: sub.length };
  }
  function scrRapor() {
    var S = ST.get();
    if (!S.post || !S.sim) { toast('Rapor terbuka setelah Simulasi dan Post-test.'); return go('#/rak'); }
    S.raporLihat = true; ST.save();
    var nilai = Math.round(0.5 * S.sim.score + 0.5 * S.post.score);
    var kat = nilai >= 85 ? ['Siap Wawancara', 'ok'] : nilai >= 75 ? ['Lulus, Perlu Penguatan', 'mid'] : ['Belum Lulus', 'no'];
    var sk = skorSama(S), pre = sk.pre, ng = pre >= 100 ? 0 : Math.round((sk.post - pre) / (100 - pre) * 100) / 100;
    var rek = [];
    D.sim.forEach(function (m, k) { if ((S.sim.pts[k] || 0) < 10) rek.push(m.code + ' → pelajari lagi ' + m.acuan); });
    var g = function (lab, v, c) { return '<div class="gauge"><div class="score-ring" style="--p:' + v + '%;--c:' + c + '"><span>' + v + '</span></div><b style="font-size:13px">' + lab + '</b></div>'; };
    show('<div class="screen wide rapor">' + topbar('Rapor Kesiapan', S.name || 'Peserta', 1) + '<div class="body">' +
      '<div class="card" style="background:var(--pri);color:#fff;position:relative;overflow:hidden">' + SG + '<div style="position:relative"><div class="mini" style="color:#C9D6E8">NILAI SUMATIF</div><div class="big-num">' + nilai + '</div>' +
      '<div class="mini" style="color:#C9D6E8">50% Simulasi (' + S.sim.score + ') + 50% Post-test (' + S.post.score + ')</div><p><span class="tag ' + kat[1] + '">' + kat[0] + '</span></p></div></div>' +
      '<div class="grid2">' + g('Komunikasi', S.sim.kom, 'var(--pri)') + g('Etika & Budaya Kerja', S.sim.etika, 'var(--good)') + '</div>' +
      '<div class="card"><b>Stempel bab</b><div class="stamps" style="margin-top:10px">' + [1, 2, 3, 4, 5, 6].map(function (n) { return '<span class="' + (S.bab[n] && S.bab[n].stamp ? 'on' : '') + '">済</span>'; }).join('') + '</div></div>' +
      profilLisan(S) +
      '<div class="card"><b>Peningkatan</b><p>Pre-test ' + pre + ' → Post-test ' + sk.post + ' · N-gain ' + ng + '</p><p class="mini">Dibandingkan pada ' + sk.n + ' butir yang sama dengan pre-test. Post-test lengkap: ' + S.post.score + ' (' + D.pre.length + ' soal).</p></div>' +
      '<div class="card"><b>Rekomendasi</b><div class="row-list" style="margin-top:8px">' + (rek.length ? rek.map(function (r) { return '<div>' + esc(r) + '</div>'; }).join('') : '<div>Semua momen simulasi sudah tepat. Lanjutkan dengan praktik bersama instruktur LPK.</div>') + '</div></div>' +
      naviSay('RAP-03', 'Mensetsu Navi adalah persiapan. Lanjutkan dengan latihan wawancara langsung bersama instruktur LPK-mu. Ganbatte!', 'pose_semangat') +
      '</div>' + bottombar('#/rak', '', null) + '</div>');
  }

  /* ------------------------------------------------------------ fitur global & pengaturan */
  function scrHal(code) {
    var s = D.slides[code]; if (!s) return go('#/rak');
    var FITUR = { 'GLB-03': ['MN_KOSA', 'Bank Kosakata', '#17706B', '#DDEFEC'], 'GLB-04': ['MN_LATIH', 'Latihan Pertanyaan Acak', '#5E4391', '#ECE6F4'], 'GLB-05': ['MN_TIPS', 'Tips & Trik', '#9A5A12', '#F6EBDB'], 'GLB-07': ['MN_NAVI', 'Kata Mutiara', '#0F4C81', '#E1EAF4'] }[code];
    if (FITUR && window[FITUR[0]]) {
      show('<div class="screen fitur" style="--c:' + FITUR[2] + ';--cl:' + FITUR[3] + '">' + topbar('Sumber belajar', FITUR[1], 1, FITUR[2]) + '<div class="body"><h2 class="slide-h">' + esc(s.title) + '</h2><div id="fitur"></div></div>' + bottombar('#/rak', '', null) + '</div>');
      window[FITUR[0]].mount(document.getElementById('fitur'), { esc: esc, ic: ic, naviSay: naviSay, bindSpeak: bindSpeak, toast: toast, sayMutiara: sayMutiara, status: function (n) { return ST.status(n); },
        sayJa: function (t, rate, onend) { return window.MN_IX ? MN_IX.sayJa(t, rate, onend) : false; } });
      bindSpeak(view);
      return;
    }
    show('<div class="screen">' + topbar('Fitur', s.title, 1) + '<div class="body"><span class="chip soon">Sedang disiapkan</span><h2 class="slide-h">' + esc(s.title) + '</h2>' +
      (ST.get().unlockAll ? '<div class="card">' + blocks(s.screen, code) + '</div>' : '') + naviSay(code, s.narasi, 'pose_dagu') + devNote(s) + '</div>' + bottombar('#/rak', '', null) + '</div>');
  }
  function scrAtur() {
    var S = ST.get();
    show('<div class="screen">' + topbar('Pengaturan', 'Data dan mode uji', 1) + '<div class="body">' +
      '<label class="field">Nama panggilan<input id="nm" value="' + esc(S.name) + '" maxlength="20"></label>' +
      '<div class="card"><b>Tampilan dan suara</b>' +
      '<label class="switch-row" style="margin-top:10px"><span><b>Romaji</b><span class="mini">Cara baca huruf Latin di samping tulisan Jepang. Matikan untuk melatih membaca.</span></span><input type="checkbox" role="switch" class="switch" id="set-ro" ' + (ST.set().ro ? 'checked' : '') + '></label>' +
      '<label class="switch-row" style="margin-top:10px"><span><b>Arti</b><span class="mini">Terjemahan bahasa Indonesia di samping tulisan Jepang.</span></span><input type="checkbox" role="switch" class="switch" id="set-ar" ' + (ST.set().ar ? 'checked' : '') + '></label>' +
      '<div style="margin-top:12px"><b>Kecepatan suara</b><div class="kv-chips" style="margin-top:6px"><button class="kv-chip' + (ST.set().kec === 'normal' ? ' on' : '') + '" data-kec="normal" aria-pressed="' + (ST.set().kec === 'normal') + '">Normal</button><button class="kv-chip' + (ST.set().kec === 'pelan' ? ' on' : '') + '" data-kec="pelan" aria-pressed="' + (ST.set().kec === 'pelan') + '">Pelan</button></div></div></div>' +
      '<label class="card switch-row"><span><b>Mode uji tim</b><span class="mini">Buka semua bab dan evaluasi tanpa syarat, dan tampilkan catatan storyboard. Matikan sebelum dipakai peserta.</span></span><input type="checkbox" role="switch" class="switch" id="ua" ' + (S.unlockAll ? 'checked' : '') + '></label>' +
      '<div class="card"><b>Data tersimpan di perangkat ini saja.</b><p class="mini">Progres, jawaban, dan nilai disimpan di peramban HP/laptop ini dan tidak dikirim ke mana pun.</p><button class="btn ghost" id="rs">Hapus semua progres</button></div>' +
      '</div>' + bottombar('#/rak', '', null) + '</div>');
    document.getElementById('nm').addEventListener('change', function (e) { S.name = e.target.value.trim(); ST.save(); });
    document.getElementById('set-ro').addEventListener('change', function (e) { setG('ro', e.target.checked); });
    document.getElementById('set-ar').addEventListener('change', function (e) { setG('ar', e.target.checked); });
    view.querySelectorAll('.kv-chip[data-kec]').forEach(function (b) {
      b.addEventListener('click', function () {
        ST.set().kec = b.dataset.kec; ST.save();
        view.querySelectorAll('.kv-chip[data-kec]').forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); });
        if (window.MN_IX) MN_IX.sayJa('よろしくお願いします。');
      });
    });
    document.getElementById('ua').addEventListener('change', function (e) { S.unlockAll = e.target.checked; ST.save(); toast(S.unlockAll ? 'Mode uji aktif.' : 'Mode uji dimatikan.'); });
    document.getElementById('rs').addEventListener('click', function () {
      var b = this; if (b.dataset.sure) { ST.reset(); toast('Progres dihapus.'); go('#/mulai'); } else { b.dataset.sure = 1; b.textContent = 'Ketuk sekali lagi untuk menghapus'; }
    });
  }

  /* ------------------------------------------------------------ menu ☰ */
  function openMenu() {
    var S = ST.get(), h = location.hash;
    var wrap = document.createElement('div');
    wrap.innerHTML = '<div class="drawer-bg"></div><aside class="drawer" role="dialog" aria-label="Menu"><div class="head"><img src="' + navi('exp_senang') + '" alt=""><div style="flex:1"><b>' + esc(S.name || 'Peserta') + '</b><div class="mini" style="color:#C9D6E8">' + ST.stamps() + ' dari 6 stempel</div></div>' +
      '<button class="icon-btn" data-x aria-label="Tutup menu" style="background:rgba(255,255,255,.15);border:0;color:#fff">' + ic('x') + '</button></div><nav>' +
      '<a href="#/rak">' + ic('home') + 'Rak bab (beranda)</a><div class="sec">Bab</div>' +
      D.bab.map(function (b) { var st = ST.status(b.no); return '<a href="#/bab/' + b.no + '/' + (ST.bab(b.no).last || 0) + '"' + (h.indexOf('#/bab/' + b.no + '/') === 0 ? ' class="cur"' : '') + '>' + (st === 'done' ? '<span class="jp" style="color:var(--hanko);font-weight:900">済</span>' : st === 'locked' ? ic('lock') : '<b style="color:' + b.col + '">' + b.no + '</b>') + '<span>' + esc(b.title) + '<br><span class="mini">' + Math.round(ST.progress(b.no) * 100) + '%</span></span></a>'; }).join('') +
      '<div class="sec">Evaluasi</div><a href="#/sim/0">' + ic('chat') + 'Simulasi Mensetsu</a><a href="#/rapor">' + ic('trophy') + 'Rapor Kesiapan</a>' +
      '<div class="sec">Sumber belajar</div><a href="#/hal/GLB-03">' + ic('book') + 'Bank Kosakata</a><a href="#/hal/GLB-07">' + ic('bulb') + 'Kata Mutiara</a><a href="#/hal/GLB-04">' + ic('chat') + 'Latihan Pertanyaan Acak</a><a href="#/hal/GLB-05">' + ic('bulb') + 'Tips & Trik</a><a href="#/atur">' + ic('gear') + 'Pengaturan</a></nav></aside>';
    document.body.appendChild(wrap);
    function close() { wrap.remove(); }
    wrap.querySelector('.drawer-bg').addEventListener('click', close);
    wrap.querySelector('[data-x]').addEventListener('click', close);
    wrap.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', k); } });
  }
  window.MN_MENU = openMenu;

  /* ------------------------------------------------------------ rak */
  /* GLB-07: Navi di beranda menyarankan bagian berikutnya; kartu bisa ditutup (diingat selama sesi untuk saran yang sama) */
  function tampilSaran() {
    if (!window.MN_NAVI) return;
    var sr = MN_NAVI.saran(), kunci = 'mn-saran-tutup', tutup = ''; try { tutup = sessionStorage.getItem(kunci) || ''; } catch (e) { /* diblokir */ }
    if (tutup === sr.t) { saranEl.hidden = true; return; }
    saranEl.innerHTML = '<img src="' + navi(sr.pose) + '" alt="Navi"><div class="sr-isi"><p>' + esc(sr.t) + '</p><div class="sr-aksi"><a class="btn" href="' + sr.href + '">' + esc(sr.label) + '</a>' +
      '<a class="sr-kol" href="#/hal/GLB-07">Kata Mutiara ' + MN_NAVI.terbuka() + '/' + MN_NAVI.total() + '</a></div></div><button class="sr-x" aria-label="Tutup saran Navi">' + ic('x') + '</button>';
    saranEl.hidden = false;
    saranEl.querySelector('.sr-x').addEventListener('click', function () { try { sessionStorage.setItem(kunci, sr.t); } catch (e) { /* diblokir */ } saranEl.hidden = true; });
  }
  function scrRak() {
    var S = ST.get();
    if (!S.name) return go('#/mulai');
    stopVoice(); stopTimer();
    view.hidden = true; view.innerHTML = ''; document.body.className = '';
    rakEl.hidden = false;
    if (window.MN_RAK) window.MN_RAK.show();
    tampilSaran();
    if (!ST.ok() && !window.__tanpaSimpan) { window.__tanpaSimpan = true; toast('Peramban menolak penyimpanan. Progresmu hanya bertahan sampai halaman ditutup.'); }
  }
  window.MN_APP = {
    toast: function (m) { toast(m); },
    slideLink: slideLink,
    status: function (no) { return ST.status(no); },
    progress: function (no) { return ST.progress(no); },
    stamps: function () { return ST.stamps(); },
    name: function () { return ST.get().name; },
    pre: function () { return ST.get().pre; },
    bab: function (no) { var b = ST.bab(no); return b; },
    open: function (no) { if (no <= 6) go('#/bab/' + no + '/' + (ST.bab(no).last || 0)); else if (no === 7) go('#/sim/0'); else go(ST.get().post && ST.get().post.done ? '#/rapor' : '#/post/0'); },
    menu: openMenu
  };

  /* ------------------------------------------------------------ router */
  function route() {
    var dw = document.querySelector('.drawer'); if (dw && dw.parentNode !== document.body) dw.parentNode.remove();   /* menu ☰ ikut tertutup saat halaman berganti */
    stopTimer(); stopVoice();
    var p = (location.hash || '#/').slice(2).split('/');
    var S = ST.get();
    switch (p[0]) {
      case 'mulai': return scrMulai();
      case 'pre': return scrTest('pre', +p[1] || 0);
      case 'post': return ST.status(8) === 'locked' ? (toast('Post-test terbuka setelah Simulasi.'), go('#/rak')) : scrTest('post', +p[1] || 0);
      case 'bab': return scrBab(+p[1], +p[2] || 0);
      case 'kuis': return scrKuis(+p[1]);
      case 'sim': return scrSim(+p[1] || 0);
      case 'rapor': return scrRapor();
      case 'hal': return scrHal(p[1]);
      case 'atur': return scrAtur();
      case 'rak': return scrRak();
      default: return go(S.name ? (S.pre ? '#/rak' : '#/pre/0') : '#/mulai');
    }
  }
  /* pintasan keyboard: ← sebelumnya, → berikutnya, spasi memutar suara, 1–3 memilih tindakan di Simulasi */
  document.addEventListener('keydown', function (e) {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || view.hidden) return;
    var t = e.target, tag = t && t.tagName;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag) || (t && t.isContentEditable) || document.querySelector('.drawer')) return;
    var bar = view.querySelector('.screen > .bottombar'), k = e.key, el;
    if (k === 'ArrowRight' && bar) { el = bar.querySelector('.btn:not(.ghost)'); if (el && el.getAttribute('aria-disabled') !== 'true' && !el.disabled) { e.preventDefault(); el.click(); } }
    else if (k === 'ArrowLeft' && bar) { el = bar.querySelector('a.btn.ghost'); if (el) { e.preventDefault(); el.click(); } }
    else if (k === ' ' && !/^(BUTTON|A)$/.test(tag)) { el = view.querySelector('[data-speak]'); if (el) { e.preventDefault(); el.click(); } }
    else if (/^[1-3]$/.test(k)) { el = view.querySelectorAll('.sim-split .opt:not([disabled])')[+k - 1]; if (el) { e.preventDefault(); el.click(); } }
  });

  /* Pindah slide yang halus (View Transitions): antar-slide dalam satu bab, antar-soal pre/post-test, dan antar-langkah simulasi,
     isi lama bergeser keluar dan isi baru masuk dari arah yang sesuai (maju → dari kanan, mundur → dari kiri).
     Bilah atas, sidebar, dan bilah bawah diam. Peramban tanpa View Transitions atau dengan "kurangi gerak" langsung berganti. */
  var hashLalu = location.hash;
  function arahGeser(a, b) {
    var ra = /^#\/(bab\/\d+|pre|post|sim)\/(\d+)/.exec(a || ''), rb = /^#\/(bab\/\d+|pre|post|sim)\/(\d+)/.exec(b || '');
    if (!ra || !rb || ra[1] !== rb[1] || ra[2] === rb[2]) return null;
    return +rb[2] > +ra[2] ? 'maju' : 'mundur';
  }
  window.addEventListener('hashchange', function () {
    var arah = arahGeser(hashLalu, location.hash); hashLalu = location.hash;
    var diam = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!arah || diam || !document.startViewTransition) return route();
    var h = document.documentElement; h.setAttribute('data-geser', arah);
    var vt = document.startViewTransition(route);
    vt.finished.then(selesai, selesai);
    function selesai() { h.removeAttribute('data-geser'); }
  });
  route();

  /* ------------------------------------------------------------ PWA */
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    var punyaSW = !!navigator.serviceWorker.controller;   /* true bila halaman ini sudah dikendalikan versi sebelumnya */
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (!punyaSW) { punyaSW = true; return; }   /* pemasangan pertama, bukan pembaruan */
      if (document.getElementById('upd')) return;
      var d = document.createElement('div'); d.id = 'upd'; d.className = 'upd'; d.setAttribute('role', 'status');
      d.innerHTML = '<span>Versi baru tersedia.</span><button class="btn soft">Muat ulang</button>';
      d.querySelector('button').addEventListener('click', function () { location.reload(); });
      document.body.appendChild(d);
    });
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').then(function (reg) {
        /* cek pembaruan tiap tab kembali dibuka, dan tiap 30 menit selama terbuka */
        document.addEventListener('visibilitychange', function () { if (!document.hidden) reg.update().catch(function () {}); });
        setInterval(function () { reg.update().catch(function () {}); }, 30 * 60 * 1000);
      }).catch(function () {});
    });
  }
})();
