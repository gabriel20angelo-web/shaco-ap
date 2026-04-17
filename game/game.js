/* ==========================================================
   ACHE O SHACO — three.js game
   ========================================================== */

const COLORS = {
  green: 0x39ff14,
  purple: 0xa020f0,
  acid: 0xcaff00,
  blood: 0x8b0000,
  skin: 0xf0d5b8,
  dagger: 0xcccccc
};

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randRange = (a, b) => Math.random() * (b - a) + a;
const A = () => window.ShacoAudio;

/* ===== Cena ===== */

const canvasWrap = document.getElementById('canvas-wrap');

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x0a0014, 18, 45);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 3, 18);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
canvasWrap.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0x606080, 0.6));

const purpleLight = new THREE.PointLight(COLORS.purple, 2.5, 40);
purpleLight.position.set(-10, 8, 8);
scene.add(purpleLight);

const greenLight = new THREE.PointLight(COLORS.green, 2.5, 40);
greenLight.position.set(10, -4, 8);
scene.add(greenLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 0.3);
keyLight.position.set(0, 10, 10);
scene.add(keyLight);

/* ===== Fábrica de Shaco ===== */

function makeMat(hex, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color: hex,
    roughness: opts.roughness ?? 0.55,
    metalness: opts.metalness ?? 0,
    emissive: opts.emissive ?? 0x000000,
    emissiveIntensity: opts.emissiveIntensity ?? 0,
    transparent: false,
    opacity: 1
  });
}

