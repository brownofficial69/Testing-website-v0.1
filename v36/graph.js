import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

/* ───────────────────────── data (all taken from the CV) ───────────────────────── */
const GROUPS = {
  core:  { name: 'Shadman',            color: '#ffffff' },
  build: { name: 'Projects',           color: '#34f5a8' },
  ai:    { name: 'AI and agents',      color: '#a98bff' },
  sec:   { name: 'Security',           color: '#36d7ff' },
  eng:   { name: 'Engineering',        color: '#5b8cff' },
  grc:   { name: 'GRC and risk',       color: '#ffb547' },
  edu:   { name: 'Education and work', color: '#ff6f91' },
  sup:   { name: 'Support',            color: '#9fb3c8' },
};
const HUBS = ['build', 'ai', 'sec', 'eng', 'grc', 'edu', 'sup'];

const N = [
  { id: 'me', g: 'core', label: 'Shadman Hossain', kind: 'First-class cybersecurity graduate',
    desc: 'I build AI-agent authorization prototypes, detection engineering tools and security automation. Looking for junior security-engineering or AI-evaluation roles in the UK, with full right to work.',
    facts: ['Based in Birmingham, UK', 'BSc (Hons) Ethical Hacking and Cyber Security, Coventry University', 'Currently an FDM consultant on a Deutsche Bank assignment'],
    actions: [['Download CV', '../assets/cv.pdf'], ['Main site', '../index.html']] },

  /* projects */
  { id: 'aem', g: 'build', label: 'ADAM / EVE / Mizan', kind: 'Project · 2026',
    desc: 'An AI-agent authorization prototype. One component proposes actions, one critiques them adversarially, and an independent mediator decides what the agent may actually do.',
    facts: ['21/21 Phase-8 and 7/7 concept tests passing', '16 memory-purger tests (one CUDA-only skip)', 'Keeps an explicit no-go boundary for consequential autonomous use'],
    actions: [['Try the demo', '../demos/adam-eve-mizan.html'], ['GitHub', 'https://github.com/brownofficial69/adam-eve-mizan']] },
  { id: 'tw', g: 'build', label: 'ThreatWeave', kind: 'Project · Go · 2026',
    desc: 'A concurrent threat-intelligence CLI. It pulls four feeds in parallel, correlates indicators by ASN and MITRE ATT&CK overlap, and writes structured dossiers with the Claude API.',
    facts: ['5/5 concurrency tests passing', 'This graph borrows its idea: correlate groups nodes the way ThreatWeave groups IOCs'],
    actions: [['Try the demo', '../demos/threatweave.html'], ['GitHub', 'https://github.com/shaddiegit/threatweave']] },
  { id: 'sv', g: 'build', label: 'SecureView', kind: 'Project · TypeScript, React · 2026',
    desc: 'A SOC triage dashboard that prioritises alerts and gives remediation guidance, built on typed LLM data contracts.',
    facts: ['17/17 unit tests passing'],
    actions: [['Try the demo', '../demos/secureview.html'], ['GitHub', 'https://github.com/shaddiegit/secureview']] },
  { id: 'sl', g: 'build', label: 'SOC Detection Lab', kind: 'Project · Python, Sigma · 2026',
    desc: 'Multi-stage detections and time-window event correlation across a simulated four-stage intrusion, as Sigma-style rules that deploy in Wazuh.',
    actions: [['Try the demo', '../demos/soc-lab.html'], ['GitHub', 'https://github.com/shaddiegit/soc-detection-lab']] },
  { id: 'ih', g: 'build', label: 'IOC Hunter', kind: 'Project · Python · 2026',
    desc: 'A multi-source IOC lookup CLI, hardened against malformed input and injection risks, with output ready for CI and SOAR pipelines.',
    facts: ['19/19 security tests passing'],
    actions: [['Try the demo', '../demos/ioc-hunter.html'], ['GitHub', 'https://github.com/shaddiegit/ioc-hunter']] },
  { id: 'sc', g: 'build', label: 'Supply Chain Risk Framework', kind: 'Dissertation · VBA · 2025-26',
    desc: 'A 15-criterion weighted vendor-risk model informed by NIST SP 800-161, tested against historical incidents and refined through UAT with non-technical users.',
    facts: ['Dissertation modules: 87% (preparation) and 76% (delivery)'],
    actions: [['Try the demo', '../demos/supply-chain-risk.html']] },

  /* ai */
  { id: 'claude', g: 'ai', label: 'Claude API', kind: 'AI · Anthropic SDK', desc: 'Used in ThreatWeave for dossiers and SecureView for triage, and studied through nine Claude Academy courses.' },
  { id: 'mcp', g: 'ai', label: 'MCP', kind: 'AI · Model Context Protocol', desc: 'Model Context Protocol fundamentals, covered in the Claude Academy courses.' },
  { id: 'evals', g: 'ai', label: 'Evaluation design', kind: 'AI · evaluation', desc: 'Designing tests that show what an AI system can and cannot be trusted to do.' },
  { id: 'toolctl', g: 'ai', label: 'Tool-use controls', kind: 'AI · agent safety', desc: 'Limiting which tools an agent can call and under what conditions.' },
  { id: 'llmout', g: 'ai', label: 'Structured LLM outputs', kind: 'AI · data contracts', desc: 'Typed contracts between the model and the application, so malformed output is caught instead of trusted.' },
  { id: 'lp', g: 'ai', label: 'Least privilege', kind: 'AI · authorization', desc: 'Giving an agent only the access its current task needs.' },
  { id: 'mem', g: 'ai', label: 'Memory integrity', kind: 'AI · persistent memory', desc: 'Protecting an agent\'s persistent memory from tampering, with a tamper-evident ledger and purger in ADAM / EVE / Mizan.' },

  /* security */
  { id: 'mitre', g: 'sec', label: 'MITRE ATT&CK', kind: 'Framework', desc: 'The shared language for mapping detections and intrusions to adversary techniques.' },
  { id: 'sigma', g: 'sec', label: 'Sigma', kind: 'Detection rules', desc: 'Vendor-neutral detection rules, written as YAML.' },
  { id: 'wazuh', g: 'sec', label: 'Wazuh', kind: 'SIEM / XDR', desc: 'Open-source security monitoring, the deployment target for the lab\'s rules.' },
  { id: 'elk', g: 'sec', label: 'ELK', kind: 'Log analysis', desc: 'Elasticsearch, Logstash and Kibana for searching and visualising logs.' },
  { id: 'splunk', g: 'sec', label: 'Splunk', kind: 'SIEM', desc: 'Search and correlation over machine data.' },
  { id: 'ioc', g: 'sec', label: 'IOC analysis', kind: 'Threat intelligence', desc: 'Triage of indicators of compromise across several feeds.' },
  { id: 'hunt', g: 'sec', label: 'Threat hunting', kind: 'Practice', desc: 'Looking for adversary activity that rules have not caught yet.' },

  /* engineering */
  { id: 'py', g: 'eng', label: 'Python', kind: 'Language', desc: 'Used for the detection lab, IOC Hunter and ADAM / EVE / Mizan.' },
  { id: 'go', g: 'eng', label: 'Go', kind: 'Language', desc: 'Used for ThreatWeave\'s concurrent feed collection.' },
  { id: 'ts', g: 'eng', label: 'TypeScript', kind: 'Language', desc: 'Used for SecureView\'s typed data contracts.' },
  { id: 'react', g: 'eng', label: 'React', kind: 'Framework', desc: 'The front end of SecureView.' },
  { id: 'bash', g: 'eng', label: 'Bash', kind: 'Language', desc: 'Shell automation on Linux.' },
  { id: 'linux', g: 'eng', label: 'Linux', kind: 'Platform', desc: 'Daily working environment for security tooling.' },
  { id: 'git', g: 'eng', label: 'Git / GitHub', kind: 'Tooling', desc: 'Version control and the home of every project here.' },
  { id: 'pytest', g: 'eng', label: 'pytest', kind: 'Testing', desc: 'Test suites behind the detection lab, IOC Hunter and ADAM / EVE / Mizan.' },
  { id: 'rest', g: 'eng', label: 'REST APIs', kind: 'Integration', desc: 'Feed and service integration across the projects.' },
  { id: 'vba', g: 'eng', label: 'VBA', kind: 'Language', desc: 'Used to build the dissertation\'s risk scoring model.' },
  { id: 'aws', g: 'eng', label: 'AWS S3 · IAM · EC2', kind: 'Cloud', desc: 'Core AWS services for storage, identity and compute.' },

  /* grc */
  { id: 'nist', g: 'grc', label: 'NIST CSF', kind: 'Framework', desc: 'The Cybersecurity Framework used to structure security programmes.' },
  { id: 'sp800', g: 'grc', label: 'NIST SP 800-161', kind: 'Framework', desc: 'Supply-chain risk management guidance, the basis for the dissertation model.' },
  { id: 'iso', g: 'grc', label: 'ISO 27001', kind: 'Standard', desc: 'The information-security management standard.' },
  { id: 'tpr', g: 'grc', label: 'Third-party risk', kind: 'Practice', desc: 'Assessing the security of vendors and suppliers.' },

  /* education and work */
  { id: 'cov', g: 'edu', label: 'Coventry University', kind: 'BSc (Hons) · 2023-26',
    desc: 'Ethical Hacking and Cyber Security, graduating with First-Class Honours.',
    facts: ['Bachelor of Science with Honours, First Class', 'Dissertation modules: 87% (preparation) and 76% (delivery)'] },
  { id: 'btec', g: 'edu', label: 'BTEC Level 3 IT', kind: 'Birmingham Metropolitan College · 2020-22', desc: 'Double Distinction Merit.' },
  { id: 'acad', g: 'edu', label: 'Claude Academy', kind: 'Anthropic · 2026', desc: 'Nine courses, including Claude Code, MCP, Subagents, Agent Skills and AI capabilities and limitations.' },
  { id: 'fdm', g: 'edu', label: 'FDM Group', kind: 'Consultant · current', desc: 'First-line Outlook and Teams support on a Deutsche Bank assignment, working in a ServiceNow ticket workflow and escalating what needs more technical help.' },

  /* support */
  { id: 'outlook', g: 'sup', label: 'Outlook', kind: 'Support', desc: 'First-line support for colleagues in a banking environment.' },
  { id: 'teams', g: 'sup', label: 'Teams', kind: 'Support', desc: 'First-line support for colleagues in a banking environment.' },
  { id: 'snow', g: 'sup', label: 'ServiceNow', kind: 'Workflow', desc: 'Investigating and escalating issues through ServiceNow.' },
  { id: 'nagios', g: 'sup', label: 'Nagios', kind: 'Monitoring', desc: 'Exposure to operational monitoring.' },
];

