/* ════════════════════════════════════════════════════════════
   PROJECT DATA
   ════════════════════════════════════════════════════════════ */
const PROJECTS = {
  'threatweave': {
    title: 'ThreatWeave',
    category: 'Threat Intelligence / CTI',
    icon: 'fas fa-brain',
    iconClass: 'green-icon',
    description: 'ThreatWeave is an AI-powered threat intelligence correlation engine written in Go. It aggregates Indicators of Compromise (IOCs) from multiple threat intelligence feeds and groups them into meaningful threat clusters using three prioritised signals: shared Autonomous System Number (ASN), temporal proximity of observations, and overlapping MITRE ATT&CK tactics. When configured with an Anthropic Claude API key, the engine generates professional CTI analyst narratives describing threat actor profiles, objectives, and recommended defensive measures.',
    highlights: [
      'Threat clustering by shared ASN, temporal proximity, and overlapping MITRE ATT&CK tactics',
      'AI-generated threat actor profiles and narratives using the Claude API',
      'Automated Markdown report export for stakeholder-ready intelligence products',
      'Commands: <code>correlate</code>, <code>profile</code>, <code>report</code>, <code>demo</code>',
      'Static Go binary — no runtime dependencies, deployable anywhere',
      'MIT licensed and open source'
    ],
    tech: ['Go', 'Claude AI API', 'MITRE ATT&CK', 'Goroutines', 'CTI Workflows'],
    mitre: [
      { id: 'T1071', name: 'Application Layer Protocol (C2 communications)' },
      { id: 'T1041', name: 'Exfiltration Over C2 Channel' },
      { id: 'T1190', name: 'Exploit Public-Facing Application' }
    ],
    github: 'https://github.com/shaddiegit/threatweave',
    note: null
  },

  'secureview': {
    title: 'SecureView',
    category: 'SOC Dashboard / Blue Team',
    icon: 'fas fa-desktop',
    iconClass: 'cyan-icon',
    description: 'SecureView is an AI-powered SOC analyst dashboard built with React and TypeScript. It demonstrates how modern AI can streamline security alert triage — from initial alert ingestion through to automated incident report generation with MITRE ATT&CK mapping. The dashboard features a live alert queue with realistic security scenarios, AI-driven risk scoring via the Claude API, and forensic-level raw log viewing with syntax highlighting.',
    highlights: [
      'Live alert queue featuring 5 realistic security scenarios ranked by severity',
      'Claude API integration for AI-driven risk scoring and MITRE ATT&CK mapping',
      'Automated incident report generation with executive summaries and remediation timelines',
      'IOC display with confidence ratings and categorisation (IP, domain, hash)',
      'Raw log viewer with syntax highlighting for forensic examination',
      '17 unit tests (Vitest) validating data integrity without API calls',
      'Type-safe TypeScript throughout — enforces strict typing around sensitive data'
    ],
    tech: ['TypeScript', 'React', 'Vite', 'Claude AI API', 'Vitest'],
    mitre: [
      { id: 'T1059', name: 'Command and Scripting Interpreter' },
      { id: 'T1055', name: 'Process Injection' }
    ],
    github: 'https://github.com/shaddiegit/secureview',
    note: 'This is a full web application. Clone the repo and run <code>npm install && npm run dev</code> to launch the dashboard locally. Requires an Anthropic API key for AI triage features.'
  },

  'soc-lab': {
    title: 'SOC Detection Lab',
    category: 'Blue Team / Detection Engineering',
    icon: 'fas fa-shield-halved',
    iconClass: 'green-icon',
    description: 'A self-contained blue team detection engineering environment that simulates a realistic 4-stage intrusion campaign against a Linux web server — reconnaissance, initial access via SSH brute-force, privilege escalation through sudo abuse, and data exfiltration. Detection rules are written in Sigma-compatible YAML and designed for direct deployment in Wazuh. The entire attack originates from a single simulated threat actor IP, enabling cross-event correlation that mirrors real SOC triage workflows.',
    highlights: [
      'Complete 4-stage kill chain simulation from a single threat actor (IP: 203.0.113.66)',
      '4 Sigma-style YAML detection rules covering the full attack sequence end-to-end',
      'Time-window correlation: brute-force source IP linked to subsequent 90 MB exfil event',
      'pytest suite with true-positive and false-positive validation for all 4 rules',
      'MITRE ATT&CK-aligned triage writeups with threshold justification per rule',
      'Wazuh-compatible output — rules deployable in a real SOC environment',
      'Analyst write-up included: structured incident narrative mirroring real SOC documentation'
    ],
    tech: ['Python', 'Sigma YAML', 'MITRE ATT&CK', 'Wazuh', 'pytest', 'Linux Auth Logs', 'Nginx'],
    mitre: [
      { id: 'T1110.001', name: 'Brute Force: Password Guessing' },
      { id: 'T1083',     name: 'File and Directory Discovery' },
      { id: 'T1548.003', name: 'Abuse Elevation Control: Sudo Caching' },
      { id: 'T1041',     name: 'Exfiltration Over C2 Channel' }
    ],
    github: 'https://github.com/shaddiegit/soc-detection-lab',
    note: null
  },

  'ioc-hunter': {
    title: 'IOC Hunter',
    category: 'Threat Intelligence / CLI Tool',
    icon: 'fas fa-magnifying-glass',
    iconClass: 'cyan-icon',
    description: 'IOC Hunter is a Python CLI tool designed for SOC Tier 1 analysts to rapidly triage Indicators of Compromise against multiple threat intelligence feeds simultaneously. It auto-detects IOC type (IPv4, domain, URL, MD5, SHA-256), queries ThreatFox, URLhaus, AbuseIPDB, and VirusTotal concurrently, normalises the responses into unified verdicts, and exports results in console, JSON, or HTML formats suitable for tickets and SOAR pipelines.',
    highlights: [
      'Concurrent querying of 4 major threat intelligence feeds for fast triage',
      'Offline-first design — works without API keys using bundled reference feeds',
      'Auto-detection of IOC type: IPv4, domain, URL, MD5 hash, SHA-256 hash',
      'Input security hardening: blocks CRLF injection, null-byte injection, and ReDoS',
      '19 automated tests covering true-positive, false-positive, and security regression cases',
      '<code>--fail-on-malicious</code> flag returns exit code 1 for CI/SOAR pipeline integration',
      'Multiple output formats: colour console, JSON (automation), HTML (ticket-friendly)'
    ],
    tech: ['Python', 'ThreatFox API', 'URLhaus API', 'AbuseIPDB API', 'VirusTotal API', 'threading', 'pytest'],
    mitre: [
      { id: 'T1566', name: 'Phishing (IOC detection workflow)' },
      { id: 'T1190', name: 'Exploit Public-Facing Application (URL/IP IOCs)' }
    ],
    github: 'https://github.com/shaddiegit/ioc-hunter',
    note: null
  },

  'nist-csf': {
    title: 'NIST CSF 2.0 Gap Assessment',
    category: 'GRC / Compliance',
    icon: 'fas fa-clipboard-check',
    iconClass: 'purple-icon',
    description: 'A professional-grade GRC gap assessment for a fictional UK pharmaceutical supplier — Meridian Health Logistics Ltd — evaluated against all 6 functions of the NIST Cybersecurity Framework 2.0. This project demonstrates the analytical rigour expected of a junior GRC analyst: quantitative maturity scoring, structured gap identification, and a phased remediation roadmap aligned to business risk priorities.',
    highlights: [
      'Full assessment across all 6 CSF 2.0 functions: Govern, Identify, Protect, Detect, Respond, Recover',
      'Quantitative maturity scoring on a 1–4 scale per sub-category (current: 1.32 → target: 2.75)',
      'Two High-severity findings identified as root-cause blockers gating all other improvements',
      'Three-phase remediation roadmap spanning 0–12 months with prioritised actions',
      'UK GDPR Article 28 supplier due-diligence questionnaire for procurement',
      'SVG maturity radar chart comparing current vs target capability across all 6 functions',
      'NHS pharmaceutical sector context applied throughout — regulatory and operational risk-aware'
    ],
    tech: ['NIST CSF 2.0', 'UK GDPR Art. 28', 'ISO 27001', 'Risk Assessment', 'Supplier Due Diligence', 'Maturity Modelling'],
    mitre: [],
    github: 'https://github.com/shaddiegit/nist-csf-gap-assessment',
    note: 'This is a professional documentation set — a Markdown assessment report, SVG maturity radar chart, and supplier questionnaire. The GitHub repository contains the full deliverable.'
  },

  'aws-arch': {
    title: 'AWS Healthcare AI Triage Architecture',
    category: 'Cloud Security / Architecture Review',
    icon: 'fab fa-aws',
    iconClass: 'amber-icon',
    description: 'As team lead at Birmingham Metropolitan College, I guided a team in designing an AWS-hosted AI triage system for NHS healthcare use. Applying STRIDE threat modelling across all system components and data flows, I identified three critical legal and privacy violations — most significantly the processing of GDPR Article 9 special-category biometric and health data without a lawful basis, and an OSINT re-identification risk in the proposed data pipeline. My findings led to the strategic cancellation of the project before implementation, preventing potential ICO enforcement action.',
    highlights: [
      'Led a cross-functional team through the complete architecture design phase',
      'Applied STRIDE threat modelling to AWS S3, IAM, EC2 components, and all data flows',
      'Identified GDPR Art.9 special-category data violation before any code was written',
      'Identified OSINT re-identification risk in the proposed patient data pipeline',
      'Strategic cancellation recommendation accepted — regulatory exposure prevented',
      'Demonstrates security-first architecture thinking and GRC sequencing judgement',
      'Identified 3 critical legal/privacy violations in a single architecture review'
    ],
    tech: ['AWS (S3, IAM, EC2)', 'STRIDE Threat Modelling', 'GDPR Article 9', 'Healthcare Compliance', 'Architecture Review'],
    mitre: [],
    github: null,
    note: 'This is a case study. The project was strategically cancelled based on the threat modelling findings — there is no public codebase. The work product is an architecture threat model and risk findings report.'
  }
};

