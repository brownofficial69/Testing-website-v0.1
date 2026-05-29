'use strict';
const PROJECTS={threatweave:{title:'THREATWEAVE',category:'Threat Intelligence / CTI',desc:'AI-powered IOC correlation engine in Go. Clusters by ASN, temporal proximity, MITRE tactics. Claude API generates CTI analyst narratives.',highlights:['Threat clustering by shared ASN + temporal proximity + MITRE tactics','AI-generated threat actor profiles via Claude API','Automated Markdown report export','Static Go binary — no runtime dependencies'],tech:['Go','Claude AI API','MITRE ATT&CK','Goroutines'],mitre:[{id:'T1071',name:'Application Layer Protocol'},{id:'T1041',name:'Exfiltration Over C2'}],github:'https://github.com/shaddiegit/threatweave',note:null},secureview:{title:'SECUREVIEW',category:'SOC Dashboard / Blue Team',desc:'Full-stack SOC analyst dashboard with live alert queue, AI-powered triage, automated incident reports, 17 unit tests.',highlights:['Live alert queue with 5 realistic security scenarios','Claude API for AI-driven risk scoring and MITRE mapping','Automated incident reports with executive summaries','17 unit tests (Vitest)'],tech:['TypeScript','React','Vite','Claude AI API','Vitest'],mitre:[{id:'T1059',name:'Command and Scripting Interpreter'},{id:'T1055',name:'Process Injection'}],github:'https://github.com/shaddiegit/secureview',note:'Run: npm install && npm run dev. Needs Anthropic API key.'},'soc-lab':{title:'SOC DETECTION LAB',category:'Blue Team / Detection Engineering',desc:'4-stage intrusion simulation with Sigma-compatible YAML rules for Wazuh. Full pytest validation suite.',highlights:['4-stage kill chain from single threat actor IP','Sigma YAML rules covering full attack sequence','pytest true/false-positive validation','Wazuh-compatible deployment'],tech:['Python','Sigma YAML','Wazuh','pytest'],mitre:[{id:'T1110.001',name:'Password Guessing'},{id:'T1041',name:'Exfiltration'}],github:'https://github.com/shaddiegit/soc-detection-lab',note:null},'ioc-hunter':{title:'IOC HUNTER',category:'Threat Intelligence / CLI Tool',desc:'Multi-source IOC lookup CLI querying 4 threat feeds concurrently. 19 security tests, CI/SOAR compatible.',highlights:['Concurrent 4-feed threat intel queries','Auto-detects IOC type (IPv4, domain, URL, MD5, SHA-256)','Security hardening — CRLF/null-byte/ReDoS protection','--fail-on-malicious for CI/SOAR pipelines'],tech:['Python','ThreatFox','AbuseIPDB','VirusTotal','pytest'],mitre:[{id:'T1566',name:'Phishing'},{id:'T1190',name:'Exploit Public-Facing App'}],github:'https://github.com/shaddiegit/ioc-hunter',note:null},'nist-csf':{title:'NIST CSF 2.0',category:'GRC / Compliance',desc:'Professional gap assessment for NHS supplier. All 6 CSF 2.0 functions, maturity scoring, 12-month roadmap.',highlights:['All 6 CSF 2.0 functions assessed','Maturity 1–4 scoring (current 1.32 → target 2.75)','3-phase remediation roadmap','UK GDPR Art.28 supplier questionnaire'],tech:['NIST CSF 2.0','UK GDPR','ISO 27001','Risk Assessment'],mitre:[],github:'https://github.com/shaddiegit/nist-csf-gap-assessment',note:'Documentation set: Markdown assessment, SVG radar, questionnaire.'},'aws-arch':{title:'AWS HEALTHCARE AI',category:'Cloud Security / Architecture Review',desc:'Led STRIDE threat-modelling of AWS-hosted AI triage system for NHS. GDPR Art.9 violations found — project strategically cancelled.',highlights:['STRIDE threat modelling across S3, IAM, EC2','GDPR Art.9 violation found before any code written','OSINT re-identification risk identified','Strategic cancellation prevented ICO exposure'],tech:['AWS','STRIDE','GDPR Article 9','Architecture Review'],mitre:[],github:null,note:'Case study — no public codebase.'}};

