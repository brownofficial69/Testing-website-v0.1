/* v22: Neon Noir — Rain canvas */
const canvas = document.getElementById('rain');
const ctx = canvas.getContext('2d');

function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize(); window.addEventListener('resize', resize);

const drops = Array.from({ length: 180 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  len: 10 + Math.random() * 25,
  speed: 4 + Math.random() * 8,
  opacity: 0.1 + Math.random() * 0.4,
  width: 0.5 + Math.random() * 1
}));

function drawRain() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drops.forEach(d => {
    const grad = ctx.createLinearGradient(d.x, d.y, d.x + 1, d.y + d.len);
    grad.addColorStop(0, `rgba(0,255,204,0)`);
    grad.addColorStop(1, `rgba(0,255,204,${d.opacity})`);
    ctx.strokeStyle = grad;
    ctx.lineWidth = d.width;
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x + 1, d.y + d.len);
    ctx.stroke();
    d.y += d.speed;
    d.x += 0.3;
    if (d.y > canvas.height) {
      d.y = -d.len;
      d.x = Math.random() * canvas.width;
    }
  });
  requestAnimationFrame(drawRain);
}
drawRain();

// Subtle flicker on neon elements
document.querySelectorAll('.neon-link,.hero-tagline,.hero-rule,.status-dot').forEach(el => {
  setInterval(() => {
    if (Math.random() > 0.97) {
      el.style.opacity = '0.4';
      setTimeout(() => { el.style.opacity = '1'; }, 50 + Math.random() * 100);
    }
  }, 500);
});
