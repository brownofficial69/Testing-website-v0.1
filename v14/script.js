// ============================================================
// v14: Advanced Matrix Code Rain
// ============================================================

const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Data
const PROJECTS = [
  'ThreatWeave',
  'SecureView',
  'SOC Detection',
  'IOC Hunter',
  'NIST CSF',
  'AWS Healthcare'
];

const SKILLS = [
  'Threat Intelligence',
  'Detection Engineering',
  'Python',
  'Go',
  'GRC Compliance',
  'Incident Response',
  'Web Security',
  'Cloud Security'
];

const CERTS = [
  'CCNA',
  'OSCP',
  'CISM',
  'Security+'
];

const CODE_SNIPPETS = [
  'import threats',
  'def analyze(ioc):',
  'async collect_intel()',
  'threat.correlate()',
  'detect_anomaly()',
  'class SigmaRule:',
  'redis.publish()',
  'await api.response()',
  'model.train(data)',
  'hash_indicator()',
  'validate_cert()',
  'scan_network()',
  'encrypt_token()',
  'verify_signature()'
];

// Matrix columns
let columns = [];
const charSize = 14;

// Initialize columns
function initColumns() {
  columns = [];
  const columnCount = Math.ceil(canvas.width / charSize);
  for (let i = 0; i < columnCount; i++) {
    columns.push({
      x: i * charSize,
      y: Math.random() * canvas.height,
      speed: Math.random() * 2 + 1,
      opacity: 1
    });
  }
}

// Game state
let gameState = {
  score: 0,
  level: 1,
  caughtProjects: [],
  caughtSkills: [],
  caughtCerts: [],
  isPaused: false
};

// Caught items
let caughtItems = [];

// Draw matrix
function drawMatrix() {
  // Dark fade background
  ctx.fillStyle = 'rgba(0, 17, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw columns
  columns.forEach(col => {
    // Choose random content
    let content;
    if (Math.random() > 0.7) {
      content = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
    } else {
      content = String.fromCharCode(0x30A0 + Math.random() * 96);
    }

    ctx.font = `${charSize}px 'Courier New'`;
    ctx.fillStyle = `rgba(0, 255, 0, ${col.opacity})`;
    ctx.textBaseline = 'top';
    ctx.fillText(content, col.x, col.y);

    // Update position
    col.y += col.speed;
    col.opacity -= 0.01;

    // Reset column
    if (col.y > canvas.height || col.opacity <= 0) {
      col.y = -charSize;
      col.opacity = 1;
      col.speed = Math.random() * 2 + 1;
    }
  });

  // Draw caught items with glow
  caughtItems.forEach((item, index) => {
    if (!item.alive) return;

    ctx.fillStyle = `rgba(0, 255, 0, ${item.alpha})`;
    ctx.font = `bold ${charSize}px 'Courier New'`;
    ctx.fillText(`< ${item.text} >`, item.x, item.y);

    ctx.fillStyle = `rgba(0, 255, 0, ${item.alpha * 0.5})`;
    ctx.strokeStyle = `rgba(0, 255, 0, ${item.alpha})`;
    ctx.strokeRect(item.x - 5, item.y - 5, item.text.length * 8 + 10, charSize + 10);

    item.y -= 2;
    item.alpha -= 0.02;
    item.life--;

    if (item.life <= 0) {
      item.alive = false;
    }
  });

  if (!gameState.isPaused) {
    requestAnimationFrame(drawMatrix);
  }
}

// Generate falling items
function generateFallingItems() {
  if (gameState.isPaused) return;

  const items = [...PROJECTS, ...SKILLS, ...CERTS];
  const randomItem = items[Math.floor(Math.random() * items.length)];

  const fallingItem = {
    text: randomItem,
    x: Math.random() * (canvas.width - 100),
    y: 0,
    speed: Math.random() * 2 + 1,
    caught: false,
    alpha: 1,
    life: 100
  };

  // Update caught items
  const caughtList = document.getElementById('caught-projects');
  if (!gameState.caughtProjects.includes(randomItem) && PROJECTS.includes(randomItem)) {
    gameState.caughtProjects.push(randomItem);
    const item = document.createElement('div');
    item.className = 'caught-item';
    item.textContent = `> ${randomItem}`;
    caughtList.appendChild(item);
    gameState.score += 10;
  }

  const skillList = document.getElementById('caught-skills');
  if (!gameState.caughtSkills.includes(randomItem) && SKILLS.includes(randomItem)) {
    gameState.caughtSkills.push(randomItem);
    const item = document.createElement('div');
    item.className = 'caught-item';
    item.textContent = `> ${randomItem}`;
    skillList.appendChild(item);
    gameState.score += 5;
  }

  const certList = document.getElementById('caught-certs');
  if (!gameState.caughtCerts.includes(randomItem) && CERTS.includes(randomItem)) {
    gameState.caughtCerts.push(randomItem);
    const item = document.createElement('div');
    item.className = 'caught-item';
    item.textContent = `> ${randomItem}`;
    certList.appendChild(item);
    gameState.score += 15;
  }

  updateScore();
}

// Update score display
function updateScore() {
  document.getElementById('score-value').textContent = gameState.score;
  document.getElementById('level-value').textContent = Math.floor(gameState.score / 50) + 1;
}

// Show notification
function showNotification(text) {
  const notif = document.getElementById('notification');
  notif.textContent = text;
  notif.classList.add('show');
  setTimeout(() => notif.classList.remove('show'), 2000);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    gameState.isPaused = !gameState.isPaused;
    showNotification(gameState.isPaused ? '[ PAUSED ]' : '[ RESUMED ]');
    if (!gameState.isPaused) drawMatrix();
  }
  if (e.key === 'c' || e.key === 'C') {
    generateFallingItems();
  }
  if (e.key === 'h' || e.key === 'H') {
    showNotification('↑↓←→ Move | SPACE Pause | C Catch | A About');
  }
  if (e.key === 'a' || e.key === 'A') {
    document.getElementById('about-modal').classList.add('open');
  }
  if (e.key === 'Escape') {
    closeModal();
  }
});

// Click to catch code
document.addEventListener('click', () => {
  if (!gameState.isPaused) {
    generateFallingItems();
  }
});

// Close modal
function closeModal() {
  document.getElementById('about-modal').classList.remove('open');
}

// Auto generate items
setInterval(() => {
  if (!gameState.isPaused) {
    generateFallingItems();
  }
}, 2000);

// Resize handler
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initColumns();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initColumns();
  drawMatrix();
  updateScore();
});
