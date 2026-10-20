(() => {
'use strict';
const $ = id => document.getElementById(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const CATS = {
  id:   { name: 'Identity',          c: '#f4f6ff' },
  lang: { name: 'Languages',         c: '#f472b6' },
  eng:  { name: 'Engineering',       c: '#22d3ee' },
  det:  { name: 'Detection and intel', c: '#34d399' },
  ai:   { name: 'AI and agents',     c: '#a78bfa' },
  grc:  { name: 'GRC',               c: '#fbbf24' },
  cloud:{ name: 'Cloud',             c: '#60a5fa' },
  sup:  { name: 'Support',           c: '#94a3b8' },
  cred: { name: 'Credentials',       c: '#fb7185' },
};

/* [symbol, name, category, column, row, description] */
const EL = [
  ['Sh', 'Shadman',          'id',   1, 1, 'First-class cybersecurity graduate. Based in Birmingham, UK, with full right to work and no sponsorship needed.'],
  ['Cu', 'Coventry',         'id',  18, 1, 'Coventry University, BSc (Hons) Ethical Hacking and Cyber Security, 2023 to 2026.'],
  ['Py', 'Python',           'lang', 1, 2, 'Behind the detection lab, IOC Hunter and ADAM / EVE / Mizan.'],
  ['Go', 'Go',               'lang', 2, 2, 'ThreatWeave\'s concurrent feed collection.'],
  ['Ts', 'TypeScript',       'lang',13, 2, 'SecureView\'s typed data contracts.'],
  ['Ba', 'Bash',             'lang',14, 2, 'Shell automation on Linux.'],
  ['Vb', 'VBA',              'lang',15, 2, 'The scoring model in the dissertation.'],
  ['Rc', 'React',            'eng', 16, 2, 'The front end of SecureView.'],
  ['Gi', 'Git / GitHub',     'eng', 17, 2, 'Version control for every project.'],
  ['Rs', 'REST APIs',        'eng', 18, 2, 'Feed and service integration across the projects.'],
  ['Lx', 'Linux',            'eng',  1, 3, 'The working environment for security tooling.'],
  ['Pt', 'pytest',           'eng',  2, 3, 'Test suites behind the detection lab, IOC Hunter and ADAM / EVE / Mizan.'],
  ['Mi', 'MITRE ATT&CK',     'det', 13, 3, 'The shared language for mapping detections to adversary techniques.'],
  ['Sg', 'Sigma',            'det', 14, 3, 'Vendor-neutral detection rules written as YAML.'],
  ['Wz', 'Wazuh',            'det', 15, 3, 'Open-source security monitoring, the deployment target for the lab\'s rules.'],
  ['El', 'ELK',              'det', 16, 3, 'Elasticsearch, Logstash and Kibana for log search.'],
  ['Sp', 'Splunk',           'det', 17, 3, 'Search and correlation over machine data.'],
  ['Io', 'IOC analysis',     'det', 18, 3, 'Triage of indicators of compromise across feeds.'],
  ['Th', 'Threat hunting',   'det',  1, 4, 'Looking for adversary activity the rules have not caught.'],
  ['Cl', 'Claude API',       'ai',   2, 4, 'Used in ThreatWeave and SecureView, and studied through nine Claude Academy courses.'],
  ['Mc', 'MCP',              'ai',   3, 4, 'Model Context Protocol fundamentals.'],
  ['Ev', 'Evaluation design','ai',   4, 4, 'Designing tests that show what an AI system can and cannot be trusted to do.'],
  ['Tc', 'Tool-use controls','ai',   5, 4, 'Limiting which tools an agent can call, and when.'],
  ['Lo', 'Structured LLM output','ai',6, 4, 'Typed contracts so malformed model output is caught, not trusted.'],
  ['Lp', 'Least privilege',  'ai',   7, 4, 'Giving an agent only the access its current task needs.'],
  ['Me', 'Memory integrity', 'ai',   8, 4, 'Protecting an agent\'s persistent memory from tampering.'],
  ['Nc', 'NIST CSF',         'grc', 13, 4, 'The Cybersecurity Framework used to structure programmes.'],
  ['Ns', 'NIST SP 800-161',  'grc', 14, 4, 'Supply-chain risk guidance, the basis for the dissertation model.'],
  ['Is', 'ISO 27001',        'grc', 15, 4, 'The information-security management standard.'],
  ['Tp', 'Third-party risk', 'grc', 16, 4, 'Assessing the security of vendors and suppliers.'],
  ['S3', 'AWS S3',           'cloud',17, 4, 'Object storage.'],
  ['Ia', 'AWS IAM',          'cloud',18, 4, 'Identity and access management.'],
  ['Ec', 'AWS EC2',          'cloud', 1, 5, 'Compute.'],
  ['Ou', 'Outlook',          'sup',  2, 5, 'First-line support for colleagues in a banking environment.'],
  ['Tm', 'Teams',            'sup',  3, 5, 'First-line support for colleagues in a banking environment.'],
  ['Sn', 'ServiceNow',       'sup',  4, 5, 'Investigating and escalating issues in a ticket workflow.'],
  ['Ng', 'Nagios',           'sup',  5, 5, 'Exposure to operational monitoring.'],
  ['Bs', 'BSc First',        'cred', 7, 5, 'First-Class Honours. 76.4% classification average on the best 100 Level 6 credits.'],
  ['Bt', 'BTEC L3',          'cred', 8, 5, 'Double Distinction Merit, Birmingham Metropolitan College.'],
  ['Fd', 'FDM Group',        'cred', 9, 5, 'Consultant on a Deutsche Bank assignment.'],
  ['Ca', 'Claude Academy',   'cred',10, 5, 'Nine courses, including Claude Code, MCP, subagents and agent skills.'],
  ['Dd', 'Dissertation',     'cred',11, 5, 'Preparation 87% and delivery 76%, so 81.5% across the two modules.'],
].map((r, i) => ({ n: i + 1, s: r[0], name: r[1], cat: r[2], col: r[3], row: r[4], desc: r[5], c: CATS[r[2]].c }));
const bySym = Object.fromEntries(EL.map(e => [e.s, e]));

const COMPOUNDS = [
  { name: 'ADAM / EVE / Mizan', atoms: ['Py', 'Lp', 'Tc', 'Me', 'Ev', 'Pt'], d: 'Proposals, adversarial critique and independent policy mediation, kept apart. 21/21 Phase-8 and 7/7 concept tests passing.', acts: [['Try the demo', '../demos/adam-eve-mizan.html'], ['GitHub', 'https://github.com/brownofficial69/adam-eve-mizan']] },
  { name: 'ThreatWeave', atoms: ['Go', 'Cl', 'Mi', 'Io', 'Rs'], d: 'Four threat feeds pulled in parallel and correlated by ASN and ATT&CK overlap into dossiers. 5/5 concurrency tests passing.', acts: [['Try the demo', '../demos/threatweave.html'], ['GitHub', 'https://github.com/shaddiegit/threatweave']] },
  { name: 'SecureView', atoms: ['Ts', 'Rc', 'Cl', 'Lo'], d: 'A SOC triage dashboard on typed LLM data contracts. 17/17 unit tests passing.', acts: [['Try the demo', '../demos/secureview.html'], ['GitHub', 'https://github.com/shaddiegit/secureview']] },
  { name: 'SOC Detection Lab', atoms: ['Py', 'Sg', 'Wz', 'Pt', 'Mi', 'Th'], d: 'Multi-stage detections across a simulated four-stage intrusion, deployable in Wazuh.', acts: [['Play Intrusion Replay', '../v37/index.html'], ['GitHub', 'https://github.com/shaddiegit/soc-detection-lab']] },
  { name: 'IOC Hunter', atoms: ['Py', 'Io', 'Pt', 'Rs'], d: 'Indicator lookups hardened against hostile input. 19/19 security tests passing.', acts: [['Try the demo', '../demos/ioc-hunter.html'], ['GitHub', 'https://github.com/shaddiegit/ioc-hunter']] },
  { name: 'Supply Chain Risk Framework', atoms: ['Vb', 'Ns', 'Tp', 'Nc', 'Dd'], d: 'A 15-criterion weighted vendor-risk model, tested against historical incidents and refined through UAT.', acts: [['Try the demo', '../demos/supply-chain-risk.html']] },
  { name: 'Deutsche Bank support desk', atoms: ['Fd', 'Ou', 'Tm', 'Sn', 'Ng'], d: 'First-line Outlook and Teams support as an FDM consultant, working tickets in ServiceNow.', acts: [] },
];

/* ───────── build the table ───────── */
const table = $('table'); const tiles = {};
EL.forEach(e => {
  const b = document.createElement('button'); b.type = 'button'; b.className = 'el'; b.style.setProperty('--c', e.c); b.style.gridColumn = e.col; b.style.gridRow = e.row;
  b.setAttribute('aria-pressed', 'false'); b.setAttribute('aria-label', `${e.name}, ${CATS[e.cat].name}`);
  b.innerHTML = `<span class="n">${e.n}</span><span class="s">${e.s}</span><span class="nm"></span>`; b.querySelector('.nm').textContent = e.name;
  b.addEventListener('click', () => toggle(e.s)); b.addEventListener('pointerenter', () => detail(e)); b.addEventListener('focus', () => detail(e));
  b.addEventListener('pointermove', ev => { if (reduced) return; const r = b.getBoundingClientRect(); const x = (ev.clientX - r.left) / r.width - 0.5, y = (ev.clientY - r.top) / r.height - 0.5; b.style.transform = `rotateY(${(x * 22).toFixed(1)}deg) rotateX(${(-y * 22).toFixed(1)}deg) translateZ(10px)`; });
  b.addEventListener('pointerleave', () => { b.style.transform = ''; });
  table.appendChild(b); tiles[e.s] = b; e.el = b;
});

/* families */
const hiddenCats = new Set();
Object.entries(CATS).forEach(([k, v]) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'cat'; b.setAttribute('aria-pressed', 'true'); b.style.setProperty('--c', v.c); b.innerHTML = '<i></i><span></span>'; b.lastChild.textContent = v.name;
  b.addEventListener('click', () => { hiddenCats.has(k) ? hiddenCats.delete(k) : hiddenCats.add(k); b.setAttribute('aria-pressed', String(!hiddenCats.has(k))); refresh(); }); $('cats').appendChild(b); });

/* ───────── state ───────── */
const bench = []; let query = ''; let hoverComp = null;
function toggle(sym) { const i = bench.indexOf(sym); if (i >= 0) bench.splice(i, 1); else bench.push(sym); tiles[sym].classList.remove('pop'); void tiles[sym].offsetWidth; if (i < 0) tiles[sym].classList.add('pop'); refresh(); }
$('clear').addEventListener('click', () => { bench.length = 0; refresh(); });
$('q').addEventListener('input', e => { query = e.target.value.trim().toLowerCase(); refresh(); });

function detail(e) { const d = $('detail'); d.hidden = false; d.style.setProperty('--c', e.c); $('dK').textContent = `${e.n} · ${CATS[e.cat].name}`; $('dT').textContent = e.name; $('dD').textContent = e.desc; $('dA').innerHTML = ''; }
function detailComp(c) { const d = $('detail'); d.hidden = false; d.style.setProperty('--c', '#6ee7b7'); $('dK').textContent = 'Compound'; $('dT').textContent = c.name; $('dD').textContent = c.d;
  const a = $('dA'); a.innerHTML = ''; c.acts.forEach(([t, u]) => { const l = document.createElement('a'); l.textContent = t; l.href = u; if (u.startsWith('http')) { l.target = '_blank'; l.rel = 'noopener noreferrer'; } a.appendChild(l); }); }

function paintTiles() {
  const lit = new Set(hoverComp ? hoverComp.atoms : []);
  EL.forEach(e => {
    const matchQ = !query || e.name.toLowerCase().includes(query) || e.s.toLowerCase() === query || e.desc.toLowerCase().includes(query);
    const hid = hiddenCats.has(e.cat);
    e.el.classList.toggle('dim', !matchQ || hid);
    e.el.classList.toggle('on', bench.includes(e.s));
    e.el.classList.toggle('hl', lit.has(e.s) && !bench.includes(e.s));
    e.el.setAttribute('aria-pressed', String(bench.includes(e.s)));
  });
}
function refresh() {
  paintTiles();
  /* bench */
  const ul = $('bench'); ul.innerHTML = ''; bench.forEach(s => { const e = bySym[s]; const li = document.createElement('li'); const b = document.createElement('button'); b.type = 'button'; b.style.setProperty('--c', e.c);
    b.setAttribute('aria-label', `Remove ${e.name}`); b.innerHTML = '<span></span><b aria-hidden="true">&times;</b>'; b.firstChild.textContent = e.name; b.addEventListener('click', () => toggle(s)); li.appendChild(b); ul.appendChild(li); });
  $('benchEmpty').hidden = bench.length > 0; $('clear').hidden = bench.length === 0;
  /* compounds */
  const ol = $('comps'); ol.innerHTML = '';
  COMPOUNDS.forEach(c => {
    const have = c.atoms.filter(a => bench.includes(a)).length; const all = have === c.atoms.length; const subset = bench.length > 0 && bench.every(b => c.atoms.includes(b));
    const li = document.createElement('li'); const b = document.createElement('button'); b.type = 'button'; b.className = 'comp' + (subset ? ' match' : '') + (bench.length && !have ? ' dim' : '');
    b.style.setProperty('--p', Math.round(have / c.atoms.length * 100) + '%');
    b.innerHTML = `<b><span class="cn"></span><span class="cc"></span></b><div class="bar"><i></i></div>`; b.querySelector('.cn').textContent = c.name; b.querySelector('.cc').textContent = all ? 'formed' : `${have}/${c.atoms.length}`;
    b.querySelector('b').firstChild.style.fontFamily = 'inherit'; b.querySelector('b').firstChild.style.color = 'inherit'; b.querySelector('b').firstChild.style.fontSize = 'inherit';
    const on = () => { hoverComp = c; detailComp(c); b.classList.add('focus'); paintTiles(); }, off = () => { hoverComp = null; b.classList.remove('focus'); paintTiles(); };
    b.addEventListener('pointerenter', on); b.addEventListener('pointerleave', off); b.addEventListener('focus', on); b.addEventListener('blur', off);
    b.addEventListener('click', () => { bench.length = 0; c.atoms.forEach((a, i) => { bench.push(a); const t = tiles[a]; t.classList.remove('pop'); void t.offsetWidth; setTimeout(() => t.classList.add('pop'), i * 70); }); hoverComp = null; refresh(); detailComp(c); });
    li.appendChild(b); ol.appendChild(li);
  });
  drawBonds();
}

/* ───────── bonds between benched elements ───────── */
const svg = $('bonds');
function drawBonds() {
  svg.innerHTML = ''; const wrap = $('table').parentElement; const wr = wrap.getBoundingClientRect(); svg.setAttribute('viewBox', `0 0 ${wrap.scrollWidth} ${wrap.scrollHeight}`); svg.style.width = wrap.scrollWidth + 'px'; svg.style.height = wrap.scrollHeight + 'px';
  const pts = bench.map(s => { const r = tiles[s].getBoundingClientRect(); return { s, x: r.left - wr.left + wrap.scrollLeft + r.width / 2, y: r.top - wr.top + wrap.scrollTop + r.height / 2 }; });
  if (pts.length < 2) return;
  /* connect each atom to its nearest already-connected neighbour so the bonds read as a molecule */
  const done = [pts[0]], rest = pts.slice(1); const NS = 'http://www.w3.org/2000/svg';
  while (rest.length) { let best = null; rest.forEach(p => done.forEach(q => { const d = Math.hypot(p.x - q.x, p.y - q.y); if (!best || d < best.d) best = { p, q, d }; }));
    const ln = document.createElementNS(NS, 'line'); ln.setAttribute('x1', best.q.x); ln.setAttribute('y1', best.q.y); ln.setAttribute('x2', best.p.x); ln.setAttribute('y2', best.p.y);
    ln.setAttribute('stroke', '#a7f3d0'); ln.setAttribute('stroke-width', 2.5); ln.setAttribute('stroke-linecap', 'round'); ln.style.filter = 'drop-shadow(0 0 5px #6ee7b7)';
    if (!reduced) { const len = best.d; ln.setAttribute('stroke-dasharray', len); ln.setAttribute('stroke-dashoffset', len); ln.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 500, fill: 'forwards', easing: 'cubic-bezier(.2,.8,.2,1)' }); }
    svg.appendChild(ln); done.push(best.p); rest.splice(rest.indexOf(best.p), 1); }
}
addEventListener('resize', drawBonds); $('table').parentElement.addEventListener('scroll', drawBonds);

refresh();
window.__pt = { bench, toggle, refresh, COMPOUNDS };
})();
