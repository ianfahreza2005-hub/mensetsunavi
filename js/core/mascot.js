/* ==========================================================================
   mascot.js : maskot Navi yang "hidup" (idle animation + ganti pose halus)
   Aset maskot berupa PNG utuh, jadi gerakannya aman: napas (skala vertikal sangat kecil),
   goyang ringan (rotasi < 1 derajat), anggukan sesekali pada jeda acak, serta pergantian
   pose/ekspresi dengan crossfade. Bagian tubuh tidak dipisah agar anatomi tidak rusak.

   Pemakaian:
     var m = MN.Mascot.create({ pose: 'pose_melambai', cls: 'mx-l1', alt: 'Navi' });
     parent.appendChild(m);      // ukuran & posisi diatur lewat CSS pada kelas cls
     m.set('pose_berdiri');      // crossfade ke pose lain
   ========================================================================== */
(function () {
  'use strict';
  var MN = (window.MN = window.MN || {});
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function img(key, alt) {
    var i = document.createElement('img');
    i.className = 'mascot mx-img';
    i.src = MN.Art.mascotSrc(key); i.alt = alt || ''; i.draggable = false;
    return i;
  }

  function create(o) {
    o = o || {};
    var root = document.createElement('div');
    root.className = 'mx' + (o.cls ? ' ' + o.cls : '') + (o.idle === false ? '' : ' idle');
    var sway = document.createElement('div'); sway.className = 'mx-sway';
    var body = document.createElement('div'); body.className = 'mx-body';
    sway.appendChild(body); root.appendChild(sway);
    var cur = img(o.pose, o.alt); cur.classList.add('in');
    body.appendChild(cur);
    var curKey = o.pose, timers = [];

    root.set = function (key, alt) {
      if (key === curKey) return;
      curKey = key;
      var next = img(key, alt != null ? alt : cur.alt), old = cur;
      cur = next;
      body.appendChild(next);
      void next.offsetWidth;
      next.classList.add('in');
      old.classList.remove('in');
      setTimeout(function () { if (old.parentNode) old.remove(); }, reduce ? 0 : 520);
    };
    root.key = function () { return curKey; };

    /* Anggukan kecil pada jeda acak (5-10 detik); berhenti sendiri bila elemen sudah dilepas dari halaman */
    if (o.idle !== false && !reduce) {
      (function loop() {
        var t = setTimeout(function () {
          if (!root.isConnected) { if (root.__seen) return; return loop(); }
          root.__seen = true;
          root.classList.remove('nod'); void root.offsetWidth; root.classList.add('nod');
          loop();
        }, 5000 + Math.random() * 5000);
        timers.push(t);
      })();
      var watch = setInterval(function () {
        if (root.__seen && !root.isConnected) { timers.forEach(clearTimeout); clearInterval(watch); }
      }, 4000);
    }
    return root;
  }

  MN.Mascot = { create: create };
})();
