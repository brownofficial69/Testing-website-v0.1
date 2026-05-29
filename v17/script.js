/* ============================================================
   v17: Security Analytics Dashboard — Charts & Feed
   ============================================================ */

// Clock
function updateClock() {
  const now = new Date();
  const el = document.getElementById('clock');
  if (el) el.textContent = now.toLocaleTimeString('en-GB');
}
setInterval(updateClock, 1000);
updateClock();

// Radar chart
function drawRadar() {
  const canvas = document.getElementById('radar-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.38;

  const labels = ['Threat Intel', 'Detection', 'Python/Go', 'GRC', 'Cloud', 'IR'];
  const values = [0.95, 0.90, 0.88, 0.85, 0.80, 0.87];
  const n = labels.length;

  ctx.clearRect(0, 0, w, h);

  // Grid rings
  for (let ring = 1; ring <= 5; ring++) {
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const rr = (ring / 5) * r;
      const x = cx + Math.cos(angle) * rr;
      const y = cy + Math.sin(angle) * rr;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Axes
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.stroke();
  }

  // Data polygon
  ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const idx = i % n;
    const angle = (Math.PI * 2 * idx) / n - Math.PI / 2;
    const x = cx + Math.cos(angle) * r * values[idx];
    const y = cy + Math.sin(angle) * r * values[idx];
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(59,130,246,0.15)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(59,130,246,0.6)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Points + labels
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const x = cx + Math.cos(angle) * r * values[i];
    const y = cy + Math.sin(angle) * r * values[i];

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#3b82f6';
    ctx.fill();

    // Labels
    const lx = cx + Math.cos(angle) * (r + 24);
    const ly = cy + Math.sin(angle) * (r + 24);
    ctx.fillStyle = '#71717a';
    ctx.font = '11px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(labels[i], lx, ly);
  }
}

// Bar chart
function drawBarChart() {
  const canvas = document.getElementById('bar-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const pad = { top: 20, right: 20, bottom: 40, left: 120 };

  const data = [
    { label: 'Threat Intel', value: 95, color: '#3b82f6' },
    { label: 'Detection Eng', value: 90, color: '#a78bfa' },
    { label: 'Python / Go', value: 88, color: '#22c55e' },
    { label: 'Incident Response', value: 87, color: '#22d3ee' },
    { label: 'GRC Compliance', value: 85, color: '#eab308' },
    { label: 'Cloud Security', value: 80, color: '#ef4444' },
    { label: 'Web Security', value: 82, color: '#ec4899' }
  ];

  ctx.clearRect(0, 0, w, h);

  const barHeight = 24;
  const gap = 10;
  const chartW = w - pad.left - pad.right;

  data.forEach((d, i) => {
    const y = pad.top + i * (barHeight + gap);
    const barW = (d.value / 100) * chartW;

    // Bar background
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.fillRect(pad.left, y, chartW, barHeight);

    // Bar fill
    const gradient = ctx.createLinearGradient(pad.left, 0, pad.left + barW, 0);
    gradient.addColorStop(0, d.color);
    gradient.addColorStop(1, d.color + '80');
    ctx.fillStyle = gradient;
    ctx.fillRect(pad.left, y, barW, barHeight);

    // Label
    ctx.fillStyle = '#71717a';
    ctx.font = '11px Inter';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(d.label, pad.left - 10, y + barHeight / 2);

    // Value
    ctx.fillStyle = '#e4e4e7';
    ctx.font = '600 11px JetBrains Mono';
    ctx.textAlign = 'left';
    ctx.fillText(d.value + '%', pad.left + barW + 8, y + barHeight / 2);
  });
}

// Activity feed
const feedEvents = [
  { time: '11:42', text: 'Deployed ThreatWeave v2.1 to production', color: '#22c55e' },
  { time: '11:38', text: 'Merged SOC Detection Lab PR #47', color: '#3b82f6' },
  { time: '11:22', text: 'IOC Hunter scanned 1,247 indicators', color: '#a78bfa' },
  { time: '10:55', text: 'NIST CSF gap analysis report generated', color: '#eab308' },
  { time: '10:30', text: 'SecureView dashboard alert triage completed', color: '#22d3ee' },
  { time: '10:12', text: 'AWS threat model updated with new findings', color: '#ef4444' },
  { time: '09:45', text: 'Morning intelligence briefing reviewed', color: '#3b82f6' },
  { time: '09:20', text: 'Sigma rule coverage increased to 94%', color: '#22c55e' },
  { time: '09:00', text: 'System initialized — all services healthy', color: '#71717a' },
];

function populateFeed() {
  const feed = document.getElementById('feed');
  if (!feed) return;
  feedEvents.forEach(ev => {
    const item = document.createElement('div');
    item.className = 'feed-item';
    item.style.borderLeftColor = ev.color;
    item.innerHTML = `<span class="feed-time">${ev.time}</span><span>${ev.text}</span>`;
    feed.appendChild(item);
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  drawRadar();
  drawBarChart();
  populateFeed();

  // Animate mini-bars on load
  document.querySelectorAll('.mini-bar div').forEach(bar => {
    const target = bar.style.width;
    bar.style.width = '0%';
    setTimeout(() => { bar.style.width = target; }, 300);
  });
});