/* cross links, group-hub links are generated */
const CROSS = [
  ['aem', 'py'], ['aem', 'lp'], ['aem', 'toolctl'], ['aem', 'mem'], ['aem', 'evals'], ['aem', 'pytest'],
  ['tw', 'go'], ['tw', 'claude'], ['tw', 'mitre'], ['tw', 'ioc'], ['tw', 'rest'],
  ['sv', 'ts'], ['sv', 'react'], ['sv', 'claude'], ['sv', 'llmout'],
  ['sl', 'py'], ['sl', 'sigma'], ['sl', 'wazuh'], ['sl', 'pytest'], ['sl', 'mitre'], ['sl', 'hunt'],
  ['ih', 'py'], ['ih', 'ioc'], ['ih', 'pytest'], ['ih', 'rest'],
  ['sc', 'sp800'], ['sc', 'tpr'], ['sc', 'vba'], ['sc', 'nist'], ['sc', 'cov'],
  ['acad', 'claude'], ['acad', 'mcp'], ['acad', 'evals'],
  ['fdm', 'outlook'], ['fdm', 'teams'], ['fdm', 'snow'], ['fdm', 'nagios'],
  ['cov', 'iso'], ['cov', 'linux'], ['cov', 'elk'], ['cov', 'splunk'], ['cov', 'aws'],
  ['mitre', 'sigma'], ['elk', 'splunk'], ['wazuh', 'elk'], ['git', 'bash'], ['linux', 'bash'], ['nist', 'iso'],
];

