/* Mensetsu Navi — T15 Latihan Lisan 3 lapis (B4-15 jikoshoukai, B5-13 jawab tiga pertanyaan).
   Lapis 1: analisis otomatis (durasi, jeda, volume, gelombang) lewat MN_SUARA.
   Lapis 2: putar rekamanmu + contoh Rani, lalu daftar periksa (penilaian diri).
   Lapis 3: ringkasan "Profil Kesiapan Lisan", Unduh rekaman, Unduh lembar rubrik (untuk instruktur).
   Tidak masuk batas lulus 75. Rekaman hanya ada selama slide dibuka; yang disimpan hanya angka (MN_STORE.get().lisan).

   Naskah: B4-15 target 30–60 dtk, berhenti otomatis di 90 dtk, daftar periksa 7 butir (isinya tidak ada di naskah; DRAF di bawah,
   diturunkan dari lima blok dan daftar "Hindari" Bab 4, perlu dicek SME). B5-13 target 10–30 dtk, 4 butir sesuai naskah, tiga pertanyaan acak dari B5-04..07.

   API: MN_LISAN.widget(kode, { sayJa, spk, esc }) -> { html, bind(el, onDone) } atau null.                              */
(function () {
  var D = window.MN_DATA, ST = window.MN_STORE, SU = window.MN_SUARA;
  var BLOK = ['Siapa', 'Dari mana', 'Pernah apa', 'Bisa apa', 'Mau apa'];
  var KONF = {
    'B4-15': { judul: 'Jikoshoukai', target: [30, 60], maks: 90, kunci: 'jiko', file: 'jikoshoukai',
      cek: ['Menyapa dan menyebut nama: 「はじめまして。〇〇と申します。」', 'Menyebut asal dan usia: 「…から参りました」', 'Menyebut latar belakang (sekolah, bahasa Jepang, atau pengalaman kerja)',
        'Menyebut satu kelebihan dengan bukti singkat: 「私の長所は…」', 'Menyebut motivasi dan menutup dengan 「どうぞよろしくお願いいたします」', 'Durasi 30–60 detik (lihat kartu Durasi)', 'Bahasa sopan (です / ます), jelas, tempo tenang, dengan jeda'] },
    'B5-13': { judul: 'Jawab tiga pertanyaan', target: [10, 30], maks: 60, kunci: 'jawab', file: 'jawaban', jumlah: 3,
      cek: ['Langsung menjawab pertanyaan', 'Ada satu alasan atau contoh', 'Ada kalimat semangat', 'Memakai bentuk sopan (です desu / ます masu)'] }
  };

  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function detik(n) { return Math.round(n) + ' dtk'; }
  function raniBlok() {
    var s = D.slides['B4-10'], t = null; (s ? s.screen : []).forEach(function (b) { if (b.table) t = b.table; });
    return (t || []).slice(1).map(function (r) { return { jp: r[1], ro: r[2], ar: r[3] }; });
  }
  function ekstensi(blob) { var m = (blob && blob.type) || ''; return /mp4/.test(m) ? 'm4a' : /ogg/.test(m) ? 'ogg' : /wav/.test(m) ? 'wav' : 'webm'; }
  function unduh(nama, blobOrUrl, isUrl) {
    var a = document.createElement('a'); a.href = isUrl ? blobOrUrl : URL.createObjectURL(blobOrUrl); a.download = nama;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }

  function widget(kode, env) {
    var K = KONF[kode]; if (!K || !SU) return null;
    var esc = env.esc, SPK = env.spk, sayJa = env.sayJa;
    var rani = kode === 'B4-15' ? raniBlok() : null;
    var soal = kode === 'B5-13' ? shuffle(D.lisan5 || []).slice(0, K.jumlah) : [null];
    if (!soal.length) return null;

    return {
      html: '<div class="ix-ls"></div>',
      bind: function (el, onDone) {
        var root = el.querySelector('.ix-ls'), S = ST.get(), selesai = false, rec = null, urls = [];
        var st = { mode: 'teks', i: 0, akhir: false, h: soal.map(function () { return { fase: 'siap', rek: null, cek: K.cek.map(function () { return false; }), ok: false }; }) };

        function fireDone() { if (!selesai) { selesai = true; onDone(); } }
        function cur() { return st.h[st.i]; }
        function simpan() {
          try {
            S.lisan = S.lisan || {}; var rows = st.h.map(function (h) {
              var a = h.rek && h.rek.analisis, n = h.cek.filter(Boolean).length;
              return { durasi: a ? Math.round(a.durasi) : null, jeda: a ? a.jeda.length : null, volume: a ? a.volume : null, cek: n, total: K.cek.length, rekam: !!h.rek, waktu: Date.now() };
            }).filter(function (r, i) { return st.h[i].rek || st.h[i].ok || r.cek; });
            if (rows.length) { S.lisan[K.kunci] = K.kunci === 'jiko' ? rows[0] : rows; ST.save(); }
          } catch (e) { /* mode privat */ }
        }
        function bersih() {
          if (rec) { try { rec.stop(); } catch (e) { /* sudah berhenti */ } rec = null; }
          urls.forEach(function (u) { try { URL.revokeObjectURL(u); } catch (e) { /* sudah dilepas */ } }); urls = [];
          if (window.speechSynthesis) speechSynthesis.cancel();
        }
        window.addEventListener('hashchange', function h() { if (!document.body.contains(root)) { bersih(); window.removeEventListener('hashchange', h); } });

        function kal(k) {
          return '<div class="lt-kal"><span class="jp lt-jp">' + esc(k.jp) + '</span><button class="ix-sp ls-say" data-t="' + esc(k.jp) + '" aria-label="Dengarkan">' + SPK + '</button>' +
            (k.ro ? '<div class="ix-ro">' + esc(k.ro) + '</div>' : '') + (k.ar ? '<div class="ix-ar peek">' + esc(k.ar) + '</div>' : '') + '</div>';
        }
        function zona() {
          var a = K.target[0] / K.maks * 100, b = (K.target[1] - K.target[0]) / K.maks * 100;
          return '<div class="ls-zone" aria-hidden="true"><span class="z" style="left:' + a + '%;width:' + b + '%"></span><i></i></div>';
        }

        /* ---------- bagian-bagian layar */
        function panduan() {
          if (kode === 'B5-13') return '<div class="ls-pola"><span>Jawab</span>→<span>Alasan</span>→<span>Semangat</span></div>';
          var mine = S.jiko && S.jiko.hasil, isi;
          if (st.mode === 'blok') isi = '<div class="ls-pola">' + BLOK.map(function (b, i) { return '<span>' + (i + 1) + '. ' + b + '</span>'; }).join('→') + '</div>';
          else if (mine) isi = '<div class="card ls-teks"><b>Jikoshoukai-mu (dari B4-14)</b><p class="jp lt-jp">' + esc(mine.jp) + '</p><p class="ix-ro">' + esc(mine.ro) + '</p></div>';
          else isi = '<div class="card ls-teks"><b>Contoh Rani</b><p class="mini">Belum ada jikoshoukai dari B4-14, jadi teks contoh Rani dipakai. Kamu boleh membacanya.</p>' +
            rani.map(function (b) { return '<p class="jp lt-jp">' + esc(b.jp) + '</p>'; }).join('') + '</div>';
          return '<div class="lt-opt"><b>Mode panduan</b><div class="kv-chips"><button class="kv-chip' + (st.mode === 'teks' ? ' on' : '') + '" data-mode="teks" aria-pressed="' + (st.mode === 'teks') + '">Teks penuh</button>' +
            '<button class="kv-chip' + (st.mode === 'blok' ? ' on' : '') + '" data-mode="blok" aria-pressed="' + (st.mode === 'blok') + '">Hanya nama blok</button></div></div>' + isi;
        }
        function rekamBox(h) {
          var t = K.target[0] + '–' + K.target[1];
          if (h.fase === 'siap') return '<button class="btn full ls-rek">● Rekam</button><p class="ix-hint">Target ' + t + ' detik' + (K.maks > K.target[1] ? ' · berhenti otomatis di ' + K.maks + ' detik' : '') + '. Rekaman tidak disimpan di server.</p>';
          if (h.fase === 'rekam') return '<p class="lt-tanya"><span class="lt-dot"></span> Merekam… bicara sekarang.</p>' + zona() + '<div class="lt-meter" aria-hidden="true"><i></i></div><div class="lt-wkt">0:00</div><button class="btn full ls-stop">■ Berhenti</button>';
          if (h.fase === 'tanpa') return '<p class="lt-tanya">Mikrofon tidak tersedia. Berlatihlah dengan cara dengar lalu tirukan (shadowing) bersama contoh di bawah, lalu ucapkan dengan suara keras.</p><button class="btn full ls-fin">Selesai berlatih</button>';
          return '';
        }
        function lapis1(h) {
          var a = h.rek && h.rek.analisis; if (!h.rek) return '';
          return '<div class="card ls-l1"><b>Lapis 1 · Analisis otomatis</b><audio controls src="' + h.rek.url + '"></audio>' + (a && !a.kosong ? SU.gelombang(h.rek.level, a.jeda) : '') +
            (a ? '<div class="lt-kart">' + a.kartu.map(function (k) { return '<div class="lt-k ' + k.t + '"><span>' + esc(k.k) + '</span><b>' + esc(k.v) + '</b><small>' + esc(k.s) + '</small></div>'; }).join('') + '</div><p class="mini">Perkiraan otomatis (bergantung mikrofon), bukan nilai.</p>' : '<p class="mini">Analisis tidak tersedia di perangkat ini.</p>') +
            '<button class="btn soft ls-ulang">Rekam ulang</button></div>';
        }
        function lapis2(h, q) {
          var contoh = kode === 'B4-15'
            ? '<b>Bandingkan dengan contoh Rani</b><p class="mini">Putar rekamanmu di atas, lalu dengarkan contoh Rani per blok secara bergantian.</p>' + rani.map(function (b, i) { return '<div class="ls-blok"><span class="ls-bn">' + (i + 1) + ' · ' + BLOK[i] + '</span>' + kal(b) + '</div>'; }).join('')
            : '<b>Contoh jawaban Rani</b>' + kal(q.a) + (q.tip ? '<p class="mini">Tips: ' + esc(q.tip) + '</p>' : '');
          return '<div class="card ls-l2">' + contoh + '<div class="ix-chk"><b>Lapis 2 · Periksa dirimu</b>' + K.cek.map(function (c, i) {
            return '<label><input type="checkbox" data-c="' + i + '"' + (h.cek[i] ? ' checked' : '') + '><span>' + esc(c) + '</span></label>'; }).join('') + '</div></div>';
        }
        function profilTeks(kk) {
          return kk.map(function (r, i) { return (kk.length > 1 ? 'Jawaban ' + (i + 1) + ': ' : '') + (r.durasi != null ? 'durasi ' + detik(r.durasi) + ' · ' + r.jeda + ' jeda · volume ' + r.volume : 'tanpa analisis') + ' · daftar periksa ' + r.cek + '/' + r.total; });
        }
        function ringkasL3() {
          var rows = (K.kunci === 'jiko' ? [S.lisan && S.lisan.jiko] : (S.lisan && S.lisan.jawab) || []).filter(Boolean);
          return rows.length ? profilTeks(rows).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') : '<li>Belum ada data.</li>';
        }
        function lapis3() {
          var ada = st.h.some(function (h) { return h.rek; });
          return '<div class="card ls-l3"><b>Lapis 3 · Untuk instruktur</b><p class="mini">Profil Kesiapan Lisan (tampil juga di rapor):</p>' +
            '<ul class="lt-list">' + ringkasL3() + '</ul>' +
            '<div class="lt-pk">' + (ada ? '<button class="btn soft ls-dl">Unduh rekaman</button>' : '') + '<button class="btn soft ls-rub">Unduh lembar rubrik</button></div></div>';
        }

        function draw() {
          var h = cur(), q = soal[st.i], hasil = h.fase === 'hasil' || h.ok, tot = soal.length, head = '';
          if (kode === 'B5-13') head = '<div class="kv-prog"><span>Pertanyaan ' + (Math.min(st.i, tot - 1) + 1) + ' dari ' + tot + '</span><b><i style="width:' + Math.round((st.akhir ? tot : st.i) / tot * 100) + '%"></i></b></div>';
          var html;
          if (st.akhir) html = head + '<div class="lt-fb good"><b>Tiga pertanyaan selesai.</b> Kamu boleh mengulang latihan kapan saja.</div>' + lapis3();
          else html = head + (q ? '<div class="card lt-q"><b>Pertanyaan</b>' + kal(q.q) + '<button class="btn soft ls-putar">Putar pertanyaan</button></div>' : '') + panduan() +
            (h.fase === 'hasil' || h.ok ? '' : rekamBox(h)) + (h.rek ? lapis1(h) : '') + (hasil ? lapis2(h, q) : '') + (hasil && kode === 'B4-15' ? lapis3() : '') +
            (hasil && kode === 'B5-13' ? '<button class="btn full ls-next">' + (st.i + 1 >= tot ? 'Selesai' : 'Pertanyaan berikutnya') + '</button>' : '');
          root.innerHTML = html; bind();
        }

        function mulaiRekam() {
          var h = cur();
          if (!SU.bisa()) { h.fase = 'tanpa'; return draw(); }
          SU.buka(function (stream) {
            h.fase = 'rekam'; draw();
            var meter = root.querySelector('.lt-meter i'), waktu = root.querySelector('.lt-wkt'), bar = root.querySelector('.ls-zone i');
            rec = SU.rekam(stream, { maks: K.maks, target: K.target,
              onLevel: function (v) { if (meter) meter.style.transform = 'scaleX(' + Math.min(1, v).toFixed(3) + ')'; },
              onDetik: function (d) { if (waktu) waktu.textContent = Math.floor(d / 60) + ':' + ('0' + Math.floor(d % 60)).slice(-2); if (bar) bar.style.transform = 'scaleX(' + Math.min(1, d / K.maks).toFixed(3) + ')'; },
              onSelesai: function (r) {
                stream.getTracks().forEach(function (x) { x.stop(); }); rec = null;
                if (h.rek && h.rek.url) URL.revokeObjectURL(h.rek.url);
                h.rek = r; if (r) urls.push(r.url); h.fase = r ? 'hasil' : 'siap'; simpan(); draw(); if (r) fireDone();
              } });
          }, function () { env.toast && env.toast('Izin mikrofon ditolak. Kamu berlatih dengan suara keras tanpa rekaman.'); h.fase = 'tanpa'; draw(); });
        }
        function rubrik() {
          var tgl = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), nama = (S.name || 'Peserta');
          var rows = (K.kunci === 'jiko' ? [S.lisan && S.lisan.jiko] : (S.lisan && S.lisan.jawab) || []).filter(Boolean);
          var t = 'LEMBAR RUBRIK LATIHAN LISAN — MENSETSU NAVI\nLatihan: ' + K.judul + ' (' + kode + ')\nPeserta: ' + nama + '\nTanggal: ' + tgl + '\n\n' +
            '[Lapis 1 · Analisis otomatis] (perkiraan, bukan nilai; target durasi ' + K.target[0] + '–' + K.target[1] + ' detik)\n' + (rows.length ? profilTeks(rows).map(function (x) { return '- ' + x; }).join('\n') : '- belum ada data') + '\n\n' +
            '[Lapis 2 · Penilaian diri peserta]\n' + st.h.map(function (h, i) { return (soal.length > 1 ? 'Jawaban ' + (i + 1) + ' (' + (soal[i].q.jp) + ')\n' : '') + K.cek.map(function (c, k) { return '  [' + (h.cek[k] ? 'x' : ' ') + '] ' + c; }).join('\n'); }).join('\n') + '\n\n' +
            '[Lapis 3 · Penilaian instruktur] skala 1 (perlu banyak latihan) – 4 (sudah baik)\n' + K.cek.map(function (c) { return '  Skor ___  ' + c; }).join('\n') + '\n\nCatatan instruktur:\n\n\nLatihan ini formatif dan tidak masuk batas lulus 75.\n';
          unduh('rubrik-' + K.file + '.txt', new Blob(['﻿' + t], { type: 'text/plain;charset=utf-8' }));
        }

        function bind() {
          var h = cur(), q = soal[st.i], on = function (s, fn) { root.querySelectorAll(s).forEach(function (e) { e.addEventListener('click', function (ev) { fn(e, ev); }); }); };
          on('.ls-say', function (b) { if (!sayJa(b.dataset.t)) env.toast && env.toast('Suara Jepang belum tersedia di perangkat ini.'); });
          on('.ls-putar', function () { if (!sayJa(q.q.jp)) env.toast && env.toast('Suara Jepang belum tersedia di perangkat ini.'); });
          on('.kv-chip', function (b) { st.mode = b.dataset.mode; draw(); });
          on('.ls-rek', mulaiRekam);
          on('.ls-stop', function () { if (rec) rec.stop(); });
          on('.ls-fin', function () { h.ok = true; h.fase = 'hasil'; simpan(); draw(); fireDone(); });
          on('.ls-ulang', function () { if (h.rek && h.rek.url) URL.revokeObjectURL(h.rek.url); h.rek = null; h.fase = 'siap'; h.ok = false; draw(); });
          on('.ls-next', function () { st.i++; if (st.i >= soal.length) { st.akhir = true; st.i = soal.length - 1; } draw(); window.scrollTo(0, 0); });
          on('.ls-rub', rubrik);
          on('.ls-dl', function () {
            var k = 0; st.h.forEach(function (x, i) { if (!x.rek) return; setTimeout(function () { unduh(K.file + (soal.length > 1 ? '-' + (i + 1) : '') + '.' + ekstensi(x.rek.blob), x.rek.blob); }, 350 * k++); });
          });
          root.querySelectorAll('.ix-chk input').forEach(function (c) {
            c.addEventListener('change', function () {
              h.cek[+c.dataset.c] = c.checked; simpan();
              var ul = root.querySelector('.ls-l3 ul'); if (ul) ul.innerHTML = ringkasL3(); /* profil ikut berubah */
            });
          });
        }

        draw();
      }
    };
  }

  window.MN_LISAN = { widget: widget, KONF: KONF };
})();