/* ════════════════════════════════════════════════════════════
   SOUND ENGINE  (Web Audio API — no external files)
   ════════════════════════════════════════════════════════════ */
const SoundEngine = (() => {
  let ctx = null;
  let enabled = true;

  function ac() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /* helper: one oscillator + gain with full ADSR envelope */
  function osc(freq, type, peakGain, attack, decay, startOffset = 0) {
    const c  = ac();
    const t  = c.currentTime + startOffset;
    const g  = c.createGain();
    const o  = c.createOscillator();
    o.type      = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peakGain, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
    o.connect(g);
    g.connect(c.destination);
    o.start(t);
    o.stop(t + attack + decay + 0.01);
  }

  /* helper: pitch-swept oscillator (glide from startFreq → endFreq) */
  function sweep(startFreq, endFreq, type, peakGain, duration, startOffset = 0) {
    const c = ac();
    const t = c.currentTime + startOffset;
    const g = c.createGain();
    const o = c.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(startFreq, t);
    o.frequency.exponentialRampToValueAtTime(endFreq, t + duration);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peakGain, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    o.connect(g);
    g.connect(c.destination);
    o.start(t);
    o.stop(t + duration + 0.01);
  }

  /* helper: short noise burst filtered to a band (for typing tick) */
  function noiseBurst(centreFreq, bandwidth, peakGain, duration) {
    const c      = ac();
    const t      = c.currentTime;
    const buf    = c.createBuffer(1, c.sampleRate * duration, c.sampleRate);
    const data   = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1);
    const src    = c.createBufferSource();
    src.buffer   = buf;
    const bpf    = c.createBiquadFilter();
    bpf.type     = 'bandpass';
    bpf.frequency.value = centreFreq;
    bpf.Q.value  = centreFreq / bandwidth;
    const g      = c.createGain();
    g.gain.setValueAtTime(peakGain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    src.connect(bpf);
    bpf.connect(g);
    g.connect(c.destination);
    src.start(t);
    src.stop(t + duration);
  }

  const sounds = {
    /* nav / card hover — ultra-soft high tick */
    tick()      { osc(1900, 'sine', 0.032, 0.004, 0.022); },

    /* interactive click — brief square → sine click */
    click()     {
      osc(780, 'square', 0.04, 0.003, 0.02);
      osc(390, 'sine',   0.05, 0.003, 0.06);
    },

    /* modal opening — ascending glide chord */
    modalOpen() {
      sweep(180, 560,  'sine', 0.07, 0.22);
      sweep(270, 840,  'sine', 0.04, 0.22, 0.01);   /* harmony fifth above */
      osc(560, 'sine', 0.06, 0.01, 0.30, 0.18);     /* sustain tone */
    },

    /* modal closing — short descending tick */
    modalClose() {
      sweep(560, 180, 'sine', 0.06, 0.14);
    },

    /* typing character — tiny filtered noise tick */
    type()      { noiseBurst(3200, 600, 0.018, 0.018); },

    /* typing delete — slightly lower pitch than type */
    del()       { noiseBurst(2100, 500, 0.012, 0.016); },

    /* nav section activated — soft pentatonic chime */
    section()   {
      osc(523, 'sine', 0.055, 0.018, 0.35);     /* C5 */
      osc(784, 'sine', 0.030, 0.018, 0.30, 0.06); /* G5 */
    },

    /* email copied — two-note success riff */
    success()   {
      osc(523, 'sine', 0.07, 0.01, 0.10);        /* C5 */
      osc(659, 'sine', 0.07, 0.01, 0.12, 0.10);  /* E5 */
      osc(784, 'sine', 0.06, 0.01, 0.18, 0.19);  /* G5 */
    },

    /* mobile menu open */
    menuOpen()  { sweep(320, 640, 'sine', 0.055, 0.14); },

    /* mobile menu close */
    menuClose() { sweep(640, 320, 'sine', 0.045, 0.11); },
  };

  return {
    play(name) {
      if (!enabled || !sounds[name]) return;
      try { sounds[name](); } catch (_) {}
    },
    toggle() {
      enabled = !enabled;
      return enabled;
    },
    get isEnabled() { return enabled; }
  };
})();