/* ───────────────────────── setup ───────────────────────── */
const $ = id => document.getElementById(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const byId = Object.fromEntries(N.map(n => [n.id, n]));
const edges = [];
N.forEach(n => { if (n.g !== 'core') {
  if (HUBS.includes(n.g)) { /* member -> hub node (virtual) */ edges.push({ a: n.id, b: 'hub:' + n.g, kind: 'hub' }); }
}});
CROSS.forEach(([a, b]) => edges.push({ a, b, kind: 'cross' }));

/* hubs become real nodes */
HUBS.forEach(g => {
  N.push({ id: 'hub:' + g, g, label: GROUPS[g].name, hub: true, kind: 'Group',
    desc: ({
      build: 'Six projects, from an agent-authorization prototype to a SOC triage dashboard.',
      ai: 'Agent safety and LLM engineering: authorization, tool-use controls, memory integrity and evaluation.',
      sec: 'Detection engineering, threat intelligence and the frameworks and platforms behind them.',
      eng: 'Languages, tooling and testing habits that the projects are built with.',
      grc: 'Frameworks and practices for governing security and supplier risk.',
      edu: 'Degree, college, Claude Academy and current consulting work.',
      sup: 'Day-to-day end-user support tooling from the FDM role.',
    })[g] });
  edges.push({ a: 'hub:' + g, b: 'me', kind: 'core' });
});
const nodeIndex = {}; N.forEach((n, i) => { n.i = i; nodeIndex[n.id] = i; byId[n.id] = n; });
edges.forEach(e => { e.ai = nodeIndex[e.a]; e.bi = nodeIndex[e.b]; });
const adj = N.map(() => new Set());
edges.forEach(e => { adj[e.ai].add(e.bi); adj[e.bi].add(e.ai); });

const canvas = $('gl');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
} catch (err) {
  $('fallback').hidden = false;
  buildList(); $('list').hidden = false; $('listBtn').setAttribute('aria-expanded', 'true');
  throw err;
}
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x02060d);
scene.fog = new THREE.FogExp2(0x02060d, 0.0042);
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.5, 2000);
camera.position.set(0, 30, reduced ? 190 : 380);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; controls.dampingFactor = 0.06;
controls.minDistance = 12; controls.maxDistance = 420; controls.rotateSpeed = 0.7;
controls.autoRotate = !reduced; controls.autoRotateSpeed = 0.45;

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.55, 0.5, 0.22);
composer.addPass(bloom);
composer.addPass(new OutputPass());

