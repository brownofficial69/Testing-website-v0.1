'use strict';

/* ══════════════════════════════════════════════════
   PROJECT DATA
══════════════════════════════════════════════════ */
const PROJECTS = {
  threatweave:{title:'ThreatWeave',category:'Threat Intelligence / CTI',icon:'fas fa-brain',iconClass:'green-icon',
    description:'AI-powered IOC correlation engine in Go. Clusters indicators by ASN, temporal proximity, and MITRE ATT&CK tactics. Generates professional CTI analyst narratives via Claude AI.',
    highlights:['Threat clustering by shared ASN, temporal proximity, and MITRE tactics','AI-generated threat actor profiles via Claude API','Automated Markdown report export','Static Go binary — no runtime dependencies','MIT licensed'],
    tech:['Go','Claude AI API','MITRE ATT&CK','Goroutines','CTI'],mitre:[{id:'T1071',name:'Application Layer Protocol'},{id:'T1041',name:'Exfiltration Over C2'},{id:'T1190',name:'Exploit Public-Facing App'}],
    github:'https://github.com/shaddiegit/threatweave',note:null},
  secureview:{title:'SecureView',category:'SOC Dashboard / Blue Team',icon:'fas fa-desktop',iconClass:'cyan-icon',
    description:'Full-stack SOC analyst dashboard with live alert queue, AI-powered triage via Claude API, automated incident reports, and 17 unit tests.',
    highlights:['Live alert queue with 5 realistic security scenarios','Claude API for AI-driven risk scoring + MITRE mapping','Automated incident reports with executive summaries','17 unit tests (Vitest)'],
    tech:['TypeScript','React','Vite','Claude AI API','Vitest'],mitre:[{id:'T1059',name:'Command and Scripting Interpreter'},{id:'T1055',name:'Process Injection'}],
    github:'https://github.com/shaddiegit/secureview',note:'Run: npm install && npm run dev. Needs Anthropic API key.'},
  'soc-lab':{title:'SOC Detection Lab',category:'Blue Team / Detection Engineering',icon:'fas fa-shield-halved',iconClass:'green-icon',
    description:'4-stage intrusion simulation with Sigma-compatible YAML rules for Wazuh. Full pytest validation suite.',
    highlights:['4-stage kill chain from single threat actor IP','Sigma YAML rules covering full attack sequence','Time-window correlation: brute-force IP → 90 MB exfil','pytest true/false-positive validation','Wazuh-compatible deployment'],
    tech:['Python','Sigma YAML','Wazuh','pytest','Linux Auth Logs'],mitre:[{id:'T1110.001',name:'Password Guessing'},{id:'T1548.003',name:'Sudo Caching'},{id:'T1041',name:'Exfiltration'}],
    github:'https://github.com/shaddiegit/soc-detection-lab',note:null},
  'ioc-hunter':{title:'IOC Hunter',category:'Threat Intelligence / CLI Tool',icon:'fas fa-magnifying-glass',iconClass:'cyan-icon',
    description:'Multi-source IOC lookup CLI querying ThreatFox, URLhaus, AbuseIPDB, and VirusTotal concurrently. 19 security tests, CI/SOAR compatible.',
    highlights:['Concurrent 4-feed threat intel queries','Offline-first with bundled reference feeds','Auto-detects IOC type: IPv4, domain, URL, MD5, SHA-256','CRLF/null-byte/ReDoS hardening','--fail-on-malicious for CI pipelines'],
    tech:['Python','ThreatFox','AbuseIPDB','VirusTotal','threading','pytest'],mitre:[{id:'T1566',name:'Phishing'},{id:'T1190',name:'Exploit Public-Facing App'}],
    github:'https://github.com/shaddiegit/ioc-hunter',note:null},
  'nist-csf':{title:'NIST CSF 2.0 Gap Assessment',category:'GRC / Compliance',icon:'fas fa-clipboard-check',iconClass:'purple-icon',
    description:'Professional GRC gap assessment for a fictional NHS pharmaceutical supplier. All 6 CSF 2.0 functions, maturity scoring, 12-month roadmap.',
    highlights:['All 6 CSF 2.0 functions assessed','Maturity 1–4 scoring (current 1.32 → target 2.75)','2 High-severity root-cause blockers identified','3-phase remediation roadmap','UK GDPR Art.28 supplier questionnaire','SVG maturity radar chart'],
    tech:['NIST CSF 2.0','UK GDPR','ISO 27001','Risk Assessment','Supplier Due Diligence'],mitre:[],
    github:'https://github.com/shaddiegit/nist-csf-gap-assessment',note:'Documentation set: Markdown assessment, SVG radar, questionnaire.'},
  'aws-arch':{title:'AWS Healthcare AI Triage',category:'Cloud Security / Architecture Review',icon:'fab fa-aws',iconClass:'amber-icon',
    description:'Led team threat-modelling of AWS-hosted AI triage system for NHS. STRIDE analysis revealed GDPR Art.9 violations, driving strategic project cancellation.',
    highlights:['Team lead for full architecture design phase','STRIDE threat modelling across S3, IAM, EC2','GDPR Art.9 violation found before any code written','OSINT re-identification risk identified','Strategic cancellation prevented ICO exposure'],
    tech:['AWS (S3, IAM, EC2)','STRIDE','GDPR Article 9','Architecture Review'],mitre:[],
    github:null,note:'Case study only — no public codebase.'}
};

