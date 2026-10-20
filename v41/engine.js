/* A compact chess engine: legal move generation, make/unmake, SAN, and an alpha-beta search.
   Works in the page and in a Web Worker, and in Node for the perft tests. Board index 0 = a8, 63 = h1. */
(function (root) {
'use strict';
const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const P = 1, N = 2, B = 3, R = 4, Q = 5, K = 6;
const LETTER = { 1: 'P', 2: 'N', 3: 'B', 4: 'R', 5: 'Q', 6: 'K' };
const VAL = [0, 100, 320, 330, 500, 900, 0];
const file = s => s & 7, rank = s => s >> 3;           /* rank 0 is the 8th rank */
const sqName = s => 'abcdefgh'[file(s)] + (8 - rank(s));
const nameSq = n => (8 - +n[1]) * 8 + 'abcdefgh'.indexOf(n[0]);

/* precomputed attack tables */
const KN = [], KG = [], RAYS = [];
const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];   /* first four orthogonal, last four diagonal */
for (let s = 0; s < 64; s++) {
  const r = rank(s), f = file(s); KN[s] = []; KG[s] = []; RAYS[s] = [];
  [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]].forEach(([dr, df]) => { const rr = r + dr, ff = f + df; if (rr >= 0 && rr < 8 && ff >= 0 && ff < 8) KN[s].push(rr * 8 + ff); });
  DIRS.forEach(([dr, df], d) => { const ray = []; let rr = r + dr, ff = f + df; while (rr >= 0 && rr < 8 && ff >= 0 && ff < 8) { ray.push(rr * 8 + ff); rr += dr; ff += df; } RAYS[s][d] = ray; if (ray.length) KG[s].push(ray[0]); });
}

class Chess {
  constructor(fen) { this.load(fen || START); }
  load(fen) {
    const [pos, side, cast, ep, half, full] = fen.trim().split(/\s+/);
    this.b = new Array(64).fill(0); let s = 0;
    for (const c of pos) { if (c === '/') continue; if (c >= '1' && c <= '8') { s += +c; continue; } const t = 'pnbrqk'.indexOf(c.toLowerCase()) + 1; this.b[s++] = c === c.toLowerCase() ? -t : t; }
    this.side = side === 'b' ? -1 : 1; this.cast = 0;
    if (cast && cast.includes('K')) this.cast |= 1; if (cast && cast.includes('Q')) this.cast |= 2; if (cast && cast.includes('k')) this.cast |= 4; if (cast && cast.includes('q')) this.cast |= 8;
    this.ep = ep && ep !== '-' ? nameSq(ep) : -1; this.half = +half || 0; this.full = +full || 1; this.hist = []; this.keys = [this.key()];
    this.ks = { 1: this.b.indexOf(K), '-1': this.b.indexOf(-K) };
  }
  fen() {
    let o = ''; for (let r = 0; r < 8; r++) { let e = 0; for (let f = 0; f < 8; f++) { const p = this.b[r * 8 + f]; if (!p) { e++; continue; } if (e) { o += e; e = 0; } const l = LETTER[Math.abs(p)]; o += p > 0 ? l : l.toLowerCase(); } if (e) o += e; if (r < 7) o += '/'; }
    const c = (this.cast & 1 ? 'K' : '') + (this.cast & 2 ? 'Q' : '') + (this.cast & 4 ? 'k' : '') + (this.cast & 8 ? 'q' : '');
    return `${o} ${this.side === 1 ? 'w' : 'b'} ${c || '-'} ${this.ep >= 0 ? sqName(this.ep) : '-'} ${this.half} ${this.full}`;
  }
  key() { return this.fen().split(' ').slice(0, 4).join(' '); }

  attacked(sq, by) {                               /* is sq attacked by side `by` */
    const b = this.b, r = rank(sq), f = file(sq);
    const pr = r + (by === 1 ? 1 : -1);             /* a white pawn attacks from the rank below (higher index) */
    if (pr >= 0 && pr < 8) { if (f > 0 && b[pr * 8 + f - 1] === by * P) return true; if (f < 7 && b[pr * 8 + f + 1] === by * P) return true; }
    for (const t of KN[sq]) if (b[t] === by * N) return true;
    for (const t of KG[sq]) if (b[t] === by * K) return true;
    for (let d = 0; d < 8; d++) for (const t of RAYS[sq][d]) { const p = b[t]; if (!p) continue; if (p * by > 0) { const a = Math.abs(p); if (a === Q || (d < 4 ? a === R : a === B)) return true; } break; }
    return false;
  }
  inCheck(side = this.side) { return this.attacked(this.ks[side], -side); }

