(() => {
'use strict';
const $ = id => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const LANES = [
  { id: 'edu', name: 'Education',     color: '#ffa62b', y: 92 },
  { id: 'sec', name: 'Security',      color: '#ff4d6a', y: 208 },
  { id: 'prj', name: 'Projects',      color: '#34d399', y: 324 },
  { id: 'ai',  name: 'AI and agents', color: '#a78bfa', y: 440 },
  { id: 'wrk', name: 'Work',          color: '#4da3ff', y: 556 },
];
const L = Object.fromEntries(LANES.map(l => [l.id, l]));

/* a station is one dot on one line. Stations that share an `ix` are the same piece of work counted on several lines. */
const S = [
  /* education */
  { lane: 'edu', x: 110,  name: ['BTEC Level 3 IT'], sub: 'Sep 2020', lp: 'a', t: 'Birmingham Metropolitan College. Programming, IT project management and mobile apps, plus a module on cyber security and incident management.' },
  { lane: 'edu', x: 330,  name: ['BTEC complete'], sub: 'Jul 2022', lp: 'a', t: 'Double Distinction Merit.' },
  { lane: 'edu', x: 470,  name: ['Coventry BSc begins'], sub: 'Sep 2023', lp: 'a', t: 'BSc (Hons) Ethical Hacking and Cyber Security at Coventry University.' },
  { lane: 'edu', x: 760,  ix: 'dis', name: ['Dissertation'], sub: '2025-26', lp: 'a', t: 'Research Project Preparation scored 87% and Research Project Delivery 76%, which is 81.5% across the two modules. The project is the Supply Chain Risk Assessment Framework.', acts: [['See the framework demo', '../demos/supply-chain-risk.html']] },
  { lane: 'edu', x: 1130, name: ['First-Class Honours'], sub: 'Jul 2026', lp: 'a', t: '76.4% classification average on the best 100 Level 6 credits, with a 73.67% final-year average.', acts: [['Download CV', '../assets/cv.pdf']] },
  /* security */
  { lane: 'sec', x: 300,  name: ['Cyber Security &', 'Incident Mgmt'], sub: 'BTEC module', lp: 'b', t: 'The first formal security module, taken during the BTEC.' },
  { lane: 'sec', x: 560,  name: ['Security Operations'], sub: 'Year 2 · 67%', lp: 'b', t: 'Coventry Level 5 module on running a security operations function.' },
  { lane: 'sec', x: 690,  name: ['Advanced', 'Penetration Testing'], sub: 'Year 3 · 71%', lp: 'b', t: 'Coventry Level 6 module on offensive testing.' },
  { lane: 'sec', x: 880,  ix: 'soc', name: ['SOC Detection Lab'], sub: '2026', lp: 'a', t: 'A simulated four-stage intrusion and Sigma-style rules that correlate events across time windows, deployable in Wazuh.', acts: [['Play Intrusion Replay', '../v37/index.html'], ['GitHub', 'https://github.com/shaddiegit/soc-detection-lab']] },
  { lane: 'sec', x: 980,  ix: 'ioc', name: ['IOC Hunter'], sub: '2026', lp: 'a', t: 'Indicator lookups hardened against malformed and hostile input, with 19/19 security tests passing.', acts: [['Try the demo', '../demos/ioc-hunter.html'], ['GitHub', 'https://github.com/shaddiegit/ioc-hunter']] },
  { lane: 'sec', x: 1080, ix: 'tw', name: ['ThreatWeave'], sub: '2026', lp: 'a', t: 'Four threat feeds pulled in parallel, indicators correlated by ASN and MITRE ATT&CK overlap into structured dossiers. 5/5 concurrency tests pass.', acts: [['Try the demo', '../demos/threatweave.html'], ['GitHub', 'https://github.com/shaddiegit/threatweave']] },
  /* projects */
  { lane: 'prj', x: 760,  ix: 'dis', name: ['Supply Chain Risk', 'Framework'], sub: '2025-26', lp: 'b', t: 'A 15-criterion weighted vendor-risk model informed by NIST SP 800-161, tested against historical incidents and refined through UAT with non-technical users.', acts: [['Try the demo', '../demos/supply-chain-risk.html']] },
  { lane: 'prj', x: 880,  ix: 'soc', name: ['SOC Detection Lab'], sub: '2026', lp: 'b', t: null },
  { lane: 'prj', x: 980,  ix: 'ioc', name: ['IOC Hunter'], sub: '2026', lp: 'b', t: null },
  { lane: 'prj', x: 1080, ix: 'tw',  name: ['ThreatWeave'], sub: '2026', lp: 'b', t: null },
  { lane: 'prj', x: 1180, ix: 'sv',  name: ['SecureView'], sub: '2026', lp: 'a', t: 'A SOC triage dashboard that prioritises alerts and gives remediation guidance, built on typed LLM data contracts. 17/17 unit tests pass.', acts: [['Try the demo', '../demos/secureview.html'], ['GitHub', 'https://github.com/shaddiegit/secureview']] },
  { lane: 'prj', x: 1280, ix: 'aem', name: ['ADAM / EVE / Mizan'], sub: '2026', lp: 'a', t: 'An AI-agent authorization prototype: proposals, adversarial critique and independent policy mediation kept apart. 21/21 Phase-8 and 7/7 concept tests pass.', acts: [['Try the demo', '../demos/adam-eve-mizan.html'], ['GitHub', 'https://github.com/brownofficial69/adam-eve-mizan']] },
  /* ai */
  { lane: 'ai', x: 830,  name: ['Claude Academy'], sub: '2026 · nine courses', lp: 'b', t: 'Claude Code, MCP, subagents, agent skills and what AI systems can and cannot do.' },
  { lane: 'ai', x: 1080, ix: 'tw',  name: ['ThreatWeave'], sub: 'Claude API', lp: 'b', t: null },
  { lane: 'ai', x: 1180, ix: 'sv',  name: ['SecureView'], sub: 'typed LLM output', lp: 'b', t: null },
  { lane: 'ai', x: 1280, ix: 'aem', name: ['ADAM / EVE / Mizan'], sub: 'agent safety', lp: 'b', t: null },
  /* work */
  { lane: 'wrk', x: 110,  name: ['Hospitality &', 'operations'], sub: '2020', lp: 'a', t: 'Customer-facing service, stock handling and operational teamwork at multiple venues, then Jaguar Land Rover, alongside study.' },
  { lane: 'wrk', x: 690,  name: ['Hospitality ends'], sub: '2025', lp: 'a', t: 'Five years of part-time operational work finished as the degree came to an end.' },
  { lane: 'wrk', x: 1000, name: ['FDM Group'], sub: 'Deutsche Bank · now', lp: 'a', t: 'Consultant, EUC / email specialist (level 1). First-line Outlook and Teams support in a banking environment, working tickets in ServiceNow and escalating what needs a deeper fix, with exposure to Nagios monitoring.' },
];
const SEGS = { edu: [[110, 1130]], sec: [[300, 1080]], prj: [[760, 1280]], ai: [[830, 1280]], wrk: [[110, 690], [1000, 1130]] };
S.forEach((s, i) => { s.i = i; s.id = 's' + i; });
const groups = {}; S.forEach(s => { if (s.ix) (groups[s.ix] = groups[s.ix] || []).push(s); });
/* shared text for interchange partners */
Object.values(groups).forEach(g => { const src = g.find(s => s.t); g.forEach(s => { if (!s.t) { s.t = src.t; s.acts = src.acts; } }); });

/* ───────── svg build ───────── */
const svg = $('map');
const el = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v)); if (parent) parent.appendChild(e); return e; };
const defs = el('defs', {}, svg);
const clip = el('clipPath', { id: 'reveal' }, defs); const clipRect = el('rect', { x: 0, y: 0, width: 1400, height: 640 }, clip);
const gAxis = el('g', {}, svg), gLines = el('g', { 'clip-path': 'url(#reveal)' }, svg), gConn = el('g', { 'clip-path': 'url(#reveal)' }, svg), gSt = el('g', {}, svg), gTrain = el('g', {}, svg);

