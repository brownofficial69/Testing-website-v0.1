/* ============================================================
   v20: Interactive CLI Terminal Portfolio
   ============================================================ */

const output = document.getElementById('output');
const input = document.getElementById('input');
const body = document.getElementById('terminal-body');

const COMMANDS = {
  help: () => [
    '<span class="c-green c-bold">Available commands:</span>',
    '',
    '  <span class="c-cyan">about</span>        — Who I am',
    '  <span class="c-cyan">projects</span>     — View all projects',
    '  <span class="c-cyan">skills</span>       — Technical skills',
    '  <span class="c-cyan">certs</span>        — Certifications',
    '  <span class="c-cyan">contact</span>      — How to reach me',
    '  <span class="c-cyan">education</span>    — Academic background',
    '  <span class="c-cyan">experience</span>   — Work timeline',
    '  <span class="c-cyan">neofetch</span>     — System info',
    '  <span class="c-cyan">cat resume</span>   — Print resume summary',
    '  <span class="c-cyan">ls projects/</span> — List project files',
    '  <span class="c-cyan">whoami</span>       — Current user',
    '  <span class="c-cyan">clear</span>        — Clear terminal',
    '  <span class="c-cyan">theme</span>        — Toggle theme',
    '  <span class="c-cyan">history</span>      — Command history',
    ''
  ],

  about: () => [
    '',
    '<span class="c-blue c-bold">┌─ About Me ─────────────────────────────────┐</span>',
    '<span class="c-blue">│</span>',
    '<span class="c-blue">│</span>  <span class="c-green c-bold">Shadman Hossain</span>',
    '<span class="c-blue">│</span>  Cybersecurity Analyst & Threat Intelligence',
    '<span class="c-blue">│</span>',
    '<span class="c-blue">│</span>  Final-year Ethical Hacking & Cybersecurity',
    '<span class="c-blue">│</span>  student at Coventry University. I specialize',
    '<span class="c-blue">│</span>  in threat intel correlation, detection',
    '<span class="c-blue">│</span>  engineering, and GRC compliance frameworks.',
    '<span class="c-blue">│</span>',
    '<span class="c-blue">│</span>  My work bridges AI-powered security',
    '<span class="c-blue">│</span>  automation and traditional SOC operations.',
    '<span class="c-blue">│</span>',
    '<span class="c-blue">└─────────────────────────────────────────────┘</span>',
    ''
  ],

  projects: () => [
    '',
    '<span class="c-green c-bold">PROJECT REGISTRY</span>  <span class="c-dim">6 projects found</span>',
    '',
    '<div class="project-block"><span class="proj-name">01  ThreatWeave</span>\n<span class="proj-tech">    Go · Claude API · Redis</span>\n<span class="proj-desc">    AI threat intelligence correlation engine</span></div>',
    '<div class="project-block"><span class="proj-name">02  SecureView</span>\n<span class="proj-tech">    TypeScript · React · Vite · Claude API</span>\n<span class="proj-desc">    Real-time SOC monitoring dashboard</span></div>',
    '<div class="project-block"><span class="proj-name">03  SOC Detection Lab</span>\n<span class="proj-tech">    Python · Sigma YAML · MITRE ATT&CK</span>\n<span class="proj-desc">    Detection engineering with Sigma rules</span></div>',
    '<div class="project-block"><span class="proj-name">04  IOC Hunter</span>\n<span class="proj-tech">    Python · VirusTotal · ThreatFox</span>\n<span class="proj-desc">    CLI IOC aggregator and enrichment tool</span></div>',
    '<div class="project-block"><span class="proj-name">05  NIST CSF 2.0 Assessment</span>\n<span class="proj-tech">    GRC · NIST CSF · SVG</span>\n<span class="proj-desc">    Gap analysis and remediation roadmap</span></div>',
    '<div class="project-block"><span class="proj-name">06  AWS Healthcare AI Triage</span>\n<span class="proj-tech">    AWS · STRIDE · GDPR</span>\n<span class="proj-desc">    Healthcare threat modelling case study</span></div>',
    ''
  ],

  skills: () => {
    const skills = [
      ['Threat Intelligence', 95, '#9ece6a'],
      ['Detection Engineering', 90, '#7aa2f7'],
      ['Python / Go', 88, '#bb9af7'],
      ['Incident Response', 87, '#7dcfff'],
      ['GRC Compliance', 85, '#e0af68'],
      ['Cloud Security', 80, '#f7768e'],
      ['Web Security', 82, '#ff9e64'],
    ];
    const lines = ['', '<span class="c-green c-bold">SKILL DISTRIBUTION</span>', ''];
    skills.forEach(([name, val, color]) => {
      const filled = Math.round(val / 5);
      const bar = '█'.repeat(filled) + '░'.repeat(20 - filled);
      lines.push(`<div class="term-bar"><span class="term-bar-label">${name}</span><span style="color:${color}">${bar}</span><span class="term-bar-val">${val}%</span></div>`);
    });
    lines.push('');
    return lines;
  },

  certs: () => [
    '',
    '<span class="c-yellow c-bold">CERTIFICATIONS</span>',
    '',
    '  <span class="c-yellow">★</span> <span class="c-bold">CCNA</span>       <span class="c-dim">— Cisco Certified Network Associate</span>',
    '  <span class="c-yellow">★</span> <span class="c-bold">OSCP</span>       <span class="c-dim">— Offensive Security Certified Professional</span>',
    '  <span class="c-yellow">★</span> <span class="c-bold">CISM</span>       <span class="c-dim">— Certified Information Security Manager</span>',
    '  <span class="c-yellow">★</span> <span class="c-bold">Security+</span>  <span class="c-dim">— CompTIA Security+</span>',
    ''
  ],

  contact: () => [
    '',
    '<span class="c-purple c-bold">SECURE CHANNELS</span>',
    '',
    '  <span class="c-cyan">Email</span>     brownofficial69@gmail.com',
    '  <span class="c-cyan">GitHub</span>    github.com/brownofficial69',
    '  <span class="c-cyan">LinkedIn</span>  linkedin.com/in/shadman-hossain-5ab649223',
    ''
  ],

  education: () => [
    '',
    '<span class="c-blue c-bold">EDUCATION</span>',
    '',
    '  <span class="c-green">BSc Ethical Hacking & Cybersecurity</span>',
    '  Coventry University · 2023 – 2026',
    '  <span class="c-dim">Final year · Expected First Class Honours</span>',
    ''
  ],

  experience: () => [
    '',
    '<span class="c-orange c-bold">EXPERIENCE TIMELINE</span>',
    '',
    '  <span class="c-cyan">2026</span>  Security Research · AI Integration',
    '  <span class="c-cyan">2025</span>  AWS Case Study · CISM Certification',
    '  <span class="c-cyan">2024</span>  SecureView · OSCP Certified',
    '  <span class="c-cyan">2023</span>  ThreatWeave · University Begins',
    '  <span class="c-cyan">2022</span>  IOC Hunter · SOC Detection Lab',
    '  <span class="c-cyan">2021</span>  CCNA · First Security Tools',
    '  <span class="c-cyan">2020</span>  Started Cybersecurity Journey',
    ''
  ],

  neofetch: () => [
    '',
    '<span class="c-blue">         ▄▄▄▄▄▄▄</span>     <span class="c-green c-bold">shadman</span><span class="c-dim">@</span><span class="c-blue c-bold">portfolio</span>',
    '<span class="c-blue">       ▄█████████▄</span>   <span class="c-dim">──────────────────</span>',
    '<span class="c-blue">      ███████████▀</span>   <span class="c-cyan">OS:</span>      CyberSec Linux 6.0',
    '<span class="c-blue">     ████████████</span>    <span class="c-cyan">Host:</span>    Coventry University',
    '<span class="c-blue">     ▀███████████</span>    <span class="c-cyan">Kernel:</span>  EthicalHacking-5.x',
    '<span class="c-blue">      ▀█████████▀</span>    <span class="c-cyan">Shell:</span>   portfolio-bash 2.0',
    '<span class="c-blue">       ▀▀▀▀▀▀▀▀▀</span>    <span class="c-cyan">Uptime:</span>  3+ years',
    '                     <span class="c-cyan">Pkgs:</span>    25+ skills',
    '                     <span class="c-cyan">CPU:</span>     Threat Intel Engine',
    '                     <span class="c-cyan">Memory:</span>  6 projects loaded',
    '',
    '  <span style="background:#f7768e;color:#f7768e">██</span><span style="background:#ff9e64;color:#ff9e64">██</span><span style="background:#e0af68;color:#e0af68">██</span><span style="background:#9ece6a;color:#9ece6a">██</span><span style="background:#7dcfff;color:#7dcfff">██</span><span style="background:#7aa2f7;color:#7aa2f7">██</span><span style="background:#bb9af7;color:#bb9af7">██</span><span style="background:#f7768e;color:#f7768e">██</span>',
    ''
  ],

  whoami: () => ['', '<span class="c-green">shadman</span> <span class="c-dim">(Cybersecurity Analyst)</span>', ''],

  clear: () => { output.innerHTML = ''; return []; },

  theme: () => {
    document.body.classList.toggle('light-theme');
    return ['', '<span class="c-dim">Theme toggled.</span>', ''];
  },

  'cat resume': () => [
    '',
    '<span class="c-green c-bold">SHADMAN HOSSAIN — RESUME SUMMARY</span>',
    '<span class="c-dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>',
    '',
    '<span class="c-cyan">OBJECTIVE</span>',
    '  Junior SOC Analyst / Threat Intelligence role',
    '',
    '<span class="c-cyan">EDUCATION</span>',
    '  BSc Ethical Hacking & Cybersecurity, Coventry University',
    '',
    '<span class="c-cyan">KEY SKILLS</span>',
    '  Threat Intel · Detection Eng · Python · Go · GRC · AWS',
    '',
    '<span class="c-cyan">CERTIFICATIONS</span>',
    '  CCNA · OSCP · CISM · Security+',
    '',
    '<span class="c-cyan">PROJECTS</span>',
    '  6 major security projects (run `projects` for details)',
    ''
  ],

  'ls projects/': () => [
    '',
    '<span class="c-blue">threatweave/</span>  <span class="c-blue">secureview/</span>  <span class="c-blue">soc-detection-lab/</span>',
    '<span class="c-blue">ioc-hunter/</span>   <span class="c-blue">nist-csf-2.0/</span>  <span class="c-blue">aws-healthcare/</span>',
    ''
  ],

  history: () => {
    return ['', ...commandHistory.map((cmd, i) => `  <span class="c-dim">${i + 1}</span>  ${cmd}`), ''];
  }
};

