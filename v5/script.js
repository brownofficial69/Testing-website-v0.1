'use strict';

/* ══════════════════════════════════════
   PROJECT DATA
══════════════════════════════════════ */
const PROJECTS = {
  threatweave:{title:'ThreatWeave',category:'Threat Intelligence / CTI',icon:'fas fa-brain',iconClass:'purple-glow',
    description:'AI-powered IOC correlation engine in Go. Clusters indicators by ASN, temporal proximity, and MITRE ATT&CK tactics. Generates professional CTI analyst narratives via Claude AI.',
    highlights:['Threat clustering by shared ASN, temporal proximity, and MITRE tactics','AI-generated threat actor profiles via Claude API','Automated Markdown report export','Static Go binary — no runtime dependencies','MIT licensed'],
    tech:['Go','Claude AI API','MITRE ATT&CK','Goroutines','CTI'],
    mitre:[{id:'T1071',name:'Application Layer Protocol'},{id:'T1041',name:'Exfiltration Over C2'},{id:'T1190',name:'Exploit Public-Facing App'}],
    github:'https://github.com/shaddiegit/threatweave',note:null},
  secureview:{title:'SecureView',category:'SOC Dashboard / Blue Team',icon:'fas fa-desktop',iconClass:'cyan-glow',
    description:'Full-stack SOC analyst dashboard with live alert queue, AI-powered triage via Claude API, automated incident reports, and 17 unit tests.',
    highlights:['Live alert queue with 5 realistic security scenarios','Claude API for AI-driven risk scoring and MITRE mapping','Automated incident reports','IOC display with confidence ratings','17 unit tests (Vitest)'],
    tech:['TypeScript','React','Vite','Claude AI API','Vitest'],
    mitre:[{id:'T1059',name:'Command and Scripting Interpreter'},{id:'T1055',name:'Process Injection'}],
    github:'https://github.com/shaddiegit/secureview',note:'Run: npm install && npm run dev. Needs Anthropic API key.'},
  'soc-lab':{title:'SOC Detection Lab',category:'Blue Team / Detection Engineering',icon:'fas fa-shield-halved',iconClass:'purple-glow',
    description:'4-stage intrusion simulation with Sigma-compatible YAML rules for Wazuh. Full pytest validation suite.',
    highlights:['4-stage kill chain from single threat actor IP','Sigma YAML rules covering full attack sequence','pytest true/false-positive validation','Wazuh-compatible deployment'],
    tech:['Python','Sigma YAML','Wazuh','pytest','Linux Auth Logs'],
    mitre:[{id:'T1110.001',name:'Password Guessing'},{id:'T1548.003',name:'Sudo Caching'},{id:'T1041',name:'Exfiltration'}],
    github:'https://github.com/shaddiegit/soc-detection-lab',note:null},
  'ioc-hunter':{title:'IOC Hunter',category:'Threat Intelligence / CLI Tool',icon:'fas fa-magnifying-glass',iconClass:'cyan-glow',
    description:'Multi-source IOC lookup CLI querying ThreatFox, URLhaus, AbuseIPDB, and VirusTotal concurrently. 19 security tests, CI/SOAR compatible.',
    highlights:['Concurrent 4-feed threat intel queries','Auto-detects IOC type','Security hardening against injection attacks','--fail-on-malicious for CI pipelines'],
    tech:['Python','ThreatFox','AbuseIPDB','VirusTotal','threading','pytest'],
    mitre:[{id:'T1566',name:'Phishing'},{id:'T1190',name:'Exploit Public-Facing App'}],
    github:'https://github.com/shaddiegit/ioc-hunter',note:null},
  'nist-csf':{title:'NIST CSF 2.0 Gap Assessment',category:'GRC / Compliance',icon:'fas fa-clipboard-check',iconClass:'pink-glow',
    description:'Professional GRC gap assessment for a fictional NHS pharmaceutical supplier. All 6 CSF 2.0 functions, maturity scoring, 12-month roadmap.',
    highlights:['All 6 CSF 2.0 functions assessed','Maturity 1–4 scoring (1.32 → target 2.75)','3-phase remediation roadmap','UK GDPR Art.28 supplier questionnaire','SVG maturity radar chart'],
    tech:['NIST CSF 2.0','UK GDPR','ISO 27001','Risk Assessment'],
    mitre:[],github:'https://github.com/shaddiegit/nist-csf-gap-assessment',
    note:'Documentation set: Markdown assessment, SVG radar, questionnaire.'},
  'aws-arch':{title:'AWS Healthcare AI Triage',category:'Cloud Security / Architecture Review',icon:'fab fa-aws',iconClass:'amber-glow',
    description:'Led team threat-modelling of AWS-hosted AI triage system for NHS. STRIDE analysis revealed GDPR Art.9 violations, driving strategic project cancellation.',
    highlights:['STRIDE threat modelling across S3, IAM, EC2','GDPR Art.9 violation found before any code written','OSINT re-identification risk identified','Strategic cancellation prevented ICO exposure'],
    tech:['AWS','STRIDE','GDPR Article 9','Architecture Review'],
    mitre:[],github:null,note:'Case study — no public codebase.'}
};

