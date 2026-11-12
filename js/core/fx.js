/* ==========================================================================
   fx.js : efek transisi sinematik
   sakuraWipe(onMid): kelopak sakura bertiup dari kanan ke kiri, disertai pita cahaya krem-merah muda
   yang menyapu layar. Pita bersifat lembut (tembus pandang di tepinya) sehingga transisi scene
   (app.js + style.css) tetap terlihat berjalan di baliknya; onMid() dipanggil saat pita
   mendekati tengah layar. Arah kanan -> kiri sama dengan geser slide Lanjut.
   bgKick(dir, soft): lapisan latar bergeser sesaat dengan kedalaman berbeda (parallax) ketika
   layar berganti, lalu kembali ke posisi semula.
   Memakai Web Animations API / CSS (transform, translate, opacity saja) agar ringan.
   ========================================================================== */
(function () {
  'use strict';
  var MN = (window.MN = window.MN || {});
  var busy = false;
  var EASE = 'cubic-bezier(.65,0,.35,1)';

  function reduced() { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function mk(cls, css) { var e = document.createElement('i'); e.className = cls; if (css) e.style.cssText = css; return e; }

  MN.Fx = {
    bgKick: function (dir, soft) {
      var bg = document.getElementById('bg');
      if (!bg || reduced()) return;
      bg.style.setProperty('--dir', dir < 0 ? -1 : 1);
      bg.style.setProperty('--ks', soft ? .4 : 1);
      bg.classList.remove('kick'); void bg.offsetWidth; bg.classList.add('kick');
    },
    sakuraWipe: function (onMid) {
      if (busy) return; busy = true;
      var stage = document.getElementById('stage');
      if (reduced() || !stage || !stage.animate) { onMid(); busy = false; return; }
      MN.Audio.sfx('swoosh');

      var box = document.createElement('div'); box.id = 'fx'; stage.appendChild(box);
      var wash = mk('fx-wash'); box.appendChild(wash);

      /* kelopak: tiap kelopak punya ketinggian, ukuran, dan waktu berangkat sendiri */
      var N = 34, i;
      for (i = 0; i < N; i++) {
        var s = 14 + Math.random() * 18, y = Math.random() * 700 - 20, d = Math.random() * 450;
        var p = mk('fx-petal', 'width:' + s + 'px;height:' + (s * .8) + 'px;left:1290px;top:' + y + 'px');
        box.appendChild(p);
        var dy = 120 + Math.random() * 160, rot = 360 + Math.random() * 360;
        p.animate([
          { transform: 'translate3d(0,0,0) rotate(0deg)', opacity: 0 },
          { opacity: 1, offset: .12 },
          { transform: 'translate3d(' + (-760) + 'px,' + (dy * .3 * (i % 2 ? 1 : -1)) + 'px,0) rotate(' + (rot * .5) + 'deg)', offset: .55 },
          { transform: 'translate3d(' + (-1500 - Math.random() * 200) + 'px,' + dy + 'px,0) rotate(' + rot + 'deg)', opacity: 1 }
        ], { duration: 1500 + Math.random() * 400, delay: d, easing: 'ease-in-out', fill: 'both' });
      }

      /* pita cahaya: menyapu kanan -> kiri; scene berganti saat pita mendekati tengah */
      wash.animate([{ transform: 'translateX(105%)' }, { transform: 'translateX(-105%)' }],
        { duration: 1300, delay: 200, easing: EASE, fill: 'both' });
      setTimeout(function () { try { onMid(); } catch (e) { console.error(e); } }, 620);
      setTimeout(function () { box.style.pointerEvents = 'none'; }, 1100);
      setTimeout(function () { box.remove(); busy = false; }, 2500);
    }
  };
})();
