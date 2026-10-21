/* showreel.js: a 36-second real-time cut of the work, drawn live on a canvas.
   There is no video file. Every frame is rendered by your GPU at the canvas's native pixel size
   (up to 3840 x 2160), so on a 4K display, and in fullscreen, it is genuinely 4K and stays sharp.
   Six scenes joined by ripple wipes: title, ADAM / EVE / Mizan, the threat graph, a detection timeline,
   the hash-chain ledger, and an end card. */
(function () {
'use strict';
const host = document.getElementById('reel');
if (!host) return;
const cv = host.querySelector('canvas'), ctx = cv.getContext('2d');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const SCENE = 6.2, TR = 1.1, N = 6, TOTAL = SCENE * N;
const NAMES = [
  ['Title', 'Shadman Hossain. AI security and security engineering.'],
  ['ADAM / EVE / Mizan', 'An agent proposes, a critic attacks, a mediator decides from policy alone.'],
  ['Threat graph', 'The CV as a linked graph of projects, skills and frameworks.'],
  ['Detection timeline', 'Rules light up as a simulated intrusion moves through four stages.'],
  ['Memory ledger', 'A hash chain makes tampering with an agent\'s memory detectable.'],
  ['End card', 'First-Class BSc Ethical Hacking and Cyber Security, Coventry University.'],
];

/* theme colours, read from CSS so the reel follows the site theme */
let C = { g: '25,211,235', c: '143,227,255', p: '124,140,255', a: '255,211,122', bg: '3,19,31', tx: '232,246,255', light: false };
function readTheme() {
  const cs = getComputedStyle(document.documentElement), v = n => cs.getPropertyValue(n).trim().replace(/\s+/g, '');
  C = { g: v('--g-rgb') || C.g, c: v('--c-rgb') || C.c, p: v('--p-rgb') || C.p, a: v('--a-rgb') || C.a, bg: v('--bg-rgb') || C.bg, tx: '232,246,255', light: document.documentElement.getAttribute('data-theme') === 'holo' };
  if (C.light) C.tx = '12,27,58';
}
new MutationObserver(readTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] }); readTheme();
const rgba = (c, a) => `rgba(${c},${a})`;
const ease = t => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
const clamp01 = t => Math.min(1, Math.max(0, t));
function hash(n) { let x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }

/* ───────── canvas size: native pixels, capped at 4K ───────── */
let W = 1920, H = 1080, U = 1, resText = '';
function size() {
  const dpr = Math.min(window.devicePixelRatio || 1, 3), r = cv.getBoundingClientRect();
  let w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
  if (w > 3840) { h = Math.round(h * 3840 / w); w = 3840; } if (h > 2160) { w = Math.round(w * 2160 / h); h = 2160; }
  if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
  W = cv.width; H = cv.height; U = H / 1080; resText = W + ' × ' + H;
  const el = host.querySelector('.reel-res'); if (el) el.textContent = resText + (W >= 3800 ? ' · 4K' : '');
}
new ResizeObserver(size).observe(cv); document.addEventListener('fullscreenchange', size);

