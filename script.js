/* ════════════════════════════════════════════════════════════
   PROJECT DATA
   ════════════════════════════════════════════════════════════ */
const PROJECTS = {
  'threatweave': {
    demo: 'demos/threatweave.html',
    title: 'ThreatWeave',
    category: 'Threat Intelligence / CTI',
    icon: 'fas fa-brain',
    iconClass: 'green-icon',
    description: 'ThreatWeave is an AI-powered threat intelligence correlation engine written in Go. It aggregates Indicators of Compromise (IOCs) from multiple threat intelligence feeds and groups them into meaningful threat clusters using three prioritised signals: shared Autonomous System Number (ASN), temporal proximity of observations, and overlapping MITRE ATT&CK tactics. When configured with an Anthropic Claude API key, the engine generates professional CTI analyst narratives describing threat actor profiles, objectives, and recommended defensive measures.',
    highlights: [
      'Threat clustering by shared ASN, temporal proximity, and overlapping MITRE ATT&CK tactics',
      'AI-generated threat actor profiles and narratives using the Claude API',
      'Automated Markdown report export for stakeholder-ready intelligence products',
      'Commands: <code>correlate</code>, <code>profile</code>, <code>report</code>, <code>demo</code>',
      'Static Go binary — no runtime dependencies, deployable anywhere',
      'MIT licensed and open source'
    ],
    tech: ['Go', 'Claude AI API', 'MITRE ATT&CK', 'Goroutines', 'CTI Workflows'],
    mitre: [
      { id: 'T1071', name: 'Application Layer Protocol (C2 communications)' },
      { id: 'T1041', name: 'Exfiltration Over C2 Channel' },
      { id: 'T1190', name: 'Exploit Public-Facing Application' }
    ],
    github: 'https://github.com/shaddiegit/threatweave',
    note: null
  },

  'secureview': {
    demo: 'demos/secureview.html',
    title: 'SecureView',
    category: 'SOC Dashboard / Blue Team',
    icon: 'fas fa-desktop',
    iconClass: 'cyan-icon',
    description: 'SecureView is an AI-powered SOC analyst dashboard built with React and TypeScript. It demonstrates how modern AI can streamline security alert triage — from initial alert ingestion through to automated incident report generation with MITRE ATT&CK mapping. The dashboard features a live alert queue with realistic security scenarios, AI-driven risk scoring via the Claude API, and forensic-level raw log viewing with syntax highlighting.',
    highlights: [
      'Live alert queue featuring 5 realistic security scenarios ranked by severity',
      'Claude API integration for AI-driven risk scoring and MITRE ATT&CK mapping',
      'Automated incident report generation with executive summaries and remediation timelines',
      'IOC display with confidence ratings and categorisation (IP, domain, hash)',
      'Raw log viewer with syntax highlighting for forensic examination',
      '17 unit tests (Vitest) validating data integrity without API calls',
      'Type-safe TypeScript throughout — enforces strict typing around sensitive data'
    ],
    tech: ['TypeScript', 'React', 'Vite', 'Claude AI API', 'Vitest'],
    mitre: [
      { id: 'T1059', name: 'Command and Scripting Interpreter' },
      { id: 'T1055', name: 'Process Injection' }
    ],
    github: 'https://github.com/shaddiegit/secureview',
    note: 'This is a full web application. Clone the repo and run <code>npm install && npm run dev</code> to launch the dashboard locally. Requires an Anthropic API key for AI triage features.'
  },

  'soc-lab': {
    demo: 'demos/soc-lab.html',
    title: 'SOC Detection Lab',
    category: 'Blue Team / Detection Engineering',
    icon: 'fas fa-shield-halved',
    iconClass: 'green-icon',
    description: 'A self-contained blue team detection engineering environment that simulates a realistic 4-stage intrusion campaign against a Linux web server — reconnaissance, initial access via SSH brute-force, privilege escalation through sudo abuse, and data exfiltration. Detection rules are written in Sigma-compatible YAML and designed for direct deployment in Wazuh. The entire attack originates from a single simulated threat actor IP, enabling cross-event correlation that mirrors real SOC triage workflows.',
    highlights: [
      'Complete 4-stage kill chain simulation from a single threat actor (IP: 203.0.113.66)',
      '4 Sigma-style YAML detection rules covering the full attack sequence end-to-end',
      'Time-window correlation: brute-force source IP linked to subsequent 90 MB exfil event',
      'pytest suite with true-positive and false-positive validation for all 4 rules',
      'MITRE ATT&CK-aligned triage writeups with threshold justification per rule',
      'Wazuh-compatible output — rules deployable in a real SOC environment',
      'Analyst write-up included: structured incident narrative mirroring real SOC documentation'
    ],
    tech: ['Python', 'Sigma YAML', 'MITRE ATT&CK', 'Wazuh', 'pytest', 'Linux Auth Logs', 'Nginx'],
    mitre: [
      { id: 'T1110.001', name: 'Brute Force: Password Guessing' },
      { id: 'T1083',     name: 'File and Directory Discovery' },
      { id: 'T1548.003', name: 'Abuse Elevation Control: Sudo Caching' },
      { id: 'T1041',     name: 'Exfiltration Over C2 Channel' }
    ],
    github: 'https://github.com/shaddiegit/soc-detection-lab',
    note: null
  },

  'ioc-hunter': {
    demo: 'demos/ioc-hunter.html',
    title: 'IOC Hunter',
    category: 'Threat Intelligence / CLI Tool',
    icon: 'fas fa-magnifying-glass',
    iconClass: 'cyan-icon',
    description: 'IOC Hunter is a Python CLI tool designed for SOC Tier 1 analysts to rapidly triage Indicators of Compromise against multiple threat intelligence feeds simultaneously. It auto-detects IOC type (IPv4, domain, URL, MD5, SHA-256), queries ThreatFox, URLhaus, AbuseIPDB, and VirusTotal concurrently, normalises the responses into unified verdicts, and exports results in console, JSON, or HTML formats suitable for tickets and SOAR pipelines.',
    highlights: [
      'Concurrent querying of 4 major threat intelligence feeds for fast triage',
      'Offline-first design — works without API keys using bundled reference feeds',
      'Auto-detection of IOC type: IPv4, domain, URL, MD5 hash, SHA-256 hash',
      'Input security hardening: blocks CRLF injection, null-byte injection, and ReDoS',
      '19 automated tests covering true-positive, false-positive, and security regression cases',
      '<code>--fail-on-malicious</code> flag returns exit code 1 for CI/SOAR pipeline integration',
      'Multiple output formats: colour console, JSON (automation), HTML (ticket-friendly)'
    ],
    tech: ['Python', 'ThreatFox API', 'URLhaus API', 'AbuseIPDB API', 'VirusTotal API', 'threading', 'pytest'],
    mitre: [
      { id: 'T1566', name: 'Phishing (IOC detection workflow)' },
      { id: 'T1190', name: 'Exploit Public-Facing Application (URL/IP IOCs)' }
    ],
    github: 'https://github.com/shaddiegit/ioc-hunter',
    note: null
  },

  'adam-eve-mizan': {
    demo: 'demos/adam-eve-mizan.html',
    title: 'ADAM / EVE / Mizan',
    category: 'AI-Agent Authorization & Safety',
    icon: 'fas fa-user-shield',
    iconClass: 'purple-icon',
    description: 'A prototype exploring how to keep an autonomous AI agent inside safe authorization boundaries. Action proposals (ADAM), adversarial critique (EVE) and independent policy and execution mediation (Mizan) are deliberately kept separate, so no single component can both decide and carry out a consequential action. The work evaluates authorization boundaries, tool-use controls and persistent-memory integrity.',
    highlights: [
      'Separates action proposals, adversarial critique and independent policy/execution mediation',
      'Evaluates least privilege, execution mediation and tool-use controls',
      'Memory-integrity work, including a memory purger',
      'Reported 21/21 Phase-8 and 7/7 concept tests passing',
      '16 memory-purger tests passing (one CUDA-only skip)',
      'Retains an explicit no-go boundary for consequential autonomous use'
    ],
    tech: ['Python', 'pytest', 'Agent safety', 'Least privilege', 'Policy mediation'],
    mitre: [],
    github: 'https://github.com/brownofficial69/adam-eve-mizan',
    note: 'Research prototype, not production software. The no-go boundary for consequential autonomous use is deliberate.'
  },

  'supply-chain': {
    demo: 'demos/supply-chain-risk.html',
    title: 'Supply Chain Risk Assessment Framework',
    category: 'GRC / Third-Party Risk',
    icon: 'fas fa-diagram-project',
    iconClass: 'amber-icon',
    description: 'My dissertation project: a weighted vendor-risk model for assessing supply-chain security risk, informed by NIST SP 800-161. The model was evaluated against historical incident cases and refined through user acceptance testing with non-technical users.',
    highlights: [
      '15-criterion weighted vendor-risk scoring model',
      'Informed by NIST SP 800-161 supply-chain risk guidance',
      'Evaluated against historical supply-chain incident cases',
      'Iterated through UAT with non-technical users',
      'Implemented in VBA'
    ],
    tech: ['VBA', 'NIST SP 800-161', 'Risk modelling', 'UAT'],
    mitre: [],
    github: null,
    note: 'This was an academic dissertation (2025–2026); there is no public repository.'
  }
};