  pseudo(capsOnly = false) {
    const b = this.b, side = this.side, out = [];
    const add = (f, t, p, c, pr = 0, fl = 0) => out.push({ f, t, p, c, pr, fl });
    for (let s = 0; s < 64; s++) {
      const p = b[s]; if (p * side <= 0) continue; const a = Math.abs(p);
      if (a === P) {
        const dir = side === 1 ? -8 : 8, r = rank(s), f = file(s), last = side === 1 ? 1 : 6, start = side === 1 ? 6 : 1;
        const t1 = s + dir;
        if (t1 >= 0 && t1 < 64) {
          if (!b[t1] && !capsOnly) { if (r === last) for (const q of [Q, R, B, N]) add(s, t1, a, 0, q); else { add(s, t1, a, 0); if (r === start && !b[t1 + dir]) add(s, t1 + dir, a, 0, 0, 1); } }
          else if (!b[t1] && capsOnly && r === last) for (const q of [Q]) add(s, t1, a, 0, q);
          for (const df of [-1, 1]) { const ff = f + df; if (ff < 0 || ff > 7) continue; const t = t1 + df; const c = b[t];
            if (c * side < 0) { if (r === last) for (const q of [Q, R, B, N]) add(s, t, a, Math.abs(c), q); else add(s, t, a, Math.abs(c)); }
            else if (t === this.ep) add(s, t, a, P, 0, 2); }
        }
      } else if (a === N) { for (const t of KN[s]) { const c = b[t]; if (c * side > 0) continue; if (capsOnly && !c) continue; add(s, t, a, Math.abs(c)); } }
      else if (a === K) {
        for (const t of KG[s]) { const c = b[t]; if (c * side > 0) continue; if (capsOnly && !c) continue; add(s, t, a, Math.abs(c)); }
        if (!capsOnly) {
          const opp = -side;
          if (side === 1 && s === 60 && !this.attacked(60, opp)) {
            if ((this.cast & 1) && !b[61] && !b[62] && b[63] === R && !this.attacked(61, opp) && !this.attacked(62, opp)) add(60, 62, K, 0, 0, 3);
            if ((this.cast & 2) && !b[59] && !b[58] && !b[57] && b[56] === R && !this.attacked(59, opp) && !this.attacked(58, opp)) add(60, 58, K, 0, 0, 4);
          }
          if (side === -1 && s === 4 && !this.attacked(4, opp)) {
            if ((this.cast & 4) && !b[5] && !b[6] && b[7] === -R && !this.attacked(5, opp) && !this.attacked(6, opp)) add(4, 6, K, 0, 0, 3);
            if ((this.cast & 8) && !b[3] && !b[2] && !b[1] && b[0] === -R && !this.attacked(3, opp) && !this.attacked(2, opp)) add(4, 2, K, 0, 0, 4);
          }
        }
      } else {
        const from = a === B ? 4 : 0, to = a === R ? 4 : 8;
        for (let d = from; d < to; d++) for (const t of RAYS[s][d]) { const c = b[t]; if (c * side > 0) break; if (c) { add(s, t, a, Math.abs(c)); break; } if (!capsOnly) add(s, t, a, 0); }
      }
    }
    return out;
  }
  moves(capsOnly = false) { const side = this.side, out = []; for (const m of this.pseudo(capsOnly)) { this.make(m); if (!this.attacked(this.ks[side], -side)) out.push(m); this.unmake(); } return out; }

  make(m) {
    const b = this.b, side = this.side, piece = b[m.f];
    this.hist.push({ m, cast: this.cast, ep: this.ep, half: this.half, full: this.full, cap: b[m.t], key: null });
    b[m.t] = m.pr ? side * m.pr : piece; b[m.f] = 0;
    if (m.fl === 2) b[m.t + (side === 1 ? 8 : -8)] = 0;
    if (m.fl === 3) { b[m.t - 1] = b[m.t + 1]; b[m.t + 1] = 0; }
    if (m.fl === 4) { b[m.t + 1] = b[m.t - 2]; b[m.t - 2] = 0; }
    if (m.p === K) this.ks[side] = m.t;
    if (m.p === K) this.cast &= side === 1 ? ~3 : ~12;
    if (m.f === 63 || m.t === 63) this.cast &= ~1; if (m.f === 56 || m.t === 56) this.cast &= ~2; if (m.f === 7 || m.t === 7) this.cast &= ~4; if (m.f === 0 || m.t === 0) this.cast &= ~8;
    this.ep = m.fl === 1 ? (m.f + m.t) >> 1 : -1;
    this.half = (m.p === P || m.c) ? 0 : this.half + 1; if (side === -1) this.full++;
    this.side = -side;
  }
  unmake() {
    const h = this.hist.pop(), m = h.m, b = this.b; this.side = -this.side; const side = this.side;
    b[m.f] = side * m.p; b[m.t] = h.cap;
    if (m.fl === 2) { b[m.t] = 0; b[m.t + (side === 1 ? 8 : -8)] = -side * P; }
    if (m.fl === 3) { b[m.t + 1] = b[m.t - 1]; b[m.t - 1] = 0; }
    if (m.fl === 4) { b[m.t - 2] = b[m.t + 1]; b[m.t + 1] = 0; }
    if (m.p === K) this.ks[side] = m.f;
    this.cast = h.cast; this.ep = h.ep; this.half = h.half; this.full = h.full;
  }
  /* game-level move that also records the position key for repetition */
  play(m) { this.make(m); this.keys.push(this.key()); }
  undo() { this.unmake(); this.keys.pop(); }

