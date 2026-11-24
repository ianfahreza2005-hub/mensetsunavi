/* Mensetsu Navi — template interaktif slide (Tahap 2).
   Membaca blok layar dari naskah (p, li, table) lalu mengganti bagian yang cocok
   dengan widget interaktif sesuai kode template (T02–T16). Slide dengan widget
   dianggap selesai setelah semua widget-nya tuntas; tombol Lanjut baru aktif saat itu.

   API: MN_IX.render(code) -> { html, gated, bind(root, onDone) }            */
(function () {
  var D = window.MN_DATA;
  var CJK = /[぀-ヿ一-鿿]/;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  /* GLB-02: pola 「日本語」 (romaji, "arti") dibungkus agar tombol Romaji/Arti bisa menyembunyikan bagiannya.
     Bentuk: (romaji, "arti"[, catatan]) · (romaji. Arti tanpa kutip, dikenali dari kata awal bahasa Indonesia) · (romaji saja).
     Saat keduanya menyala, teks identik dengan aslinya. */
  var ARTI_AWAL = /^([\s\S]*?[.?!])\s+((?:Saya|Jika|Tidak|Kalau|Apa|Bolehkah|Nama|Mohon|Silakan|Terima|Maaf|Selamat|Boleh|Kamu|Permisi)\b[\s\S]*)$/;
  function roWrap(h) {
    return h.replace(/(」)(\s*)\(([A-Za-z…][^()]*)\)/g, function (m, k, sp, inner) {
      var q = /^([\s\S]*?)([,.]?\s+)(?:&quot;|“)([\s\S]+?)(?:&quot;|”)([\s\S]*)$/.exec(inner);
      if (q) return k + sp + '<span class="gro">(<span class="r">' + q[1] + '</span><span class="s">' + q[2] + '</span><span class="a">“' + q[3] + '”</span>' + q[4] + ')</span>';
      var u = ARTI_AWAL.exec(inner);
      if (u) return k + sp + '<span class="gro">(<span class="r">' + u[1] + '</span><span class="s"> </span><span class="a">' + u[2] + '</span>)</span>';
      return k + sp + '<span class="gro ro-only">(<span class="r">' + inner + '</span>)</span>';
    });
  }
  /* kode slide di naskah ("pakai ungkapan di B5-09") diganti judul slidenya dalam tanda petik: peserta tidak melihat kode slide */
  function judulKode(h) {
    return h.replace(/\b(B\d-\d\d)\b/g, function (m, kode) { var sl = D.slides[kode]; return sl ? '“' + esc(sl.title.replace(/^Aktivitas:\s*/, '')) + '”' : m; });
  }
  function md(s) { return roWrap(judulKode(esc(s)).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')); }
  function plain(s) { return String(s || '').replace(/\*\*/g, ''); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function hdr(t, re) { for (var i = 0; i < t[0].length; i++) if (re.test(t[0][i])) return i; return -1; }

  /* suara Jepang: rekaman bila kelak ada, sementara suara bawaan perangkat (ja-JP) */
  function sayJa(text, rate, onend) {
    var t = String(text || '').replace(/[「」]/g, '').replace(/[〇○]+/g, '').replace(/\(.*?\)|（.*?）/g, '').trim();
    if (!t || !window.speechSynthesis) return false;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(t); u.lang = 'ja-JP'; u.rate = rate || (window.MN_STORE && MN_STORE.set().kec === 'pelan' ? 0.6 : 0.85);
    if (onend) { u.onend = onend; u.onerror = onend; }
    try { var v = speechSynthesis.getVoices().filter(function (x) { return /^ja/i.test(x.lang); })[0]; if (v) u.voice = v; } catch (e) { /* pakai suara bawaan */ }
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
    if ((m = /^(Kalimat kunci|Kata Mutiara):\s*/.exec(p))) {
      var kt = p.slice(m[0].length).replace(/\*\*/g, '').replace(/^"|"$/g, '');
      /* GLB-07: Kata Mutiara = kartu bergambar Navi; ketuk untuk mendengar (app.js .km) */
      if (m[1] === 'Kata Mutiara') return '<blockquote class="kunci km" role="button" tabindex="0" data-bab="' + esc((/^B(\d)/.exec(code) || [0, ''])[1]) + '" data-say="' + esc(kt) + '"><img class="km-navi" src="assets/navi/exp_senang.webp" alt="Navi">' +
        '<span class="km-body"><span class="km-q">' + md(kt) + '</span><span class="km-say">' + SPK + 'Dengarkan Navi</span></span></blockquote>';
      return '<blockquote class="kunci">' + md(kt) + '</blockquote>';
    }
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
        return '<div class="ix-card" role="listitem"><button class="ix-head" aria-expanded="false" data-i="' + i + '"><span class="ix-n">' + (i + 1) + '</span><span class="ix-l">' + md(c.label) + '</span><span class="ix-ck" aria-hidden="true"></span></button><div class="ix-lipat"><div class="ix-body">' + c.body + '</div></div></div>';
      }).join('') + '</div><p class="ix-hint">' + esc(hint || 'Ketuk setiap kartu untuk membukanya.') + ' <span class="ix-count"></span></p>',
      bind: function (el, done) {
        var seen = {}, n = cards.length, cnt = el.querySelector('.ix-count');
        function upd() { var k = Object.keys(seen).length; cnt.textContent = k + '/' + n; if (k === n) done(); }
        el.querySelectorAll('.ix-head').forEach(function (b) {
          b.addEventListener('click', function () {
            var open = b.getAttribute('aria-expanded') !== 'true';
            b.setAttribute('aria-expanded', open);   /* .ix-lipat membuka/menutup lewat kelas .on (grid 0fr → 1fr) */
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
            if (meter) { var nv = Math.max(5, Math.min(100, (+meter.dataset.v || 50) + (good ? 12 : mid ? -4 : -12))); meter.dataset.v = nv; meter.style.transform = 'scaleX(' + nv / 100 + ')'; }
            if (good) done();
          });
        });
      }
    };
  };

  /* T13 komik kasus (B2-11): beberapa "Kasus N (tempat): situasi" + tabel Pilihan|Hasil digabung jadi satu
     panggung bertab. Satu kasus tampil sekali waktu (panel situasi berwarna + pilihan), pindah kasus bergeser halus,
     panel penutup terbuka setelah semua kasus dijawab tepat. Pilihan per kasus tetap memakai W.cases. */
  W.kasus = function (cases, penutup) {
    var ws = cases.map(function (c) { return W.cases(c.table); });
    var POSE = ['exp_berpikir', 'exp_bingung', 'exp_gugup', 'exp_berpikir'];
    function tempat(t) { return /wawancara/i.test(t) ? 'iv' : 'kerja'; }
    var tabs = cases.map(function (c, i) {
      return '<button class="kk-tab" data-k="' + i + '" role="tab" aria-selected="' + (i === 0) + '"><b>' + (i + 1) + '</b><span>' + esc(cap(c.tempat)) + '</span><i class="kk-ok" aria-hidden="true">✓</i></button>';
    }).join('');
    var panes = cases.map(function (c, i) {
      return '<section class="kk-case kk-' + tempat(c.tempat) + '" data-k="' + i + '" role="tabpanel"' + (i ? ' hidden' : '') + '>' +
        '<div class="kk-scene"><img src="assets/navi/' + POSE[i % POSE.length] + '.webp" alt="" class="kk-navi"><div class="kk-sit">' +
        '<span class="kk-tag">Kasus ' + (i + 1) + ' · ' + esc(cap(c.tempat)) + '</span><p>' + md(c.teks.replace(/^"|"$/g, '')) + '</p></div></div>' +
        '<p class="kk-q">Apa yang kamu lakukan?</p><div class="kk-opsi">' + ws[i].html + '</div></section>';
    }).join('');
    return {
      html: '<div class="kk" data-k="0"><div class="kk-tabs" role="tablist">' + tabs + '</div><div class="kk-stage">' + panes + '</div>' +
        '<div class="kk-nav"><button class="btn ghost kk-prev" disabled>' + '‹ Sebelumnya</button><span class="kk-no">Kasus 1 dari ' + cases.length + '</span><button class="btn kk-next" disabled>Kasus berikutnya ›</button></div>' +
        (penutup ? '<div class="kk-end" hidden><span class="jp">信頼</span><p>' + md(penutup) + '</p></div>' : '') + '</div>',
      bind: function (el, done) {
        var at = 0, ok = {}, n = cases.length, root = el.querySelector('.kk');
        var tabsEl = el.querySelectorAll('.kk-tab'), panesEl = el.querySelectorAll('.kk-case');
        var prev = el.querySelector('.kk-prev'), next = el.querySelector('.kk-next'), no = el.querySelector('.kk-no');
        function upd() {
          prev.disabled = at === 0;
          next.disabled = !ok[at] || at === n - 1;
          next.hidden = at === n - 1;
          no.textContent = 'Kasus ' + (at + 1) + ' dari ' + n + (Object.keys(ok).length === n ? ' · semua tepat' : '');
          tabsEl.forEach(function (t, i) { t.setAttribute('aria-selected', i === at); t.classList.toggle('on', i === at); t.classList.toggle('ok', !!ok[i]); });
        }
        function ke(i) {
          if (i === at || i < 0 || i >= n) return;
          var arah = i > at ? 'kanan' : 'kiri';
          panesEl[at].hidden = true;
          panesEl[i].hidden = false; panesEl[i].classList.remove('kk-in-kanan', 'kk-in-kiri'); void panesEl[i].offsetWidth; panesEl[i].classList.add('kk-in-' + arah);
          at = i; root.dataset.k = i; upd();
        }
        tabsEl.forEach(function (t) { t.addEventListener('click', function () { ke(+t.dataset.k); }); });
        prev.addEventListener('click', function () { ke(at - 1); });
        next.addEventListener('click', function () { ke(at + 1); });
        panesEl.forEach(function (p, i) {
          ws[i].bind(p, function () {
            ok[i] = 1; upd();
            if (Object.keys(ok).length === n) {
              var end = el.querySelector('.kk-end'); if (end) { end.hidden = false; end.classList.add('ix-in'); }
              done();
            }
          });
        });
        upd();
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

  /* T02 tabel perbandingan 3 kolom (B1-02 "Siapa yang Lolos?"): dua panel berdampingan.
     Sisi yang disentuh kursor/diketuk melebar (layar terbelah), baris muncul bergantian, peserta memilih di panelnya. */
  W.versus = function (t) {
    var rows = t.slice(1), sisi = [1, 2];
    function huruf(l) { var m = /\s([A-Z0-9])$/.exec(l); return m ? m[1] : l.charAt(0); }
    /* "Pilih Kandidat A"; di HP sempit kata depan disembunyikan menjadi "Pilih A" */
    function pilihTeks(j) { var l = t[0][j + 1], h = huruf(l); return 'Pilih <span class="vs-pl">' + esc(l.slice(0, l.length - h.length)) + '</span>' + esc(h); }
    function panel(k, j) {
      var lab = t[0][k];
      return '<div class="vs-p vs-' + (j ? 'b' : 'a') + '" data-s="' + j + '" style="--rows:' + (rows.length + 2) + '">' +
        '<div class="vs-h"><span class="vs-big" aria-hidden="true">' + esc(huruf(lab)) + '</span><span class="vs-lab">' + md(lab) + '</span></div>' +
        rows.map(function (r, i) { return '<div class="vs-r" style="--d:' + (i * 2 + j) + '"><small>' + md(r[0]) + '</small><span>' + md(r[k]) + '</span></div>'; }).join('') +
        '<button class="vs-pilih" data-i="' + j + '">' + pilihTeks(j) + '</button></div>';
    }
    return {
      html: '<div class="vs" style="--n:' + (rows.length + 2) + '">' + panel(1, 0) + '<span class="vs-knob" aria-hidden="true"><i>‹</i>VS<i>›</i></span>' + panel(2, 1) + '</div>' +
        '<p class="ix-hint vs-hint">Arahkan kursor atau ketuk sisi kandidat untuk membandingkan, lalu pilih yang menurutmu lolos.</p>',
      bind: function (el, done) {
        var vs = el.querySelector('.vs'), hint = el.querySelector('.vs-hint'), jenis = 'mouse';
        vs.addEventListener('pointerdown', function (e) { jenis = e.pointerType; });
        function fokus(s) { if (vs.dataset.pilih == null) vs.dataset.f = s; }
        el.querySelectorAll('.vs-p').forEach(function (p) {
          var s = p.dataset.s === '0' ? 'a' : 'b';
          p.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') fokus(s); });
          /* sentuh: ketuk untuk melebarkan/menutup; mouse: sudah melebar lewat hover, klik tidak menutupnya */
          p.addEventListener('click', function (e) { if (!e.target.closest('.vs-pilih')) fokus(jenis !== 'mouse' && vs.dataset.f === s ? '' : s); });
          p.addEventListener('pointermove', function (e) {
            if (e.pointerType !== 'mouse') return;
            var r = p.getBoundingClientRect();
            p.style.setProperty('--px', ((e.clientX - r.left) / r.width - .5).toFixed(3));
            p.style.setProperty('--py', ((e.clientY - r.top) / r.height - .5).toFixed(3));
          });
        });
        vs.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') fokus(''); });
        el.querySelectorAll('.vs-pilih').forEach(function (b) {
          b.addEventListener('click', function () {
            var j = +b.dataset.i;
            vs.dataset.pilih = j; vs.dataset.f = j ? 'b' : 'a';
            el.querySelectorAll('.vs-pilih').forEach(function (x) { x.classList.toggle('sel', x === b); x.innerHTML = x === b ? '✓ Pilihanmu' : pilihTeks(+x.dataset.i); });
            hint.textContent = 'Kamu memilih ' + t[0][j + 1] + '. Lanjut ke slide berikutnya untuk melihat pembahasannya. Kamu masih bisa mengganti pilihan.';
            done();
          });
        });
      }
    };
  };

  /* Video animasi pengganti blok teks tertentu (dibuat di sumber/video/<kode>/, lihat docs/ASET.md).
     ganti = paragraf naskah yang menjadi tempat video; paragraf sesudahnya (teks Jepang, romaji, arti) tetap ada sebagai transkrip. */
  var VIDEO = {
    'B2-09': { ganti: /^Contoh telepon/i, src: 'assets/video/B2-09.mp4', poster: 'assets/video/B2-09.jpg', durasi: '0:42',
      judul: 'Contoh telepon renraku: terlambat karena kereta', kredit: 'Suara: VOICEVOX:雀松朱司' },
    /* simpan: paragraf yang diganti tetap ada di transkrip (di sini paragraf langkah, kotak Hindari, dan kotak Gugup) */
    'B5-09': { ganti: /^Langkah bila tetap tidak paham/i, simpan: true, src: 'assets/video/B5-09.mp4', poster: 'assets/video/B5-09.jpg', durasi: '0:51',
      judul: 'Saat tetap tidak paham: jujur dengan sopan', kredit: 'Suara: VOICEVOX:雀松朱司', teks: 'Lihat teks lengkap (langkah, hal yang dihindari, saat gugup)' }
  };
  var PUTAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>';
  W.video = function (v) {
    return {
      html: '<figure class="vid"><div class="vid-bingkai"><video class="vid-el" controls playsinline preload="metadata" poster="' + v.poster + '" src="' + v.src + '"></video>' +
        '<button class="vid-main" type="button" aria-label="Putar video"><span class="vid-ikon">' + PUTAR + '</span><span class="vid-label">Video animasi · ' + esc(v.durasi) + '</span></button></div>' +
        '<figcaption><span>' + esc(v.judul) + '</span><span class="vid-kredit">' + esc(v.kredit) + '</span></figcaption></figure>',
      bind: function (el, done) {
        var fig = el.querySelector('.vid'), vid = el.querySelector('.vid-el'), main = el.querySelector('.vid-main');
        main.addEventListener('click', function () { var p = vid.play(); if (p && p.catch) p.catch(function () {}); });
        vid.addEventListener('play', function () { fig.classList.add('main'); try { window.speechSynthesis.cancel(); } catch (e) { /* tanpa TTS */ } });
        vid.addEventListener('ended', function () { fig.classList.remove('main'); });
        done();   // menonton video tidak diwajibkan untuk membuka Lanjut
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
            if (+b.dataset.i === next) {
              var r0 = b.getBoundingClientRect(), slot = slots[next];
              slot.innerHTML = md(steps[next]); slot.className = 'isi'; b.remove();
              terbang(slot, r0);
              next++; upd();
            }
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
    /* figur tampak samping (menghadap kanan), badan atas berputar di pinggul P(150,150); busur sudut berjari-jari 132 */
    var sd = hdr(t, /sudut/i), rows = t.slice(1).map(function (r) { return { deg: parseFloat(String(r[sd]).replace(/[^\d.]/g, '')), r: r }; });
    var P = 'rotate(0 150 150)', R = 132;
    var titik = function (d, r) { var a = d * Math.PI / 180; return [(150 + r * Math.sin(a)).toFixed(1), (150 - r * Math.cos(a)).toFixed(1)]; };
    var busur = 'M150 ' + (150 - R) + ' A' + R + ' ' + R + ' 0 0 1 ' + titik(45, R).join(' ');
    var atas = '<rect x="144" y="70" width="12" height="16" rx="4" fill="#F1CDB2"/>' +
      '<rect x="128" y="82" width="44" height="76" rx="15" fill="#25345A"/>' +
      '<path d="M140 84 L150 108 L160 84 Z" fill="#fff"/><path d="M150 92 L146 98 L150 120 L154 98 Z" fill="#B3282F"/>' +
      '<rect x="159" y="92" width="13" height="62" rx="6.5" fill="#1B2744"/><circle cx="165.5" cy="157" r="6" fill="#F1CDB2"/>' +
      '<circle cx="150" cy="54" r="22" fill="#F6D8C3"/><path d="M128 54 C126 30 150 24 164 34 C170 38 172 44 171 49 C160 44 148 46 140 52 C137 58 134 64 131 66 Z" fill="#45397A"/>' +
      '<circle cx="162" cy="56" r="2.4" fill="#14171F"/>';
    var hantu = rows.map(function (x) { return '<g class="oj-hantu" data-d="' + x.deg + '" transform="rotate(' + x.deg + ' 150 150)">' + atas + '</g>'; }).join('');
    var tik = rows.map(function (x) {
      var a = titik(x.deg, R - 9), b = titik(x.deg, R + 9), l = titik(x.deg, R + 26);
      return '<line class="oj-tik" data-d="' + x.deg + '" x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"/><text class="oj-tl" data-d="' + x.deg + '" x="' + l[0] + '" y="' + l[1] + '">' + x.deg + '°</text>';
    }).join('');
    return {
      html: '<div class="oj"><div class="oj-panggung"><svg viewBox="0 -24 340 286" class="oj-fig" aria-hidden="true">' +
          '<path class="oj-jalur" d="' + busur + '"/><path class="oj-busur" d="' + busur + '" pathLength="45" stroke-dasharray="45" stroke-dashoffset="45"/>' + tik + hantu +
          '<line x1="52" y1="238" x2="292" y2="238" class="oj-lantai"/>' +
          '<rect x="136" y="148" width="15" height="86" rx="7" fill="#1B2744"/><rect x="149" y="148" width="15" height="86" rx="7" fill="#25345A"/>' +
          '<ellipse cx="162" cy="235" rx="17" ry="6" fill="#14171F"/><ellipse cx="148" cy="235" rx="15" ry="5.5" fill="#14171F"/>' +
          '<g class="oj-atas" transform="' + P + '">' + atas + '</g></svg>' +
          '<div class="oj-baca"><b class="oj-deg">0°</b><span class="oj-jenis">Berdiri tegak</span></div></div>' +
        '<div class="oj-kontrol"><input type="range" min="0" max="45" value="0" step="1" aria-label="Sudut ojigi">' +
          '<div class="oj-pilih">' + rows.map(function (x) { return '<button class="ix-o" data-d="' + x.deg + '">' + md(x.r[0]) + ' · ' + x.deg + '°</button>'; }).join('') + '</div>' +
          '<div class="oj-kartu"><p class="oj-kosong">Geser ke 15°, 30°, atau 45°, atau ketuk salah satu jenis di atas.</p></div>' +
          '<p class="ix-hint">Lihat ketiga jenis ojigi. <span class="ix-count"></span></p></div></div>',
      bind: function (el, done) {
        var inp = el.querySelector('input'), g = el.querySelector('.oj-atas'), bus = el.querySelector('.oj-busur'), deg = el.querySelector('.oj-deg'), jenis = el.querySelector('.oj-jenis');
        var kartu = el.querySelector('.oj-kartu'), cnt = el.querySelector('.ix-count'), seen = {}, kini = 0, target = 0, jalan = false, aktif = null;
        function gambar(v) {
          g.setAttribute('transform', 'rotate(' + v.toFixed(2) + ' 150 150)');
          bus.setAttribute('stroke-dashoffset', (45 - v).toFixed(2));
          deg.textContent = Math.round(v) + '°';
        }
        /* pegas ringan: badan mengejar sudut sasaran dengan perlambatan, bukan melompat */
        function langkah() {
          var beda = target - kini;
          if (Math.abs(beda) < 0.05 || gerakDikurangi()) { kini = target; gambar(kini); jalan = false; return; }
          kini += beda * 0.2; gambar(kini); requestAnimationFrame(langkah);
        }
        function upd() {
          target = +inp.value;
          if (!jalan) { jalan = true; requestAnimationFrame(langkah); }
          var hit = rows.filter(function (x) { return Math.abs(x.deg - target) <= 2; })[0];
          el.querySelectorAll('.oj-pilih .ix-o').forEach(function (b) { b.classList.toggle('sel', !!hit && +b.dataset.d === hit.deg); });
          el.querySelectorAll('.oj-tik, .oj-tl').forEach(function (x) { x.classList.toggle('on', !!hit && +x.getAttribute('data-d') === hit.deg); });
          jenis.innerHTML = hit ? md(hit.r[0]) : target === 0 ? 'Berdiri tegak' : 'Teruskan…';
          if (hit && aktif !== hit.deg) {
            aktif = hit.deg; seen[hit.deg] = 1;
            var h = el.querySelector('.oj-hantu[data-d="' + hit.deg + '"]'); if (h) h.classList.add('on');
            kartu.innerHTML = '<div class="oj-info"><b class="jp">' + md(hit.r[0]) + '</b><span class="oj-sudut">' + md(hit.r[sd]) + '</span>' +
              t[0].map(function (hd, i) { return i > 1 ? '<p><b class="ix-k">' + md(hd) + '</b> ' + md(hit.r[i]) + '</p>' : ''; }).join('') + '</div>';
          } else if (!hit && aktif !== null) { aktif = null; }
          var k = Object.keys(seen).length; cnt.textContent = k + '/' + rows.length; if (k === rows.length) done();
        }
        inp.addEventListener('input', upd);
        /* lepas di dekat salah satu sudut → menempel ke sudut itu */
        inp.addEventListener('change', function () {
          var v = +inp.value, dekat = rows.filter(function (x) { return Math.abs(x.deg - v) <= 4; })[0];
          if (dekat && dekat.deg !== v) { inp.value = dekat.deg; upd(); }
        });
        el.querySelectorAll('.oj-pilih .ix-o').forEach(function (b) { b.addEventListener('click', function () { inp.value = b.dataset.d; upd(); }); });
        upd();
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
  /* FLIP: elemen tampak berangkat dari posisi lama (r0) lalu meluncur ke posisi barunya — hanya transform, halus 60 fps */
  function terbang(el, r0) {
    if (!el.animate || gerakDikurangi()) return;
    var r1 = el.getBoundingClientRect();
    el.animate([
      { transformOrigin: 'top left', transform: 'translate(' + (r0.left - r1.left) + 'px,' + (r0.top - r1.top) + 'px) scale(' + (r0.width / r1.width) + ',' + (r0.height / r1.height) + ')' },
      { transformOrigin: 'top left', transform: 'none' }
    ], { duration: 380, easing: 'cubic-bezier(0.2, 0, 0, 1)' });
  }
  function gerakDikurangi() {
    return document.documentElement.classList.contains('gerak-kurang') || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /* T08 adegan bergambar ("Temukan kesalahan"): beberapa babak berlatar foto, satu titik kesalahan per babak.
     Ketuk titik → kesalahan + umpan balik, tersusun di daftar temuan. cfg = { tanya?, babak: [{ bg, x, y, aksi, judul, isi?, efek? }] } */
  W.adegan = function (cfg) {
    var n = cfg.babak.length;
    var babak = cfg.babak.map(function (b, i) {
      return '<div class="adg-babak" data-k="' + i + '"' + (i ? ' hidden' : '') + '><div class="adg-bg" style="background-image:url(assets/bg/' + b.bg + '.webp)"></div>' +
        (b.efek === 'ketuk' ? '<span class="adg-tok" style="left:' + (b.x + 6) + '%;top:' + (b.y - 16) + '%">tok</span><span class="adg-tok d2" style="left:' + (b.x + 11) + '%;top:' + (b.y - 6) + '%">tok</span>' : '') +
        '<p class="adg-aksi"><span>Adegan ' + (i + 1) + ' dari ' + n + '</span>' + md(b.aksi) + '</p>' +
        '<button class="adg-titik" style="left:' + b.x + '%;top:' + b.y + '%" aria-label="Periksa bagian ini (adegan ' + (i + 1) + ')"><span class="adg-cincin"></span><span class="adg-inti">!</span></button>' +
        '<div class="adg-pop" role="status"><span class="adg-pop-l">Kesalahan ' + (i + 1) + '</span><b>' + md(b.judul) + '</b>' + (b.isi ? '<p>' + md(b.isi) + '</p>' : '') + '</div></div>';
    }).join('');
    return {
      html: (cfg.tanya ? '<div class="adg-tanya"><p class="adg-q">' + md(cfg.tanya.teks) + '</p><div class="adg-opsi">' + cfg.tanya.opsi.map(function (o, i) { return '<button class="ix-o" data-i="' + i + '">' + md(o) + '</button>'; }).join('') +
          '</div><p class="ix-hint adg-catat" hidden>' + md(cfg.tanya.catat) + '</p></div>' : '') +
        '<div class="adg' + (cfg.tanya ? ' kunci' : '') + '"><div class="adg-layar">' + babak +
        '<span class="adg-hitung" aria-live="polite">Ditemukan <b>0</b>/' + n + '</span>' +
        '<button class="adg-nav kiri" aria-label="Adegan sebelumnya">‹</button><button class="adg-nav kanan" aria-label="Adegan berikutnya">›</button>' +
        '<div class="adg-tutup"><span>Pilih jawabanmu dulu</span></div></div>' +
        '<div class="adg-bawah"><span class="adg-dots">' + cfg.babak.map(function (_, i) { return '<button data-k="' + i + '" aria-label="Adegan ' + (i + 1) + '"></button>'; }).join('') + '</span>' +
        '<span class="ix-hint">Ketuk tanda <b>!</b> di setiap adegan.</span></div><ol class="adg-temuan"></ol></div>',
      bind: function (el, done) {
        var at = 0, found = {}, root = el.querySelector('.adg'), list = el.querySelector('.adg-temuan'), hitung = el.querySelector('.adg-hitung b');
        var bb = el.querySelectorAll('.adg-babak'), dots = el.querySelectorAll('.adg-dots button');
        var kiri = el.querySelector('.adg-nav.kiri'), kanan = el.querySelector('.adg-nav.kanan');
        function upd() {
          kiri.disabled = at === 0; kanan.disabled = at === n - 1;
          kanan.classList.toggle('ajak', !!found[at] && at < n - 1 && !found[at + 1]);
          dots.forEach(function (d, k) { d.classList.toggle('on', k === at); d.classList.toggle('ok', !!found[k]); });
          hitung.textContent = Object.keys(found).length;
        }
        function ke(i) {
          if (i < 0 || i >= n || i === at) return;
          var maju = i > at;
          bb[at].hidden = true; bb[i].hidden = false;
          bb[i].classList.remove('dari-kanan', 'dari-kiri'); void bb[i].offsetWidth; bb[i].classList.add(maju ? 'dari-kanan' : 'dari-kiri');
          at = i; upd();
        }
        bb.forEach(function (b, k) {
          b.querySelector('.adg-titik').addEventListener('click', function () {
            if (found[k]) return;
            found[k] = 1; b.classList.add('ketemu');
            var c = cfg.babak[k], li = document.createElement('li'), sesudah = null;
            li.className = 'adg-item'; li.dataset.k = k;
            li.innerHTML = '<span class="adg-no">' + (k + 1) + '</span><span><b>' + md(c.judul) + '</b>' + (c.isi ? '<span>' + md(c.isi) + '</span>' : '') + '</span>';
            list.querySelectorAll('.adg-item').forEach(function (x) { if (!sesudah && +x.dataset.k > k) sesudah = x; });
            list.insertBefore(li, sesudah);
            upd();
            if (Object.keys(found).length === n) { root.classList.add('selesai'); done(); }
          });
        });
        kiri.addEventListener('click', function () { ke(at - 1); });
        kanan.addEventListener('click', function () { ke(at + 1); });
        dots.forEach(function (d) { d.addEventListener('click', function () { ke(+d.dataset.k); }); });
        if (cfg.tanya) el.querySelectorAll('.adg-opsi .ix-o').forEach(function (o) {
          o.addEventListener('click', function () {
            el.querySelectorAll('.adg-opsi .ix-o').forEach(function (x) { x.classList.toggle('sel', x === o); });
            el.querySelector('.adg-catat').hidden = false; root.classList.remove('kunci');
          });
        });
        upd();
      }
    };
  };
  /* konfigurasi adegan per slide; teks kesalahan diambil dari naskah slide (tabel B3-02, paragraf B6-02) */
  var ADEGAN = {
    'B3-02': function (s) {
      var t = (s.screen.filter(function (b) { return b.table; })[0] || {}).table || [], r = t.slice(1);
      if (r.length < 3) return null;
      var isi = function (x) { return String(x).replace(/^"|"$/g, ''); };
      return { babak: [
        { bg: 'koridor', x: 47, y: 40, efek: 'ketuk', aksi: 'Dimas tiba di depan pintu ruang wawancara.', judul: r[0][1], isi: isi(r[0][2]) },
        { bg: 'koridor', x: 55.5, y: 51, aksi: 'Dimas memegang gagang pintu.', judul: r[1][1], isi: isi(r[1][2]) },
        { bg: 'ruang_wawancara', x: 50, y: 75, aksi: 'Dimas sudah berada di dalam ruangan.', judul: r[2][1], isi: isi(r[2][2]) }
      ] };
    },
    'B6-02': function (s) {
      var q = (s.screen[1] || {}).p || '', m = /\*\*"?(.+?)"?\*\*/.exec(q);
      return {
        tanya: { teks: m ? m[1] : 'Apakah penilaian sudah selesai saat Dimas keluar ruangan?', opsi: ['Ya', 'Tidak'], catat: 'Jawabannya dibahas di slide berikutnya. Sekarang temukan tiga hal yang dilakukan Dimas.' },
        babak: [
          { bg: 'ruang_wawancara', x: 50, y: 70, aksi: 'Wawancara baru saja selesai.', judul: 'Berdiri tanpa salam' },
          { bg: 'koridor', x: 47, y: 42, aksi: 'Dimas keluar dari ruangan.', judul: 'Menutup pintu keras' },
          { bg: 'koridor', x: 17, y: 60, aksi: 'Dimas berada di lorong.', judul: 'Di lorong menghela napas keras, melonggarkan dasi, lalu langsung menelepon temannya sambil tertawa' }
        ]
      };
    }
  };

  /* T08 rekaman (B4-13): setiap rekaman → pilih kesalahan utamanya; umpan balik membuka halus. Rekaman berteks Jepang bisa diputar (suara perangkat). */
  W.rekaman = function (t) {
    var iI = hdr(t, /^isi$/i), iK = hdr(t, /kesalahan utama/i), iU = hdr(t, /umpan balik/i), rows = t.slice(1);
    var opsi = rows.map(function (r) { return r[iK]; });
    var gel = Array.apply(null, Array(14)).map(function (_, k) { return '<i style="--h:' + (0.3 + 0.7 * Math.abs(Math.sin(k * 1.7 + 0.4))).toFixed(2) + '"></i>'; }).join('');
    return {
      html: '<div class="rk">' + rows.map(function (r, i) {
        var jp = (/「[^」]+」/.exec(r[iI]) || [''])[0];
        return '<div class="rk-kartu" data-i="' + i + '"><div class="rk-kepala">' +
          (jp ? '<button class="rk-putar" data-t="' + esc(jp) + '" aria-label="Putar rekaman ' + (i + 1) + '">' + PUTAR + '</button>' : '<span class="rk-putar rk-teks" aria-hidden="true">' + (i + 1) + '</span>') +
          '<b>Rekaman ' + esc(r[0]) + '</b><span class="rk-gel" aria-hidden="true">' + gel + '</span></div>' +
          '<p class="rk-isi">' + md(r[iI]) + '</p><p class="rk-tanya">Kesalahan utamanya?</p><div class="rk-opsi">' +
          shuffle(opsi.map(function (_, k) { return k; })).map(function (k) { return '<button class="ix-o" data-k="' + k + '">' + md(opsi[k]) + '</button>'; }).join('') + '</div>' +
          '<div class="rk-umpan"><div><p><b>Tepat.</b> ' + md(r[iU]) + '</p></div></div></div>';
      }).join('') + '</div><p class="ix-hint">Pilih kesalahan utama setiap rekaman. <span class="ix-count"></span></p>',
      bind: function (el, done) {
        var ok = {}, cnt = el.querySelector('.ix-count');
        function upd() { var k = Object.keys(ok).length; cnt.textContent = k + '/' + rows.length; if (k === rows.length) done(); }
        el.querySelectorAll('.rk-kartu').forEach(function (kartu) {
          var i = +kartu.dataset.i, putar = kartu.querySelector('button.rk-putar');
          if (putar) putar.addEventListener('click', function () {
            kartu.classList.add('main');
            if (!sayJa(putar.dataset.t, null, function () { kartu.classList.remove('main'); })) { kartu.classList.remove('main'); if (window.MN_APP && MN_APP.toast) MN_APP.toast('Suara Jepang belum tersedia di perangkat ini.'); }
          });
          kartu.querySelectorAll('.rk-opsi .ix-o').forEach(function (b) {
            b.addEventListener('click', function () {
              if (ok[i]) return;
              if (+b.dataset.k === i) {
                ok[i] = 1; b.classList.add('good'); kartu.classList.add('beres');
                kartu.querySelectorAll('.rk-opsi .ix-o').forEach(function (x) { if (x !== b) x.disabled = true; });
                upd();
              } else { b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake', 'bad'); setTimeout(function () { b.classList.remove('bad'); }, 700); }
            });
          });
        });
        upd();
      }
    };
  };

  function render(code) {
    var s = D.slides[code], tpl = s.tpl || '', gs = groups(s.screen), parts = [], ws = [];
    if (NOINT.indexOf(tpl) >= 0) return null;
    /* adegan bergambar (T08 B3-02, B6-02): pengantar + satu widget; paragraf/tabel naskah lainnya sudah ada di dalam widget */
    var cfgAdegan = ADEGAN[code] && ADEGAN[code](s);
    if (cfgAdegan) {
      var wa = W.adegan(cfgAdegan), pengantar = gs.filter(function (g) { return g.p; }).slice(0, 1).map(function (g) { return para(code, g.i, g.p); }).join('');
      return { html: pengantar + '<div class="ix" data-w="0">' + wa.html + '</div>', gated: true, bind: function (root, onDone) { wa.bind(root.querySelector('.ix[data-w="0"]'), onDone); } };
    }
    function add(w) { var id = ws.length; ws.push(w); parts.push('<div class="ix" data-w="' + id + '">' + w.html + '</div>'); }

    var choiceAt = -1, choiceLabels = null, vsAt = -1, vidBuka = false;
    /* komik kasus: ≥2 pasangan "Kasus N (tempat): …" + tabel Pilihan|Hasil → satu panggung bertab (W.kasus) */
    var kasus = [], pakai = {}, penutup = null, RX_K = /^\**Kasus\s+\d+\s*\(([^)]+)\):?\**:?\s*/;
    gs.forEach(function (g, gi) {
      var nx = gs[gi + 1];
      if (g.p && RX_K.test(g.p) && nx && nx.table && /^pilihan\|hasil/i.test(nx.table[0].join('|'))) {
        kasus.push({ tempat: RX_K.exec(g.p)[1], teks: g.p.replace(RX_K, ''), table: nx.table, at: gi }); pakai[gi] = pakai[gi + 1] = 1;
      }
      if (g.p && /^Panel penutup:/i.test(g.p)) { var pm = /"([^"]+)"/.exec(g.p); penutup = pm ? pm[1] : null; if (kasus.length >= 2) pakai[gi] = 1; }
    });
    if (kasus.length < 2) { pakai = {}; kasus = []; }
    gs.forEach(function (g, gi) {
      if (pakai[gi]) { if (kasus.length && gi === kasus[0].at) add(W.kasus(kasus, penutup)); return; }
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
        if (tpl === 'T02' && t[0].length === 3 && !t[0][0]) { vsAt = parts.length; return add(W.versus(t)); }
        if (tpl === 'T02' && t[0].length >= 3) { parts.push(staticTable(t)); choiceAt = parts.length; return; }
        if (tpl === 'T16' && /^blok$/i.test(t[0][0]) && window.MN_JIKO) {
          var jw = window.MN_JIKO.widget({ sayJa: sayJa, spk: SPK, md: md, esc: esc });
          if (jw) return add(jw);
        }
        if (tpl === 'T08' && hdr(t, /kesalahan utama/i) >= 0 && hdr(t, /^isi$/i) >= 0) return add(W.rekaman(t));
        if (/^T0[3678]$|^T16$/.test(tpl)) {
          var lc = [0]; if (t[0].length >= 4 && t.slice(1).every(function (r) { return String(r[1]).length < 40; })) lc = [0, 1];
          if (/pertanyaan/i.test(t[0][1]) && /^no$/i.test(t[0][0])) lc = [1];
          return add(W.open(tableCards(t, lc), tpl === 'T08' ? 'Ketuk setiap titik untuk melihat kesalahannya.' : null));
        }
        return parts.push(staticTable(t));
      }
      if (g.li) {
        /* B4-15, B5-13: daftar langkah storyboard (Persiapan, Lapis 1–3) tidak ditampilkan; widget lisan menggantikannya */
        if (tpl === 'T15' && window.MN_LISAN && window.MN_LISAN.KONF[code]) return;
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
      if (VIDEO[code] && VIDEO[code].ganti.test(g.p) && !vidBuka) {
        var vd = VIDEO[code];
        add(W.video(vd)); parts.push('<details class="vid-teks"><summary>' + esc(vd.teks || 'Lihat teks percakapan (Jepang · romaji · arti)') + '</summary>'); vidBuka = true;
        if (vd.simpan) parts.push(para(code, g.i, g.p));
        return;
      }
      var ref = tpl === 'T11' && /urutkan/i.test(g.p) && /\((B\d-\d\d)\)/.exec(g.p);
      parts.push(para(code, g.i, g.p));
      if (ref && D.slides[ref[1]]) {
        var steps = D.slides[ref[1]].screen.filter(function (b) { return b.li != null && (b.lvl || 0) === 0; }).map(function (b) { return b.li; });
        if (steps.length >= 3) add(W.order(steps));
      }
    });
    if (vidBuka) parts.push('</details>');
    /* perbandingan: kalimat "Pertanyaan: …" dipindah ke atas panel agar dibaca sebelum membandingkan */
    if (vsAt >= 0) for (var pi = vsAt + 1; pi < parts.length; pi++) if (/Pertanyaan/.test(parts[pi]) && parts[pi].indexOf('class="ix"') < 0) { parts.splice(vsAt, 0, parts.splice(pi, 1)[0]); break; }
    if (choiceAt === -2) parts.push('</div>');
    if (choiceAt > 0) {
      var cand = choiceLabels || gs.filter(function (g) { return g.table; })[0].table[0].filter(Boolean);
      var w = W.choice(cand); var id = ws.length; ws.push(w);
      parts.push('<div class="ix" data-w="' + id + '">' + w.html + '</div>');
    }
    if (tpl === 'T15') {
      var lw = window.MN_LISAN && window.MN_LISAN.KONF[code] ? window.MN_LISAN.widget(code, { sayJa: sayJa, spk: SPK, esc: esc, toast: function (m) { if (window.MN_APP && window.MN_APP.toast) window.MN_APP.toast(m); } }) : null;
      add(lw || W.record());
    }
    if (tpl === 'T09' && !ws.length) return null;
    if (/Kepercayaan/.test((s.screen[0] || {}).p || '')) parts.unshift('<div class="ix-trust" aria-label="Indikator kepercayaan"><span>信頼 Kepercayaan</span><b><i data-v="50" style="transform:scaleX(.5)"></i></b></div>');
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

  window.MN_IX = { render: render, sayJa: sayJa, blocks: blocksFor, para: para, roWrap: roWrap };
})();