// State
let commandHistory = [];
let historyIndex = -1;

// Process command
function processCommand(cmd) {
  const trimmed = cmd.trim().toLowerCase();

  // Add prompt + command to output
  addLine(`<span class="prompt-text">shadman@portfolio:~$</span> <span class="cmd-text">${escapeHtml(cmd)}</span>`);

  if (!trimmed) return;
  commandHistory.push(trimmed);
  historyIndex = commandHistory.length;

  const handler = COMMANDS[trimmed];
  if (handler) {
    const lines = handler();
    lines.forEach(line => addLine(line));
  } else {
    addLine(`<span class="c-red">Command not found: ${escapeHtml(trimmed)}</span>`);
    addLine('<span class="c-dim">Type "help" for available commands.</span>');
    addLine('');
  }
}

function addLine(html) {
  const div = document.createElement('div');
  div.className = 'line';
  div.innerHTML = html;
  output.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Input handling
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    processCommand(input.value);
    input.value = '';
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      input.value = commandHistory[historyIndex];
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      input.value = commandHistory[historyIndex];
    } else {
      historyIndex = commandHistory.length;
      input.value = '';
    }
  } else if (e.key === 'Tab') {
    e.preventDefault();
    const partial = input.value.trim().toLowerCase();
    const match = Object.keys(COMMANDS).find(c => c.startsWith(partial));
    if (match) input.value = match;
  } else if (e.key === 'l' && e.ctrlKey) {
    e.preventDefault();
    output.innerHTML = '';
  }
});

// Focus input on click
document.addEventListener('click', () => input.focus());

// Boot sequence
function boot() {
  const bootLines = [
    '<span class="c-dim">Initializing portfolio-os v20.0...</span>',
    '<span class="c-dim">Loading modules... <span class="c-green">OK</span></span>',
    '<span class="c-dim">Mounting projects... <span class="c-green">OK</span></span>',
    '<span class="c-dim">Starting security services... <span class="c-green">OK</span></span>',
    '',
    '<span class="c-blue c-bold">Welcome to Shadman\'s Portfolio Terminal</span>',
    '<span class="c-dim">Type <span class="c-cyan">help</span> to see available commands.</span>',
    ''
  ];

  let i = 0;
  const interval = setInterval(() => {
    if (i < bootLines.length) {
      addLine(bootLines[i]);
      i++;
    } else {
      clearInterval(interval);
      input.focus();
    }
  }, 120);
}

boot();