// Grid canvas (perspective grid)
(function(){
  const canvas=document.getElementById('grid-canvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
  resize();window.addEventListener('resize',resize);
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const W=canvas.width,H=canvas.height;
    const vp={x:W/2,y:H*0.55};
    ctx.lineWidth=.5;
    // Horizontal lines
    for(let i=0;i<=20;i++){
      const y=vp.y+(i/20)*(H-vp.y);
      const alpha=Math.pow(i/20,.8)*.35;
      ctx.strokeStyle=`rgba(0,245,255,${alpha})`;
      ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();
    }
    // Vertical lines converging at vp
    const VLINES=30;
    for(let i=0;i<=VLINES;i++){
      const bx=(i/VLINES)*W;
      const alpha=.12+Math.abs(i/VLINES-.5)*.1;
      ctx.strokeStyle=`rgba(0,245,255,${alpha})`;
      ctx.beginPath();ctx.moveTo(vp.x,vp.y);ctx.lineTo(bx,H);ctx.stroke();
    }
    // Horizon glow
    const grad=ctx.createLinearGradient(0,vp.y-20,0,vp.y+20);
    grad.addColorStop(0,'transparent');grad.addColorStop(.5,'rgba(0,245,255,.15)');grad.addColorStop(1,'transparent');
    ctx.fillStyle=grad;ctx.fillRect(0,vp.y-20,W,40);
  }
  draw();
})();

// Scroll progress
const sbar=document.getElementById('scroll-bar');
window.addEventListener('scroll',()=>{const t=document.documentElement.scrollHeight-window.innerHeight;sbar.style.width=(window.scrollY/t*100)+'%';},{passive:true});

// Nav hide
const nav=document.getElementById('nav');let lastY=0,menuOpen=false;
window.addEventListener('scroll',()=>{const y=window.scrollY;if(y>lastY+8&&y>200)nav.classList.add('hide');else if(y<lastY-8)nav.classList.remove('hide');lastY=y;},{passive:true});

// Mobile menu
const hb=document.getElementById('hamburger'),mob=document.getElementById('mob-menu'),mobX=document.getElementById('mob-x');
function openM(){menuOpen=true;mob.classList.add('open');document.body.classList.add('no-scroll');}
function closeM(){menuOpen=false;mob.classList.remove('open');document.body.classList.remove('no-scroll');}
hb.addEventListener('click',()=>menuOpen?closeM():openM());
mobX.addEventListener('click',closeM);
mob.querySelectorAll('.mob-l').forEach(l=>l.addEventListener('click',closeM));

// Reveal
const robs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');robs.unobserve(e.target);}});},{threshold:.1,rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.reveal').forEach(el=>robs.observe(el));

// Stat counters
const cobs=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target;const raw=el.childNodes[0]?.textContent.trim();const num=parseFloat(el.dataset.count);if(isNaN(num))return;const dec=parseInt(el.dataset.dec||0);const dur=1400,t0=performance.now();(function step(now){const p=Math.min((now-t0)/dur,1),e2=1-Math.pow(1-p,3);el.childNodes[0].textContent=(e2*num).toFixed(dec);if(p<1)requestAnimationFrame(step);else el.childNodes[0].textContent=raw;})(t0);cobs.unobserve(el);});},{threshold:.6});
document.querySelectorAll('.sc-val[data-count]').forEach(el=>cobs.observe(el));

// Typing
const tyEl=document.getElementById('typing-target');
if(tyEl){const titles=['Junior SOC Analyst','GRC Analyst','Cyber Threat Intelligence','Detection Engineer','Blue Teamer'];let idx=0,ci=0,del=false;function tick(){const cur=titles[idx];if(del){ci--;tyEl.textContent=cur.slice(0,ci);if(ci===0){del=false;idx=(idx+1)%titles.length;setTimeout(tick,380);return;}setTimeout(tick,42);}else{ci++;tyEl.textContent=cur.slice(0,ci);if(ci===cur.length){del=true;setTimeout(tick,2200);return;}setTimeout(tick,80);}}setTimeout(tick,800);}

