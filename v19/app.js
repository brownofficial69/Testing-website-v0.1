import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const $ = id => document.getElementById(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ───────── landmarks: one per project ───────── */
const LM = [
  { id: 'tw', name: 'ThreatWeave Tower', col: '#36d7ff', shape: 'weave', ang: 0.0,
    k: 'ThreatWeave · Go · 2026', d: 'A concurrent threat-intelligence CLI. It pulls four feeds in parallel, correlates indicators by ASN and MITRE ATT&CK overlap and writes structured dossiers with the Claude API.',
    f: ['5/5 concurrency tests passing'], a: [['Try the demo', '../demos/threatweave.html'], ['GitHub', 'https://github.com/shaddiegit/threatweave']] },
  { id: 'sv', name: 'SecureView Center', col: '#5b8cff', shape: 'screen', ang: 1.05,
    k: 'SecureView · TypeScript, React · 2026', d: 'A SOC triage dashboard that prioritises alerts and gives remediation guidance, built on typed LLM data contracts.',
    f: ['17/17 unit tests passing'], a: [['Try the demo', '../demos/secureview.html'], ['GitHub', 'https://github.com/shaddiegit/secureview']] },
  { id: 'sl', name: 'Detection Factory', col: '#34f5a8', shape: 'factory', ang: 2.1,
    k: 'SOC Detection Lab · Python, Sigma · 2026', d: 'Multi-stage detections and time-window correlation across a simulated four-stage intrusion, as Sigma-style rules that deploy in Wazuh.',
    f: ['Replay the intrusion and tune the rules yourself'], a: [['Play Intrusion Replay', '../v37/index.html'], ['GitHub', 'https://github.com/shaddiegit/soc-detection-lab']] },
  { id: 'ih', name: 'IOC Research Lab', col: '#ffb547', shape: 'dome', ang: 3.15,
    k: 'IOC Hunter · Python · 2026', d: 'A multi-source indicator lookup CLI, hardened against malformed and hostile input, with output ready for CI and SOAR pipelines.',
    f: ['19/19 security tests passing'], a: [['Try the demo', '../demos/ioc-hunter.html'], ['GitHub', 'https://github.com/shaddiegit/ioc-hunter']] },
  { id: 'sc', name: 'GRC Headquarters', col: '#a98bff', shape: 'steps', ang: 4.2,
    k: 'Supply Chain Risk Framework · VBA · 2025-26', d: 'A 15-criterion weighted vendor-risk model informed by NIST SP 800-161, tested against historical incidents and refined through UAT with non-technical users.',
    f: ['Dissertation modules: 87% and 76%'], a: [['Try the demo', '../demos/supply-chain-risk.html']] },
  { id: 'aem', name: 'Mizan Court', col: '#ff3ea5', shape: 'twin', ang: 5.25,
    k: 'ADAM / EVE / Mizan · Python · 2026', d: 'An AI-agent authorization prototype. One part proposes, one critiques, and an independent mediator decides what the agent may actually do.',
    f: ['21/21 Phase-8 and 7/7 concept tests passing', 'Keeps a no-go boundary for consequential autonomous use'], a: [['Try the demo', '../demos/adam-eve-mizan.html'], ['GitHub', 'https://github.com/brownofficial69/adam-eve-mizan']] },
];

/* ───────── renderer ───────── */
const canvas = $('gl');
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true }); }
catch (e) { document.body.insertAdjacentHTML('beforeend', '<p style="position:fixed;inset:40% 20% auto;text-align:center;color:#9a96c4">This design needs WebGL. Open the gallery for other versions.</p>'); throw e; }
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(innerWidth, innerHeight);
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x04030b); scene.fog = new THREE.FogExp2(0x070418, 0.0052);
const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 1, 1600); camera.position.set(0, 120, 230);
const controls = new OrbitControls(camera, canvas); controls.target.set(0, 22, 0); controls.enableDamping = true; controls.dampingFactor = 0.06; controls.maxPolarAngle = 1.48; controls.minDistance = 30; controls.maxDistance = 420; controls.autoRotate = !reduced; controls.autoRotateSpeed = 0.45; controls.enablePan = false;
const composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.8, 0.6, 0.22)); composer.addPass(new OutputPass());

