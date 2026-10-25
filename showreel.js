/* showreel.js: an interactive, real-time cut of the work, drawn live on a canvas.
   There is no video file. Every frame is rendered at the canvas's native pixel size (up to 3840 x 2160).
   Six chapters joined by ripple wipes. Each chapter can be played with:
     ADAM / EVE / Mizan  - click an agent to see its job, click the verdict to step through decisions
     Threat graph        - drag to rotate, click a project node
     Detection timeline  - click a Sigma rule to switch it off and see where the intrusion is caught
     Memory ledger       - click a block to tamper with it; hashes are real SHA-256 (Web Crypto API)
   Interacting pauses the reel. Keys: Space play/pause, arrows change chapter, F fullscreen. */
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
  ['Detection timeline', 'Sigma rules watch a simulated intrusion move through four stages.'],
  ['Memory ledger', 'A hash chain makes tampering with an agent\'s memory detectable.'],
  ['End card', 'First-Class BSc Ethical Hacking and Cyber Security, Coventry University.'],
];
/* what each chapter teaches, and what to try; shown in the chapter list under the reel */
const LEARN = [
  ['Who this is', 'Security engineering for AI agents and for the systems around them: detection, threat intelligence and authorization.', 'Press Play, or pick any chapter.'],
  ['Separation of duties', 'ADAM proposes an action, EVE argues against it, and Mizan applies a fixed policy without reading ADAM\'s reasoning, so a persuasive prompt cannot talk its way past the decision.', 'Click an agent to see its job. Click the verdict bar to step through allow, deny and escalate.'],
  ['Correlation', 'Linking projects, skills and frameworks shows clusters, the same way ThreatWeave groups indicators that share an ASN or an ATT&CK technique.', 'Drag to rotate the graph. Click a bright node.'],
  ['Defence in depth', 'Each stage of an intrusion maps to a MITRE ATT&CK technique and a Sigma rule. Catching it early means less damage; a gap in coverage means it gets further.', 'Click a rule to switch it off and watch where the intrusion is caught instead.'],
  ['Tamper evidence', 'Each block stores the SHA-256 hash of its content plus the previous hash. Change one block and every hash after it changes, so the edit cannot hide.', 'Click any block to edit it. The hashes are computed live in your browser.'],
  ['Get in touch', 'Seeking junior security-engineering and AI-evaluation roles in the UK.', 'The contact section is just below.'],
];

