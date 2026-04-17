/* ==========================================================
   Particles — fundo ambiente com símbolos flutuando devagar
   ========================================================== */

(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-bg';
  canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const EMOJIS = ['🗡', '🃏', '🎁', '?', '✦', '✧', '☠', '🎭', '🎲'];
  const DENSITY = 22;
  const particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function spawn(initial = false) {
    return {
      x: Math.random() * canvas.width,
      y: initial ? Math.random() * canvas.height : canvas.height + 40,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      size: 16 + Math.random() * 26,
      speed: 0.15 + Math.random() * 0.65,
      drift: (Math.random() - 0.5) * 0.3,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.015,
      alpha: 0.1 + Math.random() * 0.22
    };
  }

  for (let i = 0; i < DENSITY; i++) particles.push(spawn(true));

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y -= p.speed;
      p.x += p.drift;
      p.rot += p.rotSpeed;
      if (p.y < -50) { particles[i] = spawn(); continue; }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha;
      ctx.font = `${p.size}px "Creepster", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.emoji, 0, 0);
      ctx.restore();
    }
    requestAnimationFrame(loop);
  }

  // respeita prefers-reduced-motion
  if (!window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    loop();
  }
})();