/* ══════════════════════════════════════════════════
   SOUND ENGINE
══════════════════════════════════════════════════ */
const SoundEngine = (() => {
  let ctx=null,enabled=true;
  function ac(){if(!ctx)ctx=new(window.AudioContext||window.webkitAudioContext)();if(ctx.state==='suspended')ctx.resume();return ctx;}
  function osc(f,t,g,a,d,so=0){const c=ac(),ts=c.currentTime+so,gn=c.createGain(),o=c.createOscillator();o.type=t;o.frequency.setValueAtTime(f,ts);gn.gain.setValueAtTime(0.0001,ts);gn.gain.linearRampToValueAtTime(g,ts+a);gn.gain.exponentialRampToValueAtTime(0.0001,ts+a+d);o.connect(gn);gn.connect(c.destination);o.start(ts);o.stop(ts+a+d+0.01);}
  function sweep(sf,ef,t,g,d,so=0){const c=ac(),ts=c.currentTime+so,gn=c.createGain(),o=c.createOscillator();o.type=t;o.frequency.setValueAtTime(sf,ts);o.frequency.exponentialRampToValueAtTime(ef,ts+d);gn.gain.setValueAtTime(0.0001,ts);gn.gain.linearRampToValueAtTime(g,ts+0.01);gn.gain.exponentialRampToValueAtTime(0.0001,ts+d);o.connect(gn);gn.connect(c.destination);o.start(ts);o.stop(ts+d+0.01);}
  function nb(cf,bw,g,d){const c=ac(),t=c.currentTime,buf=c.createBuffer(1,c.sampleRate*d,c.sampleRate),data=buf.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1);const src=c.createBufferSource();src.buffer=buf;const bpf=c.createBiquadFilter();bpf.type='bandpass';bpf.frequency.value=cf;bpf.Q.value=cf/bw;const gn=c.createGain();gn.gain.setValueAtTime(g,t);gn.gain.exponentialRampToValueAtTime(0.0001,t+d);src.connect(bpf);bpf.connect(gn);gn.connect(c.destination);src.start(t);src.stop(t+d);}
  const sounds={
    tick(){osc(2000,'sine',0.025,0.003,0.018);},
    click(){osc(800,'square',0.035,0.003,0.018);osc(400,'sine',0.04,0.003,0.05);},
    zoom(){sweep(200,800,'sine',0.08,0.5);sweep(300,1200,'sine',0.04,0.4,0.05);},
    land(){sweep(600,200,'sine',0.07,0.3);},
    orbit(){osc(1200,'sine',0.02,0.005,0.12);},
    type(){nb(3000,600,0.012,0.015);},
    del(){nb(2000,500,0.009,0.014);},
    success(){osc(440,'sine',0.055,0.01,0.09);osc(550,'sine',0.055,0.01,0.11,0.09);osc(660,'sine',0.05,0.01,0.17,0.18);}
  };
  return{play(n){if(!enabled||!sounds[n])return;try{sounds[n]();}catch(_){}},toggle(){enabled=!enabled;return enabled;},get isEnabled(){return enabled;}};
})();

/* ══════════════════════════════════════════════════
   GALAXY DEFINITIONS
══════════════════════════════════════════════════ */
const GALAXIES = [
  { id:'about',          label:'About Me',      color:'#22d3ee', cx:20,  cy:25  },
  { id:'skills',         label:'Skills',        color:'#4ade80', cx:74,  cy:20  },
  { id:'projects',       label:'Projects',      color:'#a78bfa', cx:70,  cy:60  },
  { id:'education',      label:'Education',     color:'#60a5fa', cx:16,  cy:68  },
  { id:'certifications', label:'Certifications',color:'#fbbf24', cx:46,  cy:82  },
  { id:'contact',        label:'Contact',       color:'#f472b6', cx:84,  cy:72  },
];

/* ══════════════════════════════════════════════════
   SOLAR SYSTEM DEFINITIONS
══════════════════════════════════════════════════ */
const SOLAR_SYSTEMS = {
  about:{starColor:'#22d3ee',starLabel:'SH',planets:[
    {id:'about-bio',   label:'Bio',     color:'#22d3ee',orbitR:130,orbitRY:56, speed:0.00012,sz:18,type:'bio'},
    {id:'about-stats', label:'Stats',   color:'#67e8f9',orbitR:195,orbitRY:84, speed:0.00009,sz:14,type:'stats'},
    {id:'about-photo', label:'Profile', color:'#a5f3fc',orbitR:262,orbitRY:112,speed:0.00007,sz:12,type:'photo'},
  ]},
  skills:{starColor:'#4ade80',starLabel:'</>',planets:[
    {id:'sk-soc',  label:'SOC',       color:'#4ade80',orbitR:120,orbitRY:52,speed:0.00011,sz:17,type:'skill-soc'},
    {id:'sk-off',  label:'Offensive', color:'#86efac',orbitR:182,orbitRY:78,speed:0.00009,sz:14,type:'skill-off'},
    {id:'sk-grc',  label:'GRC',       color:'#a7f3d0',orbitR:244,orbitRY:105,speed:0.00007,sz:13,type:'skill-grc'},
    {id:'sk-prog', label:'Programming',color:'#34d399',orbitR:305,orbitRY:131,speed:0.00005,sz:13,type:'skill-prog'},
    {id:'sk-cloud',label:'Cloud',     color:'#6ee7b7',orbitR:362,orbitRY:156,speed:0.00004,sz:11,type:'skill-cloud'},
    {id:'sk-fw',   label:'Frameworks',color:'#10b981',orbitR:416,orbitRY:179,speed:0.00003,sz:10,type:'skill-fw'},
  ]},
  projects:{starColor:'#a78bfa',starLabel:'{ }',planets:[
    {id:'threatweave',label:'ThreatWeave',color:'#4ade80',orbitR:125,orbitRY:54,speed:0.00014,sz:18,type:'project'},
    {id:'secureview', label:'SecureView', color:'#22d3ee',orbitR:190,orbitRY:82,speed:0.00010,sz:16,type:'project'},
    {id:'soc-lab',    label:'SOC Lab',   color:'#818cf8',orbitR:255,orbitRY:110,speed:0.00008,sz:15,type:'project'},
    {id:'ioc-hunter', label:'IOC Hunter',color:'#38bdf8',orbitR:318,orbitRY:137,speed:0.00006,sz:13,type:'project'},
    {id:'nist-csf',   label:'NIST CSF',  color:'#c084fc',orbitR:378,orbitRY:163,speed:0.00005,sz:12,type:'project'},
    {id:'aws-arch',   label:'AWS Arch',  color:'#fbbf24',orbitR:435,orbitRY:187,speed:0.00004,sz:11,type:'project'},
  ]},
  education:{starColor:'#60a5fa',starLabel:'EDU',planets:[
    {id:'edu-coventry',label:'BSc Hacking & Cyber',color:'#60a5fa',orbitR:140,orbitRY:60,speed:0.00010,sz:19,type:'edu-coventry'},
    {id:'edu-bmet',    label:'BTEC Level 3 IT',  color:'#93c5fd',orbitR:220,orbitRY:95,speed:0.00007,sz:15,type:'edu-bmet'},
  ]},
  certifications:{starColor:'#fbbf24',starLabel:'CC',planets:[
    {id:'cert-isc2',  label:'ISC2 CC',   color:'#fbbf24',orbitR:140,orbitRY:60,speed:0.00009,sz:19,type:'cert-isc2'},
    {id:'cert-future',label:'Future',    color:'#fde68a',orbitR:220,orbitRY:95,speed:0.00006,sz:14,type:'cert-future'},
  ]},
  contact:{starColor:'#f472b6',starLabel:'@',planets:[
    {id:'ct-email',   label:'Email',    color:'#f472b6',orbitR:120,orbitRY:52,speed:0.00012,sz:16,type:'contact-email'},
    {id:'ct-github',  label:'GitHub',   color:'#e879f9',orbitR:180,orbitRY:78,speed:0.00009,sz:14,type:'contact-github'},
    {id:'ct-linkedin',label:'LinkedIn', color:'#d946ef',orbitR:240,orbitRY:103,speed:0.00007,sz:13,type:'contact-linkedin'},
    {id:'ct-form',    label:'Message',  color:'#c026d3',orbitR:298,orbitRY:128,speed:0.00005,sz:12,type:'contact-form'},
  ]},
};

