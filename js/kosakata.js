/* Mensetsu Navi — GLB-03 Bank Kosakata dan Kartu Hafalan (sistem Leitner tiga kotak).
   Sumber: glosarium tiap bab (D.bab[i].glos, dibuat gen_data.py dari naskah). Istilah yang sama di beberapa bab digabung.

   Kartu hafalan (Fitur_Global.md):
     Kotak 1 Belum hafal  : istilah baru dan yang dijawab "Belum tahu"  → muncul setiap sesi
     Kotak 2 Hampir hafal : "Sudah tahu" satu kali                      → muncul setiap 2 sesi
     Kotak 3 Hafal        : "Sudah tahu" dua kali berturut-turut         → muncul setiap 4 sesi
   Satu sesi 10 kartu (maks. 4 slot untuk kartu kotak 2/3 yang waktunya tiba). Penilaian diri, bukan nilai. Progres: MN_STORE.get().kosa = { box:{istilah:1|2|3}, star:{istilah:1}, sesi:n }

   API: MN_KOSA.mount(root, api)  — api: { esc, ic, naviSay, bindSpeak, sayJa, status(bab), toast } */
(function () {
  var D = window.MN_DATA, ST = window.MN_STORE;
  var UKURAN = 10;
  var KAT = [['sopan', 'Ungkapan sopan'], ['kerja', 'Istilah kerja'], ['wawancara', 'Istilah wawancara'], ['angka', 'Angka dan usia']];
  var KOTAK = ['Belum hafal', 'Hampir hafal', 'Hafal'];
  var KOTAK_SIKLUS = ['setiap sesi', 'setiap 2 sesi', 'setiap 4 sesi'];

  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function bank() {
    var map = {}, list = [];
    D.bab.forEach(function (b) {
      (b.glos || []).forEach(function (g) {
        var e = map[g.jp];
        if (!e) { e = map[g.jp] = { jp: g.jp, ro: g.ro, ar: g.ar, kat: g.kat, babs: [], k: {} }; list.push(e); }
        if (e.babs.indexOf(b.no) < 0) e.babs.push(b.no);
        if (g.k >= 0 && e.k[b.no] == null) e.k[b.no] = g.k;
      });
    });
    return list;
  }

  /* ---- progres (hanya di perangkat) */
  function kosa() {
    var S = ST.get();
    if (!S.kosa || typeof S.kosa !== 'object') S.kosa = {};
    if (!S.kosa.box) S.kosa.box = {};
    if (!S.kosa.star) S.kosa.star = {};
    if (!S.kosa.sesi) S.kosa.sesi = 0;
    return S.kosa;
  }
  function boxOf(k, jp) { return k.box[jp] || 1; }

  /* kartu untuk sesi ke-n. Kotak 1 selalu ikut; kotak 2 saat sesi genap; kotak 3 saat sesi kelipatan 4.
     Jatah: paling banyak JATAH_ULANG slot dicadangkan untuk kartu kotak 2/3 yang sudah waktunya, supaya tidak
     tersisih oleh kotak 1 yang jumlahnya banyak di awal. Berbintang didahulukan di tiap kelompok.
     Bila kurang dari 10, dilengkapi sisa yang due, lalu yang belum waktunya (kotak 2 dulu). */
  var JATAH_ULANG = 4;
  function pilihSesi(list, k) {
    var n = k.sesi + 1;
    function due(e) { var b = boxOf(k, e.jp); return b === 1 || (b === 2 && n % 2 === 0) || (b === 3 && n % 4 === 0); }
    function urut(a) {
      return shuffle(a).sort(function (x, y) { return (k.star[y.jp] ? 1 : 0) - (k.star[x.jp] ? 1 : 0) || boxOf(k, x.jp) - boxOf(k, y.jp); });
    }
    var baru = urut(list.filter(function (e) { return boxOf(k, e.jp) === 1; }));
    /* kotak 3 didahulukan di kelompok ulang: kesempatannya hanya tiap 4 sesi */
    var ulang = urut(list.filter(function (e) { return boxOf(k, e.jp) > 1 && due(e); })).sort(function (x, y) { return (k.star[y.jp] ? 1 : 0) - (k.star[x.jp] ? 1 : 0) || boxOf(k, y.jp) - boxOf(k, x.jp); });
    var tunda = urut(list.filter(function (e) { return !due(e); })).sort(function (x, y) { return boxOf(k, x.jp) - boxOf(k, y.jp); });
    var pick = ulang.slice(0, JATAH_ULANG);
    pick = pick.concat(baru.slice(0, UKURAN - pick.length));
    if (pick.length < UKURAN) pick = pick.concat(ulang.slice(JATAH_ULANG, JATAH_ULANG + UKURAN - pick.length));
    if (pick.length < UKURAN) pick = pick.concat(tunda.slice(0, UKURAN - pick.length));
    return shuffle(pick);
  }

  function mount(root, api) {
    var esc = api.esc, ic = api.ic, list = bank();
    var f = { q: '', raw: '', bab: 0, kat: '', star: false, ro: true, ar: true };   /* raw = isi kolom cari apa adanya (spasi tidak boleh hilang saat digambar ulang) */
    var sesi = null;   /* { kartu:[], i:0, balik:false, naik:0, turun:0 } */

    root.innerHTML = '<div class="kv"><div class="kv-tabs" role="tablist"><button class="kv-tab on" role="tab" data-t="daftar" aria-selected="true">Daftar</button>' +
      '<button class="kv-tab" role="tab" data-t="kartu" aria-selected="false">Kartu hafalan</button></div>' +
      '<section class="kv-p" data-p="daftar"></section><section class="kv-p" data-p="kartu" hidden></section></div>';
    var pD = root.querySelector('[data-p="daftar"]'), pK = root.querySelector('[data-p="kartu"]');

    root.querySelectorAll('.kv-tab').forEach(function (b) {
      b.addEventListener('click', function () {
        root.querySelectorAll('.kv-tab').forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-selected', on); });
        pD.hidden = b.dataset.t !== 'daftar'; pK.hidden = b.dataset.t !== 'kartu';
        if (b.dataset.t === 'kartu') drawK(); else drawD();
      });
    });

    /* ================================================== DAFTAR */
    function chip(attr, val, label, on) { return '<button class="kv-chip' + (on ? ' on' : '') + '" data-' + attr + '="' + val + '" aria-pressed="' + !!on + '">' + label + '</button>'; }
    function match(e) {
      var k = kosa();
      if (f.bab && e.babs.indexOf(f.bab) < 0) return false;
      if (f.kat && e.kat !== f.kat) return false;
      if (f.star && !k.star[e.jp]) return false;
      if (f.q) { var q = f.q.toLowerCase(); if ((e.jp + ' ' + e.ro + ' ' + e.ar).toLowerCase().indexOf(q) < 0) return false; }
      return true;
    }
    function entry(e) {
      var k = kosa(), st = !!k.star[e.jp], b = boxOf(k, e.jp);
      var links = e.babs.map(function (n) {
        if (e.k[n] == null) return '';
        return api.status(n) === 'locked' ? '' : '<a href="#/bab/' + n + '/' + e.k[n] + '">Lihat di slide · Bab ' + n + '</a>';
      }).filter(Boolean).join('');
      return '<article class="kv-e' + (st ? ' star' : '') + '" data-jp="' + esc(e.jp) + '"><div class="kv-row"><span class="jp kv-jp">' + esc(e.jp) + '</span>' +
        '<button class="ix-sp kv-say" aria-label="Dengarkan ' + esc(e.ro) + '">' + ic('speaker') + '</button>' +
        '<button class="kv-st" aria-pressed="' + st + '" aria-label="' + (st ? 'Hapus bintang' : 'Beri bintang') + '">' + (st ? '★' : '☆') + '</button></div>' +
        '<div class="ix-ro">' + esc(e.ro) + '</div><div class="ix-ar">' + esc(e.ar) + '</div>' +
        '<div class="kv-meta"><span class="kv-tag">' + esc(KAT.filter(function (x) { return x[0] === e.kat; })[0][1]) + '</span><span class="kv-tag">Bab ' + e.babs.join(', ') + '</span>' +
        '<span class="kv-tag k' + b + '">Kotak ' + b + '</span>' + links + '</div></article>';
    }
    function drawD() {
      var shown = list.filter(match), k = kosa(), nstar = Object.keys(k.star).filter(function (j) { return k.star[j]; }).length;
      var babs = '<div class="kv-chips" role="group" aria-label="Filter bab">' + chip('bab', 0, 'Semua bab', !f.bab) + [1, 2, 3, 4, 5, 6].map(function (n) { return chip('bab', n, 'Bab ' + n, f.bab === n); }).join('') + '</div>';
      var kats = '<div class="kv-chips" role="group" aria-label="Filter kategori">' + chip('kat', '', 'Semua kategori', !f.kat) +
        KAT.filter(function (x) { return list.some(function (e) { return e.kat === x[0]; }); }).map(function (x) { return chip('kat', x[0], x[1], f.kat === x[0]); }).join('') +
        chip('star', 1, '★ Berbintang (' + nstar + ')', f.star) + '</div>';
      pD.innerHTML = '<input class="kv-q" type="search" placeholder="Cari kata (Jepang, romaji, atau arti)" value="' + esc(f.raw) + '" aria-label="Cari kosakata" autocomplete="off">' + babs + kats +
        '<div class="kv-bar"><span class="ix-count">' + shown.length + ' dari ' + list.length + ' istilah</span><span class="ix-tog"><button class="btn soft' + (f.ro ? ' on' : '') + '" data-t="ro" aria-pressed="' + f.ro + '">Romaji</button><button class="btn soft' + (f.ar ? ' on' : '') + '" data-t="ar" aria-pressed="' + f.ar + '">Arti</button></span></div>' +
        '<div class="kv-list' + (f.ro ? '' : ' no-ro') + (f.ar ? '' : ' no-ar') + '">' + (shown.length ? shown.map(entry).join('') : '<p class="kv-none">Tidak ada istilah yang cocok. Coba ubah kata kunci atau filter.</p>') + '</div>';
      var q = pD.querySelector('.kv-q');
      q.addEventListener('input', function () {
        f.raw = q.value; f.q = q.value.trim(); var pos = q.selectionStart; drawD(); var n = pD.querySelector('.kv-q'); n.focus(); try { n.setSelectionRange(pos, pos); } catch (e) { /* tipe input */ }
      });
      pD.querySelectorAll('.kv-chip').forEach(function (b) {
        b.addEventListener('click', function () {
          if (b.dataset.bab != null) f.bab = +b.dataset.bab; else if (b.dataset.kat != null) f.kat = b.dataset.kat; else f.star = !f.star;
          drawD();
        });
      });
      pD.querySelectorAll('.ix-tog button').forEach(function (b) { b.addEventListener('click', function () { f[b.dataset.t] = !f[b.dataset.t]; drawD(); }); });
      pD.querySelectorAll('.kv-e').forEach(function (a) {
        var jp = a.dataset.jp, e = list.filter(function (x) { return x.jp === jp; })[0];
        a.querySelector('.kv-say').addEventListener('click', function () { if (!api.sayJa(e.jp)) api.toast('Suara Jepang belum tersedia di perangkat ini.'); });
        a.querySelector('.kv-st').addEventListener('click', function () {
          var kk = kosa(); if (kk.star[jp]) delete kk.star[jp]; else kk.star[jp] = 1; ST.save();
          var scroll = window.pageYOffset; drawD(); window.scrollTo(0, scroll);
        });
        a.querySelectorAll('.ix-ro,.ix-ar').forEach(function (d) { d.addEventListener('click', function () { d.classList.toggle('peek'); }); });
      });
    }

    /* ================================================== KARTU HAFALAN */
    function hitung() {
      var k = kosa(), c = [0, 0, 0, 0];
      list.forEach(function (e) { c[boxOf(k, e.jp)]++; });
      return c;
    }
    function drawK() {
      if (!sesi) return drawMulai();
      if (sesi.i >= sesi.kartu.length) return drawRingkas();
      drawKartu();
    }
    function kotakTiles(c) {
      return '<div class="kv-boxes">' + [1, 2, 3].map(function (n) {
        return '<div class="kv-box k' + n + '"><b>' + c[n] + '</b><span>Kotak ' + n + '</span><small>' + KOTAK[n - 1] + '<br>' + KOTAK_SIKLUS[n - 1] + '</small></div>';
      }).join('') + '</div>';
    }
    function drawMulai() {
      var k = kosa(), c = hitung(), n = k.sesi + 1, nstar = Object.keys(k.star).filter(function (j) { return k.star[j]; }).length;
      pK.innerHTML = api.naviSay('GLB-03', D.slides['GLB-03'].narasi, 'pose_dagu') + kotakTiles(c) +
        '<div class="card kv-intro"><b>Sesi ke-' + n + ' · ' + Math.min(UKURAN, list.length) + ' kartu</b><p>Lihat tulisan Jepang, tebak artinya, lalu balik kartunya. Pilih <b>Sudah tahu</b> atau <b>Belum tahu</b>. Ini penilaianmu sendiri, bukan nilai.</p>' +
        (nstar ? '<p class="mini">Istilah berbintang (' + nstar + ') didahulukan.</p>' : '<p class="mini">Beri bintang ★ di Daftar untuk istilah yang ingin kamu dahulukan.</p>') +
        '<button class="btn full kv-start">Mulai sesi</button></div>';
      api.bindSpeak(pK);
      pK.querySelector('.kv-start').addEventListener('click', function () {
        sesi = { kartu: pilihSesi(list, kosa()), i: 0, balik: false, naik: 0, turun: 0 }; drawK();
      });
    }
    function drawKartu() {
      var e = sesi.kartu[sesi.i], b = boxOf(kosa(), e.jp), tot = sesi.kartu.length;
      var depan = '<div class="kv-face front"><span class="kv-kb k' + b + '">Kotak ' + b + ' · ' + KOTAK[b - 1] + '</span><span class="jp kv-big">' + esc(e.jp) + '</span>' +
        '<button class="ix-sp kv-say" aria-label="Dengarkan">' + ic('speaker') + '</button><p class="kv-tip">Tebak artinya, lalu balik kartu.</p></div>';
      var belakang = '<div class="kv-face back"><span class="kv-kb k' + b + '">Kotak ' + b + ' · ' + KOTAK[b - 1] + '</span><span class="jp kv-mid">' + esc(e.jp) + '</span>' +
        '<button class="ix-sp kv-say" aria-label="Dengarkan">' + ic('speaker') + '</button><div class="ix-ro">' + esc(e.ro) + '</div><div class="kv-arti">' + esc(e.ar) + '</div>' +
        '<span class="kv-tag">Bab ' + e.babs.join(', ') + '</span></div>';
      pK.innerHTML = '<div class="kv-prog"><span>Kartu ' + (sesi.i + 1) + ' dari ' + tot + '</span><b><i style="width:' + Math.round(sesi.i / tot * 100) + '%"></i></b></div>' +
        '<div class="kv-card' + (sesi.balik ? ' flipped' : '') + '" aria-live="polite">' + (sesi.balik ? belakang : depan) + '</div>' +
        (sesi.balik
          ? '<div class="kv-ans"><button class="btn ghost kv-no">Belum tahu</button><button class="btn kv-yes">Sudah tahu</button></div>'
          : '<button class="btn full kv-flip">Balik kartu</button>') +
        '<p class="ix-hint"><button class="linkbtn kv-stop">Akhiri sesi</button></p>';
      pK.querySelectorAll('.kv-say').forEach(function (s) { s.addEventListener('click', function () { if (!api.sayJa(e.jp)) api.toast('Suara Jepang belum tersedia di perangkat ini.'); }); });
      var fl = pK.querySelector('.kv-flip');
      if (fl) { fl.addEventListener('click', flip); pK.querySelector('.kv-card').addEventListener('click', function (ev) { if (!ev.target.closest('.kv-say')) flip(); }); }
      function flip() { sesi.balik = true; drawKartu(); }
      var yes = pK.querySelector('.kv-yes'), no = pK.querySelector('.kv-no');
      if (yes) yes.addEventListener('click', function () { jawab(e, true); });
      if (no) no.addEventListener('click', function () { jawab(e, false); });
      pK.querySelector('.kv-stop').addEventListener('click', function () { sesi = null; drawK(); });
    }
    function jawab(e, tahu) {
      var k = kosa(), b = boxOf(k, e.jp);
      if (tahu) { k.box[e.jp] = Math.min(3, b + 1); if (k.box[e.jp] > b) sesi.naik++; } else { k.box[e.jp] = 1; sesi.turun++; }
      ST.save(); sesi.i++; sesi.balik = false;
      if (sesi.i >= sesi.kartu.length) { k.sesi++; ST.save(); }
      drawK();
    }
    function drawRingkas() {
      var c = hitung(), s = sesi;
      pK.innerHTML = '<div class="card kv-intro"><span class="chip">Sesi selesai</span><h3 class="kv-sum">Kerja bagus!</h3>' +
        '<p>Dari ' + s.kartu.length + ' kartu: <b>' + s.naik + '</b> naik kotak, <b>' + s.turun + '</b> belum hafal dan tetap (atau kembali) di Kotak 1.</p></div>' + kotakTiles(c) +
        '<div class="kv-ans"><button class="btn ghost kv-list">Ke Daftar</button><button class="btn kv-again">Sesi berikutnya</button></div>';
      pK.querySelector('.kv-again').addEventListener('click', function () { sesi = null; drawMulai(); });
      pK.querySelector('.kv-list').addEventListener('click', function () { sesi = null; root.querySelector('.kv-tab[data-t="daftar"]').click(); });
    }

    drawD();
  }

  window.MN_KOSA = { mount: mount, bank: bank, pilihSesi: pilihSesi };
})();
