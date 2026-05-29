// ============================================================
// v13: Time-Travel Portfolio
// ============================================================

const TIMELINE_DATA = {
  2020: {
    title: '2020: The Beginning',
    description: 'Started my cybersecurity journey. Began learning networking fundamentals and basic security concepts. Completed first online courses.',
    achievements: ['First NetLab', 'Intro to Cybersecurity', 'Network Basics'],
    skills: 3,
    projects: 0,
    certs: 0
  },
  2021: {
    title: '2021: Foundations',
    description: 'Deepened knowledge in threat analysis and detection engineering. Started building first security tools. Earned CCNA certification.',
    achievements: ['CCNA Certified', 'First Detection Lab', 'Threat Analysis'],
    skills: 8,
    projects: 1,
    certs: 1
  },
  2022: {
    title: '2022: Build Phase',
    description: 'Developed IOC Hunter and SOC Detection Lab. Started exploring Python automation. Completed GRC training.',
    achievements: ['IOC Hunter Released', 'Detection Lab 2.0', 'GRC Certified'],
    skills: 15,
    projects: 2,
    certs: 2
  },
  2023: {
    title: '2023: Expansion',
    description: 'Created ThreatWeave threat intelligence engine. Started using AI-assisted development with Claude API. Deepened Go knowledge.',
    achievements: ['ThreatWeave v1', 'Claude API Integration', 'Python Mastery'],
    skills: 20,
    projects: 3,
    certs: 2
  },
  2024: {
    title: '2024: Acceleration',
    description: 'Developed SecureView SOC dashboard. Contributions to open-source security projects. Earned OSCP certification.',
    achievements: ['SecureView Released', 'OSCP Certified', 'Open Source Contrib'],
    skills: 23,
    projects: 4,
    certs: 3
  },
  2025: {
    title: '2025: Mastery',
    description: 'Advanced threat intelligence systems. AWS Healthcare security case study. Started mentoring. Earned CISM certification.',
    achievements: ['AWS Case Study', 'CISM Certified', 'Mentoring Begins'],
    skills: 25,
    projects: 5,
    certs: 4
  },
  2026: {
    title: '2026: Present',
    description: 'Final year student at Coventry University. Leading security research initiatives. Building AI-powered security solutions. Portfolio includes 6 major projects.',
    achievements: ['Portfolio V9', 'AI Integration', 'Security Research'],
    skills: 25,
    projects: 6,
    certs: 4
  }
};

let currentYear = 2026;
let autoPlayInterval = null;

// Initialize timeline
function initTimeline() {
  const svg = document.getElementById('timeline-events');
  const years = Object.keys(TIMELINE_DATA);
  const eventSpacing = 1100 / (years.length - 1);

  years.forEach((year, index) => {
    const x = 50 + index * eventSpacing;
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.classList.add('timeline-event');
    group.dataset.year = year;

    // Circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', 200);
    circle.setAttribute('r', '5');

    // Year text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', 230);
    text.textContent = year;

    group.appendChild(circle);
    group.appendChild(text);
    group.onclick = () => jumpToYear(year);

    svg.appendChild(group);
  });

  updateTimeline();
}

// Update timeline display
function updateTimeline() {
  const data = TIMELINE_DATA[currentYear];

  // Update year display
  document.getElementById('year-display').textContent = currentYear;
  document.getElementById('year-slider').value = currentYear;

  // Update info panel
  document.getElementById('event-title').textContent = data.title;
  document.getElementById('event-description').textContent = data.description;

  // Update achievements
  const achievementsHtml = data.achievements
    .map(a => `<span class="achievement-badge">${a}</span>`)
    .join('');
  document.getElementById('event-achievements').innerHTML = achievementsHtml;

  // Update stats
  document.getElementById('event-stats').innerHTML = `
    <div class="stat-box">
      <div class="stat-label">Skills</div>
      <div class="stat-value">${data.skills}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Projects</div>
      <div class="stat-value">${data.projects}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Certs</div>
      <div class="stat-value">${data.certs}</div>
    </div>
  `;

  // Update timeline markers
  document.querySelectorAll('.timeline-event').forEach(event => {
    event.classList.remove('active');
    if (event.dataset.year == currentYear) {
      event.classList.add('active');
    }
  });
}

// Jump to year
function jumpToYear(year) {
  currentYear = parseInt(year);
  updateTimeline();
}

// Previous/Next year
function previousYear() {
  const years = Object.keys(TIMELINE_DATA).map(Number);
  const idx = years.indexOf(currentYear);
  if (idx > 0) {
    currentYear = years[idx - 1];
    updateTimeline();
  }
}

function nextYear() {
  const years = Object.keys(TIMELINE_DATA).map(Number);
  const idx = years.indexOf(currentYear);
  if (idx < years.length - 1) {
    currentYear = years[idx + 1];
    updateTimeline();
  }
}

// Auto-play
function toggleAutoPlay() {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
    document.getElementById('auto-play').textContent = '▶ Auto-Play';
  } else {
    document.getElementById('auto-play').textContent = '⏸ Playing...';
    autoPlayInterval = setInterval(() => {
      if (currentYear < 2026) {
        nextYear();
      } else {
        toggleAutoPlay();
      }
    }, 2000);
  }
}

// Slider event
document.getElementById('year-slider').addEventListener('input', (e) => {
  currentYear = parseInt(e.target.value);
  updateTimeline();
});

// Canvas background animation
function animateCanvas() {
  const canvas = document.getElementById('timeline-canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];

  // Create particles
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      life: Math.random() * 255,
      maxLife: 255
    });
  }

  function draw() {
    ctx.fillStyle = 'rgba(7, 7, 16, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;

      if (p.life <= 0) {
        particles[i] = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: 255,
          maxLife: 255
        };
      }

      const opacity = p.life / p.maxLife;
      ctx.fillStyle = `rgba(74, 144, 226, ${opacity * 0.3})`;
      ctx.fillRect(p.x, p.y, 2, 2);
    });

    requestAnimationFrame(draw);
  }

  draw();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initTimeline();
  animateCanvas();
});

window.addEventListener('resize', () => {
  const canvas = document.getElementById('timeline-canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