/* ───────── shared drawing ───────── */
function bg() {
  const g = ctx.createRadialGradient(W * 0.5, H * 0.35, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.75);
  g.addColorStop(0, rgba(C.g, C.light ? 0.16 : 0.22)); g.addColorStop(0.55, rgba(C.bg, 1)); g.addColorStop(1, rgba(C.bg, 1)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = rgba(C.g, 0.05); ctx.lineWidth = U; const s = 72 * U; for (let x = 0; x < W; x += s) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += s) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
}
function glow(x, y, r, col, a) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); }
function text(t, x, y, size, col, align = 'center', weight = 600, font = 'Sora, Space Grotesk, system-ui, sans-serif') { ctx.font = `${weight} ${size * U}px ${font}`; ctx.textAlign = align; ctx.fillStyle = col; ctx.fillText(t, x, y); }
function ring(x, y, r, col, a, lw) { ctx.strokeStyle = rgba(col, a); ctx.lineWidth = lw * U; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.stroke(); }
function node(x, y, r, col, label, sub, pulse) {
  glow(x, y, r * 3, col, 0.22 + 0.1 * Math.sin(pulse)); ctx.fillStyle = rgba(C.bg, 0.9); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); ring(x, y, r, col, 1, 3);
  text(label, x, y + 7 * U, 22, rgba(C.tx, 1)); if (sub) text(sub, x, y + r + 34 * U, 17, rgba(C.tx, 0.6), 'center', 400, 'JetBrains Mono, monospace');
}
function packet(ax, ay, bx, by, t, col, label) {
  const k = ((t % 1) + 1) % 1, e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2, x = ax + (bx - ax) * e, y = ay + (by - ay) * e;
  for (let j = 5; j >= 1; j--) { const ee = Math.max(0, e - j * 0.03); glow(ax + (bx - ax) * ee, ay + (by - ay) * ee, 12 * U, col, 0.13); } glow(x, y, 26 * U, col, 0.9); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 5 * U, 0, 6.283); ctx.fill();
  if (label) text(label, x, y - 24 * U, 16, rgba(col, 1), 'center', 600, 'JetBrains Mono, monospace');
}
function caption(t, i) { text(t, 80 * U, 120 * U, 54, rgba(C.tx, 1), 'left', 700); text(NAMES[i][1], 80 * U, 168 * U, 24, rgba(C.tx, 0.62), 'left', 400); }

