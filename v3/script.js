'use strict';

/* ══════════════════════════════════════════════════
   PROJECT DATA
══════════════════════════════════════════════════ */
const PROJECTS = {
  threatweave:{title:'ThreatWeave',category:'Threat Intelligence / CTI',icon:'fas fa-brain',iconClass:'green-icon',
    description:'AI-powered IOC correlation engine in Go. Clusters indicators by ASN, temporal proximity, and MITRE ATT&CK tactics. Generates professional CTI analyst narratives via Claude AI.',
    highlights:['Threat clustering by shared ASN, temporal proximity, and MITRE tactics','AI-generated threat actor profiles via Claude API','Automated Markdown report export','Static Go binary — no runtime dependencies','MIT licensed'],
    tech:['Go','Claude AI API','MITRE ATT&CK','Goroutines','CTI'],
    mitre:[{id:'T1071',name:'Application Layer Protocol'},{id:'T1041',name:'Exfiltration Over C2'},{id:'T1190',name:'Exploit Public-Facing App'}],
    github:'https://github.com/shaddiegit/threatweave',note:null},
  secureview:{title:'SecureView',category:'SOC Dashboard / Blue Team',icon:'fas fa-desktop',iconClass:'cyan-icon',
    description:'Full-stack SOC analyst dashboard with live alert queue, AI-powered triage via Claude API, automated incident reports, and 17 unit tests.',
    highlights:['Live alert queue with 5 realistic security scenarios','Claude API for AI-driven risk scoring and MITRE mapping','Automated incident reports with executive summaries','17 unit tests (Vitest)'],
    tech:['TypeScript','React','Vite','Claude AI API','Vitest'],
    mitre:[{id:'T1059',name:'Command and Scripting Interpreter'},{id:'T1055',name:'Process Injection'}],
    github:'https://github.com/shaddiegit/secureview',note:'Run: npm install && npm run dev. Needs Anthropic API key.'},
  'soc-lab':{title:'SOC Detection Lab',category:'Blue Team / Detection Engineering',icon:'fas fa-shield-halved',iconClass:'green-icon',
    description:'4-stage intrusion simulation with Sigma-compatible YAML rules for Wazuh. Full pytest validation suite.',
    highlights:['4-stage kill chain from single threat actor IP','Sigma YAML rules covering full attack sequence','pytest true/false-positive validation','Wazuh-compatible deployment'],
    tech:['Python','Sigma YAML','Wazuh','pytest','Linux Auth Logs'],
    mitre:[{id:'T1110.001',name:'Password Guessing'},{id:'T1548.003',name:'Sudo Caching'},{id:'T1041',name:'Exfiltration'}],
    github:'https://github.com/shaddiegit/soc-detection-lab',note:null},
  'ioc-hunter':{title:'IOC Hunter',category:'Threat Intelligence / CLI Tool',icon:'fas fa-magnifying-glass',iconClass:'cyan-icon',
    description:'Multi-source IOC lookup CLI querying ThreatFox, URLhaus, AbuseIPDB, and VirusTotal concurrently. 19 security tests, CI/SOAR compatible.',
    highlights:['Concurrent 4-feed threat intel queries','Auto-detects IOC type','Security hardening against injection attacks','--fail-on-malicious for CI pipelines'],
    tech:['Python','ThreatFox','AbuseIPDB','VirusTotal','threading','pytest'],
    mitre:[{id:'T1566',name:'Phishing'},{id:'T1190',name:'Exploit Public-Facing App'}],
    github:'https://github.com/shaddiegit/ioc-hunter',note:null},
  'nist-csf':{title:'NIST CSF 2.0 Gap Assessment',category:'GRC / Compliance',icon:'fas fa-clipboard-check',iconClass:'purple-icon',
    description:'Professional GRC gap assessment for a fictional NHS pharmaceutical supplier. All 6 CSF 2.0 functions, maturity scoring, 12-month roadmap.',
    highlights:['All 6 CSF 2.0 functions assessed','Maturity 1–4 scoring (current 1.32 → target 2.75)','3-phase remediation roadmap','UK GDPR Art.28 supplier questionnaire','SVG maturity radar chart'],
    tech:['NIST CSF 2.0','UK GDPR','ISO 27001','Risk Assessment'],
    mitre:[],github:'https://github.com/shaddiegit/nist-csf-gap-assessment',
    note:'Documentation set: Markdown assessment, SVG radar, questionnaire.'},
  'aws-arch':{title:'AWS Healthcare AI Triage',category:'Cloud Security / Architecture Review',icon:'fab fa-aws',iconClass:'amber-icon',
    description:'Led team threat-modelling of AWS-hosted AI triage system for NHS. STRIDE analysis revealed GDPR Art.9 violations, driving strategic project cancellation.',
    highlights:['STRIDE threat modelling across S3, IAM, EC2','GDPR Art.9 violation found before any code written','OSINT re-identification risk identified','Strategic cancellation prevented ICO exposure'],
    tech:['AWS','STRIDE','GDPR Article 9','Architecture Review'],
    mitre:[],github:null,note:'Case study only — no public codebase.'}
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
    tick(){osc(1800,'sine',0.022,0.004,0.02);},
    click(){osc(700,'square',0.032,0.003,0.018);osc(350,'sine',0.038,0.003,0.05);},
    zoom(){sweep(200,1200,'sine',0.07,0.7);sweep(150,900,'sine',0.04,0.6,0.05);},
    land(){sweep(800,180,'sine',0.065,0.4);osc(300,'sine',0.045,0.01,0.35,0.35);},
    orbit(){osc(1400,'sine',0.018,0.004,0.1);},
    type(){nb(3200,700,0.012,0.015);},
    del(){nb(2100,550,0.009,0.014);},
    success(){osc(440,'sine',0.055,0.01,0.09);osc(554,'sine',0.055,0.01,0.11,0.09);osc(660,'sine',0.05,0.01,0.17,0.18);}
  };
  return{play(n){if(!enabled||!sounds[n])return;try{sounds[n]();}catch(_){}},toggle(){enabled=!enabled;return enabled;},get isEnabled(){return enabled;}};
})();

/* ══════════════════════════════════════════════════
   WORLD & CAMERA
══════════════════════════════════════════════════ */
const cam = {
  x:0, y:0, zoom:0.22,          /* current */
  tx:0, ty:0, tz:0.22,          /* target */
  vx:0, vy:0, vz:0,             /* velocity (spring) */
  update() {
    const K=0.042, D=0.82;
    this.vx = (this.vx + (this.tx - this.x) * K) * D;
    this.vy = (this.vy + (this.ty - this.y) * K) * D;
    this.vz = (this.vz + (this.tz - this.zoom) * K) * D;
    this.x += this.vx; this.y += this.vy; this.zoom += this.vz;
  },
  settled(tol=0.001) {
    return Math.abs(this.vx)<tol && Math.abs(this.vy)<tol && Math.abs(this.vz)<tol;
  }
};

function vw() { return Math.max(window.innerWidth  || 0, document.documentElement.clientWidth  || 1280); }
function vh() { return Math.max(window.innerHeight || 0, document.documentElement.clientHeight || 720);  }

function worldToScreen(wx, wy) {
  return {
    x: (wx - cam.x) * cam.zoom + vw() / 2,
    y: (wy - cam.y) * cam.zoom + vh() / 2
  };
}

function screenToWorld(sx, sy) {
  return {
    x: (sx - vw()/2) / cam.zoom + cam.x,
    y: (sy - vh()/2) / cam.zoom + cam.y
  };
}

