'use strict';

/* ══ PROJECT DATA ══ */
const PROJECTS={threatweave:{title:'THREATWEAVE',category:'Threat Intelligence / CTI',desc:'AI-powered IOC correlation engine in Go. Clusters indicators by ASN, temporal proximity, and MITRE ATT&CK tactics. Claude API generates professional CTI analyst narratives.',highlights:['Threat clustering by shared ASN + temporal proximity + MITRE tactics','AI-generated threat actor profiles via Claude API','Automated Markdown report export','Static Go binary — no runtime dependencies'],tech:['Go','Claude AI API','MITRE ATT&CK','Goroutines'],mitre:[{id:'T1071',name:'Application Layer Protocol'},{id:'T1041',name:'Exfiltration Over C2'}],github:'https://github.com/shaddiegit/threatweave',note:null},secureview:{title:'SECUREVIEW',category:'SOC Dashboard / Blue Team',desc:'Full-stack SOC analyst dashboard with live alert queue, AI-powered triage via Claude API, automated incident reports, and 17 unit tests.',highlights:['Live alert queue — 5 realistic security scenarios','Claude API for AI-driven risk scoring and MITRE mapping','Automated incident reports with executive summaries','17 unit tests (Vitest)'],tech:['TypeScript','React','Vite','Claude AI API','Vitest'],mitre:[{id:'T1059',name:'Command and Scripting Interpreter'},{id:'T1055',name:'Process Injection'}],github:'https://github.com/shaddiegit/secureview',note:'Run: npm install && npm run dev. Needs Anthropic API key.'},'soc-lab':{title:'SOC DETECTION LAB',category:'Blue Team / Detection Engineering',desc:'4-stage intrusion simulation with Sigma-compatible YAML rules for Wazuh. Full pytest validation suite covering true/false positives.',highlights:['4-stage kill chain from single threat actor IP','Sigma YAML rules covering full attack sequence','pytest true/false-positive validation','Wazuh-compatible deployment'],tech:['Python','Sigma YAML','Wazuh','pytest','Linux Auth Logs'],mitre:[{id:'T1110.001',name:'Password Guessing'},{id:'T1041',name:'Exfiltration'}],github:'https://github.com/shaddiegit/soc-detection-lab',note:null},'ioc-hunter':{title:'IOC HUNTER',category:'Threat Intelligence / CLI Tool',desc:'Multi-source IOC lookup CLI querying ThreatFox, URLhaus, AbuseIPDB, and VirusTotal concurrently. 19 security tests, CI/SOAR compatible.',highlights:['Concurrent 4-feed threat intel queries','Auto-detects IOC type (IPv4, domain, URL, MD5, SHA-256)','Input hardening — CRLF/null-byte/ReDoS protection','--fail-on-malicious for CI/SOAR pipelines'],tech:['Python','ThreatFox','AbuseIPDB','VirusTotal','pytest'],mitre:[{id:'T1566',name:'Phishing'},{id:'T1190',name:'Exploit Public-Facing App'}],github:'https://github.com/shaddiegit/ioc-hunter',note:null},'nist-csf':{title:'NIST CSF 2.0 GAP',category:'GRC / Compliance',desc:'Professional gap assessment for a fictional NHS supplier. All 6 CSF 2.0 functions, maturity scoring, 12-month remediation roadmap.',highlights:['All 6 CSF 2.0 functions assessed','Maturity 1–4 scoring (current 1.32 → target 2.75)','3-phase remediation roadmap','UK GDPR Art.28 supplier questionnaire','SVG maturity radar chart'],tech:['NIST CSF 2.0','UK GDPR','ISO 27001','Risk Assessment'],mitre:[],github:'https://github.com/shaddiegit/nist-csf-gap-assessment',note:'Documentation set: Markdown assessment, SVG radar, questionnaire.'},'aws-arch':{title:'AWS HEALTHCARE AI',category:'Cloud Security / Architecture Review',desc:'Led STRIDE threat-modelling of AWS-hosted AI triage system for NHS. GDPR Art.9 violations found — project strategically cancelled.',highlights:['STRIDE threat modelling across S3, IAM, EC2','GDPR Art.9 violation found before any code written','OSINT re-identification risk identified','Strategic cancellation prevented ICO exposure'],tech:['AWS','STRIDE','GDPR Article 9','Architecture Review'],mitre:[],github:null,note:'Case study — no public codebase.'}};

