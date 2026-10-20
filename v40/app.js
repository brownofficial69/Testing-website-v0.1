(() => {
'use strict';
const $ = id => document.getElementById(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmt = n => Math.round(n).toLocaleString('en-GB');

/* ───────── a toy 32-bit hash (a murmur3-style finaliser), cut down to n bits ───────── */
function mix(x) { x ^= x >>> 16; x = Math.imul(x, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16; return x >>> 0; }
const truncate = (h, bits) => bits >= 32 ? h : h >>> (32 - bits);
/* random 32-bit inputs; unlike a counter they can repeat, so even a 32-bit hash collides on the birthday schedule */
const next = () => (Math.random() * 4294967296) >>> 0;

/* ───────── elements ───────── */
const bitsEl = $('bits'), guessEl = $('guess');
const bits = () => +bitsEl.value, space = () => Math.pow(2, bits());
const guess = () => Math.round(Math.pow(10, 1 + (+guessEl.value / 1000) * 5.4));
const expectedTries = b => 1.2533 * Math.sqrt(Math.pow(2, b));
let result = null, running = false;

/* ───────── hash-space grid ───────── */
const grid = $('grid'), gctx = grid.getContext('2d'); grid.width = grid.height = 256;
function cellInfo() { const cells = Math.min(Math.pow(2, bits()), 65536), side = Math.ceil(Math.sqrt(cells)); return { cells, side, size: 256 / side }; }
function clearGrid() { gctx.fillStyle = '#05080d'; gctx.fillRect(0, 0, 256, 256); const { side, size } = cellInfo(); if (size >= 6) { gctx.strokeStyle = 'rgba(150,175,210,.08)'; for (let i = 0; i <= side; i++) { gctx.beginPath(); gctx.moveTo(i * size, 0); gctx.lineTo(i * size, 256); gctx.stroke(); gctx.beginPath(); gctx.moveTo(0, i * size); gctx.lineTo(256, i * size); gctx.stroke(); } } }
function lightCell(h, color) { const b = bits(), { side, size } = cellInfo(); const idx = b > 16 ? h >>> (b - 16) : h; const x = idx % side, y = Math.floor(idx / side) % side; gctx.fillStyle = color; gctx.fillRect(x * size, y * size, Math.max(1, size - (size >= 6 ? 1 : 0)), Math.max(1, size - (size >= 6 ? 1 : 0))); return { x, y, size }; }

/* ───────── running the experiment ───────── */
function newSeen(b) { if (b <= 22) { const a = new Uint8Array(Math.pow(2, b)); return { has: h => a[h] === 1, add: h => { a[h] = 1; } }; } const s = new Set(); return { has: h => s.has(h), add: h => { s.add(h); } }; }
function collideOnce(b) { const seen = newSeen(b); let t = 0; for (;;) { const h = truncate(mix(next()), b); t++; if (seen.has(h)) return t; seen.add(h); } }

function animateRun() {
  if (running) return; running = true; const b = bits(), g = guess(); $('go').disabled = true; $('many').disabled = true; clearGrid(); $('rMsg').textContent = 'Hashing…'; $('rTries').textContent = '0';
  const seen = newSeen(b), exp = expectedTries(b), batch = reduced ? 1e9 : Math.max(1, Math.round(exp / 70)); let t = 0;
  (function frame() {
    for (let i = 0; i < batch; i++) {
      const h = truncate(mix(next()), b); t++;
      if (seen.has(h)) { const c = lightCell(h, '#ff5c6c'); gctx.strokeStyle = '#fff'; gctx.lineWidth = 2; gctx.beginPath(); gctx.arc(c.x * c.size + c.size / 2, c.y * c.size + c.size / 2, Math.max(7, c.size), 0, 6.283); gctx.stroke(); finish(t, b, g); return; }
      seen.add(h); lightCell(h, '#5cf2b0');
    }
    $('rTries').textContent = fmt(t); requestAnimationFrame(frame);
  })();
}
function finish(t, b, g) {
  running = false; $('go').disabled = false; $('many').disabled = false; result = { t, b, g };
  const off = Math.max(t / g, g / t); $('rTries').textContent = fmt(t); $('rExp').textContent = fmt(expectedTries(b)); $('rScore').textContent = off < 10 ? off.toFixed(1) + '×' : fmt(off) + '×';
  const space = Math.pow(2, b), frac = t / space;
  $('rMsg').textContent = `A collision after ${fmt(t)} tries, using only ${frac < 0.001 ? (frac * 100).toFixed(4) : (frac * 100).toFixed(2)}% of the ${fmt(space)} possible values. ` + (off < 1.5 ? 'Excellent guess.' : off < 3 ? 'Close.' : 'Most people guess far too high: the space looks huge, but pairs multiply quickly.');
  try { const best = +localStorage.getItem('collisionBest') || 0; if (!best || off < best) { localStorage.setItem('collisionBest', String(off)); } $('best').textContent = `Your best guess so far was off by ${(+localStorage.getItem('collisionBest')).toFixed(1)}×.`; } catch (e) { /* storage off */ }
  drawCurve();
}

/* ───────── repeat 40 runs ───────── */
function many() {
  const b = bits(); const runs = Array.from({ length: 40 }, () => collideOnce(b)).sort((x, y) => x - y);
  $('histBox').hidden = false; const c = $('hist'), x = setupCanvas(c); const W = c.clientWidth, H = c.clientHeight, max = runs[runs.length - 1], bins = 10, step = max / bins, counts = Array(bins).fill(0);
  runs.forEach(v => { counts[Math.min(bins - 1, Math.floor(v / step))]++; }); const top = Math.max(...counts);
  x.clearRect(0, 0, W, H); counts.forEach((n, i) => { const bh = n / top * (H - 36), bw = (W - 20) / bins - 4; x.fillStyle = 'rgba(109,183,255,.85)'; x.fillRect(10 + i * ((W - 20) / bins), H - 22 - bh, bw, bh); });
  const med = (runs[19] + runs[20]) / 2, theory = 1.1774 * Math.sqrt(Math.pow(2, b)); const tx = 10 + theory / max * (W - 20);
  x.strokeStyle = '#ffb547'; x.setLineDash([4, 4]); x.beginPath(); x.moveTo(tx, 6); x.lineTo(tx, H - 22); x.stroke(); x.setLineDash([]); x.fillStyle = '#8996ad'; x.font = '10px JetBrains Mono, monospace'; x.fillText('0', 10, H - 6); x.textAlign = 'right'; x.fillText(fmt(max) + ' tries', W - 10, H - 6); x.textAlign = 'left';
  $('histTxt').textContent = `Median ${fmt(med)} tries. The dashed line is the theory, 1.18·√N = ${fmt(theory)}. The runs scatter widely: a collision can come early or late, but the scale never changes.`;
}

/* ───────── probability curve ───────── */
function setupCanvas(c) { const d = Math.min(devicePixelRatio || 1, 2), w = c.clientWidth, h = c.clientHeight; if (c.width !== Math.round(w * d)) { c.width = Math.round(w * d); c.height = Math.round(h * d); } const x = c.getContext('2d'); x.setTransform(d, 0, 0, d, 0, 0); return x; }
function drawCurve() {
  const c = $('curve'), x = setupCanvas(c), W = c.clientWidth, H = c.clientHeight, N = space(), L = { l: 36, r: 12, t: 12, b: 26 };
  x.clearRect(0, 0, W, H); const maxLog = Math.min(10, Math.max(3, Math.log10(N) * 0.5 + 1.4)), px = k => L.l + (Math.log10(Math.max(1, k)) / maxLog) * (W - L.l - L.r), py = p => L.t + (1 - p) * (H - L.t - L.b);
  x.strokeStyle = 'rgba(150,175,210,.14)'; x.fillStyle = '#8996ad'; x.font = '10px JetBrains Mono, monospace'; x.textAlign = 'right';
  [0, .5, 1].forEach(p => { x.beginPath(); x.moveTo(L.l, py(p)); x.lineTo(W - L.r, py(p)); x.stroke(); x.fillText(Math.round(p * 100) + '%', L.l - 6, py(p) + 3); });
  x.textAlign = 'center'; for (let e = 0; e <= maxLog; e += (maxLog > 6 ? 2 : 1)) x.fillText('10' + (e === 0 ? '⁰' : '^' + e), px(Math.pow(10, e)), H - 8);
  x.strokeStyle = '#5cf2b0'; x.lineWidth = 2.5; x.beginPath(); for (let i = 0; i <= 200; i++) { const k = Math.pow(10, i / 200 * maxLog), p = 1 - Math.exp(-k * (k - 1) / (2 * N)); i ? x.lineTo(px(k), py(p)) : x.moveTo(px(k), py(p)); } x.stroke(); x.lineWidth = 1;
  const mark = (k, col, label, up) => { x.strokeStyle = col; x.setLineDash([4, 4]); x.beginPath(); x.moveTo(px(k), L.t); x.lineTo(px(k), H - L.b); x.stroke(); x.setLineDash([]); x.fillStyle = col; x.textAlign = 'left'; x.fillText(label, Math.min(W - 70, px(k) + 4), L.t + 10 + (up ? 12 : 0)); };
  mark(guess(), '#6db7ff', 'your guess', false); if (result && result.b === bits()) mark(result.t, '#ff5c6c', 'collision', true);
  const half = 1.1774 * Math.sqrt(N); x.fillStyle = '#ffb547'; x.beginPath(); x.arc(px(half), py(.5), 4.5, 0, 6.283); x.fill(); x.textAlign = 'left'; x.fillText('50% at ≈ ' + fmt(half), px(half) + 8, py(.5) + 14);
}

/* ───────── birthdays in a room ───────── */
function roomTheory(n) { let q = 1; for (let i = 0; i < n; i++) q *= (365 - i) / 365; return 1 - q; }
function roomDraw() {
  const c = $('room'), x = setupCanvas(c), W = c.clientWidth, H = c.clientHeight, n = +$('people').value, cols = 73, rows = 5, cw = (W - 16) / cols, ch = (H - 16) / rows;
  const counts = new Uint8Array(365); for (let i = 0; i < n; i++) counts[Math.floor(Math.random() * 365)]++; let shared = false;
  x.clearRect(0, 0, W, H);
  for (let d = 0; d < 365; d++) { const cx = 8 + (d % cols) * cw + cw / 2, cy = 8 + Math.floor(d / cols) * ch + ch / 2, k = counts[d]; if (k > 1) shared = true;
    x.fillStyle = k > 1 ? '#ff5c6c' : k === 1 ? '#5cf2b0' : 'rgba(150,175,210,.14)'; x.beginPath(); x.arc(cx, cy, k > 1 ? Math.min(cw, ch) * .46 : k ? Math.min(cw, ch) * .34 : 1.6, 0, 6.283); x.fill(); }
  $('roomTxt').textContent = `${n} people: a ${(roomTheory(n) * 100).toFixed(0)}% chance that at least two share a birthday. This room ${shared ? 'does have a shared birthday (red).' : 'has none.'}`;
}
$('people').addEventListener('input', () => { $('peopleOut').textContent = $('people').value; roomDraw(); });
$('newroom').addEventListener('click', roomDraw);
$('simroom').addEventListener('click', () => { const n = +$('people').value; let hit = 0; for (let r = 0; r < 5000; r++) { const seen = new Set(); for (let i = 0; i < n; i++) { const d = Math.floor(Math.random() * 365); if (seen.has(d)) { hit++; break; } seen.add(d); } }
  $('roomTxt').textContent = `${hit.toLocaleString('en-GB')} of 5,000 simulated rooms of ${n} had a shared birthday (${(hit / 50).toFixed(1)}%). The formula says ${(roomTheory(n) * 100).toFixed(1)}%.`; });

/* ───────── wiring ───────── */
function labels() { $('bitsOut').textContent = bits(); $('spaceOut').textContent = fmt(space()); $('guessOut').textContent = fmt(guess()); $('chartTitle').textContent = `CHANCE OF A COLLISION AFTER k TRIES · ${bits()}-BIT HASH`; }
bitsEl.addEventListener('input', () => { result = null; $('histBox').hidden = true; labels(); clearGrid(); drawCurve(); });
guessEl.addEventListener('input', () => { labels(); drawCurve(); });
$('go').addEventListener('click', animateRun); $('many').addEventListener('click', many);
addEventListener('resize', () => { drawCurve(); roomDraw(); });
labels(); clearGrid(); drawCurve(); roomDraw();
try { const b = +localStorage.getItem('collisionBest'); if (b) $('best').textContent = `Your best guess so far was off by ${b.toFixed(1)}×.`; } catch (e) { /* storage off */ }
window.__coll = { collideOnce, expectedTries, setBits(b) { bitsEl.value = b; bitsEl.dispatchEvent(new Event('input')); }, run: animateRun, many };
})();
