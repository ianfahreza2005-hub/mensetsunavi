/* S01 : Halaman Pembuka (redesain sinematik)
   Urutan: latar zoom halus -> "Mensetsu Navi" muncul huruf demi huruf
   -> baris 面接ナビ + cap hanko -> "Pemandu Wawancara" -> maskot melambai masuk -> tombol Mulai.
   Tombol Mulai aktif setelah animasi selesai. Mulai -> transisi kelopak sakura -> S02.
   Trust Meter belum ditampilkan. Latar: ilustrasi eksterior kantor (assets/bg/kantor_eksterior.webp)
   di atas latar vektor js/core/bg.js; Navi berdiri di pelataran depan pintu kantor. */
(function () {
  'use strict';
  var MN = window.MN, T = MN.Text.S01, A = MN.Audio, Art = MN.Art;

  /* Pecah teks menjadi <span> per huruf agar bisa dianimasikan bergantian */
  function letters(text, start) {
    return text.split('').map(function (c, i) {
      return '<span class="ch" style="--i:' + (start + i) + '" aria-hidden="true">' + c + '</span>';
    }).join('');
  }

  MN.defineScene({
    id: 'S01', title: 'Halaman Pembuka', bare: true, home: false,
    onEnter: function () { MN.UI.showTrust(false); MN.Bg.photo('kantor_eksterior'); },
    steps: [{
      id: 'pembuka',
      enter: function (ctx) {
        var el = ctx.el; el.classList.add('s01');
        var petals = '';
        for (var i = 0; i < 6; i++) petals += '<i style="--y:' + (30 + i * 95) + 'px;--s:' + (16 + (i * 5) % 12) + 'px;--d:' + (9 + (i * 3) % 6) + 's;--w:' + (-i * 2.7).toFixed(1) + 's"></i>';

        el.innerHTML =
          '<div class="s01-petals" aria-hidden="true">' + petals + '</div>' +
          '<div class="s01-veil" aria-hidden="true"></div>' +
          '<div class="s01-brand">' +
            '<h1 aria-label="Mensetsu Navi">' +
              '<span class="ln l1">' + letters('Mensetsu', 0) + '</span>' +
              '<span class="ln l2">' + letters('Navi', 8) + '<span class="s01-seal" aria-hidden="true">面</span></span>' +
            '</h1>' +
            '<div class="s01-jp"><i class="bar"></i><span class="jp-name">面接ナビ</span><i class="rule"></i></div>' +
            '<div class="sub">' + T.subjudul + '</div>' +
          '</div>' +
          '<div class="s01-tag"><span>' + T.judul + '</span></div>' +
          '<div class="s01-start"><button class="btn" id="btnMulai" disabled>Mulai ' + Art.icon('arrow', 26) + '</button></div>';

        /* Maskot (model sheet terbaru): melambai saat menyambut -> berdiri tenang saat menyampaikan -> semangat pada "Siap?" */
        var hero = MN.Mascot.create({ pose: 'pose_melambai', cls: 's01-hero grounded', alt: 'Navi, pemandu wawancara' });
        el.appendChild(hero);
        ctx.after(5600, function () { if (hero.key() === 'pose_melambai') hero.set('pose_berdiri'); });

        var btn = el.querySelector('#btnMulai');
        ctx.after(3000, function () { btn.disabled = false; btn.classList.add('ready'); });

        ctx.after(1500, async function () {
          await ctx.narrate(T.narasi.text, { file: T.narasi.file });
          if (!ctx.alive()) return;
          hero.set('pose_semangat');
        });

        var going = false;
        btn.addEventListener('click', function () {
          if (going) return; going = true;
          A.init(); A.startMusic(); A.sfx('click');
          MN.State.data.seenIntro = true; MN.State.save();
          btn.classList.add('go'); hero.set('pose_semangat');
          MN.Fx.sakuraWipe(function () { ctx.goScene('S02'); going = false; });
        });
      }
    }]
  });
})();