/* ══ SYNTHWAVE CANVAS ══ */
(function(){
  const canvas=document.getElementById('synth-canvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  let W,H,gridOff=0,stars=[];

  function resize(){
    W=canvas.width=window.innerWidth;
    H=canvas.height=window.innerHeight;
    buildStars();
  }

  function buildStars(){
    stars=Array.from({length:180},()=>({
      x:Math.random()*W,y:Math.random()*H*.55,
      r:.3+Math.random()*1.4,
      a:.2+Math.random()*.8,
      tw:Math.random()*Math.PI*2,ts:.006+Math.random()*.018,
    }));
  }

  function drawSky(){
    const grad=ctx.createLinearGradient(0,0,0,H*.62);
    grad.addColorStop(0,'#050118');
    grad.addColorStop(.35,'#1a0240');
    grad.addColorStop(.65,'#4a0060');
    grad.addColorStop(.85,'#8a0045');
    grad.addColorStop(1,'#c04025');
    ctx.fillStyle=grad;ctx.fillRect(0,0,W,H*.62);
  }

  function drawGround(){
    const grad=ctx.createLinearGradient(0,H*.62,0,H);
    grad.addColorStop(0,'#1a0033');
    grad.addColorStop(1,'#0d0221');
    ctx.fillStyle=grad;ctx.fillRect(0,H*.62,W,H*(1-.62));
  }

  function drawSun(){
    const sx=W*.5,sy=H*.63,r=Math.min(W,H)*.13;
    // Outer glow
    const glow=ctx.createRadialGradient(sx,sy,0,sx,sy,r*2);
    glow.addColorStop(0,'rgba(255,180,0,.18)');
    glow.addColorStop(.4,'rgba(255,80,100,.08)');
    glow.addColorStop(1,'transparent');
    ctx.fillStyle=glow;ctx.fillRect(sx-r*2,sy-r*2,r*4,r*4);
    // Sun disc with horizontal cuts
    ctx.save();
    ctx.beginPath();ctx.arc(sx,sy,r,0,Math.PI*2);ctx.clip();
    const sgrad=ctx.createLinearGradient(sx,sy-r,sx,sy+r);
    sgrad.addColorStop(0,'#ffe100');sgrad.addColorStop(.35,'#ff8c00');
    sgrad.addColorStop(.65,'#ff2d78');sgrad.addColorStop(1,'#b44fff');
    ctx.fillStyle=sgrad;ctx.fillRect(sx-r,sy-r,r*2,r*2);
    // Dark horizontal cuts (bottom half)
    for(let i=0;i<14;i++){
      const y=sy+r*.02+(i/14)*(r*.88);
      const gap=2+i*.5;
      ctx.fillStyle='#0d0221';ctx.fillRect(sx-r,y,r*2,gap);
    }
    ctx.restore();
  }

  function drawStars(ts){
    stars.forEach(s=>{
      s.tw+=s.ts;
      const a=s.a*(0.55+Math.sin(s.tw)*.45);
      ctx.fillStyle=`rgba(240,220,255,${a})`;
      ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();
    });
  }

  function drawGrid(ts){
    const horizon=H*.62;
    const vp={x:W*.5,y:horizon};
    gridOff=(gridOff+.003)%1;

    // Vertical lines
    ctx.lineWidth=.8;
    const VLINES=28;
    for(let i=0;i<=VLINES;i++){
      const bx=(i/VLINES)*W;
      const alpha=.04+Math.pow(1-Math.abs(i/VLINES-.5)*2,.5)*.25;
      const grad=ctx.createLinearGradient(vp.x,vp.y,bx,H);
      grad.addColorStop(0,'rgba(180,68,255,0)');
      grad.addColorStop(.4,`rgba(180,68,255,${alpha*.6})`);
      grad.addColorStop(1,`rgba(255,45,120,${alpha})`);
      ctx.strokeStyle=grad;ctx.beginPath();ctx.moveTo(vp.x,vp.y);ctx.lineTo(bx,H);ctx.stroke();
    }

    // Horizontal lines (animated)
    const HLINES=18;
    for(let i=0;i<=HLINES;i++){
      const t=((i/HLINES)+gridOff)%1;
      const y=horizon+Math.pow(t,1.4)*(H-horizon);
      const alpha=.08+t*.5;
      const grad=ctx.createLinearGradient(0,y,W,y);
      grad.addColorStop(0,'transparent');
      grad.addColorStop(.15,`rgba(180,68,255,${alpha})`);
      grad.addColorStop(.85,`rgba(255,45,120,${alpha})`);
      grad.addColorStop(1,'transparent');
      ctx.strokeStyle=grad;ctx.lineWidth=.7+t;
      ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();
    }
  }

  let animId;
  function frame(ts){
    ctx.clearRect(0,0,W,H);
    drawSky();drawGround();drawSun();drawStars(ts);drawGrid(ts);
    animId=requestAnimationFrame(frame);
  }

  resize();window.addEventListener('resize',resize);
  animId=requestAnimationFrame(frame);
})();

/* ══ SCROLL PROGRESS ══ */
const sbar=document.getElementById('scroll-bar');
window.addEventListener('scroll',()=>{const t=document.documentElement.scrollHeight-window.innerHeight;sbar.style.width=(window.scrollY/t*100)+'%';},{passive:true});

/* ══ NAV ══ */
const nav=document.getElementById('nav');let lastY=0,menuOpen=false;
window.addEventListener('scroll',()=>{const y=window.scrollY;if(y>lastY+8&&y>200)nav.classList.add('hide');else if(y<lastY-8)nav.classList.remove('hide');lastY=y;},{passive:true});
const hb=document.getElementById('hamburger'),mob=document.getElementById('mob-menu'),mobX=document.getElementById('mob-x');
function openM(){menuOpen=true;mob.classList.add('open');document.body.classList.add('no-scroll');}
function closeM(){menuOpen=false;mob.classList.remove('open');document.body.classList.remove('no-scroll');}
hb.addEventListener('click',()=>menuOpen?closeM():openM());
mobX.addEventListener('click',closeM);
mob.querySelectorAll('.mob-l').forEach(l=>l.addEventListener('click',closeM));

/* ══ REVEAL ══ */
const robs=new IntersectionObserver(e=>{e.forEach(en=>{if(en.isIntersecting){en.target.classList.add('visible');robs.unobserve(en.target);}});},{threshold:.1,rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.reveal').forEach(el=>robs.observe(el));

/* ══ TYPING ══ */
const tyEl=document.getElementById('typing-target');
if(tyEl){const t=['Junior SOC Analyst','GRC Analyst','Cyber Threat Intelligence','Detection Engineer','Blue Teamer'];let i=0,ci=0,d=false;function tick(){const c=t[i];if(d){ci--;tyEl.textContent=c.slice(0,ci);if(ci===0){d=false;i=(i+1)%t.length;setTimeout(tick,380);return;}setTimeout(tick,42);}else{ci++;tyEl.textContent=c.slice(0,ci);if(ci===c.length){d=true;setTimeout(tick,2200);return;}setTimeout(tick,80);}}setTimeout(tick,800);}

/* ══ PHOTO ══ */
const pImg=document.getElementById('profile-img'),pMono=document.getElementById('photo-mono');
if(pImg){pImg.onload=()=>{pImg.classList.add('loaded');pMono.style.display='none';};pImg.onerror=()=>pImg.style.display='none';if(pImg.complete&&pImg.naturalWidth>0)pImg.onload();}

/* ══ CV ══ */
const cvBtn=document.getElementById('cv-btn');
if(cvBtn)fetch('../assets/cv.pdf',{method:'HEAD'}).catch(()=>{cvBtn.classList.add('unavailable');cvBtn.removeAttribute('href');cvBtn.removeAttribute('download');});

/* ══ STAT BAR ANIMATION ══ */
const sbObs=new IntersectionObserver(e=>{e.forEach(en=>{if(!en.isIntersecting)return;const el=en.target;const num=parseFloat(el.dataset.count);if(isNaN(num))return;const dec=parseInt(el.dataset.dec||0);const dur=1400,t0=performance.now();(function step(now){const p=Math.min((now-t0)/dur,1),ease=1-Math.pow(1-p,3);el.textContent=(ease*num).toFixed(dec)+'%';if(p<1)requestAnimationFrame(step);})(t0);sbObs.unobserve(el);});},{threshold:.6});
document.querySelectorAll('.sb-val[data-count]').forEach(el=>sbObs.observe(el));

/* ══ MODAL ══ */
const overlay=document.getElementById('modal-overlay'),modal=document.getElementById('modal'),closeBtn=document.getElementById('modal-close');
let lastFocus=null;
function openModal(id){const d=PROJECTS[id];if(!d)return;document.getElementById('modal-cat').textContent=d.category;document.getElementById('modal-title').textContent=d.title;document.getElementById('modal-desc').textContent=d.desc;const hl=document.getElementById('modal-hl');hl.innerHTML=d.highlights.map(h=>`<li>${h}</li>`).join('');document.getElementById('modal-hl-wrap').style.display=d.highlights.length?'':'none';document.getElementById('modal-tech').innerHTML=d.tech.map(t=>`<span>${t}</span>`).join('');document.getElementById('modal-tech-wrap').style.display=d.tech.length?'':'none';const mg=document.getElementById('modal-mitre');if(d.mitre.length){mg.innerHTML=d.mitre.map(m=>`<span>${m.id} — ${m.name}</span>`).join('');document.getElementById('modal-mitre-wrap').style.display='';}else document.getElementById('modal-mitre-wrap').style.display='none';const mn=document.getElementById('modal-note');if(d.note){document.getElementById('modal-note-text').textContent=d.note;mn.style.display='block';}else mn.style.display='none';const ma=document.getElementById('modal-actions');ma.innerHTML='';if(d.github){const a=document.createElement('a');a.href=d.github;a.target='_blank';a.rel='noopener';a.className='btn-gh';a.innerHTML='<i class="fab fa-github"></i> [ VIEW ON GITHUB ]';ma.appendChild(a);}else{const p=document.createElement('p');p.style.cssText='font-family:var(--vt);font-size:.9rem;color:rgba(240,230,255,.3)';p.textContent='// NO PUBLIC REPO — CASE STUDY';ma.appendChild(p);}overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');modal.scrollTop=0;setTimeout(()=>closeBtn.focus(),80);}
function closeModal(){overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');document.body.classList.remove('no-scroll');if(lastFocus)lastFocus.focus();}
document.querySelectorAll('.proj-tape').forEach(c=>{c.addEventListener('click',()=>{lastFocus=c;openModal(c.dataset.project);});c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();lastFocus=c;openModal(c.dataset.project);}});});
closeBtn.addEventListener('click',closeModal);overlay.addEventListener('click',e=>{if(e.target===overlay)closeModal();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('open'))closeModal();});

/* ══ CONTACT FORM ══ */
const form=document.getElementById('contact-form'),fst=document.getElementById('form-status');
if(form)form.addEventListener('submit',e=>{e.preventDefault();const n=form.querySelector('#cf-name'),em=form.querySelector('#cf-email'),s=form.querySelector('#cf-subject'),m=form.querySelector('#cf-message');let ok=true;[n,em,s,m].forEach(el=>{el.classList.remove('invalid');if(!el.value.trim()){el.classList.add('invalid');ok=false;}});if(!ok){fst.textContent='// ALL FIELDS REQUIRED';fst.className='form-note error';return;}window.location.href=`mailto:sm.shadman.hossain@gmail.com?subject=${encodeURIComponent(s.value)}&body=${encodeURIComponent(`Name: ${n.value}\nEmail: ${em.value}\n\n${m.value}`)}`;fst.textContent='// TRANSMISSION SENT';fst.className='form-note success';setTimeout(()=>{form.reset();fst.textContent='';fst.className='form-note';},4000);});

/* ══ SCROLL TOP ══ */
const stBtn=document.getElementById('scrollTop');
window.addEventListener('scroll',()=>stBtn.classList.toggle('visible',window.scrollY>500),{passive:true});
stBtn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
