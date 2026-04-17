/* ==========================================================
   ShacoAudio — SFX sintetizados via Web Audio API
   compartilhado entre site e jogo
   ========================================================== */

window.ShacoAudio = (function () {
  let ctx = null;
  let master = null;
  let enabled = false;

  function init() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.25;
    master.connect(ctx.destination);
  }

  function enable() {
    init();
    if (!ctx) return false;
    enabled = true;
    if (ctx.state === 'suspended') ctx.resume();
    return true;
  }

  function disable() { enabled = false; }
  function toggle() { return enabled ? (disable(), false) : enable(); }
  function isEnabled() { return enabled; }
  function setVolume(v) { if (master) master.gain.value = Math.max(0, Math.min(1, v)); }

  function env(g, atk, dec, sus, rel, peak = 0.3, susLvl = 0.2) {
    const t = ctx.currentTime;
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + atk);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0001, susLvl), t + atk + dec);
    g.gain.setValueAtTime(Math.max(0.0001, susLvl), t + atk + dec + sus);
    g.gain.exponentialRampToValueAtTime(0.0001, t + atk + dec + sus + rel);
  }

  function laugh() {
    if (!enabled || !ctx) return;
    const notes = [520, 660, 590, 440];
    notes.forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      const filt = ctx.createBiquadFilter();
      filt.type = 'lowpass';
      filt.frequency.value = 1800;
      o.type = 'square';
      o.frequency.setValueAtTime(f, ctx.currentTime + i * 0.09);
      o.frequency.exponentialRampToValueAtTime(f * 0.85, ctx.currentTime + i * 0.09 + 0.1);
      g.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.09);
      g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + i * 0.09 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.09 + 0.1);
      o.connect(g); g.connect(filt); filt.connect(master);
      o.start(ctx.currentTime + i * 0.09);
      o.stop(ctx.currentTime + i * 0.09 + 0.12);
    });
  }

  function boxOpen() {
    if (!enabled || !ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(700, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.18);
    o.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.35);
    env(g, 0.005, 0.08, 0.15, 0.15, 0.25, 0.1);
    o.connect(g); g.connect(master);
    o.start(); o.stop(ctx.currentTime + 0.5);
  }

  function explode() {
    if (!enabled || !ctx) return;
    const bufSize = ctx.sampleRate * 0.6;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 2.5);
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(1500, ctx.currentTime);
    filt.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.5);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.4, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
    noise.connect(filt); filt.connect(g); g.connect(master);
    noise.start();
  }

  function deceive() {
    if (!enabled || !ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(260, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 1.2);
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.4);
    o.connect(g); g.connect(master);
    o.start(); o.stop(ctx.currentTime + 1.5);
  }

  function crit() {
    if (!enabled || !ctx) return;
    const notes = [880, 1100, 1320, 1760];
    notes.forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.045);
      g.gain.exponentialRampToValueAtTime(0.28, ctx.currentTime + i * 0.045 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.045 + 0.18);
      o.connect(g); g.connect(master);
      o.start(ctx.currentTime + i * 0.045);
      o.stop(ctx.currentTime + i * 0.045 + 0.2);
    });
  }

  function atrasDeVoce() {
    if (!enabled || !ctx) return;
    // "atrás de você" — tom baixo ominoso descendente + laugh depois
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = 800;
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(140, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.9);
    g.gain.setValueAtTime(0.001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1);
    o.connect(g); g.connect(filt); filt.connect(master);
    o.start(); o.stop(ctx.currentTime + 1.1);
    setTimeout(() => laugh(), 600);
  }

  function backstab() {
    if (!enabled || !ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(2000, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.25);
    g.gain.setValueAtTime(0.25, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
    o.connect(g); g.connect(master);
    o.start(); o.stop(ctx.currentTime + 0.35);
  }

  function miss() {
    if (!enabled || !ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(250, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.2);
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
    o.connect(g); g.connect(master);
    o.start(); o.stop(ctx.currentTime + 0.3);
  }

  function card() {
    if (!enabled || !ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(1200, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
    g.gain.setValueAtTime(0.18, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
    o.connect(g); g.connect(master);
    o.start(); o.stop(ctx.currentTime + 0.25);
  }

  function slot() {
    if (!enabled || !ctx) return;
    // 3 cliques rápidos
    for (let i = 0; i < 3; i++) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(400 + i * 150, ctx.currentTime + i * 0.08);
      g.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.08);
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + i * 0.08 + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.08 + 0.04);
      o.connect(g); g.connect(master);
      o.start(ctx.currentTime + i * 0.08);
      o.stop(ctx.currentTime + i * 0.08 + 0.05);
    }
  }

  return {
    enable, disable, toggle, isEnabled, setVolume,
    laugh, boxOpen, explode, deceive, crit, atrasDeVoce, backstab, miss, card, slot
  };
})();
