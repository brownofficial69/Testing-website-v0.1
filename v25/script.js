/* v25: Glass OS — Draggable windows */

const PROJECTS = {
  threatweave:  { name:'ThreatWeave', icon:'TW', bg:'linear-gradient(135deg,#6366f1,#8b5cf6)', desc:'AI-powered threat intelligence correlation engine aggregating IOCs from multiple feeds using Go and Claude API.', tags:['Go','Claude API','Redis','IOC Analysis'] },
  secureview:   { name:'SecureView',  icon:'SV', bg:'linear-gradient(135deg,#06b6d4,#3b82f6)', desc:'Real-time SOC monitoring dashboard with AI-assisted alert triage built in TypeScript and React.',            tags:['React','TypeScript','Vite','Claude API'] },
  soclab:       { name:'SOC Detection Lab', icon:'SD', bg:'linear-gradient(135deg,#f43f5e,#ec4899)', desc:'Detection engineering lab producing Sigma rules mapped to MITRE ATT&CK. 94% framework coverage.',    tags:['Python','Sigma','MITRE ATT&CK'] },
  iochunter:    { name:'IOC Hunter',  icon:'IH', bg:'linear-gradient(135deg,#10b981,#059669)', desc:'CLI IOC aggregator and enrichment tool pulling from VirusTotal, ThreatFox, and custom feed sources.',  tags:['Python','VirusTotal','ThreatFox'] },
  nist:         { name:'NIST CSF 2.0', icon:'NI', bg:'linear-gradient(135deg,#f59e0b,#d97706)', desc:'Governance gap analysis tool with automated remediation roadmap for NIST CSF 2.0 compliance.',        tags:['GRC','NIST CSF','SVG'] },
  aws:          { name:'AWS Healthcare', icon:'AW', bg:'linear-gradient(135deg,#f97316,#ef4444)', desc:'Healthcare threat modelling using STRIDE methodology with GDPR compliance and AWS architecture review.', tags:['AWS','STRIDE','GDPR'] },
};

// Color syntax for cert JSON
function colorizeJson() {
  const pre = document.querySelector('.cert-json');
  if (!pre) return;
  let html = pre.textContent
    .replace(/"([^"]+)":/g, '<span class="key">"$1"</span>:')
    .replace(/: "([^"]+)"/g, ': <span class="str">"$1"</span>');
  pre.innerHTML = html;
}

// Draggable windows
function makeDraggable(win) {
  const bar = win.querySelector('.win-titlebar');
  let dragging = false, ox = 0, oy = 0;

  bar.addEventListener('mousedown', e => {
    if (e.target.classList.contains('wd-r') || e.target.classList.contains('wd-y') || e.target.classList.contains('wd-g')) return;
    dragging = true;
    focusWindow(win.id);
    const rect = win.getBoundingClientRect();
    ox = e.clientX - rect.left;
    oy = e.clientY - rect.top;
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    let nx = e.clientX - ox;
    let ny = e.clientY - oy;
    nx = Math.max(0, Math.min(nx, window.innerWidth - win.offsetWidth));
    ny = Math.max(28, Math.min(ny, window.innerHeight - win.offsetHeight - 80));
    win.style.left = nx + 'px';
    win.style.top  = ny + 'px';
  });

  document.addEventListener('mouseup', () => { dragging = false; });
}

// Focus window
function focusWindow(id) {
  document.querySelectorAll('.window').forEach(w => w.classList.remove('focused'));
  const win = document.getElementById(id);
  if (win) {
    win.classList.add('focused');
    win.style.zIndex = 10;
  }
}
window.focusWindow = focusWindow;

// Close detail window
document.getElementById('detail-close').addEventListener('click', () => {
  document.getElementById('win-detail').classList.add('hidden');
});

// Open project detail
function openProject(id) {
  const p = PROJECTS[id];
  if (!p) return;
  const win = document.getElementById('win-detail');
  document.getElementById('detail-title').textContent = p.name.toLowerCase();
  document.getElementById('detail-icon').style.background = p.bg;
  document.getElementById('detail-icon').textContent = p.icon;
  document.getElementById('detail-name').textContent = p.name;
  document.getElementById('detail-desc').textContent = p.desc;
  document.getElementById('detail-tags').innerHTML = p.tags.map(t => `<span>${t}</span>`).join('');
  win.classList.remove('hidden');
  focusWindow('win-detail');
}
window.openProject = openProject;

// Clock
function tick() {
  const el = document.getElementById('mb-time');
  if (el) el.textContent = new Date().toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' });
}
setInterval(tick, 1000); tick();

// Init
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.window').forEach(w => makeDraggable(w));
  colorizeJson();
  focusWindow('win-about');
});