/* ══════════════════════════════════════
   CURSOR
══════════════════════════════════════ */
function initCursor() {
  const dot = document.getElementById('cur-dot');
  const ring = document.getElementById('cur-ring');
  if (!dot || !ring || window.matchMedia('(pointer:coarse)').matches) return;
  let mx=-100,my=-100,rx=mx,ry=my;
  document.addEventListener('mousemove', e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';});
  (function lerp(){rx+=(mx-rx)*.13;ry+=(my-ry)*.13;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(lerp);})();
  document.querySelectorAll('a,button,.proj-card,.skill-card,.cert-card,.contact-link,.copy-btn,input,textarea').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
  });
}

/* ══════════════════════════════════════
   SCROLL PROGRESS
══════════════════════════════════════ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-bar');
  if (!bar) return;
  window.addEventListener('scroll', ()=>{
    const t = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY/t*100)+'%';
  },{passive:true});
}

/* ══════════════════════════════════════
   NAVBAR
══════════════════════════════════════ */
function initNav() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const overlay = document.getElementById('mobile-overlay');
  const closeBtn = document.getElementById('mobile-close');
  if (!nav) return;

  let lastY = 0, menuOpen = false;

  window.addEventListener('scroll', ()=>{
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y>60);
    if (y>lastY+8&&y>200) nav.classList.add('hide');
    else if (y<lastY-8) nav.classList.remove('hide');
    lastY = y;
  },{passive:true});

  /* Active link */
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const links = document.querySelectorAll('.nav-link');
  let lastActive = null;
  function setActive(){
    const mid = window.scrollY+window.innerHeight/2;
    for(const s of sections){
      if(mid>=s.offsetTop&&mid<s.offsetTop+s.offsetHeight){
        if(s.id!==lastActive){lastActive=s.id;}
        links.forEach(l=>l.classList.remove('active'));
        const m = document.querySelector(`.nav-link[href="#${s.id}"]`);
        if(m)m.classList.add('active');
        break;
      }
    }
  }
  window.addEventListener('scroll',setActive,{passive:true});
  setActive();

  /* Mobile menu */
  function openMenu(){menuOpen=true;overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');hamburger.setAttribute('aria-expanded','true');document.body.classList.add('no-scroll');const[s1,s2,s3]=hamburger.querySelectorAll('span');s1.style.transform='rotate(45deg) translate(5px,5px)';s2.style.opacity='0';s3.style.transform='rotate(-45deg) translate(5px,-5px)';}
  function closeMenu(){menuOpen=false;overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');hamburger.setAttribute('aria-expanded','false');document.body.classList.remove('no-scroll');hamburger.querySelectorAll('span').forEach(s=>{s.style.transform='';s.style.opacity='';});}
  hamburger.addEventListener('click',()=>menuOpen?closeMenu():openMenu());
  closeBtn.addEventListener('click',closeMenu);
  overlay.querySelectorAll('.mob-link').forEach(l=>l.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuOpen)closeMenu();});
}

