/* ════════════════════════════════════════════════════════════
   PROJECT DATA
   ════════════════════════════════════════════════════════════ */
const PROJECTS = {
  'threatweave': {
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

  'nist-csf': {
    title: 'NIST CSF 2.0 Gap Assessment',
    category: 'GRC / Compliance',
    icon: 'fas fa-clipboard-check',
    iconClass: 'purple-icon',
    description: 'A professional-grade GRC gap assessment for a fictional UK pharmaceutical supplier — Meridian Health Logistics Ltd — evaluated against all 6 functions of the NIST Cybersecurity Framework 2.0. This project demonstrates the analytical rigour expected of a junior GRC analyst: quantitative maturity scoring, structured gap identification, and a phased remediation roadmap aligned to business risk priorities.',
    highlights: [
      'Full assessment across all 6 CSF 2.0 functions: Govern, Identify, Protect, Detect, Respond, Recover',
      'Quantitative maturity scoring on a 1–4 scale per sub-category (current: 1.32 → target: 2.75)',
      'Two High-severity findings identified as root-cause blockers gating all other improvements',
      'Three-phase remediation roadmap spanning 0–12 months with prioritised actions',
      'UK GDPR Article 28 supplier due-diligence questionnaire for procurement',
      'SVG maturity radar chart comparing current vs target capability across all 6 functions',
      'NHS pharmaceutical sector context applied throughout — regulatory and operational risk-aware'
    ],
    tech: ['NIST CSF 2.0', 'UK GDPR Art. 28', 'ISO 27001', 'Risk Assessment', 'Supplier Due Diligence', 'Maturity Modelling'],
    mitre: [],
    github: 'https://github.com/shaddiegit/nist-csf-gap-assessment',
    note: 'This is a professional documentation set — a Markdown assessment report, SVG maturity radar chart, and supplier questionnaire. The GitHub repository contains the full deliverable.'
  },

  'aws-arch': {
    title: 'AWS Healthcare AI Triage Architecture',
    category: 'Cloud Security / Architecture Review',
    icon: 'fab fa-aws',
    iconClass: 'amber-icon',
    description: 'As team lead at Birmingham Metropolitan College, I guided a team in designing an AWS-hosted AI triage system for NHS healthcare use. Applying STRIDE threat modelling across all system components and data flows, I identified three critical legal and privacy violations — most significantly the processing of GDPR Article 9 special-category biometric and health data without a lawful basis, and an OSINT re-identification risk in the proposed data pipeline. My findings led to the strategic cancellation of the project before implementation, preventing potential ICO enforcement action.',
    highlights: [
      'Led a cross-functional team through the complete architecture design phase',
      'Applied STRIDE threat modelling to AWS S3, IAM, EC2 components, and all data flows',
      'Identified GDPR Art.9 special-category data violation before any code was written',
      'Identified OSINT re-identification risk in the proposed patient data pipeline',
      'Strategic cancellation recommendation accepted — regulatory exposure prevented',
      'Demonstrates security-first architecture thinking and GRC sequencing judgement',
      'Identified 3 critical legal/privacy violations in a single architecture review'
    ],
    tech: ['AWS (S3, IAM, EC2)', 'STRIDE Threat Modelling', 'GDPR Article 9', 'Healthcare Compliance', 'Architecture Review'],
    mitre: [],
    github: null,
    note: 'This is a case study. The project was strategically cancelled based on the threat modelling findings — there is no public codebase. The work product is an architecture threat model and risk findings report.'
  }
};

/* ════════════════════════════════════════════════════════════
   CANVAS PARTICLE ENGINE
   ════════════════════════════════════════════════════════════ */
function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animId;
  const mouse = { x: null, y: null };
  const PARTICLE_COUNT = window.innerWidth < 768 ? 50 : 90;
  const CONNECTION_DIST = 130;
  let particles = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x  = Math.random() * canvas.width;
      this.y  = initial ? Math.random() * canvas.height : (Math.random() > 0.5 ? -5 : canvas.height + 5);
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.r  = Math.random() * 1.5 + 0.4;
      this.a  = Math.random() * 0.5 + 0.1;
      const rng = Math.random();
      this.color = rng < 0.65 ? '0,255,136' : rng < 0.88 ? '0,212,255' : '124,58,237';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          const force = (90 - dist) / 90;
          this.vx += (dx / dist) * force * 0.4;
          this.vy += (dy / dist) * force * 0.4;
          const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
          if (speed > 2.2) { this.vx /= speed * 0.7; this.vy /= speed * 0.7; }
        }
      }

      if (this.x < -10 || this.x > canvas.width + 10 ||
          this.y < -10 || this.y > canvas.height + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.a})`;
      ctx.fill();
    }
  }

  function buildParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
  }

  function drawGrid() {
    ctx.strokeStyle = 'rgba(0,255,136,0.025)';
    ctx.lineWidth = 1;
    const step = 65;
    for (let x = 0; x < canvas.width; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.18;
          ctx.strokeStyle = `rgba(0,255,136,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(frame);
  }

  resize();
  buildParticles();
  frame();

  window.addEventListener('resize', () => { resize(); buildParticles(); });
  canvas.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
}

/* ════════════════════════════════════════════════════════════
   TYPING ENGINE
   ════════════════════════════════════════════════════════════ */
function initTyping() {
  const el = document.getElementById('typing-target');
  if (!el) return;

  const titles = [
    'Junior SOC Analyst',
    'GRC Analyst',
    'Cyber Threat Intelligence',
    'Detection Engineer',
    'Blue Teamer'
  ];

  let idx = 0, charIdx = 0, deleting = false;
  const SPEED_TYPE = 80, SPEED_DEL = 40, PAUSE_END = 2200, PAUSE_START = 380;

  function tick() {
    const current = titles[idx];
    if (deleting) {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
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
   GLITCH ENGINE
   ════════════════════════════════════════════════════════════ */
function initGlitch() {
  const name = document.querySelector('.hero-name');
  if (!name) return;

  function trigger() {
    name.classList.add('glitch');
    setTimeout(() => name.classList.remove('glitch'), 380);
    setTimeout(trigger, 5000 + Math.random() * 9000);
  }

  setTimeout(trigger, 3500);
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

  function setActive() {
    const mid = window.scrollY + window.innerHeight / 2;
    for (const section of sections) {
      if (mid >= section.offsetTop && mid < section.offsetTop + section.offsetHeight) {
        navLinks.forEach(l => l.classList.remove('active'));
        const match = document.querySelector(`.nav-links .nav-link[href="#${section.id}"]`);
        if (match) match.classList.add('active');
        break;
      }
    }
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

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

  hamburger.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
  mobileClose.addEventListener('click', closeMenu);

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
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    modal.scrollTop = 0;
    setTimeout(() => closeBtn.focus(), 100);
  }

  function close() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (lastFocused) lastFocused.focus();
  }

  cards.forEach(card => {
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
   BOOT
   ════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  initTyping();
  initGlitch();
  initNavbar();
  initScrollReveal();
  initSkillTags();
  initTimeline();
  initProfilePhoto();
  initModal();
  initGSAP();
});