/* sky gradient dome */
{ const c = document.createElement('canvas'); c.width = 4; c.height = 256; const x = c.getContext('2d'); const g = x.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, '#05030f'); g.addColorStop(0.62, '#1a0a33'); g.addColorStop(0.88, '#4a1550'); g.addColorStop(1, '#8a2760'); x.fillStyle = g; x.fillRect(0, 0, 4, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const dome = new THREE.Mesh(new THREE.SphereGeometry(900, 24, 16), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, fog: false })); scene.add(dome); }

/* stars */
{ const n = 700, g = new THREE.BufferGeometry(), p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, h = 0.25 + Math.random() * 0.75, r = 860; p[i * 3] = Math.cos(a) * r * Math.sqrt(1 - h * h); p[i * 3 + 1] = h * r; p[i * 3 + 2] = Math.sin(a) * r * Math.sqrt(1 - h * h); }
  g.setAttribute('position', new THREE.BufferAttribute(p, 3)); scene.add(new THREE.Points(g, new THREE.PointsMaterial({ size: 2, color: 0xbfb8ff, transparent: true, opacity: 0.7, fog: false }))); }

/* ground, streets */
const PITCH = 22, HALF = 7;
{ const g = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400), new THREE.MeshBasicMaterial({ color: 0x07041a })); g.rotation.x = -Math.PI / 2; scene.add(g);
  const pts = []; const L = (HALF + 0.5) * PITCH;
  for (let i = -HALF - 1; i <= HALF; i++) { const c = (i + 0.5) * PITCH; pts.push(c, 0.1, -L - 6, c, 0.1, L + 6, -L - 6, 0.1, c, L + 6, 0.1, c); }
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  scene.add(new THREE.LineSegments(sg, new THREE.LineBasicMaterial({ color: 0x3b2a8f, transparent: true, opacity: 0.85 }))); }

/* window textures, one per height class */
function windowTex(rep) {
  const c = document.createElement('canvas'); c.width = 64; c.height = 128; const x = c.getContext('2d'); x.fillStyle = '#0a0820'; x.fillRect(0, 0, 64, 128);
  const cols = ['#ffd27a', '#7ae7ff', '#ff7ad9', '#ffffff', '#9a7aff'];
  for (let r = 0; r < 16; r++) for (let q = 0; q < 8; q++) if (Math.random() < 0.42) { x.fillStyle = cols[(Math.random() * cols.length) | 0]; x.globalAlpha = 0.35 + Math.random() * 0.65; x.fillRect(q * 8 + 1.5, r * 8 + 2, 5, 4); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, rep); t.colorSpace = THREE.SRGBColorSpace; t.magFilter = THREE.NearestFilter; return t;
}

/* ───────── landmarks ───────── */
const RING = 58;
LM.forEach(l => { l.pos = new THREE.Vector3(Math.cos(l.ang) * RING, 0, Math.sin(l.ang) * RING); });
const clearSpots = LM.map(l => l.pos);

/* buildings: instanced by height class */
{
  const classes = [10, 16, 24, 34, 46, 60];
  const spots = [[], [], [], [], [], []];
  for (let gx = -HALF; gx <= HALF; gx++) for (let gz = -HALF; gz <= HALF; gz++) {
    const x = gx * PITCH, z = gz * PITCH;
    if (clearSpots.some(p => Math.hypot(p.x - x, p.z - z) < 24)) continue;
    const d = Math.hypot(x, z) / (HALF * PITCH), tall = Math.max(0, 1 - d * 0.85) * Math.random() + Math.random() * 0.25;
    const k = Math.min(5, Math.floor(tall * 6)); spots[k].push([x + (Math.random() - 0.5) * 3, z + (Math.random() - 0.5) * 3]);
  }
  classes.forEach((h, i) => {
    if (!spots[i].length) return;
    const m = new THREE.InstancedMesh(new THREE.BoxGeometry(1, h, 1), new THREE.MeshBasicMaterial({ map: windowTex(h / 16) }), spots[i].length);
    const M = new THREE.Matrix4(), s = new THREE.Vector3(), q = new THREE.Quaternion(), p = new THREE.Vector3();
    spots[i].forEach(([x, z], n) => { const w = 9 + Math.random() * 4; s.set(w, 1, w * (0.8 + Math.random() * 0.4)); p.set(x, h / 2, z); M.compose(p, q, s); m.setMatrixAt(n, M); });
    scene.add(m);
  });
}