/* theme colours, read from CSS so the reel follows the site theme */
let C = { g: '25,211,235', c: '143,227,255', p: '124,140,255', a: '255,211,122', bg: '3,19,31', tx: '232,246,255', light: false };
function readTheme() {
  const cs = getComputedStyle(document.documentElement), v = n => cs.getPropertyValue(n).trim().replace(/\s+/g, ''), th = document.documentElement.getAttribute('data-theme');
  C = { g: v('--g-rgb') || C.g, c: v('--c-rgb') || C.c, p: v('--p-rgb') || C.p, a: v('--a-rgb') || C.a, bg: v('--bg-rgb') || C.bg, tx: '232,246,255', light: th === 'holo' || th === 'calm' };
  if (C.light) C.tx = th === 'calm' ? '31,29,26' : '12,27,58';
  loop.done = false;
}
const rgba = (c, a) => `rgba(${c},${a})`;
const ease = t => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
const clamp01 = t => Math.min(1, Math.max(0, t));
function hash(n) { let x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
const RED = '220,64,84';

/* ───────── interaction state ───────── */
const S = { info: null, verdict: -1, rulesOff: new Set(), tamper: -1, drag: 0, dragging: null, hover: null };
let HITS = [], collect = false;
function hit(x, y, w, h, id) { if (collect) HITS.push({ x, y, w, h, id }); }

/* ───────── canvas size: native pixels, capped at 4K ───────── */
let W = 1920, H = 1080, U = 1, resText = '';
function size() {
  const dpr = Math.min(window.devicePixelRatio || 1, 3), r = cv.getBoundingClientRect();
  let w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
  if (w > 3840) { h = Math.round(h * 3840 / w); w = 3840; } if (h > 2160) { w = Math.round(w * 2160 / h); h = 2160; }
  if (!w || !h) return;
  if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
  W = cv.width; H = cv.height; U = H / 1080; resText = W + ' × ' + H;
  const el = host.querySelector('.reel-res'); if (el) el.textContent = resText + (W >= 3800 ? ' · 4K' : '');
  loop.done = false;
}

/* ───────── shared drawing ───────── */
function bg() {
  const g = ctx.createRadialGradient(W * 0.5, H * 0.35, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.75);
  g.addColorStop(0, rgba(C.g, C.light ? 0.12 : 0.22)); g.addColorStop(0.55, rgba(C.bg, 1)); g.addColorStop(1, rgba(C.bg, 1)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = rgba(C.g, 0.05); ctx.lineWidth = U; const s = 72 * U; for (let x = 0; x < W; x += s) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += s) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
}
function glow(x, y, r, col, a) { if (C.light) a *= 0.55; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); }
function text(t, x, y, size, col, align = 'center', weight = 600, font = 'Inter, Sora, system-ui, sans-serif') { ctx.font = `${weight} ${size * U}px ${font}`; ctx.textAlign = align; ctx.fillStyle = col; ctx.fillText(t, x, y); }
function ring(x, y, r, col, a, lw) { ctx.strokeStyle = rgba(col, a); ctx.lineWidth = lw * U; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.stroke(); }
function node(x, y, r, col, label, sub, pulse, id) {
  const hov = S.hover === id; glow(x, y, r * (hov ? 3.6 : 3), col, 0.22 + 0.1 * Math.sin(pulse)); ctx.fillStyle = rgba(C.bg, 0.92); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); ring(x, y, r, col, 1, hov ? 5 : 3);
  text(label, x, y + 7 * U, 22, rgba(C.tx, 1)); if (sub) text(sub, x, y + r + 34 * U, 17, rgba(C.tx, 0.6), 'center', 400, 'JetBrains Mono, monospace');
  if (id) hit(x - r, y - r, r * 2, r * 2, id);
}
function packet(ax, ay, bx, by, t, col, label) {
  const k = ((t % 1) + 1) % 1, e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2, x = ax + (bx - ax) * e, y = ay + (by - ay) * e;
  for (let j = 5; j >= 1; j--) { const ee = Math.max(0, e - j * 0.03); glow(ax + (bx - ax) * ee, ay + (by - ay) * ee, 12 * U, col, 0.13); } glow(x, y, 26 * U, col, 0.9); ctx.fillStyle = C.light ? rgba(col, 1) : '#fff'; ctx.beginPath(); ctx.arc(x, y, 5 * U, 0, 6.283); ctx.fill();
  if (label) text(label, x, y - 24 * U, 16, rgba(col, 1), 'center', 600, 'JetBrains Mono, monospace');
}
function caption(t, i) { text(t, 80 * U, 120 * U, 54, rgba(C.tx, 1), 'left', 700, 'Fraunces, Georgia, serif'); text(NAMES[i][1], 80 * U, 168 * U, 24, rgba(C.tx, 0.62), 'left', 400); }
function wrap(str, x, y, maxW, size, col, lh) { ctx.font = `400 ${size * U}px Inter, system-ui, sans-serif`; ctx.textAlign = 'left'; ctx.fillStyle = col; let line = '', yy = y; str.split(' ').forEach(w => { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line, x, yy); line = w; yy += lh * U; } else line = t; }); if (line) ctx.fillText(line, x, yy); return yy; }
function infoCard() {
  if (!S.info) return; const w = 620 * U, x = 80 * U, y = H - 300 * U, h = 220 * U;
  ctx.fillStyle = rgba(C.bg, 0.94); ctx.strokeStyle = rgba(C.g, 0.8); ctx.lineWidth = 2 * U; ctx.beginPath(); ctx.roundRect(x, y, w, h, 22 * U); ctx.fill(); ctx.stroke();
  text(S.info[0], x + 28 * U, y + 52 * U, 30, rgba(C.g, 1), 'left', 700); wrap(S.info[1], x + 28 * U, y + 92 * U, w - 56 * U, 21, rgba(C.tx, 0.85), 30);
}
function hint(str) { text(str, W - 80 * U, 120 * U, 20, rgba(C.tx, 0.55), 'right', 500, 'JetBrains Mono, monospace'); }

