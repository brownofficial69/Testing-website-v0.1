/* ══════════════════════════════════════════════════
   PROJECT DATA
══════════════════════════════════════════════════ */
const PROJECTS = {
  'threatweave': {
    title:'ThreatWeave', category:'Threat Intelligence / CTI', icon:'fas fa-brain', iconClass:'fire-icon',
    description:'ThreatWeave is an AI-powered threat intelligence correlation engine written in Go. It aggregates IOCs from multiple threat intelligence feeds and groups them into meaningful threat clusters using three prioritised signals: shared ASN, temporal proximity, and overlapping MITRE ATT&CK tactics. The engine generates professional CTI analyst narratives describing threat actor profiles, objectives, and recommended defensive measures.',
    highlights:['Threat clustering by shared ASN, temporal proximity, and overlapping MITRE ATT&CK tactics','AI-generated threat actor profiles and narratives using the Claude API','Automated Markdown report export for stakeholder-ready intelligence products','Commands: correlate, profile, report, demo','Static Go binary — no runtime dependencies, deployable anywhere','MIT licensed and open source'],
    tech:['Go','Claude AI API','MITRE ATT&CK','Goroutines','CTI Workflows'],
    mitre:[{id:'T1071',name:'Application Layer Protocol'},{id:'T1041',name:'Exfiltration Over C2 Channel'},{id:'T1190',name:'Exploit Public-Facing Application'}],
    github:'https://github.com/shaddiegit/threatweave', note:null
  },
  'secureview': {
    title:'SecureView', category:'SOC Dashboard / Blue Team', icon:'fas fa-desktop', iconClass:'amber-icon',
    description:'SecureView is an AI-powered SOC analyst dashboard built with React and TypeScript. It demonstrates how modern AI can streamline security alert triage — from initial alert ingestion through to automated incident report generation with MITRE ATT&CK mapping.',
    highlights:['Live alert queue featuring 5 realistic security scenarios ranked by severity','Claude API integration for AI-driven risk scoring and MITRE ATT&CK mapping','Automated incident report generation with executive summaries','IOC display with confidence ratings and categorisation','Raw log viewer with syntax highlighting','17 unit tests (Vitest) validating data integrity'],
    tech:['TypeScript','React','Vite','Claude AI API','Vitest'],
    mitre:[{id:'T1059',name:'Command and Scripting Interpreter'},{id:'T1055',name:'Process Injection'}],
    github:'https://github.com/shaddiegit/secureview', note:'Clone the repo and run npm install && npm run dev. Requires an Anthropic API key.'
  },
  'soc-lab': {
    title:'SOC Detection Lab', category:'Blue Team / Detection Engineering', icon:'fas fa-shield-halved', iconClass:'fire-icon',
    description:'A self-contained detection engineering environment simulating a realistic 4-stage intrusion campaign: reconnaissance, SSH brute-force, privilege escalation, and data exfiltration. Detection rules are Sigma-compatible YAML designed for Wazuh deployment.',
    highlights:['Complete 4-stage kill chain from a single threat actor IP','4 Sigma-style YAML detection rules covering the full attack sequence','Time-window correlation: brute-force IP linked to 90 MB exfil event','pytest suite with true/false-positive validation for all 4 rules','Wazuh-compatible — rules deployable in a real SOC environment','Analyst write-up with structured incident narrative'],
    tech:['Python','Sigma YAML','MITRE ATT&CK','Wazuh','pytest','Linux Auth Logs','Nginx'],
    mitre:[{id:'T1110.001',name:'Brute Force: Password Guessing'},{id:'T1083',name:'File and Directory Discovery'},{id:'T1548.003',name:'Sudo Caching'},{id:'T1041',name:'Exfiltration Over C2 Channel'}],
    github:'https://github.com/shaddiegit/soc-detection-lab', note:null
  },
  'ioc-hunter': {
    title:'IOC Hunter', category:'Threat Intelligence / CLI Tool', icon:'fas fa-magnifying-glass', iconClass:'amber-icon',
    description:'IOC Hunter is a Python CLI tool for SOC Tier 1 analysts. It auto-detects IOC type, queries ThreatFox, URLhaus, AbuseIPDB, and VirusTotal concurrently, normalises responses into unified verdicts, and exports in console, JSON, or HTML formats.',
    highlights:['Concurrent querying of 4 major threat intelligence feeds','Offline-first design — works without API keys using bundled reference feeds','Auto-detection of IOC type: IPv4, domain, URL, MD5, SHA-256','Input security hardening: blocks CRLF injection, null-byte injection, ReDoS','19 automated tests covering true-positive and security regression cases','CI/SOAR pipeline integration via --fail-on-malicious flag'],
    tech:['Python','ThreatFox API','URLhaus API','AbuseIPDB API','VirusTotal API','threading','pytest'],
    mitre:[{id:'T1566',name:'Phishing IOC detection'},{id:'T1190',name:'Exploit Public-Facing Application'}],
    github:'https://github.com/shaddiegit/ioc-hunter', note:null
  },
  'nist-csf': {
    title:'NIST CSF 2.0 Gap Assessment', category:'GRC / Compliance', icon:'fas fa-clipboard-check', iconClass:'copper-icon',
    description:'Professional gap assessment for a fictional UK pharmaceutical supplier across all 6 NIST CSF 2.0 functions. Quantitative maturity scoring, structured gap identification, and a phased remediation roadmap aligned to business risk priorities.',
    highlights:['Full assessment across all 6 CSF 2.0 functions: Govern, Identify, Protect, Detect, Respond, Recover','Maturity scoring 1–4 per sub-category (current: 1.32 → target: 2.75)','Two High-severity findings as root-cause blockers','Three-phase remediation roadmap spanning 0–12 months','UK GDPR Article 28 supplier due-diligence questionnaire','SVG maturity radar chart comparing current vs target'],
    tech:['NIST CSF 2.0','UK GDPR Art. 28','ISO 27001','Risk Assessment','Supplier Due Diligence','Maturity Modelling'],
    mitre:[], github:'https://github.com/shaddiegit/nist-csf-gap-assessment',
    note:'Professional documentation set — Markdown assessment, SVG radar chart, supplier questionnaire.'
  },
  'aws-arch': {
    title:'AWS Healthcare AI Triage Architecture', category:'Cloud Security / Architecture Review', icon:'fab fa-aws', iconClass:'amber-icon',
    description:'As team lead at Birmingham Metropolitan College, I guided a team designing an AWS-hosted AI triage system for NHS use. STRIDE threat modelling across all components revealed critical GDPR Art.9 and OSINT re-identification violations, leading to strategic project cancellation before implementation.',
    highlights:['Led cross-functional team through complete architecture design','STRIDE threat modelling on AWS S3, IAM, EC2 components and all data flows','Identified GDPR Art.9 special-category data violation before any code was written','Identified OSINT re-identification risk in the patient data pipeline','Strategic cancellation recommendation accepted — regulatory exposure prevented','3 critical legal/privacy violations found in a single architecture review'],
    tech:['AWS (S3, IAM, EC2)','STRIDE Threat Modelling','GDPR Article 9','Healthcare Compliance','Architecture Review'],
    mitre:[], github:null, note:'Case study — no public codebase. Work product is an architecture threat model and risk findings report.'
  }
};