/* time axis */
[[110, '2020'], [220, '2021'], [330, '2022'], [440, '2023'], [550, '2024'], [660, '2025']].forEach(([x, t]) => { const tx = el('text', { x, y: 30, 'text-anchor': 'middle', class: 'yr' }, gAxis); tx.textContent = t;
  el('line', { x1: x, x2: x, y1: 38, y2: 600, stroke: 'rgba(120,140,180,.08)' }, gAxis); });
{ el('path', { d: 'M 740 36 h 600 M 740 32 v 8 M 1340 32 v 8', stroke: '#5d6b86', fill: 'none', 'stroke-width': 1 }, gAxis);
  const t = el('text', { x: 1040, y: 28, 'text-anchor': 'middle', class: 'yr' }, gAxis); t.textContent = '2026 (stretched: six projects landed this year)'; }

const laneEls = {};
LANES.forEach(l => { const g = el('g', { class: 'lane', 'data-lane': l.id }, gLines); laneEls[l.id] = g;
  SEGS[l.id].forEach(([a, b]) => el('line', { x1: a, x2: b, y1: l.y, y2: l.y, stroke: l.color, 'stroke-width': 10, 'stroke-linecap': 'round', style: `filter:drop-shadow(0 0 7px ${l.color}99)` }, g)); });

