/* Mensetsu Navi — T16 Penyusun Jikoshoukai (B4-14).
   Peserta mengisi lima blok; sistem merangkai kalimat dari naskah Bab 4:
   blok 3 dari B4-07, blok 4 dari B4-08, blok 5 dari B4-09, daftar kota dari tabel B4-14 sendiri.
   Jadi bila naskah diubah (tools/xml.json → gen_data.py), isi pilihan ikut berubah.
   Yang ditulis di sini hanya kerangka kalimat, cara baca angka (usia 18–25, 1–5 tahun),
   dan nama kota dalam bahasa Indonesia untuk kolom arti.

   API: MN_JIKO.widget({ sayJa, spk, md, esc }) -> { html, bind(el, done) } atau null.   */
(function () {
  var D = window.MN_DATA;

  /* ------------------------------------------------ katakana → romaji (gaya naskah: koukou, juu) */
  var BASE = {
    'ア': 'a', 'イ': 'i', 'ウ': 'u', 'エ': 'e', 'オ': 'o', 'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke', 'コ': 'ko',
    'サ': 'sa', 'シ': 'shi', 'ス': 'su', 'セ': 'se', 'ソ': 'so', 'タ': 'ta', 'チ': 'chi', 'ツ': 'tsu', 'テ': 'te', 'ト': 'to',
    'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no', 'ハ': 'ha', 'ヒ': 'hi', 'フ': 'fu', 'ヘ': 'he', 'ホ': 'ho',
    'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo', 'ヤ': 'ya', 'ユ': 'yu', 'ヨ': 'yo',
    'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro', 'ワ': 'wa', 'ヲ': 'o', 'ン': 'n',
    'ガ': 'ga', 'ギ': 'gi', 'グ': 'gu', 'ゲ': 'ge', 'ゴ': 'go', 'ザ': 'za', 'ジ': 'ji', 'ズ': 'zu', 'ゼ': 'ze', 'ゾ': 'zo',
    'ダ': 'da', 'ヂ': 'ji', 'ヅ': 'zu', 'デ': 'de', 'ド': 'do', 'バ': 'ba', 'ビ': 'bi', 'ブ': 'bu', 'ベ': 'be', 'ボ': 'bo',
    'パ': 'pa', 'ピ': 'pi', 'プ': 'pu', 'ペ': 'pe', 'ポ': 'po', 'ヴ': 'vu'
  };
  var COMBO = {
    'ティ': 'ti', 'ディ': 'di', 'トゥ': 'tu', 'ドゥ': 'du', 'デュ': 'dyu', 'ファ': 'fa', 'フィ': 'fi', 'フェ': 'fe', 'フォ': 'fo',
    'ウィ': 'wi', 'ウェ': 'we', 'ウォ': 'wo', 'シェ': 'she', 'ジェ': 'je', 'チェ': 'che', 'ツァ': 'tsa', 'ツォ': 'tso',
    'ヴァ': 'va', 'ヴィ': 'vi', 'ヴェ': 've', 'ヴォ': 'vo'
  };
  var YOON = { 'ャ': 'a', 'ュ': 'u', 'ョ': 'o' }, SMALLV = { 'ァ': 'a', 'ィ': 'i', 'ゥ': 'u', 'ェ': 'e', 'ォ': 'o' };
  var KATA = /^[ァ-ヶー]+$/;

  /* null bila ada karakter yang bukan katakana */
  function roma(k) {
    if (!k || !KATA.test(k)) return null;
    var out = '', i = 0, gem = false;
    while (i < k.length) {
      var c = k.charAt(i), n = k.charAt(i + 1), r = null;
      if (c === 'ッ') { gem = true; i++; continue; }
      if (c === 'ー') { var l = out.slice(-1); if (/[aiueo]/.test(l)) out += l; i++; continue; }
      if (COMBO[c + n]) { r = COMBO[c + n]; i += 2; }
      else if (BASE[c] && YOON[n] && /i$/.test(BASE[c])) {
        var b = BASE[c]; r = (/^(shi|chi|ji)$/.test(b) ? b.slice(0, -1) : b.slice(0, -1) + 'y') + YOON[n]; i += 2;
      } else if (BASE[c] && SMALLV[n]) { r = BASE[c].replace(/[aiueo]$/, '') + SMALLV[n]; i += 2; }
      else if (BASE[c]) { r = BASE[c]; i++; }
      else return null;
      if (gem) { r = (/^ch/.test(r) ? 't' : r.charAt(0)) + r; gem = false; }
      out += r;
    }
    return out;
  }
  function up(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  /* ------------------------------------------------ angka (cara baca, bukan materi) */
  var AGE = { 18: ['十八歳', 'Juuhassai'], 19: ['十九歳', 'Juukyuusai'], 20: ['二十歳', 'Hatachi'], 21: ['二十一歳', 'Nijuuissai'],
    22: ['二十二歳', 'Nijuunisai'], 23: ['二十三歳', 'Nijuusansai'], 24: ['二十四歳', 'Nijuuyonsai'], 25: ['二十五歳', 'Nijuugosai'] };
  var YR = [null, ['一', 'ichi'], ['二', 'ni'], ['三', 'san'], ['四', 'yo'], ['五', 'go']];
  var KOTA_ID = { Jakaruta: 'Jakarta', Bandon: 'Bandung', Surabaya: 'Surabaya', Jogujakaruta: 'Yogyakarta', Sumaran: 'Semarang', Medan: 'Medan', Makassaru: 'Makassar' };
  var SEC_PER_CHAR = 0.27; /* contoh Rani (147 karakter) ±40 detik, lihat B4-10 */
  var TITLES = ['Salam dan nama', 'Asal dan usia', 'Latar belakang', 'Kelebihan', 'Motivasi dan penutup'];
  var KANA_ROWS = ['アイウエオ', 'カキクケコ', 'サシスセソ', 'タチツテト', 'ナニヌネノ', 'ハヒフヘホ', 'マミムメモ', 'ヤユヨ', 'ラリルレロ', 'ワヲン',
    'ガギグゲゴ', 'ザジズゼゾ', 'ダデド', 'バビブベボ', 'パピプペポ', 'ャュョッーィ'];

  /* ------------------------------------------------ ambil sumber dari naskah */
  function tbl(code) { var s = D.slides[code]; if (!s) return null; for (var i = 0; i < s.screen.length; i++) if (s.screen[i].table) return s.screen[i].table.slice(1); return null; }
  function rows(code) { return (tbl(code) || []).map(function (r) { return { jp: r[0], ro: r[1], ar: r[2] }; }); }
  function source() {
    var b3 = rows('B4-07'), b4 = rows('B4-08'), b5 = rows('B4-09'), self = tbl('B4-14');
    if (!b3.length || !b4.length || b5.length < 2 || !self) return null;
    var cities = [], re = /([ァ-ヶー]+)\s+([A-Za-z]+)/g, m, cell = (self[1] || [])[1] || '';
    while ((m = re.exec(cell))) cities.push({ jp: m[1], ro: up(m[2]), ar: KOTA_ID[up(m[2])] || up(m[2]) });
    var places = [], pm, pre = /([^\s·()（）:：]+)\s*\(([A-Za-z]+),\s*([^)]+)\)/g, vp = null;
    (D.slides['B4-07'].screen || []).forEach(function (b) { if (b.p && /Kosakata tempat kerja/i.test(b.p)) vp = b.p; });
    while (vp && (pm = pre.exec(vp.replace(/^.*?:\s*/, '')))) places.push({ jp: pm[1], ro: pm[2], ar: pm[3] });
    var proofs = [];
    (D.slides['B4-08'].screen || []).forEach(function (b) {
      var q = b.li != null && /「([^」]+)」\s*\(([^"]*)"([^"]+)"\)/.exec(b.li);
      if (q) proofs.push({ jp: q[1], ro: q[2].trim(), ar: q[3] });
    });
    var close = null, mot = [];
    b5.forEach(function (r) { if (/よろしく/.test(r.jp) && !close) close = r; else mot.push(r); });
    if (!cities.length || !places.length || !close || !mot.length) return null;
    return { b3: b3, b4: b4, mot: mot, close: close, cities: cities, places: places, proofs: proofs };
  }

  /* ------------------------------------------------ widget */
  function widget(env) {
    var src = source(); if (!src) return null;
    var esc = env.esc, SPK = env.spk, sayJa = env.sayJa;
    function opts(list, label, first) {
      return (first ? '<option value="">' + esc(first) + '</option>' : '') + list.map(function (x, i) { return '<option value="' + i + '">' + esc(label(x)) + '</option>'; }).join('');
    }
    var ageOpts = '<option value="">Pilih usia</option>'; for (var a = 18; a <= 25; a++) ageOpts += '<option value="' + a + '">' + a + ' tahun</option>';
    var yrOpts = ''; for (var y = 1; y <= 5; y++) yrOpts += '<option value="' + y + '">' + y + ' tahun</option>';
    var placeOpts = opts(src.places, function (p) { return p.jp + ' (' + p.ar + ')'; });

    var kana = '<details class="ix-kana"><summary>Panduan huruf katakana</summary><p class="ix-hint">Ketuk huruf untuk memasukkannya ke kolom yang sedang kamu isi. Contoh: Rani = ラニ, Dimas = ディマス.</p><div class="ix-kg">' +
      KANA_ROWS.map(function (row) { return row.split('').map(function (k) { return '<button type="button" class="ix-kb" data-k="' + k + '"><b class="jp">' + k + '</b><small>' + (roma(k) || '') + '</small></button>'; }).join(''); }).join('') + '</div></details>';

    function card(n, body) {
      return '<section class="ix-jb" data-b="' + n + '"><div class="ix-jh"><span class="ix-n">' + n + '</span><b>' + TITLES[n - 1] + '</b><span class="ix-ck" aria-hidden="true"></span></div>' + body + '</section>';
    }
    var b3html = src.b3.map(function (o, i) {
      var hasPl = /〇〇/.test(o.jp), hasYr = /〇/.test(o.jp.replace(/〇〇/g, ''));
      return '<div class="ix-jc3"><label class="ix-jc"><input type="checkbox" name="b3_' + i + '"><span>' + esc(o.ar) + '</span></label>' +
        (hasPl || hasYr ? '<div class="ix-sub" hidden>' + (hasPl ? '<select name="b3_' + i + '_pl" aria-label="Tempat kerja">' + placeOpts + '</select>' : '') +
          (hasYr ? '<select name="b3_' + i + '_yr" aria-label="Lama (tahun)">' + yrOpts + '</select>' : '') + '</div>' : '') + '</div>';
    }).join('');
    var html = '<div class="ix-jk">' + kana +
      card(1, '<label class="field">Namamu dalam katakana<input name="nm" lang="ja" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="例: ラニ"></label><p class="ix-live" data-for="nm"></p>') +
      card(2, '<label class="field">Kota asal<select name="kota"><option value="">Pilih kota</option>' + src.cities.map(function (c, i) { return '<option value="' + i + '">' + esc(c.jp + ' (' + c.ar + ')') + '</option>'; }).join('') + '<option value="x">Ketik sendiri…</option></select></label>' +
        '<label class="field" data-x hidden>Nama kotamu dalam katakana<input name="kotax" lang="ja" autocomplete="off" spellcheck="false" placeholder="例: パダン"></label><p class="ix-live" data-for="kotax"></p>' +
        '<label class="field">Usia<select name="usia">' + ageOpts + '</select></label>') +
      card(3, '<p class="ix-hint">Centang satu atau dua hal yang paling berhubungan dengan pekerjaan yang kamu lamar.</p>' + b3html) +
      card(4, '<label class="field">Kelebihanmu<select name="kl">' + opts(src.b4, function (k) { return k.jp + ' (' + k.ar + ')'; }, 'Pilih kelebihan') + '</select></label>' +
        (src.proofs.length ? '<fieldset class="ix-jf"><legend>Bukti singkat (boleh dilewati)</legend><label class="ix-jc"><input type="radio" name="bk" value="" checked><span>Tanpa bukti</span></label>' +
          src.proofs.map(function (p, i) { return '<label class="ix-jc"><input type="radio" name="bk" value="' + i + '"><span>' + esc(p.ar) + '</span></label>'; }).join('') +
          '<p class="ix-hint">Bukti di atas hanya contoh dari materi. Saat latihan lisan, ganti dengan pengalamanmu sendiri.</p></fieldset>' : '')) +
      card(5, '<fieldset class="ix-jf"><legend>Pilih satu motivasi</legend>' + src.mot.map(function (m, i) { return '<label class="ix-jc"><input type="radio" name="mt" value="' + i + '"><span>' + esc(m.ar) + '</span></label>'; }).join('') +
        '</fieldset><p class="ix-hint">Penutup 「' + esc(src.close.jp.replace(/[「」。]/g, '')) + '」 ditambahkan otomatis.</p>') +
      '<div class="ix-jbar"><button class="btn ix-go" disabled>Lihat hasil</button><span class="ix-hint ix-need">Lengkapi blok yang belum bercentang.</span></div>' +
      '<div class="ix-jres ix-phr" hidden></div></div>';

    return {
      html: html,
      bind: function (el, done) {
        var root = el.querySelector('.ix-jk'), res = el.querySelector('.ix-jres'), go = el.querySelector('.ix-go'), need = el.querySelector('.ix-need'), lastK = null, last = null;
        function q(n) { return root.querySelector('[name="' + n + '"]'); }
        function val(n) { var e = q(n); return e ? e.value : ''; }
        function rad(n) { var e = root.querySelector('[name="' + n + '"]:checked'); return e ? e.value : null; }
        function nameOf(inp) { var v = (q(inp).value || '').trim(); return v ? roma(v) : ''; }

        /* kalimat per blok; null bila belum lengkap */
        function build() {
          var out = [null, null, null, null, null], nm = nameOf('nm');
          if (nm) out[0] = { jp: 'はじめまして。' + q('nm').value.trim() + 'と申します。', ro: 'Hajimemashite. ' + up(nm) + ' to moushimasu.', ar: 'Salam kenal. Nama saya ' + up(nm) + '.' };
          var city = null, kv = val('kota');
          if (kv === 'x') { var kx = nameOf('kotax'); if (kx) city = { jp: q('kotax').value.trim(), ro: up(kx), ar: up(kx) }; }
          else if (kv !== '') city = src.cities[+kv];
          var ag = AGE[val('usia')];
          if (city && ag) out[1] = { jp: 'インドネシアの' + city.jp + 'から参りました。' + ag[0] + 'です。', ro: 'Indoneshia no ' + city.ro + ' kara mairimashita. ' + ag[1] + ' desu.',
            ar: 'Saya berasal dari ' + city.ar + ', Indonesia. Usia saya ' + val('usia') + ' tahun.' };
          var ch = [];
          src.b3.forEach(function (o, i) {
            if (!q('b3_' + i).checked) return;
            var pl = q('b3_' + i + '_pl') ? src.places[+val('b3_' + i + '_pl')] : null, yr = q('b3_' + i + '_yr') ? YR[+val('b3_' + i + '_yr')] : null;
            var jpS = [pl && pl.jp, yr && yr[0]], roS = [pl && pl.ro, yr && yr[1]], arS = [pl && pl.ar, yr && val('b3_' + i + '_yr')];
            if ((q('b3_' + i + '_pl') && !pl) || (q('b3_' + i + '_yr') && !yr)) { ch = null; return; }
            if (ch === null) return;
            function sub(s, re, seq) { var k = 0, list = seq.filter(function (x) { return x != null; }); return s.replace(re, function () { return list[k++] || ''; }); }
            ch.push({ jp: sub(sub(o.jp, /〇〇/g, [jpS[0]]), /〇/g, [jpS[1]]), ro: sub(o.ro, /…/g, [roS[0], roS[1]]), ar: sub(o.ar, /…/g, [arS[0], arS[1]]) });
          });
          if (ch && ch.length >= 1 && ch.length <= 2) out[2] = { jp: ch.map(function (c) { return c.jp; }).join(''), ro: ch.map(function (c) { return c.ro; }).join(' '), ar: ch.map(function (c) { return c.ar; }).join(' ') };
          if (val('kl') !== '') {
            var k = src.b4[+val('kl')], bv = rad('bk'), pf = bv !== null && bv !== '' ? src.proofs[+bv] : null;
            out[3] = { jp: '私の長所は、' + k.jp + 'です。' + (pf ? pf.jp : ''), ro: 'Watashi no chousho wa, ' + k.ro + ' desu.' + (pf ? ' ' + pf.ro : ''), ar: 'Kelebihan saya adalah ' + k.ar + '.' + (pf ? ' ' + pf.ar : '') };
          }
          var mv = rad('mt');
          if (mv !== null) { var m = src.mot[+mv]; out[4] = { jp: m.jp + src.close.jp, ro: m.ro + ' ' + src.close.ro, ar: m.ar + ' ' + src.close.ar }; }
          return out;
        }

        function refresh() {
          /* tampilan kondisional */
          root.querySelector('[data-x]').hidden = val('kota') !== 'x';
          var on = src.b3.filter(function (o, i) { return q('b3_' + i).checked; }).length;
          src.b3.forEach(function (o, i) {
            var c = q('b3_' + i), sub = c.closest('.ix-jc3').querySelector('.ix-sub');
            if (sub) sub.hidden = !c.checked;
            c.disabled = !c.checked && on >= 2;
            c.closest('.ix-jc').classList.toggle('dis', c.disabled);
          });
          ['nm', 'kotax'].forEach(function (n) {
            var p = root.querySelector('.ix-live[data-for="' + n + '"]'), v = (q(n).value || '').trim();
            if (n === 'kotax' && val('kota') !== 'x') { p.textContent = ''; return; }
            if (!v) { p.textContent = ''; p.className = 'ix-live'; return; }
            var r = roma(v); p.className = 'ix-live ' + (r ? 'ok' : 'err');
            p.textContent = r ? 'Dibaca: ' + up(r) : 'Tulis dengan huruf katakana (カタカナ), ya. Pakai panduan di atas.';
          });
          var out = build(), allOk = true;
          out.forEach(function (b, i) { var c = root.querySelector('.ix-jb[data-b="' + (i + 1) + '"]'); c.classList.toggle('ok', !!b); if (!b) allOk = false; });
          go.disabled = !allOk; need.hidden = allOk;
          last = out;
          /* simpan isian (hanya di perangkat) */
          try {
            var S = window.MN_STORE && MN_STORE.get(), f = {};
            root.querySelectorAll('input[name],select[name]').forEach(function (c) { f[c.name + (c.type === 'radio' ? '#' + c.value : '')] = c.type === 'checkbox' || c.type === 'radio' ? c.checked : c.value; });
            if (S) { S.jiko = S.jiko || {}; S.jiko.f = f; MN_STORE.save(); }
          } catch (e) { /* mode privat */ }
        }

        function fullText(blocks, dur) {
          function j(k) { return blocks.map(function (b) { return b[k]; }).join(k === 'jp' ? '' : ' '); }
          return 'Jikoshoukai-ku (Mensetsu Navi)\n\n[日本語]\n' + j('jp') + '\n\n[Romaji]\n' + j('ro') + '\n\n[Arti]\n' + j('ar') + '\n\nPerkiraan durasi bicara: ±' + dur + ' detik\n';
        }
        function showResult() {
          var blocks = last, jpAll = blocks.map(function (b) { return b.jp; }).join('');
          var n = jpAll.replace(/[。、「」\s]/g, '').length, dur = Math.max(1, Math.round(n * SEC_PER_CHAR));
          var st = dur < 30 ? ['mid', 'Agak singkat. Tambahkan satu hal di blok 3 atau satu bukti di blok 4.'] : dur > 60 ? ['mid', 'Agak panjang. Kurangi satu hal di blok 3 atau lewati bukti di blok 4.'] : ['good', 'Pas. Durasi idealnya 30–60 detik.'];
          res.innerHTML = '<h3 class="ix-jt">Jikoshoukai-mu</h3><div class="ix-tog"><button class="btn soft on" data-t="ro" aria-pressed="true">Romaji</button><button class="btn soft on" data-t="ar" aria-pressed="true">Arti</button></div>' +
            blocks.map(function (b, i) {
              return '<div class="ix-pc seen"><div class="ix-meta"><span>Blok ' + (i + 1) + ' · ' + TITLES[i] + '</span></div><div class="ix-jrow"><span class="jp ix-j">' + esc(b.jp) + '</span><button class="ix-sp" data-i="' + i + '" aria-label="Dengarkan blok ' + (i + 1) + '">' + SPK + '</button></div>' +
                '<div class="ix-ro">' + esc(b.ro) + '</div><div class="ix-ar">' + esc(b.ar) + '</div></div>';
            }).join('') +
            '<div class="ix-fb ' + st[0] + '"><b>Perkiraan ±' + dur + ' detik.</b> ' + st[1] + '</div>' +
            '<div class="ix-jact"><button class="btn soft ix-all">Dengarkan semua</button><button class="btn soft ix-copy">Salin teks</button><button class="btn soft ix-dl">Unduh .txt</button><button class="btn ghost ix-edit">Ubah isian</button></div>' +
            '<p class="ix-hint ix-msg" aria-live="polite">Hasilnya tersimpan di perangkatmu. Latih mengucapkannya di slide berikutnya.</p>';
          res.hidden = false;
          try { var S = window.MN_STORE && MN_STORE.get(); if (S) { S.jiko = S.jiko || {}; S.jiko.hasil = { jp: jpAll, ro: blocks.map(function (b) { return b.ro; }).join(' '), ar: blocks.map(function (b) { return b.ar; }).join(' '), dur: dur }; MN_STORE.save(); } } catch (e) { /* mode privat */ }
          var msg = res.querySelector('.ix-msg'), text = fullText(blocks, dur);
          res.querySelectorAll('.ix-sp').forEach(function (b) { b.addEventListener('click', function () { if (!sayJa(blocks[+b.dataset.i].jp)) msg.textContent = 'Suara Jepang belum tersedia di perangkat ini.'; }); });
          res.querySelector('.ix-all').addEventListener('click', function () { if (!sayJa(jpAll)) msg.textContent = 'Suara Jepang belum tersedia di perangkat ini.'; });
          res.querySelector('.ix-copy').addEventListener('click', function () {
            function ok() { msg.textContent = 'Teks disalin.'; }
            function fb() { var t = document.createElement('textarea'); t.value = text; t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); ok(); } catch (e) { msg.textContent = 'Tidak bisa menyalin di perangkat ini. Pakai Unduh .txt.'; } document.body.removeChild(t); }
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fb); else fb();
          });
          res.querySelector('.ix-dl').addEventListener('click', function () {
            try {
              var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + text], { type: 'text/plain;charset=utf-8' })); a.download = 'jikoshoukai.txt';
              document.body.appendChild(a); a.click(); document.body.removeChild(a); msg.textContent = 'File jikoshoukai.txt diunduh.';
            } catch (e) { msg.textContent = 'Tidak bisa mengunduh di perangkat ini. Pakai Salin teks.'; }
          });
          res.querySelector('.ix-edit').addEventListener('click', function () { res.hidden = true; go.hidden = false; root.querySelector('.ix-jb').scrollIntoView({ block: 'start', behavior: 'smooth' }); });
          res.querySelectorAll('.ix-tog button').forEach(function (b) {
            b.addEventListener('click', function () { var o = !b.classList.contains('on'); b.classList.toggle('on', o); b.setAttribute('aria-pressed', o); res.classList.toggle('no-' + b.dataset.t, !o); });
          });
          res.querySelectorAll('.ix-ro,.ix-ar').forEach(function (d) { d.addEventListener('click', function () { d.classList.toggle('peek'); }); });
          go.hidden = true;
          try { res.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) { /* peramban lama */ }
          done();
        }

        /* panduan katakana: sisipkan ke kolom katakana yang terakhir difokuskan */
        ['nm', 'kotax'].forEach(function (n) { q(n).addEventListener('focus', function () { lastK = q(n); }); });
        root.querySelectorAll('.ix-kb').forEach(function (b) {
          b.addEventListener('mousedown', function (e) { e.preventDefault(); });
          b.addEventListener('click', function () {
            var t = lastK || (val('kota') === 'x' && !q('nm').value ? q('kotax') : q('nm')), s = t.selectionStart == null ? t.value.length : t.selectionStart, e2 = t.selectionEnd == null ? s : t.selectionEnd;
            t.value = t.value.slice(0, s) + b.dataset.k + t.value.slice(e2); t.focus(); try { t.setSelectionRange(s + 1, s + 1); } catch (e) { /* tipe input */ }
            refresh();
          });
        });
        root.addEventListener('input', refresh); root.addEventListener('change', refresh);
        go.addEventListener('click', function () { if (!go.disabled) showResult(); });

        /* pulihkan isian sebelumnya */
        try {
          var S0 = window.MN_STORE && MN_STORE.get(), f0 = S0 && S0.jiko && S0.jiko.f;
          if (f0) root.querySelectorAll('input[name],select[name]').forEach(function (c) {
            var k = c.name + (c.type === 'radio' ? '#' + c.value : ''); if (!(k in f0)) return;
            if (c.type === 'checkbox' || c.type === 'radio') c.checked = !!f0[k]; else c.value = f0[k];
          });
        } catch (e) { /* data lama */ }
        refresh();
      }
    };
  }

  window.MN_JIKO = { widget: widget, roma: roma };
})();