function createShaco(variant = 'real') {
  const g = new THREE.Group();

  const isClone = variant === 'clone';
  const tint = isClone ? 0.7 : 1;

  /* Cabeça */
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 20, 18),
    makeMat(COLORS.skin, { roughness: 0.7 })
  );
  head.position.y = 1.5;
  g.add(head);

  /* Olhos (verdes brilhantes) */
  const eyeMat = makeMat(COLORS.green, {
    emissive: COLORS.green,
    emissiveIntensity: isClone ? 0.8 : 2.2
  });
  const eyeGeo = new THREE.SphereGeometry(0.1, 10, 10);
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-0.23, 1.58, 0.62);
  g.add(eyeL);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeR.position.set(0.23, 1.58, 0.62);
  g.add(eyeR);

  /* Sorriso (linha) */
  const mouthMat = makeMat(0x4a0020, { roughness: 0.5 });
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.04, 8, 12, Math.PI), mouthMat);
  mouth.position.set(0, 1.35, 0.65);
  mouth.rotation.z = Math.PI;
  g.add(mouth);

  /* Chapéu de bobo — 2 pontas */
  const hatMat1 = makeMat(COLORS.green, { emissive: 0x0f4010, emissiveIntensity: 0.3 * tint });
  const hatMat2 = makeMat(COLORS.purple, { emissive: 0x300860, emissiveIntensity: 0.3 * tint });

  const hat1 = new THREE.Mesh(new THREE.ConeGeometry(0.38, 1.3, 8), hatMat1);
  hat1.position.set(-0.4, 2.45, 0);
  hat1.rotation.z = Math.PI / 7;
  g.add(hat1);

  const hat2 = new THREE.Mesh(new THREE.ConeGeometry(0.38, 1.3, 8), hatMat2);
  hat2.position.set(0.4, 2.45, 0);
  hat2.rotation.z = -Math.PI / 7;
  g.add(hat2);

  /* Bolinhas das pontas */
  const ballGeo = new THREE.SphereGeometry(0.17, 10, 10);
  const ball1 = new THREE.Mesh(ballGeo, hatMat2);
  ball1.position.set(-0.82, 3.05, 0);
  g.add(ball1);
  const ball2 = new THREE.Mesh(ballGeo, hatMat1);
  ball2.position.set(0.82, 3.05, 0);
  g.add(ball2);

  /* Banda da testa */
  const bandMat = makeMat(COLORS.acid, { emissive: COLORS.acid, emissiveIntensity: 0.4 });
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.08, 8, 20), bandMat);
  band.position.y = 1.85;
  band.rotation.x = Math.PI / 2;
  g.add(band);

  /* Corpo — tronco */
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 1.4, 0.75),
    hatMat1
  );
  body.position.y = 0.3;
  g.add(body);

  /* Peitoral roxo (losango) */
  const chest = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 1.15, 0.78),
    hatMat2
  );
  chest.position.set(0, 0.3, 0.01);
  g.add(chest);

  /* Cinto */
  const beltMat = makeMat(0x2a0040);
  const belt = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.18, 0.8), beltMat);
  belt.position.y = -0.35;
  g.add(belt);
  const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.22, 0.05), makeMat(COLORS.acid, { emissive: COLORS.acid, emissiveIntensity: 0.5 }));
  buckle.position.set(0, -0.35, 0.42);
  g.add(buckle);

  /* Braços */
  const armGeo = new THREE.CylinderGeometry(0.16, 0.14, 1.2, 10);
  const armL = new THREE.Mesh(armGeo, hatMat1);
  armL.position.set(-0.82, 0.3, 0);
  armL.rotation.z = Math.PI / 9;
  g.add(armL);
  const armR = new THREE.Mesh(armGeo, hatMat2);
  armR.position.set(0.82, 0.1, 0);
  armR.rotation.z = -Math.PI / 4;
  g.add(armR);

  /* Mãos */
  const handGeo = new THREE.SphereGeometry(0.18, 10, 10);
  const handL = new THREE.Mesh(handGeo, makeMat(COLORS.skin));
  handL.position.set(-1.1, -0.3, 0);
  g.add(handL);
  const handR = new THREE.Mesh(handGeo, makeMat(COLORS.skin));
  handR.position.set(1.25, -0.3, 0);
  g.add(handR);

  /* Pernas */
  const legGeo = new THREE.CylinderGeometry(0.2, 0.22, 1.0, 10);
  const legL = new THREE.Mesh(legGeo, hatMat2);
  legL.position.set(-0.3, -1.0, 0);
  g.add(legL);
  const legR = new THREE.Mesh(legGeo, hatMat1);
  legR.position.set(0.3, -1.0, 0);
  g.add(legR);

  /* Sapatos bicudos */
  const shoeGeo = new THREE.ConeGeometry(0.25, 0.45, 6);
  const shoeL = new THREE.Mesh(shoeGeo, makeMat(COLORS.acid, { emissive: COLORS.acid, emissiveIntensity: 0.4 }));
  shoeL.position.set(-0.3, -1.6, 0.15);
  shoeL.rotation.x = Math.PI / 2;
  g.add(shoeL);
  const shoeR = new THREE.Mesh(shoeGeo, makeMat(COLORS.acid, { emissive: COLORS.acid, emissiveIntensity: 0.4 }));
  shoeR.position.set(0.3, -1.6, 0.15);
  shoeR.rotation.x = Math.PI / 2;
  g.add(shoeR);

  /* Adaga na mão direita */
  const blade = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.8, 0.02),
    makeMat(COLORS.dagger, { metalness: 0.9, roughness: 0.2 })
  );
  blade.position.set(1.4, -0.05, 0.2);
  blade.rotation.z = Math.PI / 6;
  g.add(blade);

  const handle = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.22, 0.08),
    makeMat(0x4a2a00)
  );
  handle.position.set(1.3, -0.4, 0.2);
  g.add(handle);

  /* Aura extra pro shaco real */
  if (variant === 'real') {
    const auraMat = new THREE.MeshBasicMaterial({
      color: COLORS.acid,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide
    });
    const aura = new THREE.Mesh(new THREE.SphereGeometry(2.4, 16, 16), auraMat);
    g.add(aura);
    g.userData.aura = aura;
  }

  /* Variant clone: ligeiramente menor, tom diferente, menos brilho */
  if (isClone) {
    g.scale.multiplyScalar(randRange(0.7, 0.95));
    // Inverter: espelhar em X pra variar
    if (Math.random() > 0.5) g.scale.x *= -1;
    g.rotation.z = randRange(-0.15, 0.15);
  }

  g.userData.type = variant === 'real' ? 'real-shaco' : 'clone';
  return g;
}