/* interchange capsules */
const connEls = [];
Object.entries(groups).forEach(([k, g]) => { if (g.length < 2) return; const ys = g.map(s => L[s.lane].y); const x = g[0].x;
  const c = el('g', { class: 'conn' }, gConn); el('line', { x1: x, x2: x, y1: Math.min(...ys), y2: Math.max(...ys), stroke: '#fff', 'stroke-width': 16, 'stroke-linecap': 'round' }, c);
  el('line', { x1: x, x2: x, y1: Math.min(...ys), y2: Math.max(...ys), stroke: '#0a0e16', 'stroke-width': 8, 'stroke-linecap': 'round' }, c); c._g = g; connEls.push(c); });

/* stations */
S.forEach(s => {
  const l = L[s.lane]; const g = el('g', { class: 'st', tabindex: 0, role: 'button', 'aria-label': `${s.name.join(' ')}, ${s.sub}, ${l.name} line`, 'data-i': s.i, transform: `translate(${s.x} ${l.y})` }, gSt);
  el('circle', { class: 'halo', r: 19 }, g); el('circle', { class: 'dot', r: 8, stroke: l.color }, g);
  const above = s.lp === 'a'; const inGroup = s.ix && groups[s.ix].length > 1;
  /* interchange stations are labelled once, on their top line */
  const topOfGroup = !inGroup || groups[s.ix].reduce((a, b) => L[a.lane].y < L[b.lane].y ? a : b) === s;
  const bottomOfGroup = !inGroup || groups[s.ix].reduce((a, b) => L[a.lane].y > L[b.lane].y ? a : b) === s;
  const show = !inGroup || (above ? topOfGroup : bottomOfGroup);
  if (show) { let y = above ? -22 - (s.name.length - 1) * 14 - 14 : 28;
    s.name.forEach((ln, n) => { const t = el('text', { x: 0, y: y + n * 14, 'text-anchor': 'middle' }, g); t.textContent = ln; });
    const sb = el('text', { x: 0, y: y + s.name.length * 14, 'text-anchor': 'middle', class: 'sub' }, g); sb.textContent = s.sub; }
  s.g = g;
  g.addEventListener('click', e => { e.stopPropagation(); open(s); });
  g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(s); } });
  g.addEventListener('pointerenter', e => showTip(s, e)); g.addEventListener('pointermove', e => showTip(s, e)); g.addEventListener('pointerleave', () => { $('tip').hidden = true; });
});

/* ───────── legend ───────── */
const hiddenLanes = new Set(); let focusLane = null;
LANES.forEach(l => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-pressed', 'true'); b.style.setProperty('--c', l.color); b.innerHTML = '<i></i><span></span>'; b.lastChild.textContent = l.name;
  b.addEventListener('click', () => { if (hiddenLanes.has(l.id)) hiddenLanes.delete(l.id); else hiddenLanes.add(l.id); b.setAttribute('aria-pressed', String(!hiddenLanes.has(l.id))); applyVis(); });
  $('legend').appendChild(b); });

