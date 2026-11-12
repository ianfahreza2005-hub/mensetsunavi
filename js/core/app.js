/* ==========================================================================
   app.js : mesin navigasi (SPA)
   Satu SCENE (S01, S02, ...) terdiri atas beberapa STEP (= "layer" pada Storyline).
   Perpindahan step/scene tidak memuat halaman baru; hanya mengganti layar
   dengan transisi parallax berlapis (terinspirasi video referensi): scene lama membesar
   dan memudar sambil bergeser ke kiri, lapisan scene baru masuk bertahap dari kanan.

   Cara mendefinisikan scene:
     MN.defineScene({ id:'S02', home:false, bare:false, prev:'S01', steps:[
        { id:'x', gated:true, back:true, next:true, nextLabel:'Lanjut', nextScene:'S03',
          enter(ctx){ ... ctx.enableNext(); } } ] })
   ========================================================================== */
(function () {
  'use strict';
  var MN = window.MN, UI = MN.UI, S = MN.State, A = MN.Audio;
  var App = (MN.App = { cur: null, idx: 0, stepEl: null, token: 0, ctx: null, scenes: {}, hist: [] });

  /* Tujuan tombol Kembali dari layar sekarang:
     1) step sebelumnya dalam scene yang sama;
     2) layar terakhir di riwayat (scene yang benar-benar dikunjungi sebelumnya);
     3) bila riwayat kosong (mis. dibuka lewat #S04): scene `prev` milik scene ini,
        bawaan 'S03' (Menu Utama) untuk semua scene selain S01.
     Mengembalikan null bila tidak ada (S01, atau step bernilai dengan back:false). */
  App.prevTarget = function () {
    var sc = App.cur; if (!sc) return null;
    if (sc.steps[App.idx].back === false) return null;
    if (App.idx > 0) return { step: App.idx - 1 };
    if (App.hist.length) { var t = App.hist[App.hist.length - 1]; return { id: t.id, step: t.idx, fromHist: true }; }
    var p = sc.prev !== undefined ? sc.prev : (sc.id === 'S01' ? null : 'S03');
    if (!p || !App.scenes[p]) return null;
    return { id: p, step: App.scenes[p].steps.length - 1 };
  };

  MN.defineScene = function (def) { App.scenes[def.id] = def; };

  function makeCtx(el, scene, step, token) {
    var ctx = {
      el: el, scene: scene, step: step, token: token,
      alive: function () { return token === App.token; },
      after: function (ms, fn) { setTimeout(function () { if (ctx.alive()) fn(); }, ms); },
      narrate: function (text, o) { return A.narrate(text, o); },
      enableNext: function (on, label) { UI.setNextEnabled(on === undefined ? true : on, label); },
      next: function () { App.next(); },
      back: function () { App.back(); },
      goStep: function (i) { App.goStep(i); },
      goScene: function (id, o) { App.go(id, o); },
      sfx: A.sfx
    };
    return ctx;
  }

  /* Lapisan transisi: tiap blok utama layar bergerak dengan kedalaman berbeda (parallax) */
  function layersOf(el) {
    var out = [];
    [].slice.call(el.children).forEach(function (k) {
      if (k.classList.contains('s01-veil') || k.classList.contains('s01-petals')) return;
      if (k.classList.contains('body')) {
        var c = [].slice.call(k.children);
        while (c.length === 1 && c[0].children.length > 1) c = [].slice.call(c[0].children);
        out = out.concat(c);
      } else out.push(k);
    });
    return out;
  }
  function tagLayers(el) {
    layersOf(el).slice(0, 8).forEach(function (n, i) {
      n.classList.add('tx'); n.style.setProperty('--k', i);
    });
  }

  App.mount = function (dir) {
    App.token++;
    A.stopNarration(); UI.hideCaption();
    var sc = App.cur, step = sc.steps[App.idx];
    var el = UI.h('section', { class: 'step ' + (dir > 0 ? 'in-right' : dir < 0 ? 'in-left' : 'fade-in'), 'data-scene': sc.id, 'data-step': step.id || App.idx });
    var ctx = makeCtx(el, sc, step, App.token);
    App.ctx = ctx;

    UI.configureNav({
      bare: !!sc.bare,
      showBack: !!App.prevTarget(),
      showNext: !sc.bare && step.next !== false,
      nextLabel: step.nextLabel,
      nextEnabled: step.gated ? false : true,
      showHome: sc.home === true
    });

    var prev = App.stepEl;
    $('#scenes').appendChild(el);
    App.stepEl = el;
    step.enter(ctx);
    if (dir !== 0) {
      tagLayers(el);
      if (MN.Fx && MN.Fx.bgKick) MN.Fx.bgKick(dir, !!(prev && prev.getAttribute('data-scene') === sc.id));
    }
    if (prev) {
      if (dir !== 0) { tagLayers(prev); void prev.offsetWidth; }
      prev.classList.remove('active');
      prev.classList.add(dir >= 0 ? 'out-left' : 'out-right');
      setTimeout(function () { prev.remove(); }, 1000);
    }
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('active'); }); });
  };
  function $(s) { return document.querySelector(s); }

  App.go = function (id, opts) {
    opts = opts || {};
    var sc = App.scenes[id];
    if (!sc) { console.warn('Scene tidak ditemukan:', id); return; }
    if (App.cur && App.cur.onExit) App.cur.onExit(App);
    /* Riwayat scene: kembali ke S01 = mulai baru; menuju scene yang sudah ada di riwayat
       (mis. "Kembali ke Menu") = potong riwayat sampai sebelum scene itu agar tidak berputar. */
    if (id === 'S01') App.hist = [];
    else if (!opts.fromBack && App.cur && App.cur.id !== id) {
      var at = -1;
      App.hist.forEach(function (e, i) { if (e.id === id) at = i; });
      if (at >= 0) App.hist.length = at;
      else App.hist.push({ id: App.cur.id, idx: App.idx });
    }
    var first = !App.stepEl;
    App.cur = sc; App.idx = opts.step || 0;
    document.body.setAttribute('data-scene', id);
    App.mount(first ? 0 : (opts.dir == null ? 1 : opts.dir));
    if (sc.onEnter) sc.onEnter(App);
  };
  App.goStep = function (i) {
    var dir = i >= App.idx ? 1 : -1;
    App.idx = Math.max(0, Math.min(App.cur.steps.length - 1, i));
    App.mount(dir);
  };
  App.next = function () {
    var sc = App.cur, step = sc.steps[App.idx];
    if (step.onNext && step.onNext(App.ctx) === false) return;
    A.sfx('swoosh');
    if (step.nextScene) { App.go(step.nextScene); return; }
    if (App.idx < sc.steps.length - 1) App.goStep(App.idx + 1);
  };
  App.back = function () {
    var t = App.prevTarget();
    if (!t) return;
    A.sfx('swoosh');
    if (t.id === undefined) { App.goStep(t.step); return; }
    if (t.fromHist) App.hist.pop();
    App.go(t.id, { step: t.step, dir: -1, fromBack: true });
  };
  App.refresh = function () { if (App.cur) App.mount(0); };

  App.start = function () {
    UI.init();

    $('#btnNext').addEventListener('click', function () { A.init(); App.next(); });
    $('#btnBack').addEventListener('click', function () { A.init(); App.back(); });
    $('#btnHome').addEventListener('click', function () { A.init(); A.sfx('click'); App.go('S03'); });

    /* Peramban memblokir suara sebelum ada interaksi: aktifkan pada sentuhan pertama */
    document.addEventListener('pointerdown', function first() {
      A.init();
      if (S.data.seenIntro || (App.cur && App.cur.id !== 'S01')) A.startMusic();
      document.removeEventListener('pointerdown', first);
    });

    /* Pintasan keyboard */
    document.addEventListener('keydown', function (e) {
      if (!$('#help').hidden) { if (e.key === 'Escape') UI.closeHelp(); return; }
      var nx = $('#btnNext'), bk = $('#btnBack');
      if ((e.key === 'ArrowRight' || e.key === 'Enter') && nx.style.visibility !== 'hidden' && !nx.disabled && !$('#bottom').classList.contains('bare') && document.activeElement.tagName !== 'BUTTON') { A.init(); App.next(); }
      if (e.key === 'ArrowLeft' && bk.style.visibility !== 'hidden') { A.init(); App.back(); }
    });

    var hash = (location.hash || '').replace('#', '');
    App.go(App.scenes[hash] ? hash : 'S01');
  };
})();
