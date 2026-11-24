/* Mensetsu Navi — gerak antarmuka v3 (gaya: kalem, halus, menanggapi setiap interaksi).
   - Masuk layar: isi muncul bertahap (.rv + --i), judul slide terisi warna dari kiri (.rv-h).
   - Angka skor menghitung naik (.big-num, .score-ring span).
   - Kursor: kartu/pilihan disorot cahaya lembut yang mengikuti kursor (.sorot, --mx/--my). Hanya di perangkat ber-mouse.
   - Sentuh/klik: riak dari titik sentuh di tombol dan pilihan (.rip).
   Semua dimatikan bila pengguna meminta gerak dikurangi. Hanya transform/opacity, aman untuk HP kelas bawah.
   Tidak mengubah app.js: dipicu dari hashchange dan muat awal, setelah app.js selesai merender. */
(function () {
  var kurang = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)');
  var mouse = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)');
  function diam() { return (kurang && kurang.matches) || document.documentElement.classList.contains('gerak-kurang'); }

  /* ---------- masuk layar ---------- */
  var DAFTAR = '.body > *, .cover-body > *, .opts > *, .lessons > li, .items > li, .km-list > *, .kv-list > *, .lt-grid > *, .grid2 > *, .stamps > *';
  function masuk() {
    if (diam()) return;
    var view = document.getElementById('view'); if (!view) return;
    var dg = document.documentElement.getAttribute('data-geser'), n = 0, geser = !!dg && dg !== 'pudar';   /* saat pindah slide bergeser: isi tidak dimunculkan bertahap lagi */
    Array.prototype.forEach.call(view.querySelectorAll(DAFTAR), function (el) {
      if (geser || n > 18 || el.classList.contains('rv')) return;
      var r = el.getBoundingClientRect();
      if (r.top > innerHeight + 40 || r.height === 0) return;          /* di luar layar: tidak perlu dianimasikan */
      if (getComputedStyle(el).animationName !== 'none') return;     /* elemen yang sudah punya animasi sendiri */
      el.style.setProperty('--i', n++);
      el.classList.add('rv');
      el.addEventListener('animationend', function h(e) { if (e.target === el) { el.classList.remove('rv'); el.removeEventListener('animationend', h); } });
    });
    Array.prototype.forEach.call(view.querySelectorAll('.slide-h, .hero h1'), function (h) {
      h.classList.add('rv-h');
      h.addEventListener('animationend', function f() { h.classList.remove('rv-h'); h.removeEventListener('animationend', f); });
    });
    Array.prototype.forEach.call(view.querySelectorAll('.big-num, .score-ring span'), hitung);
  }

  /* ---------- angka menghitung naik ---------- */
  function hitung(el) {
    var t = el.textContent.trim(), m = t.match(/^(\d{1,3})(\D{0,2})$/);
    if (!m || el.dataset.hit) return;
    var akhir = +m[1], akhiran = m[2], mulai = null, lama = 900 + akhir * 4;
    el.dataset.hit = '1';
    function langkah(ts) {
      if (!mulai) mulai = ts;
      var p = Math.min(1, (ts - mulai) / lama), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(akhir * e) + akhiran;
      if (p < 1) requestAnimationFrame(langkah);
    }
    requestAnimationFrame(langkah);
  }

  /* dipanggil app.js show() setelah layar baru terpasang; pemuatan pertama dipicu di sini (app.js sudah merender lebih dulu) */
  function jadwal() { requestAnimationFrame(masuk); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', jadwal); else jadwal();

  /* ---------- sorot cahaya mengikuti kursor ---------- */
  var SOROT = '.card, .opt, .lessons li, .km-card, .kv-card, .lt-mode, .tp-card';
  var aktif = null, antri = null, jalan = false;
  document.addEventListener('pointermove', function (e) {
    if (!mouse || !mouse.matches || diam() || e.pointerType !== 'mouse') return;
    antri = e;
    if (jalan) return;
    jalan = true;
    requestAnimationFrame(function () {
      var ev = antri; antri = null; jalan = false; if (!ev) return;
      var el = ev.target.closest ? ev.target.closest(SOROT) : null;
      if (aktif && aktif !== el) aktif.classList.remove('sorot');
      aktif = el;
      if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (ev.clientX - r.left) + 'px');
      el.style.setProperty('--my', (ev.clientY - r.top) + 'px');
      el.classList.add('sorot');
    });
  }, { passive: true });
  document.addEventListener('pointerleave', function () { if (aktif) aktif.classList.remove('sorot'); aktif = null; });

  /* ---------- riak di titik sentuh ---------- */
  document.addEventListener('pointerdown', function (e) {
    if (diam()) return;
    var el = e.target.closest ? e.target.closest('.btn, .opt') : null;
    if (!el || el.disabled) return;
    var r = el.getBoundingClientRect(), s = document.createElement('span');
    s.className = 'rip';
    s.style.left = (e.clientX - r.left) + 'px'; s.style.top = (e.clientY - r.top) + 'px';
    s.style.setProperty('--rs', Math.ceil(Math.hypot(r.width, r.height) / 5));
    el.appendChild(s);
    setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 650);
  }, { passive: true });

  /* paralaks lembut di sampul bab dan pita bab: --px/--py (−0,5…0,5) mengikuti kursor */
  document.addEventListener('pointermove', function (e) {
    if (!mouse || !mouse.matches || diam() || e.pointerType !== 'mouse' || !e.target.closest) return;
    var el = e.target.closest('.cover-hero, .pita'); if (!el) return;
    var r = el.getBoundingClientRect();
    el.style.setProperty('--px', ((e.clientX - r.left) / r.width - .5).toFixed(3));
    el.style.setProperty('--py', ((e.clientY - r.top) / r.height - .5).toFixed(3));
  }, { passive: true });

  window.MN_GERAK = { masuk: masuk, jadwal: jadwal };
})();