function createBox() {
  const g = new THREE.Group();

  const boxMat = makeMat(COLORS.purple, { roughness: 0.4 });
  const ribbonMat = makeMat(COLORS.green, { emissive: 0x1a4d0a, emissiveIntensity: 0.4 });

  const box = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.3, 1.3), boxMat);
  g.add(box);

  /* Fitas cruzadas */
  const r1 = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.18, 0.18), ribbonMat);
  g.add(r1);
  const r2 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.35, 0.18), ribbonMat);
  g.add(r2);
  const r3 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 1.35), ribbonMat);
  g.add(r3);

  /* Laço no topo — 2 esferas e um quadrado */
  const bow = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 10), ribbonMat);
  bow.position.y = 0.8;
  g.add(bow);

  const bowL = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), ribbonMat);
  bowL.position.set(-0.25, 0.85, 0);
  g.add(bowL);
  const bowR = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), ribbonMat);
  bowR.position.set(0.25, 0.85, 0);
  g.add(bowR);

  /* Símbolo ? na frente */
  const questionMat = makeMat(COLORS.acid, { emissive: COLORS.acid, emissiveIntensity: 0.6 });
  const qDot = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), questionMat);
  qDot.position.set(0, -0.2, 0.66);
  g.add(qDot);
  const qCurve = new THREE.Mesh(
    new THREE.TorusGeometry(0.18, 0.05, 8, 12, Math.PI * 1.1),
    questionMat
  );
  qCurve.position.set(0, 0.1, 0.66);
  qCurve.rotation.z = -Math.PI / 2;
  g.add(qCurve);

  g.userData.type = 'box';
  return g;
}

function createExplodedShaco() {
  const g = new THREE.Group();

  const mats = [
    makeMat(COLORS.green),
    makeMat(COLORS.purple),
    makeMat(COLORS.skin),
    makeMat(COLORS.acid, { emissive: COLORS.acid, emissiveIntensity: 0.2 })
  ];

  /* Fragmentos espalhados tipo peças quebradas */
  for (let i = 0; i < 10; i++) {
    const mat = rand(mats);
    let geo;
    const r = Math.random();
    if (r < 0.4) {
      geo = new THREE.BoxGeometry(randRange(0.3, 0.7), randRange(0.3, 0.7), randRange(0.3, 0.7));
    } else if (r < 0.7) {
      geo = new THREE.SphereGeometry(randRange(0.2, 0.4), 8, 8);
    } else {
      geo = new THREE.ConeGeometry(randRange(0.15, 0.3), randRange(0.3, 0.6), 6);
    }
    const piece = new THREE.Mesh(geo, mat);
    piece.position.set(
      randRange(-1.1, 1.1),
      randRange(-1.1, 1.1),
      randRange(-1.1, 1.1)
    );
    piece.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    g.add(piece);
    piece.userData.spin = (Math.random() - 0.5) * 0.04;
  }

  /* Uma "nuvem" roxa translúcida */
  const cloud = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 16, 16),
    new THREE.MeshBasicMaterial({ color: COLORS.purple, transparent: true, opacity: 0.15 })
  );
  g.add(cloud);

  g.userData.type = 'exploded';
  return g;
}

/* ===== Estado do jogo ===== */

let entities = [];
let round = 1;
let score = 0;
let missCount = 0;
let gameActive = false;
let clickBusy = false;
let infiniteMode = false;
const INF_MAX_MISS = 3;

/* ===== Spawn ===== */

function spawnRound() {
  entities.forEach(e => scene.remove(e.group));
  entities = [];

  const totalIscas = 4 + round * 2;
  const count = totalIscas + 1;

  const positions = generatePositions(count);

  /* Shaco real primeiro, depois embaralha */
  const items = [{ type: 'real-shaco' }];
  for (let i = 1; i < count; i++) {
    const roll = Math.random();
    let type;
    if (roll < 0.42) type = 'clone';
    else if (roll < 0.75) type = 'box';
    else type = 'exploded';
    items.push({ type });
  }
  shuffle(items);

  items.forEach((item, i) => {
    let obj;
    if (item.type === 'real-shaco') obj = createShaco('real');
    else if (item.type === 'clone') obj = createShaco('clone');
    else if (item.type === 'box') obj = createBox();
    else obj = createExplodedShaco();

    obj.position.copy(positions[i]);
    obj.userData.type = item.type;
    obj.userData.baseY = obj.position.y;
    obj.userData.rotSpeed = randRange(-0.012, 0.012);
    obj.userData.bobSpeed = randRange(0.5, 1.3);
    obj.userData.bobPhase = Math.random() * Math.PI * 2;

    scene.add(obj);
    entities.push({ group: obj, type: item.type });
  });
}

