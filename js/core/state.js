/* ==========================================================================
   state.js : data progres peserta (Trust Meter, status modul, skor, pengaturan)
   Disimpan di localStorage browser agar progres tidak hilang saat ditutup.
   Variabel M1Done-M4Done pada storyboard = State.data.done.M1 ... M4
   ========================================================================== */
(function () {
  'use strict';
  var MN = (window.MN = window.MN || {});
  var KEY = 'mensetsuNavi.progress.v1';

  function defaults() {
    return {
      trust: 50,                      // Trust Meter, mulai dari 50 (S02)
      trustShown: false,              // tampil setelah S02 layer keputusan
      done: { M1: false, M2: false, M3: false, M4: false },
      stampSeen: {},                  // stempel yang sudah dianimasikan di menu
      unlockSeen: false,              // gembok Modul 4 sudah dianimasikan
      menuIntroSeen: false,           // narasi pembuka menu hanya sekali
      onboardingDecision: null,       // pilihan keputusan awal di lobi (S02)
      muted: false,
      scores: {}                      // diisi pada langkah berikutnya (S05-S17)
    };
  }

  var data = defaults();
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) {
      var saved = JSON.parse(raw);
      data = Object.assign(defaults(), saved);
      data.done = Object.assign(defaults().done, saved.done || {});
    }
  } catch (e) { /* penyimpanan tidak tersedia: lanjut tanpa menyimpan */ }

  function save() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} }

  MN.State = {
    get data() { return data; },
    save: save,
    reset: function () { data = defaults(); save(); },
    /* Ubah Trust Meter, dibatasi 0-100 */
    addTrust: function (delta) {
      var before = data.trust;
      data.trust = Math.max(0, Math.min(100, data.trust + delta));
      save();
      if (MN.UI && MN.UI.setTrust) MN.UI.setTrust(data.trust, data.trust - before);
      return data.trust;
    },
    markDone: function (m) { data.done[m] = true; save(); },
    coreDone: function () { return !!(data.done.M1 && data.done.M2 && data.done.M3); },
    doneCount: function () { return ['M1', 'M2', 'M3', 'M4'].filter(function (k) { return data.done[k]; }).length; }
  };
})();