  find(f, t, pr) { return this.moves().find(m => m.f === f && m.t === t && (!pr || m.pr === pr)); }
  status() {
    const ms = this.moves(), chk = this.inCheck();
    if (!ms.length) return chk ? { over: true, result: 'checkmate', winner: -this.side } : { over: true, result: 'stalemate' };
    if (this.half >= 100) return { over: true, result: 'fifty-move rule' };
    const k = this.keys[this.keys.length - 1]; if (this.keys.filter(x => x === k).length >= 3) return { over: true, result: 'threefold repetition' };
    const pcs = this.b.filter(x => x && Math.abs(x) !== K); if (!pcs.length || (pcs.length === 1 && [N, B].includes(Math.abs(pcs[0])))) return { over: true, result: 'insufficient material' };
    return { over: false, check: chk };
  }
  san(m) {
    if (m.fl === 3) return this._chk(m, 'O-O'); if (m.fl === 4) return this._chk(m, 'O-O-O');
    let s = '';
    if (m.p === P) { if (m.c) s += 'abcdefgh'[file(m.f)] + 'x'; s += sqName(m.t); if (m.pr) s += '=' + LETTER[m.pr]; }
    else { s += LETTER[m.p]; const others = this.moves().filter(o => o.p === m.p && o.t === m.t && o.f !== m.f);
      if (others.length) { if (!others.some(o => file(o.f) === file(m.f))) s += 'abcdefgh'[file(m.f)]; else if (!others.some(o => rank(o.f) === rank(m.f))) s += 8 - rank(m.f); else s += sqName(m.f); }
      if (m.c) s += 'x'; s += sqName(m.t); }
    return this._chk(m, s);
  }
  _chk(m, s) { this.make(m); const st = this.moves().length ? (this.inCheck() ? '+' : '') : (this.inCheck() ? '#' : ''); this.unmake(); return s + st; }
  perft(d) { if (d === 0) return 1; let n = 0; for (const m of this.moves()) { this.make(m); n += this.perft(d - 1); this.unmake(); } return n; }
}