function generatePositions(n) {
  const positions = [];
  const ring = 7;
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 + randRange(-0.3, 0.3);
    const r = randRange(ring - 1.5, ring + 2.5);
    positions.push(new THREE.Vector3(
      Math.cos(angle) * r,
      randRange(-1.5, 2.5),
      Math.sin(angle) * r - 2
    ));
  }
  return positions;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/* ===== Raycasting ===== */

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function handleClick(e) {
  if (!gameActive || clickBusy) return;
  if (e.target.closest('#hud, .modal, .btn-hud, .btn-big, .btn-ghost')) return;

  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  for (const entity of entities) {
    const hits = raycaster.intersectObject(entity.group, true);
    if (hits.length > 0) {
      resolveHit(entity);
      return;
    }
  }

  /* Nenhum alvo */
  showMessage('clicou no nada', 'miss');
}

function resolveHit(entity) {
  clickBusy = true;
  switch (entity.type) {
    case 'real-shaco':
      score++;
      updateHUD();
      fadeOutAndTrigger(entity.group, () => {
        showOverlayAtrasDeVoce();
        spawnConfetti(entity.group.position);
        setTimeout(() => {
          clickBusy = false;
          nextRound();
        }, 2200);
      });
      flashBody('flash-green');
      A()?.atrasDeVoce();
      break;
    case 'clone':
      showMessage(rand(['era clone!', 'clonou, não contou', 'o real tá em outro lugar', 'cópia xerox']), 'clone');
      puffRemove(entity);
      registerMiss();
      A()?.miss();
      break;
    case 'box':
      showMessage(rand(['BOOM · mimic', '💥 caiu na armadilha', 'caixinha explodiu na sua cara', 'tarde demais']), 'box');
      explodeRemove(entity);
      shakeScreen();
      registerMiss();
      flashBody('flash-red');
      A()?.explode();
      break;
    case 'exploded':
      showMessage(rand(['esse já tava morto', 'zerou', 'fragmento sem dono', 'não conta']), 'exp');
      puffRemove(entity);
      registerMiss();
      A()?.miss();
      break;
  }
}

/* Confetti 3D de caixinhas ao acertar */
function spawnConfetti(origin) {
  for (let i = 0; i < 12; i++) {
    const mini = createBox();
    mini.scale.setScalar(0.25);
    mini.position.copy(origin);
    const vx = (Math.random() - 0.5) * 0.4;
    const vy = Math.random() * 0.35 + 0.15;
    const vz = (Math.random() - 0.5) * 0.4;
    mini.userData.vx = vx;
    mini.userData.vy = vy;
    mini.userData.vz = vz;
    mini.userData.rotSpd = (Math.random() - 0.5) * 0.25;
    mini.userData.life = 1;
    scene.add(mini);
    const start = performance.now();
    (function step() {
      const age = (performance.now() - start) / 2000;
      if (age >= 1) { scene.remove(mini); return; }
      mini.position.x += mini.userData.vx;
      mini.position.y += mini.userData.vy;
      mini.position.z += mini.userData.vz;
      mini.userData.vy -= 0.012;
      mini.rotation.x += mini.userData.rotSpd;
      mini.rotation.y += mini.userData.rotSpd * 0.8;
      mini.traverse(c => {
        if (c.isMesh) {
          if (!c.material.transparent) { c.material = c.material.clone(); c.material.transparent = true; }
          c.material.opacity = 1 - age;
        }
      });
      requestAnimationFrame(step);
    })();
  }
}

function registerMiss() {
  missCount++;
  updateHUD();
  setTimeout(() => {
    clickBusy = false;
    if (infiniteMode && missCount >= INF_MAX_MISS) endGame();
  }, 400);
}

