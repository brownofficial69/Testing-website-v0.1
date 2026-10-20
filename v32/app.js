import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

/* ───────── base pairs: left strand is what I built, right strand is what it shows ───────── */
const PAIRS = [
  { k: 'Project · 2026', a: 'ADAM / EVE / Mizan', b: 'Least privilege for agents',
    t: 'Proposals, adversarial critique and policy mediation are kept apart, so no single part of the system can both decide and act. 21/21 Phase-8 tests, 7/7 concept tests and 16 memory-purger tests pass.',
    acts: [['Try the demo', '../demos/adam-eve-mizan.html'], ['GitHub', 'https://github.com/brownofficial69/adam-eve-mizan']] },
  { k: 'Project · 2026', a: 'ThreatWeave', b: 'ATT&CK correlation',
    t: 'Four threat feeds are pulled concurrently and indicators are correlated by ASN and MITRE ATT&CK overlap into structured dossiers. 5/5 concurrency tests pass.',
    acts: [['Try the demo', '../demos/threatweave.html'], ['GitHub', 'https://github.com/shaddiegit/threatweave']] },
  { k: 'Project · 2026', a: 'SecureView', b: 'Typed LLM contracts',
    t: 'A SOC triage dashboard where the model\'s output has to fit a typed data contract before the interface will show it. 17/17 unit tests pass.',
    acts: [['Try the demo', '../demos/secureview.html'], ['GitHub', 'https://github.com/shaddiegit/secureview']] },
  { k: 'Project · 2026', a: 'SOC Detection Lab', b: 'Multi-stage detections',
    t: 'A simulated four-stage intrusion and Sigma-style rules that correlate events across time windows. Try tuning them in Intrusion Replay.',
    acts: [['Play Intrusion Replay', '../v37/index.html'], ['GitHub', 'https://github.com/shaddiegit/soc-detection-lab']] },
  { k: 'Project · 2026', a: 'IOC Hunter', b: 'Injection-hardened input',
    t: 'Indicator lookups that survive malformed and hostile input, with 19/19 security tests passing and output ready for CI and SOAR pipelines.',
    acts: [['Try the demo', '../demos/ioc-hunter.html'], ['GitHub', 'https://github.com/shaddiegit/ioc-hunter']] },
  { k: 'Dissertation · 2025-26', a: 'Supply Chain Risk Framework', b: 'NIST SP 800-161',
    t: 'A 15-criterion weighted vendor-risk model, tested against historical incidents and refined through UAT with non-technical users. The two dissertation modules scored 87% and 76%.',
    acts: [['Try the demo', '../demos/supply-chain-risk.html']] },
  { k: 'Degree · 2023-26', a: 'Coventry BSc (Hons)', b: 'First-Class Honours',
    t: 'Awarded the Bachelor of Science with Honours, First Class, in Ethical Hacking and Cyber Security.', acts: [['Download CV', '../assets/cv.pdf']] },
  { k: 'Training · 2026', a: 'Claude Academy', b: 'MCP, Claude Code, AI fluency',
    t: 'Seven completion badges: Claude 101, Introduction to MCP, Claude Code in Action, Claude Code 101, AI Capabilities and Limitations, Introduction to Claude Cowork and AI Fluency.', acts: [] },
  { k: 'Work · current', a: 'FDM · Deutsche Bank', b: 'Escalation discipline',
    t: 'First-line Outlook and Teams support in a banking environment, working tickets in ServiceNow and escalating what needs a deeper fix.', acts: [] },
  { k: 'College · 2020-22', a: 'BTEC Level 3 IT', b: 'Double Distinction Merit',
    t: 'Birmingham Metropolitan College. Programming, project management and mobile apps, with a module on cyber security and incident management.', acts: [] },
];
const N = PAIRS.length;
const $ = id => document.getElementById(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ───────── scene ───────── */
const canvas = $('gl');
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true }); }
catch (e) { document.body.insertAdjacentHTML('beforeend', '<p style="position:fixed;inset:40% 20% auto;text-align:center;color:#8f96b8">This design needs WebGL. The pairs are listed in the sequence on the left.</p>'); $('seq').style.display = 'grid'; throw e; }
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(innerWidth, innerHeight);
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x05060f); scene.fog = new THREE.FogExp2(0x05060f, 0.0055);
const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, 1, 1200); camera.position.set(0, 6, 175);
const controls = new OrbitControls(camera, canvas); controls.enableDamping = true; controls.dampingFactor = 0.06; controls.enablePan = false;
controls.minDistance = 70; controls.maxDistance = 320; controls.minPolarAngle = 0.9; controls.maxPolarAngle = 2.2; controls.autoRotate = !reduced; controls.autoRotateSpeed = 0.9;
const composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.8, 0.6, 0.15)); composer.addPass(new OutputPass());