/* ───────── scenes: each draws from its own local time t (seconds) ───────── */
function sceneTitle(t) {
  bg(); const cx = W / 2, cy = H * 0.46, fall = ease(t / 1.0);
  if (t < 1.05) { const y = -40 * U + (cy - 40 * U + 40 * U) * fall * fall; ctx.save(); ctx.translate(W / 2, y); ctx.scale(0.8, 1.2); glow(0, 0, 70 * U, C.c, 0.5); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 14 * U, 0, 6.283); ctx.fill(); ctx.restore(); }
  else {
    const a = t - 1.0;
    for (let i = 0; i < 5; i++) { const age = a - i * 0.22; if (age <= 0) continue; ring(cx, cy, age * 520 * U, i % 2 ? C.c : C.g, Math.max(0, 0.7 - age * 0.22), 4 - i * 0.5); }
    glow(cx, cy, 480 * U, C.g, 0.12 * Math.max(0, 1 - a * 0.3));
  }
  const name = 'Shadman Hossain'; ctx.font = `700 ${150 * U}px Sora, Space Grotesk, sans-serif`; ctx.textAlign = 'left'; const tw = ctx.measureText(name).width; let x = cx - tw / 2;
  for (let i = 0; i < name.length; i++) { const ch = name[i], w = ctx.measureText(ch).width, k = ease((t - 1.5 - i * 0.045) / 0.5); ctx.globalAlpha = k; ctx.fillStyle = rgba(C.tx, 1); ctx.fillText(ch, x, cy + 40 * U + (1 - k) * 40 * U); x += w; } ctx.globalAlpha = 1;
  text('AI security and security engineering', cx, cy + 130 * U, 40, rgba(C.c, clamp01((t - 3.0) / 0.8)), 'center', 400);
  const tags = ['Detection engineering', 'Agent authorization', 'Threat intelligence']; tags.forEach((s, i) => text(s, cx + (i - 1) * 520 * U, cy + 210 * U, 24, rgba(C.tx, 0.6 * clamp01((t - 3.8 - i * 0.2) / 0.6)), 'center', 400, 'JetBrains Mono, monospace'));
}
function sceneAdam(t) {
  bg(); caption('ADAM / EVE / Mizan', 1);
  const P = { op: [W * .10, H * .62], ad: [W * .30, H * .62], ev: [W * .52, H * .38], mz: [W * .68, H * .66], tl: [W * .90, H * .42], lg: [W * .90, H * .80] };
  const E = [['op', 'ad', C.tx], ['ad', 'ev', C.a], ['ad', 'mz', C.c], ['ev', 'mz', C.a], ['mz', 'tl', C.g], ['mz', 'lg', C.p]];
  E.forEach(([a, b, col]) => { ctx.strokeStyle = rgba(col, 0.28); ctx.lineWidth = 2 * U; ctx.setLineDash([8 * U, 10 * U]); ctx.lineDashOffset = -t * 40 * U; ctx.beginPath(); ctx.moveTo(P[a][0], P[a][1]); ctx.lineTo(P[b][0], P[b][1]); ctx.stroke(); ctx.setLineDash([]); });
  node(P.op[0], P.op[1], 46 * U, C.tx, 'Op', 'operator', t); node(P.ad[0], P.ad[1], 70 * U, C.c, 'ADAM', 'proposes', t); node(P.ev[0], P.ev[1], 56 * U, C.a, 'EVE', 'critiques', t + 1); node(P.mz[0], P.mz[1], 76 * U, C.g, 'Mizan', 'decides', t + 2);
  node(P.tl[0], P.tl[1], 40 * U, C.g, 'Tools', '', t); node(P.lg[0], P.lg[1], 40 * U, C.p, 'Ledger', '', t);
  const cyc = t / 1.5; E.forEach(([a, b, col], i) => { const k = cyc - i * 0.18; if (k > 0) packet(P[a][0], P[a][1], P[b][0], P[b][1], k, col, i === 0 ? 'mission' : i === 1 ? 'proposal' : null); });
  const verdicts = [['ALLOW', 'read_file /workspace/report.md', C.g], ['DENY', 'send_email  (from untrusted content)', '255,92,108'], ['ESCALATE', 'delete_records  (needs a human token)', C.a]]; const vi = Math.floor(t / 1.8) % 3, v = verdicts[vi], k = ease((t % 1.8) / 0.3);
  ctx.globalAlpha = k; const bx = W * 0.5, by = H * 0.88; ctx.fillStyle = rgba(v[2], 0.16); ctx.strokeStyle = rgba(v[2], 0.9); ctx.lineWidth = 3 * U; const bw = 860 * U, bh = 78 * U; ctx.beginPath(); ctx.roundRect(bx - bw / 2, by - bh / 2, bw, bh, 40 * U); ctx.fill(); ctx.stroke();
  text(v[0], bx - bw / 2 + 140 * U, by + 10 * U, 30, rgba(v[2], 1), 'center', 700, 'JetBrains Mono, monospace'); text(v[1], bx + 70 * U, by + 8 * U, 24, rgba(C.tx, 0.9), 'center', 400, 'JetBrains Mono, monospace'); ctx.globalAlpha = 1;
}
const GRAPH = (() => { const pts = []; for (let i = 0; i < 74; i++) { const a = hash(i) * 6.283, b = Math.acos(2 * hash(i + 90) - 1), r = 0.55 + 0.45 * hash(i + 200); pts.push([r * Math.sin(b) * Math.cos(a), r * Math.cos(b), r * Math.sin(b) * Math.sin(a)]); }
  const ed = []; for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1], pts[i][2] - pts[j][2]); if (d < 0.5) ed.push([i, j]); } return { pts, ed }; })();
