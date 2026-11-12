/* S02 : Onboarding (Modul 0) : satu scene, empat layer
   Layer 1 Mindset -> Layer 2 Tiga penilaian -> Layer 3 Keputusan awal -> Layer 4 Misi -> S03
   Tidak ada penilaian skor pada scene ini; hanya Trust Meter yang berubah. */
(function () {
  'use strict';
  var MN = window.MN, T = MN.Text.S02, A = MN.Audio, Art = MN.Art, UI = MN.UI, h = UI.h, S = MN.State;

  /* ------------------------------------------------ Layer 1 : Mindset */
  function layer1(ctx) {
    var el = ctx.el; el.classList.add('pattern', 's02');
    MN.Bg.photo('stasiun');                                  // latar: peron stasiun Tokyo pagi
    el.innerHTML =
      '<div class="body"><div class="two">' +
        '<div class="navi-stage">' +
          '<div class="navi-say"><div class="bubble hidden-el" id="naviSay">' + T.navi_sapa + '</div></div></div>' +
        '<div class="l1-right">' +
          '<div class="vs-row">' +
            '<div class="vs-col dim-col hidden-el" id="colA"><div class="vs-ico">' + Art.icon('book', 30) + '</div><h3>' + T.kolomA + '</h3></div>' +
            '<div class="vs-mid hidden-el" id="vsMid">VS</div>' +
            '<div class="vs-col hot-col hidden-el" id="colB"><div class="vs-ico">' + Art.icon('heart', 30) + '</div><h3>' + T.kolomB + '</h3></div>' +
          '</div>' +
          '<div class="hire hidden-el" id="hire">' +
            '<div class="hire-title"><span>Hire for attitude</span>, train for skill</div>' +
            '<div class="hire-row">' +
              '<div class="cand ok"><div class="mark">' + Art.icon('check', 26) + '</div><div><b>' + T.candOK.judul + '</b><small>' + T.candOK.sub + '</small></div></div>' +
              '<div class="cand no"><div class="mark">' + Art.icon('cross', 26) + '</div><div><b>' + T.candNO.judul + '</b><small>' + T.candNO.sub + '</small></div></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div></div>';

    /* Navi: melambai saat menyapa -> tenang saat menjelaskan -> semangat pada prinsip "hire for attitude" */
    var navi = MN.Mascot.create({ pose: 'pose_melambai', cls: 'grounded', alt: 'Navi' });
    el.querySelector('.navi-stage').insertBefore(navi, el.querySelector('.navi-say'));
    ctx.after(3600, function () { if (navi.key() === 'pose_melambai') navi.set('pose_berdiri'); });

    function show(id, sfx) { var n = el.querySelector(id); n.classList.add('show-el'); if (sfx) A.sfx(sfx); }
    ctx.after(450, function () { show('#naviSay'); });
    ctx.after(1500, function () { show('#colA', 'reveal'); });
    ctx.after(2300, function () { show('#vsMid'); show('#colB', 'reveal'); });

    ctx.after(700, async function () {
      await ctx.narrate(T.n1.text, { file: T.n1.file });
      if (!ctx.alive()) return;
      show('#colA'); show('#vsMid'); show('#colB');          // bila narasi dilewati
      show('#hire', 'reveal'); navi.set('pose_semangat');
      await ctx.narrate(T.n2.text, { file: T.n2.file });
      if (!ctx.alive()) return;
      ctx.enableNext();
    });
  }

  /* ------------------------------------------------ Layer 2 : Tiga hal yang dinilai */
  function layer2(ctx) {
    var el = ctx.el; el.classList.add('pattern', 's02');
    MN.Bg.photo('kantor_eksterior', 'soft');                 // tiba di depan kantor (dibuat lembut agar kartu terbaca)
    var opened = 0;
    /* Kemiringan 3D + pantulan cahaya (adaptasi komponen "3D tilt remix").
       Gerak dipertahankan: perspektif 1000px, mengikuti kursor 400ms, kembali datar 1000ms
       (keduanya cubic-bezier(.22,1,.36,1)), kemiringan maks 40deg, kilau 0.32 dengan fade 300ms.
       Mouse: aktif saat kursor di atas kartu. Sentuh/pena: aktif saat ditekan lalu digeser.
       Mati otomatis bila perangkat memakai "kurangi gerakan". */
    function tilt3d(btn) {
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
      var MAX = 40;
      function reset() {
        btn.classList.remove('is-hover', 'is-tilting');
        btn.style.setProperty('--rx', '0deg'); btn.style.setProperty('--ry', '0deg');
      }
      btn.addEventListener('pointerdown', function (e) {
        if (reduce.matches || e.pointerType === 'mouse') return;
        try { btn.setPointerCapture(e.pointerId); } catch (err) {}
      });
      btn.addEventListener('pointermove', function (e) {
        if (reduce.matches) return;
        var r = btn.getBoundingClientRect();
        var px = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
        var py = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
        btn.classList.add('is-hover', 'is-tilting');
        btn.style.setProperty('--ry', ((px - .5) * MAX).toFixed(2) + 'deg');
        btn.style.setProperty('--rx', ((.5 - py) * MAX).toFixed(2) + 'deg');
        btn.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
        btn.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
      });
      btn.addEventListener('pointerup', function (e) { if (e.pointerType !== 'mouse') reset(); });
      btn.addEventListener('pointercancel', reset);
      btn.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') reset(); });
      if (reduce.addEventListener) reduce.addEventListener('change', reset);
    }

    var cards = T.kartu.map(function (k) {
      var c = h('button', { class: 'rcard', 'aria-label': 'Buka kartu ' + k.judul },
        h('div', { class: 'tilt' },                           // lapisan kemiringan 3D (mengikuti kursor)
          h('div', { class: 'in' },
            h('div', { class: 'f' }, h('div', { class: 'num' }, String(k.no)), h('h3', null, k.judul), h('small', null, 'KETUK UNTUK MEMBUKA')),
            h('div', { class: 'b', html: '<div class="bi">' + Art.icon(k.icon, 30) + '</div><h3>' + k.judul + '</h3><p>' + k.isi + '</p>' })),
          h('div', { class: 'glare', 'aria-hidden': 'true' })));   // pantulan cahaya
      tilt3d(c);
      c.addEventListener('click', function () {
        if (c.classList.contains('open')) return;
        c.classList.add('open'); opened++; A.sfx('reveal'); revealFx(c);
        counter.textContent = 'Kartu dibuka: ' + opened + ' dari 3';
        if (opened === 3) { ctx.enableNext(); counter.classList.add('done'); pointer.set('pose_jempol'); }
      });
      return c;
    });
    var counter = h('div', { class: 'counter' }, 'Kartu dibuka: 0 dari 3');

    /* Animasi kartu (mengacu video referensi, dianalisis per frame):
       1) masuk: muncul kecil sambil berputar & membalik (rotateY), membesar sedikit melewati ukuran lalu mantap,
          disertai garis sinar memancar dan gelembung kecil; kartu masuk bergantian;
       2) diam: melayang naik-turun pelan dengan miring tipis;
       3) dibuka: kartu berputar cepat sampai tegak-tepi disertai kilat cahaya, sisi belakang tampil
          terang lalu meredup, gelombang cincin, sinar berputar, dan percikan bintang. */
    function fx(card, cls, html, ms) {
      var e = h('div', { class: cls, html: html || '' });
      card.appendChild(e); setTimeout(function () { e.remove(); }, ms);
    }
    function burst(card) {
      var rays = '', i;
      for (i = 0; i < 12; i++) rays += '<i style="--a:' + (i * 30) + 'deg"></i>';
      fx(card, 'c-burst', rays + '<b style="--x:-150px;--y:-110px"></b><b style="--x:160px;--y:-80px"></b><b style="--x:-120px;--y:130px"></b>', 1000);
    }
    function revealFx(card) {
      var sp = '', i;
      for (i = 0; i < 12; i++) {
        var ang = (i / 12) * Math.PI * 2 + Math.random() * .4, r = 150 + Math.random() * 70;
        sp += '<i style="--x:' + Math.round(Math.cos(ang) * r) + 'px;--y:' + Math.round(Math.sin(ang) * r - 30) + 'px;--s:' + (.6 + Math.random() * .7).toFixed(2) + ';--dl:' + (180 + Math.random() * 220 | 0) + 'ms"></i>';
      }
      fx(card, 'c-rays', '', 1500);
      fx(card, 'c-ring', '', 1100);
      fx(card, 'c-flash', '', 1200);
      fx(card, 'c-spark', sp, 1600);
    }
    cards.forEach(function (c, i) {
      c.style.setProperty('--d', (.35 + i * .18) + 's');
      c.style.setProperty('--fdur', (4.2 + i * .55) + 's');   // durasi melayang beda tiap kartu agar tidak serempak
      c.classList.add('enter');
      ctx.after(400 + i * 180, function () { burst(c); });
    });
    var pointer = MN.Mascot.create({ pose: 'pose_menunjuk', cls: 'rv-mascot grounded', alt: 'Navi menunjuk kartu' });
    var wrap = h('div', { class: 'rv-wrap' },
      h('div', { class: 'rv-head', html: '<div class="page-title">Modul 0 · Onboarding</div><h2>Tiga hal yang dinilai pewawancara</h2><p>Ketuk setiap kartu untuk membukanya</p>' }),
      h('div', { class: 'rv-main' },
        h('div', { class: 'rv-row' }, cards),
        pointer),
      counter);
    el.appendChild(h('div', { class: 'body' }, wrap));
    ctx.after(700, function () { ctx.narrate(T.n3.text, { file: T.n3.file }); });
  }

  /* ------------------------------------------------ Layer 3 : Keputusan awal */
  function layer3(ctx) {
    var el = ctx.el; el.classList.add('pattern', 's02');
    MN.Bg.photo('lobi');                                     // latar: lobi perusahaan
    var K = T.keputusan, done = S.data.onboardingDecision;

    /* Trust Meter muncul pertama kali di sini */
    if (!S.data.trustShown) {
      S.data.trustShown = true; S.save();
      ctx.after(500, function () { UI.showTrust(true); A.sfx('reveal'); });
    }

    var fbBox = h('div', { id: 'fbBox' });
    /* Navi (pemandu) bereaksi terhadap pilihan: tepat = jempol, kurang = berpikir, salah = menunduk.
       Kandidat = "kamu" (sudut pandang orang pertama), jadi tidak digambar. */
    var REACT = { tepat: 'pose_jempol', kurang: 'pose_dagu', salah: 'pose_menunduk' };
    var cand = MN.Mascot.create({ pose: done ? REACT[done] : 'pose_dagu', cls: 'dec-navi grounded', alt: 'Navi' });   // pertanyaan = berpikir
    var order = UI.shuffle(K.opsi);
    var buttons = [];

    function mark(opsi, btn) {
      var cls = opsi.tier === 'tepat' ? 'correct' : opsi.tier === 'kurang' ? 'partial' : 'wrong';
      btn.classList.add(cls);
    }
    function feedback(opsi) {
      var label = opsi.tier === 'tepat' ? 'Tepat' : opsi.tier === 'kurang' ? 'Kurang tepat' : 'Belum tepat';
      var face = opsi.tier === 'tepat' ? 'exp_senang' : opsi.tier === 'kurang' ? 'exp_bingung' : 'exp_sedih';
      fbBox.innerHTML = ''; cand.set(REACT[opsi.tier]);
      fbBox.appendChild(h('div', { class: 'fb ' + opsi.tier, html: '<span class="av"><img src="' + Art.mascotSrc(face) + '" alt=""></span><div><span class="tag">' + label + '</span>' + opsi.fb + '</div>' }));
    }
    function choose(opsi, btn) {
      if (S.data.onboardingDecision && !done) return;
      buttons.forEach(function (b) { b.btn.disabled = true; if (b.btn !== btn) b.btn.classList.add('dim'); });
      mark(opsi, btn);
      A.sfx(opsi.tier === 'tepat' ? 'correct' : opsi.tier === 'kurang' ? 'partial' : 'wrong');
      if (opsi.tier === 'salah') btn.classList.add('shake');
      feedback(opsi);
      if (!S.data.onboardingDecision) {                    // Trust Meter hanya berubah pada percobaan pertama
        S.data.onboardingDecision = opsi.tier; S.save();
        ctx.after(500, function () { S.addTrust(opsi.delta); });
      }
      ctx.after(400, function () { ctx.enableNext(); });
    }

    order.forEach(function (o) {
      var inner = '<div class="g">' + o.gestur + '</div>' +
        (o.jp ? '<div class="j">' + o.jp + '</div><div class="r">' + o.romaji + '</div>' : '') +
        '<div class="a">' + o.arti + '</div>';
      var b = h('button', { class: 'choice', html: inner });
      b.addEventListener('click', function () { choose(o, b); });
      buttons.push({ btn: b, o: o });
    });

    el.appendChild(h('div', { class: 'recep', html: Art.receptionist() }));
    el.appendChild(h('div', { class: 'body' },
      h('div', { class: 'dec' },
        h('div', { class: 'dec-right' },
          h('div', { class: 'q-head' },
            h('div', { class: 'page-title' }, 'Keputusan awal'),
            h('div', { class: 'q-text' }, K.soal.text)),
          buttons.map(function (b) { return b.btn; })))));
    el.appendChild(cand);
    el.appendChild(fbBox);                                   // umpan balik muncul di dekat Navi

    /* Bila layer dibuka kembali setelah pernah memilih: tampilkan hasilnya */
    if (done) {
      var prev = K.opsi.filter(function (o) { return o.tier === done; })[0];
      buttons.forEach(function (b) { b.btn.disabled = true; if (b.o.tier !== done) b.btn.classList.add('dim'); else mark(b.o, b.btn); });
      feedback(prev); ctx.enableNext();
    } else {
      ctx.after(700, function () { ctx.narrate(K.soal.text, { file: K.soal.file }); });
    }
  }

  /* ------------------------------------------------ Layer 4 : Misi dan Trust Meter */
  function layer4(ctx) {
    var el = ctx.el; el.classList.add('pattern', 's02');
    MN.Bg.photo('lobi', 'soft');
    var M = T.misi;
    var tip = h('div', { class: 'bubble tip', hidden: true }, M.petunjuk);
    var naviBtn = h('div', { class: 'navi-btn' },
      h('button', { type: 'button', html: Art.mascot('exp_berpikir', '', '') + 'Petunjuk Navi' }), tip);
    naviBtn.querySelector('button').addEventListener('click', function () { A.sfx('click'); tip.hidden = !tip.hidden; });

    var chips = M.chip.map(function (c) { return h('div', { class: 'chip ' + c.c, html: '<b>' + c.v + '</b>' + c.t }); });
    var bar = h('i');
    var val = h('b', null, '50');
    var map = M.peta.map(function (n, i) {
      return h('div', { class: 'mm' + (i > 2 ? ' lock' : ''), html: '<div class="d">' + (i + 1) + '</div>' + n });
    });

    el.appendChild(h('div', { class: 'body' },
      h('div', { class: 'mission' },
        h('div', { class: 'm-banner' },
          h('div', { class: 'av', html: '<img src="' + Art.mascotSrc('exp_percaya_diri') + '" alt="Navi">' }),
          h('div', { html: '<small>Misimu</small><h2>' + M.judul + '</h2>' }),
          naviBtn),
        h('div', { class: 'm-row' },
          h('div', { class: 'card m-meter' },
            h('h3', null, 'Contoh Trust Meter (mulai dari 50)'),
            h('div', { class: 'demo-bar' }, bar),
            h('div', { class: 'demo-val' }, h('span', null, 'Kepercayaan HRD'), val),
            h('div', { class: 'chips' }, chips)),
          h('div', { class: 'card m-map' },
            h('h3', null, 'Peta perjalananmu: lima modul'),
            h('div', { class: 'mini-map' }, map))))));

    /* Animasi contoh Trust Meter: +10, -5, -10 */
    function setDemo(v, i) {
      bar.style.width = v + '%'; val.textContent = v;
      bar.className = v >= 60 ? 'hi' : v < 45 ? 'lo' : '';
      if (i != null) { chips.forEach(function (c, k) { c.classList.toggle('on', k === i); }); A.sfx(i === 0 ? 'meter' : 'meterDown'); }
    }
    setDemo(50);
    ctx.after(1500, function () { setDemo(60, 0); });
    ctx.after(3100, function () { setDemo(55, 1); });
    ctx.after(4700, function () { setDemo(45, 2); });
    ctx.after(6300, function () { chips.forEach(function (c) { c.classList.add('on'); }); setDemo(50); });

    ctx.after(600, async function () {
      await ctx.narrate(M.narasi.text, { file: M.narasi.file });
      if (!ctx.alive()) return;
      ctx.enableNext(true, 'Mulai Misi');
    });
  }

  MN.defineScene({
    id: 'S02', title: 'Onboarding', home: false,
    steps: [
      { id: 'mindset', gated: true, enter: layer1 },
      { id: 'penilaian', gated: true, enter: layer2 },
      { id: 'keputusan', gated: true, enter: layer3 },
      { id: 'misi', gated: true, nextLabel: 'Mulai Misi', nextScene: 'S03', enter: layer4 }
    ]
  });
})();