/* landmark meshes */
const glowTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.3, 'rgba(255,255,255,.3)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
function neon(geo, col, opacity = 1) { const m = new THREE.Group(); m.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x0a0720 })));
  m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: col, transparent: true, opacity }))); return m; }
function build(l) {
  const c = new THREE.Color(l.col), g = new THREE.Group(); let top = 70;
  const add = (geo, x, y, z, ry = 0) => { const m = neon(geo, c); m.position.set(x, y, z); m.rotation.y = ry; g.add(m); return m; };
  switch (l.shape) {
    case 'weave': for (let i = 0; i < 9; i++) add(new THREE.BoxGeometry(14 - i * 0.9, 8, 14 - i * 0.9), 0, 4 + i * 8.4, 0, i * 0.28); top = 80; break;
    case 'screen': add(new THREE.BoxGeometry(34, 18, 16), 0, 9, 0); add(new THREE.BoxGeometry(30, 14, 12), 0, 25, 0); add(new THREE.BoxGeometry(34, 2, 18), 0, 34, 0); top = 40; break;
    case 'factory': add(new THREE.BoxGeometry(32, 14, 18), 0, 7, 0); for (let i = -1; i <= 1; i++) add(new THREE.CylinderGeometry(2.4, 2.8, 30, 14), i * 10, 28, 0); top = 46; break;
    case 'dome': add(new THREE.CylinderGeometry(14, 14, 20, 20), 0, 10, 0); add(new THREE.SphereGeometry(14, 20, 12, 0, 6.283, 0, 1.57), 0, 20, 0); add(new THREE.CylinderGeometry(0.5, 0.5, 20, 6), 0, 40, 0); top = 50; break;
    case 'steps': for (let i = 0; i < 5; i++) add(new THREE.BoxGeometry(34 - i * 6, 8, 34 - i * 6), 0, 4 + i * 8, 0); top = 46; break;
    case 'twin': add(new THREE.BoxGeometry(9, 52, 9), -14, 26, 0); add(new THREE.BoxGeometry(9, 52, 9), 14, 26, 0); add(new THREE.BoxGeometry(34, 3, 4), 0, 40, 0); add(new THREE.BoxGeometry(4, 40, 4), 0, 20, 0); top = 56; break;
  }
  /* sky beam and base ring */
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 4, 260, 12, 1, true), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.11, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
  beam.position.y = top + 120; g.add(beam);
  const ring = new THREE.Mesh(new THREE.RingGeometry(20, 21.2, 48), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.8, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.3; g.add(ring);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: c, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })); halo.scale.setScalar(60); halo.position.y = top + 4; g.add(halo);
  g.position.copy(l.pos); g.rotation.y = -l.ang + Math.PI / 2; scene.add(g);
  l.group = g; l.ring = ring; l.top = new THREE.Vector3(l.pos.x, top, l.pos.z); l.h = top;
  const el = document.createElement('div'); el.className = 'lbl'; el.style.color = l.col; el.textContent = l.name; $('labels').appendChild(el); l.el = el;
}
LM.forEach(build);

/* traffic */
const CARS = 220, carPos = new Float32Array(CARS * 3), carCol = new Float32Array(CARS * 3), cars = [];
for (let i = 0; i < CARS; i++) { const axis = Math.random() < 0.5 ? 0 : 1, lane = (Math.floor(Math.random() * (HALF * 2)) - HALF + 0.5) * PITCH + (Math.random() < 0.5 ? -2 : 2);
  cars.push({ axis, lane, t: (Math.random() - 0.5) * 2 * (HALF + 1) * PITCH, sp: (8 + Math.random() * 18) * (Math.random() < 0.5 ? 1 : -1) });
  const c = Math.random() < 0.5 ? [1, 0.82, 0.45] : [1, 0.25, 0.4]; carCol.set(c, i * 3); }