const KEYS = ['ThreatWeave', 'SecureView', 'SOC Lab', 'IOC Hunter', 'ADAM / EVE / Mizan', 'Supply Chain Risk'];
function sceneGraph(t) {
  bg(); caption('Threat graph', 2); const cx = W * 0.58, cy = H * 0.56, R = H * 0.40, ang = t * 0.35, ca = Math.cos(ang), sa = Math.sin(ang), tilt = 0.35, ct = Math.cos(tilt), st = Math.sin(tilt);
  const proj = GRAPH.pts.map(p => { const x = p[0] * ca - p[2] * sa, z = p[0] * sa + p[2] * ca, y = p[1] * ct - z * st, z2 = p[1] * st + z * ct, k = 1 / (1.9 - z2 * 0.7); return [cx + x * R * k * 1.5, cy + y * R * k * 1.5, z2, k]; });
  ctx.lineWidth = 1.4 * U; GRAPH.ed.forEach(([a, b], i) => { const pa = proj[a], pb = proj[b]; const al = 0.1 + 0.18 * (pa[2] + pb[2] + 2) / 4; ctx.strokeStyle = rgba(i % 5 === 0 ? C.c : C.g, al); ctx.beginPath(); ctx.moveTo(pa[0], pa[1]); ctx.lineTo(pb[0], pb[1]); ctx.stroke();
    if (i % 7 === 0) { const k = ((t * 0.7 + i * 0.13) % 1); glow(pa[0] + (pb[0] - pa[0]) * k, pa[1] + (pb[1] - pa[1]) * k, 14 * U, C.c, 0.8); } });
  proj.forEach((p, i) => { const key = i < KEYS.length; glow(p[0], p[1], (key ? 46 : 18) * U * p[3], key ? C.g : C.c, key ? 0.55 : 0.35); ctx.fillStyle = key ? '#fff' : rgba(C.tx, 0.85); ctx.beginPath(); ctx.arc(p[0], p[1], (key ? 8 : 3.5) * U * p[3] * 1.4, 0, 6.283); ctx.fill();
    if (key && p[2] > -0.2) text(KEYS[i], p[0] + 18 * U, p[1] - 14 * U, 22, rgba(C.tx, 0.92), 'left', 500); });
}
function sceneKill(t) {
  bg(); caption('Detection timeline', 3); const x0 = W * 0.08, x1 = W * 0.92, y0 = H * 0.42, stage = ['Recon', 'Initial access', 'Privilege escalation', 'Exfiltration'], mitre = ['T1595', 'T1110', 'T1548', 'T1041'], prog = clamp01(t / 4.4);
  ctx.fillStyle = rgba(C.tx, 0.1); ctx.beginPath(); ctx.roundRect(x0, y0 - 8 * U, x1 - x0, 16 * U, 8 * U); ctx.fill(); ctx.fillStyle = rgba(C.g, 0.9); ctx.beginPath(); ctx.roundRect(x0, y0 - 8 * U, (x1 - x0) * prog, 16 * U, 8 * U); ctx.fill(); glow(x0 + (x1 - x0) * prog, y0, 60 * U, C.c, 0.9);
  stage.forEach((s, i) => { const x = x0 + (x1 - x0) * (i + 0.5) / 4, on = prog > (i + 0.2) / 4; text(s, x, y0 - 70 * U, 32, rgba(on ? C.a : C.tx, on ? 1 : 0.55)); text(mitre[i], x, y0 - 34 * U, 20, rgba(C.tx, 0.5), 'center', 400, 'JetBrains Mono, monospace');
    const bw = 300 * U, bh = 190 * U, bx = x - bw / 2, by = y0 + 120 * U; ctx.fillStyle = rgba(on ? C.g : C.tx, on ? 0.12 : 0.04); ctx.strokeStyle = rgba(on ? C.g : C.tx, on ? 0.9 : 0.2); ctx.lineWidth = 2.5 * U; ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 24 * U); ctx.fill(); ctx.stroke();
    text('Sigma rule ' + (i + 1), x, by + 56 * U, 24, rgba(C.tx, on ? 1 : 0.5), 'center', 600); text(on ? 'ALERT' : 'watching', x, by + 112 * U, on ? 44 : 26, rgba(on ? C.g : C.tx, on ? 1 : 0.5), 'center', 700, 'JetBrains Mono, monospace');
    if (on) { const age = t - (i + 0.2) * 1.1; ring(x, by + 95 * U, Math.max(0, age) * 160 * U, C.g, Math.max(0, 0.7 - age * 0.5), 3); } });
  if (t > 4.6) text('Contained at stage 2. 0 MB exfiltrated.', W / 2, H * 0.9, 38, rgba(C.c, ease((t - 4.6) / 0.6)), 'center', 600);
}
function sceneLedger(t) {
  bg(); caption('Memory ledger', 4); const n = 6, bw = W * 0.125, gap = W * 0.03, x0 = (W - (n * bw + (n - 1) * gap)) / 2, y = H * 0.52, bad = t > 4.0, tamper = 2;
  for (let i = 0; i < n; i++) {
    const appear = ease((t - 0.4 - i * 0.45) / 0.5); if (appear <= 0) continue; const x = x0 + i * (bw + gap), isBad = bad && i >= tamper, col = isBad ? '255,92,108' : C.g;
    ctx.globalAlpha = appear; ctx.fillStyle = rgba(col, 0.12); ctx.strokeStyle = rgba(col, 0.95); ctx.lineWidth = 3 * U; ctx.beginPath(); ctx.roundRect(x, y - 110 * U, bw, 220 * U, 22 * U); ctx.fill(); ctx.stroke();
    text('#' + (i + 1), x + bw / 2, y - 62 * U, 30, rgba(C.tx, 1), 'center', 700, 'JetBrains Mono, monospace');
    const h = (hash(i * 3.3 + (isBad ? 9 : 0)).toString(16).slice(2, 10)); text('hash', x + bw / 2, y - 14 * U, 17, rgba(C.tx, 0.5), 'center', 400, 'JetBrains Mono, monospace'); text(h, x + bw / 2, y + 22 * U, 22, rgba(col, 1), 'center', 500, 'JetBrains Mono, monospace');
    text(i === tamper && bad ? 'edited' : 'prev ' + (i ? hash((i - 1) * 3.3).toString(16).slice(2, 6) : '0000'), x + bw / 2, y + 70 * U, 17, rgba(i === tamper && bad ? '255,92,108' : C.tx, 0.6), 'center', 400, 'JetBrains Mono, monospace');
    if (i < n - 1) { ctx.strokeStyle = rgba(isBad ? '255,92,108' : C.g, 0.6); ctx.lineWidth = 3 * U; ctx.beginPath(); ctx.moveTo(x + bw, y); ctx.lineTo(x + bw + gap, y); ctx.stroke(); } ctx.globalAlpha = 1;
  }
  if (bad) text('Integrity failure at block 3', W / 2, H * 0.84, 44, rgba('255,92,108', ease((t - 4.0) / 0.5)), 'center', 700); else text('Each block hashes the one before it', W / 2, H * 0.84, 36, rgba(C.tx, 0.65 * clamp01((t - 2.5) / 0.8)), 'center', 400);
}
function sceneEnd(t) {
  bg(); const cx = W / 2, cy = H * 0.44; for (let i = 0; i < 3; i++) { const a = (t * 0.45 + i * 0.33) % 1; ring(cx, cy - 140 * U, 60 * U + a * 520 * U, C.g, 0.5 * (1 - a), 3); }
  text('[SH]', cx, cy - 120 * U, 120, rgba(C.c, 1), 'center', 700, 'JetBrains Mono, monospace'); text('Shadman Hossain', cx, cy + 70 * U, 92, rgba(C.tx, ease(t / 0.8)), 'center', 700);
  text('First-Class BSc Ethical Hacking and Cyber Security', cx, cy + 150 * U, 36, rgba(C.tx, 0.8 * ease((t - 0.7) / 0.8)), 'center', 400); text('Seeking junior security-engineering and AI-evaluation roles in the UK', cx, cy + 205 * U, 30, rgba(C.c, ease((t - 1.3) / 0.8)), 'center', 400);
}
const SCENES = [sceneTitle, sceneAdam, sceneGraph, sceneKill, sceneLedger, sceneEnd];