/* ══════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════ */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}});
  },{threshold:.1,rootMargin:'0px 0px -30px 0px'});
  els.forEach(el=>obs.observe(el));
}

/* ══════════════════════════════════════
   TYPING
══════════════════════════════════════ */
function initTyping() {
  const el = document.getElementById('typing-target');
  if (!el) return;
  const titles=['Junior SOC Analyst','GRC Analyst','Cyber Threat Intelligence','Detection Engineer','Blue Teamer'];
  let idx=0,ci=0,del=false;
  function tick(){
    const cur=titles[idx];
    if(del){ci--;el.textContent=cur.slice(0,ci);if(ci===0){del=false;idx=(idx+1)%titles.length;setTimeout(tick,400);return;}setTimeout(tick,42);}
    else{ci++;el.textContent=cur.slice(0,ci);if(ci===cur.length){del=true;setTimeout(tick,2400);return;}setTimeout(tick,80);}
  }
  setTimeout(tick,1000);
}

/* ══════════════════════════════════════
   STAT COUNTERS
══════════════════════════════════════ */
function initCounters() {
  const vals = document.querySelectorAll('.stat-val[data-count]');
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const el=entry.target;
      const node=el.childNodes[0];
      if(!node)return;
      const raw=node.textContent.trim();
      const num=parseFloat(el.dataset.count);
      if(isNaN(num))return;
      const dec=parseInt(el.dataset.dec||0);
      const dur=1400,t0=performance.now();
      (function step(now){const p=Math.min((now-t0)/dur,1),e=1-Math.pow(1-p,3);node.textContent=(e*num).toFixed(dec);if(p<1)requestAnimationFrame(step);else node.textContent=raw;})(t0);
      obs.unobserve(el);
    });
  },{threshold:.6});
  vals.forEach(el=>obs.observe(el));
}

/* ══════════════════════════════════════
   PROJECT CARD 3D TILT
══════════════════════════════════════ */
function initTilt() {
  document.querySelectorAll('.proj-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const dx=((e.clientX-r.left)/r.width-.5)*2;
      const dy=((e.clientY-r.top)/r.height-.5)*2;
      card.style.transform=`translateY(-5px) rotateX(${-dy*6}deg) rotateY(${dx*6}deg)`;
    });
    card.addEventListener('mouseleave',()=>{card.style.transform='';});
  });
}

/* ══════════════════════════════════════
   PROFILE PHOTO
══════════════════════════════════════ */
function initPhoto() {
  const img=document.getElementById('profile-img');
  const mono=document.getElementById('photo-mono');
  if(!img||!mono)return;
  img.onload=()=>{img.classList.add('loaded');mono.style.display='none';};
  img.onerror=()=>{img.style.display='none';};
  if(img.complete&&img.naturalWidth>0)img.onload();
}

/* ══════════════════════════════════════
   COPY EMAIL
══════════════════════════════════════ */
function copyEmail(btn) {
  const text=btn.dataset.copy;
  if(!text)return;
  navigator.clipboard.writeText(text).then(()=>{
    const icon=btn.querySelector('i');
    icon.className='fas fa-check';btn.classList.add('copied');
    setTimeout(()=>{icon.className='fas fa-copy';btn.classList.remove('copied');},2000);
  });
}