/* ════════════════════════════════════════════════════════════
   SOUND ENGINE  (Web Audio API — no external files)
   ════════════════════════════════════════════════════════════ */
const SoundEngine = (() => {
  let ctx = null;
  let enabled = false; /* sound is opt-in */

  function ac() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /* helper: one oscillator + gain with full ADSR envelope */
  function osc(freq, type, peakGain, attack, decay, startOffset = 0) {
    const c  = ac();
    const t  = c.currentTime + startOffset;
    const g  = c.createGain();
    const o  = c.createOscillator();
    o.type      = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peakGain, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
    o.connect(g);
    g.connect(c.destination);
    o.start(t);
    o.stop(t + attack + decay + 0.01);
  }

  /* helper: pitch-swept oscillator (glide from startFreq → endFreq) */
  function sweep(startFreq, endFreq, type, peakGain, duration, startOffset = 0) {
    const c = ac();
    const t = c.currentTime + startOffset;
    const g = c.createGain();
    const o = c.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(startFreq, t);
    o.frequency.exponentialRampToValueAtTime(endFreq, t + duration);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peakGain, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    o.connect(g);
    g.connect(c.destination);
    o.start(t);
    o.stop(t + duration + 0.01);
  }

  /* helper: short noise burst filtered to a band (for typing tick) */
  function noiseBurst(centreFreq, bandwidth, peakGain, duration) {
    const c      = ac();
    const t      = c.currentTime;
    const buf    = c.createBuffer(1, c.sampleRate * duration, c.sampleRate);
    const data   = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1);
    const src    = c.createBufferSource();
    src.buffer   = buf;
    const bpf    = c.createBiquadFilter();
    bpf.type     = 'bandpass';
    bpf.frequency.value = centreFreq;
    bpf.Q.value  = centreFreq / bandwidth;
    const g      = c.createGain();
    g.gain.setValueAtTime(peakGain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    src.connect(bpf);
    bpf.connect(g);
    g.connect(c.destination);
    src.start(t);
    src.stop(t + duration);
  }

  const sounds = {
    /* nav / card hover — ultra-soft high tick */
    tick()      { osc(1900, 'sine', 0.032, 0.004, 0.022); },

    /* interactive click — brief square → sine click */
    click()     {
      osc(780, 'square', 0.04, 0.003, 0.02);
      osc(390, 'sine',   0.05, 0.003, 0.06);
    },

    /* modal opening — ascending glide chord */
    modalOpen() {
      sweep(180, 560,  'sine', 0.07, 0.22);
      sweep(270, 840,  'sine', 0.04, 0.22, 0.01);   /* harmony fifth above */
      osc(560, 'sine', 0.06, 0.01, 0.30, 0.18);     /* sustain tone */
    },

    /* modal closing — short descending tick */
    modalClose() {
      sweep(560, 180, 'sine', 0.06, 0.14);
    },

    /* typing character — tiny filtered noise tick */
    type()      { noiseBurst(3200, 600, 0.018, 0.018); },

    /* typing delete — slightly lower pitch than type */
    del()       { noiseBurst(2100, 500, 0.012, 0.016); },

    /* nav section activated — soft pentatonic chime */
    section()   {
      osc(523, 'sine', 0.055, 0.018, 0.35);     /* C5 */
      osc(784, 'sine', 0.030, 0.018, 0.30, 0.06); /* G5 */
    },

    /* email copied — two-note success riff */
    success()   {
      osc(523, 'sine', 0.07, 0.01, 0.10);        /* C5 */
      osc(659, 'sine', 0.07, 0.01, 0.12, 0.10);  /* E5 */
      osc(784, 'sine', 0.06, 0.01, 0.18, 0.19);  /* G5 */
    },

    /* mobile menu open */
    menuOpen()  { sweep(320, 640, 'sine', 0.055, 0.14); },

    /* water drop: a quick downward pitch bend and a softer echo, like a bead hitting still water */
    drop()      { sweep(1500, 420, 'sine', 0.05, 0.13); osc(210, 'sine', 0.02, 0.01, 0.2, 0.05); },
    bigDrop()   { sweep(1100, 260, 'sine', 0.085, 0.24); sweep(520, 130, 'sine', 0.045, 0.4, 0.04); osc(160, 'sine', 0.03, 0.02, 0.5, 0.1); },

    /* mobile menu close */
    menuClose() { sweep(640, 320, 'sine', 0.045, 0.11); },
  };

  return {
    play(name) {
      if (!enabled || !sounds[name]) return;
      try { sounds[name](); } catch (_) {}
    },
    toggle() {
      enabled = !enabled;
      return enabled;
    },
    get isEnabled() { return enabled; }
  };
})();

