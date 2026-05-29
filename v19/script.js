/* ============================================================
   v19: CyberCity — Isometric Canvas City
   ============================================================ */

const canvas = document.getElementById('city-canvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Colors
const COLORS = {
  ground: '#0a0a1a',
  grid: 'rgba(0,212,255,0.06)',
  building: ['#1a1a3e', '#1e1e45', '#22224d', '#151538'],
  window: ['#00d4ff', '#a855f7', '#ec4899', '#22c55e', '#fbbf24'],
  sky: '#070712',
  star: '#ffffff'
};

// Stars
const stars = Array.from({ length: 200 }, () => ({
  x: Math.random() * 2000,
  y: Math.random() * 800,
  size: Math.random() * 1.5 + 0.5,
  twinkle: Math.random() * Math.PI * 2
}));

// Buildings
const buildings = [];
function generateBuildings() {
  buildings.length = 0;
  const count = 40;
  for (let i = 0; i < count; i++) {
    const w = 30 + Math.random() * 50;
    const h = 60 + Math.random() * 200;
    buildings.push({
      x: (i / count) * canvas.width * 1.2 - canvas.width * 0.1,
      y: canvas.height - h - 40 + Math.random() * 20,
      w, h,
      color: COLORS.building[Math.floor(Math.random() * COLORS.building.length)],
      windows: Math.floor(h / 20),
      windowCols: Math.max(2, Math.floor(w / 15)),
      glowColor: COLORS.window[Math.floor(Math.random() * COLORS.window.length)],
      pulse: Math.random() * Math.PI * 2
    });
  }
  buildings.sort((a, b) => a.y - b.y); // Depth sort
}
generateBuildings();

// Animation
let time = 0;

function draw() {
  time += 0.016;
  ctx.fillStyle = COLORS.sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Stars
  stars.forEach(s => {
    const alpha = 0.3 + Math.sin(time * 2 + s.twinkle) * 0.3;
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fillRect(s.x % canvas.width, s.y, s.size, s.size);
  });

  // Ground gradient
  const groundY = canvas.height - 60;
  const grd = ctx.createLinearGradient(0, groundY - 20, 0, canvas.height);
  grd.addColorStop(0, 'transparent');
  grd.addColorStop(1, 'rgba(0,212,255,0.03)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, groundY - 20, canvas.width, canvas.height - groundY + 20);

  // Grid lines on ground
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;
  for (let i = 0; i < 20; i++) {
    const y = groundY + i * 4;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Buildings
  buildings.forEach(b => {
    // Building body
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.y, b.w, b.h);

    // Building outline
    ctx.strokeStyle = 'rgba(0,212,255,0.1)';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(b.x, b.y, b.w, b.h);

    // Windows
    const winW = 4, winH = 6;
    const padX = (b.w - b.windowCols * (winW + 4)) / 2 + 2;
    for (let row = 0; row < b.windows; row++) {
      for (let col = 0; col < b.windowCols; col++) {
        const wx = b.x + padX + col * (winW + 4);
        const wy = b.y + 8 + row * 16;
        if (wy > b.y + b.h - 10) continue;

        const lit = Math.sin(time + b.pulse + row * 0.5 + col) > 0.2;
        if (lit) {
          const alpha = 0.4 + Math.sin(time * 2 + row + col) * 0.2;
          ctx.fillStyle = b.glowColor + Math.floor(alpha * 255).toString(16).padStart(2, '0');
          ctx.fillRect(wx, wy, winW, winH);
          // Glow
          ctx.shadowColor = b.glowColor;
          ctx.shadowBlur = 6;
          ctx.fillRect(wx, wy, winW, winH);
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = 'rgba(255,255,255,0.03)';
          ctx.fillRect(wx, wy, winW, winH);
        }
      }
    }

    // Antenna on tall buildings
    if (b.h > 150) {
      ctx.strokeStyle = 'rgba(0,212,255,0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(b.x + b.w / 2, b.y);
      ctx.lineTo(b.x + b.w / 2, b.y - 20);
      ctx.stroke();

      // Blinking light
      const blink = Math.sin(time * 3 + b.pulse) > 0;
      if (blink) {
        ctx.fillStyle = '#ff0000';
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(b.x + b.w / 2, b.y - 20, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  });

  // Scan line effect
  const scanY = (time * 100) % canvas.height;
  ctx.strokeStyle = 'rgba(0,212,255,0.04)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, scanY);
  ctx.lineTo(canvas.width, scanY);
  ctx.stroke();

  requestAnimationFrame(draw);
}

// Clock
function updateClock() {
  const el = document.getElementById('clock');
  if (el) el.textContent = new Date().toLocaleTimeString('en-GB');
}
setInterval(updateClock, 1000);
updateClock();

// Fake ping
setInterval(() => {
  const el = document.getElementById('ping');
  if (el) el.textContent = Math.floor(8 + Math.random() * 15);
}, 2000);

// Animate bars on load
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.bcard-bar div').forEach(bar => {
    const w = bar.style.width;
    bar.style.width = '0%';
    setTimeout(() => { bar.style.width = w; }, 500);
  });
});

// Start
draw();
