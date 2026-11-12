/* S03 : Menu Utama (hub non-linear berbentuk peta jalan menuju kantor)
   - Modul 1-3 aktif, urutan bebas. Modul 4 terkunci sampai Modul 1-3 selesai.
   - Modul 5 terbuka setelah Modul 4 selesai.
   - Progres, stempel, dan Trust Meter selalu terlihat. */
(function () {
  'use strict';
  var MN = window.MN, T = MN.Text.S03, A = MN.Audio, Art = MN.Art, UI = MN.UI, h = UI.h, S = MN.State;

  /* Peta = ilustrasi lanskap (assets/bg/peta.webp) yang mengisi area 1010 x 720 di kiri panel.
     Setiap titik modul diletakkan tepat di atas "lapangan" pasir di tepi jalan setapak, berurutan
     mengikuti jalan dari stasiun (START) ke kantor (KANTOR).
     x, y  = pusat lapangan (px panggung)   sc = skala perspektif (makin jauh makin kecil)
     lab   = posisi label: d (bawah), u (atas), l (kiri), r (kanan) */
  var POS = [
    { x: 563, y: 488, sc: 1, lab: 'l' },
    { x: 880, y: 405, sc: .92, lab: 'd' },
    { x: 297, y: 348, sc: .85, lab: 'l' },
    { x: 535, y: 302, sc: .8, lab: 'r' },
    { x: 823, y: 305, sc: .8, lab: 'r' }
  ];
  /* Garis tengah jalan setapak (px panggung), dari stasiun (indeks 0) ke pintu kantor (indeks terakhir).
     Navi berjalan menyusuri titik-titik ini. ANCHOR = indeks tempat Navi berdiri di samping tiap modul. */
  var WAY = [[290, 598], [330, 590], [420, 574], [520, 546], [565, 535], [620, 520], [720, 490], [805, 468], [825, 438],
    [780, 397], [680, 385], [560, 375], [450, 368], [372, 358], [355, 342], [375, 322], [460, 313], [540, 312], [600, 309],
    [680, 305], [760, 296], [775, 288], [735, 268], [680, 260], [690, 242], [710, 230], [760, 222], [800, 218]];
  var ANCHOR = { start: 0, 1: 5, 2: 9, 3: 14, 4: 16, 5: 21 };
  var MOD_KEYS = ['M1', 'M2', 'M3', 'M4'];

  /* Navi di peta: berdiri di posisi terakhir, berjalan menyusuri jalan saat progres bertambah / modul dipilih.
     Gerak dibuat halus & hidup:
     - jalur = kurva Catmull-Rom melalui WAY (tikungan membulat), disampel rapat lalu ditempuh dengan
       kecepatan tetap + percepatan di awal dan perlambatan di akhir;
     - siklus langkah mengikuti jarak tempuh (naik-turun, ayun kiri-kanan, squash saat kaki menapak, debu kecil);
     - badan condong ke arah jalan, berbalik arah secara halus;
     - ancang-ancang sebelum berjalan, mendarat lembut saat tiba, lompatan bersorak, dan gerak iseng saat diam. */
  var SUB = 10;                                              // sampel per ruas jalan
  var CURVE = (function () {
    var pts = [], n = WAY.length;
    for (var i = 0; i < n - 1; i++) {
      var p0 = WAY[Math.max(0, i - 1)], p1 = WAY[i], p2 = WAY[i + 1], p3 = WAY[Math.min(n - 1, i + 2)];
      for (var j = 0; j < SUB; j++) {
        var t = j / SUB, t2 = t * t, t3 = t2 * t;
        pts.push([0, 1].map(function (c) {
          return .5 * (2 * p1[c] + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3);
        }));
      }
    }
    pts.push(WAY[n - 1].slice());
    var len = [0];
    for (i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return { pts: pts, len: len };
  })();
  function pointAt(dist) {                                   // titik pada kurva di jarak tempuh tertentu
    var L = CURVE.len, P = CURVE.pts, lo = 0, hi = L.length - 1;
    dist = Math.max(0, Math.min(L[hi], dist));
    while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (L[mid] < dist) lo = mid; else hi = mid; }
    var f = (dist - L[lo]) / ((L[hi] - L[lo]) || 1);
    return [P[lo][0] + (P[hi][0] - P[lo][0]) * f, P[lo][1] + (P[hi][1] - P[lo][1]) * f];
  }

  function mapNavi(wrap) {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var root = h('div', { class: 'map-navi' });
    var inner = h('div', { class: 'mn-inner' });
    var body = h('div', { class: 'mn-body' });
    var idle = MN.Mascot.create({ pose: 'pose_berdiri', cls: 'mn-idle', alt: 'Navi di peta' });
    var walk = h('img', { class: 'mascot mn-walk', src: Art.mascotSrc('pose_berlari'), alt: '', draggable: 'false' });
    body.appendChild(idle); body.appendChild(walk); inner.appendChild(body); root.appendChild(inner); wrap.appendChild(root);
    var at = 0, pos = 0, busy = false, face = 1, faceTarget = 1, idleTimer = null;

    function scaleAt(y) { return .62 + Math.max(0, Math.min(1, (y - 218) / 380)) * .42; }
    function place(p) {
      root.style.left = p[0].toFixed(1) + 'px'; root.style.top = p[1].toFixed(1) + 'px';
      root.style.setProperty('--ns', scaleAt(p[1]).toFixed(3));
      root.style.zIndex = p[1] > 470 ? 4 : 1;               // di depan titik saat berada di jalan bagian bawah
    }
    function dist(i) { return CURVE.len[i * SUB]; }
    function jumpTo(i) { at = i; pos = dist(i); place(pointAt(pos)); }
    function play(cls, ms) {                                  // animasi sekali pakai (kelas CSS)
      root.classList.remove(cls); void root.offsetWidth; root.classList.add(cls);
      setTimeout(function () { root.classList.remove(cls); }, ms);
    }
    function puff(p) {                                        // debu kecil saat kaki menapak
      var e = h('i', { class: 'mn-puff', style: { left: p[0] + 'px', top: p[1] + 'px' } });
      e.style.setProperty('--ns', scaleAt(p[1]).toFixed(3));
      wrap.appendChild(e); setTimeout(function () { e.remove(); }, 650);
    }

    /* berjalan ke titik jalan indeks i; speed = px/detik pada kecepatan penuh */
    function walkTo(i, speed, done) {
      if (busy) return;
      var from = pos, to = dist(i), D = Math.abs(to - from), dir = to > from ? 1 : -1;
      if (D < 2 || reduce) { jumpTo(i); if (done) done(); return; }
      busy = true; stopIdle();
      var acc = .35, dec = .45;                               // detik untuk percepatan / perlambatan
      var T = D / speed + (acc + dec) / 2;
      if (T > 3.2) { speed = D / (3.2 - (acc + dec) / 2); T = 3.2; }
      var cruise = T - acc - dec, t0 = null, stride = 30, lastStep = 0;
      function travelled(t) {                                 // profil kecepatan trapesium (halus di awal & akhir)
        if (t < acc) return speed * t * t / (2 * acc);
        if (t < acc + cruise) return speed * acc / 2 + speed * (t - acc);
        var r = Math.min(dec, t - acc - cruise);
        return speed * acc / 2 + speed * cruise + speed * (r - r * r / (2 * dec));
      }
      play('mn-prep', 220);                                   // ancang-ancang
      setTimeout(function () {
        if (!root.isConnected) return;
        root.classList.add('walking');
        requestAnimationFrame(frame);
      }, 160);
      function frame(ts) {
        if (!root.isConnected) return;
        if (t0 === null) t0 = ts;
        var t = Math.min(T, (ts - t0) / 1000), s = Math.min(D, travelled(t));
        pos = from + dir * s;
        var p = pointAt(pos), ahead = pointAt(pos + dir * 6);
        place(p);
        if (Math.abs(ahead[0] - p[0]) > .3) faceTarget = ahead[0] < p[0] ? -1 : 1;
        face += (faceTarget - face) * .18;                    // berbalik arah secara halus
        var sc = scaleAt(p[1]), phase = s / (stride * sc), sw = Math.sin(Math.PI * phase), up = Math.abs(sw);
        var spd = Math.min(1, (travelled(Math.min(T, t + .016)) - s) / (speed * .016 || 1));   // 0..1 kecepatan relatif
        walk.style.transform = 'translateX(-50%) translateY(' + (-7 * up * spd).toFixed(2) + 'px) rotate(' + (4 * sw * spd + 3 * faceTarget * spd).toFixed(2) + 'deg) scale(' +
          (face * (1 + .035 * (1 - up) * spd)).toFixed(3) + ',' + (1 - .045 * (1 - up) * spd).toFixed(3) + ')';
        root.style.setProperty('--lift', (up * spd).toFixed(3));
        if (Math.floor(phase) > lastStep) { lastStep = Math.floor(phase); if (spd > .4) puff(p); }
        if (t < T) requestAnimationFrame(frame);
        else {
          busy = false; at = i; pos = to;
          root.classList.remove('walking'); walk.style.transform = '';
          root.style.setProperty('--lift', 0);
          play('mn-land', 420);                               // mendarat lembut
          startIdle();
          if (done) done();
        }
      }
    }
    function pose(key, ms) {
      idle.set(key);
      if (ms) setTimeout(function () { if (root.isConnected && !busy) idle.set('pose_berdiri'); }, ms);
    }
    function cheer() { pose('pose_melompat', 1400); play('mn-cheer', 760); }

    /* gerak iseng saat diam: melambai, jempol, atau lompat kecil secara acak */
    function stopIdle() { clearTimeout(idleTimer); }
    function startIdle() {
      stopIdle();
      if (reduce) return;
      idleTimer = setTimeout(function () {
        if (!root.isConnected) return;
        if (!busy && idle.key() === 'pose_berdiri') {
          var r = Math.random();
          if (r < .4) pose('pose_melambai', 1600);
          else if (r < .7) { pose('pose_jempol', 1400); play('mn-hop', 520); }
          else play('mn-hop', 520);
        }
        startIdle();
      }, 6000 + Math.random() * 5000);
    }
    startIdle();
    return { jumpTo: jumpTo, walkTo: walkTo, pose: pose, cheer: cheer, busy: function () { return busy; } };
  }

  var STAMP_KANJI = ['声', '礼', '誠', '合'];   // suara, etiket, ketulusan, lulus

  function isUnlocked(n) {
    if (n <= 3) return true;
    if (n === 4) return S.coreDone();
    return !!S.data.done.M4;
  }
  function suggestion() {
    var d = S.data.done;
    if (!S.coreDone()) {
      var first = ['M1', 'M2', 'M3'].map(function (k, i) { return d[k] ? 0 : i + 1; }).filter(Boolean)[0];
      return T.saran.awal.replace('{n}', first);
    }
    if (!d.M4) return T.saran.m4;
    return T.saran.m5;
  }
  function nextModule() {
    var d = S.data.done;
    if (!S.coreDone()) return ['M1', 'M2', 'M3'].map(function (k, i) { return d[k] ? 0 : i + 1; }).filter(Boolean)[0];
    return d.M4 ? 5 : 4;
  }

  function enter(ctx) {
    var el = ctx.el; el.classList.add('s03');
    var d = S.data;

    el.appendChild(h('div', { class: 'map-wrap', html:
      '<div class="map-art" role="img" aria-label="Peta perjalanan: jalan setapak dari stasiun menuju kantor, dengan Gunung Fuji, sakura, dan torii"></div>' +
      '<div class="map-tag start">START</div><div class="map-tag goal">KANTOR</div>' }));

    var next = nextModule();
    var nodeEls = {};
    var guide = h('div', { class: 'bubble' }, suggestion());
    /* pose Navi mengikuti progres: menunjuk -> semangat (Modul 4 terbuka) -> jempol (Modul 4 selesai) */
    function poseNow() { return !S.coreDone() ? 'pose_menunjuk' : (S.data.done.M4 ? 'pose_jempol' : 'pose_semangat'); }
    var navi = MN.Mascot.create({ pose: poseNow(), alt: 'Navi' });
    var naviBox = h('div', { class: 'navi-suggest' }, h('div', { class: 'nv-win' }, navi), guide);

    T.modul.forEach(function (m, i) {
      var p = POS[i], unlocked = isUnlocked(m.n), done = m.n <= 4 && d.done[m.key];
      var cls = 'node lab-' + p.lab + (!unlocked ? ' locked' : '') + (done ? ' done' : '') + (unlocked && !done && m.n === next ? ' next' : '') + (p.x > 700 || p.lab === 'r' ? ' flip-tip' : '');
      var node = h('div', { class: cls, style: { left: p.x + 'px', top: p.y + 'px' } });
      node.style.setProperty('--sc', p.sc);
      var btn = h('button', { type: 'button', 'aria-label': 'Modul ' + m.n + ': ' + m.judul + (unlocked ? '' : ' (terkunci)'), html: unlocked ? (done ? Art.icon('check', 40) : String(m.n)) : Art.icon('lock', 34) });
      node.appendChild(btn);
      node.appendChild(h('div', { class: 'lab', html: '<b>Modul ' + m.n + '</b><span>' + m.judul + '</span>' }));
      node.appendChild(h('div', { class: 'tip', html: '<b>Modul ' + m.n + ': ' + m.judul + '</b><i>Durasi ' + m.durasi + '</i>' + (unlocked ? '' : '<br>Terkunci') }));
      btn.addEventListener('click', function () { openModule(m, node); });
      nodeEls[m.n] = node;
      el.querySelector('.map-wrap').appendChild(node);
    });
    el.appendChild(naviBox);

    /* Navi di peta: mulai dari posisi tersimpan (awal: stasiun) */
    var walker = mapNavi(el.querySelector('.map-wrap'));
    if (d.naviAt == null) d.naviAt = ANCHOR.start;
    if (!d.naviSeen) d.naviSeen = MOD_KEYS.filter(function (k) { return d.done[k]; });   // progres lama dianggap sudah dilihat
    walker.jumpTo(d.naviAt);

    /* Kolom stempel + progres */
    var slots = [1, 2, 3, 4].map(function (n) {
      var key = 'M' + n, filled = d.done[key];
      return h('div', { class: 'slot' + (filled ? ' filled' : ''), 'data-m': key, html: '<div class="ink">' + STAMP_KANJI[n - 1] + '</div><small>Modul ' + n + '</small>' });
    });
    var pct = Math.round(S.doneCount() / 4 * 100);
    el.appendChild(h('aside', { class: 'rail' },
      h('div', { class: 'menu-title', html: '<div class="page-title">Menu Utama</div><h2>Peta Menuju Kantor</h2>' }),
      h('h3', null, 'Progres belajar'),
      h('div', { class: 'prog' }, h('i', { style: { width: pct + '%' } })),
      h('div', { class: 'prog-txt' }, S.doneCount() + ' dari 4 modul selesai'),
      h('h3', { style: { marginTop: '10px' } }, 'Stempel'),
      h('div', { class: 'stamps' }, slots),
      h('div', { class: 'rail-trust' }, 'Trust Meter ada di kiri atas. Pilihan yang sopan dan jujur akan menaikkannya.')));

    function say(text, warn) {
      guide.textContent = text; guide.classList.toggle('warn', !!warn);
      navi.set(warn ? 'pose_menyilang' : poseNow());
    }

    function openModule(m, node) {
      A.init(); A.sfx('click');
      if (!isUnlocked(m.n)) {
        A.sfx('locked');
        node.classList.remove('shake'); void node.offsetWidth; node.classList.add('shake');
        say(m.n === 4 ? T.terkunci4 : T.terkunci5, true);
        walker.pose('pose_menyilang', 1600);
        ctx.narrate(m.n === 4 ? T.terkunci4 : T.terkunci5, { speaker: 'Navi' });
        ctx.after(3200, function () { say(suggestion()); });
        return;
      }
      if (walker.busy()) return;
      /* Navi berjalan ke modul yang dipilih, lalu modul dibuka */
      d.naviAt = ANCHOR[m.n]; S.save();
      walker.walkTo(ANCHOR[m.n], 460, function () {
        walker.pose('pose_semangat');
        ctx.after(350, function () { ctx.goScene(m.to); });
      });
    }

    /* Animasi stempel baru dan gembok terbuka */
    var delay = 700;
    ['M1', 'M2', 'M3', 'M4'].forEach(function (k, i) {
      if (d.done[k] && !d.stampSeen[k]) {
        d.stampSeen[k] = true; S.save();
        var slot = slots[i];
        slot.classList.remove('filled');
        ctx.after(delay, function () { slot.classList.add('filled', 'stamping'); A.sfx('stamp'); });
        delay += 800;
      }
    });
    if (S.coreDone() && !d.unlockSeen) {
      d.unlockSeen = true; S.save();
      var n4 = nodeEls[4]; n4.classList.add('locked');
      n4.querySelector('button').innerHTML = Art.icon('lock', 34);
      ctx.after(delay + 200, function () {
        n4.classList.remove('locked'); n4.classList.add('unlock-anim', 'next');
        n4.querySelector('button').innerHTML = '4';
        A.sfx('unlock'); say(T.saran.m4);
      });
    }

    /* Langkah demi langkah: untuk setiap modul yang baru selesai, Navi berjalan ke titik modul itu lalu bersorak */
    var fresh = MOD_KEYS.filter(function (k) { return d.done[k] && d.naviSeen.indexOf(k) < 0; });
    (function nextWalk() {
      var k = fresh.shift();
      if (!k) { S.save(); return; }
      var n = +k.slice(1);
      ctx.after(900, function () {
        walker.walkTo(ANCHOR[n], 240, function () {
          d.naviAt = ANCHOR[n]; d.naviSeen.push(k); S.save();
          walker.cheer(); A.sfx('correct');
          ctx.after(900, nextWalk);
        });
      });
    })();

    /* Narasi pembuka hanya saat menu pertama kali dibuka */
    if (!d.menuIntroSeen) {
      d.menuIntroSeen = true; S.save();
      ctx.after(800, function () { ctx.narrate(T.narasi.text, { file: T.narasi.file }); });
    }
  }

  MN.defineScene({
    id: 'S03', title: 'Menu Utama', bare: true, home: false,
    onEnter: function () { UI.showTrust(S.data.trustShown); MN.Bg.photo(null); },
    steps: [{ id: 'menu', enter: enter }]
  });
})();
