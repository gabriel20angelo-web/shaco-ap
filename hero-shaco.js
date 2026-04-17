/* ==========================================================
   Hero Shaco 3D — Shaco interativo no topo da landing
   depende de THREE.js e de um canvas com id="hero-canvas"
   ========================================================== */

(function () {
  if (typeof THREE === 'undefined') return;

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const COLORS = {
    green: 0x39ff14, purple: 0xa020f0, acid: 0xcaff00,
    skin: 0xf0d5b8, dagger: 0xcccccc
  };

  const scene = new THREE.Scene();
  scene.background = null;

  function sizeCanvas() {
    const r = canvas.getBoundingClientRect();
    return { w: r.width || 320, h: r.height || 320 };
  }

  const { w, h } = sizeCanvas();
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 50);
  camera.position.set(0, 1, 8);
  camera.lookAt(0, 0.5, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h, false);

  scene.add(new THREE.AmbientLight(0x707090, 0.55));
  const purple = new THREE.PointLight(COLORS.purple, 2.5, 20);
  purple.position.set(-4, 3, 4);
  scene.add(purple);
  const green = new THREE.PointLight(COLORS.green, 2.5, 20);
  green.position.set(4, -2, 4);
  scene.add(green);

  function mat(color, opts = {}) {
    return new THREE.MeshStandardMaterial({
      color, roughness: opts.roughness ?? 0.5, metalness: opts.metalness ?? 0,
      emissive: opts.emissive ?? 0x000000, emissiveIntensity: opts.emissiveIntensity ?? 0
    });
  }

  function buildShaco() {
    const g = new THREE.Group();

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.7, 22, 20), mat(COLORS.skin, { roughness: 0.75 }));
    head.position.y = 1.5;
    g.add(head);

    // Olhos grandes brilhantes — principal gimmick
    const eyeMat = mat(COLORS.green, { emissive: COLORS.green, emissiveIntensity: 2.5 });
    const eyeGeo = new THREE.SphereGeometry(0.13, 12, 12);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.24, 1.6, 0.62);
    eyeL.name = 'eye';
    g.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.24, 1.6, 0.62);
    eyeR.name = 'eye';
    g.add(eyeR);

    // Sorrisinho
    const mouth = new THREE.Mesh(
      new THREE.TorusGeometry(0.2, 0.05, 8, 14, Math.PI),
      mat(0x3a0020)
    );
    mouth.position.set(0, 1.35, 0.65);
    mouth.rotation.z = Math.PI;
    g.add(mouth);

    // Chapéu 2 pontas
    const hatG = mat(COLORS.green, { emissive: 0x0f4010, emissiveIntensity: 0.4 });
    const hatP = mat(COLORS.purple, { emissive: 0x300860, emissiveIntensity: 0.4 });

    const h1 = new THREE.Mesh(new THREE.ConeGeometry(0.38, 1.35, 9), hatG);
    h1.position.set(-0.42, 2.5, 0);
    h1.rotation.z = Math.PI / 7;
    g.add(h1);

    const h2 = new THREE.Mesh(new THREE.ConeGeometry(0.38, 1.35, 9), hatP);
    h2.position.set(0.42, 2.5, 0);
    h2.rotation.z = -Math.PI / 7;
    g.add(h2);

    const ballGeo = new THREE.SphereGeometry(0.18, 12, 12);
    const ball1 = new THREE.Mesh(ballGeo, hatP);
    ball1.position.set(-0.85, 3.1, 0);
    g.add(ball1);
    const ball2 = new THREE.Mesh(ballGeo, hatG);
    ball2.position.set(0.85, 3.1, 0);
    g.add(ball2);

    // Corpo / colar
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 0.75), hatG);
    body.position.y = 0.3;
    g.add(body);
    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.78), hatP);
    chest.position.set(0, 0.3, 0.02);
    g.add(chest);

    // Braços
    const armGeo = new THREE.CylinderGeometry(0.16, 0.14, 1.2, 12);
    const armL = new THREE.Mesh(armGeo, hatG);
    armL.position.set(-0.82, 0.3, 0);
    armL.rotation.z = Math.PI / 9;
    g.add(armL);
    const armR = new THREE.Mesh(armGeo, hatP);
    armR.position.set(0.82, 0.1, 0);
    armR.rotation.z = -Math.PI / 4;
    g.add(armR);

    // Mãos
    const handGeo = new THREE.SphereGeometry(0.18, 12, 12);
    const handL = new THREE.Mesh(handGeo, mat(COLORS.skin));
    handL.position.set(-1.12, -0.3, 0);
    g.add(handL);
    const handR = new THREE.Mesh(handGeo, mat(COLORS.skin));
    handR.position.set(1.25, -0.3, 0);
    g.add(handR);

    // Pernas
    const legGeo = new THREE.CylinderGeometry(0.2, 0.22, 1.0, 12);
    const legL = new THREE.Mesh(legGeo, hatP);
    legL.position.set(-0.3, -1.0, 0);
    g.add(legL);
    const legR = new THREE.Mesh(legGeo, hatG);
    legR.position.set(0.3, -1.0, 0);
    g.add(legR);

    // Sapatos bicudos
    const shoeMat = mat(COLORS.acid, { emissive: COLORS.acid, emissiveIntensity: 0.5 });
    const shoeGeo = new THREE.ConeGeometry(0.25, 0.5, 7);
    const shoeL = new THREE.Mesh(shoeGeo, shoeMat);
    shoeL.position.set(-0.3, -1.6, 0.18);
    shoeL.rotation.x = Math.PI / 2;
    g.add(shoeL);
    const shoeR = new THREE.Mesh(shoeGeo, shoeMat);
    shoeR.position.set(0.3, -1.6, 0.18);
    shoeR.rotation.x = Math.PI / 2;
    g.add(shoeR);

    // Adaga
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.85, 0.025),
      mat(COLORS.dagger, { metalness: 0.95, roughness: 0.15 })
    );
    blade.position.set(1.42, -0.02, 0.22);
    blade.rotation.z = Math.PI / 6;
    g.add(blade);

    const handle = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.25, 0.09),
      mat(0x4a2a00)
    );
    handle.position.set(1.32, -0.42, 0.22);
    g.add(handle);

    // Aura roxa sutil em volta
    const aura = new THREE.Mesh(
      new THREE.SphereGeometry(2.6, 16, 16),
      new THREE.MeshBasicMaterial({ color: COLORS.acid, transparent: true, opacity: 0.06, side: THREE.DoubleSide })
    );
    g.add(aura);
    g.userData.aura = aura;
    g.userData.head = head;
    g.userData.eyes = [eyeL, eyeR];

    return g;
  }

  const shaco = buildShaco();
  scene.add(shaco);

  // Clones que spawnam em volta
  const clones = [];
  function spawnClone() {
    const c = buildShaco();
    c.scale.multiplyScalar(0.35 + Math.random() * 0.15);
    const angle = Math.random() * Math.PI * 2;
    const r = 2.5 + Math.random() * 1;
    c.position.set(Math.cos(angle) * r, -1 + Math.random() * 2, Math.sin(angle) * r);
    c.userData.life = 1;
    c.userData.vy = 0.03 + Math.random() * 0.02;
    c.userData.rotSpeed = (Math.random() - 0.5) * 0.08;
    c.userData.fadeStart = performance.now() + 1800;
    scene.add(c);
    clones.push(c);
  }

  // Mouse follow
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouseX = ((e.clientX - r.left) / r.width) * 2 - 1;
    mouseY = -((e.clientY - r.top) / r.height) * 2 + 1;
  });

  // Click no canvas spawna clones
  canvas.addEventListener('click', (e) => {
    e.stopPropagation();
    for (let i = 0; i < 3; i++) spawnClone();
    if (window.ShacoAudio?.isEnabled()) window.ShacoAudio.laugh();
  });

  // Resize
  window.addEventListener('resize', () => {
    const { w, h } = sizeCanvas();
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  });

  // Loop
  function loop() {
    requestAnimationFrame(loop);
    const t = performance.now() * 0.001;

    // Shaco principal flutua e olha pro cursor sutilmente
    shaco.rotation.y = Math.sin(t * 0.4) * 0.35 + mouseX * 0.4;
    shaco.position.y = Math.sin(t * 1.2) * 0.25;
    if (shaco.userData.head) {
      shaco.userData.head.rotation.x = -mouseY * 0.2;
      shaco.userData.head.rotation.y = mouseX * 0.3;
    }
    if (shaco.userData.aura) {
      const s = 1 + Math.sin(t * 2) * 0.08;
      shaco.userData.aura.scale.setScalar(s);
      shaco.userData.aura.material.opacity = 0.05 + Math.sin(t * 2) * 0.03;
    }

    // Clones fadeout
    for (let i = clones.length - 1; i >= 0; i--) {
      const c = clones[i];
      c.rotation.y += c.userData.rotSpeed;
      c.position.y += c.userData.vy;
      const now = performance.now();
      if (now > c.userData.fadeStart) {
        c.userData.life -= 0.03;
        c.scale.multiplyScalar(0.95);
        if (c.userData.life <= 0) {
          scene.remove(c);
          clones.splice(i, 1);
        }
      }
    }

    renderer.render(scene, camera);
  }

  loop();

  // Exposto pra quem quiser disparar clones de fora (tipo botão "invocar")
  window.HeroShaco = {
    spawnClones(n = 3) { for (let i = 0; i < n; i++) spawnClone(); }
  };
})();
