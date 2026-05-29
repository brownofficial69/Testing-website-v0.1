// ============================================================
// v11: Neural Network Portfolio
// ============================================================

const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');
const particleCanvas = document.getElementById('particle-canvas');
const particleCtx = particleCanvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
particleCanvas.width = window.innerWidth;
particleCanvas.height = window.innerHeight;

// Network data
const nodes = [
  // Core (center)
  { id: 'shadman', label: 'Shadman Hossain', type: 'core', x: null, y: null, desc: 'Cybersecurity Analyst & Threat Intelligence Specialist' },

  // Skills
  { id: 'threat-intel', label: 'Threat Intelligence', type: 'skill', desc: 'IOC Aggregation, Analysis & Correlation' },
  { id: 'detection', label: 'Detection Engineering', type: 'skill', desc: 'Sigma YAML, YARA, Splunk' },
  { id: 'grc', label: 'GRC & Compliance', type: 'skill', desc: 'NIST CSF, ISO 27001, Risk Assessment' },
  { id: 'python', label: 'Python Development', type: 'skill', desc: 'Automation, Scripting, Data Processing' },
  { id: 'golang', label: 'Go Development', type: 'skill', desc: 'Systems Programming, APIs' },
  { id: 'web-sec', label: 'Web Security', type: 'skill', desc: 'OWASP Top 10, Pentesting' },
  { id: 'cloud-sec', label: 'Cloud Security', type: 'skill', desc: 'AWS, Azure, Cloud Architecture' },
  { id: 'incident-response', label: 'Incident Response', type: 'skill', desc: 'Forensics, Root Cause Analysis' },

  // Projects
  { id: 'threatweave', label: 'ThreatWeave', type: 'project', desc: 'Threat intel correlation engine using Claude AI' },
  { id: 'secureview', label: 'SecureView', type: 'project', desc: 'SOC dashboard with real-time threat monitoring' },
  { id: 'soc-lab', label: 'SOC Detection Lab', type: 'project', desc: 'Detection engineering with Sigma rules' },
  { id: 'ioc-hunter', label: 'IOC Hunter', type: 'project', desc: 'CLI tool for aggregating indicators of compromise' },

  // Certifications
  { id: 'ccna', label: 'CCNA', type: 'cert', desc: 'Cisco Certified Network Associate' },
  { id: 'oscp', label: 'OSCP', type: 'cert', desc: 'Offensive Security Certified Professional' },
  { id: 'cism', label: 'CISM', type: 'cert', desc: 'Certified Information Security Manager' }
];

// Define connections
const connections = [
  // Core to skills
  ['shadman', 'threat-intel'],
  ['shadman', 'detection'],
  ['shadman', 'grc'],
  ['shadman', 'python'],
  ['shadman', 'golang'],
  ['shadman', 'web-sec'],
  ['shadman', 'cloud-sec'],
  ['shadman', 'incident-response'],

  // Skills to projects
  ['threat-intel', 'threatweave'],
  ['threat-intel', 'ioc-hunter'],
  ['detection', 'soc-lab'],
  ['python', 'threatweave'],
  ['python', 'ioc-hunter'],
  ['golang', 'threatweave'],
  ['web-sec', 'secureview'],
  ['incident-response', 'soc-lab'],

  // Projects to skills (bidirectional)
  ['threatweave', 'threat-intel'],
  ['secureview', 'web-sec'],
  ['soc-lab', 'detection'],
  ['ioc-hunter', 'python'],

  // Skills to certs
  ['threat-intel', 'cism'],
  ['detection', 'ccna'],
  ['web-sec', 'oscp'],
  ['incident-response', 'cism']
];

// Physics simulation
const physics = {
  repulsion: 50,
  attraction: 0.05,
  damping: 0.95,
  maxSpeed: 10
};

let isAnimating = false;
let hoveredNode = null;
let selectedNode = null;

// Initialize positions
function initializePositions() {
  nodes.forEach(node => {
    if (node.type === 'core') {
      node.x = canvas.width / 2;
      node.y = canvas.height / 2;
      node.vx = 0;
      node.vy = 0;
    } else {
      const angle = Math.random() * Math.PI * 2;
      const distance = 150 + Math.random() * 100;
      node.x = canvas.width / 2 + Math.cos(angle) * distance;
      node.y = canvas.height / 2 + Math.sin(angle) * distance;
      node.vx = (Math.random() - 0.5) * 2;
      node.vy = (Math.random() - 0.5) * 2;
    }
  });
}