/* ══════════════════════════════════════════════════
   SPACE BACKGROUND CANVAS
══════════════════════════════════════════════════ */
let stars = [], nebulae = [];
let bgCanvas, bgCtx, bgW, bgH;

function initSpaceBackground() {
  bgCanvas = document.getElementById('space-bg');
  if (!bgCanvas) return;
  bgCtx = bgCanvas.getContext('2d');
  bgCtx.imageSmoothingEnabled = false;

  function resize() {
    /* render at HALF resolution for pixelated look */
    bgW = Math.floor(window.innerWidth  / 2);
    bgH = Math.floor(window.innerHeight / 2);
    bgCanvas.width  = bgW;
    bgCanvas.height = bgH;
    bgCanvas.style.width  = '100vw';
    bgCanvas.style.height = '100vh';
    buildStars();
    buildNebulae();
  }

  function buildStars() {
    stars = [];
    const count = Math.floor(bgW * bgH / 18);
    for (let i = 0; i < count; i++) {
      const r = Math.random();
      stars.push({
        x:    Math.random() * bgW | 0,
        y:    Math.random() * bgH | 0,
        sz:   r < 0.85 ? 1 : r < 0.97 ? 2 : 3,
        a:    0.2 + Math.random() * 0.8,
        col:  r < 0.7 ? 255 : r < 0.85 ? 220 : 180,
        blue: r < 0.7 ? 255 : r < 0.85 ? 240 : 200,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.008 + Math.random() * 0.025,
      });
    }
  }

  function buildNebulae() {
    nebulae = [];
    const NEBULA_COLORS = [
      [109,40,217], [6,182,212], [124,58,237], [15,118,110], [147,51,234]
    ];
    for (let i = 0; i < 8; i++) {
      const col = NEBULA_COLORS[i % NEBULA_COLORS.length];
      nebulae.push({
        x: Math.random() * bgW,
        y: Math.random() * bgH,
        rx: 30 + Math.random() * 80,
        ry: 20 + Math.random() * 50,
        col, a: 0.04 + Math.random() * 0.08,
      });
    }
  }

  let t = 0;
  function drawBg() {
    t++;
    bgCtx.fillStyle = '#020817';
    bgCtx.fillRect(0, 0, bgW, bgH);

    /* Nebulae */
    nebulae.forEach(n => {
      const grad = bgCtx.createRadialGradient(n.x, n.y, 0, n.x, n.y, Math.max(n.rx, n.ry));
      grad.addColorStop(0,   `rgba(${n.col.join(',')},${n.a})`);
      grad.addColorStop(0.5, `rgba(${n.col.join(',')},${n.a * 0.5})`);
      grad.addColorStop(1,   'rgba(0,0,0,0)');
      bgCtx.save();
      bgCtx.scale(1, n.ry / n.rx);
      bgCtx.fillStyle = grad;
      bgCtx.beginPath();
      bgCtx.arc(n.x, n.y * (n.rx / n.ry), n.rx, 0, Math.PI * 2);
      bgCtx.fill();
      bgCtx.restore();
    });

    /* Stars */
    stars.forEach(s => {
      s.twinkle += s.twinkleSpeed;
      const alpha = s.a * (0.6 + Math.sin(s.twinkle) * 0.4);
      bgCtx.fillStyle = `rgba(${s.col},${s.col},${s.blue},${alpha})`;
      bgCtx.fillRect(s.x, s.y, s.sz, s.sz);
    });

    requestAnimationFrame(drawBg);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(drawBg);
}

/* ══════════════════════════════════════════════════
   GALAXY MINI-CANVAS RENDERING
══════════════════════════════════════════════════ */
const galaxyPoints = {}; /* pre-computed spiral points per galaxy id */

function buildGalaxyPoints(id, color) {
  const pts = [];
  const N = 200;
  for (let i = 0; i < N; i++) {
    const t   = i / N;
    const ang = t * Math.PI * 7 + (Math.random() - 0.5) * 0.5;
    const r   = Math.pow(t, 0.75) * 26;
    const sc  = (Math.random() - 0.5) * 5;
    pts.push({
      x: Math.round(30 + Math.cos(ang) * r + sc),
      y: Math.round(30 + (Math.sin(ang) * r + sc) * 0.5),
      a: (1 - t * 0.55) * (0.5 + Math.random() * 0.5),
    });
  }
  /* bright core */
  for (let i = 0; i < 25; i++) {
    const rr = Math.random() * 4, aa = Math.random() * Math.PI * 2;
    pts.push({ x: Math.round(30 + Math.cos(aa) * rr), y: Math.round(30 + Math.sin(aa) * rr * 0.5), a: 0.85 + Math.random() * 0.15 });
  }
  galaxyPoints[id] = { pts, color };
}

function renderGalaxyMini(canvas, gid, rotOffset) {
  const gc = canvas.getContext('2d');
  gc.imageSmoothingEnabled = false;
  gc.clearRect(0, 0, 60, 60);

  const data = galaxyPoints[gid];
  if (!data) return;

  /* parse hex color */
  const hex = data.color.replace('#','');
  const r = parseInt(hex.slice(0,2),16);
  const g = parseInt(hex.slice(2,4),16);
  const b = parseInt(hex.slice(4,6),16);

  gc.save();
  gc.translate(30, 30);
  gc.rotate(rotOffset);
  gc.translate(-30, -30);

  data.pts.forEach(p => {
    gc.fillStyle = `rgba(${r},${g},${b},${p.a})`;
    gc.fillRect(p.x, p.y, 1, 1);
  });
  gc.restore();

  /* white core dot */
  gc.fillStyle = `rgba(255,255,255,0.9)`;
  gc.fillRect(29, 29, 2, 2);
}

/* Galaxy rotation angles */
const galaxyRot = {};

function initGalaxies() {
  GALAXIES.forEach(g => {
    buildGalaxyPoints(g.id, g.color);
    galaxyRot[g.id] = Math.random() * Math.PI * 2;
  });

  /* Initial render */
  GALAXIES.forEach(g => {
    const node = document.getElementById(`gnode-${g.id}`);
    if (!node) return;
    node.style.setProperty('--gcolor', g.color);
    const mc = node.querySelector('.gcanvas');
    if (mc) renderGalaxyMini(mc, g.id, galaxyRot[g.id]);
  });

  /* Slow rotation animation */
  (function rotateGalaxies() {
    GALAXIES.forEach(g => {
      galaxyRot[g.id] += 0.002;
      const node = document.getElementById(`gnode-${g.id}`);
      if (!node) return;
      const mc = node.querySelector('.gcanvas');
      if (mc) renderGalaxyMini(mc, g.id, galaxyRot[g.id]);
    });
    requestAnimationFrame(rotateGalaxies);
  })();
}

/* Draw constellation lines between center and each galaxy */
function drawConstellationLines() {
  const svg = document.getElementById('constellation-svg');
  if (!svg) return;
  svg.innerHTML = '';
  const vw = window.innerWidth, vh = window.innerHeight;
  const cx = vw / 2, cy = vh / 2;

  GALAXIES.forEach(g => {
    const gx = g.cx / 100 * vw;
    const gy = g.cy / 100 * vh;
    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1', cx); line.setAttribute('y1', cy);
    line.setAttribute('x2', gx); line.setAttribute('y2', gy);
    line.setAttribute('stroke', `rgba(255,255,255,0.06)`);
    line.setAttribute('stroke-width', '1');
    line.setAttribute('stroke-dasharray', '4 8');
    svg.appendChild(line);
  });
}

/* ══════════════════════════════════════════════════
   TYPING ENGINE
══════════════════════════════════════════════════ */
function initTyping() {
  const el = document.getElementById('typing-target');
  if (!el) return;
  const titles = ['Junior SOC Analyst','GRC Analyst','Cyber Threat Intel','Detection Engineer','Blue Teamer'];
  let idx=0,ci=0,del=false;
  function tick(){
    const cur=titles[idx];
    if(del){ci--;el.textContent=cur.slice(0,ci);SoundEngine.play('type');if(ci===0){del=false;idx=(idx+1)%titles.length;setTimeout(tick,380);return;}setTimeout(tick,40);}
    else{ci++;el.textContent=cur.slice(0,ci);SoundEngine.play('type');if(ci===cur.length){del=true;setTimeout(tick,2200);return;}setTimeout(tick,80);}
  }
  setTimeout(tick,1200);
}

/* ══════════════════════════════════════════════════
   SOLAR SYSTEM
══════════════════════════════════════════════════ */
let currentSystem = null;
let planetAngles  = {};
let orbitRafId    = null;

function openSolarSystem(galaxyId) {
  SoundEngine.play('zoom');
  const sys = SOLAR_SYSTEMS[galaxyId];
  const gal = GALAXIES.find(g => g.id === galaxyId);
  if (!sys || !gal) return;

  /* Zoom out the space map */
  const map = document.getElementById('space-map');
  map.classList.add('zooming');

  setTimeout(() => {
    currentSystem = { ...sys, galaxyId };
    const ss = document.getElementById('solar-system');

    /* Set star */
    const starBody  = document.getElementById('ss-star-body');
    const starLabel = document.getElementById('ss-star-label');
    const galName   = document.getElementById('ss-galaxy-name');
    starBody.style.background = sys.starColor;
    starBody.style.color      = sys.starColor;
    starLabel.textContent = sys.starLabel;
    starLabel.style.color = sys.starColor;
    galName.textContent   = gal.label.toUpperCase();

    /* Build planet nodes */
    const container = document.getElementById('ss-planets');
    container.innerHTML = '';
    planetAngles = {};

    sys.planets.forEach((p, i) => {
      planetAngles[p.id] = (i / sys.planets.length) * Math.PI * 2;
      const div = document.createElement('div');
      div.className = 'planet-node';
      div.id = `planet-${p.id}`;
      div.style.color = p.color;
      div.innerHTML = `<div class="planet-body" style="width:${p.sz}px;height:${p.sz}px;color:${p.color}"></div><span class="planet-label">${p.label}</span>`;
      div.addEventListener('click', () => onPlanetClick(p));
      div.addEventListener('mouseenter', () => SoundEngine.play('orbit'));
      container.appendChild(div);
    });

    /* Draw orbit rings */
    drawOrbitRings(sys.planets);

    ss.classList.remove('ss-hidden');
    SoundEngine.play('land');

    /* Start orbit animation */
    if (orbitRafId) cancelAnimationFrame(orbitRafId);
    animatePlanets();
  }, 650);
}

function drawOrbitRings(planets) {
  const oc = document.getElementById('orbit-canvas');
  if (!oc) return;
  const ctx = oc.getContext('2d');
  oc.width  = window.innerWidth;
  oc.height = window.innerHeight;
  ctx.imageSmoothingEnabled = false;
  const cx = oc.width / 2, cy = oc.height / 2;

  planets.forEach(p => {
    ctx.beginPath();
    ctx.ellipse(cx, cy, p.orbitR, p.orbitRY, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255,255,255,0.07)`;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 6]);
    ctx.stroke();
  });
}

function animatePlanets() {
  if (!currentSystem) return;
  const ss = document.getElementById('solar-system');
  if (!ss || ss.classList.contains('ss-hidden')) return;

  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;

  currentSystem.planets.forEach(p => {
    planetAngles[p.id] = (planetAngles[p.id] || 0) + p.speed * 16;
    const x = cx + Math.cos(planetAngles[p.id]) * p.orbitR;
    const y = cy + Math.sin(planetAngles[p.id]) * p.orbitRY;
    const el = document.getElementById(`planet-${p.id}`);
    if (el) { el.style.left = x + 'px'; el.style.top = y + 'px'; }
  });

  orbitRafId = requestAnimationFrame(animatePlanets);
}

function closeSolarSystem() {
  SoundEngine.play('zoom');
  const ss  = document.getElementById('solar-system');
  const map = document.getElementById('space-map');
  if (orbitRafId) { cancelAnimationFrame(orbitRafId); orbitRafId = null; }
  ss.classList.add('ss-hidden');
  map.classList.remove('zooming');
  currentSystem = null;
  closePanel();
}

/* ══════════════════════════════════════════════════
   PLANET CLICK → CONTENT PANEL
══════════════════════════════════════════════════ */
function onPlanetClick(planet) {
  SoundEngine.play('click');
  if (planet.type === 'project') {
    openProjectModal(planet.id);
  } else {
    openPanel(planet.type, planet.id);
  }
}

function openPanel(type, id) {
  const panel = document.getElementById('content-panel');
  const body  = document.getElementById('panel-body');
  body.innerHTML = buildPanelContent(type, id);
  panel.classList.add('open');
  /* Init countdown if cert panel */
  if (type === 'cert-isc2') initCountdownInPanel();
  /* Init contact form if that panel */
  if (type === 'contact-form') initPanelForm();
}

function closePanel() {
  const panel = document.getElementById('content-panel');
  panel.classList.remove('open');
}

function buildPanelContent(type) {
  switch(type) {
    case 'bio': return `
      <p class="panel-label">// about</p>
      <h2 class="panel-title">Shadman Hossain</h2>
      <div class="terminal-win">
        <div class="t-bar"><span class="t-d r"></span><span class="t-d y"></span><span class="t-d g"></span><span class="t-title-bar">shadman@portfolio:~</span></div>
        <p class="t-line"><span class="t-prompt">&gt;</span> Final-year <span class="t-hl">BSc Ethical Hacking &amp; Cyber Security</span> at Coventry University.</p>
        <p class="t-line"><span class="t-prompt">&gt;</span> On track for First-Class Honours. Current average: <span class="t-hl">76.67%</span>. Research project: 87%.</p>
        <p class="t-line"><span class="t-prompt">&gt;</span> Blue team detection engineering, GRC compliance, and AI-augmented security tools in Python and Go.</p>
        <p class="t-line"><span class="t-prompt">&gt;</span> Preparing for <span class="t-hl">ISC2 CC</span> (June 2026). Seeking junior SOC / GRC roles in the UK.</p>
      </div>
      <div class="panel-section">
        <p class="panel-sh">Location</p>
        <p class="panel-text"><i class="fas fa-location-dot" style="color:#22d3ee;margin-right:0.4rem"></i>Coventry, UK</p>
      </div>`;

    case 'stats': return `
      <p class="panel-label">// statistics</p>
      <h2 class="panel-title">Academic &amp; Project Stats</h2>
      <div class="stats-row">
        <div class="stat-box"><div class="stat-val">76.67<span style="font-size:0.5em">%</span></div><div class="stat-key">Current Avg</div></div>
        <div class="stat-box"><div class="stat-val">87<span style="font-size:0.5em">%</span></div><div class="stat-key">Research</div></div>
        <div class="stat-box"><div class="stat-val">5</div><div class="stat-key">GH Projects</div></div>
      </div>
      <div class="panel-section">
        <p class="panel-sh">Key Modules</p>
        <div class="edu-tags" style="display:flex;flex-wrap:wrap;gap:0.4rem">
          <span style="font-family:var(--font-mono);font-size:0.7rem;padding:0.2rem 0.5rem;background:rgba(34,211,238,0.07);border:1px solid rgba(34,211,238,0.22);color:var(--cyan)">Digital Security Risk — 73%</span>
          <span style="font-family:var(--font-mono);font-size:0.7rem;padding:0.2rem 0.5rem;background:rgba(34,211,238,0.07);border:1px solid rgba(34,211,238,0.22);color:var(--cyan)">Applied Cryptography — 75%</span>
          <span style="font-family:var(--font-mono);font-size:0.7rem;padding:0.2rem 0.5rem;background:rgba(34,211,238,0.07);border:1px solid rgba(34,211,238,0.22);color:var(--cyan)">Advanced Pen Testing — 71%</span>
          <span style="font-family:var(--font-mono);font-size:0.7rem;padding:0.2rem 0.5rem;background:rgba(34,211,238,0.07);border:1px solid rgba(34,211,238,0.22);color:var(--cyan)">Research Project — 87%</span>
        </div>
      </div>`;

    case 'photo': return `
      <p class="panel-label">// profile</p>
      <h2 class="panel-title">Shadman Hossain</h2>
      <div style="display:flex;justify-content:center;margin:1rem 0">
        <img src="../assets/profile.jpg" alt="Shadman Hossain" onerror="this.style.display='none'" style="width:160px;height:160px;object-fit:cover;image-rendering:pixelated;border:2px solid rgba(34,211,238,0.3);display:block" />
      </div>
      <p class="panel-text" style="text-align:center">Coventry, UK · BSc Ethical Hacking &amp; Cyber Security</p>`;

    case 'skill-soc': return buildSkillPanel('SOC &amp; Detection','#4ade80',['SIEM','Wazuh','ELK Stack','Splunk','Sigma Rules','MITRE ATT&CK','Log Analysis','Incident Triage']);
    case 'skill-off': return buildSkillPanel('Offensive / Pen-test','#86efac',['Kali Linux','Nmap','Burp Suite','Metasploit','Wireshark','OSINT','Vuln Assessment']);
    case 'skill-grc': return buildSkillPanel('GRC &amp; Compliance','#a7f3d0',['NIST CSF 2.0','ISO 27001','UK GDPR','Threat Modelling','Risk Assessment','Supplier Due Diligence','Audit Management']);
    case 'skill-prog':return buildSkillPanel('Programming &amp; Automation','#34d399',['Python','Go','Bash','TypeScript','Playwright','pytest','Web Scraping']);
    case 'skill-cloud':return buildSkillPanel('Cloud &amp; Infrastructure','#6ee7b7',['AWS S3','AWS IAM','AWS EC2','Linux Admin','Windows AD']);
    case 'skill-fw':  return buildSkillPanel('Frameworks','#10b981',['MITRE ATT&CK','OWASP Top 10','Cyber Kill Chain','NIST RMF','STRIDE']);

    case 'edu-coventry': return `
      <p class="panel-label">// education</p>
      <h2 class="panel-title">Coventry University</h2>
      <div class="edu-card">
        <div class="edu-year">Sep 2023 – Jul 2026</div>
        <div class="edu-deg">BSc (Hons) Ethical Hacking &amp; Cyber Security</div>
        <div class="edu-inst"><i class="fas fa-graduation-cap"></i> Coventry University</div>
        <div class="edu-grade">Expected First-Class · Average: <span style="color:#60a5fa">76.67%</span></div>
        <div class="edu-tags">
          <span>Digital Security Risk — 73%</span><span>Security Operations — 67%</span>
          <span>Info Security Management — 70%</span><span>Applied Cryptography — 75%</span>
          <span>Advanced Pen Testing — 71%</span><span>Research Project — 87%</span>
        </div>
      </div>`;

    case 'edu-bmet': return `
      <p class="panel-label">// education</p>
      <h2 class="panel-title">Birmingham Metropolitan College</h2>
      <div class="edu-card">
        <div class="edu-year">Sep 2020 – Jul 2022</div>
        <div class="edu-deg">BTEC Level 3 National Diploma in IT</div>
        <div class="edu-inst"><i class="fas fa-graduation-cap"></i> Birmingham Metropolitan College</div>
        <div class="edu-grade"><span style="color:#93c5fd">Double Distinction Merit</span></div>
        <div class="edu-tags">
          <span>IT Project Management — Distinction</span><span>Programming — Distinction</span>
          <span>Mobile Apps — Distinction</span><span>Cyber Security &amp; Incident Management</span>
        </div>
      </div>`;

    case 'cert-isc2': return `
      <p class="panel-label">// certifications</p>
      <h2 class="panel-title">ISC2 — Certified in Cybersecurity</h2>
      <div class="cert-card">
        <i class="fas fa-shield-halved cert-icon"></i>
        <div>
          <p class="cert-issuer">ISC2</p>
          <p class="cert-name">Certified in Cybersecurity (CC)</p>
          <p class="cert-desc">Vendor-neutral security certification covering risk management, network security, operations, and access controls.</p>
          <div class="cert-countdown">
            <span class="cd-lbl">Exam in</span>
            <div class="cd-units">
              <div class="cd-unit"><span class="cd-v" id="cd-days">--</span><span class="cd-k">days</span></div>
              <span class="cd-sep">:</span>
              <div class="cd-unit"><span class="cd-v" id="cd-hrs">--</span><span class="cd-k">hrs</span></div>
              <span class="cd-sep">:</span>
              <div class="cd-unit"><span class="cd-v" id="cd-min">--</span><span class="cd-k">min</span></div>
            </div>
          </div>
          <div class="cert-status"><span class="sdot"></span>Exam Scheduled — 11 June 2026</div>
        </div>
      </div>`;

    case 'cert-future': return `
      <p class="panel-label">// certifications</p>
      <h2 class="panel-title">Future Certifications</h2>
      <div class="cert-card" style="border-color:rgba(255,255,255,0.06)">
        <i class="fas fa-plus cert-icon" style="color:var(--muted);text-shadow:none"></i>
        <div>
          <p class="cert-issuer" style="color:var(--muted)">Future</p>
          <p class="cert-name">More Certifications Coming</p>
          <p class="cert-desc">Continuing professional development in SOC operations, threat hunting, and GRC disciplines post-graduation.</p>
          <div class="cert-status" style="color:var(--muted);background:rgba(255,255,255,0.03);border-color:rgba(255,255,255,0.06)"><span class="sdot" style="background:var(--muted);animation:none"></span>Planned — Post-Graduation 2026</div>
        </div>
      </div>`;

    case 'contact-email': return `
      <p class="panel-label">// contact</p>
      <h2 class="panel-title">Email</h2>
      <a href="mailto:sm.shadman.hossain@gmail.com" class="contact-method" style="display:flex">
        <i class="fas fa-envelope cm-icon"></i>
        <div class="cm-detail"><span class="cm-type">Email</span><span class="cm-val">sm.shadman.hossain@gmail.com</span></div>
      </a>`;

    case 'contact-github': return `
      <p class="panel-label">// contact</p>
      <h2 class="panel-title">GitHub</h2>
      <a href="https://github.com/shaddiegit" target="_blank" rel="noopener" class="contact-method" style="display:flex">
        <i class="fab fa-github cm-icon"></i>
        <div class="cm-detail"><span class="cm-type">GitHub</span><span class="cm-val">github.com/shaddiegit</span></div>
      </a>`;

    case 'contact-linkedin': return `
      <p class="panel-label">// contact</p>
      <h2 class="panel-title">LinkedIn</h2>
      <a href="https://www.linkedin.com/in/shadman-hossain1206" target="_blank" rel="noopener" class="contact-method" style="display:flex">
        <i class="fab fa-linkedin-in cm-icon"></i>
        <div class="cm-detail"><span class="cm-type">LinkedIn</span><span class="cm-val">linkedin.com/in/shadman-hossain1206</span></div>
      </a>`;

    case 'contact-form': return `
      <p class="panel-label">// contact</p>
      <h2 class="panel-title">Send a Message</h2>
      <p style="font-size:0.88rem;color:rgba(226,232,240,0.7);margin-bottom:0.5rem">Open to SOC Analyst, GRC Analyst, and CTI roles in the UK.</p>
      <form class="mini-form" id="panel-contact-form" novalidate>
        <div><label>Name</label><input type="text" id="pf-name" placeholder="Your name" required /></div>
        <div><label>Email</label><input type="email" id="pf-email" placeholder="your@email.com" required /></div>
        <div><label>Subject</label><input type="text" id="pf-subject" placeholder="Job opportunity / Collaboration" required /></div>
        <div><label>Message</label><textarea id="pf-msg" rows="4" placeholder="Your message..." required></textarea></div>
        <button type="submit"><i class="fas fa-paper-plane"></i>&nbsp; TRANSMIT</button>
        <p class="form-status-text" id="pf-status"></p>
      </form>`;

    default: return `<p class="panel-label">// ${type}</p><p class="panel-text">Content loading...</p>`;
  }
}

function buildSkillPanel(title, color, tags) {
  const tagsHtml = tags.map(t =>
    `<span style="font-family:var(--font-mono);font-size:0.7rem;padding:0.22rem 0.55rem;background:rgba(${hexToRgb(color)},0.07);border:1px solid rgba(${hexToRgb(color)},0.25);color:${color}">${t}</span>`
  ).join('');
  return `
    <p class="panel-label">// skills</p>
    <h2 class="panel-title">${title}</h2>
    <div class="skill-tags">${tagsHtml}</div>`;
}

function hexToRgb(hex) {
  const h = hex.replace('#','');
  return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)].join(',');
}

