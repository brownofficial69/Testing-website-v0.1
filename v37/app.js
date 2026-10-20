(() => {
'use strict';
const $ = id => document.getElementById(id);
const ATT = '203.0.113.66', END = 260;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ───────── world ───────── */
const HOSTS = {
  att:  { label: ATT,              x: 0.10, y: 0.50, ext: true },
  srv:  { label: 'SRV-03',         x: 0.50, y: 0.50 },
  ws:   { label: 'WS-014',         x: 0.50, y: 0.14 },
  file: { label: 'FILE-01',        x: 0.50, y: 0.86 },
  dc:   { label: 'DC-01',          x: 0.80, y: 0.22 },
  bak:  { label: 'backup.example', x: 0.90, y: 0.78, ext: true },
};
const LINKS = [['att', 'srv'], ['ws', 'srv'], ['file', 'srv'], ['dc', 'srv'], ['srv', 'bak']];
const STAGES = [
  { name: 'Recon', sub: 'T1595 · port scan' },
  { name: 'Initial access', sub: 'T1110 · SSH brute force' },
  { name: 'Privilege escalation', sub: 'T1548 · sudo abuse' },
  { name: 'Exfiltration', sub: 'T1041 · over C2' },
];

/* ───────── the attack, plus the benign noise that tempts bad rules ───────── */
const EV = [];
const add = o => EV.push(Object.assign({ mal: 0, from: 'ws', to: 'srv' }, o));
for (let t = 3; t < 255; t += 17) add({ t, type: 'http', from: 'dc', text: 'GET /health 200 from DC-01' });
add({ t: 12, type: 'probe', src: '10.0.0.2', text: 'conn refused 10.0.0.2 to :8080 (monitoring)' });
add({ t: 13.5, type: 'probe', src: '10.0.0.2', text: 'conn refused 10.0.0.2 to :8443 (monitoring)' });
[21, 22, 23, 25, 53, 80, 110, 135, 139, 143, 443, 445, 993, 1433, 3306, 3389, 5900, 8080, 8443, 9200]
  .forEach((p, i) => add({ t: 5 + i * 0.9, type: 'probe', src: ATT, from: 'att', mal: 1, stage: 0, text: `conn refused ${ATT} to :${p}` }));
add({ t: 30, type: 'ssh_fail', src: '10.0.0.14', user: 'asmith', text: 'ssh failed asmith from 10.0.0.14 (typo)' });
add({ t: 34, type: 'ssh_fail', src: '10.0.0.14', user: 'asmith', text: 'ssh failed asmith from 10.0.0.14 (typo)' });
add({ t: 38, type: 'ssh_ok', src: '10.0.0.14', user: 'asmith', text: 'ssh accepted asmith from 10.0.0.14' });
for (let i = 0; i < 14; i++) add({ t: 50 + i * 1.6, type: 'ssh_fail', src: ATT, from: 'att', mal: 1, stage: 1, text: `ssh failed deploy from ${ATT}` });
add({ t: 74, type: 'ssh_ok', src: ATT, from: 'att', mal: 1, stage: 1, text: `ssh accepted deploy from ${ATT}` });
add({ t: 90, type: 'sudo', sub: 'apt', text: 'ops: sudo apt update' });
add({ t: 110, type: 'sudo', sub: 'list', from: 'att', mal: 1, stage: 2, text: 'deploy: sudo -l' });
add({ t: 125, type: 'sudo', sub: 'suid', from: 'att', mal: 1, stage: 2, text: 'deploy: sudo cp /bin/bash /tmp/.sysd && chmod u+s' });
add({ t: 150, type: 'bytes', mb: 40, from: 'srv', to: 'bak', dest: 'bak', text: '40 MB to backup.example (nightly backup)' });
for (let i = 0; i < 6; i++) add({ t: 170 + i * 10, type: 'bytes', mb: 15, from: 'srv', to: 'att', dest: 'att', mal: 1, stage: 3, text: `15 MB to ${ATT}:443` });
EV.sort((a, b) => a.t - b.t);

/* ───────── rules ───────── */
const RULES = {
  r1: { on: false, n: 10, title: 'Port scan', tag: 'T1595', min: 2, max: 20,
        yaml: n => `detection:\n  sel: {event: conn_refused}\n  condition: <em>count(sel) by src ≥ ${n}</em>\n  timeframe: 20s`,
        hint: n => n <= 2 ? 'This is low enough to flag the monitoring probes at 12s. Expect a false positive.' : 'Higher means fewer false positives but a later alert.',
        lbl: 'Probes from one source' },
  r2: { on: false, n: 5, title: 'Brute force, then success', tag: 'T1110', min: 1, max: 15,
        yaml: n => `detection:\n  fail: {event: ssh_failed}\n  ok:   {event: ssh_accepted}\n  condition: <em>count(fail) by src ≥ ${n}</em> then ok\n  timeframe: 60s`,
        hint: n => n <= 2 ? 'A user mistyping a password twice, then logging in, now trips this rule.' : 'Multi-stage: failures first, then a success from the same source.',
        lbl: 'Failures before a success' },
  r3: { on: false, mode: 'precise', title: 'Sudo abuse', tag: 'T1548.003',
        yaml: m => `detection:\n  sel: {event: sudo}\n  condition: <em>${m === 'broad' ? 'sel' : 'sel and cmd contains (chmod u+s | cp /bin/bash)'}</em>`,
        hint: m => m === 'broad' ? 'Every sudo command alerts, including the admin\'s routine apt update.' : 'Only privilege-escalation patterns alert, so routine admin work stays quiet.' },
  r4: { on: false, mb: 70, title: 'Large outbound transfer', tag: 'T1041', min: 10, max: 120,
        yaml: n => `detection:\n  sel: {event: bytes_out, dest: not corporate}\n  condition: <em>sum(bytes) ≥ ${n} MB</em>\n  timeframe: 60s`,
        hint: n => n <= 40 ? 'The 40 MB nightly backup would trip this. Raise it.' : n > 90 ? 'The attacker only moves 90 MB. This will never fire.' : 'Lower alerts sooner, but must stay above the 40 MB backup.',
        lbl: 'Megabytes in 60 seconds' },
};

function evaluate() {
  const raw = [];
  const win = (list, t, w) => list.filter(e => e.t <= t && e.t > t - w);
  if (RULES.r1.on) {
    const bySrc = {};
    EV.filter(e => e.type === 'probe').forEach(e => { (bySrc[e.src] = bySrc[e.src] || []).push(e); });
    Object.entries(bySrc).forEach(([src, list]) => { for (const e of list) { if (win(list, e.t, 20).length >= RULES.r1.n) { raw.push({ t: e.t, rule: 'Port scan', stage: 0, tp: src === ATT, text: `Port scan from ${src}` }); break; } } });
  }
  if (RULES.r2.on) {
    EV.filter(e => e.type === 'ssh_ok').forEach(ok => {
      const fails = EV.filter(e => e.type === 'ssh_fail' && e.src === ok.src && e.t < ok.t && e.t > ok.t - 60);
      if (fails.length >= RULES.r2.n) raw.push({ t: ok.t, rule: 'Brute force', stage: 1, tp: ok.src === ATT, text: `${fails.length} failures then success from ${ok.src}` });
    });
  }
  if (RULES.r3.on) {
    EV.filter(e => e.type === 'sudo').forEach(e => {
      if (RULES.r3.mode === 'broad' || e.sub === 'suid') raw.push({ t: e.t, rule: 'Sudo abuse', stage: 2, tp: !!e.mal, text: e.text });
    });
  }
  if (RULES.r4.on) {
    const by = {}; EV.filter(e => e.type === 'bytes').forEach(e => { (by[e.dest] = by[e.dest] || []).push(e); });
    Object.entries(by).forEach(([d, list]) => { for (const e of list) { const mb = win(list, e.t, 60).reduce((s, x) => s + x.mb, 0);
      if (mb >= RULES.r4.mb) { raw.push({ t: e.t, rule: 'Exfiltration', stage: 3, tp: d === 'att', text: `${mb} MB outbound to ${HOSTS[d].label}` }); break; } } });
  }
  raw.sort((a, b) => a.t - b.t);
  const contain = $('contain').checked;
  const firstTp = raw.find(a => a.tp);
  const tc = contain && firstTp ? firstTp.t : Infinity;
  const events = EV.filter(e => !(e.mal && e.t > tc));
  const alerts = raw.filter(a => !(a.tp && a.t > tc));
  const exfil = events.filter(e => e.mal && e.type === 'bytes').reduce((s, e) => s + e.mb, 0);
  return { events, alerts, tc, exfil, firstTp, fps: alerts.filter(a => !a.tp).length };
}

/* ───────── ui ───────── */
let R = evaluate();
const ruleHost = $('ruleHost');
function buildRules() {
  ruleHost.innerHTML = '';
  Object.entries(RULES).forEach(([id, r]) => {
    const el = document.createElement('section'); el.className = 'rule' + (r.on ? ' on' : ''); el.dataset.id = id;
    const val = r.n ?? r.mb;
    el.innerHTML = `<header><div><h3>${r.title}</h3><span class="tag">${r.tag}</span></div>
      <label class="switch"><span class="sr" style="position:absolute;width:1px;height:1px;overflow:hidden">Enable ${r.title}</span><input type="checkbox" ${r.on ? 'checked' : ''} /><i></i></label></header>
      <pre></pre>
      ${id === 'r3'
        ? `<label class="ctl">Match<select><option value="precise"${r.mode === 'precise' ? ' selected' : ''}>Only escalation patterns</option><option value="broad"${r.mode === 'broad' ? ' selected' : ''}>Any sudo command</option></select></label>`
        : `<label class="ctl"><span>${r.lbl}: <b>${val}</b></span><input type="range" min="${r.min}" max="${r.max}" value="${val}" /></label>`}
      <p class="hint"></p>`;
    const refresh = () => { const v = r.n ?? r.mb; el.querySelector('pre').innerHTML = r.yaml(id === 'r3' ? r.mode : v); el.querySelector('.hint').textContent = r.hint(id === 'r3' ? r.mode : v);
      el.classList.toggle('on', r.on); const b = el.querySelector('.ctl b'); if (b) b.textContent = v; };
    refresh();
    el.querySelector('input[type=checkbox]').addEventListener('change', e => { r.on = e.target.checked; refresh(); changed(); });
    const rng = el.querySelector('input[type=range]'); if (rng) rng.addEventListener('input', () => { if (id === 'r4') r.mb = +rng.value; else r.n = +rng.value; refresh(); changed(); });
    const sel = el.querySelector('select'); if (sel) sel.addEventListener('change', () => { r.mode = sel.value; refresh(); changed(); });
    ruleHost.appendChild(el);
  });
}

/* ───────── playback state ───────── */
let simT = 0, playing = false, last = 0, finished = false;
const speedSel = $('speed'), scrub = $('scrub');

function changed() { R = evaluate(); draw(); updateHud(); }
$('contain').addEventListener('change', changed);
scrub.addEventListener('input', () => { playing = false; setPlayLabel(); simT = +scrub.value; finished = false; hideOverlay(); updateHud(); });
$('play').addEventListener('click', () => { if (simT >= END - 0.1 || finished) simT = 0; finished = false; hideOverlay(); playing = !playing; setPlayLabel(); last = performance.now(); });
$('reset').addEventListener('click', () => { playing = false; simT = 0; finished = false; setPlayLabel(); hideOverlay(); updateHud(); });
function setPlayLabel() { $('play').textContent = playing ? 'Pause' : (simT > 0 && simT < END ? 'Resume' : 'Replay attack'); }
function hideOverlay() { $('overlay').hidden = true; }

/* ───────── hud ───────── */
const chain = $('chain');
STAGES.forEach((s, i) => { const d = document.createElement('div'); d.className = 'stg'; d.setAttribute('role', 'listitem'); d.dataset.s = 'pending'; d.innerHTML = `<b>${i + 1}. ${s.name}</b><span>${s.sub}</span>`; chain.appendChild(d); });

function stageState(i) {
  const seen = R.events.filter(e => e.mal && e.stage === i && e.t <= simT);
  const det = R.alerts.some(a => a.tp && a.stage === i && a.t <= simT);
  if (det) return 'detected';
  if (seen.length) { return simT >= END - 0.01 ? 'missed' : 'active'; }
  if (R.tc !== Infinity && simT >= R.tc) return 'blocked';
  if (simT >= END - 0.01) { return EV.some(e => e.stage === i && e.mal) ? 'blocked' : 'pending'; }
  return 'pending';
}
let logSig = '';
function updateHud() {
  [...chain.children].forEach((c, i) => { c.dataset.s = stageState(i); });
  const exf = R.events.filter(e => e.mal && e.type === 'bytes' && e.t <= simT).reduce((s, e) => s + e.mb, 0);
  const alerts = R.alerts.filter(a => a.t <= simT);
  const tps = alerts.filter(a => a.tp), fps = alerts.filter(a => !a.tp);
  const mttd = tps.length ? Math.round(tps[0].t - 5) + 's' : '–';
  $('score').innerHTML = `<div><b style="color:${exf ? 'var(--red)' : 'var(--teal)'}">${exf}</b><span>MB exfiltrated</span></div>
    <div><b>${new Set(tps.map(a => a.stage)).size}/4</b><span>stages detected</span></div>
    <div><b style="color:${fps.length ? 'var(--amber)' : 'inherit'}">${fps.length}</b><span>false positives</span></div>
    <div><b>${mttd}</b><span>time to detect</span></div>`;
  $('clock').textContent = Math.floor(simT) + 's';
  scrub.value = simT;

  const items = [];
  R.events.filter(e => e.t <= simT && e.type !== 'http').forEach(e => items.push({ t: e.t, k: e.mal ? 'mal' : '', tag: 'EVT', text: e.text }));
  alerts.forEach(a => items.push({ t: a.t, k: a.tp ? 'alert' : 'fp', tag: a.tp ? 'ALERT' : 'FALSE+', text: `${a.rule}: ${a.text}` }));
  items.sort((a, b) => b.t - a.t || (a.tag === 'EVT') - (b.tag === 'EVT'));
  const top = items.slice(0, 7); const sig = top.map(i => i.t + i.tag + i.text).join('|');
  if (sig !== logSig) { logSig = sig; $('log').innerHTML = top.map(i => `<li class="${i.k}"><time>${Math.floor(i.t)}s</time><span>${i.tag}</span><span></span></li>`).join('');
    [...$('log').children].forEach((li, n) => { li.lastChild.textContent = top[n].text; }); }
  if (!top.length) $('log').innerHTML = '<li><time>0s</time><span>–</span><span>Press Replay attack. All rules are off, so nothing is watching yet.</span></li>';
}

function showResult() {
  const exf = R.exfil, tp = R.alerts.filter(a => a.tp), fps = R.fps;
  let score = 100 - exf * 0.9 - fps * 9 - (R.tc !== Infinity ? Math.max(0, R.tc - 5) * 0.12 : 0);
  if (!tp.length) score = Math.min(score, 20);
  score = Math.max(0, Math.min(100, score));
  const g = score >= 90 ? 'S' : score >= 75 ? 'A' : score >= 55 ? 'B' : score >= 30 ? 'C' : 'F';
  const col = score >= 75 ? 'var(--teal)' : score >= 40 ? 'var(--amber)' : 'var(--red)';
  const anyOn = Object.values(RULES).some(r => r.on);
  let msg;
  if (!anyOn) msg = 'Nothing was watching. The attacker scanned, broke in, escalated and moved 90 MB out. Switch on the rules and replay.';
  else if (!tp.length) msg = 'Your rules never matched the attack, so the full 90 MB left. Check the thresholds: each hint says what the data looks like.';
  else {
    const stage = STAGES[tp[0].stage].name.toLowerCase();
    msg = `Caught at ${stage} after ${Math.round(tp[0].t - 5)} seconds.` + (exf ? ` ${exf} MB still got out first.` : ' Nothing was exfiltrated.');
    if (fps) msg += ` But ${fps} false alert${fps > 1 ? 's' : ''} would have woken an analyst for nothing.`;
    else if (tp[0].stage > 0) msg += ' An earlier rule would have stopped it sooner.';
  }
  const o = $('overlay'); o.hidden = false;
  o.innerHTML = `<div class="card"><div class="grade" style="color:${col}">${g}</div><h2>${tp.length ? 'Intrusion ' + (R.tc !== Infinity ? 'contained' : 'detected') : 'Intrusion succeeded'}</h2><p>${msg}</p><button class="go" type="button" id="again" style="background:var(--red);border:0;border-radius:8px;padding:10px 16px;font-weight:600;color:#190408;cursor:pointer">Tune the rules and replay</button></div>`;
  $('again').addEventListener('click', () => { hideOverlay(); simT = 0; finished = false; playing = false; setPlayLabel(); updateHud(); document.querySelector('.rules').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' }); });
  $('again').focus();
}

/* ───────── canvas ───────── */
const cv = $('net'), ctx = cv.getContext('2d');
let W = 0, H = 0, dpr = 1;
function resize() { dpr = Math.min(devicePixelRatio || 1, 2); const r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); draw(); }
new ResizeObserver(resize).observe(cv);
const pos = k => ({ x: HOSTS[k].x * W, y: HOSTS[k].y * H });
const rgba = (c, a) => `rgba(${c},${a})`;
const RED = '255,77,94', TEAL = '62,240,196', BLUE = '90,168,255', AMB = '255,181,71', GRY = '140,155,180';

function glowDot(x, y, r, c, a = 1) { const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3); g.addColorStop(0, rgba(c, a)); g.addColorStop(0.35, rgba(c, a * 0.35)); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 3, 0, 6.283); ctx.fill(); ctx.fillStyle = rgba(c, 1); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); }