function initSoundToggle() {
  const btn  = document.getElementById('soundToggle');
  const icon = document.getElementById('soundIcon');
  if (!btn || !icon) return;

  btn.addEventListener('click', () => {
    const on = SoundEngine.toggle();
    icon.className = on ? 'fas fa-volume-up' : 'fas fa-volume-xmark';
    btn.classList.toggle('muted', !on);
    /* play tick only when turning ON */
    if (on) SoundEngine.play('tick');
  });
}

/* ════════════════════════════════════════════════════════════
   CANVAS — MULTI-LAYER MATRIX ANIMATION ENGINE
   Layers (back→front):
     1. Hex grid          — pulsing hexagonal lattice
     2. Matrix rain       — falling katakana / latin / binary
     3. Radar sweep       — rotating arc (top-right)
     4. Data streams      — scrolling hex packets
     5. Particle network  — mouse-reactive nodes + connections
     6. Scan line         — bouncing horizontal glow
     7. Corner brackets   — animated terminal corners
     8. Glitch            — occasional slice displacement
   ════════════════════════════════════════════════════════════ */


/* ════════════════════════════════════════════════════════════
   TYPING ENGINE
   ════════════════════════════════════════════════════════════ */
function initTyping() {
  const el = document.getElementById('typing-target');
  if (!el) return;

  const titles = [
    'Cybersecurity Graduate',
    'AI Security',
    'Security Engineering',
    'Detection Engineering',
    'Threat Intelligence'
  ];

  let idx = 0, charIdx = 0, deleting = false;
  const SPEED_TYPE = 80, SPEED_DEL = 40, PAUSE_END = 2200, PAUSE_START = 380;

  function tick() {
    const current = titles[idx];
    if (deleting) {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      SoundEngine.play('del');
      if (charIdx === 0) {
        deleting = false;
        idx = (idx + 1) % titles.length;
        setTimeout(tick, PAUSE_START);
        return;
      }
      setTimeout(tick, SPEED_DEL);
    } else {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      SoundEngine.play('type');
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, PAUSE_END);
        return;
      }
      setTimeout(tick, SPEED_TYPE);
    }
  }

  setTimeout(tick, 900);
}



