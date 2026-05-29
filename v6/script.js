'use strict';
const PROJECTS={threatweave:{title:'THREATWEAVE',category:'Threat Intelligence / CTI',icon:'fas fa-brain',highlights:['Threat clustering by shared ASN, temporal proximity, and MITRE tactics','AI-generated threat actor profiles via Claude API','Automated Markdown report export','Static Go binary — no runtime dependencies'],tech:['Go','Claude AI API','MITRE ATT&CK','Goroutines','CTI'],mitre:[{id:'T1071',name:'Application Layer Protocol'},{id:'T1041',name:'Exfiltration Over C2'}],github:'https://github.com/shaddiegit/threatweave',note:null,desc:'AI-powered IOC correlation engine in Go. Clusters indicators by ASN, temporal proximity, and MITRE ATT&CK tactics. Generates professional CTI analyst narratives via Claude AI.'},secureview:{title:'SECUREVIEW',category:'SOC Dashboard / Blue Team',icon:'fas fa-desktop',highlights:['Live alert queue with 5 realistic security scenarios','Claude API for AI-driven risk scoring and MITRE mapping','Automated incident reports with executive summaries','17 unit tests (Vitest)'],tech:['TypeScript','React','Vite','Claude AI API','Vitest'],mitre:[{id:'T1059',name:'Command and Scripting Interpreter'},{id:'T1055',name:'Process Injection'}],github:'https://github.com/shaddiegit/secureview',note:'Run: npm install && npm run dev. Needs Anthropic API key.',desc:'Full-stack SOC analyst dashboard with live alert queue, AI-powered triage via Claude API, automated incident reports, and 17 unit tests.'},'soc-lab':{title:'SOC DETECTION LAB',category:'Blue Team / Detection Engineering',icon:'fas fa-shield-halved',highlights:['4-stage kill chain from single threat actor IP','Sigma YAML rules covering full attack sequence','pytest true/false-positive validation','Wazuh-compatible deployment'],tech:['Python','Sigma YAML','Wazuh','pytest','Linux Auth Logs'],mitre:[{id:'T1110.001',name:'Password Guessing'},{id:'T1041',name:'Exfiltration'}],github:'https://github.com/shaddiegit/soc-detection-lab',note:null,desc:'4-stage intrusion simulation with Sigma-compatible YAML rules for Wazuh. Full pytest validation suite.'},'ioc-hunter':{title:'IOC HUNTER',category:'Threat Intelligence / CLI Tool',icon:'fas fa-magnifying-glass',highlights:['Concurrent 4-feed threat intel queries','Auto-detects IOC type (IPv4, domain, URL, MD5, SHA-256)','Security hardening against injection attacks','--fail-on-malicious for CI pipelines'],tech:['Python','ThreatFox','AbuseIPDB','VirusTotal','pytest'],mitre:[{id:'T1566',name:'Phishing'},{id:'T1190',name:'Exploit Public-Facing App'}],github:'https://github.com/shaddiegit/ioc-hunter',note:null,desc:'Multi-source IOC lookup CLI querying ThreatFox, URLhaus, AbuseIPDB, and VirusTotal concurrently. 19 security tests, CI/SOAR compatible.'},'nist-csf':{title:'NIST CSF 2.0 GAP ASSESSMENT',category:'GRC / Compliance',icon:'fas fa-clipboard-check',highlights:['All 6 CSF 2.0 functions assessed','Maturity 1–4 scoring (current 1.32 → target 2.75)','3-phase remediation roadmap','UK GDPR Art.28 supplier questionnaire'],tech:['NIST CSF 2.0','UK GDPR','ISO 27001','Risk Assessment'],mitre:[],github:'https://github.com/shaddiegit/nist-csf-gap-assessment',note:'Documentation set: Markdown assessment, SVG radar, questionnaire.',desc:'Professional GRC gap assessment for a fictional NHS pharmaceutical supplier. All 6 CSF 2.0 functions, maturity scoring, 12-month roadmap.'},'aws-arch':{title:'AWS HEALTHCARE AI TRIAGE',category:'Cloud Security / Architecture Review',icon:'fab fa-aws',highlights:['STRIDE threat modelling across S3, IAM, EC2','GDPR Art.9 violation found before any code written','OSINT re-identification risk identified','Strategic cancellation prevented ICO exposure'],tech:['AWS','STRIDE','GDPR Article 9','Architecture Review'],mitre:[],github:null,note:'Case study — no public codebase.',desc:'Led STRIDE threat-modelling of AWS-hosted AI triage system for NHS. GDPR Art.9 violations found — project strategically cancelled.'}};

