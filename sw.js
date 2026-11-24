/* Service worker Mensetsu Navi: menyimpan aplikasi agar bisa dipakai tanpa internet.
   Daftar dan VERSION diperbarui oleh tools/build_sw.py setiap kali isi berubah. */
var VERSION = 'mn-554533b7de';
var PRECACHE = [
 "./",
 "index.html",
 "rak.html",
 "manifest.webmanifest",
 "css/app.css",
 "js/app.js",
 "js/interaktif.js",
 "js/jikoshoukai.js",
 "js/kosakata.js",
 "js/suara.js",
 "js/lisan.js",
 "js/simrek.js",
 "js/latihan.js",
 "js/tips.js",
 "js/navi.js",
 "js/store.js",
 "js/data/kursus.js",
 "js/data/tampilan.js",
 "vendor/three.module.min.js",
 "vendor/three.core.min.js",
 "assets/favicon.svg",
 "assets/icon-192.png",
 "assets/icon-512.png",
 "assets/navi/act_berbicara.webp",
 "assets/navi/act_memberi_salam.webp",
 "assets/navi/act_presentasi.webp",
 "assets/navi/act_smartphone.webp",
 "assets/navi/exp_berpikir.webp",
 "assets/navi/exp_bingung.webp",
 "assets/navi/exp_gugup.webp",
 "assets/navi/exp_menangis.webp",
 "assets/navi/exp_netral.webp",
 "assets/navi/exp_percaya_diri.webp",
 "assets/navi/exp_sedih.webp",
 "assets/navi/exp_senang.webp",
 "assets/navi/pose_berdiri.webp",
 "assets/navi/pose_berlari.webp",
 "assets/navi/pose_dagu.webp",
 "assets/navi/pose_duduk.webp",
 "assets/navi/pose_jempol.webp",
 "assets/navi/pose_melambai.webp",
 "assets/navi/pose_melompat.webp",
 "assets/navi/pose_menunduk.webp",
 "assets/navi/pose_menunjuk.webp",
 "assets/navi/pose_menyilang.webp",
 "assets/navi/pose_semangat.webp",
 "assets/bg/kantor_eksterior.webp",
 "assets/bg/koridor.webp",
 "assets/bg/lobi.webp",
 "assets/bg/peta.webp",
 "assets/bg/ruang_wawancara.webp",
 "assets/bg/stasiun.webp"
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(PRECACHE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION && k.indexOf('mn-') === 0; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  // font Google & rekaman audio: simpan saat pertama dipakai
  var runtime = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname) || url.pathname.indexOf('/assets/audio/') >= 0 || url.pathname.indexOf('/assets/video/') >= 0;
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(function (hit) {
    if (hit) return hit;
    return fetch(req).then(function (res) {
      if (runtime && (res.ok || res.type === 'opaque')) {
        var copy = res.clone(); caches.open(VERSION + '-rt').then(function (c) { c.put(req, copy); });
      }
      return res;
    }).catch(function () {
      if (req.mode === 'navigate') return caches.match('index.html');
    });
  }));
});