/* ══════════════════════════════════════════════════
   PROJECT MODAL
══════════════════════════════════════════════════ */
function openProjectModal(id) {
  const d = PROJECTS[id]; if (!d) return;
  const overlay = document.getElementById('modal-overlay');
  const elIconWrap=document.getElementById('modal-icon-wrap'),elIcon=document.getElementById('modal-icon');
  const elCat=document.getElementById('modal-category-label'),elTitle=document.getElementById('modal-title');
  const elDesc=document.getElementById('modal-description');
  const elHighWrap=document.getElementById('modal-highlights-wrap'),elHighList=document.getElementById('modal-highlights');
  const elTechWrap=document.getElementById('modal-tech-wrap'),elTechPills=document.getElementById('modal-tech-pills');
  const elMitreWrap=document.getElementById('modal-mitre-wrap'),elMitreGrid=document.getElementById('modal-mitre-grid');
  const elNote=document.getElementById('modal-note'),elNoteText=document.getElementById('modal-note-text');
  const elActions=document.getElementById('modal-actions');

  elIcon.className=d.icon; elCat.textContent=d.category; elTitle.textContent=d.title; elDesc.textContent=d.description;
  elHighList.innerHTML=d.highlights.map(h=>`<li>${h}</li>`).join(''); elHighWrap.style.display=d.highlights.length?'':'none';
  elTechPills.innerHTML=d.tech.map(t=>`<span class="tech-pill">${t}</span>`).join(''); elTechWrap.style.display=d.tech.length?'':'none';
  if(d.mitre.length){elMitreGrid.innerHTML=d.mitre.map(m=>`<span class="modal-mitre-item">${m.id} — ${m.name}</span>`).join('');elMitreWrap.style.display='';}else{elMitreWrap.style.display='none';}
  if(d.note){elNoteText.innerHTML=d.note;elNote.style.display='flex';}else{elNote.style.display='none';}
  elActions.innerHTML='';
  if(d.github){const a=document.createElement('a');a.href=d.github;a.target='_blank';a.rel='noopener';a.className='btn-github';a.innerHTML='<i class="fab fa-github"></i> View on GitHub';elActions.appendChild(a);}
  else{const p=document.createElement('p');p.style.cssText='font-family:var(--font-mono);font-size:0.8rem;color:var(--muted)';p.textContent='// No public repository.';elActions.appendChild(p);}

  SoundEngine.play('click');
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden','false');
  document.body.classList.add('no-scroll');
  setTimeout(()=>document.getElementById('modal-close').focus(),80);
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('open'); overlay.setAttribute('aria-hidden','true');
  document.body.classList.remove('no-scroll');
}

