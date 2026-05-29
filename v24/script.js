/* v24: Particle Constellation */
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let W, H, nodes = [], lines = [], animFrame;
let mouseX = -1000, mouseY = -1000;
let activeConstellation = 'projects';

const CONSTELLATIONS = {
  projects: {
    nodes: [
      {label:'ThreatWeave',type:'project',color:'#6366f1',badge:'Go · AI',desc:'AI-powered threat intelligence correlation engine aggregating IOCs from multiple feeds.'},
      {label:'SecureView',type:'project',color:'#06b6d4',badge:'React · TS',desc:'Real-time SOC dashboard with AI-assisted alert triage and incident analysis.'},
      {label:'SOC Lab',type:'project',color:'#f43f5e',badge:'Python · Sigma',desc:'Detection engineering with Sigma rules mapped to MITRE ATT&CK framework.'},
      {label:'IOC Hunter',type:'project',color:'#10b981',badge:'Python · APIs',desc:'CLI tool for aggregating and enriching indicators of compromise.'},
      {label:'NIST CSF',type:'project',color:'#f59e0b',badge:'GRC · NIST',desc:'Gap analysis and automated remediation roadmap for NIST CSF 2.0.'},
      {label:'AWS Health',type:'project',color:'#f97316',badge:'STRIDE · GDPR',desc:'Healthcare threat modelling case study with GDPR compliance analysis.'},
    ],
    links:[[0,1],[0,2],[1,3],[2,4],[3,5],[4,0],[1,5],[2,3]]
  },
  skills: {
    nodes: [
      {label:'Threat Intel',type:'skill',color:'#7aa2f7',badge:'Core',desc:'Threat intelligence correlation and IOC enrichment across multiple sources.'},
      {label:'Detection Eng',type:'skill',color:'#bb9af7',badge:'Core',desc:'Sigma rule development mapped to MITRE ATT&CK framework.'},
      {label:'Python',type:'skill',color:'#9ece6a',badge:'Dev',desc:'Primary development language for security tools and automation.'},
      {label:'Go',type:'skill',color:'#7dcfff',badge:'Dev',desc:'High-performance backend systems and CLI security tooling.'},
      {label:'React',type:'skill',color:'#f7768e',badge:'Frontend',desc:'Security dashboard UIs and interactive data visualizations.'},
      {label:'GRC',type:'skill',color:'#e0af68',badge:'Compliance',desc:'NIST CSF 2.0, ISO 27001, risk assessment, and compliance frameworks.'},
      {label:'AWS',type:'skill',color:'#ff9e64',badge:'Cloud',desc:'Cloud security architecture, threat modelling, and STRIDE methodology.'},
    ],
    links:[[0,1],[0,2],[1,3],[2,3],[3,4],[4,5],[5,6],[6,0],[1,6],[2,5]]
  },
  certs: {
    nodes: [
      {label:'CCNA',type:'cert',color:'#e0af68',badge:'Cisco',desc:'Cisco Certified Network Associate — Networking fundamentals and security.'},
      {label:'OSCP',type:'cert',color:'#f7768e',badge:'OffSec',desc:'Offensive Security Certified Professional — Advanced penetration testing.'},
      {label:'CISM',type:'cert',color:'#9ece6a',badge:'ISACA',desc:'Certified Information Security Manager — Security governance and risk.'},
      {label:'Security+',type:'cert',color:'#7dcfff',badge:'CompTIA',desc:'CompTIA Security+ — Foundational cybersecurity certification.'},
    ],
    links:[[0,1],[1,2],[2,3],[3,0],[0,2],[1,3]]
  },
  contact: {
    nodes: [
      {label:'Email',type:'contact',color:'#f43f5e',badge:'Direct',desc:'brownofficial69@gmail.com — Preferred for job opportunities and collaborations.'},
      {label:'GitHub',type:'contact',color:'#7aa2f7',badge:'Code',desc:'github.com/brownofficial69 — All public projects and open source contributions.'},
      {label:'LinkedIn',type:'contact',color:'#0ea5e9',badge:'Network',desc:'linkedin.com/in/shadman-hossain-5ab649223 — Professional network and profile.'},
      {label:'Coventry',type:'contact',color:'#bb9af7',badge:'University',desc:'Final year student — Ethical Hacking & Cybersecurity BSc — Expected 2026.'},
    ],
    links:[[0,1],[1,2],[2,3],[3,0],[0,2],[1,3]]
  }
};

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  buildConstellation(activeConstellation);
}
window.addEventListener('resize', resize);