/* ════════════════════════════════════════════════════════════
   NAVBAR
   ════════════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');
  if (!navbar) return;

  let lastY = 0, menuOpen = false;

  /* Scroll: solidify + hide-on-scroll-down */
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 60);
    if (y > lastY + 6 && y > 200) {
      navbar.classList.add('hidden');
    } else if (y < lastY - 6) {
      navbar.classList.remove('hidden');
    }
    lastY = y;
  }, { passive: true });

  /* Active link highlighting */
  const sections  = Array.from(document.querySelectorAll('section[id]'));
  const navLinks  = document.querySelectorAll('.nav-links .nav-link');

  let lastActiveSection = null;
  function setActive() {
    const mid = window.scrollY + window.innerHeight / 2;
    for (const section of sections) {
      if (mid >= section.offsetTop && mid < section.offsetTop + section.offsetHeight) {
        if (section.id !== lastActiveSection) {
          lastActiveSection = section.id;
          SoundEngine.play('section');
        }
        navLinks.forEach(l => l.classList.remove('active'));
        const match = document.querySelector(`.nav-links .nav-link[href="#${section.id}"]`);
        if (match) match.classList.add('active');
        break;
      }
    }
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  /* Nav link hover tick */
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => SoundEngine.play('tick'));
    link.addEventListener('click', () => SoundEngine.play('click'));
  });

  /* Mobile menu */
  function openMenu() {
    menuOpen = true;
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    const [s1, s2, s3] = hamburger.querySelectorAll('span');
    s1.style.transform = 'rotate(45deg) translate(5px, 5px)';
    s2.style.opacity   = '0';
    s3.style.transform = 'rotate(-45deg) translate(5px, -5px)';
  }

  function closeMenu() {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    hamburger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '';
    });
  }

  hamburger.addEventListener('click', () => {
    if (menuOpen) { SoundEngine.play('menuClose'); closeMenu(); }
    else          { SoundEngine.play('menuOpen');  openMenu();  }
  });
  mobileClose.addEventListener('click', () => { SoundEngine.play('menuClose'); closeMenu(); });

  mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });
}

/* ════════════════════════════════════════════════════════════
   SCROLL REVEAL
   ════════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ════════════════════════════════════════════════════════════
   SKILL TAGS — staggered appearance
   ════════════════════════════════════════════════════════════ */
function initSkillTags() {
  const rows = document.querySelectorAll('.skill-row');
  if (!rows.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const tags = entry.target.querySelectorAll('.skill-tag');
        tags.forEach((tag, i) => {
          setTimeout(() => tag.classList.add('tag-visible'), i * 55);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  rows.forEach(row => observer.observe(row));
}

/* ════════════════════════════════════════════════════════════
   EDUCATION TIMELINE — rail draw animation
   ════════════════════════════════════════════════════════════ */
function initTimeline() {
  const tl = document.getElementById('education-timeline');
  if (!tl) return;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      tl.classList.add('tl-visible');
      observer.disconnect();
    }
  }, { threshold: 0.15 });

  observer.observe(tl);
}

/* ════════════════════════════════════════════════════════════
   PROFILE PHOTO — show on load, monogram fallback
   ════════════════════════════════════════════════════════════ */
