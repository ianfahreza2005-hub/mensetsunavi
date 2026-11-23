/* Mensetsu Navi — kerangka aplikasi (router + layar).
   Rute (hash):
   #/mulai            layar pembuka (GLB-00)
   #/pre/0..21        pre-test (petunjuk, 20 soal, hasil)
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
  function speak(code, text) {
    stopVoice();
    var a = new Audio('assets/audio/narasi/' + code + '.mp3');
    curAudio = a;
    a.addEventListener('error', function () {
      if (curAudio !== a || !window.speechSynthesis || !text) return;
      var u = new SpeechSynthesisUtterance(text.replace(/[「」]/g, '')); u.lang = 'id-ID'; u.rate = 1;
      speechSynthesis.speak(u);
    });
    a.play().catch(function () {});
  }

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
  function naviSay(code, text, pose) {
    if (!text || /^tidak ada/i.test(text)) return '';
    return '<div class="navi-say"><img src="' + navi(pose || 'exp_senang') + '" alt="Navi"><div class="bubble">' + esc(text) +
      '<div><button class="btn soft" data-speak="' + esc(code) + '">' + ic('speaker') + 'Dengarkan</button></div></div></div>';
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
  function show(html, opts) {
    stopVoice();
    rakEl.hidden = true; if (window.MN_RAK) window.MN_RAK.hide();
    view.hidden = false;
    document.body.className = (opts && opts.dark) ? 'sim' : '';
    view.innerHTML = html;
    window.scrollTo(0, 0);
    view.querySelectorAll('[data-menu]').forEach(function (b) { b.addEventListener('click', openMenu); });
    bindSpeak(view);
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
  function scrTest(kind, i) {
    var S = ST.get(), Q = D.pre, N = Q.length, isPre = kind === 'pre';
    var base = isPre ? 'Pre-test' : 'Post-test', root = '#/' + kind + '/';
    if (i === 0) {
      testAns[kind] = [];
      var intro = isPre ? D.slides['PRE-00'] : D.slides['POST-00'];
      return show('<div class="screen">' + topbar(base, 'Petunjuk', 0) + '<div class="body">' +
        '<span class="chip">' + (isPre ? '20 soal · ±15 menit · belum dinilai' : '20 soal · bagian dari nilai akhir') + '</span>' +
        '<h2 class="slide-h">' + esc(intro.title) + '</h2><div class="card">' + blocks(intro.screen, intro.code) + '</div>' +
        naviSay(intro.code, intro.narasi, 'pose_menunjuk') + '</div>' + bottombar(null, '', root + '1', 'Mulai') + '</div>');
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
        '<div class="score-ring" style="--p:' + score + '%"><span>' + score + '</span></div>' +
        '<p class="treat" style="text-align:center">' + right + ' dari ' + N + ' soal benar' + (isPre ? '. Ini peta kemampuan awalmu, bukan nilai kelulusan.' : '.') + '</p>' +
        '<div class="card"><b>' + (isPre ? 'Peta Kemampuan Awal' : 'Hasil per bab') + '</b><div class="row-list" style="margin-top:10px">' + rows + '</div></div>' +
        naviSay(isPre ? 'PRE-21' : 'RAP-01', isPre ? 'Bagus! Bab dengan hasil terendah sebaiknya kamu pelajari lebih dulu. Semua bab sudah terbuka di rak.' : 'Post-test selesai. Ayo lihat rapor kesiapanmu!', 'pose_jempol') +
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
  function side(b, k) {
    return '<aside class="side"><a href="#/rak">' + ic('home') + ' Rak bab</a><div class="mini" style="padding:10px">' + esc(b.label + ' · ' + b.title) + '</div>' +
      b.slides.map(function (c, j) {
        var s = D.slides[c], seen = ST.bab(b.no).seen.indexOf(c) >= 0;
        return '<a href="#/bab/' + b.no + '/' + j + '"' + (j === k ? ' class="cur"' : '') + '><span class="ck">' + (seen ? '✓' : '') + '</span>' + esc(s.title.replace(/^Aktivitas:\s*/, '')) + '</a>';
      }).join('') + '</aside>';
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
    var inner;
    if (k === 0) {
      inner = '<div class="cover-hero" style="--c:' + b.col + '">' + SG + '<div class="top"><span class="chip" style="background:rgba(255,255,255,.92)">' + esc(b.dur + ' · ' + b.slides.length + ' slide') + '</span></div>' +
        '<div class="kj jp">' + esc(b.kj) + '</div><div class="eb">' + esc(b.label + ' · ' + b.kjr) + '</div><img src="' + navi('act_memberi_salam') + '" alt=""></div>' +
        '<div class="body cover-body"><div class="card cover-card"><h2 class="slide-h">' + esc(b.title) + '</h2><p class="lead">' + esc(b.blurb) + '</p>' +
        '<h3 class="sec-h">Setelah bab ini, kamu mampu</h3><ul class="goals">' + s.screen.filter(function (x) { return x.li != null && x.lvl === 1; }).map(function (x) { return '<li>' + md(x.li.replace(/[;.]$/, '')) + '</li>'; }).join('') + '</ul>' +
        '<h3 class="sec-h">Isi bab</h3><ol class="path">' + b.lessons.map(function (t, j) { return '<li><b>' + (j + 1) + '</b><span>' + esc(t) + '</span></li>'; }).join('') + '<li class="end"><b class="jp">済</b><span>Kuis bab, stempel jika skor ≥ 80</span></li></ol></div>' +
        naviSay(code, s.narasi, 'pose_menunjuk') + '</div>';
    } else if (k === last) {
      var st = ST.bab(n);
      inner = '<div class="body"><span class="chip">' + esc(b.label) + ' · penutup</span><h2 class="slide-h">Kuis ' + esc(b.label) + '</h2>' +
        '<div class="card quiz-intro"><div class="hanko' + (st.stamp ? ' got' : ' ghost') + '"><span class="jp">済</span></div><div>' +
        '<p><b>5 soal</b>, satu per layar, dengan umpan balik langsung. Dapatkan skor <b>80</b> untuk stempel ' + esc(b.label) + '.</p>' +
        (st.best ? '<p class="mini">Skor terbaikmu: <b>' + st.best + '</b>' + (st.stamp ? ' · stempel sudah didapat' : '') + '</p>' : '') + '</div></div>' +
        '<a class="btn full" href="#/kuis/' + n + '">' + (st.best ? 'Ulangi kuis' : 'Mulai kuis') + ic('next') + '</a>' + naviSay(code, 'Siap? Kalau belum mencapai 80, kamu bisa mengulang dengan soal yang berbeda.', 'pose_semangat') + '</div>';
    } else {
      var pj = /^P(\d)/.exec(s.pel || ''), lesson = pj ? 'Pelajaran ' + pj[1] + ' · ' + (b.lessons[pj[1] - 1] || '') : (s.pel || '');
      inner = '<div class="body"><span class="chip">' + esc(lesson) + '</span><h2 class="slide-h">' + esc(s.title.replace(/^Aktivitas:\s*/, '')) + '</h2>' +
        (/^Aktivitas/.test(s.title) ? '<span class="act-tag">Aktivitas</span>' : '') +
        '<div class="card' + (ix ? ' ix-slide' : '') + '">' + (ix ? ix.html : blocks(s.screen, code)) + '</div>' +
        naviSay(code, s.narasi, 'exp_senang') + devNote(s) + '</div>';
    }
    show('<div class="with-side" style="--c:' + b.col + ';--cl:' + b.colL + '">' + side(b, k) + '<div class="screen">' + topbar(sub, s.title, pct, b.col) + inner +
      bottombar(k > 0 ? root + (k - 1) : '#/rak', (k + 1) + ' / ' + b.slides.length, k < last ? root + (k + 1) : null, k === 0 ? 'Mulai ' + b.label : 'Lanjut', gate) + '</div></div>');
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
          return j < 0 ? '' : '<div><a href="#/bab/' + n + '/' + j + '">' + esc(c + ' · ' + s.title) + '</a></div>';
        }).join('') + '</div></div>' : '') +
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
      sim = { pts: [], pick: [], trust: 50, order: M.map(function (m) { return shuffle([0, 1, 2]); }) };
      if (i !== 0) return go('#/sim/0');
      var s0 = D.slides['SIM-00'];
      return show('<div class="screen"><div class="sim-scene sim-intro" style="background-image:url(assets/bg/ruang_wawancara.webp)">' +
        '<div class="sim-card"><span class="jp">さくら食品 · 人事部</span><b class="jp">田中さん</b><span>Tanaka-san, pewawancara</span></div></div><div class="body">' +
        '<span class="chip" style="background:#2C4479;color:#fff">Bagian dari nilai akhir (50%)</span><h2 class="slide-h">Hari wawancaramu tiba</h2>' +
        '<p class="sim-lead">Kamu melamar ke <span class="jp">さくら食品</span> (Sakura Shokuhin), pabrik makanan. Dari depan gedung sampai keluar ruangan, setiap keputusanmu dinilai.</p>' +
        '<div class="rules">' +
        '<div><b>13</b><span>momen keputusan</span></div><div><b>20<small> dtk</small></b><span>per momen; habis = 0 poin</span></div>' +
        '<div><b>3</b><span>pilihan tindakan</span></div><div><b class="jp">信頼度</b><span>Trust Meter mulai 50</span></div></div>' +
        '<p class="mini sim-note">Ucapan Tanaka-san tampil dalam bahasa Jepang dan romaji, tanpa arti, seperti wawancara sungguhan.</p></div>' +
        bottombar('#/rak', '', '#/sim/1', 'Mulai simulasi') + '</div>', { dark: true });
    }
    if (i > M.length) return scrSimEnd(i);
    var m = M[i - 1], picked = sim.pick[i - 1];
    var bg = i <= 2 ? 'kantor_eksterior' : i <= 5 ? 'koridor' : 'ruang_wawancara';
    var jpLine = (m.sit.match(/「[^」]+」/) || [''])[0];
    show('<div class="screen"><div class="sim-scene" style="background-image:url(assets/bg/' + bg + '.webp)">' +
      '<div class="sim-hud"><span class="pill">Momen ' + i + '/13</span><span class="pill"><span class="jp">信頼度</span><span class="trust"><i style="width:' + sim.trust + '%"></i></span>' + sim.trust + '</span>' +
      '<span class="timer" id="tm" style="--p:100%"><span id="tmn">20</span></span></div>' +
      (jpLine ? '<div class="speech">' + esc(jpLine) + '</div>' : '') + '</div>' +
      '<div class="body"><p class="q-stem">' + esc(m.sit) + '</p><div class="opts">' +
      sim.order[i - 1].map(function (o, k) {
        var L = 'ABC'[k], cls = picked !== undefined ? (picked === o ? ' sel' : '') : '';
        return '<button class="opt' + cls + '" data-o="' + o + '"' + (picked !== undefined ? ' disabled' : '') + '><span class="L">' + L + '</span><span>' + esc(m.opts[o][0]) + '</span></button>';
      }).join('') + '</div><div id="react"></div></div></div>', { dark: true });
    function choose(o) {
      stopTimer();
      var pts = o == null ? 0 : m.opts[o][1];
      sim.pick[i - 1] = o == null ? -1 : o; sim.pts[i - 1] = pts;
      sim.trust = Math.max(0, Math.min(100, sim.trust + (pts === 10 ? 10 : pts === 0 ? -10 : 0)));
      view.querySelectorAll('.opt').forEach(function (b) { b.disabled = true; if (+b.dataset.o === o) b.classList.add('sel'); });
      document.getElementById('react').innerHTML = '<div class="reaction">' + (o == null ? 'Waktu habis…' : pts === 10 ? '田中さん mengangguk.' : pts === 5 ? '田中さん mencatat dengan ragu.' : '田中さん mengernyit.') + '</div>';
      simNext = setTimeout(function () { go('#/sim/' + (i + 1)); }, 1300);
    }
    if (picked === undefined) {
      var t0 = Date.now(), T = 20000;
      simTimer = setInterval(function () {
        var left = Math.max(0, T - (Date.now() - t0));
        var el = document.getElementById('tm'); if (!el) return stopTimer();
        el.style.setProperty('--p', (left / T * 100) + '%'); document.getElementById('tmn').textContent = Math.ceil(left / 1000);
        if (left <= 0) choose(null);
      }, 200);
      view.querySelectorAll('.opt').forEach(function (b) { b.addEventListener('click', function () { choose(+b.dataset.o); }); });
    }
  }
  function scrSimEnd(i) {
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
  function scrRapor() {
    var S = ST.get();
    if (!S.post || !S.sim) { toast('Rapor terbuka setelah Simulasi dan Post-test.'); return go('#/rak'); }
    var nilai = Math.round(0.5 * S.sim.score + 0.5 * S.post.score);
    var kat = nilai >= 85 ? ['Siap Wawancara', 'ok'] : nilai >= 75 ? ['Lulus, Perlu Penguatan', 'mid'] : ['Belum Lulus', 'no'];
    var pre = S.pre ? S.pre.score : 0, ng = pre >= 100 ? 0 : Math.round((S.post.score - pre) / (100 - pre) * 100) / 100;
    var rek = [];
    D.sim.forEach(function (m, k) { if ((S.sim.pts[k] || 0) < 10) rek.push(m.code + ' → pelajari lagi ' + m.acuan); });
    var g = function (lab, v, c) { return '<div class="gauge"><div class="score-ring" style="--p:' + v + '%;--c:' + c + '"><span>' + v + '</span></div><b style="font-size:13px">' + lab + '</b></div>'; };
    show('<div class="screen">' + topbar('Rapor Kesiapan', S.name || 'Peserta', 1) + '<div class="body">' +
      '<div class="card" style="background:var(--pri);color:#fff;position:relative;overflow:hidden">' + SG + '<div style="position:relative"><div class="mini" style="color:#DCE5F6">NILAI SUMATIF</div><div class="big-num">' + nilai + '</div>' +
      '<div class="mini" style="color:#DCE5F6">50% Simulasi (' + S.sim.score + ') + 50% Post-test (' + S.post.score + ')</div><p><span class="tag ' + kat[1] + '">' + kat[0] + '</span></p></div></div>' +
      '<div class="grid2">' + g('Komunikasi', S.sim.kom, 'var(--pri)') + g('Etika & Budaya Kerja', S.sim.etika, 'var(--good)') + '</div>' +
      '<div class="card"><b>Stempel bab</b><div class="stamps" style="margin-top:10px">' + [1, 2, 3, 4, 5, 6].map(function (n) { return '<span class="' + (S.bab[n] && S.bab[n].stamp ? 'on' : '') + '">済</span>'; }).join('') + '</div></div>' +
      '<div class="card"><b>Peningkatan</b><p>Pre-test ' + pre + ' → Post-test ' + S.post.score + ' · N-gain ' + ng + '</p></div>' +
      '<div class="card"><b>Rekomendasi</b><div class="row-list" style="margin-top:8px">' + (rek.length ? rek.map(function (r) { return '<div>' + esc(r) + '</div>'; }).join('') : '<div>Semua momen simulasi sudah tepat. Lanjutkan dengan praktik bersama instruktur LPK.</div>') + '</div></div>' +
      naviSay('RAP-03', 'Mensetsu Navi adalah persiapan. Lanjutkan dengan latihan wawancara langsung bersama instruktur LPK-mu. Ganbatte!', 'pose_semangat') +
      '</div>' + bottombar('#/rak', '', null) + '</div>');
  }

  /* ------------------------------------------------------------ fitur global & pengaturan */
  function scrHal(code) {
    var s = D.slides[code]; if (!s) return go('#/rak');
    show('<div class="screen">' + topbar('Fitur', s.title, 1) + '<div class="body"><span class="chip soon">Sedang disiapkan</span><h2 class="slide-h">' + esc(s.title) + '</h2>' +
      (ST.get().unlockAll ? '<div class="card">' + blocks(s.screen, code) + '</div>' : '') + naviSay(code, s.narasi, 'pose_dagu') + devNote(s) + '</div>' + bottombar('#/rak', '', null) + '</div>');
  }
  function scrAtur() {
    var S = ST.get();
    show('<div class="screen">' + topbar('Pengaturan', 'Data dan mode uji', 1) + '<div class="body">' +
      '<label class="field">Nama panggilan<input id="nm" value="' + esc(S.name) + '" maxlength="20"></label>' +
      '<label class="card switch-row"><span><b>Mode uji tim</b><span class="mini">Buka semua bab dan evaluasi tanpa syarat, dan tampilkan catatan storyboard. Matikan sebelum dipakai peserta.</span></span><input type="checkbox" role="switch" class="switch" id="ua" ' + (S.unlockAll ? 'checked' : '') + '></label>' +
      '<div class="card"><b>Data tersimpan di perangkat ini saja.</b><p class="mini">Progres, jawaban, dan nilai disimpan di peramban HP/laptop ini dan tidak dikirim ke mana pun.</p><button class="btn ghost" id="rs">Hapus semua progres</button></div>' +
      '</div>' + bottombar('#/rak', '', null) + '</div>');
    document.getElementById('nm').addEventListener('change', function (e) { S.name = e.target.value.trim(); ST.save(); });
    document.getElementById('ua').addEventListener('change', function (e) { S.unlockAll = e.target.checked; ST.save(); toast(S.unlockAll ? 'Mode uji aktif.' : 'Mode uji dimatikan.'); });
    document.getElementById('rs').addEventListener('click', function () {
      var b = this; if (b.dataset.sure) { ST.reset(); toast('Progres dihapus.'); go('#/mulai'); } else { b.dataset.sure = 1; b.textContent = 'Ketuk sekali lagi untuk menghapus'; }
    });
  }

  /* ------------------------------------------------------------ menu ☰ */
  function openMenu() {
    var S = ST.get(), h = location.hash;
    var wrap = document.createElement('div');
    wrap.innerHTML = '<div class="drawer-bg"></div><aside class="drawer" role="dialog" aria-label="Menu"><div class="head"><img src="' + navi('exp_senang') + '" alt=""><div style="flex:1"><b>' + esc(S.name || 'Peserta') + '</b><div class="mini" style="color:#DCE5F6">' + ST.stamps() + ' dari 6 stempel</div></div>' +
      '<button class="icon-btn" data-x aria-label="Tutup menu" style="background:rgba(255,255,255,.15);border:0;color:#fff">' + ic('x') + '</button></div><nav>' +
      '<a href="#/rak">' + ic('home') + 'Rak bab (beranda)</a><div class="sec">Bab</div>' +
      D.bab.map(function (b) { var st = ST.status(b.no); return '<a href="#/bab/' + b.no + '/' + (ST.bab(b.no).last || 0) + '"' + (h.indexOf('#/bab/' + b.no + '/') === 0 ? ' class="cur"' : '') + '>' + (st === 'done' ? '<span class="jp" style="color:var(--hanko);font-weight:900">済</span>' : st === 'locked' ? ic('lock') : '<b style="color:' + b.col + '">' + b.no + '</b>') + '<span>' + esc(b.title) + '<br><span class="mini">' + Math.round(ST.progress(b.no) * 100) + '%</span></span></a>'; }).join('') +
      '<div class="sec">Evaluasi</div><a href="#/sim/0">' + ic('chat') + 'Simulasi Mensetsu</a><a href="#/rapor">' + ic('trophy') + 'Rapor Kesiapan</a>' +
      '<div class="sec">Sumber belajar</div><a href="#/hal/GLB-03">' + ic('book') + 'Bank Kosakata</a><a href="#/hal/GLB-04">' + ic('chat') + 'Latihan Pertanyaan Acak</a><a href="#/hal/GLB-05">' + ic('bulb') + 'Tips & Trik</a><a href="#/atur">' + ic('gear') + 'Pengaturan</a></nav></aside>';
    document.body.appendChild(wrap);
    function close() { wrap.remove(); }
    wrap.querySelector('.drawer-bg').addEventListener('click', close);
    wrap.querySelector('[data-x]').addEventListener('click', close);
    wrap.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', k); } });
  }
  window.MN_MENU = openMenu;

  /* ------------------------------------------------------------ rak */
  function scrRak() {
    var S = ST.get();
    if (!S.name) return go('#/mulai');
    stopVoice(); stopTimer();
    view.hidden = true; view.innerHTML = ''; document.body.className = '';
    rakEl.hidden = false;
    if (window.MN_RAK) window.MN_RAK.show();
  }
  window.MN_APP = {
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
  window.addEventListener('hashchange', route);
  route();

  /* ------------------------------------------------------------ PWA */
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
})();