// Background stars
const bgStars = Array.from({length:250},()=>({
  x:Math.random()*2000,y:Math.random()*1000,
  r:Math.random()*1.2+0.2,tw:Math.random()*Math.PI*2,
  a:0.2+Math.random()*0.5
}));

function buildConstellation(name) {
  const data = CONSTELLATIONS[name];
  const cx = W/2, cy = H/2;
  const count = data.nodes.length;
  const radius = Math.min(W,H)*0.28;

  nodes = data.nodes.map((n,i) => {
    const angle = (i/count)*Math.PI*2 - Math.PI/2;
    return {
      ...n,
      x: cx + Math.cos(angle)*radius*(0.7+Math.random()*0.6),
      y: cy + Math.sin(angle)*radius*(0.7+Math.random()*0.6),
      r: 8, hovered: false, vx:0, vy:0,
      tx: cx + Math.cos(angle)*radius*(0.7+Math.random()*0.6),
      ty: cy + Math.sin(angle)*radius*(0.7+Math.random()*0.6),
    };
  });
  lines = data.links;
}

let time = 0;
function draw() {
  time += 0.012;
  ctx.clearRect(0,0,W,H);

  // Background stars
  bgStars.forEach(s=>{
    const a = s.a*(0.6+Math.sin(time*1.2+s.tw)*0.4);
    ctx.fillStyle=`rgba(255,255,255,${a})`;
    ctx.beginPath();ctx.arc(s.x%W,s.y%H,s.r,0,Math.PI*2);ctx.fill();
  });

  // Drift nodes gently
  nodes.forEach(n => {
    n.tx += (Math.sin(time*0.5+n.x*0.01)*0.3);
    n.ty += (Math.cos(time*0.5+n.y*0.01)*0.3);
    n.x += (n.tx - n.x)*0.01;
    n.y += (n.ty - n.y)*0.01;
    const dx = mouseX-n.x, dy = mouseY-n.y;
    const dist = Math.sqrt(dx*dx+dy*dy);
    n.hovered = dist < 50;
  });

  // Lines
  lines.forEach(([a,b])=>{
    if(!nodes[a]||!nodes[b]) return;
    const na=nodes[a],nb=nodes[b];
    const grad=ctx.createLinearGradient(na.x,na.y,nb.x,nb.y);
    grad.addColorStop(0,na.color+'40');
    grad.addColorStop(1,nb.color+'40');
    ctx.strokeStyle=grad;
    ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(na.x,na.y);ctx.lineTo(nb.x,nb.y);ctx.stroke();
  });

  // Nodes
  nodes.forEach(n=>{
    const pulse = n.r + Math.sin(time*2+n.x*0.05)*2;
    // Glow
    const grd=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.hovered?60:35);
    grd.addColorStop(0,n.color+'60');grd.addColorStop(1,'transparent');
    ctx.fillStyle=grd;
    ctx.beginPath();ctx.arc(n.x,n.y,n.hovered?60:35,0,Math.PI*2);ctx.fill();
    // Core
    ctx.fillStyle=n.hovered?n.color:n.color+'cc';
    ctx.beginPath();ctx.arc(n.x,n.y,n.hovered?pulse+4:pulse,0,Math.PI*2);ctx.fill();
    // Label
    ctx.fillStyle=n.hovered?'#fff':'rgba(255,255,255,0.6)';
    ctx.font=`${n.hovered?600:400} ${n.hovered?13:11}px 'Space Grotesk'`;
    ctx.textAlign='center';
    ctx.fillText(n.label,n.x,n.y+pulse+16);
  });

  animFrame=requestAnimationFrame(draw);
}

// Mouse
canvas.addEventListener('mousemove',e=>{
  mouseX=e.clientX;mouseY=e.clientY;
  const hit=nodes.find(n=>{const dx=e.clientX-n.x,dy=e.clientY-n.y;return Math.sqrt(dx*dx+dy*dy)<55});
  if(hit){
    document.getElementById('panel-default').style.display='none';
    const pc=document.getElementById('panel-content');
    pc.style.display='block';
    document.getElementById('pc-badge').textContent=hit.badge;
    document.getElementById('pc-title').textContent=hit.label;
    document.getElementById('pc-desc').textContent=hit.desc;
    document.getElementById('pc-tags').innerHTML='<span>'+hit.badge+'</span>';
  } else {
    document.getElementById('panel-default').style.display='';
    document.getElementById('panel-content').style.display='none';
  }
});

// Constellation switcher
document.querySelectorAll('.cbar-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.cbar-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    activeConstellation=btn.dataset.const;
    buildConstellation(activeConstellation);
    document.getElementById('panel-default').style.display='';
    document.getElementById('panel-content').style.display='none';
  });
});

resize();
draw();