const carGeo = new THREE.BufferGeometry(); carGeo.setAttribute('position', new THREE.BufferAttribute(carPos, 3)); carGeo.setAttribute('color', new THREE.BufferAttribute(carCol, 3));
scene.add(new THREE.Points(carGeo, new THREE.PointsMaterial({ size: 3.4, map: glowTex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));

/* rain */
const RN = 1400, rainPos = new Float32Array(RN * 6), rain = [];
for (let i = 0; i < RN; i++) rain.push({ x: (Math.random() - 0.5) * 360, y: Math.random() * 200, z: (Math.random() - 0.5) * 360, v: 90 + Math.random() * 60 });
const rainGeo = new THREE.BufferGeometry(); rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
const rainMesh = new THREE.LineSegments(rainGeo, new THREE.LineBasicMaterial({ color: 0x9aa8ff, transparent: true, opacity: 0.28, fog: true })); scene.add(rainMesh);
let rainOn = !reduced; rainMesh.visible = rainOn; $('rain').setAttribute('aria-pressed', String(rainOn));
$('rain').addEventListener('click', () => { rainOn = !rainOn; rainMesh.visible = rainOn; $('rain').setAttribute('aria-pressed', String(rainOn)); });

/* ───────── interaction ───────── */
let sel = -1, hover = -1, fly = null, touring = false, tourT = 0;
const dir = $('dir');
LM.forEach((l, i) => { const li = document.createElement('li'); const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-pressed', 'false'); b.style.setProperty('--c', l.col);
  b.innerHTML = '<i></i><span></span>'; b.lastChild.textContent = l.name; b.addEventListener('click', () => { stopTour(); select(i); }); li.appendChild(b); dir.appendChild(li); l.btn = b; });

function select(i) {
  sel = i; LM.forEach((l, k) => l.btn.setAttribute('aria-pressed', String(k === i)));
  const card = $('card'); if (i < 0) { card.hidden = true; return; }
  const l = LM[i]; card.hidden = false; card.style.setProperty('--c', l.col); $('cK').textContent = l.k; $('cT').textContent = l.name; $('cD').textContent = l.d;
  const f = $('cF'); f.innerHTML = ''; l.f.forEach(t => { const li = document.createElement('li'); li.textContent = t; f.appendChild(li); });
  const a = $('cA'); a.innerHTML = ''; l.a.forEach(([t, u]) => { const e = document.createElement('a'); e.textContent = t; e.href = u; if (u.startsWith('http')) { e.target = '_blank'; e.rel = 'noopener noreferrer'; } a.appendChild(e); });
  const dirv = camera.position.clone().sub(controls.target).setY(0).normalize();
  const side = new THREE.Vector3(l.pos.x, 0, l.pos.z).normalize(); const away = side.clone().multiplyScalar(1).add(dirv.multiplyScalar(0.0));
  fly = { t0: performance.now(), dur: reduced ? 1 : 1700, fromT: controls.target.clone(), fromP: camera.position.clone(),
    toT: new THREE.Vector3(l.pos.x, l.h * 0.55, l.pos.z), toP: new THREE.Vector3(l.pos.x + away.x * 105 + side.z * 40, l.h * 0.7 + 28, l.pos.z + away.z * 105 - side.x * 40) };
  controls.autoRotate = false; $('hint').classList.add('gone');
}
$('close').addEventListener('click', () => { select(-1); controls.autoRotate = !reduced && !touring; });
addEventListener('keydown', e => { if (e.key === 'Escape') { stopTour(); select(-1); } });

function stopTour() { touring = false; $('tour').setAttribute('aria-pressed', 'false'); $('tour').textContent = 'Start the tour'; }
$('tour').addEventListener('click', () => { if (touring) { stopTour(); return; } touring = true; tourT = 0; $('tour').setAttribute('aria-pressed', 'true'); $('tour').textContent = 'Stop the tour'; select(0); });

const tmp = new THREE.Vector3(); let down = null; const mouse = { x: 0, y: 0 };
function pick() { let best = -1, bd = Infinity;
  LM.forEach((l, i) => { tmp.copy(l.top).setY(l.h * 0.5).project(camera); if (tmp.z > 1) return; const d = Math.hypot((tmp.x * 0.5 + 0.5) * innerWidth - mouse.x, (-tmp.y * 0.5 + 0.5) * innerHeight - mouse.y);
    const dist = l.top.distanceTo(camera.position); const lim = Math.max(30, 9000 / dist); if (d < lim && d < bd) { bd = d; best = i; } }); return best; }
canvas.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY }; $('hint').classList.add('gone'); });
canvas.addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; hover = pick(); canvas.style.cursor = hover >= 0 ? 'pointer' : ''; });
canvas.addEventListener('pointerup', e => { if (!down) return; const m = Math.hypot(e.clientX - down.x, e.clientY - down.y); down = null; if (m > 6) return; mouse.x = e.clientX; mouse.y = e.clientY; const h = pick(); if (h >= 0) { stopTour(); select(h); } });
controls.addEventListener('start', () => { fly = null; controls.autoRotate = false; if (touring) stopTour(); });
setTimeout(() => $('hint').classList.add('gone'), 9000);
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); composer.setSize(innerWidth, innerHeight); });
const ease = t => 1 - Math.pow(1 - t, 3);