function initProfilePhoto() {
  const img      = document.getElementById('profile-img');
  const monogram = document.getElementById('profile-monogram');
  if (!img || !monogram) return;

  img.onload = () => {
    img.classList.add('loaded');
    monogram.style.display = 'none';
  };
  img.onerror = () => {
    img.style.display = 'none';
  };

  /* Trigger load check for already-cached images */
  if (img.complete && img.naturalWidth > 0) {
    img.onload();
  }
}

/* ════════════════════════════════════════════════════════════
   COPY EMAIL
   ════════════════════════════════════════════════════════════ */
function copyEmail(btn) {
  const text = btn.dataset.copy;
  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    SoundEngine.play('success');
    const icon = btn.querySelector('i');
    icon.className = 'fas fa-check';
    btn.classList.add('copied');
    setTimeout(() => {
      icon.className = 'fas fa-copy';
      btn.classList.remove('copied');
    }, 2000);
  }).catch(() => {
    /* Fallback for older browsers */
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
}

/* ════════════════════════════════════════════════════════════
   MODAL SYSTEM
   ════════════════════════════════════════════════════════════ */
function initModal() {
  const overlay    = document.getElementById('modal-overlay');
  const modal      = document.getElementById('modal');
  const closeBtn   = document.getElementById('modal-close');
  const cards      = document.querySelectorAll('.project-card');

  const elIconWrap = document.getElementById('modal-icon-wrap');
  const elIcon     = document.getElementById('modal-icon');
  const elCatLabel = document.getElementById('modal-category-label');
  const elTitle    = document.getElementById('modal-title');
  const elDesc     = document.getElementById('modal-description');
  const elHighWrap = document.getElementById('modal-highlights-wrap');
  const elHighList = document.getElementById('modal-highlights');
  const elTechWrap = document.getElementById('modal-tech-wrap');
  const elTechPills= document.getElementById('modal-tech-pills');
  const elMitreWrap= document.getElementById('modal-mitre-wrap');
  const elMitreGrid= document.getElementById('modal-mitre-grid');
  const elNote     = document.getElementById('modal-note');
  const elNoteText = document.getElementById('modal-note-text');
  const elActions  = document.getElementById('modal-actions');

  if (!overlay) return;

  let lastFocused = null;

  function populate(id) {
    const d = PROJECTS[id];
    if (!d) return;

    /* Header */
    elIconWrap.className = `modal-icon-wrap ${d.iconClass}`;
    elIcon.className = d.icon;
    elCatLabel.textContent = d.category;
    elTitle.textContent    = d.title;

    /* Description */
    elDesc.textContent = d.description;

    /* Architecture diagram */
    const dgWrap = document.getElementById('modal-diagram-wrap'), dg = window.DIAGRAMS && window.DIAGRAMS[id];
    document.getElementById('modal-diagram').innerHTML = dg || ''; dgWrap.style.display = dg ? '' : 'none';

    /* Highlights */
    elHighList.innerHTML = d.highlights
      .map(h => `<li>${h}</li>`)
      .join('');
    elHighWrap.style.display = d.highlights.length ? '' : 'none';

    /* Tech pills */
    elTechPills.innerHTML = d.tech
      .map(t => `<span class="tech-pill">${t}</span>`)
      .join('');
    elTechWrap.style.display = d.tech.length ? '' : 'none';

    /* MITRE */
    if (d.mitre.length) {
      elMitreGrid.innerHTML = d.mitre
        .map(m => `<span class="modal-mitre-item" title="${m.name}">${m.id} — ${m.name}</span>`)
        .join('');
      elMitreWrap.style.display = '';
    } else {
      elMitreWrap.style.display = 'none';
    }

    /* Note */
    if (d.note) {
      elNoteText.innerHTML = d.note;
      elNote.style.display = 'flex';
    } else {
      elNote.style.display = 'none';
    }

    /* Action buttons */
    elActions.innerHTML = '';
    if (d.demo) {
      const demo = document.createElement('a');
      demo.href      = d.demo;
      demo.className = 'btn-github';
      demo.innerHTML = '<i class="fas fa-play"></i> Try live demo';
      elActions.appendChild(demo);
    }
    if (d.github) {
      const a = document.createElement('a');
      a.href      = d.github;
      a.target    = '_blank';
      a.rel       = 'noopener noreferrer';
      a.className = 'btn-github';
      a.innerHTML = '<i class="fab fa-github"></i> View on GitHub';
      elActions.appendChild(a);
    } else {
      const note = document.createElement('p');
      note.style.cssText = 'font-family:var(--font-mono);font-size:0.8rem;color:var(--text-muted);';
      note.textContent = '// No public repository for this project.';
      elActions.appendChild(note);
    }
  }

  function open(id) {
    populate(id);
    SoundEngine.play('modalOpen');
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    modal.scrollTop = 0;
    setTimeout(() => closeBtn.focus(), 100);
  }

  function close() {
    SoundEngine.play('modalClose');
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (lastFocused) lastFocused.focus();
  }

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => SoundEngine.play('tick'));
    card.addEventListener('click', () => {
      lastFocused = card;
      open(card.dataset.project);
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        lastFocused = card;
        open(card.dataset.project);
      }
    });
  });

  closeBtn.addEventListener('click', close);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });
}

