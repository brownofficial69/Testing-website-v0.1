'use strict';

/* ══════════════════════════════════════
   FILE SYSTEM
══════════════════════════════════════ */
const FS = {
  '~': ['about.txt','skills.md','education.txt','certifications.txt','contact.txt','projects/','cv.pdf'],
  '~/projects': [
    'threatweave.md','secureview.md','soc-lab.md',
    'ioc-hunter.md','nist-csf.md','aws-arch.md'
  ]
};

let cwd = '~';

const FILES = {

'about.txt': `
<span class="hlw bold">╔══════════════════════════════════════════════╗</span>
<span class="hlw bold">║  SHADMAN HOSSAIN  ·  CYBER SECURITY ANALYST  ║</span>
<span class="hlw bold">╚══════════════════════════════════════════════╝</span>

<span class="hl">Location:</span>      Coventry, UK
<span class="hl">University:</span>    Coventry University
<span class="hl">Degree:</span>        BSc (Hons) Ethical Hacking & Cyber Security
<span class="hl">Status:</span>        Final Year · Expected First-Class Honours
<span class="hl">Average:</span>       <span class="hlg">76.67%</span>  ·  Research Project: <span class="hlg">87%</span>
<span class="hl">Target roles:</span>  Junior SOC Analyst · GRC Analyst · CTI Analyst

<span class="dim">────────────────────────────────────────────────</span>

Final-year cybersecurity student specialising in <span class="hlg">blue team
detection engineering</span>, <span class="hl">GRC compliance</span>, and <span class="hlg">AI-augmented
security tools</span>.

Work spans Wazuh-compatible Sigma rules, full NIST CSF 2.0
assessments, and building tools in Python and Go — including
a <span class="hlg">Claude API-powered threat intelligence correlation engine</span>.

Preparing for <span class="hla">ISC2 CC</span> (June 2026). Actively seeking junior
SOC / GRC / CTI roles in the UK.`,

'skills.md': `
<span class="hl">## Technical Skills</span>

<span class="hla">SOC & Detection</span>
  SIEM  ·  Wazuh  ·  ELK Stack  ·  Splunk  ·  Sigma Rules
  MITRE ATT&CK  ·  Log Analysis  ·  Incident Triage

<span class="hla">Offensive / Pen-test</span>
  Kali Linux  ·  Nmap  ·  Burp Suite  ·  Metasploit
  Wireshark  ·  OSINT  ·  Vulnerability Assessment

<span class="hla">GRC & Compliance</span>
  NIST CSF 2.0  ·  ISO 27001  ·  UK GDPR  ·  Threat Modelling
  Risk Assessment  ·  Supplier Due Diligence  ·  Audit Management

<span class="hla">Programming & Automation</span>
  Python  ·  Go  ·  Bash  ·  TypeScript  ·  Playwright  ·  pytest

<span class="hla">Cloud & Infrastructure</span>
  AWS S3  ·  AWS IAM  ·  AWS EC2  ·  Linux Admin  ·  Windows AD

<span class="hla">Frameworks</span>
  MITRE ATT&CK  ·  OWASP Top 10  ·  Cyber Kill Chain
  NIST RMF  ·  STRIDE`,

'education.txt': `
<span class="hl">## Education</span>

<span class="hlw bold">BSc (Hons) Ethical Hacking & Cyber Security</span>
<span class="hlg">Coventry University</span>  ·  Sep 2023 – Jul 2026
Expected First-Class Honours  ·  Average: <span class="hlg">76.67%</span>

  Module Grades:
  ┌──────────────────────────────────────┬──────┐
  │ Digital Security Risk & Audit        │  73% │
  │ Security Operations                  │  67% │
  │ Information Security Management      │  70% │
  │ Applied Cryptography                 │  75% │
  │ Advanced Penetration Testing         │  71% │
  │ Project Delivery                     │  76% │
  │ Research Project                     │  87% │
  └──────────────────────────────────────┴──────┘

<span class="hlw bold">BTEC Level 3 National Diploma in IT</span>
<span class="hlg">Birmingham Metropolitan College</span>  ·  Sep 2020 – Jul 2022
<span class="hla">Double Distinction Merit</span>

  IT Project Management  — Distinction
  Programming            — Distinction
  Mobile Apps            — Distinction
  Cyber Security & Incident Management`,

'certifications.txt': `
<span class="hl">## Certifications</span>

<span class="hla">[ UPCOMING ]</span>  <span class="hlw bold">ISC2 Certified in Cybersecurity (CC)</span>
Issuer:       ISC2
Exam Date:    11 June 2026
Status:       <span class="yellow">● SCHEDULED</span>

Description:
  Vendor-neutral security certification covering risk management,
  network security, security operations, and access controls.

<span class="dim">────────────────────────────────────────────────</span>

<span class="muted">[ PLANNED ]</span>   More certifications post-graduation 2026
              SOC operations · Threat hunting · GRC disciplines`,

'contact.txt': `
<span class="hl">## Contact</span>

<span class="hl">Email:</span>    <span class="hlg">sm.shadman.hossain@gmail.com</span>
<span class="hl">GitHub:</span>   <span class="hl">github.com/shaddiegit</span>
<span class="hl">LinkedIn:</span> <span class="hl">linkedin.com/in/shadman-hossain1206</span>
<span class="hl">Location:</span> Coventry, UK

<span class="dim">────────────────────────────────────────────────</span>

Open to <span class="hlg">Junior SOC Analyst</span>, <span class="hl">GRC Analyst</span>, and
<span class="hlg">Cyber Threat Intelligence</span> roles in the UK.

Run <span class="hla">mail shadman</span> to open email client.
Run <span class="hla">ssh github</span>   to open GitHub profile.
Run <span class="hla">ssh linkedin</span> to open LinkedIn profile.`,

/* ── PROJECT FILES ── */
'projects/threatweave.md': `
<span class="hlg bold">## ThreatWeave</span>  <span class="dim">[Go · Claude AI · MITRE ATT&CK]</span>

<span class="hl">Category:</span>  Threat Intelligence / CTI
<span class="hl">Language:</span>  Go
<span class="hl">Year:</span>      2026
<span class="hl">GitHub:</span>    <span class="hl">github.com/shaddiegit/threatweave</span>

<span class="hla">Overview:</span>
  AI-powered IOC correlation engine. Aggregates IOCs from multiple
  threat intelligence feeds and clusters them by shared ASN, temporal
  proximity, and overlapping MITRE ATT&CK tactics.
  Claude API generates professional CTI analyst narratives.

<span class="hla">Key Highlights:</span>
  ▸ Threat clustering by ASN + temporal proximity + MITRE tactics
  ▸ AI-generated threat actor profiles via Claude API
  ▸ Automated Markdown report export
  ▸ Static Go binary — no runtime dependencies
  ▸ MIT licensed

<span class="hla">MITRE ATT&CK:</span>
  T1071 · Application Layer Protocol
  T1041 · Exfiltration Over C2 Channel
  T1190 · Exploit Public-Facing Application`,

'projects/secureview.md': `
<span class="hlg bold">## SecureView</span>  <span class="dim">[TypeScript · React · Claude AI]</span>

<span class="hl">Category:</span>  SOC Dashboard / Blue Team
<span class="hl">Stack:</span>     TypeScript · React · Vite · Claude AI API
<span class="hl">Year:</span>      2026
<span class="hl">GitHub:</span>    <span class="hl">github.com/shaddiegit/secureview</span>

<span class="hla">Overview:</span>
  Full-stack SOC analyst dashboard. Live alert queue with realistic
  security scenarios. Claude API for AI-driven risk scoring and
  MITRE ATT&CK mapping. Automated incident report generation.

<span class="hla">Key Highlights:</span>
  ▸ Live alert queue — 5 realistic security scenarios
  ▸ AI-driven risk scoring via Claude API
  ▸ Automated incident reports with executive summaries
  ▸ IOC display with confidence ratings
  ▸ 17 unit tests (Vitest)

<span class="hla">MITRE ATT&CK:</span>
  T1059 · Command and Scripting Interpreter
  T1055 · Process Injection

<span class="dim">Run: npm install && npm run dev (requires Anthropic API key)</span>`,

'projects/soc-lab.md': `
<span class="hlg bold">## SOC Detection Lab</span>  <span class="dim">[Python · Sigma · Wazuh]</span>

<span class="hl">Category:</span>  Blue Team / Detection Engineering
<span class="hl">Stack:</span>     Python · Sigma YAML · Wazuh · pytest
<span class="hl">Year:</span>      2026
<span class="hl">GitHub:</span>    <span class="hl">github.com/shaddiegit/soc-detection-lab</span>

<span class="hla">Overview:</span>
  Simulates a realistic 4-stage intrusion campaign against a Linux
  web server. Detection rules in Sigma-compatible YAML, deployable
  directly to Wazuh. Full pytest validation suite.

<span class="hla">Kill Chain:</span>
  Stage 1: Reconnaissance
  Stage 2: Initial Access (SSH brute-force from 203.0.113.66)
  Stage 3: Privilege Escalation (sudo abuse)
  Stage 4: Data Exfiltration (90 MB over C2)

<span class="hla">MITRE ATT&CK:</span>
  T1110.001 · Brute Force: Password Guessing
  T1548.003 · Abuse Elevation: Sudo Caching
  T1041     · Exfiltration Over C2 Channel`,

'projects/ioc-hunter.md': `
<span class="hlg bold">## IOC Hunter</span>  <span class="dim">[Python · ThreatFox · AbuseIPDB]</span>

<span class="hl">Category:</span>  Threat Intelligence / CLI Tool
<span class="hl">Stack:</span>     Python · ThreatFox · URLhaus · AbuseIPDB · VirusTotal
<span class="hl">Year:</span>      2026
<span class="hl">GitHub:</span>    <span class="hl">github.com/shaddiegit/ioc-hunter</span>

<span class="hla">Overview:</span>
  CLI tool for SOC Tier 1 analysts. Auto-detects IOC type, queries
  4 threat feeds concurrently, normalises into unified verdicts.
  Exports console/JSON/HTML. CI/SOAR pipeline compatible.

<span class="hla">Key Highlights:</span>
  ▸ Concurrent queries: ThreatFox + URLhaus + AbuseIPDB + VirusTotal
  ▸ IOC auto-detection: IPv4 · domain · URL · MD5 · SHA-256
  ▸ Input hardening: CRLF/null-byte/ReDoS protection
  ▸ 19 automated tests (true-positive + security regression)
  ▸ --fail-on-malicious flag for CI/SOAR integration`,

'projects/nist-csf.md': `
<span class="hlg bold">## NIST CSF 2.0 Gap Assessment</span>  <span class="dim">[GRC · Compliance]</span>

<span class="hl">Category:</span>  GRC / Compliance
<span class="hl">Stack:</span>     NIST CSF 2.0 · UK GDPR · ISO 27001
<span class="hl">Year:</span>      2026
<span class="hl">GitHub:</span>    <span class="hl">github.com/shaddiegit/nist-csf-gap-assessment</span>

<span class="hla">Overview:</span>
  Professional GRC gap assessment for a fictional NHS pharmaceutical
  supplier (Meridian Health Logistics Ltd). All 6 CSF 2.0 functions
  assessed with quantitative maturity scoring.

<span class="hla">Deliverables:</span>
  ▸ Full assessment: Govern · Identify · Protect · Detect · Respond · Recover
  ▸ Maturity scores: current 1.32 → target 2.75 (scale 1–4)
  ▸ 2 High-severity root-cause blockers identified
  ▸ 3-phase remediation roadmap (0–12 months)
  ▸ UK GDPR Art.28 supplier due-diligence questionnaire
  ▸ SVG maturity radar chart`,

'projects/aws-arch.md': `
<span class="hlg bold">## AWS Healthcare AI Triage</span>  <span class="dim">[Cloud · STRIDE · GDPR]</span>

<span class="hl">Category:</span>  Cloud Security / Architecture Review
<span class="hl">Stack:</span>     AWS (S3, IAM, EC2) · STRIDE · GDPR Article 9
<span class="hl">Year:</span>      2022
<span class="hl">GitHub:</span>    <span class="dim">N/A — Case Study</span>

<span class="hla">Overview:</span>
  Led team threat-modelling of an AWS-hosted AI triage system for
  NHS use. STRIDE analysis across all components revealed critical
  GDPR Art.9 violations and OSINT re-identification risks.
  Findings led to strategic project cancellation, preventing ICO exposure.

<span class="hla">Key Findings:</span>
  ▸ GDPR Art.9 special-category data violation (biometric/health)
  ▸ OSINT re-identification risk in patient data pipeline
  ▸ 3 critical legal/privacy violations total
  ▸ Strategic cancellation recommended and accepted

<span class="dim">No public repository — work product is threat model + findings report.</span>`,

'cv.pdf': `<span class="red">binary file — cannot display</span>
<span class="dim">Try: ssh github (to find projects) or mail shadman (to request CV)</span>`

};