/* star dust */
{
  const g = new THREE.BufferGeometry(); const n = 1400; const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const r = 160 + Math.random() * 520, a = Math.random() * 6.283, b = Math.acos(2 * Math.random() - 1);
    p[i * 3] = r * Math.sin(b) * Math.cos(a); p[i * 3 + 1] = r * Math.cos(b); p[i * 3 + 2] = r * Math.sin(b) * Math.sin(a); }
  g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({ size: 1.1, color: 0x7f93b5, transparent: true, opacity: 0.55, sizeAttenuation: true, fog: false })));
}

/* glow sprite texture */
function glowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
}
const glowTex = glowTexture();

/* nodes */
const nodeGroup = new THREE.Group(); scene.add(nodeGroup);
const sphereGeo = new THREE.SphereGeometry(1, 24, 18);
N.forEach(n => {
  const col = new THREE.Color(GROUPS[n.g].color);
  n.base = col;
  n.r = n.g === 'core' ? 4.6 : n.hub ? 2.7 : n.g === 'build' ? 2.0 : 1.15;
  n.p = new THREE.Vector3((Math.random() - .5) * 3, (Math.random() - .5) * 3, (Math.random() - .5) * 3);
  n.v = new THREE.Vector3();
  n.dim = 1; n.dimT = 1;
  n.mat = new THREE.MeshBasicMaterial({ color: col.clone(), transparent: true });
  n.mesh = new THREE.Mesh(sphereGeo, n.mat);
  n.mesh.scale.setScalar(n.r); n.mesh.userData.i = n.i; if (n.g === 'core') n.mesh.visible = false;
  n.halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: col, transparent: true, opacity: 0.38, depthWrite: false, blending: THREE.AdditiveBlending }));
  n.halo.scale.setScalar(n.r * 7);
  nodeGroup.add(n.mesh, n.halo);
});

