/* v27: Periodic Table */
const ELEMENTS = [
  // Row 1 — Identity (cols 1,18)
  {n:1,sym:'Sh',name:'Shadman',cat:'Identity',col:1,row:1,color:'#6366f1',desc:'Final-year Ethical Hacking & Cybersecurity student at Coventry University.'},
  {n:2,sym:'CU',name:'Coventry',cat:'Identity',col:18,row:1,color:'#6366f1',desc:'Coventry University — BSc Ethical Hacking & Cybersecurity, 2023–2026.'},

  // Row 2 — Projects
  {n:3,sym:'TW',name:'ThreatWeave',cat:'Project',col:1,row:2,color:'#6366f1',desc:'AI threat intel correlation engine. Go + Claude API + Redis.'},
  {n:4,sym:'SV',name:'SecureView',cat:'Project',col:2,row:2,color:'#6366f1',desc:'Real-time SOC dashboard with AI triage. React + TypeScript.'},
  {n:5,sym:'Sd',name:'SOC Lab',cat:'Project',col:13,row:2,color:'#6366f1',desc:'Detection engineering with Sigma rules. MITRE ATT&CK mapped.'},
  {n:6,sym:'IH',name:'IOC Hunter',cat:'Project',col:14,row:2,color:'#6366f1',desc:'CLI IOC aggregator. Python + VirusTotal + ThreatFox.'},
  {n:7,sym:'Ns',name:'NIST CSF',cat:'Project',col:15,row:2,color:'#6366f1',desc:'GRC gap analysis tool. NIST CSF 2.0 compliance automation.'},
  {n:8,sym:'AW',name:'AWS Health',cat:'Project',col:16,row:2,color:'#6366f1',desc:'Healthcare threat modelling. STRIDE + GDPR + AWS.'},

  // Row 3 — Languages
  {n:9, sym:'Py',name:'Python',   cat:'Language',col:1, row:3,color:'#ec4899',desc:'Primary language for security tools, automation, and scripting.'},
  {n:10,sym:'Go',name:'Golang',   cat:'Language',col:2, row:3,color:'#ec4899',desc:'High-performance CLI tools and backend security systems.'},
  {n:11,sym:'Ts',name:'TypeScript',cat:'Language',col:13,row:3,color:'#ec4899',desc:'Typed JavaScript for robust frontend security dashboards.'},
  {n:12,sym:'Rx',name:'React',    cat:'Language',col:14,row:3,color:'#ec4899',desc:'UI library for building interactive SOC dashboards.'},
  {n:13,sym:'Sq',name:'SQL',      cat:'Language',col:15,row:3,color:'#ec4899',desc:'Database queries for threat intel storage and analysis.'},
  {n:14,sym:'Bs',name:'Bash',     cat:'Language',col:16,row:3,color:'#ec4899',desc:'Shell scripting for automation and security pipelines.'},

  // Row 4 — Tools
  {n:15,sym:'Bk',name:'Burp Suite',cat:'Tool',col:1,row:4,color:'#22d3ee',desc:'Web application penetration testing and vulnerability scanning.'},
  {n:16,sym:'Nm',name:'Nmap',     cat:'Tool',col:2,row:4,color:'#22d3ee',desc:'Network discovery and security auditing tool.'},
  {n:17,sym:'Ms',name:'Metasploit',cat:'Tool',col:3,row:4,color:'#22d3ee',desc:'Penetration testing framework for exploiting vulnerabilities.'},
  {n:18,sym:'Sp',name:'Splunk',   cat:'Tool',col:4,row:4,color:'#22d3ee',desc:'SIEM platform for security monitoring and log analysis.'},
  {n:19,sym:'Dk',name:'Docker',   cat:'Tool',col:13,row:4,color:'#22d3ee',desc:'Containerization for portable security tool deployment.'},
  {n:20,sym:'Rd',name:'Redis',    cat:'Tool',col:14,row:4,color:'#22d3ee',desc:'In-memory data store for real-time threat intel pipelines.'},
  {n:21,sym:'Gi',name:'Git',      cat:'Tool',col:15,row:4,color:'#22d3ee',desc:'Version control for all projects and security tool development.'},
  {n:22,sym:'Vs',name:'VirusTotal',cat:'Tool',col:16,row:4,color:'#22d3ee',desc:'File and URL reputation analysis for IOC enrichment.'},

  // Row 5 — Frameworks
  {n:23,sym:'Mt',name:'MITRE',    cat:'Framework',col:1,row:5,color:'#a78bfa',desc:'MITRE ATT&CK framework for threat intelligence mapping.'},
  {n:24,sym:'Σσ',name:'Sigma',    cat:'Framework',col:2,row:5,color:'#a78bfa',desc:'Generic signature format for SIEM detection rule development.'},
  {n:25,sym:'Ya',name:'YARA',     cat:'Framework',col:3,row:5,color:'#a78bfa',desc:'Pattern matching language for malware identification.'},
  {n:26,sym:'Nf',name:'FastAPI',  cat:'Framework',col:4,row:5,color:'#a78bfa',desc:'High-performance Python web framework for security APIs.'},
  {n:27,sym:'St',name:'STRIDE',   cat:'Framework',col:13,row:5,color:'#a78bfa',desc:'Threat modelling methodology used in AWS healthcare case study.'},
  {n:28,sym:'Ow',name:'OWASP',    cat:'Framework',col:14,row:5,color:'#a78bfa',desc:'Open Web Application Security Project top 10 vulnerabilities.'},

  // Row 6 — Skills / GRC
  {n:29,sym:'Ti',name:'ThreatIntel',cat:'Skill',col:1,row:6,color:'#22c55e',desc:'Correlating IOCs from multiple threat intelligence feeds.'},
  {n:30,sym:'De',name:'DetectEng', cat:'Skill',col:2,row:6,color:'#22c55e',desc:'Building detection pipelines and Sigma rule libraries.'},
  {n:31,sym:'Ir',name:'IncResponse',cat:'Skill',col:3,row:6,color:'#22c55e',desc:'Incident response procedures and digital forensics.'},
  {n:32,sym:'Pt',name:'Pentest',   cat:'Skill',col:4,row:6,color:'#22c55e',desc:'Penetration testing web apps, networks, and APIs.'},
  {n:33,sym:'Gc',name:'GRC',       cat:'Skill',col:13,row:6,color:'#22c55e',desc:'Governance, risk and compliance frameworks and auditing.'},
  {n:34,sym:'Cl',name:'CloudSec',  cat:'Skill',col:14,row:6,color:'#22c55e',desc:'Cloud security architecture on AWS, IAM policies, threat modelling.'},

  // Row 7 — Certifications
  {n:35,sym:'CC',name:'CCNA',      cat:'Cert',col:1,row:7,color:'#f59e0b',desc:'Cisco Certified Network Associate. Networking fundamentals.'},
  {n:36,sym:'Op',name:'OSCP',      cat:'Cert',col:2,row:7,color:'#f59e0b',desc:'Offensive Security Certified Professional. Advanced pentesting.'},
  {n:37,sym:'Ci',name:'CISM',      cat:'Cert',col:3,row:7,color:'#f59e0b',desc:'Certified Information Security Manager. ISACA governance cert.'},
  {n:38,sym:'S+',name:'Security+', cat:'Cert',col:4,row:7,color:'#f59e0b',desc:'CompTIA Security+. Foundational cybersecurity certification.'},
];

const pt = document.getElementById('pt');
const infoBox = document.getElementById('info-box');

ELEMENTS.forEach(el => {
  const div = document.createElement('div');
  div.className = 'el';
  div.style.cssText = `--el-color:${el.color};grid-column:${el.col};grid-row:${el.row}`;
  div.innerHTML = `<span class="el-num">${el.n}</span><span class="el-symbol">${el.sym}</span><span class="el-name">${el.name}</span><span class="el-mass">${el.cat}</span>`;

  div.addEventListener('mouseenter', () => {
    document.querySelectorAll('.el').forEach(e=>e.classList.remove('active'));
    div.classList.add('active');
    document.getElementById('ib-num').textContent = `#${el.n} · ${el.cat.toUpperCase()}`;
    document.getElementById('ib-symbol').textContent = el.sym;
    document.getElementById('ib-symbol').style.color = el.color;
    document.getElementById('ib-name').textContent = el.name;
    document.getElementById('ib-cat').textContent = el.cat;
    document.getElementById('ib-desc').textContent = el.desc;
    infoBox.classList.add('show');
  });
  div.addEventListener('mouseleave', () => { infoBox.classList.remove('show'); div.classList.remove('active'); });
  pt.appendChild(div);
});