/* ══════════════════════════════════════
   MODAL
══════════════════════════════════════ */
function initModal() {
  const overlay=document.getElementById('modal-overlay');
  const modal=document.getElementById('modal');
  const closeBtn=document.getElementById('modal-close');
  const cards=document.querySelectorAll('.proj-card');
  if(!overlay)return;

  let lastFocus=null;

  function populate(id){
    const d=PROJECTS[id];if(!d)return;
    const iw=document.getElementById('modal-icon-wrap');
    const ic=document.getElementById('modal-icon');
    iw.className=`modal-icon ${d.iconClass}`;
    ic.className=d.icon;
    document.getElementById('modal-cat').textContent=d.category;
    document.getElementById('modal-title').textContent=d.title;
    document.getElementById('modal-desc').textContent=d.description;
    const hl=document.getElementById('modal-hl');
    hl.innerHTML=d.highlights.map(h=>`<li>${h}</li>`).join('');
    document.getElementById('modal-hl-wrap').style.display=d.highlights.length?'':'none';
    document.getElementById('modal-tech').innerHTML=d.tech.map(t=>`<span>${t}</span>`).join('');
    document.getElementById('modal-tech-wrap').style.display=d.tech.length?'':'none';
    const mg=document.getElementById('modal-mitre');
    if(d.mitre.length){mg.innerHTML=d.mitre.map(m=>`<span title="${m.name}">${m.id} — ${m.name}</span>`).join('');document.getElementById('modal-mitre-wrap').style.display='';}
    else document.getElementById('modal-mitre-wrap').style.display='none';
    const mn=document.getElementById('modal-note');
    if(d.note){document.getElementById('modal-note-text').innerHTML=d.note;mn.style.display='flex';}else mn.style.display='none';
    const ma=document.getElementById('modal-actions');
    ma.innerHTML='';
    if(d.github){const a=document.createElement('a');a.href=d.github;a.target='_blank';a.rel='noopener noreferrer';a.className='btn-github';a.innerHTML='<i class="fab fa-github"></i> View on GitHub';ma.appendChild(a);}
    else{const p=document.createElement('p');p.style.cssText='font-family:var(--mono);font-size:.78rem;color:var(--muted)';p.textContent='// No public repository.';ma.appendChild(p);}
  }

  function open(id){populate(id);overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');modal.scrollTop=0;setTimeout(()=>closeBtn.focus(),80);}
  function close(){overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');document.body.classList.remove('no-scroll');if(lastFocus)lastFocus.focus();}

  cards.forEach(card=>{
    card.addEventListener('click',()=>{lastFocus=card;open(card.dataset.project);});
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();lastFocus=card;open(card.dataset.project);}});
  });
  closeBtn.addEventListener('click',close);
  overlay.addEventListener('click',e=>{if(e.target===overlay)close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('open'))close();});
}

/* ══════════════════════════════════════
   CV BUTTON
══════════════════════════════════════ */
function initCvBtn() {
  const btn=document.getElementById('cv-btn');
  if(!btn)return;
  fetch('../assets/cv.pdf',{method:'HEAD'}).then(r=>{if(!r.ok)throw new Error();}).catch(()=>{btn.classList.add('unavailable');btn.removeAttribute('download');btn.removeAttribute('href');btn.title='CV coming soon';});
}

/* ══════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════ */
function initContactForm() {
  const form=document.getElementById('contact-form');
  const status=document.getElementById('form-status');
  if(!form||!status)return;
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const n=form.querySelector('#cf-name'),em=form.querySelector('#cf-email'),s=form.querySelector('#cf-subject'),m=form.querySelector('#cf-message');
    let ok=true;
    [n,em,s,m].forEach(el=>{el.classList.remove('invalid');if(!el.value.trim()){el.classList.add('invalid');ok=false;}});
    if(!ok){status.textContent='// Fill in all fields.';status.className='form-note error';return;}
    window.location.href=`mailto:sm.shadman.hossain@gmail.com?subject=${encodeURIComponent(s.value)}&body=${encodeURIComponent(`Name: ${n.value}\nEmail: ${em.value}\n\n${m.value}`)}`;
    status.textContent='// Opening email client...';status.className='form-note success';
    setTimeout(()=>{form.reset();status.textContent='';status.className='form-note';},4000);
  });
  form.querySelectorAll('input,textarea').forEach(el=>{el.addEventListener('input',()=>el.classList.remove('invalid'));});
}

/* ══════════════════════════════════════
   SCROLL TO TOP
══════════════════════════════════════ */
function initScrollTop() {
  const btn=document.getElementById('scrollTop');
  if(!btn)return;
  window.addEventListener('scroll',()=>btn.classList.toggle('visible',window.scrollY>500),{passive:true});
  btn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
}

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded',()=>{
  initCursor();
  initScrollProgress();
  initNav();
  initReveal();
  initTyping();
  initCounters();
  initTilt();
  initPhoto();
  initModal();
  initCvBtn();
  initContactForm();
  initScrollTop();
});