// Scroll progress
const bar=document.getElementById('scroll-bar');
window.addEventListener('scroll',()=>{const t=document.documentElement.scrollHeight-window.innerHeight;bar.style.width=(window.scrollY/t*100)+'%';},{passive:true});

// Nav hide/show
const nav=document.getElementById('nav');
let lastY=0,menuOpen=false;
window.addEventListener('scroll',()=>{const y=window.scrollY;if(y>lastY+8&&y>200)nav.classList.add('hide');else if(y<lastY-8)nav.classList.remove('hide');lastY=y;},{passive:true});

// Mobile menu
const hamburger=document.getElementById('hamburger'),mobileMenu=document.getElementById('mobile-menu'),mobClose=document.getElementById('mob-close');
function openMenu(){menuOpen=true;mobileMenu.classList.add('open');document.body.classList.add('no-scroll');}
function closeMenu(){menuOpen=false;mobileMenu.classList.remove('open');document.body.classList.remove('no-scroll');}
hamburger.addEventListener('click',()=>menuOpen?closeMenu():openMenu());
mobClose.addEventListener('click',closeMenu);
mobileMenu.querySelectorAll('.mob-link').forEach(l=>l.addEventListener('click',closeMenu));

// Reveal
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}});},{threshold:.1,rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// Stat counters
const cObs=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target;const raw=el.childNodes[0]?.textContent.trim();const num=parseFloat(el.dataset.count);if(isNaN(num))return;const dec=parseInt(el.dataset.dec||0);const dur=1400,t0=performance.now();(function step(now){const p=Math.min((now-t0)/dur,1),e=1-Math.pow(1-p,3);el.childNodes[0].textContent=(e*num).toFixed(dec);if(p<1)requestAnimationFrame(step);else el.childNodes[0].textContent=raw;})(t0);cObs.unobserve(el);});},{threshold:.6});
document.querySelectorAll('.stat-n[data-count]').forEach(el=>cObs.observe(el));

// Typing
const tyEl=document.getElementById('typing-target');
if(tyEl){const titles=['Junior SOC Analyst','GRC Analyst','Cyber Threat Intelligence','Detection Engineer','Blue Teamer'];let idx=0,ci=0,del=false;function tick(){const cur=titles[idx];if(del){ci--;tyEl.textContent=cur.slice(0,ci);if(ci===0){del=false;idx=(idx+1)%titles.length;setTimeout(tick,380);return;}setTimeout(tick,42);}else{ci++;tyEl.textContent=cur.slice(0,ci);if(ci===cur.length){del=true;setTimeout(tick,2200);return;}setTimeout(tick,80);}}setTimeout(tick,800);}

// Photo
const pImg=document.getElementById('profile-img'),pMono=document.getElementById('photo-mono');
if(pImg){pImg.onload=()=>{pImg.classList.add('loaded');pMono.style.display='none';};pImg.onerror=()=>pImg.style.display='none';if(pImg.complete&&pImg.naturalWidth>0)pImg.onload();}

// CV button
const cvBtn=document.getElementById('cv-btn');
if(cvBtn)fetch('../assets/cv.pdf',{method:'HEAD'}).catch(()=>{cvBtn.classList.add('unavailable');cvBtn.removeAttribute('href');cvBtn.removeAttribute('download');cvBtn.title='CV coming soon';});