/* ══════════════════════════════════════════════════
   SOUND ENGINE
══════════════════════════════════════════════════ */
const SoundEngine = (() => {
  let ctx=null, enabled=true;
  function ac(){if(!ctx)ctx=new(window.AudioContext||window.webkitAudioContext)();if(ctx.state==='suspended')ctx.resume();return ctx;}
  function osc(freq,type,peakGain,attack,decay,startOffset=0){const c=ac(),t=c.currentTime+startOffset,g=c.createGain(),o=c.createOscillator();o.type=type;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(peakGain,t+attack);g.gain.exponentialRampToValueAtTime(0.0001,t+attack+decay);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+attack+decay+0.01);}
  function sweep(sf,ef,type,pg,dur,so=0){const c=ac(),t=c.currentTime+so,g=c.createGain(),o=c.createOscillator();o.type=type;o.frequency.setValueAtTime(sf,t);o.frequency.exponentialRampToValueAtTime(ef,t+dur);g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(pg,t+0.008);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+dur+0.01);}
  function nb(cf,bw,pg,dur){const c=ac(),t=c.currentTime,buf=c.createBuffer(1,c.sampleRate*dur,c.sampleRate),data=buf.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1);const src=c.createBufferSource();src.buffer=buf;const bpf=c.createBiquadFilter();bpf.type='bandpass';bpf.frequency.value=cf;bpf.Q.value=cf/bw;const g=c.createGain();g.gain.setValueAtTime(pg,t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);src.connect(bpf);bpf.connect(g);g.connect(c.destination);src.start(t);src.stop(t+dur);}
  const sounds={
    tick(){osc(1800,'sine',0.028,0.004,0.022);},
    click(){osc(750,'square',0.038,0.003,0.02);osc(375,'sine',0.045,0.003,0.06);},
    modalOpen(){sweep(160,520,'sine',0.07,0.22);osc(520,'sine',0.05,0.01,0.28,0.18);},
    modalClose(){sweep(520,160,'sine',0.055,0.13);},
    type(){nb(3000,600,0.015,0.016);},
    del(){nb(2000,500,0.010,0.015);},
    section(){osc(440,'sine',0.05,0.018,0.32);osc(660,'sine',0.028,0.018,0.28,0.06);},
    success(){osc(440,'sine',0.06,0.01,0.10);osc(550,'sine',0.06,0.01,0.12,0.10);osc(660,'sine',0.055,0.01,0.18,0.19);},
    menuOpen(){sweep(280,560,'sine',0.05,0.13);},
    menuClose(){sweep(560,280,'sine',0.04,0.10);}
  };
  return {play(n){if(!enabled||!sounds[n])return;try{sounds[n]();}catch(_){}},toggle(){enabled=!enabled;return enabled;},get isEnabled(){return enabled;}};
})();

