/* Architecture diagrams for the project panels.
   Each diagram is drawn as resolution-independent SVG (crisp at any size, including 4K) with
   glass nodes and flowing data packets. They show how each project is put together, using
   only what is on the CV. */
(function () {
'use strict';
const NODE_W = 132, NODE_H = 46;

/* node kinds pick an accent colour from the current theme */
const KIND = { a: 'var(--accent-cyan)', b: 'var(--accent-green)', c: 'var(--accent-amber)', d: 'var(--accent-purple)', n: 'rgba(255,255,255,.55)' };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

function build(spec) {
  const W = spec.w || 760, H = spec.h || 300;
  const nodes = {}; spec.nodes.forEach(n => { n.w = n.w || NODE_W; n.h = n.h || NODE_H; nodes[n.id] = n; });
  const anchor = (n, side) => ({ l: [n.x, n.y + n.h / 2], r: [n.x + n.w, n.y + n.h / 2], t: [n.x + n.w / 2, n.y], b: [n.x + n.w / 2, n.y + n.h] })[side];
  let defs = '<defs><filter id="dg-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>';
  let paths = '', dots = '', labels = '';
  spec.edges.forEach((e, i) => {
    const [a, b, sa, sb, label, col] = e; const A = anchor(nodes[a], sa), B = anchor(nodes[b], sb);
    const horiz = sa === 'r' || sa === 'l'; const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
    const d = horiz ? `M${A[0]} ${A[1]} C${mx} ${A[1]} ${mx} ${B[1]} ${B[0]} ${B[1]}` : `M${A[0]} ${A[1]} C${A[0]} ${my} ${B[0]} ${my} ${B[0]} ${B[1]}`;
    const c = KIND[col || nodes[a].k || 'n'];
    paths += `<path id="dgp${spec.id}${i}" d="${d}" fill="none" stroke="${c}" stroke-opacity=".38" stroke-width="1.4" stroke-dasharray="4 5" class="dg-flow"/>`;
    dots += `<circle r="3.2" fill="${c}" filter="url(#dg-glow)"><animateMotion dur="${(2.4 + (i % 4) * 0.35).toFixed(2)}s" begin="${(i * 0.31).toFixed(2)}s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear"><mpath href="#dgp${spec.id}${i}"/></animateMotion></circle>`;
    if (label) labels += `<text x="${mx}" y="${my - 7}" text-anchor="middle" class="dg-elab">${esc(label)}</text>`;
  });
  let body = '';
  spec.nodes.forEach(n => {
    const c = KIND[n.k || 'n'];
    body += `<g class="dg-node" transform="translate(${n.x} ${n.y})"><rect width="${n.w}" height="${n.h}" rx="12" fill="rgba(255,255,255,.07)" stroke="${c}" stroke-opacity=".8"/>
      <rect x="1" y="1" width="${n.w - 2}" height="${n.h / 2}" rx="11" fill="url(#dgs)" opacity=".5"/>
      <text x="${n.w / 2}" y="${n.sub ? n.h / 2 - 3 : n.h / 2 + 4}" text-anchor="middle" class="dg-t">${esc(n.t)}</text>${n.sub ? `<text x="${n.w / 2}" y="${n.h / 2 + 12}" text-anchor="middle" class="dg-s">${esc(n.sub)}</text>` : ''}</g>`;
  });
  defs = defs.replace('</defs>', '<linearGradient id="dgs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>');
  return `<svg class="dg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(spec.alt)}">${defs}${paths}${labels}${body}${dots}</svg>`;
}

const SPECS = {
  'adam-eve-mizan': { id: 'a', alt: 'Architecture: an operator gives a mission to ADAM; EVE critiques each proposal; Mizan decides, with a human approval gate, tools and a tamper-evident memory ledger.', h: 300,
    nodes: [
      { id: 'op', x: 14, y: 127, t: 'Operator', sub: 'mission', k: 'n' }, { id: 'ad', x: 190, y: 127, t: 'ADAM', sub: 'proposes', k: 'a' },
      { id: 'ev', x: 372, y: 28, t: 'EVE', sub: 'critiques', k: 'c' }, { id: 'mz', x: 372, y: 148, t: 'Mizan', sub: 'decides from policy', k: 'b' },
      { id: 'hu', x: 190, y: 236, t: 'Human gate', sub: 'exact-request token', k: 'n' },
      { id: 'tl', x: 600, y: 60, t: 'Tools', sub: 'least privilege', k: 'b' }, { id: 'lg', x: 600, y: 190, t: 'Memory ledger', sub: 'hash chain', k: 'd' } ],
    edges: [['op', 'ad', 'r', 'l', 'mission'], ['ad', 'ev', 'r', 'l', 'proposal'], ['ad', 'mz', 'r', 'l', 'request'], ['ev', 'mz', 'b', 't', 'findings', 'c'], ['hu', 'mz', 'r', 'l', 'token', 'n'], ['mz', 'tl', 'r', 'l', 'allow', 'b'], ['mz', 'lg', 'r', 'l', 'screened write', 'd']] },
  'threatweave': { id: 'b', alt: 'Architecture: four threat feeds are collected concurrently, normalised, correlated by ASN and MITRE ATT&CK overlap, and written up as dossiers with the Claude API.', h: 290,
    nodes: [
      { id: 'f1', x: 10, y: 14, w: 100, h: 38, t: 'Feed 1', k: 'n' }, { id: 'f2', x: 10, y: 74, w: 100, h: 38, t: 'Feed 2', k: 'n' }, { id: 'f3', x: 10, y: 134, w: 100, h: 38, t: 'Feed 3', k: 'n' }, { id: 'f4', x: 10, y: 194, w: 100, h: 38, t: 'Feed 4', k: 'n' },
      { id: 'co', x: 190, y: 90, t: 'Collectors', sub: 'concurrent (Go)', k: 'b' }, { id: 'no', x: 370, y: 90, t: 'Normalise', sub: 'one IOC shape', k: 'a' },
      { id: 'cr', x: 550, y: 90, w: 190, t: 'Correlate', sub: 'ASN · MITRE ATT&CK overlap', k: 'c' },
      { id: 'dz', x: 550, y: 200, w: 190, t: 'Dossier', sub: 'structured, with Claude API', k: 'd' } ],
    edges: [['f1', 'co', 'r', 'l'], ['f2', 'co', 'r', 'l'], ['f3', 'co', 'r', 'l'], ['f4', 'co', 'r', 'l'], ['co', 'no', 'r', 'l'], ['no', 'cr', 'r', 'l'], ['cr', 'dz', 'b', 't', 'clusters', 'c']] },
  'secureview': { id: 'c', alt: 'Architecture: alerts enter a prioritised queue, the Claude API returns triage that must fit a typed data contract, and the dashboard shows guidance and reports.', h: 250,
    nodes: [
      { id: 'al', x: 10, y: 100, t: 'Alerts', sub: 'live queue', k: 'n' }, { id: 'tq', x: 180, y: 100, t: 'Prioritise', sub: 'by severity', k: 'a' },
      { id: 'cl', x: 350, y: 30, t: 'Claude API', sub: 'triage proposal', k: 'd' }, { id: 'ty', x: 350, y: 170, t: 'Typed contract', sub: 'validate or reject', k: 'b' },
      { id: 'db', x: 590, y: 30, w: 150, t: 'Dashboard', sub: 'remediation guidance', k: 'a' }, { id: 'rp', x: 590, y: 170, w: 150, t: 'Incident report', sub: 'executive summary', k: 'c' } ],
    edges: [['al', 'tq', 'r', 'l'], ['tq', 'cl', 'r', 'l', 'alert'], ['cl', 'ty', 'b', 't', 'model output', 'd'], ['ty', 'db', 'r', 'l', 'accepted', 'b'], ['ty', 'rp', 'r', 'l', 'accepted', 'b']] },
  'soc-lab': { id: 'd', alt: 'Architecture: a four-stage simulated intrusion produces events; Sigma-style rules and time-window correlation turn them into alerts that deploy in Wazuh.', h: 280,
    nodes: [
      { id: 's1', x: 10, y: 14, w: 150, h: 40, t: '1 Recon', k: 'c' }, { id: 's2', x: 200, y: 14, w: 150, h: 40, t: '2 Initial access', k: 'c' }, { id: 's3', x: 390, y: 14, w: 150, h: 40, t: '3 Privilege escalation', k: 'c' }, { id: 's4', x: 580, y: 14, w: 160, h: 40, t: '4 Exfiltration', k: 'c' },
      { id: 'lg', x: 10, y: 190, t: 'Event logs', sub: 'one threat actor', k: 'n' }, { id: 'sg', x: 200, y: 190, t: 'Sigma rules', sub: 'YAML', k: 'a' },
      { id: 'tw', x: 390, y: 190, w: 160, t: 'Time-window correlation', k: 'b' }, { id: 'wz', x: 600, y: 190, w: 140, t: 'Wazuh alert', sub: 'ATT&CK mapped', k: 'd' } ],
    edges: [['s1', 's2', 'r', 'l'], ['s2', 's3', 'r', 'l'], ['s3', 's4', 'r', 'l'], ['s1', 'lg', 'b', 't', 'events', 'c'], ['lg', 'sg', 'r', 'l'], ['sg', 'tw', 'r', 'l'], ['tw', 'wz', 'r', 'l']] },
  'ioc-hunter': { id: 'e', alt: 'Architecture: indicators are classified and sanitised, looked up concurrently in ThreatFox, URLhaus, AbuseIPDB and VirusTotal, normalised into one verdict and exported.', h: 290,
    nodes: [
      { id: 'in', x: 10, y: 118, t: 'Indicators', sub: 'messy input', k: 'n' }, { id: 'cs', x: 180, y: 118, t: 'Classify', sub: 'sanitise, validate', k: 'a' },
      { id: 'f1', x: 360, y: 8, w: 130, h: 38, t: 'ThreatFox', k: 'n' }, { id: 'f2', x: 360, y: 82, w: 130, h: 38, t: 'URLhaus', k: 'n' }, { id: 'f3', x: 360, y: 156, w: 130, h: 38, t: 'AbuseIPDB', k: 'n' }, { id: 'f4', x: 360, y: 230, w: 130, h: 38, t: 'VirusTotal', k: 'n' },
      { id: 'vd', x: 560, y: 118, t: 'One verdict', sub: 'normalised', k: 'b' }, { id: 'ou', x: 560, y: 218, w: 190, t: 'Console · JSON · HTML', sub: 'CI and SOAR friendly', k: 'd' } ],
    edges: [['in', 'cs', 'r', 'l'], ['cs', 'f1', 'r', 'l'], ['cs', 'f2', 'r', 'l'], ['cs', 'f3', 'r', 'l'], ['cs', 'f4', 'r', 'l'], ['f1', 'vd', 'r', 'l'], ['f2', 'vd', 'r', 'l'], ['f3', 'vd', 'r', 'l'], ['f4', 'vd', 'r', 'l'], ['vd', 'ou', 'b', 't']] },
  'supply-chain': { id: 'f', alt: 'Architecture: a vendor profile is scored against fifteen weighted criteria informed by NIST SP 800-161 to give a risk rating, and user acceptance testing refines the criteria.', h: 270,
    nodes: [
      { id: 'vp', x: 10, y: 60, t: 'Vendor profile', sub: 'inputs', k: 'n' }, { id: 'cr', x: 200, y: 60, w: 170, t: '15 weighted criteria', sub: 'risk model', k: 'a' },
      { id: 'sc', x: 440, y: 60, t: 'Score', sub: 'weighted sum', k: 'b' }, { id: 'rt', x: 610, y: 60, w: 130, t: 'Risk rating', k: 'c' },
      { id: 'ns', x: 200, y: 190, w: 170, t: 'NIST SP 800-161', sub: 'basis for criteria', k: 'd' }, { id: 'ua', x: 440, y: 190, w: 170, t: 'UAT, non-technical users', sub: 'refine weights', k: 'n' } ],
    edges: [['vp', 'cr', 'r', 'l'], ['cr', 'sc', 'r', 'l'], ['sc', 'rt', 'r', 'l'], ['ns', 'cr', 't', 'b', 'informs', 'd'], ['ua', 'cr', 'l', 'b', 'feedback', 'n']] },
};

window.DIAGRAMS = {};
Object.keys(SPECS).forEach(k => { window.DIAGRAMS[k] = build(SPECS[k]); });
})();