// Modal
const overlay=document.getElementById('modal-overlay'),modal=document.getElementById('modal'),closeBtn=document.getElementById('modal-close');
let lastFocus=null;
function openModal(id){
  const d=PROJECTS[id];if(!d)return;
  document.getElementById('modal-cat').textContent=d.category;
  document.getElementById('modal-title').textContent=d.title;
  document.getElementById('modal-desc').textContent=d.desc;
  const hl=document.getElementById('modal-hl');hl.innerHTML=d.highlights.map(h=>`<li>${h}</li>`).join('');
  document.getElementById('modal-hl-wrap').style.display=d.highlights.length?'':'none';
  document.getElementById('modal-tech').innerHTML=d.tech.map(t=>`<span>${t}</span>`).join('');
  document.getElementById('modal-tech-wrap').style.display=d.tech.length?'':'none';
  const mg=document.getElementById('modal-mitre');
  if(d.mitre.length){mg.innerHTML=d.mitre.map(m=>`<span>${m.id} — ${m.name}</span>`).join('');document.getElementById('modal-mitre-wrap').style.display='';}
  else document.getElementById('modal-mitre-wrap').style.display='none';
  const mn=document.getElementById('modal-note');
  if(d.note){document.getElementById('modal-note-text').textContent=d.note;mn.style.display='block';}else mn.style.display='none';
  const ma=document.getElementById('modal-actions');ma.innerHTML='';
  if(d.github){const a=document.createElement('a');a.href=d.github;a.target='_blank';a.rel='noopener noreferrer';a.className='btn-gh';a.innerHTML='<i class="fab fa-github"></i> VIEW ON GITHUB';ma.appendChild(a);}
  else{const p=document.createElement('p');p.style.cssText='font-family:var(--mono);font-size:.78rem;color:rgba(240,240,240,.35)';p.textContent='// No public repository.';ma.appendChild(p);}
  overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');modal.scrollTop=0;setTimeout(()=>closeBtn.focus(),80);
}
function closeModal(){overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');document.body.classList.remove('no-scroll');if(lastFocus)lastFocus.focus();}
document.querySelectorAll('.proj-card').forEach(card=>{card.addEventListener('click',()=>{lastFocus=card;openModal(card.dataset.project);});card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();lastFocus=card;openModal(card.dataset.project);}});card.setAttribute('role','button');card.setAttribute('tabindex','0');});
closeBtn.addEventListener('click',closeModal);
overlay.addEventListener('click',e=>{if(e.target===overlay)closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('open'))closeModal();});

// Contact form
const form=document.getElementById('contact-form'),fStatus=document.getElementById('form-status');
if(form)form.addEventListener('submit',e=>{
  e.preventDefault();
  const n=form.querySelector('#cf-name'),em=form.querySelector('#cf-email'),s=form.querySelector('#cf-subject'),m=form.querySelector('#cf-message');
  let ok=true;[n,em,s,m].forEach(el=>{el.classList.remove('invalid');if(!el.value.trim()){el.classList.add('invalid');ok=false;}});
  if(!ok){fStatus.textContent='Fill in all fields.';fStatus.className='form-note error';return;}
  window.location.href=`mailto:sm.shadman.hossain@gmail.com?subject=${encodeURIComponent(s.value)}&body=${encodeURIComponent(`Name: ${n.value}\nEmail: ${em.value}\n\n${m.value}`)}`;
  fStatus.textContent='Opening email client...';fStatus.className='form-note success';
  setTimeout(()=>{form.reset();fStatus.textContent='';fStatus.className='form-note';},4000);
});

// Scroll top
const stBtn=document.getElementById('scrollTop');
window.addEventListener('scroll',()=>stBtn.classList.toggle('visible',window.scrollY>500),{passive:true});
stBtn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