/* ══════════════════════════════════════════════════
   COUNTDOWN (ISC2 exam)
══════════════════════════════════════════════════ */
function initCountdownInPanel() {
  const exam = new Date('2026-06-11T09:00:00');
  function update() {
    const now=new Date(), diff=exam-now;
    if(diff<=0)return;
    const d=Math.floor(diff/864e5), h=Math.floor((diff%864e5)/36e5), m=Math.floor((diff%36e5)/6e4);
    const dEl=document.getElementById('cd-days'), hEl=document.getElementById('cd-hrs'), mEl=document.getElementById('cd-min');
    if(dEl)dEl.textContent=String(d).padStart(2,'0');
    if(hEl)hEl.textContent=String(h).padStart(2,'0');
    if(mEl)mEl.textContent=String(m).padStart(2,'0');
  }
  update();
  setInterval(update,30000);
}

/* ══════════════════════════════════════════════════
   PANEL CONTACT FORM
══════════════════════════════════════════════════ */
function initPanelForm() {
  const form = document.getElementById('panel-contact-form');
  const statusEl = document.getElementById('pf-status');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const n=form.querySelector('#pf-name'), em=form.querySelector('#pf-email');
    const s=form.querySelector('#pf-subject'), m=form.querySelector('#pf-msg');
    let ok=true;
    [n,em,s,m].forEach(el=>{el.classList.remove('invalid');if(!el.value.trim()){el.classList.add('invalid');ok=false;}});
    if(!ok){statusEl.textContent='// Fill in all fields.';statusEl.className='form-status-text err';return;}
    const body=`Name: ${n.value}\nEmail: ${em.value}\n\n${m.value}`;
    window.location.href=`mailto:sm.shadman.hossain@gmail.com?subject=${encodeURIComponent(s.value)}&body=${encodeURIComponent(body)}`;
    SoundEngine.play('success');
    statusEl.textContent='// Transmission initiated...';statusEl.className='form-status-text ok';
    setTimeout(()=>{form.reset();statusEl.textContent='';statusEl.className='form-status-text';},4000);
  });
}

