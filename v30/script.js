/* v30: Holographic Card */
const card = document.getElementById('card');
const wrap = document.getElementById('card-wrap');
let flipped = false;

// 3D tilt + holographic shift on mouse
document.addEventListener('mousemove', e => {
  const rect = wrap.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = (e.clientX - cx) / (window.innerWidth / 2);
  const dy = (e.clientY - cy) / (window.innerHeight / 2);
  const rx = dy * 20, ry = dx * -20;
  if (!flipped) {
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  }
  // Shift holo layer based on mouse
  document.querySelectorAll('.holo-layer').forEach(h => {
    h.style.backgroundPosition = `${50 + dx * 30}% ${50 + dy * 30}%`;
  });
});

document.addEventListener('mouseleave', () => {
  if (!flipped) card.style.transform = 'rotateX(0) rotateY(0)';
});

wrap.addEventListener('click', () => {
  flipped = !flipped;
  card.classList.toggle('flipped', flipped);
  card.style.transform = flipped ? 'rotateY(180deg)' : 'rotateX(0) rotateY(0)';
});

// Particle field
const container = document.getElementById('particles');
for (let i = 0; i < 80; i++) {
  const p = document.createElement('div');
  const s = 1 + Math.random() * 2;
  p.style.cssText = `position:absolute;width:${s}px;height:${s}px;border-radius:50%;
    background:rgba(${Math.random()>0.5?'167,139,250':'99,102,241'},${0.3+Math.random()*0.5});
    left:${Math.random()*100}%;top:${Math.random()*100}%;
    animation:float${Math.floor(Math.random()*3)} ${8+Math.random()*12}s ease-in-out infinite;
    animation-delay:${-Math.random()*10}s`;
  container.appendChild(p);
}
const style = document.createElement('style');
style.textContent = `
  @keyframes float0{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,-30px)}}
  @keyframes float1{0%,100%{transform:translate(0,0)}50%{transform:translate(-25px,20px)}}
  @keyframes float2{0%,100%{transform:translate(0,0)}50%{transform:translate(15px,25px)}}
`;
document.head.appendChild(style);