/* your photo on the core node: a DOM element so it stays crisp at any zoom */
const avatar = document.createElement('div'); avatar.className = 'avatar'; avatar.setAttribute('aria-hidden', 'true');
document.body.appendChild(avatar);

/* edges */
const E = edges.length;
const linePos = new Float32Array(E * 6), lineCol = new Float32Array(E * 6);
const lineGeo = new THREE.BufferGeometry();
lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
lineGeo.setAttribute('color', new THREE.BufferAttribute(lineCol, 3));
const lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }));
scene.add(lines);
edges.forEach(e => { e.vis = 1; e.visT = 1; e.t = Math.random(); e.sp = 0.12 + Math.random() * 0.25;
  e.col = new THREE.Color(GROUPS[N[e.ai].g === 'core' ? N[e.bi].g : N[e.ai].g].color).lerp(new THREE.Color(GROUPS[N[e.bi].g].color), 0.5); });

/* pulses travelling the edges */
const pulsePos = new Float32Array(E * 3), pulseCol = new Float32Array(E * 3);
const pulseGeo = new THREE.BufferGeometry();
pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePos, 3));
pulseGeo.setAttribute('color', new THREE.BufferAttribute(pulseCol, 3));
const pulses = new THREE.Points(pulseGeo, new THREE.PointsMaterial({ size: 2.4, map: glowTex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true }));
scene.add(pulses);

/* ───────────────────────── physics ───────────────────────── */
let clustered = false, alpha = 1;
const ringCenters = {};
HUBS.forEach((g, i) => { const a = (i / HUBS.length) * Math.PI * 2; ringCenters[g] = new THREE.Vector3(Math.cos(a) * 88, ((i % 2) - 0.5) * 30, Math.sin(a) * 88); });
const tmp = new THREE.Vector3();

function step(dt) {
  const k = Math.min(dt, 0.05) * 60;
  for (let i = 0; i < N.length; i++) {
    const a = N[i];
    for (let j = i + 1; j < N.length; j++) {
      const b = N[j];
      tmp.subVectors(a.p, b.p); let d2 = tmp.lengthSq() + 0.6; const d = Math.sqrt(d2);
      const rep = (clustered ? 55 : 80) / d2 * alpha;
      tmp.multiplyScalar(rep / d); a.v.add(tmp); b.v.sub(tmp);
    }
  }
  edges.forEach(e => {
    const a = N[e.ai], b = N[e.bi];
    tmp.subVectors(b.p, a.p); const d = tmp.length() + 0.001;
    const rest = e.kind === 'core' ? 40 : e.kind === 'hub' ? 17 : 27;
    const str = (e.kind === 'cross' && clustered ? 0.0035 : e.kind === 'cross' ? 0.012 : 0.03) * alpha;
    tmp.multiplyScalar((d - rest) * str / d); a.v.add(tmp); b.v.sub(tmp);
  });
  N.forEach(n => {
    if (n.g === 'core') { n.v.addScaledVector(n.p, -0.08); }
    else { n.v.addScaledVector(n.p, -0.004); }
    if (clustered && n.g !== 'core') { tmp.subVectors(ringCenters[n.g], n.p); n.v.addScaledVector(tmp, n.hub ? 0.05 : 0.02); }
    n.v.multiplyScalar(0.86);
    n.p.addScaledVector(n.v, k);
    n.mesh.position.copy(n.p); n.halo.position.copy(n.p); 
  });
  alpha = Math.max(0.35, alpha * 0.996);
}

/* settle the layout first so there is something to explode from */
for (let s = 0; s < (reduced ? 400 : 70); s++) step(1 / 60);

/* ───────────────────────── labels ───────────────────────── */
const labelHost = $('labels');
N.forEach(n => { const el = document.createElement('div'); el.className = 'lbl' + (n.hub || n.g === 'core' ? ' hub' : ''); el.textContent = n.label;
  el.style.color = n.g === 'core' ? '#fff' : '#' + GROUPS[n.g].color.slice(1); n.el = el; labelHost.appendChild(el); });

/* ───────────────────────── state: hover, select, search, filters ───────────────────────── */
let hovered = -1, selected = -1, query = '';
const hidden = new Set();
const ray = new THREE.Raycaster(); const mouse = new THREE.Vector2(); const meshes = N.map(n => n.mesh);