const A_COL = new THREE.Color('#4fd8ff'), B_COL = new THREE.Color('#ff6fd8');
const helix = new THREE.Group(); scene.add(helix);
const RAD = 23, STEP = 11.5, TWIST = 0.66, Y0 = -((N - 1) * STEP) / 2;
const angle = u => u * TWIST;
const posA = u => new THREE.Vector3(Math.cos(angle(u)) * RAD, Y0 + u * STEP, Math.sin(angle(u)) * RAD);
const posB = u => new THREE.Vector3(Math.cos(angle(u) + Math.PI) * RAD, Y0 + u * STEP, Math.sin(angle(u) + Math.PI) * RAD);

/* the two backbones */
function tube(fn, col) {
  const pts = []; for (let i = 0; i <= 240; i++) pts.push(fn(-0.8 + (i / 240) * (N - 1 + 1.6)));
  const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 480, 0.75, 10, false), new THREE.MeshBasicMaterial({ color: col.clone().multiplyScalar(0.8) }));
  helix.add(m); return m;
}
tube(posA, A_COL); tube(posB, B_COL);

/* glow texture */
const gt = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();

/* nodes and rungs */
const sph = new THREE.SphereGeometry(1, 24, 18);
const P = PAIRS.map((p, i) => {
  const mk = col => { const m = new THREE.Mesh(sph, new THREE.MeshBasicMaterial({ color: col })); m.scale.setScalar(2.6);
    const h = new THREE.Sprite(new THREE.SpriteMaterial({ map: gt, color: col, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending })); h.scale.setScalar(16); helix.add(m, h); return { m, h }; };
  const a = mk(A_COL), b = mk(B_COL);
  const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
  rg.setAttribute('color', new THREE.BufferAttribute(new Float32Array([A_COL.r, A_COL.g, A_COL.b, B_COL.r, B_COL.g, B_COL.b]), 3));
  const rung = new THREE.Line(rg, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.55 })); helix.add(rung);
  const lab = (cls, text) => { const e = document.createElement('div'); e.className = 'lbl ' + cls; e.textContent = text; $('labels').appendChild(e); return e; };
  return Object.assign(p, { i, na: a, nb: b, rung, open: 0, openT: 0, la: lab('a', p.a), lb: lab('b', p.b) });
});

/* spores */
{ const n = 500, g = new THREE.BufferGeometry(), p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { p[i * 3] = (Math.random() - .5) * 360; p[i * 3 + 1] = (Math.random() - .5) * 260; p[i * 3 + 2] = (Math.random() - .5) * 360; }
  g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({ size: 1.3, color: 0x8a93d8, transparent: true, opacity: 0.45, fog: false }))); }

/* ───────── sequence list, selection and unzip ───────── */
let sel = -1, hover = -1;
const seq = $('seq');
P.forEach(p => { const li = document.createElement('li'); const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
  b.innerHTML = `<i>${String(p.i + 1).padStart(2, '0')}</i><span></span>`; b.lastChild.textContent = p.a; b.addEventListener('click', () => choose(p.i)); li.appendChild(b); seq.appendChild(li); p.btn = b; });

function choose(i) {
  sel = sel === i ? -1 : i; P.forEach(p => { p.openT = p.i === sel ? 1 : 0; p.btn.setAttribute('aria-pressed', String(p.i === sel)); });
  const card = $('card'); if (sel < 0) { card.hidden = true; return; }
  const p = P[sel]; card.hidden = false; $('cK').textContent = p.k; $('cA').textContent = p.a; $('cB').textContent = p.b; $('cT').textContent = p.t;
  const acts = $('cActs'); acts.innerHTML = ''; p.acts.forEach(([t, u]) => { const a = document.createElement('a'); a.textContent = t; a.href = u; if (u.startsWith('http')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; } acts.appendChild(a); });
  controls.autoRotate = false; $('hint').classList.add('gone');
}
$('close').addEventListener('click', () => choose(sel));
addEventListener('keydown', e => { if (e.key === 'Escape' && sel >= 0) choose(sel); });