function puffRemove(entity) {
  const start = performance.now();
  const dur = 550;
  entity.group.traverse(c => {
    if (c.isMesh) {
      c.material = c.material.clone();
      c.material.transparent = true;
    }
  });
  (function step() {
    const t = Math.min(1, (performance.now() - start) / dur);
    entity.group.scale.setScalar((1 - t) * (entity.group.userData.originalScale || 1));
    entity.group.rotation.y += 0.25;
    entity.group.position.y += 0.02;
    entity.group.traverse(c => { if (c.isMesh) c.material.opacity = 1 - t; });
    if (t < 1) requestAnimationFrame(step);
    else { scene.remove(entity.group); entities = entities.filter(x => x !== entity); }
  })();
}

function explodeRemove(entity) {
  /* Dispersa filhos em direções aleatórias */
  const start = performance.now();
  const dur = 700;
  const children = [];
  entity.group.children.forEach(c => {
    if (c.isMesh) {
      c.material = c.material.clone();
      c.material.transparent = true;
      children.push({ mesh: c, vx: (Math.random() - 0.5) * 0.15, vy: Math.random() * 0.15, vz: (Math.random() - 0.5) * 0.15 });
    }
  });
  (function step() {
    const t = Math.min(1, (performance.now() - start) / dur);
    children.forEach(ch => {
      ch.mesh.position.x += ch.vx;
      ch.mesh.position.y += ch.vy;
      ch.mesh.position.z += ch.vz;
      ch.vy -= 0.006;
      ch.mesh.rotation.x += 0.2;
      ch.mesh.rotation.z += 0.15;
      ch.mesh.material.opacity = 1 - t;
    });
    if (t < 1) requestAnimationFrame(step);
    else { scene.remove(entity.group); entities = entities.filter(x => x !== entity); }
  })();
}

function fadeOutAndTrigger(group, cb) {
  const start = performance.now();
  const dur = 700;
  group.traverse(c => {
    if (c.isMesh) {
      c.material = c.material.clone();
      c.material.transparent = true;
    }
  });
  (function step() {
    const t = Math.min(1, (performance.now() - start) / dur);
    group.scale.setScalar(1 - t * 0.4);
    group.rotation.y += 0.3;
    group.position.y += 0.03;
    group.traverse(c => { if (c.isMesh) c.material.opacity = 1 - t; });
    if (t < 1) requestAnimationFrame(step);
    else { scene.remove(group); if (cb) cb(); }
  })();
}

/* ===== UI ===== */

function showMessage(text, type) {
  const msg = document.getElementById('message');
  msg.textContent = text;
  msg.dataset.type = type;
  msg.classList.remove('msg-show');
  void msg.offsetWidth;
  msg.classList.add('msg-show');
  setTimeout(() => msg.classList.remove('msg-show'), 1400);
}

function showOverlayAtrasDeVoce() {
  const ov = document.getElementById('overlay');
  ov.classList.remove('overlay-hidden');
  ov.classList.add('overlay-show');
  setTimeout(() => {
    ov.classList.remove('overlay-show');
    ov.classList.add('overlay-hidden');
  }, 2000);
}

function shakeScreen() {
  document.body.classList.add('shaking');
  setTimeout(() => document.body.classList.remove('shaking'), 500);
}

function flashBody(cls) {
  document.body.classList.add(cls);
  setTimeout(() => document.body.classList.remove(cls), 500);
}

function updateHUD() {
  document.getElementById('round').textContent = round;
  document.getElementById('score').textContent = score;
  document.getElementById('miss').textContent = missCount;
}

function nextRound() {
  round++;
  if (infiniteMode) {
    if (missCount >= INF_MAX_MISS) { endGame(); return; }
    updateHUD();
    spawnRound();
  } else if (round > 10) {
    endGame();
  } else {
    updateHUD();
    spawnRound();
  }
}

function startGame() {
  round = 1;
  score = 0;
  missCount = 0;
  clickBusy = false;
  gameActive = true;
  const inf = document.getElementById('infinite-mode');
  infiniteMode = !!(inf && inf.checked);
  entities.forEach(e => scene.remove(e.group));
  entities = [];
  updateHUD();
  spawnRound();
  document.getElementById('intro-modal').classList.add('modal-hidden');
  document.getElementById('end-modal').classList.add('modal-hidden');
}