function initSoundToggle() {
  const btn  = document.getElementById('soundToggle');
  const icon = document.getElementById('soundIcon');
  if (!btn || !icon) return;

  btn.addEventListener('click', () => {
    const on = SoundEngine.toggle();
    icon.className = on ? 'fas fa-volume-up' : 'fas fa-volume-xmark';
    btn.classList.toggle('muted', !on);
    /* play tick only when turning ON */
    if (on) SoundEngine.play('tick');
  });
}

/* ════════════════════════════════════════════════════════════
   CANVAS — MULTI-LAYER MATRIX ANIMATION ENGINE
   Layers (back→front):
     1. Hex grid          — pulsing hexagonal lattice
     2. Matrix rain       — falling katakana / latin / binary
     3. Radar sweep       — rotating arc (top-right)
     4. Data streams      — scrolling hex packets
     5. Particle network  — mouse-reactive nodes + connections
     6. Scan line         — bouncing horizontal glow
     7. Corner brackets   — animated terminal corners
     8. Glitch            — occasional slice displacement
   ════════════════════════════════════════════════════════════ */
function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx  = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mouse = { x: null, y: null };

  /* ── resize ── */
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    initHexGrid();
    initMatrixColumns();
  }

  /* ════ LAYER 1 — HEX GRID ════ */
  const HEX_R = 36;
  let hexCells = [];

  function initHexGrid() {
    hexCells = [];
    const hx = HEX_R * Math.sqrt(3);
    const hy = HEX_R * 1.5;
    for (let row = 0; row * hy < canvas.height + HEX_R * 2; row++) {
      for (let col = 0; col * hx < canvas.width + hx; col++) {
        hexCells.push({
          x:         col * hx + (row % 2 ? hx / 2 : 0),
          y:         row * hy,
          pulse:     0,
          nextPulse: Math.random() * 10000,
        });
      }
    }
  }

  function hexPath(cx, cy, r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a  = (Math.PI / 3) * i - Math.PI / 6;
      const px = cx + r * Math.cos(a);
      const py = cy + r * Math.sin(a);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function updateHexGrid(ts) {
    hexCells.forEach(c => {
      if (ts > c.nextPulse) {
        c.pulse     = 1;
        c.nextPulse = ts + 4000 + Math.random() * 14000;
      }
      if (c.pulse > 0) c.pulse = Math.max(0, c.pulse - 0.018);
    });
  }

  function drawHexGrid() {
    hexCells.forEach(c => {
      const a = 0.028 + c.pulse * 0.14;
      hexPath(c.x, c.y, HEX_R - 1);
      ctx.strokeStyle = `rgba(0,255,136,${a})`;
      ctx.lineWidth   = 0.6;
      ctx.stroke();
      if (c.pulse > 0.25) {
        ctx.beginPath();
        ctx.arc(c.x, c.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,136,${c.pulse * 0.7})`;
        ctx.fill();
      }
    });
  }

  /* ════ LAYER 2 — MATRIX RAIN ════ */
  const MATRIX_CHARS =
    'ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ' +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    '0123456789ABCDEF' +
    '!@#$%&*<>[]{}/\\|' +
    '01001101010110001';
  const FONT_SIZE = 13;
  let matrixCols  = [];

  function randChar() {
    return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
  }

  function initMatrixColumns() {
    matrixCols = [];
    const count = Math.floor(canvas.width / FONT_SIZE);
    for (let i = 0; i < count; i++) {
      if (Math.random() > 0.62) continue;
      const len = 10 + Math.floor(Math.random() * 22);
      matrixCols.push({
        x:           i * FONT_SIZE,
        y:           Math.random() * -canvas.height,
        speed:       0.5 + Math.random() * 1.6,
        chars:       Array.from({ length: len + 5 }, randChar),
        len,
        opacity:     0.07 + Math.random() * 0.20,
        mutateEvery: 60 + Math.random() * 120,
        mutateAcc:   0,
      });
    }
  }

  function updateMatrix(dt) {
    matrixCols.forEach(col => {
      col.y         += col.speed;
      col.mutateAcc += dt;
      if (col.mutateAcc > col.mutateEvery) {
        col.mutateAcc = 0;
        col.chars[Math.floor(Math.random() * col.chars.length)] = randChar();
      }
      if (col.y > canvas.height + col.len * FONT_SIZE) {
        col.y       = -(col.len * FONT_SIZE + Math.random() * canvas.height * 0.5);
        col.speed   = 0.5 + Math.random() * 1.6;
        col.opacity = 0.07 + Math.random() * 0.20;
        col.len     = 10 + Math.floor(Math.random() * 22);
      }
    });
  }

  function drawMatrix() {
    ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`;
    matrixCols.forEach(col => {
      for (let i = 0; i < col.len; i++) {
        const cy = col.y + i * FONT_SIZE;
        if (cy < -FONT_SIZE || cy > canvas.height) continue;
        const isHead  = i === col.len - 1;
        const fade    = isHead ? 1 : (1 - i / col.len) * 0.9;
        const bright  = isHead ? Math.min(col.opacity * 4, 1) : col.opacity * fade;
        ctx.fillStyle = isHead
          ? `rgba(180,255,220,${bright})`
          : `rgba(0,255,136,${bright})`;
        ctx.fillText(col.chars[i % col.chars.length], col.x, cy);
      }
    });
  }

  /* ════ LAYER 3 — RADAR SWEEP ════ */
  let radarAngle = 0;

  function drawRadar() {
    const cx = canvas.width  * 0.84;
    const cy = canvas.height * 0.18;
    const R  = Math.min(canvas.width, canvas.height) * 0.17;

    /* rings */
    [1, 0.66, 0.33].forEach((r, i) => {
      ctx.beginPath();
      ctx.arc(cx, cy, R * r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0,255,136,${i === 0 ? 0.10 : 0.05})`;
      ctx.lineWidth   = 0.7;
      ctx.stroke();
    });

    /* cross-hairs */
    ctx.strokeStyle = 'rgba(0,255,136,0.05)';
    ctx.lineWidth   = 0.7;
    [[cx - R, cy, cx + R, cy], [cx, cy - R, cx, cy + R]].forEach(([x1, y1, x2, y2]) => {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    });

    /* sweep fan */
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(radarAngle);
    const fan = ctx.createLinearGradient(0, 0, R, 0);
    fan.addColorStop(0,   'rgba(0,255,136,0.22)');
    fan.addColorStop(0.6, 'rgba(0,255,136,0.06)');
    fan.addColorStop(1,   'rgba(0,255,136,0)');
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, R, -Math.PI / 5, 0);
    ctx.closePath();
    ctx.fillStyle = fan;
    ctx.fill();
    /* sweep arm */
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(R, 0);
    ctx.strokeStyle = 'rgba(0,255,136,0.55)';
    ctx.lineWidth   = 1;
    ctx.stroke();
    ctx.restore();

    radarAngle += 0.007;
  }

  /* ════ LAYER 4 — DATA STREAMS ════ */
  let   dataStreams = [];
  let   streamAcc   = 0;
  const HEX_CHARS   = '0123456789ABCDEF';

  function hexToken(len) {
    return Array.from({ length: len }, () => HEX_CHARS[Math.floor(Math.random() * 16)]).join('');
  }

  function spawnStream() {
    const segments = 5 + Math.floor(Math.random() * 6);
    const text     = Array.from({ length: segments }, () =>
      `${hexToken(2)}:${hexToken(4)}`
    ).join('  ');
    dataStreams.push({
      x:       -ctx.measureText(text).width - 20,
      y:       Math.random() * canvas.height,
      speed:   1.2 + Math.random() * 2.2,
      text,
      alpha:   0.06 + Math.random() * 0.10,
      color:   Math.random() < 0.7 ? '0,212,255' : '0,255,136',
    });
  }

  function updateStreams(dt) {
    streamAcc += dt;
    if (streamAcc > 700 + Math.random() * 900) {
      streamAcc = 0;
      if (dataStreams.length < 10) spawnStream();
    }
    dataStreams = dataStreams.filter(s => s.x < canvas.width + 400);
    dataStreams.forEach(s => { s.x += s.speed; });
  }

  function drawStreams() {
    ctx.font = '9px JetBrains Mono, monospace';
    dataStreams.forEach(s => {
      ctx.fillStyle = `rgba(${s.color},${s.alpha})`;
      ctx.fillText(s.text, s.x, s.y);
    });
  }

  /* ════ LAYER 5 — PARTICLE NETWORK ════ */
  const P_COUNT  = window.innerWidth < 768 ? 45 : 80;
  const CONN_D   = 145;
  let   particles = [];

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x  = Math.random() * canvas.width;
      this.y  = initial ? Math.random() * canvas.height : (Math.random() > 0.5 ? -5 : canvas.height + 5);
      this.vx = (Math.random() - 0.5) * 0.38;
      this.vy = (Math.random() - 0.5) * 0.38;
      this.r  = Math.random() * 1.8 + 0.5;
      this.a  = Math.random() * 0.55 + 0.15;
      const rng = Math.random();
      this.color = rng < 0.62 ? '0,255,136' : rng < 0.86 ? '0,212,255' : '124,58,237';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (mouse.x !== null) {
        const dx = this.x - mouse.x, dy = this.y - mouse.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          const f = (100 - d) / 100;
          this.vx += (dx / d) * f * 0.45;
          this.vy += (dy / d) * f * 0.45;
          const sp = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
          if (sp > 2.4) { this.vx /= sp * 0.72; this.vy /= sp * 0.72; }
        }
      }
      if (this.x < -10 || this.x > canvas.width + 10 ||
          this.y < -10 || this.y > canvas.height + 10) this.reset();
    }
    draw() {
      /* glow halo */
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.a * 0.10})`;
      ctx.fill();
      /* core dot */
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.a})`;
      ctx.fill();
    }
  }

  function buildParticles() {
    particles = Array.from({ length: P_COUNT }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < CONN_D) {
          const a = (1 - d / CONN_D) * 0.22;
          ctx.strokeStyle = `rgba(0,255,136,${a})`;
          ctx.lineWidth   = 0.65;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  /* ════ LAYER 6 — SCAN LINE ════ */
  let scanY = 0, scanDir = 1;

  function drawScanLine() {
    const g = ctx.createLinearGradient(0, scanY - 3, 0, scanY + 3);
    g.addColorStop(0,   'rgba(0,255,136,0)');
    g.addColorStop(0.5, 'rgba(0,255,136,0.13)');
    g.addColorStop(1,   'rgba(0,255,136,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, scanY - 3, canvas.width, 6);
    scanY += scanDir * 1.1;
    if (scanY > canvas.height || scanY < 0) scanDir *= -1;
  }

  /* ════ LAYER 7 — CORNER BRACKETS ════ */
  let bracketT = 0;

  function drawBrackets() {
    bracketT += 0.018;
    const a   = 0.12 + Math.sin(bracketT) * 0.07;
    const sz  = 28, pad = 18;
    ctx.strokeStyle = `rgba(0,255,136,${a})`;
    ctx.lineWidth   = 1.5;
    [
      [pad,                    pad,                     1,  1],
      [canvas.width  - pad,    pad,                    -1,  1],
      [pad,                    canvas.height - pad,     1, -1],
      [canvas.width  - pad,    canvas.height - pad,    -1, -1],
    ].forEach(([x, y, sx, sy]) => {
      ctx.beginPath();
      ctx.moveTo(x, y + sy * sz);
      ctx.lineTo(x, y);
      ctx.lineTo(x + sx * sz, y);
      ctx.stroke();
    });

    /* small blinking cursor bottom-left */
    if (Math.sin(bracketT * 3) > 0) {
      ctx.font      = '11px JetBrains Mono, monospace';
      ctx.fillStyle = `rgba(0,255,136,${a * 1.4})`;
      ctx.fillText('█', pad + 2, canvas.height - pad - 2);
    }
  }

  /* ════ LAYER 8 — GLITCH ════ */
  let glitchAcc    = 0;
  let glitchFrames = 0;

  function maybeGlitch(dt) {
    glitchAcc += dt;
    if (glitchFrames === 0 && glitchAcc > 5000 + Math.random() * 9000) {
      glitchAcc    = 0;
      glitchFrames = 4 + Math.floor(Math.random() * 6);
    }
    if (glitchFrames > 0) {
      const slices = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < slices; i++) {
        const sy = Math.floor(Math.random() * canvas.height);
        const sh = 2 + Math.floor(Math.random() * 7);
        const dx = (Math.random() - 0.5) * 28;
        try {
          const data = ctx.getImageData(0, sy, canvas.width, sh);
          ctx.putImageData(data, dx, sy);
        } catch (_) {}
      }
      /* occasional horizontal color flash */
      if (Math.random() < 0.35) {
        const gy = Math.random() * canvas.height;
        ctx.fillStyle = `rgba(0,255,136,${Math.random() * 0.13})`;
        ctx.fillRect(0, gy, canvas.width, 1 + Math.random() * 3);
      }
      glitchFrames--;
    }
  }

  /* ════ MAIN LOOP ════ */
  let lastTs = 0;

  function frame(ts) {
    const dt = Math.min(ts - lastTs, 50);
    lastTs   = ts;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!reduced) {
      updateHexGrid(ts);   drawHexGrid();
      updateMatrix(dt);    drawMatrix();
                           drawRadar();
      updateStreams(dt);   drawStreams();
    }

    particles.forEach(p => p.update());
    drawConnections();
    particles.forEach(p => p.draw());

    if (!reduced) {
      drawScanLine();
      drawBrackets();
      maybeGlitch(dt);
    }

    requestAnimationFrame(frame);
  }

  resize();
  buildParticles();
  requestAnimationFrame(frame);

  window.addEventListener('resize', () => { resize(); buildParticles(); });
  canvas.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
}

/* ════════════════════════════════════════════════════════════
   TYPING ENGINE
   ════════════════════════════════════════════════════════════ */
function initTyping() {
  const el = document.getElementById('typing-target');
  if (!el) return;

  const titles = [
    'Junior SOC Analyst',
    'GRC Analyst',
    'Cyber Threat Intelligence',
    'Detection Engineer',
    'Blue Teamer'
  ];

  let idx = 0, charIdx = 0, deleting = false;
  const SPEED_TYPE = 80, SPEED_DEL = 40, PAUSE_END = 2200, PAUSE_START = 380;

  function tick() {
    const current = titles[idx];
    if (deleting) {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      SoundEngine.play('del');
      if (charIdx === 0) {
        deleting = false;
        idx = (idx + 1) % titles.length;
        setTimeout(tick, PAUSE_START);
        return;
      }
      setTimeout(tick, SPEED_DEL);
    } else {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      SoundEngine.play('type');
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, PAUSE_END);
        return;
      }
      setTimeout(tick, SPEED_TYPE);
    }
  }

  setTimeout(tick, 900);
}

/* ════════════════════════════════════════════════════════════
   GLITCH ENGINE
   ════════════════════════════════════════════════════════════ */
function initGlitch() {
  const name = document.querySelector('.hero-name');
  if (!name) return;

  function trigger() {
    name.classList.add('glitch');
    setTimeout(() => name.classList.remove('glitch'), 380);
    setTimeout(trigger, 5000 + Math.random() * 9000);
  }

  setTimeout(trigger, 3500);
}

/* ════════════════════════════════════════════════════════════
   NAVBAR
   ════════════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');
  if (!navbar) return;

  let lastY = 0, menuOpen = false;

  /* Scroll: solidify + hide-on-scroll-down */
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 60);
    if (y > lastY + 6 && y > 200) {
      navbar.classList.add('hidden');
    } else if (y < lastY - 6) {
      navbar.classList.remove('hidden');
    }
    lastY = y;
  }, { passive: true });

  /* Active link highlighting */
  const sections  = Array.from(document.querySelectorAll('section[id]'));
  const navLinks  = document.querySelectorAll('.nav-links .nav-link');

  let lastActiveSection = null;
  function setActive() {
    const mid = window.scrollY + window.innerHeight / 2;
    for (const section of sections) {
      if (mid >= section.offsetTop && mid < section.offsetTop + section.offsetHeight) {
        if (section.id !== lastActiveSection) {
          lastActiveSection = section.id;
          SoundEngine.play('section');
        }
        navLinks.forEach(l => l.classList.remove('active'));
        const match = document.querySelector(`.nav-links .nav-link[href="#${section.id}"]`);
        if (match) match.classList.add('active');
        break;
      }
    }
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  /* Nav link hover tick */
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => SoundEngine.play('tick'));
    link.addEventListener('click', () => SoundEngine.play('click'));
  });

  /* Mobile menu */
  function openMenu() {
    menuOpen = true;
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    const [s1, s2, s3] = hamburger.querySelectorAll('span');
    s1.style.transform = 'rotate(45deg) translate(5px, 5px)';
    s2.style.opacity   = '0';
    s3.style.transform = 'rotate(-45deg) translate(5px, -5px)';
  }

  function closeMenu() {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    hamburger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '';
    });
  }

  hamburger.addEventListener('click', () => {
    if (menuOpen) { SoundEngine.play('menuClose'); closeMenu(); }
    else          { SoundEngine.play('menuOpen');  openMenu();  }
  });
  mobileClose.addEventListener('click', () => { SoundEngine.play('menuClose'); closeMenu(); });

  mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });
}

/* ════════════════════════════════════════════════════════════
   SCROLL REVEAL
   ════════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ════════════════════════════════════════════════════════════
   SKILL TAGS — staggered appearance
   ════════════════════════════════════════════════════════════ */
function initSkillTags() {
  const rows = document.querySelectorAll('.skill-row');
  if (!rows.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const tags = entry.target.querySelectorAll('.skill-tag');
        tags.forEach((tag, i) => {
          setTimeout(() => tag.classList.add('tag-visible'), i * 55);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  rows.forEach(row => observer.observe(row));
}

/* ════════════════════════════════════════════════════════════
   EDUCATION TIMELINE — rail draw animation
   ════════════════════════════════════════════════════════════ */
function initTimeline() {
  const tl = document.getElementById('education-timeline');
  if (!tl) return;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      tl.classList.add('tl-visible');
      observer.disconnect();
    }
  }, { threshold: 0.15 });

  observer.observe(tl);
}

/* ════════════════════════════════════════════════════════════
   PROFILE PHOTO — show on load, monogram fallback
   ════════════════════════════════════════════════════════════ */
function initProfilePhoto() {
  const img      = document.getElementById('profile-img');
  const monogram = document.getElementById('profile-monogram');
  if (!img || !monogram) return;

  img.onload = () => {
    img.classList.add('loaded');
    monogram.style.display = 'none';
  };
  img.onerror = () => {
    img.style.display = 'none';
  };

  /* Trigger load check for already-cached images */
  if (img.complete && img.naturalWidth > 0) {
    img.onload();
  }
}

/* ════════════════════════════════════════════════════════════
   COPY EMAIL
   ════════════════════════════════════════════════════════════ */
function copyEmail(btn) {
  const text = btn.dataset.copy;
  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    SoundEngine.play('success');
    const icon = btn.querySelector('i');
    icon.className = 'fas fa-check';
    btn.classList.add('copied');
    setTimeout(() => {
      icon.className = 'fas fa-copy';
      btn.classList.remove('copied');
    }, 2000);
  }).catch(() => {
    /* Fallback for older browsers */
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
}

/* ════════════════════════════════════════════════════════════
   MODAL SYSTEM
   ════════════════════════════════════════════════════════════ */
function initModal() {
  const overlay    = document.getElementById('modal-overlay');
  const modal      = document.getElementById('modal');
  const closeBtn   = document.getElementById('modal-close');
  const cards      = document.querySelectorAll('.project-card');

  const elIconWrap = document.getElementById('modal-icon-wrap');
  const elIcon     = document.getElementById('modal-icon');
  const elCatLabel = document.getElementById('modal-category-label');
  const elTitle    = document.getElementById('modal-title');
  const elDesc     = document.getElementById('modal-description');
  const elHighWrap = document.getElementById('modal-highlights-wrap');
  const elHighList = document.getElementById('modal-highlights');
  const elTechWrap = document.getElementById('modal-tech-wrap');
  const elTechPills= document.getElementById('modal-tech-pills');
  const elMitreWrap= document.getElementById('modal-mitre-wrap');
  const elMitreGrid= document.getElementById('modal-mitre-grid');
  const elNote     = document.getElementById('modal-note');
  const elNoteText = document.getElementById('modal-note-text');
  const elActions  = document.getElementById('modal-actions');

  if (!overlay) return;

  let lastFocused = null;

  function populate(id) {
    const d = PROJECTS[id];
    if (!d) return;

    /* Header */
    elIconWrap.className = `modal-icon-wrap ${d.iconClass}`;
    elIcon.className = d.icon;
    elCatLabel.textContent = d.category;
    elTitle.textContent    = d.title;

    /* Description */
    elDesc.textContent = d.description;

    /* Highlights */
    elHighList.innerHTML = d.highlights
      .map(h => `<li>${h}</li>`)
      .join('');
    elHighWrap.style.display = d.highlights.length ? '' : 'none';

    /* Tech pills */
    elTechPills.innerHTML = d.tech
      .map(t => `<span class="tech-pill">${t}</span>`)
      .join('');
    elTechWrap.style.display = d.tech.length ? '' : 'none';

    /* MITRE */
    if (d.mitre.length) {
      elMitreGrid.innerHTML = d.mitre
        .map(m => `<span class="modal-mitre-item" title="${m.name}">${m.id} — ${m.name}</span>`)
        .join('');
      elMitreWrap.style.display = '';
    } else {
      elMitreWrap.style.display = 'none';
    }

    /* Note */
    if (d.note) {
      elNoteText.innerHTML = d.note;
      elNote.style.display = 'flex';
    } else {
      elNote.style.display = 'none';
    }

    /* Action buttons */
    elActions.innerHTML = '';
    if (d.github) {
      const a = document.createElement('a');
      a.href      = d.github;
      a.target    = '_blank';
      a.rel       = 'noopener noreferrer';
      a.className = 'btn-github';
      a.innerHTML = '<i class="fab fa-github"></i> View on GitHub';
      elActions.appendChild(a);
    } else {
      const note = document.createElement('p');
      note.style.cssText = 'font-family:var(--font-mono);font-size:0.8rem;color:var(--text-muted);';
      note.textContent = '// No public repository for this project.';
      elActions.appendChild(note);
    }
  }

  function open(id) {
    populate(id);
    SoundEngine.play('modalOpen');
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    modal.scrollTop = 0;
    setTimeout(() => closeBtn.focus(), 100);
  }

  function close() {
    SoundEngine.play('modalClose');
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (lastFocused) lastFocused.focus();
  }

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => SoundEngine.play('tick'));
    card.addEventListener('click', () => {
      lastFocused = card;
      open(card.dataset.project);
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        lastFocused = card;
        open(card.dataset.project);
      }
    });
  });

  closeBtn.addEventListener('click', close);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });
}

/* ════════════════════════════════════════════════════════════
   CV BUTTON — graceful disable if PDF not present
   ════════════════════════════════════════════════════════════ */
function initCvButton() {
  const btn = document.getElementById('cv-download-btn');
  if (!btn) return;

  fetch('assets/cv.pdf', { method: 'HEAD' })
    .then(r => {
      if (!r.ok) throw new Error('not found');
    })
    .catch(() => {
      btn.classList.add('unavailable');
      btn.removeAttribute('download');
      btn.removeAttribute('href');
      btn.title = 'CV coming soon';
    });
}

/* ════════════════════════════════════════════════════════════
   CONTACT FORM — mailto fallback, no backend required
   ════════════════════════════════════════════════════════════ */
function initContactForm() {
  const form    = document.getElementById('contact-form');
  const status  = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = form.querySelector('#cf-name');
    const email   = form.querySelector('#cf-email');
    const subject = form.querySelector('#cf-subject');
    const message = form.querySelector('#cf-message');
    let valid = true;

    [name, email, subject, message].forEach(el => {
      el.classList.remove('invalid');
      if (!el.value.trim()) { el.classList.add('invalid'); valid = false; }
    });

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value && !emailRx.test(email.value)) {
      email.classList.add('invalid'); valid = false;
    }

    if (!valid) {
      status.textContent = '// Please fill in all fields correctly.';
      status.className   = 'form-note error';
      SoundEngine.play('modalClose');
      return;
    }

    const body = `Name: ${name.value}\nEmail: ${email.value}\n\n${message.value}`;
    const mailto = `mailto:sm.shadman.hossain@gmail.com`
      + `?subject=${encodeURIComponent(subject.value)}`
      + `&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;

    SoundEngine.play('success');
    status.textContent = '// Opening your email client...';
    status.className   = 'form-note success';

    setTimeout(() => {
      form.reset();
      status.textContent = '';
      status.className   = 'form-note';
    }, 4000);
  });

  /* Clear invalid state on input */
  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => el.classList.remove('invalid'));
    el.addEventListener('focus', () => SoundEngine.play('tick'));
  });
}

/* ════════════════════════════════════════════════════════════
   SCROLL TO TOP
   ════════════════════════════════════════════════════════════ */
function initScrollToTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('mouseenter', () => SoundEngine.play('tick'));
  btn.addEventListener('click', () => {
    SoundEngine.play('click');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ════════════════════════════════════════════════════════════
   GSAP ENHANCEMENTS
   ════════════════════════════════════════════════════════════ */
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  /* Section labels slide in */
  gsap.utils.toArray('.section-label').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      opacity: 0,
      x: -20,
      duration: 0.55,
      ease: 'power2.out'
    });
  });

  /* Project grid stagger enhancement (supplements CSS) */
  gsap.utils.toArray('.project-card').forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.from(card, {
          duration: 0.6,
          delay: (i % 3) * 0.07,
          ease: 'power2.out'
        });
      }
    });
  });
}

/* ════════════════════════════════════════════════════════════
   BOOT
   ════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  initTyping();
  initGlitch();
  initNavbar();
  initScrollReveal();
  initSkillTags();
  initTimeline();
  initProfilePhoto();
  initModal();
  initGSAP();
  initSoundToggle();
  initCvButton();
  initContactForm();
  initScrollToTop();
});
