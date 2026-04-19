/* ==========================================================
   Invis Shacos — palhaços saindo da invisibilidade em pontos
   aleatórios da página. Efeito Deceive (shimmer azul/verde) →
   Shaco materializa → ri → vira fumaça verde e some.
   ========================================================== */

(function () {
  const SHACO_GIFS = [
    'https://media.tenor.com/X95_fOkzFOIAAAAM/shaco-honsementioned.gif',
    'https://media.tenor.com/BT1t3WFaDSsAAAAM/i-jest-shaco.gif',
    'https://media.tenor.com/yeR2U7TIIvMAAAAM/shaco-q-league-of-legends.gif',
    'https://media.tenor.com/iwJuc1p4kl0AAAAM/shaco.gif',
    'https://media.tenor.com/m0-ZQAVlx18AAAAM/shaco-robator.gif',
    'https://media.tenor.com/Hq7KtCAo7i0AAAAM/lolgel.gif',
    'https://media.tenor.com/jb3P5ykckQoAAAAM/shaco-league-of-legends.gif',
    'https://media.tenor.com/-Jvum_maHkIAAAAM/shaco-league-of-legends-clone.gif'
  ];

  const HA_LINES = ['HA!', 'HAHA!', 'te peguei.', 'truque!', '🃏', 'olha atrás', 'achou?'];

  const layer = document.createElement('div');
  layer.id = 'invis-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);

  function pickSpawnPoint(size) {
    const margin = size * 0.6;
    const minX = margin;
    const maxX = window.innerWidth - margin;
    const minY = margin;
    const maxY = window.innerHeight - margin;
    return {
      x: minX + Math.random() * Math.max(0, maxX - minX),
      y: minY + Math.random() * Math.max(0, maxY - minY)
    };
  }

  function spawnInvisShaco(opts = {}) {
    const size = opts.size || (90 + Math.random() * 70);
    const point = opts.point || pickSpawnPoint(size);
    const gif = opts.gif || SHACO_GIFS[Math.floor(Math.random() * SHACO_GIFS.length)];

    const wrap = document.createElement('div');
    wrap.className = 'invis-shaco';
    wrap.style.left = point.x + 'px';
    wrap.style.top = point.y + 'px';
    wrap.style.setProperty('--size', size + 'px');

    // Fase 1: shimmer Deceive (anel verde + ripple roxo)
    const shimmer = document.createElement('div');
    shimmer.className = 'invis-shimmer';
    wrap.appendChild(shimmer);

    // Fase 2: shaco materializa
    const img = document.createElement('img');
    img.src = gif;
    img.alt = '';
    img.className = 'invis-img';
    img.loading = 'lazy';
    wrap.appendChild(img);

    // Olhos verdes brilhando primeiro (entram antes do gif)
    const eyes = document.createElement('div');
    eyes.className = 'invis-eyes';
    eyes.innerHTML = '<span></span><span></span>';
    wrap.appendChild(eyes);

    // Fala "HA!" no clímax
    const ha = document.createElement('span');
    ha.className = 'invis-ha';
    ha.textContent = HA_LINES[Math.floor(Math.random() * HA_LINES.length)];
    wrap.appendChild(ha);

    // Fumaça verde no fade-out
    const smoke = document.createElement('div');
    smoke.className = 'invis-smoke';
    wrap.appendChild(smoke);

    layer.appendChild(wrap);

    // Sons
    const audio = window.ShacoAudio;
    if (audio?.isEnabled?.()) {
      audio.deceive?.();
      setTimeout(() => audio.laugh?.(), 700);
    }

    setTimeout(() => wrap.remove(), 3200);
  }

  function spawnBurst(n) {
    const count = Math.max(1, n | 0);
    for (let i = 0; i < count; i++) {
      setTimeout(spawnInvisShaco, i * 180);
    }
  }

  // Auto-spawn periódico
  let autoTimer = null;
  function scheduleAuto() {
    const delay = 14000 + Math.random() * 18000; // 14-32s
    autoTimer = setTimeout(() => {
      if (!document.hidden) spawnInvisShaco();
      scheduleAuto();
    }, delay);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && autoTimer) {
      clearTimeout(autoTimer);
      autoTimer = null;
    } else if (!document.hidden && !autoTimer) {
      scheduleAuto();
    }
  });

  // Primeira aparição: 8s depois do load (depois do welcome modal)
  setTimeout(() => {
    spawnInvisShaco();
    scheduleAuto();
  }, 8000);

  window.InvisShacos = {
    spawn: spawnInvisShaco,
    burst: spawnBurst
  };
})();