/* ───────── evaluation and search ───────── */
const CENTER = s => { const f = file(s), r = rank(s); return 3.5 - Math.max(Math.abs(f - 3.5), Math.abs(r - 3.5)) + 0.5; };
function evaluate(g) {              /* centipawns from the side to move's view */
  const b = g.b; let score = 0, mat = 0;
  for (let s = 0; s < 64; s++) { const p = b[s]; if (!p) continue; const a = Math.abs(p), sg = p > 0 ? 1 : -1; if (a !== K && a !== P) mat += VAL[a];
    let v = VAL[a];
    if (a === P) { const adv = sg === 1 ? 6 - rank(s) : rank(s) - 1; v += adv * 6 + (file(s) > 1 && file(s) < 6 ? adv * 2 : 0); }
    else if (a === N) v += CENTER(s) * 9;
    else if (a === B) v += CENTER(s) * 5;
    else if (a === Q) v += CENTER(s) * 1.5;
    else if (a === K) { v += 0; }
    score += sg * v; }
  /* king safety early, activity late */
  const endgame = mat < 2600;
  for (const sg of [1, -1]) { const ks = g.ks[sg]; const home = sg === 1 ? 7 : 0; let kv = endgame ? CENTER(ks) * 12 : (rank(ks) === home ? (file(ks) < 3 || file(ks) > 5 ? 28 : 0) : -22); score += sg * kv; }
  /* bishop pair */
  for (const sg of [1, -1]) if (b.filter(x => x === sg * B).length >= 2) score += sg * 28;
  return g.side === 1 ? score : -score;
}
const MATE = 30000;
class Searcher {
  constructor(g, limitMs) { this.g = g; this.stop = false; this.nodes = 0; this.deadline = limitMs ? Date.now() + limitMs : Infinity; this.killers = []; }
  order(ms, ply, ttMove) {
    const sc = m => (ttMove && m.f === ttMove.f && m.t === ttMove.t && m.pr === ttMove.pr ? 1e6 : 0) + (m.c ? 10000 + VAL[m.c] * 10 - VAL[m.p] : 0) + (m.pr ? 9000 + VAL[m.pr] : 0) + (this.killers[ply] && this.killers[ply].f === m.f && this.killers[ply].t === m.t ? 5000 : 0) + (m.fl >= 3 ? 50 : 0);
    ms.sort((a, b) => sc(b) - sc(a)); return ms;
  }
  quiesce(alpha, beta, ply) {
    if ((++this.nodes & 2047) === 0 && Date.now() > this.deadline) this.stop = true; if (this.stop) return 0;
    const stand = evaluate(this.g); if (stand >= beta) return stand; if (stand > alpha) alpha = stand;
    if (ply > 12) return stand;
    for (const m of this.order(this.g.moves(true), ply)) { this.g.make(m); const v = -this.quiesce(-beta, -alpha, ply + 1); this.g.unmake(); if (this.stop) return 0; if (v >= beta) return v; if (v > alpha) alpha = v; }
    return alpha;
  }
  search(depth, alpha, beta, ply) {
    if ((++this.nodes & 2047) === 0 && Date.now() > this.deadline) this.stop = true; if (this.stop) return 0;
    const g = this.g, inChk = g.inCheck(); if (inChk) depth++;
    if (depth <= 0) return this.quiesce(alpha, beta, ply);
    if (ply > 0 && g.half >= 100) return 0;
    const ms = this.order(g.moves(), ply); if (!ms.length) return inChk ? -MATE + ply : 0;
    let best = -Infinity;
    for (let i = 0; i < ms.length; i++) { const m = ms[i]; g.make(m); const v = -this.search(depth - 1, -beta, -alpha, ply + 1); g.unmake(); if (this.stop) return 0;
      if (v > best) best = v; if (v > alpha) alpha = v; if (alpha >= beta) { if (!m.c) this.killers[ply] = m; break; } }
    return best;
  }
  root(maxDepth) {
    const g = this.g; let ms = this.order(g.moves(), 0), best = null, bestScore = 0, done = 0;
    if (!ms.length) return null; if (ms.length === 1) return { move: ms[0], score: 0, depth: 0 };
    for (let d = 1; d <= maxDepth; d++) {
      let alpha = -Infinity, bm = null, bs = -Infinity;
      for (const m of ms) { g.make(m); const v = -this.search(d - 1, -Infinity, -alpha, 1); g.unmake(); if (this.stop) break; if (v > bs) { bs = v; bm = m; alpha = Math.max(alpha, v); } }
      if (this.stop) break; best = bm; bestScore = bs; done = d; ms = [bm, ...ms.filter(x => x !== bm)]; if (Math.abs(bs) > MATE - 100) break;
    }
    return { move: best || ms[0], score: bestScore, depth: done };
  }
}
/* the top candidate moves, searched with a full window so their scores are comparable */
function candidates(g, depth, n) {
  const out = []; for (const m of g.moves()) { const s = new Searcher(g, 0); g.make(m); const v = -s.search(depth - 1, -Infinity, Infinity, 1); g.unmake(); out.push({ move: m, score: v }); }
  out.sort((a, b) => b.score - a.score); return out.slice(0, n);
}
function think(fen, level) {
  const g = new Chess(fen); const cfg = { easy: { d: 2, ms: 300, cd: 2 }, medium: { d: 5, ms: 800, cd: 3 }, hard: { d: 9, ms: 1500, cd: 3 } }[level] || { d: 3, ms: 500, cd: 3 };
  const t0 = Date.now(), s = new Searcher(g, cfg.ms); const r = s.root(cfg.d); if (!r) return null;
  const cands = candidates(g, cfg.cd, 4); const key = m => m.f + ':' + m.t + ':' + m.pr;
  if (!cands.some(c => key(c.move) === key(r.move))) cands.push({ move: r.move, score: r.score });
  return { best: r.move, score: r.score, depth: r.depth, nodes: s.nodes, ms: Date.now() - t0, cands };
}

const api = { Chess, START, sqName, nameSq, think, evaluate, P, N, B, R, Q, K, LETTER, VAL, file, rank };
if (typeof module !== 'undefined' && module.exports) module.exports = api; else Object.assign(root, api);
})(typeof self !== 'undefined' ? self : this);
