/* ==========================================================================
   bg.js : latar "Japanese Workplace" beranimasi (satu kali dibuat, dipakai semua scene)
   Lapisan (belakang -> depan): langit, matahari, awan, Gunung Fuji, kabut, siluet kota,
   gedung kantor, torii, tanah, ILUSTRASI LOKASI (assets/bg, lewat MN.Bg.photo), lapisan cahaya,
   ranting sakura, kelopak berjatuhan.
   Animasi hanya memakai transform (ringan) dan otomatis mati bila pengguna memilih
   "kurangi gerakan" di perangkatnya. Penempatan per scene diatur di css/style.css
   lewat atribut body[data-scene].
   Warna: Japanese Red #BA1502, Cream #FEE893, Vermilion #FF482C, Teal #1D9999, Sky #9CCCD6
   (+ turunan terang/gelap untuk bayangan dan siluet).
   ========================================================================== */
(function () {
  'use strict';
  var MN = (window.MN = window.MN || {});

  function cloud(cx, cy, s) {
    return '<g transform="translate(' + cx + ' ' + cy + ') scale(' + s + ')">' +
      '<ellipse cx="0" cy="0" rx="74" ry="19"/><ellipse cx="-42" cy="7" rx="46" ry="15"/>' +
      '<ellipse cx="46" cy="8" rx="52" ry="14"/><ellipse cx="-2" cy="-13" rx="40" ry="18"/></g>';
  }
  function cloudRow(list) {
    var a = '';
    [0, 1280].forEach(function (off) {
      list.forEach(function (c) { a += cloud(c[0] + off, c[1], c[2]); });
    });
    return '<svg width="2560" height="300" viewBox="0 0 2560 300" aria-hidden="true">' + a + '</svg>';
  }

  function fuji() {
    return '<svg viewBox="0 0 1280 720" preserveAspectRatio="none" aria-hidden="true">' +
      '<defs><linearGradient id="haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#E6F4F2" stop-opacity=".95"/></linearGradient></defs>' +
      '<path d="M-60 610 C150 565 330 470 468 352 C538 294 588 260 616 246 Q640 237 664 246 C692 260 742 294 812 352 C950 470 1130 565 1340 610 Z" fill="#7FB3C1"/>' +
      '<path d="M640 238 L664 246 C692 260 742 294 812 352 C950 470 1130 565 1340 610 L770 610 C740 470 696 330 640 238 Z" fill="#6A9FB0" opacity=".85"/>' +
      '<path d="M566 274 C585 259 606 249 616 246 Q640 237 664 246 C680 254 702 264 716 276 L702 288 L690 272 L673 298 L657 276 L641 308 L625 278 L609 300 L597 278 L581 292 Z" fill="#F6FBFB"/>' +
      '<path d="M641 308 L657 276 L673 298 L690 272 L702 288 L716 276 C704 300 690 318 676 332 L662 316 L650 340 Z" fill="#CFE6EC" opacity=".8"/>' +
      '<rect x="0" y="470" width="1280" height="150" fill="url(#haze)"/></svg>';
  }

  function torii() {
    return '<svg viewBox="0 0 300 380" aria-hidden="true">' +
      '<path d="M-2 44 Q24 58 150 58 Q276 58 302 44 L298 20 Q268 38 150 38 Q32 38 2 20 Z" fill="#4A0C04"/>' +
      '<rect x="14" y="58" width="272" height="17" fill="#BA1502"/>' +
      '<rect x="138" y="75" width="24" height="40" fill="#8F1002"/>' +
      '<rect x="46" y="75" width="30" height="305" fill="#BA1502"/><rect x="224" y="75" width="30" height="305" fill="#BA1502"/>' +
      '<rect x="66" y="75" width="10" height="305" fill="#8F1002" opacity=".7"/><rect x="244" y="75" width="10" height="305" fill="#8F1002" opacity=".7"/>' +
      '<rect x="26" y="112" width="248" height="16" fill="#BA1502"/><rect x="26" y="124" width="248" height="4" fill="#8F1002"/>' +
      '<rect x="38" y="360" width="46" height="20" fill="#2A0A05" opacity=".85"/><rect x="216" y="360" width="46" height="20" fill="#2A0A05" opacity=".85"/></svg>';
  }

  function citySvg() {
    var A = MN.Art;
    var far = A.skyline({ seed: 11, w: 1300, base: 600, min: 70, max: 230, bw: [46, 96], color: '#A9D2DA' });
    return '<svg viewBox="0 0 1280 720" preserveAspectRatio="none" aria-hidden="true">' + far + '</svg>';
  }
  function officeSvg() {
    var A = MN.Art;
    var near = A.skyline({ seed: 23, w: 1300, base: 660, min: 90, max: 250, bw: [54, 104], color: '#58B0B0', windows: true, winColor: '#FEE893' });
    /* gedung pusat perusahaan (fiktif) */
    var hq = '<g class="hq" transform="translate(1030 340)">' +
      '<rect x="-8" y="-14" width="176" height="18" fill="#0B3C41"/>' +
      '<rect width="160" height="330" fill="#0E6B6D"/>' +
      (function () { var s = ''; for (var r = 0; r < 9; r++) for (var c = 0; c < 6; c++) s += '<rect x="' + (12 + c * 24) + '" y="' + (18 + r * 32) + '" width="16" height="20" rx="2" fill="' + ((r * 7 + c * 3) % 5 === 0 ? '#FEE893' : '#9CCCD6') + '" opacity=".85"/>'; return s; })() +
      '<rect x="30" y="300" width="100" height="30" fill="#E6F4F2"/>' +
      '<rect x="14" y="-40" width="132" height="26" rx="5" fill="#fff"/><text x="80" y="-21" text-anchor="middle" font-family="Noto Sans JP,sans-serif" font-size="16" font-weight="700" fill="#0B3C41">ひので商事</text></g>';
    return '<svg viewBox="0 0 1280 720" preserveAspectRatio="none" aria-hidden="true">' + near + hq + '</svg>';
  }

  function flower(x, y, s, tint) {
    var p = '', pc = tint ? '#FFC4B9' : '#FFD9D2';
    for (var i = 0; i < 5; i++) p += '<ellipse cx="0" cy="-8" rx="5.6" ry="8.2" fill="' + pc + '" transform="rotate(' + (i * 72) + ')"/>';
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' + p + '<circle r="3" fill="#FEE893"/><circle r="1.2" fill="#BA1502" opacity=".6"/></g>';
  }
  function branch() {
    var F = [[440, 38, 1.2, 0], [404, 50, 1, 1], [366, 56, 1.25, 0], [334, 66, .9, 1], [304, 88, 1.15, 0], [276, 104, .95, 1], [244, 120, 1.2, 0],
             [214, 92, .9, 1], [196, 62, 1.1, 0], [172, 44, .9, 1], [152, 168, 1.1, 0], [122, 190, .95, 1], [100, 206, 1.2, 0], [126, 140, .9, 1],
             [90, 124, 1.1, 0], [300, 130, 1, 1], [270, 152, 1.15, 0], [70, 214, .9, 1], [340, 30, .8, 0]];
    var fl = F.map(function (f) { return flower(f[0], f[1], f[2], f[3]); }).join('');
    return '<svg viewBox="0 0 470 300" aria-hidden="true">' +
      '<g fill="none" stroke="#5A2A22" stroke-linecap="round">' +
      '<path d="M472 28 C384 50 300 70 232 120 S120 190 60 216" stroke-width="9"/>' +
      '<path d="M332 62 C322 100 302 130 272 152" stroke-width="5"/><path d="M232 120 C222 80 202 56 172 42" stroke-width="5"/>' +
      '<path d="M150 172 C132 142 112 126 84 120" stroke-width="4"/></g>' + fl + '</svg>';
  }

  MN.Bg = {
    build: function () {
      var host = document.getElementById('bg');
      if (!host) return;
      var petals = '';
      for (var i = 0; i < 9; i++) {
        var x0 = (i * 151 + 60) % 1240, dur = 15 + (i * 7) % 11, delay = -((i * 5.3) % dur), sz = 9 + (i * 3) % 6;
        petals += '<i class="petal" style="--x:' + x0 + 'px;--s:' + sz + 'px;animation-duration:' + dur + 's;animation-delay:' + delay.toFixed(1) + 's"></i>';
      }
      host.innerHTML =
        '<div class="ly l-sky"></div>' +
        '<div class="ly l-sun"></div>' +
        '<div class="ly l-cloudsB"><div class="dr">' + cloudRow([[260, 190, .9], [720, 215, 1.1], [1090, 180, .8]]) + '</div></div>' +
        '<div class="ly l-cloudsA"><div class="dr">' + cloudRow([[130, 84, 1.1], [520, 120, .9], [910, 70, 1.2]]) + '</div></div>' +
        '<div class="ly l-fuji"><div class="dr">' + fuji() + '</div></div>' +
        '<div class="ly l-far"><div class="dr">' + citySvg() + '</div></div>' +
        '<div class="ly l-near"><div class="dr">' + officeSvg() + '</div></div>' +
        '<div class="ly l-ground"></div>' +
        '<div class="ly l-torii"><div class="dr">' + torii() + '</div></div>' +
        '<div class="ly l-photo" id="bgPhoto"></div>' +
        '<div class="ly l-light"></div>' +
        '<div class="ly l-branch"><div class="dr">' + branch() + '</div></div>' +
        '<div class="ly l-petals">' + petals + '</div>';
    },

    /* Latar ilustrasi lokasi (assets/bg/<nama>.webp) di atas latar vektor.
       photo('lobi')            -> tampilkan gambar lobi
       photo('lobi', 'soft')    -> versi buram & lebih terang, untuk layar yang penuh kartu
       photo(null)              -> kembali ke latar vektor (dipakai S03 dan scene lain)
       Bila file gagal dimuat, latar vektor tetap tampil (fallback). */
    photo: function (name, mode) {
      var host = document.getElementById('bgPhoto');
      if (!host) return;
      document.body.setAttribute('data-bgmode', mode || '');
      document.body.setAttribute('data-photo', name || '');
      if (host.want === name) return;
      host.want = name;
      function dropOld() {
        [].forEach.call(host.querySelectorAll('.ph.on'), function (c) {
          c.classList.remove('on'); setTimeout(function () { c.remove(); }, 1200);
        });
      }
      if (!name) { dropOld(); document.body.classList.remove('has-photo'); return; }
      var img = new Image();
      img.onload = function () {
        if (host.want !== name) return;            // sudah pindah ke latar lain
        dropOld();
        var el = document.createElement('div');
        el.className = 'ph'; el.style.backgroundImage = 'url("' + img.src + '")';
        host.appendChild(el); void el.offsetWidth;
        el.classList.add('on');
        document.body.classList.add('has-photo');
      };
      img.onerror = function () { if (host.want === name) { dropOld(); document.body.classList.remove('has-photo'); } };
      img.src = 'assets/bg/' + name + '.webp';
    }
  };
})();