function draw(now = 0) {
  if (!W) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
  /* grid */
  ctx.strokeStyle = 'rgba(120,150,200,.05)'; ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 36) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 36) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  const contained = R.tc !== Infinity && simT >= R.tc;
  const srvOwned = R.events.some(e => e.mal && e.type === 'ssh_ok' && e.t <= simT);
  const priv = R.events.some(e => e.mal && e.sub === 'suid' && e.t <= simT);
  const exfiltrating = R.events.some(e => e.mal && e.type === 'bytes' && e.t <= simT && simT - e.t < 12);

  /* links */
  LINKS.forEach(([a, b]) => { const p = pos(a), q = pos(b); const hot = (a === 'att' && !contained && simT > 4) ;
    ctx.strokeStyle = hot ? rgba(RED, .28) : 'rgba(150,170,200,.16)'; ctx.lineWidth = hot ? 1.6 : 1; ctx.setLineDash(a === 'att' && contained ? [4, 6] : []); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); ctx.setLineDash([]); });

  /* ambient traffic: quiet blue dots drifting along every link */
  if (!reduced) LINKS.forEach(([a, b], li) => { const p = pos(a), q = pos(b); for (let i = 0; i < 3; i++) { const k = ((now / 5200) + i / 3 + li * 0.17) % 1;
    ctx.fillStyle = rgba(BLUE, 0.22); ctx.beginPath(); ctx.arc(p.x + (q.x - p.x) * k, p.y + (q.y - p.y) * k, 1.8, 0, 6.283); ctx.fill(); } });

  /* packets */
  R.events.forEach(e => { const dur = e.type === 'bytes' ? 4 : 2.4; const age = simT - e.t; if (age < 0 || age > dur) return;
    const p = pos(e.from), q = pos(e.to); const k = age / dur, x = p.x + (q.x - p.x) * k, y = p.y + (q.y - p.y) * k;
    const c = e.mal ? RED : e.type === 'bytes' ? AMB : BLUE; const r = e.type === 'bytes' ? 4 + e.mb / 8 : 3;
    for (let t = 4; t >= 1; t--) { const kk = Math.max(0, k - t * 0.035); ctx.globalAlpha = (1 - t / 5) * 0.35 * (Math.sin(k * Math.PI) * 0.95 + 0.05); glowDot(p.x + (q.x - p.x) * kk, p.y + (q.y - p.y) * kk, r * 0.7, c, 0.8); }
    ctx.globalAlpha = Math.sin(k * Math.PI) * 0.95 + 0.05; glowDot(x, y, r, c, 0.95); ctx.globalAlpha = 1; });

  /* alerts: expanding rings */
  R.alerts.forEach(a => { const age = simT - a.t; if (age < 0 || age > 3.2) return; const p = pos('srv'); const k = age / 3.2;
    ctx.strokeStyle = rgba(a.tp ? TEAL : AMB, 1 - k); ctx.lineWidth = 2.2 * (1 - k) + 0.5; ctx.beginPath(); ctx.arc(p.x, p.y, 26 + k * 110, 0, 6.283); ctx.stroke();
    ctx.fillStyle = rgba(a.tp ? TEAL : AMB, Math.min(1, (1 - k) * 2)); ctx.font = '600 12px JetBrains Mono, monospace'; ctx.textAlign = 'center';
    ctx.fillText((a.tp ? 'ALERT · ' : 'FALSE POSITIVE · ') + a.rule, p.x, p.y - 42 - k * 18); });

  /* nodes */
  Object.keys(HOSTS).forEach(k => { const h = HOSTS[k], p = pos(k); let c = h.ext ? GRY : BLUE, r = 9;
    if (k === 'att') { c = RED; r = 11; if (contained) c = GRY; }
    if (k === 'srv') { r = 13; if (priv) c = RED; else if (srvOwned) c = AMB; }
    if (k === 'srv' && (srvOwned || priv)) { const pulse = reduced ? 0.5 : 0.5 + 0.5 * Math.sin(now / 260); ctx.strokeStyle = rgba(priv ? RED : AMB, 0.25 + pulse * 0.25); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, 24 + pulse * 6, 0, 6.283); ctx.stroke(); }
    glowDot(p.x, p.y, r, c, k === 'att' && contained ? 0.5 : 0.9);
    ctx.fillStyle = '#c7d2e3'; ctx.font = '500 12px JetBrains Mono, monospace'; ctx.textAlign = 'center'; ctx.fillText(h.label, p.x, p.y + r + 20);
    if (k === 'att' && contained) { ctx.fillStyle = rgba(TEAL, 1); ctx.font = '700 11px JetBrains Mono, monospace'; ctx.fillText('ISOLATED', p.x, p.y - r - 14); } });
  if (exfiltrating) { const p = pos('att'); ctx.fillStyle = rgba(RED, 1); ctx.font = '700 11px JetBrains Mono, monospace'; ctx.textAlign = 'center'; ctx.fillText('DATA LEAVING', p.x, p.y - 28); }
}

function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.1); last = now;
  if (playing) {
    simT = Math.min(END, simT + dt * +speedSel.value);
    if (simT >= END) { playing = false; finished = true; setPlayLabel(); updateHud(); showResult(); }
  }
  draw(now); if (playing) updateHud();
  requestAnimationFrame(loop);
}

/* ───────── intro ───────── */
buildRules(); updateHud(); setPlayLabel();
{ const o = $('overlay'); o.hidden = false;
  o.innerHTML = '<div class="card"><h2>An attacker is already at the door</h2><p>Replay the intrusion with every rule off and watch what happens. Then switch rules on and tune them: too sensitive and you flood the analyst, too lax and the data leaves.</p><button type="button" id="start" style="background:var(--red);border:0;border-radius:8px;padding:10px 16px;font-weight:600;color:#190408;cursor:pointer">Show me the attack</button></div>';
  $('start').addEventListener('click', () => { hideOverlay(); simT = 0; playing = true; setPlayLabel(); last = performance.now(); });
  $('start').focus({ preventScroll: true }); }
requestAnimationFrame(t => { last = t; loop(t); });
window.__replay = { RULES, evaluate, get R() { return R; }, setT(t) { simT = t; updateHud(); }, rebuild: buildRules, changed };
})();