/* ══════════════════════════════════════════════════
   GALAXY DEFINITIONS (world coords)
══════════════════════════════════════════════════ */
const GALAXIES = [
  { id:'about',          wx:-900, wy:-520, label:'ABOUT',          color:[34,211,238],  r:160, arms:2, tilt:0.42 },
  { id:'skills',         wx: 820, wy:-580, label:'SKILLS',         color:[74,222,128],  r:145, arms:3, tilt:0.38 },
  { id:'projects',       wx: 720, wy: 480, label:'PROJECTS',       color:[167,139,250], r:180, arms:2, tilt:0.50 },
  { id:'education',      wx:-760, wy: 560, label:'EDUCATION',      color:[96,165,250],  r:140, arms:2, tilt:0.35 },
  { id:'certifications', wx: 80,  wy: 850, label:'CERTIFICATIONS', color:[251,191,36],  r:125, arms:3, tilt:0.44 },
  { id:'contact',        wx: 950, wy: 720, label:'CONTACT',        color:[244,114,182], r:120, arms:2, tilt:0.40 },
];

/* ══════════════════════════════════════════════════
   SOLAR SYSTEM DEFINITIONS
══════════════════════════════════════════════════ */
const SOLAR_SYSTEMS = {
  about:{starColor:[34,211,238],starLabel:'SH',planets:[
    {id:'about-bio',   label:'Bio',     color:[34,211,238],  pColor:'#0a4060', atmo:'rgba(34,211,238',  orbitR:130,orbitRY:55, speed:0.00012, sz:22, type:'bio'  },
    {id:'about-stats', label:'Stats',   color:[103,232,249], pColor:'#0f3550', atmo:'rgba(103,232,249', orbitR:200,orbitRY:84, speed:0.00009, sz:17, type:'stats'},
    {id:'about-photo', label:'Profile', color:[165,243,252], pColor:'#082a40', atmo:'rgba(165,243,252', orbitR:270,orbitRY:113,speed:0.00007, sz:14, type:'photo'},
  ]},
  skills:{starColor:[74,222,128],starLabel:'</>',planets:[
    {id:'sk-soc',  label:'SOC',        color:[74,222,128],  pColor:'#063a16', atmo:'rgba(74,222,128',  orbitR:120,orbitRY:50, speed:0.00011,sz:20, type:'skill-soc'  },
    {id:'sk-off',  label:'Offensive',  color:[134,239,172], pColor:'#0a3018', atmo:'rgba(134,239,172', orbitR:185,orbitRY:77, speed:0.00009,sz:16, type:'skill-off'  },
    {id:'sk-grc',  label:'GRC',        color:[167,243,208], pColor:'#0d3520', atmo:'rgba(167,243,208', orbitR:248,orbitRY:104,speed:0.00007,sz:15, type:'skill-grc'  },
    {id:'sk-prog', label:'Programming',color:[52,211,153],  pColor:'#0a3520', atmo:'rgba(52,211,153',  orbitR:310,orbitRY:130,speed:0.00005,sz:14, type:'skill-prog' },
    {id:'sk-cloud',label:'Cloud',      color:[110,231,183], pColor:'#0f2e1a', atmo:'rgba(110,231,183', orbitR:368,orbitRY:154,speed:0.00004,sz:12, type:'skill-cloud'},
    {id:'sk-fw',   label:'Frameworks', color:[16,185,129],  pColor:'#0a2e18', atmo:'rgba(16,185,129',  orbitR:422,orbitRY:177,speed:0.00003,sz:11, type:'skill-fw'  },
  ]},
  projects:{starColor:[167,139,250],starLabel:'{ }',planets:[
    {id:'threatweave', label:'ThreatWeave',color:[74,222,128],  pColor:'#082a10', atmo:'rgba(74,222,128',  orbitR:130,orbitRY:54, speed:0.00014,sz:22, type:'project'},
    {id:'secureview',  label:'SecureView', color:[34,211,238],  pColor:'#05282e', atmo:'rgba(34,211,238',  orbitR:198,orbitRY:83, speed:0.00010,sz:18, type:'project'},
    {id:'soc-lab',     label:'SOC Lab',    color:[129,140,248], pColor:'#0e0e2a', atmo:'rgba(129,140,248', orbitR:264,orbitRY:110,speed:0.00008,sz:17, type:'project'},
    {id:'ioc-hunter',  label:'IOC Hunter', color:[56,189,248],  pColor:'#05202e', atmo:'rgba(56,189,248',  orbitR:328,orbitRY:137,speed:0.00006,sz:15, type:'project'},
    {id:'nist-csf',    label:'NIST CSF',   color:[192,132,252], pColor:'#140e2a', atmo:'rgba(192,132,252', orbitR:390,orbitRY:163,speed:0.00005,sz:14, type:'project'},
    {id:'aws-arch',    label:'AWS Arch',   color:[251,191,36],  pColor:'#2a1e04', atmo:'rgba(251,191,36',  orbitR:448,orbitRY:187,speed:0.00004,sz:12, type:'project'},
  ]},
  education:{starColor:[96,165,250],starLabel:'EDU',planets:[
    {id:'edu-coventry',label:'BSc Cyber',      color:[96,165,250], pColor:'#0a1a38', atmo:'rgba(96,165,250', orbitR:145,orbitRY:60, speed:0.00010,sz:24, type:'edu-coventry'},
    {id:'edu-bmet',    label:'BTEC Level 3 IT',color:[147,197,253],pColor:'#0d1e38', atmo:'rgba(147,197,253',orbitR:230,orbitRY:96, speed:0.00007,sz:17, type:'edu-bmet'    },
  ]},
  certifications:{starColor:[251,191,36],starLabel:'CC',planets:[
    {id:'cert-isc2',  label:'ISC2 CC',   color:[251,191,36], pColor:'#2a1802', atmo:'rgba(251,191,36', orbitR:145,orbitRY:60, speed:0.00009,sz:22, type:'cert-isc2'  },
    {id:'cert-future',label:'Planned',   color:[253,230,138],pColor:'#201404', atmo:'rgba(253,230,138',orbitR:228,orbitRY:95, speed:0.00006,sz:15, type:'cert-future'},
  ]},
  contact:{starColor:[244,114,182],starLabel:'@',planets:[
    {id:'ct-email',   label:'Email',    color:[244,114,182],pColor:'#2a0a18', atmo:'rgba(244,114,182',orbitR:125,orbitRY:52, speed:0.00012,sz:20, type:'contact-email'   },
    {id:'ct-github',  label:'GitHub',   color:[232,121,249],pColor:'#220a28', atmo:'rgba(232,121,249',orbitR:188,orbitRY:78, speed:0.00009,sz:17, type:'contact-github'  },
    {id:'ct-linkedin',label:'LinkedIn', color:[217,70,239], pColor:'#1e0a24', atmo:'rgba(217,70,239', orbitR:250,orbitRY:104,speed:0.00007,sz:15, type:'contact-linkedin'},
    {id:'ct-form',    label:'Message',  color:[192,38,211], pColor:'#1a0820', atmo:'rgba(192,38,211', orbitR:310,orbitRY:129,speed:0.00005,sz:13, type:'contact-form'    },
  ]},
};

