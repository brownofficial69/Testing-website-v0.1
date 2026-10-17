/* v26: CRT Phosphor */
const bootLines = [
  'BIOS v2.26.0 ...OK','RAM CHECK: 640KB ...OK','LOADING PORTFOLIO.EXE ...',
  'AUTHENTICATING OPERATOR ...','ACCESS GRANTED.',''
];

const ASCII = `
 ██████╗██╗   ██╗██████╗ ███████╗███████╗ ██████╗
██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔════╝██╔════╝
██║      ╚████╔╝ ██████╔╝█████╗  ███████╗██║
██║       ╚██╔╝  ██╔══██╗██╔══╝  ╚════██║██║
╚██████╗   ██║   ██████╔╝███████╗███████║╚██████╗
 ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚══════╝ ╚═════╝`.trim();

const CONTENT = `
<div class="section">
  <div class="section-title">[CASE FILES // PROJECTS]</div>
  <div class="project-row"><span class="proj-id">CASE-001</span><span>ThreatWeave — AI threat intel correlation engine</span><span class="proj-stack">Go · Claude API</span></div>
  <div class="project-row"><span class="proj-id">CASE-002</span><span>SecureView — Real-time SOC monitoring dashboard</span><span class="proj-stack">React · TypeScript</span></div>
  <div class="project-row"><span class="proj-id">CASE-003</span><span>SOC Detection Lab — Sigma rules + MITRE ATT&CK</span><span class="proj-stack">Python · Sigma</span></div>
  <div class="project-row"><span class="proj-id">CASE-004</span><span>IOC Hunter — CLI IOC aggregator</span><span class="proj-stack">Python · APIs</span></div>
  <div class="project-row"><span class="proj-id">CASE-005</span><span>Supply Chain Risk Framework</span><span class="proj-stack">GRC · NIST</span></div>
  <div class="project-row"><span class="proj-id">CASE-006</span><span>ADAM / EVE / Mizan</span><span class="proj-stack">AI Agents · Evals</span></div>
</div>
<div class="section">
  <div class="section-title">[SKILL MATRIX]</div>
  <div class="skill-row">
    <span class="skill-tag">Threat Intel</span><span class="skill-tag">Sigma</span><span class="skill-tag">YARA</span><span class="skill-tag">MITRE</span>
    <span class="skill-tag">Python</span><span class="skill-tag">Go</span><span class="skill-tag">React</span><span class="skill-tag">Docker</span>
    <span class="skill-tag">NIST CSF</span><span class="skill-tag">ISO 27001</span><span class="skill-tag">AWS</span><span class="skill-tag">Burp Suite</span>
  </div>
</div>
<div class="section">
  <div class="section-title">[EDUCATION]</div>
  <div class="cert-row"><span class="cert-item">BSc 1st</span><span class="cert-item">Claude Academy</span><span class="cert-item">BTEC L3</span><span class="cert-item">FDM</span></div>
</div>
<div class="section">
  <div class="section-title">[SECURE CHANNELS]</div>
  <div class="contact-row"><span>EMAIL  ► </span>sm.shadman.hossain@gmail.com</div>
  <div class="contact-row"><span>GITHUB ► </span>github.com/shaddiegit</div>
  <div class="contact-row"><span>LINKED ► </span>linkedin.com/in/shadman-hossain</div>
</div>`;

const TYPEOUTS = ['RUN THREATWEAVE.EXE','LIST PROJECTS /ALL','GREP -r "cybersec" ./skills','nmap -sV localhost'];

async function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
async function typeText(el, text, delay=30){
  for(const ch of text){ el.innerHTML += ch === '\n' ? '<br/>' : ch; await sleep(delay); }
}

async function boot(){
  const bootText = document.getElementById('boot-text');
  const bootCursor = document.getElementById('boot-cursor');
  for(const line of bootLines){
    const span = document.createElement('span');
    span.className='line';
    span.textContent=line;
    bootText.appendChild(span);
    await sleep(180 + Math.random()*120);
  }
  await sleep(400);
  document.getElementById('boot-screen').classList.add('hidden');
  const ts = document.getElementById('terminal-screen');
  ts.classList.remove('hidden');
  document.getElementById('ascii-title').textContent = ASCII;
  document.getElementById('sections').innerHTML = CONTENT;
  // Rolling type-out
  const to = document.getElementById('type-out');
  let i=0;
  setInterval(async()=>{
    to.textContent='';
    await typeText(to, TYPEOUTS[i%TYPEOUTS.length], 50);
    i++;
  }, 4000);
}
boot();