/* ───────── scenes: each draws from its own local time t (seconds) ───────── */
function sceneTitle(t) {
  bg(); const cx = W / 2, cy = H * 0.46, fall = ease(t / 1.0);
  if (t < 1.05) { const y = -40 * U + (cy - 40 * U + 40 * U) * fall * fall; ctx.save(); ctx.translate(W / 2, y); ctx.scale(0.8, 1.2); glow(0, 0, 70 * U, C.c, 0.5); ctx.fillStyle = C.light ? rgba(C.g, 1) : '#fff'; ctx.beginPath(); ctx.arc(0, 0, 14 * U, 0, 6.283); ctx.fill(); ctx.restore(); }
  else { const a = t - 1.0; for (let i = 0; i < 5; i++) { const age = a - i * 0.22; if (age <= 0) continue; ring(cx, cy, age * 520 * U, i % 2 ? C.c : C.g, Math.max(0, 0.7 - age * 0.22), 4 - i * 0.5); } glow(cx, cy, 480 * U, C.g, 0.12 * Math.max(0, 1 - a * 0.3)); }
  const name = 'Shadman Hossain'; ctx.font = `600 ${150 * U}px Fraunces, Georgia, serif`; ctx.textAlign = 'left'; const tw = ctx.measureText(name).width; let x = cx - tw / 2;
  for (let i = 0; i < name.length; i++) { const ch = name[i], w = ctx.measureText(ch).width, k = ease((t - 1.5 - i * 0.045) / 0.5); ctx.globalAlpha = k; ctx.fillStyle = rgba(C.tx, 1); ctx.fillText(ch, x, cy + 40 * U + (1 - k) * 40 * U); x += w; } ctx.globalAlpha = 1;
  text('AI security and security engineering', cx, cy + 130 * U, 40, rgba(C.g, clamp01((t - 3.0) / 0.8)), 'center', 400);
  ['Detection engineering', 'Agent authorization', 'Threat intelligence'].forEach((s, i) => text(s, cx + (i - 1) * 520 * U, cy + 210 * U, 24, rgba(C.tx, 0.6 * clamp01((t - 3.8 - i * 0.2) / 0.6)), 'center', 400, 'JetBrains Mono, monospace'));
}
const ROLES = {
  op: ['Operator', 'The human who sets the mission and holds the approval tokens for irreversible actions.'],
  ad: ['ADAM, the proposer', 'An LLM agent that turns the mission into concrete tool calls. It is useful, and it can be fooled by what it reads.'],
  ev: ['EVE, the critic', 'An adversarial reviewer that looks for injection, scope creep and unsafe side effects in every proposal.'],
  mz: ['Mizan, the mediator', 'A deterministic policy engine. It checks the action against policy and never reads ADAM\'s explanation.'],
  tl: ['Tools', 'Only the tools the mission needs, each with its own scope. Mizan is the only path to them.'],
  lg: ['Ledger', 'Every decision is appended to a hash chain, so the record of what happened cannot be quietly edited.'],
};
const VERDICTS = [['ALLOW', 'read_file /workspace/report.md', null, 'Inside the mission scope and reversible.'], ['DENY', 'send_email  (from untrusted content)', RED, 'The instruction came from a web page, not the operator.'], ['ESCALATE', 'delete_records  (needs a human token)', null, 'Irreversible, so a person has to approve it.']];
function sceneAdam(t) {
  bg(); caption('ADAM / EVE / Mizan', 1);
  const P = { op: [W * .10, H * .58], ad: [W * .30, H * .58], ev: [W * .52, H * .36], mz: [W * .68, H * .62], tl: [W * .90, H * .40], lg: [W * .90, H * .76] };
  const E = [['op', 'ad', C.tx], ['ad', 'ev', C.a], ['ad', 'mz', C.c], ['ev', 'mz', C.a], ['mz', 'tl', C.g], ['mz', 'lg', C.p]];
  E.forEach(([a, b, col]) => { ctx.strokeStyle = rgba(col, 0.28); ctx.lineWidth = 2 * U; ctx.setLineDash([8 * U, 10 * U]); ctx.lineDashOffset = -t * 40 * U; ctx.beginPath(); ctx.moveTo(P[a][0], P[a][1]); ctx.lineTo(P[b][0], P[b][1]); ctx.stroke(); ctx.setLineDash([]); });
  node(P.op[0], P.op[1], 46 * U, C.tx, 'Op', 'operator', t, 'op'); node(P.ad[0], P.ad[1], 70 * U, C.c, 'ADAM', 'proposes', t, 'ad'); node(P.ev[0], P.ev[1], 56 * U, C.a, 'EVE', 'critiques', t + 1, 'ev'); node(P.mz[0], P.mz[1], 76 * U, C.g, 'Mizan', 'decides', t + 2, 'mz');
  node(P.tl[0], P.tl[1], 40 * U, C.g, 'Tools', '', t, 'tl'); node(P.lg[0], P.lg[1], 40 * U, C.p, 'Ledger', '', t, 'lg');
  const cyc = t / 1.5; E.forEach(([a, b, col], i) => { const k = cyc - i * 0.18; if (k > 0) packet(P[a][0], P[a][1], P[b][0], P[b][1], k, col, i === 0 ? 'mission' : i === 1 ? 'proposal' : null); });
  const vi = S.verdict >= 0 ? S.verdict : Math.floor(t / 1.8) % 3, v = VERDICTS[vi], col = v[2] || (vi === 0 ? C.g : C.a), k = S.verdict >= 0 ? 1 : ease((t % 1.8) / 0.3);
  ctx.globalAlpha = k; const bx = W * 0.5, by = H * 0.89, bw = 980 * U, bh = 86 * U; ctx.fillStyle = rgba(col, 0.14); ctx.strokeStyle = rgba(col, 0.9); ctx.lineWidth = (S.hover === 'verdict' ? 4 : 3) * U; ctx.beginPath(); ctx.roundRect(bx - bw / 2, by - bh / 2, bw, bh, 40 * U); ctx.fill(); ctx.stroke();
  text(v[0], bx - bw / 2 + 140 * U, by + 2 * U, 30, rgba(col, 1), 'center', 700, 'JetBrains Mono, monospace'); text(v[1], bx + 80 * U, by - 4 * U, 23, rgba(C.tx, 0.92), 'center', 400, 'JetBrains Mono, monospace');
  text(v[3], bx + 80 * U, by + 26 * U, 18, rgba(C.tx, 0.6), 'center', 400); ctx.globalAlpha = 1; hit(bx - bw / 2, by - bh / 2, bw, bh, 'verdict');
  infoCard(); hint('click an agent · click the verdict');
}
const GRAPH = (() => { const pts = []; for (let i = 0; i < 74; i++) { const a = hash(i) * 6.283, b = Math.acos(2 * hash(i + 90) - 1), r = 0.55 + 0.45 * hash(i + 200); pts.push([r * Math.sin(b) * Math.cos(a), r * Math.cos(b), r * Math.sin(b) * Math.sin(a)]); }
  const ed = []; for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1], pts[i][2] - pts[j][2]); if (d < 0.5) ed.push([i, j]); } return { pts, ed }; })();