/* ───────── visibility: legend filter + reveal scan ───────── */
let scan = Infinity;
function applyVis() {
  LANES.forEach(l => { laneEls[l.id].style.opacity = hiddenLanes.has(l.id) ? 0.1 : 1; });
  S.forEach(s => { const hid = hiddenLanes.has(s.lane); const seen = s.x <= scan; s.g.style.opacity = !seen ? 0.06 : hid ? 0.12 : 1; s.g.style.pointerEvents = (!seen || hid) ? 'none' : ''; });
  connEls.forEach(c => { c.style.opacity = c._g.every(s => !hiddenLanes.has(s.lane)) && c._g[0].x <= scan ? 1 : 0.06; });
  clipRect.setAttribute('width', scan === Infinity ? 1400 : Math.max(0, scan));
}
applyVis();

/* ───────── card and tooltip ───────── */
function open(s) {
  S.forEach(o => o.g.classList.toggle('on', o === s));
  const l = L[s.lane]; const card = $('card'); card.hidden = false; card.style.setProperty('--c', l.color);
  $('cK').textContent = `${l.name} line · ${s.sub}`; $('cT').textContent = s.name.join(' '); $('cD').textContent = s.t || '';
  const serv = $('cS'); serv.innerHTML = ''; (s.ix ? groups[s.ix] : [s]).forEach(o => { const li = document.createElement('li'); li.textContent = L[o.lane].name; li.style.setProperty('--c2', L[o.lane].color); serv.appendChild(li); });
  const a = $('cA'); a.innerHTML = ''; (s.acts || []).forEach(([t, u]) => { const e = document.createElement('a'); e.textContent = t; e.href = u; if (u.startsWith('http')) { e.target = '_blank'; e.rel = 'noopener noreferrer'; } a.appendChild(e); });
}
function closeCard() { $('card').hidden = true; S.forEach(o => o.g.classList.remove('on')); }
$('close').addEventListener('click', closeCard);
addEventListener('keydown', e => { if (e.key === 'Escape') closeCard(); });
function showTip(s, e) { const t = $('tip'); const r = $('mapWrap').getBoundingClientRect(); t.hidden = false; t.innerHTML = '<b></b><span></span>'; t.firstChild.textContent = s.name.join(' '); t.lastChild.textContent = L[s.lane].name + ' · ' + s.sub;
  t.style.left = Math.min(r.width - 250, e.clientX - r.left + 14) + 'px'; t.style.top = (e.clientY - r.top + 14) + 'px'; }