/* ══════════════════════════════════════════════════
   CANVAS & DPR
══════════════════════════════════════════════════ */
let canvas, ctx, dpr;
let stars = [], nebulae = [], galaxySprites = {}, planetSprites = {};
let currentGalaxy = null;
let planetAngles = {}, orbitRafId = null;
let hoveredPlanet = null;

function initCanvas() {
  canvas = document.getElementById('universe-canvas');
  ctx = canvas.getContext('2d');
  dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  resize();
  window.addEventListener('resize', resize);
}

function resize() {
  const W = Math.max(window.innerWidth  || 0, document.documentElement.clientWidth  || 1280);
  const H = Math.max(window.innerHeight || 0, document.documentElement.clientHeight || 720);
  canvas.width  = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  /* Use setTransform to avoid cumulative scale on repeated resize */
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

/* ══════════════════════════════════════════════════
   PRE-BUILD STAR FIELD
══════════════════════════════════════════════════ */
function buildStars() {
  stars = [];
  const W = window.innerWidth, H = window.innerHeight;
  const WORLD = 6000; /* world-space extent of star field */

  /* Star colour temperatures → RGB */
  const palettes = [
    { r:200,g:215,b:255, w:6  }, /* blue-white O/B */
    { r:220,g:235,b:255, w:10 }, /* A class */
    { r:255,g:255,b:250, w:20 }, /* F/G white */
    { r:255,g:245,b:220, w:30 }, /* G yellow-white */
    { r:255,g:228,b:180, w:25 }, /* K orange-white */
    { r:255,g:205,b:140, w:9  }, /* M orange */
  ];
  const totalW = palettes.reduce((s,p)=>s+p.w, 0);

  function randPalette() {
    let r = Math.random() * totalW;
    for (const p of palettes) { if ((r -= p.w) <= 0) return p; }
    return palettes[palettes.length - 1];
  }

  for (let i = 0; i < 3200; i++) {
    const p = randPalette();
    const rnd = Math.random();
    const sz  = rnd < 0.7 ? 0.4 + Math.random() * 0.5
              : rnd < 0.9 ? 0.8 + Math.random() * 0.8
              :              1.4 + Math.random() * 1.8;
    stars.push({
      wx: (Math.random() - 0.5) * WORLD,
      wy: (Math.random() - 0.5) * WORLD * (H/W),
      r:  sz,
      col: `${p.r},${p.g},${p.b}`,
      a:   0.25 + Math.random() * 0.75,
      tw:  Math.random() * Math.PI * 2,
      ts:  0.008 + Math.random() * 0.025,
    });
  }
}

/* ══════════════════════════════════════════════════
   PRE-BUILD NEBULAE
══════════════════════════════════════════════════ */
function buildNebulae() {
  nebulae = [
    { wx:-400, wy:-200, rx:500, ry:280, col:[109,40,217],  a:0.08 }, /* violet */
    { wx: 300, wy:-400, rx:450, ry:200, col:[6,100,160],   a:0.07 }, /* deep blue */
    { wx: 500, wy: 250, rx:400, ry:300, col:[120,20,100],  a:0.06 }, /* magenta */
    { wx:-600, wy: 400, rx:380, ry:220, col:[20,80,140],   a:0.06 }, /* blue */
    { wx:  50, wy: 600, rx:350, ry:200, col:[100,50,10],   a:0.05 }, /* amber */
    { wx: 800, wy:-200, rx:320, ry:180, col:[30,120,80],   a:0.05 }, /* teal */
    { wx:-200, wy:-700, rx:500, ry:250, col:[80,10,120],   a:0.07 }, /* purple */
    { wx: 600, wy: 700, rx:420, ry:230, col:[140,40,40],   a:0.06 }, /* red */
  ];
}

/* ══════════════════════════════════════════════════
   PRE-RENDER GALAXY SPRITES (realistic spirals)
══════════════════════════════════════════════════ */
function buildGalaxySprites() {
  GALAXIES.forEach(g => {
    const SIZE = 400;
    const oc = new OffscreenCanvas(SIZE, SIZE);
    const oc2 = oc.getContext('2d');
    const cx = SIZE/2, cy = SIZE/2;
    const [r,gv,b] = g.color;
    const CR = g.r * (SIZE / 500); /* scaled radius */

    oc2.globalCompositeOperation = 'lighter';

    /* Dust/nebula glow behind arms */
    const halo = oc2.createRadialGradient(cx,cy, 0, cx,cy, CR*1.2);
    halo.addColorStop(0,   `rgba(${r},${gv},${b},0.12)`);
    halo.addColorStop(0.4, `rgba(${r},${gv},${b},0.06)`);
    halo.addColorStop(1,   'transparent');
    oc2.fillStyle = halo;
    oc2.fillRect(0,0,SIZE,SIZE);

    /* Spiral arms */
    const WINDINGS = 2.2, NSTARS = 1800;
    for (let arm = 0; arm < g.arms; arm++) {
      const armBase = (arm / g.arms) * Math.PI * 2;
      for (let i = 0; i < NSTARS; i++) {
        const t = i / NSTARS;
        const spiralAng = armBase + t * Math.PI * 2 * WINDINGS;
        const rad  = Math.pow(t, 0.65) * CR * (0.6 + Math.random() * 0.4);
        const sc   = (Math.random() - 0.5) * CR * 0.08 * (1 - t * 0.5);
        const scY  = (Math.random() - 0.5) * CR * 0.05 * (1 - t * 0.5);

        const x = cx + Math.cos(spiralAng) * rad + sc;
        const y = cy + (Math.sin(spiralAng) * rad + scY) * g.tilt;

        /* Star brightness: inner = brighter, younger = bluer */
        const bright = (1 - t * 0.65) * (0.35 + Math.random() * 0.65);
        const sz     = Math.max(0.3, (1 - t * 0.8) * (0.8 + Math.random() * 1.4));
        const blueT  = t; /* outer stars bluer/younger */

        /* Colour: core is warm, arms fade to galaxy colour */
        const innerR = 255, innerG = 235, innerB = 210;
        const cr2 = Math.round(innerR + (r - innerR) * blueT);
        const cg2 = Math.round(innerG + (gv - innerG) * blueT);
        const cb2 = Math.round(innerB + (b - innerB) * blueT);

        /* Glow for brighter stars */
        if (bright > 0.45 && sz > 1) {
          oc2.shadowBlur  = sz * 5;
          oc2.shadowColor = `rgba(${cr2},${cg2},${cb2},0.5)`;
        }
        oc2.fillStyle = `rgba(${cr2},${cg2},${cb2},${bright})`;
        oc2.beginPath();
        oc2.arc(x, y, sz, 0, Math.PI * 2);
        oc2.fill();
        oc2.shadowBlur = 0;
      }
    }

    /* Bright central bulge */
    const core = oc2.createRadialGradient(cx, cy, 0, cx, cy, CR*0.22);
    core.addColorStop(0,   `rgba(255,252,240,1)`);
    core.addColorStop(0.15,`rgba(255,240,200,0.95)`);
    core.addColorStop(0.4, `rgba(${r},${gv},${b},0.7)`);
    core.addColorStop(1,   `rgba(${r},${gv},${b},0)`);
    oc2.fillStyle = core;
    oc2.beginPath();
    oc2.ellipse(cx, cy, CR*0.22, CR*0.22*g.tilt, 0, 0, Math.PI*2);
    oc2.fill();

    galaxySprites[g.id] = { canvas: oc, rotation: Math.random()*Math.PI*2 };
  });
}

/* ══════════════════════════════════════════════════
   PRE-RENDER PLANET SPRITES (3D sphere shading)
══════════════════════════════════════════════════ */
function buildPlanetSprites() {
  const allPlanets = Object.values(SOLAR_SYSTEMS).flatMap(s => s.planets);
  allPlanets.forEach(p => {
    const SIZE = 128;
    const oc = new OffscreenCanvas(SIZE, SIZE);
    const c  = oc.getContext('2d');
    const cx = SIZE/2, cy = SIZE/2, rad = SIZE/2 - 2;
    const [r,gv,b] = p.color;

    /* Base sphere — lit from upper-left */
    const sphere = c.createRadialGradient(cx - rad*0.32, cy - rad*0.32, 0, cx, cy, rad);
    sphere.addColorStop(0,   `rgba(${Math.min(r+80,255)},${Math.min(gv+80,255)},${Math.min(b+80,255)},1)`);
    sphere.addColorStop(0.3, `rgba(${r},${gv},${b},1)`);
    sphere.addColorStop(0.75,`rgba(${Math.round(r*0.45)},${Math.round(gv*0.45)},${Math.round(b*0.45)},1)`);
    sphere.addColorStop(1,   `rgba(${Math.round(r*0.12)},${Math.round(gv*0.12)},${Math.round(b*0.12)},1)`);
    c.beginPath(); c.arc(cx, cy, rad, 0, Math.PI*2);
    c.fillStyle = sphere; c.fill();

    /* Terminator shadow — day/night line */
    const shadow = c.createLinearGradient(cx - rad, cy, cx + rad, cy);
    shadow.addColorStop(0,   'rgba(0,0,0,0)');
    shadow.addColorStop(0.55,'rgba(0,0,0,0)');
    shadow.addColorStop(0.75,'rgba(0,0,0,0.42)');
    shadow.addColorStop(1,   'rgba(0,0,0,0.78)');
    c.beginPath(); c.arc(cx, cy, rad, 0, Math.PI*2);
    c.fillStyle = shadow; c.fill();

    /* Specular highlight */
    const spec = c.createRadialGradient(cx - rad*0.28, cy - rad*0.28, 0, cx - rad*0.28, cy - rad*0.28, rad*0.45);
    spec.addColorStop(0,   'rgba(255,255,255,0.28)');
    spec.addColorStop(0.5, 'rgba(255,255,255,0.08)');
    spec.addColorStop(1,   'rgba(255,255,255,0)');
    c.fillStyle = spec;
    c.beginPath(); c.arc(cx, cy, rad, 0, Math.PI*2);
    c.fill();

    /* Atmosphere limb glow */
    const atmo = c.createRadialGradient(cx, cy, rad*0.82, cx, cy, rad*1.14);
    atmo.addColorStop(0, 'transparent');
    atmo.addColorStop(0.4,`${p.atmo},0.22)`);
    atmo.addColorStop(1, 'transparent');
    c.beginPath(); c.arc(cx, cy, rad*1.14, 0, Math.PI*2);
    c.fillStyle = atmo; c.fill();

    planetSprites[p.id] = oc;
  });
}

/* ══════════════════════════════════════════════════
   DRAW SCENE — main render loop
══════════════════════════════════════════════════ */
let frameTs = 0;

function drawScene(ts) {
  const dt = Math.min(ts - frameTs, 32);
  frameTs = ts;

  cam.update();

  const W = canvas.width  / dpr;
  const H = canvas.height / dpr;

  /* Clear */
  ctx.fillStyle = '#020a18';
  ctx.fillRect(0, 0, W, H);

  /* ── Nebulae ── */
  nebulae.forEach(n => {
    const s = worldToScreen(n.wx, n.wy);
    const screenRX = n.rx * cam.zoom;
    const screenRY = n.ry * cam.zoom;
    const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, Math.max(screenRX, screenRY));
    const [r,g,b] = n.col;
    grad.addColorStop(0,   `rgba(${r},${g},${b},${n.a})`);
    grad.addColorStop(0.5, `rgba(${r},${g},${b},${n.a*0.4})`);
    grad.addColorStop(1,   'transparent');
    ctx.save();
    ctx.scale(1, screenRY/screenRX);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(s.x, s.y * (screenRX/screenRY), screenRX, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  });

  /* ── Stars ── */
  stars.forEach(star => {
    star.tw += star.ts;
    const alpha = star.a * (0.55 + Math.sin(star.tw) * 0.45);
    const s = worldToScreen(star.wx, star.wy);

    /* Clip stars outside the padded viewport */
    if (s.x < -20 || s.x > W + 20 || s.y < -20 || s.y > H + 20) return;

    const screenR = Math.max(0.4, star.r * cam.zoom * 2.5);

    if (screenR > 1.4) {
      /* Glow for bright stars */
      ctx.shadowBlur  = screenR * 7;
      ctx.shadowColor = `rgba(${star.col},${alpha * 0.6})`;
    }
    ctx.fillStyle = `rgba(${star.col},${alpha})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, screenR, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  /* ── Galaxies ── */
  GALAXIES.forEach(g => {
    const sprite  = galaxySprites[g.id];
    if (!sprite) return;
    sprite.rotation += 0.00008;

    const s = worldToScreen(g.wx, g.wy);
    const scale = cam.zoom * (g.r / 200) * 2.5;

    /* Halo glow */
    const haloR = sprite.canvas.width * 0.5 * scale * 1.4;
    const [r,gv,b] = g.color;
    const halo = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, haloR);
    halo.addColorStop(0,   `rgba(${r},${gv},${b},0.12)`);
    halo.addColorStop(0.5, `rgba(${r},${gv},${b},0.04)`);
    halo.addColorStop(1,   'transparent');
    ctx.fillStyle = halo;
    ctx.fillRect(s.x-haloR, s.y-haloR, haloR*2, haloR*2);

    /* Galaxy sprite */
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(sprite.rotation);
    const hw = sprite.canvas.width  * 0.5 * scale;
    const hh = sprite.canvas.height * 0.5 * scale;
    ctx.globalAlpha = 0.92;
    ctx.drawImage(sprite.canvas, -hw, -hh, hw*2, hh*2);
    ctx.globalAlpha = 1;
    ctx.restore();
  });

  /* ── Solar system (when inside a galaxy) ── */
  if (currentGalaxy && cam.zoom > 1.2) {
    drawSolarSystem(ts, W, H);
  }

  /* ── Position galaxy labels ── */
  updateGalaxyLabels();

  requestAnimationFrame(drawScene);
}

/* ══════════════════════════════════════════════════
   SOLAR SYSTEM RENDERING
══════════════════════════════════════════════════ */
function drawSolarSystem(ts, W, H) {
  const sys = SOLAR_SYSTEMS[currentGalaxy.id];
  if (!sys) return;

  const gw = worldToScreen(currentGalaxy.wx, currentGalaxy.wy);
  const cx = gw.x, cy = gw.y;
  const [sr,sg,sb] = sys.starColor;

  /* Orbit paths */
  ctx.save();
  sys.planets.forEach(p => {
    const rx = p.orbitR * cam.zoom;
    const ry = p.orbitRY * cam.zoom;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI*2);
    ctx.strokeStyle = `rgba(${sr},${sg},${sb},0.12)`;
    ctx.lineWidth   = 0.8;
    ctx.setLineDash([4, 8]);
    ctx.stroke();
    ctx.setLineDash([]);
  });
  ctx.restore();

  /* Central star */
  const starR = 18 * cam.zoom;
  const starGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, starR * 4);
  starGlow.addColorStop(0,   `rgba(255,255,240,1)`);
  starGlow.addColorStop(0.1, `rgba(${sr},${sg},${sb},0.9)`);
  starGlow.addColorStop(0.4, `rgba(${sr},${sg},${sb},0.25)`);
  starGlow.addColorStop(1,   'transparent');
  ctx.fillStyle = starGlow;
  ctx.fillRect(cx - starR*4, cy - starR*4, starR*8, starR*8);

  /* Star core */
  const starCore = ctx.createRadialGradient(cx, cy, 0, cx, cy, starR);
  starCore.addColorStop(0, 'rgba(255,255,255,1)');
  starCore.addColorStop(0.3, `rgba(${sr},${sg},${sb},0.9)`);
  starCore.addColorStop(1, `rgba(${sr},${sg},${sb},0)`);
  ctx.fillStyle = starCore;
  ctx.beginPath();
  ctx.arc(cx, cy, starR, 0, Math.PI*2);
  ctx.fill();

  /* Planets */
  sys.planets.forEach(p => {
    planetAngles[p.id] = (planetAngles[p.id] || Math.random()*Math.PI*2) + p.speed * 16;
    const ang = planetAngles[p.id];
    const px = cx + Math.cos(ang) * p.orbitR * cam.zoom;
    const py = cy + Math.sin(ang) * p.orbitRY * cam.zoom;
    const pr = Math.max(2, p.sz * cam.zoom * 0.42);

    const sprite = planetSprites[p.id];
    if (sprite && pr > 4) {
      ctx.save();
      ctx.translate(px, py);
      const d = pr * 2;
      ctx.drawImage(sprite, -pr, -pr, d, d);
      ctx.restore();

      /* Hover glow */
      if (hoveredPlanet === p.id) {
        const [r2,g2,b2] = p.color;
        const hg = ctx.createRadialGradient(px,py, pr*0.8, px,py, pr*2.5);
        hg.addColorStop(0, `rgba(${r2},${g2},${b2},0.3)`);
        hg.addColorStop(1, 'transparent');
        ctx.fillStyle = hg;
        ctx.beginPath(); ctx.arc(px,py,pr*2.5,0,Math.PI*2);
        ctx.fill();
      }
    } else {
      /* Fallback dot for very small zoom */
      const [r2,g2,b2] = p.color;
      ctx.shadowBlur = pr*4; ctx.shadowColor = `rgba(${r2},${g2},${b2},0.8)`;
      ctx.fillStyle  = `rgba(${r2},${g2},${b2},1)`;
      ctx.beginPath(); ctx.arc(px,py, Math.max(2,pr),0,Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
    }

    /* Planet label */
    if (cam.zoom > 2) {
      ctx.font = `${Math.max(9, 11 * cam.zoom * 0.35)}px 'JetBrains Mono'`;
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,255,255,0.65)';
      ctx.fillText(p.label, px, py + pr + Math.max(12, 14 * cam.zoom * 0.35));
    }
  });
}

/* ══════════════════════════════════════════════════
   GALAXY LABEL POSITIONING
══════════════════════════════════════════════════ */
function updateGalaxyLabels() {
  GALAXIES.forEach(g => {
    const el  = document.getElementById(`gl-${g.id}`);
    if (!el) return;
    const s = worldToScreen(g.wx, g.wy);
    const offset = (g.r * cam.zoom * 0.5) + 16;
    el.style.left = s.x + 'px';
    el.style.top  = (s.y + offset) + 'px';

    /* Show/hide labels based on zoom and state */
    const inView = s.x > -60 && s.x < window.innerWidth+60 && s.y > -60 && s.y < window.innerHeight+60;
    el.classList.toggle('visible', inView && cam.zoom < 2.5 && !currentGalaxy);
    el.classList.toggle('dimmed', !!currentGalaxy && currentGalaxy.id !== g.id);
  });
}

/* ══════════════════════════════════════════════════
   CLICK & HOVER HANDLING
══════════════════════════════════════════════════ */
function getGalaxyAtWorld(wx, wy) {
  for (const g of GALAXIES) {
    const dx = wx - g.wx, dy = wy - g.wy;
    if (Math.sqrt(dx*dx + dy*dy) < g.r * 1.4) return g;
  }
  return null;
}

function getPlanetAtScreen(sx, sy) {
  if (!currentGalaxy) return null;
  const sys = SOLAR_SYSTEMS[currentGalaxy.id];
  if (!sys) return null;

  const gw  = worldToScreen(currentGalaxy.wx, currentGalaxy.wy);
  const cx  = gw.x, cy = gw.y;

  for (const p of sys.planets) {
    const ang = planetAngles[p.id] || 0;
    const px  = cx + Math.cos(ang) * p.orbitR * cam.zoom;
    const py  = cy + Math.sin(ang) * p.orbitRY * cam.zoom;
    const pr  = Math.max(8, p.sz * cam.zoom * 0.42 * 1.5);
    const dx  = sx - px, dy = sy - py;
    if (Math.sqrt(dx*dx + dy*dy) < pr) return p;
  }
  return null;
}

function initInteractions() {
  const tooltip = document.createElement('div');
  tooltip.id = 'planet-tooltip';
  document.body.appendChild(tooltip);

  /* Click */
  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    /* Check planet click first */
    if (currentGalaxy) {
      const planet = getPlanetAtScreen(sx, sy);
      if (planet) {
        SoundEngine.play('click');
        onPlanetClick(planet);
        return;
      }
    }

    /* Check galaxy click */
    const wPos = screenToWorld(sx, sy);
    const galaxy = getGalaxyAtWorld(wPos.x, wPos.y);
    if (galaxy) {
      enterGalaxy(galaxy);
    }
  });

  /* Hover */
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    let cursorPointer = false;

    if (currentGalaxy) {
      const planet = getPlanetAtScreen(sx, sy);
      if (planet) {
        hoveredPlanet = planet.id;
        tooltip.style.display = 'block';
        tooltip.style.left = (e.clientX + 14) + 'px';
        tooltip.style.top  = (e.clientY - 10) + 'px';
        tooltip.textContent = planet.label;
        cursorPointer = true;
      } else {
        hoveredPlanet = null;
        tooltip.style.display = 'none';
      }
    } else {
      const wPos = screenToWorld(sx, sy);
      const galaxy = getGalaxyAtWorld(wPos.x, wPos.y);
      cursorPointer = !!galaxy;
      tooltip.style.display = 'none';
    }

    document.body.classList.toggle('cursor-hover', cursorPointer);
  });
}

/* ══════════════════════════════════════════════════
   GALAXY NAVIGATION
══════════════════════════════════════════════════ */
function enterGalaxy(galaxy) {
  SoundEngine.play('zoom');
  currentGalaxy = galaxy;

  /* Aim camera at galaxy, zoom way in */
  cam.tx = galaxy.wx;
  cam.ty = galaxy.wy;
  cam.tz = 3.8;

  /* Show SS overlay after camera arrives */
  setTimeout(() => {
    const overlay = document.getElementById('ss-overlay');
    const nameEl  = document.getElementById('ss-name');
    overlay.classList.remove('ss-hidden');
    nameEl.textContent = galaxy.label;

    /* Initialise planet angles */
    const sys = SOLAR_SYSTEMS[galaxy.id];
    if (sys) {
      sys.planets.forEach((p, i) => {
        if (!planetAngles[p.id]) {
          planetAngles[p.id] = (i / sys.planets.length) * Math.PI * 2;
        }
      });
    }

    /* Fade space hero/labels */
    document.getElementById('space-ui').classList.add('fade-out');
    SoundEngine.play('land');
  }, 1400);
}

function leaveGalaxy() {
  SoundEngine.play('zoom');
  document.getElementById('ss-overlay').classList.add('ss-hidden');
  document.getElementById('space-ui').classList.remove('fade-out');

  cam.tx = 0; cam.ty = 0; cam.tz = 0.22;
  currentGalaxy = null;
  hoveredPlanet = null;
  closePanel();
  document.getElementById('planet-tooltip').style.display = 'none';
}

/* ══════════════════════════════════════════════════
   PLANET → CONTENT
══════════════════════════════════════════════════ */
function onPlanetClick(planet) {
  if (planet.type === 'project') openProjectModal(planet.id);
  else openPanel(planet.type);
}

function openPanel(type) {
  const panel = document.getElementById('content-panel');
  const body  = document.getElementById('panel-body');
  body.innerHTML = buildPanelContent(type);
  panel.classList.add('open');
  if (type === 'cert-isc2') initCountdownInPanel();
  if (type === 'contact-form') initPanelForm();
}

function closePanel() {
  document.getElementById('content-panel').classList.remove('open');
}

/* ══════════════════════════════════════════════════
   CONTENT PANEL BUILDER (editorial style)
══════════════════════════════════════════════════ */
function ep(num, accent, eyebrow, title, body, stats) {
  const statsHtml = stats ? `<div class="ep-stats">${stats.map(s =>
    `<div><div class="ep-stat-key">${s.k}</div><div class="ep-stat-val">${s.v}</div></div>`
  ).join('')}</div>` : '';
  return `<div class="ep-wrap">
    <p class="ep-eyebrow">// ${eyebrow}</p>
    <div class="ep-row">
      <div class="ep-num">${num}</div>
      <div><div class="ep-title">${title}</div>
        <div class="ep-accent" style="color:${accent};background:${accent}"></div></div>
    </div>
    <div class="ep-body">${body}</div>
    ${statsHtml}</div>`;
}

function buildSkillEp(num, color, title, tags, desc) {
  const tagsHtml = tags.map(t =>
    `<span class="ep-tag" style="border-color:${color}33;color:${color}">${t}</span>`
  ).join('');
  return ep(num, color, 'skills', title,
    `${desc}<div class="ep-tags" style="margin-top:1rem">${tagsHtml}</div>`,
    [{k:'Category',v:`${num} / 06`},{k:'Skills',v:tags.length.toString()},{k:'Domain',v:'Security'}]);
}

function buildPanelContent(type) {
  switch(type) {
    case 'bio': return ep('01','#22d3ee','about','Shadman Hossain',`
      <div class="ep-terminal">
        <p><span class="t-prompt">&gt;</span> Final-year <span class="t-hl">BSc Ethical Hacking &amp; Cyber Security</span> at Coventry University.</p>
        <p><span class="t-prompt">&gt;</span> On track for First-Class Honours — current average: <span class="t-hl">76.67%</span>. Research: 87%.</p>
        <p><span class="t-prompt">&gt;</span> Blue team detection engineering, GRC compliance, AI-augmented security tools in Python and Go.</p>
        <p><span class="t-prompt">&gt;</span> Preparing for <span class="t-hl">ISC2 CC</span> (June 2026). Seeking junior SOC / GRC roles in the UK.</p>
      </div>
      <p style="font-family:var(--font-mono);font-size:0.75rem;color:var(--muted)">
        <i class="fas fa-location-dot" style="color:#22d3ee;margin-right:0.4rem"></i>Coventry, UK
      </p>`,
      [{k:'Location',v:'Coventry, UK'},{k:'Degree',v:'BSc Hons'},{k:'Status',v:'Final Year'}]);

    case 'stats': return ep('02','#22d3ee','statistics','Academic Stats',`
      Key modules from Coventry University BSc Ethical Hacking &amp; Cyber Security.
      <div class="ep-tags" style="margin-top:1rem">
        <span class="ep-tag" style="color:#22d3ee;border-color:#22d3ee33">Digital Security Risk — 73%</span>
        <span class="ep-tag" style="color:#22d3ee;border-color:#22d3ee33">Applied Cryptography — 75%</span>
        <span class="ep-tag" style="color:#22d3ee;border-color:#22d3ee33">Advanced Pen Testing — 71%</span>
        <span class="ep-tag" style="color:#22d3ee;border-color:#22d3ee33">Research Project — 87%</span>
        <span class="ep-tag" style="color:#22d3ee;border-color:#22d3ee33">Info Security Management — 70%</span>
        <span class="ep-tag" style="color:#22d3ee;border-color:#22d3ee33">Security Operations — 67%</span>
      </div>`,
      [{k:'Average',v:'76.67%'},{k:'Research',v:'87%'},{k:'Projects',v:'5'}]);

    case 'photo': return ep('03','#22d3ee','profile','Profile',`
      <div style="display:flex;justify-content:center;margin:0.5rem 0 1.25rem">
        <img src="../assets/profile.jpg" alt="Shadman Hossain"
          onerror="this.style.display='none'"
          style="width:180px;height:180px;object-fit:cover;border-radius:50%;border:2px solid rgba(34,211,238,0.3)" />
      </div>
      Coventry, UK · BSc Ethical Hacking &amp; Cyber Security · Final Year 2026`,
      [{k:'University',v:'Coventry'},{k:'Year',v:'2026'},{k:'Expected',v:'First Class'}]);

    case 'skill-soc':   return buildSkillEp('01','#4ade80','SOC &amp; Detection',    ['SIEM','Wazuh','ELK Stack','Splunk','Sigma Rules','MITRE ATT&CK','Log Analysis','Incident Triage'],'Core blue-team monitoring and threat detection capabilities.');
    case 'skill-off':   return buildSkillEp('02','#86efac','Offensive / Pen-test',   ['Kali Linux','Nmap','Burp Suite','Metasploit','Wireshark','OSINT','Vuln Assessment'],'Ethical hacking and penetration testing toolchain.');
    case 'skill-grc':   return buildSkillEp('03','#a7f3d0','GRC &amp; Compliance',   ['NIST CSF 2.0','ISO 27001','UK GDPR','Threat Modelling','Risk Assessment','Supplier Due Diligence','Audit Management'],'Governance, risk, and compliance frameworks.');
    case 'skill-prog':  return buildSkillEp('04','#34d399','Programming',             ['Python','Go','Bash','TypeScript','Playwright','pytest','Web Scraping'],'Languages and automation tooling across all projects.');
    case 'skill-cloud': return buildSkillEp('05','#6ee7b7','Cloud &amp; Infra',       ['AWS S3','AWS IAM','AWS EC2','Linux Admin','Windows AD'],'Cloud platforms and infrastructure administration.');
    case 'skill-fw':    return buildSkillEp('06','#10b981','Frameworks',              ['MITRE ATT&CK','OWASP Top 10','Cyber Kill Chain','NIST RMF','STRIDE'],'Industry security frameworks and methodologies.');

    case 'edu-coventry': return ep('01','#60a5fa','education','BSc Ethical Hacking &amp; Cyber Security',`
      <strong style="color:#60a5fa">Coventry University</strong> · Sep 2023 – Jul 2026 · Expected First-Class Honours
      <div class="ep-tags" style="margin-top:1rem">
        <span class="ep-tag">Digital Security Risk — 73%</span><span class="ep-tag">Security Operations — 67%</span>
        <span class="ep-tag">Info Security Management — 70%</span><span class="ep-tag">Applied Cryptography — 75%</span>
        <span class="ep-tag">Advanced Pen Testing — 71%</span><span class="ep-tag">Research Project — 87%</span>
      </div>`,
      [{k:'Average',v:'76.67%'},{k:'Graduation',v:'Jul 2026'},{k:'Class',v:'First'}]);

    case 'edu-bmet': return ep('02','#93c5fd','education','BTEC Level 3 IT',`
      <strong style="color:#93c5fd">Birmingham Metropolitan College</strong> · Sep 2020 – Jul 2022
      <div class="ep-tags" style="margin-top:1rem">
        <span class="ep-tag">IT Project Management — Distinction</span>
        <span class="ep-tag">Programming — Distinction</span>
        <span class="ep-tag">Mobile Apps — Distinction</span>
        <span class="ep-tag">Cyber Security &amp; Incident Management</span>
      </div>`,
      [{k:'Grade',v:'DDM'},{k:'Graduated',v:'2022'},{k:'College',v:'BMet'}]);

    case 'cert-isc2': return `<div class="ep-wrap">
      <p class="ep-eyebrow">// certifications</p>
      <div class="ep-row"><div class="ep-num">01</div><div>
        <div class="ep-title">ISC2 CC</div>
        <div class="ep-accent" style="background:#fbbf24"></div>
      </div></div>
      <div class="ep-body">Vendor-neutral security certification covering risk management, network security, security operations, and access controls. Exam scheduled 11 June 2026.</div>
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
      <div class="cert-status" style="margin-bottom:1.5rem"><span class="sdot"></span>Exam Scheduled — 11 June 2026</div>
      <div class="ep-stats">
        <div><div class="ep-stat-key">Issuer</div><div class="ep-stat-val">ISC2</div></div>
        <div><div class="ep-stat-key">Exam</div><div class="ep-stat-val">11 Jun 2026</div></div>
        <div><div class="ep-stat-key">Status</div><div class="ep-stat-val">Upcoming</div></div>
      </div></div>`;

    case 'cert-future': return ep('02','rgba(255,255,255,0.18)','certifications','More Coming Soon',
      'Continuing professional development in SOC operations, threat hunting, and GRC disciplines post-graduation.',
      [{k:'Timeline',v:'Post 2026'},{k:'Focus',v:'SOC / GRC'},{k:'Status',v:'Planned'}]);

    case 'contact-email': return ep('01','#f472b6','contact','Email',`
      <a href="mailto:sm.shadman.hossain@gmail.com" class="contact-method">
        <i class="fas fa-envelope cm-icon"></i>
        <div><span class="cm-type">Email</span><span class="cm-val">sm.shadman.hossain@gmail.com</span></div>
      </a>`,
      [{k:'Response',v:'< 24h'},{k:'Type',v:'Email'},{k:'Preferred',v:'Yes'}]);

    case 'contact-github': return ep('02','#f472b6','contact','GitHub',`
      <a href="https://github.com/shaddiegit" target="_blank" rel="noopener" class="contact-method">
        <i class="fab fa-github cm-icon"></i>
        <div><span class="cm-type">GitHub</span><span class="cm-val">github.com/shaddiegit</span></div>
      </a>`,
      [{k:'Projects',v:'5+'},{k:'Platform',v:'GitHub'},{k:'Domain',v:'Security'}]);

    case 'contact-linkedin': return ep('03','#f472b6','contact','LinkedIn',`
      <a href="https://www.linkedin.com/in/shadman-hossain1206" target="_blank" rel="noopener" class="contact-method">
        <i class="fab fa-linkedin-in cm-icon"></i>
        <div><span class="cm-type">LinkedIn</span><span class="cm-val">linkedin.com/in/shadman-hossain1206</span></div>
      </a>`,
      [{k:'Network',v:'LinkedIn'},{k:'Location',v:'UK'},{k:'Open To',v:'Roles'}]);

    case 'contact-form': return `<div class="ep-wrap">
      <p class="ep-eyebrow">// contact</p>
      <div class="ep-row"><div class="ep-num">04</div><div>
        <div class="ep-title">Send a Message</div>
        <div class="ep-accent" style="background:#f472b6"></div>
      </div></div>
      <p class="ep-body">Open to <strong style="color:#f472b6">Junior SOC Analyst</strong>, <strong style="color:#e879f9">GRC Analyst</strong>, and <strong style="color:#f472b6">Cyber Threat Intelligence</strong> roles in the UK.</p>
      <form class="mini-form" id="panel-contact-form" novalidate>
        <div><label>Name</label><input type="text" id="pf-name" placeholder="Your name" required /></div>
        <div><label>Email</label><input type="email" id="pf-email" placeholder="your@email.com" required /></div>
        <div><label>Subject</label><input type="text" id="pf-subject" placeholder="Job opportunity / Collaboration" required /></div>
        <div><label>Message</label><textarea id="pf-msg" rows="4" placeholder="Your message..." required></textarea></div>
        <button type="submit"><i class="fas fa-paper-plane"></i>&nbsp; TRANSMIT</button>
        <p class="form-status-text" id="pf-status"></p>
      </form></div>`;

    default: return `<div class="ep-wrap"><p class="ep-eyebrow">// ${type}</p></div>`;
  }
}

/* ══════════════════════════════════════════════════
   PROJECT MODAL
══════════════════════════════════════════════════ */
function openProjectModal(id) {
  const d = PROJECTS[id]; if(!d) return;
  const ov=document.getElementById('modal-overlay');
  document.getElementById('modal-icon').className=d.icon;
  document.getElementById('modal-category-label').textContent=d.category;
  document.getElementById('modal-title').textContent=d.title;
  document.getElementById('modal-description').textContent=d.description;
  const hl=document.getElementById('modal-highlights');
  hl.innerHTML=d.highlights.map(h=>`<li>${h}</li>`).join('');
  document.getElementById('modal-highlights-wrap').style.display=d.highlights.length?'':'none';
  document.getElementById('modal-tech-pills').innerHTML=d.tech.map(t=>`<span class="tech-pill">${t}</span>`).join('');
  document.getElementById('modal-tech-wrap').style.display=d.tech.length?'':'none';
  const mg=document.getElementById('modal-mitre-grid');
  if(d.mitre.length){mg.innerHTML=d.mitre.map(m=>`<span class="modal-mitre-item">${m.id} — ${m.name}</span>`).join('');document.getElementById('modal-mitre-wrap').style.display='';}
  else document.getElementById('modal-mitre-wrap').style.display='none';
  const mn=document.getElementById('modal-note');
  if(d.note){document.getElementById('modal-note-text').innerHTML=d.note;mn.style.display='flex';}else mn.style.display='none';
  const ma=document.getElementById('modal-actions');
  ma.innerHTML='';
  if(d.github){const a=document.createElement('a');a.href=d.github;a.target='_blank';a.rel='noopener';a.className='btn-github';a.innerHTML='<i class="fab fa-github"></i> View on GitHub';ma.appendChild(a);}
  else{const p=document.createElement('p');p.style.cssText='font-family:var(--font-mono);font-size:0.78rem;color:var(--muted)';p.textContent='// No public repository.';ma.appendChild(p);}
  SoundEngine.play('click');
  ov.classList.add('open'); ov.setAttribute('aria-hidden','false');
  document.body.classList.add('no-scroll');
  setTimeout(()=>document.getElementById('modal-close').focus(),80);
}

function closeModal() {
  const ov=document.getElementById('modal-overlay');
  ov.classList.remove('open'); ov.setAttribute('aria-hidden','true');
  document.body.classList.remove('no-scroll');
}

/* ══════════════════════════════════════════════════
   COUNTDOWN / FORM
══════════════════════════════════════════════════ */
function initCountdownInPanel() {
  const exam=new Date('2026-06-11T09:00:00');
  function update(){
    const diff=exam-new Date(); if(diff<=0)return;
    const d=Math.floor(diff/864e5),h=Math.floor((diff%864e5)/36e5),m=Math.floor((diff%36e5)/6e4);
    const dEl=document.getElementById('cd-days'),hEl=document.getElementById('cd-hrs'),mEl=document.getElementById('cd-min');
    if(dEl)dEl.textContent=String(d).padStart(2,'0');
    if(hEl)hEl.textContent=String(h).padStart(2,'0');
    if(mEl)mEl.textContent=String(m).padStart(2,'0');
  }
  update(); setInterval(update,30000);
}

function initPanelForm() {
  const form=document.getElementById('panel-contact-form');
  const stat=document.getElementById('pf-status');
  if(!form)return;
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const n=form.querySelector('#pf-name'),em=form.querySelector('#pf-email'),s=form.querySelector('#pf-subject'),m=form.querySelector('#pf-msg');
    let ok=true;
    [n,em,s,m].forEach(el=>{el.classList.remove('invalid');if(!el.value.trim()){el.classList.add('invalid');ok=false;}});
    if(!ok){stat.textContent='// Fill in all fields.';stat.className='form-status-text err';return;}
    window.location.href=`mailto:sm.shadman.hossain@gmail.com?subject=${encodeURIComponent(s.value)}&body=${encodeURIComponent(`Name: ${n.value}\nEmail: ${em.value}\n\n${m.value}`)}`;
    SoundEngine.play('success');stat.textContent='// Transmission initiated...';stat.className='form-status-text ok';
    setTimeout(()=>{form.reset();stat.textContent='';stat.className='form-status-text';},4000);
  });
}

