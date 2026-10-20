(() => {
'use strict';
const $ = id => document.getElementById(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const N = 90, M = 2, BETA = 0.3, GAMMA = 0.2, BUDGET = 10, ISO_MAX = 4, RUNS = 300;

/* ───────── seeded graph: preferential attachment, so it has hubs like real networks ───────── */
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rng0 = mulberry(11);
const adj = Array.from({ length: N }, () => new Set()); const pool = [];
const link = (a, b) => { adj[a].add(b); adj[b].add(a); pool.push(a, b); };
link(0, 1); link(1, 2); link(0, 2);
for (let v = 3; v < N; v++) { const t = new Set(); while (t.size < M) t.add(pool[Math.floor(rng0() * pool.length)]); t.forEach(u => link(v, u)); }
const deg = adj.map(s => s.size);
const edges = []; adj.forEach((s, a) => s.forEach(b => { if (a < b) edges.push([a, b]); }));
const byDeg = [...Array(N).keys()].sort((a, b) => deg[b] - deg[a]);

/* force layout, computed once */
const P = Array.from({ length: N }, () => ({ x: rng0(), y: rng0(), vx: 0, vy: 0 }));
for (let it = 0; it < 420; it++) { const cool = 1 - it / 420;
  for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { let dx = P[i].x - P[j].x, dy = P[i].y - P[j].y; const d2 = dx * dx + dy * dy + 1e-4, f = 0.0009 / d2; P[i].vx += dx * f; P[i].vy += dy * f; P[j].vx -= dx * f; P[j].vy -= dy * f; }
  edges.forEach(([a, b]) => { const dx = P[b].x - P[a].x, dy = P[b].y - P[a].y, d = Math.hypot(dx, dy) + 1e-4, f = (d - 0.07) * 0.06; P[a].vx += dx / d * f; P[a].vy += dy / d * f; P[b].vx -= dx / d * f; P[b].vy -= dy / d * f; });
  P.forEach(p => { p.vx += (0.5 - p.x) * 0.01; p.vy += (0.5 - p.y) * 0.01; p.x += p.vx * cool * 0.9; p.y += p.vy * cool * 0.9; p.vx *= 0.6; p.vy *= 0.6; }); }
{ const xs = P.map(p => p.x), ys = P.map(p => p.y), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  P.forEach(p => { p.x = 0.06 + 0.88 * (p.x - x0) / (x1 - x0); p.y = 0.07 + 0.86 * (p.y - y0) / (y1 - y0); }); }

/* ───────── epidemic maths ───────── */
function r0(patched, isolated) {
  let s1 = 0, s2 = 0, n = 0; const off = v => patched.has(v) || isolated.has(v);
  for (let v = 0; v < N; v++) { if (off(v)) continue; let k = 0; adj[v].forEach(u => { if (!off(u)) k++; }); s1 += k; s2 += k * k; n++; }
  if (!s1) return 0; return (BETA / (BETA + GAMMA)) * (s2 / s1 - 1);
}
function runOnce(patched, rng, zero, isolated = new Set()) {
  const st = new Uint8Array(N); patched.forEach(v => { st[v] = 3; }); isolated.forEach(v => { st[v] = 4; });
  if (st[zero] !== 0) return 0; st[zero] = 1; let ever = 1, inf = [zero];
  while (inf.length) { const next = [], newly = [];
    inf.forEach(v => { adj[v].forEach(u => { if (st[u] === 0 && rng() < BETA) { st[u] = 1; newly.push(u); ever++; } }); if (rng() < GAMMA) st[v] = 2; else next.push(v); });
    inf = next.concat(newly); }
  return ever;
}
function meanOutbreak(getPatched, runs = RUNS) { const rng = mulberry(99); let tot = 0;
  for (let r = 0; r < runs; r++) { const patched = getPatched(rng); let zero; do { zero = Math.floor(rng() * N); } while (patched.has(zero)); tot += runOnce(patched, rng, zero); } return tot / runs; }

/* ───────── game state ───────── */
let patched = new Set(), isolated = new Set(), state = null, running = false, timer = 0, hover = -1;
let ever = 0, rngLive = Math.random;

function counts() { let inf = 0; if (state) state.forEach(s => { if (s === 1) inf++; }); return inf; }
function updateHud() {
  const R = r0(patched, isolated); $('r0').textContent = R.toFixed(1); $('r0').style.color = R < 1 ? 'var(--a)' : R < 2.5 ? 'var(--b)' : 'var(--bad)';
  $('r0txt').textContent = R < 1 ? 'the worm cannot sustain itself' : R < 2.5 ? 'spreads slowly' : 'spreads fast';
  const bar = $('r0bar'); bar.style.width = Math.min(100, R / 8 * 100) + '%'; bar.style.background = R < 1 ? 'var(--a)' : R < 2.5 ? 'var(--b)' : 'var(--bad)';
  $('sInf').textContent = counts(); $('sTot').textContent = ever; $('sBud').textContent = BUDGET - patched.size;
  $('iso').textContent = running ? `Click a machine to cut it off the network. Isolations left: ${ISO_MAX - isolated.size}.` : 'Click machines to patch them. Hubs are the large nodes.';
}

/* ───────── canvas ───────── */
const cv = $('net'), ctx = cv.getContext('2d'); let W = 0, H = 0, dpr = 1; const born = new Float32Array(N).fill(-9);
function resize() { dpr = Math.min(devicePixelRatio || 1, 2); const r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
new ResizeObserver(resize).observe(cv);
const px = v => P[v].x * W, py = v => P[v].y * H;
const COL = { 0: '109,183,255', 1: '255,92,108', 2: '139,151,173', 3: '92,242,176' };
function draw(now) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
  edges.forEach(([a, b]) => { const off = isolated.has(a) || isolated.has(b); const hot = state && (state[a] === 1 || state[b] === 1) && !off;
    ctx.strokeStyle = off ? 'rgba(120,130,150,.08)' : hot ? 'rgba(255,92,108,.35)' : 'rgba(140,165,205,.16)'; ctx.lineWidth = hot ? 1.4 : 1; ctx.beginPath(); ctx.moveTo(px(a), py(a)); ctx.lineTo(px(b), py(b)); ctx.stroke(); });
  for (let v = 0; v < N; v++) {
    const s = patched.has(v) ? 3 : state ? state[v] : 0; const r = 3.5 + Math.sqrt(deg[v]) * 2.1; const x = px(v), y = py(v);
    const pulse = Math.max(0, 1 - (now - born[v]) / 700);
    if (s === 1 || pulse > 0) { const g = ctx.createRadialGradient(x, y, 0, x, y, r * (3 + pulse * 3)); g.addColorStop(0, `rgba(${COL[1]},${0.55})`); g.addColorStop(1, `rgba(${COL[1]},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * (3 + pulse * 3), 0, 6.283); ctx.fill(); }
    if (s === 3) { ctx.strokeStyle = `rgba(${COL[3]},.9)`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r + 4, 0, 6.283); ctx.stroke(); }
    ctx.fillStyle = isolated.has(v) ? 'rgba(90,100,120,.5)' : `rgb(${COL[s]})`; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
    if (isolated.has(v)) { ctx.strokeStyle = '#fff'; ctx.setLineDash([3, 3]); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, r + 5, 0, 6.283); ctx.stroke(); ctx.setLineDash([]); }
  }
  if (hover >= 0) { const x = px(hover), y = py(hover); ctx.fillStyle = 'rgba(8,11,17,.92)'; ctx.strokeStyle = 'rgba(255,255,255,.4)'; const t = `machine ${hover + 1} · ${deg[hover]} links`; ctx.font = '600 11px JetBrains Mono, monospace'; const w = ctx.measureText(t).width + 14;
    const bx = Math.min(W - w - 4, Math.max(4, x - w / 2)), by = Math.max(4, y - 34); ctx.beginPath(); ctx.roundRect(bx, by, w, 22, 6); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#e8eef8'; ctx.fillText(t, bx + 7, by + 15); }
}
(function loop(now) { draw(now); requestAnimationFrame(loop); })(0);

function pick(e) { const r = cv.getBoundingClientRect(); const mx = e.clientX - r.left, my = e.clientY - r.top; let best = -1, bd = 22;
  for (let v = 0; v < N; v++) { const d = Math.hypot(px(v) - mx, py(v) - my); if (d < bd) { bd = d; best = v; } } return best; }
cv.addEventListener('pointermove', e => { hover = pick(e); });
cv.addEventListener('pointerleave', () => { hover = -1; });
cv.addEventListener('click', e => { const v = pick(e); if (v < 0) return;
  if (!running && !state) { if (patched.has(v)) patched.delete(v); else if (patched.size < BUDGET) patched.add(v); else toast('Out of patches. Click a patched machine to take its patch back.'); updateHud(); }
  else if (running) { if (isolated.has(v)) return; if (isolated.size >= ISO_MAX) { toast('No isolations left.'); return; } isolated.add(v); if (state[v] === 1) { state[v] = 2; } updateHud(); } });

/* ───────── controls ───────── */
$('rand').addEventListener('click', () => { if (running || state) return; patched.clear(); const rng = Math.random; while (patched.size < BUDGET) patched.add(Math.floor(rng() * N)); updateHud(); });
$('hubs').addEventListener('click', () => { if (running || state) return; patched = new Set(byDeg.slice(0, BUDGET)); updateHud(); });
$('reset').addEventListener('click', reset);
function reset() { clearInterval(timer); running = false; state = null; patched = new Set(); isolated = new Set(); ever = 0; born.fill(-9); $('res').hidden = true; $('release').disabled = false; $('release').textContent = 'Release the worm'; updateHud(); }
$('release').addEventListener('click', () => { if (running) return; if (state) { state = null; isolated = new Set(); ever = 0; born.fill(-9); } start(); });
function start() {
  state = new Uint8Array(N); patched.forEach(v => { state[v] = 3; }); let zero; do { zero = Math.floor(Math.random() * N); } while (patched.has(zero)); state[zero] = 1; ever = 1; born[zero] = performance.now();
  running = true; $('release').disabled = true; $('release').textContent = 'Outbreak in progress…'; $('res').hidden = true; toast(`Patient zero: machine ${zero + 1}. Cut off what you can.`, 3500); updateHud();
  const tick = () => {
    const newly = [], rec = []; const inf = []; state.forEach((s, v) => { if (s === 1) inf.push(v); });
    inf.forEach(v => { adj[v].forEach(u => { if (state[u] === 0 && !isolated.has(u) && !isolated.has(v) && Math.random() < BETA) newly.push(u); }); if (Math.random() < GAMMA) rec.push(v); });
    newly.forEach(u => { if (state[u] === 0) { state[u] = 1; ever++; born[u] = performance.now(); } }); rec.forEach(v => { if (state[v] === 1) state[v] = 2; });
    updateHud(); if (!counts()) { clearInterval(timer); running = false; finish(); }
  };
  timer = setInterval(tick, reduced ? 250 : 520);
}

function finish() {
  $('release').disabled = false; $('release').textContent = 'Run it again';
  const mine = new Set(patched); isolated.forEach(() => {});
  const none = meanOutbreak(() => new Set()), you = meanOutbreak(() => mine), rand = meanOutbreak(rng => { const s = new Set(); while (s.size < BUDGET) s.add(Math.floor(rng() * N)); return s; }), hubs = meanOutbreak(() => new Set(byDeg.slice(0, BUDGET)));
  const pct = v => Math.round(v / N * 100);
  const rows = [['No defence', none, 'var(--bad)'], ['Your patches', you, 'var(--a)'], ['10 random patches', rand, 'var(--b)'], ['10 biggest hubs', hubs, 'var(--c)']];
  $('bars').innerHTML = rows.map(([n, v, c], i) => `<div class="bar${i === 1 ? ' you' : ''}"><span>${n}</span><div><i style="width:0;--c:${c}" data-w="${pct(v)}"></i></div><b>${pct(v)}%</b></div>`).join('');
  requestAnimationFrame(() => document.querySelectorAll('#bars i').forEach(i => { i.style.width = i.dataset.w + '%'; }));
  $('res').hidden = false;
  const verdict = you <= hubs * 1.15 + 1 ? 'You found the rule: patch the hubs. A few highly connected machines carry most of the spread, so removing them breaks the network apart.' : you <= rand ? 'Better than random, but the biggest hubs would have done more. The large nodes are the machines with the most links.' : 'Random patching did better. Try the biggest hubs: watch the R0 meter fall as you patch them.';
  $('verdict').textContent = verdict + ` This run: ${ever} of ${N} machines infected.`;
  toast(`Outbreak over. ${ever} of ${N} machines infected.`, 5000);
}
let toastT; function toast(m, ms = 4000) { const t = $('toast'); t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, ms); }

updateHud();
window.__worm = { patch: s => { patched = new Set(s); updateHud(); }, byDeg, start, meanOutbreak, r0, get patched() { return patched; } };
})();