// Physics update
function updatePhysics() {
  nodes.forEach((node, i) => {
    if (node.type === 'core') {
      node.vx = 0;
      node.vy = 0;
      return;
    }

    let fx = 0, fy = 0;

    // Repulsion from all nodes
    nodes.forEach((other, j) => {
      if (i === j) return;
      const dx = node.x - other.x;
      const dy = node.y - other.y;
      const dist = Math.hypot(dx, dy) || 1;
      const force = physics.repulsion / (dist * dist);
      fx += (dx / dist) * force;
      fy += (dy / dist) * force;
    });

    // Attraction to connected nodes
    const connectedIds = connections
      .filter(conn => conn[0] === node.id || conn[1] === node.id)
      .map(conn => conn[0] === node.id ? conn[1] : conn[0]);

    connectedIds.forEach(id => {
      const other = nodes.find(n => n.id === id);
      if (!other) return;
      const dx = other.x - node.x;
      const dy = other.y - node.y;
      const dist = Math.hypot(dx, dy) || 1;
      const force = physics.attraction;
      fx += (dx / dist) * force;
      fy += (dy / dist) * force;
    });

    // Apply velocity
    node.vx = (node.vx + fx) * physics.damping;
    node.vy = (node.vy + fy) * physics.damping;

    const speed = Math.hypot(node.vx, node.vy);
    if (speed > physics.maxSpeed) {
      node.vx = (node.vx / speed) * physics.maxSpeed;
      node.vy = (node.vy / speed) * physics.maxSpeed;
    }

    // Update position
    node.x += node.vx;
    node.y += node.vy;

    // Boundary damping
    const margin = 100;
    if (node.x < margin) { node.x = margin; node.vx *= -0.5; }
    if (node.x > canvas.width - margin) { node.x = canvas.width - margin; node.vx *= -0.5; }
    if (node.y < margin) { node.y = margin; node.vy *= -0.5; }
    if (node.y > canvas.height - margin) { node.y = canvas.height - margin; node.vy *= -0.5; }
  });
}

// Draw
function draw() {
  // Clear
  ctx.fillStyle = getComputedStyle(document.body).backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw connections
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--line-color');
  ctx.lineWidth = 1;
  connections.forEach(([id1, id2]) => {
    const n1 = nodes.find(n => n.id === id1);
    const n2 = nodes.find(n => n.id === id2);
    if (n1 && n2) {
      ctx.beginPath();
      ctx.moveTo(n1.x, n1.y);
      ctx.lineTo(n2.x, n2.y);
      ctx.stroke();
    }
  });

  // Draw nodes
  nodes.forEach(node => {
    const isHovered = hoveredNode?.id === node.id;
    const isSelected = selectedNode?.id === node.id;

    let radius = node.type === 'core' ? 25 : node.type === 'project' ? 12 : 10;
    if (isHovered) radius *= 1.5;
    if (isSelected) radius *= 2;

    let color;
    if (node.type === 'core') color = '#ff6b9d';
    else if (node.type === 'project') color = '#c06c84';
    else if (node.type === 'cert') color = '#355c7d';
    else color = '#6c5b7b';

    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = isHovered ? 30 : 15;
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    if (isSelected) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius + 5, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
}

// Mouse events
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  hoveredNode = null;
  nodes.forEach(node => {
    const dist = Math.hypot(node.x - x, node.y - y);
    if (dist < 30) {
      hoveredNode = node;
      updateInfoPanel(node);
      canvas.style.cursor = 'pointer';
    }
  });
  if (!hoveredNode) canvas.style.cursor = 'default';
});

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  nodes.forEach(node => {
    const dist = Math.hypot(node.x - x, node.y - y);
    if (dist < 30) {
      selectedNode = selectedNode?.id === node.id ? null : node;
    }
  });
});

// UI Updates
function updateInfoPanel(node) {
  document.getElementById('node-title').textContent = node.label;
  document.getElementById('node-desc').textContent = node.desc;

  const connected = connections
    .filter(conn => conn[0] === node.id || conn[1] === node.id)
    .map(conn => conn[0] === node.id ? conn[1] : conn[0])
    .map(id => nodes.find(n => n.id === id)?.label)
    .filter(Boolean);

  document.getElementById('node-connections').innerHTML = connected
    .map(label => `<span class="connection-tag">${label}</span>`)
    .join('');
}

// Controls
document.getElementById('reset-btn').addEventListener('click', () => {
  isAnimating = false;
  initializePositions();
  selectedNode = null;
});

document.getElementById('animate-btn').addEventListener('click', () => {
  isAnimating = !isAnimating;
  document.getElementById('animate-btn').textContent = isAnimating ? 'Stop Animation' : 'Auto-Animate';
});

document.getElementById('dark-mode').addEventListener('change', (e) => {
  document.body.classList.toggle('light-mode', !e.target.checked);
});

// Animation loop
function animate() {
  if (isAnimating) {
    updatePhysics();
  }
  draw();
  requestAnimationFrame(animate);
}

// Resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
});

// Start
initializePositions();
animate();
