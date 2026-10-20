(() => {
'use strict';
const $ = id => document.getElementById(id);
const { Chess, sqName, think } = self;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const NAMES = ['', 'pawn', 'knight', 'bishop', 'rook', 'queen', 'king'];
const VALUE = [0, 1, 3, 3, 5, 9, 0];
const GLYPH = { 1: '♟︎', 2: '♞', 3: '♝', 4: '♜', 5: '♛', 6: '♚' };

/* ───────── state ───────── */
let g, human = 1, flipped = false, busy = false, sel = -1, legalFrom = [], last = null, hintMv = null, pending = null, over = false;
let ids = [], pieceEl = {}, nextId = 1, sans = [], whiteCp = 0, suppressClick = false, drag = null;
const squares = [], DIM = 8;

/* ───────── worker (falls back to the page thread if workers are unavailable) ───────── */
let worker = null; try { worker = new Worker('worker.js'); } catch (e) { worker = null; }
function ask(fen, level) {
  return new Promise(res => {
    if (worker) { const h = e => { worker.removeEventListener('message', h); res(e.data); }; worker.addEventListener('message', h); worker.addEventListener('error', () => { res(think(fen, level)); }, { once: true }); worker.postMessage({ fen, level }); }
    else setTimeout(() => res(think(fen, level)), 30);
  });
}

/* ───────── geometry ───────── */
const vis = sq => { const r = sq >> 3, f = sq & 7; return flipped ? { r: 7 - r, c: 7 - f } : { r, c: f }; };
const sqAt = (vr, vc) => flipped ? (7 - vr) * 8 + (7 - vc) : vr * 8 + vc;
const own = p => p * human > 0;

function buildBoard() {
  const host = $('squares'); host.innerHTML = ''; squares.length = 0;
  for (let vr = 0; vr < 8; vr++) for (let vc = 0; vc < 8; vc++) {
    const sq = sqAt(vr, vc), b = document.createElement('button'); b.type = 'button'; b.className = 'sq' + ((vr + vc) % 2 ? ' d' : ''); b.dataset.sq = sq; b.tabIndex = (vr === 7 && vc === 0) ? 0 : -1;
    b.addEventListener('click', () => { if (suppressClick) return; onSquare(sq); });
    b.addEventListener('pointerdown', e => startDrag(e, sq)); b.addEventListener('keydown', e => navKey(e, vr, vc, sq));
    host.appendChild(b); squares[sq] = b;
  }
  $('files').innerHTML = [...Array(8)].map((_, vc) => `<span class="${vc % 2 ? 'l' : 'd'}">${'abcdefgh'[flipped ? 7 - vc : vc]}</span>`).join('');
  $('ranks').innerHTML = [...Array(8)].map((_, vr) => `<span class="${vr % 2 ? 'd' : 'l'}">${flipped ? vr + 1 : 8 - vr}</span>`).join('');
}
function navKey(e, vr, vc, sq) {
  const d = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key]; if (!d) return;
  e.preventDefault(); const nr = Math.min(7, Math.max(0, vr + d[0])), nc = Math.min(7, Math.max(0, vc + d[1])); const t = squares[sqAt(nr, nc)];
  squares.forEach(s => { s.tabIndex = -1; }); t.tabIndex = 0; t.focus();
}

/* ───────── pieces ───────── */
function place(el, sq) { const v = vis(sq); el.style.transform = `translate(${v.c * 100}%, ${v.r * 100}%)`; }
function makePiece(sq, p) {
  const id = nextId++, el = document.createElement('div'); el.className = 'pc ' + (p > 0 ? 'w' : 'b'); el.textContent = GLYPH[Math.abs(p)]; el.dataset.id = id; $('pieces').appendChild(el); pieceEl[id] = { el, sq }; ids[sq] = id; place(el, sq); return id;
}
function resetPieces() { $('pieces').innerHTML = ''; pieceEl = {}; ids = new Array(64).fill(0); g.b.forEach((p, sq) => { if (p) makePiece(sq, p); }); }
function repositionAll() { Object.values(pieceEl).forEach(o => place(o.el, o.sq)); }

/* ───────── painting ───────── */
function paint() {
  const tgt = new Map(legalFrom.map(m => [m.t, m]));
  for (let sq = 0; sq < 64; sq++) {
    const s = squares[sq], p = g.b[sq]; s.classList.toggle('sel', sq === sel); s.classList.toggle('last', !!last && (sq === last.f || sq === last.t));
    s.classList.toggle('tgt', tgt.has(sq)); s.classList.toggle('cap', tgt.has(sq) && (tgt.get(sq).c > 0 || tgt.get(sq).fl === 2));
    s.classList.toggle('chk', !!p && Math.abs(p) === 6 && g.inCheck(p > 0 ? 1 : -1)); s.classList.toggle('hint', !!hintMv && (sq === hintMv.f || sq === hintMv.t));
    s.setAttribute('aria-label', `${sqName(sq)}${p ? ', ' + (p > 0 ? 'white ' : 'black ') + NAMES[Math.abs(p)] : ', empty'}${sq === sel ? ', selected' : ''}${tgt.has(sq) ? ', legal move' : ''}`);
  }
  Object.values(pieceEl).forEach(o => o.el.classList.toggle('locked', busy || over || g.side !== human));
}
function lists() {
  const capW = [], capB = []; g.hist.forEach((h, i) => { const piece = h.m.fl === 2 ? 1 : Math.abs(h.cap); if (piece) (i % 2 === 0 ? capW : capB).push(piece); });
  const fmt = a => a.sort((x, y) => y - x).map(p => GLYPH[p]).join('');
  $('capBot').textContent = fmt((human === 1 ? capW : capB).slice()); $('capTop').textContent = fmt((human === 1 ? capB : capW).slice());
  const ol = $('moves'); ol.innerHTML = '';
  for (let i = 0; i < sans.length; i += 2) { const li = document.createElement('li'); li.innerHTML = `<span class="n">${i / 2 + 1}.</span><span class="m"></span><span class="m"></span>`; li.children[1].textContent = sans[i]; li.children[2].textContent = sans[i + 1] || ''; ol.appendChild(li); }
  const ms = ol.querySelectorAll('.m'); ms.forEach(m => m.classList.remove('now')); const lastEl = ms[sans.length - 1]; if (lastEl) lastEl.classList.add('now'); ol.scrollTop = ol.scrollHeight;
}
function setEval(cp) { whiteCp = cp; const c = Math.max(-700, Math.min(700, cp)); $('evalFill').style.height = (50 + c / 14) + '%'; $('evalTxt').textContent = (cp >= 0 ? '+' : '') + (cp / 100).toFixed(1); }
function say(t) { $('status').textContent = t; }

/* ───────── input ───────── */
function onSquare(sq) {
  if (busy || over || g.side !== human || pending) return; const p = g.b[sq];
  if (sel >= 0) { const m = legalFrom.find(x => x.t === sq); if (m) { tryMove(sel, sq); return; } }
  if (own(p)) { sel = sq === sel ? -1 : sq; legalFrom = sel >= 0 ? g.moves().filter(m => m.f === sel) : []; } else { sel = -1; legalFrom = []; }
  hintMv = null; paint();
}
function tryMove(from, to) {
  const cands = g.moves().filter(m => m.f === from && m.t === to); if (!cands.length) { sel = -1; legalFrom = []; paint(); return; }
  if (cands[0].pr) { pending = cands; showPromo(cands); return; }
  perform(cands[0]);
}
function showPromo(cands) {
  const box = $('promo'); box.innerHTML = '<div class="row"></div>'; const row = box.firstChild;
  [5, 4, 3, 2].forEach(pr => { const b = document.createElement('button'); b.type = 'button'; b.textContent = GLYPH[pr]; b.setAttribute('aria-label', 'Promote to ' + NAMES[pr]); b.addEventListener('click', () => { const m = cands.find(x => x.pr === pr); pending = null; box.hidden = true; perform(m); }); row.appendChild(b); });
  box.hidden = false; row.firstChild.focus();
}
function startDrag(e, sq) {
  if (busy || over || g.side !== human || pending || !own(g.b[sq]) || e.button > 0) return; const id = ids[sq]; if (!id) return;
  drag = { sq, id, el: pieceEl[id].el, x: e.clientX, y: e.clientY, moved: false };
  if (sel !== sq) { sel = sq; legalFrom = g.moves().filter(m => m.f === sq); hintMv = null; paint(); }
}
addEventListener('pointermove', e => {
  if (!drag) return; if (!drag.moved && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 6) return;
  drag.moved = true; drag.el.classList.add('dragging'); const r = $('board').getBoundingClientRect(), s = r.width / 8;
  drag.el.style.transform = `translate(${e.clientX - r.left - s / 2}px, ${e.clientY - r.top - s / 2}px)`;
});
addEventListener('pointerup', e => {
  if (!drag) return; const d = drag; drag = null; if (!d.moved) return;
  suppressClick = true; setTimeout(() => { suppressClick = false; }, 0); d.el.classList.remove('dragging'); place(d.el, d.sq);
  const r = $('board').getBoundingClientRect(), vc = Math.floor((e.clientX - r.left) / (r.width / 8)), vr = Math.floor((e.clientY - r.top) / (r.height / 8));
  if (vr < 0 || vr > 7 || vc < 0 || vc > 7) return; const to = sqAt(vr, vc); if (legalFrom.some(m => m.t === to)) tryMove(d.sq, to);
});

/* ───────── playing a move ───────── */
function perform(m, quick = false) {
  const side = g.side, sanTxt = g.san(m), capSq = m.fl === 2 ? m.t + (side === 1 ? 8 : -8) : m.t, capId = m.c ? ids[capSq] : 0, mid = ids[m.f];
  g.play(m);
  if (capId) { const o = pieceEl[capId]; o.el.classList.add('gone'); setTimeout(() => { o.el.remove(); }, 260); delete pieceEl[capId]; ids[capSq] = 0; }
  ids[m.f] = 0; ids[m.t] = mid; pieceEl[mid].sq = m.t;
  if (m.fl === 3) { const rid = ids[m.t + 1]; ids[m.t + 1] = 0; ids[m.t - 1] = rid; pieceEl[rid].sq = m.t - 1; }
  if (m.fl === 4) { const rid = ids[m.t - 2]; ids[m.t - 2] = 0; ids[m.t + 1] = rid; pieceEl[rid].sq = m.t + 1; }
  if (m.pr) pieceEl[mid].el.textContent = GLYPH[m.pr];
  repositionAll(); sans.push(sanTxt); last = { f: m.f, t: m.t }; sel = -1; legalFrom = []; hintMv = null; paint(); lists(); afterMove();
}
function afterMove() {
  const st = g.status();
  if (st.over) { finish(st); return; }
  if (g.side === human) say(st.check ? 'Check. Your move.' : 'Your move.'); else { say(''); agentsTurn(); }
}
function finish(st) {
  over = true; paint(); const o = $('over'); let h, t;
  if (st.result === 'checkmate') { const win = st.winner === human; h = win ? 'You win' : 'The engine wins'; t = win ? 'Checkmate. Well played.' : 'Checkmate. Undo a move or start a new game to try again.'; }
  else { h = 'Draw'; t = `The game is drawn by ${st.result}.`; }
  o.innerHTML = `<div class="card"><h2></h2><p></p><button class="btn go" type="button">Play again</button></div>`; o.querySelector('h2').textContent = h; o.querySelector('p').textContent = t; o.querySelector('button').addEventListener('click', newGame); o.hidden = false; o.querySelector('button').focus(); say(h + '.');
}

/* ───────── the three agents ───────── */
const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const sc = cp => (cp >= 0 ? '+' : '') + (cp / 100).toFixed(1);

async function agentsTurn() {
  busy = true; paint(); const level = $('level').value; const engineSide = g.side;
  document.querySelectorAll('.agent').forEach(a => a.classList.add('think')); $('adam').textContent = 'Searching'; $('mizan').textContent = ''; say('The engine is thinking.');
  const t0 = performance.now(), r = await ask(g.fen(), level); document.querySelectorAll('.agent').forEach(a => a.classList.remove('think'));
  const wait = Math.max(0, 450 - (performance.now() - t0)); await new Promise(x => setTimeout(x, reduced ? 0 : wait));
  if (!r) { busy = false; return; }
  const cands = r.cands.slice().sort((a, b) => b.score - a.score).slice(0, 3); const key = m => m.f + ':' + m.t + ':' + m.pr;
  if (!cands.some(c => key(c.move) === key(r.best))) cands.unshift({ move: r.best, score: r.score });
  const named = cands.map(c => ({ ...c, san: g.san(c.move) }));
  let pick = named[0];
  if (level === 'easy') { const pool = named.filter(n => n.score >= named[0].score - 150); pick = pool[Math.floor(Math.random() * pool.length)]; }
  $('adam').innerHTML = named.map(n => `<span class="mv">${esc(n.san)}</span> ${sc(n.score)}`).join('<br>');
  $('mizan').innerHTML = `<span class="mv">${esc(pick.san)}</span>` + (r.depth ? ` · depth ${r.depth} · ${r.nodes.toLocaleString('en-GB')} positions in ${r.ms} ms` : '');
  setEval(engineSide === -1 ? -pick.score : pick.score);
  busy = false; perform(pick.move);
}

/* ───────── controls ───────── */
function newGame() {
  g = new Chess(); over = false; busy = false; sel = -1; legalFrom = []; last = null; hintMv = null; pending = null; sans = []; $('over').hidden = true; $('promo').hidden = true;
  resetPieces(); paint(); lists(); setEval(0); say('Your move.');
  ['adam', 'eve', 'mizan'].filter(k => $(k)).forEach((k, i) => { $(k).textContent = ['Waiting for your move.', '', 'Search depth and speed appear here.'][i]; });
  if (g.side !== human) agentsTurn();
}
$('newg').addEventListener('click', newGame);
$('flip').addEventListener('click', () => { flipped = !flipped; buildBoard(); repositionAll(); paint(); });
$('undo').addEventListener('click', () => {
  if (busy || pending) return; if (!g.hist.length) return; over = false; $('over').hidden = true;
  let n = g.side === human ? 2 : 1; while (n-- && g.hist.length) { g.undo(); sans.pop(); }
  last = null; sel = -1; legalFrom = []; hintMv = null; resetPieces(); paint(); lists(); say('Your move.');
});
$('hint').addEventListener('click', async () => {
  if (busy || over || g.side !== human) return; busy = true; say('Looking for a hint…'); const r = await ask(g.fen(), 'medium'); busy = false; if (!r) return;
  hintMv = r.best; setEval(g.side === 1 ? r.score : -r.score); sel = -1; legalFrom = []; paint(); say(`Hint: the engine would play ${g.san(r.best)}.`);
});

buildBoard(); newGame();
window.__chess = { get g() { return g; }, perform, newGame, agentsTurn, onSquare, setFen(f) { g.load(f); over = false; busy = false; sel = -1; legalFrom = []; last = null; sans = []; $("over").hidden = true; resetPieces(); paint(); lists(); } };
})();