const KEYS = ['ThreatWeave', 'SecureView', 'SOC Lab', 'IOC Hunter', 'ADAM / EVE / Mizan', 'Supply Chain Risk'];
const KEYINFO = [
  'Concurrent Go CLI that pulls four threat feeds and correlates indicators by ASN and ATT&CK technique.',
  'SOC triage dashboard: a prioritised alert queue with remediation guidance.',
  'Sigma rules and time-window correlation over a four-stage simulated intrusion, deployed in Wazuh.',
  'Classifies and sanitises messy indicators, checks four intel sources and returns one verdict.',
  'Agent authorization: a proposer, an adversarial critic and an independent policy mediator.',
  'Fifteen weighted vendor-risk criteria informed by NIST SP 800-161.',
];
function sceneGraph(t) {
  bg(); caption('Threat graph', 2); const cx = W * 0.6, cy = H * 0.56, R = H * 0.40, ang = t * 0.35 + S.drag, ca = Math.cos(ang), sa = Math.sin(ang), tilt = 0.35, ct = Math.cos(tilt), st = Math.sin(tilt);
  const proj = GRAPH.pts.map(p => { const x = p[0] * ca - p[2] * sa, z = p[0] * sa + p[2] * ca, y = p[1] * ct - z * st, z2 = p[1] * st + z * ct, k = 1 / (1.9 - z2 * 0.7); return [cx + x * R * k * 1.5, cy + y * R * k * 1.5, z2, k]; });
  ctx.lineWidth = 1.4 * U; GRAPH.ed.forEach(([a, b], i) => { const pa = proj[a], pb = proj[b]; const al = 0.1 + 0.18 * (pa[2] + pb[2] + 2) / 4; ctx.strokeStyle = rgba(i % 5 === 0 ? C.c : C.g, al); ctx.beginPath(); ctx.moveTo(pa[0], pa[1]); ctx.lineTo(pb[0], pb[1]); ctx.stroke();
    if (i % 7 === 0) { const k = ((t * 0.7 + i * 0.13) % 1); glow(pa[0] + (pb[0] - pa[0]) * k, pa[1] + (pb[1] - pa[1]) * k, 14 * U, C.c, 0.8); } });
  proj.forEach((p, i) => { const key = i < KEYS.length, hov = S.hover === 'k' + i; glow(p[0], p[1], (key ? (hov ? 70 : 46) : 18) * U * p[3], key ? C.g : C.c, key ? 0.55 : 0.35); ctx.fillStyle = key ? (C.light ? rgba(C.g, 1) : '#fff') : rgba(C.tx, 0.85); ctx.beginPath(); ctx.arc(p[0], p[1], (key ? 8 : 3.5) * U * p[3] * 1.4, 0, 6.283); ctx.fill();
    if (key && p[2] > -0.2) { text(KEYS[i], p[0] + 18 * U, p[1] - 14 * U, 22, rgba(C.tx, 0.92), 'left', 500); hit(p[0] - 30 * U, p[1] - 30 * U, 60 * U, 60 * U, 'k' + i); } });
  infoCard(); hint('drag to rotate · click a bright node');
}
const STAGES = ['Recon', 'Initial access', 'Privilege escalation', 'Exfiltration'], MITRE = ['T1595', 'T1110', 'T1548', 'T1041'];
function sceneKill(t) {
  bg(); caption('Detection timeline', 3); const x0 = W * 0.08, x1 = W * 0.92, y0 = H * 0.40;
  let caught = -1; for (let i = 0; i < 4; i++) if (!S.rulesOff.has(i)) { caught = i; break; }
  const stopAt = caught < 0 ? 1 : (caught + 0.5) / 4, prog = Math.min(clamp01(t / 4.4), stopAt);
  ctx.fillStyle = rgba(C.tx, 0.1); ctx.beginPath(); ctx.roundRect(x0, y0 - 8 * U, x1 - x0, 16 * U, 8 * U); ctx.fill(); ctx.fillStyle = rgba(caught < 0 && prog >= 1 ? RED : C.g, 0.9); ctx.beginPath(); ctx.roundRect(x0, y0 - 8 * U, (x1 - x0) * prog, 16 * U, 8 * U); ctx.fill(); glow(x0 + (x1 - x0) * prog, y0, 60 * U, C.c, 0.9);
  STAGES.forEach((s, i) => { const x = x0 + (x1 - x0) * (i + 0.5) / 4, reached = prog >= (i + 0.45) / 4, off = S.rulesOff.has(i), alert = reached && i === caught;
    text(s, x, y0 - 70 * U, 32, rgba(reached ? C.a : C.tx, reached ? 1 : 0.55)); text(MITRE[i], x, y0 - 34 * U, 20, rgba(C.tx, 0.5), 'center', 400, 'JetBrains Mono, monospace');
    const bw = 300 * U, bh = 190 * U, bx = x - bw / 2, by = y0 + 110 * U, col = off ? C.tx : alert ? C.g : C.tx, hov = S.hover === 'r' + i;
    ctx.fillStyle = rgba(col, alert ? 0.12 : 0.04); ctx.strokeStyle = rgba(off ? RED : col, alert ? 0.9 : off ? 0.6 : 0.25); ctx.lineWidth = (hov ? 4 : 2.5) * U; if (off) ctx.setLineDash([10 * U, 8 * U]);
    ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 24 * U); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
    text('Sigma rule ' + (i + 1), x, by + 52 * U, 24, rgba(C.tx, off ? 0.45 : 1), 'center', 600);
    text(off ? 'OFF' : alert ? 'ALERT' : reached ? 'missed' : 'watching', x, by + 110 * U, alert ? 44 : 28, rgba(off ? RED : alert ? C.g : C.tx, off || alert ? 1 : 0.5), 'center', 700, 'JetBrains Mono, monospace');
    text(off ? 'click to switch on' : 'click to switch off', x, by + 158 * U, 16, rgba(C.tx, hov ? 0.8 : 0.4), 'center', 400, 'JetBrains Mono, monospace');
    hit(bx, by, bw, bh, 'r' + i);
    if (alert) { const age = t - 4.4 * (i + 0.45) / 4; ring(x, by + 95 * U, Math.max(0, age) * 160 * U, C.g, Math.max(0, 0.7 - age * 0.5), 3); } });
  const done = t > 4.4 * stopAt + 0.2;
  if (done) text(caught < 0 ? 'Nothing fired. The data left the network.' : caught === 0 ? 'Caught at reconnaissance, before anyone got in.' : `Caught at stage ${caught + 1}: ${STAGES[caught].toLowerCase()}.`, W / 2, H * 0.86, 38, rgba(caught < 0 ? RED : C.g, ease((t - 4.4 * stopAt - 0.2) / 0.6)), 'center', 600);
  hint('click a rule to switch it off or on');
}
/* the ledger: real SHA-256 over each block's content plus the previous hash */
const BLOCKS = ['mission: summarise the Q3 report', 'read_file /workspace/q3.md', 'critique: no injection found', 'policy: ALLOW read, scope ok', 'write_file summary.md', 'handoff to operator'];
const EDIT = ['mission: email the Q3 report to eve@example.net', 'read_file /finance/payroll.csv', 'critique: skipped', 'policy: ALLOW everything', 'write_file /etc/passwd', 'handoff to attacker'];
const CHAINS = []; /* CHAINS[0] is the honest chain, CHAINS[i + 1] the chain with block i edited */
(async function buildChains() {
  const sha = async s => { if (!(window.crypto && crypto.subtle)) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h.toString(16).padStart(8, '0').repeat(8); } const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); };
  for (let v = -1; v < BLOCKS.length; v++) { let prev = '0'.repeat(64); const out = []; for (let i = 0; i < BLOCKS.length; i++) { const h = await sha(prev + '|' + (i === v ? EDIT[i] : BLOCKS[i])); out.push(h); prev = h; } CHAINS[v + 1] = out; }
  loop.done = false;
})();
function sceneLedger(t) {
  bg(); caption('Memory ledger', 4); const n = 6, bw = W * 0.128, gap = W * 0.022, x0 = (W - (n * bw + (n - 1) * gap)) / 2, y = H * 0.52;
  const tam = S.tamper >= 0 ? S.tamper : (t > 4.0 ? 2 : -1), honest = CHAINS[0], cur = CHAINS[tam + 1];
  for (let i = 0; i < n; i++) {
    const appear = S.tamper >= 0 ? 1 : ease((t - 0.4 - i * 0.45) / 0.5); if (appear <= 0) continue; const x = x0 + i * (bw + gap), broken = tam >= 0 && i >= tam, col = broken ? RED : C.g, hov = S.hover === 'b' + i;
    ctx.globalAlpha = appear; ctx.fillStyle = rgba(col, 0.1); ctx.strokeStyle = rgba(col, 0.95); ctx.lineWidth = (hov ? 5 : 3) * U; ctx.beginPath(); ctx.roundRect(x, y - 130 * U, bw, 260 * U, 22 * U); ctx.fill(); ctx.stroke();
    text('#' + (i + 1), x + bw / 2, y - 88 * U, 28, rgba(C.tx, 1), 'center', 700, 'JetBrains Mono, monospace');
    wrap((i === tam ? EDIT[i] : BLOCKS[i]), x + 16 * U, y - 52 * U, bw - 32 * U, 15, rgba(i === tam ? RED : C.tx, 0.75), 20);
    text('SHA-256', x + bw / 2, y + 44 * U, 14, rgba(C.tx, 0.5), 'center', 400, 'JetBrains Mono, monospace');
    const h = cur ? cur[i].slice(0, 12) : '…'; text(h, x + bw / 2, y + 74 * U, 19, rgba(col, 1), 'center', 600, 'JetBrains Mono, monospace');
    if (broken && honest) text('was ' + honest[i].slice(0, 8), x + bw / 2, y + 104 * U, 14, rgba(C.tx, 0.5), 'center', 400, 'JetBrains Mono, monospace');
    hit(x, y - 130 * U, bw, 260 * U, 'b' + i);
    if (i < n - 1) { ctx.strokeStyle = rgba(tam >= 0 && i + 1 >= tam ? RED : C.g, 0.6); ctx.lineWidth = 3 * U; ctx.beginPath(); ctx.moveTo(x + bw, y); ctx.lineTo(x + bw + gap, y); ctx.stroke(); } ctx.globalAlpha = 1;
  }
  if (tam >= 0) text(`Block ${tam + 1} was edited, so its hash and every hash after it changed.`, W / 2, H * 0.84, 34, rgba(RED, S.tamper >= 0 ? 1 : ease((t - 4.0) / 0.5)), 'center', 600);
  else text('Each block hashes its content plus the hash before it', W / 2, H * 0.84, 34, rgba(C.tx, 0.65 * clamp01((t - 2.5) / 0.8)), 'center', 400);
  hint(S.tamper >= 0 ? 'click the edited block to restore it' : 'click a block to tamper with it');
}
function sceneEnd(t) {
  bg(); const cx = W / 2, cy = H * 0.44; for (let i = 0; i < 3; i++) { const a = (t * 0.45 + i * 0.33) % 1; ring(cx, cy - 140 * U, 60 * U + a * 520 * U, C.g, 0.5 * (1 - a), 3); }
  text('SH', cx, cy - 110 * U, 110, rgba(C.g, 1), 'center', 600, 'Fraunces, Georgia, serif'); text('Shadman Hossain', cx, cy + 70 * U, 92, rgba(C.tx, ease(t / 0.8)), 'center', 600, 'Fraunces, Georgia, serif');
  text('First-Class BSc Ethical Hacking and Cyber Security', cx, cy + 150 * U, 36, rgba(C.tx, 0.8 * ease((t - 0.7) / 0.8)), 'center', 400); text('Seeking junior security-engineering and AI-evaluation roles in the UK', cx, cy + 205 * U, 30, rgba(C.g, ease((t - 1.3) / 0.8)), 'center', 400);
}
const SCENES = [sceneTitle, sceneAdam, sceneGraph, sceneKill, sceneLedger, sceneEnd];

