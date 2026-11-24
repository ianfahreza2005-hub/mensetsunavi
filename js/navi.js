/* Mensetsu Navi — GLB-07 Pemandu Navi dan Kata Mutiara.
   Navi hanya pemandu belajar (bukan Tanaka-san, pewawancara di Simulasi). Bagian yang dipegang modul ini:
     saran(api)      : saran bagian berikutnya di beranda ("Stempel Bab 3 belum ada. Coba bab itu dulu?", "Lanjutkan Bab 3 dari …?")
     hint(kode,b,k,l): Petunjuk Navi di slide aktivitas: satu petunjuk yang menunjuk slide terkait (tidak muncul di kuis, pre/post-test, Simulasi resmi)
     mount(root,api) : halaman Koleksi Kata Mutiara (#/hal/GLB-07); kartu terbuka seiring stempel bab, ketuk untuk mendengar suara Navi
   Data: D.mutiara (tabel GLB-07 via gen_data.py).                                                                                   */
(function () {
  var D = window.MN_DATA, ST = window.MN_STORE;

  function judul(code) { var s = D.slides[code]; return s ? s.title.replace(/^Aktivitas:\s*/, '') : code; }
  function stempel(n) { return ST.get().unlockAll ? true : !!(ST.get().bab[n] && ST.get().bab[n].stamp); }
  function terbuka() { return (D.mutiara || []).filter(function (m) { return stempel(m.bab); }).length; }

  /* ---------------------------------------------------------------- saran di beranda */
  function saran() {
    var S = ST.get(), n, b;
    if (!S.pre) return { t: 'Mulai dari pre-test dulu, ya. Hasilnya menunjukkan bab mana yang sebaiknya kamu pelajari lebih dulu.', href: '#/pre/0', label: 'Mulai pre-test', pose: 'exp_senang' };
    var bs = []; for (n = 1; n <= 6; n++) bs.push(S.bab[n] || { seen: [], last: 0, stamp: false });
    for (n = 1; n <= 6; n++) {                               /* sedang dipelajari: lanjutkan dari slide terakhir */
      b = bs[n - 1];
      if (b.seen && b.seen.length && !b.stamp) {
        var code = D.bab[n - 1].slides[b.last || 0];
        return { t: 'Lanjutkan Bab ' + n + ' dari “' + judul(code) + '”?', href: '#/bab/' + n + '/' + (b.last || 0), label: 'Lanjutkan', pose: 'pose_menunjuk' };
      }
    }
    var worst = 0, wp = 2, first = 0;                        /* belum mulai: bab dengan hasil pre-test terendah */
    for (n = 1; n <= 6; n++) {
      if (bs[n - 1].stamp) continue; if (!first) first = n;
      var p = S.pre.perBab && S.pre.perBab[n]; if (p && p[1] && p[0] / p[1] < wp) { wp = p[0] / p[1]; worst = n; }
    }
    n = worst || first;
    if (n) return { t: 'Stempel Bab ' + n + ' belum ada. Coba bab itu dulu?', href: '#/bab/' + n + '/0', label: 'Buka Bab ' + n, pose: 'pose_menunjuk' };
    if (!(S.sim && S.sim.done)) return { t: 'Enam stempel sudah terkumpul! Saatnya Simulasi Mensetsu bersama Tanaka-san.', href: '#/sim/0', label: 'Mulai simulasi', pose: 'pose_jempol' };
    if (!(S.post && S.post.done)) return { t: 'Simulasi selesai. Kerjakan Post-test untuk melihat kemajuanmu.', href: '#/post/0', label: 'Ke Post-test', pose: 'pose_semangat' };
    return { t: 'Semua bagian sudah selesai. Lihat Rapor Kesiapanmu, ya!', href: '#/rapor', label: 'Lihat rapor', pose: 'pose_jempol' };
  }

  /* ---------------------------------------------------------------- Petunjuk Navi di aktivitas */
  function refKode(code, b, k) {
    var s = D.slides[code], txt = [];
    s.screen.forEach(function (x) { if (x.p) txt.push(x.p); if (x.li) txt.push(x.li); if (x.table) x.table.forEach(function (r) { r.forEach(function (c) { txt.push(c); }); }); });
    var refs = (txt.join(' ').match(/B\d-\d\d/g) || []).filter(function (c, i, a) { var j = b.slides.indexOf(c); return a.indexOf(c) === i && c !== code && j >= 0 && j < k; });
    if (refs.length) return refs[0];
    for (var j = k - 1; j > 0; j--) if (!/^(T01|T08|T10|T11|T12|T17|T18)$/.test(D.slides[b.slides[j]].tpl)) return b.slides[j];
    return null;
  }
  /* mengembalikan HTML isi gelembung Navi; l = slideLink dari app.js */
  function hint(code, b, k, l, esc) {
    var ref = refKode(code, b, k), t = ref && l(ref);
    if (t) return 'Petunjuk: coba baca lagi <a href="' + t.href + '">' + esc(t.judul) + '</a>, lalu kembali ke sini.';
    var nx = l(b.slides[k + 1]);
    return 'Ini slide pemantik, jadi belum ada materi yang perlu dibuka. Jawab sesuai perkiraanmu' + (nx ? '; jawabannya dibahas di <a href="' + nx.href + '">' + esc(nx.judul) + '</a>.' : '.');
  }

  /* ---------------------------------------------------------------- koleksi Kata Mutiara */
  function mount(root, api) {
    var esc = api.esc, ic = api.ic, M = D.mutiara || [], buka = terbuka();
    root.innerHTML = '<div class="navi-say"><img src="assets/navi/exp_senang.webp" alt="Navi"><div class="bubble">Setiap stempel bab membuka satu Kata Mutiara dari Navi. Ketuk kartu yang terbuka untuk mendengarnya.<div class="mini" style="margin-top:6px"><b>' + buka + ' dari ' + M.length + '</b> kartu terbuka</div></div></div>' +
      '<div class="km-list">' + M.map(function (m) {
        var on = stempel(m.bab), b = D.bab[m.bab - 1];
        return on
          ? '<button class="km-card" data-bab="' + m.bab + '" style="--c:' + b.col + ';--cl:' + b.colL + '"><span class="km-top"><span class="jp km-kj">' + esc(b.kj) + '</span><span class="mini">' + esc(b.label) + '</span></span><span class="km-q">“' + esc(m.teks) + '”</span><span class="km-say">' + ic('speaker') + 'Dengarkan Navi</span></button>'
          : '<div class="km-card km-lock" style="--c:#8A8FA3;--cl:#ECEDF2">' + ic('lock') + '<span><b>' + esc(b.label) + '</b><br><span class="mini">Dapatkan stempel ' + esc(b.label) + ' untuk membuka kartu ini.</span></span></div>';
      }).join('') + '</div>';
    root.querySelectorAll('.km-card[data-bab]').forEach(function (c) {
      c.addEventListener('click', function () { var m = M[+c.dataset.bab - 1]; api.sayMutiara(m.bab, m.teks); });
    });
  }

  window.MN_NAVI = { saran: saran, hint: hint, mount: mount, terbuka: terbuka, total: function () { return (D.mutiara || []).length; } };
})();
