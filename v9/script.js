'use strict';

/* ══════════════════════
   PROJECT DATA
══════════════════════ */
const PROJECTS = [
  { id:'threatweave', label:'ThreatWeave.exe',  icon:'🧠', color:'#000080',
    title:'ThreatWeave', cat:'Threat Intelligence / CTI', year:'2026', tag:'AI-Powered',
    desc:'AI-powered IOC correlation engine written in Go. Clusters indicators by ASN, temporal proximity, and MITRE ATT&CK tactics. Generates professional CTI analyst narratives via Claude API.',
    highlights:['Threat clustering by shared ASN + temporal proximity + MITRE tactics','AI-generated threat actor profiles via Claude API','Automated Markdown report export','Static Go binary — no runtime dependencies','MIT licensed'],
    tech:['Go','Claude AI API','MITRE ATT&CK','Goroutines','CTI Workflows'],
    mitre:'T1071, T1041, T1190',github:'https://github.com/shaddiegit/threatweave',note:null},
  { id:'secureview',  label:'SecureView.exe',   icon:'🖥️', color:'#000080',
    title:'SecureView', cat:'SOC Dashboard / Blue Team', year:'2026', tag:'Web App',
    desc:'Full-stack SOC analyst dashboard with live alert queue, AI-powered triage via Claude API, automated incident reports, and 17 unit tests.',
    highlights:['Live alert queue — 5 realistic security scenarios','Claude API for risk scoring and MITRE mapping','Automated incident reports with executive summaries','17 unit tests (Vitest)'],
    tech:['TypeScript','React','Vite','Claude AI API','Vitest'],
    mitre:'T1059, T1055',github:'https://github.com/shaddiegit/secureview',
    note:'Run: npm install && npm run dev. Requires Anthropic API key.'},
  { id:'soc-lab',     label:'SOClab.dat',       icon:'🛡️', color:'#000080',
    title:'SOC Detection Lab', cat:'Blue Team / Detection Engineering', year:'2026', tag:'Detection',
    desc:'4-stage intrusion simulation with Sigma-compatible YAML detection rules for Wazuh. Full pytest validation suite covering true/false positives.',
    highlights:['4-stage kill chain from single threat actor IP','Sigma YAML rules covering full attack sequence','pytest true/false-positive validation','Wazuh-compatible deployment'],
    tech:['Python','Sigma YAML','Wazuh','pytest','Linux Auth Logs'],
    mitre:'T1110.001, T1548.003, T1041',github:'https://github.com/shaddiegit/soc-detection-lab',note:null},
  { id:'ioc-hunter',  label:'IOCHunter.py',     icon:'🔍', color:'#000080',
    title:'IOC Hunter', cat:'Threat Intelligence / CLI Tool', year:'2026', tag:'CLI Tool',
    desc:'Multi-source IOC lookup CLI querying ThreatFox, URLhaus, AbuseIPDB, and VirusTotal concurrently. 19 security tests, CI/SOAR compatible.',
    highlights:['Concurrent 4-feed threat intel queries','Auto-detects IOC type (IPv4, domain, URL, MD5, SHA-256)','Input hardening — CRLF/null-byte/ReDoS protection','--fail-on-malicious flag for CI/SOAR'],
    tech:['Python','ThreatFox','AbuseIPDB','VirusTotal','pytest'],
    mitre:'T1566, T1190',github:'https://github.com/shaddiegit/ioc-hunter',note:null},
  { id:'nist-csf',    label:'NIST_CSF.doc',     icon:'📋', color:'#000080',
    title:'NIST CSF 2.0 Gap Assessment', cat:'GRC / Compliance', year:'2026', tag:'GRC',
    desc:'Professional gap assessment for a fictional NHS pharmaceutical supplier. All 6 CSF 2.0 functions, maturity scoring, 12-month remediation roadmap.',
    highlights:['All 6 CSF 2.0 functions assessed','Maturity 1–4 scoring (current 1.32 → target 2.75)','3-phase remediation roadmap','UK GDPR Art.28 supplier questionnaire','SVG maturity radar chart'],
    tech:['NIST CSF 2.0','UK GDPR','ISO 27001','Risk Assessment'],
    mitre:'N/A',github:'https://github.com/shaddiegit/nist-csf-gap-assessment',
    note:'Documentation set: Markdown assessment, SVG radar, questionnaire.'},
  { id:'aws-arch',    label:'AWSArch.case',     icon:'☁️', color:'#800000',
    title:'AWS Healthcare AI Triage', cat:'Cloud Security / Architecture Review', year:'2022', tag:'Case Study',
    desc:'Led STRIDE threat-modelling of AWS-hosted AI triage system for NHS. GDPR Art.9 violations found — project cancelled before implementation.',
    highlights:['STRIDE threat modelling across S3, IAM, EC2','GDPR Art.9 violation found before any code written','OSINT re-identification risk identified','Strategic cancellation prevented ICO exposure'],
    tech:['AWS','STRIDE','GDPR Article 9','Architecture Review'],
    mitre:'N/A',github:null,note:'Case study — no public repository.'},
];