/* ───────── compositor: scenes joined by a ripple wipe ───────── */
function frame(T) {
  T = ((T % TOTAL) + TOTAL) % TOTAL; const i = Math.min(N - 1, Math.floor(T / SCENE)), local = T - i * SCENE, next = (i + 1) % N, toNext = i < N - 1 ? local - (SCENE - TR) : -1;
  HITS = []; collect = toNext <= 0;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H); ctx.save(); SCENES[i](local + (i ? TR : 0)); ctx.restore(); collect = false;
  if (toNext > 0) {
    const k = ease(toNext / TR), cx = W / 2, cy = H / 2, r = k * Math.hypot(W, H) * 0.62;
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.283); ctx.clip(); SCENES[next](toNext); ctx.restore();
    for (let j = 0; j < 3; j++) { const rr = r - j * 36 * U; if (rr > 0) ring(cx, cy, rr, j ? C.c : C.light ? C.g : '255,255,255', (1 - k) * (0.9 - j * 0.25), 6 - j * 2); }
  }
  if (i === N - 1 && local > SCENE - 0.6) { ctx.fillStyle = `rgba(${C.bg},${(local - (SCENE - 0.6)) / 0.6})`; ctx.fillRect(0, 0, W, H); }
  if (i === 0 && local < 0.5) { ctx.fillStyle = `rgba(${C.bg},${1 - local / 0.5})`; ctx.fillRect(0, 0, W, H); }
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.4, W / 2, H / 2, Math.max(W, H) * 0.78); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(${C.bg},${C.light ? 0.2 : 0.6})`); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  return i;
}

/* ───────── player ───────── */
let T = 0, playing = false, last = 0, visible = false, curScene = -1;
const btn = host.querySelector('.reel-play'), full = host.querySelector('.reel-full'), cap = host.querySelector('.reel-cap'), segs = [...host.querySelectorAll('.reel-seg')];
/* chapter list under the reel: what each chapter teaches, and what to try */
const list = document.createElement('ol'); list.className = 'reel-chapters';
list.innerHTML = NAMES.map((n, i) => `<li><button type="button" data-i="${i}"><span class="rc-n">${String(i + 1).padStart(2, '0')}</span><span class="rc-b"><b>${n[0]}</b><span class="rc-l">${LEARN[i][0]}. ${LEARN[i][1]}</span><span class="rc-t">${LEARN[i][2]}</span></span></button></li>`).join('');
host.insertAdjacentElement('afterend', list);
const chapBtns = [...list.querySelectorAll('button')];
function seekScene(k) { T = k * SCENE + (k ? TR : 0); S.info = null; loop.done = false; paint(); }
function paint() {
  const i = frame(T);
  if (i !== curScene) { curScene = i; S.info = null; if (cap) cap.textContent = `Chapter ${i + 1} of ${N}: ${NAMES[i][0]}. ${LEARN[i][1]}`; segs.forEach((s, k) => s.classList.toggle('on', k === i)); chapBtns.forEach((b, k) => b.setAttribute('aria-current', k === i ? 'step' : 'false')); }
  segs.forEach((s, k) => { const f = k < i ? 1 : k > i ? 0 : (T - i * SCENE) / SCENE; s.firstElementChild.style.width = (clamp01(f) * 100) + '%'; });
}
function loop(now) {
  requestAnimationFrame(loop); if (!visible) { last = now; return; }
  if (playing) { T += Math.min(0.1, (now - last) / 1000); } last = now;
  /* when paused, keep drawing the current chapter so hover and clicks respond, and the scene's own motion stays alive */
  if (playing || !loop.done || S.hover !== null || S.dragging) { paint(); loop.done = !playing; }
}
function setPlaying(p) { playing = p; loop.done = false; if (btn) { btn.setAttribute('aria-pressed', String(p)); btn.textContent = p ? 'Pause' : 'Play'; } }
if (btn) btn.addEventListener('click', () => setPlaying(!playing));
if (full) full.addEventListener('click', () => { if (document.fullscreenElement) document.exitFullscreen(); else if (host.requestFullscreen) host.requestFullscreen(); });
segs.forEach((s, k) => s.addEventListener('click', () => seekScene(k)));
chapBtns.forEach((b, k) => b.addEventListener('click', () => { seekScene(k); setPlaying(false); host.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' }); }));

/* pointer: map to canvas pixels, hit-test what the current chapter drew */
function at(e) { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; }
function find(p) { for (let k = HITS.length - 1; k >= 0; k--) { const h = HITS[k]; if (p[0] >= h.x && p[0] <= h.x + h.w && p[1] >= h.y && p[1] <= h.y + h.h) return h.id; } return null; }
cv.addEventListener('pointermove', e => {
  const p = at(e);
  if (S.dragging) { S.drag = S.dragging.a + (p[0] - S.dragging.x) / W * 4; return; }
  const id = find(p); if (id !== S.hover) { S.hover = id; loop.done = false; } cv.style.cursor = id ? 'pointer' : curScene === 2 ? 'grab' : 'default';
});
cv.addEventListener('pointerleave', () => { S.hover = null; S.dragging = null; loop.done = false; });
cv.addEventListener('pointerdown', e => {
  const p = at(e), id = find(p);
  if (!id && curScene === 2) { S.dragging = { x: p[0], a: S.drag }; cv.setPointerCapture(e.pointerId); setPlaying(false); cv.style.cursor = 'grabbing'; return; }
  if (!id) return;
  setPlaying(false);
  if (ROLES[id]) S.info = ROLES[id];
  else if (id === 'verdict') S.verdict = (Math.max(S.verdict, Math.floor(((T - SCENE) + TR) / 1.8) % 3) + 1) % 3;
  else if (id[0] === 'k') { const k = +id.slice(1); S.info = [KEYS[k], KEYINFO[k]]; }
  else if (id[0] === 'r') { const k = +id.slice(1); S.rulesOff.has(k) ? S.rulesOff.delete(k) : S.rulesOff.add(k); T = Math.min(T, 3 * SCENE + TR + 0.01); setPlaying(true); setTimeout(() => setPlaying(false), 5200); }
  else if (id[0] === 'b') { const k = +id.slice(1); S.tamper = S.tamper === k ? -1 : k; }
  loop.done = false;
});
cv.addEventListener('pointerup', () => { if (S.dragging) { S.dragging = null; cv.style.cursor = 'grab'; } });
host.tabIndex = 0;
host.addEventListener('keydown', e => {
  if (e.target !== host && e.target !== cv) return;
  if (e.key === ' ' || e.key === 'k') { e.preventDefault(); setPlaying(!playing); }
  else if (e.key === 'ArrowRight') { e.preventDefault(); seekScene((curScene + 1) % N); }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); seekScene((curScene + N - 1) % N); }
  else if (e.key === 'f' || e.key === 'F') { full && full.click(); }
});

new MutationObserver(readTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] }); readTheme();
new ResizeObserver(size).observe(cv); document.addEventListener('fullscreenchange', size);
new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible && !reduced && !loop.started) { loop.started = true; setPlaying(true); } }, { threshold: 0.35 }).observe(host);
size(); paint(); requestAnimationFrame(loop);
window.__reel = { seek(t) { T = t; loop.done = false; paint(); }, seekScene, setPlaying, state: S, get playing() { return playing; }, get scene() { return curScene; } };
})();
