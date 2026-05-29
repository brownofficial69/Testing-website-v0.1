/* v29: Solar System — Canvas orbit simulation */
const canvas = document.getElementById('space');
const ctx = canvas.getContext('2d');
let W, H, cx, cy;

const PLANETS = [
  {name:'ThreatWeave', label:'Project', r:22, orbit:120, speed:0.008, color:'#6366f1', glow:'#6366f1', desc:'AI-powered threat intel correlation engine aggregating IOCs from multiple feeds.', tags:['Go','Claude API','Redis']},
  {name:'SecureView',  label:'Project', r:18, orbit:180, speed:0.006, color:'#06b6d4', glow:'#06b6d4', desc:'Real-time SOC monitoring dashboard with AI-assisted alert triage.', tags:['React','TypeScript']},
  {name:'SOC Lab',     label:'Project', r:20, orbit:240, speed:0.005, color:'#f43f5e', glow:'#f43f5e', desc:'Detection engineering with Sigma rules mapped to MITRE ATT&CK.', tags:['Python','Sigma']},
  {name:'IOC Hunter',  label:'Project', r:14, orbit:290, speed:0.009, color:'#10b981', glow:'#10b981', desc:'CLI IOC aggregation and enrichment tool.', tags:['Python','APIs']},
  {name:'NIST CSF',    label:'GRC',     r:16, orbit:340, speed:0.004, color:'#f59e0b', glow:'#f59e0b', desc:'Governance gap analysis tool with automated NIST CSF 2.0 roadmap.', tags:['GRC','NIST']},
  {name:'AWS Health',  label:'Cloud',   r:15, orbit:390, speed:0.003, color:'#f97316', glow:'#f97316', desc:'Healthcare threat modelling: STRIDE + GDPR + AWS architecture.', tags:['AWS','STRIDE','GDPR']},
  {name:'OSCP',        label:'Cert',    r:12, orbit:440, speed:0.007, color:'#fbbf24', glow:'#fbbf24', desc:'Offensive Security Certified Professional certification.', tags:['OffSec']},
  {name:'CISM',        label:'Cert',    r:11, orbit:480, speed:0.0055,color:'#a78bfa', glow:'#a78bfa', desc:'Certified Information Security Manager. ISACA governance cert.', tags:['ISACA']},
];

// Background stars
const stars = Array.from({length:400},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.5+0.3,a:Math.random()*0.8+0.2}));
let time=0, hovered=null;

function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;cx=W/2;cy=H/2;}
resize(); window.addEventListener('resize',resize);

// Init angles
PLANETS.forEach((p,i)=>{p.angle = (i/PLANETS.length)*Math.PI*2;});

function draw(){
  time+=0.016;
  ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);

  // Stars
  stars.forEach(s=>{
    ctx.fillStyle=`rgba(255,255,255,${s.a*(0.6+Math.sin(time+s.x*100)*0.4)})`;
    ctx.beginPath();ctx.arc(s.x*W,s.y*H,s.r,0,Math.PI*2);ctx.fill();
  });

  // Sun (central star = identity)
  const sunGrd=ctx.createRadialGradient(cx,cy,0,cx,cy,60);
  sunGrd.addColorStop(0,'#fff9c4');sunGrd.addColorStop(0.4,'#ffb300');sunGrd.addColorStop(1,'transparent');
  ctx.fillStyle=sunGrd;ctx.beginPath();ctx.arc(cx,cy,60,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';ctx.font='bold 14px Space Grotesk';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText('SH',cx,cy-4);ctx.font='10px Space Grotesk';ctx.fillStyle='rgba(255,255,200,0.7)';ctx.fillText('2026',cx,cy+8);

  // Orbits + planets
  PLANETS.forEach(p=>{
    p.angle+=p.speed;
    const px=cx+Math.cos(p.angle)*p.orbit;
    const py=cy+Math.sin(p.angle)*p.orbit;
    p.sx=px;p.sy=py;

    // Orbit ring
    ctx.beginPath();ctx.arc(cx,cy,p.orbit,0,Math.PI*2);
    ctx.strokeStyle='rgba(255,255,255,0.04)';ctx.lineWidth=1;ctx.stroke();

    // Planet glow
    const grd=ctx.createRadialGradient(px,py,0,px,py,p.r*3);
    grd.addColorStop(0,p.glow+'80');grd.addColorStop(1,'transparent');
    ctx.fillStyle=grd;ctx.beginPath();ctx.arc(px,py,p.r*3,0,Math.PI*2);ctx.fill();

    // Planet body
    const isHov = hovered===p;
    ctx.fillStyle=p.color;
    ctx.shadowColor=p.glow;ctx.shadowBlur=isHov?20:8;
    ctx.beginPath();ctx.arc(px,py,isHov?p.r+3:p.r,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;

    // Label
    ctx.fillStyle=isHov?'#fff':'rgba(255,255,255,0.5)';
    ctx.font=`${isHov?600:400} ${isHov?12:10}px Space Grotesk`;
    ctx.textAlign='center';ctx.textBaseline='top';
    ctx.fillText(p.name,px,py+p.r+4);
  });

  requestAnimationFrame(draw);
}

// Mouse hover detection
canvas.addEventListener('mousemove',e=>{
  const rect=canvas.getBoundingClientRect();
  const mx=e.clientX-rect.left, my=e.clientY-rect.top;
  hovered=null;
  PLANETS.forEach(p=>{
    if(!p.sx) return;
    const d=Math.sqrt((mx-p.sx)**2+(my-p.sy)**2);
    if(d<p.r+10) hovered=p;
  });
  const card=document.getElementById('info-card');
  if(hovered){
    document.getElementById('ic-planet').style.background=hovered.color;
    document.getElementById('ic-planet').style.boxShadow=`0 0 16px ${hovered.glow}`;
    document.getElementById('ic-label').textContent=hovered.label;
    document.getElementById('ic-title').textContent=hovered.name;
    document.getElementById('ic-desc').textContent=hovered.desc;
    document.getElementById('ic-tags').innerHTML=hovered.tags.map(t=>`<span>${t}</span>`).join('');
    card.classList.add('show');
  } else {
    card.classList.remove('show');
  }
});

draw();