/* ══════════════════════
   WINDOW MANAGER
══════════════════════ */
let zTop = 100;
const windows = new Map(); /* id → { el, minimized, focused, title, icon } */
let focusedId = null;

function openWindow(cfg) {
  if (windows.has(cfg.id)) {
    const win = windows.get(cfg.id);
    if (win.minimized) {
      win.minimized = false;
      win.el.style.display = '';
    }
    focusWindow(cfg.id);
    return;
  }

  const el = document.createElement('div');
  el.className = 'os-window';
  el.id = 'win-' + cfg.id;
  el.style.width  = (cfg.w || 460) + 'px';
  el.style.height = (cfg.h || 340) + 'px';
  el.style.left   = (cfg.x ?? 60 + windows.size * 22) + 'px';
  el.style.top    = (cfg.y ?? 40 + windows.size * 22) + 'px';
  el.style.zIndex = ++zTop;

  /* Title bar */
  const titleBar = document.createElement('div');
  titleBar.className = 'win-title';
  titleBar.innerHTML = `
    <span class="wt-icon">${cfg.icon}</span>
    <span class="wt-label">${cfg.title}</span>
    <div class="wt-btns">
      <button class="wb wb-min" title="Minimize">_</button>
      <button class="wb wb-max" title="Maximize">□</button>
      <button class="wb wb-close" title="Close">✕</button>
    </div>`;

  /* Menu bar (optional) */
  let menuBar = '';
  if (cfg.menu) {
    const mb = document.createElement('div');
    mb.className = 'win-menubar';
    cfg.menu.forEach(m => { const d=document.createElement('div');d.className='wmb-item';d.textContent=m;mb.appendChild(d);});
    el.appendChild(mb);
  }

  /* Body */
  const body = document.createElement('div');
  body.className = 'win-body';
  body.innerHTML = cfg.content;

  /* Status bar (optional) */
  let statusEl;
  if (cfg.status) {
    statusEl = document.createElement('div');
    statusEl.className = 'win-status';
    cfg.status.forEach(s => { const d=document.createElement('div');d.className='ws-item';d.textContent=s;statusEl.appendChild(d);});
  }

  el.appendChild(titleBar);
  if (menuBar) el.appendChild(menuBar);
  el.appendChild(body);
  if (statusEl) el.appendChild(statusEl);

  document.getElementById('windows-layer').appendChild(el);

  /* Store */
  windows.set(cfg.id, { el, minimized:false, title:cfg.title, icon:cfg.icon });

  /* Wire buttons */
  titleBar.querySelector('.wb-min').addEventListener('click', e => { e.stopPropagation(); minimizeWindow(cfg.id); });
  titleBar.querySelector('.wb-max').addEventListener('click', e => { e.stopPropagation(); maximizeWindow(cfg.id); });
  titleBar.querySelector('.wb-close').addEventListener('click', e => { e.stopPropagation(); closeWindow(cfg.id); });

  /* Drag */
  makeDraggable(el, titleBar);

  /* Focus on click anywhere */
  el.addEventListener('mousedown', () => focusWindow(cfg.id));

  focusWindow(cfg.id);
  updateTaskbar();

  /* Post-render init */
  if (cfg.onOpen) setTimeout(() => cfg.onOpen(el, body), 0);

  return { el, body };
}

function focusWindow(id) {
  if (focusedId === id) return;
  if (focusedId && windows.has(focusedId)) {
    windows.get(focusedId).el.querySelector('.win-title')?.classList.add('inactive');
  }
  if (!windows.has(id)) return;
  const win = windows.get(id);
  win.el.style.zIndex = ++zTop;
  win.el.querySelector('.win-title')?.classList.remove('inactive');
  focusedId = id;
  updateTaskbar();
}