/* ══════════════════════════════════════
   TERMINAL ENGINE
══════════════════════════════════════ */
const output   = document.getElementById('term-output');
const input    = document.getElementById('term-input');
const display  = document.getElementById('term-display');
const promptEl = document.getElementById('prompt-text');

let cmdHistory  = [];
let historyIdx  = -1;
let inputBuffer = '';

function updatePrompt() {
  promptEl.textContent = `shadman@portfolio:${cwd}$ `;
}

/* Print a line to the terminal */
function print(text = '', cls = 'info') {
  const div = document.createElement('div');
  div.className = `out-line ${cls}`;
  div.innerHTML = text;
  output.appendChild(div);
  output.scrollTop = output.scrollHeight;
}

function printRaw(html, cls = 'info') { print(html, cls); }
function blank() { print('', 'blank'); }
function sep(char = '─', len = 55) { print(char.repeat(len), 'sep'); }

/* Print with typing effect */
function printTyped(lines, cls = 'info', delayMs = 18, onDone) {
  let i = 0;
  function next() {
    if (i >= lines.length) { if (onDone) onDone(); return; }
    print(lines[i++], cls);
    setTimeout(next, delayMs);
  }
  next();
}

/* Show the typed command in the output */
function echoCmd(cmd) {
  print(`shadman@portfolio:${cwd}$ <span class="hlw">${escHtml(cmd)}</span>`, 'cmd');
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* Autocomplete */
const ALL_CMDS = [
  'help','about','whoami','whois','ls','cat','cd','pwd','clear','cls',
  'history','nmap','traceroute','ping','ps','uptime','uname','date',
  'ssh','mail','echo','sudo','exit','git','vim','hashcat','nc'
];

function tabComplete(partial) {
  if (!partial) return null;
  const parts = partial.split(' ');
  if (parts.length === 1) {
    const matches = ALL_CMDS.filter(c => c.startsWith(parts[0]));
    return matches.length === 1 ? matches[0] : null;
  }
  if ((parts[0] === 'cat' || parts[0] === 'cd') && parts.length === 2) {
    const dir = cwd === '~' ? FS['~'] : FS['~/projects'];
    const matches = dir.filter(f => f.startsWith(parts[1]));
    return matches.length === 1 ? parts[0] + ' ' + matches[0] : null;
  }
  return null;
}

/* ══════════════════════════════════════
   COMMAND IMPLEMENTATIONS
══════════════════════════════════════ */
function cmdHelp() {
  blank();
  print('Available commands:', 'cyan');
  blank();
  const cmds = [
    ['about',               'Bio, location, goals'],
    ['whoami',              'Current user info'],
    ['whois shadman',       'WHOIS-style profile lookup'],
    ['ls [dir]',            'List directory contents'],
    ['cat [file]',          'Display file contents'],
    ['cd [dir]',            'Change directory'],
    ['pwd',                 'Print working directory'],
    ['nmap --scan skills',  'Port scan — skills edition'],
    ['traceroute career',   'Trace the career path'],
    ['ping coventry',       'Ping Coventry University'],
    ['ps aux',              'Running processes'],
    ['uptime',              'System uptime'],
    ['uname -a',            'System information'],
    ['date',                'Current date/time'],
    ['git log',             'Portfolio commit history'],
    ['ssh github',          'Open GitHub profile'],
    ['ssh linkedin',        'Open LinkedIn profile'],
    ['mail shadman',        'Open email client'],
    ['history',             'Command history'],
    ['clear / cls',         'Clear terminal'],
    ['vim',                 'You know what this does'],
    ['sudo rm -rf /',       'Bold choice'],
  ];
  cmds.forEach(([cmd, desc]) => {
    print(`  <span class="hlg">${cmd.padEnd(26)}</span><span class="dim">${desc}</span>`);
  });
  blank();
  print('Tip: Use <span class="hla">↑↓</span> for history · <span class="hla">TAB</span> to autocomplete', 'dim');
  blank();
}

function cmdAbout() {
  blank();
  const content = FILES['about.txt'];
  content.split('\n').forEach(l => print(l));
  blank();
}

function cmdWhoami() {
  blank();
  print('shadman', 'white');
  blank();
  print('uid=1000(shadman) gid=1000(security) groups=1000(security),', 'dim');
  print('4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),', 'dim');
  print('122(lpadmin),134(lxd),1001(cyber),1337(hacker)', 'dim');
  blank();
}

function cmdWhois() {
  blank();
  const lines = [
    'Whois query for: shadman.hossain',
    '─'.repeat(42),
    '',
    'Name:         Shadman Hossain',
    'Handle:       shaddiegit',
    'Organisation: Coventry University',
    'Country:      GB',
    'City:         Coventry',
    '',
    'Specialisation:',
    '  SOC Detection Engineering',
    '  GRC & Compliance (NIST CSF 2.0 / UK GDPR)',
    '  Cyber Threat Intelligence',
    '  AI-Augmented Security Tools',
    '',
    'Certifications:',
    '  ISC2 CC    [PENDING — 11 Jun 2026]',
    '',
    'Contact:',
    '  Email:    sm.shadman.hossain@gmail.com',
    '  GitHub:   github.com/shaddiegit',
    '  LinkedIn: linkedin.com/in/shadman-hossain1206',
    '',
    '% Last updated: 2026',
  ];
  lines.forEach((l,i) => {
    const cls = i===0 ? 'cyan' : i===1 ? 'sep' : i===0 ? 'dim' : 'info';
    print(l, i===0?'cyan':i===1?'sep':'info');
  });
  blank();
}

function cmdLs(args) {
  blank();
  const target = args[0] || '.';
  let dir;
  if (target === '.' || target === '') {
    dir = cwd === '~' ? FS['~'] : FS['~/projects'];
  } else if (target === 'projects/' || target === 'projects') {
    dir = FS['~/projects'];
  } else if (target === '~' || target === '/home/shadman') {
    dir = FS['~'];
  } else {
    print(`ls: cannot access '${escHtml(target)}': No such file or directory`, 'red');
    blank();
    return;
  }
  print(`total ${dir.length}`, 'dim');
  dir.forEach(f => {
    const isDir  = f.endsWith('/');
    const isExec = f.endsWith('.md') || f.endsWith('.txt');
    const color  = isDir ? 'cyan' : isExec ? 'info' : 'dim';
    const perms  = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
    const size   = isDir ? '4096' : (Math.floor(Math.random()*8+1)*512).toString();
    print(`${perms}  1 shadman security  ${size.padStart(5)}  2026  <span class="${color}">${f}</span>`);
  });
  blank();
}

function cmdCat(args) {
  if (!args[0]) { print('cat: missing file operand', 'red'); blank(); return; }
  blank();

  let path = args[0];
  if (!path.startsWith('projects/') && cwd === '~/projects') {
    path = 'projects/' + path;
  }

  const content = FILES[path] || FILES[args[0]];
  if (!content) {
    print(`cat: ${escHtml(args[0])}: No such file or directory`, 'red');
    blank();
    return;
  }
  content.split('\n').forEach(l => print(l));
  blank();
}

function cmdCd(args) {
  const target = args[0] || '~';
  if (target === '~' || target === '/home/shadman') {
    cwd = '~'; updatePrompt(); blank(); return;
  }
  if ((target === 'projects' || target === 'projects/') && cwd === '~') {
    cwd = '~/projects'; updatePrompt(); blank(); return;
  }
  if (target === '..' && cwd === '~/projects') {
    cwd = '~'; updatePrompt(); blank(); return;
  }
  print(`cd: ${escHtml(target)}: No such file or directory`, 'red');
  blank();
}

function cmdPwd() {
  blank();
  print(cwd === '~' ? '/home/shadman' : '/home/shadman/projects', 'white');
  blank();
}

function cmdNmap(args) {
  blank();
  print('Starting Nmap 7.94 ( https://nmap.org )', 'dim');
  print('Scanning shadman.hossain (127.0.0.1) [6 skill ports]', 'dim');
  blank();

  const ports = [
    { port:'22/tcp',   state:'open', svc:'blue-team',   ver:'Wazuh/SIEM/ELK/Sigma-Rules',          extra:'SOC Detection Engineering' },
    { port:'80/tcp',   state:'open', svc:'offensive',   ver:'Kali/Nmap/Burp/Metasploit',            extra:'Ethical Hacking & Pen-test' },
    { port:'443/tcp',  state:'open', svc:'grc',         ver:'NIST-CSF-2.0/ISO-27001/UK-GDPR',       extra:'Governance, Risk & Compliance' },
    { port:'8080/tcp', state:'open', svc:'programming', ver:'Python/Go/Bash/TypeScript/pytest',      extra:'Security Tooling & Automation' },
    { port:'8443/tcp', state:'open', svc:'cloud',       ver:'AWS-S3/IAM/EC2/Linux-Admin',           extra:'Cloud Infrastructure' },
    { port:'9443/tcp', state:'open', svc:'frameworks',  ver:'MITRE/OWASP/Kill-Chain/STRIDE',        extra:'Security Frameworks' },
  ];

  print('PORT       STATE  SERVICE       VERSION', 'cyan');
  print('─'.repeat(62), 'sep');

  let i = 0;
  function showNext() {
    if (i >= ports.length) {
      blank();
      print(`<span class="hlg">6 ports open</span>, <span class="dim">0 filtered</span>, <span class="dim">0 closed</span>`);
      print(`Nmap done: 1 host scanned in 0.${42 + Math.floor(Math.random()*10)}s`, 'dim');
      blank();
      return;
    }
    const p = ports[i++];
    print(`<span class="hla">${p.port.padEnd(11)}</span><span class="hlg">${p.state.padEnd(7)}</span><span class="hl">${p.svc.padEnd(14)}</span><span class="dim">${p.ver}</span>`);
    setTimeout(showNext, 80);
  }
  setTimeout(showNext, 200);
}

function cmdTraceroute() {
  blank();
  print('traceroute to career.shadman.hossain, 30 hops max', 'dim');
  blank();
  const hops = [
    { n:1,  host:'school',                  ms:'12.4',   note:'Birmingham, UK — secondary school' },
    { n:2,  host:'bmet.college',             ms:'8.2',    note:'Birmingham Metropolitan — BTEC L3 IT (DDM)' },
    { n:3,  host:'cyber.awareness.init',     ms:'15.6',   note:'First exposure to cybersecurity' },
    { n:4,  host:'coventry.university',      ms:'22.1',   note:'BSc Ethical Hacking & Cyber Security' },
    { n:5,  host:'detection.lab.sigma',      ms:'31.4',   note:'SOC Detection Lab — Sigma rules' },
    { n:6,  host:'ioc.hunter.cli',           ms:'28.8',   note:'IOC Hunter — multi-feed threat intel CLI' },
    { n:7,  host:'secureview.dashboard',     ms:'19.3',   note:'SecureView — AI-powered SOC dashboard' },
    { n:8,  host:'threatweave.go.ai',        ms:'41.2',   note:'ThreatWeave — Claude AI CTI engine' },
    { n:9,  host:'nist.csf.gap.assessment',  ms:'35.7',   note:'NIST CSF 2.0 — NHS supplier GRC' },
    { n:10, host:'isc2.cc.exam',             ms:'???',    note:'<span class="hla">11 June 2026 — INCOMING</span>' },
    { n:11, host:'junior.soc.grc.analyst',   ms:'???',    note:'<span class="hlg">DESTINATION — UK security role</span>' },
  ];

  let i = 0;
  function showHop() {
    if (i >= hops.length) { blank(); return; }
    const h = hops[i++];
    const ms = h.ms === '???' ? '<span class="hla">???</span>' : h.ms + ' ms';
    print(` ${String(h.n).padStart(2)}  <span class="hlg">${h.host.padEnd(30)}</span> ${ms.padEnd(14)}  <span class="dim">${h.note}</span>`);
    setTimeout(showHop, 100);
  }
  setTimeout(showHop, 150);
}

function cmdPing(args) {
  const host = args[0] || 'localhost';
  blank();
  print(`PING ${host} (193.82.132.1): 56 data bytes`, 'dim');
  const replies = [1,2,3,4];
  replies.forEach((n, i) => {
    setTimeout(() => {
      const ms = (8 + Math.random()*5).toFixed(3);
      print(`64 bytes from ${host}: icmp_seq=${n} ttl=54 time=<span class="hlg">${ms} ms</span>`);
      if (n === 4) {
        setTimeout(() => {
          blank();
          print(`--- ${host} ping statistics ---`, 'dim');
          print('4 packets transmitted, 4 received, 0% packet loss', 'dim');
          blank();
        }, 100);
      }
    }, i * 250);
  });
}

function cmdPs() {
  blank();
  print('USER       PID  %CPU  %MEM  COMMAND', 'cyan');
  print('─'.repeat(50), 'sep');
  const procs = [
    ['shadman', '1',    '0.0', '0.1', 'init -- cybersecurity_career'],
    ['shadman', '42',   '12.4','2.3', 'python3 ioc_hunter.py --live'],
    ['shadman', '87',   '8.2', '1.8', 'go run threatweave correlate'],
    ['shadman', '133',  '3.1', '0.9', 'wazuh-agent --monitor /var/log'],
    ['shadman', '256',  '0.4', '0.3', 'sigma-rules --validate *.yml'],
    ['shadman', '512',  '22.1','4.2', 'nmap -A -sV target_network'],
    ['shadman', '1024', '0.0', '0.1', 'study isc2_cc --mode intense'],
    ['shadman', '2048', '5.3', '1.2', 'bash grc_assessment.sh --nist'],
    ['shadman', '4096', '0.0', '0.0', 'grep -r "opportunities" ./uk-jobs'],
  ];
  procs.forEach(([u,p,c,m,cmd]) => {
    print(`${u.padEnd(11)}${p.padEnd(5)} ${c.padEnd(5)} ${m.padEnd(5)} <span class="hl">${cmd}</span>`);
  });
  blank();
}

function cmdUptime() {
  blank();
  const now = new Date();
  const yr = now.getFullYear();
  const months = (yr - 2003) * 12 + now.getMonth();
  print(`${now.toLocaleTimeString()} up ${Math.floor(months/12)} years, ${months%12} months,  load average: 0.92, 0.88, 0.91`, 'white');
  blank();
}

function cmdUname() {
  blank();
  print('ShadOS 5.15.0-cyber-security #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux', 'white');
  blank();
  print('Components:', 'dim');
  print('  Kernel:   blue-team-detection v2.6', 'dim');
  print('  Shell:    /bin/zsh (JetBrains Mono, 14pt)', 'dim');
  print('  Editor:   vim (insert mode, send help)', 'dim');
  print('  Browser:  w3m --mode hacker', 'dim');
  blank();
}

function cmdDate() {
  blank();
  print(new Date().toString(), 'white');
  blank();
}

function cmdGitLog() {
  blank();
  const commits = [
    ['e87b17f', 'v3: polish — Milky Way band, scroll zoom, corona rays'],
    ['1b7a8a0', 'Add Project Delivery Module — 76% to education'],
    ['b07bb9a', 'v3: 4K space explorer — realistic nebulae & 3D planets'],
    ['0261cbc', 'v2: brown/fire mode — bento grid, horizontal scroll'],
    ['99ed1f4', 'v1: CRT overlay, section dots, click ripple, glitch'],
    ['5591de8', 'v1: boot sequence, custom cursor, ambient tokens'],
    ['7d727b1', 'v1: full-page matrix rain'],
    ['4751d60', 'v1: per-section backgrounds + interactivity'],
    ['d5855fd', 'Initial commit — cybersecurity portfolio'],
  ];
  commits.forEach(([sha, msg]) => {
    const d = new Date(2026, Math.floor(Math.random()*5), Math.floor(Math.random()*28)+1);
    print(`<span class="hla">commit ${sha}</span>`);
    print(`Date:   ${d.toDateString()}`);
    print(`<span class="dim">    ${msg}</span>`);
    blank();
  });
}

function cmdSsh(args) {
  const host = args[0];
  if (host === 'github') {
    blank();
    print('Connecting to github.com/shaddiegit...', 'dim');
    setTimeout(() => {
      print('Connection established. Opening in browser.', 'hlg');
      blank();
      window.open('https://github.com/shaddiegit','_blank');
    }, 600);
  } else if (host === 'linkedin') {
    blank();
    print('Connecting to linkedin.com...', 'dim');
    setTimeout(() => {
      print('Connection established. Opening in browser.', 'hlg');
      blank();
      window.open('https://www.linkedin.com/in/shadman-hossain1206','_blank');
    }, 600);
  } else if (!host) {
    print('Usage: ssh [github|linkedin]', 'yellow');
    blank();
  } else {
    print(`ssh: connect to host ${escHtml(host)}: Connection refused`, 'red');
    blank();
  }
}

function cmdMail() {
  blank();
  print('Opening email client...', 'dim');
  setTimeout(() => {
    print('Composing message to: sm.shadman.hossain@gmail.com', 'hlg');
    blank();
    window.location.href = 'mailto:sm.shadman.hossain@gmail.com?subject=Portfolio%20Enquiry';
  }, 500);
}

function cmdClear() {
  output.innerHTML = '';
}

function cmdSudo(args) {
  blank();
  if (args.join(' ').includes('rm -rf')) {
    print('[sudo] password for shadman: ', 'yellow');
    setTimeout(() => {
      print('shadman is not in the sudoers file. This incident will be reported.', 'red');
      blank();
    }, 800);
  } else {
    print('[sudo] password for shadman: ', 'yellow');
    setTimeout(() => {
      print('Sorry, try again.', 'red');
      blank();
    }, 1200);
  }
}

function cmdVim() {
  blank();
  print('VIM - Vi IMproved 9.0', 'dim');
  print('type :q! to quit... just kidding, you are already stuck.', 'yellow');
  setTimeout(() => print(':q!', 'dim'), 1000);
  setTimeout(() => { print('E37: No write since last change (add ! to override)', 'red'); blank(); }, 1800);
}

function cmdHashcat() {
  blank();
  print('hashcat (v6.2.6)', 'dim');
  print('Session.........: portfolio', 'dim');
  print('Status..........: <span class="hlg">Cracking opportunities in the UK...</span>');
  blank();
  print('<span class="dim">FOUND:</span> junior_soc_analyst:coventry2026', 'white');
  blank();
}

function cmdNc(args) {
  if (args.includes('-l') || args.includes('4444')) {
    blank();
    print('listening on [any] 4444 ...', 'dim');
    setTimeout(() => {
      print('connect to [127.0.0.1] from portfolio.recruiter.co.uk', 'hlg');
      print('> Hello, I am interested in your cybersecurity skills.', 'white');
      blank();
    }, 1200);
  } else {
    print('nc: usage: nc [-l] [-p port] [host] [port]', 'dim');
    blank();
  }
}

function cmdEcho(args) {
  blank();
  print(escHtml(args.join(' ')), 'white');
  blank();
}

function cmdExit() {
  blank();
  print('logout', 'dim');
  setTimeout(() => {
    print('Connection to portfolio closed.', 'dim');
    blank();
    setTimeout(() => window.location.href = '../', 2000);
  }, 500);
}

function cmdUnknown(cmd) {
  blank();
  print(`-bash: ${escHtml(cmd)}: command not found`, 'red');
  print(`Try <span class="hla">help</span> for a list of available commands.`, 'dim');
  blank();
}

/* ══════════════════════════════════════
   COMMAND DISPATCHER
══════════════════════════════════════ */
function dispatch(raw) {
  const trimmed = raw.trim();
  if (!trimmed) { blank(); return; }

  cmdHistory.unshift(trimmed);
  historyIdx = -1;

  echoCmd(trimmed);

  const [cmd, ...args] = trimmed.split(/\s+/);

  switch (cmd.toLowerCase()) {
    case 'help':      case '?':         cmdHelp(); break;
    case 'about':                        cmdAbout(); break;
    case 'whoami':                       cmdWhoami(); break;
    case 'whois':                        cmdWhois(); break;
    case 'ls':        case 'dir':       cmdLs(args); break;
    case 'cat':       case 'type':      cmdCat(args); break;
    case 'cd':                           cmdCd(args); break;
    case 'pwd':                          cmdPwd(); break;
    case 'nmap':                         cmdNmap(args); break;
    case 'traceroute':                   cmdTraceroute(); break;
    case 'ping':                         cmdPing(args); break;
    case 'ps':                           cmdPs(); break;
    case 'uptime':                       cmdUptime(); break;
    case 'uname':                        cmdUname(); break;
    case 'date':                         cmdDate(); break;
    case 'git':       if(args[0]==='log') cmdGitLog(); else print(`git: '${escHtml(args[0]||'')}' not a git command`,'red'); blank(); break;
    case 'ssh':                          cmdSsh(args); break;
    case 'mail':      case 'mailto':    cmdMail(); break;
    case 'clear':     case 'cls':       cmdClear(); break;
    case 'history':
      blank();
      cmdHistory.slice(1).forEach((c,i) => print(`  ${String(cmdHistory.length-i-1).padStart(3)}  ${escHtml(c)}`, 'dim'));
      blank(); break;
    case 'sudo':                         cmdSudo(args); break;
    case 'vim':  case 'vi': case 'nano': cmdVim(); break;
    case 'hashcat':                      cmdHashcat(); break;
    case 'nc':                           cmdNc(args); break;
    case 'echo':                         cmdEcho(args); break;
    case 'exit':  case 'logout':        cmdExit(); break;
    case 'skills':    cmdCat(['skills.md']); break;
    case 'projects':  cmdLs(['projects/']); break;
    case 'education': cmdCat(['education.txt']); break;
    case 'contact':   cmdCat(['contact.txt']); break;
    default:          cmdUnknown(cmd);
  }
}

/* ══════════════════════════════════════
   INPUT HANDLING
══════════════════════════════════════ */
function syncDisplay() {
  display.textContent = inputBuffer;
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    dispatch(inputBuffer);
    inputBuffer = '';
    syncDisplay();
    return;
  }
  if (e.key === 'Backspace') {
    inputBuffer = inputBuffer.slice(0, -1);
    syncDisplay();
    return;
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (historyIdx < cmdHistory.length - 1) {
      historyIdx++;
      inputBuffer = cmdHistory[historyIdx] || '';
      syncDisplay();
    }
    return;
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIdx > 0) {
      historyIdx--;
      inputBuffer = cmdHistory[historyIdx] || '';
    } else {
      historyIdx = -1;
      inputBuffer = '';
    }
    syncDisplay();
    return;
  }
  if (e.key === 'Tab') {
    e.preventDefault();
    const completed = tabComplete(inputBuffer);
    if (completed) { inputBuffer = completed; syncDisplay(); }
    return;
  }
  if (e.key === 'c' && e.ctrlKey) {
    print(`^C`, 'dim');
    inputBuffer = '';
    syncDisplay();
    return;
  }
  if (e.key === 'l' && e.ctrlKey) {
    e.preventDefault();
    cmdClear();
    return;
  }
  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
    inputBuffer += e.key;
    syncDisplay();
  }
});

