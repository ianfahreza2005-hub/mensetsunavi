/* ==========================================================================
   ui.js : elemen antarmuka yang tampil di semua layar
   (panggung 16:9, Trust Meter, tombol suara/bantuan/menu, teks narasi, navigasi)
   ========================================================================== */
(function () {
  'use strict';
  var MN = (window.MN = window.MN || {});
  var UI = (MN.UI = {});
  var $ = function (s, r) { return (r || document).querySelector(s); };
  UI.$ = $;

  /* Pembuat elemen singkat: h('div', {class:'x', onclick:fn}, anak1, anak2) */
  function h(tag, attrs) {
    var e = document.createElement(tag), kids = Array.prototype.slice.call(arguments, 2);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') e.addEventListener(k.slice(2).toLowerCase(), v);
      else e.setAttribute(k, v === true ? '' : v);
    });
    (function add(list) {
      list.forEach(function (c) {
        if (c == null || c === false) return;
        if (Array.isArray(c)) return add(c);
        e.appendChild(c.nodeType ? c : document.createTextNode(c));
      });
    })(kids);
    return e;
  }
  UI.h = h;

  UI.shuffle = function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };

  /* ---------- Panggung 16:9 yang diskalakan ---------- */
  function fit() {
    var st = $('#stage'); if (!st) return;
    var s = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
    st.style.transform = 'translate(-50%,-50%) scale(' + s + ')';
    var portrait = window.innerHeight > window.innerWidth * 1.05 && window.innerWidth < 900;
    document.body.classList.toggle('portrait', portrait);
  }

  /* ---------- Trust Meter ---------- */
  UI.buildTrust = function () {
    var t = $('#trust');
    t.innerHTML = '<span class="trust-ico"><img id="trustFace" src="' + MN.Art.mascotSrc('exp_netral') + '" alt=""></span>' +
      '<span class="trust-meta"><span class="trust-lbl">Trust Meter</span>' +
      '<span class="trust-bar"><i id="trustFill"></i></span></span>' +
      '<span class="trust-num" id="trustNum">50</span>';
  };
  function trustClass(v) { return v >= 70 ? 'hi' : v >= 40 ? 'mid' : 'lo'; }
  UI.setTrust = function (value, delta) {
    var fill = $('#trustFill'), num = $('#trustNum'), box = $('#trust');
    if (!fill) return;
    fill.style.width = value + '%';
    box.classList.remove('hi', 'mid', 'lo'); box.classList.add(trustClass(value));
    num.textContent = Math.round(value);
    /* wajah maskot mengikuti tingkat kepercayaan */
    var face = $('#trustFace');
    if (face) face.src = MN.Art.mascotSrc(value >= 70 ? 'exp_percaya_diri' : value >= 40 ? 'exp_netral' : 'exp_gugup');
    if (delta) {
      var chip = h('span', { class: 'delta ' + (delta > 0 ? 'up' : 'down') }, (delta > 0 ? '+' : '−') + Math.abs(delta));
      box.appendChild(chip);
      setTimeout(function () { chip.remove(); }, 1500);
      MN.Audio.sfx(delta > 0 ? 'meter' : 'meterDown');
      box.classList.remove('pulse'); void box.offsetWidth; box.classList.add('pulse');
    }
  };
  UI.showTrust = function (show) {
    var box = $('#trust');
    box.classList.toggle('hidden', !show);
    if (show) UI.setTrust(MN.State.data.trust, 0);
  };

  /* ---------- Teks narasi (juga berfungsi sebagai transkrip) ---------- */
  var skipHandler = null;
  UI.showCaption = function (text, who, onSkip) {
    var cap = $('#caption');
    $('#capWho').textContent = who;
    $('#capWho').className = 'who ' + (who === 'Navi' ? 'navi' : '');
    cap.classList.toggle('navi-on', who === 'Navi');
    if (who === 'Navi') $('#capAv').src = MN.Art.mascotSrc('exp_berpikir');
    $('#capText').textContent = text;
    cap.classList.remove('off', 'finished');
    skipHandler = onSkip;
    $('#capSkip').style.display = '';
  };
  UI.captionDone = function (reason) {
    var cap = $('#caption');
    skipHandler = null;
    $('#capSkip').style.display = 'none';
    if (reason === 'cancelled') cap.classList.add('off'); else cap.classList.add('finished');
  };
  UI.hideCaption = function () { $('#caption').classList.add('off'); skipHandler = null; };

  /* ---------- Toast ---------- */
  var toastT;
  UI.toast = function (msg, ms) {
    var t = $('#toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(function () { t.classList.remove('show'); }, ms || 2600);
  };

  /* ---------- Navigasi bawah ---------- */
  UI.configureNav = function (o) {
    var bottom = $('#bottom'), back = $('#btnBack'), next = $('#btnNext');
    bottom.classList.toggle('bare', !!o.bare);
    back.style.visibility = o.showBack ? 'visible' : 'hidden';
    next.style.visibility = o.showNext ? 'visible' : 'hidden';
    next.querySelector('span').textContent = o.nextLabel || 'Lanjut';
    next.disabled = !o.nextEnabled;
    $('#btnHome').hidden = !o.showHome;
  };
  UI.setNextEnabled = function (on, label) {
    var next = $('#btnNext');
    next.disabled = !on;
    if (label) next.querySelector('span').textContent = label;
    if (on) { next.classList.remove('ready'); void next.offsetWidth; next.classList.add('ready'); }
  };

  /* ---------- Bantuan ---------- */
  UI.openHelp = function () { MN.Audio.sfx('click'); $('#help').hidden = false; };
  UI.closeHelp = function () { $('#help').hidden = true; };

  UI.syncSoundIcon = function () {
    $('#btnSound').innerHTML = MN.Art.icon(MN.Audio.isMuted() ? 'soundOff' : 'soundOn', 24);
    $('#btnSound').setAttribute('aria-label', MN.Audio.isMuted() ? 'Aktifkan suara' : 'Bisukan suara');
  };

  UI.init = function () {
    if (MN.Bg) MN.Bg.build();
    UI.buildTrust();
    $('#btnHome').innerHTML = MN.Art.icon('home', 24);
    $('#btnHelp').innerHTML = MN.Art.icon('help', 24);
    UI.syncSoundIcon();
    UI.showTrust(MN.State.data.trustShown);

    $('#btnSound').addEventListener('click', function () {
      MN.Audio.init();
      MN.Audio.setMuted(!MN.Audio.isMuted());
      UI.syncSoundIcon();
      if (!MN.Audio.isMuted()) { MN.Audio.startMusic(); MN.Audio.sfx('click'); }
    });
    $('#btnHelp').addEventListener('click', UI.openHelp);
    $('#helpClose').addEventListener('click', function () { MN.Audio.sfx('click'); UI.closeHelp(); });
    $('#help').addEventListener('click', function (e) { if (e.target.id === 'help') UI.closeHelp(); });
    $('#capSkip').addEventListener('click', function () { if (skipHandler) skipHandler(); });

    /* Alat uji prototipe (dihapus pada versi akhir) */
    $('#devM1').addEventListener('click', function () { MN.State.markDone('M1'); MN.App.refresh(); UI.toast('Modul 1 ditandai selesai (uji)'); });
    $('#devM2').addEventListener('click', function () { MN.State.markDone('M2'); MN.App.refresh(); UI.toast('Modul 2 ditandai selesai (uji)'); });
    $('#devM3').addEventListener('click', function () { MN.State.markDone('M3'); MN.App.refresh(); UI.toast('Modul 3 ditandai selesai (uji)'); });
    $('#devM4').addEventListener('click', function () { MN.State.markDone('M4'); MN.App.refresh(); UI.toast('Modul 4 ditandai selesai (uji)'); });
    $('#devReset').addEventListener('click', function () {
      MN.State.reset(); UI.showTrust(false); UI.closeHelp(); MN.App.go('S01'); UI.toast('Progres dihapus');
    });

    window.addEventListener('resize', fit); fit();
  };
})();