const VERDICTS = [
  { min: 10, title: 'MAIN SHACO CONFIRMADO', quip: 'você é o palhaço. nós que ficamos em paz.' },
  { min: 8, title: 'OLHOS DO BAIANO', quip: 'até a riot te liga pra coachar agora.' },
  { min: 6, title: 'TOLERÁVEL', quip: 'dava pra subir esmeralda, se existisse disciplina.' },
  { min: 4, title: 'JOGOU CEGO', quip: 'seu adc te culpou. com razão.' },
  { min: 2, title: 'ACABOU EM FERRO', quip: 'o shaco inimigo te seguiu no insta, só pra rir.' },
  { min: 0, title: 'VOCÊ VIROU PIADA', quip: 'a piada era com você. ainda é.' }
];

const INF_VERDICTS = [
  { min: 50, title: 'LENDA URBANA', quip: 'shaco main kanzi te seguiu de volta.' },
  { min: 25, title: 'CAÇADOR PROFISSIONAL', quip: 'o ward rosa ficou com medo de você.' },
  { min: 15, title: 'TÁ AFIADO', quip: 'o adc inimigo agradece. ele já se acostumou.' },
  { min: 8, title: 'RAZOÁVEL', quip: 'um Shaco por aí te deve uma.' },
  { min: 3, title: 'QUASE LÁ', quip: 'a próxima é sua. (não é.)' },
  { min: 0, title: 'PIROU NA CAIXINHA', quip: 'ele clonou, você clicou. repete em loop.' }
];

function endGame() {
  gameActive = false;
  const modal = document.getElementById('end-modal');
  const list = infiniteMode ? INF_VERDICTS : VERDICTS;
  const v = list.find(v => score >= v.min);
  modal.querySelector('.verdict').textContent = v.title;
  const maxTxt = infiniteMode ? 'achou · 3 erros = fim' : '/10 shacos encontrados';
  modal.querySelector('.final-score').textContent = infiniteMode
    ? `${score} achou · ${missCount} erros (limite ${INF_MAX_MISS})`
    : `${score}/10 shacos encontrados · ${missCount} erros`;
  modal.querySelector('.final-quip').textContent = v.quip;
  modal.classList.remove('modal-hidden');
  entities.forEach(e => scene.remove(e.group));
  entities = [];
}

/* ===== Loop ===== */

function animate() {
  requestAnimationFrame(animate);
  const t = performance.now() * 0.001;
  entities.forEach(e => {
    const g = e.group;
    if (!g.userData) return;
    g.rotation.y += g.userData.rotSpeed || 0;
    if (g.userData.bobSpeed !== undefined) {
      g.position.y = g.userData.baseY + Math.sin(t * g.userData.bobSpeed + g.userData.bobPhase) * 0.4;
    }
    /* Spins dos fragmentos do explodido */
    if (e.type === 'exploded') {
      g.children.forEach(c => { if (c.userData.spin) c.rotation.y += c.userData.spin; });
    }
    /* Pulsação da aura do real */
    if (g.userData.aura) {
      const s = 1 + Math.sin(t * 2) * 0.08;
      g.userData.aura.scale.setScalar(s);
      g.userData.aura.material.opacity = 0.06 + Math.sin(t * 2) * 0.03;
    }
  });
  /* Câmera oscila sutilmente */
  camera.position.x = Math.sin(t * 0.15) * 1.2;
  camera.position.y = 3 + Math.sin(t * 0.22) * 0.5;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}

/* ===== Eventos ===== */

window.addEventListener('click', handleClick);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('play-again').addEventListener('click', startGame);
document.getElementById('restart').addEventListener('click', () => {
  startGame();
});

document.getElementById('sound-toggle')?.addEventListener('click', (e) => {
  e.stopPropagation();
  const btn = e.currentTarget;
  const on = A()?.toggle();
  btn.textContent = on ? '🔊' : '🔇';
  btn.classList.toggle('on', !!on);
  if (on) A()?.laugh();
});

animate();