function matches(n) {
  if (!query) return true;
  const q = query.toLowerCase();
  return n.label.toLowerCase().includes(q) || (n.desc || '').toLowerCase().includes(q) || (n.kind || '').toLowerCase().includes(q);
}
function recomputeVisibility() {
  const focus = selected >= 0 ? selected : hovered;
  N.forEach((n, i) => {
    let v = 1;
    if (hidden.has(n.g) && n.g !== 'core') v = 0.07;
    if (query) v = Math.min(v, matches(n) ? 1 : 0.08);
    if (focus >= 0 && v > 0.2) v = (i === focus || adj[focus].has(i)) ? 1 : 0.16;
    n.dimT = v;
  });
  edges.forEach(e => {
    const a = N[e.ai], b = N[e.bi]; let v = Math.min(a.dimT, b.dimT);
    if (focus >= 0) v = (e.ai === focus || e.bi === focus) ? 1 : Math.min(v, 0.05);
    e.visT = v;
  });
}

const chipHost = $('chips');
['build', 'ai', 'sec', 'eng', 'grc', 'edu', 'sup'].forEach(g => {
  const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.setAttribute('aria-pressed', 'true');
  b.style.setProperty('--c', GROUPS[g].color); b.innerHTML = '<i></i>' + GROUPS[g].name;
  b.addEventListener('click', () => { const on = b.getAttribute('aria-pressed') === 'true'; b.setAttribute('aria-pressed', String(!on)); on ? hidden.add(g) : hidden.delete(g); recomputeVisibility(); });
  chipHost.appendChild(b);
});

$('q').addEventListener('input', e => { query = e.target.value.trim(); recomputeVisibility(); });
$('q').addEventListener('keydown', e => {
  if (e.key === 'Enter' && query) { const hit = N.find(n => !n.hub && n.g !== 'core' && matches(n)); if (hit) select(hit.i); }
  if (e.key === 'Escape') { e.target.value = ''; query = ''; recomputeVisibility(); }
});

/* ───────────────────────── panel ───────────────────────── */
function select(i) {
  selected = i; recomputeVisibility();
  if (i < 0) { $('panel').hidden = true; return; }
  const n = N[i], col = GROUPS[n.g].color;
  const panel = $('panel'); panel.style.setProperty('--accent', col); panel.hidden = false;
  $('pKind').textContent = n.kind || ''; $('pTitle').textContent = n.label; $('pDesc').textContent = n.desc || '';
  const f = $('pFacts'); f.innerHTML = ''; (n.facts || []).forEach(t => { const li = document.createElement('li'); li.textContent = t; f.appendChild(li); });
  const l = $('pLinks'); l.innerHTML = '';
  [...adj[i]].map(j => N[j]).sort((a, b) => (a.hub ? -1 : 0) - (b.hub ? -1 : 0)).forEach(m => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = m.label; b.style.setProperty('--c', GROUPS[m.g].color);
    b.addEventListener('click', () => select(m.i)); l.appendChild(b);
  });
  const act = $('pActions'); act.innerHTML = '';
  (n.actions || []).forEach(([t, u]) => { const a = document.createElement('a'); a.textContent = t; a.href = u; if (u.startsWith('http')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; } act.appendChild(a); });
  flyTo(i); hideHint();
}
$('closePanel').addEventListener('click', () => select(-1));
addEventListener('keydown', e => { if (e.key === 'Escape' && !$('list').hidden) toggleList(false); else if (e.key === 'Escape') select(-1); });

/* ───────────────────────── camera fly ───────────────────────── */
let fly = null;
function flyTo(i) {
  const n = N[i]; const dir = camera.position.clone().sub(controls.target).normalize();
  const dist = n.hub || n.g === 'core' ? 100 : 68;
  introDone = true;
  fly = { t0: performance.now(), dur: reduced ? 1 : 1100, fromT: controls.target.clone(), fromP: camera.position.clone(), dist, dir };
  controls.autoRotate = false; $('spin').setAttribute('aria-pressed', 'false');
}
const ease = t => 1 - Math.pow(1 - t, 3);