/* ══════════════════════════════════════════════════
   CURSOR
══════════════════════════════════════════════════ */
function initCursor() {
  const dot=document.getElementById('cursor-dot'),ring=document.getElementById('cursor-ring');
  if(!dot||!ring||window.matchMedia('(pointer:coarse)').matches)return;
  let mx=-100,my=-100,rx=mx,ry=my;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';});
  (function lp(){rx+=(mx-rx)*0.13;ry+=(my-ry)*0.13;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(lp);})();
}

/* ══════════════════════════════════════════════════
   TYPING ENGINE
══════════════════════════════════════════════════ */
function initTyping() {
  const el=document.getElementById('typing-target');
  if(!el)return;
  const titles=['Junior SOC Analyst','GRC Analyst','Cyber Threat Intelligence','Detection Engineer','Blue Teamer'];
  let idx=0,ci=0,del=false;
  function tick(){
    const cur=titles[idx];
    if(del){ci--;el.textContent=cur.slice(0,ci);SoundEngine.play('del');if(ci===0){del=false;idx=(idx+1)%titles.length;setTimeout(tick,400);return;}setTimeout(tick,40);}
    else{ci++;el.textContent=cur.slice(0,ci);SoundEngine.play('type');if(ci===cur.length){del=true;setTimeout(tick,2400);return;}setTimeout(tick,82);}
  }
  setTimeout(tick,1400);
}