let maxWin = null;
function maximizeWindow(id) {
  const win = windows.get(id); if (!win) return;
  if (maxWin === id) {
    // Restore
    win.el.style.left   = win._pl;
    win.el.style.top    = win._pt;
    win.el.style.width  = win._pw;
    win.el.style.height = win._ph;
    maxWin = null;
  } else {
    win._pl = win.el.style.left; win._pt = win.el.style.top;
    win._pw = win.el.style.width; win._ph = win.el.style.height;
    win.el.style.left='0'; win.el.style.top='0';
    win.el.style.width='100%'; win.el.style.height='calc(100vh - 30px)';
    maxWin = id;
    focusWindow(id);
  }
}

function minimizeWindow(id) {
  const win = windows.get(id); if (!win) return;
  win.minimized = true; win.el.style.display = 'none';
  if (focusedId === id) focusedId = null;
  updateTaskbar();
}

function closeWindow(id) {
  const win = windows.get(id); if (!win) return;
  win.el.remove(); windows.delete(id);
  if (focusedId === id) focusedId = null;
  updateTaskbar();
}

function updateTaskbar() {
  const tb = document.getElementById('taskbar-windows');
  tb.innerHTML = '';
  windows.forEach((win, id) => {
    if (win.minimized && !win.minShown) return; // still show in taskbar
    const btn = document.createElement('button');
    btn.className = 'tb-win ' + (focusedId === id ? 'active' : 'inactive');
    btn.innerHTML = `<span class="tb-win-icon">${win.icon}</span><span class="tb-win-label">${win.title}</span>`;
    btn.addEventListener('click', () => {
      if (win.minimized) { win.minimized = false; win.el.style.display = ''; focusWindow(id); }
      else if (focusedId === id) minimizeWindow(id);
      else focusWindow(id);
    });
    tb.appendChild(btn);
  });
}