/* ───────────────────────── input ───────────────────────── */
let down = null;
canvas.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY }; hideHint(); });
canvas.addEventListener('pointermove', e => {
  mouse.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  pick(); canvas.style.cursor = hovered >= 0 ? 'pointer' : '';
});
canvas.addEventListener('pointerup', e => {
  if (!down) return; const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y); down = null;
  if (moved > 6) return;
  mouse.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); pick();
  if (hovered >= 0) select(hovered); else if (selected >= 0) select(-1);
});
canvas.addEventListener('pointerleave', () => { hovered = -1; recomputeVisibility(); });
controls.addEventListener('start', () => { fly = null; introDone = true; controls.enabled = true; if (controls.autoRotate) { controls.autoRotate = false; $('spin').setAttribute('aria-pressed', 'false'); } });

function pick() {
  ray.setFromCamera(mouse, camera);
  let best = -1, bd = Infinity;
  N.forEach(n => { if (n.dimT < 0.2) return;
    tmp.copy(n.p).project(camera); if (tmp.z > 1) return;
    const sx = (tmp.x * 0.5 + 0.5) * innerWidth, sy = (-tmp.y * 0.5 + 0.5) * innerHeight;
    const dist = n.p.distanceTo(camera.position); const rad = Math.max(10, n.r * 520 / dist * 1.5);
    const d = Math.hypot(sx - (mouse.x * 0.5 + 0.5) * innerWidth, sy - (-mouse.y * 0.5 + 0.5) * innerHeight);
    if (d < rad && dist < bd) { bd = dist; best = n.i; } });
  if (best !== hovered) { hovered = best; recomputeVisibility(); }
}

$('correlate').addEventListener('click', () => {
  clustered = !clustered; alpha = 1; select(-1);
  $('correlate').setAttribute('aria-pressed', String(clustered));
  $('corrLabel').textContent = clustered ? 'Weave back' : 'Correlate';
  const h = $('hint'); h.textContent = clustered ? 'Clustered by discipline, the way ThreatWeave groups indicators by shared ASN and MITRE tactic' : 'Woven back into the full graph'; h.classList.remove('gone');
  clearTimeout(hideHint.t); hideHint.t = setTimeout(() => h.classList.add('gone'), 4200);
});
$('spin').addEventListener('click', () => { const on = !controls.autoRotate; controls.autoRotate = on; $('spin').setAttribute('aria-pressed', String(on)); });
function hideHint() { clearTimeout(hideHint.t); hideHint.t = setTimeout(() => $('hint').classList.add('gone'), 1200); }
hideHint.t = setTimeout(() => $('hint').classList.add('gone'), 9000);

function buildList() {
  const host = $('list'); host.innerHTML = '';
  ['core', ...HUBS].forEach(g => {
    const mem = N.filter(n => n.g === g && !n.hub); if (!mem.length) return;
    const h = document.createElement('h3'); h.textContent = GROUPS[g].name; host.appendChild(h);
    const ul = document.createElement('ul');
    mem.forEach(n => { const li = document.createElement('li'); li.innerHTML = '<b></b><span></span>'; li.firstChild.textContent = n.label; li.lastChild.textContent = n.desc || n.kind || ''; ul.appendChild(li); });
    host.appendChild(ul);
  });
}
function toggleList(on) { const open = on ?? $('list').hidden; if (open && !$('list').childElementCount) buildList(); $('list').hidden = !open; $('listBtn').setAttribute('aria-expanded', String(open)); $('listBtn').textContent = open ? 'Back to graph' : 'List view'; }
$('listBtn').addEventListener('click', () => toggleList());

addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); composer.setSize(innerWidth, innerHeight); });