/* ───────── loop ───────── */
let last = performance.now(); const t0 = last; const v = new THREE.Vector3();
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.1); last = now;
  if (!reduced && !fly && sel < 0 && now - t0 < 3000) { const k = ease(Math.min((now - t0) / 3000, 1)); camera.position.y = 360 + (120 - 360) * k; camera.position.z = 360 + (230 - 360) * k; }
  if (fly) { const p = Math.min((now - fly.t0) / fly.dur, 1), e = ease(p); controls.target.lerpVectors(fly.fromT, fly.toT, e); camera.position.lerpVectors(fly.fromP, fly.toP, e); if (p >= 1) fly = null; }
  if (touring && !fly) { tourT += dt; if (tourT > 6.5) { tourT = 0; select((sel + 1) % LM.length); } if (sel >= 0) { const a = now / 6000; camera.position.x += Math.cos(a) * 0.02; camera.position.z += Math.sin(a) * 0.02; } }
  controls.update();

  for (let i = 0; i < CARS; i++) { const c = cars[i]; c.t += c.sp * dt; const lim = (HALF + 1) * PITCH; if (c.t > lim) c.t = -lim; if (c.t < -lim) c.t = lim;
    carPos[i * 3] = c.axis ? c.lane : c.t; carPos[i * 3 + 1] = 0.9; carPos[i * 3 + 2] = c.axis ? c.t : c.lane; }
  carGeo.attributes.position.needsUpdate = true;
  if (rainOn) { for (let i = 0; i < RN; i++) { const r = rain[i]; r.y -= r.v * dt; if (r.y < 0) r.y = 200;
    const o = i * 6; rainPos[o] = r.x; rainPos[o + 1] = r.y; rainPos[o + 2] = r.z; rainPos[o + 3] = r.x; rainPos[o + 4] = r.y + 3.2; rainPos[o + 5] = r.z; } rainGeo.attributes.position.needsUpdate = true; }

  LM.forEach((l, i) => { const pulse = 1 + 0.18 * Math.sin(now / 520 + i); l.ring.scale.setScalar(pulse * (i === sel || i === hover ? 1.2 : 1)); l.ring.material.opacity = (i === sel || i === hover) ? 1 : 0.6;
    v.copy(l.top).setY(l.h + 8).project(camera); const front = v.z < 1; const dist = l.top.distanceTo(camera.position);
    l.el.style.opacity = front ? (dist > 380 ? 0.55 : 1) : 0; l.el.style.transform = `translate(${((v.x * 0.5 + 0.5) * innerWidth - l.el.offsetWidth / 2).toFixed(1)}px, ${((-v.y * 0.5 + 0.5) * innerHeight - 20).toFixed(1)}px)`; });
  composer.render(); requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
window.__city = { select, LM, camera, controls };