// Photo
const pImg=document.getElementById('profile-img'),pMono=document.getElementById('photo-mono');
if(pImg){pImg.onload=()=>{pImg.classList.add('loaded');pMono.style.display='none';};pImg.onerror=()=>pImg.style.display='none';if(pImg.complete&&pImg.naturalWidth>0)pImg.onload();}

// CV
const cvBtn=document.getElementById('cv-btn');
if(cvBtn)fetch('../assets/cv.pdf',{method:'HEAD'}).catch(()=>{cvBtn.classList.add('unavailable');cvBtn.removeAttribute('href');cvBtn.removeAttribute('download');cvBtn.title='CV coming soon';});

// Modal
const overlay=document.getElementById('modal-overlay'),modal=document.getElementById('modal'),closeBtn=document.getElementById('modal-close');let lastFocus=null;
function openModal(id){const d=PROJECTS[id];if(!d)return;document.getElementById('modal-cat').textContent=d.category;document.getElementById('modal-title').textContent=d.title;document.getElementById('modal-desc').textContent=d.desc;const hl=document.getElementById('modal-hl');hl.innerHTML=d.highlights.map(h=>`<li>${h}</li>`).join('');document.getElementById('modal-hl-wrap').style.display=d.highlights.length?'':'none';document.getElementById('modal-tech').innerHTML=d.tech.map(t=>`<span>${t}</span>`).join('');document.getElementById('modal-tech-wrap').style.display=d.tech.length?'':'none';const mg=document.getElementById('modal-mitre');if(d.mitre.length){mg.innerHTML=d.mitre.map(m=>`<span>${m.id} — ${m.name}</span>`).join('');document.getElementById('modal-mitre-wrap').style.display='';}else document.getElementById('modal-mitre-wrap').style.display='none';const mn=document.getElementById('modal-note');if(d.note){document.getElementById('modal-note-text').textContent=d.note;mn.style.display='block';}else mn.style.display='none';const ma=document.getElementById('modal-actions');ma.innerHTML='';if(d.github){const a=document.createElement('a');a.href=d.github;a.target='_blank';a.rel='noopener';a.className='btn-gh';a.innerHTML='<i class="fab fa-github"></i> [ VIEW ON GITHUB ]';ma.appendChild(a);}else{const p=document.createElement('p');p.style.cssText='font-family:var(--mono);font-size:.75rem;color:rgba(224,232,255,.3)';p.textContent='// NO PUBLIC REPOSITORY';ma.appendChild(p);}overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');modal.scrollTop=0;setTimeout(()=>closeBtn.focus(),80);}
function closeModal(){overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');document.body.classList.remove('no-scroll');if(lastFocus)lastFocus.focus();}
document.querySelectorAll('.proj-card-cyber').forEach(c=>{c.addEventListener('click',()=>{lastFocus=c;openModal(c.dataset.project);});c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();lastFocus=c;openModal(c.dataset.project);}});});
closeBtn.addEventListener('click',closeModal);overlay.addEventListener('click',e=>{if(e.target===overlay)closeModal();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('open'))closeModal();});

// Contact form
const form=document.getElementById('contact-form'),fst=document.getElementById('form-status');
if(form)form.addEventListener('submit',e=>{e.preventDefault();const n=form.querySelector('#cf-name'),em=form.querySelector('#cf-email'),s=form.querySelector('#cf-subject'),m=form.querySelector('#cf-message');let ok=true;[n,em,s,m].forEach(el=>{el.classList.remove('invalid');if(!el.value.trim()){el.classList.add('invalid');ok=false;}});if(!ok){fst.textContent='// ALL FIELDS REQUIRED';fst.className='form-note error';return;}window.location.href=`mailto:sm.shadman.hossain@gmail.com?subject=${encodeURIComponent(s.value)}&body=${encodeURIComponent(`Name: ${n.value}\nEmail: ${em.value}\n\n${m.value}`)}`;fst.textContent='// TRANSMISSION INITIATED';fst.className='form-note success';setTimeout(()=>{form.reset();fst.textContent='';fst.className='form-note';},4000);});

// Scroll top
const stBtn=document.getElementById('scrollTop');
window.addEventListener('scroll',()=>stBtn.classList.toggle('visible',window.scrollY>500),{passive:true});
stBtn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