/* ══════════════════════════════════════════════════
   BOOT SEQUENCE
══════════════════════════════════════════════════ */
function initBootSequence() {
  const screen=document.getElementById('boot-screen');
  if(!screen)return;
  if(sessionStorage.getItem('sh-booted-v3')){screen.style.display='none';return;}

  const logEl=document.getElementById('boot-log'),barEl=document.getElementById('boot-bar'),status=document.getElementById('boot-status');
  document.body.style.overflow='hidden';

  /* Boot star canvas */
  const bc=document.getElementById('boot-canvas');
  if(bc){
    const bctx=bc.getContext('2d');
    bc.width=window.innerWidth;bc.height=window.innerHeight;
    const bstars=Array.from({length:1200},()=>({x:Math.random()*bc.width,y:Math.random()*bc.height,r:0.4+Math.random()*1.2,a:0.2+Math.random()*0.8,col:`${200+Math.round(Math.random()*55)},${210+Math.round(Math.random()*45)},255`}));
    (function bf(){bctx.fillStyle='#020a18';bctx.fillRect(0,0,bc.width,bc.height);bstars.forEach(s=>{bctx.fillStyle=`rgba(${s.col},${s.a})`;bctx.beginPath();bctx.arc(s.x,s.y,s.r,0,Math.PI*2);bctx.fill();});requestAnimationFrame(bf);})();
  }

  const LINES=[
    {text:'[ OK ]  Calibrating star charts',        cls:'boot-ok'},
    {text:'[ OK ]  Loading galaxy coordinates',      cls:'boot-ok'},
    {text:'[ OK ]  Computing orbital mechanics',     cls:'boot-ok'},
    {text:'[ OK ]  Building nebulae',                cls:'boot-ok'},
    {text:'[ OK ]  Rendering planet surfaces',       cls:'boot-ok'},
    {text:'[ WARN] cv.pdf not found',                cls:'boot-warn'},
    {text:'[ OK ]  Universe ready. Engage.',         cls:'boot-info'},
  ];

  setTimeout(()=>{if(barEl)barEl.style.width='100%';},60);
  LINES.forEach((l,i)=>setTimeout(()=>{
    if(!logEl)return;
    const d=document.createElement('div');d.className='boot-line';
    d.innerHTML=`<span class="${l.cls}">${l.text}</span>`;logEl.appendChild(d);
  },250+i*290));

  const at=250+LINES.length*290+320;
  setTimeout(()=>{
    if(status)status.textContent='ALL SYSTEMS ONLINE';
    setTimeout(()=>{
      screen.classList.add('fade-out');
      document.body.style.overflow='';
      setTimeout(()=>{screen.style.display='none';},850);
    },400);
  },at);

  sessionStorage.setItem('sh-booted-v3','1');
}

/* ══════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initBootSequence();
  initCanvas();
  buildStars();
  buildNebulae();
  buildGalaxySprites();
  buildPlanetSprites();
  initTyping();
  initCursor();
  initInteractions();

  /* Back button */
  document.getElementById('ss-back').addEventListener('click', leaveGalaxy);

  /* Modal close */
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });

  /* Panel close */
  document.getElementById('panel-close').addEventListener('click', closePanel);

  /* Galaxy labels */
  document.querySelectorAll('.glabel').forEach(el => {
    el.addEventListener('click', () => {
      const g = GALAXIES.find(gx => gx.id === el.dataset.galaxy);
      if (g) enterGalaxy(g);
    });
    el.addEventListener('mouseenter', () => SoundEngine.play('tick'));
  });

  /* Keyboard */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (document.getElementById('modal-overlay').classList.contains('open')) closeModal();
      else if (document.getElementById('content-panel').classList.contains('open')) closePanel();
      else if (currentGalaxy) leaveGalaxy();
    }
  });

  /* Start render loop */
  requestAnimationFrame(drawScene);
});
