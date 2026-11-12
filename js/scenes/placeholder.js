/* Layar sementara untuk scene yang belum dibangun (S04-S19).
   Dibuat agar menu dan seluruh alur navigasi sudah bisa dicoba sejak prototipe pertama.
   Setiap placeholder akan diganti scene sebenarnya pada langkah pengerjaan berikutnya. */
(function () {
  'use strict';
  var MN = window.MN, Art = MN.Art, UI = MN.UI, h = UI.h;

  var LIST = [
    ['S04', 'Modul 1: Lima Blok Jikoshoukai dan Contoh Audio', 'Langkah 3'],
    ['S05', 'Modul 1: Kosakata dan Ungkapan Kunci', 'Langkah 3'],
    ['S06', 'Modul 1: Susun Jikoshoukai (Drag-and-Drop)', 'Langkah 3'],
    ['S07', 'Modul 1: Hatsuon dan Intonasi', 'Langkah 3'],
    ['S08', 'Modul 2: Nyuushitsu (Masuk Ruangan)', 'Langkah 4'],
    ['S09', 'Modul 2: Ojigi', 'Langkah 4'],
    ['S10', 'Modul 2: Etiket Duduk dan Persiapan', 'Langkah 4'],
    ['S11', 'Modul 3: Pengantar Hou-Ren-Sou', 'Langkah 5'],
    ['S12', 'Modul 3: Empat Studi Kasus Etos Kerja', 'Langkah 5'],
    ['S13', 'Pemeriksaan Modul 1-3', 'Tahap berikutnya'],
    ['S14', 'Modul 4: Briefing dan Latihan Mendengar', 'Tahap berikutnya'],
    ['S15', 'Modul 4: Masuk Ruangan dan Salam', 'Tahap berikutnya'],
    ['S16', 'Modul 4: Tanya-Jawab Inti Wawancara', 'Tahap berikutnya'],
    ['S17', 'Modul 4: Penutup Wawancara', 'Tahap berikutnya'],
    ['S18', 'Modul 5: Rapor Kesiapan Kerja dan Latihan Lagi?', 'Tahap berikutnya'],
    ['S19', 'Selesai', 'Tahap berikutnya']
  ];

  LIST.forEach(function (row) {
    MN.defineScene({
      id: row[0], title: row[1], bare: true, home: true,
      steps: [{
        id: 'ph',
        enter: function (ctx) {
          ctx.el.classList.add('pattern');
          var back = h('button', { class: 'btn' }, 'Kembali ke Menu');
          back.addEventListener('click', function () { MN.Audio.sfx('click'); ctx.goScene('S03'); });
          ctx.el.appendChild(h('div', { class: 'ph' },
            h('div', { class: 'card' },
              h('div', { html: Art.mascot('pose_dagu', '', 'Navi berpikir') }),
              h('span', { class: 'tagline' }, 'Scene ' + row[0] + ' · dikerjakan pada ' + row[2]),
              h('h2', null, row[1]),
              h('p', null, 'Layar ini masih berupa penanda tempat. Isinya akan dibangun sesuai storyboard pada tahap pengerjaan berikutnya.'),
              back)));
        }
      }]
    });
  });
})();
