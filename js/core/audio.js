/* ==========================================================================
   audio.js : pengelola suara
   - Narasi  : memakai file rekaman asli bila tersedia (MN.Config.useRealAudio = true).
               Selama file belum ada, teks narasi tampil sebagai teks bawah layar
               (sekaligus transkrip aksesibilitas) dan durasinya diperkirakan.
   - SFX     : dibuat dengan WebAudio (klik, benar, salah, stempel, dst).
   - Musik   : latar instrumental ringan (tangga nada pentatonik Jepang), dibuat
               dengan WebAudio; bisa diganti file asli lewat MN.Config.
   ========================================================================== */
(function () {
  'use strict';
  var MN = (window.MN = window.MN || {});

  MN.Config = {
    useRealAudio: false,          // ubah ke true saat rekaman asli sudah ada di assets/audio/
    useRealMusic: false,          // ubah ke true bila file musik latar tersedia
    audioBase: 'assets/audio/',
    musicFile: 'musik/bgm.mp3'
  };

  var A = (MN.Audio = { ctx: null, musicOn: false, narr: null, bgmEl: null, step: 0, timer: null });

  /* ---------- Inisialisasi (wajib dipicu oleh klik pengguna) ---------- */
  A.init = function () {
    if (A.ctx) { if (A.ctx.state === 'suspended') A.ctx.resume(); return; }
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      A.ctx = new AC();
      A.master = A.ctx.createGain(); A.master.connect(A.ctx.destination);
      A.sfxGain = A.ctx.createGain(); A.sfxGain.gain.value = 0.55; A.sfxGain.connect(A.master);
      A.musicGain = A.ctx.createGain(); A.musicGain.gain.value = 0.07; A.musicGain.connect(A.master);
      var d = A.ctx.createDelay(1); d.delayTime.value = 0.38;
      var fb = A.ctx.createGain(); fb.gain.value = 0.35;
      d.connect(fb); fb.connect(d); A.musicGain.connect(d); d.connect(A.master);
      A.applyMute();
    } catch (e) { A.ctx = null; }
  };

  A.isMuted = function () { return !!MN.State.data.muted; };
  A.applyMute = function () {
    if (A.master) A.master.gain.value = A.isMuted() ? 0 : 1;
    if (A.bgmEl) A.bgmEl.muted = A.isMuted();
    if (A.narr && A.narr.audio) A.narr.audio.muted = A.isMuted();
  };
  A.setMuted = function (m) { MN.State.data.muted = !!m; MN.State.save(); A.applyMute(); };

  /* ---------- Nada dasar ---------- */
  function tone(freq, dur, o) {
    if (!A.ctx || A.isMuted()) return;
    o = o || {};
    var t0 = A.ctx.currentTime + (o.when || 0);
    var osc = A.ctx.createOscillator(), g = A.ctx.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(o.slideTo, t0 + dur);
    var v = o.vol == null ? 0.5 : o.vol;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(v, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(o.bus || A.sfxGain);
    osc.start(t0); osc.stop(t0 + dur + 0.05);
  }
  function noise(dur, vol, when) {
    if (!A.ctx || A.isMuted()) return;
    var t0 = A.ctx.currentTime + (when || 0), n = Math.floor(A.ctx.sampleRate * dur);
    var buf = A.ctx.createBuffer(1, n, A.ctx.sampleRate), ch = buf.getChannelData(0);
    for (var i = 0; i < n; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / n);
    var src = A.ctx.createBufferSource(), g = A.ctx.createGain();
    src.buffer = buf; g.gain.value = vol; src.connect(g); g.connect(A.sfxGain); src.start(t0);
  }

  var SFX = {
    click: function () { tone(660, 0.07, { type: 'triangle', vol: 0.35 }); },
    reveal: function () { tone(520, 0.12, { type: 'sine', vol: 0.3 }); tone(780, 0.16, { type: 'sine', vol: 0.25, when: 0.06 }); },
    correct: function () { tone(523, 0.14, { type: 'triangle' }); tone(659, 0.14, { type: 'triangle', when: 0.1 }); tone(784, 0.28, { type: 'triangle', when: 0.2 }); },
    partial: function () { tone(440, 0.16, { type: 'triangle', vol: 0.4 }); tone(494, 0.22, { type: 'triangle', vol: 0.4, when: 0.12 }); },
    wrong: function () { tone(220, 0.22, { type: 'sawtooth', vol: 0.28 }); tone(165, 0.3, { type: 'sawtooth', vol: 0.28, when: 0.14 }); },
    meter: function () { tone(400, 0.25, { type: 'sine', vol: 0.3, slideTo: 800 }); },
    meterDown: function () { tone(500, 0.25, { type: 'sine', vol: 0.3, slideTo: 260 }); },
    stamp: function () { tone(110, 0.22, { type: 'sine', vol: 0.8, slideTo: 55 }); noise(0.12, 0.35); },
    unlock: function () { tone(880, 0.06, { type: 'square', vol: 0.18 }); tone(1175, 0.18, { type: 'triangle', vol: 0.35, when: 0.07 }); },
    locked: function () { tone(180, 0.12, { type: 'square', vol: 0.2 }); tone(150, 0.14, { type: 'square', vol: 0.2, when: 0.09 }); },
    swoosh: function () { noise(0.18, 0.12); }
  };
  A.sfx = function (name) { try { if (SFX[name]) SFX[name](); } catch (e) {} };

  /* ---------- Musik latar ---------- */
  var SCALE = [293.66, 329.63, 349.23, 440, 466.16, 587.33];   // D E F A Bb D (nuansa Jepang)
  function musicTick() {
    if (!A.musicOn || !A.ctx || A.isMuted()) return;
    A.step++;
    if (A.step % 8 === 1) { tone(146.83, 3.4, { type: 'sine', vol: 0.55, bus: A.musicGain }); tone(220, 3.4, { type: 'sine', vol: 0.3, bus: A.musicGain }); }
    if (Math.random() > 0.35) {
      var f = SCALE[Math.floor(Math.random() * SCALE.length)];
      tone(f, 1.3, { type: 'triangle', vol: 0.7, bus: A.musicGain });
    }
  }
  A.startMusic = function () {
    A.init();
    if (A.musicOn) return;
    A.musicOn = true;
    if (MN.Config.useRealMusic) {
      A.bgmEl = new Audio(MN.Config.audioBase + MN.Config.musicFile);
      A.bgmEl.loop = true; A.bgmEl.volume = 0.25; A.bgmEl.muted = A.isMuted();
      A.bgmEl.play().catch(function () {});
      return;
    }
    clearInterval(A.timer);
    A.timer = setInterval(musicTick, 900);
    musicTick();
  };

  /* ---------- Narasi ---------- */
  A.stopNarration = function () { if (A.narr) A.narr.finish('cancelled'); };

  /* Mengembalikan Promise: 'done' | 'skipped' | 'cancelled' */
  A.narrate = function (text, o) {
    o = o || {};
    A.stopNarration();
    var n = (A.narr = { audio: null, t: null, closed: false });
    return new Promise(function (resolve) {
      n.finish = function (reason) {
        if (n.closed) return; n.closed = true;
        clearTimeout(n.t);
        if (n.audio) { try { n.audio.pause(); } catch (e) {} }
        if (A.narr === n) A.narr = null;
        if (MN.UI) MN.UI.captionDone(reason);
        resolve(reason);
      };
      if (MN.UI) MN.UI.showCaption(text, o.speaker || 'Narator', function () { n.finish('skipped'); });
      var fallback = function () { if (!n.closed && !n.t) n.t = setTimeout(function () { n.finish('done'); }, Math.max(2600, text.length * 62)); };
      if (MN.Config.useRealAudio && o.file) {
        var el = new Audio(MN.Config.audioBase + (o.speaker === 'Navi' ? 'narator/' : 'narator/') + o.file + '.mp3');
        n.audio = el; el.muted = A.isMuted();
        el.addEventListener('ended', function () { n.finish('done'); });
        el.addEventListener('error', fallback);
        el.play().catch(fallback);
      } else {
        fallback();
      }
    });
  };

  /* Memutar rekaman singkat (kalimat Jepang, HRD, dsb). Dipakai mulai langkah berikutnya. */
  A.playClip = function (path, textFallback) {
    if (!MN.Config.useRealAudio) { if (MN.UI) MN.UI.toast('🔊 ' + (textFallback || 'Audio (rekaman asli menyusul)')); return Promise.resolve('placeholder'); }
    return new Promise(function (resolve) {
      var el = new Audio(MN.Config.audioBase + path);
      el.muted = A.isMuted();
      el.addEventListener('ended', function () { resolve('done'); });
      el.addEventListener('error', function () { if (MN.UI) MN.UI.toast('File audio belum ada: ' + path); resolve('missing'); });
      el.play().catch(function () { resolve('blocked'); });
    });
  };
})();
