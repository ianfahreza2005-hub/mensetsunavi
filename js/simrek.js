/* Mensetsu Navi — rekaman opsional jikoshoukai setelah SIM-06 (Evaluasi_Sumatif.md).
   Peserta boleh mengucapkan dan merekam jikoshoukai-nya sendiri; tidak dinilai, tidak masuk Skor Simulasi.
   Yang tersimpan hanya angka (MN_STORE.get().lisan.sim06) dan tampil di Profil Kesiapan Lisan pada rapor. Rekaman tidak disimpan.
   Memakai MN_SUARA (target 30–60 dtk seperti B4-15, henti otomatis 90 dtk).

   API: MN_SIMREK.mount(root, { esc, ic, toast, lanjut }) */
(function () {
  var SU = window.MN_SUARA, ST = window.MN_STORE;
  var TARGET = [30, 60], MAKS = 90;

  function mount(root, api) {
    var esc = api.esc, rec = null, url = null, S = ST.get(), mine = S.jiko && S.jiko.hasil;
    function bersih() {
      if (rec) { try { rec.stop(); } catch (e) { /* sudah berhenti */ } rec = null; }
      if (url) { try { URL.revokeObjectURL(url); } catch (e) { /* sudah dilepas */ } url = null; }
    }
    window.addEventListener('hashchange', function h() { if (!document.body.contains(root)) { bersih(); window.removeEventListener('hashchange', h); } });

    function kepala() {
      return '<div class="card sr" style="color:var(--ink)"><span class="chip">Opsional · tidak dinilai</span><h3 class="kv-sum">Ucapkan jikoshoukai-mu</h3>' +
        '<p class="mini">Rekamanmu hanya untuk latihan. Hasilnya masuk Profil Kesiapan Lisan di rapor; rekaman tidak disimpan.</p>' +
        (mine ? '<details class="sr-teks"><summary>Lihat jikoshoukai-mu (dari B4-14)</summary><p class="jp lt-jp">' + esc(mine.jp) + '</p><p class="ix-ro">' + esc(mine.ro) + '</p></details>' : '');
    }
    function siap() {
      var bisa = SU && SU.bisa();
      root.innerHTML = kepala() + (bisa ? '<button class="btn full sr-rek">● Rekam</button><p class="ix-hint">Target ' + TARGET[0] + '–' + TARGET[1] + ' detik · berhenti otomatis di ' + MAKS + ' detik.</p>' : '<p class="mini">Perangkat ini belum mendukung perekaman.</p>') +
        '<button class="btn ghost full sr-lewat">' + (bisa ? 'Lewati dan lanjut' : 'Lanjut') + '</button></div>';
      var r = root.querySelector('.sr-rek'); if (r) r.addEventListener('click', mulai);
      root.querySelector('.sr-lewat').addEventListener('click', function () { bersih(); api.lanjut(); });
    }
    function mulai() {
      SU.buka(function (stream) {
        root.innerHTML = kepala() + '<p class="lt-tanya"><span class="lt-dot"></span> Merekam… ucapkan jikoshoukai-mu.</p>' +
          '<div class="ls-zone" aria-hidden="true"><span class="z" style="left:' + TARGET[0] / MAKS * 100 + '%;width:' + (TARGET[1] - TARGET[0]) / MAKS * 100 + '%"></span><i></i></div>' +
          '<div class="lt-meter" aria-hidden="true"><i></i></div><div class="lt-wkt">0:00</div><button class="btn full sr-stop">■ Berhenti</button></div>';
        var meter = root.querySelector('.lt-meter i'), waktu = root.querySelector('.lt-wkt'), bar = root.querySelector('.ls-zone i');
        rec = SU.rekam(stream, { maks: MAKS, target: TARGET,
          onLevel: function (v) { if (meter) meter.style.width = Math.round(v * 100) + '%'; },
          onDetik: function (d) { if (waktu) waktu.textContent = Math.floor(d / 60) + ':' + ('0' + Math.floor(d % 60)).slice(-2); if (bar) bar.style.width = Math.min(100, d / MAKS * 100) + '%'; },
          onSelesai: function (h) { stream.getTracks().forEach(function (x) { x.stop(); }); rec = null; hasil(h); } });
        root.querySelector('.sr-stop').addEventListener('click', function () { if (rec) rec.stop(); });
      }, function () { api.toast('Izin mikrofon ditolak. Kamu bisa melewati langkah ini.'); siap(); });
    }
    function hasil(h) {
      if (!h) return siap();
      var a = h.analisis; url = h.url;
      try { S.lisan = S.lisan || {}; if (a) { S.lisan.sim06 = { durasi: Math.round(a.durasi), jeda: a.jeda.length, volume: a.volume, waktu: Date.now() }; ST.save(); } } catch (e) { /* mode privat */ }
      root.innerHTML = kepala() + '<audio controls src="' + h.url + '"></audio>' + (a && !a.kosong ? SU.gelombang(h.level, a.jeda) : '') +
        (a ? '<div class="lt-kart">' + a.kartu.map(function (k) { return '<div class="lt-k ' + k.t + '"><span>' + esc(k.k) + '</span><b>' + esc(k.v) + '</b><small>' + esc(k.s) + '</small></div>'; }).join('') + '</div><p class="mini">Perkiraan otomatis (bergantung mikrofon), bukan nilai.</p>' : '') +
        '<div class="kv-ans"><button class="btn ghost sr-ulang">Rekam ulang</button><button class="btn sr-lanjut">Lanjut</button></div></div>';
      root.querySelector('.sr-ulang').addEventListener('click', function () { bersih(); mulai(); });
      root.querySelector('.sr-lanjut').addEventListener('click', function () { bersih(); api.lanjut(); });
    }
    siap();
  }

  window.MN_SIMREK = { mount: mount };
})();