/* Click on terminal to focus */
document.getElementById('term-wrap').addEventListener('click', () => {
  input.focus();
  document.getElementById('term-wrap').focus();
});

/* Sidebar quick-command buttons */
document.querySelectorAll('.cmd-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const cmd = btn.dataset.cmd;
    inputBuffer = cmd;
    syncDisplay();
    setTimeout(() => {
      dispatch(cmd);
      inputBuffer = '';
      syncDisplay();
    }, 80);
  });
});

/* ══════════════════════════════════════
   LIVE CLOCK
══════════════════════════════════════ */
function updateClock() {
  const el = document.getElementById('sb-time');
  if (el) el.textContent = new Date().toLocaleTimeString('en-GB', { hour12:false });
}
updateClock();
setInterval(updateClock, 1000);

/* ══════════════════════════════════════
   BOOT SEQUENCE
══════════════════════════════════════ */
function boot() {
  const bootLines = [
    { t:'dim',    s:'ShadOS v4.0 — Cybersecurity Terminal' },
    { t:'dim',    s:'─'.repeat(50) },
    { t:'dim',    s:'' },
    { t:'dim',    s:'[    0.000000] Booting Linux kernel 5.15.0-cyber-security' },
    { t:'dim',    s:'[    0.142381] Initialising cybersecurity modules... OK' },
    { t:'dim',    s:'[    0.287532] Mounting /dev/talent on /mnt/career... OK' },
    { t:'dim',    s:'[    0.412847] Starting SIEM services (Wazuh/ELK)... OK' },
    { t:'dim',    s:'[    0.531209] Loading sigma rule engine... OK' },
    { t:'dim',    s:'[    0.678341] Connecting to threat feeds... OK' },
    { t:'yellow', s:'[    0.802651] WARNING: cv.pdf not found — button disabled' },
    { t:'dim',    s:'[    0.921437] ISC2 CC exam countdown: 13 days' },
    { t:'dim',    s:'[    1.042831] All systems operational.' },
    { t:'dim',    s:'' },
    { t:'white',  s:'┌─────────────────────────────────────────────────┐' },
    { t:'white',  s:'│                                                 │' },
    { t:'white',  s:'│   ██████╗ ██╗  ██╗    ██████╗ ██████╗ ██████╗  │' },
    { t:'white',  s:'│  ██╔════╝ ██║  ██║   ██╔════╝██╔═══██╗╚════██╗ │' },
    { t:'white',  s:'│  ╚█████╗  ███████║   ██║     ██║   ██║ █████╔╝ │' },
    { t:'white',  s:'│   ╚═══██╗ ██╔══██║   ██║     ██║   ██║ ╚═══██╗ │' },
    { t:'white',  s:'│  ██████╔╝ ██║  ██║   ╚██████╗╚██████╔╝██████╔╝ │' },
    { t:'white',  s:'│  ╚═════╝  ╚═╝  ╚═╝    ╚═════╝ ╚═════╝ ╚═════╝  │' },
    { t:'white',  s:'│                                                 │' },
    { t:'cyan',   s:'│   SHADMAN HOSSAIN  ·  CYBERSECURITY PORTFOLIO   │' },
    { t:'dim',    s:'│   Junior SOC · GRC Analyst · CTI · Coventry UK  │' },
    { t:'white',  s:'│                                                 │' },
    { t:'white',  s:'└─────────────────────────────────────────────────┘' },
    { t:'dim',    s:'' },
    { t:'info',   s:'Type <span class="hla">help</span> to see available commands.' },
    { t:'info',   s:'Type <span class="hla">about</span> for a quick intro, or <span class="hla">ls projects/</span> to dive in.' },
    { t:'dim',    s:'' },
  ];

  let i = 0;
  function nextLine() {
    if (i >= bootLines.length) return;
    const l = bootLines[i++];
    print(l.s, l.t);
    const delay = l.t === 'dim' && l.s.startsWith('[') ? 45 : l.t === 'white' ? 25 : 60;
    setTimeout(nextLine, delay);
  }
  nextLine();
}

/* Start */
boot();
