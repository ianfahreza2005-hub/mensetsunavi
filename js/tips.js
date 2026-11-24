/* Mensetsu Navi — GLB-05 Tips & Trik Mensetsu.
   Delapan kartu yang digeser, tiga tahap (Sebelum / Saat / Sesudah). Data: D.tips (tabel GLB-05 di dokumen Fitur Global, via gen_data.py).
   Tombol "Pelajari" membuka slide acuan. Kolom "Alasan" opsional: bila kelak ditambahkan ke tabel naskah, otomatis tampil di kartu.

   API: MN_TIPS.mount(root, api) — api: { esc, ic, naviSay, bindSpeak, status(bab) }  */
(function () {
  var D = window.MN_DATA;
  var TAHAP = ['Sebelum', 'Saat', 'Sesudah'];

  /* "B3-11" -> { href, judul, bab } ; "GLB-04" -> halaman fitur */
  function tujuan(kode) {
    var s = D.slides[kode], bab = 0, idx = -1;
    D.bab.forEach(function (b) { var i = b.slides.indexOf(kode); if (i >= 0) { bab = b.no; idx = i; } });
    if (bab) return { href: '#/bab/' + bab + '/' + idx, judul: s ? s.title : kode, bab: bab };
    if (s) return { href: '#/hal/' + kode, judul: s.title, bab: 0 };
    return null;
  }

  function mount(root, api) {
    var esc = api.esc, ic = api.ic, tips = D.tips || [], at = 0;
    function md(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); }
    var awal = {}; tips.forEach(function (t, i) { if (awal[t.tahap] == null) awal[t.tahap] = i; });
    var tabs = TAHAP.filter(function (t) { return awal[t] != null; });

    root.innerHTML = api.naviSay('GLB-05', D.slides['GLB-05'].narasi, 'exp_senang') +
      '<div class="tp"><div class="kv-tabs" role="tablist" aria-label="Tahap">' + tabs.map(function (t) {
        var n = tips.filter(function (x) { return x.tahap === t; }).length;
        return '<button class="kv-tab" role="tab" data-t="' + t + '" aria-selected="false">' + t + ' <small>(' + n + ')</small></button>';
      }).join('') + '</div>' +
      '<div class="tp-rail" tabindex="0" role="group" aria-roledescription="carousel" aria-label="Kartu tips, geser ke samping">' + tips.map(function (t, i) {
        var d = tujuan(t.acuan), kunci = d && d.bab && api.status(d.bab) === 'locked';
        return '<article class="tp-card" data-i="' + i + '" aria-label="Tips ' + t.no + ' dari ' + tips.length + '"><div class="tp-top"><span class="tp-tag">' + esc(t.tahap) + '</span><span class="tp-no">Tips ' + t.no + ' / ' + tips.length + '</span></div>' +
          '<p class="tp-isi">' + md(t.tips) + '</p>' + (t.alasan ? '<p class="tp-alasan"><b>Kenapa?</b> ' + md(t.alasan) + '</p>' : '') +
          (d ? '<div class="tp-foot"><span class="mini">Dibahas di: ' + esc(d.judul) + '</span>' +
            (kunci ? '<span class="btn ghost tp-kunci" aria-disabled="true">' + ic('lock') + 'Terbuka setelah pre-test</span>' : '<a class="btn soft" href="' + d.href + '">Pelajari' + ic('next') + '</a>') + '</div>' : '') + '</article>';
      }).join('') + '</div>' +
      '<div class="tp-nav"><button class="btn ghost tp-prev" aria-label="Tips sebelumnya">' + ic('back') + '</button><span class="tp-dots" aria-hidden="true">' +
      tips.map(function (_, i) { return '<i data-i="' + i + '"></i>'; }).join('') + '</span><button class="btn ghost tp-next" aria-label="Tips berikutnya">' + ic('next') + '</button></div></div>';
    api.bindSpeak(root);

    var rail = root.querySelector('.tp-rail'), dots = root.querySelectorAll('.tp-dots i'), tabEls = root.querySelectorAll('.kv-tab');
    var hemat = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    function ke(i) { i = Math.max(0, Math.min(tips.length - 1, i)); rail.scrollTo({ left: i * rail.clientWidth, behavior: hemat ? 'auto' : 'smooth' }); }
    function tandai(i) {
      at = i;
      dots.forEach(function (d, k) { d.classList.toggle('on', k === i); });
      tabEls.forEach(function (b) { var on = b.dataset.t === tips[i].tahap; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
      root.querySelector('.tp-prev').disabled = i === 0; root.querySelector('.tp-next').disabled = i === tips.length - 1;
    }
    var raf = 0;
    rail.addEventListener('scroll', function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(function () { tandai(Math.round(rail.scrollLeft / (rail.clientWidth || 1))); }); });
    tabEls.forEach(function (b) { b.addEventListener('click', function () { ke(awal[b.dataset.t]); }); });
    root.querySelector('.tp-prev').addEventListener('click', function () { ke(at - 1); });
    root.querySelector('.tp-next').addEventListener('click', function () { ke(at + 1); });
    rail.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { e.preventDefault(); ke(at + 1); } else if (e.key === 'ArrowLeft') { e.preventDefault(); ke(at - 1); } });
    window.addEventListener('resize', function () { if (document.body.contains(root)) rail.scrollLeft = at * rail.clientWidth; });
    tandai(0);
  }

  window.MN_TIPS = { mount: mount };
})();
