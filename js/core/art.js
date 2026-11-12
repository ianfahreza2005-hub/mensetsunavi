/* ==========================================================================
   art.js : ilustrasi (maskot Navi dari character sheet resmi, ikon, ilustrasi panel)
   - Maskot : file PNG transparan di assets/mascot/ (dipotong dari character sheet,
              satu pose/ekspresi per file; TIDAK memakai sheet utuh).
              exp_*  = ekspresi wajah (setengah badan)   pose_* = pose & gestur (seluruh badan)
              act_*  = aktivitas sehari-hari             turn_* = turnaround (resolusi tinggi)
   - Ilustrasi panel (stasiun, lobi) dibuat dengan SVG memakai palet resmi.
   ========================================================================== */
(function () {
  'use strict';
  var MN = (window.MN = window.MN || {});
  var INK = '#0B3C41', TEAL = '#1D9999', TEALD = '#0E6B6D', SKY = '#9CCCD6', CREAM = '#FEE893', RED = '#BA1502', VERM = '#FF482C';
  var DIR = 'assets/mascot/';

  function rng(seed) {
    var s = seed;
    return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }

  /* ---------- Deret gedung (deterministik, tidak acak tiap muat) ---------- */
  function skyline(o) {
    var r = rng(o.seed || 7), x = -20, out = '';
    var w = o.w || 1280, base = o.base || 600, min = o.min || 80, max = o.max || 260;
    var bw = o.bw || [50, 110];
    while (x < w) {
      var bwid = bw[0] + r() * (bw[1] - bw[0]);
      var bh = min + r() * (max - min), y = base - bh;
      out += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bwid.toFixed(1) + '" height="' + (bh + 4).toFixed(1) + '" fill="' + o.color + '"/>';
      if (o.windows) {
        for (var wy = y + 14; wy < base - 12; wy += 22) {
          for (var wx = x + 8; wx < x + bwid - 10; wx += 18) {
            if (r() > 0.6) out += '<rect x="' + wx.toFixed(1) + '" y="' + wy.toFixed(1) + '" width="8" height="11" rx="1.5" fill="' + (o.winColor || CREAM) + '" opacity=".8"/>';
          }
        }
      }
      x += bwid + r() * 8;
    }
    return out;
  }

  /* ---------- Maskot ---------- */
  function mascot(key, cls, alt) {
    return '<img class="mascot ' + (cls || '') + '" src="' + DIR + key + '.png" alt="' + (alt || '') + '" draggable="false">';
  }
  function mascotSrc(key) { return DIR + key + '.png'; }
  /* Kompatibilitas: dulu Navi berupa SVG dengan "mood". Sekarang dipetakan ke ekspresi maskot. */
  var MOOD = { happy: 'exp_senang', think: 'exp_berpikir', sad: 'exp_sedih', wink: 'exp_percaya_diri', calm: 'exp_netral', laugh: 'exp_tertawa' };
  function naviSvg(mood, cls) { return mascot(MOOD[mood] || 'exp_senang', 'navi ' + (cls || '').replace(/^navi\s*/, '')); }

  /* ---------- Ikon garis sederhana (24x24) ---------- */
  var ICONS = {
    home: '<path d="M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 114.2 1.8c-1 .9-1.8 1.3-1.8 2.7"/><circle cx="12" cy="17.3" r=".6"/>',
    soundOn: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 8.5a5 5 0 010 7"/><path d="M18.5 6a8.5 8.5 0 010 12"/>',
    soundOff: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 9.5l5 5M21.5 9.5l-5 5"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
    check: '<path d="M5 13l4 4 10-10"/>',
    cross: '<path d="M6 6l12 12M18 6L6 18"/>',
    book: '<path d="M4 5h6a2 2 0 012 2v12a2 2 0 00-2-2H4zM20 5h-6a2 2 0 00-2 2v12a2 2 0 012-2h6z"/>',
    heart: '<path d="M12 20s-7-4.5-9-9a5 5 0 019-3 5 5 0 019 3c-2 4.5-9 9-9 9z"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5L15.5 10"/>',
    flag: '<path d="M5 21V4"/><path d="M5 4h12l-2.5 4L17 12H5"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>',
    handshake: '<path d="M3 12l4-4 4 2 3-2 4 3 3-1M7 8v8l4 3 3-2"/>',
    door: '<rect x="6" y="3" width="12" height="18" rx="1"/><circle cx="15" cy="12" r=".8"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18"/>'
  };
  function icon(name, size) {
    var s = size || 24;
    return '<svg class="ico" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  }

  /* ---------- Bunga sakura kecil (dipakai di panel) ---------- */
  function blossom(x, y, s) {
    var p = '';
    for (var i = 0; i < 5; i++) p += '<ellipse cx="0" cy="-8" rx="5.6" ry="8.2" fill="#FFD9D2" transform="rotate(' + (i * 72) + ')"/>';
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' + p + '<circle r="3" fill="' + CREAM + '"/></g>';
  }

  /* ---------- Resepsionis (ilustrasi sederhana, setengah badan) ----------
     Dipasang di belakang meja resepsionis pada latar lobi (assets/bg/lobi.webp).
     Bagian bawah SVG = garis atas meja, jadi tubuh tampak "tertutup" meja. */
  function receptionist() {
    return '<svg viewBox="-40 0 80 130" xmlns="http://www.w3.org/2000/svg" class="recep-svg" aria-hidden="true">' +
      '<path d="M-34 130 Q-34 84 0 84 Q34 84 34 130Z" fill="' + TEALD + '"/><path d="M-9 84 L0 108 L9 84Z" fill="#fff"/>' +
      '<rect x="-7" y="70" width="14" height="18" fill="#F6D9BC"/>' +
      '<circle cx="0" cy="48" r="30" fill="#F6D9BC"/><path d="M-32 52 Q-36 8 0 8 T32 52 Q24 26 0 26 T-32 52Z" fill="#1E2A33"/><path d="M-32 50 Q-38 76 -26 84 Q-30 64 -26 52Z" fill="#1E2A33"/><path d="M32 50 Q38 76 26 84 Q30 64 26 52Z" fill="#1E2A33"/>' +
      '<circle cx="-11" cy="50" r="3" fill="#1E2A33"/><circle cx="11" cy="50" r="3" fill="#1E2A33"/><path d="M-6 62 Q0 68 6 62" stroke="#8F3A2A" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="-19" cy="60" rx="5" ry="3" fill="#FFB8AE" opacity=".7"/><ellipse cx="19" cy="60" rx="5" ry="3" fill="#FFB8AE" opacity=".7"/></svg>';
  }

  MN.Art = { mascot: mascot, mascotSrc: mascotSrc, naviSvg: naviSvg, icon: icon, receptionist: receptionist, skyline: skyline, blossom: blossom };
})();
