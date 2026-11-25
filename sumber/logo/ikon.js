/* Buat ikon aplikasi (PNG) dan PNG logo untuk dokumen dari SVG di assets/logo/.
   Jalankan dari akar repo, sesudah buat_logo.py:  node sumber/logo/ikon.js
   Perlu Playwright + Chromium (require('playwright')).
   Hasil: assets/icon-192.png, assets/icon-512.png (emblem di kotak navy),
          sumber/logo/png/logo-{tegak,mendatar}-{putih,navy}.png (latar transparan, untuk Word/slide). */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const AKAR = path.resolve(__dirname, '..', '..');
const svg = f => 'data:image/svg+xml;base64,' + fs.readFileSync(path.join(AKAR, f)).toString('base64');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 600, height: 600 }, deviceScaleFactor: 1 });
  // ikon aplikasi: emblem 80% di kotak navy
  for (const n of [192, 512]) {
    await p.setViewportSize({ width: n, height: n });
    await p.setContent(`<body style="margin:0;background:#0E2A47;display:grid;place-items:center;width:${n}px;height:${n}px">
      <img src="${svg('assets/favicon.svg')}" style="width:${Math.round(n * 0.8)}px;height:${Math.round(n * 0.8)}px"></body>`);
    await p.waitForTimeout(200);
    await p.screenshot({ path: path.join(AKAR, 'assets', `icon-${n}.png`) });
    console.log('assets/icon-' + n + '.png');
  }
  // PNG dokumen: tinggi 1600 px (tegak) / 1000 px (mendatar), latar transparan
  fs.mkdirSync(path.join(__dirname, 'png'), { recursive: true });
  for (const [model, tinggi] of [['tegak', 1600], ['mendatar', 1000]]) {
    for (const varian of ['putih', 'navy']) {
      const f = `assets/logo/logo-${model}-${varian}.svg`;
      const vb = fs.readFileSync(path.join(AKAR, f), 'utf8').match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
      const lebar = Math.round(tinggi * vb[2] / vb[3]);
      await p.setViewportSize({ width: lebar, height: tinggi });
      await p.setContent(`<body style="margin:0;background:transparent"><img src="${svg(f)}" style="display:block;width:${lebar}px;height:${tinggi}px"></body>`);
      await p.waitForTimeout(200);
      const out = path.join(__dirname, 'png', `logo-${model}-${varian}.png`);
      await p.screenshot({ path: out, omitBackground: true });
      console.log(path.relative(AKAR, out), lebar + 'x' + tinggi);
    }
  }
  await b.close();
})();