/* ══════════════════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════════════════ */
function initCursor() {
  const dot=document.getElementById('cursor-dot'), ring=document.getElementById('cursor-ring');
  if(!dot||!ring||window.matchMedia('(pointer:coarse)').matches)return;
  let mx=-100,my=-100,rx=mx,ry=my;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';});
  (function lerp(){rx+=(mx-rx)*0.13;ry+=(my-ry)*0.13;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(lerp);})();
  document.querySelectorAll('a,button,.galaxy-node,.planet-node').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
  });
}

/* ══════════════════════════════════════════════════
   BOOT SEQUENCE
══════════════════════════════════════════════════ */
function initBootSequence() {
  const screen=document.getElementById('boot-screen');
  if(!screen)return;
  if(sessionStorage.getItem('sh-booted-v3')){screen.style.display='none';return;}

  document.body.style.overflow='hidden';
  const logEl=document.getElementById('boot-log'), barEl=document.getElementById('boot-bar'), status=document.getElementById('boot-status');

  /* Boot starfield mini */
  const bc=document.getElementById('boot-canvas');
  if(bc){
    const bctx=bc.getContext('2d');bc.width=window.innerWidth/2|0;bc.height=window.innerHeight/2|0;
    bc.style.width='100vw';bc.style.height='100vh';
    const bstars=Array.from({length:Math.floor(bc.width*bc.height/12)},()=>({x:Math.random()*bc.width|0,y:Math.random()*bc.height|0,a:0.2+Math.random()*0.8}));
    (function bf(){bctx.fillStyle='#020817';bctx.fillRect(0,0,bc.width,bc.height);bstars.forEach(s=>{bctx.fillStyle=`rgba(255,255,255,${s.a})`;bctx.fillRect(s.x,s.y,1,1);});requestAnimationFrame(bf);})();
  }

  const LINES=[
    {text:'[ OK ]  Calibrating star charts',cls:'boot-ok'},
    {text:'[ OK ]  Loading galaxy coordinates',cls:'boot-ok'},
    {text:'[ OK ]  Computing orbital mechanics',cls:'boot-ok'},
    {text:'[ OK ]  Initialising MITRE ATT&CK database',cls:'boot-ok'},
    {text:'[ WARN] cv.pdf not found — download disabled',cls:'boot-warn'},
    {text:'[ OK ]  Space-time continuum stable',cls:'boot-ok'},
    {text:'[ OK ]  Portfolio universe ready. Engage.',cls:'boot-info'},
  ];

  setTimeout(()=>{if(barEl)barEl.style.width='100%';},60);
  LINES.forEach((l,i)=>setTimeout(()=>{
    if(!logEl)return;
    const d=document.createElement('div');d.className='boot-line';
    d.innerHTML=`<span class="${l.cls}">${l.text}</span>`;logEl.appendChild(d);
  },260+i*300));

  const at=260+LINES.length*300+340;
  setTimeout(()=>{
    if(status)status.textContent='LAUNCH SEQUENCE COMPLETE';
    setTimeout(()=>{
      screen.classList.add('fade-out');
      document.body.style.overflow='';
      setTimeout(()=>{screen.style.display='none';},750);
    },420);
  },at);

  sessionStorage.setItem('sh-booted-v3','1');
}