/* ───────── compositor: scenes joined by a ripple wipe ───────── */
function frame(T) {
  T = ((T % TOTAL) + TOTAL) % TOTAL; const i = Math.min(N - 1, Math.floor(T / SCENE)), local = T - i * SCENE, next = (i + 1) % N, toNext = i < N - 1 ? local - (SCENE - TR) : -1;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H); ctx.save(); SCENES[i](local + (i ? TR : 0)); ctx.restore();
  if (toNext > 0) {
    const k = ease(toNext / TR), cx = W / 2, cy = H / 2, r = k * Math.hypot(W, H) * 0.62;
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.283); ctx.clip(); SCENES[next](toNext); ctx.restore();
    for (let j = 0; j < 3; j++) { const rr = r - j * 36 * U; if (rr > 0) ring(cx, cy, rr, j ? C.c : '255,255,255', (1 - k) * (0.9 - j * 0.25), 6 - j * 2); }
  }
  if (i === N - 1 && local > SCENE - 0.6) { ctx.fillStyle = `rgba(${C.bg},${(local - (SCENE - 0.6)) / 0.6})`; ctx.fillRect(0, 0, W, H); }
  if (i === 0 && local < 0.5) { ctx.fillStyle = `rgba(${C.bg},${1 - local / 0.5})`; ctx.fillRect(0, 0, W, H); }
  /* lens: vignette, a soft letterbox and a hint of film grain */
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.4, W / 2, H / 2, Math.max(W, H) * 0.78); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(${C.bg},${C.light ? 0.25 : 0.6})`); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = `rgba(${C.bg},0.85)`; ctx.fillRect(0, 0, W, 26 * U); ctx.fillRect(0, H - 26 * U, W, 26 * U);
  return i;
}

/* ───────── player ───────── */
let T = 0, playing = false, last = 0, visible = false, curScene = -1;
const bar = host.querySelector('.reel-bar'), btn = host.querySelector('.reel-play'), full = host.querySelector('.reel-full'), cap = host.querySelector('.reel-cap'), segs = [...host.querySelectorAll('.reel-seg')];
function paint() {
  const i = frame(T); if (i !== curScene) { curScene = i; if (cap) cap.textContent = `Scene ${i + 1} of ${N}: ${NAMES[i][0]}. ${NAMES[i][1]}`; segs.forEach((s, k) => s.classList.toggle('on', k === i)); }
  segs.forEach((s, k) => { const f = k < i ? 1 : k > i ? 0 : (T - i * SCENE) / SCENE; s.firstElementChild.style.width = (clamp01(f) * 100) + '%'; });
}
function loop(now) { requestAnimationFrame(loop); if (!visible) { last = now; return; } if (playing) { T += Math.min(0.1, (now - last) / 1000); } last = now; if (playing || !loop.done) { paint(); loop.done = !playing; } }
function setPlaying(p) { playing = p; loop.done = false; if (btn) { btn.setAttribute('aria-pressed', String(p)); btn.textContent = p ? 'Pause' : 'Play'; } }
if (btn) btn.addEventListener('click', () => setPlaying(!playing));
if (full) full.addEventListener('click', () => { const el = host; if (document.fullscreenElement) document.exitFullscreen(); else if (el.requestFullscreen) el.requestFullscreen(); });
segs.forEach((s, k) => s.addEventListener('click', () => { T = k * SCENE + (k ? TR : 0); loop.done = false; paint(); }));
new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible && !reduced && !loop.started) { loop.started = true; setPlaying(true); } if (!visible && playing) { /* keep state; the loop idles */ } }, { threshold: 0.35 }).observe(host);
size(); paint(); requestAnimationFrame(loop);
window.__reel = { seek(t) { T = t; loop.done = false; paint(); }, setPlaying, get playing() { return playing; } };
})();