/* picking by screen distance to either node */
const v = new THREE.Vector3(), tmp = new THREE.Vector3(); let down = null; const mouse = { x: -1, y: -1 };
function pick() {
  let best = -1, bd = 30;
  P.forEach(p => [p.na.m, p.nb.m].forEach(m => { m.getWorldPosition(tmp); const d3 = tmp.distanceTo(camera.position); tmp.project(camera); if (tmp.z > 1) return;
    const d = Math.hypot((tmp.x * 0.5 + 0.5) * innerWidth - mouse.x, (-tmp.y * 0.5 + 0.5) * innerHeight - mouse.y); const lim = Math.max(18, 3600 / d3);
    if (d < lim && d < bd + 20 && d3 < 400) { bd = d; best = p.i; } }));
  return best;
}
canvas.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY }; $('hint').classList.add('gone'); });
canvas.addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; hover = pick(); canvas.style.cursor = hover >= 0 ? 'pointer' : ''; });
canvas.addEventListener('pointerup', e => { if (!down) return; const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y); down = null; if (moved > 6) return;
  mouse.x = e.clientX; mouse.y = e.clientY; const h = pick(); if (h >= 0) choose(h); });
controls.addEventListener('start', () => { controls.autoRotate = false; });
setTimeout(() => $('hint').classList.add('gone'), 9000);
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); composer.setSize(innerWidth, innerHeight); });

/* ───────── loop ───────── */
let last = performance.now(); const t0 = last, mat = new THREE.Vector3();
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.1); last = now;
  if (!reduced && now - t0 < 2600) { const k = Math.min((now - t0) / 2600, 1), e = 1 - Math.pow(1 - k, 3); helix.rotation.y = (1 - e) * 5; helix.scale.setScalar(0.3 + 0.7 * e); }
  else { helix.scale.setScalar(1); }
  helix.rotation.y += dt * 0.04 * (controls.autoRotate ? 1 : 0.0);

  P.forEach(p => {
    p.open += (p.openT - p.open) * Math.min(1, dt * 6);
    const hl = p.i === hover || p.i === sel ? 1 : 0;
    const A = posA(p.i), B = posB(p.i), dir = A.clone().sub(B).normalize(), off = p.open * 15;
    A.addScaledVector(dir, off); B.addScaledVector(dir, -off);
    p.na.m.position.copy(A); p.na.h.position.copy(A); p.nb.m.position.copy(B); p.nb.h.position.copy(B);
    const s = 2.6 + hl * 0.9 + p.open * 0.8; p.na.m.scale.setScalar(s); p.nb.m.scale.setScalar(s);
    p.na.h.scale.setScalar(16 + hl * 10 + p.open * 14); p.nb.h.scale.setScalar(16 + hl * 10 + p.open * 14);
    const pa = p.rung.geometry.attributes.position; pa.setXYZ(0, A.x, A.y, A.z); pa.setXYZ(1, B.x, B.y, B.z); pa.needsUpdate = true;
    p.rung.material.opacity = 0.35 + hl * 0.5 + (1 - p.open) * 0.15;
    /* labels sit beside each node, brightest on the near side */
    [[p.la, A, -1], [p.lb, B, 1]].forEach(([el, pos, side]) => {
      v.copy(pos); helix.localToWorld(v); const wz = v.clone().sub(camera.position).length(); v.project(camera);
      const x = (v.x * 0.5 + 0.5) * innerWidth, y = (-v.y * 0.5 + 0.5) * innerHeight; const front = THREE.MathUtils.clamp(1 - (wz - 130) / 90, 0.12, 1);
      el.style.opacity = v.z < 1 ? Math.min(1, (hl ? 1 : front)).toFixed(2) : 0;
      el.style.transform = `translate(${(x + (side < 0 ? -el.offsetWidth - 14 : 14)).toFixed(1)}px, ${(y - 7).toFixed(1)}px)`;
    });
  });
  controls.update(); composer.render(); requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
window.__helix = { choose, camera, controls, P };