/* ══════════════════════════════════════════════════
   FULL-PAGE FIRE BACKGROUND (ALL COLUMNS — HIGH SPEED)
══════════════════════════════════════════════════ */
function initFireBackground() {
  const canvas = document.getElementById('fire-bg');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  const CHARS = 'ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ' +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>[]{}|/\\';
  const FONT = 13;
  let cols = [], embers = [];

  function randChar() { return CHARS[Math.floor(Math.random() * CHARS.length)]; }

  function initCols() {
    cols = [];
    const count = Math.floor(canvas.width / FONT);
    /* EVERY column is active — dense fire */
    for (let i = 0; i < count; i++) {
      const len = 10 + Math.floor(Math.random() * 30);
      cols.push({
        x:       i * FONT,
        y:       Math.random() * -canvas.height * 1.5,
        speed:   2.0 + Math.random() * 4.5,   /* 3-8x faster than v1 */
        chars:   Array.from({ length: len + 6 }, randChar),
        len,
        opacity: 0.12 + Math.random() * 0.30,  /* higher opacity — denser look */
        acc: 0,
      });
    }
  }

  function initEmbers() {
    embers = Array.from({ length: 320 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2.0,
      vy: -(1.5 + Math.random() * 3.5),
      r:  0.8 + Math.random() * 2.2,
      life: Math.random(),
      maxLife: 0.3 + Math.random() * 0.7,
      col: Math.random() < 0.5 ? '249,115,22' : Math.random() < 0.5 ? '245,158,11' : '220,38,38',
    }));
  }

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    initCols();
    initEmbers();
  }

  let lastTs = 0;
  function frame(ts) {
    const dt = Math.min(ts - lastTs, 32);
    lastTs = ts;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${FONT}px 'JetBrains Mono',monospace`;

    /* Fire matrix columns */
    cols.forEach(col => {
      col.y   += col.speed;
      col.acc += dt;
      if (col.acc > 38) {   /* very fast char mutation */
        col.acc = 0;
        col.chars[Math.floor(Math.random() * col.chars.length)] = randChar();
      }
      if (col.y > canvas.height + col.len * FONT) {
        col.y       = -(col.len * FONT + Math.random() * canvas.height * 0.4);
        col.speed   = 2.0 + Math.random() * 4.5;
        col.opacity = 0.12 + Math.random() * 0.30;
        col.len     = 10 + Math.floor(Math.random() * 30);
      }
      for (let i = 0; i < col.len; i++) {
        const cy = col.y + i * FONT;
        if (cy < -FONT || cy > canvas.height) continue;
        const isHead = i === col.len - 1;
        const pos    = i / col.len;
        const fade   = isHead ? 1 : (1 - pos) * 0.9;
        const bright = isHead ? Math.min(col.opacity * 5, 1) : col.opacity * fade;

        if (isHead) {
          ctx.fillStyle = `rgba(255,255,240,${bright})`;
        } else if (pos < 0.2) {
          ctx.fillStyle = `rgba(253,224,71,${bright})`;   /* bright gold head */
        } else if (pos < 0.5) {
          ctx.fillStyle = `rgba(245,158,11,${bright})`;   /* amber mid */
        } else if (pos < 0.75) {
          ctx.fillStyle = `rgba(249,115,22,${bright})`;   /* orange */
        } else {
          ctx.fillStyle = `rgba(180,60,9,${bright})`;     /* dark copper tail */
        }
        ctx.fillText(col.chars[i % col.chars.length], col.x, cy);
      }
    });

    /* Rising ember particles */
    embers.forEach(e => {
      e.x    += e.vx + Math.sin(ts * 0.001 + e.y * 0.01) * 0.4;
      e.y    += e.vy;
      e.life += dt / 1000;
      if (e.life > e.maxLife || e.y < -20) {
        e.x    = Math.random() * canvas.width;
        e.y    = canvas.height + 10;
        e.life = 0;
        e.maxLife = 0.3 + Math.random() * 0.7;
        e.vx   = (Math.random() - 0.5) * 2.0;
        e.vy   = -(1.5 + Math.random() * 3.5);
      }
      const alpha = Math.sin((e.life / e.maxLife) * Math.PI) * 0.75;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${e.col},${alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(frame);
}

/* ══════════════════════════════════════════════════
   BOOT SEQUENCE
══════════════════════════════════════════════════ */
function initBootSequence() {
  const screen = document.getElementById('boot-screen');
  if (!screen) return;
  if (sessionStorage.getItem('sh-booted-v2')) { screen.style.display='none'; return; }

  const logEl=document.getElementById('boot-log'), barEl=document.getElementById('boot-bar'), status=document.getElementById('boot-status');
  document.body.classList.add('no-scroll');

  /* Mini boot fire */
  const bc = document.getElementById('boot-fire');
  if (bc) {
    const bctx=bc.getContext('2d'); bc.width=window.innerWidth; bc.height=window.innerHeight;
    const BCHARS='ｦｧｨABCDEF0123456789'; const BFONT=12;
    const bcols=Array.from({length:Math.floor(bc.width/BFONT)},(_,i)=>({x:i*BFONT,y:Math.random()*-bc.height,speed:1+Math.random()*3,opacity:0.06+Math.random()*0.12}));
    (function bframe(){
      if(screen.style.display==='none')return;
      bctx.clearRect(0,0,bc.width,bc.height);
      bctx.font=`${BFONT}px 'JetBrains Mono',monospace`;
      bcols.forEach(col=>{
        col.y+=col.speed;
        if(col.y>bc.height+160)col.y=-Math.random()*bc.height;
        const pos=Math.random();
        if(pos<0.4)bctx.fillStyle=`rgba(245,158,11,${col.opacity})`;
        else if(pos<0.7)bctx.fillStyle=`rgba(249,115,22,${col.opacity})`;
        else bctx.fillStyle=`rgba(180,60,9,${col.opacity})`;
        bctx.fillText(BCHARS[Math.floor(Math.random()*BCHARS.length)],col.x,col.y);
      });
      requestAnimationFrame(bframe);
    })();
  }

  const LINES=[
    {text:'[ OK ]  Loading security modules',cls:'boot-ok'},
    {text:'[ OK ]  Initialising threat detection engine',cls:'boot-ok'},
    {text:'[ OK ]  Connecting to MITRE ATT&CK framework',cls:'boot-ok'},
    {text:'[ OK ]  Mounting cryptographic subsystems',cls:'boot-ok'},
    {text:'[ WARN] cv.pdf not found — download disabled',cls:'boot-warn'},
    {text:'[ OK ]  Fire mode activated — amber protocols online',cls:'boot-ok'},
    {text:'[ OK ]  All systems operational. Welcome.',cls:'boot-info'},
  ];

  setTimeout(()=>{if(barEl)barEl.style.width='100%';},60);
  LINES.forEach((line,i)=>{
    setTimeout(()=>{
      if(!logEl)return;
      const div=document.createElement('div');
      div.className='boot-line';
      div.innerHTML=`<span class="${line.cls}">${line.text}</span>`;
      logEl.appendChild(div);
    },280+i*310);
  });

  const dismissAt=280+LINES.length*310+350;
  setTimeout(()=>{
    if(status)status.textContent='FIRE MODE READY';
    setTimeout(()=>{
      screen.classList.add('fade-out');
      document.body.classList.remove('no-scroll');
      setTimeout(()=>{screen.style.display='none';},750);
    },420);
  },dismissAt);

  sessionStorage.setItem('sh-booted-v2','1');
}

/* ══════════════════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════════════════ */
function initCursor() {
  const dot=document.getElementById('cursor-dot'), ring=document.getElementById('cursor-ring');
  if(!dot||!ring)return;
  if(window.matchMedia('(pointer:coarse)').matches)return;
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  let mx=-100,my=-100,rx=mx,ry=my;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';});
  document.addEventListener('mouseleave',()=>{dot.style.opacity='0';ring.style.opacity='0';});
  document.addEventListener('mouseenter',()=>{dot.style.opacity='1';ring.style.opacity='1';});
  (function lerp(){rx+=(mx-rx)*0.13;ry+=(my-ry)*0.13;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(lerp);})();
  document.querySelectorAll('a,button,.project-card,.bento-cell,.contact-card,.stat-card,[role="button"],input,textarea,.copy-btn').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
  });
}

/* ══════════════════════════════════════════════════
   SCROLL PROGRESS
══════════════════════════════════════════════════ */
function initScrollProgress() {
  const bar=document.getElementById('scroll-progress');
  if(!bar)return;
  window.addEventListener('scroll',()=>{
    const total=document.documentElement.scrollHeight-window.innerHeight;
    if(total>0)bar.style.width=(window.scrollY/total*100)+'%';
  },{passive:true});
}

/* ══════════════════════════════════════════════════
   TYPING ENGINE
══════════════════════════════════════════════════ */
function initTyping() {
  const el=document.getElementById('typing-target');
  if(!el)return;
  const titles=['Junior SOC Analyst','GRC Analyst','Cyber Threat Intelligence','Detection Engineer','Blue Teamer','Security Researcher'];
  let idx=0,charIdx=0,deleting=false;
  const ST=78,SD=38,PE=2200,PS=360;
  function tick(){
    const cur=titles[idx];
    if(deleting){charIdx--;el.textContent=cur.slice(0,charIdx);SoundEngine.play('del');if(charIdx===0){deleting=false;idx=(idx+1)%titles.length;setTimeout(tick,PS);return;}setTimeout(tick,SD);}
    else{charIdx++;el.textContent=cur.slice(0,charIdx);SoundEngine.play('type');if(charIdx===cur.length){deleting=true;setTimeout(tick,PE);return;}setTimeout(tick,ST);}
  }
  setTimeout(tick,900);
}

/* ══════════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════════ */
function initNavbar() {
  const navbar=document.getElementById('navbar'), hamburger=document.getElementById('hamburger');
  const mobileMenu=document.getElementById('mobile-menu'), mobileClose=document.getElementById('mobile-close');
  if(!navbar)return;
  let lastY=0, menuOpen=false;
  window.addEventListener('scroll',()=>{
    const y=window.scrollY;
    navbar.classList.toggle('scrolled',y>60);
    if(y>lastY+6&&y>200)navbar.classList.add('hidden');
    else if(y<lastY-6)navbar.classList.remove('hidden');
    lastY=y;
  },{passive:true});

  const sections=Array.from(document.querySelectorAll('section[id]'));
  const navLinks=document.querySelectorAll('.nav-links .nav-link');
  let lastActive=null;
  function setActive(){
    const mid=window.scrollY+window.innerHeight/2;
    for(const s of sections){
      if(mid>=s.offsetTop&&mid<s.offsetTop+s.offsetHeight){
        if(s.id!==lastActive){lastActive=s.id;SoundEngine.play('section');}
        navLinks.forEach(l=>l.classList.remove('active'));
        const m=document.querySelector(`.nav-links .nav-link[href="#${s.id}"]`);
        if(m)m.classList.add('active');
        break;
      }
    }
  }
  window.addEventListener('scroll',setActive,{passive:true});
  setActive();
  navLinks.forEach(l=>{l.addEventListener('mouseenter',()=>SoundEngine.play('tick'));l.addEventListener('click',()=>SoundEngine.play('click'));});

  function openMenu(){menuOpen=true;mobileMenu.classList.add('open');mobileMenu.setAttribute('aria-hidden','false');hamburger.setAttribute('aria-expanded','true');document.body.classList.add('no-scroll');const[s1,s2,s3]=hamburger.querySelectorAll('span');s1.style.transform='rotate(45deg) translate(5px,5px)';s2.style.opacity='0';s3.style.transform='rotate(-45deg) translate(5px,-5px)';}
  function closeMenu(){menuOpen=false;mobileMenu.classList.remove('open');mobileMenu.setAttribute('aria-hidden','true');hamburger.setAttribute('aria-expanded','false');document.body.classList.remove('no-scroll');hamburger.querySelectorAll('span').forEach(s=>{s.style.transform='';s.style.opacity='';});}
  hamburger.addEventListener('click',()=>{if(menuOpen){SoundEngine.play('menuClose');closeMenu();}else{SoundEngine.play('menuOpen');openMenu();}});
  if(mobileClose)mobileClose.addEventListener('click',()=>{SoundEngine.play('menuClose');closeMenu();});
  document.querySelectorAll('.mobile-nav-link').forEach(l=>l.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuOpen)closeMenu();});
}

/* ══════════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════════ */
function initScrollReveal() {
  const els=document.querySelectorAll('.reveal');
  if(!els.length)return;
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');obs.unobserve(entry.target);}});
  },{threshold:0.10,rootMargin:'0px 0px -30px 0px'});
  els.forEach(el=>obs.observe(el));
}

/* ══════════════════════════════════════════════════
   STAT COUNT-UP
══════════════════════════════════════════════════ */
function initStatCounters() {
  const vals=document.querySelectorAll('.stat-value');
  if(!vals.length)return;
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const el=entry.target, node=el.childNodes[0];
      if(!node)return;
      const raw=node.textContent.trim(), num=parseFloat(raw);
      if(isNaN(num))return;
      const dec=raw.includes('.')?2:0, dur=1400, t0=performance.now();
      (function step(now){const p=Math.min((now-t0)/dur,1),e=1-Math.pow(1-p,3);node.textContent=(e*num).toFixed(dec);if(p<1)requestAnimationFrame(step);else node.textContent=raw;})(t0);
      obs.unobserve(el);
    });
  },{threshold:0.6});
  vals.forEach(el=>obs.observe(el));
}

/* ══════════════════════════════════════════════════
   HORIZONTAL SCROLL DRAG (PROJECTS)
══════════════════════════════════════════════════ */
function initHorizontalDrag() {
  const wrap=document.getElementById('projects-track-wrap');
  if(!wrap)return;
  let isDown=false, startX=0, scrollLeft=0;
  wrap.addEventListener('mousedown',e=>{isDown=true;startX=e.pageX-wrap.offsetLeft;scrollLeft=wrap.scrollLeft;wrap.style.userSelect='none';});
  wrap.addEventListener('mouseleave',()=>{isDown=false;});
  wrap.addEventListener('mouseup',()=>{isDown=false;wrap.style.userSelect='';});
  wrap.addEventListener('mousemove',e=>{if(!isDown)return;e.preventDefault();const x=e.pageX-wrap.offsetLeft;wrap.scrollLeft=scrollLeft-(x-startX)*1.5;});
}

/* ══════════════════════════════════════════════════
   3D CARD TILT (PROJECTS)
══════════════════════════════════════════════════ */
function initCardTilt() {
  const MAX=8;
  document.querySelectorAll('.project-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect();const dx=((e.clientX-r.left)/r.width-0.5)*2;const dy=((e.clientY-r.top)/r.height-0.5)*2;card.style.transform=`translateY(-5px) rotateX(${-dy*MAX}deg) rotateY(${dx*MAX}deg)`;});
    card.addEventListener('mouseleave',()=>{card.style.transform='';});
  });
}

/* ══════════════════════════════════════════════════
   ISC2 EXAM COUNTDOWN
══════════════════════════════════════════════════ */
function initCertCountdown() {
  const examDate=new Date('2026-06-11T09:00:00');
  const dEl=document.getElementById('cd-days'), hEl=document.getElementById('cd-hrs'), mEl=document.getElementById('cd-min');
  if(!dEl||!hEl||!mEl)return;
  function update(){
    const now=new Date(), diff=examDate-now;
    if(diff<=0){dEl.textContent='00';hEl.textContent='00';mEl.textContent='00';return;}
    const days=Math.floor(diff/864e5), hrs=Math.floor((diff%864e5)/36e5), mins=Math.floor((diff%36e5)/6e4);
    dEl.textContent=String(days).padStart(2,'0');
    hEl.textContent=String(hrs).padStart(2,'0');
    mEl.textContent=String(mins).padStart(2,'0');
  }
  update();
  setInterval(update,30000);
}

/* ══════════════════════════════════════════════════
   PROFILE PHOTO
══════════════════════════════════════════════════ */
function initProfilePhoto() {
  const img=document.getElementById('profile-img'), mono=document.getElementById('profile-monogram');
  if(!img||!mono)return;
  img.onload=()=>{img.classList.add('loaded');mono.style.display='none';};
  img.onerror=()=>{img.style.display='none';};
  if(img.complete&&img.naturalWidth>0)img.onload();
}

/* ══════════════════════════════════════════════════
   COPY EMAIL
══════════════════════════════════════════════════ */
function copyEmail(btn) {
  const text=btn.dataset.copy;
  if(!text)return;
  navigator.clipboard.writeText(text).then(()=>{SoundEngine.play('success');const icon=btn.querySelector('i');icon.className='fas fa-check';btn.classList.add('copied');setTimeout(()=>{icon.className='fas fa-copy';btn.classList.remove('copied');},2000);}).catch(()=>{const ta=document.createElement('textarea');ta.value=text;ta.style.cssText='position:fixed;opacity:0;';document.body.appendChild(ta);ta.focus();ta.select();document.execCommand('copy');document.body.removeChild(ta);});
}

/* ══════════════════════════════════════════════════
   MODAL
══════════════════════════════════════════════════ */
function initModal() {
  const overlay=document.getElementById('modal-overlay'), modal=document.getElementById('modal'), closeBtn=document.getElementById('modal-close');
  const cards=document.querySelectorAll('.project-card');
  const elIconWrap=document.getElementById('modal-icon-wrap'), elIcon=document.getElementById('modal-icon');
  const elCatLabel=document.getElementById('modal-category-label'), elTitle=document.getElementById('modal-title');
  const elDesc=document.getElementById('modal-description'), elHighWrap=document.getElementById('modal-highlights-wrap');
  const elHighList=document.getElementById('modal-highlights'), elTechWrap=document.getElementById('modal-tech-wrap');
  const elTechPills=document.getElementById('modal-tech-pills'), elMitreWrap=document.getElementById('modal-mitre-wrap');
  const elMitreGrid=document.getElementById('modal-mitre-grid'), elNote=document.getElementById('modal-note');
  const elNoteText=document.getElementById('modal-note-text'), elActions=document.getElementById('modal-actions');
  if(!overlay)return;

  function populate(id){
    const d=PROJECTS[id]; if(!d)return;
    elIconWrap.className=`modal-icon-wrap ${d.iconClass}`;
    elIcon.className=d.icon; elCatLabel.textContent=d.category; elTitle.textContent=d.title;
    elDesc.textContent=d.description;
    elHighList.innerHTML=d.highlights.map(h=>`<li>${h}</li>`).join('');
    elHighWrap.style.display=d.highlights.length?'':'none';
    elTechPills.innerHTML=d.tech.map(t=>`<span class="tech-pill">${t}</span>`).join('');
    elTechWrap.style.display=d.tech.length?'':'none';
    if(d.mitre.length){elMitreGrid.innerHTML=d.mitre.map(m=>`<span class="modal-mitre-item" title="${m.name}">${m.id} — ${m.name}</span>`).join('');elMitreWrap.style.display='';}else{elMitreWrap.style.display='none';}
    if(d.note){elNoteText.innerHTML=d.note;elNote.style.display='flex';}else{elNote.style.display='none';}
    elActions.innerHTML='';
    if(d.github){const a=document.createElement('a');a.href=d.github;a.target='_blank';a.rel='noopener noreferrer';a.className='btn-github';a.innerHTML='<i class="fab fa-github"></i> View on GitHub';elActions.appendChild(a);}
    else{const p=document.createElement('p');p.style.cssText='font-family:var(--font-mono);font-size:0.8rem;color:var(--muted);';p.textContent='// No public repository for this project.';elActions.appendChild(p);}
  }

  let lastFocused=null;
  function open(id){populate(id);SoundEngine.play('modalOpen');overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');modal.scrollTop=0;setTimeout(()=>closeBtn.focus(),100);}
  function close(){SoundEngine.play('modalClose');overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');document.body.classList.remove('no-scroll');if(lastFocused)lastFocused.focus();}

  cards.forEach(card=>{
    card.addEventListener('mouseenter',()=>SoundEngine.play('tick'));
    card.addEventListener('click',()=>{lastFocused=card;open(card.dataset.project);});
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();lastFocused=card;open(card.dataset.project);}});
  });
  closeBtn.addEventListener('click',close);
  overlay.addEventListener('click',e=>{if(e.target===overlay)close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('open'))close();});
}

/* ══════════════════════════════════════════════════
   CV BUTTON
══════════════════════════════════════════════════ */
function initCvButton() {
  const btn=document.getElementById('cv-btn');
  if(!btn)return;
  fetch('../assets/cv.pdf',{method:'HEAD'}).then(r=>{if(!r.ok)throw new Error();}).catch(()=>{btn.classList.add('unavailable');btn.removeAttribute('download');btn.removeAttribute('href');btn.title='CV coming soon';});
}

/* ══════════════════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════════════════ */
function initContactForm() {
  const form=document.getElementById('contact-form'), status=document.getElementById('form-status');
  if(!form||!status)return;
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const name=form.querySelector('#cf-name'), email=form.querySelector('#cf-email');
    const subject=form.querySelector('#cf-subject'), message=form.querySelector('#cf-message');
    let valid=true;
    [name,email,subject,message].forEach(el=>{el.classList.remove('invalid');if(!el.value.trim()){el.classList.add('invalid');valid=false;}});
    if(email.value&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)){email.classList.add('invalid');valid=false;}
    if(!valid){status.textContent='// Fill in all fields correctly.';status.className='form-note error';SoundEngine.play('modalClose');return;}
    const body=`Name: ${name.value}\nEmail: ${email.value}\n\n${message.value}`;
    window.location.href=`mailto:sm.shadman.hossain@gmail.com?subject=${encodeURIComponent(subject.value)}&body=${encodeURIComponent(body)}`;
    SoundEngine.play('success');status.textContent='// Opening your email client...';status.className='form-note success';
    setTimeout(()=>{form.reset();status.textContent='';status.className='form-note';},4000);
  });
  form.querySelectorAll('input,textarea').forEach(el=>{el.addEventListener('input',()=>el.classList.remove('invalid'));el.addEventListener('focus',()=>SoundEngine.play('tick'));});
}

/* ══════════════════════════════════════════════════
   SCROLL TO TOP
══════════════════════════════════════════════════ */
function initScrollToTop() {
  const btn=document.getElementById('scrollTop');
  if(!btn)return;
  window.addEventListener('scroll',()=>btn.classList.toggle('visible',window.scrollY>500),{passive:true});
  btn.addEventListener('mouseenter',()=>SoundEngine.play('tick'));
  btn.addEventListener('click',()=>{SoundEngine.play('click');window.scrollTo({top:0,behavior:'smooth'});});
}

/* ══════════════════════════════════════════════════
   SOUND TOGGLE
══════════════════════════════════════════════════ */
function initSoundToggle() {
  const btn=document.getElementById('soundToggle'), icon=document.getElementById('soundIcon');
  if(!btn||!icon)return;
  btn.addEventListener('click',()=>{const on=SoundEngine.toggle();icon.className=on?'fas fa-volume-up':'fas fa-volume-xmark';btn.classList.toggle('muted',!on);if(on)SoundEngine.play('tick');});
}

/* ══════════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initBootSequence();
  initFireBackground();
  initCursor();
  initScrollProgress();
  initTyping();
  initNavbar();
  initScrollReveal();
  initStatCounters();
  initHorizontalDrag();
  initCardTilt();
  initCertCountdown();
  initProfilePhoto();
  initModal();
  initCvButton();
  initContactForm();
  initScrollToTop();
  initSoundToggle();
});
