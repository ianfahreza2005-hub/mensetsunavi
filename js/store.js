/* Progres peserta, disimpan di localStorage perangkat (tidak dikirim ke mana pun). */
(function () {
  var KEY = 'mensetsu-navi-v2';
  var blank = function () {
    return { name: '', pre: null, post: null, sim: null, bab: {}, unlockAll: false, started: Date.now() };
  };
  var S;
  try { S = JSON.parse(localStorage.getItem(KEY)) || blank(); } catch (e) { S = blank(); }
  /* tahan data lama/rusak: lengkapi kolom yang hilang dengan nilai awal */
  (function () {
    var d = blank();
    if (!S || typeof S !== 'object') S = d;
    for (var k in d) if (S[k] === undefined) S[k] = d[k];
    if (typeof S.bab !== 'object' || S.bab === null) S.bab = {};
  })();

  var ok = true;   /* false bila peramban menolak penyimpanan (mode privat/diblokir): data hanya bertahan sampai halaman ditutup */
  try { localStorage.setItem(KEY + '-uji', '1'); localStorage.removeItem(KEY + '-uji'); } catch (e) { ok = false; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { ok = false; } }
  function bab(n) { return S.bab[n] || (S.bab[n] = { seen: [], last: 0, best: 0, stamp: false }); }

  window.MN_STORE = {
    get: function () { return S; },
    ok: function () { return ok; },
    /* pengaturan (GLB-02, GLB-06): Romaji dan Arti menyala bawaan; kecepatan audio normal | pelan */
    set: function () { var t = S.set = S.set || {}; if (t.ro === undefined) t.ro = true; if (t.ar === undefined) t.ar = true; if (!t.kec) t.kec = 'normal'; return t; },
    save: save,
    reset: function () { S = blank(); save(); },
    bab: bab,
    last: function (n, k) { bab(n).last = k; save(); },
    isSeen: function (n, code) { return bab(n).seen.indexOf(code) >= 0; },
    seen: function (n, code, k) {
      var b = bab(n);
      if (b.seen.indexOf(code) < 0) b.seen.push(code);
      b.last = k; save();
    },
    quiz: function (n, score) {
      var b = bab(n);
      b.best = Math.max(b.best, score);
      if (score >= 80) b.stamp = true;
      save(); return b.stamp;
    },
    stamps: function () {
      var c = 0;
      for (var n = 1; n <= 6; n++) if (S.bab[n] && S.bab[n].stamp) c++;
      return c;
    },
    /* status buku di rak: done | now | new | locked */
    status: function (no) {
      var D = window.MN_DATA;
      if (no <= 6) {
        if (!S.pre && !S.unlockAll) return 'locked';
        var b = S.bab[no];
        if (b && b.stamp) return 'done';
        if (b && b.seen.length) return 'now';
        return 'new';
      }
      if (no === 7) return S.sim && S.sim.done ? 'done' : (this.stamps() >= 6 || S.unlockAll ? 'new' : 'locked');
      return S.post && S.post.done ? 'done' : ((S.sim && S.sim.done) || S.unlockAll ? 'new' : 'locked');
    },
    progress: function (no) {
      var D = window.MN_DATA, b = S.bab[no];
      if (!b) return 0;
      var total = D.bab[no - 1].slides.length;
      return Math.min(1, b.seen.length / total);
    }
  };
})();