/* ══════════════════════════════════════════════════
   GALAXY NODE INTERACTIONS
══════════════════════════════════════════════════ */
function initGalaxyInteractions() {
  GALAXIES.forEach(g => {
    const node = document.getElementById(`gnode-${g.id}`);
    if (!node) return;
    node.addEventListener('click', () => openSolarSystem(g.id));
    node.addEventListener('mouseenter', () => SoundEngine.play('tick'));
  });

  document.getElementById('ss-back').addEventListener('click', closeSolarSystem);
  document.getElementById('panel-close').addEventListener('click', closePanel);

  const modalClose=document.getElementById('modal-close');
  const modalOverlay=document.getElementById('modal-overlay');
  if(modalClose)modalClose.addEventListener('click',closeModal);
  if(modalOverlay)modalOverlay.addEventListener('click',e=>{if(e.target===modalOverlay)closeModal();});
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      if(modalOverlay&&modalOverlay.classList.contains('open'))closeModal();
      else if(document.getElementById('content-panel').classList.contains('open'))closePanel();
      else closeSolarSystem();
    }
  });
}

/* ══════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initBootSequence();
  initSpaceBackground();
  initGalaxies();
  drawConstellationLines();
  initCursor();
  initTyping();
  initGalaxyInteractions();
  window.addEventListener('resize', drawConstellationLines);
});
