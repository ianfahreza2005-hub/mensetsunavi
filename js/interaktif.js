/* Mensetsu Navi — template interaktif slide (Tahap 2).
   Membaca blok layar dari naskah (p, li, table) lalu mengganti bagian yang cocok
   dengan widget interaktif sesuai kode template (T02–T16). Slide dengan widget
   dianggap selesai setelah semua widget-nya tuntas; tombol Lanjut baru aktif saat itu.

   API: MN_IX.render(code) -> { html, gated, bind(root, onDone) }            */
(function () {
  var D = window.MN_DATA;
  var CJK = /[぀-ヿ一-鿿]/;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function md(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); }
  function plain(s) { return String(s || '').replace(/\*\*/g, ''); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function hdr(t, re) { for (var i = 0; i < t[0].length; i++) if (re.test(t[0][i])) return i; return -1; }

  /* suara Jepang: rekaman bila kelak ada, sementara suara bawaan perangkat (ja-JP) */
  function sayJa(text) {
    var t = String(text || '').replace(/[「」]/g, '').replace(/[〇○]+/g, '').replace(/\(.*?\)|（.*?）/g, '').trim();
    if (!t || !window.speechSynthesis) return false;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(t); u.lang = 'ja-JP'; u.rate = 0.85;
    var v = speechSynthesis.getVoices().filter(function (x) { return /^ja/i.test(x.lang); })[0]; if (v) u.voice = v;
    speechSynthesis.speak(u); return true;
  }
  var SPK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></svg>';

  /* ---------------------------------------------------- pemecah blok */
  function groups(list) {
    var out = [], cur = null;
    (list || []).forEach(function (b, i) {
      if (b.li != null) { if (!cur) { cur = { li: [] }; out.push(cur); } cur.li.push(b); return; }
      cur = null; var c = {}; for (var k in b) c[k] = b[k]; c.i = i; out.push(c);
    });
    return out;
  }
  /* paragraf naskah → teks untuk peserta (lihat js/data/tampilan.js) */
  function cap(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  function para(code, i, p) {
    var o = (window.MN_TAMPIL || {})[code];
    if (o && Object.prototype.hasOwnProperty.call(o, i)) { if (o[i] === null) return ''; p = o[i]; }
    p = String(p).trim();
    if (/^"[^"]+"$/.test(p)) p = p.slice(1, -1);
    if (/^[a-z]/.test(p)) p = cap(p);
    var m;
    if ((m = /^Kotak "([^"]+)":\s*/.exec(p))) {
      var kind = /hindari/i.test(m[1]) ? 'warn' : /tahukah/i.test(m[1]) ? 'tip' : 'info';
      return '<aside class="callout ' + kind + '"><b class="ct">' + esc(m[1]) + '</b><p>' + md(cap(p.slice(m[0].length))) + '</p></aside>';
    }
    if ((m = /^Tips:\s*/.exec(p))) return '<aside class="callout tip"><b class="ct">Tips</b><p>' + md(cap(p.slice(m[0].length))) + '</p></aside>';
    if ((m = /^(Kalimat kunci|Kata Mutiara):\s*/.exec(p))) return '<blockquote class="kunci">' + md(p.slice(m[0].length).replace(/\*\*/g, '').replace(/^"|"$/g, '')) + '</blockquote>';
    if ((m = /^(Keterangan kecil|Keterangan|Catatan kecil|Catatan kosakata|Catatan):\s*/.exec(p))) return '<p class="note"><b>' + esc(m[1].replace(/ kecil$/, '')) + ':</b> ' + md(p.slice(m[0].length)) + '</p>';
    return '<p>' + md(p) + '</p>';
  }
  function blocksFor(code, list) {
    return groups(list).map(function (g) { return g.li ? staticLi(g.li) : g.table ? staticTable(g.table) : para(code, g.i, g.p); }).join('');
  }
  function staticLi(items) {
    return '<ul class="items">' + items.map(function (b) {
      return '<li class="l' + (b.lvl || 0) + '">' + (b.num ? '<span class="n">' + esc(b.num.replace('.', '')) + '</span>' : '') + '<span>' + md(b.li) + '</span></li>';
    }).join('') + '</ul>';
  }
  function staticTable(t) {
    return '<div class="tbl"><table>' + t.map(function (r, i) {
      return '<tr>' + r.map(function (c) { return i === 0 ? '<th>' + md(c) + '</th>' : '<td>' + md(c) + '</td>'; }).join('') + '</tr>';
    }).join('') + '</table></div>';
  }
  function staticBlock(g) { return g.li ? staticLi(g.li) : g.table ? staticTable(g.table) : '<p>' + md(g.p) + '</p>'; }

  /* li berlabel "**Judul:** isi" → kartu; li tingkat 1 ikut kartu sebelumnya */
  function labeledCards(items) {
    var cards = [], ok = 0;
    items.forEach(function (b) {
      var m = (b.lvl || 0) === 0 && /^\*\*(.+?):?\*\*:?\s*(.*)$/.exec(b.li);
      if ((b.lvl || 0) === 0) {
        if (m) ok++;
        cards.push({ label: m ? m[1].replace(/:$/, '') : plain(b.li).slice(0, 60), body: m ? md(m[2]) : md(b.li), sub: [] });
      } else if (cards.length) cards[cards.length - 1].sub.push(b.li);
    });
    if (cards.length < 2 || ok < cards.length) return null;
    return cards.map(function (c) { return { label: c.label, body: (c.body ? '<p>' + c.body + '</p>' : '') + (c.sub.length ? '<ul>' + c.sub.map(function (s) { return '<li>' + md(s) + '</li>'; }).join('') + '</ul>' : '') }; });
  }

  /* ---------------------------------------------------- widget */
  var W = {};

  /* T03/T06/T08: kartu yang dibuka satu per satu */
  W.open = function (cards, hint) {
    return {
      html: '<div class="ix-open" role="list">' + cards.map(function (c, i) {
        return '<div class="ix-card" role="listitem"><button class="ix-head" aria-expanded="false" data-i="' + i + '"><span class="ix-n">' + (i + 1) + '</span><span class="ix-l">' + md(c.label) + '</span><span class="ix-ck" aria-hidden="true"></span></button><div class="ix-body" hidden>' + c.body + '</div></div>';
      }).join('') + '</div><p class="ix-hint">' + esc(hint || 'Ketuk setiap kartu untuk membukanya.') + ' <span class="ix-count"></span></p>',
      bind: function (el, done) {
        var seen = {}, n = cards.length, cnt = el.querySelector('.ix-count');
        function upd() { var k = Object.keys(seen).length; cnt.textContent = k + '/' + n; if (k === n) done(); }
        el.querySelectorAll('.ix-head').forEach(function (b) {
          b.addEventListener('click', function () {
            var open = b.getAttribute('aria-expanded') !== 'true';
            b.setAttribute('aria-expanded', open); b.nextElementSibling.hidden = !open;
            b.parentNode.classList.toggle('on', open);
            if (open) { seen[b.dataset.i] = 1; b.parentNode.classList.add('seen'); upd(); }
          });
        });
        upd();
      }
    };
  };
  function tableCards(t, labelCols) {
    var head = t[0];
    return t.slice(1).map(function (r) {
      var lab = labelCols.map(function (c) { return r[c]; }).filter(Boolean).join(' · ');
      var body = r.map(function (c, i) {
        if (labelCols.indexOf(i) >= 0 || !c) return '';
        return '<p>' + (head[i] && !/pop-?up|isi/i.test(head[i]) ? '<b class="ix-k">' + md(head[i]) + '</b> ' : '') + md(c) + '</p>';
      }).join('');
      return { label: lab, body: body };
    });
  }

  /* T05/T15: kartu ungkapan dengan suara, Romaji dan Arti */
  W.phrase = function (t) {
    var jp = -1, ro = hdr(t, /cara baca|romaji/i), ar = hdr(t, /^arti|pasangan/i);
    for (var c = 0; c < t[0].length; c++) { if (c !== ro && t.slice(1).some(function (r) { return CJK.test(r[c]); })) { jp = c; break; } }
    var rest = t[0].map(function (_, i) { return i; }).filter(function (i) { return i !== jp && i !== ro && i !== ar; });
    var rows = t.slice(1);
    return {
      html: '<div class="ix-phr"><div class="ix-tog"><button class="btn soft on" data-t="ro" aria-pressed="true">Romaji</button><button class="btn soft on" data-t="ar" aria-pressed="true">Arti</button></div>' +
        rows.map(function (r, i) {
          return '<div class="ix-pc" data-i="' + i + '">' +
            (rest.length ? '<div class="ix-meta">' + rest.map(function (c) { return r[c] ? '<span>' + md(r[c]) + '</span>' : ''; }).join('') + '</div>' : '') +
            '<div class="ix-jrow"><span class="jp ix-j">' + md(r[jp]) + '</span><button class="ix-sp" aria-label="Dengarkan ungkapan" data-i="' + i + '">' + SPK + '</button></div>' +
            (ro >= 0 ? '<div class="ix-ro">' + md(r[ro]) + '</div>' : '') + (ar >= 0 ? '<div class="ix-ar">' + md(r[ar]) + '</div>' : '') + '</div>';
        }).join('') + '<p class="ix-hint">Dengarkan setiap ungkapan, lalu tirukan. Matikan Romaji atau Arti untuk menguji diri. <span class="ix-count"></span></p></div>',
      bind: function (el, done) {
        var heard = {}, cnt = el.querySelector('.ix-count');
        function upd() { var k = Object.keys(heard).length; cnt.textContent = k + '/' + rows.length; if (k === rows.length) done(); }
        el.querySelectorAll('.ix-sp').forEach(function (b) {
          b.addEventListener('click', function () {
            var r = rows[+b.dataset.i]; if (!sayJa(r[jp])) toast2(el, 'Suara Jepang belum tersedia di perangkat ini.');
            heard[b.dataset.i] = 1; b.closest('.ix-pc').classList.add('seen'); upd();
          });
        });
        el.querySelectorAll('.ix-tog button').forEach(function (b) {
          b.addEventListener('click', function () {
            var on = !b.classList.contains('on'); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
            el.querySelector('.ix-phr').classList.toggle('no-' + b.dataset.t, !on);
          });
        });
        el.querySelectorAll('.ix-ro,.ix-ar').forEach(function (d) { d.addEventListener('click', function () { d.classList.toggle('peek'); }); });
        upd();
      }
    };
  };
  function toast2(el, msg) { var p = el.querySelector('.ix-hint'); if (p && p.dataset.w !== '1') { p.dataset.w = '1'; p.insertAdjacentHTML('afterbegin', '<b>' + esc(msg) + '</b> '); } }

  /* T10 dan T13 (kolom Jawaban + Umpan balik): pilih kategori setiap kartu */
  W.sort = function (t) {
    var ja = hdr(t, /^jawaban$/i), fb = hdr(t, /umpan balik/i), rows = t.slice(1);
    var cats = []; rows.forEach(function (r) { if (cats.indexOf(r[ja]) < 0) cats.push(r[ja]); });
    var many = cats.length > 4;
    var order = shuffle(rows.map(function (_, i) { return i; }));
    return {
      html: '<div class="ix-sort">' + order.map(function (i) {
        var r = rows[i], opts = many ? shuffle([r[ja]].concat(shuffle(cats.filter(function (c) { return c !== r[ja]; })).slice(0, 2))) : cats;
        return '<div class="ix-sc" data-i="' + i + '"><p class="ix-q">' + md(r[0]) + '</p><div class="ix-opts">' + opts.map(function (c) { return '<button class="ix-o" data-v="' + esc(c) + '">' + md(c) + '</button>'; }).join('') + '</div><p class="ix-fb" hidden></p></div>';
      }).join('') + '<p class="ix-hint">Pilih jawaban untuk setiap kartu. <span class="ix-count"></span></p></div>',
      bind: function (el, done) {
        var ok = {}, cnt = el.querySelector('.ix-count');
        function upd() { var k = Object.keys(ok).length; cnt.textContent = k + '/' + rows.length + ' tepat'; if (k === rows.length) done(); }
        el.querySelectorAll('.ix-sc').forEach(function (card) {
          var r = rows[+card.dataset.i], f = card.querySelector('.ix-fb');
          card.querySelectorAll('.ix-o').forEach(function (b) {
            b.addEventListener('click', function () {
              if (ok[card.dataset.i]) return;
              var right = b.dataset.v === r[ja];
              b.classList.add(right ? 'good' : 'bad');
              f.hidden = false; f.className = 'ix-fb ' + (right ? 'good' : 'bad');
              f.innerHTML = right ? '<b>Tepat.</b> ' + (fb >= 0 && rows.length && !/jika salah/i.test(t[0][fb]) ? md(r[fb]) : '') : '<b>Belum tepat.</b> ' + (fb >= 0 ? md(r[fb]) : 'Coba lagi.');
              if (right) { ok[card.dataset.i] = 1; card.classList.add('done'); card.querySelectorAll('.ix-o').forEach(function (x) { x.disabled = true; }); upd(); }
              else { card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake'); }
            });
          });
        });
        upd();
      }
    };
  };

  /* T13 kasus bercabang (Pilihan | Hasil | Umpan balik) */
  W.cases = function (t) {
    var rows = t.slice(1), ord = shuffle(rows.map(function (_, i) { return i; }));
    return {
      html: '<div class="ix-case"><div class="ix-opts col">' + ord.map(function (i) { return '<button class="ix-o" data-i="' + i + '">' + md(rows[i][0]) + '</button>'; }).join('') + '</div><p class="ix-fb" hidden></p></div>',
      bind: function (el, done) {
        var f = el.querySelector('.ix-fb');
        el.querySelectorAll('.ix-o').forEach(function (b) {
          b.addEventListener('click', function () {
            var r = rows[+b.dataset.i], res = r[1], good = /^tepat/i.test(res), mid = /kurang/i.test(res);
            el.querySelectorAll('.ix-o').forEach(function (x) { x.classList.remove('good', 'bad', 'mid'); });
            b.classList.add(good ? 'good' : mid ? 'mid' : 'bad');
            f.hidden = false; f.className = 'ix-fb ' + (good ? 'good' : mid ? 'mid' : 'bad');
            f.innerHTML = '<b>' + md(res) + '.</b> ' + md(r[2]) + (good ? '' : ' <i>Coba pilihan lain.</i>');
            var meter = el.closest('.card') && el.closest('.card').querySelector('.ix-trust i');
            if (meter) meter.style.width = Math.max(5, Math.min(100, parseFloat(meter.style.width || 50) + (good ? 12 : mid ? -4 : -12))) + '%';
            if (good) done();
          });
        });
      }
    };
  };

  /* T13 pilihan dengan kolom benar/salah (Tepat|Kurang tepat|Salah atau jujur/tidak jujur) */
  /* sel "Jawaban Rani di B5-05 (…)" diganti contoh jawaban asli dari slide yang dirujuk */
  function resolveRef(cell, question) {
    var m = /^Jawaban Rani di (B\d-\d\d)/.exec(cell || ''); if (!m || !D.slides[m[1]]) return cell;
    var q = (/「(.+?)」/.exec(question) || [])[1], found = null;
    D.slides[m[1]].screen.forEach(function (b) {
      if (!b.table || found) return;
      var ca = hdr(b.table, /contoh jawaban/i); if (ca < 0) return;
      var tail = q && q.split('、').pop();
      b.table.slice(1).forEach(function (r) { if (!found && q && r[0].indexOf(q) >= 0) found = r[ca]; });
      b.table.slice(1).forEach(function (r) { if (!found && tail && r[0].indexOf(tail) >= 0) found = r[ca]; });
    });
    return found || cell;
  }
  W.pick = function (t) {
    var head = t[0], rows = t.slice(1).map(function (r) { return r.map(function (c, i) { return i ? resolveRef(c, r[0]) : c; }); });
    var good = hdr(t, /^tepat$|^jawaban jujur/i), why = hdr(t, /mengapa/i);
    var optCols = head.map(function (_, i) { return i; }).filter(function (i) { return i > 0 && i !== why; });
    return {
      html: '<div class="ix-sort">' + rows.map(function (r, i) {
        return '<div class="ix-sc" data-i="' + i + '"><p class="ix-q">' + md(r[0]) + '</p><div class="ix-opts col">' + shuffle(optCols).map(function (c) { return '<button class="ix-o" data-c="' + c + '">' + md(r[c]) + '</button>'; }).join('') + '</div><p class="ix-fb" hidden></p></div>';
      }).join('') + '<p class="ix-hint">Pilih jawaban terbaik. <span class="ix-count"></span></p></div>',
      bind: function (el, done) {
        var ok = {}, cnt = el.querySelector('.ix-count');
        function upd() { var k = Object.keys(ok).length; cnt.textContent = k + '/' + rows.length; if (k === rows.length) done(); }
        el.querySelectorAll('.ix-sc').forEach(function (card) {
          var r = rows[+card.dataset.i], f = card.querySelector('.ix-fb');
          card.querySelectorAll('.ix-o').forEach(function (b) {
            b.addEventListener('click', function () {
              if (ok[card.dataset.i]) return;
              var c = +b.dataset.c, right = c === good, lab = head[c].replace(/^jawaban /i, '');
              b.classList.add(right ? 'good' : /kurang/i.test(lab) ? 'mid' : 'bad');
              f.hidden = false; f.className = 'ix-fb ' + (right ? 'good' : 'bad');
              f.innerHTML = '<b>' + esc(lab.charAt(0).toUpperCase() + lab.slice(1)) + '.</b> ' + (why >= 0 ? md(r[why]) : right ? '' : 'Coba lagi.');
              if (right) { ok[card.dataset.i] = 1; card.classList.add('done'); card.querySelectorAll('.ix-o').forEach(function (x) { x.disabled = true; }); upd(); }
            });
          });
        });
        upd();
      }
    };
  };

  /* T04: tabel bertahap, baris muncul satu per satu */
  W.reveal = function (t) {
    return {
      html: '<div class="ix-rev"><div class="tbl"><table><tr>' + t[0].map(function (c) { return '<th>' + md(c) + '</th>'; }).join('') + '</tr>' +
        t.slice(1).map(function (r, i) { return '<tr' + (i ? ' hidden' : '') + '>' + r.map(function (c) { return '<td>' + md(c) + '</td>'; }).join('') + '</tr>'; }).join('') +
        '</table></div><button class="btn soft ix-more">Tampilkan berikutnya</button></div>',
      bind: function (el, done) {
        var b = el.querySelector('.ix-more');
        function chk() { if (!el.querySelector('tr[hidden]')) { b.hidden = true; done(); } }
        b.addEventListener('click', function () { var tr = el.querySelector('tr[hidden]'); if (tr) { tr.hidden = false; tr.classList.add('ix-in'); } chk(); });
        chk();
      }
    };
  };

  /* T03: daftar langkah bernomor, tampil satu per satu (stepper) */
  W.steps = function (items) {
    var n = items.length;
    return {
      html: '<div class="ix-steps"><ol>' + items.map(function (b, i) {
        return '<li' + (i ? ' hidden' : ' class="cur"') + '><span class="ix-sn">' + (i + 1) + '</span><span class="ix-st">' + md(b.li) + '</span></li>';
      }).join('') + '</ol><div class="ix-sbar"><span class="ix-count" aria-live="polite"></span><button class="btn soft ix-more">Berikutnya</button></div></div>',
      bind: function (el, done) {
        var lis = el.querySelectorAll('li'), b = el.querySelector('.ix-more'), c = el.querySelector('.ix-count'), at = 0;
        function upd() {
          c.textContent = (at + 1) + ' / ' + n;
          lis.forEach(function (li, i) { li.classList.toggle('cur', i === at); li.classList.toggle('past', i < at); });
          if (at === n - 1) { b.hidden = true; c.textContent = n + ' / ' + n + ' · lengkap'; done(); }
        }
        b.addEventListener('click', function () {
          if (at < n - 1) { at++; lis[at].hidden = false; lis[at].classList.add('ix-in'); upd(); try { lis[at].scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) { /* peramban lama */ } }
        });
        upd();
      }
    };
  };

  /* T02: pemantik, pilih dulu lalu penjelasan terbuka */
  W.choice = function (opts) {
    return {
      html: '<div class="ix-opts col ix-ch">' + opts.map(function (o, i) { return '<button class="ix-o" data-i="' + i + '">' + md(o) + '</button>'; }).join('') + '</div>',
      bind: function (el, done) {
        el.querySelectorAll('.ix-o').forEach(function (b) {
          b.addEventListener('click', function () {
            el.querySelectorAll('.ix-o').forEach(function (x) { x.classList.remove('sel'); });
            b.classList.add('sel');
            var after = el.closest('.card').querySelector('.ix-after'); if (after) { after.hidden = false; after.classList.add('ix-in'); }
            done();
          });
        });
      }
    };
  };

  /* T11 tahap A: urutkan langkah */
  W.order = function (steps) {
    var ord = shuffle(steps.map(function (_, i) { return i; }));
    return {
      html: '<div class="ix-ord"><ol class="ix-slots">' + steps.map(function () { return '<li class="empty"></li>'; }).join('') + '</ol><div class="ix-pool">' + ord.map(function (i) { return '<button class="ix-o" data-i="' + i + '">' + md(steps[i]) + '</button>'; }).join('') + '</div><p class="ix-hint">Ketuk langkah sesuai urutannya, dari yang pertama. <span class="ix-count"></span></p></div>',
      bind: function (el, done) {
        var next = 0, slots = el.querySelectorAll('.ix-slots li'), cnt = el.querySelector('.ix-count');
        function upd() { cnt.textContent = next + '/' + steps.length; if (next === steps.length) done(); }
        el.querySelectorAll('.ix-pool .ix-o').forEach(function (b) {
          b.addEventListener('click', function () {
            if (+b.dataset.i === next) { slots[next].innerHTML = md(steps[next]); slots[next].className = 'ix-in'; b.remove(); next++; upd(); }
            else { b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake', 'bad'); setTimeout(function () { b.classList.remove('bad'); }, 600); }
          });
        });
        upd();
      }
    };
  };

  /* T11 tahap B (B6-09): pilih ungkapan yang benar per langkah */
  W.fill = function (t) {
    var ok = hdr(t, /ungkapan yang benar/i), oj = hdr(t, /ojigi/i), bad = hdr(t, /pengecoh/i), rows = t.slice(1);
    var tt = [['Langkah', 'Tepat', 'Salah', 'Mengapa']].concat(rows.map(function (r) { return [r[0], r[ok], r[bad], oj >= 0 ? 'Ojigi: ' + r[oj] : '']; }));
    return W.pick(tt);
  };

  /* T09: penggeser sudut ojigi */
  W.ojigi = function (t) {
    var sd = hdr(t, /sudut/i), rows = t.slice(1).map(function (r) { return { deg: parseFloat(String(r[sd]).replace(/[^\d.]/g, '')), r: r }; });
    return {
      html: '<div class="ix-oj"><svg viewBox="0 0 200 200" class="ix-fig" aria-hidden="true"><line x1="40" y1="190" x2="170" y2="190" stroke="var(--line)" stroke-width="4"/>' +
        '<g class="legs"><line x1="100" y1="188" x2="100" y2="120" stroke="var(--ink)" stroke-width="12" stroke-linecap="round"/></g>' +
        '<g class="torso" style="transform-origin:100px 120px"><line x1="100" y1="120" x2="100" y2="62" stroke="var(--c)" stroke-width="16" stroke-linecap="round"/><circle cx="100" cy="40" r="17" fill="var(--ink)"/></g></svg>' +
        '<div class="ix-deg"><b>0°</b></div><input type="range" min="0" max="45" value="0" step="1" aria-label="Sudut ojigi"><div class="ix-ojc" hidden></div>' +
        '<p class="ix-hint">Geser untuk membungkuk; berhenti di setiap jenis ojigi. <span class="ix-count"></span></p></div>',
      bind: function (el, done) {
        var inp = el.querySelector('input'), tor = el.querySelector('.torso'), deg = el.querySelector('.ix-deg b'), card = el.querySelector('.ix-ojc'), seen = {}, cnt = el.querySelector('.ix-count');
        function upd() {
          var v = +inp.value; tor.style.transform = 'rotate(' + v + 'deg)'; deg.textContent = v + '°';
          var hit = rows.filter(function (x) { return Math.abs(x.deg - v) <= 2; })[0];
          if (hit) {
            seen[hit.deg] = 1; card.hidden = false;
            card.innerHTML = '<b class="jp">' + md(hit.r[0]) + '</b> · ' + md(hit.r[sd]) + t[0].map(function (h, i) { return i > 1 ? '<p><b class="ix-k">' + md(h) + '</b> ' + md(hit.r[i]) + '</p>' : ''; }).join('');
          } else card.hidden = true;
          var k = Object.keys(seen).length; cnt.textContent = k + '/' + rows.length; if (k === rows.length) done();
        }
        inp.addEventListener('input', upd); upd();
      }
    };
  };

  /* T12: cocokkan kartu Jepang dengan artinya */
  W.match = function (t) {
    var ro = hdr(t, /romaji/i), ar = hdr(t, /pasangan|arti/i), rows = t.slice(1);
    var L = shuffle(rows.map(function (_, i) { return i; })), R = shuffle(rows.map(function (_, i) { return i; }));
    return {
      html: '<div class="ix-match"><div class="col">' + L.map(function (i) { return '<button class="ix-o" data-s="L" data-i="' + i + '"><span class="jp">' + md(rows[i][0]) + '</span>' + (ro >= 0 ? '<small>' + md(rows[i][ro]) + '</small>' : '') + '</button>'; }).join('') +
        '</div><div class="col">' + R.map(function (i) { return '<button class="ix-o" data-s="R" data-i="' + i + '">' + md(rows[i][ar]) + '</button>'; }).join('') +
        '</div></div><p class="ix-hint">Ketuk kartu Jepang, lalu ketuk artinya. <span class="ix-count"></span></p>',
      bind: function (el, done) {
        var sel = null, got = 0, cnt = el.querySelector('.ix-count');
        function upd() { cnt.textContent = got + '/' + rows.length + ' pasang'; if (got === rows.length) done(); }
        el.querySelectorAll('.ix-match .ix-o').forEach(function (b) {
          b.addEventListener('click', function () {
            if (b.classList.contains('good')) return;
            if (!sel || sel.dataset.s === b.dataset.s) { if (sel) sel.classList.remove('sel'); sel = b; b.classList.add('sel'); if (b.dataset.s === 'L') sayJa(rows[+b.dataset.i][0]); return; }
            if (sel.dataset.i === b.dataset.i) { sel.classList.remove('sel'); sel.classList.add('good'); b.classList.add('good'); sel.disabled = b.disabled = true; got++; upd(); }
            else { var a = sel; [a, b].forEach(function (x) { x.classList.add('bad', 'shake'); }); setTimeout(function () { [a, b].forEach(function (x) { x.classList.remove('bad', 'shake', 'sel'); }); }, 600); }
            sel = null;
          });
        });
        upd();
      }
    };
  };

  /* T15: rekam suara sendiri lalu dengarkan ulang (Lapis 2: centang daftar periksa) */
  W.record = function () {
    var can = !!(navigator.mediaDevices && window.MediaRecorder);
    return {
      html: '<div class="ix-rec"><div class="ix-rrow"><button class="btn ix-r"' + (can ? '' : ' disabled') + '>● Rekam</button><span class="ix-tm">0:00</span><audio controls hidden></audio></div>' +
        '<div class="ix-chk"><b>Periksa rekamanmu</b>' + ['Suara jelas, tidak bergumam', 'Tempo tenang, ada jeda', 'Ungkapan diucapkan lengkap', 'Akhir kalimat turun dengan mantap'].map(function (c, i) { return '<label><input type="checkbox" data-i="' + i + '"> ' + c + '</label>'; }).join('') + '</div>' +
        '<p class="ix-hint">' + (can ? 'Rekaman hanya disimpan sementara di perangkatmu.' : 'Perangkat ini belum mendukung perekaman.') + ' <button class="linkbtn ix-skip">Lewati</button></p></div>',
      bind: function (el, done) {
        var btn = el.querySelector('.ix-r'), tm = el.querySelector('.ix-tm'), au = el.querySelector('audio'), rec = null, chunks = [], t0 = 0, tick = null, stream = null;
        el.querySelector('.ix-skip').addEventListener('click', done);
        el.querySelectorAll('.ix-chk input').forEach(function (c) { c.addEventListener('change', function () { if (el.querySelectorAll('.ix-chk input:checked').length >= 2 && !au.hidden) done(); }); });
        if (!can) return;
        btn.addEventListener('click', function () {
          if (rec && rec.state === 'recording') { rec.stop(); return; }
          navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) {
            stream = s; chunks = []; rec = new MediaRecorder(s);
            rec.ondataavailable = function (e) { chunks.push(e.data); };
            rec.onstop = function () {
              clearInterval(tick); stream.getTracks().forEach(function (x) { x.stop(); });
              au.src = URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || 'audio/webm' })); au.hidden = false;
              btn.textContent = '● Rekam ulang'; btn.classList.remove('live');
            };
            rec.start(); t0 = Date.now(); btn.textContent = '■ Berhenti'; btn.classList.add('live');
            tick = setInterval(function () { var s2 = Math.floor((Date.now() - t0) / 1000); tm.textContent = Math.floor(s2 / 60) + ':' + ('0' + s2 % 60).slice(-2); if (s2 >= 90) rec.stop(); }, 250);
          }).catch(function () { tm.textContent = 'Izin mikrofon ditolak'; });
        });
      }
    };
  };

  /* ---------------------------------------------------- penyusun slide */
  var NOINT = ['T01', 'T17', 'T18', 'T19', 'T20', 'T21', ''];
  function render(code) {
    var s = D.slides[code], tpl = s.tpl || '', gs = groups(s.screen), parts = [], ws = [];
    if (NOINT.indexOf(tpl) >= 0) return null;
    function add(w) { var id = ws.length; ws.push(w); parts.push('<div class="ix" data-w="' + id + '">' + w.html + '</div>'); }

    var choiceAt = -1, choiceLabels = null;
    gs.forEach(function (g, gi) {
      if (g.table) {
        var t = g.table, h = t[0].join('|');
        if (tpl === 'T12') return add(W.match(t));
        if (tpl === 'T09' && /sudut/i.test(h)) return add(W.ojigi(t));
        if (/pengecoh/i.test(h)) return add(W.fill(t));
        if (/^pilihan\|hasil/i.test(h)) return add(W.cases(t));
        if (/\|tepat\|kurang tepat\|salah|jawaban jujur/i.test(h)) return add(W.pick(t));
        if (hdr(t, /^jawaban$/i) >= 0 && hdr(t, /umpan balik/i) >= 0) return add(W.sort(t));
        if (hdr(t, /cara baca|romaji/i) >= 0 && t.slice(1).some(function (r) { return r.some(function (c) { return CJK.test(c); }); })) return add(W.phrase(t));
        if (tpl === 'T04') return add(W.reveal(t));
        if (tpl === 'T02' && t[0].length >= 3) { parts.push(staticTable(t)); choiceAt = parts.length; return; }
        if (/^T0[3678]$|^T16$/.test(tpl)) {
          var lc = [0]; if (t[0].length >= 4 && t.slice(1).every(function (r) { return String(r[1]).length < 40; })) lc = [0, 1];
          if (/pertanyaan/i.test(t[0][1]) && /^no$/i.test(t[0][0])) lc = [1];
          return add(W.open(tableCards(t, lc), tpl === 'T08' ? 'Ketuk setiap titik untuk melihat kesalahannya.' : null));
        }
        return parts.push(staticTable(t));
      }
      if (g.li) {
        var lab = tpl === 'T02' && labeledCards(g.li);
        if (lab) { parts.push(staticLi(g.li)); choiceAt = parts.length; choiceLabels = lab.map(function (c) { return c.label.replace(/\s*\(.*\)$/, ''); }); return; }
        if (tpl === 'T02' && g.li.length >= 2 && g.li.length <= 5 && g.li.every(function (b) { return (b.lvl || 0) === 0; })) {
          var opts = g.li.map(function (b) { return b.li.replace(/^Pilihan \d+:\s*/i, '').replace(/^"(.*)"$/, '$1'); });
          add(W.choice(opts)); parts.push('<div class="ix-after" hidden>'); choiceAt = -2; return;
        }
        var cards = /^T0[3567]$|^T15$/.test(tpl) ? labeledCards(g.li) : null;
        if (cards) return add(W.open(cards));
        if (tpl === 'T03' && g.li.length >= 3 && g.li.every(function (b) { return (b.lvl || 0) === 0 && b.num; })) return add(W.steps(g.li));
        return parts.push(staticLi(g.li));
      }
      /* paragraf */
      var ref = tpl === 'T11' && /urutkan/i.test(g.p) && /\((B\d-\d\d)\)/.exec(g.p);
      parts.push(para(code, g.i, g.p));
      if (ref && D.slides[ref[1]]) {
        var steps = D.slides[ref[1]].screen.filter(function (b) { return b.li != null && (b.lvl || 0) === 0; }).map(function (b) { return b.li; });
        if (steps.length >= 3) add(W.order(steps));
      }
    });
    if (choiceAt === -2) parts.push('</div>');
    if (choiceAt > 0) {
      var cand = choiceLabels || gs.filter(function (g) { return g.table; })[0].table[0].filter(Boolean);
      var w = W.choice(cand); var id = ws.length; ws.push(w);
      parts.push('<div class="ix" data-w="' + id + '">' + w.html + '</div>');
    }
    if (tpl === 'T15') add(W.record());
    if (tpl === 'T09' && !ws.length) return null;
    if (/Kepercayaan/.test((s.screen[0] || {}).p || '')) parts.unshift('<div class="ix-trust" aria-label="Indikator kepercayaan"><span>信頼 Kepercayaan</span><b><i style="width:50%"></i></b></div>');
    if (!ws.length) return null;
    return {
      html: parts.join(''),
      gated: true,
      bind: function (root, onDone) {
        var left = ws.length, fired = {};
        root.querySelectorAll('.ix[data-w]').forEach(function (el) {
          var id = +el.dataset.w;
          ws[id].bind(el, function () { if (fired[id]) return; fired[id] = 1; if (--left === 0) onDone(); });
        });
      }
    };
  }

  window.MN_IX = { render: render, sayJa: sayJa, blocks: blocksFor, para: para };
})();
