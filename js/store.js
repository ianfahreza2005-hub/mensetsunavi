/* Progres peserta, disimpan di localStorage perangkat (tidak dikirim ke mana pun). */
(function () {
  var KEY = 'mensetsu-navi-v2';
  var blank = function () {
    return { name: '', pre: null, post: null, sim: null, bab: {}, unlockAll: false, started: Date.now() };
  };
  var S;
  try { S = JSON.parse(localStorage.getItem(KEY)) || blank(); } catch (e) { S = blank(); }

  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* mode privat */ } }
  function bab(n) { return S.bab[n] || (S.bab[n] = { seen: [], last: 0, best: 0, stamp: false }); }

  window.MN_STORE = {
    get: function () { return S; },
    save: save,
    reset: function () { S = blank(); save(); },
    bab: bab,
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
