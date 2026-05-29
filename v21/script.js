/* v21: Fluid — scroll reveals + mouse parallax blobs */
document.addEventListener('DOMContentLoaded', () => {
  // Reveal on scroll
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.pcard, .skill-group, .cert-blob, .contact-card, .stats-strip .stat-item')
    .forEach((el, i) => { el.style.cssText += `opacity:0;transform:translateY(30px);transition:opacity 0.6s ${i*0.05}s cubic-bezier(0.16,1,0.3,1),transform 0.6s ${i*0.05}s cubic-bezier(0.16,1,0.3,1)`; io.observe(el); });
  const style = document.createElement('style');
  style.textContent = '.visible{opacity:1!important;transform:translateY(0)!important}';
  document.head.appendChild(style);

  // Mouse parallax on blobs
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    document.querySelector('.blob-svg').style.transform = `scale(1.2) translate(${x}px,${y}px)`;
  });

  // Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); document.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior:'smooth'}); });
  });
});