/* ───────────────────────── loop ───────────────────────── */
let introDone = false; let last = performance.now(); const t0 = last; const v3 = new THREE.Vector3();
function frame(now) {
  const dt = (now - last) / 1000; last = now;
  for (let k = Math.max(1, Math.min(10, Math.round(dt * 60))); k > 0; k--) step(1 / 60);

  /* intro push-in */
  if (!reduced && !introDone && !fly) {
    const p = Math.min((now - t0) / 3600, 1); const dist = 380 + (185 - 380) * ease(p);
    const dir = camera.position.clone().sub(controls.target).normalize(); camera.position.copy(controls.target).addScaledVector(dir, dist);
    if (p >= 1) introDone = true;
  }

  if (fly) {
    const p = Math.min((now - fly.t0) / fly.dur, 1), e = ease(p), n = N[selected >= 0 ? selected : 0];
    controls.target.lerpVectors(fly.fromT, n.p, e);
    camera.position.lerpVectors(fly.fromP, tmp.copy(n.p).addScaledVector(fly.dir, fly.dist), e);
    if (p >= 1) fly = null;
  } else if (selected >= 0) { controls.target.lerp(N[selected].p, 0.08); }
  controls.update();

  /* dim easing + edges + pulses */
  N.forEach(n => { n.dim += (n.dimT - n.dim) * 0.14; n.mat.color.copy(n.base).multiplyScalar(0.25 + 0.75 * n.dim); n.halo.material.opacity = 0.38 * n.dim * n.dim * Math.min(1, Math.max(0.25, n.p.distanceTo(camera.position) / 110));
    const grow = (n.i === hovered || n.i === selected) ? 1.35 : 1; n.mesh.scale.setScalar(n.r * grow * (0.85 + 0.15 * n.dim)); n.halo.scale.setScalar(n.r * 7 * grow);  });
  edges.forEach((e, k) => {
    e.vis += (e.visT - e.vis) * 0.14; const a = N[e.ai].p, b = N[e.bi].p;
    linePos.set([a.x, a.y, a.z, b.x, b.y, b.z], k * 6);
    const m = (e.kind === 'cross' ? 0.28 : 0.42) * e.vis;
    lineCol.set([e.col.r * m, e.col.g * m, e.col.b * m, e.col.r * m, e.col.g * m, e.col.b * m], k * 6);
    e.t = (e.t + dt * e.sp) % 1; const t = e.t;
    pulsePos.set([a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t], k * 3);
    const pm = 1.1 * e.vis * e.vis; pulseCol.set([e.col.r * pm, e.col.g * pm, e.col.b * pm], k * 3);
  });
  lineGeo.attributes.position.needsUpdate = true; lineGeo.attributes.color.needsUpdate = true;
  pulseGeo.attributes.position.needsUpdate = true; pulseGeo.attributes.color.needsUpdate = true;

  /* labels */
  const focus = selected >= 0 ? selected : hovered;
  N.forEach(n => {
    v3.copy(n.p).project(camera);
    const front = v3.z < 1; const x = (v3.x * 0.5 + 0.5) * innerWidth, y = (-v3.y * 0.5 + 0.5) * innerHeight;
    const dist = n.p.distanceTo(camera.position);
    let show = n.hub || n.g === 'core' || n.g === 'build';
    if (focus >= 0 && (n.i === focus || adj[focus].has(n.i))) show = true;
    if (query && matches(n)) show = true;
    if (dist < 70) show = true;
    const o = front ? (show ? Math.min(1, n.dim * 1.2) * (dist > 260 ? 0.4 : 1) : 0) : 0;
    n.el.style.opacity = o.toFixed(2);
    if (o > 0.02) n.el.style.transform = `translate(${(x + n.r * 520 / dist + 6).toFixed(1)}px, ${(y - 7).toFixed(1)}px)`;
  });

  { const c = N[0]; v3.copy(c.p).project(camera); const dist = c.p.distanceTo(camera.position);
    const px = (c.r * 2.1) * (innerHeight / 2) / (Math.tan(camera.fov * Math.PI / 360) * dist);
    avatar.style.width = avatar.style.height = px.toFixed(1) + 'px';
    avatar.style.transform = `translate(${((v3.x * 0.5 + 0.5) * innerWidth - px / 2).toFixed(1)}px, ${((-v3.y * 0.5 + 0.5) * innerHeight - px / 2).toFixed(1)}px)`;
    avatar.style.opacity = v3.z < 1 ? (c.dim * (px < 8 ? px / 8 : 1)).toFixed(2) : 0; }

  composer.render();
  requestAnimationFrame(frame);
}
recomputeVisibility();
requestAnimationFrame(frame);
window.__graph = { N, select, step, camera, controls, get clustered() { return clustered; } };