/* ══════════════════════
   DRAGGABLE
══════════════════════ */
function makeDraggable(el, handle) {
  let sx, sy, sl, st, dragging = false;
  handle.addEventListener('mousedown', e => {
    if (e.target.classList.contains('wb')) return;
    dragging = true;
    sx = e.clientX; sy = e.clientY;
    sl = parseInt(el.style.left)||0; st = parseInt(el.style.top)||0;
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
  function onMove(e) {
    if (!dragging) return;
    if (maxWin) return; // don't drag maximized
    el.style.left = Math.max(0, sl + e.clientX - sx) + 'px';
    el.style.top  = Math.max(0, Math.min(window.innerHeight - 30, st + e.clientY - sy)) + 'px';
  }
  function onUp() { dragging = false; document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); }

  /* Touch drag */
  handle.addEventListener('touchstart', e => {
    if (e.target.classList.contains('wb')) return;
    const t = e.touches[0]; sx=t.clientX; sy=t.clientY; sl=parseInt(el.style.left)||0; st=parseInt(el.style.top)||0;
    handle.addEventListener('touchmove', onTMove);
    handle.addEventListener('touchend', ()=>handle.removeEventListener('touchmove',onTMove),{once:true});
  });
  function onTMove(e) { const t=e.touches[0]; el.style.left=Math.max(0,sl+t.clientX-sx)+'px'; el.style.top=Math.max(0,Math.min(window.innerHeight-30,st+t.clientY-sy))+'px'; }
}

/* ══════════════════════
   WINDOW CONTENT
══════════════════════ */
function buildAboutContent() {
  return `<div class="about-win">
    <div class="aw-top">
      <div class="aw-photo" id="aw-photo">SH
        <img src="../assets/profile.jpg" alt="Shadman Hossain" id="profile-img" />
      </div>
      <div class="aw-info">
        <table>
          <tr><td>Name</td><td><b>Shadman Hossain</b></td></tr>
          <tr><td>Degree</td><td>BSc (Hons) Ethical Hacking &amp; Cyber Security</td></tr>
          <tr><td>University</td><td>Coventry University</td></tr>
          <tr><td>Average</td><td><b style="color:#000080">76.67%</b> (First-Class track)</td></tr>
          <tr><td>Location</td><td>Coventry, UK</td></tr>
          <tr><td>Target</td><td>Junior SOC / GRC / CTI roles, UK</td></tr>
          <tr><td>ISC2 CC</td><td>Exam scheduled — <b style="color:#800000">11 June 2026</b></td></tr>
        </table>
      </div>
    </div>
    <div class="aw-bio">
      <p>I'm a final-year <b>BSc Ethical Hacking &amp; Cyber Security</b> student at Coventry University, on track for First-Class Honours. My current average is <b>76.67%</b>; research project scored 87%.</p><br>
      <p>Work spans <b>blue team detection engineering</b> — Wazuh-compatible Sigma rules and intrusion simulation — to <b>GRC compliance</b>, delivering full NIST CSF 2.0 assessments for regulated sectors. I also build <b>AI-augmented security tools</b> in Python and Go.</p>
    </div>
    <div class="aw-stats">
      <div class="aws-box"><div class="aws-num">76.67%</div><div class="aws-lbl">CURRENT AVERAGE</div></div>
      <div class="aws-box"><div class="aws-num">87%</div><div class="aws-lbl">RESEARCH PROJECT</div></div>
      <div class="aws-box"><div class="aws-num">5</div><div class="aws-lbl">GITHUB PROJECTS</div></div>
      <div class="aws-box"><div class="aws-num">ISC2</div><div class="aws-lbl">CC — JUN 2026</div></div>
    </div>
  </div>`;
}

function buildProjectsContent() {
  const items = PROJECTS.map(p =>
    `<div class="pe-item" data-proj="${p.id}"><span class="pe-icon">${p.icon}</span>${p.label}</div>`
  ).join('');
  return `<div class="proj-explorer">
    <div class="pe-sidebar" id="pe-sidebar">${items}</div>
    <div class="pe-detail" id="pe-detail">
      <p style="color:#444;padding:8px">Select a project from the list to view details.</p>
    </div>
  </div>`;
}

function buildSkillsContent() {
  const cats = [
    { label:'SOC', items:['SIEM','Wazuh','ELK Stack','Splunk','Sigma Rules','MITRE ATT&CK','Log Analysis','Incident Triage'] },
    { label:'Offensive', items:['Kali Linux','Nmap','Burp Suite','Metasploit','Wireshark','OSINT','Vuln Assessment'] },
    { label:'GRC', items:['NIST CSF 2.0','ISO 27001','UK GDPR','Threat Modelling','Risk Assessment','Supplier Due Diligence','Audit'] },
    { label:'Programming', items:['Python','Go','Bash','TypeScript','Playwright','pytest','Web Scraping'] },
    { label:'Cloud', items:['AWS S3','AWS IAM','AWS EC2','Linux Admin','Windows AD'] },
    { label:'Frameworks', items:['MITRE ATT&CK','OWASP Top 10','Kill Chain','NIST RMF','STRIDE'] },
  ];
  const tabs = cats.map((c,i) => `<div class="sk-tab${i===0?' active':''}" data-tab="${i}">${c.label}</div>`).join('');
  const panels = cats.map((c,i) => `<div class="sk-panel${i===0?' active':''}" data-panel="${i}">${c.items.map(it=>`<div class="sk-item">${it}</div>`).join('')}</div>`).join('');
  return `<div class="skills-win"><div class="sk-tabs">${tabs}</div>${panels}</div>`;
}

function buildEducationContent() {
  return `<div class="win-body" style="padding:0"><div class="edu-notepad">
<span class="en-h">===================================================</span>
<span class="en-h">  EDUCATION RECORD — SHADMAN HOSSAIN</span>
<span class="en-h">===================================================</span>

<span class="en-h">[ ENTRY 1 — CURRENT ]</span>

  Degree:      BSc (Hons) Ethical Hacking &amp; Cyber Security
  Institution: Coventry University
  Period:      September 2023 – July 2026
  Status:      <span class="en-hl">IN PROGRESS — EXPECTED FIRST-CLASS</span>
  Average:     <span class="en-hl">76.67%</span>

  Module Grades:
  ┌──────────────────────────────────────────┬─────┐
  │ Digital Security Risk &amp; Audit             │ 73% │
  │ Security Operations                      │ 67% │
  │ Information Security Management          │ 70% │
  │ Applied Cryptography                     │ 75% │
  │ Advanced Penetration Testing             │ 71% │
  │ Project Delivery                         │ 76% │
  │ Research Project                         │ 87% │
  └──────────────────────────────────────────┴─────┘

<span class="en-h">[ ENTRY 2 — COMPLETED ]</span>

  Qualification: BTEC Level 3 National Diploma in IT
  Institution:   Birmingham Metropolitan College
  Period:        September 2020 – July 2022
  Grade:         <span class="en-hl">DOUBLE DISTINCTION MERIT</span>

  Modules:
    IT Project Management     — Distinction
    Programming               — Distinction
    Mobile Apps               — Distinction
    Cyber Security &amp; Incident Management

===================================================
  Last modified: 2026  |  Encoding: UTF-8
===================================================</div></div>`;
}

function buildCertsContent() {
  return `<div class="certs-win">
    <div class="cert-item">
      <div class="ci-badge">🛡️</div>
      <div>
        <div class="ci-issuer">ISC2</div>
        <div class="ci-name">Certified in Cybersecurity (CC)</div>
        <div class="ci-desc">Vendor-neutral security certification covering risk management, network security, security operations, and access controls.</div>
        <div class="ci-status"><span class="ci-dot"></span> Exam Scheduled — 11 June 2026</div>
      </div>
    </div>
    <div class="cert-item">
      <div class="ci-badge">➕</div>
      <div>
        <div class="ci-issuer" style="color:#808080">FUTURE</div>
        <div class="ci-name">More Certifications Coming</div>
        <div class="ci-desc">Continuing professional development in SOC operations, threat hunting, and GRC disciplines post-graduation 2026.</div>
        <div class="ci-status"><span class="ci-dot dim"></span> Planned — Post-Graduation 2026</div>
      </div>
    </div>
  </div>`;
}

function buildContactContent() {
  return `<div class="contact-win">
    <div class="cw-links">
      <a href="mailto:sm.shadman.hossain@gmail.com" class="cw-link"><span class="cw-link-icon">📧</span><div><b>Email</b><div style="font-size:10px">sm.shadman.hossain@gmail.com</div></div></a>
      <a href="https://github.com/shaddiegit" target="_blank" rel="noopener" class="cw-link"><span class="cw-link-icon">🐙</span><div><b>GitHub</b><div style="font-size:10px">github.com/shaddiegit</div></div></a>
      <a href="https://www.linkedin.com/in/shadman-hossain1206" target="_blank" rel="noopener" class="cw-link"><span class="cw-link-icon">💼</span><div><b>LinkedIn</b><div style="font-size:10px">linkedin.com/in/shadman-hossain1206</div></div></a>
    </div>
    <div style="border-top:2px solid #808080;padding-top:6px;font-weight:bold;margin-bottom:4px">Send a Message</div>
    <form id="contact-form-win">
      <div class="cw-field"><label class="cw-label">Name:</label><input class="win-input" id="cf-name" type="text" required /></div>
      <div class="cw-field"><label class="cw-label">Email:</label><input class="win-input" id="cf-email" type="email" required /></div>
      <div class="cw-field"><label class="cw-label">Subject:</label><input class="win-input" id="cf-subject" type="text" required /></div>
      <div class="cw-field" style="align-items:flex-start;margin-top:2px"><label class="cw-label" style="padding-top:2px">Message:</label><textarea class="win-textarea" id="cf-msg" rows="3" required></textarea></div>
      <div style="display:flex;justify-content:flex-end;gap:4px;margin-top:4px">
        <button type="submit" class="win-btn">Send</button>
        <button type="reset" class="win-btn">Clear</button>
      </div>
      <p class="form-note-win" id="cf-status"></p>
    </form>
  </div>`;
}

function buildSysinfoContent() {
  const now = new Date();
  return `<div class="sysinfo-win">
    <div class="si-logo">
      <div class="si-win-logo">
        <div class="siwl-q r"></div><div class="siwl-q g"></div>
        <div class="siwl-q b"></div><div class="siwl-q y"></div>
      </div>
      <div>
        <div class="si-name">ShadmanOS 95</div>
        <div class="si-version">Cybersecurity Portfolio Edition · Version 9.0.0</div>
        <div class="si-version" style="margin-top:4px">Copyright © 2026 Shadman Hossain. All rights reserved.</div>
      </div>
    </div>
    <table class="si-table">
      <tr><td>Name</td><td>Shadman Hossain</td></tr>
      <tr><td>Degree</td><td>BSc (Hons) Ethical Hacking &amp; Cyber Security</td></tr>
      <tr><td>University</td><td>Coventry University</td></tr>
      <tr><td>Current Average</td><td><b>76.67%</b> — First-Class track</td></tr>
      <tr><td>Research Project</td><td><b>87%</b></td></tr>
      <tr><td>Location</td><td>Coventry, UK</td></tr>
      <tr><td>Seeking</td><td>Junior SOC Analyst · GRC Analyst · CTI Analyst</td></tr>
      <tr><td>ISC2 CC Exam</td><td>11 June 2026</td></tr>
      <tr><td>Portfolio Views</td><td>${1200 + Math.floor(Math.random()*200)}</td></tr>
      <tr><td>System Date</td><td>${now.toLocaleDateString('en-GB',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</td></tr>
      <tr class="si-bar-row"><td>Academic Performance</td><td>
        <div class="si-bar-wrap"><div class="si-bar" style="width:76.67%">76.67%</div></div>
      </td></tr>
    </table>
  </div>`;
}

function buildRecycleContent() {
  return `<div class="recycle-win">
    <div class="rb-empty">🗑️</div>
    <p><b>Recycle Bin is empty.</b></p>
    <p style="margin-top:8px;color:#666">No rejected opportunities found.<br>All applications accepted.</p>
    <div style="margin-top:16px;padding:8px;border:2px inset #c0c0c0;background:#ffffc0;font-size:10px;text-align:left">
      💡 <b>Tip:</b> Items deleted from ShadmanOS 95 are stored here until permanently removed. Currently: 0 items (0 bytes).
    </div>
  </div>`;
}

function buildWelcomeContent() {
  return `<div class="welcome-win">
    <div class="welcome-icon">💻</div>
    <div class="welcome-title">Welcome to ShadmanOS 95!</div>
    <div class="welcome-body">
      <p>Hello! I'm <b>Shadman Hossain</b>, a final-year cybersecurity student at Coventry University.</p><br>
      <p>This portfolio is styled as <b>Windows 95</b> — you can:</p>
      <ul style="padding-left:1.5rem;margin-top:4px;line-height:1.8">
        <li>Double-click desktop icons to open windows</li>
        <li>Drag windows by their title bars</li>
        <li>Use the <b>Start</b> menu to navigate</li>
        <li>Minimize, maximize, and close windows</li>
        <li>Right-click the desktop for options</li>
      </ul><br>
      <p style="color:#800000"><b>Seeking junior SOC / GRC / CTI roles in the UK.</b></p>
    </div>
    <div class="welcome-btns">
      <button class="win-btn" id="welcome-ok">OK</button>
    </div>
  </div>`;
}

/* ══════════════════════
   OPEN WINDOW CONFIGS
══════════════════════ */
const WIN_CONFIGS = {
  welcome:   { id:'welcome',   icon:'💻', title:'Welcome to ShadmanOS 95', w:380, h:380, x:140, y:60,  content:buildWelcomeContent(), menu:['Help'] },
  about:     { id:'about',     icon:'👤', title:'About Me — Shadman Hossain', w:480, h:380, x:80,  y:60,  content:buildAboutContent(), menu:['File','Edit','View','Help'], status:['Ready','Coventry, UK'] },
  projects:  { id:'projects',  icon:'💼', title:'My Projects', w:600, h:420, x:100, y:50,  content:buildProjectsContent(), menu:['File','View','Help'], status:['6 projects','Click to view details'] },
  skills:    { id:'skills',    icon:'🔧', title:'Skills.ini — Notepad', w:440, h:360, x:140, y:80,  content:buildSkillsContent(), menu:['File','Edit'] },
  education: { id:'education', icon:'📚', title:'Education.txt — Notepad', w:500, h:400, x:120, y:70,  content:buildEducationContent(), menu:['File','Edit','Format','View','Help'] },
  certs:     { id:'certs',     icon:'🏆', title:'Certifications', w:440, h:300, x:160, y:90,  content:buildCertsContent(), menu:['File','View'] },
  contact:   { id:'contact',   icon:'📧', title:'Contact.eml — New Message', w:420, h:380, x:180, y:70,  content:buildContactContent(), menu:['File','Send','View','Help'] },
  sysinfo:   { id:'sysinfo',   icon:'🖥️', title:'System Properties', w:420, h:400, x:200, y:60,  content:buildSysinfoContent(), menu:['File'] },
  recycle:   { id:'recycle',   icon:'🗑️', title:'Recycle Bin', w:360, h:280, x:220, y:80,  content:buildRecycleContent(), menu:['File','View','Help'], status:['0 objects','0 bytes'] },
};

function openWin(id) {
  const cfg = WIN_CONFIGS[id];
  if (!cfg) return;
  const result = openWindow(cfg);

  /* Post-open setup */
  if (id === 'welcome') {
    document.getElementById('welcome-ok')?.addEventListener('click', () => closeWindow('welcome'));
  }
  if (id === 'about') {
    const img = document.getElementById('profile-img');
    if (img) {
      img.onload = () => { img.classList.add('loaded'); document.getElementById('aw-photo')?.querySelector('.aw-photo')?.style; };
      img.onerror = () => img.style.display = 'none';
      if (img.complete && img.naturalWidth > 0) img.onload();
    }
  }
  if (id === 'projects') {
    setTimeout(() => wireProjectExplorer(), 50);
  }
  if (id === 'skills') {
    setTimeout(() => wireSkillTabs(), 50);
  }
  if (id === 'contact') {
    setTimeout(() => wireContactForm(), 50);
  }
}

function wireProjectExplorer() {
  const sidebar  = document.getElementById('pe-sidebar');
  const detail   = document.getElementById('pe-detail');
  if (!sidebar || !detail) return;
  sidebar.querySelectorAll('.pe-item').forEach(item => {
    item.addEventListener('click', () => {
      sidebar.querySelectorAll('.pe-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const p = PROJECTS.find(pr => pr.id === item.dataset.proj);
      if (!p) return;
      detail.innerHTML = `
        <div class="ped-title">${p.title}</div>
        <div class="ped-cat">${p.cat} · ${p.year} · <b>${p.tag}</b></div>
        <div class="ped-desc">${p.desc}</div>
        <div class="ped-section"><h4>KEY HIGHLIGHTS</h4>
          ${p.highlights.map(h=>`<div class="sk-item" style="font-size:11px">${h}</div>`).join('')}
        </div>
        <div class="ped-section"><h4>TECHNOLOGIES</h4>
          <div class="ped-tags">${p.tech.map(t=>`<span class="ped-tag">${t}</span>`).join('')}</div>
        </div>
        <div class="ped-section"><h4>MITRE ATT&amp;CK</h4>
          <div class="ped-mitre">${p.mitre}</div>
        </div>
        ${p.note ? `<div class="ped-note">ℹ️ ${p.note}</div>` : ''}
        <div class="ped-section">
          ${p.github
            ? `<a href="${p.github}" target="_blank" rel="noopener" class="win-btn ped-btn">🐙 View on GitHub</a>`
            : `<span style="color:#666;font-size:11px">// No public repository — case study</span>`
          }
        </div>`;
    });
  });
}

function wireSkillTabs() {
  document.querySelectorAll('.sk-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const i = tab.dataset.tab;
      document.querySelectorAll('.sk-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.sk-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.querySelector(`.sk-panel[data-panel="${i}"]`)?.classList.add('active');
    });
  });
}

function wireContactForm() {
  const form = document.getElementById('contact-form-win');
  const st   = document.getElementById('cf-status');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const n  = form.querySelector('#cf-name');
    const em = form.querySelector('#cf-email');
    const s  = form.querySelector('#cf-subject');
    const m  = form.querySelector('#cf-msg');
    if (!n.value||!em.value||!s.value||!m.value) { st.textContent='Please fill in all fields.'; st.className='form-note-win error'; return; }
    window.location.href=`mailto:sm.shadman.hossain@gmail.com?subject=${encodeURIComponent(s.value)}&body=${encodeURIComponent(`Name: ${n.value}\nEmail: ${em.value}\n\n${m.value}`)}`;
    st.textContent='Message sent! Opening email client...'; st.className='form-note-win success';
    setTimeout(()=>{form.reset();st.textContent='';st.className='form-note-win';},4000);
  });
}

/* ══════════════════════
   START MENU
══════════════════════ */
const startBtn  = document.getElementById('start-btn');
const startMenu = document.getElementById('start-menu');
let menuOpen = false;

function toggleStart(e) {
  e.stopPropagation();
  menuOpen = !menuOpen;
  startMenu.style.display = menuOpen ? 'flex' : 'none';
  startBtn.classList.toggle('start-pressed', menuOpen);
  startBtn.setAttribute('aria-expanded', menuOpen);
}

startBtn.addEventListener('click', toggleStart);

startMenu.querySelectorAll('.sm-item[data-win]').forEach(item => {
  item.addEventListener('click', () => {
    openWin(item.dataset.win);
    startMenu.style.display = 'none';
    menuOpen = false;
    startBtn.classList.remove('start-pressed');
  });
});

document.getElementById('sm-shutdown')?.addEventListener('click', () => {
  startMenu.style.display = 'none'; menuOpen = false;
  const sd = document.createElement('div');
  sd.id = 'shutdown-screen';
  sd.innerHTML = `<div class="sd-icon">💾</div><div class="sd-text">It is now safe to turn off your browser.</div><div class="sd-sub">ShadmanOS 95 has shut down. <a href="../" style="color:#aaa">Return to portfolio index →</a></div>`;
  sd.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#000;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1rem;color:#fff;font-family:Tahoma,Arial,sans-serif;text-align:center;';
  document.body.appendChild(sd);
});

/* Close start menu when clicking elsewhere */
document.addEventListener('click', e => {
  if (!startMenu.contains(e.target) && e.target !== startBtn) {
    startMenu.style.display = 'none';
    menuOpen = false;
    startBtn.classList.remove('start-pressed');
  }
});

/* ══════════════════════
   DESKTOP ICONS
══════════════════════ */
let selectedIcon = null, dblTimer = null;

document.querySelectorAll('.desk-icon').forEach(icon => {
  icon.addEventListener('click', e => {
    e.stopPropagation();
    if (selectedIcon) selectedIcon.classList.remove('selected');
    selectedIcon = icon; icon.classList.add('selected');
    if (dblTimer) {
      clearTimeout(dblTimer);
      dblTimer = null;
      openWin(icon.dataset.win);
    } else {
      dblTimer = setTimeout(() => { dblTimer = null; }, 400);
    }
  });
  icon.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') openWin(icon.dataset.win); });
});

document.getElementById('desktop').addEventListener('click', () => {
  if (selectedIcon) selectedIcon.classList.remove('selected');
  selectedIcon = null;
  startMenu.style.display = 'none'; menuOpen = false;
  document.getElementById('ctx-menu').style.display = 'none';
});

/* ══════════════════════
   CONTEXT MENU
══════════════════════ */
const ctxMenu = document.getElementById('ctx-menu');
document.getElementById('desktop').addEventListener('contextmenu', e => {
  e.preventDefault();
  ctxMenu.style.display = 'block';
  ctxMenu.style.left = Math.min(e.clientX, window.innerWidth - 160) + 'px';
  ctxMenu.style.top  = Math.min(e.clientY, window.innerHeight - 200) + 'px';
});
ctxMenu.querySelectorAll('.ctx-item[data-win]').forEach(item => {
  item.addEventListener('click', () => { openWin(item.dataset.win); ctxMenu.style.display = 'none'; });
});
document.getElementById('ctx-refresh')?.addEventListener('click', () => { ctxMenu.style.display='none'; });
document.getElementById('ctx-arrange')?.addEventListener('click', () => { ctxMenu.style.display='none'; });
document.getElementById('ctx-props')?.addEventListener('click', () => { openWin('sysinfo'); ctxMenu.style.display='none'; });
document.addEventListener('click', () => ctxMenu.style.display = 'none');

/* ══════════════════════
   TASKBAR - WINDOWS BTN
══════════════════════ */
document.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', e => { e.preventDefault(); openWin(l.dataset.win||'about'); });
});

/* ══════════════════════
   CLOCK
══════════════════════ */
function updateClock() {
  const el = document.getElementById('tray-clock');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit',hour12:true});
}
updateClock();
setInterval(updateClock, 10000);

/* ══════════════════════
   BOOT SEQUENCE
══════════════════════ */
(function boot() {
  const screen = document.getElementById('boot-screen');
  const bar    = document.getElementById('boot-bar');

  /* Animate progress bar */
  let pct = 0;
  const iv = setInterval(() => {
    pct = Math.min(100, pct + (pct < 60 ? 8 : pct < 90 ? 4 : 1));
    bar.style.width = pct + '%';
    if (pct >= 100) {
      clearInterval(iv);
      setTimeout(() => {
        screen.classList.add('fade');
        setTimeout(() => {
          screen.style.display = 'none';
          /* Open welcome window */
          openWin('welcome');
          /* Open About automatically */
          setTimeout(() => openWin('about'), 300);
        }, 600);
      }, 400);
    }
  }, 90);
})();

/* CV button */
const cvSm = document.getElementById('cv-sm');
if (cvSm) fetch('../assets/cv.pdf',{method:'HEAD'}).catch(()=>{cvSm.removeAttribute('href');cvSm.removeAttribute('download');cvSm.style.opacity='.4';cvSm.style.pointerEvents='none';});