/* ───────── pan and zoom ───────── */
let vb = { x: 0, y: 0, w: 1400, h: 640 }; const FULL = { x: 0, y: 0, w: 1400, h: 640 };
function setVB() { svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`); }
function zoomAt(f, cx, cy) { const nw = Math.min(FULL.w, Math.max(300, vb.w * f)), nh = nw * FULL.h / FULL.w; vb.x = cx - (cx - vb.x) * (nw / vb.w); vb.y = cy - (cy - vb.y) * (nh / vb.h); vb.w = nw; vb.h = nh; clampVB(); setVB(); }
function clampVB() { vb.x = Math.min(Math.max(vb.x, FULL.x - 100), FULL.x + FULL.w - vb.w + 100); vb.y = Math.min(Math.max(vb.y, FULL.y - 60), FULL.y + FULL.h - vb.h + 60); }
function toSVG(clientX, clientY) { const r = svg.getBoundingClientRect(); const k = Math.max(vb.w / r.width, vb.h / r.height); const offX = (r.width - vb.w / k) / 2, offY = (r.height - vb.h / k) / 2; return { x: vb.x + (clientX - r.left - offX) * k, y: vb.y + (clientY - r.top - offY) * k }; }
$('mapWrap').addEventListener('wheel', e => { e.preventDefault(); const p = toSVG(e.clientX, e.clientY); zoomAt(e.deltaY > 0 ? 1.12 : 1 / 1.12, p.x, p.y); }, { passive: false });
let drag = null;
$('mapWrap').addEventListener('pointerdown', e => { if (e.target.closest('.st')) return; drag = { x: e.clientX, y: e.clientY, vx: vb.x, vy: vb.y, moved: false }; $('mapWrap').setPointerCapture(e.pointerId); });
$('mapWrap').addEventListener('pointermove', e => { if (!drag) return; const r = svg.getBoundingClientRect(); const k = Math.max(vb.w / r.width, vb.h / r.height);
  vb.x = drag.vx - (e.clientX - drag.x) * k; vb.y = drag.vy - (e.clientY - drag.y) * k; drag.moved = true; clampVB(); setVB(); });
$('mapWrap').addEventListener('pointerup', () => { if (drag && !drag.moved) closeCard(); drag = null; });
$('zin').addEventListener('click', () => zoomAt(1 / 1.3, vb.x + vb.w / 2, vb.y + vb.h / 2));
$('zout').addEventListener('click', () => zoomAt(1.3, vb.x + vb.w / 2, vb.y + vb.h / 2));
$('zfit').addEventListener('click', () => { vb = { ...FULL }; setVB(); });

/* ───────── time machine: the map builds left to right ───────── */
let playing = false;
function play() {
  if (playing) return; playing = true; closeCard(); $('play').textContent = 'Skip'; scan = 60; $('caption').textContent = '';
  const t0 = performance.now(), DUR = reduced ? 600 : 16000; let lastCaption = '';
  (function tick(now) {
    const k = Math.min((now - t0) / DUR, 1); scan = 60 + 1340 * k;
    const passed = S.filter(s => s.x <= scan && s.x > scan - 14); passed.forEach(s => { s.g.animate([{ transform: `translate(${s.x}px, ${L[s.lane].y}px) scale(1.7)` }, { transform: `translate(${s.x}px, ${L[s.lane].y}px) scale(1)` }], { duration: 500, easing: 'cubic-bezier(.2,.8,.2,1)' }); });
    const latest = S.filter(s => s.x <= scan).sort((a, b) => b.x - a.x)[0]; if (latest && latest.sub !== lastCaption) { lastCaption = latest.sub; $('caption').textContent = latest.sub + ' · ' + latest.name.join(' '); }
    applyVis();
    if (k < 1 && playing) requestAnimationFrame(tick); else { playing = false; scan = Infinity; applyVis(); $('play').textContent = 'Watch it build'; $('caption').textContent = ''; }
  })(t0);
}
$('play').addEventListener('click', () => { if (playing) { playing = false; scan = Infinity; applyVis(); $('play').textContent = 'Watch it build'; $('caption').textContent = ''; } else play(); });

/* ───────── ride a line ───────── */
let riding = null, rideNext = 0;
$('ride').addEventListener('click', () => {
  if (riding) { riding.stop = true; return; }
  const lane = LANES[rideNext++ % LANES.length]; hiddenLanes.clear(); $('legend').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', 'true')); applyVis(); closeCard();
  const stops = S.filter(s => s.lane === lane.id).sort((a, b) => a.x - b.x); const x0 = stops[0].x - 20, x1 = stops[stops.length - 1].x + 20;
  gTrain.innerHTML = ''; const train = el('g', {}, gTrain);
  for (let i = 0; i < 3; i++) { el('rect', { x: -i * 34 - 28, y: -11, width: 30, height: 22, rx: 7, fill: lane.color, stroke: '#fff', 'stroke-width': 2 }, train); el('rect', { x: -i * 34 - 20, y: -5, width: 14, height: 6, rx: 2, fill: '#fff', opacity: 0.85 }, train); }
  const t0 = performance.now(), DUR = reduced ? 800 : 9000; const reached = new Set(); riding = { stop: false }; $('ride').textContent = 'Stop the train';
  (function tick(now) {
    const k = Math.min((now - t0) / DUR, 1), x = x0 + (x1 - x0) * (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
    train.setAttribute('transform', `translate(${x} ${lane.y})`);
    stops.forEach(s => { if (x >= s.x && !reached.has(s.i)) { reached.add(s.i); $('caption').textContent = `${lane.name} line · ${s.sub} · ${s.name.join(' ')}`; s.g.animate([{ transform: `translate(${s.x}px, ${lane.y}px) scale(1.8)` }, { transform: `translate(${s.x}px, ${lane.y}px) scale(1)` }], { duration: 600 }); } });
    if (k < 1 && !riding.stop) requestAnimationFrame(tick); else { gTrain.innerHTML = ''; riding = null; $('ride').textContent = 'Ride a line'; setTimeout(() => { $('caption').textContent = ''; }, 1500); }
  })(t0);
});

setVB();
if (!reduced) setTimeout(play, 500);
window.__metro = { S, open, play, get scan() { return scan; } };
})();