/* ════════════════════════════════════════════════════════════
   CV BUTTON — graceful disable if PDF not present
   ════════════════════════════════════════════════════════════ */
function initCvButton() {
  const btn = document.getElementById('cv-download-btn');
  if (!btn) return;

  fetch('assets/cv.pdf', { method: 'HEAD' })
    .then(r => {
      if (!r.ok) throw new Error('not found');
    })
    .catch(() => {
      btn.classList.add('unavailable');
      btn.removeAttribute('download');
      btn.removeAttribute('href');
      btn.title = 'CV coming soon';
    });
}

/* ════════════════════════════════════════════════════════════
   CONTACT FORM — mailto fallback, no backend required
   ════════════════════════════════════════════════════════════ */
function initContactForm() {
  const form    = document.getElementById('contact-form');
  const status  = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = form.querySelector('#cf-name');
    const email   = form.querySelector('#cf-email');
    const subject = form.querySelector('#cf-subject');
    const message = form.querySelector('#cf-message');
    let valid = true;

    [name, email, subject, message].forEach(el => {
      el.classList.remove('invalid');
      if (!el.value.trim()) { el.classList.add('invalid'); valid = false; }
    });

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value && !emailRx.test(email.value)) {
      email.classList.add('invalid'); valid = false;
    }

    if (!valid) {
      status.textContent = '// Please fill in all fields correctly.';
      status.className   = 'form-note error';
      SoundEngine.play('modalClose');
      return;
    }

    const body = `Name: ${name.value}\nEmail: ${email.value}\n\n${message.value}`;
    const mailto = `mailto:sm.shadman.hossain@gmail.com`
      + `?subject=${encodeURIComponent(subject.value)}`
      + `&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;

    SoundEngine.play('success');
    status.textContent = '// Opening your email client...';
    status.className   = 'form-note success';

    setTimeout(() => {
      form.reset();
      status.textContent = '';
      status.className   = 'form-note';
    }, 4000);
  });

  /* Clear invalid state on input */
  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => el.classList.remove('invalid'));
    el.addEventListener('focus', () => SoundEngine.play('tick'));
  });
}

/* ════════════════════════════════════════════════════════════
   SCROLL TO TOP
   ════════════════════════════════════════════════════════════ */
function initScrollToTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('mouseenter', () => SoundEngine.play('tick'));
  btn.addEventListener('click', () => {
    SoundEngine.play('click');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ════════════════════════════════════════════════════════════
   GSAP ENHANCEMENTS
   ════════════════════════════════════════════════════════════ */
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  /* Section labels slide in */
  gsap.utils.toArray('.section-label').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      opacity: 0,
      x: -20,
      duration: 0.55,
      ease: 'power2.out'
    });
  });

  /* Project grid stagger enhancement (supplements CSS) */
  gsap.utils.toArray('.project-card').forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.from(card, {
          duration: 0.6,
          delay: (i % 3) * 0.07,
          ease: 'power2.out'
        });
      }
    });
  });
}



/* ════════════════════════════════════════════════════════════
   SIDE SECTION NAVIGATION DOTS
   ════════════════════════════════════════════════════════════ */
function initSectionDots() {
  const SECTIONS = [
    { id: 'hero',           label: 'Home' },
    { id: 'about',          label: 'About' },
    { id: 'skills',         label: 'Skills' },
    { id: 'projects',       label: 'Projects' },
    { id: 'education',      label: 'Education' },
    { id: 'certifications', label: 'Certs' },
    { id: 'contact',        label: 'Contact' },
  ];

  const nav = document.createElement('nav');
  nav.className = 'section-dots';
  nav.setAttribute('aria-label', 'Section navigation');

  SECTIONS.forEach(({ id, label }) => {
    const btn = document.createElement('button');
    btn.className = 'section-dot';
    btn.setAttribute('aria-label', `Go to ${label}`);
    btn.setAttribute('title', label);
    btn.dataset.section = id;
    btn.addEventListener('click', () => {
      SoundEngine.play('click');
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    });
    btn.addEventListener('mouseenter', () => SoundEngine.play('tick'));
    nav.appendChild(btn);
  });

  document.body.appendChild(nav);

  function updateDots() {
    const mid = window.scrollY + window.innerHeight * 0.5;
    let current = SECTIONS[0].id;
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el && mid >= el.offsetTop) current = id;
    });
    nav.querySelectorAll('.section-dot').forEach(d => d.classList.remove('active'));
    const dot = nav.querySelector(`[data-section="${current}"]`);
    if (dot) dot.classList.add('active');
  }

  window.addEventListener('scroll', updateDots, { passive: true });
  updateDots();
}








/* ════════════════════════════════════════════════════════════
   SCROLL PROGRESS BAR
   ════════════════════════════════════════════════════════════ */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total > 0) bar.style.width = (window.scrollY / total * 100) + '%';
  }, { passive: true });
}


/* ════════════════════════════════════════════════════════════
   STAT COUNT-UP ANIMATION
   ════════════════════════════════════════════════════════════ */
function initStatCounters() {
  const vals = document.querySelectorAll('.stat-value');
  if (!vals.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Targets come from data-count / data-decimals / data-suffix. Show the final
     value immediately for reduced motion, then animate up when scrolled into view. */
  const fmt = (el, v) =>
    v.toFixed(parseInt(el.dataset.decimals || '0', 10)) + (el.dataset.suffix || '');

  vals.forEach(el => {
    if (el.dataset.count !== undefined && reduced) el.textContent = fmt(el, parseFloat(el.dataset.count));
  });
  if (reduced) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const num = parseFloat(el.dataset.count);
      observer.unobserve(el);
      if (isNaN(num)) return;
      const dur = 1400;
      const t0  = performance.now();
      (function step(now) {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = fmt(el, (1 - Math.pow(1 - p, 3)) * num);
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    });
  }, { threshold: 0.6 });

  vals.forEach(el => { if (el.dataset.count !== undefined) observer.observe(el); });
}

/* ════════════════════════════════════════════════════════════
   BOOT
   ════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  /* The calm redesign drops the custom cursor, title glitch, click ripples, card tilt,
     magnetic buttons and the decoding hero name: motion now only confirms what you did. */
  initFX();
  initIntro();
  initSectionDots();
  initScrollProgress();
  initStatCounters();
  initTyping();
  initNavbar();
  initScrollReveal();
  initSkillTags();
  initTimeline();
  initProfilePhoto();
  initModal();
  initGSAP();
  initSoundToggle();
  initCvButton();
  initContactForm();
  initScrollToTop();
  initCinematic();
  initThemes();
});


/* ════════════════════════════════════════════════════════════
   THEME MANAGER — five themes, each drawn from the CV
   ════════════════════════════════════════════════════════════ */
const THEMES = [
  { id: 'calm',    name: 'Calm',     meta: '#f6f4ef', sw: ['#f6f4ef', '#0f6e6a', '#2a5c8c', '#1f1d1a'], quiet: true,
    why: 'Warm paper, solid surfaces and nothing moving behind the text. The default in light mode.' },
  { id: 'night',   name: 'Night',    meta: '#131416', sw: ['#131416', '#6fc2b8', '#8cb6e8', '#ecebe8'], quiet: true,
    why: 'The same quiet layout for dark rooms. The default when your device is in dark mode.' },
  { id: 'aqua',   name: 'Aqua',     meta: '#03131f', sw: ['#03131f', '#19d3e6', '#8fe3ff', '#7c8cff'],
    why: 'The water theme. Flowing currents, drifting colour and ripples that follow every touch, a nod to Galaxy S III Nature UX.' },
  { id: 'neural',  name: 'Neural',   meta: '#09051a', sw: ['#09051a', '#a58bff', '#5af0d8', '#ff7ad9'],
    why: 'A live particle network you can pull apart. tsParticles (MIT).' },
  { id: 'orbital', name: 'Orbital',  meta: '#02050d', sw: ['#02050d', '#6db7ff', '#f2c15a', '#a58bff'],
    why: 'A 3D globe over NASA night-time city lights, for threat intelligence. Vanta.js (MIT), NASA imagery.' },
  { id: 'reactor', name: 'Reactor',  meta: '#0b0204', sw: ['#0b0204', '#ff5a1f', '#ffb04a', '#ff3d7f'],
    why: 'Concentric rings in 3D, for the incident-response side. Vanta.js (MIT).' },
  { id: 'holo',    name: 'Hologram', meta: '#eaf1fc', sw: ['#eaf1fc', '#2b57d8', '#0e8fa6', '#7a3ff0'],
    why: 'A light theme: a field of points on glass. Vanta.js (MIT).' },
];

function initThemes() {
  const btn  = document.getElementById('themeBtn');
  const menu = document.getElementById('themeMenu');
  if (!btn || !menu) return;
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const byId = id => THEMES.find(t => t.id === id) || THEMES[0];

  const opt = t => `<button class="theme-opt" role="radio" aria-checked="false" data-theme-id="${t.id}">
       <span class="theme-swatch" aria-hidden="true">${t.sw.map(c => `<i style="background:${c}"></i>`).join('')}</span>
       <span><span class="theme-opt-name">${t.name}</span><span class="theme-opt-why">${t.why}</span></span>
     </button>`;
  menu.innerHTML = '<div class="theme-menu-group">Quiet</div>' + THEMES.filter(t => t.quiet).map(opt).join('') +
    '<div class="theme-menu-group">Expressive</div>' + THEMES.filter(t => !t.quiet).map(opt).join('') +
    '<a class="theme-menu-foot" href="versions.html">Browse the full design gallery</a>';

  function paint(id, save = true) {
    const th = byId(id);
    root.setAttribute('data-theme', th.id);
    if (window.FXC) window.FXC.set(th.id);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', th.meta);
    menu.querySelectorAll('.theme-opt').forEach(o => o.setAttribute('aria-checked', String(o.dataset.themeId === th.id)));
    if (save) try { localStorage.setItem('sh-theme', th.id); } catch (e) { /* storage blocked */ }
  }

  function apply(id, origin) {
    if (!document.startViewTransition || reduced()) { paint(id); return; }
    const x = origin ? origin.x : innerWidth - 40, y = origin ? origin.y : 30;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.classList.add('theme-switching');
    if (window.FXC) window.FXC.drop(x, y, 1.7);
    const vt = document.startViewTransition(() => paint(id));
    vt.finished.catch(() => {}).finally(() => root.classList.remove('theme-switching'));
    vt.ready.then(() => root.animate(
      { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 700, easing: 'cubic-bezier(.2,.8,.2,1)', pseudoElement: '::view-transition-new(root)' }
    )).catch(() => {});
  }

  const setOpen = open => {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  };

  btn.addEventListener('click', e => { e.stopPropagation(); setOpen(!menu.classList.contains('open')); });
  menu.addEventListener('click', e => {
    const opt = e.target.closest('.theme-opt');
    if (!opt) return;
    const r = btn.getBoundingClientRect();
    apply(opt.dataset.themeId, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
    setOpen(false);
    btn.focus();
  });
  document.addEventListener('click', e => { if (!menu.contains(e.target)) setOpen(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { setOpen(false); return; }
    const tag = (e.target.tagName || '').toLowerCase();
    if (e.key.toLowerCase() === 't' && !e.metaKey && !e.ctrlKey && !e.altKey && !['input', 'textarea', 'select'].includes(tag)) {
      const cur = THEMES.findIndex(t => t.id === root.getAttribute('data-theme'));
      apply(THEMES[(Math.max(cur, 0) + 1) % THEMES.length].id);
    }
  });

  paint(root.getAttribute('data-theme') || 'calm', false);
  window.SH_THEMES = { list: THEMES, apply: apply };
}





/* ════════════════════════════════════════════════════════════
   WATER-DROP ENGINE, INTRO AND CINEMATIC TRANSITIONS
   ════════════════════════════════════════════════════════════ */
function initFX() {
  const c = document.getElementById('fx');
  if (!c || !window.FX) return;
  window.FXC = window.BG.create({ canvas: c, z: 0, onDrop: (x, y, a) => SoundEngine.play(a > 1.2 ? 'bigDrop' : 'drop') });
  window.FXC.set(document.documentElement.getAttribute('data-theme') || 'aqua');
}

function initIntro() {
  const el = document.getElementById('intro');
  window.__bootDelay = 0;
  if (!el) return;
  const skip = () => { el.remove(); document.body.classList.remove('no-scroll'); };
  let seen = false; try { seen = !!sessionStorage.getItem('sh-intro'); } catch (e) { /* storage off */ }
  const aqua = document.documentElement.getAttribute('data-theme') === 'aqua';
  if (seen || !aqua || matchMedia('(prefers-reduced-motion: reduce)').matches || !window.FXC) { skip(); return; }
  try { sessionStorage.setItem('sh-intro', '1'); } catch (e) { /* storage off */ }
  document.body.classList.add('no-scroll'); window.__bootDelay = 1500;
  setTimeout(() => { window.FXC.drop(innerWidth / 2, innerHeight / 2, 2.0); el.classList.add('done'); }, 850);
  setTimeout(() => { document.body.classList.remove('no-scroll'); }, 1500);
  setTimeout(skip, 2600);
}

function initCinematic() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  /* each section eases in once: a short fade and a small rise, nothing more */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.utils.toArray('section:not(#hero) .section-inner').forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', clearProps: 'transform',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
  }
  if (!('IntersectionObserver' in window)) return;
  const seen = new Set();
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting || seen.has(e.target)) return; seen.add(e.target);
    const lbl = e.target.querySelector('.section-label, .section-title'); if (!lbl || !window.FXC) return;
    const r = lbl.getBoundingClientRect(); window.FXC.drop(r.left + 40, r.top + r.height / 2, 0.62);
  }), { threshold: 0.35 });
  document.querySelectorAll('section:not(#hero)').forEach(s => io.observe(s));
}
